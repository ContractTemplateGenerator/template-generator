# TCPA Hub Implementation Plan for Terms.Law

## Overview
This plan creates a comprehensive TCPA (Telephone Consumer Protection Act) specialist hub with:
- 1 Pillar page (main hub)
- 8 Supporting pages
- 2 Interactive tools

---

## Site Architecture: Where TCPA Fits

### Primary Location (Response Side - Business Defense)
```
/Demand-Letters/respond/telemarketing-tcpa/
├── index.html                              [PILLAR - Main Hub]
├── tcpa-robocalls-robotexts-response.html  [Response Guide]
├── consent-evidence-checklist.html         [Evidence Guide]
├── dnc-optout-violations.html              [DNC/Opt-Out Guide]
├── vendor-liability-indemnity.html         [Vendor/Lead-Gen Guide]
├── settlement-terms-playbook.html          [Settlement Guide]
├── compliance-remediation.html             [Compliance Fix Guide]
├── tcpa-exposure-calculator.html           [TOOL]
└── tcpa-consent-generator.html             [TOOL]
```

### Secondary Cross-Link (Consumer Side - Claimant Templates)
```
/Demand-Letters/Consumer/
└── tcpa-robocall-robotext-demand-letters.html  [Consumer demand templates]
```

### Navigation Updates Required
1. Add "Telemarketing (TCPA)" to `/Demand-Letters/respond/index.html` quick-links grid
2. Add "TCPA / Robocalls" to `/Demand-Letters/Consumer/index.html` guide list
3. Cross-link between consumer and response sides (like existing pattern)

---

## Page 1: PILLAR - Main TCPA Response Hub
**File:** `/Demand-Letters/respond/telemarketing-tcpa/index.html`

### Header
- Title: "Responding to TCPA Demand Letters | Robocalls & Robotexts"
- Subtitle: "Pre-litigation strategy, settlement playbook, and compliance remediation for businesses"
- Color scheme: Red/coral (#dc2626) for urgency (matches respond/ hub)

### Hero Stats
- "9 Guides" | "TCPA Framework" | "48-Hour Triage"

### Key Sections
1. **"Received a TCPA demand?" Callout Box**
   - Urgency messaging
   - Link to 48-hour triage checklist
   - Link to calculator tool

2. **TCPA in 90 Seconds**
   - What triggers claims (robocalls, robotexts, prerecorded voice, DNC violations)
   - Why it settles fast ($500-$1,500 per communication + class risk)
   - What matters most (consent proof, opt-out logs, vendor chain)
   - What not to do (admissions, deleting logs)

3. **Quick Links Grid** (same pattern as `/Demand-Letters/respond/index.html`)
   - Links to all 8 supporting pages + 2 tools

4. **When to Get Attorney Help**
   - Similar to respond hub pattern
   - Calendly embed

### Tab Structure (if needed)
- Overview | Legal Framework | Response Strategy | Tools | Attorney Services

---

## Page 2: First Response Guide
**File:** `tcpa-robocalls-robotexts-response.html`

### Purpose
Step-by-step guide for business receiving first TCPA demand/threat

### Tabs
1. **48-Hour Triage**
   - Immediate actions checklist
   - What to freeze/pause
   - Evidence to preserve

2. **Exposure Assessment**
   - How claims are counted (per call/text)
   - Willfulness multiplier (3x)
   - Class risk indicators

3. **Defense Strategies**
   - Consent-based defenses
   - Technology arguments
   - Vendor causation
   - Standing issues

4. **First Response Template**
   - Copy/paste letter
   - Request for particulars
   - No-admission language
   - Extension request option

5. **Attorney Services**
   - CTA for consultation

---

## Page 3: Consent Evidence Checklist
**File:** `consent-evidence-checklist.html`

### Purpose
What records to pull and how to evaluate consent quality

### Tabs
1. **What Counts as Consent**
   - Prior express consent (informational)
   - Prior express written consent (marketing)
   - Revocation mechanics

2. **Evidence Hierarchy**
   - Strong: Timestamped webform + checkbox language + IP + UTM
   - Medium: CRM records + email confirmation
   - Weak: "We always get consent" (no records)

3. **Platform-Specific Logs**
   - Twilio, CallFire, RingCentral log exports
   - CRM consent fields
   - Lead form snapshots

4. **Vendor Records to Request**
   - Lead seller proof of consent
   - Audit trail requirements
   - Indemnity trigger documentation

5. **Preservation Checklist**
   - Litigation hold template
   - Retention override instructions

---

## Page 4: DNC & Opt-Out Violations
**File:** `dnc-optout-violations.html`

### Purpose
Handling claims based on Do-Not-Call or STOP/opt-out failures

### Tabs
1. **National DNC Registry**
   - Safe harbor requirements
   - Scrubbing frequency (31 days)
   - EBR exemption

2. **Internal DNC List**
   - Requirements under TCPA
   - Reasonable time to process
   - Cross-platform sync issues

3. **Opt-Out/STOP Mechanics**
   - SMS keyword handling
   - Suppression propagation
   - Repeat-contact liability

4. **Common Failures**
   - Vendor list not synced
   - "STOP" processed late
   - Reassigned number issues

5. **Remediation Steps**
   - Policy template
   - Training checklist
   - Audit procedures

---

## Page 5: Vendor Liability & Indemnity
**File:** `vendor-liability-indemnity.html`

### Purpose
When a third-party sent the texts - liability allocation

### Tabs
1. **Vicarious Liability Framework**
   - Agency theory
   - "On behalf of" standard
   - FCC guidance

2. **Vendor Defense Strategies**
   - Independent contractor vs agent
   - Lack of control arguments
   - Contractual indemnity triggers

3. **Contract Clauses Review**
   - TCPA reps/warranties
   - Indemnification scope
   - Audit rights
   - Cooperation requirements

4. **Vendor Hold & Records Demand**
   - Template letter to vendor
   - Litigation hold notice
   - Evidence export request

5. **Tendering to Vendor**
   - When to tender
   - Tender letter template
   - Following up

---

## Page 6: Settlement Terms Playbook
**File:** `settlement-terms-playbook.html`

### Purpose
How to structure and negotiate TCPA settlements

### Tabs
1. **Pre-Lit Settlement Structure**
   - Term sheet approach
   - Key negotiation levers
   - When NOT to settle

2. **Release Scope**
   - Known vs unknown claims
   - Class action waiver considerations
   - State law analogs

3. **Key Settlement Terms**
   - No-admission clause
   - Confidentiality (+ carveouts)
   - Non-disparagement
   - No future contact clause
   - Compliance undertaking

4. **Settlement Term Sheet Template**
   - Copy/paste template
   - Variable terms

5. **Settlement Agreement Clauses**
   - Clause library with "when to use" notes

---

## Page 7: Compliance Remediation
**File:** `compliance-remediation.html`

### Purpose
Fixing the underlying compliance issues to prevent recurrence

### Tabs
1. **Consent Capture Standards**
   - Checkbox language generator
   - Required disclosure elements
   - Timestamp/IP retention

2. **Opt-Out Workflow**
   - STOP keyword implementation
   - Cross-platform suppression
   - Processing timeline

3. **Internal DNC Policy**
   - Policy template
   - Training requirements
   - Logging procedures

4. **Vendor Governance**
   - Contract addendum template
   - Reps/warranties to require
   - Audit rights language
   - Lead provenance requirements

5. **Audit & Monitoring**
   - Quarterly review checklist
   - Sample testing procedures

---

## Page 8: California TCPA Overlay
**File:** `california-tcpa-overlay.html`

### Purpose
California-specific enhancements to federal TCPA

### Tabs
1. **California Laws**
   - Cal. Pub. Util. Code § 2872 et seq.
   - Cal. Bus. & Prof. Code § 17590 et seq.
   - California Consumer Privacy Act overlap

2. **Enhanced Remedies**
   - State AG enforcement
   - UCL claims
   - Additional damages

3. **Stricter Requirements**
   - Written consent for robocalls
   - Caller ID requirements

4. **Defense Strategies**
   - California-specific arguments

---

## Page 9: TCPA FAQ (15 Gotchas)
**File:** `tcpa-faq-gotchas.html`

### Purpose
Non-obvious, high-value questions that demonstrate specialist knowledge

### Questions (15)
1. "If we bought a 'compliant lead list,' are we still liable?"
2. "What if the person 'consented' but our vendor can't produce the original record?"
3. "Does a generic 'contact me' webform count as consent for marketing texts?"
4. "What if we stopped after the first complaint - does that reduce damages?"
5. "What if we kept texting after STOP because the suppression didn't sync?"
6. "Do repeated texts to the same number multiply damages?"
7. "How do plaintiffs turn one complaint into a class threat?"
8. "What records should we preserve from Twilio/CallFire/CRMs?"
9. "If a contractor/agency sent the texts, can the business still be on the hook?"
10. "What's the biggest 'willfulness' tripwire in real cases?"
11. "Can we safely reach out to the claimant to 'make it right'?"
12. "What if the number was reassigned and the user changed?"
13. "Should we run a DNC scrub retroactively - does that help or hurt?"
14. "What settlement terms prevent follow-on claims?"
15. "How do we fix our intake/consent language without admitting past wrongdoing?"

---

## TOOL 1: TCPA Exposure Calculator
**File:** `tcpa-exposure-calculator.html`

### Design Pattern
Match existing calculator patterns (deadline calculator, insurance checker in respond/index.html)

### Inputs
1. Channel: Text / Call / Both (select)
2. Content type: Marketing / Informational / Mixed (select)
3. Volume: Total number of messages/calls (number)
4. Avg touches per recipient (number)
5. Time window: Start date - End date (date pickers)
6. Consent evidence: Strong / Some / None / Unknown (select)
7. Opt-out present? Yes/No (toggle)
8. Any post-opt-out contacts? Yes/No/Unknown (select)
9. Vendor involved? None / Agency / Lead seller / Multiple (select)
10. Claim posture: Threat only / Demand letter / Counsel involved / Suit filed (select)

### Outputs
- **Risk Band:** Low / Medium / High / "Class Risk Flagged"
- **Exposure Range:** Statutory damage range (illustrative, not promise)
- **Top 5 Next Steps:** Actionable recommendations
- **"What to Preserve" Checklist:** Evidence preservation list
- **CTA:** "Generate First Response Letter" or "Book Consultation"

### Calculator Logic
```
Base per-violation: $500
Willfulness multiplier: 3x if post-opt-out or continued after notice
Class indicator: Volume > 100 + uniform process = flag
Risk bands:
  - Low: Strong consent + no opt-out issues + <50 contacts
  - Medium: Some consent issues OR opt-out gaps OR 50-500 contacts
  - High: No consent proof OR post-opt-out contacts OR >500 contacts
  - Class Risk: >500 contacts + uniform script/platform + lead list
```

---

## TOOL 2: TCPA Consent Language Generator
**File:** `tcpa-consent-generator.html`

### Design Pattern
Form-based generator (match existing generators)

### Inputs
1. Communication type: SMS only / Calls only / Both (select)
2. Purpose: Marketing / Account notifications / Both (select)
3. Company name (text)
4. Opt-out instructions (auto-generated based on type)
5. Privacy policy URL (optional text)
6. Frequency disclosure (select: daily/weekly/varies)

### Outputs
Generated consent disclosure text including:
- Express written consent language (for marketing)
- STOP/opt-out instructions
- Message frequency disclosure
- Carrier message/data rates notice
- Recommended checkbox placement
- Recordkeeping fields checklist (timestamp, IP, UTM, source URL)

---

## Consumer-Side Page
**File:** `/Demand-Letters/Consumer/tcpa-robocall-robotext-demand-letters.html`

### Purpose
Templates for consumers sending TCPA demands

### Tabs
1. **Common TCPA Violations**
   - Robocalls without consent
   - Robotexts without consent
   - Ignoring opt-out/STOP
   - DNC violations

2. **Legal Framework**
   - 47 U.S.C. § 227
   - FCC regulations
   - Damages ($500/$1,500)

3. **Evidence Collection**
   - Call logs
   - Screenshots of texts
   - Opt-out attempts
   - Carrier records

4. **Demand Letter Template**
   - Copy/paste template
   - Variables to customize

5. **Next Steps**
   - FCC complaint
   - State AG complaint
   - Small claims
   - Attorney options

### Cross-Link Box
```html
<div style="background: #e8f4f8; border-left: 4px solid #3498db; padding: 1rem 1.25rem; border-radius: 8px; margin: 1.5rem 0;">
    <strong>Received a TCPA Demand Letter?</strong>
    If you're a business that received a robocall/robotext demand, see my guide on
    <a href="/Demand-Letters/respond/telemarketing-tcpa/">How to Respond to TCPA Demands →</a>
</div>
```

---

## Navigation Updates

### 1. Update `/Demand-Letters/respond/index.html`
Add to quick-links-grid section (after "Animals & Pets Responses"):

```html
<a href="telemarketing-tcpa/" class="quick-link-card">
    <div class="quick-link-icon">📱</div>
    <div class="quick-link-content">
        <h4>TCPA / Robocall Responses</h4>
        <p>Robotext demands, DNC violations, consent disputes, vendor liability, pre-litigation settlement.</p>
    </div>
    <span class="quick-link-arrow">→</span>
</a>
```

### 2. Update `/Demand-Letters/Consumer/index.html`
Add to "Available Guides" section:

```html
<a href="tcpa-robocall-robotext-demand-letters.html" class="guide-item">
    <div class="guide-icon">📱</div>
    <div class="guide-content">
        <h3>TCPA Robocall & Robotext Demand Letters</h3>
        <p>Unwanted automated calls/texts, DNC violations, ignored opt-outs</p>
    </div>
    <span class="guide-arrow">→</span>
</a>
```

---

## Color Scheme

Use the respond hub's red color scheme for TCPA pages:
```css
:root {
    --primary: #dc2626;      /* Red */
    --primary-dark: #991b1b;
    --primary-light: #fef2f2;
}
```

For consumer-side page, use consumer hub's blue:
```css
:root {
    --primary: #2563eb;      /* Blue */
    --primary-dark: #1d4ed8;
}
```

---

## Implementation Order

### Phase 1: Foundation (Core Hub)
1. Create `/Demand-Letters/respond/telemarketing-tcpa/` directory
2. Build `index.html` (pillar page)
3. Build `tcpa-robocalls-robotexts-response.html` (main response guide)
4. Build `tcpa-exposure-calculator.html` (tool)

### Phase 2: Supporting Guides
5. Build `consent-evidence-checklist.html`
6. Build `dnc-optout-violations.html`
7. Build `settlement-terms-playbook.html`
8. Build `compliance-remediation.html`

### Phase 3: Advanced Content
9. Build `vendor-liability-indemnity.html`
10. Build `california-tcpa-overlay.html`
11. Build `tcpa-faq-gotchas.html`
12. Build `tcpa-consent-generator.html` (tool)

### Phase 4: Consumer Side + Integration
13. Build `/Demand-Letters/Consumer/tcpa-robocall-robotext-demand-letters.html`
14. Update `/Demand-Letters/respond/index.html` (add quick link)
15. Update `/Demand-Letters/Consumer/index.html` (add guide link)

---

## Template Reference

Use these existing pages as templates:
- **Pillar/Hub:** `/Demand-Letters/respond/consumer/index.html`
- **Tab-based guide:** `/Demand-Letters/Consumer/abusive-subscriptions-auto-renewals-demand-letters.html`
- **Calculator tool:** Insurance checker in `/Demand-Letters/respond/index.html`
- **Response hub:** `/Demand-Letters/respond/index.html`

---

## SEO Metadata

### Pillar Page
```html
<title>Respond to TCPA Demand Letters | Robocall & Robotext Defense | Terms.Law</title>
<meta name="description" content="Business received a TCPA demand? Step-by-step response strategy, exposure calculator, settlement playbook, and compliance fixes. California attorney-backed.">
<link rel="canonical" href="https://terms.law/Demand-Letters/respond/telemarketing-tcpa/">
```

### Response Guide
```html
<title>How to Respond to a TCPA Demand Letter | 48-Hour Triage | Terms.Law</title>
<meta name="description" content="First response strategy for TCPA robocall/robotext demands. Evidence preservation, exposure assessment, defense strategies, and response letter templates.">
```

### Calculator
```html
<title>TCPA Exposure Calculator | Statutory Damages Risk Assessment | Terms.Law</title>
<meta name="description" content="Calculate potential TCPA liability. Input call/text volume, consent status, and opt-out compliance to assess statutory damages exposure.">
```

---

## Estimated File Sizes

| Page | Estimated Size | Complexity |
|------|----------------|------------|
| Pillar (index.html) | 40-60 KB | High |
| Response Guide | 60-80 KB | High |
| Evidence Checklist | 40-50 KB | Medium |
| DNC/Opt-Out | 40-50 KB | Medium |
| Vendor Liability | 40-50 KB | Medium |
| Settlement Playbook | 50-60 KB | High |
| Compliance Remediation | 40-50 KB | Medium |
| California Overlay | 30-40 KB | Medium |
| FAQ Gotchas | 35-45 KB | Medium |
| Exposure Calculator | 50-70 KB | High (JS) |
| Consent Generator | 40-60 KB | Medium (JS) |
| Consumer Page | 50-70 KB | High |

---

## Summary

**Total Deliverables:**
- 1 Pillar hub page
- 8 Supporting guide pages
- 2 Interactive tools
- 1 Consumer-side page
- 2 Navigation updates

**Estimated Total:** ~12 HTML files, ~600 KB combined

This hub will position Terms.Law as a TCPA specialist resource and capture both:
- Businesses receiving TCPA demands (monetization via consultation)
- Consumers with TCPA complaints (traffic + cross-referrals)
