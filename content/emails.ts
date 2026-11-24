/* Copy for the emails sent after a quote request. Layout and styling live in lib/start/emailTemplates.ts.
   View them rendered at http://localhost:3000/api/quote/preview (local dev only). */

export interface ClientEmailCopy {
  subject: string;
  /* {name} is replaced with the visitor's first name as typed */
  greeting: string;
  body: string;
  servicesHeading: string;
  signoff: string;
}

export const teamEmailCopy = {
  /* {company} is replaced with the company name */
  subject: "New quote request: {company}",
  heading: "New quote request",
  labels: {
    name: "Name",
    email: "Email",
    company: "Company",
    country: "Country",
    phone: "Phone",
    language: "Language",
    services: "Blueprint",
    message: "Details",
  },
  replyHint: "Reply to this email to answer the client directly.",
  empty: "No services selected",
};

export const clientEmailCopy: Record<"en" | "es" | "zh", ClientEmailCopy> = {
  en: {
    subject: "We received your project",
    greeting: "Hi {name},",
    body: "Thanks. We have your project and will reply within one business day with a first proposal.",
    servicesHeading: "What you sent us",
    signoff: "Pacific Silk",
  },
  es: {
    subject: "Hemos recibido tu proyecto",
    greeting: "Hola {name},",
    body: "Gracias. Tenemos tu proyecto y responderemos en un día hábil con una primera propuesta.",
    servicesHeading: "Lo que nos enviaste",
    signoff: "Pacific Silk",
  },
  zh: {
    subject: "我们已收到您的项目",
    greeting: "{name}，您好：",
    body: "谢谢。我们已收到您的项目，将在一个工作日内回复初步方案。",
    servicesHeading: "您发送的内容",
    signoff: "太平洋丝绸",
  },
};

export const emailFooter = "Pacific Silk Group";
