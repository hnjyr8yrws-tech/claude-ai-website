# D3 review — batch 02 of 11

Mark each claim **KEEP** / **CHANGE** / **REMOVE** / **NEEDS EVIDENCE** on its decision line.

---

### 02.1 — Review practice

**Appears on 2 surfaces:** `/methodology`, `/methodology (Ask Luna open)`


**Claim, as rendered:**

> Living methodology Methodology The living record This is our living methodology: how we review tools, how scores can change, and a full record of integrity actions.


**Why this is flagged:** Asserts that a review was or is carried out. Phase 2B found the provenance for this does not exist: reviewer initials and methodology version are build constants and 0 of 252 rows record a Review Basis.

**Check it against:** Phase 2B census; the Review Basis field (empty for every row).

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 30 September 2026 (batch-03 item 03.5). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Change to describe methodology design rather than current practice, e.g. “This is our living methodology: how the framework is intended to assess tools, how scores may change, and the integrity record.”

---

### 02.2 — Review practice

**Appears on 1 surface:** `/safety-methodology`


**Claim, as rendered:**

> How We Score The Promptly Score Methodology.


**Why this is flagged:** Asserts that a review was or is carried out. Phase 2B found the provenance for this does not exist: reviewer initials and methodology version are build constants and 0 of 252 rows record a Review Basis.

**Check it against:** Phase 2B census; the Review Basis field (empty for every row).

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 1 October 2026.*

**Status:** Applied 2 Oct 2026. `/safety-methodology` now reads "The methodology, as designed · How the Promptly Score methodology is designed to work." Verified in the rendered DOM.

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Use wording that describes the methodology rather than implying the current scoring process is operating, e.g. “How the Promptly Score methodology is designed to work.”

---

### 02.3 — Review practice

**Appears on 1 surface:** `/safety-methodology`


**Claim, as rendered:**

> If there’s an AI tool being used in UK schools that isn’t yet on GetPromptly, let us know and we’ll add it to the review queue.


**Why this is flagged:** Asserts that a review was or is carried out. Phase 2B found the provenance for this does not exist: reviewer initials and methodology version are build constants and 0 of 252 rows record a Review Basis.

**Check it against:** Phase 2B census; the Review Basis field (empty for every row).

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 30 September 2026 (batch-03 item 03.4). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Replace “review queue” with neutral wording such as “research queue” or “assessment queue” until the governed review process is operating.

---

### 02.4 — Review practice

**Appears on 1 surface:** `/safety-methodology`


**Claim, as rendered:**

> Read DfE AI guidance → UK GDPR & Data Protection Act 2018 Under the methodology, tools are assessed against UK GDPR as enforced by the ICO, with particular attention to Article 8 (children’s data), data residency, and processor agreements.


**Why this is flagged:** Asserts that a review was or is carried out. Phase 2B found the provenance for this does not exist: reviewer initials and methodology version are build constants and 0 of 252 rows record a Review Basis.

**Check it against:** Phase 2B census; the Review Basis field (empty for every row).

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 30 September 2026 (batch-03 item 03.6). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Change from a current-practice claim to methodology design, e.g. “The methodology is designed to assess tools against UK GDPR as enforced by the ICO…”

---

### 02.5 — Review practice

**Appears on 1 surface:** `/safety-methodology`


**Claim, as rendered:**

> Two numbers, not one The score, and how sure we are of it Promptly Score Reflects what we can verify about a tool against the five pillars.


**Why this is flagged:** Asserts that a review was or is carried out. Phase 2B found the provenance for this does not exist: reviewer initials and methodology version are build constants and 0 of 252 rows record a Review Basis.

**Check it against:** Phase 2B census; the Review Basis field (empty for every row).

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 30 September 2026 (batch-03 item 03.7). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Describe intended meaning rather than current verification, e.g. “The Promptly Score is intended to reflect what can be verified about a tool against the five pillars.”

---

### 02.6 — Named reviewer / role

**Appears on 2 surfaces:** `/methodology`, `/methodology (Ask Luna open)`


**Claim, as rendered:**

> A receipt records the methodology version, the verification date and the reviewer of a score, and our own rule refuses to issue one without them — so no receipt is issued until a score carries a recorded review.


**Why this is flagged:** Attributes a review to a named person or role. Reviewer attribution is a build constant, not a record.

**Check it against:** Phase 2B: reviewer initials are hard-coded; no per-tool reviewer is stored.

**Decision:** `KEEP`  
*Adjudicated by the Founder on 30 September 2026 (batch-03 item 03.9). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Keep as written. This describes the fail-closed receipt rule and explicitly states that no receipt is issued until methodology version, verification date and reviewer are actually recorded.

---

### 02.7 — Named reviewer / role

**Appears on 2 surfaces:** `/methodology`, `/methodology (Ask Luna open)`


**Claim, as rendered:**

> Live scores carry a v2.2 label but no recorded v2.2 review — see the notice above. v2.0 03 Feb 2026 Moved to the five-pillar model: data privacy, safeguarding, age suitability, transparency, and accessibility. § 02 The record Integrity record Score changes and withdrawals, with the reason and reviewer for each.


**Why this is flagged:** Attributes a review to a named person or role. Reviewer attribution is a build constant, not a record.

**Check it against:** Phase 2B: reviewer initials are hard-coded; no per-tool reviewer is stored.

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 30 September 2026 (batch-03 item 03.11). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Keep the integrity-record concept but remove “reviewer for each” unless a genuine per-item reviewer is recorded.

---

### 02.8 — Named reviewer / role

**Appears on 1 surface:** `/safety-methodology`


**Claim, as rendered:**

> A review under the methodology also records how much evidence it rests on, as a separate Evidence Confidence rating. 6 A score reviewed under the methodology is published with its methodology version, the reviewer and the date it was verified, and is re-checked on any significant product change.


**Why this is flagged:** Attributes a review to a named person or role. Reviewer attribution is a build constant, not a record.

**Check it against:** Phase 2B: reviewer initials are hard-coded; no per-tool reviewer is stored.

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 30 September 2026 (batch-03 item 03.10). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Keep the methodology design intent but remove the implication that this recurring review practice is currently operating. Phrase as what a governed review would record/publish, not what is currently done.

---

### 02.9 — Cadence / currency

**Appears on 1 surface:** `/ai-training/parents`


**Claim, as rendered:**

> Their AI guide for parents is practical, up to date and free.


**Why this is flagged:** Asserts a recurring review or refresh schedule. No re-review cadence is operating: calibration is blocked (GOV-GAP-001) and no re-review has been carried out.

**Check it against:** GOV-GAP-001; the containment notice; the June 2026 integrity record.

**Decision:** `NEEDS EVIDENCE`  
*Adjudicated by the Founder on 30 September 2026 (batch-04 item 04.2). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Provide a recorded currentness/refresh basis for the claim that the guide is “up to date”. If no current check exists, remove or soften that wording.

---

### 02.10 — Coverage / universality

**Appears on 7 surfaces:** `/admin`, `/parents`, `/school-leaders`, `/senco`, `/senco (Ask Luna open)`, `/students` and 1 more

**6 variants share this claim** — one decision covers all of them. They carry the same flagged wording; the rest of the sentence may differ.

**Claim, as rendered:**

> View all tools → Training path AI training for SENCOs.

**The most different of the 6:**

> view all tools training path ai training for school admin

**Why this is flagged:** A universal claim about the whole set. Check the counts and the exceptions: round 21 found "96 independently assessed products" on a page badging 25 of them "Needs Review".

**Check it against:** The underlying data counts and any status flags on the same surface.

**Decision:** `KEEP`  
*Adjudicated by the Founder on 1 October 2026.*

**Status:** Recorded 2 Oct 2026: KEEP actioned — no change made. Stale counts in surrounding copy were repaired separately as factual fixes, per the Founder's note.

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Keep as written. This is ordinary navigation to a role-specific training path, not a claim that the whole set has been reviewed or verified.

---

### 02.11 — Coverage / universality

**Appears on 3 surfaces:** `/`, `/ (Ask Luna open)`, `/ (email modal open)`


**Claim, as rendered:**

> Lesson plans Marking Differentiation CPD See Teacher guidance → Browse the tools directory → Top tools for Teachers 01 MagicSchool 02 Curipod 03 Canva AI View all tools → How it works GetPromptly guides you end to end.


**Why this is flagged:** A universal claim about the whole set. Check the counts and the exceptions: round 21 found "96 independently assessed products" on a page badging 25 of them "Needs Review".

**Check it against:** The underlying data counts and any status flags on the same surface.

**Decision:** `CHANGE`  
*Adjudicated by the Founder on 30 September 2026 (batch-04 item 04.5). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Keep the navigation wording, but replace “GetPromptly guides you end to end” with something concrete, e.g. “GetPromptly helps you discover tools, understand the evidence available, and find practical guidance for use.”

---

### 02.12 — Coverage / universality

**Appears on 3 surfaces:** `/ai-training`, `/training`, `/training (Ask Luna open)`


**Claim, as rendered:**

> Teachers Parents Students SEND Leaders Admin All Resources Browse all 76 training resources All Free Paid All Teacher SENCO School Leader Parent Student Showing 76 of 76 resources AI Skills Hub UK Government · Free Central UK AI learning hub from government.


**Why this is flagged:** A universal claim about the whole set. Check the counts and the exceptions: round 21 found "96 independently assessed products" on a page badging 25 of them "Needs Review".

**Check it against:** The underlying data counts and any status flags on the same surface.

**Decision:** `NEEDS EVIDENCE`  
*Adjudicated by the Founder on 30 September 2026 (batch-04 item 04.6). Carried forward — no action needed unless you want to revise it.*

**If CHANGE or NEEDS EVIDENCE — what it should say, or what would settle it:**

> Verify the current dataset count and that “76 of 76” accurately represents the complete training-resource set.

---

