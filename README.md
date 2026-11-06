# Wake · 个人数字工作台

由 **WorkBuddy** 重构的纯静态个人主页。新版不再是个人简历，而是一个可持续维护的“个人索引”：集中收录项目与站点、实践笔记与技巧、AI Skills / MCP，以及分类整理的网站、课程与教程。内置四套可自由切换并自动记忆的视觉风格。

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

编辑 `projects` 数组：

```js
{
  title: "一隅 · 个人知识库",
  kind: "project",       // project = 项目；site = 个人站点
  status: "持续维护",
  year: "2026",
  desc: "项目简介",
  url: "https://github.com/uwakeme/repo",
  icon: "知",            // 一个汉字或简短字母
  tags: ["知识管理", "本地优先"],
  tone: "blue",         // blue / orange / cream / ink / green / violet
  featured: true         // 可选；默认视图中展示为大卡片
}
```

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

### 5. 网站、课程、教程与社交链接

- `bookmarks`：网站名称、分类、简介、链接和短标记 `mark`。
- `learning`：课程或教程；`format` 使用 `course` / `tutorial`，`meta` 可填写来源、学习形式或节奏。
- 两类内容共用类型与主题筛选；“随机打开”会使用当前筛选结果，首屏资源统计与全站搜索也会自动更新。
- `socials`：底部 GitHub、Twitter/X、B 站、知乎等链接；GitHub 已设置为 `https://github.com/uwakeme`。

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

已在本机 Chrome 中检查浅色 / 深色主题、主题刷新记忆、全站搜索、搜索直达笔记、文章弹窗、项目筛选、Skills / MCP 筛选、安装命令复制、网站分类筛选与移动端菜单。320、375、768、1024、1440px 下均无横向溢出，浏览器控制台无错误。内容数据完整性与 JavaScript 语法检查也已通过。
