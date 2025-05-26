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
        designerSignatory: 'Managing Member',
        
        // Client Information
        clientName: '',
        clientType: 'individual',
        clientAddress: '',
        clientEmail: '',
        
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
        includeRushOption: true,
        includeMaterialBreach: true,
        includeForcemajeure: true,
        includeIndemnification: true,
        includeConfidentiality: true,
        includePhotos: true,
        includeArbitration: false,
        
        // Legal & Compliance
        disputeResolutionMethod: 'courts',
        includeSeverability: true,
        includeEntireAgreement: true,
        governingState: 'California'
    });

    // US States list
    const usStates = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
        'Wisconsin', 'Wyoming'
    ];

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
        
        // Highlight changed field in preview
        setTimeout(() => setLastChanged(null), 3000);
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

    // Complete sophisticated document generation matching original 34-section agreement
    const documentText = `INTERIOR DESIGN SERVICES AGREEMENT

This Interior Design Services Agreement ("Agreement") is entered into on ${formData.agreementDate} by and between ${formData.designerName}, a ${formData.designerEntity} with its principal place of business at ${formData.designerAddress} ("Designer"), and ${formData.clientName || '[CLIENT NAME]'}, ${formData.clientType === 'individual' ? 'an individual residing' : 'a company located'} at ${formData.clientAddress || '[CLIENT ADDRESS]'} ("Client") (collectively, the "Parties").

1. Scope of Services

a) The Designer agrees to provide interior design services for the following areas of the Client's property located at ${formData.projectAddress || '[PROJECT ADDRESS]'}:

${formData.projectRooms || '[LIST SPECIFIC ROOMS/AREAS]'}

b) Services include creating 2D renderings, selecting furniture and decor items, and providing shoppable links or purchase locations for each space. Designer will provide up to three (3) selections per item in each room design.

c) Designer will make best efforts to accommodate Client's design preferences and budget while adhering to the agreed-upon project scope and timeline, provided that Client fulfills all obligations and responsibilities under this Agreement, including but not limited to providing accurate measurements, timely feedback, and maintaining commercially reasonable budget parameters.

2. Design Process

The design process consists of the following stages:

a) Intake - Free consultation to assess the project scope, Client's design preferences, and budget.

b) Locate - Web search to fulfill Client's needs with all shoppable links or purchase locations. Designer will present selections to Client for approval.

c) Order - Designer will provide available discounts at applicable stores/retailers/vendors/suppliers. Upon Client's approval of items and receipt of full payment from Client, Designer will coordinate ordering and procurement of all items through Designer's vendor accounts. Client must remit payment to Designer for all approved items before any orders are placed. Orders will only be processed after funds have cleared Designer's bank account.

d) Installation - ${formData.includeInstallation ? 'Designer will coordinate installation services and oversight.' : 'All materials to be placed accordingly by the homeowner or white glove delivery, as coordinated by the Client at Client\'s expense.'}

e) Project Close Out - Upon completion of installation and final walk-through, the project will be considered complete.

3. Service Types and Fees

${formData.serviceType === 'e-design' ? `A. E-Design Services

a) The e-design fee for each space is $${formData.eDesignFee} per room. This fee covers furniture and decor selection only and does not include full-service design coordination, installation oversight, or project management.

b) E-design packages are valid for ${formData.validityPeriod} days after final payment is received unless otherwise specified in writing. After expiration, no revisions, support, or additional services will be provided without execution of a new agreement.

c) E-design packages are created specifically for the property address specified in this Agreement and may not be transferred to, used for, or adapted to any other property or location unless specified in writing prior to the execution of this Agreement.

d) E-design services include initial design boards for each agreed-upon room, up to three (3) selections per item in each room, and up to ${formData.revisionRounds} rounds of revisions per item based on Client's feedback.` : `A. Full-Service Interior Design

a) Full-service design includes the e-design package plus additional services as specified below.

b) Hands-on services including furniture installation, in-person shopping, and styling will be billed at a rate of $${formData.fullServiceHourlyRate} per hour.

c) Project management services, when specifically contracted, will be provided on a cost-plus basis at ${formData.projectManagementRate} percent above all subcontractor, vendor, and supplier costs for oversight and coordination of contractors, vendors, installations, wallpaper installation, and other trade services.`}

B. Additional Fees

a) $${formData.additionalSelectionsFee} will be charged for each additional set of three (3) selections per item beyond the initial three (3) provided.

b) $${formData.delayedPurchaseFee} will be charged if Client requests new item selections due to delayed purchasing beyond three (3) business days after approval.

c) $${formData.itemRemovalFee} per hour will be charged if Designer is required to remove unwanted personal items from the design area on installation day.

d) If a full redesign is required after final approval, a flat fee of $${formData.redesignFee} will be charged.

${formData.includeRushOption ? `e) Rush projects requiring completion in less than ${formData.projectTimeline} days will incur a ${formData.rushSurcharge} percent surcharge on all applicable fees.` : ''}

4. Client Responsibilities and Required Information

A. E-Design Client Responsibilities

a) E-Design clients must provide the following within ${formData.informationDeadline} business days of contract execution: 
   i. Complete and accurate room measurements following Designer's provided measurement guide, including but not limited to room dimensions, ceiling heights, window and door measurements and locations, electrical outlet and switch locations, HVAC vent locations, and any architectural features 
   ii. High-quality, well-lit photographs of each space from multiple angles showing current condition 
   iii. Architectural drawings or floor plans if available 
   iv. Realistic budget parameters for each room consistent with Client's stated preferences and requirements 
   v. No more than two (2) professional inspiration images per room showing desired design aesthetic

B. Full-Service Client Responsibilities

a) For full-service clients, Designer will obtain necessary measurements and photographs as part of the service package.

b) Full-service clients must provide: 
   i. Access to the property for measurement and photography purposes 
   ii. Realistic budget parameters for each room consistent with Client's stated preferences and requirements 
   iii. No more than two (2) professional inspiration images per room showing desired design aesthetic

C. Universal Client Responsibilities

a) All clients shall provide timely input and feedback throughout the design process to ensure that the project meets their expectations. All feedback must be specific, constructive, and provided through ${formData.communicationPlatform}.

b) Client shall respond to Designer's requests for approvals, feedback, or additional information within ${formData.responseTime} business days of receipt.

c) Client acknowledges that Designer's ability to perform services under this Agreement is contingent upon Client's timely provision of accurate information and cooperation throughout the design process.

5. Material Breach and Termination for Non-Cooperation

${formData.includeMaterialBreach ? `A. E-Design Client Material Breaches

a) The following actions by E-Design clients constitute material breaches of this Agreement that may result in immediate termination: 
   i. Failure to provide required measurements, photographs, or other essential information after two (2) written requests 
   ii. Imposing budget constraints that make commercially reasonable completion of the project impossible given Client's stated requirements 
   iii. Exhibiting a pattern of declining design selections without constructive feedback, specifically rejecting more than eighty percent (80%) of presented options without reasonable cause 
   iv. Repeatedly changing previously approved selections without justifiable cause 
   v. Failure to make timely payments as specified in this Agreement 
   vi. Attempting to bypass Designer to contact vendors, contractors, or suppliers directly regarding project-related matters

B. Full-Service Client Material Breaches

a) The following actions by Full-Service clients constitute material breaches of this Agreement that may result in immediate termination: 
   i. Failure to provide reasonable access to the property for measurement and photography purposes after two (2) written requests 
   ii. Imposing budget constraints that make commercially reasonable completion of the project impossible given Client's stated requirements 
   iii. Exhibiting a pattern of declining design selections without constructive feedback, specifically rejecting more than eighty percent (80%) of presented options without reasonable cause 
   iv. Repeatedly changing previously approved selections without justifiable cause 
   v. Failure to make timely payments as specified in this Agreement 
   vi. Attempting to bypass Designer to contact vendors, contractors, or suppliers directly regarding project-related matters

C. Consequences of Material Breach

a) Upon material breach by Client, Designer may, at Designer's sole discretion, terminate this Agreement immediately upon written notice. In such event, Designer shall retain all fees paid for services performed and Client shall remain responsible for any costs incurred on Client's behalf.` : ''}

6. Expenses and Sales Tax

a) Client shall reimburse Designer for all reasonable out-of-pocket expenses incurred in connection with the project, including but not limited to travel, shipping, and materials costs. All costs associated with procurement, delivery, inspection, white glove delivery, and project coordination are Client's responsibility and separate from design fees.

b) Client is responsible for paying all applicable sales taxes on furniture, products, and services.

7. Budget and Fee Estimates

a) Designer will provide Client with a budget estimate for each space based on the agreed-upon scope of work and Client's design preferences, provided Client has supplied realistic budget parameters.

b) If the actual cost of furniture, products, or services exceeds the budget estimate due to Client's requests or changes, Designer will notify Client and obtain approval before proceeding with purchases.

c) Client acknowledges that Designer may offer vendor discounts when available, but that such discounts are provided as a courtesy and Designer is under no obligation to match pricing available from other sources or to conduct price comparisons on Client's behalf.

8. Payment Terms

a) ${formData.paymentTerms === 'due_on_receipt' ? 'All design fees are due upon receipt of invoice, not net thirty (30) days. Payment must be received before commencement of design work.' : 'Payment terms are net thirty (30) days from invoice date.'}

b) For full-service projects, ${formData.depositPercentage} percent of total estimated fees is due upon contract execution, with the remaining ${100 - parseInt(formData.depositPercentage)} percent due before furniture ordering begins.

c) For furniture and product purchases, Client must remit full payment to Designer before any orders are placed. Designer will only process orders after Client's payment has cleared Designer's bank account.

d) Client has three (3) business days after approval to commit to purchasing approved items by remitting payment to Designer. If items become unavailable due to Client's delay in payment beyond this timeframe, Designer may charge additional sourcing fees to locate replacement items.

e) Payments shall be made to ${formData.designerName} via check, wire transfer, or Zelle${formData.designerEmail ? ` (${formData.designerEmail})` : ''}. All design fees and project services are non-refundable.

9. Late Payment and Overdue Accounts

a) Late payments will incur a ${formData.latePaymentRate}% monthly interest charge if past due by ${formData.latePaymentGrace} days.

b) If payment is more than ${formData.latePaymentGrace} days overdue, Designer reserves the right to suspend services until payment is received in full.

c) Client shall be responsible for all costs of collection, including reasonable attorneys' fees.

10. Fee Disputes

If Client disputes any portion of an invoice, Client shall notify Designer in writing within ten (10) days of receipt, specifying the reason for the dispute. Client shall pay all undisputed portions of the invoice according to the payment terms herein.

11. Delivery Estimates

Designer will provide estimated delivery dates for all furniture and products based on information provided by vendors. However, Designer is not responsible for delays in delivery caused by factors outside its control, such as manufacturer issues, shipping delays, or customs holdups.

12. Design Plans and Approvals

a) Designer will present Client with design plans, renderings, and product selections for each space. Client shall review and approve all designs within ${formData.responseTime} business days of receipt.

b) Client may request up to ${formData.revisionRounds} rounds of revisions per item per space at no additional cost. Further revisions will be billed at Designer's current hourly rate. If a full redesign is required after final approval, a flat fee of $${formData.redesignFee} will be charged.

c) Once Client approves the final design, any changes or deviations will be treated as a Change Order and subject to additional fees at Designer's current hourly rate.

13. Procurement and Receiving

a) Upon Client's approval of design plans and product selections and receipt of full payment from Client, Designer will coordinate ordering and procurement of all items through Designer's vendor accounts. All orders will be processed only after Client's payment has cleared Designer's bank account.

b) Designer will coordinate the delivery and inspection of items as part of the procurement service. In some cases, a third party may be hired to receive, inspect, and deliver the items, or the Client may choose to handle final delivery directly, as agreed upon by the Parties. All associated costs are Client's responsibility.

14. Installation

a) ${formData.includeInstallation ? 'Designer will coordinate the installation of all furniture and products in accordance with the approved design plans, subject to additional hourly billing.' : 'Installation services are not included in the base package. If Designer is contracted to oversee installation, Designer will coordinate the installation of all furniture and products in accordance with the approved design plans.'}

b) Client is responsible for ensuring that the installation area is clean, cleared of personal belongings, and readily accessible on the scheduled installation date.

c) If Client requires storage of items prior to installation, additional fees may apply.

15. Project Closure

Upon completion of the project, the Client shall have a ${formData.inspectionWindow} day window to inspect the work and notify the Designer of any deficiencies or issues that need to be addressed. After this period, the project will be considered complete and accepted by the Client, and no further changes or revisions will be made under this Agreement.

16. Refunds, Exchanges, and Cancellations

a) All furniture and product sales are final. Refunds and exchanges are at the discretion of the vendor and subject to their individual policies.

b) Custom or made-to-order items are non-refundable and cannot be exchanged.

c) If Client cancels the project after placing orders, Client shall be responsible for all restocking fees, return shipping costs, and any other charges imposed by the vendor.

17. Damages and Insurance

a) Designer shall exercise reasonable care in the delivery and installation of all items but is not responsible for damage caused by pre-existing conditions or the negligence of third parties.

b) Client shall maintain adequate property insurance coverage for all furniture and products. Designer is not liable for any loss or damage to items after installation.

18. Access and Preparation

Client shall provide Designer and its subcontractors with reasonable access to the project site during normal business hours for the purposes of design, delivery, and installation. Client is responsible for ensuring that the site is safe, secure, and free of hazards.

19. Permits and Compliance

Client is responsible for obtaining any necessary permits, licenses, or approvals required for the project. Designer will comply with all applicable laws, codes, and regulations in the performance of its services.

20. Third-Party Contractors and Subcontractors

a) Designer may engage third-party contractors or subcontractors as needed to complete the project. Client will be notified in advance and shall approve all such engagements.

b) If specifically hired to do so, Designer shall coordinate and supervise the work of contractors and subcontractors but is not responsible for their performance, errors, or omissions. The extent of Designer's supervision may vary from contract to contract.

21. Maintenance and Repairs

Designer's services do not include ongoing maintenance or repairs after installation. Client is responsible for maintaining all furniture and products in accordance with the manufacturer's guidelines.

22. Creative Discretion and Client Input

a) Designer shall have creative discretion in the selection of furniture, products, and design elements, consistent with Client's stated preferences and budget, provided that Client has provided clear guidance and maintains commercially reasonable expectations.

b) Client shall provide timely input and feedback throughout the design process to ensure that the project meets their expectations.

23. Meetings and Communication

a) Designer and Client shall communicate regularly to review progress, address concerns, and make decisions regarding the project. Communications may be conducted in person, by phone, via video conference, or through ${formData.communicationPlatform}.

b) Designer will respond to Client's inquiries and communications within ${formData.designerResponseTime} business days during normal business hours.

c) All design-related feedback and approvals must be communicated through ${formData.communicationPlatform} to maintain proper documentation and project flow.

24. Professional Conduct and Non-Discrimination

Designer shall perform all services in a professional and ethical manner, without discrimination or harassment on the basis of race, color, religion, sex, national origin, age, disability, or any other protected characteristic.

25. Intellectual Property Ownership

a) Designer retains all rights, title, and interest in and to its pre-existing intellectual property, including but not limited to design templates, processes, and proprietary tools.

b) Upon full payment of all fees due under this Agreement, Client shall own the final design plans and renderings created specifically for the project and the property specified herein. Such designs may not be transferred to or used for any other property without Designer's express written consent.

${formData.includePhotography ? `26. Publicity and Photography

a) Designer may photograph the completed project for its portfolio, website, and promotional materials. Designer will not disclose Client's personal information without prior consent.

b) If Client wishes to publicize or feature the project in any media, Client shall properly attribute and credit Designer's contributions.` : ''}

${formData.includeConfidentiality ? `27. Confidentiality

a) Designer shall maintain the confidentiality of all non-public information provided by Client, including but not limited to personal data, financial information, and project details.

b) Client shall not disclose Designer's proprietary processes, methodologies, or pricing to any third party without Designer's express written consent.` : ''}

28. Termination and Postponement

a) Either party may terminate this Agreement upon written notice if the other party materially breaches any term or condition and fails to cure such breach within ten (10) days of receipt of notice.

b) If Client postpones the project for more than ${formData.projectTimeline} days, Designer may, at its discretion, terminate the Agreement and retain any deposits or payments made to date.

c) In the event of termination, Designer shall be compensated for all services performed and expenses incurred up to the date of termination.

${formData.includeForcemajeure ? `29. Force Majeure

Neither party shall be liable for any delay or failure to perform its obligations under this Agreement if such delay or failure is due to circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, government orders, or labor strikes.` : ''}

30. Limitation of Liability

a) Designer shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of or related to this Agreement, including but not limited to loss of profits, loss of business opportunity, or damage to Client's property.

b) Designer's total liability under this Agreement shall not exceed the total amount of design fees paid by Client, regardless of the legal theory asserted.

c) The limitations set forth in this section shall apply regardless of whether the liability arises in contract, tort, strict liability, or any other legal theory.

${formData.includeIndemnification ? `31. Indemnification

Client shall indemnify, defend, and hold harmless Designer, its employees, agents, and affiliates from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to Client's breach of this Agreement, misuse of the design plans, unauthorized modifications to the design, or Client's failure to comply with applicable laws or obtain necessary permits.` : ''}

32. Dispute Resolution and Governing Law

a) This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingState || formData.designerState}, without giving effect to any choice of law or conflict of law provision or rule.

b) Any controversy or claim arising out of or relating to this Agreement, or the breach thereof, shall be resolved exclusively in the state or federal courts located in ${formData.governingState || formData.designerState}, and the parties hereby consent to the jurisdiction of such courts.

c) The prevailing party in any legal proceeding shall be entitled to recover its reasonable attorneys' fees and costs.

${formData.includeSeverability ? `33. Severability

If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect to the fullest extent permitted by law.` : ''}

${formData.includeEntireAgreement ? `34. Entire Agreement and Amendments

This Agreement constitutes the entire understanding and agreement between the Parties and supersedes all prior negotiations, representations, or agreements, whether written or oral. This Agreement may only be amended or modified by a written instrument signed by both Parties.` : ''}

IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.

CLIENT:                                    DESIGNER:

${formData.clientName || '[CLIENT NAME]'}                          ${formData.designerName}

                                           By: ${formData.designerSignatory || '[AUTHORIZED SIGNATORY]'}

_________________________________         _________________________________
Signature                                  Signature

Date: ____________________________        Date: ____________________________`;

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
                    <p>Generate a comprehensive interior design services agreement with 34 professional sections.</p>
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

    // Tab Content Rendering Functions
    const renderPartiesTab = () => (
        <div className="form-section">
            <h3>Designer Information</h3>
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
                        <option value="limited liability company">Limited Liability Company</option>
                        <option value="corporation">Corporation</option>
                        <option value="partnership">Partnership</option>
                        <option value="sole proprietorship">Sole Proprietorship</option>
                    </select>
                </div>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Designer State</label>
                    <select name="designerState" value={formData.designerState} onChange={handleChange}>
                        {usStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Authorized Signatory</label>
                    <input
                        type="text"
                        name="designerSignatory"
                        value={formData.designerSignatory}
                        onChange={handleChange}
                        placeholder="e.g., Managing Member, President"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Designer Address</label>
                <textarea
                    name="designerAddress"
                    value={formData.designerAddress}
                    onChange={handleChange}
                    placeholder="Full business address"
                />
            </div>

            <div className="form-group">
                <label>Designer Email</label>
                <input
                    type="email"
                    name="designerEmail"
                    value={formData.designerEmail}
                    onChange={handleChange}
                    placeholder="business@email.com"
                />
            </div>

            <h3>Client Information</h3>
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

            <div className="form-group">
                <label>Client Address</label>
                <textarea
                    name="clientAddress"
                    value={formData.clientAddress}
                    onChange={handleChange}
                    placeholder="Full client address"
                />
            </div>

            <h3>Project Information</h3>
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
                    placeholder="e.g., Living Room, Master Bedroom, Kitchen, Guest Bathroom"
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
    );

    const renderServicesTab = () => (
        <div className="form-section">
            <h3>Service Type Selection</h3>
            <div className="form-group">
                <label>Primary Service Type</label>
                <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                    <option value="e-design">E-Design Services</option>
                    <option value="full-service">Full-Service Interior Design</option>
                </select>
            </div>

            <h3>Professional Service Inclusions</h3>
            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includePhotography"
                    checked={formData.includePhotography}
                    onChange={handleChange}
                />
                <label>Include Photography Services</label>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeInstallation"
                    checked={formData.includeInstallation}
                    onChange={handleChange}
                />
                <label>Include Installation Services</label>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeRushOption"
                    checked={formData.includeRushOption}
                    onChange={handleChange}
                />
                <label>Include Rush Project Option</label>
            </div>

            <h3>Communication & Platform</h3>
            <div className="form-group">
                <label>Communication Platform</label>
                <input
                    type="text"
                    name="communicationPlatform"
                    value={formData.communicationPlatform}
                    onChange={handleChange}
                    placeholder="e.g., Designer's designated platform, Slack, Email"
                />
            </div>
        </div>
    );

    const renderFeesTab = () => (
        <div className="form-section">
            <h3>Core Service Fees</h3>
            <div className="form-row">
                <div className="form-group">
                    <label>E-Design Fee (per room)</label>
                    <input
                        type="number"
                        name="eDesignFee"
                        value={formData.eDesignFee}
                        onChange={handleChange}
                        placeholder="2000"
                    />
                </div>
                <div className="form-group">
                    <label>Full-Service Hourly Rate</label>
                    <input
                        type="number"
                        name="fullServiceHourlyRate"
                        value={formData.fullServiceHourlyRate}
                        onChange={handleChange}
                        placeholder="125"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Project Management Rate (%)</label>
                <input
                    type="number"
                    name="projectManagementRate"
                    value={formData.projectManagementRate}
                    onChange={handleChange}
                    placeholder="20"
                />
            </div>

            <h3>Additional Service Fees</h3>
            <div className="form-row">
                <div className="form-group">
                    <label>Additional Selections Fee</label>
                    <input
                        type="number"
                        name="additionalSelectionsFee"
                        value={formData.additionalSelectionsFee}
                        onChange={handleChange}
                        placeholder="400"
                    />
                </div>
                <div className="form-group">
                    <label>Delayed Purchase Fee</label>
                    <input
                        type="number"
                        name="delayedPurchaseFee"
                        value={formData.delayedPurchaseFee}
                        onChange={handleChange}
                        placeholder="400"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Item Removal Fee (per hour)</label>
                    <input
                        type="number"
                        name="itemRemovalFee"
                        value={formData.itemRemovalFee}
                        onChange={handleChange}
                        placeholder="200"
                    />
                </div>
                <div className="form-group">
                    <label>Full Redesign Fee</label>
                    <input
                        type="number"
                        name="redesignFee"
                        value={formData.redesignFee}
                        onChange={handleChange}
                        placeholder="2000"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Rush Project Surcharge (%)</label>
                <input
                    type="number"
                    name="rushSurcharge"
                    value={formData.rushSurcharge}
                    onChange={handleChange}
                    placeholder="50"
                />
            </div>

            <h3>Payment Structure</h3>
            <div className="form-row">
                <div className="form-group">
                    <label>Deposit Percentage</label>
                    <input
                        type="number"
                        name="depositPercentage"
                        value={formData.depositPercentage}
                        onChange={handleChange}
                        placeholder="50"
                    />
                </div>
                <div className="form-group">
                    <label>Payment Terms</label>
                    <select name="paymentTerms" value={formData.paymentTerms} onChange={handleChange}>
                        <option value="due_on_receipt">Due on Receipt</option>
                        <option value="net_30">Net 30 Days</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Late Payment Rate (%/month)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="latePaymentRate"
                        value={formData.latePaymentRate}
                        onChange={handleChange}
                        placeholder="1.5"
                    />
                </div>
                <div className="form-group">
                    <label>Late Payment Grace Period (days)</label>
                    <input
                        type="number"
                        name="latePaymentGrace"
                        value={formData.latePaymentGrace}
                        onChange={handleChange}
                        placeholder="15"
                    />
                </div>
            </div>
        </div>
    );

    const renderTermsTab = () => (
        <div className="form-section">
            <h3>Project Timeline & Deadlines</h3>
            <div className="form-row">
                <div className="form-group">
                    <label>Standard Project Timeline (days)</label>
                    <input
                        type="number"
                        name="projectTimeline"
                        value={formData.projectTimeline}
                        onChange={handleChange}
                        placeholder="60"
                    />
                </div>
                <div className="form-group">
                    <label>Package Validity Period (days)</label>
                    <input
                        type="number"
                        name="validityPeriod"
                        value={formData.validityPeriod}
                        onChange={handleChange}
                        placeholder="90"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Client Information Deadline (business days)</label>
                    <input
                        type="number"
                        name="informationDeadline"
                        value={formData.informationDeadline}
                        onChange={handleChange}
                        placeholder="10"
                    />
                </div>
                <div className="form-group">
                    <label>Client Response Time Required (business days)</label>
                    <input
                        type="number"
                        name="responseTime"
                        value={formData.responseTime}
                        onChange={handleChange}
                        placeholder="5"
                    />
                </div>
            </div>

            <h3>Design & Revision Parameters</h3>
            <div className="form-row">
                <div className="form-group">
                    <label>Included Revision Rounds (per item)</label>
                    <input
                        type="number"
                        name="revisionRounds"
                        value={formData.revisionRounds}
                        onChange={handleChange}
                        placeholder="2"
                    />
                </div>
                <div className="form-group">
                    <label>Project Inspection Window (days)</label>
                    <input
                        type="number"
                        name="inspectionWindow"
                        value={formData.inspectionWindow}
                        onChange={handleChange}
                        placeholder="5"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Designer Response Time (business days)</label>
                <input
                    type="number"
                    name="designerResponseTime"
                    value={formData.designerResponseTime}
                    onChange={handleChange}
                    placeholder="2"
                />
            </div>
        </div>
    );

    const renderProcessTab = () => (
        <div className="form-section">
            <h3>Service Process Features</h3>
            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeMaterialBreach"
                    checked={formData.includeMaterialBreach}
                    onChange={handleChange}
                />
                <label>Include Material Breach & Termination Clauses</label>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includePhotos"
                    checked={formData.includePhotos}
                    onChange={handleChange}
                />
                <label>Include Photography & Publicity Rights</label>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeConfidentiality"
                    checked={formData.includeConfidentiality}
                    onChange={handleChange}
                />
                <label>Include Confidentiality Agreement</label>
            </div>

            <h3>Risk Management</h3>
            <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                These clauses provide additional legal protection for your business:
            </p>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeForcemajeure"
                    checked={formData.includeForcemajeure}
                    onChange={handleChange}
                />
                <label>Include Force Majeure Provision</label>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeIndemnification"
                    checked={formData.includeIndemnification}
                    onChange={handleChange}
                />
                <label>Include Client Indemnification Clause</label>
            </div>
        </div>
    );

    const renderLegalTab = () => (
        <div className="form-section">
            <h3>Governing Law & Jurisdiction</h3>
            <div className="form-group">
                <label>Governing State</label>
                <select name="governingState" value={formData.governingState} onChange={handleChange}>
                    {usStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Dispute Resolution Method</label>
                <select name="disputeResolutionMethod" value={formData.disputeResolutionMethod} onChange={handleChange}>
                    <option value="courts">State/Federal Courts</option>
                    <option value="arbitration">Binding Arbitration</option>
                    <option value="mediation">Mediation First, Then Courts</option>
                </select>
            </div>

            <h3>Standard Legal Provisions</h3>
            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeSeverability"
                    checked={formData.includeSeverability}
                    onChange={handleChange}
                />
                <label>Include Severability Clause</label>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeEntireAgreement"
                    checked={formData.includeEntireAgreement}
                    onChange={handleChange}
                />
                <label>Include Entire Agreement Clause</label>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="includeArbitration"
                    checked={formData.includeArbitration}
                    onChange={handleChange}
                />
                <label>Include Arbitration Requirements</label>
            </div>
        </div>
    );

    const renderResultsTab = () => {
        // Risk Analysis
        const risks = [];
        
        if (!formData.includeMaterialBreach) {
            risks.push({
                level: 'high',
                title: 'No Material Breach Protection',
                description: 'Without material breach clauses, terminating difficult clients becomes legally complex.'
            });
        }
        
        if (!formData.includeIndemnification) {
            risks.push({
                level: 'high',
                title: 'No Indemnification Protection',
                description: 'You could be held liable for client actions or permit issues without indemnification.'
            });
        }
        
        if (formData.paymentTerms === 'net_30') {
            risks.push({
                level: 'medium',
                title: 'Extended Payment Terms',
                description: 'Net 30 payment terms increase cash flow risk compared to payment on receipt.'
            });
        }
        
        if (!formData.includeConfidentiality) {
            risks.push({
                level: 'medium',
                title: 'No Confidentiality Protection',
                description: 'Clients could share your proprietary processes and pricing with competitors.'
            });
        }
        
        if (parseInt(formData.latePaymentGrace) > 15) {
            risks.push({
                level: 'low',
                title: 'Extended Late Payment Grace',
                description: 'Long grace periods for late payments can impact cash flow.'
            });
        }

        return (
            <div className="form-section">
                <h3>Agreement Analysis</h3>
                <div className="results-section">
                    <h4>Document Statistics</h4>
                    <p>• Total Sections: 34 comprehensive sections</p>
                    <p>• Word Count: ~{Math.round(documentText.length / 5)} words</p>
                    <p>• Service Type: {formData.serviceType === 'e-design' ? 'E-Design Services' : 'Full-Service Interior Design'}</p>
                    <p>• Professional Clauses: {[formData.includeMaterialBreach, formData.includeIndemnification, formData.includeConfidentiality, formData.includeForcemajeure].filter(Boolean).length}/4 included</p>
                </div>

                <div className="results-section">
                    <h4>Risk Assessment</h4>
                    {risks.length === 0 ? (
                        <div className="risk-card low">
                            <h4>Excellent Legal Protection</h4>
                            <p>Your agreement includes comprehensive protection clauses and follows best practices.</p>
                        </div>
                    ) : (
                        risks.map((risk, index) => (
                            <div key={index} className={`risk-card ${risk.level}`}>
                                <h4>{risk.title}</h4>
                                <p>{risk.description}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="results-section">
                    <h4>Agreement Preview</h4>
                    <p style={{fontSize: '0.9rem', color: '#666'}}>
                        Your comprehensive Interior Design Services Agreement is ready for download. 
                        It includes all {Object.keys(formData).filter(key => formData[key] && typeof formData[key] === 'boolean').length} selected professional features 
                        and follows industry best practices.
                    </p>
                </div>
            </div>
        );
    };

    // Get current tab content
    const getCurrentTabContent = () => {
        switch (currentTab) {
            case 0: return renderPartiesTab();
            case 1: return renderServicesTab();
            case 2: return renderFeesTab();
            case 3: return renderTermsTab();
            case 4: return renderProcessTab();
            case 5: return renderLegalTab();
            case 6: return renderResultsTab();
            default: return renderPartiesTab();
        }
    };

    // Main component render
    return (
        <div className="container">
            <div className="main-content">
                <div className="form-panel">
                    <div className="header">
                        <h1>Interior Design Services Agreement Generator</h1>
                        <p>Create a comprehensive 34-section professional interior design services agreement</p>
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

                    {/* Dynamic Tab Content */}
                    {getCurrentTabContent()}

                    {/* Navigation Buttons */}
                    <div className="navigation-buttons">
                        <button
                            onClick={prevTab}
                            className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
                            disabled={currentTab === 0}
                        >
                            ← Previous
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
                            📋 Copy Agreement
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
                            📄 Download MS Word
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
                            📞 Consult
                        </button>
                        
                        <button
                            onClick={nextTab}
                            className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
                            disabled={currentTab === tabs.length - 1}
                        >
                            Next →
                        </button>
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="preview-panel" ref={previewRef}>
                    <div className="preview-content">
                        <h2>Live Agreement Preview</h2>
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
