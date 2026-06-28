import Link from "next/link";
import { Users, Lock, ArrowRight } from "lucide-react";
import { getKpis, getOrders, getProducts, getThreads, getAgents } from "@/lib/data";
import { getAlerts } from "@/lib/alerts";
import { PageHeader, StatCard, Card, Badge, Table, Th, Td } from "@/components/ui";
import { AlertsBanner } from "@/components/alerts-banner";
import { eur, shortDate } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function Overview() {
  const [kpis, orders, products, threads, agents, alerts] = await Promise.all([
    getKpis(),
    getOrders(),
    getProducts(),
    getThreads(),
    getAgents(),
    getAlerts(),
  ]);
  const recent = orders.slice(0, 5);
  const low = products.filter((p) => p.stock <= p.reorderPoint);
  const working = agents.filter((a) => a.status === "active" || a.status === "thinking").length;
  const needYou = agents.filter((a) => a.status === "gate").length;

  return (
    <div>
      <PageHeader title="Overview" subtitle="Your PULSO operations at a glance." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Orders today" value={String(kpis.ordersToday)} />
        <StatCard label="Revenue today" value={eur(kpis.revenueToday, kpis.currency)} />
        <StatCard label="Units today" value={String(kpis.unitsToday)} />
        <StatCard label="Low stock" value={String(kpis.lowStock)} hint="at/below reorder point" alert={kpis.lowStock > 0} />
        <StatCard label="Suppliers to chase" value={String(kpis.suppliersToFollowUp)} />
        <StatCard label="Unread supplier mail" value={String(kpis.unreadEmails)} />
      </div>

      <AlertsBanner alerts={alerts} />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/ops/agents"
          className="flex flex-1 items-center justify-between gap-4 rounded-2xl border border-line bg-ink px-5 py-4 text-chalk shadow-sm transition hover:bg-ink/90"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue/20 text-blue"><Users className="h-5 w-5" /></span>
            <span>
              <span className="block text-sm font-semibold text-white">Agent Office</span>
              <span className="block text-xs text-chalk/70">{working} agents at work</span>
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue">Open <ArrowRight className="h-3.5 w-3.5" /></span>
        </Link>
        <Link
          href="/ops/approvals"
          className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm transition hover:bg-amber-100 sm:w-64"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-200 text-amber-700"><Lock className="h-4 w-4" /></span>
            <span>
              <span className="block text-sm font-semibold text-amber-800">{needYou} need you</span>
              <span className="block text-xs text-amber-700/80">Approvals waiting</span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4 text-amber-700" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate">Recent orders</h2>
            <Link href="/ops/orders" className="text-xs font-medium text-blue hover:underline">View all →</Link>
          </div>
          <Table>
            <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th></tr></thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id}>
                  <Td className="font-medium">{o.name}</Td>
                  <Td>{o.customer}</Td>
                  <Td className="tabular-nums">{eur(o.total, o.currency)}</Td>
                  <Td>
                    <Badge tone={o.fulfillmentStatus === "fulfilled" ? "green" : o.fulfillmentStatus === "partial" ? "amber" : "blue"}>
                      {o.fulfillmentStatus}
                    </Badge>
                  </Td>
                  <Td className="text-slate">{shortDate(o.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate">Low-stock alerts</h2>
            <Card className="divide-y divide-line">
              {low.length === 0 && <p className="px-4 py-4 text-sm text-slate">All good — nothing below reorder point.</p>}
              {low.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-slate">{p.sku}</p>
                  </div>
                  <Badge tone="red">{p.stock} left</Badge>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate">Supplier inbox</h2>
              <Link href="/ops/inbox" className="text-xs font-medium text-blue hover:underline">Open →</Link>
            </div>
            <Card className="divide-y divide-line">
              {threads.slice(0, 4).map((t) => (
                <div key={t.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium">{t.subject}</p>
                    {t.unread && <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-blue" />}
                  </div>
                  <p className="truncate text-xs text-slate">{t.from}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
