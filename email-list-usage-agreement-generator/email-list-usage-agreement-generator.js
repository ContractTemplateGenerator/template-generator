// Email List Usage Agreement Generator
const { useState, useEffect, useRef } = React;

// Icon component for feather icons
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

// Main App component
const App = () => {
  // Tab configuration
  const tabs = [
    { id: 'parties', label: 'Parties' },
    { id: 'terms', label: 'Agreement Terms' },
    { id: 'usage', label: 'Usage Rights' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'compensation', label: 'Compensation & Term' },
    { id: 'review', label: 'Review & Risks' }
  ];

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    // Parties
    ownerCompanyName: '',
    ownerAddress: '',
    ownerEmail: '',
    ownerContactPerson: '',
    recipientCompanyName: '',
    recipientAddress: '',
    recipientEmail: '',
    recipientContactPerson: '',
    
    // Agreement Terms
    effectiveDate: '',
    agreementPurpose: 'marketing',
    customPurpose: '',
    listDescription: '',
    listSize: '',
    listOrigin: 'opt-in',
    customListOrigin: '',
    
    // Usage Rights
    usageType: 'oneTime',
    usageFrequency: '1',
    usageCustomFrequency: '',
    allowResale: false,
    allowThirdParty: false,
    customThirdPartyRestrictions: '',
    testEmailRequired: true,
    approvalRequired: true,
    revisionRounds: '1',
    
    // Compliance
    unsubscribeMethod: 'link',
    customUnsubscribeMethod: '',
    unsubscribeProcessing: 'immediate',
    dataProtectionLaws: ['canSpam'],
    privacyPolicyLink: true,
    dataSecurity: 'encryption',
    customDataSecurity: '',
    dataBreach: true,
    breachNotificationPeriod: '48',
    
    // Compensation & Term
    compensationType: 'flat',
    compensationAmount: '',
    compensationSchedule: 'upfront',
    compensationMetrics: false,
    agreementTerm: 'fixed',
    agreementDuration: '6',
    terminationOption: 'notice',
    terminationNoticePeriod: '30',
    autoRenewal: false,
    renewalNoticePeriod: '30',
    
    // Document settings
    fileName: 'Email-List-Usage-Agreement'
  });
  
  // State to track what field was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // Reference for the preview panel
  const previewRef = useRef(null);
  
  // Generate document text based on form data
  const generateDocument = () => {
    const {
      ownerCompanyName,
      ownerAddress,
      ownerEmail,
      ownerContactPerson,
      recipientCompanyName,
      recipientAddress,
      recipientEmail,
      recipientContactPerson,
      effectiveDate,
      agreementPurpose,
      customPurpose,
      listDescription,
      listSize,
      listOrigin,
      customListOrigin,
      usageType,
      usageFrequency,
      usageCustomFrequency,
      allowResale,
      allowThirdParty,
      customThirdPartyRestrictions,
      testEmailRequired,
      approvalRequired,
      revisionRounds,
      unsubscribeMethod,
      customUnsubscribeMethod,
      unsubscribeProcessing,
      dataProtectionLaws,
      privacyPolicyLink,
      dataSecurity,
      customDataSecurity,
      dataBreach,
      breachNotificationPeriod,
      compensationType,
      compensationAmount,
      compensationSchedule,
      compensationMetrics,
      agreementTerm,
      agreementDuration,
      terminationOption,
      terminationNoticePeriod,
      autoRenewal,
      renewalNoticePeriod
    } = formData;
    
    // Format the effective date
    const formattedDate = effectiveDate ? new Date(effectiveDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '[Effective Date]';
    
    // Determine purpose text
    let purposeText = '';
    switch (agreementPurpose) {
      case 'marketing':
        purposeText = 'marketing and promotional emails';
        break;
      case 'newsletter':
        purposeText = 'newsletter distribution';
        break;
      case 'sales':
        purposeText = 'sales and promotional offers';
        break;
      case 'custom':
        purposeText = customPurpose || '[Purpose Description]';
        break;
      default:
        purposeText = '[Purpose Description]';
    }
    
    // Determine list origin text
    let originText = '';
    switch (listOrigin) {
      case 'opt-in':
        originText = 'subscribers who have explicitly opted in to receive emails';
        break;
      case 'double-opt-in':
        originText = 'subscribers who have completed a double opt-in verification process';
        break;
      case 'purchase':
        originText = 'customers who have made purchases and provided email consent';
        break;
      case 'custom':
        originText = customListOrigin || '[List Origin Description]';
        break;
      default:
        originText = '[List Origin Description]';
    }
    
    // Determine usage type text
    let usageTypeText = '';
    switch (usageType) {
      case 'oneTime':
        usageTypeText = 'a one-time usage';
        break;
      case 'limited':
        usageTypeText = `up to ${usageFrequency || '[Number]'} times`;
        break;
      case 'recurring':
        usageTypeText = `on a recurring basis not exceeding ${usageFrequency || '[Number]'} times per month`;
        break;
      case 'custom':
        usageTypeText = usageCustomFrequency || '[Usage Frequency Description]';
        break;
      default:
        usageTypeText = '[Usage Frequency Description]';
    }
    
    // Determine unsubscribe method text
    let unsubscribeText = '';
    switch (unsubscribeMethod) {
      case 'link':
        unsubscribeText = 'a clearly visible unsubscribe link';
        break;
      case 'reply':
        unsubscribeText = 'a reply-to email option for unsubscribing';
        break;
      case 'both':
        unsubscribeText = 'both a clearly visible unsubscribe link and a reply-to email option';
        break;
      case 'custom':
        unsubscribeText = customUnsubscribeMethod || '[Unsubscribe Method]';
        break;
      default:
        unsubscribeText = '[Unsubscribe Method]';
    }
    
    // Determine data security text
    let dataSecurityText = '';
    switch (dataSecurity) {
      case 'encryption':
        dataSecurityText = 'industry-standard encryption';
        break;
      case 'passwordProtection':
        dataSecurityText = 'password protection and secure access controls';
        break;
      case 'secureServer':
        dataSecurityText = 'secure servers with appropriate access controls';
        break;
      case 'custom':
        dataSecurityText = customDataSecurity || '[Data Security Measures]';
        break;
      default:
        dataSecurityText = '[Data Security Measures]';
    }
    
    // Determine compliance laws text
    const complianceLaws = [];
    if (dataProtectionLaws.includes('canSpam')) {
      complianceLaws.push('CAN-SPAM Act');
    }
    if (dataProtectionLaws.includes('gdpr')) {
      complianceLaws.push('GDPR');
    }
    if (dataProtectionLaws.includes('ccpa')) {
      complianceLaws.push('CCPA');
    }
    if (dataProtectionLaws.includes('casl')) {
      complianceLaws.push('CASL');
    }
    
    const complianceText = complianceLaws.length > 0 
      ? complianceLaws.join(', ') 
      : '[Applicable Laws]';
    
    // Determine compensation text
    let compensationText = '';
    switch (compensationType) {
      case 'flat':
        compensationText = `a flat fee of $${compensationAmount || '[Amount]'}`;
        break;
      case 'perEmail':
        compensationText = `$${compensationAmount || '[Amount]'} per email sent`;
        break;
      case 'perOpen':
        compensationText = `$${compensationAmount || '[Amount]'} per email opened`;
        break;
      case 'perClick':
        compensationText = `$${compensationAmount || '[Amount]'} per click`;
        break;
      case 'perConversion':
        compensationText = `$${compensationAmount || '[Amount]'} per conversion`;
        break;
      case 'revShare':
        compensationText = `${compensationAmount || '[Percentage]'}% of revenue generated`;
        break;
      default:
        compensationText = '[Compensation Amount and Structure]';
    }
    
    // Determine compensation schedule text
    let scheduleText = '';
    switch (compensationSchedule) {
      case 'upfront':
        scheduleText = 'paid upfront before list usage';
        break;
      case 'afterDelivery':
        scheduleText = 'paid after email delivery';
        break;
      case 'monthly':
        scheduleText = 'paid monthly';
        break;
      case 'quarterly':
        scheduleText = 'paid quarterly';
        break;
      default:
        scheduleText = '[Payment Schedule]';
    }
    
    // Determine term text
    let termText = '';
    switch (agreementTerm) {
      case 'fixed':
        termText = `${agreementDuration || '[Duration]'} months`;
        break;
      case 'indefinite':
        termText = 'an indefinite period';
        break;
      case 'singleUse':
        termText = 'a single use only';
        break;
      default:
        termText = '[Term Duration]';
    }
    
    // Determine termination text
    let terminationText = '';
    switch (terminationOption) {
      case 'notice':
        terminationText = `${terminationNoticePeriod || '[Period]'} days' written notice`;
        break;
      case 'immediate':
        terminationText = 'immediate termination in case of material breach';
        break;
      case 'both':
        terminationText = `${terminationNoticePeriod || '[Period]'} days' written notice or immediate termination in case of material breach`;
        break;
      default:
        terminationText = '[Termination Terms]';
    }
    
    // Build the document text
    return `EMAIL LIST USAGE AGREEMENT

This Email List Usage Agreement (the "Agreement") is made effective as of ${formattedDate}

BETWEEN:

${ownerCompanyName || '[List Owner Company Name]'} with its principal place of business at ${ownerAddress || '[Address]'}, email: ${ownerEmail || '[Email]'}, represented by ${ownerContactPerson || '[Contact Person]'} ("List Owner")

AND:

${recipientCompanyName || '[List Recipient Company Name]'} with its principal place of business at ${recipientAddress || '[Address]'}, email: ${recipientEmail || '[Email]'}, represented by ${recipientContactPerson || '[Contact Person]'} ("List Recipient")

WHEREAS, List Owner owns and maintains a proprietary email list of contacts; and

WHEREAS, List Recipient wishes to access and use this email list for ${purposeText};

NOW, THEREFORE, in consideration of the mutual covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITIONS

1.1 "Email List" means the proprietary database of email addresses and related information owned and maintained by List Owner, as further described in Section 2.

1.2 "Effective Date" means the date first written above.

1.3 "Usage Period" means the period during which List Recipient is authorized to use the Email List as specified in Section 3.

1.4 "Applicable Laws" means all laws, regulations, and industry standards related to email marketing, data protection, and privacy that apply to the parties' activities under this Agreement.

2. EMAIL LIST DESCRIPTION

2.1 List Owner agrees to provide List Recipient with access to its Email List consisting of approximately ${listSize || '[Number]'} email addresses of ${originText}.

2.2 The Email List includes the following information for each contact: ${listDescription || '[Description of data fields included]'}.

2.3 List Owner represents that all individuals on the Email List have provided appropriate consent to receive marketing communications in accordance with Applicable Laws.

3. GRANT OF RIGHTS AND RESTRICTIONS

3.1 License Grant. Subject to the terms and conditions of this Agreement, List Owner grants to List Recipient a non-exclusive, non-transferable, limited license to use the Email List for ${usageTypeText} during the term of this Agreement.

3.2 Restrictions. List Recipient shall not:
   (a) Use the Email List for any purpose other than those expressly permitted by this Agreement;
   (b) Share, sell, rent, lease, or otherwise transfer the Email List or any portion thereof to any third party${allowThirdParty ? `, except as specifically permitted as follows: ${customThirdPartyRestrictions || '[Permitted Third Party Usage]'}` : ''};
   (c) ${allowResale ? 'Resale is permitted under the following conditions: [Resale Conditions]' : 'Resell or commercially exploit the Email List or any portion thereof'};
   (d) Use the Email List in violation of any Applicable Laws;
   (e) Use the Email List to send content that is illegal, offensive, or harmful;
   (f) Attempt to reverse engineer or identify the individuals on the Email List beyond the information provided.

3.3 Approval Process. ${approvalRequired ? `List Recipient shall submit all proposed email content to List Owner for approval before sending. List Owner shall have the right to request changes and shall have ${revisionRounds || '[Number]'} revision rounds to approve final content.` : 'List Recipient is not required to submit email content for approval before sending, but must comply with all terms of this Agreement.'}

3.4 Testing. ${testEmailRequired ? 'List Recipient shall send a test email to List Owner for review before sending to the full Email List.' : 'Test emails are not required before sending to the full Email List.'}

4. COMPLIANCE REQUIREMENTS

4.1 Unsubscribe Mechanism. List Recipient shall include ${unsubscribeText} in all emails sent using the Email List. Unsubscribe requests shall be processed ${unsubscribeProcessing === 'immediate' ? 'immediately' : 'within 10 business days'}.

4.2 Regulatory Compliance. List Recipient shall comply with all Applicable Laws including but not limited to ${complianceText} when using the Email List.

4.3 ${privacyPolicyLink ? 'Privacy Policy. List Recipient shall include a link to its privacy policy in all emails sent using the Email List.' : 'Privacy Disclosures. List Recipient shall include appropriate privacy disclosures in all emails sent using the Email List.'}

4.4 Data Security. List Recipient shall implement and maintain appropriate technical and organizational measures to protect the Email List, including ${dataSecurityText}.

4.5 Data Breach. ${dataBreach ? `In the event of a data breach affecting the Email List, List Recipient shall notify List Owner within ${breachNotificationPeriod || '[Period]'} hours of discovery and take immediate steps to mitigate the breach.` : 'List Recipient shall take reasonable measures to prevent data breaches and shall cooperate with List Owner in the event of any security incident.'}

5. COMPENSATION

5.1 In consideration for the rights granted under this Agreement, List Recipient shall pay List Owner ${compensationText}, ${scheduleText}.

5.2 ${compensationMetrics ? 'Reporting and Metrics. List Recipient shall provide List Owner with detailed performance metrics including delivery rates, open rates, click-through rates, and conversion data within 7 days of each email campaign.' : 'No detailed performance reporting is required under this Agreement.'}

6. TERM AND TERMINATION

6.1 Term. This Agreement shall commence on the Effective Date and continue for ${termText}, unless earlier terminated in accordance with this Agreement.

6.2 ${autoRenewal ? `Automatic Renewal. This Agreement shall automatically renew for successive periods of ${agreementDuration || '[Duration]'} months unless either party provides written notice of non-renewal at least ${renewalNoticePeriod || '[Period]'} days before the end of the current term.` : 'No Automatic Renewal. This Agreement shall not automatically renew upon expiration of its term.'}

6.3 Termination. Either party may terminate this Agreement upon ${terminationText}.

6.4 Effect of Termination. Upon termination or expiration of this Agreement:
   (a) List Recipient shall immediately cease using the Email List;
   (b) List Recipient shall permanently delete all copies of the Email List in its possession;
   (c) List Recipient shall certify in writing that it has complied with the requirements of this section within 7 days of termination;
   (d) The obligations in Sections 7, 8, and 9 shall survive termination.

7. REPRESENTATIONS AND WARRANTIES

7.1 List Owner Warranties. List Owner represents and warrants that:
   (a) It has the right to provide the Email List to List Recipient as set forth in this Agreement;
   (b) The collection and provision of the Email List complies with all Applicable Laws;
   (c) All individuals on the Email List have provided appropriate consent to receive marketing communications.

7.2 List Recipient Warranties. List Recipient represents and warrants that:
   (a) It will use the Email List in compliance with all Applicable Laws;
   (b) It will not use the Email List for any illegal or unethical purpose;
   (c) It has implemented appropriate data security measures to protect the Email List.

8. LIMITATION OF LIABILITY

8.1 EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INTELLECTUAL PROPERTY RIGHTS, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.

8.2 EACH PARTY'S TOTAL LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE AMOUNTS PAID OR PAYABLE UNDER THIS AGREEMENT.

9. CONFIDENTIALITY

9.1 Each party acknowledges that the Email List and related information constitutes confidential information of List Owner.

9.2 List Recipient shall maintain the confidentiality of the Email List and shall not disclose it to any third party except as expressly permitted under this Agreement.

10. MISCELLANEOUS

10.1 Independent Contractors. The parties are independent contractors, and nothing in this Agreement creates a partnership, joint venture, or agency relationship.

10.2 Assignment. Neither party may assign this Agreement without the prior written consent of the other party.

10.3 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of laws principles.

10.4 Entire Agreement. This Agreement constitutes the entire agreement between the parties concerning the subject matter hereof and supersedes all prior and contemporaneous agreements and communications.

10.5 Amendments. This Agreement may only be modified by a written amendment signed by both parties.

10.6 Severability. If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall remain in full force and effect.

10.7 Notices. All notices under this Agreement shall be in writing and sent to the addresses set forth above or to such other address as either party may designate in writing.

10.8 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

LIST OWNER:
${ownerCompanyName || '[List Owner Company Name]'}

By: ____________________________
Name: ${ownerContactPerson || '[Name]'}
Title: [Title]
Date: [Date]

LIST RECIPIENT:
${recipientCompanyName || '[List Recipient Company Name]'}

By: ____________________________
Name: ${recipientContactPerson || '[Name]'}
Title: [Title]
Date: [Date]`;
  };
  
  // Generate the document text
  const documentText = generateDocument();
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Set last changed field for highlighting
    setLastChanged(name);
    
    // Update form data based on input type
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'dataProtectionLaws') {
      // Handle multiple select
      const options = e.target.options;
      const values = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      setFormData(prev => ({
        ...prev,
        [name]: values
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Function to identify sections that need highlighting
  const getHighlightedSections = () => {
    if (!lastChanged) return {};
    
    // Map fields to sections in the document
    const fieldToSection = {
      // Parties
      ownerCompanyName: { regex: /BETWEEN:\s*\n\s*([^\n]+)/, group: 1 },
      ownerAddress: { regex: /with its principal place of business at ([^,]+),/, group: 1 },
      ownerEmail: { regex: /email: ([^,]+),/, group: 1 },
      ownerContactPerson: { regex: /represented by ([^(]+)\("List Owner"\)/, group: 1 },
      recipientCompanyName: { regex: /AND:\s*\n\s*([^\n]+)/, group: 1 },
      recipientAddress: { regex: /with its principal place of business at ([^,]+),.*"List Recipient"/, group: 1 },
      recipientEmail: { regex: /email: ([^,]+),.*"List Recipient"/, group: 1 },
      recipientContactPerson: { regex: /represented by ([^(]+)\("List Recipient"\)/, group: 1 },
      
      // Agreement Terms
      effectiveDate: { regex: /effective as of ([^\n]+)/, group: 1 },
      agreementPurpose: { regex: /for ([^;]+);/, group: 1 },
      customPurpose: { regex: /for ([^;]+);/, group: 1 },
      listDescription: { regex: /following information for each contact: ([^\n]+)/, group: 1 },
      listSize: { regex: /consisting of approximately ([^ ]+) email/, group: 1 },
      listOrigin: { regex: /addresses of ([^\n.]+)/, group: 1 },
      customListOrigin: { regex: /addresses of ([^\n.]+)/, group: 1 },
      
      // Usage Rights
      usageType: { regex: /use the Email List for ([^\n]+) during the/, group: 1 },
      usageFrequency: { regex: /(up to [^t]+times|recurring basis not exceeding [^p]+per month)/, group: 1 },
      usageCustomFrequency: { regex: /use the Email List for ([^\n]+) during the/, group: 1 },
      allowResale: { regex: /(Resale is permitted|Resell or commercially exploit)/, group: 1 },
      allowThirdParty: { regex: /(third party, except as specifically permitted|third party)/, group: 1 },
      customThirdPartyRestrictions: { regex: /permitted as follows: ([^\n]+)/, group: 1 },
      testEmailRequired: { regex: /(List Recipient shall send a test email|Test emails are not required)/, group: 1 },
      approvalRequired: { regex: /(List Recipient shall submit all proposed email content|List Recipient is not required to submit email content)/, group: 1 },
      revisionRounds: { regex: /shall have ([^ ]+) revision rounds/, group: 1 },
      
      // Compliance
      unsubscribeMethod: { regex: /shall include ([^i]+) in all emails/, group: 1 },
      customUnsubscribeMethod: { regex: /shall include ([^i]+) in all emails/, group: 1 },
      unsubscribeProcessing: { regex: /shall be processed (immediately|within 10 business days)/, group: 1 },
      dataProtectionLaws: { regex: /limited to ([^\n]+) when using/, group: 1 },
      privacyPolicyLink: { regex: /(Privacy Policy\.|Privacy Disclosures\.)/, group: 1 },
      dataSecurity: { regex: /including ([^\n.]+)/, group: 1 },
      customDataSecurity: { regex: /including ([^\n.]+)/, group: 1 },
      dataBreach: { regex: /(In the event of a data breach|List Recipient shall take reasonable measures)/, group: 1 },
      breachNotificationPeriod: { regex: /within ([^ ]+) hours of discovery/, group: 1 },
      
      // Compensation & Term
      compensationType: { regex: /shall pay List Owner ([^,]+),/, group: 1 },
      compensationAmount: { regex: /(a flat fee of \$[^ ]+|\$[^ ]+ per email|\$[^ ]+ per email opened|\$[^ ]+ per click|\$[^ ]+ per conversion|[^ ]+% of revenue)/, group: 1 },
      compensationSchedule: { regex: /, ([^.]+)\./, group: 1 },
      compensationMetrics: { regex: /(Reporting and Metrics\.|No detailed performance reporting)/, group: 1 },
      agreementTerm: { regex: /continue for ([^,]+),/, group: 1 },
      agreementDuration: { regex: /for ([^ ]+) months/, group: 1 },
      terminationOption: { regex: /terminate this Agreement upon ([^\n.]+)/, group: 1 },
      terminationNoticePeriod: { regex: /upon ([^ ]+) days' written notice/, group: 1 },
      autoRenewal: { regex: /(Automatic Renewal\.|No Automatic Renewal\.)/, group: 1 },
      renewalNoticePeriod: { regex: /at least ([^ ]+) days before/, group: 1 },
    };
    
    // Find the section to highlight
    const sectionInfo = fieldToSection[lastChanged];
    if (!sectionInfo) return {};
    
    return { [lastChanged]: sectionInfo };
  };
  
  // Function to create highlighted text
  const createHighlightedText = () => {
    let text = documentText;
    const sections = getHighlightedSections();
    
    // Replace each section with highlighted version
    Object.entries(sections).forEach(([field, sectionInfo]) => {
      const { regex, group } = sectionInfo;
      text = text.replace(regex, (match, ...groups) => {
        const beforeGroup = match.substring(0, match.indexOf(groups[group - 1]));
        const afterGroup = match.substring(match.indexOf(groups[group - 1]) + groups[group - 1].length);
        return `${beforeGroup}<span class="highlighted-text">${groups[group - 1]}</span>${afterGroup}`;
      });
    });
    
    return text;
  };
  
  // Create highlighted version of document
  const highlightedText = createHighlightedText();
  
  // Scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Re-initialize feather icons after render
    if (window.feather) {
      window.feather.replace();
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
  
  const goToTab = (index) => {
    setCurrentTab(index);
  };
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert('Document copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      window.generateWordDoc(documentText, {
        documentTitle: 'Email List Usage Agreement',
        fileName: formData.fileName || 'Email-List-Usage-Agreement'
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error generating Word document. Please try again.');
    }
  };
  
  // Open Calendly for consultation
  const openCalendly = () => {
    Calendly.initPopupWidget({
      url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
    });
    return false;
  };
  
  // Risk assessment for final tab
  const getRiskAssessment = () => {
    const risks = [];
    
    // Check for empty required fields
    if (!formData.ownerCompanyName || !formData.recipientCompanyName) {
      risks.push({
        level: 'high',
        title: 'Missing Party Information',
        description: 'Both parties must be clearly identified to create a valid agreement.',
        icon: 'alert-triangle'
      });
    }
    
    // Check email list description
    if (!formData.listDescription || !formData.listSize) {
      risks.push({
        level: 'medium',
        title: 'Inadequate List Description',
        description: 'The email list should be clearly described including size and data fields to avoid disputes.',
        icon: 'info'
      });
    }
    
    // Check usage rights
    if (formData.allowResale) {
      risks.push({
        level: 'high',
        title: 'Resale Permission',
        description: 'Allowing resale of email lists creates significant compliance risks and potential liability.',
        icon: 'alert-triangle'
      });
    }
    
    // Check third party usage
    if (formData.allowThirdParty && !formData.customThirdPartyRestrictions) {
      risks.push({
        level: 'medium',
        title: 'Unrestricted Third Party Usage',
        description: 'Third party usage is allowed but restrictions are not specified, increasing compliance risks.',
        icon: 'alert-circle'
      });
    }
    
    // Check compliance requirements
    if (!formData.dataProtectionLaws || formData.dataProtectionLaws.length === 0) {
      risks.push({
        level: 'high',
        title: 'No Specified Compliance Laws',
        description: 'Failing to specify applicable data protection laws can lead to non-compliance penalties.',
        icon: 'alert-triangle'
      });
    }
    
    // Check data breach notification
    if (formData.dataBreach && (!formData.breachNotificationPeriod || parseInt(formData.breachNotificationPeriod) > 72)) {
      risks.push({
        level: 'medium',
        title: 'Extended Breach Notification Period',
        description: 'Many regulations require breach notification within 72 hours. Consider reducing your notification period.',
        icon: 'clock'
      });
    }
    
    // Check compensation
    if (!formData.compensationAmount) {
      risks.push({
        level: 'medium',
        title: 'Undefined Compensation',
        description: 'The compensation amount should be clearly specified to avoid payment disputes.',
        icon: 'dollar-sign'
      });
    }
    
    // Return empty array if no risks
    return risks.length > 0 ? risks : [
      {
        level: 'low',
        title: 'No Critical Issues Detected',
        description: 'Your agreement appears to address key requirements, but always review the full document for accuracy.',
        icon: 'check-circle'
      }
    ];
  };
  
  return (
    <div className="container">
      <h1>Email List Usage Agreement Generator</h1>
      
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
      
      {/* Content Panel */}
      <div className="content-panel">
        {/* Form Panel */}
        <div className="form-panel">
          {currentTab === 0 && (
            /* Parties Tab */
            <>
              <h2>Party Information</h2>
              <h3>List Owner Information</h3>
              <div className="form-group">
                <label htmlFor="ownerCompanyName">Company Name</label>
                <input
                  type="text"
                  id="ownerCompanyName"
                  name="ownerCompanyName"
                  value={formData.ownerCompanyName}
                  onChange={handleChange}
                  placeholder="List Owner Company Name"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ownerContactPerson">Contact Person</label>
                  <input
                    type="text"
                    id="ownerContactPerson"
                    name="ownerContactPerson"
                    value={formData.ownerContactPerson}
                    onChange={handleChange}
                    placeholder="Name of Contact Person"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ownerEmail">Email</label>
                  <input
                    type="email"
                    id="ownerEmail"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="ownerAddress">Address</label>
                <input
                  type="text"
                  id="ownerAddress"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleChange}
                  placeholder="Business Address"
                />
              </div>
              
              <h3>List Recipient Information</h3>
              <div className="form-group">
                <label htmlFor="recipientCompanyName">Company Name</label>
                <input
                  type="text"
                  id="recipientCompanyName"
                  name="recipientCompanyName"
                  value={formData.recipientCompanyName}
                  onChange={handleChange}
                  placeholder="List Recipient Company Name"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="recipientContactPerson">Contact Person</label>
                  <input
                    type="text"
                    id="recipientContactPerson"
                    name="recipientContactPerson"
                    value={formData.recipientContactPerson}
                    onChange={handleChange}
                    placeholder="Name of Contact Person"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipientEmail">Email</label>
                  <input
                    type="email"
                    id="recipientEmail"
                    name="recipientEmail"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="recipientAddress">Address</label>
                <input
                  type="text"
                  id="recipientAddress"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  placeholder="Business Address"
                />
              </div>
            </>
          )}
          
          {currentTab === 1 && (
            /* Agreement Terms Tab */
            <>
              <h2>Agreement Terms</h2>
              
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
              
              <div className="form-group">
                <label htmlFor="agreementPurpose">Agreement Purpose</label>
                <select
                  id="agreementPurpose"
                  name="agreementPurpose"
                  value={formData.agreementPurpose}
                  onChange={handleChange}
                >
                  <option value="marketing">Marketing & Promotional Emails</option>
                  <option value="newsletter">Newsletter Distribution</option>
                  <option value="sales">Sales & Promotional Offers</option>
                  <option value="custom">Custom Purpose</option>
                </select>
              </div>
              
              {formData.agreementPurpose === 'custom' && (
                <div className="form-group">
                  <label htmlFor="customPurpose">Custom Purpose Description</label>
                  <input
                    type="text"
                    id="customPurpose"
                    name="customPurpose"
                    value={formData.customPurpose}
                    onChange={handleChange}
                    placeholder="Describe the purpose"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="listDescription">List Description</label>
                <input
                  type="text"
                  id="listDescription"
                  name="listDescription"
                  value={formData.listDescription}
                  onChange={handleChange}
                  placeholder="e.g., email, name, preferences, purchase history"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="listSize">Approximate List Size</label>
                <input
                  type="number"
                  id="listSize"
                  name="listSize"
                  value={formData.listSize}
                  onChange={handleChange}
                  placeholder="Number of email addresses"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="listOrigin">List Origin</label>
                <select
                  id="listOrigin"
                  name="listOrigin"
                  value={formData.listOrigin}
                  onChange={handleChange}
                >
                  <option value="opt-in">Opt-in Subscribers</option>
                  <option value="double-opt-in">Double Opt-in Subscribers</option>
                  <option value="purchase">Customers with Purchase History</option>
                  <option value="custom">Custom Origin</option>
                </select>
              </div>
              
              {formData.listOrigin === 'custom' && (
                <div className="form-group">
                  <label htmlFor="customListOrigin">Custom List Origin</label>
                  <input
                    type="text"
                    id="customListOrigin"
                    name="customListOrigin"
                    value={formData.customListOrigin}
                    onChange={handleChange}
                    placeholder="Describe how the list was compiled"
                  />
                </div>
              )}
            </>
          )}
          
          {currentTab === 2 && (
            /* Usage Rights Tab */
            <>
              <h2>Usage Rights & Limitations</h2>
              
              <div className="form-group">
                <label htmlFor="usageType">Usage Type</label>
                <select
                  id="usageType"
                  name="usageType"
                  value={formData.usageType}
                  onChange={handleChange}
                >
                  <option value="oneTime">One-Time Use</option>
                  <option value="limited">Limited Number of Uses</option>
                  <option value="recurring">Recurring Monthly Usage</option>
                  <option value="custom">Custom Usage Terms</option>
                </select>
              </div>
              
              {(formData.usageType === 'limited' || formData.usageType === 'recurring') && (
                <div className="form-group">
                  <label htmlFor="usageFrequency">
                    {formData.usageType === 'limited' ? 'Number of Uses' : 'Uses Per Month'}
                  </label>
                  <input
                    type="number"
                    id="usageFrequency"
                    name="usageFrequency"
                    value={formData.usageFrequency}
                    onChange={handleChange}
                    min="1"
                    max="31"
                  />
                </div>
              )}
              
              {formData.usageType === 'custom' && (
                <div className="form-group">
                  <label htmlFor="usageCustomFrequency">Custom Usage Terms</label>
                  <input
                    type="text"
                    id="usageCustomFrequency"
                    name="usageCustomFrequency"
                    value={formData.usageCustomFrequency}
                    onChange={handleChange}
                    placeholder="Describe usage frequency and limitations"
                  />
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="allowResale"
                    name="allowResale"
                    checked={formData.allowResale}
                    onChange={handleChange}
                  />
                  <label htmlFor="allowResale" className="checkbox-label">Allow Resale of List</label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="allowThirdParty"
                    name="allowThirdParty"
                    checked={formData.allowThirdParty}
                    onChange={handleChange}
                  />
                  <label htmlFor="allowThirdParty" className="checkbox-label">Allow Third Party Usage</label>
                </div>
              </div>
              
              {formData.allowThirdParty && (
                <div className="form-group">
                  <label htmlFor="customThirdPartyRestrictions">Third Party Restrictions</label>
                  <input
                    type="text"
                    id="customThirdPartyRestrictions"
                    name="customThirdPartyRestrictions"
                    value={formData.customThirdPartyRestrictions}
                    onChange={handleChange}
                    placeholder="Specify allowed third party usage"
                  />
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="testEmailRequired"
                    name="testEmailRequired"
                    checked={formData.testEmailRequired}
                    onChange={handleChange}
                  />
                  <label htmlFor="testEmailRequired" className="checkbox-label">Require Test Email</label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="approvalRequired"
                    name="approvalRequired"
                    checked={formData.approvalRequired}
                    onChange={handleChange}
                  />
                  <label htmlFor="approvalRequired" className="checkbox-label">Require Content Approval</label>
                </div>
              </div>
              
              {formData.approvalRequired && (
                <div className="form-group">
                  <label htmlFor="revisionRounds">Number of Revision Rounds</label>
                  <input
                    type="number"
                    id="revisionRounds"
                    name="revisionRounds"
                    value={formData.revisionRounds}
                    onChange={handleChange}
                    min="1"
                    max="5"
                  />
                </div>
              )}
            </>
          )}
          
          {currentTab === 3 && (
            /* Compliance Tab */
            <>
              <h2>Compliance Requirements</h2>
              
              <div className="form-group">
                <label htmlFor="unsubscribeMethod">Unsubscribe Method</label>
                <select
                  id="unsubscribeMethod"
                  name="unsubscribeMethod"
                  value={formData.unsubscribeMethod}
                  onChange={handleChange}
                >
                  <option value="link">Unsubscribe Link</option>
                  <option value="reply">Reply Email Option</option>
                  <option value="both">Both Link and Reply Options</option>
                  <option value="custom">Custom Method</option>
                </select>
              </div>
              
              {formData.unsubscribeMethod === 'custom' && (
                <div className="form-group">
                  <label htmlFor="customUnsubscribeMethod">Custom Unsubscribe Method</label>
                  <input
                    type="text"
                    id="customUnsubscribeMethod"
                    name="customUnsubscribeMethod"
                    value={formData.customUnsubscribeMethod}
                    onChange={handleChange}
                    placeholder="Describe unsubscribe method"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="unsubscribeProcessing">Unsubscribe Processing Time</label>
                <select
                  id="unsubscribeProcessing"
                  name="unsubscribeProcessing"
                  value={formData.unsubscribeProcessing}
                  onChange={handleChange}
                >
                  <option value="immediate">Immediate Processing</option>
                  <option value="standard">Within 10 Business Days</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="dataProtectionLaws">Applicable Data Protection Laws</label>
                <select
                  id="dataProtectionLaws"
                  name="dataProtectionLaws"
                  multiple
                  value={formData.dataProtectionLaws}
                  onChange={handleChange}
                  size="4"
                >
                  <option value="canSpam">CAN-SPAM Act (US)</option>
                  <option value="gdpr">GDPR (EU)</option>
                  <option value="ccpa">CCPA (California)</option>
                  <option value="casl">CASL (Canada)</option>
                </select>
                <div className="text-sm text-muted mb-2">Hold Ctrl/Cmd to select multiple</div>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="privacyPolicyLink"
                  name="privacyPolicyLink"
                  checked={formData.privacyPolicyLink}
                  onChange={handleChange}
                />
                <label htmlFor="privacyPolicyLink" className="checkbox-label">
                  Require Privacy Policy Link in Emails
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="dataSecurity">Data Security Measures</label>
                <select
                  id="dataSecurity"
                  name="dataSecurity"
                  value={formData.dataSecurity}
                  onChange={handleChange}
                >
                  <option value="encryption">Encryption</option>
                  <option value="passwordProtection">Password Protection</option>
                  <option value="secureServer">Secure Servers</option>
                  <option value="custom">Custom Security Measures</option>
                </select>
              </div>
              
              {formData.dataSecurity === 'custom' && (
                <div className="form-group">
                  <label htmlFor="customDataSecurity">Custom Security Measures</label>
                  <input
                    type="text"
                    id="customDataSecurity"
                    name="customDataSecurity"
                    value={formData.customDataSecurity}
                    onChange={handleChange}
                    placeholder="Describe security measures"
                  />
                </div>
              )}
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="dataBreach"
                  name="dataBreach"
                  checked={formData.dataBreach}
                  onChange={handleChange}
                />
                <label htmlFor="dataBreach" className="checkbox-label">
                  Include Data Breach Notification Requirements
                </label>
              </div>
              
              {formData.dataBreach && (
                <div className="form-group">
                  <label htmlFor="breachNotificationPeriod">Breach Notification Period (hours)</label>
                  <input
                    type="number"
                    id="breachNotificationPeriod"
                    name="breachNotificationPeriod"
                    value={formData.breachNotificationPeriod}
                    onChange={handleChange}
                    min="1"
                    max="168"
                  />
                </div>
              )}
            </>
          )}
          
          {currentTab === 4 && (
            /* Compensation & Term Tab */
            <>
              <h2>Compensation & Term</h2>
              
              <div className="form-group">
                <label htmlFor="compensationType">Compensation Type</label>
                <select
                  id="compensationType"
                  name="compensationType"
                  value={formData.compensationType}
                  onChange={handleChange}
                >
                  <option value="flat">Flat Fee</option>
                  <option value="perEmail">Per Email Sent</option>
                  <option value="perOpen">Per Email Open</option>
                  <option value="perClick">Per Click</option>
                  <option value="perConversion">Per Conversion</option>
                  <option value="revShare">Revenue Share Percentage</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="compensationAmount">
                  {formData.compensationType === 'revShare' ? 'Percentage (%)' : 'Amount ($)'}
                </label>
                <input
                  type="text"
                  id="compensationAmount"
                  name="compensationAmount"
                  value={formData.compensationAmount}
                  onChange={handleChange}
                  placeholder={formData.compensationType === 'revShare' ? '15' : '500'}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="compensationSchedule">Payment Schedule</label>
                <select
                  id="compensationSchedule"
                  name="compensationSchedule"
                  value={formData.compensationSchedule}
                  onChange={handleChange}
                >
                  <option value="upfront">Paid Upfront</option>
                  <option value="afterDelivery">Paid After Delivery</option>
                  <option value="monthly">Paid Monthly</option>
                  <option value="quarterly">Paid Quarterly</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="compensationMetrics"
                  name="compensationMetrics"
                  checked={formData.compensationMetrics}
                  onChange={handleChange}
                />
                <label htmlFor="compensationMetrics" className="checkbox-label">
                  Require Performance Reporting & Metrics
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="agreementTerm">Agreement Term</label>
                <select
                  id="agreementTerm"
                  name="agreementTerm"
                  value={formData.agreementTerm}
                  onChange={handleChange}
                >
                  <option value="fixed">Fixed Term (months)</option>
                  <option value="indefinite">Indefinite Term</option>
                  <option value="singleUse">Single Use Only</option>
                </select>
              </div>
              
              {formData.agreementTerm === 'fixed' && (
                <div className="form-group">
                  <label htmlFor="agreementDuration">Duration (months)</label>
                  <input
                    type="number"
                    id="agreementDuration"
                    name="agreementDuration"
                    value={formData.agreementDuration}
                    onChange={handleChange}
                    min="1"
                    max="60"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="terminationOption">Termination Options</label>
                <select
                  id="terminationOption"
                  name="terminationOption"
                  value={formData.terminationOption}
                  onChange={handleChange}
                >
                  <option value="notice">Written Notice Period</option>
                  <option value="immediate">Immediate for Material Breach</option>
                  <option value="both">Both Notice & Immediate Options</option>
                </select>
              </div>
              
              {(formData.terminationOption === 'notice' || formData.terminationOption === 'both') && (
                <div className="form-group">
                  <label htmlFor="terminationNoticePeriod">Notice Period (days)</label>
                  <input
                    type="number"
                    id="terminationNoticePeriod"
                    name="terminationNoticePeriod"
                    value={formData.terminationNoticePeriod}
                    onChange={handleChange}
                    min="1"
                    max="90"
                  />
                </div>
              )}
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="autoRenewal"
                  name="autoRenewal"
                  checked={formData.autoRenewal}
                  onChange={handleChange}
                />
                <label htmlFor="autoRenewal" className="checkbox-label">
                  Enable Automatic Renewal
                </label>
              </div>
              
              {formData.autoRenewal && (
                <div className="form-group">
                  <label htmlFor="renewalNoticePeriod">Renewal Notice Period (days)</label>
                  <input
                    type="number"
                    id="renewalNoticePeriod"
                    name="renewalNoticePeriod"
                    value={formData.renewalNoticePeriod}
                    onChange={handleChange}
                    min="1"
                    max="90"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="fileName">Document Filename</label>
                <input
                  type="text"
                  id="fileName"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  placeholder="Document Filename"
                />
              </div>
            </>
          )}
          
          {currentTab === 5 && (
            /* Review & Risks Tab */
            <>
              <h2>Review & Risk Assessment</h2>
              
              <div className="text-sm mb-4">
                Review your agreement and check for potential legal or compliance risks below.
              </div>
              
              <div className="risk-assessment">
                {getRiskAssessment().map((risk, index) => (
                  <div key={index} className={`risk-item ${risk.level}`}>
                    <div className="risk-icon">
                      <Icon name={risk.icon} />
                    </div>
                    <div className="risk-content">
                      <h4>{risk.title}</h4>
                      <p>{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label htmlFor="fileName">Filename for Download</label>
                <input
                  type="text"
                  id="fileName"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  placeholder="Document Filename"
                />
              </div>
              
              <div className="text-sm text-muted" style={{ marginTop: '1rem' }}>
                <p><strong>Note:</strong> This generator provides a general template and is not a substitute for legal advice. Always have your final agreement reviewed by qualified legal counsel.</p>
              </div>
            </>
          )}
        </div>
        
        {/* Preview Panel */}
        <div className="preview-panel" ref={previewRef}>
          <h2>Live Preview</h2>
          <div 
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
      
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
        
        <button
          onClick={openCalendly}
          className="nav-button"
          style={{
            backgroundColor: "#10b981", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="phone" style={{marginRight: "0.25rem"}} />
          Consultation
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
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <Icon name="chevron-right" style={{marginLeft: "0.25rem"}} />
        </button>
      </div>
      
      {/* Calendly Widget Script */}
      <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));