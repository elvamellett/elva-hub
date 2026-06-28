import { PageHeader, StatCard, Card, Badge, Table, Th, Td } from "@/components/ui";
import { MarketingTabs, DemoBadge } from "@/components/marketing-tabs";
import { getEmailMetrics } from "@/lib/data";
import { eur, shortDate } from "@/lib/cn";

export const dynamic = "force-dynamic";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default async function EmailPage() {
  const e = await getEmailMetrics();

  return (
    <div>
      <PageHeader title="Email (Klaviyo)" subtitle="Repeat revenue with no new ad cost — the profit lever." action={<DemoBadge />} />
      <MarketingTabs />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Email rev share" value={pct(e.revenueShare)} hint="target 25–35%" />
        <StatCard label="Reorder rate" value={pct(e.reorderRate)} hint="consumables" />
        <StatCard label="List size" value={e.listSize.toLocaleString()} hint={`+${e.growth30d} in 30d`} />
        <StatCard label="Open / click" value={`${pct(e.openRate)} / ${pct(e.clickRate)}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate">Flows</h2>
          <Table>
            <thead><tr><Th>Flow</Th><Th>Status</Th><Th>Revenue</Th><Th>Open</Th><Th>Click</Th></tr></thead>
            <tbody>
              {e.flows.map((f) => (
                <tr key={f.name} className="hover:bg-paper/60">
                  <Td className="font-medium">{f.name}{f.note && <span className="block text-xs font-normal text-slate">{f.note}</span>}</Td>
                  <Td><Badge tone={f.status === "live" ? "green" : "amber"}>{f.status}</Badge></Td>
                  <Td className="tabular-nums">{eur(f.revenue, e.currency)}</Td>
                  <Td className="tabular-nums">{f.openRate ? pct(f.openRate) : "—"}</Td>
                  <Td className="tabular-nums">{f.clickRate ? pct(f.clickRate) : "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate">Recent campaigns</h2>
          <Table>
            <thead><tr><Th>Campaign</Th><Th>Sent</Th><Th>Recipients</Th><Th>Revenue</Th><Th>Open</Th></tr></thead>
            <tbody>
              {e.campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-paper/60">
                  <Td className="font-medium">{c.name}</Td>
                  <Td className="text-slate">{shortDate(c.sentDate)}</Td>
                  <Td className="tabular-nums">{c.recipients.toLocaleString()}</Td>
                  <Td className="tabular-nums">{eur(c.revenue, e.currency)}</Td>
                  <Td className="tabular-nums">{pct(c.openRate)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate">Deliverability</h2>
          <Card className="space-y-4 p-5">
            {[
              { label: "Spam rate", value: e.deliverability.spamRate, ceiling: 0.001, fmt: (n: number) => `${(n * 100).toFixed(2)}%` },
              { label: "Bounce rate", value: e.deliverability.bounceRate, ceiling: 0.02, fmt: (n: number) => `${(n * 100).toFixed(2)}%` },
              { label: "Unsub rate", value: e.deliverability.unsubRate, ceiling: 0.002, fmt: (n: number) => `${(n * 100).toFixed(2)}%` },
            ].map((d) => {
              const ok = d.value <= d.ceiling;
              return (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-sm text-ink">{d.label}</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="tabular-nums text-sm text-slate">{d.fmt(d.value)}</span>
                    <Badge tone={ok ? "green" : "red"}>{ok ? "healthy" : "watch"}</Badge>
                  </span>
                </div>
              );
            })}
            <p className="border-t border-line pt-3 text-xs text-slate">Marketing deliverability needs pulso.ie authenticated (SPF/DKIM/DMARC) — see the retention plan.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
