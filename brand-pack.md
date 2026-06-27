# Brand Pack — PULSO

**Brand Guidelines · v1.0** — *The pulse of the game.*

PULSO is the Spanish word for **pulse** — the rhythm of a rally, a body in motion, a community that plays.
This is the single source of truth for how the identity looks, sounds and behaves. Final logo assets live in
[`brand/logos/`](./brand/logos/); the full visual guide is [`brand/PULSO-brand-pack.html`](./brand/PULSO-brand-pack.html).

> **Brand:** **PULSO** · **Domain/handle:** `pulso.ie` · **Instagram:** `@pulso.ie`
> Still validate **trademark clearance** (EUIPO / Irish registry) in the relevant sporting-goods classes.

---

## 1. The idea
The meaning lives inside the name: **the "O" becomes a pulse reading — a single clean heartbeat traced through
the wordmark.** No ball. No racket. Just energy and rhythm, drawn with restraint. A **heavy italic wordmark**
gives forward motion and premium sporting confidence; **deep navy** keeps it trusted and grown-up; **one
electric-blue accent** supplies the charge.

### Taglines
- **"Find your pulso."** — brand line.
- **"Everything but the court."** — positioning (all the gear except the court itself).
- **"The pulse of the game."** — brand essence / campaign line.

---

## 2. Logos

Official assets in **[`brand/logos/`](./brand/logos/)** — PNGs exported from the design. The **pulse-disc
replaces the "O"** and must never be detached or recoloured on its own.

| File | What it is |
|---|---|
| `pulso-wordmark.png` | **Primary** — horizontal heavy-italic wordmark (navy). Use wherever space allows. |
| `pulso-disc.png` | Wordmark + **pulse-disc** lockup (navy on light). |
| `pulso-disc-white.png` | Same lockup knocked out in white (for dark/photo backgrounds). |
| `pulso-mark-navy.png` | The **pulse mark** in a navy rounded disc — default app icon / favicon / avatar. |
| `pulso-mark-blue.png` | Pulse mark on the **electric-blue** accent — high-energy moments. |
| `pulso-mark-white.png` | One-colour white mark — for dark/photo backgrounds. |
| `pulso-instagram-avatar.png` | 1080×1080 IG avatar (wordmark sized to sit inside the circular crop). |

**Usage**
- ✓ Keep the wordmark and pulse-disc **locked together** as supplied.
- ✓ Use navy, white-on-navy, or the blue accent — **always high contrast**.
- ✓ Clear space on all sides = **height of the pulse mark**. Min sizes: horizontal logo **120px / 32mm** wide; mark **24px / 8mm**.
- ✓ Use the square mark for app icons / avatars.
- ✕ **Never** place a URL, ".ie" or tagline inside the logo.
- ✕ Don't stretch, rotate, outline, recolour or add effects.
- ✕ Don't detach or recolour the pulse-disc.
- ✕ **Never** add a ball, racket or any sports-equipment motif.

---

## 3. Colour

Navy leads, chalk grounds, **one electric accent** carries energy — used **sparingly** (highlights, CTAs,
moments of charge), never as a wash.

| Role | Name | HEX | Use |
|---|---|---|---|
| Primary | **Ink Navy** | `#0E1B2A` | Text, lockups, backgrounds |
| Accent | **Electric Blue** | `#2E6BFF` | CTAs, highlights, the charge (sparingly) |
| Light base | **Chalk** | `#EDEAE2` | Backgrounds, negative space |
| Neutral | **Slate** | `#5B6675` | Body, captions, secondary text |
| Secondary | **Deep Sky** | `#1C3A5E` | Depth, panels |

**Accessibility:** body text Ink Navy (or Slate) on Chalk = high contrast. Electric Blue is an **accent** —
ensure buttons/links meet WCAG AA; avoid blue body text on chalk at small sizes.

---

## 4. Typography

A geometric grotesque for display pairs with a clean, legible body face. Both free and screen-tested.

| Role | Typeface | Weights | Use |
|---|---|---|---|
| **Display** | **Space Grotesk** | 500 / 700 | Headlines, numbers, UI titles |
| **Body** | **Inter** | 400 / 500 / 600 | Body, captions, UI |
| Fallback | `Inter, "Helvetica Neue", Arial, sans-serif` | — | Email/web safety |

**Hierarchy:** bold display headings (tight tracking); generous body line-height; ALL-CAPS only for short labels.
The wordmark is set heavy + italic — don't recreate it in regular weight.

---

## 5. Brand voice & personality

**Personality:** a knowledgeable, encouraging **fellow player** — the friend at the club who knows the gear and
wants you to play more and feel good doing it (the *pulso*: energy, rhythm, motion). Confident, warm, honest.
**Not** hypey, not "BUY NOW!!!" dropshipper energy.

**Voice principles**
- **Player-to-player**, from real padel knowledge.
- **Encouraging & inclusive** — beginners welcome, no gatekeeping.
- **Energy + rhythm** — lean into motion, the buzz of a good rally, feeling sharp.
- **Clear over clever**; helpful first.
- **Honest** — no fake scarcity, no unverifiable/medical claims. Trust is the moat.

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
- **Real over staged:** authentic on-court action, motion, sweat, glass walls, the rally. UGC > stock.
- **Energy + restraint:** navy/chalk base, electric-blue as the spark; clean, premium, modern.
- **Product:** well-lit, spec-clear shots on Chalk or Ink backgrounds; electric-blue as the accent pop.
- **Motif:** the **pulse / heartbeat line** (from the disc) is the recurring graphic device — never a ball or racket.
- **Avoid:** generic gym stock, cluttered collages, low-res supplier images, over-filtered looks, any ball/racket logo motif.

---

## 7. Brand-in-a-box (for the agents & content engine)
The single source of truth every AI agent and the content engine must follow:

```yaml
brand_name: PULSO
domain: pulso.ie            # NEVER inside the logo lockup
instagram: "@pulso.ie"
tagline_brand: "Find your pulso."
tagline_positioning: "Everything but the court."
tagline_essence: "The pulse of the game."
meaning: "pulso (ES) = pulse / heartbeat — energy, rhythm, motion, wellness + fitness"
positioning: "Improver/community padel gear — accessories, consumables & bundles, then private-label."
voice: "Knowledgeable, encouraging fellow player. Energy + rhythm. Honest. No hype. No unverifiable/medical claims."
colors:
  ink_navy:     "#0E1B2A"   # primary
  electric_blue:"#2E6BFF"   # accent (sparingly)
  chalk:        "#EDEAE2"   # light base
  slate:        "#5B6675"   # neutral / body
  deep_sky:     "#1C3A5E"   # secondary / panels
fonts:
  display: "Space Grotesk"   # 500/700
  body:    "Inter"           # 400/500/600
logo: "heavy-italic PULSO wordmark; the O is a pulse-disc (heartbeat line in a circle)"
motif: "pulse / heartbeat line (NEVER a ball or racket)"
forbidden: ["ball/racket/sports-equipment motif in logo", "medical/performance claims", "fake scarcity", "IP/trademark misuse", "hype-spam tone", "URL/.ie inside the logo"]
```

> Feed this block to every content/social/email agent so output stays on-brand automatically. See
> [`content-engine.md`](./content-engine.md) and [`agents/`](./agents/).

*Identity is **v1.0 final**. Validate trademark before scaling. Edit freely as the brand evolves.*
