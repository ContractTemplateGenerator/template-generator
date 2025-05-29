const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('auto-detect');
    const [ndaUrl, setNdaUrl] = useState('');
    const [useClaudeAI, setUseClaudeAI] = useState(false); // Toggle for AI provider
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [userParty, setUserParty] = useState('');
    const [businessContext, setBusinessContext] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);
    const fileInputRef = useRef(null);

    // Enhanced fallback responses with structured presentation
    const fallbackResponses = {
        "default": `
        <div class="analysis-overview">
            <div class="risk-assessment-grid">
                <div class="risk-card medium-risk">
                    <div class="risk-icon">⚠️</div>
                    <div class="risk-title">Risk Level</div>
                    <div class="risk-value">Moderate</div>
                    <div class="risk-subtitle">Requires Context</div>
                </div>
                <div class="risk-card balance-risk">
                    <div class="risk-icon">⚖️</div>
                    <div class="risk-title">Agreement Balance</div>
                    <div class="risk-value">Unknown</div>
                    <div class="risk-subtitle">Need Party Info</div>
                </div>
                <div class="risk-card enforceability">
                    <div class="risk-icon">🛡️</div>
                    <div class="risk-title">Enforceability</div>
                    <div class="risk-value">Likely</div>
                    <div class="risk-subtitle">Standard Clauses</div>
                </div>
            </div>
        </div>

        <div class="dual-party-analysis">
            <table class="analysis-table">
                <thead>
                    <tr>
                        <th>Analysis Factor</th>
                        <th class="disclosing-party">Disclosing Party<br><small>(Information Sharer)</small></th>
                        <th class="receiving-party">Receiving Party<br><small>(Information Recipient)</small></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Primary Risk</strong></td>
                        <td class="disclosing-party">Information leakage & competitive disadvantage</td>
                        <td class="receiving-party">Operational restrictions & compliance burden</td>
                    </tr>
                    <tr>
                        <td><strong>Key Benefit</strong></td>
                        <td class="disclosing-party">Trade secret protection & competitive advantage</td>
                        <td class="receiving-party">Access to valuable business opportunities</td>
                    </tr>
                    <tr>
                        <td><strong>Enforcement Power</strong></td>
                        <td class="disclosing-party">Can seek injunctive relief & damages</td>
                        <td class="receiving-party">Limited - must comply with obligations</td>
                    </tr>
                    <tr>
                        <td><strong>Duration Impact</strong></td>
                        <td class="disclosing-party">Longer = better protection</td>
                        <td class="receiving-party">Shorter = less restriction</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="suggested-redrafts">
            <h3><strong>🔧 Common Improvement Areas</strong></h3>
            <div class="redraft-cards">
                <div class="redraft-card">
                    <div class="redraft-issue">Overly Broad Definition</div>
                    <div class="redraft-before"><strong>Before:</strong> "All information shared..."</div>
                    <div class="redraft-after"><strong>Better:</strong> "Information clearly marked as confidential..."</div>
                </div>
                <div class="redraft-card">
                    <div class="redraft-issue">Missing Exceptions</div>
                    <div class="redraft-before"><strong>Issue:</strong> No standard exceptions</div>
                    <div class="redraft-after"><strong>Add:</strong> Publicly available, independently developed, legally required disclosures</div>
                </div>
                <div class="redraft-card">
                    <div class="redraft-issue">Indefinite Duration</div>
                    <div class="redraft-before"><strong>Before:</strong> "Perpetual confidentiality"</div>
                    <div class="redraft-after"><strong>Better:</strong> "3 years from disclosure date"</div>
                </div>
            </div>
        </div>

        <div class="context-questions">
            <h3><strong>❓ To Provide Better Analysis, We Need Context</strong></h3>
            <div class="question-prompts">
                <div class="question-card">Which party do you represent?</div>
                <div class="question-card">What's the business relationship context?</div>
                <div class="question-card">What consideration is being exchanged?</div>
                <div class="question-card">What's your timeline for finalization?</div>
            </div>
        </div>

        <div class="upgrade-teasers">
            <div class="upgrade-card tier-1">
                <div class="tier-badge">Enhanced Analysis - $97</div>
                <div class="tier-benefits">✓ Party-specific risk assessment<br>✓ Industry-specific recommendations<br>✓ Negotiation strategy guidance</div>
            </div>
            <div class="upgrade-card tier-2">
                <div class="tier-badge">Complete Redraft - $297</div>
                <div class="tier-benefits">✓ Fully redrafted agreement<br>✓ Summary of all changes<br>✓ 30-minute strategy call</div>
            </div>
            <div class="upgrade-card tier-3">
                <div class="tier-badge">Full Legal Package - $597</div>
                <div class="tier-benefits">✓ Multiple agreement versions<br>✓ Legal memo & strategy<br>✓ Ongoing negotiation support</div>
            </div>
        </div>
        `
    };

    // Handle file upload (text files only)
    const handleFileUpload = async (file) => {
        if (!file) return;

        try {
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const text = await file.text();
                setNdaText(text);
            } else {
                alert('Please upload a plain text (.txt) file, or copy and paste your NDA text directly.');
            }
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error reading file. Please copy and paste your NDA text directly.');
        }
    };

    // Handle URL input
    const handleUrlSubmit = async () => {
        if (!ndaUrl.trim()) return;
        
        try {
            setIsAnalyzing(true);
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(ndaUrl)}`);
            const data = await response.json();
            
            if (data.contents) {
                const cleanText = data.contents.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                setNdaText(cleanText);
            } else {
                throw new Error('Could not fetch content');
            }
        } catch (error) {
            alert('Could not fetch content from URL. Please copy and paste your NDA text directly.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Analyze NDA using the exact same pattern as working chatboxes
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        // Create user message in the same format as working chatboxes
        const userMessage = { 
            role: 'user', 
            content: `Please analyze this NDA and determine if it's okay to sign as-is. Consider the industry context: ${industry}.\n\nNDA TEXT:\n${ndaText}` 
        };
        
        console.log('🔍 Debug: Starting NDA analysis...');
        console.log('🔍 Debug: User message:', userMessage);
        console.log('🔍 Debug: Industry context:', industry);
        console.log('🔍 Debug: NDA text length:', ndaText.length);
        
        try {
            // Use the exact same API call pattern as working chatboxes
            console.log('🔍 Debug: Sending request to API...');
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [userMessage],
                    useClaudeAI: useClaudeAI
                }),
            });

            console.log('🔍 Debug: Response status:', response.status);
            console.log('🔍 Debug: Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔍 Debug: API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();
            console.log('🔍 Debug: API Response received:', data);
            console.log('🔍 Debug: Response has data.response:', !!data.response);
            console.log('🔍 Debug: Model used:', data.model);
            
            if (data.response) {
                console.log('🔍 Debug: Setting analysis result...');
                setAnalysisResult({
                    htmlContent: data.response,
                    recommendation: extractRecommendation(data.response),
                    model: data.model || 'AI Analysis',
                    provider: data.provider || (useClaudeAI ? 'Anthropic Claude 4.0' : 'Groq Llama')
                });
                console.log('🔍 Debug: Analysis result set successfully!');
                
                // Show follow-up questions after analysis
                setShowFollowUp(true);
                setShowUpgradeOptions(true);
            } else {
                throw new Error('No response content received from API');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            
            // Always use fallback response when API fails
            setAnalysisResult({
                htmlContent: fallbackResponses.default,
                recommendation: 'CONTEXTUAL DUAL-PARTY ANALYSIS',
                model: 'Professional Fallback Analysis',
                provider: 'Terms.law Legal Guidance'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Extract key insight from response instead of categorical recommendation
    const extractRecommendation = (htmlResponse) => {
        // Look for document overview or analysis summary
        const overviewMatch = htmlResponse.match(/<strong>DOCUMENT OVERVIEW:<\/strong>\s*([^<]+)/);
        if (overviewMatch) {
            return overviewMatch[1].trim().substring(0, 80) + '...';
        }
        
        // Look for balance assessment
        const balanceMatch = htmlResponse.match(/<strong>AGREEMENT BALANCE:<\/strong>(.*?)<br><br>/s);
        if (balanceMatch) {
            const balanceText = balanceMatch[1].replace(/<[^>]*>/g, '').trim();
            return balanceText.substring(0, 80) + '...';
        }
        
        // Fallback to generic analysis indicator
        if (htmlResponse.includes('DOCUMENT OVERVIEW')) return 'NUANCED LEGAL ANALYSIS';
        if (htmlResponse.includes('ANALYSIS FOR')) return 'DUAL-PARTY ANALYSIS';
        if (htmlResponse.includes('CONTEXT MATTERS')) return 'CONTEXTUAL REVIEW';
        return 'PROFESSIONAL ANALYSIS';
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

    // Handle enhanced analysis with context
    const requestEnhancedAnalysis = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text first.');
            return;
        }

        setIsAnalyzing(true);
        
        // Create enhanced user message with context
        const contextInfo = `
        User Context:
        - Party Represented: ${userParty || 'Not specified'}
        - Business Context: ${businessContext || 'Not specified'}  
        - Industry Context: ${industry}
        - Timeline: ${timeframe || 'Not specified'}
        `;
        
        const userMessage = { 
            role: 'user', 
            content: `Please provide an enhanced analysis of this NDA with the following context:
            
            ${contextInfo}
            
            Please provide:
            1. Specific recommendations for my position
            2. Suggested clause redrafts
            3. Negotiation strategy
            4. Risk quantification where possible
            
            NDA TEXT:
            ${ndaText}` 
        };
        
        try {
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [userMessage],
                    useClaudeAI: useClaudeAI
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.response) {
                setAnalysisResult({
                    htmlContent: data.response,
                    recommendation: 'CUSTOMIZED ANALYSIS FOR YOUR POSITION',
                    model: data.model || 'Enhanced AI Analysis',
                    provider: data.provider || (useClaudeAI ? 'Anthropic Claude 4.0' : 'Groq Llama'),
                    isEnhanced: true
                });
            } else {
                throw new Error('No response content received from API');
            }
        } catch (error) {
            console.error('Enhanced analysis error:', error);
            alert('Enhanced analysis temporarily unavailable. Please try the consultation option.');
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

    // Get styling class based on analysis type (more neutral than before)
    const getRecommendationClass = (recommendation) => {
        if (!recommendation) return 'analysis';
        // All analyses use neutral styling since we don't give categorical recommendations
        return 'analysis';
    };
    return (
        <div className="nda-analyzer">
            <div className="header">
                <h1>🛡️ NDA Risk Analyzer</h1>
                <p>Sophisticated Dual-Party Legal Analysis by California Attorney</p>
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
                                Drag & drop text file (.txt) here
                            </div>
                            <div className="upload-subtext">
                                or click to browse • Plain text files only
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt,text/plain"
                                onChange={(e) => handleFileUpload(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                        </div>
                        
                        <div className="url-input-section">
                            <div className="url-input-header">Or enter URL to NDA:</div>
                            <div className="url-input-group">
                                <input
                                    type="url"
                                    className="url-input"
                                    placeholder="https://example.com/nda-document.html"
                                    value={ndaUrl}
                                    onChange={(e) => setNdaUrl(e.target.value)}
                                />
                                <button 
                                    className="url-submit-btn"
                                    onClick={handleUrlSubmit}
                                    disabled={!ndaUrl.trim() || isAnalyzing}
                                >
                                    Fetch
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-input-section">
                        <textarea
                            className="nda-textarea"
                            placeholder="Paste your NDA text here for sophisticated dual-party analysis...

We'll analyze risks and considerations for both the disclosing party (information sharer) and receiving party (information recipient).

Example: 'This Non-Disclosure Agreement is entered into between Company A and Company B for the purpose of...'

The more complete the text, the more nuanced the analysis."
                            value={ndaText}
                            onChange={(e) => setNdaText(e.target.value)}
                        />
                    </div>

                    <div className="analysis-options">
                        <div className="option-group">
                            <label>Industry Context (optional):</label>
                            <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                                <option value="auto-detect">Let AI determine from NDA</option>
                                <option value="technology">Technology/Software</option>
                                <option value="healthcare">Healthcare/Medical</option>
                                <option value="finance">Finance/Banking</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="retail">Retail/E-commerce</option>
                                <option value="consulting">Consulting/Services</option>
                                <option value="real-estate">Real Estate</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div className="option-group ai-toggle-group">
                            <label>AI Analysis Provider:</label>
                            <div className="ai-toggle-container">
                                <div className="ai-toggle-switch">
                                    <input
                                        type="checkbox"
                                        id="ai-toggle"
                                        checked={useClaudeAI}
                                        onChange={(e) => setUseClaudeAI(e.target.checked)}
                                    />
                                    <label htmlFor="ai-toggle" className="toggle-label">
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="ai-provider-labels">
                                    <span className={`provider-label ${!useClaudeAI ? 'active' : ''}`}>
                                        🚀 Llama (Default)
                                    </span>
                                    <span className={`provider-label ${useClaudeAI ? 'active' : ''}`}>
                                        🧠 Claude 4.0
                                    </span>
                                </div>
                            </div>
                            <div className="ai-provider-info">
                                {useClaudeAI ? (
                                    <small>Claude 4.0: Most advanced AI reasoning with superior legal analysis</small>
                                ) : (
                                    <small>Llama: Fast, reliable legal analysis (recommended for most cases)</small>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        className="analyze-button"
                        onClick={analyzeNDA}
                        disabled={!ndaText.trim() || isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="loading-spinner"></div>
                                Analyzing NDA for Both Parties...
                            </>
                        ) : (
                            <>
                                <i data-feather="shield"></i>
                                Analyze Dual-Party Risk
                            </>
                        )}
                    </button>
                </div>

                {/* Analysis Panel */}
                <div className="analysis-panel">
                    <h2>
                        <i data-feather="file-text"></i>
                        Dual-Party Legal Analysis
                    </h2>

                    <div className="analysis-content">
                        {!analysisResult ? (
                            <div className="waiting-state">
                                <div className="waiting-icon">⚖️</div>
                                <div className="waiting-text">Ready to Analyze Your NDA</div>
                                <div className="waiting-subtext">
                                    Enter your NDA text and click "Analyze Risk Level" to get sophisticated dual-party legal analysis from both disclosing and receiving party perspectives
                                </div>
                            </div>
                        ) : (
                            <div className="analysis-results">
                                <div className={`recommendation-card ${getRecommendationClass(analysisResult.recommendation)}`}>
                                    <h3>
                                        <span className="recommendation-icon">
                                            ⚖️
                                        </span>
                                        Legal Analysis Summary
                                    </h3>
                                    <div className="recommendation-answer">
                                        {analysisResult.recommendation || 'PROFESSIONAL ANALYSIS'}
                                    </div>
                                </div>

                                <div className="legal-analysis-content">
                                    <div dangerouslySetInnerHTML={{ __html: analysisResult.htmlContent }} />
                                </div>

                                {/* Follow-up Questions Section */}
                                {showFollowUp && !analysisResult.isEnhanced && (
                                    <div className="follow-up-section">
                                        <h3 className="followup-title">🎯 Get Customized Analysis for Your Position</h3>
                                        <div className="context-questions-grid">
                                            <div className="question-group">
                                                <label>Which party do you represent?</label>
                                                <select value={userParty} onChange={(e) => setUserParty(e.target.value)}>
                                                    <option value="">Select your position</option>
                                                    <option value="disclosing">Disclosing Party (Information Sharer)</option>
                                                    <option value="receiving">Receiving Party (Information Recipient)</option>
                                                    <option value="both">Both parties (drafting mutual NDA)</option>
                                                </select>
                                            </div>
                                            <div className="question-group">
                                                <label>Business relationship context?</label>
                                                <select value={businessContext} onChange={(e) => setBusinessContext(e.target.value)}>
                                                    <option value="">Select context</option>
                                                    <option value="m&a">M&A Due Diligence</option>
                                                    <option value="partnership">Strategic Partnership</option>
                                                    <option value="employment">Employment/Contractor</option>
                                                    <option value="investment">Investment Discussion</option>
                                                    <option value="vendor">Vendor/Supplier Relationship</option>
                                                    <option value="licensing">Technology Licensing</option>
                                                    <option value="other">Other Business Relationship</option>
                                                </select>
                                            </div>
                                            <div className="question-group">
                                                <label>When do you need this finalized?</label>
                                                <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                                                    <option value="">Select timeline</option>
                                                    <option value="asap">ASAP (within 24 hours)</option>
                                                    <option value="week">Within 1 week</option>
                                                    <option value="month">Within 1 month</option>
                                                    <option value="flexible">Flexible timeline</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button 
                                            className="enhanced-analysis-btn"
                                            onClick={requestEnhancedAnalysis}
                                            disabled={isAnalyzing || !userParty}
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <div className="loading-spinner"></div>
                                                    Generating Customized Analysis...
                                                </>
                                            ) : (
                                                <>
                                                    <i data-feather="target"></i>
                                                    Get Customized Analysis for My Position
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Upgrade Options Mock */}
                                {showUpgradeOptions && !analysisResult.isEnhanced && (
                                    <div className="upgrade-options-section">
                                        <h3 className="upgrade-title">💼 Professional Services Available</h3>
                                        <div className="service-tiers">
                                            <div className="service-tier tier-1">
                                                <div className="tier-header">
                                                    <div className="tier-name">Enhanced Analysis</div>
                                                    <div className="tier-price">$97</div>
                                                </div>
                                                <div className="tier-features">
                                                    ✓ Party-specific risk assessment<br>
                                                    ✓ Industry-specific recommendations<br>
                                                    ✓ Negotiation strategy guidance<br>
                                                    ✓ Email consultation included
                                                </div>
                                                <button className="tier-button" onClick={scheduleConsultation}>
                                                    Schedule Consultation
                                                </button>
                                            </div>
                                            <div className="service-tier tier-2 featured">
                                                <div className="tier-badge">Most Popular</div>
                                                <div className="tier-header">
                                                    <div className="tier-name">Complete Redraft</div>
                                                    <div className="tier-price">$297</div>
                                                </div>
                                                <div className="tier-features">
                                                    ✓ Fully redrafted NDA optimized for you<br>
                                                    ✓ Summary of all changes<br>
                                                    ✓ Negotiation talking points<br>
                                                    ✓ 30-minute strategy call
                                                </div>
                                                <button className="tier-button primary" onClick={scheduleConsultation}>
                                                    Schedule Consultation
                                                </button>
                                            </div>
                                            <div className="service-tier tier-3">
                                                <div className="tier-header">
                                                    <div className="tier-name">Full Legal Package</div>
                                                    <div className="tier-price">$597</div>
                                                </div>
                                                <div className="tier-features">
                                                    ✓ Multiple agreement versions<br>
                                                    ✓ Legal memo & strategic positioning<br>
                                                    ✓ Follow-up negotiation support<br>
                                                    ✓ Template library access
                                                </div>
                                                <button className="tier-button" onClick={scheduleConsultation}>
                                                    Schedule Consultation
                                                </button>
                                            </div>
                                        </div>
                                        <div className="upgrade-disclaimer">
                                            <small>
                                                <strong>Note:</strong> These are example service offerings. Actual pricing and services 
                                                will be discussed during consultation based on your specific needs.
                                            </small>
                                        </div>
                                    </div>
                                )}

                                <div className="action-buttons">
                                    <button 
                                        className="action-button primary"
                                        onClick={scheduleConsultation}
                                    >
                                        <i data-feather="calendar"></i>
                                        Schedule Legal Consultation
                                    </button>
                                    
                                    <button 
                                        className="action-button secondary"
                                        onClick={() => window.open('https://terms.law/', '_blank')}
                                    >
                                        <i data-feather="external-link"></i>
                                        Visit terms.law
                                    </button>
                                    
                                    <button 
                                        className="action-button outline"
                                        onClick={() => {
                                            setAnalysisResult(null);
                                            setNdaText('');
                                        }}
                                    >
                                        <i data-feather="refresh-cw"></i>
                                        New Analysis
                                    </button>
                                </div>

                                <div className="professional-disclaimer">
                                    <small>
                                        <strong>Disclaimer:</strong> This analysis is provided for informational purposes only and does not constitute legal advice. 
                                        For specific legal guidance, consult with a qualified attorney. Analysis by Sergei Tokmakov, Esq., CA Bar #279869.
                                        {analysisResult.provider && (
                                            <span style={{opacity: 0.7}}> • Powered by {analysisResult.provider}</span>
                                        )}
                                        {analysisResult.model && analysisResult.provider && (
                                            <span style={{opacity: 0.6}}> ({analysisResult.model})</span>
                                        )}
                                    </small>
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