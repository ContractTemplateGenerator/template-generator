const { useState, useEffect } = React;

// Pre-compiled templates for instant loading
const TEMPLATES = {
    basic: {
        title: "NONDISCLOSURE AGREEMENT",
        introduction: "This Nondisclosure Agreement establishes mutual understanding regarding the protection of personal and private information shared between the parties in the context of their personal relationship.",
        confidentialInfo: [
            "Personal identity information including full names, addresses, contact details, and social media profiles",
            "Details of personal activities, preferences, and private arrangements",
            "Health information, medical conditions, and related personal matters",
            "Professional information including employment details and career concerns",
            "Private communications including messages, emails, and recorded conversations",
            "Photographic, video, or other recorded materials created together",
            "Information about private venues, events, or gatherings attended",
            "Personal boundaries, limits, and individual preferences discussed"
        ]
    },
    enhanced: {
        title: "NONDISCLOSURE AGREEMENT",
        introduction: "This Nondisclosure Agreement establishes strict confidentiality protocols for the protection of sensitive personal information, private activities, and reputational interests of all parties involved in personal arrangements.",
        confidentialInfo: [
            "Complete personal identity including legal names, aliases, contact information, and all social media accounts",
            "Detailed information about consensual adult activities, personal exploration, and lifestyle choices",
            "Comprehensive health and medical information including testing results, conditions, and treatment details",
            "Professional reputation matters including employment, business interests, and public standing",
            "All forms of private communication including digital messages, voice recordings, and written correspondence",
            "Visual and audio documentation including photographs, videos, and recordings of any nature",
            "Information about private venues, exclusive events, community participation, and social networks",
            "Personal boundaries, negotiated limits, safe practices, and individual consent frameworks",
            "Financial information related to lifestyle activities, venue memberships, or related expenses",
            "Therapeutic disclosures made to qualified professionals within the scope of treatment"
        ]
    },
    professional: {
        title: "NONDISCLOSURE AGREEMENT",
        introduction: "This Nondisclosure Agreement provides maximum privacy protection for individuals whose professional standing, public reputation, or career advancement could be materially affected by disclosure of private personal information.",
        confidentialInfo: [
            "Complete personal and professional identity including all names, titles, positions, and affiliations",
            "Detailed documentation of all consensual adult activities, personal practices, and lifestyle participation",
            "Comprehensive health, medical, and wellness information including all testing, treatments, and conditions",
            "Professional reputation elements including career details, business relationships, and public image concerns",
            "All communication methods including encrypted messages, secure platforms, and confidential correspondence",
            "Complete visual and audio documentation with advanced protection protocols",
            "Information about exclusive venues, high-discretion events, and selective community involvement",
            "Detailed personal boundaries, negotiated frameworks, safety protocols, and consent structures",
            "Financial privacy including lifestyle-related expenses, memberships, and investment in discretion",
            "Protected therapeutic communications with verified kink-aware mental health professionals",
            "Travel information related to lifestyle activities or discreet venues",
            "Technology usage including specialized applications, secure communication methods, and privacy tools"
        ]
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

function AlternativeLifestyleNDAGenerator() {
    const [activeTab, setActiveTab] = useState('basics');
    const [privacyLevel, setPrivacyLevel] = useState(1);
    const [autoSaved, setAutoSaved] = useState(false);

    const [formData, setFormData] = useState({
        party1Name: '',
        party2Name: '',
        party1Email: '',
        party2Email: '',
        effectiveDate: '',
        duration: '5',
        jurisdiction: 'California',

        // Privacy Level Options
        basicDiscretion: true,
        healthPrivacy: false,
        professionalProtection: false,
        mediaProtection: false,
        venuePrivacy: false,
        communityPrivacy: false,
        therapeuticException: false,
        financialPrivacy: false,

        // Professional Risk Assessment
        careerSensitive: false,
        publicFigure: false,
        securityClearance: false,
        educationField: false,

        // Additional Protections
        liquidatedDamages: '',
        arbitration: true,

        // Custom additions
        additionalTerms: ''
    });

    const [previewContent, setPreviewContent] = useState('');

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
            setFormData(JSON.parse(saved));
        }
    }, []);

    // Generate preview with optimized performance
    useEffect(() => {
        generateNDA();
    }, [formData, privacyLevel]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Auto-scroll and temporarily highlight relevant sections for ALL inputs
        setTimeout(() => {
            let targetClause = null;

            // Map inputs to their corresponding clauses
            if (name === 'arbitration' && (checked || value)) targetClause = 'arbitration-clause';
            if (name === 'liquidatedDamages' && value) targetClause = 'liquidated-damages-clause';
            if (name === 'party1Name' || name === 'party2Name') targetClause = 'parties-section';
            if (name === 'effectiveDate') targetClause = 'effective-date-section';
            if (name === 'duration') targetClause = 'duration-section';
            if (name === 'jurisdiction') targetClause = 'general-provisions';
            if (name === 'therapeuticException' && checked) targetClause = 'permitted-disclosures';
            if (name.includes('Privacy') && checked) targetClause = 'confidential-info-section';

            if (targetClause) {
                scrollToClauseWithTempHighlight(targetClause);
            }
        }, 300); // Delay to allow DOM update
    };

    const handlePrivacyLevelChange = (e) => {
        const level = parseInt(e.target.value);
        setPrivacyLevel(level);

        // Auto-adjust form options based on privacy level
        if (level >= 2) {
            setFormData(prev => ({
                ...prev,
                healthPrivacy: true,
                mediaProtection: true,
                professionalProtection: true
            }));
        }
        if (level >= 3) {
            setFormData(prev => ({
                ...prev,
                venuePrivacy: true,
                communityPrivacy: true,
                financialPrivacy: true,
                therapeuticException: true
            }));
        }
    };

    const getTemplate = () => {
        if (privacyLevel === 1) return TEMPLATES.basic;
        if (privacyLevel === 2) return TEMPLATES.enhanced;
        return TEMPLATES.professional;
    };

    const generateNDA = () => {
        const template = getTemplate();
        const party1 = formData.party1Name || '[Party 1 Name]';
        const party2 = formData.party2Name || '[Party 2 Name]';
        const effectiveDate = formData.effectiveDate || '[Date]';

        let confidentialInfo = [...template.confidentialInfo];

        // Add conditional clauses based on selections
        if (formData.healthPrivacy) {
            confidentialInfo.push('Specific health screenings, medical test results, and ongoing health monitoring');
        }
        if (formData.professionalProtection) {
            confidentialInfo.push('Professional associations, workplace policies, and career advancement considerations');
        }
        if (formData.mediaProtection) {
            confidentialInfo.push('Digital footprints, online presence, and social media activity related to personal lifestyle');
        }
        if (formData.venuePrivacy) {
            confidentialInfo.push('Private club memberships, exclusive venue access, and location-specific activities');
        }
        if (formData.communityPrivacy) {
            confidentialInfo.push('Community relationships, mentor connections, and social network participation');
        }
        if (formData.financialPrivacy) {
            confidentialInfo.push('Lifestyle-related expenses, specialized equipment, and privacy investment costs');
        }

        const ndaContent = `
            <h3>${template.title}</h3>

            <p id="effective-date-section"><strong>Effective Date:</strong> ${effectiveDate}</p>
            <p id="parties-section"><strong>Parties:</strong> ${party1} ("First Party") and ${party2} ("Second Party")</p>

            <p id="introduction-section"><strong>1. INTRODUCTION AND PURPOSE.</strong> ${template.introduction} This Agreement acknowledges that in the course of personal relationships involving alternative lifestyle activities, sensitive and highly personal information may be shared that requires maximum protection and discretion.</p>

            <p id="confidential-info-section"><strong>2. CONFIDENTIAL INFORMATION DEFINED.</strong> For purposes of this Agreement, "Confidential Information" includes, but is not limited to:</p>
            <ul>
                ${confidentialInfo.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p>Confidential Information specifically excludes: (a) information that is publicly known through no breach of this Agreement; (b) information independently developed without reference to Confidential Information; (c) information rightfully received from third parties without breach of confidentiality; and (d) information that becomes non-confidential through no fault of the receiving party.</p>

            <p id="confidentiality-obligations"><strong>3. CONFIDENTIALITY OBLIGATIONS.</strong> Each party mutually agrees to maintain the confidentiality of all Confidential Information shared by the other party and shall not disclose, publish, or otherwise reveal such information to any third party without prior written consent of the disclosing party. This creates reciprocal obligations ensuring both parties are equally bound by confidentiality duties. Both parties acknowledge the sensitive nature of alternative lifestyle information and agree to exercise the highest degree of care in protecting such information.</p>

            <p id="standard-of-care"><strong>4. STANDARD OF CARE.</strong> Each party agrees to use the same degree of care to protect Confidential Information as they would use to protect their own most sensitive personal information, but in no event less than reasonable care. This includes implementing appropriate physical, technical, and administrative safeguards to prevent unauthorized access or disclosure.</p>

            <p id="permitted-disclosures"><strong>5. PERMITTED DISCLOSURES.</strong> This Agreement does not prevent disclosure:</p>
            <ul>
                <li>Required by law, court order, or valid legal process (provided the disclosing party gives prior notice when legally permissible)</li>
                <li>To law enforcement regarding suspected criminal activity</li>
                <li>To medical professionals for emergency healthcare situations</li>
                ${formData.therapeuticException ? '<li>To licensed mental health professionals bound by professional confidentiality obligations</li>' : ''}
                <li>To attorneys for legal counsel (who are bound by attorney-client privilege)</li>
                <li>With prior written consent of both parties</li>
            </ul>

            <p id="return-destruction-clause"><strong>6. RETURN AND DESTRUCTION OF CONFIDENTIAL MATERIALS.</strong> Upon termination of the personal relationship or upon written request by the disclosing party, each party agrees to: (a) return all tangible materials containing Confidential Information; (b) permanently delete all electronic files, photographs, videos, messages, and other digital materials containing Confidential Information from all devices, cloud storage, and backup systems; (c) provide written certification of such deletion within thirty (30) days of the request; and (d) not retain any copies, excerpts, or derivatives of Confidential Information in any form. This obligation includes materials stored on personal devices, social media accounts, email systems, and any third-party storage services.</p>

            <p id="duration-section"><strong>7. DURATION AND SURVIVAL.</strong> This Agreement shall remain in effect for ${formData.duration === 'indefinite' ? 'an indefinite period' : formData.duration + ' years'} from the effective date, unless terminated by mutual written consent. The obligations of confidentiality shall survive termination of this Agreement and any personal relationship between the parties. Certain provisions, including the return and destruction of materials, shall remain binding indefinitely.</p>

            <p id="consequences-breach"><strong>8. CONSEQUENCES OF BREACH.</strong> The parties acknowledge that any breach of this Agreement may cause irreparable harm to the non-breaching party for which monetary damages would be inadequate. Therefore, the non-breaching party shall be entitled to seek immediate injunctive relief and specific performance without the necessity of proving actual damages or posting bond.</p>

            ${formData.liquidatedDamages ? `
            <p id="liquidated-damages-clause"><strong>9. LIQUIDATED DAMAGES.</strong> In addition to injunctive relief, any material breach of this Agreement may result in liquidated damages of $${formData.liquidatedDamages} per violation. This amount represents a reasonable estimate of potential harm considering the sensitive nature of the information, potential reputational damage, emotional distress, and difficulty in calculating actual damages. This remedy is in addition to, not in lieu of, other available legal remedies.</p>
            ` : ''}

            ${formData.arbitration ? `
            <p id="arbitration-clause"><strong>${formData.liquidatedDamages ? '10' : '9'}. DISPUTE RESOLUTION.</strong> Any disputes arising under this Agreement shall be resolved through confidential binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, conducted by a single arbitrator experienced in privacy and confidentiality matters in ${formData.jurisdiction}. All arbitration proceedings, documents, and awards shall remain strictly confidential. The prevailing party shall be entitled to reasonable attorneys' fees and costs. Nothing in this clause shall prevent either party from seeking immediate injunctive relief in a court of competent jurisdiction to prevent ongoing or threatened breaches.</p>
            ` : ''}

            <p id="social-media-privacy"><strong>${formData.arbitration ? (formData.liquidatedDamages ? '11' : '10') : (formData.liquidatedDamages ? '10' : '9')}. SOCIAL MEDIA AND DIGITAL PRIVACY.</strong> Each party specifically agrees not to post, share, or reference any Confidential Information on social media platforms, dating applications, online forums, or any other digital platforms. This includes but is not limited to photographs, location check-ins, status updates, stories, or any other content that could directly or indirectly reveal Confidential Information. The parties acknowledge that digital information can be easily copied, screenshotted, or forwarded, and agree to exercise extreme caution in all digital communications.</p>

            <p id="third-party-obligations"><strong>${formData.arbitration ? (formData.liquidatedDamages ? '12' : '11') : (formData.liquidatedDamages ? '11' : '10')}. THIRD-PARTY OBLIGATIONS.</strong> If either party must disclose Confidential Information to authorized third parties (such as trusted friends, therapists, or legal counsel as permitted herein), they shall ensure such third parties understand the confidential nature of the information and are bound by similar obligations of confidentiality.</p>

            <p id="general-provisions"><strong>${formData.arbitration ? (formData.liquidatedDamages ? '13' : '12') : (formData.liquidatedDamages ? '12' : '11')}. GENERAL PROVISIONS.</strong> This Agreement shall be governed by the laws of ${formData.jurisdiction === 'District of Columbia' ? 'the District of Columbia' : 'the State of ' + formData.jurisdiction} without regard to conflict of law principles. If any provision is found unenforceable, the remainder shall remain in full force and effect. This Agreement constitutes the entire understanding between the parties regarding confidentiality obligations and supersedes all prior negotiations, representations, or agreements relating to this subject matter. Any modifications must be in writing and signed by both parties. The failure to enforce any provision shall not constitute a waiver of that provision or any other provision.</p>

            ${formData.additionalTerms ? `
            <p id="additional-terms"><strong>${formData.arbitration ? (formData.liquidatedDamages ? '14' : '13') : (formData.liquidatedDamages ? '13' : '12')}. ADDITIONAL TERMS.</strong> ${formData.additionalTerms}</p>
            ` : ''}

            <p id="acknowledgment-execution" style="margin-top: 30px; page-break-inside: avoid;">
                <strong>ACKNOWLEDGMENT AND EXECUTION.</strong> By signing below, each party acknowledges that they have read, understood, and agree to be bound by all terms of this Agreement.
            </p>

            <div style="page-break-inside: avoid; margin-top: 20px;">
                <p><strong>First Party:</strong> _________________________ Date: _________<br/>
                ${party1}</p>
                <br/>
                <p><strong>Second Party:</strong> _________________________ Date: _________<br/>
                ${party2}</p>
            </div>
        `;

        setPreviewContent(ndaContent);
    };

    const getPrivacyLevelText = () => {
        if (privacyLevel === 1) return "Basic Discretion";
        if (privacyLevel === 2) return "Enhanced Privacy";
        return "High-Profile Protection";
    };

    const generateWordDoc = () => {
        // Remove all highlighting and styling for Word document
        const cleanContent = previewContent
            .replace(/class="[^"]*"/g, '')  // Remove all class attributes
            .replace(/<span[^>]*>/g, '')    // Remove span tags
            .replace(/<\/span>/g, '');      // Remove closing span tags

        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Nondisclosure Agreement</title>
                    <style>
                        body { font-family: Times, serif; padding: 40px; line-height: 1.6; font-size: 11pt; }
                        h3 { text-align: center; margin-bottom: 30px; font-size: 11pt; font-weight: bold; }
                        h4 { margin-top: 25px; margin-bottom: 10px; font-size: 11pt; font-weight: bold; }
                        ul { margin-left: 20px; }
                        li { margin-bottom: 5px; font-size: 11pt; }
                        p { margin-bottom: 10px; font-size: 11pt; }
                        strong { font-size: 11pt; }
                    </style>
                </head>
                <body>${cleanContent}</body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Nondisclosure_Agreement.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = async () => {
        const textContent = previewContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        try {
            await navigator.clipboard.writeText(textContent);
            alert('NDA text copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
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
        const previewContainer = document.querySelector('.preview-content');
        const element = previewContainer.querySelector(`#${clauseId}`);
        if (element && previewContainer) {
            // Calculate position relative to the preview container
            const elementTop = element.offsetTop;
            const containerHeight = previewContainer.clientHeight;

            // Scroll to center the element
            previewContainer.scrollTo({
                top: elementTop - (containerHeight / 2),
                behavior: 'smooth'
            });

            // Add temporary highlighting (flash effect)
            element.classList.add('temp-highlight');
            setTimeout(() => element.classList.remove('temp-highlight'), 2000);
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
                    <div
                        className="preview-content"
                        dangerouslySetInnerHTML={{ __html: previewContent }}
                    />
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