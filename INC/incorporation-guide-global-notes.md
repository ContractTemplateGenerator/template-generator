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

**IMPORTANT:**
- Parameter order is `(tabId, event)` NOT `(event, tabId)`
- Use **inline onclick handlers** with event parameter - this pattern works reliably in WordPress
- Do NOT use event listeners with data attributes - causes issues in WordPress Custom HTML blocks

### Working Examples (Tabs Function Correctly in WordPress)
- `/INC/AZ/arizona-company-formation-hub.html` - Inline onclick with event parameter ✅
- `/INC/FL/florida-company-formation-hub.html` - Inline onclick with event parameter ✅
- `/INC/AK/alaska-entity-types-guide.html` - Inline onclick with event parameter ✅
- Pattern: `onclick="switchTab('tab-id', event)"` + simple function with preventDefault/stopPropagation

## WordPress Heading Compatibility - CRITICAL

**NEVER use h1, h2, h3, h4, or h5 elements in WordPress widgets/HTML files.**

### Why No Headings?
WordPress Table of Contents (TOC) plugins automatically detect and index all h1-h5 headings on a page. When HTML widgets/files use semantic headings, these get picked up by the TOC, creating:
- ❌ TOC pollution with widget headings mixed into article structure
- ❌ Confusing navigation for users
- ❌ Broken document hierarchy

### Solution: Use Styled Divs Instead

**✅ CORRECT PATTERN:**
```html
<!-- CSS -->
<style>
.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 18px 0;
}

.card-section-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 20px 0 10px 0;
}

.minor-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 12px 0;
}
</style>

<!-- HTML -->
<div class="card-title">This Looks Like a Heading</div>
<div class="card-section-title">Major Section</div>
<div class="subsection-title">Subsection</div>
<div class="minor-title">Minor Heading</div>
```

**❌ WRONG - Never Use:**
```html
<h1>Main Title</h1>  <!-- WordPress TOC will index this -->
<h2>Section</h2>     <!-- WordPress TOC will index this -->
<h3>Subsection</h3>  <!-- WordPress TOC will index this -->
```

### Working Examples (No Heading Elements)
- `/Article-Widgets/warranty-disclaimers-summary-widget.html` - Uses styled divs for all headings ✅
- All widget/article summary files must follow this pattern

## WordPress CSS Compatibility

### Body Styles - CRITICAL (AVOID COLOR SPILL)
When HTML is embedded in WordPress Custom HTML blocks, the `<body>` styles apply to the ENTIRE WordPress page, not just your content. This causes major styling conflicts.

**DO NOT use these on `<body>`:**
- ❌ `background` (colors, gradients, images) - will paint entire WP page
- ❌ `padding` - will add unwanted spacing around WP elements
- ❌ `min-height: 100vh` - not needed in WP context
- ❌ `border-radius` - not applicable to body
- ❌ Any decorative styles

**NEVER style `body` with backgrounds or decorative CSS in WordPress widgets.**

**ONLY use these on `<body>` (if you must target body at all):**
```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #2c3e50;
}
```

**BETTER APPROACH: Don't style body at all. Use a wrapper class instead.**

### Wrapper/Container Pattern (RECOMMENDED - Prevents Color Spill)

**✅ CORRECT PATTERN** (Example: arizona-company-formation-hub.html)
```css
/* Use a unique wrapper class for your widget, NOT body */
.az-formation-hub {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    max-width: 1240px;
    margin: 0 auto;
    padding: 20px;
    color: #1a202c;
    line-height: 1.7;
}

.az-formation-hub * {
    box-sizing: border-box;
}

/* Apply backgrounds to inner sections, NOT body or container */
.hero-section {
    background: linear-gradient(135deg, #C1440E 0%, #E67635 50%, #F4A460 100%);
    color: white;
    padding: 60px 50px;
    border-radius: 16px;
    margin-bottom: 35px;
    /* ... */
}
```

**❌ WRONG PATTERN** (Causes color spill in WordPress)
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* SPILLS EVERYWHERE */
    padding: 40px; /* BREAKS WP LAYOUT */
}

.container {
    background: white;
    border-radius: 12px; /* Looks disconnected */
    box-shadow: 0 10px 40px rgba(0,0,0,0.3); /* Floats awkwardly */
}
```

### Container Styles
Keep `.container` or wrapper minimal for WordPress compatibility:
```css
.your-widget-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    /* NO background, border-radius, or box-shadow here */
}
```

**Avoid on top-level containers in WP context:**
- ❌ `border-radius` (creates visual disconnect in WP)
- ❌ `box-shadow` (looks disconnected from page)
- ❌ `background` gradients or colors (apply to inner sections instead)
- ❌ Heavy decorative borders
- ❌ `padding` on main container (use padding on inner elements instead)

### Header/Hero Sections
Apply decorative backgrounds to inner sections like `header`, `.hero-section`, or `.hero`, NOT to body or main container:
```css
.hero-section {
    background: linear-gradient(135deg, #D4A574 0%, #8B6914 100%);
    color: white;
    padding: 30px 20px;
    border-radius: 16px;  /* OK on inner sections */
    margin-bottom: 35px;
    /* ... other header styles */
}
```

### Good Examples (No Color Spill)
- `/INC/AZ/arizona-company-formation-hub.html` - Uses `.az-formation-hub` wrapper, backgrounds only on `.hero-section` ✅
- `/INC/FL/florida-company-formation-hub.html` - Uses `.fl-formation-hub` wrapper, backgrounds only on inner sections ✅
- Pattern: Wrapper class → scoped styles → backgrounds on inner sections only

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
