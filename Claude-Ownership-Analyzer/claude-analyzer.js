const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

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
    const [systemUptime, setSystemUptime] = useState(0);

    const tabs = [
        { id: 'setup', label: 'Account Setup', icon: 'settings' },
        { id: 'usage', label: 'Usage Type', icon: 'file-text' },
        { id: 'compliance', label: 'Risk Factors', icon: 'shield' }
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
        if (progress >= 100) newAchievements.push('🏆 MASTER_ANALYZER');
        if (formData.accountType === 'commercial') newAchievements.push('💼 PRO_USER');
        if (formData.humanOversight === 'full') newAchievements.push('👁️ SAFETY_FIRST');
        if (formData.prohibitedContent.length === 0 && formData.aiDevelopment.length === 0) {
            newAchievements.push('✅ CLEAN_CONFIG');
        }
        if (currentTab === 2) newAchievements.push('🛡️ RISK_ASSESSED');
        
        setAchievements(newAchievements);
    }, [formData, currentTab]);

    // Real-time risk calculation with gamification
    useEffect(() => {
        const newRiskAnalysis = window.RiskAnalyzer.calculateRiskScore(formData);
        setRiskAnalysis(newRiskAnalysis);
    }, [formData]);

    // System uptime simulator for tech appeal
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemUptime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Generate detailed analysis for live gauge pane
    useEffect(() => {
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

            default:
                return null;
        }
    };

    // Render comprehensive gauge pane with analysis
    const renderGaugePane = () => {
        return (
            <div style={{ padding: '1rem', overflow: 'auto', height: '100%' }}>
                {/* Compact Gauge */}
                <CompactRiskGauge score={riskAnalysis.score} level={riskAnalysis.level} />
                
                {/* Risk Factors */}
                {riskAnalysis.factors.length > 0 && (
                    <div style={{
                        background: 'rgba(26, 31, 46, 0.5)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        border: '1px solid #2a3441'
                    }}>
                        <h4 style={{
                            fontFamily: 'Orbitron, monospace',
                            fontSize: '0.8rem',
                            color: '#00d4ff',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>Risk Factors</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {riskAnalysis.factors.slice(0, 3).map((factor, index) => (
                                <li key={index} style={{
                                    fontSize: '0.75rem',
                                    color: '#b4c1d3',
                                    marginBottom: '0.25rem',
                                    paddingLeft: '0.5rem',
                                    position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        left: 0,
                                        color: '#39ff14'
                                    }}>▸</span>
                                    {factor}
                                </li>
                            ))}
                            {riskAnalysis.factors.length > 3 && (
                                <li style={{
                                    fontSize: '0.75rem',
                                    color: '#8892a6',
                                    paddingLeft: '0.5rem'
                                }}>
                                    +{riskAnalysis.factors.length - 3} more factors
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Analysis Cards */}
                {detailedAnalysis && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '0.5rem'
                    }}>
                        {/* Ownership Rights */}
                        <div className={`result-card ${detailedAnalysis.ownership.status === 'allowed' ? 'low' : detailedAnalysis.ownership.status === 'requires-review' ? 'medium' : 'high'}`}>
                            <h4>
                                <Icon name="award" size={12} style={{ marginRight: '0.5rem' }} />
                                Ownership
                            </h4>
                            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>
                                <strong>{detailedAnalysis.ownership.title}</strong>
                            </p>
                            <span className={`status-indicator ${getStatusClass(detailedAnalysis.ownership.status)}`}>
                                {detailedAnalysis.ownership.status.replace('-', ' ')}
                            </span>
                        </div>

                        {/* Usage Compliance */}
                        <div className={`result-card ${detailedAnalysis.usage.status === 'allowed' ? 'low' : detailedAnalysis.usage.status === 'requires-review' ? 'medium' : 'high'}`}>
                            <h4>
                                <Icon name="check-circle" size={12} style={{ marginRight: '0.5rem' }} />
                                Compliance
                            </h4>
                            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>
                                <strong>{detailedAnalysis.usage.title}</strong>
                            </p>
                            <span className={`status-indicator ${getStatusClass(detailedAnalysis.usage.status)}`}>
                                {detailedAnalysis.usage.status.replace('-', ' ')}
                            </span>
                        </div>

                        {/* Disclosure Requirements */}
                        <div className={`result-card ${detailedAnalysis.disclosure.status === 'allowed' ? 'low' : detailedAnalysis.disclosure.status === 'requires-review' ? 'medium' : 'high'}`}>
                            <h4>
                                <Icon name="info" size={12} style={{ marginRight: '0.5rem' }} />
                                Disclosure
                            </h4>
                            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>
                                <strong>{detailedAnalysis.disclosure.title}</strong>
                            </p>
                            <span className={`status-indicator ${getStatusClass(detailedAnalysis.disclosure.status)}`}>
                                {detailedAnalysis.disclosure.status.replace('-', ' ')}
                            </span>
                        </div>

                        {/* Copyright Protection */}
                        <div className={`result-card ${detailedAnalysis.copyright.status === 'allowed' ? 'low' : detailedAnalysis.copyright.status === 'requires-review' ? 'medium' : 'high'}`}>
                            <h4>
                                <Icon name="shield" size={12} style={{ marginRight: '0.5rem' }} />
                                Copyright
                            </h4>
                            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>
                                <strong>{detailedAnalysis.copyright.title}</strong>
                            </p>
                            <span className={`status-indicator ${getStatusClass(detailedAnalysis.copyright.status)}`}>
                                {detailedAnalysis.copyright.status.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                )}

                {/* Consultation Button - Only when high risk or violations */}
                {(riskAnalysis.level === 'high' || riskAnalysis.score > 60) && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        textAlign: 'center',
                        background: 'rgba(26, 31, 46, 0.3)',
                        borderRadius: '8px',
                        border: '1px solid #2a3441'
                    }}>
                        <p style={{ 
                            marginBottom: '0.75rem', 
                            color: '#8892a6', 
                            fontSize: '0.8rem' 
                        }}>
                            Consider legal consultation for high-risk scenarios
                        </p>
                        <a 
                            href="" 
                            onClick={openCalendlyPopup}
                            className="consultation-btn"
                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                        >
                            <Icon name="calendar" size={14} />
                            Legal Consultation
                        </a>
                    </div>
                )}
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
                        
                        {/* System Uptime */}
                        <div style={{ 
                            fontFamily: 'Orbitron, monospace', 
                            fontSize: '0.65rem', 
                            color: '#8892a6',
                            textAlign: 'right'
                        }}>
                            <div>UPTIME: {Math.floor(systemUptime / 60)}:{(systemUptime % 60).toString().padStart(2, '0')}</div>
                            <div style={{ color: '#39ff14' }}>STATUS: ONLINE</div>
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
                                    title={achievement.split(' ')[1]?.replace('_', ' ')}
                                >
                                    {achievement.split(' ')[0]}
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

// Render the application
const root = createRoot(document.getElementById('root'));
root.render(<ClaudeOwnershipAnalyzer />);