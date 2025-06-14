const { useState, useEffect, useRef, useCallback, useMemo } = React;

// Icon component
const Icon = ({ name, size = 16, className = "", style = {} }) => {
  return React.createElement('i', {
    'data-feather': name,
    style: { width: size, height: size, ...style },
    className: className
  });
};

// Main AI Terms Generator Component
const AITermsGenerator = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [lastChanged, setLastChanged] = useState(null);
  const [showTransactionInput, setShowTransactionInput] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const previewRef = useRef(null);

  // Form data state with stable initial values
  const [formData, setFormData] = useState(() => ({
    // Company Information
    companyName: '',
    platformName: '',
    companyWebsite: '',
    companyContact: '',
    effectiveDate: '',
    companyAddress: '',
    businessType: 'corporation',
    
    // Platform Details
    platformType: 'saas',
    primaryFunction: 'general-ai',
    targetAudience: 'business',
    dataProcessing: true,
    aiTraining: true,
    apiAccess: false,
    
    // User Requirements
    minAge: '18',
    accountRequirements: {
      email: true,
      name: true,
      password: true,
      payment: false,
      verification: true,
      phone: false,
      businessInfo: false,
      identification: false
    },
    
    // Prohibited Activities
    prohibitedActivities: {
      illegal: true,
      ipInfringement: true,
      hateSpeech: true,
      spam: true,
      security: true,
      scraping: true,
      reselling: false,
      weapons: true,
      misinformation: true,
      harassment: true,
      impersonation: true,
      malware: true,
      childSafety: true,
      terrorism: true,
      fraud: true,
      gambling: false,
      adultContent: false,
      competitiveAnalysis: false
    },
    
    // Privacy and Data
    privacyPolicyUrl: '',
    dataCollection: {
      service: true,
      improvement: true,
      personalization: false,
      marketing: false,
      analytics: true
    },
    shareServiceProviders: true,
    shareAffiliates: false,
    shareLegal: true,
    shareAcquisition: true,
    rightAccess: true,
    rightCorrect: true,
    rightDelete: true,
    rightPortability: true,
    
    // IP and Content
    ipOwnership: 'user',
    licenseType: 'broad',
    aiOutputOwnership: 'user',
    ipFeedback: true,
    ipTraining: true,
    ipReverseEngineering: false,
    ipAttribution: false,
    
    // Payment Terms
    paymentModel: 'freemium',
    billingCycle: 'monthly',
    autoRenewal: 'yes',
    refundPolicy: 'limited',
    acceptCreditCard: true,
    acceptPayPal: true,
    acceptCrypto: false,
    acceptWire: false,
    
    // Legal Terms
    governingLaw: 'California',
    disputeResolution: 'courts',
    arbitrationProvider: 'aaa',
    classAction: 'yes',
    liabilityCap: 'fees-paid',
    fixedLiabilityAmount: '1000',
    warrantyDisclaimer: 'standard'
  }));

  const tabs = [
    { id: 0, label: 'Company Info', icon: 'building' },
    { id: 1, label: 'Platform Details', icon: 'cpu' },
    { id: 2, label: 'User Terms', icon: 'users' },
    { id: 3, label: 'IP & Content', icon: 'shield' },
    { id: 4, label: 'Privacy & Data', icon: 'lock' },
    { id: 5, label: 'Payment Terms', icon: 'credit-card' },
    { id: 6, label: 'Legal & Disputes', icon: 'gavel' },
    { id: 7, label: 'Finalization', icon: 'check-circle' }
  ];

  // Optimized handle change function that doesn't cause re-renders
  const handleInputChange = useCallback((name, value, type = 'text') => {
    setLastChanged(name);
    
    // Batch state updates to prevent multiple re-renders
    setFormData(prevData => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prevData,
          [parent]: {
            ...prevData[parent],
            [child]: type === 'checkbox' ? value : value
          }
        };
      } else {
        return {
          ...prevData,
          [name]: type === 'checkbox' ? value : value
        };
      }
    });
  }, []);

  // Validate PayPal transaction ID
  const validateTransactionId = (id) => {
    // Must be exactly 17 characters, contain both uppercase letters and numbers, no lowercase
    if (id.length !== 17) return false;
    if (!/^[A-Z0-9]+$/.test(id)) return false; // Only uppercase letters and numbers
    if (!/[A-Z]/.test(id)) return false; // Must contain at least one uppercase letter
    if (!/[0-9]/.test(id)) return false; // Must contain at least one number
    return true;
  };

  // Handle transaction ID submission
  const handleTransactionSubmit = () => {
    if (validateTransactionId(transactionId)) {
      setIsPaid(true);
      setShowTransactionInput(false);
      setTransactionId('');
      alert('Access unlocked! You can now copy and download your document.');
    } else {
      alert('Invalid transaction ID. Must be 17 characters with uppercase letters and numbers only.');
    }
  };

  // Navigation functions
  const nextTab = useCallback(() => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  }, [currentTab, tabs.length]);

  const prevTab = useCallback(() => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  }, [currentTab]);

  const goToTab = useCallback((index) => {
    setCurrentTab(index);
  }, []);

  // PayPal payment handling
  useEffect(() => {
    if (showPaymentModal && window.paypal && !showTransactionInput) {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = '';
        
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '9.99'
                },
                description: 'AI Platform Terms of Use Generator - Premium Access'
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              setPaymentComplete(true);
              setIsPaid(true);
              setTimeout(() => {
                setShowPaymentModal(false);
              }, 2000);
            });
          },
          onError: (err) => {
            console.error('PayPal payment error:', err);
            alert('Payment failed. Please try again.');
          }
        }).render('#paypal-button-container');
      }
    }
  }, [showPaymentModal, showTransactionInput]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!isPaid) {
      setShowPaymentModal(true);
      return;
    }
    
    const documentText = generateDocumentText();
    const success = await window.copyToClipboard(documentText);
    
    if (success) {
      alert('Terms of Use copied to clipboard!');
    } else {
      alert('Failed to copy to clipboard. Please try selecting and copying manually.');
    }
  };

  // Download as Word
  const downloadAsWord = () => {
    if (!isPaid) {
      setShowPaymentModal(true);
      return;
    }
    
    const documentText = generateDocumentText();
    window.generateWordDoc(documentText, {
      documentTitle: `${formData.platformName || 'AI Platform'} Terms of Use`,
      fileName: `${formData.platformName || 'AI-Platform'}-Terms-of-Use`
    });
  };
  // Generate comprehensive document text
  const generateDocumentText = useCallback(() => {
    const company = formData.companyName || '[Company Name]';
    const platform = formData.platformName || '[Platform Name]';
    const website = formData.companyWebsite || '[Company Website]';
    const contact = formData.companyContact || '[Legal Contact Email]';
    const effectiveDate = formData.effectiveDate || '[Effective Date]';
    const address = formData.companyAddress || '[Company Address]';

    return `TERMS OF USE
${platform.toUpperCase()}

Last Updated: ${effectiveDate}

IMPORTANT NOTICE: These Terms of Use govern your access to and use of the ${platform} artificial intelligence platform. By accessing or using our services, you agree to be bound by these terms. Please read them carefully.

1. DEFINITIONS AND SCOPE

1.1 Definitions. In these Terms of Use ("Terms"):
• "Company," "we," "us," or "our" refers to ${company}, a ${formData.businessType} organized under the laws of ${formData.governingLaw}, with its principal place of business at ${address}.
• "Platform" refers to the ${platform} artificial intelligence platform, including all software, algorithms, AI models, APIs, and related services provided by the Company.
• "User," "you," or "your" refers to any individual or entity accessing or using the Platform.
• "Content" refers to any data, information, text, images, audio, video, or other materials.
• "AI-Generated Content" refers to any output, results, or content produced by the Platform's artificial intelligence models.
• "User Content" refers to any content uploaded, submitted, or provided by users to the Platform.

1.2 Platform Description. The Platform is designed to provide ${getPlatformDescription()} services using advanced artificial intelligence technology. ${formData.dataProcessing ? 'The Platform processes and analyzes data to deliver personalized AI-powered insights and results.' : 'The Platform operates without processing personal data beyond what is necessary for basic functionality.'}

2. ELIGIBILITY AND ACCOUNT REGISTRATION

2.1 Age Requirements. You must be at least ${formData.minAge} years old to use the Platform. ${formData.minAge === '13' ? 'Users between 13 and 18 years old must have parental consent.' : formData.minAge === '16' ? 'Users between 16 and 18 years old may use the Platform but certain features may be restricted.' : 'This Platform is intended for adult users only.'}

2.2 Account Registration. To access the Platform, you must create an account by providing accurate and complete information, including:
${Object.entries(formData.accountRequirements).filter(([key, value]) => value).map(([key, value]) => `• ${getAccountRequirementLabel(key)}`).join('\n')}

2.3 Account Security. You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Immediately notifying us of any unauthorized use or security breach
• Using strong passwords and enabling two-factor authentication when available

3. ACCEPTABLE USE AND PROHIBITED ACTIVITIES

3.1 Acceptable Use. You agree to use the Platform only for lawful purposes and in accordance with these Terms. You may use the Platform for ${getAcceptableUseDescription()}.

3.2 Prohibited Activities. You expressly agree NOT to use the Platform for any of the following:
${Object.entries(formData.prohibitedActivities).filter(([key, value]) => value).map(([key, value]) => `• ${getProhibitedActivityDescription(key)}`).join('\n')}

4. INTELLECTUAL PROPERTY RIGHTS

4.1 Platform Ownership. The Platform, including its software, algorithms, AI models, user interface, and all related intellectual property, is owned by the Company and protected by copyright, patent, trademark, and other intellectual property laws.

4.2 User Content Ownership. You retain ownership of any content you submit to the Platform ("User Content"). However, by submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Platform and our business operations.

4.3 AI-Generated Content. Subject to your compliance with these Terms and payment of applicable fees, you own the AI-Generated Content created through your use of the Platform. However, you acknowledge that similar or identical content may be generated for other users, as AI models may produce similar outputs for similar inputs.

5. PRIVACY AND DATA PROTECTION

5.1 Privacy Policy. Our collection, use, and protection of personal information is governed by our Privacy Policy, available at ${formData.privacyPolicyUrl || '[Privacy Policy URL]'}, which is incorporated into these Terms by reference.

5.2 Data Processing Consent. By using the Platform, you consent to our processing of your data as described in our Privacy Policy and these Terms.

5.3 Data Use for AI Training. ${formData.aiTraining ? 'You acknowledge and agree that we may use your interactions with the Platform, including your inputs and the AI-generated outputs, to improve, train, and develop our AI models and algorithms.' : 'We do not use your data for AI training purposes without your explicit consent.'}

6. PAYMENT TERMS AND BILLING

${getPaymentTerms()}

7. PLATFORM AVAILABILITY AND MODIFICATIONS

7.1 Service Availability. While we strive to maintain Platform availability, we do not guarantee uninterrupted or error-free service.

7.2 Platform Modifications. We reserve the right to modify, update, or discontinue any aspect of the Platform at any time with reasonable notice.

8. DISCLAIMERS AND LIMITATIONS

8.1 Platform Disclaimers. THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.

8.2 AI Limitations. You acknowledge that artificial intelligence technology has inherent limitations and AI-generated content may contain errors, biases, or inaccuracies.

9. LIMITATION OF LIABILITY

9.1 Liability Cap. OUR TOTAL LIABILITY SHALL NOT EXCEED ${getLiabilityCapDescription()}.

10. GOVERNING LAW AND DISPUTE RESOLUTION

10.1 Governing Law. These Terms are governed by the laws of the State of ${formData.governingLaw}.

10.2 Dispute Resolution. ${getDisputeResolution()}

11. CONTACT INFORMATION

For questions about these Terms, please contact us at:
${company}
${address}
Email: ${contact}
Website: ${website}

By using the ${platform} platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.

Last Updated: ${effectiveDate}`;
  }, [formData]);

  // Helper functions
  const getPlatformDescription = () => {
    const typeDescriptions = {
      'saas': 'software-as-a-service',
      'api': 'API-based artificial intelligence',
      'mobile': 'mobile artificial intelligence',
      'enterprise': 'enterprise artificial intelligence',
      'consumer': 'consumer-focused AI',
      'analytics': 'AI-powered analytics and insights',
      'automation': 'AI automation and workflow',
      'creative': 'AI-powered creative tools'
    };
    
    const functionDescriptions = {
      'general-ai': 'general purpose artificial intelligence capabilities',
      'nlp': 'natural language processing and understanding',
      'computer-vision': 'computer vision and image analysis',
      'predictive': 'predictive analytics and forecasting',
      'recommendation': 'recommendation and personalization',
      'automation': 'process automation and optimization',
      'creative': 'creative content generation',
      'analysis': 'data analysis and insights'
    };
    
    return `${typeDescriptions[formData.platformType] || 'artificial intelligence'} focused on ${functionDescriptions[formData.primaryFunction] || 'advanced AI capabilities'}`;
  };

  const getAccountRequirementLabel = (key) => {
    const labels = {
      email: 'Valid email address',
      name: 'Full legal name',
      password: 'Secure password',
      payment: 'Payment information',
      verification: 'Email verification',
      phone: 'Phone number',
      businessInfo: 'Business information (for business accounts)',
      identification: 'Government-issued identification'
    };
    return labels[key] || key;
  };

  const getAcceptableUseDescription = () => {
    const audienceDescriptions = {
      'business': 'legitimate business purposes, research, and professional applications',
      'consumer': 'personal use, creative projects, and non-commercial applications',
      'developer': 'software development, integration, and technical applications',
      'research': 'academic research, analysis, and educational purposes',
      'enterprise': 'enterprise-level business operations and commercial applications'
    };
    return audienceDescriptions[formData.targetAudience] || 'lawful and legitimate purposes';
  };

  const getProhibitedActivityDescription = (key) => {
    const descriptions = {
      illegal: 'Engaging in any illegal activities or violating applicable laws and regulations',
      ipInfringement: 'Infringing upon intellectual property rights of others',
      hateSpeech: 'Generating or disseminating hate speech, harassment, or discrimination',
      spam: 'Transmitting spam, unsolicited communications, or malicious code',
      security: 'Attempting to circumvent security measures or gain unauthorized access',
      scraping: 'Scraping, crawling, or extracting data without authorization',
      reselling: 'Reselling, sublicensing, or redistributing Platform access',
      weapons: 'Developing, designing, or facilitating the creation of weapons',
      misinformation: 'Deliberately generating or spreading false information',
      harassment: 'Harassing, stalking, or threatening other users or individuals',
      impersonation: 'Impersonating others or misrepresenting your identity',
      malware: 'Creating, distributing, or facilitating malicious software',
      childSafety: 'Creating content that exploits, harms, or endangers minors',
      terrorism: 'Supporting, promoting, or facilitating terrorist activities',
      fraud: 'Engaging in fraudulent activities, scams, or financial crimes',
      gambling: 'Operating gambling services or facilitating illegal gambling',
      adultContent: 'Generating explicit adult content or pornographic materials',
      competitiveAnalysis: 'Using the Platform to conduct competitive intelligence against us'
    };
    return descriptions[key] || `Engaging in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} activities`;
  };

  const getPaymentTerms = () => {
    if (formData.paymentModel === 'free') {
      return `6.1 Free Service. The Platform is currently offered free of charge. We reserve the right to introduce paid features or modify our pricing structure with appropriate notice.`;
    }
    
    return `6.1 Payment Model. We offer both free and paid tiers. Paid subscriptions provide access to advanced features, higher usage limits, and priority support.

6.2 Billing and Payment. Subscriptions are billed ${formData.billingCycle} in advance. Subscriptions automatically renew unless cancelled before the next billing cycle.

6.3 Payment Methods. We accept major credit cards, PayPal, and other payment methods as displayed during checkout.

6.4 Refunds. ${getRefundPolicy()}`;
  };

  const getRefundPolicy = () => {
    const policies = {
      'none': 'All payments are final and non-refundable.',
      'limited': 'Refunds may be provided at our sole discretion on a case-by-case basis.',
      'days-7': 'You may request a full refund within 7 days of purchase.',
      'days-14': 'You may request a full refund within 14 days of purchase.',
      'days-30': 'You may request a full refund within 30 days of purchase.'
    };
    return policies[formData.refundPolicy] || 'Refund terms are specified in your subscription agreement.';
  };

  const getLiabilityCapDescription = () => {
    const caps = {
      'fees-paid': 'the amount paid by you to us in the twelve (12) months preceding the event',
      'fees-total': 'the total amount paid by you to us since you began using the Platform',
      'fixed-amount': `$${formData.fixedLiabilityAmount || '1,000'}`,
      'no-cap': 'the maximum amount permitted by applicable law'
    };
    return caps[formData.liabilityCap] || '$1,000';
  };

  const getDisputeResolution = () => {
    const methods = {
      'courts': `Any dispute will be resolved exclusively in the state and federal courts located in ${formData.governingLaw}.`,
      'arbitration': `Any dispute will be resolved through binding arbitration.`,
      'mediation-first': 'Disputes will first be addressed through mediation, then through court proceedings.',
      'mediation-arbitration': 'Disputes will first be addressed through mediation, then through binding arbitration.'
    };
    return methods[formData.disputeResolution] || methods.courts;
  };
  // Custom Input Component that handles its own state to prevent re-render issues
  const CustomInput = ({ id, name, value, onChange, placeholder, type = "text", required = false }) => {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);
    
    // Update local value when prop changes
    useEffect(() => {
      setLocalValue(value);
    }, [value]);
    
    // Handle input change without causing parent re-render immediately
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      
      // Debounce the parent update to prevent excessive re-renders
      clearTimeout(inputRef.current?.timeoutId);
      inputRef.current.timeoutId = setTimeout(() => {
        onChange(name, newValue, type);
      }, 100);
    };
    
    return (
      <input
        ref={inputRef}
        type={type}
        id={id}
        name={name}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    );
  };

  // Custom Select Component
  const CustomSelect = ({ id, name, value, onChange, children }) => {
    const handleChange = (e) => {
      onChange(name, e.target.value);
    };
    
    return (
      <select id={id} name={name} value={value} onChange={handleChange}>
        {children}
      </select>
    );
  };

  // Custom Checkbox Component
  const CustomCheckbox = ({ id, name, checked, onChange, label }) => {
    const handleChange = (e) => {
      onChange(name, e.target.checked, 'checkbox');
    };
    
    return (
      <div className="checkbox-item">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

  // Custom Textarea Component
  const CustomTextarea = ({ id, name, value, onChange, placeholder, rows = 3 }) => {
    const [localValue, setLocalValue] = useState(value);
    const textareaRef = useRef(null);
    
    useEffect(() => {
      setLocalValue(value);
    }, [value]);
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      
      clearTimeout(textareaRef.current?.timeoutId);
      textareaRef.current.timeoutId = setTimeout(() => {
        onChange(name, newValue);
      }, 100);
    };
    
    return (
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
      />
    );
  };

  // Tab Components with proper input handling
  const CompanyInfoTab = () => (
    <div className="form-section">
      <div className="section-title">Basic Company Information</div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyName">Company Legal Name *</label>
          <CustomInput
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="e.g., AI Innovations, Inc."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="platformName">AI Platform/Product Name *</label>
          <CustomInput
            id="platformName"
            name="platformName"
            value={formData.platformName}
            onChange={handleInputChange}
            placeholder="e.g., IntelliBot, SmartAI, DataMind"
            required
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyWebsite">Company Website</label>
          <CustomInput
            id="companyWebsite"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleInputChange}
            placeholder="https://www.yourcompany.com"
            type="url"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="businessType">Business Entity Type</label>
          <CustomSelect
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
          >
            <option value="corporation">Corporation</option>
            <option value="llc">Limited Liability Company (LLC)</option>
            <option value="partnership">Partnership</option>
            <option value="sole-proprietorship">Sole Proprietorship</option>
            <option value="other">Other</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="companyAddress">Company Address</label>
        <CustomTextarea
          id="companyAddress"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={handleInputChange}
          placeholder="Full business address including street, city, state, zip code"
          rows={3}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyContact">Legal Contact Email *</label>
          <CustomInput
            id="companyContact"
            name="companyContact"
            value={formData.companyContact}
            onChange={handleInputChange}
            placeholder="legal@yourcompany.com"
            type="email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="effectiveDate">Terms Effective Date</label>
          <CustomInput
            id="effectiveDate"
            name="effectiveDate"
            value={formData.effectiveDate}
            onChange={handleInputChange}
            placeholder="e.g., January 1, 2025"
          />
        </div>
      </div>
    </div>
  );

  const PlatformDetailsTab = () => (
    <div className="form-section">
      <div className="section-title">Platform Configuration</div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="platformType">Platform Type</label>
          <CustomSelect
            id="platformType"
            name="platformType"
            value={formData.platformType}
            onChange={handleInputChange}
          >
            <option value="saas">Software as a Service (SaaS)</option>
            <option value="api">API Service</option>
            <option value="mobile">Mobile Application</option>
            <option value="enterprise">Enterprise Solution</option>
            <option value="consumer">Consumer Application</option>
            <option value="analytics">Analytics Platform</option>
            <option value="automation">Automation Tool</option>
            <option value="creative">Creative Tool</option>
          </CustomSelect>
        </div>
        
        <div className="form-group">
          <label htmlFor="primaryFunction">Primary AI Function</label>
          <CustomSelect
            id="primaryFunction"
            name="primaryFunction"
            value={formData.primaryFunction}
            onChange={handleInputChange}
          >
            <option value="general-ai">General Purpose AI</option>
            <option value="nlp">Natural Language Processing</option>
            <option value="computer-vision">Computer Vision</option>
            <option value="predictive">Predictive Analytics</option>
            <option value="recommendation">Recommendation Engine</option>
            <option value="automation">Process Automation</option>
            <option value="creative">Creative Content Generation</option>
            <option value="analysis">Data Analysis</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience</label>
          <CustomSelect
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleInputChange}
          >
            <option value="business">Business Users</option>
            <option value="consumer">General Consumers</option>
            <option value="developer">Developers/Technical Users</option>
            <option value="research">Researchers/Academics</option>
            <option value="enterprise">Enterprise Clients</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="section-title">Data and AI Processing</div>
      
      <div className="checkbox-group">
        <CustomCheckbox
          id="dataProcessing"
          name="dataProcessing"
          checked={formData.dataProcessing}
          onChange={handleInputChange}
          label="Platform processes user data for AI operations"
        />
        
        <CustomCheckbox
          id="aiTraining"
          name="aiTraining"
          checked={formData.aiTraining}
          onChange={handleInputChange}
          label="Use user interactions to improve AI models"
        />
        
        <CustomCheckbox
          id="apiAccess"
          name="apiAccess"
          checked={formData.apiAccess}
          onChange={handleInputChange}
          label="Provide API access to third-party developers"
        />
      </div>
    </div>
  );

  const UserTermsTab = () => (
    <div className="form-section">
      <div className="section-title">User Eligibility</div>
      
      <div className="form-group">
        <label htmlFor="minAge">Minimum Age Requirement</label>
        <CustomSelect
          id="minAge"
          name="minAge"
          value={formData.minAge}
          onChange={handleInputChange}
        >
          <option value="13">13 years old (COPPA compliant)</option>
          <option value="16">16 years old (GDPR Article 8)</option>
          <option value="18">18 years old (Adult only)</option>
          <option value="21">21 years old (Restricted content)</option>
        </CustomSelect>
      </div>
      
      <div className="section-title">Account Registration Requirements</div>
      
      <div className="checkbox-group">
        {Object.entries({
          email: 'Email address',
          name: 'Full legal name',
          password: 'Secure password',
          payment: 'Payment information',
          verification: 'Email verification',
          phone: 'Phone number',
          businessInfo: 'Business information (B2B accounts)',
          identification: 'Government ID verification'
        }).map(([key, label]) => (
          <CustomCheckbox
            key={key}
            id={`accountRequirements.${key}`}
            name={`accountRequirements.${key}`}
            checked={formData.accountRequirements[key]}
            onChange={handleInputChange}
            label={label}
          />
        ))}
      </div>
      
      <div className="section-title">Prohibited Activities</div>
      
      <div className="checkbox-group">
        {Object.entries({
          illegal: 'Illegal activities and law violations',
          ipInfringement: 'Intellectual property infringement', 
          hateSpeech: 'Hate speech and harassment',
          spam: 'Spam and malicious content',
          security: 'Security circumvention attempts',
          scraping: 'Unauthorized data scraping',
          reselling: 'Reselling platform access',
          weapons: 'Weapons development',
          misinformation: 'Deliberate misinformation',
          harassment: 'User harassment and stalking',
          impersonation: 'Identity impersonation',
          malware: 'Malware creation and distribution',
          childSafety: 'Content harmful to minors',
          terrorism: 'Terrorist activity support',
          fraud: 'Fraudulent activities',
          gambling: 'Illegal gambling operations',
          adultContent: 'Explicit adult content generation',
          competitiveAnalysis: 'Competitive intelligence gathering'
        }).map(([key, label]) => (
          <CustomCheckbox
            key={key}
            id={`prohibitedActivities.${key}`}
            name={`prohibitedActivities.${key}`}
            checked={formData.prohibitedActivities[key]}
            onChange={handleInputChange}
            label={label}
          />
        ))}
      </div>
    </div>
  );
  const IPContentTab = () => (
    <div className="form-section">
      <div className="section-title">Intellectual Property Rights</div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ipOwnership">User Content Ownership</label>
          <CustomSelect
            id="ipOwnership"
            name="ipOwnership"
            value={formData.ipOwnership}
            onChange={handleInputChange}
          >
            <option value="user">User retains ownership</option>
            <option value="company">Company claims ownership</option>
            <option value="joint">Joint ownership</option>
          </CustomSelect>
        </div>
        
        <div className="form-group">
          <label htmlFor="licenseType">License to User Content</label>
          <CustomSelect
            id="licenseType"
            name="licenseType"
            value={formData.licenseType}
            onChange={handleInputChange}
          >
            <option value="limited">Limited license (service operation only)</option>
            <option value="broad">Broad license (includes AI training)</option>
            <option value="commercial">Commercial license (marketing use)</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="aiOutputOwnership">AI-Generated Content Ownership</label>
          <CustomSelect
            id="aiOutputOwnership"
            name="aiOutputOwnership"
            value={formData.aiOutputOwnership}
            onChange={handleInputChange}
          >
            <option value="user">User owns AI outputs</option>
            <option value="company">Company owns AI outputs</option>
            <option value="public">Public domain</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="section-title">Additional IP Provisions</div>
      
      <div className="checkbox-group">
        <CustomCheckbox
          id="ipFeedback"
          name="ipFeedback"
          checked={formData.ipFeedback}
          onChange={handleInputChange}
          label="License to user feedback and suggestions"
        />
        
        <CustomCheckbox
          id="ipTraining"
          name="ipTraining"
          checked={formData.ipTraining}
          onChange={handleInputChange}
          label="Right to use content for AI training"
        />
        
        <CustomCheckbox
          id="ipReverseEngineering"
          name="ipReverseEngineering"
          checked={formData.ipReverseEngineering}
          onChange={handleInputChange}
          label="Prohibit reverse engineering"
        />
        
        <CustomCheckbox
          id="ipAttribution"
          name="ipAttribution"
          checked={formData.ipAttribution}
          onChange={handleInputChange}
          label="Require attribution for AI outputs"
        />
      </div>
    </div>
  );

  const PrivacyDataTab = () => (
    <div className="form-section">
      <div className="section-title">Privacy Policy Integration</div>
      
      <div className="form-group">
        <label htmlFor="privacyPolicyUrl">Privacy Policy URL</label>
        <CustomInput
          id="privacyPolicyUrl"
          name="privacyPolicyUrl"
          value={formData.privacyPolicyUrl}
          onChange={handleInputChange}
          placeholder="https://www.yourcompany.com/privacy"
          type="url"
        />
      </div>
      
      <div className="section-title">Data Collection Purposes</div>
      
      <div className="checkbox-group">
        {Object.entries({
          service: 'Providing and maintaining the service',
          improvement: 'Improving AI models and algorithms',
          personalization: 'Personalizing user experience',
          marketing: 'Marketing and promotional activities',
          analytics: 'Analytics and usage statistics'
        }).map(([key, label]) => (
          <CustomCheckbox
            key={key}
            id={`dataCollection.${key}`}
            name={`dataCollection.${key}`}
            checked={formData.dataCollection[key]}
            onChange={handleInputChange}
            label={label}
          />
        ))}
      </div>
      
      <div className="section-title">Data Sharing</div>
      
      <div className="checkbox-group">
        <CustomCheckbox
          id="shareServiceProviders"
          name="shareServiceProviders"
          checked={formData.shareServiceProviders}
          onChange={handleInputChange}
          label="Third-party service providers"
        />
        
        <CustomCheckbox
          id="shareAffiliates"
          name="shareAffiliates"
          checked={formData.shareAffiliates}
          onChange={handleInputChange}
          label="Company affiliates"
        />
        
        <CustomCheckbox
          id="shareLegal"
          name="shareLegal"
          checked={formData.shareLegal}
          onChange={handleInputChange}
          label="Legal compliance and law enforcement"
        />
        
        <CustomCheckbox
          id="shareAcquisition"
          name="shareAcquisition"
          checked={formData.shareAcquisition}
          onChange={handleInputChange}
          label="Business transfers and acquisitions"
        />
      </div>
      
      <div className="section-title">User Rights (GDPR/CCPA)</div>
      
      <div className="checkbox-group">
        <CustomCheckbox
          id="rightAccess"
          name="rightAccess"
          checked={formData.rightAccess}
          onChange={handleInputChange}
          label="Right to access personal data"
        />
        
        <CustomCheckbox
          id="rightCorrect"
          name="rightCorrect"
          checked={formData.rightCorrect}
          onChange={handleInputChange}
          label="Right to correct inaccurate data"
        />
        
        <CustomCheckbox
          id="rightDelete"
          name="rightDelete"
          checked={formData.rightDelete}
          onChange={handleInputChange}
          label="Right to delete personal data"
        />
        
        <CustomCheckbox
          id="rightPortability"
          name="rightPortability"
          checked={formData.rightPortability}
          onChange={handleInputChange}
          label="Right to data portability"
        />
      </div>
    </div>
  );

  const PaymentTermsTab = () => (
    <div className="form-section">
      <div className="section-title">Payment Model</div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="paymentModel">Business Model</label>
          <CustomSelect
            id="paymentModel"
            name="paymentModel"
            value={formData.paymentModel}
            onChange={handleInputChange}
          >
            <option value="free">Free service</option>
            <option value="freemium">Freemium (free + paid tiers)</option>
            <option value="subscription">Subscription only</option>
            <option value="usage">Usage-based pricing</option>
            <option value="hybrid">Hybrid subscription + usage</option>
          </CustomSelect>
        </div>
        
        <div className="form-group">
          <label htmlFor="billingCycle">Billing Cycle</label>
          <CustomSelect
            id="billingCycle"
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleInputChange}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="autoRenewal">Auto-Renewal Policy</label>
          <CustomSelect
            id="autoRenewal"
            name="autoRenewal"
            value={formData.autoRenewal}
            onChange={handleInputChange}
          >
            <option value="yes">Yes, with notification</option>
            <option value="opt-in">Opt-in only</option>
            <option value="no">No auto-renewal</option>
          </CustomSelect>
        </div>
        
        <div className="form-group">
          <label htmlFor="refundPolicy">Refund Policy</label>
          <CustomSelect
            id="refundPolicy"
            name="refundPolicy"
            value={formData.refundPolicy}
            onChange={handleInputChange}
          >
            <option value="none">No refunds</option>
            <option value="limited">Limited (case-by-case)</option>
            <option value="days-7">7-day refund period</option>
            <option value="days-14">14-day refund period</option>
            <option value="days-30">30-day refund period</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="section-title">Accepted Payment Methods</div>
      
      <div className="checkbox-group">
        <CustomCheckbox
          id="acceptCreditCard"
          name="acceptCreditCard"
          checked={formData.acceptCreditCard}
          onChange={handleInputChange}
          label="Credit/Debit Cards"
        />
        
        <CustomCheckbox
          id="acceptPayPal"
          name="acceptPayPal"
          checked={formData.acceptPayPal}
          onChange={handleInputChange}
          label="PayPal"
        />
        
        <CustomCheckbox
          id="acceptCrypto"
          name="acceptCrypto"
          checked={formData.acceptCrypto}
          onChange={handleInputChange}
          label="Cryptocurrency"
        />
        
        <CustomCheckbox
          id="acceptWire"
          name="acceptWire"
          checked={formData.acceptWire}
          onChange={handleInputChange}
          label="Wire Transfer"
        />
      </div>
    </div>
  );

  const LegalDisputesTab = () => (
    <div className="form-section">
      <div className="section-title">Governing Law</div>
      
      <div className="form-group">
        <label htmlFor="governingLaw">Governing Law State</label>
        <CustomSelect
          id="governingLaw"
          name="governingLaw"
          value={formData.governingLaw}
          onChange={handleInputChange}
        >
          <option value="California">California</option>
          <option value="New York">New York</option>
          <option value="Delaware">Delaware</option>
          <option value="Texas">Texas</option>
          <option value="Florida">Florida</option>
          <option value="Illinois">Illinois</option>
          <option value="Washington">Washington</option>
          <option value="Nevada">Nevada</option>
          <option value="Colorado">Colorado</option>
          <option value="Georgia">Georgia</option>
        </CustomSelect>
      </div>
      
      <div className="section-title">Dispute Resolution</div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="disputeResolution">Resolution Method</label>
          <CustomSelect
            id="disputeResolution"
            name="disputeResolution"
            value={formData.disputeResolution}
            onChange={handleInputChange}
          >
            <option value="courts">Courts only</option>
            <option value="arbitration">Binding arbitration</option>
            <option value="mediation-first">Mediation first, then courts</option>
            <option value="mediation-arbitration">Mediation first, then arbitration</option>
          </CustomSelect>
        </div>
        
        <div className="form-group">
          <label htmlFor="arbitrationProvider">Arbitration Provider</label>
          <CustomSelect
            id="arbitrationProvider"
            name="arbitrationProvider"
            value={formData.arbitrationProvider}
            onChange={handleInputChange}
          >
            <option value="aaa">American Arbitration Association</option>
            <option value="jams">JAMS</option>
            <option value="icc">International Chamber of Commerce</option>
          </CustomSelect>
        </div>
      </div>
      
      <div className="section-title">Liability and Warranties</div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="liabilityCap">Liability Cap</label>
          <CustomSelect
            id="liabilityCap"
            name="liabilityCap"
            value={formData.liabilityCap}
            onChange={handleInputChange}
          >
            <option value="fees-paid">Fees paid in last 12 months</option>
            <option value="fees-total">Total fees paid</option>
            <option value="fixed-amount">Fixed amount</option>
            <option value="no-cap">No cap (maximum by law)</option>
          </CustomSelect>
        </div>
        
        {formData.liabilityCap === 'fixed-amount' && (
          <div className="form-group">
            <label htmlFor="fixedLiabilityAmount">Fixed Amount ($)</label>
            <CustomInput
              id="fixedLiabilityAmount"
              name="fixedLiabilityAmount"
              value={formData.fixedLiabilityAmount}
              onChange={handleInputChange}
              placeholder="1000"
              type="number"
            />
          </div>
        )}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="classAction">Class Action Waiver</label>
          <CustomSelect
            id="classAction"
            name="classAction"
            value={formData.classAction}
            onChange={handleInputChange}
          >
            <option value="yes">Include class action waiver</option>
            <option value="no">Allow class actions</option>
          </CustomSelect>
        </div>
        
        <div className="form-group">
          <label htmlFor="warrantyDisclaimer">Warranty Disclaimer</label>
          <CustomSelect
            id="warrantyDisclaimer"
            name="warrantyDisclaimer"
            value={formData.warrantyDisclaimer}
            onChange={handleInputChange}
          >
            <option value="standard">Standard disclaimer (as-is)</option>
            <option value="limited">Limited warranty</option>
          </CustomSelect>
        </div>
      </div>
    </div>
  );
  // Payment Modal Component with Transaction ID bypass
  const PaymentModal = () => {
    if (!showPaymentModal) return null;
    
    return (
      <div className="payment-overlay">
        <div className="payment-modal">
          {paymentComplete ? (
            <div className="payment-success">
              <Icon name="check-circle" size={48} style={{color: '#28a745'}} />
              <h2>Payment Successful!</h2>
              <p>You now have full access to copy and download your AI Terms of Use document.</p>
            </div>
          ) : (
            <>
              {!showTransactionInput ? (
                <>
                  <h2>Get Full Access</h2>
                  <div className="price-display">$9.99</div>
                  <p>Unlock copy and download functionality:</p>
                  <ul className="feature-list">
                    <li>Copy complete terms document to clipboard</li>
                    <li>Download as professionally formatted MS Word document</li>
                    <li>Legal compliance and risk guidance</li>
                    <li>Lifetime access to this generator</li>
                  </ul>
                  <div id="paypal-button-container" className="paypal-button-container"></div>
                  
                  <div style={{margin: '20px 0', textAlign: 'center'}}>
                    <div style={{borderTop: '1px solid #eee', margin: '20px 0', paddingTop: '20px'}}>
                      <p style={{fontSize: '0.9em', color: '#666', marginBottom: '10px'}}>
                        Already paid? Enter your PayPal transaction ID:
                      </p>
                      <button 
                        onClick={() => setShowTransactionInput(true)}
                        style={{background: '#17a2b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em'}}
                      >
                        Enter Transaction ID
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    style={{marginTop: '10px', background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2>Enter Transaction ID</h2>
                  <p style={{fontSize: '0.9em', color: '#666', marginBottom: '20px'}}>
                    Enter your 17-character PayPal transaction ID:
                  </p>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g., 5TY05013RG002845M"
                    maxLength={17}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #dee2e6',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      textAlign: 'center',
                      marginBottom: '20px'
                    }}
                  />
                  <div style={{fontSize: '0.8em', color: '#666', marginBottom: '20px'}}>
                    Transaction ID must be exactly 17 characters with uppercase letters and numbers only.
                  </div>
                  
                  <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                    <button 
                      onClick={handleTransactionSubmit}
                      disabled={!validateTransactionId(transactionId)}
                      style={{
                        background: validateTransactionId(transactionId) ? '#28a745' : '#ccc',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: validateTransactionId(transactionId) ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Unlock Access
                    </button>
                    <button 
                      onClick={() => {
                        setShowTransactionInput(false);
                        setTransactionId('');
                      }}
                      style={{background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Live Preview Component with scroll-to-view and highlighting
  const LivePreview = () => {
    // Memoize document text generation to prevent unnecessary recalculations
    const documentText = useMemo(() => {
      return generateDocumentText();
    }, [formData]);
    
    // Optimize preview rendering with highlighting
    const previewHTML = useMemo(() => {
      return documentText
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^(\d+\.\s+[A-Z\s&]+)$/gm, '<h2 id="section-$1" style="color: #0069ff; margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid #0069ff; padding-bottom: 8px;">$1</h2>')
        .replace(/^(\d+\.\d+\s+[A-Za-z\s]+)\./gm, '<h3 id="subsection-$1" style="color: #333; margin-top: 18px; margin-bottom: 8px; font-weight: 600;">$1</h3>');
    }, [documentText]);
    
    // Scroll to highlighted section when lastChanged updates with highlighting
    useEffect(() => {
      if (lastChanged && previewRef.current) {
        const timeout = setTimeout(() => {
          // Remove previous highlights
          const prevHighlighted = previewRef.current.querySelectorAll('.highlight-section');
          prevHighlighted.forEach(el => el.classList.remove('highlight-section'));
          
          // Determine which section to highlight based on current tab and changed field
          let sectionToHighlight = null;
          
          if (currentTab === 0 && (lastChanged.includes('company') || lastChanged.includes('platform') || lastChanged.includes('effective'))) {
            sectionToHighlight = previewRef.current.querySelector('h2[id*="section-1"]');
          } else if (currentTab === 1 && (lastChanged.includes('platform') || lastChanged.includes('Function') || lastChanged.includes('data'))) {
            sectionToHighlight = previewRef.current.querySelector('h2[id*="section-1"]');
          } else if (currentTab === 2 && (lastChanged.includes('minAge') || lastChanged.includes('account') || lastChanged.includes('prohibited'))) {
            sectionToHighlight = previewRef.current.querySelector('h2[id*="section-2"], h2[id*="section-3"]');
          } else if (currentTab === 3 && lastChanged.includes('ip')) {
            sectionToHighlight = previewRef.current.querySelector('h2[id*="section-4"]');
          } else if (currentTab === 4 && (lastChanged.includes('privacy') || lastChanged.includes('data'))) {
            sectionToHighlight = previewRef.current.querySelector('h2[id*="section-5"]');
          } else if (currentTab === 5 && lastChanged.includes('payment')) {
            sectionToHighlight = previewRef.current.querySelector('h2[id*="section-6"]');
          } else if (currentTab === 6 && (lastChanged.includes('governing') || lastChanged.includes('dispute') || lastChanged.includes('liability'))) {
            sectionToHighlight = previewRef.current.querySelector('h2[id*="section-10"], h2[id*="section-9"]');
          }
          
          // Highlight and scroll to the relevant section
          if (sectionToHighlight) {
            sectionToHighlight.classList.add('highlight-section');
            
            // Find the next few elements to highlight as well
            let currentElement = sectionToHighlight.nextElementSibling;
            let elementsHighlighted = 0;
            while (currentElement && elementsHighlighted < 3 && !currentElement.tagName.match(/^H[12]$/)) {
              currentElement.classList.add('highlight-section');
              currentElement = currentElement.nextElementSibling;
              elementsHighlighted++;
            }
            
            // Scroll to the highlighted section
            sectionToHighlight.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            
            // Remove highlights after 3 seconds
            setTimeout(() => {
              const highlightedElements = previewRef.current.querySelectorAll('.highlight-section');
              highlightedElements.forEach(el => el.classList.remove('highlight-section'));
            }, 3000);
          }
        }, 200);
        
        return () => clearTimeout(timeout);
      }
    }, [lastChanged, currentTab]);
    
    return (
      <div className="preview-panel">
        <div className="preview-header">
          <h3 className="preview-title">
            <Icon name="file-text" size={20} style={{marginRight: '8px'}} />
            Live Preview - AI Terms of Use
            {!isPaid && <span className="premium-badge">Payment Required for Copy/Download</span>}
          </h3>
        </div>
        
        <div 
          className="preview-content"
          ref={previewRef}
          style={{
            userSelect: 'text',
            pointerEvents: 'auto'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
        </div>
      </div>
    );
  };

  // Render current tab content
  const renderTabContent = () => {
    switch(currentTab) {
      case 0: return <CompanyInfoTab />;
      case 1: return <PlatformDetailsTab />;
      case 2: return <UserTermsTab />;
      case 3: return <IPContentTab />;
      case 4: return <PrivacyDataTab />;
      case 5: return <PaymentTermsTab />;
      case 6: return <LegalDisputesTab />;
      case 7: return (
        <div className="finalization-tab">
          <div className="section-title">Document Summary & Risk Analysis</div>
          <div className="finalization-summary">
            <div className="summary-item">
              <span>Company:</span>
              <span className="summary-value">{formData.companyName || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span>Platform:</span>
              <span className="summary-value">{formData.platformName || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span>Platform Type:</span>
              <span className="summary-value">{formData.platformType}</span>
            </div>
            <div className="summary-item">
              <span>Minimum Age:</span>
              <span className="summary-value">{formData.minAge} years</span>
            </div>
            <div className="summary-item">
              <span>Governing Law:</span>
              <span className="summary-value">{formData.governingLaw}</span>
            </div>
          </div>
          
          <div className="risk-analysis">
            <h4>Risk Assessment</h4>
            <div className="risk-item">
              <span className="risk-level risk-low">LOW</span>
              <span>Standard age restrictions and user requirements</span>
            </div>
            <div className="risk-item">
              <span className="risk-level risk-medium">MEDIUM</span>
              <span>AI-specific clauses require careful implementation</span>
            </div>
            <div className="risk-item">
              <span className="risk-level risk-low">LOW</span>
              <span>Comprehensive prohibited activities coverage</span>
            </div>
            <div className="risk-item">
              <span className="risk-level risk-green">GOOD</span>
              <span>Privacy and data protection provisions included</span>
            </div>
          </div>
          
          <div style={{marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px'}}>
            <h4>Legal Recommendations</h4>
            <ul style={{margin: 0, paddingLeft: '20px'}}>
              <li>Have terms reviewed by qualified legal counsel before deployment</li>
              <li>Ensure compliance with jurisdiction-specific AI regulations</li>
              <li>Regularly update terms to reflect product changes</li>
              <li>Implement proper user notification for terms updates</li>
              <li>Consider additional protections for sensitive AI applications</li>
            </ul>
          </div>
        </div>
      );
      default: return <CompanyInfoTab />;
    }
  };

  // Main render function
  return (
    <div className="container">
      <div className="header">
        <h1>
          <Icon name="cpu" size={32} style={{marginRight: '12px', verticalAlign: 'middle'}} />
          AI Platform Terms of Use Generator
        </h1>
        <p>Create comprehensive, legally-sound Terms of Use for your AI platform with advanced customization options</p>
      </div>
      
      <div className="generator-wrapper">
        <div className="options-panel">
          <div className="tabs">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`tab-button ${currentTab === index ? 'active' : ''}`}
                onClick={() => goToTab(index)}
              >
                <Icon name={tab.icon} size={16} style={{marginRight: '6px'}} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="tab-content active">
            {renderTabContent()}
          </div>
          
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className="nav-button prev-button"
              disabled={currentTab === 0}
            >
              <Icon name="chevron-left" size={16} />
              Previous
            </button>
            
            <button
              onClick={copyToClipboard}
              className="nav-button copy-button"
            >
              <Icon name="copy" size={16} />
              Copy to Clipboard
            </button>
            
            <button
              onClick={downloadAsWord}
              className="nav-button download-button"
            >
              <Icon name="download" size={16} />
              Download MS Word
            </button>
            
            <button
              onClick={() => window.open('https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting', '_blank')}
              className="nav-button consult-button"
            >
              <Icon name="calendar" size={16} />
              Consult
            </button>
            
            <button
              onClick={nextTab}
              className="nav-button next-button"
              disabled={currentTab === tabs.length - 1}
            >
              Next
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </div>
        
        <LivePreview />
      </div>
      
      <PaymentModal />
    </div>
  );
};

// Render the app
ReactDOM.render(<AITermsGenerator />, document.getElementById('root'));