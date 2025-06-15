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
    performanceWarranty: false
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
    governingLaw: "State law that governs the terms of use",
    disputeResolution: "How legal disputes will be resolved",
    limitLiability: "Limit your company's financial liability for damages - recommended for most businesses",
    consequentialDamages: "Prevent liability for indirect damages like lost profits - highly recommended",
    liabilityCapAmount: "Maximum amount you'll pay in damages - limits your financial exposure",
    indemnification: "Users must cover your legal costs if they cause problems - use carefully as it may deter users",
    warrantyDisclaimer: "Disclaim warranties and provide 'as-is' service - standard protection",
    warrantyPeriod: "If any warranties cannot be disclaimed by law, limit them to this period",
    performanceWarranty: "Clarify that you don't guarantee specific results from AI - important for AI services"
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
    return `TERMS OF USE FOR ${formData.platformName || '[PLATFORM NAME]'}

Last Updated: ${new Date().toLocaleDateString()}

ACCEPTANCE OF TERMS

These Terms of Use ("Terms") govern your use of ${formData.platformName || '[PLATFORM NAME]'}, an artificial intelligence platform (the "Service") operated by ${formData.companyName || '[COMPANY NAME]'} ("Company," "we," "us," or "our"), located at ${formData.businessAddress || '[BUSINESS ADDRESS]'}.

By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service. Your continued use of the Service constitutes acceptance of any modifications to these Terms.

1. DESCRIPTION OF SERVICE

${formData.platformName || '[PLATFORM NAME]'} is an AI-powered ${formData.platformType} platform that provides users with advanced artificial intelligence capabilities. The Service allows users to interact with sophisticated AI models, receive automated responses, and access various AI-driven features designed to enhance productivity and user experience.

Our Service may include features such as natural language processing, content generation, data analysis, and other AI-powered functionalities. The specific features available may vary based on your subscription level and may be updated from time to time.

2. USER ELIGIBILITY AND REGISTRATION

You must be at least ${formData.minAge} years old to use this Service. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.

If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

3. USER CONTENT AND DATA USAGE

${formData.userContent ? 
`You retain ownership of any content you submit to the Service ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and display your content solely for the purpose of providing and improving the Service.

We may use your User Content to train and improve our AI models, subject to our data protection practices and applicable privacy laws.` : 
`You retain full ownership and control over any content you submit to the Service. We do not use your content for training purposes or any other use beyond providing the immediate Service functionality.`}

${formData.dataCollection ? 
`We collect and process data about your interactions with the Service, including usage patterns, performance metrics, and user preferences. This data is used to improve functionality, enhance user experience, and develop new features. All data collection is subject to our Privacy Policy and applicable data protection laws.

Data Retention: We retain your data for a period of ${formData.dataRetention} years from your last interaction with the Service, unless required by law to retain it longer or you request earlier deletion.` : 
`We minimize data collection and do not retain personal data about your interactions with the Service beyond what is strictly necessary for basic functionality and security purposes.`}

4. ACCEPTABLE USE POLICY

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

5. INTELLECTUAL PROPERTY RIGHTS

The Service and its underlying technology, including but not limited to AI models, algorithms, software, designs, text, graphics, and logos, are the intellectual property of ${formData.companyName || '[COMPANY NAME]'} and its licensors, protected by copyright, trademark, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to use the Service solely for its intended purpose. This license does not grant you any ownership rights in the Service or its intellectual property.

${formData.apiAccess ? 
`API Access: If you have been granted access to our API, you must comply with our API Terms of Service and usage guidelines. API access may be subject to rate limits and additional restrictions.` : ''}

6. PRIVACY AND DATA PROTECTION

Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.

${formData.thirdPartyIntegrations ? 
`Third-Party Integrations: The Service may integrate with third-party services. Your use of such integrations is subject to the terms and privacy policies of those third parties.` : ''}

7. DISCLAIMERS AND LIMITATION OF LIABILITY

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

8. ACCOUNT TERMINATION AND SUSPENSION

We may terminate or suspend your access to the Service ${formData.termination === 'immediate' ? 'immediately and without prior notice' : 'with reasonable prior notice'} if you violate these Terms, engage in prohibited activities, or for any other reason at our sole discretion.

You may terminate your account at any time by contacting us at ${formData.supportEmail || formData.contactEmail || '[SUPPORT EMAIL]'}. Upon termination, your right to use the Service will cease immediately.

9. DISPUTE RESOLUTION

${formData.disputeResolution === 'arbitration' ? 
`Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration rather than in court, except that either party may seek injunctive relief in court for intellectual property disputes.` : 
`Any disputes arising from these Terms or your use of the Service will be resolved in the courts of ${formData.jurisdiction}, and you consent to the jurisdiction of such courts.`}

10. MODIFICATIONS TO TERMS

We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after any modifications constitutes acceptance of the updated Terms.

11. GOVERNING LAW

These Terms shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without regard to its conflict of law principles. Any legal action arising from these Terms shall be brought in the courts of ${formData.jurisdiction}.

12. CONTACT INFORMATION

If you have any questions about these Terms or need support, please contact us:

Email: ${formData.contactEmail || '[CONTACT EMAIL]'}
Support: ${formData.supportEmail || '[SUPPORT EMAIL]'}
Website: ${formData.websiteURL || '[WEBSITE URL]'}
Address: ${formData.businessAddress || '[BUSINESS ADDRESS]'}

For more information about ${formData.companyName || '[COMPANY NAME]'} and our services, visit ${formData.websiteURL || '[WEBSITE URL]'}.

13. SEVERABILITY

If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.

14. ENTIRE AGREEMENT

These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and ${formData.companyName || '[COMPANY NAME]'} regarding the Service and supersede all prior agreements and understandings.`;
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
          /AI-powered .* platform/,
          `AI-powered <span class="highlighted-text">${formData.platformType}</span> platform`
        );
        break;
      case 'minAge':
        highlightedText = highlightedText.replace(
          new RegExp(`at least ${formData.minAge} years old`, 'g'),
          `at least <span class="highlighted-text">${formData.minAge}</span> years old`
        );
        break;
      case 'termination':
        const terminationText = formData.termination === 'immediate' ? 'immediately' : 'with prior notice';
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
      case 'jurisdiction':
        highlightedText = highlightedText.replace(
          /Any legal action arising from these Terms shall be brought in the courts of .*/,
          `Any legal action arising from these Terms shall be brought in the courts of <span class="highlighted-text">${formData.jurisdiction}</span>.`
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
      case 'dataCollection':
        highlightedText = highlightedText.replace(
          /We may collect and process data.*?Privacy Policy\.|We do not collect personal data.*?basic functionality\./,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        break;
      case 'userContent':
        highlightedText = highlightedText.replace(
          /You retain ownership.*?providing the Service\.|You retain full ownership.*?submit to the Service\./,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
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
      case 'disputeResolution':
        if (formData.disputeResolution === 'arbitration') {
          highlightedText = highlightedText.replace(
            /Any disputes arising from these Terms.*?intellectual property disputes\./s,
            function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            }
          );
        } else {
          highlightedText = highlightedText.replace(
            /Any disputes arising from these Terms.*?jurisdiction of such courts\./s,
            function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            }
          );
        }
        break;
      case 'commercialUse':
        if (!formData.commercialUse) {
          highlightedText = highlightedText.replace(
            /• Use the Service for commercial purposes without explicit written permission/,
            `<span class="highlighted-text">• Use the Service for commercial purposes without explicit written permission</span>`
          );
        }
        break;
      case 'apiAccess':
      case 'thirdPartyIntegrations':
        // These affect the content in different sections
        if (lastChanged === 'apiAccess' && formData.apiAccess) {
          highlightedText = highlightedText.replace(
            /API Access: If you have been granted access.*?additional restrictions\./,
            function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            }
          );
        } else if (lastChanged === 'thirdPartyIntegrations' && formData.thirdPartyIntegrations) {
          highlightedText = highlightedText.replace(
            /Third-Party Integrations: The Service may integrate.*?those third parties\./,
            function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            }
          );
        }
        break;
      case 'limitLiability':
      case 'consequentialDamages':
      case 'liabilityCapAmount':
      case 'indemnification':
        highlightedText = highlightedText.replace(
          /LIMITATION OF LIABILITY:.*?(?=8\. ACCOUNT TERMINATION|INDEMNIFICATION:|$)/s,
          function(match) {
            return `<span class="highlighted-text">${match}</span>`;
          }
        );
        if (formData.indemnification) {
          highlightedText = highlightedText.replace(
            /INDEMNIFICATION:.*?third-party rights\./,
            function(match) {
              return `<span class="highlighted-text">${match}</span>`;
            }
          );
        }
        break;
      case 'warrantyDisclaimer':
      case 'warrantyPeriod':
      case 'performanceWarranty':
        highlightedText = highlightedText.replace(
          /WARRANTY DISCLAIMER:.*?(?=LIMITATION OF LIABILITY:|$)/s,
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
                <div className="form-row">
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
                  <div className="form-group">
                    <label>Jurisdiction <HelpIcon tooltip={tooltips.jurisdiction} /></label>
                    <select
                      name="jurisdiction"
                      value={formData.jurisdiction}
                      onChange={handleChange}
                    >
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
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
                    </select>
                  </div>
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
                <div className="form-row">
                  <div className="form-group">
                    <label>Governing Law <HelpIcon tooltip={tooltips.governingLaw} /></label>
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