const { useState, useEffect, useMemo, useRef, useCallback } = React;

const NDA_TITLE = "NONDISCLOSURE AGREEMENT";

const BASE_CONFIDENTIAL_INFO = [
    'Personal identity information such as legal names, preferred names, addresses, phone numbers, and contact handles',
    'Private relationship details, preferences, negotiated boundaries, and agreed-upon protocols',
    'Verbal, written, and digital communications exchanged between the parties in any medium',
    'Photographs, audio, video, or other recordings created or shared in connection with the relationship',
    'Health history, wellness disclosures, and any medical or therapeutic information shared in confidence',
    'Professional status, employment details, licensing concerns, or reputation-sensitive information discussed in confidence',
    'Locations of private gatherings, shared venues, meeting logistics, and travel plans coordinated between the parties',
    'Financial or logistical information relating to relationship activities, shared expenses, or discretion-related costs'
];

const PRIVACY_PROFILE_DETAILS = {
    1: {
        key: 'basic',
        introduction: 'This Nondisclosure Agreement establishes mutual understanding regarding the protection of personal and private information shared between the parties in the context of their personal relationship.',
        additions: [
            'Summaries of agreements, schedules, calendars, or planning documents derived from the above categories'
        ],
        reinforcement: null
    },
    2: {
        key: 'enhanced',
        introduction: 'This Nondisclosure Agreement establishes strict confidentiality protocols for the protection of sensitive personal information, private activities, and reputational interests of all parties involved in personal arrangements.',
        additions: [
            'Detailed records, logs, or documentation that expand upon the categories listed above, including written journals or digital planning tools',
            'Professional licensing, disciplinary, or reputational information that could affect a party’s livelihood or public standing',
            'Health testing records, laboratory results, or treatment plans connected to the activities contemplated by the parties',
            'Curated digital archives such as cloud folders, collaborative documents, or encrypted message exports containing Confidential Information'
        ],
        reinforcement: 'Selecting Enhanced Privacy expands upon, and does not limit, the categories covered at Basic Discretion. All summaries, detailed records, and derivative materials remain protected to the fullest extent.'
    },
    3: {
        key: 'professional',
        introduction: 'This Nondisclosure Agreement provides maximum privacy protection for individuals whose professional standing, public reputation, or career advancement could be materially affected by disclosure of private personal information.',
        additions: [
            'Any due diligence materials, legal analyses, or crisis-management plans prepared to preserve professional standing or public reputation',
            'Security practices, authentication tools, or technology stacks used to safeguard Confidential Information, including password vaults or secure communication platforms',
            'Travel itineraries, concierge arrangements, or lifestyle services retained to facilitate discreet engagement between the parties',
            'Communications with counselors, coaches, or advisors who support the parties in managing alternative lifestyle commitments'
        ],
        reinforcement: 'High-Profile Protection layers additional safeguards over every category identified at the Basic and Enhanced tiers. All general, detailed, and strategic materials remain fully confidential unless expressly permitted in writing.'
    }
};

const RISK_ASSESSMENTS = {
    basicInfo: {
        level: 'low',
        title: 'Basic Personal Information',
        description: 'Standard name and contact protection - legally sound and commonly enforced.'
    },
    healthInfo: {
        level: 'medium',
        title: 'Health Information Privacy',
        description: 'Medical privacy has strong legal backing, but ensure compliance with HIPAA considerations.'
    },
    professionalRep: {
        level: 'low',
        title: 'Professional Reputation',
        description: 'Career protection clauses are well-established in employment and privacy law.'
    },
    visualMedia: {
        level: 'medium',
        title: 'Photos and Recordings',
        description: 'Image rights are enforceable, especially with revenge porn laws. Ensure all recordings are consensual.'
    },
    alternativeLifestyle: {
        level: 'low',
        title: 'Alternative Lifestyle Activities',
        description: 'Consensual adult activities are legally protected speech, making NDAs highly enforceable.'
    },
    financialInfo: {
        level: 'high',
        title: 'Financial Information',
        description: 'Financial privacy has strong protections, but avoid language that could imply commercial arrangements.'
    },
    therapeuticDisclosure: {
        level: 'low',
        title: 'Therapeutic Communications',
        description: 'Mental health communications have legal privilege protections beyond NDAs.'
    },
    venueInformation: {
        level: 'medium',
        title: 'Private Venue Details',
        description: 'Location privacy is enforceable but ensure venues operate legally to avoid complications.'
    }
};

const PRIVACY_TOGGLE_LABELS = {
    healthPrivacy: 'Health Information Privacy',
    professionalProtection: 'Professional Reputation Protection',
    mediaProtection: 'Photos and Media Protection',
    venuePrivacy: 'Private Venue Information',
    communityPrivacy: 'Community Participation Details',
    therapeuticException: 'Therapeutic Communication Exception',
    financialPrivacy: 'Financial Information'
};

const TOGGLE_TO_RISK_KEY = {
    healthPrivacy: 'healthInfo',
    professionalProtection: 'professionalRep',
    mediaProtection: 'visualMedia',
    venuePrivacy: 'venueInformation',
    communityPrivacy: 'alternativeLifestyle',
    therapeuticException: 'therapeuticDisclosure',
    financialPrivacy: 'financialInfo'
};

const PRIVACY_LEVEL_RECOMMENDATIONS = {
    1: {
        on: [],
        off: ['healthPrivacy', 'professionalProtection', 'mediaProtection', 'venuePrivacy', 'communityPrivacy', 'therapeuticException', 'financialPrivacy']
    },
    2: {
        on: ['healthPrivacy', 'professionalProtection', 'mediaProtection'],
        off: ['venuePrivacy', 'communityPrivacy', 'therapeuticException', 'financialPrivacy']
    },
    3: {
        on: ['healthPrivacy', 'professionalProtection', 'mediaProtection', 'venuePrivacy', 'communityPrivacy', 'therapeuticException', 'financialPrivacy'],
        off: []
    }
};

const PAYWALL_PRICE = '14.95';
const PAYWALL_STORAGE_KEY = 'al-nda-paywall-paid';
const PAYWALL_PRODUCT_LABEL = 'Alternative Lifestyle NDA Generator – Export Unlock';
const PAYPAL_CLIENT_ID = 'ASmwKug6zVE_78S-152YKAzzh2iH8VgSjs-P6RkrWcfqdznNjeE_UYwKJkuJ3BvIJrxCotS8GtXEJ2fx';
const PAYPAL_SDK_URL = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;

const RETENTION_OPTIONS = [
    {
        value: '7_days',
        label: '7-day purge after each gathering',
        summary: 'Delete all shared digital materials within seven (7) days of creation unless both parties agree otherwise in writing.'
    },
    {
        value: '30_days',
        label: '30-day rotation',
        summary: 'Review and remove stored materials at least every thirty (30) days.'
    },
    {
        value: 'quarterly',
        label: 'Quarterly review',
        summary: 'Conduct a comprehensive destruction review at least once every ninety (90) days.'
    },
    {
        value: 'upon_request',
        label: '72-hour response to written request',
        summary: 'Purge protected materials within seventy-two (72) hours of a written request from either party.'
    },
    {
        value: 'custom',
        label: 'Custom timeline',
        summary: ''
    }
];

const RETENTION_SUMMARY = RETENTION_OPTIONS.reduce((acc, option) => {
    if (option.summary) {
        acc[option.value] = option.summary;
    }
    return acc;
}, {});

const TAB_CONFIG = [
    { key: 'basics', label: 'Basic Info', className: 'tab-basics' },
    { key: 'privacy', label: 'Privacy Level', className: 'tab-privacy' },
    { key: 'trusted', label: 'Trusted Support', className: 'tab-trusted' },
    { key: 'advanced', label: 'Advanced Options', className: 'tab-advanced' },
    { key: 'risk', label: 'Risk Assessment', className: 'tab-risk' }
];

const INDUSTRY_GUIDANCE = {
    healthcare: {
        label: 'Healthcare / HIPAA-covered professional',
        warning: 'Confirm HIPAA, state health privacy, and infection-control obligations. Document mandated disclosures made to protect patient safety.',
        recommended: ['healthPrivacy', 'therapeuticException'],
        clauseText: 'Healthcare professionals remain responsible for HIPAA and mandated reporting requirements. Any disclosure must be limited to the minimum necessary information and logged when required by regulation.'
    },
    government: {
        label: 'Government clearance / security-sensitive role',
        warning: 'Security clearance holders may need to report certain relationships or foreign contacts. Coordinate with security officers before execution.',
        recommended: ['professionalProtection', 'mediaProtection'],
        clauseText: 'Individuals holding government clearances or sensitive positions shall comply with agency reporting protocols and ensure this Agreement does not restrict lawful disclosures to security officials.'
    },
    education: {
        label: 'Educator / childcare professional',
        warning: 'Educators and childcare workers are mandated reporters. Review employer conduct policies and reporting triggers.',
        recommended: ['communityPrivacy', 'therapeuticException'],
        clauseText: 'Educators and childcare professionals acknowledge that mandated reporting statutes governing suspected abuse, neglect, or imminent harm supersede confidentiality promises.'
    },
    finance: {
        label: 'Finance / regulated fiduciary',
        warning: 'Financial professionals must observe fiduciary, anti-bribery, and client privacy rules. Flag lifestyle expenses that could trigger compliance reviews.',
        recommended: ['financialPrivacy', 'professionalProtection'],
        clauseText: 'Regulated financial professionals agree to maintain compliance with fiduciary duties and financial disclosure laws while minimising dissemination of Confidential Information.'
    }
};

const INDUSTRY_KEYS = Object.keys(INDUSTRY_GUIDANCE);

const toIndustryStateKey = (key) => `industry${key.charAt(0).toUpperCase()}${key.slice(1)}`;

const createEmptyParticipant = () => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
    name: '',
    role: '',
    requiresNDA: true,
    requiresNotice: true,
    notes: ''
});

const normalizeParticipants = (participants = []) => {
    if (!Array.isArray(participants) || participants.length === 0) {
        return [createEmptyParticipant()];
    }

    return participants.map((participant) => ({
        ...createEmptyParticipant(),
        ...participant,
        id: participant && participant.id ? participant.id : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
        requiresNDA: typeof participant?.requiresNDA === 'boolean' ? participant.requiresNDA : true,
        requiresNotice: typeof participant?.requiresNotice === 'boolean' ? participant.requiresNotice : true
    }));
};

const sanitizeParticipantEntries = (participants = []) => {
    if (!Array.isArray(participants)) {
        return [];
    }

    return participants
        .map((participant) => ({
            id: participant?.id,
            name: (participant?.name || '').trim(),
            role: (participant?.role || '').trim(),
            requiresNDA: typeof participant?.requiresNDA === 'boolean' ? participant.requiresNDA : true,
            requiresNotice: typeof participant?.requiresNotice === 'boolean' ? participant.requiresNotice : true,
            notes: (participant?.notes || '').trim()
        }))
        .filter((participant) => participant.name || participant.role || participant.notes);
};

const createInitialFormData = () => ({
    party1Name: '',
    party2Name: '',
    effectiveDate: '',
    duration: '5',
    jurisdiction: 'California',
    healthPrivacy: false,
    professionalProtection: false,
    mediaProtection: false,
    venuePrivacy: false,
    communityPrivacy: false,
    therapeuticException: false,
    financialPrivacy: false,
    careerSensitive: false,
    publicFigure: false,
    securityClearance: false,
    educationField: false,
    liquidatedDamages: '',
    arbitration: true,
    additionalTerms: '',
    retentionTimeline: '30_days',
    customRetentionTimeline: '',
    storagePractices: '',
    assetInventory: '',
    thirdPartyParticipants: [createEmptyParticipant()],
    industryHealthcare: false,
    industryGovernment: false,
    industryEducation: false,
    industryFinance: false,
    industryNotes: ''
});

const normalizeFormData = (data = {}) => {
    const base = createInitialFormData();
    const merged = { ...base, ...data };
    merged.thirdPartyParticipants = normalizeParticipants(data.thirdPartyParticipants);
    if (!RETENTION_OPTIONS.some((option) => option.value === merged.retentionTimeline)) {
        merged.retentionTimeline = base.retentionTimeline;
    }
    return merged;
};

const FIELD_TO_CLAUSE_MAP = {
    party1Name: 'parties-section',
    party2Name: 'parties-section',
    effectiveDate: 'effective-date-section',
    duration: 'duration-section',
    jurisdiction: 'general-provisions',
    healthPrivacy: 'confidential-info-section',
    professionalProtection: 'confidential-info-section',
    mediaProtection: 'confidential-info-section',
    venuePrivacy: 'confidential-info-section',
    communityPrivacy: 'confidential-info-section',
    therapeuticException: 'permitted-disclosures',
    financialPrivacy: 'confidential-info-section',
    liquidatedDamages: 'liquidated-damages-clause',
    arbitration: 'arbitration-clause',
    additionalTerms: 'additional-terms',
    retentionTimeline: 'return-destruction-clause',
    customRetentionTimeline: 'return-destruction-clause',
    storagePractices: 'return-destruction-clause',
    assetInventory: 'annex-protected-materials',
    industryHealthcare: null,
    industryGovernment: null,
    industryEducation: null,
    industryFinance: null,
    careerSensitive: null,
    publicFigure: null,
    securityClearance: null,
    educationField: null,
    industryNotes: null
};

function AlternativeLifestyleNDAGenerator() {
    const [activeTab, setActiveTab] = useState('basics');
    const [privacyLevel, setPrivacyLevel] = useState(1);
    const [autoSaved, setAutoSaved] = useState(false);

    const [formData, setFormData] = useState(() => createInitialFormData());
    const [isPaid, setIsPaid] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [paypalReady, setPaypalReady] = useState(false);

    const activeTrustedParticipants = useMemo(
        () => sanitizeParticipantEntries(formData.thirdPartyParticipants),
        [formData.thirdPartyParticipants]
    );

    const selectedPrivacyToggles = useMemo(
        () => Object.keys(PRIVACY_TOGGLE_LABELS).filter((key) => formData[key]),
        [
            formData.healthPrivacy,
            formData.professionalProtection,
            formData.mediaProtection,
            formData.venuePrivacy,
            formData.communityPrivacy,
            formData.therapeuticException,
            formData.financialPrivacy
        ]
    );

    const [highlightedClause, setHighlightedClause] = useState(null);
    const [sliderAdjustmentNote, setSliderAdjustmentNote] = useState('');

    const previewContainerRef = useRef(null);
    const clauseRefs = useRef({});
    const clauseRefCallbacks = useRef({});
    const highlightTimeoutRef = useRef(null);
    const sliderNoteTimeoutRef = useRef(null);
    const paypalButtonsInstanceRef = useRef(null);
    const paypalContainerRef = useRef(null);

    const persistPaywallStatus = useCallback((status) => {
        try {
            localStorage.setItem(PAYWALL_STORAGE_KEY, JSON.stringify(status));
        } catch (error) {
            console.warn('Failed to persist paywall status', error);
        }
    }, []);

    const loadStoredPaywallStatus = useCallback(() => {
        try {
            const saved = localStorage.getItem(PAYWALL_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return Boolean(parsed?.paid);
            }
        } catch (error) {
            console.warn('Failed to load paywall status', error);
        }
        return false;
    }, []);

    const markPaid = useCallback((transactionId = null) => {
        const status = {
            paid: true,
            transactionId,
            paidAt: Date.now()
        };
        setIsPaid(true);
        persistPaywallStatus(status);
    }, [persistPaywallStatus]);

    const ensurePaypalScript = useCallback(() => {
        if (window.paypal) {
            setPaypalReady(true);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const existing = document.querySelector('script[data-paypal-sdk="al-nda"]');
            const handleLoad = () => {
                setPaypalReady(true);
                resolve();
            };
            const handleError = () => {
                setPaypalReady(false);
                reject(new Error('PayPal SDK failed to load'));
            };

            if (existing) {
                existing.addEventListener('load', handleLoad, { once: true });
                existing.addEventListener('error', handleError, { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = PAYPAL_SDK_URL;
            script.async = true;
            script.dataset.paypalSdk = 'al-nda';
            script.addEventListener('load', handleLoad, { once: true });
            script.addEventListener('error', handleError, { once: true });
            document.head.appendChild(script);
        });
    }, []);

    const handlePaymentSuccess = useCallback((order) => {
        const transactionId = order?.id || null;
        markPaid(transactionId);
        setShowPaywall(false);
    }, [markPaid]);

    const handlePaywallOpen = useCallback(() => {
        setShowPaywall(true);
    }, []);

    const handlePaywallClose = useCallback(() => {
        setShowPaywall(false);
    }, []);

    const handlePreviewCopy = useCallback((event) => {
        if (!isPaid) {
            event.preventDefault();
            setShowPaywall(true);
        }
    }, [isPaid]);

    const renderPaypalButtons = useCallback(() => {
        if (!window.paypal || !paypalContainerRef.current) {
            return;
        }

        if (paypalButtonsInstanceRef.current && typeof paypalButtonsInstanceRef.current.close === 'function') {
            paypalButtonsInstanceRef.current.close();
        }

        paypalContainerRef.current.innerHTML = '';

        try {
            const buttons = window.paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay'
                },
                createOrder: (data, actions) => actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: PAYWALL_PRICE,
                                currency_code: 'USD'
                            },
                            description: PAYWALL_PRODUCT_LABEL
                        }
                    ],
                    application_context: {
                        shipping_preference: 'NO_SHIPPING'
                    }
                }),
                onApprove: async (data, actions) => {
                    try {
                        const order = await actions.order.capture();
                        handlePaymentSuccess(order);
                    } catch (error) {
                        console.error('Unable to capture PayPal order', error);
                        alert('Payment capture failed. Please try again.');
                    }
                },
                onError: (error) => {
                    console.error('PayPal payment error', error);
                    alert('Payment failed. Please try again or contact support.');
                },
                onCancel: () => {
                    console.info('PayPal payment cancelled by user');
                }
            });

            paypalButtonsInstanceRef.current = buttons;
            buttons.render(paypalContainerRef.current);
        } catch (error) {
            console.error('Failed to initialise PayPal buttons', error);
        }
    }, [handlePaymentSuccess]);

    const getClauseRefCallback = useCallback((id) => {
        if (!clauseRefCallbacks.current[id]) {
            clauseRefCallbacks.current[id] = (node) => {
                if (node) {
                    clauseRefs.current[id] = node;
                } else {
                    delete clauseRefs.current[id];
                }
            };
        }
        return clauseRefCallbacks.current[id];
    }, []);

    useEffect(() => {
        if (loadStoredPaywallStatus()) {
            setIsPaid(true);
        }
    }, [loadStoredPaywallStatus]);

    useEffect(() => {
        const handleStorageEvent = (event) => {
            if (event.key === PAYWALL_STORAGE_KEY) {
                setIsPaid(loadStoredPaywallStatus());
            }
        };

        window.addEventListener('storage', handleStorageEvent);
        return () => window.removeEventListener('storage', handleStorageEvent);
    }, [loadStoredPaywallStatus]);

    useEffect(() => {
        if (!showPaywall) {
            return;
        }

        ensurePaypalScript().catch((error) => {
            console.error('Unable to load PayPal SDK', error);
        });
    }, [showPaywall, ensurePaypalScript]);

    useEffect(() => {
        if (!showPaywall || !paypalReady) {
            return undefined;
        }

        renderPaypalButtons();

        return () => {
            if (paypalButtonsInstanceRef.current && typeof paypalButtonsInstanceRef.current.close === 'function') {
                paypalButtonsInstanceRef.current.close();
            }
            paypalButtonsInstanceRef.current = null;
        };
    }, [showPaywall, paypalReady, renderPaypalButtons]);

    useEffect(() => {
        return () => {
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
            if (sliderNoteTimeoutRef.current) {
                clearTimeout(sliderNoteTimeoutRef.current);
            }
        };
    }, []);

    const applyPrivacyRecommendations = useCallback((level, { emitNote = true } = {}) => {
        const recommendations = PRIVACY_LEVEL_RECOMMENDATIONS[level] || { on: [], off: [] };
        const toggledOn = [];
        const toggledOff = [];

        setFormData((prev) => {
            const next = { ...prev };

            recommendations.on.forEach((field) => {
                if (!next[field]) {
                    next[field] = true;
                    if (PRIVACY_TOGGLE_LABELS[field]) {
                        toggledOn.push(PRIVACY_TOGGLE_LABELS[field]);
                    }
                }
            });

            recommendations.off.forEach((field) => {
                if (next[field]) {
                    next[field] = false;
                    if (PRIVACY_TOGGLE_LABELS[field]) {
                        toggledOff.push(PRIVACY_TOGGLE_LABELS[field]);
                    }
                }
            });

            return next;
        });

        if (emitNote) {
            if (sliderNoteTimeoutRef.current) {
                clearTimeout(sliderNoteTimeoutRef.current);
            }

            if (toggledOn.length || toggledOff.length) {
                const parts = [];
                if (toggledOn.length) {
                    parts.push(`enabled: ${toggledOn.join(', ')}`);
                }
                if (toggledOff.length) {
                    parts.push(`disabled: ${toggledOff.join(', ')}`);
                }
                setSliderAdjustmentNote(`Recommended settings applied — ${parts.join(' / ')}`);
                sliderNoteTimeoutRef.current = setTimeout(() => setSliderAdjustmentNote(''), 5000);
            } else {
                setSliderAdjustmentNote('');
            }
        }

        return { toggledOn, toggledOff };
    }, [setFormData, setSliderAdjustmentNote]);

    const renderTextWithBreaks = useCallback((text) => {
        if (!text) {
            return null;
        }

        return text.split('\n').reduce((nodes, line, index) => {
            if (index > 0) {
                nodes.push(<br key={`br-${index}`} />);
            }
            nodes.push(line);
            return nodes;
        }, []);
    }, []);

    // Auto-save functionality
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('nda-draft', JSON.stringify(formData));
            setAutoSaved(true);
            setTimeout(() => setAutoSaved(false), 2000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData]);

    // Load saved draft
    useEffect(() => {
        const saved = localStorage.getItem('nda-draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(normalizeFormData(parsed));
            } catch (error) {
                console.warn('Failed to load saved NDA draft', error);
            }
        }
    }, []);

    useEffect(() => {
        applyPrivacyRecommendations(privacyLevel, { emitNote: false });
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        const clauseId = FIELD_TO_CLAUSE_MAP[name];
        if (clauseId) {
            setTimeout(() => scrollToClauseWithTempHighlight(clauseId), 300);
        }
    };

    const handlePrivacyLevelChange = (e) => {
        const level = parseInt(e.target.value, 10);
        setPrivacyLevel(level);
        applyPrivacyRecommendations(level);
        setTimeout(() => scrollToClauseWithTempHighlight('confidential-info-section'), 300);
    };

    const handleParticipantChange = (participantId, field, value) => {
        setFormData((prev) => {
            const updated = prev.thirdPartyParticipants.map((participant) =>
                participant.id === participantId ? { ...participant, [field]: value } : participant
            );
            return { ...prev, thirdPartyParticipants: updated };
        });
        setTimeout(() => scrollToClauseWithTempHighlight('third-party-obligations'), 300);
    };

    const addParticipant = () => {
        setFormData((prev) => ({
            ...prev,
            thirdPartyParticipants: [...prev.thirdPartyParticipants, createEmptyParticipant()]
        }));
        setTimeout(() => scrollToClauseWithTempHighlight('third-party-obligations'), 300);
    };

    const removeParticipant = (participantId) => {
        setFormData((prev) => {
            const remaining = prev.thirdPartyParticipants.filter((participant) => participant.id !== participantId);
            return {
                ...prev,
                thirdPartyParticipants: remaining.length ? remaining : [createEmptyParticipant()]
            };
        });
        setTimeout(() => scrollToClauseWithTempHighlight('third-party-obligations'), 300);
    };

    const ndaData = useMemo(() => {
        const profile = PRIVACY_PROFILE_DETAILS[privacyLevel] || PRIVACY_PROFILE_DETAILS[1];
        const party1 = formData.party1Name || '[Party 1 Name]';
        const party2 = formData.party2Name || '[Party 2 Name]';
        const effectiveDate = formData.effectiveDate || '[Date]';
        const jurisdictionText = formData.jurisdiction === 'District of Columbia' ? 'the District of Columbia' : `the State of ${formData.jurisdiction}`;

        const confidentialInfoSet = new Set([...BASE_CONFIDENTIAL_INFO, ...(profile.additions || [])]);
        if (formData.healthPrivacy) {
            confidentialInfoSet.add('Specific health screenings, medical test results, and ongoing health monitoring');
        }
        if (formData.professionalProtection) {
            confidentialInfoSet.add('Professional associations, workplace policies, and career advancement considerations');
        }
        if (formData.mediaProtection) {
            confidentialInfoSet.add('Digital footprints, online presence, and social media activity related to personal lifestyle');
        }
        if (formData.venuePrivacy) {
            confidentialInfoSet.add('Private club memberships, exclusive venue access, and location-specific activities');
        }
        if (formData.communityPrivacy) {
            confidentialInfoSet.add('Community relationships, mentor connections, and social network participation');
        }
        if (formData.financialPrivacy) {
            confidentialInfoSet.add('Lifestyle-related expenses, specialized equipment, and privacy investment costs');
        }

        const confidentialInfo = Array.from(confidentialInfoSet);

        const permittedDisclosures = [
            'Required by law, court order, or valid legal process (provided the disclosing party gives prior notice when legally permissible)',
            'To law enforcement regarding suspected criminal activity',
            'To medical professionals for emergency healthcare situations'
        ];
        if (formData.therapeuticException) {
            permittedDisclosures.push('To licensed mental health professionals bound by professional confidentiality obligations');
        }
        permittedDisclosures.push('Disclosures required of mandated reporters (including healthcare providers, educators, therapists, or other professionals legally obligated to report safety concerns).');
        permittedDisclosures.push(
            'To attorneys for legal counsel (who are bound by attorney-client privilege)',
            'With prior written consent of both parties'
        );

        const selectedIndustryKeys = INDUSTRY_KEYS.filter((key) => formData[toIndustryStateKey(key)]);
        const industryDetails = selectedIndustryKeys.map((key) => ({ key, ...INDUSTRY_GUIDANCE[key] }));

        const sensitivityItems = [];
        if (formData.careerSensitive) {
            sensitivityItems.push('Career-sensitive duties flagged; parties agree to consult counsel before any public disclosures or policy conflicts.');
        }
        if (formData.publicFigure) {
            sensitivityItems.push('Public figure or media exposure risk identified; plan media strategy and tighten access controls.');
        }
        if (formData.securityClearance) {
            sensitivityItems.push('Security clearance obligations apply; coordinate with the appropriate security or compliance officer before signing.');
        }
        if (formData.educationField) {
            sensitivityItems.push('Education or childcare professional responsibilities trigger heightened mandated-reporting duties.');
        }
        const industryNotes = formData.industryNotes.trim();

        const retentionOption = RETENTION_OPTIONS.find((option) => option.value === formData.retentionTimeline) || RETENTION_OPTIONS[0];
        const retentionSummary = formData.retentionTimeline === 'custom'
            ? (formData.customRetentionTimeline.trim() || 'The parties will document a custom retention/destruction plan in writing and update Annex A accordingly.')
            : RETENTION_SUMMARY[retentionOption.value];
        const retentionLabel = retentionOption.label;
        const storagePractices = formData.storagePractices.trim();

        const assetInventoryEntries = formData.assetInventory
            .split('
')
            .map((line) => line.trim())
            .filter(Boolean);

        const activeParticipants = sanitizeParticipantEntries(formData.thirdPartyParticipants);

        const formatParticipant = (participant) => {
            const displayName = participant.name || 'Approved participant';
            const roleSegment = participant.role ? ` (${participant.role})` : '';
            const conditions = [];
            if (participant.requiresNDA) {
                conditions.push('separate NDA required');
            }
            if (participant.requiresNotice) {
                conditions.push('advance notice to the other party');
            }
            if (participant.notes) {
                conditions.push(participant.notes);
            }
            const conditionText = conditions.length ? ` – ${conditions.join('; ')}` : ' – Limited disclosure for logistical coordination only.';
            return `${displayName}${roleSegment}${conditionText}`;
        };

        const clauses = [];
        let clauseCounter = 1;
        const addClause = (id, title, body) => {
            clauses.push({ id, number: clauseCounter, title, body });
            clauseCounter += 1;
        };

        addClause('introduction-section', 'INTRODUCTION AND PURPOSE', [
            { type: 'text', text: `${profile.introduction} This Agreement acknowledges that in the course of personal relationships involving alternative lifestyle activities, sensitive and highly personal information may be shared that requires maximum protection and discretion.` }
        ]);

        addClause('mutual-representations', 'MUTUAL REPRESENTATIONS AND CONSENT', [
            { type: 'text', text: 'Each party confirms that participation in the personal arrangements contemplated by this Agreement is voluntary, based on mutual, informed consent, and free from coercion or undue influence.' },
            { type: 'text', text: 'The parties further represent that no wages, professional benefits, or employment decisions are conditioned on the personal relationship, and that any shared expenses are solely for mutual benefit rather than compensation for intimate conduct.' }
        ]);

        const confidentialBody = [
            { type: 'text', text: 'For purposes of this Agreement, "Confidential Information" includes, but is not limited to:' },
            { type: 'list', items: confidentialInfo },
            { type: 'text', text: 'Confidential Information specifically excludes: (a) information that is publicly known through no breach of this Agreement; (b) information independently developed without reference to Confidential Information; (c) information rightfully received from third parties without breach of confidentiality; and (d) information that becomes non-confidential through no fault of the receiving party.' }
        ];
        if (profile.reinforcement) {
            confidentialBody.push({ type: 'text', text: profile.reinforcement });
        }
        addClause('confidential-info-section', 'CONFIDENTIAL INFORMATION DEFINED', confidentialBody);

        addClause('confidentiality-obligations', 'CONFIDENTIALITY OBLIGATIONS', [
            { type: 'text', text: 'Each party mutually agrees to maintain the confidentiality of all Confidential Information shared by the other party and shall not disclose, publish, or otherwise reveal such information to any third party without prior written consent of the disclosing party. This creates reciprocal obligations ensuring both parties are equally bound by confidentiality duties. Both parties acknowledge the sensitive nature of alternative lifestyle information and agree to exercise the highest degree of care in protecting such information.' }
        ]);

        addClause('standard-of-care', 'STANDARD OF CARE', [
            { type: 'text', text: 'Each party agrees to use the same degree of care to protect Confidential Information as they would use to protect their own most sensitive personal information, but in no event less than reasonable care. This includes implementing appropriate physical, technical, and administrative safeguards to prevent unauthorized access or disclosure.' }
        ]);

        addClause('permitted-disclosures', 'PERMITTED DISCLOSURES', [
            { type: 'text', text: 'This Agreement does not prevent disclosure:' },
            { type: 'list', items: permittedDisclosures }
        ]);

        const returnBody = [
            { type: 'text', text: 'Upon termination of the personal relationship or upon written request by the disclosing party, each party agrees to: (a) return all tangible materials containing Confidential Information; (b) permanently delete all electronic files, photographs, videos, messages, and other digital materials containing Confidential Information from all devices, cloud storage, and backup systems; (c) provide written certification of such deletion within thirty (30) days of the request; and (d) not retain any copies, excerpts, or derivatives of Confidential Information in any form. This obligation includes materials stored on personal devices, social media accounts, email systems, and any third-party storage services.' }
        ];
        if (retentionSummary) {
            returnBody.push({ type: 'text', text: `Retention Protocol: ${retentionSummary}` });
        }
        if (storagePractices) {
            returnBody.push({ type: 'text', text: `Secure Storage Methods: ${storagePractices}` });
        }
        addClause('return-destruction-clause', 'RETURN AND DESTRUCTION OF CONFIDENTIAL MATERIALS', returnBody);

        addClause('duration-section', 'DURATION AND SURVIVAL', [
            { type: 'text', text: `This Agreement shall remain in effect for ${formData.duration === 'indefinite' ? 'an indefinite period' : formData.duration + ' years'} from the effective date, unless terminated by mutual written consent. The obligations of confidentiality shall survive termination of this Agreement and any personal relationship between the parties. Certain provisions, including the return and destruction of materials, shall remain binding indefinitely.` }
        ]);

        addClause('consequences-breach', 'CONSEQUENCES OF BREACH', [
            { type: 'text', text: 'The parties acknowledge that any breach of this Agreement may cause irreparable harm to the non-breaching party for which monetary damages would be inadequate. Therefore, the non-breaching party shall be entitled to seek immediate injunctive relief and specific performance without the necessity of proving actual damages or posting bond.' }
        ]);

        if (formData.liquidatedDamages) {
            addClause('liquidated-damages-clause', 'LIQUIDATED DAMAGES', [
                { type: 'text', text: `In addition to injunctive relief, any material breach of this Agreement may result in liquidated damages of $${formData.liquidatedDamages} per violation. This amount represents a reasonable estimate of potential harm considering the sensitive nature of the information, potential reputational damage, emotional distress, and difficulty in calculating actual damages. This remedy is in addition to, not in lieu of, other available legal remedies.` }
            ]);
        }

        if (formData.arbitration) {
            addClause('arbitration-clause', 'DISPUTE RESOLUTION', [
                { type: 'text', text: `Any disputes arising under this Agreement shall be resolved through confidential binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, conducted by a single arbitrator experienced in privacy and confidentiality matters in ${formData.jurisdiction}. All arbitration proceedings, documents, and awards shall remain strictly confidential. The prevailing party shall be entitled to reasonable attorneys' fees and costs. Nothing in this clause shall prevent either party from seeking immediate injunctive relief in a court of competent jurisdiction to prevent ongoing or threatened breaches.` }
            ]);
        }

        addClause('social-media-privacy', 'SOCIAL MEDIA AND DIGITAL PRIVACY', [
            { type: 'text', text: 'Each party specifically agrees not to post, share, or reference any Confidential Information on social media platforms, dating applications, online forums, or any other digital platforms. This includes but is not limited to photographs, location check-ins, status updates, stories, or any other content that could directly or indirectly reveal Confidential Information. The parties acknowledge that digital information can be easily copied, screenshotted, or forwarded, and agree to exercise extreme caution in all digital communications.' }
        ]);

        const thirdPartyBody = [
            { type: 'text', text: 'If either party must disclose Confidential Information to authorized third parties (such as trusted confidants, wellness professionals, or legal counsel as permitted herein), they shall ensure such third parties understand the confidential nature of the information and are bound by similar obligations of confidentiality.' }
        ];
        if (activeParticipants.length) {
            thirdPartyBody.push({ type: 'text', text: 'Approved confidants and conditions:' });
            thirdPartyBody.push({ type: 'list', items: activeParticipants.map(formatParticipant) });
            thirdPartyBody.push({ type: 'text', text: 'Each approved recipient must limit use of Confidential Information to the stated purpose and, where feasible, sign a comparable confidentiality undertaking.' });
        } else {
            thirdPartyBody.push({ type: 'text', text: 'No specific third-party recipients are authorised at this time. Any future disclosure requires prior written consent from both parties and a comparable confidentiality commitment.' });
        }
        addClause('third-party-obligations', 'THIRD-PARTY OBLIGATIONS', thirdPartyBody);

        addClause('general-provisions', 'GENERAL PROVISIONS', [
            { type: 'text', text: `This Agreement shall be governed by the laws of ${jurisdictionText} without regard to conflict of law principles. If any provision is found unenforceable, the remainder shall remain in full force and effect. This Agreement constitutes the entire understanding between the parties regarding confidentiality obligations and supersedes all prior negotiations, representations, or agreements relating to this subject matter. Any modifications must be in writing and signed by both parties. The failure to enforce any provision shall not constitute a waiver of that provision or any other provision.` }
        ]);

        if (formData.additionalTerms) {
            addClause('additional-terms', 'ADDITIONAL TERMS', [
                { type: 'text', text: formData.additionalTerms }
            ]);
        }

        const acknowledgement = 'By signing below, each party acknowledges that they have read, understood, and agree to be bound by all terms of this Agreement.';

        const plainTextLines = [
            NDA_TITLE,
            `Effective Date: ${effectiveDate}`,
            `Parties: ${party1} ("First Party") and ${party2} ("Second Party")`,
            ''
        ];

        clauses.forEach((clause) => {
            plainTextLines.push(`${clause.number}. ${clause.title}.`);
            clause.body.forEach((segment) => {
                if (segment.type === 'text') {
                    plainTextLines.push(segment.text);
                } else if (segment.type === 'list') {
                    segment.items.forEach((item) => {
                        plainTextLines.push(`- ${item}`);
                    });
                }
            });
            plainTextLines.push('');
        });

        plainTextLines.push('ACKNOWLEDGMENT AND EXECUTION.');
        plainTextLines.push(acknowledgement);
        plainTextLines.push('');
        plainTextLines.push('First Party: _________________________ Date: _________');
        plainTextLines.push(party1);
        plainTextLines.push('');
        plainTextLines.push('Second Party: _________________________ Date: _________');
        plainTextLines.push(party2);

        if (assetInventoryEntries.length) {
            plainTextLines.push('');
            plainTextLines.push('ANNEX A – PROTECTED MATERIALS INVENTORY');
            assetInventoryEntries.forEach((item) => {
                plainTextLines.push(`- ${item}`);
            });
        } else {
            plainTextLines.push('');
            plainTextLines.push('ANNEX A – PROTECTED MATERIALS INVENTORY (to be completed jointly by the parties as protected materials are identified).');
        }

        return {
            title: NDA_TITLE,
            effectiveDate,
            party1,
            party2,
            clauses,
            metadata: [
                { id: 'effective-date-section', label: 'Effective Date:', value: effectiveDate },
                { id: 'parties-section', label: 'Parties:', value: `${party1} ("First Party") and ${party2} ("Second Party")` }
            ],
            acknowledgement,
            plainText: plainTextLines.join('
').trim(),
            signatureBlock: [
                { id: 'first-party-signature', label: 'First Party', name: party1 },
                { id: 'second-party-signature', label: 'Second Party', name: party2 }
            ],
            annex: {
                items: assetInventoryEntries,
                placeholder: 'Use this annex to list cloud folders, shared drives, storage devices, or physical binders that must be returned or destroyed when the relationship ends.'
            },
            retention: {
                label: retentionLabel,
                summary: retentionSummary
            },
            storagePractices,
            industryDetails,
            sensitivityItems
        };
    }, [formData, privacyLevel]);

    const getPrivacyLevelText = () => {
        if (privacyLevel === 1) return "Basic Discretion";
        if (privacyLevel === 2) return "Enhanced Privacy";
        return "High-Profile Protection";
    };

    const generateWordDoc = async () => {
        if (!isPaid) {
            setShowPaywall(true);
            return;
        }

        const docxLib = window.docx;

        if (!docxLib) {
            alert('Document exporter is still loading. Please try again in a moment.');
            return;
        }

        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docxLib;

        const createRun = (text, overrides = {}) => new TextRun({
            text,
            size: 22,
            font: 'Times New Roman',
            ...overrides
        });

        const docParagraphs = [];

        docParagraphs.push(new Paragraph({
            children: [createRun(ndaData.title, { bold: true })],
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }));

        ndaData.metadata.forEach((meta) => {
            docParagraphs.push(new Paragraph({
                children: [
                    createRun(`${meta.label} `, { bold: true }),
                    createRun(meta.value)
                ],
                spacing: { after: 120 }
            }));
        });

        ndaData.clauses.forEach((clause) => {
            const [firstSegment, ...restSegments] = clause.body;

            if (firstSegment) {
                if (firstSegment.type === 'text') {
                    docParagraphs.push(new Paragraph({
                        children: [
                            createRun(`${clause.number}. ${clause.title}. `, { bold: true }),
                            createRun(firstSegment.text)
                        ],
                        spacing: { after: restSegments.length ? 100 : 200 }
                    }));
                } else if (firstSegment.type === 'list') {
                    docParagraphs.push(new Paragraph({
                        children: [createRun(`${clause.number}. ${clause.title}.`, { bold: true })],
                        spacing: { after: 60 }
                    }));
                    firstSegment.items.forEach((item) => {
                        docParagraphs.push(new Paragraph({
                            children: [createRun(item)],
                            bullet: { level: 0 },
                            spacing: { after: 60 }
                        }));
                    });
                }
            }

            restSegments.forEach((segment) => {
                if (segment.type === 'text') {
                    docParagraphs.push(new Paragraph({
                        children: [createRun(segment.text)],
                        spacing: { after: 120 }
                    }));
                } else if (segment.type === 'list') {
                    segment.items.forEach((item) => {
                        docParagraphs.push(new Paragraph({
                            children: [createRun(item)],
                            bullet: { level: 0 },
                            spacing: { after: 60 }
                        }));
                    });
                }
            });
        });

        docParagraphs.push(new Paragraph({
            children: [createRun('ACKNOWLEDGMENT AND EXECUTION.', { bold: true })],
            spacing: { before: 200, after: 100 }
        }));

        docParagraphs.push(new Paragraph({
            children: [createRun(ndaData.acknowledgement)],
            spacing: { after: 200 }
        }));

        ndaData.signatureBlock.forEach((entry) => {
            docParagraphs.push(new Paragraph({
                children: [createRun(`${entry.label}: _________________________ Date: _________`)],
                spacing: { after: 60 }
            }));
            docParagraphs.push(new Paragraph({
                children: [createRun(entry.name)],
                spacing: { after: 160 }
            }));
        });

        try {
            const doc = new Document({
                styles: {
                    default: {
                        document: {
                            run: {
                                font: 'Times New Roman',
                                size: 22
                            }
                        }
                    }
                },
                sections: [
                    {
                        properties: {},
                        children: docParagraphs
                    }
                ]
            });

            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Nondisclosure_Agreement.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to generate Word document', error);
            alert('Unable to generate the Word document. Please try again.');
        }
    };

    const copyToClipboard = async () => {
        if (!isPaid) {
            setShowPaywall(true);
            return;
        }

        const textContent = ndaData.plainText;

        if (!textContent) {
            return;
        }

        try {
            await navigator.clipboard.writeText(textContent);
            alert('NDA text copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('NDA text copied to clipboard!');
        }
    };

    const scrollToClauseWithTempHighlight = (clauseId) => {
        const previewContainer = previewContainerRef.current;
        const element = clauseRefs.current[clauseId];

        if (element && previewContainer) {
            const containerRect = previewContainer.getBoundingClientRect();
            const targetRect = element.getBoundingClientRect();
            const targetOffset = targetRect.top - containerRect.top + previewContainer.scrollTop;
            const scrollTop = Math.max(targetOffset - previewContainer.clientHeight / 2, 0);

            previewContainer.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });

            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }

            setHighlightedClause(clauseId);
            highlightTimeoutRef.current = setTimeout(() => setHighlightedClause(null), 2000);
        }
    };

    const getRiskAssessment = (key) => {
        return RISK_ASSESSMENTS[key] || { level: 'low', title: 'Standard', description: 'Standard protection clause.' };
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Alternative Lifestyle NDA Generator</h1>
                <p>Professional-grade confidentiality agreements for personal relationships with enhanced discretion</p>
            </div>

            <div className="main-content">
                <div className="form-section">
                    <h2>Agreement Configuration</h2>

                    <div className="tabs">
                        {TAB_CONFIG.map(({ key, label, className }) => (
                            <button
                                key={key}
                                className={`tab ${className} ${activeTab === key ? 'active' : ''}`}
                                onClick={() => setActiveTab(key)}
                                type="button"
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className={`tab-content ${activeTab === 'basics' ? 'active' : ''}`}>
                        <div className="form-group">
                            <label>First Party Name:</label>
                            <input
                                type="text"
                                name="party1Name"
                                value={formData.party1Name}
                                onChange={handleInputChange}
                                placeholder="Your name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Second Party Name:</label>
                            <input
                                type="text"
                                name="party2Name"
                                value={formData.party2Name}
                                onChange={handleInputChange}
                                placeholder="Partner's name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Effective Date:</label>
                            <input
                                type="date"
                                name="effectiveDate"
                                value={formData.effectiveDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Agreement Duration (years):</label>
                            <select name="duration" value={formData.duration} onChange={handleInputChange}>
                                <option value="2">2 years</option>
                                <option value="5">5 years</option>
                                <option value="10">10 years</option>
                                <option value="indefinite">Indefinite</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Governing Jurisdiction:</label>
                            <select name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange}>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="District of Columbia">District of Columbia</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                                <option value="Louisiana">Louisiana</option>
                                <option value="Maine">Maine</option>
                                <option value="Maryland">Maryland</option>
                                <option value="Massachusetts">Massachusetts</option>
                                <option value="Michigan">Michigan</option>
                                <option value="Minnesota">Minnesota</option>
                                <option value="Mississippi">Mississippi</option>
                                <option value="Missouri">Missouri</option>
                                <option value="Montana">Montana</option>
                                <option value="Nebraska">Nebraska</option>
                                <option value="Nevada">Nevada</option>
                                <option value="New Hampshire">New Hampshire</option>
                                <option value="New Jersey">New Jersey</option>
                                <option value="New Mexico">New Mexico</option>
                                <option value="New York">New York</option>
                                <option value="North Carolina">North Carolina</option>
                                <option value="North Dakota">North Dakota</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Oklahoma">Oklahoma</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Pennsylvania">Pennsylvania</option>
                                <option value="Rhode Island">Rhode Island</option>
                                <option value="South Carolina">South Carolina</option>
                                <option value="South Dakota">South Dakota</option>
                                <option value="Tennessee">Tennessee</option>
                                <option value="Texas">Texas</option>
                                <option value="Utah">Utah</option>
                                <option value="Vermont">Vermont</option>
                                <option value="Virginia">Virginia</option>
                                <option value="Washington">Washington</option>
                                <option value="West Virginia">West Virginia</option>
                                <option value="Wisconsin">Wisconsin</option>
                                <option value="Wyoming">Wyoming</option>
                            </select>
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'privacy' ? 'active' : ''}`}>
                        <div className="privacy-slider">
                            <label>Privacy Protection Level: <strong>{getPrivacyLevelText()}</strong></label>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    value={privacyLevel}
                                    onChange={handlePrivacyLevelChange}
                                    className="slider"
                                />
                                <div className="slider-labels">
                                    <span>Basic</span>
                                    <span>Enhanced</span>
                                    <span>Maximum</span>
                                </div>
                            </div>
                            {sliderAdjustmentNote && (
                                <div className="slider-note">{sliderAdjustmentNote}</div>
                            )}
                        </div>

                        <div className="hint-box info">
                            <strong>Heads-up:</strong> Adjusting the slider will enable or disable recommended safeguards so Section 2 keeps building instead of shrinking.
                        </div>

                        <div className="checkbox-group privacy-toggle-list">
                            {Object.entries(PRIVACY_TOGGLE_LABELS).map(([key, label]) => {
                                const riskKey = TOGGLE_TO_RISK_KEY[key] || 'basicInfo';
                                const riskMeta = getRiskAssessment(riskKey);
                                return (
                                    <label key={key} className={`checkbox-item ${formData[key] ? 'checked' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name={key}
                                            checked={formData[key]}
                                            onChange={handleInputChange}
                                        />
                                        <span>{label}</span>
                                        <span className={`risk-level risk-${riskMeta.level}`}>
                                            {riskMeta.level.toUpperCase()}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'trusted' ? 'active' : ''}`}>
                        <h3>Trusted Support Network</h3>
                        <p className="tab-hint">List confidants such as therapists, pro-dommes, or logistics managers who may receive limited disclosures. Their obligations are reflected in the Third-Party clause and Annex.</p>

                        {(formData.thirdPartyParticipants || []).map((participant, index) => {
                            const disableRemoval = (formData.thirdPartyParticipants || []).length === 1;
                            return (
                                <div key={participant.id} className="participant-card">
                                    <div className="participant-card-header">
                                        <h4>Trusted Contact #{index + 1}</h4>
                                        <button
                                            type="button"
                                            className="link-button"
                                            onClick={() => removeParticipant(participant.id)}
                                            disabled={disableRemoval}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="form-grid two-column">
                                        <div className="form-group">
                                            <label>Name or Alias</label>
                                            <input
                                                type="text"
                                                value={participant.name}
                                                onChange={(e) => handleParticipantChange(participant.id, 'name', e.target.value)}
                                                placeholder="e.g. Sam Therapist"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Role / Relationship</label>
                                            <input
                                                type="text"
                                                value={participant.role}
                                                onChange={(e) => handleParticipantChange(participant.id, 'role', e.target.value)}
                                                placeholder="Therapist, Dungeon Monitor, etc."
                                            />
                                        </div>
                                    </div>

                                    <div className="toggle-row">
                                        <label className="toggle-control">
                                            <input
                                                type="checkbox"
                                                checked={participant.requiresNDA}
                                                onChange={(e) => handleParticipantChange(participant.id, 'requiresNDA', e.target.checked)}
                                            />
                                            <span>Separate NDA must be signed</span>
                                        </label>
                                        <label className="toggle-control">
                                            <input
                                                type="checkbox"
                                                checked={participant.requiresNotice}
                                                onChange={(e) => handleParticipantChange(participant.id, 'requiresNotice', e.target.checked)}
                                            />
                                            <span>Give the other party advance notice</span>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Disclosure Conditions / Notes</label>
                                        <textarea
                                            value={participant.notes}
                                            onChange={(e) => handleParticipantChange(participant.id, 'notes', e.target.value)}
                                            rows="2"
                                            placeholder="Limit to crisis planning, coordinate scene safety, require copy of third-party NDA, etc."
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <button type="button" className="add-entry-btn" onClick={addParticipant}>
                            + Add Trusted Contact
                        </button>

                        <div className="hint-box subtle">
                            <strong>Reminder:</strong> Only contacts listed here (or approved later in writing) should receive Confidential Information.
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'advanced' ? 'active' : ''}`}>
                        <h3>Advanced Safeguards</h3>
                        <p className="tab-hint">Lock in destruction timelines and enforcement mechanics so the agreement stays tight if things go sideways.</p>

                        <div className="form-group">
                            <label>Retention / Destruction Timeline</label>
                            <select name="retentionTimeline" value={formData.retentionTimeline} onChange={handleInputChange}>
                                {RETENTION_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <small className="help-text">Mirrors the Return & Destruction clause and appears in the risk summary.</small>
                        </div>

                        {formData.retentionTimeline === 'custom' && (
                            <div className="form-group">
                                <label>Custom Timeline Instructions</label>
                                <textarea
                                    name="customRetentionTimeline"
                                    value={formData.customRetentionTimeline}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Describe the purge cadence, checkpoints, and who certifies destruction."
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Secure Storage Methods</label>
                            <textarea
                                name="storagePractices"
                                value={formData.storagePractices}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Encrypted drive, locked cabinet, zero-retention messaging app, etc."
                            />
                            <small className="help-text">We mirror this in the Return & Destruction clause.</small>
                        </div>

                        <div className="form-group">
                            <label>Protected Materials Inventory (Annex A)</label>
                            <textarea
                                name="assetInventory"
                                value={formData.assetInventory}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="One item per line: 'Shared photo vault (Dropbox)', 'Scene negotiation doc (Notion)', etc."
                            />
                        </div>

                        <div className="form-group">
                            <label>Liquidated Damages ($ per violation - optional)</label>
                            <input
                                type="number"
                                name="liquidatedDamages"
                                value={formData.liquidatedDamages}
                                onChange={handleInputChange}
                                placeholder="e.g. 10000"
                                min="0"
                                step="100"
                            />
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="arbitration"
                                    checked={formData.arbitration}
                                    onChange={handleInputChange}
                                />
                                <span>Keep disputes in confidential arbitration (recommended)</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Additional Custom Terms</label>
                            <textarea
                                name="additionalTerms"
                                value={formData.additionalTerms}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Add fallback protocols, reference companion agreements, or record bespoke restrictions."
                            />
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'risk' ? 'active' : ''}`}>
                        <h3>Risk Assessment & Advisory</h3>
                        <p className="tab-hint">This advisory is not part of the signed NDA. Use it to flag industry rules, mandated reporters, and reputation hotspots.</p>

                        <div className="risk-summary-grid">
                            <div className="risk-card">
                                <h4>Current Safeguards</h4>
                                <ul>
                                    <li><strong>Privacy Level:</strong> {getPrivacyLevelText()}</li>
                                    <li><strong>Enabled Protections:</strong> {selectedPrivacyToggles.length ? selectedPrivacyToggles.map((key) => PRIVACY_TOGGLE_LABELS[key]).join(', ') : 'None selected yet'}</li>
                                    <li><strong>Trusted Contacts Configured:</strong> {activeTrustedParticipants.length}</li>
                                    <li><strong>Retention Plan:</strong> {ndaData.retention.summary || 'Default 30-day rotation'}</li>
                                </ul>
                            </div>

                            {ndaData.storagePractices && (
                                <div className="risk-card">
                                    <h4>Secure Storage Notes</h4>
                                    <p>{ndaData.storagePractices}</p>
                                </div>
                            )}
                        </div>

                        <div className="risk-card">
                            <h4>Reputation & Clearance Flags</h4>
                            <p>Check anything that could trigger PR crises, employment policies, or government reporting before you disclose.</p>
                            <div className="checkbox-group">
                                <label className={`checkbox-item ${formData.careerSensitive ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name="careerSensitive"
                                        checked={formData.careerSensitive}
                                        onChange={handleInputChange}
                                    />
                                    <span>Career could be impacted if lifestyle details leak</span>
                                </label>
                                <label className={`checkbox-item ${formData.publicFigure ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name="publicFigure"
                                        checked={formData.publicFigure}
                                        onChange={handleInputChange}
                                    />
                                    <span>Public figure / media exposure risk</span>
                                </label>
                                <label className={`checkbox-item ${formData.securityClearance ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name="securityClearance"
                                        checked={formData.securityClearance}
                                        onChange={handleInputChange}
                                    />
                                    <span>Security clearance or government reporting obligations</span>
                                </label>
                                <label className={`checkbox-item ${formData.educationField ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name="educationField"
                                        checked={formData.educationField}
                                        onChange={handleInputChange}
                                    />
                                    <span>Educator / childcare professional (mandated reporter)</span>
                                </label>
                            </div>
                        </div>

                        {(formData.careerSensitive || formData.publicFigure) && (
                            <div className="risk-card warning">
                                <h4>High-Visibility Reminder</h4>
                                <p>Consider using the maximum privacy tier, tighten who appears in Annex A, and pre-draft media or HR statements in case of leaks.</p>
                            </div>
                        )}

                        {formData.securityClearance && (
                            <div className="risk-card caution">
                                <h4>Security Clearance Notice</h4>
                                <p>Coordinate with your security/compliance officer before execution. Clearance rules may require reporting certain relationships or NDAs.</p>
                            </div>
                        )}

                        {formData.educationField && (
                            <div className="risk-card warning">
                                <h4>Mandated Reporter Reminder</h4>
                                <p>Education and childcare professionals must report suspected abuse or imminent harm even if an NDA says otherwise. Document any disclosures in writing.</p>
                            </div>
                        )}

                        <div className="risk-card">
                            <h4>Industry & Reputation Safeguards</h4>
                            <p>Select any industry triggers so we can highlight mandated disclosures and best practices.</p>
                            <div className="industry-grid">
                                {INDUSTRY_KEYS.map((key) => {
                                    const stateKey = toIndustryStateKey(key);
                                    const detail = INDUSTRY_GUIDANCE[key];
                                    return (
                                        <label key={key} className={`industry-pill ${formData[stateKey] ? 'selected' : ''}`}>
                                            <input
                                                type="checkbox"
                                                name={stateKey}
                                                checked={formData[stateKey]}
                                                onChange={handleInputChange}
                                            />
                                            <span>{detail.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {ndaData.industryDetails.length > 0 && (
                            <div className="risk-card warning">
                                <h4>Tailored Warnings</h4>
                                <ul>
                                    {ndaData.industryDetails.map((detail) => (
                                        <li key={detail.key}>
                                            <strong>{detail.label}:</strong> {detail.warning}
                                            {detail.recommended && detail.recommended.length > 0 && (
                                                <div className="recommended-note">
                                                    Recommended safeguards: {detail.recommended.map((toggle) => PRIVACY_TOGGLE_LABELS[toggle]).join(', ')}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(ndaData.sensitivityItems && ndaData.sensitivityItems.length > 0) && (
                            <div className="risk-card caution">
                                <h4>Additional Risk Flags</h4>
                                <ul>
                                    {ndaData.sensitivityItems.map((item, index) => (
                                        <li key={`sensitivity-${index}`}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Internal Notes (not in agreement)</label>
                            <textarea
                                name="industryNotes"
                                value={formData.industryNotes}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Document compliance officers, PR plans, or reminders to loop in counsel."
                            />
                        </div>
                    </div>

                    <div className="export-actions">
                        <button
                            className="generate-btn"
                            data-locked={!isPaid}
                            onClick={generateWordDoc}
                            type="button"
                        >
                            Download MS Word
                        </button>
                        <button
                            className="generate-btn green"
                            data-locked={!isPaid}
                            onClick={copyToClipboard}
                            type="button"
                        >
                            Copy to Clipboard
                        </button>
                    </div>

                    {!isPaid && (
                        <div className="paywall-callout">
                            <div>
                                <strong>Locked:</strong> Copy and download unlock after a one-time ${PAYWALL_PRICE} secure payment.
                            </div>
                            <button type="button" className="paywall-trigger" onClick={handlePaywallOpen}>
                                Unlock Now
                            </button>
                        </div>
                    )}
                </div>

                <div className="preview-section">
                    <h2>Live Preview</h2>
                    <div
                        className={`preview-content ${isPaid ? '' : 'locked'}`.trim()}
                        ref={previewContainerRef}
                        onCopy={handlePreviewCopy}
                        onCut={handlePreviewCopy}
                    >
                        {!isPaid && (
                            <div className="preview-lock-banner">
                                🔒 Copy and download are locked until payment is completed.
                            </div>
                        )}
                        <h3>{ndaData.title}</h3>
                        {ndaData.metadata.map((meta) => (
                            <p
                                key={meta.id}
                                id={meta.id}
                                ref={getClauseRefCallback(meta.id)}
                                className={highlightedClause === meta.id ? 'temp-highlight' : ''}
                            >
                                <strong>{meta.label}</strong> {renderTextWithBreaks(meta.value)}
                            </p>
                        ))}

                        {ndaData.clauses.map((clause) => {
                            const [firstSegment, ...restSegments] = clause.body;

                            return (
                                <div
                                    key={clause.id}
                                    id={clause.id}
                                    ref={getClauseRefCallback(clause.id)}
                                    className={`clause-block ${highlightedClause === clause.id ? 'temp-highlight' : ''}`}
                                >
                                    {firstSegment && firstSegment.type === 'text' ? (
                                        <p>
                                            <strong>{`${clause.number}. ${clause.title}.`}</strong>{' '}
                                            {renderTextWithBreaks(firstSegment.text)}
                                        </p>
                                    ) : (
                                        <p>
                                            <strong>{`${clause.number}. ${clause.title}.`}</strong>
                                        </p>
                                    )}

                                    {firstSegment && firstSegment.type === 'list' && (
                                        <ul>
                                            {firstSegment.items.map((item, index) => (
                                                <li key={`first-${clause.id}-${index}`}>{item}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {restSegments.map((segment, segmentIndex) => {
                                        if (segment.type === 'text') {
                                            return (
                                                <p key={`text-${clause.id}-${segmentIndex}`}>
                                                    {renderTextWithBreaks(segment.text)}
                                                </p>
                                            );
                                        }
                                        return (
                                            <ul key={`list-${clause.id}-${segmentIndex}`}>
                                                {segment.items.map((item, itemIndex) => (
                                                    <li key={`list-${clause.id}-${segmentIndex}-${itemIndex}`}>{item}</li>
                                                ))}
                                            </ul>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        <p
                            id="acknowledgment-execution"
                            ref={getClauseRefCallback('acknowledgment-execution')}
                            className={highlightedClause === 'acknowledgment-execution' ? 'temp-highlight' : ''}
                            style={{ marginTop: '30px', pageBreakInside: 'avoid' }}
                        >
                            <strong>ACKNOWLEDGMENT AND EXECUTION.</strong>{' '}
                            {renderTextWithBreaks(ndaData.acknowledgement)}
                        </p>

                        <div style={{ pageBreakInside: 'avoid', marginTop: '20px' }}>
                            {ndaData.signatureBlock.map((entry) => (
                                <div key={entry.id} className="signature-entry">
                                    <p>
                                        <strong>{entry.label}:</strong> _________________________ Date: _________
                                    </p>
                                    <p>{entry.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="disclaimer">
                <h3>⚠️ Legal Disclaimer</h3>
                <p>This generator creates template documents for informational purposes only. It does not constitute legal advice or create an attorney-client relationship. Laws vary by jurisdiction, and individual circumstances may require specific modifications. For legally binding agreements, especially those involving high stakes or complex situations, consult with a qualified attorney in your jurisdiction.</p>
                <p><strong>Privacy Notice:</strong> All information entered is processed locally in your browser and is not transmitted to any servers. Use the auto-save feature responsibly on shared devices.</p>
            </div>

            <div className={`auto-save-indicator ${autoSaved ? 'show' : ''}`}>
                ✓ Draft auto-saved
            </div>

            {showPaywall && (
                <div className="paywall-modal-overlay" role="dialog" aria-modal="true">
                    <div className="paywall-modal">
                        <button
                            type="button"
                            className="paywall-close"
                            aria-label="Close payment window"
                            onClick={handlePaywallClose}
                        >
                            ×
                        </button>
                        <h3>Unlock Copy & Download</h3>
                        <p>
                            Complete a secure PayPal checkout to enable Word export and clipboard copying. Your live preview remains available regardless of payment.
                        </p>
                        <ul className="paywall-benefits">
                            <li>Full .docx download with consistent 11 pt formatting</li>
                            <li>Copy-ready plain text for redlining or email</li>
                            <li>Persistent access on this device after payment</li>
                        </ul>
                        <div className="paypal-placeholder" ref={paypalContainerRef}>
                            {!paypalReady && <p>Loading PayPal checkout…</p>}
                        </div>
                        <span className="paywall-note">
                            Secured by PayPal · One-time payment of ${PAYWALL_PRICE} USD for {PAYWALL_PRODUCT_LABEL}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<AlternativeLifestyleNDAGenerator />, document.getElementById('root'));
