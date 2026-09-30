# DECISIONS NEEDED

**Scope of this file.** Genuine CR / CD / Founder decisions only — matters an agent may not settle.
Routine engineering work belongs in `CURRENT-STATE.md` §5 and must not be added here.

**Last reviewed:** 30 September 2026 (round 24 — product scope reduction)

**Authority note.** Under RL-017 (Standing Delegation Rule), CR owns editorial and methodology; CD
owns schema and platform. Any change to scoring logic, or to evidence and verification rules,
triggers **joint CR + CD** reconsideration — it cannot be taken by CR alone. Under UOS v1.3.1 §19 a
missing governed input is never invented, and under §24 "missing means missing".

Decisions are listed in the order they block work.

---

## D0 — Schedule Phase 2B decision **D3**: a human read of every rendered surface

**Status:** RESOLVED and **in progress**. The Founder scheduled D3 on 29 September 2026 and
adjudicated batches 01-04 of the first pack (48 decisions). The 30 September scope reset then
removed several of the surfaces those decisions were made on, so the pack was regenerated from
the retained surfaces only: **119 claims, 10 batches, 27 items pre-filled with your earlier
answers, 19 of your decisions resolved by removal, 92 open.** See `d3-review/CARRIED-FORWARD.md`.
Do not ask the Founder to re-decide whether D3 is needed, and do not ask them to re-adjudicate a
claim they have already answered or a surface that no longer exists.

**What D3 is.** Phase 2B recorded it as the designated completeness control: a human reads every
rendered surface and adjudicates the claims on it. It is not a harness run and cannot be delegated
to one.

**Why it is now urgent rather than theoretical.**

- **Measured reach is 6 of 15.** Fifteen ordinary British phrasings of a review-practice, cadence or
  verdict claim, planted one at a time on `/tools`: six caught, **nine ship green**. Still passing:
  *"Nothing appears in this directory until a human has looked at it"*, *"A DSL has looked over each
  of these"*, *"Tools are added only after a data-protection review"*, *"We keep this page up to
  date every September"*.
- **A live false claim survived four rounds** because every verb in the claim pattern was a past
  participle, so the present tense was invisible. It was the `/methodology` meta description, in the
  shipped bundle, served to search engines.
- **Every round closes the exploits found and the next round finds new ones outside the
  enumeration.** Two round-19 reviewers said so independently. Round 20 made three genuinely
  structural changes and reach still only doubled.
- §17, §20 and §25.8 of the containment record all say the same thing: **a pattern gate is not a
  claim detector.**

**Evidence needed to decide:** containment-record §4 (the measured-reach row and its method), §25.8,
and Phase 2B's own definition of D3.

**Options:**

- **Schedule D3.** A human reads the rendered surfaces — the 65 captured routes are a starting list,
  and `proof/CAPTURE.md` regenerates them. This is the only route to a defensible "the site says
  nothing untrue". It is work in hours, not minutes, and it needs a person who can judge a claim
  against what Phase 2B found.
- **Keep iterating the harness instead.** Legitimate, but say so explicitly and accept the recorded
  consequence: reach improves slowly, each round finds the next enumeration boundary, and
  containment stays NOT CLEAR. Nothing ships either way while D1 and D5 are open.
- **Ship with the exposure declared.** Only if D1 (trigger 7) and D5 (the n8n grounding) are also
  resolved, and the residual is written down rather than implied.

**What an agent may and may not do here.** I can prepare the surface list, regenerate the corpus,
and record findings. I cannot perform D3: it is a human adjudication by definition, and treating a
harness pass as a substitute is the exact error this programme has been documenting.

---

## D1 — RL-017 §2 trigger 7: does the Brand Bible erratum supersede an adopted Class A rule?

**Status:** OPEN. Awaiting **joint CR + CD** sign-off. No determination has been made, and none may
be made by an agent.

**What is at stake.** The containment change writes 19 errata rows into `docs/brand-bible.html`.
RL-017 §2 trigger 7 fires when a change would "supersede an adopted Class A rule". If it fires, the
erratum needs joint CR+CD determination before it can be deployed; the two rules the erratum
contradicts are still present in the Bible unchanged.

**Evidence needed to decide:**
- `phase2c/CRCD-brand-bible-RL017-trigger7-decision-record.md` — sets out §5 "the argument that
  trigger 7 APPLIES" and §6 "the argument that trigger 7 may NOT apply" at comparable strength,
  with Options A and B and neither line pre-selected. The CR/CD boxes are unticked.
- The 19 errata rows as they stand in `docs/brand-bible.html` (`<section id="errata-kcsie-2026">`).
- Adoption Package v1.0 §2, the Class A/B/C change-control definitions.

**If trigger 7 APPLIES:** the erratum is a Class A change. It needs joint CR+CD determination
recorded before deployment. Containment can otherwise proceed, but cannot be declared complete.

**If trigger 7 does NOT apply:** the erratum is an editorial correction within CR's delegation and
can be recorded as such. Containment's brand-layer work closes.

**Until determined:** nothing may state that trigger 7 is cleared. The decision record must
continue to present both arguments without choosing.

**Related.** The containment record's §10 previously argued the erratum "is still formally a
proposed change" *because the branch was uncommitted*. That reasoning briefly became false on
23 September when a reviewer accidentally committed the branch. HEAD has since been restored
(0 commits ahead) so the statement holds again — but whether the episode is recorded in §10 or §22
is a Founder call, not an engineering one.

---

## D2 — Methodology v2.2: which lineage is the real one?

**Status:** OPEN. Awaiting **joint CR + CD** sign-off. No choice has been made.

**What is at stake.** Two incompatible lineages of v2.2 are evidenced in the repository — differing
in weights, caps and floors, the verdict/tier model, and the evidence model. Every live score was
produced under "v2.2", so which lineage is authoritative determines what those scores ever meant.

**Evidence needed to decide:**
- `phase2c/CRCD-v2.2-lineage-decision-record.md` — both lineages in full, where each is evidenced,
  which instruments support each, and whether either can be established. It presents three options
  and chooses none.
- `GOV-GAP-001` — the consolidated v2.2 Standard text was not found in any location searched. This
  is a bounded statement about the search, not a claim that it exists nowhere.

**If a lineage can be established:** re-review can be scoped against it and the held scores have a
defined baseline.

**If neither can be established:** the honest position is that v2.2 has no recoverable Standard,
and re-review must proceed under v2.3 once adopted — which makes D3 and D4 load-bearing.

---

## D3 — GOV-GAP-001: how is the v2.2 Standard text to be obtained?

**Status:** GAP RECORDED. Blocks calibration (IR step 4) and therefore **G2**.

**What is at stake.** Calibration cannot start without the Standard text. It cannot be
reconstructed by an agent — UOS §19, "legacy provenance is never invented".

**Evidence needed to decide:**
- `phase2c/GOV-GAP-001-methodology-v2.2-artefact.md` — the locations searched, the two incompatible
  lineages, and the governed route to recovery or reproduction.
- Whether a copy exists outside this machine: the private governance repository named at UOS §21
  (`/getpromptly-governance`) **does not exist here**, and Notion/secure evidence storage have not
  been searched by an agent.

**Options:**
- **Recover** — locate the original in governance storage. Cleanest; unblocks G2 directly.
- **Reproduce through the authorised route** — CR authors it as a governed artefact, CD ratifies.
  Slower, and it must be recorded as a reproduction, never presented as the original.
- **Abandon v2.2 as a baseline** — proceed to v2.3 adoption instead. This makes D2 moot but raises
  the question of what the held legacy scores are re-reviewed *against*.

**Until resolved:** calibration, re-review and any public 2026 wording stay barred.

---

## D4 — GOV-GAP-002: Validity System MVB v0.1, and the Probe Governance Charter

**Status:** GAP RECORDED. Blocks the Probe Charter and therefore **G3**, which cannot close.

**What is at stake.** The Probe Governance Charter (Artefact 7) derives from MVB v0.1 §5, which is
missing. The Charter is unsigned, so **probe runs are barred**.

**Evidence needed to decide:** `phase2c/GOV-GAP-002-mvb-v0.1.md` and
`phase2c/G3-probe-charter-route.md` (the governed route, and why G3 cannot close in this cycle).

**If MVB v0.1 is recovered:** the Charter can be drafted and signed by the governed route, and G3
can close.

**If it is not:** G3 stays open, and `G2-readiness.md` records the consequence — **no unqualified
PASS while G3 is open** (deviation D-07). Any claim of a completed calibration would be false.

---

## D5 — Luna's live grounding: who owns the deployment gate?

**Status:** NAMED, UNOWNED. Recorded at containment-record §8 item 6.

**What is at stake.** Luna's live grounding is deployed **in n8n, not in this repository**. This
branch contains `src/api/agent.ts` and both authoring sources, but the prompt that actually
generates Luna's answers sits outside the frozen tree and is unchanged by this work.

**Shipping this branch contains the whole site except the conversational surface** — and Luna is the
one surface where a user asks for a score in so many words. IR §6 bullet 1 names "Luna
scripts/payload" as in scope.

This is sharpened by a round-16 finding: the tool pages and the Luna panel render **suggested
questions** — "Is ChatGPT safe for my Year 7 class?", "What's the safest AI tool for a Year 5
classroom?" — which invite precisely the answer containment forbids. On these bytes they are
questions; what governs the answer is outside the repository.

**Evidence needed to decide:** the deployed n8n prompt text, and confirmation of who holds change
control over it.

**If an owner is named and the grounding is updated first:** containment can deploy as a whole.

**If it is not:** either containment deploys with a declared, recorded exposure on the
conversational surface, or deployment waits. **This is a Founder call.** An agent may not decide
that a partially-contained site is fit to ship.

---

## D6 — Standards registration (IR step 2)

**Status:** **PROPOSED, NOT ADOPTED** — `phase2c/standards-registration-proposal.md`, ten contexts,
separately dated.

**Evidence needed to decide:** the proposal itself, and whether the ten contexts are the right set.

**If adopted:** IR step 2 closes and the standards-context register becomes governed.
**If not:** it remains a proposal and must not be cited anywhere as adopted.

---

## D7 — The §2 equipment blind spot no longer has a subject. Should §2 be restated?

**Status:** the question has changed. It is no longer "which form does the exclusion take" — the
exclusion now excludes nothing, because the surfaces it covered have left product scope.

**What changed.** On 30 September 2026 you directed that AI Equipment be removed from product
scope. Every equipment route, page and data file is gone from the working tree. The declared blind
spot therefore measures **0 claim-class hits across 0 routes**.

**What the code does now.** The counter is kept, not deleted, and the DOM transcript prints in
words that the blind spot is *"empty because the surface no longer exists, not because it was
cleared"*. If an equipment route ever returns to the corpus, it starts counting again. The
subject-shaped allow entries themselves were removed as dead — the harness's own dead-allow control
named all eighteen of them, which is how the change was caught rather than assumed.

**The decision left for you.** §2 of the containment record is a recorded governance disposition
that declares an audit exclusion. That exclusion now has no subject. Either:

- **Restate §2** to record that the exclusion lapsed with the surface, dated, so a future reader
  cannot mistake an empty blind spot for a cleared one; or
- **Leave §2 as written**, as the historical disposition it was, with the transcript and the
  containment record §27 carrying the explanation instead.

**Evidence to decide:** containment-record §2, §§22.3, 24.5 and the new §27.2; the round-24 DOM
transcript line; `phase2d/SCOPE-REDUCTION-MAP.md`.

**Why this is still a Founder/CR matter and not engineering:** an agent must not restate a recorded
governance disposition, even to make it more accurate. **This has not been decided and I have not
decided it.**

**What does *not* need deciding:** mutant **M107**, which planted a tool-score claim on an
equipment page, is retired with that page. That is a mechanical consequence of the removal and is
recorded in the pack, not a governance question.

## Not decisions — do not migrate these here

The round-16 harness defects (rule scoping, the qualifier allow, the `onLine` window, the sentence
terminator, the freeze controls, the `node_modules` symlink, the stale README/SEAL-NOTE figures) are
**engineering repairs**, tracked in `CURRENT-STATE.md` §5. They need no founder decision and should
not be escalated into this file.
