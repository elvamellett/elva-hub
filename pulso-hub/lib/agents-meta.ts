import {
  Network, Megaphone, Store, Truck, Repeat, Search, LineChart, Headset,
} from "lucide-react";
import type { Department, AgentStatus } from "@/lib/types";

// Each department gets a flat accent colour (sits on the navy/chalk brand base)
// and a lucide icon, reused by the avatar, the room headers and the drawer.
export const deptMeta: Record<Department, { color: string; icon: React.ElementType; label: string }> = {
  Orchestration: { color: "#2E6BFF", icon: Network, label: "Command" },
  Marketing: { color: "#F25C54", icon: Megaphone, label: "Marketing" },
  Store: { color: "#7C5CFF", icon: Store, label: "Store" },
  Operations: { color: "#1C9E77", icon: Truck, label: "Operations" },
  Retention: { color: "#E8A13C", icon: Repeat, label: "Retention" },
  Product: { color: "#11A6C2", icon: Search, label: "Product" },
  Finance: { color: "#C9A227", icon: LineChart, label: "Finance" },
  "Customer Service": { color: "#D6457F", icon: Headset, label: "Customer Service" },
};

// Status → colour + human label. Drives the pulse dot and the legend.
export const statusMeta: Record<AgentStatus, { color: string; label: string; tone: "green" | "blue" | "amber" | "neutral" }> = {
  active: { color: "#1FB877", label: "Working", tone: "green" },
  thinking: { color: "#2E6BFF", label: "Thinking", tone: "blue" },
  gate: { color: "#E8A13C", label: "Needs you", tone: "amber" },
  idle: { color: "#9AA3AF", label: "Idle", tone: "neutral" },
};
