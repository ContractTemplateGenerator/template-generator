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
    const [debugInfo, setDebugInfo] = useState('');
    const fileInputRef = useRef(null);

    const debugLog = (message, data = null) => {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage, data);
        setDebugInfo(prev => prev + logMessage + (data ? ': ' + JSON.stringify(data, null, 2) : '') + '\n');
    };

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
        debugLog('Starting suggestion extraction');
        debugLog('Raw AI Response length', aiResponse.length);
        
        // Clean up the response - remove HTML and excessive formatting
        let cleanResponse = aiResponse.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').trim();
        debugLog('Cleaned response length', cleanResponse.length);
        
        // Look for suggestions with "Original:" and "Improved:" patterns
        const suggestionMatches = cleanResponse.match(/([^.!?]+)[:.]\s*Original:\s*"([^"]+)"\s*Improved:\s*"([^"]+)"/gi);
        
        if (suggestionMatches && suggestionMatches.length > 0) {
            debugLog('Found structured suggestions count', suggestionMatches.length);
            suggestionMatches.forEach((match, index) => {
                const parts = match.match(/([^.!?]+)[:.]\s*Original:\s*"([^"]+)"\s*Improved:\s*"([^"]+)"/i);
                if (parts && parts.length >= 4) {
                    const suggestion = {
                        id: `suggestion_${index}`,
                        category: determineSuggestionCategory(parts[1], cleanResponse, index),
                        title: parts[1].trim().substring(0, 50),
                        description: parts[1].trim(),
                        originalText: parts[2].trim(),
                        improvedText: parts[3].trim()
                    };
                    suggestions.push(suggestion);
                    debugLog(`Added structured suggestion ${index}`, suggestion.title);
                }
            });
        }
        
        // Fallback: Look for suggestions in different format
        if (suggestions.length === 0) {
            debugLog('No structured suggestions found, trying alternative parsing');
            const alternativeSuggestions = parseAlternativeFormat(cleanResponse);
            suggestions.push(...alternativeSuggestions);
            debugLog('Alternative parsing found', alternativeSuggestions.length);
        }
        
        // If still no suggestions, create meaningful defaults
        if (suggestions.length === 0) {
            debugLog('No suggestions found, creating fallback suggestions');
            const party1 = extractedData.parties[0] || 'First Party';
            const party2 = extractedData.parties[1] || 'Second Party';
            const fallbackSuggestions = createDetailedFallbackSuggestions(party1, party2);
            suggestions.push(...fallbackSuggestions);
            debugLog('Created fallback suggestions', fallbackSuggestions.length);
        }

        debugLog('Final suggestion count', suggestions.length);
        return suggestions;
    };

    const determineSuggestionCategory = (title, fullResponse, index) => {
        const titleLower = title.toLowerCase();
        const position = fullResponse.toLowerCase().indexOf(titleLower);
        const beforeText = fullResponse.substring(Math.max(0, position - 200), position).toLowerCase();
        
        if (beforeText.includes('favoring first party') || beforeText.includes('party 1')) {
            return 'favoringParty1';
        }
        if (beforeText.includes('favoring second party') || beforeText.includes('party 2')) {
            return 'favoringParty2';
        }
        if (beforeText.includes('neutral') || beforeText.includes('mutual')) {
            return 'neutral';
        }
        
        // Default categorization based on index
        const categories = ['favoringParty1', 'neutral', 'favoringParty2'];
        return categories[index % 3];
    };

    const parseAlternativeFormat = (cleanResponse) => {
        const suggestions = [];
        
        // Look for bullet points with descriptions
        const bulletMatches = cleanResponse.match(/[•\-\*]\s*([^•\-\*\n]{20,})/g);
        
        if (bulletMatches) {
            bulletMatches.forEach((match, index) => {
                const content = match.replace(/^[•\-\*]\s*/, '').trim();
                
                // Try to extract original and improved from the content
                const originalMatch = content.match(/Original:\s*['"]*([^'"]+)['"]*[\s,]/i);
                const improvedMatch = content.match(/Improved:\s*['"]*([^'"]+)['"]*[\s,]?/i);
                
                if (originalMatch && improvedMatch) {
                    const title = content.substring(0, content.indexOf('Original:')).trim();
                    suggestions.push({
                        id: `suggestion_${index}`,
                        category: determineSuggestionCategory(title, cleanResponse, index),
                        title: title.substring(0, 50),
                        description: title,
                        originalText: originalMatch[1].trim(),
                        improvedText: improvedMatch[1].trim()
                    });
                } else {
                    // Create basic suggestion from content
                    const title = content.substring(0, 50);
                    suggestions.push({
                        id: `suggestion_${index}`,
                        category: determineSuggestionCategory(content, cleanResponse, index),
                        title: title,
                        description: content.substring(0, 200),
                        originalText: "Clause needs review and improvement",
                        improvedText: content.substring(0, 150) + "..."
                    });
                }
            });
        }
        
        return suggestions;
    };

    const createDetailedFallbackSuggestions = (party1, party2) => {
        return [
            { 
                id: 'suggestion_0', 
                category: 'favoringParty1', 
                title: 'Broader Confidentiality Definition', 
                description: `Expand the definition of confidential information to better protect ${party1}'s business interests`, 
                originalText: 'Information disclosed in connection with this transaction', 
                improvedText: `Any and all information, data, materials, or knowledge disclosed by ${party1}, whether written, oral, or in any other form, including technical data, business plans, and proprietary methodologies` 
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
                title: 'Reasonable Disclosure Exceptions', 
                description: `Add practical exceptions to reduce compliance burden for ${party2}`, 
                originalText: `${party2} shall not disclose any information under any circumstances`, 
                improvedText: `${party2} shall not disclose confidential information except as required by law, court order, or regulatory requirement with prior written notice to ${party1} where legally permissible` 
            },
            { 
                id: 'suggestion_3', 
                category: 'neutral', 
                title: 'Standard Exclusions Clause', 
                description: 'Include industry-standard exclusions from confidentiality obligations', 
                originalText: 'All disclosed information shall be deemed confidential', 
                improvedText: 'Confidential Information excludes: (a) information in the public domain through no breach, (b) information independently developed, (c) information rightfully received from third parties' 
            }
        ];
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

    const decodeHtmlEntities = (text) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
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
                
                // Remove scripts and styles
                content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
                
                // Remove HTML tags but preserve line breaks
                content = content.replace(/<br\s*\/?>/gi, '\n');
                content = content.replace(/<\/p>/gi, '\n\n');
                content = content.replace(/<[^>]*>/g, ' ');
                
                // Decode HTML entities
                content = decodeHtmlEntities(content);
                
                // Clean up whitespace
                content = content.replace(/\s+/g, ' ').replace(/\n\s+/g, '\n').trim();
                
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
        
        const personalizedPrompt = `Analyze this NDA between ${party1} and ${party2} and provide specific redrafting suggestions.

KEY CONTEXT:
- Parties: ${party1} and ${party2}
- Business Purpose: ${extractedData.businessPurpose || 'Not specified'}
- Jurisdiction: ${extractedData.jurisdiction || 'Not specified'}

CRITICAL FORMATTING REQUIREMENTS:
1. Do NOT use markdown formatting, asterisks, or special characters
2. Use this EXACT format for each suggestion:

IMPROVEMENTS FAVORING FIRST PARTY:
• [Clear suggestion title]: [Brief description]. Original: "[exact quoted text from agreement]" Improved: "[specific replacement text]"
• [Another suggestion with same format]

NEUTRAL/MUTUAL IMPROVEMENTS:
• [Clear suggestion title]: [Brief description]. Original: "[exact quoted text from agreement]" Improved: "[specific replacement text]"

IMPROVEMENTS FAVORING SECOND PARTY:
• [Clear suggestion title]: [Brief description]. Original: "[exact quoted text from agreement]" Improved: "[specific replacement text]"

REQUIREMENTS:
- Quote EXACT language from the actual agreement (not generic text)
- Provide specific improved language (not descriptions)
- Keep titles under 50 characters
- Use plain text only, no formatting

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
                    title: 'Broader Confidentiality Definition', 
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
                    title: 'Reasonable Disclosure Exceptions', 
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
                    title: 'Add Injunctive Relief Rights', 
                    description: `Strengthen ${party1}'s remedies for breach of confidentiality`, 
                    originalText: 'Remedies for breach shall be limited to monetary damages', 
                    improvedText: `${party1} shall be entitled to seek injunctive relief and other equitable remedies for any breach or threatened breach of this Agreement` 
                },
                { 
                    id: 'suggestion_5', 
                    category: 'favoringParty2', 
                    title: 'Add Return of Information Clause', 
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
        let redraftedText = `${ndaText}\n\n`;
        
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        
        // Apply the selected improvements directly to the agreement text
        let amendedText = ndaText;
        
        selectedSuggestions.forEach((suggestion, index) => {
            // Try to find and replace the original text with improved text
            if (suggestion.originalText && suggestion.improvedText) {
                // Clean the original text for matching (remove quotes and extra spaces)
                const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                
                // Try exact match first
                if (amendedText.includes(cleanOriginal)) {
                    amendedText = amendedText.replace(cleanOriginal, cleanImproved);
                } else {
                    // If no exact match, append as an amendment
                    amendedText += `\n\nAMENDMENT ${index + 1}: ${suggestion.title}\n${cleanImproved}`;
                }
            }
        });
        
        return amendedText;
    };

    const generateCleanRedraft = () => {
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        let cleanText = ndaText;
        
        // Apply improvements directly to the text
        selectedSuggestions.forEach(suggestion => {
            if (suggestion.originalText && suggestion.improvedText) {
                const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                
                if (cleanText.includes(cleanOriginal)) {
                    cleanText = cleanText.replace(cleanOriginal, cleanImproved);
                }
            }
        });
        
        return cleanText;
    };

    const generateHighlightedPreview = () => {
        const baseText = generateFinalRedraft();
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        let highlightedText = baseText;
        
        // Format text into proper paragraphs
        highlightedText = highlightedText.replace(/\n\n/g, '</p><p>');
        highlightedText = '<p>' + highlightedText + '</p>';
        
        // Highlight only the improved text content that was actually changed
        selectedSuggestions.forEach(suggestion => {
            if (suggestion.improvedText && suggestion.improvedText.length > 10) {
                const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                // Escape the text for regex and highlight the actual improved content
                const improvedTextEscaped = cleanImproved.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const improvedPattern = new RegExp(`(${improvedTextEscaped})`, 'gi');
                highlightedText = highlightedText.replace(improvedPattern, '<mark class="highlight-improvement">$1</mark>');
            }
        });
        
        return highlightedText;
    };
            }
        });
        
        return highlightedText;
    };

    const copyRedraftToClipboard = async () => {
        const redraft = generateCleanRedraft();
        try {
            await navigator.clipboard.writeText(redraft);
            alert('Clean redrafted agreement copied to clipboard!');
        } catch (error) {
            const textArea = document.createElement('textarea');
            textArea.value = redraft;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Clean redrafted agreement copied to clipboard!');
        }
    };

    const copyOriginalToClipboard = async () => {
        const original = generateFinalRedraft();
        try {
            await navigator.clipboard.writeText(original);
            alert('Redraft with annotations copied to clipboard!');
        } catch (error) {
            const textArea = document.createElement('textarea');
            textArea.value = original;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Redraft with annotations copied to clipboard!');
        }
    };

    const downloadRedraft = () => {
        const redraft = generateCleanRedraft();
        const blob = new Blob([redraft], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Redrafted_NDA_${new Date().toISOString().split('T')[0]}.txt`;
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
                                                    <span className={`category-badge ${suggestion.category}`}>
                                                        {suggestion.category === 'favoringParty1' ? `Favoring ${extractedData.parties[0] || 'Disclosing Party'}` :
                                                         suggestion.category === 'favoringParty2' ? `Favoring ${extractedData.parties[1] || 'Receiving Party'}` :
                                                         'Neutral/Mutual'}
                                                    </span>
                                                </div>
                                                <div className="suggestion-content">
                                                    <div className="suggestion-description">• {suggestion.description}</div>
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
                                                <i data-feather="copy"></i> Copy Clean Agreement
                                            </button>
                                            <button className="redraft-btn copy-btn" onClick={copyOriginalToClipboard} disabled={getTotalSelectedChanges() === 0} style={{backgroundColor: "#6366f1"}}>
                                                <i data-feather="file-text"></i> Copy with Notes
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