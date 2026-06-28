import "server-only";
import { config } from "@/lib/config";
import type { AdMetrics } from "@/lib/types";

// Meta Marketing API client. Wired but only exercised when META_ACCESS_TOKEN is set;
// the data layer falls back to mock otherwise. Reads ad-account insights + campaigns.
const API = "https://graph.facebook.com/v21.0";

export async function getMetaAdMetrics(): Promise<AdMetrics> {
  const token = config.meta.token;
  const account = process.env.META_AD_ACCOUNT_ID ?? "";
  if (!token || !account) throw new Error("Meta not configured (META_ACCESS_TOKEN, META_AD_ACCOUNT_ID)");

  const fields = "spend,impressions,clicks,actions,action_values,purchase_roas";
  const res = await fetch(
    `${API}/act_${account}/insights?level=campaign&date_preset=last_14d&time_increment=1&fields=${fields}&access_token=${token}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Meta insights failed: ${res.status}`);
  const json = (await res.json()) as { data?: MetaRow[] };
  const rows = json.data ?? [];

  // Aggregate the raw insight rows into the dashboard shape.
  const byDay = new Map<string, { spend: number; revenue: number; clicks: number; impressions: number; purchases: number }>();
  for (const r of rows) {
    const day = r.date_start ?? "";
    const spend = Number(r.spend ?? 0);
    const revenue = Number(r.action_values?.find((a) => a.action_type === "purchase")?.value ?? 0);
    const purchases = Number(r.actions?.find((a) => a.action_type === "purchase")?.value ?? 0);
    const cur = byDay.get(day) ?? { spend: 0, revenue: 0, clicks: 0, impressions: 0, purchases: 0 };
    cur.spend += spend;
    cur.revenue += revenue;
    cur.clicks += Number(r.clicks ?? 0);
    cur.impressions += Number(r.impressions ?? 0);
    cur.purchases += purchases;
    byDay.set(day, cur);
  }
  const series = [...byDay.entries()].sort().map(([date, v]) => ({ date: `${date}T00:00:00Z`, ...v }));
  const sum = series.reduce((a, p) => ({ spend: a.spend + p.spend, revenue: a.revenue + p.revenue, clicks: a.clicks + p.clicks, impressions: a.impressions + p.impressions, purchases: a.purchases + p.purchases }), { spend: 0, revenue: 0, clicks: 0, impressions: 0, purchases: 0 });

  return {
    currency: process.env.META_CURRENCY ?? "EUR",
    series,
    totals: {
      ...sum,
      roas: sum.spend ? sum.revenue / sum.spend : 0,
      cac: sum.purchases ? sum.spend / sum.purchases : 0,
      ctr: sum.impressions ? sum.clicks / sum.impressions : 0,
      cpc: sum.clicks ? sum.spend / sum.clicks : 0,
    },
    campaigns: [],
  };
}

type MetaRow = {
  date_start?: string;
  spend?: string;
  clicks?: string;
  impressions?: string;
  actions?: { action_type: string; value: string }[];
  action_values?: { action_type: string; value: string }[];
};

// Live IG/FB follower counts + recent engagement — the parts the Meta Graph API
// can actually provide for content. TikTok + UGC stay manual (no server token here).
// Returns the platform/engagement subset that lib/data.ts merges over the mock baseline.
export async function getMetaContentInsights(): Promise<{
  platforms: { name: string; followers: number }[];
  engagementRate: number | null;
}> {
  const token = config.meta.token;
  const igUser = process.env.META_IG_USER_ID ?? "";
  const fbPage = process.env.META_FB_PAGE_ID ?? "";
  if (!token) throw new Error("Meta not configured (META_ACCESS_TOKEN)");

  const platforms: { name: string; followers: number }[] = [];
  let engagementRate: number | null = null;

  if (igUser) {
    const res = await fetch(`${API}/${igUser}?fields=followers_count,media_count&access_token=${token}`, { cache: "no-store" });
    if (res.ok) {
      const j = (await res.json()) as { followers_count?: number };
      if (typeof j.followers_count === "number") platforms.push({ name: "Instagram", followers: j.followers_count });
    }
    // Recent-media engagement (likes+comments / reach) on the latest posts.
    const m = await fetch(`${API}/${igUser}/media?fields=like_count,comments_count,insights.metric(reach)&limit=12&access_token=${token}`, { cache: "no-store" });
    if (m.ok) {
      const mj = (await m.json()) as { data?: { like_count?: number; comments_count?: number; insights?: { data?: { values?: { value?: number }[] }[] } }[] };
      const rows = mj.data ?? [];
      let eng = 0, reach = 0;
      for (const r of rows) {
        eng += (r.like_count ?? 0) + (r.comments_count ?? 0);
        reach += r.insights?.data?.[0]?.values?.[0]?.value ?? 0;
      }
      if (reach > 0) engagementRate = eng / reach;
    }
  }

  if (fbPage) {
    const res = await fetch(`${API}/${fbPage}?fields=fan_count&access_token=${token}`, { cache: "no-store" });
    if (res.ok) {
      const j = (await res.json()) as { fan_count?: number };
      if (typeof j.fan_count === "number") platforms.push({ name: "Facebook", followers: j.fan_count });
    }
  }

  return { platforms, engagementRate };
}
