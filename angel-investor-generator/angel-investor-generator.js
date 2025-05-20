const { useState, useEffect, useRef } = React;

const AngelInvestorGenerator = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
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

  const [isPaid, setIsPaid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastChanged, setLastChanged] = useState(null);
  const previewRef = useRef(null);

  const FORM_DATA_KEY = "angel_investor_form_data";
  const PAID_STATUS_KEY = "angel_investor_paid";

  // Check payment status on load
  useEffect(() => {
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
  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  }, [formData]);

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'investment', label: 'Investment Terms' },
    { id: 'equity', label: 'Equity & Control' },
    { id: 'rights', label: 'Rights & Protections' },
    { id: 'legal', label: 'Legal Terms' },
    { id: 'finalization', label: 'Review & Finalize' }
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

    return `ANGEL INVESTOR AGREEMENT

This Angel Investor Agreement (this "Agreement") is made and entered into as of ${formData.signatureDate}, by and between ${formData.startupName}, a ${formData.startupState} corporation (the "Company"), and ${formData.investorName}, an individual (the "Investor").

RECITALS

WHEREAS, the Company is engaged in the business of developing and commercializing innovative technology solutions; and

WHEREAS, the Investor desires to invest in the Company and the Company desires to accept such investment, subject to the terms and conditions set forth herein; and

WHEREAS, the parties wish to set forth their respective rights and obligations in connection with the Investor's investment in the Company.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. INVESTMENT TERMS

a) Investment Amount and Consideration. The Investor agrees to purchase ${formData.equityPercentage}% of the outstanding shares of ${formData.securitiesType} stock of the Company for a total investment of $${parseInt(formData.investmentAmount || 0).toLocaleString()}. This investment values the Company at a pre-money valuation of $${parseInt(formData.premoneyValuation || 0).toLocaleString()} and a post-money valuation of $${postmoneyValuation.toLocaleString ? postmoneyValuation.toLocaleString() : postmoneyValuation}.

b) Securities to be Issued. In exchange for the investment amount, the Company shall issue to the Investor shares of ${formData.securitiesType} stock, representing ${formData.equityPercentage}% of the fully diluted shares of the Company on a post-closing basis. The shares shall be subject to the terms and conditions of this Agreement and any applicable stockholders' agreement.

c) Use of Investment Proceeds. The Company shall use the investment proceeds for general corporate purposes, including but not limited to product development, marketing, and working capital needs. The Company agrees to provide quarterly updates to the Investor regarding the use of funds and the Company's operational progress.

d) Additional Investment Rights. The Investor shall have the right to participate in future financing rounds of the Company on a pro rata basis, based on the Investor's percentage ownership at the time of such future financing. This participation right shall be subject to standard exceptions for certain types of financing arrangements.

2. EQUITY AND GOVERNANCE RIGHTS

a) Voting Rights. The Investor shall have voting rights commensurate with their ownership percentage in the Company. All major corporate decisions, including changes to the Company's charter documents, issuance of additional securities, and significant asset sales, shall require the approval of a majority of stockholders, including the Investor if their ownership exceeds 10%.

b) Board of Directors. ${formData.boardRepresentation === 'board_seat' ? 
  `The Investor shall be entitled to designate one member to the Company's Board of Directors. The Board shall consist of no more than five members, and the Investor's designated board member shall serve until such time as the Investor's ownership falls below 5% of the outstanding shares.` : 
  formData.boardRepresentation === 'observer' ?
  `The Investor shall have the right to designate a board observer who may attend all board meetings and receive all board materials, but shall not have voting rights. The observer rights shall continue until the Investor's ownership falls below 2% of the outstanding shares.` :
  `The Investor shall not have board representation or observer rights under this Agreement.`}

c) Anti-Dilution Protection. ${formData.antiDilution === 'weighted_average' ? 
  `The Investor shall be protected against dilution through weighted average anti-dilution provisions. In the event the Company issues additional shares at a price per share lower than the price paid by the Investor, the Investor's conversion ratio shall be adjusted using a standard weighted average formula.` :
  formData.antiDilution === 'full_ratchet' ?
  `The Investor shall be protected against dilution through full ratchet anti-dilution provisions. In the event the Company issues additional shares at a price per share lower than the price paid by the Investor, the Investor's conversion ratio shall be adjusted to the lower price.` :
  `The Investor shall not receive anti-dilution protection under this Agreement.`}

d) Liquidation Preferences. ${formData.liquidationPreference === 'participating' ?
  `Upon any liquidation event, the Investor shall be entitled to receive the greater of (i) the return of their original investment amount, or (ii) their pro rata share of the liquidation proceeds based on their ownership percentage, plus an additional participating amount equal to their pro rata share of any remaining proceeds.` :
  formData.liquidationPreference === 'non_participating' ?
  `Upon any liquidation event, the Investor shall be entitled to receive the greater of (i) the return of their original investment amount, or (ii) their pro rata share of the liquidation proceeds based on their ownership percentage.` :
  `The Investor shall receive liquidation proceeds solely based on their pro rata ownership percentage.`}`;

3. INFORMATION AND INSPECTION RIGHTS

a) Financial Reporting. The Company shall provide the Investor with quarterly financial statements, including income statements, balance sheets, and cash flow statements, within thirty (30) days after the end of each quarter. Annual audited financial statements shall be provided within ninety (90) days after the end of each fiscal year.

b) Operational Updates. The Company shall provide monthly operational updates to the Investor, including key performance metrics, significant business developments, and any material changes to the Company's business plan or strategy. These updates may be provided in written form or through regular investor calls at the Company's discretion.

c) Inspection Rights. Upon reasonable notice and during normal business hours, the Investor shall have the right to inspect the Company's books and records, properties, and facilities. Such inspection rights shall be exercised in a manner that does not unduly interfere with the Company's operations.

d) Proprietary Information. The Investor acknowledges that any information provided by the Company pursuant to this Agreement may contain proprietary and confidential information. The Investor agrees to maintain the confidentiality of such information for a period of ${formData.confidentialityPeriod} years following the termination of this Agreement.

4. TRANSFER RESTRICTIONS AND RIGHTS

a) Right of First Refusal. ${formData.rightOfFirstRefusal ? 
  `Prior to transferring any shares to a third party, the selling stockholder must first offer such shares to the Company and then to the other stockholders on a pro rata basis. This right of first refusal shall apply to all transfers except for certain permitted transfers to family members and affiliates.` :
  `The Company and stockholders shall not have rights of first refusal with respect to transfers of shares.`}

b) Tag-Along Rights. ${formData.tagAlong ?
  `If any stockholder proposes to transfer their shares to a third party, the other stockholders shall have the right to participate in such transfer on the same terms and conditions, subject to their pro rata ownership percentages.` :
  `Stockholders shall not have tag-along rights under this Agreement.`}

c) Drag-Along Rights. ${formData.dragAlong ?
  `In the event that stockholders holding a majority of the outstanding shares approve a sale of the Company, all stockholders shall be required to participate in such sale on the same terms and conditions.` :
  `No drag-along rights shall apply under this Agreement.`}

d) Transfer Restrictions. Except as otherwise provided herein, no stockholder may transfer their shares without the prior written consent of the Company's Board of Directors. Any attempted transfer in violation of this provision shall be void and of no effect.

5. REPRESENTATIONS AND WARRANTIES

a) Company Representations. The Company represents and warrants that it is duly organized and validly existing under the laws of ${formData.startupState}, has full corporate power and authority to enter into this Agreement, and that the execution and delivery of this Agreement has been duly authorized by all necessary corporate action.

b) Investor Representations. The Investor represents and warrants that they have full power and authority to enter into this Agreement, that they are an accredited investor as defined under applicable securities laws, and that they are acquiring the shares for investment purposes and not with a view to distribution.

c) No Conflicts. Each party represents that the execution and performance of this Agreement will not violate any agreement, instrument, or obligation to which they are bound or by which they are affected.

d) Due Diligence. The Investor acknowledges that they have conducted their own due diligence investigation of the Company and its business, and are not relying on any representations or warranties not expressly set forth in this Agreement.

6. COVENANTS AND RESTRICTIONS

a) Use of Funds. The Company covenants to use the investment proceeds solely for the purposes set forth in this Agreement and in a manner consistent with sound business practices. The Company shall not use the funds for any unlawful purpose or for the personal benefit of its founders or employees outside of ordinary compensation arrangements.

b) Compliance with Laws. The Company shall conduct its business in compliance with all applicable federal, state, and local laws and regulations. The Company shall maintain all necessary licenses and permits required for the operation of its business.

c) Insurance and Protection. The Company shall maintain appropriate insurance coverage for its business operations, including general liability, professional liability, and directors and officers insurance as may be reasonably required by the Investor.

d) Intellectual Property Protection. The Company shall take all reasonable steps to protect its intellectual property rights, including filing for appropriate patent, trademark, and copyright protections where applicable.

7. GOVERNING LAW AND DISPUTE RESOLUTION

a) Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without regard to its conflict of laws principles. All parties consent to the jurisdiction of the courts of ${formData.governingLaw} for any legal proceedings arising under this Agreement.

b) Dispute Resolution. ${formData.disputeResolution === 'arbitration' ?
  `Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in ${formData.governingLaw}, and the decision of the arbitrator(s) shall be final and binding upon all parties.` :
  `Any disputes arising under this Agreement shall be resolved through litigation in the appropriate courts of ${formData.governingLaw}. Each party waives any right to a jury trial in connection with any litigation arising under this Agreement.`}

c) Attorney's Fees. In the event of any legal proceeding arising under this Agreement, the prevailing party shall be entitled to recover its reasonable attorney's fees and costs from the non-prevailing party.

d) Equitable Relief. The parties acknowledge that a breach of certain provisions of this Agreement may cause irreparable harm for which monetary damages may be inadequate. Therefore, the parties agree that equitable relief, including injunctive relief, may be appropriate in addition to any other legal remedies.

8. GENERAL PROVISIONS

a) Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, whether written or oral, relating to such subject matter.

b) Amendment and Modification. This Agreement may only be amended or modified by a written instrument signed by all parties hereto. No waiver of any provision of this Agreement shall be effective unless made in writing and signed by the party making such waiver.

c) Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired thereby.

d) Counterparts and Electronic Signatures. This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed equivalent to original signatures for all purposes.

IN WITNESS WHEREOF, the parties have executed this Angel Investor Agreement as of the date first written above.

COMPANY:                           INVESTOR:

${formData.startupName}            ${formData.investorName}

By: _________________________      _________________________
    ${formData.founderName}         ${formData.investorName}
    Chief Executive Officer        Investor

Date: ${formData.signatureDate}     Date: _________________


SCHEDULE A - CAPITALIZATION TABLE
[To be attached showing pre-investment and post-investment capitalization]

SCHEDULE B - INVESTOR RIGHTS AGREEMENT
[If applicable, detailed investor rights agreement to be attached]`;
  };
  const downloadWord = () => {
    if (!isPaid) {
      alert('Please purchase the agreement to enable downloading.');
      return;
    }

    try {
      const documentText = generateDocumentText();
      
      // Use the global function from docx-generator.js
      if (window.generateWordDoc) {
        window.generateWordDoc(documentText, {
          documentTitle: 'Angel Investor Agreement',
          fileName: 'Angel_Investor_Agreement'
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
    
    // Define sections that should be highlighted based on the current tab and last changed field
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
      // Create highlighted version based on section
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
  useEffect(() => {
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
                  <option value="Delaware">Delaware</option>
                  <option value="California">California</option>
                  <option value="New York">New York</option>
                  <option value="Texas">Texas</option>
                  <option value="Nevada">Nevada</option>
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
            {formData.securitiesType === 'convertible' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="valuationCap">Valuation Cap ($)</label>
                  <input
                    type="number"
                    id="valuationCap"
                    name="valuationCap"
                    value={formData.valuationCap}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="discountRate">Discount Rate (%)</label>
                  <input
                    type="number"
                    id="discountRate"
                    name="discountRate"
                    value={formData.discountRate}
                    onChange={handleInputChange}
                    placeholder="20"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            )}
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
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vestingPeriod">Founder Vesting Period (years)</label>
                <input
                  type="number"
                  id="vestingPeriod"
                  name="vestingPeriod"
                  value={formData.vestingPeriod}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cliffPeriod">Cliff Period (years)</label>
                <input
                  type="number"
                  id="cliffPeriod"
                  name="cliffPeriod"
                  value={formData.cliffPeriod}
                  onChange={handleInputChange}
                  min="0"
                  max="2"
                  step="0.25"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="dividendRights">Dividend Rights</label>
              <select
                id="dividendRights"
                name="dividendRights"
                value={formData.dividendRights}
                onChange={handleInputChange}
              >
                <option value="none">No dividend rights</option>
                <option value="cumulative">Cumulative dividends</option>
                <option value="non_cumulative">Non-cumulative dividends</option>
              </select>
              <small>Right to receive dividends if declared</small>
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
                  <br />
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
                  <br />
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
                  <br />
                  <small>Majority can force all shareholders to sell in approved transactions</small>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="informationRights">Information Rights</label>
              <select
                id="informationRights"
                name="informationRights"
                value={formData.informationRights}
                onChange={handleInputChange}
              >
                <option value="none">No special information rights</option>
                <option value="basic">Basic financial reporting</option>
                <option value="standard">Standard investor reporting</option>
                <option value="extensive">Extensive reporting and inspection rights</option>
              </select>
              <small>Level of ongoing company information provided to investor</small>
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
                <option value="California">California</option>
                <option value="Delaware">Delaware</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="Nevada">Nevada</option>
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
      case 5: // Finalization
        return (
          <div className="tab-content">
            <h3>Review and Finalize</h3>
            <div className="finalization-summary">
              <h4>Agreement Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>Investment:</strong> ${parseInt(formData.investmentAmount || 0).toLocaleString()} for {formData.equityPercentage}%
                </div>
                <div className="summary-item">
                  <strong>Valuation:</strong> Pre-money ${parseInt(formData.premoneyValuation || 0).toLocaleString()}
                </div>
                <div className="summary-item">
                  <strong>Security Type:</strong> {formData.securitiesType.charAt(0).toUpperCase() + formData.securitiesType.slice(1)} Stock
                </div>
                <div className="summary-item">
                  <strong>Board Rights:</strong> {formData.boardRepresentation.replace('_', ' ').toLowerCase()}
                </div>
                <div className="summary-item">
                  <strong>Anti-Dilution:</strong> {formData.antiDilution.replace('_', ' ').toLowerCase()}
                </div>
                <div className="summary-item">
                  <strong>Governing Law:</strong> {formData.governingLaw}
                </div>
              </div>
              
              <div className="risk-assessment">
                <h4>Risk Assessment</h4>
                <div className="risk-item green">
                  <strong>✓ Standard Terms:</strong> Agreement includes standard angel investor protections
                </div>
                {formData.antiDilution === 'none' && (
                  <div className="risk-item yellow">
                    <strong>⚠ No Anti-Dilution:</strong> Consider adding anti-dilution protection
                  </div>
                )}
                {parseInt(formData.equityPercentage) > 25 && (
                  <div className="risk-item red">
                    <strong>✗ High Equity:</strong> {formData.equityPercentage}% may be excessive for angel round
                  </div>
                )}
                {formData.boardRepresentation === 'none' && (
                  <div className="risk-item yellow">
                    <strong>⚠ No Board Rights:</strong> Consider requesting observer rights
                  </div>
                )}
              </div>

              <div className="next-steps">
                <h4>Next Steps</h4>
                <ul>
                  <li>Have both parties review the agreement carefully</li>
                  <li>Consider consulting with legal counsel for complex terms</li>
                  <li>Ensure all required corporate resolutions are in place</li>
                  <li>Prepare capitalization table and supporting schedules</li>
                  <li>Execute agreement and transfer funds via escrow if appropriate</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  // PayPal integration
  useEffect(() => {
    // Load PayPal script
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
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isPaid]);

  return (
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