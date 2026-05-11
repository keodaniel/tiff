import type { APIContext } from 'astro';
import { signSession, checkPassword } from '../../../lib/auth';
import { env } from 'cloudflare:workers';

export const prerender = false;

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const password = (formData.get('password') as string) ?? '';

  if (!checkPassword(password, env.ADMIN_PASSWORD)) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin/login?error=1' },
    });
  }

  const token = await signSession(env.SESSION_SECRET);
  const headers = new Headers({
    Location: '/admin',
    'Set-Cookie': `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
  });
  return new Response(null, { status: 302, headers });
}
