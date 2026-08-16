# Rego Property — project handover

**Client:** Rego Property, 8-9 Ship Street, Brighton BN1 1AD
**Contacts:** Ronan Mellett (ronan@regoproperty.com, 07500 964177) · Alan Coleman (alan@regoproperty.com, 07500 060904)
**Current site:** regoproperty.com, built by Proworx (proworx.co.uk), footer reads "Copyright 2025"
**Status:** design direction chosen, four-page site built, 3 of 17 schemes populated
**Date:** 16 August 2026

---

## 1. Where this stands

A full four-page site is built and working. The brand direction is chosen. The logo is in. What's outstanding is content for 14 schemes and a handful of asset and hosting items that have to come from the client.

The site is a single self-contained HTML file. All content sits in one editable data block at the top, so adding a scheme means adding a record, not building a page.

---

## 2. Files

| File | What it is | Use it? |
|---|---|---|
| `rego-site-final.html` | **The site.** Four pages, Ironwork palette locked, real logo embedded. | **Yes — this is current** |
| `rego-property-scope.md` | Original scope: analysis of the existing site, phases, what's needed from the client | Yes, still accurate |
| `rego-site-ironwork.html` | Same site, placeholder wordmark instead of the real logo | Superseded |
| `rego-site.html` | Four-page site with the four-direction switcher still in it | Keep — useful if they want to see the alternatives |
| `rego-brand-directions-v3.html` | Pitch piece: scroll-driven homepage, four directions switchable | Keep for the meeting |
| `rego-brand-directions-v2.html` | Same, three directions, before Ironwork was added | Superseded |
| `rego-brand-directions.html` | First pitch version — stats block, near-black palettes | Superseded, rejected |
| `index.html` | First prototype, before the luxury/scroll direction | Superseded |
| `orthoscope-brand-directions.html` | Built off a typo, not Rego | Ignore |

---

## 3. The four colour directions

All four are fully specified. **Ironwork is chosen and built.** The other three are kept because they're pitch material and because a client can change their mind.

### 01 · Ironwork — CHOSEN

Built on `#38362D`, the dark olive-black that Regency balcony railings and seafront ironwork are painted along Brighton and Hove. Warm rather than cold, dark without being black.

| Role | Name | Hex |
|---|---|---|
| Page ground | Bone | `#F3EFE5` |
| Primary | Ironwork | `#38362D` |
| Dark sections | Bronze | `#2B2A23` |
| Secondary text | Stone grey | `#7E7A6B` |
| Section fills | Oat | `#E3DDCD` |
| Accent | **Brand gold** | `#CAA669` |
| Secondary accent | Sage | `#7C8A76` |

The gold is **sampled directly from their existing logo** — it is their colour, not a new one. Worth saying in the meeting: this direction keeps their brand gold and pairs it with a new ground. That's a smaller ask than a full rebrand.

### 02 · Seafront

Warm chalk, slate, brass and sea blue — the palette of the buildings themselves.

| Role | Name | Hex |
|---|---|---|
| Page ground | Chalk | `#F5F3ED` |
| Primary | Slate | `#24333C` |
| Dark sections | Deep sea | `#2E4A52` |
| Secondary text | Steel | `#7A8A92` |
| Section fills | Portland stone | `#E3DFD2` |
| Accent | Brass | `#C08A3E` |
| Secondary accent | Sea | `#4A7C82` |

### 03 · Prospectus

Ivory and navy with soft gold — the prime-residential register. The safest of the four.

| Role | Name | Hex |
|---|---|---|
| Page ground | Ivory | `#F7F4EC` |
| Primary | Navy | `#16324F` |
| Dark sections | Deep navy | `#1E4066` |
| Secondary text | Oyster | `#7C8CA0` |
| Section fills | Pearl | `#E0E3DE` |
| Accent | Gold | `#C0A05E` |
| Secondary accent | Harbour | `#4E7FA8` |

### 04 · Lawns

Cream, deep green and clay. Named for Hove Lawns. The most colourful and the least like a developer.

| Role | Name | Hex |
|---|---|---|
| Page ground | Cream | `#F6F2E7` |
| Primary | Deep green | `#2B4437` |
| Dark sections | Forest | `#35513F` |
| Secondary text | Sage grey | `#7E8A78` |
| Section fills | Oat | `#E4DECD` |
| Accent | Clay | `#B0603E` |
| Secondary accent | Sage | `#8C9A6A` |

---

## 4. Fonts

Every font used is on Google Fonts under the Open Font Licence. Free, self-hostable, no licence cost in any direction. That's worth stating to the client — type licensing is a cost that catches people out.

### In the built site (Ironwork)

| Role | Typeface | Weights | Notes |
|---|---|---|---|
| Display | **Spectral** | 600 | Headings, scheme names, pull quotes. Tracking `-0.018em`. |
| Body | **Archivo** | 400, 500, 600 | All body copy, navigation, buttons. |
| Labels | Archivo | 600 | 10.5px, uppercase, `0.2em` tracking. Eyebrows, captions, tags. |

### Specified for the other directions

| Direction | Display | Body |
|---|---|---|
| Seafront | Bodoni Moda 600 | Archivo |
| Prospectus | Newsreader 600 | Public Sans |
| Lawns | Fraunces 600 | Inter |

### Type scale as built

| Class | Size | Used for |
|---|---|---|
| `.d1` | clamp 42–116px | Page titles, cover headline |
| `.d2` | clamp 32–72px | Section headings, scheme titles |
| `.d3` | clamp 26–46px | Sub-headings, quotes |
| `.d4` | clamp 21–30px | Director names, table headings |
| body | 16px / 1.68 | All copy, max 60 characters per line |

---

## 5. What was rejected, and what replaced it

Keeping this so the same ground doesn't get covered twice.

| Rejected | Why | What replaced it |
|---|---|---|
| **Statistics block** — 17 developments, £55m largest GDV, 2012, 2 founders, counting up on scroll | Client is private about what they share. Site is a viewing platform, not a sales tool. | Removed entirely. A scheme index — names and locations only, hover shows a preview image. No figures anywhere. |
| **GDV and unit counts in scheme headings** | Same reason | Headings now read "Completed 2021 · Hove". Unit numbers only survive where they appear inside the client's own body copy. |
| **Near-black and heavy dark grounds** (`#071523`, `#0B0C0C`) | Too heavy | Nothing is near-black now. Dark sections use a brand tone — bronze, deep sea, deep navy, forest. Cover gradient lightened, quote section moved to a light ground. |
| **Thin display weights** — Newsreader Light 300 | Hard to read | All display faces moved to 600. |
| **"Monolith" direction** — near-black, concrete, no accent colour | Heaviest of the set | Replaced by Lawns: cream, deep green, clay. |
| **Placeholder wordmark** | Not their logo | Real logo now embedded, white and gold versions. |

---

## 6. Site structure

Four pages, hash-routed, no page reloads.

```
#/                          Home
#/developments              Index of all 17
#/developments/{slug}       Scheme detail — 17 of these
#/about                     Company + director bios
#/contact                   Details + enquiry form
```

**Home** — full-bleed cover with parallax, headline rising line by line. Company statement in their own words. Pinned scroll scene: the image crossfades through listed building → restoration → returned to residential as you scroll. Recent projects as three cards. Founders' quote.

**Developments** — image, name, location, exactly the format their current site uses. Filter chips added: All / In Construction / Completed / Draft.

**Scheme detail** — the same block order their site uses, with blocks omitted when there's no content:

1. Hero image, parallax
2. Title and intro copy
3. Accommodation schedule table
4. Video — Vimeo embed or self-hosted MP4
5. Gallery with click-to-open lightbox, arrow and keyboard navigation
6. Location tags
7. Location copy and "See on Map" link out to Google Maps
8. Brochure downloads, PDF-labelled
9. "Other Projects" back to index

**About** — company statement, both director bios, pull quote.

**Contact** — address, both directors, enquiry form. The current site has no form at all.

---

## 7. Content status

Copy is ported verbatim from the live site.

**Fully populated (3):**
- The Meads Collection, Eastbourne — In Construction
- Kings House, Hove — Completed, 25 gallery images, 2 Vimeo videos, 2 brochures
- Montpelier Place, Brighton & Hove — Completed, 15 gallery images, 2 brochures

**Awaiting content (14):** Queens Hotel (Portsmouth), Highdown (Ferring), Park Place (Stevenage), Grand Avenue (Hove), Marling House (Wadhurst), Oldcourt House (Bray), Shinfield (Reading), Tide Mills (Newhaven), Quiet Waters (Angmering), Royal Oak (Ditchling), Symbister (Brighton), Rothbury Mews (Portslade), Holywell Business Park (Southam), Network Oxford (Oxford).

All 14 are in the site with correct names, locations and URL slugs, tagged Draft. Each needs copy, hero image, gallery, schedule table, location text, map link and brochures.

---

## 8. Needed from Ronan

1. **Logo as vector** — SVG, EPS or AI. What's embedded is a 319×158 PNG that will soften on retina and can't be recoloured. Proworx made it, so they hold it.
2. **Original image files** at full resolution. The site currently hot-links images off the live site — fine for review, not for launch.
3. **Brochure PDFs** for every scheme that has one.
4. **Copy and figures for the remaining 14 schemes**, or confirmation to lift them from the live site as-is.
5. **Where enquiry form submissions should go**, and a privacy notice — the form collects an email address, so one is required.
6. **Hosting and domain access** when it comes to switching over.

---

## 9. Open decisions

**Display typeface.** Their logo is set in a Didone — high-contrast serif, same family as Bodoni. The site headings are Spectral, a different kind of serif, so the logo and the headlines don't quite speak to each other. Switching the display face to Bodoni Moda would harmonise them. Not done yet because thin headings were already flagged as hard to read and Didones run finer. One-line change; worth comparing side by side before deciding.

**GDV and unit counts.** These have been stripped out on privacy grounds, but their current site publishes them openly on every scheme page. Worth telling them what's currently public before assuming it should come down.

**The design switcher.** Removed from the final build. It's still live in `rego-site.html` and `rego-brand-directions-v3.html` if the other three directions need showing.

---

## 10. Technical notes

- **Keep the existing URL structure** (`/developments/kings-house`) so nothing already linked or indexed breaks. Set up redirects if anything changes.
- **SEO.** The current site has a blank meta description on every page and empty alt text on every gallery image. Real page titles, descriptions and OG tags are in the new build. Alt text still needs writing per image.
- **Print.** `#38362D` is awkward on uncoated stock — it drifts toward brown. If Ironwork goes ahead, specify a proper Pantone match for brochures and signage rather than passing a hex around.
- **Accessibility.** Keyboard focus is visible, reduced motion is respected, the gallery lightbox takes arrow keys and Escape. Colour contrast should be re-checked once final copy is in.
- **Browser storage** is not used anywhere, so the file runs standalone.

---

## 11. Next steps

1. Show the four directions, confirm Ironwork.
2. Get the vector logo and the image library.
3. Port the remaining 14 schemes.
4. Swap hot-linked images for local assets.
5. Wire the enquiry form to a real inbox, add the privacy notice.
6. Alt text, favicon, final metadata.
7. Cross-browser and device testing, Lighthouse pass.
8. Deploy, DNS cutover, redirects.
