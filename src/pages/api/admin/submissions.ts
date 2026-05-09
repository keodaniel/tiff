import type { APIContext } from 'astro';
import { verifySession } from '../../../lib/auth';
import { env } from 'cloudflare:workers';

export const prerender = false;

async function isAuthed(request: Request): Promise<boolean> {
  const match = /admin_session=([^;]+)/.exec(request.headers.get('cookie') ?? '');
  if (!match) return false;
  try { return await verifySession(match[1], env.SESSION_SECRET); } catch { return false; }
}

export async function GET(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const list = await env.SITE_DATA.list({ prefix: 'submissions:', limit: 100 });
  const submissions = await Promise.all(
    list.keys.map(async (key: { name: string }) => {
      const raw = await env.SITE_DATA.get(key.name);
      return raw ? JSON.parse(raw) : null;
    }),
  );
  const sorted = (submissions.filter(Boolean) as object[]).sort(
    (a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
  return Response.json(sorted);
}
