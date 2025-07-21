const { useState, useRef, useEffect } = React;

const MarketplaceGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const previewRef = useRef(null);
    
    // Form data state with better defaults
    const [formData, setFormData] = useState({
        // Marketplace Information
        marketplaceName: 'Example Marketplace',
        marketplaceUrl: 'www.example-marketplace.com',
        companyName: 'Example Marketplace LLC',
        companyAddress: '123 Main Street, San Francisco, CA 94105',
        contactEmail: 'contact@example-marketplace.com',
        
        // Commission & Fees
        commissionPercentage: '15',
        flatFee: '0.30',
        paymentSchedule: 'bi-weekly',
        paymentMethod: 'ACH Transfer',
        
        // Product Requirements
        prohibitedItems: 'Illegal items, counterfeit goods, hazardous materials, weapons, adult content',
        listingRequirements: 'High-quality product images, detailed descriptions, accurate pricing, proper categorization',
        qualityStandards: 'All products must meet marketplace quality standards',
        
        // Fulfillment & Returns
        fulfillmentResponsibility: 'seller',
        shippingTimeframe: '1-3 business days',
        returnPolicy: 'marketplace-standard',
        returnTimeframe: '30',
        customerServiceResponsibility: 'seller',
        
        // Termination Terms
        noticePeriod: '30',
        terminationReasons: 'Breach of agreement, violation of policies, fraudulent activity',
        postTerminationObligations: 'Complete pending orders, honor return policy',
        
        // Legal Terms
        governingLaw: 'State of California, USA',
        disputeResolution: 'arbitration',
        limitationOfLiability: 'standard',
        intellectualProperty: 'seller-retains'
    });

    // Handle input changes properly to fix typing issues
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Record what field was changed for highlighting
        setLastChanged(name);
        
        // Update form data
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };
        setFormData(newFormData);
        
        // Save form data to localStorage
        localStorage.setItem('marketplaceFormData', JSON.stringify(newFormData));
    };

    // Load saved form data on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('marketplaceFormData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setFormData(parsedData);
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }, []);

    // Generate document text with highlighting support
    const generateDocumentText = () => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `MARKETPLACE SELLER AGREEMENT

Date: ${currentDate}

This Marketplace Seller Agreement ("Agreement") is entered into between ${formData.companyName} ("Marketplace"), a company located at ${formData.companyAddress}, and the individual or entity agreeing to these terms ("Seller") for the purpose of selling products or services on the ${formData.marketplaceName} platform (${formData.marketplaceUrl}).

1. MARKETPLACE PLATFORM

1.1 Platform Description: ${formData.marketplaceName} is an online marketplace that connects buyers with sellers of various products and services.

1.2 Contact Information: For questions regarding this agreement, contact us at ${formData.contactEmail}.

2. COMMISSION STRUCTURE AND FEES

2.1 Commission Rate: The Marketplace will charge a commission of ${formData.commissionPercentage}% of the gross sale price for each transaction.

2.2 Transaction Fees: In addition to the commission, a flat transaction fee of $${formData.flatFee} will be charged per transaction.

2.3 Payment Schedule: Payments to sellers will be made ${formData.paymentSchedule} via ${formData.paymentMethod}.

2.4 Payment Processing: All payments are subject to the Marketplace's standard payment processing procedures and may be subject to holds or delays as determined by the Marketplace.

3. PRODUCT REQUIREMENTS AND RESTRICTIONS

3.1 Prohibited Items: The following items are prohibited on the Marketplace: ${formData.prohibitedItems}.

3.2 Listing Requirements: All product listings must meet the following standards: ${formData.listingRequirements}.

3.3 Quality Standards: ${formData.qualityStandards}. The Marketplace reserves the right to remove listings that do not meet these standards.

3.4 Compliance: Sellers must ensure all products comply with applicable laws, regulations, and marketplace policies.

4. FULFILLMENT AND SHIPPING

4.1 Fulfillment Responsibility: ${formData.fulfillmentResponsibility === 'seller' ? 'Seller is responsible for fulfilling all orders' : formData.fulfillmentResponsibility === 'marketplace' ? 'Marketplace handles fulfillment' : 'Fulfillment responsibilities are shared between Seller and Marketplace'}.

4.2 Shipping Timeframe: Orders must be processed and shipped within ${formData.shippingTimeframe} of order placement.

4.3 Shipping Standards: Sellers must provide accurate tracking information and ensure proper packaging to prevent damage during transit.

5. RETURNS AND REFUNDS

5.1 Return Policy: ${formData.returnPolicy === 'marketplace-standard' ? 'All returns are subject to the Marketplace\'s standard return policy' : 'Sellers may set their own return policies subject to Marketplace approval'}.

5.2 Return Timeframe: Customers may return items within ${formData.returnTimeframe} days of delivery.

5.3 Return Processing: Returns must be processed promptly according to the applicable return policy.

5.4 Customer Service: ${formData.customerServiceResponsibility === 'seller' ? 'Seller is responsible for customer service inquiries' : 'Marketplace handles customer service'}.

6. TERM AND TERMINATION

6.1 Term: This Agreement shall remain in effect until terminated by either party.

6.2 Termination Notice: Either party may terminate this Agreement with ${formData.noticePeriod} days written notice.

6.3 Grounds for Termination: The Marketplace may terminate this Agreement immediately for the following reasons: ${formData.terminationReasons}.

6.4 Post-Termination Obligations: Upon termination, Seller must: ${formData.postTerminationObligations}.

7. INTELLECTUAL PROPERTY

7.1 Ownership: ${formData.intellectualProperty === 'seller-retains' ? 'Seller retains all intellectual property rights in their products and content' : 'Intellectual property rights are shared or assigned as specified'}.

7.2 License to Marketplace: Seller grants Marketplace a non-exclusive license to use product images, descriptions, and other content for marketing and operational purposes.

7.3 Platform IP: All Marketplace platform technology, trademarks, and proprietary information remain the exclusive property of Marketplace.

8. REPRESENTATIONS AND WARRANTIES

8.1 Seller Representations: Seller represents and warrants that:
- They have the right to sell all listed products
- All product information is accurate and truthful
- They will comply with all applicable laws and regulations
- They have necessary licenses and permits for their business

8.2 Disclaimer: EXCEPT AS EXPRESSLY SET FORTH HEREIN, MARKETPLACE MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

9. LIMITATION OF LIABILITY

9.1 Limitation: ${formData.limitationOfLiability === 'standard' ? 'IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES' : 'Liability limitations as specified'}.

9.2 Maximum Liability: Each party's maximum liability under this Agreement shall not exceed the total fees paid or payable under this Agreement in the twelve months preceding the claim.

10. GOVERNING LAW AND DISPUTE RESOLUTION

10.1 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${formData.governingLaw}.

10.2 Dispute Resolution: Any disputes arising under this Agreement shall be resolved through ${formData.disputeResolution === 'arbitration' ? 'binding arbitration' : formData.disputeResolution === 'mediation' ? 'mediation followed by arbitration if necessary' : 'litigation in the appropriate courts'}.

10.3 Jurisdiction: The parties agree to submit to the exclusive jurisdiction of the courts in ${formData.governingLaw}.

11. GENERAL PROVISIONS

11.1 Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

11.2 Amendment: This Agreement may only be amended in writing signed by both parties.

11.3 Severability: If any provision of this Agreement is held to be invalid or unenforceable, the remainder of the Agreement shall remain in full force and effect.

11.4 Assignment: Seller may not assign this Agreement without the prior written consent of Marketplace.

11.5 Force Majeure: Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control.

12. SIGNATURES

By using the Marketplace platform and accepting these terms, Seller acknowledges that they have read, understood, and agree to be bound by this Agreement.

Marketplace: ${formData.companyName}

By: _________________________
Name: 
Title: 
Date: _______________________

Seller:

By: _________________________
Name: 
Title: 
Date: _______________________

---

This document was generated on ${currentDate} using the Marketplace Seller Agreement Generator at terms.law`;
    };

    // Create highlighted document text with PRECISE highlighting like AI generator
    const createHighlightedText = () => {
        if (!lastChanged) return generateDocumentText();
        
        let highlightedText = generateDocumentText();
        
        // Highlight only the specific phrase/value that changed, NOT whole paragraphs
        switch (lastChanged) {
            case 'marketplaceName':
                if (formData.marketplaceName) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.marketplaceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.marketplaceName}</span>`
                    );
                }
                break;
            case 'companyName':
                if (formData.companyName) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.companyName}</span>`
                    );
                }
                break;
            case 'contactEmail':
                if (formData.contactEmail) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.contactEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.contactEmail}</span>`
                    );
                }
                break;
            case 'companyAddress':
                if (formData.companyAddress) {
                    highlightedText = highlightedText.replace(
                        /located at .*/,
                        `located at <span class="highlighted-text">${formData.companyAddress}</span>, and`
                    );
                }
                break;
            case 'marketplaceUrl':
                if (formData.marketplaceUrl) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.marketplaceUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.marketplaceUrl}</span>`
                    );
                }
                break;
            case 'commissionPercentage':
                if (formData.commissionPercentage) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`${formData.commissionPercentage}%`, 'g'),
                        `<span class="highlighted-text">${formData.commissionPercentage}%</span>`
                    );
                }
                break;
            case 'flatFee':
                if (formData.flatFee) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`\\$${formData.flatFee}`, 'g'),
                        `<span class="highlighted-text">$${formData.flatFee}</span>`
                    );
                }
                break;
            case 'paymentSchedule':
                highlightedText = highlightedText.replace(
                    /Payments to sellers will be made .* via/,
                    `Payments to sellers will be made <span class="highlighted-text">${formData.paymentSchedule}</span> via`
                );
                break;
            case 'paymentMethod':
                highlightedText = highlightedText.replace(
                    /via .*/,
                    `via <span class="highlighted-text">${formData.paymentMethod}</span>.`
                );
                break;
            case 'returnTimeframe':
                if (formData.returnTimeframe) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`${formData.returnTimeframe} days`, 'g'),
                        `<span class="highlighted-text">${formData.returnTimeframe} days</span>`
                    );
                }
                break;
            case 'noticePeriod':
                if (formData.noticePeriod) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`${formData.noticePeriod} days written notice`, 'g'),
                        `<span class="highlighted-text">${formData.noticePeriod} days</span> written notice`
                    );
                }
                break;
            case 'shippingTimeframe':
                highlightedText = highlightedText.replace(
                    /within .* of order placement/,
                    `within <span class="highlighted-text">${formData.shippingTimeframe}</span> of order placement`
                );
                break;
            case 'governingLaw':
                highlightedText = highlightedText.replace(
                    /laws of .*/,
                    `laws of <span class="highlighted-text">${formData.governingLaw}</span>.`
                );
                break;
            case 'disputeResolution':
                const resolutionText = formData.disputeResolution === 'arbitration' ? 'binding arbitration' : 
                                     formData.disputeResolution === 'mediation' ? 'mediation followed by arbitration if necessary' : 
                                     'litigation in the appropriate courts';
                highlightedText = highlightedText.replace(
                    /resolved through .*/,
                    `resolved through <span class="highlighted-text">${resolutionText}</span>.`
                );
                break;
            case 'fulfillmentResponsibility':
                const fulfillmentText = formData.fulfillmentResponsibility === 'seller' ? 'Seller is responsible for fulfilling all orders' :
                                      formData.fulfillmentResponsibility === 'marketplace' ? 'Marketplace handles fulfillment' :
                                      'Fulfillment responsibilities are shared between Seller and Marketplace';
                highlightedText = highlightedText.replace(
                    /4\.1 Fulfillment Responsibility: .*/,
                    `4.1 Fulfillment Responsibility: <span class="highlighted-text">${fulfillmentText}</span>.`
                );
                break;
            case 'returnPolicy':
                const policyText = formData.returnPolicy === 'marketplace-standard' ? 
                                 'All returns are subject to the Marketplace\'s standard return policy' :
                                 'Sellers may set their own return policies subject to Marketplace approval';
                highlightedText = highlightedText.replace(
                    /5\.1 Return Policy: .*/,
                    `5.1 Return Policy: <span class="highlighted-text">${policyText}</span>.`
                );
                break;
            case 'customerServiceResponsibility':
                const serviceText = formData.customerServiceResponsibility === 'seller' ? 
                                  'Seller is responsible for customer service inquiries' :
                                  'Marketplace handles customer service';
                highlightedText = highlightedText.replace(
                    /5\.4 Customer Service: .*/,
                    `5.4 Customer Service: <span class="highlighted-text">${serviceText}</span>.`
                );
                break;
            case 'prohibitedItems':
            case 'listingRequirements':
            case 'qualityStandards':
            case 'terminationReasons':
            case 'postTerminationObligations':
                // For text areas, highlight the content that was just changed
                const fieldValue = formData[lastChanged];
                if (fieldValue) {
                    highlightedText = highlightedText.replace(
                        new RegExp(fieldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${fieldValue}</span>`
                    );
                }
                break;
            default:
                break;
        }
        
        return highlightedText;
    };

    const documentText = generateDocumentText();
    const highlightedText = createHighlightedText();

    // Scroll to highlighted text
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            setTimeout(() => {
                const highlightedElement = previewRef.current.querySelector('.highlighted-text');
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 100);

            const timer = setTimeout(() => {
                setLastChanged(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [highlightedText, lastChanged]);

    // Copy to clipboard function
    const copyToClipboard = async () => {
        try {
            const text = generateDocumentText();
            await navigator.clipboard.writeText(text);
            alert('Agreement copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    };

    // Help tooltip component
    const HelpIcon = ({ tooltip }) => (
        <span className="help-icon" title={tooltip}>
            ⓘ
        </span>
    );

    // Define tooltips with practical legal advice
    const tooltips = {
        marketplaceName: "The public name of your marketplace platform that users will see",
        commissionPercentage: "Industry standard ranges from 3-15%. Higher rates may reduce seller participation",
        flatFee: "Fixed fees help cover payment processing costs. Typical range is $0.30-$2.00",
        prohibitedItems: "Clear restrictions reduce legal liability and protect your brand reputation",
        fulfillmentResponsibility: "Seller fulfillment reduces your operational costs but may impact customer experience",
        returnPolicy: "Standard policies provide consistency; seller-defined allows flexibility but increases complexity",
        disputeResolution: "Arbitration is typically faster and cheaper than litigation for business disputes",
        noticePeriod: "30-60 days is standard; longer periods provide more stability for sellers",
        governingLaw: "Choose the jurisdiction where your business is incorporated for consistency"
    };

    // Generate comprehensive legal risk analysis
    const generateRiskAnalysis = () => {
        let highRisks = [];
        let mediumRisks = [];
        let lowRisks = [];
        let recommendations = [];

        // Commission Structure Analysis
        const commission = parseFloat(formData.commissionPercentage);
        if (commission > 20) {
            highRisks.push('Commission rate above 20% may violate state usury laws');
            recommendations.push('Consider reducing commission to industry standard 3-15%');
        } else if (commission > 15) {
            mediumRisks.push('High commission rate may reduce seller participation');
            recommendations.push('Monitor competitor rates and seller feedback');
        } else {
            lowRisks.push('Commission rate within industry standards');
        }

        // Fulfillment Analysis
        if (formData.fulfillmentResponsibility === 'seller') {
            lowRisks.push('Seller fulfillment reduces operational liability');
        } else {
            mediumRisks.push('Marketplace fulfillment increases operational complexity');
            recommendations.push('Ensure adequate insurance coverage for fulfillment operations');
        }

        // Return Policy Analysis
        if (formData.returnPolicy === 'marketplace-standard') {
            lowRisks.push('Standardized return policy provides consistency');
        } else {
            mediumRisks.push('Seller-defined returns may create customer confusion');
            recommendations.push('Provide clear guidelines for seller return policies');
        }

        // Dispute Resolution Analysis
        if (formData.disputeResolution === 'arbitration') {
            lowRisks.push('Arbitration clause provides cost-effective dispute resolution');
        } else if (formData.disputeResolution === 'litigation') {
            mediumRisks.push('Litigation clauses increase legal costs');
            recommendations.push('Consider arbitration for faster, cheaper dispute resolution');
        }

        // Legal Terms Analysis
        if (formData.limitationOfLiability === 'standard') {
            lowRisks.push('Standard liability limitations provide adequate protection');
        } else if (formData.limitationOfLiability === 'limited') {
            mediumRisks.push('Limited liability clauses may not be enforceable in all jurisdictions');
            recommendations.push('Consult local counsel on liability limitation enforceability');
        }

        // Notice Period Analysis
        const noticeDays = parseInt(formData.noticePeriod);
        if (noticeDays < 15) {
            mediumRisks.push('Short termination notice may not provide adequate transition time');
            recommendations.push('Consider 30-day notice period for seller stability');
        } else if (noticeDays >= 30) {
            lowRisks.push('Adequate termination notice period');
        }

        // Overall Risk Assessment
        let overallRisk = 'low';
        if (highRisks.length >= 1) {
            overallRisk = 'high';
        } else if (mediumRisks.length >= 2) {
            overallRisk = 'medium';
        }

        return (
            <div className="risk-analysis">
                <div className={`overall-risk-card risk-${overallRisk}`}>
                    <h4>Overall Risk Level: {overallRisk.toUpperCase()}</h4>
                    <p>
                        {overallRisk === 'high' && 'Your agreement has significant legal risks that should be addressed immediately.'}
                        {overallRisk === 'medium' && 'Your agreement has moderate risks that should be reviewed with legal counsel.'}
                        {overallRisk === 'low' && 'Your agreement follows industry best practices with minimal legal risk.'}
                    </p>
                </div>

                {highRisks.length > 0 && (
                    <div className="risk-section high-risk">
                        <h4>🚨 High Priority Issues ({highRisks.length})</h4>
                        <ul>
                            {highRisks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {mediumRisks.length > 0 && (
                    <div className="risk-section medium-risk">
                        <h4>⚠️ Medium Priority Issues ({mediumRisks.length})</h4>
                        <ul>
                            {mediumRisks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {lowRisks.length > 0 && (
                    <div className="risk-section low-risk">
                        <h4>✅ Well-Protected Areas ({lowRisks.length})</h4>
                        <ul>
                            {lowRisks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="recommendations-section">
                    <h4>📋 Legal Recommendations</h4>
                    <ul>
                        {recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                        <li>Have the agreement reviewed by qualified legal counsel in your jurisdiction</li>
                        <li>Update agreement periodically to reflect changing laws and business practices</li>
                        <li>Maintain comprehensive insurance coverage appropriate for marketplace operations</li>
                    </ul>
                </div>

                <div className="next-steps-section">
                    <h4>🎯 Next Steps</h4>
                    <ol>
                        <li><strong>Address High Priority Issues:</strong> Resolve any high-risk items immediately</li>
                        <li><strong>Legal Review:</strong> Have qualified counsel review the agreement</li>
                        <li><strong>Test Agreement:</strong> Review with a sample of potential sellers</li>
                        <li><strong>Implementation:</strong> Deploy with proper seller onboarding process</li>
                        <li><strong>Monitor:</strong> Track seller acceptance rates and dispute patterns</li>
                    </ol>
                </div>

                <div className="attorney-consultation">
                    <h4>💼 Professional Legal Consultation</h4>
                    <p>This automated analysis provides general guidance but cannot replace professional legal advice. 
                    For comprehensive protection, schedule a consultation with our experienced marketplace attorneys.</p>
                    <a
                        href=""
                        onClick="Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;"
                        className="btn consult"
                        style={{ marginTop: '1rem' }}
                    >
                        📞 Schedule Legal Consultation ($350/hour)
                    </a>
                </div>
            </div>
        );
    };

    // Tab definitions
    const tabs = [
        { name: 'Marketplace Info' },
        { name: 'Commission & Fees' },
        { name: 'Product Requirements' },
        { name: 'Fulfillment & Returns' },
        { name: 'Termination Terms' },
        { name: 'Legal Terms' },
        { name: 'Legal Analysis' }
    ];

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

    return (
        <div className="container">
            <div className="header">
                <h1>Marketplace Seller Agreement Generator</h1>
                <p>Create professional marketplace seller agreements with live legal analysis</p>
            </div>

            <div className="main-content">
                {/* Form Section */}
                <div className="form-section">
                    {/* Tab Navigation */}
                    <div className="tab-nav">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                className={`tab-btn ${currentTab === index ? 'active' : ''}`}
                                onClick={() => setCurrentTab(index)}
                            >
                                {index + 1}. {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content - Using conditional rendering like AI generator */}
                    <div className="tab-content">
                        {currentTab === 0 && (
                            <div>
                                <h2>Marketplace Information</h2>
                                <div className="form-group">
                                    <label>Marketplace Name <HelpIcon tooltip={tooltips.marketplaceName} /></label>
                                    <input
                                        type="text"
                                        name="marketplaceName"
                                        value={formData.marketplaceName}
                                        onChange={handleChange}
                                        placeholder="Enter marketplace name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Marketplace URL</label>
                                    <input
                                        type="text"
                                        name="marketplaceUrl"
                                        value={formData.marketplaceUrl}
                                        onChange={handleChange}
                                        placeholder="www.example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company Address</label>
                                    <textarea
                                        name="companyAddress"
                                        value={formData.companyAddress}
                                        onChange={handleChange}
                                        placeholder="Enter company address"
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        placeholder="contact@example.com"
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab === 1 && (
                            <div>
                                <h2>Commission & Fees</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Commission Percentage (%) <HelpIcon tooltip={tooltips.commissionPercentage} /></label>
                                        <input
                                            type="number"
                                            name="commissionPercentage"
                                            min="0"
                                            max="50"
                                            step="0.1"
                                            value={formData.commissionPercentage}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Flat Fee per Transaction ($) <HelpIcon tooltip={tooltips.flatFee} /></label>
                                        <input
                                            type="number"
                                            name="flatFee"
                                            min="0"
                                            step="0.01"
                                            value={formData.flatFee}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Payment Schedule</label>
                                        <select
                                            name="paymentSchedule"
                                            value={formData.paymentSchedule}
                                            onChange={handleChange}
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="bi-weekly">Bi-weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Payment Method</label>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleChange}
                                        >
                                            <option value="ACH Transfer">ACH Transfer</option>
                                            <option value="Wire Transfer">Wire Transfer</option>
                                            <option value="Check">Check</option>
                                            <option value="PayPal">PayPal</option>
                                            <option value="Stripe">Stripe</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentTab === 2 && (
                            <div>
                                <h2>Product Requirements</h2>
                                <div className="form-group">
                                    <label>Prohibited Items <HelpIcon tooltip={tooltips.prohibitedItems} /></label>
                                    <textarea
                                        name="prohibitedItems"
                                        value={formData.prohibitedItems}
                                        onChange={handleChange}
                                        placeholder="List prohibited items or categories..."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Listing Requirements</label>
                                    <textarea
                                        name="listingRequirements"
                                        value={formData.listingRequirements}
                                        onChange={handleChange}
                                        placeholder="Specify listing requirements..."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quality Standards</label>
                                    <textarea
                                        name="qualityStandards"
                                        value={formData.qualityStandards}
                                        onChange={handleChange}
                                        placeholder="Define quality standards..."
                                        rows="2"
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab === 3 && (
                            <div>
                                <h2>Fulfillment & Returns</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Fulfillment Responsibility <HelpIcon tooltip={tooltips.fulfillmentResponsibility} /></label>
                                        <select
                                            name="fulfillmentResponsibility"
                                            value={formData.fulfillmentResponsibility}
                                            onChange={handleChange}
                                        >
                                            <option value="seller">Seller</option>
                                            <option value="marketplace">Marketplace</option>
                                            <option value="shared">Shared</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Shipping Timeframe</label>
                                        <input
                                            type="text"
                                            name="shippingTimeframe"
                                            value={formData.shippingTimeframe}
                                            onChange={handleChange}
                                            placeholder="e.g., 1-3 business days"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Return Policy <HelpIcon tooltip={tooltips.returnPolicy} /></label>
                                        <select
                                            name="returnPolicy"
                                            value={formData.returnPolicy}
                                            onChange={handleChange}
                                        >
                                            <option value="marketplace-standard">Marketplace Standard</option>
                                            <option value="seller-defined">Seller Defined</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Return Timeframe (days)</label>
                                        <input
                                            type="number"
                                            name="returnTimeframe"
                                            min="0"
                                            max="365"
                                            value={formData.returnTimeframe}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Customer Service Responsibility</label>
                                    <select
                                        name="customerServiceResponsibility"
                                        value={formData.customerServiceResponsibility}
                                        onChange={handleChange}
                                    >
                                        <option value="seller">Seller</option>
                                        <option value="marketplace">Marketplace</option>
                                        <option value="shared">Shared</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentTab === 4 && (
                            <div>
                                <h2>Termination Terms</h2>
                                <div className="form-group">
                                    <label>Notice Period (days) <HelpIcon tooltip={tooltips.noticePeriod} /></label>
                                    <input
                                        type="number"
                                        name="noticePeriod"
                                        min="0"
                                        max="365"
                                        value={formData.noticePeriod}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Termination Reasons</label>
                                    <textarea
                                        name="terminationReasons"
                                        value={formData.terminationReasons}
                                        onChange={handleChange}
                                        placeholder="Specify reasons for termination..."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Post-Termination Obligations</label>
                                    <textarea
                                        name="postTerminationObligations"
                                        value={formData.postTerminationObligations}
                                        onChange={handleChange}
                                        placeholder="Specify post-termination obligations..."
                                        rows="2"
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab === 5 && (
                            <div>
                                <h2>Legal Terms</h2>
                                <div className="form-group">
                                    <label>Governing Law <HelpIcon tooltip={tooltips.governingLaw} /></label>
                                    <input
                                        type="text"
                                        name="governingLaw"
                                        value={formData.governingLaw}
                                        onChange={handleChange}
                                        placeholder="e.g., State of California, USA"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Dispute Resolution <HelpIcon tooltip={tooltips.disputeResolution} /></label>
                                        <select
                                            name="disputeResolution"
                                            value={formData.disputeResolution}
                                            onChange={handleChange}
                                        >
                                            <option value="arbitration">Arbitration</option>
                                            <option value="mediation">Mediation</option>
                                            <option value="litigation">Litigation</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Limitation of Liability</label>
                                        <select
                                            name="limitationOfLiability"
                                            value={formData.limitationOfLiability}
                                            onChange={handleChange}
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="comprehensive">Comprehensive</option>
                                            <option value="limited">Limited</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Intellectual Property</label>
                                    <select
                                        name="intellectualProperty"
                                        value={formData.intellectualProperty}
                                        onChange={handleChange}
                                    >
                                        <option value="seller-retains">Seller Retains Rights</option>
                                        <option value="shared">Shared Rights</option>
                                        <option value="marketplace-license">Marketplace License</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Legal Analysis Tab */}
                        {currentTab === 6 && (
                            <div>
                                <h2>Legal Analysis & Recommendations</h2>
                                <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                                    Professional legal analysis of your marketplace agreement. This assessment identifies 
                                    potential risks and provides recommendations to strengthen your legal position.
                                </p>
                                <div className="risk-analysis-content">
                                    {generateRiskAnalysis()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="nav-buttons">
                        <button
                            className="btn secondary"
                            onClick={prevTab}
                            disabled={currentTab === 0}
                        >
                            ← Previous
                        </button>
                        
                        <button
                            className="btn copy"
                            onClick={copyToClipboard}
                        >
                            📋 Copy Agreement
                        </button>
                        
                        <button
                            className="btn download"
                            onClick={() => generateWordDocument(documentText, formData)}
                        >
                            📄 Download DOCX
                        </button>
                        
                        <button
                            className="btn"
                            onClick={nextTab}
                            disabled={currentTab === tabs.length - 1}
                        >
                            Next →
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="preview-section">
                    <div className="preview-header">
                        <h3>Live Preview</h3>
                        <small>Updates as you type • Changes highlighted in yellow</small>
                    </div>
                    <div className="preview-content" ref={previewRef}>
                        <div 
                            style={{ whiteSpace: 'pre-wrap', fontFamily: 'Times, serif' }}
                            dangerouslySetInnerHTML={{ __html: highlightedText.replace(/\n/g, '<br>') }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<MarketplaceGenerator />, document.getElementById('root'));