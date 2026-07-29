import { getOpsDb, nowIso } from './db';

export type OwnerSession = {
  token: string;
  role: 'owner';
  createdAt: string;
};

function configuredPassword() {
  return process.env.NEBULA_OPS_ADMIN_PASSWORD || '';
}

function compactUuid() {
  return crypto.randomUUID().replace(/-/g, '');
}

export async function createOwnerSession(password: string): Promise<OwnerSession> {
  const expected = configuredPassword();
  if (!expected || password !== expected) {
    throw new Error('invalid owner credentials');
  }

  const session: OwnerSession = {
    token: compactUuid() + compactUuid(),
    role: 'owner',
    createdAt: nowIso(),
  };

  getOpsDb()
    .prepare('INSERT INTO owner_sessions (token, role, created_at) VALUES (?, ?, ?)')
    .run(session.token, session.role, session.createdAt);

  return session;
}

export async function verifyOwnerSession(token: string): Promise<OwnerSession> {
  const row = getOpsDb()
    .prepare('SELECT token, role, created_at FROM owner_sessions WHERE token = ?')
    .get(token) as { token: string; role: 'owner'; created_at: string } | undefined;

  if (!row) throw new Error('invalid owner session');
  return { token: row.token, role: row.role, createdAt: row.created_at };
}

export function bearerTokenFromRequest(request: Request) {
  const header = request.headers.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return '';
  return token;
}

export async function requireOwner(request: Request) {
  const token = bearerTokenFromRequest(request);
  if (!token) throw new Error('unauthorized');
  return verifyOwnerSession(token);
}
