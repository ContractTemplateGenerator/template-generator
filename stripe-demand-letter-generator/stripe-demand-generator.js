// Stripe Demand Letter Generator - React Component
const { useState, useRef, useEffect } = React;

// Icon component
const Icon = ({ name, style = {} }) => React.createElement('i', {
    'data-feather': name,
    style: style
});

// Main Generator Component
const StripeDemandGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const previewRef = useRef(null);
    
    // Form data state
    const [formData, setFormData] = useState({
        // Tab 1: Account & Situation Details
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
        historicalDisputeRate: '',        
        // Tab 2: Stripe's Stated Reasons
        highRisk: false,
        elevatedDispute: false,
        policyViolation: false,
        riskAssessment: false,
        chargebackLiability: false,
        accountReview: false,
        businessModelIssue: false,
        customReason: false,
        customReasonText: '',
        
        // Tab 4: Supporting Evidence
        lowChargebacks: false,
        compliantPractices: false,
        customerSatisfaction: false,
        fullDisclosure: false,
        shiftingDeadlines: false,
        businessDamages: false,
        
        // Tab 5: Legal Strategy & Timeline
        responseDeadline: 14,
        includeArbitrationDraft: true,
        expeditedProcedures: false
    });

    // Tab configuration
    const tabs = [
        { id: 'account', label: 'Account Details' },
        { id: 'reasons', label: 'Stripe\'s Reasons' },
        { id: 'violations', label: 'SSA Violations' },
        { id: 'evidence', label: 'Evidence' },
        { id: 'assessment', label: 'Risk Assessment' }
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

    // Calculate auto-selected legal claims based on user's situation
    const getAutoSelectedClaims = () => {
        const claims = [];
        const violations = [];
        
        // Always include these basic claims for fund withholding
        claims.push('Breach of Contract');
        claims.push('Conversion (wrongful retention of funds)');
        claims.push('Breach of Implied Covenant of Good Faith and Fair Dealing');
        claims.push('Violation of California Business & Professions Code § 17200');
        
        // Determine specific SSA violations
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            violations.push('Withholding beyond promised release date');
        }
        
        if (formData.highRisk && !formData.historicalDisputeRate) {
            violations.push('Arbitrary "high risk" designation without evidence');
        }
        
        if (formData.shiftingDeadlines) {
            violations.push('Continuously extending hold periods without justification');
        }
        
        return { claims, violations };
    };

    // Calculate dates for legal strategy
    const calculateDates = () => {
        const today = new Date();
        const responseDate = new Date(today);
        responseDate.setDate(responseDate.getDate() + formData.responseDeadline);
        
        const arbitrationDate = new Date(today);
        arbitrationDate.setDate(arbitrationDate.getDate() + 30); // 30-day notice requirement
        
        return {
            letterDate: today.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            responseDate: responseDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            arbitrationDate: arbitrationDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
    };

    // Generate the demand letter document
    const generateDemandLetter = () => {
        const dates = calculateDates();
        const { claims, violations } = getAutoSelectedClaims();
        
        // Build reasons list
        const reasons = [];
        if (formData.highRisk) reasons.push('designated as "high risk" without specific evidence');
        if (formData.elevatedDispute) reasons.push('claimed elevated dispute rate');
        if (formData.policyViolation) reasons.push('alleged policy violations without specifics');
        if (formData.riskAssessment) reasons.push('ongoing risk assessment without timeline');
        if (formData.chargebackLiability) reasons.push('ongoing chargeback liability concerns');
        if (formData.accountReview) reasons.push('account review in progress');
        if (formData.businessModelIssue) reasons.push('business model concerns');
        if (formData.customReason && formData.customReasonText) reasons.push(formData.customReasonText);
        
        // Build evidence list
        const evidence = [];
        if (formData.lowChargebacks) evidence.push('low historical chargeback rate');
        if (formData.compliantPractices) evidence.push('documented compliant business practices');
        if (formData.customerSatisfaction) evidence.push('customer satisfaction metrics');
        if (formData.fullDisclosure) evidence.push('full business model disclosure during onboarding');
        if (formData.shiftingDeadlines) evidence.push('documentation of shifting payout deadlines');
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

This letter serves as formal notice pursuant to Section 13.3(a) of the Stripe Services Agreement ("SSA") of my intent to commence arbitration proceedings against Stripe, Inc. and Stripe Payments Company. I intend to file the attached arbitration demand with the American Arbitration Association on ${dates.arbitrationDate} unless this matter is resolved before that date.

I am writing regarding Stripe's continued withholding of $${formData.withheldAmount || '[AMOUNT]'} in customer payments belonging to ${formData.companyName || '[COMPANY NAME]'}. Despite ${formData.promisedReleaseDate ? `your promise to release funds by ${formData.promisedReleaseDate}` : 'the passage of significant time since account termination'}, your company continues to hold these funds without providing any reasonable timeline for release.

FACTUAL BACKGROUND

On ${formData.terminationDate || '[DATE]'}, Stripe terminated my merchant account, citing only ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'} without identifying any specific violations of your Services Agreement. ${formData.promisedReleaseDate ? `At the time, Stripe promised to release the withheld funds by ${formData.promisedReleaseDate}.` : ''}

${formData.companyName || '[COMPANY NAME]'} operated as a ${formData.businessType || '[BUSINESS TYPE]'} business for ${formData.processingHistory || '[DURATION]'} with Stripe, maintaining ${formData.historicalDisputeRate ? `a dispute rate of ${formData.historicalDisputeRate}%` : 'a clean processing history'} throughout our relationship.

In the ${Math.ceil((new Date() - new Date(formData.terminationDate || new Date())) / (1000 * 60 * 60 * 24)) || '[NUMBER]'} days since termination, Stripe has failed to:
- Provide specific justification for the continued withholding beyond general references to "risk"
- Establish any concrete timeline for releasing the held funds
- Identify any specific Service Agreement violations that would justify indefinite withholding
${violations.length > 0 ? violations.map(v => `- ${v}`).join('\n') : ''}

LEGAL CLAIMS

Stripe's actions constitute multiple breaches of the SSA, including but not limited to:

1. BREACH OF CONTRACT: Stripe has materially breached the SSA by withholding funds for an unreasonable period without contractual authority and by failing to process promised payment releases within stated timeframes.

2. CONVERSION: Stripe has wrongfully exercised dominion over $${formData.withheldAmount || '[AMOUNT]'} belonging to ${formData.companyName || '[COMPANY NAME]'}, depriving us of our rightful property beyond any reasonable period necessary for risk management.

3. BREACH OF IMPLIED COVENANT OF GOOD FAITH AND FAIR DEALING: Even where the SSA grants Stripe discretion, it must be exercised in good faith. Stripe's arbitrary withholding of funds without substantial justification violates this fundamental contractual obligation.

4. VIOLATION OF CALIFORNIA BUSINESS & PROFESSIONS CODE § 17200: Stripe's systematic withholding of merchant funds without clear contractual authority constitutes an unfair business practice under California law.

SUPPORTING EVIDENCE

${evidence.length > 0 ? `Our position is supported by the following evidence:
${evidence.map(item => `- ${item}`).join('\n')}` : 'We have documented evidence supporting our position, including our clean processing history and Stripe\'s failure to provide specific justification for the continued hold.'}

DEMAND FOR RESOLUTION

To resolve this matter without proceeding to arbitration, I demand the following:

1. Immediate release of the $${formData.withheldAmount || '[AMOUNT]'} in withheld funds
2. Accounting of any interest earned on these funds while held by Stripe
3. Written confirmation of the release timeline

If I do not receive a satisfactory response by ${dates.responseDate}, I will proceed with filing the attached arbitration demand upon the expiration of the 30-day notice period required by Section 13.3(a) of the SSA.

I look forward to your prompt attention to this matter.

Sincerely,

${formData.contactName || '[CONTACT NAME]'}
${formData.companyName || '[COMPANY NAME]'}

${formData.includeArbitrationDraft ? '\nEnclosure: Draft Arbitration Demand' : ''}`;
    };

    // Get current document text
    const documentText = generateDemandLetter();

    // Copy to clipboard function
    const copyToClipboard = () => {
        navigator.clipboard.writeText(documentText).then(() => {
            alert('Demand letter copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try selecting and copying manually.');
        });
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
                documentTitle: "Stripe Demand Letter",
                fileName: `${formData.companyName ? formData.companyName.replace(/[^a-zA-Z0-9]/g, '-') : 'Stripe'}-Demand-Letter`
            });
        } catch (error) {
            console.error("Error in downloadAsWord:", error);
            alert("Error generating Word document. Please try again or use the copy option.");
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

    // Highlighting functionality
    const getSectionToHighlight = () => {
        switch (currentTab) {
            case 0: // Account Details
                if (['companyName', 'contactName', 'stripeAccountId', 'withheldAmount'].includes(lastChanged)) {
                    return 'header';
                }
                if (['terminationDate', 'promisedReleaseDate'].includes(lastChanged)) {
                    return 'background';
                }
                return null;
            case 1: // Stripe's Reasons
                if (lastChanged && formData[lastChanged]) {
                    return 'background';
                }
                return null;
            case 3: // Evidence
                if (lastChanged && formData[lastChanged]) {
                    return 'evidence';
                }
                return null;
            default:
                return null;
        }
    };

    // Create highlighted version of the text
    const createHighlightedText = () => {
        const sectionToHighlight = getSectionToHighlight();
        if (!sectionToHighlight) return documentText;
        
        let highlightedText = documentText;
        
        // Define regex patterns for different sections
        const sections = {
            header: /Re:.*?\n\nTo Whom It May Concern:/s,
            background: /FACTUAL BACKGROUND.*?(?=LEGAL CLAIMS)/s,
            evidence: /SUPPORTING EVIDENCE.*?(?=DEMAND FOR RESOLUTION)/s
        };
        
        if (sections[sectionToHighlight]) {
            highlightedText = documentText.replace(sections[sectionToHighlight], match => 
                `<span class="highlighted-text">${match}</span>`
            );
        }
        
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
            
            // Clear highlighting after 3 seconds
            setTimeout(() => setLastChanged(null), 3000);
        }
    }, [lastChanged]);

    const highlightedText = createHighlightedText();

    // Risk Assessment
    const getRiskAssessment = () => {
        let score = 0;
        let factors = [];
        
        // Positive factors
        if (formData.historicalDisputeRate && parseFloat(formData.historicalDisputeRate) < 1.0) {
            score += 20;
            factors.push('Low historical dispute rate strengthens your position');
        }
        
        if (formData.lowChargebacks && formData.compliantPractices) {
            score += 20;
            factors.push('Documented compliance history supports good faith claims');
        }
        
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            score += 25;
            factors.push('Missed promised release date creates strong breach of contract claim');
        }
        
        if (formData.shiftingDeadlines) {
            score += 15;
            factors.push('Pattern of shifting deadlines supports bad faith argument');
        }
        
        if (formData.withheldAmount && parseFloat(formData.withheldAmount.replace(/[^\d.]/g, '')) < 25000) {
            score += 10;
            factors.push('Amount qualifies for AAA expedited procedures (lower cost)');
        }
        
        // Negative factors
        if (formData.highRisk && !formData.lowChargebacks) {
            score -= 15;
            factors.push('High-risk designation without counter-evidence weakens position');
        }
        
        if (!formData.processingHistory || formData.processingHistory.includes('month')) {
            score -= 10;
            factors.push('Short processing history may support Stripe\'s risk concerns');
        }
        
        // Determine risk level
        let riskLevel, riskClass, recommendations;
        
        if (score >= 60) {
            riskLevel = 'Strong Case';
            riskClass = 'risk-strong';
            recommendations = [
                'High probability of successful fund recovery',
                'Consider sending demand letter immediately',
                'Prepare for expedited arbitration if under $25K',
                'Document all communications from Stripe'
            ];
        } else if (score >= 30) {
            riskLevel = 'Moderate Case';
            riskClass = 'risk-moderate';
            recommendations = [
                'Reasonable chance of recovery with proper documentation',
                'Strengthen evidence before sending demand letter',
                'Consider consulting with attorney for strategy',
                'Be prepared for longer arbitration process'
            ];
        } else {
            riskLevel = 'Challenging Case';
            riskClass = 'risk-weak';
            recommendations = [
                'Uphill battle but not impossible',
                'Focus on Stripe\'s procedural failures rather than business merits',
                'Strongly consider attorney representation',
                'Prepare for full arbitration proceedings'
            ];
        }
        
        return { riskLevel, riskClass, factors, recommendations, score };
    };

    // Render function
    return (
        React.createElement('div', { className: 'app-container' },
            React.createElement('div', { className: 'header' },
                React.createElement('h1', null, 'Stripe Demand Letter Generator'),
                React.createElement('p', null, 'Generate a professional demand letter with 30-day arbitration notice')
            ),
            
            React.createElement('div', { className: 'main-content' },
                React.createElement('div', { className: 'form-panel' },
                    // Tab Navigation
                    React.createElement('div', { className: 'tab-navigation' },
                        tabs.map((tab, index) => 
                            React.createElement('button', {
                                key: tab.id,
                                className: `tab-button ${currentTab === index ? 'active' : ''}`,
                                onClick: () => goToTab(index)
                            }, `${index + 1}. ${tab.label}`)
                        )
                    ),
                    
                    // Form Content
                    React.createElement('div', { className: 'form-content' },
                        // Tab 1: Account & Situation Details
                        currentTab === 0 && React.createElement('div', null,
                            React.createElement('h2', null, 'Account & Situation Details'),
                            React.createElement('p', null, 'Provide your business information and Stripe account details.'),
                            
                            React.createElement('div', { className: 'form-row' },
                                React.createElement('div', { className: 'form-group' },
                                    React.createElement('label', null, 'Company Name *'),
                                    React.createElement('input', {
                                        type: 'text',
                                        name: 'companyName',
                                        value: formData.companyName,
                                        onChange: handleChange,
                                        placeholder: 'Your Business Name',
                                        required: true
                                    })
                                ),
                                React.createElement('div', { className: 'form-group' },
                                    React.createElement('label', null, 'Contact Person *'),
                                    React.createElement('input', {
                                        type: 'text',
                                        name: 'contactName',
                                        value: formData.contactName,
                                        onChange: handleChange,
                                        placeholder: 'Your Name',
                                        required: true
                                    })
                                )
                            ),
                            
                            React.createElement('div', { className: 'form-row' },
                                React.createElement('div', { className: 'form-group' },
                                    React.createElement('label', null, 'Stripe Account ID *'),
                                    React.createElement('input', {
                                        type: 'text',
                                        name: 'stripeAccountId',
                                        value: formData.stripeAccountId,
                                        onChange: handleChange,
                                        placeholder: 'acct_1234567890',
                                        required: true
                                    })
                                ),
                                React.createElement('div', { className: 'form-group' },
                                    React.createElement('label', null, 'Amount Withheld *'),
                                    React.createElement('input', {
                                        type: 'text',
                                        name: 'withheldAmount',
                                        value: formData.withheldAmount,
                                        onChange: handleChange,
                                        placeholder: '25,000',
                                        required: true
                                    })
                                )
                            ),
                            
                            React.createElement('div', { className: 'form-row' },
                                React.createElement('div', { className: 'form-group' },
                                    React.createElement('label', null, 'Account Termination Date'),
                                    React.createElement('input', {
                                        type: 'date',
                                        name: 'terminationDate',
                                        value: formData.terminationDate,
                                        onChange: handleChange
                                    })
                                ),
                                React.createElement('div', { className: 'form-group' },
                                    React.createElement('label', null, 'Promised Release Date (if any)'),
                                    React.createElement('input', {
                                        type: 'date',
                                        name: 'promisedReleaseDate',
                                        value: formData.promisedReleaseDate,
                                        onChange: handleChange
                                    })
                                )
                            )
                        ),
                        
                        // Simplified display for other tabs
                        currentTab === 1 && React.createElement('div', null,
                            React.createElement('h2', null, 'Stripe\'s Stated Reasons'),
                            React.createElement('p', null, 'Check the reasons Stripe gave for withholding your funds:'),
                            React.createElement('label', null,
                                React.createElement('input', {
                                    type: 'checkbox',
                                    name: 'highRisk',
                                    checked: formData.highRisk,
                                    onChange: handleChange
                                }),
                                ' "High Risk" Business Designation'
                            )
                        ),
                        
                        currentTab === 2 && React.createElement('div', null,
                            React.createElement('h2', null, 'Legal Claims (Auto-Selected)'),
                            React.createElement('p', null, 'These claims will be automatically included in your letter:'),
                            React.createElement('ul', null,
                                React.createElement('li', null, 'Breach of Contract'),
                                React.createElement('li', null, 'Conversion (wrongful retention)'),
                                React.createElement('li', null, 'Breach of Implied Covenant of Good Faith'),
                                React.createElement('li', null, 'CA Business & Professions Code § 17200')
                            )
                        ),
                        
                        currentTab === 3 && React.createElement('div', null,
                            React.createElement('h2', null, 'Supporting Evidence'),
                            React.createElement('label', null,
                                React.createElement('input', {
                                    type: 'checkbox',
                                    name: 'lowChargebacks',
                                    checked: formData.lowChargebacks,
                                    onChange: handleChange
                                }),
                                ' Low Historical Chargeback Rate'
                            )
                        ),
                        
                        currentTab === 4 && React.createElement('div', null,
                            React.createElement('h2', null, 'Risk Assessment'),
                            React.createElement('div', { className: `risk-card ${getRiskAssessment().riskClass}` },
                                React.createElement('h3', null, `${getRiskAssessment().riskLevel} (Score: ${getRiskAssessment().score}/100)`),
                                React.createElement('p', null, 'Based on your inputs, this is your case assessment.')
                            )
                        )
                    ),
                    
                    // Navigation Buttons
                    React.createElement('div', { className: 'navigation-buttons' },
                        React.createElement('button', {
                            onClick: prevTab,
                            className: `nav-button ${currentTab === 0 ? 'disabled' : ''}`,
                            disabled: currentTab === 0
                        }, 'Previous'),
                        
                        React.createElement('div', { style: { display: 'flex', gap: '10px' } },
                            React.createElement('button', {
                                onClick: copyToClipboard,
                                className: 'nav-button',
                                style: {
                                    backgroundColor: "#4f46e5", 
                                    color: "white",
                                    border: "none"
                                }
                            }, 'Copy to Clipboard'),
                            
                            React.createElement('button', {
                                onClick: downloadAsWord,
                                className: 'nav-button',
                                style: {
                                    backgroundColor: "#2563eb", 
                                    color: "white",
                                    border: "none"
                                }
                            }, 'Download MS Word'),
                            
                            React.createElement('button', {
                                onClick: () => {
                                    if (typeof Calendly !== 'undefined' && Calendly.initPopupWidget) {
                                        Calendly.initPopupWidget({
                                            url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
                                        });
                                    } else {
                                        window.open('https://terms.law/call/', '_blank');
                                    }
                                },
                                className: 'consultation-button',
                                style: {
                                    backgroundColor: "#28a745", 
                                    color: "white",
                                    border: "none"
                                }
                            }, 'Schedule Consultation')
                        ),
                        
                        React.createElement('button', {
                            onClick: nextTab,
                            className: `nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`,
                            disabled: currentTab === tabs.length - 1
                        }, 'Next')
                    )
                ),
                
                // Preview Panel
                React.createElement('div', { className: 'preview-panel' },
                    React.createElement('div', { className: 'preview-content' },
                        React.createElement('div', { className: 'preview-header' },
                            React.createElement('h2', null, 'Live Preview'),
                            React.createElement('p', { className: 'preview-text' }, 'Your demand letter with 30-day arbitration notice')
                        ),
                        React.createElement('div', { 
                            ref: previewRef, 
                            className: 'document-preview',
                            dangerouslySetInnerHTML: { 
                                __html: highlightedText.replace(/\n/g, '<br>') 
                            }
                        })
                    )
                )
            )
        )
    );
};

// Render the component
ReactDOM.render(React.createElement(StripeDemandGenerator), document.getElementById('root'));