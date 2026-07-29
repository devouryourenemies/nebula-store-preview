import { requireOwner } from '../../../../../lib/ops/auth';
import { createThread, listThreads } from '../../../../../lib/ops/chat-store';
import { json, readJson, unauthorized } from '../../../../../lib/ops/responses';

export const runtime = 'nodejs';

type ThreadBody = {
  title?: string;
};

export async function GET(request: Request) {
  try {
    await requireOwner(request);
    return json({ threads: await listThreads() });
  } catch {
    return unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner(request);
    const body = await readJson<ThreadBody>(request);
    const thread = await createThread(String(body.title || 'Untitled thread'));
    return json(thread, 201);
  } catch (error) {
    if (error instanceof Error && /unauthorized|invalid owner session/i.test(error.message)) {
      return unauthorized();
    }
    return json({ error: 'thread creation failed' }, 400);
  }
}
