import { requireOwner } from '../../../../../lib/ops/auth';
import { getOrder, updateOrderStatus } from '../../../../../lib/ops/commerce-store';
import { json, readJson, unauthorized } from '../../../../../lib/ops/responses';

export const runtime = 'nodejs';

type PatchBody = {
  status?: string;
};

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrder(params.id);
    if (!order) {
      return json({ error: 'order not found' }, 404);
    }
    return json({ order });
  } catch {
    return json({ error: 'failed to fetch order' }, 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireOwner(request);

    const body = await readJson<PatchBody>(request);
    const status = body.status;

    if (!status || !VALID_STATUSES.includes(status)) {
      return json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        400
      );
    }

    const existing = await getOrder(params.id);
    if (!existing) {
      return json({ error: 'order not found' }, 404);
    }

    await updateOrderStatus(params.id, status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled');

    const updated = await getOrder(params.id);
    return json({ order: updated });
  } catch (error) {
    if (error instanceof Error && /unauthorized|invalid owner session/i.test(error.message)) {
      return unauthorized();
    }
    return json({ error: 'failed to update order' }, 500);
  }
}
