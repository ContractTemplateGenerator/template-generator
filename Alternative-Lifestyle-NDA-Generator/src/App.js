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
    industryHealthcare: 'industry-compliance-clause',
    industryGovernment: 'industry-compliance-clause',
    industryEducation: 'industry-compliance-clause',
    industryFinance: 'industry-compliance-clause',
    careerSensitive: 'industry-compliance-clause',
    publicFigure: 'industry-compliance-clause',
    securityClearance: 'industry-compliance-clause',
    educationField: 'industry-compliance-clause',
    industryNotes: 'industry-compliance-clause'
};

function AlternativeLifestyleNDAGenerator() {
    const [activeTab, setActiveTab] = useState('basics');
    const [privacyLevel, setPrivacyLevel] = useState(1);
    const [autoSaved, setAutoSaved] = useState(false);

    const [formData, setFormData] = useState(() => createInitialFormData());

    const [highlightedClause, setHighlightedClause] = useState(null);
    const [sliderAdjustmentNote, setSliderAdjustmentNote] = useState('');

    const previewContainerRef = useRef(null);
    const clauseRefs = useRef({});
    const clauseRefCallbacks = useRef({});
    const highlightTimeoutRef = useRef(null);
    const sliderNoteTimeoutRef = useRef(null);

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

        const activeParticipants = (formData.thirdPartyParticipants || []).map((participant) => ({
            id: participant.id,
            name: (participant.name || '').trim(),
            role: (participant.role || '').trim(),
            requiresNDA: typeof participant.requiresNDA === 'boolean' ? participant.requiresNDA : true,
            requiresNotice: typeof participant.requiresNotice === 'boolean' ? participant.requiresNotice : true,
            notes: (participant.notes || '').trim()
        })).filter((participant) => participant.name || participant.role || participant.notes);

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

        if (industryDetails.length || sensitivityItems.length || industryNotes) {
            const industryBody = [];
            if (industryDetails.length) {
                industryBody.push({ type: 'text', text: 'Industry-specific compliance considerations selected:' });
                industryBody.push({ type: 'list', items: industryDetails.map((detail) => `${detail.label}: ${detail.clauseText}`) });
            }
            if (sensitivityItems.length) {
                industryBody.push({ type: 'text', text: 'Additional risk indicators flagged by the parties:' });
                industryBody.push({ type: 'list', items: sensitivityItems });
            }
            if (industryNotes) {
                industryBody.push({ type: 'text', text: `Additional notes: ${industryNotes}` });
            }
            addClause('industry-compliance-clause', 'COMPLIANCE WITH PROFESSIONAL OBLIGATIONS', industryBody);
        }

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
        const docxLib = window.docx;

        if (!docxLib) {
            alert('Document exporter is still loading. Please try again in a moment.');
            return;
        }

        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docxLib;

        const docParagraphs = [];

        docParagraphs.push(new Paragraph({
            text: ndaData.title,
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }));

        ndaData.metadata.forEach((meta) => {
            docParagraphs.push(new Paragraph({
                children: [
                    new TextRun({ text: `${meta.label} `, bold: true }),
                    new TextRun({ text: meta.value })
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
                            new TextRun({ text: `${clause.number}. ${clause.title}. `, bold: true }),
                            new TextRun({ text: firstSegment.text })
                        ],
                        spacing: { after: restSegments.length ? 100 : 200 }
                    }));
                } else if (firstSegment.type === 'list') {
                    docParagraphs.push(new Paragraph({
                        children: [new TextRun({ text: `${clause.number}. ${clause.title}.`, bold: true })],
                        spacing: { after: 60 }
                    }));
                    firstSegment.items.forEach((item) => {
                        docParagraphs.push(new Paragraph({
                            text: item,
                            bullet: { level: 0 },
                            spacing: { after: 60 }
                        }));
                    });
                }
            }

            restSegments.forEach((segment) => {
                if (segment.type === 'text') {
                    docParagraphs.push(new Paragraph({
                        text: segment.text,
                        spacing: { after: 120 }
                    }));
                } else if (segment.type === 'list') {
                    segment.items.forEach((item) => {
                        docParagraphs.push(new Paragraph({
                            text: item,
                            bullet: { level: 0 },
                            spacing: { after: 60 }
                        }));
                    });
                }
            });
        });

        docParagraphs.push(new Paragraph({
            children: [new TextRun({ text: 'ACKNOWLEDGMENT AND EXECUTION.', bold: true })],
            spacing: { before: 200, after: 100 }
        }));

        docParagraphs.push(new Paragraph({
            text: ndaData.acknowledgement,
            spacing: { after: 200 }
        }));

        ndaData.signatureBlock.forEach((entry) => {
            docParagraphs.push(new Paragraph({
                children: [new TextRun({ text: `${entry.label}: _________________________ Date: _________` })],
                spacing: { after: 60 }
            }));
            docParagraphs.push(new Paragraph({
                text: entry.name,
                spacing: { after: 160 }
            }));
        });

        try {
            const doc = new Document({
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
                        <button
                            className={`tab ${activeTab === 'basics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('basics')}
                        >
                            Basic Info
                        </button>
                        <button
                            className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            Privacy Level
                        </button>
                        <button
                            className={`tab ${activeTab === 'professional' ? 'active' : ''}`}
                            onClick={() => setActiveTab('professional')}
                        >
                            Risk Assessment
                        </button>
                        <button
                            className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
                            onClick={() => setActiveTab('participants')}
                        >
                            Participants
                        </button>
                        <button
                            className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
                            onClick={() => setActiveTab('advanced')}
                        >
                            Advanced
                        </button>
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

                        <div className="checkbox-group">
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="healthPrivacy"
                                    checked={formData.healthPrivacy}
                                    onChange={handleInputChange}
                                />
                                <label>Health Information Privacy</label>
                                <span className={`risk-level risk-${getRiskAssessment('healthInfo').level}`}>
                                    {getRiskAssessment('healthInfo').level.toUpperCase()}
                                </span>
                            </div>

                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="professionalProtection"
                                    checked={formData.professionalProtection}
                                    onChange={handleInputChange}
                                />
                                <label>Professional Reputation Protection</label>
                                <span className={`risk-level risk-${getRiskAssessment('professionalRep').level}`}>
                                    {getRiskAssessment('professionalRep').level.toUpperCase()}
                                </span>
                            </div>

                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="mediaProtection"
                                    checked={formData.mediaProtection}
                                    onChange={handleInputChange}
                                />
                                <label>Photos and Media Protection</label>
                                <span className={`risk-level risk-${getRiskAssessment('visualMedia').level}`}>
                                    {getRiskAssessment('visualMedia').level.toUpperCase()}
                                </span>
                            </div>

                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="venuePrivacy"
                                    checked={formData.venuePrivacy}
                                    onChange={handleInputChange}
                                />
                                <label>Private Venue Information</label>
                                <span className={`risk-level risk-${getRiskAssessment('venueInformation').level}`}>
                                    {getRiskAssessment('venueInformation').level.toUpperCase()}
                                </span>
                            </div>

                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="communityPrivacy"
                                    checked={formData.communityPrivacy}
                                    onChange={handleInputChange}
                                />
                                <label>Community Participation Details</label>
                                <span className={`risk-level risk-${getRiskAssessment('alternativeLifestyle').level}`}>
                                    {getRiskAssessment('alternativeLifestyle').level.toUpperCase()}
                                </span>
                            </div>

                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="financialPrivacy"
                                    checked={formData.financialPrivacy}
                                    onChange={handleInputChange}
                                />
                                <label>Financial Information</label>
                                <span className={`risk-level risk-${getRiskAssessment('financialInfo').level}`}>
                                    {getRiskAssessment('financialInfo').level.toUpperCase()}
                                </span>
                            </div>

                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="therapeuticException"
                                    checked={formData.therapeuticException}
                                    onChange={handleInputChange}
                                />
                                <label>Therapeutic Communication Exception</label>
                                <span className={`risk-level risk-${getRiskAssessment('therapeuticDisclosure').level}`}>
                                    {getRiskAssessment('therapeuticDisclosure').level.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'professional' ? 'active' : ''}`}>
                        <h3>Professional Risk Assessment</h3>
                        <p>This tool helps assess potential enforceability issues. <strong>This is educational information only, not legal advice.</strong></p>

                        <div className="risk-assessment">
                            <h4>Career Sensitivity Factors</h4>
                            <div className="checkbox-group">
                                <div className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="careerSensitive"
                                        checked={formData.careerSensitive}
                                        onChange={handleInputChange}
                                    />
                                    <label>Career could be affected by lifestyle disclosure</label>
                                </div>
                                <div className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="publicFigure"
                                        checked={formData.publicFigure}
                                        onChange={handleInputChange}
                                    />
                                    <label>Public figure or media attention possible</label>
                                </div>
                                <div className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="securityClearance"
                                        checked={formData.securityClearance}
                                        onChange={handleInputChange}
                                    />
                                    <label>Security clearance or government position</label>
                                </div>
                                <div className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="educationField"
                                        checked={formData.educationField}
                                        onChange={handleInputChange}
                                    />
                                    <label>Education or child-related profession</label>
                                </div>
                            </div>
                        </div>

                        {(formData.careerSensitive || formData.publicFigure) && (
                            <div className="warning-box">
                                <strong>Recommendation:</strong> Consider maximum privacy level and professional legal consultation for high-stakes situations.
                            </div>
                        )}

                        {formData.securityClearance && (
                            <div className="error-box">
                                <strong>Security Clearance Notice:</strong> Government security clearance holders should consult with security officers before signing any confidentiality agreements that could conflict with disclosure obligations.
                            </div>
                        )}

                        <div className="risk-assessment">
                            <h4>Key Legal Considerations</h4>
                            <ul>
                                <li><span className="risk-level risk-low">LOW RISK</span> Basic personal privacy - well-established legal protection</li>
                                <li><span className="risk-level risk-low">LOW RISK</span> Consensual adult activities - protected private conduct</li>
                                <li><span className="risk-level risk-medium">MEDIUM RISK</span> Health information - ensure HIPAA compliance considerations</li>
                                <li><span className="risk-level risk-medium">MEDIUM RISK</span> Photos/media - requires clear consent documentation</li>
                                <li><span className="risk-level risk-high">HIGH RISK</span> Financial details - avoid language suggesting commercial arrangements</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'advanced' ? 'active' : ''}`}>
                        <div className="form-group">
                            <label>Liquidated Damages ($ per violation - optional):</label>
                            <input
                                type="number"
                                name="liquidatedDamages"
                                value={formData.liquidatedDamages}
                                onChange={handleInputChange}
                                placeholder="e.g. 10000"
                            />
                        </div>

                        <div className="checkbox-group">
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    name="arbitration"
                                    checked={formData.arbitration}
                                    onChange={handleInputChange}
                                />
                                <label>Include arbitration clause (recommended for privacy)</label>
                            </div>


                        </div>

                        <div className="form-group">
                            <label>Additional Custom Terms:</label>
                            <textarea
                                name="additionalTerms"
                                value={formData.additionalTerms}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Any additional specific terms or clarifications..."
                            />
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                        <button className="generate-btn" onClick={generateWordDoc} style={{flex: 1}}>
                            Download MS Word
                        </button>
                        <button className="generate-btn" onClick={copyToClipboard} style={{flex: 1, backgroundColor: '#27ae60'}}>
                            Copy to Clipboard
                        </button>
                    </div>
                </div>

                <div className="preview-section">
                    <h2>Live Preview</h2>
                    <div className="preview-content" ref={previewContainerRef}>
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
        </div>
    );
}

ReactDOM.render(<AlternativeLifestyleNDAGenerator />, document.getElementById('root'));
