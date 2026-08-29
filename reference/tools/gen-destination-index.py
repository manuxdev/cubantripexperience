#!/usr/bin/env python3
"""
Emit the destinations-index blocks from the source's own Elementor JSON.

    python3 reference/tools/gen-destination-index.py en > src/data/en/destination-index.ts

Sections 7 to 17: six two-column blocks, each a `media-carousel` beside a
heading/text/button stack. The skeleton is identical across the three editions,
so only the copy, the slide sets and the per-block geometry differ.
"""
import json, sys, pathlib, urllib.parse, hashlib, re

lang = sys.argv[1]
root = pathlib.Path(__file__).resolve().parents[1]
repo = root.parent
SLUG = {"es": "destinos", "en": "destinations", "ru": "napravleniya"}
BASE = {"es": "/es/destinos", "en": "/destinations", "ru": "/ru/napravleniya"}
# The source's own "see more" links are unreliable: the English Cienfuegos block
# points at `/Trinidad` (the wrong destination) and Santiago at the site root,
# and the Russian blocks link to a Pinar del Río page that edition does not have.
# Broken links are a defect, not a design, so each block is routed by its own
# heading instead — and where an edition has no such page (Russian Pinar del
# Río) it falls back to that edition's destinations index.
DETAIL_BY_TITLE = {
    "es": {"pinar": "pinar-del-rio", "matanz": "matanzas", "habana": "la-habana",
           "trinidad": "trinidad", "cienfuegos": "cienfuegos", "santiago": "santiago-de-cuba"},
    "en": {"pinar": "pinar-del-rio", "matanz": "matanzas", "havana": "havana",
           "trinidad": "trinidad", "cienfuegos": "cienfuegos", "santiago": "santiago-cuba"},
    "ru": {"пинар": None, "матанс": "matansas", "гавана": "gavana",
           "троица": "troica", "сьенфуэгос": "sienfuegos", "сантьяго": "santyago-de-kuba"},
}

# WordPress serves these five as derivatives whose bytes differ from the original
# we hold, and whose names carry no hint of the subject, so neither the digest nor
# the base name resolves them. Paired through the destination pages' own landmark
# headings, which name each photograph.
ALIASES = {
    "image-of-latin-quietness-21982232": ("matanzas", "varadero-beach"),
    "2616ce97-6d4e-414c-8bb7-d6d0524314e1": ("matanzas", "liberty-park"),
    "foto-de-santiago-de-cuba-cuba": ("santiago-cuba", "el-salto-del-caburni"),
    "ba-cuba-attractions-lonely-planet": ("santiago-cuba", "castillo-de-san-pedro-de-la-roca-del-morro"),
    "eacdd918-6480-4c70-91a2-84f1c892dbc5": ("santiago-cuba", "catedral-de-santiago-de-cuba"),
}

dupes = {}
for f in (repo / "src/assets/pages").rglob("*.webp"):
    dupes.setdefault(hashlib.sha256(f.read_bytes()).hexdigest(), []).append(f)
by_stem = {f.stem.lower(): f for f in (repo / "src/assets/pages").rglob("*.webp")}
media = root / "es/_media"

def asset(url):
    name = urllib.parse.unquote(url.rsplit("/", 1)[-1])
    p = media / name
    if p.is_file():
        same = dupes.get(hashlib.sha256(p.read_bytes()).hexdigest())
        if same:
            return same[0].parent.name, same[0].stem
    stem = re.sub(r"-\d+x\d+$", "", pathlib.Path(name).stem)
    stem = re.sub(r"-e\d{10,}$", "", stem).lower()
    if stem in ALIASES:
        return ALIASES[stem]
    hit = by_stem.get(stem)
    return (hit.parent.name, hit.stem) if hit else (None, name)

def size(v):
    return v.get("size") if isinstance(v, dict) else v

def num(v):
    if v in (None, "", "0"): return None
    try: return float(v)
    except (TypeError, ValueError): return None

def ts(v):
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(int(v)) if float(v).is_integer() else str(v)
    return json.dumps(v, ensure_ascii=False)

d = json.load(open(root / lang / SLUG[lang] / "elementor.json"))
alts = {}
html_path = root / lang / SLUG[lang] / "rendered.html"
if html_path.is_file():
    for m in re.finditer(r'aria-label="([^"]*)"[^>]*data-background="([^"]+)"|data-background="([^"]+)"[^>]*aria-label="([^"]*)"', html_path.read_text()):
        a, b, c2, d2 = m.groups()
        label, url = (a, b) if a is not None else (d2, c2)
        alts.setdefault(urllib.parse.unquote(url.rsplit("/", 1)[-1]), label)

blocks = []
for sec in d:
    cols = sec.get("elements") or []
    carousel = text = None
    for c in cols:
        for w in (c.get("elements") or []):
            if w.get("widgetType") == "media-carousel" and "hide_desktop" not in (w.get("settings") or {}):
                carousel = (c, w)
            if w.get("widgetType") == "heading" and (c.get("elements") or [])[0].get("widgetType") != "media-carousel":
                pass
    # a block is a section holding one visible carousel and a heading elsewhere
    heads = [w for c in cols for w in (c.get("elements") or []) if w.get("widgetType") == "heading"]
    if not carousel or not heads:
        continue
    tcol = next((c for c in cols if any(w.get("widgetType") == "heading" for w in (c.get("elements") or []))), None)
    if tcol is None:
        continue
    ws = {w.get("widgetType"): (w.get("settings") or {}) for w in (tcol.get("elements") or [])}
    mcol, cw = carousel
    cs = cw.get("settings") or {}
    slides = []
    for sl in cs.get("slides", []):
        url = ((sl.get("image") or {}).get("url")) or ""
        folder, stem = asset(url)
        slides.append((folder, stem, alts.get(urllib.parse.unquote(url.rsplit("/", 1)[-1]), "")))
    title = ws.get("heading", {}).get("title", "")
    key = next((k for k in DETAIL_BY_TITLE[lang] if k in title.lower()), None)
    target = DETAIL_BY_TITLE[lang].get(key) if key else None
    blocks.append({
        "title": ws.get("heading", {}).get("title", ""),
        "body": re.sub(r"^<p>|</p>$", "", (ws.get("text-editor", {}).get("editor", "") or "").strip()),
        "bodyParagraph": (ws.get("text-editor", {}).get("editor", "") or "").strip().startswith("<p>"),
        "buttonText": ws.get("button", {}).get("text", ""),
        "href": f"{BASE[lang]}/{target}" if target else BASE[lang],
        "textFirst": cols.index(tcol) < cols.index(mcol),
        "textBasis": num((tcol.get("settings") or {}).get("_inline_size")) or num((tcol.get("settings") or {}).get("_column_size")),
        "mediaBasis": num((mcol.get("settings") or {}).get("_inline_size")) or num((mcol.get("settings") or {}).get("_column_size")),
        "tabletBasis": num((tcol.get("settings") or {}).get("_inline_size_tablet")),
        "buttonMarginTop": num((ws.get("button", {}).get("_margin") or {}).get("top")),
        "buttonMarginTopMobile": num((ws.get("button", {}).get("_margin_mobile") or {}).get("top")),
        "slides": slides,
    })

print(f"""/**
 * {lang.upper()} destinations-index blocks, generated from the source's own Elementor
 * JSON by `reference/tools/gen-destination-index.py {lang}`.
 */
import type {{ EsDestinationBlock }} from "../es/destination-index";
import {{ blockImage }} from "../es/destination-index";

export const blocks: EsDestinationBlock[] = [""")
for b in blocks:
    print("  {")
    print(f"    title: {ts(b['title'])},")
    print(f"    body: {ts(b['body'])},")
    if b["bodyParagraph"]:
        print("    bodyParagraph: true,")
    print(f"    buttonText: {ts(b['buttonText'])},")
    print(f"    href: {ts(b['href'])},")
    print(f"    textFirst: {ts(b['textFirst'])},")
    print(f"    textBasis: {ts(b['textBasis'])},")
    print(f"    mediaBasis: {ts(b['mediaBasis'])},")
    if b["tabletBasis"]:
        print(f"    tabletBasis: {ts(b['tabletBasis'])},")
    if b["buttonMarginTop"]:
        print(f"    buttonMarginTop: {ts(b['buttonMarginTop'])},")
    if b["buttonMarginTopMobile"]:
        print(f"    buttonMarginTopMobile: {ts(b['buttonMarginTopMobile'])},")
    print("    slides: [")
    for folder, stem, alt in b["slides"]:
        print(f"      {{ image: blockImage({ts(folder)}, {ts(stem)}), alt: {ts(alt)} }},")
    print("    ],")
    print("  },")
print("];")
