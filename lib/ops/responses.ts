export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function unauthorized() {
  return json({ error: 'unauthorized' }, 401);
}

export async function readJson<T extends Record<string, unknown>>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch {
    return {} as T;
  }
}
