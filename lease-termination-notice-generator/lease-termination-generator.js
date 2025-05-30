const { useState, useEffect, useRef } = React;

const LeaseTerminationGenerator = () => {
  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const [noticeType, setNoticeType] = useState(''); // 'landlord' or 'tenant'
  const [showChatbox, setShowChatbox] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'assistant', text: 'Hi! I\'m your legal assistant for lease termination notices. I can help with notice periods, breach terms, landlord/tenant rights, and specific legal requirements. What questions do you have?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Common fields
    todayDate: new Date().toISOString().split('T')[0],
    landlordName: '',
    tenantName: '',
    propertyAddress: '',
    city: '',
    state: 'CA',
    zipCode: '',
    
    // Termination details
    terminationDate: '',
    noticeReason: '',
    customReason: '',
    breachTerms: [],
    moveOutDate: '',
    
    // Contact information
    contactMethod: 'email',
    contactInfo: '',
    
    // Additional details
    securityDeposit: '',
    forwardingAddress: '',
    additionalTerms: ''
  });

  const previewRef = useRef(null);

  // Tab configuration
  const tabs = [
    { id: 'type', label: 'Notice Type' },
    { id: 'parties', label: 'Parties & Property' },
    { id: 'termination', label: 'Termination Details' },
    { id: 'contact', label: 'Contact & Additional Terms' }
  ];
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear highlighting after 3 seconds
    setTimeout(() => setLastChanged(null), 3000);
  };

  // Handle array changes (for breach terms)
  const handleArrayChange = (name, value, checked) => {
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
    
    // Clear highlighting after 3 seconds
    setTimeout(() => setLastChanged(null), 3000);
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

  // Generate document text
  const generateDocumentText = () => {
    const { 
      todayDate, landlordName, tenantName, propertyAddress, city, state, zipCode,
      terminationDate, noticeReason, customReason, moveOutDate, contactMethod, contactInfo,
      securityDeposit, forwardingAddress, additionalTerms
    } = formData;

    const isLandlord = noticeType === 'landlord';
    const senderName = isLandlord ? landlordName : tenantName;
    const recipientName = isLandlord ? tenantName : landlordName;
    const senderRole = isLandlord ? 'Landlord' : 'Tenant';
    const recipientRole = isLandlord ? 'Tenant' : 'Landlord';
    
    const formatDate = (dateString) => {
      if (!dateString) return '[DATE]';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const fullAddress = `${propertyAddress || '[PROPERTY ADDRESS]'}, ${city || '[CITY]'}, ${state} ${zipCode || '[ZIP]'}`;
    
    let reasonText = '';
    if (noticeReason === 'end-of-lease') {
      reasonText = 'the lease term is expiring';
    } else if (noticeReason === 'month-to-month') {
      reasonText = 'termination of month-to-month tenancy';
    } else if (noticeReason === 'breach') {
      if (formData.breachTerms.length > 0) {
        reasonText = `breach of the following lease terms: ${formData.breachTerms.join(', ')}`;
      } else {
        reasonText = 'breach of lease terms';
      }
    } else if (noticeReason === 'custom') {
      reasonText = customReason || '[REASON]';
    } else {
      reasonText = '[REASON FOR TERMINATION]';
    }
    return `NOTICE TO ${recipientRole.toUpperCase()} OF TERMINATION OF TENANCY

Date: ${formatDate(todayDate)}

TO: ${recipientName || `[${recipientRole.toUpperCase()} NAME]`}
FROM: ${senderName || `[${senderRole.toUpperCase()} NAME]`}

TENANT(S) IN POSSESSION OF THE PREMISES:
${recipientRole === 'Tenant' ? (recipientName || '[TENANT NAME]') : (tenantName || '[TENANT NAME]')}

PREMISES LOCATION:
${fullAddress}

YOU ARE HEREBY NOTIFIED that your tenancy of the above-described premises is hereby terminated, and you are required to quit and surrender the said premises to the ${senderRole.toLowerCase()} on or before ${formatDate(terminationDate) || '[TERMINATION DATE]'}.

REASON FOR TERMINATION:
This notice is served upon you for the following reason(s): ${reasonText}

${moveOutDate && moveOutDate !== terminationDate ? `You must vacate the premises by ${formatDate(moveOutDate)}.` : ''}

${securityDeposit ? `SECURITY DEPOSIT: ${securityDeposit}` : ''}

${forwardingAddress ? `FORWARDING ADDRESS PROVIDED: ${forwardingAddress}` : 'Please provide a forwarding address for return of security deposit and final communications.'}

${additionalTerms ? `ADDITIONAL TERMS: ${additionalTerms}` : ''}

CONTACT INFORMATION:
For questions regarding this notice, please contact:
${contactMethod === 'email' ? 'Email: ' : contactMethod === 'phone' ? 'Phone: ' : 'Contact: '}${contactInfo || `[${contactMethod.toUpperCase()}]`}

If you fail to quit and surrender the premises as required by this notice, legal proceedings will be instituted against you to recover possession of said premises, damages, and costs.

DATED: ${formatDate(todayDate)}

${senderRole}: _________________________________
${senderName || `[${senderRole.toUpperCase()} SIGNATURE]`}

Print Name: ${senderName || `[${senderRole.toUpperCase()} PRINTED NAME]`}`;
  };
  const documentText = generateDocumentText();

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      alert('Document copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard. Please try selecting and copying manually.');
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
        documentTitle: `Lease Termination Notice - ${noticeType === 'landlord' ? 'From Landlord' : 'From Tenant'}`,
        fileName: `Lease-Termination-Notice-${noticeType || 'Document'}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Open consultation calendar
  const openConsultation = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
      });
    } else {
      window.open('https://terms.law/call/', '_blank');
    }
  };

  // Handle chatbox
  const toggleChatbox = () => {
    setShowChatbox(!showChatbox);
  };

  // Handle chatbox with Groq API
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isLoadingChat) return;
    
    const userMessage = { type: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoadingChat(true);
    
    // Clear input immediately
    const currentInput = chatInput;
    setChatInput('');
    
    try {
      // Prepare context data for the API
      const contextData = {
        message: currentInput,
        contractType: 'Lease Termination Notice',
        formData: {
          noticeType,
          ...formData,
          breachTermsCount: formData.breachTerms.length,
          hasBreachTerms: formData.breachTerms.length > 0
        },
        documentText: documentText.substring(0, 3000), // Limit for API
        conversationHistory: chatMessages.slice(-4), // Last 2 exchanges
        isFollowUpQuestion: chatMessages.length > 1
      };

      // Call the Groq API
      const response = await fetch('https://template.terms.law/api/lease-termination-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contextData)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = { 
        type: 'assistant', 
        text: data.response || 'I apologize, but I encountered an issue. Please try again or schedule a consultation for detailed legal advice.'
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback responses for common topics when API fails
      let fallbackResponse = "I'm having trouble connecting to my knowledge base right now. For immediate help, please schedule a consultation with Attorney Sergei Tokmakov.";
      
      const input = currentInput.toLowerCase();
      if (input.includes('notice period') || input.includes('how long')) {
        fallbackResponse = "**Notice Periods (General):** California typically requires 30 days notice for month-to-month tenancies, 3 days for non-payment of rent. Check your lease and local laws for specific requirements. For detailed advice, schedule a consultation.";
      } else if (input.includes('breach') || input.includes('violation')) {
        fallbackResponse = `**Breach Terms:** I see you're asking about ${noticeType === 'landlord' ? 'tenant' : 'landlord'} violations. The form includes common ${noticeType === 'landlord' ? 'tenant' : 'landlord'} breach terms. Select all that apply to your situation. For legal strategy, schedule a consultation.`;
      }
      
      const assistantMessage = { type: 'assistant', text: fallbackResponse };
      setChatMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };
  // Highlighting logic
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    switch (currentTab) {
      case 0: // Notice Type
        if (lastChanged === 'noticeType') return 'header';
        break;
      case 1: // Parties & Property
        if (['landlordName', 'tenantName'].includes(lastChanged)) return 'parties';
        if (['propertyAddress', 'city', 'state', 'zipCode'].includes(lastChanged)) return 'address';
        break;
      case 2: // Termination Details
        if (['terminationDate', 'moveOutDate'].includes(lastChanged)) return 'dates';
        if (['noticeReason', 'customReason', 'breachTerms'].includes(lastChanged)) return 'reason';
        break;
      case 3: // Contact & Additional
        if (['contactMethod', 'contactInfo'].includes(lastChanged)) return 'contact';
        if (['securityDeposit', 'forwardingAddress', 'additionalTerms'].includes(lastChanged)) return 'additional';
        break;
    }
    return null;
  };

  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    const sections = {
      header: /NOTICE TO .* OF TERMINATION OF TENANCY/,
      parties: /(TO:.*|FROM:.*|TENANT\(S\) IN POSSESSION.*)/,
      address: /PREMISES LOCATION:[\s\S]*?(?=\n\n)/,
      dates: /(terminated.*?on or before.*?|vacate the premises by.*?)/,
      reason: /REASON FOR TERMINATION:[\s\S]*?(?=\n\n)/,
      contact: /CONTACT INFORMATION:[\s\S]*?(?=\n\n)/,
      additional: /(SECURITY DEPOSIT:.*|Please provide.*forwarding address.*|ADDITIONAL TERMS:.*)/
    };
    
    if (sections[sectionToHighlight]) {
      return documentText.replace(sections[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };

  const highlightedText = createHighlightedText();

  // Scroll to highlighted content
  useEffect(() => {
    if (previewRef.current && lastChanged) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText, lastChanged]);

  // Replace feather icons when component mounts
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [currentTab]);
  // Render tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Notice Type
        return (
          <div className="form-content">
            <h3>Select Notice Type</h3>
            <div className="notice-type-selection">
              <div 
                className={`notice-type-card ${noticeType === 'landlord' ? 'selected' : ''}`}
                onClick={() => {setNoticeType('landlord'); setLastChanged('noticeType');}}
              >
                <h3>Landlord to Tenant</h3>
                <p>Landlord terminating tenant's lease</p>
              </div>
              <div 
                className={`notice-type-card ${noticeType === 'tenant' ? 'selected' : ''}`}
                onClick={() => {setNoticeType('tenant'); setLastChanged('noticeType');}}
              >
                <h3>Tenant to Landlord</h3>
                <p>Tenant giving notice to terminate lease</p>
              </div>
            </div>
            
            <div className="form-group">
              <label>Today's Date</label>
              <input
                type="date"
                name="todayDate"
                value={formData.todayDate}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      case 1: // Parties & Property
        return (
          <div className="form-content">
            <h3>Parties and Property Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Landlord Name</label>
                <input
                  type="text"
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleChange}
                  placeholder="Enter landlord's full name"
                />
              </div>
              <div className="form-group">
                <label>Tenant Name</label>
                <input
                  type="text"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleChange}
                  placeholder="Enter tenant's full name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Property Address</label>
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                placeholder="Enter property street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div className="form-group small">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleChange}>
                  <option value="CA">CA</option>
                  <option value="NY">NY</option>
                  <option value="TX">TX</option>
                  <option value="FL">FL</option>
                  <option value="IL">IL</option>
                  <option value="PA">PA</option>
                  <option value="OH">OH</option>
                  <option value="GA">GA</option>
                  <option value="NC">NC</option>
                  <option value="MI">MI</option>
                </select>
              </div>
              <div className="form-group small">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>
        );
      case 2: // Termination Details
        return (
          <div className="form-content">
            <h3>Termination Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Termination Date</label>
                <input
                  type="date"
                  name="terminationDate"
                  value={formData.terminationDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Move-Out Date (if different)</label>
                <input
                  type="date"
                  name="moveOutDate"
                  value={formData.moveOutDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Termination</label>
              <select name="noticeReason" value={formData.noticeReason} onChange={handleChange}>
                <option value="">Select reason</option>
                <option value="end-of-lease">End of lease term</option>
                <option value="month-to-month">Month-to-month termination</option>
                <option value="breach">Breach of lease terms</option>
                <option value="custom">Custom reason</option>
              </select>
            </div>

            {formData.noticeReason === 'breach' && (
              <div className="form-group">
                <label>Breach Details (Select all that apply)</label>
                <div className="checkbox-group">
                  {(noticeType === 'landlord' ? [
                    // Landlord-to-Tenant (Tenant Violations)
                    'Non-payment of rent',
                    'Unauthorized pets',
                    'Excessive noise/disturbance',
                    'Unauthorized occupants',
                    'Property damage',
                    'Illegal activity',
                    'Violation of no-smoking policy',
                    'Failure to maintain property cleanliness',
                    'Subletting without permission',
                    'Violation of parking rules',
                    'Disturbing other tenants'
                  ] : [
                    // Tenant-to-Landlord (Landlord Violations)
                    'Failure to maintain habitability',
                    'Failure to make necessary repairs',
                    'Illegal entry without proper notice',
                    'Harassment or intimidation',
                    'Failure to provide essential services',
                    'Violation of quiet enjoyment',
                    'Discrimination or retaliation',
                    'Failure to return security deposit',
                    'Breach of warranty of habitability',
                    'Failure to comply with local housing codes',
                    'Constructive eviction'
                  ]).map(term => (
                    <div key={term} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={term}
                        checked={formData.breachTerms.includes(term)}
                        onChange={(e) => handleArrayChange('breachTerms', term, e.target.checked)}
                      />
                      <label htmlFor={term}>{term}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.noticeReason === 'custom' && (
              <div className="form-group">
                <label>Custom Reason</label>
                <textarea
                  name="customReason"
                  value={formData.customReason}
                  onChange={handleChange}
                  placeholder="Enter custom reason for termination"
                  rows="3"
                />
              </div>
            )}
          </div>
        );

      case 3: // Contact & Additional Terms
        return (
          <div className="form-content">
            <h3>Contact Information & Additional Terms</h3>
            
            <div className="form-row">
              <div className="form-group medium">
                <label>Contact Method</label>
                <select name="contactMethod" value={formData.contactMethod} onChange={handleChange}>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="mail">Mail</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contact Information</label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder={`Enter ${formData.contactMethod} address`}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Security Deposit Information</label>
              <input
                type="text"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                placeholder="e.g., Security deposit of $1,500 will be returned per state law"
              />
            </div>

            <div className="form-group">
              <label>Forwarding Address (for tenant)</label>
              <input
                type="text"
                name="forwardingAddress"
                value={formData.forwardingAddress}
                onChange={handleChange}
                placeholder="Address where security deposit should be mailed"
              />
            </div>

            <div className="form-group">
              <label>Additional Terms</label>
              <textarea
                name="additionalTerms"
                value={formData.additionalTerms}
                onChange={handleChange}
                placeholder="Any additional terms or conditions"
                rows="3"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  // Main render
  return (
    <div className="container">
      <div className="header">
        <h1>Lease Termination Notice Generator</h1>
        <p>Create professional lease termination notices for landlords and tenants</p>
      </div>

      <div className="main-content">
        {/* Form Panel */}
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

          {renderTabContent()}

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
            
            <button onClick={downloadAsWord} className="nav-button success">
              <i data-feather="download"></i>
              Download
            </button>
            
            <button onClick={openConsultation} className="nav-button info">
              <i data-feather="calendar"></i>
              Consult
            </button>
            
            <button
              onClick={nextTab}
              className={`nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
              disabled={currentTab === tabs.length - 1}
            >
              Next
              <i data-feather="chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-content" ref={previewRef}>
            <h2>Live Preview</h2>
            <div 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>

      {/* Chatbox */}
      <div className="chatbox">
        <button className="chatbox-toggle" onClick={toggleChatbox}>
          <i data-feather={showChatbox ? "x" : "message-circle"}></i>
        </button>
        
        <div className={`chatbox-window ${showChatbox ? '' : 'hidden'}`}>
          <div className="chatbox-header">
            Legal Assistant
          </div>
          
          <div className="chatbox-messages">
            {chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.text}
              </div>
            ))}
            {isLoadingChat && (
              <div className="message assistant">
                <div className="spinner"></div> Thinking...
              </div>
            )}
          </div>
          
          <div className="chatbox-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoadingChat) {
                  sendChatMessage();
                }
              }}
              placeholder={isLoadingChat ? "Thinking..." : "Ask a question..."}
              disabled={isLoadingChat}
            />
            <button 
              onClick={sendChatMessage}
              disabled={isLoadingChat || !chatInput.trim()}
              className={isLoadingChat ? 'loading' : ''}
            >
              {isLoadingChat ? (
                <div className="spinner"></div>
              ) : (
                <i data-feather="send"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<LeaseTerminationGenerator />, document.getElementById('root'));