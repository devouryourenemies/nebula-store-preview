import { requireOwner } from '../../../../lib/ops/auth';
import { adjustInventory, listInventory } from '../../../../lib/ops/commerce-store';
import { json, readJson, unauthorized } from '../../../../lib/ops/responses';

export const runtime = 'nodejs';

type InventoryBody = {
  productSlug?: string;
  delta?: number;
  reason?: string;
};

export async function GET(request: Request) {
  try {
    await requireOwner(request);
    return json({ items: await listInventory() });
  } catch {
    return unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner(request);
    const body = await readJson<InventoryBody>(request);
    await adjustInventory(String(body.productSlug || ''), Number(body.delta || 0), String(body.reason || 'manual adjustment'));
    return json({ items: await listInventory() }, 201);
  } catch (error) {
    if (error instanceof Error && /unauthorized|invalid owner session/i.test(error.message)) {
      return unauthorized();
    }
    return json({ error: 'inventory adjustment failed' }, 400);
  }
}
