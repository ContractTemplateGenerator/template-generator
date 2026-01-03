/**
 * Relationship Privacy Hub - Shared JavaScript
 * Handles sidebar toggle, page highlighting, and smooth scroll
 */

(function() {
    'use strict';

    // ============================
    // SIDEBAR TOGGLE (Mobile)
    // ============================
    window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
        const overlay = document.querySelector('.overlay');

        if (sidebar) {
            sidebar.classList.toggle('open');
        }
        if (overlay) {
            overlay.classList.toggle('show');
        }

        // Prevent body scroll when sidebar is open
        document.body.style.overflow = sidebar && sidebar.classList.contains('open') ? 'hidden' : '';
    };

    // Close sidebar when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
        const toggle = document.querySelector('.mobile-nav-toggle');

        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
                toggleSidebar();
            }
        }
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        }
    });

    // ============================
    // HIGHLIGHT CURRENT PAGE
    // ============================
    window.highlightCurrentPage = function() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item[data-page]');

        navItems.forEach(function(item) {
            const pageName = item.getAttribute('data-page');

            // Check if current path contains this page name
            if (pageName && currentPath.includes(pageName)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Special case for hub index page
        if (currentPath.endsWith('/relationship-privacy/') || currentPath.endsWith('/relationship-privacy/index.html')) {
            // No specific nav item to highlight for the hub home
            // Optionally, you could add an "Overview" item and highlight it
        }
    };

    // ============================
    // SMOOTH SCROLL
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile sidebar after navigation
                const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
                if (sidebar && sidebar.classList.contains('open')) {
                    toggleSidebar();
                }
            }
        });
    });

    // ============================
    // SIDEBAR LINK CLICK (Mobile)
    // ============================
    // Close sidebar when a nav link is clicked on mobile
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-item') || e.target.closest('.nav-item')) {
            const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open') && window.innerWidth <= 900) {
                // Small delay to allow navigation
                setTimeout(function() {
                    toggleSidebar();
                }, 150);
            }
        }
    });

    // ============================
    // INITIALIZE ON DOM READY
    // ============================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Highlight current page after a brief delay to ensure sidebar is loaded
        setTimeout(highlightCurrentPage, 100);

        // Enable smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // ============================
    // RESIZE HANDLER
    // ============================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close sidebar if window is resized to desktop
            if (window.innerWidth > 900) {
                const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
                const overlay = document.querySelector('.overlay');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        }, 250);
    });

})();
