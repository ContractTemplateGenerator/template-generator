// Icon component
const Icon = ({ name, style }) => {
  return <i data-feather={name} style={style} />;
};

// Info tooltip component
const InfoTooltip = ({ text }) => {
  return (
    <span className="info-tooltip">
      <Icon name="info" style={{ width: '14px', height: '14px' }} />
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

// Main Generator Component
const IPAssignmentGenerator = () => {
  // State for managing tabs
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State for managing form data
  const [formData, setFormData] = React.useState({
    // Party Information
    assignorType: "individual", // individual, company, or university
    assignorName: "",
    assignorEntityType: "corporation", // For companies: corporation, llc, etc.
    assignorState: "",
    assignorAddress: "",
    assignorCity: "",
    assignorZip: "",
    
    assigneeName: "",
    assigneeEntityType: "corporation",
    assigneeState: "",
    assigneeAddress: "",
    assigneeCity: "",
    assigneeZip: "",
    
    // Agreement Details
    effectiveDate: "",
    isPaidAssignment: true,
    assignmentAmount: "",
    currency: "USD",
    isEmploymentContext: true,
    position: "",
    relationship: "employee", // employee, contractor, consultant
    
    // Invention/IP Details
    hasSpecificInventions: false,
    inventionDescriptions: "",
    patentApplications: "",
    hasPatentApplications: false,
    includeAllInventions: true,
    
    // IP Scope
    includePatents: true,
    includePatentApplications: true,
    includeCopyrights: true,
    includeTrademarks: false,
    includeTradeSecrets: true,
    includeMaskWorks: false,
    includeIndustrialDesigns: false,
    includeKnowHow: true,
    
    // Special Provisions
    includeDisclosureObligation: true,
    includeInventionRecords: true,
    includeShopRights: false,
    includePostAssignmentObligations: true,
    stateSpecificProvisions: "california",
    includeInventionExclusions: false,
    inventionExclusions: "",
    includeRoyalties: false,
    royaltyPercentage: "2",
    includeMonetaryIncentives: false,
    incentiveAmount: "",
    
    // Signature Information
    assignorSignatory: "",
    assignorSignatoryTitle: "",
    assigneeSignatory: "",
    assigneeSignatoryTitle: "",
    dateSigned: "",
    
    // Witnesses/Notary
    requireWitnesses: false,
    requireNotary: true
  });
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);
  
  // Tab configuration
  const tabs = [
    { id: 'parties', label: 'Parties' },
    { id: 'agreement', label: 'Agreement Details' },
    { id: 'inventions', label: 'Invention Details' },
    { id: 'ipscope', label: 'IP Scope' },
    { id: 'provisions', label: 'Special Provisions' },
    { id: 'signature', label: 'Execution' },
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
      navigator.clipboard.writeText(documentText).then(
        () => {
          alert("Document copied to clipboard successfully!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
          alert("Failed to copy text. Please try again.");
        }
      );
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy text. Please try again.");
    }
  };

  // Download as Word document
  const downloadAsWord = () => {
    try {
      window.generateWordDoc(documentText, {
        documentTitle: "Intellectual Property Assignment Agreement",
        fileName: `${formData.assigneeName.replace(/\s+/g, '-')}-IP-Assignment`
      });
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Schedule consultation
  const scheduleConsultation = () => {
    if (typeof Calendly !== 'undefined') {
      Calendly.initPopupWidget({
        url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
      });
    } else {
      // Fallback if Calendly isn't loaded yet
      window.open('https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1', '_blank');
    }
    return false;
  };

  // Generate document text
  const generateDocument = () => {
    const {
      assignorType,
      assignorName,
      assignorEntityType,
      assignorState,
      assignorAddress,
      assignorCity,
      assignorZip,
      assigneeName,
      assigneeEntityType,
      assigneeState,
      assigneeAddress,
      assigneeCity,
      assigneeZip,
      effectiveDate,
      isPaidAssignment,
      assignmentAmount,
      currency,
      isEmploymentContext,
      position,
      relationship,
      hasSpecificInventions,
      inventionDescriptions,
      patentApplications,
      hasPatentApplications,
      includeAllInventions,
      includePatents,
      includePatentApplications,
      includeCopyrights,
      includeTrademarks,
      includeTradeSecrets,
      includeMaskWorks,
      includeIndustrialDesigns,
      includeKnowHow,
      includeDisclosureObligation,
      includeInventionRecords,
      includeShopRights,
      includePostAssignmentObligations,
      stateSpecificProvisions,
      includeInventionExclusions,
      inventionExclusions,
      includeRoyalties,
      royaltyPercentage,
      includeMonetaryIncentives,
      incentiveAmount,
      assignorSignatory,
      assignorSignatoryTitle,
      assigneeSignatory,
      assigneeSignatoryTitle,
      dateSigned,
      requireWitnesses,
      requireNotary
    } = formData;

    // Create IP types list
    let ipTypes = [];
    if (includePatents) ipTypes.push("patents");
    if (includePatentApplications) ipTypes.push("patent applications");
    if (includeCopyrights) ipTypes.push("copyrights");
    if (includeTrademarks) ipTypes.push("trademarks");
    if (includeTradeSecrets) ipTypes.push("trade secrets");
    if (includeMaskWorks) ipTypes.push("mask works");
    if (includeIndustrialDesigns) ipTypes.push("industrial designs");
    if (includeKnowHow) ipTypes.push("know-how");
    
    const ipTypesList = ipTypes.length > 0 
      ? ipTypes.join(", ").replace(/,([^,]*)$/, ' and$1')
      : "intellectual property";

    // State-specific provisions
    let stateProvision = "";
    if (stateSpecificProvisions === "california") {
      stateProvision = "In accordance with Section 2870 of the California Labor Code, this Agreement does not apply to an invention that the Assignor developed entirely on their own time without using the Assignee's equipment, supplies, facilities, or trade secret information, except for inventions that either: (i) relate to the Assignee's business or actual or demonstrably anticipated research or development, or (ii) result from any work performed by the Assignor for the Assignee.";
    } else if (stateSpecificProvisions === "delaware") {
      stateProvision = "In accordance with Delaware law, this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Assignee was used and which was developed entirely on the Assignor's own time, unless (a) the invention relates to the business of the Assignee or to the Assignee's actual or demonstrably anticipated research or development, or (b) the invention results from any work performed by the Assignor for the Assignee.";
    } else if (stateSpecificProvisions === "illinois") {
      stateProvision = "In accordance with the Illinois Employee Patent Act (765 ILCS 1060/1 et seq.), this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Assignee was used and which was developed entirely on the Assignor's own time, unless (a) the invention relates to the business of the Assignee or to the Assignee's actual or demonstrably anticipated research or development, or (b) the invention results from any work performed by the Assignor for the Assignee.";
    } else if (stateSpecificProvisions === "minnesota") {
      stateProvision = "In accordance with Minnesota Statutes Section 181.78, this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Assignee was used and which was developed entirely on the Assignor's own time, and (1) which does not relate (a) directly to the business of the Assignee or (b) to the Assignee's actual or demonstrably anticipated research or development, or (2) which does not result from any work performed by the Assignor for the Assignee.";
    } else if (stateSpecificProvisions === "washington") {
      stateProvision = "In accordance with Title 49 RCW, Chapter 49.44, Section 49.44.140 of the Revised Code of Washington, this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Assignee was used and which was developed entirely on the Assignor's own time, unless (a) the invention relates (i) directly to the business of the Assignee, or (ii) to the Assignee's actual or demonstrably anticipated research or development, or (b) the invention results from any work performed by the Assignor for the Assignee.";
    } else if (stateSpecificProvisions === "north_carolina") {
      stateProvision = "In accordance with North Carolina General Statutes §§ 66-57.1 and 66-57.2, this Agreement does not apply to an invention that the Assignor developed entirely on their own time without using the Assignee's equipment, supplies, facilities or trade secret information except for those inventions that (i) relate to the Assignee's business or actual or demonstrably anticipated research or development, or (ii) result from any work performed by the Assignor for the Assignee.";
    } else if (stateSpecificProvisions === "utah") {
      stateProvision = "In accordance with Utah Code Ann. § 34-39-1 through 34-39-3, this Agreement does not apply to an invention that the Assignor developed entirely on their own time without using the Assignee's equipment, supplies, facilities, or trade secret information, unless the invention: (i) relates to the Assignee's business or actual or demonstrably anticipated research or development, or (ii) results from any work performed by the Assignor for the Assignee.";
    }

    // Determine assignor entity description based on type
    let assignorEntityDescription = "";
    if (assignorType === "individual") {
      assignorEntityDescription = `an individual residing at ${assignorAddress || "[ADDRESS]"}, ${assignorCity || "[CITY]"}, ${assignorState || "[STATE]"} ${assignorZip || "[ZIP]"}`;
    } else if (assignorType === "company") {
      assignorEntityDescription = `a ${assignorEntityType || "[ENTITY TYPE]"} organized under the laws of ${assignorState || "[STATE]"} with its principal place of business at ${assignorAddress || "[ADDRESS]"}, ${assignorCity || "[CITY]"}, ${assignorState || "[STATE]"} ${assignorZip || "[ZIP]"}`;
    } else if (assignorType === "university") {
      assignorEntityDescription = `a ${assignorEntityType || "educational institution"} located at ${assignorAddress || "[ADDRESS]"}, ${assignorCity || "[CITY]"}, ${assignorState || "[STATE]"} ${assignorZip || "[ZIP]"}`;
    }

    // Generate document text
    let documentText = "";
    
    // Title
    documentText += "INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT\n\n";
    
    // Introduction
    documentText += `This Intellectual Property Assignment Agreement (the "Agreement") is made and entered into as of ${effectiveDate || "[EFFECTIVE DATE]"}, by and between:\n\n`;
    
    documentText += `${assignorName || "[ASSIGNOR NAME]"}, ${assignorEntityDescription} (the "Assignor")\n\n`;
    
    documentText += "AND\n\n";
    
    documentText += `${assigneeName || "[ASSIGNEE NAME]"}, a ${assigneeEntityType || "[ENTITY TYPE]"} organized under the laws of ${assigneeState || "[STATE]"} with its principal place of business at ${assigneeAddress || "[ADDRESS]"}, ${assigneeCity || "[CITY]"}, ${assigneeState || "[STATE]"} ${assigneeZip || "[ZIP]"} (the "Assignee")\n\n`;
    
    // Recitals
    documentText += "RECITALS\n\n";
    
    if (isEmploymentContext) {
      documentText += `WHEREAS, the Assignor is ${relationship === "employee" ? "employed by" : "engaged as a " + relationship + " for"} the Assignee in the position of ${position || "[POSITION]"};\n\n`;
      
      documentText += "WHEREAS, in the course of such relationship, the Assignor has created, developed, conceived, or reduced to practice or may create, develop, conceive, or reduce to practice certain inventions, works of authorship, designs, know-how, and other intellectual property;\n\n";
    } else if (hasSpecificInventions) {
      documentText += "WHEREAS, the Assignor has created, developed, conceived, or reduced to practice certain inventions, works of authorship, designs, know-how, and other intellectual property;\n\n";
    }
    
    documentText += "WHEREAS, the Assignor desires to assign all rights, title and interest in such intellectual property to the Assignee;\n\n";
    
    if (isPaidAssignment) {
      documentText += `WHEREAS, the Assignee is willing to pay the Assignor ${assignmentAmount || "[AMOUNT]"} ${currency || "USD"} as consideration for such assignment;\n\n`;
    } else {
      documentText += "WHEREAS, the Assignee is willing to accept such assignment;\n\n";
    }
    
    documentText += "NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:\n\n";
    
    // 1. Definitions
    documentText += "1. DEFINITIONS\n\n";
    
    documentText += "1.1 \"Intellectual Property\" means any and all inventions, innovations, improvements, developments, discoveries, designs, formulas, methods, processes, techniques, protocols, computer software, databases, mask works, industrial designs, trade secrets, know-how, works of authorship, and other intellectual or industrial property, whether or not patentable, copyrightable, or protectable as trade secrets.\n\n";
    
    if (hasSpecificInventions) {
      documentText += "1.2 \"Assigned Intellectual Property\" means the following Intellectual Property:\n\n";
      documentText += inventionDescriptions || "[DESCRIPTION OF INTELLECTUAL PROPERTY BEING ASSIGNED]";
      documentText += "\n\n";
      
      if (hasPatentApplications) {
        documentText += "1.3 \"Patent Applications\" means the following patent applications:\n\n";
        documentText += patentApplications || "[DESCRIPTION OF PATENT APPLICATIONS]";
        documentText += "\n\n";
      }
    } else if (isEmploymentContext) {
      documentText += "1.2 \"Assigned Intellectual Property\" means any and all Intellectual Property that: (a) relates to the actual or anticipated business, research, or development of the Assignee; (b) results from or is suggested by any work performed by the Assignor for the Assignee; or (c) is created, conceived, reduced to practice, or developed by the Assignor during the Assignor's regular or overtime working hours with the Assignee or at any time during the Assignor's relationship with the Assignee using the Assignee's facilities, equipment, supplies, or confidential information.\n\n";
    } else {
      documentText += "1.2 \"Assigned Intellectual Property\" means all Intellectual Property of the Assignor that is being transferred under this Agreement.\n\n";
    }
    
    // 2. Assignment
    documentText += "2. ASSIGNMENT\n\n";
    
    if (hasSpecificInventions) {
      documentText += "2.1 Assignment of Specific Intellectual Property. The Assignor hereby irrevocably assigns, transfers, and conveys to the Assignee all of the Assignor's right, title, and interest in and to the Assigned Intellectual Property";
      
      if (hasPatentApplications) {
        documentText += " and Patent Applications";
      }
      
      documentText += ", including all " + ipTypesList + ", in the United States and throughout the world, and all applications or registrations for the same.\n\n";
    } else if (includeAllInventions) {
      documentText += "2.1 Assignment of All Intellectual Property. The Assignor hereby irrevocably assigns, transfers, and conveys to the Assignee all of the Assignor's right, title, and interest in and to all Assigned Intellectual Property, including all " + ipTypesList + ", in the United States and throughout the world, and all applications or registrations for the same.\n\n";
    } else {
      documentText += "2.1 Assignment of Intellectual Property. The Assignor hereby irrevocably assigns, transfers, and conveys to the Assignee all of the Assignor's right, title, and interest in and to all Assigned Intellectual Property, including all " + ipTypesList + ", in the United States and throughout the world, and all applications or registrations for the same, that is created, conceived, reduced to practice, or developed during the term of the Assignor's relationship with the Assignee.\n\n";
    }
    
    documentText += "2.2 Assignment of Associated Rights. The Assignor further assigns to the Assignee all rights to:\n\n";
    documentText += "(a) sue for and collect damages for any past, present, or future infringement of the Assigned Intellectual Property;\n";
    documentText += "(b) enforce any and all rights in the Assigned Intellectual Property;\n";
    documentText += "(c) file and prosecute applications for registration or protection of the Assigned Intellectual Property;\n";
    documentText += "(d) file and prosecute any divisionals, continuations, continuations-in-part, reissues, and extensions of any patent applications included in the Assigned Intellectual Property; and\n";
    documentText += "(e) claim priority rights to which any of the Assigned Intellectual Property is entitled under international conventions, treaties, or otherwise.\n\n";
    
    // 3. Consideration
    if (isPaidAssignment) {
      documentText += "3. CONSIDERATION\n\n";
      documentText += `3.1 Payment. In consideration for the assignment of the Assigned Intellectual Property, the Assignee shall pay to the Assignor the sum of ${assignmentAmount || "[AMOUNT]"} ${currency || "USD"} upon execution of this Agreement.\n\n`;
      
      if (includeRoyalties) {
        documentText += `3.2 Royalties. In addition to the payment set forth in Section 3.1, the Assignee shall pay to the Assignor a royalty of ${royaltyPercentage || "2"}% of net sales of any product or service that incorporates, utilizes, or is based on the Assigned Intellectual Property. Royalty payments shall be made quarterly, within 30 days following the end of each calendar quarter, and shall be accompanied by a report showing the calculation of net sales and royalties due.\n\n`;
      }
      
      if (includeMonetaryIncentives) {
        documentText += `3.3 Invention Incentives. The Assignee shall pay to the Assignor an additional incentive payment of ${incentiveAmount || "[AMOUNT]"} ${currency || "USD"} upon the issuance of any patent that results from the Assigned Intellectual Property.\n\n`;
      }
    } else {
      documentText += "3. CONSIDERATION\n\n";
      documentText += "3.1 Acknowledgment. The parties acknowledge that good and valuable consideration has been received for the assignment of the Assigned Intellectual Property, including the mutual promises and covenants contained herein.\n\n";
      
      if (includeRoyalties) {
        documentText += `3.2 Royalties. The Assignee shall pay to the Assignor a royalty of ${royaltyPercentage || "2"}% of net sales of any product or service that incorporates, utilizes, or is based on the Assigned Intellectual Property. Royalty payments shall be made quarterly, within 30 days following the end of each calendar quarter, and shall be accompanied by a report showing the calculation of net sales and royalties due.\n\n`;
      }
      
      if (includeMonetaryIncentives) {
        documentText += `3.3 Invention Incentives. The Assignee shall pay to the Assignor an incentive payment of ${incentiveAmount || "[AMOUNT]"} ${currency || "USD"} upon the issuance of any patent that results from the Assigned Intellectual Property.\n\n`;
      }
    }
    
    // 4. Further Assurances
    documentText += "4. FURTHER ASSURANCES\n\n";
    
    documentText += "4.1 Assistance. The Assignor agrees to assist the Assignee, at the Assignee's expense, in every proper way to secure and enforce the Assignee's rights in the Assigned Intellectual Property, including by executing documents, testifying, and taking any other actions as may be requested by the Assignee.\n\n";
    
    if (includeDisclosureObligation) {
      documentText += "4.2 Disclosure Obligation. The Assignor agrees to promptly disclose to the Assignee all Assigned Intellectual Property, and to maintain adequate and current written records of all research, development, and other activities that may result in Assigned Intellectual Property.\n\n";
    }
    
    if (includeInventionRecords) {
      documentText += "4.3 Invention Records. The Assignor agrees to maintain complete and accurate records of all Assigned Intellectual Property in a format specified by the Assignee. Such records shall be the property of the Assignee and shall be surrendered to the Assignee upon request or upon termination of the Assignor's relationship with the Assignee.\n\n";
    }
    
    documentText += "4.4 Power of Attorney. The Assignor hereby irrevocably designates and appoints the Assignee and its duly authorized officers and agents as the Assignor's agent and attorney-in-fact to act for and on the Assignor's behalf to execute, deliver, and file any such applications and to do all other lawfully permitted acts to further the prosecution and issuance of patents, copyrights, or similar protections with the same legal force and effect as if executed by the Assignor.\n\n";
    
    // 5. Representations and Warranties
    documentText += "5. REPRESENTATIONS AND WARRANTIES\n\n";
    
    documentText += "5.1 Authority. The Assignor represents and warrants that the Assignor has the full right and authority to enter into this Agreement and to make the assignments made herein.\n\n";
    
    documentText += "5.2 No Conflicts. The Assignor represents and warrants that the execution and delivery of this Agreement does not conflict with or violate the rights of any third party.\n\n";
    
    documentText += "5.3 Ownership. The Assignor represents and warrants that the Assignor is the sole and exclusive owner of all right, title, and interest in and to the Assigned Intellectual Property, free and clear of all liens, encumbrances, or other restrictions on transfer.\n\n";
    
    documentText += "5.4 No Infringement. The Assignor represents and warrants that, to the best of the Assignor's knowledge, the Assigned Intellectual Property does not infringe the intellectual property rights of any third party.\n\n";
    
    // 6. Exclusions and Limitations
    documentText += "6. EXCLUSIONS AND LIMITATIONS\n\n";
    
    // Add state-specific provision
    if (stateProvision) {
      documentText += `6.1 State Law Limitations. ${stateProvision}\n\n`;
    }
    
    // Add exclusions if selected
    if (includeInventionExclusions && inventionExclusions) {
      documentText += "6.2 Excluded Intellectual Property. The following Intellectual Property, which the Assignor created before the relationship with the Assignee and without using Assignee resources, is excluded from this Agreement:\n\n";
      documentText += `${inventionExclusions}\n\n`;
    }
    
    if (includeShopRights) {
      documentText += "6.3 Shop Rights. For any invention created by the Assignor outside the scope of this Agreement and without use of Assignee's resources, but which relates to the Assignee's business, the Assignee shall have a non-exclusive, perpetual, irrevocable, royalty-free license to make, use, sell, and import any such invention for Assignee's business purposes. Such license shall be non-transferable except in connection with the sale of all or substantially all of the Assignee's business.\n\n";
    }
    
    // 7. Post-Assignment Obligations
    if (includePostAssignmentObligations) {
      documentText += "7. POST-ASSIGNMENT OBLIGATIONS\n\n";
      
      documentText += "7.1 Confidentiality. The Assignor agrees to maintain the confidentiality of all confidential information related to the Assigned Intellectual Property, and shall not disclose such information to any third party without the prior written consent of the Assignee.\n\n";
      
      documentText += "7.2 Cooperation. The Assignor agrees to cooperate with the Assignee in the prosecution of any patent applications, copyright registrations, or other applications or registrations related to the Assigned Intellectual Property, including by providing technical information, executing documents, and testifying in any proceeding.\n\n";
      
      documentText += "7.3 Non-Competition. The Assignor agrees not to develop, create, or assist in the development or creation of any intellectual property that competes with or is substantially similar to the Assigned Intellectual Property for a period of one year following the Effective Date of this Agreement.\n\n";
    }
    
    // 8. General Provisions
    documentText += "8. GENERAL PROVISIONS\n\n";
    
    documentText += "8.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of " + (assigneeState || "[STATE]") + " without reference to its conflict of laws principles.\n\n";
    
    documentText += "8.2 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous oral or written agreements concerning such subject matter.\n\n";
    
    documentText += "8.3 Severability. If any provision of this Agreement is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable.\n\n";
    
    documentText += "8.4 Successors and Assigns. This Agreement shall be binding upon and inure to the benefit of the parties and their respective successors and assigns.\n\n";
    
    documentText += "8.5 Counterparts. This Agreement may be executed in one or more counterparts, each of which shall be deemed an original and all of which together shall constitute one instrument.\n\n";
    
    // Signature block
    documentText += "IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n";
    
    documentText += "ASSIGNOR:\n\n";
    
    if (assignorType === "individual") {
      documentText += "________________________\n\n";
      
      documentText += "Name: " + (assignorName || "[ASSIGNOR NAME]") + "\n\n";
      
      documentText += "Date: " + (dateSigned || "[DATE]") + "\n\n";
    } else {
      documentText += assignorName || "[ASSIGNOR NAME]" + "\n\n";
      
      documentText += "By: ________________________\n\n";
      
      documentText += "Name: " + (assignorSignatory || "[SIGNATORY NAME]") + "\n\n";
      
      documentText += "Title: " + (assignorSignatoryTitle || "[TITLE]") + "\n\n";
      
      documentText += "Date: " + (dateSigned || "[DATE]") + "\n\n";
    }
    
    documentText += "ASSIGNEE:\n\n";
    
    documentText += assigneeName || "[ASSIGNEE NAME]" + "\n\n";
    
    documentText += "By: ________________________\n\n";
    
    documentText += "Name: " + (assigneeSignatory || "[SIGNATORY NAME]") + "\n\n";
    
    documentText += "Title: " + (assigneeSignatoryTitle || "[TITLE]") + "\n\n";
    
    documentText += "Date: " + (dateSigned || "[DATE]") + "\n\n";
    
    // Add witness sections if required
    if (requireWitnesses) {
      documentText += "WITNESS 1:\n\n";
      documentText += "________________________\n\n";
      documentText += "Name: _____________________\n\n";
      documentText += "Date: _____________________\n\n";
      
      documentText += "WITNESS 2:\n\n";
      documentText += "________________________\n\n";
      documentText += "Name: _____________________\n\n";
      documentText += "Date: _____________________\n\n";
    }
    
    // Add notary section if required
    if (requireNotary) {
      documentText += "NOTARY ACKNOWLEDGMENT\n\n";
      documentText += "State of ___________________\n\n";
      documentText += "County of __________________\n\n";
      documentText += "On _________________ before me, ________________________, personally appeared\n";
      documentText += "________________________________, who proved to me on the basis of satisfactory\n";
      documentText += "evidence to be the person(s) whose name(s) is/are subscribed to the within instrument\n";
      documentText += "and acknowledged to me that he/she/they executed the same in his/her/their authorized\n";
      documentText += "capacity(ies), and that by his/her/their signature(s) on the instrument the person(s), or\n";
      documentText += "the entity upon behalf of which the person(s) acted, executed the instrument.\n\n";
      documentText += "I certify under PENALTY OF PERJURY under the laws of the State of ________________\n";
      documentText += "that the foregoing paragraph is true and correct.\n\n";
      documentText += "WITNESS my hand and official seal.\n\n";
      documentText += "________________________________\n";
      documentText += "Notary Public\n\n";
      documentText += "[NOTARY SEAL]\n\n";
    }
    
    return documentText;
  };
  
  // Generate the document text
  const documentText = generateDocument();
  
  // Function to create highlighted text based on what was last changed
  const createHighlightedText = () => {
    if (!lastChanged || !documentText) return documentText;
    
    let highlightedText = documentText;
    
    // Define patterns to match based on what field was changed
    const patterns = {
      // Party Information
      assignorType: new RegExp(`${formData.assignorName}.*?\\(the "Assignor"\\)`, 's'),
      assignorName: new RegExp(`${formData.assignorName || "\\[ASSIGNOR NAME\\]"}`, 'g'),
      assignorEntityType: new RegExp(`a ${formData.assignorEntityType || "\\[ENTITY TYPE\\]"}`, 'g'),
      assignorState: new RegExp(`${formData.assignorState || "\\[STATE\\]"}`, 'g'),
      assignorAddress: new RegExp(`${formData.assignorAddress || "\\[ADDRESS\\]"}`, 'g'),
      assignorCity: new RegExp(`${formData.assignorCity || "\\[CITY\\]"}`, 'g'),
      assignorZip: new RegExp(`${formData.assignorZip || "\\[ZIP\\]"}`, 'g'),
      
      assigneeName: new RegExp(`${formData.assigneeName || "\\[ASSIGNEE NAME\\]"}`, 'g'),
      assigneeEntityType: new RegExp(`a ${formData.assigneeEntityType || "\\[ENTITY TYPE\\]"}`, 'g'),
      assigneeState: new RegExp(`${formData.assigneeState || "\\[STATE\\]"}`, 'g'),
      assigneeAddress: new RegExp(`${formData.assigneeAddress || "\\[ADDRESS\\]"}`, 'g'),
      assigneeCity: new RegExp(`${formData.assigneeCity || "\\[CITY\\]"}`, 'g'),
      assigneeZip: new RegExp(`${formData.assigneeZip || "\\[ZIP\\]"}`, 'g'),
      
      // Agreement Details
      effectiveDate: new RegExp(`${formData.effectiveDate || "\\[EFFECTIVE DATE\\]"}`, 'g'),
      isPaidAssignment: /WHEREAS, the Assignee is willing to pay.*?consideration for such assignment;/s,
      assignmentAmount: new RegExp(`${formData.assignmentAmount || "\\[AMOUNT\\]"}`, 'g'),
      currency: new RegExp(`${formData.currency || "USD"}`, 'g'),
      isEmploymentContext: /WHEREAS, the Assignor is .*? the Assignee in the position of/s,
      position: new RegExp(`${formData.position || "\\[POSITION\\]"}`, 'g'),
      relationship: new RegExp(`${formData.relationship}`, 'g'),
      
      // Invention/IP Details
      hasSpecificInventions: /1\.2 "Assigned Intellectual Property" means the following Intellectual Property:/s,
      inventionDescriptions: /1\.2 "Assigned Intellectual Property" means the following Intellectual Property:\n\n(.*?)\n\n/s,
      hasPatentApplications: /1\.3 "Patent Applications" means the following patent applications:/s,
      patentApplications: /1\.3 "Patent Applications" means the following patent applications:\n\n(.*?)\n\n/s,
      includeAllInventions: /2\.1 Assignment of All Intellectual Property/,
      
      // IP Scope related patterns
      includePatents: /including all (.*?), in the United States/s,
      includePatentApplications: /including all (.*?), in the United States/s,
      includeCopyrights: /including all (.*?), in the United States/s,
      includeTrademarks: /including all (.*?), in the United States/s,
      includeTradeSecrets: /including all (.*?), in the United States/s,
      includeMaskWorks: /including all (.*?), in the United States/s,
      includeIndustrialDesigns: /including all (.*?), in the United States/s,
      includeKnowHow: /including all (.*?), in the United States/s,
      
      // Special Provisions
      includeDisclosureObligation: /4\.2 Disclosure Obligation.*?result in Assigned Intellectual Property\./s,
      includeInventionRecords: /4\.3 Invention Records.*?relationship with the Assignee\./s,
      includeShopRights: /6\.3 Shop Rights.*?of the Assignee's business\./s,
      includePostAssignmentObligations: /7\. POST-ASSIGNMENT OBLIGATIONS.*?of this Agreement\./s,
      stateSpecificProvisions: /6\.1 State Law Limitations.*/s,
      includeInventionExclusions: /6\.2 Excluded Intellectual Property.*?from this Agreement:/s,
      inventionExclusions: /6\.2 Excluded Intellectual Property.*?from this Agreement:\n\n(.*?)\n\n/s,
      includeRoyalties: /3\.2 Royalties.*?royalties due\./s,
      royaltyPercentage: new RegExp(`royalty of ${formData.royaltyPercentage || "2"}%`, 'g'),
      includeMonetaryIncentives: /3\.3 Invention Incentives.*?from the Assigned Intellectual Property\./s,
      incentiveAmount: new RegExp(`payment of ${formData.incentiveAmount || "\\[AMOUNT\\]"}`, 'g'),
      
      // Signature Information
      assignorSignatory: new RegExp(`Name: ${formData.assignorSignatory || "\\[SIGNATORY NAME\\]"}`, 'g'),
      assignorSignatoryTitle: new RegExp(`Title: ${formData.assignorSignatoryTitle || "\\[TITLE\\]"}`, 'g'),
      assigneeSignatory: new RegExp(`Name: ${formData.assigneeSignatory || "\\[SIGNATORY NAME\\]"}`, 'g'),
      assigneeSignatoryTitle: new RegExp(`Title: ${formData.assigneeSignatoryTitle || "\\[TITLE\\]"}`, 'g'),
      dateSigned: new RegExp(`Date: ${formData.dateSigned || "\\[DATE\\]"}`, 'g'),
      
      // Witnesses/Notary
      requireWitnesses: /WITNESS 1:.*?Date: ____________________/s,
      requireNotary: /NOTARY ACKNOWLEDGMENT.*?Notary Public/s
    };
    
    // Only try to highlight if the corresponding pattern exists
    if (patterns[lastChanged]) {
      const pattern = patterns[lastChanged];
      
      // For checkbox fields, we check if the section should be shown or not
      if (typeof formData[lastChanged] === 'boolean') {
        if (formData[lastChanged]) {
          // If checkbox is checked, highlight the section if it exists
          highlightedText = highlightedText.replace(pattern, match => 
            `<span class="highlighted-text">${match}</span>`
          );
        } else {
          // If checkbox is unchecked, we don't need to highlight anything
          // because the section won't be in the document
        }
      } else {
        // For text fields, check if the content is non-empty and highlight
        if (formData[lastChanged] && formData[lastChanged].trim()) {
          highlightedText = highlightedText.replace(pattern, match => 
            `<span class="highlighted-text">${match}</span>`
          );
        }
      }
    }
    
    return highlightedText;
  };
  
  // Create highlighted content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        // Save current scroll position before scrolling
        const prevScrollTop = previewRef.current.scrollTop;
        
        // Scroll to the highlighted element with smooth behavior
        highlightedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        
        // Store original position to allow scrolling back
        setTimeout(() => {
          // This gives the UI time to update before allowing scroll again
          if (previewRef.current) {
            previewRef.current.dataset.prevScrollTop = prevScrollTop;
          }
        }, 100);
      }
    }
  }, [highlightedText]);
  
  // Identify issues for the Review tab
  const identifyIssues = () => {
    const issues = [];
    
    // Check for missing essential information
    if (!formData.assignorName) {
      issues.push({
        level: 'high',
        text: 'Assignor Name Missing',
        description: 'The name of the party assigning intellectual property is missing.',
        advice: 'Enter the assignor\'s name in the Parties tab.'
      });
    }
    
    if (!formData.assigneeName) {
      issues.push({
        level: 'high',
        text: 'Assignee Name Missing',
        description: 'The name of the party receiving the intellectual property assignment is missing.',
        advice: 'Enter the assignee\'s name in the Parties tab.'
      });
    }
    
    if (!formData.effectiveDate) {
      issues.push({
        level: 'medium',
        text: 'Effective Date Missing',
        description: 'The effective date of the agreement is missing.',
        advice: 'Enter the effective date in the Agreement Details tab to establish when the agreement becomes binding.'
      });
    }
    
    if (formData.isPaidAssignment && !formData.assignmentAmount) {
      issues.push({
        level: 'high',
        text: 'Payment Amount Missing',
        description: 'You\'ve indicated this is a paid assignment, but haven\'t specified the payment amount.',
        advice: 'Enter the payment amount in the Agreement Details tab or uncheck the "Paid Assignment" option.'
      });
    }
    
    if (formData.includeRoyalties && !formData.royaltyPercentage) {
      issues.push({
        level: 'medium',
        text: 'Royalty Percentage Missing',
        description: 'You\'ve included royalty provisions but haven\'t specified the royalty percentage.',
        advice: 'Enter the royalty percentage in the Special Provisions tab or uncheck the "Include Royalties" option.'
      });
    }
    
    if (formData.includeMonetaryIncentives && !formData.incentiveAmount) {
      issues.push({
        level: 'medium',
        text: 'Incentive Amount Missing',
        description: 'You\'ve included invention incentives but haven\'t specified the incentive amount.',
        advice: 'Enter the incentive amount in the Special Provisions tab or uncheck the "Include Monetary Incentives" option.'
      });
    }
    
    if (formData.hasSpecificInventions && !formData.inventionDescriptions) {
      issues.push({
        level: 'high',
        text: 'Invention Descriptions Missing',
        description: 'You\'ve indicated there are specific inventions being assigned, but haven\'t described them.',
        advice: 'Enter descriptions of the inventions in the Invention Details tab or uncheck the "Specific Inventions" option.'
      });
    }
    
    if (formData.hasPatentApplications && !formData.patentApplications) {
      issues.push({
        level: 'high',
        text: 'Patent Applications Missing',
        description: 'You\'ve indicated there are patent applications being assigned, but haven\'t listed them.',
        advice: 'Enter details of the patent applications in the Invention Details tab or uncheck the "Has Patent Applications" option.'
      });
    }
    
    if (formData.includeInventionExclusions && !formData.inventionExclusions) {
      issues.push({
        level: 'high',
        text: 'Invention Exclusions Missing',
        description: 'You\'ve indicated there are inventions to exclude from the assignment, but haven\'t listed them.',
        advice: 'Enter details of the excluded inventions in the Special Provisions tab or uncheck the "Include Invention Exclusions" option.'
      });
    }
    
    // Check for signature information
    if (formData.assignorType !== "individual" && !formData.assignorSignatory) {
      issues.push({
        level: 'medium',
        text: 'Assignor Signatory Missing',
        description: 'The name of the person signing on behalf of the assignor is missing.',
        advice: 'Enter the name of the authorized assignor representative in the Execution tab.'
      });
    }
    
    if (formData.assignorType !== "individual" && !formData.assignorSignatoryTitle) {
      issues.push({
        level: 'low',
        text: 'Assignor Signatory Title Missing',
        description: 'The title of the assignor signatory is missing.',
        advice: 'Enter the title of the authorized assignor representative in the Execution tab.'
      });
    }
    
    if (!formData.assigneeSignatory) {
      issues.push({
        level: 'medium',
        text: 'Assignee Signatory Missing',
        description: 'The name of the person signing on behalf of the assignee is missing.',
        advice: 'Enter the name of the authorized assignee representative in the Execution tab.'
      });
    }
    
    if (!formData.assigneeSignatoryTitle) {
      issues.push({
        level: 'low',
        text: 'Assignee Signatory Title Missing',
        description: 'The title of the assignee signatory is missing.',
        advice: 'Enter the title of the authorized assignee representative in the Execution tab.'
      });
    }
    
    // If no issues, add a "good to go" message
    if (issues.length === 0) {
      issues.push({
        level: 'low',
        text: 'Agreement is Ready for Execution',
        description: 'All essential information has been provided for this agreement.',
        advice: 'Review the document one more time before finalizing, and consider consulting an attorney for any specific legal questions.'
      });
    }
    
    return issues;
  };
  
  // Generate the list of issues
  const issues = identifyIssues();
  
  // Render different form content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Parties
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Assignor Information</h3>
              <div className="form-group">
                <label>Assignor Type</label>
                <select
                  name="assignorType"
                  className="form-control"
                  value={formData.assignorType}
                  onChange={handleChange}
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="university">University/Educational Institution</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="assignorName">
                  {formData.assignorType === "individual" ? "Assignor Name" : "Assignor Entity Name"}
                </label>
                <input
                  type="text"
                  id="assignorName"
                  name="assignorName"
                  className="form-control"
                  value={formData.assignorName}
                  onChange={handleChange}
                  placeholder={formData.assignorType === "individual" ? "Enter full name" : "Enter entity name"}
                />
              </div>
              
              {formData.assignorType !== "individual" && (
                <div className="form-group">
                  <label htmlFor="assignorEntityType">Entity Type</label>
                  <select
                    id="assignorEntityType"
                    name="assignorEntityType"
                    className="form-control"
                    value={formData.assignorEntityType}
                    onChange={handleChange}
                  >
                    <option value="corporation">Corporation</option>
                    <option value="llc">Limited Liability Company</option>
                    <option value="partnership">Partnership</option>
                    <option value="sole proprietorship">Sole Proprietorship</option>
                    {formData.assignorType === "university" && (
                      <option value="educational institution">Educational Institution</option>
                    )}
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="assignorAddress">Address</label>
                <input
                  type="text"
                  id="assignorAddress"
                  name="assignorAddress"
                  className="form-control"
                  value={formData.assignorAddress}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="form-row-flex">
                <div className="form-group">
                  <label htmlFor="assignorCity">City</label>
                  <input
                    type="text"
                    id="assignorCity"
                    name="assignorCity"
                    className="form-control"
                    value={formData.assignorCity}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="assignorState">State</label>
                  <input
                    type="text"
                    id="assignorState"
                    name="assignorState"
                    className="form-control"
                    value={formData.assignorState}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="assignorZip">ZIP Code</label>
                  <input
                    type="text"
                    id="assignorZip"
                    name="assignorZip"
                    className="form-control"
                    value={formData.assignorZip}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Assignee Information</h3>
              <div className="form-group">
                <label htmlFor="assigneeName">Assignee Entity Name</label>
                <input
                  type="text"
                  id="assigneeName"
                  name="assigneeName"
                  className="form-control"
                  value={formData.assigneeName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="assigneeEntityType">Entity Type</label>
                <select
                  id="assigneeEntityType"
                  name="assigneeEntityType"
                  className="form-control"
                  value={formData.assigneeEntityType}
                  onChange={handleChange}
                >
                  <option value="corporation">Corporation</option>
                  <option value="llc">Limited Liability Company</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole proprietorship">Sole Proprietorship</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="assigneeAddress">Address</label>
                <input
                  type="text"
                  id="assigneeAddress"
                  name="assigneeAddress"
                  className="form-control"
                  value={formData.assigneeAddress}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="form-row-flex">
                <div className="form-group">
                  <label htmlFor="assigneeCity">City</label>
                  <input
                    type="text"
                    id="assigneeCity"
                    name="assigneeCity"
                    className="form-control"
                    value={formData.assigneeCity}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="assigneeState">State</label>
                  <input
                    type="text"
                    id="assigneeState"
                    name="assigneeState"
                    className="form-control"
                    value={formData.assigneeState}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="assigneeZip">ZIP Code</label>
                  <input
                    type="text"
                    id="assigneeZip"
                    name="assigneeZip"
                    className="form-control"
                    value={formData.assigneeZip}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 1: // Agreement Details
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Basic Agreement Details</h3>
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
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isPaidAssignment"
                    name="isPaidAssignment"
                    checked={formData.isPaidAssignment}
                    onChange={handleChange}
                  />
                  <label htmlFor="isPaidAssignment">Paid Assignment</label>
                  <InfoTooltip text="If checked, the agreement will include payment details for the assignment." />
                </div>
              </div>
              
              {formData.isPaidAssignment && (
                <div className="form-row-flex">
                  <div className="form-group">
                    <label htmlFor="assignmentAmount">Payment Amount</label>
                    <input
                      type="text"
                      id="assignmentAmount"
                      name="assignmentAmount"
                      className="form-control"
                      value={formData.assignmentAmount}
                      onChange={handleChange}
                      placeholder="e.g., 10,000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select
                      id="currency"
                      name="currency"
                      className="form-control"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                      <option value="CAD">CAD (Canadian Dollar)</option>
                      <option value="AUD">AUD (Australian Dollar)</option>
                      <option value="JPY">JPY (Japanese Yen)</option>
                    </select>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isEmploymentContext"
                    name="isEmploymentContext"
                    checked={formData.isEmploymentContext}
                    onChange={handleChange}
                  />
                  <label htmlFor="isEmploymentContext">Assignment in Employment Context</label>
                  <InfoTooltip text="If checked, the agreement will include language about the assignor's employment relationship with the assignee." />
                </div>
              </div>
              
              {formData.isEmploymentContext && (
                <>
                  <div className="form-group">
                    <label htmlFor="relationship">Relationship Type</label>
                    <select
                      id="relationship"
                      name="relationship"
                      className="form-control"
                      value={formData.relationship}
                      onChange={handleChange}
                    >
                      <option value="employee">Employee</option>
                      <option value="contractor">Independent Contractor</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="position">Position/Title</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      className="form-control"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer, Research Scientist"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
        
      case 2: // Invention Details
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Invention/IP Scope</h3>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="hasSpecificInventions"
                    name="hasSpecificInventions"
                    checked={formData.hasSpecificInventions}
                    onChange={handleChange}
                  />
                  <label htmlFor="hasSpecificInventions">Specific Inventions Being Assigned</label>
                  <InfoTooltip text="If checked, the agreement will be limited to specific listed inventions rather than all IP created by the assignor." />
                </div>
              </div>
              
              {formData.hasSpecificInventions && (
                <div className="form-group">
                  <label htmlFor="inventionDescriptions">Description of Inventions</label>
                  <textarea
                    id="inventionDescriptions"
                    name="inventionDescriptions"
                    className="form-control"
                    value={formData.inventionDescriptions}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide detailed descriptions of the specific inventions or intellectual property being assigned."
                  ></textarea>
                </div>
              )}
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="hasPatentApplications"
                    name="hasPatentApplications"
                    checked={formData.hasPatentApplications}
                    onChange={handleChange}
                  />
                  <label htmlFor="hasPatentApplications">Patent Applications Included</label>
                  <InfoTooltip text="If checked, the agreement will specifically reference patent applications that are being assigned." />
                </div>
              </div>
              
              {formData.hasPatentApplications && (
                <div className="form-group">
                  <label htmlFor="patentApplications">Patent Applications</label>
                  <textarea
                    id="patentApplications"
                    name="patentApplications"
                    className="form-control"
                    value={formData.patentApplications}
                    onChange={handleChange}
                    rows="4"
                    placeholder="List patent applications with application numbers, titles, filing dates, and countries."
                  ></textarea>
                </div>
              )}
              
              {!formData.hasSpecificInventions && (
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="includeAllInventions"
                      name="includeAllInventions"
                      checked={formData.includeAllInventions}
                      onChange={handleChange}
                    />
                    <label htmlFor="includeAllInventions">Include All Inventions (Past and Future)</label>
                    <InfoTooltip text="If checked, the agreement will cover all inventions of the assignor, including those created before and after the agreement." />
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h3>Types of IP Being Assigned</h3>
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includePatents"
                    name="includePatents"
                    checked={formData.includePatents}
                    onChange={handleChange}
                  />
                  <label htmlFor="includePatents">Patents</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includePatentApplications"
                    name="includePatentApplications"
                    checked={formData.includePatentApplications}
                    onChange={handleChange}
                  />
                  <label htmlFor="includePatentApplications">Patent Applications</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeCopyrights"
                    name="includeCopyrights"
                    checked={formData.includeCopyrights}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeCopyrights">Copyrights</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeTrademarks"
                    name="includeTrademarks"
                    checked={formData.includeTrademarks}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeTrademarks">Trademarks</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeTradeSecrets"
                    name="includeTradeSecrets"
                    checked={formData.includeTradeSecrets}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeTradeSecrets">Trade Secrets</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeMaskWorks"
                    name="includeMaskWorks"
                    checked={formData.includeMaskWorks}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeMaskWorks">Mask Works (semiconductor layouts)</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeIndustrialDesigns"
                    name="includeIndustrialDesigns"
                    checked={formData.includeIndustrialDesigns}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeIndustrialDesigns">Industrial Designs</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeKnowHow"
                    name="includeKnowHow"
                    checked={formData.includeKnowHow}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeKnowHow">Know-How & Technical Information</label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // IP Scope
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Documentation Requirements</h3>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeDisclosureObligation"
                    name="includeDisclosureObligation"
                    checked={formData.includeDisclosureObligation}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeDisclosureObligation">Include Disclosure Obligation</label>
                  <InfoTooltip text="If checked, the agreement will require the assignor to disclose all relevant intellectual property to the assignee." />
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeInventionRecords"
                    name="includeInventionRecords"
                    checked={formData.includeInventionRecords}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeInventionRecords">Include Invention Record Requirements</label>
                  <InfoTooltip text="If checked, the agreement will require the assignor to maintain detailed records of all inventions and developments." />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Post-Assignment Obligations</h3>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includePostAssignmentObligations"
                    name="includePostAssignmentObligations"
                    checked={formData.includePostAssignmentObligations}
                    onChange={handleChange}
                  />
                  <label htmlFor="includePostAssignmentObligations">Include Post-Assignment Obligations</label>
                  <InfoTooltip text="If checked, the agreement will include sections on confidentiality, cooperation, and non-competition after the assignment." />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Employer Rights in Employee Inventions</h3>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeShopRights"
                    name="includeShopRights"
                    checked={formData.includeShopRights}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeShopRights">Include Shop Rights Provision</label>
                  <InfoTooltip text="If checked, the agreement will include a provision giving the assignee rights to use inventions created by the assignor outside of employment but related to the assignee's business." />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4: // Special Provisions
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>State-Specific Provisions</h3>
              <div className="form-group">
                <label htmlFor="stateSpecificProvisions">Select State for Invention Assignment Laws</label>
                <select
                  id="stateSpecificProvisions"
                  name="stateSpecificProvisions"
                  className="form-control"
                  value={formData.stateSpecificProvisions}
                  onChange={handleChange}
                >
                  <option value="california">California</option>
                  <option value="delaware">Delaware</option>
                  <option value="illinois">Illinois</option>
                  <option value="minnesota">Minnesota</option>
                  <option value="washington">Washington</option>
                  <option value="north_carolina">North Carolina</option>
                  <option value="utah">Utah</option>
                  <option value="none">None</option>
                </select>
                <InfoTooltip text="Many states have specific laws that limit an employer's ability to claim ownership of employee inventions created on personal time without using company resources." />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Excluded Inventions</h3>
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeInventionExclusions"
                    name="includeInventionExclusions"
                    checked={formData.includeInventionExclusions}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeInventionExclusions">Include Excluded Inventions</label>
                  <InfoTooltip text="If checked, the agreement will list specific inventions that are excluded from the assignment." />
                </div>
              </div>
              
              {formData.includeInventionExclusions && (
                <div className="form-group">
                  <label htmlFor="inventionExclusions">Excluded Inventions</label>
                  <textarea
                    id="inventionExclusions"
                    name="inventionExclusions"
                    className="form-control"
                    value={formData.inventionExclusions}
                    onChange={handleChange}
                    rows="4"
                    placeholder="List all inventions, original works of authorship, etc. that should be excluded from this agreement."
                  ></textarea>
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h3>Compensation Provisions</h3>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeRoyalties"
                    name="includeRoyalties"
                    checked={formData.includeRoyalties}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeRoyalties">Include Royalty Provisions</label>
                  <InfoTooltip text="If checked, the agreement will include a provision for the assignor to receive ongoing royalties from the assigned IP." />
                </div>
              </div>
              
              {formData.includeRoyalties && (
                <div className="form-group">
                  <label htmlFor="royaltyPercentage">Royalty Percentage</label>
                  <select
                    id="royaltyPercentage"
                    name="royaltyPercentage"
                    className="form-control"
                    value={formData.royaltyPercentage}
                    onChange={handleChange}
                  >
                    <option value="0.5">0.5%</option>
                    <option value="1">1%</option>
                    <option value="2">2%</option>
                    <option value="3">3%</option>
                    <option value="4">4%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeMonetaryIncentives"
                    name="includeMonetaryIncentives"
                    checked={formData.includeMonetaryIncentives}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeMonetaryIncentives">Include Monetary Incentives</label>
                  <InfoTooltip text="If checked, the agreement will include a provision for the assignor to receive additional payments for inventions that result in patents." />
                </div>
              </div>
              
              {formData.includeMonetaryIncentives && (
                <div className="form-group">
                  <label htmlFor="incentiveAmount">Incentive Amount</label>
                  <input
                    type="text"
                    id="incentiveAmount"
                    name="incentiveAmount"
                    className="form-control"
                    value={formData.incentiveAmount}
                    onChange={handleChange}
                    placeholder="e.g., 1,000"
                  />
                </div>
              )}
            </div>
          </div>
        );
        
      case 5: // Execution
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Assignor Signature</h3>
              
              {formData.assignorType !== "individual" && (
                <>
                  <div className="form-group">
                    <label htmlFor="assignorSignatory">Assignor Signatory Name</label>
                    <input
                      type="text"
                      id="assignorSignatory"
                      name="assignorSignatory"
                      className="form-control"
                      value={formData.assignorSignatory}
                      onChange={handleChange}
                      placeholder="Name of authorized assignor representative"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="assignorSignatoryTitle">Assignor Signatory Title</label>
                    <input
                      type="text"
                      id="assignorSignatoryTitle"
                      name="assignorSignatoryTitle"
                      className="form-control"
                      value={formData.assignorSignatoryTitle}
                      onChange={handleChange}
                      placeholder="e.g., CEO, Director of IP"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="form-section">
              <h3>Assignee Signature</h3>
              <div className="form-group">
                <label htmlFor="assigneeSignatory">Assignee Signatory Name</label>
                <input
                  type="text"
                  id="assigneeSignatory"
                  name="assigneeSignatory"
                  className="form-control"
                  value={formData.assigneeSignatory}
                  onChange={handleChange}
                  placeholder="Name of authorized assignee representative"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="assigneeSignatoryTitle">Assignee Signatory Title</label>
                <input
                  type="text"
                  id="assigneeSignatoryTitle"
                  name="assigneeSignatoryTitle"
                  className="form-control"
                  value={formData.assigneeSignatoryTitle}
                  onChange={handleChange}
                  placeholder="e.g., CEO, CTO"
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Date and Authentication</h3>
              <div className="form-group">
                <label htmlFor="dateSigned">Date of Signing</label>
                <input
                  type="date"
                  id="dateSigned"
                  name="dateSigned"
                  className="form-control"
                  value={formData.dateSigned}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="requireWitnesses"
                    name="requireWitnesses"
                    checked={formData.requireWitnesses}
                    onChange={handleChange}
                  />
                  <label htmlFor="requireWitnesses">Require Witnesses</label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="requireNotary"
                    name="requireNotary"
                    checked={formData.requireNotary}
                    onChange={handleChange}
                  />
                  <label htmlFor="requireNotary">Require Notarization</label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 6: // Review & Finalize
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Review & Finalize</h3>
              <p>Review your IP Assignment Agreement for any issues before finalizing.</p>
              
              {issues.map((issue, index) => (
                <div key={index} className={`risk-level ${issue.level}`}>
                  <div className="risk-level-header">
                    <Icon 
                      name={
                        issue.level === 'high' ? 'alert-circle' : 
                        issue.level === 'medium' ? 'alert-triangle' : 
                        'check-circle'
                      }
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span className="risk-level-text">{issue.text}</span>
                  </div>
                  <div className="risk-level-description">
                    {issue.description}
                  </div>
                  <div className="risk-advice">
                    <strong>Recommendation:</strong> {issue.advice}
                  </div>
                </div>
              ))}
              
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <p>
                  To finalize your agreement, you can download it as a Word document or copy it to your clipboard.
                  For specific legal advice tailored to your situation, please schedule a consultation.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown tab</div>;
    }
  };
  
  // Link to Calendly for consultation
  React.useEffect(() => {
    const calendlyScript = document.createElement('script');
    calendlyScript.src = 'https://assets.calendly.com/assets/external/widget.js';
    calendlyScript.async = true;
    document.body.appendChild(calendlyScript);
    
    return () => {
      if (document.body.contains(calendlyScript)) {
        document.body.removeChild(calendlyScript);
      }
    };
  }, []);
  
  // Main render
  return (
    <div className="container">
      <div className="generator-header">
        <h1>IP Assignment Agreement Generator</h1>
        <p>Create a customized agreement for transferring invention rights and intellectual property</p>
      </div>
      
      <div className="generator-content">
        <div className="tabs-container">
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
              Copy
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
              Download
            </button>
            
            <button
              onClick={scheduleConsultation}
              className="nav-button"
              style={{
                backgroundColor: "#059669", 
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
    </div>
  );
};

// Render the app
ReactDOM.render(
  <IPAssignmentGenerator />,
  document.getElementById('root')
);