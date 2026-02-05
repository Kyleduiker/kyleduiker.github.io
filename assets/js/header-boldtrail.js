// Duiker Properties Header - Bold Trail Compatible with Homepage Override
(function() {
    'use strict';
    
    const PATH = window.location.pathname || '/';
    const isHome = (PATH === '/' || PATH === '' || PATH === '/index' || PATH === '/home');
    
    console.log('Duiker Properties: Current path:', PATH, '| Is homepage:', isHome);
    
    // Load header HTML from GitHub
    async function loadHeader() {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/gh/Kyleduiker/duikerproperties-homepage@main/partials/header.html?v=20260206');
            const html = await response.text();
            
            // Insert header at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // Initialize header functionality
            initHeaderFunctionality();
            console.log('Duiker Header initialized successfully');
        } catch (error) {
            console.error('Failed to load header:', error);
        }
    }
    
    // Header Menu Functionality
    function initHeaderFunctionality() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!menuToggle || !mobileMenu) {
            console.error('Header elements not found');
            return;
        }
        
        // Menu Toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
        
        // Submenu Toggle
        document.querySelectorAll('.menu-item-with-submenu').forEach(button => {
            button.addEventListener('click', function() {
                const submenuId = this.getAttribute('data-submenu');
                const submenuColumn = document.getElementById('submenu-' + submenuId);
                const toggle = this.querySelector('.submenu-toggle');
                
                if (!submenuColumn) return;
                
                const buttonRect = this.getBoundingClientRect();
                const menuRect = mobileMenu.getBoundingClientRect();
                const topPosition = buttonRect.top - menuRect.top;
                
                document.querySelectorAll('.submenu-column').forEach(col => {
                    if (col !== submenuColumn) {
                        col.classList.remove('active');
                    }
                });
                document.querySelectorAll('.submenu-toggle').forEach(t => {
                    if (t !== toggle) {
                        t.classList.remove('active');
                    }
                });
                
                if (!submenuColumn.classList.contains('active')) {
                    submenuColumn.style.top = topPosition + 'px';
                    submenuColumn.classList.add('active');
                    toggle.classList.add('active');
                } else {
                    submenuColumn.classList.remove('active');
                    toggle.classList.remove('active');
                }
            });
        });
        
        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close mobile menu when clicking any link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.querySelectorAll('.submenu-column').forEach(col => col.classList.remove('active'));
            document.querySelectorAll('.submenu-toggle').forEach(toggle => toggle.classList.remove('active'));
        }
    }
    
    // Homepage override - load custom homepage content
    async function loadHomepage() {
        if (!isHome) return;
        
        console.log('Homepage detected - loading custom content');
        
        // Hide Bold Trail elements by adding classes instead of inline styles
        const hideSelectors = [
            '#header',
            '.site-header',
            '.kv-header',
            '.hero',
            '#homepage',
            '.homepage',
            '.kv-hero',
            '#kv-social-media-widget',
            '.background-white.p-t-3.p-b-3'
        ];
        
        hideSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.classList.add('duiker-hidden');
            });
        });
        
        // Create homepage root
        let homeRoot = document.getElementById('duiker-home-root');
        if (!homeRoot) {
            homeRoot = document.createElement('div');
            homeRoot.id = 'duiker-home-root';
            const container = document.querySelector('main, #content, .content, .container-fluid');
            if (container) {
                container.prepend(homeRoot);
            } else {
                document.body.appendChild(homeRoot);
            }
        }
        
        // Load homepage HTML
        try {
            const response = await fetch('https://cdn.jsdelivr.net/gh/Kyleduiker/duikerproperties-homepage@main/index.html?v=20260206');
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract body content (skip header and mobile menu since we have those)
            const bodyContent = Array.from(doc.body.children)
                .filter(el => !el.classList.contains('header') && !el.classList.contains('mobile-menu'))
                .map(el => el.outerHTML)
                .join('');
            
            homeRoot.innerHTML = bodyContent;
            
            // Load homepage styles
            loadHomepageStyles(doc);
            
            // Initialize homepage scripts
            initHomepageScripts();
            
            console.log('✓ Homepage content loaded');
        } catch (error) {
            console.error('Homepage load failed:', error);
            homeRoot.innerHTML = '<div style="padding:40px;text-align:center;">Custom homepage failed to load.</div>';
        }
    }
    
    // Extract and load homepage styles
    function loadHomepageStyles(doc) {
        const styles = doc.querySelectorAll('style');
        styles.forEach(styleEl => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'data:text/css;base64,' + btoa(styleEl.textContent);
            document.head.appendChild(link);
        });
    }
    
    // Homepage-specific scripts
    function initHomepageScripts() {
        // Search bar functionality
        const searchBarButton = document.getElementById('searchBarButton');
        if (searchBarButton) {
            searchBarButton.addEventListener('click', () => {
                window.location.href = 'https://www.duikerproperties.com/index.php?advanced=1&display=Calgary&min=0&max=100000000&beds=0&baths=0&types%5B%5D=1&types%5B%5D=2&types%5B%5D=31&minfootage=0&maxfootage=30000&minacres=0&maxacres=0&yearbuilt=0&maxyearbuilt=0&walkscore=0&keywords=&areas%5B%5D=city%3Acalgary%3Aab&sortby=listings.visits+DESC&rtype=map';
            });
        }
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    function init() {
        loadHeader();
        loadHomepage();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
