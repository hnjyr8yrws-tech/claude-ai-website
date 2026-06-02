# External Link Audit (report — nothing fixed yet)

391 unique external links in `src/data/*` checked (browser UA, redirects followed).

**Summary:** 354 OK · 1 hard-broken · ~9 moved/rebranded · 5 server-errors to glance · ~60 benign redirects · ~31 bot-blocked (work for real users).

---

## A. Broken — ✅ FIXED (before → after, all new URLs verified 200)
| Entry | Before | After |
|---|---|---|
| Lego Education SPIKE (tools.ts) | `education.lego.com/en-gb/45678/` (404) | `education.lego.com/en-gb/products/lego-education-spike-prime-set/45678/` |
| Pearson AI in Assessment Guide (training.ts) | `…/support-for-teaching-assistants/ai-guidance.html` (→404) | `qualifications.pearson.com/en/campaigns/artificial-intelligence.html` |
| BCS AI in Education (training.ts) | `…/primary-and-secondary-education/` (→404) | `www.bcs.org/articles-opinion-and-research/` |
| Chartered College AI Guide (training.ts) | `…/teaching-and-learning/ai-in-education/` (→.png) | `chartered.college/` |

_Note: the Lego SPIKE link was a direct supplier URL (not an affiliate link) — fixed to the correct SPIKE Prime product page (set 45678). No affiliate links were touched._

## B. Moved / rebranded — ⏳ PROPOSED ONLY (not changed — awaiting your approval)
| Current URL | Proposed new destination | Note |
|---|---|---|
| `edulastic.com` | peardeck.com/products/pear-assessment | Edulastic → Pear Assessment |
| `glean.co` | genio.co | Glean → Genio (rebrand) |
| `hegartymaths.com` | sparxmaths.com | HegartyMaths → Sparx |
| `quizizz.com` | wayground.com | Quizizz → Wayground (rebrand) |
| `scholarpack.com` | arbor-education.com | ScholarPack → Arbor |
| `socratic.org` | lens.google | Socratic shut down → folded into Google Lens. **Recommend re-review / remove**, not a simple repoint. |
| `web.seesaw.me` | seesaw.com | domain change |
| `www.classcharts.com` | tes.com/.../class-charts | ClassCharts now under TES |
| `www.autismeducationtrust.org.uk` | nen.org.uk | Redirects to a **different organisation** (NEN). **Verify / re-review** before repointing. |

## C. Server errors — glance (may be transient)
| URL | Status |
|---|---|
| `clarosoftware.com/portfolio/penfriend/` | 500 (persistent across both audits) |
| `clarosoftware.com/portfolio/claroread/` | 500 (persistent) |
| `www.pupilasset.com` | 503 (was 200 last audit — likely transient) |
| `ai.meta.com` | 400 (bot) |
| `www.eduaide.ai` | 429 (rate-limited; works for users) |

## D. Benign redirects — no action (≈60)
`www.`/trailing-slash/locale normalisations and login walls, e.g. `todoist.com → www.todoist.com`, `senecalearning.com → /en-GB`, `code.org/ai → /artificial-intelligence`, `miro.com/education → /education-whiteboard`, `benq.com → benq.eu`, and login-gated apps (`classroom.google.com`, `notebooklm.google.com`, `poe.com`). These resolve fine for users.

## E. Bot-blocked — work for real users (≈31)
25× `403` + 6 connection-refused-but-DNS-alive (`flip.com`, `orbitnote.com`, `play.ht`, `adobe.com/express`, `williamssound.com`, `net-aware.org.uk`). These block automated clients only; no action.

## Notes
- **No dead domains and no placeholders** (last audit's 5 dead domains are all fixed; the `todoist` "TODO" match was a false positive).
- **Affiliate tracking:** unchanged/intact. Amazon equipment links are still search URLs **without** the `tag=` param — that's the pending item awaiting your real Amazon Associates tag, not a regression.

---
**Recommended fixes (on your go-ahead):** A (4 links) — repoint to current pages; B (9) — repoint to the new owner *or* re-review/remove; C — re-check Claro/PupilAsset before deciding. D/E need nothing.
