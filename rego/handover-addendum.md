# Rego Property — addendum to the handover

**Date:** 16 August 2026
**Supersedes:** §3 (colour), §4 (fonts), §6 (developments page), and the first two items of §9 (open decisions) of `rego-handover.md`. Everything else in that document still stands.

> ## ⚠️ Route changed: Olive, not Harbour
>
> **`brand-pack-olive.html` is the single source of truth for colour and type.** The client chose **Olive (Route B)**, which supersedes the Harbour / navy route this addendum originally described. The site has been migrated; §2 and §3 below have been rewritten to match.
>
> Harbour is gone — navy `#16283C` is no longer in the build, and `rego-brand-directions-v4.html` (the Harbour-vs-Ship-Street pitch) has been retired. The one thing that carried across is the espresso `#453E33`, which is now **Bark**, the warm dark used for the footer.
>
> **One defect found in the pack, not fixed:** it records Lichen `#6B7261` on Chalk as **4.6:1** and marks it a pass for body text. Measured, it is **4.45:1** — a hair under the AA threshold of 4.5:1, and it is used for locations, captions and form hints. Darkening lichen three points to `#686F5E` measures 4.65:1 and makes the pack's own claim true. That is a change to a brand hex, so it is flagged for sign-off rather than taken unilaterally.

---

## 1. What changed and why

Two things moved since the handover.

**The palette changed twice.** Ironwork was the original choice; a navy route (Harbour) was pitched against an espresso one; the client then settled on **Olive**, and `brand-pack-olive.html` was issued as the governing document. Olive is near-black and warm, set against chalk rather than white, so the pages stay quiet enough that the buildings carry them. **The gold is untouched** through all of it — still sampled from their own logo, which makes every one of these routes a new ground under a mark they already own rather than a rebrand.

**The developments layout now follows the live site, not the previous build.** The client likes the current Proworx index — four across, name in wide-tracked caps, hairline rule, location beneath — so that layout has been adopted rather than replaced. The new work sits underneath it.

---

## 2. Colour — Olive

Ten colours, and nothing outside them. Role names are stable; the hexes belong to this route.

| Role | Name | Hex | Where it goes |
|---|---|---|---|
| Page ground | Chalk | `#F4F2E9` | Every page background |
| Cards | Paper | `#FBF9F2` | Cards, solid nav bar, form fields |
| Fills | Linen | `#E5E1D2` | Alternating sections, image placeholders |
| Hairlines | Rule | `#D5D0BE` | All 1px borders and dividers — the only border colour |
| Secondary text | Lichen | `#6B7261` | Locations, dates, captions, form hints |
| Primary | Olive | `#3F4733` | Body copy, headings, buttons, chips |
| Dark | Bay | `#2A3123` | Cover scrim, lightbox |
| Warm dark | Bark | `#453E33` | Footer, image overlays |
| Accent | **Brand gold** | `#CAA669` | Underlines, hover rules, focus ring, the mark |
| Accent 2 | Champagne | `#DCC9A0` | Small caps and rules on the darks only |

**Ten colours, and nothing outside them.** A Sage `#B9C4A8` was briefly added as an eleventh, for a green accent on the Bark typographic hero — the pack's own greens cannot do that job, measuring 1.09:1 and 1.27:1 on Bark. That hero has since been replaced by the photographic one, so Sage has been removed and the palette is back to the pack's ten exactly. No sign-off is needed.

Hold roughly **70% chalk · 18% olive · 8% linen · 4% gold**. If a page feels unfinished it needs a photograph, not more gold.

**Bay and Bark are both darks — one per page, never adjacent.** Bay takes the detail-page scrim and the lightbox; Bark takes the footer and the homepage hero's ombre. They never meet.

### Contrast — measured against the built pages

Computed from WCAG relative luminance, not taken from the pack on trust.

| Pairing | Measured | Pack claims | Verdict |
|---|---|---|---|
| Olive on chalk | 8.67:1 | 9.6 | Pass |
| Lichen on chalk | **4.45:1** | 4.6 | **Misses AA — see the note at the top** |
| Chalk on bay | 11.99:1 | 12.9 | Pass |
| Champagne on bay | 8.26:1 | 7.9 | Pass |
| Chalk on bark | 9.41:1 | 9.6 | Pass |
| Champagne on bark | 6.49:1 | 6.7 | Pass |
| Gold on bark | 4.61:1 | 4.6 | Pass |
| Gold on bay | 5.87:1 | 7.9 | Pass |
| Gold on chalk | 2.04:1 | 2.0 | Fails — decorative only |

**Gold is never a fill.** Not a button, not a background behind text. It is a 1px underline, a hover rule, the focus ring and the mark. On the darks, small text goes to champagne instead — it clears 4.5:1 where the gold is marginal.

---

## 3. Type

| Role | Typeface | Weight | Notes |
|---|---|---|---|
| Display | **Instrument Serif** | 400 — the only one | Headings, scheme names, pull quotes. Tracking −0.005em |
| Body / labels | **Jost** | 300, 400, 500 | Body copy, navigation, buttons, captions |
| Long-form / tables | **Archivo** | 400, 500, 600 | Accommodation schedules and anything dense |

Three hard rules, all enforced and verified in the browser:

- **Never above weight 400 on display type.** Instrument Serif has one weight; faking bold is forbidden.
- **Never below 21px on display type** — it thins out. Both `.d4` and the list-view scheme names had 19px floors and were raised. Anything smaller that needs emphasis goes to Jost 500 caps.
- **Archivo, not Jost, for tables.** Jost's round forms tire at length, so the accommodation schedules use `--long`.

**Scale** keeps the halved sizes from the previous round rather than the pack's table. The pack lists `.d1` at `clamp(42px, 8vw, 116px)` and describes it as "unchanged from the current build" — but that describes the build *before* the halving instruction, so it is a stale reading rather than a decision to go back up. Line heights are the pack's.

| Class | Size | Line height |
|---|---|---|
| `.d1` | `clamp(32px, 4.4vw, 64px)` | 1.02 |
| `.d2` | `clamp(28px, 3.8vw, 54px)` | 1.06 |
| `.d3` | `clamp(23px, 2.9vw, 38px)` | 1.14 |
| `.d4` | `clamp(21px, 2.1vw, 26px)` | 1.20 |

**On nav and buttons:** the pack says "Jost 500 caps" in §03 and "sentence case for buttons and menus" in §05. Read §05 as a copywriting rule — write "Send enquiry", not "Send Enquiry" — so §03 governs the visual treatment. Nav and buttons stay uppercase; the source text is sentence case.

---

## 3b. Surfaces

- **Square corners everywhere.** No border-radius on anything.
- **No shadows.** Both were removed — the nav bar's became a 1px rule border, the cursor preview's a 1px border. Depth comes only from ground shifts and hairlines. **One border weight: 1px Rule.**
- **Cards** sit on Paper with a hairline border, image 4:3, name in Jost caps under a rule, location in Lichen. The border goes gold on hover.
- **Status tags invert:** chalk-on-olive when passive ("Completed"), olive-on-chalk when active ("In construction").
- **Two button styles, no third.** Primary is an olive fill with chalk text, hovering to Bay; `.btn--out` is the olive outline, hovering to a fill.
- **Text links** are olive with a 1px gold underline 4px below the baseline; hover moves the underline to olive.
- **Form fields** are Paper with a 1px Rule border and a caps label above — they were bottom-border-only before.

**Motion** is 280–450ms on `cubic-bezier(.16,.84,.32,1)` for every state change. The only scroll-linked motion left is the hero's parallax, which is ambient rather than a state change and is capped at 6% of block height; `prefers-reduced-motion` disables it.

**Voice:** locations are now bare — `Hove Sussex` became `Hove` on Kings House and Grand Avenue.

---

## 3c. The homepage hero — block 1

Built to `hero-handover.html`, **approved option 3a**. The photographic hero replaces the Bark typographic block that briefly stood here.

```
[ Kings House photograph, uncropped at 3:2 ]

  REGO PROPERTY                Home  Developments  About  Contact
                                     ▔▔▔▔ gold underline on the active route

  PROPERTY DEVELOPMENT · BRIGHTON        Kings House, Hove seafront. A 1930s
  Listed buildings,                      office block restored and returned
  returned to use.                       to residential use.
                                         SEE THE DEVELOPMENT
```

**Height is the load-bearing decision.** `min(calc(100vw / 1.5), 960px)`, floor 600px — derived from the image's 3:2 ratio, never from `vh`. That is what keeps the whole building and the tops of the beach huts in frame. It is taller than the cover that was cut back earlier in the project; that was accepted deliberately, because height and the no-crop guarantee are the same decision. Changing one changes the other.

A single ombre rises from the bottom edge and dies out at 34%. No buttons, no fact strip, no scroll cue.

**A second, smaller ombre was added at the top**, against the handover's "one ombre" instruction. The header sits directly on the photograph, and chalk on that bright sky measured **1.6:1** — effectively invisible. The top gradient is 20% tall and fades to nothing well before the building, and it lifts the header band to **4.55:1 at the worst pixel and 7.5:1 on average**, measured by sampling the composited image behind it rather than by eye.

### Two tensions in the handover, resolved

1. **Parallax versus "no vertical crop."** §05 asks for parallax; §01 and §08 forbid cropping. Any overscan crops. The image therefore translates **downward only, starting from zero**: at rest it sits at `inset:0` so nothing is cropped, and as the page scrolls by `S` it moves down `0.06 × S`, putting the gap it opens at the image's top edge permanently above the fold. Both hold, with no compromise. This does **not** use the generic `[data-par]` path, which is centred and bidirectional and would crop.
2. **Two headers.** The handover gave the hero its own transparent header and suppressed the site's fixed bar until scroll. **That has since been superseded by a client instruction to make the navigation follow all the way down.** The hero's own header was therefore removed and the site's single fixed bar now serves every route: transparent over the photograph at rest, solid past 80px of scroll. One nav, always present. The active route is marked with a gold underline driven by `aria-current`, matching the treatment the handover specified. This also cleared a live defect where the previous hero's link row collided with the fixed bar's logo between scrollY 480 and 584.

### Deviations from the brand pack, both required by the handover

- **The eyebrow is chalk, not champagne.** Acceptance 4 states it explicitly, overriding the pack's "small caps on dark go to champagne". Chalk on the ombre measures 9.41:1.
- **`--sage` has been removed.** The eleventh colour existed only for the Bark typographic hero. Nothing consumes it now, so it is gone rather than left as an orphan token. The sign-off question it raised is moot.

### The image

The approved photograph is inlined as a **JPEG q78 data URI** — 1024×681, a true 3:2, re-encoded from the handover bundle. Inlining keeps this file self-contained, which matters because it gets opened and forwarded directly, guarantees the ratio the layout depends on, and means the homepage renders with no network at all. It takes the file from ~90KB to ~261KB.

**Still outstanding:** the real **2880×1920** original from the client's library (this is the prototype-resolution file), plus `rego-logo-white.svg` — the logo is still the 319×158 PNG.

### Below 700px

Body padding 20px, ombre 46%, headline floor 34px, and the deliberate line break is suppressed. The burger menu is the site's existing one — no second mobile menu was built.

---

## 3d. The pinned scroll scene — removed

The homepage's scroll-jacked scene, which pinned a Kings House image and advanced through three captions as you scrolled roughly three screens, has been **deleted entirely** at the client's request: they did not want an interactive block that has to be scrolled through to reach the next picture, and did not want the chalk caption panels sitting over the photographs.

Its CSS, markup and the scroll-position JS that drove it are all gone. The homepage now reads: hero → what we do → recent projects → three scheme blocks → quote → footer.

## 3e. "What we do" — now a split block

Converted from a narrow label-plus-column layout into the alternating split block used everywhere else, with **text on the left and image on the right**. This puts it into the chequerboard rhythm the client likes: the page now alternates image-right, image-left, image-right, image-left down its length.

**One placeholder to swap.** The interior photograph intended for this block was pasted into the conversation rather than supplied as a file, so it could not be saved. A Kings House interior from the client's own gallery is standing in — see `ABOUT_IMG` near the top of the script block. Replace that one URL when the intended image arrives.

---

## 4. Developments page

**Grid view** now matches the live site: four across (3 at ≤1200px, 2 at ≤860px, 1 at ≤560px), scheme name in Jost caps with a hairline rule, location beneath.

**List view** is new, toggled from the toolbar beside the filter chips. All seventeen schemes fit in roughly one screen as typographic rows — index, name, location, status. Hovering a row floats a preview image that follows the cursor with easing.

This is the thing that replaces the statistics block cut on privacy grounds: it shows the scale of the portfolio without publishing a single figure.

Details worth knowing before editing it:

- **Draft schemes** have no hero image, so their preview falls back to the same lettered panel the grid uses.
- **Touch devices** get an inline thumbnail per row instead — there is no cursor to follow. The CSS and the JS are gated off the *same* media query via a `nopeek` class on `<body>`, so the two cannot disagree.
- **Keyboard** focus pins the preview to the row's right edge rather than to a cursor that is not there. The loop re-reads the row's position every frame, because `focus()` can trigger a smooth scroll and a one-off measurement lands where the row *used to be*.
- **Reduced motion** drops the easing and snaps the preview into place.
- **The lifecycle trap:** `route()` replaces `main.innerHTML` on every navigation. All handlers are therefore bound as properties (`list.onpointermove = …`), never `addEventListener`, so they die with the node — and the animation loop checks `document.body.contains(list)` before scheduling another frame. If you add interactions here, follow that pattern or you will leak a loop per navigation.

---

## 5. The split block, and where it now runs

The **alternating full-height 50/50 split block** is the site's core rhythm — image bleeding to one edge, copy panel opposite, sides flipping down the page, with an eyebrow, a Bodoni heading, prose and a gold-underlined link.

It is a single `duo()` function, so every page shares one implementation:

| Page | Where it runs |
|---|---|
| Home | One block per populated scheme, replacing the three-card "Recent projects" grid |
| Developments | The featured scheme leads the page, above the filters and the index |
| Scheme detail | Intro, the accommodation schedule (when it has an image), location, brochures |
| About | One block per director — portrait one side, bio and email the other |
| Contact | Address and both directors against the Ship Street signage photograph |

Blocks alternate off **one running counter per page**, so whatever mix of blocks a scheme has, the left/right rhythm never breaks. On the detail pages, non-split sections (video, gallery) do not consume a side.

A table block with no image stays a conventional section rather than becoming a half-empty split. On the home page the supporting thumbnails are pulled automatically from each scheme's gallery, then its section and intro images, skipping the hero; a scheme with fewer than two spare images renders fewer rather than padding with placeholders.

### Other page changes

- **Scheme detail** now ends on a four-up "Other projects" grid rather than a lone button, so the portfolio stays one click away. Draft pages do the same.
- **Gallery images** now carry real alt text (`"Kings House, image 3"`) and the lightbox buttons announce "Open image 3 of 25". This was empty on the live site and flagged in §10 of the handover — it is no longer blank, though per-image descriptive alt still needs writing once the real photography is in.
- **The 404 page** was a bare "Not found" heading; it now explains itself and routes to the portfolio.
- **The enquiry form** is a real `<form>` with submit handling, required fields, focus moved to the first invalid field, an email sanity check, and a `role="status"` message so screen readers hear the result. It still hands off to `mailto:` — wiring a real handler and adding the privacy notice remains outstanding.
- **About** dropped the two-up grid that showed the same placeholder portrait twice; alternating blocks make the missing headshots obvious instead of disguising them.

---

## 6. Robustness fix

Every image on the site is still hot-linked off the live site. A failed load now degrades to the same lettered placeholder panel rather than a broken-image icon — relevant in a client meeting on poor wifi, and if Proworx ever moves a file. It does not remove the need for item 2 below.

---

## 7. Still outstanding from the original handover

Unchanged and still needed from Ronan:

1. **Logo as vector** (SVG, EPS or AI). What is embedded is a 319×158 PNG that softens on retina and cannot be recoloured. Proworx hold it.
2. **Original image files** at full resolution, to replace the hot-linked ones.
3. **Brochure PDFs** for every scheme that has one.
4. **Copy and images for the remaining 14 schemes**, or confirmation to lift them from the live site as they stand.
5. **Where enquiry form submissions should go**, plus a privacy notice — the form collects an email address, so one is required.
6. **Hosting and domain access** for the switchover.

Also still open: whether GDV and unit counts should stay stripped. They are currently published openly on every scheme page of the live site, so tell them what is already public before assuming it should come down.

---

## 8. Files

| File | What |
|---|---|
| `brand-pack-olive.html` | **The source of truth.** The client's brand pack as supplied — self-contained, fonts embedded, renders offline. Anything that contradicts it is out of date. |
| `rego-site-final.html` | The site. Four pages, Olive throughout, split blocks, developments grid/list. |
| `rego-brand-olive.html` | Olive applied — palette, contrast measured live in the page, type specimen and a working developments demo to drive in a meeting. |
| `rego-handover.md` | The original handover. Still accurate apart from the sections this addendum supersedes. |

`rego-brand-directions-v4.html` (the Harbour-vs-Ship-Street pitch) was retired when Olive was chosen; it is in the git history if the reasoning is ever needed.

Every colour and face on both pages reads from the `:root` block at the top of each file, so a future route change is a token swap, not a rewrite.

---

## 9. Verified

Checked in Chromium at 1440px and 390px: four-column grid and its breakpoints; list view across all seventeen rows; cursor-follow preview tracking, easing and swapping image per row; Draft rows falling back to the placeholder; keyboard focus pinning to the row within a pixel; touch showing thumbnails with the preview disabled; reduced-motion snapping exactly rather than trailing; the animation loop stopping after navigation (three round trips, no leak, no console errors); and the pitch page switching A ↔ B with every colour, swatch, hex and ratio updating and the gold staying identical.

Also checked across every page: split-block alternation holds (`LRL` on home and on both fully-populated scheme pages, `LR` on About); no split block ever renders an empty image half; the gallery lightbox still opens, counts 1/25, takes arrow keys and closes on Escape; form validation moves focus to the first invalid field; Draft and 404 pages render their fallbacks; and mobile stacks image-above-text with no horizontal overflow.

Not verifiable here: the hot-linked client imagery, which the sandbox blocks. Check the pages once on a normal connection before the meeting.
