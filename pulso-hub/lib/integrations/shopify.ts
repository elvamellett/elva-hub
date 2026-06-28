import "server-only";
import { config } from "@/lib/config";
import type { Order, Product } from "@/lib/types";

const API_VERSION = "2025-01";

async function shopifyGraphQL<T>(query: string): Promise<T> {
  const url = `https://${config.shopify.domain}/admin/api/${API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": config.shopify.token,
    },
    body: JSON.stringify({ query }),
    // orders/inventory change often — don't cache aggressively
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Shopify API ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

type OrdersResp = {
  orders: {
    edges: {
      node: {
        id: string;
        name: string;
        createdAt: string;
        displayFinancialStatus: string;
        displayFulfillmentStatus: string;
        currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
        customer: { displayName: string } | null;
        currentSubtotalLineItemsQuantity: number;
      };
    }[];
  };
};

export async function getShopifyOrders(limit = 25): Promise<Order[]> {
  const data = await shopifyGraphQL<OrdersResp>(`{
    orders(first: ${limit}, sortKey: CREATED_AT, reverse: true) {
      edges { node {
        id name createdAt displayFinancialStatus displayFulfillmentStatus
        currentTotalPriceSet { shopMoney { amount currencyCode } }
        customer { displayName }
        currentSubtotalLineItemsQuantity
      } }
    }
  }`);
  return data.orders.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    customer: node.customer?.displayName ?? "Guest",
    total: Number(node.currentTotalPriceSet.shopMoney.amount),
    currency: node.currentTotalPriceSet.shopMoney.currencyCode,
    financialStatus: mapFinancial(node.displayFinancialStatus),
    fulfillmentStatus: mapFulfillment(node.displayFulfillmentStatus),
    createdAt: node.createdAt,
    items: node.currentSubtotalLineItemsQuantity,
  }));
}

type ProductsResp = {
  products: {
    edges: {
      node: {
        id: string;
        title: string;
        productType: string;
        totalInventory: number;
        variants: { edges: { node: { sku: string | null; price: string } }[] };
      };
    }[];
  };
};

export async function getShopifyProducts(limit = 50): Promise<Product[]> {
  const data = await shopifyGraphQL<ProductsResp>(`{
    products(first: ${limit}, sortKey: TITLE) {
      edges { node {
        id title productType totalInventory
        variants(first: 1) { edges { node { sku price } } }
      } }
    }
  }`);
  return data.products.edges.map(({ node }) => {
    const v = node.variants.edges[0]?.node;
    return {
      id: node.id,
      title: node.title,
      sku: v?.sku ?? "—",
      type: node.productType || "—",
      price: Number(v?.price ?? 0),
      stock: node.totalInventory ?? 0,
      reorderPoint: 10, // default; tune per product later
    };
  });
}

function mapFinancial(s: string): Order["financialStatus"] {
  const v = s?.toLowerCase();
  if (v?.includes("refund")) return "refunded";
  if (v?.includes("paid")) return "paid";
  return "pending";
}
function mapFulfillment(s: string): Order["fulfillmentStatus"] {
  const v = s?.toLowerCase();
  if (v?.includes("partial")) return "partial";
  if (v?.includes("fulfilled")) return "fulfilled";
  return "unfulfilled";
}
