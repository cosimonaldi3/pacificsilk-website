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

export interface StartContent {
  meta: {
    title: string;
    description: string;
  };
  pageTitle: string;
  intro: string;
  bookingHeading: string;
  bookingBody: string;
  bookingCtaLabel: string;
  bookingUrl: string;
  emailHeading: string;
  emailBody: string;
  emailAddress: string;
  thanks: ThanksContent;
}

export const startContent: StartContent = {
  meta: {
    title: "Start your project — Pacific Silk Group",
    description:
      "Tell us what you're working on. We'll reply within one business day with a proposed time to talk.",
  },
  pageTitle: "Start your project",
  intro:
    "Tell us what you're working on. We'll reply within one business day with a proposed time to talk.",

  bookingHeading: "Prefer to talk first?",
  bookingBody: "Book a 30-minute introductory call directly on our calendar.",
  bookingCtaLabel: "Book a call",
  bookingUrl: BOOKING_URL,

  emailHeading: "Or send us a note",
  emailBody: "If you'd rather start with a quick message:",
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
