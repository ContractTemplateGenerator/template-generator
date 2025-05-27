const { useState, useEffect, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('auto-detect');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [ndaUrl, setNdaUrl] = useState('');
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

    // Handle URL input
    const handleUrlSubmit = async () => {
        if (!ndaUrl.trim()) return;
        
        try {
            setIsAnalyzing(true);
            const response = await fetch(ndaUrl);
            const text = await response.text();
            
            // Simple text extraction (in production, use proper HTML parsing)
            const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            setNdaText(cleanText);
        } catch (error) {
            alert('Could not fetch content from URL. Please try copying the text directly.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Analyze NDA using Vercel API endpoint
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please provide an NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        try {
            console.log('Starting NDA analysis...', { 
                textLength: ndaText.length, 
                industry 
            });
            
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-groq-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Analyze this NDA and determine: "Is it okay to sign as-is?" 

Industry: ${industry}

Please provide your analysis in HTML format with:
- RECOMMENDATION: DO NOT SIGN / SIGN WITH CAUTION / ACCEPTABLE TO SIGN
- WHY: Brief explanation
- DOCUMENT SUMMARY: What this NDA does
- KEY ISSUES: List major problems with risk levels (RED/YELLOW/GREEN)
- SUGGESTED CHANGES: Specific improvements needed
- BOTTOM LINE: Final recommendation

NDA Text:
${ndaText}`,
                    contractType: 'NDA Risk Analysis'
                }),
            });

            console.log('API Response Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response Data:', data);
            
            // Parse the HTML response into a structured format for display
            const analysisData = parseAnalysisResponse(data.response);
            setAnalysisResult(analysisData);
        } catch (error) {
            console.error('Analysis error:', error);
            // More specific error handling
            if (error.message.includes('Failed to fetch')) {
                setAnalysisResult({
                    htmlContent: `<strong>Connection Issue</strong><br><br>
                    Unable to connect to our analysis service. Please check your internet connection and try again.<br><br>
                    <strong>Alternative Options:</strong><br>
                    • Try refreshing the page and analyzing again<br>
                    • Copy your NDA text to ChatGPT or Claude for quick analysis<br>
                    • Schedule a consultation for professional legal review`,
                    recommendation: 'CONNECTION ERROR'
                });
            } else {
                setAnalysisResult({
                    htmlContent: `<strong>Service Temporarily Unavailable</strong><br><br>
                    Our AI analysis service is currently experiencing issues. Here are your options:<br><br>
                    <strong>Option 1:</strong> Try again in a few minutes<br><br>
                    <strong>Option 2:</strong> Copy your NDA text and paste it into ChatGPT or Claude for quick analysis<br><br>
                    <strong>Option 3:</strong> For professional legal review, you can schedule a consultation<br><br>
                    <em>We apologize for the inconvenience and are working to restore service.</em>`,
                    recommendation: 'SERVICE UNAVAILABLE'
                });
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Parse the response from the API
    const parseAnalysisResponse = (apiResponse) => {
        // Extract recommendation from the response
        let recommendation = 'SIGN WITH CAUTION';
        
        const lowerResponse = apiResponse.toLowerCase();
        if (lowerResponse.includes('not recommended') || lowerResponse.includes('do not sign')) {
            recommendation = 'DO NOT SIGN';
        } else if (lowerResponse.includes('acceptable') || lowerResponse.includes('okay to sign')) {
            recommendation = 'ACCEPTABLE TO SIGN';
        }
        
        // Convert plain text response to HTML format for better display
        const htmlContent = apiResponse
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/(\d+\.\s)/g, '<br>$1');
        
        return {
            htmlContent: htmlContent,
            recommendation: recommendation
        };
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
        if (recommendation.includes('SERVICE UNAVAILABLE') || recommendation.includes('CONNECTION ERROR')) return 'service-unavailable';
        return 'caution';
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
                        
                        <div className="url-input-section">
                            <div className="url-input-header">Or enter URL to NDA:</div>
                            <div className="url-input-group">
                                <input
                                    type="url"
                                    className="url-input"
                                    placeholder="https://example.com/nda-document.pdf"
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
                            placeholder="Or paste your NDA text here for instant analysis..."
                            value={ndaText}
                            onChange={(e) => setNdaText(e.target.value)}
                        />
                    </div>

                    <div className="analysis-options">
                        <div className="options-grid">
                            <div className="option-group">
                                <label>Industry Context:</label>
                                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                                    <option value="auto-detect">Auto-detect from NDA</option>
                                    <option value="technology">Technology/Software</option>
                                    <option value="healthcare">Healthcare/Medical</option>
                                    <option value="finance">Finance/Banking</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="retail">Retail/E-commerce</option>
                                    <option value="consulting">Consulting/Services</option>
                                    <option value="real-estate">Real Estate</option>
                                    <option value="other">Other/Multiple Industries</option>
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
                        Legal Analysis Report
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
                                {/* Primary Recommendation Card */}
                                <div className={`recommendation-card ${getRecommendationClass(analysisResult.recommendation)}`}>
                                    <h3>
                                        <i data-feather="alert-triangle"></i>
                                        Is it okay to sign as-is?
                                    </h3>
                                    <div className="recommendation-answer">
                                        <strong>{analysisResult.recommendation || 'SIGN WITH CAUTION'}</strong>
                                    </div>
                                </div>

                                {/* Legal Analysis Content */}
                                <div className="legal-analysis-content">
                                    <div 
                                        dangerouslySetInnerHTML={{ 
                                            __html: analysisResult.htmlContent || 'Analysis unavailable. Please try again or schedule a consultation.' 
                                        }}
                                    />
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

                                {/* Professional Disclaimer */}
                                <div className="professional-disclaimer">
                                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#64748b', marginTop: '20px' }}>
                                        This analysis is provided for informational purposes only and does not constitute legal advice. 
                                        For specific legal guidance tailored to your situation, schedule a consultation with attorney Sergei Tokmakov.
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