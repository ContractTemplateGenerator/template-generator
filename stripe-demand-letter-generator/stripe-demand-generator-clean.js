// Clean Stripe Demand Letter Generator with eSignature
const { useState, useRef } = React;

// All 50 US States
const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
];

const StripeDemandGenerator = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [eSignLoading, setESignLoading] = useState(false);
    
    const [formData, setFormData] = useState({
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
        promisedReleaseDate: '',
        businessType: '',
        processingHistory: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generateLetterText = () => {
        const today = new Date();
        const responseDate = new Date(today);
        responseDate.setDate(today.getDate() + 14);
        
        return `${formData.companyName || '[COMPANY NAME]'}
${formData.address || '[ADDRESS]'}
${formData.city || '[CITY]'}, ${formData.state} ${formData.zipCode || '[ZIP]'}
${formData.phone || '[PHONE]'}
${formData.email || '[EMAIL]'}

${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

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

This letter serves as formal notice pursuant to Section 13.3(a) of the Stripe Services Agreement ("SSA") of my intent to commence arbitration proceedings against Stripe, Inc. and Stripe Payments Company. I intend to file an arbitration demand with the American Arbitration Association on or after ${responseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} unless this matter is resolved before that date.

I am writing regarding Stripe's continued withholding of $${formData.withheldAmount || '[AMOUNT]'} in customer payments belonging to ${formData.companyName || '[COMPANY NAME]'}. Despite the passage of significant time since the fund hold began, your company continues to hold these funds without providing any reasonable timeline for release.

FACTUAL BACKGROUND

This account has no history of policy violations or compliance issues. Stripe initiated a hold on my merchant funds, citing vague "risk" concerns without identifying any specific violations of your Services Agreement or providing clear justification for the withholding.

${formData.companyName || '[COMPANY NAME]'} operated as a ${formData.businessType || '[BUSINESS TYPE]'} business for ${formData.processingHistory || '[PROCESSING HISTORY]'} with Stripe, maintaining a clean processing history throughout our relationship.

Since the fund hold began, Stripe has failed to:
- Provide specific justification for the continued withholding beyond general references to "risk"
- Establish any concrete timeline for releasing the held funds
- Identify any specific Service Agreement violations that would justify indefinite withholding

LEGAL CLAIMS

Stripe's actions constitute multiple breaches of the SSA, including but not limited to:

1. BREACH OF CONTRACT: Stripe has materially breached the SSA by withholding funds for an unreasonable period without contractual authority and by failing to process promised payment releases within stated timeframes.

2. CONVERSION: Stripe has wrongfully exercised dominion over $${formData.withheldAmount || '[AMOUNT]'} belonging to ${formData.companyName || '[COMPANY NAME]'}, depriving us of our rightful property beyond any reasonable period necessary for risk management.

3. BREACH OF IMPLIED COVENANT OF GOOD FAITH AND FAIR DEALING: Even where the SSA grants Stripe discretion, it must be exercised in good faith. Stripe's arbitrary withholding of funds without substantial justification violates this fundamental contractual obligation.

4. VIOLATION OF CALIFORNIA BUSINESS & PROFESSIONS CODE § 17200: Stripe's systematic withholding of merchant funds without clear contractual authority constitutes an unfair business practice under California law, allowing for restitution of profits earned on improperly withheld funds.

SUPPORTING EVIDENCE

We have documented evidence supporting our position, including our clean processing history and Stripe's failure to provide specific justification for the continued hold.

DEMAND FOR RESOLUTION

To resolve this matter without proceeding to arbitration, I demand the following:

1. Immediate release of the $${formData.withheldAmount || '[AMOUNT]'} in withheld funds
2. Accounting of any interest earned on these funds while held by Stripe
3. Written confirmation of the release timeline

If I do not receive a satisfactory response by ${responseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}, I intend to file an arbitration demand upon the expiration of the 30-day notice period required by Section 13.3(a) of the SSA.

I look forward to your prompt attention to this matter.

Sincerely,

${formData.contactName || '[CONTACT NAME]'}`;
    };

    // eSignature function
    const eSignDocument = async () => {
        setESignLoading(true);
        try {
            const documentContent = generateLetterText();
            
            const requestData = {
                test: "no", // Production mode
                template: {
                    title: `Demand Letter`,
                    content: documentContent,
                    content_type: "text"
                },
                signers: [{
                    email: formData.email || "sergei.tokmakov@gmail.com",
                    name: formData.contactName || "Sergei Tokmakov",
                    role: "signer"
                }]
            };

            const response = await fetch('http://localhost:3001/esign-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            if (result.status === "success" && result.data) {
                const signingUrl = result.data.signing_url;
                if (signingUrl) {
                    window.open(signingUrl, '_blank', 'width=1000,height=800');
                }
            } else {
                alert("Error creating eSignature document: " + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error("eSignature error:", error);
            alert("Error preparing document for eSignature: " + error.message);
        } finally {
            setESignLoading(false);
        }
    };

    const nextTab = () => {
        if (currentTab < 1) {
            setCurrentTab(currentTab + 1);
        }
    };

    const prevTab = () => {
        if (currentTab > 0) {
            setCurrentTab(currentTab - 1);
        }
    };

    const tabs = [
        {
            title: "Company Information",
            content: React.createElement('div', { className: 'form-section' }, [
                React.createElement('div', { key: 'row1', className: 'form-row' }, [
                    React.createElement('div', { key: 'company', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Company Name *'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.companyName,
                            onChange: (e) => handleInputChange('companyName', e.target.value),
                            placeholder: 'Your company name'
                        })
                    ]),
                    React.createElement('div', { key: 'contact', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Contact Name *'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.contactName,
                            onChange: (e) => handleInputChange('contactName', e.target.value),
                            placeholder: 'Your full name'
                        })
                    ])
                ]),
                React.createElement('div', { key: 'row2', className: 'form-row' }, [
                    React.createElement('div', { key: 'email', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Email Address *'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'email',
                            value: formData.email,
                            onChange: (e) => handleInputChange('email', e.target.value),
                            placeholder: 'your.email@company.com'
                        })
                    ]),
                    React.createElement('div', { key: 'phone', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Phone Number'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'tel',
                            value: formData.phone,
                            onChange: (e) => handleInputChange('phone', e.target.value),
                            placeholder: '(555) 123-4567'
                        })
                    ])
                ]),
                React.createElement('div', { key: 'row3', className: 'form-row' }, [
                    React.createElement('div', { key: 'address', className: 'form-group full-width' }, [
                        React.createElement('label', { key: 'label' }, 'Street Address'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.address,
                            onChange: (e) => handleInputChange('address', e.target.value),
                            placeholder: '123 Main Street'
                        })
                    ])
                ]),
                React.createElement('div', { key: 'row4', className: 'form-row' }, [
                    React.createElement('div', { key: 'city', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'City'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.city,
                            onChange: (e) => handleInputChange('city', e.target.value),
                            placeholder: 'San Francisco'
                        })
                    ]),
                    React.createElement('div', { key: 'state', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'State'),
                        React.createElement('select', {
                            key: 'select',
                            value: formData.state,
                            onChange: (e) => handleInputChange('state', e.target.value)
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
                            value: formData.zipCode,
                            onChange: (e) => handleInputChange('zipCode', e.target.value),
                            placeholder: '94102'
                        })
                    ])
                ])
            ])
        },
        {
            title: "Stripe Account Details",
            content: React.createElement('div', { className: 'form-section' }, [
                React.createElement('div', { key: 'row1', className: 'form-row' }, [
                    React.createElement('div', { key: 'account', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Stripe Account ID'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.stripeAccountId,
                            onChange: (e) => handleInputChange('stripeAccountId', e.target.value),
                            placeholder: 'acct_1234567890'
                        })
                    ]),
                    React.createElement('div', { key: 'amount', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Withheld Amount *'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.withheldAmount,
                            onChange: (e) => handleInputChange('withheldAmount', e.target.value),
                            placeholder: '50,000'
                        })
                    ])
                ]),
                React.createElement('div', { key: 'row2', className: 'form-row' }, [
                    React.createElement('div', { key: 'business', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Business Type'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.businessType,
                            onChange: (e) => handleInputChange('businessType', e.target.value),
                            placeholder: 'e-commerce, SaaS, consulting, etc.'
                        })
                    ]),
                    React.createElement('div', { key: 'history', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Processing History'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.processingHistory,
                            onChange: (e) => handleInputChange('processingHistory', e.target.value),
                            placeholder: '2 years, 6 months, etc.'
                        })
                    ])
                ]),
                React.createElement('div', { key: 'esign-section', style: { marginTop: '30px', padding: '20px', border: '2px solid #007cba', borderRadius: '8px', backgroundColor: '#f8f9fa' } }, [
                    React.createElement('h3', { key: 'title', style: { color: '#007cba', marginTop: 0 } }, 'Electronic Signature'),
                    React.createElement('p', { key: 'description', style: { marginBottom: '20px' } }, 'Generate your demand letter and sign it electronically for immediate legal effect.'),
                    React.createElement('button', {
                        key: 'esign-btn',
                        onClick: eSignDocument,
                        disabled: eSignLoading || !formData.companyName || !formData.contactName || !formData.withheldAmount,
                        style: {
                            backgroundColor: eSignLoading ? '#ccc' : '#007cba',
                            color: 'white',
                            padding: '15px 30px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: eSignLoading ? 'not-allowed' : 'pointer'
                        }
                    }, eSignLoading ? 'Creating Document...' : 'Sign Document Electronically')
                ])
            ])
        }
    ];

    return React.createElement('div', { className: 'generator-container' }, [
        React.createElement('header', { key: 'header', className: 'header' }, [
            React.createElement('h1', { key: 'title' }, 'Demand Letter Generator'),
            React.createElement('p', { key: 'subtitle' }, 'Professional legal documents for Stripe fund recovery')
        ]),
        
        React.createElement('div', { key: 'content', className: 'content-container' }, [
            React.createElement('div', { key: 'form', className: 'form-container' }, [
                React.createElement('div', { key: 'tabs', className: 'tabs' }, 
                    tabs.map((tab, index) => 
                        React.createElement('button', {
                            key: index,
                            className: `tab ${currentTab === index ? 'active' : ''}`,
                            onClick: () => setCurrentTab(index)
                        }, tab.title)
                    )
                ),
                
                React.createElement('div', { key: 'tab-content', className: 'tab-content' }, 
                    tabs[currentTab].content
                ),
                
                React.createElement('div', { key: 'navigation', className: 'tab-navigation' }, [
                    React.createElement('button', {
                        key: 'prev',
                        onClick: prevTab,
                        className: `nav-button ${currentTab === 0 ? 'disabled' : ''}`,
                        disabled: currentTab === 0
                    }, 'Previous'),
                    
                    React.createElement('button', {
                        key: 'next',
                        onClick: nextTab,
                        className: `nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`,
                        disabled: currentTab === tabs.length - 1
                    }, 'Next')
                ])
            ]),
            
            React.createElement('div', { key: 'preview', className: 'preview-panel' }, [
                React.createElement('h3', { key: 'title' }, 'Document Preview'),
                React.createElement('div', { 
                    key: 'content',
                    className: 'preview-content',
                    style: { 
                        whiteSpace: 'pre-line',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        lineHeight: '1.4',
                        border: '1px solid #ddd',
                        padding: '15px',
                        maxHeight: '400px',
                        overflow: 'auto',
                        backgroundColor: '#f9f9f9'
                    }
                }, generateLetterText())
            ])
        ])
    ]);
};

// Render the component
try {
    ReactDOM.render(React.createElement(StripeDemandGenerator), document.getElementById('root'));
    console.log('Clean component rendered successfully');
} catch (error) {
    console.error('Error rendering clean component:', error);
    document.getElementById('root').innerHTML = '<h1>Error Loading Generator</h1><p>Check console for details.</p>';
}