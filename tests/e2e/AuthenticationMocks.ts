/**
 * ==============================================================================
 * TITLE:       AuthenticationMocks.ts (Enterprise E2E Authentication Engine)
 * ARCHITECT:   L15 Principle Ultra-FAANG Systems Architect
 * EXPERIENCE:  50+ Years Legacy Systems & Hyper-scale Infrastructure Philosophy
 * COMPLIANCE:  TypeScript Strict Mode, Hexagonal Domain Testing, Clean Architecture
 * ==============================================================================
 * This file is an executable, stateful mock engine that completely isolates 
 * the E2E boundary from downstream auth providers (Auth0, Firebase, Custom OAuth).
 */

import { Buffer } from 'buffer';

// ==============================================================================
// 1. DOMAIN INTERFACES & STRUCTURAL CONTRACTS
// ==============================================================================

export type SecurityRole = 'ANONYMOUS' | 'GUEST_DEVELOPER' | 'ADMIN_CORE' | 'SYSTEM_AUTOMATION';

export interface UserSessionProfile {
  id: string;
  email: string;
  fullName: string;
  role: SecurityRole;
  permissions: string[];
  tenantId: string;
}

export interface MockTokenPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  profile: UserSessionProfile;
  mfaVerified: boolean;
}

export interface NetworkInterceptMockResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

// ==============================================================================
// 2. CRYPTOGRAPHIC TOKEN GENERATOR ADAPTER (PURE IN-MEMORY ENGINE)
// ==============================================================================

export class CryptographicMockTokenEngine {
  private static readonly ALGORITHM_HEADER = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString('base64url');

  /**
   * Generates a structural base64url signed JWT-mock signature without external server IO.
   * Maintains perfect format compliance to satisfy frontend routing guards and interceptors.
   */
  public static mintEphemeralToken(profile: UserSessionProfile, lifespanSeconds = 900, overrides: Partial<MockTokenPayload> = {}): string {
    const currentTime = Math.floor(Date.now() / 1000);
    
    const payload: MockTokenPayload = {
      iss: "https://auth.ultra-faang-portfolio.internal",
      sub: profile.id,
      aud: "https://api.ultra-faang-portfolio.internal",
      iat: currentTime,
      nbf: currentTime,
      exp: currentTime + lifespanSeconds,
      jti: `mock_jti_${Buffer.from(Math.random().toString()).toString('hex')}`,
      mfaVerified: true,
      profile,
      ...overrides
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const structuralSignature = Buffer.from(`${this.ALGORITHM_HEADER}.${encodedPayload}.MOCK_SIGNATURE_VERIFIED`).toString('base64url');

    return `${this.ALGORITHM_HEADER}.${encodedPayload}.${structuralSignature}`;
  }
}

// ==============================================================================
// 3. SEPARATION OF CONCERNS: SIMULATED IDENTITY STATE PRESETS
// ==============================================================================

export const MockIdentityRegistry = {
  /**
   * Complete Super-Admin access context for destructive E2E management test suites.
   */
  getAdminUser: (): UserSessionProfile => ({
    id: "usr_l15_god_mode_001",
    email: "architect.core@faang.internal",
    fullName: "L15 Principle Architect",
    role: "ADMIN_CORE",
    permissions: ["system:write", "analytics:read", "database:purge", "auth:override"],
    tenantId: "tenant_primary_global_01"
  }),

  /**
   * Standard public-tier user testing profile.
   */
  getGuestDeveloper: (): UserSessionProfile => ({
    id: "usr_guest_dev_777",
    email: "junior.dev@github.com",
    fullName: "Anonymous Tech Recruiter",
    role: "GUEST_DEVELOPER",
    permissions: ["portfolio:read", "contact:write"],
    tenantId: "tenant_public_sandbox"
  })
};

// ==============================================================================
// 4. THE CORE MOCK ORCHESTRATOR (THE CONTROL INTERFACE)
// ==============================================================================

export class AuthenticationMockEngine {
  
  /**
   * Generates standard payload blocks satisfying network intercepts for automated test contexts.
   */
  public static createMockAuthSuccessState(role: SecurityRole = 'ADMIN_CORE'): NetworkInterceptMockResponse {
    const profile = role === 'ADMIN_CORE' 
      ? MockIdentityRegistry.getAdminUser() 
      : MockIdentityRegistry.getGuestDeveloper();
      
    const accessToken = CryptographicMockTokenEngine.mintEphemeralToken(profile);
    const refreshToken = `mock_ref_token_${Buffer.from(profile.id).toString('base64url')}`;

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Simulation-Engine": "Ultra-FAANG-L15-MockCore"
      },
      body: JSON.stringify({
        success: true,
        accessToken,
        refreshToken,
        expiresIn: 900,
        tokenType: "Bearer"
      })
    };
  }

  /**
   * Simulates explicit authentication lifecycle disruptions (Expired sessions, security challenges).
   */
  public static createMockAuthFailureState(reason: 'TOKEN_EXPIRED' | 'BAD_CREDENTIALS' | 'MFA_REQUIRED'): NetworkInterceptMockResponse {
    switch (reason) {
      case 'TOKEN_EXPIRED':
        return {
          status: 401,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: "ERR_AUTH_TOKEN_EXPIRED", message: "Cryptographic lease expired." })
        };
      case 'MFA_REQUIRED':
        return {
          status: 403,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: "ERR_MFA_STEP_UP_REQUIRED",
            message: "Multi-Factor validation vector unverified.",
            mfaTicket: "mfa_ticket_challenge_validation_991823"
          })
        };
      case 'BAD_CREDENTIALS':
      default:
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: "ERR_INVALID_CREDENTIALS", message: "Handshake identity mismatch." })
        };
    }
  }

  /**
   * Synthesizes an expired authentication token context to evaluate fallback auto-refresh loops.
   */
  public static createExpiredTokenState(): string {
    const baselineProfile = MockIdentityRegistry.getGuestDeveloper();
    // Setting back-dated expiration metrics to force target system triggers
    return CryptographicMockTokenEngine.mintEphemeralToken(baselineProfile, -3600); 
  }
}
