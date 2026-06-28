import { PageHeader, StatCard, Card, Badge } from "@/components/ui";
import { MarketingTabs, DemoBadge } from "@/components/marketing-tabs";
import { BarList } from "@/components/charts";
import { getContentMetrics } from "@/lib/data";

export const dynamic = "force-dynamic";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default async function ContentPage() {
  const c = await getContentMetrics();

  return (
    <div>
      <PageHeader title="Content & social" subtitle="The organic engine — cadence, engagement and the UGC pipeline." action={<DemoBadge />} />
      <MarketingTabs />
      <p className="mb-5 -mt-2 text-xs text-slate">Instagram &amp; Facebook follower/engagement go live with the Meta connection. TikTok and UGC tracking stay manual until a TikTok token is added.</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Posts this week" value={`${c.postsThisWeek}/${c.cadenceTarget}`} hint="cadence target" />
        <StatCard label="Engagement rate" value={pct(c.engagementRate)} />
        <StatCard label="Follower growth" value={`+${c.followerGrowth30d}`} hint="last 30 days" />
        <StatCard label="UGC sourced" value={String(c.ugcSourced)} hint="this month" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate">Followers by platform</p>
          <BarList items={c.platforms.map((p) => ({ label: p.name, value: p.followers, hint: `+${p.growth30d}` }))} format={(n) => n.toLocaleString()} />
        </Card>

        <Card className="p-5 lg:col-span-2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate">Top posts</p>
          <div className="space-y-3">
            {c.topPosts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{p.caption}</p>
                  <p className="text-xs text-slate">{p.platform} · reach {p.reach.toLocaleString()}</p>
                </div>
                <Badge tone="blue">{pct(p.engagementRate)} eng.</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate">Winning angles</p>
          <div className="flex flex-wrap gap-2">
            {c.winningAngles.map((a) => (
              <span key={a} className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink">{a}</span>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate">Upcoming</p>
          <ul className="space-y-2.5">
            {c.upcoming.map((u, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-28 shrink-0 text-slate">{u.when}</span>
                <span className="text-ink">{u.title} <span className="text-slate">· {u.platform}</span></span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
