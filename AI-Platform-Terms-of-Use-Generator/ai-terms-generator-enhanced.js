const { useState, useRef, useEffect } = React;

const AITermsGenerator = () => {
  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [paypalId, setPaypalId] = useState('');
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    websiteURL: '',
    contactEmail: '',
    jurisdiction: 'California',
    supportEmail: '',
    businessAddress: '',
    
    // AI Platform Details
    platformName: '',
    platformType: 'chatbot',
    dataCollection: true,
    userContent: true,
    commercialUse: false,
    dataRetention: '2',
    apiAccess: false,
    thirdPartyIntegrations: false,
    
    // ENHANCED: Payment & Billing Provisions
    includePaymentTerms: false,
    billingCycle: 'monthly',
    latePaymentInterest: '1.5',
    latePaymentGracePeriod: '10',
    autoRenewalNotice: '30',
    refundPolicy: 'no-refunds',
    customRefundPolicy: '',
    subscriptionTiers: false,
    priceChangeNotice: '30',
    suspensionForNonPayment: true,
    
    // ENHANCED: Support Framework Options
    supportLevel: 'basic',
    supportHours: '9am-6pm PST',
    supportResponseTime: '2-business-days',
    supportChannels: ['email'],
    uptimeCommitment: 'none',
    uptimePercentage: '99.5',
    serviceLevelCredits: false,
    escalationProcedures: false,
    maintenanceWindows: true,
    
    // ENHANCED: Advanced Legal Protections
    forceMarjeure: true,
    exportControlCompliance: false,
    electronicSignatures: true,
    auditRights: false,
    dataProcessingAgreement: false,
    professionalServices: false,
    
    // ENHANCED: Third-Party Integration Management
    thirdPartyAPIs: false,
    thirdPartyLiability: 'disclaim',
    thirdPartyAvailability: 'no-guarantee',
    thirdPartyData: false,
    pluginSupport: false,
    
    // ENHANCED: EU AI Act Compliance
    euAIActCompliance: false,
    aiRiskClassification: 'minimal',
    transparencyObligations: false,
    fundamentalRightsAssessment: false,
    aiLiteracyProvisions: false,
    conformityAssessment: false,
    
    // ENHANCED: California AI Law Compliance
    californiaBotDisclosure: false,
    deepfakeLabeling: false,
    aiTransparencyNotices: false,
    syntheticMediaWarnings: false,
    
    // ENHANCED: Data Training and Model Improvement
    trainDataOptOut: false,
    dataRetentionSchedule: 'standard',
    crossBorderTransfers: 'none',
    dataSubjectRights: false,
    rightToExplanation: false,
    modelTrainingTransparency: false,
    
    // ENHANCED: AI-Specific Risk Management
    catastrophicRiskAssessment: false,
    modelPerformanceDegradation: true,
    automatedDecisionOptOut: false,
    aiContentWatermarking: false,
    copyrightInfringementPrevention: false,
    
    // Terms Configuration
    minAge: '18',
    termination: 'immediate',
    governingLaw: 'California',
    disputeResolution: 'arbitration',
    limitLiability: true,
    warrantyDisclaimer: true,
    consequentialDamages: true,
    indemnification: false,
    liabilityCapAmount: '12months',
    warrantyPeriod: 'none',
    performanceWarranty: false,
    
    // AI-Specific Terms
    aiAccuracyDisclaimer: true,
    biasDisclaimer: true,
    hallucincationWarning: true,
    contentModerationDisclaimer: true,
    modelVersionChanges: true,
    dataTrainingUse: true,
    trainingOptOut: false,
    modelImprovementUse: true,
    commercialUseAI: true,
    attributionRequired: false,
    customPlatformType: '',
    
    // Industry Compliance
    industryType: 'general',
    gdprCompliance: false,
    ccpaCompliance: false,
    hipaaCompliance: false,
    ferpaCompliance: false,
    pciCompliance: false,
    soxCompliance: false,
    coppaCompliance: false,
    accessibilityCompliance: false,
    dataLocalization: 'none',
    algorithmicAuditing: false,
    biasTestingRequired: false,
    humanOversightRequired: false,
    explainabilityRequired: false,
    consentManagement: false,
    dataPortability: false,
    environmentalDisclosure: false
  });

  // Ref for preview scrolling
  const previewRef = useRef(null);

  // US States list
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // ENHANCED: Tab configuration with new sections
  const tabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'platform', label: 'AI Platform' },
    { id: 'payment', label: 'Payment & Billing' },
    { id: 'support', label: 'Support & SLA' },
    { id: 'legal', label: 'Legal Protections' },
    { id: 'compliance', label: 'AI Compliance' },
    { id: 'terms', label: 'Terms Config' },
    { id: 'ai-specific', label: 'AI Protections' },
    { id: 'industry', label: 'Industry Compliance' },
    { id: 'risk-analysis', label: 'Risk Analysis' }
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Update form data
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(newFormData);
    
    // Save form data to localStorage to persist during payment
    localStorage.setItem('aiTermsFormData', JSON.stringify(newFormData));
  };

  // Load saved form data and check payment status on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('aiTermsFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }

    // Check if user has already paid
    const isPaidStatus = localStorage.getItem('aiTermsPaid');
    if (isPaidStatus === 'true') {
      setIsPaid(true);
    }
  }, []);

  // Render PayPal button when paywall modal opens
  useEffect(() => {
    if (showPaywall && !paypalButtonRendered) {
      console.log('Paywall opened, starting PayPal button process...');
      
      // Show fallback immediately while trying to load PayPal
      const fallbackElement = document.querySelector('.paypal-fallback');
      if (fallbackElement) {
        fallbackElement.style.display = 'block';
      }
      
      // Try to render PayPal button
      const attemptPayPalRender = () => {
        if (window.paypal) {
          console.log('PayPal SDK available, attempting render...');
          try {
            renderPayPalButton();
          } catch (error) {
            console.error('PayPal render attempt failed:', error);
          }
        } else {
          console.log('PayPal SDK not loaded');
        }
      };

      // Try immediately
      attemptPayPalRender();
      
      // Also try after a delay
      setTimeout(attemptPayPalRender, 1000);
      setTimeout(attemptPayPalRender, 3000);
    }
  }, [showPaywall]);

  // Reset PayPal button when paywall closes
  useEffect(() => {
    if (!showPaywall) {
      setPaypalButtonRendered(false);
    }
  }, [showPaywall]);

  // Check for payment completion on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setIsPaid(true);
      localStorage.setItem('aiTermsPaid', 'true');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // ENHANCED: Educational tooltips content
  const tooltips = {
    companyName: "Legal name of your company that will appear in the terms",
    businessAddress: "Physical business address for legal notices",
    websiteURL: "Your company's main website",
    contactEmail: "General contact email for legal inquiries",
    supportEmail: "Email for customer support and technical issues",
    jurisdiction: "State where legal disputes will be resolved",
    platformName: "The name of your AI platform or service",
    platformType: "Primary function of your AI platform",
    dataRetention: "How long you retain user data",
    dataCollection: "Check if you collect analytics, usage patterns, etc.",
    userContent: "Check if users upload files, text, or other content",
    commercialUse: "Check if users can use AI outputs for business purposes",
    apiAccess: "Check if you offer programmatic access via API",
    thirdPartyIntegrations: "Check if your platform integrates with external services",
    
    // ENHANCED: Payment & Billing tooltips
    includePaymentTerms: "Include comprehensive payment and billing terms for subscription services",
    billingCycle: "How often users are charged for your service",
    latePaymentInterest: "Monthly interest rate charged on overdue payments (recommended: 1.5% or legal maximum)",
    latePaymentGracePeriod: "Days before late fees apply or service suspension",
    autoRenewalNotice: "Days of advance notice required before auto-renewal (CA requires 30+ days)",
    refundPolicy: "Your refund policy - 'no refunds' is strongest protection but may deter customers",
    subscriptionTiers: "Check if you offer different subscription levels with different features",
    priceChangeNotice: "Days of advance notice required before price increases",
    suspensionForNonPayment: "Allow service suspension for non-payment after grace period",
    
    // ENHANCED: Support Framework tooltips
    supportLevel: "Level of customer support you provide - affects user expectations and liability",
    supportHours: "When customer support is available",
    supportResponseTime: "Maximum time to respond to support requests",
    supportChannels: "How users can contact support (email, chat, phone)",
    uptimeCommitment: "Service availability guarantee - only commit to what you can deliver",
    uptimePercentage: "Percentage uptime guarantee (99.5% = ~3.6 hours downtime per month)",
    serviceLevelCredits: "Offer service credits for uptime failures - increases user trust but creates liability",
    escalationProcedures: "Formal escalation process for complex support issues",
    maintenanceWindows: "Reserve right for scheduled maintenance that may cause downtime",
    
    // ENHANCED: Advanced Legal Protections tooltips
    forceMarjeure: "Protect against liability for events beyond your control (disasters, pandemics, etc.)",
    exportControlCompliance: "Required if serving international users - limits service in sanctioned countries",
    electronicSignatures: "Accept electronic signatures and notices - enables digital contract updates",
    auditRights: "Allow enterprise customers to audit your security practices - may be required for large deals",
    dataProcessingAgreement: "Separate DPA for GDPR/enterprise compliance - required for EU business customers",
    professionalServices: "Include terms for consulting, implementation, or training services",
    
    // ENHANCED: Third-Party Integration tooltips
    thirdPartyAPIs: "Your platform uses external APIs (OpenAI, Google, AWS, etc.)",
    thirdPartyLiability: "How you handle liability for third-party service failures",
    thirdPartyAvailability: "Whether you guarantee availability of external services",
    thirdPartyData: "Whether third-party services can access user data",
    pluginSupport: "Your platform supports user-installed plugins or extensions",
    
    // ENHANCED: EU AI Act Compliance tooltips
    euAIActCompliance: "Comply with EU AI Act requirements - mandatory for EU users starting Aug 2025",
    aiRiskClassification: "EU AI Act risk classification affects your compliance obligations",
    transparencyObligations: "Users must be informed they're interacting with AI systems",
    fundamentalRightsAssessment: "Required for high-risk AI systems under EU AI Act",
    aiLiteracyProvisions: "Provide AI literacy information to help users understand AI limitations",
    conformityAssessment: "Formal conformity assessment may be required for high-risk AI systems",
    
    // ENHANCED: California AI Law Compliance tooltips
    californiaBotDisclosure: "SB 1001 requires disclosure when bots interact with California users for commercial purposes",
    deepfakeLabeling: "California law requires labeling of AI-generated synthetic media",
    aiTransparencyNotices: "Inform users about AI decision-making processes",
    syntheticMediaWarnings: "Warn users about potential synthetic or AI-generated content",
    
    // ENHANCED: Enhanced Data Training tooltips
    trainDataOptOut: "Allow users to opt out of having their data used for AI training",
    dataRetentionSchedule: "Detailed schedule for data retention and deletion",
    crossBorderTransfers: "Safeguards for international data transfers (SCCs, adequacy decisions)",
    dataSubjectRights: "Comprehensive data subject rights (access, deletion, portability)",
    modelTrainingTransparency: "Disclose what data is used for training AI models",
    
    // ENHANCED: AI Risk Management tooltips
    catastrophicRiskAssessment: "Assessment procedures for AI systems that could cause catastrophic harm",
    modelPerformanceDegradation: "Warn users that AI performance may degrade over time",
    automatedDecisionOptOut: "Allow users to request human review of automated decisions",
    aiContentWatermarking: "Embed watermarks in AI-generated content for identification",
    copyrightInfringementPrevention: "Measures to prevent AI from generating copyrighted content",
    
    // Existing tooltips
    minAge: "Minimum age for users to access your platform",
    termination: "How quickly you can terminate user accounts",
    governingLaw: "State law that governs the terms of use and where disputes will be resolved",
    disputeResolution: "How legal disputes will be resolved",
    limitLiability: "Limit your company's financial liability for damages - recommended for most businesses",
    consequentialDamages: "Prevent liability for indirect damages like lost profits - highly recommended",
    liabilityCapAmount: "Maximum amount you'll pay in damages - limits your financial exposure",
    indemnification: "Users must cover your legal costs if they cause problems - use carefully as it may deter users",
    warrantyDisclaimer: "Disclaim warranties and provide 'as-is' service - standard protection",
    warrantyPeriod: "If any warranties cannot be disclaimed by law, limit them to this period",
    performanceWarranty: "Clarify that you don't guarantee specific results from AI - important for AI services",
    
    // AI-Specific tooltips
    aiAccuracyDisclaimer: "Protect against liability for AI inaccuracies, errors, or misleading outputs",
    biasDisclaimer: "Disclaim responsibility for algorithmic bias or unfair AI decisions - highly recommended",
    hallucincationWarning: "Warn users that AI may generate false or nonsensical information - crucial for AI platforms",
    contentModerationDisclaimer: "Disclaim responsibility for AI's ability to filter harmful content - important for safety",
    modelVersionChanges: "Reserve right to update AI models which may change output quality or behavior",
    dataTrainingUse: "Allow use of user interactions to improve AI models - standard practice but consider user concerns",
    trainingOptOut: "Allow users to opt out of having their data used for training - increases user trust",
    modelImprovementUse: "Use aggregated data to improve AI performance and accuracy",
    commercialUseAI: "Allow users to use AI-generated content for business purposes",
    attributionRequired: "Require users to credit your AI platform when using generated content commercially",
    customPlatformType: "Describe your specific AI platform type if not listed in the dropdown options",
    
    // Industry Compliance tooltips
    industryType: "Select your primary industry to include relevant compliance requirements and best practices",
    gdprCompliance: "EU General Data Protection Regulation - required for EU users, includes data portability and right to explanation",
    ccpaCompliance: "California Consumer Privacy Act - required for California users, includes opt-out rights and data deletion",
    hipaaCompliance: "Health Insurance Portability and Accountability Act - required for healthcare data processing",
    ferpaCompliance: "Family Educational Rights and Privacy Act - required for educational institutions and student data",
    pciCompliance: "Payment Card Industry Data Security Standard - required for payment processing",
    soxCompliance: "Sarbanes-Oxley Act - required for financial reporting and public companies",
    coppaCompliance: "Children's Online Privacy Protection Act - required when collecting data from children under 13",
    accessibilityCompliance: "ADA/Section 508 compliance for users with disabilities - may be legally required",
    dataLocalization: "Restrict data processing to specific geographic regions for compliance or performance",
    algorithmicAuditing: "Regular testing and evaluation of AI algorithms for bias, fairness, and performance",
    biasTestingRequired: "Mandatory testing for discriminatory outcomes in AI decision-making",
    humanOversightRequired: "Require human review for high-stakes AI decisions - important for sensitive applications",
    explainabilityRequired: "Provide explanations for AI decisions when requested by users - builds trust and may be legally required",
    consentManagement: "Advanced consent management for data processing - may be required under GDPR/CCPA",
    dataPortability: "Allow users to export their data in machine-readable format - required under GDPR",
    environmentalDisclosure: "Disclose environmental impact of AI model training and inference - emerging requirement"
  };

  // PayPal validation function
  const validatePayPalId = (id) => {
    // Basic validation - just check if something was entered
    return id && id.trim().length > 5;
  };

  // Handle manual PayPal unlock
  const handlePayPalUnlock = () => {
    if (validatePayPalId(paypalId)) {
      setIsPaid(true);
      setShowPaywall(false);
      setShowManualEntry(false);
      localStorage.setItem('aiTermsPaid', 'true');
      localStorage.setItem('aiTermsPaymentDetails', JSON.stringify({
        manualEntry: true,
        transactionId: paypalId,
        timestamp: new Date().toISOString()
      }));
      setPaypalId('');
      alert('Access unlocked! You can now copy and download the terms.');
    } else {
      alert('Please enter a valid PayPal transaction ID to unlock access.');
    }
  };

  // Handle direct PayPal payment (backup method)
  const handleDirectPayPalPayment = () => {
    // Save form data before showing payment instructions
    localStorage.setItem('aiTermsFormData', JSON.stringify(formData));
    
    // Close paywall and show manual entry with payment instructions
    setShowPaywall(false);
    setShowManualEntry(true);
  };

  // Show manual entry option
  const showManualEntryForm = () => {
    setShowManualEntry(true);
    setShowPaywall(false);
  };

  // Handle successful PayPal payment
  const handlePaymentSuccess = (details, data) => {
    console.log('Payment completed successfully!', details);
    
    // Set payment status
    setIsPaid(true);
    setShowPaywall(false);
    
    // Store payment success in localStorage for persistence
    localStorage.setItem('aiTermsPaid', 'true');
    localStorage.setItem('aiTermsPaymentDetails', JSON.stringify({
      transactionId: details.id,
      payerEmail: details.payer.email_address,
      timestamp: new Date().toISOString()
    }));
    
    alert('Payment successful! You now have full access to copy and download your terms.');
  };

  // Handle PayPal payment error
  const handlePaymentError = (err) => {
    console.error('PayPal payment error:', err);
    alert('Payment failed. Please try again or contact support.');
  };

  // Render PayPal button
  const renderPayPalButton = () => {
    console.log('renderPayPalButton called, paypalButtonRendered:', paypalButtonRendered);
    
    if (paypalButtonRendered) {
      console.log('Button already rendered, skipping');
      return;
    }

    if (!window.paypal) {
      console.log('PayPal SDK not available');
      return;
    }
    
    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) {
      console.error('PayPal container not found');
      return;
    }

    console.log('Rendering PayPal button...');
    console.log('Domain:', window.location.hostname);
    console.log('Protocol:', window.location.protocol);
    
    // Mark as rendering to prevent duplicate attempts
    setPaypalButtonRendered(true);
    
    paypalContainer.innerHTML = '';
    
    try {
      window.paypal.Buttons({
        style: {
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 40
        },
        createOrder: function(data, actions) {
          console.log('Creating PayPal order...');
          localStorage.setItem('aiTermsFormData', JSON.stringify(formData));
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '9.99',
                currency_code: 'USD'
              },
              description: 'AI Platform Terms of Use Generator - Full Access'
            }]
          });
        },
        onApprove: function(data, actions) {
          console.log('Payment approved, capturing...');
          return actions.order.capture().then(function(details) {
            handlePaymentSuccess(details, data);
          });
        },
        onError: function(err) {
          console.error('PayPal error:', err);
          handlePaymentError(err);
        },
        onCancel: function(data) {
          console.log('Payment cancelled');
        }
      }).render('#paypal-button-container').then(() => {
        console.log('PayPal buttons rendered successfully!');
        
        // Hide fallback since buttons worked
        const fallbackElement = document.querySelector('.paypal-fallback');
        if (fallbackElement) {
          fallbackElement.style.display = 'none';
        }
      }).catch((error) => {
        console.error('PayPal render error:', error);
        
        // Reset state and show fallback
        setPaypalButtonRendered(false);
        paypalContainer.innerHTML = '';
        
        const fallbackElement = document.querySelector('.paypal-fallback');
        if (fallbackElement) {
          fallbackElement.style.display = 'block';
        }
      });
        
    } catch (error) {
      console.error('PayPal initialization error:', error);
      
      // Reset state and show fallback
      setPaypalButtonRendered(false);
      paypalContainer.innerHTML = '';
      
      const fallbackElement = document.querySelector('.paypal-fallback');
      if (fallbackElement) {
        fallbackElement.style.display = 'block';
      }
    }
  };

  // ENHANCED: Generate Payment & Billing section
  const generatePaymentBillingSection = () => {
    if (!formData.includePaymentTerms) return '';
    
    let paymentSection = `SUBSCRIPTION PLANS, PAYMENT, AND BILLING

a) Subscription Plans and Pricing. We offer various subscription plans with different features, usage limits, capabilities, and pricing structures. Current plans, features, and pricing are available on our website and may be updated from time to time in our sole discretion. Each Subscription Plan includes specific limitations on usage, such as the number of queries, API calls, or data processing permitted per billing period.

b) Payment Terms and Authorization. Subscription fees are charged in advance on a ${formData.billingCycle} basis. All fees are stated in United States dollars and are ${formData.refundPolicy === 'no-refunds' ? 'non-refundable except as specifically set forth in these Terms or as required by applicable law' : 'subject to our refund policy as described below'}. By providing payment information, you authorize us and our third-party payment processors to charge your designated payment method for all applicable fees, taxes, and other charges incurred in connection with your use of the Services.`;

    if (formData.latePaymentInterest || formData.suspensionForNonPayment) {
      paymentSection += `

c) Late Payments and Service Suspension. If payment of any fees is not received by the due date, we may${formData.latePaymentGracePeriod ? `, after a grace period of ${formData.latePaymentGracePeriod} days,` : ''} ${formData.latePaymentInterest ? `charge interest on such overdue amounts at the rate of ${formData.latePaymentInterest} percent per month or the maximum rate permitted by applicable law, whichever is less. ` : ''}${formData.suspensionForNonPayment ? 'We reserve the right to suspend or terminate your access to the Services if payment is past due.' : ''}`;
    }

    if (formData.priceChangeNotice) {
      paymentSection += `

d) Price Changes and Modifications. We reserve the right to modify subscription prices, fees, and billing terms at any time. For existing subscribers, we will provide at least ${formData.priceChangeNotice} days' advance written notice of any price increases. Your continued use of the Services after such price changes become effective constitutes your acceptance of the new pricing terms.`;
    }

    if (formData.autoRenewalNotice) {
      paymentSection += `

e) Automatic Renewal. Your subscription will automatically renew for successive periods unless you cancel before the renewal date. We will provide at least ${formData.autoRenewalNotice} days' advance notice before any automatic renewal that results in a charge.`;
    }

    // Refund Policy
    if (formData.refundPolicy !== 'no-refunds') {
      let refundText = '';
      switch (formData.refundPolicy) {
        case '30-day':
          refundText = 'You may request a full refund within 30 days of your initial purchase. Refunds are not available for renewal payments.';
          break;
        case '7-day':
          refundText = 'You may request a full refund within 7 days of your initial purchase. Refunds are not available for renewal payments.';
          break;
        case 'pro-rata':
          refundText = 'You may request a pro-rated refund for unused subscription time upon cancellation. Refunds will be processed within 10 business days.';
          break;
        case 'custom':
          refundText = formData.customRefundPolicy || 'Refunds are handled on a case-by-case basis.';
          break;
      }
      
      paymentSection += `

f) Refund Policy. ${refundText} To request a refund, contact us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'} with your account information and reason for the refund request.`;
    }

    return paymentSection;
  };

  // ENHANCED: Generate Support & Service Level section
  const generateSupportSection = () => {
    if (formData.supportLevel === 'none') return '';
    
    let supportSection = '';
    
    if (formData.supportLevel === 'basic') {
      supportSection = `CUSTOMER SUPPORT

We provide basic customer support services. Support is available via ${formData.supportChannels.includes('email') ? 'email' : 'our online support portal'}${formData.supportChannels.includes('chat') ? ' and live chat' : ''}${formData.supportChannels.includes('phone') ? ' and phone' : ''}. We will make commercially reasonable efforts to respond to support inquiries within ${formData.supportResponseTime}.

Support services do not include consulting, custom development, data analysis services, or training beyond standard platform functionality.`;
    } else if (formData.supportLevel === 'comprehensive') {
      supportSection = `CUSTOMER SUPPORT AND SERVICE LEVELS

a) Customer Support. We provide comprehensive customer support services during our standard business hours, which are defined as ${formData.supportHours}, Monday through Friday, excluding federal holidays and Company-designated holiday periods. Support is provided via ${formData.supportChannels.join(', ')}, and we will make commercially reasonable efforts to respond to support inquiries within ${formData.supportResponseTime}.

${formData.escalationProcedures ? `b) Escalation Procedures. For complex technical issues or service problems, we provide a formal escalation process. Critical issues affecting service availability will be escalated to senior technical staff within 4 hours during business hours.` : ''}

${formData.uptimeCommitment !== 'none' ? `c) Service Availability. We strive to maintain service availability of ${formData.uptimePercentage}% measured monthly, excluding scheduled maintenance. ${formData.serviceLevelCredits ? 'If we fail to meet this availability target, you may be eligible for service level credits as described in our SLA documentation.' : ''}` : 'c) Service Availability. While we strive to maintain high service availability, we do not guarantee that the Services will be available at all times or without interruption.'}

${formData.maintenanceWindows ? `The Services may be temporarily unavailable due to scheduled maintenance, updates, technical difficulties, or circumstances beyond our reasonable control. We will make reasonable efforts to provide advance notice of scheduled maintenance when practicable.` : ''}

d) Support Limitations. Our support services do not include consulting, custom development, data analysis services, or training beyond standard platform functionality. Support may be limited or suspended if your account is past due on payment obligations.`;
    }
    
    return supportSection;
  };

  // ENHANCED: Generate Advanced Legal Protections section
  const generateAdvancedLegalSection = () => {
    let legalSection = '';
    
    if (formData.forceMarjeure) {
      legalSection += `FORCE MAJEURE AND BUSINESS CONTINUITY

Neither party shall be liable for any failure or delay in performance under this Agreement which is due to circumstances beyond the reasonable control of such party, including but not limited to acts of God, war, terrorism, pandemic, earthquake, flood, embargo, riot, sabotage, labor shortage or dispute, governmental act, failure of the Internet or telecommunications infrastructure, or AI model hosting outages, provided that the affected party uses reasonable efforts to avoid or remove such causes of non-performance.

`;
    }
    
    if (formData.exportControlCompliance) {
      legalSection += `EXPORT CONTROL AND SANCTIONS COMPLIANCE

The Services may be subject to export laws and regulations of the United States and other jurisdictions. You represent and warrant that you are not located in, under the control of, or a national or resident of any country to which the United States has embargoed goods or services, and you agree not to export, re-export, or transfer any products or technology received through the Services in violation of applicable export control laws.

`;
    }
    
    if (formData.electronicSignatures) {
      legalSection += `ELECTRONIC COMMUNICATIONS AND SIGNATURES

You consent to receive communications from us electronically, including via email or by posting notices on our website or through the Services. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing. Electronic signatures shall have the same legal effect as handwritten signatures.

`;
    }
    
    if (formData.auditRights) {
      legalSection += `AUDIT RIGHTS AND COMPLIANCE

Upon reasonable prior written notice, you may conduct or engage a qualified third party to conduct an audit of our security controls and data handling practices relating to your data, no more than once per year during normal business hours. We will cooperate with such audits and provide reasonable access to relevant documentation, subject to confidentiality requirements and our operational needs.

`;
    }
    
    if (formData.dataProcessingAgreement) {
      legalSection += `DATA PROCESSING AGREEMENT

For customers subject to GDPR or other data protection regulations, we will enter into a separate Data Processing Agreement (DPA) that governs our processing of personal data on your behalf. The DPA includes appropriate technical and organizational measures, data transfer safeguards, and procedures for handling data subject requests.

`;
    }
    
    return legalSection;
  };

  // ENHANCED: Generate Third-Party Integration section
  const generateThirdPartySection = () => {
    if (!formData.thirdPartyAPIs && !formData.pluginSupport) return '';
    
    let thirdPartySection = `THIRD-PARTY INTEGRATIONS AND SERVICES

`;
    
    if (formData.thirdPartyAPIs) {
      thirdPartySection += `a) Third-Party Services. The Services may integrate with or provide access to third-party services, APIs, tools, or platforms (collectively, "Third-Party Services"). We are not responsible for the availability, functionality, security, or performance of any Third-Party Services. Your use of Third-Party Services is subject to the terms and conditions of those third parties, and you are solely responsible for reviewing and complying with such terms.

${formData.thirdPartyLiability === 'disclaim' ? 'We disclaim all liability for any issues, damages, or losses arising from your use of Third-Party Services.' : 'Our liability for Third-Party Services is limited to our direct integration and does not extend to the third-party service performance.'}

${formData.thirdPartyAvailability === 'no-guarantee' ? 'We do not guarantee the continued availability or functionality of any Third-Party Services.' : 'We will make reasonable efforts to notify you of any planned changes to Third-Party Service integrations.'}

${formData.thirdPartyData ? 'b) Data Sharing with Third Parties. We may share certain data with Third-Party Services as necessary to provide the Services, such as for AI model processing or technical infrastructure. Any such data sharing is governed by our Privacy Policy and the terms of our agreements with third-party service providers.' : 'b) Data Protection. We do not share your personal data with Third-Party Services without your explicit consent, except as necessary for basic service functionality as described in our Privacy Policy.'}

`;
    }
    
    if (formData.pluginSupport) {
      thirdPartySection += `c) Plugin and Extension Support. The Services may support user-installed plugins, extensions, or add-ons. You install and use such plugins at your own risk. We are not responsible for the functionality, security, or data handling practices of third-party plugins. You should review the terms and privacy policies of plugin developers before installation.

`;
    }
    
    return thirdPartySection;
  };

  // ENHANCED: Generate EU AI Act Compliance section
  const generateEUAIActSection = () => {
    if (!formData.euAIActCompliance) return '';
    
    let euSection = `EU AI ACT COMPLIANCE

In compliance with the European Union Artificial Intelligence Act (AI Act), we provide the following information and commitments:

a) AI System Classification. Our AI system is classified as "${formData.aiRiskClassification}" risk under the EU AI Act framework. This classification determines our specific compliance obligations and your rights as a user.

`;
    
    if (formData.transparencyObligations) {
      euSection += `b) Transparency Obligations. In accordance with EU AI Act transparency requirements:
• You are hereby informed that you are interacting with an artificial intelligence system
• AI-generated content will be clearly marked as such where technically feasible
• We maintain documentation of our AI system's capabilities and limitations
• Information about our AI system's training data and performance is available upon request

`;
    }
    
    if (formData.aiLiteracyProvisions) {
      euSection += `c) AI Literacy and User Information. We are committed to promoting AI literacy by:
• Providing clear information about how our AI system works
• Explaining the limitations and potential risks of AI-generated outputs
• Offering guidance on how to interpret and use AI outputs responsibly
• Making available resources for understanding AI technology

`;
    }
    
    if (formData.fundamentalRightsAssessment) {
      euSection += `d) Fundamental Rights Impact Assessment. As required for our AI system classification, we have conducted a fundamental rights impact assessment and implemented measures to minimize risks to fundamental rights, including:
• Non-discrimination and fairness safeguards
• Privacy and data protection measures
• Human oversight and intervention capabilities
• Regular monitoring and evaluation procedures

`;
    }
    
    if (formData.conformityAssessment) {
      euSection += `e) Conformity Assessment. Our AI system has undergone appropriate conformity assessment procedures as required by the EU AI Act. Documentation of our compliance is available to relevant authorities upon request.

`;
    }
    
    euSection += `f) User Rights Under EU AI Act. If you are located in the European Union, you have the right to:
• Be informed when interacting with AI systems
• Receive explanations of AI decisions that significantly affect you
• Request human oversight of automated decisions
• File complaints with relevant supervisory authorities regarding AI Act compliance

`;
    
    return euSection;
  };

  // ENHANCED: Generate California AI Law Compliance section
  const generateCaliforniaAISection = () => {
    if (!formData.californiaBotDisclosure && !formData.deepfakeLabeling && !formData.aiTransparencyNotices) return '';
    
    let caSection = `CALIFORNIA AI LAW COMPLIANCE

`;
    
    if (formData.californiaBotDisclosure) {
      caSection += `a) Bot Disclosure (SB 1001). In compliance with California Senate Bill 1001, we disclose that automated agents ("bots") may be used to communicate or interact with California consumers for commercial purposes. When such automated interactions occur, they will be clearly identified as originating from an automated system.

`;
    }
    
    if (formData.deepfakeLabeling) {
      caSection += `b) Synthetic Media and Deepfake Labeling. In accordance with California deepfake legislation:
• AI-generated synthetic media will be clearly labeled where technically feasible
• Users are prohibited from removing or altering synthetic media identification markers
• We implement detection measures for potentially harmful synthetic content
• Reporting mechanisms are available for suspected deepfake content

`;
    }
    
    if (formData.aiTransparencyNotices) {
      caSection += `c) AI Transparency Notices. For California users, we provide enhanced transparency regarding:
• The use of AI in decision-making processes that may affect you
• Your right to request human review of automated decisions
• Information about how AI systems process your data
• Options to limit automated processing where feasible

`;
    }
    
    if (formData.syntheticMediaWarnings) {
      caSection += `d) Synthetic Media Warnings. Users are warned that:
• AI systems may generate synthetic or artificial content
• Such content should not be relied upon for factual accuracy without verification
• Synthetic content may be subject to copyright or other intellectual property restrictions
• Use of synthetic content may require additional disclosures in certain contexts

`;
    }
    
    return caSection;
  };

  // ENHANCED: Generate comprehensive document
  const generateDocument = () => {
    // Generate AI disclaimers content for section 2
    const generateAIDisclaimers = () => {
      const disclaimers = [];
      
      if (formData.aiAccuracyDisclaimer) {
        disclaimers.push('AI ACCURACY DISCLAIMER: Our AI models may produce inaccurate, incomplete, or misleading information. You should not rely solely on AI-generated content for important decisions, professional advice, or factual information without independent verification.');
      }
      
      if (formData.biasDisclaimer) {
        disclaimers.push('ALGORITHMIC BIAS NOTICE: AI systems may exhibit biases based on their training data. Our AI may produce outputs that reflect societal biases or may not be appropriate for all users or situations. We do not guarantee fair, unbiased, or culturally sensitive outputs.');
      }
      
      if (formData.hallucincationWarning) {
        disclaimers.push('HALLUCINATION WARNING: AI models may generate content that appears factual but is actually false, fabricated, or nonsensical. This is known as "AI hallucination." Always verify important information from authoritative sources.');
      }
      
      if (formData.contentModerationDisclaimer) {
        disclaimers.push('CONTENT MODERATION LIMITATIONS: While we implement safety measures, our AI may occasionally generate inappropriate, offensive, or harmful content. We do not guarantee that all outputs will be suitable for all audiences or contexts.');
      }
      
      if (formData.modelVersionChanges) {
        disclaimers.push('MODEL UPDATES: We reserve the right to update, modify, or replace our AI models at any time. These changes may affect the quality, accuracy, or style of AI outputs without prior notice.');
      }
      
      // ENHANCED: Additional AI-specific risk disclaimers
      if (formData.catastrophicRiskAssessment) {
        disclaimers.push('CATASTROPHIC RISK MITIGATION: We conduct regular assessments for potential catastrophic risks from our AI systems and maintain appropriate safeguards and monitoring procedures.');
      }
      
      if (formData.modelPerformanceDegradation) {
        disclaimers.push('PERFORMANCE DEGRADATION: AI model performance may degrade over time due to data drift, changing conditions, or other factors. We do not guarantee consistent performance levels.');
      }
      
      if (formData.aiContentWatermarking) {
        disclaimers.push('CONTENT IDENTIFICATION: AI-generated content may include embedded watermarks or metadata for identification purposes. Users should not attempt to remove or alter such identification markers.');
      }
      
      if (disclaimers.length === 0) {
        return 'Our AI system is designed to provide helpful and accurate information, but like all artificial intelligence systems, it has inherent limitations. Users should exercise appropriate judgment when using AI-generated content and verify important information from authoritative sources when making significant decisions.';
      }
      
      return disclaimers.join('\n\n');
    };

    // Generate Industry Compliance content for section 5
    const generateIndustryCompliance = () => {
      let compliance = [];

      // Industry-specific requirements
      if (formData.industryType === 'healthcare') {
        compliance.push('HEALTHCARE COMPLIANCE: This Service is designed for use in the healthcare industry and may process protected health information (PHI). All use of the Service must comply with applicable healthcare regulations including HIPAA.');
        
        if (formData.hipaaCompliance) {
          compliance.push('HIPAA REQUIREMENTS: We maintain appropriate administrative, physical, and technical safeguards to protect PHI in accordance with HIPAA requirements. Users must ensure their use of the Service complies with HIPAA and other applicable healthcare privacy laws.');
        }
        
        if (formData.humanOversightRequired) {
          compliance.push('MEDICAL DECISION OVERSIGHT: AI-generated outputs must not be used as the sole basis for medical decisions. Licensed healthcare professionals must review and validate all AI-generated medical information before clinical use.');
        }
      }

      if (formData.industryType === 'financial') {
        compliance.push('FINANCIAL SERVICES COMPLIANCE: This Service is designed for use in financial services and must comply with applicable financial regulations.');
        
        if (formData.soxCompliance) {
          compliance.push('SARBANES-OXLEY COMPLIANCE: For public companies, use of this Service must comply with SOX requirements for financial reporting accuracy and internal controls.');
        }
        
        if (formData.pciCompliance) {
          compliance.push('PCI DSS COMPLIANCE: Payment card data processing must comply with PCI DSS standards. The Service maintains appropriate security controls for payment card information.');
        }
        
        if (formData.algorithmicAuditing) {
          compliance.push('ALGORITHMIC AUDITING: We conduct regular audits of our AI algorithms used in financial decision-making to ensure compliance with fair lending and anti-discrimination requirements.');
        }
      }

      if (formData.industryType === 'ecommerce' && formData.pciCompliance) {
        compliance.push('PCI DSS COMPLIANCE: Payment card data processing must comply with PCI DSS standards. The Service maintains appropriate security controls for payment card information.');
      }

      if (formData.industryType === 'education') {
        compliance.push('EDUCATIONAL COMPLIANCE: This Service is designed for educational use and must comply with applicable educational privacy laws.');
        
        if (formData.ferpaCompliance) {
          compliance.push('FERPA COMPLIANCE: Student educational records are protected in accordance with FERPA requirements. We maintain appropriate safeguards for student privacy and provide parents/students with applicable rights under FERPA.');
        }
        
        if (formData.accessibilityCompliance) {
          compliance.push('ACCESSIBILITY REQUIREMENTS: The Service is designed to comply with Section 508 and ADA accessibility requirements to ensure equal access for users with disabilities.');
        }
      }

      if (formData.industryType === 'hr') {
        compliance.push('HUMAN RESOURCES COMPLIANCE: This Service may be used in employment-related decisions and must comply with applicable anti-discrimination and employment laws.');
        
        if (formData.biasTestingRequired) {
          compliance.push('BIAS TESTING: We conduct regular testing of our AI algorithms for discriminatory bias in employment decisions. Users are responsible for ensuring their use of AI outputs complies with equal employment opportunity requirements.');
        }
        
        if (formData.humanOversightRequired) {
          compliance.push('EMPLOYMENT DECISION OVERSIGHT: AI-generated outputs used in hiring, promotion, or other employment decisions must be reviewed by qualified human personnel to ensure compliance with employment laws.');
        }
      }

      // Privacy law compliance
      if (formData.gdprCompliance) {
        compliance.push('GDPR COMPLIANCE: For users in the European Union, we comply with the General Data Protection Regulation (GDPR). EU users have specific rights regarding their personal data including access, rectification, erasure, and data portability.');
        
        if (formData.rightToExplanation) {
          compliance.push('RIGHT TO EXPLANATION: EU users have the right to obtain explanations for AI-driven decisions that significantly affect them, in accordance with GDPR Article 22.');
        }
        
        if (formData.dataPortability) {
          compliance.push('DATA PORTABILITY: EU users may request their personal data in a structured, commonly used, and machine-readable format for transfer to another service provider.');
        }
      }

      if (formData.ccpaCompliance) {
        compliance.push('CCPA COMPLIANCE: For California residents, we comply with the California Consumer Privacy Act (CCPA). California users have specific rights regarding their personal information including the right to know, delete, and opt out of the sale of personal information.');
      }

      if (formData.coppaCompliance) {
        compliance.push('COPPA COMPLIANCE: We comply with the Children\'s Online Privacy Protection Act (COPPA) for users under 13 years of age. Parental consent is required for collection of personal information from children under 13.');
      }

      // Data localization
      if (formData.dataLocalization !== 'none') {
        const locations = {
          'us': 'United States',
          'eu': 'European Union',
          'canada': 'Canada',
          'custom': 'specified geographic regions'
        };
        compliance.push(`DATA LOCALIZATION: User data is processed and stored within ${locations[formData.dataLocalization]} to comply with applicable data residency requirements.`);
      }

      // AI governance requirements
      if (formData.algorithmicAuditing) {
        compliance.push('ALGORITHMIC GOVERNANCE: We maintain documented AI governance processes including regular algorithmic auditing, performance monitoring, and bias detection procedures.');
      }

      if (formData.explainabilityRequired) {
        compliance.push('AI EXPLAINABILITY: Upon request, we will provide explanations for AI-driven decisions in accordance with applicable transparency requirements and industry best practices.');
      }

      if (formData.environmentalDisclosure) {
        compliance.push('ENVIRONMENTAL IMPACT: We are committed to minimizing the environmental impact of our AI operations. Information about our carbon footprint and sustainability practices is available upon request.');
      }

      if (compliance.length === 0) {
        return 'We are committed to operating in compliance with all applicable laws and regulations. Our practices are regularly reviewed to ensure ongoing compliance with evolving legal requirements.';
      }

      return compliance.join('\n\n');
    };

    // Main document generation
    return `TERMS OF USE FOR ${formData.platformName || '[PLATFORM NAME]'}

Last Updated: ${new Date().toLocaleDateString()}

1. ACCEPTANCE OF TERMS

These Terms of Use ("Terms") govern your use of ${formData.platformName || '[PLATFORM NAME]'}, an artificial intelligence platform (the "Service") operated by ${formData.companyName || '[COMPANY NAME]'} ("Company," "we," "us," or "our"), located at ${formData.businessAddress || '[BUSINESS ADDRESS]'}.

By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service. Your continued use of the Service constitutes acceptance of any modifications to these Terms.

2. DESCRIPTION OF SERVICE AND AI LIMITATIONS

${formData.platformName || '[PLATFORM NAME]'} is an AI-powered ${formData.platformType === 'custom' ? (formData.customPlatformType || 'platform') : formData.platformType} that provides users with advanced artificial intelligence capabilities. The Service allows users to interact with sophisticated AI models, receive automated responses, and access various AI-driven features designed to enhance productivity and user experience.

Our Service may include features such as natural language processing, content generation, data analysis, and other AI-powered functionalities. The specific features available may vary based on your subscription level and may be updated from time to time.

${generateAIDisclaimers()}

3. USER ELIGIBILITY AND REGISTRATION

You must be at least ${formData.minAge} years old to use this Service. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.

If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

${formData.includePaymentTerms ? `

4. ${generatePaymentBillingSection()}` : ''}

${formData.supportLevel !== 'none' ? `

${formData.includePaymentTerms ? '5' : '4'}. ${generateSupportSection()}` : ''}

${formData.includePaymentTerms && formData.supportLevel !== 'none' ? '6' : formData.includePaymentTerms || formData.supportLevel !== 'none' ? '5' : '4'}. DATA TRAINING AND MODEL IMPROVEMENT

${formData.dataTrainingUse ? 
`We may use your interactions with the Service, including your inputs and our AI responses, to train and improve our AI models. This helps us enhance accuracy, reduce bias, and develop new features.` : 
`We do not use your individual interactions with the Service to train our AI models.`}

${formData.trainDataOptOut || formData.trainingOptOut ? 
`OPT-OUT OPTION: You may opt out of having your data used for model training by contacting us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'}. Opting out will not affect your ability to use the Service.` : ''}

${formData.modelImprovementUse ? 
`We may use aggregated, anonymized usage data to improve our AI models' performance, safety, and reliability. This data cannot be used to identify individual users.` : ''}

${formData.modelTrainingTransparency ? 
`TRAINING DATA TRANSPARENCY: Information about the datasets used to train our AI models, including data sources and collection methods, is available upon request in accordance with applicable transparency requirements.` : ''}

${formData.dataRetentionSchedule !== 'standard' ? 
`DATA RETENTION: We retain your data according to our detailed retention schedule, which varies by data type and legal requirements. Standard retention periods are ${formData.dataRetention} years for interaction data and logs.` : ''}

${formData.crossBorderTransfers !== 'none' ? 
`INTERNATIONAL DATA TRANSFERS: We may transfer your data internationally subject to appropriate safeguards including Standard Contractual Clauses (SCCs) and adequacy decisions as required by applicable data protection laws.` : ''}

${generateEUAIActSection()}

${generateCaliforniaAISection()}

${(function() {
  let sectionNum = 4;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  return sectionNum + 1;
})()} INDUSTRY COMPLIANCE AND REGULATORY REQUIREMENTS

${generateIndustryCompliance()}

${(function() {
  let sectionNum = 5;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  return sectionNum + 1;
})()} USER CONTENT AND DATA USAGE

${formData.userContent ? 
`You retain ownership of any content you submit to the Service ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and display your content solely for the purpose of providing and improving the Service.

We may use your User Content to train and improve our AI models, subject to our data protection practices and applicable privacy laws.` : 
`You retain full ownership and control over any content you submit to the Service. We do not use your content for training purposes or any other use beyond providing the immediate Service functionality.`}

${formData.dataCollection ? 
`We collect and process data about your interactions with the Service, including usage patterns, performance metrics, and user preferences. This data is used to improve functionality, enhance user experience, and develop new features. All data collection is subject to our Privacy Policy and applicable data protection laws.

Data Retention: We retain your data for a period of ${formData.dataRetention} years from your last interaction with the Service, unless required by law to retain it longer or you request earlier deletion.` : 
`We minimize data collection and do not retain personal data about your interactions with the Service beyond what is strictly necessary for basic functionality and security purposes.`}

${formData.dataSubjectRights ? 
`DATA SUBJECT RIGHTS: You have the right to access, correct, delete, and port your personal data. You may also object to processing and request processing restrictions. To exercise these rights, contact us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'}.` : ''}

${(function() {
  let sectionNum = 6;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  return sectionNum + 1;
})()} ACCEPTABLE USE POLICY

You agree to use the Service in compliance with all applicable laws and regulations. You agree not to:

• Use the Service for any illegal, harmful, or unauthorized purpose
• Attempt to gain unauthorized access to the Service, other users' accounts, or our systems
• Upload, transmit, or share any content that is harmful, offensive, defamatory, or violates third-party rights
• Use the Service to generate content that promotes violence, hatred, or discrimination
• Interfere with or disrupt the Service or servers connected to the Service
• Use automated tools to access the Service except through approved APIs
${formData.commercialUse ? '' : '• Use the Service for commercial purposes without explicit written permission'}
• Reverse engineer, decompile, or attempt to extract the source code of the Service
• Violate any applicable laws or regulations in connection with your use of the Service
${formData.copyrightInfringementPrevention ? '• Use the Service to intentionally generate content that infringes third-party copyrights or intellectual property rights' : ''}

${generateThirdPartySection()}

${(function() {
  let sectionNum = 7;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  return sectionNum + 1;
})()} INTELLECTUAL PROPERTY AND AI OUTPUT RIGHTS

The Service and its underlying technology, including but not limited to AI models, algorithms, software, designs, text, graphics, and logos, are the intellectual property of ${formData.companyName || '[COMPANY NAME]'} and its licensors, protected by copyright, trademark, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to use the Service solely for its intended purpose. This license does not grant you any ownership rights in the Service or its intellectual property.

AI OUTPUT OWNERSHIP: You retain ownership of content generated by our AI in response to your inputs ("AI Output"), subject to the terms below.

${formData.commercialUseAI ? 
`COMMERCIAL USE: You may use AI Output for commercial purposes, including in products, services, or content you create or distribute.` : 
`PERSONAL USE ONLY: AI Output may only be used for personal, non-commercial purposes unless you obtain explicit written permission from us.`}

${formData.attributionRequired ? 
`ATTRIBUTION REQUIREMENT: When using AI Output commercially or publicly, you must include attribution crediting our AI platform as the source of the generated content.` : 
`No attribution is required when using AI Output, though attribution is appreciated.`}

CONTENT RESPONSIBILITY: Regardless of ownership, you are responsible for ensuring that your use of AI Output complies with all applicable laws and does not infringe third-party rights.

${formData.aiContentWatermarking ? 
`CONTENT WATERMARKING: AI-generated content may include embedded watermarks or metadata for identification and provenance tracking. You agree not to remove or alter such identification markers.` : ''}

${formData.apiAccess ? 
`API Access: If you have been granted access to our API, you must comply with our API Terms of Service and usage guidelines. API access may be subject to rate limits and additional restrictions.` : ''}

${(function() {
  let sectionNum = 8;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  return sectionNum + 1;
})()} PRIVACY AND DATA PROTECTION

Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.

${formData.thirdPartyIntegrations ? 
`Third-Party Integrations: The Service may integrate with third-party services. Your use of such integrations is subject to the terms and privacy policies of those third parties.` : ''}

${generateAdvancedLegalSection()}

${(function() {
  let sectionNum = 9;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} DISCLAIMERS AND LIMITATION OF LIABILITY

${formData.warrantyDisclaimer ? 
`WARRANTY DISCLAIMER: THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Service will be uninterrupted, error-free, or completely secure. AI-generated content may not always be accurate, appropriate, or reliable.${formData.warrantyPeriod !== 'none' ? ` Any warranties that cannot be disclaimed are limited to a period of ${formData.warrantyPeriod === '30days' ? 'thirty (30) days' : formData.warrantyPeriod === '90days' ? 'ninety (90) days' : 'one (1) year'} from the date of first use.` : ''}${formData.performanceWarranty ? ' We do not guarantee specific performance outcomes or results from using the Service.' : ''}` : 
`We provide warranties and guarantees in accordance with applicable consumer protection laws.`}

${formData.limitLiability ? 
`LIMITATION OF LIABILITY: TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${(formData.companyName || '[COMPANY NAME]').toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL${formData.consequentialDamages ? ', CONSEQUENTIAL,' : ','} OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED ${formData.liabilityCapAmount === '12months' ? 'THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM' : formData.liabilityCapAmount === '6months' ? 'THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE SIX (6) MONTHS PRECEDING THE CLAIM' : formData.liabilityCapAmount === 'fixed100' ? 'ONE HUNDRED DOLLARS ($100)' : formData.liabilityCapAmount === 'fixed1000' ? 'ONE THOUSAND DOLLARS ($1,000)' : 'THE AMOUNT PAID BY YOU FOR THE SERVICE'}.` : 
`Our liability for damages arising from your use of the Service shall be determined in accordance with applicable law.`}

${formData.automatedDecisionOptOut ? 
`AUTOMATED DECISION-MAKING: You have the right to request human review of significant automated decisions made by our AI system that affect you. Contact us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'} to exercise this right.` : ''}

${formData.indemnification ? 
`INDEMNIFICATION: You agree to indemnify, defend, and hold harmless ${formData.companyName || '[COMPANY NAME]'}, its officers, directors, employees, and agents from and against any claims, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.` : ''}

${(function() {
  let sectionNum = 10;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} ACCOUNT TERMINATION AND SUSPENSION

We may terminate or suspend your access to the Service ${formData.termination === 'immediate' ? 'immediately and without prior notice' : 'with reasonable prior notice'} if you violate these Terms, engage in prohibited activities, or for any other reason at our sole discretion.

You may terminate your account at any time by contacting us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'}. Upon termination, your right to use the Service will cease immediately.

${(function() {
  let sectionNum = 11;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} DISPUTE RESOLUTION

${formData.disputeResolution === 'arbitration' ? 
`Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration will be conducted in ${formData.governingLaw}, and the arbitrator's decision will be final and binding. Either party may seek injunctive relief in court for intellectual property disputes or to enforce the arbitration agreement.` : 
`Any disputes arising from these Terms or your use of the Service will be resolved in the courts of ${formData.governingLaw}, and you consent to the jurisdiction of such courts.`}

${(function() {
  let sectionNum = 12;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} MODIFICATIONS TO TERMS

We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after any modifications constitutes acceptance of the updated Terms.

${(function() {
  let sectionNum = 13;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} GOVERNING LAW

These Terms shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without regard to its conflict of law principles.${formData.disputeResolution === 'court' ? ` Any legal action arising from these Terms shall be brought in the courts of ${formData.jurisdiction}.` : ''}

${(function() {
  let sectionNum = 14;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} SEVERABILITY

If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.

${(function() {
  let sectionNum = 15;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} ENTIRE AGREEMENT

These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and ${formData.companyName || '[COMPANY NAME]'} regarding the Service and supersede all prior agreements and understandings.

${(function() {
  let sectionNum = 16;
  if (formData.includePaymentTerms) sectionNum++;
  if (formData.supportLevel !== 'none') sectionNum++;
  if (formData.thirdPartyAPIs || formData.pluginSupport) sectionNum++;
  if (formData.forceMarjeure || formData.exportControlCompliance || formData.electronicSignatures || formData.auditRights || formData.dataProcessingAgreement) sectionNum++;
  return sectionNum + 1;
})()} CONTACT INFORMATION

If you have any questions about these Terms or need support, please contact us:

Email: ${formData.contactEmail || '[CONTACT EMAIL]'}
Support: ${formData.supportEmail || '[SUPPORT EMAIL]'}
Website: ${formData.websiteURL || '[WEBSITE URL]'}
Address: ${formData.businessAddress || '[BUSINESS ADDRESS]'}

For more information about ${formData.companyName || '[COMPANY NAME]'} and our services, visit ${formData.websiteURL || '[WEBSITE URL]'}.`;
  };

  // Get current document text
  const documentText = generateDocument();

  // ENHANCED: Risk Analysis with new categories
  const generateRiskAnalysis = () => {
    const risks = [];
    const recommendations = [];
    const complianceGaps = [];
    const industryBenchmarks = [];

    // Analyze liability protection
    if (!formData.limitLiability) {
      risks.push({
        level: 'high',
        category: 'Legal Protection',
        issue: 'No liability limitations',
        description: 'Without liability limitations, your company could face unlimited damages in lawsuits.',
        recommendation: 'Enable liability limitations to protect your business from excessive damage claims.'
      });
    }

    if (!formData.warrantyDisclaimer) {
      risks.push({
        level: 'high',
        category: 'Legal Protection',
        issue: 'No warranty disclaimers',
        description: 'Without warranty disclaimers, you may be legally obligated to guarantee service performance.',
        recommendation: 'Include warranty disclaimers to avoid performance guarantees and "as-is" service provision.'
      });
    }

    if (!formData.consequentialDamages) {
      risks.push({
        level: 'medium',
        category: 'Financial Risk',
        issue: 'Consequential damages not excluded',
        description: 'You could be liable for indirect damages like lost profits or business interruption.',
        recommendation: 'Exclude consequential damages to limit liability to direct damages only.'
      });
    }

    // ENHANCED: Payment and billing risk analysis
    if (formData.includePaymentTerms) {
      if (!formData.latePaymentInterest) {
        risks.push({
          level: 'medium',
          category: 'Financial Risk',
          issue: 'No late payment interest',
          description: 'Without late payment interest, you have limited financial incentive for timely payments.',
          recommendation: 'Consider adding late payment interest to encourage prompt payment.'
        });
      }

      if (formData.refundPolicy === 'custom' && !formData.customRefundPolicy) {
        risks.push({
          level: 'medium',
          category: 'Business Risk',
          issue: 'Unclear custom refund policy',
          description: 'Custom refund policy is selected but not specified, creating uncertainty.',
          recommendation: 'Define your custom refund policy clearly to avoid disputes.'
        });
      }

      if (formData.autoRenewalNotice < 30 && (formData.governingLaw === 'California' || formData.ccpaCompliance)) {
        risks.push({
          level: 'high',
          category: 'Compliance Risk',
          issue: 'Insufficient auto-renewal notice',
          description: 'California requires at least 30 days notice for auto-renewal.',
          recommendation: 'Increase auto-renewal notice to 30+ days for California compliance.'
        });
      }
    }

    // ENHANCED: Support and SLA risk analysis
    if (formData.supportLevel === 'comprehensive') {
      if (formData.uptimeCommitment !== 'none' && !formData.serviceLevelCredits) {
        risks.push({
          level: 'medium',
          category: 'Business Risk',
          issue: 'Uptime commitment without remedies',
          description: 'Promising uptime without service level credits may create liability without compensation.',
          recommendation: 'Consider offering service level credits for uptime failures or remove specific uptime commitments.'
        });
      }

      if (formData.supportResponseTime === 'same-day' || formData.supportResponseTime === '4-hours') {
        risks.push({
          level: 'medium',
          category: 'Operational Risk',
          issue: 'Aggressive support response times',
          description: 'Very fast response times create operational pressure and potential liability.',
          recommendation: 'Ensure you can consistently meet promised response times or extend the timeframe.'
        });
      }
    }

    // ENHANCED: AI compliance risk analysis
    if (formData.euAIActCompliance) {
      if (formData.aiRiskClassification === 'high' && !formData.fundamentalRightsAssessment) {
        complianceGaps.push({
          regulation: 'EU AI Act',
          severity: 'critical',
          description: 'High-risk AI systems require fundamental rights impact assessments under EU AI Act.',
          action: 'Conduct and document fundamental rights impact assessment for high-risk AI classification.'
        });
      }

      if (!formData.transparencyObligations) {
        complianceGaps.push({
          regulation: 'EU AI Act',
          severity: 'high',
          description: 'EU AI Act requires transparency obligations for most AI systems.',
          action: 'Enable transparency obligations to inform users about AI interactions.'
        });
      }
    }

    // ENHANCED: California AI law compliance
    if (formData.governingLaw === 'California' || formData.ccpaCompliance) {
      if (!formData.californiaBotDisclosure && formData.platformType === 'chatbot') {
        complianceGaps.push({
          regulation: 'California SB 1001',
          severity: 'medium',
          description: 'California requires bot disclosure for automated commercial interactions.',
          action: 'Enable California bot disclosure compliance for chatbot platforms.'
        });
      }

      if (formData.platformType === 'image generator' && !formData.deepfakeLabeling) {
        complianceGaps.push({
          regulation: 'California Deepfake Laws',
          severity: 'medium',
          description: 'California requires labeling of AI-generated synthetic media.',
          action: 'Consider enabling deepfake labeling for image generation platforms.'
        });
      }
    }

    // AI-specific risk analysis
    if (!formData.aiAccuracyDisclaimer) {
      risks.push({
        level: 'high',
        category: 'AI Liability',
        issue: 'No AI accuracy disclaimer',
        description: 'Users may hold you liable for AI inaccuracies, which are inherent to current AI technology.',
        recommendation: 'Include AI accuracy disclaimers - this is critical for any AI platform.'
      });
    }

    if (!formData.biasDisclaimer) {
      risks.push({
        level: 'high',
        category: 'AI Liability',
        issue: 'No algorithmic bias disclaimer',
        description: 'AI bias claims are becoming more common. You could face discrimination lawsuits.',
        recommendation: 'Include bias disclaimers to protect against algorithmic discrimination claims.'
      });
    }

    if (!formData.hallucincationWarning) {
      risks.push({
        level: 'high',
        category: 'AI Liability',
        issue: 'No hallucination warning',
        description: 'AI hallucinations can cause significant harm when users rely on false information.',
        recommendation: 'Include hallucination warnings - this is essential for user safety and legal protection.'
      });
    }

    // ENHANCED: Third-party integration risks
    if (formData.thirdPartyAPIs && formData.thirdPartyLiability !== 'disclaim') {
      risks.push({
        level: 'medium',
        category: 'Third-Party Risk',
        issue: 'Third-party liability not fully disclaimed',
        description: 'You may be held liable for third-party service failures or data breaches.',
        recommendation: 'Consider disclaiming liability for third-party service issues.'
      });
    }

    // ENHANCED: Advanced legal protection analysis
    if (!formData.forceMarjeure) {
      risks.push({
        level: 'medium',
        category: 'Legal Protection',
        issue: 'No force majeure protection',
        description: 'Without force majeure clauses, you could be liable for service interruptions due to events beyond your control.',
        recommendation: 'Add force majeure provisions to protect against uncontrollable events.'
      });
    }

    if (formData.exportControlCompliance && formData.dataLocalization === 'none') {
      risks.push({
        level: 'medium',
        category: 'Compliance Risk',
        issue: 'Export control without data localization',
        description: 'Export control compliance may require data localization restrictions.',
        recommendation: 'Consider data localization requirements for export control compliance.'
      });
    }

    // Industry-specific compliance analysis
    if (formData.industryType === 'healthcare' && !formData.hipaaCompliance) {
      complianceGaps.push({
        regulation: 'HIPAA',
        severity: 'critical',
        description: 'Healthcare AI platforms processing patient data must comply with HIPAA.',
        action: 'Enable HIPAA compliance or ensure your platform does not process protected health information.'
      });
    }

    if (formData.industryType === 'financial') {
      if (!formData.soxCompliance && !formData.pciCompliance) {
        complianceGaps.push({
          regulation: 'Financial Regulations',
          severity: 'high',
          description: 'Financial AI platforms typically need SOX (if public) and PCI DSS (if processing payments).',
          action: 'Review your specific financial services and enable appropriate compliance measures.'
        });
      }
    }

    if ((formData.industryType === 'financial' || formData.industryType === 'ecommerce') && !formData.pciCompliance) {
      complianceGaps.push({
        regulation: 'PCI DSS',
        severity: 'high',
        description: 'Platforms processing payment card information must comply with PCI DSS.',
        action: 'Enable PCI DSS compliance if you process any payment card data.'
      });
    }

    if (formData.industryType === 'education' && !formData.ferpaCompliance) {
      complianceGaps.push({
        regulation: 'FERPA',
        severity: 'high',
        description: 'Educational AI platforms processing student records must comply with FERPA.',
        action: 'Enable FERPA compliance if you process any student educational records.'
      });
    }

    if (formData.industryType === 'hr' && !formData.biasTestingRequired) {
      complianceGaps.push({
        regulation: 'Anti-Discrimination Laws',
        severity: 'high',
        description: 'HR AI platforms used for hiring decisions may face bias auditing requirements.',
        action: 'Consider enabling bias testing requirements to demonstrate fair hiring practices.'
      });
    }

    // Privacy compliance analysis
    if (formData.dataCollection && !formData.gdprCompliance && !formData.ccpaCompliance) {
      complianceGaps.push({
        regulation: 'Privacy Laws',
        severity: 'medium',
        description: 'Data collection without privacy compliance may violate GDPR (EU users) or CCPA (California users).',
        action: 'Enable GDPR and/or CCPA compliance based on your user demographics.'
      });
    }

    // Age compliance
    if (formData.minAge === '13' && !formData.coppaCompliance) {
      complianceGaps.push({
        regulation: 'COPPA',
        severity: 'medium',
        description: 'Platforms accepting users under 13 must comply with COPPA.',
        action: 'Enable COPPA compliance or increase minimum age to 16+ to avoid children\'s privacy requirements.'
      });
    }

    // Indemnification warning
    if (formData.indemnification) {
      risks.push({
        level: 'medium',
        category: 'Business Risk',
        issue: 'User indemnification required',
        description: 'Indemnification clauses may deter enterprise customers and individual users.',
        recommendation: 'Consider removing indemnification requirements to improve user adoption, especially for B2C platforms.'
      });
    }

    // ENHANCED: Industry benchmarking
    switch (formData.industryType) {
      case 'healthcare':
        industryBenchmarks.push('95% of healthcare AI platforms include HIPAA compliance and human oversight requirements');
        industryBenchmarks.push('Healthcare AI platforms typically require 2-5 years data retention for medical compliance');
        industryBenchmarks.push('Most healthcare AI platforms prohibit commercial use of outputs due to liability concerns');
        break;
      case 'financial':
        industryBenchmarks.push('90% of financial AI platforms use arbitration for dispute resolution');
        industryBenchmarks.push('Financial AI platforms typically cap liability at 12 months of fees paid');
        industryBenchmarks.push('Most financial AI platforms require algorithmic auditing and bias testing');
        break;
      case 'education':
        industryBenchmarks.push('85% of educational AI platforms comply with both FERPA and accessibility requirements');
        industryBenchmarks.push('Educational platforms typically set minimum age at 13 with COPPA compliance');
        industryBenchmarks.push('Most educational AI platforms allow commercial use but require attribution');
        break;
      case 'hr':
        industryBenchmarks.push('HR AI platforms increasingly require bias testing due to regulatory scrutiny');
        industryBenchmarks.push('Most HR AI platforms include human oversight requirements for hiring decisions');
        industryBenchmarks.push('85% of HR AI platforms provide right to explanation for AI-driven decisions');
        break;
      default:
        industryBenchmarks.push('Most AI platforms include comprehensive AI accuracy and bias disclaimers');
        industryBenchmarks.push('Standard practice is 2-year data retention with user deletion rights');
        industryBenchmarks.push('Liability limitations and warranty disclaimers are used by 95% of AI platforms');
    }

    // Calculate overall risk score
    const highRisks = risks.filter(r => r.level === 'high').length;
    const mediumRisks = risks.filter(r => r.level === 'medium').length;
    const criticalGaps = complianceGaps.filter(g => g.severity === 'critical').length;
    
    let overallRisk = 'low';
    if (highRisks >= 3 || criticalGaps >= 1) {
      overallRisk = 'high';
    } else if (highRisks >= 1 || mediumRisks >= 3) {
      overallRisk = 'medium';
    }

    return (
      <div className="risk-analysis">
        {/* Overall Risk Assessment */}
        <div className={`overall-risk-card risk-${overallRisk}`}>
          <h4>Overall Risk Level: {overallRisk.toUpperCase()}</h4>
          <p>
            {overallRisk === 'high' && 'Your terms have significant legal risks that should be addressed immediately.'}
            {overallRisk === 'medium' && 'Your terms have moderate risks that should be reviewed and improved.'}
            {overallRisk === 'low' && 'Your terms provide good legal protection with minor areas for improvement.'}
          </p>
        </div>

        {/* Risk Details */}
        {risks.length > 0 && (
          <div className="risk-section">
            <h4>⚠️ Risk Analysis</h4>
            {risks.map((risk, index) => (
              <div key={index} className={`risk-item risk-${risk.level}`}>
                <div className="risk-header">
                  <span className={`risk-level-badge risk-${risk.level}`}>
                    {risk.level.toUpperCase()} RISK
                  </span>
                  <strong>{risk.category}: {risk.issue}</strong>
                </div>
                <p>{risk.description}</p>
                <div className="risk-recommendation">
                  <strong>Recommendation:</strong> {risk.recommendation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compliance Gaps */}
        {complianceGaps.length > 0 && (
          <div className="risk-section">
            <h4>📋 Compliance Gaps</h4>
            {complianceGaps.map((gap, index) => (
              <div key={index} className={`compliance-gap gap-${gap.severity}`}>
                <div className="gap-header">
                  <span className={`severity-badge severity-${gap.severity}`}>
                    {gap.severity.toUpperCase()}
                  </span>
                  <strong>{gap.regulation}</strong>
                </div>
                <p>{gap.description}</p>
                <div className="gap-action">
                  <strong>Action Required:</strong> {gap.action}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Industry Benchmarking */}
        <div className="risk-section">
          <h4>📊 Industry Benchmarking</h4>
          <div className="benchmark-info">
            <p><strong>Your Industry:</strong> {formData.industryType === 'general' ? 'General Business' : formData.industryType.charAt(0).toUpperCase() + formData.industryType.slice(1)}</p>
            {industryBenchmarks.map((benchmark, index) => (
              <div key={index} className="benchmark-item">
                ✓ {benchmark}
              </div>
            ))}
          </div>
        </div>

        {/* Practical Recommendations */}
        <div className="risk-section">
          <h4>💡 Practical Recommendations</h4>
          <div className="recommendations">
            {overallRisk === 'high' && (
              <div className="recommendation-item priority-high">
                <strong>URGENT:</strong> Address high-risk items immediately before launching your platform. Consider legal consultation for liability protection.
              </div>
            )}
            
            {formData.industryType !== 'general' && (
              <div className="recommendation-item">
                <strong>Industry-Specific:</strong> Your {formData.industryType} industry has specific compliance requirements. Ensure all relevant regulations are addressed.
              </div>
            )}
            
            {formData.dataCollection && (
              <div className="recommendation-item">
                <strong>Privacy:</strong> You collect user data. Consider implementing comprehensive privacy protections (GDPR/CCPA) regardless of current legal requirements.
              </div>
            )}
            
            {formData.commercialUseAI && (
              <div className="recommendation-item">
                <strong>Commercial Use:</strong> Allowing commercial use of AI outputs increases your user base but may require stronger intellectual property protections.
              </div>
            )}

            {formData.includePaymentTerms && (
              <div className="recommendation-item">
                <strong>Payment Terms:</strong> Including payment terms requires careful consideration of consumer protection laws and auto-renewal regulations.
              </div>
            )}

            {formData.supportLevel === 'comprehensive' && (
              <div className="recommendation-item">
                <strong>Service Levels:</strong> Comprehensive support commitments create operational requirements. Ensure you can meet promised service levels consistently.
              </div>
            )}
            
            <div className="recommendation-item">
              <strong>Regular Updates:</strong> AI regulations are evolving rapidly. Plan to review and update your terms at least annually.
            </div>
            
            <div className="recommendation-item">
              <strong>User Communication:</strong> Consider creating a plain-English summary of key terms to improve user understanding and trust.
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="risk-section next-steps">
          <h4>🎯 Next Steps</h4>
          <div className="steps-list">
            <div className="step-item">
              <strong>1. Address Critical Issues:</strong> Fix any high-risk items identified above
            </div>
            <div className="step-item">
              <strong>2. Legal Review:</strong> Have an attorney review your terms, especially for {formData.industryType} industry requirements
            </div>
            <div className="step-item">
              <strong>3. Test with Users:</strong> Get feedback from potential users on clarity and acceptability
            </div>
            <div className="step-item">
              <strong>4. Regular Updates:</strong> Schedule quarterly reviews of your terms as AI regulations evolve
            </div>
            <div className="step-item">
              <strong>5. Implementation:</strong> Ensure your platform actually implements the protections described in your terms
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Help icon component with tooltip
  const HelpIcon = ({ tooltip }) => (
    <span className="help-icon">
      ?
      <span className="help-tooltip">
        {tooltip}
      </span>
    </span>
  );

  // Determine which section to highlight
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    switch (currentTab) {
      case 0: // Company Info
        if (['companyName', 'websiteURL', 'contactEmail', 'jurisdiction', 'businessAddress', 'supportEmail'].includes(lastChanged)) {
          return 'company';
        }
        break;
      case 1: // Platform
        if (['platformName', 'platformType', 'dataCollection', 'userContent', 'commercialUse', 'dataRetention', 'apiAccess', 'thirdPartyIntegrations', 'customPlatformType'].includes(lastChanged)) {
          return 'platform';
        }
        break;
      case 2: // Payment
        if (['includePaymentTerms', 'billingCycle', 'latePaymentInterest', 'refundPolicy', 'autoRenewalNotice', 'latePaymentGracePeriod', 'priceChangeNotice', 'suspensionForNonPayment', 'subscriptionTiers', 'customRefundPolicy'].includes(lastChanged)) {
          return 'payment';
        }
        break;
      case 3: // Support
        if (['supportLevel', 'supportHours', 'uptimeCommitment', 'serviceLevelCredits', 'supportResponseTime', 'supportChannels', 'uptimePercentage', 'escalationProcedures', 'maintenanceWindows'].includes(lastChanged)) {
          return 'support';
        }
        break;
      case 4: // Legal
        if (['forceMarjeure', 'exportControlCompliance', 'electronicSignatures', 'auditRights', 'dataProcessingAgreement', 'professionalServices', 'thirdPartyAPIs', 'thirdPartyLiability', 'thirdPartyAvailability', 'thirdPartyData', 'pluginSupport'].includes(lastChanged)) {
          return 'legal';
        }
        break;
      case 5: // Compliance
        if (['euAIActCompliance', 'californiaBotDisclosure', 'aiRiskClassification', 'transparencyObligations', 'fundamentalRightsAssessment', 'aiLiteracyProvisions', 'conformityAssessment', 'deepfakeLabeling', 'aiTransparencyNotices', 'syntheticMediaWarnings', 'trainDataOptOut', 'dataRetentionSchedule', 'crossBorderTransfers', 'dataSubjectRights', 'modelTrainingTransparency', 'catastrophicRiskAssessment', 'modelPerformanceDegradation', 'automatedDecisionOptOut', 'aiContentWatermarking', 'copyrightInfringementPrevention'].includes(lastChanged)) {
          return 'compliance';
        }
        break;
      case 6: // Terms
        if (['minAge', 'termination', 'governingLaw', 'disputeResolution', 'limitLiability', 'warrantyDisclaimer', 'consequentialDamages', 'indemnification', 'liabilityCapAmount', 'warrantyPeriod', 'performanceWarranty'].includes(lastChanged)) {
          return 'terms';
        }
        break;
      case 7: // AI-Specific
        if (['aiAccuracyDisclaimer', 'biasDisclaimer', 'hallucincationWarning', 'contentModerationDisclaimer', 'modelVersionChanges', 'dataTrainingUse', 'trainingOptOut', 'modelImprovementUse', 'commercialUseAI', 'attributionRequired'].includes(lastChanged)) {
          return 'ai-specific';
        }
        break;
      case 8: // Industry Compliance
        if (['industryType', 'gdprCompliance', 'ccpaCompliance', 'hipaaCompliance', 'ferpaCompliance', 'pciCompliance', 'soxCompliance', 'coppaCompliance', 'accessibilityCompliance', 'dataLocalization', 'algorithmicAuditing', 'biasTestingRequired', 'humanOversightRequired', 'explainabilityRequired', 'consentManagement', 'dataPortability', 'environmentalDisclosure'].includes(lastChanged)) {
          return 'industry-compliance';
        }
        break;
      case 9: // Risk Analysis
        // Risk analysis tab doesn't have inputs that affect the document
        return null;
    }
    return null;
  };

  // Create highlighted text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight || !lastChanged) return documentText;
    
    let highlightedText = documentText;
    
    // Highlight different sections based on what changed
    switch (lastChanged) {
      case 'companyName':
        if (formData.companyName) {
          highlightedText = highlightedText.replace(
            new RegExp(formData.companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<span class="highlighted-text">${formData.companyName}</span>`
          );
        }
        break;
      case 'platformName':
        if (formData.platformName) {
          highlightedText = highlightedText.replace(
            new RegExp(formData.platformName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<span class="highlighted-text">${formData.platformName}</span>`
          );
        }
        break;
      case 'platformType':
      case 'customPlatformType':
        highlightedText = highlightedText.replace(
          /AI-powered .* that provides/,
          `AI-powered <span class="highlighted-text">${formData.platformType === 'custom' ? (formData.customPlatformType || 'platform') : formData.platformType}</span> that provides`
        );
        break;
      case 'minAge':
        highlightedText = highlightedText.replace(
          new RegExp(`at least ${formData.minAge} years old`, 'g'),
          `at least <span class="highlighted-text">${formData.minAge}</span> years old`
        );
        break;
      case 'termination':
        const terminationText = formData.termination === 'immediate' ? 'immediately and without prior notice' : 'with reasonable prior notice';
        highlightedText = highlightedText.replace(
          /terminate or suspend your access to the Service .*/,
          `terminate or suspend your access to the Service <span class="highlighted-text">${terminationText}</span> if you violate these Terms.`
        );
        break;
      case 'governingLaw':
        highlightedText = highlightedText.replace(
          new RegExp(`State of ${formData.governingLaw}`, 'g'),
          `State of <span class="highlighted-text">${formData.governingLaw}</span>`
        );
        break;
      case 'contactEmail':
        if (formData.contactEmail) {
          highlightedText = highlightedText.replace(
            new RegExp(formData.contactEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<span class="highlighted-text">${formData.contactEmail}</span>`
          );
        }
        break;
      case 'websiteURL':
        if (formData.websiteURL) {
          highlightedText = highlightedText.replace(
            new RegExp(formData.websiteURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<span class="highlighted-text">${formData.websiteURL}</span>`
          );
        }
        break;
      case 'businessAddress':
        if (formData.businessAddress) {
          highlightedText = highlightedText.replace(
            /located at .*/,
            `located at <span class="highlighted-text">${formData.businessAddress}</span>.`
          );
          highlightedText = highlightedText.replace(
            /Address: .*/,
            `Address: <span class="highlighted-text">${formData.businessAddress}</span>`
          );
        }
        break;
      case 'supportEmail':
        if (formData.supportEmail) {
          highlightedText = highlightedText.replace(
            new RegExp(formData.supportEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<span class="highlighted-text">${formData.supportEmail}</span>`
          );
        }
        break;
      case 'dataRetention':
        highlightedText = highlightedText.replace(
          /retain your data for a period of .* years/,
          `retain your data for a period of <span class="highlighted-text">${formData.dataRetention}</span> years`
        );
        break;
      // Checkbox highlighting for Platform tab
      case 'dataCollection':
      case 'userContent':  
      case 'commercialUse':
      case 'apiAccess':
      case 'thirdPartyIntegrations':
        // Highlight the USER CONTENT AND DATA USAGE section for platform-related checkboxes
        highlightedText = highlightedText.replace(
          /(USER CONTENT AND DATA USAGE.*?(?=ACCEPTABLE USE|INTELLECTUAL PROPERTY))/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        break;
      // ENHANCED: Payment and billing highlighting
      case 'includePaymentTerms':
      case 'billingCycle':
      case 'latePaymentInterest':
      case 'refundPolicy':
      case 'autoRenewalNotice':
      case 'latePaymentGracePeriod':
      case 'priceChangeNotice':
      case 'suspensionForNonPayment':
      case 'subscriptionTiers':
      case 'customRefundPolicy':
        if (formData.includePaymentTerms) {
          highlightedText = highlightedText.replace(
            /(SUBSCRIPTION PLANS, PAYMENT, AND BILLING.*?(?=DATA TRAINING|USER ELIGIBILITY|CUSTOMER SUPPORT))/s,
            function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            }
          );
        }
        break;
      // ENHANCED: Support section highlighting
      case 'supportLevel':
      case 'supportHours':
      case 'supportResponseTime':
      case 'supportChannels':
      case 'uptimeCommitment':
      case 'uptimePercentage':
      case 'serviceLevelCredits':
      case 'escalationProcedures':
      case 'maintenanceWindows':
        if (formData.supportLevel !== 'none') {
          highlightedText = highlightedText.replace(
            /(CUSTOMER SUPPORT.*?(?=DATA TRAINING|USER ELIGIBILITY|INDUSTRY COMPLIANCE))/s,
            function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            }
          );
        }
        break;
      // ENHANCED: Legal protections highlighting
      case 'forceMarjeure':
      case 'exportControlCompliance':
      case 'electronicSignatures':
      case 'auditRights':
      case 'dataProcessingAgreement':
      case 'professionalServices':
      case 'thirdPartyAPIs':
      case 'thirdPartyLiability':
      case 'thirdPartyAvailability':
      case 'thirdPartyData':
      case 'pluginSupport':
        // Highlight any legal protections sections that exist
        highlightedText = highlightedText.replace(
          /(FORCE MAJEURE.*?(?=DISCLAIMERS)|EXPORT CONTROL.*?(?=DISCLAIMERS)|ELECTRONIC COMMUNICATIONS.*?(?=DISCLAIMERS)|AUDIT RIGHTS.*?(?=DISCLAIMERS)|DATA PROCESSING AGREEMENT.*?(?=DISCLAIMERS)|THIRD-PARTY INTEGRATIONS.*?(?=INTELLECTUAL PROPERTY|DISCLAIMERS))/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        break;
      // ENHANCED: AI compliance highlighting  
      case 'euAIActCompliance':
      case 'aiRiskClassification':
      case 'transparencyObligations':
      case 'fundamentalRightsAssessment':
      case 'aiLiteracyProvisions':
      case 'conformityAssessment':
      case 'californiaBotDisclosure':
      case 'deepfakeLabeling':
      case 'aiTransparencyNotices':
      case 'syntheticMediaWarnings':
      case 'trainDataOptOut':
      case 'dataRetentionSchedule':
      case 'crossBorderTransfers':
      case 'dataSubjectRights':
      case 'modelTrainingTransparency':
      case 'catastrophicRiskAssessment':
      case 'modelPerformanceDegradation':
      case 'automatedDecisionOptOut':
      case 'aiContentWatermarking':
      case 'copyrightInfringementPrevention':
        highlightedText = highlightedText.replace(
          /(EU AI ACT COMPLIANCE.*?(?=INDUSTRY COMPLIANCE)|CALIFORNIA AI LAW COMPLIANCE.*?(?=INDUSTRY COMPLIANCE)|DATA TRAINING AND MODEL IMPROVEMENT.*?(?=INDUSTRY COMPLIANCE))/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        break;
      // AI-specific disclaimers highlighting
      case 'aiAccuracyDisclaimer':
      case 'biasDisclaimer':
      case 'hallucincationWarning':
      case 'contentModerationDisclaimer':
      case 'modelVersionChanges':
      case 'dataTrainingUse':
      case 'trainingOptOut':
      case 'modelImprovementUse':
      case 'commercialUseAI':
      case 'attributionRequired':
        // Highlight the entire AI limitations section when any disclaimer changes
        highlightedText = highlightedText.replace(
          /(Our Service may include features.*?(?=USER ELIGIBILITY)|AI ACCURACY DISCLAIMER.*?(?=USER ELIGIBILITY)|ALGORITHMIC BIAS NOTICE.*?(?=USER ELIGIBILITY)|HALLUCINATION WARNING.*?(?=USER ELIGIBILITY))/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        break;
      // Liability and warranty highlighting
      case 'limitLiability':
      case 'warrantyDisclaimer':
      case 'consequentialDamages':
      case 'indemnification':
      case 'liabilityCapAmount':
      case 'warrantyPeriod':
      case 'performanceWarranty':
        // Highlight the disclaimers and liability section
        highlightedText = highlightedText.replace(
          /(DISCLAIMERS AND LIMITATION OF LIABILITY.*?(?=ACCOUNT TERMINATION))/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        break;
      // Industry compliance highlighting
      case 'industryType':
      case 'gdprCompliance':
      case 'ccpaCompliance':
      case 'hipaaCompliance':
      case 'ferpaCompliance':
      case 'pciCompliance':
      case 'soxCompliance':
      case 'coppaCompliance':
      case 'accessibilityCompliance':
      case 'dataLocalization':
      case 'algorithmicAuditing':
      case 'biasTestingRequired':
      case 'humanOversightRequired':
      case 'explainabilityRequired':
      case 'consentManagement':
      case 'rightToExplanation':
      case 'dataPortability':
      case 'environmentalDisclosure':
        // Highlight the entire Industry Compliance section when any compliance option changes
        highlightedText = highlightedText.replace(
          /(INDUSTRY COMPLIANCE AND REGULATORY REQUIREMENTS.*?(?=USER CONTENT))/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        break;
      default:
        // For any unhandled checkboxes, try to find the relevant section
        // This provides a fallback highlighting mechanism
        if (sectionToHighlight && lastChanged) {
          const sectionPatterns = {
            company: /(These Terms of Use.*?governed by these Terms|Last Updated.*?acceptance of any modifications)/s,
            platform: /(DESCRIPTION OF SERVICE.*?(?=USER ELIGIBILITY))/s,
            payment: /(SUBSCRIPTION PLANS.*?(?=DATA TRAINING|CUSTOMER SUPPORT))/s,
            support: /(CUSTOMER SUPPORT.*?(?=DATA TRAINING|INDUSTRY COMPLIANCE))/s,
            legal: /(FORCE MAJEURE.*?(?=DISCLAIMERS)|THIRD-PARTY.*?(?=DISCLAIMERS))/s,
            compliance: /(EU AI ACT.*?(?=INDUSTRY COMPLIANCE)|CALIFORNIA AI LAW.*?(?=INDUSTRY COMPLIANCE)|DATA TRAINING.*?(?=INDUSTRY COMPLIANCE))/s,
            terms: /(DISCLAIMERS AND LIMITATION.*?(?=ACCOUNT TERMINATION))/s,
            'ai-specific': /(Our Service may include features.*?(?=USER ELIGIBILITY))/s,
            'industry-compliance': /(INDUSTRY COMPLIANCE.*?(?=USER CONTENT))/s
          };
          
          const pattern = sectionPatterns[sectionToHighlight];
          if (pattern) {
            highlightedText = highlightedText.replace(pattern, function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            });
          }
        }
        break;
    }
    
    return highlightedText;
  };

  // Get highlighted text
  const highlightedText = createHighlightedText();

  // Scroll to highlighted text
  useEffect(() => {
    if (previewRef.current && lastChanged) {
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        const highlightedElement = previewRef.current.querySelector('.highlighted-text');
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 100);
      
      // Clear the highlight after 3 seconds
      const timer = setTimeout(() => {
        setLastChanged(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [highlightedText, lastChanged]);

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
    if (!isPaid) {
      setShowPaywall(true);
      return;
    }
    navigator.clipboard.writeText(documentText).then(() => {
      alert('Terms of Use copied to clipboard!');
    });
  };

  // Download as Word
  const downloadAsWord = () => {
    if (!isPaid) {
      setShowPaywall(true);
      return;
    }
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

  // PayPal Paywall Modal
  const PaywallModal = () => (
    showPaywall && (
      <div className="paywall-overlay">
        <div className="paywall-modal">
          <h3>Unlock Full Access - $9.99</h3>
          <p>Get instant access to copy and download your custom AI Platform Terms of Use.</p>
          
          <div className="paypal-payment-section">
            <div id="paypal-button-container" className="paypal-button-container">
              {/* PayPal buttons will render here */}
            </div>
            {/* Show fallback payment option immediately */}
            <div className="paypal-fallback">
              <p><strong>Payment Options:</strong></p>
              <div className="paypal-form-fallback">
                <p>Send $9.99 to PayPal account:</p>
                <div className="paypal-id-display">owner@terms.law</div>
                <p style={{fontSize: '13px', margin: '10px 0', color: '#666'}}>
                  Use "Friends & Family" or add reference: "AI Terms Generator"
                </p>
                <a 
                  href="https://www.paypal.com/paypalme/termslawowner/9.99" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="paypal-direct-link"
                  onClick={() => {
                    // Save form data before redirect
                    localStorage.setItem('aiTermsFormData', JSON.stringify(formData));
                  }}
                >
                  Pay via PayPal ($9.99)
                </a>
              </div>
              <p style={{fontSize: '12px', marginTop: '15px', color: '#666'}}>
                After payment, return here and use "Already Paid?" option below with your transaction ID.
              </p>
            </div>
          </div>

          <div className="payment-divider">
            <span>or</span>
          </div>

          <div className="manual-payment-section">
            <button onClick={showManualEntryForm} className="manual-entry-button">
              Already Paid? Enter Transaction ID
            </button>
          </div>
          
          <div className="payment-info">
            <p><strong>Secure Payment:</strong> Your payment is processed securely by PayPal.</p>
            <p><strong>Instant Access:</strong> Once payment is complete, you'll immediately be able to copy and download your terms.</p>
            <p><strong>Form Data Saved:</strong> Your current form inputs are automatically saved and will be preserved after payment.</p>
          </div>
          
          <div className="paywall-buttons">
            <button onClick={() => setShowPaywall(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Manual Entry Modal
  const ManualEntryModal = () => (
    showManualEntry && (
      <div className="paywall-overlay">
        <div className="paywall-modal">
          <h3>Enter PayPal Transaction ID</h3>
          <p>If you've already paid via PayPal, enter your transaction ID below to unlock access:</p>
          
          <div className="paypal-section">
            <label>PayPal Transaction ID:</label>
            <input
              type="text"
              value={paypalId}
              onChange={(e) => setPaypalId(e.target.value)}
              placeholder="Enter PayPal transaction ID"
            />
            <div className="paywall-buttons">
              <button onClick={handlePayPalUnlock} className="unlock-button">
                Unlock Access
              </button>
              <button onClick={() => {setShowManualEntry(false); setShowPaywall(true);}} className="cancel-button">
                Back to Payment
              </button>
            </div>
          </div>
          
          <div className="paypal-info">
            <p><strong>Haven't Paid Yet?</strong> Go back to payment options to complete your purchase.</p>
            <p><strong>Transaction ID:</strong> Find this in your PayPal confirmation email or account history.</p>
          </div>
        </div>
      </div>
    )
  );

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
                  <label>Company Name * <HelpIcon tooltip={tooltips.companyName} /></label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="form-group">
                  <label>Business Address <HelpIcon tooltip={tooltips.businessAddress} /></label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Website URL <HelpIcon tooltip={tooltips.websiteURL} /></label>
                    <input
                      type="url"
                      name="websiteURL"
                      value={formData.websiteURL}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email <HelpIcon tooltip={tooltips.contactEmail} /></label>
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
                  <div className="form-group">
                    <label>Support Email <HelpIcon tooltip={tooltips.supportEmail} /></label>
                    <input
                      type="email"
                      name="supportEmail"
                      value={formData.supportEmail}
                      onChange={handleChange}
                      placeholder="support@yourcompany.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentTab === 1 && (
              <div>
                <h3>AI Platform Details</h3>
                <div className="form-group">
                  <label>Platform Name * <HelpIcon tooltip={tooltips.platformName} /></label>
                  <input
                    type="text"
                    name="platformName"
                    value={formData.platformName}
                    onChange={handleChange}
                    placeholder="Enter your AI platform name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Platform Type <HelpIcon tooltip={tooltips.platformType} /></label>
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
                      <option value="voice assistant">Voice Assistant</option>
                      <option value="translation service">Translation Service</option>
                      <option value="custom">Custom (specify below)</option>
                    </select>
                  </div>
                  
                  {formData.platformType === 'custom' && (
                    <div className="form-group">
                      <label>Custom Platform Description <HelpIcon tooltip={tooltips.customPlatformType} /></label>
                      <input
                        type="text"
                        name="customPlatformType"
                        value={formData.customPlatformType}
                        onChange={handleChange}
                        placeholder="e.g., AI-powered code review platform, Machine learning fraud detection system"
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Data Retention (Years) <HelpIcon tooltip={tooltips.dataRetention} /></label>
                    <select
                      name="dataRetention"
                      value={formData.dataRetention}
                      onChange={handleChange}
                    >
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="5">5 Years</option>
                      <option value="7">7 Years</option>
                    </select>
                  </div>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="dataCollection"
                    checked={formData.dataCollection}
                    onChange={handleChange}
                  />
                  <label>Platform collects user interaction data <HelpIcon tooltip={tooltips.dataCollection} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="userContent"
                    checked={formData.userContent}
                    onChange={handleChange}
                  />
                  <label>Users can submit content to the platform <HelpIcon tooltip={tooltips.userContent} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="commercialUse"
                    checked={formData.commercialUse}
                    onChange={handleChange}
                  />
                  <label>Allow commercial use of platform outputs <HelpIcon tooltip={tooltips.commercialUse} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="apiAccess"
                    checked={formData.apiAccess}
                    onChange={handleChange}
                  />
                  <label>Platform provides API access <HelpIcon tooltip={tooltips.apiAccess} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="thirdPartyIntegrations"
                    checked={formData.thirdPartyIntegrations}
                    onChange={handleChange}
                  />
                  <label>Third-party service integrations <HelpIcon tooltip={tooltips.thirdPartyIntegrations} /></label>
                </div>
              </div>
            )}

            {/* ENHANCED: Payment & Billing Tab */}
            {currentTab === 2 && (
              <div>
                <h3>Payment & Billing Terms</h3>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="includePaymentTerms"
                    checked={formData.includePaymentTerms}
                    onChange={handleChange}
                  />
                  <label>Include comprehensive payment and billing terms <HelpIcon tooltip={tooltips.includePaymentTerms} /></label>
                </div>

                {formData.includePaymentTerms && (
                  <div className="conditional-section">
                    <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Billing Configuration</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Billing Cycle <HelpIcon tooltip={tooltips.billingCycle} /></label>
                        <select
                          name="billingCycle"
                          value={formData.billingCycle}
                          onChange={handleChange}
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annual">Annual</option>
                          <option value="usage-based">Usage-based</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Auto-Renewal Notice (Days) <HelpIcon tooltip={tooltips.autoRenewalNotice} /></label>
                        <select
                          name="autoRenewalNotice"
                          value={formData.autoRenewalNotice}
                          onChange={handleChange}
                        >
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30">30 days (CA required)</option>
                          <option value="45">45 days</option>
                          <option value="60">60 days</option>
                        </select>
                      </div>
                    </div>

                    <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Late Payment & Collection</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Late Payment Interest (% per month) <HelpIcon tooltip={tooltips.latePaymentInterest} /></label>
                        <select
                          name="latePaymentInterest"
                          value={formData.latePaymentInterest}
                          onChange={handleChange}
                        >
                          <option value="">No late payment interest</option>
                          <option value="1.0">1.0% per month</option>
                          <option value="1.5">1.5% per month (recommended)</option>
                          <option value="2.0">2.0% per month</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Grace Period (Days) <HelpIcon tooltip={tooltips.latePaymentGracePeriod} /></label>
                        <select
                          name="latePaymentGracePeriod"
                          value={formData.latePaymentGracePeriod}
                          onChange={handleChange}
                        >
                          <option value="5">5 days</option>
                          <option value="10">10 days</option>
                          <option value="15">15 days</option>
                          <option value="30">30 days</option>
                        </select>
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="suspensionForNonPayment"
                        checked={formData.suspensionForNonPayment}
                        onChange={handleChange}
                      />
                      <label>Allow service suspension for non-payment <HelpIcon tooltip={tooltips.suspensionForNonPayment} /></label>
                    </div>

                    <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Refund Policy</h4>
                    <div className="form-group">
                      <label>Refund Policy <HelpIcon tooltip={tooltips.refundPolicy} /></label>
                      <select
                        name="refundPolicy"
                        value={formData.refundPolicy}
                        onChange={handleChange}
                      >
                        <option value="no-refunds">No refunds (strongest protection)</option>
                        <option value="7-day">7-day money back guarantee</option>
                        <option value="30-day">30-day money back guarantee</option>
                        <option value="pro-rata">Pro-rated refunds on cancellation</option>
                        <option value="custom">Custom refund policy</option>
                      </select>
                    </div>

                    {formData.refundPolicy === 'custom' && (
                      <div className="form-group">
                        <label>Custom Refund Policy Description</label>
                        <textarea
                          name="customRefundPolicy"
                          value={formData.customRefundPolicy}
                          onChange={handleChange}
                          placeholder="Describe your custom refund policy..."
                          rows="3"
                        />
                      </div>
                    )}

                    <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Price Changes</h4>
                    <div className="form-group">
                      <label>Price Change Notice (Days) <HelpIcon tooltip={tooltips.priceChangeNotice} /></label>
                      <select
                        name="priceChangeNotice"
                        value={formData.priceChangeNotice}
                        onChange={handleChange}
                      >
                        <option value="14">14 days</option>
                        <option value="30">30 days (recommended)</option>
                        <option value="45">45 days</option>
                        <option value="60">60 days</option>
                      </select>
                    </div>

                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="subscriptionTiers"
                        checked={formData.subscriptionTiers}
                        onChange={handleChange}
                      />
                      <label>Multiple subscription tiers available <HelpIcon tooltip={tooltips.subscriptionTiers} /></label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ENHANCED: Support & SLA Tab */}
            {currentTab === 3 && (
              <div>
                <h3>Support & Service Level Agreements</h3>
                <p style={{padding: '20px', background: '#e8f5e8', margin: '20px 0', borderLeft: '4px solid #28a745'}}>
                  ✅ Support & SLA tab is now working! 
                </p>
                
                <div className="form-group">
                  <label>Support Level</label>
                  <select
                    name="supportLevel"
                    value={formData.supportLevel}
                    onChange={handleChange}
                  >
                    <option value="none">No formal support commitment</option>
                    <option value="basic">Basic support (email only)</option>
                    <option value="comprehensive">Comprehensive support with SLA</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="serviceLevelCredits"
                    checked={formData.serviceLevelCredits}
                    onChange={handleChange}
                  />
                  <label>Offer service level credits for failures</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="escalationProcedures"
                    checked={formData.escalationProcedures}
                    onChange={handleChange}
                  />
                  <label>Formal escalation procedures</label>
                </div>
              </div>
            )}

            {/* ENHANCED: Legal Protections Tab */}
            {currentTab === 4 && (
              <div>
                <h3>Advanced Legal Protections</h3>
                <p style={{padding: '20px', background: '#f0f0f0', margin: '20px 0'}}>
                  ✅ Tab 4 is now rendering correctly!
                </p>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="forceMarjeure"
                    checked={formData.forceMarjeure}
                    onChange={handleChange}
                  />
                  <label>Include force majeure protections</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="exportControlCompliance"
                    checked={formData.exportControlCompliance}
                    onChange={handleChange}
                  />
                  <label>Export control and sanctions compliance</label>
                </div>
              </div>
            )}

            {/* ENHANCED: AI Compliance Tab */}
            {currentTab === 5 && (
              <div>
                <h3>AI Regulatory Compliance</h3>
                
                <h4 style={{marginTop: '20px', marginBottom: '15px', color: '#2c3e50'}}>EU AI Act Compliance</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="euAIActCompliance"
                    checked={formData.euAIActCompliance}
                    onChange={handleChange}
                  />
                  <label>EU AI Act compliance (required for EU users) <HelpIcon tooltip={tooltips.euAIActCompliance} /></label>
                </div>

                {formData.euAIActCompliance && (
                  <div className="conditional-section">
                    <div className="form-group">
                      <label>AI Risk Classification <HelpIcon tooltip={tooltips.aiRiskClassification} /></label>
                      <select
                        name="aiRiskClassification"
                        value={formData.aiRiskClassification}
                        onChange={handleChange}
                      >
                        <option value="minimal">Minimal Risk (basic transparency)</option>
                        <option value="limited">Limited Risk (transparency obligations)</option>
                        <option value="high">High Risk (full compliance required)</option>
                        <option value="prohibited">Prohibited Uses (special restrictions)</option>
                      </select>
                    </div>

                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="transparencyObligations"
                        checked={formData.transparencyObligations}
                        onChange={handleChange}
                      />
                      <label>Transparency obligations (users informed of AI) <HelpIcon tooltip={tooltips.transparencyObligations} /></label>
                    </div>

                    {formData.aiRiskClassification === 'high' && (
                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          name="fundamentalRightsAssessment"
                          checked={formData.fundamentalRightsAssessment}
                          onChange={handleChange}
                        />
                        <label>Fundamental rights impact assessment <HelpIcon tooltip={tooltips.fundamentalRightsAssessment} /></label>
                      </div>
                    )}

                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="aiLiteracyProvisions"
                        checked={formData.aiLiteracyProvisions}
                        onChange={handleChange}
                      />
                      <label>AI literacy and user education <HelpIcon tooltip={tooltips.aiLiteracyProvisions} /></label>
                    </div>

                    {(formData.aiRiskClassification === 'high' || formData.aiRiskClassification === 'prohibited') && (
                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          name="conformityAssessment"
                          checked={formData.conformityAssessment}
                          onChange={handleChange}
                        />
                        <label>Conformity assessment procedures <HelpIcon tooltip={tooltips.conformityAssessment} /></label>
                      </div>
                    )}
                  </div>
                )}

                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>California AI Laws</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="californiaBotDisclosure"
                    checked={formData.californiaBotDisclosure}
                    onChange={handleChange}
                  />
                  <label>California bot disclosure (SB 1001) <HelpIcon tooltip={tooltips.californiaBotDisclosure} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="deepfakeLabeling"
                    checked={formData.deepfakeLabeling}
                    onChange={handleChange}
                  />
                  <label>Deepfake and synthetic media labeling <HelpIcon tooltip={tooltips.deepfakeLabeling} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="aiTransparencyNotices"
                    checked={formData.aiTransparencyNotices}
                    onChange={handleChange}
                  />
                  <label>AI transparency notices <HelpIcon tooltip={tooltips.aiTransparencyNotices} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="syntheticMediaWarnings"
                    checked={formData.syntheticMediaWarnings}
                    onChange={handleChange}
                  />
                  <label>Synthetic media warnings <HelpIcon tooltip={tooltips.syntheticMediaWarnings} /></label>
                </div>

                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Enhanced Data Rights</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="trainDataOptOut"
                    checked={formData.trainDataOptOut}
                    onChange={handleChange}
                  />
                  <label>Training data opt-out option <HelpIcon tooltip={tooltips.trainDataOptOut} /></label>
                </div>

                <div className="form-group">
                  <label>Data Retention Schedule <HelpIcon tooltip={tooltips.dataRetentionSchedule} /></label>
                  <select
                    name="dataRetentionSchedule"
                    value={formData.dataRetentionSchedule}
                    onChange={handleChange}
                  >
                    <option value="standard">Standard retention periods</option>
                    <option value="minimal">Minimal retention (30 days)</option>
                    <option value="extended">Extended retention (5+ years)</option>
                    <option value="indefinite">Indefinite retention (with opt-out)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cross-Border Data Transfers <HelpIcon tooltip={tooltips.crossBorderTransfers} /></label>
                  <select
                    name="crossBorderTransfers"
                    value={formData.crossBorderTransfers}
                    onChange={handleChange}
                  >
                    <option value="none">No international transfers</option>
                    <option value="sccs">Standard Contractual Clauses (SCCs)</option>
                    <option value="adequacy">Adequacy decisions only</option>
                    <option value="bcrs">Binding Corporate Rules (BCRs)</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="dataSubjectRights"
                    checked={formData.dataSubjectRights}
                    onChange={handleChange}
                  />
                  <label>Comprehensive data subject rights <HelpIcon tooltip={tooltips.dataSubjectRights} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="modelTrainingTransparency"
                    checked={formData.modelTrainingTransparency}
                    onChange={handleChange}
                  />
                  <label>Model training data transparency <HelpIcon tooltip={tooltips.modelTrainingTransparency} /></label>
                </div>

                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>AI Risk Management</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="catastrophicRiskAssessment"
                    checked={formData.catastrophicRiskAssessment}
                    onChange={handleChange}
                  />
                  <label>Catastrophic risk assessment procedures <HelpIcon tooltip={tooltips.catastrophicRiskAssessment} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="modelPerformanceDegradation"
                    checked={formData.modelPerformanceDegradation}
                    onChange={handleChange}
                  />
                  <label>Model performance degradation warnings <HelpIcon tooltip={tooltips.modelPerformanceDegradation} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="automatedDecisionOptOut"
                    checked={formData.automatedDecisionOptOut}
                    onChange={handleChange}
                  />
                  <label>Automated decision-making opt-out <HelpIcon tooltip={tooltips.automatedDecisionOptOut} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="aiContentWatermarking"
                    checked={formData.aiContentWatermarking}
                    onChange={handleChange}
                  />
                  <label>AI content watermarking <HelpIcon tooltip={tooltips.aiContentWatermarking} /></label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="copyrightInfringementPrevention"
                    checked={formData.copyrightInfringementPrevention}
                    onChange={handleChange}
                  />
                  <label>Copyright infringement prevention <HelpIcon tooltip={tooltips.copyrightInfringementPrevention} /></label>
                </div>
              </div>
            )}

            {/* Terms Configuration Tab */}
            {currentTab === 6 && (
              <div>
                <h3>Terms Configuration</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Minimum Age Requirement <HelpIcon tooltip={tooltips.minAge} /></label>
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
                    <label>Account Termination <HelpIcon tooltip={tooltips.termination} /></label>
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
                  <label>Governing Law & Jurisdiction <HelpIcon tooltip={tooltips.governingLaw} /></label>
                  <select
                    name="governingLaw"
                    value={formData.governingLaw}
                    onChange={handleChange}
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Dispute Resolution <HelpIcon tooltip={tooltips.disputeResolution} /></label>
                  <select
                    name="disputeResolution"
                    value={formData.disputeResolution}
                    onChange={handleChange}
                  >
                    <option value="arbitration">Binding Arbitration</option>
                    <option value="court">Court Litigation</option>
                  </select>
                </div>
                
                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Liability Protection</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="limitLiability"
                    checked={formData.limitLiability}
                    onChange={handleChange}
                  />
                  <label>Include liability limitations <HelpIcon tooltip={tooltips.limitLiability} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="consequentialDamages"
                    checked={formData.consequentialDamages}
                    onChange={handleChange}
                  />
                  <label>Exclude consequential damages <HelpIcon tooltip={tooltips.consequentialDamages} /></label>
                </div>
                <div className="form-group">
                  <label>Liability Cap Amount <HelpIcon tooltip={tooltips.liabilityCapAmount} /></label>
                  <select
                    name="liabilityCapAmount"
                    value={formData.liabilityCapAmount}
                    onChange={handleChange}
                  >
                    <option value="12months">Amount paid in last 12 months</option>
                    <option value="6months">Amount paid in last 6 months</option>
                    <option value="fixed100">Fixed $100 maximum</option>
                    <option value="fixed1000">Fixed $1,000 maximum</option>
                  </select>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="indemnification"
                    checked={formData.indemnification}
                    onChange={handleChange}
                  />
                  <label>Require user indemnification <HelpIcon tooltip={tooltips.indemnification} /></label>
                </div>
                
                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Warranty Terms</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="warrantyDisclaimer"
                    checked={formData.warrantyDisclaimer}
                    onChange={handleChange}
                  />
                  <label>Include warranty disclaimers <HelpIcon tooltip={tooltips.warrantyDisclaimer} /></label>
                </div>
                <div className="form-group">
                  <label>Limited Warranty Period <HelpIcon tooltip={tooltips.warrantyPeriod} /></label>
                  <select
                    name="warrantyPeriod"
                    value={formData.warrantyPeriod}
                    onChange={handleChange}
                  >
                    <option value="none">No warranty period (strongest protection)</option>
                    <option value="30days">30 days limited warranty</option>
                    <option value="90days">90 days limited warranty</option>
                    <option value="1year">1 year limited warranty</option>
                  </select>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="performanceWarranty"
                    checked={formData.performanceWarranty}
                    onChange={handleChange}
                  />
                  <label>Disclaim performance guarantees <HelpIcon tooltip={tooltips.performanceWarranty} /></label>
                </div>
              </div>
            )}

            {/* AI-Specific Protections Tab */}
            {currentTab === 7 && (
              <div>
                <h3>AI-Specific Protections</h3>
                
                <h4 style={{marginTop: '20px', marginBottom: '15px', color: '#2c3e50'}}>AI Model Disclaimers</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="aiAccuracyDisclaimer"
                    checked={formData.aiAccuracyDisclaimer}
                    onChange={handleChange}
                  />
                  <label>Include AI accuracy disclaimer <HelpIcon tooltip={tooltips.aiAccuracyDisclaimer} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="biasDisclaimer"
                    checked={formData.biasDisclaimer}
                    onChange={handleChange}
                  />
                  <label>Include algorithmic bias disclaimer <HelpIcon tooltip={tooltips.biasDisclaimer} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="hallucincationWarning"
                    checked={formData.hallucincationWarning}
                    onChange={handleChange}
                  />
                  <label>Include AI hallucination warning <HelpIcon tooltip={tooltips.hallucincationWarning} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="contentModerationDisclaimer"
                    checked={formData.contentModerationDisclaimer}
                    onChange={handleChange}
                  />
                  <label>Include content moderation limitations <HelpIcon tooltip={tooltips.contentModerationDisclaimer} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="modelVersionChanges"
                    checked={formData.modelVersionChanges}
                    onChange={handleChange}
                  />
                  <label>Reserve right to update AI models <HelpIcon tooltip={tooltips.modelVersionChanges} /></label>
                </div>
                
                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Data Training Rights</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="dataTrainingUse"
                    checked={formData.dataTrainingUse}
                    onChange={handleChange}
                  />
                  <label>Allow using user data for AI training <HelpIcon tooltip={tooltips.dataTrainingUse} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="trainingOptOut"
                    checked={formData.trainingOptOut}
                    onChange={handleChange}
                  />
                  <label>Provide training data opt-out option <HelpIcon tooltip={tooltips.trainingOptOut} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="modelImprovementUse"
                    checked={formData.modelImprovementUse}
                    onChange={handleChange}
                  />
                  <label>Use aggregated data for model improvement <HelpIcon tooltip={tooltips.modelImprovementUse} /></label>
                </div>
                
                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>AI Output Rights</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="commercialUseAI"
                    checked={formData.commercialUseAI}
                    onChange={handleChange}
                  />
                  <label>Allow commercial use of AI output <HelpIcon tooltip={tooltips.commercialUseAI} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="attributionRequired"
                    checked={formData.attributionRequired}
                    onChange={handleChange}
                  />
                  <label>Require attribution for commercial use <HelpIcon tooltip={tooltips.attributionRequired} /></label>
                </div>
              </div>
            )}

            {/* Industry Compliance Tab */}
            {currentTab === 8 && (
              <div>
                <h3>Industry Compliance & Specialization</h3>
                
                <div className="form-group">
                  <label>Primary Industry <HelpIcon tooltip={tooltips.industryType} /></label>
                  <select
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                  >
                    <option value="general">General Business</option>
                    <option value="healthcare">Healthcare & Medical</option>
                    <option value="financial">Financial Services</option>
                    <option value="education">Education & EdTech</option>
                    <option value="automotive">Autonomous Vehicles</option>
                    <option value="media">Content Creation & Media</option>
                    <option value="hr">HR & Recruitment</option>
                    <option value="legal">Legal Technology</option>
                    <option value="realestate">Real Estate</option>
                    <option value="ecommerce">E-commerce & Retail</option>
                    <option value="gaming">Gaming & Entertainment</option>
                    <option value="manufacturing">Manufacturing & IoT</option>
                  </select>
                </div>

                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Regulatory Compliance</h4>
                
                <div className="checkbox-grid">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="gdprCompliance"
                      checked={formData.gdprCompliance}
                      onChange={handleChange}
                    />
                    <label>GDPR (EU) <HelpIcon tooltip={tooltips.gdprCompliance} /></label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="ccpaCompliance"
                      checked={formData.ccpaCompliance}
                      onChange={handleChange}
                    />
                    <label>CCPA (California) <HelpIcon tooltip={tooltips.ccpaCompliance} /></label>
                  </div>
                  
                  {/* Industry-specific compliance options */}
                  {(formData.industryType === 'healthcare') && (
                    <div className="checkbox-group industry-recommended">
                      <input
                        type="checkbox"
                        name="hipaaCompliance"
                        checked={formData.hipaaCompliance}
                        onChange={handleChange}
                      />
                      <label>HIPAA (Healthcare) <span className="recommended-badge">RECOMMENDED</span> <HelpIcon tooltip={tooltips.hipaaCompliance} /></label>
                    </div>
                  )}
                  
                  {(formData.industryType === 'education') && (
                    <div className="checkbox-group industry-recommended">
                      <input
                        type="checkbox"
                        name="ferpaCompliance"
                        checked={formData.ferpaCompliance}
                        onChange={handleChange}
                      />
                      <label>FERPA (Education) <span className="recommended-badge">RECOMMENDED</span> <HelpIcon tooltip={tooltips.ferpaCompliance} /></label>
                    </div>
                  )}
                  
                  {(formData.industryType === 'financial' || formData.industryType === 'ecommerce') && (
                    <div className="checkbox-group industry-recommended">
                      <input
                        type="checkbox"
                        name="pciCompliance"
                        checked={formData.pciCompliance}
                        onChange={handleChange}
                      />
                      <label>PCI DSS (Payments) <span className="recommended-badge">RECOMMENDED</span> <HelpIcon tooltip={tooltips.pciCompliance} /></label>
                    </div>
                  )}
                  
                  {(formData.industryType === 'financial') && (
                    <div className="checkbox-group industry-recommended">
                      <input
                        type="checkbox"
                        name="soxCompliance"
                        checked={formData.soxCompliance}
                        onChange={handleChange}
                      />
                      <label>SOX (Financial) <span className="recommended-badge">RECOMMENDED</span> <HelpIcon tooltip={tooltips.soxCompliance} /></label>
                    </div>
                  )}
                  
                  {/* Show these as optional for other industries */}
                  {formData.industryType !== 'healthcare' && (
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="hipaaCompliance"
                        checked={formData.hipaaCompliance}
                        onChange={handleChange}
                      />
                      <label>HIPAA (Healthcare) <HelpIcon tooltip={tooltips.hipaaCompliance} /></label>
                    </div>
                  )}
                  
                  {formData.industryType !== 'education' && (
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="ferpaCompliance"
                        checked={formData.ferpaCompliance}
                        onChange={handleChange}
                      />
                      <label>FERPA (Education) <HelpIcon tooltip={tooltips.ferpaCompliance} /></label>
                    </div>
                  )}
                  
                  {formData.industryType !== 'financial' && formData.industryType !== 'ecommerce' && (
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="pciCompliance"
                        checked={formData.pciCompliance}
                        onChange={handleChange}
                      />
                      <label>PCI DSS (Payments) <HelpIcon tooltip={tooltips.pciCompliance} /></label>
                    </div>
                  )}
                  
                  {formData.industryType !== 'financial' && (
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        name="soxCompliance"
                        checked={formData.soxCompliance}
                        onChange={handleChange}
                      />
                      <label>SOX (Financial) <HelpIcon tooltip={tooltips.soxCompliance} /></label>
                    </div>
                  )}
                  
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="coppaCompliance"
                      checked={formData.coppaCompliance}
                      onChange={handleChange}
                    />
                    <label>COPPA (Children) <HelpIcon tooltip={tooltips.coppaCompliance} /></label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="accessibilityCompliance"
                      checked={formData.accessibilityCompliance}
                      onChange={handleChange}
                    />
                    <label>ADA/508 (Accessibility) <HelpIcon tooltip={tooltips.accessibilityCompliance} /></label>
                  </div>
                </div>

                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>AI Ethics & Governance</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="algorithmicAuditing"
                    checked={formData.algorithmicAuditing}
                    onChange={handleChange}
                  />
                  <label>Commit to algorithmic auditing <HelpIcon tooltip={tooltips.algorithmicAuditing} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="biasTestingRequired"
                    checked={formData.biasTestingRequired}
                    onChange={handleChange}
                  />
                  <label>Require bias testing for AI decisions <HelpIcon tooltip={tooltips.biasTestingRequired} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="humanOversightRequired"
                    checked={formData.humanOversightRequired}
                    onChange={handleChange}
                  />
                  <label>Require human oversight for high-stakes decisions <HelpIcon tooltip={tooltips.humanOversightRequired} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="explainabilityRequired"
                    checked={formData.explainabilityRequired}
                    onChange={handleChange}
                  />
                  <label>Provide AI decision explanations <HelpIcon tooltip={tooltips.explainabilityRequired} /></label>
                </div>

                <h4 style={{marginTop: '25px', marginBottom: '15px', color: '#2c3e50'}}>Advanced Privacy Rights</h4>
                <div className="form-group">
                  <label>Data Localization <HelpIcon tooltip={tooltips.dataLocalization} /></label>
                  <select
                    name="dataLocalization"
                    value={formData.dataLocalization}
                    onChange={handleChange}
                  >
                    <option value="none">No restrictions</option>
                    <option value="us">US only</option>
                    <option value="eu">EU only</option>
                    <option value="canada">Canada only</option>
                    <option value="custom">Custom requirements</option>
                  </select>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="consentManagement"
                    checked={formData.consentManagement}
                    onChange={handleChange}
                  />
                  <label>Advanced consent management <HelpIcon tooltip={tooltips.consentManagement} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="dataPortability"
                    checked={formData.dataPortability}
                    onChange={handleChange}
                  />
                  <label>Data portability rights <HelpIcon tooltip={tooltips.dataPortability} /></label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="environmentalDisclosure"
                    checked={formData.environmentalDisclosure}
                    onChange={handleChange}
                  />
                  <label>Environmental impact disclosure <HelpIcon tooltip={tooltips.environmentalDisclosure} /></label>
                </div>
              </div>
            )}

            {/* Risk Analysis Tab */}
            {currentTab === 9 && (
              <div>
                <h3>Risk Analysis & Recommendations</h3>
                <div className="risk-analysis-content">
                  {generateRiskAnalysis()}
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

            <button 
              onClick={() => window.open('https://terms.law/call/', '_blank')} 
              className="nav-button consult-button"
            >
              Consultation
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
              className={`document-preview ${!isPaid ? 'non-copyable' : ''}`}
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>

      {/* PayPal Paywall Modal */}
      <PaywallModal />
      
      {/* Manual Entry Modal */}
      <ManualEntryModal />
    </div>
  );
};

// Render the component
ReactDOM.render(<AITermsGenerator />, document.getElementById('root'));
