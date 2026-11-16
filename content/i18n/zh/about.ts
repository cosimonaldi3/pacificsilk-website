import { aboutContent as en } from "@/content/about";
import type { AboutContent } from "@/content/about";

export const aboutContent: AboutContent = {
  meta: {
    title: "关于我们 — 太平洋丝绸咨询",
    description:
      "太平洋丝绸咨询及太平洋丝绸联盟背后的团队与故事。",
  },
  story: {
    label: "我们是谁",
    headline: "为中国业务的\n复杂性而生。",
    body: "对大多数国际企业而言，'中国'这个词会触发同样的反应：不确定性。错误的供应商。质量问题。物流延误。沟通障碍。我们创建PSC，就是为了彻底消除这些问题——不靠建议，而靠实际运营。",
  },
  team: [
    {
      name: "Jorge Villalonga Moragues",
      title: "亚洲区负责人",
      company: "Pacific Silk Consulting",
      bio: "Jorge负责每个项目的中国端事务——与供应商沟通、工厂考察、生产监控。正因为有他，问题能在到达您之前被发现并解决。",
      photo: "/team/jorgev-villalonga-jr.png",
      placeholder: false,
    },
    {
      name: "Jorge Villalonga Fuster",
      title: "欧洲区负责人",
      company: "Pacific Silk Consulting",
      bio: "PSC联合创始人。Jorge负责欧洲客户关系，拥有数十年西班牙与中国之间跨境商业经验。",
      photo: "/team/jorge-villalonga-sr.png",
      placeholder: false,
    },
    {
      name: "顾朱挺 — James Gu",
      title: "CEO",
      company: "Sun Port Logistics (SPL)",
      bio: "James在创建SPL之前，曾在中远海运工作逾十年。他负责每个PSC项目的货运、海关和交付——从中国港口到您的门口。",
      photo: "/team/james.png",
      placeholder: false,
    },
    {
      name: "企鹅 — Freud Mao",
      title: "CEO",
      company: "Lance Trade",
      bio: "Freud在中国工厂生态系统中深耕二十余年。他知道哪些供应商能兑现承诺，哪些只是空谈。Lance Trade正是建立在这些关系之上。",
      photo: "/team/freud.png",
      placeholder: false,
    },
  ],
  carousel: {
    sectionLabel: "我们的心声",
    items: [
      {
        kind: "testimonial",
        id: "jorge-jr",
        label: "亚洲区负责人",
        quote:
          "工厂车间是你真正了解一家供应商实力的地方。我走过的工厂已经足够多，知道该看什么——也知道该在什么时候转身离开。",
        name: "Jorge Villalonga Moragues",
        title: "Pacific Silk Consulting",
        photo: "/testimonials/factory-floor.jpg",
      },
      {
        kind: "testimonial",
        id: "jorge-sr",
        label: "欧洲区负责人",
        quote:
          "我们反复看到同一个问题：每当一家企业提到中国，对话就会转向。不确定性。复杂性。风险。我们知道这些问题可以解决。我们创建PSC就是为了解决它们。",
        name: "Jorge Villalonga Fuster",
        title: "Pacific Silk Consulting",
        photo: "/testimonials/shipping-documents.jpg",
      },
      {
        kind: "reflection",
        id: "shenzhen-2023",
        label: "深圳，2023年",
        quote:
          "清晨六点走进工厂车间，一切一目了然。机器不说谎。工人不说谎。灰尘告诉你它们运转了多久。",
      },
      {
        kind: "reflection",
        id: "on-trust",
        label: "关于信任",
        quote:
          "在中国，关系先于合同。周六还会回你电话的供应商，才是真正想要这笔生意的人。我们知道哪些人会打那个电话。",
      },
      {
        kind: "reflection",
        id: "on-speed",
        label: "关于速度",
        quote:
          "一家工厂能快速运转，是因为有人在现场推动问责。速度不是工厂的特质，而是管理的特质。",
      },
    ],
  },
  alliance: {
    headline: "三家公司。一体化运营。",
    body: "大多数公司只是提供建议。我们付诸实施。PSC是一个三方合资企业的国际门面——太平洋丝绸咨询、SPL和Lance Trade。当您雇用我们时，通过一份合同即可访问三家公司的全部能力。",
    companies: [
      {
        name: "Pacific Silk Consulting",
        role: "国际咨询、战略与客户关系",
        logo: "psc-horizontal-white",
        image: "/images/alliance/psc.jpeg",
      },
      {
        name: "SPL",
        role: "物流、运输、海关与仓储",
        logo: "spl-reversed",
        logoClassName: "brightness-0 invert",
        image: "/images/alliance/spl.jpeg",
      },
      {
        name: "Lance Trade",
        role: "采购、供应商审核与生产管理",
        logo: "lance-reversed",
        image: "/images/alliance/lance.jpeg",
      },
    ],
  },
  presence: en.presence,
  joinNetwork: en.joinNetwork,
  finalCta: {
    headline: "准备好让我们为您效力了吗？",
    body: "告诉我们您的需求。我们会告诉您什么是可能的。",
    cta: { label: "开始项目", href: "/start" },
  },
};
