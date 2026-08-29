/**
 * Checks the booking pipeline's pure parts: validation and the Havana offset.
 * Reads from Notion (the next reference) but never writes to it.
 */
const [token, db] = process.argv.slice(2);
const src = await import("../../src/server/booking.ts");
let fail = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${extra ? "  " + extra : ""}`);
};

const base = {
  lang: "es", taxi: "Estándar", fecha: "2099-06-19", hora: "05:00",
  nombre: "Ada", apellido: "Lovelace", pais: "Cuba", correo: "ada@example.com",
  prefijo: "+53", telefono: "53788250", pasajeros: "2",
  recogida: "Aeropuerto", aeropuerto: "Aeropuerto Internacional José Martí (La Habana)",
};

check("accepts a well-formed booking", src.validate(base) === null, JSON.stringify(src.validate(base)));
check("rejects a past date", src.validate({ ...base, fecha: "2000-01-01" })?.error === "past");
check("rejects a bad email", src.validate({ ...base, correo: "ada@" })?.field === "correo");
check("rejects a non-numeric phone", src.validate({ ...base, telefono: "12ab" })?.field === "telefono");
check("rejects a short phone", src.validate({ ...base, telefono: "123" })?.field === "telefono");
check("accepts a spaced phone", src.validate({ ...base, telefono: "5 378 8250" }) === null);
check("rejects a missing car", src.validate({ ...base, taxi: "  " })?.field === "taxi");
check("rejects a 25th hour", src.validate({ ...base, hora: "25:00" })?.field === "hora");
check("rejects a bare dialling code", src.validate({ ...base, prefijo: "53" })?.field === "prefijo");

// Cuba observes DST, and the rows already in Notion carry an explicit offset.
// A fixed -05:00 would file every summer booking an hour early.
const off = src.__offsetForTests ?? null;
if (off) {
  check("summer is -04:00", off("2026-06-19") === "-04:00", off("2026-06-19"));
  check("winter is -05:00", off("2026-02-15") === "-05:00", off("2026-02-15"));
}

if (token && db) {
  const res = await fetch(`https://api.notion.com/v1/databases/${db}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ page_size: 1, sorts: [{ property: "ID", direction: "descending" }] }),
  });
  const data = await res.json();
  const top = data.results?.[0]?.properties?.ID?.number;
  check("reads the highest reference from Notion", typeof top === "number", `#${top} → next #${top + 1}`);
}

console.log(fail ? `\n${fail} FAILED` : "\nall checks passed");
process.exit(fail ? 1 : 0);
