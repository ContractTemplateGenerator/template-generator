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

        const daysSinceTermination = formData.terminationDate ? 
            Math.ceil((new Date() - new Date(formData.terminationDate)) / (1000 * 60 * 60 * 24)) : '[NUMBER]';

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

${formData.companyName || '[COMPANY NAME]'} operated as a ${formData.businessType || '[BUSINESS TYPE]'} business for ${formData.processingHistory || '[PROCESSING HISTORY]'} with Stripe, maintaining ${formData.historicalDisputeRate ? `a dispute rate of ${formData.historicalDisputeRate}%` : 'a clean processing history'} throughout our relationship.

In the ${daysSinceTermination} days since termination, Stripe has failed to:
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
                        
                        React.createElement('div', { key: 'address', className: 'form-group' }, [
                            React.createElement('label', { key: 'label' }, 'Business Address *'),
                            React.createElement('input', {
                                key: 'input',
                                type: 'text',
                                name: 'address',
                                value: formData.address,
                                onChange: handleChange,
                                placeholder: 'Street Address'
                            })
                        ]),
                        
                        React.createElement('div', { key: 'row3', className: 'form-row' }, [
                            React.createElement('div', { key: 'city', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'City *'),
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
                                }, [
                                    React.createElement('option', { key: 'ca', value: 'CA' }, 'California'),
                                    React.createElement('option', { key: 'ny', value: 'NY' }, 'New York'),
                                    React.createElement('option', { key: 'tx', value: 'TX' }, 'Texas'),
                                    React.createElement('option', { key: 'fl', value: 'FL' }, 'Florida'),
                                    React.createElement('option', { key: 'other', value: 'Other' }, 'Other')
                                ])
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
                                React.createElement('label', { key: 'label' }, 'Account Termination Date'),
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
                        ])
                    ]),
                    
                    // Tab 2: Stripe's Reasons
                    currentTab === 1 && React.createElement('div', { key: 'tab2' }, [
                        React.createElement('h2', { key: 'h2' }, 'Stripe\'s Stated Reasons'),
                        React.createElement('p', { key: 'p' }, 'Select the reasons Stripe has given for withholding your funds.'),
                        
                        React.createElement('div', { key: 'checkboxes', className: 'checkbox-grid' }, [
                            React.createElement('div', { 
                                key: 'highrisk',
                                className: `checkbox-item ${formData.highRisk ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'highRisk', type: 'checkbox', checked: !formData.highRisk }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'highRisk',
                                    checked: formData.highRisk,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, '"High Risk" Business Designation'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Stripe labeled your business as high risk without providing specific evidence.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'dispute',
                                className: `checkbox-item ${formData.elevatedDispute ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'elevatedDispute', type: 'checkbox', checked: !formData.elevatedDispute }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'elevatedDispute',
                                    checked: formData.elevatedDispute,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Elevated Dispute Rate'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Claimed your chargeback rate was too high without providing actual numbers.')
                                ])
                            ])
                        ])
                    ]),
                    
                    // Tab 3: SSA Violations
                    currentTab === 2 && React.createElement('div', { key: 'tab3' }, [
                        React.createElement('h2', { key: 'h2' }, 'SSA Violations (Auto-Selected)'),
                        React.createElement('p', { key: 'p' }, 'These legal claims will be automatically included:'),
                        
                        React.createElement('div', { key: 'claims', className: 'risk-card risk-strong' }, [
                            React.createElement('h3', { key: 'h3' }, 'Legal Claims'),
                            React.createElement('ul', { key: 'ul' }, 
                                getAutoSelectedClaims().claims.map((claim, index) => 
                                    React.createElement('li', { key: index }, claim)
                                )
                            )
                        ])
                    ]),
                    
                    // Tab 4: Evidence  
                    currentTab === 3 && React.createElement('div', { key: 'tab4' }, [
                        React.createElement('h2', { key: 'h2' }, 'Supporting Evidence'),
                        React.createElement('p', { key: 'p' }, 'Select evidence you have to support your position.'),
                        
                        React.createElement('div', { key: 'checkboxes', className: 'checkbox-grid' }, [
                            React.createElement('div', { 
                                key: 'lowcb',
                                className: `checkbox-item ${formData.lowChargebacks ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'lowChargebacks', type: 'checkbox', checked: !formData.lowChargebacks }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'lowChargebacks',
                                    checked: formData.lowChargebacks,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Low Historical Chargeback Rate'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'You can document chargeback rate below 0.75%.')
                                ])
                            ])
                        ])
                    ]),
                    
                    // Tab 5: Risk Assessment
                    currentTab === 4 && React.createElement('div', { key: 'tab5' }, [
                        React.createElement('h2', { key: 'h2' }, 'Risk Assessment'),
                        React.createElement('p', { key: 'p' }, 'Analysis of your case strength:'),
                        
                        (() => {
                            const assessment = getRiskAssessment();
                            return React.createElement('div', { key: 'assessment', className: `risk-card ${assessment.riskClass}` }, [
                                React.createElement('h3', { key: 'h3' }, `${assessment.riskLevel} (Score: ${assessment.score}/100)`),
                                React.createElement('ul', { key: 'factors' }, 
                                    assessment.factors.map((factor, index) => 
                                        React.createElement('li', { key: index }, factor)
                                    )
                                )
                            ]);
                        })()
                    ])
                ]),
                
                // Navigation Buttons
                React.createElement('div', { key: 'nav', className: 'navigation-buttons' }, [
                    React.createElement('button', {
                        key: 'prev',
                        onClick: prevTab,
                        className: `nav-button ${currentTab === 0 ? 'disabled' : ''}`,
                        disabled: currentTab === 0
                    }, 'Previous'),
                    
                    React.createElement('div', { key: 'middle', style: { display: 'flex', gap: '10px' } }, [
                        React.createElement('button', {
                            key: 'copy',
                            onClick: copyToClipboard,
                            className: 'nav-button',
                            style: { backgroundColor: "#4f46e5", color: "white", border: "none" }
                        }, 'Copy to Clipboard'),
                        
                        React.createElement('button', {
                            key: 'download',
                            onClick: downloadAsWord,
                            className: 'nav-button',
                            style: { backgroundColor: "#2563eb", color: "white", border: "none" }
                        }, 'Download MS Word'),
                        
                        React.createElement('a', {
                            key: 'consult',
                            href: 'https://terms.law/call/',
                            target: '_blank',
                            className: 'nav-button consultation-button',
                            style: { backgroundColor: "#28a745", color: "white", border: "none", textDecoration: 'none' }
                        }, 'Schedule Consultation')
                    ]),
                    
                    React.createElement('button', {
                        key: 'next',
                        onClick: nextTab,
                        className: `nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`,
                        disabled: currentTab === tabs.length - 1
                    }, 'Next')
                ])
            ]),
            
            // Preview Panel
            React.createElement('div', { key: 'preview', className: 'preview-panel' }, [
                React.createElement('div', { key: 'content', className: 'preview-content' }, [
                    React.createElement('div', { key: 'header', className: 'preview-header' }, [
                        React.createElement('h2', { key: 'title' }, 'Live Preview'),
                        React.createElement('p', { key: 'subtitle', className: 'preview-text' }, 'Your demand letter with 30-day arbitration notice')
                    ]),
                    React.createElement('div', { 
                        key: 'document',
                        ref: previewRef,
                        className: 'document-preview',
                        dangerouslySetInnerHTML: { 
                            __html: highlightedText.replace(/\n/g, '<br>') 
                        }
                    })
                ])
            ])
        ])
    ]);
};

// Render the component
console.log('Starting to render StripeDemandGenerator...');
console.log('React available:', typeof React);
console.log('ReactDOM available:', typeof ReactDOM);

try {
    ReactDOM.render(React.createElement(StripeDemandGenerator), document.getElementById('root'));
    console.log('Component rendered successfully');
} catch (error) {
    console.error('Error rendering component:', error);
    document.getElementById('root').innerHTML = '<h1>Error Loading Generator</h1><p>Please check the console for details.</p>';
}