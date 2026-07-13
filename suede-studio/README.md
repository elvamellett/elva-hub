# The Suede Studio — Launch Pack

The complete starter kit for **The Suede Studio** — the AI-powered ecommerce studio Elva & Laura are launching for small businesses on Shopify (Dublin, Ireland).

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | **The website homepage** — hero, services, AI section, packages teaser, founders, process, FAQ, contact |
| `packages.html` | **The packages page** — The Swatch, The Capsule, and The Atelier in full detail |
| `brand.html` | **The brand pack** — wordmark, colours (Pantone 732 C + Ice Water 13-4202 TCX), typography, tone of voice, do/don'ts, Instagram grid system. Print it to PDF for sharing |
| `client-questionnaire.md` | **The client intake questionnaire** — all 45 questions, ready to paste into a free Google Form, with setup instructions at the bottom |
| `content-plan.md` | **Our own marketing plan** — 5 content pillars, realistic weekly cadence, a 4-week launch calendar, hashtags and metrics |
| `business-plan.md` | **The internal business plan** — positioning, personas, packages with internal pricing, the equal-time partnership model, ops pipeline, 90-day roadmap, Ireland legal/money checklist. *Internal only — never send to clients* |

## How to view the website

No build step, no installs — open `index.html` in any browser. Everything (styles, scripts, favicon) is inside each file; the only external request is the Google Fonts stylesheet.

## How to deploy it free

- **Netlify (easiest):** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this folder in. Done — you get a live URL, and you can connect a custom domain later.
- **GitHub Pages:** enable Pages on this repo and the site is served at `/<repo>/suede-studio/`.

## Two things to do before launch

1. **Create the Google Form** from `client-questionnaire.md`, then find-and-replace `YOUR-GOOGLE-FORM-LINK` in `index.html` and `packages.html` with the real form URL (it appears in several buttons on each page).
2. **Fonts:** the site currently renders in Archivo (free). When you license **Pragmatica**, drop the `.woff2` files into this folder and uncomment the `@font-face` block at the top of each HTML file — instructions are in the comment itself, and in `brand.html` §03.

## Editing the brand later

Every colour and font lives in one `:root` block at the top of each HTML file (canonical version in `brand.html`). Change a value there and the whole page follows.

> Note: this folder is completely separate from the personal planner files at the repo root — nothing here touches them.
