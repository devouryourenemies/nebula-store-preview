import { requireOwner } from '../../../../lib/ops/auth';
import { createOrder } from '../../../../lib/ops/commerce-store';
import { json, readJson, unauthorized } from '../../../../lib/ops/responses';

export const runtime = 'nodejs';

type OrderBody = {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  items?: {
    productSlug?: string;
    quantity?: number;
    unitPriceCents?: number;
  }[];
};

export async function POST(request: Request) {
  try {
    const body = await readJson<OrderBody>(request);
    const customer = body.customer;
    const items = body.items || [];

    if (!customer?.firstName || !customer?.lastName || !customer?.email) {
      return json({ error: 'Customer name and email are required' }, 400);
    }

    if (items.length === 0) {
      return json({ error: 'Order must contain at least one item' }, 400);
    }

    const order = await createOrder({
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      items: items.map((item) => ({
        productSlug: String(item.productSlug),
        quantity: Number(item.quantity) || 1,
        unitPriceCents: Number(item.unitPriceCents) || 0,
      })),
    });

    return json({ orderId: order.id, status: order.status }, 201);
  } catch (error) {
    return json({ error: 'Order creation failed' }, 400);
  }
}

// GET: list orders (owner only)
export async function GET(request: Request) {
  try {
    await requireOwner(request);
    const { listOrders } = await import('../../../../lib/ops/commerce-store');
    return json({ orders: await listOrders() });
  } catch {
    return unauthorized();
  }
}
