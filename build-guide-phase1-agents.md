# PULSO — Phase 1 AI Agents: Technical Build Guide

**Goal:** stand up the first three AI agents for PULSO — a padel-gear ecommerce business (EU, Shopify store, Klaviyo email, Meta ads), targeting €10k net profit/month. This guide is for a solo, non-deeply-technical founder building mostly from assembled tools.

**Philosophy throughout: augmentation, not autopilot.** Agents draft, compute, and warn. A human approves anything that spends money, signs a supplier, publishes a live change, or makes a claim. Every action is recorded in an audit log, and a kill switch can halt everything. All numbers below are assumptions to validate against real data.

Phase-1 agents: **Finance & Analytics**, **Email / Retention**, **Social / Creative**.

---

## 1. Architecture overview

Four moving parts, each doing one job:

- **Reasoning core** — Claude (the latest model) via the Claude Agent SDK. Does the thinking: reads data, computes, drafts copy, authors alerts, decides what to flag.
- **Automation glue** — n8n (self-hosted or cloud) or Make. Handles schedules, API calls, moving data between systems, and routing approvals. No "intelligence" here — it's plumbing.
- **Shared data layer** — start with Google Sheets (mirroring `financial-model.xlsx`) plus a few tabs for calendar, segments, and the audit log. Graduate to a lightweight DB (Postgres/SQLite) when volume warrants. This is the single source of truth — never agent-local memory.
- **Approval surface** — Slack (recommended) or email. Where gated actions wait for a human one-click Approve/Reject.

```
   SCHEDULES / EVENTS (cron, webhooks: new order, spam spike, breakout post)
            |
            v
   +---------------------+        reads/writes        +---------------------+
   |  AUTOMATION GLUE    | <------------------------>  |  SHARED DATA LAYER  |
   |  (n8n / Make)       |                             |  Google Sheets / DB |
   |  schedules, API     |                             |  - financial model  |
   |  calls, routing     |                             |  - calendar/segments|
   +----------+----------+                             |  - AUDIT LOG        |
              |                                         |  - KILL-SWITCH flag |
              v                                         +---------------------+
   +---------------------+
   |  REASONING CORE     |   Claude (latest model) via the Claude Agent SDK
   |  compute, draft,    |   - reads context from data layer
   |  reconcile, author  |   - returns outputs + a "gate required?" decision
   +----------+----------+
              |
        gate? | no  ----> apply / report (Finance reports; safe writes)
              | yes
              v
   +---------------------+   one-click Approve / Reject
   |  APPROVAL SURFACE   |  ----> approved: glue executes the action
   |  (Slack / email)    |  ----> rejected: logged, no action
   +---------------------+

   [ AUDIT LOG records every read, write, draft, alert, and decision ]
   [ KILL SWITCH: every workflow checks the flag first and halts if set ]
```

Every workflow follows the same shape: **trigger → glue gathers data → reasoning core thinks → either act/report or send to the approval surface → record in the audit log.**

---

## 2. Prerequisites & API keys (per agent)

Create accounts and tokens before building. **Scope read-only wherever the API allows.**

| System | Used by | What you need | Scopes / notes |
|---|---|---|---|
| Anthropic (Claude Agent SDK) | All | API key | One key; the reasoning core for every agent |
| Shopify Admin API | Finance, Email | Custom app token | Read-only for Finance: `read_orders`, `read_products`, `read_customers`, `read_reports`. No write scopes on the Finance app |
| Klaviyo API | Email (Finance reads revenue) | Private API key | Flows, Campaigns, Segments, Metrics, Profiles, Events |
| Meta Graph + Marketing API | Social, Finance | Meta app + System User token | Finance: `ads_read`. Social publishing: `pages_manage_posts`, `instagram_content_publish`, `pages_read_engagement` |
| Stripe / Shopify Payments | Finance | Read-only restricted key | Balance, payouts, fees only. **No write/transfer permissions** |
| Slack | All (approvals) | Bot token + a signing secret | `chat:write`, interactivity enabled for Approve/Reject buttons |
| Aggregator (Metricool / Ayrshare / Buffer) | Social (optional) | Account API key | Reduces direct Meta/TikTok API surface early on |

**Secret handling — never commit keys.**
- Store secrets as environment variables, in n8n's encrypted credential store, or a secrets manager (1Password, Doppler, AWS Secrets Manager).
- Add `.env` and any credential files to `.gitignore`. Never paste a key into the Sheet, a prompt, or chat history.
- Use one read-only Shopify/Stripe token set for Finance and a separate (more-privileged) set only where writes are genuinely needed (Email/Klaviyo, Social/publishing).
- Rotate tokens periodically and immediately on any suspected exposure.

---

## 3. Per-agent setup recipes

### 3a. Finance & Analytics Agent — *reads and reports, never moves money*

- **Trigger / schedule:** daily morning cron (metrics pull). Continuous threshold checks after each pull. Weekly P&L + scenario refresh. Event-driven on a refund spike, ad-spend surge, or payout delay.
- **Data it reads:** Shopify (orders, revenue, refunds, return rate), Meta Marketing API (ad spend, CPM/CPC, CVR, platform ROAS), Klaviyo (email-attributed revenue), Stripe/Shopify Payments (fees, payouts, cash timing), and `financial-model.xlsx` assumptions (COGS%, fixed costs, MOQ).
- **Tools it calls:** the read-only APIs above; writes computed inputs/outputs into the Google Sheets model and dashboard tiles. n8n schedules and moves the data; the reasoning core computes.
- **Sample system prompt outline:**
  - Role: PULSO's finance analyst. The financial model is the single source of truth.
  - Inputs: today's pulled metrics + current model assumptions (provided in context).
  - Tasks: recompute AOV, CAC, blended MER, net margin, days of cash runway, break-even ROAS, revenue-needed-for-€10k-net.
  - Reconcile platform ROAS against blended MER — never report a single attribution source as truth.
  - Show source + timestamp on every number. Flag staleness or a failed pull rather than emitting stale numbers.
  - Evaluate the threshold config and emit structured alerts (metric, value, threshold, recommended decision).
  - Output JSON: `{ dashboard_tiles, alerts[], notes }`.
- **Threshold config (one editable block, tune without code):** CAC above break-even (first-order ROAS < ~1.77); cash runway < 6 weeks; net margin < 15% (target ~20%); blended MER < ~2.0; return rate above the modeled assumption.
- **Outputs:** updated model + dashboard tiles, daily metrics snapshot, weekly P&L + cash report, threshold alerts, refreshed conservative/base/aggressive scenarios.
- **Human-in-the-loop gate:** **none on reporting** — it reads and writes data/reports freely. **It never executes transactions, adjusts budgets, or moves money.** Alerts are informational; the owner decides and acts. (Make idempotent daily writes keyed by date to avoid double-counting.)

### 3b. Email / Retention Agent — *drafts flows/campaigns; human approves big sends*

- **Trigger / schedule:** daily deliverability + flow-KPI check. Weekly retention scorecard + campaign planning. Event-driven (new product → segment/flow review; spam/bounce spike → tighten; lapsing cohort grows → winback). Monthly replenishment-timing pass.
- **Data it reads:** `klaviyo-retention-plan.md` (canonical flow plan), `content-engine.md` (brand voice), Klaviyo API (flows/campaigns/segments/metrics/profiles/consent), Shopify events via Klaviyo (orders, line items, purchase timestamps = the replenishment clock).
- **Tools it calls:** Klaviyo API (build/edit flows, campaigns, segments — as drafts), Klaviyo AI (subject-line + send-time suggestions), the Content Engine for copy. n8n assembles the scorecard and routes gates.
- **Sample system prompt outline:**
  - Role: PULSO's retention strategist. Repeat revenue is where the model makes money; the padel replenishment engine (balls ~21–28 day cycle, *validate*) is the core lever.
  - Constraints: engaged segments only; GDPR consent required; honour unsubscribes immediately; no purchased lists; no fake scarcity, hype, or medical/performance claims.
  - Tasks: draft flow/campaign copy + 2–3 subject variants; define target segment; recommend replenishment-timing shifts from observed reorder intervals.
  - Mark every output that needs sign-off (see gates). Never finalize a large send or a discount value.
  - Output: draft config + copy + an explicit `gates_required[]` list.
- **Outputs:** drafted/updated Klaviyo flows and scheduled campaigns (drafts until approved), subject-line variant sets + A/B plans, documented segments, weekly retention scorecard, deliverability report, replenishment-timing recommendations.
- **Human-in-the-loop gate (to Slack):** **large-list sends** (anything beyond a small test segment), **discount depth** (any value/percentage — protects margin and the €10k target), and **brand-voice sign-off** on first-time or substantially changed copy. KPI to watch: 25–35%+ email-attributed revenue share.

### 3c. Social / Creative Agent — *drafts + schedules; human approves publishing until trusted*

- **Trigger / schedule:** weekly calendar planning (rolling 2–4 weeks) + reactive inserts. Engagement sweeps several times daily. Daily social listening. Weekly winning-angle review (sooner on a breakout).
- **Data it reads:** brand-in-a-box (voice, tagline, palette — Ink Navy `#0E1B2A`, Volt `#C2F03C`, Chalk `#F6F7F2`, Slate `#8A94A3`, Court Teal `#0B6E6E`; fonts Space Grotesk / Inter; volt-yellow ball motif), shared content calendar, Content Engine asset library, product catalog/inventory/promos, platform analytics, listening feeds.
- **Tools it calls:** Content Engine (all asset creation), an aggregator (Metricool / Ayrshare / Buffer) or direct Meta Graph (IG + FB) + TikTok Content Posting API for scheduling/publishing, analytics + listening feeds. n8n routes the publish gate.
- **Sample system prompt outline:**
  - Role: PULSO's organic social manager ("Everything but the court."). Knowledgeable, encouraging fellow padel player; honest; NO hype.
  - Constraints: stay on palette/fonts/motif; no unverifiable/medical/performance claims; no fake scarcity; no reuse of UGC/creator/paid-partnership content without secured rights + disclosure; respect platform terms and rate limits.
  - Tasks: fill a 2–4 week calendar by theme/format/time; write captions, hooks, on-screen text, hashtag sets; brief the Content Engine; classify inbound DMs/comments (support vs sales vs UGC); rank posts for winning-angle handoff to Paid Ads.
  - Flag tone-setting posts, any claim, and any rights/disclosure item for gating.
  - Output: calendar slots + drafts + `gates_required[]`.
- **Outputs:** rolling calendar with briefs, drafted posts (behind the publish gate until trust is earned), asset request tickets, engagement responses + routed support tickets, winning-angle handoffs to Paid Ads, UGC pipeline with rights-status log, weekly performance digest. Instrument UTM tagging + link-in-bio on day one.
- **Human-in-the-loop gate (to Slack):** **publishing** (every post until trust is earned, then spot-checked), **brand-voice** sign-off on first-of-kind content, **UGC/creator usage rights** before any reuse, **sponsored/paid-partnership disclosure**, and **any product/performance claim**.

---

## 4. Shared approval pattern, audit log & kill switch

**One pattern, reused by all agents.** Build it once.

**Gated action → one-click Slack approval:**
1. The reasoning core returns an output plus `gates_required[]`. If non-empty, the action does **not** execute.
2. n8n posts a Slack message (Block Kit) summarizing the action — what, why, the exact copy/segment/spend — with two buttons: **Approve** and **Reject**.
3. The buttons hit a Slack interactivity webhook back into n8n. **Approve** resumes the workflow and executes the action (schedule the send, publish the post). **Reject** stops it; the draft is kept for revision.
4. Every step — proposal, decision, execution — is written to the audit log.

**Audit log (append-only):** one row per action in a dedicated Sheet tab (or DB table): `timestamp, agent, action_type, summary, payload_ref, gate_required, decided_by, decision, result`. Never edited, only appended. Wire this in **before** the first large-list send or live publish, not after.

**Kill switch:** a single `KILL_SWITCH` flag in the data layer (a cell in the Sheet, or a row in the DB). **Every workflow reads it first and halts immediately if set** — no pulls, no writes, no sends, no publishes. Expose a Slack command (e.g. `/pulso-stop`) that sets the flag so the owner can freeze everything in one action, and `/pulso-resume` to clear it.

---

## 5. Build order — week by week

- **Week 0 — Foundations.** Create accounts and read-only tokens (Section 2). Stand up the data layer (Google Sheet mirroring `financial-model.xlsx` + tabs for calendar, segments, audit log, kill-switch flag). Connect Slack. Pick n8n or Make.
- **Week 1 — Finance, read-only.** Daily metrics pull → model update → dashboard tiles. No approval gate (reporting only). Verify numbers against a manual check. This delivers value fastest and touches no money controls.
- **Week 2 — Safety rails.** Build the audit log, the kill switch, and the Slack Approve/Reject skeleton. Test the kill switch halts a running workflow. Add Finance threshold alerts.
- **Week 3 — Email, drafts behind the gate.** Stand up welcome → abandoned-cart → browse-abandon flows first (fastest payback), then post-purchase → replenishment. Every large send / discount / first-time copy routes to Slack.
- **Week 4 — Social, drafts + schedule behind the gate.** Start draft-only via one aggregator. Calendar + briefs + engagement triage; every publish goes through the gate until trust is earned.
- **Ongoing.** Tune replenishment timing on real reorder data; lift specific Social formats to auto-publish as trust builds; refresh Finance scenarios weekly; revisit thresholds with the owner.

---

## 6. Testing checklist

Run each agent through three stages before it touches anything live:

1. **Dry-run** — no external writes. The agent computes/drafts and logs only; you read the output. Confirm: numbers reconcile, copy is on-brand, gates fire on the right actions.
2. **Shadow mode** — the agent runs on the real schedule against real data but **does not act**: it proposes, you compare its proposal to what you'd do, and you do the action manually. Run ~1–2 weeks per agent.
3. **Live with gates** — the agent acts, but every gated action requires a Slack approval and lands in the audit log.

Per-agent checks: **Finance** — does it flag a deliberately-broken threshold? does it refuse to write on a failed/stale pull? **Email** — does it block a large send / discount until approved? consent respected? **Social** — does every publish wait for approval? do claims and UGC-rights items get flagged? **All** — does the kill switch stop it mid-run, and is every action in the audit log?

---

## 7. Rough cost considerations

- **Claude (Claude Agent SDK):** the largest variable cost — priced per token against Anthropic's current rates (check anthropic.com/pricing). Daily Finance pulls are cheap; Email/Social copy drafting and weekly reasoning are the heavier consumers. Control spend with appropriate reasoning effort, concise context (pass only what's needed), and prompt caching for stable instructions.
- **Automation glue:** n8n self-hosted is free (you run it); n8n Cloud and Make are paid by execution/operation volume — modest for daily/weekly schedules.
- **Tool subscriptions:** Klaviyo (scales with profile count), an aggregator (Metricool/Ayrshare/Buffer) if used, plus the Shopify/Meta/Stripe accounts you already pay for. A listening tool (Brand24/Metricool) is optional.
- **Net:** budget for a small monthly tool spend plus metered Claude + automation usage. Re-baseline against real volume — these are assumptions to validate.

---

## 8. Honest limitations — read this before trusting any agent

- **Agents hallucinate.** They can produce confident, wrong numbers or copy. Supervise; the gates and audit log exist for this reason — keep them.
- **Never automate money or claims.** Finance is read-only by design and must stay that way; spend, pricing, supplier, and budget decisions stay with the owner. No product/performance/medical claims ship without human review.
- **Attribution is approximate.** Platform ROAS, Klaviyo revenue share, and social attribution each measure differently. Blended MER is the safer guide; no single number is gospel.
- **Forecasts assume trends hold.** They can't predict supplier shocks, policy changes, or demand swings. Early replenishment intervals are noisy.
- **Everything here is an assumption to validate** against live PULSO data — thresholds, replenishment cycle, cadence, and rates included.
- **The gates are the safety.** Quality and compliance depend on a human honouring them. Don't remove a gate to "go faster."

---

Maps to: ./agents/finance-agent.md · ./agents/email-agent.md · ./agents/social-media-agent.md
