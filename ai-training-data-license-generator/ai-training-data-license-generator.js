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
    { id: 'data-description', label: 'Data Description' },
    { id: 'license-terms', label: 'License Terms' },
    { id: 'data-usage', label: 'Data Usage' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'warranties', label: 'Warranties' },
    { id: 'finalization', label: 'Finalization' }
  ];

  // Default form data
  const defaultFormData = {
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
    
    // Tab 2: Data Description
    datasetName: 'Alpha Dataset',
    datasetDescription: 'Comprehensive collection of training data for AI models',
    dataOrigin: 'proprietary',
    dataAccessMethod: 'api',
    dataFormat: 'json',
    dataSizeGB: '50',
    dataUpdateFrequency: 'none',
    dataQualityWarranty: true,
    
    // Tab 3: License Terms
    licenseType: 'non-exclusive',
    sublicensing: 'not-permitted',
    geographicScope: 'worldwide',
    industryRestrictions: 'none',
    dataTypes: {
      text: true,
      images: true,
      audio: false,
      video: false,
      userGenerated: true,
      proprietaryContent: false,
      personalData: false,
      anonymizedData: true,
      structuredData: true,
      unstructuredData: false
    },
    
    // Tab 4: Data Usage
    purposeRestrictions: 'specific-models',
    modelTypes: {
      generativeText: true,
      generativeImage: false,
      generativeAudio: false,
      generativeVideo: false,
      classTrain: false,
      dataAnalytics: false,
      predictiveModels: false,
      customizedSpecific: false,
      languageModels: true,
      computerVision: false,
      sentimentAnalysis: false,
      recommendationSystems: false,
      naturalLanguageProcessing: true
    },
    usagePurposes: {
      research: true,
      commercial: true,
      internalUse: true,
      publicServices: false,
      militaryApplications: false,
      governmentSurveillance: false
    },
    ownershipModels: 'licensee-owns',
    attributionRequired: 'no',
    dataRetention: 'unlimited',
    
    // Tab 5: Compensation
    compensationType: 'one-time',
    initialFee: '50000',
    royaltyPercent: '5',
    minimumGuarantee: '10000',
    term: '3',
    termUnit: 'years',
    terminationRights: 'both-parties',
    renewalTerms: 'automatic',
    
    // Tab 6: Warranties
    licensorWarranty: 'limited',
    rightsToClaim: 'all-necessary-rights',
    dataComplianceWarranty: true,
    indemnification: 'mutual',
    liabilityLimit: 'fees-paid',
    disputeResolution: 'arbitration',
    governingLaw: '',
    
    // Document options
    fileName: 'AI-Training-Data-License-Agreement',
    documentTitle: 'AI Training Data License Agreement'
  };

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // Load form data from localStorage if available
  const loadSavedFormData = () => {
    // Direct DOM debug
    console.log("Attempting to load saved form data...");
    let savedData = null;
    try {
      const savedItem = localStorage.getItem('aiTrainingDataLicenseFormData');
      savedData = savedItem ? JSON.parse(savedItem) : null;
      console.log("Loaded data:", savedData ? "Found" : "Not found");
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    return savedData || defaultFormData;
  };
  
  // Form data state - This is the KEY part that needs to persist
  const [formData, setFormData] = useState(loadSavedFormData);
  
  // State for tracking last changed field
  const [lastChanged, setLastChanged] = useState(null);
  
  // State for document text
  const [documentText, setDocumentText] = useState('');
  
  // Reference for preview div
  const previewRef = useRef(null);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('aiTrainingDataLicenseFormData', JSON.stringify(formData));
      console.log("Form data saved to localStorage");
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [formData]);
  
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
  
  // Reset form to defaults
  const resetForm = () => {
    if (confirm('This will reset all form fields to default values. Continue?')) {
      setFormData(defaultFormData);
      localStorage.removeItem('aiTrainingDataLicenseFormData');
      alert("Form has been reset to default values");
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
      if (!items) return 'None';
      const filtered = Object.entries(items)
        .filter(([, isSelected]) => isSelected)
        .map(([key]) => {
          return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        });
      
      if (filtered.length === 0) return 'None';
      if (filtered.length === 1) return filtered[0];
      
      return filtered.slice(0, -1).join(', ') + ` ${conjunction} ` + filtered.slice(-1);
    };
    
    // Generate a simplified document for this example
    const generateSimpleDocument = () => {
      let text = `AI TRAINING DATA LICENSE AGREEMENT\n\n`;
      
      text += `This AI Training Data License Agreement is entered into as of ${formData.effectiveDate ? formatDate(formData.effectiveDate) : 'the Effective Date'} between:\n\n`;
      
      text += `${formData.licensorName || '[LICENSOR NAME]'}, a ${formData.licensorEntity?.toLowerCase() || 'corporation'} ("Licensor") and\n\n`;
      
      text += `${formData.licenseeCompany || '[LICENSEE NAME]'}, a ${formData.licenseeEntity?.toLowerCase() || 'corporation'} ("Licensee").\n\n`;
      
      text += `1. DEFINITIONS\n\n`;
      text += `1.1 "Data" means ${formData.datasetName || 'the dataset'}, which is ${formData.datasetDescription || 'a collection of data for AI training'} and includes ${formatList(formData.dataTypes)}.\n\n`;
      
      text += `2. LICENSE GRANT\n\n`;
      text += `2.1 Licensor grants Licensee a ${formData.licenseType || 'non-exclusive'} license to use the Data for training AI models.\n\n`;
      
      if (formData.modelTypes) {
        text += `3. PERMITTED USES\n\n`;
        text += `3.1 Licensee may use the Data to train the following model types: ${formatList(formData.modelTypes)}.\n\n`;
      }
      
      text += `4. COMPENSATION\n\n`;
      if (formData.compensationType === 'one-time') {
        text += `4.1 Licensee shall pay a one-time fee of $${formData.initialFee || '0'}.\n\n`;
      } else if (formData.compensationType === 'royalty') {
        text += `4.1 Licensee shall pay a royalty of ${formData.royaltyPercent || '0'}% of revenue.\n\n`;
      }
      
      text += `5. TERM\n\n`;
      text += `5.1 This Agreement shall last for ${formData.term || '1'} ${formData.termUnit || 'year(s)'}.\n\n`;
      
      text += `6. WARRANTIES\n\n`;
      text += `6.1 Licensor provides ${formData.licensorWarranty || 'limited'} warranties for the Data.\n\n`;
      
      text += `[Signature blocks for both parties]\n`;
      
      return text;
    };
    
    try {
      const docText = generateSimpleDocument();
      setDocumentText(docText);
    } catch (error) {
      console.error("Error generating document:", error);
      setDocumentText("Error generating document. Please check form values and try again.");
    }
    
  }, [formData]);
  
  // Render tab content based on current tab
  const renderTabContent = () => {
    // Common form groups and elements for reuse
    const FormGroup = ({ label, children }) => (
      <div className="form-group">
        <label>{label}</label>
        {children}
      </div>
    );
    
    const TextInput = ({ name, value, placeholder, onChange }) => (
      <input
        type="text"
        id={name}
        name={name}
        className="form-control"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
    
    const Checkbox = ({ name, label, checked, onChange }) => (
      <div className="checkbox-group">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={name}>{label}</label>
      </div>
    );
    
    const Select = ({ name, value, options, onChange }) => (
      <select
        id={name}
        name={name}
        className="form-control"
        value={value || ''}
        onChange={onChange}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
    
    const CheckboxGroup = ({ groupName, items }) => (
      <div className="checkbox-container">
        {items.map(item => (
          <Checkbox
            key={`${groupName}.${item.name}`}
            name={`${groupName}.${item.name}`}
            label={item.label}
            checked={formData[groupName]?.[item.name] || false}
            onChange={handleChange}
          />
        ))}
      </div>
    );
    
    // Render different content based on current tab
    switch (currentTab) {
      case 0: // Basic Info
        return (
          <>
            <h2>Parties & Basic Information</h2>
            
            <div className="form-row">
              <h3>Licensor (Data Owner)</h3>
              <FormGroup label="Licensor Name:">
                <TextInput
                  name="licensorName"
                  value={formData.licensorName}
                  placeholder="Company or entity providing the data"
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup label="Entity Type:">
                <Select
                  name="licensorEntity"
                  value={formData.licensorEntity}
                  options={[
                    { value: "Corporation", label: "Corporation" },
                    { value: "Limited Liability Company", label: "Limited Liability Company (LLC)" },
                    { value: "Partnership", label: "Partnership" },
                    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
                    { value: "Individual", label: "Individual" }
                  ]}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup label="Address:">
                <TextInput
                  name="licensorAddress"
                  value={formData.licensorAddress}
                  placeholder="Principal place of business"
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            
            <div className="form-row">
              <h3>Licensee (AI Developer)</h3>
              <FormGroup label="Licensee Name:">
                <TextInput
                  name="licenseeCompany"
                  value={formData.licenseeCompany}
                  placeholder="Company or entity using the data"
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup label="Entity Type:">
                <Select
                  name="licenseeEntity"
                  value={formData.licenseeEntity}
                  options={[
                    { value: "Corporation", label: "Corporation" },
                    { value: "Limited Liability Company", label: "Limited Liability Company (LLC)" },
                    { value: "Partnership", label: "Partnership" },
                    { value: "Sole Proprietorship", label: "Sole Proprietorship" }
                  ]}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup label="Address:">
                <TextInput
                  name="licenseeAddress"
                  value={formData.licenseeAddress}
                  placeholder="Principal place of business"
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            
            <div className="form-row">
              <FormGroup label="Effective Date:">
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  className="form-control"
                  value={formData.effectiveDate || ''}
                  onChange={handleChange}
                />
                <small>If left blank, the agreement will use a placeholder.</small>
              </FormGroup>
            </div>
          </>
        );
        
      case 1: // Data Description
        return (
          <>
            <h2>Data Description</h2>
            
            <div className="form-row">
              <FormGroup label="Dataset Name:">
                <TextInput
                  name="datasetName"
                  value={formData.datasetName}
                  placeholder="e.g., Alpha Training Dataset"
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup label="Dataset Description:">
                <textarea
                  id="datasetDescription"
                  name="datasetDescription"
                  className="form-control"
                  value={formData.datasetDescription || ''}
                  onChange={handleChange}
                  placeholder="Describe the data content and purpose"
                  rows="3"
                ></textarea>
              </FormGroup>
            </div>
            
            <div className="form-row">
              <h3>Types of Data Included:</h3>
              <CheckboxGroup 
                groupName="dataTypes"
                items={[
                  { name: "text", label: "Text" },
                  { name: "images", label: "Images" },
                  { name: "audio", label: "Audio" },
                  { name: "video", label: "Video" },
                  { name: "userGenerated", label: "User-Generated Content" },
                  { name: "proprietaryContent", label: "Proprietary Content" },
                  { name: "personalData", label: "Personal Data" },
                  { name: "anonymizedData", label: "Anonymized Data" },
                  { name: "structuredData", label: "Structured Data" },
                  { name: "unstructuredData", label: "Unstructured Data" }
                ]}
              />
            </div>
          </>
        );
        
      case 2: // License Terms
        return (
          <>
            <h2>License Terms</h2>
            
            <div className="form-row">
              <FormGroup label="License Type:">
                <Select
                  name="licenseType"
                  value={formData.licenseType}
                  options={[
                    { value: "non-exclusive", label: "Non-Exclusive (Licensor can license to others)" },
                    { value: "exclusive", label: "Exclusive (Only Licensee can use the data)" },
                    { value: "sole", label: "Sole (Licensor can use but not license to others)" }
                  ]}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup label="Sublicensing Rights:">
                <Select
                  name="sublicensing"
                  value={formData.sublicensing}
                  options={[
                    { value: "not-permitted", label: "Not Permitted" },
                    { value: "limited-permitted", label: "Limited (Contractors/Service Providers Only)" },
                    { value: "permitted", label: "Fully Permitted" }
                  ]}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
          </>
        );
        
      case 3: // Data Usage
        return (
          <>
            <h2>Data Usage & Permitted Models</h2>
            
            <div className="form-row">
              <FormGroup label="Allowed Model Types:">
                <CheckboxGroup 
                  groupName="modelTypes"
                  items={[
                    { name: "generativeText", label: "Generative Text Models" },
                    { name: "generativeImage", label: "Generative Image Models" },
                    { name: "languageModels", label: "Language Models" },
                    { name: "computerVision", label: "Computer Vision Models" },
                    { name: "naturalLanguageProcessing", label: "Natural Language Processing" }
                  ]}
                />
              </FormGroup>
            </div>
            
            <div className="form-row">
              <FormGroup label="Ownership of Resulting AI Models:">
                <Select
                  name="ownershipModels"
                  value={formData.ownershipModels}
                  options={[
                    { value: "licensee-owns", label: "Licensee Fully Owns" },
                    { value: "licensor-royalty", label: "Licensee Owns (with Licensor Royalty Rights)" },
                    { value: "joint-ownership", label: "Joint Ownership" }
                  ]}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
          </>
        );
        
      case 4: // Compensation
        return (
          <>
            <h2>Compensation & Term</h2>
            
            <div className="form-row">
              <FormGroup label="Compensation Structure:">
                <Select
                  name="compensationType"
                  value={formData.compensationType}
                  options={[
                    { value: "one-time", label: "One-Time Fee" },
                    { value: "royalty", label: "Royalty-Based" },
                    { value: "hybrid", label: "Hybrid (Initial Fee + Royalty)" }
                  ]}
                  onChange={handleChange}
                />
              </FormGroup>
              
              {(formData.compensationType === 'one-time' || formData.compensationType === 'hybrid') && (
                <FormGroup label="Initial Fee (USD):">
                  <TextInput
                    name="initialFee"
                    value={formData.initialFee}
                    placeholder="e.g., 50000"
                    onChange={handleChange}
                  />
                </FormGroup>
              )}
              
              {(formData.compensationType === 'royalty' || formData.compensationType === 'hybrid') && (
                <FormGroup label="Royalty Percentage (%):">
                  <TextInput
                    name="royaltyPercent"
                    value={formData.royaltyPercent}
                    placeholder="e.g., 5"
                    onChange={handleChange}
                  />
                </FormGroup>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group inline">
                <div>
                  <label htmlFor="term">Term Duration:</label>
                  <input
                    type="number"
                    id="term"
                    name="term"
                    className="form-control"
                    value={formData.term || ''}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <label htmlFor="termUnit">Unit:</label>
                  <Select
                    name="termUnit"
                    value={formData.termUnit}
                    options={[
                      { value: "years", label: "Years" },
                      { value: "months", label: "Months" }
                    ]}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </>
        );
        
      case 5: // Warranties
        return (
          <>
            <h2>Warranties & Representations</h2>
            
            <div className="form-row">
              <FormGroup label="Licensor Warranty Level:">
                <Select
                  name="licensorWarranty"
                  value={formData.licensorWarranty}
                  options={[
                    { value: "limited", label: "Limited Warranty" },
                    { value: "as-is", label: "As-Is (No Warranty)" }
                  ]}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataComplianceWarranty"
                    name="dataComplianceWarranty"
                    checked={formData.dataComplianceWarranty || false}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataComplianceWarranty">Include Data Compliance Warranty</label>
                </div>
                <small>Licensor warrants data was collected in compliance with laws.</small>
              </div>
            </div>
          </>
        );
        
      case 6: // Finalization
        return (
          <>
            <h2>Finalization & Download</h2>
            
            <div className="form-row">
              <FormGroup label="File Name:">
                <TextInput
                  name="fileName"
                  value={formData.fileName}
                  placeholder="File name for downloaded document"
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            
            <div className="form-row">
              <button
                onClick={resetForm}
                className="nav-button"
                style={{
                  backgroundColor: "#ef4444", 
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "auto"
                }}
              >
                <Icon name="refresh-cw" /> Reset Form
              </button>
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
          <pre className="document-preview">{documentText}</pre>
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
ReactDOM.render(<App />, document.getElementById('root'));