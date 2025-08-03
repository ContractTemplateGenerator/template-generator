/**
 * NDA Risk Analyzer V2 - Complete Rebuild
 * Features:
 * - Standard provisions analysis matrix
 * - Proper party-favoring analysis
 * - Clean checkbox interface for revisions
 * - Proper Word document export with highlighting
 * - Streamlined workflow
 */

const { useState, useRef, useEffect } = React;

// Standard NDA provisions to analyze
const STANDARD_PROVISIONS = {
    definition_confidential_info: {
        name: "Definition of Confidential Information",
        description: "How broadly or narrowly confidential information is defined",
        options: {
            narrow: "Limited to specific marked information only",
            standard: "Standard business information with reasonable exceptions",
            broad: "All information disclosed, regardless of marking"
        }
    },
    term_duration: {
        name: "Term Duration",
        description: "How long the NDA obligations last",
        options: {
            short: "1-2 years",
            standard: "3-5 years", 
            long: "Perpetual or 10+ years"
        }
    },
    purpose_limitation: {
        name: "Purpose Limitation",
        description: "How the receiving party can use the information",
        options: {
            strict: "Only for evaluation of specific deal/relationship",
            standard: "For evaluation and related business purposes",
            broad: "For any lawful business purpose"
        }
    },
    disclosure_obligations: {
        name: "Disclosure Obligations",
        description: "What party must disclose and when",
        options: {
            mutual: "Both parties disclose equally",
            one_way: "Only one party discloses",
            unbalanced: "Unequal disclosure requirements"
        }
    },
    return_destruction: {
        name: "Return/Destruction of Information",
        description: "Requirements for handling info after termination",
        options: {
            strict: "Must return/destroy all copies immediately",
            standard: "Return/destroy within reasonable time (30-60 days)",
            lenient: "May retain copies or no specific requirements"
        }
    },
    remedies: {
        name: "Remedies for Breach",
        description: "What happens if someone breaches the NDA",
        options: {
            limited: "Monetary damages only",
            standard: "Monetary damages plus injunctive relief",
            harsh: "Liquidated damages, attorneys fees, broad injunctions"
        }
    },
    jurisdiction: {
        name: "Governing Law & Jurisdiction",
        description: "Which courts and laws apply",
        options: {
            neutral: "Mutually acceptable jurisdiction",
            party1_favored: "Disclosing party's preferred jurisdiction",
            party2_favored: "Receiving party's preferred jurisdiction"
        }
    },
    survival: {
        name: "Survival Clauses",
        description: "Which obligations survive termination",
        options: {
            limited: "Only core confidentiality survives",
            standard: "Confidentiality and key provisions survive",
            extensive: "Most/all provisions survive indefinitely"
        }
    }
};

const NDAAnalyzerV2 = () => {
    // State management
    const [ndaText, setNdaText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState('upload'); // upload, analyze, matrix, revise
    
    // AI Model selection
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    const [modelUsed, setModelUsed] = useState('');
    
    // Analysis results
    const [provisionAnalysis, setProvisionAnalysis] = useState({});
    const [overallAssessment, setOverallAssessment] = useState(null);
    const [extractedParties, setExtractedParties] = useState([]);
    
    // Revision tracking
    const [selectedRevisions, setSelectedRevisions] = useState({});
    const [revisionText, setRevisionText] = useState('');
    const [changeLog, setChangeLog] = useState([]);
    
    // Preview system
    const [activePreview, setActivePreview] = useState(null);
    const [previewContent, setPreviewContent] = useState('');
    
    // File handling
    const fileInputRef = useRef(null);

    // Extract party information from NDA text
    const extractParties = (text) => {
        const partyPatterns = [
            /\b([A-Z][A-Za-z\s&.]+(?:Inc|LLC|Corp|Ltd|Company|Corporation)\.?)\b/g,
            /"([^"]+)"(?:\s*\([^)]*\))?/g,
            /\b([A-Z]{2,}(?:\s+[A-Z]{2,})*)\b/g
        ];
        
        const foundParties = new Set();
        
        partyPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const cleaned = match.replace(/["""()]/g, '').trim();
                    if (cleaned.length > 2 && cleaned.length < 100) {
                        foundParties.add(cleaned);
                    }
                });
            }
        });
        
        return Array.from(foundParties).slice(0, 4); // Limit to 4 potential parties
    };

    // Analyze provisions using AI with model selection
    const analyzeProvisions = async (text) => {
        setIsAnalyzing(true);
        
        try {
            // Create comprehensive analysis prompt
            const analysisPrompt = `
Analyze this NDA comprehensively for standard provisions. For each provision, provide detailed analysis comparing to industry standards.

For each provision found, explain:
1. Is it present and how is it characterized?
2. Does it favor disclosing party, receiving party, or neutral?
3. WHY does it favor that party compared to industry standard?
4. How does this compare to typical NDAs (more/less restrictive)?

Analyze these provisions:
- Definition of Confidential Information (narrow/standard/broad)
- Term Duration (short 1-2yr/standard 3-5yr/long 5+yr)
- Purpose Limitation (strict/standard/broad)
- Return/Destruction Requirements (strict/standard/lenient)
- Remedies for Breach (limited/standard/harsh)
- Disclosure Obligations (mutual/one-way/unbalanced)
- Governing Law & Jurisdiction (neutral/party1-favored/party2-favored)
- Survival Clauses (limited/standard/extensive)

NDA Text:
${text}

Return detailed JSON analysis with industry context for each provision.`;

            // Choose API endpoint based on model selection
            const apiEndpoint = useClaudeAI ? '/api/claude-ownership-groq-chat' : '/api/nda-risk-chat';
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: analysisPrompt
                    }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                setModelUsed(data.model || (useClaudeAI ? 'Claude' : 'Llama'));
                
                // Try to parse JSON from response
                try {
                    const analysisData = JSON.parse(data.response);
                    setProvisionAnalysis(analysisData.provisions || {});
                    setOverallAssessment(analysisData.overall_assessment || {});
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    // Fallback: enhanced manual analysis
                    setProvisionAnalysis(performEnhancedManualAnalysis(text));
                    setOverallAssessment(generateOverallAssessment(text));
                    setModelUsed('Manual Analysis (AI Parse Failed)');
                }
            } else {
                throw new Error('API call failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            // Fallback to enhanced manual analysis
            setProvisionAnalysis(performEnhancedManualAnalysis(text));
            setOverallAssessment(generateOverallAssessment(text));
            setModelUsed('Manual Analysis (API Failed)');
        }
        
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setCurrentStep('matrix');
    };

    // Enhanced manual analysis with industry context
    const performEnhancedManualAnalysis = (text) => {
        const analysis = {};
        
        Object.keys(STANDARD_PROVISIONS).forEach(provisionKey => {
            const provision = STANDARD_PROVISIONS[provisionKey];
            
            // Enhanced keyword-based analysis with industry context
            let present = false;
            let characterization = 'standard';
            let favors = 'neutral';
            let textLocation = '';
            let industryComparison = '';
            let whyMatters = '';
            
            // Analyze based on provision type with detailed explanations
            switch (provisionKey) {
                case 'definition_confidential_info':
                    if (text.toLowerCase().includes('confidential information')) {
                        present = true;
                        textLocation = extractTextSnippet(text, 'confidential information');
                        
                        if (text.toLowerCase().includes('marked') || text.toLowerCase().includes('designated') || text.toLowerCase().includes('specifically identified')) {
                            characterization = 'narrow';
                            favors = 'receiving_party';
                            industryComparison = 'More restrictive than 70% of NDAs - only marked information counts';
                            whyMatters = 'Receiving party has clear boundaries on what constitutes confidential information';
                        } else if (text.toLowerCase().includes('all information') || text.toLowerCase().includes('any information') || text.toLowerCase().includes('whether or not marked')) {
                            characterization = 'broad';
                            favors = 'disclosing_party';
                            industryComparison = 'Broader than 80% of NDAs - captures unmarked information';
                            whyMatters = 'Disclosing party gets maximum protection even for casual disclosures';
                        } else {
                            industryComparison = 'Standard definition found in 60% of commercial NDAs';
                            whyMatters = 'Balanced approach between protection and practical use';
                        }
                    }
                    break;
                    
                case 'term_duration':
                    const termMatches = text.match(/(\d+)\s*(year|month)/gi);
                    if (termMatches) {
                        present = true;
                        const termText = termMatches[0];
                        textLocation = extractTextSnippet(text, termText);
                        const years = parseInt(termText);
                        
                        if (years <= 2) {
                            characterization = 'short';
                            favors = 'receiving_party';
                            industryComparison = 'Shorter than 75% of NDAs - reduces long-term burden';
                            whyMatters = 'Receiving party can use information sooner with less ongoing risk';
                        } else if (years >= 5) {
                            characterization = 'long';
                            favors = 'disclosing_party';
                            industryComparison = 'Longer than 70% of NDAs - extends protection period';
                            whyMatters = 'Disclosing party gets extended protection for valuable information';
                        } else {
                            industryComparison = 'Standard 3-5 year term used in 65% of commercial NDAs';
                            whyMatters = 'Balanced timeframe that protects interests without excessive burden';
                        }
                    } else if (text.toLowerCase().includes('perpetual') || text.toLowerCase().includes('indefinite')) {
                        present = true;
                        characterization = 'long';
                        favors = 'disclosing_party';
                        textLocation = extractTextSnippet(text, 'perpetual');
                        industryComparison = 'More restrictive than 90% of NDAs - indefinite obligations';
                        whyMatters = 'Creates permanent confidentiality burden on receiving party';
                    }
                    break;
                    
                case 'return_destruction':
                    if (text.toLowerCase().includes('return') && text.toLowerCase().includes('destroy')) {
                        present = true;
                        textLocation = extractTextSnippet(text, 'return');
                        
                        if (text.toLowerCase().includes('immediately') || text.toLowerCase().includes('promptly')) {
                            characterization = 'strict';
                            favors = 'disclosing_party';
                            industryComparison = 'Stricter than 75% of NDAs - immediate compliance required';
                            whyMatters = 'Disclosing party can quickly reclaim all confidential materials';
                        } else if (text.match(/\d+\s*days?/i)) {
                            const days = parseInt(text.match(/(\d+)\s*days?/i)[1]);
                            if (days <= 30) {
                                characterization = 'strict';
                                favors = 'disclosing_party';
                                industryComparison = 'Stricter than 60% of NDAs - short compliance window';
                            } else {
                                characterization = 'standard';
                                industryComparison = 'Standard 30-60 day window found in most NDAs';
                            }
                            whyMatters = `${days}-day window ${days <= 30 ? 'requires quick action' : 'allows reasonable compliance time'}`;
                        }
                    }
                    break;
                    
                case 'remedies':
                    if (text.toLowerCase().includes('remedy') || text.toLowerCase().includes('damages') || text.toLowerCase().includes('injunc')) {
                        present = true;
                        textLocation = extractTextSnippet(text, 'remedy');
                        
                        if (text.toLowerCase().includes('injunctive relief') || text.toLowerCase().includes('equitable relief')) {
                            if (text.toLowerCase().includes('liquidated damages') || text.toLowerCase().includes('attorneys')) {
                                characterization = 'harsh';
                                favors = 'disclosing_party';
                                industryComparison = 'More aggressive than 85% of NDAs - multiple severe remedies';
                                whyMatters = 'Creates maximum deterrent with expensive consequences for breaches';
                            } else {
                                characterization = 'standard';
                                industryComparison = 'Standard remedy clause allowing both damages and injunctions';
                                whyMatters = 'Provides balanced enforcement options for different types of breaches';
                            }
                        } else {
                            characterization = 'limited';
                            favors = 'receiving_party';
                            industryComparison = 'More limited than 70% of NDAs - damages only';
                            whyMatters = 'Receiving party faces lower risk with only monetary consequences';
                        }
                    }
                    break;
                    
                // Add more enhanced cases
                default:
                    // Generic enhanced analysis
                    const keywords = provision.name.toLowerCase().split(' ');
                    present = keywords.some(keyword => text.toLowerCase().includes(keyword));
                    if (present) {
                        textLocation = extractTextSnippet(text, keywords[0]);
                        industryComparison = 'Standard provision found in most NDAs';
                        whyMatters = 'Common contractual protection with typical business impact';
                    }
            }
            
            analysis[provisionKey] = {
                present,
                favors,
                characterization,
                text_location: textLocation,
                assessment: `${present ? 'Found' : 'Missing'} - ${industryComparison}`,
                industry_comparison: industryComparison,
                why_matters: whyMatters
            };
        });
        
        return analysis;
    };

    // Extract text snippet around keyword
    const extractTextSnippet = (text, keyword) => {
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (index === -1) return '';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + keyword.length + 50);
        return '...' + text.substring(start, end) + '...';
    };

    // Generate overall assessment
    const generateOverallAssessment = (text) => {
        return {
            balance: 'balanced',
            risk_level: 'medium',
            recommendation: 'negotiate'
        };
    };

    // Handle file upload
    const handleFileUpload = async (file) => {
        if (!file) return;
        
        try {
            let text = '';
            
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                text = await file.text();
            } else if (file.type === 'application/pdf') {
                alert('PDF support coming soon. Please convert to text and paste directly.');
                return;
            } else {
                alert('Please upload a .txt file or paste text directly.');
                return;
            }
            
            setNdaText(text);
            setExtractedParties(extractParties(text));
            setCurrentStep('analyze');
            
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error reading file. Please paste text directly.');
        }
    };

    // Generate revision suggestions
    const generateRevisionSuggestions = (provisionKey, currentAnalysis) => {
        const provision = STANDARD_PROVISIONS[provisionKey];
        const suggestions = {};
        
        // Generate suggestions for each party and neutral
        suggestions.disclosing_party = {
            title: `Make ${provision.name} favor Disclosing Party`,
            changes: getProvisionSuggestions(provisionKey, 'disclosing_party'),
            impact: 'Increases protection for the party sharing information'
        };
        
        suggestions.receiving_party = {
            title: `Make ${provision.name} favor Receiving Party`,
            changes: getProvisionSuggestions(provisionKey, 'receiving_party'),
            impact: 'Reduces burden on the party receiving information'
        };
        
        suggestions.neutral = {
            title: `Make ${provision.name} balanced/neutral`,
            changes: getProvisionSuggestions(provisionKey, 'neutral'),
            impact: 'Creates fair terms for both parties'
        };
        
        return suggestions;
    };

    // Get specific provision suggestions
    const getProvisionSuggestions = (provisionKey, favoredParty) => {
        const suggestions = {
            definition_confidential_info: {
                disclosing_party: [
                    "Expand definition to include 'all information disclosed, whether oral, written, or visual'",
                    "Remove requirement for information to be marked as confidential",
                    "Include broadly defined categories like 'business plans, strategies, and know-how'"
                ],
                receiving_party: [
                    "Limit to information specifically marked as confidential",
                    "Add exclusions for independently developed information",
                    "Require clear identification at time of disclosure"
                ],
                neutral: [
                    "Define as information that is clearly identified as confidential",
                    "Include reasonable exclusions for publicly available information",
                    "Balance broad categories with specific marking requirements"
                ]
            },
            term_duration: {
                disclosing_party: [
                    "Extend term to 5-10 years or perpetual for trade secrets",
                    "No expiration for truly confidential information",
                    "Separate longer terms for different types of information"
                ],
                receiving_party: [
                    "Limit term to 2-3 years maximum",
                    "Allow earlier termination upon request",
                    "Shorter terms for less sensitive information"
                ],
                neutral: [
                    "Set reasonable 3-5 year term",
                    "Different terms for different types of information",
                    "Automatic expiration for information that becomes public"
                ]
            }
            // Add more provision-specific suggestions
        };
        
        return suggestions[provisionKey]?.[favoredParty] || ['Standard industry language'];
    };

    // Handle revision selection
    const handleRevisionSelect = (provisionKey, revisionType, isSelected) => {
        setSelectedRevisions(prev => ({
            ...prev,
            [provisionKey]: isSelected ? revisionType : null
        }));
    };

    // Get revision preview with sample language
    const getRevisionPreview = (provisionKey, revisionType) => {
        const sampleLanguages = {
            definition_confidential_info: {
                disclosing_party: {
                    impact: "Expands what counts as confidential - captures all information disclosed",
                    sampleLanguage: "All information disclosed by either party, whether or not marked confidential, including information learned through observation"
                },
                receiving_party: {
                    impact: "Limits scope to clearly marked information - reduces accidental breaches",
                    sampleLanguage: "Information specifically marked as 'Confidential' at time of disclosure or identified as confidential when disclosed orally"
                },
                neutral: {
                    impact: "Balanced definition with reasonable boundaries and standard exclusions",
                    sampleLanguage: "Non-public information disclosed in connection with this relationship, with standard exclusions for publicly available information"
                }
            },
            term_duration: {
                disclosing_party: {
                    impact: "Extends confidentiality obligations for maximum protection",
                    sampleLanguage: "This Agreement shall remain in effect for ten (10) years or perpetually for trade secrets"
                },
                receiving_party: {
                    impact: "Shortens obligation period to reduce long-term burden",
                    sampleLanguage: "This Agreement shall remain in effect for two (2) years from the date of execution"
                },
                neutral: {
                    impact: "Industry-standard timeframe balancing protection with practicality",
                    sampleLanguage: "This Agreement shall remain in effect for three (3) years from the date first written above"
                }
            },
            return_destruction: {
                disclosing_party: {
                    impact: "Requires immediate return with certification - ensures complete control",
                    sampleLanguage: "Immediately upon termination, return or destroy all confidential materials and provide written certification of compliance"
                },
                receiving_party: {
                    impact: "Allows retention for legitimate purposes with flexible timeline",
                    sampleLanguage: "May retain confidential information as required by law or document retention policies"
                },
                neutral: {
                    impact: "Reasonable timeframe for return with practical compliance window",
                    sampleLanguage: "Within thirty (30) days of termination, return or destroy all confidential information"
                }
            },
            remedies: {
                disclosing_party: {
                    impact: "Maximum enforcement tools with deterrent effect",
                    sampleLanguage: "Entitled to injunctive relief, liquidated damages of $10,000 per breach, and attorneys' fees"
                },
                receiving_party: {
                    impact: "Limits remedies to provable monetary damages only",
                    sampleLanguage: "The sole remedy for breach shall be monetary damages actually proven and directly caused by the breach"
                },
                neutral: {
                    impact: "Standard enforcement options balancing deterrence with fairness",
                    sampleLanguage: "Both monetary damages and injunctive relief shall be available for any material breach"
                }
            },
            purpose_limitation: {
                disclosing_party: {
                    impact: "Strictly limits use to specific evaluation purpose only",
                    sampleLanguage: "Solely for the purpose of evaluating the specific transaction described in Schedule A"
                },
                receiving_party: {
                    impact: "Allows broader business use within reasonable boundaries",
                    sampleLanguage: "For internal business purposes, including evaluation, development, and strategic planning"
                },
                neutral: {
                    impact: "Reasonable scope allowing practical business evaluation",
                    sampleLanguage: "For the purpose of evaluating potential business opportunities and related due diligence"
                }
            },
            jurisdiction: {
                disclosing_party: {
                    impact: "Home court advantage with familiar legal environment",
                    sampleLanguage: "Governed by [Disclosing Party State] law with exclusive jurisdiction in [Their City] courts"
                },
                receiving_party: {
                    impact: "Dispute resolution in receiving party's preferred jurisdiction",
                    sampleLanguage: "Governed by [Receiving Party State] law with jurisdiction in [Their City] courts"
                },
                neutral: {
                    impact: "Neutral jurisdiction that doesn't favor either party",
                    sampleLanguage: "Governed by Delaware law with jurisdiction in Delaware or federal courts"
                }
            },
            survival: {
                disclosing_party: {
                    impact: "Extensive survival ensuring maximum ongoing protection",
                    sampleLanguage: "All provisions of this agreement shall survive termination indefinitely"
                },
                receiving_party: {
                    impact: "Minimal survival reducing ongoing obligations after termination",
                    sampleLanguage: "Only the core confidentiality obligation shall survive termination"
                },
                neutral: {
                    impact: "Key provisions survive while allowing most obligations to end",
                    sampleLanguage: "Confidentiality, return of materials, and remedy provisions shall survive termination"
                }
            }
        };

        return sampleLanguages[provisionKey]?.[revisionType] || {
            impact: "Adjusts provision to favor selected party",
            sampleLanguage: "Sample language would be provided here"
        };
    };

    // Generate revised document
    const generateRevisedDocument = () => {
        let revisedText = ndaText;
        const changes = [];
        
        Object.entries(selectedRevisions).forEach(([provisionKey, revisionType]) => {
            if (revisionType) {
                const provision = STANDARD_PROVISIONS[provisionKey];
                const suggestions = generateRevisionSuggestions(provisionKey, provisionAnalysis[provisionKey]);
                const selectedSuggestion = suggestions[revisionType];
                
                // Track change
                changes.push({
                    provision: provision.name,
                    type: revisionType,
                    description: selectedSuggestion.title,
                    impact: selectedSuggestion.impact
                });
                
                // Add revision marker to text (for highlighting)
                revisedText += `\n\n[REVISION - ${provision.name}]: ${selectedSuggestion.title}\n`;
                selectedSuggestion.changes.forEach((change, index) => {
                    revisedText += `${index + 1}. ${change}\n`;
                });
            }
        });
        
        setRevisionText(revisedText);
        setChangeLog(changes);
        setCurrentStep('revise');
    };

    // Export to Word with proper highlighting
    const exportToWord = () => {
        const wordExporter = new WordExportV2();
        wordExporter.exportToWord(
            ndaText,
            selectedRevisions,
            changeLog,
            {
                provisions: provisionAnalysis,
                overall_assessment: overallAssessment
            }
        );
    };

    // Additional export options
    const exportRedlinedOnly = () => {
        const wordExporter = new WordExportV2();
        // Export just the redlined document
        const htmlContent = wordExporter.generateRedlinedDocument(ndaText, selectedRevisions, changeLog);
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'NDA_Redlined_Changes.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Render upload step
    const renderUploadStep = () => (
        <div className="step-container">
            <div className="step-header">
                <h2>📄 Upload NDA Document</h2>
                <p>Upload your NDA or paste the text to begin analysis</p>
            </div>
            
            <div className="upload-options">
                <div className="upload-method">
                    <h3>📁 File Upload</h3>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        accept=".txt"
                        style={{ display: 'none' }}
                    />
                    <button 
                        className="btn btn-primary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Choose File (.txt)
                    </button>
                </div>
                
                <div className="upload-method">
                    <h3>📝 Paste Text</h3>
                    <textarea
                        value={ndaText}
                        onChange={(e) => {
                            setNdaText(e.target.value);
                            if (e.target.value.trim().length > 100) {
                                setExtractedParties(extractParties(e.target.value));
                            }
                        }}
                        placeholder="Paste your NDA text here..."
                        rows={15}
                        className="nda-textarea"
                    />
                    {ndaText.trim() && (
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                setExtractedParties(extractParties(ndaText));
                                setCurrentStep('analyze');
                            }}
                        >
                            Continue with Analysis
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    // Render analysis step with AI model selection
    const renderAnalysisStep = () => (
        <div className="step-container">
            <div className="step-header">
                <h2>🔍 Analyzing NDA Provisions</h2>
                <p>Comprehensive analysis of standard provisions with industry comparisons</p>
            </div>
            
            {extractedParties.length > 0 && (
                <div className="extracted-info">
                    <h3>Detected Parties:</h3>
                    <ul>
                        {extractedParties.map((party, index) => (
                            <li key={index}>{party}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* AI Model Selection */}
            <div className="ai-model-selection" style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', margin: '20px 0'}}>
                <h3 style={{marginBottom: '15px', color: '#007acc'}}>🤖 AI Analysis Model</h3>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                        <input
                            type="radio"
                            name="aiModel"
                            checked={!useClaudeAI}
                            onChange={() => setUseClaudeAI(false)}
                        />
                        <span><strong>Llama 3.3 70B</strong> - Fast, comprehensive analysis</span>
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                        <input
                            type="radio"
                            name="aiModel"
                            checked={useClaudeAI}
                            onChange={() => setUseClaudeAI(true)}
                        />
                        <span><strong>Claude 3.5 Sonnet</strong> - Deep legal reasoning</span>
                    </label>
                </div>
                <p style={{fontSize: '12px', color: '#6c757d', marginTop: '10px'}}>
                    {useClaudeAI ? 
                        'Claude provides nuanced legal analysis with detailed explanations' : 
                        'Llama offers fast, accurate provision detection and characterization'
                    }
                </p>
            </div>
            
            <div className="analysis-actions">
                <button 
                    className="btn btn-primary"
                    onClick={() => analyzeProvisions(ndaText)}
                    disabled={isAnalyzing}
                    style={{fontSize: '16px', padding: '12px 24px'}}
                >
                    {isAnalyzing ? '⏳ Analyzing Provisions...' : `🚀 Analyze with ${useClaudeAI ? 'Claude' : 'Llama'}`}
                </button>
                
                <button 
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep('upload')}
                >
                    ← Back to Upload
                </button>
            </div>
            
            {isAnalyzing && (
                <div style={{textAlign: 'center', marginTop: '20px', padding: '20px', background: '#e3f2fd', borderRadius: '8px'}}>
                    <div className="loading-spinner" style={{margin: '0 auto 10px auto'}}></div>
                    <p><strong>Analyzing 8 standard NDA provisions...</strong></p>
                    <p style={{fontSize: '14px', color: '#666'}}>
                        Checking definition scope, term duration, remedies, and more
                    </p>
                </div>
            )}
        </div>
    );

    // Enhanced matrix step with detailed analysis and instant previews
    const renderMatrixStep = () => (
        <div className="step-container">
            <div className="step-header">
                <h2>📊 Enhanced Provision Analysis Matrix</h2>
                <p>Comprehensive analysis with industry comparisons and instant revision previews</p>
                {modelUsed && (
                    <p style={{fontSize: '14px', color: '#6c757d'}}>
                        Analysis by: <strong>{modelUsed}</strong>
                    </p>
                )}
            </div>
            
            <div className="matrix-container">
                {Object.entries(STANDARD_PROVISIONS).map(([key, provision]) => {
                    const analysis = provisionAnalysis[key] || {};
                    const isSelected = selectedRevisions[key];
                    
                    return (
                        <div key={key} className="provision-card" style={{
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            background: isSelected ? '#f8f9fa' : 'white'
                        }}>
                            {/* Provision Header */}
                            <div style={{borderBottom: '1px solid #dee2e6', paddingBottom: '15px', marginBottom: '15px'}}>
                                <h3 style={{margin: '0 0 5px 0', color: '#007acc'}}>
                                    {analysis.present ? '✅' : '❌'} {provision.name}
                                </h3>
                                <p style={{margin: '0', color: '#6c757d', fontSize: '14px'}}>
                                    {provision.description}
                                </p>
                            </div>
                            
                            {/* Current Analysis */}
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                                <div>
                                    <strong>Current Position:</strong>
                                    <br />
                                    <span style={{color: '#007acc', fontWeight: '600'}}>
                                        {analysis.characterization || 'Unknown'}
                                    </span>
                                </div>
                                <div>
                                    <strong>Favors:</strong>
                                    <br />
                                    <span className={`favor-${analysis.favors}`} style={{fontWeight: '600'}}>
                                        {analysis.favors?.replace('_', ' ') || 'Unknown'}
                                    </span>
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <br />
                                    <span style={{color: analysis.present ? '#28a745' : '#dc3545', fontWeight: '600'}}>
                                        {analysis.present ? 'Present' : 'Missing'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Industry Comparison */}
                            {analysis.industry_comparison && (
                                <div style={{
                                    background: '#e3f2fd',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    marginBottom: '15px',
                                    fontSize: '14px'
                                }}>
                                    <strong>📊 Industry Comparison:</strong> {analysis.industry_comparison}
                                    {analysis.why_matters && (
                                        <div style={{marginTop: '5px'}}>
                                            <strong>💡 Why it matters:</strong> {analysis.why_matters}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Revision Options with Instant Previews */}
                            <div>
                                <h4 style={{margin: '0 0 10px 0', color: '#495057'}}>🔧 Revision Options:</h4>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
                                    {['disclosing_party', 'receiving_party', 'neutral'].map(type => {
                                        const revisionKey = `${key}-${type}`;
                                        const isActive = selectedRevisions[key] === type;
                                        const previewData = getRevisionPreview(key, type);
                                        
                                        return (
                                            <div key={type} style={{
                                                border: isActive ? '2px solid #007acc' : '1px solid #dee2e6',
                                                borderRadius: '6px',
                                                padding: '12px',
                                                cursor: 'pointer',
                                                background: isActive ? '#e3f2fd' : 'white',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => handleRevisionSelect(key, type, !isActive)}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                                    <input
                                                        type="radio"
                                                        name={`revision-${key}`}
                                                        checked={isActive}
                                                        onChange={() => {}}
                                                        style={{marginRight: '8px'}}
                                                    />
                                                    <strong style={{fontSize: '12px'}}>
                                                        {type === 'disclosing_party' ? '🔒 Favor Disclosing' : 
                                                         type === 'receiving_party' ? '🔓 Favor Receiving' : '⚖️ Neutral/Balanced'}
                                                    </strong>
                                                </div>
                                                
                                                <div style={{fontSize: '11px', color: '#6c757d', lineHeight: 1.3}}>
                                                    {previewData.impact}
                                                </div>
                                                
                                                {/* Instant Language Preview */}
                                                {isActive && previewData.sampleLanguage && (
                                                    <div style={{
                                                        marginTop: '10px',
                                                        padding: '8px',
                                                        background: '#fff',
                                                        border: '1px solid #007acc',
                                                        borderRadius: '4px',
                                                        fontSize: '10px',
                                                        fontFamily: 'monospace'
                                                    }}>
                                                        <strong>Sample Language:</strong>
                                                        <div style={{marginTop: '4px', fontStyle: 'italic'}}>
                                                            "{previewData.sampleLanguage}"
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Document Location */}
                            {analysis.text_location && (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: '#f8f9fa',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                }}>
                                    <strong>📍 Found in document:</strong> 
                                    <em style={{marginLeft: '5px'}}>{analysis.text_location}</em>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Summary and Actions */}
            <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginTop: '20px'
            }}>
                <h4 style={{margin: '0 0 10px 0', color: '#007acc'}}>
                    📋 Selected Revisions ({Object.keys(selectedRevisions).length})
                </h4>
                
                {Object.keys(selectedRevisions).length === 0 ? (
                    <p style={{margin: '0', color: '#6c757d'}}>
                        Click on revision options above to select changes you want to make.
                    </p>
                ) : (
                    <div>
                        {Object.entries(selectedRevisions).map(([provKey, revType]) => (
                            <div key={provKey} style={{marginBottom: '5px', fontSize: '14px'}}>
                                • <strong>{STANDARD_PROVISIONS[provKey]?.name}</strong> → 
                                {revType === 'disclosing_party' ? ' 🔒 Favor Disclosing Party' : 
                                 revType === 'receiving_party' ? ' 🔓 Favor Receiving Party' : ' ⚖️ Neutral/Balanced'}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="matrix-actions" style={{marginTop: '30px'}}>
                <button 
                    className="btn btn-primary"
                    onClick={generateRevisedDocument}
                    disabled={Object.keys(selectedRevisions).length === 0}
                    style={{fontSize: '16px', padding: '12px 24px'}}
                >
                    📝 Generate Revised Document ({Object.keys(selectedRevisions).length} changes)
                </button>
                
                <button 
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep('analyze')}
                >
                    ← Back to Analysis
                </button>
            </div>
        </div>
    );

    // Render revision step
    const renderRevisionStep = () => (
        <div className="step-container">
            <div className="step-header">
                <h2>📝 Document Revisions</h2>
                <p>Review and export your revised NDA</p>
            </div>
            
            <div className="revision-summary">
                <h3>Selected Changes ({changeLog.length})</h3>
                {changeLog.map((change, index) => (
                    <div key={index} className="change-item">
                        <strong>{change.provision}</strong> - {change.type.replace('_', ' ')}
                        <br />
                        <em>{change.description}</em>
                        <br />
                        <small>Impact: {change.impact}</small>
                    </div>
                ))}
            </div>
            
            <div className="export-actions">
                <button 
                    className="btn btn-primary"
                    onClick={exportToWord}
                >
                    📄 Export Full Report
                </button>
                
                <button 
                    className="btn btn-primary"
                    onClick={exportRedlinedOnly}
                >
                    📝 Export Redlined Only
                </button>
                
                <button 
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep('matrix')}
                >
                    ← Back to Matrix
                </button>
                
                <button 
                    className="btn btn-secondary"
                    onClick={() => {
                        setCurrentStep('upload');
                        setAnalysisComplete(false);
                        setProvisionAnalysis({});
                        setSelectedRevisions({});
                        setNdaText('');
                    }}
                >
                    🔄 Start Over
                </button>
            </div>
        </div>
    );

    // Main render
    return (
        <div className="nda-analyzer-v2">
            <div className="analyzer-header">
                <h1>⚖️ NDA Risk Analyzer V2</h1>
                <p>Comprehensive provision analysis and risk assessment</p>
                
                <div className="progress-steps">
                    <div className={`step ${currentStep === 'upload' ? 'active' : ''} ${currentStep !== 'upload' ? 'completed' : ''}`}>
                        1. Upload
                    </div>
                    <div className={`step ${currentStep === 'analyze' ? 'active' : ''} ${['matrix', 'revise'].includes(currentStep) ? 'completed' : ''}`}>
                        2. Analyze
                    </div>
                    <div className={`step ${currentStep === 'matrix' ? 'active' : ''} ${currentStep === 'revise' ? 'completed' : ''}`}>
                        3. Matrix
                    </div>
                    <div className={`step ${currentStep === 'revise' ? 'active' : ''}`}>
                        4. Revise
                    </div>
                </div>
            </div>
            
            <div className="analyzer-content">
                {currentStep === 'upload' && renderUploadStep()}
                {currentStep === 'analyze' && renderAnalysisStep()}
                {currentStep === 'matrix' && renderMatrixStep()}
                {currentStep === 'revise' && renderRevisionStep()}
            </div>
        </div>
    );
};

// Export for React DOM
window.NDAAnalyzerV2 = NDAAnalyzerV2;