# AGENTS.md

Wake 的个人数字工作台 —— 零依赖的纯静态站点：原生 HTML / CSS / JavaScript，无构建步骤、无 npm 依赖、无外部 CDN。全部内容由 `js/data.js` 驱动。

## Setup commands

本仓库没有 `package.json`，无需安装依赖，也不依赖 Node.js 才能运行。

- 安装依赖: 无（纯静态，浏览器直接打开即可）
- 本地预览: `python -m http.server 8080`（在仓库根目录执行），访问 http://localhost:8080
- 直接预览: 用最新版 Chrome / Edge 打开 `index.html`
- 构建:     无构建步骤 —— 部署即把仓库根目录发布到 GitHub Pages
- 测试:     无自动化测试，按下方「Testing instructions」手工核对
- 语法检查: `node --check js/app.js` 与 `node --check js/data.js`（可选，需本机有 Node）
- 类型检查: 不适用（无 TypeScript）

## Project layout

- `index.html` — 页面结构、SEO meta、内联 SVG symbol 精灵、搜索 / 风格 / 阅读三个 `<dialog>`、noscript 兜底
- `css/style.css` — 默认「档案馆」主题、设计令牌（`:root`）、布局与组件、响应式断点
- `css/themes.css` — 四套可切换视觉风格（archive / minimal / terminal / poster）、风格选择弹窗、深色覆盖
- `js/data.js` — **全站内容唯一来源**（`window.portfolioData`）：个人信息、项目、笔记、AI 工具、资源收藏
- `js/app.js` — 渲染、筛选、全站搜索、弹窗阅读、复制、主题与风格切换等全部交互
- `README.md` — 面向人的使用与维护说明（中文主文档）
- `.nojekyll` — 让 GitHub Pages 直接托管仓库根目录，禁止 Jekyll 处理
- `.workbuddy/`、`.zcode/` — 工具工作目录，已被 `.gitignore` 排除，不是交付物

## Content rules

- `js/data.js` 是全站内容唯一来源：改文案、加项目只改这个文件，不动 HTML
- `projects` 收录账号下设置了 homepage 字段、且当前可访问的仓库（不含 fork 与本仓库自身）；`url` 填项目自己的主页地址，`desc` 取自该项目主页或 README 的真实素材
- 不留指向不存在仓库或 example.com 的占位链接；新增条目前先验证链接可达
- 桌面端卡片排布：第 1 张 `featured` 占 8 列、第 2 张占 4 列、其余每张占 4 列（每行 3 张），因此项目总数需满足「(总数 − 2) 能被 3 整除」，否则末行会空一半
- 提交前跑 `node --check js/app.js` 与 `node --check js/data.js`

## Code style

- 原生 ES2019+ 浏览器语法，零依赖、零构建；所有资源本地化，禁止引入 CDN 字体 / 脚本 / 图片
- 2 空格缩进，LF 换行，UTF-8 无 BOM
- JS：`js/app.js` 用 IIFE + `"use strict"` 包裹，`const` / `let` + 箭头函数 + 模板字符串，函数名 camelCase，注释用英文
- JS：`js/data.js` 只放数据与中文注释，不写逻辑
- CSS：颜色、字体、容器等一律走 `:root` 自定义属性；深色用 `html[data-theme="dark"]`，风格变体用 `html[data-style="…"]`；类名沿用 BEM 式 `.block--modifier` / `.project-card--tone-*`
- HTML：语义化标签 + ARIA；图标统一用内联 `<symbol>` + `<use href="#icon-*">`，不引外部图标库
- 任何注入 DOM 的内容必须过 `escapeHTML()`；外链必须过 `safeExternalUrl()`（只允许 http / https）
- 文档默认中文主语言；其他语言版本另建 `README.<lang>.md`，互不引用

## Testing instructions

没有测试框架，改动后按这份清单手工核对（本地 `python -m http.server 8080`）：

- `node --check js/app.js` && `node --check js/data.js` —— JS 语法
- 内容完整性：`data.js` 各数组 id 唯一、链接为 http / https、必填字段齐全
- 主题：浅色 / 深色切换、跟随系统、`localStorage` 刷新后记忆
- 四套视觉风格逐一切换，检查 `localStorage` 记忆
- 全站搜索：`Ctrl/Cmd + K` 与 `/` 唤起、方向键选择、Enter 打开、直达笔记
- 筛选：项目类型 + 标签组合、笔记分类、AI 工具类型、资源类型与分类、分类内随机打开
- 弹窗与复制：笔记弹窗阅读全文与要点、复制本页链接、复制安装命令、复制邮箱、toast 提示
- 响应式：1120 / 900 / 700 / 390px 下均无横向溢出
- 浏览器控制台无报错；滚动动效尊重 `prefers-reduced-motion`

## PR & commit conventions

- 默认分支 `main`（GitHub Pages 发布源）；本仓库是个人单维护项目，**直接在 `main` 上提交**，不开特性分支
- Commit message 用中文短句描述这次改动，沿用现有历史风格（如「新增四套可切换视觉风格与资源区内容整理」），不使用 conventional commits 前缀
- 推送到 `main` 会触发 GitHub Pages 重新构建，通常几分钟内生效；发布前先本地核对上面的清单
- 协作性事项用 `gh pr create` / `gh issue` 处理

## Security

- 本仓库不含密钥、令牌或 API Key；`.env` 类文件一律不进版本库
- 不要引入第三方脚本、追踪代码、远程字体或图片 —— 站点要求完全本地自包含
- 保持 `safeExternalUrl()` 的 http / https 白名单、语义化 ARIA 与 noscript 兜底不被削弱
- `.gitignore` 已排除 `.workbuddy/`、`.zcode/`，不要提交这些工具工作目录
