// Tariff Reimbursement Side Letter Generator
const App = () => {
  // Icon component
  const Icon = ({ name, ...props }) => {
    return (
      <i data-feather={name} {...props}></i>
    );
  };

  // State for form data
  const [formData, setFormData] = React.useState({
    // Party Information
    supplierName: "",
    supplierAddress: "",
    supplierState: "",
    supplierCountry: "",
    supplierContact: "",
    supplierEmail: "",
    distributorName: "",
    distributorAddress: "",
    distributorState: "",
    distributorCountry: "",
    distributorContact: "",
    distributorEmail: "",
    
    // Agreement Details
    agreementName: "Distribution Agreement",
    agreementDate: "",
    effectiveDate: "",
    expirationDate: "",
    
    // Tariff Terms
    tariffThreshold: "10",
    appliedProducts: "",
    productList: "",
    reimbursementPercentage: "100",
    responsibleParty: "supplier", // supplier or distributor
    includeCapAmount: false,
    capAmount: "",
    tariffReportingFrequency: "monthly", // monthly, quarterly, as-incurred
    
    // Procedures
    reimbursementTimeline: "30",
    documentationRequired: true,
    invoiceRequired: true,
    customsDocumentsRequired: true,
    disputeResolutionMechanism: "arbitration", // arbitration, litigation
    governingLaw: "California",
    governingCountry: "United States",
    
    // Other
    agreementTerm: "12",
    terminationNoticePeriod: "30"
  });

  // State for current tab
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);

  // Ref for preview content div
  const previewRef = React.useRef(null);

  // Tabs configuration
  const tabs = [
    { id: 'parties', label: 'Party Information' },
    { id: 'agreement', label: 'Agreement Details' },
    { id: 'tariff-terms', label: 'Tariff Terms' },
    { id: 'procedures', label: 'Procedures' },
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

  // Copy to clipboard function
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert("Document text copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy: ", error);
      alert("Failed to copy text. Please try again.");
    }
  };

  // Download as Word document
  const downloadAsWord = () => {
    try {
      window.generateWordDoc(documentText, {
        documentTitle: "Tariff Reimbursement Side Letter",
        fileName: `Tariff-Reimbursement-Side-Letter-${formData.supplierName.replace(/\s+/g, '-')}-${formData.distributorName.replace(/\s+/g, '-')}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Function to validate form before allowing to proceed
  const isCurrentTabValid = () => {
    switch (currentTab) {
      case 0: // Parties tab
        return formData.supplierName && formData.distributorName;
      case 1: // Agreement tab
        return formData.agreementDate && formData.effectiveDate;
      case 2: // Tariff Terms tab
        return formData.appliedProducts && formData.tariffThreshold;
      case 3: // Procedures tab
        return formData.reimbursementTimeline && formData.governingLaw;
      case 4: // Review tab
        return true;
      default:
        return true;
    }
  };

  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    const highlightMap = {
      // Party Information
      supplierName: 'supplier-section',
      supplierAddress: 'supplier-section',
      supplierState: 'supplier-section',
      supplierCountry: 'supplier-section',
      supplierContact: 'supplier-section',
      supplierEmail: 'supplier-section',
      distributorName: 'distributor-section',
      distributorAddress: 'distributor-section',
      distributorState: 'distributor-section',
      distributorCountry: 'distributor-section',
      distributorContact: 'distributor-section',
      distributorEmail: 'distributor-section',
      
      // Agreement Details
      agreementName: 'agreement-reference',
      agreementDate: 'agreement-reference',
      effectiveDate: 'effective-date',
      expirationDate: 'expiration-date',
      
      // Tariff Terms
      tariffThreshold: 'tariff-definition',
      appliedProducts: 'applied-products',
      productList: 'product-list',
      reimbursementPercentage: 'reimbursement-percentage',
      responsibleParty: 'responsible-party',
      includeCapAmount: 'cap-amount',
      capAmount: 'cap-amount',
      tariffReportingFrequency: 'reporting-frequency',
      
      // Procedures
      reimbursementTimeline: 'reimbursement-timeline',
      documentationRequired: 'documentation-required',
      invoiceRequired: 'documentation-required',
      customsDocumentsRequired: 'documentation-required',
      disputeResolutionMechanism: 'dispute-resolution',
      governingLaw: 'governing-law',
      governingCountry: 'governing-law',
      
      // Other
      agreementTerm: 'agreement-term',
      terminationNoticePeriod: 'termination-notice'
    };
    
    return lastChanged ? highlightMap[lastChanged] : null;
  };

  // Generate document text based on form data
  const generateDocument = () => {
    const {
      supplierName,
      supplierAddress,
      supplierState,
      supplierCountry,
      supplierContact,
      supplierEmail,
      distributorName,
      distributorAddress,
      distributorState,
      distributorCountry,
      distributorContact,
      distributorEmail,
      agreementName,
      agreementDate,
      effectiveDate,
      expirationDate,
      tariffThreshold,
      appliedProducts,
      productList,
      reimbursementPercentage,
      responsibleParty,
      includeCapAmount,
      capAmount,
      tariffReportingFrequency,
      reimbursementTimeline,
      documentationRequired,
      invoiceRequired,
      customsDocumentsRequired,
      disputeResolutionMechanism,
      governingLaw,
      governingCountry,
      agreementTerm,
      terminationNoticePeriod
    } = formData;
    
    // Format dates if provided
    const formattedAgreementDate = agreementDate ? new Date(agreementDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "[Agreement Date]";
    const formattedEffectiveDate = effectiveDate ? new Date(effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "[Effective Date]";
    const formattedExpirationDate = expirationDate ? new Date(expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (agreementTerm ? `the date that is ${agreementTerm} months after the Effective Date` : "[Expiration Date]");
    
    // Format tariff reporting frequency
    let reportingFrequencyText = "monthly";
    switch (tariffReportingFrequency) {
      case "monthly":
        reportingFrequencyText = "on a monthly basis, within fifteen (15) days following the end of each calendar month";
        break;
      case "quarterly":
        reportingFrequencyText = "on a quarterly basis, within thirty (30) days following the end of each calendar quarter";
        break;
      case "as-incurred":
        reportingFrequencyText = "as and when such Excess Tariffs are incurred";
        break;
      default:
        reportingFrequencyText = "monthly";
    }
    
    // Format dispute resolution mechanism
    let disputeResolutionText = "";
    switch (disputeResolutionMechanism) {
      case "arbitration":
        disputeResolutionText = `Any dispute arising out of or in connection with this Side Letter shall be referred to and finally resolved by arbitration under the rules of the American Arbitration Association, which rules are deemed to be incorporated by reference into this clause. The seat of arbitration shall be ${governingLaw}, ${governingCountry}. The language of the arbitration shall be English. The number of arbitrators shall be one.`;
        break;
      case "litigation":
        disputeResolutionText = `Any dispute arising out of or in connection with this Side Letter shall be subject to the exclusive jurisdiction of the courts of ${governingLaw}, ${governingCountry}.`;
        break;
      default:
        disputeResolutionText = `Any dispute arising out of or in connection with this Side Letter shall be referred to and finally resolved by arbitration under the rules of the American Arbitration Association, which rules are deemed to be incorporated by reference into this clause. The seat of arbitration shall be ${governingLaw}, ${governingCountry}. The language of the arbitration shall be English. The number of arbitrators shall be one.`;
    }
    
    // Documentation requirements
    const documentationReqs = [];
    if (invoiceRequired) documentationReqs.push("copies of relevant invoices");
    if (customsDocumentsRequired) documentationReqs.push("customs documentation");
    if (documentationReqs.length === 0) documentationReqs.push("reasonable supporting documentation");
    
    const documentationRequirementsText = documentationReqs.join(" and ");
    
    // Generate the document text
    return `TARIFF REIMBURSEMENT SIDE LETTER

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

BETWEEN:

${supplierName || "[Supplier Name]"} (the "Supplier")
${supplierAddress ? supplierAddress + ", " : ""}${supplierState ? supplierState + ", " : ""}${supplierCountry || ""}
Contact: ${supplierContact || "[Contact Person]"}
Email: ${supplierEmail || "[Email]"}

AND:

${distributorName || "[Distributor Name]"} (the "Distributor")
${distributorAddress ? distributorAddress + ", " : ""}${distributorState ? distributorState + ", " : ""}${distributorCountry || ""}
Contact: ${distributorContact || "[Contact Person]"}
Email: ${distributorEmail || "[Email]"}

(each a "Party" and together the "Parties")

RECITALS:

WHEREAS, the Parties have entered into a ${agreementName || "Distribution Agreement"} dated ${formattedAgreementDate} (the "Agreement");

WHEREAS, the Agreement provides for the distribution of certain products as defined therein;

WHEREAS, since the execution of the Agreement, there have been, or may be, increases in import tariffs applicable to the products distributed under the Agreement; and

WHEREAS, the Parties wish to establish a mechanism to address the allocation of the costs associated with such tariff increases;

NOW, THEREFORE, the Parties agree as follows:

1. DEFINITIONS

1.1. "Effective Date" means ${formattedEffectiveDate}.

1.2. "Excess Tariffs" means any import tariffs, duties, levies, or similar governmental charges imposed on the Products that exceed by more than ${tariffThreshold || "10"}% the tariffs in effect as of the date of the Agreement.

1.3. "Products" means ${appliedProducts || "the products distributed under the Agreement"}${productList ? ", specifically: " + productList : ""}.

2. TARIFF REIMBURSEMENT

2.1. Responsibility for Excess Tariffs. The ${responsibleParty === "supplier" ? "Supplier" : "Distributor"} shall be responsible for ${reimbursementPercentage || "100"}% of any Excess Tariffs incurred in connection with the importation of the Products.

2.2. Reimbursement Mechanism. The ${responsibleParty === "supplier" ? "Supplier shall reimburse the Distributor" : "Distributor shall reimburse the Supplier"} for ${reimbursementPercentage || "100"}% of any Excess Tariffs incurred${includeCapAmount && capAmount ? ", up to a maximum amount of " + capAmount + " per calendar year" : ""}.

2.3. Reporting. The Party incurring the Excess Tariffs shall report such Excess Tariffs to the other Party ${reportingFrequencyText}.

3. PROCEDURE FOR REIMBURSEMENT

3.1. Reimbursement Request. To obtain reimbursement for Excess Tariffs, the Party seeking reimbursement shall submit a written request to the other Party, accompanied by ${documentationRequirementsText} evidencing the amount of the Excess Tariffs incurred.

3.2. Payment Timeline. The Party responsible for reimbursement shall pay any properly documented Excess Tariffs within ${reimbursementTimeline || "30"} days of receiving a reimbursement request that complies with Section 3.1.

3.3. Dispute Resolution. ${disputeResolutionText}

4. TERM AND TERMINATION

4.1. Term. This Side Letter shall commence on the Effective Date and shall continue until ${formattedExpirationDate}, unless earlier terminated in accordance with this Section 4.

4.2. Termination. Either Party may terminate this Side Letter upon ${terminationNoticePeriod || "30"} days' prior written notice to the other Party.

4.3. Effect of Termination. Termination of this Side Letter shall not affect the validity of the Agreement, which shall continue in full force and effect in accordance with its terms.

5. MISCELLANEOUS

5.1. Integration with Agreement. This Side Letter supplements the Agreement. Except as expressly modified by this Side Letter, all terms and conditions of the Agreement shall remain in full force and effect.

5.2. Governing Law. This Side Letter shall be governed by and construed in accordance with the laws of ${governingLaw || "the State of California"}, ${governingCountry || "United States"}, without giving effect to any choice of law or conflict of law provisions.

5.3. Counterparts. This Side Letter may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.

5.4. Entire Agreement. This Side Letter, together with the Agreement, constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior negotiations, understandings, and agreements.

IN WITNESS WHEREOF, the Parties have executed this Side Letter as of the date first written above.

SUPPLIER:
${supplierName || "[SUPPLIER NAME]"}

By: ____________________________
Name: ${supplierContact || "[NAME]"}
Title: ____________________________

DISTRIBUTOR:
${distributorName || "[DISTRIBUTOR NAME]"}

By: ____________________________
Name: ${distributorContact || "[NAME]"}
Title: ____________________________`;
  };

  // Generate document text
  const documentText = generateDocument();

  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    // Define regex patterns for different sections of the document
    const sections = {
      'supplier-section': new RegExp(`${formData.supplierName || "\\[Supplier Name\\]"}.*?(?=AND:)`, 's'),
      'distributor-section': new RegExp(`${formData.distributorName || "\\[Distributor Name\\]"}.*?(?=\\(each a "Party")`, 's'),
      'agreement-reference': /WHEREAS, the Parties have entered into a.*?\(the "Agreement"\);/s,
      'effective-date': /"Effective Date" means.*?\./s,
      'expiration-date': /This Side Letter shall commence on the Effective Date and shall continue until.*?, unless/s,
      'tariff-definition': /"Excess Tariffs" means any import tariffs.*?Agreement\./s,
      'applied-products': /"Products" means.*?\.(?=\n)/s,
      'product-list': /specifically:.*?\.(?=\n)/s,
      'responsible-party': /2\.1\. Responsibility for Excess Tariffs.*?\.(?=\n)/s,
      'reimbursement-percentage': /2\.2\. Reimbursement Mechanism.*?\.(?=\n)/s,
      'cap-amount': /up to a maximum amount of.*?per calendar year/s,
      'reporting-frequency': /2\.3\. Reporting.*?\.(?=\n)/s,
      'documentation-required': /accompanied by.*?incurred\./s,
      'reimbursement-timeline': /within \d+ days of receiving/s,
      'dispute-resolution': /3\.3\. Dispute Resolution.*?\.(?=\n)/s,
      'governing-law': /5\.2\. Governing Law.*?\.(?=\n)/s,
      'agreement-term': /4\.1\. Term.*?\.(?=\n)/s,
      'termination-notice': /upon \d+ days' prior written notice/s
    };
    
    // Find and highlight the section
    if (sections[sectionToHighlight]) {
      return documentText.replace(sections[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };

  // Create highlightable content
  const highlightedText = createHighlightedText();

  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

  // Function to assess risks in the document
  const assessRisks = () => {
    const risks = [];
    
    // Check for missing party information
    if (!formData.supplierName || !formData.distributorName) {
      risks.push({
        level: 'high',
        message: 'Missing essential party information. Both supplier and distributor names must be provided to create a valid agreement.'
      });
    }
    
    // Check for missing agreement date
    if (!formData.agreementDate) {
      risks.push({
        level: 'high',
        message: 'Missing agreement date. The side letter must reference a specific date of the original agreement.'
      });
    }
    
    // Check for missing effective date
    if (!formData.effectiveDate) {
      risks.push({
        level: 'high',
        message: 'Missing effective date. The side letter must specify when the tariff reimbursement arrangement begins.'
      });
    }
    
    // Check for tariff threshold
    if (!formData.tariffThreshold) {
      risks.push({
        level: 'medium',
        message: 'No tariff threshold specified. Consider defining what constitutes an "excess" tariff.'
      });
    } else if (parseInt(formData.tariffThreshold) <= 0) {
      risks.push({
        level: 'medium',
        message: 'Tariff threshold is set to zero or negative, meaning that any tariff would trigger reimbursement. Consider whether this is appropriate for your business.'
      });
    }
    
    // Check for product specification
    if (!formData.appliedProducts) {
      risks.push({
        level: 'medium',
        message: 'No specific products listed. Consider clearly defining which products are subject to the tariff reimbursement agreement.'
      });
    }
    
    // Check for cap amount if selected
    if (formData.includeCapAmount && !formData.capAmount) {
      risks.push({
        level: 'medium',
        message: 'Cap amount option selected but no amount specified. Provide a maximum reimbursement amount or disable the cap feature.'
      });
    }
    
    // Check if distributor bears responsibility without caps
    if (formData.responsibleParty === 'distributor' && (!formData.includeCapAmount || !formData.capAmount)) {
      risks.push({
        level: 'medium',
        message: 'Distributor bears unlimited responsibility for tariff increases. Consider adding a cap amount to limit financial exposure.'
      });
    }
    
    // Check reimbursement timeline
    if (!formData.reimbursementTimeline) {
      risks.push({
        level: 'low',
        message: 'No reimbursement timeline specified. A default of 30 days will be used.'
      });
    } else if (parseInt(formData.reimbursementTimeline) < 15) {
      risks.push({
        level: 'low',
        message: 'Short reimbursement timeline may be difficult to comply with. Consider allowing more time for processing payments.'
      });
    }
    
    // Check for governing law
    if (!formData.governingLaw) {
      risks.push({
        level: 'medium',
        message: 'No governing law specified. This could create uncertainty in case of disputes.'
      });
    }
    
    // Check for expiration date consistency
    if (formData.expirationDate && formData.agreementTerm) {
      risks.push({
        level: 'low',
        message: 'Both specific expiration date and term duration provided. The specific date will take precedence.'
      });
    }
    
    // Check term notification period
    if (!formData.terminationNoticePeriod) {
      risks.push({
        level: 'low',
        message: 'No termination notice period specified. A default of 30 days will be used.'
      });
    } else if (parseInt(formData.terminationNoticePeriod) < 15) {
      risks.push({
        level: 'low',
        message: 'Short termination notice period may not provide adequate time for business adjustment.'
      });
    }
    
    return risks;
  };

  const risks = assessRisks();

  // Render content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Party Information
        return (
          <div>
            <h2>Supplier Information</h2>
            <div className="form-group">
              <label htmlFor="supplierName">Supplier Name*</label>
              <input 
                type="text" 
                id="supplierName" 
                name="supplierName" 
                value={formData.supplierName} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="supplierAddress">Address</label>
              <input 
                type="text" 
                id="supplierAddress" 
                name="supplierAddress" 
                value={formData.supplierAddress} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="supplierState">State/Province</label>
              <input 
                type="text" 
                id="supplierState" 
                name="supplierState" 
                value={formData.supplierState} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="supplierCountry">Country</label>
              <input 
                type="text" 
                id="supplierCountry" 
                name="supplierCountry" 
                value={formData.supplierCountry} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="supplierContact">Contact Person</label>
              <input 
                type="text" 
                id="supplierContact" 
                name="supplierContact" 
                value={formData.supplierContact} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="supplierEmail">Email</label>
              <input 
                type="email" 
                id="supplierEmail" 
                name="supplierEmail" 
                value={formData.supplierEmail} 
                onChange={handleChange} 
              />
            </div>
            
            <h2>Distributor Information</h2>
            <div className="form-group">
              <label htmlFor="distributorName">Distributor Name*</label>
              <input 
                type="text" 
                id="distributorName" 
                name="distributorName" 
                value={formData.distributorName} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="distributorAddress">Address</label>
              <input 
                type="text" 
                id="distributorAddress" 
                name="distributorAddress" 
                value={formData.distributorAddress} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="distributorState">State/Province</label>
              <input 
                type="text" 
                id="distributorState" 
                name="distributorState" 
                value={formData.distributorState} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="distributorCountry">Country</label>
              <input 
                type="text" 
                id="distributorCountry" 
                name="distributorCountry" 
                value={formData.distributorCountry} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="distributorContact">Contact Person</label>
              <input 
                type="text" 
                id="distributorContact" 
                name="distributorContact" 
                value={formData.distributorContact} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="distributorEmail">Email</label>
              <input 
                type="email" 
                id="distributorEmail" 
                name="distributorEmail" 
                value={formData.distributorEmail} 
                onChange={handleChange} 
              />
            </div>
          </div>
        );
        
      case 1: // Agreement Details
        return (
          <div>
            <h2>Original Agreement Information</h2>
            <div className="form-group">
              <label htmlFor="agreementName">Agreement Type</label>
              <select
                id="agreementName"
                name="agreementName"
                value={formData.agreementName}
                onChange={handleChange}
              >
                <option value="Distribution Agreement">Distribution Agreement</option>
                <option value="Supply Agreement">Supply Agreement</option>
                <option value="Manufacturing Agreement">Manufacturing Agreement</option>
                <option value="Purchase Agreement">Purchase Agreement</option>
                <option value="Vendor Agreement">Vendor Agreement</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="agreementDate">Original Agreement Date*</label>
              <span className="label-description">The date when the original agreement was signed</span>
              <input 
                type="date" 
                id="agreementDate" 
                name="agreementDate" 
                value={formData.agreementDate} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <h2>Side Letter Details</h2>
            <div className="form-group">
              <label htmlFor="effectiveDate">Effective Date*</label>
              <span className="label-description">When this side letter agreement will take effect</span>
              <input 
                type="date" 
                id="effectiveDate" 
                name="effectiveDate" 
                value={formData.effectiveDate} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="agreementTerm">Term (Months)</label>
              <span className="label-description">How long this side letter will remain in effect (in months)</span>
              <input 
                type="number" 
                id="agreementTerm" 
                name="agreementTerm" 
                value={formData.agreementTerm} 
                onChange={handleChange} 
                min="1"
                max="120"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expirationDate">Specific Expiration Date (Optional)</label>
              <span className="label-description">If set, this will override the term months</span>
              <input 
                type="date" 
                id="expirationDate" 
                name="expirationDate" 
                value={formData.expirationDate} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="terminationNoticePeriod">Termination Notice Period (Days)</label>
              <span className="label-description">How many days' notice is required to terminate this side letter</span>
              <input 
                type="number" 
                id="terminationNoticePeriod" 
                name="terminationNoticePeriod" 
                value={formData.terminationNoticePeriod} 
                onChange={handleChange} 
                min="1"
                max="180"
              />
            </div>
          </div>
        );
        
      case 2: // Tariff Terms
        return (
          <div>
            <h2>Excess Tariff Definition</h2>
            <div className="form-group">
              <label htmlFor="tariffThreshold">Tariff Threshold Percentage*</label>
              <span className="label-description">Tariffs exceeding the original tariff rate by this percentage will be considered "excess tariffs"</span>
              <input 
                type="number" 
                id="tariffThreshold" 
                name="tariffThreshold" 
                value={formData.tariffThreshold} 
                onChange={handleChange} 
                min="0"
                max="100"
                required 
              />
            </div>
            
            <h2>Covered Products</h2>
            <div className="form-group">
              <label htmlFor="appliedProducts">Products Description*</label>
              <span className="label-description">General description of products covered by this side letter</span>
              <input 
                type="text" 
                id="appliedProducts" 
                name="appliedProducts" 
                value={formData.appliedProducts} 
                onChange={handleChange} 
                placeholder="e.g., all products under the Agreement"
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="productList">Specific Product List (Optional)</label>
              <span className="label-description">List specific products if not all products under the agreement are covered</span>
              <textarea 
                id="productList" 
                name="productList" 
                value={formData.productList} 
                onChange={handleChange} 
                rows="3"
                placeholder="e.g., Product A, Product B, Product C"
              />
            </div>
            
            <h2>Reimbursement Terms</h2>
            <div className="form-group">
              <label htmlFor="responsibleParty">Responsible Party for Excess Tariffs</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="supplierResponsible" 
                    name="responsibleParty" 
                    value="supplier" 
                    checked={formData.responsibleParty === "supplier"} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="supplierResponsible">Supplier bears the cost</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="distributorResponsible" 
                    name="responsibleParty" 
                    value="distributor" 
                    checked={formData.responsibleParty === "distributor"} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="distributorResponsible">Distributor bears the cost</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="reimbursementPercentage">Reimbursement Percentage</label>
              <span className="label-description">Percentage of excess tariffs to be reimbursed</span>
              <input 
                type="number" 
                id="reimbursementPercentage" 
                name="reimbursementPercentage" 
                value={formData.reimbursementPercentage} 
                onChange={handleChange} 
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="includeCapAmount" 
                  name="includeCapAmount" 
                  checked={formData.includeCapAmount} 
                  onChange={handleChange} 
                />
                <label htmlFor="includeCapAmount">Include Maximum Reimbursement Cap</label>
              </div>
            </div>
            
            {formData.includeCapAmount && (
              <div className="form-group">
                <label htmlFor="capAmount">Maximum Annual Reimbursement Cap</label>
                <span className="label-description">Maximum amount to be reimbursed per calendar year</span>
                <input 
                  type="text" 
                  id="capAmount" 
                  name="capAmount" 
                  value={formData.capAmount} 
                  onChange={handleChange} 
                  placeholder="e.g., $50,000 USD"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="tariffReportingFrequency">Reporting Frequency</label>
              <span className="label-description">How often excess tariffs should be reported</span>
              <select
                id="tariffReportingFrequency"
                name="tariffReportingFrequency"
                value={formData.tariffReportingFrequency}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="as-incurred">As Incurred</option>
              </select>
            </div>
          </div>
        );
        
      case 3: // Procedures
        return (
          <div>
            <h2>Reimbursement Process</h2>
            <div className="form-group">
              <label htmlFor="reimbursementTimeline">Payment Timeline (Days)*</label>
              <span className="label-description">Days allowed for reimbursement after receiving a valid request</span>
              <input 
                type="number" 
                id="reimbursementTimeline" 
                name="reimbursementTimeline" 
                value={formData.reimbursementTimeline} 
                onChange={handleChange} 
                min="1"
                max="90"
                required 
              />
            </div>
            
            <h2>Documentation Requirements</h2>
            <div className="form-group">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="invoiceRequired" 
                  name="invoiceRequired" 
                  checked={formData.invoiceRequired} 
                  onChange={handleChange} 
                />
                <label htmlFor="invoiceRequired">Require Invoices</label>
              </div>
              
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="customsDocumentsRequired" 
                  name="customsDocumentsRequired" 
                  checked={formData.customsDocumentsRequired} 
                  onChange={handleChange} 
                />
                <label htmlFor="customsDocumentsRequired">Require Customs Documentation</label>
              </div>
            </div>
            
            <h2>Dispute Resolution</h2>
            <div className="form-group">
              <label htmlFor="disputeResolutionMechanism">Dispute Resolution Method</label>
              <select
                id="disputeResolutionMechanism"
                name="disputeResolutionMechanism"
                value={formData.disputeResolutionMechanism}
                onChange={handleChange}
              >
                <option value="arbitration">Arbitration</option>
                <option value="litigation">Litigation</option>
              </select>
            </div>
            
            <h2>Governing Law</h2>
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law (State/Province)*</label>
              <input 
                type="text" 
                id="governingLaw" 
                name="governingLaw" 
                value={formData.governingLaw} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="governingCountry">Country*</label>
              <input 
                type="text" 
                id="governingCountry" 
                name="governingCountry" 
                value={formData.governingCountry} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
        );
        
      case 4: // Review & Finalize
        return (
          <div>
            <h2>Document Review</h2>
            <p>Please review your Tariff Reimbursement Side Letter before finalizing. Below are potential issues or considerations:</p>
            
            {risks.length > 0 ? (
              <div className="risk-assessment">
                {risks.map((risk, index) => (
                  <div key={index} className={`assessment-item assessment-${risk.level}`}>
                    <strong className={`risk-${risk.level}`}>{risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk:</strong> {risk.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="assessment-item assessment-low">
                <strong className="risk-low">No significant issues detected.</strong> Your document appears to be properly configured.
              </div>
            )}
            
            <h2>Legal Considerations</h2>
            <p>This template is intended to provide a general framework for tariff reimbursement arrangements between commercial parties. Consider the following:</p>
            
            <div className="assessment-item assessment-medium">
              <strong>Tariff Volatility:</strong> International trade tariffs can change frequently. Consider including provisions for periodic review of this arrangement.
            </div>
            
            <div className="assessment-item assessment-medium">
              <strong>Currency Fluctuations:</strong> For international arrangements, consider specifying the currency for reimbursement and whether exchange rate fluctuations will be accounted for.
            </div>
            
            <div className="assessment-item assessment-medium">
              <strong>Documentation:</strong> Clear documentation of tariff increases is essential. Ensure parties understand what constitutes acceptable proof of increased tariffs.
            </div>
            
            <div className="assessment-item assessment-high">
              <strong>Legal Review:</strong> This generator provides a starting point, but it's advisable to have the final document reviewed by legal counsel familiar with international trade in your specific jurisdictions.
            </div>
            
            <h2>Next Steps</h2>
            <p>Once you've reviewed the document:</p>
            <ol>
              <li>Use the "Copy to Clipboard" button to copy the text</li>
              <li>Use the "Download MS Word" button to download as a Word document</li>
              <li>Have all parties review the document</li>
              <li>Make any necessary revisions</li>
              <li>Obtain signatures from authorized representatives of both parties</li>
              <li>Distribute copies to all signatories</li>
              <li>Implement the reporting and reimbursement procedures outlined in the agreement</li>
            </ol>
          </div>
        );
        
      default:
        return <div>Error: Tab not found</div>;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Tariff Reimbursement Side Letter Generator</h1>
        <p>Create a customized side letter to assign responsibility for unexpected tariff increases</p>
      </div>
      
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
      <div className="main-content">
        {/* Form Panel */}
        <div className="form-panel">
          {renderTabContent()}
        </div>
        
        {/* Preview Panel */}
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
          className={`nav-button next-button ${currentTab === tabs.length - 1 || !isCurrentTabValid() ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1 || !isCurrentTabValid()}
        >
          Next
          <Icon name="chevron-right" style={{marginLeft: "0.25rem"}} />
        </button>
      </div>
    </div>
  );
};

// Render the React app
ReactDOM.render(<App />, document.getElementById('root'));