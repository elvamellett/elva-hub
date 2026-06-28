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
| **Owner login + Google** (Gmail + Drive) | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, `OWNER_EMAIL` | See **Authentication** below |
| **Meta / Klaviyo** (v2) | `META_ACCESS_TOKEN`, `KLAVIYO_API_KEY` | Wired in v2 |

Set `USE_MOCKS=false` once Shopify is configured to use live data (it auto-switches when the token is present).

## Authentication (v1.1) — owner-only login + live Gmail/Drive
The hub uses **Auth.js (NextAuth v5) with Google**. One sign-in does two jobs: it logs you in **and** grants the
`gmail.readonly` + `drive.readonly` scopes that power the Inbox and Assets views.

- **With these env vars set**, the hub **requires login** (only `OWNER_EMAIL` may sign in) and Inbox/Assets show **live** Gmail/Drive.
- **Without them**, the hub stays **open in demo mode** with mock data (great for previewing).

Setup:
1. **Google Cloud Console** → create a project → enable the **Gmail API** and **Drive API**.
2. **OAuth consent screen** → External → add your email as a test user (or publish). Add scopes `gmail.readonly`, `drive.readonly`.
3. **Credentials → Create OAuth client → Web application.** Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://<your-host>/api/auth/callback/google` (prod)
4. Put the client id/secret in `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.
5. `AUTH_SECRET` — generate with `npx auth secret` (or `openssl rand -base64 33`).
6. `OWNER_EMAIL` — the only Google account allowed to sign in.
7. (Optional) `DRIVE_FOLDER_ID` — restrict Assets to one Drive folder.

> First real sign-in shows Google's consent screen; approve the read-only scopes. Tokens are stored in an
> encrypted JWT session (no database needed) and auto-refresh.

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
- **v1.1 ✓ (done)** — Auth.js (Google login, owner allowlist) + live Gmail/Drive reads.
- **v2** — Marketing dashboard (Meta Ads + Klaviyo + content + financial KPIs), background sync (Vercel Cron),
  low-stock/CAC alerts, and optional write-actions (fulfil, email, pause ads) behind approval gates.
