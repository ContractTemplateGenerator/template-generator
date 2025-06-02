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

    const formatAnalysisResponse = (htmlContent) => {
        let formattedContent = htmlContent;
        
        // Replace wall of text suggestions with organized cards
        formattedContent = formattedContent.replace(
            /PERSONALIZED REDRAFT SUGGESTIONS:(.*?)(?=<\/div>|$)/is,
            (match, content) => {
                const suggestions = content.split(/IMPROVEMENTS FAVORING|NEUTRAL\/MUTUAL IMPROVEMENTS/i);
                let organized = '<div class="suggestions-analysis-section">';
                organized += '<h3 class="analysis-section-title">📋 Detailed Analysis Summary</h3>';
                
                suggestions.forEach((section, index) => {
                    if (section.trim().length > 20) {
                        const sectionTitle = index === 1 ? 'Improvements Favoring Disclosing Party' :
                                           index === 2 ? 'Neutral/Mutual Improvements' :
                                           index === 3 ? 'Improvements Favoring Receiving Party' :
                                           'General Improvements';
                        
                        if (index > 0) {
                            organized += `<div class="analysis-subsection">`;
                            organized += `<h4 class="analysis-subsection-title">${sectionTitle}</h4>`;
                            
                            const bullets = section.split(/[•\-\*]/).filter(item => item.trim().length > 10);
                            organized += '<ul class="analysis-suggestions-list">';
                            bullets.forEach(bullet => {
                                const cleanBullet = bullet.trim().replace(/Original:|Improved:/gi, '<strong>$&</strong>');
                                if (cleanBullet.length > 10) {
                                    organized += `<li class="analysis-suggestion-item">${cleanBullet}</li>`;
                                }
                            });
                            organized += '</ul></div>';
                        }
                    }
                });
                
                organized += '</div>';
                return organized;
            }
        );
        
        formattedContent = formattedContent.replace(
            /ANALYSIS FOR ([^:]+):/g,
            '<h3 class="party-analysis-title">🎯 Analysis for $1:</h3>'
        );
        
        return formattedContent;
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

    const decodeHtmlEntities = (text) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
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
                content = decodeHtmlEntities(content);
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

    const extractPersonalizedSuggestions = (aiResponse) => {
        const suggestions = [];
        let cleanResponse = aiResponse.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').trim();
        
        const suggestionMatches = cleanResponse.match(/([^.!?]+)[:.]\s*Original:\s*"([^"]+)"\s*Improved:\s*"([^"]+)"/gi);
        
        if (suggestionMatches && suggestionMatches.length > 0) {
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
                }
            });
        }
        
        if (suggestions.length === 0) {
            const party1 = extractedData.parties[0] || 'First Party';
            const party2 = extractedData.parties[1] || 'Second Party';
            suggestions.push(...createDetailedFallbackSuggestions(party1, party2));
        }

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
        
        const categories = ['favoringParty1', 'neutral', 'favoringParty2'];
        return categories[index % 3];
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

NEUTRAL/MUTUAL IMPROVEMENTS:
• [Clear suggestion title]: [Brief description]. Original: "[exact quoted text from agreement]" Improved: "[specific replacement text]"

IMPROVEMENTS FAVORING SECOND PARTY:
• [Clear suggestion title]: [Brief description]. Original: "[exact quoted text from agreement]" Improved: "[specific replacement text]"

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
                const formattedHtml = formatAnalysisResponse(data.response);
                setAnalysisResult({ htmlContent: formattedHtml, recommendation: 'PERSONALIZED ANALYSIS', model: data.model, provider: data.provider });
                const suggestions = extractPersonalizedSuggestions(data.response);
                setPersonalizedSuggestions(suggestions);
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            const fallbackHtml = `<div class="analysis-header"><h3>🛡️ Personalized NDA Risk Analysis</h3><p><strong>Parties:</strong> ${party1} and ${party2}</p></div><div class="recommendation moderate">CONTEXT-SPECIFIC ANALYSIS REQUIRED</div><div class="section"><div class="section-title">PERSONALIZED ASSESSMENT</div><p>This NDA involves <strong>${party1}</strong> and <strong>${party2}</strong>. Professional analysis requires reviewing specific clauses.</p></div>`;
            setAnalysisResult({ htmlContent: fallbackHtml, recommendation: 'PERSONALIZED FALLBACK ANALYSIS', model: 'Professional Analysis', provider: 'Terms.law Legal Guidance' });
            const fallbackSuggestions = createDetailedFallbackSuggestions(party1, party2);
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
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        
        let amendedText = ndaText;
        
        selectedSuggestions.forEach((suggestion, index) => {
            if (suggestion.originalText && suggestion.improvedText) {
                const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                
                if (amendedText.includes(cleanOriginal)) {
                    amendedText = amendedText.replace(cleanOriginal, cleanImproved);
                }
            }
        });
        
        if (selectedSuggestions.length > 0) {
            amendedText += "\n\n" + "=".repeat(80) + "\n";
            amendedText += "REVISIONS AND IMPROVEMENTS APPLIED:\n";
            amendedText += "=".repeat(80) + "\n\n";
            
            selectedSuggestions.forEach((suggestion, index) => {
                const sectionNumber = detectSectionNumber(suggestion.originalText);
                amendedText += `REVISION ${index + 1}${sectionNumber ? ` (Section ${sectionNumber})` : ''}:\n`;
                amendedText += `• ${suggestion.description}\n\n`;
                amendedText += `ORIGINAL LANGUAGE: "${suggestion.originalText}"\n\n`;
                amendedText += `REVISED LANGUAGE: "${suggestion.improvedText}"\n\n`;
                amendedText += `RATIONALE: ${getRationale(suggestion.category, party1, party2)}\n\n`;
                amendedText += "-".repeat(60) + "\n\n";
            });
        }
        
        return amendedText;
    };

    const detectSectionNumber = (text) => {
        const sectionMatch = text.match(/Section\s+(\d+)/i) || text.match(/\b(\d+)\./);
        return sectionMatch ? sectionMatch[1] : null;
    };

    const getRationale = (category, party1, party2) => {
        switch(category) {
            case 'favoringParty1':
                return `This revision strengthens protections for ${party1} while maintaining fair terms.`;
            case 'favoringParty2':
                return `This revision reduces compliance burden for ${party2} while preserving essential protections.`;
            case 'neutral':
                return `This revision creates more balanced terms benefiting both parties equally.`;
            default:
                return `This revision improves the clarity and enforceability of the agreement.`;
        }
    };

    const generateCleanRedraft = () => {
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        let cleanText = ndaText;
        
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
        
        const paragraphs = highlightedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        highlightedText = paragraphs.map(paragraph => {
            const trimmedPara = paragraph.trim();
            
            if (trimmedPara.match(/^[A-Z\s]{10,}$/) || 
                trimmedPara.match(/^\d+\./) || 
                trimmedPara.match(/^SECTION|^ARTICLE|^REVISION|^WHEREAS/)) {
                return `<p class="legal-header"><strong>${trimmedPara}</strong></p>`;
            }
            
            if (trimmedPara.includes('IN WITNESS WHEREOF') || 
                trimmedPara.includes('X: _____') ||
                trimmedPara.match(/^[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+$/)) {
                return `<p class="legal-signature">${trimmedPara}</p>`;
            }
            
            return `<p class="legal-paragraph">${trimmedPara}</p>`;
        }).join('');
        
        selectedSuggestions.forEach(suggestion => {
            if (suggestion.improvedText && suggestion.improvedText.length > 10) {
                const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                const improvedTextEscaped = cleanImproved.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const improvedPattern = new RegExp(`(${improvedTextEscaped})`, 'gi');
                highlightedText = highlightedText.replace(improvedPattern, '<mark class="highlight-improvement">$1</mark>');
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

    const downloadTextRedraft = () => {
        const redraft = generateCleanRedraft();
        const blob = new Blob([redraft], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Redrafted_NDA_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadWordWithRedlines = () => {
        const redraft = generateCleanRedraft();
        const selectedSuggestions = personalizedSuggestions.filter(s => selectedChanges[s.id]);
        
        try {
            let wordContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NDA - Redlined Version</title>
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
  .revision-section {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 12pt;
    margin: 12pt 0;
  }
  .deleted-text {
    text-decoration: line-through;
    color: red;
  }
  .inserted-text {
    background-color: yellow;
    color: blue;
  }
</style>
</head>
<body>
`;

            let processedText = ndaText;
            
            selectedSuggestions.forEach(suggestion => {
                if (suggestion.originalText && suggestion.improvedText) {
                    const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                    const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                    
                    if (processedText.includes(cleanOriginal)) {
                        const redlinedReplacement = `<span class="deleted-text">${cleanOriginal}</span> <span class="inserted-text">${cleanImproved}</span>`;
                        processedText = processedText.replace(cleanOriginal, redlinedReplacement);
                    }
                }
            });
            
            const paragraphs = processedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
            paragraphs.forEach(paragraph => {
                const trimmedPara = paragraph.trim();
                if (trimmedPara.match(/^[A-Z\s]{10,}$/) || trimmedPara.match(/^\d+\./) || trimmedPara.match(/^SECTION|^ARTICLE/)) {
                    wordContent += `<p class="legal-header">${trimmedPara}</p>`;
                } else {
                    wordContent += `<p class="legal-paragraph">${trimmedPara}</p>`;
                }
            });
            
            if (selectedSuggestions.length > 0) {
                wordContent += `<div class="revision-section">`;
                wordContent += `<h2>REVISION SUMMARY</h2>`;
                selectedSuggestions.forEach((suggestion, index) => {
                    wordContent += `<div>Revision ${index + 1}: ${suggestion.description}</div>`;
                });
                wordContent += `</div>`;
            }
            
            wordContent += '</body></html>';
            
            const blob = new Blob([wordContent], { type: 'application/vnd.ms-word;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `NDA_Redlined_${new Date().toISOString().split('T')[0]}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error("Error generating Word document:", error);
            alert("Error generating Word document. Please try again or use the copy option.");
        }
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
                    <textarea className="nda-textarea-fullwidth" placeholder="Paste your NDA text here for personalized legal analysis..." value={ndaText} onChange={(e) => handleTextChange(e.target.value)} />
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
                                            <button className="redraft-btn download-btn" onClick={downloadTextRedraft} disabled={getTotalSelectedChanges() === 0}>
                                                <i data-feather="download"></i> Download Text
                                            </button>
                                            <button className="redraft-btn download-btn" onClick={downloadWordWithRedlines} disabled={getTotalSelectedChanges() === 0} style={{backgroundColor: "#dc2626"}}>
                                                <i data-feather="file-text"></i> Download MS Word (Redlined)
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