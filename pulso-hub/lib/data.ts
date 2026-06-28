import "server-only";
import { config, useMocks } from "@/lib/config";
import { mockOrders, mockProducts, mockThreads, mockDriveFiles } from "@/lib/mock/data";
import { mockAgents } from "@/lib/mock/agents";
import { mockAdMetrics, mockEmailMetrics, mockContentMetrics, mockMarketingKpis } from "@/lib/mock/marketing";
import type { Order, Product, EmailThread, DriveFile, Kpis, Agent, AdMetrics, EmailMetrics, ContentMetrics, MarketingKpis } from "@/lib/types";

// Facade: returns live data when an integration is connected, otherwise mock data.
// Live Shopify is wired; Gmail/Drive live calls require the Google OAuth session
// token and are mocked in v1 (see README → "Going live").

export async function getOrders(): Promise<Order[]> {
  if (!useMocks && config.shopify.connected) {
    try {
      const { getShopifyOrders } = await import("@/lib/integrations/shopify");
      return await getShopifyOrders();
    } catch (e) {
      console.error("Shopify orders failed, using mock:", e);
    }
  }
  return mockOrders;
}

export async function getProducts(): Promise<Product[]> {
  if (!useMocks && config.shopify.connected) {
    try {
      const { getShopifyProducts } = await import("@/lib/integrations/shopify");
      return await getShopifyProducts();
    } catch (e) {
      console.error("Shopify products failed, using mock:", e);
    }
  }
  return mockProducts;
}

async function googleToken(): Promise<string | null> {
  if (!config.authConfigured) return null;
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    return session?.accessToken ?? null;
  } catch (e) {
    console.error("auth() failed:", e);
    return null;
  }
}

export async function getThreads(): Promise<EmailThread[]> {
  const token = await googleToken();
  if (token) {
    try {
      const { getGmailThreads } = await import("@/lib/integrations/google");
      return await getGmailThreads(token);
    } catch (e) {
      console.error("Gmail failed, using mock:", e);
    }
  }
  return mockThreads;
}

export async function getDriveFiles(): Promise<DriveFile[]> {
  const token = await googleToken();
  if (token) {
    try {
      const { getDriveFilesLive } = await import("@/lib/integrations/google");
      return await getDriveFilesLive(token);
    } catch (e) {
      console.error("Drive failed, using mock:", e);
    }
  }
  return mockDriveFiles;
}

export async function getAgents(): Promise<Agent[]> {
  // Representative agent team today. When the agents are actually deployed and
  // reporting into the hub, swap this for the live status source (same shape).
  return mockAgents;
}

export async function getAdMetrics(): Promise<AdMetrics> {
  if (!useMocks && config.meta.connected) {
    try {
      const { getMetaAdMetrics } = await import("@/lib/integrations/meta");
      return await getMetaAdMetrics();
    } catch (e) {
      console.error("Meta ads failed, using mock:", e);
    }
  }
  return mockAdMetrics;
}

export async function getEmailMetrics(): Promise<EmailMetrics> {
  if (!useMocks && config.klaviyo.connected) {
    try {
      const { getKlaviyoMetrics } = await import("@/lib/integrations/klaviyo");
      return await getKlaviyoMetrics();
    } catch (e) {
      console.error("Klaviyo failed, using mock:", e);
    }
  }
  return mockEmailMetrics;
}

export async function getContentMetrics(): Promise<ContentMetrics> {
  // IG/FB follower counts + engagement come live from Meta when connected; TikTok,
  // UGC, winning angles and the calendar stay manual (no server token for TikTok).
  if (!useMocks && config.meta.connected) {
    try {
      const { getMetaContentInsights } = await import("@/lib/integrations/meta");
      const live = await getMetaContentInsights();
      const platforms = mockContentMetrics.platforms.map((p) => {
        const hit = live.platforms.find((l) => l.name === p.name);
        return hit ? { ...p, followers: hit.followers } : p;
      });
      return {
        ...mockContentMetrics,
        platforms,
        engagementRate: live.engagementRate ?? mockContentMetrics.engagementRate,
      };
    } catch (e) {
      console.error("Meta content insights failed, using mock:", e);
    }
  }
  return mockContentMetrics;
}

export async function getMarketingKpis(): Promise<MarketingKpis> {
  // Financial KPIs mirror financial-model.xlsx (realistic scenario). When Shopify +
  // Meta + Klaviyo are all live, compute these from real revenue/spend/email data.
  return mockMarketingKpis;
}

export function isToday(iso: string): boolean {
  // "today" relative to the latest order date in the dataset (stable for demo)
  return iso.startsWith("2026-06-28");
}

export async function getKpis(): Promise<Kpis> {
  const [orders, products, threads] = await Promise.all([
    getOrders(),
    getProducts(),
    getThreads(),
  ]);
  const today = orders.filter((o) => isToday(o.createdAt) && o.financialStatus !== "refunded");
  const { getSuppliers } = await import("@/lib/suppliers");
  const suppliers = getSuppliers();
  return {
    ordersToday: today.length,
    revenueToday: Math.round(today.reduce((s, o) => s + o.total, 0) * 100) / 100,
    unitsToday: today.reduce((s, o) => s + o.items, 0),
    lowStock: products.filter((p) => p.stock <= p.reorderPoint).length,
    suppliersToFollowUp: suppliers.filter((s) => s.status === "to-contact" || s.status === "contacted").length,
    unreadEmails: threads.filter((t) => t.unread).length,
    currency: orders[0]?.currency ?? "EUR",
  };
}
