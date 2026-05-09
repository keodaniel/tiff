import type { APIContext } from 'astro';
import { verifySession } from '../../../lib/auth';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const DEFAULT_COPY = {
  eyebrow: 'Olympic Weightlifting + Military Strength & Conditioning Coach',
  clubName: 'Tank Performance and Weightlifting',
};

async function isAuthed(request: Request): Promise<boolean> {
  const match = /admin_session=([^;]+)/.exec(request.headers.get('cookie') ?? '');
  if (!match) return false;
  try { return await verifySession(match[1], env.SESSION_SECRET); } catch { return false; }
}

export async function GET(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const raw = await env.SITE_DATA.get('copy:home');
  return Response.json(raw ? { ...DEFAULT_COPY, ...JSON.parse(raw) } : DEFAULT_COPY);
}

export async function PUT(context: APIContext) {
  if (!await isAuthed(context.request)) return new Response('Unauthorized', { status: 401 });
  const incoming = await context.request.json();
  const raw = await env.SITE_DATA.get('copy:home');
  const existing = raw ? JSON.parse(raw) : DEFAULT_COPY;
  await env.SITE_DATA.put('copy:home', JSON.stringify({ ...existing, ...incoming }));
  return Response.json({ ok: true });
}
