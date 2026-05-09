# Coach Tiff — Tank Performance and Weightlifting

Coaching site for Coach Tiff / Tank Performance and Weightlifting. Horizontal slide layout with SSR via Cloudflare Workers. Built with Astro + `@astrojs/cloudflare`, deployed to Cloudflare Pages.

**Live:** [tanktiff.com](https://tanktiff.com)

## Stack

- **Framework:** Astro 6 (SSR, Cloudflare adapter)
- **Runtime:** Cloudflare Workers with Assets
- **Storage:** Cloudflare KV (`SITE_DATA`) for admin-managed content
- **Deployment:** Cloudflare Pages (CI via GitHub)

## Dev

```bash
npm run dev -- --host   # Astro dev server with HMR, exposed on LAN
npm run preview         # Full build + wrangler pages dev (for CF bindings/admin)
npm run build           # Production build
```

See `DEV.md` for WSL + mobile preview setup.
