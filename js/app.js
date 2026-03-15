(function () {
  "use strict";

  var DATA = PORTFOLIO_DATA;

  var ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  };

  function renderSidebar() {
    var titleEl = document.getElementById("sidebar-title");
    var bioEl = document.getElementById("sidebar-bio");
    if (titleEl) titleEl.textContent = DATA.meta.title;
    if (bioEl) bioEl.textContent = DATA.meta.tagline;

    var socials = document.getElementById("sidebar-socials");
    if (socials) {
      socials.innerHTML =
        '<li><a href="' + DATA.meta.github + '" target="_blank" rel="noopener" aria-label="GitHub">' + ICONS.github + '</a></li>' +
        '<li><a href="' + DATA.meta.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + ICONS.linkedin + '</a></li>' +
        '<li><a href="' + DATA.meta.twitter + '" target="_blank" rel="noopener" aria-label="Twitter">' + ICONS.twitter + '</a></li>' +
        '<li><a href="mailto:' + DATA.meta.email + '" aria-label="Email">' + ICONS.email + '</a></li>';
    }
  }

  function renderAbout() {
    var el = document.getElementById("about-content");
    if (!el) return;
    el.innerHTML = DATA.about
      .map(function (p) { return '<p class="about-paragraph">' + p + "</p>"; })
      .join("");
  }

  function renderExperience() {
    var el = document.getElementById("experience-list");
    if (!el) return;
    el.innerHTML = DATA.experience
      .map(function (exp) {
        var leftCol = exp.image
          ? '<div class="card-thumb"><img src="' + exp.image + '" alt="' + exp.company + '" loading="lazy"></div>'
          : '<div class="exp-date">' + exp.date + "</div>";
        var titleHtml = exp.link
          ? '<a href="' + exp.link + '" target="_blank" rel="noopener">' + exp.role + ' · <span class="company">' + exp.company + '</span> <span class="link-icon">' + ICONS.external + "</span></a>"
          : exp.role + ' · <span class="company">' + exp.company + "</span>";
        return (
          '<div class="exp-item' + (exp.link ? ' has-link' : '') + '" data-keywords="' + (exp.tags || []).join(" ").toLowerCase() + " " + exp.company.toLowerCase() + '">' +
          leftCol +
          '<div class="exp-info">' +
          "<h3>" + titleHtml + "</h3>" +
          (exp.image ? '<div class="exp-date">' + exp.date + "</div>" : "") +
          '<ul class="exp-bullets">' +
          exp.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") +
          "</ul>" +
          '<div class="exp-tags">' +
          (exp.tags || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") +
          "</div></div></div>"
        );
      })
      .join("");

    var leaderEl = document.getElementById("leadership-list");
    if (!leaderEl) return;
    leaderEl.innerHTML =
      '<div class="leadership-section">' +
      DATA.leadership
        .map(function (l) {
          return (
            '<div class="leadership-item">' +
            "<h4>" + l.role + '</h4><span class="org">' + l.org + '</span><div class="date">' + l.date + "</div>" +
            "<p>" + l.description + "</p></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="resume-link"><a href="' + DATA.meta.resume + '" target="_blank" rel="noopener" class="inline-link">View Full Resume <span class="arrow">&rarr;</span></a></div>';
  }

  function renderProjects() {
    var el = document.getElementById("featured-projects");
    if (!el) return;
    el.innerHTML = DATA.featuredProjects
      .map(function (p) {
        var leftCol = p.image
          ? '<div class="card-thumb"><img src="' + p.image + '" alt="' + p.title + '" loading="lazy"></div>'
          : '<div class="project-meta">' + (p.badge ? '<span class="project-badge">' + p.badge + "</span>" : "") + "</div>";
        return (
          '<div class="project-card" data-keywords="' + (p.tags || []).join(" ").toLowerCase() + '">' +
          leftCol +
          '<div class="project-info">' +
          (p.image && p.badge ? '<span class="project-badge">' + p.badge + "</span>" : "") +
          "<h3>" +
          (p.github
            ? '<a href="' + p.github + '" target="_blank" rel="noopener">' + p.title + ' <span class="link-icon">' + ICONS.external + "</span></a>"
            : p.title) +
          "</h3>" +
          "<p>" + p.description + "</p>" +
          '<div class="exp-tags">' +
          (p.tags || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") +
          "</div></div></div>"
        );
      })
      .join("");
  }

  function renderAchievements() {
    var el = document.getElementById("achievements-list");
    if (!el) return;
    el.innerHTML = DATA.achievements
      .map(function (a) {
        var leftCol = a.image
          ? '<div class="card-thumb"><img src="' + a.image + '" alt="' + a.title + '" loading="lazy"></div>'
          : '<div class="achievement-year">' + a.year + "</div>";
        var titleHtml = a.link
          ? '<a href="' + a.link + '" target="_blank" rel="noopener">' + a.title + ' <span class="link-icon">' + ICONS.external + "</span></a>"
          : a.title;
        return (
          '<div class="achievement-item' + (a.link ? ' has-link' : '') + '" data-keywords="hackathon ' + a.title.toLowerCase() + '">' +
          leftCol +
          '<div class="achievement-info">' +
          (a.image ? '<div class="achievement-year">' + a.year + "</div>" : "") +
          "<h3>" + titleHtml + "</h3>" +
          "<p>" + a.description + "</p></div></div>"
        );
      })
      .join("");
  }

  /* Mouse spotlight */
  function initSpotlight() {
    document.addEventListener("mousemove", function (e) {
      document.body.style.setProperty("--mouse-x", e.clientX + "px");
      document.body.style.setProperty("--mouse-y", e.clientY + "px");
    });
  }

  /* Nav scroll-spy */
  function initScrollSpy() {
    var sections = document.querySelectorAll(".section[data-section]");
    var links = document.querySelectorAll(".nav-link[data-section]");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.dataset.section;
            links.forEach(function (l) {
              l.classList.toggle("active", l.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* Mobile nav */
  function initMobileNav() {
    var toggle = document.getElementById("mobile-toggle");
    var nav = document.getElementById("mobile-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  function init() {
    renderSidebar();
    renderAbout();
    renderExperience();
    renderProjects();
    renderAchievements();
    initSpotlight();
    initScrollSpy();
    initMobileNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
