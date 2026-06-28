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
