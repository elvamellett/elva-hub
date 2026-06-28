import "server-only";
import fs from "node:fs";
import path from "node:path";
import seed from "@/data/suppliers.json";
import type { Supplier, SupplierStatus } from "@/lib/types";

// v1 supplier store: a JSON file (works locally). On a read-only host (e.g. Vercel)
// writes fall back to an in-memory copy for the session and should be swapped for
// Postgres in production — see pulso-hub/README.md.
const FILE = path.join(process.cwd(), "data", "suppliers.json");
let memory: Supplier[] | null = null;

function load(): Supplier[] {
  if (memory) return memory;
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    memory = JSON.parse(raw) as Supplier[];
  } catch {
    memory = seed as Supplier[];
  }
  return memory;
}

export function getSuppliers(): Supplier[] {
  return load();
}

export function updateSupplier(
  id: string,
  patch: { status?: SupplierStatus; notes?: string },
): Supplier | null {
  const list = load();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  memory = list;
  try {
    fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
  } catch {
    // read-only filesystem (prod host) — kept in memory for the session.
  }
  return list[idx];
}
