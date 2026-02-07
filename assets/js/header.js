console.log("DP HEADER JS LOADED v1200");

(function () {
  const LOGO_URL =
    "https://guide.duikerproperties.com/photos/brand/Powered%20by%20(1000%20x%20400%20px)%20(1).png";

  function buildHeader() {
    const header = document.createElement("header");
    header.id = "dp-header";
    header.innerHTML = `
      <div class="header-content">
        <div class="header-left">
          <button class="menu-toggle" id="dpMenuToggle" type="button" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
          <nav class="quick-links" aria-label="Quick links">
            <a href="/featured-properties">Featured Properties</a>
            <a href="/calgary">Calgary Communities</a>
          </nav>
        </div>

        <div class="header-center">
          <a href="/" aria-label="Home">
            <img class="main-logo" src="${LOGO_URL}" alt="Duiker Properties">
          </a>
        </div>

        <div class="header-right">
          <a class="contact-link" href="/contact">Contact Us</a>
          <a class="phone-link" href="tel:4037973384">(403) 797-3384</a>
        </div>
      </div>
    `;
    return header;
  }

  function buildMobileShell() {
    const shell = document.createElement("div");
    shell.id = "dp-mobile-shell";
    shell.innerHTML = `
      <div class="mobile-menu" id="dpMobileMenu" aria-hidden="true">
        <div class="mobile-menu-wrapper">
          <div class="main-menu-column">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/search">Search</a></li>
              <li><a href="/calgary">Calgary Communities</a></li>
              <li><a href="/surroundingarea">Surrounding Areas</a></li>
              <li><a href="/buyers">Buyers</a></li>
              <li><a href="/sellers">Sellers</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
    return shell;
  }

  function ensureInjected() {
    // If BoldTrail re-renders, we re-inject once.
    if (!document.body) return;

    document.body.classList.add("has-dp-header");

    if (!document.getElementById("dp-mobile-shell")) {
      document.body.insertAdjacentElement("afterbegin", buildMobileShell());
      console.log("[DP] mobile shell injected");
    }

    if (!document.getElementById("dp-header")) {
      document.body.insertAdjacentElement("afterbegin", buildHeader());
      console.log("[DP] header injected");
    }
  }

  function bind() {
    // Bind only once
    if (window.__dpBoundV1200) return;
    window.__dpBoundV1200 = true;

    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("#dpMenuToggle");
      const menu = document.getElementById("dpMobileMenu");
      const header = document.getElementById("dp-header");

      // If BoldTrail wiped it, re-inject on demand
      if (!menu || !header) {
        ensureInjected();
      }

      const menuNow = document.getElementById("dpMobileMenu");
      const toggleNow = document.getElementById("dpMenuToggle");

      if (!menuNow || !toggleNow) return;

      // Toggle click
      if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = menuNow.classList.contains("active");
        if (isOpen) {
          toggleNow.classList.remove("active");
          menuNow.classList.remove("active");
          menuNow.setAttribute("aria-hidden", "true");
        } else {
          toggleNow.classList.add("active");
          menuNow.classList.add("active");
          menuNow.setAttribute("aria-hidden", "false");
        }
        return;
      }

      // Click a menu link closes (but allows navigation)
      const menuLink = e.target.closest("#dpMobileMenu a");
      if (menuLink) {
        toggleNow.classList.remove("active");
        menuNow.classList.remove("active");
        menuNow.setAttribute("aria-hidden", "true");
        return;
      }

      // Click outside closes
      const clickedInsideMenu = e.target.closest("#dpMobileMenu");
      if (!clickedInsideMenu && menuNow.classList.contains("active")) {
        toggleNow.classList.remove("active");
        menuNow.classList.remove("active");
        menuNow.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const menu = document.getElementById("dpMobileMenu");
      const toggle = document.getElementById("dpMenuToggle");
      if (!menu || !toggle) return;
      toggle.classList.remove("active");
      menu.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");
    });

    console.log("[DP] listeners bound v1200");
  }

  function init() {
    ensureInjected();
    bind();

    // If BoldTrail/Vue swaps DOM after load, patch again once.
    window.addEventListener("load", () => setTimeout(ensureInjected, 500));
    window.addEventListener("load", () => setTimeout(ensureInjected, 1500));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
