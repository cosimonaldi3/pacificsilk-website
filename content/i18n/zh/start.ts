import type { StartContent } from "@/content/start";

const BOOKING_URL = "https://calendar.app.google/VShyN9ZBhhhT67jK6";
const EMAIL_ADDRESS = "contact@pacificsilk.com";

export const startContent: StartContent = {
  meta: {
    title: "开始您的项目 — 太平洋丝绸集团",
    description:
      "告诉我们您是谁、需要什么。我们将在一个工作日内回复初步方案。",
  },
  pageTitle: "开始您的项目",
  intro:
    "告诉我们您是谁。您的项目蓝图在下方，可随时修改。我们将在一个工作日内回复。",

  form: {
    heading: "您的信息",
    fields: {
      name: { label: "姓名", placeholder: "您的全名" },
      email: { label: "工作邮箱", placeholder: "you@company.com" },
      company: { label: "公司", placeholder: "公司名称" },
      country: { label: "国家", placeholder: "您所在的国家" },
      phone: { label: "电话或WhatsApp", placeholder: "+86 138 0000 0000" },
      message: { label: "项目详情", placeholder: "产品、数量、时间——您已知道的任何信息。" },
    },
    optionalLabel: "选填",
    errors: {
      required: "必填。",
      email: "请输入有效的邮箱地址。",
      summary: "请检查标出的字段。",
      server: "发送信息时出错。请重试，或发邮件至 contact@pacificsilk.com。",
      rateLimited: "尝试次数过多。请几分钟后重试，或发邮件至 contact@pacificsilk.com。",
    },
    submitLabel: "发送信息",
    blueprintCount: "将随您的蓝图一起发送：{n} 项服务",
    blueprintCountOne: "将随您的蓝图一起发送：1 项服务",
  },

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
