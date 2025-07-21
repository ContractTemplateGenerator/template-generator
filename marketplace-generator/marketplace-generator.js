const { useState, useEffect, useCallback, useRef } = React;

const MarketplaceGenerator = () => {
    const [paymentState, setPaymentState] = useState({ isPaymentCompleted: false });
    const [agreementData, setAgreementData] = useState({
        marketplaceInfo: {
            marketplaceName: '',
            marketplaceUrl: '',
            companyName: '',
            companyAddress: '',
            contactEmail: ''
        },
        commissionStructure: {
            commissionPercentage: 10,
            flatFee: 0.30,
            paymentSchedule: '',
            paymentMethod: ''
        },
        productRequirements: {
            prohibitedItems: '',
            listingRequirements: '',
            qualityStandards: '',
            imageRequirements: ''
        },
        fulfillmentReturns: {
            fulfillmentResponsibility: '',
            shippingTimeframe: '',
            returnPolicy: '',
            returnTimeframe: 30,
            customerServiceResponsibility: ''
        },
        terminationTerms: {
            noticePeriod: 30,
            terminationReasons: '',
            postTerminationObligations: '',
            dataRetention: ''
        },
        legalTerms: {
            governingLaw: '',
            disputeResolution: '',
            limitationOfLiability: '',
            intellectualProperty: ''
        }
    });
    const [activeSection, setActiveSection] = useState(0);
    const [completionStatus, setCompletionStatus] = useState([false, false, false, false, false, false]);

    // Check for existing payment on component mount
    useEffect(() => {
        const savedPayment = localStorage.getItem('marketplace-generator-payment');
        if (savedPayment) {
            try {
                const payment = JSON.parse(savedPayment);
                if (payment.isPaymentCompleted) {
                    setPaymentState(payment);
                }
            } catch (error) {
                console.error('Error parsing saved payment data:', error);
            }
        }
    }, []);

    // Update functions
    const updateMarketplaceInfo = useCallback((newData) => {
        setAgreementData(prev => ({
            ...prev,
            marketplaceInfo: { ...newData }
        }));
    }, []);

    const updateCommissionStructure = useCallback((newData) => {
        setAgreementData(prev => ({
            ...prev,
            commissionStructure: { ...newData }
        }));
    }, []);

    const updateProductRequirements = useCallback((newData) => {
        setAgreementData(prev => ({
            ...prev,
            productRequirements: { ...newData }
        }));
    }, []);

    const updateFulfillmentReturns = useCallback((newData) => {
        setAgreementData(prev => ({
            ...prev,
            fulfillmentReturns: { ...newData }
        }));
    }, []);

    const updateTerminationTerms = useCallback((newData) => {
        setAgreementData(prev => ({
            ...prev,
            terminationTerms: { ...newData }
        }));
    }, []);

    const updateLegalTerms = useCallback((newData) => {
        setAgreementData(prev => ({
            ...prev,
            legalTerms: { ...newData }
        }));
    }, []);

    // Calculate completion status
    useEffect(() => {
        const newCompletionStatus = [
            !!(agreementData.marketplaceInfo.marketplaceName && 
               agreementData.marketplaceInfo.companyName && 
               agreementData.marketplaceInfo.contactEmail),
            !!(agreementData.commissionStructure.paymentSchedule && 
               agreementData.commissionStructure.paymentMethod),
            !!(agreementData.productRequirements.prohibitedItems || 
               agreementData.productRequirements.listingRequirements),
            !!(agreementData.fulfillmentReturns.fulfillmentResponsibility && 
               agreementData.fulfillmentReturns.shippingTimeframe),
            !!(agreementData.terminationTerms.terminationReasons || 
               agreementData.terminationTerms.postTerminationObligations),
            !!(agreementData.legalTerms.governingLaw && 
               agreementData.legalTerms.disputeResolution)
        ];
        
        setCompletionStatus(newCompletionStatus);
    }, [agreementData]);

    const handlePaymentSuccess = (payment) => {
        setPaymentState(payment);
    };

    // PayPal Paywall Component
    const PayPalPaywall = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');

        useEffect(() => {
            if (window.paypal && !isLoading) {
                window.paypal.Buttons({
                    createOrder: (_data, actions) => {
                        setIsLoading(true);
                        setError('');
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: "19.95",
                                    currency_code: "USD"
                                },
                                description: "Marketplace Seller Agreement Generator"
                            }],
                            intent: "CAPTURE"
                        });
                    },
                    onApprove: async (_data, actions) => {
                        try {
                            if (actions.order) {
                                const details = await actions.order.capture();
                                const paymentData = {
                                    isPaymentCompleted: true,
                                    transactionId: details.id,
                                    paymentDate: new Date().toISOString()
                                };
                                
                                localStorage.setItem('marketplace-generator-payment', JSON.stringify(paymentData));
                                handlePaymentSuccess(paymentData);
                            }
                        } catch (error) {
                            console.error('Payment capture error:', error);
                            setError('Payment processing failed. Please try again.');
                        } finally {
                            setIsLoading(false);
                        }
                    },
                    onError: (err) => {
                        console.error('PayPal error:', err);
                        setError('Payment failed. Please try again.');
                        setIsLoading(false);
                    }
                }).render('#paypal-button-container');
            }
        }, []);

        return (
            <div className="paywall">
                <h2>Marketplace Seller Agreement Generator</h2>
                <p>Generate professional marketplace seller agreements with customizable terms</p>
                <div className="price">$19.95</div>
                <div>
                    <ul style={{ textAlign: 'left', marginBottom: '2rem' }}>
                        <li>✓ Professional marketplace agreement template</li>
                        <li>✓ Customizable commission structures</li>
                        <li>✓ Export to Word document</li>
                        <li>✓ Legal terms and conditions</li>
                        <li>✓ Instant download</li>
                    </ul>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div id="paypal-button-container"></div>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '1rem' }}>
                    Secure payment powered by PayPal
                </p>
            </div>
        );
    };

    // Form Components
    const MarketplaceInfoForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return (
            <div>
                <h2>Marketplace Information</h2>
                <div className="form-group">
                    <label>Marketplace Name *</label>
                    <input
                        type="text"
                        value={data.marketplaceName}
                        onChange={(e) => handleChange('marketplaceName', e.target.value)}
                        placeholder="Enter marketplace name"
                    />
                </div>
                <div className="form-group">
                    <label>Marketplace URL</label>
                    <input
                        type="url"
                        value={data.marketplaceUrl}
                        onChange={(e) => handleChange('marketplaceUrl', e.target.value)}
                        placeholder="https://example.com"
                    />
                </div>
                <div className="form-group">
                    <label>Company Name *</label>
                    <input
                        type="text"
                        value={data.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        placeholder="Enter company name"
                    />
                </div>
                <div className="form-group">
                    <label>Company Address</label>
                    <textarea
                        value={data.companyAddress}
                        onChange={(e) => handleChange('companyAddress', e.target.value)}
                        placeholder="Enter company address"
                    />
                </div>
                <div className="form-group">
                    <label>Contact Email *</label>
                    <input
                        type="email"
                        value={data.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        placeholder="contact@example.com"
                    />
                </div>
            </div>
        );
    };

    const CommissionStructureForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return (
            <div>
                <h2>Commission Structure</h2>
                <div className="form-group">
                    <label>Commission Percentage (%)</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={data.commissionPercentage}
                        onChange={(e) => handleChange('commissionPercentage', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="form-group">
                    <label>Flat Fee per Transaction ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.flatFee}
                        onChange={(e) => handleChange('flatFee', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="form-group">
                    <label>Payment Schedule *</label>
                    <select
                        value={data.paymentSchedule}
                        onChange={(e) => handleChange('paymentSchedule', e.target.value)}
                    >
                        <option value="">Select payment schedule</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Payment Method *</label>
                    <select
                        value={data.paymentMethod}
                        onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    >
                        <option value="">Select payment method</option>
                        <option value="ACH transfer">ACH Transfer</option>
                        <option value="wire transfer">Wire Transfer</option>
                        <option value="check">Check</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Stripe">Stripe</option>
                    </select>
                </div>
            </div>
        );
    };

    const ProductRequirementsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return (
            <div>
                <h2>Product Requirements</h2>
                <div className="form-group">
                    <label>Prohibited Items</label>
                    <textarea
                        value={data.prohibitedItems}
                        onChange={(e) => handleChange('prohibitedItems', e.target.value)}
                        placeholder="List prohibited items or categories..."
                    />
                </div>
                <div className="form-group">
                    <label>Listing Requirements</label>
                    <textarea
                        value={data.listingRequirements}
                        onChange={(e) => handleChange('listingRequirements', e.target.value)}
                        placeholder="Specify listing requirements..."
                    />
                </div>
            </div>
        );
    };

    const FulfillmentReturnsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return (
            <div>
                <h2>Fulfillment & Returns</h2>
                <div className="form-group">
                    <label>Fulfillment Responsibility *</label>
                    <select
                        value={data.fulfillmentResponsibility}
                        onChange={(e) => handleChange('fulfillmentResponsibility', e.target.value)}
                    >
                        <option value="">Select responsibility</option>
                        <option value="seller">Seller</option>
                        <option value="marketplace">Marketplace</option>
                        <option value="shared">Shared</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Shipping Timeframe *</label>
                    <input
                        type="text"
                        value={data.shippingTimeframe}
                        onChange={(e) => handleChange('shippingTimeframe', e.target.value)}
                        placeholder="e.g., 1-3 business days"
                    />
                </div>
            </div>
        );
    };

    const TerminationTermsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return (
            <div>
                <h2>Termination Terms</h2>
                <div className="form-group">
                    <label>Notice Period (days)</label>
                    <input
                        type="number"
                        min="0"
                        value={data.noticePeriod}
                        onChange={(e) => handleChange('noticePeriod', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="form-group">
                    <label>Termination Reasons</label>
                    <textarea
                        value={data.terminationReasons}
                        onChange={(e) => handleChange('terminationReasons', e.target.value)}
                        placeholder="Specify reasons for termination..."
                    />
                </div>
            </div>
        );
    };

    const LegalTermsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return (
            <div>
                <h2>Legal Terms</h2>
                <div className="form-group">
                    <label>Governing Law *</label>
                    <input
                        type="text"
                        value={data.governingLaw}
                        onChange={(e) => handleChange('governingLaw', e.target.value)}
                        placeholder="e.g., State of California, USA"
                    />
                </div>
                <div className="form-group">
                    <label>Dispute Resolution *</label>
                    <select
                        value={data.disputeResolution}
                        onChange={(e) => handleChange('disputeResolution', e.target.value)}
                    >
                        <option value="">Select dispute resolution</option>
                        <option value="arbitration">Arbitration</option>
                        <option value="mediation">Mediation</option>
                        <option value="litigation">Litigation</option>
                    </select>
                </div>
            </div>
        );
    };

    // Document Preview Component
    const DocumentPreview = ({ data }) => {
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        return (
            <div className="preview-content">
                <h1 style={{ textAlign: 'center' }}>MARKETPLACE SELLER AGREEMENT</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Date: {currentDate}</p>
                
                <h2>1. PARTIES</h2>
                <p>
                    This agreement is between {data.marketplaceInfo.companyName || '[COMPANY NAME]'} ("Marketplace") 
                    and the Seller ("Seller") for selling products on {data.marketplaceInfo.marketplaceName || '[MARKETPLACE NAME]'}.
                </p>
                
                <h2>2. COMMISSION STRUCTURE</h2>
                <p>
                    The Marketplace will charge a commission of {data.commissionStructure.commissionPercentage}% 
                    plus a flat fee of ${data.commissionStructure.flatFee} per transaction. 
                    Payments will be made {data.commissionStructure.paymentSchedule || '[PAYMENT SCHEDULE]'} 
                    via {data.commissionStructure.paymentMethod || '[PAYMENT METHOD]'}.
                </p>
                
                <h2>3. PRODUCT REQUIREMENTS</h2>
                <p>
                    {data.productRequirements.prohibitedItems ? 
                        `Prohibited items include: ${data.productRequirements.prohibitedItems}` :
                        'Product requirements will be specified by the Marketplace.'}
                </p>
                
                <h2>4. FULFILLMENT & RETURNS</h2>
                <p>
                    Fulfillment responsibility: {data.fulfillmentReturns.fulfillmentResponsibility || '[TO BE SPECIFIED]'}. 
                    Shipping timeframe: {data.fulfillmentReturns.shippingTimeframe || '[TO BE SPECIFIED]'}.
                </p>
                
                <h2>5. TERMINATION</h2>
                <p>
                    Either party may terminate this agreement with {data.terminationTerms.noticePeriod} days written notice.
                </p>
                
                <h2>6. LEGAL TERMS</h2>
                <p>
                    This agreement is governed by the laws of {data.legalTerms.governingLaw || '[GOVERNING LAW]'}. 
                    Disputes will be resolved through {data.legalTerms.disputeResolution || '[DISPUTE RESOLUTION METHOD]'}.
                </p>
            </div>
        );
    };

    // If payment not completed, show paywall
    if (!paymentState.isPaymentCompleted) {
        return (
            <div className="container">
                <div className="header">
                    <h1>Marketplace Seller Agreement Generator</h1>
                    <p>Create professional marketplace seller agreements</p>
                </div>
                <PayPalPaywall />
            </div>
        );
    }

    const sections = [
        { title: 'Marketplace Information' },
        { title: 'Commission Structure' },
        { title: 'Product Requirements' },
        { title: 'Fulfillment & Returns' },
        { title: 'Termination Terms' },
        { title: 'Legal Terms' }
    ];

    const overallCompletion = Math.round((completionStatus.filter(Boolean).length / completionStatus.length) * 100);

    return (
        <div className="container">
            <div className="header">
                <h1>Marketplace Seller Agreement Generator</h1>
                <p>Create professional marketplace seller agreements</p>
                <div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${overallCompletion}%` }}></div>
                    </div>
                    <p>Completion: {overallCompletion}%</p>
                </div>
            </div>
            
            <div className="main-content">
                <div className="sidebar">
                    <h3>Agreement Sections</h3>
                    <ul className="section-nav">
                        {sections.map((section, index) => (
                            <li key={index}>
                                <button
                                    className={activeSection === index ? 'active' : ''}
                                    onClick={() => setActiveSection(index)}
                                >
                                    {section.title}
                                    {completionStatus[index] && <span className="completion-badge">✓</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            className="button"
                            onClick={() => generateWordDocument(agreementData)}
                            disabled={overallCompletion < 50}
                        >
                            Export to Word
                        </button>
                    </div>
                </div>
                
                <div className="form-section">
                    {activeSection === 0 && (
                        <MarketplaceInfoForm
                            data={agreementData.marketplaceInfo}
                            onChange={updateMarketplaceInfo}
                        />
                    )}
                    {activeSection === 1 && (
                        <CommissionStructureForm
                            data={agreementData.commissionStructure}
                            onChange={updateCommissionStructure}
                        />
                    )}
                    {activeSection === 2 && (
                        <ProductRequirementsForm
                            data={agreementData.productRequirements}
                            onChange={updateProductRequirements}
                        />
                    )}
                    {activeSection === 3 && (
                        <FulfillmentReturnsForm
                            data={agreementData.fulfillmentReturns}
                            onChange={updateFulfillmentReturns}
                        />
                    )}
                    {activeSection === 4 && (
                        <TerminationTermsForm
                            data={agreementData.terminationTerms}
                            onChange={updateTerminationTerms}
                        />
                    )}
                    {activeSection === 5 && (
                        <LegalTermsForm
                            data={agreementData.legalTerms}
                            onChange={updateLegalTerms}
                        />
                    )}
                    <div className="navigation-buttons">
                        <button
                            className="button secondary"
                            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                            disabled={activeSection === 0}
                        >
                            Previous
                        </button>
                        <button
                            className="button"
                            onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                            disabled={activeSection === sections.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
                
                <div className="preview-section">
                    <h3>Document Preview</h3>
                    <DocumentPreview data={agreementData} />
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<MarketplaceGenerator />, document.getElementById('root'));