# Padel Ecommerce — Business Plan

**Goal:** €10,000 NET profit / month from a padel-focused ecommerce brand.
**Model:** Dropship/hybrid — start asset-light, move to light inventory + private-label as you prove demand.
**Owner strengths in play:** Shopify operations, Klaviyo email/retention, ecommerce fulfilment.

> ⚠️ **Read this first — honesty clause.** Every number in this plan and in `financial-model.xlsx`
> is an **assumption you must validate** with your own data. This document does **not** promise a
> guaranteed winning product — those don't exist. It gives you a realistic operating model, defensible
> benchmarks to test, and a disciplined path. Most stores that fail do so by underestimating CAC,
> overestimating early profit, and running out of cash during testing. This plan is built to avoid that.

---

## 1. Why padel (the niche thesis)

We deliberately rejected saturated "trending wellness gadget" categories (sleep lamps, aroma diffusers,
red-light masks) because at a €500–1,000/month low-risk test budget you get buried fastest in high-CPM,
high-competition auctions. Instead we chose a **passionate sport niche where you are the customer**, which
means lower ad costs, authentic creative, and a community to retain.

**Padel, specifically, because (all figures to validate):**

| Signal | Data point (2026) | Source |
|---|---|---|
| Growth | Padel market ~$0.38B (2026) → ~$1.13B (2035), **~13% CAGR** | Business Research Insights |
| European home advantage | Europe ≈ **57–58%** of the global market & courts | Playtomic Global Padel Report |
| Scale | **25M+ players**, ~58,300 courts → projected **91,000 by 2028** | Playtomic / TiendaPadelPoint |
| Equipment mix | Rackets ≈ **62%** of equipment sales volume | Coherent Market Insights |
| Consumable ladder | Balls lose bounce in weeks; overgrips wear every few sessions → **natural replenishment** | Category mechanics |

**The strategic wedge:** Incumbents (Babolat, Head, Bullpadel) own the premium *racket* on feel and
loyalty. We do **not** fight them there on day one. We enter on **accessories + consumables + bundles**
(where brand loyalty is weak and margins are good), build an audience and an email list, and only then
introduce a private-label hero racket. This sequencing is the lowest-risk path for your capital.

---

## 2. The hero + add-on ladder (your AOV and LTV engine)

A single low-margin product cannot hit €10k net. The model works because each customer climbs a ladder,
and because **consumables bring them back** — which is exactly where your Klaviyo skill compounds.

```
RUNG 4  Private-label HERO racket (€80–130)      ← introduced once you have an audience; the brand moat
RUNG 3  Starter BUNDLE (racket + balls + grip + bag, €90–110)  ← lifts AOV, great first purchase
RUNG 2  Accessories (bag €35–55, dampeners, wristbands, shoes)  ← higher margin, expressive
RUNG 1  Consumables (balls €8–15/can, overgrips €6–10)          ← cheap to ship, REPEAT PURCHASE
```

- **Rung 1 is the retention engine.** Balls and grips are replenished every few weeks by active players.
  A "reorder your balls/grips" flow turns a one-time buyer into a recurring revenue stream **with no new ad cost**.
- **Rung 3 (bundles) is the AOV lever.** A racket+balls+grip+bag starter bundle at €90–110 pulls blended
  AOV up toward our €70 base case even when many carts are small consumable orders.
- **Rung 4 is the moat.** Your own racket (private-label) is where real margin and brand defensibility live —
  but it's also where capital and risk are highest, so it comes *after* validation.

**Why this matters in the math:** "Returning revenue share" is a direct input in the financial model.
Moving it from 28% → 35% is the difference between needing ~€96k/mo revenue and ~€37k/mo to net €10k.
Retention is not a nice-to-have here; it is the primary profit lever.

---

## 3. Unit economics — what €10k net actually requires

### 3a. Simple sensitivity (the headline answer you asked for)

At a **€70 base AOV**, here's the revenue, order volume, and daily orders needed at each net margin.
*(Assumes ~30.4 days/month.)*

| Net margin | Monthly revenue for €10k net | Orders/month (@€70 AOV) | Orders/day |
|---|---|---|---|
| **15%** | €66,667 | 952 | ~31 |
| **20%** | €50,000 | 714 | ~23 |
| **25%** | €40,000 | 571 | ~19 |

**Raise the AOV and the volume drops fast** (same 20% margin):

| AOV | Revenue for €10k net @20% | Orders/month | Orders/day |
|---|---|---|---|
| €55 | €50,000 | 909 | ~30 |
| €70 | €50,000 | 714 | ~23 |
| €90 | €50,000 | 556 | ~18 |

This is the entire argument for the add-on ladder: **fewer, bigger, repeat orders beat more, smaller ones.**

### 3b. The three modelled scenarios (see `financial-model.xlsx`)

These come from the full model, where CAC is derived from your ad funnel (CPM → CPC → CAC) and net margin
falls out of the assumptions. **Net profit is solved to exactly €10,000 in each column.**

| | **Conservative** | **Realistic** | **Optimistic** |
|---|---|---|---|
| AOV | €60 | €70 | €82 |
| COGS (% rev) | 42% | 38% | 36% |
| CAC (per new customer) | €33 | €37 | €39 |
| First-order ROAS | 1.80 | 1.90 | 2.09 |
| **First-order break-even ROAS** | **1.95** | **1.77** | **1.69** |
| Returning revenue share | 28% | 33% | 35% |
| Blended ROAS | 2.50 | 2.84 | 3.22 |
| **Net margin (actual)** | **~10%** | **~20%** | **~27%** |
| **Revenue needed for €10k net** | **~€95,800/mo** | **~€49,600/mo** | **~€37,400/mo** |
| Orders/day | ~53 | ~24 | ~15 |
| Ad spend/month | ~€38,300 | ~€17,400 | ~€11,600 |

**The single most important honest insight:** in the Conservative case, **first-order ROAS (1.80) is
below break-even ROAS (1.95)** — meaning you *lose money on acquisition* and survive **only** on repeat
purchases. Thin margins force punishing volume (€96k/mo revenue, ~53 orders/day, €38k/mo ad spend). The
whole game is to operate in the Realistic-to-Optimistic band by improving **AOV, COGS, and retention**.

---

## 4. Break-even analysis

### 4a. Per-order break-even (contribution math)
Gross contribution margin **cm0 = 1 − COGS% − payment-fee% − (return rate × return-loss factor)**.

- Realistic: cm0 = 1 − 0.38 − 0.025 − (0.05 × 0.60) = **0.565 (56.5%)**.
- **First-order break-even ROAS = 1 / cm0 = 1.77.** Spend above this on CAC and the first order loses money;
  you then need repeat purchases to make the customer profitable.

### 4b. Cost stack you must cover (monthly, illustrative — validate)
| Cost | Estimate | Notes |
|---|---|---|
| COGS | 36–42% of revenue | Product + inbound shipping; lower as you private-label |
| Payment fees | ~2.5% + €0.30/order | Shopify Payments / Stripe (EU cards) |
| Returns | rate 4–7%, ~60% of returned value lost | Shipping both ways + restock/unsellable |
| Ad spend | ~31–40% of revenue (MER) | Your largest variable cost |
| **Fixed tooling (below)** | **~€300–500/mo** | Rises with scale/apps |

### 4c. Fixed tooling (starting stack — validate current prices)
| Tool | ~Monthly | Purpose |
|---|---|---|
| Shopify (Basic) | ~€32 | Storefront/checkout |
| Klaviyo | ~€0 → €45+ | Free to ~250 contacts, scales with list (your edge) |
| Reviews app (e.g. Judge.me) | ~€0–15 | Social proof |
| Bundle/upsell app | ~€0–30 | Build the ladder |
| Replenishment/subscription app | ~€0–40 | Balls/grips reorders |
| Domain | ~€1 | — |
| **Total** | **~€80–160 early; €300–500 at scale** | Add apps only when they pay for themselves |

**Cash break-even:** with ~€350 fixed + your ad test budget, expect to be **net-negative in months 1–2**
(this is normal and budgeted). You break even on a *cohort* once its repeat purchases cover the original CAC —
typically the second purchase. The store breaks even monthly once scaled revenue × net margin > fixed + ad spend.

---

## 5. Month 1–6 roadmap (realistic, low-risk budget)

Budget context: **€5–7k starting capital, €500–1,000/mo ad testing, low risk.** A cautious ad budget
collects purchase data **slowly**, so we assume a **longer validation window** — expect a product/offer
signal around **month 3–4**, not month 2. Do not scale on hope; scale on data.

### Month 1 — Foundation (expect a LOSS)
- Finalise positioning, brand name, logo; register domain.
- Build store (see `shopify-store-buildout.md`): 1 hero offer + a starter bundle + 3–5 accessories/consumables.
- Source initial catalogue (see `supplier-sourcing.md`): EU distributor for fast-shipping branded balls/accessories.
- Install + build Klaviyo flows **before** first ad (see `klaviyo-retention-plan.md`): welcome, abandoned cart,
  browse abandon, post-purchase. This is your edge — it must be live on day one.
- Begin ad creative testing at the **low end (€500–800)**; goal is *learning*, not profit.
- **Milestone:** store live, flows live, first 3–5 creatives tested. **Expected P&L: −€500 to −€1,500.**

### Month 2 — Signal hunting (expect a LOSS)
- Test 2–3 product angles × 3–5 creatives each (see `ad-testing-framework.md`).
- Kill losers fast; double down on any creative beating break-even ROAS.
- Get your **first 20–50 orders**; obsess over CVR, AOV, and early repeat behaviour.
- Collect reviews + UGC from real buyers (gold for a sport niche).
- **Milestone:** ≥1 creative/offer at or near break-even ROAS; ≥20 orders; email list building.
  **Expected P&L: −€300 to −€1,000.**

### Month 3 — Validation (approaching break-even)
- Concentrate spend on the proven angle; introduce the **starter bundle** to lift AOV.
- Turn on the **replenishment flow** for the first cohort of ball/grip buyers.
- First read on **repeat-purchase rate** — the metric that decides everything.
- **Milestone:** a repeatable winning offer; blended ROAS trending toward ~2.0+. **Target P&L: −€500 to +€500.**

### Month 4 — Early scale (first profit)
- Scale the winner per the framework's rules (20–30% budget steps on healthy ROAS).
- Expand catalogue around the winner; deepen the ladder.
- Decide on **first private-label SKU** (grips/bags first — low MOQ, high margin) if demand is proven.
- **Milestone:** consistent positive contribution. **Target net: +€500 to +€2,500.**

### Month 5 — Scale + retention compounding
- Push ad spend while blended ROAS holds; email now contributes a meaningful revenue share.
- Launch winback flow; optimise post-purchase cross-sell.
- Place first **private-label order** (longer lead time — plan cash).
- **Milestone:** retention visibly lifting blended ROAS. **Target net: +€2,000 to +€5,000.**

### Month 6 — Toward target
- Operate the full ladder; introduce/private-label the **hero racket** if the audience supports it.
- Tighten ops/fulfilment; negotiate supplier terms on volume.
- **Milestone:** on a trajectory toward €10k net within ~months 8–12 (see the 12-month ramp tab).
  **Target net: +€4,000 to +€8,000** (realistic scenario; **not** guaranteed).

> **Reality check on timeline:** Hitting a clean €10k *net* month is more likely **months 8–12** than month 6
> on a low-risk budget — the `Realistic 12-Mo Ramp` tab in the spreadsheet models exactly this, with
> deliberately loss-making early months and profit compounding as retention and scale kick in.

---

## 6. Key risks & honest failure modes

| Risk | Why it bites | Mitigation |
|---|---|---|
| **CAC higher than modelled** | Real CPMs/CVR may be worse than assumed | Validate fast at low spend; kill losers; lean on AOV + retention |
| **No product signal** | Not every catalogue finds a winner | Budget for 2–3 testing cycles; treat month 1–3 spend as tuition |
| **Cash crunch while scaling** | Ad spend + private-label inventory tie up cash *before* profit lands | Scale gradually; keep a reserve; private-label only after validation |
| **Racket competition** | Incumbents own premium feel/loyalty | Enter on accessories/consumables/bundles first; brand before you build a racket |
| **Seasonality** | Padel participation has seasonal/weather swings | Indoor-court regions + email base smooth demand; plan promos |
| **Return/sizing costs** | Shoes/apparel returns erode margin | Start with hard goods (balls/grips/bags/rackets); add apparel carefully |
| **Over-reliance on one channel** | Meta cost/policy shocks | Build email list (owned audience) from day one — your structural hedge |

---

## 7. How the rest of the framework connects

- `financial-model.xlsx` / `.csv` — edit inputs; outputs (this plan's tables) recalc live.
- `niche-validation-checklist.md` — re-score padel sub-segments or any new idea objectively.
- `supplier-sourcing.md` — EU vs China-agent vs POD routes + vetting questions.
- `shopify-store-buildout.md` — the store that makes these economics real.
- `klaviyo-retention-plan.md` — the flows that drive the "returning revenue share" input. **Your edge.**
- `ad-testing-framework.md` — how to spend the €500–1,000/mo test budget without wasting it.
- `README.md` — recommended order of execution.

*All benchmarks herein are assumptions to validate. Update this document and the model as you learn —
they are designed to be edited.*
