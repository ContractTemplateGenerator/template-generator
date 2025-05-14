const { useState, useEffect, useRef } = React;

// Main component
const AIUsagePolicyGenerator = () => {
  // State for form data
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    businessAddress: '',
    contactEmail: '',
    effectiveDate: '',
    
    // Policy Scope
    policyScope: 'all-users', // all-users, employees-only, contractors, specific-departments
    specificDepartments: '',
    customScope: '',
    
    // AI Systems & Tools
    aiTypes: {
      chatbots: false,
      documentAnalysis: false,
      imageGeneration: false,
      voiceAssistants: false,
      dataAnalytics: false,
      codingAssistants: false,
      customerService: false,
      other: false
    },
    otherAiTypes: '',
    specificAiTools: '',
    
    // Acceptable Use
    businessPurposesOnly: true,
    clientCommunicationAllowed: true,
    internalCommunicationAllowed: true,
    contentCreationAllowed: true,
    dataAnalysisAllowed: true,
    codeGenerationAllowed: true,
    customAcceptableUse: '',
    
    // Prohibited Use
    prohibitPersonalData: true,
    prohibitConfidentialInfo: true,
    prohibitIntellectualProperty: true,
    prohibitOffensiveContent: true,
    prohibitIllegalActivity: true,
    customProhibitedUse: '',
    
    // Data Handling
    dataRetentionPeriod: '30-days',
    dataMinimization: true,
    dataAccuracy: true,
    sensitiveDataRestrictions: true,
    customDataHandling: '',
    
    // Security Measures
    requireAuthentication: true,
    accessControl: true,
    regularUpdates: true,
    encryptionRequired: true,
    loggingMonitoring: true,
    customSecurityMeasures: '',
    
    // Training & Compliance
    initialTrainingRequired: true,
    ongoingTraining: true,
    trainingFrequency: 'annually',
    acknowledgmentRequired: true,
    complianceOfficer: '',
    customTraining: '',
    
    // Enforcement
    violationConsequences: 'escalating', // verbal-warning, written-warning, escalating, immediate-termination
    reportingProcedure: true,
    whistleblowerProtection: true,
    customEnforcement: '',
    
    // Updates & Review
    reviewFrequency: 'annually', // monthly, quarterly, bi-annually, annually
    updateNotification: 'email', // email, intranet, both
    versionControl: true,
    customReviewProcess: ''
  });
  
  // State for tracking the current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for tracking what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // State for the generated document text
  const [documentText, setDocumentText] = useState('');
  
  // State for policy analysis
  const [policyAnalysis, setPolicyAnalysis] = useState({
    issues: [],
    warnings: [],
    strengths: [],
    score: 100
  });
  
  // Function to analyze the policy for completeness and potential issues
  const analyzePolicyDocument = () => {
    const analysis = {
      issues: [],
      warnings: [],
      strengths: [],
      score: 100 // Start with perfect score and deduct for issues
    };
    
    // Check for missing basic information
    if (!formData.companyName || formData.companyName.trim() === '') {
      analysis.issues.push("Company name is missing - this should be filled in for proper identification.");
      analysis.score -= 5;
    }
    
    if (!formData.effectiveDate || formData.effectiveDate.trim() === '') {
      analysis.issues.push("Effective date is not specified - important for compliance tracking.");
      analysis.score -= 5;
    }
    
    if (!formData.contactEmail || formData.contactEmail.trim() === '') {
      analysis.issues.push("Contact email is missing - users need to know who to contact with questions.");
      analysis.score -= 3;
    }
    
    // Check for policy completeness
    const selectedAiTypes = Object.values(formData.aiTypes).filter(Boolean).length;
    if (selectedAiTypes === 0) {
      analysis.warnings.push("No AI systems are specifically authorized - consider specifying which types of AI tools users can access.");
      analysis.score -= 3;
    }
    
    if (!formData.specificAiTools || formData.specificAiTools.trim() === '') {
      analysis.warnings.push("No specific AI tools are mentioned - naming authorized tools helps prevent ambiguity.");
      analysis.score -= 2;
    }
    
    // Check for security measures
    const securityCount = [
      formData.requireAuthentication,
      formData.accessControl,
      formData.regularUpdates,
      formData.encryptionRequired,
      formData.loggingMonitoring
    ].filter(Boolean).length;
    
    if (securityCount < 3) {
      analysis.warnings.push("Limited security measures are specified - consider adding more security controls for AI systems.");
      analysis.score -= 5;
    }
    
    // Check for training requirements
    if (!formData.initialTrainingRequired) {
      analysis.warnings.push("Initial training is not required - training helps ensure proper AI system usage.");
      analysis.score -= 3;
    }
    
    // Check for privacy and data protections
    if (!formData.prohibitPersonalData && !formData.prohibitConfidentialInfo) {
      analysis.issues.push("Missing critical data protection provisions for personal and confidential information.");
      analysis.score -= 10;
    }
    
    // Identify strengths
    if (formData.prohibitPersonalData && formData.prohibitConfidentialInfo && formData.sensitiveDataRestrictions) {
      analysis.strengths.push("Strong data protection provisions included.");
    }
    
    if (securityCount >= 4) {
      analysis.strengths.push("Comprehensive security measures specified.");
    }
    
    if (formData.initialTrainingRequired && formData.ongoingTraining) {
      analysis.strengths.push("Complete training requirements included.");
    }
    
    if (formData.reportingProcedure && formData.whistleblowerProtection) {
      analysis.strengths.push("Well-defined reporting mechanisms for violations.");
    }
    
    // Adjust score if needed
    if (analysis.score < 0) analysis.score = 0;
    
    return analysis;
  };
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
  // Tab configuration
  const tabs = [
    { id: 'company-info', label: 'Company Information' },
    { id: 'scope-definitions', label: 'Scope & Definitions' },
    { id: 'ai-systems', label: 'AI Systems & Tools' },
    { id: 'acceptable-use', label: 'Acceptable Use' },
    { id: 'prohibited-use', label: 'Prohibited Use' },
    { id: 'data-handling', label: 'Data Handling' },
    { id: 'security', label: 'Security Measures' },
    { id: 'training', label: 'Training & Compliance' },
    { id: 'enforcement', label: 'Enforcement' },
    { id: 'review', label: 'Updates & Review' },
    { id: 'preview', label: 'Final Document' }
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    if (name.includes('.')) {
      // Handle nested objects (like aiTypes.chatbots)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle regular fields
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
  
  // Generate the policy document based on form data
  useEffect(() => {
    // Generate policy text based on form data
    const generatePolicyText = () => {
      let policy = '';
      
      // Title
      policy += `AI USAGE POLICY\n\n`;
      
      // Company name
      policy += `${formData.companyName || 'COMPANY NAME'}\n\n`;
      
      // Date
      policy += `Effective Date: ${formData.effectiveDate || '[DATE]'}\n\n`;
      
      // 1. Introduction
      policy += `1. INTRODUCTION\n\n`;
      policy += `This Artificial Intelligence (AI) Usage Policy ("Policy") governs the use of AI systems and tools within ${formData.companyName || 'our company'}. This Policy aims to ensure the responsible, ethical, and secure use of AI technologies while maintaining compliance with applicable laws and regulations.\n\n`;
      
      // Rest of the policy generation code...
      
      // 2. Scope
      policy += `2. SCOPE\n\n`;
      
      // Determine policy scope text based on selection
      let scopeText = '';
      switch(formData.policyScope) {
        case 'all-users':
          scopeText = 'all users of company systems, including employees, contractors, temporary workers, and authorized third parties';
          break;
        case 'employees-only':
          scopeText = 'all employees of the company';
          break;
        case 'contractors':
          scopeText = 'all contractors and temporary workers';
          break;
        case 'specific-departments':
          scopeText = `the following departments: ${formData.specificDepartments || '[SPECIFY DEPARTMENTS]'}`;
          break;
        default:
          scopeText = 'all users of company systems';
      }
      
      policy += `This Policy applies to ${scopeText}`;
      
      // Add custom scope if provided
      if (formData.customScope) {
        policy += `. ${formData.customScope}`;
      }
      policy += '.\n\n';
      
      // 3. Definitions
      policy += `3. DEFINITIONS\n\n`;
      policy += `For the purposes of this Policy:\n\n`;
      policy += `"AI Systems" refers to any software, application, or service that utilizes artificial intelligence, machine learning, natural language processing, computer vision, or related technologies.\n\n`;
      policy += `"Company" refers to ${formData.companyName || '[COMPANY NAME]'} and all of its subsidiaries and affiliated entities.\n\n`;
      policy += `"User" refers to any individual covered under the scope of this Policy.\n\n`;
      policy += `"Personal Data" refers to any information relating to an identified or identifiable natural person.\n\n`;
      policy += `"Confidential Information" refers to any non-public information that is designated as confidential or would reasonably be understood to be confidential given the nature of the information and the circumstances of disclosure.\n\n`;
      
      // 4. AI Systems & Tools
      policy += `4. AI SYSTEMS & TOOLS\n\n`;
      policy += `4.1 Authorized AI Systems\n\n`;
      
      // List selected AI types
      const selectedAiTypes = Object.entries(formData.aiTypes)
        .filter(([_, isSelected]) => isSelected)
        .map(([type, _]) => {
          switch(type) {
            case 'chatbots': return 'AI chatbots and conversational agents';
            case 'documentAnalysis': return 'Document analysis and processing tools';
            case 'imageGeneration': return 'Image generation and editing tools';
            case 'voiceAssistants': return 'Voice assistants and speech recognition systems';
            case 'dataAnalytics': return 'Data analytics and prediction tools';
            case 'codingAssistants': return 'Code generation and programming assistance tools';
            case 'customerService': return 'Customer service automation tools';
            case 'other': return formData.otherAiTypes || 'Other AI systems';
            default: return '';
          }
        });
      
      if (selectedAiTypes.length > 0) {
        policy += `The Company authorizes the use of the following types of AI systems:\n`;
        selectedAiTypes.forEach(type => {
          policy += `- ${type}\n`;
        });
        policy += '\n';
      } else {
        policy += `The Company authorizes the use of specific AI systems as approved by management and IT department.\n\n`;
      }
      
      // Specific AI tools
      if (formData.specificAiTools) {
        policy += `4.2 Specific Authorized Tools\n\n`;
        policy += `The following specific AI tools are currently approved for use: ${formData.specificAiTools}\n\n`;
      }
      
      policy += `4.3 Approval Process\n\n`;
      policy += `Users must obtain appropriate authorization before using any AI system not explicitly approved in this Policy. Requests for new AI tools should be submitted to the IT department and will be evaluated based on security, compliance, and business need criteria.\n\n`;
      
      // 5. Acceptable Use
      policy += `5. ACCEPTABLE USE\n\n`;
      policy += `Users may utilize approved AI systems for the following purposes:\n\n`;
      
      // Add selected acceptable uses
      if (formData.businessPurposesOnly) {
        policy += `5.1 Business Purposes\n`;
        policy += `AI systems should be used primarily for legitimate business purposes that benefit the Company.\n\n`;
      }
      
      if (formData.clientCommunicationAllowed) {
        policy += `5.2 Client Communication\n`;
        policy += `AI systems may be used to draft, edit, or enhance client communications, provided that all output is reviewed for accuracy before being sent externally.\n\n`;
      }
      
      if (formData.internalCommunicationAllowed) {
        policy += `5.3 Internal Communication\n`;
        policy += `AI systems may be used to draft, edit, or enhance internal communications and documentation.\n\n`;
      }
      
      if (formData.contentCreationAllowed) {
        policy += `5.4 Content Creation\n`;
        policy += `AI systems may be used to assist in creating content such as articles, reports, presentations, and marketing materials, provided that all output is reviewed for accuracy and appropriateness.\n\n`;
      }
      
      if (formData.dataAnalysisAllowed) {
        policy += `5.5 Data Analysis\n`;
        policy += `AI systems may be used to analyze data and generate insights, provided that all applicable data protection and privacy policies are followed.\n\n`;
      }
      
      if (formData.codeGenerationAllowed) {
        policy += `5.6 Code Generation\n`;
        policy += `AI systems may be used to assist with software development, including code generation and debugging, provided that all output is reviewed and tested before implementation.\n\n`;
      }
      
      // Add custom acceptable use if provided
      if (formData.customAcceptableUse) {
        policy += `5.7 Additional Acceptable Uses\n`;
        policy += `${formData.customAcceptableUse}\n\n`;
      }
      
      // 6. Prohibited Use
      policy += `6. PROHIBITED USE\n\n`;
      policy += `The following uses of AI systems are strictly prohibited:\n\n`;
      
      // Add selected prohibitions
      if (formData.prohibitPersonalData) {
        policy += `6.1 Processing Personal Data\n`;
        policy += `Users must not input personal data into AI systems without proper authorization and compliance with data protection laws. This includes but is not limited to names, contact information, financial data, and health information of customers, employees, or any individuals.\n\n`;
      }
      
      if (formData.prohibitConfidentialInfo) {
        policy += `6.2 Processing Confidential Information\n`;
        policy += `Users must not input confidential business information, trade secrets, or other proprietary information into AI systems without proper authorization and security measures.\n\n`;
      }
      
      if (formData.prohibitIntellectualProperty) {
        policy += `6.3 Intellectual Property Violations\n`;
        policy += `Users must not use AI systems in ways that may infringe on intellectual property rights, including copyright, trademark, and patent rights.\n\n`;
      }
      
      if (formData.prohibitOffensiveContent) {
        policy += `6.4 Creating Offensive Content\n`;
        policy += `Users must not use AI systems to create, generate, or distribute content that is offensive, discriminatory, harassing, or otherwise inappropriate in a professional environment.\n\n`;
      }
      
      if (formData.prohibitIllegalActivity) {
        policy += `6.5 Illegal Activities\n`;
        policy += `Users must not use AI systems to facilitate any illegal activity or to circumvent any company policies or security measures.\n\n`;
      }
      
      // Add custom prohibited use if provided
      if (formData.customProhibitedUse) {
        policy += `6.6 Additional Prohibited Uses\n`;
        policy += `${formData.customProhibitedUse}\n\n`;
      }
      
      // 7. Data Handling & Privacy
      policy += `7. DATA HANDLING & PRIVACY\n\n`;
      
      // Data retention
      policy += `7.1 Data Retention\n`;
      let retentionText = '';
      switch(formData.dataRetentionPeriod) {
        case 'no-retention':
          retentionText = 'Users should avoid storing sensitive queries and responses from AI systems.';
          break;
        case '30-days':
          retentionText = 'Data, queries, and responses from AI systems should be retained for no more than 30 days unless required for specific business, legal, or compliance purposes.';
          break;
        case '60-days':
          retentionText = 'Data, queries, and responses from AI systems should be retained for no more than 60 days unless required for specific business, legal, or compliance purposes.';
          break;
        case '90-days':
          retentionText = 'Data, queries, and responses from AI systems should be retained for no more than 90 days unless required for specific business, legal, or compliance purposes.';
          break;
        case 'custom':
          retentionText = formData.customDataHandling || 'Data retention periods for AI system usage will be determined based on business need and compliance requirements.';
          break;
        default:
          retentionText = 'Data retention periods for AI system usage will be determined based on business need and compliance requirements.';
      }
      policy += `${retentionText}\n\n`;
      
      // Other data handling practices
      if (formData.dataMinimization) {
        policy += `7.2 Data Minimization\n`;
        policy += `Users should only input the minimum amount of data necessary for the specific task being performed with an AI system.\n\n`;
      }
      
      if (formData.dataAccuracy) {
        policy += `7.3 Data Accuracy\n`;
        policy += `Users must verify the accuracy of any output generated by AI systems, particularly when such output will be used for decision-making or external communications.\n\n`;
      }
      
      if (formData.sensitiveDataRestrictions) {
        policy += `7.4 Sensitive Data Restrictions\n`;
        policy += `Additional restrictions and safeguards apply to the processing of sensitive data categories, including health information, biometric data, financial records, and information about minors. Users must consult with the legal or compliance department before processing such data with AI systems.\n\n`;
      }
      
      // Custom data handling
      if (formData.customDataHandling && formData.dataRetentionPeriod !== 'custom') {
        policy += `7.5 Additional Data Handling Requirements\n`;
        policy += `${formData.customDataHandling}\n\n`;
      }
      
      // 8. Security Measures
      policy += `8. SECURITY MEASURES\n\n`;
      
      if (formData.requireAuthentication) {
        policy += `8.1 Authentication\n`;
        policy += `Users must authenticate with secure credentials when accessing AI systems. Sharing of credentials is strictly prohibited.\n\n`;
      }
      
      if (formData.accessControl) {
        policy += `8.2 Access Control\n`;
        policy += `Access to AI systems will be granted on a need-to-use basis, with appropriate levels of access determined by job responsibilities.\n\n`;
      }
      
      if (formData.regularUpdates) {
        policy += `8.3 Regular Updates\n`;
        policy += `AI systems must be kept up-to-date with the latest security patches and updates.\n\n`;
      }
      
      if (formData.encryptionRequired) {
        policy += `8.4 Encryption\n`;
        policy += `Data transmitted to and from AI systems must be encrypted using industry-standard encryption protocols.\n\n`;
      }
      
      if (formData.loggingMonitoring) {
        policy += `8.5 Logging and Monitoring\n`;
        policy += `The Company reserves the right to log and monitor all AI system usage for security, compliance, and performance optimization purposes.\n\n`;
      }
      
      // Custom security measures
      if (formData.customSecurityMeasures) {
        policy += `8.6 Additional Security Measures\n`;
        policy += `${formData.customSecurityMeasures}\n\n`;
      }
      
      // 9. Training & Compliance
      policy += `9. TRAINING & COMPLIANCE\n\n`;
      
      if (formData.initialTrainingRequired) {
        policy += `9.1 Initial Training\n`;
        policy += `All users covered by this Policy must complete initial training on the responsible use of AI systems before being granted access.\n\n`;
      }
      
      if (formData.ongoingTraining) {
        policy += `9.2 Ongoing Training\n`;
        let trainingFrequencyText = '';
        switch(formData.trainingFrequency) {
          case 'quarterly':
            trainingFrequencyText = 'quarterly';
            break;
          case 'bi-annually':
            trainingFrequencyText = 'every six months';
            break;
          case 'annually':
            trainingFrequencyText = 'annually';
            break;
          default:
            trainingFrequencyText = 'periodically';
        }
        policy += `Users must complete refresher training ${trainingFrequencyText} to stay updated on best practices and policy changes.\n\n`;
      }
      
      if (formData.acknowledgmentRequired) {
        policy += `9.3 Policy Acknowledgment\n`;
        policy += `All users must acknowledge that they have read and understand this Policy before being granted access to AI systems.\n\n`;
      }
      
      if (formData.complianceOfficer) {
        policy += `9.4 Compliance Officer\n`;
        policy += `${formData.complianceOfficer} is designated as the responsible party for ensuring compliance with this Policy.\n\n`;
      } else {
        policy += `9.4 Compliance Responsibility\n`;
        policy += `The [POSITION/DEPARTMENT] is responsible for ensuring compliance with this Policy.\n\n`;
      }
      
      // Custom training requirements
      if (formData.customTraining) {
        policy += `9.5 Additional Training Requirements\n`;
        policy += `${formData.customTraining}\n\n`;
      }
      
      // 10. Enforcement
      policy += `10. ENFORCEMENT\n\n`;
      
      // Violation consequences
      policy += `10.1 Consequences of Violations\n`;
      let consequencesText = '';
      switch(formData.violationConsequences) {
        case 'verbal-warning':
          consequencesText = 'Violations of this Policy may result in verbal warnings.';
          break;
        case 'written-warning':
          consequencesText = 'Violations of this Policy may result in written warnings placed in the user\'s personnel file.';
          break;
        case 'escalating':
          consequencesText = 'Violations of this Policy may result in escalating consequences, from verbal warnings for minor first offenses to termination for severe or repeated violations.';
          break;
        case 'immediate-termination':
          consequencesText = 'Violations of this Policy may result in immediate termination of employment or contract.';
          break;
        default:
          consequencesText = 'Violations of this Policy may result in disciplinary action, up to and including termination of employment or contract.';
      }
      policy += `${consequencesText}\n\n`;
      
      if (formData.reportingProcedure) {
        policy += `10.2 Reporting Violations\n`;
        policy += `Users who become aware of violations of this Policy should report them to their supervisor, the IT department, or the compliance officer.\n\n`;
      }
      
      if (formData.whistleblowerProtection) {
        policy += `10.3 Whistleblower Protection\n`;
        policy += `The Company prohibits retaliation against any user who reports, in good faith, actual or suspected violations of this Policy.\n\n`;
      }
      
      // Custom enforcement
      if (formData.customEnforcement) {
        policy += `10.4 Additional Enforcement Provisions\n`;
        policy += `${formData.customEnforcement}\n\n`;
      }
      
      // 11. Policy Updates & Review
      policy += `11. POLICY UPDATES & REVIEW\n\n`;
      
      // Review frequency
      policy += `11.1 Review Frequency\n`;
      let reviewFrequencyText = '';
      switch(formData.reviewFrequency) {
        case 'monthly':
          reviewFrequencyText = 'monthly';
          break;
        case 'quarterly':
          reviewFrequencyText = 'quarterly';
          break;
        case 'bi-annually':
          reviewFrequencyText = 'every six months';
          break;
        case 'annually':
          reviewFrequencyText = 'annually';
          break;
        default:
          reviewFrequencyText = 'periodically';
      }
      policy += `This Policy will be reviewed ${reviewFrequencyText} and updated as necessary to reflect changes in technology, business needs, and regulatory requirements.\n\n`;
      
      // Update notification
      policy += `11.2 Notification of Updates\n`;
      let notificationText = '';
      switch(formData.updateNotification) {
        case 'email':
          notificationText = 'via email';
          break;
        case 'intranet':
          notificationText = 'through the company intranet';
          break;
        case 'both':
          notificationText = 'via email and through the company intranet';
          break;
        default:
          notificationText = 'through appropriate communication channels';
      }
      policy += `Users will be notified of Policy updates ${notificationText}.\n\n`;
      
      if (formData.versionControl) {
        policy += `11.3 Version Control\n`;
        policy += `The current version of this Policy is available [LOCATION]. All previous versions are archived and available upon request.\n\n`;
      }
      
      // Custom review process
      if (formData.customReviewProcess) {
        policy += `11.4 Additional Review Procedures\n`;
        policy += `${formData.customReviewProcess}\n\n`;
      }
      
      // 12. Contact Information
      policy += `12. CONTACT INFORMATION\n\n`;
      policy += `For questions about this Policy, please contact:\n\n`;
      policy += `${formData.companyName || '[COMPANY NAME]'}\n`;
      policy += `${formData.businessAddress || '[BUSINESS ADDRESS]'}\n`;
      policy += `${formData.contactEmail || '[CONTACT EMAIL]'}\n\n`;
      
      // Acknowledgment
      policy += `13. ACKNOWLEDGMENT\n\n`;
      policy += `I acknowledge that I have read and understand the AI Usage Policy. I agree to comply with all the terms and conditions outlined in this Policy.\n\n`;
      policy += `Name: _______________________________\n\n`;
      policy += `Signature: _______________________________\n\n`;
      policy += `Date: _______________________________\n\n`;
      
      return policy;
    };
    
    // Update the document text
    const newDocumentText = generatePolicyText();
    setDocumentText(newDocumentText);
    
    // Update policy analysis
    setPolicyAnalysis(analyzePolicyDocument());
  }, [formData]);
  
  // Function to find text affected by the last change
  const getAffectedText = () => {
    // If no field was changed or we're on the final preview tab, return null
    if (!lastChanged || currentTab === tabs.length - 1) return null;
    
    // Map fields to relevant sections in the document text
    const fieldToSectionMap = {
      // Company Information tab
      companyName: /(?<=# ).*(?= AI USAGE POLICY)|(?<=This Artificial Intelligence \(AI\) Usage Policy \("Policy"\) governs the use of AI systems and tools within ).*(?=\.)/,
      effectiveDate: /(?<=Effective Date: ).*(?=\n)/,
      businessAddress: /(?<=\n)[^\n]*\n[^\n]*\n[^\n]*(?=\n\n## 13)/,
      contactEmail: /(?<=\n)[^\n]*\n[^\n]*\n[^\n]*(?=\n\n## 13)/,
      
      // Policy Scope tab
      policyScope: /(?<=This Policy applies to ).*?(?=\.)/,
      specificDepartments: /(?<=the following departments: ).*?(?=\.)/,
      customScope: /(?<=\. ).*?(?=\.)/,
      
      // AI Systems & Tools tab
      'aiTypes.chatbots': /- AI chatbots and conversational agents\n/,
      'aiTypes.documentAnalysis': /- Document analysis and processing tools\n/,
      'aiTypes.imageGeneration': /- Image generation and editing tools\n/,
      'aiTypes.voiceAssistants': /- Voice assistants and speech recognition systems\n/,
      'aiTypes.dataAnalytics': /- Data analytics and prediction tools\n/,
      'aiTypes.codingAssistants': /- Code generation and programming assistance tools\n/,
      'aiTypes.customerService': /- Customer service automation tools\n/,
      'aiTypes.other': /- .*?\n/,
      otherAiTypes: /- .*?\n/,
      specificAiTools: /(?<=The following specific AI tools are currently approved for use: ).*(?=\n)/,
      
      // Acceptable Use tab
      businessPurposesOnly: /5\.1 Business Purposes\nAI systems should be used primarily for legitimate business purposes that benefit the Company\.\n\n/,
      clientCommunicationAllowed: /5\.2 Client Communication\nAI systems may be used to draft, edit, or enhance client communications, provided that all output is reviewed for accuracy before being sent externally\.\n\n/,
      internalCommunicationAllowed: /5\.3 Internal Communication\nAI systems may be used to draft, edit, or enhance internal communications and documentation\.\n\n/,
      contentCreationAllowed: /5\.4 Content Creation\nAI systems may be used to assist in creating content such as articles, reports, presentations, and marketing materials, provided that all output is reviewed for accuracy and appropriateness\.\n\n/,
      dataAnalysisAllowed: /5\.5 Data Analysis\nAI systems may be used to analyze data and generate insights, provided that all applicable data protection and privacy policies are followed\.\n\n/,
      codeGenerationAllowed: /5\.6 Code Generation\nAI systems may be used to assist with software development, including code generation and debugging, provided that all output is reviewed and tested before implementation\.\n\n/,
      customAcceptableUse: /(?<=5\.7 Additional Acceptable Uses\n).*(?=\n\n)/,
      
      // Prohibited Use tab
      prohibitPersonalData: /6\.1 Processing Personal Data\nUsers must not input personal data into AI systems without proper authorization and compliance with data protection laws\. This includes but is not limited to names, contact information, financial data, and health information of customers, employees, or any individuals\.\n\n/,
      prohibitConfidentialInfo: /6\.2 Processing Confidential Information\nUsers must not input confidential business information, trade secrets, or other proprietary information into AI systems without proper authorization and security measures\.\n\n/,
      prohibitIntellectualProperty: /6\.3 Intellectual Property Violations\nUsers must not use AI systems in ways that may infringe on intellectual property rights, including copyright, trademark, and patent rights\.\n\n/,
      prohibitOffensiveContent: /6\.4 Creating Offensive Content\nUsers must not use AI systems to create, generate, or distribute content that is offensive, discriminatory, harassing, or otherwise inappropriate in a professional environment\.\n\n/,
      prohibitIllegalActivity: /6\.5 Illegal Activities\nUsers must not use AI systems to facilitate any illegal activity or to circumvent any company policies or security measures\.\n\n/,
      customProhibitedUse: /(?<=6\.6 Additional Prohibited Uses\n).*(?=\n\n)/,
      
      // Data Handling tab
      dataRetentionPeriod: /7\.1 Data Retention\n.*?(?=\n\n)/s,
      dataMinimization: /7\.2 Data Minimization\nUsers should only input the minimum amount of data necessary for the specific task being performed with an AI system\.\n\n/,
      dataAccuracy: /7\.3 Data Accuracy\nUsers must verify the accuracy of any output generated by AI systems, particularly when such output will be used for decision-making or external communications\.\n\n/,
      sensitiveDataRestrictions: /7\.4 Sensitive Data Restrictions\nAdditional restrictions and safeguards apply to the processing of sensitive data categories, including health information, biometric data, financial records, and information about minors\. Users must consult with the legal or compliance department before processing such data with AI systems\.\n\n/,
      customDataHandling: /(?<=7\.5 Additional Data Handling Requirements\n).*(?=\n\n)/,
      
      // Security Measures tab
      requireAuthentication: /8\.1 Authentication\nUsers must authenticate with secure credentials when accessing AI systems\. Sharing of credentials is strictly prohibited\.\n\n/,
      accessControl: /8\.2 Access Control\nAccess to AI systems will be granted on a need-to-use basis, with appropriate levels of access determined by job responsibilities\.\n\n/,
      regularUpdates: /8\.3 Regular Updates\nAI systems must be kept up-to-date with the latest security patches and updates\.\n\n/,
      encryptionRequired: /8\.4 Encryption\nData transmitted to and from AI systems must be encrypted using industry-standard encryption protocols\.\n\n/,
      loggingMonitoring: /8\.5 Logging and Monitoring\nThe Company reserves the right to log and monitor all AI system usage for security, compliance, and performance optimization purposes\.\n\n/,
      customSecurityMeasures: /(?<=8\.6 Additional Security Measures\n).*(?=\n\n)/,
      
      // Training & Compliance tab
      initialTrainingRequired: /9\.1 Initial Training\nAll users covered by this Policy must complete initial training on the responsible use of AI systems before being granted access\.\n\n/,
      ongoingTraining: /9\.2 Ongoing Training\nUsers must complete refresher training .*? to stay updated on best practices and policy changes\.\n\n/,
      trainingFrequency: /(?<=Users must complete refresher training ).*?(?= to stay)/,
      acknowledgmentRequired: /9\.3 Policy Acknowledgment\nAll users must acknowledge that they have read and understand this Policy before being granted access to AI systems\.\n\n/,
      complianceOfficer: /(?<=9\.4 Compliance Officer\n).*(?= is designated)/,
      customTraining: /(?<=9\.5 Additional Training Requirements\n).*(?=\n\n)/,
      
      // Enforcement tab
      violationConsequences: /10\.1 Consequences of Violations\n.*?(?=\n\n)/s,
      reportingProcedure: /10\.2 Reporting Violations\nUsers who become aware of violations of this Policy should report them to their supervisor, the IT department, or the compliance officer\.\n\n/,
      whistleblowerProtection: /10\.3 Whistleblower Protection\nThe Company prohibits retaliation against any user who reports, in good faith, actual or suspected violations of this Policy\.\n\n/,
      customEnforcement: /(?<=10\.4 Additional Enforcement Provisions\n).*(?=\n\n)/,
      
      // Updates & Review tab
      reviewFrequency: /(?<=This Policy will be reviewed ).*?(?= and updated)/,
      updateNotification: /(?<=Users will be notified of Policy updates ).*?(?=\.)/,
      versionControl: /11\.3 Version Control\nThe current version of this Policy is available \[LOCATION\]\. All previous versions are archived and available upon request\.\n\n/,
      customReviewProcess: /(?<=11\.4 Additional Review Procedures\n).*(?=\n\n)/
    };
    
    // Find the relevant regex pattern for the last changed field
    const pattern = fieldToSectionMap[lastChanged];
    
    if (!pattern) return null;
    
    // Find the text that matches the pattern
    const match = documentText.match(pattern);
    
    return match ? match[0] : null;
  };
  
  // Create highlighted document text
  const createHighlightedText = () => {
    const affectedText = getAffectedText();
    
    if (!affectedText || !documentText) return documentText;
    
    // Escape special regex characters in the affected text
    const escapedText = affectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Replace the affected text with highlighted version
    return documentText.replace(new RegExp(escapedText, 'g'), match => 
      `<span class="highlighted-text">${match}</span>`
    );
  };
  
  // Get highlighted document text
  const highlightedText = createHighlightedText();
  
  // Scroll to highlighted text when it changes
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [highlightedText]);
  
  // Copy document to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert('Document copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        companyName: formData.companyName || 'AI-Usage-Policy',
        fileName: `${formData.companyName || 'AI-Usage-Policy'}-${new Date().toISOString().split('T')[0]}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Render different form sections based on current tab
  const renderForm = () => {
    switch(currentTab) {
      case 0: // Company Information
        return (
          <div className="form-panel">
            <h2>Company Information</h2>
            <p>Enter basic information about your company to personalize the AI usage policy.</p>
            
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="businessAddress">Business Address</label>
              <textarea
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Full business address"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="e.g., compliance@company.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="effectiveDate">Effective Date</label>
              <input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
              />
            </div>
          </div>
        );
        
      case 1: // Scope & Definitions
        return (
          <div className="form-panel">
            <h2>Scope & Definitions</h2>
            <p>Define who is covered by this policy and establish key definitions.</p>
            
            <div className="form-group">
              <label>Policy Scope</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="policyScope"
                    value="all-users"
                    checked={formData.policyScope === 'all-users'}
                    onChange={handleChange}
                  />
                  All users (employees, contractors, third parties)
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="policyScope"
                    value="employees-only"
                    checked={formData.policyScope === 'employees-only'}
                    onChange={handleChange}
                  />
                  Employees only
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="policyScope"
                    value="contractors"
                    checked={formData.policyScope === 'contractors'}
                    onChange={handleChange}
                  />
                  Contractors only
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="policyScope"
                    value="specific-departments"
                    checked={formData.policyScope === 'specific-departments'}
                    onChange={handleChange}
                  />
                  Specific departments
                </label>
              </div>
            </div>
            
            {formData.policyScope === 'specific-departments' && (
              <div className="form-group">
                <label htmlFor="specificDepartments">Specify Departments</label>
                <input
                  type="text"
                  id="specificDepartments"
                  name="specificDepartments"
                  value={formData.specificDepartments}
                  onChange={handleChange}
                  placeholder="e.g., IT, Marketing, Customer Service"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="customScope">Additional Scope Details (Optional)</label>
              <textarea
                id="customScope"
                name="customScope"
                value={formData.customScope}
                onChange={handleChange}
                placeholder="Any additional details about who is covered by this policy"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 2: // AI Systems & Tools
        return (
          <div className="form-panel">
            <h2>AI Systems & Tools</h2>
            <p>Specify which AI systems and tools are authorized for use within your organization.</p>
            
            <div className="form-group">
              <label>Types of AI Systems Authorized</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.chatbots"
                    checked={formData.aiTypes.chatbots}
                    onChange={handleChange}
                  />
                  AI chatbots and conversational agents
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.documentAnalysis"
                    checked={formData.aiTypes.documentAnalysis}
                    onChange={handleChange}
                  />
                  Document analysis and processing tools
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.imageGeneration"
                    checked={formData.aiTypes.imageGeneration}
                    onChange={handleChange}
                  />
                  Image generation and editing tools
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.voiceAssistants"
                    checked={formData.aiTypes.voiceAssistants}
                    onChange={handleChange}
                  />
                  Voice assistants and speech recognition systems
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.dataAnalytics"
                    checked={formData.aiTypes.dataAnalytics}
                    onChange={handleChange}
                  />
                  Data analytics and prediction tools
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.codingAssistants"
                    checked={formData.aiTypes.codingAssistants}
                    onChange={handleChange}
                  />
                  Code generation and programming assistance tools
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.customerService"
                    checked={formData.aiTypes.customerService}
                    onChange={handleChange}
                  />
                  Customer service automation tools
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aiTypes.other"
                    checked={formData.aiTypes.other}
                    onChange={handleChange}
                  />
                  Other AI systems (specify below)
                </label>
              </div>
            </div>
            
            {formData.aiTypes.other && (
              <div className="form-group">
                <label htmlFor="otherAiTypes">Specify Other AI Systems</label>
                <input
                  type="text"
                  id="otherAiTypes"
                  name="otherAiTypes"
                  value={formData.otherAiTypes}
                  onChange={handleChange}
                  placeholder="e.g., Automated decision systems, Recommendation engines"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="specificAiTools">Specific Approved AI Tools (Optional)</label>
              <textarea
                id="specificAiTools"
                name="specificAiTools"
                value={formData.specificAiTools}
                onChange={handleChange}
                placeholder="e.g., ChatGPT, DALL-E, GitHub Copilot, Jasper AI"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 3: // Acceptable Use
        return (
          <div className="form-panel">
            <h2>Acceptable Use</h2>
            <p>Define how AI systems may be used within your organization.</p>
            
            <div className="form-group">
              <label>Permitted Uses</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="businessPurposesOnly"
                    checked={formData.businessPurposesOnly}
                    onChange={handleChange}
                  />
                  Business purposes only
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="clientCommunicationAllowed"
                    checked={formData.clientCommunicationAllowed}
                    onChange={handleChange}
                  />
                  Client communication (with review)
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="internalCommunicationAllowed"
                    checked={formData.internalCommunicationAllowed}
                    onChange={handleChange}
                  />
                  Internal communication
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="contentCreationAllowed"
                    checked={formData.contentCreationAllowed}
                    onChange={handleChange}
                  />
                  Content creation (with review)
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="dataAnalysisAllowed"
                    checked={formData.dataAnalysisAllowed}
                    onChange={handleChange}
                  />
                  Data analysis (following privacy policies)
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="codeGenerationAllowed"
                    checked={formData.codeGenerationAllowed}
                    onChange={handleChange}
                  />
                  Code generation (with review and testing)
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="customAcceptableUse">Additional Acceptable Uses (Optional)</label>
              <textarea
                id="customAcceptableUse"
                name="customAcceptableUse"
                value={formData.customAcceptableUse}
                onChange={handleChange}
                placeholder="Specify any additional acceptable uses of AI systems"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 4: // Prohibited Use
        return (
          <div className="form-panel">
            <h2>Prohibited Use</h2>
            <p>Define how AI systems may NOT be used within your organization.</p>
            
            <div className="form-group">
              <label>Prohibited Uses</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="prohibitPersonalData"
                    checked={formData.prohibitPersonalData}
                    onChange={handleChange}
                  />
                  Processing personal data without authorization
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="prohibitConfidentialInfo"
                    checked={formData.prohibitConfidentialInfo}
                    onChange={handleChange}
                  />
                  Processing confidential business information without authorization
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="prohibitIntellectualProperty"
                    checked={formData.prohibitIntellectualProperty}
                    onChange={handleChange}
                  />
                  Intellectual property violations
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="prohibitOffensiveContent"
                    checked={formData.prohibitOffensiveContent}
                    onChange={handleChange}
                  />
                  Creating offensive, discriminatory, or inappropriate content
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="prohibitIllegalActivity"
                    checked={formData.prohibitIllegalActivity}
                    onChange={handleChange}
                  />
                  Illegal activities or circumventing company policies
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="customProhibitedUse">Additional Prohibited Uses (Optional)</label>
              <textarea
                id="customProhibitedUse"
                name="customProhibitedUse"
                value={formData.customProhibitedUse}
                onChange={handleChange}
                placeholder="Specify any additional prohibited uses of AI systems"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 5: // Data Handling & Privacy
        return (
          <div className="form-panel">
            <h2>Data Handling & Privacy</h2>
            <p>Establish guidelines for handling data when using AI systems.</p>
            
            <div className="form-group">
              <label>Data Retention Period</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="dataRetentionPeriod"
                    value="no-retention"
                    checked={formData.dataRetentionPeriod === 'no-retention'}
                    onChange={handleChange}
                  />
                  No retention (avoid storing)
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="dataRetentionPeriod"
                    value="30-days"
                    checked={formData.dataRetentionPeriod === '30-days'}
                    onChange={handleChange}
                  />
                  30 days
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="dataRetentionPeriod"
                    value="60-days"
                    checked={formData.dataRetentionPeriod === '60-days'}
                    onChange={handleChange}
                  />
                  60 days
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="dataRetentionPeriod"
                    value="90-days"
                    checked={formData.dataRetentionPeriod === '90-days'}
                    onChange={handleChange}
                  />
                  90 days
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="dataRetentionPeriod"
                    value="custom"
                    checked={formData.dataRetentionPeriod === 'custom'}
                    onChange={handleChange}
                  />
                  Custom (specify below)
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Data Handling Practices</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="dataMinimization"
                    checked={formData.dataMinimization}
                    onChange={handleChange}
                  />
                  Data minimization (input only what's necessary)
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="dataAccuracy"
                    checked={formData.dataAccuracy}
                    onChange={handleChange}
                  />
                  Verify accuracy of AI-generated output
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="sensitiveDataRestrictions"
                    checked={formData.sensitiveDataRestrictions}
                    onChange={handleChange}
                  />
                  Additional restrictions for sensitive data
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="customDataHandling">Additional Data Handling Requirements (Optional)</label>
              <textarea
                id="customDataHandling"
                name="customDataHandling"
                value={formData.customDataHandling}
                onChange={handleChange}
                placeholder="Specify any additional data handling requirements"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 6: // Security Measures
        return (
          <div className="form-panel">
            <h2>Security Measures</h2>
            <p>Define security measures for AI system usage.</p>
            
            <div className="form-group">
              <label>Security Requirements</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="requireAuthentication"
                    checked={formData.requireAuthentication}
                    onChange={handleChange}
                  />
                  Secure authentication required
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="accessControl"
                    checked={formData.accessControl}
                    onChange={handleChange}
                  />
                  Role-based access control
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="regularUpdates"
                    checked={formData.regularUpdates}
                    onChange={handleChange}
                  />
                  Regular security updates
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="encryptionRequired"
                    checked={formData.encryptionRequired}
                    onChange={handleChange}
                  />
                  Encryption of data transmission
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="loggingMonitoring"
                    checked={formData.loggingMonitoring}
                    onChange={handleChange}
                  />
                  Logging and monitoring of AI system usage
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="customSecurityMeasures">Additional Security Measures (Optional)</label>
              <textarea
                id="customSecurityMeasures"
                name="customSecurityMeasures"
                value={formData.customSecurityMeasures}
                onChange={handleChange}
                placeholder="Specify any additional security measures"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 7: // Training & Compliance
        return (
          <div className="form-panel">
            <h2>Training & Compliance</h2>
            <p>Establish training requirements and compliance procedures.</p>
            
            <div className="form-group">
              <label>Training Requirements</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="initialTrainingRequired"
                    checked={formData.initialTrainingRequired}
                    onChange={handleChange}
                  />
                  Initial training required
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="ongoingTraining"
                    checked={formData.ongoingTraining}
                    onChange={handleChange}
                  />
                  Ongoing training required
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acknowledgmentRequired"
                    checked={formData.acknowledgmentRequired}
                    onChange={handleChange}
                  />
                  Policy acknowledgment required
                </label>
              </div>
            </div>
            
            {formData.ongoingTraining && (
              <div className="form-group">
                <label>Training Frequency</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="trainingFrequency"
                      value="quarterly"
                      checked={formData.trainingFrequency === 'quarterly'}
                      onChange={handleChange}
                    />
                    Quarterly
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="trainingFrequency"
                      value="bi-annually"
                      checked={formData.trainingFrequency === 'bi-annually'}
                      onChange={handleChange}
                    />
                    Every 6 months
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="trainingFrequency"
                      value="annually"
                      checked={formData.trainingFrequency === 'annually'}
                      onChange={handleChange}
                    />
                    Annually
                  </label>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="complianceOfficer">Compliance Officer (Optional)</label>
              <input
                type="text"
                id="complianceOfficer"
                name="complianceOfficer"
                value={formData.complianceOfficer}
                onChange={handleChange}
                placeholder="e.g., The Director of IT, The Chief Security Officer"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customTraining">Additional Training Requirements (Optional)</label>
              <textarea
                id="customTraining"
                name="customTraining"
                value={formData.customTraining}
                onChange={handleChange}
                placeholder="Specify any additional training requirements"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 8: // Enforcement
        return (
          <div className="form-panel">
            <h2>Enforcement</h2>
            <p>Define how the policy will be enforced and consequences for violations.</p>
            
            <div className="form-group">
              <label>Consequences for Violations</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="violationConsequences"
                    value="verbal-warning"
                    checked={formData.violationConsequences === 'verbal-warning'}
                    onChange={handleChange}
                  />
                  Verbal warning
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="violationConsequences"
                    value="written-warning"
                    checked={formData.violationConsequences === 'written-warning'}
                    onChange={handleChange}
                  />
                  Written warning
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="violationConsequences"
                    value="escalating"
                    checked={formData.violationConsequences === 'escalating'}
                    onChange={handleChange}
                  />
                  Escalating consequences (verbal → written → termination)
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="violationConsequences"
                    value="immediate-termination"
                    checked={formData.violationConsequences === 'immediate-termination'}
                    onChange={handleChange}
                  />
                  Immediate termination
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Reporting and Protection</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="reportingProcedure"
                    checked={formData.reportingProcedure}
                    onChange={handleChange}
                  />
                  Include reporting procedure for violations
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="whistleblowerProtection"
                    checked={formData.whistleblowerProtection}
                    onChange={handleChange}
                  />
                  Include whistleblower protection
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="customEnforcement">Additional Enforcement Provisions (Optional)</label>
              <textarea
                id="customEnforcement"
                name="customEnforcement"
                value={formData.customEnforcement}
                onChange={handleChange}
                placeholder="Specify any additional enforcement provisions"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 9: // Updates & Review
        return (
          <div className="form-panel">
            <h2>Updates & Review</h2>
            <p>Define how and when the policy will be reviewed and updated.</p>
            
            <div className="form-group">
              <label>Review Frequency</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reviewFrequency"
                    value="monthly"
                    checked={formData.reviewFrequency === 'monthly'}
                    onChange={handleChange}
                  />
                  Monthly
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reviewFrequency"
                    value="quarterly"
                    checked={formData.reviewFrequency === 'quarterly'}
                    onChange={handleChange}
                  />
                  Quarterly
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reviewFrequency"
                    value="bi-annually"
                    checked={formData.reviewFrequency === 'bi-annually'}
                    onChange={handleChange}
                  />
                  Every 6 months
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reviewFrequency"
                    value="annually"
                    checked={formData.reviewFrequency === 'annually'}
                    onChange={handleChange}
                  />
                  Annually
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Update Notification Method</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="updateNotification"
                    value="email"
                    checked={formData.updateNotification === 'email'}
                    onChange={handleChange}
                  />
                  Email notification
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="updateNotification"
                    value="intranet"
                    checked={formData.updateNotification === 'intranet'}
                    onChange={handleChange}
                  />
                  Company intranet posting
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="updateNotification"
                    value="both"
                    checked={formData.updateNotification === 'both'}
                    onChange={handleChange}
                  />
                  Both email and intranet
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Version Control</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="versionControl"
                    checked={formData.versionControl}
                    onChange={handleChange}
                  />
                  Maintain version control of policy
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="customReviewProcess">Additional Review Procedures (Optional)</label>
              <textarea
                id="customReviewProcess"
                name="customReviewProcess"
                value={formData.customReviewProcess}
                onChange={handleChange}
                placeholder="Specify any additional review procedures"
                rows="3"
              />
            </div>
          </div>
        );
        
      case 10: // Final Document
        return (
          <div className="form-panel">
            <h2>Policy Analysis & Final Document</h2>
            <p>Your AI Usage Policy has been analyzed for completeness, risks, and strengths:</p>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: policyAnalysis.score >= 90 ? '#d1fae5' : policyAnalysis.score >= 75 ? '#fef3c7' : '#fee2e2', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '10px', color: policyAnalysis.score >= 90 ? '#065f46' : policyAnalysis.score >= 75 ? '#92400e' : '#991b1b' }}>
                Policy Score: {policyAnalysis.score}/100
              </h3>
              <p style={{ margin: 0, color: policyAnalysis.score >= 90 ? '#065f46' : policyAnalysis.score >= 75 ? '#92400e' : '#991b1b' }}>
                {policyAnalysis.score >= 90 
                  ? 'Excellent! Your policy is comprehensive and well-structured.' 
                  : policyAnalysis.score >= 75 
                    ? 'Good policy with some areas for improvement.' 
                    : 'Your policy needs significant improvement in key areas.'}
              </p>
            </div>
            
            {policyAnalysis.issues.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#991b1b' }}>Critical Issues</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {policyAnalysis.issues.map((issue, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#991b1b' }}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {policyAnalysis.warnings.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#92400e' }}>Recommendations</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {policyAnalysis.warnings.map((warning, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#92400e' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {policyAnalysis.strengths.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#065f46' }}>Strengths</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {policyAnalysis.strengths.map((strength, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#065f46' }}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="form-group mt-2">
              <div className="navigation-buttons">
                <button
                  onClick={copyToClipboard}
                  className="nav-button"
                  style={{
                    backgroundColor: "#4f46e5", 
                    color: "white",
                    border: "none",
                    flex: 1
                  }}
                >
                  <i data-feather="copy" style={{marginRight: "0.5rem"}}></i>
                  Copy to Clipboard
                </button>
                
                <button
                  onClick={downloadAsWord}
                  className="nav-button"
                  style={{
                    backgroundColor: "#2563eb", 
                    color: "white",
                    border: "none",
                    flex: 1
                  }}
                >
                  <i data-feather="file-text" style={{marginRight: "0.5rem"}}></i>
                  Download MS Word
                </button>
              </div>
            </div>
            
            <div className="form-group mt-2">
              <p className="text-center">
                Need professional legal guidance on your AI policies?
              </p>
              <p className="text-center">
                <a href="" onClick={() => {
                  Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'});
                  return false;
                }}>
                  Schedule a consultation
                </a>
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container">
      <h1>AI Usage Policy Generator</h1>
      
      {/* Tab navigation */}
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
      
      {/* Preview container */}
      <div className="preview-container">
        {/* Form panel */}
        {renderForm()}
        
        {/* Preview panel */}
        <div className="preview-panel" ref={previewRef}>
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
          disabled={currentTab === 0}
        >
          <i data-feather="chevron-left" style={{marginRight: "0.5rem"}}></i>
          Previous
        </button>
        
        {currentTab < tabs.length - 1 && (
          <>
            <button
              onClick={copyToClipboard}
              className="nav-button"
              style={{
                backgroundColor: "#4f46e5", 
                color: "white",
                border: "none"
              }}
            >
              <i data-feather="copy" style={{marginRight: "0.5rem"}}></i>
              Copy to Clipboard
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
              <i data-feather="file-text" style={{marginRight: "0.5rem"}}></i>
              Download MS Word
            </button>
          </>
        )}
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <i data-feather="chevron-right" style={{marginLeft: "0.5rem"}}></i>
        </button>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(
  <AIUsagePolicyGenerator />,
  document.getElementById('root')
);
