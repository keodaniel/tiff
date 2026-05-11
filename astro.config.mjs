// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    // Tells the adapter our existing SITE_DATA KV is "the session binding".
    // hasSessionBinding=true → customizer returns undefined for kv_namespaces,
    // preventing it from spreading our bindings into the generated wrangler.json.
    // This fixes the duplicate-binding bug in @cloudflare/vite-plugin v1.36.
    // The prerender worker's wrangler.json is deduped by scripts/fix-wrangler.mjs.
    sessionKVBindingName: 'SITE_DATA',
  }),
});
