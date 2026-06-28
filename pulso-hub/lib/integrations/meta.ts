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
