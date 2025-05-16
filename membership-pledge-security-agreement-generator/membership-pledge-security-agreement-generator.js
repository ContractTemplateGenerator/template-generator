// Membership Pledge & Security Agreement Generator
// Created for terms.law

const { useState, useEffect, useRef } = React;

// Icon component to use with Feather Icons
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

// Tooltip component for form fields
const Tooltip = ({ text }) => {
  return (
    <span className="tooltip">
      <Icon name="help-circle" className="tooltip-icon" />
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

// Main Generator Component
const MembershipPledgeGenerator = () => {
  // Define tabs
  const tabs = [
    { id: 'pledgor-company', label: 'Pledgor & Company Info' },
    { id: 'secured-obligations', label: 'Secured Obligations' },
    { id: 'security-interest', label: 'Security Interest' },
    { id: 'default-remedies', label: 'Default & Remedies' },
    { id: 'miscellaneous', label: 'Miscellaneous' },
    { id: 'finalize', label: 'Finalize & Review' }
  ];

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for last changed field
  const [lastChanged, setLastChanged] = useState(null);
  
  // Reference to preview panel for scrolling
  const previewRef = useRef(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Pledgor & Company Info
    pledgorName: 'John Smith',
    pledgorAddress: '123 Main St, San Francisco, CA 94104',
    companyName: 'ABC Tech, LLC',
    companyAddress: '555 Market St, San Francisco, CA 94105',
    stateOfFormation: 'Delaware',
    membershipUnits: '100',
    membershipPercentage: '10',
    membershipCertificateNumber: 'M-001',
    dateOfAgreement: new Date().toISOString().split('T')[0],
    
    // Secured Obligations
    obligationType: 'loan',
    loanAmount: '50000',
    loanDate: new Date().toISOString().split('T')[0],
    loanMaturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
    loanInterestRate: '6',
    performanceObligations: '',
    includeGeneralObligations: true,
    
    // Security Interest
    pledgeCertificates: true,
    deliverCertificates: true,
    powerOfAttorney: true,
    votingRights: 'retain',
    distributionRights: 'retain',
    
    // Default & Remedies
    cureNoticePeriod: '10',
    includeCrossDefault: true,
    autoSale: true,
    autoMembershipTransfer: true,
    includeForeclosureSale: true,
    
    // Miscellaneous
    governingLaw: 'Delaware',
    attorneyFees: true,
    disputeResolution: 'arbitration',
    arbitrationVenue: 'San Francisco, California',
    courtVenue: 'Wilmington, Delaware',
    mustUccFile: true,
    
    // Auto-generated fields
    documentTitle: 'Membership Pledge & Security Agreement',
    fileName: 'Membership-Pledge-Security-Agreement'
  });
  
  // Generate document text
  const generateDocument = () => {
    // Title
    let doc = `MEMBERSHIP PLEDGE AND SECURITY AGREEMENT

THIS MEMBERSHIP PLEDGE AND SECURITY AGREEMENT (this "Agreement") is made and entered into as of ${formData.dateOfAgreement}, by and between ${formData.pledgorName} ("Pledgor"), and ${formData.companyName}, a ${formData.stateOfFormation} limited liability company (the "Company").

RECITALS

WHEREAS, Pledgor is a member of the Company and the owner of ${formData.membershipUnits} membership units, representing ${formData.membershipPercentage}% of the membership interests in the Company${formData.membershipCertificateNumber ? ` (Certificate No. ${formData.membershipCertificateNumber})` : ''} (the "Pledged Interests");

${formData.obligationType === 'loan' ? 
`WHEREAS, the Company has extended a loan to Pledgor in the principal amount of $${formData.loanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} pursuant to that certain Promissory Note dated ${formData.loanDate} (the "Note");` : 
`WHEREAS, Pledgor has certain performance obligations to the Company including: ${formData.performanceObligations};`}

WHEREAS, Pledgor desires to grant a security interest in the Pledged Interests to secure the obligations described herein;

NOW, THEREFORE, in consideration of the premises and mutual covenants contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties hereby agree as follows:

1. SECURED OBLIGATIONS

1.1 Secured Obligations. This Agreement secures the following obligations (collectively, the "Secured Obligations"):

${formData.obligationType === 'loan' ? 
`   (a) Payment and performance of all obligations of Pledgor under the Note, including, without limitation, the repayment of the principal amount of $${formData.loanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}, together with all interest accruing thereon at the rate of ${formData.loanInterestRate}% per annum, and all other amounts payable thereunder; and` : 
`   (a) Performance by Pledgor of the following obligations to the Company: ${formData.performanceObligations}; and`}

${formData.includeGeneralObligations ? 
`   (b) All other indebtedness, liabilities and obligations of Pledgor to the Company, now existing or hereafter arising, whether direct or indirect, absolute or contingent, joint or several, due or to become due, contractual or tortious, arising by operation of law or otherwise.` : ''}

2. PLEDGE AND GRANT OF SECURITY INTEREST

2.1 Pledge. As security for the payment and performance of the Secured Obligations, Pledgor hereby pledges, assigns, transfers, sets over and delivers to the Company, and grants to the Company a continuing security interest in, all of Pledgor's right, title and interest in and to the following (collectively, the "Collateral"):

   (a) The Pledged Interests;
   
   (b) All securities, moneys, or property representing dividends or interest on any of the Pledged Interests, or representing a distribution in respect of the Pledged Interests, or resulting from a split-up, revision, reclassification or other like change of the Pledged Interests or otherwise received in exchange therefor, and any subscription warrants, rights or options issued to the holders of, or otherwise in respect of, the Pledged Interests;
   
   (c) All right, title and interest of Pledgor in, to and under any policy of insurance payable by reason of loss or damage to the Pledged Interests;
   
   (d) All other payments due or to become due to Pledgor in respect of the Pledged Interests, whether under any organizational document of the Company, by statute, at law or in equity;
   
   (e) All "accounts," "general intangibles," "instruments" and "investment property" (as such terms are defined in the Uniform Commercial Code as in effect from time to time in the State of ${formData.governingLaw}) constituting or relating to the foregoing; and
   
   (f) All proceeds of any of the foregoing (including, without limitation, proceeds constituting any property of the types described above).

${formData.pledgeCertificates ? 
`2.2 Delivery of Certificates. Concurrently with the execution of this Agreement, Pledgor shall ${formData.deliverCertificates ? 'deliver to the Company the certificate or certificates representing the Pledged Interests, together with duly executed instruments of transfer or assignment in blank, substantially in the form attached hereto as Exhibit A.' : 'sign and deliver to the Company duly executed instruments of transfer or assignment in blank, substantially in the form attached hereto as Exhibit A.'}` : ''}

3. VOTING RIGHTS; DISTRIBUTIONS

${formData.votingRights === 'retain' ? 
`3.1 Voting Rights. Unless and until an Event of Default has occurred and is continuing, Pledgor shall be entitled to exercise any and all voting and other consensual rights pertaining to the Collateral or any part thereof for any purpose not inconsistent with the terms of this Agreement.` : 
`3.1 Voting Rights. Pledgor hereby grants to the Company all voting and other consensual rights pertaining to the Collateral or any part thereof, which the Company may exercise in its sole discretion.`}

${formData.distributionRights === 'retain' ? 
`3.2 Distributions. Unless and until an Event of Default has occurred and is continuing, Pledgor shall be entitled to receive and retain any and all dividends, interest and other distributions paid in respect of the Collateral.` : 
`3.2 Distributions. Pledgor hereby assigns to the Company the right to receive and retain any and all dividends, interest and other distributions paid in respect of the Collateral.`}

4. REPRESENTATIONS AND WARRANTIES

Pledgor represents and warrants as follows:

4.1 Title. Pledgor is the sole legal and beneficial owner of the Pledged Interests and has good and marketable title to the Pledged Interests, free and clear of any lien, security interest, option or other charge or encumbrance except for the security interest created by this Agreement.

4.2 Authority. Pledgor has full power and authority to enter into this Agreement, to pledge the Collateral and to perform its obligations hereunder.

4.3 Validity of Agreement. This Agreement has been duly executed and delivered by Pledgor and constitutes a legal, valid and binding obligation of Pledgor, enforceable in accordance with its terms.

4.4 Governmental Approvals. No authorization, approval or other action by, and no notice to or filing with, any governmental authority is required for either (i) the pledge of the Collateral pursuant to this Agreement or (ii) the exercise by the Company of the rights provided for in this Agreement.

${formData.powerOfAttorney ? 
`5. POWER OF ATTORNEY

Pledgor hereby appoints the Company as Pledgor's attorney-in-fact, with full authority in the place and stead of Pledgor and in the name of Pledgor or otherwise, from time to time in the Company's discretion after the occurrence and during the continuance of an Event of Default, to take any action and to execute any instrument which the Company may deem necessary or advisable to accomplish the purposes of this Agreement, including, without limitation:

   (a) to receive, endorse and collect all instruments made payable to Pledgor representing any dividend, interest payment or other distribution in respect of the Collateral or any part thereof;
   
   (b) to transfer the Pledged Interests on the books of the Company, in the name of the Company or its nominee; and
   
   (c) to execute and deliver all agreements, documents and instruments necessary or desirable to perfect and maintain the Company's security interest in the Collateral.

This power of attorney is coupled with an interest and shall be irrevocable until all of the Secured Obligations have been indefeasibly paid in full.` : ''}

6. DEFAULT AND REMEDIES

6.1 Events of Default. The occurrence of any of the following events shall constitute an "Event of Default" under this Agreement:

${formData.obligationType === 'loan' ? 
`   (a) Pledgor fails to pay, when due, any principal, interest, or other amount payable in respect of the Note;` : 
`   (a) Pledgor fails to perform any of the obligations described in Section 1.1(a) of this Agreement;`}

   (b) Pledgor breaches any representation, warranty, covenant or other provision of this Agreement;
   
   (c) Pledgor ceases to be a member of the Company for any reason; or
   
${formData.includeCrossDefault ? 
`   (d) Pledgor defaults under any other agreement with the Company.` : ''}

6.2 Notice and Cure. Following the occurrence of an Event of Default, the Company shall provide written notice of such Event of Default to Pledgor, and Pledgor shall have ${formData.cureNoticePeriod} days from receipt of such notice to cure such Event of Default.

6.3 Remedies upon Default. Upon the occurrence and during the continuance of an Event of Default, and after the expiration of any applicable cure period:

   (a) The Company shall have the right to exercise all rights and remedies available under the Uniform Commercial Code as enacted in the State of ${formData.governingLaw} or other applicable law.
   
${formData.autoSale ? 
`   (b) The Company shall have the right, without notice to or demand on Pledgor, to transfer to or to register in the name of the Company or any of its nominees any or all of the Collateral.` : ''}
   
${formData.autoMembershipTransfer ? 
`   (c) The Company shall have the right to be admitted as a substitute member of the Company with respect to the Pledged Interests, with all attendant rights of a member with respect to the Pledged Interests.` : ''}

${formData.includeForeclosureSale ? 
`   (d) The Company may sell, assign, transfer and deliver the whole or, from time to time, any part of the Collateral at public or private sale, for cash, upon credit or for future delivery, and at such price or prices as the Company may deem appropriate. At any such sale, the Company may be the purchaser of any or all of the Collateral.` : ''}

6.4 Application of Proceeds. The proceeds of any collection, sale or other realization of all or any part of the Collateral shall be applied in the following order of priority:

   (a) First, to the payment of all costs and expenses incurred by the Company in connection with such collection, sale or other realization;
   
   (b) Second, to the satisfaction of the Secured Obligations; and
   
   (c) Third, any surplus to be paid to Pledgor, its successors and assigns, or as a court of competent jurisdiction may direct.

7. MISCELLANEOUS

7.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without giving effect to its principles of conflicts of law.

${formData.disputeResolution === 'arbitration' ? 
`7.2 Dispute Resolution. Any dispute, controversy or claim arising out of or relating to this Agreement shall be settled by arbitration in ${formData.arbitrationVenue} administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The award rendered by the arbitrator(s) shall be final and binding upon the parties.` : 
`7.2 Jurisdiction and Venue. The parties hereby irrevocably consent to the exclusive jurisdiction of the state and federal courts located in ${formData.courtVenue} in any action arising out of or relating to this Agreement, and waive any objection to venue laid therein.`}

${formData.attorneyFees ? 
`7.3 Attorney's Fees. In any action or proceeding brought to enforce any provision of this Agreement, or where any provision hereof is validly asserted as a defense, the successful party shall be entitled to recover reasonable attorney's fees in addition to any other available remedy.` : ''}

7.4 Amendments. No amendment, modification, termination or waiver of any provision of this Agreement shall be effective unless the same shall be in writing and signed by both parties.

7.5 Successors and Assigns. This Agreement shall be binding upon and inure to the benefit of the parties hereto and their respective successors and permitted assigns.

7.6 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous communications, representations, or agreements between the parties, whether oral or written.

7.7 Severability. If any provision of this Agreement is held invalid or unenforceable, the remainder of this Agreement shall nevertheless remain in full force and effect.

7.8 Counterparts. This Agreement may be executed in any number of counterparts, each of which shall be deemed an original but all of which together shall constitute one and the same instrument.

7.9 Further Assurances. Pledgor agrees to execute and deliver such other instruments and documents and take such other actions as the Company may reasonably request to carry out the intent of this Agreement.

${formData.mustUccFile ? 
`7.10 UCC Financing Statement. Pledgor hereby authorizes the Company to file UCC financing statements describing the Collateral to perfect the security interest granted herein.` : ''}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

PLEDGOR:


____________________________
${formData.pledgorName}


COMPANY:

${formData.companyName}


By: __________________________
Name: _______________________
Title: ________________________`;

    return doc;
  };
  
  // Document text state
  const [documentText, setDocumentText] = useState('');
  
  // Update document text when form data changes
  useEffect(() => {
    setDocumentText(generateDocument());
  }, [formData]);
  
  // Function to handle form input changes
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
  
  // Function to copy document to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert("Document copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };
  
  // Function to download as MS Word document
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
  
  // Open Calendly consultation widget
  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
      });
      return false;
    } else {
      alert("Calendly widget is not loaded yet. Please try again in a moment.");
    }
  };
  
  // Function to determine which sections to highlight based on last changed field
  const getSectionToHighlight = () => {
    // Define mappings of fields to document sections
    const fieldToSectionMap = {
      // Pledgor & Company Info
      pledgorName: /Pledgor/g,
      pledgorAddress: /Pledgor/g,
      companyName: /Company/g,
      companyAddress: /Company/g,
      stateOfFormation: /a [A-Za-z]+ limited liability company/g,
      membershipUnits: /owner of [0-9]+ membership units/g,
      membershipPercentage: /representing [0-9.]+% of the membership interests/g,
      membershipCertificateNumber: /Certificate No\. [A-Za-z0-9-]+/g,
      dateOfAgreement: /is made and entered into as of [0-9]{4}-[0-9]{2}-[0-9]{2}/g,
      
      // Secured Obligations
      obligationType: /WHEREAS, (the Company has extended a loan|Pledgor has certain performance obligations)/g,
      loanAmount: /\$[0-9,]+/g,
      loanDate: /dated [0-9]{4}-[0-9]{2}-[0-9]{2}/g,
      loanInterestRate: /at the rate of [0-9.]+% per annum/g,
      loanMaturityDate: /maturity date/g,
      performanceObligations: /performance obligations to the Company including: [^;]+/g,
      includeGeneralObligations: /\(b\) All other indebtedness, liabilities and obligations/g,
      
      // Security Interest
      pledgeCertificates: /2\.2 Delivery of Certificates/g,
      deliverCertificates: /deliver to the Company the certificate or certificates/g,
      powerOfAttorney: /5\. POWER OF ATTORNEY/g,
      votingRights: /3\.1 Voting Rights/g,
      distributionRights: /3\.2 Distributions/g,
      
      // Default & Remedies
      cureNoticePeriod: /shall have [0-9]+ days from receipt/g,
      includeCrossDefault: /\(d\) Pledgor defaults under any other agreement/g,
      autoSale: /\(b\) The Company shall have the right, without notice/g,
      autoMembershipTransfer: /\(c\) The Company shall have the right to be admitted/g,
      includeForeclosureSale: /\(d\) The Company may sell, assign/g,
      
      // Miscellaneous
      governingLaw: /governed by and construed in accordance with the laws of the State of [A-Za-z]+/g,
      attorneyFees: /7\.3 Attorney's Fees/g,
      disputeResolution: /7\.2 (Dispute Resolution|Jurisdiction and Venue)/g,
      arbitrationVenue: /arbitration in [A-Za-z, ]+/g,
      courtVenue: /courts located in [A-Za-z, ]+/g,
      mustUccFile: /7\.10 UCC Financing Statement/g
    };
    
    return lastChanged ? fieldToSectionMap[lastChanged] : null;
  };
  
  // Create highlighted version of text
  const createHighlightedText = () => {
    if (!lastChanged) return documentText;
    
    const sectionRegex = getSectionToHighlight();
    if (!sectionRegex) return documentText;
    
    let highlightedText = documentText;
    
    try {
      highlightedText = documentText.replace(sectionRegex, match => 
        `<span class="highlighted-text">${match}</span>`
      );
    } catch (error) {
      console.error("Error highlighting text:", error);
    }
    
    return highlightedText;
  };
  
  // Create the highlighted text
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text when it changes
  useEffect(() => {
    if (!lastChanged) return;
    
    setTimeout(() => {
      if (previewRef.current) {
        const highlightedElement = previewRef.current.querySelector('.highlighted-text');
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    }, 100);
  }, [highlightedText, lastChanged]);
  
  // Render the risk assessment section
  const renderRiskAssessment = () => {
    // Define risk checks
    const risks = [
      {
        id: 'missingLoan',
        condition: formData.obligationType === 'loan' && (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0),
        level: 'high',
        title: 'Missing Loan Details',
        message: 'The security agreement is based on a loan, but the loan amount is missing or invalid. Please specify a valid loan amount.'
      },
      {
        id: 'missingPerformance',
        condition: formData.obligationType === 'performance' && !formData.performanceObligations,
        level: 'high',
        title: 'Missing Performance Obligations',
        message: 'You selected performance obligations as the basis for this security agreement, but the specific obligations are not defined. Please describe the performance obligations in detail.'
      },
      {
        id: 'membershipLarge',
        condition: parseFloat(formData.membershipPercentage) > 49,
        level: 'medium',
        title: 'Large Membership Interest',
        message: 'You are pledging a substantial portion of membership interest. Consider whether this level of collateral is necessary for the secured obligations and how it might affect company control if default occurs.'
      },
      {
        id: 'noCertificates',
        condition: !formData.pledgeCertificates,
        level: 'medium',
        title: 'No Certificate Delivery',
        message: 'Without physical delivery of certificates, the security interest may be more difficult to perfect and enforce. Consider including certificate delivery if certificates have been issued.'
      },
      {
        id: 'noUcc',
        condition: !formData.mustUccFile,
        level: 'medium',
        title: 'No UCC Filing Authorization',
        message: 'Without UCC filing authorization, the security interest may not be properly perfected against third parties. It is recommended to include UCC filing authorization.'
      },
      {
        id: 'shortCurePeriod',
        condition: parseInt(formData.cureNoticePeriod) < 5,
        level: 'medium',
        title: 'Short Cure Period',
        message: 'The cure period is very short, which may not provide sufficient time to remedy a default. Consider extending the cure period to at least 5-10 business days.'
      },
      {
        id: 'distributionRightsAssigned',
        condition: formData.distributionRights !== 'retain',
        level: 'low',
        title: 'Distribution Rights Assigned',
        message: 'Distribution rights are assigned immediately rather than upon default. This means the Company will receive all distributions from the membership interest even before a default occurs.'
      },
      {
        id: 'votingRightsAssigned',
        condition: formData.votingRights !== 'retain',
        level: 'low',
        title: 'Voting Rights Assigned',
        message: 'Voting rights are assigned immediately rather than upon default. This reduces the pledgor\'s control over the Company even before a default occurs.'
      }
    ];
    
    // Filter active risks
    const activeRisks = risks.filter(risk => risk.condition);
    
    return (
      <div className="risk-assessment">
        <h3>Risk Assessment</h3>
        
        {activeRisks.length === 0 ? (
          <div className="risk-item risk-low">
            <h4>No Significant Risks Detected</h4>
            <p>All critical fields have been completed appropriately. Review the agreement once more before finalizing.</p>
          </div>
        ) : (
          activeRisks.map(risk => (
            <div key={risk.id} className={`risk-item risk-${risk.level}`}>
              <h4>{risk.title}</h4>
              <p>{risk.message}</p>
            </div>
          ))
        )}
      </div>
    );
  };
  
  // Render current tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Pledgor & Company Info
        return (
          <div className="form-section">
            <h3>Pledgor Information</h3>
            <div className="form-group">
              <label htmlFor="pledgorName">Pledgor Name</label>
              <input 
                type="text" 
                id="pledgorName" 
                name="pledgorName" 
                value={formData.pledgorName} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="pledgorAddress">Pledgor Address</label>
              <input 
                type="text" 
                id="pledgorAddress" 
                name="pledgorAddress" 
                value={formData.pledgorAddress} 
                onChange={handleChange} 
              />
            </div>
            
            <h3>Company Information</h3>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input 
                type="text" 
                id="companyName" 
                name="companyName" 
                value={formData.companyName} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="companyAddress">Company Address</label>
              <input 
                type="text" 
                id="companyAddress" 
                name="companyAddress" 
                value={formData.companyAddress} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="stateOfFormation">State of Formation</label>
              <input 
                type="text" 
                id="stateOfFormation" 
                name="stateOfFormation" 
                value={formData.stateOfFormation} 
                onChange={handleChange} 
              />
            </div>
            
            <h3>Membership Interest Details</h3>
            <div className="form-row">
              <div className="form-group md">
                <label htmlFor="membershipUnits">Number of Units Pledged</label>
                <input 
                  type="text" 
                  id="membershipUnits" 
                  name="membershipUnits" 
                  value={formData.membershipUnits} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="form-group md">
                <label htmlFor="membershipPercentage">Percentage of Ownership (%)</label>
                <input 
                  type="text" 
                  id="membershipPercentage" 
                  name="membershipPercentage" 
                  value={formData.membershipPercentage} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="membershipCertificateNumber">
                Membership Certificate Number (if applicable)
              </label>
              <input 
                type="text" 
                id="membershipCertificateNumber" 
                name="membershipCertificateNumber" 
                value={formData.membershipCertificateNumber} 
                onChange={handleChange} 
                placeholder="Optional" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfAgreement">Date of Agreement</label>
              <input 
                type="date" 
                id="dateOfAgreement" 
                name="dateOfAgreement" 
                value={formData.dateOfAgreement} 
                onChange={handleChange} 
              />
            </div>
          </div>
        );
        
      case 1: // Secured Obligations
        return (
          <div className="form-section">
            <h3>Secured Obligations</h3>
            
            <div className="form-group">
              <label>Type of Obligation</label>
              <div className="form-row">
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="obligationTypeLoan" 
                    name="obligationType" 
                    value="loan" 
                    checked={formData.obligationType === 'loan'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="obligationTypeLoan">Loan</label>
                </div>
                
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="obligationTypePerformance" 
                    name="obligationType" 
                    value="performance" 
                    checked={formData.obligationType === 'performance'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="obligationTypePerformance">Performance Obligations</label>
                </div>
              </div>
            </div>
            
            {formData.obligationType === 'loan' ? (
              <>
                <div className="form-row">
                  <div className="form-group md">
                    <label htmlFor="loanAmount">Loan Amount ($)</label>
                    <input 
                      type="text" 
                      id="loanAmount" 
                      name="loanAmount" 
                      value={formData.loanAmount} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="form-group md">
                    <label htmlFor="loanInterestRate">Interest Rate (%)</label>
                    <input 
                      type="text" 
                      id="loanInterestRate" 
                      name="loanInterestRate" 
                      value={formData.loanInterestRate} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group md">
                    <label htmlFor="loanDate">Loan Date</label>
                    <input 
                      type="date" 
                      id="loanDate" 
                      name="loanDate" 
                      value={formData.loanDate} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="form-group md">
                    <label htmlFor="loanMaturityDate">Maturity Date</label>
                    <input 
                      type="date" 
                      id="loanMaturityDate" 
                      name="loanMaturityDate" 
                      value={formData.loanMaturityDate} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="performanceObligations">
                  Performance Obligations 
                  <Tooltip text="Describe the specific obligations the member must perform for the company" />
                </label>
                <textarea 
                  id="performanceObligations" 
                  name="performanceObligations" 
                  value={formData.performanceObligations} 
                  onChange={handleChange} 
                  placeholder="e.g., providing consulting services, maintaining intellectual property, non-compete obligations"
                />
              </div>
            )}
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="includeGeneralObligations" 
                name="includeGeneralObligations" 
                checked={formData.includeGeneralObligations} 
                onChange={handleChange} 
              />
              <label htmlFor="includeGeneralObligations">
                Include general clause for other obligations and indebtedness
                <Tooltip text="This will secure all other current and future obligations of the pledgor to the company" />
              </label>
            </div>
          </div>
        );
        
      case 2: // Security Interest
        return (
          <div className="form-section">
            <h3>Security Interest Terms</h3>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="pledgeCertificates" 
                name="pledgeCertificates" 
                checked={formData.pledgeCertificates} 
                onChange={handleChange} 
              />
              <label htmlFor="pledgeCertificates">
                Include certificate pledge provisions
                <Tooltip text="Include provisions regarding membership certificates (if the LLC has issued them)" />
              </label>
            </div>
            
            {formData.pledgeCertificates && (
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="deliverCertificates" 
                  name="deliverCertificates" 
                  checked={formData.deliverCertificates} 
                  onChange={handleChange} 
                />
                <label htmlFor="deliverCertificates">
                  Require physical delivery of certificates
                  <Tooltip text="Pledgor must physically deliver the membership certificates to the company" />
                </label>
              </div>
            )}
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="powerOfAttorney" 
                name="powerOfAttorney" 
                checked={formData.powerOfAttorney} 
                onChange={handleChange} 
              />
              <label htmlFor="powerOfAttorney">
                Include power of attorney provisions
                <Tooltip text="Gives the company power to act on behalf of the pledgor after default" />
              </label>
            </div>
            
            <div className="form-group">
              <label>Voting Rights</label>
              <div className="form-row">
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="votingRightsRetain" 
                    name="votingRights" 
                    value="retain" 
                    checked={formData.votingRights === 'retain'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="votingRightsRetain">
                    Pledgor retains until default
                    <Tooltip text="Pledgor keeps voting rights until a default occurs" />
                  </label>
                </div>
                
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="votingRightsAssign" 
                    name="votingRights" 
                    value="assign" 
                    checked={formData.votingRights === 'assign'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="votingRightsAssign">
                    Assign to company immediately
                    <Tooltip text="Company gets voting rights immediately upon executing this agreement" />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Distribution Rights</label>
              <div className="form-row">
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="distributionRightsRetain" 
                    name="distributionRights" 
                    value="retain" 
                    checked={formData.distributionRights === 'retain'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="distributionRightsRetain">
                    Pledgor retains until default
                    <Tooltip text="Pledgor continues receiving distributions until a default occurs" />
                  </label>
                </div>
                
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="distributionRightsAssign" 
                    name="distributionRights" 
                    value="assign" 
                    checked={formData.distributionRights === 'assign'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="distributionRightsAssign">
                    Assign to company immediately
                    <Tooltip text="Company receives all distributions immediately upon executing this agreement" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // Default & Remedies
        return (
          <div className="form-section">
            <h3>Default and Remedies</h3>
            
            <div className="form-group">
              <label htmlFor="cureNoticePeriod">
                Cure Period (days)
                <Tooltip text="Number of days the pledgor has to fix a default after receiving notice" />
              </label>
              <input 
                type="number" 
                id="cureNoticePeriod" 
                name="cureNoticePeriod" 
                value={formData.cureNoticePeriod} 
                onChange={handleChange} 
                min="1" 
                max="90" 
              />
            </div>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="includeCrossDefault" 
                name="includeCrossDefault" 
                checked={formData.includeCrossDefault} 
                onChange={handleChange} 
              />
              <label htmlFor="includeCrossDefault">
                Include cross-default provision
                <Tooltip text="Default under any other agreement with the company will trigger a default under this agreement" />
              </label>
            </div>
            
            <h3>Remedies</h3>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="autoSale" 
                name="autoSale" 
                checked={formData.autoSale} 
                onChange={handleChange} 
              />
              <label htmlFor="autoSale">
                Allow automatic transfer of collateral on default
                <Tooltip text="Company can transfer ownership of the pledged interests without additional notice" />
              </label>
            </div>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="autoMembershipTransfer" 
                name="autoMembershipTransfer" 
                checked={formData.autoMembershipTransfer} 
                onChange={handleChange} 
              />
              <label htmlFor="autoMembershipTransfer">
                Allow company to become substitute member
                <Tooltip text="Company can become a member of the LLC with respect to the pledged interests" />
              </label>
            </div>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="includeForeclosureSale" 
                name="includeForeclosureSale" 
                checked={formData.includeForeclosureSale} 
                onChange={handleChange} 
              />
              <label htmlFor="includeForeclosureSale">
                Include foreclosure sale provisions
                <Tooltip text="Company can sell the collateral at public or private sale" />
              </label>
            </div>
          </div>
        );
        
      case 4: // Miscellaneous
        return (
          <div className="form-section">
            <h3>Miscellaneous Provisions</h3>
            
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law</label>
              <select 
                id="governingLaw" 
                name="governingLaw" 
                value={formData.governingLaw} 
                onChange={handleChange}
              >
                <option value="Delaware">Delaware</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="Illinois">Illinois</option>
                <option value="Nevada">Nevada</option>
                <option value="Wyoming">Wyoming</option>
              </select>
            </div>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="attorneyFees" 
                name="attorneyFees" 
                checked={formData.attorneyFees} 
                onChange={handleChange} 
              />
              <label htmlFor="attorneyFees">
                Include attorney's fees provision
                <Tooltip text="Losing party pays attorney's fees in case of dispute" />
              </label>
            </div>
            
            <div className="form-group">
              <label>Dispute Resolution</label>
              <div className="form-row">
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="disputeResolutionArbitration" 
                    name="disputeResolution" 
                    value="arbitration" 
                    checked={formData.disputeResolution === 'arbitration'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="disputeResolutionArbitration">Arbitration</label>
                </div>
                
                <div className="checkbox-group">
                  <input 
                    type="radio" 
                    id="disputeResolutionCourt" 
                    name="disputeResolution" 
                    value="court" 
                    checked={formData.disputeResolution === 'court'} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="disputeResolutionCourt">Court</label>
                </div>
              </div>
            </div>
            
            {formData.disputeResolution === 'arbitration' ? (
              <div className="form-group">
                <label htmlFor="arbitrationVenue">Arbitration Venue</label>
                <input 
                  type="text" 
                  id="arbitrationVenue" 
                  name="arbitrationVenue" 
                  value={formData.arbitrationVenue} 
                  onChange={handleChange} 
                  placeholder="e.g., San Francisco, California" 
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="courtVenue">Court Venue</label>
                <input 
                  type="text" 
                  id="courtVenue" 
                  name="courtVenue" 
                  value={formData.courtVenue} 
                  onChange={handleChange} 
                  placeholder="e.g., Wilmington, Delaware" 
                />
              </div>
            )}
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="mustUccFile" 
                name="mustUccFile" 
                checked={formData.mustUccFile} 
                onChange={handleChange} 
              />
              <label htmlFor="mustUccFile">
                Include UCC filing authorization
                <Tooltip text="Authorizes the company to file UCC financing statements" />
              </label>
            </div>
            
            <div className="form-row">
              <div className="form-group md">
                <label htmlFor="documentTitle">Document Title (for Word download)</label>
                <input 
                  type="text" 
                  id="documentTitle" 
                  name="documentTitle" 
                  value={formData.documentTitle} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="form-group md">
                <label htmlFor="fileName">File Name (for Word download)</label>
                <input 
                  type="text" 
                  id="fileName" 
                  name="fileName" 
                  value={formData.fileName} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
        );
        
      case 5: // Finalize & Review
        return (
          <div className="form-section">
            <h3>Final Review</h3>
            <p>
              Review your Membership Pledge & Security Agreement. The document secures 
              {formData.obligationType === 'loan' 
                ? ` a loan of $${parseFloat(formData.loanAmount).toLocaleString()} at ${formData.loanInterestRate}% interest` 
                : ' performance obligations'} 
              with {formData.membershipUnits} membership units ({formData.membershipPercentage}%) of {formData.companyName}.
            </p>
            
            {renderRiskAssessment()}
            
            <h3>Key Legal Considerations</h3>
            <ul>
              <li>This agreement creates a security interest in LLC membership units as collateral</li>
              <li>In case of default, the company may have the right to take ownership of the pledged membership interests</li>
              <li>The agreement should be executed alongside any loan documentation</li>
              <li>UCC-1 financing statements should be filed to perfect the security interest</li>
              <li>The operating agreement should be reviewed to ensure it allows membership pledges</li>
            </ul>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Ready to finalize?</label>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>
                You can download your document as an MS Word file or copy to clipboard using the buttons below.
                If you need further assistance, schedule a consultation with our attorney.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Main component render
  return (
    <div className="app-container">
      <div className="generator-heading">
        <h1>Membership Pledge & Security Agreement Generator</h1>
        <p style={{ fontSize: '0.95rem', color: '#4b5563', marginTop: '0.5rem', maxWidth: '90%' }}>
          Create a customized security agreement that uses LLC membership units as collateral for loans or performance obligations. This legally-binding document establishes a security interest that the company can enforce if a member defaults, protecting the company's interests while clearly defining rights and remedies.
        </p>
      </div>
      
      <div className="tabs-container">
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
      
      <div className="main-content">
        <div className="form-panel">
          {renderTabContent()}
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
      
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
          disabled={currentTab === 0}
        >
          <Icon name="chevron-left" style={{marginRight: "0.25rem"}} />
          Previous
        </button>
        
        <div className="button-group">
          <button
            onClick={copyToClipboard}
            className="nav-button copy-button"
          >
            <Icon name="copy" style={{marginRight: "0.25rem"}} />
            Copy to Clipboard
          </button>
          
          <button
            onClick={downloadAsWord}
            className="nav-button download-button"
          >
            <Icon name="file-text" style={{marginRight: "0.25rem"}} />
            Download MS Word
          </button>
          
          <button
            onClick={openCalendly}
            className="nav-button consult-button"
          >
            <Icon name="calendar" style={{marginRight: "0.25rem"}} />
            Consultation
          </button>
        </div>
        
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
};

// Render the application
ReactDOM.render(
  <MembershipPledgeGenerator />,
  document.getElementById('root')
);

document.addEventListener("DOMContentLoaded", function() {
  feather.replace();
});