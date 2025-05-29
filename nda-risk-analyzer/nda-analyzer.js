const { useState, useRef, useEffect } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('technology');
    const [ndaUrl, setNdaUrl] = useState('');
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    
    // Redraft system
    const [selectedChanges, setSelectedChanges] = useState({});
    const [redraftOptions, setRedraftOptions] = useState([]);
    const [showRedraftPreview, setShowRedraftPreview] = useState(false);
    
    const fileInputRef = useRef(null);

    // Add event listeners for checkboxes in HTML content
    useEffect(() => {
        const checkboxes = document.querySelectorAll('.redraft-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const changeId = e.target.closest('.redraft-option')?.getAttribute('data-change-id');
                if (changeId) {
                    handleRedraftChange(changeId, e.target.checked);
                }
            });
        });

        // Cleanup
        return () => {
            checkboxes.forEach(checkbox => {
                checkbox.removeEventListener('change', () => {});
            });
        };
    }, [analysisResult]);

    // Enhanced fallback response with redraft options
    const fallbackResponses = {
        "default": `
        <div class="analysis-header">
            <h3>🛡️ NDA Risk Analysis</h3>
            <p><strong>Document:</strong> General NDA Analysis</p>
            <p><strong>Analyst:</strong> California Attorney Sergei Tokmakov (CA Bar #279869)</p>
        </div>

        <div class="recommendation acceptable">
            MODERATE RISK - CONTEXT DEPENDENT
        </div>

        <div class="section">
            <div class="section-title">DOCUMENT OVERVIEW</div>
            <p>Professional legal analysis requires reviewing specific NDA clauses, but I can provide general guidance based on common NDA structures and typical issues found in confidentiality agreements.</p>
        </div>

        <div class="section">
            <div class="section-title">CLAUSE-BY-CLAUSE ANALYSIS</div>

            <div class="clause-analysis-item">
                <p><strong>CLAUSE:</strong> Confidentiality Definition</p>
                <p><strong>RISK LEVEL:</strong> <span class="risk-yellow">MEDIUM RISK</span></p>
                <p><strong>ISSUE:</strong> Many NDAs use overly broad definitions like "all information shared"</p>
                <div class="quote">
                    <strong>COMMON PROBLEMATIC TEXT:</strong> "All information, whether written or oral, disclosed by either party"
                </div>
                <div class="redraft-option" data-change-id="confidentiality-definition">
                    <input type="checkbox" id="change-1" class="redraft-checkbox">
                    <label for="change-1">
                        <strong>SUGGESTED IMPROVEMENT:</strong> "Information that is (a) clearly marked as 'Confidential' or (b) identified as confidential at the time of disclosure and confirmed in writing within 30 days"
                    </label>
                </div>
            </div>

            <div class="clause-analysis-item">
                <p><strong>CLAUSE:</strong> Term Duration</p>
                <p><strong>RISK LEVEL:</strong> <span class="risk-yellow">MEDIUM RISK</span></p>
                <p><strong>ISSUE:</strong> Indefinite or excessively long confidentiality periods</p>
                <div class="quote">
                    <strong>COMMON PROBLEMATIC TEXT:</strong> "This agreement shall remain in effect in perpetuity"
                </div>
                <div class="redraft-option" data-change-id="term-duration">
                    <input type="checkbox" id="change-2" class="redraft-checkbox">
                    <label for="change-2">
                        <strong>SUGGESTED IMPROVEMENT:</strong> "The confidentiality obligations shall expire three (3) years from the date of disclosure of each item of Confidential Information"
                    </label>
                </div>
            </div>

            <div class="clause-analysis-item">
                <p><strong>CLAUSE:</strong> Standard Exceptions</p>
                <p><strong>RISK LEVEL:</strong> <span class="risk-red">HIGH RISK</span></p>
                <p><strong>ISSUE:</strong> Missing standard exceptions that protect the receiving party</p>
                <div class="quote">
                    <strong>MISSING PROTECTION:</strong> No exceptions for publicly available information
                </div>
                <div class="redraft-option" data-change-id="standard-exceptions">
                    <input type="checkbox" id="change-3" class="redraft-checkbox">
                    <label for="change-3">
                        <strong>SUGGESTED ADDITION:</strong> "The obligations herein shall not apply to information that: (a) is or becomes publicly available through no breach by Receiving Party; (b) was rightfully known prior to disclosure; (c) is independently developed; or (d) is required to be disclosed by law"
                    </label>
                </div>
            </div>

            <div class="clause-analysis-item">
                <p><strong>CLAUSE:</strong> Return of Materials</p>
                <p><strong>RISK LEVEL:</strong> <span class="risk-green">LOW RISK</span></p>
                <p><strong>ISSUE:</strong> Standard provision but can be improved</p>
                <div class="quote">
                    <strong>TYPICAL TEXT:</strong> "Return all confidential information upon request"
                </div>
                <div class="redraft-option" data-change-id="return-materials">
                    <input type="checkbox" id="change-4" class="redraft-checkbox">
                    <label for="change-4">
                        <strong>SUGGESTED IMPROVEMENT:</strong> "Upon termination or written request, return or destroy all Confidential Information, except that copies may be retained in legal files for compliance purposes and information in electronic backup systems may be retained subject to continuing confidentiality obligations"
                    </label>
                </div>
            </div>

            <div class="clause-analysis-item">
                <p><strong>CLAUSE:</strong> Remedies</p>
                <p><strong>RISK LEVEL:</strong> <span class="risk-yellow">MEDIUM RISK</span></p>
                <p><strong>ISSUE:</strong> One-sided remedy provisions favoring disclosing party</p>
                <div class="quote">
                    <strong>COMMON PROBLEMATIC TEXT:</strong> "Disclosing party shall be entitled to injunctive relief and monetary damages"
                </div>
                <div class="redraft-option" data-change-id="remedies-balance">
                    <input type="checkbox" id="change-5" class="redraft-checkbox">
                    <label for="change-5">
                        <strong>SUGGESTED IMPROVEMENT:</strong> "The parties acknowledge that breach may cause irreparable harm and that either party may seek equitable relief. The availability of equitable relief shall not limit other available remedies"
                    </label>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">RECOMMENDATIONS SUMMARY</div>
            <p><strong>For Disclosing Party:</strong> Ensure confidentiality definition is clear and enforceable while not overly broad<br>
            <strong>For Receiving Party:</strong> Negotiate for standard exceptions and reasonable time limits<br>
            <strong>For Both Parties:</strong> Include balanced remedy provisions and clear termination procedures</p>
        </div>
        `
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
                
                // Try to extract redraft options from AI response
                // This is a simplified approach - in production, you'd want more sophisticated parsing
                const extractedOptions = [];
                if (data.response.includes('SUGGESTED')) {
                    // For now, use the same fallback options for any AI response
                    // In production, you'd parse the actual AI suggestions
                    setRedraftOptions([
                        {
                            id: 'ai-suggestion-1',
                            title: 'AI-Identified Issue #1',
                            original: 'Issue identified by AI analysis',
                            improved: 'AI-suggested improvement based on your specific NDA'
                        }
                    ]);
                } else {
                    setRedraftOptions([]);
                }
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
            
            // Initialize redraft options for fallback
            setRedraftOptions([
                {
                    id: 'confidentiality-definition',
                    title: 'Confidentiality Definition',
                    original: 'All information, whether written or oral, disclosed by either party',
                    improved: 'Information that is (a) clearly marked as "Confidential" or (b) identified as confidential at the time of disclosure and confirmed in writing within 30 days'
                },
                {
                    id: 'term-duration',
                    title: 'Term Duration',
                    original: 'This agreement shall remain in effect in perpetuity',
                    improved: 'The confidentiality obligations shall expire three (3) years from the date of disclosure of each item of Confidential Information'
                },
                {
                    id: 'standard-exceptions',
                    title: 'Standard Exceptions',
                    original: '',
                    improved: 'The obligations herein shall not apply to information that: (a) is or becomes publicly available through no breach by Receiving Party; (b) was rightfully known prior to disclosure; (c) is independently developed; or (d) is required to be disclosed by law'
                },
                {
                    id: 'return-materials',
                    title: 'Return of Materials',
                    original: 'Return all confidential information upon request',
                    improved: 'Upon termination or written request, return or destroy all Confidential Information, except that copies may be retained in legal files for compliance purposes and information in electronic backup systems may be retained subject to continuing confidentiality obligations'
                },
                {
                    id: 'remedies-balance',
                    title: 'Remedies',
                    original: 'Disclosing party shall be entitled to injunctive relief and monetary damages',
                    improved: 'The parties acknowledge that breach may cause irreparable harm and that either party may seek equitable relief. The availability of equitable relief shall not limit other available remedies'
                }
            ]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Handle checkbox changes for redraft options
    const handleRedraftChange = (changeId, isChecked) => {
        setSelectedChanges(prev => ({
            ...prev,
            [changeId]: isChecked
        }));
    };

    // Generate redrafted document
    const generateRedraft = () => {
        if (Object.keys(selectedChanges).length === 0) {
            alert('Please select at least one improvement to generate a redraft.');
            return;
        }

        let redraftedDocument = ndaText || `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between the parties for the purpose of protecting confidential information.

[Original agreement text would appear here with selected improvements applied]

IMPROVEMENTS APPLIED:
`;

        // Add selected improvements
        redraftOptions.forEach(option => {
            if (selectedChanges[option.id]) {
                redraftedDocument += `\n${option.title.toUpperCase()}:
Original: ${option.original || 'Not specified in original agreement'}
Improved: ${option.improved}

`;
            }
        });

        redraftedDocument += `
LEGAL DISCLAIMER:
This redrafted agreement incorporates the selected improvements based on professional legal analysis. This document should be reviewed by qualified legal counsel before execution.

Analysis provided by: Sergei Tokmakov, Esq., CA Bar #279869
Date: ${new Date().toLocaleDateString()}`;

        return redraftedDocument;
    };

    // Copy redraft to clipboard
    const copyRedraftToClipboard = async () => {
        const redraft = generateRedraft();
        if (!redraft) return;

        try {
            await navigator.clipboard.writeText(redraft);
            alert('Redrafted NDA copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = redraft;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Redrafted NDA copied to clipboard!');
        }
    };

    // Download redraft as text file
    const downloadRedraft = () => {
        const redraft = generateRedraft();
        if (!redraft) return;

        const blob = new Blob([redraft], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Redrafted_NDA_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

                                {/* Redraft Options Interface */}
                                {redraftOptions.length > 0 && (
                                    <div className="redraft-interface">
                                        <h3 className="redraft-title">
                                            📝 Select Improvements for Your Redraft
                                        </h3>
                                        <p className="redraft-subtitle">
                                            Choose which suggestions to include in your customized NDA:
                                        </p>
                                        
                                        <div className="redraft-options">
                                            {redraftOptions.map((option) => (
                                                <div key={option.id} className="redraft-option-card">
                                                    <div className="option-header">
                                                        <input
                                                            type="checkbox"
                                                            id={`redraft-${option.id}`}
                                                            className="redraft-checkbox"
                                                            checked={selectedChanges[option.id] || false}
                                                            onChange={(e) => handleRedraftChange(option.id, e.target.checked)}
                                                        />
                                                        <label htmlFor={`redraft-${option.id}`} className="option-title">
                                                            {option.title}
                                                        </label>
                                                    </div>
                                                    
                                                    {option.original && (
                                                        <div className="original-text">
                                                            <strong>Current:</strong> "{option.original}"
                                                        </div>
                                                    )}
                                                    
                                                    <div className="improved-text">
                                                        <strong>Improved:</strong> "{option.improved}"
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Redraft Action Buttons */}
                                        <div className="redraft-actions">
                                            <div className="redraft-buttons">
                                                <button 
                                                    className="redraft-btn copy-btn"
                                                    onClick={copyRedraftToClipboard}
                                                    disabled={Object.keys(selectedChanges).length === 0}
                                                >
                                                    <i data-feather="copy"></i>
                                                    Copy Redraft
                                                </button>
                                                
                                                <button 
                                                    className="redraft-btn download-btn"
                                                    onClick={downloadRedraft}
                                                    disabled={Object.keys(selectedChanges).length === 0}
                                                >
                                                    <i data-feather="download"></i>
                                                    Download Redraft
                                                </button>
                                                
                                                <button 
                                                    className="redraft-btn preview-btn"
                                                    onClick={() => setShowRedraftPreview(!showRedraftPreview)}
                                                    disabled={Object.keys(selectedChanges).length === 0}
                                                >
                                                    <i data-feather="eye"></i>
                                                    {showRedraftPreview ? 'Hide Preview' : 'Preview Redraft'}
                                                </button>
                                            </div>
                                            
                                            <div className="selected-count">
                                                {Object.values(selectedChanges).filter(Boolean).length} improvement(s) selected
                                            </div>
                                        </div>

                                        {/* Redraft Preview */}
                                        {showRedraftPreview && Object.keys(selectedChanges).length > 0 && (
                                            <div className="redraft-preview">
                                                <h4>📄 Redraft Preview</h4>
                                                <div className="preview-content">
                                                    <pre>{generateRedraft()}</pre>
                                                </div>
                                            </div>
                                        )}
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
                                        className="action-button outline"
                                        onClick={() => {
                                            setAnalysisResult(null);
                                            setNdaText('');
                                            setSelectedChanges({});
                                            setRedraftOptions([]);
                                            setShowRedraftPreview(false);
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