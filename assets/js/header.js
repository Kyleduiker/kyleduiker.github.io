console.log("DP HEADER JS LOADED v1019 - NO HAMBURGER BORDER");

(function () {
  const LOGO_URL =
    "https://guide.duikerproperties.com/photos/brand/Powered%20by%20%281000%20x%20400%20px%29%20%281%29.png?v=1019";

  function buildHeaderHTML() {
    return `
      <div class="header-content">
        <div class="header-left">
          <button class="menu-toggle" id="dpMenuToggle" aria-label="Menu" type="button">
            <span></span><span></span><span></span>
          </button>
          <nav class="quick-links" aria-label="Quick links">
            <a href="https://www.duikerproperties.com/index.php?showagent=1#rslt">Featured Properties</a>
            <a href="https://duikerproperties.com/communities/calgary">Calgary Communities</a>
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
              <li><a href="https://duikerproperties.com/about">About Kyle</a></li>
              
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
                <button class="menu-item-with-submenu" data-submenu="buyers" type="button">
                  <span>Buyers</span>
                  <span class="submenu-toggle">+</span>
                </button>
              </li>

              <li>
                <button class="menu-item-with-submenu" data-submenu="sellers" type="button">
                  <span>Sellers</span>
                  <span class="submenu-toggle">+</span>
                </button>
              </li>

              <li><a href="https://duikerproperties.com/blog">Blog & Market Updates</a></li>
              <li><a href="https://duikerproperties.com/testimonials">Testimonials</a></li>
              <li><a href="https://duikerproperties.com/contact">Contact</a></li>
            </ul>
          </div>

          <div class="submenu-columns-container">
            <!-- Submenu Column - Search -->
            <div class="submenu-column" id="submenu-search">
              <ul>
                <li><a href="https://www.duikerproperties.com/index.php?showagent=1#rslt">Active Listings</a></li>
                <li><a href="https://www.duikerproperties.com/index.php?showagent=1#rslt">Featured Properties</a></li>
              </ul>
            </div>

            <!-- Submenu Column - Calgary Communities -->
            <div class="submenu-column" id="submenu-calgary-communities">
              <ul>
                <li><a href="https://duikerproperties.com/communities/calgary-northeast">Northeast Calgary</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-northwest">Northwest Calgary</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-southwest">Southwest Calgary</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary-southeast">Southeast Calgary</a></li>
                <li><a href="https://duikerproperties.com/communities/calgary">Calgary</a></li>
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

            <!-- Submenu Column - Buyers -->
            <div class="submenu-column" id="submenu-buyers">
              <ul>
                <li><a href="https://duikerproperties.com/buyers/guide">Buyer's Guide</a></li>
                <li><a href="https://duikerproperties.com/buyers/process">Buying Process</a></li>
                <li><a href="https://duikerproperties.com/buyers/first-time">First-Time Buyers</a></li>
                <li><a href="https://duikerproperties.com/buyers/financing">Financing Options</a></li>
              </ul>
            </div>

            <!-- Submenu Column - Sellers -->
            <div class="submenu-column" id="submenu-sellers">
              <ul>
                <li><a href="https://duikerproperties.com/sellers/guide">Seller's Guide</a></li>
                <li><a href="https://duikerproperties.com/sellers/valuation">Home Valuation</a></li>
                <li><a href="https://duikerproperties.com/sellers/preparation">Prepare Your Home</a></li>
                <li><a href="https://duikerproperties.com/sellers/marketing">Marketing Strategy</a></li>
              </ul>
            </div>
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
      return;
    }
    toggle.dataset.dpBound = "1";

    const openMenu = () => {
      toggle.classList.add("active");
      menu.classList.add("active");
      menu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = '';
      
      // Close all submenus
      const allSubmenus = menu.querySelectorAll('.submenu-column');
      allSubmenus.forEach(sub => sub.classList.remove('active'));
    };

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains("active");
      isOpen ? closeMenu() : openMenu();
    });

    // Submenu toggles
    const submenuButtons = menu.querySelectorAll('.menu-item-with-submenu');
    const submenuContainer = menu.querySelector('.submenu-columns-container');
    
    submenuButtons.forEach(button => {
      if (button.dataset.dpSubmenuBound === "1") return;
      button.dataset.dpSubmenuBound = "1";

      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const submenuId = button.getAttribute('data-submenu');
        const submenu = document.getElementById(`submenu-${submenuId}`);
        
        if (submenu) {
          const isOpen = submenu.classList.contains('active');
          
          // Close all other submenus and remove active from other buttons
          const allSubmenus = menu.querySelectorAll('.submenu-column');
          const allButtons = menu.querySelectorAll('.menu-item-with-submenu');
          allSubmenus.forEach(sub => {
            if (sub !== submenu) sub.classList.remove('active');
          });
          allButtons.forEach(btn => {
            if (btn !== button) btn.classList.remove('active');
          });
          
          // Toggle this submenu and button
          if (!isOpen) {
            // Calculate position to align with button
            const buttonRect = button.getBoundingClientRect();
            const containerRect = submenuContainer.getBoundingClientRect();
            const offsetTop = buttonRect.top - containerRect.top;
            
            // Position submenu to align with button
            submenu.style.position = 'absolute';
            submenu.style.top = `${offsetTop}px`;
            submenu.style.left = '0';
            submenu.style.right = '0';
            
            submenu.classList.add('active');
            button.classList.add('active');
          } else {
            submenu.classList.remove('active');
            button.classList.remove('active');
          }
        }
      });
    });

    // Click outside closes
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("active")) return;
      const clickedInsideMenu = menu.contains(e.target);
      const clickedToggle = toggle.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });

    // Link click closes
    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      closeMenu();
    });

    // ESC closes
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (menu.classList.contains("active")) closeMenu();
    });

    // Logo debug
    const logo = header.querySelector(".main-logo");
    if (logo && !logo.dataset.dpLogoBound) {
      logo.dataset.dpLogoBound = "1";
      logo.addEventListener("error", () => console.log("[DP Header] Logo failed:", logo.src));
      logo.addEventListener("load", () => console.log("[DP Header] Logo loaded successfully"));
    }

    console.log("[DP Header] Injected + bound OK - v1019");
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
