import {
  capabilitiesContent as en,
  type CapabilitiesPageContent,
} from "@/content/capabilities";

export const capabilitiesContent: CapabilitiesPageContent = {
  meta: {
    title: "业务能力 — 太平洋丝绸集团",
    description:
      "了解PS的业务范围及我们的成果。采购、制造、物流和市场准入项目——远程运营，落地交付。",
  },
  // New sections reuse the English copy until a Chinese translation is ready.
  intro: en.intro,
  blocks: en.blocks,
  move: en.move,
  finder: en.finder,
  grid: {
    label: "我们的运营",
    headline: "从中国到您的市场，每一步。",
    expandLabel: "查看详情",
    closeLabel: "收起详情",
    verify: {
      title: "寻找并核验供应商",
      body: "我们筛选工厂、核查执照、实地走访并测试样品。您只会见到通过核验的供应商。",
      link: { label: "我们如何寻源", href: "/capabilities" },
      cardTitle: "供应商档案",
      cardRef: "编号 SUP-0000",
      checks: ["营业执照", "出口资质", "工厂走访", "样品确认"],
      status: "已核验",
      networkLabel: "两端皆经核验的网络",
    },
    quality: {
      title: "两端都把关质量",
      body: "发货前在工厂检验，到港后再次检验。同一标准，书面确定，执行两次。",
      link: { label: "查看流程", href: "/process" },
      reportTitle: "检验报告",
      reportRef: "示例批次",
      checks: ["尺寸", "做工", "包装", "标签"],
      passLabel: "合格",
      chartTitle: "每批检验项",
      originLabel: "起运地",
      destinationLabel: "目的地",
    },
    movement: {
      title: "门到门运输",
      body: "运费、拼箱与配送规划为一条路线。您随时知道货物在哪里、何时到达。",
      link: { label: "估算运费", href: "/tools/shipping-estimate" },
      from: "上海",
      to: "鹿特丹",
      status: "运输中",
    },
    paperwork: {
      title: "单证与清关",
      body: "中国出口单证、目的地海关编码与清关。我们准备、核对并申报。",
      link: { label: "查找海关编码", href: "/tools/tariff-finder" },
      docs: ["装箱单", "商业发票", "报关单"],
      stamp: "已清关",
    },
    tracking: {
      title: "追踪每个项目",
      body: "一个共享视图：项目进展到哪里、下一步是什么、需要您提供什么。",
      link: { label: "开始项目", href: "/start" },
      projectLabel: "示例项目",
      steps: ["定义", "验证", "生产", "运输", "交付"],
      current: 2,
      updateLabel: "已预约生产检验",
    },
  },
  hero: {
    eyebrow: "我们的业务范围",
    headline: "已执行。\n非提案。",
    subheadline:
      "每个标记代表一个我们已执行的项目或已建立的业务存在。这不是幻灯片演示——这是实际工作的地图。",
  },
  projectTypes: {
    label: "我们执行的内容",
    headline: "四大能力。一体化协调运营。",
    types: [
      {
        key: "sourcing",
        label: "采购",
        description:
          "工厂识别、审核与供应商管理。我们找到谁能做、做到什么质量、以什么价格。",
      },
      {
        key: "manufacturing",
        label: "制造",
        description:
          "端到端生产管理——样品、模具、质量控制和交付。Lance Trade驻守工厂现场。",
      },
      {
        key: "market-entry",
        label: "市场准入",
        description:
          "中国市场准入：本地合作伙伴、联合推广方、代理机构引介。我们打开门，并留在房间里。",
      },
      {
        key: "logistics",
        label: "物流",
        description:
          "货运、海关、拼箱、仓储。SPL运输您的货物。PS确保交接无缝衔接。",
      },
    ],
  },
  impact: {
    label: "客户成果",
    headline: "已经完成，而非提案。",
    intro: "真实项目，已匿名处理。客户的需求、我们在中国的执行，以及为客户带来的改变。",
    ctaLabel: "阅读项目",
    carouselLabel: "客户项目",
    dotsLabel: "选择项目",
    slideLabel: "第 {n} 个项目，共 {total} 个",
    typeLabels: {
      sourcing: "采购",
      manufacturing: "制造",
      logistics: "物流",
      "market-entry": "市场准入",
      advisory: "咨询顾问",
      consulting: "咨询",
    },
  },
  blogSection: {
    label: "来自一线",
    headline: "执行中国项目的心得。",
    linkedInLabel: "在领英关注我们",
    linkedInUrl: "https://www.linkedin.com/company/pacific-silk-consulting",
    instagramLabel: "在Instagram关注我们",
    instagramUrl: "https://www.instagram.com/pacificsilkconsulting/",
  },
  finalCta: {
    headline: "准备好执行项目了吗？",
    body: "告诉我们您的需求。我们会告诉您什么是可能的，费用是多少。",
    cta: { label: "规划您的项目路径", href: "/#builder" },
    secondary: [{ label: "开始项目", href: "/start" }],
  },
  detailCta: {
    sourcing: {
      headline: "需要从中国采购？",
      body: "我们找到合适的工厂，谈判条款，管理关系——让您无需从零开始建立。",
      cta: { label: "开始项目", href: "/start" },
    },
    manufacturing: {
      headline: "准备好启动生产了吗？",
      body: "Lance Trade管理工厂现场。PS管理您。从第一个样品到最终交付。",
      cta: { label: "开始项目", href: "/start" },
    },
    logistics: {
      headline: "需要从中国运货？",
      body: "SPL负责货运、海关和交付协调。港口无意外。",
      cta: { label: "开始项目", href: "/start" },
    },
    "market-entry": {
      headline: "希望进入中国市场？",
      body: "我们识别本地合作伙伴、联合推广方和代理机构——并代表您进行引介。",
      cta: { label: "开始项目", href: "/start" },
    },
    advisory: {
      headline: "正在应对中国业务挑战？",
      body: "我们之前见过大多数情况。告诉我们您正面临什么。",
      cta: { label: "开始项目", href: "/start" },
    },
    consulting: {
      headline: "正在应对中国业务挑战？",
      body: "我们之前见过大多数情况。告诉我们您正面临什么。",
      cta: { label: "开始项目", href: "/start" },
    },
  },
};
