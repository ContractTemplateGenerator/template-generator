// Foreign Founder U.S. Entry Strategy Agreement Generator

const { useState, useEffect, useRef } = React;

const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

const App = () => {
  // State definitions
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    // Founder information
    founderName: '',
    founderCountry: '',
    founderEmail: '',
    
    // Business information
    businessName: '',
    businessType: 'tech', // Default value
    businessDescription: '',
    
    // U.S. Entry Strategy
    entityType: 'llc', // Default value
    entityState: 'Delaware', // Default value
    
    // Immigration Strategy
    visaType: 'none', // Default value
    needVisa: false,
    
    // Timeline and Budget
    timelineMonths: '3',
    budget: '10000',
    
    // Additional Services
    needBankAccount: false,
    needTaxID: false,
    needRegisteredAgent: false,
    needVirtualOffice: false,
    
    // Agreement Details
    consultantName: 'Attorney',
    consultantTitle: 'Attorney at Law',
    consultantEmail: 'attorney@example.com',
    agreementDate: new Date().toISOString().split('T')[0],
  });
  
  const [lastChanged, setLastChanged] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const previewRef = useRef(null);
  
  // Tab configuration
  const tabs = [
    { id: 'founder', label: 'Founder Info' },
    { id: 'business', label: 'Business Info' },
    { id: 'entry', label: 'U.S. Entry' },
    { id: 'immigration', label: 'Immigration' },
    { id: 'timeline', label: 'Timeline & Budget' },
    { id: 'services', label: 'Additional Services' },
    { id: 'review', label: 'Review & Finalize' }
  ];
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
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
  
  // Generate the document text based on form data
  useEffect(() => {
    generateDocumentText();
  }, [formData]);
  
  const generateDocumentText = () => {
    // Generate the document text based on the form data
    let text = `U.S. MARKET ENTRY STRATEGY AGREEMENT

DATE: ${formData.agreementDate}

PARTIES:

Client: ${formData.founderName || '[Founder Name]'}
Country of Origin: ${formData.founderCountry || '[Country]'}
Email: ${formData.founderEmail || '[Email]'}

Consultant: ${formData.consultantName}
Title: ${formData.consultantTitle}
Email: ${formData.consultantEmail}

BACKGROUND:

WHEREAS, Client is a foreign entrepreneur from ${formData.founderCountry || '[Country]'} seeking to establish business operations in the United States;

WHEREAS, Client's business, ${formData.businessName || '[Business Name]'}, is engaged in ${formData.businessDescription || '[Business Description]'};

WHEREAS, Consultant is experienced in assisting foreign entrepreneurs with U.S. market entry strategies and legal compliance;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. SCOPE OF SERVICES

   Consultant shall provide the following services to assist Client with establishing a U.S. presence:

   1.1 Entity Formation:
       a) Formation of a ${formData.entityType === 'llc' ? 'Limited Liability Company (LLC)' : 
          formData.entityType === 'c-corp' ? 'C Corporation' : 
          formData.entityType === 's-corp' ? 'S Corporation' : 
          formData.entityType === 'partnership' ? 'Partnership' : 
          '[Entity Type]'} in the state of ${formData.entityState || '[State]'}.
       b) Preparation and filing of all necessary formation documents.
       c) Obtaining an Employer Identification Number (EIN) from the IRS.${formData.needTaxID ? ' (Included in services)' : ' (Not included in services)'}`

    if (formData.needBankAccount) {
      text += `\n       d) Guidance on opening a U.S. business bank account.`;
    }
    
    if (formData.needRegisteredAgent) {
      text += `\n       e) Registered agent services for the first year.`;
    }
    
    if (formData.needVirtualOffice) {
      text += `\n       f) Virtual office address services for the first year.`;
    }
    
    text += `\n
   1.2 Business Strategy:
       a) Analysis of optimal U.S. market entry strategy.
       b) Guidance on compliance with federal, state, and local regulations.
       c) Overview of tax obligations and strategies.`;

    if (formData.needVisa) {
      text += `\n
   1.3 Immigration Strategy:
       a) Assessment of appropriate visa options.
       b) Guidance on ${formData.visaType === 'e2' ? 'E-2 Treaty Investor Visa' : 
                        formData.visaType === 'l1' ? 'L-1 Intracompany Transfer Visa' : 
                        formData.visaType === 'o1' ? 'O-1 Extraordinary Ability Visa' : 
                        formData.visaType === 'eb5' ? 'EB-5 Investor Visa' : 
                        '[Visa Type]'} requirements and application process.
       c) Coordination with immigration specialists as needed.`;
    }
    
    text += `\n
2. TIMELINE AND DELIVERABLES

   2.1 Estimated Timeline:
       The services outlined in Section 1 are anticipated to be completed within ${formData.timelineMonths || '[Number]'} months from the date of this Agreement.

   2.2 Key Deliverables:
       a) Entity formation documents and certificates
       b) EIN confirmation letter${formData.needVisa ? `\n       c) Immigration strategy document and visa application guidance` : ''}
       ${formData.needBankAccount ? `d) Bank account opening assistance` : ''}
       ${formData.needRegisteredAgent ? `e) Registered agent confirmation` : ''}
       ${formData.needVirtualOffice ? `f) Virtual office setup confirmation` : ''}

3. FEES AND PAYMENT

   3.1 Service Fees:
       Client agrees to pay Consultant a total fee of $${formData.budget || '[Amount]'} for the services outlined in Section 1.

   3.2 Payment Schedule:
       a) 50% ($${formData.budget ? (parseInt(formData.budget) / 2).toFixed(2) : '[Amount]'}) due upon execution of this Agreement.
       b) 25% ($${formData.budget ? (parseInt(formData.budget) * 0.25).toFixed(2) : '[Amount]'}) due upon submission of entity formation documents.
       c) 25% ($${formData.budget ? (parseInt(formData.budget) * 0.25).toFixed(2) : '[Amount]'}) due upon completion of all services.

   3.3 Additional Costs:
       Client shall be responsible for all filing fees, government fees, and other third-party costs associated with entity formation and visa applications.

4. CLIENT RESPONSIBILITIES

   4.1 The Client shall:
       a) Provide all requested information and documentation in a timely manner.
       b) Review and approve documents prior to filing.
       c) Pay all government filing fees and other costs as outlined in Section 3.3.
       d) Comply with all U.S. laws and regulations.

5. TERM AND TERMINATION

   5.1 Term:
       This Agreement shall commence on the date first written above and shall continue until all services have been completed, or until terminated as provided herein.

   5.2 Termination:
       a) Either party may terminate this Agreement with 30 days' written notice.
       b) Upon termination, Client shall pay for all services performed up to the date of termination.

6. CONFIDENTIALITY

   6.1 Confidential Information:
       Both parties agree to maintain the confidentiality of all proprietary information disclosed during the course of this engagement.

   6.2 Exceptions:
       Confidentiality obligations shall not apply to information that is publicly available or required to be disclosed by law.

7. LIMITATION OF LIABILITY

   7.1 Consultant shall not be liable for any indirect, special, incidental, or consequential damages arising out of this Agreement.

   7.2 Consultant's total liability under this Agreement shall not exceed the amount of fees paid by Client.

8. GENERAL PROVISIONS

   8.1 Governing Law:
       This Agreement shall be governed by the laws of the State of California.

   8.2 Dispute Resolution:
       Any disputes arising out of this Agreement shall be resolved through mediation, and if unsuccessful, through binding arbitration.

   8.3 Entire Agreement:
       This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements.

   8.4 Amendments:
       Any amendments to this Agreement must be in writing and signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT:

____________________________
${formData.founderName || '[Founder Name]'}

CONSULTANT:

____________________________
${formData.consultantName}
${formData.consultantTitle}
`;

    setDocumentText(text);
  };
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText)
      .then(() => {
        alert('Document copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
  };
  
  // Download as Word function
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      window.generateWordDoc(documentText, {
        documentTitle: "Foreign Founder U.S. Entry Strategy Agreement",
        fileName: `US-Entry-Strategy-Agreement-${formData.founderName ? formData.founderName.replace(/\s+/g, '-') : 'Template'}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Function to determine which section to highlight based on last changed field
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    const highlightMapping = {
      // Founder information tab
      founderName: 'founder-section',
      founderCountry: 'founder-section',
      founderEmail: 'founder-section',
      
      // Business information tab
      businessName: 'business-section',
      businessType: 'business-section',
      businessDescription: 'business-section',
      
      // U.S. Entry Strategy tab
      entityType: 'entity-section',
      entityState: 'entity-section',
      
      // Immigration Strategy tab
      visaType: 'visa-section',
      needVisa: 'visa-section',
      
      // Timeline and Budget tab
      timelineMonths: 'timeline-section',
      budget: 'budget-section',
      
      // Additional Services tab
      needBankAccount: 'services-section',
      needTaxID: 'services-section',
      needRegisteredAgent: 'services-section',
      needVirtualOffice: 'services-section',
      
      // Agreement Details
      consultantName: 'consultant-section',
      consultantTitle: 'consultant-section',
      consultantEmail: 'consultant-section',
      agreementDate: 'date-section',
    };
    
    return highlightMapping[lastChanged];
  };
  
  // Function to create highlighted text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    // Define patterns for different sections
    const sectionPatterns = {
      'founder-section': {
        pattern: /Client: .+?\n|Country of Origin: .+?\n|Email: .+?\n|WHEREAS, Client is a foreign entrepreneur from .+? seeking/g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'business-section': {
        pattern: /Client's business, .+?, is engaged in .+?;/g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'entity-section': {
        pattern: /Formation of a .+? in the state of .+?\./g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'visa-section': {
        pattern: /1\.3 Immigration Strategy:[\s\S]*?application process\./g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'timeline-section': {
        pattern: /The services outlined in Section 1 are anticipated to be completed within .+? months/g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'budget-section': {
        pattern: /Client agrees to pay Consultant a total fee of \$[^\n]+|50% \(\$[^\n]+\)|25% \(\$[^\n]+\)/g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'services-section': {
        pattern: /c\) Obtaining an Employer Identification Number[^\n]*|d\) Guidance on opening a U.S. business bank account\.|e\) Registered agent services for the first year\.|f\) Virtual office address services for the first year\./g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'consultant-section': {
        pattern: /Consultant: .+?\n|Title: .+?\n|Email: .+?\n/g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
      'date-section': {
        pattern: /DATE: .+?\n/g,
        replace: match => `<span class="highlighted-text">${match}</span>`
      },
    };
    
    if (sectionPatterns[sectionToHighlight]) {
      return documentText.replace(sectionPatterns[sectionToHighlight].pattern, sectionPatterns[sectionToHighlight].replace);
    }
    
    return documentText;
  };
  
  // Create highlightable content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);
  
  // Render the component
  return (
    <div className="generator-container">
      <h1>Foreign Founder U.S. Entry Strategy Agreement Generator</h1>
      
      {/* Tab navigation */}
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
      
      <div className="generator-content">
        <div className="form-panel">
          {/* Tab 1: Founder Information */}
          {currentTab === 0 && (
            <div className="tab-content">
              <h2>Founder Information</h2>
              <p>Please provide details about the foreign founder seeking to enter the U.S. market.</p>
              
              <div className="form-group">
                <label htmlFor="founderName">Founder/Client Name:</label>
                <input 
                  type="text" 
                  id="founderName" 
                  name="founderName" 
                  value={formData.founderName} 
                  onChange={handleChange} 
                  placeholder="Full legal name"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="founderCountry">Country of Origin:</label>
                  <input 
                    type="text" 
                    id="founderCountry" 
                    name="founderCountry" 
                    value={formData.founderCountry} 
                    onChange={handleChange} 
                    placeholder="e.g., India, Germany"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="founderEmail">Email Address:</label>
                  <input 
                    type="email" 
                    id="founderEmail" 
                    name="founderEmail" 
                    value={formData.founderEmail} 
                    onChange={handleChange} 
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Tab 2: Business Information */}
          {currentTab === 1 && (
            <div className="tab-content">
              <h2>Business Information</h2>
              <p>Please provide details about your business that will be expanding to the U.S.</p>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessName">Business Name:</label>
                  <input 
                    type="text" 
                    id="businessName" 
                    name="businessName" 
                    value={formData.businessName} 
                    onChange={handleChange} 
                    placeholder="Name of your business"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessType">Business Type:</label>
                  <select 
                    id="businessType" 
                    name="businessType" 
                    value={formData.businessType} 
                    onChange={handleChange}
                  >
                    <option value="tech">Technology/Software</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Services</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="businessDescription">Business Description:</label>
                <textarea 
                  id="businessDescription" 
                  name="businessDescription" 
                  value={formData.businessDescription} 
                  onChange={handleChange} 
                  placeholder="Briefly describe your business, products/services, and target market"
                  rows="3"
                ></textarea>
              </div>
            </div>
          )}
          
          {/* Tab 3: U.S. Entry Strategy */}
          {currentTab === 2 && (
            <div className="tab-content">
              <h2>U.S. Entry Strategy</h2>
              <p>Select the legal structure for your U.S. operations.</p>
              
              <div className="form-group">
                <label htmlFor="entityType">Entity Type:</label>
                <select 
                  id="entityType" 
                  name="entityType" 
                  value={formData.entityType} 
                  onChange={handleChange}
                >
                  <option value="llc">Limited Liability Company (LLC)</option>
                  <option value="c-corp">C Corporation</option>
                  <option value="s-corp">S Corporation</option>
                  <option value="partnership">Partnership</option>
                </select>
                <small className="form-text">
                  {formData.entityType === 'llc' && "LLC offers liability protection with tax flexibility and simpler compliance."}
                  {formData.entityType === 'c-corp' && "C Corporation is ideal for raising capital but faces double taxation."}
                  {formData.entityType === 's-corp' && "S Corporation avoids double taxation but has ownership restrictions."}
                  {formData.entityType === 'partnership' && "Partnership offers simplified taxation but less liability protection."}
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="entityState">State of Formation:</label>
                <select 
                  id="entityState" 
                  name="entityState" 
                  value={formData.entityState} 
                  onChange={handleChange}
                >
                  <option value="Delaware">Delaware</option>
                  <option value="California">California</option>
                  <option value="New York">New York</option>
                  <option value="Wyoming">Wyoming</option>
                  <option value="Nevada">Nevada</option>
                  <option value="Florida">Florida</option>
                  <option value="Texas">Texas</option>
                </select>
                <small className="form-text">
                  {formData.entityState === 'Delaware' && "Popular for business-friendly laws and court system."}
                  {formData.entityState === 'California' && "Best if operations will be primarily in California."}
                  {formData.entityState === 'New York' && "Consider for finance or New York-based operations."}
                  {formData.entityState === 'Wyoming' && "Known for privacy and low fees."}
                  {formData.entityState === 'Nevada' && "No state income tax and strong liability protection."}
                  {formData.entityState === 'Florida' && "No state income tax and growing business hub."}
                  {formData.entityState === 'Texas' && "No state income tax and business-friendly environment."}
                </small>
              </div>
            </div>
          )}
          
          {/* Tab 4: Immigration Strategy */}
          {currentTab === 3 && (
            <div className="tab-content">
              <h2>Immigration Strategy</h2>
              <p>Determine your visa and immigration needs for operating in the U.S.</p>
              
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="needVisa" 
                  name="needVisa" 
                  checked={formData.needVisa} 
                  onChange={handleChange}
                />
                <label htmlFor="needVisa">I need a visa strategy for U.S. entry</label>
              </div>
              
              {formData.needVisa && (
                <div className="form-group">
                  <label htmlFor="visaType">Preferred Visa Type:</label>
                  <select 
                    id="visaType" 
                    name="visaType" 
                    value={formData.visaType} 
                    onChange={handleChange}
                  >
                    <option value="none">I'm not sure which visa I need</option>
                    <option value="e2">E-2 Treaty Investor Visa</option>
                    <option value="l1">L-1 Intracompany Transfer Visa</option>
                    <option value="o1">O-1 Extraordinary Ability Visa</option>
                    <option value="eb5">EB-5 Investor Visa</option>
                  </select>
                  <small className="form-text">
                    {formData.visaType === 'none' && "We'll assess your situation and recommend appropriate visa options."}
                    {formData.visaType === 'e2' && "For entrepreneurs investing substantial capital in a U.S. business. Requires home country to have a treaty with the U.S."}
                    {formData.visaType === 'l1' && "For executives or managers transferring from a foreign company to a related U.S. entity."}
                    {formData.visaType === 'o1' && "For individuals with extraordinary ability in business, science, arts, education, or athletics."}
                    {formData.visaType === 'eb5' && "For investors willing to invest $1.8 million (or $900,000 in targeted employment areas) and create 10 full-time jobs."}
                  </small>
                </div>
              )}
            </div>
          )}
          
          {/* Tab 5: Timeline & Budget */}
          {currentTab === 4 && (
            <div className="tab-content">
              <h2>Timeline & Budget</h2>
              <p>Provide your expected timeline and budget for U.S. market entry.</p>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="timelineMonths">Expected Timeline (months):</label>
                  <input 
                    type="number" 
                    id="timelineMonths" 
                    name="timelineMonths" 
                    value={formData.timelineMonths} 
                    onChange={handleChange} 
                    min="1" 
                    max="24"
                  />
                  <small className="form-text">
                    Typical: 1-3 months for entity formation, 3-6+ months for visa applications.
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="budget">Budget for Services (USD):</label>
                  <input 
                    type="number" 
                    id="budget" 
                    name="budget" 
                    value={formData.budget} 
                    onChange={handleChange} 
                    min="1000" 
                    step="1000"
                  />
                  <small className="form-text">
                    Government filing fees and other third-party costs are additional.
                  </small>
                </div>
              </div>
            </div>
          )}
          
          {/* Tab 6: Additional Services */}
          {currentTab === 5 && (
            <div className="tab-content">
              <h2>Additional Services</h2>
              <p>Select additional services you may need for your U.S. operations.</p>
              
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input 
                    type="checkbox" 
                    id="needTaxID" 
                    name="needTaxID" 
                    checked={formData.needTaxID} 
                    onChange={handleChange}
                  />
                  <label htmlFor="needTaxID">EIN (Tax ID) Application Assistance</label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input 
                    type="checkbox" 
                    id="needBankAccount" 
                    name="needBankAccount" 
                    checked={formData.needBankAccount} 
                    onChange={handleChange}
                  />
                  <label htmlFor="needBankAccount">U.S. Bank Account Setup Assistance</label>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input 
                    type="checkbox" 
                    id="needRegisteredAgent" 
                    name="needRegisteredAgent" 
                    checked={formData.needRegisteredAgent} 
                    onChange={handleChange}
                  />
                  <label htmlFor="needRegisteredAgent">Registered Agent Services (First Year)</label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input 
                    type="checkbox" 
                    id="needVirtualOffice" 
                    name="needVirtualOffice" 
                    checked={formData.needVirtualOffice} 
                    onChange={handleChange}
                  />
                  <label htmlFor="needVirtualOffice">Virtual Office Address (First Year)</label>
                </div>
              </div>
            </div>
          )}
          
          {/* Tab 7: Review & Finalize */}
          {currentTab === 6 && (
            <div className="tab-content">
              <h2>Review & Finalize</h2>
              <p>Review your selections and assess any potential risks or gaps in your strategy.</p>
              
              <div className="review-section">
                <h3>Founder & Business Information</h3>
                <div className={`review-item ${!formData.founderName ? 'warning' : ''}`}>
                  <div className="review-label">Founder Name:</div>
                  <div className="review-value">{formData.founderName || 'Not provided'}</div>
                  {!formData.founderName && <div className="review-warning">Required for agreement finalization</div>}
                </div>
                
                <div className={`review-item ${!formData.founderCountry ? 'warning' : ''}`}>
                  <div className="review-label">Country of Origin:</div>
                  <div className="review-value">{formData.founderCountry || 'Not provided'}</div>
                  {!formData.founderCountry && <div className="review-warning">Important for determining treaty eligibility</div>}
                </div>
                
                <div className={`review-item ${!formData.businessName || !formData.businessDescription ? 'warning' : ''}`}>
                  <div className="review-label">Business:</div>
                  <div className="review-value">{formData.businessName || 'Not provided'} - {formData.businessDescription || 'No description'}</div>
                  {(!formData.businessName || !formData.businessDescription) && 
                    <div className="review-warning">Complete business information helps tailor the agreement</div>}
                </div>
              </div>
              
              <div className="review-section">
                <h3>U.S. Market Entry Strategy</h3>
                <div className="review-item">
                  <div className="review-label">Entity Type:</div>
                  <div className="review-value">
                    {formData.entityType === 'llc' ? 'Limited Liability Company (LLC)' : 
                     formData.entityType === 'c-corp' ? 'C Corporation' : 
                     formData.entityType === 's-corp' ? 'S Corporation' : 
                     formData.entityType === 'partnership' ? 'Partnership' : 'Not selected'}
                  </div>
                  {formData.entityType === 's-corp' && formData.founderCountry && 
                    <div className="review-warning">Non-U.S. citizens cannot be shareholders in S Corporations - consider an LLC or C Corp</div>}
                </div>
                
                <div className="review-item">
                  <div className="review-label">State of Formation:</div>
                  <div className="review-value">{formData.entityState}</div>
                  {formData.entityState === 'California' && parseInt(formData.budget) < 5000 && 
                    <div className="review-warning">California has higher formation and maintenance costs</div>}
                </div>
                
                <div className={`review-item ${formData.needVisa && formData.visaType === 'none' ? 'warning' : ''}`}>
                  <div className="review-label">Immigration:</div>
                  <div className="review-value">
                    {formData.needVisa 
                      ? (formData.visaType === 'none' 
                         ? 'Visa needed but type not specified' 
                         : `${formData.visaType === 'e2' ? 'E-2 Treaty Investor Visa' : 
                            formData.visaType === 'l1' ? 'L-1 Intracompany Transfer Visa' : 
                            formData.visaType === 'o1' ? 'O-1 Extraordinary Ability Visa' : 
                            formData.visaType === 'eb5' ? 'EB-5 Investor Visa' : 'Not specified'}`)
                      : 'No visa strategy requested'}
                  </div>
                  {formData.needVisa && formData.visaType === 'none' && 
                    <div className="review-warning">Visa strategy should be specified for comprehensive planning</div>}
                  {formData.needVisa && formData.visaType === 'e2' && (!formData.founderCountry || formData.founderCountry === '') && 
                    <div className="review-warning">E-2 visa requires your country to have a treaty with the U.S. - specify your country</div>}
                </div>
              </div>
              
              <div className="review-section">
                <h3>Timeline & Budget</h3>
                <div className={`review-item ${parseInt(formData.timelineMonths) < 3 && formData.needVisa ? 'warning' : ''}`}>
                  <div className="review-label">Timeline:</div>
                  <div className="review-value">{formData.timelineMonths} months</div>
                  {parseInt(formData.timelineMonths) < 3 && formData.needVisa && 
                    <div className="review-warning">Visa processing typically requires 3+ months</div>}
                </div>
                
                <div className={`review-item ${parseInt(formData.budget) < 5000 ? 'warning' : ''}`}>
                  <div className="review-label">Budget:</div>
                  <div className="review-value">${parseInt(formData.budget).toLocaleString()}</div>
                  {parseInt(formData.budget) < 5000 && 
                    <div className="review-warning">Budget may be insufficient for comprehensive services</div>}
                </div>
              </div>
              
              <div className="review-section">
                <h3>Additional Services</h3>
                <div className={`review-item ${!formData.needTaxID ? 'warning' : ''}`}>
                  <div className="review-label">EIN (Tax ID):</div>
                  <div className="review-value">{formData.needTaxID ? 'Included' : 'Not included'}</div>
                  {!formData.needTaxID && 
                    <div className="review-warning">An EIN is required for most U.S. business operations</div>}
                </div>
                
                <div className={`review-item ${!formData.needBankAccount ? 'info' : ''}`}>
                  <div className="review-label">Bank Account:</div>
                  <div className="review-value">{formData.needBankAccount ? 'Included' : 'Not included'}</div>
                  {!formData.needBankAccount && 
                    <div className="review-info">Consider adding bank account setup assistance</div>}
                </div>
                
                <div className={`review-item ${!formData.needRegisteredAgent ? 'info' : ''}`}>
                  <div className="review-label">Registered Agent:</div>
                  <div className="review-value">{formData.needRegisteredAgent ? 'Included' : 'Not included'}</div>
                  {!formData.needRegisteredAgent && 
                    <div className="review-info">A registered agent is required in most states</div>}
                </div>
              </div>
              
              <div className="consultation-cta">
                <p>Need personalized advice on your U.S. market entry strategy?</p>
                <div className="consult-button-container">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.Calendly) {
                        window.Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'});
                      }
                    }}
                    className="consult-button"
                  >
                    Schedule a Consultation
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="preview-panel" ref={previewRef}>
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText.replace(/\n/g, '<br>') }}
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
        
        {/* Consultation button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (window.Calendly) {
              window.Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'});
            }
          }}
          className="nav-button consult-button"
        >
          <Icon name="phone-call" style={{marginRight: "0.25rem"}} />
          Consultation
        </button>
        
        {/* Copy to clipboard button */}
        <button
          onClick={copyToClipboard}
          className="nav-button copy-button"
        >
          <Icon name="copy" style={{marginRight: "0.25rem"}} />
          Copy
        </button>
        
        {/* Download MS Word button */}
        <button
          onClick={downloadAsWord}
          className="nav-button download-button"
        >
          <Icon name="file-text" style={{marginRight: "0.25rem"}} />
          Download Word
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
  );
};

// Render the App component
ReactDOM.render(<App />, document.getElementById('root'));
