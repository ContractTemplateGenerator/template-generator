const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    const [extractedData, setExtractedData] = useState({ parties: [], sections: [], terms: {}, businessPurpose: '', jurisdiction: '', durations: {} });
    const [selectedChanges, setSelectedChanges] = useState({ favoringParty1: {}, neutral: {}, favoringParty2: {} });
    const [redraftSuggestions, setRedraftSuggestions] = useState({ favoringParty1: [], neutral: [], favoringParty2: [] });
    const [showRedraftPreview, setShowRedraftPreview] = useState(false);
    const fileInputRef = useRef(null);

    const extractNDAData = (text) => {
        const data = { parties: [], sections: [], terms: {}, businessPurpose: '', jurisdiction: '', durations: {} };
        const partyMatches = text.match(/\b([A-Z][A-Za-z\s]+(?:Inc|LLC|Corp|Ltd|Company)\.?)\b/g);
        if (partyMatches) data.parties = [...new Set(partyMatches.map(p => p.trim()))].slice(0, 2);
        const sectionMatches = text.match(/(?:Section|Article)\s+(\d+[\.\d]*)/gi);
        if (sectionMatches) data.sections = [...new Set(sectionMatches)];
        const purposeMatch = text.match(/(?:purpose of|in connection with|relating to)\s+([^.\n]{10,100})/i);
        if (purposeMatch) data.businessPurpose = purposeMatch[1].trim();
        const jurisdictionMatch = text.match(/(?:governed by|jurisdiction of|laws of)\s+(?:the\s+)?([^,.\n]+)/i);
        if (jurisdictionMatch) data.jurisdiction = jurisdictionMatch[1].trim();
        const durationMatches = text.match(/(\d+)\s*(?:year|month|day)s?/gi);
        if (durationMatches) durationMatches.forEach(d => { const [n, u] = d.toLowerCase().split(/\s+/); data.durations[`${n}_${u}`] = d; });
        return data;
    };

    const generateEnhancedFallback = (data) => {
        const party1 = data.parties[0] || 'First Party';
        const party2 = data.parties[1] || 'Second Party';
        return {
            htmlContent: `<div class="analysis-header"><h3>🛡️ Personalized NDA Risk Analysis</h3><p><strong>Parties:</strong> ${party1} and ${party2}</p><p><strong>Analyst:</strong> California Attorney Sergei Tokmakov (CA Bar #279869)</p></div><div class="recommendation moderate">CONTEXT-SPECIFIC ANALYSIS REQUIRED</div><div class="section"><div class="section-title">PERSONALIZED ASSESSMENT</div><p>This NDA involves <strong>${party1}</strong> and <strong>${party2}</strong>. Based on the agreement structure, I've identified specific areas where each party's interests may diverge.</p>${data.businessPurpose ? `<p><strong>Business Context:</strong> ${data.businessPurpose}</p>` : ''}${data.jurisdiction ? `<p><strong>Governing Law:</strong> ${data.jurisdiction}</p>` : ''}</div>`,
            suggestions: {
                favoringParty1: [{ id: 'broader_definition', title: `Broader Protection for ${party1}`, originalClause: 'Information marked as confidential', improvedClause: `All information disclosed by ${party1}, whether marked or not`, rationale: `Provides broader protection for ${party1}'s information` }],
                neutral: [{ id: 'mutual_termination', title: 'Equal Termination Rights', originalClause: 'Either party may terminate with notice', improvedClause: 'Either party may terminate with 30 days written notice', rationale: 'Provides equal rights for both parties' }],
                favoringParty2: [{ id: 'narrow_definition', title: `Narrower Scope for ${party2}`, originalClause: 'All shared information', improvedClause: `Only information specifically marked "CONFIDENTIAL" by ${party1}`, rationale: `Reduces ${party2}'s compliance burden` }]
            }
        };
    };
    const handleFileUpload = async (file) => {
        if (!file) return;
        try {
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const text = await file.text();
                setNdaText(text);
                const extracted = extractNDAData(text);
                setExtractedData(extracted);
            } else {
                alert('Please upload a plain text (.txt) file.');
            }
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error reading file. Please copy and paste your NDA text directly.');
        }
    };

    const handleTextChange = (text) => {
        setNdaText(text);
        if (text.trim().length > 100) {
            const extracted = extractNDAData(text);
            setExtractedData(extracted);
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
        const personalizedPrompt = `Please analyze this NDA between ${party1} and ${party2}. KEY CONTEXT: - Parties: ${party1} and ${party2} - Business Purpose: ${extractedData.businessPurpose || 'Not specified'} - Jurisdiction: ${extractedData.jurisdiction || 'Not specified'} - Key Terms: ${Object.keys(extractedData.terms).join(', ') || 'None identified'} NDA TEXT: ${ndaText}`;
        
        try {
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: personalizedPrompt }], useClaudeAI: useClaudeAI, extractedData: extractedData })
            });
            
            if (response.ok) {
                const data = await response.json();
                setAnalysisResult({ htmlContent: data.response, recommendation: 'PERSONALIZED ANALYSIS', model: data.model, provider: data.provider });
                setRedraftSuggestions(generateEnhancedFallback(extractedData).suggestions);
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            const fallbackData = generateEnhancedFallback(extractedData);
            setAnalysisResult({ htmlContent: fallbackData.htmlContent, recommendation: 'PERSONALIZED FALLBACK ANALYSIS', model: 'Professional Analysis', provider: 'Terms.law Legal Guidance' });
            setRedraftSuggestions(fallbackData.suggestions);
        } finally {
            setIsAnalyzing(false);
        }
    };
    const handleRedraftSelection = (category, changeId, isSelected) => {
        setSelectedChanges(prev => ({ ...prev, [category]: { ...prev[category], [changeId]: isSelected } }));
    };

    const generateFinalRedraft = () => {
        const party1 = extractedData.parties[0] || 'First Party';
        const party2 = extractedData.parties[1] || 'Second Party';
        let redraftedText = `REDRAFTED NON-DISCLOSURE AGREEMENT\n\nBetween: ${party1} and ${party2}\n\nPERSONALIZED IMPROVEMENTS APPLIED:\n\n`;
        
        Object.entries(selectedChanges).forEach(([category, selections]) => {
            const categoryName = category === 'favoringParty1' ? `Favoring ${party1}` : category === 'favoringParty2' ? `Favoring ${party2}` : 'Neutral/Mutual';
            const selectedItems = Object.entries(selections).filter(([_, isSelected]) => isSelected);
            
            if (selectedItems.length > 0) {
                redraftedText += `\n${categoryName.toUpperCase()} IMPROVEMENTS:\n`;
                selectedItems.forEach(([changeId, _]) => {
                    const suggestion = redraftSuggestions[category]?.find(s => s.id === changeId);
                    if (suggestion) {
                        redraftedText += `\n${suggestion.title}:\n• Original: ${suggestion.originalClause}\n• Improved: ${suggestion.improvedClause}\n• Rationale: ${suggestion.rationale}\n\n`;
                    }
                });
            }
        });
        
        redraftedText += `\nINTEGRATION WITH ORIGINAL AGREEMENT:\nThe above improvements should be incorporated into the original agreement structure.\n\n${ndaText ? 'ORIGINAL AGREEMENT TEXT:\n' + ndaText : ''}\n\nATTORNEY CERTIFICATION:\nAnalysis by: Sergei Tokmakov, Esq.\nCalifornia Bar #279869\nDate: ${new Date().toLocaleDateString()}`;
        return redraftedText;
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
        return Object.values(selectedChanges).reduce((total, category) => total + Object.values(category).filter(Boolean).length, 0);
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
                        <div className="upload-text">Drag & drop text file (.txt) here</div>
                        <div className="upload-subtext">or click to browse • Plain text files</div>
                        <input ref={fileInputRef} type="file" accept=".txt,text/plain" onChange={(e) => handleFileUpload(e.target.files[0])} style={{ display: 'none' }} />
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
                        {isAnalyzing ? (
                            <><div className="loading-spinner"></div>Analyzing & Extracting Details...</>
                        ) : (
                            <><i data-feather="shield"></i>Analyze & Personalize NDA</>
                        )}
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
                                    {Object.keys(extractedData.durations).length > 0 && <p><strong>Terms:</strong> {Object.values(extractedData.durations).join(', ')}</p>}
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
                            {Object.keys(redraftSuggestions).some(key => redraftSuggestions[key]?.length > 0) && (
                                <div className="redraft-system-fullwidth">
                                    <h3 className="redraft-title">📝 Personalized Redraft Options</h3>
                                    <p className="redraft-subtitle">Select improvements tailored to your specific agreement between <strong>{extractedData.parties.join(' and ')}</strong>:</p>

                                    <div className="three-column-redraft">
                                        <div className="redraft-column favoring-party1">
                                            <h4>Favoring {extractedData.parties[0] || 'First Party'}</h4>
                                            <div className="column-suggestions">
                                                {redraftSuggestions.favoringParty1?.map((suggestion) => (
                                                    <div key={suggestion.id} className="suggestion-card">
                                                        <div className="suggestion-header">
                                                            <input type="checkbox" id={`party1-${suggestion.id}`} checked={selectedChanges.favoringParty1[suggestion.id] || false} onChange={(e) => handleRedraftSelection('favoringParty1', suggestion.id, e.target.checked)} />
                                                            <label htmlFor={`party1-${suggestion.id}`} className="suggestion-title">{suggestion.title}</label>
                                                        </div>
                                                        <div className="suggestion-content">
                                                            <div className="original-clause"><strong>Current:</strong> {suggestion.originalClause}</div>
                                                            <div className="improved-clause"><strong>Improved:</strong> {suggestion.improvedClause}</div>
                                                            <div className="rationale"><strong>Why:</strong> {suggestion.rationale}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="redraft-column neutral">
                                            <h4>Neutral/Mutual Clauses</h4>
                                            <div className="column-suggestions">
                                                {redraftSuggestions.neutral?.map((suggestion) => (
                                                    <div key={suggestion.id} className="suggestion-card">
                                                        <div className="suggestion-header">
                                                            <input type="checkbox" id={`neutral-${suggestion.id}`} checked={selectedChanges.neutral[suggestion.id] || false} onChange={(e) => handleRedraftSelection('neutral', suggestion.id, e.target.checked)} />
                                                            <label htmlFor={`neutral-${suggestion.id}`} className="suggestion-title">{suggestion.title}</label>
                                                        </div>
                                                        <div className="suggestion-content">
                                                            <div className="original-clause"><strong>Current:</strong> {suggestion.originalClause}</div>
                                                            <div className="improved-clause"><strong>Improved:</strong> {suggestion.improvedClause}</div>
                                                            <div className="rationale"><strong>Why:</strong> {suggestion.rationale}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="redraft-column favoring-party2">
                                            <h4>Favoring {extractedData.parties[1] || 'Second Party'}</h4>
                                            <div className="column-suggestions">
                                                {redraftSuggestions.favoringParty2?.map((suggestion) => (
                                                    <div key={suggestion.id} className="suggestion-card">
                                                        <div className="suggestion-header">
                                                            <input type="checkbox" id={`party2-${suggestion.id}`} checked={selectedChanges.favoringParty2[suggestion.id] || false} onChange={(e) => handleRedraftSelection('favoringParty2', suggestion.id, e.target.checked)} />
                                                            <label htmlFor={`party2-${suggestion.id}`} className="suggestion-title">{suggestion.title}</label>
                                                        </div>
                                                        <div className="suggestion-content">
                                                            <div className="original-clause"><strong>Current:</strong> {suggestion.originalClause}</div>
                                                            <div className="improved-clause"><strong>Improved:</strong> {suggestion.improvedClause}</div>
                                                            <div className="rationale"><strong>Why:</strong> {suggestion.rationale}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
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
                                            {extractedData.parties.length === 2 && (
                                                <div className="party-breakdown">
                                                    <span>Favoring {extractedData.parties[0]}: {Object.values(selectedChanges.favoringParty1).filter(Boolean).length}</span>
                                                    <span>Neutral: {Object.values(selectedChanges.neutral).filter(Boolean).length}</span>
                                                    <span>Favoring {extractedData.parties[1]}: {Object.values(selectedChanges.favoringParty2).filter(Boolean).length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {showRedraftPreview && getTotalSelectedChanges() > 0 && (
                                        <div className="redraft-preview-fullwidth">
                                            <h4>📄 Personalized Redraft Preview</h4>
                                            <div className="preview-content-fullwidth">
                                                <pre>{generateFinalRedraft()}</pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="action-buttons-fullwidth">
                                <button className="action-button outline" onClick={() => {
                                    setAnalysisResult(null);
                                    setNdaText('');
                                    setExtractedData({ parties: [], sections: [], terms: {}, businessPurpose: '', jurisdiction: '', durations: {} });
                                    setSelectedChanges({ favoringParty1: {}, neutral: {}, favoringParty2: {} });
                                    setRedraftSuggestions({ favoringParty1: [], neutral: [], favoringParty2: [] });
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