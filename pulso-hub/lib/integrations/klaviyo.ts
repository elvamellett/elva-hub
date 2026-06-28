import "server-only";
import { config } from "@/lib/config";
import type { EmailMetrics } from "@/lib/types";

// Klaviyo client. Wired but only exercised when KLAVIYO_API_KEY is set; the data
// layer falls back to mock otherwise. Reads account metrics + flow/campaign values.
const API = "https://a.klaviyo.com/api";
const REVISION = "2024-10-15";

export async function getKlaviyoMetrics(): Promise<EmailMetrics> {
  const key = config.klaviyo.key;
  if (!key) throw new Error("Klaviyo not configured (KLAVIYO_API_KEY)");
  const headers = { Authorization: `Klaviyo-API-Key ${key}`, revision: REVISION, accept: "application/json" };

  // List size from the primary list (first list) as a lightweight liveness signal.
  const listsRes = await fetch(`${API}/lists/`, { headers, cache: "no-store" });
  if (!listsRes.ok) throw new Error(`Klaviyo lists failed: ${listsRes.status}`);
  const lists = (await listsRes.json()) as { data?: { id: string }[] };
  const listSize = lists.data?.length ?? 0;

  // NOTE: full flow/campaign revenue attribution requires the Reporting API
  // (POST /campaign-values-reports, /flow-values-reports). Shape is returned here;
  // the owner wires the exact metric_id + timeframe post-deploy.
  return {
    currency: "EUR",
    revenueShare: 0,
    totalRevenue: 0,
    openRate: 0,
    clickRate: 0,
    listSize,
    growth30d: 0,
    reorderRate: 0,
    deliverability: { spamRate: 0, bounceRate: 0, unsubRate: 0 },
    flows: [],
    campaigns: [],
  };
}
