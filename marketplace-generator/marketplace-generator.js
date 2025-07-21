const { useState, useEffect, useRef } = React;

const MarketplaceGenerator = () => {
    // Form data state
    const [formData, setFormData] = useState({
        marketplaceName: 'Example Marketplace',
        marketplaceUrl: 'www.example-marketplace.com',
        companyName: 'Example Marketplace LLC',
        companyAddress: '123 Main Street, San Francisco, CA 94105',
        contactEmail: 'contact@example-marketplace.com',
        
        commissionPercentage: '15',
        flatFee: '0.30',
        paymentSchedule: 'bi-weekly',
        paymentMethod: 'ACH Transfer',
        
        prohibitedItems: 'Illegal items, counterfeit goods, hazardous materials, weapons, adult content',
        listingRequirements: 'High-quality product images, detailed descriptions, accurate pricing, proper categorization',
        qualityStandards: 'All products must meet marketplace quality standards',
        
        fulfillmentResponsibility: 'seller',
        shippingTimeframe: '1-3 business days',
        returnPolicy: 'marketplace-standard',
        returnTimeframe: '30',
        customerServiceResponsibility: 'seller',
        
        noticePeriod: '30',
        terminationReasons: 'Breach of agreement, violation of policies, fraudulent activity',
        postTerminationObligations: 'Complete pending orders, honor return policy',
        
        governingLaw: 'State of California, USA',
        disputeResolution: 'arbitration',
        limitationOfLiability: 'standard',
        intellectualProperty: 'seller-retains'
    });

    const [currentTab, setCurrentTab] = useState(0);
    const previewRef = useRef(null);

    // Handle form changes
    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Generate document text
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

    // Tab content components
    const MarketplaceInfoTab = () => (
        <div>
            <h2>Marketplace Information</h2>
            <div className="form-group">
                <label>Marketplace Name</label>
                <input
                    type="text"
                    value={formData.marketplaceName}
                    onChange={(e) => handleChange('marketplaceName', e.target.value)}
                    placeholder="Enter marketplace name"
                />
            </div>
            <div className="form-group">
                <label>Marketplace URL</label>
                <input
                    type="text"
                    value={formData.marketplaceUrl}
                    onChange={(e) => handleChange('marketplaceUrl', e.target.value)}
                    placeholder="www.example.com"
                />
            </div>
            <div className="form-group">
                <label>Company Name</label>
                <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                />
            </div>
            <div className="form-group">
                <label>Company Address</label>
                <textarea
                    value={formData.companyAddress}
                    onChange={(e) => handleChange('companyAddress', e.target.value)}
                    placeholder="Enter company address"
                    rows="3"
                />
            </div>
            <div className="form-group">
                <label>Contact Email</label>
                <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="contact@example.com"
                />
            </div>
        </div>
    );

    const CommissionTab = () => (
        <div>
            <h2>Commission & Fees</h2>
            <div className="form-row">
                <div className="form-group">
                    <label>Commission Percentage (%)</label>
                    <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        value={formData.commissionPercentage}
                        onChange={(e) => handleChange('commissionPercentage', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Flat Fee per Transaction ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.flatFee}
                        onChange={(e) => handleChange('flatFee', e.target.value)}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Payment Schedule</label>
                    <select
                        value={formData.paymentSchedule}
                        onChange={(e) => handleChange('paymentSchedule', e.target.value)}
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
                        value={formData.paymentMethod}
                        onChange={(e) => handleChange('paymentMethod', e.target.value)}
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
    );

    const ProductRequirementsTab = () => (
        <div>
            <h2>Product Requirements</h2>
            <div className="form-group">
                <label>Prohibited Items</label>
                <textarea
                    value={formData.prohibitedItems}
                    onChange={(e) => handleChange('prohibitedItems', e.target.value)}
                    placeholder="List prohibited items or categories..."
                    rows="3"
                />
            </div>
            <div className="form-group">
                <label>Listing Requirements</label>
                <textarea
                    value={formData.listingRequirements}
                    onChange={(e) => handleChange('listingRequirements', e.target.value)}
                    placeholder="Specify listing requirements..."
                    rows="3"
                />
            </div>
            <div className="form-group">
                <label>Quality Standards</label>
                <textarea
                    value={formData.qualityStandards}
                    onChange={(e) => handleChange('qualityStandards', e.target.value)}
                    placeholder="Define quality standards..."
                    rows="2"
                />
            </div>
        </div>
    );

    const FulfillmentTab = () => (
        <div>
            <h2>Fulfillment & Returns</h2>
            <div className="form-row">
                <div className="form-group">
                    <label>Fulfillment Responsibility</label>
                    <select
                        value={formData.fulfillmentResponsibility}
                        onChange={(e) => handleChange('fulfillmentResponsibility', e.target.value)}
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
                        value={formData.shippingTimeframe}
                        onChange={(e) => handleChange('shippingTimeframe', e.target.value)}
                        placeholder="e.g., 1-3 business days"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Return Policy</label>
                    <select
                        value={formData.returnPolicy}
                        onChange={(e) => handleChange('returnPolicy', e.target.value)}
                    >
                        <option value="marketplace-standard">Marketplace Standard</option>
                        <option value="seller-defined">Seller Defined</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Return Timeframe (days)</label>
                    <input
                        type="number"
                        min="0"
                        max="365"
                        value={formData.returnTimeframe}
                        onChange={(e) => handleChange('returnTimeframe', e.target.value)}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Customer Service Responsibility</label>
                <select
                    value={formData.customerServiceResponsibility}
                    onChange={(e) => handleChange('customerServiceResponsibility', e.target.value)}
                >
                    <option value="seller">Seller</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="shared">Shared</option>
                </select>
            </div>
        </div>
    );

    const TerminationTab = () => (
        <div>
            <h2>Termination Terms</h2>
            <div className="form-group">
                <label>Notice Period (days)</label>
                <input
                    type="number"
                    min="0"
                    max="365"
                    value={formData.noticePeriod}
                    onChange={(e) => handleChange('noticePeriod', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Termination Reasons</label>
                <textarea
                    value={formData.terminationReasons}
                    onChange={(e) => handleChange('terminationReasons', e.target.value)}
                    placeholder="Specify reasons for termination..."
                    rows="3"
                />
            </div>
            <div className="form-group">
                <label>Post-Termination Obligations</label>
                <textarea
                    value={formData.postTerminationObligations}
                    onChange={(e) => handleChange('postTerminationObligations', e.target.value)}
                    placeholder="Specify post-termination obligations..."
                    rows="2"
                />
            </div>
        </div>
    );

    const LegalTermsTab = () => (
        <div>
            <h2>Legal Terms</h2>
            <div className="form-group">
                <label>Governing Law</label>
                <input
                    type="text"
                    value={formData.governingLaw}
                    onChange={(e) => handleChange('governingLaw', e.target.value)}
                    placeholder="e.g., State of California, USA"
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Dispute Resolution</label>
                    <select
                        value={formData.disputeResolution}
                        onChange={(e) => handleChange('disputeResolution', e.target.value)}
                    >
                        <option value="arbitration">Arbitration</option>
                        <option value="mediation">Mediation</option>
                        <option value="litigation">Litigation</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Limitation of Liability</label>
                    <select
                        value={formData.limitationOfLiability}
                        onChange={(e) => handleChange('limitationOfLiability', e.target.value)}
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
                    value={formData.intellectualProperty}
                    onChange={(e) => handleChange('intellectualProperty', e.target.value)}
                >
                    <option value="seller-retains">Seller Retains Rights</option>
                    <option value="shared">Shared Rights</option>
                    <option value="marketplace-license">Marketplace License</option>
                </select>
            </div>
        </div>
    );

    const tabs = [
        { name: 'Marketplace Info', component: MarketplaceInfoTab },
        { name: 'Commission & Fees', component: CommissionTab },
        { name: 'Product Requirements', component: ProductRequirementsTab },
        { name: 'Fulfillment & Returns', component: FulfillmentTab },
        { name: 'Termination Terms', component: TerminationTab },
        { name: 'Legal Terms', component: LegalTermsTab }
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

    const documentText = generateDocumentText();

    return (
        <div className="container">
            <div className="header">
                <h1>Marketplace Seller Agreement Generator</h1>
                <p>Create professional marketplace seller agreements</p>
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

                    {/* Tab Content */}
                    <div className="tab-content">
                        {React.createElement(tabs[currentTab].component)}
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
                            📋 Copy
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

                    {/* Consultation Link */}
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <a
                            href=""
                            onClick="Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;"
                            className="btn consult"
                        >
                            📞 Schedule Legal Consultation
                        </a>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="preview-section">
                    <div className="preview-header">
                        <h3>Live Preview</h3>
                        <small>Updates as you type</small>
                    </div>
                    <div className="preview-content" ref={previewRef}>
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Times, serif' }}>
                            {documentText}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<MarketplaceGenerator />, document.getElementById('root'));