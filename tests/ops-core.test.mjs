import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let tempDir;
let dbPath;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'nebula-ops-'));
  dbPath = join(tempDir, 'ops.sqlite');
  process.env.NEBULA_OPS_DB_PATH = dbPath;
  process.env.NEBULA_OPS_ADMIN_PASSWORD = 'test-password';
  process.env.HERMES_ROUTER_ENDPOINT = 'mock://hermes-router';
});

describe('Nebula Ops core persistence', () => {
  it('creates an authenticated owner session and rejects bad credentials', async () => {
    const { createOwnerSession, verifyOwnerSession } = await import('../lib/ops/auth.ts');

    await assert.rejects(() => createOwnerSession('wrong-password'), /invalid/i);

    const session = await createOwnerSession('test-password');
    assert.equal(typeof session.token, 'string');
    assert.ok(session.token.length >= 32);

    const verified = await verifyOwnerSession(session.token);
    assert.equal(verified.role, 'owner');
  });

  it('persists separate chat threads with ordered messages', async () => {
    const { createThread, addMessage, listThreads, listMessages } = await import('../lib/ops/chat-store.ts');

    const first = await createThread('COA questions');
    const second = await createThread('Inventory planning');

    await addMessage(first.id, 'owner', 'How should Glow Stack be positioned?');
    await addMessage(first.id, 'assistant', 'Use research-only recovery language.');
    await addMessage(second.id, 'owner', 'How many Tirzepatide vials are left?');

    const threads = await listThreads();
    assert.deepEqual(threads.map((thread) => thread.title), ['Inventory planning', 'COA questions']);

    const messages = await listMessages(first.id);
    assert.deepEqual(messages.map((message) => message.role), ['owner', 'assistant']);
    assert.deepEqual(messages.map((message) => message.content), [
      'How should Glow Stack be positioned?',
      'Use research-only recovery language.',
    ]);
  });

  it('seeds product catalog, tracks inventory adjustments, and creates orders', async () => {
    const { seedCatalog, listProducts, adjustInventory, listInventory, createOrder, listOrders } = await import('../lib/ops/commerce-store.ts');

    await seedCatalog();
    const products = await listProducts();
    assert.equal(products.length, 5);
    assert.ok(products.some((product) => product.slug === 'glow-stack'));

    await adjustInventory('glow-stack', 12, 'initial stock');
    await adjustInventory('glow-stack', -2, 'sample allocation');

    const inventory = await listInventory();
    const glow = inventory.find((item) => item.slug === 'glow-stack');
    assert.equal(glow.quantityOnHand, 10);

    const order = await createOrder({
      customerName: 'Zero Labs Wholesale',
      customerEmail: 'ops@example.com',
      items: [{ productSlug: 'glow-stack', quantity: 2, unitPriceCents: 19900 }],
    });
    assert.equal(order.status, 'pending');
    assert.equal(order.totalCents, 39800);

    const orders = await listOrders();
    assert.equal(orders.length, 1);
    assert.equal(orders[0].customerName, 'Zero Labs Wholesale');
  });
});

afterEach(() => {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});
