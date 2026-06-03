# Top 25 Tools — Reviewer Evidence Audit (v2.2)

Publicly available evidence collected by desk research on **2026-06-03**, mapped to the five v2.2 pillars. Every finding cites the vendor source it was verified from; `EVIDENCE NOT AVAILABLE` means the document could not be found or could not be fetched/verified. **No facts invented. No tool scored.** All records are **Desk Review** basis and **Human review required** (vendor self-assertions, not behaviourally tested).

> Source of truth for the standard: `~/Documents/methodology`. "Current score" is the live v1-style baseline only, not v2.2.

---

## ChatGPT
**Category:** Teacher Productivity · **Current Promptly Score (live baseline, not v2.2):** 6.8

- **Safeguarding evidence:** Usage Policies prohibit CSAM & sexualisation of under-18s, reporting to NCMEC (openai.com/policies/usage-policies; openai.com/index/combating-online-child-sexual-exploitation-abuse)
- **Data Privacy evidence:** Trust Portal lists SOC2 Type2, ISO 27001/27017/27018/27701, GDPR/CCPA; DPA gated behind registration (trust.openai.com)
- **Age Suitability evidence:** Terms: min age 13 (or local min), under-18 need parent/guardian permission (openai.com/policies/row-terms-of-use) — page 403, corroborated via search only
- **Accessibility evidence:** Trust Portal lists a VPAT (trust.openai.com) — WCAG levels not readable
- **Transparency evidence:** OpenAI Model Spec published, dated 2025-12-18 (model-spec.openai.com/2025-12-18.html)
- **Missing evidence:** Privacy Policy & Terms could not be directly fetched (HTTP 403); VPAT WCAG levels/dates unread; no education-specific safeguarding doc
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Read the actual Privacy Policy, Terms and Trust Portal VPAT; confirm age wording, training/retention, WCAG levels; hands-on test teen safeguards

## Gemini
**Category:** Teacher Productivity · **Current Promptly Score (live baseline, not v2.2):** 7.1

- **Safeguarding evidence:** Gemini policy guidelines prohibit CSAM, self-harm instructions, sexual/violent content; stricter policies for younger users (gemini.google/policy-guidelines)
- **Data Privacy evidence:** Gemini Apps Privacy Hub: prompt/file collection, configurable auto-delete, human-reviewed chats kept up to 3yrs disconnected from account (support.google.com/gemini/answer/13594961)
- **Age Suitability evidence:** Age-gated features (18+ for some), parent-managed under-13 via Family Link; no single general minimum age stated (support.google.com/gemini/answer/13594961)
- **Accessibility evidence:** 'Gemini in Workspace' Accessibility Conformance Report (VPAT) vs WCAG 2.0/2.1, Section 508, EN 301 549 (services.google.com/fh/files/misc/google_gemini_in_workspace_vpat.pdf) — covers Workspace, not consumer app
- **Transparency evidence:** Policy guidelines acknowledge probabilistic output/errors, document limitations & reporting (gemini.google/policy-guidelines)
- **Missing evidence:** No clear consumer-Gemini minimum age; VPAT may not cover the consumer app; underlying model-card/version not located
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium-High
- **Human review required:** Yes — Confirm consumer-app minimum age and whether the Workspace VPAT applies to the deployed product; hands-on accessibility test

## Microsoft Copilot
**Category:** Teacher Productivity · **Current Promptly Score (live baseline, not v2.2):** 8.3

- **Safeguarding evidence:** M365 Copilot Chat docs describe Responsible AI safety checks on every prompt/response (learn.microsoft.com/copilot/privacy-and-protections)
- **Data Privacy evidence:** Copilot Chat processed within M365 service boundary under enterprise data protection; not used to train foundation models; GDPR + EU Data Boundary (learn.microsoft.com/copilot/privacy-and-protections)
- **Age Suitability evidence:** EVIDENCE NOT AVAILABLE (minimum age not directly verified; under-18 signed-in users excluded from some data uses per search)
- **Accessibility evidence:** Microsoft publishes ACRs vs WCAG/508/EN 301 549 but no Copilot-specific ACR found on the page (microsoft.com/accessibility/conformance-reports)
- **Transparency evidence:** Doc describes architecture (orchestrator, Bing grounding, LLM, logging) and shows generated search queries via citations (learn.microsoft.com/copilot/privacy-and-protections)
- **Missing evidence:** Copilot-specific ACR/VPAT not located; explicit consumer minimum age/terms unverified; doc covers enterprise M365 Copilot Chat, not free consumer Copilot
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Locate Copilot-specific ACR; confirm consumer-Copilot minimum age/terms; distinguish consumer vs enterprise Copilot for schools

## Claude
**Category:** Teacher Productivity · **Current Promptly Score (live baseline, not v2.2):** 6.8

- **Safeguarding evidence:** AUP prohibits AI CSAM, minor grooming, sextortion, sexualisation of minors (under-18); guidelines for orgs serving minors require age verification, filtering, AI disclosure (anthropic.com/legal/aup; support.claude.com/en/articles/9307344)
- **Data Privacy evidence:** Consumer Privacy Policy (eff. 2026-01-12): not directed at under-18s, model-training opt-out with safety exceptions, deletion on request; Trust Center holds SOC2/ISO 27001/ISO 42001 (anthropic.com/legal/privacy; trust.anthropic.com)
- **Age Suitability evidence:** Privacy Policy: Services not directed to and do not knowingly collect data from under-18s (anthropic.com/legal/privacy)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE (claude.ai VPAT appears NDA-gated; no publicly readable WCAG report)
- **Transparency evidence:** Transparency Hub publishes per-model reports/system cards: capabilities, cutoffs, training, safety evals (anthropic.com/transparency)
- **Missing evidence:** No publicly accessible accessibility report (VPAT NDA-gated); Trust Center contents not directly fetchable (search-corroborated)
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** High (acc: Low)
- **Human review required:** Yes — Request the claude.ai VPAT; confirm Trust Center certs directly; note the 18+ floor makes direct pupil use unsuitable without an intermediary

## MagicSchool.ai
**Category:** Teaching & Learning · **Current Promptly Score (live baseline, not v2.2):** 9.2

- **Safeguarding evidence:** Safety & Privacy page: content moderation, output monitoring, flagging/audit, admin dashboards, role-based access for age-appropriate student use (magicschool.ai/ai-policy/safety-and-privacy)
- **Data Privacy evidence:** Student Data Policy: service-provider under COPPA school-consent, schools are controllers, data minimisation, zero data retention with AI providers (no training/reuse); FERPA/COPPA/SOC2/GDPR badges (magicschool.ai/privacy-security/student-data-policy; magicschool.ai/privacy)
- **Age Suitability evidence:** Access via schools under COPPA; age-appropriate safety features + DPIAs rather than a self-serve minimum age (magicschool.ai/privacy-security/student-data-policy)
- **Accessibility evidence:** Publishes a VPAT/ACR (Dec 2025) stating WCAG AA with recurring remediations (magicschool.ai/blog-posts/accessibility-in-education)
- **Transparency evidence:** States it communicates which models it uses & how data is handled, but the page does not name the underlying LLMs (magicschool.ai/ai-policy/safety-and-privacy)
- **Missing evidence:** Actual VPAT not opened (exact WCAG version/criteria unconfirmed); underlying LLM subprocessors not enumerated; full UK/GDPR DPA terms unread (US FERPA/COPPA framing)
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** High
- **Human review required:** Yes — Open the VPAT for WCAG version/level; verify named LLM subprocessors + zero-retention terms; confirm UK/GDPR DPA availability. (Calibration anchor — only tool with real sub-scores.)

## Canva
**Category:** Curriculum & Content Creation · **Current Promptly Score (live baseline, not v2.2):** 9.3

- **Safeguarding evidence:** Canva Education: no ads to education users, no student content used for AI training, students invited by teacher/admin (canva.com/policies/privacy-policy)
- **Data Privacy evidence:** Privacy Policy + separate Data Processing Addendum; Canva acts as processor on documented instructions (canva.com/policies/privacy-policy; canva.com/policies/data-processing-addendum)
- **Age Suitability evidence:** Child = under 13 (or higher local age); service not directed at children, no self sign-up; supervised Canva Education exception needs parental/institutional consent (canva.com/policies/privacy-policy)
- **Accessibility evidence:** VPAT/ACR vs WCAG 2.1 A/AA/AAA (PDF metadata dated 2021-07-05) (content-management-files.canva.com/.../VPAT2.4WCAGCanva.pdf)
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (Magic Studio safety help + trust/education pages returned 403; no model/version disclosure confirmed)
- **Missing evidence:** Could not fetch Trust Centre/education page, full DPA, or AI model transparency (all 403); current WCAG 2.2 VPAT unverified
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Verify current Canva for Education DPA, UK/EU residency, latest VPAT version, and how Canva AI (Magic Studio) processes student inputs and discloses models

## Google Classroom
**Category:** Administration & Operations · **Current Promptly Score (live baseline, not v2.2):** 9.7

- **Safeguarding evidence:** Workspace for Education: services without explicit control set to Restricted for under-18s; schools must identify under-18 users; parental consent for Additional/third-party services (support.google.com/edu/classroom/answer/11081157; workspaceupdates.googleblog.com 2025/03)
- **Data Privacy evidence:** Education Privacy Notice: Google processes core-services data per the school's instructions; no ads in core services; no core-service data used for advertising (workspace.google.com/terms/education_privacy)
- **Age Suitability evidence:** Children 13 and under should use Classroom only with a Workspace for Education account; each country sets its own min Google Account age (support.google.com/edu/classroom/answer/7582372)
- **Accessibility evidence:** Google Classroom (Web) ACR/VPAT, PDF titled 'October 2025', assessed vs WCAG 2.2 A & AA (services.google.com/fh/files/misc/google_classroom_web_vpat.pdf)
- **Transparency evidence:** Privacy Notice enumerates core services (Classroom, Gemini for Education, NotebookLM) and explains processor role/data handling (workspace.google.com/terms/education_privacy)
- **Missing evidence:** WCAG details inferred from PDF metadata (body not machine-readable); Cloud DPA full text & FERPA/COPPA commitments not directly fetched from a Google legal page
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Confirm Classroom VPAT level/date from report body; verify CDPA terms, UK residency/transfer mechanism, and AI (Gemini) governance for under-18 education users

## Kooth
**Category:** Pastoral, Behaviour & Wellbeing · **Current Promptly Score (live baseline, not v2.2):** 9.8

- **Safeguarding evidence:** States it pre-moderates 'every single word', never publishes self-harm/suicide methods, age-gates content (10-12/13-15/16-17/18+), moderators NHS-aligned (connect.kooth.com/safety-and-governance)
- **Data Privacy evidence:** Kooth named data controller (London W2 1AY), lists 7 GDPR rights, minimal data (month/year of birth, org), data will not identify/trace a user (explore.kooth.com/privacy-policy-2)
- **Age Suitability evidence:** Content age-gated into four bands (10-12, 13-15, 16-17, 18+) (connect.kooth.com/safety-and-governance)
- **Accessibility evidence:** Accessibility statement exists (student.kooth.com/accessibility) but WCAG version/conformance EVIDENCE NOT AVAILABLE (page returned empty on fetch)
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (moderated human-support service; no AI/model 'how it works' disclosure located — likely N/A)
- **Missing evidence:** Accessibility WCAG level unverified; no formal DPA page; no clinical accreditation (BACP) page; age eligibility varies by commissioner
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Verify accessibility WCAG conformance; obtain commissioning DPA; confirm clinical governance/accreditations; check UK age eligibility for the commissioned area

## CPOMS
**Category:** Administration & Operations · **Current Promptly Score (live baseline, not v2.2):** 9.3

- **Safeguarding evidence:** Safeguarding/pastoral record-management software (its core purpose); on UK G-Cloud as 'CPOMS Engage' for safeguarding/pastoral/wellbeing (cpoms.co.uk/cpoms-safeguarding-software; applytosupply.digitalmarketplace.service.gov.uk)
- **Data Privacy evidence:** ISO 27001-aligned, AES-256 at rest, TLS in transit, 24/7 SOC, annual pen testing, MFA, NCSC Cyber Essentials, G-Cloud 14; data never sold/shared without consent (cpoms.co.uk/cpoms-data-security-and-compliance)
- **Age Suitability evidence:** EVIDENCE NOT AVAILABLE (staff-facing safeguarding records system, not a child-facing account product; no minimum-age policy — legitimately N/A with justification)
- **Accessibility evidence:** Accessibility statement references WCAG 2.1 via a UserWay widget; no stated conformance level; acknowledges some content not fully adapted (cpoms.co.uk/accessibility-statement)
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (record-keeping software; no AI/automated-decision system — legitimately N/A)
- **Missing evidence:** Controller/processor roles & UK-only residency not explicit on the security page; no published DPA text; app-specific (vs marketing-site) accessibility conformance unverified
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Obtain DPA & privacy policy; confirm processor role + UK residency in contract; verify accessibility conformance for the actual application (not the website widget)

## ClassDojo
**Category:** Parent Communication · **Current Promptly Score (live baseline, not v2.2):** 9.4

- **Safeguarding evidence:** Dojo Islands: players communicate only via pre-authored phrases/emojis, no custom text; Global Playground names temporary/random, not linked to real identity (classdojo.com/privacy)
- **Data Privacy evidence:** iKeepSafe COPPA Safe Harbor + FERPA certification; student/child info never used/disclosed for third-party advertising; never sell/rent personal info (classdojo.com/privacy)
- **Age Suitability evidence:** Distinguishes under-13 from teens 13-16; verifiable parental (or teacher-as-school-agent) consent before collecting a child's info; data minimisation (classdojo.com/privacy)
- **Accessibility evidence:** Independent ACR by Level Access vs WCAG 2.2 A & AA, dated 2025-04-09 (essential.classdojo.com/.../ClassDojo.com---ACR---WCAG-2.2-A_AA...pdf); statement targets WCAG 2.1 AA (classdojo.com/accessibility)
- **Transparency evidence:** Transparency page: data on AWS/MongoDB in US, TLS 1.2/AES-256, EU-US DPF, named sub-processors, retention, 'inferences' for product improvement (classdojo.com/transparency)
- **Missing evidence:** 'Parent AI Transparency Note' help article returned 403; specific AI features/models/providers not confirmed from a fetched source
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** High
- **Human review required:** Yes — Verify the blocked AI Transparency Note; confirm which AI features process children's data and on what model; assess US data transfer (DPF) under UK GDPR

## SchoolAI
**Category:** Student Study Tools · **Current Promptly Score (live baseline, not v2.2):** 8.1

- **Safeguarding evidence:** Student-safety page: AI assistant 'Dot' will not create harmful content involving minors, will not act like a human friend, won't put engagement ahead of wellbeing (schoolai.com/trust/student-safety)
- **Data Privacy evidence:** States OpenAI/other providers do not use PII/conversations for model training; FERPA/COPPA; Trust Center shows SOC2 Type2, FERPA, COPPA, 1EdTech (schoolai.com/privacy; schoolai.com/data-security)
- **Age Suitability evidence:** Privacy policy: deletes data if collected from a child under 13 without parental consent; ToS has no explicit minimum-age clause (schoolai.com/privacy; schoolai.com/terms)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE (no accessibility statement/VPAT; schoolai.com/trust/accessibility returns 404)
- **Transparency evidence:** Names OpenAI/AI providers; confirms data not used for their training; no public model card/version (schoolai.com/privacy)
- **Missing evidence:** No accessibility/VPAT; no model card; DPA/SOC2 gated (request-only)
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Student-facing AI: verify gated DPA/SOC2; confirm whether any accessibility doc exists; HANDS-ON test moderation/crisis-alert behaviour + age-appropriate controls before any score

## Khanmigo
**Category:** Student Study Tools · **Current Promptly Score (live baseline, not v2.2):** 6.9

- **Safeguarding evidence:** Uses moderation tech to detect inappropriate/harmful interactions, limits daily AI use, uses red-teaming (blog.khanacademy.org/aiguidelines)
- **Data Privacy evidence:** Uses DPAs asserting FERPA/COPPA/PPRA; LLMs not trained on student data (main privacy page is JS-rendered, not directly fetchable — khanacademy.org/about/privacy-policy)
- **Age Suitability evidence:** Terms: US users >=13 or local consent age, or school/teacher/parent approval; teachers 18+ (ToS not directly fetchable, search-verified)
- **Accessibility evidence:** States WCAG 2.2 AA development baseline, yearly VPATs/ACRs, annual third-party audits (blog.khanacademy.org/ada-title-ii-and-digital-accessibility...)
- **Transparency evidence:** AI guidelines describe red-teaming, monitoring, communicating AI risks/limitations; documented elsewhere as OpenAI GPT-powered but no first-party model-naming page (blog.khanacademy.org/aiguidelines)
- **Missing evidence:** Could not directly fetch privacy policy/ToS (JS-rendered) or Khanmigo safety support article (403); no first-party model card; no published transparency report
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Student-facing AI tutor: directly verify live privacy policy & ToS (age 13, no-LLM-training); confirm first-party model/version disclosure; HANDS-ON test moderation + parent/teacher visibility

## Sparx Maths
**Category:** Student Study Tools · **Current Promptly Score (live baseline, not v2.2):** 9.6

- **Safeguarding evidence:** EVIDENCE NOT AVAILABLE (no dedicated safeguarding/moderation policy; structured homework, no open student chat, students cannot raise tickets — support.sparxmaths.com/.../342285)
- **Data Privacy evidence:** Binding UK GDPR-compliant data processing contracts with support companies; data in EEA with SCCs/UK addendum/IDTAs; never share school data without written permission (support.sparxmaths.com/.../345062)
- **Age Suitability evidence:** Confirms adherence to the ICO Age Appropriate Design Code (Children's Code) (support.sparxmaths.com/.../342286)
- **Accessibility evidence:** Approach page lists keyboard nav, zoom, colour overlays, captions, OpenDyslexic font, screen-reader compatibility, per-student accommodations; no WCAG level stated (support.sparxmaths.com/.../342331)
- **Transparency evidence:** Sparx data prohibited for training 3rd-party AI; AI only summarises/categorises teacher support tickets via gated GDPR API, staff-reviewed (support.sparxmaths.com/.../342285)
- **Missing evidence:** No explicit WCAG level/VPAT; no dedicated safeguarding policy; main T&Cs PDF + sparxlearning.co.uk privacy policy not fetchable (403/TLS error)
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium-High
- **Human review required:** Yes — Obtain full T&Cs + DPA; confirm WCAG level via audit; verify sub-processor/support-company list. (Safeguarding pillar cannot be N/A — needs a stated stance.)

## Seneca Learning
**Category:** Student Study Tools · **Current Promptly Score (live baseline, not v2.2):** 8.8

- **Safeguarding evidence:** EVIDENCE NOT AVAILABLE (no dedicated safeguarding/moderation policy; help note: students can leave a class to revoke access — help.senecalearning.com/.../2483304)
- **Data Privacy evidence:** GDPR-compliant; data stored in the EU (Dublin) with 256-bit AES; UK Cyber Essentials; ICO-registered; processor in school use, school is controller (help.senecalearning.com/.../2483304; senecalearning.com/en-GB/privacy)
- **Age Suitability evidence:** EVIDENCE NOT AVAILABLE (no explicit minimum-age statement in the reviewed privacy policy)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE (no accessibility statement/VPAT/WCAG located)
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (privacy policy references improving 'algorithms/models' but no model card/version/AI disclosure)
- **Missing evidence:** 4 of 5 pillars unverified incl. Safeguarding; encryption/Cyber Essentials sourced from help centre not the formal policy/DPA
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Low-Medium
- **Human review required:** Yes — Verify minimum age + child-data handling in live policy/DPA; confirm Cyber Essentials currency; locate any accessibility statement; clarify AI/adaptive models + training use

## Duolingo
**Category:** Student Study Tools · **Current Promptly Score (live baseline, not v2.2):** 9.1

- **Safeguarding evidence:** EVIDENCE NOT AVAILABLE (no first-party safeguarding/moderation policy fetched; child accounts restrict name/contact/photo — privacy-framed, not safeguarding)
- **Data Privacy evidence:** Treats 'Child Users' (under 13 US, or local digital-consent age) differently, collects bare-minimum info, requires parent email at first logout (main page JS-rendered, search-verified — duolingo.com/privacy)
- **Age Suitability evidence:** Standard accounts require >=13; under-13 use restricted Child accounts; Duolingo ABC for ages ~3-12 (duolingo.com/privacy; duolingo.com/abc-privacy — not directly fetchable)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE (no first-party accessibility statement with a WCAG claim located)
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (no first-party model card/system disclosure for AI features verified)
- **Missing evidence:** Main privacy policy, ABC policy & Schools compliance page not fetchable (JS/403); no accessibility statement; no AI transparency
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Low-Medium
- **Human review required:** Yes — Directly verify live privacy/ABC/Schools pages (age 13, COPPA, child-account restrictions); locate any accessibility statement; document the AI/GPT models behind Duolingo Max + data terms

## Texthelp Read&Write
**Category:** SEND & Inclusion · **Current Promptly Score (live baseline, not v2.2):** 9.5

- **Safeguarding evidence:** EVIDENCE NOT AVAILABLE (assistive-reading tool, not generative; no published safeguarding note verified)
- **Data Privacy evidence:** Publishes 'Privacy policy for Everway products'; Trust page asserts COPPA/FERPA/GDPR/ISO 27001/SOPPA (everway.com/privacy — Texthelp rebranded to Everway; texthelp.com/privacy 308-redirects)
- **Age Suitability evidence:** EVIDENCE NOT AVAILABLE (no minimum-age clause verified; education-distributed under school licence)
- **Accessibility evidence:** VPATs for Read&Write (Windows/Mac/Chrome) + stated WCAG 2.2 AA commitment (support.texthelp.com/help/texthelp-vpats; everway.com/about/accessibility)
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (rules/TTS/OCR-based; no model card/version verified; AI features not detailed)
- **Missing evidence:** Full product privacy policy text (only Google-Doc links surfaced); OCR/PDF retention; explicit minimum age; safeguarding stance; AI/model disclosure for newer AI features; Texthelp->Everway entity change
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Read the linked Everway/Texthelp product privacy doc + Read&Write VPAT in full; confirm OCR retention, residency, minimum age; verify rebrand doesn't change UK-school DPA. (Safeguarding cannot be N/A — needs a stance.)

## Immersive Reader
**Category:** SEND & Inclusion · **Current Promptly Score (live baseline, not v2.2):** 9.1

- **Safeguarding evidence:** EVIDENCE NOT AVAILABLE (reading-comprehension renderer, not generative; no product-specific child-safety doc)
- **Data Privacy evidence:** Microsoft Learn: 'Immersive reader doesn't store any customer data' (learn.microsoft.com/azure/ai-services/immersive-reader/overview)
- **Age Suitability evidence:** EVIDENCE NOT AVAILABLE (no product-specific minimum-age statement; governed by broader Microsoft/Office/Azure terms)
- **Accessibility evidence:** Microsoft publishes ACRs/VPATs vs WCAG A/AA, 508, EN 301 549; Immersive Reader described as inclusively designed (microsoft.com/accessibility/conformance-reports; learn.microsoft.com/.../immersive-reader/overview)
- **Transparency evidence:** Learn doc explains it's a web app in an iframe whose backend processes parts of speech, TTS, translation (learn.microsoft.com/.../immersive-reader/overview)
- **Missing evidence:** Product-specific ACR/VPAT (vs general portal); which Microsoft privacy/DPA terms apply to the deployment surface (Edge/Word/Teams vs Azure); explicit minimum age
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Read the ACR for the deployment surface; confirm applicable privacy/DPA terms for UK schools; verify 'no data stored' for the relevant surface. (Safeguarding cannot be N/A — needs a stance.)

## Goblin Tools
**Category:** SEND & Inclusion · **Current Promptly Score (live baseline, not v2.2):** 9.0

- **Safeguarding evidence:** EVIDENCE NOT AVAILABLE (no child-safety/moderation policy; only a general accuracy disclaimer)
- **Data Privacy evidence:** Privacy policy: collects 'the bare minimum'; input to OpenAI cannot be linked back — neither Goblin nor OpenAI gets who/where submitted (goblin.tools/Privacy)
- **Age Suitability evidence:** Privacy policy: service does not address anyone under 18 and does not knowingly collect under-18 data — an 18+ self-declared stance, not child-safe design (goblin.tools/Privacy)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE (no accessibility statement/VPAT/WCAG claim)
- **Transparency evidence:** About page: AI models from different providers (open & closed source); outputs are 'guesswork', not statements of truth (goblin.tools/About; goblin.tools/Privacy)
- **Missing evidence:** Data retention; named subprocessors beyond OpenAI; any accessibility doc; specific model/version; any institutional DPA. 18+ scope significant for pupil deployment
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Confirm 18+ scope vs actual pupil use; test what data the web tool transmits; confirm absence of any DPA; assess output safety/age-appropriateness hands-on

## Diffit
**Category:** Teaching & Learning · **Current Promptly Score (live baseline, not v2.2):** 8.7

- **Safeguarding evidence:** EVIDENCE NOT AVAILABLE as a standalone doc; but privacy policy states 'We do not collect ANY student data', reducing pupil-data exposure (web.diffit.me/privacy)
- **Data Privacy evidence:** Collects only teacher names/emails/IPs; FERPA & COPPA compliant; National Data Privacy Agreement signatory; encrypts in transit/at rest; annual independent pen testing (web.diffit.me/privacy)
- **Age Suitability evidence:** ToS require users 18+ and a teacher/admin using it for instructional purposes (web.diffit.me/terms-of-service)
- **Accessibility evidence:** Help-centre statement reports WCAG 2.1 AA + VPAT on request (weloveteachers@diffit.me) (support.diffit.me/.../37675797544717) — page 403, corroborated across two searches
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (ToS do not disclose the underlying model; only an accuracy disclaimer)
- **Missing evidence:** Direct confirmation of WCAG statement (page blocked); the VPAT (request-only); model/version disclosure; UK data residency (policy states US processing)
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium-High
- **Human review required:** Yes — Obtain & read the VPAT/accessibility statement directly; confirm US-residency vs UK GDPR; confirm no student data in practice; identify the underlying model for transparency

## Curipod
**Category:** Classroom Management · **Current Promptly Score (live baseline, not v2.2):** 8.0

- **Safeguarding evidence:** 'Safe AI in Curipod': every AI interaction teacher-initiated, structured, limited in scope; references a Moderation Tool; never uses teacher/student data to train models (curipod.com/c/safe-ai-in-curipod)
- **Data Privacy evidence:** Help centre: GDPR/FERPA/COPPA compliant; never uses student data commercially; signed DPAs on request (eirik@curipod.com) (help.curipod.com/.../6-is-curipod-gdpr-ferpa-and-coppa-compliant)
- **Age Suitability evidence:** EVIDENCE NOT AVAILABLE from a verified Curipod page (main terms/privacy JS-rendered); third-party Common Sense rates 68% Pass, flags parental-consent at 50% (privacy.commonsense.org/privacy-report/Curipod)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE (curipod.com/accessibility returned no content; no WCAG level verifiable)
- **Transparency evidence:** 'Safe AI' page names model families: OpenAI (o3, gpt-5, gpt-4o, gpt-4o-mini, gpt-image), Google Gemini (gemini-3-pro/flash), Ideogram, Stable Diffusion (curipod.com/c/safe-ai-in-curipod)
- **Missing evidence:** Verified full privacy policy/terms text (JS-rendered); explicit minimum age + consent model; verifiable accessibility/WCAG; confirmation of EU storage from the live policy
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Load JS-rendered privacy/terms/accessibility pages in a browser to verify age, residency, consent, WCAG; obtain signed UK GDPR DPA; hands-on test the moderation tool

## Century Tech
**Category:** Student Study Tools · **Current Promptly Score (live baseline, not v2.2):** 9.0

- **Safeguarding evidence:** Privacy Notice (eff. 2026-05-01): collects data to fulfil security & safeguarding responsibilities; schools must ensure generative-AI parts accessed only by age-appropriate students (century.tech/.../CENTURY-Tech-Privacy-Notice_010526.pdf)
- **Data Privacy evidence:** Privacy Notice: when accessed via a school, the school is Data Controller and Century is Data Processor with no independent rights (century.tech/.../CENTURY-Tech-Privacy-Notice_010526.pdf)
- **Age Suitability evidence:** Privacy Notice places responsibility on the school/teacher to ensure generative-AI parts accessed only by age-appropriate students (century.tech/.../CENTURY-Tech-Privacy-Notice_010526.pdf)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE
- **Transparency evidence:** Privacy Notice: AI for next-task recommendations & marking long-form work; models on secure private cloud; personal data not used to train AI; training data anonymised (century.tech/.../CENTURY-Tech-Privacy-Notice_010526.pdf)
- **Missing evidence:** No accessibility statement/VPAT/WCAG; no published DPA/sub-processor list; no SOC2/ISO 27001 cert or named model cards verified
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Confirm accessibility conformance (WCAG/VPAT); obtain DPA + sub-processor list; hands-on test the generative-AI marking feature + age-gating

## Satchel One
**Category:** Administration & Operations · **Current Promptly Score (live baseline, not v2.2):** 8.5

- **Safeguarding evidence:** Publishes a safeguarding framework (students, parents, tutors, teachers, schools); 2FA, regular access reviews, staff background checks (teamsatchel.com/security.html)
- **Data Privacy evidence:** DBS checks on staff with data access; data on AWS in Ireland/EEA with SHA256/RSA-2048; updated GDPR-compliant data-sharing agreement (help.satchelone.com/.../2904595-satchel-and-gdpr-compliance)
- **Age Suitability evidence:** EVIDENCE NOT AVAILABLE (no explicit minimum-age clause on a verified page; AWS region stated as UK on security page vs Ireland in GDPR help — discrepancy)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (primarily an MIS/homework platform; model disclosure may not apply)
- **Missing evidence:** No verified Terms/minimum-age page; no accessibility statement/VPAT; AWS hosting region conflict (UK vs Ireland) needs vendor clarification
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Obtain Terms + explicit minimum-age policy; reconcile the AWS hosting-region discrepancy; confirm whether any accessibility statement exists

## Brisk Teaching
**Category:** Assessment & Feedback · **Current Promptly Score (live baseline, not v2.2):** 8.4

- **Safeguarding evidence:** Student Data Privacy Addendum: reasonable admin/physical/technical safeguards, treat Student Data as confidential; 'custom guardrails' for student-facing Boost (briskteaching.com/privacy/student-data-privacy-addendum)
- **Data Privacy evidence:** SOC2 compliant; 1EdTech Data Privacy Certification & TrustEd Apps Seal; encrypts in transit/at rest; doesn't use student/teacher data to train AI (briskteaching.com/privacy/privacy-center)
- **Age Suitability evidence:** Terms: users 18+ or with parent/educational-institution permission; DPA authorises under-13 collection only under school direction (briskteaching.com/privacy/terms; .../student-data-privacy-addendum)
- **Accessibility evidence:** EVIDENCE NOT AVAILABLE
- **Transparency evidence:** Security FAQ: uses a range of LLMs, Boost uses a cloud-hosted LLM, no specific model/provider named; user input not used to train models (briskteaching.com/privacy/security-faqs)
- **Missing evidence:** No accessibility statement/VPAT/WCAG; specific AI model names/version not published; student-facing Boost moderation policy not detailed publicly
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** Medium
- **Human review required:** Yes — Verify accessibility conformance; press vendor for named models/version; hands-on test Brisk Boost guardrails + moderation with student inputs

## Quizizz
**Category:** Assessment & Feedback · **Current Promptly Score (live baseline, not v2.2):** 8.5

- **Safeguarding evidence:** Privacy Center: respects consent of under-13s; parents can manage/delete a child's account; students can use without accounts/PII unless required (wayground.com/home/privacy-center; help.wayground.com/.../158000404026)
- **Data Privacy evidence:** ISO/IEC 27001:2022 certified; industry-standard encryption in transit & at rest; FERPA/COPPA/GDPR; access-controlled AWS data centres, 24/7 monitoring (wayground.com/home/privacy-center)
- **Age Suitability evidence:** Privacy Center respects consent of under-13s; parents/guardians manage & delete under-13 accounts (wayground.com/home/privacy-center)
- **Accessibility evidence:** Accessibility & Inclusion Statement claims WCAG 2.1 A/AA + 2.2 A/AA, completed VPAT (on request), 25+ accessibility features (help.wayground.com/.../158000404015)
- **Transparency evidence:** Wayground AI combines GPT-5 with classroom-tested activities; teacher-only access, zero student data in AI training; OpenAI does not use personal data for training (wayground.com/quizizz-ai; wayground.com/home/privacy-center)
- **Missing evidence:** VPAT/ACR is request-only (conformance unverified); no openly published DPA/sub-processor list; UK data-residency detail unconfirmed. Now rebranding Quizizz->Wayground
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** High
- **Human review required:** Yes — Inspect the actual VPAT/ACR; verify GPT-5 claim + OpenAI data-handling contractually; confirm UK data residency

## Kahoot!
**Category:** Assessment & Feedback · **Current Promptly Score (live baseline, not v2.2):** 8.9

- **Safeguarding evidence:** Privacy Notice: no third-party advertising in Services/App/Website; do not sell students' personal info; dedicated child-safety policy; child-account email usable only as password reminder (trust.kahoot.com/privacy-policy)
- **Data Privacy evidence:** Security Measures: AES-256 (or similar), TLS 1.2+, continuous third-party pen testing with annual reports; all sub-processors hold ISO 27001 + SOC2 Type2 (trust.kahoot.com/security-measures)
- **Age Suitability evidence:** Privacy Notice: 'Child' = under 13 (US) / under 16 (outside US); child email only for password reminders; GDPR/UK GDPR/FERPA/COPPA/SOPIPA (trust.kahoot.com/privacy-policy)
- **Accessibility evidence:** Inclusion & Accessibility Policy: aims to comply with WCAG 2.2 AA; ACR based on VPAT v2.5 (last modified 2025-01-23) (trust.kahoot.com/inclusion-accessibility-policy)
- **Transparency evidence:** EVIDENCE NOT AVAILABLE (no model card/named model/version disclosure for Kahoot's AI features on a verified page)
- **Missing evidence:** No AI model/system transparency for AI-generation features; VPAT/ACR document not directly fetched; Kahoot's own (vs sub-processors') ISO 27001 not explicitly confirmed
- **Review basis:** Desk Review (public documentation only)
- **Confidence level:** High
- **Human review required:** Yes — Locate/verify any AI model disclosure for Kahoot AI; inspect the actual VPAT/ACR; confirm Kahoot's own ISO 27001/SOC2 status

---

*Desk research only; Methodology v2.2. No evidence invented; no scores assigned; no live scores changed.*
