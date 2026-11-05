/* Wake的数字工作台 · 无依赖渲染与交互 */
(function () {
  "use strict";

  const data = window.portfolioData;
  if (!data) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const projectState = { kind: "all", tag: "all" };
  let noteCategory = "全部";
  let aiType = "all";
  let resourceType = "all";
  let resourceCategory = "全部";
  let revealObserver = null;
  let toastTimer = null;
  let closeMenu = function () {};
  let currentNoteId = null;
  const searchState = { results: [], selected: 0 };

  const escapeHTML = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const safeExternalUrl = (value) => {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? escapeHTML(url.href) : "#";
    } catch (error) {
      return "#";
    }
  };

  const icon = (name, className = "") => `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
  const pad = (number) => String(number).padStart(2, "0");

  function bindProfile() {
    document.querySelectorAll("[data-bind]").forEach((element) => {
      const value = element.dataset.bind.split(".").reduce((current, key) => current && current[key], data);
      if (value !== undefined) element.textContent = value;
    });
    document.getElementById("email-link").href = `mailto:${data.profile.email}`;
    document.getElementById("current-year").textContent = new Date().getFullYear();
    document.querySelectorAll("[data-count]").forEach((element) => {
      const key = element.dataset.count;
      if (key === "resources") {
        element.textContent = pad(data.bookmarks.length + (data.learning || []).length);
        return;
      }
      const collection = data[key];
      if (Array.isArray(collection)) element.textContent = pad(collection.length);
    });
  }

  function renderNow() {
    document.getElementById("now-list").innerHTML = data.now.map((item, index) => `
      <a class="now-item" href="${escapeHTML(item.target)}">
        <span>${pad(index + 1)}</span>
        <span><small>${escapeHTML(item.label)}</small><strong>${escapeHTML(item.title)}</strong></span>
      </a>
    `).join("");
  }

  /* Projects and sites */
  function getFilteredProjects() {
    return data.projects.filter((project) => {
      const matchesKind = projectState.kind === "all" || project.kind === projectState.kind;
      const matchesTag = projectState.tag === "all" || project.tags.includes(projectState.tag);
      return matchesKind && matchesTag;
    });
  }

  function createProjectCard(project, visibleIndex) {
    const originalIndex = data.projects.indexOf(project);
    const kindLabel = project.kind === "site" ? "在线站点" : "项目作品";
    const featured = project.featured && projectState.kind === "all" && projectState.tag === "all";
    const title = escapeHTML(project.title);
    return `
      <a class="project-card project-card--tone-${escapeHTML(project.tone)}${featured ? " project-card--featured" : ""} reveal"
         href="${safeExternalUrl(project.url)}" target="_blank" rel="noopener noreferrer"
         aria-label="${title}，${kindLabel}，在新标签页打开" style="transition-delay: ${Math.min(visibleIndex * 55, 165)}ms">
        <div class="project-visual">
          <span class="project-glyph" aria-hidden="true">${escapeHTML(project.icon)}</span>
          <span class="project-visual-code">INDEX / ${pad(originalIndex + 1)}</span>
        </div>
        <div class="project-content">
          <div class="project-meta"><span class="project-kind">${project.kind === "site" ? "SITE" : "PROJECT"}</span><span>${escapeHTML(project.year)}</span></div>
          <div class="project-title-row"><h3>${title}</h3><span class="project-arrow">${icon("arrow-up-right")}</span></div>
          <p class="project-description">${escapeHTML(project.desc)}</p>
          <div class="project-footer"><div class="project-tags">${project.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div><span class="project-status">${escapeHTML(project.status)}</span></div>
        </div>
      </a>
    `;
  }

  function renderProjects() {
    const projects = getFilteredProjects();
    const grid = document.getElementById("projects-grid");
    const filtered = projectState.kind !== "all" || projectState.tag !== "all";
    grid.classList.toggle("is-filtered", filtered);
    grid.innerHTML = projects.map(createProjectCard).join("");
    grid.hidden = projects.length === 0;
    document.getElementById("projects-empty").hidden = projects.length !== 0;
    document.getElementById("projects-status").textContent = `当前显示 ${projects.length} 个项目与站点。`;
    observeReveals(grid);
  }

  function setupProjectFilters() {
    const kindFilters = document.getElementById("project-kind-filters");
    const tagFilter = document.getElementById("project-tag-filter");
    const tags = [...new Set(data.projects.flatMap((project) => project.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    tagFilter.insertAdjacentHTML("beforeend", tags.map((tag) => `<option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>`).join(""));

    kindFilters.querySelectorAll("[data-kind]").forEach((button) => {
      const kind = button.dataset.kind;
      const count = kind === "all" ? data.projects.length : data.projects.filter((project) => project.kind === kind).length;
      button.querySelector("span").textContent = pad(count);
      button.addEventListener("click", () => {
        projectState.kind = kind;
        kindFilters.querySelectorAll("[data-kind]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderProjects();
      });
    });

    tagFilter.addEventListener("change", () => {
      projectState.tag = tagFilter.value;
      renderProjects();
    });

    document.getElementById("reset-project-filters").addEventListener("click", () => {
      projectState.kind = "all";
      projectState.tag = "all";
      tagFilter.value = "all";
      kindFilters.querySelectorAll("[data-kind]").forEach((button) => {
        const active = button.dataset.kind === "all";
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      renderProjects();
    });
  }

  /* Notes */
  function renderNoteFilters() {
    const categories = ["全部", ...new Set(data.notes.map((note) => note.category))];
    document.getElementById("note-filters").innerHTML = categories.map((category) => {
      const count = category === "全部" ? data.notes.length : data.notes.filter((note) => note.category === category).length;
      return `<button class="note-filter${category === noteCategory ? " is-active" : ""}" type="button" data-note-category="${escapeHTML(category)}" aria-pressed="${category === noteCategory}">${escapeHTML(category)}<span>${pad(count)}</span></button>`;
    }).join("");
  }

  function renderNotes() {
    const notes = noteCategory === "全部" ? data.notes : data.notes.filter((note) => note.category === noteCategory);
    const list = document.getElementById("notes-list");
    list.innerHTML = notes.length ? notes.map((note, index) => `
      <article class="note-card reveal" style="transition-delay: ${Math.min(index * 45, 135)}ms">
        <button class="note-open" type="button" data-note-id="${escapeHTML(note.id)}" aria-label="阅读：${escapeHTML(note.title)}">
          <span class="note-number">/${pad(data.notes.indexOf(note) + 1)}</span>
          <span class="note-body"><span class="note-title">${escapeHTML(note.title)}</span><span class="note-summary">${escapeHTML(note.summary)}</span></span>
          <span class="note-meta"><span>${escapeHTML(note.category)}</span><time datetime="${escapeHTML(note.date)}">${escapeHTML(note.date.replaceAll("-", "."))}</time><span>${escapeHTML(note.readTime)}</span></span>
          ${icon("arrow-right", "note-row-arrow")}
        </button>
      </article>
    `).join("") : `<p class="notes-empty">这个主题下还没有笔记。</p>`;
    observeReveals(list);
  }

  function setupNotes() {
    renderNoteFilters();
    renderNotes();
    document.getElementById("note-filters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-note-category]");
      if (!button) return;
      noteCategory = button.dataset.noteCategory;
      renderNoteFilters();
      renderNotes();
    });
    document.getElementById("notes-list").addEventListener("click", (event) => {
      const button = event.target.closest("[data-note-id]");
      if (button) openNote(button.dataset.noteId);
    });
  }

  function openNote(id) {
    const note = data.notes.find((item) => item.id === id);
    if (!note) return;
    currentNoteId = id;
    document.getElementById("note-dialog-category").textContent = note.category;
    document.getElementById("note-dialog-title").textContent = note.title;
    document.getElementById("note-dialog-summary").textContent = note.summary;
    document.getElementById("note-dialog-meta").innerHTML = `<time datetime="${escapeHTML(note.date)}">${escapeHTML(note.date.replaceAll("-", "."))}</time><span>${escapeHTML(note.readTime)}阅读</span>`;
    document.getElementById("note-dialog-content").innerHTML = note.content.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("") + `<div class="note-takeaway"><span>ONE THING TO REMEMBER</span><p>${escapeHTML(note.takeaway)}</p></div>`;
    openDialog(document.getElementById("note-dialog"));
  }

  /* AI skills and MCP */
  function renderAI() {
    const tools = aiType === "all" ? data.aiTools : data.aiTools.filter((tool) => tool.type === aiType);
    const grid = document.getElementById("ai-grid");
    grid.innerHTML = tools.map((tool, index) => {
      const originalIndex = data.aiTools.indexOf(tool);
      return `
        <article class="ai-card reveal" style="transition-delay: ${Math.min(index * 45, 135)}ms">
          <div class="ai-card-top"><span class="ai-type">${tool.type === "skill" ? "SKILL" : "MCP SERVER"}</span><span class="ai-origin">${escapeHTML(tool.origin)}</span></div>
          <h3>${escapeHTML(tool.name)}</h3>
          <p>${escapeHTML(tool.desc)}</p>
          <div class="ai-tags">${tool.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
          <div class="ai-card-actions">
            <code class="ai-command" title="${escapeHTML(tool.command)}">${escapeHTML(tool.command)}</code>
            <button class="ai-action" type="button" data-copy-ai="${originalIndex}" aria-label="复制 ${escapeHTML(tool.name)} 安装命令" title="复制安装命令">${icon("copy")}</button>
            <a class="ai-action" href="${safeExternalUrl(tool.url)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${escapeHTML(tool.name)}，在新标签页打开" title="查看详情">${icon("arrow-up-right")}</a>
          </div>
        </article>
      `;
    }).join("");
    observeReveals(grid);
  }

  function setupAI() {
    const filters = document.getElementById("ai-filters");
    filters.querySelectorAll("[data-ai-type]").forEach((button) => {
      const type = button.dataset.aiType;
      const count = type === "all" ? data.aiTools.length : data.aiTools.filter((tool) => tool.type === type).length;
      button.querySelector("span").textContent = pad(count);
      button.addEventListener("click", () => {
        aiType = type;
        filters.querySelectorAll("[data-ai-type]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderAI();
      });
    });
    document.getElementById("ai-grid").addEventListener("click", async (event) => {
      const button = event.target.closest("[data-copy-ai]");
      if (!button) return;
      const tool = data.aiTools[Number(button.dataset.copyAi)];
      if (!tool) return;
      const copied = await copyText(tool.command);
      if (!copied) {
        showToast(`复制失败，请手动复制：${tool.command}`);
        return;
      }
      button.classList.add("is-copied");
      button.innerHTML = icon("check");
      showToast(`${tool.name} 安装命令已复制`);
      window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.innerHTML = icon("copy");
      }, 2200);
    });
  }

  /* Unified resource library: websites, courses and tutorials */
  function getResourceItems() {
    return [
      ...data.bookmarks.map((item) => ({ ...item, resourceType: "site", typeLabel: "网站" })),
      ...(data.learning || []).map((item) => ({ ...item, resourceType: "learning", typeLabel: item.format === "course" ? "课程" : "教程" }))
    ];
  }

  function getResourcesByType() {
    const resources = getResourceItems();
    return resourceType === "all" ? resources : resources.filter((item) => item.resourceType === resourceType);
  }

  function getFilteredResources() {
    const resources = getResourcesByType();
    return resourceCategory === "全部" ? resources : resources.filter((item) => item.category === resourceCategory);
  }

  function renderBookmarkFilters() {
    const resources = getResourcesByType();
    const categories = ["全部", ...new Set(resources.map((item) => item.category))];
    document.getElementById("bookmark-categories").innerHTML = categories.map((category) => {
      const count = category === "全部" ? resources.length : resources.filter((item) => item.category === category).length;
      return `<button class="bookmark-filter${category === resourceCategory ? " is-active" : ""}" type="button" data-bookmark-category="${escapeHTML(category)}" aria-pressed="${category === resourceCategory}">${escapeHTML(category)} <span>${pad(count)}</span></button>`;
    }).join("");
  }

  function getHost(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (error) { return "resource"; }
  }

  function renderResources() {
    const resources = getFilteredResources();
    document.getElementById("bookmarks-grid").innerHTML = resources.map((item) => `
      <a class="bookmark-card resource-card--${item.resourceType}" href="${safeExternalUrl(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(item.title)}，${item.typeLabel}，在新标签页打开">
        <span class="bookmark-mark" aria-hidden="true">${escapeHTML(item.mark)}</span>
        <span class="bookmark-body">
          <span class="bookmark-title-line"><span class="bookmark-title">${escapeHTML(item.title)}</span><span>${escapeHTML(getHost(item.url))}</span></span>
          <span class="bookmark-desc">${escapeHTML(item.desc)}</span>
          <span class="bookmark-footer"><span class="bookmark-category">${escapeHTML(item.category)}</span><span class="bookmark-format">${item.typeLabel}</span></span>
          ${item.meta ? `<span class="bookmark-extra">${escapeHTML(item.meta)}</span>` : ""}
        </span>
        ${icon("arrow-up-right")}
      </a>
    `).join("");
    document.getElementById("bookmarks-status").textContent = `当前显示 ${resources.length} 项资源。`;
  }

  function setupResources() {
    const resources = getResourceItems();
    const typeFilters = document.getElementById("resource-type-filters");
    typeFilters.querySelectorAll("[data-resource-type]").forEach((button) => {
      const type = button.dataset.resourceType;
      const count = type === "all" ? resources.length : resources.filter((item) => item.resourceType === type).length;
      button.querySelector("span").textContent = pad(count);
      button.addEventListener("click", () => {
        resourceType = type;
        resourceCategory = "全部";
        typeFilters.querySelectorAll("[data-resource-type]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderBookmarkFilters();
        renderResources();
      });
    });
    document.getElementById("resource-summary").textContent = `${data.bookmarks.length} 个网站 · ${(data.learning || []).length} 门课程与教程`;
    renderBookmarkFilters();
    renderResources();
    document.getElementById("bookmark-categories").addEventListener("click", (event) => {
      const button = event.target.closest("[data-bookmark-category]");
      if (!button) return;
      resourceCategory = button.dataset.bookmarkCategory;
      renderBookmarkFilters();
      renderResources();
    });
    document.getElementById("random-resource").addEventListener("click", () => {
      const filtered = getFilteredResources();
      if (!filtered.length) return;
      const resource = filtered[Math.floor(Math.random() * filtered.length)];
      const opened = window.open(resource.url, "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
      showToast(`带你去看看：${resource.title}`);
    });
  }

  /* Search across every collection */
  const searchIndex = [
    ...data.projects.map((item) => ({ type: item.kind === "site" ? "站点" : "项目", title: item.title, desc: item.desc, keywords: item.tags.join(" "), url: item.url })),
    ...data.notes.map((item) => ({ type: "笔记", title: item.title, desc: item.summary, keywords: `${item.category} ${item.takeaway}`, noteId: item.id })),
    ...data.aiTools.map((item) => ({ type: item.type === "skill" ? "AI Skill" : "MCP", title: item.name, desc: item.desc, keywords: `${item.tags.join(" ")} ${item.origin}`, url: item.url })),
    ...data.bookmarks.map((item) => ({ type: "网站", title: item.title, desc: item.desc, keywords: `${item.category} 网站 收藏`, url: item.url })),
    ...(data.learning || []).map((item) => ({ type: item.format === "course" ? "课程" : "教程", title: item.title, desc: item.desc, keywords: `${item.category} ${item.meta} 课程 教程 学习`, url: item.url }))
  ];

  function renderSearchResults(query = "") {
    const normalized = query.trim().toLocaleLowerCase("zh-CN");
    const tokens = normalized.split(/\s+/).filter(Boolean);
    const matches = normalized
      ? searchIndex.filter((item) => tokens.every((token) => `${item.title} ${item.desc} ${item.keywords} ${item.type}`.toLocaleLowerCase("zh-CN").includes(token)))
      : [...data.notes].slice(0, 3).map((note) => searchIndex.find((item) => item.noteId === note.id)).concat(searchIndex.slice(0, 3));
    searchState.results = matches.slice(0, 12);
    searchState.selected = Math.min(searchState.selected, Math.max(0, searchState.results.length - 1));
    document.getElementById("search-hint").textContent = normalized ? `找到 ${matches.length} 条相关内容` : "最近更新 · 也可以输入类型，例如 MCP";
    const results = document.getElementById("search-results");
    results.innerHTML = searchState.results.length ? searchState.results.map((item, index) => `
      <button class="search-result${index === searchState.selected ? " is-selected" : ""}" id="search-option-${index}" type="button" role="option" aria-selected="${index === searchState.selected}" data-search-index="${index}">
        <span class="search-result-type">${escapeHTML(item.type)}</span>
        <span class="search-result-body"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.desc)}</small></span>
        ${icon(item.noteId ? "arrow-right" : "arrow-up-right")}
      </button>
    `).join("") : `<div class="search-empty"><p><strong>没有找到“${escapeHTML(query)}”</strong>试试项目、知识管理、Skill、课程或设计。</p></div>`;
  }

  function updateSearchSelection(next) {
    if (!searchState.results.length) return;
    searchState.selected = (next + searchState.results.length) % searchState.results.length;
    document.querySelectorAll(".search-result").forEach((result, index) => {
      const selected = index === searchState.selected;
      result.classList.toggle("is-selected", selected);
      result.setAttribute("aria-selected", String(selected));
      if (selected) result.scrollIntoView({ block: "nearest" });
    });
  }

  function activateSearchResult(index) {
    const item = searchState.results[index];
    if (!item) return;
    document.getElementById("search-dialog").close();
    if (item.noteId) {
      openNote(item.noteId);
      return;
    }
    const opened = window.open(item.url, "_blank", "noopener,noreferrer");
    if (opened) opened.opener = null;
  }

  function openSearch() {
    closeMenu();
    const input = document.getElementById("global-search");
    input.value = "";
    searchState.selected = 0;
    renderSearchResults();
    openDialog(document.getElementById("search-dialog"));
    window.setTimeout(() => input.focus(), 30);
  }

  function setupSearch() {
    const dialog = document.getElementById("search-dialog");
    const input = document.getElementById("global-search");
    document.getElementById("search-trigger").addEventListener("click", openSearch);
    document.getElementById("hero-search").addEventListener("click", openSearch);
    input.addEventListener("input", () => {
      searchState.selected = 0;
      renderSearchResults(input.value);
    });
    document.getElementById("search-results").addEventListener("click", (event) => {
      const result = event.target.closest("[data-search-index]");
      if (result) activateSearchResult(Number(result.dataset.searchIndex));
    });
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!dialog.open) openSearch();
      } else if (event.key === "/" && !isTyping && !document.querySelector("dialog[open]")) {
        event.preventDefault();
        openSearch();
      }
      if (!dialog.open) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        updateSearchSelection(searchState.selected + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        updateSearchSelection(searchState.selected - 1);
      } else if (event.key === "Enter" && document.activeElement === input) {
        event.preventDefault();
        activateSearchResult(searchState.selected);
      }
    });
  }

  /* Dialog helpers */
  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
  }

  function setupDialogs() {
    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close());
    });
    document.querySelectorAll("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("close", () => {
        if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
      });
    });
    document.getElementById("copy-note-link").addEventListener("click", async () => {
      if (!currentNoteId) return;
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = "";
      url.searchParams.set("note", currentNoteId);
      const copied = await copyText(url.href);
      showToast(copied ? "笔记链接已复制" : "复制失败，请从地址栏手动复制");
    });
  }

  /* Theme, navigation and motion */
  function getStoredTheme() {
    try {
      const theme = localStorage.getItem("zs-hub-theme");
      return ["light", "dark"].includes(theme) ? theme : null;
    } catch (error) { return null; }
  }

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    const toggle = document.getElementById("theme-toggle");
    const next = theme === "dark" ? "浅色" : "深色";
    toggle.setAttribute("aria-label", `切换为${next}主题`);
    toggle.title = `切换为${next}主题`;
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#141713" : "#f3f3ee";
    if (persist) {
      try { localStorage.setItem("zs-hub-theme", theme); } catch (error) {}
    }
  }

  function setupTheme() {
    applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
    document.getElementById("theme-toggle").addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event) => { if (!getStoredTheme()) applyTheme(event.matches ? "dark" : "light"); };
    if (systemTheme.addEventListener) systemTheme.addEventListener("change", followSystem);
    else systemTheme.addListener(followSystem);
  }

  function setupMenu() {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("primary-nav");
    const setMenu = (open, returnFocus = false) => {
      header.classList.toggle("is-menu-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      if (returnFocus) toggle.focus();
    };
    closeMenu = () => setMenu(false);
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target) && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenu(false); });
  }

  function setupScrollUI() {
    const header = document.getElementById("site-header");
    const progress = document.getElementById("scroll-progress-bar");
    const sections = [...document.querySelectorAll("main section[id]:not(#home)")];
    const links = [...document.querySelectorAll(".primary-nav a[data-section]")];
    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      header.classList.toggle("is-scrolled", scrollTop > 12);
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollTop / maxScroll))})`;
      let activeId = "";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= Math.min(220, window.innerHeight * .35)) activeId = section.id;
      });
      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 20) activeId = "about";
      links.forEach((link) => {
        const active = link.dataset.section === activeId;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      ticking = false;
    };
    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  }

  function observeReveals(scope = document) {
    if (!revealObserver) return;
    scope.querySelectorAll(".reveal:not([data-reveal-bound])").forEach((element) => {
      element.dataset.revealBound = "true";
      revealObserver.observe(element);
    });
  }

  function clearStaggerDelay(element) {
    const cleanup = (event) => {
      if (event.target !== element) return;
      element.style.removeProperty("transition-delay");
      element.removeEventListener("transitionend", cleanup);
    };
    element.addEventListener("transitionend", cleanup);
  }

  function setupReveals() {
    if ("IntersectionObserver" in window && !reducedMotion.matches) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            clearStaggerDelay(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .06, rootMargin: "0px 0px -35px 0px" });
    }
    if (revealObserver) observeReveals();
    else document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {}
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    let copied = false;
    try { copied = document.execCommand("copy"); } catch (error) {}
    textarea.remove();
    return copied;
  }

  function setupEmailCopy() {
    const button = document.getElementById("copy-email");
    let resetTimer = null;
    button.addEventListener("click", async () => {
      const copied = await copyText(data.profile.email);
      if (!copied) {
        showToast(`请手动复制邮箱：${data.profile.email}`);
        return;
      }
      button.classList.add("is-copied");
      button.querySelector("span").textContent = "已复制";
      showToast("邮箱地址已复制");
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.querySelector("span").textContent = "复制邮箱";
      }, 2200);
    });
  }

  function renderSocials() {
    document.getElementById("social-links").innerHTML = data.socials.map((social) => `<a href="${safeExternalUrl(social.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(social.name)} ↗</a>`).join("");
  }

  function openSharedNote() {
    const id = new URLSearchParams(window.location.search).get("note");
    if (id && data.notes.some((note) => note.id === id)) openNote(id);
  }

  function init() {
    bindProfile();
    renderNow();
    setupProjectFilters();
    renderProjects();
    setupNotes();
    renderAI();
    setupAI();
    setupResources();
    renderSocials();
    setupDialogs();
    setupSearch();
    setupReveals();
    setupTheme();
    setupMenu();
    setupScrollUI();
    setupEmailCopy();
    openSharedNote();
  }

  init();
})();
