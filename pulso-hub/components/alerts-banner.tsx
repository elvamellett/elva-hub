import Link from "next/link";
import { AlertTriangle, CircleAlert, CheckCircle2, ArrowRight } from "lucide-react";
import type { Alert } from "@/lib/types";
import { cn } from "@/lib/cn";

const sev = {
  critical: { dot: "bg-red-500", chip: "bg-red-100 text-red-700", icon: CircleAlert },
  warn: { dot: "bg-amber-500", chip: "bg-amber-100 text-amber-700", icon: AlertTriangle },
  info: { dot: "bg-blue", chip: "bg-blue/10 text-blue", icon: AlertTriangle },
};

export function AlertsBanner({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-slate shadow-sm">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> All clear — nothing needs your attention right now.
      </div>
    );
  }
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <AlertTriangle className="h-4 w-4 text-amber-500" /> Needs attention
        </p>
        <span className="rounded-full bg-chalk px-2 py-0.5 text-xs font-medium text-slate">{alerts.length}</span>
      </div>
      <ul className="divide-y divide-line">
        {alerts.map((a) => {
          const s = sev[a.severity];
          const Icon = s.icon;
          return (
            <li key={a.id}>
              <Link href={a.href} className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-paper">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", s.dot)} />
                <Icon className="h-4 w-4 shrink-0 text-slate" />
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-ink">{a.title}</span>
                  <span className="ml-2 text-xs text-slate">{a.detail}</span>
                </span>
                <span className={cn("hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline", s.chip)}>{a.area}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
