# Reading of the Founder's Brand World source pack

**Read:** 1 October 2026, on the Founder's direction of that date ("read the complete Brand World
source pack first, not a single document or isolated excerpt").
**Source:** `origin/agent-handoff:docs/agent-handoff/source-packs/brand-world-gp/BRAND-WORLD-GP-MARKDOWN-PACK.md`
(4,991 lines, 12 source documents, per-file SHA-256 markers; original ZIP SHA-256
`cb8cd77d89cbde407fbeb1ce3284c0bd9be0f3ac404b288ce91c04c876f1c1cb`).

**What this document is.** A record of what the pack establishes, what it leaves open, and where it
conflicts with what this repository currently does. It decides nothing. Per the pack's own README
and the Founder's direction: adoption status is read from each document's own wording, historic
material is preserved and not treated as current requirement, and genuine conflicts are surfaced
rather than silently reconciled.

**Coverage.** All twelve documents read. Two are characterised by purpose, status and conflict
rather than line by line, and this is stated so the limit is visible: `PC2-ARC-DETERMINATION.md`
(1,186 lines — Safe Mode architecture, separately owned, see §6) and
`affiliate-edge-master-report-v1 0.md` (773 lines — unauthorised strategy, see §5). The pack's
**PDF and prototype artefacts are not in the text mirror**, and the Founder has recorded that a
text-only excerpt is insufficient where layout or visual evidence matters. **No visual or
score-presentation decision is taken here.**

---

## 1. What is authoritative, from the documents' own words

Charter v1.1 **Schedule A** is the register, and it is explicit that "instruments marked
'harmonised draft' take effect on the Founder's ratification of this document family; **until then
the version they supersede remains in force**."

| Class | Instrument | Status as the pack records it |
|---|---|---|
| (a) Charter | Constitutional Charter v1.1 | **Harmonised draft**; v1.0 historic, its ratification block unsigned |
| (a-i) | Founder Decision Record v1.0 | Ratified |
| (a-ii) | Declaration of Belief v1.0 | Founder Approved |
| (a-iii) | Founding Charter v1.1 | **Harmonised draft**; v1.0 historic |
| (b) Governance | Unified Operating System v2.1 | **Harmonised draft**; ratification requires the §24.8 reconciliation sweep, which is **not complete** |
| (c) Methodology | Score standard and assessment model v2.2 | **In force** |
| (d) Identity | **Brand World v2.1** | **Ratified 26 July 2026 and in force until superseded** |
| (d) Identity | Brand World v2.2 | **Harmonised draft** for ratification |
| Historical | **Brand Bible v1.1** | **Retired 26 July 2026**; preserved, **not authoritative** |

**Three consequences that prevent mistakes:**

1. **The "Promptly" renaming is not adopted.** Brand World §1.4 states the name "is a reserved
   matter under Charter Art. IV.4. Its formal adoption is effected by the Founder's ratification of
   the harmonised document family; **this document asserts no earlier adoption**." Charter Schedule
   B records it as "settled by ratification of this version" — i.e. on ratification, not before.
   **The site correctly remains GetPromptly. Nothing is renamed.**
2. **Brand Bible v1.1 is retired, and this repository still treats it as canonical.** `CLAUDE.md`
   calls `docs/brand-bible.html` "the full brand source of truth (v1.1)". It was retired on
   26 July 2026 — two months before the containment programme ran against it.
3. **The 8-point pre-publish checklist has moved.** `CLAUDE.md` cites "Brand Bible §22". Brand World
   Schedule C dispositions Bible §22 as "Archived (rollout); **merged (checklist)**; omitted
   (guardian replacement)", destination **UOS §9.2** — the Donna pre-publication gate. The
   containment harness is in substance an implementation of UOS §9.2, not of a Bible checklist.

**What the retirement does *not* do.** Schedule C shows the substance largely survived: Bible §09
Colour, §10 Typography, §12 Editorial Devices, §14 The British Voice and §20 Accessibility are all
**"Retained"**. So the brand rules the containment has been applying are, in substance, still the
rules. The *authority* moved; most of the *content* did not.

---

## 2. What the pack confirms about the containment

Read against the instruments, the containment is **aligned**, and three provisions say so directly:

- **UOS §9.4 (U-1).** "Automatic transitions may only make a public state more conservative or
  suppress it. Every favourable movement of a public state requires a named human's set-once
  approval." Suppressing a score is a conservative movement. The containment required no
  favourable-movement approval, and reinstatement will require one.
- **UOS §12.2.** A safeguarding withdrawal "executes immediately under U-1 without awaiting
  favourable-movement approval. **Reinstatement is a favourable movement**" — which is the correct
  treatment of the ten tools withdrawn in June 2026.
- **Charter Art. I.4, I.5, I.8.** Evidence before assertion; every claim resolves; honest
  uncertainty is a legitimate published finding. The containment withdraws claims that cannot
  resolve, which is what these require.
- **Rule 4b is real and readable.** The harness's `Rule4bGuard` traces to **UOS v1.2 §6.1 Rule 4b**,
  which *is* in this pack: "No score artefact leaves the platform without a dated stamp and a
  live-score link. Badges must be served live from the GetPromptly endpoint only — static badge
  images are never issued." Verified against the source for the first time.

---

## 3. A new gap of the same class as GOV-GAP-001 — recorded, not filled

**The containment record cites UOS v1.3.1 §19, §21 and §24** — "legacy provenance is never
invented", "the governance repo holds hashes and references only", "missing means missing". Those
citations underpin the containment's own justification.

**No Unified Operating System text exists in this repository** (`find docs -iname "*operating*" -o
-iname "*uos*"` returns nothing), and **v1.3.1 is not in the pack**. The pack carries v1.2 (nine
sections, no §19/§21/§24) and v2.1. Neither contains those phrases.

So the containment has been citing section numbers against an instrument whose text no one in this
workstream can read. That is the same shape as `GOV-GAP-001` (the missing v2.2 Standard text) and
`GOV-GAP-002` (the missing MVB v0.1), and it is recorded here as **`GOV-GAP-003`** rather than
resolved by paraphrase — which is, with some irony, precisely what §19 is cited as forbidding.

**It does not void the citations.** UOS v2.1 §0.4, §24.8 and Schedule A are explicit: "Any provision
not listed above — **Unreconciled.** To be carried forward or expressly retired at ratification",
and "anything absent is, by definition, unreconciled rather than repealed". The provisions stand as
unreconciled. What cannot be done is to check that the record quotes them correctly.

---

## 4. Conflicts between the instruments and this repository

Surfaced, not resolved. Each needs a Founder determination because each is an expression or
methodology matter reserved under Charter Art. IV.2.

| # | The instrument says | The site does | Note |
|---|---|---|---|
| 1 | Brand World §13.1: **WCAG 2.2 AA** across every surface | `/` says 2.2 AA; `/safety-methodology` says **2.1 AA** and names 2.1 as "the baseline for our Accessibility pillar" | Reviewer B's M5. The pack points to 2.2; the ratified v2.1's text is unavailable to confirm it was not a v2.2 change — the Version Note does not list accessibility among the changes |
| 2 | Brand World §9.2 names seven card states — Active, Provisional, Updated, Withdrawn, Historic, **Not Yet**, Insufficient data — and §15.4: states "are used with their exact names, **never paraphrased**" (UOS §0.7) | The platform uses `LegacyHolding` and `AwaitingReReview` | **Neither is in the constitutional vocabulary.** But UOS §24.5 records that FD-01's "evidential threshold, reassessment interval and **published wording**" are **outstanding**, so "Not Yet" cannot simply be adopted either. This is a methodology matter, not an engineering one |
| 3 | Brand World §16.7 requires the standing Score Integrity Record, including that "the record of every score change is public" | Withdrawn in round 25 — `/methodology` holds **zero** real score changes; every row is captioned "illustrative example" | §17.5 ("a stamp bearing invented data on any public surface is a defect, and the institution may not be the counterexample to its own rule") and §19.3 ("a surface may not display a judgement whose record is not live") **support** the withdrawal. The canonical block must be restored verbatim once the record exists |
| 4 | Brand World §15.11 microcopy: "Last verified · Reviewer named · **Re-scored quarterly**" | No re-review is being carried out; calibration is blocked | A cadence claim in the identity constitution that is currently false |
| 5 | Brand World §14.6 proscribes a **longer** list than `CLAUDE.md` carries — adding *empowering, best-in-class, future-proof, unlock, ecosystem, paradigm, excited to announce, thrilled to share, trusted leader, compliance engine* | The harness enforces the shorter list | Enforcement gap, not a conflict. Cheap to close; left for the Founder because the list's authority is now UOS §9.2 |
| 6 | Charter Art. I.9 / Brand World §14.9: the institution "does not describe itself as trusted" | "Trusted by teachers… across the country" (footer) and "ICO Registered" (all routes) | Both **withdrawn in round 25**, before this pack was read. The instruments confirm the call |

**D1 / RL-017 trigger 7 has changed shape.** It asks whether a *Brand Bible* erratum supersedes an
adopted Class A rule. Its subject is now a retired, non-authoritative Historical Founding Source
Document whose checklist has moved to UOS §9.2. UOS §1.2–1.3 confirm RL-017 is live (Class A,
effective 21 July 2026, annual review 21 July 2027) with **seven recorded triggers** returning a
matter to joint CR+CD. The trigger mechanism stands; what the trigger is *about* has moved.
**Still a Founder/CR+CD matter. Not decided here.**

---

## 5. The affiliate report is strategy, not authority — and parts of it would breach ratified doctrine

`affiliate-edge-master-report-v1 0.md` (May 2026) carries **no adoption status**, predates the
harmonisation, and describes the old product shape ("243 AI tools, 76 courses, 96 equipment
products, 440+ prompts"). It is preserved for context. It is **not** a mandate, and three of its
central proposals conflict with instruments now in force:

- **"Generate a downloadable audit receipt (PDF) on every affiliate click."** Brand World §23.4:
  "Commercial material never adopts the visual grammar of the record. Evidence devices, stamps,
  receipts and record blocks are **not** used to dress commercial propositions."
- **"The Promptly Score Card embed… vendors voluntarily place on their sites."** §17.4 forbids the
  stamp marking "a vendor's material"; §17.6 requires any licensed display to be live,
  auto-updating, revocable and carrying a **current** score — and no score is current. Licensing the
  marks is reserved under Charter Art. IV.5.
- **"Oliver should pivot to Trust Validator — £1,500–£5,000/year paid validation contracts from
  EdTech vendors who need GetPromptly's safety review for school procurement."** Charter Art. I.2
  requires commercial arrangements to be "structurally separated from the formation and publication
  of judgements"; Brand World §23.6 permits a separated vendor service only where the badge "never
  displays the Promptly Score".

**And affiliate operation is unauthorised in any case.** UOS v2.1 §24.1 lists "affiliate
arrangements" as "*constrained* by the Charter … but not *authorised* by it", requiring a ratified
commercial instrument that does not exist; Charter Art. IV.6 makes any new revenue category a
reserved matter; and UOS v1.2 §6.1 barred a public affiliate link before "a published Promptly
Score, a live review page, the Disclosure block, and the full registry gate". No score is published.
**The round-24 affiliate removal is therefore consistent with the instruments**, and the ratification
record's §5.2 says the same: "Commercial operations remain constrained by the Charter and
unauthorised by any ratified instrument."

---

## 6. Safe Mode, and what the pack says about where it lives

`PC2-ARC-DETERMINATION.md` (ARC-PC2-001, 18 August 2026) is an architecture determination on the
durability and non-vacuity of the institutional audit log for Safe Mode. It records its repository
as **`/Users/chloeandcharlie/promptly-labs`, `40-safe-mode/`** — not this repository — and is
explicit that it changed no file there.

The Founder's direction of 1 October 2026 records that **Charles is building Safe Mode**, and that
Claude Code must not build, redesign, refactor or independently implement it, nor infer its missing
requirements. This reading therefore records only what bears on not blocking it:

- Safe Mode's artefacts and its audit-log design live in a **different repository**.
- The determination leaves seven things expressly undecided, including whether a Decision is
  personal data at all (reserved to an external professional) and a reported unresolved tension
  between ADR-002 §4 and §12 on whether the audit log is device-side or Promptly-side — which it
  says "Labs may not perform alone".
- Nothing in this repository's retained product should be changed on the strength of it.

---

## 7. What is open, from the documents themselves

- **Brand World §26: seventeen matters**, none decided — including the resting ground and its ratio
  (§26.2), the accent scarcity rule (§26.3), **the identifying mark** (§26.4), the plain-language
  gloss set (§26.7), the framework edition rule for the trust trio and microcopy (§26.9), the
  resolver standard (§26.11), the commercial instrument (§26.12), the master phrase (§26.15) and the
  wordmark production specification (§26.16).
- **UOS §24: nine matters** requiring Founder review, including the resolver standard, the definition
  of "significant publication" for anchoring, Reviewer Register publication mechanics, **the Not Yet
  operational parameters**, the v1.3.1 reconciliation sweep (§24.8) and succession (§24.7 — "the
  single item on this list whose absence has no workaround").
- **The Consolidated Amendment Register Rev A**: thirty-nine entries, **none applied**.
- **The identifying mark.** The Logo Territory Jury proposes LJ1–LJ5 and states plainly that "no
  artwork exists, so this is a desk jury"; D1–D14, TR1–TR11 and AS1–AS12 remain unapplied. The
  incumbent starburst remains in service (Brand World §1.6). **Nothing about the mark is changed.**
- **The prototype build** (`PROTOTYPE-NOTES.md`, `PROTOTYPE-HTML-VALIDATION.md`) is marked
  "PROTOTYPE — ILLUSTRATIVE — NOT ADOPTED", with every tool, score, reviewer and date in it
  invented. Its stated source of truth is a **PDF not in the text mirror**.

---

## 8. What I have changed on the strength of this reading

**Nothing.** No brand, identity, score-presentation, Pillar Card, state-vocabulary or methodology
change has been made. The round-25 repairs were completed before this pack was read and were driven
by the two fresh reviewers; where the instruments bear on them they **confirm** them (§2, §4 rows 3
and 6, §5).

The one thing this reading changes is what the next brand-facing work must cite: **Brand World v2.1
as the identity constitution in force, UOS §9.2 as the pre-publication gate, and the Brand Bible as
a historical source** — with the caveat at §1 that v2.1's own text is not in the pack, so a
specification question that turns on wording v2.2 may have changed cannot be answered from the
mirror alone.
