import type { AdMetrics, EmailMetrics, ContentMetrics, MarketingKpis } from "@/lib/types";

// Deterministic marketing demo data, anchored to 2026-06-28 and seeded from the
// financial model's "realistic" scenario (AOV €70, CAC €36.76, break-even ROAS 1.77,
// blended ROAS 2.84, MER 35.2%, net margin 20.2%, €10k net target). Representative
// until Meta/Klaviyo are connected — then lib/integrations/{meta,klaviyo}.ts take over.

const days = ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28"];
const spendSeq = [520, 540, 505, 560, 590, 610, 600, 575, 620, 640, 660, 635, 655, 581];
const roasSeq = [2.6, 2.4, 2.7, 2.9, 2.5, 2.8, 3.0, 2.6, 2.9, 3.1, 2.7, 2.8, 3.0, 2.84];

export const mockAdMetrics: AdMetrics = {
  currency: "EUR",
  series: days.map((d, i) => {
    const spend = spendSeq[i];
    const revenue = Math.round(spend * roasSeq[i]);
    const clicks = Math.round(spend / 0.88); // CPC €0.88
    const impressions = Math.round(clicks / 0.017); // CTR 1.7%
    const purchases = Math.round(revenue / 70); // AOV €70
    return { date: `2026-${d}T00:00:00Z`, spend, revenue, clicks, impressions, purchases };
  }),
  totals: {
    spend: 581,
    revenue: 1650,
    roas: 2.84,
    cac: 36.76,
    ctr: 0.017,
    cpc: 0.88,
    impressions: 38824,
    clicks: 660,
    purchases: 24,
  },
  campaigns: [
    { id: "c1", name: "Beginner Bundle — UGC", status: "active", spend: 184, revenue: 612, roas: 3.33, cpa: 31.2, flag: "scale" },
    { id: "c2", name: "Replenish Balls — Retargeting", status: "active", spend: 96, revenue: 358, roas: 3.73, cpa: 22.4 },
    { id: "c3", name: "Starter Kit — Broad", status: "active", spend: 142, revenue: 369, roas: 2.6, cpa: 38.9 },
    { id: "c4", name: "Club & Community — Reels", status: "active", spend: 89, revenue: 231, roas: 2.6, cpa: 37.1 },
    { id: "c5", name: "Cold Prospecting v3", status: "paused", spend: 70, revenue: 63, roas: 0.9, cpa: 70.0, flag: "kill" },
  ],
};

export const mockEmailMetrics: EmailMetrics = {
  currency: "EUR",
  revenueShare: 0.29,
  totalRevenue: 4789,
  openRate: 0.42,
  clickRate: 0.063,
  listSize: 3420,
  growth30d: 412,
  reorderRate: 0.34,
  deliverability: { spamRate: 0.0006, bounceRate: 0.012, unsubRate: 0.0008 },
  flows: [
    { name: "Welcome", status: "live", revenue: 1180, openRate: 0.55, clickRate: 0.09 },
    { name: "Abandoned cart", status: "live", revenue: 1420, openRate: 0.48, clickRate: 0.11, note: "recovers ~18% of carts" },
    { name: "Replenishment (balls/grips)", status: "live", revenue: 1310, openRate: 0.51, clickRate: 0.10, note: "fires ~24 days post-purchase" },
    { name: "Winback", status: "draft", revenue: 0, openRate: 0, clickRate: 0, note: "awaiting your approval" },
  ],
  campaigns: [
    { id: "k1", name: "New: Carbon Pro racket drop", sentDate: "2026-06-26T09:00:00Z", recipients: 3210, revenue: 612, openRate: 0.39 },
    { id: "k2", name: "Court-ready summer bundle", sentDate: "2026-06-21T09:00:00Z", recipients: 3080, revenue: 489, openRate: 0.41 },
    { id: "k3", name: "Grip tech 101", sentDate: "2026-06-16T09:00:00Z", recipients: 2950, revenue: 0, openRate: 0.44 },
  ],
};

export const mockContentMetrics: ContentMetrics = {
  postsThisWeek: 9,
  cadenceTarget: 10,
  engagementRate: 0.058,
  followerGrowth30d: 214,
  ugcSourced: 6,
  platforms: [
    { name: "Instagram", followers: 2840, growth30d: 142, postsThisWeek: 5 },
    { name: "TikTok", followers: 1960, growth30d: 64, postsThisWeek: 3 },
    { name: "Facebook", followers: 820, growth30d: 8, postsThisWeek: 1 },
  ],
  topPosts: [
    { id: "p1", platform: "TikTok", caption: "3 overgrip mistakes every beginner makes", engagementRate: 0.094, reach: 18200 },
    { id: "p2", platform: "Instagram", caption: "Starter kit unboxing — court-ready in one box", engagementRate: 0.071, reach: 9400 },
    { id: "p3", platform: "Instagram", caption: "When your balls lose bounce mid-match 😅", engagementRate: 0.066, reach: 7600 },
  ],
  winningAngles: ["Beginner mistakes / tips", "Starter-kit unboxing", "Consumable replenishment humour", "Club & community"],
  upcoming: [
    { when: "Today 17:00", platform: "Instagram", title: "Reel: 'find your racket' quiz teaser" },
    { when: "Tomorrow 12:00", platform: "TikTok", title: "UGC: @padelpaul first-session review" },
    { when: "Sat 10:00", platform: "Instagram", title: "Carousel: grip size guide" },
  ],
};

export const mockMarketingKpis: MarketingKpis = {
  currency: "EUR",
  netMarginPct: 0.202,
  aov: 70,
  cac: 36.76,
  breakEvenRoas: 1.77,
  blendedRoas: 2.84,
  merPct: 0.352,
  revenueThisMonth: 30240,
  revenueTarget: 49563,
  netProfitThisMonth: 6108,
  netProfitTarget: 10000,
  ordersPerDayNeeded: 23.6,
  runwayWeeks: 14,
  netProfitTrend: [-1850, -640, 980, 2400, 3850, 6108],
};
