# The Suede Studio — Launch Pack

The complete starter kit for **The Suede Studio** — the AI-powered ecommerce studio Elva & Laura are launching for small businesses on Shopify (Dublin, Ireland).

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | **The website homepage** — hero, services, AI section, packages teaser, founders, process, FAQ, contact |
| `packages.html` | **The packages page** — Silver, Gold and Platinum as scroll-through stacking cards |
| `assets/` | **Brand assets** — the S-squiggle logo in five colourways + founder/team photography extracted from the brand deck |
| `brand.html` | **The brand pack** — wordmark, colours (Pantone 732 C + Ice Water 13-4202 TCX), typography, tone of voice, do/don'ts, Instagram grid system. Print it to PDF for sharing |
| `client-questionnaire.md` | **The client intake questionnaire** — all 45 questions, ready to paste into a free Google Form, with setup instructions at the bottom |
| `client-strategy-blueprint.md` | **The per-client strategy blueprint** — master template covering all nine pillars of a client's business; copy per client, fill from their questionnaire, delete the 🔒 internal boxes, send. The questionnaire→blueprint map, scoping worksheet and package tailoring guide are in its appendix |
| `content-plan.md` | **Our own marketing plan** — 5 content pillars, realistic weekly cadence, a 4-week launch calendar, hashtags and metrics |
| `business-plan.md` | **The internal business plan** — positioning, personas, packages with internal pricing, the equal-time partnership model, ops pipeline, 90-day roadmap, Ireland legal/money checklist. *Internal only — never send to clients* |
| `proposal-template.md` | **The one-page proposal** — copy per client, price from the blueprint's scoping worksheet, send within 3 days of the discovery call |
| `partnership-agreement.md` | **The founders' one-pager** — the 50/50 split, the 6-hour rule, roles, exit terms. Fill in, sign two copies. *Not legal advice* |

## How to view the website

No build step, no installs — open `index.html` in any browser. Everything (styles, scripts, favicon) is inside each file; the only external request is the Google Fonts stylesheet.

## How to deploy it free

- **Netlify (easiest):** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this folder in. Done — you get a live URL, and you can connect a custom domain later.
- **GitHub Pages:** enable Pages on this repo and the site is served at `/<repo>/suede-studio/`.

## Two things to do before launch

1. **Create the Google Form** from `client-questionnaire.md`, then find-and-replace `YOUR-GOOGLE-FORM-LINK` in `index.html` and `packages.html` with the real form URL (it appears in several buttons on each page).
2. **Fonts:** the site renders in **Poppins** (free, Google Fonts) — the closest open match to the brand deck's chunky display face. If you later license the exact deck typeface, add it first in the `--font` stack in each HTML file's `:root` block.

## Editing the brand later

Every colour and font lives in one `:root` block at the top of each HTML file (canonical version in `brand.html`). Change a value there and the whole page follows.

> Note: this folder is completely separate from the personal planner files at the repo root — nothing here touches them.
