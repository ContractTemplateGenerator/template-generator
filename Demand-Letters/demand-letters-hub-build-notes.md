# Demand Letter Hub Build Notes

These notes govern **all demand-letter hub HTML widgets and related content** in this repository.

Goals:

1. Build **attorney-led, interactive resource hubs** (not just text posts).
2. **Dominate demand-letter search keywords across the United States**, with a deliberate funnel from general content → California-specific content → paid engagements.
3. Keep all HTML widgets **WordPress-safe** (no frozen tabs, no broken arrows, no TOC pollution, no global CSS conflicts).

Any new widget or hub that conflicts with this document should be treated as incorrect and revised.

---

## 1. Overall content and SEO strategy

### 1.1 General vs California pages

For each **high-value scenario**, the site should have at least:

- **One "general" guide page** (nationwide focus)
  - Public H1 should be natural and topic-based, **not "U.S. guide"** or similar.
    - Example:
      - `Car accident demand letters: how to write, send, and negotiate`
      - `Security deposit demand letters: getting your money back without court`
  - Content assumes **U.S. practice generally**, acknowledges that laws vary by state, and includes examples from multiple states.
  - Includes a clear, prominent section for **California readers** that links to the California page.

- **One California-specific guide page**
  - Public H1 explicitly signals California:
    - Example:
      - `California car accident demand letters: legal rights and settlement strategy`
      - `California security deposit demand letters: landlord–tenant playbook`
  - Deep dive into California statutes, case law, and practice.
  - Clearly framed as: "This is how I handle these California matters in practice."

Internal tagging can distinguish the roles:

- `[GENERAL]` – primary nationwide guide.
- `[CA]` – California-specific guide.

These tags are **internal only**; they should not appear in the user-facing H1 or in file content.

For smaller or niche topics, a single general page is fine. Build a separate California page when:

- State law is central, or
- There is clear search / client demand for California-specific treatment.

### 1.2 Two-sided perspective (both ends of the demand letter)

Every major hub should explicitly serve **both**:

- The person who wants to **send** a demand letter (claimant / sender).
- The person or company who has **received** a demand letter (recipient / defendant / account holder).

This applies across all clusters:

- Employee vs employer.
- Freelancer / agency vs client.
- Tenant vs landlord.
- Consumer vs subscription platform.
- Influencer vs brand.
- Borrower vs creditor, etc.

Each hub's design and content must make it obvious that **both perspectives are supported and addressed**.

---

## 2. File and folder expectations

### 2.1 Project phases: breadth first, then depth

**Phase 1: Coverage** (current priority)
- Create 10-50 pages per major cluster quickly
- Moderate depth, strong structure, working interactivity
- Goal: see which topics get traction with users and search engines

**Phase 2: Upgrade** (after traffic data)
- Convert high-performing pages into comprehensive pillars
- Add advanced calculators, generators, extensive FAQs
- Deepen legal analysis and California-specific content

For Phase 1, pages should be:
- 1200-2000 lines of clean HTML
- 4-6 working tabs
- Basic interactive elements (checklists, snippet cards, simple FAQ)
- Clear sender/recipient split
- Proper WordPress-safe structure

Do NOT over-engineer during Phase 1. Speed and coverage matter more than perfection.

### 2.2 Car accidents cluster example

The **Car accidents** folder is a model for how to structure a large, valuable topic. Expected structure:

```text
Demand Letters/
  PI/
    Car accident demand letters: how to write, send, and negotiate [GENERAL]
    California car accident demand letters: legal rights and settlement strategy [CA - HAVE]

    Building your car crash demand file: evidence checklist for injury claims [GENERAL]
    Building your California car crash demand file: evidence checklist [CA]

    When the other driver is uninsured or underinsured: UM and UIM demands [GENERAL]
    Underinsured motorist demands in California: getting your own insurer to pay [CA]

    When it is "just the car": property damage only auto claims and demand letters [GENERAL]
    When it is "just the car" in California: fixing the car and recovering loss of use [CA]

    You received a car accident demand letter: first steps for drivers and small businesses [GENERAL]
    When a California car accident demand letter lands on your desk: triage for defendants and insurers [CA]

    Uber and Lyft crashes in California: who to demand and how to reach their insurers [CA]
    Hit and run and uninsured drivers in California: building an uninsured motorist demand [CA]
    Crashes with police cars, buses, or other government vehicles in California [CA]

    Pushing for policy limits after serious crashes: time limited demands [CA]
```

Key principles:

- General pages have natural, descriptive titles
- California pages explicitly say "California"
- High-value patterns get both general + CA versions
- Specialty topics (Uber, hit-and-run, gov vehicles) are CA-only initially

### 2.3 Folder structure for entire project

```
Demand-Letters/
  demand-letters-hub-build-notes.md (this file)

  PI/ (Personal Injury)
    [car accidents cluster as shown above]
    [premises liability - slip and fall]
    [dog bites]
    [other PI - motorcycle, bicycle, pedestrian, rideshare, wrongful death]
    [medical bills and liens]

  Employment/
    [employee-side: wages, overtime, commissions, harassment, misclassification]
    [employer-side: trade secrets, poaching, NDA, property return]
    [freelancer/agency vs client]

  Debt-Credit/
    [consumer-side: harassment, validation, credit errors, medical debt]
    [creditor-side: past due, guarantors, notes]
    [workout and settlement]

  Landlord-Tenant/
    [residential tenant: deposits, habitability, lockouts, short-term rentals]
    [residential landlord: nonpayment, damage, violations]
    [commercial leases]
    [real estate and construction]

  Consumer-CLRA/
    [defective products, services, contractors, weddings]
    [overbilling, hidden fees, subscriptions, gyms]
    [auto-renewal and dark patterns]
    [travel, airlines, hotels]
    [CLRA statutory demands]

  Business-Commercial/
    [unpaid invoices: B2B, SaaS, freelancer, chargebacks]
    [breach of contract: marketing, dev, manufacturing, distribution]
    [partner and shareholder disputes]
    [settlement framework]
    [platform and marketplace accounts]

  Platforms-Fintech/
    [payment processors: Stripe, PayPal, Authorize.Net]
    [marketplaces and SaaS accounts]
    [neobanks and fintech apps]
    [crypto exchanges]

  IP-Defamation-Privacy/
    [copyright, trademark, DMCA, stolen content]
    [defamation, harassment, reviews, SLAPP]
    [privacy, data breach, AI training, CCPA/CPRA]

  Family-Marital/
    [spouse business demands]
    [community property and commingling]
    [trusts, estates, probate]
    [family business and co-owners]

  Government-Regulatory/
    [government claims and Gov Claims Act]
    [regulatory and agency demands]
    [professional malpractice]

  Specialty-Niche/
    [influencer and UGC]
    [entertainment and media]
    [education and schools]
    [coworking, gyms, memberships]
```

---

## 3. Widget architecture and WordPress safety

All demand-letter hubs will be embedded as HTML widgets into WordPress posts. These widgets must **never** break WordPress layout, scrolling, table of contents, or theme styles.

### 3.0 CRITICAL: Never link to local files

**NEVER include links to local HTML files** in the widgets. These files are stored locally during development but will be published on WordPress at specific URLs.

**WRONG:**
```html
<a href="california-car-crash-evidence-checklist.html">California evidence checklist</a>
<a href="../PI/slip-fall-evidence.html">Evidence guide</a>
```

**CORRECT:**
```html
<!-- Link to already-published WordPress page URLs only -->
<a href="https://terms.law/2025/12/01/california-car-accident-demand-letters/">California car accident guide</a>

<!-- Or omit the link entirely if the target page isn't published yet -->
For more details on evidence gathering, see the evidence checklist guide.
```

**Rules:**
- Only link to **actual published WordPress URLs** that you know exist.
- If a related page hasn't been published yet, reference it by name WITHOUT a hyperlink.
- Local file links like `href="filename.html"` or `href="../folder/file.html"` are **completely useless** on the published website.
- When in doubt, **leave it as plain text** rather than guessing a URL.

### 3.1 No `<h1>`–`<h6>` inside widgets

Widgets **must not** use HTML heading tags:

- **Do not use** `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>` in any widget.
- WordPress auto-builds a table of contents from headings; widget headings will pollute the TOC.

Instead, simulate headings using styled `div` or `p` elements:

```html
<div class="dl-card-title">When a car accident demand letter makes sense</div>
<div class="dl-section-title">Step 1 – Get your evidence in one place</div>
<div class="dl-subsection-title">Police report and scene documentation</div>
```

Use consistent classes:

- `.dl-card-title` – main card or block headings.
- `.dl-section-title` – major section headings.
- `.dl-subsection-title` – smaller nested headings.

The WordPress article body (outside the widget) will handle SEO and TOC via real headings.

### 3.2 Scoped CSS only (no global styling)

Every widget must be wrapped in a root container:

```html
<div class="demand-letter-hub">
  <!-- all widget content goes here -->
</div>
```

Rules:

- Do not style `<body>`, `html`, or other global elements.
- All layout, background, and typography rules must be scoped to the root wrapper (e.g. `.demand-letter-hub`, `.pi-demand-hub`, etc.).
- Limited `* {}` rules are allowed only if scoped, for example:
  ```css
  .demand-letter-hub * { box-sizing: border-box; }
  ```
- Do not set `min-height: 100vh`, full-page backgrounds, or global font rules that can escape the wrapper.

### 3.3 Tabs and arrows – required pattern

Tabs and arrows must use a single, known-good implementation that already works in WordPress and does not create "frozen" tabs or duplicated arrows.

#### Required JS function

```javascript
function switchTab(tabId, event) {
  // WordPress compatibility
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Scope to closest container to avoid cross-widget interference
  var button = event ? event.currentTarget : null;
  var container = button
    ? button.closest('.dl-tab-container')
    : document.querySelector('.dl-tab-container');

  if (!container) return;

  var tabs = container.querySelectorAll('.dl-tab-panel');
  var buttons = container.querySelectorAll('.dl-tab-button');

  tabs.forEach(function (panel) {
    panel.classList.toggle('active', panel.id === tabId);
  });

  buttons.forEach(function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
}
```

#### Required button pattern

```html
<div class="dl-tab-container">
  <div class="dl-tab-buttons">
    <button
      class="dl-tab-button active"
      data-tab="sender-view"
      onclick="switchTab('sender-view', event)"
    >
      I need to send a demand letter
    </button>
    <button
      class="dl-tab-button"
      data-tab="recipient-view"
      onclick="switchTab('recipient-view', event)"
    >
      I received a demand letter
    </button>
    <button
      class="dl-tab-button"
      data-tab="evidence-checklist"
      onclick="switchTab('evidence-checklist', event)"
    >
      Evidence checklist
    </button>
  </div>

  <div id="sender-view" class="dl-tab-panel active">
    <!-- sender content -->
  </div>
  <div id="recipient-view" class="dl-tab-panel">
    <!-- recipient content -->
  </div>
  <div id="evidence-checklist" class="dl-tab-panel">
    <!-- checklist content -->
  </div>
</div>
```

Rules:

- Always call `switchTab('tab-id', event)` from `onclick`.
- Always pass `event` as the second argument.
- Do not add extra listeners in separate JS that duplicate functionality.
- Do not manipulate window scroll (no `window.scrollTo` or similar) inside the tab function.

#### Arrows for tab rows

If left/right arrows are used to scroll a row of tab buttons:

- Place them inside the same `.dl-tab-container`.
- Make them scroll only the tab button row (e.g. update `scrollLeft` on `.dl-tab-buttons`).
- Do not use sticky or fixed positioning that makes arrows float across unrelated content.
- Do not duplicate arrows above and below the same tab row; they should appear once in a predictable place.

---

## 4. Content structure for each hub

Every demand-letter hub widget should behave like a compact playbook for a specific scenario, with both perspectives (sender and recipient) and clear general vs California scope where relevant.

### 4.1 Standard tab structure

For most hubs, tabs should correspond roughly to:

#### 1. Sender tab – "I need to send a demand letter"

- When a demand letter is appropriate vs premature.
- Who to address (insurer vs individual vs company vs platform).
- How to structure the letter: facts, liability, damages, demand, deadline, exhibits.
- How demand letters interact with statutes of limitation, contractual notice requirements, and (where relevant) government claim deadlines.
- When DIY can make sense vs when hiring an attorney is strongly recommended.

#### 2. Recipient tab – "I received a demand letter"

- First 48–72 hours after receiving the letter.
- What not to do: admissions, threats, ignoring correspondence, contacting represented parties.
- Triage steps: gather contracts, policies, prior emails, internal notes; check for insurance and indemnity.
- When to bring in insurers, in-house counsel, or outside counsel.
- Typical response options: deny, partial pay, negotiate, tender to another party, or prepare to litigate/arbitrate.

#### 3. Evidence / documentation tab

- Scenario-specific evidence checklist (basic vs advanced).
- General pages: state-neutral, but with notes that details vary by jurisdiction.
- California pages: overlay California-specific requirements and practice (Gov Claims timelines, Howell/medical billing, wage/hour recordkeeping, etc.).

#### 4. Settlement ranges and practical odds

- Qualitative ranges for typical fact patterns (e.g., minor soft-tissue crashes vs surgery; small fund hold vs six-figure freeze).
- Realistic timelines:
  - Demand → negotiation → lawsuit/arbitration → payment.
- Factors that move a case up or down in settlement value (liability disputes, documentation quality, plaintiff/defendant profile).

#### 5. Snippets and mini-tools

- Copy-paste snippets:
  - Opening paragraphs.
  - Liability and facts sections.
  - Damages and settlement demands.
  - Response templates for recipients.
- Short mini-generators:
  - Input fields for core facts → output structured outlines or paragraphs.

#### 6. Attorney-led services

- Short, focused card explaining:
  - How the attorney approaches this specific type of matter.
  - Typical fee structures (e.g., flat fee for letter drafting, hourly for negotiation, hybrid for some disputes).
  - How to get in touch (Calendly + email), following contact rules below.

Tab labels can be customized for each topic, as long as the functions above are covered somewhere in the widget.

### 4.2 Phase 1 simplifications

During the initial coverage phase, you may:

- Combine tabs (e.g., "Evidence & Settlement" as one tab instead of two)
- Use simpler interactive elements (basic checklists and FAQ accordions rather than full calculators)
- Keep snippet libraries to 3-5 examples rather than 10+
- Write tighter, more focused content (1-2 paragraphs per section rather than 3-4)

The goal is working, useful, well-structured pages at moderate depth. Save the deep dives for Phase 2 upgrades.

---

## 5. Voice, branding, and positioning

### 5.1 Solo attorney positioning

All content must reflect that one known attorney personally handles these matters.

- Use first-person singular ("I," "me") when describing services or involvement.
- Use neutral formulations like "this guide" or "this page" when describing the resource itself.

Do not use anonymous plural branding:

- No "we," "our firm," "our team," "our services," etc.
- Do not imply paralegals or staff handle drafting; this is an attorney-led service.

Examples:

✅ "I personally draft and sign demand letters for California car accident cases."

✅ "If you want me to handle the letter, we start with a short document review and then a paid Zoom call."

❌ "Our team will draft your demand letter."

❌ "Our attorneys and staff manage the process from start to finish."

The attorney's name and credentials are already visible in the site header/author area; avoid repeating them excessively in the widget. Emphasize personal involvement, not name repetition.

---

## 6. Calendly and email rules

### 6.1 Calendly

Use **only** the known-good Calendly configuration:

```html
<!-- Calendly link widget begin -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
<a href=""
   onclick="Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;">
  Schedule a demand letter strategy call
</a>
<!-- Calendly link widget end -->
```

Or inline embed:

```html
<!-- Calendly inline widget begin -->
<div
  class="calendly-inline-widget"
  data-url="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1"
  style="min-width:320px;height:700px;"
></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
<!-- Calendly inline widget end -->
```

Rules:

- **Do not invent or alter Calendly URLs.**
- **Do not create new event types or subpaths.**
- CTA text can be tailored, e.g. "Schedule a car accident demand letter strategy call," but the underlying URL must remain the same.
- If a widget does not need an inline Calendly embed, use only the popup link or omit Calendly entirely.

### 6.2 Email and phone

- The **only** permitted email is: **owner@terms.law**
- **Do not use or invent any other email addresses.**
- **Do not include phone numbers** (real, masked, or placeholder).

### 6.3 No "free consultation" language

- Do not promise free consultations, free case evaluations, or similar.
- You may describe calls or initial reviews, but they must not be described as free.

Acceptable:

- "After reviewing your documents, I usually quote a flat fee for drafting and sending the letter."
- "If you want to talk about having me handle this, use the Calendly link below to schedule a Zoom call."

Not acceptable:

- "Book a free consultation now."
- "Get a free case evaluation."

---

## 7. Interactive features and advanced behavior

Demand-letter hubs should look like advanced, lawyer-built tools, not static blog text.

### Good interactive patterns:

1. **Mini demand-letter generators**
   - Inputs for parties, dates, incident summary, damages.
   - Output: structured outline or editable paragraph set.

2. **Snippet libraries**
   - Pre-written text for:
     - Opening, liability, damages, deadline, settlement language.
     - Preservation / spoliation notices.
     - Response language for recipients.

3. **Simple calculators**
   - Late-fee or interest calculators.
   - Very high-level settlement-range helpers (with disclaimers and no guarantees).

4. **FAQ accordions**
   - Expandable Q&A elements controlled by a simple `toggleFaq(button, event)` function:
     - The function toggles an `.open` class on the FAQ item and does nothing else.
     - No scroll manipulation.

Example FAQ block:

```html
<div class="dl-faq-item">
  <button class="dl-faq-question" onclick="toggleFaq(this, event)">
    What if the insurance company ignores my demand letter?
  </button>
  <div class="dl-faq-answer">
    <p>Explain next steps here…</p>
  </div>
</div>
```

### Phase 1 interactive minimums:

Every page should have **at least**:
- Working tabs (4-6 tabs)
- One checklist or snippet card section
- One FAQ accordion (3-5 questions)

Advanced features (calculators, generators) can be added in Phase 2 upgrades.

---

## 8. General vs California content rules

### 8.1 General ("nationwide") pages

General pages should:

- Explain how this type of demand letter usually works in U.S. practice overall.
- Be careful to note that laws differ by state and that readers must check local law.
- Use multiple state examples, including but not limited to California.
- Feature a **prominent call-out for California readers**:
  - "If your dispute is in California, I have a separate California-specific guide for this type of demand letter that goes into California law and strategy in more detail."

### 8.2 California pages

California pages should:

- Provide California-specific law and practice:
  - Statutes, regulations, and leading cases where helpful.
  - Procedures (Gov Claims Act, arbitration, court timelines).
  - California-only issues (Prop 51, Prop 213, Howell/Sanchez, wage/hour nuances, CLRA, CCPA/CPRA, etc.).
- Explain how the attorney personally uses demand letters in California:
  - How demand letters fit into negotiation and litigation strategy.
  - Typical California timelines and settlement dynamics.
- Conversion focus:
  - California pages are the primary conversion engines for paid work.
  - General pages mainly attract traffic and route California readers to the California pages.

---

## 9. Sender vs recipient rules

Every major hub should explicitly recognize and serve:

- **Senders** – people intending to write and send a demand letter.
- **Recipients** – people or companies who have received a demand letter.

The content should:

- Use clear labels like "If you need to send a demand letter…" and "If you've received a letter like this…"
- Offer concrete next steps and snippet examples for both sending and responding.
- Clarify when the dispute is likely to remain pre-litigation vs when formal litigation or arbitration is likely.

---

## 10. Compliance checklist

When a new demand-letter hub or widget is created, verify:

### Role / scope
- [ ] Page knows whether it is a general or California guide.
- [ ] If it's a high-value topic, both a general and a California page exist or are planned.

### Two-sided coverage
- [ ] Both sending and receiving perspectives are addressed.

### Widget structure
- [ ] No `<h1>`–`<h6>` tags inside the widget.
- [ ] Root wrapper (`.demand-letter-hub` or similar) is present.
- [ ] Tabs use the standard `switchTab('id', event)` function.
- [ ] Arrows (if any) only affect the tab row, and appear once in a sensible place.

### CSS scope
- [ ] No CSS targeting `body`, `html`, or global elements.
- [ ] All styles are scoped to the widget wrapper.

### Voice
- [ ] First-person singular where describing services.
- [ ] No "we," "our team," or generic firm language.
- [ ] Attorney-led nature is clear.

### Contact info
- [ ] Only `owner@terms.law` used.
- [ ] Only the approved Calendly URLs used.
- [ ] No phone numbers.
- [ ] No "free consultation" offers.

### Interactivity
- [ ] Includes at least: working tabs, one checklist/snippet section, one FAQ accordion.

Any hub that fails these checks should be revised before deployment.

---

## 11. Batching and sprint workflow

### For creating multiple pages per prompt:

**Simple pages** (checklists, "how to respond"): 5-7 per batch
**Standard hubs** (full tabs, evidence, settlement): 3-4 per batch
**Complex pillars** (deep analysis, multiple calculators): 1-2 per batch

### Suggested sprint structure:

**Sprint 1: Core general guides** (3-4 pages)
- Main nationwide demand letter guide for the topic
- Evidence checklist (general)
- One important specialty or sub-topic (general)

**Sprint 2: California core** (3-4 pages)
- California-specific version of main guide
- California evidence checklist
- California specialty topics

**Sprint 3: Recipient/defense** (3-4 pages)
- General "you received a demand letter" guide
- California "you received a demand letter" guide
- Defense strategy and response snippets

**Sprint 4: Niche and advanced** (3-5 pages)
- Specialty sub-topics (rideshare, government vehicles, etc.)
- Advanced tools (calculators, generators)
- Cross-links and related topics

### File naming:

Use clear, natural titles as filenames:
- `car-accident-demand-letters-guide.html`
- `california-car-accident-demand-guide.html`
- `building-car-crash-demand-file-evidence.html`

Not:
- `car-accident-demand-letters-us-guide.html` (don't put "US" in filename)
- `01-car-accident-general.html` (don't use numbers)
- `car_accident_demand.html` (don't use underscores)

---

## 12. Final reminders

1. **Never include "TODO" markers in generated HTML files.** Those are for planning only.

2. **All files must be complete, working HTML** ready to paste into WordPress Custom HTML blocks.

3. **Test the tabs mentally**: Make sure `switchTab()` function is included, tab buttons have correct `onclick` handlers, and tab panels have matching IDs.

4. **Check the California link**: Every general page must have a clear, prominent section linking to the corresponding California page (use the actual filename).

5. **Phase 1 = breadth, Phase 2 = depth**: Don't over-engineer early pages. Get coverage first, upgrade popular pages later.

6. **When in doubt, look at `california-car-accident-demand-guide.html`** as the reference for:
   - Tab structure
   - CSS scoping
   - Voice and positioning
   - Interactive elements
   - Calendly and contact info

This file is the single source of truth for all demand-letter hub development.
