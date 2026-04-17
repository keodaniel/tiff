// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Static output — works out of the box with Cloudflare Pages
  output: 'static',

  adapter: cloudflare(),
});