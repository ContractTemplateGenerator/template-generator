# SEO Content Addition - Continuation Instructions

## What We're Doing
Adding SEO content (5 h2 sections each) to undated URLs in demand letter generators and template generators to improve Google indexing.

## Progress So Far (Committed)

### Batch 1 - Initial Templates (7 files)
- Templates/sow-generator.html
- Templates/llc-amendment-generator.html
- Templates/ip-assignment-agreement-generator.html
- Demand-Letters/freelancer-nonpayment-letter.html
- Article-Widgets/ (noindex added to 3 widgets)

### Batch 2 - Demand Letters (10 files)
- Templates/llc-operating-agreement-generator.html
- Demand-Letters/medspa-botched-procedure-letter.html
- Demand-Letters/saas-nonpayment-letter.html
- stripe-demand-letter-generator/index.html
- Demand-Letters/Platforms/chargeback-abuse-demand-letters.html
- Demand-Letters/Platforms/crypto-exchange-freeze-demand-letters.html
- Demand-Letters/Platforms/saas-account-termination-demand-letters.html
- Demand-Letters/Home-Services-Construction/roofing-contractor-dispute-letters.html
- Demand-Letters/Home-Services-Construction/hvac-installation-repair-dispute-letters.html
- Demand-Letters/Home-Services-Construction/solar-panel-installation-dispute-letters.html

### Batch 3 - Home Services (3 files)
- Demand-Letters/Home-Services-Construction/pool-spa-contractor-dispute-letters.html
- Demand-Letters/Home-Services-Construction/landscaping-exterior-work-dispute-letters.html
- Demand-Letters/Home-Services-Construction/home-warranty-company-dispute-demand-letters.html

### Batch 4-6 - Landlord-Tenant (10 files)
- Demand-Letters/Landlord-Tenant/landlord-unpaid-rent-demand-before-eviction.html
- Demand-Letters/Landlord-Tenant/tenant-habitability-mold-repair-demand-letters.html
- Demand-Letters/Landlord-Tenant/tenant-illegal-lockout-self-help-eviction-demand-letters.html
- Demand-Letters/Landlord-Tenant/noise-odor-nuisance-demand-letters.html
- Demand-Letters/Landlord-Tenant/property-line-boundary-dispute-demand-letters.html
- Demand-Letters/Landlord-Tenant/easement-right-of-way-dispute-letters.html
- Demand-Letters/Landlord-Tenant/real-estate-agent-broker-dispute-letters.html
- Demand-Letters/Landlord-Tenant/tree-fence-property-damage-neighbor-disputes.html
- Demand-Letters/Landlord-Tenant/commercial-cam-operating-expense-reconciliation-dispute-letters.html
- Demand-Letters/Landlord-Tenant/commercial-landlord-service-failures-access-demand-letters.html

## Still Needs SEO Content

### Landlord-Tenant (4 remaining)
- commercial-tenant-lease-default-termination-demand-letters.html
- landlord-property-damage-lease-violation-demand-letters.html
- landlord-response-commercial-lease-default-cam-dispute.html
- landlord-response-tenant-habitability-repair-demand.html

### Influencer-Media (5 files)
- brand-influencer-contract-breach-demand-letters.html
- creator-subscription-platform-dispute-demand-letters.html
- podcast-youtube-ownership-dispute-demand-letters.html
- talent-representation-commission-dispute-demand-letters.html
- unauthorized-creator-content-reuse-demand-letters.html

### Government-Professional (10 files)
- accountant-tax-preparer-malpractice-demand-letters.html
- ai-policy-letters-congress-agencies.html
- attorney-malpractice-demand-letters.html
- california-government-claims-act-demand-letters.html
- dangerous-public-property-demand-letters.html
- licensing-board-complaint-leverage-demand-letters.html
- medical-malpractice-pre-litigation-demand-letters.html
- professional-malpractice-demand-letters.html
- regulatory-complaint-leverage-demand-letters.html
- state-government-claims-act-demand-letters.html

### Employment (check directory)
- Demand-Letters/Employment/

### Templates (~90+ files without SEO)
- Run: `for f in Templates/*-generator.html; do if ! grep -q "seo-content" "$f"; then basename "$f"; fi; done`

## How to Add SEO Content

1. Find `</body>` in the file
2. Insert before `</body>`:
```html
<!-- SEO Content Section -->
<section class="seo-content" style="max-width: 900px; margin: 60px auto; padding: 40px 24px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
  <h2 style="font-size: 1.75rem; color: #1e40af; margin-bottom: 16px;">[Topic] - What is it?</h2>
  <p style="font-size: 1rem; line-height: 1.7; color: #374151; margin-bottom: 24px;">[Explanation paragraph]</p>

  <h2 style="font-size: 1.75rem; color: #1e40af; margin-bottom: 16px;">Common Issues</h2>
  <ul style="font-size: 1rem; line-height: 1.8; color: #374151; margin-bottom: 24px; padding-left: 24px;">
    <li><strong>Issue 1</strong> — Description</li>
    <li><strong>Issue 2</strong> — Description</li>
  </ul>

  <h2 style="font-size: 1.75rem; color: #1e40af; margin-bottom: 16px;">Your Rights/Remedies</h2>
  <p style="font-size: 1rem; line-height: 1.7; color: #374151; margin-bottom: 24px;">[Explanation]</p>

  <h2 style="font-size: 1.75rem; color: #1e40af; margin-bottom: 16px;">What You Can Recover</h2>
  <ul style="font-size: 1rem; line-height: 1.8; color: #374151; margin-bottom: 24px; padding-left: 24px;">
    <li><strong>Recovery 1</strong> — Description</li>
  </ul>
</section>
```

3. Commit batches of 5-10 files at a time

## Command to Continue
```
Continue adding SEO content to demand letter generators. Start with the 4 remaining Landlord-Tenant files, then Influencer-Media, then Government-Professional. Priority is undated URLs (demand letters) over dated URLs (blog posts).
```
