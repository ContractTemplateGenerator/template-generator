// Shared header loader with caching
(function() {
  const CACHE_KEY = 'terms-law-header-v2-mobile';
  const CACHE_TTL = 3600000; // 1 hour in ms
  const headerEl = document.getElementById('site-header');

  if (!headerEl) return;

  // Try cache first for instant load
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { html, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        headerEl.innerHTML = html;
        return; // Done - used cache
      }
    } catch (e) {}
  }

  // Fetch fresh header
  fetch('/shared/header.html')
    .then(r => r.text())
    .then(html => {
      headerEl.innerHTML = html;
      // Cache it
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        html: html,
        timestamp: Date.now()
      }));
    })
    .catch(() => {
      // Fallback inline header if fetch fails
      headerEl.innerHTML = `
        <header class="site-header">
          <div class="header-content">
            <nav class="header-nav">
              <a href="/" class="nav-link home-logo"><span class="logo-text">Terms.Law</span></a>
              <a href="mailto:owner@terms.law" class="header-email-cta">Email</a>
            </nav>
          </div>
        </header>`;
    });
})();
