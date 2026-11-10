# Design v0.5 carried over to the live site — 10 November 2026

Branch `design/v05-public-site`. Source: the approved prototype in the design worktree
(`promptly-chloe-website/chloe/v0.5/`, WP-CW-05 with CR's amendments 1 and 2).
**Nothing is live until this branch is merged into `main`.**

## What changed

- **Nine kinds of page** replace the old site: homepage (`/`), Reviews (`/tools`), a tool's public page
  (`/tools/:slug`), How we review, Membership, About us, Legal, the Standing Record and Sign in.
  Code is in `src/site/`.
- **Styles** are the prototype's own, scoped per page family (`src/site/styles/*.css`, generated;
  do not edit by hand). Tailwind's base reset is no longer loaded.
- **No scores in public.** Every tool is shown as **Under review** until it is reviewed under the
  updated methodology (founder decisions, 10 November).
- **265 tools**: the 241 already on the site, plus 24 from `GetPromptly_Tools_Research_2026-11-10`.
  Flipgrid stays a retired record.
- **AI Equipment, AI Training and Prompts are no longer needed** (founder decision). Their addresses
  redirect; their files are left in the repository, unrouted, for a later clean-up.
- The public Luna chat widget and the lead-capture pop-up are not on the new pages.

## Where the live site departs from the approved prototype, and why

| Prototype | Live site | Why |
|---|---|---|
| Invented tool names | The real library | The prototype used specimen data |
| Sign in: mock Google, Apple and email buttons | One action: an email asking to be told when membership opens | Accounts and payment do not exist yet; a live button must not pretend |
| Filter by age and by who uses it | Filter by purpose and by who uses it | The library records purpose and audience, not ages |
| Tool page: review date, "Checked every week" | "Under review", no date | No tool has a review under the updated method yet |
| About us: blank founder placeholders | Left off | "Photo" and "Details to follow" should not be published |
| Legal: "Address to be added", "privacy notice to follow" | The site's existing privacy and cookie policies | They are the current legal text |
| "Illustrative titles." | "Six from the library, A to Z." | The titles are real; the six are evenly spaced, never featured |
| A Luna example naming an invented tool | The same question without a name | — |

## For the founders before merging

1. **Claims that become public promises:** "Checked every week", "A person approves every change",
   "Every finding shows where it came from", and the footer's "no commission, referral fees…".
   The old Legal page carried an **affiliate disclosure** saying some links earn commission. It is
   not on the new Legal page because the new pages carry no outbound tool links. Confirm which is true.
2. **The registered office address** is not shown. UK company websites must show it.
3. **The privacy policy** still describes Google Analytics and a consultation form. Check it matches
   what the new site does.
4. **The name on the site is now "Promptly"** with the new wordmark, replacing "GetPromptly".
5. **The headline** is still the placeholder.
6. **Reviews is one long page** of 265 cards. Paging or collapsing letters may be wanted.
7. **The 24 new tools' public descriptions** were shortened from the research workbook to say only
   what each tool is for. The workbook's verification notes are not published.
8. **Clean-up later:** remove the unrouted old pages, components and data; update `CLAUDE.md`'s
   brand summary, which still describes the previous design.
