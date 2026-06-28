import { PageHeader, Card } from "@/components/ui";
import { Megaphone, Send, Sparkles, LineChart } from "lucide-react";

const planned = [
  { icon: Megaphone, title: "Ad performance (Meta)", desc: "Daily spend, ROAS, CPP/CAC vs target, blended MER — tied to the financial model." },
  { icon: Send, title: "Email (Klaviyo)", desc: "Flow + campaign revenue, list growth, email revenue share, reorder rate." },
  { icon: Sparkles, title: "Content & social", desc: "Content calendar status, top posts, UGC pipeline." },
  { icon: LineChart, title: "Financials", desc: "Net profit run-rate, cash runway, and progress toward €10k net — live from the model." },
];

export default function MarketingPage() {
  return (
    <div>
      <PageHeader title="Marketing" subtitle="The marketing dashboard is coming in v2." />
      <div className="mb-6 rounded-2xl border border-blue/20 bg-blue/5 px-5 py-4 text-sm text-ink">
        v1 ships the <strong>Operations</strong> dashboard. The <strong>Marketing</strong> dashboard below is scaffolded next:
        connect Meta Ads + Klaviyo and these views light up.
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {planned.map((p) => (
          <Card key={p.title} className="flex gap-4 p-5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-white">
              <p.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-slate">{p.desc}</p>
              <span className="mt-2 inline-block rounded bg-chalk px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate">
                Coming in v2
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
