// AI Training Data License Agreement Generator
const { useState, useEffect, useRef } = React;

// Icon component
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props} className={`icon ${props.className || ''}`}></i>
  );
};

// Main Application Component
const App = () => {
  // Tab configuration
  const tabs = [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'license-terms', label: 'License Terms' },
    { id: 'data-usage', label: 'Data Usage' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'warranties', label: 'Warranties' },
    { id: 'finalization', label: 'Finalization' }
  ];

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // Form data state with defaults
  const [formData, setFormData] = useState({
    // Tab 1: Basic Info
    licensorName: 'ABC Data Corp',
    licensorEntity: 'Corporation',
    licensorAddress: '123 Data Street, San Francisco',
    licensorState: 'California',
    licenseeCompany: 'XYZ AI Solutions',
    licenseeEntity: 'Corporation',
    licenseeAddress: '456 Tech Avenue, Seattle',
    licenseeState: 'Washington',
    effectiveDate: '',
    
    // Tab 2: License Terms
    licenseType: 'non-exclusive',
    sublicensing: 'not-permitted',
    dataTypes: {
      text: true,
      images: true,
      audio: false,
      video: false,
      userGenerated: true,
      proprietaryContent: false
    },
    
    // Tab 3: Data Usage
    purposeRestrictions: 'specific-models',
    modelTypes: {
      generativeText: true,
      generativeImage: false,
      classTrain: false,
      dataAnalytics: false,
      customizedSpecific: false
    },
    ownershipModels: 'licensee-owns',
    attributionRequired: 'no',
    
    // Tab 4: Compensation
    compensationType: 'one-time',
    initialFee: '50000',
    royaltyPercent: '5',
    minimumGuarantee: '10000',
    term: '3',
    termUnit: 'years',
    terminationRights: 'both-parties',
    
    // Tab 5: Warranties
    licensorWarranty: 'limited',
    rightsToClaim: 'all-necessary-rights',
    dataComplianceWarranty: true,
    indemnification: 'mutual',
    liabilityLimit: 'fees-paid',
    
    // Document options
    fileName: 'AI-Training-Data-License-Agreement',
    documentTitle: 'AI Training Data License Agreement'
  });
  
  // State for tracking last changed field
  const [lastChanged, setLastChanged] = useState(null);
  
  // State for document text
  const [documentText, setDocumentText] = useState('');
  
  // Reference for preview div
  const previewRef = useRef(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
  
  // Copy document text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText)
      .then(() => {
        alert('Document copied to clipboard successfully!');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy to clipboard. Please try again or use the download option.');
      });
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      if (window.generateWordDoc) {
        window.generateWordDoc(documentText, {
          documentTitle: formData.documentTitle,
          fileName: formData.fileName
        });
      } else {
        alert("Word document generator is not available.");
      }
    } catch (error) {
      console.error('Error downloading Word document:', error);
      alert('Error generating Word document. Please try again or use the copy option.');
    }
  };
  
  // Open Calendly widget
  const openCalendly = () => {
    window.open("https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1", "_blank");
  };

  // Generate document text whenever form data changes
  useEffect(() => {
    const formatDate = (dateString) => {
      if (!dateString) return new Date().toLocaleDateString('en-US');
      return new Date(dateString).toLocaleDateString('en-US');
    };
    
    // Helper function to format lists
    const formatList = (items, conjunction = 'and') => {
      const filtered = Object.entries(items)
        .filter(([, isSelected]) => isSelected)
        .map(([key]) => {
          return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        });
      
      if (filtered.length === 0) return 'None';
      if (filtered.length === 1) return filtered[0];
      
      return filtered.slice(0, -1).join(', ') + ` ${conjunction} ` + filtered.slice(-1);
    };
    
    // Generate basic agreement text
    let text = `AI TRAINING DATA LICENSE AGREEMENT\n\n`;
    text += `This AI Training Data License Agreement is entered into by ${formData.licensorName} and ${formData.licenseeCompany}.\n\n`;
    text += `1. DEFINITIONS\n\n`;
    text += `1.1 "Data" means the information, materials, text, images, or other content provided by Licensor to Licensee under this Agreement, specifically including ${formatList(formData.dataTypes)}.\n\n`;
    text += `1.2 "AI System" means any machine learning model, neural network, or artificial intelligence algorithm developed using the Data.\n\n`;
    text += `2. LICENSE GRANT\n\n`;
    text += `2.1 Licensor grants to Licensee a ${formData.licenseType} license to use the Data for AI training purposes.\n\n`;
    
    // Additional sections based on form selections
    if (formData.compensationType === 'one-time') {
      text += `5.1 License Fee: Licensee shall pay Licensor a one-time fee of $${formData.initialFee}.\n\n`;
    } else if (formData.compensationType === 'royalty') {
      text += `5.1 Royalty: Licensee shall pay Licensor a royalty of ${formData.royaltyPercent}% of the revenue from AI systems trained with the Data.\n\n`;
    }
    
    text += `Term: ${formData.term} ${formData.termUnit}.\n\n`;
    
    setDocumentText(text);
  }, [formData]);
  
  // Create highlighted version of document text
  const highlightedText = documentText.replace(new RegExp(lastChanged, 'g'), match => 
    `<span class="highlighted-text">${match}</span>`
  );
  
  // Assess risks based on form data
  const assessRisks = () => {
    const risks = [
      {
        level: 'low',
        title: 'Sample Risk Assessment',
        description: 'This is a sample risk assessment.',
        recommendation: 'Review the agreement with legal counsel before signing.'
      }
    ];
    return risks;
  };
  
  // Render tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Info
        return (
          <>
            <h2>Parties & Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licensorName">Licensor Name:</label>
                <input
                  type="text"
                  id="licensorName"
                  name="licensorName"
                  className="form-control"
                  value={formData.licensorName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="licenseeCompany">Licensee Name:</label>
                <input
                  type="text"
                  id="licenseeCompany"
                  name="licenseeCompany" 
                  className="form-control"
                  value={formData.licenseeCompany}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="effectiveDate">Effective Date:</label>
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
          </>
        );
        
      case 1: // License Terms
        return (
          <>
            <h2>License Terms</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licenseType">License Type:</label>
                <select
                  id="licenseType"
                  name="licenseType"
                  className="form-control"
                  value={formData.licenseType}
                  onChange={handleChange}
                >
                  <option value="non-exclusive">Non-Exclusive</option>
                  <option value="exclusive">Exclusive</option>
                  <option value="sole">Sole</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data Types Included:</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.text"
                    name="dataTypes.text"
                    checked={formData.dataTypes.text}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.text">Text</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.images"
                    name="dataTypes.images"
                    checked={formData.dataTypes.images}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.images">Images</label>
                </div>
              </div>
            </div>
          </>
        );
        
      case 2: // Data Usage
        return <h2>Data Usage & Restrictions</h2>;
      case 3: // Compensation
        return (
          <>
            <h2>Compensation & Term</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="compensationType">Compensation Structure:</label>
                <select
                  id="compensationType"
                  name="compensationType"
                  className="form-control"
                  value={formData.compensationType}
                  onChange={handleChange}
                >
                  <option value="one-time">One-Time Fee</option>
                  <option value="royalty">Royalty-Based</option>
                  <option value="hybrid">Hybrid (Initial Fee + Royalty)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="initialFee">Initial Fee (USD):</label>
                <input
                  type="text"
                  id="initialFee"
                  name="initialFee"
                  className="form-control"
                  value={formData.initialFee}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="term">Term Duration:</label>
                <input
                  type="number"
                  id="term"
                  name="term"
                  className="form-control"
                  value={formData.term}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>
          </>
        );
      case 4: // Warranties
        return <h2>Warranties & Representations</h2>;
      case 5: // Finalization
        return (
          <>
            <h2>Risk Assessment & Finalization</h2>
            <div className="risk-assessment">
              <h3>Risk Assessment</h3>
              {assessRisks().map((risk, index) => (
                <div key={index} className={`risk-item risk-${risk.level}`}>
                  <h3>{risk.title}</h3>
                  <p>{risk.description}</p>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return <div>Unknown tab</div>;
    }
  };
  
  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>AI Training Data License Agreement Generator</h1>
        <p>Create a customized agreement for licensing data for AI model training purposes.</p>
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
      
      <div className="main-content">
        <div className="form-panel">
          {renderTabContent()}
        </div>
        
        <div className="preview-panel" ref={previewRef}>
          <h2>Live Preview</h2>
          <pre 
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
      
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
          <Icon name="copy" /> Copy
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
          <Icon name="file-text" /> Download
        </button>
        
        <button
          onClick={openCalendly}
          className="nav-button"
          style={{
            backgroundColor: "#e11d48", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="calendar" /> Consult
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
  );
};

// Render the application
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<App />, document.getElementById('root'));
});