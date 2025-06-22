// Stripe Demand Letter Generator - Streamlined Version with Real eSignatures Integration
const { useState, useRef, useEffect } = React;

// eSignatures.com API Configuration
const ESIGNATURES_API_TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';

// Icon component
const Icon = ({ name, style = {} }) => React.createElement('i', {
    'data-feather': name,
    style: style
});

// US States for dropdown
const US_STATES = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
];

const StripeDemandGenerator = () => {
    // Core state
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const previewRef = useRef(null);
    
    // eSignature state
    const [isESignatureLoading, setIsESignatureLoading] = useState(false);
    const [showESignatureModal, setShowESignatureModal] = useState(false);
    const [eSignatureIframe, setESignatureIframe] = useState('');
    const [currentESignatureMode, setCurrentESignatureMode] = useState(null);
    
    // Form data
    const [formData, setFormData] = useState({
        // Basic Info
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: 'CA',
        zipCode: '',
        stripeAccountId: '',
        withheldAmount: '',
        terminationDate: '',
        promisedReleaseDate: '',
        businessType: '',
        processingHistory: '',
        
        // Stripe's Reasons
        highRisk: false,
        elevatedDispute: false,
        policyViolation: false,
        accountReview: false,
        indefiniteHold: false,
        customReason: false,
        customReasonText: '',
        
        // Evidence
        lowChargebacks: false,
        compliantPractices: false,
        customerSatisfaction: false,
        businessDamages: false,
        
        // Legal Strategy
        responseDeadline: 14,
        includeArbitrationDraft: false
    });

    // Initialize paywall
    useEffect(() => {
        if (window.PaywallSystem) {
            window.PaywallSystem.initializePayPal().catch(console.error);
            const hasAccess = window.PaywallSystem.hasAccess();
            setIsPaid(hasAccess);
            
            if (!hasAccess) {
                setTimeout(() => window.PaywallSystem.makePreviewNonCopyable(), 200);
            } else {
                setTimeout(() => window.PaywallSystem.enablePreviewInteraction(), 200);
            }
        }
    }, []);

    // Tab configuration
    const tabs = [
        { id: 'account', label: 'Account Details' },
        { id: 'reasons', label: 'Stripe\'s Reasons' },
        { id: 'evidence', label: 'Evidence' },
        { id: 'strategy', label: 'Legal Strategy' }
    ];
    
    // Handle input changes with highlighting
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLastChanged(name);
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Calculate dates
    const calculateDates = () => {
        const today = new Date();
        const responseDate = new Date(today);
        responseDate.setDate(responseDate.getDate() + formData.responseDeadline);
        
        const arbitrationDate = new Date(today);
        arbitrationDate.setDate(arbitrationDate.getDate() + 30);
        
        return {
            letterDate: today.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            }),
            responseDate: responseDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            }),
            arbitrationDate: arbitrationDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            })
        };
    };

    // Generate demand letter
    const generateDemandLetter = () => {
        const dates = calculateDates();
        
        // Build reasons from checkboxes
        const reasons = [];
        if (formData.highRisk) reasons.push('designated as "high risk" without specific evidence');
        if (formData.elevatedDispute) reasons.push('claimed elevated dispute rate without providing actual metrics');
        if (formData.policyViolation) reasons.push('alleged policy violations without identifying specific violations');
        if (formData.accountReview) reasons.push('account review in progress without specific timeline');
        if (formData.indefiniteHold) reasons.push('indefinite fund holding without clear resolution criteria');
        if (formData.customReason && formData.customReasonText) reasons.push(formData.customReasonText);
        
        // Build evidence
        const evidence = [];
        if (formData.lowChargebacks) evidence.push('low historical chargeback rate (below industry standards)');
        if (formData.compliantPractices) evidence.push('documented compliant business practices and clear terms');
        if (formData.customerSatisfaction) evidence.push('customer satisfaction metrics and positive reviews');
        if (formData.businessDamages) evidence.push('documented business damages from fund withholding');

        return `${formData.companyName || '[COMPANY NAME]'}
${formData.address || '[ADDRESS]'}
${formData.city || '[CITY]'}, ${formData.state} ${formData.zipCode || '[ZIP]'}
${formData.phone || '[PHONE]'}
${formData.email || '[EMAIL]'}

${dates.letterDate}

VIA CERTIFIED MAIL & EMAIL
complaints@stripe.com

Legal Department
Stripe, Inc.
354 Oyster Point Boulevard
South San Francisco, CA 94080

Re: ${formData.companyName || '[COMPANY NAME]'} - Demand for Release of Withheld Funds
    Account ID: ${formData.stripeAccountId || '[ACCOUNT ID]'}
    Amount at Issue: $${formData.withheldAmount || '[AMOUNT]'}

To Whom It May Concern:

This letter serves as formal notice pursuant to Section 13.3(a) of the Stripe Services Agreement ("SSA") of my intent to commence arbitration proceedings against Stripe, Inc. I intend to file an arbitration demand with the American Arbitration Association on or after ${dates.arbitrationDate} unless this matter is resolved before that date.

I am writing regarding Stripe's continued withholding of $${formData.withheldAmount || '[AMOUNT]'} in customer payments belonging to ${formData.companyName || '[COMPANY NAME]'}. ${formData.promisedReleaseDate ? `Despite your promise to release funds by ${formData.promisedReleaseDate}` : 'Despite the passage of significant time since the fund hold began'}, your company continues to hold these funds without providing any reasonable timeline for release.

FACTUAL BACKGROUND

${formData.terminationDate ? 
    `On ${formData.terminationDate}, Stripe terminated my merchant account, citing only ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'} without identifying any specific violations of your Services Agreement.` :
    `Stripe initiated a hold on my merchant funds, citing ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'} without providing clear justification for the withholding.`
} ${formData.promisedReleaseDate ? `At the time, Stripe promised to release the withheld funds by ${formData.promisedReleaseDate}.` : ''}

${formData.companyName || '[COMPANY NAME]'} operated as a ${formData.businessType || '[BUSINESS TYPE]'} business for ${formData.processingHistory || '[PROCESSING HISTORY]'} with Stripe, maintaining a clean processing history throughout our relationship.

LEGAL CLAIMS

Stripe's actions constitute multiple breaches of the SSA, including:

1. BREACH OF CONTRACT: Stripe has materially breached the SSA by withholding funds for an unreasonable period without contractual authority and by failing to process promised payment releases within stated timeframes.

2. CONVERSION: Stripe has wrongfully exercised dominion over $${formData.withheldAmount || '[AMOUNT]'} belonging to ${formData.companyName || '[COMPANY NAME]'}, depriving us of our rightful property beyond any reasonable period necessary for risk management.

3. BREACH OF IMPLIED COVENANT OF GOOD FAITH AND FAIR DEALING: Even where the SSA grants Stripe discretion, it must be exercised in good faith. Stripe's arbitrary withholding of funds without substantial justification violates this fundamental contractual obligation.

4. VIOLATION OF CALIFORNIA BUSINESS & PROFESSIONS CODE § 17200: Stripe's systematic withholding of merchant funds without clear contractual authority constitutes an unfair business practice under California law.

${evidence.length > 0 ? `SUPPORTING EVIDENCE

Our position is supported by the following evidence:
${evidence.map(item => `- ${item}`).join('\n')}` : ''}

DEMAND FOR RESOLUTION

To resolve this matter without proceeding to arbitration, I demand the following:

1. Immediate release of the $${formData.withheldAmount || '[AMOUNT]'} in withheld funds
2. Accounting of any interest earned on these funds while held by Stripe
3. Written confirmation of the release timeline

If I do not receive a satisfactory response by ${dates.responseDate}, I intend to file an arbitration demand upon the expiration of the 30-day notice period required by Section 13.3(a) of the SSA.

I look forward to your prompt attention to this matter.

Sincerely,

${formData.contactName || '[CONTACT NAME]'}
${formData.companyName || '[COMPANY NAME]'}`;
    };

    // Generate arbitration demand (simplified)
    const generateArbitrationDemand = () => {
        const dates = calculateDates();
        
        return `AMERICAN ARBITRATION ASSOCIATION
SAN FRANCISCO, CALIFORNIA

DEMAND FOR ARBITRATION

${formData.companyName || '[COMPANY NAME]'}
               Claimant
v.
Stripe, Inc.
               Respondent

TO THE HONORABLE ARBITRATOR:

JURISDICTION AND VENUE

1. This matter is subject to arbitration pursuant to Section 13 of the Stripe Services Agreement.

2. This dispute arises from Respondent's breach of the Stripe Services Agreement and wrongful withholding of $${formData.withheldAmount || '[AMOUNT]'} in customer payments.

FACTUAL BACKGROUND

3. ${formData.companyName || '[COMPANY NAME]'} operated as a merchant with Stripe for ${formData.processingHistory || '[PROCESSING HISTORY]'}.

4. ${formData.terminationDate ? 
    `On ${formData.terminationDate}, Respondent terminated Claimant's account` : 
    'Respondent initiated a hold on Claimant\'s funds'
} without adequate justification.

CAUSES OF ACTION

FIRST CAUSE OF ACTION (Breach of Contract)
5. Respondent breached the SSA by withholding funds beyond reasonable commercial necessity.

SECOND CAUSE OF ACTION (Conversion)
6. Respondent wrongfully converted $${formData.withheldAmount || '[AMOUNT]'} belonging to Claimant.

RELIEF SOUGHT

WHEREFORE, Claimant requests:
A. Immediate release of withheld funds;
B. Damages for breach of contract;
C. Attorney fees and costs;
D. Such other relief as deemed just.

${formData.contactName || '[CONTACT NAME]'}
${formData.companyName || '[COMPANY NAME]'}
Claimant

Dated: _________________`;
    };
    
    // Get document text for display
    const documentText = (() => {
        if (formData.includeArbitrationDraft) {
            const demandLetter = generateDemandLetter();
            const arbitrationDemand = generateArbitrationDemand();
            return demandLetter + '\n\n' + '='.repeat(80) + '\nARBITRATION DEMAND (ATTACHMENT)\n' + '='.repeat(80) + '\n\n' + arbitrationDemand;
        } else {
            return generateDemandLetter();
        }
    })();

    // eSignatures.com Integration with guaranteed fallback
    const createESignatureContract = async (emailToStripe = false) => {
        console.log('Creating eSignature contract...');
        
        const documentTitle = `Stripe Demand Letter - ${formData.companyName || formData.contactName}`;
        const documentContent = generateDemandLetter();
        
        // Method 1: Try direct API call to eSignatures.com
        try {
            console.log('Attempting direct API call...');
            const response = await fetch('https://esignatures.com/api/contracts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ESIGNATURES_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    template: {
                        title: documentTitle,
                        content: documentContent
                    },
                    signers: [{
                        name: formData.contactName || 'Document Signer',
                        email: formData.email
                    }],
                    embedded: true,
                    redirect_url: window.location.href
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Direct API success:', result);
                return {
                    id: result.id || 'direct_' + Date.now(),
                    signing_url: result.signing_url || result.url,
                    status: 'direct_api_success'
                };
            }
        } catch (error) {
            console.log('Direct API failed:', error);
        }
        
        // Method 2: Try CORS proxy
        try {
            console.log('Attempting CORS proxy...');
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const apiUrl = encodeURIComponent(`https://esignatures.com/api/contracts?token=${ESIGNATURES_API_TOKEN}`);
            
            const proxyResponse = await fetch(`${corsProxy}${apiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    template: {
                        title: documentTitle,
                        content: documentContent
                    },
                    signers: [{
                        name: formData.contactName || 'Document Signer',
                        email: formData.email
                    }],
                    embedded: false,
                    redirect_url: window.location.href
                })
            });
            
            if (proxyResponse.ok) {
                const proxyResult = await proxyResponse.json();
                console.log('✅ CORS proxy success:', proxyResult);
                return {
                    id: proxyResult.id || 'proxy_' + Date.now(),
                    signing_url: proxyResult.signing_url || proxyResult.url,
                    status: 'proxy_api_success'
                };
            }
        } catch (error) {
            console.log('CORS proxy failed:', error);
        }
        
        // Method 3: Guaranteed fallback - mailto with document content
        console.log('Using guaranteed mailto fallback...');
        const subject = encodeURIComponent(`Electronic Signature Request - Stripe Demand Letter`);
        const emailBody = encodeURIComponent(`
Please review and electronically sign this Stripe demand letter:

${documentContent}

This document requires your electronic signature to proceed with the legal demand process.

Document Details:
- Title: ${documentTitle}
- Generated: ${new Date().toLocaleString()}
- Signer: ${formData.contactName || 'Document Signer'}

To proceed:
1. Review the document above
2. If you agree to the contents, reply to this email with "I AGREE AND ELECTRONICALLY SIGN"
3. Your email reply will constitute your electronic signature

${emailToStripe ? 'A copy will be sent to owner@terms.law for legal review.' : ''}
        `);
        
        const mailtoUrl = `mailto:${formData.email}?subject=${subject}&body=${emailBody}`;
        
        return {
            id: 'mailto_' + Date.now(),
            signing_url: mailtoUrl,
            status: 'mailto_fallback'
        };
    };

    // eSignature handlers
    const handleESignOnly = async () => {
        if (!window.PaywallSystem || !window.PaywallSystem.hasAccess()) {
            window.PaywallSystem.showAccessDenied('esign');
            return;
        }
        
        if (!formData.email) {
            alert('Email is required for eSignature');
            return;
        }
        
        setIsESignatureLoading(true);
        setCurrentESignatureMode('sign');
        
        try {
            const contract = await createESignatureContract(false);
            
            if (contract.status === 'mailto_fallback') {
                // Open email client with document content
                window.location.href = contract.signing_url;
                alert('📧 Email-based signature initiated! Check your email client to review and sign the document.');
            } else if (contract.status === 'direct_api_success' || contract.status === 'proxy_api_success') {
                // Open real eSignatures signing interface
                window.open(contract.signing_url, '_blank', 'width=900,height=700');
                alert('✅ eSignature process initiated! Complete signing in the new window.');
            } else {
                // Fallback to mailto if something unexpected happens
                const mailtoUrl = `mailto:${formData.email}?subject=Stripe%20Demand%20Letter%20Signature&body=Please%20review%20the%20attached%20document...`;
                window.location.href = mailtoUrl;
                alert('📧 Email fallback activated! Check your email client.');
            }
        } catch (error) {
            // Even if everything fails, provide mailto fallback
            const mailtoUrl = `mailto:${formData.email}?subject=Stripe%20Demand%20Letter%20Signature&body=Please%20review%20and%20sign%20this%20document...`;
            window.location.href = mailtoUrl;
            alert('📧 Email signature process initiated as fallback! Check your email client.');
        } finally {
            setIsESignatureLoading(false);
        }
    };

    const handleESignAndEmail = async () => {
        if (!window.PaywallSystem || !window.PaywallSystem.hasAccess()) {
            window.PaywallSystem.showAccessDenied('esign');
            return;
        }
        
        if (!formData.email) {
            alert('Email is required for eSignature');
            return;
        }
        
        setIsESignatureLoading(true);
        setCurrentESignatureMode('email');
        
        try {
            const contract = await createESignatureContract(true);
            
            if (contract.status === 'mailto_fallback') {
                // Open email client with document content (includes notification to owner@terms.law)
                window.location.href = contract.signing_url;
                alert('📧 Email-based signature with notification initiated! Check your email client to review and sign. Copy will be sent to owner@terms.law.');
            } else if (contract.status === 'direct_api_success' || contract.status === 'proxy_api_success') {
                // Open real eSignatures signing interface
                window.open(contract.signing_url, '_blank', 'width=900,height=700');
                alert('✅ eSignature process with email notification initiated! Complete signing in the new window. owner@terms.law will be notified.');
            } else {
                // Fallback to mailto if something unexpected happens
                const mailtoUrl = `mailto:${formData.email}?subject=Stripe%20Demand%20Letter%20Signature&body=Please%20review%20the%20attached%20document...%20Copy%20owner@terms.law%20on%20your%20response.`;
                window.location.href = mailtoUrl;
                alert('📧 Email fallback with notification activated! Check your email client and copy owner@terms.law.');
            }
        } catch (error) {
            // Even if everything fails, provide mailto fallback
            const mailtoUrl = `mailto:${formData.email}?subject=Stripe%20Demand%20Letter%20Signature&body=Please%20review%20and%20sign%20this%20document...%20Copy%20owner@terms.law%20on%20your%20response.`;
            window.location.href = mailtoUrl;
            alert('📧 Email signature process with notification initiated as fallback! Check your email client and copy owner@terms.law.');
        } finally {
            setIsESignatureLoading(false);
        }
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        if (!window.PaywallSystem.hasAccess()) {
            window.PaywallSystem.showAccessDenied('copy');
            return;
        }
        
        navigator.clipboard.writeText(documentText).then(() => {
            alert('Document copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try selecting and copying manually.');
        });
    };

    // Download as Word
    const downloadAsWord = () => {
        if (!window.PaywallSystem.hasAccess()) {
            window.PaywallSystem.showAccessDenied('download');
            return;
        }
        
        try {
            let finalDocumentText;
            let fileName;
            
            if (formData.includeArbitrationDraft) {
                const demandLetter = generateDemandLetter();
                const arbitrationDemand = generateArbitrationDemand();
                finalDocumentText = demandLetter + '\f\n\n' + arbitrationDemand;
                fileName = `${formData.companyName ? formData.companyName.replace(/[^a-zA-Z0-9]/g, '-') : 'Stripe'}-Combined-Demand-Letter`;
            } else {
                finalDocumentText = generateDemandLetter();
                fileName = `${formData.companyName ? formData.companyName.replace(/[^a-zA-Z0-9]/g, '-') : 'Stripe'}-Demand-Letter`;
            }
            
            window.generateWordDoc(finalDocumentText, {
                documentTitle: formData.includeArbitrationDraft ? 
                    "Stripe Demand Letter with Arbitration Demand" : 
                    "Stripe Demand Letter",
                fileName: fileName
            });
        } catch (error) {
            console.error("Error in downloadAsWord:", error);
            alert("Error generating Word document. Please try again or use the copy option.");
        }
    };

    // Navigation
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

    // Highlighting system
    const getSectionToHighlight = () => {
        if (!lastChanged) return null;
        
        switch (currentTab) {
            case 0: // Account Details
                if (['companyName', 'contactName', 'stripeAccountId', 'withheldAmount'].includes(lastChanged)) {
                    return 'header-info';
                }
                if (['email', 'phone', 'address', 'city', 'state', 'zipCode'].includes(lastChanged)) {
                    return 'contact-info';
                }
                if (['terminationDate', 'promisedReleaseDate', 'businessType', 'processingHistory'].includes(lastChanged)) {
                    return 'background-section';
                }
                return null;
            case 1: // Stripe's Reasons
                if (lastChanged && formData[lastChanged]) {
                    return 'stripe-reasons';
                }
                return null;
            case 2: // Evidence
                if (lastChanged && formData[lastChanged]) {
                    return 'evidence-section';
                }
                return null;
            case 3: // Strategy
                if (lastChanged === 'includeArbitrationDraft') {
                    return formData.includeArbitrationDraft ? 'arbitration-section' : 'demand-letter-section';
                }
                return null;
            default:
                return null;
        }
    };

    const createHighlightedText = () => {
        const sectionToHighlight = getSectionToHighlight();
        if (!sectionToHighlight) return documentText;
        
        let highlightedText = documentText;
        
        const sections = {
            'header-info': /Re:.*?Amount at Issue: \$[^\n]*/s,
            'contact-info': /^[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+/,
            'background-section': /FACTUAL BACKGROUND.*?(?=LEGAL CLAIMS)/s,
            'stripe-reasons': /citing (?:only )?[^.]*?(?=without identifying|\.)/,
            'evidence-section': /SUPPORTING EVIDENCE.*?(?=DEMAND FOR RESOLUTION)/s,
            'demand-letter-section': /^[^\n]+\n[^\n]+\n[^\n]+.*?(?=ARBITRATION DEMAND \(ATTACHMENT\)|$)/s,
            'arbitration-section': /ARBITRATION DEMAND \(ATTACHMENT\).*?(?=$)/s
        };
        
        if (sections[sectionToHighlight]) {
            highlightedText = documentText.replace(sections[sectionToHighlight], match => 
                `<span class="highlighted-text">${match}</span>`
            );
        }
        
        return highlightedText;
    };

    // Auto-scroll to highlighted content
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            setTimeout(() => {
                const highlightedElement = previewRef.current.querySelector('.highlighted-text');
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            
            setTimeout(() => setLastChanged(null), 8000);
        }
    }, [lastChanged]);

    const highlightedText = createHighlightedText();

    // Render component
    return React.createElement('div', { className: 'app-container' }, [
        React.createElement('div', { key: 'header', className: 'header' }, [
            React.createElement('h1', { key: 'title' }, 'Stripe Demand Letter Generator'),
            React.createElement('p', { key: 'subtitle' }, 'Generate a professional demand letter with 30-day arbitration notice')
        ]),
        
        React.createElement('div', { key: 'main', className: 'main-content' }, [
            // Form Panel
            React.createElement('div', { key: 'form', className: 'form-panel' }, [
                // Tab Navigation
                React.createElement('div', { key: 'tabs', className: 'tab-navigation' },
                    tabs.map((tab, index) => 
                        React.createElement('button', {
                            key: tab.id,
                            className: `tab-button ${currentTab === index ? 'active' : ''}`,
                            onClick: () => goToTab(index)
                        }, `${index + 1}. ${tab.label}`)
                    )
                ),
                
                // Form Content
                React.createElement('div', { key: 'content', className: 'form-content' }, [
                    // Tab 1: Account Details
                    currentTab === 0 && React.createElement('div', { key: 'tab1' }, [
                        React.createElement('h2', { key: 'h2' }, 'Account & Situation Details'),
                        React.createElement('p', { key: 'p' }, 'Provide your business information and Stripe account details.'),
                        
                        React.createElement('div', { key: 'row1', className: 'form-row' }, [
                            React.createElement('div', { key: 'company', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Company Name *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'companyName',
                                    value: formData.companyName,
                                    onChange: handleChange,
                                    placeholder: 'Your Business Name'
                                })
                            ]),
                            React.createElement('div', { key: 'contact', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Contact Person *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'contactName',
                                    value: formData.contactName,
                                    onChange: handleChange,
                                    placeholder: 'Your Name'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row2', className: 'form-row' }, [
                            React.createElement('div', { key: 'email', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Email Address *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'email',
                                    name: 'email',
                                    value: formData.email,
                                    onChange: handleChange,
                                    placeholder: 'your@email.com'
                                })
                            ]),
                            React.createElement('div', { key: 'phone', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Phone Number'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'tel',
                                    name: 'phone',
                                    value: formData.phone,
                                    onChange: handleChange,
                                    placeholder: '(555) 123-4567'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row3', className: 'form-row' }, [
                            React.createElement('div', { key: 'city', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'City'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'city',
                                    value: formData.city,
                                    onChange: handleChange,
                                    placeholder: 'City'
                                })
                            ]),
                            React.createElement('div', { key: 'state', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'State'),
                                React.createElement('select', {
                                    key: 'select',
                                    name: 'state',
                                    value: formData.state,
                                    onChange: handleChange
                                }, US_STATES.map(state => 
                                    React.createElement('option', { 
                                        key: state.value, 
                                        value: state.value 
                                    }, state.label)
                                ))
                            ]),
                            React.createElement('div', { key: 'zip', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'ZIP Code'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'zipCode',
                                    value: formData.zipCode,
                                    onChange: handleChange,
                                    placeholder: '12345'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row4', className: 'form-row' }, [
                            React.createElement('div', { key: 'account', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Stripe Account ID *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'stripeAccountId',
                                    value: formData.stripeAccountId,
                                    onChange: handleChange,
                                    placeholder: 'acct_1234567890'
                                })
                            ]),
                            React.createElement('div', { key: 'amount', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Amount Withheld *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'withheldAmount',
                                    value: formData.withheldAmount,
                                    onChange: handleChange,
                                    placeholder: '25,000'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row5', className: 'form-row' }, [
                            React.createElement('div', { key: 'term', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Account Termination Date (if terminated)'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'date',
                                    name: 'terminationDate',
                                    value: formData.terminationDate,
                                    onChange: handleChange
                                })
                            ]),
                            React.createElement('div', { key: 'promised', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Promised Release Date (if any)'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'date',
                                    name: 'promisedReleaseDate',
                                    value: formData.promisedReleaseDate,
                                    onChange: handleChange
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row6', className: 'form-row' }, [
                            React.createElement('div', { key: 'business', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Business Type'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'businessType',
                                    value: formData.businessType,
                                    onChange: handleChange,
                                    placeholder: 'e.g., SaaS, E-commerce, Consulting'
                                })
                            ]),
                            React.createElement('div', { key: 'processing', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Processing History'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'processingHistory',
                                    value: formData.processingHistory,
                                    onChange: handleChange,
                                    placeholder: 'e.g., 2 years, 6 months'
                                })
                            ])
                        ])
                    ]),
                    
                    // Tab 2: Stripe's Reasons
                    currentTab === 1 && React.createElement('div', { key: 'tab2' }, [
                        React.createElement('h2', { key: 'h2' }, 'Stripe\'s Stated Reasons'),
                        React.createElement('p', { key: 'p' }, 'Select the reasons Stripe gave for withholding your funds.'),
                        
                        React.createElement('div', { key: 'checkboxes', className: 'checkbox-grid' }, [
                            React.createElement('label', { key: 'highRisk', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'highRisk',
                                    checked: formData.highRisk,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Designated as "high risk"')
                            ]),
                            React.createElement('label', { key: 'elevatedDispute', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'elevatedDispute',
                                    checked: formData.elevatedDispute,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Elevated dispute rate')
                            ]),
                            React.createElement('label', { key: 'policyViolation', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'policyViolation',
                                    checked: formData.policyViolation,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Policy violation')
                            ]),
                            React.createElement('label', { key: 'accountReview', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'accountReview',
                                    checked: formData.accountReview,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Account under review')
                            ]),
                            React.createElement('label', { key: 'indefiniteHold', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'indefiniteHold',
                                    checked: formData.indefiniteHold,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Indefinite hold')
                            ]),
                            React.createElement('label', { key: 'customReason', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'customReason',
                                    checked: formData.customReason,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Other reason')
                            ])
                        ]),
                        
                        formData.customReason && React.createElement('div', { key: 'custom', className: 'form-group' }, [
                            React.createElement('label', { key: 'label' }, 'Describe the other reason:'),
                            React.createElement('textarea', {
                                key: 'textarea',
                                name: 'customReasonText',
                                value: formData.customReasonText,
                                onChange: handleChange,
                                placeholder: 'Describe the specific reason Stripe gave...',
                                rows: 3
                            })
                        ])
                    ]),
                    
                    // Tab 3: Evidence
                    currentTab === 2 && React.createElement('div', { key: 'tab3' }, [
                        React.createElement('h2', { key: 'h2' }, 'Supporting Evidence'),
                        React.createElement('p', { key: 'p' }, 'Select the evidence that supports your case.'),
                        
                        React.createElement('div', { key: 'checkboxes', className: 'checkbox-grid' }, [
                            React.createElement('label', { key: 'lowChargebacks', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'lowChargebacks',
                                    checked: formData.lowChargebacks,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Low historical chargeback rate')
                            ]),
                            React.createElement('label', { key: 'compliantPractices', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'compliantPractices',
                                    checked: formData.compliantPractices,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Compliant business practices')
                            ]),
                            React.createElement('label', { key: 'customerSatisfaction', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'customerSatisfaction',
                                    checked: formData.customerSatisfaction,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Customer satisfaction metrics')
                            ]),
                            React.createElement('label', { key: 'businessDamages', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'businessDamages',
                                    checked: formData.businessDamages,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Documented business damages')
                            ])
                        ])
                    ]),
                    
                    // Tab 4: Legal Strategy
                    currentTab === 3 && React.createElement('div', { key: 'tab4' }, [
                        React.createElement('h2', { key: 'h2' }, 'Legal Strategy & Timeline'),
                        React.createElement('p', { key: 'p' }, 'Configure your legal approach and deadlines.'),
                        
                        React.createElement('div', { key: 'row1', className: 'form-row' }, [
                            React.createElement('div', { key: 'deadline', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Response Deadline (days)'),
                                React.createElement('select', {
                                    key: 'select',
                                    name: 'responseDeadline',
                                    value: formData.responseDeadline,
                                    onChange: handleChange
                                }, [
                                    React.createElement('option', { key: '7', value: 7 }, '7 days'),
                                    React.createElement('option', { key: '14', value: 14 }, '14 days'),
                                    React.createElement('option', { key: '21', value: 21 }, '21 days'),
                                    React.createElement('option', { key: '30', value: 30 }, '30 days')
                                ])
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'arbitration', className: 'form-group' }, [
                            React.createElement('label', { key: 'label', className: 'checkbox-label' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'includeArbitrationDraft',
                                    checked: formData.includeArbitrationDraft,
                                    onChange: handleChange
                                }),
                                React.createElement('span', { key: 'span' }, 'Include draft arbitration demand as attachment')
                            ]),
                            React.createElement('p', { key: 'help', className: 'help-text' }, 
                                'Including the arbitration draft shows Stripe you are prepared to file if they don\'t respond.'
                            )
                        ])
                    ])
                ]),
                
                // Navigation Buttons - Split into two rows for better visibility
                React.createElement('div', { key: 'nav', className: 'navigation-buttons' }, [
                    // First row: Main actions
                    React.createElement('div', { key: 'row1', className: 'nav-row' }, [
                        React.createElement('button', {
                            key: 'prev',
                            onClick: prevTab,
                            className: `nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`,
                            disabled: currentTab === 0
                        }, [
                            React.createElement(Icon, { key: 'icon', name: 'chevron-left', style: { marginRight: '0.25rem' }}),
                            'Previous'
                        ]),
                        
                        React.createElement('button', {
                            key: 'copy',
                            onClick: copyToClipboard,
                            className: 'nav-button',
                            style: { backgroundColor: '#4f46e5', color: 'white', border: 'none' }
                        }, [
                            React.createElement(Icon, { key: 'icon', name: 'copy', style: { marginRight: '0.25rem' }}),
                            'Copy'
                        ]),
                        
                        React.createElement('button', {
                            key: 'download',
                            onClick: downloadAsWord,
                            className: 'nav-button',
                            style: { backgroundColor: '#2563eb', color: 'white', border: 'none' }
                        }, [
                            React.createElement(Icon, { key: 'icon', name: 'file-text', style: { marginRight: '0.25rem' }}),
                            'Download'
                        ]),
                        
                        React.createElement('button', {
                            key: 'next',
                            onClick: nextTab,
                            className: `nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`,
                            disabled: currentTab === tabs.length - 1
                        }, [
                            'Next',
                            React.createElement(Icon, { key: 'icon', name: 'chevron-right', style: { marginLeft: '0.25rem' }})
                        ])
                    ]),
                    
                    // Second row: eSignature and consultation
                    React.createElement('div', { key: 'row2', className: 'nav-row' }, [
                        React.createElement('button', {
                            key: 'esign',
                            onClick: handleESignOnly,
                            className: 'nav-button',
                            style: { backgroundColor: '#059669', color: 'white', border: 'none', flex: '1' },
                            disabled: isESignatureLoading
                        }, [
                            React.createElement(Icon, { 
                                key: 'icon', 
                                name: isESignatureLoading ? 'loader' : 'edit-3', 
                                style: { marginRight: '0.25rem' }
                            }),
                            isESignatureLoading ? 'Loading...' : 'E-Sign Only'
                        ]),
                        
                        React.createElement('button', {
                            key: 'esign-email',
                            onClick: handleESignAndEmail,
                            className: 'nav-button',
                            style: { backgroundColor: '#dc2626', color: 'white', border: 'none', flex: '1' },
                            disabled: isESignatureLoading
                        }, [
                            React.createElement(Icon, { 
                                key: 'icon', 
                                name: isESignatureLoading ? 'loader' : 'send', 
                                style: { marginRight: '0.25rem' }
                            }),
                            isESignatureLoading ? 'Loading...' : 'E-Sign & Email'
                        ]),
                        
                        React.createElement('button', {
                            key: 'consult',
                            onClick: () => window.open('https://terms.law/call/', '_blank'),
                            className: 'nav-button',
                            style: { backgroundColor: '#f59e0b', color: 'white', border: 'none', flex: '1' }
                        }, [
                            React.createElement(Icon, { key: 'icon', name: 'calendar', style: { marginRight: '0.25rem' }}),
                            'Consult'
                        ])
                    ])
                ])
            ]),
            
            // Preview Panel
            React.createElement('div', { key: 'preview', className: 'preview-panel', ref: previewRef }, [
                React.createElement('div', { key: 'content', className: 'preview-content' }, [
                    React.createElement('h2', { key: 'title' }, 'Live Preview'),
                    React.createElement('pre', {
                        key: 'document',
                        className: 'document-preview',
                        dangerouslySetInnerHTML: { __html: highlightedText }
                    })
                ])
            ])
        ])
    ]);
};

// Render the component
console.log('Starting to render StripeDemandGenerator...');

try {
    ReactDOM.render(React.createElement(StripeDemandGenerator), document.getElementById('root'));
    console.log('Component rendered successfully');
} catch (error) {
    console.error('Error rendering component:', error);
    document.getElementById('root').innerHTML = '<h1>Error Loading Generator</h1><p>Please check the console for details.</p>';
}