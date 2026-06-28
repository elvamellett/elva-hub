import type { Order, Product, EmailThread, DriveFile } from "@/lib/types";

// Deterministic mock data (no Date.now/random) so the build + demo are stable.
const DAY = "2026-06-28";

export const mockProducts: Product[] = [
  { id: "p1", title: "PULSO Match Balls (Tube of 3)", sku: "PULSO-BALLS-3", type: "Balls", price: 11.99, stock: 6, reorderPoint: 24 },
  { id: "p2", title: "PULSO Pro Overgrips — 3-pack", sku: "PULSO-OG-3", type: "Grips & Tape", price: 8.99, stock: 41, reorderPoint: 20 },
  { id: "p3", title: "PULSO Pro Overgrips — 12-pack", sku: "PULSO-OG-12", type: "Grips & Tape", price: 24.99, stock: 12, reorderPoint: 10 },
  { id: "p4", title: "PULSO Vibration Dampeners (2-pack)", sku: "PULSO-DAMP-2", type: "Accessories", price: 7.99, stock: 3, reorderPoint: 15 },
  { id: "p5", title: "PULSO Racket Bag", sku: "PULSO-BAG", type: "Bags", price: 49.99, stock: 18, reorderPoint: 8 },
  { id: "p6", title: "PULSO Microfibre Court Towel", sku: "PULSO-TOWEL", type: "Accessories", price: 14.99, stock: 27, reorderPoint: 10 },
  { id: "p7", title: "PULSO Starter Kit", sku: "PULSO-STARTER", type: "Bundles", price: 99.99, stock: 9, reorderPoint: 6 },
  { id: "p8", title: "PULSO Tempo Racket", sku: "PULSO-RKT-TEMPO", type: "Rackets", price: 89.99, stock: 5, reorderPoint: 6 },
  { id: "p9", title: "PULSO Pulse Racket", sku: "PULSO-RKT-PULSE", type: "Rackets", price: 109.99, stock: 14, reorderPoint: 6 },
  { id: "p10", title: "PULSO Tee", sku: "PULSO-TEE", type: "Apparel", price: 27.99, stock: 33, reorderPoint: 12 },
];

export const mockOrders: Order[] = [
  { id: "o1", name: "#1042", customer: "Aoife N.", total: 99.99, currency: "EUR", financialStatus: "paid", fulfillmentStatus: "unfulfilled", createdAt: `${DAY}T09:12:00Z`, items: 1 },
  { id: "o2", name: "#1041", customer: "Liam B.", total: 33.97, currency: "EUR", financialStatus: "paid", fulfillmentStatus: "fulfilled", createdAt: `${DAY}T08:40:00Z`, items: 3 },
  { id: "o3", name: "#1040", customer: "Marta R.", total: 109.99, currency: "EUR", financialStatus: "paid", fulfillmentStatus: "unfulfilled", createdAt: `${DAY}T07:55:00Z`, items: 1 },
  { id: "o4", name: "#1039", customer: "Sean D.", total: 20.98, currency: "EUR", financialStatus: "paid", fulfillmentStatus: "fulfilled", createdAt: `2026-06-27T19:22:00Z`, items: 2 },
  { id: "o5", name: "#1038", customer: "Niamh K.", total: 11.99, currency: "EUR", financialStatus: "refunded", fulfillmentStatus: "fulfilled", createdAt: `2026-06-27T16:10:00Z`, items: 1 },
  { id: "o6", name: "#1037", customer: "Tom F.", total: 64.98, currency: "EUR", financialStatus: "paid", fulfillmentStatus: "partial", createdAt: `2026-06-27T12:03:00Z`, items: 2 },
  { id: "o7", name: "#1036", customer: "Elena P.", total: 8.99, currency: "EUR", financialStatus: "pending", fulfillmentStatus: "unfulfilled", createdAt: `2026-06-27T10:48:00Z`, items: 1 },
  { id: "o8", name: "#1035", customer: "Conor M.", total: 124.98, currency: "EUR", financialStatus: "paid", fulfillmentStatus: "fulfilled", createdAt: `2026-06-26T20:15:00Z`, items: 2 },
];

export const mockThreads: EmailThread[] = [
  { id: "t1", from: "b2b@lovepadel.ie", subject: "Re: Wholesale / trade account — PULSO", snippet: "Hi Elva, happy to set you up with a trade account. Our price list is attached…", date: `${DAY}T10:05:00Z`, unread: true },
  { id: "t2", from: "gavinlee@topcarbonsports.com", subject: "Re: Private-label padel rackets — RFQ", snippet: "Thanks for reaching out. MOQ 50 from $34/unit, samples $60 incl. shipping…", date: `${DAY}T06:30:00Z`, unread: true },
  { id: "t3", from: "info@stockpadel.com", subject: "Re: Wholesale enquiry — PULSO", snippet: "Buenas, our B2B catalogue requires a quick registration here…", date: `2026-06-27T15:20:00Z`, unread: false },
  { id: "t4", from: "sales@sparkshot.com", subject: "Re: Private-label rackets RFQ", snippet: "Hello, please find our carbon layup options and price tiers…", date: `2026-06-27T08:00:00Z`, unread: false },
  { id: "t5", from: "support@shopify.com", subject: "Your PULSO trial", snippet: "Your store is ready — finish setup to start selling…", date: `2026-06-26T11:00:00Z`, unread: false },
];

export const mockDriveFiles: DriveFile[] = [
  { id: "d1", name: "PULSO Brand", kind: "folder", modified: `${DAY}T09:00:00Z`, url: "#" },
  { id: "d2", name: "PULSO-brand-pack.html", kind: "doc", modified: `2026-06-27T14:00:00Z`, url: "#" },
  { id: "d3", name: "pulso-wordmark.png", kind: "image", modified: `2026-06-27T14:00:00Z`, url: "#" },
  { id: "d4", name: "financial-model.xlsx", kind: "sheet", modified: `2026-06-26T10:00:00Z`, url: "#" },
  { id: "d5", name: "Ad creative batch 1", kind: "folder", modified: `2026-06-26T09:00:00Z`, url: "#" },
  { id: "d6", name: "supplier-quotes", kind: "folder", modified: `${DAY}T08:00:00Z`, url: "#" },
];
