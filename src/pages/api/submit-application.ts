import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export async function POST(context: APIContext) {
  try {
    const formData = await context.request.formData();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const submittedAt = new Date().toISOString();
    const submission = {
      id,
      submittedAt,
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      program_type: String(formData.get('program_type') ?? ''),
      schedule: String(formData.get('schedule') ?? ''),
      history: String(formData.get('history') ?? ''),
      goals: String(formData.get('goals') ?? ''),
    };

    await env.SITE_DATA.put(`submissions:${id}`, JSON.stringify(submission), {
      metadata: { submittedAt },
    });

    return Response.json({ ok: true, id });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
