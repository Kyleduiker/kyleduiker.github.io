console.log("DP HEADER JS LOADED v1000");
(function () {
  function inject() {
    // Prevent double-inject
    if (document.getElementById("dp-header")) return;

    // Mark body so CSS can safely target (optional)
    document.body.classList.add("has-dp-header");

    // ✅ Use the SAME domain as your CSS/JS to avoid GitHub raw issues
    const LOGO_URL =
  "https://cdn.jsdelivr.net/gh/Kyleduiker/duikerproperties-homepage@main/photos/brand/Powered%20by%20(1000%20x%20400%20px)%20(1).png";


    // Build header HTML
    const header = document.createElement("header");
    header.id = "dp-header";
    header.innerHTML = `
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

    // Mobile shell
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

    // Insert at very top of body
    document.body.insertAdjacentElement("afterbegin", shell);
    document.body.insertAdjacentElement("afterbegin", header);

    const toggle = document.getElementById("dpMenuToggle");
    const menu = document.getElementById("dpMobileMenu");

    if (!toggle || !menu) {
      console.log("[DP Header] Missing toggle or menu", { toggle, menu });
      return;
    }

    // ✅ Defensive: if BoldTrail overlays are blocking clicks, force pointer events
    toggle.style.pointerEvents = "auto";
    header.style.pointerEvents = "auto";
    menu.style.pointerEvents = "auto";

    const openMenu = () => {
      toggle.classList.add("active");
      menu.classList.add("active");
      menu.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("dp-menu-open");
    };

    const closeMenu = () => {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("dp-menu-open");
    };

    // Toggle click
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains("active");
      isOpen ? closeMenu() : openMenu();
    });

    // Click outside closes
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("active")) return;
      const clickedInsideMenu = menu.contains(e.target);
      const clickedToggle = toggle.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });

    // Menu link closes (but still allows navigation)
    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      closeMenu();
    });

    // ESC closes menu
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closeMenu();
    });

    // ✅ If the logo fails to load, log it (helps troubleshoot path issues)
    const logo = header.querySelector(".main-logo");
    if (logo) {
      logo.addEventListener("error", () => {
        console.log("[DP Header] Logo failed to load:", logo.src);
      });
    }

    console.log("[DP Header] Injected OK");
  }

  // Run when ready (and also retry once after load to handle BoldTrail delayed DOM)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
    window.addEventListener("load", () => setTimeout(inject, 500));
  } else {
    inject();
    window.addEventListener("load", () => setTimeout(inject, 500));
  }
})();
