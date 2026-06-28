import { PageHeader, Badge } from "@/components/ui";
import { ApprovalsList } from "@/components/approvals-list";
import { getAgents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const agents = await getAgents();
  const pending = agents.filter((a) => a.status === "gate").length;
  return (
    <div>
      <PageHeader
        title="Approvals"
        subtitle="Every decision your agents are waiting on — in one queue."
        action={<Badge tone="amber">{pending} pending</Badge>}
      />
      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-slate shadow-sm">
        <Badge tone="amber">Preview</Badge>
        <span>Representative approvals from each agent&apos;s spec. Approve/Hold go live when the agents are deployed.</span>
      </div>
      <ApprovalsList agents={agents} />
    </div>
  );
}
