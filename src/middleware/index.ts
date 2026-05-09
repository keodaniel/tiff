import { defineMiddleware } from 'astro:middleware';
import { verifySession } from '../lib/auth';
import { env } from 'cloudflare:workers';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals, redirect } = context;
  const url = new URL(request.url);

  if (!url.pathname.startsWith('/admin')) return next();
  if (url.pathname === '/admin/login') return next();

  const cookieHeader = request.headers.get('cookie') ?? '';
  const sessionToken = parseCookies(cookieHeader)['admin_session'];

  if (!sessionToken) return redirect('/admin/login', 302);

  let isValid = false;
  try {
    isValid = await verifySession(sessionToken, env.SESSION_SECRET);
  } catch {
    return redirect('/admin/login', 302);
  }

  if (!isValid) return redirect('/admin/login', 302);

  locals.isAdmin = true;
  return next();
});

function parseCookies(header: string): Record<string, string> {
  return Object.fromEntries(
    header
      .split(';')
      .map(c => {
        const eq = c.indexOf('=');
        return eq === -1 ? ['', ''] : [c.slice(0, eq).trim(), c.slice(eq + 1).trim()];
      })
      .filter(([k]) => k),
  );
}
