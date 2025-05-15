// Revenue-Based Financing Agreement Generator
const { useState, useEffect, useRef } = React;

const Icon = ({ name, style }) => {
  return (
    <i data-feather={name} style={style} />
  );
};

const RevenueBasedFinancingGenerator = () => {
  // Tab configuration
  const tabs = [
    { id: 'parties', label: 'Parties' },
    { id: 'investment', label: 'Investment Terms' },
    { id: 'repayment', label: 'Repayment Terms' },
    { id: 'security', label: 'Security & Covenants' },
    { id: 'termination', label: 'Default & Termination' },
  ];

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    // Parties Tab
    companyName: '',
    companyType: 'Delaware Corporation',
    companyAddress: '',
    companyRepName: '',
    companyRepTitle: 'CEO',
    investorName: '',
    investorType: 'Individual',
    investorAddress: '',
    
    // Investment Terms Tab
    investmentAmount: '100,000',
    fundingDate: '',
    investmentPurpose: 'general working capital and business growth',
    returnMultiple: '1.5',
    
    // Repayment Terms Tab
    revenuePercentage: '8',
    minMonthlyPayment: '2,000',
    paymentFrequency: 'Monthly',
    paymentStartDate: '',
    revenueDefinition: 'all income, revenue, receipts, receivables and proceeds from sales',
    excludedRevenue: '',
    
    // Security & Covenants Tab
    collateral: 'None',
    personalGuarantee: false,
    financialReporting: 'Monthly',
    restrictedActivities: true,
    additionalDebt: true,
    materialChanges: true,
    
    // Default & Termination Tab
    cureDefault: true,
    cureTime: '15',
    accelerationPayment: true,
    earlySatisfaction: '90',
    disputeResolution: 'Arbitration',
    lawGoverning: 'California',
    
    // Document Info
    documentTitle: 'Revenue-Based Financing Agreement',
    fileName: 'Revenue-Based-Financing-Agreement',
  });

  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
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
  
  // Generate the document text based on form data
  const generateDocumentText = () => {
    const {
      companyName, companyType, companyAddress, companyRepName, companyRepTitle,
      investorName, investorType, investorAddress,
      investmentAmount, fundingDate, investmentPurpose, returnMultiple,
      revenuePercentage, minMonthlyPayment, paymentFrequency, paymentStartDate,
      revenueDefinition, excludedRevenue,
      collateral, personalGuarantee, financialReporting, restrictedActivities,
      additionalDebt, materialChanges,
      cureDefault, cureTime, accelerationPayment, earlySatisfaction,
      disputeResolution, lawGoverning
    } = formData;
    
    // Format today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    // Calculate full repayment amount
    const investmentAmountNumeric = parseFloat(investmentAmount.replace(/,/g, ''));
    const returnMultipleNumeric = parseFloat(returnMultiple);
    const fullRepaymentAmount = (investmentAmountNumeric * returnMultipleNumeric).toLocaleString();
    
    let documentText = `REVENUE-BASED FINANCING AGREEMENT

THIS REVENUE-BASED FINANCING AGREEMENT (the "Agreement") is made and entered into as of ${fundingDate || formattedDate} (the "Effective Date").

BETWEEN:

${companyName || '[COMPANY NAME]'}, a ${companyType} with its principal place of business at ${companyAddress || '[COMPANY ADDRESS]'} (the "Company"), represented by ${companyRepName || '[NAME]'}, its ${companyRepTitle}

AND

${investorName || '[INVESTOR NAME]'}, a ${investorType} with an address at ${investorAddress || '[INVESTOR ADDRESS]'} (the "Investor").

RECITALS:

WHEREAS, the Company is seeking financing to fund ${investmentPurpose};

WHEREAS, the Investor is willing to provide such financing in exchange for a share of the Company's future revenues;

NOW, THEREFORE, in consideration of the mutual covenants, terms, and conditions set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITIONS

Unless otherwise indicated in this Agreement, the following terms shall have the following meanings:

1.1. "Funding Amount" means the sum of $${investmentAmount} to be provided by the Investor to the Company pursuant to this Agreement.

1.2. "Revenue" means ${revenueDefinition || 'all income, revenue, receipts, receivables and proceeds from sales'} of the Company.${excludedRevenue ? `\n\n1.3. "Excluded Revenue" means ${excludedRevenue}.` : ''}

1.${excludedRevenue ? '4' : '3'}. "Return Cap" means $${fullRepaymentAmount}, which equals ${returnMultiple}x the Funding Amount.

1.${excludedRevenue ? '5' : '4'}. "Revenue Share Percentage" means ${revenuePercentage}% of Revenue.

2. FUNDING

2.1. Funding. Subject to the terms and conditions of this Agreement, the Investor shall provide the Funding Amount to the Company on ${fundingDate || 'the Effective Date'} (the "Funding Date").

2.2. Use of Proceeds. The Company shall use the Funding Amount solely for ${investmentPurpose} and for no other purpose without the prior written consent of the Investor.

3. REVENUE SHARE PAYMENTS

3.1. Revenue Share. In consideration of the Funding Amount, the Company agrees to pay to the Investor the Revenue Share Percentage until the Investor has received an aggregate amount equal to the Return Cap.

3.2. Payment Frequency. The Company shall make payments to the Investor on a ${paymentFrequency} basis, beginning on ${paymentStartDate || 'the 15th day of the month following the Funding Date'} and continuing until the Return Cap has been reached.

3.3. Minimum Payments. Regardless of the Revenue earned by the Company in any given payment period, the Company shall pay the Investor a minimum of $${minMonthlyPayment} per ${paymentFrequency.toLowerCase() === 'monthly' ? 'month' : paymentFrequency.toLowerCase() === 'quarterly' ? 'quarter' : 'period'} until the Return Cap has been reached.

3.4. Payment Method. All payments shall be made by electronic funds transfer to an account designated by the Investor.

3.5. Prepayment. The Company may prepay the remaining balance of the Return Cap at any time. If the Company prepays the entire remaining balance within ${earlySatisfaction} days of the Funding Date, the Return Cap will be reduced by 10%.

4. INFORMATION RIGHTS AND COVENANTS

4.1. Financial Reporting. The Company shall provide the Investor with ${financialReporting.toLowerCase()} financial statements, including a balance sheet, income statement, and statement of cash flows, within 15 days after the end of each ${financialReporting.toLowerCase() === 'monthly' ? 'month' : financialReporting.toLowerCase() === 'quarterly' ? 'quarter' : 'year'}.

4.2. Revenue Reporting. Along with each payment, the Company shall provide a detailed calculation of Revenue for the applicable period.

4.3. Access to Records. The Investor shall have the right, upon reasonable notice, to audit the Company's books and records to verify the calculation of Revenue and payments made under this Agreement.

${restrictedActivities ? `4.4. Restricted Activities. Without the prior written consent of the Investor, the Company shall not:
` : ''}${additionalDebt ? `\n    (a) Incur any additional debt or financial obligations exceeding $50,000;` : ''}${materialChanges ? `\n    (b) Make any material changes to its business model or operations;` : ''}${(additionalDebt || materialChanges) ? `\n    (c) Sell, transfer, or otherwise dispose of any material assets outside the ordinary course of business;` : ''}${(additionalDebt || materialChanges) ? `\n    (d) Enter into any merger, consolidation, or similar transaction;` : ''}

5. SECURITY${collateral !== 'None' ? `

5.1. Collateral. As security for the Company's obligations under this Agreement, the Company hereby grants to the Investor a security interest in ${collateral}.` : ''}

${personalGuarantee ? `5.${collateral !== 'None' ? '2' : '1'}. Personal Guarantee. The obligations of the Company under this Agreement shall be personally guaranteed by the Company's principal shareholders or officers as set forth in a separate guarantee agreement.` : ''}

6. DEFAULT AND REMEDIES

6.1. Events of Default. The occurrence of any of the following shall constitute an event of default under this Agreement:

    (a) Failure to make any payment when due;
    (b) Breach of any representation, warranty, or covenant;
    (c) Insolvency, bankruptcy, or similar proceedings;
    (d) Material adverse change in the Company's business or financial condition;
    (e) Change of control of the Company without prior written consent.

${cureDefault ? `6.2. Cure Period. Following an event of default, the Company shall have ${cureTime} days to cure such default.` : ''}

${accelerationPayment ? `6.${cureDefault ? '3' : '2'}. Acceleration. Upon an uncured event of default, the Investor may declare all remaining payments up to the Return Cap immediately due and payable.` : ''}

7. MISCELLANEOUS

7.1. Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${lawGoverning}.

7.2. Dispute Resolution. Any dispute arising out of or relating to this Agreement shall be resolved through ${disputeResolution === 'Arbitration' ? 'binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules' : 'litigation in the courts of the State of ' + lawGoverning}.

7.3. Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.

7.4. Amendments. This Agreement may only be amended, modified, or supplemented by an agreement in writing signed by each party hereto.

7.5. Notices. All notices must be in writing and sent to the addresses specified in this Agreement.

7.6. Assignment. Neither party may assign any of its rights or delegate any of its obligations under this Agreement without the prior written consent of the other party.

7.7. Severability. If any term or provision of this Agreement is invalid, illegal, or unenforceable, the remainder of this Agreement shall remain in effect.

7.8. Counterparts. This Agreement may be executed in multiple counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.

COMPANY:
${companyName || '[COMPANY NAME]'}

By: ________________________
Name: ${companyRepName || '[NAME]'}
Title: ${companyRepTitle}

INVESTOR:
${investorName || '[INVESTOR NAME]'}

By: ________________________
Name: ${investorName || '[NAME]'}
Title: ${investorType === 'Individual' ? '' : '[TITLE]'}`;

    return documentText;
  };
  
  // Generate document text
  const documentText = generateDocumentText();
  
  // Function to determine which section to highlight based on the tab and last changed field
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    // Define the mapping of fields to sections in the document
    const fieldToSectionMap = {
      // Parties Tab
      companyName: /BETWEEN:\s*\n\s*(?:.*?)(?=\s*AND)/s,
      companyType: /BETWEEN:\s*\n\s*(?:.*?)(?=\s*AND)/s,
      companyAddress: /BETWEEN:\s*\n\s*(?:.*?)(?=\s*AND)/s,
      companyRepName: /BETWEEN:\s*\n\s*(?:.*?)(?=\s*AND)/s,
      companyRepTitle: /BETWEEN:\s*\n\s*(?:.*?)(?=\s*AND)/s,
      investorName: /AND\s*\n\s*(?:.*?)(?=\s*RECITALS)/s,
      investorType: /AND\s*\n\s*(?:.*?)(?=\s*RECITALS)/s,
      investorAddress: /AND\s*\n\s*(?:.*?)(?=\s*RECITALS)/s,
      
      // Investment Terms Tab
      investmentAmount: /1\.1\. "Funding Amount".*?(\$[0-9,]+)/s,
      fundingDate: /2\.1\. Funding.*?on\s+(.*?)\s+\(the/s,
      investmentPurpose: /WHEREAS, the Company is seeking financing to fund (.*?);/s,
      returnMultiple: /1\.[0-9]\. "Return Cap".*?equals\s+([0-9.]+)x/s,
      
      // Repayment Terms Tab
      revenuePercentage: /1\.[0-9]\. "Revenue Share Percentage".*?([0-9.]+)%/s,
      minMonthlyPayment: /3\.3\. Minimum Payments.*?\$([0-9,]+)\s+per/s,
      paymentFrequency: /3\.2\. Payment Frequency.*?on a\s+(.*?)\s+basis/s,
      paymentStartDate: /3\.2\. Payment Frequency.*?beginning on\s+(.*?)\s+and/s,
      revenueDefinition: /1\.2\. "Revenue" means\s+(.*?)\s+of the Company/s,
      excludedRevenue: /1\.3\. "Excluded Revenue".*?(.*?)(?=\.)/s,
      
      // Security & Covenants Tab
      collateral: /5\.1\. Collateral.*?interest in\s+(.*?)(?=\.)/s,
      personalGuarantee: /5\.[0-9]\. Personal Guarantee.*?guaranteed by\s+(.*?)(?=\.)/s,
      financialReporting: /4\.1\. Financial Reporting.*?provide the Investor with\s+(.*?)\s+financial/s,
      restrictedActivities: /4\.4\. Restricted Activities.*?shall not:/s,
      additionalDebt: /\(a\) Incur any additional debt or financial obligations/s,
      materialChanges: /\(b\) Make any material changes to its business model/s,
      
      // Default & Termination Tab
      cureDefault: /6\.2\. Cure Period.*?shall have\s+([0-9]+)\s+days/s,
      cureTime: /6\.2\. Cure Period.*?shall have\s+([0-9]+)\s+days/s,
      accelerationPayment: /6\.[0-9]\. Acceleration.*?immediately due and payable/s,
      earlySatisfaction: /3\.5\. Prepayment.*?within\s+([0-9]+)\s+days/s,
      disputeResolution: /7\.2\. Dispute Resolution.*?resolved through\s+(.*?)(?=\.)/s,
      lawGoverning: /7\.1\. Governing Law.*?laws of the State of\s+(.*?)(?=\.)/s,
    };
    
    return fieldToSectionMap[lastChanged];
  };
  
  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    return documentText.replace(sectionToHighlight, match => 
      `<span class="highlighted-text">${match}</span>`
    );
  };
  
  // Create highlightable content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert("Document copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy text: ", error);
      alert("Failed to copy text. Please try again or use the download option.");
    }
  };
  
  // Download MS Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      window.generateWordDoc(documentText, {
        documentTitle: formData.documentTitle,
        fileName: formData.fileName
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Render form based on current tab
  const renderForm = () => {
    switch (currentTab) {
      case 0: // Parties
        return (
          <div className="form-section">
            <h2>Company Information</h2>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Corporation"
              />
            </div>
            
            <div className="form-group">
              <label>Company Type</label>
              <select
                name="companyType"
                className="form-control"
                value={formData.companyType}
                onChange={handleChange}
              >
                <option value="Delaware Corporation">Delaware Corporation</option>
                <option value="Delaware Limited Liability Company">Delaware LLC</option>
                <option value="California Corporation">California Corporation</option>
                <option value="California Limited Liability Company">California LLC</option>
                <option value="New York Corporation">New York Corporation</option>
                <option value="New York Limited Liability Company">New York LLC</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Company Address</label>
              <input
                type="text"
                name="companyAddress"
                className="form-control"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="123 Main St, San Francisco, CA 94105"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Company Representative Name</label>
                <input
                  type="text"
                  name="companyRepName"
                  className="form-control"
                  value={formData.companyRepName}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
              </div>
              
              <div className="form-group">
                <label>Representative Title</label>
                <select
                  name="companyRepTitle"
                  className="form-control"
                  value={formData.companyRepTitle}
                  onChange={handleChange}
                >
                  <option value="CEO">CEO</option>
                  <option value="President">President</option>
                  <option value="CFO">CFO</option>
                  <option value="COO">COO</option>
                  <option value="Managing Member">Managing Member</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>
            
            <h2>Investor Information</h2>
            <div className="form-group">
              <label>Investor Name</label>
              <input
                type="text"
                name="investorName"
                className="form-control"
                value={formData.investorName}
                onChange={handleChange}
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="form-group">
              <label>Investor Type</label>
              <select
                name="investorType"
                className="form-control"
                value={formData.investorType}
                onChange={handleChange}
              >
                <option value="Individual">Individual</option>
                <option value="LLC">LLC</option>
                <option value="Corporation">Corporation</option>
                <option value="Limited Partnership">Limited Partnership</option>
                <option value="Trust">Trust</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Investor Address</label>
              <input
                type="text"
                name="investorAddress"
                className="form-control"
                value={formData.investorAddress}
                onChange={handleChange}
                placeholder="456 Oak St, New York, NY 10001"
              />
            </div>
          </div>
        );
        
      case 1: // Investment Terms
        return (
          <div className="form-section">
            <h2>Investment Details</h2>
            <div className="form-group">
              <label>Investment Amount ($)</label>
              <input
                type="text"
                name="investmentAmount"
                className="form-control"
                value={formData.investmentAmount}
                onChange={handleChange}
                placeholder="100,000"
              />
              <div className="help-text">Format as number with commas, no dollar sign (e.g., 100,000)</div>
            </div>
            
            <div className="form-group">
              <label>Funding Date</label>
              <input
                type="text"
                name="fundingDate"
                className="form-control"
                value={formData.fundingDate}
                onChange={handleChange}
                placeholder="May 15, 2025"
              />
              <div className="help-text">Leave blank to use the effective date</div>
            </div>
            
            <div className="form-group">
              <label>Investment Purpose</label>
              <input
                type="text"
                name="investmentPurpose"
                className="form-control"
                value={formData.investmentPurpose}
                onChange={handleChange}
                placeholder="general working capital and business growth"
              />
            </div>
            
            <div className="form-group">
              <label>Return Multiple</label>
              <select
                name="returnMultiple"
                className="form-control"
                value={formData.returnMultiple}
                onChange={handleChange}
              >
                <option value="1.3">1.3x</option>
                <option value="1.4">1.4x</option>
                <option value="1.5">1.5x</option>
                <option value="1.6">1.6x</option>
                <option value="1.75">1.75x</option>
                <option value="2.0">2.0x</option>
                <option value="2.5">2.5x</option>
              </select>
              <div className="help-text">Total amount to be repaid = Investment Amount × Return Multiple</div>
            </div>
          </div>
        );
        
      case 2: // Repayment Terms
        return (
          <div className="form-section">
            <h2>Revenue Share Structure</h2>
            <div className="form-group">
              <label>Revenue Percentage (%)</label>
              <input
                type="text"
                name="revenuePercentage"
                className="form-control"
                value={formData.revenuePercentage}
                onChange={handleChange}
                placeholder="8"
              />
              <div className="help-text">Percentage of revenue that will be paid to investor</div>
            </div>
            
            <div className="form-group">
              <label>Minimum Monthly Payment ($)</label>
              <input
                type="text"
                name="minMonthlyPayment"
                className="form-control"
                value={formData.minMonthlyPayment}
                onChange={handleChange}
                placeholder="2,000"
              />
              <div className="help-text">Minimum payment regardless of revenue</div>
            </div>
            
            <div className="form-group">
              <label>Payment Frequency</label>
              <select
                name="paymentFrequency"
                className="form-control"
                value={formData.paymentFrequency}
                onChange={handleChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Weekly">Weekly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Payment Start Date</label>
              <input
                type="text"
                name="paymentStartDate"
                className="form-control"
                value={formData.paymentStartDate}
                onChange={handleChange}
                placeholder="June 15, 2025"
              />
              <div className="help-text">Leave blank to default to 15 days after funding</div>
            </div>
            
            <h2>Revenue Definition</h2>
            <div className="form-group">
              <label>Revenue Definition</label>
              <textarea
                name="revenueDefinition"
                className="form-control"
                value={formData.revenueDefinition}
                onChange={handleChange}
                placeholder="all income, revenue, receipts, receivables and proceeds from sales"
              />
            </div>
            
            <div className="form-group">
              <label>Excluded Revenue (Optional)</label>
              <textarea
                name="excludedRevenue"
                className="form-control"
                value={formData.excludedRevenue}
                onChange={handleChange}
                placeholder="revenue from one-time asset sales, tax refunds, and insurance proceeds"
              />
              <div className="help-text">Leave blank if there are no revenue exclusions</div>
            </div>
          </div>
        );
        
      case 3: // Security & Covenants
        return (
          <div className="form-section">
            <h2>Security</h2>
            <div className="form-group">
              <label>Collateral</label>
              <select
                name="collateral"
                className="form-control"
                value={formData.collateral}
                onChange={handleChange}
              >
                <option value="None">None</option>
                <option value="all assets of the Company">All Assets</option>
                <option value="all intellectual property of the Company">Intellectual Property Only</option>
                <option value="all accounts receivable of the Company">Accounts Receivable Only</option>
                <option value="specific equipment and inventory as listed in Schedule A">Specific Equipment/Inventory</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="personalGuarantee"
                checked={formData.personalGuarantee}
                onChange={handleChange}
                id="personalGuarantee"
              />
              <label htmlFor="personalGuarantee">Require Personal Guarantee</label>
            </div>
            
            <h2>Financial Reporting & Covenants</h2>
            <div className="form-group">
              <label>Financial Reporting Frequency</label>
              <select
                name="financialReporting"
                className="form-control"
                value={formData.financialReporting}
                onChange={handleChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="restrictedActivities"
                checked={formData.restrictedActivities}
                onChange={handleChange}
                id="restrictedActivities"
              />
              <label htmlFor="restrictedActivities">Include Restricted Activities Clause</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="additionalDebt"
                checked={formData.additionalDebt}
                onChange={handleChange}
                id="additionalDebt"
              />
              <label htmlFor="additionalDebt">Restrict Additional Debt</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="materialChanges"
                checked={formData.materialChanges}
                onChange={handleChange}
                id="materialChanges"
              />
              <label htmlFor="materialChanges">Restrict Material Business Changes</label>
            </div>
          </div>
        );
        
      case 4: // Default & Termination
        return (
          <div className="form-section">
            <h2>Default Provisions</h2>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="cureDefault"
                checked={formData.cureDefault}
                onChange={handleChange}
                id="cureDefault"
              />
              <label htmlFor="cureDefault">Allow Cure Period for Defaults</label>
            </div>
            
            {formData.cureDefault && (
              <div className="form-group">
                <label>Cure Period (Days)</label>
                <input
                  type="text"
                  name="cureTime"
                  className="form-control"
                  value={formData.cureTime}
                  onChange={handleChange}
                  placeholder="15"
                />
              </div>
            )}
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="accelerationPayment"
                checked={formData.accelerationPayment}
                onChange={handleChange}
                id="accelerationPayment"
              />
              <label htmlFor="accelerationPayment">Include Acceleration Clause</label>
              <div className="help-text">If checked, allows investor to demand full repayment upon default</div>
            </div>
            
            <h2>Early Repayment & Dispute Resolution</h2>
            <div className="form-group">
              <label>Early Satisfaction Discount Period (Days)</label>
              <input
                type="text"
                name="earlySatisfaction"
                className="form-control"
                value={formData.earlySatisfaction}
                onChange={handleChange}
                placeholder="90"
              />
              <div className="help-text">Days after funding in which early repayment qualifies for a discount</div>
            </div>
            
            <div className="form-group">
              <label>Dispute Resolution Method</label>
              <select
                name="disputeResolution"
                className="form-control"
                value={formData.disputeResolution}
                onChange={handleChange}
              >
                <option value="Arbitration">Arbitration</option>
                <option value="Litigation">Litigation</option>
                <option value="Mediation followed by Arbitration">Mediation then Arbitration</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Governing Law (State)</label>
              <select
                name="lawGoverning"
                className="form-control"
                value={formData.lawGoverning}
                onChange={handleChange}
              >
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Delaware">Delaware</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="Illinois">Illinois</option>
              </select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="app-container">
      <div className="header">
        <h1>Revenue-Based Financing Agreement Generator</h1>
        <p>Customize your agreement by filling out the form fields below</p>
      </div>
      
      <div className="content-container">
        <div className="form-container">
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
          
          {/* Form content */}
          {renderForm()}
          
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
        
        {/* Live preview panel */}
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
    </div>
  );
};

// Render the application
ReactDOM.render(<RevenueBasedFinancingGenerator />, document.getElementById('root'));