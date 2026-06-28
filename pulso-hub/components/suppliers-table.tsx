"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, ExternalLink } from "lucide-react";
import { Table, Th, Td, Badge } from "@/components/ui";
import type { Supplier, SupplierStatus } from "@/lib/types";

const STATUSES: SupplierStatus[] = ["to-contact", "contacted", "quoted", "sampling", "approved", "rejected"];

const statusTone: Record<SupplierStatus, "neutral" | "blue" | "amber" | "green" | "red"> = {
  "to-contact": "neutral",
  contacted: "blue",
  quoted: "amber",
  sampling: "amber",
  approved: "green",
  rejected: "red",
};

export function SuppliersTable({ initial }: { initial: Supplier[] }) {
  const [rows, setRows] = useState(initial);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function setStatus(id: string, status: SupplierStatus) {
    setRows((r) => r.map((s) => (s.id === id ? { ...s, status } : s))); // optimistic
    await fetch("/api/suppliers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <Table>
      <thead>
        <tr><Th>Supplier</Th><Th>Type</Th><Th>Region</Th><Th>Contact</Th><Th>Lead</Th><Th>Status</Th><Th>Notes</Th></tr>
      </thead>
      <tbody>
        {rows.map((s) => (
          <tr key={s.id} className="hover:bg-paper/60">
            <Td>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs">
                <Badge tone={s.confidence === "verified" ? "green" : s.confidence === "register" ? "blue" : "amber"}>
                  {s.confidence}
                </Badge>
              </div>
            </Td>
            <Td className="whitespace-nowrap text-slate">{s.kind}</Td>
            <Td className="text-slate">{s.region}</Td>
            <Td>
              <div className="flex items-center gap-2">
                {s.email ? (
                  <a
                    className="inline-flex items-center gap-1 text-blue hover:underline"
                    href={`https://mail.google.com/mail/u/0/#search/from:${encodeURIComponent(s.email)}`}
                    target="_blank" rel="noreferrer"
                    title="Open Gmail threads"
                  >
                    <Mail className="h-3.5 w-3.5" /> {s.email}
                  </a>
                ) : s.contactUrl ? (
                  <a className="inline-flex items-center gap-1 text-blue hover:underline" href={s.contactUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" /> Contact form
                  </a>
                ) : (
                  <span className="text-slate">—</span>
                )}
              </div>
            </Td>
            <Td className="tabular-nums text-slate">{s.leadTimeDays ? `${s.leadTimeDays}d` : "—"}</Td>
            <Td>
              <div className="flex items-center gap-2">
                <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                <select
                  aria-label={`Set status for ${s.name}`}
                  value={s.status}
                  onChange={(e) => setStatus(s.id, e.target.value as SupplierStatus)}
                  className="rounded-md border border-line bg-white px-2 py-1 text-xs text-ink focus:border-blue focus:outline-none"
                >
                  {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </Td>
            <Td className="max-w-[16rem] text-xs text-slate">{s.notes ?? "—"}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
