/**
 * ==============================================================================
 * TITLE:       .env.example.js (Declarative Environment Configuration Schema)
 * ARCHITECT:   L15 Principle Ultra-FAANG Systems Architect
 * EXPERIENCE:  50+ Years Legacy Systems & Hyper-scale Infrastructure Philosophy
 * COMPLIANCE:  ECMAScript Strict Mode, Clean Architecture, Type-Safe Provisioning
 * ==============================================================================
 * This is not a passive text template. This is an executable, structural 
 * specification blueprint for the Fullstack Portfolio system topology.
 */

"use strict";

const ENV_SCHEMA_SPECIFICATION = {
  // ==========================================================================
  // 1. SYSTEM DESCRIPTOR & RUNTIME ORCHESTRATION
  // ==========================================================================
  SYSTEM: {
    NODE_ENV: {
      type: "enum",
      choices: ["development", "production", "test"],
      default: "development",
      description: "Target execution environment mode for compiler optimization."
    },
    PORT: {
      type: "number",
      default: 3000,
      description: "The primary TCP port bound to the HTTP network sockets layer."
    },
    API_VERSION_PREFIX: {
      type: "string",
      default: "/api/v1",
      description: "Global base route prefix pathing for microservices ingress."
    },
    APP_LIVE_URL: {
      type: "url",
      default: "http://localhost:3000",
      description: "The fully qualified public domain URL used for absolute canonical routing."
    }
  },

  // ==========================================================================
  // 2. CRYPTOGRAPHIC UTILITIES & SECURITY MATRIX
  // ==========================================================================
  SECURITY: {
    JWT_SECRET: {
      type: "string",
      required: true,
      generator: "crypto-entropy-32",
      description: "High-entropy asymmetric string used for cryptographic JWT authorization sign/verify."
    },
    JWT_ACCESS_EXPIRATION: {
      type: "string",
      default: "15m",
      description: "Time-to-live string notation for standard ephemeral access payloads."
    },
    CORS_ALLOWED_ORIGINS: {
      type: "comma-separated-urls",
      default: "http://localhost:3000,http://localhost:3001",
      description: "Strict whitelist of origins permitted to override cross-origin resource isolation rules."
    }
  },

  // ==========================================================================
  // 3. STORAGE ENGINES & DATA LAYER ARCHITECTURE
  // ==========================================================================
  DATABASE: {
    DATABASE_URL: {
      type: "connection-string",
      required: true,
      default: "postgresql://postgres:postgres_root_pwd@localhost:5432/portfolio_db?schema=public",
      description: "Primary transactional PostgreSQL connection interface parameters URI."
    },
    REDIS_URL: {
      type: "connection-string",
      required: false,
      default: "redis://:redis_root_pwd@localhost:6379/0",
      description: "Low-latency atomic cache store connection network descriptor."
    }
  },

  // ==========================================================================
  // 4. THIRD-PARTY TELEMETRY, OAUTH & API HUB PROVIDERS
  // ==========================================================================
  PROVIDERS: {
    GITHUB_CLIENT_ID: {
      type: "string",
      required: true,
      default: "placeholder_github_oauth_client_id_node",
      description: "OAuth application unique credential identifier for user federation."
    },
    GITHUB_CLIENT_SECRET: {
      type: "string",
      required: true,
      default: "placeholder_github_oauth_client_secret_token",
      description: "Asymmetric shared key string paired to authenticate internal token exchanges."
    },
    RESEND_API_KEY: {
      type: "string",
      required: false,
      default: "re_placeholder_mail_routing_infrastructure_token",
      description: "SaaS email ingestion server token mapping to activate contact forms pipeline."
    }
  }
};

// ==============================================================================
// METAPROGRAMMING COMPILING & EXPORT LAYER (THE CLEAN ENGINE)
// ==============================================================================

/**
 * Programmatically transforms this architectural blueprint into a raw .env text stream.
 * Automatically consumed by the apex-orchestrator setup pipeline.
 */
function generateRawDotEnvString() {
  let output = `# ==============================================================================\n`;
  output += `# AUTO-GENERATED ENVIROMENT FILE FROM METAPROGRAMMING ARCHITECT BLUEPRINT\n`;
  output += `# SOURCE: scripts/.env.example.js\n`;
  output += `# GENERATED AT: ${new Date().toISOString()}\n`;
  output += `# ==============================================================================\n\n`;

  for (const [domainName, variables] of Object.entries(ENV_SCHEMA_SPECIFICATION)) {
    output += `# ------------------------------------------------------------------------------\n`;
    output += `# DOMAIN MODULE: ${domainName}\n`;
    output += `# ------------------------------------------------------------------------------\n`;
    
    for (const [key, spec] of Object.entries(variables)) {
      output += `# NOTE: ${spec.description}\n`;
      if (spec.choices) output += `# VALID OPTIONS: [${spec.choices.join(", ")}]\n`;
      if (spec.required) output += `# CRITICAL REQUIREMENT: This parameter must be unique in production!\n`;
      
      output += `${key}=${spec.default !== undefined ? spec.default : ""}\n\n`;
    }
  }
  return output;
}

// Export module definitions cleanly for structural system ingestion
module.exports = {
  specification: ENV_SCHEMA_SPECIFICATION,
  compileToRawString: generateRawDotEnvString
};

// Self-execution runtime engine hook (If invoked directly via terminal: node scripts/.env.example.js)
if (require.main === module) {
  console.log(generateRawDotEnvString());
}
