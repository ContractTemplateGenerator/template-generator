const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('auto-detect');
    const [ndaUrl, setNdaUrl] = useState('');
    const [useClaudeAI, setUseClaudeAI] = useState(false); // Toggle for AI provider
    const fileInputRef = useRef(null);

    // Fallback responses for when API fails
    const fallbackResponses = {
        "default": `<strong>DOCUMENT OVERVIEW:</strong> Professional legal analysis requires reviewing specific NDA clauses, but I can provide general guidance based on common NDA structures and issues.<br><br>

<strong>ANALYSIS FOR DISCLOSING PARTY (Information Sharer):</strong><br>
• <strong>Protection Level:</strong> Standard NDAs typically provide reasonable confidentiality protection<br>
• <strong>Enforcement:</strong> Most business NDAs are enforceable if properly drafted with standard exceptions<br>
• <strong>Duration:</strong> Look for reasonable time limits (2-3 years is typical for business relationships)<br><br>

<strong>ANALYSIS FOR RECEIVING PARTY (Information Recipient):</strong><br>
• <strong>Obligation Scope:</strong> Review what information is considered "confidential" - should be clearly defined<br>
• <strong>Practical Impact:</strong> Consider how restrictions will affect your business operations<br>
• <strong>Standard Exceptions:</strong> Ensure publicly available information, independently developed information, and legally required disclosures are excluded<br><br>

<strong>AGREEMENT BALANCE:</strong><br>
• <strong>Mutual vs One-Sided:</strong> Many business NDAs are one-sided, which may be appropriate depending on the business relationship<br>
• <strong>Consideration Context:</strong> One-sided terms may be acceptable if you're receiving valuable business opportunities, partnerships, or access to proprietary information<br>
• <strong>Industry Standards:</strong> Technology and investment contexts often involve one-sided NDAs<br><br>

<strong>KEY LEGAL CONSIDERATIONS:</strong><br>
• <strong>Overly Broad Definitions:</strong> Watch for vague "confidential information" definitions that could include non-confidential business discussions<br>
• <strong>California Restrictions:</strong> In California, non-compete clauses are generally unenforceable, so ensure NDA doesn't contain disguised non-compete provisions<br>
• <strong>Perpetual Terms:</strong> Indefinite confidentiality periods may be problematic - reasonable duration is preferred<br><br>

<strong>RISK FACTORS TO CONSIDER:</strong><br>
• <strong>Disclosing Party Risks:</strong> Information leakage, competitive disadvantage, loss of trade secret protection<br>
• <strong>Receiving Party Risks:</strong> Operational restrictions, potential litigation exposure, compliance burden<br>
• <strong>Enforceability:</strong> Courts generally enforce reasonable confidentiality agreements but may reject overly broad restrictions<br><br>

<strong>CONTEXT MATTERS:</strong><br>
The appropriateness of any NDA depends heavily on factors we don't know: the value of consideration being exchanged, the business relationship context, the competitive landscape, and which party you represent. One-sided agreements aren't inherently problematic in business contexts where one party genuinely needs to protect valuable confidential information while the other party benefits from access to business opportunities.<br><br>

<strong>PROFESSIONAL RECOMMENDATION:</strong><br>
For specific clause-by-clause analysis and personalized guidance based on your business context, schedule a consultation to discuss the particular circumstances of your situation.`
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