// Founder Collaboration Agreement Generator
const { useState, useEffect, useRef } = React;

// Main App Component
const App = () => {
  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    // General Information
    projectName: "",
    effectiveDate: "",
    
    // Founders Information
    founder1Name: "",
    founder1Email: "",
    founder1Address: "",
    founder1Title: "Co-Founder",
    founder1EquityPercentage: "50",
    
    founder2Name: "",
    founder2Email: "",
    founder2Address: "",
    founder2Title: "Co-Founder",
    founder2EquityPercentage: "50",
    
    // Additional Founders (optional)
    additionalFounders: false,
    founder3Name: "",
    founder3Email: "",
    founder3Address: "",
    founder3Title: "Co-Founder",
    founder3EquityPercentage: "",
    
    founder4Name: "",
    founder4Email: "",
    founder4Address: "",
    founder4Title: "Co-Founder",
    founder4EquityPercentage: "",
    
    // Roles and Responsibilities
    founder1Responsibilities: "",
    founder2Responsibilities: "",
    founder3Responsibilities: "",
    founder4Responsibilities: "",
    
    // Decision Making
    decisionMakingStructure: "majority", // majority, unanimous, specific
    specificDecisionMaking: "",
    
    // Intellectual Property
    ipAssignment: true,
    priorIP: false,
    priorIPDescription: "",
    
    // Confidentiality
    confidentialityTerm: "5", // years
    
    // Vesting
    vestingSchedule: true,
    vestingPeriod: "4", // years
    vestingCliff: "1", // year
    
    // Exit and Dissolution
    exitStrategy: "incorporation", // incorporation, acquisition, dissolution
    incorporationTimeline: "6", // months
    incorporationType: "delaware-c-corp", // delaware-c-corp, llc, etc.
    
    // Dispute Resolution
    disputeResolution: "mediation", // mediation, arbitration, courts
    governingLaw: "California",
    
    // Term and Termination
    agreementTerm: "indefinite", // indefinite, specific
    specificTerm: "12", // months
    terminationNotice: "30", // days
    
    // Miscellaneous
    expenseSharing: true,
    expenseSharingDetails: "Equally among founders, with pre-approval required for expenses exceeding $500.",
    nonCompete: false,
    nonSolicitation: true,
    nonCompeteTermMonths: "12",
    nonSolicitationTermMonths: "12"
  });
  
  // State to track what was last changed (for highlighting)
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
  // State for document text
  const [documentText, setDocumentText] = useState("");
  
  // Tab configuration
  const tabs = [
    { id: 'general', label: 'General Information' },
    { id: 'founders', label: 'Founders' },
    { id: 'roles', label: 'Roles & Responsibilities' },
    { id: 'decisions', label: 'Decision Making' },
    { id: 'ip', label: 'Intellectual Property' },
    { id: 'vesting', label: 'Vesting & Equity' },
    { id: 'exit', label: 'Exit Strategy' },
    { id: 'disputes', label: 'Dispute Resolution' },
    { id: 'term', label: 'Term & Termination' },
    { id: 'misc', label: 'Miscellaneous' },
    { id: 'evaluation', label: 'Risk Evaluation' }
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
  
  // Handle form input changes
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
  
  // Function to create and update document text based on form data
  useEffect(() => {
    // Helper to format date
    const formatDate = (dateString) => {
      if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (error) {
        return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    };
    
    // Build the agreement text
    let agreement = "";
    
    // Title and introduction
    agreement += `FOUNDER COLLABORATION AGREEMENT\n\n`;
    
    agreement += `This Founder Collaboration Agreement ("Agreement") is entered into as of ${formData.effectiveDate ? formatDate(formData.effectiveDate) : "the Effective Date"} by and between the following individuals:\n\n`;
    
    // List founders
    agreement += `1. ${formData.founder1Name || "[Founder 1 Name]"}, residing at ${formData.founder1Address || "[Founder 1 Address]"}, email: ${formData.founder1Email || "[Founder 1 Email]"}\n\n`;
    
    agreement += `2. ${formData.founder2Name || "[Founder 2 Name]"}, residing at ${formData.founder2Address || "[Founder 2 Address]"}, email: ${formData.founder2Email || "[Founder 2 Email]"}\n\n`;
    
    if (formData.additionalFounders) {
      if (formData.founder3Name) {
        agreement += `3. ${formData.founder3Name}, residing at ${formData.founder3Address || "[Founder 3 Address]"}, email: ${formData.founder3Email || "[Founder 3 Email]"}\n\n`;
      }
      
      if (formData.founder4Name) {
        agreement += `4. ${formData.founder4Name}, residing at ${formData.founder4Address || "[Founder 4 Address]"}, email: ${formData.founder4Email || "[Founder 4 Email]"}\n\n`;
      }
    }
    
    agreement += `Each individual listed above shall be referred to as a "Founder" and collectively as the "Founders."\n\n`;
    
    // Recitals
    agreement += `RECITALS\n\n`;
    
    agreement += `WHEREAS, the Founders wish to collaborate on the development of ${formData.projectName || "a business project"} (the "Project");\n\n`;
    
    agreement += `WHEREAS, the Founders wish to define the terms of their collaboration before formally incorporating a business entity; and\n\n`;
    
    agreement += `WHEREAS, the Founders desire to set forth their respective rights and obligations with respect to the Project, including ownership, roles and responsibilities, and other important matters.\n\n`;
    
    agreement += `NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Founders agree as follows:\n\n`;
    
    // 1. PURPOSE AND PROJECT
    agreement += `1. PURPOSE AND PROJECT\n\n`;
    
    agreement += `1.1 Purpose. The Founders are entering into this Agreement to outline the terms of their collaboration on the Project, which is intended to ${formData.projectName ? `develop ${formData.projectName}` : "develop a business venture"}.\n\n`;
    
    agreement += `1.2 No Partnership or Entity. This Agreement does not create a partnership, joint venture, or business entity of any kind; rather, it governs the Founders' collaboration until such time as they may choose to form a business entity.\n\n`;
    
    // 2. ROLES AND RESPONSIBILITIES
    agreement += `2. ROLES AND RESPONSIBILITIES\n\n`;
    
    agreement += `2.1 Titles and Roles. Each Founder shall have the following title and responsibilities:\n\n`;
    
    agreement += `(a) ${formData.founder1Name || "[Founder 1]"}: ${formData.founder1Title || "Co-Founder"}\n`;
    agreement += `Responsibilities: ${formData.founder1Responsibilities || "General management, leadership, and oversight of the Project."}\n\n`;
    
    agreement += `(b) ${formData.founder2Name || "[Founder 2]"}: ${formData.founder2Title || "Co-Founder"}\n`;
    agreement += `Responsibilities: ${formData.founder2Responsibilities || "General management, leadership, and oversight of the Project."}\n\n`;
    
    if (formData.additionalFounders) {
      if (formData.founder3Name) {
        agreement += `(c) ${formData.founder3Name}: ${formData.founder3Title || "Co-Founder"}\n`;
        agreement += `Responsibilities: ${formData.founder3Responsibilities || "General management, leadership, and oversight of the Project."}\n\n`;
      }
      
      if (formData.founder4Name) {
        agreement += `(d) ${formData.founder4Name}: ${formData.founder4Title || "Co-Founder"}\n`;
        agreement += `Responsibilities: ${formData.founder4Responsibilities || "General management, leadership, and oversight of the Project."}\n\n`;
      }
    }
    
    agreement += `2.2 Time Commitment. Each Founder shall devote sufficient time and effort to fulfill their responsibilities for the Project. The Founders acknowledge that their time commitments may vary depending on Project needs and personal circumstances.\n\n`;
    
    // 3. DECISION MAKING
    agreement += `3. DECISION MAKING\n\n`;
    
    if (formData.decisionMakingStructure === "majority") {
      agreement += `3.1 Decision Making Process. All major decisions affecting the Project shall require the approval of a majority of the Founders. Major decisions include, but are not limited to, changes to the business model, significant expenses, addition of new founders, and creation of formal business entities.\n\n`;
    } else if (formData.decisionMakingStructure === "unanimous") {
      agreement += `3.1 Decision Making Process. All major decisions affecting the Project shall require the unanimous approval of all Founders. Major decisions include, but are not limited to, changes to the business model, significant expenses, addition of new founders, and creation of formal business entities.\n\n`;
    } else if (formData.decisionMakingStructure === "specific") {
      agreement += `3.1 Decision Making Process. ${formData.specificDecisionMaking || "The Founders shall make decisions as specified in this Agreement."}\n\n`;
    }
    
    agreement += `3.2 Day-to-Day Decisions. Each Founder may make routine day-to-day decisions within their area of responsibility without obtaining approval from other Founders, provided such decisions do not constitute major decisions as described above.\n\n`;
    
    // 4. OWNERSHIP AND EQUITY
    agreement += `4. OWNERSHIP AND EQUITY\n\n`;
    
    agreement += `4.1 Initial Ownership Percentages. The Founders agree that they intend to allocate ownership of the Project as follows:\n\n`;
    
    agreement += `(a) ${formData.founder1Name || "[Founder 1]"}: ${formData.founder1EquityPercentage || "50"}%\n`;
    agreement += `(b) ${formData.founder2Name || "[Founder 2]"}: ${formData.founder2EquityPercentage || "50"}%\n`;
    
    if (formData.additionalFounders) {
      if (formData.founder3Name && formData.founder3EquityPercentage) {
        agreement += `(c) ${formData.founder3Name}: ${formData.founder3EquityPercentage}%\n`;
      }
      
      if (formData.founder4Name && formData.founder4EquityPercentage) {
        agreement += `(d) ${formData.founder4Name}: ${formData.founder4EquityPercentage}%\n`;
      }
    }
    
    agreement += `\n4.2 Future Entity. Upon formation of a formal business entity, the Founders intend to receive equity in such entity according to the percentages listed above, subject to the vesting provisions set forth in Section 5.\n\n`;
    
    // 5. VESTING
    agreement += `5. VESTING\n\n`;
    
    if (formData.vestingSchedule) {
      agreement += `5.1 Vesting Schedule. The Founders' equity shall be subject to vesting over a ${formData.vestingPeriod || "4"}-year period, with a ${formData.vestingCliff || "1"}-year cliff, as follows:\n\n`;
      
      agreement += `(a) No equity shall vest until the ${formData.vestingCliff || "1"}-year anniversary of this Agreement (the "Cliff Date").\n\n`;
      
      agreement += `(b) On the Cliff Date, ${formData.vestingCliff || "1"}/${formData.vestingPeriod || "4"} (${(Number(formData.vestingCliff || "1") / Number(formData.vestingPeriod || "4") * 100).toFixed(2)}%) of each Founder's equity shall vest.\n\n`;
      
      agreement += `(c) After the Cliff Date, the remaining unvested equity shall vest in equal monthly installments over the remaining ${Number(formData.vestingPeriod || "4") - Number(formData.vestingCliff || "1")} years.\n\n`;
      
      agreement += `5.2 Departure of Founders. If a Founder voluntarily terminates their involvement with the Project or is terminated for Cause (as defined below) before all of their equity has vested, then the unvested portion shall be forfeited and redistributed pro rata among the remaining Founders based on their relative ownership percentages.\n\n`;
      
      agreement += `5.3 Acceleration Events. Vesting shall accelerate fully for all Founders upon: (i) a sale of substantially all of the assets of the future business entity; (ii) a merger or consolidation resulting in a change of control of the future business entity; or (iii) an initial public offering of the future business entity.\n\n`;
    } else {
      agreement += `5.1 No Vesting Schedule. The Founders' equity shall be fully vested upon the formation of a formal business entity, with no vesting requirements.\n\n`;
    }
    
    // 6. INTELLECTUAL PROPERTY
    agreement += `6. INTELLECTUAL PROPERTY\n\n`;
    
    if (formData.ipAssignment) {
      agreement += `6.1 Assignment of Intellectual Property. Each Founder hereby assigns to the group of Founders (in accordance with their respective ownership percentages) all right, title, and interest in and to any and all inventions, original works of authorship, developments, concepts, improvements, designs, drawings, discoveries, algorithms, formulas, processes, trademarks, or trade secrets, whether or not patentable or registrable under patent, copyright, or similar laws, that such Founder may solely or jointly conceive, develop, or reduce to practice during the term of this Agreement and that relate to the Project (collectively, "Intellectual Property").\n\n`;
      
      agreement += `6.2 Further Assurances. Each Founder agrees to assist the other Founders, or their designee, in every proper way to secure the rights in the Intellectual Property in any and all countries, including the disclosure of all pertinent information and data with respect thereto, the execution of all applications, specifications, oaths, assignments, and all other instruments which the Founders shall deem necessary in order to apply for and obtain such rights and in order to assign and convey to the Founders the sole and exclusive right, title, and interest in and to such Intellectual Property.\n\n`;
      
      if (formData.priorIP) {
        agreement += `6.3 Prior Intellectual Property. Notwithstanding the foregoing, the Founders acknowledge that certain Intellectual Property created before the Effective Date of this Agreement shall remain the separate property of the respective Founder and is not subject to the assignment provisions of Section 6.1. Such prior Intellectual Property is described as follows:\n\n${formData.priorIPDescription || "[Description of prior intellectual property]"}\n\n`;
      }
    } else {
      agreement += `6.1 Individual Ownership of Intellectual Property. Any intellectual property created by a Founder shall remain the property of that Founder, though each Founder grants to the other Founders a non-exclusive, royalty-free license to use such intellectual property in connection with the Project during the term of this Agreement.\n\n`;
    }
    
    // 7. CONFIDENTIALITY
    agreement += `7. CONFIDENTIALITY\n\n`;
    
    agreement += `7.1 Confidential Information. Each Founder acknowledges that during their involvement with the Project, they will have access to and become acquainted with confidential and proprietary information ("Confidential Information"). Confidential Information includes, but is not limited to, information pertaining to business plans, financial records, marketing strategies, customer lists, projects, proposals, and technical specifications related to the Project.\n\n`;
    
    agreement += `7.2 Non-Disclosure and Non-Use. Each Founder agrees not to disclose any Confidential Information to third parties and not to use Confidential Information for any purpose other than the development of the Project, during the term of this Agreement and for a period of ${formData.confidentialityTerm || "5"} years thereafter.\n\n`;
    
    agreement += `7.3 Exceptions. The obligations of confidentiality shall not apply to information that: (i) was known to the Founder prior to receipt from the other Founders; (ii) is or becomes publicly available through no fault of the Founder; (iii) is rightfully received by the Founder from a third party without a duty of confidentiality; (iv) is independently developed by the Founder without access to Confidential Information; or (v) is required to be disclosed by law or court order.\n\n`;
    
    // 8. EXIT STRATEGY
    agreement += `8. EXIT STRATEGY\n\n`;
    
    if (formData.exitStrategy === "incorporation") {
      agreement += `8.1 Incorporation Plan. The Founders intend to incorporate a formal business entity within ${formData.incorporationTimeline || "6"} months of the Effective Date. The anticipated corporate form is a ${formData.incorporationType === "delaware-c-corp" ? "Delaware C Corporation" : formData.incorporationType === "llc" ? "Limited Liability Company" : "business entity to be determined"}.\n\n`;
      
      agreement += `8.2 Transfer of Assets. Upon incorporation, all Founders agree to transfer all assets, intellectual property, and other rights related to the Project to the new entity in exchange for equity in accordance with the percentages specified in Section 4, subject to the vesting provisions of Section 5.\n\n`;
      
      agreement += `8.3 Transition Process. The Founders shall work together in good faith to negotiate and execute formal documentation to effect the incorporation and transition of the Project to the new entity.\n\n`;
    } else if (formData.exitStrategy === "acquisition") {
      agreement += `8.1 Acquisition Strategy. The Founders intend to develop the Project with the goal of eventual acquisition by a third party. Any offer for acquisition shall be presented to all Founders, and acceptance of such offer shall require approval in accordance with the decision-making process outlined in Section 3.\n\n`;
      
      agreement += `8.2 Distribution of Proceeds. In the event of an acquisition before formal incorporation, the proceeds shall be distributed among the Founders according to the percentages specified in Section 4, subject to the vesting provisions of Section 5.\n\n`;
    } else if (formData.exitStrategy === "dissolution") {
      agreement += `8.1 Project Termination. In the event the Founders decide to terminate the Project, they shall work together to wind down all activities in an orderly manner.\n\n`;
      
      agreement += `8.2 Asset Distribution. Upon Project termination, any assets shall be distributed among the Founders according to the percentages specified in Section 4, subject to the vesting provisions of Section 5.\n\n`;
    }
    
    // 9. DISPUTE RESOLUTION
    agreement += `9. DISPUTE RESOLUTION\n\n`;
    
    if (formData.disputeResolution === "mediation") {
      agreement += `9.1 Mediation. In the event of any dispute, claim, or controversy arising out of or relating to this Agreement or the Project, the Founders agree to first attempt to resolve the dispute through good-faith negotiation. If such negotiation fails to resolve the dispute within 30 days, the Founders agree to submit the dispute to confidential mediation under the mediation rules of the American Arbitration Association before resorting to arbitration, litigation, or other dispute resolution procedure.\n\n`;
    } else if (formData.disputeResolution === "arbitration") {
      agreement += `9.1 Arbitration. Any dispute, claim, or controversy arising out of or relating to this Agreement or the Project shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in ${formData.governingLaw || "California"}, and the decision of the arbitrator shall be final and binding on all parties.\n\n`;
    } else if (formData.disputeResolution === "courts") {
      agreement += `9.1 Litigation. Any dispute, claim, or controversy arising out of or relating to this Agreement or the Project shall be resolved by litigation in the state or federal courts located in ${formData.governingLaw || "California"}.\n\n`;
    }
    
    agreement += `9.2 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw || "California"}, without giving effect to any choice of law or conflict of law provisions.\n\n`;
    
    // 10. TERM AND TERMINATION
    agreement += `10. TERM AND TERMINATION\n\n`;
    
    if (formData.agreementTerm === "indefinite") {
      agreement += `10.1 Term. This Agreement shall commence on the Effective Date and continue in effect until the earlier of: (i) the formation of a business entity to continue the Project; (ii) the mutual written agreement of all Founders to terminate this Agreement; or (iii) the abandonment of the Project.\n\n`;
    } else if (formData.agreementTerm === "specific") {
      agreement += `10.1 Term. This Agreement shall commence on the Effective Date and continue for a period of ${formData.specificTerm || "12"} months, unless earlier terminated as provided herein. The term may be extended by mutual written agreement of all Founders.\n\n`;
    }
    
    agreement += `10.2 Voluntary Withdrawal. A Founder may voluntarily withdraw from the Project by providing at least ${formData.terminationNotice || "30"} days' written notice to the other Founders. In such event, the withdrawing Founder shall retain only their vested equity (if any) as determined under Section 5, and their unvested equity shall be forfeited and redistributed pro rata among the remaining Founders.\n\n`;
    
    agreement += `10.3 Termination for Cause. A Founder may be terminated for Cause upon the written agreement of all other Founders. "Cause" shall include: (i) material breach of this Agreement; (ii) engagement in conduct that is demonstrably and materially injurious to the Project; (iii) conviction of a felony or crime involving moral turpitude; or (iv) willful failure to perform substantial responsibilities after written notice and a reasonable opportunity to cure. In the event of termination for Cause, the terminated Founder shall forfeit all unvested equity (if any) as determined under Section 5.\n\n`;
    
    agreement += `10.4 Effect of Termination. Termination of a Founder's participation in the Project shall not affect the rights and obligations of the remaining Founders under this Agreement, which shall continue in full force and effect. The provisions of Sections 6 (Intellectual Property), 7 (Confidentiality), and 9 (Dispute Resolution) shall survive any termination of this Agreement.\n\n`;
    
    // 11. MISCELLANEOUS
    agreement += `11. MISCELLANEOUS\n\n`;
    
    if (formData.expenseSharing) {
      agreement += `11.1 Expenses. Project expenses shall be shared by the Founders as follows: ${formData.expenseSharingDetails || "Equally among the Founders, with pre-approval required for expenses exceeding $500."}. Each Founder shall keep accurate records of all expenses incurred on behalf of the Project and shall be entitled to reimbursement for approved expenses.\n\n`;
    } else {
      agreement += `11.1 Expenses. Each Founder shall be responsible for their own expenses incurred in connection with the Project, unless otherwise agreed in writing by all Founders.\n\n`;
    }
    
    if (formData.nonCompete) {
      agreement += `11.2 Non-Competition. During the term of this Agreement and for a period of ${formData.nonCompeteTermMonths || "12"} months thereafter, each Founder agrees not to engage in any business activity that directly competes with the Project without the prior written consent of all other Founders.\n\n`;
    }
    
    if (formData.nonSolicitation) {
      agreement += `11.${formData.nonCompete ? "3" : "2"} Non-Solicitation. During the term of this Agreement and for a period of ${formData.nonSolicitationTermMonths || "12"} months thereafter, each Founder agrees not to solicit or attempt to solicit any employee, contractor, customer, or supplier of the Project for any business that competes with the Project.\n\n`;
    }
    
    agreement += `11.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + 2} Entire Agreement. This Agreement constitutes the entire agreement among the Founders with respect to the subject matter hereof and supersedes all prior agreements and understandings, whether written or oral.\n\n`;
    
    agreement += `11.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + 3} Amendment. This Agreement may be amended only by a written instrument signed by all Founders.\n\n`;
    
    agreement += `11.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + 4} Assignment. No Founder may assign this Agreement or any rights or obligations hereunder without the prior written consent of all other Founders.\n\n`;
    
    agreement += `11.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + 5} Notices. All notices required or permitted under this Agreement shall be in writing and shall be delivered personally, sent by electronic mail, or sent by certified or registered mail to the email or physical addresses provided by each Founder.\n\n`;
    
    agreement += `11.${(formData.nonCompete ? 1 : 0) + (formData.nonSolicitation ? 1 : 0) + 6} Severability. If any provision of this Agreement is found to be invalid or unenforceable, the other provisions shall remain effective and enforceable to the maximum extent permitted by law.\n\n`;
    
    // Signature block
    agreement += `IN WITNESS WHEREOF, the Founders have executed this Founder Collaboration Agreement as of the Effective Date.\n\n`;
    
    agreement += `FOUNDERS:\n\n`;
    
    agreement += `${formData.founder1Name || "[FOUNDER 1 NAME]"}\n\n`;
    agreement += `Signature: ________________________\n\n`;
    agreement += `Date: ________________________\n\n`;
    
    agreement += `${formData.founder2Name || "[FOUNDER 2 NAME]"}\n\n`;
    agreement += `Signature: ________________________\n\n`;
    agreement += `Date: ________________________\n\n`;
    
    if (formData.additionalFounders) {
      if (formData.founder3Name) {
        agreement += `${formData.founder3Name}\n\n`;
        agreement += `Signature: ________________________\n\n`;
        agreement += `Date: ________________________\n\n`;
      }
      
      if (formData.founder4Name) {
        agreement += `${formData.founder4Name}\n\n`;
        agreement += `Signature: ________________________\n\n`;
        agreement += `Date: ________________________\n\n`;
      }
    }
    
    // Update document text
    setDocumentText(agreement);
  }, [formData]);
  
  // Function to create highlighted version of text with yellow background
  const createHighlightedHtml = () => {
    if (!lastChanged || !documentText) return documentText;
    
    let highlighted = documentText;
    
    // Define patterns to match based on what was changed
    const patterns = {
      // General Information
      projectName: formData.projectName ? new RegExp(`${formData.projectName}`, 'g') : null,
      effectiveDate: formData.effectiveDate ? new RegExp(`${formatDate(formData.effectiveDate)}`, 'g') : null,
      
      // Founders Information
      founder1Name: formData.founder1Name ? new RegExp(`${formData.founder1Name}`, 'g') : null,
      founder1Email: formData.founder1Email ? new RegExp(`${formData.founder1Email}`, 'g') : null,
      founder1Address: formData.founder1Address ? new RegExp(`${formData.founder1Address}`, 'g') : null,
      founder1Title: formData.founder1Title ? new RegExp(`${formData.founder1Title}`, 'g') : null,
      founder1EquityPercentage: formData.founder1EquityPercentage ? new RegExp(`${formData.founder1EquityPercentage}%`, 'g') : null,
      
      founder2Name: formData.founder2Name ? new RegExp(`${formData.founder2Name}`, 'g') : null,
      founder2Email: formData.founder2Email ? new RegExp(`${formData.founder2Email}`, 'g') : null,
      founder2Address: formData.founder2Address ? new RegExp(`${formData.founder2Address}`, 'g') : null,
      founder2Title: formData.founder2Title ? new RegExp(`${formData.founder2Title}`, 'g') : null,
      founder2EquityPercentage: formData.founder2EquityPercentage ? new RegExp(`${formData.founder2EquityPercentage}%`, 'g') : null,
      
      founder3Name: formData.founder3Name ? new RegExp(`${formData.founder3Name}`, 'g') : null,
      founder3Email: formData.founder3Email ? new RegExp(`${formData.founder3Email}`, 'g') : null,
      founder3Address: formData.founder3Address ? new RegExp(`${formData.founder3Address}`, 'g') : null,
      founder3Title: formData.founder3Title ? new RegExp(`${formData.founder3Title}`, 'g') : null,
      founder3EquityPercentage: formData.founder3EquityPercentage ? new RegExp(`${formData.founder3EquityPercentage}%`, 'g') : null,
      
      founder4Name: formData.founder4Name ? new RegExp(`${formData.founder4Name}`, 'g') : null,
      founder4Email: formData.founder4Email ? new RegExp(`${formData.founder4Email}`, 'g') : null,
      founder4Address: formData.founder4Address ? new RegExp(`${formData.founder4Address}`, 'g') : null,
      founder4Title: formData.founder4Title ? new RegExp(`${formData.founder4Title}`, 'g') : null,
      founder4EquityPercentage: formData.founder4EquityPercentage ? new RegExp(`${formData.founder4EquityPercentage}%`, 'g') : null,
      
      // Roles and Responsibilities
      founder1Responsibilities: formData.founder1Responsibilities ? new RegExp(`Responsibilities: ${formData.founder1Responsibilities}`, 'g') : null,
      founder2Responsibilities: formData.founder2Responsibilities ? new RegExp(`Responsibilities: ${formData.founder2Responsibilities}`, 'g') : null,
      founder3Responsibilities: formData.founder3Responsibilities ? new RegExp(`Responsibilities: ${formData.founder3Responsibilities}`, 'g') : null,
      founder4Responsibilities: formData.founder4Responsibilities ? new RegExp(`Responsibilities: ${formData.founder4Responsibilities}`, 'g') : null,
      
      // Decision Making
      specificDecisionMaking: formData.specificDecisionMaking ? new RegExp(`3\\.1 Decision Making Process\\. ${formData.specificDecisionMaking}`, 'g') : null,
      
      // Intellectual Property
      priorIPDescription: formData.priorIPDescription ? new RegExp(`${formData.priorIPDescription}`, 'g') : null,
      
      // Confidentiality
      confidentialityTerm: formData.confidentialityTerm ? new RegExp(`${formData.confidentialityTerm} years`, 'g') : null,
      
      // Vesting
      vestingPeriod: formData.vestingPeriod ? new RegExp(`${formData.vestingPeriod}-year period`, 'g') : null,
      vestingCliff: formData.vestingCliff ? new RegExp(`${formData.vestingCliff}-year cliff`, 'g') : null,
      
      // Exit and Dissolution
      incorporationTimeline: formData.incorporationTimeline ? new RegExp(`within ${formData.incorporationTimeline} months`, 'g') : null,
      
      // Term and Termination
      specificTerm: formData.specificTerm ? new RegExp(`period of ${formData.specificTerm} months`, 'g') : null,
      terminationNotice: formData.terminationNotice ? new RegExp(`${formData.terminationNotice} days'`, 'g') : null,
      
      // Miscellaneous
      expenseSharingDetails: formData.expenseSharingDetails ? new RegExp(`${formData.expenseSharingDetails}`, 'g') : null,
      nonCompeteTermMonths: formData.nonCompeteTermMonths ? new RegExp(`period of ${formData.nonCompeteTermMonths} months`, 'g') : null,
      nonSolicitationTermMonths: formData.nonSolicitationTermMonths ? new RegExp(`period of ${formData.nonSolicitationTermMonths} months`, 'g') : null
    };
    
    // Apply highlighting based on what was changed
    if (patterns[lastChanged]) {
      highlighted = highlighted.replace(patterns[lastChanged], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    // Special handling for checkboxes and radio buttons
    if (lastChanged === 'additionalFounders' || 
        lastChanged === 'ipAssignment' || 
        lastChanged === 'priorIP' || 
        lastChanged === 'vestingSchedule' ||
        lastChanged === 'expenseSharing' ||
        lastChanged === 'nonCompete' ||
        lastChanged === 'nonSolicitation' ||
        lastChanged === 'decisionMakingStructure' ||
        lastChanged === 'exitStrategy' ||
        lastChanged === 'incorporationType' ||
        lastChanged === 'disputeResolution' ||
        lastChanged === 'agreementTerm') {
      
      // Handle specific sections based on option selected
      let sectionPattern;
      
      switch(lastChanged) {
        case 'additionalFounders':
          if (formData.additionalFounders) {
            sectionPattern = /3\.\s+.*\n\n4\.\s+.*\n\n/g;
          } else {
            sectionPattern = /Each individual listed above shall be referred to as/g;
          }
          break;
        case 'ipAssignment':
          sectionPattern = /6\. INTELLECTUAL PROPERTY\n\n.*?\n\n/s;
          break;
        case 'priorIP':
          sectionPattern = /6\.3 Prior Intellectual Property.*?\n\n/s;
          break;
        case 'vestingSchedule':
          sectionPattern = /5\. VESTING\n\n.*?\n\n/s;
          break;
        case 'decisionMakingStructure':
          sectionPattern = /3\.1 Decision Making Process.*?\n\n/s;
          break;
        case 'exitStrategy':
          sectionPattern = /8\. EXIT STRATEGY\n\n.*?\n\n/s;
          break;
        case 'incorporationType':
          sectionPattern = /anticipated corporate form is a [^.]*\./g;
          break;
        case 'disputeResolution':
          sectionPattern = /9\.1 (Mediation|Arbitration|Litigation).*?\n\n/s;
          break;
        case 'agreementTerm':
          sectionPattern = /10\.1 Term.*?\n\n/s;
          break;
        case 'expenseSharing':
          sectionPattern = /11\.1 Expenses.*?\n\n/s;
          break;
        case 'nonCompete':
          sectionPattern = /11\.[0-9] Non-Competition.*?\n\n/s;
          break;
        case 'nonSolicitation':
          sectionPattern = /11\.[0-9] Non-Solicitation.*?\n\n/s;
          break;
        default:
          sectionPattern = null;
      }
      
      if (sectionPattern) {
        highlighted = highlighted.replace(sectionPattern, match => 
          `<span class="highlighted-text">${match}</span>`
        );
      }
    }
    
    return highlighted;
  };
  
  // Helper to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastChanged]);
  
  // Function to copy the agreement to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert("Agreement successfully copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };
  
  // Function to download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      window.generateWordDoc(documentText, {
        documentTitle: "Founder Collaboration Agreement",
        fileName: `Founder-Collaboration-Agreement-${formData.projectName ? formData.projectName.replace(/\s+/g, '-') : 'Draft'}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Function to evaluate risks in the agreement
  const evaluateRisks = () => {
    const risks = [];
    
    // 1. Check founder equity totals
    const equityTotal = parseFloat(formData.founder1EquityPercentage || 0) + 
                       parseFloat(formData.founder2EquityPercentage || 0) + 
                       (formData.additionalFounders ? parseFloat(formData.founder3EquityPercentage || 0) : 0) + 
                       (formData.additionalFounders ? parseFloat(formData.founder4EquityPercentage || 0) : 0);
    
    if (Math.abs(equityTotal - 100) > 0.01) {
      risks.push({
        category: "Equity Allocation",
        issue: "Founder equity percentages do not add up to 100%",
        impact: "High",
        color: "#ef4444", // Red
        recommendation: "Adjust equity percentages to total exactly 100%."
      });
    } else {
      risks.push({
        category: "Equity Allocation",
        issue: "Founder equity percentages correctly total 100%",
        impact: "None",
        color: "#22c55e", // Green
        recommendation: "No action needed."
      });
    }
    
    // 2. Check for missing founder details
    const founderDetailsMissing = [
      !formData.founder1Name || !formData.founder1Email || !formData.founder1Address,
      !formData.founder2Name || !formData.founder2Email || !formData.founder2Address,
      formData.additionalFounders && formData.founder3Name && (!formData.founder3Email || !formData.founder3Address),
      formData.additionalFounders && formData.founder4Name && (!formData.founder4Email || !formData.founder4Address)
    ].some(Boolean);
    
    if (founderDetailsMissing) {
      risks.push({
        category: "Founder Information",
        issue: "One or more founders have missing contact details",
        impact: "Medium",
        color: "#f97316", // Orange
        recommendation: "Complete all founder name, email, and address fields."
      });
    } else {
      risks.push({
        category: "Founder Information",
        issue: "All founder contact details are complete",
        impact: "None",
        color: "#22c55e", // Green
        recommendation: "No action needed."
      });
    }
    
    // 3. Check roles and responsibilities
    const rolesMissing = [
      !formData.founder1Responsibilities,
      !formData.founder2Responsibilities,
      formData.additionalFounders && formData.founder3Name && !formData.founder3Responsibilities,
      formData.additionalFounders && formData.founder4Name && !formData.founder4Responsibilities
    ].some(Boolean);
    
    if (rolesMissing) {
      risks.push({
        category: "Roles & Responsibilities",
        issue: "One or more founders have undefined responsibilities",
        impact: "Medium",
        color: "#f97316", // Orange
        recommendation: "Define specific responsibilities for each founder to avoid confusion and disputes."
      });
    } else {
      risks.push({
        category: "Roles & Responsibilities",
        issue: "All founders have defined responsibilities",
        impact: "None",
        color: "#22c55e", // Green
        recommendation: "No action needed."
      });
    }
    
    // 4. Vesting considerations
    if (!formData.vestingSchedule) {
      risks.push({
        category: "Vesting",
        issue: "No vesting schedule included",
        impact: "High",
        color: "#ef4444", // Red
        recommendation: "Consider adding a vesting schedule to protect founders if someone leaves early."
      });
    } else if (formData.vestingCliff === "0") {
      risks.push({
        category: "Vesting",
        issue: "Vesting schedule has no cliff period",
        impact: "Medium",
        color: "#f97316", // Orange
        recommendation: "Consider adding a cliff period (typically 1 year) to ensure founders demonstrate commitment."
      });
    } else {
      risks.push({
        category: "Vesting",
        issue: "Standard vesting schedule with cliff included",
        impact: "None",
        color: "#22c55e", // Green
        recommendation: "No action needed."
      });
    }
    
    // 5. IP assignment
    if (!formData.ipAssignment) {
      risks.push({
        category: "Intellectual Property",
        issue: "IP is not assigned to the founder group",
        impact: "High",
        color: "#ef4444", // Red
        recommendation: "Consider assigning all project-related IP to the founder group to prevent future disputes."
      });
    } else {
      risks.push({
        category: "Intellectual Property",
        issue: "IP is appropriately assigned to the founder group",
        impact: "None",
        color: "#22c55e", // Green
        recommendation: "No action needed."
      });
    }
    
    // 6. Check if prior IP is flagged but not described
    if (formData.priorIP && !formData.priorIPDescription) {
      risks.push({
        category: "Prior IP",
        issue: "Prior IP is indicated but not described",
        impact: "Medium",
        color: "#f97316", // Orange
        recommendation: "Add detailed descriptions of any prior IP to clearly separate it from project IP."
      });
    }
    
    // 7. Decision making structure
    if (formData.decisionMakingStructure === "specific" && !formData.specificDecisionMaking) {
      risks.push({
        category: "Decision Making",
        issue: "Custom decision making structure selected but not defined",
        impact: "Medium",
        color: "#f97316", // Orange
        recommendation: "Define your custom decision making structure in detail."
      });
    }
    
    // 8. Non-compete enforceability (California specific)
    if (formData.nonCompete && formData.governingLaw === "California") {
      risks.push({
        category: "Non-Compete",
        issue: "Non-compete provision with California governing law",
        impact: "Medium",
        color: "#f97316", // Orange
        recommendation: "Non-compete provisions are generally unenforceable in California. Consider removing or modifying."
      });
    }
    
    // 9. Agreement term
    if (formData.agreementTerm === "specific" && parseInt(formData.specificTerm) < parseInt(formData.incorporationTimeline || 6)) {
      risks.push({
        category: "Agreement Term",
        issue: "Agreement term is shorter than incorporation timeline",
        impact: "Medium",
        color: "#f97316", // Orange
        recommendation: "Extend agreement term to cover the full incorporation timeline."
      });
    }
    
    // 10. General legal advice
    risks.push({
      category: "Legal Review",
      issue: "Generator provides a starting point but not legal advice",
      impact: "Medium",
      color: "#eab308", // Yellow
      recommendation: "Have an attorney review the final agreement before signing."
    });
    
    return risks;
  };

  // Render the form based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // General Information
        return (
          <div className="tab-content">
            <h2>General Information</h2>
            
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g., TechStartup, AppName, Business Venture"
              />
              <span className="helper-text">Enter the name of your project or venture</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="effectiveDate">Effective Date</label>
              <input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
              />
              <span className="helper-text">The date when this agreement becomes effective</span>
            </div>
            
            <div className="alert alert-info">
              <strong>Note:</strong> This agreement is designed for co-founders who haven't yet formed a legal business entity. It establishes the groundwork for your collaboration before formal incorporation.
            </div>
          </div>
        );
        
      case 1: // Founders
        return (
          <div className="tab-content">
            <h2>Founders Information</h2>
            
            <div className="form-group">
              <h3>Founder 1</h3>
              <div className="columns-container">
                <div className="form-group">
                  <label htmlFor="founder1Name">Full Name</label>
                  <input
                    type="text"
                    id="founder1Name"
                    name="founder1Name"
                    value={formData.founder1Name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="founder1Email">Email</label>
                  <input
                    type="email"
                    id="founder1Email"
                    name="founder1Email"
                    value={formData.founder1Email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="founder1Address">Address</label>
                <input
                  type="text"
                  id="founder1Address"
                  name="founder1Address"
                  value={formData.founder1Address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
              
              <div className="columns-container">
                <div className="form-group">
                  <label htmlFor="founder1Title">Title</label>
                  <input
                    type="text"
                    id="founder1Title"
                    name="founder1Title"
                    value={formData.founder1Title}
                    onChange={handleChange}
                    placeholder="Co-Founder, CEO, CTO, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="founder1EquityPercentage">Equity Percentage</label>
                  <input
                    type="number"
                    id="founder1EquityPercentage"
                    name="founder1EquityPercentage"
                    min="0"
                    max="100"
                    value={formData.founder1EquityPercentage}
                    onChange={handleChange}
                  />
                  <span className="helper-text">% of ownership (0-100)</span>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <h3>Founder 2</h3>
              <div className="columns-container">
                <div className="form-group">
                  <label htmlFor="founder2Name">Full Name</label>
                  <input
                    type="text"
                    id="founder2Name"
                    name="founder2Name"
                    value={formData.founder2Name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="founder2Email">Email</label>
                  <input
                    type="email"
                    id="founder2Email"
                    name="founder2Email"
                    value={formData.founder2Email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="founder2Address">Address</label>
                <input
                  type="text"
                  id="founder2Address"
                  name="founder2Address"
                  value={formData.founder2Address}
                  onChange={handleChange}
                  placeholder="456 Oak St, City, State, ZIP"
                />
              </div>
              
              <div className="columns-container">
                <div className="form-group">
                  <label htmlFor="founder2Title">Title</label>
                  <input
                    type="text"
                    id="founder2Title"
                    name="founder2Title"
                    value={formData.founder2Title}
                    onChange={handleChange}
                    placeholder="Co-Founder, CEO, CTO, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="founder2EquityPercentage">Equity Percentage</label>
                  <input
                    type="number"
                    id="founder2EquityPercentage"
                    name="founder2EquityPercentage"
                    min="0"
                    max="100"
                    value={formData.founder2EquityPercentage}
                    onChange={handleChange}
                  />
                  <span className="helper-text">% of ownership (0-100)</span>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="additionalFounders"
                  name="additionalFounders"
                  checked={formData.additionalFounders}
                  onChange={handleChange}
                />
                <label htmlFor="additionalFounders">Add Additional Founders</label>
              </div>
            </div>
            
            {formData.additionalFounders && (
              <>
                <div className="form-group">
                  <h3>Founder 3</h3>
                  <div className="columns-container">
                    <div className="form-group">
                      <label htmlFor="founder3Name">Full Name</label>
                      <input
                        type="text"
                        id="founder3Name"
                        name="founder3Name"
                        value={formData.founder3Name}
                        onChange={handleChange}
                        placeholder="Alex Johnson"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="founder3Email">Email</label>
                      <input
                        type="email"
                        id="founder3Email"
                        name="founder3Email"
                        value={formData.founder3Email}
                        onChange={handleChange}
                        placeholder="alex@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="founder3Address">Address</label>
                    <input
                      type="text"
                      id="founder3Address"
                      name="founder3Address"
                      value={formData.founder3Address}
                      onChange={handleChange}
                      placeholder="789 Pine St, City, State, ZIP"
                    />
                  </div>
                  
                  <div className="columns-container">
                    <div className="form-group">
                      <label htmlFor="founder3Title">Title</label>
                      <input
                        type="text"
                        id="founder3Title"
                        name="founder3Title"
                        value={formData.founder3Title}
                        onChange={handleChange}
                        placeholder="Co-Founder, CEO, CTO, etc."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="founder3EquityPercentage">Equity Percentage</label>
                      <input
                        type="number"
                        id="founder3EquityPercentage"
                        name="founder3EquityPercentage"
                        min="0"
                        max="100"
                        value={formData.founder3EquityPercentage}
                        onChange={handleChange}
                      />
                      <span className="helper-text">% of ownership (0-100)</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <h3>Founder 4</h3>
                  <div className="columns-container">
                    <div className="form-group">
                      <label htmlFor="founder4Name">Full Name</label>
                      <input
                        type="text"
                        id="founder4Name"
                        name="founder4Name"
                        value={formData.founder4Name}
                        onChange={handleChange}
                        placeholder="Taylor Chen"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="founder4Email">Email</label>
                      <input
                        type="email"
                        id="founder4Email"
                        name="founder4Email"
                        value={formData.founder4Email}
                        onChange={handleChange}
                        placeholder="taylor@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="founder4Address">Address</label>
                    <input
                      type="text"
                      id="founder4Address"
                      name="founder4Address"
                      value={formData.founder4Address}
                      onChange={handleChange}
                      placeholder="101 Cedar St, City, State, ZIP"
                    />
                  </div>
                  
                  <div className="columns-container">
                    <div className="form-group">
                      <label htmlFor="founder4Title">Title</label>
                      <input
                        type="text"
                        id="founder4Title"
                        name="founder4Title"
                        value={formData.founder4Title}
                        onChange={handleChange}
                        placeholder="Co-Founder, CEO, CTO, etc."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="founder4EquityPercentage">Equity Percentage</label>
                      <input
                        type="number"
                        id="founder4EquityPercentage"
                        name="founder4EquityPercentage"
                        min="0"
                        max="100"
                        value={formData.founder4EquityPercentage}
                        onChange={handleChange}
                      />
                      <span className="helper-text">% of ownership (0-100)</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="alert alert-info">
              <strong>Tip:</strong> Make sure the equity percentages add up to 100%. This initial split will guide your formal equity allocation when you incorporate.
            </div>
          </div>
        );
        
      case 2: // Roles & Responsibilities
        return (
          <div className="tab-content">
            <h2>Roles & Responsibilities</h2>
            
            <div className="form-group">
              <label htmlFor="founder1Responsibilities">
                {formData.founder1Name || "Founder 1"}'s Responsibilities
              </label>
              <textarea
                id="founder1Responsibilities"
                name="founder1Responsibilities"
                value={formData.founder1Responsibilities}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., Product development, technical architecture, engineering team management"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="founder2Responsibilities">
                {formData.founder2Name || "Founder 2"}'s Responsibilities
              </label>
              <textarea
                id="founder2Responsibilities"
                name="founder2Responsibilities"
                value={formData.founder2Responsibilities}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., Business development, marketing strategy, fundraising"
              ></textarea>
            </div>
            
            {formData.additionalFounders && formData.founder3Name && (
              <div className="form-group">
                <label htmlFor="founder3Responsibilities">
                  {formData.founder3Name}'s Responsibilities
                </label>
                <textarea
                  id="founder3Responsibilities"
                  name="founder3Responsibilities"
                  value={formData.founder3Responsibilities}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Financial operations, legal compliance, HR"
                ></textarea>
              </div>
            )}
            
            {formData.additionalFounders && formData.founder4Name && (
              <div className="form-group">
                <label htmlFor="founder4Responsibilities">
                  {formData.founder4Name}'s Responsibilities
                </label>
                <textarea
                  id="founder4Responsibilities"
                  name="founder4Responsibilities"
                  value={formData.founder4Responsibilities}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Design, user experience, brand development"
                ></textarea>
              </div>
            )}
            
            <div className="alert alert-info">
              <strong>Tip:</strong> Clearly defined roles help prevent conflicts and ensure all critical business functions are covered. Be specific about each founder's areas of responsibility and authority.
            </div>
          </div>
        );
        
      case 3: // Decision Making
        return (
          <div className="tab-content">
            <h2>Decision Making</h2>
            
            <div className="form-group">
              <label>Decision Making Structure</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="majorityDecisions"
                    name="decisionMakingStructure"
                    value="majority"
                    checked={formData.decisionMakingStructure === "majority"}
                    onChange={handleChange}
                  />
                  <label htmlFor="majorityDecisions">Majority Vote</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="unanimousDecisions"
                    name="decisionMakingStructure"
                    value="unanimous"
                    checked={formData.decisionMakingStructure === "unanimous"}
                    onChange={handleChange}
                  />
                  <label htmlFor="unanimousDecisions">Unanimous Agreement</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="specificDecisions"
                    name="decisionMakingStructure"
                    value="specific"
                    checked={formData.decisionMakingStructure === "specific"}
                    onChange={handleChange}
                  />
                  <label htmlFor="specificDecisions">Specific Custom Structure</label>
                </div>
              </div>
            </div>
            
            {formData.decisionMakingStructure === "specific" && (
              <div className="form-group">
                <label htmlFor="specificDecisionMaking">Custom Decision Making Structure</label>
                <textarea
                  id="specificDecisionMaking"
                  name="specificDecisionMaking"
                  value={formData.specificDecisionMaking}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your custom decision making process in detail, including which decisions require what level of approval"
                ></textarea>
              </div>
            )}
            
            <div className="alert alert-info">
              <strong>Guidance:</strong> Your decision-making structure should balance efficiency with fairness. Consider different weights for different types of decisions (e.g., day-to-day operations vs. strategic direction).
            </div>
          </div>
        );
        
      case 4: // Intellectual Property
        return (
          <div className="tab-content">
            <h2>Intellectual Property</h2>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="ipAssignment"
                  name="ipAssignment"
                  checked={formData.ipAssignment}
                  onChange={handleChange}
                />
                <label htmlFor="ipAssignment">Assign all project-related IP to the founder group</label>
              </div>
              <span className="helper-text">
                If checked, all intellectual property created for the project will be jointly owned by all founders according to their equity percentages
              </span>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="priorIP"
                  name="priorIP"
                  checked={formData.priorIP}
                  onChange={handleChange}
                />
                <label htmlFor="priorIP">Include provisions for prior intellectual property</label>
              </div>
              <span className="helper-text">
                Check if any founder is bringing existing intellectual property to the project
              </span>
            </div>
            
            {formData.priorIP && (
              <div className="form-group">
                <label htmlFor="priorIPDescription">Description of Prior Intellectual Property</label>
                <textarea
                  id="priorIPDescription"
                  name="priorIPDescription"
                  value={formData.priorIPDescription}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe in detail any existing intellectual property that a founder is bringing to the project but wishes to retain ownership of"
                ></textarea>
              </div>
            )}
            
            <div className="alert alert-warning">
              <strong>Important:</strong> Intellectual property (IP) is often the most valuable asset of a startup. Clearly defining IP ownership early helps prevent disputes later. Consider consulting an IP attorney for complex situations.
            </div>
          </div>
        );
        
      case 5: // Vesting & Equity
        return (
          <div className="tab-content">
            <h2>Vesting & Equity</h2>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="vestingSchedule"
                  name="vestingSchedule"
                  checked={formData.vestingSchedule}
                  onChange={handleChange}
                />
                <label htmlFor="vestingSchedule">Include equity vesting schedule</label>
              </div>
              <span className="helper-text">
                Vesting gradually grants ownership rights over time, protecting all founders if someone leaves early
              </span>
            </div>
            
            {formData.vestingSchedule && (
              <>
                <div className="columns-container">
                  <div className="form-group">
                    <label htmlFor="vestingPeriod">Vesting Period (Years)</label>
                    <select
                      id="vestingPeriod"
                      name="vestingPeriod"
                      value={formData.vestingPeriod}
                      onChange={handleChange}
                    >
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years (Standard)</option>
                      <option value="5">5 Years</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="vestingCliff">Cliff Period (Years)</label>
                    <select
                      id="vestingCliff"
                      name="vestingCliff"
                      value={formData.vestingCliff}
                      onChange={handleChange}
                    >
                      <option value="0">No Cliff</option>
                      <option value="0.5">6 Months</option>
                      <option value="1">1 Year (Standard)</option>
                      <option value="1.5">18 Months</option>
                      <option value="2">2 Years</option>
                    </select>
                    <span className="helper-text">
                      No equity vests until after this initial period
                    </span>
                  </div>
                </div>
                
                <div className="alert alert-info">
                  <strong>Standard Terms:</strong> A 4-year vesting period with a 1-year cliff is industry standard. This means no equity vests for the first year, then 25% vests at the 1-year mark, with the remaining 75% vesting monthly over the next 3 years.
                </div>
              </>
            )}
            
            {!formData.vestingSchedule && (
              <div className="alert alert-warning">
                <strong>Warning:</strong> Without vesting, a founder who leaves early could retain their full equity stake while contributing less than others. Consider including vesting to protect all founders.
              </div>
            )}
          </div>
        );
        
      case 6: // Exit Strategy
        return (
          <div className="tab-content">
            <h2>Exit Strategy</h2>
            
            <div className="form-group">
              <label>Primary Exit Strategy</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="incorporationStrategy"
                    name="exitStrategy"
                    value="incorporation"
                    checked={formData.exitStrategy === "incorporation"}
                    onChange={handleChange}
                  />
                  <label htmlFor="incorporationStrategy">Formal Incorporation</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="acquisitionStrategy"
                    name="exitStrategy"
                    value="acquisition"
                    checked={formData.exitStrategy === "acquisition"}
                    onChange={handleChange}
                  />
                  <label htmlFor="acquisitionStrategy">Acquisition/Sale</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="dissolutionStrategy"
                    name="exitStrategy"
                    value="dissolution"
                    checked={formData.exitStrategy === "dissolution"}
                    onChange={handleChange}
                  />
                  <label htmlFor="dissolutionStrategy">Potential Dissolution</label>
                </div>
              </div>
            </div>
            
            {formData.exitStrategy === "incorporation" && (
              <>
                <div className="form-group">
                  <label htmlFor="incorporationTimeline">Expected Timeline to Incorporation (Months)</label>
                  <input
                    type="number"
                    id="incorporationTimeline"
                    name="incorporationTimeline"
                    min="1"
                    max="24"
                    value={formData.incorporationTimeline}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="incorporationType">Anticipated Entity Type</label>
                  <select
                    id="incorporationType"
                    name="incorporationType"
                    value={formData.incorporationType}
                    onChange={handleChange}
                  >
                    <option value="delaware-c-corp">Delaware C Corporation</option>
                    <option value="llc">Limited Liability Company (LLC)</option>
                    <option value="s-corp">S Corporation</option>
                    <option value="b-corp">Benefit Corporation</option>
                    <option value="other">Other/To Be Determined</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="alert alert-info">
              <strong>Note:</strong> Most technology startups ultimately form a Delaware C Corporation, especially if venture capital funding is a goal. This agreement serves as a bridge until formal incorporation.
            </div>
          </div>
        );
        
      case 7: // Dispute Resolution
        return (
          <div className="tab-content">
            <h2>Dispute Resolution</h2>
            
            <div className="form-group">
              <label>Dispute Resolution Method</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="mediationDispute"
                    name="disputeResolution"
                    value="mediation"
                    checked={formData.disputeResolution === "mediation"}
                    onChange={handleChange}
                  />
                  <label htmlFor="mediationDispute">Mediation First, Then Other Methods</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="arbitrationDispute"
                    name="disputeResolution"
                    value="arbitration"
                    checked={formData.disputeResolution === "arbitration"}
                    onChange={handleChange}
                  />
                  <label htmlFor="arbitrationDispute">Binding Arbitration</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="courtsDispute"
                    name="disputeResolution"
                    value="courts"
                    checked={formData.disputeResolution === "courts"}
                    onChange={handleChange}
                  />
                  <label htmlFor="courtsDispute">Court Litigation</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law (State)</label>
              <input
                type="text"
                id="governingLaw"
                name="governingLaw"
                value={formData.governingLaw}
                onChange={handleChange}
                placeholder="e.g., California, Delaware, New York"
              />
            </div>
            
            <div className="alert alert-info">
              <strong>Recommendation:</strong> Mediation is often the most cost-effective first step in resolving disputes. It allows founders to work with a neutral third party to reach a mutually acceptable resolution without the expense of arbitration or litigation.
            </div>
          </div>
        );
        
      case 8: // Term & Termination
        return (
          <div className="tab-content">
            <h2>Term & Termination</h2>
            
            <div className="form-group">
              <label>Agreement Term</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="indefiniteTerm"
                    name="agreementTerm"
                    value="indefinite"
                    checked={formData.agreementTerm === "indefinite"}
                    onChange={handleChange}
                  />
                  <label htmlFor="indefiniteTerm">Indefinite (Until Incorporation or Dissolution)</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="specificTerm"
                    name="agreementTerm"
                    value="specific"
                    checked={formData.agreementTerm === "specific"}
                    onChange={handleChange}
                  />
                  <label htmlFor="specificTerm">Specific Time Period</label>
                </div>
              </div>
            </div>
            
            {formData.agreementTerm === "specific" && (
              <div className="form-group">
                <label htmlFor="specificTerm">Term Length (Months)</label>
                <input
                  type="number"
                  id="specificTerm"
                  name="specificTerm"
                  min="1"
                  max="60"
                  value={formData.specificTerm}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="terminationNotice">Voluntary Withdrawal Notice Period (Days)</label>
              <input
                type="number"
                id="terminationNotice"
                name="terminationNotice"
                min="1"
                max="90"
                value={formData.terminationNotice}
                onChange={handleChange}
              />
              <span className="helper-text">
                Number of days' notice a founder must provide before voluntarily leaving
              </span>
            </div>
            
            <div className="alert alert-info">
              <strong>Important:</strong> The agreement should include provisions for what happens if a founder leaves voluntarily or is terminated for cause. This section works in conjunction with the vesting provisions to protect the remaining founders.
            </div>
          </div>
        );
        
      case 9: // Miscellaneous
        return (
          <div className="tab-content">
            <h2>Miscellaneous Provisions</h2>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="expenseSharing"
                  name="expenseSharing"
                  checked={formData.expenseSharing}
                  onChange={handleChange}
                />
                <label htmlFor="expenseSharing">Include expense sharing provisions</label>
              </div>
            </div>
            
            {formData.expenseSharing && (
              <div className="form-group">
                <label htmlFor="expenseSharingDetails">Expense Sharing Details</label>
                <textarea
                  id="expenseSharingDetails"
                  name="expenseSharingDetails"
                  value={formData.expenseSharingDetails}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe how expenses will be shared, approval processes, and reimbursement procedures"
                ></textarea>
              </div>
            )}
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="nonCompete"
                  name="nonCompete"
                  checked={formData.nonCompete}
                  onChange={handleChange}
                />
                <label htmlFor="nonCompete">Include non-compete provisions</label>
              </div>
              
              {formData.nonCompete && (
                <div className="form-group">
                  <label htmlFor="nonCompeteTermMonths">Non-Compete Term (Months)</label>
                  <input
                    type="number"
                    id="nonCompeteTermMonths"
                    name="nonCompeteTermMonths"
                    min="0"
                    max="24"
                    value={formData.nonCompeteTermMonths}
                    onChange={handleChange}
                  />
                  <span className="helper-text">
                    Time period after leaving the project during which founders cannot compete
                  </span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="nonSolicitation"
                  name="nonSolicitation"
                  checked={formData.nonSolicitation}
                  onChange={handleChange}
                />
                <label htmlFor="nonSolicitation">Include non-solicitation provisions</label>
              </div>
              
              {formData.nonSolicitation && (
                <div className="form-group">
                  <label htmlFor="nonSolicitationTermMonths">Non-Solicitation Term (Months)</label>
                  <input
                    type="number"
                    id="nonSolicitationTermMonths"
                    name="nonSolicitationTermMonths"
                    min="0"
                    max="24"
                    value={formData.nonSolicitationTermMonths}
                    onChange={handleChange}
                  />
                  <span className="helper-text">
                    Time period after leaving the project during which founders cannot solicit employees, contractors, or customers
                  </span>
                </div>
              )}
            </div>
            
            <div className="alert alert-warning">
              <strong>Legal Note:</strong> Non-compete provisions may not be enforceable in some jurisdictions (e.g., California). Consider consulting with an attorney to ensure these provisions are appropriate and enforceable in your location.
            </div>
          </div>
        );
        
      case 10: // Risk Evaluation
        const risks = evaluateRisks();
        return (
          <div className="tab-content">
            <h2>Risk Evaluation</h2>
            
            <div className="alert alert-info">
              <strong>About This Evaluation:</strong> This automated assessment identifies potential risks or issues in your agreement. Each item is color-coded by potential impact level.
            </div>
            
            <div className="risk-evaluation">
              {risks.map((risk, index) => (
                <div 
                  key={index} 
                  className="risk-item" 
                  style={{
                    borderLeft: `4px solid ${risk.color}`,
                    backgroundColor: `${risk.color}10`,
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "0.25rem"
                  }}
                >
                  <h3 style={{ 
                    color: risk.color, 
                    marginBottom: "0.5rem", 
                    display: "flex", 
                    alignItems: "center",
                    fontSize: "1rem",
                    fontWeight: "600"
                  }}>
                    {risk.impact !== "None" ? (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={risk.color} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        style={{ marginRight: "0.5rem" }}
                      >
                        {risk.impact === "High" ? (
                          <><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></>
                        ) : (
                          <><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line><path d="M12 8v4"></path></>
                        )}
                      </svg>
                    ) : (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={risk.color} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        style={{ marginRight: "0.5rem" }}
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    )}
                    {risk.category}: {risk.impact} Risk
                  </h3>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Issue:</strong> {risk.issue}</p>
                  <p><strong>Recommendation:</strong> {risk.recommendation}</p>
                </div>
              ))}
            </div>
            
            <div className="alert alert-warning">
              <strong>Disclaimer:</strong> This evaluation is automated and does not constitute legal advice. It's strongly recommended that you have the final agreement reviewed by a qualified attorney before signing.
            </div>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "#f0fdf4",
              borderRadius: "0.5rem",
              border: "1px solid #dcfce7"
            }}>
              <div style={{ marginRight: "1rem" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>Need Professional Help?</h3>
                <p style={{ margin: 0 }}>
                  <a 
                    href="https://terms.law/call/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: "#22c55e",
                      textDecoration: "none",
                      fontWeight: "500"
                    }}
                  >
                    Schedule a consultation
                  </a> with an experienced attorney to review your agreement and address any concerns.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container">
      <div className="generator-header">
        <h1>Founder Collaboration Agreement Generator</h1>
        <p>Create a customized agreement to establish the relationship between co-founders before formal incorporation.</p>
      </div>
      
      <div className="generator-layout">
        <div className="form-panel">
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
          
          {/* Render current tab content */}
          {renderTabContent()}
          
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <i data-feather="chevron-left" className="feather"></i>
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
              <i data-feather="copy" className="feather"></i>
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
              <i data-feather="file-text" className="feather"></i>
              Download MS Word
            </button>
            
            <button
              onClick={nextTab}
              className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
              disabled={currentTab === tabs.length - 1}
            >
              Next
              <i data-feather="chevron-right" className="feather"></i>
            </button>
          </div>
        </div>
        
        <div className="preview-panel" ref={previewRef}>
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: createHighlightedHtml() }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the App
ReactDOM.render(<App />, document.getElementById('root'));