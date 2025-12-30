# NDA Studio Build Plan

Complete toolkit for NDA creation, analysis, and negotiation | Terms.Law

## Project Stats

| Metric | Value |
|--------|-------|
| HTML Pages Built | 38 |
| Current Phase | 1 Complete |
| Agents Used | 10 |
| API Keys Needed | 0 |

---

## Phase 1: Core Build (COMPLETE)

10 parallel agents completed the initial build.

### Agents Deployed

| Agent | Task | Status |
|-------|------|--------|
| 1 | NDA Studio Landing (`/NDA/index.html`) | Done |
| 2 | Scenario Presets (8 pages) | Done |
| 3 | NDA Generator (`/NDA/generator.html`) | Done |
| 4 | Decision Tree (`/NDA/which-nda.html`) | Done |
| 5 | Negotiation Mode (`/NDA/tools/negotiation-mode.html`) | Done |
| 6 | Risk Analyzer (`/NDA/tools/risk-analyzer.html`) | Done |
| 7 | Clause Library (20 pages) | Done |
| 8 | Business Deal Hub (5 pages) | Done |
| 9 | QA Review (GA, Calendly) | Done |
| 10 | Cross-Linking | Done |

### Integration Tasks Completed

- [x] Added NDA Studio to site mega-header (under Contracts)
- [x] Added to Contracts landing page with "New" tag
- [x] Linked from NDA blog posts (BDSM Contracts, Sex NDA)
- [x] Updated sitemap.xml (35 new URLs)
- [x] Chat widget integrated (same as front page, routes to Telegram)

---

## Phase 2: Polish & Integration (UP NEXT)

10 parallel agents for cleanup and cross-linking.

### Agents to Deploy

| Agent | Task | Description |
|-------|------|-------------|
| 11 | 404 Link Audit | Check all breadcrumb and internal links |
| 12 | Scenarios Index | Create `/NDA/scenarios/index.html` |
| 13 | Tools Index | Create `/NDA/tools/index.html` |
| 14 | Blog Cross-Links | Link from all dated-URL NDA/contract posts |
| 15 | Header Consistency | Identical mega-header on all 38 pages |
| 16 | Footer Consistency | Standardize footers |
| 17 | SEO Meta Tags | Open Graph, Twitter cards, canonical URLs |
| 18 | Schema Markup | JSON-LD structured data |
| 19 | Sitemap Validation | Verify all URLs resolve |
| 20 | Final QA | GA, chat widget, mobile responsive |

### Tasks

- [ ] Create `/NDA/scenarios/index.html` - landing for all 8 scenarios
- [ ] Create `/NDA/tools/index.html` - landing for Risk Analyzer + Negotiation Mode
- [ ] Fix breadcrumb navigation (no 404s)
- [ ] Link from all NDA-related WP posts
- [ ] Add chat widget to all 38 pages (currently only on index.html)

---

## Phase 3: Future Enhancements

| Feature | Description | API Required? |
|---------|-------------|---------------|
| AI-Powered NDA Review | Claude integration for deep analysis | Yes (Anthropic API) |
| NDA Comparison Tool | Side-by-side comparison | No |
| PDF Export | Print-ready PDF from generator | No |
| E-Signature Integration | DocuSign/HelloSign | Yes (3rd party) |

---

## About the Risk Analyzer

**No API keys needed!**

The Risk Analyzer (`/NDA/tools/risk-analyzer.html`) is 100% client-side JavaScript using regex pattern matching:

- Red flags (perpetual terms, unlimited liability, non-compete overreach)
- Missing protections (carve-outs, time limits, mutual obligations)
- Clause coverage and bias scoring

No API calls, no server-side processing. Works offline.

If you want AI-powered analysis in the future, that would require an Anthropic API key and a serverless function to proxy the requests.

---

## File Structure

```
/NDA/
├── index.html                    # Main landing page
├── generator.html                # NDA Generator tool
├── which-nda.html               # Decision tree wizard
├── BUILD-PLAN.html              # Visual build plan
├── BUILD-PLAN.md                # This file
│
├── /tools/
│   ├── risk-analyzer.html       # Client-side NDA analyzer
│   ├── negotiation-mode.html    # Negotiation playbook
│   └── index.html               # NEEDS: Tools landing
│
├── /clause-library/
│   ├── index.html               # Clause library landing
│   └── [20 clause pages]        # Individual clauses
│
└── /scenarios/
    ├── index.html               # NEEDS: Scenarios landing
    ├── /business-deal/          # 5 pages
    ├── /contractor/             # 1 page
    ├── /employee-hiring/        # 1 page
    ├── /investor-pitch/         # 1 page
    ├── /merger-acquisition/     # 1 page
    ├── /partnership/            # 1 page
    ├── /tech-licensing/         # 1 page
    └── /vendor-evaluation/      # 1 page
```

---

*Last updated: December 29, 2025*
