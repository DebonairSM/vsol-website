# SEO Verification Report — vsol.software

**Date:** 2026-05-04
**Scope:** Live audit of deployed site vs. repo HEAD (`3ac771d`)
**Method:** HTTP fetches against `https://vsol.software` and `https://www.vsol.software`, JSON-LD parse validation, head-tag inspection, repo cross-reference

---

## TL;DR

The implementation is real and substantially correct. Three pages (`/agentic`, `/spreadsheet-automation`, `/referral`) render their bespoke meta + structured data exactly as designed. The home page is well-optimized. **But there are five concrete bugs hurting SEO right now**, and one significant drift between what's deployed and what's on `main`.

---

## What's working

The home page (`/`) returns a complete head with Open Graph (with image dimensions and alt), Twitter Card, canonical, theme color, manifest link, favicon, DNS prefetch, preconnect, and font preload. Two valid JSON-LD blocks: `ProfessionalService` (with full NAP, geo coordinates, service types, sameAs to LinkedIn/Facebook/Instagram) and `WebSite` with a `SearchAction`. Security headers are excellent — strict CSP, HSTS with `includeSubDomains`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`.

The `/agentic` page renders correctly with title `Sunny CoWork | VSol Software` and two valid JSON-LD blocks (`Service` named "Sunny CoWork", `Person` named "Rommel" with `jobTitle: Sunny CoWork Lead`). `/spreadsheet-automation` returns a valid `Service` schema with a free `Offer`. `/referral` returns a valid `WebPage` schema.

`manifest.json` is reachable and parses; `sitemap.xml` is reachable and parses; both return strict security headers.

---

## Bugs found

### 1. The `/sunny` page does not exist — sitemap promises a 404 Google won't see as a 404

`sitemap.xml` declares `https://vsol.software/sunny.html` with `priority` 0.95 (higher than agentic at 0.9, ranking it second-most-important behind the home page). The file `client/sunny.html` exists in the repo but **is not registered in `vite.config.ts`** — only `talkflow.html` is in the `rollupOptions.input` map. The build never emits a `sunny.html`, so the deployed `/sunny` and `/sunny.html` URLs both fall through to whatever serves index.html, returning the home page HTML with `<title>Visual Solutions Software Consultants</title>` and `<link rel="canonical" href="https://vsol.software/">`.

**SEO impact:** Google crawls `/sunny.html`, gets home-page content, treats it as a duplicate of `/`. Best case it consolidates the URL. Worst case it dilutes ranking signals. Either way, the high-priority sitemap entry is misleading.

**Fix:** add `sunny: path.resolve(__dirname, 'client/sunny.html')` to `vite.config.ts` inputs. Decide whether to also update the sitemap entry to `/sunny` (extensionless) — see bug #4. Rebuild and redeploy.

### 2. `/talkflow` still resolves but is supposedly dead

`client/talkflow.html` still exists, vite.config.ts still builds it, and `https://www.vsol.software/talkflow` returns 200 with home-page content (so it likely isn't the actual built talkflow page either, given the SPA fallback behavior — worth a closer look). Git history says `Refactor TalkFlow to Sunny` happened but the rename was incomplete: talkflow.html and the vite input were left in place.

**SEO impact:** small — talkflow isn't in the sitemap so crawlers won't discover it organically. But any old inbound links still resolve, splitting authority.

**Fix:** decide what `/talkflow` should do. Most likely a 301 redirect to `/sunny` (or `/agentic`) once those exist. Then remove `client/talkflow.html` and the vite input.

### 3. Canonical URLs and og:url use the wrong host and the wrong path

Every page's `<link rel="canonical">` and `<meta property="og:url">` point to `https://vsol.software/<page>.html` — but:
- The actual canonical host is `www.vsol.software` (apex 301-redirects to www, confirmed via `curl -I`).
- The actual canonical path is extensionless (`.html` URLs 301-redirect to extensionless via Cloudflare, e.g. `/agentic.html` → `/agentic`).

So every canonical URL fires two 301s before landing on the served page. Google will follow, but the canonical signal is muddier than it should be, and link equity from social shares (which use og:url) gets routed through the redirect chain.

**SEO impact:** moderate. Small ranking drag and lost milliseconds on every social click.

**Fix:** pick a canonical host (recommend `https://www.vsol.software` since that's what Cloudflare is already enforcing) and rewrite all `canonical` and `og:url` and JSON-LD `url` fields to use `https://www.vsol.software/<path>` without `.html`. Affected files: `index.html`, `agentic.html`, `spreadsheet-automation.html`, `referral.html`, `sunny.html`, plus any new pages.

### 4. Sitemap URLs all 301-redirect

Every `<loc>` in `sitemap.xml` uses the apex host with `.html` extension. Both segments redirect. Google docs are explicit that sitemaps should only list the final canonical URLs.

**Fix:** rewrite to `https://www.vsol.software/agentic` (etc.) — apex host + no extension. Same place to fix as bug #3.

### 5. The repo's `robots.txt` is being completely overridden at the apex

`https://vsol.software/robots.txt` returns **only** Cloudflare-managed content (content signals + AI-bot disallows). The project's own robots.txt, with the `Sitemap:` declaration, the `Disallow: /secret-leads-viewer.html`, and the `Crawl-delay: 1`, is missing. At `www`, both Cloudflare's AND the project's content are concatenated, so the project's rules survive there — but only crawlers that hit `www` directly will see them. Crawlers that try the apex first will see Cloudflare's robots.txt, which has no `Sitemap:` line.

**SEO impact:** moderate. Sitemap discovery via robots.txt is a fallback for crawlers that don't have it submitted in Search Console. Without the Sitemap line at the apex, you're relying on Search Console submission alone.

**Fix:** Cloudflare's robots.txt managed content is configurable — there's a setting in the Cloudflare dashboard under **Security → Bots → AI Crawl Control** (or similar; check current location) to either disable the managed robots.txt or supply a custom one that includes your `Sitemap:` line. Alternatively, since `www` already serves both, also submit the sitemap to Google Search Console explicitly so robots.txt discovery isn't load-bearing.

---

## Drift between deployed site and repo HEAD

This one is worth flagging on its own. The deployed `/agentic` page shows `Sunny CoWork Lead` everywhere — title, jobTitle in JSON-LD, body content. The local `client/agentic.html` at HEAD (`3ac771d`) still has `Agent Master` everywhere — title `Agentic AI | VSol Software`, `jobTitle: Agent Master`, headers, alt text. No commit touching `client/agentic.html` exists on any local branch (`main` is the only branch) that converts Agent Master to Sunny CoWork Lead.

So the deployed site is ahead of `main` by an unknown amount. Either:
- A branch was deployed and deleted without merging
- Files were edited directly on the host (Cloudflare Pages dashboard, etc.)
- A separate fork was deployed

**Why this matters:** if you rebuild and deploy from `main` right now, you'll regress the agentic page back to "Agent Master" branding. Whoever made the deployed changes needs to commit them before the next deploy, or the next deploy will undo them.

**Fix:** before doing any of the bug fixes above, reconcile the deployed agentic.html (and check the others too) against the repo. Either pull the deployed copy down and commit it, or re-do the rename in code and rebuild.

---

## Other observations (not bugs, but worth noting)

The `manifest.json` lists only two icons (48×48 favicon and 72×72 sparkles). Lighthouse PWA / installability checks want at minimum 192×192 and 512×512, plus an `apple-touch-icon` link in the head. The original SEO doc flagged this as a recommendation; still outstanding.

`X-Frame-Options: SAMEORIGIN` is set, but the modern equivalent `Content-Security-Policy: frame-ancestors 'self'` is also present. Good — that's belt-and-suspenders. No action needed.

The Calendly link uses `rel="noopener noreferrer"` correctly. Social links in the footer same. Email is obfuscated through Cloudflare's email-decode script.

Keyword meta tag is present on all pages. Most search engines (including Google) ignore it; harmless but bloat.

---

## Suggested fix order

If you want to prioritize: bug #1 (sunny.html missing from build) is the most impactful and the cheapest fix — one line in vite.config.ts plus a sitemap edit plus a redeploy. Bug #5 (robots.txt) is impactful and zero-code (Cloudflare dashboard toggle). Bugs #3 and #4 are the same fix done across several files. The drift situation needs to be sorted before any redeploy or you'll regress live content.

I can take any of these next — say which.
