import { registerCustomer } from '../../../../lib/ops/customer-auth';
import { json, readJson } from '../../../../lib/ops/responses';

export const runtime = 'nodejs';

type RegisterBody = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<RegisterBody>(request);

    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const firstName = String(body.firstName || '');
    const lastName = String(body.lastName || '');
    const phone = String(body.phone || '');

    if (!email || !password) {
      return json({ error: 'email and password are required' }, 400);
    }

    if (password.length < 6) {
      return json({ error: 'password must be at least 6 characters' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'invalid email format' }, 400);
    }

    const account = await registerCustomer(email, password, firstName, lastName, phone);
    return json({ customer: account }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'email already registered') {
      return json({ error: 'email already registered' }, 409);
    }
    return json({ error: 'registration failed' }, 400);
  }
}
