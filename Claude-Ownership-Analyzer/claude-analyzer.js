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
        confidentialityLevel: 'public',
        prohibitedContent: [],
        aiDevelopment: []
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
        { id: 'scenarios', label: 'Scenarios', icon: 'zap' },
        { id: 'setup', label: 'Account Setup', icon: 'settings' }
    ];

    // Predefined scenarios - focused on risk-relevant use cases
    const riskScenarios = [
        {
            id: 'development',
            title: '💻 Development',
            description: 'Software development with AI assistance',
            expectedRisk: 'medium',
            riskFactors: ['AI development restrictions', 'Code ownership', 'Commercial licensing']
        },
        {
            id: 'legal_services',
            title: '⚖️ Legal Services',
            description: 'Legal document assistance and research',
            expectedRisk: 'high',
            riskFactors: ['Professional responsibility', 'Confidentiality', 'Attorney oversight']
        },
        {
            id: 'content_creation',
            title: '✍️ Content Creation',
            description: 'Blog writing and marketing materials',
            expectedRisk: 'medium',
            riskFactors: ['Disclosure requirements', 'Content ownership', 'Quality control']
        },
        {
            id: 'healthcare',
            title: '🏥 Healthcare',
            description: 'Patient communications and medical content',
            expectedRisk: 'high',
            riskFactors: ['HIPAA compliance', 'Patient safety', 'Medical liability']
        },
        {
            id: 'education',
            title: '🎓 Education',
            description: 'Academic research and assignments',
            expectedRisk: 'high',
            riskFactors: ['Academic integrity', 'Institution policies', 'Plagiarism concerns']
        },
        {
            id: 'finance',
            title: '💰 Finance',
            description: 'Financial advice and investment guidance',
            expectedRisk: 'high',
            riskFactors: ['Financial regulations', 'Investment advice liability', 'Client disclosure']
        }
    ];

    const [selectedScenario, setSelectedScenario] = useState(null);
    const [showCustomization, setShowCustomization] = useState(false);
    const [customizationData, setCustomizationData] = useState({
        accountType: 'consumer',
        useCase: 'general',
        contentUse: 'internal',
        humanOversight: 'full',
        disclosurePlanned: false,
        confidentialityLevel: 'public',
        prohibitedContent: [],
        aiDevelopment: []
    });

    // Gamification calculations
    useEffect(() => {
        // Calculate completion progress
        const totalFields = 8;
        let completedFields = 0;
        
        if (formData.accountType !== 'consumer') completedFields++;
        if (formData.useCase !== 'general') completedFields++;
        if (formData.contentUse !== 'internal') completedFields++;
        if (formData.humanOversight !== 'full') completedFields++;
        if (formData.disclosurePlanned) completedFields++;
        if (formData.confidentialityLevel !== 'public') completedFields++;
        if (formData.prohibitedContent.length > 0) completedFields++;
        if (formData.aiDevelopment.length > 0) completedFields++;
        
        const progress = Math.round((completedFields / totalFields) * 100);
        setCompletionProgress(progress);

        // Calculate risk analysis
        calculateRiskAnalysis();
        
        // Update achievements based on progress
        const newAchievements = [];
        if (progress >= 25) newAchievements.push({ icon: '🚀', label: 'Getting Started' });
        if (progress >= 50) newAchievements.push({ icon: '⚡', label: 'Half Way There' });
        if (progress >= 75) newAchievements.push({ icon: '🎯', label: 'Almost Complete' });
        if (progress >= 100) newAchievements.push({ icon: '🏆', label: 'Configuration Master' });
        
        setAchievements(newAchievements);
    }, [formData]);

    const calculateRiskAnalysis = () => {
        let score = 50; // Base score
        const factors = [];

        // Account type factors
        if (formData.accountType === 'consumer') {
            score += 10;
            factors.push('Consumer account has additional content restrictions');
        }

        // Use case factors
        const highRiskUseCases = ['legal', 'healthcare', 'finance', 'academic'];
        if (highRiskUseCases.includes(formData.useCase)) {
            score += 20;
            factors.push(`${formData.useCase} use case requires special compliance considerations`);
        }

        // Content use factors
        if (formData.contentUse === 'public' || formData.contentUse === 'commercial') {
            score += 15;
            factors.push('Public/commercial use increases liability exposure');
        }

        // Human oversight factors
        if (formData.humanOversight === 'minimal' || formData.humanOversight === 'none') {
            score += 15;
            factors.push('Limited human oversight increases risk of compliance issues');
        }

        // Disclosure factors
        if (!formData.disclosurePlanned && formData.contentUse !== 'internal') {
            score += 10;
            factors.push('No AI disclosure planned for external content');
        }

        // Data sensitivity factors
        if (formData.confidentialityLevel === 'personal' || formData.confidentialityLevel === 'confidential') {
            score += 10;
            factors.push('Sensitive data handling requires additional safeguards');
        }

        // Prohibited content factors
        if (formData.prohibitedContent.length > 0) {
            score += formData.prohibitedContent.length * 5;
            factors.push(`${formData.prohibitedContent.length} prohibited activity areas selected`);
        }

        // AI development factors
        if (formData.aiDevelopment.length > 0) {
            score += formData.aiDevelopment.length * 10;
            factors.push(`${formData.aiDevelopment.length} AI development restrictions apply`);
        }

        // Determine risk level
        let level = 'low';
        if (score >= 60) level = 'medium';
        if (score >= 80) level = 'high';

        setRiskAnalysis({ score: Math.min(score, 100), level, factors });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            if (name === 'prohibitedContent' || name === 'aiDevelopment') {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked 
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
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

    // Apply customized scenario
    const applyCustomizedScenario = () => {
        setFormData(prev => ({
            ...prev,
            ...customizationData
        }));
        setShowCustomization(false);
        setCurrentTab(1); // Go to Account Setup to see results
    };

    // Handle customization form changes
    const handleCustomizationChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            if (name === 'prohibitedContent' || name === 'aiDevelopment') {
                setCustomizationData(prev => ({
                    ...prev,
                    [name]: checked 
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
                }));
            } else {
                setCustomizationData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else {
            setCustomizationData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const renderTabContent = () => {
        switch (currentTab) {
            case 0:
                return (
                    <div className="scenarios-container">
                        <div className="form-section">
                            <h3><Icon name="zap" className="form-section-icon" />Risk Analysis Scenarios</h3>
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: '#8892a6', 
                                marginBottom: '1.5rem',
                                lineHeight: '1.4'
                            }}>
                                Select your use case scenario and customize the risk factors that matter most for your specific situation.
                            </p>
                            
                            {showCustomization ? (
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(0, 212, 255, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0, 212, 255, 0.3)',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h4 style={{
                                            fontFamily: 'Orbitron, monospace',
                                            color: '#00d4ff',
                                            margin: 0,
                                            textTransform: 'uppercase',
                                            fontSize: '0.9rem'
                                        }}>🛠️ Customize: {selectedScenario?.title}</h4>
                                        <button 
                                            onClick={() => setShowCustomization(false)}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid #3a4553',
                                                color: '#e1e8f0',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            ← Back
                                        </button>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {/* Account Type */}
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: '#e1e8f0', marginBottom: '0.5rem', display: 'block' }}>Account Type:</label>
                                            <select 
                                                name="accountType"
                                                value={customizationData.accountType}
                                                onChange={handleCustomizationChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: 'rgba(26, 31, 46, 0.8)',
                                                    border: '1px solid #2a3441',
                                                    borderRadius: '6px',
                                                    color: '#e1e8f0',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                <option value="consumer">Consumer (Claude.ai Pro)</option>
                                                <option value="commercial">Commercial (API, Enterprise)</option>
                                            </select>
                                        </div>
                                        
                                        {/* Use Case */}
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: '#e1e8f0', marginBottom: '0.5rem', display: 'block' }}>Primary Use Case:</label>
                                            <select 
                                                name="useCase"
                                                value={customizationData.useCase}
                                                onChange={handleCustomizationChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: 'rgba(26, 31, 46, 0.8)',
                                                    border: '1px solid #2a3441',
                                                    borderRadius: '6px',
                                                    color: '#e1e8f0',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                <option value="general">General assistance</option>
                                                <option value="legal">Legal advice/documents</option>
                                                <option value="healthcare">Healthcare guidance</option>
                                                <option value="finance">Financial advice</option>
                                                <option value="academic">Academic/Testing</option>
                                                <option value="journalism">Media/Journalism</option>
                                                <option value="software">Software development</option>
                                                <option value="creative">Creative content</option>
                                                <option value="gaming">Gaming content</option>
                                                <option value="saas">SaaS development</option>
                                                <option value="ai">AI development</option>
                                            </select>
                                        </div>
                                        
                                        {/* Content Use */}
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: '#e1e8f0', marginBottom: '0.5rem', display: 'block' }}>Output Usage:</label>
                                            <select 
                                                name="contentUse"
                                                value={customizationData.contentUse}
                                                onChange={handleCustomizationChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: 'rgba(26, 31, 46, 0.8)',
                                                    border: '1px solid #2a3441',
                                                    borderRadius: '6px',
                                                    color: '#e1e8f0',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                <option value="internal">Internal use only</option>
                                                <option value="external">External sharing</option>
                                                <option value="commercial">Commercial use</option>
                                                <option value="public">Public distribution</option>
                                            </select>
                                        </div>
                                        
                                        {/* Human Oversight */}
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: '#e1e8f0', marginBottom: '0.5rem', display: 'block' }}>Human Oversight:</label>
                                            <select 
                                                name="humanOversight"
                                                value={customizationData.humanOversight}
                                                onChange={handleCustomizationChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: 'rgba(26, 31, 46, 0.8)',
                                                    border: '1px solid #2a3441',
                                                    borderRadius: '6px',
                                                    color: '#e1e8f0',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                <option value="full">Full professional review</option>
                                                <option value="substantial">Substantial editing</option>
                                                <option value="minimal">Basic review</option>
                                                <option value="none">No review planned</option>
                                            </select>
                                        </div>
                                        
                                        {/* Confidentiality Level */}
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: '#e1e8f0', marginBottom: '0.5rem', display: 'block' }}>Data Sensitivity:</label>
                                            <select 
                                                name="confidentialityLevel"
                                                value={customizationData.confidentialityLevel}
                                                onChange={handleCustomizationChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: 'rgba(26, 31, 46, 0.8)',
                                                    border: '1px solid #2a3441',
                                                    borderRadius: '6px',
                                                    color: '#e1e8f0',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                <option value="public">Public information</option>
                                                <option value="internal">Internal business data</option>
                                                <option value="confidential">Confidential/proprietary</option>
                                                <option value="personal">Personal/sensitive data</option>
                                            </select>
                                        </div>
                                        
                                        {/* Disclosure */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input 
                                                type="checkbox" 
                                                id="disclosurePlanned"
                                                name="disclosurePlanned" 
                                                checked={customizationData.disclosurePlanned}
                                                onChange={handleCustomizationChange}
                                                style={{ transform: 'scale(1.1)', accentColor: '#00d4ff' }}
                                            />
                                            <label htmlFor="disclosurePlanned" style={{ fontSize: '0.8rem', color: '#e1e8f0' }}>AI involvement will be disclosed</label>
                                        </div>
                                        
                                        {/* High-Risk Activities */}
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: '#e1e8f0', marginBottom: '0.75rem', display: 'block' }}>High-Risk Activities (check if applicable):</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                {[
                                                    { value: 'child-safety', label: 'Child safety concerns' },
                                                    { value: 'critical-infrastructure', label: 'Critical infrastructure' },
                                                    { value: 'violence-hate', label: 'Violence/hate content' },
                                                    { value: 'privacy-identity', label: 'Privacy violations' },
                                                    { value: 'misinformation', label: 'Misinformation creation' },
                                                    { value: 'law-enforcement', label: 'Law enforcement apps' }
                                                ].map((item, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            id={`prohibited-${item.value}`}
                                                            name="prohibitedContent" 
                                                            value={item.value}
                                                            checked={customizationData.prohibitedContent.includes(item.value)}
                                                            onChange={handleCustomizationChange}
                                                            style={{ accentColor: '#ff3344' }}
                                                        />
                                                        <label htmlFor={`prohibited-${item.value}`} style={{ color: '#e1e8f0' }}>{item.label}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* AI Development Restrictions */}
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: '#e1e8f0', marginBottom: '0.75rem', display: 'block' }}>AI Development Activities (check if applicable):</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                {[
                                                    { value: 'competing-ai', label: 'Competing AI development' },
                                                    { value: 'model-training', label: 'Training other models' },
                                                    { value: 'model-scraping', label: 'Automated scraping' },
                                                    { value: 'reselling-outputs', label: 'Reselling outputs' }
                                                ].map((item, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            id={`ai-dev-${item.value}`}
                                                            name="aiDevelopment" 
                                                            value={item.value}
                                                            checked={customizationData.aiDevelopment.includes(item.value)}
                                                            onChange={handleCustomizationChange}
                                                            style={{ accentColor: '#00d4ff' }}
                                                        />
                                                        <label htmlFor={`ai-dev-${item.value}`} style={{ color: '#e1e8f0' }}>{item.label}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={applyCustomizedScenario}
                                            style={{
                                                padding: '0.75rem 1.5rem',
                                                background: 'linear-gradient(135deg, #39ff14, #00d4ff)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#000',
                                                fontFamily: 'Orbitron, monospace',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                marginTop: '0.5rem'
                                            }}
                                        >
                                            🚀 Analyze Risk
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'grid',
                                    gridTemplateColumns: '1fr',
                                    gap: '0.75rem'
                                }}>
                                    {riskScenarios.map((scenario, index) => (
                                        <div 
                                            key={scenario.id}
                                            style={{
                                                padding: '1rem',
                                                background: 'rgba(26, 31, 46, 0.5)',
                                                borderRadius: '8px',
                                                border: '1px solid #2a3441',
                                                transition: 'all 0.3s ease',
                                                position: 'relative'
                                            }}
                                            className="scenario-card"
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '0.75rem'
                                            }}>
                                                <div>
                                                    <h4 style={{
                                                        fontFamily: 'Orbitron, monospace',
                                                        fontSize: '0.9rem',
                                                        color: '#00d4ff',
                                                        margin: '0 0 0.5rem 0',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {scenario.title}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '0.8rem',
                                                        color: '#b4c1d3',
                                                        margin: 0,
                                                        lineHeight: '1.4'
                                                    }}>
                                                        {scenario.description}
                                                    </p>
                                                </div>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: scenario.expectedRisk === 'low' ? 'rgba(57, 255, 20, 0.2)' : 
                                                               scenario.expectedRisk === 'medium' ? 'rgba(255, 170, 0, 0.2)' : 'rgba(255, 51, 68, 0.2)',
                                                    color: scenario.expectedRisk === 'low' ? '#39ff14' : 
                                                           scenario.expectedRisk === 'medium' ? '#ffaa00' : '#ff3344',
                                                    textTransform: 'uppercase',
                                                    fontFamily: 'Orbitron, monospace',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {scenario.expectedRisk} RISK
                                                </span>
                                            </div>
                                            
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    color: '#8892a6'
                                                }}>
                                                    Key factors: {scenario.riskFactors.join(', ')}
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedScenario(scenario);
                                                        setShowCustomization(true);
                                                    }}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'linear-gradient(135deg, #00d4ff, #39ff14)',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        color: '#000',
                                                        fontFamily: 'Orbitron, monospace',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    🛠️ Customize
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
                
            case 1:
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
                                    <option value="finance">Financial advice</option>
                                    <option value="academic">Academic/Testing</option>
                                    <option value="journalism">Media/Journalism</option>
                                    <option value="software">Software development</option>
                                    <option value="creative">Creative content</option>
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

            default:
                return null;
        }
    };

    // Render compact gauge pane without scrolling
    const renderGaugePane = () => {
        return (
            <div className="gauge-pane">
                {/* Risk Gauge */}
                <div className="risk-gauge-container">
                    <div className="risk-gauge">
                        <div className="gauge-background"></div>
                        <svg className="gauge-svg" viewBox="0 0 200 200">
                            <defs>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge> 
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            <circle cx="100" cy="100" r="90" className="gauge-track" />
                            
                            <circle 
                                cx="100" 
                                cy="100" 
                                r="90" 
                                className="gauge-fill"
                                stroke={riskAnalysis.level === 'low' ? '#39ff14' : 
                                        riskAnalysis.level === 'medium' ? '#ffaa00' : '#ff3344'}
                                strokeDasharray={`${(riskAnalysis.score / 100) * 565.48} 565.48`}
                                strokeDashoffset="141.37"
                                transform="rotate(-90 100 100)"
                            />
                        </svg>
                        
                        <div className="gauge-center">
                            <div className="gauge-score" style={{
                                color: riskAnalysis.level === 'low' ? '#39ff14' : 
                                       riskAnalysis.level === 'medium' ? '#ffaa00' : '#ff3344'
                            }}>
                                {riskAnalysis.score}
                            </div>
                            <div className="gauge-label">RISK SCORE</div>
                        </div>
                    </div>
                </div>

                {/* Risk Level Display */}
                <div className="risk-level-display">
                    <div className={`risk-level-label ${riskAnalysis.level}`}>
                        {riskAnalysis.level.toUpperCase()} RISK
                    </div>
                </div>

                {/* Risk Factors */}
                {riskAnalysis.factors.length > 0 && (
                    <div className="risk-factors-list">
                        <h4>Risk Factors</h4>
                        <ul>
                            {riskAnalysis.factors.map((factor, index) => (
                                <li key={index}>{factor}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Progress & Status */}
                <div className="system-status">
                    <div style={{ fontSize: '0.7rem', color: '#8892a6', marginBottom: '0.5rem' }}>
                        <span className="status-dot"></span>
                        Configuration: {completionProgress}% Complete
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#39ff14', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {achievements.map((achievement, index) => (
                            <span key={index} title={achievement.label}>
                                {achievement.icon}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="analyzer-container">
            {/* Header */}
            <div className="header">
                <h1>Claude Risk Analyzer</h1>
                <p>Assess compliance risks for your Claude usage</p>
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

            {/* Main Content */}
            <div className="main-content">
                <div className="input-pane">
                    {renderTabContent()}
                </div>
                {renderGaugePane()}
            </div>
        </div>
    );
};

// Initialize Feather icons
if (typeof feather !== 'undefined') {
    feather.replace();
}

// Render the component
ReactDOM.render(<ClaudeOwnershipAnalyzer />, document.getElementById('root'));