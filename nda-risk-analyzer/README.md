# NDA Risk Analyzer - Professional Legal Tool

A sophisticated NDA risk analysis tool powered by AI and backed by California attorney expertise.

## Features

### 🛡️ Professional Risk Assessment
- **Overall Risk Score** (1-10 scale)
- **Fairness Analysis** (0-100% balance score)
- **Color-coded risk indicators** (Red/Yellow/Green)
- **Multi-dimensional scoring**: Enforceability, Business Impact, Litigation Risk, Compliance Burden

### ⚖️ Legal Expertise Integration
- **California-specific analysis** (B&P Code §16600, UTSA compliance)
- **Industry-specific red flags** (Tech, Healthcare, Finance, etc.)
- **Jurisdiction-aware recommendations**
- **Attorney-crafted analysis framework**

### 📊 Comprehensive Analysis
- **Clause-by-clause breakdown** with expandable details
- **Missing standard protections** identification
- **Negotiation priority ranking**
- **Business impact assessment**
- **Alternative language suggestions**

### 🎯 User Experience
- **Drag & drop file upload** (PDF, DOC, TXT)
- **Real-time analysis** with professional formatting
- **Mobile-responsive design**
- **Professional report generation**
- **One-click attorney consultation booking**

## Technology Stack

- **Frontend**: React 18, Vanilla CSS
- **AI Integration**: Grok API (with intelligent fallbacks)
- **File Processing**: PDF parsing, text extraction
- **Design**: Professional legal document styling
- **Responsive**: Mobile-first approach

## Setup Instructions

1. **Clone/Download** the nda-risk-analyzer folder
2. **Configure API**: Update `grok-api.js` with your Grok API credentials
3. **Deploy**: Upload to your web server or GitHub Pages
4. **Embed**: Use the provided iframe code in your WordPress blog

## API Configuration

Update `grok-api.js` with your credentials:

```javascript
const GROK_API_CONFIG = {
    endpoint: 'YOUR_GROK_API_ENDPOINT',
    apiKey: 'YOUR_GROK_API_KEY',
    model: 'grok-beta'
};
```

## Iframe Embed Code

```html
<iframe 
  src="https://template.terms.law/nda-risk-analyzer/" 
  title="NDA Risk Analyzer - Professional Legal Review Tool" 
  width="100%" 
  height="800"
  style="border: 1px solid #ccc; border-radius: 8px;">
</iframe>
```

## Professional Differentiators

### vs. Generic AI Tools:
- **Attorney-structured output** (legal memo format vs. chat responses)
- **Jurisdiction-specific intelligence** (automatic CA law application)
- **Risk quantification** (numerical scores vs. vague warnings)
- **Industry expertise** (tech startup considerations, etc.)
- **Professional presentation** (suitable for business stakeholder review)

### Upsell Integration:
- **High-risk score triggers** automatic attorney review recommendations
- **Professional formatting** builds trust in your legal expertise
- **Seamless Calendly integration** for consultation booking
- **Risk-based pricing** recommendations ($149 for full review)

## Target Audience

- **Tech startups** evaluating investor/partner NDAs
- **Small businesses** reviewing vendor agreements
- **Entrepreneurs** negotiating partnership deals
- **In-house counsel** seeking second opinions
- **International companies** entering US market

## Performance Features

- **Instant analysis** (< 3 seconds for most NDAs)
- **Comprehensive coverage** (all standard NDA clauses)
- **Professional reliability** (attorney-grade analysis)
- **Business context** (practical impact assessment)

## Legal Compliance

- Includes professional disclaimers
- Attorney credentials prominently displayed
- Clear distinction between AI analysis and legal advice
- Encourages professional consultation for complex matters

Built by California Attorney Sergei Tokmakov (CA Bar #279869) - 13+ years experience in business law and contract drafting.