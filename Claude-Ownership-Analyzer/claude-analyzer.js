const { useState, useEffect } = React;

const Icon = ({ name, size = 24, style = {} }) => {
    return <i data-feather={name} style={{ width: size, height: size, ...style }}></i>;
};

const ClaudeOwnershipAnalyzer = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [formData, setFormData] = useState({
        accountType: 'consumer',
        useCase: 'general',
        contentUse: 'internal',
        humanOversight: 'full',
        disclosurePlanned: false,
        requiresDisclosure: false,
        servesMinors: false,
        interactionType: 'no-interaction',
        prohibitedContent: [],
        aiDevelopment: [],
        confidentialityLevel: 'public'
    });
    const [riskAnalysis, setRiskAnalysis] = useState({
        score: 0,
        level: 'neutral',
        factors: []
    });
    const [detailedAnalysis, setDetailedAnalysis] = useState(null);
    const [completionProgress, setCompletionProgress] = useState(0);
    const [achievements, setAchievements] = useState([]);

    const tabs = [
        { id: 'setup', label: 'Account Setup', icon: 'settings' },
        { id: 'usage', label: 'Usage Type', icon: 'file-text' },
        { id: 'compliance', label: 'Risk Factors', icon: 'shield' },
        { id: 'scenarios', label: 'Scenarios', icon: 'zap' }
    ];

    // Predefined scenarios for educational gaming
    const gameScenarios = [
        {
            id: 'startup_blog',
            title: '🚀 Startup Blog Writer',
            description: 'You run a tech startup blog and want to use Claude for content creation',
            setup: {
                accountType: 'commercial',
                useCase: 'journalism',
                contentUse: 'public',
                humanOversight: 'substantial',
                disclosurePlanned: true,
                confidentialityLevel: 'public'
            },
            challenge: 'Balance efficiency with transparency requirements',
            expectedRisk: 'medium',
            learningPoints: 'Disclosure requirements, commercial benefits, content quality'
        },
        {
            id: 'legal_firm',
            title: '⚖️ Legal Document Assistant',
            description: 'Law firm wants to use Claude for contract review and legal research',
            setup: {
                accountType: 'commercial',
                useCase: 'legal',
                contentUse: 'internal',
                humanOversight: 'full',
                disclosurePlanned: false,
                confidentialityLevel: 'confidential'
            },
            challenge: 'Ensure compliance while maintaining attorney-client privilege',
            expectedRisk: 'high',
            learningPoints: 'Professional responsibility, confidentiality, human oversight requirements'
        },
        {
            id: 'student_helper',
            title: '🎓 Student Research Assistant',
            description: 'College student using Claude for academic research and writing',
            setup: {
                accountType: 'consumer',
                useCase: 'academic',
                contentUse: 'external',
                humanOversight: 'minimal',
                disclosurePlanned: false,
                confidentialityLevel: 'public'
            },
            challenge: 'Academic integrity vs efficiency',
            expectedRisk: 'high',
            learningPoints: 'Academic disclosure, plagiarism concerns, institutional policies'
        },
        {
            id: 'creative_agency',
            title: '🎨 Creative Agency',
            description: 'Digital agency using Claude for client marketing materials',
            setup: {
                accountType: 'commercial',
                useCase: 'creative',
                contentUse: 'commercial',
                humanOversight: 'substantial',
                disclosurePlanned: true,
                confidentialityLevel: 'internal'
            },
            challenge: 'Client expectations vs AI limitations',
            expectedRisk: 'low',
            learningPoints: 'Client disclosure, creative ownership, quality control'
        },
        {
            id: 'healthcare_admin',
            title: '🏥 Healthcare Administrator',
            description: 'Hospital admin using Claude for patient communication templates',
            setup: {
                accountType: 'commercial',
                useCase: 'healthcare',
                contentUse: 'external',
                humanOversight: 'full',
                disclosurePlanned: true,
                confidentialityLevel: 'personal'
            },
            challenge: 'HIPAA compliance and patient safety',
            expectedRisk: 'high',
            learningPoints: 'Healthcare regulations, patient privacy, professional liability'
        }
    ];

    // Gamification calculations
    useEffect(() => {
        // Calculate completion progress
        const totalFields = 11; // Total configurable fields
        let completedFields = 0;
        
        if (formData.accountType !== 'consumer') completedFields++;
        if (formData.useCase !== 'general') completedFields++;
        if (formData.contentUse !== 'internal') completedFields++;
        if (formData.humanOversight !== 'full') completedFields++;
        if (formData.disclosurePlanned) completedFields++;
        if (formData.servesMinors) completedFields++;
        if (formData.interactionType !== 'no-interaction') completedFields++;
        if (formData.prohibitedContent.length > 0) completedFields++;
        if (formData.aiDevelopment.length > 0) completedFields++;
        if (formData.confidentialityLevel !== 'public') completedFields++;
        completedFields += Math.min(currentTab + 1, 3); // Tab completion bonus
        
        const progress = Math.round((completedFields / totalFields) * 100);
        setCompletionProgress(progress);
        
        // Achievement system
        const newAchievements = [];
        if (progress >= 100) newAchievements.push({ icon: '🏆', label: 'MASTER_ANALYZER', points: 100 });
        if (formData.accountType === 'commercial') newAchievements.push({ icon: '💼', label: 'PRO_USER', points: 50 });
        if (formData.humanOversight === 'full') newAchievements.push({ icon: '👁️', label: 'SAFETY_FIRST', points: 75 });
        if (formData.prohibitedContent.length === 0 && formData.aiDevelopment.length === 0) {
            newAchievements.push({ icon: '✅', label: 'CLEAN_CONFIG', points: 60 });
        }
        if (currentTab === 2) newAchievements.push({ icon: '🛡️', label: 'RISK_ASSESSED', points: 40 });
        if (riskAnalysis.score <= 30) newAchievements.push({ icon: '🌟', label: 'LOW_RISK_HERO', points: 80 });
        
        setAchievements(newAchievements);
    }, [formData, currentTab, riskAnalysis.score]);

    // Real-time risk calculation with gamification
    useEffect(() => {
        if (window.RiskAnalyzer) {
            const newRiskAnalysis = window.RiskAnalyzer.calculateRiskScore(formData);
            setRiskAnalysis(newRiskAnalysis);
        }
    }, [formData]);


    // Generate detailed analysis for live gauge pane
    useEffect(() => {
        if (window.RiskAnalyzer) {
            const ownershipAnalysis = window.RiskAnalyzer.analyzeOwnership(formData);
            const usageAnalysis = window.RiskAnalyzer.analyzeUsage(formData);
            const disclosureAnalysis = window.RiskAnalyzer.analyzeDisclosure(formData);
            const copyrightAnalysis = window.RiskAnalyzer.analyzeCopyright(formData);
            const suggestions = window.RiskAnalyzer.generateSuggestions(formData, riskAnalysis);

            setDetailedAnalysis({
                ownership: ownershipAnalysis,
                usage: usageAnalysis,
                disclosure: disclosureAnalysis,
                copyright: copyrightAnalysis,
                suggestions
            });
            
            // Replace feather icons after each render
            setTimeout(() => feather.replace(), 0);
        }
    }, [formData, riskAnalysis]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            if (name === 'prohibitedContent' || name === 'aiDevelopment') {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked 
                        ? [...(prev[name] || []), value]
                        : (prev[name] || []).filter(item => item !== value)
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'low': return '#39ff14';
            case 'medium': return '#ffaa00';
            case 'high': return '#ff3344';
            default: return '#00d4ff';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'allowed': return 'allowed';
            case 'restricted': return 'restricted';
            case 'requires-review': return 'requires-review';
            default: return '';
        }
    };

    // Compact Risk Gauge Component
    const CompactRiskGauge = ({ score, level }) => {
        const circumference = 2 * Math.PI * 50; // smaller radius = 50
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (score / 100) * circumference;
        const color = getRiskColor(level);

        return (
            <div style={{ width: '140px', height: '140px', margin: '0 auto 1rem auto' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <svg style={{ 
                        width: '100%', 
                        height: '100%', 
                        transform: 'rotate(-135deg)',
                        filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.3))'
                    }} viewBox="0 0 120 120">
                        <defs>
                            <linearGradient id="compactGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={color} stopOpacity="1" />
                            </linearGradient>
                            <filter id="compactGlow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#2a3441"
                            strokeWidth="6"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke={`url(#compactGaugeGradient)`}
                            strokeWidth="6"
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: strokeDasharray,
                                strokeDashoffset: strokeDashoffset,
                                transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                filter: 'url(#compactGlow)'
                            }}
                        />
                    </svg>
                    <div style={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontFamily: 'Orbitron, monospace',
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: color,
                            lineHeight: 1,
                            textShadow: `0 0 10px ${color}`
                        }}>{score}%</div>
                        <div style={{
                            fontFamily: 'Orbitron, monospace',
                            fontSize: '0.6rem',
                            color: '#8892a6',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginTop: '0.25rem'
                        }}>Risk Level</div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <div style={{
                        fontFamily: 'Orbitron, monospace',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: color,
                        textShadow: `0 0 10px ${color}`
                    }}>
                        {level === 'neutral' ? 'Analyzing...' : `${level} RISK`}
                    </div>
                </div>
            </div>
        );
    };

    // Open Calendly popup
    const openCalendlyPopup = (e) => {
        e.preventDefault();
        if (window.Calendly) {
            window.Calendly.initPopupWidget({
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
            });
        } else {
            // Fallback if Calendly is not loaded
            window.open('https://terms.law/call/', '_blank');
        }
        return false;
    };

    // Apply a scenario to the form data
    const applyScenario = (scenario) => {
        setFormData(prev => ({
            ...prev,
            ...scenario.setup,
            prohibitedContent: [],
            aiDevelopment: []
        }));
        setCurrentTab(0); // Go back to setup to see the changes
    };

    const renderTabContent = () => {
        switch (currentTab) {
            case 0:
                return (
                    <div>
                        <div className="form-section">
                            <h3><Icon name="user" className="form-section-icon" />Account Configuration</h3>
                            <div className="form-group">
                                <label htmlFor="accountType">Claude Account Type</label>
                                <select 
                                    id="accountType" 
                                    name="accountType" 
                                    value={formData.accountType} 
                                    onChange={handleInputChange}
                                >
                                    <option value="consumer">Consumer (Claude.ai, Pro)</option>
                                    <option value="commercial">Commercial (API, Enterprise)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="briefcase" className="form-section-icon" />Primary Use Case</h3>
                            <div className="form-group">
                                <label htmlFor="useCase">What is your primary use case?</label>
                                <select 
                                    id="useCase" 
                                    name="useCase" 
                                    value={formData.useCase} 
                                    onChange={handleInputChange}
                                >
                                    <option value="general">General assistance</option>
                                    <option value="legal">Legal advice/documents</option>
                                    <option value="healthcare">Healthcare guidance</option>
                                    <option value="insurance">Insurance decisions</option>
                                    <option value="finance">Financial advice</option>
                                    <option value="employment">HR/Employment</option>
                                    <option value="academic">Academic/Testing</option>
                                    <option value="journalism">Media/Journalism</option>
                                    <option value="software">Software development</option>
                                    <option value="creative">Creative content</option>
                                    <option value="research">Research & analysis</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="lock" className="form-section-icon" />Input Data Classification</h3>
                            <div className="form-group">
                                <label htmlFor="confidentialityLevel">Data sensitivity level</label>
                                <select 
                                    id="confidentialityLevel" 
                                    name="confidentialityLevel" 
                                    value={formData.confidentialityLevel} 
                                    onChange={handleInputChange}
                                >
                                    <option value="public">Public information</option>
                                    <option value="internal">Internal business data</option>
                                    <option value="confidential">Confidential/proprietary</option>
                                    <option value="personal">Personal/sensitive data</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div>
                        <div className="form-section">
                            <h3><Icon name="globe" className="form-section-icon" />Output Distribution</h3>
                            <div className="form-group">
                                <label htmlFor="contentUse">How will you use Claude's outputs?</label>
                                <select 
                                    id="contentUse" 
                                    name="contentUse" 
                                    value={formData.contentUse} 
                                    onChange={handleInputChange}
                                >
                                    <option value="internal">Internal use only</option>
                                    <option value="external">External sharing</option>
                                    <option value="commercial">Commercial use</option>
                                    <option value="public">Public distribution</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="interactionType">User interaction model</label>
                                <select 
                                    id="interactionType" 
                                    name="interactionType" 
                                    value={formData.interactionType} 
                                    onChange={handleInputChange}
                                >
                                    <option value="no-interaction">Users see final outputs only</option>
                                    <option value="customer-facing">Direct Claude interaction</option>
                                    <option value="internal-tool">Internal team tool</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="eye" className="form-section-icon" />Quality Control</h3>
                            <div className="form-group">
                                <label htmlFor="humanOversight">Human review level</label>
                                <select 
                                    id="humanOversight" 
                                    name="humanOversight" 
                                    value={formData.humanOversight} 
                                    onChange={handleInputChange}
                                >
                                    <option value="full">Full professional review</option>
                                    <option value="substantial">Substantial editing</option>
                                    <option value="minimal">Basic review</option>
                                    <option value="none">No review planned</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="users" className="form-section-icon" />Disclosure Settings</h3>
                            <div className="checkbox-group">
                                <div className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        id="servesMinors" 
                                        name="servesMinors" 
                                        checked={formData.servesMinors} 
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="servesMinors">Service used by minors</label>
                                </div>
                                <div className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        id="disclosurePlanned" 
                                        name="disclosurePlanned" 
                                        checked={formData.disclosurePlanned} 
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="disclosurePlanned">AI involvement disclosed</label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <div className="form-section">
                            <h3><Icon name="alert-triangle" className="form-section-icon" />Prohibited Activities</h3>
                            <div className="checkbox-group">
                                {[
                                    { value: 'child-safety', label: 'Child safety concerns' },
                                    { value: 'critical-infrastructure', label: 'Critical infrastructure' },
                                    { value: 'violence-hate', label: 'Violence/hate content' },
                                    { value: 'privacy-identity', label: 'Privacy violations' },
                                    { value: 'illegal-weapons', label: 'Illegal weapons/goods' },
                                    { value: 'psychological-harm', label: 'Psychological harm' },
                                    { value: 'misinformation', label: 'Misinformation creation' },
                                    { value: 'political-campaigns', label: 'Political campaigns' },
                                    { value: 'law-enforcement', label: 'Law enforcement apps' },
                                    { value: 'fraudulent-practices', label: 'Fraudulent practices' },
                                    { value: 'platform-abuse', label: 'Platform abuse' },
                                    { value: 'sexually-explicit', label: 'Explicit content' }
                                ].map((item, index) => (
                                    <div key={index} className="checkbox-item">
                                        <input 
                                            type="checkbox" 
                                            id={`prohibited-${item.value}`}
                                            name="prohibitedContent" 
                                            value={item.value}
                                            checked={formData.prohibitedContent.includes(item.value)}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor={`prohibited-${item.value}`}>{item.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="cpu" className="form-section-icon" />AI Development Restrictions</h3>
                            <div className="checkbox-group">
                                {[
                                    { value: 'competing-ai', label: 'Competing AI development' },
                                    { value: 'model-training', label: 'Training other models' },
                                    { value: 'model-scraping', label: 'Automated scraping' },
                                    { value: 'reselling-outputs', label: 'Reselling outputs' }
                                ].map((item, index) => (
                                    <div key={index} className="checkbox-item">
                                        <input 
                                            type="checkbox" 
                                            id={`ai-dev-${item.value}`}
                                            name="aiDevelopment" 
                                            value={item.value}
                                            checked={formData.aiDevelopment.includes(item.value)}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor={`ai-dev-${item.value}`}>{item.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <div className="form-section">
                            <h3><Icon name="zap" className="form-section-icon" />Gaming Scenarios</h3>
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: '#8892a6', 
                                marginBottom: '1rem',
                                lineHeight: '1.4'
                            }}>
                                Test your knowledge with real-world scenarios! Click any scenario to automatically configure the analyzer and see how different use cases affect risk levels.
                            </p>
                            
                            <div style={{ 
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '0.75rem'
                            }}>
                                {gameScenarios.map((scenario, index) => (
                                    <div 
                                        key={scenario.id}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(26, 31, 46, 0.5)',
                                            borderRadius: '8px',
                                            border: '1px solid #2a3441',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            position: 'relative'
                                        }}
                                        className="scenario-card"
                                        onClick={() => applyScenario(scenario)}
                                        onMouseEnter={(e) => {
                                            e.target.style.borderColor = '#00d4ff';
                                            e.target.style.background = 'rgba(0, 212, 255, 0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.borderColor = '#2a3441';
                                            e.target.style.background = 'rgba(26, 31, 46, 0.5)';
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <h4 style={{
                                                fontFamily: 'Orbitron, monospace',
                                                fontSize: '0.9rem',
                                                color: '#00d4ff',
                                                margin: 0,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {scenario.title}
                                            </h4>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                background: scenario.expectedRisk === 'low' ? 'rgba(57, 255, 20, 0.2)' : 
                                                           scenario.expectedRisk === 'medium' ? 'rgba(255, 170, 0, 0.2)' : 'rgba(255, 51, 68, 0.2)',
                                                color: scenario.expectedRisk === 'low' ? '#39ff14' : 
                                                       scenario.expectedRisk === 'medium' ? '#ffaa00' : '#ff3344',
                                                textTransform: 'uppercase',
                                                fontFamily: 'Orbitron, monospace'
                                            }}>
                                                {scenario.expectedRisk} RISK
                                            </span>
                                        </div>
                                        
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: '#b4c1d3',
                                            marginBottom: '0.75rem',
                                            lineHeight: '1.4'
                                        }}>
                                            {scenario.description}
                                        </p>
                                        
                                        <div style={{
                                            padding: '0.5rem',
                                            background: 'rgba(0, 212, 255, 0.05)',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(0, 212, 255, 0.2)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                color: '#00d4ff',
                                                fontWeight: '600',
                                                marginBottom: '0.25rem'
                                            }}>
                                                💡 Challenge:
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#e1e8f0',
                                                lineHeight: '1.3'
                                            }}>
                                                {scenario.challenge}
                                            </div>
                                        </div>
                                        
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: '#8892a6',
                                            fontStyle: 'italic'
                                        }}>
                                            🎯 Learning Focus: {scenario.learningPoints}
                                        </div>
                                        
                                        {/* Click indicator */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '0.75rem',
                                            right: '0.75rem',
                                            fontSize: '0.6rem',
                                            color: '#39ff14',
                                            fontFamily: 'Orbitron, monospace',
                                            textTransform: 'uppercase',
                                            opacity: 0.7
                                        }}>
                                            Click to Apply →
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Render compact gauge pane without scrolling
    const renderGaugePane = () => {
        return (
            <div style={{ 
                padding: '0.75rem', 
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                gap: '0.75rem',
                overflow: 'hidden'
            }}>
                {/* Compact Gauge */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '120px', height: '120px', margin: '0 auto' }}>
                        <CompactRiskGauge score={riskAnalysis.score} level={riskAnalysis.level} />
                    </div>
                </div>
                
                {/* Compact Analysis Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    alignContent: 'start'
                }}>
                    {detailedAnalysis && [
                        { key: 'ownership', data: detailedAnalysis.ownership, icon: 'award' },
                        { key: 'usage', data: detailedAnalysis.usage, icon: 'check-circle' },
                        { key: 'disclosure', data: detailedAnalysis.disclosure, icon: 'info' },
                        { key: 'copyright', data: detailedAnalysis.copyright, icon: 'shield' }
                    ].map(({ key, data, icon }) => (
                        <div 
                            key={key}
                            style={{
                                padding: '0.5rem',
                                background: 'rgba(26, 31, 46, 0.6)',
                                borderRadius: '6px',
                                border: '1px solid #2a3441',
                                borderLeft: `3px solid ${data.status === 'allowed' ? '#39ff14' : data.status === 'requires-review' ? '#ffaa00' : '#ff3344'}`
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                marginBottom: '0.25rem'
                            }}>
                                <Icon name={icon} size={10} />
                                <span style={{
                                    fontFamily: 'Orbitron, monospace',
                                    fontSize: '0.65rem',
                                    color: '#00d4ff',
                                    textTransform: 'uppercase'
                                }}>
                                    {key}
                                </span>
                            </div>
                            <div style={{
                                fontSize: '0.6rem',
                                color: '#e1e8f0',
                                marginBottom: '0.25rem',
                                lineHeight: '1.2'
                            }}>
                                {data.title}
                            </div>
                            <span style={{
                                fontSize: '0.55rem',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '3px',
                                background: data.status === 'allowed' ? 'rgba(57, 255, 20, 0.2)' : 
                                           data.status === 'requires-review' ? 'rgba(255, 170, 0, 0.2)' : 'rgba(255, 51, 68, 0.2)',
                                color: data.status === 'allowed' ? '#39ff14' : 
                                       data.status === 'requires-review' ? '#ffaa00' : '#ff3344',
                                textTransform: 'uppercase',
                                fontFamily: 'Orbitron, monospace'
                            }}>
                                {data.status.replace('-', ' ')}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: Achievements and Actions */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {/* Achievement Badges */}
                    {achievements.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.25rem',
                            justifyContent: 'center'
                        }}>
                            {achievements.slice(0, 6).map((achievement, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        padding: '0.25rem 0.5rem',
                                        background: 'rgba(57, 255, 20, 0.1)',
                                        border: '1px solid #39ff14',
                                        borderRadius: '4px',
                                        fontSize: '0.6rem',
                                        fontFamily: 'Orbitron, monospace',
                                        color: '#39ff14'
                                    }}
                                    title={`${achievement.label.replace('_', ' ')} (+${achievement.points} pts)`}
                                >
                                    <span>{achievement.icon}</span>
                                    <span>{achievement.points}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center'
                    }}>
                        {(riskAnalysis.level === 'high' || riskAnalysis.score > 60) && (
                            <button
                                onClick={openCalendlyPopup}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    background: 'rgba(255, 51, 68, 0.15)',
                                    color: '#ff3344',
                                    border: '1px solid #ff3344',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    fontFamily: 'Orbitron, monospace',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}
                            >
                                ⚠ Get Help
                            </button>
                        )}
                        <button
                            onClick={() => {
                                // Reset form for new scenario
                                setFormData({
                                    accountType: 'consumer',
                                    useCase: 'general',
                                    contentUse: 'internal',
                                    humanOversight: 'full',
                                    disclosurePlanned: false,
                                    requiresDisclosure: false,
                                    servesMinors: false,
                                    interactionType: 'no-interaction',
                                    prohibitedContent: [],
                                    aiDevelopment: [],
                                    confidentialityLevel: 'public'
                                });
                                setCurrentTab(0);
                            }}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(0, 212, 255, 0.15)',
                                color: '#00d4ff',
                                border: '1px solid #00d4ff',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontFamily: 'Orbitron, monospace',
                                textTransform: 'uppercase',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 New Test
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="analyzer-container">
            <div className="header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h1>Claude Risk Analyzer</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Completion Progress */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                                fontFamily: 'Orbitron, monospace', 
                                fontSize: '0.7rem', 
                                color: '#8892a6',
                                textTransform: 'uppercase'
                            }}>
                                Progress
                            </span>
                            <div style={{ 
                                width: '60px', 
                                height: '6px', 
                                background: '#2a3441', 
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{ 
                                    width: `${completionProgress}%`, 
                                    height: '100%', 
                                    background: 'linear-gradient(90deg, #00d4ff, #39ff14)',
                                    borderRadius: '3px',
                                    transition: 'width 0.5s ease'
                                }} />
                            </div>
                            <span style={{ 
                                fontFamily: 'Orbitron, monospace', 
                                fontSize: '0.7rem', 
                                color: completionProgress >= 100 ? '#39ff14' : '#00d4ff',
                                fontWeight: 'bold'
                            }}>
                                {completionProgress}%
                            </span>
                        </div>
                        
                        {/* User Profile Stats */}
                        <div style={{ 
                            fontFamily: 'Orbitron, monospace', 
                            fontSize: '0.65rem', 
                            color: '#8892a6',
                            textAlign: 'right'
                        }}>
                            <div>SCENARIOS: {achievements.length}</div>
                            <div style={{ color: '#39ff14' }}>POINTS: {completionProgress}</div>
                        </div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>Advanced compliance scanner • Real-time risk assessment • Legal framework analysis</p>
                    
                    {/* Achievements Display */}
                    {achievements.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {achievements.slice(0, 3).map((achievement, index) => (
                                <span 
                                    key={index}
                                    style={{
                                        fontSize: '0.8rem',
                                        padding: '0.25rem 0.5rem',
                                        background: 'rgba(57, 255, 20, 0.1)',
                                        border: '1px solid #39ff14',
                                        borderRadius: '4px',
                                        color: '#39ff14',
                                        fontFamily: 'Orbitron, monospace',
                                        fontSize: '0.65rem',
                                        animation: 'pulse 2s infinite'
                                    }}
                                    title={achievement.label?.replace('_', ' ')}
                                >
                                    {achievement.icon}
                                </span>
                            ))}
                            {achievements.length > 3 && (
                                <span style={{
                                    fontSize: '0.65rem',
                                    color: '#8892a6',
                                    fontFamily: 'Orbitron, monospace'
                                }}>
                                    +{achievements.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${currentTab === index ? 'active' : ''}`}
                        onClick={() => setCurrentTab(index)}
                    >
                        <Icon name={tab.icon} size={14} style={{ marginRight: '0.5rem' }} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content - Split Pane */}
            <div className="main-content">
                {/* Input Pane */}
                <div className="input-pane">
                    {renderTabContent()}
                </div>

                {/* Live Analysis Pane */}
                <div className="gauge-pane">
                    {renderGaugePane()}
                </div>
            </div>
        </div>
    );
};

// Load Calendly widget
const loadCalendly = () => {
    if (!document.querySelector('link[href*="calendly"]')) {
        const link = document.createElement('link');
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.head.appendChild(script);
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadCalendly();
    setTimeout(() => feather.replace(), 0);
});

// Safe initialization with dependency checking
function initializeAnalyzer() {
    console.log('Initializing Claude Analyzer...');
    console.log('React available:', typeof React);
    console.log('ReactDOM available:', typeof ReactDOM);
    console.log('RiskAnalyzer available:', typeof window.RiskAnalyzer);
    console.log('Root element:', document.getElementById('root'));
    
    try {
        ReactDOM.render(<ClaudeOwnershipAnalyzer />, document.getElementById('root'));
        console.log('✅ Analyzer rendered successfully');
    } catch (error) {
        console.error('❌ Error rendering analyzer:', error);
        const root = document.getElementById('root');
        if (root) {
            root.innerHTML = `
                <div style="padding: 2rem; font-family: Arial, sans-serif;">
                    <h1 style="color: #ff3344;">Analyzer Error</h1>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p><strong>Stack:</strong> ${error.stack}</p>
                    <p>Please check the browser console for more details.</p>
                </div>
            `;
        }
    }
}

// Wait for all dependencies to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalyzer);
} else {
    // DOM already loaded
    setTimeout(initializeAnalyzer, 100);
}