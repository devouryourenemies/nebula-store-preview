import { createOwnerSession } from '../../../../../lib/ops/auth';
import { json, readJson } from '../../../../../lib/ops/responses';

export const runtime = 'nodejs';

type LoginBody = {
  password?: string;
};

export async function POST(request: Request) {
  const body = await readJson<LoginBody>(request);

  try {
    const session = await createOwnerSession(String(body.password || ''));
    return json(session, 200);
  } catch {
    return json({ error: 'invalid credentials' }, 401);
  }
}
