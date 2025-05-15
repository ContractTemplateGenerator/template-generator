// Icon component for using Feather icons
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props} className={`icon ${props.className || ''}`}></i>
  );
};

// Main application component
const App = () => {
  // State for form data
  const [formData, setFormData] = React.useState({
    // Company Information
    companyName: "",
    companyType: "Delaware C-Corporation",
    companyAddress: "",
    contactPerson: "",
    contactEmail: "",
    
    // Offering Details
    offeringTitle: "",
    targetAmount: "",
    minimumAmount: "",
    maximumAmount: "",
    minimumInvestment: "",
    maximumInvestment: "",
    offeringDeadline: "",
    
    // Security Type
    securityType: "SAFE",
    equityPercentage: "",
    conversionTerms: "",
    
    // Valuation & Terms
    preMoney: "",
    postMoney: "",
    valuationCap: "",
    discountRate: "",
    interestRate: "",
    maturityDate: "",
    
    // Investor Rights
    votingRights: "No",
    proRataRights: "No",
    informationRights: "Yes",
    dragAlongRights: "Yes",
    
    // Use of Funds
    productDevelopment: "",
    marketing: "",
    operations: "",
    team: "",
    otherUse: "",
    
    // Professional Advisors
    legalCounsel: "",
    accountant: "",
    platform: "Wefunder",
    
    // Document Settings
    fileName: "Equity-Crowdfunding-Terms-Sheet"
  });
  
  // Ref for preview content div
  const previewRef = React.useRef(null);
  
  // State for current tab
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Define tabs
  const tabs = [
    { id: 'company', label: 'Company Information' },
    { id: 'offering', label: 'Offering Details' },
    { id: 'security', label: 'Security Type & Terms' },
    { id: 'investor', label: 'Investor Rights' },
    { id: 'funds', label: 'Use of Funds' },
    { id: 'review', label: 'Review & Finalize' }
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
  
  // Generate document text based on form data
  const generateDocumentText = () => {
    const {
      companyName, companyType, companyAddress, contactPerson, contactEmail,
      offeringTitle, targetAmount, minimumAmount, maximumAmount, minimumInvestment, maximumInvestment, offeringDeadline,
      securityType, equityPercentage, conversionTerms,
      preMoney, postMoney, valuationCap, discountRate, interestRate, maturityDate,
      votingRights, proRataRights, informationRights, dragAlongRights,
      productDevelopment, marketing, operations, team, otherUse,
      legalCounsel, accountant, platform
    } = formData;
    
    // Construct full document text
    let documentText = `EQUITY CROWDFUNDING TERMS SHEET

COMPANY: ${companyName || "[Company Name]"}
ENTITY TYPE: ${companyType}
ADDRESS: ${companyAddress || "[Company Address]"}
CONTACT: ${contactPerson || "[Contact Person]"}, ${contactEmail || "[Contact Email]"}

OFFERING SUMMARY
----------------------------------------------

OFFERING TITLE: ${offeringTitle || "Equity Crowdfunding Offering"}
TARGET RAISE: ${targetAmount ? `$${targetAmount}` : "[Target Amount]"}
${minimumAmount ? `MINIMUM RAISE: $${minimumAmount}` : ""}
${maximumAmount ? `MAXIMUM RAISE: $${maximumAmount}` : ""}
MINIMUM INVESTMENT: ${minimumInvestment ? `$${minimumInvestment}` : "[Minimum Investment]"}
${maximumInvestment ? `MAXIMUM INVESTMENT: $${maximumInvestment}` : ""}
${offeringDeadline ? `OFFERING DEADLINE: ${offeringDeadline}` : "OFFERING DEADLINE: [Date]"}

SECURITY TYPE AND TERMS
----------------------------------------------

TYPE OF SECURITY: ${securityType}`;

    if (securityType === "Equity") {
      documentText += `
EQUITY OFFERED: ${equityPercentage || "[X]"}% of fully-diluted capitalization
PRE-MONEY VALUATION: ${preMoney ? `$${preMoney}` : "[Pre-money Valuation]"}
${postMoney ? `POST-MONEY VALUATION: $${postMoney}` : ""}`;
    } else if (securityType === "SAFE") {
      documentText += `
VALUATION CAP: ${valuationCap ? `$${valuationCap}` : "[Valuation Cap]"}
DISCOUNT RATE: ${discountRate || "[X]"}%
PRE-MONEY VALUATION: ${preMoney ? `$${preMoney}` : "N/A - Will be determined at next priced round"}`;
    } else if (securityType === "Convertible Note") {
      documentText += `
VALUATION CAP: ${valuationCap ? `$${valuationCap}` : "[Valuation Cap]"}
DISCOUNT RATE: ${discountRate || "[X]"}%
INTEREST RATE: ${interestRate || "[X]"}%
MATURITY DATE: ${maturityDate || "[Date]"}`;
    } else if (securityType === "Revenue Share") {
      documentText += `
REVENUE SHARE PERCENTAGE: ${equityPercentage || "[X]"}% of monthly revenue
REPAYMENT CAP: ${valuationCap ? `${valuationCap}x` : "[X]x"} investment amount`;
    } else if (securityType === "Debt") {
      documentText += `
INTEREST RATE: ${interestRate || "[X]"}%
MATURITY DATE: ${maturityDate || "[Date]"}
REPAYMENT TERMS: ${conversionTerms || "[Repayment Terms]"}`;
    }

    documentText += `

CONVERSION TERMS: ${conversionTerms || securityType === "SAFE" ? "Converts to equity in a subsequent priced round or exit event" : securityType === "Convertible Note" ? "Converts to equity at maturity or in a qualified financing round" : "[Conversion Terms]"}

INVESTOR RIGHTS
----------------------------------------------

VOTING RIGHTS: ${votingRights === "Yes" ? "Investors will have voting rights proportional to their ownership stake" : "Investors will not have voting rights"}
PRO-RATA RIGHTS: ${proRataRights === "Yes" ? "Investors will have the right to participate in future funding rounds to maintain their ownership percentage" : "Investors will not have pro-rata rights"}
INFORMATION RIGHTS: ${informationRights === "Yes" ? "Investors will receive quarterly updates and annual financial statements" : "No formal information rights beyond statutory requirements"}
DRAG-ALONG RIGHTS: ${dragAlongRights === "Yes" ? "In the event of a company sale, minority investors must sell their shares on the same terms as the majority" : "No drag-along provisions"}

USE OF FUNDS
----------------------------------------------`;

    // Add use of funds if provided
    if (productDevelopment || marketing || operations || team || otherUse) {
      if (productDevelopment) documentText += `\nPRODUCT DEVELOPMENT: ${productDevelopment}%`;
      if (marketing) documentText += `\nMARKETING & SALES: ${marketing}%`;
      if (operations) documentText += `\nOPERATIONS: ${operations}%`;
      if (team) documentText += `\nTEAM EXPANSION: ${team}%`;
      if (otherUse) documentText += `\nOTHER: ${otherUse}%`;
    } else {
      documentText += `\n[Detailed allocation of the raised capital]`;
    }

    documentText += `

PROFESSIONAL ADVISORS
----------------------------------------------`;

    if (legalCounsel) documentText += `\nLEGAL COUNSEL: ${legalCounsel}`;
    if (accountant) documentText += `\nACCOUNTANT: ${accountant}`;
    documentText += `\nCROWDFUNDING PLATFORM: ${platform}`;

    documentText += `

DISCLAIMER
----------------------------------------------

This term sheet is for discussion purposes only and does not constitute a legally binding obligation. The terms set forth above are subject to change and must be separately agreed to by authorized representatives of both the Company and the investors.

This offering is being made pursuant to Regulation Crowdfunding under the Securities Act of 1933. Potential investors should review all offering materials and disclosures available on the funding portal before investing.

Investing in startups involves substantial risk, including illiquidity, lack of dividends, loss of investment, and dilution. This investment may be particularly risky as it is speculative, highly illiquid, and you may lose your entire investment.`;

    return documentText;
  };
  
  // Generate document text
  const documentText = generateDocumentText();
  
  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    // Map fields to document sections
    const fieldToSection = {
      // Company Information
      companyName: "COMPANY:",
      companyType: "ENTITY TYPE:",
      companyAddress: "ADDRESS:",
      contactPerson: "CONTACT:",
      contactEmail: "CONTACT:",
      
      // Offering Details
      offeringTitle: "OFFERING TITLE:",
      targetAmount: "TARGET RAISE:",
      minimumAmount: "MINIMUM RAISE:",
      maximumAmount: "MAXIMUM RAISE:",
      minimumInvestment: "MINIMUM INVESTMENT:",
      maximumInvestment: "MAXIMUM INVESTMENT:",
      offeringDeadline: "OFFERING DEADLINE:",
      
      // Security Type & Terms
      securityType: "TYPE OF SECURITY:",
      equityPercentage: "EQUITY OFFERED:|REVENUE SHARE PERCENTAGE:",
      preMoney: "PRE-MONEY VALUATION:",
      postMoney: "POST-MONEY VALUATION:",
      valuationCap: "VALUATION CAP:|REPAYMENT CAP:",
      discountRate: "DISCOUNT RATE:",
      interestRate: "INTEREST RATE:",
      maturityDate: "MATURITY DATE:",
      conversionTerms: "CONVERSION TERMS:|REPAYMENT TERMS:",
      
      // Investor Rights
      votingRights: "VOTING RIGHTS:",
      proRataRights: "PRO-RATA RIGHTS:",
      informationRights: "INFORMATION RIGHTS:",
      dragAlongRights: "DRAG-ALONG RIGHTS:",
      
      // Use of Funds
      productDevelopment: "PRODUCT DEVELOPMENT:",
      marketing: "MARKETING & SALES:",
      operations: "OPERATIONS:",
      team: "TEAM EXPANSION:",
      otherUse: "OTHER:",
      
      // Professional Advisors
      legalCounsel: "LEGAL COUNSEL:",
      accountant: "ACCOUNTANT:",
      platform: "CROWDFUNDING PLATFORM:"
    };
    
    return fieldToSection[lastChanged];
  };
  
  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    const sectionParts = sectionToHighlight.split('|');
    let highlightedText = documentText;
    
    sectionParts.forEach(section => {
      // Find the section and the rest of the line
      const regex = new RegExp(`(${section}[^\\n]*)`);
      const match = highlightedText.match(regex);
      
      if (match) {
        // Replace the section with a highlighted version
        highlightedText = highlightedText.replace(
          match[1],
          `<span class="highlighted-text">${match[1]}</span>`
        );
      }
    });
    
    return highlightedText;
  };
  
  // Create highlightable content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
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
  
  // Function to copy document text to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert("Document copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text. Please try again.");
    }
  };
  
  // Function to download document as MS Word
  const downloadAsWord = () => {
    try {
      window.generateWordDoc(documentText, {
        documentTitle: "Equity Crowdfunding Terms Sheet",
        fileName: formData.fileName || "Equity-Crowdfunding-Terms-Sheet"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Validation function
  const validateCurrentTab = () => {
    switch (currentTab) {
      case 0: // Company Information
        return formData.companyName.trim() !== "";
      case 1: // Offering Details
        return formData.targetAmount.trim() !== "";
      case 2: // Security Type & Terms
        return true; // Basic validation already enforced by form inputs
      case 3: // Investor Rights
        return true; // Radio buttons already have defaults
      case 4: // Use of Funds
        return true; // Optional section
      case 5: // Review & Finalize
        return true; // Just reviewing
      default:
        return true;
    }
  };
  
  // Assess risks for the finalization tab
  const assessRisks = () => {
    const risks = [];
    
    // Check for high risks
    if (!formData.companyName) {
      risks.push({
        level: 'high',
        message: 'Company name is missing, which makes the document legally unenforceable',
        solution: 'Go back to the Company Information tab and add your company name'
      });
    }
    
    if (!formData.targetAmount) {
      risks.push({
        level: 'high',
        message: 'Target fundraising amount is not specified, which makes the offering unclear',
        solution: 'Go back to the Offering Details tab and specify your target raise amount'
      });
    }
    
    // Check for medium risks
    if (formData.securityType === "SAFE" && !formData.valuationCap) {
      risks.push({
        level: 'medium',
        message: 'No valuation cap specified for SAFE instrument, which may concern sophisticated investors',
        solution: 'Consider adding a valuation cap in the Security Type & Terms tab'
      });
    }
    
    if (formData.securityType === "Convertible Note" && !formData.maturityDate) {
      risks.push({
        level: 'medium',
        message: 'No maturity date specified for convertible note',
        solution: 'Add a maturity date in the Security Type & Terms tab'
      });
    }
    
    if (!formData.offeringDeadline) {
      risks.push({
        level: 'medium',
        message: 'No offering deadline specified, which may create uncertainty',
        solution: 'Add an offering deadline in the Offering Details tab'
      });
    }
    
    // Check if use of funds percentages add up to 100%
    const useOfFundsTotal = 
      (parseInt(formData.productDevelopment) || 0) +
      (parseInt(formData.marketing) || 0) +
      (parseInt(formData.operations) || 0) +
      (parseInt(formData.team) || 0) +
      (parseInt(formData.otherUse) || 0);
    
    if (useOfFundsTotal > 0 && useOfFundsTotal !== 100) {
      risks.push({
        level: 'medium',
        message: `Use of funds percentages total ${useOfFundsTotal}% instead of 100%`,
        solution: 'Adjust your allocation percentages in the Use of Funds tab to total 100%'
      });
    }
    
    // Check for low risks
    if (!formData.minimumInvestment) {
      risks.push({
        level: 'low',
        message: 'No minimum investment amount specified',
        solution: 'Consider adding a minimum investment amount in the Offering Details tab'
      });
    }
    
    if (!formData.legalCounsel || !formData.accountant) {
      risks.push({
        level: 'low',
        message: 'Professional advisors not fully specified, which may reduce investor confidence',
        solution: 'Consider adding your legal counsel and accountant information'
      });
    }
    
    return risks;
  };
  
  // Render different tab content based on currentTab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Company Information
        return (
          <>
            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="companyType">Company Type</label>
              <select
                id="companyType"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
              >
                <option value="Delaware C-Corporation">Delaware C-Corporation</option>
                <option value="Delaware LLC">Delaware LLC</option>
                <option value="California C-Corporation">California C-Corporation</option>
                <option value="California LLC">California LLC</option>
                <option value="Other Corporation">Other Corporation</option>
                <option value="Other LLC">Other LLC</option>
              </select>
              <p className="helper-text">Most investors prefer Delaware C-Corporations</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="companyAddress">Company Address</label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Enter company address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person</label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Name of primary contact"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Email for investor inquiries"
              />
            </div>
          </>
        );
        
      case 1: // Offering Details
        return (
          <>
            <div className="form-group">
              <label htmlFor="offeringTitle">Offering Title</label>
              <input
                type="text"
                id="offeringTitle"
                name="offeringTitle"
                value={formData.offeringTitle}
                onChange={handleChange}
                placeholder="e.g., Series Seed Equity Financing"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="targetAmount">Target Raise Amount *</label>
              <input
                type="text"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="e.g., 500000"
                required
              />
              <p className="helper-text">Target amount you aim to raise (no $ sign or commas)</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="minimumAmount">Minimum Raise Amount</label>
              <input
                type="text"
                id="minimumAmount"
                name="minimumAmount"
                value={formData.minimumAmount}
                onChange={handleChange}
                placeholder="e.g., 100000"
              />
              <p className="helper-text">Minimum amount needed for the offering to close</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="maximumAmount">Maximum Raise Amount</label>
              <input
                type="text"
                id="maximumAmount"
                name="maximumAmount"
                value={formData.maximumAmount}
                onChange={handleChange}
                placeholder="e.g., 1000000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="minimumInvestment">Minimum Investment</label>
              <input
                type="text"
                id="minimumInvestment"
                name="minimumInvestment"
                value={formData.minimumInvestment}
                onChange={handleChange}
                placeholder="e.g., 100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="maximumInvestment">Maximum Investment</label>
              <input
                type="text"
                id="maximumInvestment"
                name="maximumInvestment"
                value={formData.maximumInvestment}
                onChange={handleChange}
                placeholder="e.g., 50000"
              />
              <p className="helper-text">Leave blank if no maximum per investor</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="offeringDeadline">Offering Deadline</label>
              <input
                type="date"
                id="offeringDeadline"
                name="offeringDeadline"
                value={formData.offeringDeadline}
                onChange={handleChange}
              />
            </div>
          </>
        );
        
      case 2: // Security Type & Terms
        return (
          <>
            <div className="form-group">
              <label htmlFor="securityType">Security Type</label>
              <select
                id="securityType"
                name="securityType"
                value={formData.securityType}
                onChange={handleChange}
              >
                <option value="SAFE">SAFE (Simple Agreement for Future Equity)</option>
                <option value="Equity">Direct Equity</option>
                <option value="Convertible Note">Convertible Note</option>
                <option value="Revenue Share">Revenue Share</option>
                <option value="Debt">Debt</option>
              </select>
              <p className="helper-text">SAFEs are common for early-stage startups</p>
            </div>
            
            {formData.securityType === "Equity" && (
              <>
                <div className="form-group">
                  <label htmlFor="equityPercentage">Equity Percentage Offered</label>
                  <input
                    type="text"
                    id="equityPercentage"
                    name="equityPercentage"
                    value={formData.equityPercentage}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                  />
                  <p className="helper-text">Percentage of fully-diluted ownership being offered</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="preMoney">Pre-Money Valuation</label>
                  <input
                    type="text"
                    id="preMoney"
                    name="preMoney"
                    value={formData.preMoney}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="postMoney">Post-Money Valuation</label>
                  <input
                    type="text"
                    id="postMoney"
                    name="postMoney"
                    value={formData.postMoney}
                    onChange={handleChange}
                    placeholder="e.g., 5500000"
                  />
                </div>
              </>
            )}
            
            {formData.securityType === "SAFE" && (
              <>
                <div className="form-group">
                  <label htmlFor="valuationCap">Valuation Cap</label>
                  <input
                    type="text"
                    id="valuationCap"
                    name="valuationCap"
                    value={formData.valuationCap}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                  />
                  <p className="helper-text">Maximum valuation for conversion</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="discountRate">Discount Rate (%)</label>
                  <input
                    type="text"
                    id="discountRate"
                    name="discountRate"
                    value={formData.discountRate}
                    onChange={handleChange}
                    placeholder="e.g., 20"
                  />
                  <p className="helper-text">Discount on price per share at next financing</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="conversionTerms">Conversion Terms</label>
                  <textarea
                    id="conversionTerms"
                    name="conversionTerms"
                    value={formData.conversionTerms}
                    onChange={handleChange}
                    placeholder="Describe when and how the SAFE converts to equity"
                    rows="3"
                  />
                </div>
              </>
            )}
            
            {formData.securityType === "Convertible Note" && (
              <>
                <div className="form-group">
                  <label htmlFor="valuationCap">Valuation Cap</label>
                  <input
                    type="text"
                    id="valuationCap"
                    name="valuationCap"
                    value={formData.valuationCap}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="discountRate">Discount Rate (%)</label>
                  <input
                    type="text"
                    id="discountRate"
                    name="discountRate"
                    value={formData.discountRate}
                    onChange={handleChange}
                    placeholder="e.g., 20"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="interestRate">Interest Rate (%)</label>
                  <input
                    type="text"
                    id="interestRate"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="maturityDate">Maturity Date</label>
                  <input
                    type="date"
                    id="maturityDate"
                    name="maturityDate"
                    value={formData.maturityDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="conversionTerms">Conversion Terms</label>
                  <textarea
                    id="conversionTerms"
                    name="conversionTerms"
                    value={formData.conversionTerms}
                    onChange={handleChange}
                    placeholder="Describe when and how the note converts to equity"
                    rows="3"
                  />
                </div>
              </>
            )}
            
            {formData.securityType === "Revenue Share" && (
              <>
                <div className="form-group">
                  <label htmlFor="equityPercentage">Revenue Share Percentage</label>
                  <input
                    type="text"
                    id="equityPercentage"
                    name="equityPercentage"
                    value={formData.equityPercentage}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                  />
                  <p className="helper-text">Percentage of monthly revenue to be shared with investors</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="valuationCap">Repayment Cap (multiplier)</label>
                  <input
                    type="text"
                    id="valuationCap"
                    name="valuationCap"
                    value={formData.valuationCap}
                    onChange={handleChange}
                    placeholder="e.g., 2"
                  />
                  <p className="helper-text">Total repayment as a multiple of invested amount (e.g., 2x)</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="conversionTerms">Payment Terms</label>
                  <textarea
                    id="conversionTerms"
                    name="conversionTerms"
                    value={formData.conversionTerms}
                    onChange={handleChange}
                    placeholder="Describe payment frequency and calculation details"
                    rows="3"
                  />
                </div>
              </>
            )}
            
            {formData.securityType === "Debt" && (
              <>
                <div className="form-group">
                  <label htmlFor="interestRate">Interest Rate (%)</label>
                  <input
                    type="text"
                    id="interestRate"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    placeholder="e.g., 8"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="maturityDate">Maturity Date</label>
                  <input
                    type="date"
                    id="maturityDate"
                    name="maturityDate"
                    value={formData.maturityDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="conversionTerms">Repayment Terms</label>
                  <textarea
                    id="conversionTerms"
                    name="conversionTerms"
                    value={formData.conversionTerms}
                    onChange={handleChange}
                    placeholder="Describe repayment schedule and conditions"
                    rows="3"
                  />
                </div>
              </>
            )}
          </>
        );
        
      case 3: // Investor Rights
        return (
          <>
            <div className="form-group">
              <label>Voting Rights</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="votingRightsYes"
                    name="votingRights"
                    value="Yes"
                    checked={formData.votingRights === "Yes"}
                    onChange={handleChange}
                  />
                  <label htmlFor="votingRightsYes">Yes, investors get voting rights</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="votingRightsNo"
                    name="votingRights"
                    value="No"
                    checked={formData.votingRights === "No"}
                    onChange={handleChange}
                  />
                  <label htmlFor="votingRightsNo">No voting rights for investors</label>
                </div>
              </div>
              <p className="helper-text">SAFEs and convertible notes typically don't include voting rights</p>
            </div>
            
            <div className="form-group">
              <label>Pro-Rata Rights</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="proRataRightsYes"
                    name="proRataRights"
                    value="Yes"
                    checked={formData.proRataRights === "Yes"}
                    onChange={handleChange}
                  />
                  <label htmlFor="proRataRightsYes">Yes, investors get pro-rata rights</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="proRataRightsNo"
                    name="proRataRights"
                    value="No"
                    checked={formData.proRataRights === "No"}
                    onChange={handleChange}
                  />
                  <label htmlFor="proRataRightsNo">No pro-rata rights</label>
                </div>
              </div>
              <p className="helper-text">Pro-rata rights allow investors to maintain their ownership percentage in future rounds</p>
            </div>
            
            <div className="form-group">
              <label>Information Rights</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="informationRightsYes"
                    name="informationRights"
                    value="Yes"
                    checked={formData.informationRights === "Yes"}
                    onChange={handleChange}
                  />
                  <label htmlFor="informationRightsYes">Yes, investors receive updates and financials</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="informationRightsNo"
                    name="informationRights"
                    value="No"
                    checked={formData.informationRights === "No"}
                    onChange={handleChange}
                  />
                  <label htmlFor="informationRightsNo">No formal information rights</label>
                </div>
              </div>
              <p className="helper-text">Regular updates build investor confidence and trust</p>
            </div>
            
            <div className="form-group">
              <label>Drag-Along Rights</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="dragAlongRightsYes"
                    name="dragAlongRights"
                    value="Yes"
                    checked={formData.dragAlongRights === "Yes"}
                    onChange={handleChange}
                  />
                  <label htmlFor="dragAlongRightsYes">Yes, include drag-along provisions</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="dragAlongRightsNo"
                    name="dragAlongRights"
                    value="No"
                    checked={formData.dragAlongRights === "No"}
                    onChange={handleChange}
                  />
                  <label htmlFor="dragAlongRightsNo">No drag-along provisions</label>
                </div>
              </div>
              <p className="helper-text">Drag-along rights help facilitate company sale by ensuring minority investors can't block the transaction</p>
            </div>
          </>
        );
        
      case 4: // Use of Funds
        return (
          <>
            <div className="form-group">
              <label htmlFor="productDevelopment">Product Development (%)</label>
              <input
                type="number"
                id="productDevelopment"
                name="productDevelopment"
                value={formData.productDevelopment}
                onChange={handleChange}
                placeholder="e.g., 40"
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="marketing">Marketing & Sales (%)</label>
              <input
                type="number"
                id="marketing"
                name="marketing"
                value={formData.marketing}
                onChange={handleChange}
                placeholder="e.g., 30"
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="operations">Operations (%)</label>
              <input
                type="number"
                id="operations"
                name="operations"
                value={formData.operations}
                onChange={handleChange}
                placeholder="e.g., 15"
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="team">Team Expansion (%)</label>
              <input
                type="number"
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="e.g., 10"
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="otherUse">Other (%)</label>
              <input
                type="number"
                id="otherUse"
                name="otherUse"
                value={formData.otherUse}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="0"
                max="100"
              />
            </div>
            
            {/* Calculate total */}
            {(() => {
              const total = 
                (parseInt(formData.productDevelopment) || 0) +
                (parseInt(formData.marketing) || 0) +
                (parseInt(formData.operations) || 0) +
                (parseInt(formData.team) || 0) +
                (parseInt(formData.otherUse) || 0);
              
              return (
                <div className="form-group">
                  <label>Total Allocation</label>
                  <div style={{ 
                    padding: '0.5rem', 
                    backgroundColor: total === 100 ? '#f0fff4' : '#fff5f5',
                    border: `1px solid ${total === 100 ? '#10b981' : '#ef4444'}`,
                    borderRadius: '0.25rem'
                  }}>
                    <strong>{total}%</strong> {total === 100 ? '✅' : '(Should be 100%)'}
                  </div>
                </div>
              );
            })()}
            
            <div className="form-group">
              <label htmlFor="legalCounsel">Legal Counsel</label>
              <input
                type="text"
                id="legalCounsel"
                name="legalCounsel"
                value={formData.legalCounsel}
                onChange={handleChange}
                placeholder="Law firm name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accountant">Accountant</label>
              <input
                type="text"
                id="accountant"
                name="accountant"
                value={formData.accountant}
                onChange={handleChange}
                placeholder="Accounting firm name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="platform">Crowdfunding Platform</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="Wefunder">Wefunder</option>
                <option value="Republic">Republic</option>
                <option value="StartEngine">StartEngine</option>
                <option value="SeedInvest">SeedInvest</option>
                <option value="Netcapital">Netcapital</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        );
        
      case 5: // Review & Finalize
        return (
          <>
            <h2>Review Your Terms Sheet</h2>
            <p>Please review the details of your equity crowdfunding terms sheet. The generated document appears in the preview pane.</p>
            
            <div className="form-group">
              <label htmlFor="fileName">Document Filename</label>
              <input
                type="text"
                id="fileName"
                name="fileName"
                value={formData.fileName}
                onChange={handleChange}
                placeholder="Equity-Crowdfunding-Terms-Sheet"
              />
            </div>
            
            <h2 style={{ marginTop: '1.5rem' }}>Risk Assessment</h2>
            
            {assessRisks().length > 0 ? (
              assessRisks().map((risk, index) => (
                <div key={index} className={`risk-assessment risk-${risk.level}`}>
                  <h3 style={{ marginTop: 0 }}>
                    {risk.level === 'high' && <Icon name="alert-triangle" style={{ color: '#ef4444', marginRight: '0.5rem' }} />}
                    {risk.level === 'medium' && <Icon name="alert-circle" style={{ color: '#f59e0b', marginRight: '0.5rem' }} />}
                    {risk.level === 'low' && <Icon name="info" style={{ color: '#10b981', marginRight: '0.5rem' }} />}
                    {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk
                  </h3>
                  <p>{risk.message}</p>
                  <p><strong>Solution:</strong> {risk.solution}</p>
                </div>
              ))
            ) : (
              <div className="risk-assessment risk-low">
                <h3 style={{ marginTop: 0 }}>
                  <Icon name="check-circle" style={{ color: '#10b981', marginRight: '0.5rem' }} />
                  No Significant Risks Detected
                </h3>
                <p>Your equity crowdfunding terms sheet appears to be complete and properly structured.</p>
              </div>
            )}
            
            <div style={{ marginTop: '2rem' }}>
              <h2>Legal Disclaimer</h2>
              <p>This terms sheet generator provides a template only and does not constitute legal advice. The generated document should be reviewed by a qualified attorney before use. Equity crowdfunding is regulated by federal securities laws, and issuers must comply with all applicable regulations.</p>
              
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '0.5rem', 
                border: '1px solid #bae6fd' 
              }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <Icon name="alert-circle" style={{ color: '#0ea5e9', marginRight: '0.5rem' }} />
                  Need Legal Help?
                </h3>
                <p style={{ marginTop: '0.5rem' }}>For professional assistance with your equity crowdfunding offering, including SEC compliance and investor documentation, consider consulting with a securities attorney who specializes in crowdfunding regulations.</p>
              </div>
            </div>
          </>
        );
        
      default:
        return <p>Invalid tab</p>;
    }
  };
  
  return (
    <div className="container">
      <div className="form-panel">
        <h1>Equity Crowdfunding Terms Sheet Generator</h1>
        
        {/* Tab navigation */}
        <div className="tab-navigation">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-button ${currentTab === index ? 'active' : ''}`}
              onClick={() => goToTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab content */}
        {renderTabContent()}
        
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
            Copy
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
            Download
          </button>
          
          <button
            onClick={nextTab}
            className="nav-button next-button"
            disabled={!validateCurrentTab()}
          >
            {currentTab === tabs.length - 1 ? 'Finish' : 'Next'}
            <Icon name="chevron-right" style={{marginLeft: "0.25rem"}} />
          </button>
        </div>
      </div>
      
      <div className="preview-panel" ref={previewRef}>
        <div className="preview-content">
          <h2>Live Preview</h2>
          <pre 
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
    </div>
  );
};

// Render the application
ReactDOM.render(<App />, document.getElementById('root'));