#!/usr/bin/env python3
"""
fetch_logos.py — Download SVG logos for ArtDrop marketing site.

Uses Simple Icons CDN (CC0 licensed) as primary source.
Colors all logos to #bfff5e (ArtDrop lime green).
Generates an index.html preview page.

Usage:
    python3 fetch_logos.py
    python3 fetch_logos.py --dry-run     # show what would be fetched
    python3 fetch_logos.py --skip-existing  # don't re-download existing logos
"""

import os
import sys
import re
import time
import argparse
import urllib.request
import urllib.error
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────

ARTDROP_GREEN = "#bfff5e"
SCRIPT_DIR = Path(__file__).resolve().parent
LOGOS_DIR = SCRIPT_DIR / "logos"

# Simple Icons CDN — returns SVG with specified hex color
# Format: https://cdn.simpleicons.org/{slug}/{hex_without_hash}
SIMPLE_ICONS_CDN = "https://cdn.simpleicons.org/{slug}/{color}"

# ── Logo Registry ───────────────────────────────────────────────────────────
# Each entry: (filename, display_name, category, simpleicons_slug_or_None, fallback_url_or_None)
#
# Simple Icons slugs are lowercase brand names. Some differ from what you'd
# expect — these are verified against the Simple Icons slug list.

LOGOS = [
    # ── POD Providers ───────────────────────────────────────────────────────
    ("gelato",          "Gelato",           "POD Providers",     "gelato",           None),
    ("printful",        "Printful",         "POD Providers",     "printful",         None),
    ("printify",        "Printify",         "POD Providers",     "printify",         None),
    ("prodigi",         "Prodigi",          "POD Providers",     "prodigi",          None),
    ("fourthwall",      "Fourthwall",       "POD Providers",     "fourthwall",       None),
    ("customcat",       "CustomCat",        "POD Providers",     None,               "https://www.customcat.com/press"),
    ("shineon",         "ShineOn",          "POD Providers",     None,               "https://www.shineon.com"),
    ("t-pop",           "T-Pop",            "POD Providers",     None,               "https://www.t-pop.fr"),
    ("gooten",          "Gooten",           "POD Providers",     "gooten",           None),
    ("scalable-press",  "Scalable Press",   "POD Providers",     None,               "https://scalablepress.com"),

    # ── Storefronts ─────────────────────────────────────────────────────────
    ("shopify",         "Shopify",          "Storefronts",       "shopify",          None),
    ("etsy",            "Etsy",             "Storefronts",       "etsy",             None),
    ("woocommerce",     "WooCommerce",      "Storefronts",       "woocommerce",      None),

    # ── Social Platforms ────────────────────────────────────────────────────
    ("instagram",       "Instagram",        "Social Platforms",  "instagram",        None),
    ("pinterest",       "Pinterest",        "Social Platforms",  "pinterest",        None),
    ("facebook",        "Facebook",         "Social Platforms",  "facebook",         None),
    ("threads",         "Threads",          "Social Platforms",  "threads",          None),
    ("bluesky",         "Bluesky",          "Social Platforms",  "bluesky",          None),
    ("x",               "X (Twitter)",      "Social Platforms",  "x",                None),
    ("tiktok",          "TikTok",           "Social Platforms",  "tiktok",           None),

    # ── Storage ─────────────────────────────────────────────────────────────
    ("backblaze",       "Backblaze B2",     "Storage",           "backblaze",        None),
    ("amazon-s3",       "AWS S3",           "Storage",           "amazons3",         None),
    ("cloudflare",      "Cloudflare R2",    "Storage",           "cloudflare",       None),
    ("google-drive",    "Google Drive",     "Storage",           "googledrive",      None),
    ("dropbox",         "Dropbox",          "Storage",           "dropbox",          None),
    ("onedrive",        "OneDrive",         "Storage",           "microsoftonedrive", None),

    # ── Technology ──────────────────────────────────────────────────────────
    ("anthropic",       "Anthropic",        "Technology",        "anthropic",        None),
    ("stripe",          "Stripe",           "Technology",        "stripe",           None),
    ("twilio",          "Twilio",           "Technology",        "twilio",           None),
    ("discord",         "Discord",          "Technology",        "discord",          None),

    # ── Intelligence Sources ────────────────────────────────────────────────
    ("fred",            "FRED",             "Intelligence",      None,               "https://fred.stlouisfed.org"),
    ("wikipedia",       "Wikipedia",        "Intelligence",      "wikipedia",        None),
    ("ebay",            "eBay",             "Intelligence",      "ebay",             None),
    ("reddit",          "Reddit",           "Intelligence",      "reddit",           None),
]


# ── SVG Recoloring ──────────────────────────────────────────────────────────

def recolor_svg(svg_text: str, color: str) -> str:
    """
    Recolor an SVG to a single flat color.

    Strategy:
    1. If SVG has a <style> block, inject a universal fill rule.
    2. Replace inline fill="..." attributes with the target color.
    3. Add a fill attribute to the root <svg> element as fallback.
    """
    # Replace fill attributes on elements (not "none" which is intentional transparency)
    svg_text = re.sub(
        r'fill="(?!none)([^"]*)"',
        f'fill="{color}"',
        svg_text
    )

    # Replace any fill in inline style attributes
    svg_text = re.sub(
        r'(style="[^"]*?)fill:\s*[^;"]+',
        rf'\1fill: {color}',
        svg_text
    )

    # If there's a <style> block, prepend a universal fill rule
    if "<style" in svg_text:
        svg_text = re.sub(
            r'(<style[^>]*>)',
            rf'\1 * {{ fill: {color} !important; }}',
            svg_text
        )
    else:
        # Inject a <style> element after the opening <svg> tag
        svg_text = re.sub(
            r'(<svg[^>]*>)',
            rf'\1<style>* {{ fill: {color} !important; }}</style>',
            svg_text
        )

    return svg_text


# ── Download ────────────────────────────────────────────────────────────────

def fetch_svg_from_simpleicons(slug: str, color: str) -> str | None:
    """Fetch SVG from Simple Icons CDN with the given color."""
    hex_color = color.lstrip("#")
    url = SIMPLE_ICONS_CDN.format(slug=slug, color=hex_color)

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ArtDrop-Logo-Fetcher/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode("utf-8")
            # Simple Icons CDN returns SVG content directly
            if "<svg" in content.lower():
                return content
            return None
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
        print(f"    CDN error for '{slug}': {e}")
        return None


def download_logo(filename: str, display_name: str, slug: str | None,
                  fallback_url: str | None, color: str,
                  skip_existing: bool = False) -> tuple[bool, str]:
    """
    Download a single logo. Returns (success, message).
    """
    svg_path = LOGOS_DIR / f"{filename}.svg"

    if skip_existing and svg_path.exists():
        return True, f"SKIP (exists): {filename}.svg"

    # Try Simple Icons CDN first
    if slug:
        print(f"  Fetching {display_name} from Simple Icons (slug: {slug})...")
        svg_content = fetch_svg_from_simpleicons(slug, color)
        if svg_content:
            # The CDN applies color, but let's ensure it with our recolor too
            svg_content = recolor_svg(svg_content, color)
            svg_path.write_text(svg_content, encoding="utf-8")
            return True, f"OK: {filename}.svg (from Simple Icons)"

        # CDN might not have it — slug could be wrong
        print(f"    Simple Icons didn't return SVG for '{slug}', trying alt slugs...")

        # Try common slug variations
        alt_slugs = [
            slug.replace("-", ""),
            slug.replace(" ", ""),
            slug.lower(),
        ]
        for alt in alt_slugs:
            if alt != slug:
                svg_content = fetch_svg_from_simpleicons(alt, color)
                if svg_content:
                    svg_content = recolor_svg(svg_content, color)
                    svg_path.write_text(svg_content, encoding="utf-8")
                    return True, f"OK: {filename}.svg (from Simple Icons, alt slug: {alt})"

    # No Simple Icons slug or CDN failed
    return False, f"MISSING: {filename}.svg — {display_name}"


# ── HTML Preview ────────────────────────────────────────────────────────────

def generate_preview_html(results: list[tuple[str, str, str, bool]]):
    """Generate an index.html preview page showing all logos in a grid."""

    # Group by category
    categories: dict[str, list[tuple[str, str, bool]]] = {}
    for filename, display_name, category, success in results:
        categories.setdefault(category, []).append((filename, display_name, success))

    cards_html = ""
    for cat_name, logos in categories.items():
        cards_html += f'        <h2 class="category-title">{cat_name}</h2>\n'
        cards_html += '        <div class="logo-grid">\n'
        for filename, display_name, success in logos:
            if success:
                cards_html += f"""          <div class="logo-card">
            <div class="logo-img">
              <img src="{filename}.svg" alt="{display_name}" />
            </div>
            <span class="logo-label">{display_name}</span>
            <span class="logo-file">{filename}.svg</span>
          </div>
"""
            else:
                cards_html += f"""          <div class="logo-card missing">
            <div class="logo-img">
              <span class="placeholder">?</span>
            </div>
            <span class="logo-label">{display_name}</span>
            <span class="logo-file">MISSING</span>
          </div>
"""
        cards_html += '        </div>\n'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ArtDrop Logo Library</title>
    <style>
        :root {{
            --artdrop-green: {ARTDROP_GREEN};
            --bg: #0a0a0a;
            --card-bg: #141414;
            --card-border: #222;
            --text: #e0e0e0;
            --text-dim: #777;
            --missing-bg: #1a1010;
            --missing-border: #3a2020;
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 2rem;
        }}

        h1 {{
            color: var(--artdrop-green);
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }}

        .subtitle {{
            color: var(--text-dim);
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }}

        .category-title {{
            color: var(--text);
            font-size: 1.1rem;
            font-weight: 600;
            margin: 2rem 0 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--card-border);
        }}

        .logo-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1rem;
        }}

        .logo-card {{
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 1.2rem 0.8rem 0.8rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            transition: border-color 0.2s;
        }}

        .logo-card:hover {{
            border-color: var(--artdrop-green);
        }}

        .logo-card.missing {{
            background: var(--missing-bg);
            border-color: var(--missing-border);
            opacity: 0.6;
        }}

        .logo-img {{
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
        }}

        .logo-img img {{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }}

        .placeholder {{
            font-size: 1.5rem;
            color: var(--missing-border);
        }}

        .logo-label {{
            font-size: 0.8rem;
            font-weight: 500;
            text-align: center;
        }}

        .logo-file {{
            font-size: 0.65rem;
            color: var(--text-dim);
            font-family: "SF Mono", Monaco, monospace;
        }}

        .logo-card.missing .logo-file {{
            color: #664444;
        }}

        .stats {{
            margin-top: 2rem;
            padding: 1rem;
            background: var(--card-bg);
            border-radius: 8px;
            border: 1px solid var(--card-border);
            font-size: 0.85rem;
            color: var(--text-dim);
        }}

        .stats span {{
            color: var(--artdrop-green);
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <h1>ArtDrop Logo Library</h1>
    <p class="subtitle">All integration logos — colored {ARTDROP_GREEN} (ArtDrop lime green)</p>

{cards_html}
    <div class="stats">
        <span>{sum(1 for *_, s in results if s)}</span> of <span>{len(results)}</span> logos downloaded.
        {f'<span>{sum(1 for *_, s in results if not s)}</span> missing — see MISSING.md' if any(not s for *_, s in results) else 'All logos present.'}
    </div>
</body>
</html>
"""

    index_path = LOGOS_DIR / "index.html"
    index_path.write_text(html, encoding="utf-8")
    print(f"\n  Preview page: {index_path}")


# ── Missing report ──────────────────────────────────────────────────────────

def generate_missing_report(missing: list[tuple[str, str, str | None]]):
    """Write MISSING.md with logos that couldn't be auto-downloaded."""
    if not missing:
        missing_path = LOGOS_DIR / "MISSING.md"
        if missing_path.exists():
            missing_path.unlink()
        return

    lines = [
        "# Missing Logos",
        "",
        "These logos could not be auto-downloaded from Simple Icons.",
        "Download them manually from the URLs below, save as SVG in this folder,",
        f"and recolor to `{ARTDROP_GREEN}`.",
        "",
    ]

    for filename, display_name, fallback_url in missing:
        lines.append(f"## {display_name}")
        lines.append(f"- File needed: `{filename}.svg`")
        if fallback_url:
            lines.append(f"- Brand page: {fallback_url}")
        lines.append(f"- Try: https://brandfetch.com/{filename}")
        lines.append(f"- Try: https://worldvectorlogo.com/search/{filename}")
        lines.append("")

    report_path = LOGOS_DIR / "MISSING.md"
    report_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"  Missing report: {report_path}")


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Fetch SVG logos for ArtDrop marketing site")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fetched without downloading")
    parser.add_argument("--skip-existing", action="store_true", help="Don't re-download logos that already exist")
    parser.add_argument("--color", default=ARTDROP_GREEN, help=f"Hex color for logos (default: {ARTDROP_GREEN})")
    parser.add_argument("--recolor-only", action="store_true", help="Recolor existing SVGs without downloading")
    args = parser.parse_args()

    LOGOS_DIR.mkdir(parents=True, exist_ok=True)

    print(f"ArtDrop Logo Fetcher")
    print(f"  Output: {LOGOS_DIR}")
    print(f"  Color:  {args.color}")
    print(f"  Logos:  {len(LOGOS)} total")
    print()

    if args.recolor_only:
        print("Recoloring existing SVGs...")
        count = 0
        for svg_file in LOGOS_DIR.glob("*.svg"):
            content = svg_file.read_text(encoding="utf-8")
            recolored = recolor_svg(content, args.color)
            svg_file.write_text(recolored, encoding="utf-8")
            count += 1
            print(f"  Recolored: {svg_file.name}")
        print(f"\nRecolored {count} SVGs to {args.color}")
        return

    if args.dry_run:
        print("DRY RUN — nothing will be downloaded\n")
        for filename, display_name, category, slug, fallback in LOGOS:
            source = f"simpleicons:{slug}" if slug else "MANUAL"
            existing = "(exists)" if (LOGOS_DIR / f"{filename}.svg").exists() else ""
            print(f"  [{category}] {display_name:20s} -> {filename}.svg  src={source} {existing}")
        return

    # Download all logos
    results: list[tuple[str, str, str, bool]] = []  # (filename, display, category, success)
    missing: list[tuple[str, str, str | None]] = []  # (filename, display, fallback_url)

    for filename, display_name, category, slug, fallback_url in LOGOS:
        success, msg = download_logo(
            filename, display_name, slug, fallback_url,
            args.color, args.skip_existing
        )
        results.append((filename, display_name, category, success))
        if not success:
            missing.append((filename, display_name, fallback_url))
        print(f"  {msg}")

        # Be polite to CDN
        if slug and success:
            time.sleep(0.3)

    # Summary
    ok = sum(1 for *_, s in results if s)
    fail = sum(1 for *_, s in results if not s)
    print(f"\n{'='*50}")
    print(f"  Downloaded: {ok}/{len(LOGOS)}")
    if fail:
        print(f"  Missing:    {fail}")
    print(f"{'='*50}")

    # Generate outputs
    generate_preview_html(results)
    generate_missing_report(missing)

    print("\nDone.")


if __name__ == "__main__":
    main()
