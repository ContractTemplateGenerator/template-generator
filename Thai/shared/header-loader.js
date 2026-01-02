// Thai Hub Header Loader
(function() {
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;

  fetch('/Thai/shared/thai-header.html')
    .then(r => r.text())
    .then(html => {
      headerEl.innerHTML = html;
    })
    .catch(() => {
      headerEl.innerHTML = `
        <header style="background:#0f172a;padding:16px 24px;">
          <a href="/" style="color:#60a5fa;font-weight:800;text-decoration:none;">Terms.Law</a>
          <a href="/Thai/" style="color:#fff;margin-left:20px;text-decoration:none;">🇹🇭 Thailand</a>
        </header>`;
    });
})();
