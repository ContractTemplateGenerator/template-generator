const { useState, useRef, useEffect } = React;

const AppraisalGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const [formData, setFormData] = useState({
        // Business Information
        appraiserName: '',
        businessName: '',
        licenseNumber: '',
        address: '',
        city: '',
        state: 'CA',
        zipCode: '',
        phone: '',
        email: '',
        
        // Client Information
        clientName: '',
        clientAddress: '',
        clientCity: '',
        clientState: 'CA',
        clientZipCode: '',
        clientPhone: '',
        clientEmail: '',
        
        // Service Details
        appraisalType: 'jewelry',
        itemDescription: '',
        purposeOfAppraisal: 'insurance',
        estimatedValue: '',
        inspectionLocation: 'office',
        rushService: false,
        
        // Pricing
        baseFee: '250',
        hourlyRate: '150',
        rushFee: '100',
        travelFee: '50',
        paymentTerms: 'upfront',
        
        // Legal Terms
        limitationOfLiability: true,
        clientConfidentiality: true,
        disputeResolution: 'mediation',
        governingLaw: 'California',
        
        // Additional Terms
        deliveryMethod: 'email',
        reportFormat: 'written',
        photosIncluded: true,
        validityPeriod: '12',
        cancellationPolicy: 'standard'
    });

    const previewRef = useRef(null);

    // Tab configuration
    const tabs = [
        { id: 'business', label: 'Business Info', icon: 'briefcase' },
        { id: 'client', label: 'Client Info', icon: 'user' },
        { id: 'service', label: 'Service Details', icon: 'clipboard' },
        { id: 'pricing', label: 'Pricing', icon: 'dollar-sign' },
        { id: 'legal', label: 'Legal Terms', icon: 'shield' },
        { id: 'finalize', label: 'Review & Risk', icon: 'check-circle' }
    ];

    // Quick presets for different appraisal types
    const appraisalPresets = {
        jewelry: {
            appraisalType: 'jewelry',
            baseFee: '250',
            hourlyRate: '150',
            itemDescription: 'Fine jewelry, watches, precious stones'
        },
        antiques: {
            appraisalType: 'antiques',
            baseFee: '300',
            hourlyRate: '175',
            itemDescription: 'Antique furniture, collectibles, art objects'
        },
        artwork: {
            appraisalType: 'artwork',
            baseFee: '350',
            hourlyRate: '200',
            itemDescription: 'Paintings, sculptures, prints, photography'
        },
        luxury_goods: {
            appraisalType: 'luxury_goods',
            baseFee: '275',
            hourlyRate: '160',
            itemDescription: 'Designer handbags, luxury watches, fine clothing'
        },
        coins: {
            appraisalType: 'coins',
            baseFee: '200',
            hourlyRate: '125',
            itemDescription: 'Rare coins, currency, numismatic items'
        },
        firearms: {
            appraisalType: 'firearms',
            baseFee: '225',
            hourlyRate: '140',
            itemDescription: 'Firearms, ammunition, military collectibles'
        }
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLastChanged(name);
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear highlighting after 3 seconds
        setTimeout(() => setLastChanged(null), 3000);
    };

    // Apply preset
    const applyPreset = (presetKey) => {
        const preset = appraisalPresets[presetKey];
        setFormData(prev => ({ ...prev, ...preset }));
        setLastChanged('preset');
        setTimeout(() => setLastChanged(null), 3000);
    };
    // Generate document text
    const generateDocument = () => {
        const today = new Date().toLocaleDateString();
        
        return `APPRAISAL SERVICES AGREEMENT

This Appraisal Services Agreement ("Agreement") is entered into on ${today}, between ${formData.businessName || formData.appraiserName} ("Appraiser"), a ${formData.governingLaw} business located at ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, and ${formData.clientName} ("Client"), located at ${formData.clientAddress}, ${formData.clientCity}, ${formData.clientState} ${formData.clientZipCode}.

1. SCOPE OF SERVICES

Appraiser agrees to provide professional appraisal services for the following item(s): ${formData.itemDescription}. The appraisal will be conducted for ${formData.purposeOfAppraisal === 'insurance' ? 'insurance replacement value' : formData.purposeOfAppraisal === 'estate' ? 'estate tax purposes' : formData.purposeOfAppraisal === 'donation' ? 'charitable donation tax deduction' : formData.purposeOfAppraisal === 'divorce' ? 'equitable distribution in divorce proceedings' : 'fair market value determination'} purposes.

The appraisal will include:
- Physical examination and evaluation of the item(s)
- Research of comparable sales and market data
- ${formData.reportFormat === 'written' ? 'Written appraisal report' : 'Verbal appraisal summary'}${formData.photosIncluded ? '\n- Digital photographs of the appraised item(s)' : ''}
- Professional opinion of value based on current market conditions

${formData.inspectionLocation === 'office' ? 'The inspection will take place at Appraiser\'s office.' : formData.inspectionLocation === 'client_location' ? 'The inspection will take place at Client\'s location.' : 'The inspection location will be mutually agreed upon by both parties.'}

2. FEES AND PAYMENT TERMS

Base appraisal fee: $${formData.baseFee}
${formData.hourlyRate ? `Additional hourly rate for complex items: $${formData.hourlyRate}/hour` : ''}
${formData.rushService ? `Rush service fee (for completion within 48 hours): $${formData.rushFee}` : ''}
${formData.inspectionLocation === 'client_location' ? `Travel fee for on-site inspection: $${formData.travelFee}` : ''}

Payment Terms: ${formData.paymentTerms === 'upfront' ? 'Full payment due before services commence' : formData.paymentTerms === '50_50' ? '50% due upfront, 50% upon completion' : formData.paymentTerms === 'completion' ? 'Full payment due upon completion' : 'Net 30 days from invoice date'}.

3. DELIVERY AND TIMELINE

The completed appraisal will be delivered via ${formData.deliveryMethod === 'email' ? 'email in PDF format' : formData.deliveryMethod === 'mail' ? 'certified mail' : 'secure client portal'} within ${formData.rushService ? '48 hours' : '5-7 business days'} of the inspection date, subject to the complexity of the appraisal and availability of comparable market data.

4. VALIDITY AND ACCURACY

This appraisal is valid for ${formData.validityPeriod} months from the date of the report. Market values fluctuate, and this appraisal reflects values as of the inspection date. Appraiser makes no warranty as to future values or market conditions.

5. LIMITATION OF LIABILITY AND DISCLAIMERS

${formData.limitationOfLiability ? `APPRAISER'S LIABILITY SHALL BE LIMITED TO THE AMOUNT OF FEES PAID FOR THE APPRAISAL SERVICES. APPRAISER SHALL NOT BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, OR PUNITIVE DAMAGES ARISING FROM THIS AGREEMENT OR THE APPRAISAL SERVICES.

The appraisal represents Appraiser's professional opinion of value based on market research and expertise. The appraisal is not a guarantee of the price that may be obtained if the item is sold. Actual sale prices may vary due to market conditions, buyer preferences, and other factors beyond Appraiser's control.` : 'Standard professional liability terms apply as governed by applicable law and professional standards.'}

6. CONFIDENTIALITY

${formData.clientConfidentiality ? `Appraiser agrees to maintain strict confidentiality regarding Client's identity, the appraised items, and their values. This information will not be disclosed to third parties without Client's written consent, except as required by law or professional standards.` : 'Standard confidentiality practices will be maintained in accordance with professional appraisal standards.'}

7. CANCELLATION POLICY

${formData.cancellationPolicy === 'standard' ? 'Client may cancel this agreement with 24 hours written notice. If canceled after the inspection has begun, Client is responsible for payment of services rendered up to the cancellation point.' : formData.cancellationPolicy === 'strict' ? 'Client may cancel with 48 hours written notice. Cancellations with less notice may result in a 50% cancellation fee.' : 'Flexible cancellation terms apply - please discuss with Appraiser.'}

8. DISPUTE RESOLUTION

Any disputes arising under this Agreement shall be resolved through ${formData.disputeResolution === 'mediation' ? 'binding mediation' : formData.disputeResolution === 'arbitration' ? 'binding arbitration' : 'the courts'} in ${formData.governingLaw}. This Agreement shall be governed by the laws of ${formData.governingLaw}.

9. PROFESSIONAL STANDARDS

Appraiser ${formData.licenseNumber ? `(License #${formData.licenseNumber}) ` : ''}agrees to perform all services in accordance with the Uniform Standards of Professional Appraisal Practice (USPAP) and applicable professional standards for ${formData.appraisalType} appraisals.

10. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties. Any modifications must be in writing and signed by both parties.

By signing below, both parties acknowledge they have read, understood, and agree to be bound by the terms of this Agreement.

APPRAISER:                          CLIENT:

_________________________         _________________________
${formData.appraiserName}                    ${formData.clientName}
${formData.businessName}
Date: ________________            Date: ________________

Contact Information:
Appraiser: ${formData.phone} | ${formData.email}
Client: ${formData.clientPhone} | ${formData.clientEmail}`;
    };

    const documentText = generateDocument();
    // Highlighting logic
    const getSectionToHighlight = () => {
        if (!lastChanged) return null;
        
        switch (currentTab) {
            case 0: // Business Info
                if (['appraiserName', 'businessName', 'address', 'city', 'state', 'zipCode'].includes(lastChanged)) {
                    return 'business-info';
                }
                break;
            case 1: // Client Info
                if (['clientName', 'clientAddress', 'clientCity', 'clientState', 'clientZipCode'].includes(lastChanged)) {
                    return 'client-info';
                }
                break;
            case 2: // Service Details
                if (['appraisalType', 'itemDescription', 'purposeOfAppraisal', 'inspectionLocation'].includes(lastChanged)) {
                    return 'service-details';
                }
                break;
            case 3: // Pricing
                if (['baseFee', 'hourlyRate', 'rushFee', 'travelFee', 'paymentTerms'].includes(lastChanged)) {
                    return 'pricing-section';
                }
                break;
            case 4: // Legal Terms
                if (['limitationOfLiability', 'clientConfidentiality', 'disputeResolution'].includes(lastChanged)) {
                    return 'legal-terms';
                }
                break;
        }
        return null;
    };

    const createHighlightedText = () => {
        const sectionToHighlight = getSectionToHighlight();
        if (!sectionToHighlight) return documentText;
        
        const sections = {
            'business-info': /(between\s+.*?\("Appraiser"\),.*?and)/s,
            'client-info': /(and\s+.*?\("Client"\),.*?\.)/s,
            'service-details': /(SCOPE OF SERVICES.*?(?=2\. FEES))/s,
            'pricing-section': /(2\. FEES AND PAYMENT TERMS.*?(?=3\. DELIVERY))/s,
            'legal-terms': /(5\. LIMITATION OF LIABILITY.*?(?=6\. CONFIDENTIALITY))/s
        };
        
        if (sections[sectionToHighlight]) {
            return documentText.replace(sections[sectionToHighlight], match => 
                `<span class="highlighted-text">${match}</span>`
            );
        }
        
        return documentText;
    };

    const highlightedText = createHighlightedText();

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

    // Utility functions
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(documentText);
            alert('Agreement copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try selecting and copying manually.');
        }
    };

    const downloadAsWord = () => {
        try {
            console.log("Download MS Word button clicked");
            
            if (!documentText) {
                console.error("Document text is empty");
                alert("Cannot generate document - text is empty. Please check the form data.");
                return;
            }
            
            window.generateWordDoc(documentText, {
                documentTitle: "Appraisal Services Agreement",
                fileName: `Appraisal-Agreement-${formData.clientName?.replace(/\s+/g, '-') || 'Client'}`
            });
        } catch (error) {
            console.error("Error in downloadAsWord:", error);
            alert("Error generating Word document. Please try again or use the copy option.");
        }
    };

    const openConsultation = () => {
        Calendly.initPopupWidget({
            url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
        });
    };

    // Risk assessment function
    const getRiskAssessment = () => {
        const risks = [];
        
        // Check for missing critical information
        if (!formData.appraiserName || !formData.businessName) {
            risks.push({
                level: 'high',
                title: 'Missing Business Identity',
                description: 'Appraiser name and business name are critical for legal enforceability.'
            });
        }
        
        if (!formData.licenseNumber && ['jewelry', 'antiques', 'artwork'].includes(formData.appraisalType)) {
            risks.push({
                level: 'medium',
                title: 'Missing License Information',
                description: 'Professional license number adds credibility and may be required in your jurisdiction.'
            });
        }
        
        if (!formData.limitationOfLiability) {
            risks.push({
                level: 'high',
                title: 'No Liability Limitation',
                description: 'Without liability limitations, you may be exposed to significant financial risk if disputes arise.'
            });
        }
        
        if (formData.paymentTerms === 'completion') {
            risks.push({
                level: 'medium',
                title: 'Payment Risk',
                description: 'Payment after completion increases risk of non-payment. Consider requiring partial upfront payment.'
            });
        }
        
        if (!formData.clientConfidentiality && formData.appraisalType === 'artwork') {
            risks.push({
                level: 'medium',
                title: 'Confidentiality Concerns',
                description: 'Art appraisals often involve sensitive ownership information. Consider adding confidentiality clauses.'
            });
        }
        
        if (formData.validityPeriod > 12) {
            risks.push({
                level: 'low',
                title: 'Extended Validity Period',
                description: 'Appraisal validity over 12 months may not reflect current market conditions.'
            });
        }
        
        // Add positive assessments
        if (formData.limitationOfLiability && formData.clientConfidentiality && formData.licenseNumber) {
            risks.push({
                level: 'low',
                title: 'Well-Protected Agreement',
                description: 'Good liability protection and professional standards compliance.'
            });
        }
        
        return risks;
    };
    // Effect to scroll to highlighted text
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            const highlightedElement = previewRef.current.querySelector('.highlighted-text');
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [highlightedText]);

    // Render tab content
    const renderTabContent = () => {
        switch (currentTab) {
            case 0: // Business Info
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="briefcase"></i> Business Information
                        </h3>
                        
                        <div className="info-box">
                            <p>Enter your business details as they should appear on the agreement.</p>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Appraiser Name *</label>
                                <input
                                    type="text"
                                    name="appraiserName"
                                    value={formData.appraiserName}
                                    onChange={handleChange}
                                    placeholder="John Smith"
                                />
                            </div>
                            <div className="form-group">
                                <label>Business Name</label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    placeholder="Smith Appraisal Services LLC"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Professional License #</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="ASA-12345"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
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
                                placeholder="123 Main Street, Suite 100"
                            />
                        </div>
                        
                        <div className="form-row three-cols">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Los Angeles"
                                />
                            </div>
                            <div className="form-group">
                                <label>State *</label>
                                <select name="state" value={formData.state} onChange={handleChange}>
                                    <option value="AL">Alabama</option>
                                    <option value="CA">California</option>
                                    <option value="FL">Florida</option>
                                    <option value="NY">New York</option>
                                    <option value="TX">Texas</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>ZIP Code *</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="90210"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@smithappraisals.com"
                            />
                        </div>
                    </div>
                );

            case 1: // Client Info
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="user"></i> Client Information
                        </h3>
                        
                        <div className="info-box">
                            <p>Enter your client's information as it should appear on the agreement.</p>
                        </div>
                        
                        <div className="form-group">
                            <label>Client Name *</label>
                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Client Address *</label>
                            <input
                                type="text"
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleChange}
                                placeholder="456 Oak Avenue"
                            />
                        </div>
                        
                        <div className="form-row three-cols">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="clientCity"
                                    value={formData.clientCity}
                                    onChange={handleChange}
                                    placeholder="Beverly Hills"
                                />
                            </div>
                            <div className="form-group">
                                <label>State *</label>
                                <select name="clientState" value={formData.clientState} onChange={handleChange}>
                                    <option value="AL">Alabama</option>
                                    <option value="CA">California</option>
                                    <option value="FL">Florida</option>
                                    <option value="NY">New York</option>
                                    <option value="TX">Texas</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>ZIP Code *</label>
                                <input
                                    type="text"
                                    name="clientZipCode"
                                    value={formData.clientZipCode}
                                    onChange={handleChange}
                                    placeholder="90210"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Client Phone</label>
                                <input
                                    type="tel"
                                    name="clientPhone"
                                    value={formData.clientPhone}
                                    onChange={handleChange}
                                    placeholder="(555) 987-6543"
                                />
                            </div>
                            <div className="form-group">
                                <label>Client Email</label>
                                <input
                                    type="email"
                                    name="clientEmail"
                                    value={formData.clientEmail}
                                    onChange={handleChange}
                                    placeholder="jane@email.com"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Service Details
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="clipboard"></i> Service Details
                        </h3>
                        
                        <div className="info-box">
                            <p>Select quick presets or customize your appraisal service details.</p>
                        </div>
                        
                        <div className="form-group">
                            <label>Quick Presets</label>
                            <div className="quick-presets">
                                {Object.entries(appraisalPresets).map(([key, preset]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`preset-button ${formData.appraisalType === key ? 'active' : ''}`}
                                        onClick={() => applyPreset(key)}
                                    >
                                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Appraisal Type *</label>
                                <select name="appraisalType" value={formData.appraisalType} onChange={handleChange}>
                                    <option value="jewelry">Jewelry</option>
                                    <option value="antiques">Antiques</option>
                                    <option value="artwork">Artwork</option>
                                    <option value="luxury_goods">Luxury Goods</option>
                                    <option value="coins">Coins & Currency</option>
                                    <option value="firearms">Firearms</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Purpose of Appraisal *</label>
                                <select name="purposeOfAppraisal" value={formData.purposeOfAppraisal} onChange={handleChange}>
                                    <option value="insurance">Insurance</option>
                                    <option value="estate">Estate/Tax</option>
                                    <option value="donation">Charitable Donation</option>
                                    <option value="divorce">Divorce/Equitable Distribution</option>
                                    <option value="sale">Fair Market Value</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Item Description *</label>
                            <textarea
                                name="itemDescription"
                                value={formData.itemDescription}
                                onChange={handleChange}
                                placeholder="Detailed description of items to be appraised..."
                                rows="3"
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Inspection Location *</label>
                                <select name="inspectionLocation" value={formData.inspectionLocation} onChange={handleChange}>
                                    <option value="office">Appraiser's Office</option>
                                    <option value="client_location">Client's Location</option>
                                    <option value="mutual">Mutually Agreed Location</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Estimated Value Range</label>
                                <input
                                    type="text"
                                    name="estimatedValue"
                                    value={formData.estimatedValue}
                                    onChange={handleChange}
                                    placeholder="$5,000 - $10,000"
                                />
                            </div>
                        </div>
                        
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="rushService"
                                checked={formData.rushService}
                                onChange={handleChange}
                            />
                            <label>Rush Service (48-hour completion)</label>
                        </div>
                    </div>
                );
            case 3: // Pricing
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="dollar-sign"></i> Pricing Structure
                        </h3>
                        
                        <div className="info-box">
                            <p>Set your fee structure and payment terms.</p>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Base Appraisal Fee *</label>
                                <input
                                    type="number"
                                    name="baseFee"
                                    value={formData.baseFee}
                                    onChange={handleChange}
                                    placeholder="250"
                                />
                            </div>
                            <div className="form-group">
                                <label>Hourly Rate (Complex Items)</label>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    placeholder="150"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Rush Service Fee</label>
                                <input
                                    type="number"
                                    name="rushFee"
                                    value={formData.rushFee}
                                    onChange={handleChange}
                                    placeholder="100"
                                />
                            </div>
                            <div className="form-group">
                                <label>Travel Fee (On-site)</label>
                                <input
                                    type="number"
                                    name="travelFee"
                                    value={formData.travelFee}
                                    onChange={handleChange}
                                    placeholder="50"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Payment Terms *</label>
                            <select name="paymentTerms" value={formData.paymentTerms} onChange={handleChange}>
                                <option value="upfront">Full Payment Upfront</option>
                                <option value="50_50">50% Upfront, 50% on Completion</option>
                                <option value="completion">Full Payment on Completion</option>
                                <option value="net30">Net 30 Days</option>
                            </select>
                        </div>
                    </div>
                );

            case 4: // Legal Terms
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="shield"></i> Legal Terms & Protection
                        </h3>
                        
                        <div className="info-box">
                            <p>Configure legal protections and terms for your agreement.</p>
                        </div>
                        
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="limitationOfLiability"
                                checked={formData.limitationOfLiability}
                                onChange={handleChange}
                            />
                            <label>Include Limitation of Liability Clause (Recommended)</label>
                        </div>
                        
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="clientConfidentiality"
                                checked={formData.clientConfidentiality}
                                onChange={handleChange}
                            />
                            <label>Include Client Confidentiality Clause</label>
                        </div>
                        
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="photosIncluded"
                                checked={formData.photosIncluded}
                                onChange={handleChange}
                            />
                            <label>Include Digital Photos in Report</label>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Dispute Resolution *</label>
                                <select name="disputeResolution" value={formData.disputeResolution} onChange={handleChange}>
                                    <option value="mediation">Binding Mediation</option>
                                    <option value="arbitration">Binding Arbitration</option>
                                    <option value="courts">Court System</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Governing Law *</label>
                                <select name="governingLaw" value={formData.governingLaw} onChange={handleChange}>
                                    <option value="California">California</option>
                                    <option value="New York">New York</option>
                                    <option value="Texas">Texas</option>
                                    <option value="Florida">Florida</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Report Delivery Method *</label>
                                <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange}>
                                    <option value="email">Email (PDF)</option>
                                    <option value="mail">Certified Mail</option>
                                    <option value="portal">Secure Client Portal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Appraisal Validity (Months) *</label>
                                <select name="validityPeriod" value={formData.validityPeriod} onChange={handleChange}>
                                    <option value="6">6 Months</option>
                                    <option value="12">12 Months</option>
                                    <option value="24">24 Months</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Cancellation Policy *</label>
                            <select name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange}>
                                <option value="standard">Standard (24 hours notice)</option>
                                <option value="strict">Strict (48 hours notice + fee)</option>
                                <option value="flexible">Flexible (case-by-case)</option>
                            </select>
                        </div>
                    </div>
                );

            case 5: // Risk Assessment
                const risks = getRiskAssessment();
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="check-circle"></i> Agreement Review & Risk Assessment
                        </h3>
                        
                        <div className="info-box">
                            <p>Review your agreement settings and assess potential risks.</p>
                        </div>
                        
                        <div className="risk-assessment">
                            <h4>Risk Analysis</h4>
                            {risks.map((risk, index) => (
                                <div key={index} className={`risk-item ${risk.level}`}>
                                    <div className={`risk-indicator ${risk.level}`}></div>
                                    <div className="risk-content">
                                        <h4>{risk.title}</h4>
                                        <p>{risk.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ marginTop: '20px' }}>
                            <h4>Agreement Summary</h4>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <p><strong>Appraiser:</strong> {formData.appraiserName || '[Not specified]'} ({formData.businessName || '[Business name not provided]'})</p>
                                <p><strong>Client:</strong> {formData.clientName || '[Not specified]'}</p>
                                <p><strong>Service:</strong> {formData.appraisalType?.replace('_', ' ')} appraisal for {formData.purposeOfAppraisal}</p>
                                <p><strong>Base Fee:</strong> ${formData.baseFee || '0'}</p>
                                <p><strong>Payment Terms:</strong> {formData.paymentTerms?.replace('_', ' ')}</p>
                                <p><strong>Liability Protection:</strong> {formData.limitationOfLiability ? 'Included' : 'Not included'}</p>
                                <p><strong>Confidentiality:</strong> {formData.clientConfidentiality ? 'Included' : 'Not included'}</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Tab content not found</div>;
        }
    };