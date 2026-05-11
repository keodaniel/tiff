const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SESSION_TTL = 86400; // 24 hours in seconds

function b64urlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array<ArrayBuffer> {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(padded);
  const arr = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signSession(secret: string): Promise<string> {
  const payload = b64urlEncode(encoder.encode(JSON.stringify({ iat: Math.floor(Date.now() / 1000) })));
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return `${payload}.${b64urlEncode(sig)}`;
}

export async function verifySession(token: string, secret: string): Promise<boolean> {
  try {
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx === -1) return false;
    const payload = token.slice(0, dotIdx);
    const sig = b64urlDecode(token.slice(dotIdx + 1));
    const key = await importKey(secret);
    const valid = await crypto.subtle.verify('HMAC', key, sig, encoder.encode(payload));
    if (!valid) return false;
    const { iat } = JSON.parse(decoder.decode(b64urlDecode(payload)));
    return typeof iat === 'number' && iat + SESSION_TTL > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function checkPassword(input: string, stored: string): boolean {
  return input === stored;
}
