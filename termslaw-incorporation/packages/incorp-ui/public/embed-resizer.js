(function () {
  const DEFAULT_MIN_HEIGHT = 720;

  function toPixels(value, fallback) {
    const numeric = Number.parseInt(value, 10);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function resizeFrame(frame, height) {
    const minHeight = toPixels(frame.dataset.minHeight, DEFAULT_MIN_HEIGHT);
    const adjusted = Math.max(Math.ceil(height), minHeight);
    frame.style.height = `${adjusted}px`;
  }

  function findMatchingFrame(source) {
    const frames = document.querySelectorAll('iframe[data-termslaw-embed]');
    for (const frame of frames) {
      if (frame.contentWindow === source) {
        return frame;
      }
    }
    return null;
  }

  function handleMessage(event) {
    const data = event.data;
    if (!data || typeof data !== 'object' || data.type !== 'termslaw-embed:resize') {
      return;
    }

    if (Array.isArray(window.TermsLawEmbed?.allowedOrigins) && window.TermsLawEmbed.allowedOrigins.length > 0) {
      if (!window.TermsLawEmbed.allowedOrigins.includes(event.origin)) {
        return;
      }
    }

    const targetFrame = findMatchingFrame(event.source);
    if (!targetFrame) {
      return;
    }

    resizeFrame(targetFrame, data.height ?? DEFAULT_MIN_HEIGHT);
  }

  function ensureFrameDefaults(frame) {
    frame.style.width = '100%';
    frame.style.border = frame.style.border || '0';
    frame.style.display = 'block';
  }

  function init() {
    const frames = document.querySelectorAll('iframe[data-termslaw-embed]');
    frames.forEach(ensureFrameDefaults);
  }

  window.addEventListener('message', handleMessage);

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
