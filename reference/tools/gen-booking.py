#!/usr/bin/env python3
"""Emit the booking-page copy for the three editions from their Elementor JSON."""
import json, sys, pathlib, re

root = pathlib.Path(__file__).resolve().parents[1]
SLUG = {"es": "reservar", "en": "bookings", "ru": "bronirovat"}
TITLE = {"es": "Reservar", "en": "Bookings", "ru": "Бронировать"}

def widgets(sec):
    out = []
    def walk(n):
        for el in n:
            if el.get("elType") == "widget":
                out.append(el)
            walk(el.get("elements") or [])
    walk(sec.get("elements") or [])
    return out

def dump(lang):
    d = json.load(open(root / lang / SLUG[lang] / "elementor.json"))
    S = [widgets(s) for s in d]
    flat = [w for ws in S for w in ws]
    g = lambda kind: [w for w in flat if w.get("widgetType") == kind]
    tabs = (g("tabs")[0]["settings"] or {}).get("tabs", [])
    heads = [(w["settings"] or {}).get("title", "") for w in g("heading")
             if (w["settings"] or {}).get("header_size") != "p"]
    # Spanish puts "More information" in its own section; English and Russian
    # keep it in the same one as the copy below it.
    own_section = any(len(ws) == 1 and ws[0].get("widgetType") == "heading"
                      and "informa" in str((ws[0].get("settings") or {}).get("title", "")).lower()
                      for ws in S)
    return {
        "title": f"{TITLE[lang]} | Cuban Trip Experience",
        "hero": heads[0],
        "howHeading": heads[1],
        "moreHeading": heads[2],
        "moreHeadingOwnSection": own_section,
        "moreBody": re.sub(r"^<p>|</p>$", "", ((g("text-editor")[0]["settings"] or {}).get("editor", "") or "").strip()),
        "contactButton": (g("button")[0]["settings"] or {}).get("text", ""),
        # English closes with an empty section that still renders 1px.
        "trailingSection": not widgets(d[-1]),
        "tabs": [{"title": t.get("tab_title", ""), "body": t.get("tab_content", "")} for t in tabs],
    }

out = ['/**',
       ' * Booking-page copy for the three editions, read out of each page\'s Elementor',
       ' * JSON by `reference/tools/gen-booking.py`. Leading spaces are the source\'s own.',
       ' *',
       ' * `moreHeadingOwnSection` is real structure, not styling: Spanish gives the',
       ' * "More information" heading a section of its own, English and Russian keep it',
       ' * in the same section as the copy below it, which is worth 20px of wrap padding.',
       ' */',
       'import type { SiteLang } from "../i18n/site";',
       '',
       'export type BookingContent = {',
       '  title: string;',
       '  hero: string;',
       '  howHeading: string;',
       '  moreHeading: string;',
       '  moreHeadingOwnSection: boolean;',
       '  moreBody: string;',
       '  /** English closes with an empty section; Elementor still renders 1px of it. */',
       '  trailingSection: boolean;',
       '  contactButton: string;',
       '  /** The four explainer tabs; `body` is verbatim widget HTML. */',
       '  tabs: { title: string; body: string }[];',
       '};',
       '',
       'export const BOOKING: Record<SiteLang, BookingContent> = {']
for lang in ("es", "en", "ru"):
    body = json.dumps(dump(lang), ensure_ascii=False, indent=2)
    out.append(f"  {lang}: " + body.replace("\n", "\n  ") + ",")
out.append("};")
sys.stdout.write("\n".join(out) + "\n")
