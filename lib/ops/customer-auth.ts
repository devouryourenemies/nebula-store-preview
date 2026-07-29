import { getOpsDb, newId, nowIso } from './db';
import { createHash, randomUUID } from 'node:crypto';

export type CustomerAccount = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
};

export type CustomerSession = {
  token: string;
  customerId: string;
  createdAt: string;
};

export type CustomerOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items: {
    productSlug: string;
    quantity: number;
    unitPriceCents: number;
  }[];
};

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function ensureCustomerTables() {
  const db = getOpsDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS customer_accounts (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
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
  `);
}

export async function registerCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string
): Promise<CustomerAccount> {
  ensureCustomerTables();
  const db = getOpsDb();

  const existing = db
    .prepare('SELECT id FROM customer_accounts WHERE email = ?')
    .get(email);
  if (existing) {
    throw new Error('email already registered');
  }

  const id = newId('cust');
  const passwordHash = hashPassword(password);
  const createdAt = nowIso();

  db.prepare(
    'INSERT INTO customer_accounts (id, email, password_hash, first_name, last_name, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, email, passwordHash, firstName, lastName, phone, createdAt);

  return {
    id,
    email,
    firstName,
    lastName,
    phone,
    createdAt,
  };
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<CustomerSession> {
  ensureCustomerTables();
  const db = getOpsDb();

  const row = db
    .prepare('SELECT id, password_hash FROM customer_accounts WHERE email = ?')
    .get(email) as { id: string; password_hash: string } | undefined;

  if (!row) {
    throw new Error('invalid email or password');
  }

  if (row.password_hash !== hashPassword(password)) {
    throw new Error('invalid email or password');
  }

  const token = randomUUID().replace(/-/g, '') + randomUUID().replace(/-/g, '');
  const createdAt = nowIso();

  db.prepare('INSERT INTO customer_sessions (token, customer_id, created_at) VALUES (?, ?, ?)').run(
    token,
    row.id,
    createdAt
  );

  return { token, customerId: row.id, createdAt };
}

export async function verifyCustomerSession(
  token: string
): Promise<CustomerAccount | null> {
  ensureCustomerTables();
  const db = getOpsDb();

  const row = db
    .prepare(
      `SELECT a.id, a.email, a.first_name, a.last_name, a.phone, a.created_at
       FROM customer_accounts a
       JOIN customer_sessions s ON s.customer_id = a.id
       WHERE s.token = ?`
    )
    .get(token) as
    | {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        created_at: string;
      }
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export async function getCustomerOrders(
  customerId: string
): Promise<CustomerOrder[]> {
  const db = getOpsDb();

  const rows = db
    .prepare(
      'SELECT id, customer_name, customer_email, status, total_cents, created_at FROM orders WHERE customer_email = (SELECT email FROM customer_accounts WHERE id = ?) ORDER BY created_at DESC'
    )
    .all(customerId) as Record<string, unknown>[];

  const orders: CustomerOrder[] = [];

  for (const row of rows) {
    const orderId = String(row.id);
    const items = db
      .prepare('SELECT product_slug, quantity, unit_price_cents FROM order_items WHERE order_id = ?')
      .all(orderId)
      .map((item: Record<string, unknown>) => ({
        productSlug: String(item.product_slug),
        quantity: Number(item.quantity),
        unitPriceCents: Number(item.unit_price_cents),
      }));

    orders.push({
      id: orderId,
      customerName: String(row.customer_name),
      customerEmail: String(row.customer_email),
      status: String(row.status),
      totalCents: Number(row.total_cents),
      createdAt: String(row.created_at),
      items,
    });
  }

  return orders;
}
