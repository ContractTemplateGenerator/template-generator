const { useState, useRef } = React;
const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    const [ndaUrl, setNdaUrl] = useState('');
    const [extractedData, setExtractedData] = useState({ parties: [], businessPurpose: '', jurisdiction: '' });
    const [selectedChanges, setSelectedChanges] = useState({});
    const [personalizedSuggestions, setPersonalizedSuggestions] = useState([]);
    const [showRedraftPreview, setShowRedraftPreview] = useState(false);
    const fileInputRef = useRef(null);

    const extractNDAData = (text) => {
        const data = { parties: [], businessPurpose: '', jurisdiction: '' };
        const partyMatches = text.match(/\b([A-Z][A-Za-z\s]+(?:Inc|LLC|Corp|Ltd|Company)\.?)\b/g);
        if (partyMatches) data.parties = [...new Set(partyMatches.map(p => p.trim()))].slice(0, 2);
        const purposeMatch = text.match(/(?:purpose of|in connection with|relating to)\s+([^.\n]{10,100})/i);
        if (purposeMatch) data.businessPurpose = purposeMatch[1].trim();
        const jurisdictionMatch = text.match(/(?:governed by|jurisdiction of|laws of)\s+(?:the\s+)?([^,.\n]+)/i);
        if (jurisdictionMatch) data.jurisdiction = jurisdictionMatch[1].trim();
        return data;
    };

    const extractPersonalizedSuggestions = (aiResponse) => {
        const suggestions = [];
        const lines = aiResponse.split('\n');
        let currentCategory = '';
        for (let line of lines) {
            line = line.trim();
            if (line.includes('Favoring First Party')) currentCategory = 'favoringParty1';
            else if (line.includes('Favoring Second Party')) currentCategory = 'favoringParty2';
            else if (line.includes('Neutral') || line.includes('Mutual')) currentCategory = 'neutral';
            if ((line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) && currentCategory) {
                const suggestionText = line.replace(/^[•\-*]\s*/, '').trim();
                if (suggestionText) {
                    suggestions.push({ 
                        id: `suggestion_${suggestions.length}`, 
                        category: currentCategory, 
                        title: suggestionText.substring(0, 60), 
                        description: suggestionText, 
                        originalText: 'Current agreement language', 
                        improvedText: suggestionText 
                    });
                }
            }
        }
        return suggestions;
    };
    const handleFileUpload = async (file) => {
        if (!file) return;
        try {
            let text = '';
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                text = await file.text();
            } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                alert('PDF support: Please copy text content for now. Full PDF support coming soon.');
                return;
            } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                alert('Word support: Please copy text content for now. Full Word support coming soon.');
                return;
            } else {
                alert('Please upload .txt files or paste text directly.');
                return;
            }
            setNdaText(text);
            setExtractedData(extractNDAData(text));
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error reading file. Please paste text directly.');
        }
    };

    const handleUrlSubmit = async () => {
        if (!ndaUrl.trim()) return;
        setIsAnalyzing(true);
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(ndaUrl)}`;
            const response = await fetch(proxyUrl);
            if (response.ok) {
                const data = await response.json();
                let content = data.contents;
                content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
                content = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                if (content.length > 50) {
                    setNdaText(content);
                    setExtractedData(extractNDAData(content));
                } else {
                    throw new Error('No meaningful content found');
                }
            } else {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
        } catch (error) {
            console.error('URL fetch error:', error);
            alert('Could not fetch URL content. Please check URL or paste text directly.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleTextChange = (text) => {
        setNdaText(text);
        if (text.trim().length > 100) {
            setExtractedData(extractNDAData(text));
        }
    };
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }
        setIsAnalyzing(true);
        const party1 = extractedData.parties[0] || 'First Party';
        const party2 = extractedData.parties[1] || 'Second Party';
        
        const personalizedPrompt = `Please analyze this NDA between ${party1} and ${party2}. 
KEY CONTEXT: - Parties: ${party1} and ${party2} - Business Purpose: ${extractedData.businessPurpose || 'Not specified'} - Jurisdiction: ${extractedData.jurisdiction || 'Not specified'}

IMPORTANT: Please structure your response with clear sections for:
**PERSONALIZED REDRAFT SUGGESTIONS:**
• Improvements Favoring First Party: [list specific suggestions]
• Neutral/Mutual Improvements: [list balanced suggestions]  
• Improvements Favoring Second Party: [list specific suggestions]

NDA TEXT: ${ndaText}`;
        
        try {
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: personalizedPrompt }], useClaudeAI: useClaudeAI, extractedData: extractedData })
            });
            
            if (response.ok) {
                const data = await response.json();
                setAnalysisResult({ htmlContent: data.response, recommendation: 'PERSONALIZED ANALYSIS', model: data.model, provider: data.provider });
                const suggestions = extractPersonalizedSuggestions(data.response);
                setPersonalizedSuggestions(suggestions);
                console.log('Extracted suggestions:', suggestions);
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            const fallbackHtml = `<div class="analysis-header"><h3>🛡️ Personalized NDA Risk Analysis</h3><p><strong>Parties:</strong> ${party1} and ${party2}</p></div><div class="recommendation moderate">CONTEXT-SPECIFIC ANALYSIS REQUIRED</div><div class="section"><div class="section-title">PERSONALIZED ASSESSMENT</div><p>This NDA involves <strong>${party1}</strong> and <strong>${party2}</strong>. Professional analysis requires reviewing specific clauses.</p></div>`;
            setAnalysisResult({ htmlContent: fallbackHtml, recommendation: 'PERSONALIZED FALLBACK ANALYSIS', model: 'Professional Analysis', provider: 'Terms.law Legal Guidance' });
            const fallbackSuggestions = [
                { id: 'suggestion_0', category: 'favoringParty1', title: `Broader Protection for ${party1}`, description: `Add stronger confidentiality protections for ${party1}`, originalText: 'Current agreement language', improvedText: `Enhanced protection clauses favoring ${party1}` },
                { id: 'suggestion_1', category: 'neutral', title: 'Equal Termination Rights', description: 'Both parties have equal termination rights', originalText: 'Current agreement language', improvedText: 'Equal 30-day notice period for both parties' },
                { id: 'suggestion_2', category: 'favoringParty2', title: `Narrower Scope for ${party2}`, description: `Reduce compliance burden for ${party2}`, originalText: 'Current agreement language', improvedText: `Limited obligations for ${party2}` }
            ];
            setPersonalizedSuggestions(fallbackSuggestions);
        } finally {
            setIsAnalyzing(false);
        }
    };
    const handleSuggestionChange = (suggestionId, isSelected) => {
        setSelectedChanges(prev => ({ ...prev, [suggestionId]: isSelected }));
    };

    const generateFinalRedraft = () => {
        const party1 = extractedData.parties[0] || 'First Party';
        const party2 = extractedData.parties[1] || 'Second Party';
        let redraftedText = `REDRAFTED NON-DISCLOSURE AGREEMENT\n\nBetween: ${party1} and ${party2}\n\nPERSONALIZED IMPROVEMENTS APPLIED:\n\n`;
        
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        
        const categories = {
            favoringParty1: `IMPROVEMENTS FAVORING ${party1.toUpperCase()}`,
            neutral: 'NEUTRAL/MUTUAL IMPROVEMENTS',
            favoringParty2: `IMPROVEMENTS FAVORING ${party2.toUpperCase()}`
        };
        
        Object.keys(categories).forEach(category => {
            const categorySuggestions = selectedSuggestions.filter(s => s.category === category);
            if (categorySuggestions.length > 0) {
                redraftedText += `\n${categories[category]}:\n`;
                categorySuggestions.forEach(suggestion => {
                    redraftedText += `\n• ${suggestion.title}:\n`;
                    redraftedText += `  Original: ${suggestion.originalText}\n`;
                    redraftedText += `  Improved: ${suggestion.improvedText}\n\n`;
                });
            }
        });
        
        if (ndaText) {
            redraftedText += `\nORIGINAL AGREEMENT TEXT:\n${ndaText}\n\n`;
        }
        
        redraftedText += `ATTORNEY CERTIFICATION:\nThis redraft incorporates personalized legal analysis.\nAnalysis by: Sergei Tokmakov, Esq.\nCalifornia Bar #279869\nDate: ${new Date().toLocaleDateString()}`;
        return redraftedText;
    };

    const generateHighlightedPreview = () => {
        const baseText = generateFinalRedraft();
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        let highlightedText = baseText;
        
        selectedSuggestions.forEach(suggestion => {
            const highlightPattern = new RegExp(`(${suggestion.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            highlightedText = highlightedText.replace(highlightPattern, '<mark class="highlight-change">$1</mark>');
        });
        
        return highlightedText;
    };

    const copyRedraftToClipboard = async () => {
        const redraft = generateFinalRedraft();
        try {
            await navigator.clipboard.writeText(redraft);
            alert('Personalized redraft copied to clipboard!');
        } catch (error) {
            const textArea = document.createElement('textarea');
            textArea.value = redraft;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Personalized redraft copied to clipboard!');
        }
    };

    const downloadRedraft = () => {
        const redraft = generateFinalRedraft();
        const blob = new Blob([redraft], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Personalized_NDA_Redraft_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const scheduleConsultation = () => {
        if (window.Calendly) {
            window.Calendly.initPopupWidget({ url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1' });
        } else {
            window.open('https://terms.law/call/', '_blank');
        }
    };

    const getTotalSelectedChanges = () => {
        return Object.values(selectedChanges).filter(Boolean).length;
    };

    return (
        <div className="nda-analyzer full-width">
            <div className="header">
                <h1>🛡️ Personalized NDA Risk Analyzer</h1>
                <p>Hyper-Personalized Legal Analysis & Smart Redrafting System</p>
                <div className="attorney-info">Sergei Tokmakov, Esq. • CA Bar #279869 • 13+ Years Experience</div>
                {extractedData.parties.length > 0 && (
                    <div className="extracted-info">Analyzing Agreement Between: <strong>{extractedData.parties.join(' and ')}</strong></div>
                )}
            </div>

            <div className="input-section-fullwidth">
                <h2><i data-feather="upload-cloud"></i> Upload or Paste Your NDA</h2>
                
                <div className="upload-section">
                    <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
                        <div className="upload-icon">📄</div>
                        <div className="upload-text">Drop files here or click to browse</div>
                        <div className="upload-subtext">Supports .txt files • PDF & Word coming soon</div>
                        <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx,text/plain,application/pdf" onChange={(e) => handleFileUpload(e.target.files[0])} style={{ display: 'none' }} />
                    </div>
                    
                    <div className="url-input-section">
                        <div className="url-input-header">Or fetch from URL (SEC filings, etc.):</div>
                        <div className="url-input-group">
                            <input type="url" className="url-input" placeholder="https://www.sec.gov/Archives/edgar/..." value={ndaUrl} onChange={(e) => setNdaUrl(e.target.value)} />
                            <button className="url-submit-btn" onClick={handleUrlSubmit} disabled={!ndaUrl.trim() || isAnalyzing}>Fetch</button>
                        </div>
                    </div>
                </div>

                <div className="text-input-section-fullwidth">
                    <textarea className="nda-textarea-fullwidth" placeholder="Paste your NDA text here for personalized legal analysis...

I'll extract party names, specific terms, section numbers, and other details to provide hyper-personalized analysis and redrafting suggestions.

Example: 'This Non-Disclosure Agreement is entered into between ABC Corporation and XYZ LLC for the purpose of evaluating a potential merger...'

The more complete the text, the more personalized the analysis." value={ndaText} onChange={(e) => handleTextChange(e.target.value)} />
                </div>

                <div className="analysis-options-fullwidth">
                    <div className="ai-toggle-group">
                        <label>AI Analysis Provider:</label>
                        <div className="ai-toggle-container">
                            <div className="ai-toggle-switch">
                                <input type="checkbox" id="ai-toggle" checked={useClaudeAI} onChange={(e) => setUseClaudeAI(e.target.checked)} />
                                <label htmlFor="ai-toggle" className="toggle-label"><span className="toggle-slider"></span></label>
                            </div>
                            <div className="ai-provider-labels">
                                <span className={`provider-label ${!useClaudeAI ? 'active' : ''}`}>🚀 Llama (Default)</span>
                                <span className={`provider-label ${useClaudeAI ? 'active' : ''}`}>🧠 Claude 4.0 (Advanced)</span>
                            </div>
                        </div>
                    </div>

                    <button className="analyze-button-fullwidth" onClick={analyzeNDA} disabled={!ndaText.trim() || isAnalyzing}>
                        {isAnalyzing ? <><div className="loading-spinner"></div>Analyzing & Extracting Details...</> : <><i data-feather="shield"></i>Analyze & Personalize NDA</>}
                    </button>
                </div>
            </div>
            <div className="analysis-panel-fullwidth">
                <h2><i data-feather="file-text"></i> Personalized Legal Analysis & Smart Redrafting</h2>
                
                <div className="analysis-content-fullwidth">
                    {!analysisResult ? (
                        <div className="waiting-state">
                            <div className="waiting-icon">⚖️</div>
                            <div className="waiting-text">Ready for Personalized Analysis</div>
                            <div className="waiting-subtext">Upload your NDA to get analysis using actual party names, specific terms, and contextual recommendations.</div>
                            {extractedData.parties.length > 0 && (
                                <div className="extraction-preview">
                                    <h4>📋 Detected Information:</h4>
                                    <p><strong>Parties:</strong> {extractedData.parties.join(' and ')}</p>
                                    {extractedData.businessPurpose && <p><strong>Purpose:</strong> {extractedData.businessPurpose}</p>}
                                    {extractedData.jurisdiction && <p><strong>Jurisdiction:</strong> {extractedData.jurisdiction}</p>}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="analysis-results-fullwidth">
                            <div className="recommendation-card analysis">
                                <h3><span className="recommendation-icon">⚖️</span> Personalized Analysis Summary</h3>
                                <div className="recommendation-answer">{analysisResult.recommendation || 'PERSONALIZED ANALYSIS'}</div>
                            </div>

                            <div className="legal-analysis-content-fullwidth">
                                <div dangerouslySetInnerHTML={{ __html: analysisResult.htmlContent }} />
                            </div>

                            {personalizedSuggestions.length > 0 && (
                                <div className="personalized-suggestions-section">
                                    <h3 className="suggestions-title">📝 Select Your Personalized Improvements</h3>
                                    <p className="suggestions-subtitle">Choose which AI-generated suggestions to include in your customized redraft:</p>
                                    
                                    <div className="suggestions-list">
                                        {personalizedSuggestions.map((suggestion) => (
                                            <div key={suggestion.id} className={`suggestion-item ${suggestion.category}`}>
                                                <div className="suggestion-header">
                                                    <input
                                                        type="checkbox"
                                                        id={suggestion.id}
                                                        checked={selectedChanges[suggestion.id] || false}
                                                        onChange={(e) => handleSuggestionChange(suggestion.id, e.target.checked)}
                                                    />
                                                    <label htmlFor={suggestion.id} className="suggestion-title">{suggestion.title}</label>
                                                    <span className={`category-badge ${suggestion.category}`}>
                                                        {suggestion.category === 'favoringParty1' ? `Favoring ${extractedData.parties[0] || 'First Party'}` :
                                                         suggestion.category === 'favoringParty2' ? `Favoring ${extractedData.parties[1] || 'Second Party'}` :
                                                         'Neutral/Mutual'}
                                                    </span>
                                                </div>
                                                <div className="suggestion-content">
                                                    <div className="suggestion-description">{suggestion.description}</div>
                                                    <div className="suggestion-comparison">
                                                        <div className="original-text"><strong>Original:</strong> {suggestion.originalText}</div>
                                                        <div className="improved-text"><strong>Improved:</strong> {suggestion.improvedText}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="redraft-actions-fullwidth">
                                        <div className="redraft-buttons-fullwidth">
                                            <button className="redraft-btn copy-btn" onClick={copyRedraftToClipboard} disabled={getTotalSelectedChanges() === 0}>
                                                <i data-feather="copy"></i> Copy Personalized Redraft
                                            </button>
                                            <button className="redraft-btn download-btn" onClick={downloadRedraft} disabled={getTotalSelectedChanges() === 0}>
                                                <i data-feather="download"></i> Download Redraft
                                            </button>
                                            <button className="redraft-btn preview-btn" onClick={() => setShowRedraftPreview(!showRedraftPreview)} disabled={getTotalSelectedChanges() === 0}>
                                                <i data-feather="eye"></i> {showRedraftPreview ? 'Hide Preview' : 'Preview Changes'}
                                            </button>
                                            <button className="redraft-btn consult-btn" onClick={scheduleConsultation}>
                                                <i data-feather="calendar"></i> Schedule Consultation
                                            </button>
                                        </div>
                                        
                                        <div className="selected-summary">
                                            <strong>{getTotalSelectedChanges()}</strong> personalized improvement(s) selected
                                        </div>
                                    </div>

                                    {showRedraftPreview && getTotalSelectedChanges() > 0 && (
                                        <div className="redraft-preview-fullwidth">
                                            <h4>📄 Personalized Redraft Preview with Highlights</h4>
                                            <div className="preview-content-fullwidth">
                                                <div dangerouslySetInnerHTML={{ __html: generateHighlightedPreview() }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="action-buttons-fullwidth">
                                <button className="action-button outline" onClick={() => {
                                    setAnalysisResult(null);
                                    setNdaText('');
                                    setExtractedData({ parties: [], businessPurpose: '', jurisdiction: '' });
                                    setSelectedChanges({});
                                    setPersonalizedSuggestions([]);
                                    setShowRedraftPreview(false);
                                }}>
                                    <i data-feather="refresh-cw"></i> New Analysis
                                </button>
                            </div>

                            <div className="professional-disclaimer">
                                <small><strong>Disclaimer:</strong> This personalized analysis uses details extracted from your specific agreement but does not constitute legal advice. For binding legal guidance on your particular situation, consult with a qualified attorney. Analysis by Sergei Tokmakov, Esq., CA Bar #279869.{analysisResult.provider && <span style={{opacity: 0.7}}> • Powered by {analysisResult.provider}</span>}</small>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<NDAAnalyzer />, document.getElementById('root'));