#!/usr/bin/env python3
"""Emit the three-step booking form's strings for each edition, from Fluent Forms."""
import json, subprocess, sys

FORM = {"es": 3, "en": 5, "ru": 7}
# Rendered by the plugin, read off the live page (`reference/tools/_step.mjs`).
# Russian is NOT translated there — the source shows the English string.
STEP_PREFIX = {"es": "Paso {n} de 3 - ", "en": "Step {n} of 3 - ", "ru": "Step {n} of 3 - "}
BUTTONS = {
    "es": {"next": "Siguiente", "prev": "Anterior", "submit": "Enviar"},
    "en": {"next": "Next", "prev": " Previous", "submit": "Submit"},
    "ru": {"next": " Следующий", "prev": "Бывший", "submit": "Oтправлять"},
}

def fields(fid):
    out = subprocess.run(["docker", "exec", "cubantripexperience-db-1", "sh", "-c",
        f'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" -N -B --raw -e \'SELECT form_fields FROM wp_fluentform_forms WHERE id={fid};\' wordpress'],
        capture_output=True, text=True).stdout
    return json.loads(out)

def collect(d):
    by_name, names = {}, {}
    def walk(items):
        for it in items:
            if not isinstance(it, dict):
                continue
            a = it.get("attributes") if isinstance(it.get("attributes"), dict) else {}
            s = it.get("settings") if isinstance(it.get("settings"), dict) else {}
            if a.get("name"):
                by_name[a["name"]] = {
                    "label": s.get("label", ""),
                    "placeholder": a.get("placeholder", ""),
                    "options": [o.get("label", "") for o in (s.get("advanced_options") or []) if isinstance(o, dict)],
                }
            if it.get("element") == "input_name":
                for k, f in (it.get("fields") or {}).items():
                    if isinstance(f, dict):
                        fs = f.get("settings") if isinstance(f.get("settings"), dict) else {}
                        fa = f.get("attributes") if isinstance(f.get("attributes"), dict) else {}
                        names[k] = {"label": fs.get("label", ""), "placeholder": fa.get("placeholder", "")}
            for c in (it.get("columns") or []):
                walk(c.get("fields") or [])
            if isinstance(it.get("fields"), list):
                walk(it["fields"])
    walk(d.get("fields", []))
    return by_name, names, (d.get("stepsWrapper") or {}).get("stepStart", {}).get("settings", {}).get("step_titles", [])

out = ['/**',
       ' * The three-step booking form\'s strings, per edition, read out of Fluent Forms',
       ' * 3 / 5 / 7 by `reference/tools/gen-booking-form.py`. Leading spaces are the',
       ' * source\'s own — several labels carry one.',
       ' *',
       ' * The Russian edition\'s step counter is NOT translated by the plugin: the source',
       ' * renders "Step 1 of 3" there too.',
       ' */',
       'import type { SiteLang } from "../i18n/site";',
       '',
       'export type Field = { label: string; placeholder: string; options: string[] };',
       '',
       'export type BookingForm = {',
       '  stepPrefix: string;',
       '  stepTitles: string[];',
       '  buttons: { next: string; prev: string; submit: string };',
       '  firstName: { label: string; placeholder: string };',
       '  lastName: { label: string; placeholder: string };',
       '  taxi: Field;',
       '  date: Field;',
       '  hour: Field;',
       '  hour12: Field;',
       '  format: Field;',
       '  country: Field;',
       '  email: Field;',
       '  phone: Field;',
       '  passengers: Field;',
       '  passengersVan: Field;',
       '  pickup: Field;',
       '  flight: Field;',
       '  airport: Field;',
       '  address: Field;',
       '  terms: Field;',
       '};',
       '',
       'export const BOOKING_FORM: Record<SiteLang, BookingForm> = {']
KEYS = [("taxi", "dropdown"), ("date", "datetime"), ("hour", "datetime_1"), ("hour12", "datetime_2"),
        ("format", "checkbox_1"), ("country", "country-list"), ("email", "email"), ("phone", "phone"),
        ("passengers", "dropdown_3"), ("passengersVan", "dropdown_4"), ("pickup", "dropdown_1"),
        ("flight", "input_text_1"), ("airport", "dropdown_5"), ("address", "input_text"), ("terms", "checkbox")]
for lang, fid in FORM.items():
    by_name, names, titles = collect(fields(fid))
    rec = {"stepPrefix": STEP_PREFIX[lang], "stepTitles": titles, "buttons": BUTTONS[lang],
           "firstName": names.get("first_name", {}), "lastName": names.get("last_name", {})}
    for key, src in KEYS:
        rec[key] = by_name.get(src, {"label": "", "placeholder": "", "options": []})
    out.append(f"  {lang}: " + json.dumps(rec, ensure_ascii=False, indent=2).replace("\n", "\n  ") + ",")
out.append("};")
sys.stdout.write("\n".join(out) + "\n")
