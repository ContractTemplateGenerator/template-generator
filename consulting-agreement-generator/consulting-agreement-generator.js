// consulting-agreement-generator.js
const { useState, useEffect, useRef } = React;

// Icon component for Feather icons
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

// Main Application Component
const ConsultingAgreementGenerator = () => {
  // Tab configuration
  const tabs = [
    { id: 'basics', label: 'Basic Information' },
    { id: 'scope', label: 'Scope of Services' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'term', label: 'Term & Termination' },
    { id: 'ip', label: 'Intellectual Property' },
    { id: 'confidentiality', label: 'Confidentiality' },
    { id: 'additional', label: 'Additional Terms' },
    { id: 'finalize', label: 'Finalize & Risk Assessment' }
  ];

  // State
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const [formData, setFormData] = useState({
    // Basic Information
    clientName: '',
    clientAddress: '',
    clientEntityType: 'corporation',
    consultantName: '',
    consultantAddress: '',
    consultantEntityType: 'individual',
    effectiveDate: '',
    
    // Scope of Services
    servicesDescription: '',
    servicesLocation: 'remote',
    customLocation: '',
    deliverables: '',
    timeline: '',
    
    // Compensation
    compensationType: 'hourly',
    hourlyRate: '',
    fixedFee: '',
    retainerAmount: '',
    paymentSchedule: 'monthly',
    customPaymentSchedule: '',
    expensesReimbursed: false,
    expensesRequireApproval: true,
    expenseThreshold: '500',
    
    // Term & Termination
    agreementTerm: 'fixed',
    fixedTermMonths: '12',
    terminationNotice: '30',
    earlyTerminationFee: false,
    terminationFeeAmount: '',
    
    // Intellectual Property
    ipOwnership: 'client',
    preExistingIp: true,
    ipLicenseType: 'non-exclusive',
    
    // Confidentiality
    confidentialityTerm: '3',
    confidentialityExceptions: true,
    nda: true,
    
    // Additional Terms
    nonCompete: false,
    nonCompeteMonths: '12',
    nonSolicitation: true,
    nonSolicitationMonths: '12',
    indemnification: true,
    limitLiability: true,
    liabilityCapType: 'fees',
    liabilityCapAmount: '',
    insurance: false,
    insuranceAmount: '',
    governingLaw: 'California',
    disputeResolution: 'arbitration',
    arbitrationLocation: 'California'
  });

  // Refs
  const previewRef = useRef(null);

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

  // Handle form changes
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

  // Effect to generate the document text whenever form data changes
  useEffect(() => {
    const generateDocument = () => {
      let text = '';
      
      // Add document title
      text += `CONSULTING AGREEMENT\n\n`;
      
      // Basic Information section
      text += `This Consulting Agreement (the "Agreement") is made and entered into as of ${formData.effectiveDate || "[Effective Date]"} (the "Effective Date"), by and between:\n\n`;
      
      // Client information
      text += `${formData.clientName || "[Client Name]"}, a ${formData.clientEntityType} with its principal place of business at ${formData.clientAddress || "[Client Address]"} (the "Client"),\n\n`;
      
      // Add "and"
      text += `and\n\n`;
      
      // Consultant information
      if (formData.consultantEntityType === 'individual') {
        text += `${formData.consultantName || "[Consultant Name]"}, an individual with an address at ${formData.consultantAddress || "[Consultant Address]"} (the "Consultant").\n\n`;
      } else {
        text += `${formData.consultantName || "[Consultant Name]"}, a ${formData.consultantEntityType} with its principal place of business at ${formData.consultantAddress || "[Consultant Address]"} (the "Consultant").\n\n`;
      }
      
      // Recitals
      text += `RECITALS\n\n`;
      text += `WHEREAS, Client wishes to engage Consultant to provide certain services as set forth herein, and Consultant wishes to provide such services to Client;\n\n`;
      text += `NOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties agree as follows:\n\n`;
      
      // 1. Services
      text += `1. SERVICES\n\n`;
      text += `1.1 Scope of Services. Consultant shall provide to Client the following services (collectively, the "Services"):\n\n`;
      text += `${formData.servicesDescription || "[Description of Services]"}\n\n`;
      
      if (formData.deliverables) {
        text += `1.2 Deliverables. Consultant shall provide the following deliverables (the "Deliverables"):\n\n`;
        text += `${formData.deliverables}\n\n`;
      }
      
      if (formData.timeline) {
        text += `1.3 Timeline. Consultant shall perform the Services according to the following timeline:\n\n`;
        text += `${formData.timeline}\n\n`;
      }
      
      // Location of services
      text += `1.4 Location. `;
      if (formData.servicesLocation === 'remote') {
        text += `Consultant shall perform the Services remotely, unless otherwise agreed by the parties in writing.\n\n`;
      } else if (formData.servicesLocation === 'client') {
        text += `Consultant shall perform the Services at Client's premises located at ${formData.clientAddress || "[Client Address]"}.\n\n`;
      } else if (formData.servicesLocation === 'consultant') {
        text += `Consultant shall perform the Services at Consultant's premises located at ${formData.consultantAddress || "[Consultant Address]"}.\n\n`;
      } else if (formData.servicesLocation === 'custom' && formData.customLocation) {
        text += `Consultant shall perform the Services at ${formData.customLocation}.\n\n`;
      } else {
        text += `Consultant shall perform the Services at locations to be determined and agreed upon by the parties.\n\n`;
      }
      
      // 2. Compensation
      text += `2. COMPENSATION\n\n`;
      
      if (formData.compensationType === 'hourly') {
        text += `2.1 Fees. Client shall pay Consultant at the rate of $${formData.hourlyRate || "[Rate]"} per hour for Services performed under this Agreement.\n\n`;
      } else if (formData.compensationType === 'fixed') {
        text += `2.1 Fees. Client shall pay Consultant a fixed fee of $${formData.fixedFee || "[Amount]"} for Services performed under this Agreement.\n\n`;
      } else if (formData.compensationType === 'retainer') {
        text += `2.1 Fees. Client shall pay Consultant a monthly retainer of $${formData.retainerAmount || "[Amount]"} for Services performed under this Agreement.\n\n`;
      }
      
      // Payment schedule
      text += `2.2 Payment Schedule. `;
      if (formData.paymentSchedule === 'monthly') {
        text += `Consultant shall invoice Client on a monthly basis for Services performed during the preceding month. Client shall pay all invoices within thirty (30) days of receipt.\n\n`;
      } else if (formData.paymentSchedule === 'milestone') {
        text += `Client shall pay Consultant upon completion of agreed-upon milestones as specified in Section 1.2 above. Client shall pay all invoices within thirty (30) days of receipt.\n\n`;
      } else if (formData.paymentSchedule === 'upfront') {
        text += `Client shall pay Consultant fifty percent (50%) of the total fee upon execution of this Agreement and the remaining fifty percent (50%) upon completion of the Services.\n\n`;
      } else if (formData.paymentSchedule === 'custom' && formData.customPaymentSchedule) {
        text += `${formData.customPaymentSchedule}\n\n`;
      } else {
        text += `Consultant shall invoice Client on a monthly basis for Services performed during the preceding month. Client shall pay all invoices within thirty (30) days of receipt.\n\n`;
      }
      
      // Expenses
      text += `2.3 Expenses. `;
      if (formData.expensesReimbursed) {
        if (formData.expensesRequireApproval) {
          text += `Client shall reimburse Consultant for all reasonable expenses incurred in connection with the Services, provided that expenses exceeding $${formData.expenseThreshold || "500"} require Client's prior written approval. Consultant shall provide receipts or other documentation for all expenses.\n\n`;
        } else {
          text += `Client shall reimburse Consultant for all reasonable expenses incurred in connection with the Services. Consultant shall provide receipts or other documentation for all expenses.\n\n`;
        }
      } else {
        text += `Consultant shall be responsible for all expenses incurred in performing the Services under this Agreement, unless otherwise expressly agreed to in writing by Client.\n\n`;
      }
      
      // 3. Term and Termination
      text += `3. TERM AND TERMINATION\n\n`;
      
      // Term
      if (formData.agreementTerm === 'fixed') {
        text += `3.1 Term. This Agreement shall commence on the Effective Date and shall continue for a period of ${formData.fixedTermMonths || "[Number]"} months, unless earlier terminated as provided herein.\n\n`;
      } else {
        text += `3.1 Term. This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with the provisions of this Agreement.\n\n`;
      }
      
      // Termination
      text += `3.2 Termination. Either party may terminate this Agreement upon ${formData.terminationNotice || "30"} days' prior written notice to the other party. `;
      
      if (formData.earlyTerminationFee && formData.terminationFeeAmount) {
        text += `In the event Client terminates this Agreement before completion of the Services, Client shall pay Consultant an early termination fee of $${formData.terminationFeeAmount}.\n\n`;
      } else {
        text += `\n\n`;
      }
      
      text += `3.3 Effect of Termination. Upon termination of this Agreement, Client shall pay Consultant for all Services performed up to the effective date of termination.\n\n`;
      
      // 4. Intellectual Property
      text += `4. INTELLECTUAL PROPERTY\n\n`;
      
      if (formData.ipOwnership === 'client') {
        text += `4.1 Ownership of Work Product. All work product, including without limitation all Deliverables, reports, documents, and other materials developed by Consultant in connection with the Services (collectively, the "Work Product"), shall be the sole and exclusive property of Client. Consultant hereby assigns to Client all right, title, and interest in and to the Work Product, including all intellectual property rights therein.\n\n`;
      } else if (formData.ipOwnership === 'consultant') {
        text += `4.1 Ownership of Work Product. All work product, including without limitation all Deliverables, reports, documents, and other materials developed by Consultant in connection with the Services (collectively, the "Work Product"), shall remain the sole and exclusive property of Consultant. Consultant hereby grants to Client a `;
        
        if (formData.ipLicenseType === 'exclusive') {
          text += `worldwide, exclusive, perpetual, irrevocable, royalty-free license to use, reproduce, distribute, modify, and display the Work Product for any purpose.\n\n`;
        } else {
          text += `worldwide, non-exclusive, perpetual, irrevocable, royalty-free license to use, reproduce, distribute, modify, and display the Work Product for Client's internal business purposes.\n\n`;
        }
      } else { // ipOwnership === 'shared'
        text += `4.1 Ownership of Work Product. All work product, including without limitation all Deliverables, reports, documents, and other materials developed by Consultant in connection with the Services (collectively, the "Work Product"), shall be jointly owned by Client and Consultant. Each party shall have the right to use, reproduce, distribute, modify, and display the Work Product without accounting to the other party.\n\n`;
      }
      
      // Pre-existing IP
      if (formData.preExistingIp) {
        text += `4.2 Pre-existing Intellectual Property. Notwithstanding anything to the contrary herein, Consultant shall retain all right, title, and interest in and to all intellectual property that Consultant owned prior to the Effective Date or developed independently of the Services provided under this Agreement ("Pre-existing IP"). To the extent any Pre-existing IP is incorporated into the Work Product, Consultant hereby grants to Client a non-exclusive, perpetual, irrevocable, royalty-free license to use such Pre-existing IP in connection with the Work Product.\n\n`;
      }
      
      // 5. Confidentiality
      text += `5. CONFIDENTIALITY\n\n`;
      
      if (formData.nda) {
        text += `5.1 Confidential Information. Each party (the "Receiving Party") acknowledges that during the term of this Agreement, it may receive confidential or proprietary information of the other party (the "Disclosing Party"). Such information includes, without limitation, business plans, financial information, technical information, marketing strategies, client lists, and any other information that is marked confidential or that would reasonably be understood to be confidential given the nature of the information and the circumstances of disclosure (collectively, "Confidential Information").\n\n`;
        
        text += `5.2 Protection of Confidential Information. The Receiving Party shall: (a) use the same degree of care to protect the Disclosing Party's Confidential Information as it uses to protect its own confidential information of like nature, but in no circumstances less than reasonable care; (b) not disclose the Disclosing Party's Confidential Information to any third party without the Disclosing Party's prior written consent; and (c) limit access to the Disclosing Party's Confidential Information to those of its employees, contractors, and agents who have a need to know such information for purposes of performing this Agreement.\n\n`;
        
        text += `5.3 Term of Confidentiality Obligations. The confidentiality obligations set forth in this Section shall survive the termination or expiration of this Agreement for a period of ${formData.confidentialityTerm || "3"} years.\n\n`;
        
        if (formData.confidentialityExceptions) {
          text += `5.4 Exceptions. The confidentiality obligations set forth in this Section shall not apply to information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was known to the Receiving Party prior to disclosure by the Disclosing Party; (c) is rightfully obtained by the Receiving Party from a third party without restriction on use or disclosure; or (d) is independently developed by the Receiving Party without reference to the Disclosing Party's Confidential Information.\n\n`;
        }
      }
      
      // 6. Additional Terms
      text += `6. ADDITIONAL TERMS\n\n`;
      
      // Non-compete
      if (formData.nonCompete) {
        text += `6.1 Non-Competition. During the term of this Agreement and for a period of ${formData.nonCompeteMonths || "12"} months thereafter, Consultant shall not, directly or indirectly, engage in any business that competes with Client's business, without Client's prior written consent.\n\n`;
      }
      
      // Non-solicitation
      if (formData.nonSolicitation) {
        text += `6.${formData.nonCompete ? '2' : '1'} Non-Solicitation. During the term of this Agreement and for a period of ${formData.nonSolicitationMonths || "12"} months thereafter, Consultant shall not, directly or indirectly, solicit or attempt to solicit any client, customer, or employee of Client for the purpose of providing services competitive with those provided by Client or to terminate their relationship with Client.\n\n`;
      }
      
      // Indemnification
      if (formData.indemnification) {
        text += `6.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + 1} Indemnification. Each party (the "Indemnifying Party") shall defend, indemnify, and hold harmless the other party (the "Indemnified Party") from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to the Indemnifying Party's breach of this Agreement or negligent acts or omissions in performing under this Agreement.\n\n`;
      }
      
      // Limitation of Liability
      if (formData.limitLiability) {
        text += `6.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + (formData.indemnification ? 1 : 0) + 1} Limitation of Liability. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. `;
        
        if (formData.liabilityCapType === 'fees') {
          text += `EACH PARTY'S TOTAL CUMULATIVE LIABILITY IN CONNECTION WITH THIS AGREEMENT, WHETHER IN CONTRACT OR TORT OR OTHERWISE, SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY CLIENT TO CONSULTANT UNDER THIS AGREEMENT.\n\n`;
        } else if (formData.liabilityCapType === 'custom' && formData.liabilityCapAmount) {
          text += `EACH PARTY'S TOTAL CUMULATIVE LIABILITY IN CONNECTION WITH THIS AGREEMENT, WHETHER IN CONTRACT OR TORT OR OTHERWISE, SHALL NOT EXCEED $${formData.liabilityCapAmount}.\n\n`;
        } else {
          text += `EACH PARTY'S TOTAL CUMULATIVE LIABILITY IN CONNECTION WITH THIS AGREEMENT, WHETHER IN CONTRACT OR TORT OR OTHERWISE, SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY CLIENT TO CONSULTANT UNDER THIS AGREEMENT.\n\n`;
        }
      }
      
      // Insurance
      if (formData.insurance) {
        text += `6.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + (formData.indemnification ? 1 : 0) + (formData.limitLiability ? 1 : 0) + 1} Insurance. Consultant shall maintain, during the term of this Agreement, commercial general liability insurance, professional liability insurance, and, if applicable, workers' compensation insurance, in amounts not less than $${formData.insuranceAmount || "1,000,000"} per occurrence. Upon Client's request, Consultant shall provide Client with certificates of insurance evidencing such coverage.\n\n`;
      }
      
      // 7. General Provisions
      text += `7. GENERAL PROVISIONS\n\n`;
      
      // Independent Contractor
      text += `7.1 Independent Contractor. Consultant is an independent contractor and not an employee of Client. Consultant shall be responsible for all taxes, insurance, and other obligations related to Consultant's business operations.\n\n`;
      
      // Governing Law
      text += `7.2 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw || "California"}, without giving effect to any choice of law or conflict of law provisions.\n\n`;
      
      // Dispute Resolution
      text += `7.3 Dispute Resolution. `;
      if (formData.disputeResolution === 'arbitration') {
        text += `Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association then in effect. The arbitration shall take place in ${formData.arbitrationLocation || "California"}. The decision of the arbitrator shall be final and binding on the parties, and judgment on the award may be entered in any court having jurisdiction.\n\n`;
      } else if (formData.disputeResolution === 'mediation') {
        text += `Any dispute, controversy, or claim arising out of or relating to this Agreement shall first be submitted to mediation. If mediation is unsuccessful, the parties may pursue their rights and remedies in a court of competent jurisdiction.\n\n`;
      } else {
        text += `Any dispute, controversy, or claim arising out of or relating to this Agreement may be brought in a court of competent jurisdiction in the State of ${formData.governingLaw || "California"}.\n\n`;
      }
      
      // Entire Agreement
      text += `7.4 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, and understandings of the parties.\n\n`;
      
      // Amendments
      text += `7.5 Amendments. This Agreement may be amended only by a written instrument signed by both parties.\n\n`;
      
      // Severability
      text += `7.6 Severability. If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.\n\n`;
      
      // Assignment
      text += `7.7 Assignment. Neither party may assign this Agreement or any rights or obligations hereunder without the prior written consent of the other party.\n\n`;
      
      // Notices
      text += `7.8 Notices. All notices under this Agreement shall be in writing and shall be delivered by hand, sent by mail, or transmitted by email to the addresses set forth above.\n\n`;
      
      // Counterparts
      text += `7.9 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.\n\n`;
      
      // Signature Block
      text += `IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.\n\n`;
      text += `CLIENT:\n\n`;
      text += `${formData.clientName || "[Client Name]"}\n\n`;
      text += `By: ________________________\n`;
      text += `Name: ______________________\n`;
      text += `Title: _______________________\n\n`;
      text += `CONSULTANT:\n\n`;
      text += `${formData.consultantName || "[Consultant Name]"}\n\n`;
      text += `By: ________________________\n`;
      text += `Name: ______________________\n`;
      text += `Title: _______________________\n`;
      
      return text;
    };
    
    setDocumentText(generateDocument());
  }, [formData]);

  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [documentText, lastChanged]);

  // Function to create highlighted version of document text
  const createHighlightedText = () => {
    if (!lastChanged) return documentText;
    
    const sections = {
      // Basic Information
      clientName: /(Client Name|CLIENT:[\s\S]*?By:)/g,
      clientAddress: /with its principal place of business at [^\n]*/,
      clientEntityType: /a (corporation|limited liability company|partnership|sole proprietorship) with its principal/,
      consultantName: /(Consultant Name|CONSULTANT:[\s\S]*?By:)/g,
      consultantAddress: /an? [^\n]* with [^\n]* address at [^\n]*/,
      consultantEntityType: /an? (individual|corporation|limited liability company|partnership)/,
      effectiveDate: /as of [^\n]* \(the "Effective Date/,
      
      // Scope of Services
      servicesDescription: /1\.1 Scope of Services[\s\S]*?\n\n/,
      deliverables: /1\.2 Deliverables[\s\S]*?\n\n/,
      timeline: /1\.3 Timeline[\s\S]*?\n\n/,
      servicesLocation: /1\.4 Location[\s\S]*?\n\n/,
      customLocation: /Consultant shall perform the Services at [^\n]*\./,
      
      // Compensation
      compensationType: /2\.1 Fees[\s\S]*?\n\n/,
      hourlyRate: /at the rate of \$[^\s]* per hour/,
      fixedFee: /a fixed fee of \$[^\s]*/,
      retainerAmount: /a monthly retainer of \$[^\s]*/,
      paymentSchedule: /2\.2 Payment Schedule[\s\S]*?\n\n/,
      customPaymentSchedule: /2\.2 Payment Schedule\. [^\n]*\n\n/,
      expensesReimbursed: /2\.3 Expenses[\s\S]*?\n\n/,
      expensesRequireApproval: /provided that expenses exceeding \$[^\s]* require Client's prior written approval/,
      expenseThreshold: /expenses exceeding \$[^\s]* require Client/,
      
      // Term & Termination
      agreementTerm: /3\.1 Term[\s\S]*?\n\n/,
      fixedTermMonths: /period of [^\s]* months/,
      terminationNotice: /terminate this Agreement upon [^\s]* days'/,
      earlyTerminationFee: /In the event Client terminates this Agreement before completion of the Services/,
      terminationFeeAmount: /early termination fee of \$[^\s]*/,
      
      // Intellectual Property
      ipOwnership: /4\.1 Ownership of Work Product[\s\S]*?\n\n/,
      ipLicenseType: /(exclusive|non-exclusive), perpetual, irrevocable/,
      preExistingIp: /4\.2 Pre-existing Intellectual Property[\s\S]*?\n\n/,
      
      // Confidentiality
      confidentialityTerm: /for a period of [^\s]* years/,
      confidentialityExceptions: /5\.4 Exceptions[\s\S]*?\n\n/,
      nda: /5\. CONFIDENTIALITY[\s\S]*?(\d\. |IN WITNESS WHEREOF)/s,
      
      // Additional Terms
      nonCompete: /Non-Competition[\s\S]*?\n\n/,
      nonCompeteMonths: /Non-Competition[\s\S]*?period of [^\s]* months/,
      nonSolicitation: /Non-Solicitation[\s\S]*?\n\n/,
      nonSolicitationMonths: /Non-Solicitation[\s\S]*?period of [^\s]* months/,
      indemnification: /Indemnification[\s\S]*?\n\n/,
      limitLiability: /Limitation of Liability[\s\S]*?\n\n/,
      liabilityCapType: /TOTAL CUMULATIVE LIABILITY[\s\S]*?\n\n/,
      liabilityCapAmount: /SHALL NOT EXCEED \$[^\s]*/,
      insurance: /Insurance[\s\S]*?\n\n/,
      insuranceAmount: /amounts not less than \$[^\s]*/,
      
      // General Provisions
      governingLaw: /laws of the State of [^\s,]*/,
      disputeResolution: /7\.3 Dispute Resolution[\s\S]*?\n\n/,
      arbitrationLocation: /arbitration shall take place in [^\s.]*/
    };
    
    // Get the pattern for the last changed field
    const pattern = sections[lastChanged];
    
    if (!pattern) return documentText;
    
    // Find the matching text using the pattern
    const regex = new RegExp(pattern);
    return documentText.replace(regex, match => {
      return `<span class="highlighted-text">${match}</span>`;
    });
  };

  // Generate the highlighted version of the document
  const highlightedText = createHighlightedText();

  // Function to copy document text to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText).then(() => {
        alert('Document copied to clipboard successfully!');
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy document to clipboard. Please try again.');
    }
  };

  // Function to download document as Word
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - document text is empty.");
        return;
      }
      
      // Prepare the file name based on client and consultant names
      const clientPart = formData.clientName ? formData.clientName.replace(/[^a-zA-Z0-9]/g, '-') : 'Client';
      const consultantPart = formData.consultantName ? formData.consultantName.replace(/[^a-zA-Z0-9]/g, '-') : 'Consultant';
      const fileName = `Consulting-Agreement-${clientPart}-${consultantPart}`;
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: "Consulting Agreement",
        fileName: fileName
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Risk assessment for the finalize tab
  const renderRiskAssessment = () => {
    const risks = [];
    
    // Check for missing essential information
    if (!formData.clientName || !formData.consultantName) {
      risks.push({
        level: 'high',
        title: 'Missing Party Information',
        description: 'One or both parties are not properly identified in the agreement.',
        solution: 'Add complete name information for both the client and consultant.'
      });
    }
    
    if (!formData.servicesDescription) {
      risks.push({
        level: 'high',
        title: 'Undefined Scope of Services',
        description: 'The services to be provided are not clearly defined, which may lead to disputes.',
        solution: 'Provide a detailed description of the services to be performed.'
      });
    }
    
    if (formData.compensationType === 'hourly' && !formData.hourlyRate) {
      risks.push({
        level: 'high',
        title: 'Undefined Compensation',
        description: 'Hourly rate is not specified.',
        solution: 'Define a specific hourly rate for services.'
      });
    } else if (formData.compensationType === 'fixed' && !formData.fixedFee) {
      risks.push({
        level: 'high',
        title: 'Undefined Compensation',
        description: 'Fixed fee amount is not specified.',
        solution: 'Define a specific fixed fee amount for services.'
      });
    } else if (formData.compensationType === 'retainer' && !formData.retainerAmount) {
      risks.push({
        level: 'high',
        title: 'Undefined Compensation',
        description: 'Retainer amount is not specified.',
        solution: 'Define a specific retainer amount for services.'
      });
    }
    
    // Check for IP ownership issues
    if (formData.ipOwnership === 'consultant' && formData.ipLicenseType !== 'exclusive') {
      risks.push({
        level: 'medium',
        title: 'Limited IP Rights',
        description: 'Client only receives a non-exclusive license to the work product, which may limit their ability to use and exploit the deliverables.',
        solution: 'Consider granting Client an exclusive license or transferring ownership of the work product.'
      });
    }
    
    // Check for liability issues
    if (!formData.limitLiability) {
      risks.push({
        level: 'medium',
        title: 'Unlimited Liability',
        description: 'The agreement does not limit either party\'s liability, which could expose both parties to significant risk.',
        solution: 'Consider adding a limitation of liability clause to cap potential damages.'
      });
    }
    
    // Check for confidentiality issues
    if (!formData.nda) {
      risks.push({
        level: 'medium',
        title: 'No Confidentiality Protection',
        description: 'The agreement lacks confidentiality provisions, which may put sensitive information at risk.',
        solution: 'Add confidentiality provisions to protect both parties\' proprietary information.'
      });
    }
    
    // Check for insurance requirements
    if (!formData.insurance && (formData.compensationType === 'hourly' || (formData.compensationType === 'fixed' && parseInt(formData.fixedFee || '0') > 10000))) {
      risks.push({
        level: 'medium',
        title: 'No Insurance Requirement',
        description: 'Given the scope and value of services, there is no requirement for the consultant to maintain insurance coverage.',
        solution: 'Consider requiring appropriate insurance coverage for the consultant.'
      });
    }
    
    // Check for potential enforceability issues with restrictive covenants
    if (formData.nonCompete && parseInt(formData.nonCompeteMonths || '0') > 12) {
      risks.push({
        level: 'medium',
        title: 'Potentially Unenforceable Non-Compete',
        description: 'The non-compete provision extends beyond 12 months, which may be deemed unreasonable in many jurisdictions.',
        solution: 'Consider reducing the non-compete period to 12 months or less to improve enforceability.'
      });
    }
    
    // Check for additional important but not critical items
    if (!formData.deliverables) {
      risks.push({
        level: 'low',
        title: 'Undefined Deliverables',
        description: 'Specific deliverables are not defined, which may make it difficult to determine when services are complete.',
        solution: 'Add a clear list of deliverables that the consultant must provide.'
      });
    }
    
    if (!formData.timeline) {
      risks.push({
        level: 'low',
        title: 'No Timeline Specified',
        description: 'The agreement does not include a timeline for service completion.',
        solution: 'Add specific deadlines or a timeline for service completion.'
      });
    }
    
    if (formData.expensesReimbursed && !formData.expensesRequireApproval) {
      risks.push({
        level: 'low',
        title: 'Unlimited Expense Reimbursement',
        description: 'The agreement provides for expense reimbursement without requiring prior approval, which could lead to unexpected costs.',
        solution: 'Consider requiring prior approval for expenses or setting a threshold for approval.'
      });
    }
    
    // If no risks identified, add a positive message
    if (risks.length === 0) {
      risks.push({
        level: 'low',
        title: 'All Essential Elements Included',
        description: 'Your agreement includes all essential elements and appears to be well-structured.',
        solution: 'Consider having the agreement reviewed by legal counsel before execution.'
      });
    }
    
    return (
      <div className="risk-assessment">
        <h3>Risk Assessment</h3>
        {risks.map((risk, index) => (
          <div key={index} className={`risk-item ${risk.level}`}>
            <h4>
              {risk.level === 'high' && <Icon name="alert-triangle" />}
              {risk.level === 'medium' && <Icon name="alert-circle" />}
              {risk.level === 'low' && <Icon name="check-circle" />}
              {risk.title}
            </h4>
            <p>{risk.description}</p>
            <p className="solution"><strong>Solution:</strong> {risk.solution}</p>
          </div>
        ))}
      </div>
    );
  };

  // Render the current tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Information
        return (
          <>
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="clientName">Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                className="form-control"
                placeholder="Enter client name"
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="clientEntityType">Client Entity Type</label>
              <select
                id="clientEntityType"
                name="clientEntityType"
                className="form-control"
                value={formData.clientEntityType}
                onChange={handleChange}
              >
                <option value="corporation">Corporation</option>
                <option value="limited liability company">Limited Liability Company (LLC)</option>
                <option value="partnership">Partnership</option>
                <option value="sole proprietorship">Sole Proprietorship</option>
                <option value="individual">Individual</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="clientAddress">Client Address</label>
              <textarea
                id="clientAddress"
                name="clientAddress"
                className="form-control"
                placeholder="Enter client address"
                value={formData.clientAddress}
                onChange={handleChange}
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="consultantName">Consultant Name</label>
              <input
                type="text"
                id="consultantName"
                name="consultantName"
                className="form-control"
                placeholder="Enter consultant name"
                value={formData.consultantName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="consultantEntityType">Consultant Entity Type</label>
              <select
                id="consultantEntityType"
                name="consultantEntityType"
                className="form-control"
                value={formData.consultantEntityType}
                onChange={handleChange}
              >
                <option value="individual">Individual</option>
                <option value="corporation">Corporation</option>
                <option value="limited liability company">Limited Liability Company (LLC)</option>
                <option value="partnership">Partnership</option>
                <option value="sole proprietorship">Sole Proprietorship</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="consultantAddress">Consultant Address</label>
              <textarea
                id="consultantAddress"
                name="consultantAddress"
                className="form-control"
                placeholder="Enter consultant address"
                value={formData.consultantAddress}
                onChange={handleChange}
                rows="2"
              />
            </div>
            
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
          </>
        );
        
      case 1: // Scope of Services
        return (
          <>
            <h2>Scope of Services</h2>
            <div className="form-group">
              <label htmlFor="servicesDescription">Description of Services</label>
              <p className="description">Provide a detailed description of the services to be performed.</p>
              <textarea
                id="servicesDescription"
                name="servicesDescription"
                className="form-control"
                placeholder="Enter description of services"
                value={formData.servicesDescription}
                onChange={handleChange}
                rows="5"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="deliverables">Deliverables (Optional)</label>
              <p className="description">Specify any tangible outputs or deliverables that will result from the services.</p>
              <textarea
                id="deliverables"
                name="deliverables"
                className="form-control"
                placeholder="Enter deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="timeline">Timeline (Optional)</label>
              <p className="description">Specify the timeline for completion of services or deliverables.</p>
              <textarea
                id="timeline"
                name="timeline"
                className="form-control"
                placeholder="Enter timeline"
                value={formData.timeline}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Location of Services</label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="remote"
                    name="servicesLocation"
                    value="remote"
                    checked={formData.servicesLocation === 'remote'}
                    onChange={handleChange}
                  />
                  <label htmlFor="remote">Remote</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="client"
                    name="servicesLocation"
                    value="client"
                    checked={formData.servicesLocation === 'client'}
                    onChange={handleChange}
                  />
                  <label htmlFor="client">Client's Premises</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="consultant"
                    name="servicesLocation"
                    value="consultant"
                    checked={formData.servicesLocation === 'consultant'}
                    onChange={handleChange}
                  />
                  <label htmlFor="consultant">Consultant's Premises</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="custom"
                    name="servicesLocation"
                    value="custom"
                    checked={formData.servicesLocation === 'custom'}
                    onChange={handleChange}
                  />
                  <label htmlFor="custom">Custom Location</label>
                </div>
              </div>
              
              {formData.servicesLocation === 'custom' && (
                <input
                  type="text"
                  id="customLocation"
                  name="customLocation"
                  className="form-control"
                  placeholder="Enter custom location"
                  value={formData.customLocation}
                  onChange={handleChange}
                  style={{ marginTop: '0.5rem' }}
                />
              )}
            </div>
          </>
        );
        
      case 2: // Compensation
        return (
          <>
            <h2>Compensation</h2>
            <div className="form-group">
              <label>Compensation Type</label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="hourly"
                    name="compensationType"
                    value="hourly"
                    checked={formData.compensationType === 'hourly'}
                    onChange={handleChange}
                  />
                  <label htmlFor="hourly">Hourly Rate</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="fixed"
                    name="compensationType"
                    value="fixed"
                    checked={formData.compensationType === 'fixed'}
                    onChange={handleChange}
                  />
                  <label htmlFor="fixed">Fixed Fee</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="retainer"
                    name="compensationType"
                    value="retainer"
                    checked={formData.compensationType === 'retainer'}
                    onChange={handleChange}
                  />
                  <label htmlFor="retainer">Monthly Retainer</label>
                </div>
              </div>
            </div>
            
            {formData.compensationType === 'hourly' && (
              <div className="form-group">
                <label htmlFor="hourlyRate">Hourly Rate (USD)</label>
                <input
                  type="text"
                  id="hourlyRate"
                  name="hourlyRate"
                  className="form-control"
                  placeholder="Enter hourly rate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </div>
            )}
            
            {formData.compensationType === 'fixed' && (
              <div className="form-group">
                <label htmlFor="fixedFee">Fixed Fee Amount (USD)</label>
                <input
                  type="text"
                  id="fixedFee"
                  name="fixedFee"
                  className="form-control"
                  placeholder="Enter fixed fee amount"
                  value={formData.fixedFee}
                  onChange={handleChange}
                />
              </div>
            )}
            
            {formData.compensationType === 'retainer' && (
              <div className="form-group">
                <label htmlFor="retainerAmount">Monthly Retainer Amount (USD)</label>
                <input
                  type="text"
                  id="retainerAmount"
                  name="retainerAmount"
                  className="form-control"
                  placeholder="Enter monthly retainer amount"
                  value={formData.retainerAmount}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Payment Schedule</label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="monthly"
                    name="paymentSchedule"
                    value="monthly"
                    checked={formData.paymentSchedule === 'monthly'}
                    onChange={handleChange}
                  />
                  <label htmlFor="monthly">Monthly</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="milestone"
                    name="paymentSchedule"
                    value="milestone"
                    checked={formData.paymentSchedule === 'milestone'}
                    onChange={handleChange}
                  />
                  <label htmlFor="milestone">Upon Milestone Completion</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="upfront"
                    name="paymentSchedule"
                    value="upfront"
                    checked={formData.paymentSchedule === 'upfront'}
                    onChange={handleChange}
                  />
                  <label htmlFor="upfront">50% Upfront, 50% Upon Completion</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="custom-schedule"
                    name="paymentSchedule"
                    value="custom"
                    checked={formData.paymentSchedule === 'custom'}
                    onChange={handleChange}
                  />
                  <label htmlFor="custom-schedule">Custom Schedule</label>
                </div>
              </div>
              
              {formData.paymentSchedule === 'custom' && (
                <textarea
                  id="customPaymentSchedule"
                  name="customPaymentSchedule"
                  className="form-control"
                  placeholder="Describe custom payment schedule"
                  value={formData.customPaymentSchedule}
                  onChange={handleChange}
                  rows="3"
                  style={{ marginTop: '0.5rem' }}
                />
              )}
            </div>
            
            <div className="form-group">
              <label>Expenses</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="expensesReimbursed"
                  name="expensesReimbursed"
                  checked={formData.expensesReimbursed}
                  onChange={handleChange}
                />
                <label htmlFor="expensesReimbursed">Client will reimburse reasonable expenses</label>
              </div>
              
              {formData.expensesReimbursed && (
                <>
                  <div className="form-check" style={{ marginLeft: '1.5rem' }}>
                    <input
                      type="checkbox"
                      id="expensesRequireApproval"
                      name="expensesRequireApproval"
                      checked={formData.expensesRequireApproval}
                      onChange={handleChange}
                    />
                    <label htmlFor="expensesRequireApproval">Expenses above threshold require prior approval</label>
                  </div>
                  
                  {formData.expensesRequireApproval && (
                    <div style={{ marginLeft: '1.5rem' }}>
                      <label htmlFor="expenseThreshold">Expense Approval Threshold (USD)</label>
                      <input
                        type="text"
                        id="expenseThreshold"
                        name="expenseThreshold"
                        className="form-control"
                        placeholder="Enter expense threshold"
                        value={formData.expenseThreshold}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        );
        
      case 3: // Term & Termination
        return (
          <>
            <h2>Term & Termination</h2>
            <div className="form-group">
              <label>Agreement Term</label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="fixed-term"
                    name="agreementTerm"
                    value="fixed"
                    checked={formData.agreementTerm === 'fixed'}
                    onChange={handleChange}
                  />
                  <label htmlFor="fixed-term">Fixed Term</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="indefinite"
                    name="agreementTerm"
                    value="indefinite"
                    checked={formData.agreementTerm === 'indefinite'}
                    onChange={handleChange}
                  />
                  <label htmlFor="indefinite">Indefinite (Until Terminated)</label>
                </div>
              </div>
              
              {formData.agreementTerm === 'fixed' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label htmlFor="fixedTermMonths">Term Length (Months)</label>
                  <input
                    type="number"
                    id="fixedTermMonths"
                    name="fixedTermMonths"
                    className="form-control"
                    placeholder="Enter number of months"
                    value={formData.fixedTermMonths}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="terminationNotice">Termination Notice Period (Days)</label>
              <input
                type="number"
                id="terminationNotice"
                name="terminationNotice"
                className="form-control"
                placeholder="Enter notice period in days"
                value={formData.terminationNotice}
                onChange={handleChange}
                min="1"
              />
            </div>
            
            <div className="form-group">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="earlyTerminationFee"
                  name="earlyTerminationFee"
                  checked={formData.earlyTerminationFee}
                  onChange={handleChange}
                />
                <label htmlFor="earlyTerminationFee">Include early termination fee for client</label>
              </div>
              
              {formData.earlyTerminationFee && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label htmlFor="terminationFeeAmount">Termination Fee Amount (USD)</label>
                  <input
                    type="text"
                    id="terminationFeeAmount"
                    name="terminationFeeAmount"
                    className="form-control"
                    placeholder="Enter termination fee amount"
                    value={formData.terminationFeeAmount}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </>
        );
        
      case 4: // Intellectual Property
        return (
          <>
            <h2>Intellectual Property</h2>
            <div className="form-group">
              <label>Ownership of Work Product</label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="client-ownership"
                    name="ipOwnership"
                    value="client"
                    checked={formData.ipOwnership === 'client'}
                    onChange={handleChange}
                  />
                  <label htmlFor="client-ownership">Client Owns All Work Product</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="consultant-ownership"
                    name="ipOwnership"
                    value="consultant"
                    checked={formData.ipOwnership === 'consultant'}
                    onChange={handleChange}
                  />
                  <label htmlFor="consultant-ownership">Consultant Owns and Licenses to Client</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="shared-ownership"
                    name="ipOwnership"
                    value="shared"
                    checked={formData.ipOwnership === 'shared'}
                    onChange={handleChange}
                  />
                  <label htmlFor="shared-ownership">Shared Ownership</label>
                </div>
              </div>
            </div>
            
            {formData.ipOwnership === 'consultant' && (
              <div className="form-group">
                <label>License Type</label>
                <div className="radio-group">
                  <div className="form-check">
                    <input
                      type="radio"
                      id="non-exclusive"
                      name="ipLicenseType"
                      value="non-exclusive"
                      checked={formData.ipLicenseType === 'non-exclusive'}
                      onChange={handleChange}
                    />
                    <label htmlFor="non-exclusive">Non-exclusive License (Client can use, but Consultant can license to others)</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="exclusive"
                      name="ipLicenseType"
                      value="exclusive"
                      checked={formData.ipLicenseType === 'exclusive'}
                      onChange={handleChange}
                    />
                    <label htmlFor="exclusive">Exclusive License (Only Client can use)</label>
                  </div>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="preExistingIp"
                  name="preExistingIp"
                  checked={formData.preExistingIp}
                  onChange={handleChange}
                />
                <label htmlFor="preExistingIp">Consultant retains rights to pre-existing IP</label>
              </div>
            </div>
          </>
        );
        
      case 5: // Confidentiality
        return (
          <>
            <h2>Confidentiality</h2>
            <div className="form-group">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="nda"
                  name="nda"
                  checked={formData.nda}
                  onChange={handleChange}
                />
                <label htmlFor="nda">Include confidentiality provisions</label>
              </div>
            </div>
            
            {formData.nda && (
              <>
                <div className="form-group">
                  <label htmlFor="confidentialityTerm">Confidentiality Term (Years)</label>
                  <p className="description">How long will the confidentiality obligations last after the agreement ends?</p>
                  <input
                    type="number"
                    id="confidentialityTerm"
                    name="confidentialityTerm"
                    className="form-control"
                    placeholder="Enter term in years"
                    value={formData.confidentialityTerm}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
                
                <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="confidentialityExceptions"
                      name="confidentialityExceptions"
                      checked={formData.confidentialityExceptions}
                      onChange={handleChange}
                    />
                    <label htmlFor="confidentialityExceptions">Include standard confidentiality exceptions</label>
                  </div>
                  <p className="description">Information that is publicly available, previously known, independently developed, or rightfully obtained from third parties.</p>
                </div>
              </>
            )}
          </>
        );
        
      case 6: // Additional Terms
        return (
          <>
            <h2>Additional Terms</h2>
            
            <div className="form-group">
              <label>Restrictive Covenants</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="nonCompete"
                  name="nonCompete"
                  checked={formData.nonCompete}
                  onChange={handleChange}
                />
                <label htmlFor="nonCompete">Include non-compete clause</label>
              </div>
              
              {formData.nonCompete && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <label htmlFor="nonCompeteMonths">Non-Compete Duration (Months)</label>
                  <input
                    type="number"
                    id="nonCompeteMonths"
                    name="nonCompeteMonths"
                    className="form-control"
                    placeholder="Enter duration in months"
                    value={formData.nonCompeteMonths}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              )}
              
              <div className="form-check">
                <input
                  type="checkbox"
                  id="nonSolicitation"
                  name="nonSolicitation"
                  checked={formData.nonSolicitation}
                  onChange={handleChange}
                />
                <label htmlFor="nonSolicitation">Include non-solicitation clause</label>
              </div>
              
              {formData.nonSolicitation && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <label htmlFor="nonSolicitationMonths">Non-Solicitation Duration (Months)</label>
                  <input
                    type="number"
                    id="nonSolicitationMonths"
                    name="nonSolicitationMonths"
                    className="form-control"
                    placeholder="Enter duration in months"
                    value={formData.nonSolicitationMonths}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Liability & Indemnification</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="indemnification"
                  name="indemnification"
                  checked={formData.indemnification}
                  onChange={handleChange}
                />
                <label htmlFor="indemnification">Include mutual indemnification provision</label>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  id="limitLiability"
                  name="limitLiability"
                  checked={formData.limitLiability}
                  onChange={handleChange}
                />
                <label htmlFor="limitLiability">Include limitation of liability clause</label>
              </div>
              
              {formData.limitLiability && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <label>Liability Cap</label>
                  <div className="radio-group">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="fees-cap"
                        name="liabilityCapType"
                        value="fees"
                        checked={formData.liabilityCapType === 'fees'}
                        onChange={handleChange}
                      />
                      <label htmlFor="fees-cap">Limit to fees paid under agreement</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="custom-cap"
                        name="liabilityCapType"
                        value="custom"
                        checked={formData.liabilityCapType === 'custom'}
                        onChange={handleChange}
                      />
                      <label htmlFor="custom-cap">Custom amount</label>
                    </div>
                  </div>
                  
                  {formData.liabilityCapType === 'custom' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <label htmlFor="liabilityCapAmount">Liability Cap Amount (USD)</label>
                      <input
                        type="text"
                        id="liabilityCapAmount"
                        name="liabilityCapAmount"
                        className="form-control"
                        placeholder="Enter liability cap amount"
                        value={formData.liabilityCapAmount}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Insurance</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="insurance"
                  name="insurance"
                  checked={formData.insurance}
                  onChange={handleChange}
                />
                <label htmlFor="insurance">Require consultant to maintain insurance</label>
              </div>
              
              {formData.insurance && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <label htmlFor="insuranceAmount">Insurance Coverage Amount (USD)</label>
                  <input
                    type="text"
                    id="insuranceAmount"
                    name="insuranceAmount"
                    className="form-control"
                    placeholder="Enter insurance amount"
                    value={formData.insuranceAmount}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law</label>
              <select
                id="governingLaw"
                name="governingLaw"
                className="form-control"
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
                <option value="District of Columbia">District of Columbia</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Dispute Resolution</label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="arbitration"
                    name="disputeResolution"
                    value="arbitration"
                    checked={formData.disputeResolution === 'arbitration'}
                    onChange={handleChange}
                  />
                  <label htmlFor="arbitration">Binding Arbitration</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="mediation"
                    name="disputeResolution"
                    value="mediation"
                    checked={formData.disputeResolution === 'mediation'}
                    onChange={handleChange}
                  />
                  <label htmlFor="mediation">Mediation First, Then Litigation</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="litigation"
                    name="disputeResolution"
                    value="litigation"
                    checked={formData.disputeResolution === 'litigation'}
                    onChange={handleChange}
                  />
                  <label htmlFor="litigation">Litigation</label>
                </div>
              </div>
              
              {formData.disputeResolution === 'arbitration' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label htmlFor="arbitrationLocation">Arbitration Location</label>
                  <input
                    type="text"
                    id="arbitrationLocation"
                    name="arbitrationLocation"
                    className="form-control"
                    placeholder="Enter arbitration location"
                    value={formData.arbitrationLocation}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </>
        );
        
      case 7: // Finalize & Risk Assessment
        return (
          <>
            <h2>Finalize & Risk Assessment</h2>
            <p>Review your agreement and assess any potential risks or issues that should be addressed before finalizing.</p>
            
            {renderRiskAssessment()}
            
            <div className="form-group" style={{ marginTop: '2rem' }}>
              <h3>Next Steps</h3>
              <p>After downloading your agreement:</p>
              <ol>
                <li>Review the document carefully and make any necessary changes.</li>
                <li>Have both parties review the agreement before signing.</li>
                <li>Consider having the agreement reviewed by legal counsel, especially if it involves complex services or significant compensation.</li>
                <li>Ensure both parties keep a signed copy of the agreement for their records.</li>
              </ol>
            </div>
          </>
        );
        
      default:
        return <p>Unknown tab</p>;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Consulting Agreement Generator</h1>
        <p>Create a customized consulting agreement tailored to your specific needs in just a few steps.</p>
      </div>
      
      <div className="generator">
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
        
        {/* Two-column layout for form and preview */}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
          {/* Form Section */}
          <div className="form-section">
            {renderTabContent()}
          </div>
          
          {/* Preview Section */}
          <div className="preview-section">
            <div className="preview-header">
              <h2>Live Preview</h2>
            </div>
            <div className="preview-content" ref={previewRef}>
              <pre
                className="document-preview"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
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
            <Icon name="chevron-left" /> Previous
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
            <Icon name="copy" /> Copy to Clipboard
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
            <Icon name="file-text" /> Download MS Word
          </button>
          
          <button
            onClick={nextTab}
            className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
            disabled={currentTab === tabs.length - 1}
          >
            Next <Icon name="chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Render the application
ReactDOM.render(
  <ConsultingAgreementGenerator />,
  document.getElementById('root')
);