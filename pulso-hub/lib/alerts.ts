import "server-only";
import { getProducts, getAdMetrics, getEmailMetrics, getMarketingKpis } from "@/lib/data";
import type { Alert } from "@/lib/types";

const RUNWAY_FLOOR_WEEKS = 8;

// Derives "what needs attention" from data the hub already has — nothing faked.
// Becomes real the moment Shopify/Meta/Klaviyo are live (same getters, real numbers).
export async function getAlerts(): Promise<Alert[]> {
  const [products, ads, email, kpis] = await Promise.all([
    getProducts(),
    getAdMetrics(),
    getEmailMetrics(),
    getMarketingKpis(),
  ]);
  const alerts: Alert[] = [];

  // Inventory — at/below reorder point.
  for (const p of products.filter((p) => p.stock <= p.reorderPoint)) {
    alerts.push({
      id: `stock-${p.id}`,
      severity: p.stock === 0 ? "critical" : "warn",
      area: "Inventory",
      title: `${p.title} — ${p.stock} left`,
      detail: p.stock === 0 ? "Out of stock. Reorder now." : `At/below reorder point (${p.reorderPoint}).`,
      href: "/ops/inventory",
    });
  }

  // Ads — campaigns below break-even, and blended efficiency.
  for (const c of ads.campaigns.filter((c) => c.roas < kpis.breakEvenRoas)) {
    alerts.push({
      id: `ad-${c.id}`,
      severity: "warn",
      area: "Ads",
      title: `${c.name} — ROAS ${c.roas.toFixed(2)}`,
      detail: `Below break-even (${kpis.breakEvenRoas.toFixed(2)}). ${c.status === "paused" ? "Already paused." : "Review or pause."}`,
      href: "/marketing/ads",
    });
  }
  if (ads.totals.roas < kpis.breakEvenRoas || ads.totals.cac > kpis.cac * 1.1) {
    alerts.push({
      id: "ad-blended",
      severity: "critical",
      area: "Ads",
      title: `Blended efficiency slipping — ROAS ${ads.totals.roas.toFixed(2)}, CAC €${ads.totals.cac.toFixed(0)}`,
      detail: `Break-even ROAS ${kpis.breakEvenRoas.toFixed(2)}, target CAC ≈ €${kpis.cac.toFixed(0)}.`,
      href: "/marketing/ads",
    });
  }

  // Finance — runway.
  if (kpis.runwayWeeks < RUNWAY_FLOOR_WEEKS) {
    alerts.push({
      id: "runway",
      severity: "critical",
      area: "Finance",
      title: `Runway ${kpis.runwayWeeks} weeks`,
      detail: `Below the ${RUNWAY_FLOOR_WEEKS}-week floor — slow spend or raise revenue.`,
      href: "/marketing/financials",
    });
  }

  // Email — deliverability ceilings.
  if (email.deliverability.spamRate > 0.001 || email.deliverability.bounceRate > 0.02) {
    alerts.push({
      id: "deliverability",
      severity: "warn",
      area: "Email",
      title: "Email deliverability needs attention",
      detail: `Spam ${(email.deliverability.spamRate * 100).toFixed(2)}% · bounce ${(email.deliverability.bounceRate * 100).toFixed(2)}%.`,
      href: "/marketing/email",
    });
  }

  // Surface the worst first.
  const rank = { critical: 0, warn: 1, info: 2 } as const;
  return alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
