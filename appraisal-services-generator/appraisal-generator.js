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
        cancellationPolicy: 'standard',
        recordRetention: '7',
        insuranceRequired: false
    });

    const previewRef = useRef(null);

    // All 50 US States
    const states = [
        { code: 'AL', name: 'Alabama' },
        { code: 'AK', name: 'Alaska' },
        { code: 'AZ', name: 'Arizona' },
        { code: 'AR', name: 'Arkansas' },
        { code: 'CA', name: 'California' },
        { code: 'CO', name: 'Colorado' },
        { code: 'CT', name: 'Connecticut' },
        { code: 'DE', name: 'Delaware' },
        { code: 'FL', name: 'Florida' },
        { code: 'GA', name: 'Georgia' },
        { code: 'HI', name: 'Hawaii' },
        { code: 'ID', name: 'Idaho' },
        { code: 'IL', name: 'Illinois' },
        { code: 'IN', name: 'Indiana' },
        { code: 'IA', name: 'Iowa' },
        { code: 'KS', name: 'Kansas' },
        { code: 'KY', name: 'Kentucky' },
        { code: 'LA', name: 'Louisiana' },
        { code: 'ME', name: 'Maine' },
        { code: 'MD', name: 'Maryland' },
        { code: 'MA', name: 'Massachusetts' },
        { code: 'MI', name: 'Michigan' },
        { code: 'MN', name: 'Minnesota' },
        { code: 'MS', name: 'Mississippi' },
        { code: 'MO', name: 'Missouri' },
        { code: 'MT', name: 'Montana' },
        { code: 'NE', name: 'Nebraska' },
        { code: 'NV', name: 'Nevada' },
        { code: 'NH', name: 'New Hampshire' },
        { code: 'NJ', name: 'New Jersey' },
        { code: 'NM', name: 'New Mexico' },
        { code: 'NY', name: 'New York' },
        { code: 'NC', name: 'North Carolina' },
        { code: 'ND', name: 'North Dakota' },
        { code: 'OH', name: 'Ohio' },
        { code: 'OK', name: 'Oklahoma' },
        { code: 'OR', name: 'Oregon' },
        { code: 'PA', name: 'Pennsylvania' },
        { code: 'RI', name: 'Rhode Island' },
        { code: 'SC', name: 'South Carolina' },
        { code: 'SD', name: 'South Dakota' },
        { code: 'TN', name: 'Tennessee' },
        { code: 'TX', name: 'Texas' },
        { code: 'UT', name: 'Utah' },
        { code: 'VT', name: 'Vermont' },
        { code: 'VA', name: 'Virginia' },
        { code: 'WA', name: 'Washington' },
        { code: 'WV', name: 'West Virginia' },
        { code: 'WI', name: 'Wisconsin' },
        { code: 'WY', name: 'Wyoming' }
    ];

    // Tab configuration - Presets now first!
    const tabs = [
        { id: 'presets', label: 'Quick Presets', icon: 'zap' },
        { id: 'business', label: 'Business Info', icon: 'briefcase' },
        { id: 'client', label: 'Client Info', icon: 'user' },
        { id: 'service', label: 'Service Details', icon: 'clipboard' },
        { id: 'pricing', label: 'Pricing', icon: 'dollar-sign' },
        { id: 'legal', label: 'Legal Terms', icon: 'shield' },
        { id: 'finalize', label: 'Review & Risk', icon: 'check-circle' }
    ];

    // Enhanced quick presets for different appraisal types
    const appraisalPresets = {
        jewelry: {
            name: 'Fine Jewelry & Watches',
            appraisalType: 'jewelry',
            baseFee: '250',
            hourlyRate: '150',
            itemDescription: 'Fine jewelry including rings, necklaces, bracelets, earrings, watches, and precious gemstones',
            purposeOfAppraisal: 'insurance',
            inspectionLocation: 'office',
            rushFee: '100',
            travelFee: '75',
            icon: '💎',
            description: 'Comprehensive appraisals for fine jewelry, luxury watches, and precious stones for insurance, estate, or resale purposes.'
        },
        antiques: {
            name: 'Antiques & Collectibles',
            appraisalType: 'antiques',
            baseFee: '300',
            hourlyRate: '175',
            itemDescription: 'Antique furniture, vintage collectibles, historical artifacts, and estate items',
            purposeOfAppraisal: 'estate',
            inspectionLocation: 'client_location',
            rushFee: '125',
            travelFee: '100',
            icon: '🏺',
            description: 'Professional evaluation of antiques, collectibles, and vintage items with historical research and market analysis.'
        },
        artwork: {
            name: 'Fine Art & Paintings',
            appraisalType: 'artwork',
            baseFee: '350',
            hourlyRate: '200',
            itemDescription: 'Original paintings, sculptures, prints, photographs, and mixed media artworks',
            purposeOfAppraisal: 'insurance',
            inspectionLocation: 'mutual',
            rushFee: '150',
            travelFee: '125',
            icon: '🖼️',
            description: 'Expert appraisals for fine art, including provenance research and authentication when needed.'
        },
        luxury_goods: {
            name: 'Luxury Goods & Fashion',
            appraisalType: 'luxury_goods',
            baseFee: '275',
            hourlyRate: '160',
            itemDescription: 'Designer handbags, luxury accessories, fine clothing, and premium fashion items',
            purposeOfAppraisal: 'insurance',
            inspectionLocation: 'office',
            rushFee: '100',
            travelFee: '75',
            icon: '👜',
            description: 'Specialized appraisals for luxury fashion items, handbags, and designer accessories.'
        },
        coins: {
            name: 'Coins & Currency',
            appraisalType: 'coins',
            baseFee: '200',
            hourlyRate: '125',
            itemDescription: 'Rare coins, currency, numismatic collections, and precious metal bullion',
            purposeOfAppraisal: 'insurance',
            inspectionLocation: 'office',
            rushFee: '75',
            travelFee: '50',
            icon: '🪙',
            description: 'Numismatic appraisals for coin collections, rare currency, and precious metal investments.'
        },
        firearms: {
            name: 'Firearms & Militaria',
            appraisalType: 'firearms',
            baseFee: '225',
            hourlyRate: '140',
            itemDescription: 'Firearms, ammunition, military collectibles, and historical weapons',
            purposeOfAppraisal: 'insurance',
            inspectionLocation: 'mutual',
            rushFee: '100',
            travelFee: '75',
            icon: '🔫',
            description: 'Professional firearm appraisals including historical research and compliance verification.'
        },
        instruments: {
            name: 'Musical Instruments',
            appraisalType: 'instruments',
            baseFee: '275',
            hourlyRate: '165',
            itemDescription: 'Musical instruments including string, wind, brass, and percussion instruments',
            purposeOfAppraisal: 'insurance',
            inspectionLocation: 'mutual',
            rushFee: '125',
            travelFee: '100',
            icon: '🎻',
            description: 'Specialized appraisals for musical instruments with technical condition assessment.'
        },
        vehicles: {
            name: 'Classic & Specialty Vehicles',
            appraisalType: 'vehicles',
            baseFee: '400',
            hourlyRate: '185',
            itemDescription: 'Classic cars, motorcycles, boats, and specialty vehicles',
            purposeOfAppraisal: 'insurance',
            inspectionLocation: 'client_location',
            rushFee: '150',
            travelFee: '125',
            icon: '🚗',
            description: 'Comprehensive vehicle appraisals including mechanical condition and market analysis.'
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

    // Apply preset with enhanced functionality
    const applyPreset = (presetKey) => {
        const preset = appraisalPresets[presetKey];
        setFormData(prev => ({ 
            ...prev, 
            ...preset,
            // Keep existing business and client info
            appraiserName: prev.appraiserName,
            businessName: prev.businessName,
            licenseNumber: prev.licenseNumber,
            address: prev.address,
            city: prev.city,
            state: prev.state,
            zipCode: prev.zipCode,
            phone: prev.phone,
            email: prev.email,
            clientName: prev.clientName,
            clientAddress: prev.clientAddress,
            clientCity: prev.clientCity,
            clientState: prev.clientState,
            clientZipCode: prev.clientZipCode,
            clientPhone: prev.clientPhone,
            clientEmail: prev.clientEmail
        }));
        setLastChanged('preset');
        setTimeout(() => setLastChanged(null), 3000);
    };

    // Generate enhanced document text with proper legal language
    const generateDocument = () => {
        const today = new Date().toLocaleDateString();
        
        return `PROFESSIONAL APPRAISAL SERVICES AGREEMENT

This Professional Appraisal Services Agreement ("Agreement") is entered into on ${today}, between ${formData.businessName || formData.appraiserName} ("Appraiser"), a professional appraisal business ${formData.licenseNumber ? `licensed under number ${formData.licenseNumber}` : 'operating'} in the state of ${formData.state}, with principal place of business located at ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}${formData.phone ? `, telephone ${formData.phone}` : ''}${formData.email ? `, email ${formData.email}` : ''}, and ${formData.clientName} ("Client"), with address at ${formData.clientAddress}, ${formData.clientCity}, ${formData.clientState} ${formData.clientZipCode}${formData.clientPhone ? `, telephone ${formData.clientPhone}` : ''}${formData.clientEmail ? `, email ${formData.clientEmail}` : ''}.

RECITALS

WHEREAS, Appraiser represents that they possess the necessary qualifications, experience, and professional credentials to provide competent appraisal services for the type of property described herein; and

WHEREAS, Client desires to engage Appraiser to provide professional appraisal services for certain personal property; and

WHEREAS, both parties wish to establish clear terms and conditions governing the provision of such services;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. SCOPE OF APPRAISAL SERVICES

1.1 Property Description. Appraiser agrees to provide professional appraisal services for the following described property: ${formData.itemDescription || 'Items to be determined at time of inspection'}.

1.2 Purpose and Intended Use. This appraisal is being conducted for ${formData.purposeOfAppraisal === 'insurance' ? 'insurance replacement value determination and coverage purposes' : formData.purposeOfAppraisal === 'estate' ? 'estate planning, probate, and tax valuation purposes' : formData.purposeOfAppraisal === 'donation' ? 'charitable donation tax deduction substantiation' : formData.purposeOfAppraisal === 'divorce' ? 'equitable distribution in marital dissolution proceedings' : 'fair market value determination'}. The appraisal report is intended solely for use by the Client and for the stated purpose, and shall not be used for any other purpose without the prior written consent of the Appraiser.

1.3 Services Included. The appraisal services shall include, but not be limited to:
    (a) Physical examination and professional evaluation of the subject property;
    (b) Research and analysis of comparable sales data and current market conditions;
    (c) Application of appropriate valuation methodologies and techniques;
    (d) Preparation of a ${formData.reportFormat === 'written' ? 'comprehensive written appraisal report' : 'verbal appraisal summary with written certification'};
    ${formData.photosIncluded ? '(e) Digital photography and documentation of the appraised property;' : ''}
    (f) Professional opinion of value based on thorough market analysis and expertise.

1.4 Inspection Arrangements. ${formData.inspectionLocation === 'office' ? 'The inspection shall take place at Appraiser\'s business premises during regular business hours by mutual appointment.' : formData.inspectionLocation === 'client_location' ? 'The inspection shall be conducted at Client\'s location as mutually agreed upon, subject to additional travel charges as specified herein.' : 'The inspection location shall be mutually agreed upon by both parties, with consideration for security, proper lighting, and professional examination requirements.'}

2. COMPENSATION AND PAYMENT TERMS

2.1 Base Appraisal Fee. Client agrees to pay Appraiser a base fee of $${formData.baseFee} for the appraisal services described herein.

${formData.hourlyRate ? `2.2 Additional Services. For complex items requiring extensive research or multiple sessions, additional services shall be billed at the rate of $${formData.hourlyRate} per hour, with prior notice to Client of any anticipated additional charges exceeding $100.` : ''}

${formData.rushService ? `2.3 Expedited Service. Client has requested expedited completion within forty-eight (48) hours, for which an additional rush service fee of $${formData.rushFee} shall apply.` : ''}

${formData.inspectionLocation === 'client_location' ? `2.4 Travel and On-Site Inspection. For on-site inspections at Client's location, a travel fee of $${formData.travelFee} shall apply to cover transportation, time, and incidental expenses.` : ''}

2.5 Payment Terms. ${formData.paymentTerms === 'upfront' ? 'Full payment is due prior to commencement of appraisal services. No work shall begin until payment is received.' : formData.paymentTerms === '50_50' ? 'Fifty percent (50%) of the total fee is due upon execution of this Agreement, with the balance due upon completion and delivery of the appraisal report.' : formData.paymentTerms === 'completion' ? 'Full payment is due upon completion and delivery of the appraisal report.' : 'Payment terms are Net Thirty (30) days from invoice date. A service charge of 1.5% per month may be applied to past due balances.'}

2.6 Additional Costs. Client shall be responsible for any extraordinary expenses incurred in connection with the appraisal, including but not limited to specialized research, authentication services, or expert consultations, provided such expenses are pre-approved by Client in writing.

3. DELIVERY AND COMPLETION TIMELINE

3.1 Completion Schedule. The completed appraisal report shall be delivered within ${formData.rushService ? 'forty-eight (48) hours' : 'five to seven (5-7) business days'} following completion of the physical inspection, subject to the complexity of the assignment and availability of comparable market data.

3.2 Delivery Method. The appraisal report shall be delivered to Client via ${formData.deliveryMethod === 'email' ? 'secure email transmission in PDF format' : formData.deliveryMethod === 'mail' ? 'certified mail with return receipt requested' : 'secure electronic client portal with password protection'}.

3.3 Force Majeure. Appraiser shall not be liable for delays caused by circumstances beyond their reasonable control, including but not limited to acts of God, government actions, labor disputes, or unavailability of comparable market data.

4. PROFESSIONAL STANDARDS AND COMPLIANCE

4.1 USPAP Compliance. Appraiser warrants that all appraisal services shall be performed in accordance with the current Uniform Standards of Professional Appraisal Practice (USPAP) and applicable state regulations governing professional appraisal practice.

4.2 Professional Competency. Appraiser represents that they possess the necessary education, experience, and competency to appraise the type of property described herein, and that the appraisal will be completed with impartiality, objectivity, and independence.

4.3 Ethical Standards. Appraiser agrees to adhere to the highest ethical standards of the appraisal profession and shall not have any present or contemplated future interest in the appraised property that would compromise their objectivity.

5. RECORD RETENTION AND DOCUMENTATION

5.1 Workfile Retention. Appraiser shall maintain a complete workfile containing all documentation, research, and supporting materials for a period of ${formData.recordRetention} years from the date of the appraisal report, or as otherwise required by applicable law or professional standards.

5.2 Client Access. Client shall have reasonable access to inspect the workfile upon written request, subject to applicable confidentiality restrictions and professional standards.

5.3 Third Party Requests. Appraiser shall not provide workfile documentation to third parties without Client's written consent, except as required by law, court order, or professional disciplinary proceedings.

6. APPRAISAL VALIDITY AND MARKET CONDITIONS

6.1 Effective Date. This appraisal reflects the value of the subject property as of the date of inspection and is valid for a period of ${formData.validityPeriod} months from such date.

6.2 Market Fluctuations. Client acknowledges that market values are subject to fluctuation due to economic conditions, supply and demand factors, and other market forces beyond Appraiser's control. This appraisal represents Appraiser's professional opinion of value as of the effective date and should not be construed as a guarantee of the price that may be obtained in an actual sale.

6.3 Updates and Reappraisals. If current market value is required beyond the validity period, a new appraisal or updated valuation may be necessary at additional cost.

7. LIMITATION OF LIABILITY AND PROFESSIONAL DISCLAIMERS

${formData.limitationOfLiability ? `7.1 Limitation of Liability. APPRAISER'S TOTAL LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT, OR OTHERWISE, SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY CLIENT FOR THE APPRAISAL SERVICES. IN NO EVENT SHALL APPRAISER BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOST OPPORTUNITY, OR LOSS OF USE.

7.2 Professional Opinion. The appraisal represents Appraiser's professional opinion of value based on recognized appraisal methodologies, market research, and professional judgment. It is not a guarantee, warranty, or prediction of the price that may be obtained if the property is offered for sale.

7.3 Market Conditions. Appraiser makes no warranty regarding future market conditions, economic trends, or the continued accuracy of the valuation beyond the stated validity period.` : '7.1 Standard Liability. Appraiser shall be liable for damages only to the extent such damages are directly caused by Appraiser\'s gross negligence or willful misconduct in the performance of services under this Agreement.'}

8. CONFIDENTIALITY AND PRIVACY

${formData.clientConfidentiality ? `8.1 Confidentiality Obligation. Appraiser agrees to maintain strict confidentiality regarding Client's identity, the specific property appraised, the appraised values, and any other proprietary or personal information obtained during the course of the engagement.

8.2 Non-Disclosure. Appraiser shall not disclose any confidential information to third parties without Client's prior written consent, except as required by law, court order, or applicable professional standards and regulations.

8.3 Marketing and Testimonials. Appraiser shall not use Client's name, the appraised property, or any details of the appraisal engagement for marketing, promotional, or testimonial purposes without Client's express written permission.` : '8.1 Standard Confidentiality. Appraiser shall maintain confidentiality in accordance with standard professional appraisal practices and applicable laws and regulations.'}

9. CANCELLATION AND MODIFICATION

9.1 Cancellation Policy. ${formData.cancellationPolicy === 'standard' ? 'Either party may cancel this Agreement with twenty-four (24) hours written notice. If canceled after the inspection has commenced, Client shall be responsible for payment of all services rendered and expenses incurred up to the point of cancellation.' : formData.cancellationPolicy === 'strict' ? 'Client may cancel this Agreement with forty-eight (48) hours written notice. Cancellations with less than forty-eight (48) hours notice may result in a cancellation fee equal to fifty percent (50%) of the base appraisal fee.' : 'Cancellation terms shall be determined on a case-by-case basis, taking into consideration work completed and expenses incurred.'}

9.2 Modification. This Agreement may only be modified by written consent of both parties.

10. DISPUTE RESOLUTION AND GOVERNING LAW

10.1 Dispute Resolution. Any disputes arising under this Agreement shall be resolved through ${formData.disputeResolution === 'mediation' ? 'binding mediation conducted under the rules of the American Arbitration Association' : formData.disputeResolution === 'arbitration' ? 'binding arbitration conducted under the rules of the American Arbitration Association' : 'appropriate legal proceedings in the courts'} in ${formData.governingLaw}.

10.2 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without regard to conflict of law principles.

10.3 Attorney's Fees. In the event of any legal proceeding arising from this Agreement, the prevailing party shall be entitled to recover reasonable attorney's fees and costs.

11. GENERAL PROVISIONS

11.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter hereof.

11.2 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

11.3 Assignment. This Agreement may not be assigned by either party without the prior written consent of the other party.

11.4 Notices. All notices required under this Agreement shall be in writing and delivered by email, certified mail, or personal delivery to the addresses specified herein.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

APPRAISER:                           CLIENT:

_________________________________    _________________________________
${formData.appraiserName}                     ${formData.clientName}
${formData.businessName}
${formData.licenseNumber ? `License #${formData.licenseNumber}` : ''}

Date: ___________________________    Date: ___________________________

Contact Information:
Appraiser: ${formData.phone || '[Phone]'} | ${formData.email || '[Email]'}
Client: ${formData.clientPhone || '[Phone]'} | ${formData.clientEmail || '[Email]'}`;
    };

    const documentText = generateDocument();

    // Highlighting logic
    const getSectionToHighlight = () => {
        if (!lastChanged) return null;
        
        switch (currentTab) {
            case 0: // Quick Presets
                if (lastChanged === 'preset') {
                    return 'scope-section';
                }
                break;
            case 1: // Business Info
                if (['appraiserName', 'businessName', 'address', 'city', 'state', 'zipCode'].includes(lastChanged)) {
                    return 'business-info';
                }
                break;
            case 2: // Client Info
                if (['clientName', 'clientAddress', 'clientCity', 'clientState', 'clientZipCode'].includes(lastChanged)) {
                    return 'client-info';
                }
                break;
            case 3: // Service Details
                if (['appraisalType', 'itemDescription', 'purposeOfAppraisal', 'inspectionLocation'].includes(lastChanged)) {
                    return 'service-details';
                }
                break;
            case 4: // Pricing
                if (['baseFee', 'hourlyRate', 'rushFee', 'travelFee', 'paymentTerms'].includes(lastChanged)) {
                    return 'pricing-section';
                }
                break;
            case 5: // Legal Terms
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
            'scope-section': /(1\. SCOPE OF APPRAISAL SERVICES.*?(?=2\. COMPENSATION))/s,
            'service-details': /(1\.1 Property Description.*?(?=1\.5|2\.))/s,
            'pricing-section': /(2\. COMPENSATION AND PAYMENT TERMS.*?(?=3\. DELIVERY))/s,
            'legal-terms': /(7\. LIMITATION OF LIABILITY.*?(?=8\. CONFIDENTIALITY))/s
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
                documentTitle: "Professional Appraisal Services Agreement",
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
                description: 'Appraiser name and business name are critical for legal enforceability and professional credibility.'
            });
        }
        
        if (!formData.licenseNumber && ['jewelry', 'antiques', 'artwork'].includes(formData.appraisalType)) {
            risks.push({
                level: 'medium',
                title: 'Missing License Information',
                description: 'Professional license number adds credibility and may be required for certain appraisal types in your jurisdiction.'
            });
        }
        
        if (!formData.limitationOfLiability) {
            risks.push({
                level: 'high',
                title: 'No Liability Limitation',
                description: 'Without liability limitations, you may be exposed to significant financial risk if valuation disputes arise or market conditions change.'
            });
        }
        
        if (formData.paymentTerms === 'completion') {
            risks.push({
                level: 'medium',
                title: 'Payment Risk',
                description: 'Payment after completion increases risk of non-payment. Consider requiring at least partial upfront payment for larger engagements.'
            });
        }
        
        if (!formData.clientConfidentiality) {
            risks.push({
                level: 'medium',
                title: 'Confidentiality Gap',
                description: 'Client confidentiality clauses protect both parties and are especially important for high-value or sensitive appraisals.'
            });
        }
        
        if (formData.validityPeriod > 12) {
            risks.push({
                level: 'low',
                title: 'Extended Validity Period',
                description: 'Appraisal validity over 12 months may not reflect rapidly changing market conditions, especially in volatile markets.'
            });
        }
        
        if (!formData.itemDescription) {
            risks.push({
                level: 'medium',
                title: 'Incomplete Scope Definition',
                description: 'Detailed item descriptions help prevent scope creep and clarify exactly what is being appraised.'
            });
        }
        
        // Add positive assessments
        if (formData.limitationOfLiability && formData.clientConfidentiality && formData.licenseNumber && formData.itemDescription) {
            risks.push({
                level: 'low',
                title: 'Well-Protected Agreement',
                description: 'Excellent liability protection, professional credentials disclosed, and clear scope definition provide strong legal foundation.'
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
            case 0: // Quick Presets - Now First Tab!
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="zap"></i> Quick Start Presets
                        </h3>
                        
                        <div className="info-box preset-info">
                            <p><strong>🚀 Get started instantly!</strong> Choose a preset below to automatically configure pricing, descriptions, and terms for your specialty. You can customize everything afterward.</p>
                        </div>
                        
                        <div className="enhanced-presets">
                            {Object.entries(appraisalPresets).map(([key, preset]) => (
                                <div
                                    key={key}
                                    className={`preset-card ${formData.appraisalType === key ? 'active' : ''}`}
                                    onClick={() => applyPreset(key)}
                                >
                                    <div className="preset-icon">{preset.icon}</div>
                                    <div className="preset-content">
                                        <h4>{preset.name}</h4>
                                        <p className="preset-description">{preset.description}</p>
                                        <div className="preset-pricing">
                                            <span className="base-fee">Base: ${preset.baseFee}</span>
                                            <span className="hourly-rate">Hourly: ${preset.hourlyRate}</span>
                                        </div>
                                    </div>
                                    <div className="preset-check">
                                        {formData.appraisalType === key && <i data-feather="check-circle"></i>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="preset-benefits">
                            <h4>🎯 Why Use Presets?</h4>
                            <ul>
                                <li><strong>Industry Standards:</strong> Pre-configured with market-standard pricing</li>
                                <li><strong>Professional Language:</strong> Appropriate descriptions for each specialty</li>
                                <li><strong>Time Saving:</strong> Complete setup in seconds, customize as needed</li>
                                <li><strong>Best Practices:</strong> Optimized terms based on industry experience</li>
                            </ul>
                        </div>
                    </div>
                );

            case 1: // Business Info
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="briefcase"></i> Business Information
                        </h3>
                        
                        <div className="info-box">
                            <p>Enter your professional details as they should appear on the agreement.</p>
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
                                    placeholder="ASA-12345 or ISA-CAPP-12345"
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
                                    {states.map(state => (
                                        <option key={state.code} value={state.code}>{state.name}</option>
                                    ))}
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

            case 2: // Client Info
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
                                placeholder="Jane Doe or ABC Insurance Company"
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
                                    {states.map(state => (
                                        <option key={state.code} value={state.code}>{state.name}</option>
                                    ))}
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

            case 3: // Service Details
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="clipboard"></i> Service Details
                        </h3>
                        
                        <div className="info-box">
                            <p>Customize the service details. If you used a preset, these fields are pre-filled but can be modified.</p>
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
                                    <option value="instruments">Musical Instruments</option>
                                    <option value="vehicles">Vehicles</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Purpose of Appraisal *</label>
                                <select name="purposeOfAppraisal" value={formData.purposeOfAppraisal} onChange={handleChange}>
                                    <option value="insurance">Insurance Coverage</option>
                                    <option value="estate">Estate/Tax Planning</option>
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
                                placeholder="Provide detailed description of items to be appraised, including quantities, materials, brands, conditions, etc."
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
                                <label>Report Format *</label>
                                <select name="reportFormat" value={formData.reportFormat} onChange={handleChange}>
                                    <option value="written">Written Report</option>
                                    <option value="verbal">Verbal + Certificate</option>
                                </select>
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
                        
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="photosIncluded"
                                checked={formData.photosIncluded}
                                onChange={handleChange}
                            />
                            <label>Include Digital Photos in Report</label>
                        </div>
                    </div>
                );

            case 4: // Pricing
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="dollar-sign"></i> Pricing Structure
                        </h3>
                        
                        <div className="info-box">
                            <p>Set your fee structure and payment terms. Preset values are loaded but can be customized.</p>
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
                                <option value="upfront">Full Payment Upfront (Recommended)</option>
                                <option value="50_50">50% Upfront, 50% on Completion</option>
                                <option value="completion">Full Payment on Completion</option>
                                <option value="net30">Net 30 Days</option>
                            </select>
                        </div>
                    </div>
                );

            case 5: // Legal Terms
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="shield"></i> Legal Terms & Protection
                        </h3>
                        
                        <div className="info-box">
                            <p>Configure legal protections and terms for your agreement. Recommended settings are pre-selected.</p>
                        </div>
                        
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="limitationOfLiability"
                                checked={formData.limitationOfLiability}
                                onChange={handleChange}
                            />
                            <label><strong>Include Limitation of Liability Clause (Strongly Recommended)</strong></label>
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
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Dispute Resolution *</label>
                                <select name="disputeResolution" value={formData.disputeResolution} onChange={handleChange}>
                                    <option value="mediation">Binding Mediation (Fastest)</option>
                                    <option value="arbitration">Binding Arbitration</option>
                                    <option value="courts">Court System</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Governing Law *</label>
                                <select name="governingLaw" value={formData.governingLaw} onChange={handleChange}>
                                    {states.map(state => (
                                        <option key={state.code} value={state.name}>{state.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Report Delivery Method *</label>
                                <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange}>
                                    <option value="email">Email (PDF) - Most Common</option>
                                    <option value="mail">Certified Mail</option>
                                    <option value="portal">Secure Client Portal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Appraisal Validity (Months) *</label>
                                <select name="validityPeriod" value={formData.validityPeriod} onChange={handleChange}>
                                    <option value="6">6 Months</option>
                                    <option value="12">12 Months (Standard)</option>
                                    <option value="24">24 Months</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Record Retention (Years) *</label>
                                <select name="recordRetention" value={formData.recordRetention} onChange={handleChange}>
                                    <option value="5">5 Years</option>
                                    <option value="7">7 Years (Recommended)</option>
                                    <option value="10">10 Years</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cancellation Policy *</label>
                                <select name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange}>
                                    <option value="standard">Standard (24 hours notice)</option>
                                    <option value="strict">Strict (48 hours + fee)</option>
                                    <option value="flexible">Flexible (case-by-case)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Risk Assessment
                const risks = getRiskAssessment();
                return (
                    <div className="form-section">
                        <h3 className="section-title">
                            <i data-feather="check-circle"></i> Agreement Review & Risk Assessment
                        </h3>
                        
                        <div className="info-box">
                            <p>Review your agreement settings and assess potential risks before finalizing.</p>
                        </div>
                        
                        <div className="risk-assessment">
                            <h4>🎯 Risk Analysis</h4>
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
                            <h4>📋 Agreement Summary</h4>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <p><strong>Appraiser:</strong> {formData.appraiserName || '[Not specified]'} {formData.businessName ? `(${formData.businessName})` : '[Business name not provided]'}</p>
                                <p><strong>Client:</strong> {formData.clientName || '[Not specified]'}</p>
                                <p><strong>Service:</strong> {appraisalPresets[formData.appraisalType]?.name || formData.appraisalType} for {formData.purposeOfAppraisal}</p>
                                <p><strong>Base Fee:</strong> ${formData.baseFee || '0'} {formData.hourlyRate ? `+ $${formData.hourlyRate}/hr for complex items` : ''}</p>
                                <p><strong>Payment Terms:</strong> {formData.paymentTerms?.replace('_', ' ').replace('upfront', 'Full upfront payment').replace('completion', 'Payment on completion').replace('net30', 'Net 30 days')}</p>
                                <p><strong>Liability Protection:</strong> <span style={{color: formData.limitationOfLiability ? '#16a34a' : '#dc2626'}}>{formData.limitationOfLiability ? '✓ Included' : '✗ Not included'}</span></p>
                                <p><strong>Confidentiality:</strong> <span style={{color: formData.clientConfidentiality ? '#16a34a' : '#64748b'}}>{formData.clientConfidentiality ? '✓ Included' : '○ Standard only'}</span></p>
                                <p><strong>Record Retention:</strong> {formData.recordRetention} years</p>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '20px', padding: '15px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                            <h4 style={{ color: '#1e40af', marginBottom: '8px' }}>🚀 Ready to Finalize?</h4>
                            <p style={{ color: '#1e40af', fontSize: '0.9rem', margin: 0 }}>
                                Your agreement is ready! Use the Copy or Download buttons below to get your professional appraisal services agreement. 
                                {risks.some(r => r.level === 'high') && ' Consider addressing high-risk items first.'}
                            </p>
                        </div>
                    </div>
                );

            default:
                return <div>Tab content not found</div>;
        }
    };


    // Render main component
    return (
        <div className="appraisal-generator">
            <div className="container">
                <div className="generator-content">
                    {/* Left Panel - Form */}
                    <div className="form-panel">
                        <div className="header">
                            <h1>Professional Appraisal Services Agreement Generator</h1>
                            <p>Generate comprehensive appraisal service agreements with industry-standard terms and specialized presets for jewelry, antiques, artwork, and more.</p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="tab-navigation">
                            {tabs.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    className={`tab-button ${currentTab === index ? 'active' : ''}`}
                                    onClick={() => goToTab(index)}
                                >
                                    <i data-feather={tab.icon}></i>
                                    <span>{index + 1}. {tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {renderTabContent()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="navigation-buttons">
                            <button
                                onClick={prevTab}
                                className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
                                disabled={currentTab === 0}
                            >
                                <i data-feather="chevron-left"></i>
                                Previous
                            </button>
                            
                            <button
                                onClick={copyToClipboard}
                                className="nav-button copy-button"
                            >
                                <i data-feather="copy"></i>
                                Copy
                            </button>
                            
                            <button
                                onClick={downloadAsWord}
                                className="nav-button download-button"
                            >
                                <i data-feather="file-text"></i>
                                Download MS Word
                            </button>
                            
                            <button
                                onClick={openConsultation}
                                className="nav-button consult-button"
                            >
                                <i data-feather="calendar"></i>
                                Consult
                            </button>
                            
                            <button
                                onClick={nextTab}
                                className="nav-button next-button"
                            >
                                Next
                                <i data-feather="chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Live Preview */}
                    <div className="preview-panel" ref={previewRef}>
                        <div className="preview-header">
                            <h2>Live Agreement Preview</h2>
                            <p>Watch your professional agreement update in real-time</p>
                        </div>
                        <div className="preview-content">
                            <pre 
                                className="document-preview"
                                dangerouslySetInnerHTML={{ __html: highlightedText }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<AppraisalGenerator />, document.getElementById('root'));
