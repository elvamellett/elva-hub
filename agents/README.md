# Agent Team — Detailed Department Specs

This folder contains a **buildable spec for each department's AI agent**. They are designed to run **cohesively
and continuously**, coordinated by the **Orchestrator**, all reporting to **you (the human owner)**. Each agent
*operates* a playbook that already exists in this repo.

> ⚠️ **Augmentation, not autopilot.** Every agent runs with **human-in-the-loop gates (🔒)** on anything that
> spends money, signs a supplier, ships site/brand changes, or makes a claim. Build them in phases (see
> [`../ai-agent-team.md`](../ai-agent-team.md) §6), supervise closely, and expand only as each earns trust.
> All capabilities/costs/timelines here are assumptions to validate.

---

## The agents

| Agent | File | Operates playbook | Phase |
|---|---|---|---|
| **Orchestrator / GM** | [`orchestrator-agent.md`](./orchestrator-agent.md) | README + business plan | 3 |
| **Social Media** | [`social-media-agent.md`](./social-media-agent.md) | content-engine + ad-testing | 2 |
| **Paid Ads (Media Buyer)** | [`paid-ads-agent.md`](./paid-ads-agent.md) | ad-testing-framework | 2 |
| **Email / Retention** | [`email-agent.md`](./email-agent.md) | klaviyo-retention-plan | 1 |
| **Finance & Analytics** | [`finance-agent.md`](./finance-agent.md) | financial-model | 1 |
| **Web Development / Store** | [`web-dev-agent.md`](./web-dev-agent.md) | shopify-store-buildout | 2 |
| **Customer Service** | [`customer-service-agent.md`](./customer-service-agent.md) | store-buildout + retention | 2 |
| **Sourcing & Supply** | [`sourcing-agent.md`](./sourcing-agent.md) | supplier-sourcing | 3 |
| **Research & Product** | [`research-product-agent.md`](./research-product-agent.md) | niche-validation | 3 |

(Content generation that several agents rely on lives in [`../content-engine.md`](../content-engine.md).)

---

## How they work cohesively

1. **Shared memory / source of truth.** All agents read & write a shared data layer — the
   [`../financial-model.xlsx`](../financial-model.xlsx) plus a shared store/DB/dashboard and the content
   calendar. This keeps them in sync (no agent acts on stale numbers).
2. **The brand contract.** Every content-producing agent inherits the **Brand-in-a-box** block from
   [`../brand-pack.md`](../brand-pack.md) so output stays on-brand automatically.
3. **Daily loop.** Agents run their monitoring continuously / on schedule. The **Orchestrator** compiles one
   **morning briefing**: key metrics, what changed, each agent's recommendation, and the **1–3 decisions it
   needs from you**.
4. **Approval routing.** Anything behind a 🔒 gate is packaged as a clear, data-backed approval request so you
   decide fast.
5. **Escalation over guessing.** Agents surface uncertainty rather than act. "I'm not sure" beats a confident error.
6. **You are the executive.** Agents propose; you dispose on money, suppliers, brand, and claims.

---

## Shared spec template
Every agent file in this folder follows the same structure:

- **Mission & scope** — what it owns.
- **Always-on responsibilities** — what it does *constantly*.
- **Capabilities** — what it can do.
- **Inputs & data sources** — what it reads.
- **Outputs & deliverables** — what it produces.
- **Core workflows** — step-by-step routines.
- **Tools, integrations & APIs** — how it's wired (Claude Agent SDK + service APIs).
- **Cadence & triggers** — when it runs.
- **🔒 Human-in-the-loop gates** — what needs your approval.
- **Guardrails** — hard limits.
- **KPIs** — how it's judged (tied to the financial model where possible).
- **Coordination** — which agents it works with.
- **Build notes** — pragmatic implementation guidance.
- **Honest limitations** — what it can't reliably do alone.

---

## Implementation backbone (shared by all)
- **Reasoning core:** Claude (latest models) via the **Claude Agent SDK** for custom department agents + the Orchestrator.
- **Glue / automation:** n8n / Make / Zapier to wire triggers, approvals, and data between Shopify, Klaviyo, Meta, social schedulers, and the data layer.
- **Native AI features:** Klaviyo AI, Shopify Magic/Sidekick, Meta Advantage+ — use where they already solve the problem.
- **Approval surface:** a single inbox/Slack/dashboard where 🔒 requests land for one-click decisions.
- **Audit + kill switch:** log every agent action; you can pause any agent instantly.

> Start with **Phase 1 (Finance, Email) + Social/Creative**, prove value, then add the rest.
