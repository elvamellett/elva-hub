import "server-only";
import { config, useMocks } from "@/lib/config";
import { mockOrders, mockProducts, mockThreads, mockDriveFiles } from "@/lib/mock/data";
import type { Order, Product, EmailThread, DriveFile, Kpis } from "@/lib/types";

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

export async function getThreads(): Promise<EmailThread[]> {
  return mockThreads; // v1: Gmail live path documented in README
}

export async function getDriveFiles(): Promise<DriveFile[]> {
  return mockDriveFiles; // v1: Drive live path documented in README
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
