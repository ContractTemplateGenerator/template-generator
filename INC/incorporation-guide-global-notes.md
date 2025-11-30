# Incorporation Guide Build Notes

## WordPress tab requirements
1. Every tab switcher must use a JS function that accepts the `event` parameter and calls `event.preventDefault()` and `event.stopPropagation()` before doing anything else.
2. Every tab button/anchor must pass the `event` argument (e.g., `onclick="switchTab('overview', event)"`).
3. Never call `window.scrollTo` or similar inside tab handlers; WordPress injects scroll behavior and will jump the page if we force scrolling.
4. Tab markup should remain lightweight: sticky container, optional left/right scroll buttons, and `.tab-panel` sections that toggle via JS.
5. Keep the tab count modest so labels do not spill off the right edge; consolidate shorter sections instead of adding more tabs.

### Correct Tab Function Implementation (REQUIRED)
```javascript
function switchTab(tabId, event) {
    // Prevent default behavior and stop propagation for WordPress compatibility
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Deactivate all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected tab content
    document.getElementById(tabId).classList.add('active');

    // Activate clicked tab
    if (event && event.target) {
        event.target.classList.add('active');
    }
}
```

### Correct Button Implementation
```html
<button class="tab active" onclick="switchTab('overview', event)">Overview</button>
<button class="tab" onclick="switchTab('formation', event)">Formation Steps</button>
```

**IMPORTANT:** Parameter order is `(tabId, event)` NOT `(event, tabId)`

## WordPress CSS Compatibility

### Body Styles - CRITICAL
When HTML is embedded in WordPress Custom HTML blocks, the `<body>` styles apply to the ENTIRE WordPress page, not just your content. This causes major styling conflicts.

**DO NOT use these on `<body>`:**
- ❌ `background` (colors, gradients, images) - will paint entire WP page
- ❌ `padding` - will add unwanted spacing around WP elements
- ❌ `min-height: 100vh` - not needed in WP context
- ❌ `border-radius` - not applicable to body
- ❌ Any decorative styles

**ONLY use these on `<body>`:**
```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #2c3e50;
}
```

### Container Styles
Keep `.container` minimal for WordPress compatibility:
```css
.container {
    max-width: 1400px;
    margin: 0 auto;
    background: white;  /* Optional, only if needed */
}
```

**Avoid on `.container` in WP context:**
- ❌ `border-radius` (creates visual disconnect in WP)
- ❌ `box-shadow` (looks disconnected from page)
- ❌ Heavy decorative borders
- ❌ `padding` on container (use padding on inner elements instead)

### Header/Hero Sections
Apply decorative backgrounds to `header` or `.hero` elements, NOT to body:
```css
header {
    background: linear-gradient(135deg, #D4A574 0%, #8B6914 100%);
    color: white;
    padding: 30px 20px;
    /* ... other header styles */
}
```

## Layout & hero rules
- Do **not** use `<h1>` elements inside the HTML files; WordPress will inject its own page title. Use `<p>`/`<div>` for hero headlines.
- Hero blocks must be concise (around 40px top/bottom padding) and always include:
  * A headline wrapped in a `<p>` or `<div>` (no `<h1>`).
  * A one-sentence subtitle.
  * A small state-flag element (either SVG, emoji, or styled box) for visual identity.
  * Two stat cards with simple icons (emoji or inline SVG) to avoid a sterile look.

## Voice & service positioning
- Refer to the practice as an attorney-led service. Use first-person singular (“I help…”) rather than plural “our services”. Emphasize that an attorney—not a paralegal or anonymous filing shop—handles the engagement.
- Keep the tone professional and explanatory. Avoid marketing fluff and keep bullets to 1–3 sentences each.

## Content expectations for every state guide
- Include a pre-formation checklist, first-90-day timeline, operating agreement/charter drafting notes, lifecycle filing table, tax/PTE overlay, CTA/BOI status, and a “Common pitfalls (law-office perspective)” section.
- Cross-link the LLC and corporation pages for each state near the top of the Overview tab.
- Highlight professional entity nuances (PLLC/PC) and any state-specific series, benefit, or business trust regimes.
- Mention local licensing, foreign qualification triggers, and foreign-owner considerations when relevant.
- Use professional icons (emoji or inline SVG) for stat cards or callouts, and include a state flag or abbreviation badge in the hero.
- Embed the Calendly popup and inline widgets at the bottom of each guide so clients can book directly:
  ```html
  <!-- Calendly link widget begin -->
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
  <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
  <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;">[Insert CTA relevant to this page]</a>
  <!-- Calendly link widget end -->
  <!-- Calendly inline widget begin -->
  <div class="calendly-inline-widget" data-url="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1" style="min-width:320px;height:700px;"></div>
  <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
  <!-- Calendly inline widget end -->
  ```
- Never advertise free consultations. Keep CTAs professional and consistent with the paid, attorney-led service positioning.
- Use `owner@terms.law` as the sole contact email across all guides; do not invent or reuse previous placeholder addresses.
- Never publish phone numbers (real or placeholder). All CTAs should rely on email and Calendly links.
- Only use the authorized Calendly URL (`https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting`) for booking links. Do not invent alternative Calendly slugs or reference other “online form” booking sites unless specifically provided.

### Contact & CTA policy (non-negotiable)
- Do **not** offer “free consultations” or free discovery calls in any CTA copy; describe calls as paid or strategy-focused engagements instead.
- Do **not** create or reference alternate email addresses (e.g., info@, support@); `owner@terms.law` is the only permissible contact email.
- Do **not** add phone numbers, even placeholders or future-intent numbers, anywhere in these guides.
- Do **not** embed or mention faux intake portals (“my online form,” random Calendly links, Typeforms) unless an approved URL is explicitly provided; stick to the sanctioned Calendly link included above.
- Reinforce this policy in any new template or snippet so future edits never drift back to free consult promises or fabricated contact methods.

## Attorney service section
- Every guide must include a dedicated "My Services" section (tab or expanded block) near the end featuring:
  * 2–3 clearly priced packages (e.g., Standard / Professional / Premium) with bullet summaries.
  * Optional add-on services and contact details (phone/email/CTA text) plus the Calendly embed noted above.
  * First-person singular language (“I,” “me”) emphasizing that the attorney personally handles the engagement.
- This section can share a tab with CTA/pitfalls if tabs are limited, but the packages must be easy to scan.
