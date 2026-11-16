export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalContent {
  meta: {
    title: string;
    description: string;
  };
  lastUpdated: string;
  companyName: string;
  sections: LegalSection[];
}

export const privacyContent: LegalContent = {
  meta: {
    title: "Privacy Policy — Pacific Silk Consulting",
    description:
      "How Pacific Silk Consulting collects, uses, and protects your personal data.",
  },
  lastUpdated: "April 2026",
  companyName: "Pacific Silk Consulting",
  sections: [
    {
      heading: "Who we are",
      body: [
        "Pacific Silk Consulting ('PSC', 'we', 'us', 'our') is an international consulting firm that provides sourcing, market entry, manufacturing, logistics, and China advisory services to international businesses. We operate as the client-facing entity within the Pacific Silk Alliance, a joint venture with SPL (Chinese logistics) and Lance Trade (sourcing and production management).",
        "Registered business: Villa Mora Gestión 360 S.L. (trading as Pacific Silk Consulting), company registration number ESB16668931, registered at Carrer Cama Roja nº7, 07400, Alcúdia, Illes Balears, Spain. For privacy enquiries, contact us at: legal@pacificsilkconsulting.com.",
      ],
    },
    {
      heading: "What data we collect",
      body: [
        "We collect personal data only where you provide it to us or where it arises naturally from your use of this website.",
        "Contact form submissions: When you submit our contact form, we collect your name, email address, company name (if provided), and the content of your message. This is the primary source of personal data we collect through this website.",
        "Email correspondence: If you contact us directly by email, we receive and store your email address and the content of your communications.",
        "Website analytics: This website does not currently use a third-party analytics service that tracks individual visitors. Vercel, our hosting provider, collects basic server-level access logs — such as IP addresses, browser types, and pages requested — as a standard part of infrastructure operation. These logs are not used for profiling, marketing, or cross-site tracking and are subject to Vercel's own privacy policy. If we introduce a privacy-respecting analytics tool in the future, we will update this policy accordingly.",
        "Cookies: This website uses only technically necessary cookies required for the website to function. We do not use marketing or tracking cookies. See the Cookies section below for more detail.",
        "We do not collect sensitive personal data (health data, financial account data, government identification numbers) through this website.",
      ],
    },
    {
      heading: "How we use your data",
      body: [
        "We use the personal data we collect for the following purposes:",
        "Responding to your enquiry: When you submit a contact form or email us, we use your data to respond to your message and to assess whether and how we can assist you.",
        "Service delivery: If you engage PSC as a client, we use relevant contact information to administer the engagement, communicate about your project, and coordinate with alliance partners (SPL and Lance Trade) as required to deliver the contracted services.",
        "Improving this website: Anonymised analytics data (if collected) helps us understand how the site is used so we can improve it.",
        "We do not use your data for automated decision-making or profiling. We do not sell, rent, or trade personal data.",
      ],
    },
    {
      heading: "Legal basis for processing",
      body: [
        "We process your personal data under the following legal bases:",
        "Legitimate interests: We have a legitimate interest in receiving and responding to enquiries from prospective clients. When you submit a contact form or email us, we process your data to assess and respond to your request. We have balanced this interest against your rights and concluded that our interest does not override your reasonable expectations.",
        "Consent: Where we send you marketing communications (for example, follow-up emails about services you have not yet engaged), we will do so only with your explicit consent, which you may withdraw at any time.",
        "Contract performance: Once an engagement begins, we process data necessary to deliver the contracted services.",
        "Legal obligation: We may process data where required to comply with applicable laws or regulatory requirements.",
        "PSC is registered in Spain, an EU member state, and is subject to the EU General Data Protection Regulation (GDPR) and its Spanish implementation, Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD). The supervisory authority in Spain is the Agencia Española de Protección de Datos (AEPD, www.aepd.es).",
      ],
    },
    {
      heading: "Data retention",
      body: [
        "We retain personal data only for as long as necessary for the purposes described in this policy, or as required by law.",
        "Enquiry data: Contact form submissions and related correspondence are retained for up to 24 months from the date of last contact, unless you become an active client (in which case your data is retained for the duration of the engagement plus a reasonable period thereafter) or you ask us to delete it sooner.",
        "Client engagement data: Data relating to active or past engagements is retained in accordance with applicable law and our contractual obligations, typically for a period of 7 years from the end of the engagement.",
        "Analytics data: Aggregated analytics data is retained in anonymised form and is not subject to individual deletion requests.",
        "When data is no longer needed, we delete or anonymise it securely.",
      ],
    },
    {
      heading: "Third parties",
      body: [
        "We share personal data with third parties only where necessary and on a strictly limited basis:",
        "Hosting infrastructure: This website is hosted on Vercel (vercel.com), which processes server requests and may temporarily handle data transmitted to and from this website. Vercel is subject to its own privacy and security standards.",
        "Contact form processing: Contact forms on this website are processed via Tally (tally.so), an external form service. When you submit a contact form, your data — including name, email address, company name, and message content — is transmitted to and stored by Tally. Tally operates in accordance with GDPR. We access your submission through the Tally platform solely to respond to your enquiry. Tally's privacy policy is available at tally.so/privacy.",
        "Client portal authentication: The PSC client portal uses Supabase (supabase.com) for identity and authentication management. If you create a portal account, Supabase processes your email address, login events, and session data on our behalf under a data processing agreement. Supabase's privacy policy is available at supabase.com/privacy.",
        "Alliance partners: Where you become a PSC client, relevant project information may be shared with SPL and Lance Trade as part of the coordinated alliance delivery of services. This is done under appropriate confidentiality and data-handling arrangements between the alliance entities.",
        "Client portal: The PSC client portal is a separate service operating on a separate codebase and may be subject to its own privacy policy and terms. Any data you provide through the portal is governed by those separate terms.",
        "Professional advisers: We may share data with our legal, financial, or regulatory advisers under strict confidentiality obligations.",
        "We do not sell data to third parties. We do not share data with advertising platforms.",
      ],
    },
    {
      heading: "International transfers",
      body: [
        "Pacific Silk Consulting operates internationally. By the nature of our business — coordinating with alliance partners in China and serving clients across Europe, Asia, and the Americas — personal data may be processed in countries outside your own jurisdiction.",
        "Where data is transferred to countries that do not provide an equivalent level of data protection to your home jurisdiction, we implement appropriate safeguards, which may include standard contractual clauses or equivalent mechanisms.",
        "PSC is registered in Spain and operates within the EU legal framework under GDPR. Where personal data is shared with alliance partners in China (SPL and Lance Trade) as part of service delivery, such transfers are governed by appropriate contractual safeguards, including standard contractual clauses (SCCs) as approved by the European Commission, to ensure adequate protection of personal data transferred outside the EEA.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Depending on where you are located, you may have the following rights regarding your personal data:",
        "Access: You may request a copy of the personal data we hold about you.",
        "Correction: You may ask us to correct inaccurate or incomplete data.",
        "Erasure: You may ask us to delete your data where we no longer have a legitimate reason to hold it.",
        "Restriction: You may ask us to restrict processing of your data in certain circumstances.",
        "Portability: You may request your data in a commonly used machine-readable format.",
        "Objection: You may object to processing based on legitimate interests. We will consider your objection and cease processing unless we have compelling legitimate grounds that override your interests.",
        "Withdrawal of consent: Where processing is based on consent, you may withdraw that consent at any time.",
        "To exercise any of these rights, contact us at: legal@pacificsilkconsulting.com or by post at Carrer Cama Roja nº7, 07400, Alcúdia, Illes Balears, Spain. We will respond within the timeframe required by applicable law (30 days under GDPR). We may need to verify your identity before processing your request.",
        "If you believe we have not handled your data lawfully, you have the right to lodge a complaint with the Agencia Española de Protección de Datos (AEPD) at www.aepd.es, or with the data protection authority of your country of residence.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "This website uses only technically necessary cookies — small files stored on your device that are required for the website to function correctly. We do not use advertising cookies, social media tracking pixels, or cookies that track you across other websites.",
        "This website does not set analytics cookies. Our contact forms are processed via Tally (tally.so), which may set its own functional cookies when you interact with a Tally-embedded form. The PSC client portal uses Supabase (supabase.com) for authentication, which sets session cookies required for login to function. These are technically necessary and are not used for tracking or advertising.",
        "You can control and delete cookies through your browser settings. Disabling technically necessary cookies may affect website functionality.",
      ],
    },
    {
      heading: "Contact and complaints",
      body: [
        "For any questions about this privacy policy or how we handle your personal data, please contact us:",
        "Email: legal@pacificsilkconsulting.com",
        "Postal address: Villa Mora Gestión 360 S.L. (t/a Pacific Silk Consulting), Carrer Cama Roja nº7, 07400, Alcúdia, Illes Balears, Spain.",
        "If you have a concern that we have been unable to resolve, you have the right to lodge a complaint with the Agencia Española de Protección de Datos (AEPD) at www.aepd.es.",
      ],
    },
  ],
};

export const termsContent: LegalContent = {
  meta: {
    title: "Terms of Use — Pacific Silk Consulting",
    description: "Terms governing use of the Pacific Silk Consulting website.",
  },
  lastUpdated: "April 2026",
  companyName: "Pacific Silk Consulting",
  sections: [
    {
      heading: "Acceptance of terms",
      body: [
        "By accessing and using this website (pacificsilkconsulting.com), you agree to be bound by these Terms of Use. If you do not agree, please do not use this website.",
        "These terms apply to all visitors to this website. They do not govern the relationship between PSC and its clients — that relationship is governed by the engagement agreement entered into at the start of each project.",
      ],
    },
    {
      heading: "About this website",
      body: [
        "This website is a marketing and information resource operated by Pacific Silk Consulting ('PSC', 'we', 'us'). Its purpose is to describe our services, explain how we work, and allow prospective clients to make initial contact.",
        "This website does not facilitate any transactions, purchases, or self-service account creation. No services are sold or contracted through this website. All commercial arrangements are entered into separately.",
        "Nothing on this website constitutes an offer capable of acceptance, a binding commitment to provide services, or a guarantee of any outcome.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "All content on this website — including text, design, graphics, logos, and the selection and arrangement of content — is owned by or licensed to Pacific Silk Consulting and is protected by applicable intellectual property laws.",
        "You may view and print pages from this website for your own personal, non-commercial use. You may not reproduce, distribute, republish, transmit, modify, or create derivative works from any content on this website without our prior written consent.",
        "The Pacific Silk Consulting name, wordmark, and associated trade names are the property of Pacific Silk Consulting. Unauthorised use is prohibited.",
      ],
    },
    {
      heading: "No warranties",
      body: [
        "The information on this website is provided for general informational purposes only. It does not constitute legal, financial, commercial, or professional advice of any kind.",
        "While we take care to keep information accurate and current, we make no representations or warranties — express or implied — as to the accuracy, completeness, or fitness for purpose of any content on this website.",
        "Market conditions, regulations, and circumstances relevant to international trade and China operations change frequently. Information on this website may not reflect the most current developments. Always seek appropriate professional advice before acting on any information you find here.",
        "We do not guarantee that this website will be available at all times, free from errors, or free from viruses or other harmful components.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the fullest extent permitted by law, Pacific Silk Consulting shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, this website or any content on it.",
        "This includes, without limitation, damages for loss of profits, business interruption, loss of data, or any other commercial or financial losses, even if we have been advised of the possibility of such damages.",
        "Nothing in these terms limits or excludes liability that cannot be excluded by law, including liability for death or personal injury caused by our negligence or for fraudulent misrepresentation.",
      ],
    },
    {
      heading: "The client portal",
      body: [
        "PSC operates an invite-only client portal at a separate URL. The portal is a distinct service with its own codebase, access controls, and terms of use.",
        "Access to the portal is granted by PSC at its sole discretion to engaged clients. There is no self-service registration. If you are an existing client and need access, contact your PSC engagement lead.",
        "Use of the client portal is governed by the separate terms and conditions applicable to that service, not these Terms of Use.",
      ],
    },
    {
      heading: "Third-party links",
      body: [
        "This website may contain links to third-party websites for reference or convenience. PSC does not control, endorse, or take responsibility for the content, privacy practices, or terms of any third-party website.",
        "Accessing third-party websites from links on this site is at your own risk.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These Terms of Use and any dispute arising out of or in connection with them shall be governed by and construed in accordance with the laws of Spain.",
        "Any disputes shall be subject to the exclusive jurisdiction of the courts of Spain.",
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may update these Terms of Use from time to time. The 'Last updated' date at the top of this page will reflect any changes. Continued use of this website after changes are posted constitutes your acceptance of the revised terms.",
        "Material changes will be flagged on this page. We recommend checking these terms periodically.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "If you have any questions about these Terms of Use, please contact us:",
        "Email: legal@pacificsilkconsulting.com",
        "Postal address: Villa Mora Gestión 360 S.L. (t/a Pacific Silk Consulting), Carrer Cama Roja nº7, 07400, Alcúdia, Illes Balears, Spain.",
      ],
    },
  ],
};
