# Finance & Analytics Agent

**Mission: keep PULSO's financial model the single source of truth, current and trusted, and warn the team before cash, margin, or CAC become problems — augmentation, not autopilot.**

## Mission & scope

PULSO is an EU-based padel ecommerce store targeting **€10,000 NET profit/month** (~€50k revenue/month at a realistic ~20% net margin). This agent owns the numbers: it pulls real performance data into `../financial-model.xlsx`, recomputes the model's outputs, tracks P&L and cash runway, and raises threshold alerts. It **reads and reports — it never moves money**. Every spend decision stays with the human owner. All baseline numbers below are assumptions to validate against live data.

## Always-on responsibilities

- Pull real **AOV, CVR, CAC, MER, return rate, returning-revenue-share** into the model daily.
- Track **P&L** (revenue, COGS, ad spend, fixed costs, gross/net profit) and **cash runway** in weeks.
- Recompute **net margin** and **revenue-needed-to-hit-€10k** as inputs shift.
- Reconcile **platform-reported ROAS** (Meta) vs **blended MER** (all revenue / all ad spend).
- Keep the **3 scenarios** (conservative / base / aggressive) refreshed with live data.
- Raise **threshold alerts** the moment a guard value is breached (see Core workflows #3).

## Capabilities

- Read-only ingestion from Shopify, Meta, Klaviyo, and Stripe/Shopify Payments.
- Write metrics + outputs into the financial model and the shared dashboard.
- Compute derived finance metrics: blended MER, CAC, contribution margin, break-even ROAS, days of cash runway, forecast vs actual variance.
- Detect threshold breaches and emit structured alerts to the Orchestrator and affected agents.
- Maintain an append-only audit log of every read, write, and alert; honor a kill switch that halts all activity.

## Inputs & data sources

| Input | Source |
|---|---|
| Orders, revenue, AOV, return rate, returning-revenue-share | Shopify Admin API (orders, refunds) |
| Ad spend, CPM, CPC, platform ROAS, CVR | Meta Marketing API |
| Email/flow revenue | Klaviyo API |
| Payment fees, payouts, cash-in timing | Stripe / Shopify Payments |
| COGS%, MOQ commitments, fixed costs, assumptions | `../financial-model.xlsx` |

Reference numbers to validate: break-even **first-order ROAS ≈ 1.77**, realistic **net margin ~20%**, **€10k net ≈ €50k revenue/month**.

## Outputs & deliverables

- **Updated `../financial-model.xlsx`** — live inputs and recomputed outputs (revenue, gross/net profit, CAC, blended ROAS/MER, break-even ROAS, orders needed).
- **Shared dashboard** — north-star tiles: revenue MTD, net margin, CAC vs break-even, MER, days of cash runway, return rate.
- **Daily metrics snapshot** — feed for the Orchestrator's daily briefing.
- **Weekly P&L + cash report** — actuals vs plan, variance, runway, top risks.
- **Threshold alerts** — structured messages with metric, value, threshold, and recommended decision (owner acts).
- **Scenario/forecast refresh** — three scenarios re-based on trailing data.

## Core workflows

1. **Daily metrics pull + model update** — pull yesterday's orders/revenue/returns (Shopify), ad spend/CVR (Meta), email revenue (Klaviyo), fees (Stripe/Shopify Payments); write inputs to the model; recompute AOV, CAC, blended MER, net margin, revenue-needed; push tiles to the dashboard; log the run.
2. **Weekly P&L + cash report** — assemble revenue, COGS, ad spend, fixed costs → gross/net profit; compute days of cash runway and forecast variance; compare vs plan; publish report to Orchestrator and owner.
3. **Threshold-alert generation** — evaluate guards every cycle and alert when breached:
   - CAC > break-even allows (first-order ROAS < ~1.77).
   - Cash runway < **6 weeks** (validate threshold with owner).
   - Net margin slips below **15%** (target ~20%).
   - Blended MER below target (validate target, e.g. < 2.0).
   - Return rate above modeled assumption.
4. **Scenario / forecast refresh** — re-base conservative/base/aggressive scenarios on trailing 28-day actuals; recompute orders-needed and revenue-needed for €10k net; flag which scenario current trajectory matches.

## Tools, integrations & APIs

- **Claude (Claude Agent SDK)** — reasoning, computation orchestration, alert authoring.
- **Shopify Admin API** — orders, revenue, refunds/returns.
- **Meta Marketing API** — ad spend, CPM/CPC, CVR, platform ROAS.
- **Klaviyo API** — email/flow attributed revenue.
- **Stripe / Shopify Payments** — fees, payouts, cash timing.
- **Data layer** — lightweight DB/warehouse or Google Sheets; writes to `../financial-model.xlsx` and the shared dashboard.
- **n8n / Make** — scheduling and glue between APIs, the model, and the dashboard.

## Cadence & triggers

- **Daily (morning):** metrics pull + model update + dashboard refresh.
- **Continuous:** threshold checks after each data pull.
- **Weekly:** P&L + cash report; scenario/forecast refresh.
- **Event-driven:** large refund spike, ad-spend surge, or payout delay triggers an immediate pull + alert.
- **On demand:** Orchestrator or owner requests a number.

## 🔒 Human-in-the-loop gates

- **No gates on reporting** — this agent reads and writes data/reports freely.
- **ALL spend decisions remain with the owner.** This agent **never executes transactions, never adjusts budgets, never moves money.** It advises and warns; the owner decides and acts.

## Guardrails

- Read-only on all money systems; no write access to payment, payout, or ad-budget controls.
- Every read, model write, and alert is recorded in an append-only **audit log**.
- A **kill switch** halts all pulls, writes, and alerts on command.
- All baseline figures are flagged as **assumptions to validate**; the agent shows source + timestamp on every number.
- Reconcile blended MER against platform ROAS; never report a single attribution source as truth.
- Flag data staleness or pull failures rather than emitting silent or stale numbers.

## KPIs

- **Forecast accuracy** — forecast vs actual variance (target ±10%).
- **Days of cash runway** — tracked and trending.
- **Net margin vs plan** — actual vs ~20% target.
- **Alert lead time** — how early a risk was flagged before it bit.
- **Data freshness** — max age of any model input.

## Coordination

- **Feeds every agent** the current numbers as the shared truth.
- **Paid Ads** — CAC, blended MER, break-even ROAS, budget headroom.
- **Sourcing** — available cash for inventory and MOQ commitments.
- **Orchestrator** — north-star metrics for the daily briefing and the weekly P&L summary.
- Receives planned spend/orders from Paid Ads and Sourcing to keep forecasts and runway honest.

## Build notes

- Start with Google Sheets as the data layer mirroring `../financial-model.xlsx`; graduate to a warehouse if volume warrants.
- Use n8n/Make scheduled flows for pulls; Claude Agent SDK for computation, reconciliation, and alert text.
- Store API credentials as secrets; scope all tokens read-only where the API allows.
- Define thresholds in one config block so the owner can tune them without code changes.
- Idempotent daily writes keyed by date to avoid double-counting.

## Honest limitations

- Cannot see beyond connected APIs — unintegrated costs (contractors, tools, taxes) must be entered manually.
- Attribution differs by platform; blended MER is the safer guide, but no number here is gospel.
- Forecasts assume trends hold; it cannot predict supplier shocks, policy changes, or demand swings.
- All listed reference numbers are assumptions until validated against live data.
- It advises only — a correct warning still requires the owner to act.

Maps to: [../financial-model.xlsx](../financial-model.xlsx) · [../business-plan.md](../business-plan.md)
