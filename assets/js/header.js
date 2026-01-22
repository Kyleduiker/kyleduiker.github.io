// Header Menu Functionality
(function() {
    // Wait for DOM to be ready
    function initHeader() {
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

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Helper function to close menu
        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.querySelectorAll('.submenu-column').forEach(col => col.classList.remove('active'));
            document.querySelectorAll('.submenu-toggle').forEach(toggle => toggle.classList.remove('active'));
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeader);
    } else {
        initHeader();
    }
})();
