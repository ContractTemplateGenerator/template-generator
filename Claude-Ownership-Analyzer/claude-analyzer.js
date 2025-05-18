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

    const tabs = [
        { id: 'setup', label: 'Account Setup', icon: 'settings' },
        { id: 'usage', label: 'Usage Type', icon: 'file-text' },
        { id: 'compliance', label: 'Risk Factors', icon: 'shield' },
        { id: 'results', label: 'Analysis', icon: 'check-circle' }
    ];

    // Real-time risk calculation
    useEffect(() => {
        const newRiskAnalysis = window.RiskAnalyzer.calculateRiskScore(formData);
        setRiskAnalysis(newRiskAnalysis);
    }, [formData]);

    // Generate detailed analysis for results tab
    useEffect(() => {
        if (currentTab === 3) {
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
        }
        // Replace feather icons after each render
        setTimeout(() => feather.replace(), 0);
    }, [currentTab, formData, riskAnalysis]);

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

    // Advanced Risk Gauge Component
    const AdvancedRiskGauge = ({ score, level }) => {
        const circumference = 2 * Math.PI * 70; // radius = 70
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (score / 100) * circumference;
        const color = getRiskColor(level);

        return (
            <div className="risk-gauge-container">
                <div className="risk-gauge">
                    <div className="gauge-background"></div>
                    <svg className="gauge-svg" viewBox="0 0 160 160">
                        <defs>
                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={color} stopOpacity="1" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            className="gauge-track"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            className="gauge-fill"
                            style={{
                                stroke: `url(#gaugeGradient)`,
                                strokeDasharray: strokeDasharray,
                                strokeDashoffset: strokeDashoffset,
                            }}
                        />
                    </svg>
                    <div className="gauge-center">
                        <div className="gauge-score" style={{ color }}>{score}%</div>
                        <div className="gauge-label">Risk Level</div>
                    </div>
                </div>
                <div className="risk-level-display">
                    <div className={`risk-level-label ${level}`}>
                        {level === 'neutral' ? 'Analyzing...' : `${level.toUpperCase()} RISK`}
                    </div>
                </div>
                
                {riskAnalysis.factors.length > 0 && (
                    <div className="risk-factors-list">
                        <h4>Risk Factors</h4>
                        <ul>
                            {riskAnalysis.factors.slice(0, 3).map((factor, index) => (
                                <li key={index}>{factor}</li>
                            ))}
                            {riskAnalysis.factors.length > 3 && (
                                <li>+{riskAnalysis.factors.length - 3} more factors</li>
                            )}
                        </ul>
                    </div>
                )}
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

            case 3:
                return (
                    <div>
                        {detailedAnalysis ? (
                            <div>
                                <div className="results-grid">
                                    <div className={`result-card ${detailedAnalysis.ownership.status === 'allowed' ? 'low' : detailedAnalysis.ownership.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <h4>
                                            <Icon name="award" size={14} style={{ marginRight: '0.5rem' }} />
                                            Ownership Rights
                                        </h4>
                                        <p><strong>{detailedAnalysis.ownership.title}</strong></p>
                                        <p>{detailedAnalysis.ownership.description}</p>
                                        <span className={`status-indicator ${getStatusClass(detailedAnalysis.ownership.status)}`}>
                                            {detailedAnalysis.ownership.status.replace('-', ' ')}
                                        </span>
                                    </div>

                                    <div className={`result-card ${detailedAnalysis.usage.status === 'allowed' ? 'low' : detailedAnalysis.usage.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <h4>
                                            <Icon name="check-circle" size={14} style={{ marginRight: '0.5rem' }} />
                                            Usage Compliance
                                        </h4>
                                        <p><strong>{detailedAnalysis.usage.title}</strong></p>
                                        <p>{detailedAnalysis.usage.description}</p>
                                        <span className={`status-indicator ${getStatusClass(detailedAnalysis.usage.status)}`}>
                                            {detailedAnalysis.usage.status.replace('-', ' ')}
                                        </span>
                                    </div>

                                    <div className={`result-card ${detailedAnalysis.disclosure.status === 'allowed' ? 'low' : detailedAnalysis.disclosure.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <h4>
                                            <Icon name="info" size={14} style={{ marginRight: '0.5rem' }} />
                                            Disclosure Requirements
                                        </h4>
                                        <p><strong>{detailedAnalysis.disclosure.title}</strong></p>
                                        <p>{detailedAnalysis.disclosure.description}</p>
                                        <span className={`status-indicator ${getStatusClass(detailedAnalysis.disclosure.status)}`}>
                                            {detailedAnalysis.disclosure.status.replace('-', ' ')}
                                        </span>
                                    </div>

                                    <div className={`result-card ${detailedAnalysis.copyright.status === 'allowed' ? 'low' : detailedAnalysis.copyright.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <h4>
                                            <Icon name="shield" size={14} style={{ marginRight: '0.5rem' }} />
                                            Copyright Protection
                                        </h4>
                                        <p><strong>{detailedAnalysis.copyright.title}</strong></p>
                                        <p>{detailedAnalysis.copyright.description}</p>
                                        <span className={`status-indicator ${getStatusClass(detailedAnalysis.copyright.status)}`}>
                                            {detailedAnalysis.copyright.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Consultation Section - Only in Results Tab */}
                                <div className="consultation-section">
                                    <p style={{ marginBottom: '1rem', color: '#8892a6', fontSize: '0.85rem' }}>
                                        Need personalized legal guidance for your specific use case?
                                    </p>
                                    <a 
                                        href="" 
                                        onClick={openCalendlyPopup}
                                        className="consultation-btn"
                                    >
                                        <Icon name="calendar" size={16} />
                                        Schedule Legal Consultation
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="loading">
                                <div className="loading-spinner"></div>
                                <div className="loading-text">Analyzing compliance...</div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="analyzer-container">
            <div className="header">
                <h1>Claude Risk Analyzer</h1>
                <p>Real-time compliance monitoring for Claude usage scenarios</p>
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

                {/* Live Risk Gauge Pane */}
                <div className="gauge-pane">
                    <AdvancedRiskGauge score={riskAnalysis.score} level={riskAnalysis.level} />
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