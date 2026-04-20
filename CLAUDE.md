# Coach Tiff — Blackheart Barbell Coaching Site

## Project Overview

Static Astro site for Coach Tiff / Blackheart Barbell. Horizontal slide layout with five sections. Built with Astro (static output), deployed to Cloudflare Pages.

## File Structure

```
src/
  components/
    slides/
      HomeSlide.astro       — slide 0: hero
      PromosSlide.astro     — slide 1: promo codes
      ProgramsSlide.astro   — slide 2: view programs
      ApplySlide.astro      — slide 3: apply for coaching
      AboutSlide.astro      — slide 4: meet coach tiff
    Footer.astro
    Nav.astro
    ProgramCard.astro
    PromoCard.astro
  data/
    programs.json           — program definitions (used by ProgramsSlide)
    promos.json             — promo code definitions (used by PromosSlide)
  layouts/
    Base.astro              — HTML shell, loads global.css
  pages/
    index.astro             — slide orchestration + all JS (slideTo, swipe, keyboard, etc.)
  styles/
    global.css              — all site CSS
public/
  tiff_profile.jpeg         — hero profile photo
  blackheartbarbell.png     — logo used in nav and footer
  favicon.ico / favicon.svg
astro.config.mjs
package.json
tsconfig.json
```

## Slide Layout

Five horizontal slides navigated by swipe, arrow keys, nav links, or dot indicators:

| Index | Name |
|-------|------|
| 0 | Home (hero) |
| 1 | Promo Codes |
| 2 | View Programs |
| 3 | Apply for Coaching |
| 4 | Meet Coach Tiff |

## Navigation System

Slides are driven by `data-go-slide="N"` attributes and the `slideTo(N)` JS function defined in `src/pages/index.astro`. Never use `href="#section"` anchors for in-page navigation — always use `data-go-slide` or call `slideTo()` directly.

## Local Dev

```powershell
npm run dev
```

Find your LAN IP with `ipconfig` to reach the site from mobile on the same WiFi. Astro dev server binds to `localhost:4321` by default.

To build:

```powershell
npm run build
```

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
- Preserve all form field `name` and `id` attributes (form submits via `mailto:`)
- Never break `slideTo()`, `data-go-slide`, `.slides-inner`, `.slides-track`
- Maintain accessibility: `aria-` attributes, `role`, keyboard navigation
- Dark theme palette:
  - Background: `#1e1a1a`
  - Accent: `#8b1a1a`
  - Text: `#f6f6f5`
