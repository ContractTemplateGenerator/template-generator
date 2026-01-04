/**
 * Maduro Legal Hub - Trilingual Language Switcher
 * Supports: English (en), Spanish (es), Russian (ru)
 * Stores preference in localStorage with key 'maduro-hub-lang'
 */
(function() {
    'use strict';

    const LANG_KEY = 'maduro-hub-lang';
    const DEFAULT_LANG = 'en';
    const SUPPORTED_LANGS = ['en', 'es', 'ru'];

    /**
     * Get the current language from localStorage or default
     */
    function getCurrentLang() {
        const stored = localStorage.getItem(LANG_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) {
            return stored;
        }
        return DEFAULT_LANG;
    }

    /**
     * Set the current language in localStorage
     */
    function setCurrentLang(lang) {
        if (SUPPORTED_LANGS.includes(lang)) {
            localStorage.setItem(LANG_KEY, lang);
        }
    }

    /**
     * Apply the language to all elements with data-lang attribute
     */
    function applyLanguage(lang) {
        // Hide all language-specific elements
        document.querySelectorAll('[data-lang]').forEach(function(el) {
            const elLang = el.getAttribute('data-lang');
            if (elLang === lang) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });

        // Update language toggle buttons
        document.querySelectorAll('[data-lang-btn]').forEach(function(btn) {
            const btnLang = btn.getAttribute('data-lang-btn');
            if (btnLang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update the html lang attribute
        document.documentElement.lang = lang;
    }

    /**
     * Initialize language switcher
     */
    function init() {
        // Apply stored language preference on page load
        const currentLang = getCurrentLang();
        applyLanguage(currentLang);

        // Set up click handlers for language toggle buttons
        document.querySelectorAll('[data-lang-btn]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedLang = this.getAttribute('data-lang-btn');
                if (selectedLang && SUPPORTED_LANGS.includes(selectedLang)) {
                    setCurrentLang(selectedLang);
                    applyLanguage(selectedLang);
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use if needed
    window.MaduroLangSwitcher = {
        getCurrentLang: getCurrentLang,
        setCurrentLang: setCurrentLang,
        applyLanguage: applyLanguage,
        SUPPORTED_LANGS: SUPPORTED_LANGS
    };
})();
