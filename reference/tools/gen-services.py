#!/usr/bin/env python3
"""Emit the services-page copy for one edition from its Elementor JSON."""
import json, sys, pathlib, re

root = pathlib.Path(__file__).resolve().parents[1]
SLUG = {"es": "servicios", "en": "services", "ru": "uslugi"}
TITLE = {"es": "Servicios", "en": "Services", "ru": "Yслуги"}

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
    S = {i + 1: widgets(s) for i, s in enumerate(d)}
    g = lambda ws, kind: [w for w in ws if w.get("widgetType") == kind]
    s3 = S[3]
    return {
        "title": f"{TITLE[lang]} | Cuban Trip Experience",
        "hero": (g(S[1], "heading")[0]["settings"] or {}).get("title", ""),
        "vehiclesHeading": (g(s3, "heading")[0]["settings"] or {}).get("title", ""),
        "tabs": [(w["settings"] or {}).get("text", "") for w in g(s3, "button")],
        "vehicles": [
            {"title": (w["settings"] or {}).get("title_text", ""),
             "description": (w["settings"] or {}).get("description_text", "")}
            for w in g(s3, "icon-box")
        ],
        "ctaHeading": (g(S[5], "heading")[0]["settings"] or {}).get("title", ""),
        "ctaButton": (g(S[5], "button")[0]["settings"] or {}).get("text", ""),
        "proHeading": (g(S[6], "heading")[0]["settings"] or {}).get("title", ""),
        # English authors a fourth `text-editor` outside the two columns that
        # holds nothing and renders nothing; keeping it would add a 20px gap.
        "paragraphs": [t for t in
                       (re.sub(r"^<p>|</p>$", "", ((w["settings"] or {}).get("editor", "") or "").strip())
                        for w in g(S[7], "text-editor"))
                       if re.sub(r"<[^>]+>|&nbsp;|\s", "", t)],
        "discoverHeading": (g(S[9], "heading")[0]["settings"] or {}).get("title", ""),
        "discoverButton": (g(S[9], "button")[0]["settings"] or {}).get("text", ""),
    }

out = ['/**',
       ' * Services-page copy for the three editions, read out of each page\'s Elementor',
       ' * JSON by `reference/tools/gen-services.py`. Leading spaces are the source\'s own.',
       ' *',
       ' * English authors a fourth paragraph in Section 7 that Spanish and Russian do',
       ' * not, so `paragraphs` is a list rather than a fixed pair.',
       ' */',
       'import type { SiteLang } from "../i18n/site";',
       '',
       'export type ServicesContent = {',
       '  title: string;',
       '  hero: string;',
       '  vehiclesHeading: string;',
       '  /** The three selector buttons, in source order. */',
       '  tabs: string[];',
       '  vehicles: { title: string; description: string }[];',
       '  ctaHeading: string;',
       '  ctaButton: string;',
       '  proHeading: string;',
       '  /** Section 7, split across two columns: the first two go left, the rest right. */',
       '  paragraphs: string[];',
       '  discoverHeading: string;',
       '  discoverButton: string;',
       '};',
       '',
       'export const SERVICES: Record<SiteLang, ServicesContent> = {']
for lang in ("es", "en", "ru"):
    c = dump(lang)
    # JSON is a valid TypeScript object literal; emit it as-is rather than
    # unquoting keys, which mangles any value containing `": `.
    body = json.dumps(c, ensure_ascii=False, indent=2)
    out.append(f"  {lang}: " + body.replace("\n", "\n  ") + ",")
out.append("};")
sys.stdout.write("\n".join(out) + "\n")
