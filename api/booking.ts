/**
 * `POST /api/booking` — the only server the site has.
 *
 * A plain Vercel Function sitting beside the static build, NOT an Astro
 * endpoint: Astro is on 2.9 with `output: "static"` and no adapter, so serving a
 * route from it would mean an adapter plus `experimental.hybridOutput` and a
 * rebuild of all 33 pages to gain nothing this file does not already do.
 * Vercel picks up `api/` next to any framework.
 *
 * All the work is in `src/server/booking.ts`, which knows nothing about Vercel.
 */
import { createBooking } from "../src/server/booking.ts";
import type { BookingEnv, BookingInput } from "../src/server/booking.ts";

/** The slice of Vercel's Node signature this handler actually touches. */
type Req = { method?: string; body?: unknown };
type Res = {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

const REQUIRED_ENV = [
  "NOTION_TOKEN",
  "NOTION_DATABASE_ID",
  "RESEND_API_KEY",
  "BOOKING_FROM",
  "BOOKING_TO",
] as const;

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "method" });
    return;
  }

  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    // Never name the variables in the response — that is a map of the setup for
    // anyone probing the endpoint. The log is where an operator looks.
    console.error("booking: missing env", missing.join(", "));
    res.status(500).json({ ok: false, error: "config" });
    return;
  }

  const body = (typeof req.body === "string" ? safeParse(req.body) : req.body) as
    | Partial<BookingInput>
    | null;
  if (!body || typeof body !== "object") {
    res.status(400).json({ ok: false, error: "malformed" });
    return;
  }

  const env = Object.fromEntries(
    REQUIRED_ENV.map((key) => [key, process.env[key] as string])
  ) as BookingEnv;

  const result = await createBooking(body as BookingInput, env);
  // A rejected booking is the visitor's input, not a server failure: 422 keeps
  // it apart from the 500s an operator needs to see.
  res.status(result.ok ? 200 : result.error === "storage" ? 502 : 422).json(result);
}

const safeParse = (s: string) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};
