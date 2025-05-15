// convertible-note-generator.js
const { useState, useEffect, useRef } = React;

const ConvertibleNoteGenerator = () => {
  // Tabs configuration
  const tabs = [
    { id: 'company', label: 'Company & Investor' },
    { id: 'terms', label: 'Note Terms' },
    { id: 'additional', label: 'Additional Terms' },
    { id: 'review', label: 'Review & Generate' }
  ];

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    companyAddress: '',
    stateOfIncorporation: 'Delaware',
    companyRepName: '',
    companyRepTitle: '',
    
    // Investor Information
    investorName: '',
    investorAddress: '',
    investorType: 'individual',
    
    // Note Terms
    principalAmount: '',
    interestRate: '5',
    maturityDate: '',
    qualifiedFinancingThreshold: '1000000',
    valuationCap: '5000000',
    discountRate: '20',
    conversionMechanism: 'automatic',
    conversionPriceOption: 'lower',
    
    // Additional Terms
    prepaymentRights: 'no',
    amendmentProvisions: 'majority',
    governingLaw: 'Delaware',
    subordination: 'yes',
    mfnClause: 'yes',
    acceleration: 'yes',
    
    // Signature
    signatureDate: new Date().toISOString().split('T')[0]
  });

  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // State for document text
  const [documentText, setDocumentText] = useState('');
  
  // Ref for preview content div
  const previewRef = useRef(null);

  // State to track highlighted text spans in the document
  const [highlightedText, setHighlightedText] = useState('');

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

  // Format currency values
  const formatCurrency = (amount) => {
    if (!amount) return '';
    
    // Remove any non-digit characters
    const cleanAmount = amount.toString().replace(/[^0-9.]/g, '');
    
    // Format with commas
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cleanAmount);
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate the document text
  useEffect(() => {
    if (!formData.companyName) {
      setDocumentText('Please fill out the company name to generate the document.');
      return;
    }

    const text = `
CONVERTIBLE PROMISSORY NOTE

$${formData.principalAmount ? parseInt(formData.principalAmount).toLocaleString() : "[PRINCIPAL AMOUNT]"}

THIS CONVERTIBLE PROMISSORY NOTE (this "Note") is made as of ${formatDate(formData.signatureDate)} (the "Effective Date"), by ${formData.companyName} (the "Company"), a ${formData.stateOfIncorporation} corporation with its principal office at ${formData.companyAddress}, for the benefit of ${formData.investorName} (the "Investor").

FOR VALUE RECEIVED, the Company hereby promises to pay to the order of the Investor the principal sum of $${formData.principalAmount ? parseInt(formData.principalAmount).toLocaleString() : "[PRINCIPAL AMOUNT]"} together with accrued and unpaid interest thereon, each due and payable on the date and in the manner set forth below.

1. INTEREST RATE. Simple interest shall accrue on this Note at the rate of ${formData.interestRate}% per annum, calculated on the basis of a 365-day year, commencing on the date hereof and continuing until repayment of this Note in full.

2. MATURITY DATE. The principal amount and all unpaid accrued interest shall be due and payable on ${formatDate(formData.maturityDate)} (the "Maturity Date"), unless this Note is converted prior to such date in accordance with Section 3 below.

3. CONVERSION.

   3.1 Qualified Financing Conversion. If the Company issues and sells shares of its equity securities (the "Equity Securities") to investors in a bona fide equity financing with total proceeds to the Company of not less than $${formData.qualifiedFinancingThreshold ? parseInt(formData.qualifiedFinancingThreshold).toLocaleString() : "[THRESHOLD AMOUNT]"} (excluding the conversion of this Note and other similar convertible securities) (a "Qualified Financing"), then ${formData.conversionMechanism === 'automatic' ? 'all principal and unpaid accrued interest then outstanding under this Note shall automatically convert' : 'the Investor shall have the option to convert all principal and unpaid accrued interest then outstanding under this Note'} into Equity Securities.

   3.2 Conversion Price. The conversion price for the Equity Securities shall be equal to ${formData.conversionPriceOption === 'cap' ? `the Valuation Cap Price` : formData.conversionPriceOption === 'discount' ? `the Discount Price` : `the lower of (i) the Valuation Cap Price or (ii) the Discount Price`}. The "Valuation Cap Price" means the price per share equal to $${formData.valuationCap ? parseInt(formData.valuationCap).toLocaleString() : "[VALUATION CAP]"} divided by the Company's fully-diluted capitalization immediately prior to the Qualified Financing. The "Discount Price" means the price per share paid by other purchasers of Equity Securities in the Qualified Financing multiplied by ${(100 - parseInt(formData.discountRate || 0)) / 100} (representing a ${formData.discountRate}% discount to the Qualified Financing price).

   3.3 Conversion Mechanics. The Investor shall become a party to the transaction documents for the Qualified Financing by execution of such documents normally required of investors in the Qualified Financing.

4. PREPAYMENT. This Note ${formData.prepaymentRights === 'yes' ? 'may' : 'may not'} be prepaid at any time ${formData.prepaymentRights === 'yes' ? 'with the written consent of the Investor' : ''}.

5. DEFAULT. The occurrence of any of the following shall constitute an "Event of Default" under this Note:

   5.1 Failure to Pay. The Company shall fail to pay when due any principal or interest payment on the date due hereunder, and such payment shall not have been made within ten (10) days of the date due.

   5.2 Voluntary Bankruptcy or Insolvency Proceedings. The Company shall (i) apply for or consent to the appointment of a receiver, trustee, liquidator or custodian of itself or of all or a substantial part of its property, (ii) make a general assignment for the benefit of its creditors, or (iii) commence a voluntary case or other proceeding seeking liquidation, reorganization or other relief with respect to itself or its debts.

   5.3 Involuntary Bankruptcy or Insolvency Proceedings. A proceeding shall have been instituted in a court having jurisdiction seeking (i) an order for relief, reorganization, arrangement, liquidation, dissolution or similar relief with respect to the Company or its debts under any bankruptcy or insolvency law, or (ii) the appointment of a receiver, trustee, liquidator or custodian of the Company or all or a substantial part of its property, and either such proceeding shall remain undismissed or unstayed for a period of 60 days.

6. REMEDIES. Upon the occurrence of an Event of Default, the Investor, at its option, may (i) upon written notice to the Company, accelerate and demand payment of all or any part of the unpaid principal amount of the Note, together with the unpaid interest accrued thereon and all other amounts owing hereunder, and upon the Company's receipt of such notice, such amounts shall be immediately due and payable, and/or (ii) pursue any other remedy available to the Investor at law or in equity.

${formData.acceleration === 'yes' ? `7. ACCELERATION. If the Company consummates a Change of Control (as defined below) prior to the Maturity Date or a Qualified Financing, then all principal and unpaid interest under this Note shall automatically become immediately due and payable. A "Change of Control" means (i) a consolidation or merger of the Company with or into any other corporation or other entity or person, or any other corporate reorganization, other than any such consolidation, merger or reorganization in which the shares of capital stock of the Company immediately prior to such consolidation, merger or reorganization continue to represent a majority of the voting power of the surviving entity immediately after such consolidation, merger or reorganization; (ii) any transaction or series of related transactions to which the Company is a party in which in excess of 50% of the Company's voting power is transferred; or (iii) the sale, lease, transfer, exclusive license or other disposition by the Company of all or substantially all of the assets of the Company.` : ''}

${formData.subordination === 'yes' ? `8. SUBORDINATION. The indebtedness evidenced by this Note is hereby expressly subordinated in right of payment to the prior payment in full of all of the Company's Senior Indebtedness. "Senior Indebtedness" shall mean, unless expressly subordinated to or made on a parity with the amounts due under this Note, all amounts due in connection with (i) indebtedness of the Company to banks or other lending institutions regularly engaged in the business of lending money, and (ii) any such indebtedness or any debentures, notes or other evidence of indebtedness issued in exchange for or to refinance such Senior Indebtedness.` : ''}

${formData.mfnClause === 'yes' ? `9. MOST FAVORED NATION. If, at any time prior to the earlier of the Maturity Date and a Qualified Financing, the Company issues convertible notes to other investors (excluding the Investor) on terms and conditions which are more favorable to such investors than the terms and conditions provided to the Investor herein, the Company will promptly amend this Note to reflect such more favorable terms.` : ''}

10. GENERAL PROVISIONS.

    10.1 Successors and Assigns. This Note may be assigned by the Investor to any party with the prior written consent of the Company. The Company may not assign or delegate this Note without the prior written consent of the Investor.

    10.2 Governing Law. This Note shall be governed by and construed under the laws of the State of ${formData.governingLaw} as applied to agreements among ${formData.governingLaw} residents, made and to be performed entirely within the State of ${formData.governingLaw}, without giving effect to conflicts of laws principles.

    10.3 Notices. Any notice required or permitted by this Note shall be in writing and shall be deemed sufficient when delivered personally or by overnight courier or sent by email or fax, or 48 hours after being deposited in the U.S. mail as certified or registered mail with postage prepaid, addressed to the party to be notified at such party's address or fax number as set forth below or as subsequently modified by written notice.

    10.4 Amendments and Waivers. Any term of this Note may be amended or waived only with the written consent of the Company and ${formData.amendmentProvisions === 'majority' ? 'the holders of a majority in interest of all convertible promissory notes of the same series as this Note' : 'the Investor'}. Any amendment or waiver effected in accordance with this Section shall be binding upon the Company, the Investor and each transferee of the Note.

    10.5 Entire Agreement. This Note constitutes the entire agreement between the parties hereto pertaining to the subject matter hereof, and any and all other written or oral agreements existing between the parties hereto are expressly canceled.

IN WITNESS WHEREOF, the Company has executed this Convertible Promissory Note as of the date first written above.

COMPANY:
${formData.companyName.toUpperCase()}

By: _______________________________
    ${formData.companyRepName}
    ${formData.companyRepTitle}

Address: ${formData.companyAddress}

ACKNOWLEDGED AND AGREED:

INVESTOR:
${formData.investorType === 'individual' ? formData.investorName.toUpperCase() : `${formData.investorName.toUpperCase()}\n\nBy: _______________________________\n    Name: \n    Title: `}

Address: ${formData.investorAddress}
`;

    setDocumentText(text);
  }, [formData]);

  // Function to determine which section to highlight based on the last changed field
  const getHighlightedText = () => {
    if (!lastChanged || !documentText) return documentText;

    let newText = documentText;
    
    // Define patterns to highlight based on which field was changed
    const highlightPatterns = {
      // Company Info
      companyName: new RegExp(`${formData.companyName}`, 'g'),
      companyAddress: new RegExp(`${formData.companyAddress}`, 'g'),
      stateOfIncorporation: new RegExp(`${formData.stateOfIncorporation} corporation`, 'g'),
      companyRepName: new RegExp(`${formData.companyRepName}`, 'g'),
      companyRepTitle: new RegExp(`${formData.companyRepTitle}`, 'g'),
      
      // Investor Info
      investorName: new RegExp(`${formData.investorName}`, 'g'),
      investorAddress: new RegExp(`${formData.investorAddress}`, 'g'),
      
      // Note Terms
      principalAmount: new RegExp(`\\$${parseInt(formData.principalAmount || '0').toLocaleString()}`, 'g'),
      interestRate: new RegExp(`${formData.interestRate}%`, 'g'),
      maturityDate: new RegExp(`${formatDate(formData.maturityDate)}`, 'g'),
      qualifiedFinancingThreshold: new RegExp(`\\$${parseInt(formData.qualifiedFinancingThreshold || '0').toLocaleString()}`, 'g'),
      valuationCap: new RegExp(`\\$${parseInt(formData.valuationCap || '0').toLocaleString()}`, 'g'),
      discountRate: new RegExp(`${formData.discountRate}%`, 'g'),
      conversionMechanism: formData.conversionMechanism === 'automatic' 
        ? /all principal and unpaid accrued interest then outstanding under this Note shall automatically convert/g
        : /the Investor shall have the option to convert all principal and unpaid accrued interest then outstanding under this Note/g,
      conversionPriceOption: formData.conversionPriceOption === 'cap'
        ? /the Valuation Cap Price/g 
        : formData.conversionPriceOption === 'discount'
        ? /the Discount Price/g 
        : /the lower of \(i\) the Valuation Cap Price or \(ii\) the Discount Price/g,
      
      // Additional Terms
      prepaymentRights: formData.prepaymentRights === 'yes' 
        ? /may be prepaid at any time with the written consent of the Investor/g
        : /may not be prepaid at any time/g,
      amendmentProvisions: formData.amendmentProvisions === 'majority'
        ? /the holders of a majority in interest of all convertible promissory notes of the same series as this Note/g
        : /the Investor/g,
      governingLaw: new RegExp(`the State of ${formData.governingLaw}`, 'g'),
      
      // Signature Date
      signatureDate: new RegExp(`${formatDate(formData.signatureDate)}`, 'g')
    };
    
    // Apply highlighting to the relevant pattern
    if (highlightPatterns[lastChanged] && formData[lastChanged]) {
      newText = documentText.replace(
        highlightPatterns[lastChanged], 
        match => `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return newText;
  };

  // Update highlighted text when document or lastChanged changes
  useEffect(() => {
    setHighlightedText(getHighlightedText());
  }, [documentText, lastChanged]);

  // Scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

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

  // Copy document to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert('Document copied to clipboard');
    } catch (error) {
      console.error('Failed to copy: ', error);
      alert('Failed to copy document. Please try again.');
    }
  };

  // Download MS Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        companyName: formData.companyName || "Convertible-Note"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Render forms for each tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <div className="tab-content">
            <h2>Company & Investor Information</h2>
            
            <h3>Company Information</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="form-input"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Acme Technologies, Inc."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="companyAddress">Company Address</label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                className="form-input"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street, Suite 200, San Francisco, CA 94107"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="stateOfIncorporation">State of Incorporation</label>
              <select
                id="stateOfIncorporation"
                name="stateOfIncorporation"
                className="form-select"
                value={formData.stateOfIncorporation}
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
              <label className="form-label" htmlFor="companyRepName">Company Representative Name</label>
              <input
                type="text"
                id="companyRepName"
                name="companyRepName"
                className="form-input"
                value={formData.companyRepName}
                onChange={handleChange}
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="companyRepTitle">Company Representative Title</label>
              <input
                type="text"
                id="companyRepTitle"
                name="companyRepTitle"
                className="form-input"
                value={formData.companyRepTitle}
                onChange={handleChange}
                placeholder="e.g., Chief Executive Officer"
              />
            </div>
            
            <h3>Investor Information</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="investorName">Investor Name</label>
              <input
                type="text"
                id="investorName"
                name="investorName"
                className="form-input"
                value={formData.investorName}
                onChange={handleChange}
                placeholder="e.g., Jane Doe or XYZ Ventures, LLC"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="investorAddress">Investor Address</label>
              <input
                type="text"
                id="investorAddress"
                name="investorAddress"
                className="form-input"
                value={formData.investorAddress}
                onChange={handleChange}
                placeholder="e.g., 456 Venture Way, Menlo Park, CA 94025"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Investor Type</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="investorTypeIndividual"
                    name="investorType"
                    className="form-radio"
                    value="individual"
                    checked={formData.investorType === 'individual'}
                    onChange={handleChange}
                  />
                  <label htmlFor="investorTypeIndividual">Individual</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="investorTypeEntity"
                    name="investorType"
                    className="form-radio"
                    value="entity"
                    checked={formData.investorType === 'entity'}
                    onChange={handleChange}
                  />
                  <label htmlFor="investorTypeEntity">Legal Entity</label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="tab-content">
            <h2>Note Terms</h2>
            
            <div className="form-group">
              <label className="form-label" htmlFor="principalAmount">Principal Amount</label>
              <div className="currency-input">
                <span className="currency-symbol">$</span>
                <input
                  type="text"
                  id="principalAmount"
                  name="principalAmount"
                  className="form-input"
                  value={formData.principalAmount}
                  onChange={handleChange}
                  placeholder="e.g., 100000"
                />
              </div>
              <p className="helper-text">The amount being loaned through this convertible note.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="interestRate">Interest Rate</label>
              <div className="percentage-input">
                <input
                  type="text"
                  id="interestRate"
                  name="interestRate"
                  className="form-input"
                  value={formData.interestRate}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                />
                <span className="percentage-symbol">%</span>
              </div>
              <p className="helper-text">The annual interest rate applied to the principal amount.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="maturityDate">Maturity Date</label>
              <input
                type="date"
                id="maturityDate"
                name="maturityDate"
                className="form-input"
                value={formData.maturityDate}
                onChange={handleChange}
              />
              <p className="helper-text">The date when the note becomes due if not converted.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="qualifiedFinancingThreshold">Qualified Financing Threshold</label>
              <div className="currency-input">
                <span className="currency-symbol">$</span>
                <input
                  type="text"
                  id="qualifiedFinancingThreshold"
                  name="qualifiedFinancingThreshold"
                  className="form-input"
                  value={formData.qualifiedFinancingThreshold}
                  onChange={handleChange}
                  placeholder="e.g., 1000000"
                />
              </div>
              <p className="helper-text">The minimum amount of new money raised in an equity financing that triggers conversion.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="valuationCap">Valuation Cap</label>
              <div className="currency-input">
                <span className="currency-symbol">$</span>
                <input
                  type="text"
                  id="valuationCap"
                  name="valuationCap"
                  className="form-input"
                  value={formData.valuationCap}
                  onChange={handleChange}
                  placeholder="e.g., 5000000"
                />
              </div>
              <p className="helper-text">The maximum company valuation used to determine conversion price, regardless of actual valuation.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="discountRate">Discount Rate</label>
              <div className="percentage-input">
                <input
                  type="text"
                  id="discountRate"
                  name="discountRate"
                  className="form-input"
                  value={formData.discountRate}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                />
                <span className="percentage-symbol">%</span>
              </div>
              <p className="helper-text">The percentage discount the investor receives on the price per share in a qualified financing.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Conversion Mechanism</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="conversionMechanismAuto"
                    name="conversionMechanism"
                    className="form-radio"
                    value="automatic"
                    checked={formData.conversionMechanism === 'automatic'}
                    onChange={handleChange}
                  />
                  <label htmlFor="conversionMechanismAuto">Automatic</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="conversionMechanismOption"
                    name="conversionMechanism"
                    className="form-radio"
                    value="optional"
                    checked={formData.conversionMechanism === 'optional'}
                    onChange={handleChange}
                  />
                  <label htmlFor="conversionMechanismOption">Optional</label>
                </div>
              </div>
              <p className="helper-text">Determines whether conversion happens automatically or at the investor's option.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Conversion Price Option</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="conversionPriceOptionCap"
                    name="conversionPriceOption"
                    className="form-radio"
                    value="cap"
                    checked={formData.conversionPriceOption === 'cap'}
                    onChange={handleChange}
                  />
                  <label htmlFor="conversionPriceOptionCap">Valuation Cap Only</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="conversionPriceOptionDiscount"
                    name="conversionPriceOption"
                    className="form-radio"
                    value="discount"
                    checked={formData.conversionPriceOption === 'discount'}
                    onChange={handleChange}
                  />
                  <label htmlFor="conversionPriceOptionDiscount">Discount Only</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="conversionPriceOptionLower"
                    name="conversionPriceOption"
                    className="form-radio"
                    value="lower"
                    checked={formData.conversionPriceOption === 'lower'}
                    onChange={handleChange}
                  />
                  <label htmlFor="conversionPriceOptionLower">Lower of Both</label>
                </div>
              </div>
              <p className="helper-text">Determines which method is used to calculate the conversion price.</p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="tab-content">
            <h2>Additional Terms</h2>
            
            <div className="form-group">
              <label className="form-label">Prepayment Rights</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="prepaymentRightsYes"
                    name="prepaymentRights"
                    className="form-radio"
                    value="yes"
                    checked={formData.prepaymentRights === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="prepaymentRightsYes">Yes (with investor consent)</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="prepaymentRightsNo"
                    name="prepaymentRights"
                    className="form-radio"
                    value="no"
                    checked={formData.prepaymentRights === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="prepaymentRightsNo">No</label>
                </div>
              </div>
              <p className="helper-text">Determines whether the company can pay back the note before maturity.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Amendment Provisions</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="amendmentProvisionsMajority"
                    name="amendmentProvisions"
                    className="form-radio"
                    value="majority"
                    checked={formData.amendmentProvisions === 'majority'}
                    onChange={handleChange}
                  />
                  <label htmlFor="amendmentProvisionsMajority">Majority Note Holders</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="amendmentProvisionsInvestor"
                    name="amendmentProvisions"
                    className="form-radio"
                    value="investor"
                    checked={formData.amendmentProvisions === 'investor'}
                    onChange={handleChange}
                  />
                  <label htmlFor="amendmentProvisionsInvestor">This Investor Only</label>
                </div>
              </div>
              <p className="helper-text">Determines who needs to consent to amendments to the note.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="governingLaw">Governing Law</label>
              <select
                id="governingLaw"
                name="governingLaw"
                className="form-select"
                value={formData.governingLaw}
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
              <p className="helper-text">The state law that governs the interpretation of the note.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Subordination</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="subordinationYes"
                    name="subordination"
                    className="form-radio"
                    value="yes"
                    checked={formData.subordination === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="subordinationYes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="subordinationNo"
                    name="subordination"
                    className="form-radio"
                    value="no"
                    checked={formData.subordination === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="subordinationNo">No</label>
                </div>
              </div>
              <p className="helper-text">Determines whether this note is subordinate to other company debt.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Most Favored Nation (MFN) Clause</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="mfnClauseYes"
                    name="mfnClause"
                    className="form-radio"
                    value="yes"
                    checked={formData.mfnClause === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="mfnClauseYes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="mfnClauseNo"
                    name="mfnClause"
                    className="form-radio"
                    value="no"
                    checked={formData.mfnClause === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="mfnClauseNo">No</label>
                </div>
              </div>
              <p className="helper-text">If included, ensures the investor gets the best terms offered to any other note holder.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Acceleration on Change of Control</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="accelerationYes"
                    name="acceleration"
                    className="form-radio"
                    value="yes"
                    checked={formData.acceleration === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="accelerationYes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="accelerationNo"
                    name="acceleration"
                    className="form-radio"
                    value="no"
                    checked={formData.acceleration === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="accelerationNo">No</label>
                </div>
              </div>
              <p className="helper-text">If included, the note immediately becomes due if the company is acquired.</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="signatureDate">Signature Date</label>
              <input
                type="date"
                id="signatureDate"
                name="signatureDate"
                className="form-input"
                value={formData.signatureDate}
                onChange={handleChange}
              />
              <p className="helper-text">The date when this convertible note is signed.</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="tab-content">
            <h2>Review & Generate</h2>
            <p>Review the information below and make any necessary changes before generating your convertible note.</p>
            
            <h3>Company & Investor Information</h3>
            <div className="form-group">
              <label className="form-label">Company Name:</label>
              <p>{formData.companyName || "[Not provided]"}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Company Address:</label>
              <p>{formData.companyAddress || "[Not provided]"}</p>
            </div>
            <div className="form-group">
              <label className="form-label">State of Incorporation:</label>
              <p>{formData.stateOfIncorporation}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Company Representative:</label>
              <p>{formData.companyRepName || "[Not provided]"}, {formData.companyRepTitle || "[Not provided]"}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Investor:</label>
              <p>{formData.investorName || "[Not provided]"} ({formData.investorType === 'individual' ? 'Individual' : 'Entity'})</p>
            </div>
            <div className="form-group">
              <label className="form-label">Investor Address:</label>
              <p>{formData.investorAddress || "[Not provided]"}</p>
            </div>
            
            <h3>Note Terms</h3>
            <div className="form-group">
              <label className="form-label">Principal Amount:</label>
              <p>{formData.principalAmount ? formatCurrency(formData.principalAmount) : "[Not provided]"}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Interest Rate:</label>
              <p>{formData.interestRate}%</p>
            </div>
            <div className="form-group">
              <label className="form-label">Maturity Date:</label>
              <p>{formData.maturityDate ? formatDate(formData.maturityDate) : "[Not provided]"}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Qualified Financing Threshold:</label>
              <p>{formData.qualifiedFinancingThreshold ? formatCurrency(formData.qualifiedFinancingThreshold) : "[Not provided]"}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Valuation Cap:</label>
              <p>{formData.valuationCap ? formatCurrency(formData.valuationCap) : "[Not provided]"}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Discount Rate:</label>
              <p>{formData.discountRate}%</p>
            </div>
            <div className="form-group">
              <label className="form-label">Conversion Mechanism:</label>
              <p>{formData.conversionMechanism === 'automatic' ? 'Automatic' : 'Optional'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Conversion Price Option:</label>
              <p>
                {formData.conversionPriceOption === 'cap' 
                  ? 'Valuation Cap Only' 
                  : formData.conversionPriceOption === 'discount' 
                    ? 'Discount Only' 
                    : 'Lower of Both'}
              </p>
            </div>
            
            <h3>Additional Terms</h3>
            <div className="form-group">
              <label className="form-label">Prepayment Rights:</label>
              <p>{formData.prepaymentRights === 'yes' ? 'Yes (with investor consent)' : 'No'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Amendment Provisions:</label>
              <p>{formData.amendmentProvisions === 'majority' ? 'Majority Note Holders' : 'This Investor Only'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Governing Law:</label>
              <p>{formData.governingLaw}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Subordination:</label>
              <p>{formData.subordination === 'yes' ? 'Yes' : 'No'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Most Favored Nation (MFN) Clause:</label>
              <p>{formData.mfnClause === 'yes' ? 'Yes' : 'No'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Acceleration on Change of Control:</label>
              <p>{formData.acceleration === 'yes' ? 'Yes' : 'No'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Signature Date:</label>
              <p>{formData.signatureDate ? formatDate(formData.signatureDate) : "[Not provided]"}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const Icon = ({ name, ...props }) => {
    useEffect(() => {
      if (window.feather) {
        window.feather.replace();
      }
    }, []);
    
    return <i data-feather={name} {...props}></i>;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Convertible Note Generator</h1>
        <p>Create a customized convertible promissory note with flexible terms for your startup or investment needs.</p>
      </div>
      
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
      
      <div className="generator-layout">
        <div className="form-panel">
          {renderTabContent()}
          
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <Icon name="chevron-left" style={{marginRight: "0.25rem"}} />
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
              <Icon name="copy" style={{marginRight: "0.25rem"}} />
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
        
        <div className="preview-panel">
          <div className="preview-content" ref={previewRef}>
            <h2>Live Preview</h2>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p>Need legal assistance with your convertible note or funding strategy?</p>
        <a href="" onClick={() => Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;} style={{
          display: "inline-block", 
          margin: "1rem auto",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#4f46e5",
          color: "white",
          borderRadius: "0.375rem",
          textDecoration: "none",
          fontWeight: "500"
        }}>Schedule time with me</a>
      </div>
    </div>
  );
};

// Render the App component to the DOM
ReactDOM.render(<ConvertibleNoteGenerator />, document.getElementById('root'));