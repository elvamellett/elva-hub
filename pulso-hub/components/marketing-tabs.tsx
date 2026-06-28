"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/marketing", label: "Overview" },
  { href: "/marketing/ads", label: "Ad performance" },
  { href: "/marketing/email", label: "Email" },
  { href: "/marketing/content", label: "Content & social" },
  { href: "/marketing/financials", label: "Financials" },
];

export function MarketingTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-line">
      {tabs.map((t) => {
        const active = t.href === "/marketing" ? pathname === "/marketing" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition",
              active ? "border-blue text-blue" : "border-transparent text-slate hover:text-ink",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Demo data
    </span>
  );
}
