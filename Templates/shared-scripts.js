/**
 * SHARED JAVASCRIPT FOR CONTRACT LIBRARY
 * Common functionality used across landing page and template pages
 */

// ============================================
// TAB NAVIGATION
// ============================================

function initTabs() {
  const tabButtons = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');

  if (tabButtons.length === 0) return;

  tabButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const targetId = button.getAttribute('aria-controls');
      const target = document.getElementById(targetId);

      if (!target) return;

      // Update buttons
      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      });

      target.classList.add('active');
      target.setAttribute('aria-hidden', 'false');

      // Track analytics
      trackEvent('tab_click', {
        tab_name: button.textContent.trim(),
        page: window.location.pathname
      });
    });

    // Keyboard navigation
    button.addEventListener('keydown', (e) => {
      let newIndex;
      const currentIndex = Array.from(tabButtons).indexOf(button);

      switch (e.key) {
        case 'ArrowLeft':
          newIndex = currentIndex - 1;
          if (newIndex < 0) newIndex = tabButtons.length - 1;
          tabButtons[newIndex].focus();
          tabButtons[newIndex].click();
          e.preventDefault();
          break;
        case 'ArrowRight':
          newIndex = currentIndex + 1;
          if (newIndex >= tabButtons.length) newIndex = 0;
          tabButtons[newIndex].focus();
          tabButtons[newIndex].click();
          e.preventDefault();
          break;
        case 'Home':
          tabButtons[0].focus();
          tabButtons[0].click();
          e.preventDefault();
          break;
        case 'End':
          tabButtons[tabButtons.length - 1].focus();
          tabButtons[tabButtons.length - 1].click();
          e.preventDefault();
          break;
      }
    });
  });
}

// ============================================
// ACCORDION / EXPANDABLE SECTIONS
// ============================================

function initAccordions() {
  const toggleButtons = document.querySelectorAll('[data-expand-target]');

  toggleButtons.forEach((button) => {
    const targetId = button.getAttribute('data-expand-target');
    const target = document.getElementById(targetId);
    const card = button.closest('.category-card') || button.closest('.card');

    if (!target) return;

    const openLabel = button.getAttribute('data-open-label') || 'Show details';
    const closeLabel = button.getAttribute('data-close-label') || 'Hide details';
    const labelEl = button.querySelector('.toggle-label');

    // Initialize as collapsed
    button.setAttribute('aria-expanded', 'false');
    target.setAttribute('aria-hidden', 'true');
    if (labelEl) labelEl.textContent = openLabel;

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;

      button.setAttribute('aria-expanded', newState.toString());
      target.setAttribute('aria-hidden', (!newState).toString());

      if (card) {
        card.classList.toggle('expanded', newState);
      }

      if (labelEl) {
        labelEl.textContent = newState ? closeLabel : openLabel;
      }

      // Track analytics
      trackEvent('accordion_toggle', {
        action: newState ? 'expand' : 'collapse',
        section: targetId,
        page: window.location.pathname
      });
    });
  });
}

// ============================================
// COPY TO CLIPBOARD
// ============================================

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy-target]');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-copy-target');
      const target = document.getElementById(targetId);

      if (!target) return;

      const text = target.innerText || target.textContent;
      const originalHTML = button.innerHTML;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          showCopySuccess(button, originalHTML);

          // Track analytics
          trackEvent('template_copy', {
            template: document.title,
            page: window.location.pathname
          });
        } else {
          // Fallback for older browsers
          fallbackCopy(target);
          showCopySuccess(button, originalHTML);
        }
      } catch (err) {
        console.error('Copy failed:', err);
        showCopyError(button, originalHTML);
      }
    });
  });

  // Also handle generic copy buttons (without data-copy-target)
  document.querySelectorAll('#ctp-copy-template').forEach((button) => {
    button.addEventListener('click', async () => {
      const templateBox = document.getElementById('ctp-template-box');
      if (!templateBox) return;

      const text = templateBox.innerText || templateBox.textContent;
      const originalHTML = button.innerHTML;

      try {
        await navigator.clipboard.writeText(text);
        showCopySuccess(button, originalHTML);

        trackEvent('template_copy', {
          template: document.title,
          page: window.location.pathname
        });
      } catch (err) {
        fallbackCopy(templateBox);
        showCopySuccess(button, originalHTML);
      }
    });
  });
}

function showCopySuccess(button, originalHTML) {
  button.innerHTML = '<span>✅</span><span>Copied!</span>';
  button.classList.add('success');

  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.classList.remove('success');
  }, 2000);
}

function showCopyError(button, originalHTML) {
  button.innerHTML = '<span>❌</span><span>Failed</span>';
  button.classList.add('error');

  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.classList.remove('error');
  }, 2000);
}

function fallbackCopy(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }

  selection.removeAllRanges();
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
  const searchInput = document.getElementById('template-search');
  if (!searchInput) return;

  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      performSearch(query);

      // Track analytics
      if (query.length >= 3) {
        trackEvent('search', {
          search_term: query,
          page: window.location.pathname
        });
      }
    }, 300);
  });
}

function performSearch(query) {
  const cards = document.querySelectorAll('.category-card');

  if (!query) {
    // Reset all cards
    cards.forEach((card) => {
      card.classList.remove('dimmed', 'highlighted');
      card.style.display = '';
    });
    return;
  }

  let matchCount = 0;

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const isMatch = text.includes(query);

    if (isMatch) {
      card.classList.remove('dimmed');
      card.classList.add('highlighted');
      card.style.display = '';
      matchCount++;

      // Auto-expand matching cards
      const toggle = card.querySelector('[data-expand-target]');
      if (toggle && toggle.getAttribute('aria-expanded') !== 'true') {
        toggle.click();
      }
    } else {
      card.classList.add('dimmed');
      card.classList.remove('highlighted');
    }
  });

  // Show "no results" message if needed
  showSearchResults(matchCount, query);
}

function showSearchResults(count, query) {
  let resultsEl = document.getElementById('search-results');

  if (!resultsEl) {
    resultsEl = document.createElement('div');
    resultsEl.id = 'search-results';
    resultsEl.style.cssText = 'margin-bottom: 1rem; padding: 0.75rem 1rem; background: #f3f4f6; border-radius: 8px; font-size: 0.9rem;';

    const categoriesSection = document.getElementById('contract-categories');
    if (categoriesSection) {
      categoriesSection.insertBefore(resultsEl, categoriesSection.querySelector('.category-grid'));
    }
  }

  if (count === 0) {
    resultsEl.innerHTML = `<strong>No results found</strong> for "${query}". Try a different search term.`;
    resultsEl.style.display = 'block';
  } else {
    resultsEl.innerHTML = `Found <strong>${count} ${count === 1 ? 'category' : 'categories'}</strong> matching "${query}"`;
    resultsEl.style.display = 'block';
  }

  if (!query) {
    resultsEl.style.display = 'none';
  }
}

// ============================================
// CATEGORY JUMP (SELECT DROPDOWN)
// ============================================

function initCategoryJump() {
  const categoryJump = document.getElementById('category-jump');
  if (!categoryJump) return;

  categoryJump.addEventListener('change', (e) => {
    const targetId = e.target.value;

    if (!targetId) return;

    const targetCard = document.getElementById(targetId);

    if (targetCard) {
      // Smooth scroll to card
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Auto-expand the card
      const toggle = targetCard.querySelector('[data-expand-target]');
      if (toggle && toggle.getAttribute('aria-expanded') !== 'true') {
        setTimeout(() => toggle.click(), 300);
      }

      // Track analytics
      trackEvent('category_jump', {
        category: targetCard.querySelector('.category-title')?.textContent.trim(),
        page: window.location.pathname
      });
    }

    // Reset the dropdown
    categoryJump.value = '';
  });
}

// ============================================
// SMOOTH ANCHOR SCROLLING
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // If it's a tab, activate it
        const tabButton = document.querySelector(`[aria-controls="${targetId}"]`);
        if (tabButton) {
          setTimeout(() => tabButton.click(), 100);
        }
      }
    });
  });
}

// ============================================
// ANALYTICS TRACKING
// ============================================

function trackEvent(eventName, params = {}) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, params);
  }

  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('trackCustom', eventName, params);
  }

  // Plausible Analytics
  if (typeof plausible !== 'undefined') {
    plausible(eventName, { props: params });
  }

  // Console log for debugging (remove in production)
  console.log('📊 Event tracked:', eventName, params);
}

function trackPageView() {
  trackEvent('page_view', {
    page_title: document.title,
    page_path: window.location.pathname
  });
}

function trackOutboundLink(url) {
  trackEvent('outbound_link_click', {
    url: url,
    page: window.location.pathname
  });
}

// Track all outbound links automatically
function initOutboundTracking() {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    const hostname = new URL(link.href).hostname;

    if (hostname !== window.location.hostname) {
      link.addEventListener('click', () => {
        trackOutboundLink(link.href);
      });
    }
  });
}

// ============================================
// CTA / CONVERSION TRACKING
// ============================================

function trackCTA(ctaName, ctaType = 'button') {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_type: ctaType,
    page: window.location.pathname
  });
}

function initCTATracking() {
  // Track "Book consultation" clicks
  document.querySelectorAll('a[href*="contact"], a[href*="consultation"], a[href*="hire"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackCTA('consultation', 'link');
    });
  });

  // Track download buttons
  document.querySelectorAll('[href$=".docx"], [href$=".pdf"], button:has-text("Download")').forEach((button) => {
    button.addEventListener('click', () => {
      trackEvent('template_download', {
        format: button.textContent.includes('PDF') ? 'pdf' : 'docx',
        template: document.title,
        page: window.location.pathname
      });
    });
  });
}

// ============================================
// LOCAL STORAGE (Save user preferences)
// ============================================

function savePreference(key, value) {
  try {
    localStorage.setItem(`contractLib_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Could not save preference:', e);
  }
}

function getPreference(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(`contractLib_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

// Example: Remember last viewed template category
function rememberCategory() {
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const categoryName = card.querySelector('.category-title')?.textContent.trim();
      if (categoryName) {
        savePreference('lastViewedCategory', categoryName);
      }
    });
  });
}

// ============================================
// DARK MODE TOGGLE (Optional)
// ============================================

function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (!darkModeToggle) return;

  const currentMode = getPreference('darkMode', false);

  if (currentMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    document.body.classList.toggle('dark-mode', isDark);
    savePreference('darkMode', isDark);

    trackEvent('dark_mode_toggle', {
      enabled: isDark
    });
  });
}

// ============================================
// LAZY LOADING IMAGES (If you add images later)
// ============================================

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// PRINT FUNCTIONALITY
// ============================================

function initPrintButton() {
  const printButtons = document.querySelectorAll('[data-print]');

  printButtons.forEach((button) => {
    button.addEventListener('click', () => {
      window.print();

      trackEvent('template_print', {
        template: document.title,
        page: window.location.pathname
      });
    });
  });
}

// ============================================
// EMAIL/SHARE TEMPLATE
// ============================================

function initShareButtons() {
  const shareButtons = document.querySelectorAll('[data-share]');

  shareButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.content || '',
        url: window.location.href
      };

      if (navigator.share) {
        // Native share API (mobile)
        try {
          await navigator.share(shareData);
          trackEvent('template_share', {
            method: 'native',
            template: document.title
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
          }
        }
      } else {
        // Fallback: copy link to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
          trackEvent('template_share', {
            method: 'copy_link',
            template: document.title
          });
        } catch (err) {
          console.error('Copy failed:', err);
        }
      }
    });
  });
}

// ============================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ============================================

function init() {
  // Core functionality
  initTabs();
  initAccordions();
  initCopyButtons();
  initSearch();
  initCategoryJump();
  initSmoothScroll();

  // Analytics & tracking
  trackPageView();
  initOutboundTracking();
  initCTATracking();

  // Optional features
  initDarkMode();
  initLazyLoading();
  initPrintButton();
  initShareButtons();
  rememberCategory();

  console.log('✅ Contract Library initialized');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackEvent,
    trackCTA,
    savePreference,
    getPreference
  };
}
