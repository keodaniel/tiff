# Coach Tiff — Blackheart Barbell Coaching Site

## Project Overview

Static single-file personal coaching website for Coach Tiff / Blackheart Barbell. All HTML, CSS, and JS live inline in one file (`index.html`). Horizontal slide layout with five sections.

## File Structure

- `index.html` — entire site (inline CSS, HTML, JS — no external files)
- `tiff_profile.jpeg` — hero profile photo
- `blackheartbarbell.jpg` — logo used in nav and footer
- `Dockerfile` / `run-claude.sh` — Claude Code sandbox setup

## Slide Layout

Five horizontal slides navigated by swipe, arrow keys, nav links, or dot indicators:

| Index | Name |
|-------|------|
| 0 | Home (hero) |
| 1 | Promo Codes |
| 2 | View Membership |
| 3 | Apply for Coaching |
| 4 | Meet Coach Tiff |

## Navigation System

Slides are driven by `data-go-slide="N"` attributes and the `slideTo(N)` JS function. Never use `href="#section"` anchors for in-page navigation — always use `data-go-slide` or call `slideTo()` directly.

## Local Dev

Run from **Windows PowerShell** (not WSL):

```powershell
python -m http.server 8080
```

Find your LAN IP with `ipconfig` to reach the site from mobile on the same WiFi.

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
- CSS changes vs JS changes vs HTML structure — three parallel agents
- One agent per slide section when editing multiple slides
- Research agent (reads current code) → then parallel implementation agents

Never do sequentially what can be done in parallel.

## Code Constraints

- Keep everything in `index.html` — no separate CSS or JS files
- Preserve all form field `name` and `id` attributes (form submits via `mailto:`)
- Never break `slideTo()`, `data-go-slide`, `.slides-inner`, `.slides-track`
- Maintain accessibility: `aria-` attributes, `role`, keyboard navigation
- Dark theme palette:
  - Background: `#1e1a1a`
  - Accent: `#8b1a1a`
  - Text: `#f6f6f5`
