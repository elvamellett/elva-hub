export type Order = {
  id: string;
  name: string; // #1001
  customer: string;
  total: number;
  currency: string;
  financialStatus: "paid" | "pending" | "refunded";
  fulfillmentStatus: "unfulfilled" | "fulfilled" | "partial";
  createdAt: string; // ISO
  items: number;
};

export type Product = {
  id: string;
  title: string;
  sku: string;
  type: string;
  price: number;
  stock: number;
  reorderPoint: number;
};

export type EmailThread = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string; // ISO
  unread: boolean;
};

export type DriveFile = {
  id: string;
  name: string;
  kind: "folder" | "doc" | "sheet" | "image" | "pdf" | "other";
  modified: string; // ISO
  url: string;
};

export type SupplierStatus =
  | "to-contact"
  | "contacted"
  | "quoted"
  | "sampling"
  | "approved"
  | "rejected";

export type Supplier = {
  id: string;
  name: string;
  kind: "EU distributor" | "Factory (OEM)" | "POD" | "Other";
  region: string;
  email: string;
  contactUrl?: string;
  confidence: "verified" | "guess/form" | "register";
  status: SupplierStatus;
  leadTimeDays?: number;
  notes?: string;
};

export type Kpis = {
  ordersToday: number;
  revenueToday: number;
  unitsToday: number;
  lowStock: number;
  suppliersToFollowUp: number;
  unreadEmails: number;
  currency: string;
};

// --- Agent Office ---------------------------------------------------------

export type Department =
  | "Orchestration"
  | "Marketing"
  | "Store"
  | "Operations"
  | "Retention"
  | "Product"
  | "Finance"
  | "Customer Service";

// active = working now · thinking = analysing · gate = waiting on your approval · idle = nothing queued
export type AgentStatus = "active" | "thinking" | "gate" | "idle";

export type Agent = {
  id: string;
  name: string; // role name, e.g. "Paid Ads"
  title: string; // human-style job title, e.g. "Media Buyer"
  department: Department;
  room: string; // office room label, e.g. "Growth Bay"
  status: AgentStatus;
  phase: 1 | 2 | 3; // rollout phase
  blurb: string; // one-line what it does
  activities: string[]; // rotating "currently doing…" lines (from the spec)
  queue: string[]; // upcoming tasks
  gate?: string; // pending human-approval item, if any
  tools: string[]; // systems it runs on
  kpis: { label: string; value: string }[];
  log: { time: string; text: string }[]; // recent activity (newest first)
  blueprint: string; // blueprints/<file>.excalidraw
  spec: string; // agents/<file>.md
};

// --- Marketing dashboard (v2) ---------------------------------------------

export type DayPoint = { date: string; spend: number; revenue: number; clicks: number; impressions: number; purchases: number };

export type AdCampaign = {
  id: string;
  name: string;
  status: "active" | "paused";
  spend: number;
  revenue: number;
  roas: number;
  cpa: number; // cost per acquisition
  flag?: "scale" | "kill"; // agent recommendation
};

export type AdMetrics = {
  currency: string;
  series: DayPoint[]; // last ~14 days
  totals: { spend: number; revenue: number; roas: number; cac: number; ctr: number; cpc: number; impressions: number; clicks: number; purchases: number };
  campaigns: AdCampaign[];
};

export type EmailFlow = { name: string; status: "live" | "draft"; revenue: number; openRate: number; clickRate: number; note?: string };

export type EmailMetrics = {
  currency: string;
  revenueShare: number; // 0-1 of total revenue from email
  totalRevenue: number;
  openRate: number;
  clickRate: number;
  listSize: number;
  growth30d: number;
  reorderRate: number;
  deliverability: { spamRate: number; bounceRate: number; unsubRate: number };
  flows: EmailFlow[];
  campaigns: { id: string; name: string; sentDate: string; recipients: number; revenue: number; openRate: number }[];
};

export type ContentMetrics = {
  postsThisWeek: number;
  cadenceTarget: number;
  engagementRate: number;
  followerGrowth30d: number;
  ugcSourced: number;
  platforms: { name: string; followers: number; growth30d: number; postsThisWeek: number }[];
  topPosts: { id: string; platform: string; caption: string; engagementRate: number; reach: number }[];
  winningAngles: string[];
  upcoming: { when: string; platform: string; title: string }[];
};

export type MarketingKpis = {
  currency: string;
  netMarginPct: number;
  aov: number;
  cac: number;
  breakEvenRoas: number;
  blendedRoas: number;
  merPct: number;
  revenueThisMonth: number;
  revenueTarget: number;
  netProfitThisMonth: number;
  netProfitTarget: number;
  ordersPerDayNeeded: number;
  runwayWeeks: number;
  netProfitTrend: number[]; // recent months, for a sparkline
};
