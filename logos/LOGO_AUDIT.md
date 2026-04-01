# ArtDrop Logo Audit
_Generated 2026-03-30_

---

## 1. Current State — What's On the Site Right Now

### Where logos appear in index.html

**"Integrates with" trust bar** (section: `// The stack`, line ~1881)
CSS classes: `.trust-logos` container, `.trust-logo` per logo
Display: horizontal flex row, `flex-wrap`, 40px gap, logos ~28px tall
Inline SVG injection: JavaScript at bottom of index.html fetches each SVG file and replaces `<img>` with inline `<svg>` so fill color inherits correctly.

Logos currently in the trust bar:
| Logo | File | Notes |
|------|------|-------|
| Shopify | `logos/shopify.svg` | Live |
| Gelato | `logos/gelato.svg` | Live |
| Printful | `logos/printful.svg` | Live, has `.trust-logo--printful` override (height: 34px) |
| Printify | `logos/printify.svg` | Live |
| Prodigi | `logos/prodigi.svg` | Live (added after logos/index.html was generated — logos/index.html still marks it MISSING but it IS on disk and in the site) |
| Claude | `logos/claude.svg` | Live (labeled "Claude AI by Anthropic") |
| Backblaze | `logos/backblaze.svg` | Live, has `.trust-logo--backblaze` override (height: 22px); this is a hand-crafted text SVG, not an icon |

**Social publishing grid** (section: `// Social publishing`, line ~1961)
CSS classes: `.social-feature-grid` (5-col grid), `.social-feature-card`, `.social-feature-logo`
All 7 social logos are live here.

| Logo | File | Notes |
|------|------|-------|
| Instagram | `logos/instagram.svg` | Live |
| Pinterest | `logos/pinterest.svg` | Live |
| Facebook | `logos/facebook.svg` | Live |
| Threads | `logos/threads.svg` | Live |
| Bluesky | `logos/bluesky.svg` | Live |
| X (Twitter) | `logos/x.svg` | Live |
| TikTok | `logos/tiktok.svg` | Live |

**Roadmap section** (section: `// What's next`, line ~1904)
POD and storefront names appear as text-only `.roadmap-tag` pills — **no logos here, just text labels**.
- Print providers roadmap: Gooten, ShineOn, Lulu Direct
- Storefronts roadmap: Etsy, WooCommerce

No logos on: about.html, docs.html, faq.html, or any other page.

---

## 2. Logos on Disk but NOT on Any Page

These 17 files are downloaded, colored, and ready — but not shown anywhere on the site:

### POD Providers (on disk, not on site)
| Logo | File | Where it belongs |
|------|------|-----------------|
| Gelato | `gelato.svg` | Trust bar (already there — but NOT in roadmap; it's live) |

Wait — Gelato IS in the trust bar. The following are truly on disk but unused:

| Logo | File | Category | Status |
|------|------|----------|--------|
| Anthropic | `anthropic.svg` | Technology | On disk, NOT on site (site uses `claude.svg` instead) |
| Stripe | `stripe.svg` | Technology/Payment | On disk, not on site |
| Discord | `discord.svg` | Technology/Community | On disk, not on site |
| Etsy | `etsy.svg` | Storefronts | On disk, not on site (roadmap mentions it as text only) |
| WooCommerce | `woocommerce.svg` | Storefronts | On disk, not on site (roadmap mentions it as text only) |
| Cloudflare | `cloudflare.svg` | Storage | On disk, not on site |
| Google Drive | `google-drive.svg` | Storage | On disk, not on site |
| Dropbox | `dropbox.svg` | Storage | On disk, not on site |
| Wikipedia | `wikipedia.svg` | Intelligence | On disk, not on site |
| eBay | `ebay.svg` | Intelligence | On disk, not on site |
| Reddit | `reddit.svg` | Intelligence | On disk, not on site |

**Total: 11 logos on disk, not used anywhere on the site.**

---

## 3. Logos Missing from Disk — The 11 We Still Need

These files do NOT exist in the logos folder:

| Brand | Needed file | Category | Where to find |
|-------|-------------|----------|---------------|
| Prodigi | `prodigi.svg` | POD Provider | RESOLVED — file exists. logos/index.html is stale. |
| Fourthwall | `fourthwall.svg` | POD Provider | https://brandfetch.com/fourthwall.com |
| CustomCat | `customcat.svg` | POD Provider | https://brandfetch.com/customcat.com |
| ShineOn | `shineon.svg` | POD Provider | https://brandfetch.com/shineon.com |
| T-Pop | `t-pop.svg` | POD Provider | https://brandfetch.com/t-pop.com |
| Gooten | `gooten.svg` | POD Provider | https://brandfetch.com/gooten.com |
| Scalable Press | `scalable-press.svg` | POD Provider | https://brandfetch.com/scalablepress.com |
| AWS S3 | `amazon-s3.svg` | Storage | https://worldvectorlogo.com/logo/amazon-s3 — or use the Amazon Web Services icon from Simple Icons |
| OneDrive | `onedrive.svg` | Storage | https://worldvectorlogo.com/logo/onedrive — or Simple Icons has it |
| Twilio | `twilio.svg` | Technology | https://brandfetch.com/twilio.com — Simple Icons has Twilio |
| FRED | `fred.svg` | Intelligence | No standard icon. Consider hand-crafting a wordmark SVG (like Backblaze) or using a "FRED" text-only SVG in #bfff5e |

### Notes on findability:
- **Twilio**: Simple Icons (simpleicons.org) has an official Twilio SVG. Run the same download script used for others.
- **OneDrive**: Simple Icons has OneDrive. Easy download.
- **AWS S3**: Simple Icons has `amazons3`. Easy download.
- **Fourthwall, CustomCat, ShineOn, T-Pop, Gooten, Scalable Press**: Niche POD providers. Not on Simple Icons. Brandfetch is the best bet. Some may only have raster logos — in that case, hand-craft a wordmark SVG like Backblaze.
- **FRED** (Federal Reserve Economic Data): No public logo SVG exists anywhere reputable. Recommend a hand-crafted wordmark: `<text fill="#bfff5e">FRED</text>` similar to how Backblaze was handled.

---

## 4. Integration Plan — Where Each Logo Goes

### Section A: "Integrates with" Trust Bar (The Stack section)
**Current**: 7 logos. Should expand to show all live integrations.
**Proposed additions** (add these when ready):

**Phase 1 — Immediately available (files on disk):**
- Anthropic logo alongside Claude (or replace Claude with Anthropic, since Anthropic is the brand)
- Stripe (payment processor — relevant for purchase trust)
- Etsy (even though it's "coming soon" in roadmap, having the logo builds credibility)
- WooCommerce (same)

**Phase 2 — After finding missing files:**
- Gooten, ShineOn (when files obtained)

Recommended trust bar order (by user familiarity / credibility weight):
1. Shopify
2. Etsy
3. WooCommerce
4. Gelato
5. Printful
6. Printify
7. Prodigi
8. Anthropic (replace or join Claude)
9. Stripe
10. Backblaze

### Section B: POD Providers (all 16)
**Recommendation**: Add a dedicated "Print Providers" subsection within the Stack section, separate from the general trust bar.
Layout: `.trust-logos` flex row, or a new tighter logo grid.

**Live now (on disk + on site):** Gelato, Printful, Printify, Prodigi (4)
**On disk, not shown:** None in this category beyond the 4 above
**Need files:** Fourthwall, CustomCat, ShineOn, T-Pop, Gooten, Scalable Press, Lulu Direct (7 missing — Lulu Direct is referenced in roadmap but no SVG at all)

Full target list for POD section:
- Gelato `gelato.svg` — READY
- Printful `printful.svg` — READY
- Printify `printify.svg` — READY
- Prodigi `prodigi.svg` — READY
- Gooten `gooten.svg` — MISSING
- ShineOn `shineon.svg` — MISSING
- Fourthwall `fourthwall.svg` — MISSING
- CustomCat `customcat.svg` — MISSING
- T-Pop `t-pop.svg` — MISSING
- Scalable Press `scalable-press.svg` — MISSING
- Lulu Direct — no SVG, no file, not even in MISSING.md (add to list)

### Section C: Storefronts (all 9)
Note: The brief says "all 9" but only 3 appear in logos folder (Shopify, Etsy, WooCommerce). No other storefront SVGs exist. If the plan includes BigCommerce, Squarespace, etc., those files need to be sourced first.

Current on disk: Shopify, Etsy, WooCommerce (3)

Recommended storefront display: A `.roadmap-group` within the roadmap section with logo pills instead of or in addition to text-only roadmap-tags.

### Section D: Social Platforms (all 7)
**Status: COMPLETE.** All 7 are on disk and live in the social-feature-grid on index.html.
- Instagram, Pinterest, Facebook, Threads, Bluesky, X, TikTok — all good.

### Section E: Technology (Anthropic, Stripe, Twilio)
These power ArtDrop behind the scenes. The "AI Engine" section already calls out Anthropic/Claude.
- Anthropic `anthropic.svg` — ON DISK, not shown (site shows Claude logo instead)
- Stripe `stripe.svg` — ON DISK, not shown
- Twilio `twilio.svg` — MISSING

Recommendation: Add a small "Powered by" or "Built with" row below the trust bar showing Anthropic, Stripe, Twilio. Separate from the "integrates with" bar since these aren't user-facing integrations.

### Section F: Intelligence Sources (FRED, Wikipedia, eBay, Reddit)
These are data sources for pricing intelligence — a selling point but not a user-facing integration.
- Wikipedia `wikipedia.svg` — ON DISK, not shown
- eBay `ebay.svg` — ON DISK, not shown
- Reddit `reddit.svg` — ON DISK, not shown
- FRED `fred.svg` — MISSING

Recommendation: Add a small "Market Intelligence" callout card or footnote in the AI Engine section. Use the intel-card pattern already in the CSS (`.intel-grid`, `.intel-card`). Low priority — these are more of a marketing detail than a trust signal.

### Section G: Storage
Backblaze is already in the trust bar. The others (Cloudflare R2, Google Drive, Dropbox, AWS S3, OneDrive) are optional storage backends — not V1 features.
- Cloudflare `cloudflare.svg` — ON DISK, not shown
- Google Drive `google-drive.svg` — ON DISK, not shown
- Dropbox `dropbox.svg` — ON DISK, not shown
- AWS S3 `amazon-s3.svg` — MISSING
- OneDrive `onedrive.svg` — MISSING

Recommendation: Don't add these to the main trust bar. They dilute the credibility message. Add them only when those storage options ship, in the roadmap section as logo-tagged roadmap entries.

---

## 5. SVG Health Check

All 24 SVGs on disk were verified:
- All contain `#bfff5e` as fill color
- All contain valid `<svg>` markup
- The site's JS SVG-injection system (fetches each file, replaces `<img>` with inline `<svg>`) will work with all of them

**One quirk — Backblaze**: This is a hand-crafted text-based SVG (a `<text>` element reading "Backblaze"), not a proper logo mark. It renders fine but at small sizes it will look visually inconsistent with icon-style logos. Already has a custom `.trust-logo--backblaze { height: 22px; }` rule to compensate. This is fine; keep it.

**One stale reference**: `logos/index.html` marks Prodigi as MISSING — but `prodigi.svg` exists on disk. The logos/index.html needs a manual update. Low priority since it's a dev tool.

---

## 6. CSS Recommendation

### Existing classes to reuse (no new CSS needed for phase 1):

**Trust bar** — `.trust-logos` + `.trust-logo`
Works as-is. If adding many logos, consider reducing the `gap` from `40px` to `24px` and adding a max-width with overflow scroll on mobile.

**Social grid** — `.social-feature-grid` + `.social-feature-card` + `.social-feature-logo`
Already built for 7-up grids with icons + labels. Reuse for a POD providers section if you want label-per-logo display.

**Roadmap pills** — `.roadmap-tag` + `.roadmap-tag--shipped`
Could be extended to `.roadmap-tag--logo` that includes an `<img>` or inline SVG + text, giving a logo+label pill look.

### New class needed (for a dedicated logo grid section):

If adding a full POD providers block with logos at consistent sizes in a grid:
```css
.logo-grid-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 32px 40px;
  margin: 24px 0;
}

.logo-grid-item {
  height: 24px;
  width: auto;
  opacity: 0.75;
  transition: opacity 0.2s;
}

.logo-grid-item:hover { opacity: 1; }
```

This mirrors the pattern of `.trust-logo` but is semantically separate.

### Size modifiers needed when new logos are added:
Some logos will need height overrides like Printful and Backblaze already have. Keep the pattern: `.trust-logo--[brandname] { height: Xpx; }` per brand.

---

## 7. Priority Ranking — Which Logos Matter Most

### Tier 1 — Highest credibility impact (customers recognize these):
1. **Shopify** — the #1 storefront. Already there. Non-negotiable.
2. **Etsy** — massive artist audience. On disk. Add it.
3. **Printful** — most recognized POD brand. Already there.
4. **Printify** — second-most recognized POD. Already there.
5. **Instagram / Pinterest / TikTok** — social proof that social publishing works. Already there.
6. **Stripe** — signals payment security to buyers. On disk. Add it.
7. **Anthropic** — AI credibility. On disk. Consider swapping Claude mark for Anthropic wordmark in trust bar.

### Tier 2 — Credibility for artists who know the space:
8. **Gelato** — growing fast, known in POD circles. Already there.
9. **Prodigi** — already there.
10. **WooCommerce** — relevant for WordPress users. On disk. Add to roadmap.
11. **Gooten / ShineOn** — known in POD communities. Get files.

### Tier 3 — Supporting detail, not primary trust builders:
12. **Backblaze** — already there. Somewhat niche; keeps the "no servers" story.
13. **Cloudflare, Dropbox, Google Drive** — wait until those storage options ship.
14. **Discord** — community signal but not an integration. Hold.
15. **Wikipedia, eBay, Reddit, FRED** — interesting but only relevant in an intelligence features section.

---

## Summary Action Items

| Priority | Action | Effort |
|----------|--------|--------|
| High | Add Etsy, WooCommerce, Stripe to trust bar | 10 min — files on disk |
| High | Add Anthropic to trust bar (join or replace Claude) | 5 min — file on disk |
| Medium | Get Gooten, ShineOn, T-Pop, CustomCat, Fourthwall, Scalable Press from Brandfetch | 30-60 min manual |
| Medium | Get Twilio, AWS S3, OneDrive from Simple Icons/worldvectorlogo | 15 min |
| Low | Create FRED wordmark SVG (like Backblaze — text element) | 5 min |
| Low | Create Lulu Direct SVG (not even in MISSING.md — add to list) | 10 min |
| Low | Update logos/index.html to mark Prodigi as downloaded | 2 min |
| Low | Add intelligence sources (Wikipedia, eBay, Reddit, FRED) to intel section | After files obtained |
| Hold | Storage alternatives (Cloudflare, Dropbox, GDrive, S3, OneDrive) | Wait until those features ship |
