# PULSO Email Setup — `hello@pulso.ie` (free forwarding + send-as)

Goal: a professional brand address **`hello@pulso.ie`** that costs ~€0, lands in a normal Gmail inbox, and lets
you **send and reply as `hello@pulso.ie`**. Used everywhere: supplier emails, Shopify sender, support, Klaviyo.

> ⚠️ I can't create accounts for you (Google needs your phone/ID). This is the do-it-yourself recipe — ~15 min.

---

## The 3 pieces
1. **A free Gmail inbox** to receive the mail (use an existing one, or create a fresh `pulso.team@gmail.com`).
2. **Email forwarding** at your domain registrar: `hello@pulso.ie` → that Gmail.
3. **"Send mail as"** in Gmail so outgoing mail shows `hello@pulso.ie`, not the gmail address.

---

## Step 1 — Receive: set up forwarding at your registrar
Where you bought **pulso.ie** (likely Blacknight, or wherever the DNS lives — Cloudflare/Namecheap/etc.):

- **Blacknight / most .ie registrars:** Control panel → **Email** → **Email Forwarding / Aliases** → add
  `hello@pulso.ie` → forward to `your-gmail@gmail.com`. Save. (Some plans include this free; if not, a basic
  mailbox is a few €/mo.)
- **Cloudflare (if DNS is on Cloudflare):** Dashboard → **Email** → **Email Routing** → enable → add a
  **custom address** `hello@pulso.ie` → **Destination** = your Gmail → verify the destination (click the email
  Cloudflare sends) → it auto-adds the required MX + TXT records. *(Cloudflare Email Routing is free.)*
- Add a catch-all too (optional): forward `*@pulso.ie` → your Gmail so you never miss `info@`, `sales@`, etc.

✅ Test: email `hello@pulso.ie` from your phone → it should arrive in the Gmail inbox.

---

## Step 2 — Send as `hello@pulso.ie` from Gmail
Forwarding only handles *incoming*. To *send/reply* as the brand:

1. Gmail → ⚙️ **See all settings** → **Accounts and Import** → **Send mail as** → **Add another email address**.
2. Name: `PULSO` · Email: `hello@pulso.ie` · (leave "Treat as alias" ticked) → **Next**.
3. Gmail asks for an SMTP server to send through. Two options:
   - **Easiest (Gmail SMTP):** SMTP `smtp.gmail.com`, port **465 (SSL)**, username = your full Gmail, password
     = a **Google App Password** (Google Account → Security → 2-Step Verification → **App passwords** → generate
     one for "Mail"). Paste it. *(Requires 2-Step Verification enabled.)*
   - Or your registrar's SMTP if your plan includes a real mailbox.
4. Gmail sends a **verification code** to `hello@pulso.ie` → it arrives via your forwarding → enter the code.
5. Settings → **Send mail as** → set `hello@pulso.ie` as **default**. Also set "Reply from the same address the
   message was sent to" so replies to brand mail go out as the brand.

✅ Test: compose a new email — the **From** should now show `hello@pulso.ie`. Send one to another inbox and
confirm it shows the brand address.

---

## Step 3 — Use it everywhere
- **Supplier outreach** (`supplier-shortlist-and-drafts.md`): send from `hello@pulso.ie`.
- **Shopify:** Settings → store details → **Sender email** = `hello@pulso.ie` (Shopify may ask you to verify it).
- **Klaviyo:** set the from-address to `hello@pulso.ie`.
- **Instagram/socials:** register under it if you like (`@pulso.ie`).

---

## ⚠️ Important: marketing deliverability needs domain auth (separate step)
Forwarding + send-as is perfect for **1:1 email** (suppliers, support). But for **bulk marketing** (your Klaviyo
flows/campaigns) to land in inboxes, you must **authenticate the pulso.ie domain** — SPF, DKIM, and DMARC DNS
records. Don't blast campaigns from a domain that isn't authenticated.

- Do this in **Klaviyo**: Settings → Domains → add `pulso.ie` and follow its DNS instructions (it gives you the
  exact CNAME/TXT records to add at your registrar). See the deliverability section in `klaviyo-retention-plan.md`.
- Likewise authenticate in Shopify/any sending tool that offers it.

---

## Quick option comparison (you chose forwarding)
| Option | Cost | Pro | Con |
|---|---|---|---|
| **Forwarding + send-as (this)** | ~€0 | Professional address, free, real Gmail inbox | Send-as setup is fiddly; no native mailbox |
| Google Workspace `hello@pulso.ie` | ~€5–6/user/mo | Cleanest, best deliverability, native mailbox + Drive | Monthly cost |
| Plain `@gmail.com` | €0 | 2-min setup | Unprofessional; weaker trust/deliverability |

> If the brand grows, **upgrading to Google Workspace later is easy** and worth it. Start free now.

*Steps are generic across registrars; the exact menu names vary. Verify each step as you go.*
