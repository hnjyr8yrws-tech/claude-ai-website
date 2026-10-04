# Three decision-1 carve-outs, for the Founder

Decision 1 said: *"Standardise the holding wording to: 'Score held pending re-review. No current
score or pillar value is shown.'"* It is applied at 22 sites. Three classes were **left alone**,
because applying it there would change meaning rather than wording. None is a question that blocked
the work — the rest is applied, proved and frozen — but each wants a yes or no.

### 1. The withdrawn state (D3 items 10.9, 11.1)

**Founder decision — CONFIRM AS LEFT (4 October 2026).** Keep the child-safety withdrawal wording distinct from the ordinary provenance-hold wording.

Ten tools are withdrawn after a **child-safety** review; 231 are held for missing **provenance**.
They currently say different things:

| State | Current wording |
|---|---|
| Held (231) | "Score held pending re-review. No current score or pillar value is shown." |
| Withdrawn (10) | "This tool has been withdrawn from public scoring pending re-review under the current methodology." / "Score withheld while this tool is re-reviewed." |

Restandardising the second row onto the first would describe a safeguarding withdrawal as a
provenance hold. **Left as it is.** Confirm, or direct a separate adjudicated sentence for the
withdrawn state.

### 2. The state vocabulary

**Founder decision — LEAVE UNTOUCHED FOR NOW (4 October 2026).** Do not redesign or rename the controlled score-state vocabulary during D3 cleanup; revisit it with the future score/Pillar Card design.

`LEGACY SCORE · AWAITING RE-REVIEW` (the mark), `Awaiting re-review` (the chip) and the
`displayState` names are governed terms — Brand World v2.2 §15.4 requires the exact state names and
UOS v2.1 §0.7 is controlled vocabulary. Decision 1 adjudicated a sentence; decision 4 adjudicated
the card label. **The vocabulary is untouched.** Confirm, or adjudicate the vocabulary separately.

### 3. The historical changelog (item 10.2)

**Founder decision — CONFIRM AS LEFT (4 October 2026).** Preserve the historical record in the wording used at the time.

`src/data/methodology.ts` records what was done on the notice date, in the words used then. UOS §19
— a historical record is not rewritten. **Left as it is.**

---

# Also surfaced by this work, not decided

**The build has been broken since the 30 September scope reset.** `prebuild` ran
`scripts/audit-prompts.mjs`, which reads `src/data/prompts.ts` — removed with the prompt packs. So
`npm run build` exited 1 before compiling anything. I removed the gate and the orphaned script, and
deleted the dead `PROMPT_CATEGORIES` taxonomy that mirrored the same file. Nothing imported it.
This is the same class as the three round-25 blockers that were mine: **removing a feature
falsifies the things that describe it.**

**Decision 11 was half-applied on the first pass.** The composite mechanics were still live in the
`STEPS` list and the five-pillars paragraph on /safety-methodology after the prose paragraph was
removed. A sweep for the mechanics language found them. The sweep is now the standing step before
any claim removal is called done.
