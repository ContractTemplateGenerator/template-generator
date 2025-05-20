// Angel Investor Generator - Complete Version
const { useState, useEffect, useRef } = React;
const { createElement: h } = React;

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
    securitiesType: 'common',
    boardRepresentation: 'observer',
    antiDilution: 'weighted_average',
    liquidationPreference: 'non_participating',
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
      securitiesType: 'common',
      boardRepresentation: 'observer',
      antiDilution: 'weighted_average',
      liquidationPreference: 'non_participating',
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
  // Comprehensive document generation with 8 sections
  const generateDocumentText = () => {
    const postmoneyValuation = formData.premoneyValuation ? 
      parseInt(formData.premoneyValuation) + parseInt(formData.investmentAmount || 0) : 
      'TBD';

    return `ANGEL INVESTOR AGREEMENT

This Angel Investor Agreement (this "Agreement") is made and entered into as of ${formData.signatureDate}, by and between ${formData.startupName}, a ${formData.startupState} corporation (the "Company"), and ${formData.investorName}, an individual (the "Investor").

RECITALS

WHEREAS, the Company is engaged in the business of developing and commercializing innovative technology solutions and products; and

WHEREAS, the Investor desires to invest in the Company and the Company desires to accept such investment, subject to the terms and conditions set forth herein; and

WHEREAS, the parties wish to set forth their respective rights and obligations in connection with the Investor's investment in the Company and the ongoing relationship between the parties.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. INVESTMENT TERMS

a) Investment Amount and Consideration. The Investor agrees to purchase ${formData.equityPercentage}% of the outstanding shares of ${formData.securitiesType} stock of the Company for a total investment of $${parseInt(formData.investmentAmount || 0).toLocaleString()}. This investment values the Company at a pre-money valuation of $${parseInt(formData.premoneyValuation || 0).toLocaleString()} and a post-money valuation of $${postmoneyValuation.toLocaleString ? postmoneyValuation.toLocaleString() : postmoneyValuation}.

b) Securities to be Issued. In exchange for the investment amount, the Company shall issue to the Investor shares of ${formData.securitiesType} stock, representing ${formData.equityPercentage}% of the fully diluted shares of the Company on a post-closing basis. The shares shall be subject to the terms and conditions of this Agreement and any applicable stockholders' agreement.

c) Use of Investment Proceeds. The Company shall use the investment proceeds for general corporate purposes, including but not limited to product development, marketing initiatives, hiring key personnel, and working capital needs. The Company agrees to provide quarterly updates to the Investor regarding the use of funds and the Company's operational progress.

d) Additional Investment Rights. The Investor shall have the right to participate in future financing rounds of the Company on a pro rata basis, based on the Investor's percentage ownership at the time of such future financing. This participation right shall be subject to standard exceptions for certain types of financing arrangements such as employee option plans and strategic partnerships.

2. EQUITY AND GOVERNANCE RIGHTS

a) Voting Rights. The Investor shall have voting rights commensurate with their ownership percentage in the Company. All major corporate decisions, including changes to the Company's charter documents, issuance of additional securities exceeding 10% of outstanding shares, and significant asset sales or acquisitions, shall require the approval of a majority of stockholders, including the Investor if their ownership exceeds 5% of the outstanding shares.

b) Board of Directors. ${formData.boardRepresentation === 'board_seat' ? 
  'The Investor shall be entitled to designate one member to the Company\'s Board of Directors. The Board shall consist of no more than five members, and the Investor\'s designated board member shall serve until such time as the Investor\'s ownership falls below 5% of the outstanding shares on a fully diluted basis.' : 
  formData.boardRepresentation === 'observer' ?
  'The Investor shall have the right to designate a board observer who may attend all board meetings and receive all board materials, but shall not have voting rights. The observer rights shall continue until the Investor\'s ownership falls below 2% of the outstanding shares on a fully diluted basis.' :
  'The Investor shall not have board representation or observer rights under this Agreement.'}

c) Anti-Dilution Protection. ${formData.antiDilution === 'weighted_average' ? 
  'The Investor shall be protected against dilution through weighted average anti-dilution provisions. In the event the Company issues additional shares at a price per share lower than the price paid by the Investor, the Investor\'s conversion ratio shall be adjusted using a standard weighted average formula to account for the dilutive issuance.' :
  formData.antiDilution === 'full_ratchet' ?
  'The Investor shall be protected against dilution through full ratchet anti-dilution provisions. In the event the Company issues additional shares at a price per share lower than the price paid by the Investor, the Investor\'s conversion ratio shall be adjusted to the lower price on a dollar-for-dollar basis.' :
  'The Investor shall not receive anti-dilution protection under this Agreement.'}

d) Liquidation Preferences. ${formData.liquidationPreference === 'participating' ?
  'Upon any liquidation event, including a sale of the Company, merger, or winding up, the Investor shall be entitled to receive the greater of (i) the return of their original investment amount, or (ii) their pro rata share of the liquidation proceeds based on their ownership percentage, plus an additional participating amount equal to their pro rata share of any remaining proceeds after all liquidation preferences have been satisfied.' :
  formData.liquidationPreference === 'non_participating' ?
  'Upon any liquidation event, including a sale of the Company, merger, or winding up, the Investor shall be entitled to receive the greater of (i) the return of their original investment amount, or (ii) their pro rata share of the liquidation proceeds based on their ownership percentage.' :
  'Upon any liquidation event, the Investor shall receive liquidation proceeds solely based on their pro rata ownership percentage without any liquidation preference.'}

3. INFORMATION AND INSPECTION RIGHTS

a) Financial Reporting. The Company shall provide the Investor with quarterly financial statements, including income statements, balance sheets, cash flow statements, and a statement of stockholder equity, within thirty (30) days after the end of each quarter. Annual audited financial statements prepared by an independent certified public accountant shall be provided within ninety (90) days after the end of each fiscal year.

b) Operational Updates. The Company shall provide monthly operational updates to the Investor, including key performance metrics, significant business developments, customer acquisition data, and any material changes to the Company's business plan or strategy. These updates may be provided in written form or through regular investor calls at the Company's discretion.

c) Inspection Rights. Upon reasonable advance notice and during normal business hours, the Investor shall have the right to inspect the Company's books and records, properties, and facilities. Such inspection rights shall be exercised in a manner that does not unduly interfere with the Company's operations and subject to reasonable confidentiality protections.

d) Proprietary Information. The Investor acknowledges that any information provided by the Company pursuant to this Agreement may contain proprietary and confidential information. The Investor agrees to maintain the confidentiality of such information for a period of ${formData.confidentialityPeriod} years following the termination of this Agreement or the Investor's relationship with the Company.

4. TRANSFER RESTRICTIONS AND RIGHTS

a) Right of First Refusal. ${formData.rightOfFirstRefusal ? 
  'Prior to transferring any shares to a third party, the selling stockholder must first offer such shares to the Company and then to the other stockholders on a pro rata basis at the same price and terms. This right of first refusal shall apply to all transfers except for certain permitted transfers to family members, trusts, and affiliates.' :
  'The Company and stockholders shall not have rights of first refusal with respect to transfers of shares under this Agreement.'}

b) Tag-Along Rights. ${formData.tagAlong ?
  'If any stockholder proposes to transfer their shares to a third party purchaser, the other stockholders shall have the right to participate in such transfer on the same terms and conditions, subject to their pro rata ownership percentages. The selling stockholder must use reasonable efforts to include the other stockholders in the proposed transaction.' :
  'Stockholders shall not have tag-along rights under this Agreement.'}

c) Drag-Along Rights. ${formData.dragAlong ?
  'In the event that stockholders holding a majority of the outstanding shares approve a sale of the Company to a third party, all stockholders shall be required to participate in such sale on the same terms and conditions. The majority stockholders may initiate drag-along procedures by providing at least thirty (30) days written notice to all stockholders.' :
  'No drag-along rights shall apply under this Agreement.'}

d) Transfer Restrictions. Except as otherwise provided herein, no stockholder may transfer their shares without the prior written consent of the Company's Board of Directors, which consent shall not be unreasonably withheld. Any attempted transfer in violation of this provision shall be void and of no effect.

5. REPRESENTATIONS AND WARRANTIES

a) Company Representations. The Company represents and warrants that it is duly organized and validly existing under the laws of ${formData.startupState}, has full corporate power and authority to enter into this Agreement, and that the execution and delivery of this Agreement has been duly authorized by all necessary corporate action. The Company further represents that it has no material pending litigation or regulatory proceedings.

b) Investor Representations. The Investor represents and warrants that they have full power and authority to enter into this Agreement, that they are an accredited investor as defined under applicable securities laws, and that they are acquiring the shares for investment purposes and not with a view to distribution. The Investor acknowledges the speculative nature of this investment.

c) No Conflicts. Each party represents that the execution and performance of this Agreement will not violate any agreement, instrument, or obligation to which they are bound or by which they are affected, and that no consent or approval of any third party is required for the execution and performance of this Agreement.

d) Due Diligence. The Investor acknowledges that they have conducted their own due diligence investigation of the Company and its business, finances, and prospects, and are not relying on any representations or warranties not expressly set forth in this Agreement.

6. COVENANTS AND RESTRICTIONS

a) Use of Funds. The Company covenants to use the investment proceeds solely for the purposes set forth in this Agreement and in a manner consistent with sound business practices. The Company shall not use the funds for any unlawful purpose or for the personal benefit of its founders or employees outside of ordinary compensation arrangements and approved expense reimbursements.

b) Compliance with Laws. The Company shall conduct its business in compliance with all applicable federal, state, and local laws and regulations. The Company shall maintain all necessary licenses and permits required for the operation of its business and shall promptly notify the Investor of any material compliance issues or regulatory actions.

c) Insurance and Protection. The Company shall maintain appropriate insurance coverage for its business operations, including general liability, professional liability, cyber liability, and directors and officers insurance as may be reasonably required by the Investor or as customary for businesses of similar size and nature.

d) Intellectual Property Protection. The Company shall take all reasonable steps to protect its intellectual property rights, including filing for appropriate patent, trademark, and copyright protections where applicable, and ensuring that all employees and contractors execute appropriate intellectual property assignment agreements.

7. GOVERNING LAW AND DISPUTE RESOLUTION

a) Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without regard to its conflict of laws principles. All parties consent to the jurisdiction of the courts of ${formData.governingLaw} for any legal proceedings arising under this Agreement.

b) Dispute Resolution. ${formData.disputeResolution === 'arbitration' ?
  'Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. The arbitration shall take place in ${formData.governingLaw}, and the decision of the arbitrator(s) shall be final and binding upon all parties. Each party shall bear their own costs and expenses, and the fees of the arbitrator shall be shared equally.' :
  formData.disputeResolution === 'mediation' ?
  'Any disputes arising under this Agreement shall first be subject to good faith mediation. If mediation fails to resolve the dispute within sixty (60) days, the parties may pursue binding arbitration or litigation in the appropriate courts of ${formData.governingLaw}. Each party waives any right to a jury trial in connection with any litigation arising under this Agreement.' :
  'Any disputes arising under this Agreement shall be resolved through litigation in the appropriate courts of ${formData.governingLaw}. Each party waives any right to a jury trial in connection with any litigation arising under this Agreement.'}

c) Attorney's Fees. In the event of any legal proceeding arising under this Agreement, the prevailing party shall be entitled to recover its reasonable attorney's fees and costs from the non-prevailing party, provided that such award shall not exceed the amount in controversy.

d) Equitable Relief. The parties acknowledge that a breach of certain provisions of this Agreement may cause irreparable harm for which monetary damages may be inadequate. Therefore, the parties agree that equitable relief, including injunctive relief and specific performance, may be appropriate in addition to any other legal remedies available at law or equity.

8. GENERAL PROVISIONS

a) Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, whether written or oral, relating to such subject matter. This Agreement may be supplemented by separate documents such as a stockholders' agreement or investor rights agreement.

b) Amendment and Modification. This Agreement may only be amended or modified by a written instrument signed by all parties hereto. No waiver of any provision of this Agreement shall be effective unless made in writing and signed by the party making such waiver. Any waiver shall be limited to the specific instance and shall not constitute a general waiver.

c) Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired thereby. The parties agree to negotiate in good faith to replace any invalid provision with a valid provision that achieves the same economic effect.

d) Counterparts and Electronic Signatures. This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Electronic signatures and facsimile signatures shall be deemed equivalent to original signatures for all purposes.

e) Notices. All notices required or permitted hereunder shall be in writing and shall be deemed given when delivered personally, sent by certified mail (return receipt requested), or sent by overnight courier service to the addresses set forth above or such other address as a party may designate by written notice to the other party.

f) Survival of Representations. The representations and warranties contained herein shall survive the closing of the investment for a period of two (2) years, except for those relating to organization, authority, and capitalization, which shall survive indefinitely.

IN WITNESS WHEREOF, the parties have executed this Angel Investor Agreement as of the date first written above.


COMPANY:                                    INVESTOR:

${formData.startupName}                     ${formData.investorName}


By: _________________________________       _________________________________
    ${formData.founderName}                 ${formData.investorName}
    Chief Executive Officer                 Investor

Date: ${formData.signatureDate}            Date: _________________



SCHEDULE A - CAPITALIZATION TABLE
[To be attached showing pre-investment and post-investment capitalization]

SCHEDULE B - INVESTOR RIGHTS AGREEMENT  
[If applicable, detailed investor rights agreement to be attached]

SCHEDULE C - KEY EMPLOYEE AGREEMENTS
[If applicable, employment and equity agreements for key personnel]`;
  };
  return h('div', { className: 'generator-container' },
    // Header
    h('div', { className: 'generator-header' },
      h('h1', null, 'Angel Investor Agreement Generator'),
      h('p', null, 'Create a professional angel investment agreement')
    ),
    
    // Content
    h('div', { className: 'generator-content' },
      // Form Panel
      h('div', { className: 'form-panel' },
        // Tab Navigation
        h('div', { className: 'tab-navigation' },
          tabs.map((tab, index) => 
            h('button', {
              key: tab.id,
              className: `tab-button ${currentTab === index ? 'active' : ''}`,
              onClick: () => goToTab(index)
            }, `${index + 1}. ${tab.label}`)
          )
        ),
        
        // Tab Content
        h('div', { className: 'tab-content-container' },
          // Tab 1: Basic Information
          currentTab === 0 && h('div', { className: 'tab-content' },
            h('h3', null, 'Company and Investor Details'),
            h('div', { className: 'form-group' },
              h('label', null, 'Company Name *'),
              h('input', {
                type: 'text',
                name: 'startupName',
                value: formData.startupName,
                onChange: handleInputChange,
                placeholder: 'e.g., Acme Innovations, Inc.'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'State of Incorporation'),
              h('select', {
                name: 'startupState',
                value: formData.startupState,
                onChange: handleInputChange
              },
                h('option', { value: 'Delaware' }, 'Delaware'),
                h('option', { value: 'California' }, 'California'),
                h('option', { value: 'New York' }, 'New York'),
                h('option', { value: 'Texas' }, 'Texas'),
                h('option', { value: 'Nevada' }, 'Nevada')
              )
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Company Address *'),
              h('input', {
                type: 'text',
                name: 'startupAddress',
                value: formData.startupAddress,
                onChange: handleInputChange,
                placeholder: 'Full company address'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'CEO/Founder Name *'),
              h('input', {
                type: 'text',
                name: 'founderName',
                value: formData.founderName,
                onChange: handleInputChange,
                placeholder: 'Name of person signing for company'
              })
            ),
            h('hr', { style: { margin: '2rem 0', border: 'none', borderTop: '1px solid #e0e6ed' } }),
            h('div', { className: 'form-group' },
              h('label', null, 'Investor Name *'),
              h('input', {
                type: 'text',
                name: 'investorName',
                value: formData.investorName,
                onChange: handleInputChange,
                placeholder: 'Full name of angel investor'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Investor Address *'),
              h('input', {
                type: 'text',
                name: 'investorAddress',
                value: formData.investorAddress,
                onChange: handleInputChange,
                placeholder: 'Full investor address'
              })
            )
          ),
          
          // Tab 2: Investment Terms
          currentTab === 1 && h('div', { className: 'tab-content' },
            h('h3', null, 'Investment Structure'),
            h('div', { className: 'form-group' },
              h('label', null, 'Investment Amount ($) *'),
              h('input', {
                type: 'number',
                name: 'investmentAmount',
                value: formData.investmentAmount,
                onChange: handleInputChange,
                placeholder: '100000',
                min: '1000'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Equity Percentage (%) *'),
              h('input', {
                type: 'number',
                name: 'equityPercentage',
                value: formData.equityPercentage,
                onChange: handleInputChange,
                placeholder: '10',
                min: '0.1',
                max: '100',
                step: '0.1'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Pre-Money Valuation ($) *'),
              h('input', {
                type: 'number',
                name: 'premoneyValuation',
                value: formData.premoneyValuation,
                onChange: handleInputChange,
                placeholder: '900000',
                min: '1'
              }),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'Post-money valuation will be calculated automatically')
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Type of Securities'),
              h('select', {
                name: 'securitiesType',
                value: formData.securitiesType,
                onChange: handleInputChange
              },
                h('option', { value: 'common' }, 'Common Stock'),
                h('option', { value: 'preferred' }, 'Preferred Stock'),
                h('option', { value: 'convertible' }, 'Convertible Note')
              )
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Agreement Date'),
              h('input', {
                type: 'date',
                name: 'signatureDate',
                value: formData.signatureDate,
                onChange: handleInputChange
              })
            )
          ),
          
          // Tab 3: Equity & Control
          currentTab === 2 && h('div', { className: 'tab-content' },
            h('h3', null, 'Governance and Control Rights'),
            h('div', { className: 'form-group' },
              h('label', null, 'Board Representation'),
              h('select', {
                name: 'boardRepresentation',
                value: formData.boardRepresentation,
                onChange: handleInputChange
              },
                h('option', { value: 'none' }, 'No board rights'),
                h('option', { value: 'observer' }, 'Board observer rights'),
                h('option', { value: 'board_seat' }, 'Board seat')
              ),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'Observer rights allow attendance at board meetings without voting')
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Anti-Dilution Protection'),
              h('select', {
                name: 'antiDilution',
                value: formData.antiDilution,
                onChange: handleInputChange
              },
                h('option', { value: 'none' }, 'No anti-dilution protection'),
                h('option', { value: 'weighted_average' }, 'Weighted average (standard)'),
                h('option', { value: 'full_ratchet' }, 'Full ratchet (investor-friendly)')
              ),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'Protection against future down-rounds')
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Liquidation Preference'),
              h('select', {
                name: 'liquidationPreference',
                value: formData.liquidationPreference,
                onChange: handleInputChange
              },
                h('option', { value: 'none' }, 'No preference (common stock treatment)'),
                h('option', { value: 'non_participating' }, 'Non-participating preferred'),
                h('option', { value: 'participating' }, 'Participating preferred')
              ),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'How proceeds are distributed in a sale or liquidation')
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Information Rights'),
              h('select', {
                name: 'informationRights',
                value: formData.informationRights,
                onChange: handleInputChange
              },
                h('option', { value: 'none' }, 'No special information rights'),
                h('option', { value: 'basic' }, 'Basic financial reporting'),
                h('option', { value: 'standard' }, 'Standard investor reporting'),
                h('option', { value: 'extensive' }, 'Extensive reporting and inspection rights')
              ),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'Level of ongoing company information provided to investor')
            ),
            h('div', { className: 'form-group', style: { marginTop: '2rem' } },
              h('label', null, 'Transfer Rights'),
              h('div', { style: { marginTop: '1rem' } },
                h('label', { style: { display: 'flex', alignItems: 'center', marginBottom: '1rem', fontWeight: 'normal' } },
                  h('input', {
                    type: 'checkbox',
                    name: 'rightOfFirstRefusal',
                    checked: formData.rightOfFirstRefusal,
                    onChange: handleInputChange,
                    style: { marginRight: '0.5rem' }
                  }),
                  'Right of First Refusal'
                ),
                h('label', { style: { display: 'flex', alignItems: 'center', marginBottom: '1rem', fontWeight: 'normal' } },
                  h('input', {
                    type: 'checkbox',
                    name: 'tagAlong',
                    checked: formData.tagAlong,
                    onChange: handleInputChange,
                    style: { marginRight: '0.5rem' }
                  }),
                  'Tag-Along Rights'
                ),
                h('label', { style: { display: 'flex', alignItems: 'center', fontWeight: 'normal' } },
                  h('input', {
                    type: 'checkbox',
                    name: 'dragAlong',
                    checked: formData.dragAlong,
                    onChange: handleInputChange,
                    style: { marginRight: '0.5rem' }
                  }),
                  'Drag-Along Rights'
                )
              )
            )
          ),
          
          // Tab 4: Legal Terms
          currentTab === 3 && h('div', { className: 'tab-content' },
            h('h3', null, 'Legal and Dispute Resolution'),
            h('div', { className: 'form-group' },
              h('label', null, 'Governing Law'),
              h('select', {
                name: 'governingLaw',
                value: formData.governingLaw,
                onChange: handleInputChange
              },
                h('option', { value: 'California' }, 'California'),
                h('option', { value: 'Delaware' }, 'Delaware'),
                h('option', { value: 'New York' }, 'New York'),
                h('option', { value: 'Texas' }, 'Texas'),
                h('option', { value: 'Florida' }, 'Florida'),
                h('option', { value: 'Nevada' }, 'Nevada')
              ),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'State laws that will govern this agreement')
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Dispute Resolution'),
              h('select', {
                name: 'disputeResolution',
                value: formData.disputeResolution,
                onChange: handleInputChange
              },
                h('option', { value: 'arbitration' }, 'Binding arbitration'),
                h('option', { value: 'litigation' }, 'Court litigation'),
                h('option', { value: 'mediation' }, 'Mediation then arbitration')
              ),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'Method for resolving disputes under this agreement')
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Confidentiality Period (years)'),
              h('input', {
                type: 'number',
                name: 'confidentialityPeriod',
                value: formData.confidentialityPeriod,
                onChange: handleInputChange,
                min: '1',
                max: '10'
              }),
              h('small', { style: { color: '#7f8c8d', marginTop: '0.25rem', display: 'block' } }, 
                'How long investor must keep company information confidential')
            )
          )
        ),
        
        // Navigation Buttons
        h('div', { className: 'navigation-buttons' },
          h('button', {
            onClick: prevTab,
            className: 'nav-button prev-button',
            disabled: currentTab === 0
          }, '← Previous'),
          
          h('button', {
            onClick: () => {
              if (!isPaid) {
                alert('Please purchase the agreement to enable copying.');
                return;
              }
              const text = generateDocumentText();
              navigator.clipboard.writeText(text).then(() => {
                alert('Agreement copied to clipboard!');
              });
            },
            className: 'nav-button copy-button',
            disabled: !isPaid
          }, '📋 Copy'),
          
          h('button', {
            onClick: () => {
              if (!isPaid) {
                alert('Please purchase the agreement to enable downloading.');
                return;
              }
              if (window.generateWordDoc) {
                window.generateWordDoc(generateDocumentText(), {
                  documentTitle: 'Angel Investor Agreement',
                  fileName: 'Angel_Investor_Agreement'
                });
              }
            },
            className: 'nav-button download-button',
            disabled: !isPaid
          }, '📄 Download'),
          
          h('button', {
            onClick: nextTab,
            className: 'nav-button next-button',
            disabled: currentTab === tabs.length - 1
          }, 'Next →')
        ),
        
        h('button', {
          onClick: resetForm,
          className: 'reset-button'
        }, 'Reset Form'),
        
        h('button', {
          className: 'consultation-button',
          onClick: () => {
            if (window.Calendly && window.Calendly.initPopupWidget) {
              window.Calendly.initPopupWidget({
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'
              });
            } else {
              window.open('https://terms.law/call/', '_blank');
            }
          }
        }, '📞 Schedule Legal Consultation')
      ),
      
      // Preview Panel - NOW FULLY SCROLLABLE
      h('div', { className: 'preview-panel' },
        h('div', { className: 'preview-header' },
          h('h3', null, 'Live Preview'),
          h('p', null, 'Updates as you complete the form')
        ),
        h('div', { 
          className: `preview-content ${!isPaid ? 'locked' : ''}`, 
          ref: previewRef,
          style: { position: 'relative', height: '100%' }
        },
          h('pre', {
            className: 'document-preview',
            style: { 
              height: '600px', 
              overflowY: 'auto',
              userSelect: isPaid ? 'text' : 'none',
              padding: '2rem',
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontFamily: 'Times New Roman, serif',
              fontSize: '12pt',
              lineHeight: '1.8'
            }
          }, generateDocumentText()),
          
          !isPaid && h('div', null,
            h('div', { 
              className: 'preview-overlay',
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0.95) 100%)',
                pointerEvents: 'none'
              }
            }),
            h('div', { 
              className: 'paywall-modal',
              style: {
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                right: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '2px solid #3498db',
                zIndex: 10
              }
            },
              h('div', { className: 'paywall-content' },
                h('h4', null, '🔒 Unlock Full Agreement'),
                h('p', null, 'Purchase to download, copy, and customize this agreement'),
                h('div', { id: 'paypal-button-container-angel' }),
                h('div', { className: 'features-list' },
                  h('div', { className: 'feature' }, '✓ Complete 8-section legal agreement'),
                  h('div', { className: 'feature' }, '✓ Professional MS Word download'),
                  h('div', { className: 'feature' }, '✓ Fully customizable for your needs'),
                  h('div', { className: 'feature' }, '✓ Created by licensed California attorney')
                ),
                h('div', { className: 'unlock-section' },
                  h('p', null, 'Already purchased? Enter your PayPal transaction ID:'),
                  h('input', {
                    type: 'text',
                    id: 'transactionId',
                    placeholder: 'PayPal Transaction ID',
                    className: 'transaction-input'
                  }),
                  h('button', {
                    onClick: () => {
                      const transactionId = document.getElementById('transactionId').value.trim();
                      if (transactionId && transactionId.length > 8) {
                        handleUnlock();
                        setShowSuccessModal(true);
                      } else {
                        alert('Please enter a valid PayPal transaction ID');
                      }
                    },
                    className: 'unlock-button'
                  }, 'Unlock Agreement')
                )
              )
            )
          )
        )
      )
    ),
    
    // Success Modal
    showSuccessModal && h('div', { className: 'modal-overlay' },
      h('div', { className: 'success-modal' },
        h('h3', null, '✅ Payment Successful!'),
        h('p', null, 'Your comprehensive angel investor agreement is now unlocked. You can copy, download, and customize it.'),
        h('button', {
          onClick: () => setShowSuccessModal(false),
          className: 'success-button'
        }, 'Continue')
      )
    )
  );
};

// Load PayPal when component mounts
setTimeout(() => {
  const script = document.createElement('script');
  script.src = "https://www.paypal.com/sdk/js?client-id=BAAgTb2uhmcrPfZVsUbREYsqOgos8TI_UzVWxMmC1Gj0D8ek_GK7qHVAL9UgpBIVLXnUaPAo3scmaTKX5U&components=hosted-buttons&enable-funding=venmo&currency=USD";
  script.async = true;
  script.onload = () => {
    if (window.paypal && document.getElementById('paypal-button-container-angel')) {
      window.paypal.HostedButtons({
        hostedButtonId: "2YGAB8Z2WYXFS",
        onApprove: function(data) {
          // Trigger unlock in the React component
          const unlockEvent = new CustomEvent('paypal-unlock');
          window.dispatchEvent(unlockEvent);
        }
      }).render("#paypal-button-container-angel");
    }
  };
  document.head.appendChild(script);
}, 1000);

// Listen for PayPal success events
window.addEventListener('paypal-unlock', () => {
  // This will trigger the unlock in the component
  localStorage.setItem('angel_investor_paid', 'true');
  window.location.reload();
});

// Render the component
ReactDOM.render(React.createElement(AngelInvestorGenerator), document.getElementById('root'));