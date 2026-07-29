import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

type SqlValue = string | number | null;

type StatementLike = {
  run: (...values: SqlValue[]) => unknown;
  get: (...values: SqlValue[]) => Record<string, unknown> | undefined;
  all: (...values: SqlValue[]) => Record<string, unknown>[];
};

type DatabaseLike = {
  exec: (sql: string) => void;
  prepare: (sql: string) => StatementLike;
};

type DatabaseConstructor = new (path: string) => DatabaseLike;

type CachedDb = {
  path: string;
  db: DatabaseLike;
};

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: DatabaseConstructor };

let cached: CachedDb | null = null;

function defaultDbPath() {
  return join(process.cwd(), '.nebula-ops', 'ops.sqlite');
}

export function getOpsDb() {
  const path = process.env.NEBULA_OPS_DB_PATH || defaultDbPath();
  if (cached?.path === path) return cached.db;

  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS owner_sessions (
      token TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_threads (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(thread_id) REFERENCES chat_threads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      category TEXT NOT NULL,
      dosage TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      summary TEXT NOT NULL,
      unit_price_cents INTEGER NOT NULL DEFAULT 0,
      compliance_disclaimer TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory_adjustments (
      id TEXT PRIMARY KEY,
      product_slug TEXT NOT NULL,
      delta INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(product_slug) REFERENCES products(slug)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      status TEXT NOT NULL,
      total_cents INTEGER NOT NULL,
      shipping_address TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_slug TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price_cents INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY(product_slug) REFERENCES products(slug)
    );

    CREATE TABLE IF NOT EXISTS customer_accounts (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customer_sessions (
      token TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(customer_id) REFERENCES customer_accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS coa_batches (
      batch_number TEXT PRIMARY KEY,
      product_slug TEXT NOT NULL,
      lab_name TEXT NOT NULL DEFAULT 'Janoshik Analytical',
      test_date TEXT NOT NULL,
      purity_pct REAL,
      heavy_metals_pass INTEGER NOT NULL DEFAULT 1,
      endotoxins_pass INTEGER NOT NULL DEFAULT 1,
      sterility_pass INTEGER NOT NULL DEFAULT 1,
      report_url TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY(product_slug) REFERENCES products(slug)
    );
  `);

  cached = { path, db };
  return db;
}

export function nowIso() {
  return new Date().toISOString();
}

export function newId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}
