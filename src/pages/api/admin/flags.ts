import type { APIContext } from 'astro';
import { verifySession } from '../../../lib/auth';
import { env } from 'cloudflare:workers';

export const prerender = false;

const DEFAULT_FLAGS = {
  shopEnabled: false,
  cartEnabled: false,
  promoCodesEnabled: true,
  applyFormEnabled: true,
};

async function isAuthed(request: Request): Promise<boolean> {
  const match = /admin_session=([^;]+)/.exec(request.headers.get('cookie') ?? '');
  if (!match) return false;
  try { return await verifySession(match[1], env.SESSION_SECRET); } catch { return false; }
}

export async function GET(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const raw = await env.SITE_DATA.get('flags:all');
  return Response.json(raw ? JSON.parse(raw) : DEFAULT_FLAGS);
}

export async function PUT(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const incoming = await context.request.json();
  const raw = await env.SITE_DATA.get('flags:all');
  const existing = raw ? JSON.parse(raw) : DEFAULT_FLAGS;
  await env.SITE_DATA.put('flags:all', JSON.stringify({ ...existing, ...incoming }));
  return Response.json({ ok: true });
}
