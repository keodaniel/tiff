import type { APIContext } from 'astro';
import { verifySession } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import staticPromos from '../../../data/promos.json';

export const prerender = false;

async function isAuthed(request: Request): Promise<boolean> {
  const match = /admin_session=([^;]+)/.exec(request.headers.get('cookie') ?? '');
  if (!match) return false;
  try { return await verifySession(match[1], env.SESSION_SECRET); } catch { return false; }
}

export async function GET(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const raw = await env.SITE_DATA.get('promos:list');
  return Response.json(raw ? JSON.parse(raw) : staticPromos);
}

export async function PUT(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const promos = await context.request.json();
  if (!Array.isArray(promos)) return Response.json({ error: 'Expected array' }, { status: 400 });
  await env.SITE_DATA.put('promos:list', JSON.stringify(promos));
  return Response.json({ ok: true });
}
