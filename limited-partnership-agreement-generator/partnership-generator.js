const { useState, useEffect, useRef } = React;

const PartnershipGenerator = () => {
  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const [formData, setFormData] = useState({
    partnershipName: '',
    stateOfFormation: 'Delaware',
    agreementDate: '',
    ein: '',
    principalPlaceOfBusiness: '',
    generalPartnerName: '',
    generalPartnerPercentage: 75,
    limitedPartner1Name: '',
    limitedPartner1Percentage: 20,
    limitedPartner2Name: '',
    limitedPartner2Percentage: 5,
    additionalProvisions: ''
  });

  // US States array
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const previewRef = useRef(null);

  // Calculate total percentage
  const totalPercentage = formData.generalPartnerPercentage + 
                         formData.limitedPartner1Percentage + 
                         formData.limitedPartner2Percentage;

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Percentage') ? parseFloat(value) || 0 : value
    }));
  };
  // Generate document text
  const generateDocumentText = () => {
    const currentDate = formData.agreementDate || new Date().toLocaleDateString();
    
    return `**[PARTNERSHIP AGREEMENT OF ${formData.partnershipName.toUpperCase()}]{.underline}**

This Partnership Agreement (the "Agreement") is made and entered into as of ${currentDate}, by and among the undersigned partners of ${formData.partnershipName.toUpperCase()}, a ${formData.stateOfFormation} Limited Partnership (the "Partnership").

**Article I: Formation**

The Partnership is formed as a Limited Partnership under the laws of the State of ${formData.stateOfFormation}.

The Partnership's principal place of business shall be ${formData.principalPlaceOfBusiness || 'within the United States of America'}.

**Article II: Partnership EIN and Partners**

The Employer Identification Number (EIN) of the Partnership is ${formData.ein || '[TO BE DETERMINED]'}.

The Partners of the Partnership are as follows, each with their respective percentage interests:

- General Partner: ${formData.generalPartnerName || '[GENERAL PARTNER NAME]'} - ${formData.generalPartnerPercentage}%

- Limited Partner: ${formData.limitedPartner1Name || '[LIMITED PARTNER 1 NAME]'} - ${formData.limitedPartner1Percentage}%

- Limited Partner: ${formData.limitedPartner2Name || '[LIMITED PARTNER 2 NAME]'} - ${formData.limitedPartner2Percentage}%

**Article III: Business Purpose**

The purpose of the Partnership is to engage in any lawful business activity for which limited partnerships may be formed under ${formData.stateOfFormation} law.

**Article IV: Profit and Loss Allocation**

Profits and losses shall be allocated among the Partners in proportion to their respective percentage interests.

**Article V: Management and Voting**

The general partner, ${formData.generalPartnerName || '[GENERAL PARTNER NAME]'}, shall manage the business and affairs of the Partnership.

Decisions requiring Partner approval shall be made by a vote, with each Partner having voting rights proportional to their percentage interests.

**Article VI: Term**

The Partnership shall continue until dissolved.

**Article VII: Amendments**

This Agreement may be amended only with a majority vote according to the percentage interest of the Partners.

**Article VIII: Miscellaneous**

**Severability.** Should any part of this Agreement be rendered or declared invalid by a court of competent jurisdiction, such invalidation of such part or portion of this Agreement shall not invalidate the remaining portions, and they shall remain in full force and effect.

**Waiver.** The waiver by any Partner of a breach of any provision of this Agreement shall not operate or be construed as a waiver of any subsequent breach.

**Governing Law.** This Agreement and the rights of the Partners hereunder shall be governed by and interpreted according to the laws of the State of ${formData.stateOfFormation}.

**Binding Effect.** The provisions of this Agreement shall be binding upon and inure to the benefit of the heirs, personal representatives, successors, and assigns of the Partners.

**Amendments.** This Agreement may be amended only by a written agreement signed by all Partners.

**Assignment.** No Partner may assign any rights or obligations under this Agreement without the prior written consent of the other Partners.

**Counterparts.** This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.

${formData.additionalProvisions ? `**Additional Provisions**\n\n${formData.additionalProvisions}\n\n` : ''}IN WITNESS WHEREOF, the undersigned have executed this Partnership Agreement as of the date first above written.

[Signatures of All Partners]


${formData.generalPartnerName || '[GENERAL PARTNER NAME]'}          ${formData.limitedPartner1Name || '[LIMITED PARTNER 1 NAME]'}


${formData.limitedPartner2Name || '[LIMITED PARTNER 2 NAME]'}`;
  };

  const documentText = generateDocumentText();

  // Get section to highlight based on current tab and last changed field
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    switch (currentTab) {
      case 0: // Basic Information
        if (['partnershipName', 'stateOfFormation', 'agreementDate'].includes(lastChanged)) {
          return 'header';
        }
        break;
      case 1: // Partnership Details
        if (['ein', 'principalPlaceOfBusiness'].includes(lastChanged)) {
          return 'article2';
        }
        break;
      case 2: // Partners
        if (lastChanged.includes('Partner')) {
          return 'partners';
        }
        break;
      case 3: // Additional Provisions
        if (lastChanged === 'additionalProvisions') {
          return 'additional';
        }
        break;
    }
    return null;
  };

  // Create highlighted text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    const sections = {
      header: /(\*\*\[PARTNERSHIP AGREEMENT OF .*?\]\{\.underline\}\*\*.*?(?=\*\*Article I:))/s,
      article2: /(\*\*Article II: Partnership EIN and Partners\*\*.*?(?=\*\*Article III:))/s,
      partners: /(- General Partner:.*?- Limited Partner:.*?- Limited Partner:.*?\n)/s,
      additional: /(\*\*Additional Provisions\*\*.*?(?=IN WITNESS WHEREOF))/s
    };
    
    if (sections[sectionToHighlight]) {
      return documentText.replace(sections[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };

  const highlightedText = createHighlightedText();
  // Navigation functions
  const nextTab = () => {
    if (currentTab < 4) setCurrentTab(currentTab + 1);
  };

  const prevTab = () => {
    if (currentTab > 0) setCurrentTab(currentTab - 1);
  };

  const goToTab = (index) => {
    setCurrentTab(index);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      alert('Document copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  // Download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      window.generateWordDoc(documentText, {
        documentTitle: `Partnership Agreement - ${formData.partnershipName}`,
        fileName: `Partnership-Agreement-${formData.partnershipName.replace(/\s+/g, '-')}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
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
  }, [highlightedText]);

  // Tab definitions
  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'details', label: 'Partnership Details' },
    { id: 'partners', label: 'Partners' },
    { id: 'additional', label: 'Additional Provisions' },
    { id: 'review', label: 'Review & Generate' }
  ];
  // Render content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Information
        return (
          <div className="form-section">
            <h2>Basic Partnership Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="partnershipName">Partnership Name</label>
                <input
                  type="text"
                  id="partnershipName"
                  name="partnershipName"
                  value={formData.partnershipName}
                  onChange={handleChange}
                  placeholder="Enter the full legal name of the partnership"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="stateOfFormation">State of Formation</label>
                <select
                  id="stateOfFormation"
                  name="stateOfFormation"
                  value={formData.stateOfFormation}
                  onChange={handleChange}
                >
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="form-group half-width">
                <label htmlFor="agreementDate">Agreement Date</label>
                <input
                  type="date"
                  id="agreementDate"
                  name="agreementDate"
                  value={formData.agreementDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 1: // Partnership Details
        return (
          <div className="form-section">
            <h2>Partnership Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ein">Employer Identification Number (EIN)</label>
                <input
                  type="text"
                  id="ein"
                  name="ein"
                  value={formData.ein}
                  onChange={handleChange}
                  placeholder="XX-XXXXXXX (optional - can be added later)"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="principalPlaceOfBusiness">Principal Place of Business</label>
                <input
                  type="text"
                  id="principalPlaceOfBusiness"
                  name="principalPlaceOfBusiness"
                  value={formData.principalPlaceOfBusiness}
                  onChange={handleChange}
                  placeholder="Enter the main business address or location"
                />
              </div>
            </div>
          </div>
        );
      case 2: // Partners
        return (
          <div className="form-section">
            <h2>Partner Information</h2>
            
            {totalPercentage !== 100 && (
              <div className="percentage-warning">
                <i data-feather="alert-triangle"></i>
                Warning: Partnership percentages must total 100%. Current total: {totalPercentage}%
              </div>
            )}
            
            <div className="partner-section">
              <h3>General Partner</h3>
              <div className="form-row">
                <div className="form-group three-quarter-width">
                  <label htmlFor="generalPartnerName">General Partner Name</label>
                  <input
                    type="text"
                    id="generalPartnerName"
                    name="generalPartnerName"
                    value={formData.generalPartnerName}
                    onChange={handleChange}
                    placeholder="Enter general partner name"
                  />
                </div>
                <div className="form-group quarter-width">
                  <label htmlFor="generalPartnerPercentage">Percentage (%)</label>
                  <input
                    type="number"
                    id="generalPartnerPercentage"
                    name="generalPartnerPercentage"
                    value={formData.generalPartnerPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="partner-section">
              <h3>Limited Partners</h3>
              <div className="form-row">
                <div className="form-group three-quarter-width">
                  <label htmlFor="limitedPartner1Name">Limited Partner 1 Name</label>
                  <input
                    type="text"
                    id="limitedPartner1Name"
                    name="limitedPartner1Name"
                    value={formData.limitedPartner1Name}
                    onChange={handleChange}
                    placeholder="Enter first limited partner name"
                  />
                </div>
                <div className="form-group quarter-width">
                  <label htmlFor="limitedPartner1Percentage">Percentage (%)</label>
                  <input
                    type="number"
                    id="limitedPartner1Percentage"
                    name="limitedPartner1Percentage"
                    value={formData.limitedPartner1Percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group three-quarter-width">
                  <label htmlFor="limitedPartner2Name">Limited Partner 2 Name</label>
                  <input
                    type="text"
                    id="limitedPartner2Name"
                    name="limitedPartner2Name"
                    value={formData.limitedPartner2Name}
                    onChange={handleChange}
                    placeholder="Enter second limited partner name"
                  />
                </div>
                <div className="form-group quarter-width">
                  <label htmlFor="limitedPartner2Percentage">Percentage (%)</label>
                  <input
                    type="number"
                    id="limitedPartner2Percentage"
                    name="limitedPartner2Percentage"
                    value={formData.limitedPartner2Percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Additional Provisions
        return (
          <div className="form-section">
            <h2>Additional Provisions</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="additionalProvisions">Additional Clauses (Optional)</label>
                <textarea
                  id="additionalProvisions"
                  name="additionalProvisions"
                  value={formData.additionalProvisions}
                  onChange={handleChange}
                  placeholder="Enter any additional provisions, clauses, or specific terms you want to include in the partnership agreement"
                  rows="8"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Review & Generate
        return (
          <div className="form-section">
            <h2>Review & Generate Agreement</h2>
            <div className="review-section">
              <h3>Partnership Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Partnership Name:</span>
                  <span className="summary-value">{formData.partnershipName || 'Not specified'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">State:</span>
                  <span className="summary-value">{formData.stateOfFormation}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Date:</span>
                  <span className="summary-value">{formData.agreementDate || 'Not specified'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">EIN:</span>
                  <span className="summary-value">{formData.ein || 'To be determined'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">General Partner:</span>
                  <span className="summary-value">{formData.generalPartnerName || 'Not specified'} ({formData.generalPartnerPercentage}%)</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Limited Partner 1:</span>
                  <span className="summary-value">{formData.limitedPartner1Name || 'Not specified'} ({formData.limitedPartner1Percentage}%)</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Limited Partner 2:</span>
                  <span className="summary-value">{formData.limitedPartner2Name || 'Not specified'} ({formData.limitedPartner2Percentage}%)</span>
                </div>
              </div>
              
              {totalPercentage !== 100 && (
                <div className="risk-alert high-risk">
                  <h4><i data-feather="alert-circle"></i> High Risk</h4>
                  <p>Partnership percentages must total exactly 100%. Current total: {totalPercentage}%. Please adjust the percentages before generating the final document.</p>
                </div>
              )}
              
              {(!formData.partnershipName || !formData.generalPartnerName) && (
                <div className="risk-alert medium-risk">
                  <h4><i data-feather="alert-triangle"></i> Medium Risk</h4>
                  <p>Essential information is missing. Partnership name and general partner name are required for a valid agreement.</p>
                </div>
              )}
              
              {totalPercentage === 100 && formData.partnershipName && formData.generalPartnerName && (
                <div className="risk-alert low-risk">
                  <h4><i data-feather="check-circle"></i> Ready to Generate</h4>
                  <p>All essential information is complete. Your partnership agreement is ready to generate.</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  // Main render
  return (
    <div className="generator-container">
      <div className="header">
        <h1>Limited Partnership Agreement Generator</h1>
        <p>Create a professional limited partnership agreement tailored to your business needs</p>
      </div>

      <div className="content-wrapper">
        <div className="form-panel">
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

          {/* Tab Content */}
          <div className="tab-content">
            {renderTabContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <i data-feather="chevron-left"></i>
              Previous
            </button>
            
            <button
              onClick={copyToClipboard}
              className="nav-button copy-button"
            >
              <i data-feather="copy"></i>
              Copy
            </button>
            
            <button
              onClick={downloadAsWord}
              className="nav-button download-button"
            >
              <i data-feather="download"></i>
              Download
            </button>
            
            <button
              onClick={() => {
                window.Calendly.initPopupWidget({
                  url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
                });
              }}
              className="nav-button consult-button"
            >
              <i data-feather="calendar"></i>
              Consult
            </button>
            
            <button
              onClick={nextTab}
              className={`nav-button next-button ${currentTab === 4 ? 'disabled' : ''}`}
              disabled={currentTab === 4}
            >
              Next
              <i data-feather="chevron-right"></i>
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

// Render the component
ReactDOM.render(<PartnershipGenerator />, document.getElementById('root'));