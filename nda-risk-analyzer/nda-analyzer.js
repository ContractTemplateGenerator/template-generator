const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('technology');
    const [ndaUrl, setNdaUrl] = useState('');
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    const fileInputRef = useRef(null);

    // Simple fallback response
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

<strong>PROFESSIONAL RECOMMENDATION:</strong><br>
For specific clause-by-clause analysis and personalized guidance based on your business context, schedule a consultation to discuss the particular circumstances of your situation.`
    };

    // Handle file upload
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

    // Analyze NDA
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        const userMessage = { 
            role: 'user', 
            content: `Please analyze this NDA and provide professional legal analysis. Consider the industry context: ${industry}.\n\nNDA TEXT:\n${ndaText}` 
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
                    recommendation: 'PROFESSIONAL ANALYSIS',
                    model: data.model || 'AI Analysis',
                    provider: data.provider || (useClaudeAI ? 'Anthropic Claude 4.0' : 'Groq Llama')
                });
            } else {
                throw new Error('No response content received from API');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            
            setAnalysisResult({
                htmlContent: fallbackResponses.default,
                recommendation: 'FALLBACK ANALYSIS',
                model: 'Professional Fallback Analysis',
                provider: 'Terms.law Legal Guidance'
            });
        } finally {
            setIsAnalyzing(false);
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

    return (
        <div className="nda-analyzer">
            <div className="header">
                <h1>🛡️ NDA Risk Analyzer</h1>
                <p>Professional Legal Analysis & Document Review System</p>
                <div className="attorney-info">
                    Sergei Tokmakov, Esq. • CA Bar #279869 • 13+ Years Experience
                </div>
            </div>

            <div className="main-content">
                {/* Input Section */}
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
                                or click to browse • Plain text files
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
                            <div className="url-input-header">Or enter URL to document:</div>
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
                            placeholder="Paste your NDA text here for professional legal analysis...

We'll analyze risks and considerations for both parties and provide specific recommendations.

Example: 'This Non-Disclosure Agreement is entered into between Company A and Company B for the purpose of...'

The more complete the text, the more detailed the analysis."
                            value={ndaText}
                            onChange={(e) => setNdaText(e.target.value)}
                        />
                    </div>

                    <div className="analysis-options">
                        <div className="option-group">
                            <label>Industry Context:</label>
                            <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
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
                                Analyzing Agreement...
                            </>
                        ) : (
                            <>
                                <i data-feather="shield"></i>
                                Analyze NDA Risk
                            </>
                        )}
                    </button>
                </div>

                {/* Analysis Panel */}
                <div className="analysis-panel">
                    <h2>
                        <i data-feather="file-text"></i>
                        Professional Legal Analysis
                    </h2>

                    <div className="analysis-content">
                        {!analysisResult ? (
                            <div className="waiting-state">
                                <div className="waiting-icon">⚖️</div>
                                <div className="waiting-text">Ready to Analyze Your NDA</div>
                                <div className="waiting-subtext">
                                    Upload a document or paste your NDA text to get sophisticated legal analysis from an experienced California attorney.
                                </div>
                            </div>
                        ) : (
                            <div className="analysis-results">
                                <div className="recommendation-card analysis">
                                    <h3>
                                        <span className="recommendation-icon">⚖️</span>
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