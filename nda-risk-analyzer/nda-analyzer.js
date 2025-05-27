const { useState, useEffect, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('technology');
    const [jurisdiction, setJurisdiction] = useState('california');
    const [companySize, setCompanySize] = useState('startup');
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Handle file upload
    const handleFileUpload = async (file) => {
        if (!file) return;

        setUploadedFile(file);
        
        if (file.type === 'application/pdf') {
            alert('PDF upload feature coming soon. Please copy and paste your NDA text for now.');
            return;
        } else {
            // Handle text files
            const text = await file.text();
            setNdaText(text);
        }
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };
    // Create analysis prompt for Grok API
    const createAnalysisPrompt = () => {
        return `You are a specialized legal AI assistant working with California attorney Sergei Tokmakov (CA Bar #279869). 
        
Analyze this NDA with professional-grade legal analysis. Consider:
- Industry: ${industry}
- Jurisdiction: ${jurisdiction} 
- Company Size: ${companySize}

CRITICAL ANALYSIS REQUIREMENTS:
1. Overall Risk Assessment (1-10 scale)
2. Fairness Score (0-100%)
3. Clause-by-clause breakdown with risk levels (HIGH/MEDIUM/LOW)
4. Industry-specific red flags
5. Jurisdiction-specific enforceability issues
6. Missing standard protections
7. Practical business impact assessment
8. Specific negotiation recommendations

Format response as JSON with these sections:
{
    "overallRisk": number,
    "fairnessScore": number,
    "executiveSummary": "string",
    "riskScores": {
        "enforceability": number,
        "businessImpact": number,
        "litigationRisk": number,
        "complianceBurden": number
    },
    "clauses": [
        {
            "title": "string",
            "text": "string", 
            "riskLevel": "HIGH|MEDIUM|LOW",
            "analysis": "string",
            "suggestions": ["string"]
        }
    ],
    "industryFlags": ["string"],
    "jurisdictionIssues": ["string"],
    "missingProtections": ["string"],
    "negotiationPriorities": ["string"]
}

NDA TEXT TO ANALYZE:
${ndaText}`;
    };

    // Call Grok API
    const callGrokAPI = async (prompt) => {
        // In production, this would call your actual Grok API endpoint
        // For demo purposes, we'll simulate the API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getDemoAnalysis());
            }, 2000);
        });
    };
    // Parse analysis response
    const parseAnalysisResponse = (response) => {
        try {
            return typeof response === 'string' ? JSON.parse(response) : response;
        } catch (error) {
            return getDemoAnalysis();
        }
    };

    // Demo analysis for testing
    const getDemoAnalysis = () => {
        return {
            overallRisk: 7,
            fairnessScore: 35,
            executiveSummary: "This NDA contains several concerning provisions that heavily favor the disclosing party. Key issues include overly broad confidentiality definitions, excessive duration, and one-sided obligations. The agreement lacks mutuality and may hinder your business operations.",
            riskScores: {
                enforceability: 8,
                businessImpact: 7,
                litigationRisk: 6,
                complianceBurden: 8
            },
            clauses: [
                {
                    title: "Confidentiality Definition",
                    text: "All information, data, materials, products, technology, computer programs, software, marketing plans, business plans, financial information...",
                    riskLevel: "HIGH",
                    analysis: "This definition is dangerously broad and could include information you already know or develop independently. It may encompass your own business strategies and publicly available information.",
                    suggestions: [
                        "Add specific exclusions for independently developed information",
                        "Exclude publicly available information",
                        "Limit to specific categories of confidential information"
                    ]
                },
                {
                    title: "Duration",
                    text: "This Agreement shall remain in effect for a period of five (5) years from the date of execution...",
                    riskLevel: "MEDIUM",
                    analysis: "Five years is longer than industry standard for most NDAs. Typical duration is 2-3 years for business information.",
                    suggestions: [
                        "Negotiate down to 2-3 years",
                        "Different durations for different types of information",
                        "Allow for earlier termination under certain conditions"
                    ]
                }
            ],
            industryFlags: [
                "No protection for independently developed technology",
                "May restrict hiring practices common in tech industry",
                "Could limit open source contributions"
            ],
            jurisdictionIssues: [
                "Under California law, non-compete provisions are unenforceable",
                "Broad non-solicitation clauses may violate B&P Code §16600",
                "Injunctive relief provisions may be too aggressive for CA courts"
            ],
            missingProtections: [
                "No mutual obligations",
                "Missing standard exceptions (publicly known, independently developed)",
                "No limitation on injunctive relief",
                "No return/destruction of information clause"
            ],
            negotiationPriorities: [
                "CRITICAL: Add mutuality to all obligations",
                "HIGH: Narrow confidentiality definition",
                "MEDIUM: Reduce duration to 2-3 years",
                "LOW: Add standard exceptions"
            ]
        };
    };
    // Analyze NDA function
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please provide an NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        try {
            const analysisPrompt = createAnalysisPrompt();
            const response = await callGrokAPI(analysisPrompt);
            const analysis = parseAnalysisResponse(response);
            setAnalysisResult(analysis);
        } catch (error) {
            console.error('Analysis error:', error);
            setAnalysisResult(getDemoAnalysis());
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Schedule consultation
    const scheduleConsultation = () => {
        if (window.Calendly) {
            window.Calendly.initPopupWidget({
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
            });
        } else {
            window.open('https://terms.law/call/', '_blank');
        }
    };

    // Get risk level color
    const getRiskColor = (level) => {
        switch (level) {
            case 'HIGH': return '#dc2626';
            case 'MEDIUM': return '#d97706';
            case 'LOW': return '#059669';
            default: return '#64748b';
        }
    };

    // Get fairness color
    const getFairnessColor = (score) => {
        if (score >= 70) return '#059669';
        if (score >= 40) return '#d97706';
        return '#dc2626';
    };

    // Toggle clause details
    const [expandedClauses, setExpandedClauses] = useState(new Set());
    
    const toggleClause = (index) => {
        const newExpanded = new Set(expandedClauses);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedClauses(newExpanded);
    };
    return (
        <div className="nda-analyzer">
            <div className="header">
                <h1>🛡️ NDA Risk Analyzer</h1>
                <p>Professional-Grade Legal Analysis by California Attorney</p>
                <div className="attorney-info">
                    Sergei Tokmakov, Esq. • CA Bar #279869 • 13+ Years Experience
                </div>
            </div>

            <div className="main-content">
                {/* Input Panel */}
                <div className="input-panel">
                    <h2>
                        <i data-feather="upload-cloud"></i>
                        Upload or Paste NDA
                    </h2>

                    <div className="upload-section">
                        <div 
                            className="file-upload"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="upload-icon">📄</div>
                            <div className="upload-text">
                                Drag & drop your NDA file here
                            </div>
                            <div className="upload-subtext">
                                or click to browse (PDF, DOC, TXT)
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => handleFileUpload(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="text-input-section">
                        <textarea
                            className="nda-textarea"
                            placeholder="Or paste your NDA text here for instant analysis..."
                            value={ndaText}
                            onChange={(e) => setNdaText(e.target.value)}
                        />
                    </div>

                    <div className="analysis-options">
                        <div className="options-grid">
                            <div className="option-group">
                                <label>Industry:</label>
                                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                                    <option value="technology">Technology/Software</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="retail">Retail/E-commerce</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="option-group">
                                <label>Jurisdiction:</label>
                                <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)}>
                                    <option value="california">California</option>
                                    <option value="new-york">New York</option>
                                    <option value="delaware">Delaware</option>
                                    <option value="texas">Texas</option>
                                    <option value="federal">Federal</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        className="analyze-button"
                        onClick={analyzeNDA}
                        disabled={isAnalyzing || !ndaText.trim()}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="loading-spinner"></div>
                                Analyzing NDA...
                            </>
                        ) : (
                            <>
                                <i data-feather="search"></i>
                                Analyze NDA Risk
                            </>
                        )}
                    </button>
                </div>

                {/* Analysis Panel */}
                <div className="analysis-panel">
                    <h2>
                        <i data-feather="shield-check"></i>
                        Risk Analysis Report
                    </h2>

                    <div className="analysis-content">
                        {!analysisResult ? (
                            <div className="waiting-state">
                                <div className="waiting-icon">⚖️</div>
                                <div className="waiting-text">Ready to analyze your NDA</div>
                                <div className="waiting-subtext">
                                    Upload or paste your NDA text and click "Analyze NDA Risk" to get started
                                </div>
                            </div>
                        ) : (
                            <div className="analysis-results">
                                {/* Risk Summary */}
                                <div className="risk-summary">
                                    <h3>Executive Summary</h3>
                                    <p>{analysisResult.executiveSummary}</p>
                                    
                                    <div className="risk-scores">
                                        <div className={`risk-score-card ${analysisResult.riskScores.enforceability >= 7 ? 'high' : analysisResult.riskScores.enforceability >= 4 ? 'medium' : 'low'}`}>
                                            <div className="risk-score-number">{analysisResult.riskScores.enforceability}</div>
                                            <div className="risk-score-label">Enforceability Risk</div>
                                        </div>
                                        <div className={`risk-score-card ${analysisResult.riskScores.businessImpact >= 7 ? 'high' : analysisResult.riskScores.businessImpact >= 4 ? 'medium' : 'low'}`}>
                                            <div className="risk-score-number">{analysisResult.riskScores.businessImpact}</div>
                                            <div className="risk-score-label">Business Impact</div>
                                        </div>
                                        <div className={`risk-score-card ${analysisResult.riskScores.litigationRisk >= 7 ? 'high' : analysisResult.riskScores.litigationRisk >= 4 ? 'medium' : 'low'}`}>
                                            <div className="risk-score-number">{analysisResult.riskScores.litigationRisk}</div>
                                            <div className="risk-score-label">Litigation Risk</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Fairness Assessment */}
                                <div className="fairness-assessment">
                                    <h3>
                                        <i data-feather="balance-scale"></i>
                                        Fairness Assessment
                                    </h3>
                                    <div className="fairness-score">
                                        <div className="fairness-meter">
                                            <div 
                                                className={`fairness-fill ${analysisResult.fairnessScore >= 70 ? 'fair' : analysisResult.fairnessScore >= 40 ? 'somewhat-fair' : 'unfair'}`}
                                                style={{ width: `${analysisResult.fairnessScore}%` }}
                                            ></div>
                                        </div>
                                        <div className="fairness-percentage">{analysisResult.fairnessScore}%</div>
                                    </div>
                                    <p>
                                        {analysisResult.fairnessScore >= 70 
                                            ? "This NDA appears to be relatively balanced between both parties."
                                            : analysisResult.fairnessScore >= 40
                                            ? "This NDA somewhat favors one party but may be acceptable with modifications."
                                            : "This NDA heavily favors one party and needs significant rebalancing."}
                                    </p>
                                </div>

                                {/* Clause Analysis */}
                                <div className="clause-analysis">
                                    <h3>Clause-by-Clause Analysis</h3>
                                    {analysisResult.clauses.map((clause, index) => (
                                        <div key={index} className="clause-item">
                                            <div 
                                                className="clause-header"
                                                onClick={() => toggleClause(index)}
                                            >
                                                <div 
                                                    className={`risk-indicator ${clause.riskLevel.toLowerCase()}`}
                                                ></div>
                                                <div className="clause-title">{clause.title}</div>
                                                <i data-feather={expandedClauses.has(index) ? "chevron-up" : "chevron-down"}></i>
                                            </div>
                                            <div className={`clause-content ${expandedClauses.has(index) ? 'expanded' : ''}`}>
                                                <div className="clause-text">{clause.text}</div>
                                                <div className="clause-analysis-text">{clause.analysis}</div>
                                                {clause.suggestions.length > 0 && (
                                                    <div className="clause-suggestions">
                                                        <h4>Recommended Changes:</h4>
                                                        <ul>
                                                            {clause.suggestions.map((suggestion, i) => (
                                                                <li key={i}>{suggestion}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Action Buttons */}
                                <div className="action-buttons">
                                    <button 
                                        className="action-button primary"
                                        onClick={scheduleConsultation}
                                    >
                                        <i data-feather="calendar"></i>
                                        Schedule Attorney Review - $149
                                    </button>
                                    <button className="action-button secondary">
                                        <i data-feather="download"></i>
                                        Download Report
                                    </button>
                                    <button className="action-button outline">
                                        <i data-feather="share-2"></i>
                                        Share Analysis
                                    </button>
                                </div>

                                {/* Professional Report */}
                                <div className="professional-report">
                                    <div className="report-header">
                                        <h3>Professional Legal Assessment</h3>
                                        <div className="attorney-badge">CA Licensed Attorney</div>
                                    </div>
                                    <div className="report-content">
                                        <h4>Industry-Specific Red Flags:</h4>
                                        <ul>
                                            {analysisResult.industryFlags.map((flag, index) => (
                                                <li key={index}>{flag}</li>
                                            ))}
                                        </ul>

                                        <h4>Jurisdiction Issues ({jurisdiction}):</h4>
                                        <ul>
                                            {analysisResult.jurisdictionIssues.map((issue, index) => (
                                                <li key={index}>{issue}</li>
                                            ))}
                                        </ul>

                                        <h4>Missing Standard Protections:</h4>
                                        <ul>
                                            {analysisResult.missingProtections.map((protection, index) => (
                                                <li key={index}>{protection}</li>
                                            ))}
                                        </ul>

                                        <h4>Negotiation Priorities:</h4>
                                        <ul>
                                            {analysisResult.negotiationPriorities.map((priority, index) => (
                                                <li key={index}>{priority}</li>
                                            ))}
                                        </ul>

                                        <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#64748b' }}>
                                            This analysis is provided for informational purposes only and does not constitute legal advice. 
                                            For specific legal guidance, consult with a qualified attorney.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
// Render the component
ReactDOM.render(<NDAAnalyzer />, document.getElementById('root'));