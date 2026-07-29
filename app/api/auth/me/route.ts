import { verifyCustomerSession } from '../../../../lib/ops/customer-auth';
import { getOpsDb } from '../../../../lib/ops/db';
import { json, unauthorized } from '../../../../lib/ops/responses';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace(/^bearer\s+/i, '');

  if (!token) return unauthorized();

  try {
    const customer = await verifyCustomerSession(token);
    if (!customer) return unauthorized();

    const orders = getOpsDb()
      .prepare('SELECT id, customer_name, customer_email, status, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC')
      .all(customer.email)
      .map((row: Record<string, unknown>) => ({
        id: String(row.id),
        customerName: String(row.customer_name),
        customerEmail: String(row.customer_email),
        status: String(row.status),
        totalCents: Number(row.total_cents),
        createdAt: String(row.created_at),
      }));

    return json({ customer, orders });
  } catch {
    return unauthorized();
  }
}
