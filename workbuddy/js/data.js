/*
 * 全站内容配置
 * 修改个人信息、作品、经历和文章时，只需要编辑这个文件。
 */
window.portfolioData = {
  profile: {
    name: "张三",
    role: "创意开发者",
    location: "上海 · 支持远程",
    email: "hello@zhangsan.dev",
    availability: "开放自由职业与合作机会",
    intro: "一名关注设计与工程的创意开发者，喜欢把模糊的想法变成清晰、好用且有一点惊喜的数字产品。",
    about: [
      "我目前在一家科技公司负责前端架构与产品体验，也在业余时间捣鼓独立项目。对我而言，代码不只是实现功能的工具，更是一种组织复杂信息、表达想法的方式。",
      "工作之外，我喜欢逛独立书店、城市徒步和胶片摄影。这些看似与代码无关的事情，常常让我重新理解节奏、细节与人的真实需求。"
    ],
    current: "正在寻找有意义的合作，也在学习如何更好地写作。"
  },
  stats: [
    { value: "07+", label: "年产品与设计开发经验" },
    { value: "24", label: "个上线的项目与实验" },
    { value: "12k", label: "行今年删掉的冗余代码" }
  ],
  interests: ["产品思维", "交互设计", "前端架构", "创意编码", "摄影与写作"],
  skills: [
    { name: "前端工程", description: "构建稳健、快速且易于维护的界面系统", level: 92, tools: "TypeScript / React / Vue" },
    { name: "交互与视觉", description: "把复杂流程转译为直觉、精致的体验", level: 86, tools: "Figma / Motion / Prototype" },
    { name: "全栈开发", description: "从数据模型到部署，独立完成产品闭环", level: 78, tools: "Node.js / PostgreSQL / Cloud" },
    { name: "创意表达", description: "用原型、动画和代码探索新的叙事方式", level: 82, tools: "Canvas / SVG / WebGL" }
  ],
  toolbox: ["TypeScript", "React", "Vue", "Node.js", "Vite", "Figma", "GSAP", "Git"],
  works: [
    { title: "个人博客", kind: "site", desc: "记录技术文章与生活随笔", url: "https://blog.example.com", icon: "📝", tags: ["博客"] },
    { title: "在线工具站", kind: "site", desc: "我开发的小工具集合", url: "https://tools.example.com", icon: "🛠️", tags: ["工具"] },
    { title: "文档站", kind: "site", desc: "学习笔记与知识库", url: "https://docs.example.com", icon: "📚", tags: ["文档"] },
    { title: "个人相册", kind: "site", desc: "摄影作品与旅行照片", url: "https://photos.example.com", icon: "📷", tags: ["生活"] },
    { title: "示例管理系统", kind: "project", desc: "基于主流技术栈的全栈示例项目", url: "https://github.com/example/repo1", icon: "💻", tags: ["开源", "全栈"] },
    { title: "示例小游戏", kind: "project", desc: "用 Canvas 实现的休闲小游戏", url: "https://github.com/example/repo2", icon: "🎮", tags: ["开源", "前端"] },
    { title: "生成艺术画布", kind: "project", desc: "用 Canvas 与噪声算法探索生成式视觉的小实验", url: "https://github.com/example/repo3", icon: "🎨", tags: ["开源", "创意编码"] }
  ],
  experience: [
    {
      period: "2023 — 至今",
      role: "高级前端工程师",
      organization: "星辰科技 · 上海",
      description: "负责核心产品的前端架构与体验升级，推动设计系统落地，并与产品、设计和后端团队协作交付复杂业务。",
      tags: ["前端架构", "设计系统", "团队协作"]
    },
    {
      period: "2020 — 2023",
      role: "前端工程师",
      organization: "云间工作室 · 杭州",
      description: "参与多个从 0 到 1 的 Web 产品，覆盖数据可视化、内容平台与企业工具，逐渐建立以用户为中心的工程视角。",
      tags: ["Vue", "数据可视化", "产品迭代"]
    },
    {
      period: "2018 — 2020",
      role: "独立设计与开发",
      organization: "自由职业 · 远程",
      description: "为独立品牌和创作者提供网站设计与开发服务，在有限资源中完成从需求梳理到上线运营的全过程。",
      tags: ["品牌网站", "自由职业", "全栈开发"]
    },
    {
      period: "2014 — 2018",
      role: "数字媒体技术 · 本科",
      organization: "东海大学",
      description: "系统学习编程、设计与人机交互，在课程项目和社团活动中找到了对创造数字产品的长期热情。",
      tags: ["人机交互", "编程基础", "视觉设计"]
    }
  ],
  posts: [
    {
      title: "把设计系统当作一种共同语言",
      date: "2026-10-18",
      category: "设计与工程",
      summary: "设计系统不只是组件库。它如何帮助团队减少重复沟通，并在一致性与灵活性之间取得平衡？"
    },
    {
      title: "写给独立开发者的「小步上线」指南",
      date: "2026-09-26",
      category: "独立开发",
      summary: "从缩小第一个版本开始，聊聊如何控制范围、获得真实反馈，并让个人项目保持持续前进。"
    },
    {
      title: "动效的价值：解释，而不是装饰",
      date: "2026-08-09",
      category: "交互设计",
      summary: "好的动效能交代界面从哪里来、到哪里去。通过几个日常案例理解节奏、连续性与可访问性。"
    },
    {
      title: "我的本地优先笔记工作流",
      date: "2026-07-12",
      category: "工具与生活",
      summary: "不追逐复杂工具，用纯文本、文件夹与一点自动化，搭建可靠且属于自己的知识记录系统。"
    }
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/example" },
    { name: "Twitter / X", url: "https://x.com/example" },
    { name: "B 站", url: "https://space.bilibili.com/example" },
    { name: "知乎", url: "https://www.zhihu.com/people/example" }
  ]
};
