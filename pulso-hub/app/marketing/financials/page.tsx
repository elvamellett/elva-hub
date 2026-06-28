import { PageHeader, StatCard, Card } from "@/components/ui";
import { MarketingTabs, DemoBadge } from "@/components/marketing-tabs";
import { ProgressRing, ProgressBar, Sparkline } from "@/components/charts";
import { getMarketingKpis } from "@/lib/data";
import { eur } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function FinancialsPage() {
  const k = await getMarketingKpis();
  const profitPct = k.netProfitThisMonth / k.netProfitTarget;
  const revPct = k.revenueThisMonth / k.revenueTarget;

  return (
    <div>
      <PageHeader title="Financials" subtitle="The single source of truth — progress toward €10k net/month." action={<DemoBadge />} />
      <MarketingTabs />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 p-6 lg:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate">Net profit · this month</p>
          <ProgressRing
            value={profitPct}
            label={`${Math.round(profitPct * 100)}%`}
            sublabel={`to €10k`}
            color="#2E6BFF"
            size={150}
          />
          <p className="text-center text-sm text-ink">
            <span className="font-bold">{eur(k.netProfitThisMonth, k.currency)}</span>
            <span className="text-slate"> / {eur(k.netProfitTarget, k.currency)} target</span>
          </p>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate">Revenue toward target</p>
          <div className="mb-1 flex items-end justify-between">
            <span className="text-2xl font-bold text-ink">{eur(k.revenueThisMonth, k.currency)}</span>
            <span className="text-sm text-slate">target {eur(k.revenueTarget, k.currency)}/mo</span>
          </div>
          <ProgressBar value={revPct} />
          <p className="mt-2 text-xs text-slate">≈ {k.ordersPerDayNeeded.toFixed(0)} orders/day at €{k.aov} AOV to hit the target.</p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate">Net profit trend (6 mo)</p>
            <div className="flex items-end gap-4">
              <Sparkline data={k.netProfitTrend} width={260} height={56} />
              <span className="text-sm text-slate">
                {k.netProfitTrend[0] < 0 ? "from loss" : "growing"} → {eur(k.netProfitTrend[k.netProfitTrend.length - 1], k.currency)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Net margin" value={`${Math.round(k.netMarginPct * 100)}%`} hint="target ≈ 20%" />
        <StatCard label="Blended ROAS" value={k.blendedRoas.toFixed(2)} hint={`break-even ${k.breakEvenRoas.toFixed(2)}`} />
        <StatCard label="MER" value={`${Math.round(k.merPct * 100)}%`} hint="of revenue on ads" />
        <StatCard label="Runway" value={`${k.runwayWeeks} wks`} hint="at current burn" />
      </div>

      <p className="mt-6 text-xs text-slate">
        Figures mirror <code className="rounded bg-paper px-1">financial-model.xlsx</code> (realistic scenario) and are assumptions to validate —
        they go live once Shopify, Meta and Klaviyo are all connected. No agent moves money; spend decisions stay with you.
      </p>
    </div>
  );
}
