// Freelance Marketing Agreement Generator

const { useState, useEffect, useRef } = React;

const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

// Main App Component
const App = () => {
  // State for form data
  const [formData, setFormData] = useState({
    // Parties & Basic Information
    clientName: "",
    clientAddress: "",
    clientCity: "", 
    clientState: "",
    clientZip: "",
    freelancerName: "",
    freelancerAddress: "",
    freelancerCity: "",
    freelancerState: "",
    freelancerZip: "",
    effectiveDate: "",
    
    // Services & Deliverables
    serviceType: "",
    projectDescription: "",
    projectScope: "",
    deliverables: "",
    deadlines: "",
    milestones: "",
    revisions: "2",
    allowScopeChanges: false,
    scopeChangeProcess: "",
    
    // Payment Terms
    feeStructure: "fixed",
    fixedFeeAmount: "",
    hourlyRate: "",
    estimatedHours: "",
    depositRequired: false,
    depositAmount: "",
    depositPercentage: "50",
    paymentSchedule: "completion",
    paymentDueDate: "15",
    invoiceFrequency: "monthly",
    expensesIncluded: false,
    expenseTypes: "",
    expenseApprovalRequired: true,
    expenseApprovalThreshold: "100",
    lateFeePercentage: "1.5",
    cancelationFee: false,
    cancelationFeeAmount: "",
    cancelationFeePercentage: "25",
    
    // Intellectual Property
    ipOwnership: "client",
    portfolioUseAllowed: true,
    clientAttributionRequired: false,
    freelancerAttributionRequired: false,
    usageRestrictions: "",
    thirdPartyContent: false,
    thirdPartyContentDetails: "",
    
    // Confidentiality
    confidentialityTerm: "2",
    confidentialityIncluded: true,
    clientTradeSecrets: "",
    freelancerTradeSecrets: "",
    
    // Term & Termination
    agreementTerm: "project",
    agreementFixedTerm: "1",
    agreementTermUnit: "months",
    terminationNotice: "14",
    terminationWithCause: true,
    terminationFees: true,
    
    // Liability & Indemnification
    liabilityLimit: "fee",
    liabilityLimitAmount: "",
    warrantyPeriod: "30",
    indemnificationIncluded: true,
    insuranceRequired: false,
    insuranceCoverage: "",
    
    // Additional Terms
    mediation: false,
    arbitration: false,
    governingLaw: "California",
    counterparts: true,
    signatureType: "electronic",
    
    // Document Info
    fileName: "Freelance-Marketing-Agreement"
  });
  
  // Tabs configuration
  const tabs = [
    { id: 'tab1', label: 'Parties & Information' },
    { id: 'tab2', label: 'Services & Deliverables' },
    { id: 'tab3', label: 'Payment Terms' },
    { id: 'tab4', label: 'Intellectual Property' },
    { id: 'tab5', label: 'Confidentiality' },
    { id: 'tab6', label: 'Term & Termination' },
    { id: 'tab7', label: 'Liability' },
    { id: 'tab8', label: 'Additional Terms' },
    { id: 'tab9', label: 'Finalization' }
  ];
  
  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for document text
  const [documentText, setDocumentText] = useState("");
  
  // State to track what was last changed for highlighting
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
  // Handle form input change
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
  
  // Navigate to next tab
  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };
  
  // Navigate to previous tab
  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };
  
  // Navigate to a specific tab
  const goToTab = (index) => {
    setCurrentTab(index);
  };
  
  // Copy document to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText).then(() => {
        alert("Document copied to clipboard!");
      }).catch(err => {
        console.error("Could not copy text: ", err);
        alert("Failed to copy to clipboard. Please try again.");
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };
  
  // Download as MS Word
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: "Freelance Marketing Agreement",
        fileName: formData.fileName || "Freelance-Marketing-Agreement"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Generate document text based on form data
  useEffect(() => {
    // Build the document text based on form data
    let text = "";
    
    // FREELANCE MARKETING AGREEMENT
    text += "FREELANCE MARKETING AGREEMENT\n\n";
    
    // PARTIES
    text += "This Freelance Marketing Agreement (the \"Agreement\") is entered into as of " + 
      (formData.effectiveDate ? formData.effectiveDate : "[EFFECTIVE DATE]") + 
      " (the \"Effective Date\"), by and between:\n\n";
    
    text += "CLIENT: " + (formData.clientName ? formData.clientName : "[CLIENT NAME]") + 
      ", with an address at " + 
      (formData.clientAddress ? formData.clientAddress : "[CLIENT ADDRESS]") + 
      ", " + 
      (formData.clientCity ? formData.clientCity : "[CITY]") + 
      ", " + 
      (formData.clientState ? formData.clientState : "[STATE]") + 
      " " + 
      (formData.clientZip ? formData.clientZip : "[ZIP]") + 
      " (the \"Client\")\n\n";
      
    text += "FREELANCER: " + (formData.freelancerName ? formData.freelancerName : "[FREELANCER NAME]") + 
      ", with an address at " + 
      (formData.freelancerAddress ? formData.freelancerAddress : "[FREELANCER ADDRESS]") + 
      ", " + 
      (formData.freelancerCity ? formData.freelancerCity : "[CITY]") + 
      ", " + 
      (formData.freelancerState ? formData.freelancerState : "[STATE]") + 
      " " + 
      (formData.freelancerZip ? formData.freelancerZip : "[ZIP]") + 
      " (the \"Freelancer\")\n\n";
    
    text += "Collectively referred to as the \"Parties.\"\n\n";
    
    // 1. SERVICES
    text += "1. SERVICES\n\n";
    
    text += "1.1 Scope of Services. The Freelancer agrees to provide marketing services (the \"Services\") to the Client " +
      "as described in this Agreement. The Services include:" + 
      (formData.serviceType ? " " + formData.serviceType : " [TYPE OF MARKETING SERVICES]") + ".\n\n";
    
    text += "1.2 Project Description. " + 
      (formData.projectDescription ? formData.projectDescription : "The Freelancer shall provide marketing services as outlined in this Agreement.") + "\n\n";
    
    text += "1.3 Project Scope. " + 
      (formData.projectScope ? formData.projectScope : "The scope of the project includes the specific marketing services, deliverables, and timelines as detailed in this Agreement.") + "\n\n";
    
    // 2. DELIVERABLES
    text += "2. DELIVERABLES\n\n";
    
    text += "2.1 Deliverables. The Freelancer shall provide the following deliverables (the \"Deliverables\"):\n\n" + 
      (formData.deliverables ? formData.deliverables : "[DETAILED DESCRIPTION OF DELIVERABLES]") + "\n\n";
    
    text += "2.2 Deadlines and Milestones. The Freelancer shall complete the Deliverables according to the following schedule:\n\n" + 
      (formData.deadlines || formData.milestones ? 
        (formData.deadlines ? formData.deadlines + "\n\n" : "") + 
        (formData.milestones ? formData.milestones : "") : 
        "[DETAILED TIMELINE WITH SPECIFIC DATES/MILESTONES]") + "\n\n";
    
    text += "2.3 Revisions. The Client is entitled to request " + 
      (formData.revisions ? formData.revisions : "two (2)") + 
      " rounds of revisions for each Deliverable. Additional revisions will be billed separately at the Freelancer's then-current rates.\n\n";
    
    if (formData.allowScopeChanges) {
      text += "2.4 Changes to Scope. Changes to the scope of Services or Deliverables may be requested by the Client and will be accommodated through the following process: " + 
        (formData.scopeChangeProcess ? formData.scopeChangeProcess : 
          "All scope changes must be submitted in writing, and the Freelancer will provide an estimate of additional time and costs for approval by the Client before proceeding.") + "\n\n";
    } else {
      text += "2.4 Changes to Scope. Any changes to the scope of Services or Deliverables requested by the Client after the execution of this Agreement may result in additional fees and extended timelines. All changes must be agreed upon in writing by both Parties.\n\n";
    }
    
    // 3. PAYMENT TERMS
    text += "3. PAYMENT TERMS\n\n";
    
    if (formData.feeStructure === "fixed") {
      text += "3.1 Compensation. The Client shall pay the Freelancer a fixed fee of $" + 
        (formData.fixedFeeAmount ? formData.fixedFeeAmount : "[AMOUNT]") + 
        " for the Services outlined in this Agreement.\n\n";
    } else if (formData.feeStructure === "hourly") {
      text += "3.1 Compensation. The Client shall pay the Freelancer at an hourly rate of $" + 
        (formData.hourlyRate ? formData.hourlyRate : "[RATE]") + 
        " per hour. The estimated total hours for this project are " + 
        (formData.estimatedHours ? formData.estimatedHours : "[NUMBER]") + 
        " hours, for an estimated total of $" + 
        (formData.hourlyRate && formData.estimatedHours ? 
          (parseFloat(formData.hourlyRate) * parseFloat(formData.estimatedHours)).toFixed(2) : 
          "[ESTIMATED TOTAL]") + ".\n\n";
    }
    
    if (formData.depositRequired) {
      if (formData.depositAmount) {
        text += "3.2 Deposit. The Client shall pay a deposit of $" + formData.depositAmount + " upon execution of this Agreement.\n\n";
      } else {
        text += "3.2 Deposit. The Client shall pay a deposit of " + formData.depositPercentage + "% of the total project fee upon execution of this Agreement.\n\n";
      }
    }
    
    text += "3.3 Payment Schedule. ";
    if (formData.paymentSchedule === "completion") {
      text += "Payment is due upon completion and delivery of all Deliverables, less any deposit already paid.\n\n";
    } else if (formData.paymentSchedule === "milestone") {
      text += "Payment will be made according to the milestone schedule outlined in Section 2.2 of this Agreement.\n\n";
    } else if (formData.paymentSchedule === "periodic") {
      text += "Payment will be made on a " + formData.invoiceFrequency + " basis.\n\n";
    }
    
    text += "3.4 Payment Terms. All invoices are due within " + 
      (formData.paymentDueDate ? formData.paymentDueDate : "15") + 
      " days of receipt. Late payments will incur interest at a rate of " + 
      (formData.lateFeePercentage ? formData.lateFeePercentage : "1.5") + 
      "% per month on the outstanding balance.\n\n";
    
    if (!formData.expensesIncluded) {
      text += "3.5 Expenses. Expenses are not included in the fee and will be invoiced separately. " + 
        (formData.expenseTypes ? "Eligible expenses include: " + formData.expenseTypes + ". " : "") + 
        (formData.expenseApprovalRequired ? 
          "Expenses exceeding $" + formData.expenseApprovalThreshold + " require prior written approval from the Client. " : 
          "No prior approval is required for expenses.") + "\n\n";
    } else {
      text += "3.5 Expenses. All expenses are included in the fee stated in Section 3.1.\n\n";
    }
    
    if (formData.cancelationFee) {
      if (formData.cancelationFeeAmount) {
        text += "3.6 Cancellation Fee. If the Client cancels the project after work has begun, a cancellation fee of $" + 
          formData.cancelationFeeAmount + " will apply.\n\n";
      } else {
        text += "3.6 Cancellation Fee. If the Client cancels the project after work has begun, a cancellation fee of " + 
          formData.cancelationFeePercentage + "% of the total project fee will apply.\n\n";
      }
    }
    
    // 4. INTELLECTUAL PROPERTY
    text += "4. INTELLECTUAL PROPERTY\n\n";
    
    if (formData.ipOwnership === "client") {
      text += "4.1 Ownership of Work Product. Upon receipt of full payment, all rights, title, and interest in the Deliverables, including all intellectual property rights, shall be assigned exclusively to the Client.\n\n";
    } else if (formData.ipOwnership === "freelancer") {
      text += "4.1 Ownership of Work Product. The Freelancer shall retain all rights, title, and interest in the Deliverables, including all intellectual property rights. Upon receipt of full payment, the Client is granted a non-exclusive, worldwide, perpetual license to use the Deliverables for the Client's business purposes.\n\n";
    } else if (formData.ipOwnership === "license") {
      text += "4.1 Ownership of Work Product. The Freelancer shall retain ownership of all intellectual property rights in the Deliverables. Upon receipt of full payment, the Client is granted an exclusive, worldwide, perpetual license to use the Deliverables for any purpose.\n\n";
    }
    
    if (formData.portfolioUseAllowed) {
      text += "4.2 Portfolio Rights. The Freelancer may display, reproduce, and distribute the Deliverables in the Freelancer's portfolios, websites, presentations, and promotional materials for the purpose of showcasing the Freelancer's work" + 
        (formData.clientAttributionRequired ? ", with attribution to the Client" : "") + ".\n\n";
    } else {
      text += "4.2 Portfolio Rights. The Freelancer may not publicly display the Deliverables without prior written consent from the Client.\n\n";
    }
    
    if (formData.freelancerAttributionRequired) {
      text += "4.3 Attribution. The Client agrees to provide attribution to the Freelancer when using or displaying the Deliverables in any public manner.\n\n";
    }
    
    if (formData.usageRestrictions) {
      text += "4.4 Usage Restrictions. " + formData.usageRestrictions + "\n\n";
    }
    
    if (formData.thirdPartyContent) {
      text += "4.5 Third-Party Content. " + 
        (formData.thirdPartyContentDetails ? formData.thirdPartyContentDetails : 
          "The Deliverables may include third-party content such as stock photography, fonts, or software. The Client is responsible for complying with the licensing terms of these third-party elements.") + "\n\n";
    }
    
    // 5. CONFIDENTIALITY
    if (formData.confidentialityIncluded) {
      text += "5. CONFIDENTIALITY\n\n";
      
      text += "5.1 Confidential Information. Both Parties agree to keep confidential all information disclosed to them by the other party that is marked confidential or would reasonably be understood to be confidential given the nature of the information and the circumstances of disclosure.\n\n";
      
      text += "5.2 Exclusions. Confidential Information does not include information that: (a) was rightfully known to the receiving party without restriction before receipt from the disclosing party; (b) is or becomes publicly available through no fault of the receiving party; (c) is rightfully received by the receiving party from a third party without restriction; or (d) is independently developed by the receiving party without access to the Confidential Information.\n\n";
      
      text += "5.3 Obligations. Each Party agrees: (a) to use the Confidential Information only for the purposes of this Agreement; (b) to maintain the confidentiality of the Confidential Information using the same degree of care it uses for its own confidential information, but no less than reasonable care; (c) not to disclose the Confidential Information to any third party except with the disclosing party's prior written consent.\n\n";
      
      text += "5.4 Term of Confidentiality. The confidentiality obligations will survive the termination of this Agreement for a period of " + 
        (formData.confidentialityTerm ? formData.confidentialityTerm : "two (2)") + 
        " years.\n\n";
        
      if (formData.clientTradeSecrets) {
        text += "5.5 Client Trade Secrets. The following specific information is considered trade secrets of the Client and shall be protected indefinitely: " + formData.clientTradeSecrets + "\n\n";
      }
      
      if (formData.freelancerTradeSecrets) {
        text += "5.6 Freelancer Trade Secrets. The following specific information is considered trade secrets of the Freelancer and shall be protected indefinitely: " + formData.freelancerTradeSecrets + "\n\n";
      }
    }
    
    // 6. TERM AND TERMINATION
    text += "6. TERM AND TERMINATION\n\n";
    
    if (formData.agreementTerm === "project") {
      text += "6.1 Term. This Agreement shall commence on the Effective Date and shall continue until completion of the Services and delivery of all Deliverables, unless terminated earlier as provided in this Agreement.\n\n";
    } else if (formData.agreementTerm === "fixed") {
      text += "6.1 Term. This Agreement shall commence on the Effective Date and shall continue for a period of " + 
        (formData.agreementFixedTerm ? formData.agreementFixedTerm : "one (1)") + " " + 
        (formData.agreementTermUnit ? formData.agreementTermUnit : "months") + 
        ", unless terminated earlier as provided in this Agreement.\n\n";
    }
    
    text += "6.2 Termination for Convenience. Either Party may terminate this Agreement for any reason upon " + 
      (formData.terminationNotice ? formData.terminationNotice : "fourteen (14)") + 
      " days' written notice to the other Party.\n\n";
    
    if (formData.terminationWithCause) {
      text += "6.3 Termination for Cause. Either Party may terminate this Agreement immediately if the other Party materially breaches this Agreement and fails to cure such breach within fourteen (14) days after receiving written notice of the breach.\n\n";
    }
    
    if (formData.terminationFees) {
      text += "6.4 Effect of Termination. Upon termination, the Client shall pay the Freelancer for all Services performed and expenses incurred up to the date of termination. If the Client terminates the Agreement for convenience, any cancellation fees set forth in Section 3.6 shall also apply.\n\n";
    } else {
      text += "6.4 Effect of Termination. Upon termination, the Client shall pay the Freelancer for all Services performed and expenses incurred up to the date of termination.\n\n";
    }
    
    // 7. REPRESENTATIONS AND WARRANTIES
    text += "7. REPRESENTATIONS AND WARRANTIES\n\n";
    
    text += "7.1 Freelancer's Representations and Warranties. The Freelancer represents and warrants that: (a) the Freelancer has the right and authority to enter into and perform this Agreement; (b) the Freelancer has the skills and knowledge necessary to provide the Services; (c) the Services will be performed in a professional and workmanlike manner; (d) the Deliverables will conform to the specifications in this Agreement; and (e) to the best of the Freelancer's knowledge, the Deliverables will not infringe upon the intellectual property rights of any third party.\n\n";
    
    text += "7.2 Client's Representations and Warranties. The Client represents and warrants that: (a) the Client has the right and authority to enter into and perform this Agreement; (b) the Client will provide all necessary information, materials, and approvals for the Freelancer to complete the Services; and (c) any materials provided by the Client for incorporation into the Deliverables will not infringe upon the intellectual property rights of any third party.\n\n";
    
    text += "7.3 Warranty Period. The Freelancer warrants that the Deliverables will conform to the specifications for a period of " + 
      (formData.warrantyPeriod ? formData.warrantyPeriod : "thirty (30)") + 
      " days after delivery. The Freelancer will correct any non-conforming Deliverables at no additional charge if the Client notifies the Freelancer in writing within the warranty period.\n\n";
    
    // 8. LIMITATION OF LIABILITY
    text += "8. LIMITATION OF LIABILITY\n\n";
    
    if (formData.liabilityLimit === "fee") {
      text += "8.1 Limitation of Liability. IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT. THE TOTAL LIABILITY OF THE FREELANCER UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY THE CLIENT TO THE FREELANCER UNDER THIS AGREEMENT.\n\n";
    } else if (formData.liabilityLimit === "custom") {
      text += "8.1 Limitation of Liability. IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT. THE TOTAL LIABILITY OF THE FREELANCER UNDER THIS AGREEMENT SHALL NOT EXCEED $" + 
        (formData.liabilityLimitAmount ? formData.liabilityLimitAmount : "[AMOUNT]") + ".\n\n";
    } else if (formData.liabilityLimit === "none") {
      text += "8.1 No Limitation of Liability. Both Parties shall be liable for all damages arising out of or related to this Agreement to the extent permitted by applicable law.\n\n";
    }
    
    // 9. INDEMNIFICATION
    if (formData.indemnificationIncluded) {
      text += "9. INDEMNIFICATION\n\n";
      
      text += "9.1 Mutual Indemnification. Each Party shall defend, indemnify, and hold harmless the other Party, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to any third-party claim alleging: (a) a breach of this Agreement by the indemnifying Party; (b) negligence, gross negligence, or willful misconduct by the indemnifying Party; or (c) in the case of the Freelancer, any claim that the Deliverables infringe a third party's intellectual property rights, except to the extent such infringement arises from materials provided by the Client.\n\n";
    }
    
    // 10. INSURANCE
    if (formData.insuranceRequired) {
      text += "10. INSURANCE\n\n";
      
      text += "10.1 Insurance Requirements. The Freelancer shall maintain, at the Freelancer's own expense, insurance coverage as follows: " + 
        (formData.insuranceCoverage ? formData.insuranceCoverage : "[DETAILED INSURANCE REQUIREMENTS]") + "\n\n";
    }
    
    // 11. GENERAL PROVISIONS
    text += (formData.insuranceRequired ? "11" : "10") + ". GENERAL PROVISIONS\n\n";
    
    let sectionNumber = formData.insuranceRequired ? "11" : "10";
    
    text += sectionNumber + ".1 Independent Contractor Relationship. The Freelancer is an independent contractor and not an employee of the Client. Nothing in this Agreement shall be construed as creating an employer-employee relationship, partnership, or joint venture between the Parties.\n\n";
    
    text += sectionNumber + ".2 Taxes. The Freelancer is responsible for all taxes related to the compensation received under this Agreement.\n\n";
    
    text += sectionNumber + ".3 No Exclusivity. Unless explicitly stated otherwise, this Agreement does not create an exclusive relationship between the Parties. The Freelancer may perform services for other clients, and the Client may engage other freelancers or service providers.\n\n";
    
    text += sectionNumber + ".4 Force Majeure. Neither Party shall be liable for any delay or failure to perform due to causes beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemic, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, flood, accident, network or telecommunication outages, or strikes.\n\n";
    
    text += sectionNumber + ".5 Notices. All notices under this Agreement shall be in writing and shall be delivered by hand, email, or certified mail to the addresses provided in this Agreement.\n\n";
    
    text += sectionNumber + ".6 Assignment. Neither Party may assign this Agreement without the prior written consent of the other Party, which shall not be unreasonably withheld.\n\n";
    
    text += sectionNumber + ".7 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of " + 
      (formData.governingLaw ? formData.governingLaw : "California") + 
      ", without regard to its conflict of laws principles.\n\n";
    
    if (formData.mediation) {
      text += sectionNumber + ".8 Dispute Resolution - Mediation. In the event of any dispute arising out of or relating to this Agreement, the Parties agree to first attempt to resolve the dispute through mediation before resorting to arbitration or litigation.\n\n";
    }
    
    if (formData.arbitration) {
      text += sectionNumber + (formData.mediation ? ".9" : ".8") + " Dispute Resolution - Arbitration. Any dispute arising out of or relating to this Agreement that cannot be resolved through negotiation or mediation shall be settled by binding arbitration administered by the American Arbitration Association under its Commercial Arbitration Rules. The arbitration shall take place in " + 
        (formData.governingLaw ? formData.governingLaw : "California") + 
        ", and the language of the arbitration shall be English. The decision of the arbitrator shall be final and binding on the Parties.\n\n";
    }
    
    let counterpartSection = formData.mediation && formData.arbitration ? ".10" : 
                              (formData.mediation || formData.arbitration) ? ".9" : ".8";
    
    if (formData.counterparts) {
      text += sectionNumber + counterpartSection + " Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed original signatures for all purposes.\n\n";
    }
    
    let entireAgreementSection = counterpartSection;
    if (formData.counterparts) {
      entireAgreementSection = (parseInt(counterpartSection.replace(".", "")) + 1).toString();
      entireAgreementSection = "." + entireAgreementSection;
    }
    
    text += sectionNumber + entireAgreementSection + " Entire Agreement. This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements or communications. This Agreement may only be modified by a written document signed by both Parties.\n\n";
    
    // SIGNATURE BLOCK
    text += "IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.\n\n";
    
    text += "CLIENT:\n\n";
    text += formData.clientName ? formData.clientName : "[CLIENT NAME]\n\n";
    text += "Signature: _______________________________\n\n";
    text += "Name: _______________________________\n\n";
    text += "Title: _______________________________\n\n";
    text += "Date: _______________________________\n\n\n";
    
    text += "FREELANCER:\n\n";
    text += formData.freelancerName ? formData.freelancerName : "[FREELANCER NAME]\n\n";
    text += "Signature: _______________________________\n\n";
    text += "Name: _______________________________\n\n";
    text += "Title: _______________________________\n\n";
    text += "Date: _______________________________\n\n";
    
    setDocumentText(text);
  }, [formData]);
  
  // Function to determine which sections to highlight based on the current tab and lastChanged field
  const getSectionToHighlight = () => {
    const sections = [];
    
    if (!lastChanged) return sections;
    
    // Map fields to document sections based on tab and field name
    switch (currentTab) {
      case 0: // Parties & Basic Information
        if (['clientName', 'clientAddress', 'clientCity', 'clientState', 'clientZip'].includes(lastChanged)) {
          sections.push({
            regex: /CLIENT: .+?\(the "Client"\)/s,
            label: "Client Information"
          });
        }
        if (['freelancerName', 'freelancerAddress', 'freelancerCity', 'freelancerState', 'freelancerZip'].includes(lastChanged)) {
          sections.push({
            regex: /FREELANCER: .+?\(the "Freelancer"\)/s,
            label: "Freelancer Information"
          });
        }
        if (lastChanged === 'effectiveDate') {
          sections.push({
            regex: /This Freelance Marketing Agreement \(the "Agreement"\) is entered into as of .+? \(the "Effective Date"\)/,
            label: "Effective Date"
          });
        }
        break;
      
      case 1: // Services & Deliverables
        if (lastChanged === 'serviceType') {
          sections.push({
            regex: /1\.1 Scope of Services\. The Freelancer agrees to provide marketing services[^\.]+?\./,
            label: "Service Type"
          });
        }
        if (lastChanged === 'projectDescription') {
          sections.push({
            regex: /1\.2 Project Description\. .+/,
            label: "Project Description"
          });
        }
        if (lastChanged === 'projectScope') {
          sections.push({
            regex: /1\.3 Project Scope\. .+/,
            label: "Project Scope"
          });
        }
        if (lastChanged === 'deliverables') {
          sections.push({
            regex: /2\.1 Deliverables\. The Freelancer shall provide the following deliverables[^:]+?:\n\n.+/s,
            label: "Deliverables"
          });
        }
        if (['deadlines', 'milestones'].includes(lastChanged)) {
          sections.push({
            regex: /2\.2 Deadlines and Milestones\. The Freelancer shall complete the Deliverables.+?\n\n[^\n]+/s,
            label: "Deadlines and Milestones"
          });
        }
        if (lastChanged === 'revisions') {
          sections.push({
            regex: /2\.3 Revisions\. The Client is entitled to request .+? rounds of revisions for each Deliverable\./,
            label: "Revisions"
          });
        }
        if (['allowScopeChanges', 'scopeChangeProcess'].includes(lastChanged)) {
          sections.push({
            regex: /2\.4 Changes to Scope\..+/s,
            label: "Scope Changes"
          });
        }
        break;
        
      case 2: // Payment Terms
        if (['feeStructure', 'fixedFeeAmount', 'hourlyRate', 'estimatedHours'].includes(lastChanged)) {
          sections.push({
            regex: /3\.1 Compensation\..+/,
            label: "Compensation"
          });
        }
        if (['depositRequired', 'depositAmount', 'depositPercentage'].includes(lastChanged) && formData.depositRequired) {
          sections.push({
            regex: /3\.2 Deposit\..+/,
            label: "Deposit"
          });
        }
        if (['paymentSchedule', 'invoiceFrequency'].includes(lastChanged)) {
          sections.push({
            regex: /3\.3 Payment Schedule\..+/,
            label: "Payment Schedule"
          });
        }
        if (['paymentDueDate', 'lateFeePercentage'].includes(lastChanged)) {
          sections.push({
            regex: /3\.4 Payment Terms\..+/,
            label: "Payment Terms"
          });
        }
        if (['expensesIncluded', 'expenseTypes', 'expenseApprovalRequired', 'expenseApprovalThreshold'].includes(lastChanged)) {
          sections.push({
            regex: /3\.5 Expenses\..+/s,
            label: "Expenses"
          });
        }
        if (['cancelationFee', 'cancelationFeeAmount', 'cancelationFeePercentage'].includes(lastChanged) && formData.cancelationFee) {
          sections.push({
            regex: /3\.6 Cancellation Fee\..+/,
            label: "Cancellation Fee"
          });
        }
        break;
        
      case 3: // Intellectual Property
        if (lastChanged === 'ipOwnership') {
          sections.push({
            regex: /4\.1 Ownership of Work Product\..+/s,
            label: "IP Ownership"
          });
        }
        if (['portfolioUseAllowed', 'clientAttributionRequired'].includes(lastChanged)) {
          sections.push({
            regex: /4\.2 Portfolio Rights\..+/s,
            label: "Portfolio Rights"
          });
        }
        if (lastChanged === 'freelancerAttributionRequired' && formData.freelancerAttributionRequired) {
          sections.push({
            regex: /4\.3 Attribution\..+/s,
            label: "Attribution"
          });
        }
        if (lastChanged === 'usageRestrictions' && formData.usageRestrictions) {
          sections.push({
            regex: /4\.4 Usage Restrictions\..+/s,
            label: "Usage Restrictions"
          });
        }
        if (['thirdPartyContent', 'thirdPartyContentDetails'].includes(lastChanged) && formData.thirdPartyContent) {
          sections.push({
            regex: /4\.5 Third-Party Content\..+/s,
            label: "Third-Party Content"
          });
        }
        break;
        
      case 4: // Confidentiality
        if (lastChanged === 'confidentialityIncluded') {
          if (formData.confidentialityIncluded) {
            sections.push({
              regex: /5\. CONFIDENTIALITY\n\n.+?(?=6\. TERM AND TERMINATION)/s,
              label: "Confidentiality Section"
            });
          }
        }
        if (lastChanged === 'confidentialityTerm' && formData.confidentialityIncluded) {
          sections.push({
            regex: /5\.4 Term of Confidentiality\..+/s,
            label: "Confidentiality Term"
          });
        }
        if (lastChanged === 'clientTradeSecrets' && formData.confidentialityIncluded && formData.clientTradeSecrets) {
          sections.push({
            regex: /5\.5 Client Trade Secrets\..+/s,
            label: "Client Trade Secrets"
          });
        }
        if (lastChanged === 'freelancerTradeSecrets' && formData.confidentialityIncluded && formData.freelancerTradeSecrets) {
          sections.push({
            regex: /5\.6 Freelancer Trade Secrets\..+/s,
            label: "Freelancer Trade Secrets"
          });
        }
        break;
        
      case 5: // Term & Termination
        if (['agreementTerm', 'agreementFixedTerm', 'agreementTermUnit'].includes(lastChanged)) {
          sections.push({
            regex: /6\.1 Term\..+/s,
            label: "Agreement Term"
          });
        }
        if (lastChanged === 'terminationNotice') {
          sections.push({
            regex: /6\.2 Termination for Convenience\..+/s,
            label: "Termination Notice"
          });
        }
        if (lastChanged === 'terminationWithCause' && formData.terminationWithCause) {
          sections.push({
            regex: /6\.3 Termination for Cause\..+/s,
            label: "Termination for Cause"
          });
        }
        if (lastChanged === 'terminationFees') {
          sections.push({
            regex: /6\.4 Effect of Termination\..+/s,
            label: "Termination Effects"
          });
        }
        break;
        
      case 6: // Liability & Indemnification
        if (lastChanged === 'warrantyPeriod') {
          sections.push({
            regex: /7\.3 Warranty Period\..+/s,
            label: "Warranty Period"
          });
        }
        if (['liabilityLimit', 'liabilityLimitAmount'].includes(lastChanged)) {
          sections.push({
            regex: /8\.1 Limitation of Liability\..+/s,
            label: "Liability Limitation"
          });
        }
        if (lastChanged === 'indemnificationIncluded') {
          if (formData.indemnificationIncluded) {
            const indemnificationSection = formData.insuranceRequired ? 
              /9\. INDEMNIFICATION\n\n.+?(?=10\. INSURANCE)/s : 
              /9\. INDEMNIFICATION\n\n.+?(?=10\. GENERAL PROVISIONS)/s;
            sections.push({
              regex: indemnificationSection,
              label: "Indemnification Section"
            });
          }
        }
        if (['insuranceRequired', 'insuranceCoverage'].includes(lastChanged) && formData.insuranceRequired) {
          sections.push({
            regex: /10\. INSURANCE\n\n.+?(?=11\. GENERAL PROVISIONS)/s,
            label: "Insurance Requirements"
          });
        }
        break;
        
      case 7: // Additional Terms
        if (lastChanged === 'governingLaw') {
          const sectionNumber = formData.insuranceRequired ? "11" : "10";
          sections.push({
            regex: new RegExp(sectionNumber + "\\.7 Governing Law\\..+", "s"),
            label: "Governing Law"
          });
        }
        if (lastChanged === 'mediation' && formData.mediation) {
          const sectionNumber = formData.insuranceRequired ? "11" : "10";
          sections.push({
            regex: new RegExp(sectionNumber + "\\.8 Dispute Resolution - Mediation\\..+", "s"),
            label: "Mediation"
          });
        }
        if (lastChanged === 'arbitration' && formData.arbitration) {
          const sectionNumber = formData.insuranceRequired ? "11" : "10";
          const subsection = formData.mediation ? ".9" : ".8";
          sections.push({
            regex: new RegExp(sectionNumber + subsection + " Dispute Resolution - Arbitration\\..+", "s"),
            label: "Arbitration"
          });
        }
        if (lastChanged === 'counterparts' && formData.counterparts) {
          const sectionNumber = formData.insuranceRequired ? "11" : "10";
          const counterpartSection = formData.mediation && formData.arbitration ? ".10" : 
                                    (formData.mediation || formData.arbitration) ? ".9" : ".8";
          sections.push({
            regex: new RegExp(sectionNumber + counterpartSection + " Counterparts\\..+", "s"),
            label: "Counterparts"
          });
        }
        if (lastChanged === 'signatureType') {
          sections.push({
            regex: /IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date\..+/s,
            label: "Signature Block"
          });
        }
        break;
        
      case 8: // Finalization
        if (lastChanged === 'fileName') {
          // No direct document highlight for fileName as it's used for the download
          break;
        }
        break;
    }
    
    return sections;
  };
  
  // Function to create highlighted text for preview
  const createHighlightedText = () => {
    let highlightedText = documentText;
    const sectionsToHighlight = getSectionToHighlight();
    
    // Apply highlighting to each section
    sectionsToHighlight.forEach(section => {
      highlightedText = highlightedText.replace(
        section.regex, 
        match => `<span class="highlighted-text">${match}</span>`
      );
    });
    
    return highlightedText;
  };
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastChanged, currentTab]);
  
  // Risk assessment for final tab
  const getRiskAssessment = () => {
    const risks = [];
    
    // Check for missing essential information
    if (!formData.clientName || !formData.freelancerName) {
      risks.push({
        level: "high-risk",
        title: "Missing Party Information",
        description: "One or more party names are missing. This could make the agreement unenforceable."
      });
    }
    
    if (!formData.effectiveDate) {
      risks.push({
        level: "medium-risk",
        title: "Missing Effective Date",
        description: "No effective date specified. This may create ambiguity about when the agreement begins."
      });
    }
    
    if (!formData.deliverables) {
      risks.push({
        level: "high-risk",
        title: "No Deliverables Specified",
        description: "The deliverables section is empty. This could lead to disputes about what is expected from the freelancer."
      });
    }
    
    if (!formData.deadlines && !formData.milestones) {
      risks.push({
        level: "medium-risk",
        title: "No Timeline Specified",
        description: "No deadlines or milestones have been specified. This could lead to disputes about when deliverables are due."
      });
    }
    
    if (formData.feeStructure === "fixed" && !formData.fixedFeeAmount) {
      risks.push({
        level: "high-risk",
        title: "No Fixed Fee Amount",
        description: "You've selected a fixed fee structure but haven't specified the amount. This is crucial information for a valid contract."
      });
    }
    
    if (formData.feeStructure === "hourly" && (!formData.hourlyRate || !formData.estimatedHours)) {
      risks.push({
        level: "high-risk",
        title: "Incomplete Hourly Rate Information",
        description: "You've selected an hourly rate structure but haven't provided the rate or estimated hours."
      });
    }
    
    if (formData.depositRequired && !formData.depositAmount && !formData.depositPercentage) {
      risks.push({
        level: "medium-risk",
        title: "Incomplete Deposit Information",
        description: "You've indicated a deposit is required but haven't specified the amount or percentage."
      });
    }
    
    if (!formData.confidentialityIncluded) {
      risks.push({
        level: "medium-risk",
        title: "No Confidentiality Provisions",
        description: "Your agreement does not include confidentiality provisions. This may expose sensitive information to disclosure."
      });
    }
    
    // Add more risk assessments based on the agreement
    if (formData.ipOwnership === "freelancer") {
      risks.push({
        level: "medium-risk",
        title: "IP Owned by Freelancer",
        description: "You've selected for the freelancer to retain ownership of intellectual property. This means you only have a license to use the deliverables, not full ownership."
      });
    }
    
    if (formData.allowScopeChanges && !formData.scopeChangeProcess) {
      risks.push({
        level: "medium-risk",
        title: "Incomplete Scope Change Process",
        description: "You've allowed scope changes but haven't detailed the process. This could lead to disputes about how changes are approved and billed."
      });
    }
    
    // If no risks were identified, add a "low risk" item
    if (risks.length === 0) {
      risks.push({
        level: "low-risk",
        title: "Agreement Appears Complete",
        description: "No major issues detected in your agreement. However, you should still review it carefully before signing."
      });
    }
    
    return risks;
  };
  
  // Render tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Parties & Basic Information
        return (
          <div className="form-section">
            <h3>Client Information</h3>
            <div className="form-group">
              <label htmlFor="clientName">Client Name</label>
              <input 
                type="text" 
                id="clientName" 
                name="clientName" 
                className="form-control" 
                value={formData.clientName} 
                onChange={handleChange} 
                placeholder="Enter client's full legal name"
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
                placeholder="Enter client's street address"
              />
            </div>
            
            <div className="form-group">
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label htmlFor="clientCity">City</label>
                  <input 
                    type="text" 
                    id="clientCity" 
                    name="clientCity" 
                    className="form-control" 
                    value={formData.clientCity} 
                    onChange={handleChange} 
                    placeholder="City"
                  />
                </div>
                <div>
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
                <div>
                  <label htmlFor="clientZip">ZIP</label>
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
            </div>
            
            <h3>Freelancer Information</h3>
            <div className="form-group">
              <label htmlFor="freelancerName">Freelancer Name</label>
              <input 
                type="text" 
                id="freelancerName" 
                name="freelancerName" 
                className="form-control" 
                value={formData.freelancerName} 
                onChange={handleChange} 
                placeholder="Enter your full legal name or company name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="freelancerAddress">Freelancer Address</label>
              <input 
                type="text" 
                id="freelancerAddress" 
                name="freelancerAddress" 
                className="form-control" 
                value={formData.freelancerAddress} 
                onChange={handleChange} 
                placeholder="Enter your street address"
              />
            </div>
            
            <div className="form-group">
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label htmlFor="freelancerCity">City</label>
                  <input 
                    type="text" 
                    id="freelancerCity" 
                    name="freelancerCity" 
                    className="form-control" 
                    value={formData.freelancerCity} 
                    onChange={handleChange} 
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="freelancerState">State</label>
                  <input 
                    type="text" 
                    id="freelancerState" 
                    name="freelancerState" 
                    className="form-control" 
                    value={formData.freelancerState} 
                    onChange={handleChange} 
                    placeholder="State"
                  />
                </div>
                <div>
                  <label htmlFor="freelancerZip">ZIP</label>
                  <input 
                    type="text" 
                    id="freelancerZip" 
                    name="freelancerZip" 
                    className="form-control" 
                    value={formData.freelancerZip} 
                    onChange={handleChange} 
                    placeholder="ZIP"
                  />
                </div>
              </div>
            </div>
            
            <h3>Agreement Information</h3>
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
          </div>
        );
        
      case 1: // Services & Deliverables
        return (
          <div className="form-section">
            <h3>Service Information</h3>
            <div className="form-group">
              <label htmlFor="serviceType">Type of Marketing Service</label>
              <input 
                type="text" 
                id="serviceType" 
                name="serviceType" 
                className="form-control" 
                value={formData.serviceType} 
                onChange={handleChange} 
                placeholder="e.g., Social Media Marketing, SEO, Content Creation, etc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="projectDescription">Project Description</label>
              <textarea 
                id="projectDescription" 
                name="projectDescription" 
                className="form-control" 
                value={formData.projectDescription} 
                onChange={handleChange} 
                placeholder="Provide a brief description of the marketing project"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="projectScope">Project Scope</label>
              <textarea 
                id="projectScope" 
                name="projectScope" 
                className="form-control" 
                value={formData.projectScope} 
                onChange={handleChange} 
                placeholder="Define the boundaries of what is included in this agreement"
              ></textarea>
            </div>
            
            <h3>Deliverables</h3>
            <div className="form-group">
              <label htmlFor="deliverables">Deliverables</label>
              <textarea 
                id="deliverables" 
                name="deliverables" 
                className="form-control" 
                value={formData.deliverables} 
                onChange={handleChange} 
                placeholder="List all specific deliverables (e.g., social media content, blog posts, graphics, etc.)"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="deadlines">Deadlines</label>
              <textarea 
                id="deadlines" 
                name="deadlines" 
                className="form-control" 
                value={formData.deadlines} 
                onChange={handleChange} 
                placeholder="Specify delivery deadlines (e.g., '5 blog posts by March 31, 2025')"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="milestones">Milestones</label>
              <textarea 
                id="milestones" 
                name="milestones" 
                className="form-control" 
                value={formData.milestones} 
                onChange={handleChange} 
                placeholder="Define project milestones (e.g., 'Campaign strategy approval, Content creation, Campaign launch')"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="revisions">Number of Revision Rounds</label>
              <input 
                type="number" 
                id="revisions" 
                name="revisions" 
                className="form-control" 
                value={formData.revisions} 
                onChange={handleChange} 
                min="0" 
                max="10"
              />
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="allowScopeChanges" 
                  name="allowScopeChanges" 
                  checked={formData.allowScopeChanges} 
                  onChange={handleChange}
                />
                <label htmlFor="allowScopeChanges">Allow Changes to Project Scope</label>
              </div>
            </div>
            
            {formData.allowScopeChanges && (
              <div className="form-group">
                <label htmlFor="scopeChangeProcess">Process for Scope Changes</label>
                <textarea 
                  id="scopeChangeProcess" 
                  name="scopeChangeProcess" 
                  className="form-control" 
                  value={formData.scopeChangeProcess} 
                  onChange={handleChange} 
                  placeholder="Describe how scope changes will be requested, approved, and billed"
                ></textarea>
              </div>
            )}
          </div>
        );
        
      case 2: // Payment Terms
        return (
          <div className="form-section">
            <h3>Fee Structure</h3>
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="radio" 
                  id="feeStructureFixed" 
                  name="feeStructure" 
                  value="fixed" 
                  checked={formData.feeStructure === "fixed"} 
                  onChange={handleChange}
                />
                <label htmlFor="feeStructureFixed">Fixed Fee</label>
              </div>
              <div className="form-check">
                <input 
                  type="radio" 
                  id="feeStructureHourly" 
                  name="feeStructure" 
                  value="hourly" 
                  checked={formData.feeStructure === "hourly"} 
                  onChange={handleChange}
                />
                <label htmlFor="feeStructureHourly">Hourly Rate</label>
              </div>
            </div>
            
            {formData.feeStructure === "fixed" && (
              <div className="form-group">
                <label htmlFor="fixedFeeAmount">Fixed Fee Amount ($)</label>
                <input 
                  type="number" 
                  id="fixedFeeAmount" 
                  name="fixedFeeAmount" 
                  className="form-control" 
                  value={formData.fixedFeeAmount} 
                  onChange={handleChange} 
                  placeholder="Enter the total project fee"
                  min="0"
                />
              </div>
            )}
            
            {formData.feeStructure === "hourly" && (
              <>
                <div className="form-group">
                  <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                  <input 
                    type="number" 
                    id="hourlyRate" 
                    name="hourlyRate" 
                    className="form-control" 
                    value={formData.hourlyRate} 
                    onChange={handleChange} 
                    placeholder="Enter your hourly rate"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="estimatedHours">Estimated Total Hours</label>
                  <input 
                    type="number" 
                    id="estimatedHours" 
                    name="estimatedHours" 
                    className="form-control" 
                    value={formData.estimatedHours} 
                    onChange={handleChange} 
                    placeholder="Estimate the total project hours"
                    min="0"
                  />
                </div>
                {formData.hourlyRate && formData.estimatedHours && (
                  <div className="form-group">
                    <p>Estimated Total: ${(parseFloat(formData.hourlyRate) * parseFloat(formData.estimatedHours)).toFixed(2)}</p>
                  </div>
                )}
              </>
            )}
            
            <h3>Payment Details</h3>
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="depositRequired" 
                  name="depositRequired" 
                  checked={formData.depositRequired} 
                  onChange={handleChange}
                />
                <label htmlFor="depositRequired">Require Initial Deposit</label>
              </div>
            </div>
            
            {formData.depositRequired && (
              <>
                <div className="form-group">
                  <label htmlFor="depositAmount">Deposit Amount ($)</label>
                  <input 
                    type="number" 
                    id="depositAmount" 
                    name="depositAmount" 
                    className="form-control" 
                    value={formData.depositAmount} 
                    onChange={handleChange} 
                    placeholder="Enter deposit amount"
                    min="0"
                  />
                  <small>Leave blank to use percentage instead</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="depositPercentage">Deposit Percentage (%)</label>
                  <input 
                    type="number" 
                    id="depositPercentage" 
                    name="depositPercentage" 
                    className="form-control" 
                    value={formData.depositPercentage} 
                    onChange={handleChange} 
                    placeholder="Enter deposit percentage"
                    min="0"
                    max="100"
                  />
                  <small>Used only if no deposit amount is specified</small>
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="paymentSchedule">Payment Schedule</label>
              <select 
                id="paymentSchedule" 
                name="paymentSchedule" 
                className="form-control" 
                value={formData.paymentSchedule} 
                onChange={handleChange}
              >
                <option value="completion">Upon Completion</option>
                <option value="milestone">Upon Milestone Completion</option>
                <option value="periodic">Periodic Payments</option>
              </select>
            </div>
            
            {formData.paymentSchedule === "periodic" && (
              <div className="form-group">
                <label htmlFor="invoiceFrequency">Invoice Frequency</label>
                <select 
                  id="invoiceFrequency" 
                  name="invoiceFrequency" 
                  className="form-control" 
                  value={formData.invoiceFrequency} 
                  onChange={handleChange}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="paymentDueDate">Payment Due (Days After Invoice)</label>
              <input 
                type="number" 
                id="paymentDueDate" 
                name="paymentDueDate" 
                className="form-control" 
                value={formData.paymentDueDate} 
                onChange={handleChange} 
                min="1"
                max="90"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lateFeePercentage">Late Payment Fee (% per month)</label>
              <input 
                type="number" 
                id="lateFeePercentage" 
                name="lateFeePercentage" 
                className="form-control" 
                value={formData.lateFeePercentage} 
                onChange={handleChange} 
                step="0.1"
                min="0"
                max="10"
              />
            </div>
            
            <h3>Expenses & Cancellation</h3>
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="expensesIncluded" 
                  name="expensesIncluded" 
                  checked={formData.expensesIncluded} 
                  onChange={handleChange}
                />
                <label htmlFor="expensesIncluded">All Expenses Included in Fee</label>
              </div>
            </div>
            
            {!formData.expensesIncluded && (
              <>
                <div className="form-group">
                  <label htmlFor="expenseTypes">Types of Eligible Expenses</label>
                  <textarea 
                    id="expenseTypes" 
                    name="expenseTypes" 
                    className="form-control" 
                    value={formData.expenseTypes} 
                    onChange={handleChange} 
                    placeholder="e.g., stock photos, advertising costs, software subscriptions"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      id="expenseApprovalRequired" 
                      name="expenseApprovalRequired" 
                      checked={formData.expenseApprovalRequired} 
                      onChange={handleChange}
                    />
                    <label htmlFor="expenseApprovalRequired">Prior Approval Required for Expenses</label>
                  </div>
                </div>
                
                {formData.expenseApprovalRequired && (
                  <div className="form-group">
                    <label htmlFor="expenseApprovalThreshold">Expense Approval Threshold ($)</label>
                    <input 
                      type="number" 
                      id="expenseApprovalThreshold" 
                      name="expenseApprovalThreshold" 
                      className="form-control" 
                      value={formData.expenseApprovalThreshold} 
                      onChange={handleChange} 
                      placeholder="Expenses above this amount require approval"
                      min="0"
                    />
                  </div>
                )}
              </>
            )}
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="cancelationFee" 
                  name="cancelationFee" 
                  checked={formData.cancelationFee} 
                  onChange={handleChange}
                />
                <label htmlFor="cancelationFee">Include Cancellation Fee</label>
              </div>
            </div>
            
            {formData.cancelationFee && (
              <>
                <div className="form-group">
                  <label htmlFor="cancelationFeeAmount">Cancellation Fee Amount ($)</label>
                  <input 
                    type="number" 
                    id="cancelationFeeAmount" 
                    name="cancelationFeeAmount" 
                    className="form-control" 
                    value={formData.cancelationFeeAmount} 
                    onChange={handleChange} 
                    placeholder="Enter cancellation fee amount"
                    min="0"
                  />
                  <small>Leave blank to use percentage instead</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cancelationFeePercentage">Cancellation Fee Percentage (%)</label>
                  <input 
                    type="number" 
                    id="cancelationFeePercentage" 
                    name="cancelationFeePercentage" 
                    className="form-control" 
                    value={formData.cancelationFeePercentage} 
                    onChange={handleChange} 
                    placeholder="Enter cancellation fee percentage"
                    min="0"
                    max="100"
                  />
                  <small>Used only if no cancellation amount is specified</small>
                </div>
              </>
            )}
          </div>
        );
        
      case 3: // Intellectual Property
        return (
          <div className="form-section">
            <h3>Intellectual Property Ownership</h3>
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="radio" 
                  id="ipOwnershipClient" 
                  name="ipOwnership" 
                  value="client" 
                  checked={formData.ipOwnership === "client"} 
                  onChange={handleChange}
                />
                <label htmlFor="ipOwnershipClient">Client Owns All IP (Work-for-Hire)</label>
              </div>
              <div className="form-check">
                <input 
                  type="radio" 
                  id="ipOwnershipFreelancer" 
                  name="ipOwnership" 
                  value="freelancer" 
                  checked={formData.ipOwnership === "freelancer"} 
                  onChange={handleChange}
                />
                <label htmlFor="ipOwnershipFreelancer">Freelancer Retains IP with Non-Exclusive License to Client</label>
              </div>
              <div className="form-check">
                <input 
                  type="radio" 
                  id="ipOwnershipLicense" 
                  name="ipOwnership" 
                  value="license" 
                  checked={formData.ipOwnership === "license"} 
                  onChange={handleChange}
                />
                <label htmlFor="ipOwnershipLicense">Freelancer Retains IP with Exclusive License to Client</label>
              </div>
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="portfolioUseAllowed" 
                  name="portfolioUseAllowed" 
                  checked={formData.portfolioUseAllowed} 
                  onChange={handleChange}
                />
                <label htmlFor="portfolioUseAllowed">Freelancer Can Display Work in Portfolio</label>
              </div>
            </div>
            
            {formData.portfolioUseAllowed && (
              <div className="form-group">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    id="clientAttributionRequired" 
                    name="clientAttributionRequired" 
                    checked={formData.clientAttributionRequired} 
                    onChange={handleChange}
                  />
                  <label htmlFor="clientAttributionRequired">Client Attribution Required in Portfolio</label>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="freelancerAttributionRequired" 
                  name="freelancerAttributionRequired" 
                  checked={formData.freelancerAttributionRequired} 
                  onChange={handleChange}
                />
                <label htmlFor="freelancerAttributionRequired">Freelancer Attribution Required When Client Uses Work</label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="usageRestrictions">Usage Restrictions</label>
              <textarea 
                id="usageRestrictions" 
                name="usageRestrictions" 
                className="form-control" 
                value={formData.usageRestrictions} 
                onChange={handleChange} 
                placeholder="Specify any restrictions on how the deliverables can be used (e.g., geographical limits, time limits, etc.)"
              ></textarea>
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="thirdPartyContent" 
                  name="thirdPartyContent" 
                  checked={formData.thirdPartyContent} 
                  onChange={handleChange}
                />
                <label htmlFor="thirdPartyContent">Deliverables Will Include Third-Party Content</label>
              </div>
            </div>
            
            {formData.thirdPartyContent && (
              <div className="form-group">
                <label htmlFor="thirdPartyContentDetails">Third-Party Content Details</label>
                <textarea 
                  id="thirdPartyContentDetails" 
                  name="thirdPartyContentDetails" 
                  className="form-control" 
                  value={formData.thirdPartyContentDetails} 
                  onChange={handleChange} 
                  placeholder="Describe third-party content (e.g., stock photos, fonts, software) and licensing details"
                ></textarea>
              </div>
            )}
          </div>
        );
        
      case 4: // Confidentiality
        return (
          <div className="form-section">
            <h3>Confidentiality Provisions</h3>
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="confidentialityIncluded" 
                  name="confidentialityIncluded" 
                  checked={formData.confidentialityIncluded} 
                  onChange={handleChange}
                />
                <label htmlFor="confidentialityIncluded">Include Confidentiality Provisions</label>
              </div>
            </div>
            
            {formData.confidentialityIncluded && (
              <>
                <div className="form-group">
                  <label htmlFor="confidentialityTerm">Confidentiality Term (Years)</label>
                  <input 
                    type="number" 
                    id="confidentialityTerm" 
                    name="confidentialityTerm" 
                    className="form-control" 
                    value={formData.confidentialityTerm} 
                    onChange={handleChange} 
                    min="1"
                    max="10"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="clientTradeSecrets">Client's Trade Secrets (Protected Indefinitely)</label>
                  <textarea 
                    id="clientTradeSecrets" 
                    name="clientTradeSecrets" 
                    className="form-control" 
                    value={formData.clientTradeSecrets} 
                    onChange={handleChange} 
                    placeholder="List any specific client information that should be protected indefinitely (optional)"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="freelancerTradeSecrets">Freelancer's Trade Secrets (Protected Indefinitely)</label>
                  <textarea 
                    id="freelancerTradeSecrets" 
                    name="freelancerTradeSecrets" 
                    className="form-control" 
                    value={formData.freelancerTradeSecrets} 
                    onChange={handleChange} 
                    placeholder="List any specific freelancer information that should be protected indefinitely (optional)"
                  ></textarea>
                </div>
              </>
            )}
            
            <div className="tip">
              <h4>Legal Tip: Confidentiality</h4>
              <p>Marketing often involves access to sensitive business information such as brand strategy, customer data, and campaign metrics. Including confidentiality provisions helps protect both parties from unauthorized disclosure of proprietary information.</p>
            </div>
          </div>
        );
        
      case 5: // Term & Termination
        return (
          <div className="form-section">
            <h3>Agreement Term</h3>
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="radio" 
                  id="agreementTermProject" 
                  name="agreementTerm" 
                  value="project" 
                  checked={formData.agreementTerm === "project"} 
                  onChange={handleChange}
                />
                <label htmlFor="agreementTermProject">Project-Based (Until Completion)</label>
              </div>
              <div className="form-check">
                <input 
                  type="radio" 
                  id="agreementTermFixed" 
                  name="agreementTerm" 
                  value="fixed" 
                  checked={formData.agreementTerm === "fixed"} 
                  onChange={handleChange}
                />
                <label htmlFor="agreementTermFixed">Fixed Term</label>
              </div>
            </div>
            
            {formData.agreementTerm === "fixed" && (
              <div className="form-group">
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <label htmlFor="agreementFixedTerm">Term Duration</label>
                    <input 
                      type="number" 
                      id="agreementFixedTerm" 
                      name="agreementFixedTerm" 
                      className="form-control" 
                      value={formData.agreementFixedTerm} 
                      onChange={handleChange} 
                      min="1"
                      max="60"
                    />
                  </div>
                  <div style={{ flex: "1" }}>
                    <label htmlFor="agreementTermUnit">Unit</label>
                    <select 
                      id="agreementTermUnit" 
                      name="agreementTermUnit" 
                      className="form-control" 
                      value={formData.agreementTermUnit} 
                      onChange={handleChange}
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <h3>Termination</h3>
            <div className="form-group">
              <label htmlFor="terminationNotice">Termination Notice Period (Days)</label>
              <input 
                type="number" 
                id="terminationNotice" 
                name="terminationNotice" 
                className="form-control" 
                value={formData.terminationNotice} 
                onChange={handleChange} 
                min="1"
                max="90"
              />
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="terminationWithCause" 
                  name="terminationWithCause" 
                  checked={formData.terminationWithCause} 
                  onChange={handleChange}
                />
                <label htmlFor="terminationWithCause">Include Termination for Cause Provision</label>
              </div>
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="terminationFees" 
                  name="terminationFees" 
                  checked={formData.terminationFees} 
                  onChange={handleChange}
                />
                <label htmlFor="terminationFees">Require Payment for Work Completed Upon Termination</label>
              </div>
            </div>
            
            <div className="tip">
              <h4>Legal Tip: Termination Rights</h4>
              <p>Clear termination provisions protect both parties if the relationship doesn't work out. A notice period gives both sides time to adjust, while termination for cause allows immediate exit if the other party seriously breaches the agreement.</p>
            </div>
          </div>
        );
        
      case 6: // Liability & Indemnification
        return (
          <div className="form-section">
            <h3>Warranties & Liability</h3>
            <div className="form-group">
              <label htmlFor="warrantyPeriod">Warranty Period (Days)</label>
              <input 
                type="number" 
                id="warrantyPeriod" 
                name="warrantyPeriod" 
                className="form-control" 
                value={formData.warrantyPeriod} 
                onChange={handleChange} 
                min="0"
                max="365"
              />
              <small>Period during which the Freelancer will fix non-conforming deliverables at no charge</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="liabilityLimit">Liability Limitation</label>
              <select 
                id="liabilityLimit" 
                name="liabilityLimit" 
                className="form-control" 
                value={formData.liabilityLimit} 
                onChange={handleChange}
              >
                <option value="fee">Limited to Fees Paid</option>
                <option value="custom">Custom Amount</option>
                <option value="none">No Limitation</option>
              </select>
            </div>
            
            {formData.liabilityLimit === "custom" && (
              <div className="form-group">
                <label htmlFor="liabilityLimitAmount">Liability Limit Amount ($)</label>
                <input 
                  type="number" 
                  id="liabilityLimitAmount" 
                  name="liabilityLimitAmount" 
                  className="form-control" 
                  value={formData.liabilityLimitAmount} 
                  onChange={handleChange} 
                  min="0"
                />
              </div>
            )}
            
            <h3>Indemnification & Insurance</h3>
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="indemnificationIncluded" 
                  name="indemnificationIncluded" 
                  checked={formData.indemnificationIncluded} 
                  onChange={handleChange}
                />
                <label htmlFor="indemnificationIncluded">Include Mutual Indemnification</label>
              </div>
              <small>Parties agree to protect each other from third-party claims</small>
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="insuranceRequired" 
                  name="insuranceRequired" 
                  checked={formData.insuranceRequired} 
                  onChange={handleChange}
                />
                <label htmlFor="insuranceRequired">Require Freelancer to Maintain Insurance</label>
              </div>
            </div>
            
            {formData.insuranceRequired && (
              <div className="form-group">
                <label htmlFor="insuranceCoverage">Insurance Coverage Details</label>
                <textarea 
                  id="insuranceCoverage" 
                  name="insuranceCoverage" 
                  className="form-control" 
                  value={formData.insuranceCoverage} 
                  onChange={handleChange} 
                  placeholder="Specify required insurance types and coverage amounts (e.g., professional liability, general liability)"
                ></textarea>
              </div>
            )}
            
            <div className="tip">
              <h4>Legal Tip: Liability Protection</h4>
              <p>Limiting liability is essential for freelancers. For marketing services, potential risks include claims related to copyright infringement, misleading advertising, or damage to brand reputation. A reasonable liability cap is usually the total amount paid under the agreement.</p>
            </div>
          </div>
        );
        
      case 7: // Additional Terms
        return (
          <div className="form-section">
            <h3>Legal Terms</h3>
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law (State/Jurisdiction)</label>
              <input 
                type="text" 
                id="governingLaw" 
                name="governingLaw" 
                className="form-control" 
                value={formData.governingLaw} 
                onChange={handleChange} 
                placeholder="e.g., California, New York, etc."
              />
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="mediation" 
                  name="mediation" 
                  checked={formData.mediation} 
                  onChange={handleChange}
                />
                <label htmlFor="mediation">Require Mediation Before Litigation</label>
              </div>
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="arbitration" 
                  name="arbitration" 
                  checked={formData.arbitration} 
                  onChange={handleChange}
                />
                <label htmlFor="arbitration">Require Binding Arbitration</label>
              </div>
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="counterparts" 
                  name="counterparts" 
                  checked={formData.counterparts} 
                  onChange={handleChange}
                />
                <label htmlFor="counterparts">Allow Execution in Counterparts</label>
              </div>
            </div>
            
            <h3>Signature</h3>
            <div className="form-group">
              <label htmlFor="signatureType">Signature Type</label>
              <select 
                id="signatureType" 
                name="signatureType" 
                className="form-control" 
                value={formData.signatureType} 
                onChange={handleChange}
              >
                <option value="electronic">Electronic Signatures Allowed</option>
                <option value="physical">Physical Signatures Required</option>
              </select>
            </div>
            
            <h3>Document Information</h3>
            <div className="form-group">
              <label htmlFor="fileName">File Name (for Download)</label>
              <input 
                type="text" 
                id="fileName" 
                name="fileName" 
                className="form-control" 
                value={formData.fileName} 
                onChange={handleChange} 
                placeholder="Name for downloaded document (without extension)"
              />
            </div>
            
            <div className="tip">
              <h4>Legal Tip: Dispute Resolution</h4>
              <p>Including mediation and arbitration clauses can save both parties time and money if a dispute arises. These methods are typically faster and less expensive than litigation, while still providing a formal resolution process.</p>
            </div>
          </div>
        );
        
      case 8: // Finalization
        return (
          <div className="form-section">
            <h3>Agreement Review</h3>
            <p>Please review your agreement carefully before downloading or copying. The preview pane shows the complete agreement based on your selections.</p>
            
            <div className="risk-assessment">
              <h3>Risk Assessment</h3>
              
              {getRiskAssessment().map((risk, index) => (
                <div key={index} className={`risk-item ${risk.level}`}>
                  <h4>{risk.title}</h4>
                  <p>{risk.description}</p>
                </div>
              ))}
            </div>
            
            <div className="tip">
              <h4>Legal Tip: Final Checklist</h4>
              <p>Before finalizing your agreement, ensure all critical elements are clearly defined: scope of services, deliverables, payment terms, IP ownership, and termination conditions. Both parties should fully understand their obligations and rights under the agreement.</p>
            </div>
            
            <div className="tip">
              <h4>Next Steps</h4>
              <p>After generating your agreement, you should:</p>
              <ol>
                <li>Review the document carefully for any errors or omissions</li>
                <li>Consult with a lawyer if you have specific legal concerns</li>
                <li>Share the agreement with the other party for review</li>
                <li>Make any necessary revisions based on feedback</li>
                <li>Ensure both parties sign the agreement before work begins</li>
                <li>Keep a signed copy for your records</li>
              </ol>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container">
      <div className="app-header">
        <h1>Freelance Marketing Agreement Generator</h1>
        <p>Create a comprehensive agreement for marketing services that protects both freelancers and clients. Cover scope of work, deliverables, payment terms, intellectual property rights, and more.</p>
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
      
      <div className="app-body">
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
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));