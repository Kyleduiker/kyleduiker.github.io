console.log("DP HEADER JS LOADED v1100");

/* ======================================================
   Duiker Persistent Header Injector
   - Survives BoldTrail / Vue DOM re-renders
   - Uses event delegation (no dead click handlers)
   - Auto-repairs header + mobile menu
   ====================================================== */

(function () {
  const LOGO_URL =
    "https://guide.duikerproperties.com/photos/brand/Powered%20by%20%281000%20x%20400%20px%29%20%281%29.png?v=1100";

  /* ---------- BUILD HTML ---------- */

  function headerHTML() {
    return `
      <div class="header-content">
        <div class="header-left">
          <button class="menu-toggle" id="dpMenuToggle" aria-label="Menu" type="button">
            <span></span><span></span><span></span>
          </button>
          <nav class="quick-links">
            <a href="/featured-properties">Featured Properties</a>
            <a href="/calgary">Calgary Communities</a>
          </nav>
        </div>

        <div class="header-center">
          <a href="/">
            <img class="main-logo" src="${LOGO_URL}" alt="Duiker Properties">
          </a>
        </div>

        <div class="header-right">
          <a class="contact-link" href="/contact">Contact Us</a>
          <a class="phone-link" href="tel:4037973384">(403) 797-3384</a>
        </div>
      </div>
    `;
  }

  function mobileHTML() {
    return `
      <div class="mobile-menu" id="dpMobileMenu">
        <div class="mobile-menu-wrapper">
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
    `;
  }

  /* ---------- ENSURE HEADER EXISTS ---------- */

  function ensureHeader() {
    document.body.classList.add("has-dp-header");

    let header = document.getElementById("dp-header");

    if (!header) {
      header = document.createElement("header");
      header.id = "dp-header";
      header.innerHTML = headerHTML();
      document.body.prepend(header);
      console.log("[DP] Header created");
    }

    if (!document.getElementById("dp-mobile-shell")) {
      const shell = document.createElement("div");
      shell.id = "dp-mobile-shell";
      shell.innerHTML = mobileHTML();
      document.body.prepend(shell);
      console.log("[DP] Mobile shell created");
    }
  }

  /* ---------- MENU STATE ---------- */

  function openMenu() {
    const toggle = document.getElementById("dpMenuToggle");
    const menu = document.getElementById("dpMobileMenu");
    if (!toggle || !menu) return;

    toggle.classList.add("active");
    menu.classList.add("active");
    document.documentElement.classList.add("dp-menu-open");
  }

  function closeMenu() {
    const toggle = document.getElementById("dpMenuToggle");
    const menu = document.getElementById("dpMobileMenu");
    if (!toggle || !menu) return;

    toggle.classList.remove("active");
    menu.classList.remove("active");
    document.documentElement.classList.remove("dp-menu-open");
  }

  /* ---------- EVENT DELEGATION ---------- */

  function bindGlobalClicks() {
    if (window.__dpClicksBound) return;
    window.__dpClicksBound = true;

    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("#dpMenuToggle");
      const insideMenu = e.target.closest("#dpMobileMenu");

      if (toggle) {
        e.preventDefault();
        const menu = document.getElementById("dpMobileMenu");
        menu?.classList.contains("active") ? closeMenu() : openMenu();
        return;
      }

      if (!insideMenu) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    console.log("[DP] Global click delegation bound");
  }

  /* ---------- WATCH FOR BOLDTRAIL DOM REPLACEMENT ---------- */

  function watchDOM() {
    const observer = new MutationObserver(() => {
      if (!document.getElementById("dp-header")) {
        console.log("[DP] Header lost → restoring");
        ensureHeader();
      }
      if (!document.getElementById("dpMobileMenu")) {
        console.log("[DP] Mobile menu lost → restoring");
        ensureHeader();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- INIT ---------- */

  function init() {
    ensureHeader();
    bindGlobalClicks();
    watchDOM();
    console.log("[DP] Persistent header running");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
