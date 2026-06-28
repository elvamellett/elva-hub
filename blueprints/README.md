# PULSO Blueprints — modular business operating system

Drag-and-drop **Excalidraw** blueprints for every flow of the PULSO business. Each flow is one
editable file with an **agent assigned to every role**, laid out as **INPUT → PROCESSING → OUTPUT**
with a feedback loop and the tools it runs on. They're modular: open any one on its own, or drag them
all onto the master canvas to see the whole operating system.

## Files

| File | Flow | Lead agent(s) |
|---|---|---|
| `marketing.excalidraw` | Marketing & Growth — demand at/under target CAC | Research · Content Engine · Social · Paid Ads |
| `store.excalidraw` | Store & Conversion — visitors → orders at healthy AOV | Web Dev / CRO |
| `operations.excalidraw` | Operations & Fulfilment — ship on time, never out of stock | Ops & Fulfilment · Sourcing |
| `retention.excalidraw` | Retention (Email) — repeat revenue, no new ad cost | Email / Retention |
| `finance.excalidraw` | Finance — one source of truth, early warnings | Finance & Analytics |
| `product.excalidraw` | Product & Sourcing — find, validate & supply the next product | Research · Sourcing |
| `service.excalidraw` | Customer Service — fast on-brand help → sales & reviews | Customer Service |
| `_MASTER-operating-system.excalidraw` | The hub — Orchestrator + all 7 flows on one canvas | Orchestrator |

PNG previews of each are in the PR description / `bp-*.png`.

## How to open & edit
1. Go to **[excalidraw.com](https://excalidraw.com)** (free, no account).
2. **Menu → Open** and pick a `.excalidraw` file (or drag the file onto the canvas).
3. Everything is editable — drag boxes, retype text, recolour, add arrows.
4. **Save:** Menu → Save to file (keeps the `.excalidraw` format) or Export image (PNG/SVG).

> Tip: VS Code users can install the **Excalidraw** extension and edit these inline in the repo.

## How they're modular (drag & drop)
- Each flow is **self-contained** — boxes are grouped so you can move a whole step at once.
- To build the **whole system**, open `_MASTER-operating-system.excalidraw`, then **Menu → Open →**
  *add to canvas* each flow file and arrange them around the Orchestrator. Or copy/paste boxes
  between files.
- Add your own steps by copying any box (Ctrl/Cmd-C, V) and editing the text.

## Reading a blueprint
- **— INPUT —** (blue): what triggers the flow / what it needs.
- **— PROCESSING —** (white): the work, each step labelled `> Agent: <name>`.
- **— OUTPUT —** (green): what the flow hands to the next flow.
- **`[human gate]`** (amber box): a step that **needs your approval** before it runs
  (e.g. launch ad spend, send to a big list, commit a PO, refund over a threshold).
- **FEEDBACK LOOP** (grey): the metrics that decide what to do more/less of.
- **INFRASTRUCTURE / TOOLS** (grey): the systems that step runs on.

## Agent legend
`> Agent` = an AI department does the work. The agents map 1:1 to the specs in
[`../agents/`](../agents) and the team overview in [`../ai-agent-team.md`](../ai-agent-team.md):
Orchestrator, Research & Product, Content Engine, Social Media, Paid Ads, Web Dev / CRO,
Ops & Fulfilment, Sourcing & Supply, Email / Retention, Finance & Analytics, Customer Service.

A `—` next to *Agent* means that box is a hand-off (an input or output owned by an adjacent flow),
not a step an agent performs.

## How the flows connect
```
Product & Sourcing ─→ new SKUs ─┐
Marketing & Growth ─→ traffic ─→ Store & Conversion ─→ orders ─→ Operations & Fulfilment ─→ shipped
                                          └─→ email capture ─→ Retention ─→ repeat orders ─┘
Finance watches all of them · Customer Service feeds Voice-of-Customer back to Product & Store
Orchestrator runs the daily loop and routes every [human gate] to you.
```

Colours, type and the agent roster are the PULSO brand set in [`../brand-pack.md`](../brand-pack.md).
