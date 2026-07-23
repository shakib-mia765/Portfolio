import type { Express } from 'express';
import request, { type Response } from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/components/server.js';

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
} as const;
const PATH = {
  health: '/health',
  contact: '/api/contact',
  missing: '/__integration__/missing',
} as const;
const REQUEST_ID_HEADER = 'x-request-id';
const REQUEST_ID = 'integration-request-01';
const JSON_CONTENT_TYPE = /^application\/json\b/i;
const VALID_REQUEST_ID = /^[a-zA-Z0-9._:-]{8,128}$/;
type ErrorBody = {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
  };
};
type HealthBody = {
  status?: string;
  timestamp?: string;
  uptime?: number;
};
function expectJson(response: Response): void {
  expect(response.headers['content-type']).toMatch(JSON_CONTENT_TYPE);
}
function expectNoSensitiveData(response: Response): void {
  const body = JSON.stringify(response.body).toLowerCase();
  for (const value of [
    'node_modules',
    'database_url',
    'authorization',
    'bearer ',
    'password',
    '"stack"',
  ]) {
    expect(body).not.toContain(value);
  }
}
function expectRequestId(response: Response): string {
  const requestId = response.headers[REQUEST_ID_HEADER];
  expect(requestId).toBeTypeOf('string');
  expect(requestId).toMatch(VALID_REQUEST_ID);

  return requestId;
}
describe('Node Express ingress', () => {
  let app: Express;
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const application = await createApp();
    if (
      typeof application !== 'function' ||
      typeof application.use !== 'function'
    ) {
      throw new TypeError(
        'createApp() must return a configured Express application.',
      );
    }
    app = application;
  });
  describe('health', () => {
    it('returns a valid machine-readable health response', async () => {
      const response = await request(app)
        .get(PATH.health)
        .set('accept', 'application/json')
        .expect(STATUS.OK);
      expectJson(response);
      expect(response.body).toEqual(
        expect.objectContaining<HealthBody>({
          status: expect.stringMatching(/^(ok|healthy|ready)$/i),
        }),
      );
      if (response.body.timestamp !== undefined) {
        expect(Date.parse(String(response.body.timestamp))).not.toBeNaN();
      }
      if (response.body.uptime !== undefined) {
        expect(response.body.uptime).toEqual(expect.any(Number));
        expect(response.body.uptime).toBeGreaterThanOrEqual(0);
      }
    });
    it('does not expose internal runtime details', async () => {
      const response = await request(app)
        .get(PATH.health)
        .expect(STATUS.OK);
      expectNoSensitiveData(response);
      expect(response.body).not.toHaveProperty('environment');
      expect(response.body).not.toHaveProperty('process');
      expect(response.body).not.toHaveProperty('memory');
      expect(response.body).not.toHaveProperty('dependencies.database.url');
    });
  });
  describe('request correlation', () => {
    it('preserves a valid inbound request ID', async () => {
      const response = await request(app)
        .get(PATH.health)
        .set(REQUEST_ID_HEADER, REQUEST_ID)
        .expect(STATUS.OK);

      expect(response.headers[REQUEST_ID_HEADER]).toBe(REQUEST_ID);
    });
    it('generates a request ID when none is supplied', async () => {
      const response = await request(app)
        .get(PATH.health)
        .expect(STATUS.OK);
      expectRequestId(response);
    });
    it('replaces an invalid inbound request ID', async () => {
      const invalidRequestId = 'invalid request id with spaces';

      const response = await request(app)
        .get(PATH.health)
        .set(REQUEST_ID_HEADER, invalidRequestId)
        .expect(STATUS.OK);
      expect(expectRequestId(response)).not.toBe(invalidRequestId);
    });
    it('assigns unique IDs to concurrent requests', async () => {
      const responses = await Promise.all(
        Array.from({ length: 12 }, () =>
          request(app).get(PATH.health).expect(STATUS.OK),
        ),
      );
      const requestIds = responses.map(expectRequestId);
      expect(new Set(requestIds).size).toBe(requestIds.length);
    });
  });
  describe('security headers', () => {
    it('applies baseline HTTP security headers', async () => {
      const response = await request(app)
        .get(PATH.health)
        .expect(STATUS.OK);
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toMatch(
        /^(DENY|SAMEORIGIN)$/,
      );
      expect(response.headers['referrer-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['x-powered-by']).toBeUndefined();
    });
    it('does not allow credentialed wildcard CORS', async () => {
      const untrustedOrigin = 'https://untrusted.example.test';
      const response = await request(app)
        .options(PATH.health)
        .set('origin', untrustedOrigin)
        .set('access-control-request-method', 'GET');
      const origin = response.headers['access-control-allow-origin'];
      const credentials =
        response.headers['access-control-allow-credentials'];
      expect(origin === '*' && credentials === 'true').toBe(false);
      if (origin !== undefined) {
        expect(origin).not.toBe(untrustedOrigin);
      }
    });
  });
  describe('request parsing', () => {
    it('returns 400 for malformed JSON', async () => {
      const response = await request(app)
        .post(PATH.contact)
        .set('content-type', 'application/json')
        .send('{"name":"Shakib","message":')
        .expect(STATUS.BAD_REQUEST);

      expectJson(response);
      expectNoSensitiveData(response);
      expect(response.body).toEqual(
        expect.objectContaining<ErrorBody>({
          success: false,
          error: expect.objectContaining({
            code: expect.stringMatching(
              /^(INVALID_JSON|MALFORMED_JSON|BAD_REQUEST)$/i,
            ),
            message: expect.any(String),
          }),
        }),
      );
    });
    it('returns 413 for an oversized request body', async () => {
      const response = await request(app)
        .post(PATH.contact)
        .set('content-type', 'application/json')
        .send({
          name: 'Integration Test',
          email: 'integration@example.test',
          message: 'x'.repeat(1_100_000),
        })
        .expect(STATUS.PAYLOAD_TOO_LARGE);
      expectJson(response);
      expectNoSensitiveData(response);
      expect(response.body).toEqual(
        expect.objectContaining<ErrorBody>({
          success: false,
          error: expect.objectContaining({
            code: expect.stringMatching(
              /^(PAYLOAD_TOO_LARGE|BODY_TOO_LARGE|REQUEST_TOO_LARGE)$/i,
            ),
          }),
        }),
      );
    });
  });
  describe('routing', () => {
    it('returns a stable JSON error for an unknown route', async () => {
      const response = await request(app)
        .get(PATH.missing)
        .set(REQUEST_ID_HEADER, REQUEST_ID)
        .expect(STATUS.NOT_FOUND);
      expectJson(response);
      expectNoSensitiveData(response);
      expect(response.body).toEqual(
        expect.objectContaining<ErrorBody>({
          success: false,
          error: expect.objectContaining({
            code: expect.stringMatching(
              /^(NOT_FOUND|ROUTE_NOT_FOUND|RESOURCE_NOT_FOUND)$/i,
            ),
            message: expect.any(String),
          }),
        }),
      );
      if (response.body.error?.requestId !== undefined) {
        expect(response.body.error.requestId).toBe(REQUEST_ID);
      }
    });
    it('does not return the frontend HTML fallback for an API miss', async () => {
      const response = await request(app)
        .get(PATH.missing)
        .set('accept', 'text/html')
        .expect(STATUS.NOT_FOUND);
      expect(response.headers['content-type']).not.toMatch(/^text\/html\b/i);
      expect(response.text).not.toContain('<!DOCTYPE html>');
    });
    it('does not accept unsupported health methods', async () => {
      const response = await request(app).post(PATH.health).send({});
      expect([
        STATUS.NOT_FOUND,
        STATUS.METHOD_NOT_ALLOWED,
      ]).toContain(response.status);
      expect(response.status).not.toBe(STATUS.OK);
      expect(response.status).not.toBe(STATUS.INTERNAL_SERVER_ERROR);
    });
  });
  describe('resilience', () => {
    it('remains healthy after processing malformed input', async () => {
      await request(app)
        .post(PATH.contact)
        .set('content-type', 'application/json')
        .send('{"broken":')
        .expect(STATUS.BAD_REQUEST);

      const response = await request(app)
        .get(PATH.health)
        .expect(STATUS.OK);
      expect(response.body.status).toMatch(/^(ok|healthy|ready)$/i);
    });
  });
});
