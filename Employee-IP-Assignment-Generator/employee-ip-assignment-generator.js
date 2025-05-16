// Icon component
const Icon = ({ name, style }) => {
  return <i data-feather={name} style={style} />;
};

// Main Generator Component
const EmployeeIPAssignmentGenerator = () => {
  // State for managing tabs
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State for managing form data
  const [formData, setFormData] = React.useState({
    // Company Information
    companyName: "",
    companyState: "",
    companyAddress: "",
    companyCity: "",
    companyZip: "",
    
    // Employee Information
    employeeName: "",
    employeeAddress: "",
    employeeCity: "",
    employeeState: "",
    employeeZip: "",
    
    // Agreement Details
    effectiveDate: "",
    position: "",
    exclusions: "",
    hasExclusions: false,
    
    // IP Scope
    includePreEmployment: false,
    includePostEmployment: false,
    restrictionPeriod: "6", // months
    includeComputers: true,
    includePatents: true,
    includeCopyrights: true,
    includeTrademarks: true,
    includeTradeSecrets: true,
    includeMaskWorks: false,
    includeIndustrialDesigns: false,
    
    // Special Provisions
    stateSpecificProvisions: "california",
    includeContractorProvision: false,
    includeConsultantProvision: false,
    includeOpenSourceProvision: false,
    includeAssignabilityProvision: true,
    
    // Signature Information
    companySignatory: "",
    companySignatoryTitle: "",
    dateSigned: ""
  });
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);
  
  // Tab configuration
  const tabs = [
    { id: 'company', label: 'Company Information' },
    { id: 'employee', label: 'Employee Information' },
    { id: 'details', label: 'Agreement Details' },
    { id: 'ipscope', label: 'IP Scope' },
    { id: 'provisions', label: 'Special Provisions' },
    { id: 'signature', label: 'Signature' },
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
        documentTitle: "Employee IP Assignment Agreement",
        fileName: \`\${formData.companyName.replace(/\\s+/g, '-')}-\${formData.employeeName.replace(/\\s+/g, '-')}-IP-Assignment\`
      });
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Schedule consultation
  const scheduleConsultation = () => {
    Calendly.initPopupWidget({
      url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
    });
    return false;
  };

  // Generate document text
  const generateDocument = () => {
    const {
      companyName,
      companyState,
      companyAddress,
      companyCity,
      companyZip,
      employeeName,
      employeeAddress,
      employeeCity,
      employeeState,
      employeeZip,
      effectiveDate,
      position,
      exclusions,
      hasExclusions,
      includePreEmployment,
      includePostEmployment,
      restrictionPeriod,
      includeComputers,
      includePatents,
      includeCopyrights,
      includeTrademarks,
      includeTradeSecrets,
      includeMaskWorks,
      includeIndustrialDesigns,
      stateSpecificProvisions,
      includeContractorProvision,
      includeConsultantProvision,
      includeOpenSourceProvision,
      includeAssignabilityProvision,
      companySignatory,
      companySignatoryTitle,
      dateSigned
    } = formData;

    // Create IP types list
    let ipTypes = [];
    if (includePatents) ipTypes.push("patents");
    if (includeCopyrights) ipTypes.push("copyrights");
    if (includeTrademarks) ipTypes.push("trademarks");
    if (includeTradeSecrets) ipTypes.push("trade secrets");
    if (includeMaskWorks) ipTypes.push("mask works");
    if (includeIndustrialDesigns) ipTypes.push("industrial designs");
    
    const ipTypesList = ipTypes.length > 0 
      ? ipTypes.join(", ").replace(/,([^,]*)$/, ' and$1')
      : "intellectual property";

    // State-specific provisions
    let stateProvision = "";
    if (stateSpecificProvisions === "california") {
      stateProvision = "In accordance with Section 2870 of the California Labor Code, this Agreement does not apply to an invention that the Employee developed entirely on their own time without using the Company's equipment, supplies, facilities, or trade secret information, except for inventions that either: (i) relate to the Company's business or actual or demonstrably anticipated research or development, or (ii) result from any work performed by the Employee for the Company.";
    } else if (stateSpecificProvisions === "delaware") {
      stateProvision = "In accordance with Delaware law, this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Company was used and which was developed entirely on the Employee's own time, unless (a) the invention relates to the business of the Company or to the Company's actual or demonstrably anticipated research or development, or (b) the invention results from any work performed by the Employee for the Company.";
    } else if (stateSpecificProvisions === "illinois") {
      stateProvision = "In accordance with the Illinois Employee Patent Act (765 ILCS 1060/1 et seq.), this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Company was used and which was developed entirely on the Employee's own time, unless (a) the invention relates to the business of the Company or to the Company's actual or demonstrably anticipated research or development, or (b) the invention results from any work performed by the Employee for the Company.";
    } else if (stateSpecificProvisions === "minnesota") {
      stateProvision = "In accordance with Minnesota Statutes Section 181.78, this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Company was used and which was developed entirely on the Employee's own time, and (1) which does not relate (a) directly to the business of the Company or (b) to the Company's actual or demonstrably anticipated research or development, or (2) which does not result from any work performed by the Employee for the Company.";
    } else if (stateSpecificProvisions === "washington") {
      stateProvision = "In accordance with Title 49 RCW, Chapter 49.44, Section 49.44.140 of the Revised Code of Washington, this Agreement does not apply to an invention for which no equipment, supplies, facility or trade secret information of the Company was used and which was developed entirely on the Employee's own time, unless (a) the invention relates (i) directly to the business of the Company, or (ii) to the Company's actual or demonstrably anticipated research or development, or (b) the invention results from any work performed by the Employee for the Company.";
    } else if (stateSpecificProvisions === "north_carolina") {
      stateProvision = "In accordance with North Carolina General Statutes §§ 66-57.1 and 66-57.2, this Agreement does not apply to an invention that the Employee developed entirely on their own time without using the Company's equipment, supplies, facilities or trade secret information except for those inventions that (i) relate to the Company's business or actual or demonstrably anticipated research or development, or (ii) result from any work performed by the Employee for the Company.";
    }

    // Generate document text
    let documentText = "";
    
    // Title
    documentText += "EMPLOYEE INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT\n\n";
    
    // Introduction
    documentText += `This Employee Intellectual Property Assignment Agreement (the "Agreement") is made and entered into as of ${effectiveDate || "[EFFECTIVE DATE]"}, by and between:\n\n`;
    
    documentText += `${companyName || "[COMPANY NAME]"}, a ${companyState || "[STATE]"} corporation with its principal place of business at ${companyAddress || "[ADDRESS]"}, ${companyCity || "[CITY]"}, ${companyState || "[STATE]"} ${companyZip || "[ZIP]"} (the "Company")\n\n`;
    
    documentText += "AND\n\n";
    
    documentText += `${employeeName || "[EMPLOYEE NAME]"}, residing at ${employeeAddress || "[ADDRESS]"}, ${employeeCity || "[CITY]"}, ${employeeState || "[STATE]"} ${employeeZip || "[ZIP]"} (the "Employee")\n\n`;
    
    // Recitals
    documentText += "RECITALS\n\n";
    
    documentText += `WHEREAS, the Employee is employed by the Company in the position of ${position || "[POSITION]"};\n\n`;
    
    documentText += "WHEREAS, during the course of employment, the Employee may create, develop, or contribute to materials, inventions, works of authorship, ideas, or other intellectual property;\n\n";
    
    documentText += "WHEREAS, the Company desires to ensure that it owns all intellectual property created by the Employee within the scope of employment; and\n\n";
    
    documentText += "WHEREAS, the Employee agrees to assign to the Company all rights, title, and interest in such intellectual property in accordance with the terms of this Agreement.\n\n";
    
    documentText += "NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:\n\n";
    
    // 1. Definitions
    documentText += "1. DEFINITIONS\n\n";
    
    documentText += "1.1 \"Intellectual Property\" means any and all inventions, innovations, improvements, developments, discoveries, designs, formulas, methods, processes, techniques, protocols, computer software, databases, mask works, industrial designs, trade secrets, know-how, works of authorship, and other intellectual or industrial property, whether or not patentable, copyrightable, or protectable as trade secrets, created, conceived, reduced to practice, or developed by the Employee, either alone or jointly with others.\n\n";
    
    documentText += "1.2 \"Covered Intellectual Property\" means any Intellectual Property that: (a) relates to the actual or anticipated business, research, or development of the Company; (b) results from or is suggested by any work performed by the Employee for the Company; or (c) is created, conceived, reduced to practice, or developed by the Employee during the Employee's regular or overtime working hours with the Company or at any time during the Employee's employment using the Company's facilities, equipment, supplies, or Confidential Information.\n\n";
    
    // 2. Assignment of Intellectual Property
    documentText += "2. ASSIGNMENT OF INTELLECTUAL PROPERTY\n\n";
    
    documentText += `2.1 Assignment. The Employee hereby irrevocably assigns, transfers, and conveys to the Company all of the Employee's right, title, and interest in and to all Covered Intellectual Property, including all ${ipTypesList}, in the United States and throughout the world, and all applications or registrations for the same. The Employee agrees to promptly disclose all Covered Intellectual Property to the Company.\n\n`;
    
    // Add pre-employment IP provision if selected
    if (includePreEmployment) {
      documentText += "2.2 Pre-Employment Intellectual Property. The Employee hereby also assigns to the Company all Intellectual Property conceived, developed, or reduced to practice by the Employee before the commencement of employment with the Company that relates to the Company's current or anticipated business, products, or research and development.\n\n";
    }
    
    // Add post-employment IP provision if selected
    if (includePostEmployment) {
      documentText += `2.3 Post-Employment Intellectual Property. For a period of ${restrictionPeriod} months after the termination of the Employee's employment with the Company, the Employee agrees to promptly disclose to the Company all Intellectual Property conceived, developed, or reduced to practice by the Employee that relates to the Company's business, products, or research and development at the time of employment termination. If such Intellectual Property is determined by the Company to be Covered Intellectual Property, the Employee hereby assigns all rights to such Intellectual Property to the Company.\n\n`;
    }
    
    // Add computer/equipment provision if selected
    if (includeComputers) {
      documentText += "2.4 Company Equipment. The Employee acknowledges that any Intellectual Property created, conceived, reduced to practice, or developed using the Company's computers, software, equipment, facilities, or resources, even if created outside of regular working hours or off Company premises, constitutes Covered Intellectual Property subject to this Agreement.\n\n";
    }
    
    // 3. Further Assurances
    documentText += "3. FURTHER ASSURANCES\n\n";
    
    documentText += "3.1 Assistance. The Employee agrees to assist the Company, at the Company's expense, in every proper way to secure and enforce the Company's rights in the Covered Intellectual Property, including by executing documents, testifying, and taking any other actions as may be requested by the Company.\n\n";
    
    documentText += "3.2 Power of Attorney. The Employee hereby irrevocably designates and appoints the Company and its duly authorized officers and agents as the Employee's agent and attorney-in-fact to act for and on the Employee's behalf to execute, deliver, and file any such applications and to do all other lawfully permitted acts to further the prosecution and issuance of patents, copyrights, or similar protections with the same legal force and effect as if executed by the Employee.\n\n";
    
    // 4. Exclusions and Limitations
    documentText += "4. EXCLUSIONS AND LIMITATIONS\n\n";
    
    // Add state-specific provision
    if (stateProvision) {
      documentText += `4.1 State Law Limitations. ${stateProvision}\n\n`;
    }
    
    // Add exclusions if selected
    if (hasExclusions && exclusions) {
      documentText += "4.2 Pre-Existing Intellectual Property. The following Intellectual Property, which the Employee created before employment with the Company and without using Company resources, is excluded from this Agreement:\n\n";
      documentText += `${exclusions}\n\n`;
    }
    
    // Add open source provision if selected
    if (includeOpenSourceProvision) {
      documentText += "4.3 Open Source. The Employee's use of open source software or libraries in accordance with the Company's policies does not constitute a breach of this Agreement, provided that such use does not impair the Company's rights in the Covered Intellectual Property or subject the Company's proprietary software to open source license terms.\n\n";
    }
    
    // 5. Special Provisions
    let hasSpecialProvisions = includeContractorProvision || includeConsultantProvision || includeAssignabilityProvision;
    
    if (hasSpecialProvisions) {
      documentText += "5. SPECIAL PROVISIONS\n\n";
      
      // Add contractor provision if selected
      if (includeContractorProvision) {
        documentText += "5.1 Contractor Work. If the Employee engages contractors or third parties to assist in creating Intellectual Property for the Company, the Employee will ensure that such contractors execute appropriate assignments to the Company before beginning any work.\n\n";
      }
      
      // Add consultant provision if selected
      if (includeConsultantProvision) {
        documentText += "5.2 Consulting Activities. The Employee must obtain prior written approval from the Company before engaging in any consulting or other employment activities outside the scope of employment with the Company. Any Intellectual Property created, conceived, or developed in the course of approved consulting activities shall remain subject to this Agreement to the extent it relates to the Company's business or was created using Company resources.\n\n";
      }
      
      // Add assignability provision if selected
      if (includeAssignabilityProvision) {
        documentText += "5.3 Assignability. This Agreement is assignable by the Company to any successor entity, including through merger, acquisition, or sale of assets. The Employee may not assign or transfer this Agreement.\n\n";
      }
    }
    
    // 6. General Provisions
    documentText += "6. GENERAL PROVISIONS\n\n";
    
    documentText += "6.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of " + (companyState || "[STATE]") + " without reference to its conflict of laws principles.\n\n";
    
    documentText += "6.2 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous oral or written agreements concerning such subject matter.\n\n";
    
    documentText += "6.3 Severability. If any provision of this Agreement is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable.\n\n";
    
    documentText += "6.4 Survival. The provisions of this Agreement shall survive the termination of the Employee's employment with the Company.\n\n";
    
    documentText += "6.5 Counterparts. This Agreement may be executed in one or more counterparts, each of which shall be deemed an original and all of which together shall constitute one instrument.\n\n";
    
    // Signature block
    documentText += "IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n";
    
    documentText += "COMPANY:\n\n";
    
    documentText += companyName || "[COMPANY NAME]" + "\n\n";
    
    documentText += "By: ________________________\n\n";
    
    documentText += "Name: " + (companySignatory || "[SIGNATORY NAME]") + "\n\n";
    
    documentText += "Title: " + (companySignatoryTitle || "[TITLE]") + "\n\n";
    
    documentText += "Date: " + (dateSigned || "[DATE]") + "\n\n";
    
    documentText += "EMPLOYEE:\n\n";
    
    documentText += "________________________\n\n";
    
    documentText += "Name: " + (employeeName || "[EMPLOYEE NAME]") + "\n\n";
    
    documentText += "Date: " + (dateSigned || "[DATE]") + "\n\n";
    
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
      // Company Info
      companyName: new RegExp(`${formData.companyName}`, 'g'),
      companyState: new RegExp(`${formData.companyState}`, 'g'),
      companyAddress: new RegExp(`${formData.companyAddress}`, 'g'),
      companyCity: new RegExp(`${formData.companyCity}`, 'g'),
      companyZip: new RegExp(`${formData.companyZip}`, 'g'),
      
      // Employee Info
      employeeName: new RegExp(`${formData.employeeName}`, 'g'),
      employeeAddress: new RegExp(`${formData.employeeAddress}`, 'g'),
      employeeCity: new RegExp(`${formData.employeeCity}`, 'g'),
      employeeState: new RegExp(`${formData.employeeState}`, 'g'),
      employeeZip: new RegExp(`${formData.employeeZip}`, 'g'),
      
      // Agreement Details
      effectiveDate: new RegExp(`${formData.effectiveDate}`, 'g'),
      position: new RegExp(`${formData.position}`, 'g'),
      exclusions: /Pre-Existing Intellectual Property[\s\S]*?(?=\n\n)/,
      
      // IP Scope related patterns
      includePreEmployment: /2\.2 Pre-Employment Intellectual Property[\s\S]*?(?=\n\n)/,
      includePostEmployment: /2\.3 Post-Employment Intellectual Property[\s\S]*?(?=\n\n)/,
      restrictionPeriod: new RegExp(`${formData.restrictionPeriod} months`, 'g'),
      includeComputers: /2\.4 Company Equipment[\s\S]*?(?=\n\n)/,
      
      // IP Types
      includePatents: /including all (.*?), in the United States/,
      includeCopyrights: /including all (.*?), in the United States/,
      includeTrademarks: /including all (.*?), in the United States/,
      includeTradeSecrets: /including all (.*?), in the United States/,
      includeMaskWorks: /including all (.*?), in the United States/,
      includeIndustrialDesigns: /including all (.*?), in the United States/,
      
      // Special Provisions
      stateSpecificProvisions: /4\.1 State Law Limitations[\s\S]*?(?=\n\n)/,
      includeContractorProvision: /5\.1 Contractor Work[\s\S]*?(?=\n\n)/,
      includeConsultantProvision: /5\.2 Consulting Activities[\s\S]*?(?=\n\n)/,
      includeOpenSourceProvision: /4\.3 Open Source[\s\S]*?(?=\n\n)/,
      includeAssignabilityProvision: /5\.3 Assignability[\s\S]*?(?=\n\n)/,
      
      // Signature
      companySignatory: new RegExp(`Name: ${formData.companySignatory}`, 'g'),
      companySignatoryTitle: new RegExp(`Title: ${formData.companySignatoryTitle}`, 'g'),
      dateSigned: new RegExp(`Date: ${formData.dateSigned}`, 'g')
    };
    
    // Only try to highlight if the corresponding pattern exists
    if (patterns[lastChanged] && formData[lastChanged]) {
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
        if (formData[lastChanged].trim()) {
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
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);
  
  // Identify issues for the Review tab
  const identifyIssues = () => {
    const issues = [];
    
    // Check for missing essential information
    if (!formData.companyName) {
      issues.push({
        level: 'high',
        text: 'Company Name Missing',
        description: 'Your company name is missing, which is essential for a valid agreement.',
        advice: 'Enter your company name in the Company Information tab.'
      });
    }
    
    if (!formData.employeeName) {
      issues.push({
        level: 'high',
        text: 'Employee Name Missing',
        description: 'The employee name is missing, which is essential for a valid agreement.',
        advice: 'Enter the employee name in the Employee Information tab.'
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
    
    if (!formData.position) {
      issues.push({
        level: 'medium',
        text: 'Employee Position Missing',
        description: 'The employee\'s position is not specified.',
        advice: 'Enter the employee\'s position in the Agreement Details tab to clarify the scope of employment.'
      });
    }
    
    // Check for IP exclusion issues
    if (formData.hasExclusions && !formData.exclusions) {
      issues.push({
        level: 'high',
        text: 'Exclusions Indicated But Not Specified',
        description: 'You\'ve indicated there are IP exclusions, but haven\'t specified what they are.',
        advice: 'Either add the specific exclusions or uncheck the "Has Exclusions" option in the Agreement Details tab.'
      });
    }
    
    // Check for state-specific provisions
    if (!formData.stateSpecificProvisions) {
      issues.push({
        level: 'medium',
        text: 'No State-Specific Provisions Selected',
        description: 'You haven\'t selected any state-specific IP assignment provisions.',
        advice: 'Select the appropriate state in the Special Provisions tab to ensure compliance with local laws.'
      });
    }
    
    // Check for signature information
    if (!formData.companySignatory) {
      issues.push({
        level: 'low',
        text: 'Company Signatory Missing',
        description: 'The name of the person signing on behalf of the company is missing.',
        advice: 'Enter the name of the authorized company representative in the Signature tab.'
      });
    }
    
    if (!formData.companySignatoryTitle) {
      issues.push({
        level: 'low',
        text: 'Signatory Title Missing',
        description: 'The title of the company signatory is missing.',
        advice: 'Enter the title of the authorized company representative in the Signature tab.'
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
      case 0: // Company Information
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Company Information</h3>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="form-control"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyAddress">Company Address</label>
                <input
                  type="text"
                  id="companyAddress"
                  name="companyAddress"
                  className="form-control"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="form-row-flex">
                <div className="form-group">
                  <label htmlFor="companyCity">City</label>
                  <input
                    type="text"
                    id="companyCity"
                    name="companyCity"
                    className="form-control"
                    value={formData.companyCity}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="companyState">State</label>
                  <input
                    type="text"
                    id="companyState"
                    name="companyState"
                    className="form-control"
                    value={formData.companyState}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="companyZip">ZIP Code</label>
                  <input
                    type="text"
                    id="companyZip"
                    name="companyZip"
                    className="form-control"
                    value={formData.companyZip}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 1: // Employee Information
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Employee Information</h3>
              <div className="form-group">
                <label htmlFor="employeeName">Employee Name</label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  className="form-control"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="employeeAddress">Employee Address</label>
                <input
                  type="text"
                  id="employeeAddress"
                  name="employeeAddress"
                  className="form-control"
                  value={formData.employeeAddress}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="form-row-flex">
                <div className="form-group">
                  <label htmlFor="employeeCity">City</label>
                  <input
                    type="text"
                    id="employeeCity"
                    name="employeeCity"
                    className="form-control"
                    value={formData.employeeCity}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="employeeState">State</label>
                  <input
                    type="text"
                    id="employeeState"
                    name="employeeState"
                    className="form-control"
                    value={formData.employeeState}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="employeeZip">ZIP Code</label>
                  <input
                    type="text"
                    id="employeeZip"
                    name="employeeZip"
                    className="form-control"
                    value={formData.employeeZip}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2: // Agreement Details
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Agreement Details</h3>
              <div className="form-row-flex">
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
                  <label htmlFor="position">Employee Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    className="form-control"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g., Software Developer"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="hasExclusions"
                    name="hasExclusions"
                    checked={formData.hasExclusions}
                    onChange={handleChange}
                  />
                  <label htmlFor="hasExclusions">Employee has pre-existing IP to exclude from this agreement</label>
                </div>
              </div>
              
              {formData.hasExclusions && (
                <div className="form-group">
                  <label htmlFor="exclusions">Describe Pre-Existing IP to Exclude</label>
                  <textarea
                    id="exclusions"
                    name="exclusions"
                    className="form-control"
                    value={formData.exclusions}
                    onChange={handleChange}
                    rows="4"
                    placeholder="List any pre-existing intellectual property that should be excluded from this agreement"
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        );
        
      case 3: // IP Scope
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Intellectual Property Scope</h3>
              
              <div className="form-group">
                <label>Time Scope</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includePreEmployment"
                    name="includePreEmployment"
                    checked={formData.includePreEmployment}
                    onChange={handleChange}
                  />
                  <label htmlFor="includePreEmployment">Include pre-employment IP related to Company's business</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includePostEmployment"
                    name="includePostEmployment"
                    checked={formData.includePostEmployment}
                    onChange={handleChange}
                  />
                  <label htmlFor="includePostEmployment">Include post-employment IP related to Company's business</label>
                </div>
                
                {formData.includePostEmployment && (
                  <div className="form-group">
                    <label htmlFor="restrictionPeriod">Post-Employment Period (months)</label>
                    <select
                      id="restrictionPeriod"
                      name="restrictionPeriod"
                      className="form-control"
                      value={formData.restrictionPeriod}
                      onChange={handleChange}
                    >
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="9">9 months</option>
                      <option value="12">12 months</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="includeComputers"
                    name="includeComputers"
                    checked={formData.includeComputers}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeComputers">Include IP created using Company equipment or resources</label>
                </div>
              </div>
              
              <div className="form-group">
                <label>IP Types to Include</label>
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
                  <label htmlFor="includeMaskWorks">Mask Works (semiconductor chip layouts)</label>
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
                <label htmlFor="stateSpecificProvisions">Select State-Specific IP Provisions</label>
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
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Additional Provisions</h3>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeContractorProvision"
                  name="includeContractorProvision"
                  checked={formData.includeContractorProvision}
                  onChange={handleChange}
                />
                <label htmlFor="includeContractorProvision">Include contractor IP assignment provision</label>
              </div>
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeConsultantProvision"
                  name="includeConsultantProvision"
                  checked={formData.includeConsultantProvision}
                  onChange={handleChange}
                />
                <label htmlFor="includeConsultantProvision">Include consulting activities provision</label>
              </div>
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeOpenSourceProvision"
                  name="includeOpenSourceProvision"
                  checked={formData.includeOpenSourceProvision}
                  onChange={handleChange}
                />
                <label htmlFor="includeOpenSourceProvision">Include open source software provision</label>
              </div>
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeAssignabilityProvision"
                  name="includeAssignabilityProvision"
                  checked={formData.includeAssignabilityProvision}
                  onChange={handleChange}
                />
                <label htmlFor="includeAssignabilityProvision">Include assignability provision (Company can assign the agreement)</label>
              </div>
            </div>
          </div>
        );
        
      case 5: // Signature
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Signature Information</h3>
              <div className="form-group">
                <label htmlFor="companySignatory">Company Signatory Name</label>
                <input
                  type="text"
                  id="companySignatory"
                  name="companySignatory"
                  className="form-control"
                  value={formData.companySignatory}
                  onChange={handleChange}
                  placeholder="Name of authorized company representative"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companySignatoryTitle">Company Signatory Title</label>
                <input
                  type="text"
                  id="companySignatoryTitle"
                  name="companySignatoryTitle"
                  className="form-control"
                  value={formData.companySignatoryTitle}
                  onChange={handleChange}
                  placeholder="e.g., CEO, HR Director"
                />
              </div>
              
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
            </div>
          </div>
        );
        
      case 6: // Review & Finalize
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Review & Finalize</h3>
              <p>Review your Employee IP Assignment Agreement for any issues before finalizing.</p>
              
              {issues.map((issue, index) => (
                <div key={index} className={`risk-level ${issue.level}`}>
                  <div className="risk-level-text">
                    <Icon 
                      name={
                        issue.level === 'high' ? 'alert-circle' : 
                        issue.level === 'medium' ? 'alert-triangle' : 
                        'check-circle'
                      }
                      style={{ marginRight: '0.5rem' }}
                    />
                    {issue.text}
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
      document.body.removeChild(calendlyScript);
    };
  }, []);
  
  // Main render
  return (
    <div className="container">
      <div className="generator-header">
        <h1>Employee IP Assignment Agreement Generator</h1>
        <p>Create a customized agreement for assigning employee intellectual property rights to your company</p>
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
  <EmployeeIPAssignmentGenerator />,
  document.getElementById('root')
);