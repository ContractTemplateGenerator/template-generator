const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('auto-detect');
    const [ndaUrl, setNdaUrl] = useState('');
    const fileInputRef = useRef(null);

    // Handle file upload (text files only for now)
    const handleFileUpload = async (file) => {
        if (!file) return;

        try {
            // Only handle plain text files to avoid corruption
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const text = await file.text();
                setNdaText(text);
            } else {
                alert('Please upload a plain text (.txt) file, or copy and paste your NDA text directly into the text area below.');
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
            // Simple CORS proxy for demonstration - in production use proper backend
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(ndaUrl)}`);
            const data = await response.json();
            
            if (data.contents) {
                // Simple text extraction
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

    // Analyze NDA using Vercel API
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        try {
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ndaText: ndaText,
                    industry: industry
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            setAnalysisResult({
                htmlContent: data.response,
                recommendation: extractRecommendation(data.response)
            });
        } catch (error) {
            console.error('Analysis error:', error);
            // Simple fallback without pushy sales message
            setAnalysisResult({
                htmlContent: `<strong>Analysis temporarily unavailable.</strong><br><br>
                Our AI analysis service is currently experiencing high demand. Please try again in a few minutes.<br><br>
                <strong>In the meantime:</strong><br>
                • Review the NDA carefully for any unusual terms<br>
                • Look for one-sided obligations<br>
                • Check the duration and scope<br>
                • Consider having it reviewed by an attorney if it contains complex terms`,
                recommendation: 'TRY AGAIN LATER'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Extract recommendation from response
    const extractRecommendation = (htmlResponse) => {
        const match = htmlResponse.match(/<strong>RECOMMENDATION:<\/strong>\s*([^<]+)/);
        return match ? match[1].trim() : 'REVIEW NEEDED';
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

    // Get recommendation styling class
    const getRecommendationClass = (recommendation) => {
        if (!recommendation) return 'caution';
        if (recommendation.includes('DO NOT SIGN')) return 'do-not-sign';
        if (recommendation.includes('ACCEPTABLE')) return 'acceptable';
        if (recommendation.includes('TRY AGAIN')) return 'unavailable';
        return 'caution';
    };
    return (
        <div className="nda-analyzer">
            <div className="header">
                <h1>🛡️ NDA Risk Analyzer</h1>
                <p>Professional Legal Analysis by California Attorney</p>
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
                                or click to browse • Plain text files only for now
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
                            placeholder="Paste your NDA text here for instant analysis...

Example: 'This Non-Disclosure Agreement is entered into between Company A and Company B for the purpose of...'

The more complete the text, the better the analysis."
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
                        Legal Analysis Report
                    </h2>

                    <div className="analysis-content">
                        {!analysisResult ? (
                            <div className="waiting-state">
                                <div className="waiting-icon">⚖️</div>
                                <div className="waiting-text">Ready to analyze your NDA</div>
                                <div className="waiting-subtext">
                                    Paste your NDA text and click "Analyze NDA Risk" to get professional legal analysis
                                </div>
                            </div>
                        ) : (
                            <div className="analysis-results">
                                {/* Primary Recommendation Card */}
                                <div className={`recommendation-card ${getRecommendationClass(analysisResult.recommendation)}`}>
                                    <h3>
                                        <i data-feather="alert-triangle"></i>
                                        Is it okay to sign as-is?
                                    </h3>
                                    <div className="recommendation-answer">
                                        <strong>{analysisResult.recommendation}</strong>
                                    </div>
                                </div>

                                {/* Legal Analysis Content */}
                                <div className="legal-analysis-content">
                                    <div 
                                        dangerouslySetInnerHTML={{ 
                                            __html: analysisResult.htmlContent 
                                        }}
                                    />
                                </div>

                                {/* Action Buttons - Only show if analysis was successful */}
                                {!analysisResult.recommendation.includes('TRY AGAIN') && (
                                    <div className="action-buttons">
                                        <button 
                                            className="action-button primary"
                                            onClick={scheduleConsultation}
                                        >
                                            <i data-feather="calendar"></i>
                                            Schedule Attorney Review - $149
                                        </button>
                                        <button 
                                            className="action-button outline"
                                            onClick={() => window.print()}
                                        >
                                            <i data-feather="printer"></i>
                                            Print Analysis
                                        </button>
                                    </div>
                                )}

                                {/* Professional Disclaimer */}
                                <div className="professional-disclaimer">
                                    <p>
                                        This analysis is provided for informational purposes only and does not constitute legal advice. 
                                        For specific legal guidance, consult with a qualified attorney.
                                    </p>
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