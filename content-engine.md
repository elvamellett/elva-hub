# Content Engine — AI-Generated Ads & Social, End to End

The system that lets the brand **create, brand-check, schedule, publish, and measure** ad creative and social
content continuously — feeding the Social Media and Paid Ads agents. It turns the brand pack + playbooks into a
constant stream of on-brand content with **humans approving anything that spends money or makes a claim.**

> ⚠️ **Honest framing.** In 2026, AI can draft excellent copy, generate strong images, and assemble video — but
> it still needs **human taste, fact-checking, and rights/compliance review.** The engine's job is to remove the
> 80% of grunt work (ideation, drafting, variations, scheduling, reporting) so you spend your time on judgement
> and approval, not to publish unsupervised. Volume without quality control will damage the brand and ad accounts.

---

## 1. What it produces
| Channel | Formats |
|---|---|
| **Paid ads** (Meta first, TikTok later) | Static images, carousels, UGC-style video scripts + assembled video, hooks/headlines/primary text variants |
| **Organic social** | IG/TikTok Reels (scripts + edits), feed posts, Stories, carousels, captions, hashtags |
| **Email** | Campaign + flow copy, subject lines (feeds the Email agent → `klaviyo-retention-plan.md`) |
| **Site/SEO** | Product descriptions, collection copy, blog/educational content, the "find your racket" quiz |

---

## 2. Brand-consistency layer (the most important part)
Every generation is conditioned on the **Brand-in-a-box** block from [`brand-pack.md`](./brand-pack.md) — name,
voice, palette, fonts, motif, and the **forbidden list** (no medical/performance claims, no fake scarcity, no
IP/trademark misuse, no hype-spam). This is injected as a system prompt / style guide on *every* request so
output is on-brand by default. A **Brand-QA check** (automated + human) gates anything before it ships.

---

## 3. The generation pipeline
```
 1 IDEATE        Research/Social agent proposes angles (from trends, winning ads, community, calendar)
 2 DRAFT COPY    Claude writes hooks + primary text + captions in brand voice (N variants)
 3 VISUALS       AI image/video generated OR UGC creator brief produced; product shots pulled from library
 4 ASSEMBLE      Copy + visual combined into platform-ready creatives (sizes/aspect ratios per placement)
 5 BRAND-QA      Auto-check (voice, palette, forbidden terms, claims) → flag issues
 6 HUMAN APPROVE 🔒 You (or a trusted reviewer) approve / edit / reject. Required before publish or ad spend
 7 SCHEDULE      Approved content placed on the calendar; queued to publish/launch
 8 PUBLISH       Social: auto-posted via API. Ads: launched by Paid Ads agent within budget gates 🔒
 9 MEASURE       Performance pulled back (engagement, CTR, CPP, ROAS)
10 LEARN         Winners → more variations of that angle; losers killed. Feeds back to step 1
```
Pipeline runs **continuously** (a rolling content calendar), not in one-off batches.

## 4. AI tooling (assemble, don't over-build)
| Need | Options (2026) |
|---|---|
| **Copy / scripts / ideation** | Claude (latest models) — the reasoning core of the engine |
| **Images** | Modern text-to-image models for lifestyle/scene mockups; keep real product photos for accuracy |
| **Video** | AI video tools for B-roll/edits + **real UGC creators** (briefed by AI) for authenticity |
| **Voiceover / captions** | AI TTS + auto-captioning |
| **Product photography** | Real photos (AI struggles with exact product fidelity); AI for backgrounds/scenes |

> **UGC still wins in sport.** The most effective padel ads are real players on real courts. Use AI to *brief and
> script* UGC and to scale variations — not to fully fake authenticity (audiences and platforms increasingly detect it).

---

## 5. Scheduling & publishing
- **Content calendar** = the shared source of truth (what posts when, on which channel, status: draft → approved → scheduled → live).
- **Cadence (starting point, validate):** Organic — IG/TikTok Reels ~3–5×/week, feed/stories most days; Ads — new creative tests weekly per `ad-testing-framework.md`.
- **Publishing APIs / tools:**
  | Channel | How |
  |---|---|
  | Instagram / Facebook | Meta Graph API (or scheduler like Buffer/Later/Metricool/Ayrshare) |
  | TikTok | TikTok Content Posting API (or Ayrshare/Metricool) |
  | Cross-post mgmt | Ayrshare / Buffer / Metricool API for one-call multi-platform scheduling |
- **Best-time scheduling:** use platform/scheduler analytics to time posts; the Social agent optimises over time.

---

## 6. Creating & running ADS (with money gates)
The engine produces ad-ready assets; the **Paid Ads agent** launches and manages them via the **Meta Marketing
API** — but **inside hard guardrails**:
- Engine builds campaign/ad-set/creative drafts following `ad-testing-framework.md` (angles, structure, budgets).
- **🔒 Human approval required to launch any campaign and to change budgets.** Set hard daily/monthly caps.
- Paid Ads agent may **auto-pause** clear losers (kill criteria) but **never auto-scale spend** unsupervised.
- All ad copy passes **claims/compliance QA** + required ad disclosures before launch.
- Reconcile platform ROAS against blended MER + `financial-model.xlsx` (platforms over-report).

---

## 7. Approval workflow & guardrails (non-negotiable)
- **Human approval gate** before any publish/launch until the engine has earned trust on low-risk content; even then, **ads + claims always reviewed.**
- **Claims/legal:** no medical/performance/health claims; no unverifiable superlatives; respect padel brand/IP and athlete likeness; include ad disclosures where required.
- **UGC rights:** secure written usage rights before running creator content in ads. Disclose paid partnerships.
- **Brand voice:** all output follows the brand pack; reject off-voice or off-palette assets.
- **Platform policy:** follow Meta/TikTok ad + community policies (avoid restricted claims, before/after misuse, etc.).
- **GDPR:** no misuse of customer data/images.
- **Audit log + kill switch:** log every generated/published asset; you can pause the engine instantly.

---

## 8. Prompt library (reusable — examples)
Store these as templates; fill the variables. All inherit the Brand-in-a-box system prompt.

**Ad hook generator**
> "You are PULSO's copywriter (voice: knowledgeable, encouraging fellow padel player; no hype; no unverifiable
> claims). Product: {product}. Audience: {beginner/improver/regular/gifter}. Write 10 scroll-stopping ad hooks
> (≤8 words) using angle {problem-solution / beginner-enabler / community / gifting}. No medical claims."

**UGC video script**
> "Write a 20–30s UGC script for {product} aimed at {audience}. Structure: hook (first 3s) → relatable problem →
> product as solution shown on court → soft CTA. Authentic player tone. Include on-screen text + B-roll notes."

**Social caption + hashtags**
> "Write an Instagram caption for {post topic} in PULSO's voice. 1 short hook line, 2–3 value lines, 1 CTA, 5–8
> relevant padel hashtags (mix broad + niche). No emojis-spam."

**Email subject lines** → feeds Email agent (see `klaviyo-retention-plan.md`).
**Product description** → spec-clear + benefit-led, follows `shopify-store-buildout.md` CRO rules.

---

## 9. Metrics & feedback loop
| Metric | Used by |
|---|---|
| Reach, engagement rate, saves, shares, follower growth | Social agent (organic) |
| Hook/3s-view rate, CTR, CPP, ROAS, frequency | Paid Ads agent (`ad-testing-framework.md`) |
| Winning-angle identification | Loops back to step 1 (make more of what works) |
| Email open/click/revenue | Email agent (`klaviyo-retention-plan.md`) |
Winners get scaled into variations; losers are killed fast. The engine **compounds**: every cycle it knows more
about what this audience responds to.

---

## 10. Honest limitations
- **AI content can be generic or wrong.** Without human taste + fact-check, output drifts to bland or off-brand. Review matters.
- **Authenticity can't be fully faked** in a community sport — real players/UGC still outperform synthetic.
- **Platform policy + originality risk:** mass AI content can trip spam/policy filters or feel samey; quality > volume.
- **It augments, never replaces, judgement** on brand, claims, and spend. Keep the gates.

> Connects to: [`brand-pack.md`](./brand-pack.md) (identity) · [`ad-testing-framework.md`](./ad-testing-framework.md)
> (ads) · [`klaviyo-retention-plan.md`](./klaviyo-retention-plan.md) (email) · [`agents/`](./agents/) (the agents
> that operate this engine).
