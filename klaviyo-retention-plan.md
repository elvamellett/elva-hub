# Klaviyo Retention Plan (Padel) — Your Competitive Edge

This is the most detailed file in the framework, because **retention is the primary profit lever** in this
business. In the financial model, "returning revenue share" carries **no ad cost** — moving it from 28% → 35%
is the difference between needing ~€96k/mo and ~€37k/mo revenue to net €10k. Padel is uniquely suited to this:
**balls and overgrips are consumables players replace constantly.** Build these flows **before you run ads.**

> Benchmarks below are industry-typical **targets to validate**, not guarantees. Email revenue share and flow
> conversion vary by list quality, offer, and product. Track your own numbers and iterate.

---

## 0. Foundations (do these first)

### Deliverability & setup
- [ ] **Authenticate your domain** in Klaviyo (dedicated sending domain, DKIM/SPF/DMARC). Non-negotiable for inbox placement.
- [ ] Warm up gradually; keep early sends to **engaged** contacts to build sender reputation.
- [ ] Set a **branded email template** (header/logo, footer with address + unsubscribe — legally required, GDPR/CAN-SPAM).
- [ ] Connect Shopify integration fully (so Placed Order, Started Checkout, Viewed Product, etc. all flow in).
- [ ] **GDPR-compliant consent** at signup (explicit opt-in; separate SMS consent).

### List growth (feed the machine)
- [ ] **Signup popup**: offer value, not just "10% off" — e.g. the **"Find your racket" quiz** or "Padel improvement tips + welcome offer." Capture email (and SMS optionally).
- [ ] Quiz/guide as a lead magnet (captures level → enables segmentation from day one).
- [ ] Footer signup, checkout opt-in, post-purchase opt-in.
- [ ] Target a healthy **signup rate** (popup ~3–6% of visitors is a reasonable benchmark to beat).

### Core segments to create
- **Engaged (30/60/90-day openers/clickers)** — your reliable senders.
- **Players by level** (beginner / improver / advanced) — from quiz.
- **Buyers vs non-buyers**; **1-time vs repeat**; **VIP (top spenders)**.
- **Consumable buyers** (bought balls/grips) — fuel for replenishment.
- **Lapsing/lapsed** — for winback.
- **Suppressed/unengaged** — exclude to protect deliverability.

---

## 1. Flow priority & build order

| # | Flow | Why it matters | Build priority |
|---|---|---|---|
| 1 | **Welcome / lead nurture** | Converts new subscribers; sets brand | 🟥 Day-one |
| 2 | **Abandoned checkout** | Recovers lost revenue (highest direct ROI) | 🟥 Day-one |
| 3 | **Browse abandonment** | Captures intent before cart | 🟧 Week 1 |
| 4 | **Post-purchase** | Onboarding, reviews, first cross-sell | 🟥 Day-one |
| 5 | **Replenishment (balls/grips)** ⭐ | THE padel retention engine | 🟥 Day-one logic, refine with data |
| 6 | **Winback** | Reactivates lapsed buyers | 🟧 Week 2–3 |
| 7 | **Padel improvement / community nurture** | Engagement, brand love, soft sell | 🟨 Month 1–2 |

---

## 2. FLOW DETAILS

> Format for each: **Goal · Trigger · Filters/logic · Timing · Message sequence · KPI targets.**
> Timings are starting points — A/B and adjust.

### ⭐ FLOW 1 — Welcome / Lead Nurture
**Goal:** Convert new subscribers to first purchase; establish brand, trust, and the hero+bundle offer.
**Trigger:** Subscribed to list (popup/quiz/footer).
**Filters:** Skip if already placed an order since trigger. Exclude existing customers.
**Timing & sequence:**
| Email | Delay | Content | Primary CTA |
|---|---|---|---|
| 1 | Immediate | Deliver the promised value (quiz result / tips) + welcome offer (e.g. 10% or free balls over €X). Warm brand intro. | Shop hero / claim offer |
| 2 | +1 day | Brand story + why you (you're a player/community). Bestsellers + **starter bundle**. | Shop starter bundle |
| 3 | +2 days | Education: "How to choose a racket for your level" (uses their quiz segment if available). Social proof/reviews. | Find your racket |
| 4 | +2 days | **Offer reminder / urgency** (offer expiring) + objection handling (shipping speed, returns, guarantee). | Claim offer before it expires |
| (5) | +3 days | *Non-openers branch:* resend Email 1 with new subject line. | — |
**KPI targets (validate):** Open ~40–55%, Click ~4–8%, Flow placed-order rate **~3–6%+** of subscribers;
welcome flow should drive a meaningful share of total email revenue.

---

### ⭐ FLOW 2 — Abandoned Checkout (Started Checkout)
**Goal:** Recover shoppers who entered checkout but didn't pay. Usually the **highest direct-ROI flow.**
**Trigger:** Started Checkout.
**Filters:** Skip if Placed Order since trigger. Exclude recent recipients (don't over-mail).
**Timing & sequence:**
| Email | Delay | Content | Notes |
|---|---|---|---|
| 1 | +1 hour | "Did something go wrong?" Dynamic **cart contents** + checkout link. Helpful tone, no discount yet. | Capture the "just got distracted" recovery |
| 2 | +12–24 hrs | Reinforce value: reviews, fast EU shipping, easy returns. Cross-sell "complete your kit." | Trust + AOV |
| 3 | +24–48 hrs | **Incentive** (small discount or free balls/grip) + light urgency (low stock / offer ends). | Use sparingly to protect margin |
**Logic tips:** Add **SMS** between emails 1 and 2 for opted-in contacts (huge recovery lift). Suppress the
discount email for high-AOV carts if margin-sensitive.
**KPI targets:** Recover **~5–12%** of abandoned checkouts via the flow; this flow alone often = a large slice of email revenue.

---

### FLOW 3 — Browse Abandonment (Viewed Product)
**Goal:** Re-engage shoppers who viewed a product but didn't add to cart — earlier intent than checkout.
**Trigger:** Viewed Product (and didn't start checkout / purchase).
**Filters:** Only engaged/identified profiles; skip if Started Checkout or Placed Order since trigger; cap frequency.
**Timing & sequence:**
| Email | Delay | Content |
|---|---|---|
| 1 | +3–6 hrs | "Still thinking about it?" Show the **viewed product** + 2–3 related items. Soft, helpful. |
| 2 | +1 day | Add reviews/spec help for that product category + a "complete your kit" nudge. *(No discount — intent is softer.)* |
**KPI targets:** Open ~40%+, Click ~3–6%, placed-order rate ~1–3%. Lower revenue than cart, but cheap incremental wins.

---

### ⭐ FLOW 4 — Post-Purchase (Onboarding + Cross-sell + Reviews)
**Goal:** Maximise first-order experience, drive reviews/UGC, set up the **second purchase** (the LTV unlock).
**Trigger:** Placed Order.
**Filters:** Branch by product (racket buyers vs consumable buyers vs apparel) and by 1st-vs-repeat buyer.
**Timing & sequence:**
| Email | Delay | Content | Goal |
|---|---|---|---|
| 1 | Immediate–+1hr | Thank-you + what happens next (shipping). Brand reassurance. *(Separate from Shopify's transactional confirmation.)* | Reduce anxiety |
| 2 | +3–5 days (≈ delivery) | "Getting started" value: racket care, grip-fitting, ball care, on-court tips for their item. | Delight + usage |
| 3 | +7–10 days | **Review/photo request** (Loox/Judge.me). Sport buyers love sharing — incentivise lightly. | UGC + social proof |
| 4 | +12–16 days | **Cross-sell the ladder**: balls/grips/bag/dampener relevant to what they bought; intro starter bundle if they bought a single item. | 2nd order / AOV |
| 5 | +20–25 days | Invite to community (IG/TikTok/club), tips content, soft loyalty intro. | Retention |
**KPI targets:** Review submission **~5–15%** of buyers; repeat-purchase contribution rising; this flow seeds the
33%+ "returning revenue share" the model depends on.

---

### ⭐⭐ FLOW 5 — Replenishment / Reorder (THE padel engine)
**Goal:** Bring consumable buyers back automatically — **recurring revenue with zero new ad cost.** This is the
single most valuable flow for *this* niche.
**Trigger:** Placed Order **containing a consumable** (balls and/or overgrips). Build one variant per consumable.
**Filters:** Customer bought balls/grips; not already reordered; active player segment.
**Timing logic:** Time the reminder to the **real consumption cycle** (validate with your data):
- **Balls:** regular players replace roughly every **3–4 weeks / few sessions** → first reminder ~**21–28 days** post-purchase.
- **Overgrips:** wear every few sessions → reminder ~**3–4 weeks**, recurring.
**Sequence (per consumable):**
| Email | Delay (from purchase) | Content | CTA |
|---|---|---|---|
| 1 | ~21–28 days | "Time for fresh balls?" Educate on bounce/wear → performance. One-click reorder of exact product. | Reorder in 1 click |
| 2 | +5–7 days (if no reorder) | Bundle nudge: "Stock up & save" (3-pack), add a grip. Free-ship threshold reminder. | Stock up & save |
| 3 | +7 days (if no reorder) | Last nudge + **subscribe & save** offer (turn them into a subscription). | Subscribe & save |
**Subscription layer:** Pair this flow with a **subscribe-and-save** option (Recharge/Appstle/Shopify
Subscriptions) on balls/grips — converts the best customers into predictable MRR. Promote it in Email 3 and in post-purchase.
**KPI targets:** Reorder rate on consumable buyers climbing toward **30–40%+**; subscription opt-in growing; this
flow should become one of your top revenue flows over time.

---

### FLOW 6 — Winback (Lapsed Customers)
**Goal:** Reactivate buyers who've gone quiet before they're lost; protect deliverability by sunsetting the truly dead.
**Trigger:** Customer hasn't purchased in **X days** (set by cycle — e.g. 60–90 days for active players; longer for racket-only buyers).
**Filters:** Has purchased before; not purchased in window; still email-engaged (separate path for unengaged).
**Timing & sequence:**
| Email | Delay | Content |
|---|---|---|
| 1 | At lapse threshold | "We miss you on court" — what's new (products, content), no discount. |
| 2 | +4–5 days | Social proof + best-sellers + reason to return; light incentive. |
| 3 | +5–7 days | **Stronger win-back offer** + "is this goodbye?" (re-confirm consent). |
| 4 | +7 days (unengaged) | **Sunset**: final email; if no engagement, suppress to protect sender reputation. |
**KPI targets:** Reactivate ~5–10% of lapsed; keep list healthy (suppress dead weight).

---

### FLOW 7 — Padel Improvement / Community Nurture
**Goal:** Build brand love and engagement between purchases so you stay top-of-mind and your sends stay
warm — a soft-sell engine that lifts every other flow's performance.
**Trigger:** Engaged subscribers / segment-based (by level); evergreen drip + ongoing campaigns.
**Sequence / cadence (value-first, ~80% value / 20% sell):**
- Technique tips by level (beginner serve, bandeja/vibora for improvers).
- Gear education (how to pick a racket, when to replace balls/grips — *naturally* seeds replenishment).
- Community spotlights / UGC / club & tournament content.
- Seasonal: indoor vs outoor season, gifting (padel makes great gifts), tournament calendars.
**KPI targets:** Sustained open/click on engaged segment; rising email-attributed revenue share; lower unsubscribe.

---

## 3. Campaign calendar (beyond flows)
Flows are automated; **campaigns** are your broadcasts. Keep a light, consistent cadence (1–3/week to engaged segments):
- New product drops, restocks, bundles.
- Educational/community content (drives engagement → deliverability).
- Seasonal promos (start of season, holidays, Black Friday — plan margin carefully).
- VIP-only early access / perks.
- **Always send to engaged segments first**, then expand — protects inbox placement.

---

## 4. KPI dashboard (track monthly — validate your own baselines)

| Metric | Starter target | Why |
|---|---|---|
| **Email-attributed revenue share** | work toward **25–35%+** of total | This IS the "returning revenue share" in the model |
| Flow vs campaign revenue split | Flows should be the majority early | Automated = compounding |
| Welcome flow conversion | ~3–6%+ of subscribers | First-purchase engine |
| Abandoned checkout recovery | ~5–12% | Highest direct ROI |
| Consumable reorder rate | climbing to **30–40%+** | The padel LTV unlock |
| Subscription opt-in (balls/grips) | growing | Predictable MRR |
| List growth rate | steady positive | Fuel |
| Open / Click (engaged) | ~40%+ / ~2–5% | Deliverability + relevance |
| Unsubscribe / spam rate | <0.2% / <0.05% | Health guardrails |
| Repeat-purchase rate | rising QoQ | LTV |

---

## 5. The retention philosophy (why this wins)
1. **Acquisition is near break-even; retention is where you profit.** Padel's consumables make this structurally easy — most niches don't get a built-in reorder cycle. Exploit it.
2. **Own the audience.** Email/SMS is your hedge against Meta CPM and policy shocks — the one asset you control.
3. **Value before selling.** A community-first sport brand keeps engagement (and deliverability) high, which makes every promotional send work harder.
4. **Feed the model.** Every point of reorder rate or email revenue share you win lowers the revenue you need to hit €10k net. This file is where the business actually becomes profitable.

*Update timings and targets with your real consumption and engagement data — these flows are meant to be tuned.*
