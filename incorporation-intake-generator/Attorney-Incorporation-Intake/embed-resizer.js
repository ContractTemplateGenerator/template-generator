// Terms.law iframe auto-resizer (parent page script)
// Usage: include this script on the page that contains the <iframe data-termslaw-embed ...>
(function () {
  function onMessage(event) {
    try {
      var data = event.data || {};
      if (data.type !== "termslaw:resize") return;
      var iframes = document.querySelectorAll('iframe[data-termslaw-embed]');
      for (var i = 0; i < iframes.length; i++) {
        var el = iframes[i];
        if (data.src && el.src.indexOf(data.src) === -1) continue; // match sender (optional)
        var h = Math.max(500, parseInt(data.height || 0, 10));
        el.style.height = h + "px";
        el.style.width = "100%";
        el.setAttribute("scrolling", "no");
        el.setAttribute("frameBorder", "0");
      }
    } catch (e) {
      console && console.warn && console.warn("termslaw-resizer error", e);
    }
  }
  window.addEventListener("message", onMessage, false);
})();
