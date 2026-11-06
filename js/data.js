/*
 * 全站内容配置：新增或修改项目、笔记、AI 工具、网站、课程与教程，只需编辑此文件。
 * 所有条目均为可替换的演示数据；链接在正式使用前请换成自己的地址。
 */
window.portfolioData = {
  profile: {
    name: "Wake",
    role: "创造者 / 前端开发者",
    email: "youwakeme@qq.com",
    updated: "2026.11.05",
    intro: "我是 Wake。这不是一份简历，而是我的数字工作台：收录做过的项目、验证过的方法、常用的 AI 工具，以及值得反复访问的网站、课程与教程。",
    about: "关注产品、前端与 AI 工作流。这个主页是我的长期项目，也是一封通往过往想法与未来实验的邀请函。"
  },
  now: [
    { label: "正在迭代", title: "一隅 · 个人知识库", target: "#projects" },
    { label: "正在整理", title: "一套可复用的 AI 工作流", target: "#ai-lab" },
    { label: "最近写下", title: "把收藏夹变成真正的知识库", target: "#notes" }
  ],
  projects: [
    { title: "一隅 · 个人知识库", kind: "project", status: "持续维护", year: "2026", desc: "一个本地优先的知识管理实验，把笔记、网页剪藏与项目资料连接成可回溯的个人知识网络。", url: "https://github.com/uwakeme/knowledge-base", icon: "知", tags: ["知识管理", "本地优先"], tone: "blue", featured: true },
    { title: "微光工具箱", kind: "site", status: "已上线", year: "2026", desc: "把常用的文本、图片与开发者小工具收进一个无需登录的在线站点。", url: "https://tools.example.com", icon: "具", tags: ["工具", "效率"], tone: "orange" },
    { title: "生活切片", kind: "site", status: "不定期更新", year: "2025", desc: "城市散步、胶片摄影和一些不值得写成长文的日常片段。", url: "https://photos.example.com", icon: "影", tags: ["摄影", "生活"], tone: "cream" },
    { title: "Skill Foundry", kind: "project", status: "开源实验", year: "2026", desc: "用来创建、检查和发布 AI Agent Skills 的本地脚手架，强调结构化与可复用。", url: "https://github.com/uwakeme/skill-foundry", icon: "S", tags: ["AI", "开源"], tone: "ink" },
    { title: "文档森林", kind: "site", status: "持续整理", year: "2025", desc: "把零散的学习笔记整理成有路径、有上下文、方便检索的公开文档。", url: "https://docs.example.com", icon: "文", tags: ["文档", "知识管理"], tone: "green" },
    { title: "Canvas 游乐场", kind: "project", status: "偶尔实验", year: "2024", desc: "一组关于生成艺术、粒子与交互叙事的浏览器小实验。", url: "https://github.com/uwakeme/canvas-playground", icon: "玩", tags: ["创意编码", "开源"], tone: "violet" }
  ],
  notes: [
    {
      id: "bookmarks-to-knowledge",
      title: "把收藏夹变成真正的知识库，我删掉了 70% 的收藏",
      category: "知识管理",
      date: "2026-10-28",
      readTime: "6 分钟",
      summary: "收藏不等于拥有。从“以后可能有用”转向“现在解决什么问题”，重新建立网页、笔记与项目之间的联系。",
      content: [
        "我的收藏夹曾经有四千多个链接。它们被认真分类，却很少被再次打开。问题不是分类不够细，而是每个链接都脱离了当时的问题与行动。",
        "现在我会在收藏时补一句“为什么值得留下”，并把它关联到某个正在进行的项目。三个月后仍没有上下文、没有再次使用的链接，就可以直接离开。",
        "真正有用的知识库不是仓库，而是一条回到问题现场的路。链接只是路标，自己的判断和接下来的行动才是目的地。"
      ],
      takeaway: "收藏之前，先写清楚：它帮我解决什么问题？"
    },
    {
      id: "ai-skill-small-scope",
      title: "写 AI Skill 时，比提示词更重要的是能力边界",
      category: "AI 工作流",
      date: "2026-10-16",
      readTime: "8 分钟",
      summary: "一个 Skill 不该试图包办所有事情。从触发条件、输入输出与失败路径出发，让它成为可靠的小工具。",
      content: [
        "刚开始写 Skill 时，我总想加入更多规则和示例，仿佛提示词越长，能力就越稳定。实际结果却常常相反：目标变模糊，模型也更容易在不必要的步骤里偏离。",
        "后来我把每个 Skill 都限制在一个清晰的动作里：什么情况下触发、需要哪些输入、最终交付什么，以及信息不足时应该如何停下。边界明确以后，提示词反而变短了。",
        "最好的检验方式不是读一遍说明，而是连续跑十个真实任务。记录它在哪里犹豫、在哪里遗漏，再把这些失败变成结构，而不是继续堆形容词。"
      ],
      takeaway: "先定义“不做什么”，再写“应该怎么做”。"
    },
    {
      id: "local-first-workflow",
      title: "我的本地优先工作流：纯文本、Git 与三个小脚本",
      category: "工具与方法",
      date: "2026-09-30",
      readTime: "5 分钟",
      summary: "不依赖复杂平台，用每个人都看得懂的文件格式，搭建可迁移、可备份、可持续十年的记录系统。",
      content: [
        "我越来越谨慎地对待只能存在某款产品里的内容。不是云端不好，而是长期积累的资料，应该始终有一个自己能直接读取和搬走的版本。",
        "我的基础结构很简单：Markdown 负责文字，Git 负责版本，一个脚本做每日备份，一个脚本生成索引，最后一个脚本检查失效链接。",
        "工具可以换，文件仍然在那里。这种朴素带来的安全感，比任何精心设计的效率面板都更重要。"
      ],
      takeaway: "先保证内容能离开工具，再考虑工具带来的效率。"
    },
    {
      id: "css-layout-debug",
      title: "排查响应式布局溢出，我只用这三步",
      category: "前端技巧",
      date: "2026-09-12",
      readTime: "4 分钟",
      summary: "从固定宽度、长文本到绝对定位，一套快速定位横向滚动条来源的检查顺序。",
      content: [
        "移动端出现横向滚动条时，不要急着给 body 加 overflow-x: hidden。那只是把问题藏起来，也可能让 sticky 定位和键盘焦点变得更糟。",
        "第一步检查显式宽度与 min-width，第二步用临时轮廓找出超宽元素，第三步再检查长 URL、网格子项的 min-width:auto，以及超出容器的装饰元素。",
        "修复后分别测试 320、375 和 768 像素，再用键盘走完整个页面。能看见不等于能用，焦点轮廓和弹窗同样可能制造溢出。"
      ],
      takeaway: "先找到真正的溢出元素，不要用 hidden 掩盖症状。"
    },
    {
      id: "small-launch",
      title: "个人项目如何小步上线，而不是永远停在 80%",
      category: "项目复盘",
      date: "2026-08-24",
      readTime: "7 分钟",
      summary: "把“完成”改写成“可以被使用”，缩小第一个版本，让真实反馈替代脑内排练。",
      content: [
        "个人项目最容易在只有自己知道的 80% 处停下来：核心功能已经能跑，但又觉得还缺一个设置、一种主题、一套更完美的架构。",
        "我现在会先定义一个陌生人可以完成的最小任务。只要这个任务成立，就允许第一版带着明确的限制上线，而不是继续扩展没人要求的选项。",
        "上线以后，真实使用会自然排出优先级。那些我以为重要的细节，往往不如一次清楚的报错或一个更短的入口重要。"
      ],
      takeaway: "第一个版本的目标不是完整，而是让一个真实任务成立。"
    },
    {
      id: "motion-with-purpose",
      title: "动效不是装饰：我保留或删除它的判断标准",
      category: "设计观察",
      date: "2026-08-06",
      readTime: "5 分钟",
      summary: "能否解释状态、维持空间连续性、给出操作反馈？如果三个答案都是否，就大胆地删掉。",
      content: [
        "界面里的动效经常承担“显得高级”的任务，但用户真正需要的是理解：刚才发生了什么，新内容从哪里来，我的操作有没有生效。",
        "我会保留能交代因果的过渡，比如菜单从触发按钮附近展开、列表更新时保持位置稳定。至于纯粹拖延阅读的入场动画，则应该尽量短，甚至不存在。",
        "最后一定打开系统的减少动态效果设置再体验一次。一个去掉动画后仍然清晰完整的界面，才有扎实的基础。"
      ],
      takeaway: "动效应该回答问题，而不是制造等待。"
    }
  ],
  aiTools: [
    { name: "frontend-design", type: "skill", origin: "收藏", desc: "从概念、排版到动效，建立有明确审美方向的前端页面，而不是套用通用模板。", url: "https://github.com/uwakeme/frontend-design", command: "npx skills add uwakeme/frontend-design", tags: ["设计", "前端"] },
    { name: "readme-banner", type: "skill", origin: "创建", desc: "读取项目信息与截图，生成风格统一、可直接放入 README 的 SVG Banner。", url: "https://github.com/uwakeme/readme-banner-skill", command: "npx skills add uwakeme/readme-banner", tags: ["文档", "SVG"] },
    { name: "research-digest", type: "skill", origin: "创建", desc: "把多来源资料整理成带来源、结论与待验证项的研究摘要，减少重复搜索。", url: "https://github.com/uwakeme/research-digest", command: "npx skills add uwakeme/research-digest", tags: ["研究", "写作"] },
    { name: "humanizer-zh", type: "skill", origin: "收藏", desc: "检查中文文本中的模板腔、空泛形容与重复句式，保留作者原本的语气。", url: "https://github.com/uwakeme/humanizer-zh", command: "npx skills add uwakeme/humanizer-zh", tags: ["中文", "编辑"] },
    { name: "Filesystem", type: "mcp", origin: "常用", desc: "在明确授权的目录内读写与检索文件，是本地自动化工作流的基础连接器。", url: "https://github.com/modelcontextprotocol/servers", command: "npx -y @modelcontextprotocol/server-filesystem ./", tags: ["本地", "文件"] },
    { name: "Fetch", type: "mcp", origin: "常用", desc: "抓取网页并转换为便于模型阅读的内容，用于资料核对与文档查询。", url: "https://github.com/modelcontextprotocol/servers", command: "uvx mcp-server-fetch", tags: ["网页", "研究"] },
    { name: "Memory", type: "mcp", origin: "常用", desc: "用知识图谱保存跨会话事实与关系，让长期项目保留必要上下文。", url: "https://github.com/modelcontextprotocol/servers", command: "npx -y @modelcontextprotocol/server-memory", tags: ["记忆", "知识"] },
    { name: "GitHub", type: "mcp", origin: "收藏", desc: "连接仓库、Issue 与 Pull Request，把项目维护流程接入统一的 Agent 工作区。", url: "https://github.com/github/github-mcp-server", command: "docker run -i --rm ghcr.io/github/github-mcp-server", tags: ["代码", "协作"] }
  ],
  bookmarks: [
    { title: "MDN Web Docs", category: "开发参考", desc: "最可靠的 Web 标准、API 与兼容性参考之一。", url: "https://developer.mozilla.org/zh-CN/", mark: "M" },
    { title: "Can I use", category: "开发参考", desc: "查浏览器支持情况，决定新特性能否安全上线。", url: "https://caniuse.com/", mark: "CI" },
    { title: "web.dev", category: "开发参考", desc: "性能、可访问性与现代 Web 实践的深入指南。", url: "https://web.dev/", mark: "W" },
    { title: "CSS-Tricks", category: "开发参考", desc: "从具体布局问题到完整 CSS 技巧的实用文章。", url: "https://css-tricks.com/", mark: "C" },
    { title: "Are.na", category: "设计灵感", desc: "没有算法催促的灵感收集与连接社区。", url: "https://www.are.na/", mark: "A" },
    { title: "Awwwards", category: "设计灵感", desc: "观察数字设计趋势，但不把奖项当作唯一标准。", url: "https://www.awwwards.com/", mark: "AW" },
    { title: "Figma Community", category: "设计灵感", desc: "设计资源、组件与可拆解学习的公开文件。", url: "https://www.figma.com/community", mark: "F" },
    { title: "Hugging Face", category: "AI 与工具", desc: "模型、数据集与开源 AI 应用的集中入口。", url: "https://huggingface.co/", mark: "HF" },
    { title: "MCP Servers", category: "AI 与工具", desc: "查找 Model Context Protocol 的参考实现与连接器。", url: "https://github.com/modelcontextprotocol/servers", mark: "MC" },
    { title: "Product Hunt", category: "AI 与工具", desc: "看看世界各地的新产品如何定义问题与讲清价值。", url: "https://www.producthunt.com/", mark: "P" },
    { title: "阮一峰的网络日志", category: "阅读与思考", desc: "技术周刊、软件工具与长期稳定的中文写作。", url: "https://www.ruanyifeng.com/blog/", mark: "阮" },
    { title: "少数派", category: "阅读与思考", desc: "数字工具、工作方式与生活效率的中文实践。", url: "https://sspai.com/", mark: "少" }
  ],
  learning: [
    { title: "MDN 学习区", format: "tutorial", category: "开发参考", desc: "从 HTML、CSS 到 JavaScript 的结构化学习路径，适合随时查漏补缺。", url: "https://developer.mozilla.org/zh-CN/docs/Learn", mark: "M", meta: "MDN · 自定节奏" },
    { title: "freeCodeCamp", format: "course", category: "开发参考", desc: "通过大量交互练习与认证项目学习编程，适合边学边做出作品。", url: "https://www.freecodecamp.org/learn/", mark: "FC", meta: "freeCodeCamp · 项目制练习" },
    { title: "The Odin Project", format: "course", category: "开发参考", desc: "开源的全栈开发学习路径，课程、资料与项目任务衔接得很完整。", url: "https://www.theodinproject.com/", mark: "OP", meta: "开源社区 · 全栈路径" },
    { title: "MIT 6.006 算法导论", format: "course", category: "计算机基础", desc: "系统补齐算法与数据结构基础，配有公开讲义、作业和课程视频。", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", mark: "6", meta: "MIT OCW · 视频与讲义" },
    { title: "线性代数的本质", format: "tutorial", category: "计算机基础", desc: "用动态可视化建立线性代数直觉，适合作为公式学习之外的补充。", url: "https://www.3blue1brown.com/topics/linear-algebra", mark: "3B", meta: "3Blue1Brown · 可视化系列" },
    { title: "李宏毅机器学习课程", format: "course", category: "AI 与工具", desc: "从基础概念到深度学习与生成式 AI，中文讲解清晰，适合系统学习。", url: "https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring/", mark: "李", meta: "台湾大学 · 视频课程" }
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/uwakeme" },
    { name: "Twitter / X", url: "https://x.com/example" },
    { name: "B 站", url: "https://space.bilibili.com/example" },
    { name: "知乎", url: "https://www.zhihu.com/people/example" }
  ]
};
