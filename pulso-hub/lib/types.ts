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
