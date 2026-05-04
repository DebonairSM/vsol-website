# VSol Software Design System

A consolidated reference for the VSol Software marketing site, derived from a Claude Design (claude.ai/design) export and matched back against this codebase.

## Quick start

Use the design tokens by referencing CSS custom properties. They are defined in [colors_and_type.css](colors_and_type.css) and auto-imported by [main.css](main.css), [agentic.css](agentic.css), and [sunny.css](sunny.css).

```css
.my-button {
  background: var(--vsol-accent-500);
  color: var(--vsol-primary-900);
  border-radius: var(--radius-md);
  box-shadow: var(--vsol-shadow-md);
  transition: var(--t-normal);
}
```

Optional opt-in classes (no override of base styles):
- `.ds-display`, `.ds-h1`–`.ds-h4`, `.ds-eyebrow`, `.ds-lead`, `.ds-small`
- `.ds-text-agentic`, `.ds-text-dark-grad` — gradient text
- `.ds-accent-bar`, `.ds-accent-bar-yellow` — section accent bars

## Two coexisting visual systems

|                | **Parent brand** (`/`)                                                 | **Agentic / Sunny** (`/agentic`, `/sunny`, `/talkflow`)                |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Primary**    | `#018bca` deep cyan-blue (`--vsol-primary-600`)                        | `#8b5cf6` violet → `#06b6d4` cyan gradient (`--grad-agentic`)          |
| **Accent**     | `#FAB909` signature yellow (`--vsol-accent-500`)                       | `#fbbf24` amber on Sunny (`--agentic-sunny`)                           |
| **Mood**       | Confident, enterprise, structured                                      | Modern, energetic, futuristic                                          |
| **Hero bg**    | Full-bleed code/circuit photo + dark blue gradient overlay             | Pastel gradient (slate→indigo→sky), grid pattern, radial purple/cyan glows |
| **Section bg** | Alternating white / `gray-50`                                          | Alternating white / `slate-50` / `--grad-light-bg`                     |

**Never mix the two.** The only legitimate bridge is the AI nav badge on parent-brand pages.

## Content fundamentals

### Tone
- **Parent brand** — professional, results-led, B2B confident. ROI-driven, certifications, procurement language.
- **Agentic / Sunny** — modern, optimistic, future-facing. "3–5x faster", "the future of software development".

### Voice
- **First person plural ("We")** for the company; second person ("you/your") for the reader. Never "I".
- **Short, declarative sentences.** "Slash costs by 65% without compromising quality."
- **Specific numbers over vague claims.** 65%, 35%, 70%, 3–5x, 30-minute call.
- **Action verbs lead.** "Unleash", "Slash", "Boost", "Schedule", "Discover", "Accelerate", "Transform".

### Casing
- **Hero / section headers**: ALL CAPS, `letter-spacing: 0.05em` (`--tracking-wide`).
- **Nav links**: SMALL CAPS (`text-sm font-semibold uppercase`).
- **Body copy**: Sentence case.
- **Card titles**: Title Case.
- **Acronyms intact**: VSol (not Vsol), AI, MVP, CRM, ERP, QA, DevOps.

### Vibe rules
- CTA copy is conversational and names the human ("Book a Meeting with Rommel").
- Quotes are attributed and italicized.
- **No emoji in body copy.** One controlled exception: 📅 on the Agentic "Book a Meeting" CTA.
- **No exclamation marks** except the rare "Inquire now for details!".

## Visual foundations

### Type
Single family — **Source Sans Pro** (Google Fonts), weights 200/300/400/600/700/900. Loaded via HTML `<link>` tags. Headings rely on weight + uppercase + letter-spacing to differentiate, not size alone.

### Color usage
- **Yellow** (`--vsol-accent-500`) is reserved for parent-brand CTAs, the 4px nav border-bottom, sparkle mark, "Software" word shimmer. Never as large fills.
- **Deep blue** (`--vsol-primary-900`) is hero overlay and Contact section background gradient.
- **The violet→cyan gradient** (`--grad-agentic`) is sacred to AI surfaces. Don't introduce it on parent-brand pages.

### Layout
- Container max-width: `1280px` (`--container-max`), centered, padding `0 2rem`.
- Sections: `padding: 5rem 0` (`py-20`).
- Fixed nav at top, `z-index: 50–1000`, height ≈ 80px on desktop.

### Animation
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (`--ease-out`).
- Durations: `0.2s` fast (`--t-fast`), `0.3s` normal (`--t-normal`), `0.5s` slow (`--t-slow`).
- Entry: `fade-in` (0.6s), `slide-up` (translateY(30px)→0, 0.6–0.8s).
- Idle loops: `pulse-glow` (8s), `pulse-featured` (6s), `badge-pulse` (2s), `float-pulse` (3s), `shimmer` (3s), `bounce-slow`.

### Hover states
- Cards lift `translateY(-4px)` (or `-1px` on Agentic), border switches to brand accent, shadow grows.
- Buttons darken one ramp step; Agentic primary buttons gain `translateY(-1px)` and a violet glow.
- Service icons inside cards: `scale(1.15)` (1.2 + 5deg rotate on Agentic).

### Borders, radii, shadows
- Border default: `1px`–`2px solid var(--vsol-border)`.
- Buttons: `--radius-md` (0.5rem). Cards: `--radius-md`–`--radius-2xl`. Pills/badges: `--radius-full`.
- Shadow tokens: `--vsol-shadow-sm`–`--vsol-shadow-2xl` (`shadow-2xl` is the ceiling).
- Brand glows: `--shadow-primary` (violet), `--shadow-sunny` (amber), `--shadow-glass`.

## Iconography
Three icon sources, in priority order:
1. **Material Icons** — primary. Loaded via Google Fonts. Default 24px; 30px for service icons; 48px for feature icons.
2. **Font Awesome 6.5.1** — only for social brand icons in the footer (`fab fa-facebook`, etc.).
3. **Inline SVG** — custom marks (AI nav badge, hero AI neural-network glyph). Always use `<defs><linearGradient>` for the brand gradient — never flat fills.

## Assets

Located in [client/public/images/](../../public/images/):
- `vsol350x179.png` / `vsol350x138_o.png` — primary horizontal lockup.
- `vsol_logo_underline.png` — alternate logo with yellow underline.
- `vsol_sparkels_72x68.png` — three-spark glyph; "innovation" accent.
- `sunny-face.png` — Sunny avatar (round amber sun with face).
- `rommel-headshot.jpg` — founder portrait, used on Agentic "Agent Master" section.
- `background.jpg`, `career-background.jpg` — full-bleed hero/career backgrounds.
- `christmas_party_vsol.jpg`, `paintball_vsol.png`, `tdc2019.jpg`, `VSol Coworking Dec 3 '18.jpeg` — event photos. Keep candid + warm-toned.
- `favicon.ico` — VSol mark.

## File map

- [colors_and_type.css](colors_and_type.css) — design tokens (`--vsol-*`, `--agentic-*`)
- [main.css](main.css) — parent-brand styles (homepage, careers, events, contact)
- [agentic.css](agentic.css) — Agentic AI sub-brand styles
- [sunny.css](sunny.css) — Sunny / TalkFlow product styles
- [referral.css](referral.css), [spreadsheet-automation.css](spreadsheet-automation.css), [cookie-banner.css](cookie-banner.css) — feature-specific styles

## How to use

1. Decide up front: **parent-brand surface** (blue + yellow) or **Agentic surface** (violet + cyan)?
2. Reference tokens from `--vsol-*` / `--agentic-*` rather than hardcoding hex values.
3. Match copy rules above — declarative, numerical, action-led, never first-person-singular.
4. For new pages, import the relevant top-level stylesheet (`main.css`, `agentic.css`, or `sunny.css`); the tokens import is wired in for you.
