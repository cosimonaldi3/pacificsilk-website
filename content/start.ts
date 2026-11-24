export const BOOKING_URL = "https://calendar.app.google/VShyN9ZBhhhT67jK6";
const EMAIL_ADDRESS = "contact@pacificsilk.com";

export interface OnwardLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ThanksContent {
  heading: string;
  body: string;
  signoff: string;
  shortcutsHeading: string;
  bookingShortcutLabel: string;
  bookingShortcutUrl: string;
  emailShortcutLabel: string;
  emailShortcutAddress: string;
  onwardHeading: string;
  onwardLinks: OnwardLink[];
  socialHeading: string;
  socialLinks: SocialLink[];
}

export interface FormField {
  label: string;
  placeholder: string;
}

export interface QuoteFormContent {
  heading: string;
  fields: {
    name: FormField;
    email: FormField;
    company: FormField;
    country: FormField;
    phone: FormField;
    message: FormField;
  };
  optionalLabel: string;
  errors: {
    required: string;
    email: string;
    summary: string;
    server: string;
    rateLimited: string;
  };
  submitLabel: string;
  /* {n} is replaced with the number of services in the visitor's blueprint */
  blueprintCount: string;
  blueprintCountOne: string;
}

export interface StartContent {
  meta: {
    title: string;
    description: string;
  };
  pageTitle: string;
  intro: string;
  form: QuoteFormContent;
  emailAddress: string;
  thanks: ThanksContent;
}

export const startContent: StartContent = {
  meta: {
    title: "Start your project — Pacific Silk Group",
    description:
      "Tell us who you are and what you need. We reply within one business day with a first proposal.",
  },
  pageTitle: "Start your project",
  intro:
    "Tell us who you are. Your project is below — adjust it, then send. We reply within one business day.",

  form: {
    heading: "Your details",
    fields: {
      name: { label: "Name", placeholder: "Your full name" },
      email: { label: "Work email", placeholder: "you@company.com" },
      company: { label: "Company", placeholder: "Company name" },
      country: { label: "Country", placeholder: "Where you are based" },
      phone: { label: "Phone or WhatsApp", placeholder: "+34 600 000 000" },
      message: { label: "Project details", placeholder: "Product, quantities, timeline — whatever you already know." },
    },
    optionalLabel: "optional",
    errors: {
      required: "Required.",
      email: "Enter a valid email address.",
      summary: "Check the highlighted fields.",
      server: "Something went wrong sending your details. Try again, or email contact@pacificsilk.com.",
      rateLimited: "Too many attempts. Wait a few minutes and try again, or email contact@pacificsilk.com.",
    },
    submitLabel: "Send info",
    blueprintCount: "Sent with your blueprint: {n} services",
    blueprintCountOne: "Sent with your blueprint: 1 service",
  },

  emailAddress: EMAIL_ADDRESS,

  thanks: {
    heading: "Now we get to work.",
    body: "Your message is in. One of us will be in touch within one business day — usually sooner.",
    signoff: "— Jorge & Jorge",

    shortcutsHeading: "Want to move faster?",
    bookingShortcutLabel: "Book a 30-minute call",
    bookingShortcutUrl: BOOKING_URL,
    emailShortcutLabel: "Email us directly",
    emailShortcutAddress: EMAIL_ADDRESS,

    onwardHeading: "While you're here",
    onwardLinks: [
      { label: "Back to home", href: "/" },
      { label: "About the alliance", href: "/about" },
      { label: "How we work", href: "/process" },
    ],

    socialHeading: "Find us elsewhere",
    socialLinks: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/pacific-silk-consulting/" }],
  },
};
