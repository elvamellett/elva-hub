# CLAUDE.md — Internship Search Automation

This folder is a **personal internship-search engine** for Elva Mellett. There is no
application code — **the automation is this file plus the rules in `profile/`**. Each
week a Claude session reads this file, runs the search, applies the filters, and writes
the output files. Treat this document as the operating manual.

---

## How to run the weekly search (the workflow)

When Elva says something like *"run this week's search"*, do the following, in order:

1. **Load context.** Read `profile/profile.md` and `profile/filters.md`. These are the
   single source of truth for matching and cover letters. If they conflict with anything
   below, the files in `profile/` win.
2. **Search.** Use web search to find live internship/placement listings matching the
   sectors, industries, and locations in the profile. Search broadly across job boards,
   company career pages, and LinkedIn/Indeed results. Prioritise the location order below.
3. **Filter.** Run every result through the **hard filters** in `profile/filters.md`.
   Drop anything that fails *any* hard filter — no exceptions, no "close enough".
4. **Rank.** Order survivors by location priority, then sector fit. Do **not** drop on
   rank — surface **every role that clears the hard filters** (Elva chose full coverage).
5. **Write the roundup.** Create `roles/YYYY-MM-DD-roundup.md` from
   `templates/roundup-template.md`, dated to the day you run it.
6. **Write cover letters.** For **every** passing role, generate a fully tailored cover
   letter (write it fresh — don't just fill blanks) using
   `templates/cover-letter-template.md` as the skeleton. Save as
   `cover-letters/YYYY-MM-DD-company-role.md` (kebab-case, e.g.
   `cover-letters/2026-06-23-sephora-crm-intern.md`).
7. **Update the log.** Add one row per new role to `logs/applications.md` with status
   `found`. Never duplicate a role already in the log — if it reappears, leave the
   existing row.
8. **Report back.** Give Elva a short summary: how many found, how many passed, the
   standout roles, and where the files are.

---

## Profile (summary — full version in `profile/profile.md`)

- UCD Business student, **placement year**, graduating **2027/2028**.
- Current role: **Area Supervisor at One Dame Lane** (premium Irish retailer).
- Core skills: **Shopify** ecommerce, **Klaviyo** CRM & email marketing, stock management,
  multi-location retail ops, supplier relations, managing a team of ~15.
- Specialism being built: **Klaviyo / retention marketing**.
- Languages: **English (fluent), Irish (fluent). No other languages.**

## Hard filters (drop anything that fails — see `profile/filters.md`)

- **Start date:** Sept / Oct / Nov / Dec **2026**, OR Jan / Feb **2027**. Nothing else.
- **Duration:** **6 months minimum.**
- **Type:** internship or placement only — **no graduate jobs, no permanent roles.**
- **Language:** English only — drop anything requiring French, Dutch, or any other language.
- **No summer internships.**

## Location priority (rank, don't drop)

1. **Dublin / DART-commutable** (Elva lives in Greystones).
2. **Manchester** (family there, no rent).
3. **Brighton** (family there, no rent).
4. **London** — only if exceptional (luxury brand or big tech).

## Sectors wanted

eCommerce ops, CRM / email marketing, retail ops, digital / eRetail.

**Target industries:** luxury retail (LVMH houses, Chanel, Dior, Tiffany, Longchamp),
cosmetics / beauty (Sephora, Estée Lauder, L'Oréal, Sculpted by Aimee, The Smooth
Company), jewellery, premium retail, big tech with Dublin offices (Google, Meta, TikTok,
Amazon, ServiceNow, Colgate-Palmolive), FMCG (Diageo, PepsiCo, Kraft Heinz).

**Not interested in:** finance, engineering, hospitality.

## Cover letter rules

- **Short and punchy. No waffle.**
- Tailored per company with a genuine **"why this company"** hook.
- Always state: **placement runs Sept–Dec 2026 and Jan–May 2027, happy to do a full year,
  flexible on start date.**
- Offer to **hop on a call**.
- Sign off as **Elva Mellett, elvamellett05@gmail.com**.

---

## Folder map

```
internship-search/
├── CLAUDE.md                 # This file — the engine
├── profile/
│   ├── profile.md            # Full profile (source of truth for matching + letters)
│   └── filters.md            # Hard filters + location/sector priorities
├── roles/                    # Weekly roundups, one per run (YYYY-MM-DD-roundup.md)
├── cover-letters/            # One tailored letter per role
├── logs/
│   └── applications.md       # Master log — every role, status updated in place
└── templates/
    ├── roundup-template.md
    ├── cover-letter-template.md
    └── log-entry-template.md
```

## Conventions

- **Dates:** filenames use `YYYY-MM-DD`. Use the actual run date.
- **File slugs:** kebab-case `company-role`, e.g. `longchamp-ecommerce-intern`.
- **Status values:** `found` → `applied` → `interview` → `rejected` / `offer`.
  Plus `watchlist` — a strong-fit role that failed a hard filter (usually timing); track
  it as a next-cycle target rather than dropping it entirely.
- **Single source of truth:** if profile facts change, edit `profile/profile.md` (and
  `filters.md`), then this file's summary — never let them drift apart.
