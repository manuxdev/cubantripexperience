/**
 * The booking pipeline: validate, file the booking in Notion, then send the two
 * emails through Resend.
 *
 * Deliberately free of any host runtime — no Astro, no Node built-ins, only
 * `fetch`. The same module runs behind an Astro endpoint, a Vercel or Netlify
 * function, a Cloudflare worker or a plain `node --experimental-strip-types`
 * script, so choosing a host later does not mean rewriting this.
 *
 * NOTHING here reads a credential from source. Everything arrives in `env`, and
 * the caller is responsible for pulling that out of the platform's secret store.
 */
import { BOOKING_EMAIL } from "../i18n/booking-emails.ts";
import type { SiteLang } from "../i18n/site.ts";

export type BookingInput = {
  lang: SiteLang;
  taxi: string;
  /** `YYYY-MM-DD`, as the date input produces it. */
  fecha: string;
  /** `HH:MM`, 24-hour. The form's 12-hour branch is normalised before it gets here. */
  hora: string;
  nombre: string;
  apellido: string;
  pais: string;
  correo: string;
  /** E.164 dialling code, `+53`. */
  prefijo: string;
  /** National number, digits only. */
  telefono: string;
  pasajeros: string;
  /** The pick-up option the visitor chose. */
  recogida: string;
  /** Airport branch. */
  vuelo?: string;
  aeropuerto?: string;
  /** Address branch. */
  direccion?: string;
};

export type BookingEnv = {
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
  RESEND_API_KEY: string;
  /** Verified sender, e.g. `Cuban Trip Experience <reservas@cubantripexperience.com>`. */
  BOOKING_FROM: string;
  /** Where the team's copy lands. */
  BOOKING_TO: string;
};

export type BookingResult =
  | { ok: true; reference: number; emailed: boolean }
  | { ok: false; error: string; field?: string };

const NOTION_VERSION = "2022-06-28";

/** Today in Havana, as `YYYY-MM-DD`. The server's own clock is not the visitor's. */
const havanaToday = (): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Havana",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

/**
 * Cuba's UTC offset on a given day, as `-04:00` or `-05:00`.
 *
 * Notion stores the existing bookings with an explicit offset, and Cuba observes
 * DST — so a fixed `-05:00` would file every summer booking an hour early.
 * Derived from the zone itself rather than from a rule that changes.
 */
const havanaOffset = (isoDate: string): string => {
  const at = new Date(`${isoDate}T12:00:00Z`);
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Havana",
    timeZoneName: "longOffset",
  })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value;
  // "GMT-4" / "GMT-04:00" depending on the engine.
  const m = /GMT([+-])(\d{1,2})(?::?(\d{2}))?/.exec(name ?? "");
  if (!m) return "-05:00";
  return `${m[1]}${m[2].padStart(2, "0")}:${m[3] ?? "00"}`;
};

/** Exposed so the offset can be checked against real dates, not reasoned about. */
export const __offsetForTests = havanaOffset;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/**
 * The same rules the browser enforces, enforced again here.
 *
 * The client-side checks are a courtesy to the visitor; they are not a control.
 * Anything can POST to this endpoint, so every rule that matters is re-run on
 * data that has not been anywhere near our JavaScript.
 */
export const validate = (input: BookingInput): { field: string; error: string } | null => {
  const required: (keyof BookingInput)[] = [
    "taxi", "fecha", "hora", "nombre", "apellido",
    "pais", "correo", "prefijo", "telefono", "pasajeros", "recogida",
  ];
  for (const field of required) {
    if (!String(input[field] ?? "").trim()) return { field, error: "required" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.fecha)) return { field: "fecha", error: "malformed" };
  if (input.fecha < havanaToday()) return { field: "fecha", error: "past" };
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.hora)) return { field: "hora", error: "malformed" };
  if (!EMAIL_RE.test(input.correo)) return { field: "correo", error: "malformed" };
  if (!/^\+\d{1,4}$/.test(input.prefijo)) return { field: "prefijo", error: "malformed" };
  if (!/^\d{4,14}$/.test(input.telefono.replace(/[\s().-]/g, "")))
    return { field: "telefono", error: "malformed" };
  return null;
};

/** What goes in the `Recogida` column: an airport, or the address the visitor typed. */
const pickupLine = (input: BookingInput): string =>
  input.aeropuerto?.trim() || input.direccion?.trim() || input.recogida;

const notion = async (env: BookingEnv, path: string, body: unknown) => {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`notion ${path}: ${res.status} ${await res.text()}`);
  return res.json();
};

/**
 * The next `ID`, read from the highest one on file.
 *
 * The column is a plain number the team fills in by hand, not a Notion
 * auto-increment, so it has to be derived. Two bookings submitted in the same
 * second would collide — at this volume that is a rounding error, and a repeated
 * reference is a cosmetic problem, never a lost booking.
 */
const nextReference = async (env: BookingEnv): Promise<number> => {
  const data = (await notion(env, `databases/${env.NOTION_DATABASE_ID}/query`, {
    page_size: 1,
    sorts: [{ property: "ID", direction: "descending" }],
  })) as { results: { properties: { ID?: { number: number | null } } }[] };
  return (data.results[0]?.properties.ID?.number ?? 0) + 1;
};

const fileInNotion = async (env: BookingEnv, input: BookingInput, reference: number) => {
  const phone = `${input.prefijo}${input.telefono.replace(/[\s().-]/g, "")}`;
  const start = `${input.fecha}T${input.hora}:00${havanaOffset(input.fecha)}`;
  await notion(env, "pages", {
    parent: { database_id: env.NOTION_DATABASE_ID },
    properties: {
      Name: { title: [{ text: { content: `${input.nombre} ${input.apellido}`.trim() } }] },
      ID: { number: reference },
      Auto: { rich_text: [{ text: { content: input.taxi } }] },
      Fecha: { date: { start } },
      Correo: { email: input.correo },
      "Teléfono": { phone_number: phone },
      Recogida: { rich_text: [{ text: { content: pickupLine(input) } }] },
      Estado: { select: { name: "Pendiente" } },
    },
    // The database has no column for these, and adding one would alter a table
    // the team already works in. They go in the page body instead, where nothing
    // is lost and nothing existing is disturbed.
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              text: {
                content: [
                  `Idioma: ${input.lang}`,
                  `País: ${input.pais}`,
                  `Pasajeros: ${input.pasajeros}`,
                  input.vuelo?.trim() ? `Vuelo: ${input.vuelo}` : null,
                  input.direccion?.trim() ? `Dirección: ${input.direccion}` : null,
                  `Recogida (opción): ${input.recogida}`,
                ]
                  .filter(Boolean)
                  .join("\n"),
              },
            },
          ],
        },
      },
    ],
  });
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

const rows = (pairs: [string, string][]) =>
  pairs
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td>` +
        `<td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`
    )
    .join("");

const travellerEmail = (input: BookingInput, reference: number) => {
  const t = BOOKING_EMAIL[input.lang];
  const l = t.labels;
  const body = rows([
    [l.reference, `#${reference}`],
    [l.car, input.taxi],
    [l.date, `${input.fecha} ${input.hora}`],
    [l.passengers, input.pasajeros],
    [l.pickup, pickupLine(input)],
    [l.phone, `${input.prefijo} ${input.telefono}`],
  ]);
  return {
    subject: `${t.subject} — #${reference}`,
    html: `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#222;line-height:1.6">
<p>${escapeHtml(t.greeting(input.nombre))}</p>
<p>${escapeHtml(t.intro)}</p>
<h3 style="margin:24px 0 8px">${escapeHtml(t.detailsHeading)}</h3>
<table>${body}</table>
<p style="margin-top:24px">${escapeHtml(t.closing)}</p>
<p><strong>${escapeHtml(t.signature)}</strong></p>
</div>`,
  };
};

const teamEmail = (input: BookingInput, reference: number) => {
  const body = rows([
    ["Referencia", `#${reference}`],
    ["Nombre", `${input.nombre} ${input.apellido}`],
    ["Vehículo", input.taxi],
    ["Fecha y hora", `${input.fecha} ${input.hora}`],
    ["Pasajeros", input.pasajeros],
    ["Recogida", pickupLine(input)],
    ["Vuelo", input.vuelo ?? ""],
    ["País", input.pais],
    ["Correo", input.correo],
    ["Teléfono", `${input.prefijo} ${input.telefono}`],
    ["Idioma", input.lang],
  ]);
  return {
    subject: `Nueva reserva #${reference} — ${input.nombre} ${input.apellido}`,
    html: `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#222;line-height:1.6">
<table>${body}</table>
</div>`,
  };
};

const send = async (
  env: BookingEnv,
  to: string,
  mail: { subject: string; html: string },
  replyTo?: string
) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.BOOKING_FROM,
      to: [to],
      subject: mail.subject,
      html: mail.html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`resend: ${res.status} ${await res.text()}`);
};

export const createBooking = async (
  input: BookingInput,
  env: BookingEnv
): Promise<BookingResult> => {
  const invalid = validate(input);
  if (invalid) return { ok: false, error: invalid.error, field: invalid.field };

  let reference: number;
  try {
    reference = await nextReference(env);
    await fileInNotion(env, input, reference);
  } catch (cause) {
    // Nothing was filed, so nothing is confirmed: fail loudly and send no mail.
    console.error("booking: notion failed", cause);
    return { ok: false, error: "storage" };
  }

  // The booking EXISTS from here on. A mail failure must never turn it into an
  // error the visitor sees, or they will submit again and the team gets a
  // duplicate — so this reports success and flags the mail separately.
  try {
    await Promise.all([
      send(env, input.correo, travellerEmail(input, reference), env.BOOKING_TO),
      send(env, env.BOOKING_TO, teamEmail(input, reference), input.correo),
    ]);
    return { ok: true, reference, emailed: true };
  } catch (cause) {
    console.error(`booking: filed #${reference} but email failed`, cause);
    return { ok: true, reference, emailed: false };
  }
};
