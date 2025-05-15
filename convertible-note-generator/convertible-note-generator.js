// Convertible Note Generator
const { useState, useEffect, useRef } = React;

// Helper function to format currency
const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to calculate future date
const calculateFutureDate = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};

// Main Component
function ConvertibleNoteGenerator() {
  // State for form data
  const [formData, setFormData] = useState({
    // Basic info
    companyName: '',
    companyState: 'Delaware',
    investorName: '',
    principalAmount: '100000',
    date: new Date().toISOString().split('T')[0],
    
    // Financial terms
    interestRate: '5',
    maturityMonths: '24',
    maturityDate: calculateFutureDate(24),
    
    // Conversion terms
    valuationCap: '5000000',
    discountRate: '20',
    qualifyingFinancingAmount: '1000000',
    
    // Advanced terms
    hasMFN: true,
    hasProRataRights: true,
    hasInformationRights: true,
    prepaymentOption: 'with_consent',
    conversionMultiple: '2',
    governingLawState: '',
    
    // Document settings
    documentTitle: 'Convertible Promissory Note',
    fileName: 'Convertible-Note-Agreement'
  });
  
  // State for tabs
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for the document text
  const [documentText, setDocumentText] = useState('');
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content
  const previewRef = useRef(null);
  
  // Tab configuration
  const tabs = [
    { id: 'basics', label: 'Company & Investor' },
    { id: 'financials', label: 'Financial Terms' },
    { id: 'conversion', label: 'Conversion Terms' },
    { id: 'advanced', label: 'Advanced Terms' },
    { id: 'finalize', label: 'Finalize & Review' }
  ];
  
  // Generate document text whenever form data changes
  useEffect(() => {
    const newDocumentText = generateDocumentText(formData);
    setDocumentText(newDocumentText);
  }, [formData]);
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [documentText, lastChanged]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Special handling for maturity months to also update maturity date
    if (name === 'maturityMonths') {
      const newMaturityDate = calculateFutureDate(parseInt(value));
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        maturityDate: newMaturityDate
      }));
    } 
    // Handle maturity date direct changes
    else if (name === 'maturityDate') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Don't update maturityMonths since it's a direct date change
      }));
    }
    // Normal field handling
    else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        // Set governingLawState to company state if empty
        ...(name === 'companyState' && !prev.governingLawState ? { governingLawState: value } : {})
      }));
    }
  };
  
  // Document text generation function
  const generateDocumentText = (data) => {
    // Format values for display
    const formattedPrincipal = formatCurrency(data.principalAmount);
    
    // Date formatting for display
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    // Prepare document text
    let text = `CONVERTIBLE PROMISSORY NOTE

${formattedPrincipal}${' '.repeat(Math.max(70 - formattedPrincipal.length, 1))}${formatDate(data.date)}

FOR VALUE RECEIVED, ${data.companyName || '[COMPANY NAME]'}, a ${data.companyState || '[STATE]'} corporation (the "Company"), promises to pay to ${data.investorName || '[INVESTOR NAME]'} (the "Investor"), the principal sum of ${formattedPrincipal || '$[AMOUNT]'} together with accrued and unpaid interest thereon, each due and payable on the date and in the manner set forth below.

1. Interest. The Note will bear interest at the rate of ${data.interestRate || '[RATE]'}% per annum, calculated on the basis of a year of 365 days for the actual number of days elapsed. Interest shall accrue daily and be payable upon the earlier of (i) conversion of this Note or (ii) the Maturity Date.

2. Maturity Date. Unless this Note has been previously converted in accordance with the terms hereof, the entire outstanding principal balance and all unpaid accrued interest shall become fully due and payable on ${formatDate(data.maturityDate) || '[MATURITY DATE]'} (the "Maturity Date").

3. Conversion.
   (a) Qualified Financing Conversion. In the event the Company consummates, prior to the Maturity Date, a bona fide equity financing with total proceeds to the Company of not less than ${formatCurrency(data.qualifyingFinancingAmount) || '$[QUALIFYING AMOUNT]'} (excluding the conversion of this Note and other indebtedness) (a "Qualified Financing"), then the outstanding principal balance and unpaid accrued interest of this Note shall automatically convert into the equity securities issued in the Qualified Financing at a conversion price equal to ${data.discountRate || '[DISCOUNT]'}% of the price per share paid by the other purchasers of equity securities in the Qualified Financing; provided, however, that if the effective price per share calculated using the Valuation Cap would result in a lower effective price per share, the outstanding principal amount and accrued interest on this Note shall convert at such lower price. The "Valuation Cap" means ${formatCurrency(data.valuationCap) || '$[VALUATION CAP]'}.

   (b) Maturity Conversion. If this Note remains outstanding on the Maturity Date, at the option of the Investor, the outstanding principal amount and unpaid accrued interest may be converted into shares of the Company's common stock at a conversion price determined by dividing the Valuation Cap by the fully-diluted capitalization of the Company as of immediately prior to such conversion (including all outstanding equity securities, all outstanding options and warrants, all notes convertible into equity securities and all unissued shares reserved for issuance under the Company's equity incentive plan).

   (c) Change of Control. If the Company consummates a Change of Control prior to the Maturity Date and prior to the conversion of this Note, then at the Investor's option, either (i) the Company will pay the Investor an amount equal to ${data.conversionMultiple || '[2-3]'}x the outstanding principal and unpaid accrued interest on this Note, or (ii) this Note will be converted into that number of shares of the Company's common stock determined by dividing the outstanding principal and unpaid accrued interest by the price per share determined by dividing the Valuation Cap by the fully-diluted capitalization of the Company as of immediately prior to such Change of Control. "Change of Control" means (i) a merger or consolidation in which the Company is a constituent party, or a subsidiary of the Company is a constituent party and the Company issues shares of its capital stock pursuant to such merger or consolidation, except any such merger or consolidation involving the Company or a subsidiary in which the shares of capital stock of the Company outstanding immediately prior to such merger or consolidation continue to represent, or are converted into or exchanged for shares of capital stock that represent, immediately following such merger or consolidation, at least a majority, by voting power, of the capital stock of the surviving or resulting entity or the parent corporation, or (ii) the sale, lease, transfer, exclusive license or other disposition, in a single transaction or series of related transactions, by the Company of all or substantially all the assets of the Company (except where such sale, lease, transfer, exclusive license or other disposition is to a wholly owned subsidiary of the Company).

4. Prepayment. This Note may not be prepaid ${data.prepaymentOption === 'with_consent' ? 'without the prior written consent of the Investor' : data.prepaymentOption === 'not_allowed' ? 'prior to the Maturity Date' : 'at any time upon 15 days\' prior written notice to the Investor'}.
`;

    // Conditional clauses based on form data
    if (data.hasMFN) {
      text += `
5. Most Favored Nation. If, prior to the conversion of this Note, the Company issues any convertible notes or other debt securities ("Other Notes") to investors, and such Other Notes contain terms that are more favorable to such investors than the terms of this Note are to the Investor, the Company shall promptly notify the Investor of such terms and, at the Investor's option, this Note shall be amended to include such more favorable terms.
`;
    }

    if (data.hasProRataRights) {
      text += `
${data.hasMFN ? '6' : '5'}. Pro-rata Rights. If, while this Note is outstanding, the Company issues equity securities in a transaction primarily for capital raising purposes, the Investor shall have the right to participate in such transaction on a pro-rata basis based on the percentage of the Company's fully-diluted capitalization that would be owned by the Investor upon conversion of this Note at the Valuation Cap.
`;
    }

    if (data.hasInformationRights) {
      text += `
${data.hasMFN && data.hasProRataRights ? '7' : data.hasMFN || data.hasProRataRights ? '6' : '5'}. Information Rights. For so long as this Note remains outstanding, the Company shall deliver to the Investor (a) annual unaudited financial statements within 90 days after the end of each fiscal year and (b) quarterly unaudited financial statements within 45 days after the end of each of the first three fiscal quarters, in each case prepared in accordance with generally accepted accounting principles.
`;
    }

    // Add amendment and governing law clauses
    const nextClauseNumber = [
      data.hasMFN ? 1 : 0, 
      data.hasProRataRights ? 1 : 0, 
      data.hasInformationRights ? 1 : 0
    ].reduce((a, b) => a + b, 5);

    text += `
${nextClauseNumber}. Amendment and Waiver. Any provision of this Note may be amended or waived with the written consent of the Company and the Investor.

${nextClauseNumber + 1}. Governing Law. This Note shall be governed by and construed in accordance with the laws of the State of ${data.governingLawState || data.companyState || '[STATE]'}, without regard to its principles of conflicts of laws.

IN WITNESS WHEREOF, the Company has executed this Convertible Promissory Note as of the date first written above.

${data.companyName ? data.companyName.toUpperCase() : '[COMPANY NAME]'}

By: ______________________________
Name: 
Title: CEO

ACKNOWLEDGED AND AGREED:

${data.investorName || '[INVESTOR NAME]'}

By: ______________________________
Name:
Title:
`;

    return text;
  };
  
  // Function to determine which section to highlight
  const getSectionToHighlight = () => {
    // Define mappings between form fields and document sections
    const fieldToSectionMap = {
      // Company & Investor tab
      companyName: 'company-info',
      companyState: 'company-info',
      investorName: 'investor-info',
      principalAmount: 'principal-amount',
      date: 'date',
      
      // Financial Terms tab
      interestRate: 'interest-section',
      maturityMonths: 'maturity-section',
      maturityDate: 'maturity-section',
      
      // Conversion Terms tab
      valuationCap: 'conversion-section',
      discountRate: 'conversion-section',
      qualifyingFinancingAmount: 'qualified-financing',
      conversionMultiple: 'change-of-control',
      
      // Advanced Terms tab
      hasMFN: 'mfn-section',
      hasProRataRights: 'prorata-section',
      hasInformationRights: 'information-section',
      prepaymentOption: 'prepayment-section',
      governingLawState: 'governing-law'
    };
    
    return fieldToSectionMap[lastChanged] || null;
  };
  
  // Create highlighted version of the text
  const createHighlightedText = () => {
    if (!lastChanged) return documentText;
    
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    // Define regex patterns for different sections of the document
    const sections = {
      'company-info': new RegExp(`${formData.companyName || '\\[COMPANY NAME\\]'}, a ${formData.companyState || '\\[STATE\\]'} corporation`, 'g'),
      'investor-info': new RegExp(`${formData.investorName || '\\[INVESTOR NAME\\]'}`, 'g'),
      'principal-amount': new RegExp(`${formatCurrency(formData.principalAmount) || '\\$\\[AMOUNT\\]'}`, 'g'),
      'date': new RegExp(`${new Date(formData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || '\\[DATE\\]'}`, 'g'),
      'interest-section': /bear interest at the rate of .*?% per annum/,
      'maturity-section': /fully due and payable on .*? \(the "Maturity Date"\)/,
      'qualified-financing': new RegExp(`not less than ${formatCurrency(formData.qualifyingFinancingAmount) || '\\$\\[QUALIFYING AMOUNT\\]'}`, 'g'),
      'conversion-section': new RegExp(`${formData.discountRate || '\\[DISCOUNT\\]'}% of the price per share|"Valuation Cap" means ${formatCurrency(formData.valuationCap) || '\\$\\[VALUATION CAP\\]'}`, 'g'),
      'change-of-control': new RegExp(`pay the Investor an amount equal to ${formData.conversionMultiple || '\\[2-3\\]'}x the outstanding`, 'g'),
      'prepayment-section': /Prepayment\. This Note may not be prepaid .*?\./,
      'mfn-section': /Most Favored Nation\. If, prior to the conversion.*?more favorable terms\./s,
      'prorata-section': /Pro-rata Rights\. If, while this Note is outstanding.*?at the Valuation Cap\./s,
      'information-section': /Information Rights\. For so long as this Note.*?accounting principles\./s,
      'governing-law': new RegExp(`laws of the State of ${formData.governingLawState || formData.companyState || '\\[STATE\\]'}`, 'g')
    };
    
    // Find and highlight the section
    if (sections[sectionToHighlight]) {
      let highlightedText = documentText;
      
      // Apply highlighting based on the regex pattern
      const pattern = sections[sectionToHighlight];
      highlightedText = highlightedText.replace(pattern, match => 
        `<span class="highlighted-text">${match}</span>`
      );
      
      return highlightedText;
    }
    
    return documentText;
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
  
  // Function to copy text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText)
      .then(() => {
        alert('Convertible Note copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying text: ', err);
        alert('Failed to copy text. Please try again.');
      });
  };
  
  // Function to download as MS Word
  const downloadAsWord = () => {
    window.generateWordDoc(documentText, {
      documentTitle: formData.documentTitle,
      fileName: formData.fileName
    });
  };
  
  // Risk assessment function
  const assessRisks = () => {
    const risks = [];
    
    // Check for empty required fields
    if (!formData.companyName) {
      risks.push({
        level: 'high',
        message: 'Company name is missing. This is a critical element of the contract.',
        solution: 'Enter the legal name of the company issuing the note.'
      });
    }
    
    if (!formData.investorName) {
      risks.push({
        level: 'high',
        message: 'Investor name is missing. This is a critical element of the contract.',
        solution: 'Enter the legal name of the investor.'
      });
    }
    
    // Valuation cap and discount rate checks
    if (!formData.valuationCap || parseFloat(formData.valuationCap) <= 0) {
      risks.push({
        level: 'high',
        message: 'Valuation cap is missing or invalid. This is a critical term for conversion.',
        solution: 'Set a reasonable valuation cap based on your company\'s current and projected value.'
      });
    } else if (parseFloat(formData.valuationCap) < parseFloat(formData.principalAmount) * 5) {
      risks.push({
        level: 'medium',
        message: 'Valuation cap appears unusually low compared to the investment amount.',
        solution: 'Consider increasing the valuation cap or ensure it accurately reflects your company\'s value.'
      });
    }
    
    if (!formData.discountRate || parseFloat(formData.discountRate) <= 0) {
      risks.push({
        level: 'medium',
        message: 'Discount rate is missing. This affects the investor\'s conversion price.',
        solution: 'Set a discount rate (typically 15-25%) to compensate the investor for early risk.'
      });
    }
    
    // Interest rate check
    if (!formData.interestRate || parseFloat(formData.interestRate) <= 0) {
      risks.push({
        level: 'medium',
        message: 'Interest rate is missing or zero. Most convertible notes accrue interest.',
        solution: 'Set a reasonable interest rate (typically 2-8% for convertible notes).'
      });
    } else if (parseFloat(formData.interestRate) > 10) {
      risks.push({
        level: 'medium',
        message: 'Interest rate is unusually high for a convertible note.',
        solution: 'Consider lowering the interest rate to be within market norms (typically 2-8%).'
      });
    }
    
    // Maturity date check
    if (!formData.maturityDate) {
      risks.push({
        level: 'high',
        message: 'Maturity date is missing. This is when the note becomes due if not converted.',
        solution: 'Set a maturity date, typically 18-24 months from issuance.'
      });
    } else {
      const maturityDate = new Date(formData.maturityDate);
      const today = new Date();
      const monthsDiff = (maturityDate.getFullYear() - today.getFullYear()) * 12 + 
                        (maturityDate.getMonth() - today.getMonth());
                        
      if (monthsDiff < 12) {
        risks.push({
          level: 'medium',
          message: 'Maturity date is less than 12 months from today, which is shorter than typical for convertible notes.',
          solution: 'Consider extending the maturity date to 18-24 months to give your company adequate time to reach next financing round.'
        });
      } else if (monthsDiff > 36) {
        risks.push({
          level: 'low',
          message: 'Maturity date is more than 36 months from today, which is longer than typical for convertible notes.',
          solution: 'Consider shortening the maturity date to 18-24 months, which is more standard and may be more attractive to investors.'
        });
      }
    }
    
    // Qualifying financing amount check
    if (!formData.qualifyingFinancingAmount || parseFloat(formData.qualifyingFinancingAmount) <= 0) {
      risks.push({
        level: 'medium',
        message: 'Qualifying financing amount is missing. This determines when the note automatically converts.',
        solution: 'Set a qualifying financing threshold that aligns with your next planned funding round.'
      });
    } else if (parseFloat(formData.qualifyingFinancingAmount) < parseFloat(formData.principalAmount) * 2) {
      risks.push({
        level: 'low',
        message: 'Qualifying financing threshold is set lower than twice the note amount, which might trigger conversion too early.',
        solution: 'Consider setting a higher qualifying amount to ensure conversion happens at a substantial funding round.'
      });
    }
    
    // Add best practice suggestions even if not critical issues
    if (risks.length === 0) {
      risks.push({
        level: 'low',
        message: 'No critical issues detected, but always review with legal counsel before finalizing.',
        solution: 'Have an attorney review the final document before signing.'
      });
    }
    
    return risks;
  };
  
  // Render tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <>
            <h2>Company & Investor Information</h2>
            <div className="form-group">
              <label htmlFor="companyName">Company Name:</label>
              <input 
                type="text" 
                id="companyName" 
                name="companyName" 
                value={formData.companyName} 
                onChange={handleChange} 
                placeholder="Enter company name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="companyState">State of Incorporation:</label>
              <select 
                id="companyState" 
                name="companyState" 
                value={formData.companyState} 
                onChange={handleChange}
              >
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="Kansas">Kansas</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="investorName">Investor Name:</label>
              <input 
                type="text" 
                id="investorName" 
                name="investorName" 
                value={formData.investorName} 
                onChange={handleChange} 
                placeholder="Enter investor name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="principalAmount">Principal Amount ($):</label>
              <input 
                type="number" 
                id="principalAmount" 
                name="principalAmount" 
                value={formData.principalAmount} 
                onChange={handleChange} 
                placeholder="Enter principal amount"
                min="0"
                step="1000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Note Date:</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange}
              />
            </div>
            
            <div className="tip-box">
              <strong>Tip:</strong> The principal amount is the total investment being made by the investor. This will accrue interest at the specified rate until conversion or repayment.
            </div>
          </>
        );
        
      case 1:
        return (
          <>
            <h2>Financial Terms</h2>
            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate (% per annum):</label>
              <input 
                type="number" 
                id="interestRate" 
                name="interestRate" 
                value={formData.interestRate} 
                onChange={handleChange} 
                placeholder="Enter interest rate"
                min="0"
                max="20"
                step="0.5"
              />
              <small>Typical range: 2-8%</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="maturityMonths">Maturity Term (months):</label>
              <input 
                type="number" 
                id="maturityMonths" 
                name="maturityMonths" 
                value={formData.maturityMonths} 
                onChange={handleChange} 
                placeholder="Enter months until maturity"
                min="1"
                max="60"
                step="1"
              />
              <small>Typical range: 18-24 months</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="maturityDate">Maturity Date:</label>
              <input 
                type="date" 
                id="maturityDate" 
                name="maturityDate" 
                value={formData.maturityDate} 
                onChange={handleChange}
              />
              <small>Date when the note becomes due if not converted</small>
            </div>
            
            <div className="tip-box">
              <strong>Tip:</strong> The interest rate applies until the note converts or is repaid. Setting a maturity date that is too short may force repayment or conversion before your company is ready for its next financing round.
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2>Conversion Terms</h2>
            <div className="form-group">
              <label htmlFor="valuationCap">Valuation Cap ($):</label>
              <input 
                type="number" 
                id="valuationCap" 
                name="valuationCap" 
                value={formData.valuationCap} 
                onChange={handleChange} 
                placeholder="Enter valuation cap"
                min="0"
                step="500000"
              />
              <small>Maximum company valuation for conversion purposes</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="discountRate">Discount Rate (%):</label>
              <input 
                type="number" 
                id="discountRate" 
                name="discountRate" 
                value={formData.discountRate} 
                onChange={handleChange} 
                placeholder="Enter discount rate"
                min="0"
                max="50"
                step="1"
              />
              <small>Typical range: 15-25%</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="qualifyingFinancingAmount">Qualifying Financing Amount ($):</label>
              <input 
                type="number" 
                id="qualifyingFinancingAmount" 
                name="qualifyingFinancingAmount" 
                value={formData.qualifyingFinancingAmount} 
                onChange={handleChange} 
                placeholder="Enter qualifying amount"
                min="0"
                step="100000"
              />
              <small>Minimum funding round size to trigger automatic conversion</small>
            </div>
            
            <div className="tip-box">
              <strong>Tip:</strong> The investor gets the better of either (1) the valuation cap or (2) the discount rate when converting in a qualifying financing. The qualifying financing amount should be set to ensure conversion happens at a substantial funding round.
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h2>Advanced Terms</h2>
            <div className="form-group">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="hasMFN" 
                  name="hasMFN" 
                  checked={formData.hasMFN} 
                  onChange={handleChange}
                />
                <label htmlFor="hasMFN">Include Most Favored Nation (MFN) Clause</label>
              </div>
              <small>Ensures this investor gets the best terms offered to other investors</small>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="hasProRataRights" 
                  name="hasProRataRights" 
                  checked={formData.hasProRataRights} 
                  onChange={handleChange}
                />
                <label htmlFor="hasProRataRights">Include Pro-rata Rights</label>
              </div>
              <small>Allows investor to maintain ownership percentage in future rounds</small>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="hasInformationRights" 
                  name="hasInformationRights" 
                  checked={formData.hasInformationRights} 
                  onChange={handleChange}
                />
                <label htmlFor="hasInformationRights">Include Information Rights</label>
              </div>
              <small>Entitles investor to receive financial statements and updates</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="prepaymentOption">Prepayment Terms:</label>
              <select 
                id="prepaymentOption" 
                name="prepaymentOption" 
                value={formData.prepaymentOption} 
                onChange={handleChange}
              >
                <option value="with_consent">No prepayment without investor consent</option>
                <option value="not_allowed">No prepayment allowed</option>
                <option value="with_notice">Prepayment allowed with notice</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="conversionMultiple">Change of Control Multiple:</label>
              <select 
                id="conversionMultiple" 
                name="conversionMultiple" 
                value={formData.conversionMultiple} 
                onChange={handleChange}
              >
                <option value="1">1x (No premium)</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
                <option value="2.5">2.5x</option>
                <option value="3">3x</option>
              </select>
              <small>Multiple applied to principal + interest if company is acquired</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="governingLawState">Governing Law State:</label>
              <select 
                id="governingLawState" 
                name="governingLawState" 
                value={formData.governingLawState || formData.companyState} 
                onChange={handleChange}
              >
                <option value="">Same as Company State</option>
                <option value="California">California</option>
                <option value="Delaware">Delaware</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="Illinois">Illinois</option>
                <option value="Massachusetts">Massachusetts</option>
              </select>
            </div>
            
            <div className="tip-box">
              <strong>Tip:</strong> MFN clauses protect early investors by ensuring they get the best terms offered to later investors. Pro-rata rights are valuable for investors who want to maintain their ownership percentage in future rounds.
            </div>
          </>
        );
        
      case 4:
        const risks = assessRisks();
        return (
          <>
            <h2>Finalize & Review</h2>
            
            <h3>Document Settings</h3>
            <div className="form-group">
              <label htmlFor="documentTitle">Document Title:</label>
              <input 
                type="text" 
                id="documentTitle" 
                name="documentTitle" 
                value={formData.documentTitle} 
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fileName">File Name (for download):</label>
              <input 
                type="text" 
                id="fileName" 
                name="fileName" 
                value={formData.fileName} 
                onChange={handleChange}
              />
            </div>
            
            <h3>Risk Assessment</h3>
            {risks.map((risk, index) => (
              <div key={index} className={`risk-assessment risk-${risk.level}`}>
                <h4>{risk.level === 'high' ? '⚠️ High Risk' : risk.level === 'medium' ? '⚠️ Medium Risk' : '⚠️ Low Risk'}</h4>
                <p><strong>Issue:</strong> {risk.message}</p>
                <p><strong>Solution:</strong> {risk.solution}</p>
              </div>
            ))}
            
            <div className="tip-box">
              <h4>Convertible Note Key Points:</h4>
              <p>• A convertible note is a form of short-term debt that converts into equity upon specific triggering events.</p>
              <p>• The valuation cap and discount rate are the two primary mechanisms that provide the investor with upside.</p>
              <p>• The maturity date serves as a deadline for either conversion or repayment.</p>
              <p>• Always consult with a lawyer before finalizing any investment agreement.</p>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  // Main render
  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>Convertible Note Generator</h1>
        <p>Create a customized convertible promissory note for early-stage startup funding.</p>
      </div>
      
      {/* Tab Navigation */}
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
      
      <div className="generator-content">
        {/* Left Panel - Form Fields */}
        <div className="form-panel">
          {renderTabContent()}
        </div>
        
        {/* Right Panel - Live Preview */}
        <div className="preview-panel" ref={previewRef}>
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: createHighlightedText() }}
            />
          </div>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
          disabled={currentTab === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Previous
        </button>
        
        <button
          onClick={copyToClipboard}
          className="nav-button"
          style={{
            backgroundColor: "#4f46e5", 
            color: "white",
            border: "none"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy to Clipboard
        </button>
        
        <button
          onClick={downloadAsWord}
          className="nav-button"
          style={{
            backgroundColor: "#2563eb", 
            color: "white",
            border: "none"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Download MS Word
        </button>
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Render the app
ReactDOM.render(<ConvertibleNoteGenerator />, document.getElementById('root'));