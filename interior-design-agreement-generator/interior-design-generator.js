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
        designerEmail: 'info@prestigeinteriors.com',
        
        // Client Information
        clientName: '',
        clientType: 'individual',
        clientAddress: '',
        
        // Project Information
        projectAddress: '',
        projectRooms: '',
        agreementDate: new Date().toISOString().split('T')[0],
        
        // Service Type & Core Fees
        serviceType: 'e-design',
        eDesignFee: '2000',
        fullServiceHourlyRate: '125',
        projectManagementRate: '20',
        
        // Additional Fees (matching original document)
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
        informationDeadline: '10',
        
        // Payment Information
        depositPercentage: '50',
        latePaymentRate: '1.5',
        latePaymentGrace: '15',
        
        // Communication & Process
        communicationPlatform: 'Designer\'s designated platform',
        designerResponseTime: '2',
        inspectionWindow: '5',
        
        // Professional Services
        includePhotography: true,
        includeInstallation: false,
        includeRushOption: false,
        includeMaterialBreach: true,
        includeForcemajeure: true,
        includeIndemnification: true,
        includeConfidentiality: true,
        
        // Legal & Compliance
        disputeResolutionMethod: 'courts',
        includeArbitration: false,
        includeSeverability: true,
        includeEntireAgreement: true
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
        { id: 'process', label: 'Process' },
        { id: 'legal', label: 'Legal' },
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

    // Complete sophisticated document generation
    const documentText = `INTERIOR DESIGN SERVICES AGREEMENT

This Interior Design Services Agreement ("Agreement") is entered into on ${formData.agreementDate} by and between ${formData.designerName}, a ${formData.designerEntity} with its principal place of business at ${formData.designerAddress} ("Designer"), and ${formData.clientName || '[CLIENT NAME]'}, ${formData.clientType === 'individual' ? 'an individual residing' : 'a company located'} at ${formData.clientAddress || '[CLIENT ADDRESS]'} ("Client") (collectively, the "Parties").

1. Scope of Services

a) The Designer agrees to provide interior design services for the following areas of the Client's property located at ${formData.projectAddress || '[PROJECT ADDRESS]'}:

${formData.projectRooms || '[LIST SPECIFIC ROOMS/AREAS]'}

b) Services include creating 2D renderings, selecting furniture and decor items, and providing shoppable links or purchase locations for each space. Designer will provide up to three (3) selections per item in each room design.

c) Designer will make best efforts to accommodate Client's design preferences and budget while adhering to the agreed-upon project scope and timeline, provided that Client fulfills all obligations and responsibilities under this Agreement.

2. Design Process

The design process consists of the following stages:

a) Intake - Free consultation to assess the project scope, Client's design preferences, and budget.
b) Locate - Web search to fulfill Client's needs with all shoppable links or purchase locations.
c) Order - Designer will coordinate ordering and procurement through Designer's vendor accounts.
d) Installation - ${formData.includeInstallation ? 'Designer will coordinate installation services.' : 'All materials to be placed by homeowner or white glove delivery at Client\'s expense.'}
e) Project Close Out - Upon completion of installation and final walk-through, the project will be considered complete.

3. Service Types and Fees

${formData.serviceType === 'e-design' ? `A. E-Design Services - $${formData.eDesignFee} per room. Valid for ${formData.validityPeriod} days. Includes up to ${formData.revisionRounds} rounds of revisions.` : `A. Full-Service Interior Design - $${formData.fullServiceHourlyRate} per hour for hands-on services. Project management at ${formData.projectManagementRate}% above costs.`}

B. Additional Fees - Additional selections: $${formData.additionalSelectionsFee}. Delayed purchases: $${formData.delayedPurchaseFee}. Item removal: $${formData.itemRemovalFee}/hour. Full redesign: $${formData.redesignFee}.

4. Payment Terms - ${formData.paymentTerms === 'due_on_receipt' ? 'Due on receipt' : 'Net 30 days'}. ${formData.depositPercentage}% deposit required. Late payments incur ${formData.latePaymentRate}% monthly interest after ${formData.latePaymentGrace} days.

5. Client Responsibilities - Provide measurements, photos, and budget within ${formData.informationDeadline} business days. Respond to requests within ${formData.responseTime} business days.

6. Project Timeline - ${formData.projectTimeline} days estimated completion.

7. Governing Law - This Agreement shall be governed by the laws of ${formData.designerState}.

IN WITNESS WHEREOF, the Parties have executed this Agreement.

CLIENT: ${formData.clientName || '[CLIENT NAME]'}     DESIGNER: ${formData.designerName}
Signature: _________________     Signature: _________________
Date: _______________          Date: _______________`;

    // Copy to clipboard function
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(documentText);
            alert('Interior Design Agreement copied to clipboard!');
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

                    {/* Basic form for now */}
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
                        </div>

                        <div className="form-group">
                            <label>Project Address</label>
                            <textarea
                                name="projectAddress"
                                value={formData.projectAddress}
                                onChange={handleChange}
                                placeholder="Address where design work will be performed"
                            />
                        </div>

                        <div className="form-group">
                            <label>Specific Rooms/Areas</label>
                            <textarea
                                name="projectRooms"
                                value={formData.projectRooms}
                                onChange={handleChange}
                                placeholder="e.g., Living Room, Master Bedroom, Kitchen"
                            />
                        </div>
                    </div>

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
                            Copy Agreement
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
                        <div className="document-preview" style={{whiteSpace: 'pre-wrap'}}>
                            {documentText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<InteriorDesignAgreementGenerator />, document.getElementById('root'));