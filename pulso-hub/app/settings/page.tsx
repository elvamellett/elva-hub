import { PageHeader, Card, Badge } from "@/components/ui";
import { config } from "@/lib/config";
import { CheckCircle2, Circle } from "lucide-react";

export const dynamic = "force-dynamic";

const integrations = [
  { key: "shopify", name: "Shopify", scope: "Orders, inventory, products (read-only)", connected: config.shopify.connected,
    env: ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_ADMIN_TOKEN"], v: 1 },
  { key: "google", name: "Google (Gmail + Drive)", scope: "Inbox + assets (read-only) + login", connected: config.google.connected,
    env: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"], v: 1 },
  { key: "meta", name: "Meta Ads", scope: "Spend, ROAS, CAC (marketing dashboard)", connected: config.meta.connected,
    env: ["META_ACCESS_TOKEN"], v: 2 },
  { key: "klaviyo", name: "Klaviyo", scope: "Email performance (marketing dashboard)", connected: config.klaviyo.connected,
    env: ["KLAVIYO_API_KEY"], v: 2 },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Connections & setup. Add credentials as environment variables — see the hub README." />
      <div className="space-y-3">
        {integrations.map((i) => (
          <Card key={i.key} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              {i.connected ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate" />}
              <div>
                <p className="font-semibold">
                  {i.name} {i.v === 2 && <span className="ml-1 text-xs font-normal text-slate">(v2)</span>}
                </p>
                <p className="text-sm text-slate">{i.scope}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <code className="rounded bg-paper px-2 py-1 text-xs text-slate">{i.env.join(", ")}</code>
              {i.connected ? <Badge tone="green">Connected</Badge> : <Badge tone={i.v === 2 ? "neutral" : "amber"}>{i.v === 2 ? "Planned" : "Demo data"}</Badge>}
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate">
        All keys are read server-side from environment variables and never exposed to the browser. Use read-only scopes.
        Full setup + deploy steps are in <code className="rounded bg-paper px-1">pulso-hub/README.md</code>.
      </p>
    </div>
  );
}
