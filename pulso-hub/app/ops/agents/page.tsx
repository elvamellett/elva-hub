import { PageHeader } from "@/components/ui";
import { AgentOffice } from "@/components/agent-office";
import { getAgents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AgentOfficePage() {
  const agents = await getAgents();
  return (
    <div>
      <PageHeader
        title="Agent Office"
        subtitle="Your AI department team at work. Click any agent to see what it's doing, what's queued, and what needs you."
      />
      <AgentOffice agents={agents} />
    </div>
  );
}
