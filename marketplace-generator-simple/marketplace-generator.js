const { useState, useEffect, useCallback } = React;

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

        const paypalOptions = {
            "client-id": "ASmwKug6zVE_78S-152YKAzzh2iH8VgSjs-P6RkrWcfqdznNjeE_UYwKJkuJ3BvIJrxCotS8GtXEJ2fx",
            currency: "USD",
            intent: "capture"
        };

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

        return React.createElement('div', { className: 'paywall' }, [
            React.createElement('h2', { key: 'title' }, 'Marketplace Seller Agreement Generator'),
            React.createElement('p', { key: 'desc' }, 'Generate professional marketplace seller agreements with customizable terms'),
            React.createElement('div', { key: 'price', className: 'price' }, '$19.95'),
            React.createElement('div', { key: 'features' }, [
                React.createElement('ul', { style: { textAlign: 'left', marginBottom: '2rem' } }, [
                    React.createElement('li', { key: '1' }, '✓ Professional marketplace agreement template'),
                    React.createElement('li', { key: '2' }, '✓ Customizable commission structures'),
                    React.createElement('li', { key: '3' }, '✓ Export to Word document'),
                    React.createElement('li', { key: '4' }, '✓ Legal terms and conditions'),
                    React.createElement('li', { key: '5' }, '✓ Instant download')
                ])
            ]),
            error && React.createElement('div', { key: 'error', className: 'error-message' }, error),
            React.createElement('div', { key: 'paypal', id: 'paypal-button-container' }),
            React.createElement('p', { key: 'note', style: { fontSize: '0.9rem', color: '#6b7280', marginTop: '1rem' } }, 
                'Secure payment powered by PayPal')
        ]);
    };

    // Form Components
    const MarketplaceInfoForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return React.createElement('div', null, [
            React.createElement('h2', { key: 'title' }, 'Marketplace Information'),
            React.createElement('div', { key: 'form', className: 'form-group' }, [
                React.createElement('label', { key: 'label1' }, 'Marketplace Name *'),
                React.createElement('input', {
                    key: 'input1',
                    type: 'text',
                    value: data.marketplaceName,
                    onChange: (e) => handleChange('marketplaceName', e.target.value),
                    placeholder: 'Enter marketplace name'
                })
            ]),
            React.createElement('div', { key: 'url', className: 'form-group' }, [
                React.createElement('label', { key: 'label2' }, 'Marketplace URL'),
                React.createElement('input', {
                    key: 'input2',
                    type: 'url',
                    value: data.marketplaceUrl,
                    onChange: (e) => handleChange('marketplaceUrl', e.target.value),
                    placeholder: 'https://example.com'
                })
            ]),
            React.createElement('div', { key: 'company', className: 'form-group' }, [
                React.createElement('label', { key: 'label3' }, 'Company Name *'),
                React.createElement('input', {
                    key: 'input3',
                    type: 'text',
                    value: data.companyName,
                    onChange: (e) => handleChange('companyName', e.target.value),
                    placeholder: 'Enter company name'
                })
            ]),
            React.createElement('div', { key: 'address', className: 'form-group' }, [
                React.createElement('label', { key: 'label4' }, 'Company Address'),
                React.createElement('textarea', {
                    key: 'input4',
                    value: data.companyAddress,
                    onChange: (e) => handleChange('companyAddress', e.target.value),
                    placeholder: 'Enter company address'
                })
            ]),
            React.createElement('div', { key: 'email', className: 'form-group' }, [
                React.createElement('label', { key: 'label5' }, 'Contact Email *'),
                React.createElement('input', {
                    key: 'input5',
                    type: 'email',
                    value: data.contactEmail,
                    onChange: (e) => handleChange('contactEmail', e.target.value),
                    placeholder: 'contact@example.com'
                })
            ])
        ]);
    };

    const CommissionStructureForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return React.createElement('div', null, [
            React.createElement('h2', { key: 'title' }, 'Commission Structure'),
            React.createElement('div', { key: 'percentage', className: 'form-group' }, [
                React.createElement('label', { key: 'label1' }, 'Commission Percentage (%)'),
                React.createElement('input', {
                    key: 'input1',
                    type: 'number',
                    min: '0',
                    max: '100',
                    step: '0.1',
                    value: data.commissionPercentage,
                    onChange: (e) => handleChange('commissionPercentage', parseFloat(e.target.value) || 0)
                })
            ]),
            React.createElement('div', { key: 'flatfee', className: 'form-group' }, [
                React.createElement('label', { key: 'label2' }, 'Flat Fee per Transaction ($)'),
                React.createElement('input', {
                    key: 'input2',
                    type: 'number',
                    min: '0',
                    step: '0.01',
                    value: data.flatFee,
                    onChange: (e) => handleChange('flatFee', parseFloat(e.target.value) || 0)
                })
            ]),
            React.createElement('div', { key: 'schedule', className: 'form-group' }, [
                React.createElement('label', { key: 'label3' }, 'Payment Schedule *'),
                React.createElement('select', {
                    key: 'select1',
                    value: data.paymentSchedule,
                    onChange: (e) => handleChange('paymentSchedule', e.target.value)
                }, [
                    React.createElement('option', { key: 'empty', value: '' }, 'Select payment schedule'),
                    React.createElement('option', { key: 'weekly', value: 'weekly' }, 'Weekly'),
                    React.createElement('option', { key: 'biweekly', value: 'bi-weekly' }, 'Bi-weekly'),
                    React.createElement('option', { key: 'monthly', value: 'monthly' }, 'Monthly'),
                    React.createElement('option', { key: 'quarterly', value: 'quarterly' }, 'Quarterly')
                ])
            ]),
            React.createElement('div', { key: 'method', className: 'form-group' }, [
                React.createElement('label', { key: 'label4' }, 'Payment Method *'),
                React.createElement('select', {
                    key: 'select2',
                    value: data.paymentMethod,
                    onChange: (e) => handleChange('paymentMethod', e.target.value)
                }, [
                    React.createElement('option', { key: 'empty', value: '' }, 'Select payment method'),
                    React.createElement('option', { key: 'ach', value: 'ACH transfer' }, 'ACH Transfer'),
                    React.createElement('option', { key: 'wire', value: 'wire transfer' }, 'Wire Transfer'),
                    React.createElement('option', { key: 'check', value: 'check' }, 'Check'),
                    React.createElement('option', { key: 'paypal', value: 'PayPal' }, 'PayPal'),
                    React.createElement('option', { key: 'stripe', value: 'Stripe' }, 'Stripe')
                ])
            ])
        ]);
    };

    // Simplified forms for other sections (similar pattern)
    const ProductRequirementsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return React.createElement('div', null, [
            React.createElement('h2', { key: 'title' }, 'Product Requirements'),
            React.createElement('div', { key: 'prohibited', className: 'form-group' }, [
                React.createElement('label', { key: 'label1' }, 'Prohibited Items'),
                React.createElement('textarea', {
                    key: 'textarea1',
                    value: data.prohibitedItems,
                    onChange: (e) => handleChange('prohibitedItems', e.target.value),
                    placeholder: 'List prohibited items or categories...'
                })
            ]),
            React.createElement('div', { key: 'listing', className: 'form-group' }, [
                React.createElement('label', { key: 'label2' }, 'Listing Requirements'),
                React.createElement('textarea', {
                    key: 'textarea2',
                    value: data.listingRequirements,
                    onChange: (e) => handleChange('listingRequirements', e.target.value),
                    placeholder: 'Specify listing requirements...'
                })
            ])
        ]);
    };

    const FulfillmentReturnsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return React.createElement('div', null, [
            React.createElement('h2', { key: 'title' }, 'Fulfillment & Returns'),
            React.createElement('div', { key: 'fulfillment', className: 'form-group' }, [
                React.createElement('label', { key: 'label1' }, 'Fulfillment Responsibility *'),
                React.createElement('select', {
                    key: 'select1',
                    value: data.fulfillmentResponsibility,
                    onChange: (e) => handleChange('fulfillmentResponsibility', e.target.value)
                }, [
                    React.createElement('option', { key: 'empty', value: '' }, 'Select responsibility'),
                    React.createElement('option', { key: 'seller', value: 'seller' }, 'Seller'),
                    React.createElement('option', { key: 'marketplace', value: 'marketplace' }, 'Marketplace'),
                    React.createElement('option', { key: 'shared', value: 'shared' }, 'Shared')
                ])
            ]),
            React.createElement('div', { key: 'shipping', className: 'form-group' }, [
                React.createElement('label', { key: 'label2' }, 'Shipping Timeframe *'),
                React.createElement('input', {
                    key: 'input1',
                    type: 'text',
                    value: data.shippingTimeframe,
                    onChange: (e) => handleChange('shippingTimeframe', e.target.value),
                    placeholder: 'e.g., 1-3 business days'
                })
            ])
        ]);
    };

    const TerminationTermsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return React.createElement('div', null, [
            React.createElement('h2', { key: 'title' }, 'Termination Terms'),
            React.createElement('div', { key: 'notice', className: 'form-group' }, [
                React.createElement('label', { key: 'label1' }, 'Notice Period (days)'),
                React.createElement('input', {
                    key: 'input1',
                    type: 'number',
                    min: '0',
                    value: data.noticePeriod,
                    onChange: (e) => handleChange('noticePeriod', parseInt(e.target.value) || 0)
                })
            ]),
            React.createElement('div', { key: 'reasons', className: 'form-group' }, [
                React.createElement('label', { key: 'label2' }, 'Termination Reasons'),
                React.createElement('textarea', {
                    key: 'textarea1',
                    value: data.terminationReasons,
                    onChange: (e) => handleChange('terminationReasons', e.target.value),
                    placeholder: 'Specify reasons for termination...'
                })
            ])
        ]);
    };

    const LegalTermsForm = ({ data, onChange }) => {
        const handleChange = (field, value) => {
            onChange({ ...data, [field]: value });
        };

        return React.createElement('div', null, [
            React.createElement('h2', { key: 'title' }, 'Legal Terms'),
            React.createElement('div', { key: 'law', className: 'form-group' }, [
                React.createElement('label', { key: 'label1' }, 'Governing Law *'),
                React.createElement('input', {
                    key: 'input1',
                    type: 'text',
                    value: data.governingLaw,
                    onChange: (e) => handleChange('governingLaw', e.target.value),
                    placeholder: 'e.g., State of California, USA'
                })
            ]),
            React.createElement('div', { key: 'dispute', className: 'form-group' }, [
                React.createElement('label', { key: 'label2' }, 'Dispute Resolution *'),
                React.createElement('select', {
                    key: 'select1',
                    value: data.disputeResolution,
                    onChange: (e) => handleChange('disputeResolution', e.target.value)
                }, [
                    React.createElement('option', { key: 'empty', value: '' }, 'Select dispute resolution'),
                    React.createElement('option', { key: 'arbitration', value: 'arbitration' }, 'Arbitration'),
                    React.createElement('option', { key: 'mediation', value: 'mediation' }, 'Mediation'),
                    React.createElement('option', { key: 'litigation', value: 'litigation' }, 'Litigation')
                ])
            ])
        ]);
    };

    // Document Preview Component
    const DocumentPreview = ({ data }) => {
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        return React.createElement('div', { className: 'preview-content' }, [
            React.createElement('h1', { key: 'title', style: { textAlign: 'center' } }, 'MARKETPLACE SELLER AGREEMENT'),
            React.createElement('p', { key: 'date', style: { textAlign: 'center', marginBottom: '2rem' } }, `Date: ${currentDate}`),
            
            React.createElement('h2', { key: 'parties' }, '1. PARTIES'),
            React.createElement('p', { key: 'parties-content' }, 
                `This agreement is between ${data.marketplaceInfo.companyName || '[COMPANY NAME]'} ("Marketplace") ` +
                `and the Seller ("Seller") for selling products on ${data.marketplaceInfo.marketplaceName || '[MARKETPLACE NAME]'}.`
            ),
            
            React.createElement('h2', { key: 'commission' }, '2. COMMISSION STRUCTURE'),
            React.createElement('p', { key: 'commission-content' }, 
                `The Marketplace will charge a commission of ${data.commissionStructure.commissionPercentage}% ` +
                `plus a flat fee of $${data.commissionStructure.flatFee} per transaction. ` +
                `Payments will be made ${data.commissionStructure.paymentSchedule || '[PAYMENT SCHEDULE]'} ` +
                `via ${data.commissionStructure.paymentMethod || '[PAYMENT METHOD]'}.`
            ),
            
            React.createElement('h2', { key: 'products' }, '3. PRODUCT REQUIREMENTS'),
            React.createElement('p', { key: 'products-content' }, 
                data.productRequirements.prohibitedItems ? 
                `Prohibited items include: ${data.productRequirements.prohibitedItems}` :
                'Product requirements will be specified by the Marketplace.'
            ),
            
            React.createElement('h2', { key: 'fulfillment' }, '4. FULFILLMENT & RETURNS'),
            React.createElement('p', { key: 'fulfillment-content' }, 
                `Fulfillment responsibility: ${data.fulfillmentReturns.fulfillmentResponsibility || '[TO BE SPECIFIED]'}. ` +
                `Shipping timeframe: ${data.fulfillmentReturns.shippingTimeframe || '[TO BE SPECIFIED]'}.`
            ),
            
            React.createElement('h2', { key: 'termination' }, '5. TERMINATION'),
            React.createElement('p', { key: 'termination-content' }, 
                `Either party may terminate this agreement with ${data.terminationTerms.noticePeriod} days written notice.`
            ),
            
            React.createElement('h2', { key: 'legal' }, '6. LEGAL TERMS'),
            React.createElement('p', { key: 'legal-content' }, 
                `This agreement is governed by the laws of ${data.legalTerms.governingLaw || '[GOVERNING LAW]'}. ` +
                `Disputes will be resolved through ${data.legalTerms.disputeResolution || '[DISPUTE RESOLUTION METHOD]'}.`
            )
        ]);
    };

    // If payment not completed, show paywall
    if (!paymentState.isPaymentCompleted) {
        return React.createElement('div', { className: 'container' }, [
            React.createElement('div', { key: 'header', className: 'header' }, [
                React.createElement('h1', { key: 'title' }, 'Marketplace Seller Agreement Generator'),
                React.createElement('p', { key: 'subtitle' }, 'Create professional marketplace seller agreements')
            ]),
            React.createElement(PayPalPaywall, { key: 'paywall' })
        ]);
    }

    const sections = [
        { title: 'Marketplace Information', component: MarketplaceInfoForm, data: agreementData.marketplaceInfo, onChange: updateMarketplaceInfo },
        { title: 'Commission Structure', component: CommissionStructureForm, data: agreementData.commissionStructure, onChange: updateCommissionStructure },
        { title: 'Product Requirements', component: ProductRequirementsForm, data: agreementData.productRequirements, onChange: updateProductRequirements },
        { title: 'Fulfillment & Returns', component: FulfillmentReturnsForm, data: agreementData.fulfillmentReturns, onChange: updateFulfillmentReturns },
        { title: 'Termination Terms', component: TerminationTermsForm, data: agreementData.terminationTerms, onChange: updateTerminationTerms },
        { title: 'Legal Terms', component: LegalTermsForm, data: agreementData.legalTerms, onChange: updateLegalTerms }
    ];

    const overallCompletion = Math.round((completionStatus.filter(Boolean).length / completionStatus.length) * 100);

    return React.createElement('div', { className: 'container' }, [
        React.createElement('div', { key: 'header', className: 'header' }, [
            React.createElement('h1', { key: 'title' }, 'Marketplace Seller Agreement Generator'),
            React.createElement('p', { key: 'subtitle' }, 'Create professional marketplace seller agreements'),
            React.createElement('div', { key: 'progress' }, [
                React.createElement('div', { className: 'progress-bar' }, 
                    React.createElement('div', { className: 'progress-fill', style: { width: `${overallCompletion}%` } })
                ),
                React.createElement('p', null, `Completion: ${overallCompletion}%`)
            ])
        ]),
        
        React.createElement('div', { key: 'main', className: 'main-content' }, [
            React.createElement('div', { key: 'sidebar', className: 'sidebar' }, [
                React.createElement('h3', { key: 'nav-title' }, 'Agreement Sections'),
                React.createElement('ul', { key: 'nav', className: 'section-nav' }, 
                    sections.map((section, index) => 
                        React.createElement('li', { key: index }, 
                            React.createElement('button', {
                                className: activeSection === index ? 'active' : '',
                                onClick: () => setActiveSection(index)
                            }, [
                                section.title,
                                completionStatus[index] && React.createElement('span', { key: 'badge', className: 'completion-badge' }, '✓')
                            ])
                        )
                    )
                ),
                React.createElement('div', { key: 'export', style: { marginTop: '2rem' } }, [
                    React.createElement('button', {
                        className: 'button',
                        onClick: () => generateWordDocument(agreementData),
                        disabled: overallCompletion < 50
                    }, 'Export to Word')
                ])
            ]),
            
            React.createElement('div', { key: 'form', className: 'form-section' }, [
                React.createElement(sections[activeSection].component, {
                    data: sections[activeSection].data,
                    onChange: sections[activeSection].onChange
                }),
                React.createElement('div', { key: 'nav-buttons', className: 'navigation-buttons' }, [
                    React.createElement('button', {
                        key: 'prev',
                        className: 'button secondary',
                        onClick: () => setActiveSection(Math.max(0, activeSection - 1)),
                        disabled: activeSection === 0
                    }, 'Previous'),
                    React.createElement('button', {
                        key: 'next',
                        className: 'button',
                        onClick: () => setActiveSection(Math.min(sections.length - 1, activeSection + 1)),
                        disabled: activeSection === sections.length - 1
                    }, 'Next')
                ])
            ]),
            
            React.createElement('div', { key: 'preview', className: 'preview-section' }, [
                React.createElement('h3', { key: 'preview-title' }, 'Document Preview'),
                React.createElement(DocumentPreview, { key: 'preview-content', data: agreementData })
            ])
        ])
    ]);
};

// Render the component
ReactDOM.render(React.createElement(MarketplaceGenerator), document.getElementById('root'));