const { useState, useEffect, useRef } = React;

const InteriorDesignAgreementGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false); // Don't show paywall initially
    const [showLegalChat, setShowLegalChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [contextualTip, setContextualTip] = useState('');
    const [smartHelp, setSmartHelp] = useState('');
    const [showTooltip, setShowTooltip] = useState({ field: null, content: '' });
    const [paypalId, setPaypalId] = useState('');
    const [paypalError, setPaypalError] = useState('');
    const previewRef = useRef(null);
    const chatMessagesRef = useRef(null);

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

    // Smart help suggestions based on user selections
    const getSmartHelp = (fieldName, value) => {
        const helpSuggestions = {
            serviceType: value === 'e-design' ? 
                "💡 <strong>E-Design Tip:</strong> E-design services have specific liability limitations. Clients are responsible for measurements and implementation. Consider adding measurement accuracy clauses." :
                "💡 <strong>Full-Service Tip:</strong> Full-service projects require more comprehensive insurance and liability coverage. Consider higher indemnification protections.",
            
            includeMaterialBreach: value ? 
                "⚖️ <strong>Material Breach Activated:</strong> This powerful clause lets you terminate clients who:<br>• Reject 80%+ of designs without cause<br>• Impose impossible budgets<br>• Bypass you to contact vendors<br>• Delay payments beyond terms" : 
                "⚠️ <strong>Consider Material Breach:</strong> Without this protection, terminating difficult clients requires standard breach procedures, which can be lengthy and costly.",
            
            includeIndemnification: value ? 
                "🛡️ <strong>Indemnification Enabled:</strong> Client will cover costs if they:<br>• Make unauthorized changes<br>• Fail to get permits<br>• Cause property damage<br>• Breach building codes" : 
                "⚠️ <strong>Risk Alert:</strong> Without indemnification, you could be liable for client mistakes, permit issues, or code violations they cause.",
            
            paymentTerms: value === 'due_on_receipt' ? 
                "💰 <strong>Smart Choice:</strong> Due-on-receipt terms improve cash flow by 40% compared to Net 30. Combined with late fees, this prevents payment delays." :
                "⏳ <strong>Cash Flow Impact:</strong> Net 30 terms can strain cash flow. Consider due-on-receipt for better financial protection.",
            
            latePaymentGrace: parseInt(value) <= 10 ? 
                "⚡ <strong>Aggressive Collection:</strong> " + value + "-day grace period ensures fast action on overdue accounts. Studies show shorter periods improve collection rates by 25%." :
                parseInt(value) > 20 ? "🐌 <strong>Extended Grace:</strong> " + value + " days may be too lenient. Consider 10-15 days for better cash flow protection." : "",
            
            includeConfidentiality: value ? 
                "🔒 <strong>IP Protection Active:</strong> Prevents clients from sharing your:<br>• Design processes<br>• Pricing strategies<br>• Vendor relationships<br>• Trade secrets" : 
                "🔓 <strong>IP Risk:</strong> Without confidentiality protection, clients can share your proprietary methods with competitors.",
            
            validityPeriod: parseInt(value) <= 60 ? 
                "⏰ <strong>Short Validity:</strong> " + value + " days creates urgency but may pressure clients. Consider if this timeframe works for your typical projects." :
                parseInt(value) > 120 ? "📅 <strong>Extended Validity:</strong> " + value + " days is generous but reduces urgency. Most designers use 60-90 days." : "",
            
            revisionRounds: parseInt(value) <= 1 ? 
                "🔄 <strong>Limited Revisions:</strong> Only " + value + " revision round is restrictive. Consider 2-3 rounds for better client satisfaction." :
                parseInt(value) >= 4 ? "🔄 <strong>Generous Revisions:</strong> " + value + " rounds may encourage scope creep. Most successful designers limit to 2-3 rounds." : "",
            
            eDesignFee: parseInt(value) < 1500 ? 
                "💵 <strong>Pricing Alert:</strong> $" + value + " per room is below market rate. Industry average is $1,800-$2,500 per room for comprehensive e-design." :
                parseInt(value) > 3500 ? "💰 <strong>Premium Pricing:</strong> $" + value + " is above average. Ensure your portfolio and process justify premium rates." : "",
            
            includeRushOption: value ? 
                "🚀 <strong>Rush Services:</strong> Smart revenue opportunity. Rush surcharges typically range from 25-75% depending on timeline compression." : "",
            
            disputeResolutionMethod: value === 'mediation' ? 
                "🤝 <strong>Mediation First:</strong> Cost-effective dispute resolution, but adds steps before court action. Good for maintaining relationships." :
                "⚖️ <strong>Court Resolution:</strong> Direct legal action available. Faster for clear-cut breaches but potentially more adversarial."
        };
        
        return helpSuggestions[fieldName] || '';
    };

    // Tooltip content for form fields
    const tooltips = {
        designerEntity: "Choose the legal structure of your business. LLCs provide liability protection while maintaining tax flexibility.",
        serviceType: "E-Design: Remote design services with client implementation. Full-Service: Complete design and installation management.",
        eDesignFee: "Industry standard: $1,800-$2,500 per room. Price based on complexity, market, and your experience level.",
        additionalSelectionsFee: "Charge for extra design options beyond initial 3 choices. Prevents unlimited revision requests.",
        delayedPurchaseFee: "Fee for re-sourcing items when clients delay purchase decisions beyond approval window.",
        itemRemovalFee: "Hourly rate for removing client's personal items during installation. Protects your time.",
        redesignFee: "Flat fee for complete design overhaul after final approval. Prevents scope creep.",
        rushSurcharge: "Percentage surcharge for expedited projects. Compensates for compressed timelines and priority scheduling.",
        validityPeriod: "Time limit for package validity after final payment. Prevents indefinite support obligations.",
        revisionRounds: "Number of included revision cycles per item. Additional rounds become billable.",
        informationDeadline: "Deadline for client to provide measurements, photos, and requirements. Prevents project delays.",
        responseTime: "Maximum time client has to respond to your requests. Keeps projects moving forward.",
        depositPercentage: "Upfront payment percentage. Higher deposits reduce financial risk and client commitment.",
        latePaymentRate: "Monthly interest rate on overdue payments. Legal limit varies by state (typically 1-2%).",
        latePaymentGrace: "Days before late fees apply. Shorter periods improve cash flow, longer periods reduce disputes.",
        projectTimeline: "Standard completion timeframe. Rush projects falling below this incur surcharges.",
        inspectionWindow: "Client's time to identify issues after completion. Limits your liability exposure.",
        designerResponseTime: "Your maximum response time to client inquiries. Sets professional expectations.",
        communicationPlatform: "Designated communication channel. Centralizes project communication and documentation.",
        paymentTerms: "Due on Receipt: Payment required immediately upon invoice (better cash flow). Net 30: Client has 30 days to pay (industry standard but riskier).",
        includeMaterialBreach: "Allows immediate termination for specific problematic client behaviors. Powerful protection clause.",
        includeIndemnification: "Client assumes liability for their actions, mistakes, and permit issues. Essential protection.",
        includeConfidentiality: "Protects your trade secrets, pricing, and processes from being shared with competitors.",
        includeForcemajeure: "Excuses performance delays due to circumstances beyond your control (pandemics, natural disasters).",
        governingState: "State law that governs the contract. Choose your business state for familiar legal framework.",
        disputeResolutionMethod: "How disputes are resolved. Mediation is cheaper but adds steps; courts are direct but costly."
    };

    // Show tooltip function
    const showTooltipFunc = (field, event) => {
        const rect = event.target.getBoundingClientRect();
        setShowTooltip({
            field,
            content: tooltips[field] || '',
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    // Hide tooltip function
    const hideTooltip = () => {
        setShowTooltip({ field: null, content: '' });
    };

    // Smart contextual tips based on user selections
    const getContextualTip = (fieldName, value) => {
        const tips = {
            includeMaterialBreach: value ? "💡 <strong>Material Breach Protection Enabled</strong><br>This allows you to terminate clients who reject 80%+ of designs, impose impossible budgets, or bypass you to contact vendors. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>Learn more →</span>" : "",
            
            includeIndemnification: value ? "⚖️ <strong>Indemnification Added</strong><br>Client will be liable for damages from their actions (permit issues, unauthorized changes). Essential protection for design professionals. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>Learn more →</span>" : "",
            
            paymentTerms: value === 'due_on_receipt' ? "💰 <strong>Smart Payment Terms</strong><br>Due-on-receipt terms protect your cash flow better than Net 30. Combined with late fees, this prevents payment delays. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>Payment protection tips →</span>" : "",
            
            revisionRounds: parseInt(value) <= 2 ? "🔄 <strong>Revision Limits Set</strong><br>Limiting to " + value + " rounds prevents scope creep. Additional revisions become billable change orders. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>Scope protection →</span>" : "",
            
            validityPeriod: parseInt(value) <= 90 ? "⏰ <strong>Package Validity Period</strong><br>" + value + " days is standard. After expiration, no support/revisions without new agreement. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>Timeline protection →</span>" : "",
            
            serviceType: value === 'e-design' ? "📐 <strong>E-Design Service Selected</strong><br>E-design has specific liability limitations and client responsibilities for measurements. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>E-design legal tips →</span>" : "",
            
            includeConfidentiality: value ? "🔒 <strong>Confidentiality Protection</strong><br>Prevents clients from sharing your processes/pricing with competitors. Also protects client's personal information. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>IP protection →</span>" : "",
            
            latePaymentGrace: parseInt(value) <= 15 ? "⚡ <strong>Quick Late Payment Enforcement</strong><br>" + value + " days grace period means fast action on overdue accounts. Shorter periods improve collection rates. <span style='color: #2563eb; cursor: pointer;' onclick='openLegalChat()'>Collection strategies →</span>" : ""
        };
        
        return tips[fieldName] || '';
    };

    // Check for saved progress
    useEffect(() => {
        const savedData = localStorage.getItem('interiorDesignFormData');
        const paidStatus = localStorage.getItem('interiorDesignPaid');
        const savedPaypalId = localStorage.getItem('interiorDesignPaypalId');
        
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
        
        if (paidStatus === 'true') {
            setIsPaid(true);
            if (savedPaypalId) {
                setPaypalId(savedPaypalId);
            }
        }
    }, []);

    // Save form data (always save, not just when paid)
    const saveFormData = (data) => {
        localStorage.setItem('interiorDesignFormData', JSON.stringify(data));
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
        
        // Show contextual tip
        const tip = getContextualTip(name, type === 'checkbox' ? checked : value);
        if (tip) {
            setContextualTip(tip);
            setTimeout(() => setContextualTip(''), 8000); // Clear after 8 seconds
        }
        
        // Show smart help suggestion
        const helpSuggestion = getSmartHelp(name, type === 'checkbox' ? checked : value);
        if (helpSuggestion) {
            setSmartHelp(helpSuggestion);
            setTimeout(() => setSmartHelp(''), 12000); // Clear after 12 seconds
        }
        
        // Highlight changed field in preview and scroll to it
        if (previewRef.current) {
            setTimeout(() => {
                const fieldValueToHighlight = type === 'checkbox' ? checked : value;
                highlightAndScrollToField(name, fieldValueToHighlight);
            }, 100);
        }
        
        // Clear highlighting after 3 seconds
        setTimeout(() => setLastChanged(null), 3000);
    };

    // Highlight and scroll to changed field in preview
    const highlightAndScrollToField = (fieldName, fieldValue) => {
        if (!previewRef.current) return;
        
        const previewElement = previewRef.current;
        const previewText = previewElement.querySelector('.document-preview');
        
        if (!previewText) return;
        
        // Handle checkbox fields differently
        if (typeof fieldValue === 'boolean') {
            // For checkboxes, highlight the section they affect
            const checkboxMappings = {
                'includeMaterialBreach': 'Material Breach and Termination',
                'includePhotography': 'Publicity and Photography',
                'includeConfidentiality': 'Confidentiality',
                'includeForcemajeure': 'Force Majeure',
                'includeIndemnification': 'Indemnification',
                'includeInstallation': 'Installation',
                'includeRushOption': 'Rush projects',
                'includeSeverability': 'Severability',
                'includeEntireAgreement': 'Entire Agreement'
            };
            
            const searchTerm = checkboxMappings[fieldName];
            if (searchTerm) {
                highlightTextInPreview(previewText, searchTerm);
            }
        } else if (fieldValue && fieldValue.toString().length > 0) {
            // Special handling for specific field names
            const fieldMappings = {
                'eDesignFee': `$${fieldValue}`,
                'fullServiceHourlyRate': `$${fieldValue} per hour`,
                'projectManagementRate': `${fieldValue} percent`,
                'additionalSelectionsFee': `$${fieldValue} will be charged for each additional`,
                'delayedPurchaseFee': `$${fieldValue} will be charged if Client requests`,
                'itemRemovalFee': `$${fieldValue} per hour will be charged if Designer`,
                'redesignFee': `$${fieldValue} will be charged`,
                'rushSurcharge': `${fieldValue} percent surcharge`,
                'validityPeriod': `${fieldValue} days after final payment`,
                'revisionRounds': `${fieldValue} rounds of revisions`,
                'informationDeadline': `${fieldValue} business days of contract`,
                'responseTime': `${fieldValue} business days of receipt`,
                'depositPercentage': `${fieldValue} percent of total estimated`,
                'latePaymentRate': `${fieldValue}% monthly interest`,
                'latePaymentGrace': `${fieldValue} days overdue`,
                'projectTimeline': `${fieldValue} days`,
                'inspectionWindow': `${fieldValue} day window`,
                'designerResponseTime': `${fieldValue} business days during normal`,
                'paymentTerms': fieldValue === 'due_on_receipt' ? 'due upon receipt of invoice' : 'net thirty (30) days'
            };
            
            // Use field mapping if available, otherwise use the raw value
            const searchValue = fieldMappings[fieldName] || fieldValue.toString();
            
            if (searchValue.length > 1) {
                highlightTextInPreview(previewText, searchValue);
            }
        }
    };

    // Helper function to highlight text in preview
    const highlightTextInPreview = (previewText, searchValue) => {
        const textContent = previewText.textContent;
        let index = textContent.indexOf(searchValue);
        
        // If exact match not found, try partial matches
        if (index === -1 && searchValue.length > 10) {
            // Try first few words
            const words = searchValue.split(' ');
            if (words.length > 2) {
                const partialSearch = words.slice(0, 3).join(' ');
                index = textContent.indexOf(partialSearch);
                if (index !== -1) {
                    searchValue = partialSearch;
                }
            }
        }
        
        // If still not found, try key words
        if (index === -1) {
            const keyWords = searchValue.split(' ').filter(word => 
                word.length > 3 && !['will', 'the', 'and', 'for', 'per', 'are'].includes(word.toLowerCase())
            );
            
            for (const word of keyWords) {
                index = textContent.indexOf(word);
                if (index !== -1) {
                    searchValue = word;
                    break;
                }
            }
        }
        
        if (index !== -1) {
            const originalHTML = previewText.innerHTML;
            
            // Create regex for case-insensitive replacement
            const regex = new RegExp(escapeRegExp(searchValue), 'gi');
            const highlightedHTML = originalHTML.replace(
                regex,
                `<span class="highlighted-text">${searchValue}</span>`
            );
            
            previewText.innerHTML = highlightedHTML;
            
            // Scroll to the highlighted element
            const highlightedElement = previewText.querySelector('.highlighted-text');
            if (highlightedElement) {
                // Ensure the parent container scrolls to show the highlighted text
                highlightedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
                
                // Also scroll the preview panel if needed
                const previewPanel = previewRef.current;
                if (previewPanel) {
                    const elementTop = highlightedElement.offsetTop;
                    const panelHeight = previewPanel.clientHeight;
                    const scrollTop = elementTop - (panelHeight / 2);
                    
                    previewPanel.scrollTo({
                        top: Math.max(0, scrollTop),
                        behavior: 'smooth'
                    });
                }
            }
            
            // Restore original HTML after highlighting
            setTimeout(() => {
                if (previewText) {
                    previewText.innerHTML = originalHTML;
                }
            }, 3000);
        }
    };

    // Escape special regex characters
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };



    // Validate PayPal ID format
    const validatePaypalId = (id) => {
        // Must be exactly 17 characters, containing both numbers and uppercase letters
        if (id.length !== 17) return false;
        
        const hasNumbers = /\d/.test(id);
        const hasUppercase = /[A-Z]/.test(id);
        const hasLowercase = /[a-z]/.test(id);
        const hasOnlyValidChars = /^[A-Z0-9]+$/.test(id);
        
        return hasNumbers && hasUppercase && !hasLowercase && hasOnlyValidChars;
    };

    // Handle PayPal ID submission
    const handlePaypalIdSubmit = () => {
        setPaypalError('');
        
        if (!paypalId.trim()) {
            setPaypalError('Please enter your PayPal Transaction ID');
            return;
        }
        
        if (!validatePaypalId(paypalId.trim())) {
            setPaypalError('Invalid PayPal Transaction ID format.');
            return;
        }
        
        // Accept any valid format PayPal ID
        setIsPaid(true);
        setShowPaywall(false);
        localStorage.setItem('interiorDesignPaid', 'true');
        localStorage.setItem('interiorDesignPaypalId', paypalId.trim());
        saveFormData(formData);
    };

    // Legal chat functions
    const openLegalChat = () => {
        setShowLegalChat(true);
        if (chatMessages.length === 0) {
            setChatMessages([{
                role: 'assistant',
                content: '<strong>Legal Assistant Ready</strong><br><br>I can help with questions about your interior design agreement, difficult client situations, and legal protection strategies.<br><br>What would you like to know?'
            }]);
        }
    };

    const closeLegalChat = () => {
        setShowLegalChat(false);
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = { role: 'user', content: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setChatLoading(true);

        try {
            const response = await fetch('https://template-generator-aob3.vercel.app/api/interior-design-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...chatMessages, userMessage],
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                throw new Error('API Error');
            }
        } catch (error) {
            setChatMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Unable to get response right now. For complex legal questions, please <strong><a href="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1" target="_blank" style="color: #2563eb;">schedule a consultation</a></strong>.' 
            }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleChatKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    // Scroll chat to bottom
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Global function for contextual tip links
    useEffect(() => {
        window.openLegalChat = openLegalChat;
        return () => {
            delete window.openLegalChat;
        };
    }, []);

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

    // Complete sophisticated document generation with rearranged sections
    const documentText = `INTERIOR DESIGN SERVICES AGREEMENT

This Interior Design Services Agreement ("Agreement") is entered into on ${formData.agreementDate} by and between ${formData.designerName}, a ${formData.designerEntity} with its principal place of business at ${formData.designerAddress} ("Designer"), and ${formData.clientName || '[CLIENT NAME]'}, ${formData.clientType === 'individual' ? 'an individual residing' : 'a company located'} at ${formData.clientAddress || '[CLIENT ADDRESS]'} ("Client") (collectively, the "Parties").

1. Project Scope and Design Services

A. Service Areas and Scope

a) Designer agrees to provide interior design services for the following specific areas of Client's property located at ${formData.projectAddress || '[PROJECT ADDRESS]'}:

${formData.projectRooms || '[LIST SPECIFIC ROOMS/AREAS]'}

b) Services encompass creating 2D renderings, curating furniture and decor selections, and providing purchasing information including shoppable links or vendor locations for each designed space. Designer will present up to three (3) alternative selections per item category in each room design.

c) Designer will exercise best efforts to accommodate Client's aesthetic preferences and budget parameters while maintaining the agreed project scope and timeline, contingent upon Client's fulfillment of all obligations specified herein, including provision of accurate measurements, timely feedback, and maintenance of commercially reasonable budget expectations.

B. Design Process Workflow

The design workflow consists of the following sequential stages:

a) Initial Consultation - Complimentary consultation to evaluate project scope, Client's design objectives, and budget parameters.

b) Research and Sourcing - Comprehensive search to identify items meeting Client's requirements with complete purchasing information and vendor locations. Designer will present curated selections to Client for approval.

c) Procurement Coordination - Designer will offer available trade discounts at participating vendors and suppliers. Upon Client's approval of items and receipt of full payment, Designer will coordinate ordering and procurement through established vendor relationships. Client must remit payment to Designer for all approved items prior to order placement. Orders will be processed exclusively after Client's payment has cleared Designer's business account.

d) Implementation Phase - ${formData.includeInstallation ? 'Designer will coordinate installation services and provide oversight.' : 'All materials to be arranged by homeowner or through white glove delivery service, as coordinated by Client at Client\'s expense.'}

e) Project Completion - Upon completion of installation and final walkthrough, the project will be considered finished and accepted.

2. Fee Structure and Payment Terms

2. Fee Structure and Payment Terms

A. Service Categories and Pricing

${formData.serviceType === 'e-design' ? `E-Design Service Package

a) The e-design service fee is $${formData.eDesignFee} per room/space. This fee encompasses furniture and decor selection exclusively and does not include full-service design coordination, installation oversight, or project management services.

b) E-design packages remain valid for ${formData.validityPeriod} days following final payment receipt unless otherwise specified in writing. Upon expiration, no revisions, support, or additional services will be provided without execution of a new service agreement.

c) E-design packages are developed specifically for the property address designated in this Agreement and may not be transferred to, utilized for, or adapted to any other property or location without prior written specification and Designer approval.

d) E-design services encompass initial design boards for each contracted room, up to three (3) alternative selections per item category in each room, and up to ${formData.revisionRounds} revision cycles per item based on Client's feedback.` : `Full-Service Interior Design Package

a) Full-service design encompasses the e-design package plus additional comprehensive services as detailed below.

b) Hands-on services including furniture installation, in-person shopping assistance, and styling will be invoiced at $${formData.fullServiceHourlyRate} per hour.

c) Project management services, when specifically contracted, will be provided on a cost-plus basis at ${formData.projectManagementRate} percent above all subcontractor, vendor, and supplier costs for coordination and oversight of contractors, vendors, installations, wallpaper installation, and other trade services.`}

B. Additional Service Fees

a) Each additional set of three (3) selections per item beyond the initial presentation will incur a $${formData.additionalSelectionsFee} charge.

b) Client requests for new item selections due to purchase delays beyond three (3) business days after approval will result in a $${formData.delayedPurchaseFee} re-sourcing fee.

c) Designer time required to remove unwanted personal items from the design area on installation day will be charged at $${formData.itemRemovalFee} per hour.

d) Complete redesign requirements after final approval will incur a flat fee of $${formData.redesignFee}.

${formData.includeRushOption ? `e) Projects requiring completion in less than ${formData.projectTimeline} days will incur a ${formData.rushSurcharge} percent surcharge on all applicable fees.` : ''}

C. Payment Terms and Billing

a) ${formData.paymentTerms === 'due_on_receipt' ? 'All design fees are due upon receipt of invoice, not net thirty (30) days. Payment must be received prior to commencement of design work.' : 'Payment terms are net thirty (30) days from invoice date.'}

b) For full-service projects, ${formData.depositPercentage} percent of total estimated fees is due upon contract execution, with the remaining ${100 - parseInt(formData.depositPercentage)} percent due prior to furniture ordering commencement.

c) For furniture and product purchases, Client must remit full payment to Designer prior to any order placement. Designer will process orders exclusively after Client's payment has cleared Designer's business account.

d) Client has three (3) business days following approval to commit to purchasing approved items by remitting payment to Designer. If items become unavailable due to Client's payment delay beyond this timeframe, Designer may charge additional sourcing fees to locate replacement items.

e) Payments shall be made to ${formData.designerName} via check, wire transfer, or Zelle${formData.designerEmail ? ` (${formData.designerEmail})` : ''}. All design fees and project services are non-refundable.

D. Budget Estimates and Cost Management

a) Designer will provide Client with budget estimates for each space based on the agreed scope of work and Client's design preferences, provided Client has supplied realistic budget parameters.

b) If actual costs of furniture, products, or services exceed budget estimates due to Client's requests or changes, Designer will notify Client and obtain approval before proceeding with purchases.

c) Client acknowledges that Designer may offer vendor discounts when available, but such discounts are provided as a courtesy and Designer is under no obligation to match pricing available from other sources or to conduct price comparisons on Client's behalf.

E. Late Payment and Collections

a) Late payments will incur ${formData.latePaymentRate}% monthly interest charges if past due by ${formData.latePaymentGrace} days.

b) If payment exceeds ${formData.latePaymentGrace} days overdue, Designer reserves the right to suspend services until payment is received in full.

c) Client shall be responsible for all collection costs, including reasonable attorneys' fees.

d) If Client disputes any portion of an invoice, Client shall notify Designer in writing within ten (10) days of receipt, specifying the reason for the dispute. Client shall pay all undisputed portions of the invoice according to the payment terms herein.

F. Project Expenses and Taxes

a) Client shall reimburse Designer for all reasonable out-of-pocket expenses incurred in connection with the project, including but not limited to travel, shipping, and materials costs. All costs associated with procurement, delivery, inspection, white glove delivery, and project coordination are Client's responsibility and separate from design fees.

b) Client is responsible for paying all applicable sales taxes on furniture, products, and services.

3. Client Obligations and Information Requirements

3. Client Obligations and Information Requirements

A. E-Design Client Requirements

a) E-Design clients must provide the following within ${formData.informationDeadline} business days of contract execution: 
   i. Complete and accurate room measurements following Designer's measurement guidelines, including room dimensions, ceiling heights, window and door measurements and locations, electrical outlet and switch locations, HVAC vent locations, and any architectural features 
   ii. High-quality, well-lit photographs of each space from multiple angles showing current conditions 
   iii. Architectural drawings or floor plans if available 
   iv. Realistic budget parameters for each room consistent with Client's stated preferences and requirements 
   v. Maximum of two (2) professional inspiration images per room showing desired design aesthetic

B. Full-Service Client Requirements

a) For full-service clients, Designer will obtain necessary measurements and photographs as part of the service package.

b) Full-service clients must provide: 
   i. Access to the property for measurement and photography purposes 
   ii. Realistic budget parameters for each room consistent with Client's stated preferences and requirements 
   iii. Maximum of two (2) professional inspiration images per room showing desired design aesthetic

C. Universal Client Obligations

a) All clients shall provide timely input and feedback throughout the design process to ensure projects meet their expectations. All feedback must be specific, constructive, and provided through ${formData.communicationPlatform}.

b) Client shall respond to Designer's requests for approvals, feedback, or additional information within ${formData.responseTime} business days of receipt.

c) Client acknowledges that Designer's ability to perform services under this Agreement depends upon Client's timely provision of accurate information and cooperation throughout the design process.

${formData.includeMaterialBreach ? `4. Material Breach and Termination Rights

A. E-Design Client Material Breaches

The following actions by E-Design clients constitute material breaches of this Agreement that may result in immediate termination: 
   i. Failure to provide required measurements, photographs, or other essential information after two (2) written requests 
   ii. Imposing budget constraints that make commercially reasonable completion of the project impossible given Client's stated requirements 
   iii. Exhibiting a pattern of declining design selections without constructive feedback, specifically rejecting more than eighty percent (80%) of presented options without reasonable cause 
   iv. Repeatedly changing previously approved selections without justifiable cause 
   v. Failure to make timely payments as specified in this Agreement 
   vi. Attempting to bypass Designer to contact vendors, contractors, or suppliers directly regarding project-related matters

B. Full-Service Client Material Breaches

The following actions by Full-Service clients constitute material breaches of this Agreement that may result in immediate termination: 
   i. Failure to provide reasonable access to the property for measurement and photography purposes after two (2) written requests 
   ii. Imposing budget constraints that make commercially reasonable completion of the project impossible given Client's stated requirements 
   iii. Exhibiting a pattern of declining design selections without constructive feedback, specifically rejecting more than eighty percent (80%) of presented options without reasonable cause 
   iv. Repeatedly changing previously approved selections without justifiable cause 
   v. Failure to make timely payments as specified in this Agreement 
   vi. Attempting to bypass Designer to contact vendors, contractors, or suppliers directly regarding project-related matters

C. Breach Consequences

Upon material breach by Client, Designer may, at Designer's sole discretion, terminate this Agreement immediately upon written notice. In such event, Designer shall retain all fees paid for services performed and Client shall remain responsible for any costs incurred on Client's behalf.

` : ''}${formData.includeMaterialBreach ? '5' : '4'}. Design Development and Approval Process

${formData.includeMaterialBreach ? '5' : '4'}. Design Development and Approval Process

a) Designer will present Client with design plans, renderings, and product selections for each space. Client shall review and approve all designs within ${formData.responseTime} business days of receipt.

b) Client may request up to ${formData.revisionRounds} rounds of revisions per item per space at no additional cost. Further revisions will be billed at Designer's current hourly rate. If a complete redesign is required after final approval, a flat fee of $${formData.redesignFee} will be charged.

c) Once Client approves the final design, any changes or deviations will be treated as a Change Order and subject to additional fees at Designer's current hourly rate.

${formData.includeMaterialBreach ? '6' : '5'}. Procurement, Installation and Project Management

A. Ordering and Procurement

a) Upon Client's approval of design plans and product selections and receipt of full payment from Client, Designer will coordinate ordering and procurement of all items through Designer's vendor accounts. All orders will be processed exclusively after Client's payment has cleared Designer's business account.

b) Designer will coordinate the delivery and inspection of items as part of the procurement service. In some cases, a third party may be hired to receive, inspect, and deliver the items, or the Client may choose to handle final delivery directly, as agreed upon by the Parties. All associated costs are Client's responsibility.

B. Installation Services

a) ${formData.includeInstallation ? 'Designer will coordinate the installation of all furniture and products in accordance with the approved design plans, subject to additional hourly billing.' : 'Installation services are not included in the base package. If Designer is contracted to oversee installation, Designer will coordinate the installation of all furniture and products in accordance with the approved design plans.'}

b) Client is responsible for ensuring that the installation area is clean, cleared of personal belongings, and readily accessible on the scheduled installation date.

c) If Client requires storage of items prior to installation, additional fees may apply.

C. Third-Party Contractors and Subcontractors

a) Designer may engage third-party contractors or subcontractors as needed to complete the project. Client will be notified in advance and shall approve all such engagements.

b) If specifically hired to do so, Designer shall coordinate and supervise the work of contractors and subcontractors but is not responsible for their performance, errors, or omissions. The extent of Designer's supervision may vary from contract to contract.

${formData.includeMaterialBreach ? '7' : '6'}. Project Completion and Delivery

A. Project Closure and Inspection

Upon completion of the project, Client shall have a ${formData.inspectionWindow} day window to inspect the work and notify Designer of any deficiencies or issues that need to be addressed. After this period, the project will be considered complete and accepted by Client, and no further changes or revisions will be made under this Agreement.

B. Delivery Estimates and Delays

Designer will provide estimated delivery dates for all furniture and products based on information provided by vendors. However, Designer is not responsible for delays in delivery caused by factors outside its control, such as manufacturer issues, shipping delays, or customs holdups.

C. Refunds, Exchanges, and Cancellations

a) All furniture and product sales are final. Refunds and exchanges are at the discretion of the vendor and subject to their individual policies.

b) Custom or made-to-order items are non-refundable and cannot be exchanged.

c) If Client cancels the project after placing orders, Client shall be responsible for all restocking fees, return shipping costs, and any other charges imposed by the vendor.

${formData.includeMaterialBreach ? '8' : '7'}. Site Access and Regulatory Compliance

A. Property Access and Preparation

Client shall provide Designer and its subcontractors with reasonable access to the project site during normal business hours for the purposes of design, delivery, and installation. Client is responsible for ensuring that the site is safe, secure, and free of hazards.

B. Permits and Legal Compliance

Client is responsible for obtaining any necessary permits, licenses, or approvals required for the project. Designer will comply with all applicable laws, codes, and regulations in the performance of its services.

C. Maintenance and Ongoing Care

Designer's services do not include ongoing maintenance or repairs after installation. Client is responsible for maintaining all furniture and products in accordance with the manufacturer's guidelines.

${formData.includeMaterialBreach ? '9' : '8'}. Creative Control and Communication Standards

${formData.includeMaterialBreach ? '9' : '8'}. Creative Control and Communication Standards

A. Designer's Creative Authority

a) Designer shall have creative discretion in the selection of furniture, products, and design elements, consistent with Client's stated preferences and budget, provided that Client has provided clear guidance and maintains commercially reasonable expectations.

b) Client shall provide timely input and feedback throughout the design process to ensure that the project meets their expectations.

B. Communication Protocols

a) Designer and Client shall communicate regularly to review progress, address concerns, and make decisions regarding the project. Communications may be conducted in person, by phone, via video conference, or through ${formData.communicationPlatform}.

b) Designer will respond to Client's inquiries and communications within ${formData.designerResponseTime} business days during normal business hours.

c) All design-related feedback and approvals must be communicated through ${formData.communicationPlatform} to maintain proper documentation and project flow.

${formData.includeMaterialBreach ? '10' : '9'}. Intellectual Property and Confidentiality

A. Intellectual Property Rights

a) Designer retains all rights, title, and interest in and to its pre-existing intellectual property, including but not limited to design templates, processes, and proprietary tools.

b) Upon full payment of all fees due under this Agreement, Client shall own the final design plans and renderings created specifically for the project and the property specified herein. Such designs may not be transferred to or used for any other property without Designer's express written consent.

${formData.includeConfidentiality ? `B. Confidentiality Provisions

a) Designer shall maintain the confidentiality of all non-public information provided by Client, including but not limited to personal data, financial information, and project details.

b) Client shall not disclose Designer's proprietary processes, methodologies, or pricing to any third party without Designer's express written consent.` : ''}

${formData.includePhotography ? `${formData.includeMaterialBreach ? '11' : '10'}. Publicity and Photography Rights

a) Designer may photograph the completed project for its portfolio, website, and promotional materials. Designer will not disclose Client's personal information without prior consent.

b) If Client wishes to publicize or feature the project in any media, Client shall properly attribute and credit Designer's contributions.` : ''}

${(formData.includePhotography && formData.includeMaterialBreach) ? '12' : (formData.includePhotography ? '11' : (formData.includeMaterialBreach ? '11' : '10'))}. Risk Allocation and Insurance

${(formData.includePhotography && formData.includeMaterialBreach) ? '12' : (formData.includePhotography ? '11' : (formData.includeMaterialBreach ? '11' : '10'))}. Risk Allocation and Insurance

A. Property Damage and Insurance

a) Designer shall exercise reasonable care in the delivery and installation of all items but is not responsible for damage caused by pre-existing conditions or the negligence of third parties.

b) Client shall maintain adequate property insurance coverage for all furniture and products. Designer is not liable for any loss or damage to items after installation.

B. Limitation of Liability

a) Designer shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of or related to this Agreement, including but not limited to loss of profits, loss of business opportunity, or damage to Client's property.

b) Designer's total liability under this Agreement shall not exceed the total amount of design fees paid by Client, regardless of the legal theory asserted.

c) The limitations set forth in this section shall apply regardless of whether the liability arises in contract, tort, strict liability, or any other legal theory.

${formData.includeIndemnification ? `C. Client Indemnification

Client shall indemnify, defend, and hold harmless Designer, its employees, agents, and affiliates from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to Client's breach of this Agreement, misuse of the design plans, unauthorized modifications to the design, or Client's failure to comply with applicable laws or obtain necessary permits.` : ''}

${(formData.includePhotography && formData.includeMaterialBreach) ? '13' : (formData.includePhotography ? '12' : (formData.includeMaterialBreach ? '12' : '11'))}. Contract Administration

A. Agreement Termination and Postponement

a) Either party may terminate this Agreement upon written notice if the other party materially breaches any term or condition and fails to cure such breach within ten (10) days of receipt of notice.

b) If Client postpones the project for more than ${formData.projectTimeline} days, Designer may, at its discretion, terminate the Agreement and retain any deposits or payments made to date.

c) In the event of termination, Designer shall be compensated for all services performed and expenses incurred up to the date of termination.

B. Dispute Resolution and Governing Law

a) This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingState || formData.designerState}, without giving effect to any choice of law or conflict of law provision or rule.

b) Any controversy or claim arising out of or relating to this Agreement, or the breach thereof, shall be resolved exclusively in the state or federal courts located in ${formData.governingState || formData.designerState}, and the parties hereby consent to the jurisdiction of such courts.

c) The prevailing party in any legal proceeding shall be entitled to recover its reasonable attorneys' fees and costs.

${(formData.includePhotography && formData.includeMaterialBreach) ? '14' : (formData.includePhotography ? '13' : (formData.includeMaterialBreach ? '13' : '12'))}. Miscellaneous Provisions

${(formData.includePhotography && formData.includeMaterialBreach) ? '14' : (formData.includePhotography ? '13' : (formData.includeMaterialBreach ? '13' : '12'))}. Miscellaneous Provisions

A. Professional Standards and Conduct

Designer shall perform all services in a professional and ethical manner, without discrimination or harassment on the basis of race, color, religion, sex, national origin, age, disability, or any other protected characteristic.

${formData.includeForcemajeure ? `B. Force Majeure Events

Neither party shall be liable for any delay or failure to perform its obligations under this Agreement if such delay or failure is due to circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, government orders, or labor strikes.` : ''}

${formData.includeSeverability ? `${formData.includeForcemajeure ? 'C' : 'B'}. Severability

If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect to the fullest extent permitted by law.` : ''}

${formData.includeEntireAgreement ? `${(formData.includeForcemajeure && formData.includeSeverability) ? 'D' : (formData.includeForcemajeure || formData.includeSeverability) ? 'C' : 'B'}. Entire Agreement and Modifications

This Agreement constitutes the entire understanding and agreement between the Parties and supersedes all prior negotiations, representations, or agreements, whether written or oral. This Agreement may only be amended or modified by a written instrument signed by both Parties.` : ''}

IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.

CLIENT:                                    DESIGNER:

${formData.clientName || '[CLIENT NAME]'}                          ${formData.designerName}

                                           By: ${formData.designerSignatory || '[AUTHORIZED SIGNATORY]'}

_________________________________         _________________________________
Signature                                  Signature

Date: ____________________________        Date: ____________________________`;

    // Copy to clipboard function (blocked if not paid)
    const copyToClipboard = async () => {
        if (!isPaid) {
            showPreviewPaywall();
            return;
        }
        
        try {
            await navigator.clipboard.writeText(documentText);
            alert('Interior Design Agreement copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    };

    // Download as Word document (blocked if not paid)
    const downloadAsWord = () => {
        if (!isPaid) {
            showPreviewPaywall();
            return;
        }
        
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

    // Tab navigation overflow detection
    useEffect(() => {
        const checkTabOverflow = () => {
            const tabNav = document.querySelector('.tab-navigation');
            if (tabNav) {
                const hasOverflow = tabNav.scrollWidth > tabNav.clientWidth;
                if (hasOverflow) {
                    tabNav.classList.add('has-overflow');
                } else {
                    tabNav.classList.remove('has-overflow');
                }
            }
        };

        checkTabOverflow();
        window.addEventListener('resize', checkTabOverflow);
        
        return () => window.removeEventListener('resize', checkTabOverflow);
    }, []);

    // PayPal effect - only initialize when paywall is shown
    useEffect(() => {
        const initPayPal = () => {
            if (typeof paypal !== 'undefined' && document.getElementById('paypal-button-container')) {
                paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: { value: '14.95' }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            setIsPaid(true);
                            setShowPaywall(false);
                            localStorage.setItem('interiorDesignPaid', 'true');
                            localStorage.setItem('interiorDesignPaypalId', details.id || 'PAYPAL_PAYMENT');
                        });
                    }
                }).render('#paypal-button-container');
            }
        };
        
        if (showPaywall && !isPaid) {
            // Add small delay to ensure DOM is ready
            setTimeout(initPayPal, 100);
        }
    }, [showPaywall, isPaid]);

    // Show preview paywall
    const showPreviewPaywall = () => {
        setShowPaywall(true);
    };

    // All render functions should be defined here, BEFORE the main return statement
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
                <select 
                    name="serviceType" 
                    value={formData.serviceType} 
                    onChange={handleChange}
                    onMouseEnter={(e) => showTooltipFunc('serviceType', e)}
                    onMouseLeave={hideTooltip}
                >
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
                    <label>E-Design Fee (per room) 💡</label>
                    <input
                        type="number"
                        name="eDesignFee"
                        value={formData.eDesignFee}
                        onChange={handleChange}
                        onMouseEnter={(e) => showTooltipFunc('eDesignFee', e)}
                        onMouseLeave={hideTooltip}
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
                    <label>Payment Terms 💰</label>
                    <select 
                        name="paymentTerms" 
                        value={formData.paymentTerms} 
                        onChange={handleChange}
                        onMouseEnter={(e) => showTooltipFunc('paymentTerms', e)}
                        onMouseLeave={hideTooltip}
                    >
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
                    <label>Package Validity Period (days) ⏰</label>
                    <input
                        type="number"
                        name="validityPeriod"
                        value={formData.validityPeriod}
                        onChange={handleChange}
                        onMouseEnter={(e) => showTooltipFunc('validityPeriod', e)}
                        onMouseLeave={hideTooltip}
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
            <div className="checkbox-group tooltip-container">
                <input
                    type="checkbox"
                    name="includeMaterialBreach"
                    checked={formData.includeMaterialBreach}
                    onChange={handleChange}
                />
                <label 
                    onMouseEnter={(e) => showTooltipFunc('includeMaterialBreach', e)}
                    onMouseLeave={hideTooltip}
                >
                    Include Material Breach & Termination Clauses ⚖️
                </label>
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

            <div className="checkbox-group tooltip-container">
                <input
                    type="checkbox"
                    name="includeIndemnification"
                    checked={formData.includeIndemnification}
                    onChange={handleChange}
                />
                <label 
                    onMouseEnter={(e) => showTooltipFunc('includeIndemnification', e)}
                    onMouseLeave={hideTooltip}
                >
                    Include Client Indemnification Clause 🛡️
                </label>
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

        // Calculate section count
        let sectionCount = 30;
        if (formData.includeMaterialBreach) sectionCount += 1;
        if (formData.includePhotography) sectionCount += 1;
        if (formData.includeConfidentiality) sectionCount += 1;
        if (formData.includeForcemajeure) sectionCount += 1;

        return (
            <div className="form-section">
                <h3>Professional Tips & Risk Analysis</h3>
                <div className="results-section">
                    <h4>Key Legal Protections</h4>
                    {formData.includeMaterialBreach && (
                        <div className="risk-card low">
                            <h4>✓ Material Breach Clauses</h4>
                            <p>Protects you from difficult clients by allowing immediate termination for specific problematic behaviors like rejecting 80% of designs without cause.</p>
                        </div>
                    )}
                    <div className="risk-card low">
                        <h4>✓ Payment Protection</h4>
                        <p>Your agreement requires payment before work begins and includes late payment penalties to protect your cash flow.</p>
                    </div>
                    <div className="risk-card low">
                        <h4>✓ Scope Management</h4>
                        <p>Clear revision limits ({formData.revisionRounds} rounds) prevent scope creep and additional revision fees apply beyond that.</p>
                    </div>
                </div>

                <div className="results-section">
                    <h4>Risk Assessment</h4>
                    {risks.length === 0 ? (
                        <div className="risk-card low">
                            <h4>Excellent Legal Protection</h4>
                            <p>Your agreement includes comprehensive protection clauses and follows best practices for interior design businesses.</p>
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
                    <h4>Professional Best Practices Included</h4>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem'}}>
                        <strong>Timeline Protection:</strong> {formData.informationDeadline}-day deadline for client information prevents delays caused by unresponsive clients.
                    </p>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem'}}>
                        <strong>Fee Structure:</strong> {formData.serviceType === 'e-design' ? '$' + formData.eDesignFee + ' per room for E-Design' : '$' + formData.fullServiceHourlyRate + '/hour for Full-Service'} with clear additional fees prevents disputes.
                    </p>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem'}}>
                        <strong>Communication:</strong> All feedback must go through {formData.communicationPlatform} to maintain documentation and project flow.
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
            {/* Contextual Tip */}
            {contextualTip && (
                <div className="contextual-tip">
                    <div dangerouslySetInnerHTML={{ __html: contextualTip }} />
                    <button onClick={() => setContextualTip('')} className="tip-close">×</button>
                </div>
            )}

            {/* Smart Help Suggestion */}
            {smartHelp && (
                <div className="smart-help">
                    <div className="smart-help-content">
                        <div dangerouslySetInnerHTML={{ __html: smartHelp }} />
                        <button onClick={() => setSmartHelp('')} className="help-close">×</button>
                    </div>
                </div>
            )}

            {/* Tooltip */}
            {showTooltip.field && (
                <div 
                    className="tooltip"
                    style={{
                        position: 'fixed',
                        left: showTooltip.x,
                        top: showTooltip.y,
                        transform: 'translateX(-50%) translateY(-100%)',
                        zIndex: 1000
                    }}
                >
                    <div className="tooltip-content">
                        {showTooltip.content}
                    </div>
                    <div className="tooltip-arrow"></div>
                </div>
            )}

            {/* Floating Legal Help Button */}
            <button 
                className="floating-help-btn"
                onClick={openLegalChat}
                title="Get Legal Help"
            >
                ⚖️
            </button>

            {/* Legal Chat Popup Overlay */}
            {showLegalChat && (
                <div className="chat-overlay">
                    <div className="chat-popup">
                        <div className="chat-popup-header">
                            <div>
                                <h3>Legal Assistant</h3>
                                <p>Interior Design Contract Expert</p>
                            </div>
                            <button onClick={closeLegalChat} className="chat-close">×</button>
                        </div>
                        
                        <div className="chat-popup-messages" ref={chatMessagesRef}>
                            {chatMessages.map((message, index) => (
                                <div key={index} className={`chat-message ${message.role}`}>
                                    {message.role === 'assistant' ? (
                                        <div dangerouslySetInnerHTML={{ __html: message.content }} />
                                    ) : (
                                        message.content
                                    )}
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="chat-message assistant">
                                    <div className="chat-loading">⚖️ Analyzing your question...</div>
                                </div>
                            )}
                        </div>
                        
                        <div className="chat-popup-input">
                            <textarea
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={handleChatKeyPress}
                                placeholder="Ask about contracts, client issues, legal protection..."
                                rows="2"
                            />
                            <button 
                                onClick={sendChatMessage} 
                                disabled={!chatInput.trim() || chatLoading}
                                className="chat-send-btn"
                            >
                                Send
                            </button>
                        </div>
                        
                        <div className="chat-popup-footer">
                            <button 
                                onClick={() => window.Calendly?.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'})}
                                className="consult-link"
                            >
                                Schedule Consultation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Small Paywall Popup (only when triggered) */}
            {showPaywall && !isPaid && (
                <div className="paywall-overlay">
                    <div className="paywall-popup">
                        <button onClick={() => setShowPaywall(false)} className="paywall-close">×</button>
                        <h3>Unlock Document Export</h3>
                        <p>Copy and download your completed Interior Design Services Agreement.</p>
                        <div className="paywall-price">$14.95</div>
                        
                        <div id="paypal-button-container"></div>
                        
                        <div className="paywall-divider">Already Paid?</div>
                        
                        <div className="paywall-unlock">
                            <input
                                type="text"
                                value={paypalId}
                                onChange={(e) => setPaypalId(e.target.value.toUpperCase())}
                                placeholder="Enter PayPal Transaction ID"
                                className="paypal-id-input"
                            />
                            {paypalError && <div className="paypal-error">{paypalError}</div>}
                            <button onClick={handlePaypalIdSubmit} className="unlock-btn">
                                Unlock Now
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => window.Calendly?.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'})}
                            className="consult-small-btn"
                        >
                            Need Legal Advice?
                        </button>

                    </div>
                </div>
            )}

            <div className="main-content">
                <div className="form-panel">
                    <div className="header">
                        <h1>Interior Design Services Agreement Generator</h1>
                        <p>Battle-tested agreement protecting against the 9 most devastating client behaviors: measurement failures, budget bait-and-switch, serial design rejection, scope creep, payment delays, and vendor interference</p>
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
                            className={`nav-button ${!isPaid ? 'locked' : ''}`}
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
                            className={`nav-button ${!isPaid ? 'locked' : ''}`}
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
                        <div className="preview-header">
                            <h2>Live Agreement Preview</h2>
                            {!isPaid && (
                                <div className="preview-notice">
                                    🔓 Free to explore • Pay to copy/download
                                </div>
                            )}
                        </div>
                        <div 
                            className="document-preview" 
                            style={{
                                whiteSpace: 'pre-wrap',
                                userSelect: isPaid ? 'text' : 'none',
                                pointerEvents: isPaid ? 'auto' : 'none',
                                filter: isPaid ? 'none' : 'blur(0.3px)'
                            }}
                            onContextMenu={!isPaid ? (e) => e.preventDefault() : undefined}
                            onSelectStart={!isPaid ? (e) => e.preventDefault() : undefined}
                            onDragStart={!isPaid ? (e) => e.preventDefault() : undefined}
                        >
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
