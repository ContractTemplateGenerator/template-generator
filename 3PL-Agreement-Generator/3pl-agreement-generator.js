// 3PL Agreement Generator

// Icon component for using Feather icons
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

// Main Application Component
const App = () => {
  // State for form data
  const [formData, setFormData] = React.useState({
    // Parties Information
    clientName: "",
    clientAddress: "",
    clientState: "",
    clientZip: "",
    providerName: "",
    providerAddress: "",
    providerState: "",
    providerZip: "",
    effectiveDate: "",
    
    // Services
    warehouseServices: true,
    transportationServices: true,
    inventoryManagement: true,
    orderFulfillment: true,
    returnProcessing: true,
    customServices: "",
    
    // Term and Termination
    initialTerm: "12",
    autoRenewal: true,
    renewalPeriod: "12",
    terminationNoticeDays: "60",
    terminationForCause: true,
    
    // Pricing and Payment
    pricingStructure: "fixed",
    pricingDetails: "",
    paymentTerms: "30",
    latePaymentFee: "1.5",
    priceIncreaseNotice: "60",
    
    // Warehousing
    warehouseLocations: "",
    storageConditions: "",
    inventoryReporting: "weekly",
    specialStorageRequirements: "",
    
    // Transportation
    shippingMethods: "",
    carrierSelectionBy: "provider",
    deliveryTimeframes: "",
    transportationKPIs: "",
    
    // Inventory
    inventoryCountFrequency: "quarterly",
    inventoryAccuracyTarget: "98",
    shrinkageAllowance: "0.5",
    stockoutPenalty: false,
    
    // Liability and Insurance
    liabilityLimit: "replacement",
    insuranceRequirement: "2000000",
    freightClaimsPeriod: "30",
    forceMainclause: true,
    
    // Confidentiality
    confidentialityTerm: "24",
    dataProtectionStandards: "",
    dataBreachNotification: "24",
    
    // General
    governingLaw: "California",
    disputeResolution: "arbitration",
    assignmentPermitted: "consent",
    nonSolicitation: true,
    nonSolicitationPeriod: "12"
  });
  
  // State for current tab
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);
  
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
  
  // Tab configuration
  const tabs = [
    { id: 'parties', label: 'Parties' },
    { id: 'services', label: 'Services' },
    { id: 'term', label: 'Term & Termination' },
    { id: 'pricing', label: 'Pricing & Payment' },
    { id: 'warehousing', label: 'Warehousing' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'liability', label: 'Liability & Insurance' },
    { id: 'confidentiality', label: 'Confidentiality' },
    { id: 'general', label: 'General Provisions' },
    { id: 'review', label: 'Review & Finalize' }
  ];
  
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
  
  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateDocument())
      .then(() => {
        alert("Document copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy document to clipboard. Please try again.");
      });
  };
  
  // Download as MS Word
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Generate the document text
      const documentText = generateDocument();
      
      // Check if document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: "3PL Agreement",
        fileName: `3PL-Agreement-${formData.clientName.replace(/\s+/g, '-')}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Open Calendly for consultation
  const openCalendly = () => {
    if (typeof Calendly !== 'undefined') {
      Calendly.initPopupWidget({
        url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
      });
    } else {
      window.open('https://terms.law/call/', '_blank');
    }
  };
  
  // Generate the document text based on form data
  const generateDocument = () => {
    return `
THIRD-PARTY LOGISTICS (3PL) AGREEMENT

This Third-Party Logistics Agreement (the "Agreement") is made effective as of ${formData.effectiveDate || "[Effective Date]"} (the "Effective Date"),

BETWEEN:

${formData.clientName || "[CLIENT NAME]"}, a company with its principal place of business at ${formData.clientAddress || "[Client Address]"}, ${formData.clientState || "[State]"} ${formData.clientZip || "[ZIP]"} (hereinafter referred to as the "Client"),

AND

${formData.providerName || "[PROVIDER NAME]"}, a company with its principal place of business at ${formData.providerAddress || "[Provider Address]"}, ${formData.providerState || "[State]"} ${formData.providerZip || "[ZIP]"} (hereinafter referred to as the "Provider").

WHEREAS, Client desires to engage Provider to perform certain logistics services; and

WHEREAS, Provider is in the business of providing third-party logistics services and desires to provide such services to Client in accordance with the terms and conditions of this Agreement.

NOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties agree as follows:

1. SERVICES

1.1 Services to be Provided. Provider agrees to provide the following logistics services (collectively, the "Services") to Client:

${formData.warehouseServices ? "   (a) Warehousing and storage of Client's products;\n" : ""}${formData.transportationServices ? "   (b) Transportation and delivery services;\n" : ""}${formData.inventoryManagement ? "   (c) Inventory management and control;\n" : ""}${formData.orderFulfillment ? "   (d) Order processing and fulfillment;\n" : ""}${formData.returnProcessing ? "   (e) Returns processing and management;\n" : ""}${formData.customServices ? `   (f) ${formData.customServices};\n` : ""}

1.2 Service Standards. Provider shall perform all Services in a professional manner, consistent with industry standards and practices. Provider shall comply with all applicable laws, regulations, and industry standards in the performance of the Services.

1.3 Service Level Agreements. Specific performance metrics and service level agreements shall be outlined in Exhibit A, attached hereto and incorporated by reference.

2. TERM AND TERMINATION

2.1 Initial Term. This Agreement shall commence on the Effective Date and shall continue for an initial term of ${formData.initialTerm} months (the "Initial Term"), unless earlier terminated as provided herein.

2.2 Renewal. ${formData.autoRenewal ? `Upon expiration of the Initial Term, this Agreement shall automatically renew for successive periods of ${formData.renewalPeriod} months each (each, a "Renewal Term"), unless either party provides written notice of non-renewal at least ${formData.terminationNoticeDays} days prior to the end of the then-current term.` : "This Agreement shall not automatically renew. Any extension beyond the Initial Term must be mutually agreed upon in writing by both parties."} 

2.3 Termination for Convenience. Either party may terminate this Agreement for convenience upon ${formData.terminationNoticeDays} days' prior written notice to the other party.

2.4 Termination for Cause. ${formData.terminationForCause ? "Either party may terminate this Agreement immediately upon written notice to the other party if: (a) the other party breaches any material term of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof; (b) the other party becomes insolvent, files for bankruptcy, or makes an assignment for the benefit of creditors; or (c) the other party ceases to conduct business in the normal course." : "This Agreement may only be terminated for cause as specified in a written notice detailing the specific grounds for termination."}

3. PRICING AND PAYMENT

3.1 Fees. ${formData.pricingStructure === "fixed" ? 
  "Client shall pay Provider the fixed fees set forth in Exhibit B for the Services." : 
  formData.pricingStructure === "variable" ? 
  "Client shall pay Provider the variable fees based on volume, weight, or other metrics as set forth in Exhibit B." : 
  "Client shall pay Provider a combination of fixed and variable fees as detailed in Exhibit B."}
${formData.pricingDetails ? `\n   Additional pricing details: ${formData.pricingDetails}` : ""}

3.2 Payment Terms. Provider shall invoice Client on a monthly basis for all Services performed. Client shall pay all undisputed amounts within ${formData.paymentTerms} days of receipt of invoice.

3.3 Late Payments. Any payment not received within the payment terms shall accrue interest at a rate of ${formData.latePaymentFee}% per month or the maximum rate permitted by law, whichever is less, from the due date until paid in full.

3.4 Price Adjustments. Provider may adjust its fees upon ${formData.priceIncreaseNotice} days' prior written notice to Client.

4. WAREHOUSING

4.1 Warehouse Locations. Provider shall store Client's products at the following location(s): ${formData.warehouseLocations || "[To be specified in Exhibit C]"}.

4.2 Storage Conditions. Provider shall maintain appropriate ${formData.storageConditions || "temperature, humidity, and other environmental conditions"} for the storage of Client's products.

4.3 Inventory Reporting. Provider shall provide inventory reports on a ${formData.inventoryReporting} basis, detailing the quantity and status of all Client products stored at Provider's facilities.

4.4 Special Requirements. ${formData.specialStorageRequirements ? `Provider shall comply with the following special storage requirements: ${formData.specialStorageRequirements}` : "Any special storage requirements shall be detailed in Exhibit C and may be subject to additional fees."}

5. TRANSPORTATION

5.1 Shipping Methods. Provider shall utilize the following shipping methods for transporting Client's products: ${formData.shippingMethods || "[To be specified in Exhibit D]"}.

5.2 Carrier Selection. ${formData.carrierSelectionBy === "provider" ? 
  "Provider shall select appropriate carriers for the transportation of Client's products, based on cost-effectiveness, reliability, and service requirements." : 
  formData.carrierSelectionBy === "client" ? 
  "Client shall specify the carriers to be used for transportation of its products." : 
  "Provider shall use Client-approved carriers for transportation services, subject to Provider's operational requirements."}

5.3 Delivery Timeframes. Provider shall use commercially reasonable efforts to meet the following delivery timeframes: ${formData.deliveryTimeframes || "[To be specified in Exhibit D]"}.

5.4 Transportation KPIs. ${formData.transportationKPIs ? `Provider shall meet the following Key Performance Indicators for transportation services: ${formData.transportationKPIs}` : "Transportation Key Performance Indicators shall be detailed in Exhibit D."}

6. INVENTORY MANAGEMENT

6.1 Inventory Counts. Provider shall conduct physical inventory counts on a ${formData.inventoryCountFrequency} basis to verify the accuracy of inventory records.

6.2 Inventory Accuracy. Provider shall maintain inventory accuracy of at least ${formData.inventoryAccuracyTarget}% at all times.

6.3 Shrinkage Allowance. The parties agree to a shrinkage allowance of ${formData.shrinkageAllowance}% of the total inventory value per year. Any shrinkage exceeding this allowance shall be the responsibility of Provider.

6.4 Stockouts. ${formData.stockoutPenalty ? "Provider shall be subject to penalties for stockouts caused by Provider's error, as detailed in Exhibit E." : "Provider shall use commercially reasonable efforts to prevent stockouts, but shall not be subject to penalties for stockouts unless caused by Provider's gross negligence."}

7. LIABILITY AND INSURANCE

7.1 Liability Limitation. Provider's liability for damage to or loss of Client's products shall be limited to ${formData.liabilityLimit === "replacement" ? 
  "the replacement cost of the affected products" : 
  formData.liabilityLimit === "invoice" ? 
  "the invoice value of the affected products" : 
  `$${formData.liabilityLimit} per occurrence`}.

7.2 Insurance. Provider shall maintain commercial general liability insurance with coverage of at least $${formData.insuranceRequirement} per occurrence. Provider shall provide Client with certificates of insurance upon request.

7.3 Claims Process. Claims for loss or damage must be submitted in writing to Provider within ${formData.freightClaimsPeriod} days of the date of delivery or scheduled delivery.

7.4 Force Majeure. ${formData.forceMainclause ? "Neither party shall be liable for any failure or delay in performance due to circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemic, war, terrorism, riots, strikes, and government actions." : "Provider shall maintain business continuity and disaster recovery plans to address potential disruptions to service."}

8. CONFIDENTIALITY AND DATA PROTECTION

8.1 Confidential Information. Each party shall hold in confidence all confidential information of the other party and shall not disclose such information to any third party without prior written consent.

8.2 Confidentiality Term. The confidentiality obligations shall survive the termination of this Agreement for a period of ${formData.confidentialityTerm} months.

8.3 Data Protection Standards. ${formData.dataProtectionStandards ? `Provider shall comply with the following data protection standards: ${formData.dataProtectionStandards}` : "Provider shall implement reasonable security measures to protect Client's data in accordance with industry standards."}

8.4 Data Breach Notification. Provider shall notify Client within ${formData.dataBreachNotification} hours of discovering any actual or suspected breach of security that may affect Client's data.

9. GENERAL PROVISIONS

9.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without giving effect to any choice of law principles.

9.2 Dispute Resolution. ${formData.disputeResolution === "arbitration" ? 
  "Any dispute arising out of or related to this Agreement shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association." : 
  formData.disputeResolution === "litigation" ? 
  "Any dispute arising out of or related to this Agreement shall be litigated exclusively in the courts located in the State of " + formData.governingLaw + "." : 
  "The parties shall attempt to resolve any dispute through good faith negotiation before pursuing other remedies."}

9.3 Assignment. ${formData.assignmentPermitted === "none" ? 
  "Neither party may assign this Agreement without the prior written consent of the other party." : 
  formData.assignmentPermitted === "provider" ? 
  "Client may not assign this Agreement without Provider's prior written consent. Provider may assign this Agreement to any successor to its business." : 
  formData.assignmentPermitted === "both" ? 
  "Either party may assign this Agreement to any successor to its business or assets to which this Agreement relates." : 
  "This Agreement may be assigned only with the prior written consent of the other party, which consent shall not be unreasonably withheld."}

9.4 Non-Solicitation. ${formData.nonSolicitation ? 
  `During the term of this Agreement and for a period of ${formData.nonSolicitationPeriod} months thereafter, neither party shall directly solicit the employment of any employee of the other party who has been involved in the provision or receipt of Services under this Agreement.` : 
  "The parties may solicit and hire employees of the other party without restriction."}

9.5 Entire Agreement. This Agreement, including all exhibits and attachments, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.

9.6 Amendments. No amendment to this Agreement shall be effective unless it is in writing and signed by authorized representatives of both parties.

9.7 Relationship of Parties. The relationship between the parties is that of independent contractors. Nothing in this Agreement shall be construed as creating any agency, partnership, joint venture or other form of joint enterprise between the parties.

9.8 Notices. All notices under this Agreement shall be in writing and shall be deemed given when delivered personally, sent by confirmed email, or sent by certified or registered mail, return receipt requested, to the address specified below or such other address as may be specified in writing.

9.9 Severability. If any provision of this Agreement is held invalid or unenforceable, such provision shall be reformed to the extent necessary to make it valid and enforceable and to reflect the intent of the parties, and the remaining provisions shall remain in full force and effect.

9.10 Waiver. No waiver of any breach of this Agreement shall constitute a waiver of any prior, concurrent, or subsequent breach of the same or any other provision, and no waiver shall be effective unless made in writing and signed by an authorized representative of the waiving party.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.

CLIENT:
${formData.clientName || "[CLIENT NAME]"}

By: _________________________
Name: _______________________
Title: ________________________
Date: ________________________

PROVIDER:
${formData.providerName || "[PROVIDER NAME]"}

By: _________________________
Name: _______________________
Title: ________________________
Date: ________________________

EXHIBITS:
Exhibit A - Service Level Agreements
Exhibit B - Pricing and Fees
Exhibit C - Warehouse Specifications
Exhibit D - Transportation Requirements
Exhibit E - Penalties and Incentives
`;
  };
  
  // Determine which section to highlight based on current tab and last changed field
  const getSectionToHighlight = () => {
    switch (currentTab) {
      case 0: // Parties
        return ['clientName', 'clientAddress', 'clientState', 'clientZip', 'providerName', 'providerAddress', 'providerState', 'providerZip', 'effectiveDate'].includes(lastChanged) ? 'parties' : null;
      case 1: // Services
        return ['warehouseServices', 'transportationServices', 'inventoryManagement', 'orderFulfillment', 'returnProcessing', 'customServices'].includes(lastChanged) ? 'services' : null;
      case 2: // Term & Termination
        return ['initialTerm', 'autoRenewal', 'renewalPeriod', 'terminationNoticeDays', 'terminationForCause'].includes(lastChanged) ? 'term' : null;
      case 3: // Pricing & Payment
        return ['pricingStructure', 'pricingDetails', 'paymentTerms', 'latePaymentFee', 'priceIncreaseNotice'].includes(lastChanged) ? 'pricing' : null;
      case 4: // Warehousing
        return ['warehouseLocations', 'storageConditions', 'inventoryReporting', 'specialStorageRequirements'].includes(lastChanged) ? 'warehousing' : null;
      case 5: // Transportation
        return ['shippingMethods', 'carrierSelectionBy', 'deliveryTimeframes', 'transportationKPIs'].includes(lastChanged) ? 'transportation' : null;
      case 6: // Inventory
        return ['inventoryCountFrequency', 'inventoryAccuracyTarget', 'shrinkageAllowance', 'stockoutPenalty'].includes(lastChanged) ? 'inventory' : null;
      case 7: // Liability & Insurance
        return ['liabilityLimit', 'insuranceRequirement', 'freightClaimsPeriod', 'forceMainclause'].includes(lastChanged) ? 'liability' : null;
      case 8: // Confidentiality
        return ['confidentialityTerm', 'dataProtectionStandards', 'dataBreachNotification'].includes(lastChanged) ? 'confidentiality' : null;
      case 9: // General
        return ['governingLaw', 'disputeResolution', 'assignmentPermitted', 'nonSolicitation', 'nonSolicitationPeriod'].includes(lastChanged) ? 'general' : null;
      default:
        return null;
    }
  };
  
  // Create a highlighted version of the text
  const createHighlightedText = () => {
    const section = getSectionToHighlight();
    if (!section) return generateDocument();
    
    const docText = generateDocument();
    
    // Define regex patterns for different sections
    const sections = {
      parties: /BETWEEN:[\s\S]*?NOW, THEREFORE/,
      services: /1\. SERVICES[\s\S]*?2\. TERM AND TERMINATION/,
      term: /2\. TERM AND TERMINATION[\s\S]*?3\. PRICING AND PAYMENT/,
      pricing: /3\. PRICING AND PAYMENT[\s\S]*?4\. WAREHOUSING/,
      warehousing: /4\. WAREHOUSING[\s\S]*?5\. TRANSPORTATION/,
      transportation: /5\. TRANSPORTATION[\s\S]*?6\. INVENTORY MANAGEMENT/,
      inventory: /6\. INVENTORY MANAGEMENT[\s\S]*?7\. LIABILITY AND INSURANCE/,
      liability: /7\. LIABILITY AND INSURANCE[\s\S]*?8\. CONFIDENTIALITY AND DATA PROTECTION/,
      confidentiality: /8\. CONFIDENTIALITY AND DATA PROTECTION[\s\S]*?9\. GENERAL PROVISIONS/,
      general: /9\. GENERAL PROVISIONS[\s\S]*?IN WITNESS WHEREOF/
    };

    if (sections[section]) {
      // Find and highlight the section
      return docText.replace(sections[section], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return docText;
  };
  
  // Create highlighted content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Re-run feather.replace() after rendering to ensure icons are properly displayed
    if (window.feather) {
      window.feather.replace();
    }
  }, [currentTab, highlightedText]);
  
  // Function to render the appropriate tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Parties
        return (
          <div className="form-panel">
            <h2>Parties Information</h2>
            <div className="form-group">
              <label htmlFor="effectiveDate">Effective Date</label>
              <input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                className="form-control"
                value={formData.effectiveDate}
                onChange={handleChange}
              />
            </div>
            
            <h3>Client Information</h3>
            <div className="form-group">
              <label htmlFor="clientName">Client Company Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                className="form-control"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client company name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="clientAddress">Client Address</label>
              <input
                type="text"
                id="clientAddress"
                name="clientAddress"
                className="form-control"
                value={formData.clientAddress}
                onChange={handleChange}
                placeholder="Enter client address"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientState">State</label>
                <input
                  type="text"
                  id="clientState"
                  name="clientState"
                  className="form-control"
                  value={formData.clientState}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="clientZip">ZIP Code</label>
                <input
                  type="text"
                  id="clientZip"
                  name="clientZip"
                  className="form-control"
                  value={formData.clientZip}
                  onChange={handleChange}
                  placeholder="ZIP"
                />
              </div>
            </div>
            
            <h3>Provider Information</h3>
            <div className="form-group">
              <label htmlFor="providerName">Provider Company Name</label>
              <input
                type="text"
                id="providerName"
                name="providerName"
                className="form-control"
                value={formData.providerName}
                onChange={handleChange}
                placeholder="Enter provider company name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="providerAddress">Provider Address</label>
              <input
                type="text"
                id="providerAddress"
                name="providerAddress"
                className="form-control"
                value={formData.providerAddress}
                onChange={handleChange}
                placeholder="Enter provider address"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="providerState">State</label>
                <input
                  type="text"
                  id="providerState"
                  name="providerState"
                  className="form-control"
                  value={formData.providerState}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="providerZip">ZIP Code</label>
                <input
                  type="text"
                  id="providerZip"
                  name="providerZip"
                  className="form-control"
                  value={formData.providerZip}
                  onChange={handleChange}
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>
        );
        
      case 1: // Services
        return (
          <div className="form-panel">
            <h2>Services</h2>
            <p>Select the services that will be provided under this agreement:</p>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="warehouseServices"
                  checked={formData.warehouseServices}
                  onChange={handleChange}
                />
                Warehousing Services
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transportationServices"
                  checked={formData.transportationServices}
                  onChange={handleChange}
                />
                Transportation Services
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="inventoryManagement"
                  checked={formData.inventoryManagement}
                  onChange={handleChange}
                />
                Inventory Management
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="orderFulfillment"
                  checked={formData.orderFulfillment}
                  onChange={handleChange}
                />
                Order Fulfillment
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="returnProcessing"
                  checked={formData.returnProcessing}
                  onChange={handleChange}
                />
                Returns Processing
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="customServices">Additional Custom Services (Optional)</label>
              <textarea
                id="customServices"
                name="customServices"
                className="form-control"
                value={formData.customServices}
                onChange={handleChange}
                placeholder="Describe any additional services to be provided"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 2: // Term & Termination
        return (
          <div className="form-panel">
            <h2>Term and Termination</h2>
            
            <div className="form-group">
              <label htmlFor="initialTerm">Initial Term (months)</label>
              <input
                type="number"
                id="initialTerm"
                name="initialTerm"
                className="form-control"
                value={formData.initialTerm}
                onChange={handleChange}
                min="1"
              />
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="autoRenewal"
                  checked={formData.autoRenewal}
                  onChange={handleChange}
                />
                Include Automatic Renewal
              </label>
            </div>
            
            {formData.autoRenewal && (
              <div className="form-group">
                <label htmlFor="renewalPeriod">Renewal Period (months)</label>
                <input
                  type="number"
                  id="renewalPeriod"
                  name="renewalPeriod"
                  className="form-control"
                  value={formData.renewalPeriod}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="terminationNoticeDays">Termination Notice Period (days)</label>
              <input
                type="number"
                id="terminationNoticeDays"
                name="terminationNoticeDays"
                className="form-control"
                value={formData.terminationNoticeDays}
                onChange={handleChange}
                min="1"
              />
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="terminationForCause"
                  checked={formData.terminationForCause}
                  onChange={handleChange}
                />
                Include Termination for Cause Provisions
              </label>
            </div>
          </div>
        );
        
      case 3: // Pricing & Payment
        return (
          <div className="form-panel">
            <h2>Pricing and Payment</h2>
            
            <div className="form-group">
              <label htmlFor="pricingStructure">Pricing Structure</label>
              <select
                id="pricingStructure"
                name="pricingStructure"
                className="form-control"
                value={formData.pricingStructure}
                onChange={handleChange}
              >
                <option value="fixed">Fixed Fee</option>
                <option value="variable">Variable Fee (based on volume/activity)</option>
                <option value="hybrid">Hybrid (fixed + variable)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="pricingDetails">Pricing Details (Optional)</label>
              <textarea
                id="pricingDetails"
                name="pricingDetails"
                className="form-control"
                value={formData.pricingDetails}
                onChange={handleChange}
                placeholder="Enter specific pricing details or notes"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentTerms">Payment Terms (days)</label>
              <input
                type="number"
                id="paymentTerms"
                name="paymentTerms"
                className="form-control"
                value={formData.paymentTerms}
                onChange={handleChange}
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="latePaymentFee">Late Payment Fee (% per month)</label>
              <input
                type="number"
                id="latePaymentFee"
                name="latePaymentFee"
                className="form-control"
                value={formData.latePaymentFee}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="priceIncreaseNotice">Price Increase Notice Period (days)</label>
              <input
                type="number"
                id="priceIncreaseNotice"
                name="priceIncreaseNotice"
                className="form-control"
                value={formData.priceIncreaseNotice}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
        );
        
      case 4: // Warehousing
        return (
          <div className="form-panel">
            <h2>Warehousing</h2>
            
            <div className="form-group">
              <label htmlFor="warehouseLocations">Warehouse Locations</label>
              <textarea
                id="warehouseLocations"
                name="warehouseLocations"
                className="form-control"
                value={formData.warehouseLocations}
                onChange={handleChange}
                placeholder="Enter warehouse locations or reference exhibit"
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="storageConditions">Storage Conditions</label>
              <textarea
                id="storageConditions"
                name="storageConditions"
                className="form-control"
                value={formData.storageConditions}
                onChange={handleChange}
                placeholder="Specify required storage conditions (temperature, humidity, etc.)"
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="inventoryReporting">Inventory Reporting Frequency</label>
              <select
                id="inventoryReporting"
                name="inventoryReporting"
                className="form-control"
                value={formData.inventoryReporting}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="specialStorageRequirements">Special Storage Requirements (Optional)</label>
              <textarea
                id="specialStorageRequirements"
                name="specialStorageRequirements"
                className="form-control"
                value={formData.specialStorageRequirements}
                onChange={handleChange}
                placeholder="Enter any special storage requirements"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 5: // Transportation
        return (
          <div className="form-panel">
            <h2>Transportation</h2>
            
            <div className="form-group">
              <label htmlFor="shippingMethods">Shipping Methods</label>
              <textarea
                id="shippingMethods"
                name="shippingMethods"
                className="form-control"
                value={formData.shippingMethods}
                onChange={handleChange}
                placeholder="Specify shipping methods (ground, air, etc.)"
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="carrierSelectionBy">Carrier Selection By</label>
              <select
                id="carrierSelectionBy"
                name="carrierSelectionBy"
                className="form-control"
                value={formData.carrierSelectionBy}
                onChange={handleChange}
              >
                <option value="provider">Provider (3PL)</option>
                <option value="client">Client</option>
                <option value="both">Client-Approved List</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="deliveryTimeframes">Delivery Timeframes</label>
              <textarea
                id="deliveryTimeframes"
                name="deliveryTimeframes"
                className="form-control"
                value={formData.deliveryTimeframes}
                onChange={handleChange}
                placeholder="Enter expected delivery timeframes"
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="transportationKPIs">Transportation KPIs (Optional)</label>
              <textarea
                id="transportationKPIs"
                name="transportationKPIs"
                className="form-control"
                value={formData.transportationKPIs}
                onChange={handleChange}
                placeholder="Specify transportation performance metrics"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 6: // Inventory
        return (
          <div className="form-panel">
            <h2>Inventory Management</h2>
            
            <div className="form-group">
              <label htmlFor="inventoryCountFrequency">Inventory Count Frequency</label>
              <select
                id="inventoryCountFrequency"
                name="inventoryCountFrequency"
                className="form-control"
                value={formData.inventoryCountFrequency}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semi-annually">Semi-Annually</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="inventoryAccuracyTarget">Inventory Accuracy Target (%)</label>
              <input
                type="number"
                id="inventoryAccuracyTarget"
                name="inventoryAccuracyTarget"
                className="form-control"
                value={formData.inventoryAccuracyTarget}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="shrinkageAllowance">Shrinkage Allowance (% of inventory value)</label>
              <input
                type="number"
                id="shrinkageAllowance"
                name="shrinkageAllowance"
                className="form-control"
                value={formData.shrinkageAllowance}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="stockoutPenalty"
                  checked={formData.stockoutPenalty}
                  onChange={handleChange}
                />
                Include Penalties for Stockouts
              </label>
            </div>
          </div>
        );
        
      case 7: // Liability & Insurance
        return (
          <div className="form-panel">
            <h2>Liability and Insurance</h2>
            
            <div className="form-group">
              <label htmlFor="liabilityLimit">Liability Limit</label>
              <select
                id="liabilityLimit"
                name="liabilityLimit"
                className="form-control"
                value={formData.liabilityLimit}
                onChange={handleChange}
              >
                <option value="replacement">Replacement Cost</option>
                <option value="invoice">Invoice Value</option>
                <option value="custom">Custom Amount</option>
              </select>
            </div>
            
            {formData.liabilityLimit === "custom" && (
              <div className="form-group">
                <label htmlFor="customLiabilityAmount">Custom Liability Amount ($)</label>
                <input
                  type="number"
                  id="customLiabilityAmount"
                  name="customLiabilityAmount"
                  className="form-control"
                  value={formData.customLiabilityAmount}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="insuranceRequirement">Required Insurance Coverage ($)</label>
              <input
                type="number"
                id="insuranceRequirement"
                name="insuranceRequirement"
                className="form-control"
                value={formData.insuranceRequirement}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="freightClaimsPeriod">Freight Claims Filing Period (days)</label>
              <input
                type="number"
                id="freightClaimsPeriod"
                name="freightClaimsPeriod"
                className="form-control"
                value={formData.freightClaimsPeriod}
                onChange={handleChange}
                min="1"
              />
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="forceMainclause"
                  checked={formData.forceMainclause}
                  onChange={handleChange}
                />
                Include Force Majeure Clause
              </label>
            </div>
          </div>
        );
        
      case 8: // Confidentiality
        return (
          <div className="form-panel">
            <h2>Confidentiality and Data Protection</h2>
            
            <div className="form-group">
              <label htmlFor="confidentialityTerm">Confidentiality Term (months after termination)</label>
              <input
                type="number"
                id="confidentialityTerm"
                name="confidentialityTerm"
                className="form-control"
                value={formData.confidentialityTerm}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dataProtectionStandards">Data Protection Standards (Optional)</label>
              <textarea
                id="dataProtectionStandards"
                name="dataProtectionStandards"
                className="form-control"
                value={formData.dataProtectionStandards}
                onChange={handleChange}
                placeholder="Specify required data protection standards (e.g., ISO 27001, GDPR, etc.)"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dataBreachNotification">Data Breach Notification Period (hours)</label>
              <input
                type="number"
                id="dataBreachNotification"
                name="dataBreachNotification"
                className="form-control"
                value={formData.dataBreachNotification}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
        );
        
      case 9: // General
        return (
          <div className="form-panel">
            <h2>General Provisions</h2>
            
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law (State)</label>
              <input
                type="text"
                id="governingLaw"
                name="governingLaw"
                className="form-control"
                value={formData.governingLaw}
                onChange={handleChange}
                placeholder="Enter state for governing law"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="disputeResolution">Dispute Resolution Method</label>
              <select
                id="disputeResolution"
                name="disputeResolution"
                className="form-control"
                value={formData.disputeResolution}
                onChange={handleChange}
              >
                <option value="arbitration">Arbitration</option>
                <option value="litigation">Litigation</option>
                <option value="mediation">Mediation First, Then Other Means</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="assignmentPermitted">Assignment Rights</label>
              <select
                id="assignmentPermitted"
                name="assignmentPermitted"
                className="form-control"
                value={formData.assignmentPermitted}
                onChange={handleChange}
              >
                <option value="none">No Assignment Permitted</option>
                <option value="consent">Assignment with Consent</option>
                <option value="provider">Provider May Assign</option>
                <option value="both">Both Parties May Assign</option>
              </select>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="nonSolicitation"
                  checked={formData.nonSolicitation}
                  onChange={handleChange}
                />
                Include Non-Solicitation Clause
              </label>
            </div>
            
            {formData.nonSolicitation && (
              <div className="form-group">
                <label htmlFor="nonSolicitationPeriod">Non-Solicitation Period (months)</label>
                <input
                  type="number"
                  id="nonSolicitationPeriod"
                  name="nonSolicitationPeriod"
                  className="form-control"
                  value={formData.nonSolicitationPeriod}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            )}
          </div>
        );
        
      case 10: // Review & Finalize
        return (
          <div className="form-panel">
            <h2>Review and Finalize</h2>
            
            <p>Review your 3PL Agreement settings and check for any potential issues or risks:</p>
            
            <div className="risk-evaluation">
              {!formData.clientName && (
                <div className="risk-card risk-high">
                  <div className="risk-title">Missing Client Information</div>
                  <p>The client name is not specified. This is required for a valid contract.</p>
                </div>
              )}
              
              {!formData.providerName && (
                <div className="risk-card risk-high">
                  <div className="risk-title">Missing Provider Information</div>
                  <p>The provider name is not specified. This is required for a valid contract.</p>
                </div>
              )}
              
              {!formData.effectiveDate && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Missing Effective Date</div>
                  <p>No effective date has been specified. It's recommended to include a specific date when the agreement begins.</p>
                </div>
              )}
              
              {formData.initialTerm < 6 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Short Initial Term</div>
                  <p>The initial term is set to less than 6 months. Short terms may not provide enough time to establish efficient operations and recover setup costs.</p>
                </div>
              )}
              
              {formData.terminationNoticeDays < 30 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Short Termination Notice</div>
                  <p>The termination notice period is less than 30 days. This may not provide sufficient time to transition services.</p>
                </div>
              )}
              
              {formData.pricingStructure === "fixed" && (
                <div className="risk-card risk-low">
                  <div className="risk-title">Fixed Pricing Structure</div>
                  <p>A fixed pricing structure may not account for variations in volume or service requirements. Consider if this is appropriate for your business needs.</p>
                </div>
              )}
              
              {formData.autoRenewal && formData.renewalPeriod >= 12 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Long Auto-Renewal Period</div>
                  <p>The agreement auto-renews for {formData.renewalPeriod} months. Consider a shorter renewal period to maintain flexibility.</p>
                </div>
              )}
              
              {formData.inventoryAccuracyTarget > 99.5 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">High Inventory Accuracy Target</div>
                  <p>The inventory accuracy target of {formData.inventoryAccuracyTarget}% may be difficult to achieve consistently. Consider a slightly lower target (e.g., 98-99%).</p>
                </div>
              )}
              
              {formData.shrinkageAllowance < 0.1 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Low Shrinkage Allowance</div>
                  <p>The shrinkage allowance of {formData.shrinkageAllowance}% is very low and may be difficult for the provider to meet.</p>
                </div>
              )}
              
              {formData.insuranceRequirement < 1000000 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Low Insurance Requirement</div>
                  <p>The insurance requirement of ${formData.insuranceRequirement} may be insufficient to cover potential losses.</p>
                </div>
              )}
              
              {formData.confidentialityTerm < 12 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Short Confidentiality Term</div>
                  <p>The confidentiality term is only {formData.confidentialityTerm} months after termination. Consider extending this for better protection.</p>
                </div>
              )}
              
              {formData.dataBreachNotification > 48 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Long Data Breach Notification Period</div>
                  <p>The data breach notification period of {formData.dataBreachNotification} hours may be too long to mitigate potential damages.</p>
                </div>
              )}
              
              {(!formData.warehouseServices && !formData.transportationServices && !formData.inventoryManagement && !formData.orderFulfillment && !formData.returnProcessing && !formData.customServices) && (
                <div className="risk-card risk-high">
                  <div className="risk-title">No Services Selected</div>
                  <p>No services have been selected for the 3PL provider to perform. At least one service should be specified.</p>
                </div>
              )}
              
              {!formData.governingLaw && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">No Governing Law Specified</div>
                  <p>No governing law has been specified. This could create ambiguity in case of disputes.</p>
                </div>
              )}
              
              {formData.nonSolicitation && formData.nonSolicitationPeriod > 24 && (
                <div className="risk-card risk-medium">
                  <div className="risk-title">Long Non-Solicitation Period</div>
                  <p>The non-solicitation period of {formData.nonSolicitationPeriod} months may be considered excessive and potentially unenforceable in some jurisdictions.</p>
                </div>
              )}
              
              {/* If no risks identified, show a success message */}
              {formData.clientName && formData.providerName && formData.effectiveDate && 
                formData.initialTerm >= 6 && formData.terminationNoticeDays >= 30 && 
                (formData.warehouseServices || formData.transportationServices || 
                 formData.inventoryManagement || formData.orderFulfillment || 
                 formData.returnProcessing || formData.customServices) && 
                formData.governingLaw && 
                (!formData.autoRenewal || formData.renewalPeriod < 12) && 
                formData.inventoryAccuracyTarget <= 99.5 && 
                formData.shrinkageAllowance >= 0.1 && 
                formData.insuranceRequirement >= 1000000 && 
                formData.confidentialityTerm >= 12 && 
                formData.dataBreachNotification <= 48 && 
                (!formData.nonSolicitation || formData.nonSolicitationPeriod <= 24) && (
                <div className="risk-card risk-low">
                  <div className="risk-title">Agreement Looks Good</div>
                  <p>No significant issues detected with your 3PL Agreement. You can now download or copy the agreement.</p>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: "2rem" }}>
              <p>Need professional assistance with your 3PL Agreement? Schedule a consultation with a qualified attorney.</p>
              <button
                onClick={openCalendly}
                className="nav-button"
                style={{
                  backgroundColor: "#10b981", 
                  color: "white",
                  border: "none",
                  marginTop: "1rem"
                }}
              >
                <Icon name="calendar" style={{marginRight: "0.5rem"}} />
                Schedule Consultation
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown tab</div>;
    }
  };
  
  // Main render function
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>3PL (Third-Party Logistics) Agreement Generator</h1>
        <p>Create a customized 3PL agreement for warehousing, fulfillment, and logistics services</p>
      </header>
      
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
      
      {/* Main Content */}
      <div className="main-content">
        <div className="tab-content">
          {/* Form Panel */}
          {renderTabContent()}
          
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
      </div>
      
      {/* Navigation Buttons */}
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
        
        {/* Consultation button */}
        <button
          onClick={openCalendly}
          className="nav-button"
          style={{
            backgroundColor: "#10b981", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="calendar" style={{marginRight: "0.25rem"}} />
          Consult
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
      
      {/* Calendly Scripts */}
      <script dangerouslySetInnerHTML={{__html: `
        window.onload = function() {
          if (typeof Calendly === 'undefined') {
            var calendlyScript = document.createElement('script');
            calendlyScript.src = 'https://assets.calendly.com/assets/external/widget.js';
            calendlyScript.async = true;
            document.body.appendChild(calendlyScript);
            
            var calendlyStyles = document.createElement('link');
            calendlyStyles.rel = 'stylesheet';
            calendlyStyles.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(calendlyStyles);
          }
        };
      `}} />
    </div>
  );
};

// Render the application
ReactDOM.render(<App />, document.getElementById('root'));