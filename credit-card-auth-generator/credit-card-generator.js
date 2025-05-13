// Credit Card Authorization Form Generator
const { useState, useRef, useEffect } = React;

// Icon component
const Icon = ({ name, size = 18, color = "currentColor", style = {} }) => {
  return (
    <i data-feather={name} style={{ width: size, height: size, color, ...style }}></i>
  );
};

// Tooltip component
const Tooltip = ({ text, children }) => {
  return (
    <div className="tooltip-label">
      {children}
      <span className="tooltip-icon">
        <Icon name="help-circle" size={16} />
        <span className="tooltip-text">{text}</span>
      </span>
    </div>
  );
};

// Main App component
const App = () => {
  // Current date for defaults
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  // Tab state
  const [currentTab, setCurrentTab] = useState(0);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Company Info
    companyName: "ABC Company, Inc.",
    companyAddress: "123 Business Ave, Suite 100, San Francisco, CA 94111",
    companyPhone: "(415) 555-1234",
    companyEmail: "billing@abccompany.com",
    
    // Cardholder Info
    cardholderName: "John Q. Smith",
    cardholderAddress: "456 Personal St, Apt 7B, San Francisco, CA 94105",
    cardholderPhone: "(415) 555-9876",
    cardholderEmail: "john.smith@email.com",
    
    // Card Details
    cardType: "Visa",
    otherCardType: "",
    cardNumber: "•••• •••• •••• 1234",
    cardExpiration: "12/25",
    cardCVV: "***",
    cardIssuingBank: "",
    paymentType: "recurring",
    recurringAmount: "99.99",
    recurringFrequency: "Monthly",
    recurringStartDate: formattedDate,
    recurringEndDate: "",
    oneTimeAmount: "499.99",
    chargeDate: formattedDate,
    
    // Authorization
    purpose: "Monthly subscription service",
    purposeCustom: "",
    customPurpose: false,
    agreementDate: formattedDate,
    authorizationDuration: "Until canceled in writing",
    customDuration: "",
    includeCancellation: true,
    includeRefund: true,
    includeChangeFee: true,
    includeLiability: true,
    includeGoverningLaw: false,
    cancellationDays: "30",
    refundPolicy: "No refunds",
    customRefund: "",
    changeFee: "25",
    governingLaw: "California"
  });
  
  // State for tracking what was last changed (for highlighting)
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview div (for scrolling)
  const previewRef = useRef(null);
  
  // Tabs configuration
  const tabs = [
    { id: 'company-info', label: 'Company Info' },
    { id: 'cardholder-info', label: 'Cardholder Info' },
    { id: 'card-details', label: 'Card Details' },
    { id: 'authorization', label: 'Authorization' }
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Handle special cases
    if (name === "purpose") {
      if (value === "custom") {
        setFormData(prev => ({
          ...prev,
          customPurpose: true,
          purpose: prev.purposeCustom || "Custom purpose"
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          customPurpose: false,
          purpose: value
        }));
      }
    } else if (name === "purposeCustom") {
      setFormData(prev => ({
        ...prev,
        purposeCustom: value,
        purpose: value
      }));
    } else {
      // Update form data normally
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
  
  // Generate the document text content
  const generateDocumentText = () => {
    // Format dates for display
    let formattedAgreementDate = "____________";
    if (formData.agreementDate) {
      const date = new Date(formData.agreementDate);
      formattedAgreementDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    let formattedStartDate = "____________";
    if (formData.recurringStartDate) {
      const date = new Date(formData.recurringStartDate);
      formattedStartDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    let formattedEndDate = "until canceled";
    if (formData.recurringEndDate) {
      const date = new Date(formData.recurringEndDate);
      formattedEndDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    let formattedChargeDate = "____________";
    if (formData.chargeDate) {
      const date = new Date(formData.chargeDate);
      formattedChargeDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    // Build document text
    let docText = '';
    
    // Title
    docText += "CREDIT CARD AUTHORIZATION FORM\n\n";
    
    // Date
    docText += `Date: ${formattedAgreementDate}\n\n`;
    
    // Introduction
    docText += `I, ${formData.cardholderName}, authorize ${formData.companyName} to charge my credit card for the following:\n\n`;
    
    // Purpose
    docText += `Purpose of Authorization: ${formData.purpose}\n\n`;
    
    // Authorization Duration
    docText += `Authorization Duration: ${formData.authorizationDuration === 'custom' ? formData.customDuration : formData.authorizationDuration}\n\n`;
    
    // Payment Details
    docText += "Payment Details:\n";
    if (formData.paymentType === 'recurring') {
      docText += `Recurring Payment of $${formData.recurringAmount} to be charged ${formData.recurringFrequency.toLowerCase()}, beginning on ${formattedStartDate} and continuing ${formattedEndDate}.\n\n`;
    } else {
      docText += `One-Time Payment of $${formData.oneTimeAmount} to be charged on ${formattedChargeDate}.\n\n`;
    }
    
    // Cardholder Information
    docText += "Cardholder Information:\n";
    docText += `Name on Card: ${formData.cardholderName}\n`;
    docText += `Billing Address: ${formData.cardholderAddress}\n`;
    docText += `Phone Number: ${formData.cardholderPhone}\n`;
    docText += `Email Address: ${formData.cardholderEmail}\n\n`;
    
    // Card Information
    docText += "Card Information:\n";
    docText += `Card Type: ${formData.cardType === 'Other' ? formData.otherCardType : formData.cardType}\n`;
    docText += `Card Number: ${formData.cardNumber}\n`;
    docText += `Expiration Date: ${formData.cardExpiration}\n`;
    if (formData.cardIssuingBank) {
      docText += `Issuing Bank: ${formData.cardIssuingBank}\n`;
    }
    docText += "\n";
    
    // Additional Terms
    docText += "Additional Terms:\n";
    
    // Cancellation policy
    if (formData.includeCancellation) {
      docText += `Cancellation Policy: Written notice of cancellation must be provided at least ${formData.cancellationDays} days in advance.\n`;
    }
    
    // Refund policy
    if (formData.includeRefund) {
      if (formData.refundPolicy === 'custom') {
        docText += `Refund Policy: ${formData.customRefund}\n`;
      } else {
        docText += `Refund Policy: ${formData.refundPolicy}.\n`;
      }
    }
    
    // Change fee
    if (formData.includeChangeFee) {
      docText += `Change Fee: A fee of $${formData.changeFee} will be charged for any changes to the payment schedule or amount after this authorization is signed.\n`;
    }
    
    // Liability statement
    if (formData.includeLiability) {
      docText += `Liability: The cardholder agrees to pay the total amount according to the card issuer agreement. The cardholder is responsible for any fees assessed by their card issuer related to this authorization.\n`;
    }
    
    // Governing law
    if (formData.includeGoverningLaw) {
      docText += `Governing Law: This authorization will be governed by the laws of ${formData.governingLaw}.\n`;
    }
    docText += "\n";
    
    // Company Information
    docText += "Company Information:\n";
    docText += `Company: ${formData.companyName}\n`;
    docText += `Address: ${formData.companyAddress}\n`;
    docText += `Phone: ${formData.companyPhone}\n`;
    docText += `Email: ${formData.companyEmail}\n\n`;
    
    // Authorization statement
    docText += "By signing below, I authorize the above-named business to charge the credit card indicated in this authorization form according to the terms outlined above. This payment authorization is for the goods/services described above. I certify that I am an authorized user of this credit card and that I will not dispute the payment with my credit card company provided the transactions correspond to the terms indicated in this form.\n\n";
    
    // Signature
    docText += "Cardholder Signature: ________________________________\n\n";
    docText += "Date: ________________________________";
    
    return docText;
  };

  // Copy document to clipboard
  const copyToClipboard = () => {
    try {
      const documentText = generateDocumentText();
      navigator.clipboard.writeText(documentText)
        .then(() => {
          alert("Document copied to clipboard!");
        })
        .catch(err => {
          console.error("Error copying to clipboard:", err);
          alert("Failed to copy to clipboard. Please try again.");
        });
    } catch (error) {
      console.error("Error in copyToClipboard:", error);
      alert("Error copying to clipboard. Please try again.");
    }
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      const documentText = generateDocumentText();
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Check if window.generateWordDoc exists
      if (typeof window.generateWordDoc !== 'function') {
        console.error("Word generation function not found");
        alert("Word document generation function not available. Please try again or use the copy option.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: "Credit Card Authorization Form",
        fileName: "Credit_Card_Authorization_Form"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Function to determine which section to highlight based on the last changed field
  const getHighlightedText = () => {
    if (!lastChanged) return generateDocumentText();
    
    const documentText = generateDocumentText();
    
    // Map of form fields to text patterns they affect
    const highlightPatterns = {
      // Company Info
      companyName: [
        new RegExp(`authorize (${formData.companyName})`, 'g'),
        new RegExp(`Company: (${formData.companyName})`, 'g')
      ],
      companyAddress: [new RegExp(`Address: (${formData.companyAddress})`, 'g')],
      companyPhone: [new RegExp(`Phone: (${formData.companyPhone})`, 'g')],
      companyEmail: [new RegExp(`Email: (${formData.companyEmail})`, 'g')],
      
      // Cardholder Info
      cardholderName: [
        new RegExp(`I, (${formData.cardholderName})`, 'g'),
        new RegExp(`Name on Card: (${formData.cardholderName})`, 'g')
      ],
      cardholderAddress: [new RegExp(`Billing Address: (${formData.cardholderAddress})`, 'g')],
      cardholderPhone: [new RegExp(`Phone Number: (${formData.cardholderPhone})`, 'g')],
      cardholderEmail: [new RegExp(`Email Address: (${formData.cardholderEmail})`, 'g')],
      
      // Card Details
      cardType: [new RegExp(`Card Type: (${formData.cardType === 'Other' ? formData.otherCardType : formData.cardType})`, 'g')],
      otherCardType: formData.cardType === 'Other' ? [new RegExp(`Card Type: (${formData.otherCardType})`, 'g')] : [],
      cardNumber: [new RegExp(`Card Number: (${formData.cardNumber})`, 'g')],
      cardExpiration: [new RegExp(`Expiration Date: (${formData.cardExpiration})`, 'g')],
      cardIssuingBank: formData.cardIssuingBank ? [new RegExp(`Issuing Bank: (${formData.cardIssuingBank})`, 'g')] : [],
      
      // Payment Details
      paymentType: [
        formData.paymentType === 'recurring' 
          ? new RegExp(`(Recurring Payment of \\$${formData.recurringAmount} to be charged ${formData.recurringFrequency.toLowerCase()})`, 'g')
          : new RegExp(`(One-Time Payment of \\$${formData.oneTimeAmount} to be charged)`, 'g')
      ],
      recurringAmount: formData.paymentType === 'recurring' ? [new RegExp(`Recurring Payment of \\$(${formData.recurringAmount})`, 'g')] : [],
      recurringFrequency: formData.paymentType === 'recurring' ? [new RegExp(`to be charged (${formData.recurringFrequency.toLowerCase()})`, 'g')] : [],
      recurringStartDate: formData.paymentType === 'recurring' ? [new RegExp(`beginning on (.+?) and continuing`, 'g')] : [],
      recurringEndDate: formData.paymentType === 'recurring' && formData.recurringEndDate ? [new RegExp(`continuing (.+?)\\.$`, 'g')] : [],
      oneTimeAmount: formData.paymentType === 'one-time' ? [new RegExp(`One-Time Payment of \\$(${formData.oneTimeAmount})`, 'g')] : [],
      chargeDate: formData.paymentType === 'one-time' ? [new RegExp(`to be charged on (.+?)\\.$`, 'g')] : [],
      
      // Authorization
      purpose: [new RegExp(`Purpose of Authorization: (${formData.purpose})`, 'g')],
      agreementDate: [new RegExp(`Date: (.+?)$`, 'm')],
      authorizationDuration: [
        new RegExp(`Authorization Duration: (${formData.authorizationDuration === 'custom' ? formData.customDuration : formData.authorizationDuration})`, 'g')
      ],
      customDuration: formData.authorizationDuration === 'custom' ? [new RegExp(`Authorization Duration: (${formData.customDuration})`, 'g')] : [],
      
      // Additional Terms
      includeCancellation: formData.includeCancellation ? [new RegExp(`(Cancellation Policy: Written notice of cancellation must be provided at least ${formData.cancellationDays} days in advance\\.)`, 'g')] : [],
      cancellationDays: formData.includeCancellation ? [new RegExp(`at least (${formData.cancellationDays}) days in advance`, 'g')] : [],
      includeRefund: formData.includeRefund ? [new RegExp(`(Refund Policy: ${formData.refundPolicy === 'custom' ? formData.customRefund : formData.refundPolicy}\\.?)`, 'g')] : [],
      refundPolicy: formData.includeRefund && formData.refundPolicy !== 'custom' ? [new RegExp(`Refund Policy: (${formData.refundPolicy})`, 'g')] : [],
      customRefund: formData.includeRefund && formData.refundPolicy === 'custom' ? [new RegExp(`Refund Policy: (${formData.customRefund})`, 'g')] : [],
      includeChangeFee: formData.includeChangeFee ? [new RegExp(`(Change Fee: A fee of \\$${formData.changeFee} will be charged for any changes)`, 'g')] : [],
      changeFee: formData.includeChangeFee ? [new RegExp(`A fee of \\$(${formData.changeFee})`, 'g')] : [],
      includeLiability: formData.includeLiability ? [new RegExp(`(Liability: The cardholder agrees to pay the total amount)`, 'g')] : [],
      includeGoverningLaw: formData.includeGoverningLaw ? [new RegExp(`(Governing Law: This authorization will be governed by the laws of ${formData.governingLaw}\\.)`, 'g')] : [],
      governingLaw: formData.includeGoverningLaw ? [new RegExp(`laws of (${formData.governingLaw})`, 'g')] : []
    };
    
    // Get the patterns to highlight for the last changed field
    const patterns = highlightPatterns[lastChanged] || [];
    if (patterns.length === 0) return documentText;
    
    // Apply highlighting
    let highlightedText = documentText;
    patterns.forEach(pattern => {
      highlightedText = highlightedText.replace(pattern, (match, p1) => {
        return match.replace(p1, `<span class="highlighted-text">${p1}</span>`);
      });
    });
    
    return highlightedText;
  };
  
  // Scroll to highlighted text
  useEffect(() => {
    if (previewRef.current && lastChanged) {
      setTimeout(() => {
        const highlightedElement = previewRef.current.querySelector('.highlighted-text');
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [lastChanged]);
  
  return (
    <div className="app-container">
      {/* Generator Panel */}
      <div className="generator-panel">
        <div className="panel-header">
          <h1>Credit Card Authorization Form Generator</h1>
        </div>
        
        <div className="panel-content">
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
          {currentTab === 0 && (
            <div className="form-section">
              <h2>Company Information</h2>
              
              <div className="form-group">
                <Tooltip text="Enter the full legal name of your company as it appears on official documents.">
                  <label htmlFor="companyName">Company Name</label>
                </Tooltip>
                <input 
                  type="text" 
                  id="companyName" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyAddress">Company Address</label>
                <input 
                  type="text" 
                  id="companyAddress" 
                  name="companyAddress" 
                  value={formData.companyAddress} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyPhone">Company Phone</label>
                <input 
                  type="tel" 
                  id="companyPhone" 
                  name="companyPhone" 
                  value={formData.companyPhone} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyEmail">Company Email</label>
                <input 
                  type="email" 
                  id="companyEmail" 
                  name="companyEmail" 
                  value={formData.companyEmail} 
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          {currentTab === 1 && (
            <div className="form-section">
              <h2>Cardholder Information</h2>
              
              <div className="form-group">
                <Tooltip text="Enter the full name as it appears on the credit card.">
                  <label htmlFor="cardholderName">Cardholder Name</label>
                </Tooltip>
                <input 
                  type="text" 
                  id="cardholderName" 
                  name="cardholderName" 
                  value={formData.cardholderName} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardholderAddress">Billing Address</label>
                <input 
                  type="text" 
                  id="cardholderAddress" 
                  name="cardholderAddress" 
                  value={formData.cardholderAddress} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardholderPhone">Phone Number</label>
                <input 
                  type="tel" 
                  id="cardholderPhone" 
                  name="cardholderPhone" 
                  value={formData.cardholderPhone} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardholderEmail">Email Address</label>
                <input 
                  type="email" 
                  id="cardholderEmail" 
                  name="cardholderEmail" 
                  value={formData.cardholderEmail} 
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          {currentTab === 2 && (
            <div className="form-section">
              <h2>Card Details</h2>
              
              <div className="form-group">
                <Tooltip text="Select the type of credit card being authorized.">
                  <label>Card Type</label>
                </Tooltip>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="cardType" 
                      value="Visa" 
                      checked={formData.cardType === "Visa"} 
                      onChange={handleChange}
                    />
                    Visa
                  </label>
                </div>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="cardType" 
                      value="MasterCard" 
                      checked={formData.cardType === "MasterCard"} 
                      onChange={handleChange}
                    />
                    MasterCard
                  </label>
                </div>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="cardType" 
                      value="American Express" 
                      checked={formData.cardType === "American Express"} 
                      onChange={handleChange}
                    />
                    American Express
                  </label>
                </div>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="cardType" 
                      value="Discover" 
                      checked={formData.cardType === "Discover"} 
                      onChange={handleChange}
                    />
                    Discover
                  </label>
                </div>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="cardType" 
                      value="Other" 
                      checked={formData.cardType === "Other"} 
                      onChange={handleChange}
                    />
                    Other
                  </label>
                </div>
              </div>
              
              {formData.cardType === "Other" && (
                <div className="form-group">
                  <label htmlFor="otherCardType">Specify Card Type</label>
                  <input 
                    type="text" 
                    id="otherCardType" 
                    name="otherCardType" 
                    value={formData.otherCardType} 
                    onChange={handleChange}
                    placeholder="Enter card type"
                  />
                </div>
              )}
              
              <div className="form-group">
                <Tooltip text="For security, only the last 4 digits will appear in the downloadable form.">
                  <label htmlFor="cardNumber">Card Number</label>
                </Tooltip>
                <input 
                  type="text" 
                  id="cardNumber" 
                  name="cardNumber" 
                  value={formData.cardNumber} 
                  onChange={handleChange}
                  placeholder="•••• •••• •••• 1234"
                  maxLength="19"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardExpiration">Expiration Date (MM/YY)</label>
                <input 
                  type="text" 
                  id="cardExpiration" 
                  name="cardExpiration" 
                  value={formData.cardExpiration} 
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              
              <div className="form-group">
                <Tooltip text="This is the 3 or 4 digit security code on the back of the card. For security, this will not appear in the downloadable form.">
                  <label htmlFor="cardCVV">CVV/Security Code</label>
                </Tooltip>
                <input 
                  type="text" 
                  id="cardCVV" 
                  name="cardCVV" 
                  value={formData.cardCVV} 
                  onChange={handleChange}
                  placeholder="***"
                  maxLength="4"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardIssuingBank">Issuing Bank (Optional)</label>
                <input 
                  type="text" 
                  id="cardIssuingBank" 
                  name="cardIssuingBank" 
                  value={formData.cardIssuingBank} 
                  onChange={handleChange}
                  placeholder="Enter bank name"
                />
              </div>
              
              <div className="form-group">
                <label>Payment Type</label>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="paymentType" 
                      value="recurring" 
                      checked={formData.paymentType === "recurring"} 
                      onChange={handleChange}
                    />
                    Recurring Charge
                  </label>
                </div>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="paymentType" 
                      value="one-time" 
                      checked={formData.paymentType === "one-time"} 
                      onChange={handleChange}
                    />
                    One-Time Charge
                  </label>
                </div>
              </div>
              
              {formData.paymentType === "recurring" ? (
                <div id="recurring-options">
                  <div className="form-group">
                    <label htmlFor="recurringAmount">Recurring Amount ($)</label>
                    <input 
                      type="text" 
                      id="recurringAmount" 
                      name="recurringAmount" 
                      value={formData.recurringAmount} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="recurringFrequency">Frequency</label>
                    <select 
                      id="recurringFrequency" 
                      name="recurringFrequency" 
                      value={formData.recurringFrequency} 
                      onChange={handleChange}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="recurringStartDate">Start Date</label>
                    <input 
                      type="date" 
                      id="recurringStartDate" 
                      name="recurringStartDate" 
                      value={formData.recurringStartDate} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="recurringEndDate">End Date (Optional)</label>
                    <input 
                      type="date" 
                      id="recurringEndDate" 
                      name="recurringEndDate" 
                      value={formData.recurringEndDate} 
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div id="one-time-options">
                  <div className="form-group">
                    <label htmlFor="oneTimeAmount">Charge Amount ($)</label>
                    <input 
                      type="text" 
                      id="oneTimeAmount" 
                      name="oneTimeAmount" 
                      value={formData.oneTimeAmount} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="chargeDate">Charge Date</label>
                    <input 
                      type="date" 
                      id="chargeDate" 
                      name="chargeDate" 
                      value={formData.chargeDate} 
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentTab === 3 && (
            <div className="form-section">
              <h2>Authorization Details</h2>
              
              <div className="form-group">
                <Tooltip text="Specify what products or services are being charged for.">
                  <label htmlFor="purpose">Purpose of Authorization</label>
                </Tooltip>
                <select 
                  id="purpose" 
                  name="purpose" 
                  value={formData.customPurpose ? "custom" : formData.purpose} 
                  onChange={handleChange}
                >
                  <option value="Monthly subscription service">Monthly subscription service</option>
                  <option value="Annual membership fee">Annual membership fee</option>
                  <option value="One-time product purchase">One-time product purchase</option>
                  <option value="Recurring service payment">Recurring service payment</option>
                  <option value="Installment payment">Installment payment</option>
                  <option value="Security deposit">Security deposit</option>
                  <option value="Processing fee">Processing fee</option>
                  <option value="custom">Custom purpose...</option>
                </select>
              </div>
              
              {formData.customPurpose && (
                <div className="form-group">
                  <label htmlFor="purposeCustom">Custom Purpose</label>
                  <input 
                    type="text" 
                    id="purposeCustom" 
                    name="purposeCustom" 
                    value={formData.purposeCustom} 
                    onChange={handleChange}
                    placeholder="Enter custom purpose"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="agreementDate">Agreement Date</label>
                <input 
                  type="date" 
                  id="agreementDate" 
                  name="agreementDate" 
                  value={formData.agreementDate} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <Tooltip text="How long this authorization will remain valid.">
                  <label htmlFor="authorizationDuration">Authorization Duration</label>
                </Tooltip>
                <select 
                  id="authorizationDuration" 
                  name="authorizationDuration" 
                  value={formData.authorizationDuration} 
                  onChange={handleChange}
                >
                  <option value="Until canceled in writing">Until canceled in writing</option>
                  <option value="One year from the date of signature">One year from the date of signature</option>
                  <option value="Six months from the date of signature">Six months from the date of signature</option>
                  <option value="For a single transaction only">For a single transaction only</option>
                  <option value="custom">Custom duration...</option>
                </select>
              </div>
              
              {formData.authorizationDuration === "custom" && (
                <div className="form-group">
                  <label htmlFor="customDuration">Custom Duration</label>
                  <input 
                    type="text" 
                    id="customDuration" 
                    name="customDuration" 
                    value={formData.customDuration} 
                    onChange={handleChange}
                    placeholder="e.g., For the duration of the project"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Additional Terms</label>
                
                <div className="checkbox-group">
                  <Tooltip text="Requires customers to provide advance notice before canceling the authorization.">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        id="includeCancellation" 
                        name="includeCancellation" 
                        checked={formData.includeCancellation} 
                        onChange={handleChange}
                      />
                      Include cancellation policy
                    </label>
                  </Tooltip>
                </div>
                
                <div className="checkbox-group">
                  <Tooltip text="Specifies if and how refunds will be processed for charges made under this authorization.">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        id="includeRefund" 
                        name="includeRefund" 
                        checked={formData.includeRefund} 
                        onChange={handleChange}
                      />
                      Include refund policy
                    </label>
                  </Tooltip>
                </div>
                
                {formData.includeRefund && (
                  <div className="form-group" style={{marginLeft: "20px", marginTop: "10px"}}>
                    <label htmlFor="refundPolicy">Refund Policy</label>
                    <select 
                      id="refundPolicy" 
                      name="refundPolicy" 
                      value={formData.refundPolicy} 
                      onChange={handleChange}
                    >
                      <option value="No refunds">No refunds</option>
                      <option value="Partial refund at company's discretion">Partial refund at company's discretion</option>
                      <option value="Full refund within 30 days">Full refund within 30 days</option>
                      <option value="Prorated refund">Prorated refund</option>
                      <option value="custom">Custom refund policy...</option>
                    </select>
                  </div>
                )}
                
                {formData.includeRefund && formData.refundPolicy === "custom" && (
                  <div className="form-group" style={{marginLeft: "20px", marginTop: "10px"}}>
                    <label htmlFor="customRefund">Custom Refund Policy</label>
                    <textarea 
                      id="customRefund" 
                      name="customRefund" 
                      value={formData.customRefund} 
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter your custom refund policy"
                    ></textarea>
                  </div>
                )}
                
                <div className="checkbox-group">
                  <Tooltip text="Adds a fee for any changes to the payment schedule or amount after authorization is signed.">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        id="includeChangeFee" 
                        name="includeChangeFee" 
                        checked={formData.includeChangeFee} 
                        onChange={handleChange}
                      />
                      Include change fee disclosure
                    </label>
                  </Tooltip>
                </div>
                
                <div className="checkbox-group">
                  <Tooltip text="Clarifies that the cardholder is responsible for any fees from their card issuer related to this authorization.">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        id="includeLiability" 
                        name="includeLiability" 
                        checked={formData.includeLiability} 
                        onChange={handleChange}
                      />
                      Include liability statement
                    </label>
                  </Tooltip>
                </div>
                
                <div className="checkbox-group">
                  <Tooltip text="Specifies which state or jurisdiction's laws govern the authorization agreement.">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        id="includeGoverningLaw" 
                        name="includeGoverningLaw" 
                        checked={formData.includeGoverningLaw} 
                        onChange={handleChange}
                      />
                      Include governing law
                    </label>
                  </Tooltip>
                </div>
              </div>
              
              {formData.includeCancellation && (
                <div className="form-group">
                  <label htmlFor="cancellationDays">Cancellation Notice Required (Days)</label>
                  <input 
                    type="number" 
                    id="cancellationDays" 
                    name="cancellationDays" 
                    value={formData.cancellationDays} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              )}
              
              {formData.includeChangeFee && (
                <div className="form-group">
                  <label htmlFor="changeFee">Change Fee Amount ($)</label>
                  <input 
                    type="number" 
                    id="changeFee" 
                    name="changeFee" 
                    value={formData.changeFee} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              )}
              
              {formData.includeGoverningLaw && (
                <div className="form-group">
                  <label htmlFor="governingLaw">Governing Law State/Country</label>
                  <input 
                    type="text" 
                    id="governingLaw" 
                    name="governingLaw" 
                    value={formData.governingLaw} 
                    onChange={handleChange}
                    placeholder="e.g., California"
                  />
                </div>
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
            
            <button
              onClick={nextTab}
              className={`nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
              disabled={currentTab === tabs.length - 1}
            >
              Next
              <Icon name="chevron-right" style={{marginLeft: "0.25rem"}} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="preview-panel">
        <div className="panel-header">
          <h1>Live Preview</h1>
          <div className="action-buttons">
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
          </div>
        </div>
        <div className="preview-content" ref={previewRef}>
          <pre 
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
          />
        </div>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));