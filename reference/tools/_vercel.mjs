/**
 * Checks `api/booking.ts` the way VERCEL builds it, not the way a bundler would.
 *
 * Vercel transpiles each function file on its own and leaves the import
 * specifiers untouched. `esbuild --bundle` inlines every dependency and so
 * hides exactly the defect that per-file transpiling exposes — a relative
 * import here once shipped a `/var/task/src/server/booking.ts` that was never
 * copied, and the bundled check called it green.
 *
 * So: transpile only, assert nothing is left to resolve, then run the artifact.
 *
 *   node reference/tools/_vercel.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../../..");
const tmp = mkdtempSync(join(tmpdir(), "vercel-check-"));
const out = join(tmp, "booking.js");

let fail = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${extra ? "  " + extra : ""}`);
};

try {
  execFileSync(join(ROOT, "node_modules/.bin/esbuild"), [
    join(ROOT, "api/booking.ts"),
    "--format=esm",
    "--target=node20",
    `--outfile=${out}`,
  ], { stdio: "pipe" });
  check("transpiles on its own", true);
} catch (err) {
  check("transpiles on its own", false, String(err.stderr || err));
  process.exit(1);
}

// Only imports whose symbols are actually used survive: esbuild elides an
// unused one, and an elided import ships nothing to resolve. So this reads the
// transpiled output, never the source.
const js = readFileSync(out, "utf8");
const leftover = js.match(/^\s*import\s.*from\s.*$|require\(/gm) ?? [];
check("nothing left to resolve in /var/task", leftover.length === 0, leftover.join(" | "));

let handler;
try {
  handler = (await import(`file://${out}`)).default;
} catch (err) {
  // The production symptom itself: the artifact loads on Vercel or it does not.
  check("the transpiled artifact loads", false, String(err.message).split("\n")[0]);
  rmSync(tmp, { recursive: true, force: true });
  process.exit(1);
}
check("the transpiled artifact loads", typeof handler === "function");

const call = async (req, env = {}) => {
  const saved = { ...process.env };
  for (const k of ["NOTION_TOKEN", "NOTION_DATABASE_ID", "RESEND_API_KEY", "BOOKING_FROM", "BOOKING_TO"]) {
    delete process.env[k];
  }
  Object.assign(process.env, env);
  const res = { code: 0, body: null };
  const r = {
    status(c) { res.code = c; return r; },
    setHeader() {},
    json(b) { res.body = b; },
  };
  await handler(req, r);
  process.env = saved;
  return res;
};

const FULL = {
  NOTION_TOKEN: "x", NOTION_DATABASE_ID: "x", RESEND_API_KEY: "x",
  BOOKING_FROM: "x", BOOKING_TO: "x",
};
const BOOKING = {
  lang: "es", taxi: "Clásico", hora: "10:00", nombre: "A", apellido: "B",
  pais: "España", correo: "a@b.com", prefijo: "+34", telefono: "612345678",
  pasajeros: "2", recogida: "Aeropuerto",
};

let r = await call({ method: "GET" });
check("GET is rejected", r.code === 405 && r.body.error === "method");

r = await call({ method: "POST", body: {} });
check("missing env is config, and does not name the variables",
  r.code === 500 && r.body.error === "config" && !JSON.stringify(r.body).includes("NOTION"));

// The defect that cost a deploy: one pasted space made Notion 404 on an id that
// was actually correct, blaming the id and the integration share instead.
r = await call({ method: "POST", body: {} }, { ...FULL, NOTION_DATABASE_ID: "   " });
check("whitespace-only variable counts as missing", r.code === 500 && r.body.error === "config");

r = await call({ method: "POST", body: "not json" }, FULL);
check("malformed body", r.code === 400 && r.body.error === "malformed");

r = await call({ method: "POST", body: { lang: "es" } }, FULL);
check("empty booking is a field error, with no outbound call",
  r.code === 422 && r.body.field === "taxi");

r = await call({ method: "POST", body: { ...BOOKING, fecha: "2020-01-01" } }, FULL);
check("a past date never reaches Notion", r.code === 422 && r.body.error === "past");

rmSync(tmp, { recursive: true, force: true });
console.log(fail ? `\n${fail} check(s) failed` : "\nall checks passed");
process.exit(fail ? 1 : 0);
