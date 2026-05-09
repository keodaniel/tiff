import type { APIContext } from 'astro';
import { verifySession } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import staticPrograms from '../../../data/programs.json';

export const prerender = false;

async function isAuthed(request: Request): Promise<boolean> {
  const match = /admin_session=([^;]+)/.exec(request.headers.get('cookie') ?? '');
  if (!match) return false;
  try { return await verifySession(match[1], env.SESSION_SECRET); } catch { return false; }
}

export async function GET(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const raw = await env.SITE_DATA.get('programs:list');
  return Response.json(raw ? JSON.parse(raw) : staticPrograms);
}

export async function PUT(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const programs = await context.request.json();
  if (!Array.isArray(programs)) return Response.json({ error: 'Expected array' }, { status: 400 });
  await env.SITE_DATA.put('programs:list', JSON.stringify(programs));
  return Response.json({ ok: true });
}
