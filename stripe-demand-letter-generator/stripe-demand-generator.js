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
        
        // Tab 3: SSA Violations (auto-selected based on situation)
        // These will be calculated automatically
        
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
        
        // Add CA Business & Professions Code claim for unfair practices
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

        return `${formData.companyName}
${formData.address}
${formData.city}, ${formData.state} ${formData.zipCode}
${formData.phone}
${formData.email}

${dates.letterDate}

VIA CERTIFIED MAIL & EMAIL
complaints@stripe.com

Legal Department
Stripe, Inc.
354 Oyster Point Boulevard
South San Francisco, CA 94080

Re: ${formData.companyName} - Demand for Release of Withheld Funds
    Account ID: ${formData.stripeAccountId}
    Amount at Issue: $${formData.withheldAmount}

To Whom It May Concern:

This letter serves as formal notice pursuant to Section 13.3(a) of the Stripe Services Agreement ("SSA") of my intent to commence arbitration proceedings against Stripe, Inc. and Stripe Payments Company. I intend to file the attached arbitration demand with the American Arbitration Association on ${dates.arbitrationDate} unless this matter is resolved before that date.

I am writing regarding Stripe's continued withholding of $${formData.withheldAmount} in customer payments belonging to ${formData.companyName}. Despite ${formData.promisedReleaseDate ? `your promise to release funds by ${formData.promisedReleaseDate}` : 'the passage of significant time since account termination'}, your company continues to hold these funds without providing any reasonable timeline for release.

FACTUAL BACKGROUND

On ${formData.terminationDate || '[DATE]'}, Stripe terminated my merchant account, citing only ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'} without identifying any specific violations of your Services Agreement. ${formData.promisedReleaseDate ? `At the time, Stripe promised to release the withheld funds by ${formData.promisedReleaseDate}.` : ''}

${formData.companyName} operated as a ${formData.businessType} business for ${formData.processingHistory} with Stripe, maintaining ${formData.historicalDisputeRate ? `a dispute rate of ${formData.historicalDisputeRate}%` : 'a clean processing history'} throughout our relationship.`;
    };
        // Continue the demand letter
        let letter = generateDemandLetter();
        
        letter += `

In the ${Math.ceil((new Date() - new Date(formData.terminationDate || new Date())) / (1000 * 60 * 60 * 24)) || '[NUMBER]'} days since termination, Stripe has failed to:
- Provide specific justification for the continued withholding beyond general references to "risk"
- Establish any concrete timeline for releasing the held funds
- Identify any specific Service Agreement violations that would justify indefinite withholding
${violations.length > 0 ? `- ${violations.join('\n- ')}` : ''}

LEGAL CLAIMS

Stripe's actions constitute multiple breaches of the SSA, including but not limited to:

1. BREACH OF CONTRACT: Stripe has materially breached the SSA by withholding funds for an unreasonable period without contractual authority and by failing to process promised payment releases within stated timeframes.

2. CONVERSION: Stripe has wrongfully exercised dominion over $${formData.withheldAmount} belonging to ${formData.companyName}, depriving us of our rightful property beyond any reasonable period necessary for risk management.

3. BREACH OF IMPLIED COVENANT OF GOOD FAITH AND FAIR DEALING: Even where the SSA grants Stripe discretion, it must be exercised in good faith. Stripe's arbitrary withholding of funds without substantial justification violates this fundamental contractual obligation.

4. VIOLATION OF CALIFORNIA BUSINESS & PROFESSIONS CODE § 17200: Stripe's systematic withholding of merchant funds without clear contractual authority constitutes an unfair business practice under California law.

SUPPORTING EVIDENCE

${evidence.length > 0 ? `Our position is supported by the following evidence:
${evidence.map(item => `- ${item}`).join('\n')}` : 'We have documented evidence supporting our position, including our clean processing history and Stripe\'s failure to provide specific justification for the continued hold.'}

DEMAND FOR RESOLUTION

To resolve this matter without proceeding to arbitration, I demand the following:

1. Immediate release of the $${formData.withheldAmount} in withheld funds
2. Accounting of any interest earned on these funds while held by Stripe
3. Written confirmation of the release timeline

If I do not receive a satisfactory response by ${calculateDates().responseDate}, I will proceed with filing the attached arbitration demand upon the expiration of the 30-day notice period required by Section 13.3(a) of the SSA.

I look forward to your prompt attention to this matter.

Sincerely,

${formData.contactName}
${formData.companyName}

${formData.includeArbitrationDraft ? '\nEnclosure: Draft Arbitration Demand' : ''}`;
        return letter;
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
        <div className="app-container">
            <div className="header">
                <h1>Stripe Demand Letter Generator</h1>
                <p>Generate a professional demand letter with 30-day arbitration notice</p>
            </div>
            
            <div className="main-content">
                <div className="form-panel">
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
                    
                    {/* Form Content */}
                    <div className="form-content">
                        {/* Tab 1: Account & Situation Details */}
                        {currentTab === 0 && (
                            <div>
                                <h2>Account & Situation Details</h2>
                                <p>Provide your business information and Stripe account details.</p>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Your Business Name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Person *</label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Business Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street Address"
                                        required
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        >
                                            <option value="CA">California</option>
                                            <option value="NY">New York</option>
                                            <option value="TX">Texas</option>
                                            <option value="FL">Florida</option>
                                            <option value="IL">Illinois</option>
                                            <option value="WA">Washington</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            placeholder="12345"
                                        />
                                    </div>
                                </div>
                                
                                <div className="tip-box info">
                                    <div className="tip-title">
                                        <Icon name="info" />
                                        Stripe Account Information
                                    </div>
                                    <p>This information is crucial for identifying your specific account and establishing the timeline for legal action.</p>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Stripe Account ID *</label>
                                        <input
                                            type="text"
                                            name="stripeAccountId"
                                            value={formData.stripeAccountId}
                                            onChange={handleChange}
                                            placeholder="acct_1234567890"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Amount Withheld *</label>
                                        <input
                                            type="text"
                                            name="withheldAmount"
                                            value={formData.withheldAmount}
                                            onChange={handleChange}
                                            placeholder="25,000"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Account Termination Date</label>
                                        <input
                                            type="date"
                                            name="terminationDate"
                                            value={formData.terminationDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Promised Release Date (if any)</label>
                                        <input
                                            type="date"
                                            name="promisedReleaseDate"
                                            value={formData.promisedReleaseDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Business Type</label>
                                        <select
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Business Type</option>
                                            <option value="e-commerce">E-commerce</option>
                                            <option value="SaaS">Software as a Service</option>
                                            <option value="consulting">Consulting</option>
                                            <option value="digital services">Digital Services</option>
                                            <option value="subscription">Subscription Service</option>
                                            <option value="marketplace">Marketplace</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Processing History with Stripe</label>
                                        <select
                                            name="processingHistory"
                                            value={formData.processingHistory}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Duration</option>
                                            <option value="less than 6 months">Less than 6 months</option>
                                            <option value="6 months to 1 year">6 months to 1 year</option>
                                            <option value="1-2 years">1-2 years</option>
                                            <option value="2-3 years">2-3 years</option>
                                            <option value="over 3 years">Over 3 years</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Historical Dispute Rate (if known)</label>
                                    <input
                                        type="text"
                                        name="historicalDisputeRate"
                                        value={formData.historicalDisputeRate}
                                        onChange={handleChange}
                                        placeholder="0.5% (leave blank if unknown)"
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Tab 2: Stripe's Stated Reasons */}
                        {currentTab === 1 && (
                            <div>
                                <h2>Stripe's Stated Reasons</h2>
                                <p>Select the reasons Stripe has given for withholding your funds. The generator will create specific responses to each.</p>
                                
                                <div className="checkbox-grid">
                                    <div className={`checkbox-item ${formData.highRisk ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="highRisk"
                                            checked={formData.highRisk}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">"High Risk" Business Designation</div>
                                            <div className="checkbox-description">
                                                Stripe labeled your business as high risk without providing specific evidence or metrics to support this determination.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.elevatedDispute ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="elevatedDispute"
                                            checked={formData.elevatedDispute}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Elevated Dispute Rate</div>
                                            <div className="checkbox-description">
                                                Claimed your chargeback or dispute rate was too high, possibly without providing actual numbers or industry comparisons.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.policyViolation ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="policyViolation"
                                            checked={formData.policyViolation}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Policy Violation (Unspecified)</div>
                                            <div className="checkbox-description">
                                                Referenced policy violations but failed to identify specific policies or provide concrete examples of violations.
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`checkbox-item ${formData.riskAssessment ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="riskAssessment"
                                            checked={formData.riskAssessment}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Ongoing Risk Assessment</div>
                                            <div className="checkbox-description">
                                                Claimed they are conducting a risk assessment but provided no timeline or criteria for completion.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.chargebackLiability ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="chargebackLiability"
                                            checked={formData.chargebackLiability}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Chargeback Liability Concerns</div>
                                            <div className="checkbox-description">
                                                Holding funds to cover potential future chargebacks, even beyond reasonable chargeback windows (typically 120 days).
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.accountReview ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="accountReview"
                                            checked={formData.accountReview}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Account Review in Progress</div>
                                            <div className="checkbox-description">
                                                Said your account is under review but hasn't provided timeline, specific issues being reviewed, or resolution criteria.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.businessModelIssue ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="businessModelIssue"
                                            checked={formData.businessModelIssue}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Business Model Not Supported</div>
                                            <div className="checkbox-description">
                                                Retroactively decided your business model isn't supported, despite initially approving your account.
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`checkbox-item ${formData.customReason ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="customReason"
                                            checked={formData.customReason}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Custom Reason</div>
                                            <div className="checkbox-description">
                                                Stripe provided a different reason not listed above.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {formData.customReason && (
                                    <div className="form-group">
                                        <label>Describe the Custom Reason</label>
                                        <textarea
                                            name="customReasonText"
                                            value={formData.customReasonText}
                                            onChange={handleChange}
                                            placeholder="Describe Stripe's specific reason for withholding your funds..."
                                            rows="3"
                                        />
                                    </div>
                                )}
                                
                                <div className="tip-box warning">
                                    <div className="tip-title">
                                        <Icon name="alert-triangle" />
                                        Strategy Note
                                    </div>
                                    <p>The generator will create specific legal arguments countering each reason you select. Don't worry about the legal language - that's handled automatically.</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Tab 3: SSA Violations (Auto-Calculated) */}
                        {currentTab === 2 && (
                            <div>
                                <h2>Stripe Services Agreement Violations</h2>
                                <p>Based on your situation, these SSA violations will be automatically included in your demand letter:</p>
                                
                                <div className="tip-box info">
                                    <div className="tip-title">
                                        <Icon name="info" />
                                        Automatic Legal Claims
                                    </div>
                                    <p>The generator automatically selects the most effective legal claims based on your specific situation. You don't need to choose these yourself.</p>
                                </div>
                                <div className="risk-card risk-strong">
                                    <h3>Included Legal Claims</h3>
                                    <ul>
                                        <li><strong>Breach of Contract:</strong> Stripe failed to follow SSA provisions regarding fund processing and release timelines</li>
                                        <li><strong>Conversion:</strong> Wrongful retention of your property (the withheld funds) beyond reasonable business necessity</li>
                                        <li><strong>Breach of Implied Covenant of Good Faith:</strong> Stripe must exercise contractual discretion reasonably and in good faith</li>
                                        <li><strong>CA Business & Professions Code § 17200:</strong> Systematic fund withholding without clear authority constitutes unfair business practice</li>
                                    </ul>
                                </div>
                                
                                {getAutoSelectedClaims().violations.length > 0 && (
                                    <div className="risk-card risk-moderate">
                                        <h3>Specific SSA Violations Based on Your Situation</h3>
                                        <ul>
                                            {getAutoSelectedClaims().violations.map((violation, index) => (
                                                <li key={index}>{violation}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="tip-box info">
                                    <div className="tip-title">
                                        <Icon name="shield" />
                                        Important Note
                                    </div>
                                    <p>Consequential damages are specifically excluded by Stripe's Terms of Service, so this generator focuses on direct damages and restitution claims that are legally viable.</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Tab 4: Supporting Evidence */}
                        {currentTab === 3 && (
                            <div>
                                <h2>Supporting Evidence</h2>
                                <p>Select the evidence you have to support your position. This strengthens your legal claims.</p>
                                
                                <div className="checkbox-grid">
                                    <div className={`checkbox-item ${formData.lowChargebacks ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="lowChargebacks"
                                            checked={formData.lowChargebacks}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Low Historical Chargeback Rate</div>
                                            <div className="checkbox-description">
                                                You can document that your chargeback rate was below industry standards (typically under 0.75%).
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`checkbox-item ${formData.compliantPractices ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="compliantPractices"
                                            checked={formData.compliantPractices}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Documented Compliant Business Practices</div>
                                            <div className="checkbox-description">
                                                You have documentation showing compliance with payment processing standards, clear terms of service, proper product descriptions, etc.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.customerSatisfaction ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="customerSatisfaction"
                                            checked={formData.customerSatisfaction}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Customer Satisfaction Evidence</div>
                                            <div className="checkbox-description">
                                                You have positive reviews, testimonials, or low complaint rates that demonstrate customer satisfaction with your business.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.fullDisclosure ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="fullDisclosure"
                                            checked={formData.fullDisclosure}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Full Business Model Disclosure</div>
                                            <div className="checkbox-description">
                                                You fully disclosed your business model and practices during Stripe's onboarding process, making their retroactive concerns unjustified.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`checkbox-item ${formData.shiftingDeadlines ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="shiftingDeadlines"
                                            checked={formData.shiftingDeadlines}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Documentation of Shifting Payout Deadlines</div>
                                            <div className="checkbox-description">
                                                You have emails or communications showing Stripe repeatedly extending promised payout dates without justification.
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`checkbox-item ${formData.businessDamages ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="businessDamages"
                                            checked={formData.businessDamages}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <div className="checkbox-label">Documented Business Damages</div>
                                            <div className="checkbox-description">
                                                You can show specific business harm caused by the fund withholding (inability to fulfill orders, lost suppliers, emergency financing costs, etc.).
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="tip-box info">
                                    <div className="tip-title">
                                        <Icon name="file-text" />
                                        Evidence Tips
                                    </div>
                                    <p>The more evidence you can select, the stronger your demand letter will be. Each type of evidence will be woven into specific legal arguments automatically.</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Tab 5: Risk Assessment */}
                        {currentTab === 4 && (
                            <div>
                                <h2>Risk Assessment & Strategy</h2>
                                <p>Based on your inputs, here's an analysis of your case strength and recommended approach:</p>
                                
                                {(() => {
                                    const assessment = getRiskAssessment();
                                    return (
                                        <div>
                                            <div className={`risk-card ${assessment.riskClass}`}>
                                                <h3>{assessment.riskLevel} (Score: {assessment.score}/100)</h3>
                                                <p>Based on the information provided, your case has the following characteristics:</p>
                                                <ul className="risk-recommendations">
                                                    {assessment.factors.map((factor, index) => (
                                                        <li key={index}>{factor}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="risk-card risk-strong">
                                                <h3>Recommended Strategy</h3>
                                                <ul className="risk-recommendations">
                                                    {assessment.recommendations.map((rec, index) => (
                                                        <li key={index}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })()}
                                
                                <div className="tip-box info">
                                    <div className="tip-title">
                                        <Icon name="calendar" />
                                        Timeline & Costs
                                    </div>
                                    <p><strong>30-Day Notice Period:</strong> Required before filing arbitration (automatically calculated in your letter)</p>
                                    <p><strong>AAA Filing Fees:</strong> ${formData.withheldAmount && parseFloat(formData.withheldAmount.replace(/[^\d.]/g, '')) < 25000 ? 'Under $2,000 for expedited procedures' : '$2,900+ for standard procedures'}</p>
                                    <p><strong>Expected Timeline:</strong> 60-90 days for expedited cases, 6-12 months for complex cases</p>
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
                            <Icon name="chevron-left" />
                            Previous
                        </button>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={copyToClipboard}
                                className="nav-button"
                                style={{
                                    backgroundColor: "#4f46e5", 
                                    color: "white",
                                    border: "none"
                                }}
                            >
                                <Icon name="copy" />
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
                                <Icon name="file-text" />
                                Download MS Word
                            </button>
                            
                            <button
                                onClick={() => {
                                    window.open('', '_blank').document.write(`
                                        <html>
                                            <head><title>Stripe Demand Letter</title></head>
                                            <body style="font-family: Times, serif; padding: 40px; white-space: pre-wrap;">${documentText}</body>
                                        </html>
                                    `);
                                }}
                                className="consultation-button"
                                style={{
                                    backgroundColor: "#28a745", 
                                    color: "white",
                                    border: "none"
                                }}
                            >
                                <Icon name="calendar" />
                                Schedule Consultation
                            </button>
                        </div>
                        
                        <button
                            onClick={nextTab}
                            className={`nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
                            disabled={currentTab === tabs.length - 1}
                        >
                            Next
                            <Icon name="chevron-right" />
                        </button>
                    </div>
                </div>
                {/* Preview Panel */}
                <div className="preview-panel">
                    <div className="preview-content">
                        <div className="preview-header">
                            <h2>Live Preview</h2>
                            <p className="preview-text">Your demand letter with 30-day arbitration notice</p>
                        </div>
                        <div ref={previewRef} className="document-preview">
                            <div 
                                dangerouslySetInnerHTML={{ 
                                    __html: highlightedText.replace(/\n/g, '<br>') 
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<StripeDemandGenerator />, document.getElementById('root'));