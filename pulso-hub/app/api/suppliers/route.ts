import { NextResponse } from "next/server";
import { updateSupplier } from "@/lib/suppliers";
import type { SupplierStatus } from "@/lib/types";

const STATUSES: SupplierStatus[] = ["to-contact", "contacted", "quoted", "sampling", "approved", "rejected"];

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const patch: { status?: SupplierStatus; notes?: string } = {};
  if (body.status) {
    if (!STATUSES.includes(body.status)) return NextResponse.json({ error: "bad status" }, { status: 400 });
    patch.status = body.status;
  }
  if (typeof body.notes === "string") patch.notes = body.notes;

  const updated = updateSupplier(body.id, patch);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ supplier: updated });
}
