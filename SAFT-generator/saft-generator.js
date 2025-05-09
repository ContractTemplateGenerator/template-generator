// saft-generator.js - Main React component for SAFT Generator

// Icon component for Feather Icons
function Icon({ name, size = 18, style = {} }) {
  return (
    <i data-feather={name} width={size} height={size} style={style}></i>
  );
}

// Info tooltip component
function InfoTooltip({ text }) {
  return (
    <span className="tooltip">
      <span className="info-icon">
        <Icon name="info" size={14} />
      </span>
      <span className="tooltip-text">{text}</span>
    </span>
  );
}

// Warning indicator component
function WarningIndicator({ text }) {
  return (
    <span className="warning-indicator">
      <Icon name="alert-triangle" size={12} style={{ marginRight: "0.25rem" }} />
      {text}
    </span>
  );
}

// Percentage input component
function PercentageInput({ name, value, onChange, min = 0, max = 100, step = 0.01, ...props }) {
  return (
    <div className="percentage-input">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        {...props}
      />
      <span className="percentage-sign">%</span>
    </div>
  );
}

// Regulatory information box component
function RegulatoryInfo({ title, children }) {
  return (
    <div className="regulatory-info">
      <h4>
        <Icon name="file-text" size={14} style={{ marginRight: "0.25rem" }} />
        {title}
      </h4>
      {children}
    </div>
  );
}

function SAFTGenerator() {
  // React hooks
  const [formData, setFormData] = React.useState({
    // Company Information
    companyName: "",
    companyType: "Corporation",
    companyJurisdiction: "Delaware",
    companyAddress: "",
    companySignatory: "",
    companySignatoryTitle: "",
    
    // Offering Details
    offeringAmount: "",
    purchasePrice: "",
    currency: "USD",
    closingDate: "",
    
    // Token Information
    tokenName: "",
    tokenSymbol: "",
    tokenSupply: "",
    tokenDistributionModel: "Fixed Supply",
    tokenReleaseSchedule: "All at Network Launch",
    tokenStandard: "ERC-20",
    
    // Investment Terms
    discountRate: "",
    valuationCap: "",
    interestRate: "",
    maturityDate: "",
    includeEarlyTerminationClauses: false,
    
    // Regulatory Compliance
    investorAccreditation: "Rule 506(c)",
    includeRegD: true,
    includeRegS: false,
    jurisdictionalRestrictions: "United States",
    
    // Closing Provisions
    governingLaw: "Delaware",
    disputeResolution: "Arbitration",
    confidentialityTerm: "Mutual",
    rightToCancel: false,
    cancellationPeriod: "14",
    noticeAddress: ""
  });
  
  // State for document text
  const [documentText, setDocumentText] = React.useState("");
  
  // State for current tab
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);
  
  // Tab configuration
  const tabs = [
    { id: 'company', label: 'Company Information' },
    { id: 'offering', label: 'Offering Details' },
    { id: 'token', label: 'Token Information' },
    { id: 'investment', label: 'Investment Terms' },
    { id: 'regulatory', label: 'Regulatory Compliance' },
    { id: 'closing', label: 'Closing Provisions' }
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Navigation functions
  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };
  
  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };
  
  const goToTab = (index) => {
    setCurrentTab(index);
  };
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText)
      .then(() => {
        alert("Document copied to clipboard!");
      })
      .catch(err => {
        console.error("Error copying to clipboard:", err);
        alert("Failed to copy to clipboard. Please try again.");
      });
  };
  
  // Download as Word function
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        companyName: formData.companyName,
        fileName: `${formData.companyName.replace(/\s+/g, '-')}-SAFT`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Schedule consultation
  const scheduleConsultation = () => {
    Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});
  };
  
  // Generate SAFT document text
  const generateSAFTText = () => {
    // Format date function
    const formatDate = (dateString) => {
      if (!dateString) return "";
      
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };
    
    // Currency formatter
    const formatCurrency = (amount, currency = "USD") => {
      if (!amount) return "";
      
      const currencySymbols = {
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "BTC": "₿",
        "ETH": "Ξ"
      };
      
      return `${currencySymbols[currency] || ""}${amount}`;
    };
    
    // Create document
    let text = `SIMPLE AGREEMENT FOR FUTURE TOKENS (SAFT)

THIS CERTIFIES THAT in exchange for the payment by the undersigned purchaser (the "Purchaser") of ${formatCurrency(formData.offeringAmount, formData.currency)} (the "Purchase Amount") on or about ${formatDate(formData.closingDate)} to ${formData.companyName}, a ${formData.companyType} organized under the laws of ${formData.companyJurisdiction} (the "Company"), the Company hereby issues to the Purchaser the right to certain units of ${formData.tokenName || "Tokens"} (the "${formData.tokenSymbol || "TOKEN"}"), subject to the terms set forth below.

1. EVENTS

(a) Network Launch. On the event of a Network Launch (as defined below), the Company will automatically issue to the Purchaser a number of units of the ${formData.tokenSymbol || "TOKEN"} equal to the Purchase Amount divided by the Discount Price (as defined below).

(b) Dissolution Event. If there is a Dissolution Event before the ${formData.tokenSymbol || "TOKEN"} is issued by the Company to the Purchaser pursuant to Section 1(a), the Company will pay an amount equal to the Purchase Amount multiplied by the Dissolution Multiplier (as defined below), immediately prior to, or concurrent with, the consummation of the Dissolution Event.

2. DEFINITIONS

"Discount Price" means the price per token sold in the Network Launch, reduced by ${formData.discountRate ? formData.discountRate + "%" : "[DISCOUNT RATE]"}.

"Dissolution Event" means (i) a voluntary termination of operations of the Company, (ii) a general assignment for the benefit of the Company's creditors, (iii) a failure by the Company to pay debts as they become due, or (iv) the commencement of any bankruptcy or insolvency proceeding under any applicable law.

"Dissolution Multiplier" means 1.0 plus any applicable interest rate accrued at ${formData.interestRate || "0"}% per annum.

"Network Launch" means a bona fide transaction or series of transactions, pursuant to which the Company will sell the ${formData.tokenSymbol || "TOKEN"} to the general public in a publicized product launch.

"${formData.tokenSymbol || "TOKEN"}" means a ${formData.tokenStandard || "blockchain-based"} token to be issued by the Company, with the characteristics as described in Exhibit A.

3. COMPANY REPRESENTATIONS

(a) The Company is a ${formData.companyType} duly organized, validly existing and in good standing under the laws of ${formData.companyJurisdiction}, and has the power and authority to own, lease and operate its properties and carry on its business as now conducted.

(b) The execution, delivery and performance by the Company of this SAFT is, to the Company's knowledge, within the power of the Company and has been duly authorized by all necessary actions on the part of the Company. This SAFT constitutes a legal, valid and binding obligation of the Company, enforceable against the Company in accordance with its terms, except as limited by bankruptcy, insolvency or other laws of general application relating to or affecting the enforcement of creditors' rights generally and general principles of equity.

4. TOKEN DISTRIBUTION AND RIGHTS

Subject to the terms and conditions of this SAFT, the Company shall distribute ${formData.tokenSymbol || "TOKEN"} in accordance with the following terms:

(a) Total Supply: ${formData.tokenSupply || "[TOKEN SUPPLY]"}

(b) Distribution Model: ${formData.tokenDistributionModel || "Fixed Supply"}

(c) Release Schedule: ${formData.tokenReleaseSchedule || "All at Network Launch"}

(d) Token Standard: ${formData.tokenStandard || "ERC-20"}

5. PURCHASER REPRESENTATIONS

The Purchaser represents to the Company the following:

(a) The Purchaser has full legal capacity, power and authority to execute and deliver this SAFT and to perform its obligations hereunder.

(b) The Purchaser is an accredited investor as defined in Rule 501(a) of Regulation D under the Securities Act${formData.investorAccreditation === "Rule 506(c)" ? ", and can provide documentation to verify this status as required under Rule 506(c)" : ""}.

(c) The Purchaser has been advised that this SAFT is a security and that the offers and sales of this SAFT have not been registered under any country's securities laws and, therefore, cannot be resold except in compliance with the applicable country's laws.

(d) The Purchaser is purchasing this SAFT for its own account, not as a nominee or agent, and not with a view to, or for resale in connection with, the distribution thereof, and the Purchaser has no present intention of selling, granting any participation in, or otherwise distributing the same.

(e) The Purchaser has such knowledge and experience in financial and business matters that the Purchaser is capable of evaluating the merits and risks of such investment, is able to incur a complete loss of such investment without impairing the Purchaser's financial condition, and is able to bear the economic risk of such investment for an indefinite period of time.

6. REGULATORY COMPLIANCE

(a) Compliance with Securities Laws: The Purchaser acknowledges and agrees that this SAFT is being offered and sold in compliance with Rule ${formData.includeRegD ? "506(c) of Regulation D" : "Regulation S"} under the Securities Act of 1933, as amended.

${formData.includeRegS ? 
`(b) Regulation S Compliance: The Purchaser is not a "U.S. person" as defined in Regulation S under the Securities Act and is not acquiring the SAFT for the account or benefit of any U.S. person.` : 
""}

(c) Jurisdictional Restrictions: The offer and sale of this SAFT is intended to be exempt from registration under the securities laws of ${formData.jurisdictionalRestrictions || "[JURISDICTIONS]"}.

7. TRANSFER RESTRICTIONS

(a) The Purchaser understands and acknowledges that this SAFT and any ${formData.tokenSymbol || "TOKEN"} distributed under this agreement are subject to transfer restrictions under applicable securities laws.

(b) The Purchaser may not, without the prior written consent of the Company, assign, transfer, pledge, hypothecate or otherwise dispose of any of their rights, duties, or obligations under this Agreement.

8. GOVERNING LAW AND VENUE

(a) This SAFT shall be governed in all respects by the laws of ${formData.governingLaw || "Delaware"}, without regard to conflict of law principles.

(b) Any dispute, claim or controversy arising out of or relating to this SAFT or the breach, termination, enforcement, interpretation or validity thereof shall be settled by ${formData.disputeResolution === "Arbitration" ? "binding arbitration" : "the courts located in " + formData.governingLaw}.

9. MISCELLANEOUS

(a) Notice. Any notice required under this SAFT shall be given in writing and shall be deemed effectively given upon personal delivery or upon deposit with the United States Postal Service, by registered or certified mail, postage prepaid, addressed to the party to be notified at the address indicated for such party above, or at such other address as such party may designate.

${formData.rightToCancel ? 
`(b) Right to Cancel. The Purchaser may cancel this SAFT for any reason until midnight of the ${formData.cancellationPeriod || "14"}th business day after the day on which the Purchaser executes this SAFT. To cancel this SAFT, the Purchaser must deliver a signed and dated notice of cancellation by hand or by certified mail to the Company at its address listed above.` : 
""}

(c) Entire Agreement. This SAFT constitutes the entire agreement between the parties hereto with respect to the subject matter hereof and supersedes all prior agreements and understandings, both written and oral, among the parties with respect to the subject matter hereof.

(d) Amendments. Any provision of this SAFT may be amended, waived or modified only upon the written consent of the Company and the Purchaser.

(e) No Waivers. The failure by either party to enforce any term or provision of this SAFT shall not constitute a waiver of that party's right to enforce such term or provision of this SAFT at any time in the future.

IN WITNESS WHEREOF, the undersigned have caused this SAFT to be duly executed and delivered as of the date set forth below.

COMPANY:
${formData.companyName || "[COMPANY NAME]"}

By: _______________________________
Name: ${formData.companySignatory || "[SIGNATORY NAME]"}
Title: ${formData.companySignatoryTitle || "[SIGNATORY TITLE]"}
Date: ${formatDate(formData.closingDate) || "[DATE]"}


PURCHASER:
[PURCHASER ENTITY NAME]

By: _______________________________
Name: [PURCHASER SIGNATORY]
Title: [PURCHASER TITLE]
Date: ${formatDate(formData.closingDate) || "[DATE]"}


EXHIBIT A
DESCRIPTION OF TOKEN FUNCTIONALITY

Token Name: ${formData.tokenName || "[TOKEN NAME]"}
Token Symbol: ${formData.tokenSymbol || "[TOKEN SYMBOL]"}
Token Standard: ${formData.tokenStandard || "ERC-20"}
Total Supply: ${formData.tokenSupply || "[TOKEN SUPPLY]"}

FUNCTIONAL PURPOSE:
[Description of the token's utility and functionality within the network]

TECHNICAL SPECIFICATIONS:
- Blockchain: [Blockchain Platform]
- Consensus Mechanism: [Proof of Stake/Work/Authority/etc.]
- Smart Contract Address: [To be provided upon Network Launch]

TOKEN ECONOMICS:
- Distribution Model: ${formData.tokenDistributionModel || "Fixed Supply"}
- Release Schedule: ${formData.tokenReleaseSchedule || "All at Network Launch"}
${formData.valuationCap ? `- Valuation Cap: ${formatCurrency(formData.valuationCap, formData.currency)}` : ""}
${formData.discountRate ? `- Discount Rate: ${formData.discountRate}%` : ""}
${formData.interestRate ? `- Interest Rate: ${formData.interestRate}%` : ""}
${formData.maturityDate ? `- Maturity Date: ${formatDate(formData.maturityDate)}` : ""}

ADDITIONAL TERMS:
[Additional terms specific to the token distribution and functionality]
`;

    return text;
  };
  
  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    // Company Information fields
    if (['companyName', 'companyType', 'companyJurisdiction', 'companyAddress', 'companySignatory', 'companySignatoryTitle'].includes(lastChanged)) {
      return 'company';
    }
    
    // Offering Details fields
    if (['offeringAmount', 'purchasePrice', 'currency', 'closingDate'].includes(lastChanged)) {
      return 'offering';
    }
    
    // Token Information fields
    if (['tokenName', 'tokenSymbol', 'tokenSupply', 'tokenDistributionModel', 'tokenReleaseSchedule', 'tokenStandard'].includes(lastChanged)) {
      return 'token';
    }
    
    // Investment Terms fields
    if (['discountRate', 'valuationCap', 'interestRate', 'maturityDate', 'includeEarlyTerminationClauses'].includes(lastChanged)) {
      return 'investment';
    }
    
    // Regulatory Compliance fields
    if (['investorAccreditation', 'includeRegD', 'includeRegS', 'jurisdictionalRestrictions'].includes(lastChanged)) {
      return 'regulatory';
    }
    
    // Closing Provisions fields
    if (['governingLaw', 'disputeResolution', 'confidentialityTerm', 'rightToCancel', 'cancellationPeriod', 'noticeAddress'].includes(lastChanged)) {
      return 'closing';
    }
    
    return null;
  };
  
  // Function to find text to highlight based on last changed field
  const getTextToHighlight = () => {
    let pattern = null;
    let simple = false;
    
    switch (lastChanged) {
      case 'companyName':
        pattern = new RegExp(formData.companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        simple = true;
        break;
      case 'companyType':
        pattern = new RegExp(`a ${formData.companyType} organized under`, 'g');
        break;
      case 'companyJurisdiction':
        pattern = new RegExp(`laws of ${formData.companyJurisdiction}`, 'g');
        break;
      case 'companySignatory':
        pattern = new RegExp(`Name: ${formData.companySignatory}`, 'g');
        break;
      case 'companySignatoryTitle':
        pattern = new RegExp(`Title: ${formData.companySignatoryTitle}`, 'g');
        break;
      case 'offeringAmount':
        pattern = new RegExp(`the payment by the undersigned purchaser \\(the "Purchaser"\\) of [^(]+ \\(the "Purchase Amount"\\)`, 'g');
        break;
      case 'currency':
        // This is more complex as it affects multiple parts
        pattern = new RegExp(`\\$|€|£|₿|Ξ${formData.offeringAmount.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        break;
      case 'closingDate':
        if (formData.closingDate) {
          const date = new Date(formData.closingDate);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);
          pattern = new RegExp(formattedDate, 'g');
        }
        break;
      case 'tokenName':
        pattern = new RegExp(`units of ${formData.tokenName}`, 'g');
        break;
      case 'tokenSymbol':
        pattern = new RegExp(`\\(the "${formData.tokenSymbol}"\\)`, 'g');
        break;
      case 'tokenSupply':
        pattern = new RegExp(`Total Supply: ${formData.tokenSupply}`, 'g');
        break;
      case 'tokenDistributionModel':
        pattern = new RegExp(`Distribution Model: ${formData.tokenDistributionModel}`, 'g');
        break;
      case 'tokenReleaseSchedule':
        pattern = new RegExp(`Release Schedule: ${formData.tokenReleaseSchedule}`, 'g');
        break;
      case 'tokenStandard':
        pattern = new RegExp(`Token Standard: ${formData.tokenStandard}`, 'g');
        break;
      case 'discountRate':
        pattern = new RegExp(`reduced by ${formData.discountRate}%`, 'g');
        break;
      case 'valuationCap':
        if (formData.valuationCap) {
          pattern = new RegExp(`Valuation Cap: [^\\n]+${formData.valuationCap}`, 'g');
        }
        break;
      case 'interestRate':
        pattern = new RegExp(`accrued at ${formData.interestRate}% per annum`, 'g');
        break;
      case 'maturityDate':
        if (formData.maturityDate) {
          const date = new Date(formData.maturityDate);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);
          pattern = new RegExp(`Maturity Date: ${formattedDate}`, 'g');
        }
        break;
      case 'investorAccreditation':
        pattern = new RegExp(`accredited investor as defined in Rule 501\\(a\\) of Regulation D under the Securities Act${formData.investorAccreditation === "Rule 506(c)" ? ", and can provide documentation to verify this status as required under Rule 506\\(c\\)" : ""}`, 'g');
        break;
      case 'includeRegD':
      case 'includeRegS':
        pattern = new RegExp(`compliance with Rule ${formData.includeRegD ? "506\\(c\\) of Regulation D" : "Regulation S"} under the Securities Act`, 'g');
        break;
      case 'jurisdictionalRestrictions':
        pattern = new RegExp(`securities laws of ${formData.jurisdictionalRestrictions}`, 'g');
        break;
      case 'governingLaw':
        pattern = new RegExp(`governed in all respects by the laws of ${formData.governingLaw}`, 'g');
        break;
      case 'disputeResolution':
        pattern = new RegExp(`shall be settled by ${formData.disputeResolution === "Arbitration" ? "binding arbitration" : "the courts located in " + formData.governingLaw}`, 'g');
        break;
      case 'rightToCancel':
      case 'cancellationPeriod':
        if (formData.rightToCancel) {
          pattern = new RegExp(`\\(b\\) Right to Cancel\\. The Purchaser may cancel this SAFT for any reason until midnight of the ${formData.cancellationPeriod || "14"}th business day`, 'g');
        }
        break;
      default:
        return null;
    }
    
    return { pattern, simple };
  };
  
  // Function to create highlighted version of the text
  const createHighlightedText = () => {
    if (!lastChanged) return documentText;
    
    const highlightInfo = getTextToHighlight();
    if (!highlightInfo) return documentText;
    
    const { pattern, simple } = highlightInfo;
    
    if (simple && formData[lastChanged]) {
      return documentText.replace(pattern, match => 
        `<span class="highlighted-text">${match}</span>`
      );
    } else if (pattern) {
      return documentText.replace(pattern, match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };
  
  // Generate document text when form data changes
  React.useEffect(() => {
    const text = generateSAFTText();
    setDocumentText(text);
  }, [formData]);
  
  // Create highlightable content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current && lastChanged) {
      setTimeout(() => {
        const highlightedElement = previewRef.current.querySelector('.highlighted-text');
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }, [highlightedText]);
  
  // Reset feather icons when tabs change
  React.useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [currentTab]);
  
  return (
    <div className="saft-generator">
      <div className="generator-header">
        <h1>SAFT (Simple Agreement for Future Tokens) Generator</h1>
        <p>Create a customized SAFT agreement for token pre-sales compliant with securities regulations.</p>
      </div>
      
      {/* Tab navigation */}
      <div className="tab-navigation">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`tab-button ${currentTab === index ? 'active' : ''}`}
            onClick={() => goToTab(index)}
          >
            {index + 1}. {tab.label}
          </button>
        ))}
      </div>
      
      {/* Generator content */}
      <div className="generator-content">
        {/* Form panel */}
        <div className="form-panel">
          {/* Company Information Tab */}
          {currentTab === 0 && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Company Information</h3>
                
                <div className="form-group">
                  <label htmlFor="companyName">
                    Company Name
                    <InfoTooltip text="The legal name of the company issuing the SAFT" />
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Example: Blockchain Technologies Inc."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="companyType">
                    Company Type
                    <InfoTooltip text="The legal structure of the company" />
                  </label>
                  <select
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                  >
                    <option value="Corporation">Corporation</option>
                    <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                    <option value="Foundation">Foundation</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="companyJurisdiction">
                    Jurisdiction of Incorporation
                    <InfoTooltip text="The state or country where the company is legally registered" />
                  </label>
                  <select
                    id="companyJurisdiction"
                    name="companyJurisdiction"
                    value={formData.companyJurisdiction}
                    onChange={handleChange}
                  >
                    <option value="Delaware">Delaware</option>
                    <option value="Wyoming">Wyoming</option>
                    <option value="Cayman Islands">Cayman Islands</option>
                    <option value="British Virgin Islands">British Virgin Islands</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="companyAddress">
                    Company Address
                    <InfoTooltip text="The official registered address of the company" />
                  </label>
                  <textarea
                    id="companyAddress"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Example: 123 Blockchain Avenue, Suite 101, Crypto City, DE 19901"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="companySignatory">
                    Company Signatory Name
                    <InfoTooltip text="The name of the person signing on behalf of the company" />
                  </label>
                  <input
                    type="text"
                    id="companySignatory"
                    name="companySignatory"
                    value={formData.companySignatory}
                    onChange={handleChange}
                    placeholder="Example: John Smith"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="companySignatoryTitle">
                    Signatory Title
                    <InfoTooltip text="The position or title of the person signing" />
                  </label>
                  <input
                    type="text"
                    id="companySignatoryTitle"
                    name="companySignatoryTitle"
                    value={formData.companySignatoryTitle}
                    onChange={handleChange}
                    placeholder="Example: Chief Executive Officer"
                  />
                </div>
              </div>
              
              <RegulatoryInfo title="Entity Formation Considerations">
                <p>The jurisdiction of incorporation can significantly impact your token issuance. Delaware and Wyoming offer favorable corporate laws for blockchain companies, while offshore jurisdictions like the Cayman Islands may provide regulatory flexibility but require additional compliance measures.</p>
              </RegulatoryInfo>
            </div>
          )}
          
          {/* Offering Details Tab */}
          {currentTab === 1 && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Offering Details</h3>
                
                <div className="form-group">
                  <label htmlFor="offeringAmount">
                    Total Offering Amount
                    <InfoTooltip text="The total amount of funds to be raised through this SAFT" />
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="offeringAmount"
                      name="offeringAmount"
                      value={formData.offeringAmount}
                      onChange={handleChange}
                      placeholder="Example: 1,000,000"
                    />
                    <div className="input-group-append">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="purchasePrice">
                    Purchase Price Per Token
                    <InfoTooltip text="The price at which tokens will be sold during the Network Launch" />
                    {formData.purchasePrice > 0 && formData.purchasePrice < 0.01 && 
                      <WarningIndicator text="Low Price" />
                    }
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="purchasePrice"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      placeholder="Example: 0.10"
                    />
                    <div className="input-group-append">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="closingDate">
                    Closing Date
                    <InfoTooltip text="The date when the SAFT agreement will be finalized" />
                  </label>
                  <input
                    type="date"
                    id="closingDate"
                    name="closingDate"
                    value={formData.closingDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <RegulatoryInfo title="Offering Regulations">
                <p>Securities laws may limit your offering amount or require specific disclosures depending on your jurisdiction. Most SAFTs are structured as private placements under Rule 506(c) of Regulation D in the US, which requires verification of accredited investor status but allows unlimited funding.</p>
              </RegulatoryInfo>
            </div>
          )}
          
          {/* Token Information Tab */}
          {currentTab === 2 && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Token Information</h3>
                
                <div className="form-group">
                  <label htmlFor="tokenName">
                    Token Name
                    <InfoTooltip text="The full name of your token (e.g., Bitcoin)" />
                  </label>
                  <input
                    type="text"
                    id="tokenName"
                    name="tokenName"
                    value={formData.tokenName}
                    onChange={handleChange}
                    placeholder="Example: Utility Token"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tokenSymbol">
                    Token Symbol
                    <InfoTooltip text="The ticker symbol for your token (e.g., BTC)" />
                  </label>
                  <input
                    type="text"
                    id="tokenSymbol"
                    name="tokenSymbol"
                    value={formData.tokenSymbol}
                    onChange={handleChange}
                    placeholder="Example: UTK"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tokenSupply">
                    Token Supply
                    <InfoTooltip text="The total number of tokens that will ever exist" />
                  </label>
                  <input
                    type="text"
                    id="tokenSupply"
                    name="tokenSupply"
                    value={formData.tokenSupply}
                    onChange={handleChange}
                    placeholder="Example: 100,000,000"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tokenDistributionModel">
                    Token Distribution Model
                    <InfoTooltip text="How tokens will be distributed and whether new tokens can be created" />
                  </label>
                  <select
                    id="tokenDistributionModel"
                    name="tokenDistributionModel"
                    value={formData.tokenDistributionModel}
                    onChange={handleChange}
                  >
                    <option value="Fixed Supply">Fixed Supply</option>
                    <option value="Inflation Model">Inflation Model</option>
                    <option value="Deflationary Model">Deflationary Model</option>
                    <option value="Dynamic Supply">Dynamic Supply</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="tokenReleaseSchedule">
                    Token Release Schedule
                    <InfoTooltip text="How tokens will be released to investors over time" />
                  </label>
                  <select
                    id="tokenReleaseSchedule"
                    name="tokenReleaseSchedule"
                    value={formData.tokenReleaseSchedule}
                    onChange={handleChange}
                  >
                    <option value="All at Network Launch">All at Network Launch</option>
                    <option value="1-Year Linear Vesting">1-Year Linear Vesting</option>
                    <option value="2-Year Linear Vesting">2-Year Linear Vesting</option>
                    <option value="Cliff and Vesting">6-Month Cliff, 18-Month Vesting</option>
                    <option value="Milestone-Based">Milestone-Based Release</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="tokenStandard">
                    Token Standard
                    <InfoTooltip text="The technical standard that your token will follow" />
                  </label>
                  <select
                    id="tokenStandard"
                    name="tokenStandard"
                    value={formData.tokenStandard}
                    onChange={handleChange}
                  >
                    <option value="ERC-20">ERC-20 (Ethereum)</option>
                    <option value="ERC-721">ERC-721 (Ethereum NFT)</option>
                    <option value="ERC-1155">ERC-1155 (Ethereum Multi-Token)</option>
                    <option value="BEP-20">BEP-20 (Binance Smart Chain)</option>
                    <option value="Solana SPL">Solana SPL</option>
                    <option value="Custom">Custom Standard</option>
                  </select>
                </div>
              </div>
              
              <RegulatoryInfo title="Token Classification Considerations">
                <p>The functionality and utility of your token are crucial for regulatory classification. Securities regulators like the SEC apply the Howey Test to determine if tokens are securities. To reduce risk, ensure your token has genuine utility within a functioning network and avoid marketing it primarily as an investment opportunity.</p>
              </RegulatoryInfo>
            </div>
          )}
          
          {/* Investment Terms Tab */}
          {currentTab === 3 && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Investment Terms</h3>
                
                <div className="form-group">
                  <label htmlFor="discountRate">
                    Discount Rate (%)
                    <InfoTooltip text="The percentage discount on token price offered to SAFT investors compared to the Network Launch price" />
                  </label>
                  <PercentageInput
                    id="discountRate"
                    name="discountRate"
                    value={formData.discountRate}
                    onChange={handleChange}
                    placeholder="Example: 30"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="valuationCap">
                    Valuation Cap
                    <InfoTooltip text="The maximum company valuation at which the investment converts to tokens" />
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="valuationCap"
                      name="valuationCap"
                      value={formData.valuationCap}
                      onChange={handleChange}
                      placeholder="Example: 10,000,000"
                    />
                    <div className="input-group-append">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="interestRate">
                    Interest Rate (%)
                    <InfoTooltip text="Annual interest rate applied to the investment if applicable" />
                  </label>
                  <PercentageInput
                    id="interestRate"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    placeholder="Example: 5"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="maturityDate">
                    Maturity Date
                    <InfoTooltip text="The date when the SAFT must convert to tokens or be repaid" />
                  </label>
                  <input
                    type="date"
                    id="maturityDate"
                    name="maturityDate"
                    value={formData.maturityDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="includeEarlyTerminationClauses"
                    name="includeEarlyTerminationClauses"
                    checked={formData.includeEarlyTerminationClauses}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeEarlyTerminationClauses">
                    Include Early Termination Clauses
                    <InfoTooltip text="Allows the SAFT to be terminated before the Network Launch under certain conditions" />
                  </label>
                </div>
              </div>
              
              <RegulatoryInfo title="Investment Term Considerations">
                <p>The discount rate and valuation cap are key terms that determine the economics of your SAFT. Most SAFTs include a discount rate of 20-40% to reward early investors for their risk. Higher discounts may attract investors but can dilute your token economics. Setting a maturity date (typically 1-2 years) provides investors with reassurance of a timeline for network development.</p>
              </RegulatoryInfo>
            </div>
          )}
          
          {/* Regulatory Compliance Tab */}
          {currentTab === 4 && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Regulatory Compliance</h3>
                
                <div className="form-group">
                  <label htmlFor="investorAccreditation">
                    Investor Accreditation Requirement
                    <InfoTooltip text="The accreditation standard that investors must meet" />
                  </label>
                  <select
                    id="investorAccreditation"
                    name="investorAccreditation"
                    value={formData.investorAccreditation}
                    onChange={handleChange}
                  >
                    <option value="Rule 506(c)">Rule 506(c) - Verified Accredited Investors Only</option>
                    <option value="Rule 506(b)">Rule 506(b) - Some Non-Accredited Allowed</option>
                    <option value="Foreign Exemption">Foreign Exemption</option>
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="includeRegD"
                    name="includeRegD"
                    checked={formData.includeRegD}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeRegD">
                    Include Regulation D Compliance Language
                    <InfoTooltip text="Include language for US securities compliance" />
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="includeRegS"
                    name="includeRegS"
                    checked={formData.includeRegS}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeRegS">
                    Include Regulation S Compliance Language
                    <InfoTooltip text="Include language for non-US investors" />
                    {formData.includeRegD && formData.includeRegS && 
                      <WarningIndicator text="Conflicting Regulations" />
                    }
                  </label>
                </div>
                
                <div className="form-group">
                  <label htmlFor="jurisdictionalRestrictions">
                    Jurisdictional Restrictions
                    <InfoTooltip text="Countries or regions where the SAFT is being offered" />
                  </label>
                  <select
                    id="jurisdictionalRestrictions"
                    name="jurisdictionalRestrictions"
                    value={formData.jurisdictionalRestrictions}
                    onChange={handleChange}
                  >
                    <option value="United States">United States Only</option>
                    <option value="United States and Canada">United States and Canada</option>
                    <option value="European Union">European Union</option>
                    <option value="Exclude United States">Non-US Jurisdictions Only</option>
                    <option value="Global">Global (with restrictions)</option>
                  </select>
                </div>
              </div>
              
              <RegulatoryInfo title="Securities Law Compliance">
                <p>In the US, most SAFTs are offered under Rule 506(c) of Regulation D, which allows general solicitation but requires all investors to be verified as accredited. Rule 506(b) allows up to 35 non-accredited investors but prohibits general solicitation. Regulation S offers a safe harbor for offerings exclusively to non-US persons.</p>
                <p>Be aware that some jurisdictions like China and South Korea have strict regulations or outright bans on token sales. Always consult with legal counsel familiar with each jurisdiction's requirements.</p>
              </RegulatoryInfo>
            </div>
          )}
          
          {/* Closing Provisions Tab */}
          {currentTab === 5 && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Closing Provisions</h3>
                
                <div className="form-group">
                  <label htmlFor="governingLaw">
                    Governing Law
                    <InfoTooltip text="The jurisdiction whose laws govern this agreement" />
                  </label>
                  <select
                    id="governingLaw"
                    name="governingLaw"
                    value={formData.governingLaw}
                    onChange={handleChange}
                  >
                    <option value="Delaware">Delaware</option>
                    <option value="New York">New York</option>
                    <option value="California">California</option>
                    <option value="Wyoming">Wyoming</option>
                    <option value="England and Wales">England and Wales</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Switzerland">Switzerland</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="disputeResolution">
                    Dispute Resolution
                    <InfoTooltip text="The method for resolving disputes related to this agreement" />
                  </label>
                  <select
                    id="disputeResolution"
                    name="disputeResolution"
                    value={formData.disputeResolution}
                    onChange={handleChange}
                  >
                    <option value="Arbitration">Arbitration</option>
                    <option value="Litigation">Litigation</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confidentialityTerm">
                    Confidentiality Term
                    <InfoTooltip text="The scope of confidentiality obligations" />
                  </label>
                  <select
                    id="confidentialityTerm"
                    name="confidentialityTerm"
                    value={formData.confidentialityTerm}
                    onChange={handleChange}
                  >
                    <option value="Mutual">Mutual Confidentiality</option>
                    <option value="Company Only">Company Confidentiality Only</option>
                    <option value="Purchaser Only">Purchaser Confidentiality Only</option>
                    <option value="None">No Confidentiality Clause</option>
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="rightToCancel"
                    name="rightToCancel"
                    checked={formData.rightToCancel}
                    onChange={handleChange}
                  />
                  <label htmlFor="rightToCancel">
                    Include Right to Cancel
                    <InfoTooltip text="Gives purchaser the right to cancel the agreement within a specified period" />
                  </label>
                </div>
                
                {formData.rightToCancel && (
                  <div className="form-group">
                    <label htmlFor="cancellationPeriod">
                      Cancellation Period (Days)
                      <InfoTooltip text="Number of business days the purchaser has to cancel the agreement" />
                    </label>
                    <input
                      type="number"
                      id="cancellationPeriod"
                      name="cancellationPeriod"
                      value={formData.cancellationPeriod}
                      onChange={handleChange}
                      min="1"
                      max="30"
                      placeholder="Example: 14"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="noticeAddress">
                    Notice Address
                    <InfoTooltip text="Address for sending legal notices related to this agreement" />
                  </label>
                  <textarea
                    id="noticeAddress"
                    name="noticeAddress"
                    value={formData.noticeAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Example: 123 Blockchain Avenue, Suite 101, Crypto City, DE 19901"
                  ></textarea>
                </div>
              </div>
              
              <RegulatoryInfo title="Closing Considerations">
                <p>Arbitration is often preferred for dispute resolution in blockchain agreements as it provides more privacy and flexibility than litigation. Delaware law is commonly used for US-based offerings due to its well-established business law precedents. Including a right to cancel can give purchasers confidence but may complicate your fundraising process.</p>
              </RegulatoryInfo>
            </div>
          )}
        </div>
        
        {/* Preview panel */}
        <div className="preview-panel">
          <div className="preview-header">
            <h2>Preview</h2>
          </div>
          <div className="preview-content" ref={previewRef}>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
          disabled={currentTab === 0}
        >
          <Icon name="chevron-left" style={{marginRight: "0.25rem"}} />
          Previous
        </button>
        
        {/* Copy to clipboard button */}
        <button
          onClick={copyToClipboard}
          className="nav-button"
          style={{
            backgroundColor: "#4f46e5", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="copy" style={{marginRight: "0.25rem"}} />
          Copy to Clipboard
        </button>
        
        {/* Download MS Word button */}
        <button
          onClick={downloadAsWord}
          className="nav-button"
          style={{
            backgroundColor: "#2563eb", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="file-text" style={{marginRight: "0.25rem"}} />
          Download MS Word
        </button>
        
        {/* Schedule consultation button */}
        <button
          onClick={scheduleConsultation}
          className="nav-button"
          style={{
            backgroundColor: "#10b981", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="calendar" style={{marginRight: "0.25rem"}} />
          Schedule Consultation
        </button>
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <Icon name="chevron-right" style={{marginLeft: "0.25rem"}} />
        </button>
      </div>
    </div>
  );
}

// Render the SAFT Generator
ReactDOM.render(
  <SAFTGenerator />,
  document.getElementById('root')
);