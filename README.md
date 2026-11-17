# Wake · 个人数字工作台

由 **WorkBuddy** 重构的纯静态个人主页。新版不再是个人简历，而是一个可持续维护的“个人索引”：集中收录每个项目自己的主页、实践笔记与技巧、AI Skills / MCP，以及分类整理的网站、课程与教程。内置四套可自由切换并自动记忆的视觉风格。

## 在线访问

站点已通过 GitHub Pages 发布：<https://www.uwakeme.top/homepage/>

源码仓库：<https://github.com/uwakeme/homepage>（公开）。发布源为 `main` 分支根目录，根目录的 `.nojekyll` 用于禁用 Jekyll 处理；向 `main` 推送后会自动重新构建，通常几分钟内生效。

## 如何预览

无需 Node.js、npm、构建工具、API Key 或网络连接。

- **直接预览**：双击 `index.html`，使用最新版 Chrome 或 Edge 打开。
- **本地服务预览（可选）**：在本目录执行 `python -m http.server 8080`，访问 `http://localhost:8080`。

所有样式、脚本、图标与内容均为本地资源，无字体、图片或脚本 CDN 依赖。

## 项目结构

```text
homepage/
├── index.html       # 页面结构、SEO、SVG 图标、搜索与阅读弹窗
├── css/
│   ├── style.css    # 默认档案馆主题、基础组件与响应式布局
│   └── themes.css   # 留白 / 终端 / 海报风格及风格选择弹窗
├── js/
│   ├── data.js      # 全站内容数据（最主要的内容维护入口）
│   └── app.js       # 渲染、筛选、搜索、阅读、复制与主题交互
└── README.md        # 使用与维护说明
```

## 如何维护内容

### 1. 个人信息与最近更新

编辑 `js/data.js` 中的 `profile` 与 `now`：

- `profile.name`：姓名，同步到导航和页脚。
- `profile.email`：邮箱，同步到邮件链接与复制按钮。
- `profile.updated`：首屏“最近更新”日期。
- `profile.intro`：首屏介绍。
- `profile.about`：底部关于区块的简短说明。
- `now`：首屏右侧三条最近动态；`target` 可填写站内锚点。

首屏标题位于 `index.html` 的 `#hero-title`；SEO 标题与描述位于该文件顶部。

### 2. 项目与个人站点

编辑 `projects` 数组。一张卡片对应一个项目**自己的主页**，链接点进去就是该项目原本的样子：

```js
{
  title: "Wake Plan · 多计划时间管理",
  kind: "project",       // project = 项目；site = 个人站点
  status: "迭代中",
  year: "2026",
  desc: "把时间切段，段里放任务……",
  url: "http://www.uwakeme.top/wake-plan/",
  icon: "计",            // 一个汉字或简短字母
  tags: ["Android", "本地优先", "时间管理"],
  tone: "blue",         // blue / orange / cream / ink / green / violet
  featured: true         // 可选；默认视图中展示为大卡片
}
```

维护约定：

- **收录范围**：账号下设置了 homepage 字段、且该主页当前能访问的仓库；不含 fork 与本仓库自身。
- `url` 填项目自己的主页地址，不是 GitHub 仓库地址。
- `desc` 取自该项目主页的 meta description 或 README 首段，不写没有依据的介绍。
- `tags` 用 2 到 3 个关键词，兼顾筛选下拉框的可读性；同一屏相邻卡片尽量不重色。
- 卡片总数保持满足「(总数 − 2) 能被 3 整除」（当前 8 张），否则桌面端最后一行会空出一半。

类型数量、标签下拉框、筛选结果和首屏统计会自动更新。

### 3. 笔记与技巧

编辑 `notes` 数组。每篇包含：

- `id`：唯一英文标识，用于站内阅读与分享链接。
- `title`、`category`、`date`、`readTime`、`summary`。
- `content`：正文段落数组。
- `takeaway`：文末的核心要点。

文章直接在站内弹窗阅读，不依赖外部博客服务。复制分享链接后，他人打开链接会自动展开对应文章。

### 4. AI Skills 与 MCP

编辑 `aiTools` 数组：

- `type`：`skill` 或 `mcp`，用于分类筛选。
- `origin`：如“创建”“收藏”“常用”。
- `command`：卡片底部展示并可一键复制的命令。
- `url`：详情或仓库地址。
- `tags`：用途标签。

当前的 6 个 Skills 来自自己的 [wake-skills](https://github.com/uwakeme/wake-skills) 仓库，安装命令统一为 `mavis skill install <仓库地址>`；增删技能时同步更新命令与链接。

### 5. 网站、课程、教程与社交链接

- `bookmarks`：网站名称、分类、简介、链接和短标记 `mark`。
- `learning`：课程或教程；`format` 使用 `course` / `tutorial`，`meta` 可填写来源、学习形式或节奏。
- 两类内容共用类型与主题筛选；“随机打开”会使用当前筛选结果，首屏资源统计与全站搜索也会自动更新。
- `socials`：底部链接，目前是 GitHub（`https://github.com/uwakeme`）与技术博客（`http://www.uwakeme.top/`）。没有真实地址的链接不留占位。

## 主题与布局

编辑 `css/style.css`：

- `:root`：浅色主题、字体、容器与基础变量。
- `html[data-theme="dark"]`：深色主题。
- `.project-card--tone-*`：项目视觉区配色。
- 文件底部媒体查询：1120、900、700、390px 响应式断点。

## 功能清单

- 项目 / 站点类型筛选与标签组合筛选。
- 笔记主题筛选、完整站内阅读、核心要点与文章链接复制。
- AI Skills / MCP 分类筛选、安装命令复制与详情入口。
- 网站收藏分类浏览、当前分类内随机打开。
- 全站搜索：覆盖项目、笔记、AI 工具和网站，支持 `Ctrl/Cmd + K`、`/` 唤起，以及方向键和 Enter 操作。
- 明暗主题跟随系统，并通过 `localStorage` 记忆手动选择。
- 当前区块导航高亮、阅读进度、移动端菜单、邮箱复制与反馈提示。
- 滚动入场和悬停反馈，尊重 `prefers-reduced-motion`。
- 语义化结构、键盘焦点、ARIA 状态与跳转主内容链接。

## 设计思路

新版采用“个人档案馆 / 数字工作台”的信息架构，而不是传统的“头像—简介—技能—经历”简历结构。强烈但克制的钴蓝色用于索引与行动入口，细线、编号、等宽标签和编辑式排版建立秩序；首屏直接回答“这里有什么、最近更新了什么”，四个内容区分别承担作品展示、经验沉淀、AI 工具复用与网络导航。个人介绍被压缩到底部，作为内容之后的补充，而不是整站主角。

## 本次验证

已在本机 Chrome 中检查浅色 / 深色主题、主题刷新记忆、全站搜索、搜索直达笔记、文章弹窗、项目与站点筛选、Skills / MCP 筛选、安装命令复制、网站分类筛选与移动端菜单，浏览器控制台无报错。

本轮把「项目与站点」换成 8 个真实项目主页：1440px 下栅格正好铺满三行，1120 / 900 / 700 / 390px 下均无横向溢出。全部外链已逐个访问确认可达，`node --check js/app.js` 与 `node --check js/data.js` 通过，数据完整性与 id 唯一性检查通过。
