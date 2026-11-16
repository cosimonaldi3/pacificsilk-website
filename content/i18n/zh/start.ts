import type { StartContent } from "@/content/start";

const BOOKING_URL = "https://calendar.app.google/VShyN9ZBhhhT67jK6";
const EMAIL_ADDRESS = "contact@pacificsilk.com";

export const startContent: StartContent = {
  meta: {
    title: "开始您的项目 — 太平洋丝绸咨询",
    description:
      "告诉我们您正在做什么。我们将在一个工作日内回复，并提议一个沟通时间。",
  },
  pageTitle: "开始您的项目",
  intro:
    "告诉我们您正在做什么。我们将在一个工作日内回复，并提议一个沟通时间。",

  bookingHeading: "更倾向于先通话？",
  bookingBody: "直接在我们的日历上预约30分钟的介绍通话。",
  bookingCtaLabel: "预约通话",
  bookingUrl: BOOKING_URL,

  emailHeading: "或发送消息给我们",
  emailBody: "如果您更倾向于先发一封简短的邮件：",
  emailAddress: EMAIL_ADDRESS,

  thanks: {
    heading: "现在我们开始工作。",
    body: "您的消息已收到。我们中的一位将在一个工作日内与您联系——通常会更快。",
    signoff: "— Jorge & Jorge",

    shortcutsHeading: "想更快推进？",
    bookingShortcutLabel: "预约30分钟通话",
    bookingShortcutUrl: BOOKING_URL,
    emailShortcutLabel: "直接发邮件给我们",
    emailShortcutAddress: EMAIL_ADDRESS,

    onwardHeading: "您也可以了解",
    onwardLinks: [
      { label: "返回首页", href: "/" },
      { label: "关于联盟", href: "/about" },
      { label: "我们的工作方式", href: "/process" },
    ],

    socialHeading: "在其他平台找到我们",
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/pacific-silk-consulting/" },
    ],
  },
};
