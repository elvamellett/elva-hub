# Log entry format

The master log lives in `../logs/applications.md` as a single markdown table.
**One row per role**, updated in place as status changes (never add a second row for the
same role).

## Columns

| Field | Notes |
|---|---|
| Date Found | `YYYY-MM-DD` the role first appeared in a roundup. |
| Company | Brand / employer. |
| Role | Job title. |
| Location | City + tier (e.g. `Dublin (1)`). |
| Source/Link | URL to the listing. |
| Status | `found` → `applied` → `interview` → `rejected` / `offer`. |
| Cover Letter | Path to the letter file, e.g. `cover-letters/2026-06-23-sephora-crm-intern.md`. |
| Notes | Deadlines, contacts, follow-up dates, anything useful. |

## Row template (copy into the table)

```
| 2026-06-23 | Company | Role | Dublin (1) | https://... | found | cover-letters/2026-06-23-company-role.md | |
```

## Status meanings

- **found** — surfaced by a weekly search, not yet applied.
- **applied** — application submitted.
- **interview** — interview scheduled or in progress.
- **rejected** — closed, unsuccessful.
- **offer** — offer received.
- **watchlist** — strong-fit role that failed a hard filter (usually timing/start date);
  not actionable now, but a target to re-apply for in the next cycle.
