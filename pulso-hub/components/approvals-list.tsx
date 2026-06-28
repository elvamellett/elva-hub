"use client";

import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import type { Agent } from "@/lib/types";
import { deptMeta } from "@/lib/agents-meta";
import { AgentAvatar } from "@/components/agent-avatar";
import { EmptyHint } from "@/components/ui";

// One queue of every agent waiting on a human decision. Approve/Hold are
// demo-disabled until the agents are actually deployed (same as the office drawer).
export function ApprovalsList({ agents }: { agents: Agent[] }) {
  // Only agents actively blocked on a decision (status "gate"), not every agent
  // that merely has an approval policy — those have status active/thinking.
  const pending = agents.filter((a) => a.status === "gate" && a.gate);

  if (pending.length === 0) {
    return <EmptyHint>Nothing waiting on you right now. Agents will queue approvals here when they need a decision.</EmptyHint>;
  }

  return (
    <div className="space-y-3">
      {pending.map((a) => {
        const m = deptMeta[a.department];
        return (
          <div key={a.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start gap-4">
              <div className="shrink-0 rounded-xl" style={{ background: `${m.color}12` }}>
                <AgentAvatar color={m.color} status="gate" size={56} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{a.name}</p>
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: `${m.color}1A`, color: m.color }}>{m.label}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700"><Lock className="h-3 w-3" /> Needs you</span>
                </div>
                <p className="mt-1.5 text-sm text-ink/80">{a.gate}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button disabled title="Available when agents are live" className="cursor-not-allowed rounded-lg bg-emerald-600/40 px-3 py-1.5 text-sm font-medium text-white">Approve</button>
                  <button disabled title="Available when agents are live" className="cursor-not-allowed rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-slate">Hold</button>
                  <Link href="/ops/agents" className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-blue hover:underline">
                    Open in office <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="text-[11px] text-slate">Enabled when agents are live</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
