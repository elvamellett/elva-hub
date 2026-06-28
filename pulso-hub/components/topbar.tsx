import { config, useMocks, ownerEmail } from "@/lib/config";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-line bg-paper/80 px-6 backdrop-blur lg:px-10">
      <div className="flex items-center gap-2 text-sm text-slate">
        <span className="md:hidden font-bold text-ink">PULSO Hub</span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            useMocks ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${useMocks ? "bg-amber-500" : "bg-emerald-500"}`} />
          {useMocks ? "Demo data" : "Live data"}
        </span>
        <span className="hidden text-xs text-slate sm:inline">
          {config.shopify.connected ? "Shopify connected" : "Shopify: demo"}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-semibold text-white" title={ownerEmail}>
          {ownerEmail.slice(0, 1).toUpperCase()}
        </span>
      </div>
    </header>
  );
}
