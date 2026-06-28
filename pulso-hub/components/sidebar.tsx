"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, Boxes, Truck, Mail, FolderOpen,
  Megaphone, Send, Sparkles, LineChart, Settings, Activity, Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string; icon: React.ElementType; soon?: boolean };

const ops: Item[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/ops/agents", label: "Agent Office", icon: Users },
  { href: "/ops/orders", label: "Orders", icon: ShoppingCart },
  { href: "/ops/inventory", label: "Inventory", icon: Boxes },
  { href: "/ops/suppliers", label: "Suppliers", icon: Truck },
  { href: "/ops/inbox", label: "Inbox", icon: Mail },
  { href: "/ops/assets", label: "Assets", icon: FolderOpen },
];

const marketing: Item[] = [
  { href: "/marketing/ads", label: "Ad performance", icon: Megaphone, soon: true },
  { href: "/marketing/email", label: "Email (Klaviyo)", icon: Send, soon: true },
  { href: "/marketing/content", label: "Content & social", icon: Sparkles, soon: true },
  { href: "/marketing/financials", label: "Financials", icon: LineChart, soon: true },
];

function NavLink({ item, active }: { item: Item; active: boolean }) {
  return (
    <Link
      href={item.soon ? "/marketing" : item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        active ? "bg-blue text-white" : "text-chalk/80 hover:bg-white/10 hover:text-white",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.soon && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-chalk/70">soon</span>}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink px-4 py-5 md:flex">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <Image src="/pulso-mark.png" alt="PULSO" width={34} height={34} className="rounded-lg" />
        <span className="text-lg font-bold tracking-tight text-white">PULSO Hub</span>
      </Link>

      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-chalk/40">Operations</p>
      <nav className="space-y-1">
        {ops.map((i) => <NavLink key={i.href} item={i} active={isActive(i.href)} />)}
      </nav>

      <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-widest text-chalk/40">Marketing</p>
      <nav className="space-y-1">
        {marketing.map((i) => <NavLink key={i.href} item={i} active={isActive(i.href)} />)}
      </nav>

      <div className="mt-auto space-y-1 pt-6">
        <NavLink item={{ href: "/settings", label: "Settings", icon: Settings }} active={isActive("/settings")} />
        <div className="flex items-center gap-2 px-3 pt-3 text-[11px] text-chalk/40">
          <Activity className="h-3 w-3" /> PULSO Hub v1
        </div>
      </div>
    </aside>
  );
}
