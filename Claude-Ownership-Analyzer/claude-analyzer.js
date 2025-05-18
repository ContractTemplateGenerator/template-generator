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
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const tabs = [
        { id: 'setup', label: 'Account & Use Case', icon: 'settings' },
        { id: 'content', label: 'Content & Usage', icon: 'file-text' },
        { id: 'compliance', label: 'Compliance & Risk', icon: 'shield' },
        { id: 'results', label: 'Analysis Results', icon: 'check-circle' }
    ];

    useEffect(() => {
        if (currentTab === 3) {
            analyzeRights();
        }
        // Replace feather icons after each render
        setTimeout(() => feather.replace(), 0);
    }, [currentTab, formData]);

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

    const analyzeRights = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const riskScore = window.RiskAnalyzer.calculateRiskScore(formData);
            const ownershipAnalysis = window.RiskAnalyzer.analyzeOwnership(formData);
            const usageAnalysis = window.RiskAnalyzer.analyzeUsage(formData);
            const disclosureAnalysis = window.RiskAnalyzer.analyzeDisclosure(formData);
            const copyrightAnalysis = window.RiskAnalyzer.analyzeCopyright(formData);
            const suggestions = window.RiskAnalyzer.generateSuggestions(formData, riskScore);

            setAnalysis({
                riskScore,
                ownership: ownershipAnalysis,
                usage: usageAnalysis,
                disclosure: disclosureAnalysis,
                copyright: copyrightAnalysis,
                suggestions
            });
            setIsAnalyzing(false);
        }, 1000);
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'low': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'high': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'allowed': return 'allowed';
            case 'restricted': return 'restricted';
            case 'requires-review': return 'requires-review';
            default: return '';
        }
    };

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

    const renderTabContent = () => {
        switch (currentTab) {
            case 0:
                return (
                    <div>
                        <div className="form-section">
                            <h3><Icon name="user" className="form-section-icon" />Account Information</h3>
                            <div className="form-group">
                                <label htmlFor="accountType">What type of Claude account do you have?</label>
                                <select 
                                    id="accountType" 
                                    name="accountType" 
                                    value={formData.accountType} 
                                    onChange={handleInputChange}
                                >
                                    <option value="consumer">Consumer (Claude.ai, Claude Pro)</option>
                                    <option value="commercial">Commercial (API, Enterprise)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="briefcase" className="form-section-icon" />Primary Use Case</h3>
                            <div className="form-group">
                                <label htmlFor="useCase">What is your primary use case for Claude?</label>
                                <select 
                                    id="useCase" 
                                    name="useCase" 
                                    value={formData.useCase} 
                                    onChange={handleInputChange}
                                >
                                    <option value="general">General assistance/productivity</option>
                                    <option value="legal">Legal advice or document drafting</option>
                                    <option value="healthcare">Healthcare or medical guidance</option>
                                    <option value="insurance">Insurance decisions or underwriting</option>
                                    <option value="finance">Financial advice or decisions</option>
                                    <option value="employment">Employment or hiring decisions</option>
                                    <option value="academic">Academic testing or evaluation</option>
                                    <option value="journalism">Media or journalistic content</option>
                                    <option value="software">Software development</option>
                                    <option value="creative">Creative writing or content</option>
                                    <option value="research">Research and analysis</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="globe" className="form-section-icon" />Content Distribution</h3>
                            <div className="form-group">
                                <label htmlFor="contentUse">How do you plan to use Claude's outputs?</label>
                                <select 
                                    id="contentUse" 
                                    name="contentUse" 
                                    value={formData.contentUse} 
                                    onChange={handleInputChange}
                                >
                                    <option value="internal">Internal use only</option>
                                    <option value="external">External sharing (non-commercial)</option>
                                    <option value="commercial">Commercial use/monetization</option>
                                    <option value="public">Public distribution/publishing</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="interactionType">Will users interact directly with Claude or only see outputs?</label>
                                <select 
                                    id="interactionType" 
                                    name="interactionType" 
                                    value={formData.interactionType} 
                                    onChange={handleInputChange}
                                >
                                    <option value="no-interaction">Users only see final outputs</option>
                                    <option value="customer-facing">Users interact directly with Claude</option>
                                    <option value="internal-tool">Internal team uses Claude as tool</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div>
                        <div className="form-section">
                            <h3><Icon name="eye" className="form-section-icon" />Human Oversight</h3>
                            <div className="form-group">
                                <label htmlFor="humanOversight">What level of human review will Claude's outputs receive?</label>
                                <select 
                                    id="humanOversight" 
                                    name="humanOversight" 
                                    value={formData.humanOversight} 
                                    onChange={handleInputChange}
                                >
                                    <option value="full">Full review by qualified professional</option>
                                    <option value="substantial">Substantial editing and verification</option>
                                    <option value="minimal">Basic review for accuracy/quality</option>
                                    <option value="none">No human review planned</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="lock" className="form-section-icon" />Confidentiality Level</h3>
                            <div className="form-group">
                                <label htmlFor="confidentialityLevel">What type of information will you input to Claude?</label>
                                <select 
                                    id="confidentialityLevel" 
                                    name="confidentialityLevel" 
                                    value={formData.confidentialityLevel} 
                                    onChange={handleInputChange}
                                >
                                    <option value="public">Public or general information</option>
                                    <option value="internal">Internal business information</option>
                                    <option value="confidential">Confidential/proprietary data</option>
                                    <option value="personal">Personal or sensitive data</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Icon name="users" className="form-section-icon" />Target Audience</h3>
                            <div className="checkbox-group">
                                <div className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        id="servesMinors" 
                                        name="servesMinors" 
                                        checked={formData.servesMinors} 
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="servesMinors">Your service will be used by minors (under 18)</label>
                                </div>
                                <div className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        id="requiresDisclosure" 
                                        name="requiresDisclosure" 
                                        checked={formData.requiresDisclosure} 
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="requiresDisclosure">Users need to know AI is involved</label>
                                </div>
                                <div className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        id="disclosurePlanned" 
                                        name="disclosurePlanned" 
                                        checked={formData.disclosurePlanned} 
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="disclosurePlanned">You plan to disclose AI involvement</label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <div className="form-section">
                            <h3><Icon name="alert-triangle" className="form-section-icon" />Prohibited Content Check</h3>
                            <p className="form-section-description">
                                Select any activities that might apply to your use case. These are prohibited under Claude's Usage Policy:
                            </p>
                            <div className="checkbox-group">
                                {[
                                    { value: 'child-safety', label: 'Content affecting children\'s safety' },
                                    { value: 'critical-infrastructure', label: 'Critical infrastructure access' },
                                    { value: 'violence-hate', label: 'Violence or hateful content' },
                                    { value: 'privacy-identity', label: 'Privacy/identity compromise' },
                                    { value: 'illegal-weapons', label: 'Illegal weapons or goods' },
                                    { value: 'psychological-harm', label: 'Psychologically harmful content' },
                                    { value: 'misinformation', label: 'Misinformation creation' },
                                    { value: 'political-campaigns', label: 'Political campaigns or lobbying' },
                                    { value: 'law-enforcement', label: 'Law enforcement applications' },
                                    { value: 'fraudulent-practices', label: 'Fraudulent or predatory practices' },
                                    { value: 'platform-abuse', label: 'Platform abuse or circumvention' },
                                    { value: 'sexually-explicit', label: 'Sexually explicit content' }
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
                            <p className="form-section-description">
                                Select any AI-related development activities that apply:
                            </p>
                            <div className="checkbox-group">
                                {[
                                    { value: 'competing-ai', label: 'Developing competing AI services' },
                                    { value: 'model-training', label: 'Training other AI models with outputs' },
                                    { value: 'model-scraping', label: 'Automated scraping of outputs' },
                                    { value: 'reselling-outputs', label: 'Reselling outputs as standalone products' }
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
                    <div className="results-container">
                        {isAnalyzing ? (
                            <div className="loading">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : analysis ? (
                            <div className="pulse">
                                {/* Risk Score Section */}
                                <div className="risk-score-section" style={{ background: `linear-gradient(135deg, ${getRiskColor(analysis.riskScore.level)} 0%, ${getRiskColor(analysis.riskScore.level)}80 100%)` }}>
                                    <div className="risk-score">{analysis.riskScore.score}%</div>
                                    <div className="risk-level">
                                        {analysis.riskScore.level.toUpperCase()} RISK
                                    </div>
                                    <div className="risk-description">
                                        Based on your inputs, here's your compliance risk assessment and legal analysis.
                                    </div>
                                </div>

                                {/* Analysis Cards Grid */}
                                <div className="analysis-grid">
                                    {/* Ownership Rights Card */}
                                    <div className={`analysis-card risk-${analysis.ownership.status === 'allowed' ? 'low' : analysis.ownership.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <div className="card-header">
                                            <div className="card-title">
                                                <Icon name="award" className="card-icon" />
                                                Ownership Rights
                                            </div>
                                            <span className={`status-badge ${getStatusBadgeClass(analysis.ownership.status)}`}>
                                                {analysis.ownership.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <div className="card-content">
                                            <p><strong>{analysis.ownership.title}</strong></p>
                                            <p>{analysis.ownership.description}</p>
                                            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                                {analysis.ownership.details.map((detail, index) => (
                                                    <li key={index}>{detail}</li>
                                                ))}
                                            </ul>
                                            <div className="terms-reference">
                                                <strong>Terms Reference:</strong> {analysis.ownership.termsRef}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Usage Compliance Card */}
                                    <div className={`analysis-card risk-${analysis.usage.status === 'allowed' ? 'low' : analysis.usage.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <div className="card-header">
                                            <div className="card-title">
                                                <Icon name="check-circle" className="card-icon" />
                                                Usage Compliance
                                            </div>
                                            <span className={`status-badge ${getStatusBadgeClass(analysis.usage.status)}`}>
                                                {analysis.usage.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <div className="card-content">
                                            <p><strong>{analysis.usage.title}</strong></p>
                                            <p>{analysis.usage.description}</p>
                                            {analysis.usage.details.length > 0 && (
                                                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                                    {analysis.usage.details.map((detail, index) => (
                                                        <li key={index}>{detail}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {analysis.usage.violations && analysis.usage.violations.length > 0 && (
                                                <div style={{ marginTop: '1rem' }}>
                                                    <strong style={{ color: '#ef4444' }}>Violations Detected:</strong>
                                                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                                                        {analysis.usage.violations.map((violation, index) => (
                                                            <li key={index} style={{ color: '#dc2626' }}>{violation}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="terms-reference">
                                                <strong>Terms Reference:</strong> {analysis.usage.termsRef}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Disclosure Requirements Card */}
                                    <div className={`analysis-card risk-${analysis.disclosure.status === 'allowed' ? 'low' : analysis.disclosure.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <div className="card-header">
                                            <div className="card-title">
                                                <Icon name="info" className="card-icon" />
                                                Disclosure Requirements
                                            </div>
                                            <span className={`status-badge ${getStatusBadgeClass(analysis.disclosure.status)}`}>
                                                {analysis.disclosure.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <div className="card-content">
                                            <p><strong>{analysis.disclosure.title}</strong></p>
                                            <p>{analysis.disclosure.description}</p>
                                            {analysis.disclosure.details.length > 0 && (
                                                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                                    {analysis.disclosure.details.map((detail, index) => (
                                                        <li key={index}>{detail}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            <div className="terms-reference">
                                                <strong>Terms Reference:</strong> {analysis.disclosure.termsRef}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Copyright Protection Card */}
                                    <div className={`analysis-card risk-${analysis.copyright.status === 'allowed' ? 'low' : analysis.copyright.status === 'requires-review' ? 'medium' : 'high'}`}>
                                        <div className="card-header">
                                            <div className="card-title">
                                                <Icon name="shield" className="card-icon" />
                                                Copyright Protection
                                            </div>
                                            <span className={`status-badge ${getStatusBadgeClass(analysis.copyright.status)}`}>
                                                {analysis.copyright.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <div className="card-content">
                                            <p><strong>{analysis.copyright.title}</strong></p>
                                            <p>{analysis.copyright.description}</p>
                                            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                                {analysis.copyright.details.map((detail, index) => (
                                                    <li key={index}>{detail}</li>
                                                ))}
                                            </ul>
                                            <div className="terms-reference">
                                                <strong>Terms Reference:</strong> {analysis.copyright.termsRef}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Factors */}
                                {analysis.riskScore.factors.length > 0 && (
                                    <div className="analysis-card" style={{ marginBottom: '2rem' }}>
                                        <div className="card-header">
                                            <div className="card-title">
                                                <Icon name="alert-triangle" className="card-icon" />
                                                Risk Factors Identified
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <ul style={{ paddingLeft: '1.5rem' }}>
                                                {analysis.riskScore.factors.map((factor, index) => (
                                                    <li key={index} style={{ marginBottom: '0.5rem' }}>{factor}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Suggestions Section */}
                                {analysis.suggestions.length > 0 && (
                                    <div className="suggestions-section">
                                        <h3 className="suggestions-title">
                                            <Icon name="lightbulb" />
                                            Personalized Recommendations
                                        </h3>
                                        {analysis.suggestions.map((suggestion, index) => (
                                            <div key={index} className="suggestion-item" style={{ borderLeftColor: suggestion.priority === 'high' ? '#ef4444' : suggestion.priority === 'medium' ? '#f59e0b' : '#3b82f6' }}>
                                                <div className="suggestion-title">{suggestion.title}</div>
                                                <div className="suggestion-description">{suggestion.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Consultation CTA */}
                                <div className="consultation-cta">
                                    <h3>Need Personalized Legal Guidance?</h3>
                                    <p>Get expert advice tailored to your specific Claude usage scenario.</p>
                                    <a 
                                        href="https://terms.law/call/" 
                                        target="_blank" 
                                        className="consultation-btn"
                                    >
                                        <Icon name="calendar" />
                                        Schedule Consultation
                                    </a>
                                </div>
                            </div>
                        ) : null}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="analyzer-container">
            <div className="header">
                <h1>Claude Ownership Rights Analyzer</h1>
                <p>Analyze your Claude usage scenario against Terms of Service requirements and get personalized compliance recommendations.</p>
            </div>

            {/* Progress Indicator */}
            <div className="progress-indicator">
                <Icon name="activity" size={16} />
                <span>Step {currentTab + 1} of {tabs.length}</span>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${((currentTab + 1) / tabs.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${currentTab === index ? 'active' : ''}`}
                        onClick={() => setCurrentTab(index)}
                        disabled={index > currentTab && currentTab < 3}
                    >
                        <Icon name={tab.icon} size={18} style={{ marginRight: '0.5rem' }} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {renderTabContent()}
                
                {/* Navigation Buttons */}
                {currentTab < 3 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        <button
                            onClick={prevTab}
                            disabled={currentTab === 0}
                            style={{
                                padding: '0.75rem 1.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                background: currentTab === 0 ? '#f9fafb' : 'white',
                                cursor: currentTab === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Icon name="chevron-left" size={16} />
                            Previous
                        </button>
                        
                        <button
                            onClick={nextTab}
                            style={{
                                padding: '0.75rem 1.5rem',
                                border: 'none',
                                borderRadius: '8px',
                                background: '#3b82f6',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: '600'
                            }}
                        >
                            {currentTab === 2 ? 'Analyze' : 'Next'}
                            <Icon name={currentTab === 2 ? 'zap' : 'chevron-right'} size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Render the application
const root = createRoot(document.getElementById('root'));
root.render(<ClaudeOwnershipAnalyzer />);