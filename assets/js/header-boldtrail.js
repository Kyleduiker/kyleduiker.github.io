// Duiker Properties Header - Bold Trail Compatible
(function() {
    'use strict';
    
    // Hide Bold Trail's default header
    function hideBoldTrailHeader() {
        const style = document.createElement('style');
        style.textContent = `
            #header { display: none !important; }
            body { padding-top: 0 !important; margin-top: 0 !important; }
        `;
        document.head.appendChild(style);
    }
    
    // Load header HTML from GitHub
    async function loadHeader() {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/gh/Kyleduiker/duikerproperties-homepage@main/partials/header.html');
            const html = await response.text();
            
            // Insert header at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // Initialize header functionality
            if (typeof window.initDuikerHeader === 'function') {
                window.initDuikerHeader();
            } else {
                initHeaderFunctionality();
            }
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
            // Prevent body scroll when menu is open
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
                
                // Get the position of the clicked button
                const buttonRect = this.getBoundingClientRect();
                const menuRect = mobileMenu.getBoundingClientRect();
                const topPosition = buttonRect.top - menuRect.top;
                
                // Close all other submenus
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
                
                // Position and toggle current submenu
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
        
        // Desktop mega menu functionality
        document.querySelectorAll('.mega-menu-trigger').forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Close all mega menus
                document.querySelectorAll('.mega-menu-trigger').forEach(t => {
                    t.setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current one
                if (!isExpanded) {
                    this.setAttribute('aria-expanded', 'true');
                }
            });
            
            // Hover functionality for desktop
            const parentLi = trigger.closest('li');
            if (parentLi) {
                parentLi.addEventListener('mouseenter', function() {
                    document.querySelectorAll('.mega-menu-trigger').forEach(t => {
                        t.setAttribute('aria-expanded', 'false');
                    });
                    trigger.setAttribute('aria-expanded', 'true');
                });
                
                parentLi.addEventListener('mouseleave', function() {
                    trigger.setAttribute('aria-expanded', 'false');
                });
            }
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
        
        // Helper function to close menu
        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.querySelectorAll('.submenu-column').forEach(col => col.classList.remove('active'));
            document.querySelectorAll('.submenu-toggle').forEach(toggle => toggle.classList.remove('active'));
        }
        
        console.log('Duiker Header initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        hideBoldTrailHeader();
        loadHeader();
    }
})();

