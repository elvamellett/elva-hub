import { getThreads } from "@/lib/data";
import { PageHeader, Card } from "@/components/ui";
import { timeAgoDate } from "@/lib/cn";
import { useMocks } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const threads = await getThreads();

  return (
    <div>
      <PageHeader title="Inbox" subtitle="Supplier & customer email at a glance (read-only)." />
      {useMocks && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Showing demo emails. Connect Google (Gmail read-only) to see your real threads — see Settings.
        </p>
      )}
      <Card className="divide-y divide-line">
        {threads.map((t) => (
          <a
            key={t.id}
            href={`https://mail.google.com/mail/u/0/#search/from:${encodeURIComponent(t.from)}`}
            target="_blank" rel="noreferrer"
            className="flex items-start gap-3 px-4 py-3 hover:bg-paper/60"
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${t.unread ? "bg-blue" : "bg-transparent"}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className={`truncate text-sm ${t.unread ? "font-semibold text-ink" : "font-medium text-ink/80"}`}>{t.subject}</p>
                <span className="shrink-0 text-xs text-slate">{timeAgoDate(t.date)}</span>
              </div>
              <p className="truncate text-xs text-slate">{t.from}</p>
              <p className="mt-0.5 truncate text-xs text-slate">{t.snippet}</p>
            </div>
          </a>
        ))}
      </Card>
    </div>
  );
}
