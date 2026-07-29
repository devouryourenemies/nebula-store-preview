import { loginCustomer } from '../../../../lib/ops/customer-auth';
import { json, readJson } from '../../../../lib/ops/responses';

export const runtime = 'nodejs';

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<LoginBody>(request);

    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return json({ error: 'email and password are required' }, 400);
    }

    const session = await loginCustomer(email, password);
    return json({ session }, 200);
  } catch (error) {
    if (error instanceof Error && error.message === 'invalid email or password') {
      return json({ error: 'invalid email or password' }, 401);
    }
    return json({ error: 'login failed' }, 400);
  }
}
