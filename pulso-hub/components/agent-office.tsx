"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, Lock, FileText, Workflow, Wrench, ListTodo, Activity as ActivityIcon, Download, Maximize2 } from "lucide-react";
import type { Agent, Department } from "@/lib/types";
import { deptMeta, statusMeta } from "@/lib/agents-meta";
import { AgentAvatar } from "@/components/agent-avatar";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

const DEPT_ORDER: Department[] = [
  "Marketing", "Store", "Operations", "Retention", "Product", "Finance", "Customer Service",
];

export function AgentOffice({ agents }: { agents: Agent[] }) {
  const [tick, setTick] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // One heartbeat rotates every agent's "currently doing" line (staggered by offset).
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(t);
  }, []);

  const selected = agents.find((a) => a.id === selectedId) ?? null;

  const close = useCallback(() => setSelectedId(null), []);
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close]);

  const orchestrator = agents.find((a) => a.department === "Orchestration");
  const byDept = DEPT_ORDER.map((d) => ({ dept: d, members: agents.filter((a) => a.department === d) }))
    .filter((g) => g.members.length > 0);

  return (
    <div>
      {/* Preview banner + legend */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate">
          <Badge tone="amber">Preview</Badge>
          <span>Representative activity from each agent&apos;s spec — goes live when agents are deployed and reporting in.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate">
          {(["active", "thinking", "gate", "idle"] as const).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusMeta[s].color }} />
              {statusMeta[s].label}
            </span>
          ))}
        </div>
      </div>

      {/* Command room (Orchestrator) */}
      {orchestrator && (
        <RoomCard dept="Orchestration" count={1} wide>
          <AgentTile agent={orchestrator} tick={tick} onClick={() => setSelectedId(orchestrator.id)} index={0} big />
        </RoomCard>
      )}

      {/* Department rooms */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {byDept.map(({ dept, members }) => (
          <RoomCard key={dept} dept={dept} count={members.length}>
            <div className="grid grid-cols-1 gap-2">
              {members.map((a, i) => (
                <AgentTile key={a.id} agent={a} tick={tick} index={i} onClick={() => setSelectedId(a.id)} />
              ))}
            </div>
          </RoomCard>
        ))}
      </div>

      {selected && <AgentDrawer agent={selected} onClose={close} />}
    </div>
  );
}

function RoomCard({ dept, count, wide, children }: { dept: Department; count: number; wide?: boolean; children: React.ReactNode }) {
  const m = deptMeta[dept];
  const Icon = m.icon;
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-paper shadow-sm",
        wide && "border-l-4",
      )}
      style={wide ? { borderLeftColor: m.color } : undefined}
    >
      <header className="flex items-center justify-between border-b border-line/70 px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="grid h-6 w-6 place-items-center rounded-md" style={{ background: `${m.color}1A`, color: m.color }}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          {m.label}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-slate">{count === 1 ? "1 agent" : `${count} agents`}</span>
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

function AgentTile({ agent, tick, index, onClick, big }: { agent: Agent; tick: number; index: number; onClick: () => void; big?: boolean }) {
  const m = deptMeta[agent.department];
  const s = statusMeta[agent.status];
  const activity = agent.activities[(tick + index) % agent.activities.length];
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-line bg-white p-3 text-left transition hover:border-blue/40 hover:shadow-md",
        big && "gap-4 p-4",
      )}
    >
      <div className="shrink-0 rounded-lg" style={{ background: `${m.color}12` }}>
        <AgentAvatar color={m.color} status={agent.status} size={big ? 84 : 64} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("truncate font-semibold text-ink", big && "text-lg")}>{agent.name}</p>
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} title={s.label} />
        </div>
        <p className="truncate text-xs text-slate">{agent.title}</p>
        <p className="mt-1.5 line-clamp-2 text-xs text-ink/70">
          <span className="font-medium" style={{ color: m.color }}>{agent.status === "gate" ? "Waiting · " : ""}</span>
          {activity}
          <span className="agent-ellipsis">…</span>
        </p>
        {agent.status === "gate" && (
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
            <Lock className="h-3 w-3" /> Needs your approval
          </span>
        )}
      </div>
    </button>
  );
}

function AgentDrawer({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const m = deptMeta[agent.department];
  const s = statusMeta[agent.status];
  const Icon = m.icon;
  const [showBlueprint, setShowBlueprint] = useState(false);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm agent-fade" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl agent-slide">
        {/* header */}
        <div className="relative px-6 pt-6 pb-5" style={{ background: `linear-gradient(180deg, ${m.color}14, transparent)` }}>
          <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate hover:bg-paper" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="rounded-xl" style={{ background: `${m.color}12` }}>
              <AgentAvatar color={m.color} status={agent.status} size={84} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">{agent.name}</h2>
              <p className="text-sm text-slate">{agent.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: `${m.color}1A`, color: m.color }}>
                  <Icon className="h-3 w-3" /> {m.label}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-0.5 text-xs font-medium text-ink">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} /> {s.label}
                </span>
                <span className="rounded-full bg-paper px-2.5 py-0.5 text-xs text-slate">Phase {agent.phase}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink/80">{agent.blurb}</p>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* doing now */}
          <Section icon={<ActivityIcon className="h-4 w-4" />} title="Working on now">
            <p className="rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink">{agent.activities[0]}</p>
          </Section>

          {/* gate */}
          {agent.gate && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-700"><Lock className="h-4 w-4" /> Needs your approval</p>
              <p className="mt-1 text-sm text-amber-900/80">{agent.gate}</p>
              <div className="mt-3 flex items-center gap-2">
                <button disabled className="cursor-not-allowed rounded-lg bg-amber-600/40 px-3 py-1.5 text-sm font-medium text-white" title="Available when agents are live">Approve</button>
                <button disabled className="cursor-not-allowed rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-700" title="Available when agents are live">Hold</button>
                <span className="text-[11px] text-amber-700/70">Enabled when agents are live</span>
              </div>
            </div>
          )}

          {/* queue */}
          <Section icon={<ListTodo className="h-4 w-4" />} title="Task queue">
            <ul className="space-y-1.5">
              {agent.queue.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: m.color }} />
                  {q}
                </li>
              ))}
            </ul>
          </Section>

          {/* kpis */}
          <Section icon={<Workflow className="h-4 w-4" />} title="KPIs it watches">
            <div className="grid grid-cols-3 gap-2">
              {agent.kpis.map((k) => (
                <div key={k.label} className="rounded-xl border border-line bg-paper px-3 py-2.5">
                  <p className="text-base font-bold tabular-nums text-ink">{k.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-slate">{k.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* tools */}
          <Section icon={<Wrench className="h-4 w-4" />} title="Tools & systems">
            <div className="flex flex-wrap gap-1.5">
              {agent.tools.map((t) => (
                <span key={t} className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-ink/70">{t}</span>
              ))}
            </div>
          </Section>

          {/* log */}
          <Section icon={<ActivityIcon className="h-4 w-4" />} title="Recent activity">
            <ul className="space-y-2">
              {agent.log.map((l, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-12 shrink-0 tabular-nums text-slate">{l.time}</span>
                  <span className="text-ink/80">{l.text}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* refs */}
          <div className="space-y-2 border-t border-line pt-4">
            <button
              onClick={() => setShowBlueprint(true)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-paper px-3 py-2.5 text-left text-sm transition hover:border-blue/40 hover:bg-white"
            >
              <span className="inline-flex items-center gap-2 font-medium text-ink">
                <Workflow className="h-4 w-4" style={{ color: m.color }} /> View blueprint
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate">{agent.blueprint} <Maximize2 className="h-3.5 w-3.5" /></span>
            </button>
            <p className="flex items-center gap-1.5 px-1 text-xs text-slate">
              <FileText className="h-3.5 w-3.5" /> Spec: <code className="rounded bg-paper px-1 text-ink/70">{agent.spec}</code>
            </p>
          </div>
        </div>
      </aside>

      {showBlueprint && (
        <BlueprintLightbox
          name={agent.blueprint}
          title={`${deptMeta[agent.department].label} · ${agent.name}`}
          onClose={() => setShowBlueprint(false)}
        />
      )}
    </div>
  );
}

function BlueprintLightbox({ name, title, onClose }: { name: string; title: string; onClose: () => void }) {
  const base = name.replace(/\.excalidraw$/, "");
  const png = `/blueprints/bp-${base}.png`;
  const src = `/blueprints/${name}`;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-ink/80 backdrop-blur-sm agent-fade" onClick={onClose}>
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-chalk" onClick={(e) => e.stopPropagation()}>
        <p className="flex items-center gap-2 text-sm font-semibold"><Workflow className="h-4 w-4 text-blue" /> {title} — blueprint</p>
        <div className="flex items-center gap-2">
          <a href={src} download className="inline-flex items-center gap-1.5 rounded-lg border border-chalk/30 px-3 py-1.5 text-xs font-medium text-chalk hover:bg-white/10">
            <Download className="h-3.5 w-3.5" /> Download .excalidraw
          </a>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-chalk hover:bg-white/10" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto px-5 pb-6" onClick={(e) => e.stopPropagation()}>
        <Image src={png} alt={`${title} blueprint`} width={2200} height={1400} className="h-auto max-h-full w-auto max-w-full rounded-xl border border-white/10 shadow-2xl" />
      </div>
      <p className="pb-4 text-center text-xs text-chalk/60">Edit it at excalidraw.com — Menu → Open → the downloaded file. Press Esc to close.</p>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate">{icon}{title}</p>
      {children}
    </div>
  );
}
