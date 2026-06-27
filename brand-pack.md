# Brand Pack — Padel Ecommerce

A complete starting brand identity: the chosen name, logos (real SVG files in
[`brand/logos/`](./brand/logos/)), colour, typography, voice, and imagery guidelines. Built to be **edited** —
tweak the palette or voice and the rest of the system (agents, content engine, store) follows.

> **Brand:** **PULSO** · **Domain/handle:** `pulso.ie` · **Instagram:** `@pulso.ie`
> ⚠️ Still validate **trademark clearance** (EUIPO / Irish registry) for PULSO in the relevant sporting-goods
> classes before printing/scaling. The logo itself is the **PULSO** wordmark only — the `.ie` is the domain/social
> handle and never appears inside the mark.

---

## 1. The name — PULSO

**PULSO** — Spanish for **pulse / heartbeat**. It carries a **wellness + fitness** meaning (energy, rhythm,
being "in your pulse"), stays short, premium and easy to say across the EU, and lets the **volt-yellow padel
ball become the final "O"** in the logo. (We originally explored *VOLEA* — "volley" — but `volea` domains were
taken; PULSO keeps the Spanish, sporty feel with a stronger health/energy angle and an open `.ie` domain.)

### Spanish wellness/fitness alternatives (kept on file)
If you ever want to revisit, these scored well on the same brief (Spanish, wellness/fitness, brandable,
ball-as-letter friendly):

| Name | Meaning | Note |
|---|---|---|
| **BRÍO** | vigor / zest / spirit | Punchy, premium; ball-as-O (`BRÍ●`) |
| **ÁNIMO** | spirit / encouragement ("¡ánimo!") | Best match to the encouraging brand voice |
| **VITALÉ** | vitality | Most overtly wellness; accent-forward |

> Decision is **PULSO**. The rest of this pack and the whole agent/content system are written around it; every
> reference is still swappable if you change your mind.

### Taglines
- **"Everything but the court."** — positioning line (you sell all the gear except the court itself). ★
- **"Find your pulso."** — brand/campaign line (plays on pulse/rhythm/energy).
- **"Made for the rally."** / **"Play with rhythm."** — alternates.

---

## 2. Logos

Real, editable files live in **[`brand/logos/`](./brand/logos/)** — open in a browser or vector editor
(Figma/Illustrator/Inkscape). **The mark is the PULSO wordmark only; no `.ie` in the logo.**

| File | What it is |
|---|---|
| `pulso-primary.svg` | Primary horizontal lockup — **PULS + ball-as-O** wordmark (navy on light) + positioning tagline |
| `pulso-stacked-dark.svg` | Stacked lockup on dark/navy: ball mark, **PULSO** wordmark, a **volt heartbeat/pulse line**, "Find your pulso" |
| `pulso-monogram.svg` | **"P" monogram** in a rounded navy tile with a ball accent — for avatars, app icons, favicons |
| `pulso-wordmark.svg` | Compact PULSO wordmark (ball-as-O), no tagline — for tight spaces |

> These are **concept SVGs** using a system sans fallback. For final production, set the brand font (below) and
> **convert text to outlines** so the logo renders identically everywhere. The **pulse/heartbeat line** in the
> dark lockup is a signature motif worth keeping — it literally draws the brand name's meaning.

**Logo usage basics:** keep clear space around the mark (≈ the height of the "ball"); don't stretch, recolour
outside the palette, add shadows, or place the navy wordmark on a busy/low-contrast background (use the dark
lockup instead). **Never add `.ie` or any URL into the logo lockup.**

---

## 3. Colour palette

**Primary palette — "Court Night"** (premium + the energy of a padel ball)

| Role | Name | HEX | Use |
|---|---|---|---|
| Primary dark | **Ink Navy** | `#0E1B2A` | Text, backgrounds, wordmark |
| Accent | **Volt** | `#C2F03C` | The ball; pulse line; CTAs, highlights (use sparingly) |
| Light base | **Chalk** | `#F6F7F2` | Page background, negative space |
| Neutral | **Slate** | `#8A94A3` | Secondary text, borders |
| Deep accent | **Court Teal** | `#0B6E6E` | Secondary brand colour, links |

**Alternative palette — "Clay Court"** (warmer, more lifestyle)
- Ink Navy `#0E1B2A` · **Clay/Coral** `#E8643C` (accent) · Chalk `#F6F7F2` · Sand `#E7DFD2` · Court Teal `#0B6E6E`.

**Accessibility:** body text Ink Navy on Chalk (high contrast). Volt is an **accent only** — never body text.
Ensure buttons meet WCAG AA.

---

## 4. Typography

| Role | Typeface | Notes |
|---|---|---|
| **Display / headings** | **Space Grotesk** (or Clash Display) | Geometric, sporty, modern; free (Google/Fontshare) |
| **Body / UI** | **Inter** | Highly legible, free, pairs cleanly with Space Grotesk |
| Fallback stack | `Inter, "Helvetica Neue", Arial, sans-serif` | For email/web safety |

**Hierarchy:** bold display headings (tight letter-spacing), generous body line-height, ALL-CAPS only for short
labels/buttons. Premium sport, not loud dropshipper.

---

## 5. Brand voice & personality

**Personality:** a knowledgeable, encouraging **fellow player** — the friend at the club who knows the gear and
wants you to improve and feel good doing it (the *pulso*: energy, rhythm, vitality). Confident, warm, honest.
**Not** hypey, not "BUY NOW!!!" dropshipper energy.

**Voice principles**
- **Player-to-player, not brand-to-consumer.** Speak from real padel knowledge.
- **Encouraging & inclusive.** Beginners welcome; improvers respected; no gatekeeping.
- **Energy + wellbeing.** Lean into rhythm, feeling good, moving more — PULSO's meaning.
- **Clear over clever.** Helpful first; wit second.
- **Honest.** No fake scarcity, no unverifiable/medical claims. Trust is the moat.

**Do say:** "Find your pulso." · "Fresh balls = better bounce = sharper games." · "New to padel? Start here."
**Don't say:** "🔥 INSANE DEAL 🔥", medical/performance claims, anything you can't back up.

**Mini messaging matrix**
| Audience | Hook angle |
|---|---|
| Beginner | "Everything you need to start — in one kit." |
| Improver | "The gear that helps you level up." |
| Regular/competitive | "Match-ready essentials, restocked on your schedule." |
| Gifter | "The padel obsessive in your life will love this." |

---

## 6. Imagery & art direction
- **Real over staged:** authentic on-court action, sweat, glass walls, the volt-yellow ball mid-flight. UGC > stock.
- **Light & energetic:** natural light, motion, community; Chalk/airy backgrounds for product.
- **Product:** clean, well-lit, spec-clear shots on Chalk or Ink backgrounds; ball-yellow as the recurring accent.
- **Motifs:** the **Volt ball** and the **pulse/heartbeat line** recur across logo, ads, and packaging.
- **Avoid:** generic gym stock, cluttered collages, low-res supplier images, over-filtered looks.

---

## 7. Brand-in-a-box (for the agents & content engine)
The single source of truth every AI agent and the content engine must follow:

```yaml
brand_name: PULSO
domain: pulso.ie            # NEVER inside the logo lockup
instagram: "@pulso.ie"
tagline_positioning: "Everything but the court."
tagline_brand: "Find your pulso."
meaning: "pulso (ES) = pulse / heartbeat — energy, rhythm, wellness + fitness"
positioning: "Improver/community padel gear — accessories, consumables & bundles, then private-label."
voice: "Knowledgeable, encouraging fellow player. Energy + wellbeing. Honest. No hype. No unverifiable/medical claims."
colors:
  ink_navy:  "#0E1B2A"
  volt:      "#C2F03C"
  chalk:     "#F6F7F2"
  slate:     "#8A94A3"
  court_teal:"#0B6E6E"
fonts:
  display: "Space Grotesk"
  body:    "Inter"
monogram_letter: "P"
motifs: ["volt-yellow padel ball (the 'O')", "volt pulse/heartbeat line"]
forbidden: ["medical/performance claims", "fake scarcity", "IP/trademark misuse", "hype-spam tone", "URL/.ie inside the logo"]
```

> Feed this block to every content/social/email agent so output stays on-brand automatically. See
> [`content-engine.md`](./content-engine.md) and [`agents/`](./agents/).

*All identity choices here are assumptions to validate (especially trademark). Edit freely as the brand sharpens.*
