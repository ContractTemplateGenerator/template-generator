const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [originalNDA, setOriginalNDA] = useState(''); // Store original for redrafting
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('technology');
    const [ndaUrl, setNdaUrl] = useState('');
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    
    // Dialogue and redrafting system
    const [dialogueStep, setDialogueStep] = useState(0);
    const [ndaContext, setNdaContext] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [dialogueQuestions, setDialogueQuestions] = useState([]);
    const [clauseAdjustments, setClauseAdjustments] = useState({});
    const [redraftedNDA, setRedraftedNDA] = useState('');
    const [changesSummary, setChangesSummary] = useState([]);
    const [showPaymentMockup, setShowPaymentMockup] = useState(false);
    
    const fileInputRef = useRef(null);

    // Initial instructions for analysis pane
    const initialInstructions = `
        <div class="initial-instructions">
            <h2><strong>🛡️ Professional NDA Risk Analysis System</strong></h2>
            <p>This tool provides sophisticated legal analysis of Non-Disclosure Agreements using proprietary evaluation methodology developed through 13+ years of California legal practice.</p>
            
            <h3><strong>📊 How We Evaluate Your NDA:</strong></h3>
            
            <div class="evaluation-methodology">
                <div class="method-card">
                    <h4>🔍 Clause-by-Clause Analysis</h4>
                    <p>Each provision is examined for enforceability, scope, and practical impact on both parties</p>
                </div>
                <div class="method-card">
                    <h4>⚖️ Balance Assessment</h4>
                    <p>Terms are categorized into a 3-column table showing which party each clause favors</p>
                </div>
                <div class="method-card">
                    <h4>📋 Section Reference Mapping</h4>
                    <p>All analysis references specific section numbers from your uploaded agreement</p>
                </div>
                <div class="method-card">
                    <h4>🎯 Personalized Recommendations</h4>
                    <p>Interactive dialogue system provides customized advice based on your position and preferences</p>
                </div>
            </div>
            
            <h3><strong>🔧 Professional Redrafting Process:</strong></h3>
            <ul>
                <li><strong>Exact Verbiage Matching:</strong> Maintains your document's capitalization, defined terms, and professional style</li>
                <li><strong>Clause Adjustment Tool:</strong> Interactive system to modify, add, or remove specific provisions</li>
                <li><strong>Change Summary:</strong> Detailed report of all modifications with legal rationale</li>
                <li><strong>Professional Integration:</strong> New clauses seamlessly match your document's language and structure</li>
            </ul>
            
            <div class="file-support-notice">
                <h4>📁 Accepted File Types:</h4>
                <p><strong>Documents:</strong> .txt, .docx, .pdf<br>
                <strong>URLs:</strong> SEC filings, legal databases, public document links<br>
                <strong>Text:</strong> Copy/paste directly into the input field</p>
            </div>
            
            <div class="attorney-credentials">
                <p><strong>Analysis by:</strong> Sergei Tokmakov, Esq. • CA Bar #279869 • 13+ Years Experience<br>
                <strong>Specialization:</strong> Technology Contracts, Startup Legal, IP Protection</p>
            </div>
        </div>
    `;

    // Enhanced file upload handler supporting multiple formats
    const handleFileUpload = async (file) => {
        if (!file) return;
        
        setIsAnalyzing(true);
        
        try {
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const text = await file.text();
                setNdaText(text);
                setOriginalNDA(text);
            } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                await handlePDFFile(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
                await handleWordFile(file);
            } else {
                alert('Supported formats: .txt, .docx, .pdf files, or paste text directly.');
            }
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error reading file. Please try copying and pasting the text directly.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // PDF file handler (simplified extraction)
    const handlePDFFile = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            // For now, alert user to copy text manually
            // In production, would use PDF.js or similar
            alert('PDF support: Please copy the text from your PDF and paste it into the text area below. Full PDF parsing will be available in the next update.');
        } catch (error) {
            console.error('PDF parsing error:', error);
            alert('PDF parsing error. Please copy and paste the text manually.');
        }
    };

    // Word file handler (simplified extraction)
    const handleWordFile = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            // For now, alert user to copy text manually  
            // In production, would use mammoth.js or similar
            alert('Word document support: Please copy the text from your document and paste it into the text area below. Full .docx parsing will be available in the next update.');
        } catch (error) {
            console.error('Word parsing error:', error);
            alert('Word document parsing error. Please copy and paste the text manually.');
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

    // Analyze NDA using the exact same pattern as working chatboxes
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        // Create user message in the same format as working chatboxes
        const userMessage = { 
            role: 'user', 
            content: `Please analyze this NDA and determine if it's okay to sign as-is. Consider the industry context: ${industry}.\n\nNDA TEXT:\n${ndaText}` 
        };
        
        console.log('🔍 Debug: Starting NDA analysis...');
        console.log('🔍 Debug: User message:', userMessage);
        console.log('🔍 Debug: Industry context:', industry);
        console.log('🔍 Debug: NDA text length:', ndaText.length);
        
        try {
            // Use the exact same API call pattern as working chatboxes
            console.log('🔍 Debug: Sending request to API...');
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

            console.log('🔍 Debug: Response status:', response.status);
            console.log('🔍 Debug: Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔍 Debug: API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();
            console.log('🔍 Debug: API Response received:', data);
            console.log('🔍 Debug: Response has data.response:', !!data.response);
            console.log('🔍 Debug: Model used:', data.model);
            
            if (data.response) {
                console.log('🔍 Debug: Setting analysis result...');
                
                // Extract NDA context for dialogue system
                const context = extractNDAContext(ndaText);
                setNdaContext(context);
                
                // Generate dialogue questions based on NDA content
                const questions = generateDialogueQuestions(context);
                setDialogueQuestions(questions);
                
                setAnalysisResult({
                    htmlContent: data.response,
                    recommendation: extractRecommendation(data.response),
                    model: data.model || 'AI Analysis',
                    provider: data.provider || (useClaudeAI ? 'Anthropic Claude 4.0' : 'Groq Llama'),
                    hasDialogue: true
                });
                console.log('🔍 Debug: Analysis result set successfully!');
                
                // Start dialogue system
                setDialogueStep(0);
            } else {
                throw new Error('No response content received from API');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            
            // Extract NDA context even for fallback
            const context = extractNDAContext(ndaText);
            setNdaContext(context);
            
            // Generate dialogue questions
            const questions = generateDialogueQuestions(context);
            setDialogueQuestions(questions);
            
            // Always use fallback response when API fails
            setAnalysisResult({
                htmlContent: fallbackResponses.default,
                recommendation: 'CONTEXTUAL DUAL-PARTY ANALYSIS',
                model: 'Professional Fallback Analysis',
                provider: 'Terms.law Legal Guidance',
                hasDialogue: true
            });
            
            // Start dialogue system
            setDialogueStep(0);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Extract key insight from response instead of categorical recommendation
    const extractRecommendation = (htmlResponse) => {
        // Look for document overview or analysis summary
        const overviewMatch = htmlResponse.match(/<strong>DOCUMENT OVERVIEW:<\/strong>\s*([^<]+)/);
        if (overviewMatch) {
            return overviewMatch[1].trim().substring(0, 80) + '...';
        }
        
        // Look for balance assessment
        const balanceMatch = htmlResponse.match(/<strong>AGREEMENT BALANCE:<\/strong>(.*?)<br><br>/s);
        if (balanceMatch) {
            const balanceText = balanceMatch[1].replace(/<[^>]*>/g, '').trim();
            return balanceText.substring(0, 80) + '...';
        }
        
        // Fallback to generic analysis indicator
        if (htmlResponse.includes('DOCUMENT OVERVIEW')) return 'NUANCED LEGAL ANALYSIS';
        if (htmlResponse.includes('ANALYSIS FOR')) return 'DUAL-PARTY ANALYSIS';
        if (htmlResponse.includes('CONTEXT MATTERS')) return 'CONTEXTUAL REVIEW';
        return 'PROFESSIONAL ANALYSIS';
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

    // Extract key NDA details for dialogue system (token-efficient)
    const extractNDAContext = (ndaText) => {
        const context = {
            parties: [],
            term: null,
            restrictions: [],
            clauses: []
        };
        
        // Extract party names (simple regex approach)
        const partyMatches = ndaText.match(/between\s+([^,\n]+)\s+(?:and|&)\s+([^,\n]+)/i);
        if (partyMatches) {
            context.parties = [
                partyMatches[1].trim().replace(/['"]/g, ''),
                partyMatches[2].trim().replace(/['"]/g, '')
            ];
        }
        
        // Extract term duration
        const termMatch = ndaText.match(/(\d+)\s+(year|month|day)s?/i);
        if (termMatch) {
            context.term = `${termMatch[1]} ${termMatch[2]}${termMatch[1] > 1 ? 's' : ''}`;
        }
        
        // Check for common clauses
        if (ndaText.toLowerCase().includes('non-solicit')) {
            context.restrictions.push('non-solicitation');
        }
        if (ndaText.toLowerCase().includes('non-compete')) {
            context.restrictions.push('non-compete');
        }
        if (ndaText.toLowerCase().includes('return') && ndaText.toLowerCase().includes('materials')) {
            context.restrictions.push('return-materials');
        }
        
        return context;
    };

    // Generate dialogue questions based on NDA context
    const generateDialogueQuestions = (context) => {
        const questions = [];
        
        // Question 1: Which party are you?
        if (context.parties.length >= 2) {
            questions.push({
                id: 'party',
                question: 'Which party do you represent in this agreement?',
                options: [
                    { value: 'party1', label: `${context.parties[0]} (Disclosing Party)`, shortLabel: context.parties[0] },
                    { value: 'party2', label: `${context.parties[1]} (Receiving Party)`, shortLabel: context.parties[1] }
                ]
            });
        } else {
            questions.push({
                id: 'party',
                question: 'Which party do you represent?',
                options: [
                    { value: 'disclosing', label: 'Disclosing Party (Information Sharer)', shortLabel: 'Disclosing Party' },
                    { value: 'receiving', label: 'Receiving Party (Information Recipient)', shortLabel: 'Receiving Party' }
                ]
            });
        }
        
        // Question 2: Restrictiveness preference
        questions.push({
            id: 'restrictiveness',
            question: 'How restrictive do you want this agreement to be?',
            options: [
                { value: 'minimal', label: 'Minimal restrictions - Focus on essential protections only', shortLabel: 'Minimal' },
                { value: 'balanced', label: 'Balanced approach - Standard business protections', shortLabel: 'Balanced' },
                { value: 'strict', label: 'Strict protections - Maximum confidentiality safeguards', shortLabel: 'Strict' }
            ]
        });
        
        // Question 3: Term duration (if extracted)
        if (context.term) {
            questions.push({
                id: 'term',
                question: `The current term is ${context.term}. Is this appropriate?`,
                options: [
                    { value: 'shorter', label: 'Too long - I want a shorter term', shortLabel: 'Shorter' },
                    { value: 'current', label: `${context.term} is appropriate`, shortLabel: 'Keep current' },
                    { value: 'longer', label: 'Too short - I want a longer term', shortLabel: 'Longer' }
                ]
            });
        }
        
        // Question 4: Non-solicitation clause
        if (context.restrictions.includes('non-solicitation')) {
            questions.push({
                id: 'nonsolicitation',
                question: 'This NDA includes a non-solicitation clause. Do you want to keep it?',
                options: [
                    { value: 'keep', label: 'Keep the non-solicitation clause', shortLabel: 'Keep' },
                    { value: 'remove', label: 'Remove the non-solicitation clause', shortLabel: 'Remove' },
                    { value: 'modify', label: 'Modify to be less restrictive', shortLabel: 'Modify' }
                ]
            });
        } else {
            questions.push({
                id: 'nonsolicitation',
                question: 'Do you want to add a non-solicitation clause?',
                options: [
                    { value: 'add', label: 'Yes, add non-solicitation protections', shortLabel: 'Add' },
                    { value: 'no', label: 'No, keep it focused on confidentiality only', shortLabel: 'No' }
                ]
            });
        }
        
        return questions;
    };

    // Handle dialogue answer (token-efficient API call)
    const handleDialogueAnswer = async (questionId, answer) => {
        const newAnswers = { ...userAnswers, [questionId]: answer };
        setUserAnswers(newAnswers);
        
        // If this is the last question, get final analysis
        if (dialogueStep >= dialogueQuestions.length - 1) {
            await getFinalAnalysis(newAnswers);
        } else {
            setDialogueStep(dialogueStep + 1);
        }
    };

    // Get final customized analysis (token-efficient)
    const getFinalAnalysis = async (answers) => {
        setIsAnalyzing(true);
        
        // Build context summary instead of sending full NDA text again
        const contextSummary = {
            parties: ndaContext.parties,
            term: ndaContext.term,
            restrictions: ndaContext.restrictions,
            userAnswers: answers
        };
        
        const userMessage = {
            role: 'user',
            content: `Based on this NDA context: ${JSON.stringify(contextSummary)}, provide customized analysis for the user's specific position and preferences. Focus on practical recommendations and specific clause suggestions.`
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
                    recommendation: 'CUSTOMIZED ANALYSIS FOR YOUR POSITION',
                    model: data.model || 'Enhanced AI Analysis',
                    provider: data.provider || (useClaudeAI ? 'Anthropic Claude 4.0' : 'Groq Llama'),
                    isCustomized: true
                });
            } else {
                throw new Error('No response content received from API');
            }
        } catch (error) {
            console.error('Final analysis error:', error);
            alert('Final analysis temporarily unavailable. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Download redrafted NDA
    const downloadRedraft = () => {
        if (!redraftedNDA) return;
        
        const blob = new Blob([redraftedNDA], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Redrafted_NDA.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Copy redrafted NDA to clipboard
    const copyRedraftToClipboard = async () => {
        if (!redraftedNDA) return;
        
        try {
            await navigator.clipboard.writeText(redraftedNDA);
            alert('Redrafted NDA copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = redraftedNDA;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Redrafted NDA copied to clipboard!');
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

    // Get styling class based on analysis type
    const getRecommendationClass = (recommendation) => {
        if (!recommendation) return 'analysis';
        return 'analysis';
    };
    return (
        <div className="nda-analyzer">
            <div className="header">
                <h1>🛡️ NDA Risk Analyzer</h1>
                <p>Professional Legal Analysis & Automated Redrafting System</p>
                <div className="attorney-info">
                    Sergei Tokmakov, Esq. • CA Bar #279869 • 13+ Years Experience
                </div>
            </div>

            {/* Input Section - Now Above Analysis */}
            <div className="input-section">
                <h2>
                    <i data-feather="upload-cloud"></i>
                    Upload NDA Document or Enter Text
                </h2>

                <div className="upload-methods">
                    <div className="file-upload-area">
                        <div 
                            className="file-upload"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="upload-icon">📄</div>
                            <div className="upload-text">
                                Drag & drop files here or click to browse
                            </div>
                            <div className="upload-subtext">
                                Supports: .txt, .docx, .pdf • Max 10MB
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt,.docx,.pdf,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(e) => handleFileUpload(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                        </div>
                        
                        <div className="url-input-section">
                            <div className="url-input-header">Or enter URL to legal document:</div>
                            <div className="url-input-group">
                                <input
                                    type="url"
                                    className="url-input"
                                    placeholder="https://www.sec.gov/Archives/edgar/data/..."
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

                    <div className="text-input-area">
                        <textarea
                            className="nda-textarea"
                            placeholder="Or paste your NDA text here for professional analysis...

Example formats supported:
• Complete NDA agreements
• SEC filings with confidentiality provisions  
• Draft contracts for review
• Existing agreements for modification

The more complete the text, the more detailed the analysis and section-specific recommendations."
                            value={ndaText}
                            onChange={(e) => {
                                setNdaText(e.target.value);
                                setOriginalNDA(e.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className="analysis-controls">
                    <div className="controls-row">
                        <div className="industry-select">
                            <label>Industry Context:</label>
                            <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                                <option value="technology">Technology/Software</option>
                                <option value="healthcare">Healthcare/Medical</option>
                                <option value="finance">Finance/Banking</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="consulting">Consulting/Services</option>
                                <option value="real-estate">Real Estate</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div className="ai-toggle-group">
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
                                Analyze NDA Risk & Generate Report
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Full-Width Analysis Panel */}
            <div className="analysis-panel-fullwidth">
                <h2>
                    <i data-feather="file-text"></i>
                    Professional Legal Analysis
                </h2>

                <div className="analysis-content">
                    {!analysisResult ? (
                        <div dangerouslySetInnerHTML={{ __html: initialInstructions }} />
                    ) : (
                        <div className="analysis-results">
                            <div className={`recommendation-card ${getRecommendationClass(analysisResult.recommendation)}`}>
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

                            {/* Three-Column Clause Analysis Table */}
                            {ndaContext && ndaContext.sections && ndaContext.sections.length > 0 && (
                                <div className="clause-balance-table">
                                    <h3>📊 Clause Balance Analysis</h3>
                                    <table className="balance-analysis-table">
                                        <thead>
                                            <tr>
                                                <th>Favoring {ndaContext.parties[0] || 'Disclosing Party'}</th>
                                                <th>Neutral/Mutual</th>
                                                <th>Favoring {ndaContext.parties[1] || 'Receiving Party'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="favoring-party1">
                                                    {ndaContext.sections.filter(s => s.title.toLowerCase().includes('confidential')).map(section => (
                                                        <div key={section.number} className="clause-item">
                                                            <strong>Section {section.number}:</strong> {section.title}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="neutral-clauses">
                                                    {ndaContext.sections.filter(s => s.title.toLowerCase().includes('definition')).map(section => (
                                                        <div key={section.number} className="clause-item">
                                                            <strong>Section {section.number}:</strong> {section.title}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="favoring-party2">
                                                    {ndaContext.sections.filter(s => s.title.toLowerCase().includes('exception')).map(section => (
                                                        <div key={section.number} className="clause-item">
                                                            <strong>Section {section.number}:</strong> {section.title}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Dialogue System */}
                            {analysisResult.hasDialogue && !analysisResult.isCustomized && dialogueQuestions.length > 0 && (
                                <div className="dialogue-section">
                                    <h3 className="dialogue-title">
                                        🎯 Customize Analysis & Generate Redraft
                                    </h3>
                                    
                                    {/* Progress indicator */}
                                    <div className="dialogue-progress">
                                        <div className="progress-text">
                                            Question {dialogueStep + 1} of {dialogueQuestions.length}
                                        </div>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{width: `${((dialogueStep + 1) / dialogueQuestions.length) * 100}%`}}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Current question */}
                                    {dialogueQuestions[dialogueStep] && (
                                        <div className="dialogue-question">
                                            <h4 className="question-text">
                                                {dialogueQuestions[dialogueStep].question}
                                            </h4>
                                            <div className="question-options">
                                                {dialogueQuestions[dialogueStep].options.map((option, index) => (
                                                    <button
                                                        key={option.value}
                                                        className="dialogue-option"
                                                        onClick={() => handleDialogueAnswer(dialogueQuestions[dialogueStep].id, option)}
                                                        disabled={isAnalyzing}
                                                    >
                                                        <div className="option-label">{option.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Previous answers summary */}
                                    {Object.keys(userAnswers).length > 0 && (
                                        <div className="answers-summary">
                                            <h5>Your selections:</h5>
                                            {Object.entries(userAnswers).map(([questionId, answer]) => (
                                                <div key={questionId} className="answer-item">
                                                    <strong>{questionId}:</strong> {answer.shortLabel || answer.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Payment Mockup & Redraft Options */}
                            {analysisResult.isCustomized && (
                                <div className="redraft-options">
                                    <h3>📝 Professional Redrafting Services</h3>
                                    
                                    <div className="payment-mockup">
                                        <div className="service-tier basic-tier">
                                            <h4>Basic Redraft - $197</h4>
                                            <p>✓ Clause adjustments based on your preferences<br>
                                               ✓ Professional language matching<br>
                                               ✓ Change summary report</p>
                                            <button className="mockup-payment-btn" onClick={() => setShowPaymentMockup(true)}>
                                                Select Basic Redraft
                                            </button>
                                        </div>
                                        
                                        <div className="service-tier premium-tier featured">
                                            <h4>Premium Redraft - $397</h4>
                                            <p>✓ Everything in Basic<br>
                                               ✓ Multiple agreement versions<br>
                                               ✓ Negotiation strategy guide<br>
                                               ✓ 30-minute consultation call</p>
                                            <button className="mockup-payment-btn primary" onClick={() => setShowPaymentMockup(true)}>
                                                Select Premium Redraft
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {showPaymentMockup && (
                                        <div className="payment-mockup-overlay">
                                            <div className="payment-form">
                                                <h4>Payment Processing (Demo Only)</h4>
                                                <p>This is a mockup of the payment system. In production, this would integrate with Stripe or similar payment processor.</p>
                                                <button onClick={() => setShowPaymentMockup(false)}>Close Mockup</button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Redraft Download Buttons */}
                                    {redraftedNDA && (
                                        <div className="redraft-download">
                                            <h4>Your Redrafted Agreement is Ready!</h4>
                                            <div className="redraft-actions">
                                                <button className="download-btn" onClick={() => downloadRedraft()}>
                                                    <i data-feather="download"></i>
                                                    Download Redrafted NDA
                                                </button>
                                                <button className="copy-btn" onClick={() => copyRedraftToClipboard()}>
                                                    <i data-feather="copy"></i>
                                                    Copy to Clipboard
                                                </button>
                                            </div>
                                            
                                            {changesSummary.length > 0 && (
                                                <div className="changes-summary">
                                                    <h5>Summary of Changes Made:</h5>
                                                    <ul>
                                                        {changesSummary.map((change, index) => (
                                                            <li key={index}>{change}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
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
                                        setOriginalNDA('');
                                        setDialogueStep(0);
                                        setUserAnswers({});
                                        setRedraftedNDA('');
                                        setChangesSummary([]);
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
    );
};

// Render the component
ReactDOM.render(<NDAAnalyzer />, document.getElementById('root'));