# The Suede Studio — locked design rules

Decisions Elva has signed off. Do not change these without her say-so.

## Palette
- Blocks: Olive Mist #645B4E (heroes/dark blocks, deep variants #4E4639/#453E33/#3E382E),
  Warm Sand #AA9E90, Beach Linen #EBE4D9 / #F0EAE0. Backgrounds stay in this family.
- Pop colour: ICE #E0F9FA — the one exact hex, but ONLY on dark backgrounds
  (hero italics like "sorted."/"measure.", dark-row accents) and small accents
  (tag pills, link underlines, marquee dots, eyebrow dashes, footer headings).
- Big display italics on LIGHT/SAND backgrounds are deep olive #645B4E, no shadow
  (changed Aug 2026 after reader feedback — ice was too hard to read on cream).
  The whisper-shadow rule is retired.

## No blue in explanatory copy
- Inside bullet points / list copy explaining what's in a package, keywords are
  NEVER blue: near-black #2E2925 + font-weight 600 on light rows,
  cream #F0EAE0 + 600 on dark rows. Blue is for display accents only.

## Type
- Headlines: Fraunces serif, weight 400, uppercase, letterspaced. Italic serif accents.
- Accent lines ("eyebrows"): spaced-caps Poppins (letter-spacing ~.32em). NO script fonts.
- Body/UI: Poppins.

## Content rules
- Location is Wicklow (never Dublin) everywhere.
- Header nav is exactly: Home · Packages · About · Enquire (all page links; the ACTIVE page gets the underline, no permanent underline on Enquire).
- Questionnaire takes "a couple of minutes" (never "15 minutes").
- Packages: Social (was "Content" — renamed Aug 2026 per Elva's sales deck) / Ecommerce / The Duo. Takeover exists in code but is hidden until launch.
- Lanes: Social = Laura's lane, Ecommerce = Elva's lane (shown as small script lines on the packages page).
- Website build tier NAMES (Showcase/Starter/Signature/Flagship) were tried and REMOVED from the site at Elva's request — they live only in her sales decks. NO prices on the site.
- Prices exist in Elva's sales deck (Suede_Studio_Package_Slideshow.pptx) but stay OFF the website — reconfirmed Aug 2026.
- Package lists are pick-and-choose menus ("What yours could include — you pick"),
  tailored to needs, goals & budget. No public prices.
- AI: removed from the website entirely (Aug 2026 — the throwaway aside in the Ecommerce list is gone). If it ever returns, throwaway aside only, never a headline.
- FAQ block on the homepage is hidden (kept in code).
- Enquiry forms email hello@thesuedestudio.com with all fields + toggle selections.

## Shape
- Section blocks are STRAIGHT-EDGED and full-bleed — no rounded corners or inset margins on the big colour blocks. Cards, pills and form fields keep their rounding.

## Hidden for launch (BRING BACK LATER — Elva wants these restored)
- **Our Work reels section** now lives at the BOTTOM of the homepage (after the enquiry block, before the footer) and is visible, showing 'fresh reels coming soon' placeholders. Drop real reels at videos/reel-1..4.mp4 and they autoplay in the phones. The separate work page was tried and removed — Elva prefers it on the homepage.
- **Testimonials section** (`<section class="tst">` in draft-2.html): hidden with `style="display:none"` until real client quotes replace the Sarah/Aoife/Ciara examples. Remove the attribute to restore.
