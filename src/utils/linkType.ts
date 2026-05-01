/**
 * LinkType — classifies every outbound link on GetPromptly.
 *
 * Used to drive accurate CTA labels and relationship attributes.
 * QA classification covers tools, training, and equipment.
 */

export type LinkType =
  | 'demo'        // Opens directly to a usable demo / live web app (no sign-up required)
  | 'free-trial'  // Free-tier or free-trial signup flow
  | 'signup'      // Creates an account (free, no credit card)
  | 'product'     // Product/feature/education page — school/institutional license needed
  | 'pricing'     // Pricing or plans page
  | 'homepage'    // Marketing homepage only — no direct action
  | 'download';   // App store, APK, or downloadable software

/** Human-readable CTA label for each link type */
export function linkLabel(type: LinkType | undefined): string {
  switch (type) {
    case 'demo':       return 'Try demo';
    case 'free-trial': return 'Start free trial';
    case 'signup':     return 'Create account';
    case 'product':    return 'View official page';
    case 'pricing':    return 'See pricing';
    case 'homepage':   return 'Visit website';
    case 'download':   return 'Download';
    default:           return 'Visit website';
  }
}

/**
 * Infer a best-guess LinkType from a URL when not explicitly set.
 * Covers the most common URL patterns without manual tagging.
 */
export function inferLinkType(url: string): LinkType {
  const u = url.toLowerCase();

  if (u.includes('/sign-up') || u.includes('/signup') || u.includes('/register'))  return 'signup';
  if (u.includes('/free-trial') || u.includes('/trial'))                            return 'free-trial';
  if (u.includes('/pricing') || u.includes('/plans'))                               return 'pricing';
  if (u.includes('play.google.com') || u.includes('apps.apple.com') ||
      u.includes('microsoft.com/store'))                                             return 'download';

  // Known direct-tool domains that open a live app/demo without signup
  const directApps = [
    'chatgpt.com', 'claude.ai', 'gemini.google.com', 'perplexity.ai',
    'goblin.tools', 'hemingwayapp.com', 'wolfram', 'notebooklm.google.com',
    'teachablemachine.withgoogle.com', 'scratch.mit.edu', 'elicit.com', 'consensus.app',
    'app.diffit.me', 'poe.com', 'code.org', 'copilot.microsoft.com',
    'classroom.google.com', 'internetmatters.org', 'bedtimemath.org',
    'scite.ai',
  ];
  if (directApps.some(d => u.includes(d))) return 'demo';

  // Known free-trial or free-signup platforms
  const freeSignup = [
    'grammarly.com', 'quillbot.com', 'wordtune.com', 'canva.com', 'duolingo.com',
    'kahoot.com', 'quizlet.com', 'mentimeter.com', 'padlet.com', 'miro.com',
    'gamma.app', 'prezi.com', 'fireflies.ai', 'otter.ai', 'speechify.com',
    'flip.com', 'brainly.com', 'woebot', 'senecalearning.com',
    'synthesia.io', 'runwayml.com', 'play.ht', 'pictory.ai', 'audionotes.app',
    'figma.com', 'firefly.adobe.com', 'designer.microsoft.com', 'fotor.com',
    'copyleaks.com', 'gradescope.com', 'classdojo.com', 'web.seesaw.me',
    'remind.com', 'learn.khanacademy.org', 'lingokids.com', 'classcharts.com',
    'notion.com', 'reflect.app', 'sunsama.com', 'usemotion.com',
    'widgitonline.com', 'glean.co', 'elevenlabs.io', 'boardmaker',
    'revisiongenie.com', 'memrise.com', 'schoolai.com', 'flintk12.com',
    'curipod.com', 'nearpod.com', 'magicschool.ai', 'diffit.me',
    'briskteaching.com', 'eduaide.ai', 'educationcopilot.com', 'fetchy.com',
    'twee.com', 'conker.ai', 'chatclass.ai', 'classtime.com',
    'adobe.com/express', 'beautiful.ai', 'togetherall.com',
    'texthelp.com', 'speechify.com',
  ];
  if (freeSignup.some(d => u.includes(d))) return 'free-trial';

  // Download-only (app stores, software downloads)
  const downloads = [
    'microsoft.com/en-gb/ai/seeing-ai', 'bemyeyes.com', 'modmath.com',
    'voicedream.com', 'nuance.com/dragon', 'letsenvision.com',
    'photomath.com', 'dragonbox.com', 'assistiveware.com', 'touchchatapp.com',
    'innervoiceapp.com',
  ];
  if (downloads.some(d => u.includes(d))) return 'download';

  return 'product';
}
