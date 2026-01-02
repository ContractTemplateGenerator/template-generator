// Language Switcher - Remembers user's language preference
(function() {
    const LANG_KEY = 'thai-hub-lang';
    const currentPath = window.location.pathname;

    // Detect if we're on Russian or English version
    const isRussian = currentPath.includes('/Thai/ru/');
    const currentLang = isRussian ? 'ru' : 'en';

    // Get stored preference
    const storedLang = localStorage.getItem(LANG_KEY);

    // If user has a stored preference different from current page, redirect
    if (storedLang && storedLang !== currentLang) {
        let newPath;
        if (storedLang === 'ru' && !isRussian) {
            // User wants Russian, but on English page - redirect to Russian
            newPath = currentPath.replace('/Thai/', '/Thai/ru/');
        } else if (storedLang === 'en' && isRussian) {
            // User wants English, but on Russian page - redirect to English
            newPath = currentPath.replace('/Thai/ru/', '/Thai/');
        }
        if (newPath && newPath !== currentPath) {
            window.location.replace(newPath);
            return;
        }
    }

    // Set up click handlers for language flags
    document.addEventListener('DOMContentLoaded', function() {
        const langFlags = document.querySelectorAll('.lang-flag');
        langFlags.forEach(function(flag) {
            flag.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href) {
                    // Determine which language was selected
                    const selectedLang = href.includes('/Thai/ru/') ? 'ru' : 'en';
                    localStorage.setItem(LANG_KEY, selectedLang);
                }
            });
        });
    });
})();
