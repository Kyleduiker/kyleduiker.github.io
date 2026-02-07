console.log("DP HEADER JS LOADED v1001");

(function () {
  const LOGO_URL =
    "https://guide.duikerproperties.com/photos/brand/Powered%20by%20%281000%20x%20400%20px%29%20%281%29.png?v=1002";

  function buildHeaderHTML() {
    return `
      <div class="header-content">
        <div class="header-left">
          <button class="menu-toggle" id="dpMenuToggle" aria-label="Menu" type="button">
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
  }

  function buildMobileShellHTML() {
    return `
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
  }

  function ensureInjected() {
    // Mark body so CSS can safely hide BoldTrail header
    document.body.classList.add("has-dp-header");

    // 1) Ensure header exists
    let header = document.getElementById("dp-header");
    if (!header) {
      header = document.createElement("header");
      header.id = "dp-header";
      header.innerHTML = buildHeaderHTML();
      document.body.insertAdjacentElement("afterbegin", header);
      console.log("[DP Header] Header created");
    } else if (!header.querySelector("#dpMenuToggle")) {
      // header exists but is empty/broken
      header.innerHTML = buildHeaderHTML();
      console.log("[DP Header] Header repaired");
    }

    // 2) Ensure mobile shell exists
    let shell = document.getElementById("dp-mobile-shell");
    if (!shell) {
      shell = document.createElement("div");
      shell.id = "dp-mobile-shell";
      shell.innerHTML = buildMobileShellHTML();
      document.body.insertAdjacentElement("afterbegin", shell);
      console.log("[DP Header] Mobile shell created");
    }

    // 3) Ensure mobile menu exists inside shell
    let menu = document.getElementById("dpMobileMenu");
    if (!menu) {
      shell.innerHTML = buildMobileShellHTML();
      menu = document.getElementById("dpMobileMenu");
      console.log("[DP Header] Mobile menu repaired");
    }

    // 4) Wire up click handlers (only once)
    const toggle = document.getElementById("dpMenuToggle");
    menu = document.getElementById("dpMobileMenu");

    if (!toggle || !menu) {
      console.log("[DP Header] Still missing toggle/menu after inject", { toggle, menu });
      return;
    }

    if (toggle.dataset.dpBound === "1") {
      // already bound
      return;
    }
    toggle.dataset.dpBound = "1";

    const openMenu = () => {
      toggle.classList.add("active");
      menu.classList.add("active");
      menu.setAttribute("aria-hidden", "false");
    };

    const closeMenu = () => {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");
    };

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains("active");
      isOpen ? closeMenu() : openMenu();
    });

    // click outside closes
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("active")) return;
      const clickedInsideMenu = menu.contains(e.target);
      const clickedToggle = toggle.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });

    // link click closes
    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      closeMenu();
    });

    // ESC closes
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closeMenu();
    });

    // Logo debug
    const logo = header.querySelector(".main-logo");
    if (logo && !logo.dataset.dpLogoBound) {
      logo.dataset.dpLogoBound = "1";
      logo.addEventListener("error", () => console.log("[DP Header] Logo failed:", logo.src));
      logo.addEventListener("load", () => console.log("[DP Header] Logo loaded"));
    }

    console.log("[DP Header] Injected + bound OK");
  }

  function run() {
    ensureInjected();
    // Retry a couple times in case BoldTrail re-renders the DOM
    setTimeout(ensureInjected, 500);
    setTimeout(ensureInjected, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
    window.addEventListener("load", run);
  } else {
    run();
  }
})();
