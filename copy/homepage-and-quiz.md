# Homepage Copy + "Find Your Racket" Quiz (PULSO)

Ready-to-use copy for the PULSO storefront homepage and the racket-finder quiz. Written in brand voice
(knowledgeable, encouraging fellow player; energy + wellbeing; honest — no hype, no medical claims). Prices
reference `product-catalogue-starter.md`. **Logo-independent** — drop in once the new identity lands.

> All copy is editable. Validate claims, prices, and shipping promises against your real setup.

---

## PART 1 — HOMEPAGE

### Announcement bar
`Free EU shipping over €60 · 2–5 day delivery · Easy 14-day returns`

### Hero
**Headline:** Everything but the court.
**Sub-headline:** Padel gear, balls and grips that keep your game sharp — picked by players, shipped fast across Europe.
**Primary CTA:** Shop the Starter Kit →
**Secondary CTA:** Find your racket

*(Alt hero headlines to A/B: "Find your pulso." · "Your game, fully kitted." · "Play more padel.")*

### Trust strip (under hero)
`★★★★★ Loved by EU players` · `Fast 2–5 day EU delivery` · `Secure checkout` · `Real padel players, real advice`

### Value props (3-up)
1. **Gear that actually plays.** No random dropship clutter — a tight range of balls, grips, bags and rackets we'd use ourselves.
2. **Never play with dead balls.** Fresh balls and grips, restocked on your schedule with Subscribe & Save.
3. **Fast, EU-wide.** Stocked in Europe for 2–5 day delivery and easy returns. No three-week waits.

### Featured: Starter Kit
**Eyebrow:** NEW TO PADEL?
**Headline:** Everything you need to start — in one kit.
**Body:** Racket, balls, an overgrip and a bag, ready to play. Skip the guesswork and step on court with the right gear.
**Price:** €99.99 · **CTA:** Shop the Starter Kit →

### Shop by level
**Headline:** Find gear for your game.
- **Beginner** — forgiving, easy-to-play gear → *Shop beginner*
- **Improver** — more control and feel as you level up → *Shop improver*
- **Advanced** — precision for the competitive player → *Shop advanced*
**CTA under section:** Not sure? **Find your racket →** (links to quiz)

### Consumables + subscription
**Headline:** Fresh balls. Fresh grip. Every time.
**Body:** Balls lose their bounce in a few weeks; grips wear out faster. Set up a Replenish Pack and we'll send fresh ones on your schedule — cancel anytime.
- Match Balls (3-tube) — €11.99
- Overgrips (3-pack) — €8.99
- **Replenish Pack (Subscribe & Save)** — €18.99/cycle · *Save ~15%*
**CTA:** Start your Replenish Pack →

### Bestsellers / featured grid
`Match Balls €11.99` · `Overgrips 3-pack €8.99` · `Vibration Dampeners €7.99` · `PULSO Racket Bag €49.99` ·
`Essentials Pack €24.99` · `PULSO "Pulse" Racket €109.99`

### Social proof
**Headline:** Players rate us.
> "Balls arrived in two days and the grips are so much better than my old ones." — *[Name], [City]*
> "The Starter Kit got me on court without the stress of choosing. Brilliant." — *[Name], [City]*
*(Pull live reviews via Loox/Judge.me; show photo UGC.)*

### Brand story (short)
**Headline:** Made by players, for players.
**Body:** PULSO started on the court — chasing the buzz of a good rally and tired of overpriced, confusing gear.
We keep the range tight, the advice honest, and the balls fresh. *Find your pulso.*
**CTA:** Our story →

### Email capture (feeds Klaviyo welcome flow)
**Headline:** Get on the list.
**Body:** Padel tips, new gear, and a welcome offer on your first order.
**Field:** Email · **Button:** Join PULSO
*(Optional: "Take the racket quiz" as the value-led entry — see Part 2.)*

### Footer
- **Shop:** Rackets · Balls · Grips & Tape · Bags · Accessories · Bundles · Apparel
- **Help:** Shipping · Returns · Find your racket · Contact · FAQ
- **About:** Our story · Reviews · Sustainability
- **Legal:** Privacy · Terms · Refunds · Imprint
- `pulso.ie · @pulso.ie · Fast EU shipping · Secure checkout`

---

## PART 2 — "FIND YOUR RACKET" QUIZ

**Goal:** reduce choice paralysis, capture email, recommend a racket + bundle, raise AOV. Captures the player's
**level** for Klaviyo segmentation. 5 quick questions → a recommendation.

### Intro screen
**Headline:** Find your racket in 30 seconds.
**Body:** Answer 5 quick questions and we'll match you to the right racket and kit for your game.
**CTA:** Start →

### Q1 — How long have you played padel?
- A) Just starting / haven't yet → *level: beginner*
- B) A few months, getting the hang of it → *level: improver*
- C) I play regularly / competitively → *level: advanced*

### Q2 — What matters most to you right now?
- A) Easy to play and forgiving → *control/comfort*
- B) A balance of control and power → *all-round*
- C) Maximum power and precision → *power*

### Q3 — How often do you play?
- A) Occasionally (≤1×/week)
- B) Weekly
- C) Multiple times a week → *(flag: great Replenish Pack candidate)*

### Q4 — Do you have the basics (balls, grip, bag)?
- A) Nope, starting from scratch → *(recommend Starter Kit)*
- B) Some of it
- C) Fully kitted, just need the racket

### Q5 — What's your budget for a racket?
- A) Keep it affordable
- B) Mid-range, room to grow
- C) Best value performance

### Result logic (mapping)
| Player profile | Racket | Add-on suggestion |
|---|---|---|
| Beginner · control · from scratch | **PULSO "Tempo" €89.99** | **Starter Kit €99.99** (racket+balls+grip+bag) |
| Improver · all-round | **PULSO "Pulse" €109.99** | Essentials Pack €24.99 + Racket Bag €49.99 |
| Advanced · power · plays often | **PULSO "Pulse" €109.99** (diamond coming soon) | **Replenish Pack €18.99/cycle** + dampeners €7.99 |
| Any · "fully kitted, just need racket" | matched racket by level/style | Overgrips 3-pack €8.99 |
| Any · plays multiple times/week | matched racket | **Replenish Pack (Subscribe & Save)** highlighted |

### Result screen
**Headline:** Your match: [Racket name].
**Body:** Based on your answers, [Racket] suits your level and style. Want it ready-to-play? Add the [bundle] and step on court fully kitted.
**CTAs:** Add [Racket] to cart · Add the [Bundle]
**Email gate (before/after result):** "Want your result + a welcome offer? Drop your email." → feeds Klaviyo welcome flow, tagged with the player's level.

### Post-quiz Klaviyo handoff
- Tag profile with **level** (beginner/improver/advanced) and **play style** for segmentation.
- Trigger the **welcome flow** (see `copy/email-flows-copy.md`), personalised to their result.
- If "plays multiple times/week" → also surface **Replenish Pack** in flow content.

*Maps to: `product-catalogue-starter.md` · `shopify-store-buildout.md` · `klaviyo-retention-plan.md`*
