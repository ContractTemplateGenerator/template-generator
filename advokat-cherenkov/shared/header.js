// Адвокат Черенков - Единый хедер
// Подключается на все страницы сайта

(function() {
    // Определяем корневой путь относительно текущей страницы
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    const rootPath = depth > 1 ? '../'.repeat(depth - 1) : './';

    // Check if we're on a landing page (show language toggle only there)
    const isLandingPage = path.endsWith('/advokat-cherenkov/') ||
                          path.endsWith('/advokat-cherenkov/index.html') ||
                          path.endsWith('/advokat-cherenkov/en/') ||
                          path.endsWith('/advokat-cherenkov/en/index.html') ||
                          path.endsWith('/advokat-cherenkov/zh/') ||
                          path.endsWith('/advokat-cherenkov/zh/index.html') ||
                          path.endsWith('/advokat-cherenkov/ja/') ||
                          path.endsWith('/advokat-cherenkov/ja/index.html');

    // Determine current language for active flag
    const isEnglish = path.includes('/en/');
    const isChinese = path.includes('/zh/');
    const isJapanese = path.includes('/ja/');
    const isRussian = !isEnglish && !isChinese && !isJapanese;

    // Language toggle HTML (only for landing pages)
    const langToggleHTML = isLandingPage ? `
        <div class="lang-toggle">
            <a href="${isRussian ? 'index.html' : '../index.html'}" class="lang-flag ${isRussian ? 'active' : ''}" title="Русский">🇷🇺</a>
            <a href="${isRussian ? 'en/' : (isEnglish ? './' : '../en/')}" class="lang-flag ${isEnglish ? 'active' : ''}" title="English">🇬🇧</a>
            <a href="${isRussian ? 'zh/' : (isChinese ? './' : '../zh/')}" class="lang-flag ${isChinese ? 'active' : ''}" title="中文">🇨🇳</a>
            <a href="${isRussian ? 'ja/' : (isJapanese ? './' : '../ja/')}" class="lang-flag ${isJapanese ? 'active' : ''}" title="日本語">🇯🇵</a>
        </div>
    ` : '';

    const headerHTML = `
    <header class="site-header">
        <div class="header-content">
            <a href="${rootPath}index.html" class="site-logo">Адвокат Черенков</a>

            <nav class="site-nav">
                <!-- Услуги -->
                <div class="nav-item">
                    <a href="${rootPath}uslugi/" class="nav-link">
                        Услуги <span class="arrow">▼</span>
                    </a>
                    <div class="mega-menu wide">
                        <div class="mega-menu-header">
                            <span>📋</span> Юридические услуги
                        </div>
                        <div class="mega-menu-grid">
                            <a href="${rootPath}uslugi/korporativnoe-pravo/" class="mega-menu-item">
                                <span class="icon">🏢</span>
                                <div>
                                    <div class="title">Корпоративное право</div>
                                    <div class="desc">Регистрация, споры, сделки с долями</div>
                                </div>
                            </a>
                            <a href="${rootPath}uslugi/it-pravo/" class="mega-menu-item">
                                <span class="icon">💻</span>
                                <div>
                                    <div class="title">IT-право</div>
                                    <div class="desc">IT-компании, интернет-проекты</div>
                                </div>
                            </a>
                            <a href="${rootPath}uslugi/intellektualnaya-sobstvennost/" class="mega-menu-item">
                                <span class="icon">💡</span>
                                <div>
                                    <div class="title">Интеллектуальная собственность</div>
                                    <div class="desc">Товарные знаки, патенты, авторское право</div>
                                </div>
                            </a>
                            <a href="${rootPath}uslugi/dogovornoe-pravo/" class="mega-menu-item">
                                <span class="icon">📝</span>
                                <div>
                                    <div class="title">Договорное право</div>
                                    <div class="desc">Разработка, анализ договоров</div>
                                </div>
                            </a>
                            <a href="${rootPath}uslugi/sudebnoe-predstavitelstvo/" class="mega-menu-item">
                                <span class="icon">⚖️</span>
                                <div>
                                    <div class="title">Судебное представительство</div>
                                    <div class="desc">Гражданские, арбитражные дела</div>
                                </div>
                            </a>
                            <a href="${rootPath}uslugi/ugolovnyj-process/" class="mega-menu-item">
                                <span class="icon">🛡️</span>
                                <div>
                                    <div class="title">Уголовный процесс</div>
                                    <div class="desc">Защита интересов</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Статьи -->
                <div class="nav-item">
                    <a href="${rootPath}stati/" class="nav-link">
                        Статьи <span class="arrow">▼</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-menu-header">
                            <span>📚</span> Полезные материалы
                        </div>
                        <div class="mega-menu-list">
                            <a href="${rootPath}stati/">📚 Юридические статьи</a>
                            <a href="${rootPath}faq/">❓ Частые вопросы</a>
                        </div>
                    </div>
                </div>

                <!-- Language Toggle (landing pages only) -->
                ${langToggleHTML}

                <!-- CTA -->
                <a href="mailto:m@cherenkov.pro" class="nav-link nav-cta">
                    Написать
                </a>
            </nav>

            <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <!-- Мобильное меню -->
        <nav class="mobile-nav" id="mobileNav">
            <div class="mobile-nav-section">
                <h3>Бизнес и IT</h3>
                <a href="${rootPath}uslugi/korporativnoe-pravo/">🏢 Корпоративное право</a>
                <a href="${rootPath}uslugi/it-pravo/">💻 IT-право</a>
                <a href="${rootPath}uslugi/intellektualnaya-sobstvennost/">💡 Интеллектуальная собственность</a>
            </div>
            <div class="mobile-nav-section">
                <h3>Договоры и споры</h3>
                <a href="${rootPath}uslugi/dogovornoe-pravo/">📝 Договорное право</a>
                <a href="${rootPath}uslugi/sudebnoe-predstavitelstvo/">⚖️ Судебное представительство</a>
                <a href="${rootPath}uslugi/ugolovnyj-process/">🛡️ Уголовный процесс</a>
            </div>
            <div class="mobile-nav-section">
                <h3>Информация</h3>
                <a href="${rootPath}stati/">📚 Статьи</a>
                <a href="${rootPath}faq/">❓ FAQ</a>
            </div>
        </nav>
    </header>
    `;

    // Вставляем хедер в начало body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
})();

// Функция переключения мобильного меню
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('active');
}

// Закрываем мобильное меню при клике вне его
document.addEventListener('click', function(e) {
    const mobileNav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (mobileNav && mobileNav.classList.contains('active')) {
        if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
            mobileNav.classList.remove('active');
        }
    }
});
