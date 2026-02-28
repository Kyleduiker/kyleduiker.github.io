console.log("DP HEADER JS LOADED v1021 - SMOOTH LOAD");

(function () {
  const VERSION = "1021";
  const LOGO_URL =
    "https://guide.duikerproperties.com/photos/brand/Powered%20by%20%281000%20x%20400%20px%29%20%281%29.png?v=" + VERSION;

  function buildHeaderHTML() {
    return `
      <div class="header-content">
        <div class="header-left">
          <button class="menu-toggle" id="dpMenuToggle" aria-label="Menu" type="button">
            <span></span><span></span><span></span>
          </button>
          <nav class="quick-links" aria-label="Quick links">
            <a href="#" onclick="history.back(); return false;">Back</a>
            <a href="https://duikerproperties.com/">Home</a>
          </nav>
        </div>

        <div class="header-center">
          <a href="https://duikerproperties.com/" aria-label="Home">
            <img class="main-logo" src="${LOGO_URL}" alt="Duiker Properties">
          </a>
        </div>

        <div class="header-right">
          <a class="contact-link" href="https://duikerproperties.com/contact">Contact Us</a>
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
              <li><a href="https://duikerproperties.com/">Home</a></li>
              <li><a href="https://guide.duikerproperties.com/about/">About Kyle</a></li>

              <li>
                <button class="menu-item-with-submenu" data-submenu="search" type="button">
                  <span>Search</span>
                  <span class="submenu-toggle">+</span>
                </button>
              </li>

              <li>
                <button class="menu-item-with-submenu" data-submenu="calgary-communities" type="button">
                  <span>Calgary Communities</span>
                  <span class="submenu-toggle">+</span>
                </button>
              </li>

              <li>
                <button class="menu-item-with-submenu" data-submenu="surrounding-areas" type="button">
                  <span>Surrounding Areas</span>
                  <span class="submenu-toggle">+</span>
                </button>
              </li>

              <li>
                <button class="menu-item-with-submenu" data-submenu="resources" type="button">
                  <span>Resources</span>
                  <span class="submenu-toggle">+</span>
                </button>
              </li>

              <li><a href="https://guide.duikerproperties.com/blog">Blog & Market Updates</a></li>
              <li><a href="https://duikerproperties.com/testimonials">Testimonials</a></li>
              <li><a href="https://duikerproperties.com/contact">Contact</a></li>
            </ul>
          </div>

          <div class="submenu-columns-container">
            <!-- Submenu Column - Search -->
            <div class="submenu-column" id="submenu-search">
              <ul>
                <li><a href="https://www.duikerproperties.com/index.php?showagent=1#rslt">Active Listings</a></li>
                <li><a href="https://www.duikerproperties.com/index.php?showagent=1&rtype=list#rslt">Featured Properties</a></li>
                <li><button class="submenu-link-btn" data-open-submenu="calgary-communities" type="button">Calgary Communities ›</button></li>
                <li><button class="submenu-link-btn" data-open-submenu="surrounding-areas" type="button">Surrounding Areas ›</button></li>
              </ul>
            </div>

            <!-- Submenu Column - Calgary Communities -->
            <div class="submenu-column" id="submenu-calgary-communities">
              <ul>
                <li><a href="https://duikerproperties.com/communities/calgary-northeast">Calgary</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-northwest">Calgary City Center</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-southwest">Calgary East</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-southeast">Calgary West</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-citycenter">Calgary North</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-southeast">Calgary North East</a></li>
                <li><a href="https://guide.duikerproperties.com/communities/calgary-lake-communities">Calgary North West</a></li>
                <li><a href="https://guide.duikerproperties.com/communities/calgary-lake-communities">Calgary South</a></li>
                <li><a href="https://guide.duikerproperties.com/communities/calgary-lake-communities">Calgary South East</a></li>
              </ul>
            </div>

            <!-- Submenu Column - Surrounding Areas -->
            <div class="submenu-column" id="submenu-surrounding-areas">
              <ul>
                <li><a href="https://duikerproperties.com/communities/chestermere">Chestermere</a></li>
                <li><a href="https://duikerproperties.com/communities/airdrie">Airdrie</a></li>
                <li><a href="https://duikerproperties.com/communities/cochrane">Cochrane</a></li>
                <li><a href="https://duikerproperties.com/communities/okotoks">Okotoks</a></li>
              </ul>
            </div>

            <!-- Submenu Column - Resources -->
            <div class="submenu-column" id="submenu-resources">
              <ul>
                <li><a href="https://duikerproperties.com/buyers/guide">Buyer's Guide</a></li>
                <li><a href="https://duikerproperties.com/sellers/guide">Seller's Guide</a></li>
                <li><a href="https://duikerproperties.com/resources/mortgages">Mortgages</a></li>
                <li><a href="https://duikerproperties.com/resources/deposits">Deposits</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function bindSubmenuLinkBtns(menu, mainMenuButtons) {
    // These are the "Calgary Communities ›" and "Surrounding Areas ›" buttons inside the Search submenu
    menu.querySelectorAll(".submenu-link-btn").forEach((btn) => {
      if (btn.dataset.dpLinkBound === "1") return;
      btn.dataset.dpLinkBound = "1";

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const targetId = btn.getAttribute("data-open-submenu");
        const targetSubmenu = document.getElementById(`submenu-${targetId}`);
        if (!targetSubmenu) return;

        // Close all submenus & deactivate all main buttons
        menu.querySelectorAll(".submenu-column").forEach((sub) => sub.classList.remove("active"));
        menu.querySelectorAll(".menu-item-with-submenu").forEach((b) => b.classList.remove("active"));

        // Activate the target submenu
        targetSubmenu.classList.add("active");

        // Highlight the matching main menu button
        const matchingBtn = menu.querySelector(`.menu-item-with-submenu[data-submenu="${targetId}"]`);
        if (matchingBtn) matchingBtn.classList.add("active");
      });
    });
  }

  function ensureInjected() {
    document.body.classList.add("has-dp-header");

    if (document.body.classList.contains("dp-header-ready")) {
      document.documentElement.classList.add("dp-ready");
      return;
    }

    // 1) Header
    let header = document.getElementById("dp-header");
    if (!header) {
      header = document.createElement("header");
      header.id = "dp-header";
      header.innerHTML = buildHeaderHTML();
      document.body.insertAdjacentElement("afterbegin", header);
    } else if (!header.querySelector("#dpMenuToggle")) {
      header.innerHTML = buildHeaderHTML();
    }

    // 2) Mobile shell AFTER header
    let shell = document.getElementById("dp-mobile-shell");
    if (!shell) {
      shell = document.createElement("div");
      shell.id = "dp-mobile-shell";
      shell.innerHTML = buildMobileShellHTML();
      header.insertAdjacentElement("afterend", shell);
    }

    // 3) Menu reference
    let menu = document.getElementById("dpMobileMenu");
    if (!menu) {
      shell.innerHTML = buildMobileShellHTML();
      menu = document.getElementById("dpMobileMenu");
    }

    const toggle = document.getElementById("dpMenuToggle");
    if (!toggle || !menu) return;

    // Bind toggle once
    if (toggle.dataset.dpBound !== "1") {
      toggle.dataset.dpBound = "1";

      const openMenu = () => {
        toggle.classList.add("active");
        menu.classList.add("active");
        menu.setAttribute("aria-hidden", "false");
        document.body.classList.add("dp-menu-open");
      };

      const closeMenu = () => {
        toggle.classList.remove("active");
        menu.classList.remove("active");
        menu.setAttribute("aria-hidden", "true");
        document.body.classList.remove("dp-menu-open");
        menu.querySelectorAll(".submenu-column").forEach((sub) => sub.classList.remove("active"));
        menu.querySelectorAll(".menu-item-with-submenu").forEach((btn) => btn.classList.remove("active"));
      };

      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.contains("active") ? closeMenu() : openMenu();
      });

      // Main submenu toggles
      menu.querySelectorAll(".menu-item-with-submenu").forEach((button) => {
        if (button.dataset.dpSubmenuBound === "1") return;
        button.dataset.dpSubmenuBound = "1";

        button.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const submenuId = button.getAttribute("data-submenu");
          const submenu = document.getElementById(`submenu-${submenuId}`);
          if (!submenu) return;

          const isOpen = submenu.classList.contains("active");

          menu.querySelectorAll(".submenu-column").forEach((sub) => {
            if (sub !== submenu) sub.classList.remove("active");
          });
          menu.querySelectorAll(".menu-item-with-submenu").forEach((btn) => {
            if (btn !== button) btn.classList.remove("active");
          });

          if (!isOpen) {
            submenu.classList.add("active");
            button.classList.add("active");
          } else {
            submenu.classList.remove("active");
            button.classList.remove("active");
          }
        });
      });

      // Bind the submenu link buttons (Calgary Communities › / Surrounding Areas › inside Search)
      bindSubmenuLinkBtns(menu);

      // Global listeners ONCE
      if (document.documentElement.dataset.dpGlobalBound !== "1") {
        document.documentElement.dataset.dpGlobalBound = "1";

        document.addEventListener("click", (e) => {
          if (!menu.classList.contains("active")) return;
          const clickedInsideMenu = menu.contains(e.target);
          const clickedToggle = toggle.contains(e.target);
          if (!clickedInsideMenu && !clickedToggle) {
            toggle.classList.remove("active");
            menu.classList.remove("active");
            menu.setAttribute("aria-hidden", "true");
            document.body.classList.remove("dp-menu-open");
            menu.querySelectorAll(".submenu-column").forEach((sub) => sub.classList.remove("active"));
            menu.querySelectorAll(".menu-item-with-submenu").forEach((btn) => btn.classList.remove("active"));
          }
        });

        document.addEventListener("keydown", (e) => {
          if (e.key !== "Escape") return;
          if (!menu.classList.contains("active")) return;
          toggle.classList.remove("active");
          menu.classList.remove("active");
          menu.setAttribute("aria-hidden", "true");
          document.body.classList.remove("dp-menu-open");
          menu.querySelectorAll(".submenu-column").forEach((sub) => sub.classList.remove("active"));
          menu.querySelectorAll(".menu-item-with-submenu").forEach((btn) => btn.classList.remove("active"));
        });
      }

      // Link click closes menu
      menu.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        toggle.classList.remove("active");
        menu.classList.remove("active");
        menu.setAttribute("aria-hidden", "true");
        document.body.classList.remove("dp-menu-open");
        menu.querySelectorAll(".submenu-column").forEach((sub) => sub.classList.remove("active"));
        menu.querySelectorAll(".menu-item-with-submenu").forEach((btn) => btn.classList.remove("active"));
      });
    }

    // Mark stable + show page
    requestAnimationFrame(() => {
      document.body.classList.add("dp-header-ready");
      document.documentElement.classList.add("dp-ready");
    });

    console.log("[DP Header] Injected + bound OK - v" + VERSION);
  }

  function run() {
    ensureInjected();
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
