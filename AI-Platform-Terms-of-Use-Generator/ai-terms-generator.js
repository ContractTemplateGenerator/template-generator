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
    customPlatformType: ''
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

  // Tab configuration
  const tabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'platform', label: 'AI Platform' },
    { id: 'terms', label: 'Terms Config' },
    { id: 'ai-specific', label: 'AI Protections' }
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

  // Educational tooltips content
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
    customPlatformType: "Describe your specific AI platform type if not listed in the dropdown options"
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

  // Help icon component with tooltip (like the working NDA generator)
  const HelpIcon = ({ tooltip }) => (
    <span className="help-icon">
      ?
      <span className="help-tooltip">
        {tooltip}
      </span>
    </span>
  );

  // Generate document text
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
      
      if (disclaimers.length === 0) {
        return 'Our AI system is designed to provide helpful and accurate information, but like all artificial intelligence systems, it has inherent limitations. Users should exercise appropriate judgment when using AI-generated content and verify important information from authoritative sources when making significant decisions.';
      }
      
      return disclaimers.join('\n\n');
    };

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

4. DATA TRAINING AND MODEL IMPROVEMENT

${formData.dataTrainingUse ? 
`We may use your interactions with the Service, including your inputs and our AI responses, to train and improve our AI models. This helps us enhance accuracy, reduce bias, and develop new features.` : 
`We do not use your individual interactions with the Service to train our AI models.`}

${formData.trainingOptOut ? 
`OPT-OUT OPTION: You may opt out of having your data used for model training by contacting us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'}. Opting out will not affect your ability to use the Service.` : ''}

${formData.modelImprovementUse ? 
`We may use aggregated, anonymized usage data to improve our AI models' performance, safety, and reliability. This data cannot be used to identify individual users.` : ''}

5. USER CONTENT AND DATA USAGE

${formData.userContent ? 
`You retain ownership of any content you submit to the Service ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and display your content solely for the purpose of providing and improving the Service.

We may use your User Content to train and improve our AI models, subject to our data protection practices and applicable privacy laws.` : 
`You retain full ownership and control over any content you submit to the Service. We do not use your content for training purposes or any other use beyond providing the immediate Service functionality.`}

${formData.dataCollection ? 
`We collect and process data about your interactions with the Service, including usage patterns, performance metrics, and user preferences. This data is used to improve functionality, enhance user experience, and develop new features. All data collection is subject to our Privacy Policy and applicable data protection laws.

Data Retention: We retain your data for a period of ${formData.dataRetention} years from your last interaction with the Service, unless required by law to retain it longer or you request earlier deletion.` : 
`We minimize data collection and do not retain personal data about your interactions with the Service beyond what is strictly necessary for basic functionality and security purposes.`}

6. ACCEPTABLE USE POLICY

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

7. INTELLECTUAL PROPERTY AND AI OUTPUT RIGHTS

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

${formData.apiAccess ? 
`API Access: If you have been granted access to our API, you must comply with our API Terms of Service and usage guidelines. API access may be subject to rate limits and additional restrictions.` : ''}

8. PRIVACY AND DATA PROTECTION

Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.

${formData.thirdPartyIntegrations ? 
`Third-Party Integrations: The Service may integrate with third-party services. Your use of such integrations is subject to the terms and privacy policies of those third parties.` : ''}

9. DISCLAIMERS AND LIMITATION OF LIABILITY

${formData.warrantyDisclaimer ? 
`WARRANTY DISCLAIMER: THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Service will be uninterrupted, error-free, or completely secure. AI-generated content may not always be accurate, appropriate, or reliable.${formData.warrantyPeriod !== 'none' ? ` Any warranties that cannot be disclaimed are limited to a period of ${formData.warrantyPeriod === '30days' ? 'thirty (30) days' : formData.warrantyPeriod === '90days' ? 'ninety (90) days' : 'one (1) year'} from the date of first use.` : ''}${formData.performanceWarranty ? ' We do not guarantee specific performance outcomes or results from using the Service.' : ''}` : 
`We provide warranties and guarantees in accordance with applicable consumer protection laws.`}

${formData.limitLiability ? 
`LIMITATION OF LIABILITY: TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${(formData.companyName || '[COMPANY NAME]').toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL${formData.consequentialDamages ? ', CONSEQUENTIAL,' : ','} OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED ${formData.liabilityCapAmount === '12months' ? 'THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM' : formData.liabilityCapAmount === '6months' ? 'THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE SIX (6) MONTHS PRECEDING THE CLAIM' : formData.liabilityCapAmount === 'fixed100' ? 'ONE HUNDRED DOLLARS ($100)' : formData.liabilityCapAmount === 'fixed1000' ? 'ONE THOUSAND DOLLARS ($1,000)' : 'THE AMOUNT PAID BY YOU FOR THE SERVICE'}.` : 
`Our liability for damages arising from your use of the Service shall be determined in accordance with applicable law.`}

${formData.indemnification ? 
`INDEMNIFICATION: You agree to indemnify, defend, and hold harmless ${formData.companyName || '[COMPANY NAME]'}, its officers, directors, employees, and agents from and against any claims, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.` : ''}

10. ACCOUNT TERMINATION AND SUSPENSION

We may terminate or suspend your access to the Service ${formData.termination === 'immediate' ? 'immediately and without prior notice' : 'with reasonable prior notice'} if you violate these Terms, engage in prohibited activities, or for any other reason at our sole discretion.

You may terminate your account at any time by contacting us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'}. Upon termination, your right to use the Service will cease immediately.

11. DISPUTE RESOLUTION

${formData.disputeResolution === 'arbitration' ? 
`Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration will be conducted in ${formData.governingLaw}, and the arbitrator's decision will be final and binding. Either party may seek injunctive relief in court for intellectual property disputes or to enforce the arbitration agreement.` : 
`Any disputes arising from these Terms or your use of the Service will be resolved in the courts of ${formData.governingLaw}, and you consent to the jurisdiction of such courts.`}

12. MODIFICATIONS TO TERMS

We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after any modifications constitutes acceptance of the updated Terms.

13. GOVERNING LAW

These Terms shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without regard to its conflict of law principles.${formData.disputeResolution === 'court' ? ` Any legal action arising from these Terms shall be brought in the courts of ${formData.jurisdiction}.` : ''}

14. SEVERABILITY

If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.

15. ENTIRE AGREEMENT

These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and ${formData.companyName || '[COMPANY NAME]'} regarding the Service and supersede all prior agreements and understandings.

16. CONTACT INFORMATION

If you have any questions about these Terms or need support, please contact us:

Email: ${formData.contactEmail || '[CONTACT EMAIL]'}
Support: ${formData.supportEmail || '[SUPPORT EMAIL]'}
Website: ${formData.websiteURL || '[WEBSITE URL]'}
Address: ${formData.businessAddress || '[BUSINESS ADDRESS]'}

For more information about ${formData.companyName || '[COMPANY NAME]'} and our services, visit ${formData.websiteURL || '[WEBSITE URL]'}.`;
  };

  // Get current document text
  const documentText = generateDocument();

  // Determine which section to highlight
  const getSectionToHighlight = () => {
    switch (currentTab) {
      case 0: // Company Info
        if (['companyName', 'websiteURL', 'contactEmail', 'jurisdiction', 'businessAddress', 'supportEmail'].includes(lastChanged)) {
          return 'company';
        }
        break;
      case 1: // Platform
        if (['platformName', 'platformType', 'dataCollection', 'userContent', 'commercialUse', 'dataRetention', 'apiAccess', 'thirdPartyIntegrations'].includes(lastChanged)) {
          return 'platform';
        }
        break;
      case 2: // Terms
        if (['minAge', 'termination', 'governingLaw', 'disputeResolution', 'limitLiability', 'warrantyDisclaimer', 'consequentialDamages', 'indemnification', 'liabilityCapAmount', 'warrantyPeriod', 'performanceWarranty'].includes(lastChanged)) {
          return 'terms';
        }
        break;
      case 3: // AI-Specific
        if (['aiAccuracyDisclaimer', 'biasDisclaimer', 'hallucincationWarning', 'contentModerationDisclaimer', 'modelVersionChanges', 'dataTrainingUse', 'trainingOptOut', 'modelImprovementUse', 'commercialUseAI', 'attributionRequired'].includes(lastChanged)) {
          return 'ai-specific';
        }
        break;
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
      case 'aiAccuracyDisclaimer':
      case 'biasDisclaimer':
      case 'hallucincationWarning':
      case 'contentModerationDisclaimer':
      case 'modelVersionChanges':
        // Highlight the entire AI limitations section when any disclaimer changes
        highlightedText = highlightedText.replace(
          /(Our Service may include features.*?(?=3\. USER ELIGIBILITY))/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
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
                
                {/* Platform Type Explanation */}
                <div className="form-explanation">
                  {formData.platformType === 'chatbot' && 
                    'AI chatbots provide conversational interfaces for users. Consider strong disclaimers about AI accuracy and response quality.'}
                  {formData.platformType === 'content generator' && 
                    'Content generation platforms create text, images, or other media. Include clear terms about intellectual property ownership and commercial use.'}
                  {formData.platformType === 'image generator' && 
                    'Image generation platforms may face unique copyright and deepfake concerns. Consider additional restrictions on harmful content generation.'}
                  {formData.platformType === 'analytics platform' && 
                    'Analytics platforms process data to provide insights. Ensure robust data protection and privacy compliance terms.'}
                  {formData.platformType === 'recommendation engine' && 
                    'Recommendation systems influence user decisions. Consider disclaimers about algorithmic bias and decision accuracy.'}
                  {formData.platformType === 'voice assistant' && 
                    'Voice assistants process audio data. Include specific privacy protections for voice recordings and transcripts.'}
                  {formData.platformType === 'translation service' && 
                    'Translation services may handle sensitive documents. Add confidentiality protections and accuracy disclaimers.'}
                  {formData.platformType === 'custom' && 
                    'Custom AI platforms may have unique legal considerations. Ensure your description accurately reflects your AI capabilities and limitations.'}
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

            {currentTab === 2 && (
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
                
                {/* Dispute Resolution Explanation */}
                <div className="form-explanation">
                  {formData.disputeResolution === 'arbitration' && 
                    'Arbitration is typically faster and cheaper than court litigation, but limits appeal rights. Arbitrators\' decisions are usually final and binding.'}
                  {formData.disputeResolution === 'court' && 
                    'Court litigation provides full legal protections and appeal rights but can be more expensive and time-consuming than arbitration.'}
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

            {currentTab === 3 && (
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