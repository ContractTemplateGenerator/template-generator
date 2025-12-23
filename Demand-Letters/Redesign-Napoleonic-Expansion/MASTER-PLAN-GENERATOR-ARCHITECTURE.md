# Demand Letter Generator: Master Architecture Plan

## The Core Concept

One **Generator Engine** powers everything. Thousands of **SEO pages** feed into it.

When a user lands on any page (e.g., "California Security Deposit Demand Letter"), that page loads the Generator Engine with the correct **particulars** pre-filled based on the page's taxonomy coordinates.

```
[SEO Page: /security-deposit/california/residential/]
    ↓ passes parameters
[Generator Engine]
    ↓ pulls in
[Particulars Module: security-deposit + california + residential]
    ↓ builds
[Customized Letter with state-specific law, deadlines, remedies]
```

---

## How the Generator Engine Works

### The Engine (Single Codebase)
One JavaScript/HTML generator that handles ALL letter types. It receives parameters and dynamically loads:

1. **Claim-Specific Content** - Legal language, elements to prove, typical damages
2. **State-Specific Law** - Statutes, case law citations, filing deadlines
3. **Opponent-Specific Language** - If suing Stripe, PayPal, Amazon, etc.
4. **Relationship-Specific Framing** - Employer-employee vs landlord-tenant vs B2B
5. **Remedy-Specific Demands** - Money, action, records, cease activity

### How It Pulls In Particulars

**Option A: Iframe Embed**
```html
<!-- On the SEO page -->
<iframe src="/generator-engine/?
    claim=security-deposit
    &state=CA
    &relationship=landlord-tenant
    &opponent-type=individual-landlord
    &amount-type=fixed
    &deadline-passed=false">
</iframe>
```

**Option B: Dynamic JavaScript Load**
```html
<!-- On the SEO page -->
<div id="generator-container"></div>
<script>
    loadGenerator({
        claim: 'security-deposit',
        state: 'CA',
        relationship: 'landlord-tenant',
        opponentType: 'individual-landlord'
    });
</script>
```

**Option C: Server-Side Render**
- Each SEO page is a static HTML file
- Generator section is pre-rendered with the correct particulars
- User interactions handled by JavaScript

**Recommended: Option B** - Best balance of SEO (static content on page) + dynamic generator functionality.

---

## The Six-Dimension Ontology

Every page and every letter is defined by coordinates across 6 dimensions:

### 1. CLAIM TYPE (What Happened)
The specific grievance or situation.

| Category | Example Claims | Est. Variations |
|----------|---------------|-----------------|
| Employment | Unpaid wages, wrongful termination, discrimination, harassment, misclassification, retaliation, FMLA violation, non-compete dispute | 40+ |
| Landlord-Tenant | Security deposit, habitability, illegal entry, wrongful eviction, lease violation, repair demand, mold/lead | 30+ |
| Consumer | Refund, defective product, warranty breach, false advertising, subscription cancellation, credit reporting error | 35+ |
| Business/Contract | Unpaid invoice, breach of contract, partnership dispute, non-payment, scope creep, IP assignment | 40+ |
| Debt Collection | Personal loan, promissory note, bounced check, unjust enrichment | 15+ |
| Auto/Insurance | Accident damage, insurance bad faith, lemon law, repair dispute, diminished value | 25+ |
| Medical | Billing error, surprise billing, malpractice notice, records request, HIPAA violation | 20+ |
| Construction | Contractor default, defective work, mechanic's lien, delay damages, change order dispute | 20+ |
| IP/Content | Copyright infringement, DMCA, trademark, trade secret, defamation, cease & desist | 25+ |
| Real Estate | Boundary dispute, HOA violation, disclosure failure, title issue, earnest money | 20+ |
| Family/Personal | Child support, personal loan, property return, harassment cease & desist | 15+ |
| Privacy/Data | Data breach, CCPA/GDPR request, doxxing, revenge content removal | 15+ |
| Insurance | Claim denial, bad faith, undervaluation, delay tactics | 15+ |
| Premises Liability | Slip and fall, negligent security, dog bite, attractive nuisance | 15+ |

**Total Claim Types: ~330**

---

### 2. JURISDICTION (Where)
State-specific law, statutes, deadlines, and procedures.

| Level | Count | Notes |
|-------|-------|-------|
| 50 US States | 50 | Each has unique statutes, SOL, procedures |
| DC + Territories | 6 | DC, Puerto Rico, Guam, VI, AS, CNMI |
| Federal | 1 | FLSA, FCRA, FDCPA, etc. |

**Not every claim needs all 50 states.** Priority tiers:

- **Tier 1 (Day 1):** CA, TX, FL, NY, IL, PA, OH, GA, NC, MI (top 10 pop)
- **Tier 2 (Month 1):** Next 15 states by population
- **Tier 3 (Month 2):** Remaining 25 states

**State Variation Multiplier:**
- High-priority claims × 50 states = major page expansion
- ~100 top claims × 50 states = 5,000 state-specific pages

---

### 3. RELATIONSHIP (Who's Involved)
The legal relationship between sender and recipient.

| Relationship Type | Implications |
|-------------------|--------------|
| Employee → Employer | Labor law protections, agency complaints, statutory penalties |
| Tenant → Landlord | Housing law, habitability, security deposit statutes |
| Consumer → Business | Consumer protection, warranty law, small claims friendly |
| Business → Business | Contract law, UCC, commercial standards |
| Business → Consumer | Debt collection, FDCPA if applicable |
| Individual → Individual | Personal disputes, less statutory protection |
| Contractor → Client | Construction law, lien rights, contract terms |
| Patient → Provider | Medical billing law, HIPAA, surprise billing acts |

**Relationship affects:**
- Tone and formality level
- Available legal theories
- Statutory citations
- Agency complaint options
- Escalation paths

---

### 4. OPPONENT TYPE (Who You're Writing To)
Generic opponent vs. specific company/platform.

#### Generic Opponents
- Individual person
- Small business / sole proprietor
- Corporation (general)
- Government entity
- Insurance company
- Healthcare provider
- Educational institution

#### Platform-Specific Opponents (Premium Hubs)
These get dedicated micro-sites with company-specific language:

| Platform | Common Issues | Est. Sub-Pages |
|----------|--------------|----------------|
| **Stripe** | Account termination, fund holds, reserve requirements, chargeback disputes | 25+ |
| **PayPal** | Account limitation, fund holds, buyer/seller disputes, policy violations | 25+ |
| **Amazon** | Seller suspension, A-to-Z claims, review manipulation, listing hijacking | 30+ |
| **Airbnb** | Host cancellation, guest damage, refund disputes, superhost issues | 20+ |
| **Meta/Facebook** | Ad account ban, page unpublishing, marketplace disputes, IP claims | 25+ |
| **YouTube** | Monetization loss, strikes, copyright claims, termination | 20+ |
| **eBay** | Seller defects, case closed, defect removal, fee disputes | 20+ |
| **Uber/Lyft** | Driver deactivation, passenger disputes, background check issues | 15+ |
| **Google** | Merchant suspension, AdWords ban, review removal | 20+ |
| **Apple** | App Store rejection, developer account termination | 15+ |

**Platform Hub Pages: ~215**

---

### 5. LEGAL THEORY (Why It's Wrong)
The legal basis for the claim.

| Theory Category | Specific Theories |
|-----------------|-------------------|
| **Contract** | Breach, anticipatory breach, material breach, unjust enrichment, promissory estoppel |
| **Tort** | Negligence, gross negligence, intentional tort, fraud, misrepresentation |
| **Statutory** | Consumer protection act, labor code, landlord-tenant act, lemon law |
| **Regulatory** | FDCPA, FCRA, HIPAA, TCPA, CCPA/GDPR |
| **Equity** | Specific performance, injunction, rescission, reformation |

**Legal theory determines:**
- Elements that must be proven
- Available damages (actual, statutory, punitive)
- Whether attorney fees are recoverable
- Class action potential

---

### 6. REMEDY SOUGHT (What You Want)
The specific outcome demanded.

| Remedy Type | Examples |
|-------------|----------|
| **Money Damages** | Specific dollar amount, with calculation breakdown |
| **Statutory Damages** | Fixed penalties per violation (e.g., $1,000 per TCPA call) |
| **Return of Property** | Security deposit, personal belongings, held inventory |
| **Specific Performance** | Complete the contracted work, deliver goods |
| **Cease & Desist** | Stop the behavior, remove content, stop contact |
| **Records/Information** | Personnel file, medical records, account data |
| **Correction** | Fix credit report, retract statement, restore account |
| **Policy Change** | Reinstatement, remove violation, clear record |

---

## Page Taxonomy & URL Structure

### Category Level (Tier 1)
```
/demand-letters/employment/
/demand-letters/landlord-tenant/
/demand-letters/consumer/
/demand-letters/business/
...
```
**Est. Pages: 14 category landing pages**

### Claim Level (Tier 2)
```
/demand-letters/employment/unpaid-wages/
/demand-letters/employment/wrongful-termination/
/demand-letters/landlord-tenant/security-deposit/
/demand-letters/consumer/refund-demand/
...
```
**Est. Pages: 330 claim-type pages**

### State-Specific Level (Tier 3)
```
/demand-letters/employment/unpaid-wages/california/
/demand-letters/employment/unpaid-wages/texas/
/demand-letters/landlord-tenant/security-deposit/new-york/
...
```
**Est. Pages: 100 top claims × 50 states = 5,000 pages**

### Situation-Specific Level (Tier 4)
Deep variations for long-tail SEO:
```
/demand-letters/employment/unpaid-wages/california/final-paycheck/
/demand-letters/employment/unpaid-wages/california/commission-dispute/
/demand-letters/employment/unpaid-wages/california/overtime/
/demand-letters/landlord-tenant/security-deposit/california/normal-wear-tear/
/demand-letters/landlord-tenant/security-deposit/california/never-received-itemization/
...
```
**Est. Pages: Top 50 claims × 5 situations × 50 states = 12,500 pages**

### Platform Hub Level
```
/demand-letters/stripe/
/demand-letters/stripe/account-terminated/
/demand-letters/stripe/funds-held/
/demand-letters/stripe/reserve-too-high/
/demand-letters/stripe/chargeback-dispute/
/demand-letters/paypal/
/demand-letters/paypal/account-limited/
...
```
**Est. Pages: 10 platforms × 20 sub-pages = 200 pages**

### Response/Defense Level
```
/demand-letters/respond/
/demand-letters/respond/got-a-demand-letter/
/demand-letters/respond/employment-claim/
/demand-letters/respond/employment-claim/deny-wrongdoing/
/demand-letters/respond/employment-claim/request-proof/
...
```
**Est. Pages: 50 claim types × 5 response postures = 250 pages**

---

## Estimated Total Page Count

| Page Type | Calculation | Est. Pages |
|-----------|-------------|------------|
| Category Landing Pages | 14 categories | 14 |
| Claim-Type Pages | 330 unique claims | 330 |
| State-Specific Pages | 100 top claims × 50 states | 5,000 |
| Situation-Specific (Long-tail) | 50 claims × 5 situations × 50 states | 12,500 |
| Platform Hub Pages | 10 platforms × 20 sub-pages | 200 |
| Response/Defense Pages | 50 claims × 5 postures | 250 |
| Tool & Calculator Pages | Deadline, damages, evidence, etc. | 50 |
| Guide/Explainer Pages | How-to, legal concepts, procedures | 100 |
| **TOTAL** | | **~18,500** |

### Phased Rollout

| Phase | Focus | Pages | Cumulative |
|-------|-------|-------|------------|
| **Phase 1** | Core 50 claims + 10 states | 550 | 550 |
| **Phase 2** | Add 50 states for top 20 claims | 1,000 | 1,550 |
| **Phase 3** | Platform hubs (Stripe, PayPal, Amazon) | 200 | 1,750 |
| **Phase 4** | Long-tail situations for top 30 claims | 3,000 | 4,750 |
| **Phase 5** | Response/defense pages | 250 | 5,000 |
| **Phase 6+** | Deep long-tail expansion | 13,500 | 18,500 |

---

## The Generator Engine: Feature Depth

### Core Features (Every Letter)
- **Smart Question Flow** - Conditional logic based on claim type
- **Auto-Calculation** - Damages, interest, penalties computed
- **State Law Integration** - Correct statutes, SOL, procedures
- **Legal Element Checker** - Ensures all required elements included
- **Tone Selector** - Professional, Firm, Final Warning
- **Export Options** - PDF, Word, Plain Text, Copy to Clipboard

### Advanced Features
- **Evidence Checklist** - What to attach based on claim type
- **Deadline Calculator** - Statute of limitations, response deadlines
- **Escalation Roadmap** - Next steps if no response
- **Certified Mail Integration** - Send directly through the site
- **Response Tracker** - Log responses, follow-ups
- **Settlement Calculator** - What's the claim worth?

### Conditional Logic Examples

**Security Deposit Flow:**
```
Q: What state?
→ Loads state-specific law module

Q: Residential or commercial?
→ Residential triggers tenant protection statutes

Q: Did landlord provide itemization within [X] days?
→ If NO: Adds statutory penalty demand (2x-3x in some states)

Q: What deductions were taken?
→ Generates specific dispute language for each deduction type

Q: Amount of deposit?
→ Calculates demand: deposit + penalties + interest
```

**Unpaid Wages Flow:**
```
Q: What state?
→ Loads state labor code module

Q: What type of wages?
→ Regular pay, overtime, commission, bonus, final paycheck

Q: Were you terminated or did you quit?
→ Determines waiting time penalty eligibility

Q: How many days since wages were due?
→ Calculates daily penalties (CA: up to 30 days of wages)

Q: Do you have pay stubs?
→ If NO: Adds pay stub penalty claim where applicable
```

### Particular Modules (JSON/Markdown Data)

Each claim type has a "particulars module" containing:

```json
{
  "claim_id": "security-deposit",
  "category": "landlord-tenant",
  "display_name": "Security Deposit Demand",

  "legal_elements": [
    "Landlord-tenant relationship existed",
    "Security deposit was paid",
    "Tenancy ended on [date]",
    "Deposit not returned within statutory period",
    "No valid itemization of deductions provided"
  ],

  "state_variations": {
    "CA": {
      "statute": "California Civil Code § 1950.5",
      "return_deadline": "21 days",
      "penalty": "Up to 2x deposit for bad faith",
      "interest_required": false,
      "itemization_required": true
    },
    "NY": {
      "statute": "NY GOL § 7-103 to 7-109",
      "return_deadline": "14 days",
      "penalty": "Court discretion",
      "interest_required": true,
      "itemization_required": true
    }
  },

  "questions": [
    {
      "id": "deposit_amount",
      "type": "currency",
      "prompt": "How much was your security deposit?",
      "required": true
    },
    {
      "id": "move_out_date",
      "type": "date",
      "prompt": "When did you move out?",
      "required": true
    },
    {
      "id": "received_itemization",
      "type": "boolean",
      "prompt": "Did you receive an itemized statement of deductions?",
      "required": true
    },
    {
      "id": "deduction_types",
      "type": "multi_select",
      "prompt": "What deductions were claimed?",
      "options": ["Cleaning", "Repairs", "Unpaid rent", "Other"],
      "show_if": "received_itemization == true"
    }
  ],

  "letter_sections": {
    "intro": "I am writing to demand the return of my security deposit...",
    "facts": "On [move_in_date], I paid a security deposit of [deposit_amount]...",
    "law": "[STATE_STATUTE] requires landlords to return security deposits within [RETURN_DEADLINE]...",
    "demand": "I demand payment of [CALCULATED_TOTAL] within [DEADLINE] days...",
    "consequence": "If I do not receive payment, I will file a claim in [SMALL_CLAIMS_COURT]..."
  },

  "escalation_path": [
    "Send demand letter (this)",
    "File complaint with state housing agency",
    "File small claims court case",
    "Seek attorney for statutory damages claim"
  ]
}
```

---

## Anti-Duplicate Content Strategy

### The 2-of-6 Rule
Every page must differ on at least 2 of the 6 ontology dimensions:

| Page A | Page B | Difference Count | Valid? |
|--------|--------|------------------|--------|
| Security Deposit + CA | Security Deposit + TX | 1 (state) | Need more differentiation in content |
| Security Deposit + CA | Unpaid Wages + CA | 1 (claim) | Need more differentiation in content |
| Security Deposit + CA + Residential | Security Deposit + CA + Commercial | 2 (claim + relationship) | ✓ Valid |
| Security Deposit + CA | Security Deposit + TX | 1 (state) | Valid IF content differs: different statute, deadline, penalty |

### Content Differentiation Strategies

**State Pages Must Include:**
- State-specific statute citation and text
- State-specific deadline/SOL
- State-specific penalty structure
- State-specific court/agency options
- At least 200 words of unique state-specific content

**Situation Pages Must Include:**
- Specific fact pattern (not generic)
- Targeted legal analysis for that situation
- Specific evidence for that situation
- Specific calculation example
- At least 300 words unique to that situation

---

## Interactive Tools (The "Engine" Layer)

### Tool 1: Letter Generator (Core)
The main product. Embedded on every claim page.

### Tool 2: Deadline Calculator
- Input: Claim type, state, key date
- Output: All relevant deadlines (SOL, response period, agency deadlines)

### Tool 3: Damages Calculator
- Input: Claim type, amounts, dates
- Output: Total demand with breakdown (principal, interest, penalties, fees)

### Tool 4: Evidence Checklist
- Input: Claim type
- Output: Required and recommended documents to gather

### Tool 5: Claim Evaluator
- Input: Key facts of situation
- Output: Strength assessment, likely outcomes, recommended action

### Tool 6: Response Analyzer (For Recipients)
- Input: Upload or paste received demand letter
- Output: Analysis of claims, recommended response strategy

### Tool 7: Court Finder
- Input: State, county, claim amount
- Output: Which court to file in, filing fee, procedure link

### Tool 8: Escalation Planner
- Input: Claim type, current stage
- Output: Next steps with timelines and success rates

---

## Revenue Integration Points

### Free Tier (Lead Generation)
- Full access to all generators
- PDF download with Terms.Law branding
- Email capture for download

### $150 Tier: Attorney Review
- Upsell at download step
- "Want me to review this before you send?"
- 48-hour turnaround

### $450-850 Tier: Attorney-Written Letter
- Upsell for complex claims or high-value disputes
- Custom letter on letterhead, my signature
- Includes certified mail sending

### $1,200-5,000 Tier: Platform Dispute Package
- Premium offering for Stripe/PayPal/Amazon disputes
- Full case preparation
- Multiple letters in escalation sequence
- Agency complaint drafting

### Affiliate Revenue
- Certified mail service referral
- Court filing service referral
- Attorney referral network (for cases beyond demand letters)

---

## SEO Strategy

### Primary Keyword Targets
Every page targets a search intent:

| Keyword Pattern | Example | Monthly Volume |
|-----------------|---------|----------------|
| [claim type] demand letter | "security deposit demand letter" | 2,400 |
| [claim type] demand letter [state] | "security deposit demand letter california" | 1,300 |
| demand letter for [situation] | "demand letter for unpaid wages" | 1,900 |
| how to write a demand letter for [claim] | "how to write a demand letter for refund" | 880 |
| [platform] demand letter | "paypal demand letter" | 320 |
| letter to [opponent] for [claim] | "letter to landlord for security deposit" | 720 |

### Long-Tail Capture
Thousands of pages capturing low-volume but high-intent searches:
- "california security deposit demand letter 21 days"
- "landlord didn't return deposit no itemization"
- "stripe froze my account demand letter"

### Content Depth Signals
Each page includes:
- 1,500+ words of substantive content
- State-specific legal citations
- Step-by-step procedure
- FAQ section
- Related situations internal links
- Attorney bio/credentials (E-E-A-T)

---

## Technical Architecture

### Static Site Generation
- Pages generated at build time from data modules
- Fast loading, excellent SEO
- Generator widget loads dynamically

### Data Layer
```
/data/
  /claims/
    security-deposit.json
    unpaid-wages.json
    ...
  /states/
    california.json
    texas.json
    ...
  /platforms/
    stripe.json
    paypal.json
    ...
  /relationships/
    landlord-tenant.json
    employer-employee.json
    ...
```

### Generator Widget
- Single React/Vue component
- Receives parameters from page
- Fetches relevant data modules
- Renders conditional question flow
- Generates letter in real-time
- Exports to PDF/Word

### CMS Integration
- Headless CMS for content management
- Legal content stored in structured format
- Easy updates when laws change
- Version control for compliance

---

## Implementation Phases

### Phase 1: Foundation (Sprint 1-2)
- Build generator engine with 5 core claim types
- 10-state coverage for each
- 50 seed pages live

### Phase 2: Expansion (Sprint 3-4)
- Add 20 more claim types
- Full 50-state coverage for top 10 claims
- 500+ pages live

### Phase 3: Platform Hubs (Sprint 5-6)
- Stripe, PayPal, Amazon hub pages
- Platform-specific generator modules
- 200 platform pages live

### Phase 4: Response System (Sprint 7-8)
- "I received a demand letter" flow
- Response generator engine
- 250 response pages live

### Phase 5: Deep Long-Tail (Ongoing)
- Situation-specific variations
- Edge cases and niche claims
- Scale to 5,000+ pages

### Phase 6: Automation & Maintenance
- Automated law change monitoring
- User feedback integration
- Continuous content expansion

---

## Success Metrics

| Metric | Phase 1 Target | Phase 3 Target | Phase 6 Target |
|--------|----------------|----------------|----------------|
| Pages Live | 50 | 1,000 | 5,000+ |
| Monthly Organic Traffic | 1,000 | 25,000 | 100,000+ |
| Letters Generated/Month | 100 | 2,500 | 10,000+ |
| Attorney Review Conversions | 5 | 125 | 500+ |
| Attorney Letter Sales | 2 | 50 | 200+ |
| Platform Package Sales | 0 | 10 | 50+ |

---

## Summary

**The System:**
- 1 Generator Engine
- 6 Ontology Dimensions
- ~18,500 Potential Pages
- Thousands of long-tail keyword captures

**The Moat:**
- No competitor has attorney-drafted content at this scale
- No competitor has state-specific depth
- No competitor has platform-specific hubs
- No competitor has the response/defense system

**The Revenue:**
- Free generator drives massive traffic
- Paid tiers capture high-intent users
- Platform packages capture premium B2B

This is the Napoleonic expansion: one engine, infinite reach.
