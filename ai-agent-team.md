# AI Agent Team — A Department-by-Department Operating System

This layer turns the framework into a **continuously-operating business** by assigning an **AI agent to each
department**, coordinated by an orchestrator, all reporting to **you (the human owner)**. The agents do the
constant, repetitive, monitoring-and-drafting work across every area of the store so you can focus on
decisions, judgement, and the things AI genuinely can't do.

> ⚠️ **Honest reality check (read first).** "An AI agent per department, constantly working" is a powerful
> operating model, but in 2026 it is **augmentation, not autopilot**. Agents are excellent at monitoring,
> drafting, analysing, summarising, and flagging — and unreliable when given unsupervised control over money,
> contracts, brand voice, or legal claims. **Every agent here runs with human-in-the-loop gates on anything
> irreversible or expensive.** Treat this as a team of tireless junior analysts/assistants, not a team of
> autonomous executives. Build them gradually, verify their output, and keep the kill switches.

---

## 1. The org chart

```
                                   YOU (Owner / Final Decision-Maker)
                                              │
                                ┌─────────────┴─────────────┐
                                │   ORCHESTRATOR AGENT (GM)  │   ← prioritises, coordinates,
                                │   daily briefing + alerts  │     reports, routes approvals
                                └─────────────┬─────────────┘
        ┌──────────────┬──────────────┬───────┴──────┬──────────────┬──────────────┬──────────────┐
   ┌────▼────┐   ┌─────▼────┐   ┌─────▼────┐   ┌──────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
   │ Research │   │ Sourcing │   │ Store/   │   │ Creative/  │  │ Paid Ads  │  │ Retention │  │ Customer  │
   │ & Product│   │ & Supply │   │ CRO      │   │ Content    │  │ (Media)   │  │ /Email    │  │ Service   │
   └──────────┘   └──────────┘   └──────────┘   └────────────┘  └───────────┘  └───────────┘  └───────────┘
                                          ┌───────────────┬───────────────┐
                                     ┌────▼────┐    ┌─────▼─────┐    (cross-cutting)
                                     │ Finance │    │ Ops &     │
                                     │ &Analytics   │ Fulfilment│
                                     └─────────┘    └───────────┘
```

Each agent maps to a file in this framework — they **operate** the playbooks you've already written.

---

## 2. The agents (mission · always-on work · gates · KPIs · maps-to)

> Format per agent: **Mission · Constantly does · Outputs · Human-gate (🔒) · KPIs · Maps to file.**

### 0) Orchestrator / General Manager agent
- **Mission:** Keep all agents aligned to the €10k-net goal; surface what needs your attention.
- **Constantly does:** Collects each agent's status; prioritises the day's actions; produces a **daily briefing**
  (wins, problems, decisions needed); routes approval requests to you; watches the north-star metrics.
- **Outputs:** Daily/weekly briefing; prioritised action list; consolidated alerts.
- **🔒 Human-gate:** Any cross-department decision, strategy shift, or anything another agent escalated.
- **KPIs:** Goal progress (net profit run-rate), # blockers cleared, decision turnaround time.
- **Maps to:** `README.md` (execution order), `business-plan.md`, `financial-model.xlsx`.

### 1) Research & Product agent
- **Mission:** Never stop hunting for the next product/angle and watching the market.
- **Constantly does:** Scans trends (search, marketplaces, padel community/events); monitors competitor stores
  and the **Meta Ad Library**; scores candidates with the validation rubric; drafts product briefs.
- **Outputs:** Ranked product candidates (scored), competitor watch, trend alerts.
- **🔒 Human-gate:** Which products to actually add/test (you decide).
- **KPIs:** # validated candidates/month, hit-rate of suggested products that beat break-even.
- **Maps to:** `niche-validation-checklist.md`.

### 2) Sourcing & Supply agent
- **Mission:** Keep the catalogue supplied, fast, and well-priced; never get caught out of stock.
- **Constantly does:** Finds/screens suppliers; drafts RFQs and vetting questionnaires; tracks lead times and
  prices; monitors stock vs **reorder points** and flags reorders; compares EU vs agent vs POD economics.
- **Outputs:** Supplier shortlists + scorecards; draft outreach; reorder alerts; landed-cost comparisons.
- **🔒 Human-gate:** Placing orders, signing suppliers, committing MOQ/cash. **No autonomous spending.**
- **KPIs:** Stockout incidents (→0), supplier lead-time adherence, COGS trend.
- **Maps to:** `supplier-sourcing.md`.

### 3) Store / CRO agent
- **Mission:** Continuously improve conversion rate, AOV, and site health.
- **Constantly does:** Watches CVR/AOV/ATC/checkout/page-speed; drafts product descriptions, bundle copy, FAQ,
  and the "find your racket" quiz logic; proposes A/B tests; flags broken pages/slow loads.
- **Outputs:** Draft copy/pages; prioritised CRO test backlog; weekly funnel-leak report.
- **🔒 Human-gate:** Publishing site changes, pricing changes (review before live).
- **KPIs:** CVR, AOV, add-to-cart rate, page speed.
- **Maps to:** `shopify-store-buildout.md`.

### 4) Creative & Content agent
- **Mission:** Keep a constant pipeline of ad creative, organic content, and UGC briefs.
- **Constantly does:** Generates ad concepts/hooks/scripts by angle; writes UGC creator briefs; drafts
  organic IG/TikTok posts and email content; repurposes winning angles into fresh variations.
- **Outputs:** Creative concepts + hooks, video/UGC scripts, content calendar drafts.
- **🔒 Human-gate:** Brand voice/visual sign-off; anything making product claims (see guardrails).
- **KPIs:** Creative throughput, winning-creative rate, content cadence kept.
- **Maps to:** `ad-testing-framework.md`, `klaviyo-retention-plan.md`.

### 5) Paid Ads / Media-Buyer agent
- **Mission:** Run the testing framework's rules tirelessly and surface scale/kill decisions.
- **Constantly does:** Monitors CTR/CPC/CPP/ROAS/frequency/MER; applies **kill criteria** to losers; flags
  winners ready to scale; checks budget pacing vs the test ceiling; reconciles platform ROAS with blended MER.
- **Outputs:** Daily ad report; kill/scale recommendations with the numbers; fatigue alerts.
- **🔒 Human-gate:** **Budget increases and spend changes require your approval** (set hard caps). Optionally
  allow auto-*pause* of clear losers, but **never auto-scale spend** unsupervised.
- **KPIs:** CAC vs target, blended MER, % budget on winners, wasted spend (→down).
- **Maps to:** `ad-testing-framework.md`.

### 6) Retention / Email (Klaviyo) agent — your edge, amplified
- **Mission:** Maximise repeat revenue and email-attributed revenue share (the model's biggest lever).
- **Constantly does:** Drafts flows + campaign sends; writes subject lines/variants; maintains segments;
  monitors deliverability and flow KPIs; tunes **replenishment timing** to real consumption data; spots
  lapsing customers for winback.
- **Outputs:** Draft campaigns/flows, segment updates, subject-line tests, deliverability + KPI report.
- **🔒 Human-gate:** Sends to large lists, discount depth, brand voice (review before send).
- **KPIs:** Email revenue share (→25–35%+), reorder rate (→30–40%+), deliverability, unsub/spam rates.
- **Maps to:** `klaviyo-retention-plan.md`.

### 7) Customer Service agent
- **Mission:** Fast, helpful, on-brand support — and turn questions into sales/reviews.
- **Constantly does:** Answers FAQs, sizing, racket-selection, shipping/returns; drafts replies; triages
  tickets; requests reviews/UGC post-resolution; surfaces recurring complaints to other agents.
- **Outputs:** Draft/auto replies (within policy), ticket triage, "voice of customer" themes.
- **🔒 Human-gate:** Refund approvals beyond a set threshold; angry/edge-case escalations; policy exceptions.
- **KPIs:** First-response time, resolution time, CSAT, review-request conversion.
- **Maps to:** `shopify-store-buildout.md` (support), `klaviyo-retention-plan.md` (reviews/UGC).

### 8) Finance & Analytics agent
- **Mission:** Keep the single source of truth current and warn before trouble.
- **Constantly does:** Pulls real AOV/CVR/CAC/MER/return-rate into `financial-model.xlsx`; tracks P&L and
  **cash runway**; recomputes net-margin and revenue-needed; alerts on threshold breaches (CAC too high,
  runway too low, margin slipping).
- **Outputs:** Updated model, weekly P&L + cash report, threshold alerts, scenario updates.
- **🔒 Human-gate:** None for reporting; **all spending decisions stay with you.** (Reads data, never moves money.)
- **KPIs:** Forecast accuracy, days of cash runway, net margin vs plan.
- **Maps to:** `financial-model.xlsx` / `.csv`, `business-plan.md`.

### 9) Ops & Fulfilment agent
- **Mission:** Every order ships correctly and on time; exceptions get caught early.
- **Constantly does:** Tracks orders supplier→customer; watches **shipping SLA**; flags delays/lost parcels;
  reconciles inventory; coordinates handoffs between supplier/3PL and CS.
- **Outputs:** Fulfilment dashboard, SLA-breach alerts, exception queue.
- **🔒 Human-gate:** Supplier/3PL changes; compensating customers beyond a threshold.
- **KPIs:** On-time delivery %, fulfilment error rate, exception resolution time.
- **Maps to:** `shopify-store-buildout.md`, `supplier-sourcing.md`.

---

## 3. How they work together (the operating loop)
1. **Shared memory / data layer** — a single source of truth (e.g. the financial model + a shared
   doc/database/dashboard) every agent reads from and writes to. Without this, agents drift out of sync.
2. **Daily loop** — agents run their monitoring on a schedule (continuously or hourly/daily); the
   **Orchestrator** compiles a single **morning briefing** for you with: key metrics, what changed, what each
   agent recommends, and **the 1–3 decisions it needs from you**.
3. **Approval routing** — anything behind a 🔒 gate becomes a clearly-framed approval request (with the data
   and the agent's recommendation) so you can decide in seconds, not hours.
4. **Escalation** — agents escalate uncertainty rather than guess. "I'm not sure" beats a confident mistake.
5. **You stay the executive** — agents propose; you dispose on anything that spends money, signs a supplier,
   changes the brand, or makes a claim.

---

## 4. Guardrails & human-in-the-loop (non-negotiable)
- **Money:** No agent moves money, increases ad budgets, or places supplier orders autonomously. Hard caps + approval.
- **Contracts/suppliers:** Drafting yes; committing no.
- **Brand voice:** A written brand/voice guide all content agents follow; you sign off on tone-setting assets.
- **Legal/claims:** **No medical/performance/health claims**; agents must avoid unverifiable product claims and
  respect IP/trademarks (especially racket tech and "official" sport branding). Compliance review on ad copy.
- **Customer data/GDPR:** Agents handle personal data within GDPR; no risky data exposure to third-party tools.
- **Deliverability:** Email agent can't blast unengaged lists; it must follow the segmentation rules.
- **Audit trail:** Log what each agent does and recommends, so you can review and roll back.
- **Kill switch:** You can pause any agent instantly. Start with agents *recommending*, graduate to *acting*
  on low-risk tasks only once they've earned trust over weeks of correct output.

---

## 5. Tech stack options (build vs assemble)
You do **not** need to build everything custom. Mix:

| Layer | Pragmatic options (2026) |
|---|---|
| **Custom agents / orchestration** | **Claude + Claude Agent SDK** for bespoke department agents and the orchestrator; the latest, most capable Claude models for reasoning-heavy agents |
| **No-code automation glue** | Make / Zapier / n8n to wire triggers, data, and approvals between Shopify, Klaviyo, Meta, Sheets |
| **Native AI already in your tools** | Klaviyo AI (subject lines/segments/send-time), Shopify Magic/Sidekick (copy/insights), Meta Advantage+ (campaign automation) |
| **Data / shared memory** | The financial model + a shared DB/warehouse or even well-structured Google Sheets to start |
| **Dashboards / alerts** | Lightweight BI + Slack/email alerts for the daily briefing and threshold warnings |

Start by combining **native AI features + a couple of custom Claude agents** for the highest-leverage
departments, and only build more custom orchestration as the value proves out.

---

## 6. Phased rollout (don't build 10 agents on day one)
Building all agents at once will overwhelm you and your budget, and you'll struggle to verify their output.
Sequence them by leverage and by where your time is most drained:

**Phase 1 — Validation stage (Months 1–3): 2–3 agents**
- **Finance & Analytics** (keep the model live, watch cash) — highest safety value.
- **Creative & Content** (constant creative pipeline — your testing bottleneck).
- **Retention / Email** (your edge; start drafting flows/campaigns).
> Rationale: during testing your scarce resources are *creative throughput* and *not running out of cash*.

**Phase 2 — Early scale (Months 4–6): add 3**
- **Paid Ads** (rules enforcement at scale), **Store/CRO** (lift CVR/AOV), **Customer Service** (volume rising).

**Phase 3 — Scaling (Month 6+): complete the team**
- **Research & Product**, **Sourcing & Supply**, **Ops & Fulfilment**, and the **Orchestrator** to tie it
  together once there are enough agents to coordinate.

> Add an agent only when (a) the task is eating your time, and (b) you can verify its output. An agent you
> can't supervise is a liability, not leverage.

---

## 7. Cost & ROI (be realistic)
- **Costs:** model/API usage, automation-tool subscriptions, setup/maintenance time, and **your review time**.
- **ROI logic:** an agent is worth it when it either (a) frees hours you'd otherwise spend, (b) increases a
  lever in the model (CVR, AOV, reorder rate, winning-creative rate), or (c) prevents a costly mistake
  (stockout, cash crunch, ad overspend). Tie each agent to a metric in `financial-model.xlsx` and judge it there.
- **Watch:** don't let tooling/automation costs quietly become a new fixed-cost line that erodes net margin —
  add them to the model's fixed costs and make each agent earn its keep.

---

## 8. Honest limitations (what this is NOT)
- It is **not** a hands-off, money-printing autopilot. Padel won't be won by automation alone — judgement,
  taste, supplier relationships, and brand still need you.
- Agents **make mistakes and "hallucinate"**; unsupervised, they can confidently do the wrong thing. Verification
  is part of the design, not a failure of it.
- More agents ≠ more profit. **Leverage comes from the right few agents on your real bottlenecks**, well
  supervised — not from maximal automation.
- This layer **amplifies** the rest of the framework; it doesn't replace the need to validate products, manage
  cash, and earn customer trust.

---

## 9. How this connects to the rest of the framework
Each agent **operates** a playbook you've already written:
`financial-model.xlsx` (Finance) · `niche-validation-checklist.md` (Research) · `supplier-sourcing.md`
(Sourcing) · `shopify-store-buildout.md` (Store/CRO + Ops + CS) · `klaviyo-retention-plan.md` (Retention) ·
`ad-testing-framework.md` (Creative + Paid Ads) · `business-plan.md` + `README.md` (Orchestrator).

Build the playbooks first (they exist now), then assign agents to run them — start with Phase 1, supervise
closely, and expand as trust and cash allow.

**Detailed, buildable specs** for each agent live in [`agents/`](./agents/) (one file per department, with
workflows, APIs, gates, and KPIs). The shared content pipeline they rely on is [`content-engine.md`](./content-engine.md),
and the identity they all follow is [`brand-pack.md`](./brand-pack.md).

*All capabilities, costs, and timelines here are assumptions to validate. Keep humans on the irreversible decisions.*
