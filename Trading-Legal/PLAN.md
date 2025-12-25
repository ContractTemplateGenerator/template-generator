# Trading Legal Hub - Build Plan

**Author:** Sergei Tokmakov, Esq.
**Status:** Stage 1 In Progress
**Last Updated:** Dec 24, 2024

---

## My Vision

I'm building a comprehensive legal resource hub specifically for algo trading founders. This isn't generic legal content—it's targeted guidance for the unique regulatory challenges facing quantitative traders, trading platform operators, and fintech founders.

My differentiation: I'm a tech lawyer who understands both the code and the compliance. Not an anonymous "we" but direct, practical guidance from someone who's navigated these waters.

---

## Stage 1: Foundation (Current)

### Hub Infrastructure
- [x] Landing page (index.html) - Main hub entry point
- [x] Project Profile Workbench - Interactive profile builder with localStorage persistence

### Interactive Tools
- [x] IA Decision Tree - Do I need to register as an Investment Adviser?
- [x] 475(f) Tax Calculator - Mark-to-market election analysis
- [x] State Registration Finder - State-by-state MTL requirements

### Core Guides (Cornerstone Content)
- [x] Investment Adviser Registration Guide
- [x] CTA/CPO Registration Explained
- [x] 475(f) Mark-to-Market Election Guide
- [x] State Money Transmitter Requirements
- [x] FinCEN AML Obligations
- [ ] Broker-Dealer vs RIA Path
- [ ] Terms of Service for Trading Platforms
- [ ] Privacy Policy Requirements
- [ ] Regulatory Budget Planning

---

## Stage 2: Expansion

### Additional Tools I'm Planning
- [ ] Regulatory Timeline Builder - Map my compliance milestones
- [ ] Cost Estimator - Total regulatory budget calculator
- [ ] Exemption Checker - Comprehensive exemption analysis
- [ ] Entity Structure Advisor - LLC vs Corp vs LP for trading
- [ ] Jurisdiction Selector - Where should I incorporate?

### Deep-Dive Guides
- [ ] SEC No-Action Letters That Matter
- [ ] Crypto Regulatory Landscape 2025
- [ ] Prop Trading vs Managing External Capital
- [ ] International Expansion Considerations
- [ ] Regulatory Enforcement Trends

### State-Specific Pages
- [ ] California Trading Regulations
- [ ] New York BitLicense Deep Dive
- [ ] Texas MTL Exemptions
- [ ] Wyoming DAO & Crypto-Friendly Laws
- [ ] Delaware Entity Advantages

### Use Case Guides
- [ ] I Built a Trading Bot - Now What?
- [ ] My Friends Want to Invest in My Strategy
- [ ] I Want to Launch a Hedge Fund
- [ ] I'm Building a Copy Trading Platform
- [ ] I Want to Tokenize My Trading Strategy

---

## Stage 3: Advanced Features

### Interactive Capabilities
- [ ] Compliance Checklist Generator (dynamic based on profile)
- [ ] Document Request Builder
- [ ] Regulatory Calendar Sync
- [ ] Progress Tracker with Milestones

### Integration Points
- [ ] Link to my Terms.Law main site
- [ ] Connect to my contract templates
- [ ] Blog cross-references
- [ ] Consultation booking flow

---

## Design Principles

1. **First-Person Voice** - This is my direct guidance, not anonymous corporate content
2. **Practical Focus** - Actionable steps, not theoretical discussions
3. **Full-Width Layouts** - Modern, spacious design
4. **Non-Public** - noindex/nofollow until ready for launch
5. **Updated Dates** - Sept 2025 standard across all pages
6. **Consistent Navigation** - Breadcrumbs showing location in hub
7. **Interactive Elements** - Tools that provide real value, not just content

---

## Technical Notes

- All pages use Inter font from Google Fonts
- CSS variables for consistent theming
- LocalStorage for workbench state persistence
- Responsive grid layouts
- Sidebar with TOC on guide pages
- CTA cards linking to relevant tools

---

## Files Structure

```
Trading-Legal/
├── index.html              # Hub landing page
├── workbench.html          # Project Profile Workbench
├── PLAN.md                 # This file
├── SITEMAP.md              # Site structure
├── tools/
│   ├── ia-decision-tree.html
│   ├── tax-calculator.html
│   └── state-finder.html
└── guides/
    ├── investment-adviser-registration.html
    ├── cta-cpo-registration.html
    ├── 475f-election.html
    ├── state-money-transmitter.html
    ├── fincen-aml.html
    ├── broker-dealer-vs-ria.html      # Next
    ├── terms-of-service.html          # Pending
    ├── privacy-requirements.html      # Pending
    └── regulatory-budget.html         # Pending
```
