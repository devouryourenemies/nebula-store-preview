import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let tempDir;

function authHeader(token) {
  return ['Bearer', token].join(' ');
}

function jsonRequest(body, headers = {}) {
  return new Request('http://localhost/api/ops/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'nebula-ops-api-'));
  process.env.NEBULA_OPS_DB_PATH = join(tempDir, 'ops.sqlite');
  process.env.NEBULA_OPS_ADMIN_PASSWORD = 'test-password';
  process.env.HERMES_ROUTER_ENDPOINT = 'mock://hermes-router';
});

describe('Nebula Ops API routes', () => {
  it('logs in owner and uses token on thread and commerce endpoints', async () => {
    const loginRoute = await import('../app/api/ops/auth/login/route.ts');
    const threadsRoute = await import('../app/api/ops/chat/threads/route.ts');
    const inventoryRoute = await import('../app/api/ops/inventory/route.ts');

    const loginResponse = await loginRoute.POST(jsonRequest({ password: 'test-password' }));
    assert.equal(loginResponse.status, 200);
    const login = await loginResponse.json();
    assert.ok(login.token);

    const auth = { authorization: authHeader(login.token) };
    const createThreadResponse = await threadsRoute.POST(jsonRequest({ title: 'New intake' }, auth));
    assert.equal(createThreadResponse.status, 201);
    const thread = await createThreadResponse.json();
    assert.equal(thread.title, 'New intake');

    const inventoryResponse = await inventoryRoute.GET(new Request('http://localhost/api/ops/inventory', { headers: auth }));
    assert.equal(inventoryResponse.status, 200);
    const inventory = await inventoryResponse.json();
    assert.ok(Array.isArray(inventory.items));
  });

  it('routes assistant messages through the server-side Hermes adapter with catalog and Zero Labs knowledge', async () => {
    const { createOwnerSession } = await import('../lib/ops/auth.ts');
    const { createThread } = await import('../lib/ops/chat-store.ts');
    const messagesRoute = await import('../app/api/ops/chat/messages/route.ts');

    const session = await createOwnerSession('test-password');
    const thread = await createThread('Protocol support');

    const response = await messagesRoute.POST(jsonRequest(
      { threadId: thread.id, message: 'What should I know about Glow Stack and reconstitution?' },
      { authorization: authHeader(session.token) },
    ));

    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.threadId, thread.id);
    assert.match(payload.assistant.content, /Glow Stack/i);
    assert.match(payload.assistant.content, /research/i);
    assert.equal(payload.hermes.usedKnowledge.zeroLabsGuide, true);
    assert.equal(payload.hermes.usedKnowledge.productCatalog, true);
  });
});

afterEach(() => {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});
