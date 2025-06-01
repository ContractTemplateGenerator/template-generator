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
        console.log('Raw AI Response:', aiResponse);
        
        // Look for structured suggestion sections
        const suggestionSections = [
            { pattern: /IMPROVEMENTS?\s+FAVORING\s+FIRST\s+PARTY[:\s]*(.+?)(?=IMPROVEMENTS?\s+FAVORING\s+SECOND\s+PARTY|NEUTRAL|MUTUAL|$)/is, category: 'favoringParty1' },
            { pattern: /IMPROVEMENTS?\s+FAVORING\s+SECOND\s+PARTY[:\s]*(.+?)(?=IMPROVEMENTS?\s+FAVORING\s+FIRST\s+PARTY|NEUTRAL|MUTUAL|$)/is, category: 'favoringParty2' },
            { pattern: /(NEUTRAL|MUTUAL)[\/\s]*(IMPROVEMENTS?)[:\s]*(.+?)(?=IMPROVEMENTS?\s+FAVORING|$)/is, category: 'neutral' }
        ];

        suggestionSections.forEach(section => {
            const match = aiResponse.match(section.pattern);
            if (match) {
                const content = match[match.length - 1]; // Get the last capture group
                console.log(`Found ${section.category} content:`, content);
                
                // Parse individual suggestions within this section
                const suggestionItems = parseSuggestionItems(content, section.category, suggestions.length);
                suggestions.push(...suggestionItems);
            }
        });

        // Fallback: Look for any bullet-pointed suggestions if structured sections not found
        if (suggestions.length === 0) {
            console.log('No structured sections found, using fallback parsing');
            const fallbackSuggestions = parseFallbackSuggestions(aiResponse);
            suggestions.push(...fallbackSuggestions);
        }

        console.log('Final extracted suggestions:', suggestions);
        return suggestions;
    };

    const parseSuggestionItems = (content, category, startIndex) => {
        const suggestions = [];
        
        // Split by bullet points or numbered items
        const items = content.split(/\n\s*[•\-\*\d+\.]\s*/).filter(item => item.trim().length > 10);
        
        items.forEach((item, index) => {
            const trimmedItem = item.trim();
            if (trimmedItem.length < 10) return;
            
            // Try to extract structured content with original/improved sections
            const structuredSuggestion = parseStructuredSuggestion(trimmedItem, category, startIndex + index);
            if (structuredSuggestion) {
                suggestions.push(structuredSuggestion);
            } else {
                // Create a basic suggestion if structured parsing fails
                const basicSuggestion = createBasicSuggestion(trimmedItem, category, startIndex + index);
                suggestions.push(basicSuggestion);
            }
        });
        
        return suggestions;
    };

    const parseStructuredSuggestion = (text, category, id) => {
        // Look for patterns like:
        // "Title: Description. Original: 'text' Improved: 'text'"
        // "Title - Original: 'text' Improved: 'text'"
        
        const patterns = [
            /^([^:\n]+)[:]\s*([^\.]+)\.\s*Original:\s*['"]*([^'"]+)['"]*\s*Improved:\s*['"]*([^'"]+)['"]*$/is,
            /^([^:\n]+)[:]\s*([^\.]+)\.\s*Current:\s*['"]*([^'"]+)['"]*\s*Suggested:\s*['"]*([^'"]+)['"]*$/is,
            /^([^-\n]+)[-]\s*Original:\s*['"]*([^'"]+)['"]*\s*Improved:\s*['"]*([^'"]+)['"]*$/is,
            /^([^\.]+)\.\s*Current language:\s*['"]*([^'"]+)['"]*\s*Improved language:\s*['"]*([^'"]+)['"]*$/is
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const [, title, description, original, improved] = match;
                return {
                    id: `suggestion_${id}`,
                    category: category,
                    title: title.trim().substring(0, 80),
                    description: description ? description.trim() : title.trim(),
                    originalText: original.trim(),
                    improvedText: improved.trim()
                };
            }
        }
        
        return null;
    };

    const createBasicSuggestion = (text, category, id) => {
        // Extract title from first sentence or first 80 characters
        const sentences = text.split('.').filter(s => s.trim().length > 0);
        const title = sentences[0] ? sentences[0].trim().substring(0, 80) : text.substring(0, 80);
        const description = text.length > title.length ? text.substring(title.length).trim() : text;
        
        return {
            id: `suggestion_${id}`,
            category: category,
            title: title,
            description: description || title,
            originalText: "Review specific clause in the agreement",
            improvedText: title
        };
    };

    const parseFallbackSuggestions = (aiResponse) => {
        const suggestions = [];
        const lines = aiResponse.split('\n');
        let currentCategory = 'neutral';
        let suggestionIndex = 0;
        
        for (let line of lines) {
            line = line.trim();
            
            // Detect category sections
            if (line.toLowerCase().includes('favoring first party') || line.toLowerCase().includes('party 1')) {
                currentCategory = 'favoringParty1';
                continue;
            }
            if (line.toLowerCase().includes('favoring second party') || line.toLowerCase().includes('party 2')) {
                currentCategory = 'favoringParty2';
                continue;
            }
            if (line.toLowerCase().includes('neutral') || line.toLowerCase().includes('mutual')) {
                currentCategory = 'neutral';
                continue;
            }
            
            // Extract suggestions from bullet points
            if ((line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) && line.length > 10) {
                const suggestionText = line.replace(/^[•\-*\d+\.]\s*/, '').trim();
                if (suggestionText.length > 10) {
                    const structuredSuggestion = parseStructuredSuggestion(suggestionText, currentCategory, suggestionIndex);
                    if (structuredSuggestion) {
                        suggestions.push(structuredSuggestion);
                    } else {
                        suggestions.push(createBasicSuggestion(suggestionText, currentCategory, suggestionIndex));
                    }
                    suggestionIndex++;
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
        
        const personalizedPrompt = `Please analyze this NDA between ${party1} and ${party2} and provide specific redrafting suggestions.

KEY CONTEXT:
- Parties: ${party1} and ${party2}
- Business Purpose: ${extractedData.businessPurpose || 'Not specified'}
- Jurisdiction: ${extractedData.jurisdiction || 'Not specified'}

IMPORTANT: Structure your response with these exact sections:

**IMPROVEMENTS FAVORING FIRST PARTY:**
• [Suggestion Title]: [Brief description]. Original: "[exact current language from the agreement]" Improved: "[specific improved language]"
• [Another suggestion with same format]

**NEUTRAL/MUTUAL IMPROVEMENTS:**
• [Suggestion Title]: [Brief description]. Original: "[exact current language from the agreement]" Improved: "[specific improved language]"
• [Another suggestion with same format]

**IMPROVEMENTS FAVORING SECOND PARTY:**
• [Suggestion Title]: [Brief description]. Original: "[exact current language from the agreement]" Improved: "[specific improved language]"
• [Another suggestion with same format]

For each suggestion, please:
1. Quote exact language from the actual agreement (not generic text)
2. Provide specific improved language (not generic descriptions)
3. Make suggestions actionable and ready to copy/paste

NDA TEXT TO ANALYZE:
${ndaText}`;
        
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
                { 
                    id: 'suggestion_0', 
                    category: 'favoringParty1', 
                    title: `Add Broader Confidentiality Definition for ${party1}`, 
                    description: `Expand the definition of confidential information to better protect ${party1}'s business interests`, 
                    originalText: '"Confidential Information" means information disclosed by one party to the other', 
                    improvedText: `"Confidential Information" means any and all information, data, materials, or knowledge disclosed by ${party1} to ${party2}, whether written, oral, or in any other form` 
                },
                { 
                    id: 'suggestion_1', 
                    category: 'neutral', 
                    title: 'Add Mutual Termination Rights', 
                    description: 'Ensure both parties have equal rights to terminate the agreement', 
                    originalText: 'This Agreement shall remain in effect indefinitely', 
                    improvedText: 'Either party may terminate this Agreement upon thirty (30) days written notice to the other party' 
                },
                { 
                    id: 'suggestion_2', 
                    category: 'favoringParty2', 
                    title: `Limit ${party2}'s Disclosure Obligations`, 
                    description: `Add reasonable exceptions to reduce compliance burden for ${party2}`, 
                    originalText: `${party2} shall not disclose any Confidential Information under any circumstances`, 
                    improvedText: `${party2} shall not disclose Confidential Information except as required by law or court order with prior written notice to ${party1}` 
                },
                { 
                    id: 'suggestion_3', 
                    category: 'neutral', 
                    title: 'Add Standard Exclusions', 
                    description: 'Include industry-standard exclusions from confidentiality obligations', 
                    originalText: 'All information disclosed shall be deemed confidential', 
                    improvedText: 'Confidential Information excludes: (a) information in the public domain, (b) information independently developed, (c) information rightfully received from third parties' 
                },
                { 
                    id: 'suggestion_4', 
                    category: 'favoringParty1', 
                    title: `Add Injunctive Relief Rights for ${party1}`, 
                    description: `Strengthen ${party1}'s remedies for breach of confidentiality`, 
                    originalText: 'Remedies for breach shall be limited to monetary damages', 
                    improvedText: `${party1} shall be entitled to seek injunctive relief and other equitable remedies for any breach or threatened breach of this Agreement` 
                },
                { 
                    id: 'suggestion_5', 
                    category: 'favoringParty2', 
                    title: `Add Return of Information Clause for ${party2}`, 
                    description: `Clarify ${party2}'s obligations upon termination`, 
                    originalText: 'Upon termination, all confidential information shall be destroyed', 
                    improvedText: `Upon termination or request by ${party1}, ${party2} shall return or destroy all Confidential Information, with the option to retain one copy for legal compliance purposes` 
                }
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
        let redraftedText = `PERSONALIZED NDA REDRAFT\n\nBetween: ${party1} and ${party2}\n\nSELECTED IMPROVEMENTS:\n\n`;
        
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
                redraftedText += `${'='.repeat(categories[category].length)}\n\n`;
                
                categorySuggestions.forEach((suggestion, index) => {
                    redraftedText += `${index + 1}. ${suggestion.title}\n`;
                    redraftedText += `   Description: ${suggestion.description}\n\n`;
                    redraftedText += `   ORIGINAL LANGUAGE:\n`;
                    redraftedText += `   "${suggestion.originalText}"\n\n`;
                    redraftedText += `   IMPROVED LANGUAGE:\n`;
                    redraftedText += `   "${suggestion.improvedText}"\n\n`;
                    redraftedText += `   ${'─'.repeat(60)}\n\n`;
                });
            }
        });
        
        if (selectedSuggestions.length === 0) {
            redraftedText += `\nNo specific improvements selected. Please select suggestions above to generate a personalized redraft.\n\n`;
        }
        
        redraftedText += `\nORIGINAL AGREEMENT:\n`;
        redraftedText += `${'='.repeat(20)}\n\n`;
        redraftedText += `${ndaText}\n\n`;
        
        redraftedText += `\nATTORNEY CERTIFICATION:\n`;
        redraftedText += `This personalized redraft incorporates ${selectedSuggestions.length} selected improvement(s).\n`;
        redraftedText += `Analysis by: Sergei Tokmakov, Esq.\n`;
        redraftedText += `California Bar #279869\n`;
        redraftedText += `Date: ${new Date().toLocaleDateString()}\n`;
        redraftedText += `Tool: NDA Risk Analyzer (template.terms.law)`;
        
        return redraftedText;
    };

    const generateHighlightedPreview = () => {
        const baseText = generateFinalRedraft();
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        let highlightedText = baseText;
        
        // Highlight suggestion titles and improved text
        selectedSuggestions.forEach(suggestion => {
            // Highlight the suggestion title
            const titlePattern = new RegExp(`(${suggestion.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            highlightedText = highlightedText.replace(titlePattern, '<mark class="highlight-change">$1</mark>');
            
            // Highlight the improved text if it's substantial
            if (suggestion.improvedText && suggestion.improvedText.length > 20) {
                const improvedTextPattern = new RegExp(`("${suggestion.improvedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}")`, 'gi');
                highlightedText = highlightedText.replace(improvedTextPattern, '<mark class="highlight-improvement">$1</mark>');
            }
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
                                                        <div className="original-text">
                                                            <strong>Current Language:</strong><br />
                                                            "{suggestion.originalText}"
                                                        </div>
                                                        <div className="improved-text">
                                                            <strong>Improved Language:</strong><br />
                                                            "{suggestion.improvedText}"
                                                        </div>
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