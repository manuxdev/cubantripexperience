#!/usr/bin/env python3
"""Emit the home-page copy for the three editions from their Elementor JSON."""
import json, sys, pathlib, re, urllib.parse, hashlib

root = pathlib.Path(__file__).resolve().parents[1]
repo = root.parent
SLUG = {"es": "inicio", "en": "home", "ru": "dom"}
# Slides are routed by their own heading, like the destinations index: the
# source's own hrefs are unreliable there too, and Russian has no Pinar del Río.
BASE = {"es": "/es/destinos", "en": "/destinations", "ru": "/ru/napravleniya"}
BY_TITLE = {
    "es": {"pinar": "pinar-del-rio", "matanz": "matanzas", "habana": "la-habana",
           "trinidad": "trinidad", "cienfuegos": "cienfuegos", "santiago": "santiago-de-cuba"},
    "en": {"pinar": "pinar-del-rio", "matanz": "matanzas", "havana": "havana",
           "trinidad": "trinidad", "cienfuegos": "cienfuegos", "santiago": "santiago-cuba"},
    "ru": {"пинар": None, "матанс": "matansas", "гавана": "gavana",
           "тринидад": "troica", "троица": "troica", "сьенфуэгос": "sienfuegos",
           "сантьяго": "santyago-de-kuba"},
}
TITLE = {"es": "Inicio", "en": "Home", "ru": "Главная"}

pub = {f.name: f"/home/{f.name}" for f in (repo / "public/home").glob("*.webp")}
media = root / "es/_media"
dupes = {}
for f in (repo / "public/home").glob("*.webp"):
    dupes.setdefault(hashlib.sha256(f.read_bytes()).hexdigest(), f)

def slide_image(url):
    name = urllib.parse.unquote(url.rsplit("/", 1)[-1])
    p = media / name
    if p.is_file():
        hit = dupes.get(hashlib.sha256(p.read_bytes()).hexdigest())
        if hit:
            return f"/home/{hit.name}"
    stem = re.sub(r"-\d+x\d+$", "", pathlib.Path(name).stem)
    stem = re.sub(r"-e\d{10,}$", "", stem).lower()
    for n, path in pub.items():
        if pathlib.Path(n).stem.lower() == stem:
            return path
    return ""

def widgets(sec):
    out = []
    def walk(n):
        for el in n:
            if el.get("elType") == "widget":
                out.append(el)
            walk(el.get("elements") or [])
    walk(sec.get("elements") or [])
    return out

def strip(html):
    return (html or "").strip()

# Section roles per edition. The three homes are not the same shape: Spanish
# leaves an empty section between the "why" block and the features, Russian puts
# a spacer there, English has neither — and their spacer values differ
# throughout, so every one is read rather than assumed.
ROLES = {
    "es": {"hero": 1, "vanMobile": 3, "why": 4, "gap": 5, "band": 7,
           "emptyMobile": 8, "vanDesktop": 9, "afterVan": 10, "beforeBand": 12,
           "bandSection": 13, "last": 18, "discover": 11, "features": 6},
    "en": {"hero": 1, "vanMobile": 3, "why": 4, "gap": None, "band": 6,
           "emptyMobile": None, "vanDesktop": 7, "afterVan": 8, "beforeBand": 10,
           "bandSection": 11, "last": 16, "discover": 9, "features": 5},
    "ru": {"hero": 1, "vanMobile": 3, "why": 4, "gap": 5, "band": 7,
           "emptyMobile": 8, "vanDesktop": 9, "afterVan": 10, "beforeBand": 12,
           "bandSection": 13, "last": 18, "discover": 11, "features": 6},
}


def size(v):
    return v.get("size") if isinstance(v, dict) else v


def spacer(d, idx):
    """The spacer widget of section `idx`, as authored."""
    if not idx:
        return None
    for w in widgets(d[idx - 1]):
        if w.get("widgetType") == "spacer":
            st = w.get("settings") or {}
            return {"desktop": size(st.get("space")), "mobile": size(st.get("space_mobile")),
                    "hideMobile": "hide_mobile" in st}
    return None


def margin(el, edge, mobile=False, key="margin"):
    """An element's authored margin on one edge, in px.

    Sections store it as `margin`; widgets as `_margin` on their own container.
    """
    st = (el.get("settings") or {})
    m = st.get(f"{key}_mobile" if mobile else key)
    return int(m[edge]) if m and str(m.get(edge, "")).lstrip("-").isdigit() else 0


def widget(sec, kind, last=False):
    hits = [w for w in widgets(sec) if w.get("widgetType") == kind]
    return (hits[-1] if last else hits[0]) if hits else None


def route(lang, heading):
    key = next((k for k in BY_TITLE[lang] if k in heading.lower()), None)
    target = BY_TITLE[lang].get(key) if key else None
    return f"{BASE[lang]}/{target}" if target else BASE[lang]


def dump(lang):
    d = json.load(open(root / lang / SLUG[lang] / "elementor.json"))
    R = ROLES[lang]
    S = [widgets(s) for s in d]
    flat = [w for ws in S for w in ws]
    kind = lambda k: [w for w in flat if w.get("widgetType") == k]
    heads = [(w["settings"] or {}).get("title", "") for w in kind("heading")
             if (w["settings"] or {}).get("header_size") != "p"]
    texts = [strip((w["settings"] or {}).get("editor", "")) for w in kind("text-editor")]
    boxes = kind("image-box")
    slides = (kind("slides")[0]["settings"] or {}).get("slides", [])
    buttons = [(w["settings"] or {}).get("text", "") for w in kind("button")]
    # `texts` in source order: hero copy, van (mobile-only), why, van (desktop),
    # discover, band. The hero's is index 0, so everything else is off by one
    # from the section numbering.
    van_mobile, van_desktop = texts[1], texts[3]
    return {
        "title": f"{TITLE[lang]} | Cuban Trip Experience",
        "hero": heads[0],
        # The hero copy is two `<p>` with a 1px line box.
        "heroLines": re.findall(r"<p>(.*?)</p>", (kind("text-editor")[0]["settings"] or {}).get("editor", ""), re.S) or [texts[0]],
        "vanHeading": heads[1],
        "vanBodyMobile": van_mobile,
        "vanBodyDesktop": van_desktop,
        "vanButton": buttons[2] if len(buttons) > 2 else "",
        "whyHeading": heads[2],
        "whyBody": texts[2],
        "features": [{"title": (w["settings"] or {}).get("title_text", ""),
                      "body": (w["settings"] or {}).get("description_text", "")} for w in boxes],
        "discoverHeading": heads[4] if len(heads) > 4 else "",
        "discoverBody": texts[4] if len(texts) > 4 else "",
        "bandHeading": heads[5] if len(heads) > 5 else "",
        "bandBody": texts[5] if len(texts) > 5 else "",
        "testimonialsHeading": heads[6] if len(heads) > 6 else "",
        "layout": {
            "heroSpacer": spacer(d, R["hero"]),
            "vanMobileSpacer": spacer(d, R["vanMobile"]),
            "whySpacer": spacer(d, R["why"]),
            "gapSpacer": spacer(d, R["gap"]),
            # Spanish's gap section holds nothing at all; Russian's holds a spacer.
            "gapEmpty": bool(R["gap"]) and not spacer(d, R["gap"]),
            "bandSpacer": spacer(d, R["band"]),
            "vanDesktopSpacer": spacer(d, R["vanDesktop"]),
            "afterVanSpacer": spacer(d, R["afterVan"]),
            "beforeBandSpacer": spacer(d, R["beforeBand"]),
            "lastSpacer": spacer(d, R["last"]),
            # The -30px that pulls the van block up over the band sits on the
            # section right before it: Spanish and Russian have an empty
            # `hide_mobile` section there, English puts it on the band itself.
            # The van block's mobile CTA sits 10px below the copy in Spanish and
            # Russian, flush against it in English.
            # Every edition frames the van photograph differently: it is the
            # mobile section's own background, sized and offset in px.
            "vanMobileBg": {
                "width": size((d[R["vanMobile"] - 1].get("settings") or {}).get("background_bg_width_mobile")),
                "x": size((d[R["vanMobile"] - 1].get("settings") or {}).get("background_xpos_mobile")),
                "y": size((d[R["vanMobile"] - 1].get("settings") or {}).get("background_ypos_mobile")),
            },
            # Spanish gives the desktop van CTA a 10px top margin; the other two
            # editions sit it flush against the copy.
            # The three feature columns are hand-sized in every edition, and the
            # widest one decides the section's height. Elementor inherits the
            # desktop split down to tablet unless the author overrode it.
            "featureBasis": [ (c.get("settings") or {}).get("_inline_size")
                              for c in (d[R["features"] - 1].get("elements") or []) ],
            "featureBasisTablet": [ (c.get("settings") or {}).get("_inline_size_tablet")
                                    or (c.get("settings") or {}).get("_inline_size")
                                    for c in (d[R["features"] - 1].get("elements") or []) ],
            "vanDesktopButtonMarginTop": margin(widget(d[R["vanDesktop"] - 1], "button") or {}, "top", key="_margin"),
            "vanMobileButtonMarginTop": margin(widget(d[R["vanMobile"] - 1], "button") or {}, "top", True, "_margin"),
            # The "book now" wordmark under the discover copy: every edition
            # authors its own mobile pull-up and width.
            "bookingMarginTopMobile": margin(widget(d[R["discover"] - 1], "image", last=True) or {}, "top", True, "_margin"),
            "bookingWidthMobile": size(((widget(d[R["discover"] - 1], "image", last=True) or {}).get("settings") or {}).get("space_mobile")),
            "bandMarginBottom": margin(d[R["band"] - 1], "bottom"),
            # The slider is pulled up over the gradient band by a margin every
            # edition authors differently (-200/-190, -130/-230, -130/-210).
            "slidesMargin": margin(d[R["bandSection"]], "top"),
            "slidesMarginMobile": margin(d[R["bandSection"]], "top", True),
            "bandHeight": size((d[R["bandSection"] - 1].get("settings") or {}).get("custom_height")),
            "bandHeightTablet": size((d[R["bandSection"] - 1].get("settings") or {}).get("custom_height_tablet")),
            "emptyMobileSection": bool(R["emptyMobile"]),
            # English is the one edition that hides the band above the van block.
            "blueBandHiddenOnMobile": "hide_mobile" in ((d[R["band"] - 1].get("settings")) or {}),
        },
        "slides": [{"heading": s.get("heading", ""), "description": s.get("description", ""),
                    "button": s.get("button_text", ""),
                    "overlay": s.get("background_overlay_color", "#00000052"),
                    "image": slide_image(((s.get("background_image") or {}).get("url") or "")),
                    "href": route(lang, s.get("heading", ""))} for s in slides],
    }

out = ['/**',
       ' * Home-page copy for the three editions, read out of each page\'s Elementor JSON',
       ' * by `reference/tools/gen-home.py`. Leading whitespace is the source\'s own.',
       ' */',
       'import type { SiteLang } from "../i18n/site";',
       '',
       '/** An Elementor spacer as authored; `null` where the section has none. */',
       'export type Spacer = { desktop: number | null; mobile: number | null; hideMobile: boolean } | null;',
       '',
       'export type HomeContent = {',
       '  title: string;',
       '  hero: string;',
       '  /** Two paragraphs, each a 1px line box in the source. */',
       '  heroLines: string[];',
       '  vanHeading: string;',
       '  /** The mobile-only and desktop-only van blocks author different copy. */',
       '  vanBodyMobile: string;',
       '  vanBodyDesktop: string;',
       '  vanButton: string;',
       '  whyHeading: string;',
       '  whyBody: string;',
       '  features: { title: string; body: string }[];',
       '  discoverHeading: string;',
       '  discoverBody: string;',
       '  bandHeading: string;',
       '  bandBody: string;',
       '  testimonialsHeading: string;',
       '  layout: {',
       '    heroSpacer: Spacer;',
       '    vanMobileSpacer: Spacer;',
       '    whySpacer: Spacer;',
       '    gapSpacer: Spacer;',
       '    gapEmpty: boolean;',
       '    bandSpacer: Spacer;',
       '    vanDesktopSpacer: Spacer;',
       '    afterVanSpacer: Spacer;',
       '    beforeBandSpacer: Spacer;',
       '    lastSpacer: Spacer;',
       '    vanMobileBg: { width: number; x: number; y: number };',
       '    featureBasis: number[];',
       '    featureBasisTablet: number[];',
       '    vanDesktopButtonMarginTop: number;',
       '    vanMobileButtonMarginTop: number;',
       '    bookingMarginTopMobile: number;',
       '    bookingWidthMobile: number | null;',
       '    bandMarginBottom: number;',
       '    slidesMargin: number;',
       '    slidesMarginMobile: number;',
       '    bandHeight: number | null;',
       '    bandHeightTablet: number | null;',
       '    emptyMobileSection: boolean;',
       '    blueBandHiddenOnMobile: boolean;',
       '  };',
       '  slides: { heading: string; description: string; button: string; overlay: string; image: string; href: string }[];',
       '};',
       '',
       'export const HOME: Record<SiteLang, HomeContent> = {']
for lang in ("es", "en", "ru"):
    out.append(f"  {lang}: " + json.dumps(dump(lang), ensure_ascii=False, indent=2).replace("\n", "\n  ") + ",")
out.append("};")
sys.stdout.write("\n".join(out) + "\n")
