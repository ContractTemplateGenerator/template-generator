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

    // Simplified fallback responses
    const fallbackResponses = {
        "default": `<div class="simple-analysis">
<h3><strong>🛡️ Risk Assessment Summary</strong></h3>
<div class="risk-cards">
    <div class="risk-card moderate">⚠️ <strong>Moderate Risk</strong><br>Requires context to provide specific guidance</div>
    <div class="risk-card balanced">⚖️ <strong>Agreement Balance</strong><br>Need to know which party you represent</div>
</div>

<h3><strong>📊 Dual-Party Analysis</strong></h3>
<p><strong>For Disclosing Party:</strong> Information leakage risk vs. trade secret protection</p>
<p><strong>For Receiving Party:</strong> Operational restrictions vs. access to valuable opportunities</p>

<h3><strong>🔧 Common Issues to Watch For</strong></h3>
<p>• <strong>Overly broad definitions</strong> - "All information" should be "clearly marked confidential information"</p>
<p>• <strong>Missing standard exceptions</strong> - Should exclude publicly available and independently developed info</p>
<p>• <strong>Indefinite duration</strong> - Consider reasonable time limits (2-3 years typical)</p>

<h3><strong>❓ Questions for Better Analysis</strong></h3>
<div class="context-questions">
    <p><strong>Which party do you represent?</strong> (Disclosing vs. Receiving)</p>
    <p><strong>What's the business context?</strong> (M&A, partnership, employment, etc.)</p>
    <p><strong>Timeline for finalization?</strong></p>
</div>

<div class="upgrade-preview">
<h3><strong>💼 Available Services</strong></h3>
<p>📋 <strong>Enhanced Analysis ($97)</strong> - Party-specific recommendations & strategy</p>
<p>📝 <strong>Complete Redraft ($297)</strong> - Fully customized NDA + consultation</p>
<p>⚖️ <strong>Full Legal Package ($597)</strong> - Multiple versions + ongoing support</p>
</div>
</div>`
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

                                {/* Simplified Follow-up Questions */}
                                {showFollowUp && !analysisResult.isEnhanced && (
                                    <div className="follow-up-section">
                                        <h3>🎯 Get Customized Analysis</h3>
                                        <div className="simple-questions">
                                            <div className="question-row">
                                                <label>Which party are you?</label>
                                                <select value={userParty} onChange={(e) => setUserParty(e.target.value)}>
                                                    <option value="">Select...</option>
                                                    <option value="disclosing">Disclosing Party (Info Sharer)</option>
                                                    <option value="receiving">Receiving Party (Info Recipient)</option>
                                                </select>
                                            </div>
                                            <div className="question-row">
                                                <label>Business context?</label>
                                                <select value={businessContext} onChange={(e) => setBusinessContext(e.target.value)}>
                                                    <option value="">Select...</option>
                                                    <option value="m&a">M&A Due Diligence</option>
                                                    <option value="partnership">Partnership</option>
                                                    <option value="employment">Employment</option>
                                                    <option value="investment">Investment</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button 
                                            className="simple-enhance-btn"
                                            onClick={requestEnhancedAnalysis}
                                            disabled={isAnalyzing || !userParty}
                                        >
                                            Get My Customized Analysis
                                        </button>
                                    </div>
                                )}

                                {/* Simplified Service Options */}
                                {showUpgradeOptions && !analysisResult.isEnhanced && (
                                    <div className="simple-services">
                                        <h3>💼 Professional Services</h3>
                                        <div className="service-list">
                                            <div className="service-item">
                                                <strong>Enhanced Analysis - $97</strong><br>
                                                Party-specific recommendations & strategy
                                            </div>
                                            <div className="service-item featured">
                                                <strong>Complete Redraft - $297</strong><br>
                                                Fully customized NDA + consultation
                                            </div>
                                            <div className="service-item">
                                                <strong>Full Package - $597</strong><br>
                                                Multiple versions + ongoing support
                                            </div>
                                        </div>
                                        <button className="consult-btn" onClick={scheduleConsultation}>
                                            Schedule Consultation
                                        </button>
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