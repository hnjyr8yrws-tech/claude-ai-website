const BASE_URL = 'https://www.getpromptly.co.uk';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GetPromptly',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    'GetPromptly is the UK\'s trusted independent platform for AI tools, equipment reviews, and CPD training in education — all assessed against KCSIE 2025.',
  sameAs: [
    'https://twitter.com/GetPromptly',
    'https://www.linkedin.com/company/getpromptly',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@getpromptly.co.uk',
    areaServed: 'GB',
    availableLanguage: 'English',
  },
};

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GetPromptly',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/tools?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is ChatGPT safe for UK schools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ChatGPT requires careful configuration for school use. It scores 7.0/10 on the GetPromptly safety scale — not recommended for under-13s without adult supervision. Schools should review their acceptable use policy and consider alternatives like Khanmigo (9.1/10) which is specifically designed for educational use and KCSIE-aligned.',
      },
    },
    {
      '@type': 'Question',
      name: 'What AI tools are KCSIE compliant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KCSIE-compliant AI tools reviewed by GetPromptly include Khanmigo, Microsoft Copilot for Education, Immersive Reader, Otter.ai, and Read&Write. All have been assessed against KCSIE 2025 requirements including data protection, safeguarding, and age-appropriate use. Visit GetPromptly\'s AI Tools Directory for full KCSIE scores.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I build an AI policy for my school?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with the DfE Generative AI Guidance (2024), then adapt it to your school context. Key sections to include: acceptable use for staff and students, GDPR and data handling, safeguarding considerations (KCSIE 2025), and a list of approved tools. GetPromptly\'s AI for SLT resources include a policy template and CPD for school leaders.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best Chromebooks for UK schools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The top-rated Chromebooks for UK schools reviewed by GetPromptly are the Acer Chromebook 514 (£219, 4.5 stars — best value for primary/secondary), HP Chromebook x360 14 (£289, 4.3 stars — best for secondary and FE), and Lenovo Chromebook 300e (ruggedised, touch screen, excellent Google Workspace integration). All are available via Crown Commercial Service or ESFA frameworks.',
      },
    },
  ],
};

export const homePageJsonLd = [organizationSchema, webSiteSchema, faqSchema];
