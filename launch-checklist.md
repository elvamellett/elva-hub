# PULSO — 0-to-Launch Operational Checklist + 30/60/90-Day Timeline

**Brand:** PULSO — padel gear (EU) · **Domain:** pulso.ie · **Stack:** Shopify + Klaviyo + Meta ads
**Goal:** €10k net/month · **Capital:** €5–7k · **Ad testing:** €500–1k/mo (low-risk)
**Strategy:** accessory/consumable-led → private-label · retention/email is the core profit lever

> How to use this file: work the phases top-to-bottom. Phases 2, 3, and the Go-Live Gates are **hard gates** — do not move forward until they pass. Every figure here is an **ASSUMPTION to validate** against `financial-model.xlsx` and live data, not a promise.

---

## PHASE 0 — Foundations (legal, money, plumbing)

### Brand, domain & IP
- [ ] Confirm `pulso.ie` registered, DNS access in hand, auto-renew on
- [ ] Trademark check: search EUIPO + Irish IPOIE for "PULSO" in class 28 (sports goods) and 25 (apparel) — *assumption to validate: name is clear in the EU sporting-goods class*
- [ ] Decide whether to file an EU trademark now or after validation (cash-dependent — defer if tight)
- [ ] Secure social handles @pulso.ie (or closest available) before public launch — see `copy/social-content-starter.md`
- [ ] Lock brand assets from `brand-pack.md` (logo, colours, fonts, tone)

### Business & money setup
- [ ] Register business entity (sole trader vs Ltd — **get accountant advice**)
- [ ] Business bank account + card for ad spend separate from personal
- [ ] Business email on the domain (e.g. hello@pulso.ie, orders@pulso.ie) via Google Workspace
- [ ] **EUR / VAT / OSS:** register for Irish VAT; set up **OSS (One-Stop-Shop)** for cross-border EU B2C VAT — **get accountant advice before charging customers** *(assumption: OSS is the right scheme for EU-wide DTC; confirm thresholds)*
- [ ] Decide pricing as VAT-inclusive (EU norm) and confirm in Shopify tax settings
- [ ] Bookkeeping tool / spreadsheet set up; map to `financial-model.xlsx`

### Shopify base
- [ ] Start Shopify trial; choose plan (Basic to start)
- [ ] Install a fast, clean theme (Dawn or paid Sports theme); apply `brand-pack.md`
- [ ] Connect `pulso.ie` domain, force HTTPS, set primary domain

### Legal & policy pages
- [ ] Create policy pages — draft from `copy/store-pages.md` *(file to be created — not yet in `copy/`)*: Terms, Privacy (GDPR), Refund/Returns, Shipping, Cookie policy, Imprint/Contact
- [ ] EU consumer rights: 14-day withdrawal right stated clearly
- [ ] Cookie consent banner (GDPR/ePrivacy) installed and tested

### Payments
- [ ] Enable **Shopify Payments / Stripe** (cards) — confirm available for IE entity
- [ ] Add **PayPal** (high EU trust)
- [ ] Add local EU methods: **iDEAL** (NL), **Bancontact** (BE), **Klarna/Sofort** where supported — *assumption to validate: which markets convert; start with PayPal + cards, add locals as data warrants*
- [ ] Run a €1 live test transaction, then refund it

### Shipping
- [ ] Shipping rules: **free over €60**, flat rate below; **2–5 day EU** delivery promise
- [ ] Set carrier(s) + zones (IE, then wider EU); confirm rates vs margin in `financial-model.xlsx`
- [ ] Packaging sourced (protective for rackets/strings); returns address set
- [ ] Note: free-ship €60 threshold sits below the €70 realistic AOV — *validate it lifts AOV without eating margin*

---

## PHASE 1 — Store Build

### Catalogue
- [ ] Import products from `product-catalogue-starter.md` (export to CSV → Shopify import)
- [ ] Verify titles, prices, COGS, SKUs, variants, stock, weights
- [ ] Add product images + descriptions; lead with accessories/consumables (overgrips, balls, strings, bags) per strategy
- [ ] Set up **Collections by level** (Beginner / Improver / Advanced) **and by type** (Rackets / Balls / Grips / Bags / Apparel / Accessories)

### Pages & merchandising
- [ ] Build homepage from `copy/homepage-and-quiz.md` (hero, value props, social proof, collections)
- [ ] Build the **"Find your racket" quiz** from `copy/homepage-and-quiz.md`; route results to collections + capture email
- [ ] Follow structure/specs in `shopify-store-buildout.md`

### Apps & CRO
- [ ] **Bundles** app (e.g. starter kit: racket + balls + overgrip) — raises AOV toward €70
- [ ] **Subscription / replenishment** app for consumables (balls, overgrips, strings) — core to the retention lever
- [ ] **Reviews** app (Judge.me / Loox); seed with early/sample reviews honestly
- [ ] Trust/CRO essentials: trust badges, clear shipping/returns on PDP, sticky add-to-cart, fast mobile load, accelerated checkout

### Pre-launch QA
- [ ] Place a full **test order** end-to-end (real payment)
- [ ] Process a **test refund**; confirm customer-facing emails fire
- [ ] Mobile + desktop walkthrough; fix broken links / slow images

---

## PHASE 2 — Retention BEFORE Traffic  🚧 GATE

> **Do not run paid traffic until these flows are live.** Retention is the profit lever — the model assumes ~33% of revenue is returning, ad-cost-free. Build it first. Source: `klaviyo-retention-plan.md` + `copy/email-flows-copy.md`.

### Klaviyo setup
- [ ] Connect Klaviyo to Shopify; sync catalogue + historical events
- [ ] Create lists/segments per `klaviyo-retention-plan.md` (buyers, engaged, lapsing, by sport-level)

### Core flows (build all, use copy from `copy/email-flows-copy.md`)
- [ ] **Welcome / signup** series (incl. quiz-completers)
- [ ] **Abandoned cart** (multi-step)
- [ ] **Browse abandonment**
- [ ] **Post-purchase** (thank-you, cross-sell, review request)
- [ ] **Replenishment** (consumables — timed to ball/grip/string wear) — flagship retention flow
- [ ] **Win-back** for lapsed customers

### Capture & deliverability
- [ ] Signup popup live (offer + quiz hook), GDPR consent checkbox, double-opt-in considered
- [ ] **Deliverability:** authenticate sending domain — SPF, DKIM, DMARC, custom Klaviyo sending domain on pulso.ie
- [ ] Warm-up plan for new domain; monitor spam placement
- [ ] **GDPR consent** captured + stored for every subscriber; suppression honored
- [ ] Send test sends of every flow to yourself; verify rendering + links + merge tags

---

## PHASE 3 — Tracking & Analytics  🚧 GATE (before ads)

> **No ad spend until events verified firing on a real test order.** Bad tracking = wasted budget and unmeasurable tests.

- [ ] **Meta Pixel** installed via Shopify channel
- [ ] **Meta Conversions API (CAPI)** enabled (server-side) + deduplication with Pixel
- [ ] **GA4** property connected; ecommerce events on
- [ ] Shopify analytics dashboards reviewed; baseline KPIs noted
- [ ] **UTM discipline:** naming convention documented (source/medium/campaign/content) for every paid + email link
- [ ] Place a **test order** and verify in Meta Events Manager + GA4 DebugView: ViewContent, AddToCart, InitiateCheckout, **Purchase** all fire once (no double-count)
- [ ] Confirm CAPI + Pixel dedupe working (no inflated conversions)

---

## PHASE 4 — Launch

### Soft launch
- [ ] Open store to friends/network/early list; gather first orders + feedback
- [ ] Fix anything surfaced (UX, copy, shipping reality)
- [ ] Confirm first real fulfilments go out within the 2–5 day promise

### First paid tests
- [ ] Launch **ad creative tests** per `ad-testing-framework.md`, using `copy/ad-creative-batch-1.md`
- [ ] Budget discipline: **€500–1k/mo** total; small ad sets, structured tests, kill losers fast
- [ ] Track against break-even ROAS (~1.77 realistic) from `financial-model.xlsx`; judge on CTR/CVR/CAC, not vanity reach

### Social & supply
- [ ] Set up profiles @pulso.ie; publish **first 2 weeks** of content from `copy/social-content-starter.md`
- [ ] Content cadence per `content-engine.md`
- [ ] **Supplier samples in hand** and reviewed per `supplier-sourcing.md` (quality-check before scaling any SKU)

---

## 30 / 60 / 90-Day Timeline

> Profit reality: **months 1–2 are loss-making** (spend < returns, learning). Aim for **validation around month 3–4**. Targets below are checkpoints, not guarantees — reconcile monthly against `financial-model.xlsx`.

### Days 0–30 — Build & Launch (expect a loss)
- [ ] Phases 0–3 complete; Go-Live Gates passed
- [ ] Soft launch + first ad tests live (€500–1k)
- [ ] **Milestones:** store live, all 6 flows running, tracking verified, first real orders
- [ ] **KPIs to watch:** CTR, landing→purchase CVR (target ~2.4%), CAC (~€37), AOV (target ~€70)
- [ ] **Profit:** negative — treat spend as tuition/data. Keep ad spend at the low-risk floor.

### Days 31–60 — Find a Winner (still likely a loss)
- [ ] Iterate creative; double down on any ad set near break-even ROAS (~1.77)
- [ ] Optimise quiz → email → first-purchase funnel; tighten abandoned-cart + welcome
- [ ] First **replenishment / subscription** signups should begin appearing
- [ ] **Milestones:** ≥1 creative angle clearly outperforming; repeat purchases starting
- [ ] **Profit:** near break-even on first-order economics if a winner emerges; overall still investing.

### Days 61–90 — Validate & Decide
- [ ] Confirm returning-revenue share trending toward ~33% (retention working)
- [ ] Scale spend **only** on proven winners; hold to capital limits
- [ ] **Private-label go/no-go:** commit cash only if an accessory/consumable SKU has validated demand + healthy margin + repeat behaviour
- [ ] **Milestones:** repeatable acquisition at acceptable CAC; retention flows contributing measurable revenue
- [ ] **Profit:** target first profitable or break-even month — *€10k net is a later-stage goal (requires ~€50k/mo revenue, ~700 orders/mo at realistic case), not a 90-day target*

### Beyond 90 days
- [ ] Scale ad budget with working capital as ROAS holds (blended target ~2.84)
- [ ] Expand private-label range from validated winners
- [ ] Grow toward the model's revenue/orders needed for €10k net/month

---

## GO-LIVE GATES (do not skip)

- [ ] 🚧 **No ads until** all Klaviyo flows are live + tested (Phase 2)
- [ ] 🚧 **No ads until** Meta Pixel **and** CAPI + GA4 are firing, verified on a real test order (Phase 3)
- [ ] 🚧 **No ads until** a full test order **and** test refund have passed (Phase 1)
- [ ] 🚧 **No ads until** legal/policy pages, payments, and shipping rules are live (Phase 0)
- [ ] 🚧 **No private-label cash committed until** a product has validated (demand + margin + repeat purchase) — ~month 3+
- [ ] 🚧 **Hold ad spend at €500–1k/mo** until first-order economics are understood; scale only on proven winners
- [ ] 🚧 **Confirm VAT/OSS handling with an accountant** before charging EU customers

---

## Assumptions to validate (keep honest)
- AOV €70, CVR 2.4%, CAC ~€37, returning-revenue share 33% — all **model assumptions**, not facts (`financial-model.xlsx`)
- Meta EU CPM ~€15 — validate with live spend
- Free-shipping threshold (€60) lifts AOV without killing margin
- Local EU payment methods are worth the setup — add as data warrants
- €10k net/month needs ~€50k revenue and ~700 orders/mo (realistic case) — a scaling goal, not a launch goal

---

Maps to: ./README.md (and the framework files it references)
