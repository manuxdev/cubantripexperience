#!/usr/bin/env python3
"""
Emit a destination-detail data file from the source's own Elementor JSON.

    python3 reference/tools/gen-destinations.py en > src/data/en/destinations.ts

The detail pages share one eight-section skeleton across all three editions —
verified node by node — so every geometry field the Spanish file carries is read
straight out of the widgets rather than retyped.
"""
import json, sys, pathlib, urllib.parse, hashlib, re

lang = sys.argv[1]
root = pathlib.Path(__file__).resolve().parents[1]
repo = root.parent
# The local asset folders keep their English names from the first migration.
ASSET_FOLDER = {
    "havana": "havana", "la-habana": "havana", "gavana": "havana",
    "trinidad": "trinidad", "troica": "trinidad",
    "cienfuegos": "cienfuegos", "sienfuegos": "cienfuegos",
    "matanzas": "matanzas", "matansas": "matanzas",
    "santiago-cuba": "santiago-cuba", "santiago-de-cuba": "santiago-cuba",
    "santyago-de-kuba": "santiago-cuba",
    "pinar-del-rio": "pinar-del-rio",
}

rows = [l.split("\t") for l in (root / "tools/pages.tsv").read_text().strip().split("\n") if not l.startswith("#")]

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

def asset(url, prefer=None):
    """Content-addressed first, base-name second: WordPress serves derivatives
    whose bytes differ from the original we hold locally."""
    name = urllib.parse.unquote(url.rsplit("/", 1)[-1])
    p = media / name
    if p.is_file():
        digest = hashlib.sha256(p.read_bytes()).hexdigest()
        same = [f for f in dupes.get(digest, [])]
        if same:
            hit = next((f for f in same if prefer and f.parent.name == prefer), same[0])
            return hit.parent.name, hit.stem
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

def widgets(node):
    out = []
    def walk(n):
        for el in n:
            if el.get("elType") == "widget":
                out.append(el)
            walk(el.get("elements") or [])
    walk(node.get("elements") or [])
    return out

def served(slug):
    """Map each image filename to the pixel size WordPress actually serves.

    Elementor's `space` compiles to `max-width`, so the rendered box is pinned to
    the served derivative's own size whenever that is smaller than the cap. A
    `medium` derivative (300x300) against a 960x960 local asset renders 300px
    wide in the source and 361px here unless the `<img>` carries the source's
    dimensions.
    """
    html = (root / lang / slug / "rendered.html")
    if not html.is_file():
        return {}
    out = {}
    for m in re.finditer(r"<img[^>]+>", html.read_text()):
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        w = re.search(r'width="(\d+)"', tag)
        h = re.search(r'height="(\d+)"', tag)
        if src and w and h:
            name = urllib.parse.unquote(src.group(1).rsplit("/", 1)[-1])
            out.setdefault(re.sub(r"-\d+x\d+(?=\.\w+$)", "", name), (int(w.group(1)), int(h.group(1))))
    return out


def parse(slug, folder=None):
    d = json.load(open(root / lang / slug / "elementor.json"))
    sizes = served(slug)
    page = {"cards": [], "links": [], "spacer5": None, "cta": None,
            "ctaTitleMobile": None, "ctaButtonMobile": None,
            "navAlign": None, "navWidth": None, "hero": None, "copyright": None}
    for si, sec in enumerate(d, 1):
        ws = widgets(sec)
        sset = sec.get("settings") or {}
        if si == 1:
            page["hero"] = next((w["settings"]["title"] for w in ws if w.get("widgetType") == "heading"), None)
        elif si == 3:
            for col in (sec.get("elements") or []):
                for inner in (col.get("elements") or []):
                    if inner.get("elType") != "section":
                        continue
                    tcol = mcol = None
                    for c in (inner.get("elements") or []):
                        kinds = {w.get("widgetType") for w in (c.get("elements") or [])}
                        (mcol := c) if "image" in kinds else (tcol := c)
                    if not (tcol and mcol):
                        continue
                    tw = {w.get("widgetType"): (w.get("settings") or {}) for w in (tcol.get("elements") or [])}
                    img = next(w for w in mcol["elements"] if w.get("widgetType") == "image")
                    i, m = img.get("settings") or {}, mcol.get("settings") or {}
                    body = tw.get("text-editor", {}).get("editor", "")
                    page["cards"].append({
                        "title": tw.get("heading", {}).get("title", ""),
                        "body": re.sub(r"^<p>|</p>$", "", body.strip()),
                        "bodyParagraph": body.strip().startswith("<p>"),
                        "image": asset((i.get("image") or {}).get("url", ""), prefer=folder),
                        "alt": (i.get("image") or {}).get("alt") or "",
                        # `_inline_size` is only stored when the author dragged the
                        # divider; a plain even split leaves it unset and Elementor
                        # falls back to `_column_size`.
                        "textBasis": num((tcol.get("settings") or {}).get("_inline_size"))
                        or num((tcol.get("settings") or {}).get("_column_size")),
                        "imageBasis": num(m.get("_inline_size")) or num(m.get("_column_size")),
                        "imageSpace": num(size(i.get("space"))),
                        "imageSpaceMobile": num(size(i.get("space_mobile"))),
                        "imageMarginLeft": num((i.get("_margin") or {}).get("left")),
                        "imageCustomWidth": num(size(i.get("_element_custom_width"))),
                        "imageCustomWidthMobile": num(size(i.get("_element_custom_width_mobile"))),
                        "imageAlignEnd": m.get("align") == "flex-end",
                        "columnAlignMobileCenter": m.get("align_mobile") == "center",
                        "native": sizes.get(
                            urllib.parse.unquote(
                                (i.get("image") or {}).get("url", "").rsplit("/", 1)[-1]
                            )
                        ),
                    })
        elif si == 4:
            page["navWidth"] = num(size(sset.get("content_width")))
            for col in (sec.get("elements") or []):
                page["navAlign"] = (col.get("settings") or {}).get("align") or page["navAlign"]
            for w in ws:
                if w.get("widgetType") != "button":
                    continue
                s = w.get("settings") or {}
                page["links"].append({
                    "label": s.get("text", ""),
                    "wp": (s.get("link") or {}).get("url", ""),
                    "direction": "next" if s.get("icon_align") == "right" else "prev",
                    "mobileMarginRight": num((s.get("_margin_mobile") or {}).get("right")),
                    "mobileMarginLeft": num((s.get("_margin_mobile") or {}).get("left")),
                })
        elif si == 5:
            page["spacer5"] = num(size(next((w["settings"].get("space") for w in ws if w.get("widgetType") == "spacer"), None)))
        elif si == 6:
            for w in ws:
                s = w.get("settings") or {}
                if w.get("widgetType") == "heading":
                    page["cta"] = s.get("title", "")
                    page["ctaTitleMobile"] = "auto" if s.get("_element_width_mobile") == "auto" else (
                        f'{size(s.get("_element_custom_width_mobile"))}px' if s.get("_element_custom_width_mobile") else None)
                elif w.get("widgetType") == "button":
                    page["ctaButtonMobile"] = "auto" if s.get("_element_width_mobile") == "auto" else (
                        f'{size(s.get("_element_custom_width_mobile"))}px' if s.get("_element_custom_width_mobile") else None)
        elif si == 8:
            for w in ws:
                if w.get("widgetType") == "heading":
                    t = (w.get("settings") or {}).get("title", "")
                    page["copyright"] = t.split("|", 1)[1].strip() if "|" in t else None
    return page

pages = {}
for lg, slug, pid, path, title in rows:
    if lg != lang:
        continue
    p = parse(slug, folder=ASSET_FOLDER.get(slug, slug))
    if len(p["cards"]) == 5:
        pages[slug] = (title, p)

ROUTE = {
    "en": {"havana": "havana", "trinidad": "trinidad", "cienfuegos": "cienfuegos",
           "matanzas": "matanzas", "santiago-cuba": "santiago-cuba", "pinar-del-rio": "pinar-del-rio",
           "Havana": "havana"},
    "ru": {"gavana": "gavana", "troica": "troica", "sienfuegos": "sienfuegos",
           "matansas": "matansas", "santyago-de-kuba": "santyago-de-kuba"},
}
BASE = {"en": "/destinations", "ru": "/ru/napravleniya"}
DEFAULT_COPYRIGHT = {"en": "All rights reserved.", "ru": "Все права защищены."}

def field(name, value, default=None):
    if value is None or value == default or value == "":
        return ""
    return f"    {name}: {ts(value)},\n"

out = []
out.append(f'''/**
 * {lang.upper()} destination-detail content, generated from the source's own
 * Elementor JSON by `reference/tools/gen-destinations.py {lang}` — every string
 * and every geometry value is read out of the widgets, not retyped.
 *
 * The eight-section skeleton is identical to the Spanish edition's, so this
 * feeds the same template.
 */
import type {{ EsDestination }} from "../es/destinations";
import {{ destinationImage }} from "../es/destinations";

export const destinations: EsDestination[] = [''')
for slug, (title, p) in pages.items():
    route = ROUTE[lang].get(slug, slug)
    out.append("  {\n")
    out.append(f"    slug: {ts(route)},\n")
    out.append(f"    title: {ts(title + ' | Cuban Trip Experience')},\n")
    out.append(f"    heroTitle: {ts(p['hero'])},\n")
    out.append(field("ctaTitle", p["cta"]))
    out.append(field("ctaTitleMobileWidth", p["ctaTitleMobile"], "267.312px"))
    out.append(field("ctaButtonMobileWidth", p["ctaButtonMobile"], "104.438px"))
    out.append(field("section5Spacer", p["spacer5"], 13))
    out.append(field("footerCopyright", p["copyright"], DEFAULT_COPYRIGHT[lang]))
    out.append(field("navContentWidth", p["navWidth"], 1140))
    out.append(f"    navAlign: {ts(p['navAlign'] or 'space-around')},\n")
    out.append("    landmarks: [\n")
    for c in p["cards"]:
        folder, stem = c["image"]
        out.append("      {\n")
        out.append(f"        title: {ts(c['title'])},\n")
        out.append(f"        body: {ts(c['body'])},\n")
        out.append(field("  bodyParagraph", c["bodyParagraph"], False).replace("    ", "        ", 1))
        out.append(f"        image: destinationImage({ts(folder)}, {ts(stem)}),\n")
        out.append(f"        alt: {ts(c['alt'] or c['title'].strip().rstrip(':'))},\n")
        for k in ("textBasis", "imageBasis", "imageSpace", "imageSpaceMobile"):
            out.append(f"        {k}: {ts(c[k])},\n")
        if c.get("native"):
            out.append(f"        imageNativeWidth: {c['native'][0]},\n")
            out.append(f"        imageNativeHeight: {c['native'][1]},\n")
        for k, dflt in (("imageMarginLeft", None), ("imageCustomWidth", None),
                        ("imageCustomWidthMobile", None), ("imageAlignEnd", False),
                        ("columnAlignMobileCenter", False)):
            if c[k] not in (None, dflt):
                out.append(f"        {k}: {ts(c[k])},\n")
        out.append("      },\n")
    out.append("    ],\n    links: [\n")
    for l in p["links"]:
        target = ROUTE[lang].get(l["wp"].rstrip("/").rsplit("/", 1)[-1])
        if not target:
            continue
        out.append("      {\n")
        out.append(f"        label: {ts(l['label'])},\n")
        out.append(f"        href: {ts(BASE[lang] + '/' + target)},\n")
        out.append(f"        direction: {ts(l['direction'])},\n")
        for k in ("mobileMarginRight", "mobileMarginLeft"):
            if l[k]:
                out.append(f"        {k}: {ts(l[k])},\n")
        out.append("      },\n")
    out.append("    ],\n  },\n")
out.append("];\n")
sys.stdout.write("".join(x for x in out if x))
