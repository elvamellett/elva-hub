import { PageHeader, StatCard, Card, Badge, Table, Th, Td } from "@/components/ui";
import { MarketingTabs, DemoBadge } from "@/components/marketing-tabs";
import { SpendRevenueBars } from "@/components/charts";
import { getAdMetrics } from "@/lib/data";
import { eur } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function AdsPage() {
  const ads = await getAdMetrics();
  const t = ads.totals;

  return (
    <div>
      <PageHeader title="Ad performance" subtitle="Meta Ads — spend, return and the testing framework at a glance." action={<DemoBadge />} />
      <MarketingTabs />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Spend (today)" value={eur(t.spend, ads.currency)} />
        <StatCard label="Blended ROAS" value={t.roas.toFixed(2)} hint="break-even 1.77" />
        <StatCard label="CAC" value={eur(t.cac, ads.currency)} hint="target ≈ €37" />
        <StatCard label="CTR" value={`${(t.ctr * 100).toFixed(1)}%`} hint={`CPC ${eur(t.cpc, ads.currency)}`} />
      </div>

      <Card className="mt-6 p-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate">Spend vs revenue · last 14 days</p>
        <SpendRevenueBars series={ads.series} />
      </Card>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate">Campaigns &amp; ad sets</h2>
        <Table>
          <thead><tr><Th>Campaign</Th><Th>Status</Th><Th>Spend</Th><Th>Revenue</Th><Th>ROAS</Th><Th>CPA</Th><Th>Agent flag</Th></tr></thead>
          <tbody>
            {ads.campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-paper/60">
                <Td className="font-medium">{c.name}</Td>
                <Td><Badge tone={c.status === "active" ? "green" : "neutral"}>{c.status}</Badge></Td>
                <Td className="tabular-nums">{eur(c.spend, ads.currency)}</Td>
                <Td className="tabular-nums">{eur(c.revenue, ads.currency)}</Td>
                <Td className="tabular-nums font-medium">{c.roas.toFixed(2)}</Td>
                <Td className="tabular-nums">{eur(c.cpa, ads.currency)}</Td>
                <Td>
                  {c.flag === "scale" && <Badge tone="blue">scale ↑</Badge>}
                  {c.flag === "kill" && <Badge tone="red">kill</Badge>}
                  {!c.flag && <span className="text-slate">—</span>}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p className="mt-3 text-xs text-slate">Flags are the Paid Ads agent&apos;s recommendations. Scaling spend stays behind your approval (see Approvals).</p>
      </div>
    </div>
  );
}
