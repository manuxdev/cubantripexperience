import json, sys, os, re
from html import unescape

# Setting keys worth reporting, grouped. Everything else is Elementor noise.
COPY = ('title','editor','text','description_text','title_text','caption','html','shortcode','tab_title','tab_content','testimonial_content','testimonial_name','testimonial_job')
BREAKS = ('', '_tablet', '_mobile')

def txt(v):
    if not isinstance(v, str): return v
    v = re.sub(r'<br\s*/?>', ' / ', v)
    v = unescape(re.sub(r'<[^>]+>', '', v)).strip()
    return re.sub(r'\s+', ' ', v)

def dim(v):
    if isinstance(v, dict):
        if 'url' in v:
            return v['url'] or None
        if 'size' in v:
            return None if v['size'] in ('', None) else f"{v['size']}{v.get('unit','px')}"
        if 'top' in v:
            u = v.get('unit','px')
            vals = [v.get(k,'') for k in ('top','right','bottom','left')]
            return None if not any(str(x).strip() for x in vals) else ' '.join(f"{x or 0}{u}" for x in vals)
    if isinstance(v, list): return None
    return v if v not in ('', None) else None

def style(s):
    """Pull the design-relevant settings out of one element."""
    out = []
    for k in sorted(s):
        if k.startswith('__') or k in COPY: continue
        base = re.sub(r'(_tablet|_mobile)$', '', k)
        if not re.search(r'color|background|typography|font|padding|margin|width|height|align|radius|border|shadow|space|gap|position|overlay|image|link|url|icon|hide_|columns|content_position|gradient|opacity|animation|sticky|stretch|layout|direction|size|ratio', base):
            continue
        v = dim(s[k])
        if v in (None, '', 'default', []): continue
        if isinstance(v, dict): v = json.dumps(v, ensure_ascii=False)[:120]
        out.append(f"{k}={v}")
    return out

def walk(n, depth, buf):
    et = n.get('elType','')
    wt = n.get('widgetType','')
    s  = n.get('settings',{}) or {}
    label = f"{et}:{wt}" if wt else et
    pad = '  ' * depth
    if et == 'column':
        label += f" [{s.get('_inline_size') or s.get('_column_size','')}%]"
    buf.append(f"{pad}- **{label}**")
    for k in COPY:
        if s.get(k):
            t = txt(s[k])
            if t: buf.append(f"{pad}  - `{k}`: {t}")
    # repeaters (icon lists, tabs, slides, carousels)
    for k, v in sorted(s.items()):
        if isinstance(v, list) and v and isinstance(v[0], dict) and any(x in v[0] for x in COPY + ('image','link','selected_icon')):
            buf.append(f"{pad}  - `{k}` ({len(v)} items):")
            for i, it in enumerate(v):
                bits = []
                for kk in sorted(it):
                    if kk.startswith('_'): continue
                    vv = dim(it[kk])
                    if vv in (None, '', []): continue
                    if isinstance(vv, dict): vv = json.dumps(vv, ensure_ascii=False)[:80]
                    bits.append(f"{kk}={txt(vv)}")
                buf.append(f"{pad}    {i+1}. " + '; '.join(bits)[:600])
    st = style(s)
    if st: buf.append(f"{pad}  - _style_: " + '; '.join(st))
    for c in n.get('elements', []) or []:
        walk(c, depth + 1, buf)

data = json.load(open(sys.argv[1]))
buf = []
for i, n in enumerate(data):
    buf.append(f"\n### Section {i+1}\n")
    walk(n, 0, buf)
print('\n'.join(buf))
