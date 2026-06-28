# PULSO Hub

The PULSO operations + marketing hub. A single dashboard to run the business: orders, inventory,
suppliers, supplier email, and brand assets in one place — with a marketing dashboard (Meta + Klaviyo)
coming in v2.

Built with **Next.js 16 (App Router) + React 19 + Tailwind v4**, themed in the PULSO brand.

> **Runs with zero credentials.** With no env vars set, the hub shows **demo (mock) data** so you can see
> it immediately. Add credentials to switch each area to **live** data.

## What's in v1 (Operations)
- **Overview** — KPIs: orders/revenue/units today, low-stock count, suppliers to chase, unread supplier mail.
- **Orders** — recent Shopify orders, payment + fulfilment status (read-only).
- **Inventory** — products, stock levels, low-stock / reorder alerts (read-only).
- **Suppliers** — your supplier shortlist with editable **status** (to-contact → approved) + notes; click an
  email to open its Gmail threads.
- **Inbox** — recent supplier/customer email (read-only; Gmail).
- **Assets** — brand assets/docs (read-only; Google Drive).
- **Marketing** — scaffolded "coming soon" (v2).

Everything across external systems is **read-only**; the only thing the hub writes is your own supplier
status/notes.

## Run locally
```bash
npm install
npm run dev          # http://localhost:3000  (demo data, no setup needed)
```

## Going live (add credentials)
Copy `.env.example` → `.env.local` and fill what you want:

| Area | Vars | How to get them |
|---|---|---|
| **Shopify** (orders, inventory) | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_TOKEN` | Shopify admin → Apps → **Develop apps** → create app → Admin API scopes `read_products, read_orders, read_inventory, read_fulfillments` → install → copy the `shpat_…` token |
| **Google** (Gmail + Drive + login) | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud Console → OAuth client (Web). Scopes: `gmail.readonly`, `drive.readonly`, `openid email profile` |
| **Meta / Klaviyo** (v2) | `META_ACCESS_TOKEN`, `KLAVIYO_API_KEY` | Wired in v2 |

Set `USE_MOCKS=false` once Shopify is configured to use live data (it auto-switches when the token is present).

> Note: v1 wires **live Shopify** (orders + inventory). Gmail/Drive live reads need the Google OAuth session
> token — the OAuth client setup is included; the live fetch is enabled in the v1.1 auth pass. Until then those
> two views show demo data.

## Deploy (Vercel + Postgres)
1. Push this folder to a Git repo and import it into **Vercel**.
2. Add the env vars above in **Vercel → Project → Settings → Environment Variables** (server-side only).
3. For persistent supplier edits in production, provision **Postgres** (Supabase/Neon) and swap the JSON store
   in `lib/suppliers.ts` for the DB (the file store is fine for local/demo; serverless filesystems are read-only).
4. Deploy. Add your domain (e.g. `hub.pulso.ie`).

## Security
- All API keys are read **server-side** from env vars and never sent to the browser.
- Use **read-only** scopes everywhere in v1. Rotate any token you paste during setup.
- Add auth before exposing publicly (Auth.js + Google sign-in, owner-email allowlist — planned in v1.1).

## Roadmap
- **v1.1** — Auth.js (Google login, owner allowlist) + live Gmail/Drive reads.
- **v2** — Marketing dashboard (Meta Ads + Klaviyo + content + financial KPIs), background sync (Vercel Cron),
  low-stock/CAC alerts, and optional write-actions (fulfil, email, pause ads) behind approval gates.
