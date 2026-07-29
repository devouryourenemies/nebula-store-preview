import { complianceDisclaimer, products } from '../products';
import { getOpsDb, newId, nowIso } from './db';

export type OpsProduct = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  dosage: string;
  subtitle: string;
  summary: string;
  unitPriceCents: number;
  complianceDisclaimer: string;
};

export type InventoryItem = OpsProduct & {
  quantityOnHand: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  items: {
    productSlug: string;
    quantity: number;
    unitPriceCents: number;
  }[];
};

export type OpsOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalCents: number;
  createdAt: string;
};

function mapProduct(row: Record<string, unknown>): OpsProduct {
  return {
    slug: String(row.slug),
    name: String(row.name),
    sku: String(row.sku),
    category: String(row.category),
    dosage: String(row.dosage),
    subtitle: String(row.subtitle),
    summary: String(row.summary),
    unitPriceCents: Number(row.unit_price_cents),
    complianceDisclaimer: String(row.compliance_disclaimer),
  };
}

function mapOrder(row: Record<string, unknown>): OpsOrder {
  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    customerEmail: String(row.customer_email),
    status: String(row.status) as OpsOrder['status'],
    totalCents: Number(row.total_cents),
    createdAt: String(row.created_at),
  };
}

export async function seedCatalog() {
  const db = getOpsDb();

  products.forEach((product) => {
    db.prepare(`
      INSERT INTO products (slug, name, sku, category, dosage, subtitle, summary, unit_price_cents, compliance_disclaimer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        name = excluded.name,
        sku = excluded.sku,
        category = excluded.category,
        dosage = excluded.dosage,
        subtitle = excluded.subtitle,
        summary = excluded.summary,
        unit_price_cents = excluded.unit_price_cents,
        compliance_disclaimer = excluded.compliance_disclaimer
    `).run(
      product.slug,
      product.name,
      product.slug.toUpperCase().replace(/-/g, '_'),
      product.category,
      product.dosage,
      product.subtitle,
      product.summary,
      product.unitPriceCents,
      complianceDisclaimer,
    );
  });
}

export async function listProducts(): Promise<OpsProduct[]> {
  await seedCatalog();
  const rows = getOpsDb()
    .prepare('SELECT slug, name, sku, category, dosage, subtitle, summary, unit_price_cents, compliance_disclaimer FROM products ORDER BY rowid ASC')
    .all();
  return rows.map(mapProduct);
}

export async function adjustInventory(productSlug: string, delta: number, reason: string) {
  await seedCatalog();
  getOpsDb()
    .prepare('INSERT INTO inventory_adjustments (id, product_slug, delta, reason, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(newId('inv'), productSlug, delta, reason, nowIso());
}

export async function listInventory(): Promise<InventoryItem[]> {
  await seedCatalog();
  const rows = getOpsDb()
    .prepare(`
      SELECT
        p.slug,
        p.name,
        p.sku,
        p.category,
        p.dosage,
        p.subtitle,
        p.summary,
        p.unit_price_cents,
        p.compliance_disclaimer,
        COALESCE(SUM(a.delta), 0) AS quantity_on_hand
      FROM products p
      LEFT JOIN inventory_adjustments a ON a.product_slug = p.slug
      GROUP BY p.slug
      ORDER BY p.rowid ASC
    `)
    .all();

  return rows.map((row) => ({ ...mapProduct(row), quantityOnHand: Number(row.quantity_on_hand) }));
}

export async function createOrder(input: CreateOrderInput): Promise<OpsOrder> {
  await seedCatalog();
  const totalCents = input.items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
  const order: OpsOrder = {
    id: newId('order'),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    status: 'pending',
    totalCents,
    createdAt: nowIso(),
  };

  const db = getOpsDb();
  db.prepare('INSERT INTO orders (id, customer_name, customer_email, status, total_cents, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(order.id, order.customerName, order.customerEmail, order.status, order.totalCents, order.createdAt);

  input.items.forEach((item) => {
    db.prepare('INSERT INTO order_items (id, order_id, product_slug, quantity, unit_price_cents) VALUES (?, ?, ?, ?, ?)')
      .run(newId('order_item'), order.id, item.productSlug, item.quantity, item.unitPriceCents);
    db.prepare('INSERT INTO inventory_adjustments (id, product_slug, delta, reason, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(newId('inv'), item.productSlug, -item.quantity, `order ${order.id}`, order.createdAt);
  });

  return order;
}

export async function listOrders(): Promise<OpsOrder[]> {
  const rows = getOpsDb()
    .prepare('SELECT id, customer_name, customer_email, status, total_cents, created_at FROM orders ORDER BY created_at DESC, rowid DESC')
    .all();
  return rows.map(mapOrder);
}

export async function getOrder(orderId: string): Promise<(OpsOrder & { items: { productSlug: string; quantity: number; unitPriceCents: number }[] }) | null> {
  const row = getOpsDb()
    .prepare('SELECT id, customer_name, customer_email, status, total_cents, created_at FROM orders WHERE id = ?')
    .get(orderId) as Record<string, unknown> | undefined;

  if (!row) return null;

  const items = getOpsDb()
    .prepare('SELECT product_slug, quantity, unit_price_cents FROM order_items WHERE order_id = ?')
    .all(orderId)
    .map((item: Record<string, unknown>) => ({
      productSlug: String(item.product_slug),
      quantity: Number(item.quantity),
      unitPriceCents: Number(item.unit_price_cents),
    }));

  return { ...mapOrder(row), items };
}

export async function updateOrderStatus(orderId: string, status: OpsOrder['status']) {
  getOpsDb()
    .prepare('UPDATE orders SET status = ? WHERE id = ?')
    .run(status, orderId);
}
