const { useState, useEffect, useRef } = React;

const InteriorDesignAgreementGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [showPaywall, setShowPaywall] = useState(true);
    const previewRef = useRef(null);

    // Complete form data state
    const [formData, setFormData] = useState({
        // Designer Information
        designerName: 'Prestige Interiors LLC',
        designerEntity: 'limited liability company',
        designerState: 'California',
        designerAddress: '1234 Design Avenue, Los Angeles, CA 90210',
        
        // Client Information
        clientName: '',
        clientType: 'individual',
        clientAddress: '',
        
        // Project Information
        projectAddress: '',
        projectRooms: '',
        agreementDate: new Date().toISOString().split('T')[0],
        
        // Service Type
        serviceType: 'e-design',
        eDesignFee: '2000',
        fullServiceHourlyRate: '125',
        projectManagementRate: '20',
        
        // Additional Fees
        additionalSelectionsFee: '400',
        delayedPurchaseFee: '400',
        itemRemovalFee: '200',
        redesignFee: '2000',
        rushSurcharge: '50',
        
        // Timeline and Terms
        projectTimeline: '60',
        validityPeriod: '90',
        revisionRounds: '2',
        responseTime: '5',
        paymentTerms: 'due_on_receipt',
        
        // Payment Information
        depositPercentage: '50',
        latePaymentRate: '1.5',
        
        // Options
        includeInstallation: false,
        includePhotography: true,
        includeRushOption: false,
        includeMaterialBreach: true,
        includeForcemajeure: true
    });

    // Check for saved progress
    useEffect(() => {
        const savedData = localStorage.getItem('interiorDesignFormData');
        const paidStatus = localStorage.getItem('interiorDesignPaid');
        
        if (savedData && paidStatus === 'true') {
            setFormData(JSON.parse(savedData));
        }
        
        if (paidStatus === 'true') {
            setIsPaid(true);
            setShowPaywall(false);
        }
    }, []);

    // Save form data
    const saveFormData = (data) => {
        if (isPaid) {
            localStorage.setItem('interiorDesignFormData', JSON.stringify(data));
        }
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLastChanged(name);
        
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };
        
        setFormData(newFormData);
        saveFormData(newFormData);
    };

    // PayPal payment handling
    const handlePayment = () => {
        if (typeof paypal !== 'undefined') {
            return paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: '14.95' }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(() => {
                        setIsPaid(true);
                        setShowPaywall(false);
                        localStorage.setItem('interiorDesignPaid', 'true');
                        saveFormData(formData);
                    });
                }
            }).render('#paypal-button-container');
        }
    };

    // Skip payment for testing
    const skipPayment = () => {
        setIsPaid(true);
        setShowPaywall(false);
        localStorage.setItem('interiorDesignPaid', 'true');
    };

    // Tab configuration
    const tabs = [
        { id: 'parties', label: 'Parties' },
        { id: 'services', label: 'Services' },
        { id: 'fees', label: 'Fees' },
        { id: 'terms', label: 'Terms' },
        { id: 'options', label: 'Options' },
        { id: 'results', label: 'Results' }
    ];

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

    // Complete document generation
    const documentText = `**INTERIOR DESIGN SERVICES AGREEMENT**

This Interior Design Services Agreement ("Agreement") is entered into on ${formData.agreementDate} by and between ${formData.designerName}, a ${formData.designerEntity} with its principal place of business at ${formData.designerAddress} ("Designer"), and ${formData.clientName || '[CLIENT NAME]'}, ${formData.clientType === 'individual' ? 'an individual residing' : 'a company located'} at ${formData.clientAddress || '[CLIENT ADDRESS]'} ("Client") (collectively, the "Parties").

## 1. Scope of Services

a) The Designer agrees to provide interior design services for the following areas of the Client's property located at ${formData.projectAddress || '[PROJECT ADDRESS]'}:

${formData.projectRooms || '[LIST SPECIFIC ROOMS/AREAS]'}

b) Services include creating 2D renderings, selecting furniture and decor items, and providing shoppable links or purchase locations for each space. Designer will provide up to three (3) selections per item in each room design.

c) Designer will make best efforts to accommodate Client's design preferences and budget while adhering to the agreed-upon project scope and timeline, provided that Client fulfills all obligations and responsibilities under this Agreement.

## 2. Design Process

The design process consists of the following stages:

a) Intake - Free consultation to assess the project scope, Client's design preferences, and budget.

b) Locate - Web search to fulfill Client's needs with all shoppable links or purchase locations. Designer will present selections to Client for approval.

c) Order - Designer will provide available discounts at applicable stores/retailers/vendors/suppliers. Upon Client's approval of items and receipt of full payment from Client, Designer will coordinate ordering and procurement of all items through Designer's vendor accounts.

d) Installation - ${formData.includeInstallation ? 'Designer will coordinate installation services.' : 'All materials to be placed accordingly by the homeowner or white glove delivery, as coordinated by the Client at Client\'s expense.'}

e) Project Close Out - Upon completion of installation and final walk-through, the project will be considered complete.

## 3. Service Types and Fees

${formData.serviceType === 'e-design' ? `### A. E-Design Services

a) The e-design fee for each space is $${formData.eDesignFee} per room. This fee covers furniture and decor selection only and does not include full-service design coordination, installation oversight, or project management.

b) E-design packages are valid for ${formData.validityPeriod} days after final payment is received unless otherwise specified in writing.

c) E-design services include initial design boards for each agreed-upon room, up to three (3) selections per item in each room, and up to ${formData.revisionRounds} rounds of revisions per item based on Client's feedback.` : `### A. Full-Service Interior Design

a) Full-service design includes the e-design package plus additional hands-on services.

b) Hands-on services including furniture installation, in-person shopping, and styling will be billed at a rate of $${formData.fullServiceHourlyRate} per hour.

c) Project management services will be provided on a cost-plus basis at ${formData.projectManagementRate} percent above all subcontractor, vendor, and supplier costs.`}

### B. Additional Fees

a) $${formData.additionalSelectionsFee} will be charged for each additional set of three (3) selections per item beyond the initial three (3) provided.

b) $${formData.delayedPurchaseFee} will be charged if Client requests new item selections due to delayed purchasing beyond three (3) business days after approval.

c) $${formData.itemRemovalFee} per hour will be charged if Designer is required to remove unwanted personal items from the design area on installation day.

d) If a full redesign is required after final approval, a flat fee of $${formData.redesignFee} will be charged.

${formData.includeRushOption ? `e) Rush projects requiring completion in less than ${formData.projectTimeline} days will incur a ${formData.rushSurcharge} percent surcharge on all applicable fees.` : ''}

## 4. Client Responsibilities and Required Information

a) Client must provide complete and accurate room measurements, high-quality photographs of each space, and realistic budget parameters within ten (10) business days of contract execution.

b) Client shall respond to Designer's requests for approvals, feedback, or additional information within ${formData.responseTime} business days of receipt.

c) Client acknowledges that Designer's ability to perform services is contingent upon Client's timely provision of accurate information and cooperation throughout the design process.

## 5. Payment Terms

a) ${formData.paymentTerms === 'due_on_receipt' ? 'All design fees are due upon receipt of invoice.' : 'Payment terms are net thirty (30) days.'}

b) For full-service projects, ${formData.depositPercentage} percent of total estimated fees is due upon contract execution.

c) For furniture and product purchases, Client must remit full payment to Designer before any orders are placed.

d) Late payments will incur a ${formData.latePaymentRate}% monthly interest charge if past due by fifteen (15) days.

## 6. Project Timeline

The estimated project completion timeline is ${formData.projectTimeline} days from contract execution, subject to Client's timely cooperation and approval of design selections.

${formData.includePhotography ? `## 7. Photography and Publicity

Designer may photograph the completed project for its portfolio, website, and promotional materials. Designer will not disclose Client's personal information without prior consent.` : ''}

${formData.includeMaterialBreach ? `## 8. Material Breach and Termination

Material breaches include failure to provide required information, imposing unrealistic budget constraints, declining more than 80% of design selections without reasonable cause, or failure to make timely payments. Upon material breach, Designer may terminate this Agreement and retain all fees paid.` : ''}

## 9. Intellectual Property

Upon full payment of all fees, Client shall own the final design plans created specifically for this project. Designer retains rights to pre-existing intellectual property and design methodologies.

## 10. Limitation of Liability

Designer's total liability under this Agreement shall not exceed the total amount of design fees paid by Client. Designer shall not be liable for indirect, incidental, or consequential damages.

${formData.includeForcemajeure ? `## 11. Force Majeure

Neither party shall be liable for delays due to circumstances beyond reasonable control, including acts of God, natural disasters, or government orders.` : ''}

## 12. Governing Law

This Agreement shall be governed by the laws of ${formData.designerState}.

**IN WITNESS WHEREOF**, the Parties have executed this Agreement as of the date first above written.

**CLIENT:**                    **DESIGNER:**

${formData.clientName || '[CLIENT NAME]'}          ${formData.designerName}

_________________________     _________________________
Signature                      Signature

Date: _______________          Date: _______________`;

    // Copy to clipboard function
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(documentText);
            alert('Agreement copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    };

    // Download as Word document
    const downloadAsWord = () => {
        try {
            if (!documentText) {
                alert("Cannot generate document - text is empty.");
                return;
            }
            
            if (typeof window.generateWordDoc === 'function') {
                window.generateWordDoc(documentText, {
                    documentTitle: "Interior Design Services Agreement",
                    fileName: "Interior-Design-Services-Agreement"
                });
            } else {
                alert("Word generation not available. Please use copy to clipboard.");
            }
        } catch (error) {
            console.error("Error in downloadAsWord:", error);
            alert("Error generating Word document. Please use copy to clipboard.");
        }
    };

    // Create highlighted text for preview
    const createHighlightedText = () => {
        if (!lastChanged) return documentText;
        
        const highlightPatterns = {
            designerName: new RegExp(`(${formData.designerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
            clientName: formData.clientName ? new RegExp(`(${formData.clientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi') : null,
            projectAddress: formData.projectAddress ? new RegExp(`(${formData.projectAddress.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi') : null,
            agreementDate: new RegExp(`(${formData.agreementDate})`, 'g'),
            eDesignFee: new RegExp(`(\\$${formData.eDesignFee})`, 'g'),
            projectTimeline: new RegExp(`(${formData.projectTimeline} days)`, 'g')
        };
        
        const pattern = highlightPatterns[lastChanged];
        if (pattern && formData[lastChanged]) {
            return documentText.replace(pattern, '<span class="highlighted-text">$1</span>');
        }
        
        return documentText;
    };

    const highlightedText = createHighlightedText();

    // Results analysis for the final tab
    const analyzeResults = () => {
        const issues = [];
        
        if (!formData.clientName) {
            issues.push({
                level: 'high',
                title: 'Missing Client Information',
                description: 'Client name is required for a valid agreement. This creates legal uncertainty about who is bound by the contract.'
            });
        }
        
        if (!formData.projectAddress) {
            issues.push({
                level: 'high',
                title: 'Missing Project Address',
                description: 'Property address is essential for defining the scope of work and legal jurisdiction.'
            });
        }
        
        if (!formData.projectRooms) {
            issues.push({
                level: 'medium',
                title: 'Missing Room Specifications',
                description: 'Specific rooms/areas should be listed to avoid scope creep and disputes.'
            });
        }
        
        if (formData.serviceType === 'e-design' && parseInt(formData.eDesignFee) < 1500) {
            issues.push({
                level: 'medium',
                title: 'Low E-Design Fee',
                description: 'Consider if the fee adequately covers your time investment and business costs.'
            });
        }
        
        if (parseInt(formData.projectTimeline) < 30) {
            issues.push({
                level: 'medium',
                title: 'Tight Timeline',
                description: 'Short project timelines increase risk of client dissatisfaction and rushed work.'
            });
        }
        
        if (parseInt(formData.depositPercentage) < 50) {
            issues.push({
                level: 'low',
                title: 'Low Deposit Percentage',
                description: 'Consider requiring at least 50% deposit to secure client commitment and cover initial costs.'
            });
        }
        
        if (formData.includeMaterialBreach) {
            issues.push({
                level: 'low',
                title: 'Material Breach Protection',
                description: 'Good: Including material breach clauses helps protect against problematic clients.'
            });
        }
        
        return issues;
    };

    const analysisResults = analyzeResults();

    // Effect to scroll to highlighted text
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            const highlightedElement = previewRef.current.querySelector('.highlighted-text');
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [highlightedText]);

    // PayPal effect
    useEffect(() => {
        if (showPaywall && !isPaid) {
            setTimeout(handlePayment, 2000);
        }
    }, [showPaywall]);

    // Render paywall
    if (showPaywall && !isPaid) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    textAlign: 'center'
                }}>
                    <h2>Interior Design Services Agreement Generator</h2>
                    <p>Generate a comprehensive interior design services agreement.</p>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: '1rem 0'}}>
                        $14.95
                    </div>
                    <div id="paypal-button-container" style={{margin: '1rem 0'}}></div>
                    <div style={{margin: '1rem 0', padding: '10px', background: '#f0f0f0', borderRadius: '4px'}}>
                        PayPal buttons loading... If buttons don't appear in 5 seconds, click below:
                    </div>
                    <button 
                        onClick={skipPayment}
                        style={{
                            backgroundColor: '#0070f3',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            margin: '10px'
                        }}
                    >
                        Continue to Generator (Testing)
                    </button>
                    <p style={{marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280'}}>
                        One-time payment • Instant access
                    </p>
                </div>
            </div>
        );
    }

    // Main component render
    return (
        <div className="container">
            <div className="main-content">
                <div className="form-panel">
                    <div className="header">
                        <h1>Interior Design Services Agreement Generator</h1>
                        <p>Create a professional interior design services agreement</p>
                    </div>

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

                    {/* Tab Content */}
                    {currentTab === 0 && (
                        <div className="form-section">
                            <h3>Party Information</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Designer/Company Name</label>
                                    <input
                                        type="text"
                                        name="designerName"
                                        value={formData.designerName}
                                        onChange={handleChange}
                                        placeholder="e.g., Prestige Interiors LLC"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Entity Type</label>
                                    <select name="designerEntity" value={formData.designerEntity} onChange={handleChange}>
                                        <option value="limited liability company">LLC</option>
                                        <option value="corporation">Corporation</option>
                                        <option value="sole proprietorship">Sole Proprietorship</option>
                                        <option value="partnership">Partnership</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Designer State</label>
                                    <select name="designerState" value={formData.designerState} onChange={handleChange}>
                                        <option value="California">California</option>
                                        <option value="New York">New York</option>
                                        <option value="Texas">Texas</option>
                                        <option value="Florida">Florida</option>
                                        <option value="Illinois">Illinois</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Designer Business Address</label>
                                <textarea
                                    name="designerAddress"
                                    value={formData.designerAddress}
                                    onChange={handleChange}
                                    placeholder="1234 Design Avenue, Los Angeles, CA 90210"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Client Name</label>
                                    <input
                                        type="text"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        placeholder="Client or Company Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Client Type</label>
                                    <select name="clientType" value={formData.clientType} onChange={handleChange}>
                                        <option value="individual">Individual</option>
                                        <option value="company">Company</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Client Address</label>
                                    <textarea
                                        name="clientAddress"
                                        value={formData.clientAddress}
                                        onChange={handleChange}
                                        placeholder="Client's address"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Agreement Date</label>
                                    <input
                                        type="date"
                                        name="agreementDate"
                                        value={formData.agreementDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Project Property Address</label>
                                <textarea
                                    name="projectAddress"
                                    value={formData.projectAddress}
                                    onChange={handleChange}
                                    placeholder="Address where design work will be performed"
                                />
                            </div>

                            <div className="form-group">
                                <label>Specific Rooms/Areas to be Designed</label>
                                <textarea
                                    name="projectRooms"
                                    value={formData.projectRooms}
                                    onChange={handleChange}
                                    placeholder="e.g., Living Room, Master Bedroom, Kitchen, etc."
                                />
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {currentTab === 1 && (
                        <div className="form-section">
                            <h3>Service Configuration</h3>
                            
                            <div className="form-group">
                                <label>Service Type</label>
                                <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                                    <option value="e-design">E-Design Only</option>
                                    <option value="full-service">Full-Service Design</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project Timeline (days)</label>
                                    <input
                                        type="number"
                                        name="projectTimeline"
                                        value={formData.projectTimeline}
                                        onChange={handleChange}
                                        min="30"
                                        max="365"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Design Validity Period (days)</label>
                                    <input
                                        type="number"
                                        name="validityPeriod"
                                        value={formData.validityPeriod}
                                        onChange={handleChange}
                                        min="30"
                                        max="365"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Revision Rounds Included</label>
                                    <input
                                        type="number"
                                        name="revisionRounds"
                                        value={formData.revisionRounds}
                                        onChange={handleChange}
                                        min="1"
                                        max="5"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Client Response Time (business days)</label>
                                    <input
                                        type="number"
                                        name="responseTime"
                                        value={formData.responseTime}
                                        onChange={handleChange}
                                        min="3"
                                        max="14"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fees Tab */}
                    {currentTab === 2 && (
                        <div className="form-section">
                            <h3>Fee Structure</h3>
                            
                            {formData.serviceType === 'e-design' ? (
                                <div className="form-group">
                                    <label>E-Design Fee per Room ($)</label>
                                    <input
                                        type="number"
                                        name="eDesignFee"
                                        value={formData.eDesignFee}
                                        onChange={handleChange}
                                        min="500"
                                        max="10000"
                                    />
                                </div>
                            ) : (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Hourly Rate ($)</label>
                                        <input
                                            type="number"
                                            name="fullServiceHourlyRate"
                                            value={formData.fullServiceHourlyRate}
                                            onChange={handleChange}
                                            min="75"
                                            max="500"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Project Management Rate (%)</label>
                                        <input
                                            type="number"
                                            name="projectManagementRate"
                                            value={formData.projectManagementRate}
                                            onChange={handleChange}
                                            min="10"
                                            max="35"
                                        />
                                    </div>
                                </div>
                            )}

                            <h4>Additional Fees</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Additional Selections Fee ($)</label>
                                    <input
                                        type="number"
                                        name="additionalSelectionsFee"
                                        value={formData.additionalSelectionsFee}
                                        onChange={handleChange}
                                        min="100"
                                        max="1000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Redesign Fee ($)</label>
                                    <input
                                        type="number"
                                        name="redesignFee"
                                        value={formData.redesignFee}
                                        onChange={handleChange}
                                        min="1000"
                                        max="5000"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terms Tab */}
                    {currentTab === 3 && (
                        <div className="form-section">
                            <h3>Payment & Terms</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Payment Terms</label>
                                    <select name="paymentTerms" value={formData.paymentTerms} onChange={handleChange}>
                                        <option value="due_on_receipt">Due on Receipt</option>
                                        <option value="net_30">Net 30 Days</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Required Deposit (%)</label>
                                    <input
                                        type="number"
                                        name="depositPercentage"
                                        value={formData.depositPercentage}
                                        onChange={handleChange}
                                        min="25"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Late Payment Interest Rate (% per month)</label>
                                <input
                                    type="number"
                                    name="latePaymentRate"
                                    value={formData.latePaymentRate}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="1.0"
                                    max="5.0"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options Tab */}
                    {currentTab === 4 && (
                        <div className="form-section">
                            <h3>Additional Options</h3>
                            
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="includeInstallation"
                                    checked={formData.includeInstallation}
                                    onChange={handleChange}
                                />
                                <label>Include installation coordination services</label>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="includePhotography"
                                    checked={formData.includePhotography}
                                    onChange={handleChange}
                                />
                                <label>Include photography and publicity rights clause</label>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="includeMaterialBreach"
                                    checked={formData.includeMaterialBreach}
                                    onChange={handleChange}
                                />
                                <label>Include material breach and termination clauses</label>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="includeForcemajeure"
                                    checked={formData.includeForcemajeure}
                                    onChange={handleChange}
                                />
                                <label>Include force majeure clause</label>
                            </div>
                        </div>
                    )}

                    {/* Results Tab */}
                    {currentTab === 5 && (
                        <div className="form-section">
                            <h3>Agreement Analysis & Recommendations</h3>
                            
                            <div className="results-section">
                                {analysisResults.map((issue, index) => (
                                    <div key={index} className={`risk-card ${issue.level}`}>
                                        <h4>{issue.title}</h4>
                                        <p>{issue.description}</p>
                                    </div>
                                ))}
                                
                                {analysisResults.length === 0 && (
                                    <div className="risk-card low">
                                        <h4>Agreement Complete</h4>
                                        <p>Your interior design services agreement appears to be well-structured with all essential elements included.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="navigation-buttons">
                        <button
                            onClick={prevTab}
                            className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
                            disabled={currentTab === 0}
                        >
                            Previous
                        </button>
                        
                        <button
                            onClick={copyToClipboard}
                            className="nav-button"
                            style={{
                                backgroundColor: "#4f46e5", 
                                color: "white",
                                border: "none"
                            }}
                        >
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
                            Download MS Word
                        </button>

                        <button
                            onClick={() => window.Calendly?.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'})}
                            className="nav-button"
                            style={{
                                backgroundColor: "#059669", 
                                color: "white",
                                border: "none"
                            }}
                        >
                            Consult
                        </button>
                        
                        <button
                            onClick={nextTab}
                            className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
                            disabled={currentTab === tabs.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="preview-panel" ref={previewRef}>
                    <div className="preview-content">
                        <h2>Live Preview</h2>
                        <div 
                            className="document-preview"
                            dangerouslySetInnerHTML={{ __html: highlightedText }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<InteriorDesignAgreementGenerator />, document.getElementById('root'));