# Coach Tiff — Tank Performance and Weightlifting Coaching Site

## Project Overview

SSR Astro site for Coach Tiff / Tank Performance and Weightlifting. Horizontal slide layout with four sections. Built with Astro + `@astrojs/cloudflare` (Workers + Assets mode), deployed to Cloudflare Pages via `_worker.js`.

## File Structure

```
src/
  components/
    slides/
      HomeSlide.astro         — slide 0: hero
      PromosSlide.astro       — slide 1: promo codes
      MembershipsSlide.astro  — slide 2: memberships
      AboutSlide.astro        — slide 3: meet coach tiff (has footer + admin link)
    Footer.astro
    Nav.astro
    ProgramCard.astro
    PromoCard.astro
    ShopCard.astro
  data/
    programs.json             — program definitions
    promos.json               — promo code definitions
    shop.json                 — shop item definitions
  layouts/
    Base.astro                — HTML shell, loads global.css
    AdminLayout.astro         — admin pages shell (header nav + logout + back-to-site)
  lib/
    auth.ts                   — session token sign/verify (HMAC-SHA256)
    cart.ts                   — cart utilities
    payments/                 — payment provider types and mock
  middleware/
    index.ts                  — request middleware
  pages/
    index.astro               — slide orchestration + all JS (slideTo, swipe, keyboard, etc.)
    apply.astro               — coaching application form
    programs.astro            — redirects to home
    shop.astro                — shop (hidden, not linked)
    cart.astro                — cart (hidden, not linked)
    cart/success.astro        — post-purchase success page
    admin/
      index.astro             — dashboard
      login.astro             — password login
      programs.astro          — manage programs
      promos.astro            — manage promo codes
      copy.astro              — manage site copy
      submissions.astro       — view coaching applications
      flags.astro             — feature flags
    api/
      submit-application.ts   — coaching application handler
      admin/
        login.ts / logout.ts  — session auth
        programs.ts / promos.ts / copy.ts / submissions.ts / flags.ts
  styles/
    global.css                — all site CSS (no inline <style> blocks)
scripts/
  fix-wrangler.mjs            — post-build: dedupes KV bindings, creates _worker.js,
                                generates root wrangler.json for local dev
public/
  tiff_profile.jpeg / tiff_profile_alt.png / tiff_profile_red.png / tiff-evil.png
  blackheartbarbell.png       — logo used in nav and footer
  tank_perf_wl_logo.jpg       — logo used in admin
  tpc_icon.png
  favicon.ico / favicon.svg
astro.config.mjs
wrangler.jsonc                — source wrangler config (committed)
wrangler.json                 — generated after build for local dev (gitignored)
.dev.vars                     — local secrets: ADMIN_PASSWORD, SESSION_SECRET (gitignored)
```

## Slide Layout

Four horizontal slides navigated by swipe, arrow keys, nav links, or dot indicators:

| Index | Name |
|-------|------|
| 0 | Home (hero) |
| 1 | Promo Codes |
| 2 | Memberships |
| 3 | Meet Coach Tiff |

## Navigation System

Slides are driven by `data-go-slide="N"` attributes and the `slideTo(N)` JS function defined in `src/pages/index.astro`. Never use `href="#section"` anchors for in-page navigation — always use `data-go-slide` or call `slideTo()` directly.

## Admin System

- Route: `/admin` (password-protected via session cookie)
- Auth: HMAC-SHA256 session tokens signed with `SESSION_SECRET`
- Storage: Cloudflare KV namespace `SITE_DATA` for all CMS content
- Local secrets in `.dev.vars`: `ADMIN_PASSWORD`, `SESSION_SECRET`
- Admin link: small button in the About slide footer

## Local Dev

```bash
npm run dev -- --host   # Astro dev server, HMR, exposed on LAN (use for all visual work)
npm run preview         # Full build + wrangler pages dev (needed for KV/admin/env vars)
npm run build           # Production build only
```

`npm run dev` is the default for styling and component work — no rebuild needed. Use `npm run preview` only when testing Cloudflare-specific features (admin, KV, session cookies).

See `DEV.md` for WSL + mobile preview setup.

## Deployment

Cloudflare Pages CI (GitHub integration):

- Build command: `npm run build`
- Build output directory: `dist/client`

`npm run build` runs `astro build` then `scripts/fix-wrangler.mjs`, which:
1. Deduplicates KV bindings in generated wrangler configs (bug in `@cloudflare/vite-plugin`)
2. Bundles `dist/server/` into `dist/client/_w/` and creates `dist/client/_worker.js`
3. Generates root `wrangler.json` (gitignored) for local `wrangler dev`

CF Pages detects `_worker.js` in the output directory and runs it as the Worker. Static assets are served via the `ASSETS` binding. KV and env vars are configured in the CF Pages dashboard for both Preview and Production environments.

## Parallel Agent Orchestration

This is the primary working pattern. Sequential work is the exception, not the rule.

**Process:**
1. Before starting any change, identify independent sub-tasks
2. Launch independent agents in parallel in a single message (multiple Agent tool calls)
3. Use `isolation: "worktree"` on any agent that makes code changes
4. Foreground agents: research/reading tasks whose output is needed before next steps
5. Background agents: independent writes that don't block each other
6. After all parallel agents finish, review and integrate results

**Example splits:**
- CSS changes (`global.css`) vs JS changes (`index.astro` script) vs HTML/component changes — three parallel agents
- One agent per slide component when editing multiple slides
- Research agent (reads current code) → then parallel implementation agents

Never do sequentially what can be done in parallel.

## Code Constraints

- CSS lives in `src/styles/global.css` — no inline `<style>` blocks
- JS lives in the `<script>` tag in `src/pages/index.astro` — no separate JS files
- Slide components are in `src/components/slides/` — one `.astro` file per slide
- Data-driven content (promos, programs) lives in `src/data/*.json` and is imported by its slide component
- Never break `slideTo()`, `data-go-slide`, `.slides-inner`, `.slides-track`
- Maintain accessibility: `aria-` attributes, `role`, keyboard navigation
- Dark theme palette:
  - Background: `#111111`
  - Surface: `#1a1a1a`
  - Accent: `#CC0000`
  - Text: `#f0f0f0`
