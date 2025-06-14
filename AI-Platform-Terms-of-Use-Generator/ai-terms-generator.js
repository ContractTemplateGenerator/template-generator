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
  const previewRef = useRef(null);

  // Form data state
  const [formData, setFormData] = useState({
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
    
    // Prohibited Activities - More Comprehensive
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
    
    // Payment Terms
    paymentModel: 'freemium',
    billingCycle: 'monthly',
    autoRenewal: 'yes',
    refundPolicy: 'limited',
    
    // Legal Terms
    governingLaw: 'California',
    disputeResolution: 'courts',
    arbitrationProvider: 'aaa',
    classAction: 'yes',
    liabilityCap: 'fees-paid',
    fixedLiabilityAmount: '1000',
    warrantyDisclaimer: 'standard'
  });

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

  // Handle form changes with debouncing for better performance
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

  // PayPal payment handling
  useEffect(() => {
    if (showPaymentModal && window.paypal) {
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
  }, [showPaymentModal]);

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
  const generateDocumentText = () => {
    const company = formData.companyName || '[Company Name]';
    const platform = formData.platformName || '[Platform Name]';
    const website = formData.companyWebsite || '[Company Website]';
    const contact = formData.companyContact || '[Legal Contact Email]';
    const effectiveDate = formData.effectiveDate || '[Effective Date]';
    const address = formData.companyAddress || '[Company Address]';

    return `
TERMS OF USE
${platform.toUpperCase()}

Last Updated: ${effectiveDate}

IMPORTANT NOTICE: These Terms of Use govern your access to and use of the ${platform} artificial intelligence platform. By accessing or using our services, you agree to be bound by these terms. Please read them carefully.

1. DEFINITIONS AND SCOPE

1.1 Definitions. In these Terms of Use ("Terms"):
• "Company," "we," "us," or "our" refers to ${company}, a ${formData.businessType} organized under the laws of ${formData.governingLaw || 'California'}, with its principal place of business at ${address}.
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

2.4 Account Verification. ${formData.accountRequirements.verification ? 'We may require email verification and additional identity verification measures to ensure platform security and compliance with applicable laws.' : 'Basic account verification may be required for certain features.'}

3. ACCEPTABLE USE AND PROHIBITED ACTIVITIES

3.1 Acceptable Use. You agree to use the Platform only for lawful purposes and in accordance with these Terms. You may use the Platform for ${getAcceptableUseDescription()}.

3.2 Prohibited Activities. You expressly agree NOT to use the Platform for any of the following:

${Object.entries(formData.prohibitedActivities).filter(([key, value]) => value).map(([key, value]) => `• ${getProhibitedActivityDescription(key)}`).join('\n')}

3.3 Enforcement. We reserve the right to investigate violations of these Terms and take appropriate action, including but not limited to:
• Warning users about violations
• Temporarily or permanently suspending accounts
• Removing content that violates these Terms
• Reporting illegal activities to law enforcement
• Pursuing legal action for serious violations

3.4 User Responsibility. You acknowledge that you are solely responsible for your use of the Platform and any consequences arising from such use.

4. INTELLECTUAL PROPERTY RIGHTS

4.1 Platform Ownership. The Platform, including its software, algorithms, AI models, user interface, and all related intellectual property, is owned by the Company and protected by copyright, patent, trademark, and other intellectual property laws.

4.2 User Content Ownership. ${getUserContentOwnership()}

4.3 AI-Generated Content. ${getAIContentOwnership()}

4.4 License Grants. ${getLicenseGrants()}

4.5 Feedback and Suggestions. Any feedback, suggestions, or recommendations you provide regarding the Platform will be deemed non-confidential and non-proprietary. We may use such feedback for any purpose without restriction or compensation.

4.6 Respect for Third-Party Rights. You represent and warrant that your use of the Platform and any content you provide does not and will not infringe, violate, or misappropriate any third-party rights.

5. PRIVACY AND DATA PROTECTION

5.1 Privacy Policy. Our collection, use, and protection of personal information is governed by our Privacy Policy, available at ${formData.privacyPolicyUrl || '[Privacy Policy URL]'}, which is incorporated into these Terms by reference.

5.2 Data Processing Consent. By using the Platform, you consent to our processing of your data as described in our Privacy Policy and these Terms.

5.3 Data Use for AI Training. ${formData.aiTraining ? 'You acknowledge and agree that we may use your interactions with the Platform, including your inputs and the AI-generated outputs, to improve, train, and develop our AI models and algorithms. This data will be processed in accordance with our Privacy Policy and applicable data protection laws.' : 'We do not use your data for AI training purposes without your explicit consent.'}

5.4 Data Security. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.

5.5 Data Retention. We retain your personal data only for as long as necessary to provide the Platform services and as required by applicable law.

5.6 International Data Transfers. Your data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.

6. PAYMENT TERMS AND BILLING

${getPaymentTerms()}

7. PLATFORM AVAILABILITY AND MODIFICATIONS

7.1 Service Availability. While we strive to maintain Platform availability, we do not guarantee uninterrupted or error-free service. The Platform may be unavailable due to maintenance, updates, or technical issues.

7.2 Platform Modifications. We reserve the right to modify, update, or discontinue any aspect of the Platform at any time. We will provide reasonable notice of material changes that affect your use of the Platform.

7.3 Beta Features. Some Platform features may be designated as beta, experimental, or preview features. These features are provided "as is" and may not function as intended.

8. DISCLAIMERS AND LIMITATIONS

8.1 Platform Disclaimers. THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
• Warranties of merchantability and fitness for a particular purpose
• Warranties of non-infringement
• Warranties that the Platform will be uninterrupted, secure, or error-free
• Warranties regarding the accuracy, reliability, or completeness of AI-generated content

8.2 AI Limitations. You acknowledge that artificial intelligence technology has inherent limitations:
• AI-generated content may contain errors, biases, or inaccuracies
• The Platform cannot guarantee the accuracy or appropriateness of AI outputs
• AI-generated content should be reviewed and verified before use
• The Platform may not perform as expected in all situations

8.3 User Responsibility for AI Outputs. You are solely responsible for:
• Reviewing and verifying AI-generated content before use
• Ensuring AI outputs are appropriate for your intended use
• Complying with applicable laws when using AI-generated content
• Not relying solely on AI outputs for critical decisions

9. LIMITATION OF LIABILITY

9.1 Exclusion of Damages. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
• Loss of profits, revenue, or business opportunities
• Loss of data or information
• Loss of goodwill or reputation
• Business interruption
• Personal injury or property damage

9.2 Liability Cap. OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE PLATFORM SHALL NOT EXCEED ${getLiabilityCapDescription()}.

9.3 Essential Purpose. The limitations in this section are fundamental elements of the agreement between you and the Company. The Platform would not be provided without these limitations.

10. INDEMNIFICATION

You agree to indemnify, defend, and hold harmless the Company, its affiliates, officers, directors, employees, agents, and licensors from and against all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
• Your use of the Platform
• Your violation of these Terms
• Your violation of any applicable law or regulation
• Your infringement of any third-party rights
• Any content you submit to or generate using the Platform
• Any claim that your use of the Platform caused harm to a third party

11. TERMINATION

11.1 Termination by You. You may terminate your account at any time by following the account closure procedures provided on the Platform or by contacting us.

11.2 Termination by Us. We may terminate or suspend your account immediately, without prior notice, if you violate these Terms or engage in conduct that we determine is harmful to the Platform, other users, or third parties.

11.3 Effect of Termination. Upon termination:
• Your right to use the Platform will cease immediately
• We may delete your account and associated data
• Outstanding payment obligations will remain due
• Sections of these Terms that by their nature should survive will continue to apply

12. GOVERNING LAW AND DISPUTE RESOLUTION

12.1 Governing Law. These Terms are governed by the laws of the State of ${formData.governingLaw || 'California'}, without regard to conflict of law principles.

12.2 Dispute Resolution. ${getDisputeResolution()}

12.3 Class Action Waiver. ${getClassActionWaiver()}

13. GENERAL PROVISIONS

13.1 Entire Agreement. These Terms, together with our Privacy Policy and any other legal notices published on the Platform, constitute the entire agreement between you and the Company.

13.2 Amendment. We may modify these Terms at any time by posting the updated Terms on the Platform. Your continued use after such posting constitutes acceptance of the modified Terms.

13.3 Severability. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.

13.4 Waiver. No waiver of any provision of these Terms will be deemed a further or continuing waiver of such provision or any other provision.

13.5 Assignment. You may not assign these Terms without our prior written consent. We may assign these Terms without restriction.

13.6 Force Majeure. We will not be liable for any delay or failure to perform due to causes beyond our reasonable control.

13.7 Contact Information. For questions about these Terms, please contact us at:
${company}
${address}
Email: ${contact}
Website: ${website}

By using the ${platform} platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.

Last Updated: ${effectiveDate}
`;
  };
  // Helper functions for generating dynamic content
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
      ipInfringement: 'Infringing upon intellectual property rights of others, including copyrights, trademarks, and patents',
      hateSpeech: 'Generating or disseminating hate speech, harassment, discrimination, or content that promotes violence',
      spam: 'Transmitting spam, unsolicited communications, or malicious code',
      security: 'Attempting to circumvent security measures, hack systems, or gain unauthorized access',
      scraping: 'Scraping, crawling, or extracting data from the Platform without authorization',
      reselling: 'Reselling, sublicensing, or redistributing Platform access without explicit permission',
      weapons: 'Developing, designing, or facilitating the creation of weapons or harmful devices',
      misinformation: 'Deliberately generating or spreading false information or deepfakes',
      harassment: 'Harassing, stalking, or threatening other users or individuals',
      impersonation: 'Impersonating others or misrepresenting your identity or affiliations',
      malware: 'Creating, distributing, or facilitating malicious software or cyberattacks',
      childSafety: 'Creating content that exploits, harms, or endangers minors',
      terrorism: 'Supporting, promoting, or facilitating terrorist activities or organizations',
      fraud: 'Engaging in fraudulent activities, scams, or financial crimes',
      gambling: 'Operating gambling services or facilitating illegal gambling activities',
      adultContent: 'Generating explicit adult content or pornographic materials',
      competitiveAnalysis: 'Using the Platform to conduct competitive intelligence against us or our partners'
    };
    return descriptions[key] || `Engaging in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} activities`;
  };

  const getUserContentOwnership = () => {
    return `You retain ownership of any content you submit to the Platform ("User Content"). However, by submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Platform and our business operations. This license includes the right to make your User Content available to other users of the Platform and to use your User Content to improve and train our AI models.`;
  };

  const getAIContentOwnership = () => {
    return `Subject to your compliance with these Terms and payment of applicable fees, you own the AI-Generated Content created through your use of the Platform. However, you acknowledge that similar or identical content may be generated for other users, as AI models may produce similar outputs for similar inputs. We make no representations or warranties regarding the uniqueness of AI-Generated Content.`;
  };

  const getLicenseGrants = () => {
    return `We grant you a personal, non-exclusive, non-transferable, revocable license to access and use the Platform in accordance with these Terms. This license does not include the right to: (a) resell or make commercial use of the Platform or its content; (b) collect or use product listings, descriptions, or prices; (c) make derivative uses of the Platform or its content; (d) use data mining, robots, or similar tools; or (e) reverse engineer any aspect of the Platform.`;
  };

  const getPaymentTerms = () => {
    if (formData.paymentModel === 'free') {
      return `6.1 Free Service. The Platform is currently offered free of charge. We reserve the right to introduce paid features or modify our pricing structure with appropriate notice.`;
    }
    
    return `6.1 Payment Model. ${getPaymentModelDescription()}

6.2 Billing and Payment. ${getBillingDescription()}

6.3 Payment Methods. We accept major credit cards, PayPal, and other payment methods as displayed during checkout. You authorize us to charge your chosen payment method for all fees.

6.4 Refunds. ${getRefundPolicy()}

6.5 Price Changes. We may modify our pricing with 30 days' advance notice. Price changes will not affect your current billing period.

6.6 Taxes. You are responsible for all taxes associated with your use of the Platform.`;
  };

  const getPaymentModelDescription = () => {
    const descriptions = {
      'freemium': 'We offer both free and paid tiers. Paid subscriptions provide access to advanced features, higher usage limits, and priority support.',
      'subscription': 'The Platform operates on a subscription basis. Payment is required to access Platform features.',
      'usage': 'Pricing is based on actual usage of Platform resources and API calls.',
      'hybrid': 'We use a combination of subscription and usage-based pricing.'
    };
    return descriptions[formData.paymentModel] || 'Payment terms will be specified based on your selected plan.';
  };

  const getBillingDescription = () => {
    const cycles = {
      'monthly': 'Subscriptions are billed monthly in advance.',
      'quarterly': 'Subscriptions are billed quarterly in advance.',
      'annual': 'Subscriptions are billed annually in advance.'
    };
    
    const renewal = {
      'yes': 'Subscriptions automatically renew unless cancelled before the next billing cycle.',
      'opt-in': 'Automatic renewal is optional and must be explicitly enabled.',
      'no': 'Subscriptions do not automatically renew.'
    };
    
    return `${cycles[formData.billingCycle] || 'Billing cycles are specified in your subscription plan.'} ${renewal[formData.autoRenewal] || 'Renewal terms are specified in your subscription agreement.'}`;
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
      'fees-paid': 'the amount paid by you to us in the twelve (12) months preceding the event giving rise to liability',
      'fees-total': 'the total amount paid by you to us since you began using the Platform',
      'fixed-amount': `$${formData.fixedLiabilityAmount || '1,000'}`,
      'no-cap': 'the maximum amount permitted by applicable law'
    };
    return caps[formData.liabilityCap] || '$1,000';
  };

  const getDisputeResolution = () => {
    const methods = {
      'courts': `Any dispute will be resolved exclusively in the state and federal courts located in ${formData.governingLaw || 'California'}.`,
      'arbitration': `Any dispute will be resolved through binding arbitration administered by the ${formData.arbitrationProvider || 'American Arbitration Association'}.`,
      'mediation-first': 'Disputes will first be addressed through mediation, and if unsuccessful, through court proceedings.',
      'mediation-arbitration': 'Disputes will first be addressed through mediation, and if unsuccessful, through binding arbitration.'
    };
    return methods[formData.disputeResolution] || methods.courts;
  };

  const getClassActionWaiver = () => {
    if (formData.classAction === 'yes') {
      return 'TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AND WE WAIVE THE RIGHT TO TRIAL BY JURY AND THE RIGHT TO PARTICIPATE IN CLASS ACTIONS OR OTHER REPRESENTATIVE PROCEEDINGS.';
    }
    return 'Nothing in these Terms limits your right to participate in class action proceedings where permitted by law.';
  };
  // Form Components
  const CompanyInfoTab = () => (
    <div className="tab-content active">
      <div className="form-section">
        <div className="section-title">Basic Company Information</div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyName">Company Legal Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g., AI Innovations, Inc."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="platformName">AI Platform/Product Name *</label>
            <input
              type="text"
              id="platformName"
              name="platformName"
              value={formData.platformName}
              onChange={handleChange}
              placeholder="e.g., IntelliBot, SmartAI, DataMind"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyWebsite">Company Website</label>
            <input
              type="url"
              id="companyWebsite"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="https://www.yourcompany.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="businessType">Business Entity Type</label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
            >
              <option value="corporation">Corporation</option>
              <option value="llc">Limited Liability Company (LLC)</option>
              <option value="partnership">Partnership</option>
              <option value="sole-proprietorship">Sole Proprietorship</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="companyAddress">Company Address</label>
          <textarea
            id="companyAddress"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            placeholder="Full business address including street, city, state, zip code"
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyContact">Legal Contact Email *</label>
            <input
              type="email"
              id="companyContact"
              name="companyContact"
              value={formData.companyContact}
              onChange={handleChange}
              placeholder="legal@yourcompany.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="effectiveDate">Terms Effective Date</label>
            <input
              type="text"
              id="effectiveDate"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              placeholder="e.g., January 1, 2025"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const PlatformDetailsTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-title">Platform Configuration</div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="platformType">Platform Type</label>
            <select
              id="platformType"
              name="platformType"
              value={formData.platformType}
              onChange={handleChange}
            >
              <option value="saas">Software as a Service (SaaS)</option>
              <option value="api">API Service</option>
              <option value="mobile">Mobile Application</option>
              <option value="enterprise">Enterprise Solution</option>
              <option value="consumer">Consumer Application</option>
              <option value="analytics">Analytics Platform</option>
              <option value="automation">Automation Tool</option>
              <option value="creative">Creative Tool</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="primaryFunction">Primary AI Function</label>
            <select
              id="primaryFunction"
              name="primaryFunction"
              value={formData.primaryFunction}
              onChange={handleChange}
            >
              <option value="general-ai">General Purpose AI</option>
              <option value="nlp">Natural Language Processing</option>
              <option value="computer-vision">Computer Vision</option>
              <option value="predictive">Predictive Analytics</option>
              <option value="recommendation">Recommendation Engine</option>
              <option value="automation">Process Automation</option>
              <option value="creative">Creative Content Generation</option>
              <option value="analysis">Data Analysis</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="targetAudience">Target Audience</label>
            <select
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
            >
              <option value="business">Business Users</option>
              <option value="consumer">General Consumers</option>
              <option value="developer">Developers/Technical Users</option>
              <option value="research">Researchers/Academics</option>
              <option value="enterprise">Enterprise Clients</option>
            </select>
          </div>
        </div>
        
        <div className="section-title">Data and AI Processing</div>
        
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="dataProcessing"
              name="dataProcessing"
              checked={formData.dataProcessing}
              onChange={handleChange}
            />
            <label htmlFor="dataProcessing">Platform processes user data for AI operations</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="aiTraining"
              name="aiTraining"
              checked={formData.aiTraining}
              onChange={handleChange}
            />
            <label htmlFor="aiTraining">Use user interactions to improve AI models</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="apiAccess"
              name="apiAccess"
              checked={formData.apiAccess}
              onChange={handleChange}
            />
            <label htmlFor="apiAccess">Provide API access to third-party developers</label>
          </div>
        </div>
      </div>
    </div>
  );

  const UserTermsTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-title">User Eligibility</div>
        
        <div className="form-group">
          <label htmlFor="minAge">Minimum Age Requirement</label>
          <select
            id="minAge"
            name="minAge"
            value={formData.minAge}
            onChange={handleChange}
          >
            <option value="13">13 years old (COPPA compliant)</option>
            <option value="16">16 years old (GDPR Article 8)</option>
            <option value="18">18 years old (Adult only)</option>
            <option value="21">21 years old (Restricted content)</option>
          </select>
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
            <div key={key} className="checkbox-item">
              <input
                type="checkbox"
                id={`accountRequirements.${key}`}
                name={`accountRequirements.${key}`}
                checked={formData.accountRequirements[key]}
                onChange={handleChange}
              />
              <label htmlFor={`accountRequirements.${key}`}>{label}</label>
            </div>
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
            <div key={key} className="checkbox-item">
              <input
                type="checkbox"
                id={`prohibitedActivities.${key}`}
                name={`prohibitedActivities.${key}`}
                checked={formData.prohibitedActivities[key]}
                onChange={handleChange}
              />
              <label htmlFor={`prohibitedActivities.${key}`}>{label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  // Payment Modal Component
  const PaymentModal = () => {
    if (!showPaymentModal) return null;
    
    return (
      <div className="payment-overlay">
        <div className="payment-modal">
          {paymentComplete ? (
            <div className="payment-success">
              <Icon name="check-circle" size={48} style={{color: '#28a745'}} />
              <h2>Payment Successful!</h2>
              <p>You now have full access to generate and download your AI Terms of Use document.</p>
            </div>
          ) : (
            <>
              <h2>Get Full Access</h2>
              <div className="price-display">$9.99</div>
              <p>Unlock the complete AI Terms of Use Generator with:</p>
              <ul className="feature-list">
                <li>Complete, comprehensive terms document</li>
                <li>Copy to clipboard functionality</li>
                <li>Download as MS Word document</li>
                <li>Risk analysis and recommendations</li>
                <li>Legal compliance guidance</li>
                <li>Lifetime access to this generator</li>
              </ul>
              <div id="paypal-button-container" className="paypal-button-container"></div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{marginTop: '20px', background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Live Preview Component with optimized performance
  const LivePreview = () => {
    // Memoize document text generation to prevent unnecessary recalculations
    const documentText = useMemo(() => {
      return generateDocumentText();
    }, [formData]);
    
    // Optimize preview rendering
    const previewHTML = useMemo(() => {
      return documentText
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^(\d+\.\s+[A-Z\s&]+)$/gm, '<h2>$1</h2>')
        .replace(/^(\d+\.\d+\s+[A-Za-z\s]+)\./gm, '<h3>$1</h3>');
    }, [documentText]);
    
    // Scroll to highlighted section when lastChanged updates
    useEffect(() => {
      if (lastChanged && previewRef.current) {
        const timeout = setTimeout(() => {
          // Simple highlighting - find section based on current tab
          const sections = previewRef.current.querySelectorAll('h2, h3');
          if (sections.length > currentTab) {
            sections[currentTab]?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
        
        return () => clearTimeout(timeout);
      }
    }, [lastChanged, currentTab]);
    
    return (
      <div className="preview-panel">
        <div className="preview-header">
          <h3 className="preview-title">
            <Icon name="file-text" size={20} style={{marginRight: '8px'}} />
            Live Preview - AI Terms of Use
            {!isPaid && <span className="premium-badge">Download Requires Payment</span>}
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
            {currentTab === 0 && <CompanyInfoTab />}
            {currentTab === 1 && <PlatformDetailsTab />}
            {currentTab === 2 && <UserTermsTab />}
            {currentTab === 3 && <IPContentTab />}
            {currentTab === 4 && <PrivacyDataTab />}
            {currentTab === 5 && <PaymentTermsTab />}
            {currentTab === 6 && <LegalDisputesTab />}
            {currentTab === 7 && (
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
                </div>
                
                {!isPaid && (
                  <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <p><strong>Unlock complete risk analysis and legal recommendations</strong></p>
                    <button 
                      className="nav-button" 
                      onClick={() => setShowPaymentModal(true)}
                      style={{background: 'var(--premium-gradient)', color: 'white', border: 'none'}}
                    >
                      Get Full Access - $9.99
                    </button>
                  </div>
                )}
              </div>
            )}
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
  const IPContentTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-title">Intellectual Property Rights</div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ipOwnership">User Content Ownership</label>
            <select
              id="ipOwnership"
              name="ipOwnership"
              value={formData.ipOwnership || 'user'}
              onChange={handleChange}
            >
              <option value="user">User retains ownership</option>
              <option value="company">Company claims ownership</option>
              <option value="joint">Joint ownership</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="licenseType">License to User Content</label>
            <select
              id="licenseType"
              name="licenseType"
              value={formData.licenseType || 'broad'}
              onChange={handleChange}
            >
              <option value="limited">Limited license (service operation only)</option>
              <option value="broad">Broad license (includes AI training)</option>
              <option value="commercial">Commercial license (marketing use)</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="aiOutputOwnership">AI-Generated Content Ownership</label>
            <select
              id="aiOutputOwnership"
              name="aiOutputOwnership"
              value={formData.aiOutputOwnership || 'user'}
              onChange={handleChange}
            >
              <option value="user">User owns AI outputs</option>
              <option value="company">Company owns AI outputs</option>
              <option value="public">Public domain</option>
            </select>
          </div>
        </div>
        
        <div className="section-title">Additional IP Provisions</div>
        
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="ipFeedback"
              name="ipFeedback"
              checked={formData.ipFeedback || true}
              onChange={handleChange}
            />
            <label htmlFor="ipFeedback">License to user feedback and suggestions</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="ipTraining"
              name="ipTraining"
              checked={formData.ipTraining || true}
              onChange={handleChange}
            />
            <label htmlFor="ipTraining">Right to use content for AI training</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="ipReverseEngineering"
              name="ipReverseEngineering"
              checked={formData.ipReverseEngineering || false}
              onChange={handleChange}
            />
            <label htmlFor="ipReverseEngineering">Prohibit reverse engineering</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="ipAttribution"
              name="ipAttribution"
              checked={formData.ipAttribution || false}
              onChange={handleChange}
            />
            <label htmlFor="ipAttribution">Require attribution for AI outputs</label>
          </div>
        </div>
      </div>
    </div>
  );

  const PrivacyDataTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-title">Privacy Policy Integration</div>
        
        <div className="form-group">
          <label htmlFor="privacyPolicyUrl">Privacy Policy URL</label>
          <input
            type="url"
            id="privacyPolicyUrl"
            name="privacyPolicyUrl"
            value={formData.privacyPolicyUrl}
            onChange={handleChange}
            placeholder="https://www.yourcompany.com/privacy"
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
            <div key={key} className="checkbox-item">
              <input
                type="checkbox"
                id={`dataCollection.${key}`}
                name={`dataCollection.${key}`}
                checked={formData.dataCollection[key]}
                onChange={handleChange}
              />
              <label htmlFor={`dataCollection.${key}`}>{label}</label>
            </div>
          ))}
        </div>
        
        <div className="section-title">Data Sharing</div>
        
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="shareServiceProviders"
              name="shareServiceProviders"
              checked={formData.shareServiceProviders || true}
              onChange={handleChange}
            />
            <label htmlFor="shareServiceProviders">Third-party service providers</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="shareAffiliates"
              name="shareAffiliates"
              checked={formData.shareAffiliates || false}
              onChange={handleChange}
            />
            <label htmlFor="shareAffiliates">Company affiliates</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="shareLegal"
              name="shareLegal"
              checked={formData.shareLegal || true}
              onChange={handleChange}
            />
            <label htmlFor="shareLegal">Legal compliance and law enforcement</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="shareAcquisition"
              name="shareAcquisition"
              checked={formData.shareAcquisition || true}
              onChange={handleChange}
            />
            <label htmlFor="shareAcquisition">Business transfers and acquisitions</label>
          </div>
        </div>
        
        <div className="section-title">User Rights (GDPR/CCPA)</div>
        
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="rightAccess"
              name="rightAccess"
              checked={formData.rightAccess || true}
              onChange={handleChange}
            />
            <label htmlFor="rightAccess">Right to access personal data</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="rightCorrect"
              name="rightCorrect"
              checked={formData.rightCorrect || true}
              onChange={handleChange}
            />
            <label htmlFor="rightCorrect">Right to correct inaccurate data</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="rightDelete"
              name="rightDelete"
              checked={formData.rightDelete || true}
              onChange={handleChange}
            />
            <label htmlFor="rightDelete">Right to delete personal data</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="rightPortability"
              name="rightPortability"
              checked={formData.rightPortability || true}
              onChange={handleChange}
            />
            <label htmlFor="rightPortability">Right to data portability</label>
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentTermsTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-title">Payment Model</div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="paymentModel">Business Model</label>
            <select
              id="paymentModel"
              name="paymentModel"
              value={formData.paymentModel}
              onChange={handleChange}
            >
              <option value="free">Free service</option>
              <option value="freemium">Freemium (free + paid tiers)</option>
              <option value="subscription">Subscription only</option>
              <option value="usage">Usage-based pricing</option>
              <option value="hybrid">Hybrid subscription + usage</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="billingCycle">Billing Cycle</label>
            <select
              id="billingCycle"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="autoRenewal">Auto-Renewal Policy</label>
            <select
              id="autoRenewal"
              name="autoRenewal"
              value={formData.autoRenewal}
              onChange={handleChange}
            >
              <option value="yes">Yes, with notification</option>
              <option value="opt-in">Opt-in only</option>
              <option value="no">No auto-renewal</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="refundPolicy">Refund Policy</label>
            <select
              id="refundPolicy"
              name="refundPolicy"
              value={formData.refundPolicy}
              onChange={handleChange}
            >
              <option value="none">No refunds</option>
              <option value="limited">Limited (case-by-case)</option>
              <option value="days-7">7-day refund period</option>
              <option value="days-14">14-day refund period</option>
              <option value="days-30">30-day refund period</option>
            </select>
          </div>
        </div>
        
        <div className="section-title">Accepted Payment Methods</div>
        
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="acceptCreditCard"
              name="acceptCreditCard"
              checked={formData.acceptCreditCard || true}
              onChange={handleChange}
            />
            <label htmlFor="acceptCreditCard">Credit/Debit Cards</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="acceptPayPal"
              name="acceptPayPal"
              checked={formData.acceptPayPal || true}
              onChange={handleChange}
            />
            <label htmlFor="acceptPayPal">PayPal</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="acceptCrypto"
              name="acceptCrypto"
              checked={formData.acceptCrypto || false}
              onChange={handleChange}
            />
            <label htmlFor="acceptCrypto">Cryptocurrency</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="acceptWire"
              name="acceptWire"
              checked={formData.acceptWire || false}
              onChange={handleChange}
            />
            <label htmlFor="acceptWire">Wire Transfer</label>
          </div>
        </div>
      </div>
    </div>
  );

  const LegalDisputesTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-title">Governing Law</div>
        
        <div className="form-group">
          <label htmlFor="governingLaw">Governing Law State</label>
          <select
            id="governingLaw"
            name="governingLaw"
            value={formData.governingLaw}
            onChange={handleChange}
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
          </select>
        </div>
        
        <div className="section-title">Dispute Resolution</div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="disputeResolution">Resolution Method</label>
            <select
              id="disputeResolution"
              name="disputeResolution"
              value={formData.disputeResolution}
              onChange={handleChange}
            >
              <option value="courts">Courts only</option>
              <option value="arbitration">Binding arbitration</option>
              <option value="mediation-first">Mediation first, then courts</option>
              <option value="mediation-arbitration">Mediation first, then arbitration</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="arbitrationProvider">Arbitration Provider</label>
            <select
              id="arbitrationProvider"
              name="arbitrationProvider"
              value={formData.arbitrationProvider}
              onChange={handleChange}
            >
              <option value="aaa">American Arbitration Association</option>
              <option value="jams">JAMS</option>
              <option value="icc">International Chamber of Commerce</option>
            </select>
          </div>
        </div>
        
        <div className="section-title">Liability and Warranties</div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="liabilityCap">Liability Cap</label>
            <select
              id="liabilityCap"
              name="liabilityCap"
              value={formData.liabilityCap}
              onChange={handleChange}
            >
              <option value="fees-paid">Fees paid in last 12 months</option>
              <option value="fees-total">Total fees paid</option>
              <option value="fixed-amount">Fixed amount</option>
              <option value="no-cap">No cap (maximum by law)</option>
            </select>
          </div>
          
          {formData.liabilityCap === 'fixed-amount' && (
            <div className="form-group">
              <label htmlFor="fixedLiabilityAmount">Fixed Amount ($)</label>
              <input
                type="number"
                id="fixedLiabilityAmount"
                name="fixedLiabilityAmount"
                value={formData.fixedLiabilityAmount}
                onChange={handleChange}
                placeholder="1000"
              />
            </div>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="classAction">Class Action Waiver</label>
            <select
              id="classAction"
              name="classAction"
              value={formData.classAction}
              onChange={handleChange}
            >
              <option value="yes">Include class action waiver</option>
              <option value="no">Allow class actions</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="warrantyDisclaimer">Warranty Disclaimer</label>
            <select
              id="warrantyDisclaimer"
              name="warrantyDisclaimer"
              value={formData.warrantyDisclaimer}
              onChange={handleChange}
            >
              <option value="standard">Standard disclaimer (as-is)</option>
              <option value="limited">Limited warranty</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );