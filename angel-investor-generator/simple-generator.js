// Angel Investor Generator - Complete Fixed Version
const AngelInvestorGenerator = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
    startupName: 'Acme Innovations, Inc.',
    startupState: 'Delaware',
    startupAddress: '123 Startup Way, San Francisco, CA 94105',
    founderName: 'Jane Smith',
    investorName: 'John Doe',
    investorAddress: '456 Angel Lane, Palo Alto, CA 94301',
    investmentAmount: '100000',
    equityPercentage: '10',
    premoneyValuation: '900000',
    valuationCap: '',
    discountRate: '',
    securitiesType: 'common',
    vestingPeriod: '4',
    cliffPeriod: '1',
    boardRepresentation: 'observer',
    antiDilution: 'weighted_average',
    liquidationPreference: 'participating',
    dividendRights: 'none',
    informationRights: 'standard',
    tagAlong: true,
    dragAlong: true,
    rightOfFirstRefusal: true,
    confidentialityPeriod: '5',
    governingLaw: 'California',
    disputeResolution: 'arbitration',
    signatureDate: new Date().toISOString().split('T')[0]
  });

  const [isPaid, setIsPaid] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [lastChanged, setLastChanged] = React.useState(null);
  const previewRef = React.useRef(null);

  const FORM_DATA_KEY = "angel_investor_form_data";
  const PAID_STATUS_KEY = "angel_investor_paid";

  // All 50 US states
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // Function to format date to readable format
  const formatDateToReadable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Check payment status on load
  React.useEffect(() => {
    const savedPaidStatus = localStorage.getItem(PAID_STATUS_KEY);
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('payment') === 'success' || savedPaidStatus === 'true') {
      setIsPaid(true);
      setShowSuccessModal(urlParams.get('payment') === 'success');
    }

    // Restore form data
    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  }, []);

  // Save form data when it changes
  React.useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  }, [formData]);

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'investment', label: 'Investment Terms' },
    { id: 'equity', label: 'Equity & Control' },
    { id: 'rights', label: 'Rights & Protections' },
    { id: 'legal', label: 'Legal Terms' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  const handleUnlock = () => {
    setIsPaid(true);
    localStorage.setItem(PAID_STATUS_KEY, 'true');
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  };

  const handleTransactionUnlock = () => {
    const transactionId = document.getElementById('transactionId').value.trim();
    if (transactionId && transactionId.length > 8) {
      handleUnlock();
      setShowSuccessModal(true);
    } else {
      alert('Please enter a valid PayPal transaction ID');
    }
  };

  const resetForm = () => {
    setFormData({
      startupName: '',
      startupState: 'Delaware',
      startupAddress: '',
      founderName: '',
      investorName: '',
      investorAddress: '',
      investmentAmount: '',
      equityPercentage: '',
      premoneyValuation: '',
      valuationCap: '',
      discountRate: '',
      securitiesType: 'common',
      vestingPeriod: '4',
      cliffPeriod: '1',
      boardRepresentation: 'none',
      antiDilution: 'weighted_average',
      liquidationPreference: 'participating',
      dividendRights: 'none',
      informationRights: 'standard',
      tagAlong: true,
      dragAlong: true,
      rightOfFirstRefusal: true,
      confidentialityPeriod: '5',
      governingLaw: 'California',
      disputeResolution: 'arbitration',
      signatureDate: new Date().toISOString().split('T')[0]
    });
    localStorage.removeItem(FORM_DATA_KEY);
  };

  const copyToClipboard = async () => {
    if (!isPaid) {
      alert('Please purchase the agreement to enable copying.');
      return;
    }
    
    try {
      const documentText = generateDocumentText();
      await navigator.clipboard.writeText(documentText);
      alert('Agreement copied to clipboard!');
    } catch (err) {
      alert('Failed to copy. Please try again.');
    }
  };
  // Generate the complete document text
  const generateDocumentText = () => {
    const postmoneyValuation = formData.premoneyValuation ? 
      parseInt(formData.premoneyValuation) + parseInt(formData.investmentAmount || 0) : 
      'TBD';

    const readableDate = formatDateToReadable(formData.signatureDate);

    return `ANGEL INVESTOR AGREEMENT

This Angel Investor Agreement (this "Agreement") is made and entered into as of ${readableDate}, by and between ${formData.startupName}, a ${formData.startupState} corporation (the "Company"), and ${formData.investorName}, an individual (the "Investor").

RECITALS

WHEREAS, the Company is engaged in the business of developing and commercializing innovative technology solutions; and

WHEREAS, the Investor desires to invest in the Company and the Company desires to accept such investment, subject to the terms and conditions set forth herein; and

WHEREAS, the parties wish to set forth their respective rights and obligations in connection with the Investor's investment in the Company.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. INVESTMENT TERMS

a) Investment Amount and Consideration. The Investor agrees to purchase ${formData.equityPercentage}% of the outstanding shares of ${formData.securitiesType} stock of the Company for a total investment of $${parseInt(formData.investmentAmount || 0).toLocaleString()}. This investment values the Company at a pre-money valuation of $${parseInt(formData.premoneyValuation || 0).toLocaleString()} and a post-money valuation of $${postmoneyValuation.toLocaleString ? postmoneyValuation.toLocaleString() : postmoneyValuation}.

b) Securities to be Issued. In exchange for the investment amount, the Company shall issue to the Investor shares of ${formData.securitiesType} stock, representing ${formData.equityPercentage}% of the fully diluted shares of the Company on a post-closing basis.

c) Use of Investment Proceeds. The Company shall use the investment proceeds for general corporate purposes, including but not limited to product development, marketing, and working capital needs.

d) Additional Investment Rights. The Investor shall have the right to participate in future financing rounds of the Company on a pro rata basis.

2. EQUITY AND GOVERNANCE RIGHTS

a) Voting Rights. The Investor shall have voting rights commensurate with their ownership percentage in the Company.

b) Board of Directors. ${formData.boardRepresentation === 'board_seat' ? 
  `The Investor shall be entitled to designate one member to the Company's Board of Directors.` : 
  formData.boardRepresentation === 'observer' ?
  `The Investor shall have the right to designate a board observer who may attend all board meetings and receive all board materials.` :
  `The Investor shall not have board representation or observer rights under this Agreement.`}

c) Anti-Dilution Protection. ${formData.antiDilution === 'weighted_average' ? 
  `The Investor shall be protected against dilution through weighted average anti-dilution provisions.` :
  formData.antiDilution === 'full_ratchet' ?
  `The Investor shall be protected against dilution through full ratchet anti-dilution provisions.` :
  `The Investor shall not receive anti-dilution protection under this Agreement.`}

d) Liquidation Preferences. ${formData.liquidationPreference === 'participating' ?
  `Upon any liquidation event, the Investor shall be entitled to receive the greater of (i) the return of their original investment amount, or (ii) their pro rata share of the liquidation proceeds based on their ownership percentage, plus an additional participating amount.` :
  formData.liquidationPreference === 'non_participating' ?
  `Upon any liquidation event, the Investor shall be entitled to receive the greater of (i) the return of their original investment amount, or (ii) their pro rata share of the liquidation proceeds based on their ownership percentage.` :
  `The Investor shall receive liquidation proceeds solely based on their pro rata ownership percentage.`}

3. INFORMATION AND INSPECTION RIGHTS

a) Financial Reporting. The Company shall provide the Investor with quarterly financial statements within thirty (30) days after the end of each quarter.

b) Operational Updates. The Company shall provide monthly operational updates to the Investor.

c) Inspection Rights. Upon reasonable notice, the Investor shall have the right to inspect the Company's books and records.

d) Proprietary Information. The Investor agrees to maintain the confidentiality of information for a period of ${formData.confidentialityPeriod} years.

4. TRANSFER RESTRICTIONS AND RIGHTS

a) Right of First Refusal. ${formData.rightOfFirstRefusal ? 
  `Prior to transferring any shares to a third party, the selling stockholder must first offer such shares to the Company and other stockholders.` :
  `No rights of first refusal shall apply.`}

b) Tag-Along Rights. ${formData.tagAlong ?
  `If any stockholder proposes to transfer their shares to a third party, the other stockholders shall have the right to participate in such transfer.` :
  `No tag-along rights shall apply.`}

c) Drag-Along Rights. ${formData.dragAlong ?
  `In the event that stockholders holding a majority approve a sale of the Company, all stockholders shall be required to participate.` :
  `No drag-along rights shall apply.`}

5. REPRESENTATIONS AND WARRANTIES

a) Company Representations. The Company represents and warrants that it is duly organized under the laws of ${formData.startupState}.

b) Investor Representations. The Investor represents that they are an accredited investor.

6. COVENANTS AND RESTRICTIONS

a) Use of Funds. The Company shall use the investment proceeds for the purposes set forth in this Agreement.

b) Compliance with Laws. The Company shall conduct its business in compliance with all applicable laws.

7. GOVERNING LAW AND DISPUTE RESOLUTION

a) Governing Law. This Agreement shall be governed by the laws of the State of ${formData.governingLaw}.

b) Dispute Resolution. ${formData.disputeResolution === 'arbitration' ?
  `Any disputes shall be resolved through binding arbitration.` :
  `Any disputes shall be resolved through litigation in the appropriate courts.`}

8. GENERAL PROVISIONS

a) Entire Agreement. This Agreement constitutes the entire agreement between the parties.

b) Amendment. This Agreement may only be amended in writing.

c) Severability. If any provision is invalid, the remaining provisions shall remain in effect.

IN WITNESS WHEREOF, the parties have executed this Angel Investor Agreement as of the date first written above.

COMPANY:                           INVESTOR:

${formData.startupName}            ${formData.investorName}

By: _________________________      _________________________
    ${formData.founderName}         ${formData.investorName}
    Chief Executive Officer        Investor

Date: ${readableDate}              Date: _________________`;
  };

  const downloadWord = () => {
    if (!isPaid) {
      alert('Please purchase the agreement to enable downloading.');
      return;
    }

    try {
      const documentText = generateDocumentText();
      
      if (window.generateWordDoc) {
        window.generateWordDoc(documentText, {
          documentTitle: 'Angel Investor Agreement',
          fileName: 'Angel_Investor_Agreement',
          startupName: formData.startupName,
          founderName: formData.founderName,
          investorName: formData.investorName,
          signatureDate: formData.signatureDate
        });
      } else {
        throw new Error('Document generator not available');
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please try again or use the copy option.');
    }
  };

  const getHighlightedPreview = () => {
    const documentText = generateDocumentText();
    
    let sectionToHighlight = null;
    
    switch (currentTab) {
      case 0: // Basic Information
        if (['startupName', 'investorName', 'startupAddress', 'investorAddress'].includes(lastChanged)) {
          sectionToHighlight = 'header';
        }
        break;
      case 1: // Investment Terms
        if (['investmentAmount', 'equityPercentage', 'premoneyValuation'].includes(lastChanged)) {
          sectionToHighlight = 'investment';
        }
        break;
      case 2: // Equity & Control
        if (['antiDilution', 'liquidationPreference', 'boardRepresentation'].includes(lastChanged)) {
          sectionToHighlight = 'equity';
        }
        break;
      case 3: // Rights & Protections
        if (['tagAlong', 'dragAlong', 'rightOfFirstRefusal'].includes(lastChanged)) {
          sectionToHighlight = 'transfer';
        }
        break;
      case 4: // Legal Terms
        if (['governingLaw', 'disputeResolution', 'confidentialityPeriod'].includes(lastChanged)) {
          sectionToHighlight = 'legal';
        }
        break;
    }

    if (sectionToHighlight && lastChanged) {
      const sections = {
        header: /This Angel Investor Agreement.*?NOW, THEREFORE/s,
        investment: /1\. INVESTMENT TERMS.*?(?=2\.)/s,
        equity: /2\. EQUITY AND GOVERNANCE RIGHTS.*?(?=3\.)/s,
        transfer: /4\. TRANSFER RESTRICTIONS AND RIGHTS.*?(?=5\.)/s,
        legal: /7\. GOVERNING LAW AND DISPUTE RESOLUTION.*?(?=8\.)/s
      };

      if (sections[sectionToHighlight]) {
        return documentText.replace(sections[sectionToHighlight], match => 
          `<span class="highlighted-text">${match}</span>`
        );
      }
    }

    return documentText;
  };
  // Scroll to highlighted section when it changes
  React.useEffect(() => {
    if (previewRef.current && lastChanged) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastChanged, currentTab]);

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Information
        return (
          <div className="tab-content">
            <h3>Company and Investor Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startupName">Company Name *</label>
                <input
                  type="text"
                  id="startupName"
                  name="startupName"
                  value={formData.startupName}
                  onChange={handleInputChange}
                  placeholder="e.g., Acme Innovations, Inc."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="startupState">State of Incorporation *</label>
                <select
                  id="startupState"
                  name="startupState"
                  value={formData.startupState}
                  onChange={handleInputChange}
                  required
                >
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="startupAddress">Company Address *</label>
              <input
                type="text"
                id="startupAddress"
                name="startupAddress"
                value={formData.startupAddress}
                onChange={handleInputChange}
                placeholder="Full company address"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="founderName">CEO/Founder Name *</label>
              <input
                type="text"
                id="founderName"
                name="founderName"
                value={formData.founderName}
                onChange={handleInputChange}
                placeholder="Name of person signing for the company"
                required
              />
            </div>
            <hr className="section-divider" />
            <div className="form-group">
              <label htmlFor="investorName">Investor Name *</label>
              <input
                type="text"
                id="investorName"
                name="investorName"
                value={formData.investorName}
                onChange={handleInputChange}
                placeholder="Full name of the angel investor"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="investorAddress">Investor Address *</label>
              <input
                type="text"
                id="investorAddress"
                name="investorAddress"
                value={formData.investorAddress}
                onChange={handleInputChange}
                placeholder="Full investor address"
                required
              />
            </div>
          </div>
        );
      case 1: // Investment Terms
        return (
          <div className="tab-content">
            <h3>Investment Structure</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="investmentAmount">Investment Amount ($) *</label>
                <input
                  type="number"
                  id="investmentAmount"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  placeholder="100000"
                  min="1000"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="equityPercentage">Equity Percentage (%) *</label>
                <input
                  type="number"
                  id="equityPercentage"
                  name="equityPercentage"
                  value={formData.equityPercentage}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="0.1"
                  max="100"
                  step="0.1"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="premoneyValuation">Pre-Money Valuation ($) *</label>
              <input
                type="number"
                id="premoneyValuation"
                name="premoneyValuation"
                value={formData.premoneyValuation}
                onChange={handleInputChange}
                placeholder="900000"
                min="1"
                required
              />
              <small>Post-money valuation will be calculated automatically</small>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="securitiesType">Type of Securities</label>
                <select
                  id="securitiesType"
                  name="securitiesType"
                  value={formData.securitiesType}
                  onChange={handleInputChange}
                >
                  <option value="common">Common Stock</option>
                  <option value="preferred">Preferred Stock</option>
                  <option value="convertible">Convertible Note</option>
                  <option value="safe">SAFE Agreement</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="signatureDate">Agreement Date</label>
                <input
                  type="date"
                  id="signatureDate"
                  name="signatureDate"
                  value={formData.signatureDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );
      case 2: // Equity & Control
        return (
          <div className="tab-content">
            <h3>Governance and Control Rights</h3>
            <div className="form-group">
              <label htmlFor="boardRepresentation">Board Representation</label>
              <select
                id="boardRepresentation"
                name="boardRepresentation"
                value={formData.boardRepresentation}
                onChange={handleInputChange}
              >
                <option value="none">No board rights</option>
                <option value="observer">Board observer rights</option>
                <option value="board_seat">Board seat</option>
              </select>
              <small>Observer rights allow attendance at board meetings without voting</small>
            </div>
            <div className="form-group">
              <label htmlFor="antiDilution">Anti-Dilution Protection</label>
              <select
                id="antiDilution"
                name="antiDilution"
                value={formData.antiDilution}
                onChange={handleInputChange}
              >
                <option value="none">No anti-dilution protection</option>
                <option value="weighted_average">Weighted average (standard)</option>
                <option value="full_ratchet">Full ratchet (investor-friendly)</option>
              </select>
              <small>Protection against future down-rounds</small>
            </div>
            <div className="form-group">
              <label htmlFor="liquidationPreference">Liquidation Preference</label>
              <select
                id="liquidationPreference"
                name="liquidationPreference"
                value={formData.liquidationPreference}
                onChange={handleInputChange}
              >
                <option value="none">No preference (common stock treatment)</option>
                <option value="non_participating">Non-participating preferred</option>
                <option value="participating">Participating preferred</option>
              </select>
              <small>How proceeds are distributed in a sale or liquidation</small>
            </div>
          </div>
        );
      case 3: // Rights & Protections
        return (
          <div className="tab-content">
            <h3>Transfer Rights and Investor Protections</h3>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="rightOfFirstRefusal"
                  name="rightOfFirstRefusal"
                  checked={formData.rightOfFirstRefusal}
                  onChange={handleInputChange}
                />
                <label htmlFor="rightOfFirstRefusal">
                  <strong>Right of First Refusal</strong>
                  <small>Company and other shareholders can purchase shares before outside sales</small>
                </label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="tagAlong"
                  name="tagAlong"
                  checked={formData.tagAlong}
                  onChange={handleInputChange}
                />
                <label htmlFor="tagAlong">
                  <strong>Tag-Along Rights</strong>
                  <small>Minority shareholders can participate in sale to third parties</small>
                </label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="dragAlong"
                  name="dragAlong"
                  checked={formData.dragAlong}
                  onChange={handleInputChange}
                />
                <label htmlFor="dragAlong">
                  <strong>Drag-Along Rights</strong>
                  <small>Majority can force all shareholders to sell in approved transactions</small>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confidentialityPeriod">Confidentiality Period (years)</label>
              <input
                type="number"
                id="confidentialityPeriod"
                name="confidentialityPeriod"
                value={formData.confidentialityPeriod}
                onChange={handleInputChange}
                min="1"
                max="10"
              />
              <small>How long investor must keep company information confidential</small>
            </div>
          </div>
        );
      case 4: // Legal Terms
        return (
          <div className="tab-content">
            <h3>Legal and Dispute Resolution</h3>
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law</label>
              <select
                id="governingLaw"
                name="governingLaw"
                value={formData.governingLaw}
                onChange={handleInputChange}
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <small>State laws that will govern this agreement</small>
            </div>
            <div className="form-group">
              <label htmlFor="disputeResolution">Dispute Resolution</label>
              <select
                id="disputeResolution"
                name="disputeResolution"
                value={formData.disputeResolution}
                onChange={handleInputChange}
              >
                <option value="arbitration">Binding arbitration</option>
                <option value="litigation">Court litigation</option>
                <option value="mediation">Mediation then arbitration</option>
              </select>
              <small>Method for resolving disputes under this agreement</small>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // PayPal integration
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=BAAgTb2uhmcrPfZVsUbREYsqOgos8TI_UzVWxMmC1Gj0D8ek_GK7qHVAL9UgpBIVLXnUaPAo3scmaTKX5U&components=hosted-buttons&enable-funding=venmo&currency=USD";
    script.async = true;
    script.onload = () => {
      if (window.paypal && document.getElementById('paypal-button-container-angel')) {
        window.paypal.HostedButtons({
          hostedButtonId: "2YGAB8Z2WYXFS",
          onApprove: function(data) {
            handleUnlock();
            setShowSuccessModal(true);
          }
        }).render("#paypal-button-container-angel");
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isPaid]);  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>Angel Investor Agreement Generator</h1>
        <p>Create a professional angel investment agreement with customizable terms</p>
      </div>

      <div className="generator-content">
        {/* Form Panel */}
        <div className="form-panel">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`tab-button ${currentTab === index ? 'active' : ''}`}
                onClick={() => goToTab(index)}
                disabled={!isPaid && index > currentTab + 1}
              >
                {index + 1}. {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content-container">
            {renderTabContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className="nav-button prev-button"
              disabled={currentTab === 0}
            >
              ← Previous
            </button>

            <button
              onClick={copyToClipboard}
              className="nav-button copy-button"
              disabled={!isPaid}
            >
              📋 Copy
            </button>

            <button
              onClick={downloadWord}
              className="nav-button download-button"
              disabled={!isPaid}
            >
              📄 Download
            </button>

            <button
              onClick={nextTab}
              className="nav-button next-button"
              disabled={currentTab === tabs.length - 1}
            >
              Next →
            </button>
          </div>

          <button onClick={resetForm} className="reset-button">
            Reset Form
          </button>

          {/* Consultation Button */}
          <button
            className="consultation-button"
            onClick={() => {
              if (window.Calendly && window.Calendly.initPopupWidget) {
                window.Calendly.initPopupWidget({
                  url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
                });
              } else {
                window.open('https://terms.law/call/', '_blank');
              }
            }}
          >
            📞 Schedule Legal Consultation
          </button>
        </div>
        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <p>Updates as you complete the form</p>
          </div>
          <div 
            className={`preview-content ${!isPaid ? 'locked' : ''}`}
            ref={previewRef}
          >
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ 
                __html: isPaid ? getHighlightedPreview() : getHighlightedPreview() 
              }}
            />
            
            {!isPaid && (
              <>
                <div className="preview-overlay"></div>
                <div className="paywall-modal">
                  <div className="paywall-content">
                    <h4>🔒 Unlock Full Agreement</h4>
                    <p>Purchase to download, copy, and customize this agreement</p>
                    
                    {/* PayPal Button */}
                    <div id="paypal-button-container-angel"></div>
                    
                    <div className="features-list">
                      <div className="feature">✓ Complete legal agreement</div>
                      <div className="feature">✓ Professional MS Word download</div>
                      <div className="feature">✓ Customizable for your needs</div>
                      <div className="feature">✓ Created by licensed attorney</div>
                    </div>

                    <div className="unlock-section">
                      <p>Already purchased? Enter your PayPal transaction ID:</p>
                      <input
                        type="text"
                        id="transactionId"
                        placeholder="PayPal Transaction ID"
                        className="transaction-input"
                      />
                      <button onClick={handleTransactionUnlock} className="unlock-button">
                        Unlock Agreement
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <h3>✅ Payment Successful!</h3>
            <p>Your angel investor agreement is now unlocked. You can copy, download, and customize it.</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="success-button"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Render the component
ReactDOM.render(<AngelInvestorGenerator />, document.getElementById('root'));