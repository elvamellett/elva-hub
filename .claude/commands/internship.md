---
description: Run the weekly internship search (search → filter → roundup → cover letters → log)
---

Run the internship-search workflow defined in `internship-search/CLAUDE.md`.

1. Read `internship-search/profile/profile.md` and `internship-search/profile/filters.md`
   first — they are the source of truth for matching and cover letters.
2. Follow the weekly workflow in `internship-search/CLAUDE.md` end to end: search live
   listings, apply the HARD FILTERS (drop fails), rank survivors by location then sector,
   write a dated roundup in `internship-search/roles/`, write a tailored cover letter in
   `internship-search/cover-letters/` for every passing role, and update
   `internship-search/logs/applications.md`.
3. Commit and push the new files to the current branch.
4. Report back a short summary: how many found, how many passed, the standout roles, and
   the file paths.
5. Send a phone notification (PushNotification) with a one-line summary, e.g.
   "Internship run: 2 passed, 1 watchlist. Top: Komodo (Sept 2026)." This is the delivery
   step for scheduled/unattended runs, so it reaches you even when you're not watching.

Optional focus for this run (e.g. specific start months or locations): $ARGUMENTS
If no focus is given, run the standard full weekly search.
