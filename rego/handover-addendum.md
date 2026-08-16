# Rego Property — addendum to the handover

**Date:** 16 August 2026
**Supersedes:** §3 (colour), §4 (fonts), §6 (developments page), and the first two items of §9 (open decisions) of `rego-handover.md`. Everything else in that document still stands.

---

## 1. What changed and why

Two things moved since the handover.

**The palette is back open.** Ironwork was chosen, but the client is now considering a full rebrand, so the direction has been rebuilt around navy, espresso and their existing gold. The navy is not decorative: the office is on Ship Street, Kings House stands on Hove Lawns, Montpelier Place is in the middle of Brighton and Hove, and the schemes coming next are coastal. Navy carries sea, Regency ironwork and the developer register at once — and it leads naturally into the seafront work. Espresso stops it drifting corporate. **The gold is untouched**, still sampled from their own logo, so the pitch is "a new ground for the mark you already own".

**The developments layout now follows the live site, not the previous build.** The client likes the current Proworx index — four across, name in wide-tracked caps, hairline rule, location beneath — so that layout has been adopted rather than replaced. The new work sits underneath it.

---

## 2. The two directions

Same six roles in both. Only the rank of navy and espresso changes — that is the pitch: one brand, two temperaments.

### A · Harbour — navy-led (built as the default)

| Role | Name | Hex |
|---|---|---|
| Page ground | Bone | `#F3EFE5` |
| Primary | Harbour navy | `#16283C` |
| Dark sections / footer | Espresso | `#453E33` |
| Secondary text | Mist | `#5F6B78` |
| Section fills | Oyster | `#E4E0D6` |
| Accent | **Brand gold** (unchanged) | `#CAA669` |
| Secondary accent | Brass | `#A8823F` |

### B · Ship Street — espresso-led

| Role | Name | Hex |
|---|---|---|
| Page ground | Chalk | `#F4F1E9` |
| Primary | Espresso | `#453E33` |
| Dark sections / footer | Harbour navy | `#16283C` |
| Secondary text | Clay grey | `#77675A` |
| Section fills | Oat | `#E7E1D4` |
| Accent | **Brand gold** (unchanged) | `#CAA669` |
| Secondary accent | Brass | `#A8823F` |

Espresso `#453E33` is a warm dark taupe-brown rather than a coffee espresso. Worth saying out loud in the meeting: it sits close to the Ironwork `#38362D` they already approved, so Direction B reads as a warmer evolution of a palette they have already said yes to — not a second rebrand.

### Contrast — measured, not estimated

Computed against WCAG 2.1 relative luminance. AA wants 4.5:1 for body text.

| Direction | Pairing | Ratio | |
|---|---|---|---|
| A | Navy on bone | 13.04:1 | AA |
| A | Mist on bone | 4.74:1 | AA |
| A | Bone on espresso | 9.19:1 | AA |
| A | Gold on espresso | 4.61:1 | AA |
| B | Espresso on chalk | 9.35:1 | AA |
| B | Clay grey on chalk | 4.80:1 | AA |
| B | Chalk on navy | 13.26:1 | AA |
| B | Gold on navy | 6.54:1 | AA |

**One rule to enforce:** gold on the light ground is **1.99:1** and fails. It is an accent, a rule and a hover colour — never body text. On the dark sections it passes, which is where the footer call-to-action lives. The secondary greys are deliberately darker than they look like they want to be; a paler grey fails, and that only surfaces once real copy is in.

---

## 3. Type

Closes the open display-typeface decision in §9 of the handover.

| Role | Typeface | Weights | Notes |
|---|---|---|---|
| Display | **Bodoni Moda** | 800 | Replaces Spectral. A true Didone — the same species as their logo, so wordmark and headlines finally agree. Tracking relaxed from `-0.018em` to `-0.005em`; Didones need more air. |
| Labels / nav | **Jost** | 400, 500 | Uppercase, wide tracking. This is what makes the scheme cards read like the live site. |
| Body | **Archivo** | 400, 500, 600 | Unchanged. The most readable of the three at 16px. |

**Set at 800, not 600.** A Didone draws its thin strokes hair-fine by design, and at display sizes the lighter grades genuinely break up on screen — this was tested and rejected on the first build. The heaviest grades keep the Didone character while giving the thins enough body to hold. Do not drop the display weight below 800 without looking at it at 60px first.

Display sizes were also cut roughly in half from the first build (`.d1` from a 42–116px range to 32–64px, and the rest in proportion), and headings now carry a `22ch` measure with `text-wrap:balance` so they wrap on their own rather than relying on hardcoded line breaks.

All three are Google Fonts under the Open Font Licence: free, self-hostable, no licence fee in any direction.

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
| `rego-site-final.html` | The site. Four pages, Harbour palette, new type, new developments page, split blocks. |
| `rego-brand-directions-v4.html` | The pitch. Both directions live-switchable, swatches, measured contrast, type specimen, and a working developments demo to drive in the meeting. |
| `rego-handover.md` | The original handover. Still accurate apart from the sections this addendum supersedes. |

Switching the whole site to Direction B is a seven-line change to the `:root` block at the top of `rego-site-final.html` — the values are in §2 above, and every colour on both pages reads from those variables.

---

## 9. Verified

Checked in Chromium at 1440px and 390px: four-column grid and its breakpoints; list view across all seventeen rows; cursor-follow preview tracking, easing and swapping image per row; Draft rows falling back to the placeholder; keyboard focus pinning to the row within a pixel; touch showing thumbnails with the preview disabled; reduced-motion snapping exactly rather than trailing; the animation loop stopping after navigation (three round trips, no leak, no console errors); and the pitch page switching A ↔ B with every colour, swatch, hex and ratio updating and the gold staying identical.

Also checked across every page: split-block alternation holds (`LRL` on home and on both fully-populated scheme pages, `LR` on About); no split block ever renders an empty image half; the gallery lightbox still opens, counts 1/25, takes arrow keys and closes on Escape; form validation moves focus to the first invalid field; Draft and 404 pages render their fallbacks; and mobile stacks image-above-text with no horizontal overflow.

Not verifiable here: the hot-linked client imagery, which the sandbox blocks. Check the pages once on a normal connection before the meeting.
