import Link from "next/link";
import { Megaphone, Send, Sparkles, LineChart, ArrowRight } from "lucide-react";
import { PageHeader, StatCard, Card } from "@/components/ui";
import { MarketingTabs, DemoBadge } from "@/components/marketing-tabs";
import { getAdMetrics, getEmailMetrics, getMarketingKpis } from "@/lib/data";
import { eur } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const [ads, email, kpis] = await Promise.all([getAdMetrics(), getEmailMetrics(), getMarketingKpis()]);

  const sections = [
    { href: "/marketing/ads", icon: Megaphone, title: "Ad performance", desc: `Blended ROAS ${ads.totals.roas.toFixed(2)} · CAC ${eur(ads.totals.cac, ads.currency)}` },
    { href: "/marketing/email", icon: Send, title: "Email (Klaviyo)", desc: `${Math.round(email.revenueShare * 100)}% of revenue · reorder ${Math.round(email.reorderRate * 100)}%` },
    { href: "/marketing/content", icon: Sparkles, title: "Content & social", desc: "Cadence, engagement & UGC pipeline" },
    { href: "/marketing/financials", icon: LineChart, title: "Financials", desc: `Net margin ${Math.round(kpis.netMarginPct * 100)}% · progress to €10k net` },
  ];

  return (
    <div>
      <PageHeader title="Marketing" subtitle="Demand, retention and the numbers behind the €10k net goal." action={<DemoBadge />} />
      <MarketingTabs />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Blended ROAS" value={ads.totals.roas.toFixed(2)} hint={`break-even ${kpis.breakEvenRoas.toFixed(2)}`} />
        <StatCard label="CAC" value={eur(ads.totals.cac, ads.currency)} hint="target ≈ €37" />
        <StatCard label="Email rev share" value={`${Math.round(email.revenueShare * 100)}%`} hint="target 25–35%" />
        <StatCard label="MER" value={`${Math.round(kpis.merPct * 100)}%`} hint="marketing efficiency ratio" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="flex items-center gap-4 p-5 transition hover:border-blue/40 hover:shadow-md">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-0.5 text-sm text-slate">{s.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
