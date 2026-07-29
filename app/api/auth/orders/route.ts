import { verifyCustomerSession, getCustomerOrders } from '../../../../lib/ops/customer-auth';
import { json, unauthorized } from '../../../../lib/ops/responses';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const [scheme, token] = auth.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return unauthorized();
    }

    const customer = await verifyCustomerSession(token);
    if (!customer) {
      return unauthorized();
    }

    const orders = await getCustomerOrders(customer.id);
    return json({ orders });
  } catch {
    return unauthorized();
  }
}
