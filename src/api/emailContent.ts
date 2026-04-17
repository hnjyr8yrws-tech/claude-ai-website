/**
 * emailContent.ts
 *
 * Role-specific welcome email content for Donna to configure in Brevo.
 *
 * HOW TO USE IN BREVO:
 * 1. Go to Brevo → Automation → Create a workflow
 * 2. Trigger: "Contact added to list" (use the list IDs from api/brevo-subscribe.ts)
 * 3. Add a condition: filter by ROLE attribute
 * 4. For each role branch, send the corresponding email template below
 *
 * The subject lines and body copy below are ready to paste into Brevo's
 * drag-and-drop email editor or as plain HTML templates.
 */

export interface RoleEmailContent {
  subject:     string;
  preheader:   string;   // preview text shown in inbox before opening
  headline:    string;
  intro:       string;
  ctaLabel:    string;
  ctaUrl:      string;
  resources:   { title: string; desc: string; url: string }[];
  promptCount: number;
}

export const EMAIL_CONTENT: Record<string, RoleEmailContent> = {

  Teacher: {
    subject:   '🎉 Your 10 teacher AI prompts are inside — GetPromptly',
    preheader: 'Cut lesson planning time in half. Ready-to-use prompts for your classroom.',
    headline:  'Your 10 AI prompts for teachers, ready to use today.',
    intro:     "Welcome to GetPromptly! You're joining 2,400+ UK teachers who use AI to work smarter, not harder. Here are your 10 best-performing classroom AI prompts — plus the 3 tools our teacher community rates highest.",
    ctaLabel:  'Get your full prompt library →',
    ctaUrl:    'https://www.getpromptly.co.uk/training',
    promptCount: 10,
    resources: [
      { title: 'Khanmigo',       desc: 'Safe AI tutor for your students. 9.1/10 safety score.',          url: 'https://www.getpromptly.co.uk/tools' },
      { title: 'Canva AI',       desc: 'Create worksheets, displays and newsletters in minutes.',          url: 'https://www.getpromptly.co.uk/tools' },
      { title: 'Goblin Tools',   desc: 'Break down complex tasks for students who need extra support.',    url: 'https://www.getpromptly.co.uk/tools' },
    ],
  },

  SLT: {
    subject:   '📋 Your AI policy template + school strategy guide — GetPromptly',
    preheader: 'Everything your leadership team needs to introduce AI confidently.',
    headline:  'Lead AI in your school with confidence.',
    intro:     "You're already ahead of most school leaders by thinking carefully about AI. Here's a ready-to-adapt AI policy template and a whole-school strategy guide — built specifically for UK SLT and grounded in DfE Generative AI Guidance and Ofsted's emerging expectations.",
    ctaLabel:  'Download the AI policy template →',
    ctaUrl:    'https://www.getpromptly.co.uk/training',
    promptCount: 8,
    resources: [
      { title: 'AI Policy Template',           desc: 'Adapt this DfE-aligned policy for your school in under an hour.',       url: 'https://www.getpromptly.co.uk/training' },
      { title: 'Whole-school AI Strategy',     desc: '5-step framework: from pilot to whole-school rollout.',                 url: 'https://www.getpromptly.co.uk/training' },
      { title: 'Microsoft Copilot for Edu',    desc: 'The SLT-approved AI tool for meetings, docs, and comms.',              url: 'https://www.getpromptly.co.uk/tools' },
    ],
  },

  'SEND Lead': {
    subject:   '🌿 Your SEND AI prompt pack + Goblin Tools guide — GetPromptly',
    preheader: 'AI tools and prompts designed for neurodiverse learners.',
    headline:  'AI that actually supports your SEND pupils.',
    intro:     "GetPromptly's SEND prompt pack has been tested with SENCOs across the UK. Inside you'll find prompts for writing pupil passports, creating adapted resources, and communicating with parents — plus a step-by-step guide to getting the most from Goblin Tools with neurodiverse learners.",
    ctaLabel:  'Explore SEND AI tools →',
    ctaUrl:    'https://www.getpromptly.co.uk/tools',
    promptCount: 12,
    resources: [
      { title: 'Goblin Tools',          desc: 'Task breakdown and executive function support. Free.',            url: 'https://www.getpromptly.co.uk/tools' },
      { title: 'Immersive Reader',      desc: "Microsoft's free reading aid. Works in Edge and Teams.",          url: 'https://www.getpromptly.co.uk/tools' },
      { title: 'OrCam MyEye 2',         desc: 'Wearable AI reader for visually impaired learners.',              url: 'https://www.getpromptly.co.uk/equipment' },
    ],
  },

  DSL: {
    subject:   '🛡️ Your KCSIE AI checklist + safeguarding assessment — GetPromptly',
    preheader: 'Know which AI tools are safe to approve — and which to flag.',
    headline:  'Your KCSIE AI safety checklist is ready.',
    intro:     "As DSL, you're responsible for ensuring AI tools don't create safeguarding gaps. This checklist gives you a practical framework for assessing any AI tool against KCSIE 2025 — and a shortlist of tools that have already passed our independent safeguarding review.",
    ctaLabel:  'View KCSIE-checked tools →',
    ctaUrl:    'https://www.getpromptly.co.uk/tools',
    promptCount: 5,
    resources: [
      { title: 'KCSIE 2025 AI Checklist',   desc: '12-point assessment framework for any AI tool.',                 url: 'https://www.getpromptly.co.uk/tools' },
      { title: 'Otter.ai',                  desc: 'KCSIE-checked transcription for safeguarding meetings.',          url: 'https://www.getpromptly.co.uk/tools' },
      { title: 'NSPCC Online Safety CPD',   desc: 'Free safeguarding-first AI literacy for DSLs.',                   url: 'https://www.getpromptly.co.uk/training' },
    ],
  },

  default: {
    subject:   '✨ Welcome to GetPromptly — your free prompt library is inside',
    preheader: 'UK education AI guides, tool reviews, and free prompts. All in one place.',
    headline:  'Welcome to GetPromptly.',
    intro:     "GetPromptly is the UK's independent guide to AI in education — honest tool reviews, safety scores, free CPD, and ready-to-use prompts for every role. Here's everything you need to get started.",
    ctaLabel:  'Explore GetPromptly →',
    ctaUrl:    'https://www.getpromptly.co.uk',
    promptCount: 10,
    resources: [
      { title: 'AI Tools Directory',   desc: '180+ tools, safety-scored and KCSIE-checked.',              url: 'https://www.getpromptly.co.uk/tools' },
      { title: 'Equipment Hub',        desc: 'Honest hardware reviews for school procurement.',             url: 'https://www.getpromptly.co.uk/equipment' },
      { title: 'Training Hub',         desc: 'Free CPD from Oak, Google, DfE and more.',                   url: 'https://www.getpromptly.co.uk/training' },
    ],
  },
};

/**
 * Returns the best matching content for a given role string.
 * Falls back to 'default' if the role isn't recognised.
 */
export function getEmailContent(role: string): RoleEmailContent {
  return EMAIL_CONTENT[role] ?? EMAIL_CONTENT.default;
}
