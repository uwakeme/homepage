/* 张三个人主页 · 无依赖交互逻辑 */
(function () {
  "use strict";

  const data = window.portfolioData;
  if (!data) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver = null;
  let toastTimer = null;

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

  const icon = (name, className = "") => `
    <svg class="${className}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;

  function bindProfile() {
    document.querySelectorAll("[data-bind]").forEach((element) => {
      const path = element.dataset.bind.split(".");
      const value = path.reduce((current, key) => current && current[key], data);
      if (value !== undefined) element.textContent = value;
    });

    const emailLink = document.getElementById("email-link");
    emailLink.href = `mailto:${data.profile.email}`;
    document.getElementById("current-year").textContent = new Date().getFullYear();
  }

  function renderStats() {
    document.getElementById("hero-stats").innerHTML = data.stats.map((stat) => `
      <div>
        <dt>${escapeHTML(stat.value)}</dt>
        <dd>${escapeHTML(stat.label)}</dd>
      </div>
    `).join("");
  }

  function renderAbout() {
    const aboutContent = document.getElementById("about-content");
    aboutContent.innerHTML = data.profile.about.map((paragraph) => `
      <p>${escapeHTML(paragraph)}</p>
    `).join("") + `
      <div class="current-card">
        ${icon("map")}
        <p><strong>当前状态：</strong>${escapeHTML(data.profile.current)}</p>
      </div>
    `;

    document.getElementById("interest-row").innerHTML = data.interests.map((interest) => `
      <span class="interest-chip">${escapeHTML(interest)}</span>
    `).join("");
  }

  function renderSkills() {
    document.getElementById("skills-list").innerHTML = data.skills.map((skill, index) => {
      const level = Math.max(0, Math.min(100, Number(skill.level) || 0));
      return `
        <article class="skill-item">
          <span class="skill-index">${String(index + 1).padStart(2, "0")}</span>
          <div class="skill-main">
            <div class="skill-title-row">
              <h3>${escapeHTML(skill.name)}</h3>
              <span>${level}%</span>
            </div>
            <p>${escapeHTML(skill.description)}</p>
            <div class="skill-track" role="img" aria-label="${escapeHTML(skill.name)}熟练度 ${level}%">
              <span style="--level: ${level}%"></span>
            </div>
            <small>${escapeHTML(skill.tools)}</small>
          </div>
        </article>
      `;
    }).join("");

    document.getElementById("toolbox-tags").innerHTML = data.toolbox.map((tool) => `
      <span>${escapeHTML(tool)}</span>
    `).join("");
  }

  const workState = { kind: "all", tag: "all" };

  function createWorkCard(work, visibleIndex) {
    const originalIndex = data.works.indexOf(work);
    const kindLabel = work.kind === "site" ? "站点" : "项目";
    const tags = work.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
    const featured = visibleIndex === 0 ? " work-card--featured" : "";
    const title = escapeHTML(work.title);

    return `
      <a class="work-card work-card--tone-${originalIndex % 6}${featured} reveal"
         href="${safeExternalUrl(work.url)}"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="${title}，${kindLabel}，在新标签页打开"
         style="transition-delay: ${Math.min(visibleIndex * 55, 165)}ms">
        <div class="work-visual">
          <span class="work-index">NO.${String(originalIndex + 1).padStart(2, "0")}</span>
          <span class="work-kind">${work.kind === "site" ? "SITE" : "PROJECT"}</span>
          <span class="work-emoji" aria-hidden="true">${escapeHTML(work.icon)}</span>
        </div>
        <div class="work-content">
          <div class="work-title-row">
            <h3>${title}</h3>
            <span class="work-arrow">${icon("arrow-up-right")}</span>
          </div>
          <p class="work-description">${escapeHTML(work.desc)}</p>
          <div class="work-tags" aria-label="标签：${work.tags.map(escapeHTML).join("、")}">${tags}</div>
        </div>
      </a>
    `;
  }

  function getFilteredWorks() {
    return data.works.filter((work) => {
      const matchesKind = workState.kind === "all" || work.kind === workState.kind;
      const matchesTag = workState.tag === "all" || work.tags.includes(workState.tag);
      return matchesKind && matchesTag;
    });
  }

  function renderWorks() {
    const works = getFilteredWorks();
    const grid = document.getElementById("works-grid");
    const empty = document.getElementById("works-empty");
    const status = document.getElementById("works-status");

    grid.innerHTML = works.map(createWorkCard).join("");
    grid.hidden = works.length === 0;
    empty.hidden = works.length !== 0;
    status.textContent = `当前显示 ${works.length} 个作品与站点条目。`;
    observeReveals(grid);
  }

  function setupWorkFilters() {
    const kindFilters = document.getElementById("kind-filters");
    const tagFilter = document.getElementById("tag-filter");
    const tags = [...new Set(data.works.flatMap((work) => work.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));

    tagFilter.insertAdjacentHTML("beforeend", tags.map((tag) => `
      <option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>
    `).join(""));

    kindFilters.querySelectorAll("[data-kind]").forEach((button) => {
      const kind = button.dataset.kind;
      const count = kind === "all" ? data.works.length : data.works.filter((work) => work.kind === kind).length;
      button.querySelector("span").textContent = String(count).padStart(2, "0");
      button.addEventListener("click", () => {
        workState.kind = kind;
        kindFilters.querySelectorAll("[data-kind]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderWorks();
      });
    });

    tagFilter.addEventListener("change", () => {
      workState.tag = tagFilter.value;
      renderWorks();
    });

    document.getElementById("reset-filters").addEventListener("click", () => {
      workState.kind = "all";
      workState.tag = "all";
      tagFilter.value = "all";
      kindFilters.querySelectorAll("[data-kind]").forEach((button) => {
        const active = button.dataset.kind === "all";
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      renderWorks();
    });
  }

  function renderExperience() {
    document.getElementById("timeline").innerHTML = data.experience.map((item, index) => `
      <li class="timeline-item reveal" style="transition-delay: ${Math.min(index * 65, 195)}ms">
        <time class="timeline-period">${escapeHTML(item.period)}</time>
        <div class="timeline-content">
          <h3>${escapeHTML(item.role)}</h3>
          <p class="timeline-org">${escapeHTML(item.organization)}</p>
          <p class="timeline-description">${escapeHTML(item.description)}</p>
          <div class="timeline-tags">${item.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
        </div>
      </li>
    `).join("");
  }

  function renderPosts() {
    document.getElementById("blog-list").innerHTML = data.posts.map((post, index) => `
      <article class="post-card reveal" style="transition-delay: ${Math.min(index * 55, 165)}ms">
        <span class="post-number">/${String(index + 1).padStart(2, "0")}</span>
        <div class="post-body">
          <h3>${escapeHTML(post.title)}</h3>
          <p>${escapeHTML(post.summary)}</p>
        </div>
        <div class="post-meta">
          <time datetime="${escapeHTML(post.date)}">${escapeHTML(post.date.replaceAll("-", "."))}</time>
          <span>${escapeHTML(post.category)}</span>
        </div>
      </article>
    `).join("");
  }

  function renderSocials() {
    document.getElementById("social-links").innerHTML = data.socials.map((social) => `
      <a href="${safeExternalUrl(social.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(social.name)}，在新标签页打开">
        ${escapeHTML(social.name)}
      </a>
    `).join("");
  }

  function observeReveals(scope = document) {
    const elements = scope.querySelectorAll(".reveal:not([data-reveal-bound])");
    elements.forEach((element) => {
      element.dataset.revealBound = "true";
      if (revealObserver) {
        revealObserver.observe(element);
      } else {
        element.classList.add("is-visible");
      }
    });
  }

  function setupReveals() {
    if ("IntersectionObserver" in window && !reducedMotion.matches) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -45px 0px" });
    }
    observeReveals();
  }

  function getStoredTheme() {
    try {
      const theme = localStorage.getItem("zs-portfolio-theme");
      return ["light", "dark"].includes(theme) ? theme : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    const themeToggle = document.getElementById("theme-toggle");
    const nextTheme = theme === "dark" ? "浅色" : "深色";
    themeToggle.setAttribute("aria-label", `切换为${nextTheme}主题`);
    themeToggle.title = `切换为${nextTheme}主题`;
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#111713" : "#f3f0e8";

    if (persist) {
      try {
        localStorage.setItem("zs-portfolio-theme", theme);
      } catch (error) {
        // 隐私模式下无法存储时，主题仍可在当前页面正常切换。
      }
    }
  }

  function setupTheme() {
    applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
    document.getElementById("theme-toggle").addEventListener("click", () => {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event) => {
      if (!getStoredTheme()) applyTheme(event.matches ? "dark" : "light");
    };
    if (systemTheme.addEventListener) {
      systemTheme.addEventListener("change", followSystem);
    } else {
      systemTheme.addListener(followSystem);
    }
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

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, true);
      }
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target) && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) setMenu(false);
    });
  }

  function setupScrollUI() {
    const header = document.getElementById("site-header");
    const progress = document.getElementById("scroll-progress-bar");
    const sections = [...document.querySelectorAll("main section[id]:not(#home)")];
    const navLinks = [...document.querySelectorAll(".primary-nav a[data-section]")];
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      header.classList.toggle("is-scrolled", scrollTop > 18);
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollTop / maxScroll))})`;

      let activeId = "";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= Math.min(240, window.innerHeight * 0.35)) {
          activeId = section.id;
        }
      });
      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 20) {
        activeId = "contact";
      }

      navLinks.forEach((link) => {
        const active = link.dataset.section === activeId;
        link.classList.toggle("is-active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
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

  function showToast(message) {
    const toast = document.getElementById("toast");
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
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
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    textarea.remove();
    return copied;
  }

  function setupEmailCopy() {
    const button = document.getElementById("copy-email");
    let resetTimer = null;

    button.addEventListener("click", async () => {
      try {
        const copied = await copyText(data.profile.email);
        if (!copied) throw new Error("Copy unavailable");
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "邮箱已复制");
        showToast("邮箱地址已复制，期待你的来信。");
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          button.classList.remove("is-copied");
          button.setAttribute("aria-label", "复制邮箱地址");
        }, 2400);
      } catch (error) {
        showToast(`请手动复制邮箱：${data.profile.email}`);
      }
    });
  }

  function init() {
    bindProfile();
    renderStats();
    renderAbout();
    renderSkills();
    setupWorkFilters();
    renderWorks();
    renderExperience();
    renderPosts();
    renderSocials();
    setupReveals();
    setupTheme();
    setupMenu();
    setupScrollUI();
    setupEmailCopy();
  }

  init();
})();
