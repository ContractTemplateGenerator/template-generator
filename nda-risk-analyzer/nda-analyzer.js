const { useState, useRef, useEffect } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    const [ndaUrl, setNdaUrl] = useState('');
    const [extractedData, setExtractedData] = useState({ parties: [], businessPurpose: '', jurisdiction: '' });
    const [selectedChanges, setSelectedChanges] = useState({});
    const [suggestions, setSuggestions] = useState({
        quickFixes: [],
        party1: [],
        party2: [],
        neutral: []
    });
    const [activeTab, setActiveTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const fileInputRef = useRef(null);
    const previewRef = useRef(null);

    // Tab configuration
    const tabs = [
        { id: 'quickFixes', label: 'Quick Fixes', icon: '⚡' },
        { id: 'party1', label: 'Disclosing Party', icon: '🔒' },
        { id: 'party2', label: 'Receiving Party', icon: '🔓' },
        { id: 'neutral', label: 'Neutral Changes', icon: '⚖️' }
    ];

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

    const handleFileUpload = async (file) => {
        if (!file) return;
        try {
            let text = '';
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                text = await file.text();
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
                content = content.replace(/<br\s*\/?>/gi, '\n');
                content = content.replace(/<\/p>/gi, '\n\n');
                content = content.replace(/<[^>]*>/g, ' ');
                content = content.replace(/&[a-zA-Z0-9#]+;/g, ' ');
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

    const analyzeSuggestionsFromText = (aiResponse) => {
        const party1 = extractedData.parties[0] || 'Disclosing Party';
        const party2 = extractedData.parties[1] || 'Receiving Party';
        
        // Parse suggestions from AI response
        const suggestions = {
            quickFixes: [],
            party1: [],
            party2: [],
            neutral: []
        };

        // Extract sections based on analysis
        const sections = aiResponse.split(/(?=ANALYSIS FOR|IMPROVEMENTS FOR|QUICK FIXES|CRITICAL ISSUES)/i);
        
        sections.forEach((section, index) => {
            const sectionLower = section.toLowerCase();
            
            // Extract individual suggestions with Original/Improved pattern
            const suggestionMatches = section.match(/([^.!?]+)[:.]\s*Original:\s*"([^"]+)"\s*Improved:\s*"([^"]+)"/gi) || [];
            
            suggestionMatches.forEach((match, suggestionIndex) => {
                const parts = match.match(/([^.!?]+)[:.]\s*Original:\s*"([^"]+)"\s*Improved:\s*"([^"]+)"/i);
                if (parts && parts.length >= 4) {
                    const suggestion = {
                        id: `suggestion_${index}_${suggestionIndex}`,
                        title: parts[1].trim().substring(0, 60),
                        description: parts[1].trim(),
                        originalText: parts[2].trim(),
                        improvedText: parts[3].trim(),
                        impact: determineImpact(parts[1]),
                        riskLevel: determineRiskLevel(parts[1])
                    };
                    
                    // Categorize suggestion
                    if (sectionLower.includes('quick') || sectionLower.includes('critical') || sectionLower.includes('urgent')) {
                        suggestions.quickFixes.push(suggestion);
                    } else if (sectionLower.includes('disclosing') || sectionLower.includes('party 1') || sectionLower.includes(party1.toLowerCase())) {
                        suggestions.party1.push(suggestion);
                    } else if (sectionLower.includes('receiving') || sectionLower.includes('party 2') || sectionLower.includes(party2.toLowerCase())) {
                        suggestions.party2.push(suggestion);
                    } else {
                        suggestions.neutral.push(suggestion);
                    }
                }
            });
        });

        // Add fallback suggestions if none found
        if (suggestions.quickFixes.length === 0 && suggestions.party1.length === 0 && 
            suggestions.party2.length === 0 && suggestions.neutral.length === 0) {
            suggestions.quickFixes = createFallbackSuggestions(party1, party2);
        }

        return suggestions;
    };

    const determineImpact = (title) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('critical') || titleLower.includes('termination') || titleLower.includes('liability')) {
            return 'high';
        }
        if (titleLower.includes('definition') || titleLower.includes('scope') || titleLower.includes('return')) {
            return 'medium';
        }
        return 'low';
    };

    const determineRiskLevel = (title) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('critical') || titleLower.includes('indefinite') || titleLower.includes('one-sided')) {
            return 'red';
        }
        if (titleLower.includes('broad') || titleLower.includes('unclear') || titleLower.includes('excessive')) {
            return 'yellow';
        }
        return 'green';
    };

    const createFallbackSuggestions = (party1, party2) => {
        return [
            {
                id: 'fallback_1',
                title: 'Add Mutual Termination Rights',
                description: 'Ensure both parties can terminate the agreement with reasonable notice',
                originalText: 'This Agreement shall remain in effect indefinitely',
                improvedText: 'Either party may terminate this Agreement upon thirty (30) days written notice',
                impact: 'high',
                riskLevel: 'yellow'
            },
            {
                id: 'fallback_2',
                title: 'Limit Confidentiality Period',
                description: 'Set reasonable time limits on confidentiality obligations',
                originalText: 'Confidentiality obligations shall survive termination indefinitely',
                improvedText: 'Confidentiality obligations shall survive termination for a period of three (3) years',
                impact: 'medium',
                riskLevel: 'yellow'
            },
            {
                id: 'fallback_3',
                title: 'Add Standard Exclusions',
                description: 'Include industry-standard exceptions to confidentiality',
                originalText: 'All disclosed information shall be deemed confidential',
                improvedText: 'Confidential Information excludes information that: (a) is publicly available, (b) was independently developed, or (c) was rightfully received from third parties',
                impact: 'high',
                riskLevel: 'green'
            }
        ];
    };

    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }
        setIsAnalyzing(true);
        
        const party1 = extractedData.parties[0] || 'Disclosing Party';
        const party2 = extractedData.parties[1] || 'Receiving Party';
        
        const analysisPrompt = `Analyze this NDA from multiple perspectives and provide specific suggestions. Focus on identifying clauses that unfairly disadvantage each party.

PARTIES: ${party1} (Disclosing Party) and ${party2} (Receiving Party)
BUSINESS PURPOSE: ${extractedData.businessPurpose || 'Not specified'}
JURISDICTION: ${extractedData.jurisdiction || 'Not specified'}

ANALYSIS REQUIREMENTS:
1. OVERALL RISK ASSESSMENT: Is this safe to sign? (ACCEPTABLE / SIGN WITH CAUTION / DO NOT SIGN)

2. ANALYSIS FOR ${party1.toUpperCase()} (DISCLOSING PARTY):
   - What clauses disadvantage ${party1}?
   - What protections are missing for ${party1}?
   - Specific improvements favoring ${party1}

3. ANALYSIS FOR ${party2.toUpperCase()} (RECEIVING PARTY):
   - What clauses are overly burdensome for ${party2}?
   - What unfair obligations does ${party2} face?
   - Specific improvements favoring ${party2}

4. QUICK FIXES (Most Critical Issues):
   - Top 3-4 most important changes needed
   - Issues that could make this agreement unenforceable

5. NEUTRAL IMPROVEMENTS:
   - Changes that benefit both parties equally
   - Standard industry practices missing

FORMAT EACH SUGGESTION AS:
[Clear title]: [Description]. Original: "[exact text from agreement]" Improved: "[specific replacement text]"

NDA TEXT:
${ndaText}`;
        
        try {
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: analysisPrompt }],
                    useClaudeAI: useClaudeAI,
                    extractedData: extractedData
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Extract risk assessment
                const riskMatch = data.response.match(/(ACCEPTABLE|SIGN WITH CAUTION|DO NOT SIGN)/i);
                const riskLevel = riskMatch ? riskMatch[1].toUpperCase() : 'SIGN WITH CAUTION';
                
                // Parse suggestions
                const parsedSuggestions = analyzeSuggestionsFromText(data.response);
                setSuggestions(parsedSuggestions);
                
                setAnalysisResult({
                    recommendation: riskLevel,
                    summary: extractSummary(data.response),
                    model: data.model,
                    provider: data.provider
                });
                
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            
            // Fallback analysis
            const fallbackSuggestions = {
                quickFixes: createFallbackSuggestions(party1, party2),
                party1: [],
                party2: [],
                neutral: []
            };
            setSuggestions(fallbackSuggestions);
            
            setAnalysisResult({
                recommendation: 'PROFESSIONAL REVIEW NEEDED',
                summary: `Analysis of agreement between ${party1} and ${party2} requires professional legal review.`,
                model: 'Fallback Analysis',
                provider: 'Terms.law'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const extractSummary = (response) => {
        const summaryMatch = response.match(/OVERALL RISK ASSESSMENT:([^.]*\.)/i);
        if (summaryMatch) {
            return summaryMatch[1].trim();
        }
        return 'Professional legal analysis completed with personalized recommendations.';
    };

    const handleSuggestionChange = (suggestionId, isSelected) => {
        setSelectedChanges(prev => ({
            ...prev,
            [suggestionId]: isSelected
        }));
        setLastChanged(suggestionId);
    };

    const generatePreviewText = () => {
        let previewText = ndaText;
        const allSuggestions = [...suggestions.quickFixes, ...suggestions.party1, ...suggestions.party2, ...suggestions.neutral];
        
        // Apply selected changes
        allSuggestions.forEach(suggestion => {
            if (selectedChanges[suggestion.id] && suggestion.originalText && suggestion.improvedText) {
                const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                
                if (previewText.includes(cleanOriginal)) {
                    previewText = previewText.replace(cleanOriginal, cleanImproved);
                }
            }
        });
        
        return previewText;
    };

    const generateHighlightedPreview = () => {
        let highlightedText = generatePreviewText();
        const allSuggestions = [...suggestions.quickFixes, ...suggestions.party1, ...suggestions.party2, ...suggestions.neutral];
        
        // Highlight recently changed text
        if (lastChanged) {
            const changedSuggestion = allSuggestions.find(s => s.id === lastChanged);
            if (changedSuggestion && selectedChanges[lastChanged] && changedSuggestion.improvedText) {
                const cleanImproved = changedSuggestion.improvedText.replace(/['"]/g, '').trim();
                const improvedTextEscaped = cleanImproved.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const improvedPattern = new RegExp(`(${improvedTextEscaped})`, 'gi');
                highlightedText = highlightedText.replace(improvedPattern, '<mark class="highlight-change">$1</mark>');
            }
        }
        
        // Format for display
        const paragraphs = highlightedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        return paragraphs.map(paragraph => {
            const trimmedPara = paragraph.trim();
            
            if (trimmedPara.match(/^[A-Z\s]{10,}$/) || 
                trimmedPara.match(/^\d+\./) || 
                trimmedPara.match(/^SECTION|^ARTICLE|^WHEREAS/)) {
                return `<p class="legal-header"><strong>${trimmedPara}</strong></p>`;
            }
            
            return `<p class="legal-paragraph">${trimmedPara}</p>`;
        }).join('');
    };

    // Auto-scroll to highlighted changes
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            const highlightedElement = previewRef.current.querySelector('.highlight-change');
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Clear highlighting after 3 seconds
                setTimeout(() => setLastChanged(null), 3000);
            }
        }
    }, [lastChanged]);

    const copyToClipboard = async () => {
        const text = generatePreviewText();
        try {
            await navigator.clipboard.writeText(text);
            alert('Agreement copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Copy failed. Please try selecting and copying manually.');
        }
    };

    const downloadAsWord = () => {
        const text = generatePreviewText();
        try {
            let wordContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NDA - Improved Version</title>
<style>
  body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }
  .legal-paragraph {
    margin-bottom: 12pt;
    text-align: justify;
  }
  .legal-header {
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 12pt;
    text-align: center;
  }
</style>
</head>
<body>
`;

            const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
            paragraphs.forEach(paragraph => {
                const trimmedPara = paragraph.trim();
                if (trimmedPara.match(/^[A-Z\s]{10,}$/) || trimmedPara.match(/^\d+\./) || trimmedPara.match(/^SECTION|^ARTICLE/)) {
                    wordContent += `<p class="legal-header">${trimmedPara}</p>`;
                } else {
                    wordContent += `<p class="legal-paragraph">${trimmedPara}</p>`;
                }
            });
            
            wordContent += '</body></html>';
            
            const blob = new Blob([wordContent], { type: 'application/vnd.ms-word;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `NDA_Improved_${new Date().toISOString().split('T')[0]}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error("Error generating Word document:", error);
            alert("Error generating Word document. Please try the copy option.");
        }
    };

    const scheduleConsultation = () => {
        if (window.Calendly) {
            window.Calendly.initPopupWidget({ 
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1' 
            });
        } else {
            window.open('https://terms.law/call/', '_blank');
        }
    };

    const getTotalSelectedChanges = () => {
        return Object.values(selectedChanges).filter(Boolean).length;
    };

    const getCurrentTabSuggestions = () => {
        const tabId = tabs[activeTab].id;
        return suggestions[tabId] || [];
    };

    const getRiskBadgeClass = (riskLevel) => {
        switch(riskLevel) {
            case 'red': return 'risk-badge-red';
            case 'yellow': return 'risk-badge-yellow';
            case 'green': return 'risk-badge-green';
            default: return 'risk-badge-yellow';
        }
    };

    return (
        <div className="nda-analyzer">
            {/* Header */}
            <div className="header">
                <h1>🛡️ NDA Risk Analyzer</h1>
                <p>Professional Legal Analysis & Smart Redrafting System</p>
                <div className="attorney-info">Sergei Tokmakov, Esq. • CA Bar #279869 • 13+ Years Experience</div>
                {extractedData.parties.length > 0 && (
                    <div className="extracted-info">
                        Analyzing Agreement Between: <strong>{extractedData.parties.join(' and ')}</strong>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="input-section">
                <h2><i data-feather="upload-cloud"></i> Upload or Paste Your NDA</h2>
                
                <div className="upload-options">
                    <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
                        <div className="upload-icon">📄</div>
                        <div className="upload-text">Drop files here or click to browse</div>
                        <div className="upload-subtext">Supports .txt files</div>
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept=".txt,.pdf,.doc,.docx,text/plain" 
                            onChange={(e) => handleFileUpload(e.target.files[0])} 
                            style={{ display: 'none' }} 
                        />
                    </div>
                    
                    <div className="url-input-section">
                        <div className="url-input-header">Or fetch from URL:</div>
                        <div className="url-input-group">
                            <input 
                                type="url" 
                                className="url-input" 
                                placeholder="https://example.com/nda.html" 
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
                        placeholder="Paste your NDA text here for professional analysis..." 
                        value={ndaText} 
                        onChange={(e) => handleTextChange(e.target.value)} 
                    />
                </div>

                <div className="analysis-options">
                    <div className="ai-toggle-group">
                        <label>AI Provider:</label>
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
                                    🚀 Llama
                                </span>
                                <span className={`provider-label ${useClaudeAI ? 'active' : ''}`}>
                                    🧠 Claude 4.0
                                </span>
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
                                Analyzing NDA...
                            </>
                        ) : (
                            <>
                                <i data-feather="shield"></i>
                                Analyze NDA
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Two-Pane Layout */}
            {analysisResult && (
                <div className="two-pane-layout">
                    {/* Left Pane - Suggestions (40%) */}
                    <div className="left-pane">
                        {/* Risk Summary Card */}
                        <div className={`risk-summary-card ${analysisResult.recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
                            <div className="risk-icon">
                                {analysisResult.recommendation === 'ACCEPTABLE' ? '✅' :
                                 analysisResult.recommendation === 'DO NOT SIGN' ? '❌' : '⚠️'}
                            </div>
                            <div className="risk-content">
                                <div className="risk-recommendation">{analysisResult.recommendation}</div>
                                <div className="risk-summary">{analysisResult.summary}</div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="tab-navigation">
                            {tabs.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    className={`tab-button ${activeTab === index ? 'active' : ''}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    <span className="tab-icon">{tab.icon}</span>
                                    <span className="tab-label">{tab.label}</span>
                                    <span className="tab-count">({suggestions[tab.id]?.length || 0})</span>
                                </button>
                            ))}
                        </div>

                        {/* Suggestions List */}
                        <div className="suggestions-container">
                            {getCurrentTabSuggestions().map((suggestion) => (
                                <div key={suggestion.id} className="suggestion-card">
                                    <div className="suggestion-header">
                                        <input
                                            type="checkbox"
                                            id={suggestion.id}
                                            checked={selectedChanges[suggestion.id] || false}
                                            onChange={(e) => handleSuggestionChange(suggestion.id, e.target.checked)}
                                        />
                                        <div className="suggestion-meta">
                                            <span className={`risk-badge ${getRiskBadgeClass(suggestion.riskLevel)}`}>
                                                {suggestion.riskLevel === 'red' ? 'Critical' :
                                                 suggestion.riskLevel === 'yellow' ? 'Important' : 'Recommended'}
                                            </span>
                                            <span className={`impact-badge impact-${suggestion.impact}`}>
                                                {suggestion.impact} impact
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="suggestion-content">
                                        <div className="suggestion-title">{suggestion.title}</div>
                                        <div className="suggestion-description">{suggestion.description}</div>
                                        
                                        <div className="suggestion-comparison">
                                            <div className="original-text">
                                                <strong>Current:</strong> "{suggestion.originalText}"
                                            </div>
                                            <div className="improved-text">
                                                <strong>Improved:</strong> "{suggestion.improvedText}"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {getCurrentTabSuggestions().length === 0 && (
                                <div className="no-suggestions">
                                    <div className="no-suggestions-icon">📝</div>
                                    <div className="no-suggestions-text">No suggestions in this category</div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button 
                                className="action-btn copy-btn" 
                                onClick={copyToClipboard}
                                disabled={getTotalSelectedChanges() === 0}
                            >
                                <i data-feather="copy"></i> Copy Agreement
                            </button>
                            <button 
                                className="action-btn download-btn" 
                                onClick={downloadAsWord}
                                disabled={getTotalSelectedChanges() === 0}
                            >
                                <i data-feather="download"></i> Download Word
                            </button>
                            <button 
                                className="action-btn consult-btn" 
                                onClick={scheduleConsultation}
                            >
                                <i data-feather="calendar"></i> Schedule Consultation
                            </button>
                        </div>

                        <div className="selection-summary">
                            <strong>{getTotalSelectedChanges()}</strong> improvement(s) selected
                        </div>
                    </div>

                    {/* Right Pane - Live Preview (60%) */}
                    <div className="right-pane">
                        <div className="preview-header">
                            <h3><i data-feather="eye"></i> Live Document Preview</h3>
                            <div className="preview-info">
                                Changes highlight automatically • Scroll to view updates
                            </div>
                        </div>
                        
                        <div className="preview-content" ref={previewRef}>
                            {getTotalSelectedChanges() > 0 ? (
                                <div 
                                    className="document-preview"
                                    dangerouslySetInnerHTML={{ __html: generateHighlightedPreview() }}
                                />
                            ) : (
                                <div className="preview-placeholder">
                                    <div className="placeholder-icon">📄</div>
                                    <div className="placeholder-text">
                                        Select improvements to see live preview with changes
                                    </div>
                                    <div className="original-preview">
                                        <h4>Original Document:</h4>
                                        <pre className="original-text-preview">{ndaText}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Waiting State */}
            {!analysisResult && (
                <div className="waiting-state">
                    <div className="waiting-icon">⚖️</div>
                    <div className="waiting-text">Ready for Professional Analysis</div>
                    <div className="waiting-subtext">
                        Upload your NDA to get detailed analysis from each party's perspective
                    </div>
                    {extractedData.parties.length > 0 && (
                        <div className="extraction-preview">
                            <h4>📋 Detected Information:</h4>
                            <p><strong>Parties:</strong> {extractedData.parties.join(' and ')}</p>
                            {extractedData.businessPurpose && (
                                <p><strong>Purpose:</strong> {extractedData.businessPurpose}</p>
                            )}
                            {extractedData.jurisdiction && (
                                <p><strong>Jurisdiction:</strong> {extractedData.jurisdiction}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <div className="disclaimer">
                <small>
                    <strong>Disclaimer:</strong> This analysis does not constitute legal advice. 
                    For binding legal guidance, consult with a qualified attorney. 
                    Analysis by Sergei Tokmakov, Esq., CA Bar #279869.
                    {analysisResult?.provider && (
                        <span style={{opacity: 0.7}}> • Powered by {analysisResult.provider}</span>
                    )}
                </small>
            </div>
        </div>
    );
};

ReactDOM.render(<NDAAnalyzer />, document.getElementById('root'));