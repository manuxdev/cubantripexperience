#!/usr/bin/env bash
# Download every image the Spanish Elementor specs reference, under its original
# WordPress filename, into reference/es/_media/.
# The spec.md files cite these names, so this removes any guesswork about which
# source image a section uses. Re-runnable; skips what is already downloaded.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="es/_media"; mkdir -p "$OUT"
python3 - "$OUT" <<'PY'
import json, glob, os, sys, urllib.parse, urllib.request
out = sys.argv[1]
urls = set()
def walk(n):
    for k, v in (n.get('settings', {}) or {}).items():
        if isinstance(v, dict) and '/uploads/' in str(v.get('url', '')):
            urls.add(v['url'])
        if isinstance(v, list):
            for it in v:
                if isinstance(it, dict): walk({'settings': it})
    for c in n.get('elements', []) or []: walk(c)
for f in glob.glob('es/*/elementor.json'):
    for n in json.load(open(f)): walk(n)
new = 0
failed = []
for u in sorted(urls):
    name = urllib.parse.unquote(u.split('/')[-1])
    dest = os.path.join(out, name)
    if os.path.exists(dest): continue
    safe = urllib.parse.quote(u, safe=':/')
    try:
        urllib.request.urlretrieve(safe, dest); new += 1
    except Exception as e:
        # WordPress converted several originals to .webp and dropped the source
        # file; those 404s have a lowercase .webp twin that IS downloaded.
        failed.append((name, str(e).split(':')[-1].strip()))
print(f"{len(urls)} referenced | {new} downloaded | {len(urls)-new-len(failed)} already present | {len(failed)} unavailable")
for n, e in failed: print(f"  unavailable: {n} ({e})")
PY
