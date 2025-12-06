# AI Data Training Articles - Build Notes

These notes govern the **AI training data privacy article widgets** in this repository.

## Purpose

This collection focuses on helping freelancers, corporate clients, and businesses understand and protect their work from being used to train AI systems without consent. The articles address:

- How major platforms (Slack, LinkedIn, Anthropic, Upwork, Fiverr, etc.) use data for AI training
- Contractual protections (NDAs, AI-specific clauses, marketplace terms)
- Data-safe hiring practices for platforms like Upwork and Fiverr
- Platform policy comparisons and updates

## Target Audience

1. **Freelancers and agencies** concerned about their work being used for AI training
2. **Corporate clients** hiring on platforms and needing data privacy compliance
3. **Businesses** evaluating platform AI policies and seeking contractual protections

---

## Files in This Collection

### 1. slack-linkedin-anthropic-ai-training-data.html
**Focus**: How Slack, LinkedIn, Anthropic, and other platforms use workspace/professional data for AI training

**Key sections**:
- Overview of platforms' AI training practices
- Risks and implications for businesses
- Policy audit services
- Contract drafting for data protection

**Color theme**: Red (`#dc2626`)

### 2. nda-no-ai-clauses-marketplace-terms.html
**Focus**: Analyzing when NDAs protect against AI training vs when marketplace terms override them

**Key sections**:
- How NDAs interact with platform terms
- AI-specific clauses needed
- Platform-by-platform analysis
- Template drafting and updates

**Color theme**: Purple (`#7c3aed`)

### 3. upwork-ai-privacy-update-2026-corporate-clients.html
**Focus**: Guide to Upwork's January 5, 2026 AI policy update for corporate clients

**Key sections**:
- Timeline and critical dates
- What changed in Upwork's AI policy
- Action steps for corporate clients
- Contract update services

**Color theme**: Blue (`#2563eb`)

### 4. upwork-vs-fiverr-ai-training-comparison.html
**Focus**: Comprehensive comparison of AI training policies across major freelance platforms

**Platforms covered**:
- Upwork
- Fiverr
- Freelancer.com
- PeoplePerHour

**Key features**:
- Side-by-side comparison tables
- Color-coded platform indicators
- Risk assessment
- Multi-platform contract solutions

**Color theme**: Teal (`#0d9488`)

### 5. hiring-safely-upwork-fiverr-data-privacy.html
**Focus**: 6-step process for data-safe hiring on freelance platforms

**Key sections**:
- Step-by-step hiring process
- Platform evaluation
- Contract templates
- Compliance tracking

**Color theme**: Green (`#059669`)

---

## Design Standards

### Header Structure

All articles use a compact header format:
```html
<div style="background:linear-gradient(135deg, [color1], [color2]); color:white; padding:30px 20px; border-radius:12px; margin-bottom:30px">
  <h1 style="font-size:32px; margin:0 0 10px 0; font-weight:700">[Article Title]</h1>
  <p style="font-size:18px; margin:0; opacity:0.95">[Subtitle]</p>
</div>
```

**Critical**: Header padding is set to `30px 20px` (not 60px) to minimize vertical space and reduce scrolling.

### No Credentials in Header

The attorney's name and credentials appear in the site header already, so they are **not repeated** in article headers. Headers contain only:
- Article title (h1)
- Article subtitle (p)

### Tab-Based Navigation

All articles use a multi-tab structure with:
- **Tab 1**: Overview/Analysis
- **Tab 2**: Services & Solutions
- **Tab 3**: Attorney Services (with Calendly embed)

Tab switching uses inline JavaScript:
```javascript
function switchTab[UniqueID](tab) {
  // Hide all panels
  // Show selected panel
  // Update button states
}
```

Each article has a unique function name to avoid conflicts when multiple widgets appear on the same page.

### Responsive Design

All articles include mobile-responsive styling:
- Tab buttons stack vertically on mobile
- Tables scroll horizontally on mobile
- Text sizes adjust for smaller screens
- Padding reduces on mobile

---

## Pricing Structure

All pricing reflects the attorney's actual rates and typical project timelines:

**Hourly rate**: $240/hr

**Typical services and pricing**:
- Contract drafting (2 hours): ~$450
- Policy audits (2-3 hours): $400-$720
- Template updates (1-2 hours): $240-$480
- Multi-platform audits (2-4 hours): $480-$960
- Policy development (3-6 hours): $720-$1,440

**Pricing display format**:
```
Service name: $[low]-$[high] (typical hours @ $240/hr)
```

or

```
Service name: ~$[amount] (typically X hours @ $240/hr)
```

### Important Pricing Rules

1. Do NOT use inflated or generic ranges like "$1,500-$3,000"
2. All pricing must reflect actual $240/hr rate
3. Include time estimates to show transparency
4. Use "typically" or "usually" to indicate these are estimates
5. Higher complexity = more hours, not higher hourly rate

---

## Contact Information

### Email
**Required format**: `<a href="mailto:owner@terms.law" style="color:[theme-color]">owner@terms.law</a>`

- Must be a clickable mailto link
- Color must match the article's theme color
- Email address: **owner@terms.law** (no other email addresses permitted)

### Calendly Embed

All "Attorney Services" tabs include an inline Calendly widget:

```html
<div class="calendly-inline-widget"
     data-url="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1"
     style="min-width:320px;height:700px;">
</div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

**Rules**:
- Use exact URL: `https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting`
- Do NOT create new Calendly URLs or event types
- Include `hide_gdpr_banner=1` parameter
- Minimum height: 700px for proper display

### No Phone Numbers

Do NOT include phone numbers (real, placeholder, or masked) in any article.

---

## WordPress Safety

These widgets are designed to be embedded in WordPress Custom HTML blocks without breaking site functionality.

### No Real Heading Tags

Widgets **do not use** `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>` tags:
- Real heading tags would pollute WordPress table of contents
- Instead, use styled `<div>` or `<p>` elements with heading-like appearance
- Exception: The main article title uses `<h1>` in the header section, but this is acceptable as it's the primary page title

### Scoped Styling

All styles are inline or scoped to avoid conflicts with WordPress theme:
- No global CSS rules affecting `body`, `html`, or other site elements
- All colors, fonts, and spacing defined inline
- Each widget is self-contained

### Self-Contained JavaScript

Each article has its own uniquely-named JavaScript functions:
- `switchTabSlack()` for Slack article
- `switchTabNDA()` for NDA article
- `switchTabUpwork2026()` for Upwork 2026 article
- `switchTabComparison()` for comparison article
- `switchTabHiring()` for hiring guide

This prevents conflicts when multiple widgets appear on the same page or across the site.

---

## Content Voice and Positioning

### Solo Attorney Practice

Content reflects a solo attorney personally handling these matters:
- Use first-person ("I") when describing services
- "I review platform terms and draft AI-specific protections"
- NOT "We provide services" or "Our team handles"

### Educational + Services

Each article balances:
- **Educational content**: Help readers understand the issue
- **Service offering**: Clear path to hire attorney for implementation

The ratio is roughly 70% educational, 30% services.

### No "Free Consultation" Language

Do NOT promise or imply free consultations, free reviews, or similar:

**Acceptable**:
- "Schedule a call to discuss your specific situation"
- "I typically quote a flat fee after reviewing your documents"

**Not acceptable**:
- "Book your free consultation"
- "Free case evaluation"

---

## Color Themes

Each article has a distinct color scheme for visual differentiation:

| Article | Primary Color | Gradient End | Usage |
|---------|---------------|--------------|-------|
| Slack/LinkedIn | `#dc2626` (red) | `#991b1b` | Headers, accents, links |
| NDA Clauses | `#7c3aed` (purple) | `#5b21b6` | Headers, accents, links |
| Upwork 2026 | `#2563eb` (blue) | `#1e40af` | Headers, accents, links |
| Platform Comparison | `#0d9488` (teal) | `#0f766e` | Headers, accents, links |
| Hiring Guide | `#059669` (green) | `#047857` | Headers, accents, links |

Colors are used consistently throughout each article for:
- Header gradients
- Tab button active states
- Call-to-action buttons
- Email mailto links
- Important highlights

---

## Technical Specifications

### File Format
- Pure HTML with inline CSS and JavaScript
- No external dependencies (except Calendly widget script)
- WordPress Custom HTML block compatible
- Mobile responsive via media queries

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No IE11 support required

### Performance
- Inline styles for fast loading
- Minimal JavaScript (only tab switching)
- Calendly script loads asynchronously
- No large images or external resources

### Accessibility
- Semantic HTML where possible (within WordPress constraints)
- Color contrast meets WCAG AA standards
- Tab buttons keyboard accessible
- Mailto links clearly labeled

---

## Update and Maintenance Protocol

### When Platform Policies Change

1. Update relevant article(s) with new policy details
2. Update "Last updated" date if included
3. Verify Calendly link still works
4. Check that pricing remains accurate
5. Test tab functionality after edits

### When Adding New Articles

New articles should:
1. Follow the same tab structure (Overview → Solutions → Attorney Services)
2. Use a distinct color theme not already in use
3. Include compact header (30px padding)
4. Use unique JavaScript function names
5. Include Calendly embed in Attorney Services tab
6. Reflect accurate pricing based on $240/hr rate
7. Use mailto link for owner@terms.law

### File Naming Convention

Use descriptive, lowercase, hyphen-separated names:
- `platform-name-topic-description.html`
- Examples: `slack-linkedin-anthropic-ai-training-data.html`
- NOT: `article1.html` or `ai_training.html`

---

## Compliance Checklist

When creating or updating an article, verify:

### Structure
- [ ] Compact header with 30px vertical padding
- [ ] No credentials line in header (just title + subtitle)
- [ ] Three-tab structure (Overview, Solutions, Attorney Services)
- [ ] Unique tab-switching function name
- [ ] Calendly embed in Attorney Services tab

### Content
- [ ] Educational content focused on specific platform/issue
- [ ] Clear explanation of risks and implications
- [ ] Practical solutions and action steps
- [ ] Solo attorney voice (first-person, not "we")

### Pricing
- [ ] Based on $240/hr rate
- [ ] Realistic time estimates included
- [ ] No inflated generic ranges
- [ ] Typical project: ~$450 for 2-hour contracts

### Contact
- [ ] Email is owner@terms.law with mailto link
- [ ] Email link color matches article theme
- [ ] Calendly URL is exact: sergei-tokmakov/30-minute-zoom-meeting
- [ ] No phone numbers included
- [ ] No "free consultation" promises

### WordPress Safety
- [ ] No real `<h2>-<h6>` tags (h1 in header only)
- [ ] All styling inline or scoped
- [ ] No global CSS rules
- [ ] Self-contained JavaScript
- [ ] Mobile responsive

### Design
- [ ] Consistent color theme throughout article
- [ ] Tab buttons styled and functional
- [ ] Tables/content readable on mobile
- [ ] Professional appearance matching other articles

---

## Relationship to Other Article Collections

### Medical Folder
The Medical folder contains attorney-written medical content widgets. The AI Data Training articles follow similar structural patterns (tabs, Calendly embeds, compact design) but focus on platform data privacy instead of medical topics.

### Demand Letters Folder
The Demand Letters folder contains comprehensive legal guides for specific dispute scenarios. The AI Data Training articles are more focused on preventive contract drafting and policy compliance rather than dispute resolution.

---

## Future Expansion

Potential additional articles in this collection:

1. **GitHub Copilot Enterprise Data Controls** - Corporate code privacy
2. **Microsoft 365 AI Training Opt-Outs** - Enterprise workspace protection
3. **Google Workspace AI Data Settings** - G Suite privacy controls
4. **Zoom AI Training Policy** - Video meeting data protection
5. **Notion AI and Workspace Privacy** - Collaborative tool data rights
6. **Platform-Specific NDA Templates** - Ready-to-use contract language

When adding new articles, maintain consistency with existing design patterns and pricing structure.

---

## Final Notes

1. **These are widget embeds, not standalone pages**: They're designed to be dropped into WordPress posts via Custom HTML blocks.

2. **Each article is self-contained**: No dependencies on external CSS/JS files (except Calendly).

3. **Pricing must stay current**: If hourly rate changes, all articles must be updated consistently.

4. **Platform policies change frequently**: Monitor platform terms and update articles when major policy changes occur.

5. **User feedback matters**: If users report confusion about specific sections, revise for clarity.

This documentation is the reference for all AI Data Training article development and maintenance.
