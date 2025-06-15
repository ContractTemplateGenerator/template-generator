const { useState, useRef, useEffect } = React;

const AITermsGenerator = () => {
  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    websiteURL: '',
    contactEmail: '',
    jurisdiction: 'California',
    
    // AI Platform Details
    platformName: '',
    platformType: 'chatbot',
    dataCollection: true,
    userContent: true,
    commercialUse: false,
    
    // Terms Configuration
    minAge: '18',
    termination: 'immediate',
    governing_law: 'California'
  });

  // Ref for preview scrolling
  const previewRef = useRef(null);

  // Tab configuration
  const tabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'platform', label: 'AI Platform' },
    { id: 'terms', label: 'Terms Config' }
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

  // Generate document text
  const generateDocument = () => {
    return `TERMS OF USE FOR ${formData.platformName || '[PLATFORM NAME]'}

Last Updated: ${new Date().toLocaleDateString()}

ACCEPTANCE OF TERMS

These Terms of Use ("Terms") govern your use of ${formData.platformName || '[PLATFORM NAME]'}, an artificial intelligence platform (the "Service") operated by ${formData.companyName || '[COMPANY NAME]'} ("Company," "we," "us," or "our").

By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.

1. DESCRIPTION OF SERVICE

${formData.platformName || '[PLATFORM NAME]'} is an AI-powered ${formData.platformType} platform that provides users with artificial intelligence capabilities. The Service allows users to interact with AI models and receive automated responses.

2. USER ELIGIBILITY

You must be at least ${formData.minAge} years old to use this Service. By using the Service, you represent that you meet this age requirement.

3. USER CONTENT AND DATA

${formData.userContent ? 
`You retain ownership of any content you submit to the Service ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content solely for the purpose of providing the Service.` : 
`You retain full ownership and control over any content you submit to the Service.`}

${formData.dataCollection ? 
`We may collect and process data about your interactions with the Service to improve functionality and user experience, subject to our Privacy Policy.` : 
`We do not collect personal data about your interactions with the Service beyond what is necessary for basic functionality.`}

4. ACCEPTABLE USE

You agree not to:
- Use the Service for any illegal or unauthorized purpose
- Attempt to gain unauthorized access to the Service or its systems
- Upload or transmit any harmful, offensive, or inappropriate content
- Use the Service to generate content that violates third-party rights
${formData.commercialUse ? '' : '- Use the Service for commercial purposes without explicit permission'}

5. INTELLECTUAL PROPERTY

The Service and its underlying technology, including AI models and algorithms, are the intellectual property of ${formData.companyName || '[COMPANY NAME]'} and its licensors.

6. LIMITATION OF LIABILITY

TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${(formData.companyName || '[COMPANY NAME]').toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.

7. TERMINATION

We may terminate or suspend your access to the Service ${formData.termination === 'immediate' ? 'immediately' : 'with prior notice'} if you violate these Terms.

8. GOVERNING LAW

These Terms shall be governed by and construed in accordance with the laws of the State of ${formData.governing_law}, without regard to its conflict of law principles.

9. CONTACT INFORMATION

If you have any questions about these Terms, please contact us at ${formData.contactEmail || '[CONTACT EMAIL]'}.

For more information about ${formData.companyName || '[COMPANY NAME]'}, visit ${formData.websiteURL || '[WEBSITE URL]'}.`;
  };

  // Get current document text
  const documentText = generateDocument();

  // Determine which section to highlight
  const getSectionToHighlight = () => {
    switch (currentTab) {
      case 0: // Company Info
        if (['companyName', 'websiteURL', 'contactEmail', 'jurisdiction'].includes(lastChanged)) {
          return 'company';
        }
        break;
      case 1: // Platform
        if (['platformName', 'platformType', 'dataCollection', 'userContent', 'commercialUse'].includes(lastChanged)) {
          return 'platform';
        }
        break;
      case 2: // Terms
        if (['minAge', 'termination', 'governing_law'].includes(lastChanged)) {
          return 'terms';
        }
        break;
    }
    return null;
  };

  // Create highlighted text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    let highlightedText = documentText;
    
    // Highlight different sections based on what changed
    if (sectionToHighlight === 'company' && lastChanged === 'companyName') {
      highlightedText = highlightedText.replace(
        new RegExp(`${formData.companyName || '\\[COMPANY NAME\\]'}`, 'g'),
        `<span class="highlighted-text">${formData.companyName || '[COMPANY NAME]'}</span>`
      );
    } else if (sectionToHighlight === 'platform' && lastChanged === 'platformName') {
      highlightedText = highlightedText.replace(
        new RegExp(`${formData.platformName || '\\[PLATFORM NAME\\]'}`, 'g'),
        `<span class="highlighted-text">${formData.platformName || '[PLATFORM NAME]'}</span>`
      );
    } else if (sectionToHighlight === 'terms' && lastChanged === 'minAge') {
      highlightedText = highlightedText.replace(
        new RegExp(`${formData.minAge}`, 'g'),
        `<span class="highlighted-text">${formData.minAge}</span>`
      );
    }
    
    return highlightedText;
  };

  // Get highlighted text
  const highlightedText = createHighlightedText();

  // Scroll to highlighted text
  useEffect(() => {
    if (previewRef.current && lastChanged) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

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

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText).then(() => {
      alert('Terms of Use copied to clipboard!');
    });
  };

  // Download as Word
  const downloadAsWord = () => {
    try {
      window.generateWordDoc(documentText, {
        documentTitle: "AI Platform Terms of Use",
        fileName: `${formData.platformName || 'AI-Platform'}-Terms-of-Use`
      });
    } catch (error) {
      console.error("Error downloading Word document:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>AI Platform Terms of Use Generator</h1>
        <p>Generate comprehensive terms of use for your AI platform or service</p>
      </div>

      <div className="main-content">
        {/* Form Panel */}
        <div className="form-panel">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`tab-button ${currentTab === index ? 'active' : ''}`}
                onClick={() => setCurrentTab(index)}
              >
                {index + 1}. {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="form-content">
            {currentTab === 0 && (
              <div>
                <h3>Company Information</h3>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Website URL</label>
                    <input
                      type="url"
                      name="websiteURL"
                      value={formData.websiteURL}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="contact@yourcompany.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Jurisdiction</label>
                  <select
                    name="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={handleChange}
                  >
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Delaware">Delaware</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
              </div>
            )}

            {currentTab === 1 && (
              <div>
                <h3>AI Platform Details</h3>
                <div className="form-group">
                  <label>Platform Name *</label>
                  <input
                    type="text"
                    name="platformName"
                    value={formData.platformName}
                    onChange={handleChange}
                    placeholder="Enter your AI platform name"
                  />
                </div>
                <div className="form-group">
                  <label>Platform Type</label>
                  <select
                    name="platformType"
                    value={formData.platformType}
                    onChange={handleChange}
                  >
                    <option value="chatbot">AI Chatbot</option>
                    <option value="content generator">Content Generator</option>
                    <option value="image generator">Image Generator</option>
                    <option value="analytics platform">Analytics Platform</option>
                    <option value="recommendation engine">Recommendation Engine</option>
                  </select>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="dataCollection"
                    checked={formData.dataCollection}
                    onChange={handleChange}
                  />
                  <label>Platform collects user interaction data</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="userContent"
                    checked={formData.userContent}
                    onChange={handleChange}
                  />
                  <label>Users can submit content to the platform</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="commercialUse"
                    checked={formData.commercialUse}
                    onChange={handleChange}
                  />
                  <label>Allow commercial use of platform outputs</label>
                </div>
              </div>
            )}

            {currentTab === 2 && (
              <div>
                <h3>Terms Configuration</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Minimum Age Requirement</label>
                    <select
                      name="minAge"
                      value={formData.minAge}
                      onChange={handleChange}
                    >
                      <option value="13">13 years</option>
                      <option value="16">16 years</option>
                      <option value="18">18 years</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account Termination</label>
                    <select
                      name="termination"
                      value={formData.termination}
                      onChange={handleChange}
                    >
                      <option value="immediate">Immediate termination</option>
                      <option value="notice">With prior notice</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Governing Law</label>
                  <select
                    name="governing_law"
                    value={formData.governing_law}
                    onChange={handleChange}
                  >
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Delaware">Delaware</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <i data-feather="chevron-left"></i>
              Previous
            </button>
            
            <button onClick={copyToClipboard} className="nav-button primary">
              <i data-feather="copy"></i>
              Copy
            </button>
            
            <button onClick={downloadAsWord} className="nav-button">
              <i data-feather="download"></i>
              Download
            </button>
            
            <button onClick={nextTab} className="nav-button">
              Next
              <i data-feather="chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-header">
            <h2>Live Preview</h2>
          </div>
          <div className="preview-content" ref={previewRef}>
            <div 
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
ReactDOM.render(<AITermsGenerator />, document.getElementById('root'));