import { getOpsDb, newId, nowIso } from './db';

export type ChatThread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  role: 'owner' | 'assistant';
  content: string;
  createdAt: string;
};

function mapThread(row: Record<string, unknown>): ChatThread {
  return {
    id: String(row.id),
    title: String(row.title),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapMessage(row: Record<string, unknown>): ChatMessage {
  return {
    id: String(row.id),
    threadId: String(row.thread_id),
    role: String(row.role) as ChatMessage['role'],
    content: String(row.content),
    createdAt: String(row.created_at),
  };
}

export async function createThread(title: string): Promise<ChatThread> {
  const at = nowIso();
  const thread: ChatThread = { id: newId('thread'), title, createdAt: at, updatedAt: at };

  getOpsDb()
    .prepare('INSERT INTO chat_threads (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)')
    .run(thread.id, thread.title, thread.createdAt, thread.updatedAt);

  return thread;
}

export async function listThreads(): Promise<ChatThread[]> {
  const rows = getOpsDb()
    .prepare('SELECT id, title, created_at, updated_at FROM chat_threads ORDER BY updated_at DESC, created_at DESC')
    .all();
  return rows.map(mapThread);
}

export async function addMessage(threadId: string, role: ChatMessage['role'], content: string): Promise<ChatMessage> {
  const at = nowIso();
  const message: ChatMessage = { id: newId('msg'), threadId, role, content, createdAt: at };
  const db = getOpsDb();

  db.prepare('INSERT INTO chat_messages (id, thread_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(message.id, message.threadId, message.role, message.content, message.createdAt);
  db.prepare('UPDATE chat_threads SET updated_at = ? WHERE id = ?').run(at, threadId);

  return message;
}

export async function listMessages(threadId: string): Promise<ChatMessage[]> {
  const rows = getOpsDb()
    .prepare('SELECT id, thread_id, role, content, created_at FROM chat_messages WHERE thread_id = ? ORDER BY created_at ASC, id ASC')
    .all(threadId);
  return rows.map(mapMessage);
}
