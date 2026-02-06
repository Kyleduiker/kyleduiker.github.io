(function () {
  function inject() {
    // Prevent double-inject
    if (document.getElementById("dp-header")) return;

    // Mark body so CSS can safely hide BoldTrail header
    document.body.classList.add("has-dp-header");

    // Build header HTML
    const header = document.createElement("header");
    header.id = "dp-header";
    header.innerHTML = `
      <div class="header-content">
        <div class="header-left">
          <button class="menu-toggle" id="dpMenuToggle" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
          <nav class="quick-links">
            <a href="/featured-properties">Featured Properties</a>
            <a href="/calgary">Calgary Communities</a>
          </nav>
        </div>

        <div class="header-center">
          <a href="/" aria-label="Home">
            <img class="main-logo" src="https://www.duikerproperties.com/wp-content/uploads/2026/02/duiker-logo.png" alt="Duiker Properties">
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
      <div class="mobile-menu" id="dpMobileMenu">
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

    // Toggle behaviour
    const toggle = document.getElementById("dpMenuToggle");
    const menu = document.getElementById("dpMobileMenu");

    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      menu.classList.toggle("active");
    });
  }

  // Run when ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
