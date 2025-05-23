// Single-Member LLC Operating Agreement Generator
const { useState, useEffect, useRef } = React;

const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

const Tooltip = ({ text }) => {
  return (
    <span className="tooltip">
      <Icon name="help-circle" className="tooltip-icon" />
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

const SMOAGenerator = () => {
  // Tab configuration
  const tabs = [
    { id: 'company-info', label: 'Company Information' },
    { id: 'business-details', label: 'Business Details' },
    { id: 'member-details', label: 'Member Details' },
    { id: 'capital-contributions', label: 'Capital & Distributions' },
    { id: 'management', label: 'Management' },
    { id: 'dissolution', label: 'Dissolution & Amendments' }
  ];

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    stateOfFormation: "",
    principalOfficeAddress: "",
    formationDate: "",
    effectiveDate: "",
    
    // Business Details
    businessPurpose: "engaging in any lawful business activity for which Limited Liability Companies may be organized in the State.",
    fiscalYearEnd: "December 31",
    registeredAgent: "",
    registeredOfficeAddress: "",
    
    // Member Details
    memberName: "",
    memberAddress: "",
    memberTaxId: "",
    isUSCitizen: true,
    
    // Capital & Distributions
    initialCapitalContribution: "",
    additionalCapitalRequired: false,
    profitDistributionFrequency: "quarterly",
    distributionLimitations: true,
    
    // Management
    managerName: "",
    useManagerName: false,
    bankAccountSignatory: "",
    bankAccountSignatoryIsThirdParty: false,
    
    // Dissolution & Amendments
    allowAmendmentByManager: false,
    specifySucessorMember: false,
    successorMemberName: "",
    successorMemberAddress: ""
  });
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
  // State for the document text
  const [documentText, setDocumentText] = useState("");
  
  // Generate the document text whenever form data changes
  useEffect(() => {
    const text = generateDocument(formData);
    setDocumentText(text);
  }, [formData]);
  
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
      alert("Document copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Unable to copy to clipboard. Please try again.");
    }
  };
  
  // Download as Word function
  const downloadAsWord = () => {
    try {
      if (!documentText) {
        alert("Please fill out the form to generate the document first.");
        return;
      }
      
      window.generateWordDoc(documentText, formData);
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    // Company Information fields
    if (['companyName', 'stateOfFormation', 'principalOfficeAddress', 'formationDate', 'effectiveDate'].includes(lastChanged)) {
      return 'company-info';
    }
    
    // Business Details fields
    if (['businessPurpose', 'fiscalYearEnd', 'registeredAgent', 'registeredOfficeAddress'].includes(lastChanged)) {
      return 'business-details';
    }
    
    // Member Details fields
    if (['memberName', 'memberAddress', 'memberTaxId', 'isUSCitizen'].includes(lastChanged)) {
      return 'member-details';
    }
    
    // Capital & Distributions fields
    if (['initialCapitalContribution', 'additionalCapitalRequired', 'profitDistributionFrequency', 'distributionLimitations'].includes(lastChanged)) {
      return 'capital-distributions';
    }
    
    // Management fields
    if (['managerName', 'useManagerName', 'bankAccountSignatory', 'bankAccountSignatoryIsThirdParty'].includes(lastChanged)) {
      return 'management';
    }
    
    // Dissolution & Amendments fields
    if (['allowAmendmentByManager', 'specifySucessorMember', 'successorMemberName', 'successorMemberAddress'].includes(lastChanged)) {
      return 'dissolution-amendments';
    }
    
    return null;
  };
  
  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionType = getSectionToHighlight();
    if (!sectionType || !lastChanged) return documentText;
    
    // Define regex patterns for different sections
    const patterns = {
      'company-info': {
        companyName: new RegExp(`(${formData.companyName})`, 'g'),
        stateOfFormation: new RegExp(`(${formData.stateOfFormation})`, 'g'),
        principalOfficeAddress: new RegExp(`(${formData.principalOfficeAddress})`, 'g'),
        formationDate: new RegExp(`(${formData.formationDate})`, 'g'),
        effectiveDate: new RegExp(`(${formData.effectiveDate})`, 'g')
      },
      'business-details': {
        businessPurpose: new RegExp(`(${formData.businessPurpose.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g'),
        fiscalYearEnd: new RegExp(`(${formData.fiscalYearEnd})`, 'g'),
        registeredAgent: new RegExp(`(${formData.registeredAgent})`, 'g'),
        registeredOfficeAddress: new RegExp(`(${formData.registeredOfficeAddress})`, 'g')
      },
      'member-details': {
        memberName: new RegExp(`(${formData.memberName})`, 'g'),
        memberAddress: new RegExp(`(${formData.memberAddress})`, 'g'),
        memberTaxId: new RegExp(`(${formData.memberTaxId})`, 'g'),
        isUSCitizen: new RegExp(`(${formData.isUSCitizen ? 'is' : 'is not'} a U.S. citizen)`, 'g')
      },
      'capital-distributions': {
        initialCapitalContribution: new RegExp(`(\\$${formData.initialCapitalContribution})`, 'g'),
        additionalCapitalRequired: new RegExp(`(Additional capital contributions (are|are not) required)`, 'g'),
        profitDistributionFrequency: new RegExp(`(${formData.profitDistributionFrequency})`, 'g'),
        distributionLimitations: new RegExp(`(Distributions shall be made only when)`, 'g')
      },
      'management': {
        managerName: new RegExp(`(${formData.useManagerName ? formData.managerName : formData.memberName})`, 'g'),
        bankAccountSignatory: new RegExp(`(${formData.bankAccountSignatory})`, 'g')
      },
      'dissolution-amendments': {
        allowAmendmentByManager: new RegExp(`(${formData.allowAmendmentByManager ? 'may' : 'may not'} be amended by the Manager)`, 'g'),
        successorMemberName: formData.specifySucessorMember ? new RegExp(`(${formData.successorMemberName})`, 'g') : null,
        successorMemberAddress: formData.specifySucessorMember ? new RegExp(`(${formData.successorMemberAddress})`, 'g') : null
      }
    };
    
    // Get the pattern for the last changed field
    const pattern = patterns[sectionType] && patterns[sectionType][lastChanged];
    
    if (!pattern || !formData[lastChanged]) return documentText;
    
    // Replace the matched text with highlighted version
    return documentText.replace(pattern, match => 
      `<span class="highlighted-text">${match}</span>`
    );
  };
  
  // Create highlightable content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current && lastChanged) {
      setTimeout(() => {
        const highlightedElement = previewRef.current.querySelector('.highlighted-text');
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [highlightedText, lastChanged]);
  
  // Generate document text
  const generateDocument = (data) => {
    const { 
      companyName, stateOfFormation, principalOfficeAddress, formationDate, effectiveDate,
      businessPurpose, fiscalYearEnd, registeredAgent, registeredOfficeAddress,
      memberName, memberAddress, memberTaxId, isUSCitizen,
      initialCapitalContribution, additionalCapitalRequired, profitDistributionFrequency, distributionLimitations,
      managerName, useManagerName, bankAccountSignatory, bankAccountSignatoryIsThirdParty,
      allowAmendmentByManager, specifySucessorMember, successorMemberName, successorMemberAddress
    } = data;
    
    // Use member name as manager if no manager specified
    const actualManagerName = useManagerName ? managerName : memberName;
    
    // Use member name as bank signatory if none specified
    const actualBankSignatory = bankAccountSignatory || memberName;
    
    // Format today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
OPERATING AGREEMENT
OF
${companyName.toUpperCase()}
A ${stateOfFormation} SINGLE-MEMBER LIMITED LIABILITY COMPANY

This Operating Agreement (the "Agreement") is made and entered into as of ${effectiveDate || formattedDate} by and for the benefit of ${memberName} (the "Member"), as the sole member of ${companyName} (the "Company"), a single-member limited liability company organized under the laws of the State of ${stateOfFormation}.

ARTICLE 1
FORMATION OF THE LIMITED LIABILITY COMPANY

1.1. Formation. The Company was formed on ${formationDate} when Articles of Organization were filed with the Secretary of State of ${stateOfFormation} in accordance with the laws of the State of ${stateOfFormation}.

1.2. Name. The name of the Company is ${companyName}.

1.3. Principal Place of Business. The principal place of business of the Company shall be located at ${principalOfficeAddress}, or such other location as determined by the Member.

1.4. Registered Office and Agent. The registered office of the Company shall be located at ${registeredOfficeAddress || principalOfficeAddress}, and the registered agent shall be ${registeredAgent || memberName}.

1.5. Term. The Company shall continue perpetually unless dissolved in accordance with this Agreement or as otherwise provided by law.

1.6. Purpose. The purpose of the Company is to engage in ${businessPurpose}

1.7. Intent. It is the intent of the Member that the Company be operated in a manner consistent with its treatment as a "disregarded entity" for federal and state income tax purposes. The Member shall not take any action inconsistent with the treatment of the Company as a disregarded entity for tax purposes.

ARTICLE 2
MEMBER INFORMATION

2.1. Member. The name and address of the sole Member of the Company is:
Name: ${memberName}
Address: ${memberAddress}
Tax ID: ${memberTaxId}

2.2. Citizenship. The Member ${isUSCitizen ? 'is' : 'is not'} a U.S. citizen.

ARTICLE 3
CAPITAL CONTRIBUTIONS AND DISTRIBUTIONS

3.1. Initial Capital Contribution. The Member has contributed $${initialCapitalContribution} to the Company as an initial capital contribution.

3.2. Additional Capital Contributions. Additional capital contributions ${additionalCapitalRequired ? 'are' : 'are not'} required from the Member. ${additionalCapitalRequired ? 'The Member may contribute additional capital to the Company as necessary to meet the Company's financial obligations and operational needs.' : 'However, the Member may make additional capital contributions at their discretion.'}

3.3. Capital Accounts. A capital account shall be maintained for the Member in accordance with applicable tax regulations.

3.4. Distributions. Distributions of cash or other assets shall be made to the Member at times determined by the Member, but no less than ${profitDistributionFrequency}. ${distributionLimitations ? 'Distributions shall be made only when the Company has sufficient cash that exceeds its current and anticipated expenses, including reasonable reserves for future expenses, liabilities, and contingencies.' : 'Distributions may be made at the Member\'s discretion.'}

3.5. Tax Distributions. The Company shall make distributions to the Member in amounts necessary to satisfy the Member's tax obligations arising from the Company's operations.

ARTICLE 4
MANAGEMENT AND OPERATIONS

4.1. Management. The business and affairs of the Company shall be managed by ${actualManagerName} (the "Manager").

4.2. Authority of Manager. The Manager shall have full and complete authority, power, and discretion to manage and control the business, affairs, and properties of the Company, to make all decisions regarding those matters, and to perform any and all other acts or activities customary or incidental to the management of the Company's business.

4.3. Banking. All funds of the Company shall be deposited in a bank account or accounts in the name of the Company. Withdrawals from such accounts shall require the signature of ${actualBankSignatory}${bankAccountSignatoryIsThirdParty ? ', who has been authorized by the Member' : ''}.

4.4. Fiscal Year. The fiscal year of the Company shall end on ${fiscalYearEnd}.

4.5. Books and Records. The Company shall maintain complete and accurate books and records of the Company's business and affairs as required by applicable law, and such books and records shall be available for inspection by the Member at any time.

4.6. Indemnification. The Company shall indemnify the Member to the fullest extent permitted by law against all claims and liabilities arising in connection with the business of the Company.

ARTICLE 5
TRANSFER OF MEMBERSHIP INTEREST

5.1. Transfer Restrictions. The Member may transfer all or any portion of the Member's interest in the Company at any time. Any transferee shall immediately become a Member of the Company upon the completion of the transfer.

5.2. Death or Incapacity of Member. In the event of the death or incapacity of the Member, ${specifySucessorMember ? `${successorMemberName} of ${successorMemberAddress} shall become the successor Member of the Company.` : 'the Member\'s estate, heir, or legal representative shall become the successor Member of the Company.'}

ARTICLE 6
DISSOLUTION AND WINDING UP

6.1. Dissolution. The Company shall be dissolved upon the occurrence of any of the following events:
   (a) The written decision of the Member to dissolve the Company;
   (b) The death or incapacity of the Member, unless provision is made for the succession of a new Member;
   (c) The bankruptcy or insolvency of the Member; or
   (d) As otherwise required by law.

6.2. Winding Up. Upon dissolution, the Company shall cease carrying on its business, except as necessary to wind up its business and affairs. The Member shall be responsible for winding up the affairs of the Company and shall take full account of the Company's assets and liabilities.

6.3. Distribution of Assets. Upon the winding up of the Company, the assets shall be distributed as follows:
   (a) To creditors, including the Member if a creditor, in satisfaction of the Company's liabilities; and
   (b) To the Member.

ARTICLE 7
MISCELLANEOUS PROVISIONS

7.1. Amendment. This Agreement ${allowAmendmentByManager ? 'may' : 'may not'} be amended by the Manager. Any amendment requires the written consent of the Member.

7.2. Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${stateOfFormation}.

7.3. Entire Agreement. This Agreement constitutes the entire agreement of the Member with respect to the Company and supersedes all prior agreements or understandings with respect to the Company, whether written or oral.

7.4. Severability. If any provision of this Agreement is held to be illegal, invalid, or unenforceable, such provision shall be fully severable, and this Agreement shall be construed as if such provision had never been a part of this Agreement, with the remaining provisions remaining in full force and effect.

7.5. Binding Effect. This Agreement shall be binding upon and inure to the benefit of the Member, the Member's heirs, successors, assigns, and personal representatives.

7.6. Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.

7.7. Electronic Signatures. Electronic signatures shall be deemed to be original signatures for all purposes of this Agreement.

IN WITNESS WHEREOF, the undersigned, being the sole Member of the Company, has executed this Operating Agreement as of the date first written above.


MEMBER:

_______________________________
${memberName}
${formattedDate}
`;
  };
  
  // Render the component
  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Single-Member LLC Operating Agreement Generator</h1>
        </div>
      </header>
      
      <div className="main-content">
        <div className="generator">
          {/* Form Panel */}
          <div className="form-panel">
            <h2 className="form-heading">Create Your Operating Agreement</h2>
            
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
            
            {/* Tab 1: Company Information */}
            {currentTab === 0 && (
              <div className="tab-content">
                <div className="form-group">
                  <label className="form-label">
                    Company Name
                    <Tooltip text="Enter the full legal name of your LLC as registered with the state." />
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Acme Consulting, LLC"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    State of Formation
                    <Tooltip text="Enter the state where your LLC was formed/registered." />
                  </label>
                  <select
                    name="stateOfFormation"
                    value={formData.stateOfFormation}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select State</option>
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
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Principal Office Address
                    <Tooltip text="The main business address where your LLC will operate." />
                  </label>
                  <textarea
                    name="principalOfficeAddress"
                    value={formData.principalOfficeAddress}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Street Address, City, State, ZIP"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Formation Date
                    <Tooltip text="The date when your LLC was officially formed with the state." />
                  </label>
                  <input
                    type="text"
                    name="formationDate"
                    value={formData.formationDate}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. January 15, 2025"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Operating Agreement Effective Date
                    <Tooltip text="The date when this operating agreement takes effect. Leave blank to use today's date." />
                  </label>
                  <input
                    type="text"
                    name="effectiveDate"
                    value={formData.effectiveDate}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. January 15, 2025"
                  />
                </div>
              </div>
            )}
            
            {/* Tab 2: Business Details */}
            {currentTab === 1 && (
              <div className="tab-content">
                <div className="form-group">
                  <label className="form-label">
                    Business Purpose
                    <Tooltip text="Describe the primary activities of your business. A broad purpose provides flexibility." />
                  </label>
                  <textarea
                    name="businessPurpose"
                    value={formData.businessPurpose}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="e.g. engaging in any lawful business activity..."
                  ></textarea>
                  <p className="form-hint">Tip: A broad business purpose gives you flexibility to pivot your business.</p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Fiscal Year End
                    <Tooltip text="The end date of your company's financial/tax year." />
                  </label>
                  <select
                    name="fiscalYearEnd"
                    value={formData.fiscalYearEnd}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="December 31">December 31 (Calendar Year)</option>
                    <option value="January 31">January 31</option>
                    <option value="February 28">February 28/29</option>
                    <option value="March 31">March 31</option>
                    <option value="April 30">April 30</option>
                    <option value="May 31">May 31</option>
                    <option value="June 30">June 30</option>
                    <option value="July 31">July 31</option>
                    <option value="August 31">August 31</option>
                    <option value="September 30">September 30</option>
                    <option value="October 31">October 31</option>
                    <option value="November 30">November 30</option>
                  </select>
                  <p className="form-hint">Tip: Most small businesses use December 31 to align with personal taxes.</p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Registered Agent
                    <Tooltip text="The person or entity designated to receive legal documents on behalf of your LLC. Often the owner for small LLCs." />
                  </label>
                  <input
                    type="text"
                    name="registeredAgent"
                    value={formData.registeredAgent}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Name of Registered Agent (leave blank to use Member)"
                  />
                  <p className="form-hint">If left blank, the Member will be designated as the Registered Agent.</p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Registered Office Address
                    <Tooltip text="The official address where legal documents can be served. Must be a physical address in the formation state." />
                  </label>
                  <textarea
                    name="registeredOfficeAddress"
                    value={formData.registeredOfficeAddress}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Street Address, City, State, ZIP (leave blank to use Principal Office)"
                  ></textarea>
                  <p className="form-hint">If left blank, the Principal Office Address will be used.</p>
                </div>
              </div>
            )}
            
            {/* Tab 3: Member Details */}
            {currentTab === 2 && (
              <div className="tab-content">
                <div className="form-group">
                  <label className="form-label">
                    Member Name
                    <Tooltip text="The full legal name of the sole member (owner) of the LLC." />
                  </label>
                  <input
                    type="text"
                    name="memberName"
                    value={formData.memberName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Jane Smith"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Member Address
                    <Tooltip text="The legal address of the sole member. Can be home or business address." />
                  </label>
                  <textarea
                    name="memberAddress"
                    value={formData.memberAddress}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Street Address, City, State, ZIP"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Member Tax ID (SSN or EIN)
                    <Tooltip text="For tax purposes. For most single-member LLCs, this will be the owner's Social Security Number." />
                  </label>
                  <input
                    type="text"
                    name="memberTaxId"
                    value={formData.memberTaxId}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                  />
                  <p className="form-warning">
                    <Icon name="alert-triangle" style={{width: "1rem", height: "1rem"}} />
                    Important: This document contains sensitive information. Keep it secure.
                  </p>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="isUSCitizen"
                      checked={formData.isUSCitizen}
                      onChange={handleChange}
                      className="form-checkbox"
                      id="isUSCitizen"
                    />
                    <label htmlFor="isUSCitizen" className="checkbox-label">
                      Member is a U.S. citizen
                      <Tooltip text="This information may be relevant for certain tax and legal considerations." />
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab 4: Capital & Distributions */}
            {currentTab === 3 && (
              <div className="tab-content">
                <div className="form-group">
                  <label className="form-label">
                    Initial Capital Contribution ($)
                    <Tooltip text="The amount of money or value of assets the member initially contributes to start the LLC." />
                  </label>
                  <input
                    type="text"
                    name="initialCapitalContribution"
                    value={formData.initialCapitalContribution}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 1000"
                  />
                  <p className="form-hint">Enter numbers only, no dollar signs or commas.</p>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="additionalCapitalRequired"
                      checked={formData.additionalCapitalRequired}
                      onChange={handleChange}
                      className="form-checkbox"
                      id="additionalCapitalRequired"
                    />
                    <label htmlFor="additionalCapitalRequired" className="checkbox-label">
                      Additional capital contributions may be required
                      <Tooltip text="If checked, the operating agreement will specify that the member may need to contribute additional funds in the future." />
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Profit Distribution Frequency
                    <Tooltip text="How often profits will be distributed to the member." />
                  </label>
                  <select
                    name="profitDistributionFrequency"
                    value={formData.profitDistributionFrequency}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                    <option value="semi-annually">Semi-Annually</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="distributionLimitations"
                      checked={formData.distributionLimitations}
                      onChange={handleChange}
                      className="form-checkbox"
                      id="distributionLimitations"
                    />
                    <label htmlFor="distributionLimitations" className="checkbox-label">
                      Include distribution limitations
                      <Tooltip text="If checked, distributions will only be made when the company has sufficient cash beyond expenses and reserves." />
                    </label>
                  </div>
                  <p className="form-hint">This helps protect the business from being drained of operating capital.</p>
                </div>
              </div>
            )}
            
            {/* Tab 5: Management */}
            {currentTab === 4 && (
              <div className="tab-content">
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="useManagerName"
                      checked={formData.useManagerName}
                      onChange={handleChange}
                      className="form-checkbox"
                      id="useManagerName"
                    />
                    <label htmlFor="useManagerName" className="checkbox-label">
                      Specify a different manager than the member
                      <Tooltip text="By default, the member manages the LLC. Check this if you want to designate someone else to manage daily operations." />
                    </label>
                  </div>
                </div>
                
                {formData.useManagerName && (
                  <div className="form-group">
                    <label className="form-label">
                      Manager Name
                      <Tooltip text="The person who will manage the day-to-day operations of the LLC." />
                    </label>
                    <input
                      type="text"
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label className="form-label">
                    Bank Account Signatory
                    <Tooltip text="The person authorized to sign checks and make transactions on the company's bank accounts." />
                  </label>
                  <input
                    type="text"
                    name="bankAccountSignatory"
                    value={formData.bankAccountSignatory}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Leave blank to use Member name"
                  />
                </div>
                
                {formData.bankAccountSignatory && formData.bankAccountSignatory !== formData.memberName && (
                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="bankAccountSignatoryIsThirdParty"
                        checked={formData.bankAccountSignatoryIsThirdParty}
                        onChange={handleChange}
                        className="form-checkbox"
                        id="bankAccountSignatoryIsThirdParty"
                      />
                      <label htmlFor="bankAccountSignatoryIsThirdParty" className="checkbox-label">
                        Bank signatory is a third party (not the Member)
                        <Tooltip text="Check this if the bank account signatory is someone other than the member." />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Tab 6: Dissolution & Amendments */}
            {currentTab === 5 && (
              <div className="tab-content">
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="allowAmendmentByManager"
                      checked={formData.allowAmendmentByManager}
                      onChange={handleChange}
                      className="form-checkbox"
                      id="allowAmendmentByManager"
                    />
                    <label htmlFor="allowAmendmentByManager" className="checkbox-label">
                      Allow amendments by manager
                      <Tooltip text="If checked, the manager (if different from the member) can amend the operating agreement." />
                    </label>
                  </div>
                  <p className="form-hint">The member's written consent is still required for any amendment.</p>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="specifySucessorMember"
                      checked={formData.specifySucessorMember}
                      onChange={handleChange}
                      className="form-checkbox"
                      id="specifySucessorMember"
                    />
                    <label htmlFor="specifySucessorMember" className="checkbox-label">
                      Specify a successor member
                      <Tooltip text="This designates who will take over ownership if the original member dies or becomes incapacitated." />
                    </label>
                  </div>
                  <p className="form-warning">
                    <Icon name="alert-triangle" style={{width: "1rem", height: "1rem"}} />
                    This does not replace proper estate planning. Consult with an attorney.
                  </p>
                </div>
                
                {formData.specifySucessorMember && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        Successor Member Name
                        <Tooltip text="The person who will become the member if the original member dies or becomes incapacitated." />
                      </label>
                      <input
                        type="text"
                        name="successorMemberName"
                        value={formData.successorMemberName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. Jane Smith"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">
                        Successor Member Address
                        <Tooltip text="The legal address of the successor member." />
                      </label>
                      <textarea
                        name="successorMemberAddress"
                        value={formData.successorMemberAddress}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Street Address, City, State, ZIP"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
            )}
            
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
              
              {/* Schedule consultation button */}
              <button
                onClick={() => window.open("https://terms.law/call/", "_blank")}
                className="nav-button"
                style={{
                  backgroundColor: "#10b981", 
                  color: "white",
                  border: "none"
                }}
              >
                <Icon name="calendar" style={{marginRight: "0.25rem"}} />
                Schedule Consultation
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
          
          {/* Preview Panel */}
          <div className="preview-panel" ref={previewRef}>
            <div className="preview-content">
              <h2 className="form-heading">Live Preview</h2>
              <pre 
                className="document-preview"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the component
const rootElement = document.getElementById('root');
ReactDOM.render(<SMOAGenerator />, rootElement);