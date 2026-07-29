import { requireOwner } from '../../../../../lib/ops/auth';
import { addMessage, listMessages } from '../../../../../lib/ops/chat-store';
import { routeHermesOpsMessage } from '../../../../../lib/ops/hermes';
import { json, readJson, unauthorized } from '../../../../../lib/ops/responses';

export const runtime = 'nodejs';

type MessageBody = {
  threadId?: string;
  message?: string;
};

export async function GET(request: Request) {
  try {
    await requireOwner(request);
    const url = new URL(request.url);
    const threadId = url.searchParams.get('threadId') || '';
    if (!threadId) return json({ error: 'threadId is required' }, 400);
    return json({ messages: await listMessages(threadId) });
  } catch {
    return unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner(request);
    const body = await readJson<MessageBody>(request);
    const threadId = String(body.threadId || '');
    const ownerMessage = String(body.message || '').trim();

    if (!threadId || !ownerMessage) {
      return json({ error: 'threadId and message are required' }, 400);
    }

    const owner = await addMessage(threadId, 'owner', ownerMessage);
    const hermes = await routeHermesOpsMessage(ownerMessage);
    const assistant = await addMessage(threadId, 'assistant', hermes.content);

    return json({ threadId, owner, assistant, hermes }, 201);
  } catch (error) {
    if (error instanceof Error && /unauthorized|invalid owner session/i.test(error.message)) {
      return unauthorized();
    }
    return json({ error: 'message routing failed' }, 400);
  }
}
