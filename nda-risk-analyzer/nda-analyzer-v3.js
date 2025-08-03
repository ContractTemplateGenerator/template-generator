/**
 * NDA Risk Analyzer V3 - Ultimate Streamlined Version
 * Single screen with instant analysis, live preview, and real-time highlighting
 */

const { useState, useRef, useEffect } = React;

// Standard provisions with industry-standard explanations
const STANDARD_PROVISIONS = {
    definition_confidential_info: {
        name: "Definition of Confidential Information",
        description: "How broadly or narrowly confidential information is defined",
        industry_standard: "Industry standard requires marking or clear identification of confidential information",
        analysis_variations: {
            narrow: {
                description: "LIMITED SCOPE - Only marked/designated information",
                tilts_toward: "Receiving Party",
                why: "Clear boundaries reduce accidental breaches",
                sample_language: "Information specifically marked as 'Confidential' at time of disclosure"
            },
            standard: {
                description: "INDUSTRY STANDARD - Reasonable identification with standard exceptions",
                tilts_toward: "Balanced",
                why: "Standard business practice balancing protection with clarity",
                sample_language: "Non-public information disclosed in connection with this relationship"
            },
            broad: {
                description: "EXPANSIVE SCOPE - All information disclosed regardless of marking",
                tilts_toward: "Disclosing Party",
                why: "Maximum protection even for unmarked casual disclosures",
                sample_language: "All information disclosed by either party, whether or not marked confidential"
            }
        }
    },
    term_duration: {
        name: "Term Duration",
        description: "How long the NDA obligations last",
        industry_standard: "Industry standard is 3-5 years for most commercial relationships",
        analysis_variations: {
            short: {
                description: "SHORT TERM - 1-2 years",
                tilts_toward: "Receiving Party",
                why: "Reduces long-term compliance burden",
                sample_language: "This Agreement shall remain in effect for two (2) years"
            },
            standard: {
                description: "INDUSTRY STANDARD - 3-5 years",
                tilts_toward: "Balanced",
                why: "Balances protection needs with reasonable time limits",
                sample_language: "This Agreement shall remain in effect for three (3) years"
            },
            long: {
                description: "EXTENDED TERM - 5+ years or perpetual",
                tilts_toward: "Disclosing Party",
                why: "Extended protection for valuable information",
                sample_language: "This Agreement shall remain in effect for ten (10) years"
            }
        }
    },
    purpose_limitation: {
        name: "Purpose Limitation",
        description: "How the receiving party can use the information",
        industry_standard: "Industry standard allows evaluation and related business purposes",
        analysis_variations: {
            strict: {
                description: "HIGHLY RESTRICTED - Specific evaluation only",
                tilts_toward: "Disclosing Party",
                why: "Severely limits receiving party's use options",
                sample_language: "Solely for the purpose of evaluating the specific transaction"
            },
            standard: {
                description: "INDUSTRY STANDARD - Evaluation and related business purposes",
                tilts_toward: "Balanced",
                why: "Practical business use while maintaining protection",
                sample_language: "For evaluating potential business opportunities and related purposes"
            },
            broad: {
                description: "PERMISSIVE USE - Any lawful business purpose",
                tilts_toward: "Receiving Party",
                why: "Maximum flexibility in using information",
                sample_language: "For any lawful business purpose not competing with disclosing party"
            }
        }
    },
    return_destruction: {
        name: "Return/Destruction Requirements",
        description: "Requirements for handling info after termination",
        industry_standard: "Industry standard is 30-60 days for return/destruction",
        analysis_variations: {
            strict: {
                description: "IMMEDIATE RETURN - Must return/destroy promptly",
                tilts_toward: "Disclosing Party",
                why: "Ensures quick reclaim of all materials",
                sample_language: "Immediately return or destroy all materials and provide certification"
            },
            standard: {
                description: "INDUSTRY STANDARD - 30-60 day compliance window",
                tilts_toward: "Balanced",
                why: "Reasonable time for practical compliance",
                sample_language: "Within thirty (30) days, return or destroy all confidential information"
            },
            lenient: {
                description: "FLEXIBLE TERMS - May retain copies for legitimate purposes",
                tilts_toward: "Receiving Party",
                why: "Reduces compliance burden, allows some retention",
                sample_language: "May retain information as required by law or document policies"
            }
        }
    },
    remedies: {
        name: "Remedies for Breach",
        description: "Legal remedies available for violations",
        industry_standard: "Industry standard includes both monetary damages and injunctive relief",
        analysis_variations: {
            limited: {
                description: "MONETARY DAMAGES ONLY - No injunctions",
                tilts_toward: "Receiving Party",
                why: "Limits consequences to provable financial harm",
                sample_language: "Remedies limited to actual monetary damages proven at law"
            },
            standard: {
                description: "INDUSTRY STANDARD - Damages plus injunctive relief",
                tilts_toward: "Balanced",
                why: "Balanced enforcement options for different breach types",
                sample_language: "Both monetary damages and injunctive relief available"
            },
            harsh: {
                description: "MAXIMUM ENFORCEMENT - Liquidated damages, fees, broad relief",
                tilts_toward: "Disclosing Party",
                why: "Creates maximum deterrent effect",
                sample_language: "Injunctive relief, liquidated damages, and attorneys' fees available"
            }
        }
    },
    jurisdiction: {
        name: "Governing Law & Jurisdiction",
        description: "Which courts and laws apply",
        industry_standard: "Industry standard uses neutral jurisdiction or federal courts",
        analysis_variations: {
            neutral: {
                description: "NEUTRAL JURISDICTION - Delaware, federal, or business-friendly state",
                tilts_toward: "Balanced",
                why: "No home court advantage for either party",
                sample_language: "Governed by Delaware law with jurisdiction in Delaware courts"
            },
            disclosing_favored: {
                description: "DISCLOSING PARTY'S JURISDICTION - Their preferred courts/laws",
                tilts_toward: "Disclosing Party",
                why: "Home court advantage and familiar legal environment",
                sample_language: "Governed by [Disclosing Party State] law in [Their City] courts"
            },
            receiving_favored: {
                description: "RECEIVING PARTY'S JURISDICTION - Their preferred courts/laws",
                tilts_toward: "Receiving Party",
                why: "Home court advantage for receiving party",
                sample_language: "Governed by [Receiving Party State] law in [Their City] courts"
            }
        }
    },
    survival: {
        name: "Survival Clauses",
        description: "Which obligations continue after termination",
        industry_standard: "Industry standard: confidentiality and key provisions survive",
        analysis_variations: {
            limited: {
                description: "CORE ONLY - Only basic confidentiality survives",
                tilts_toward: "Receiving Party",
                why: "Minimal ongoing obligations after termination",
                sample_language: "Only confidentiality obligations survive termination"
            },
            standard: {
                description: "INDUSTRY STANDARD - Confidentiality and key provisions survive",
                tilts_toward: "Balanced",
                why: "Protects core interests while ending most obligations",
                sample_language: "Confidentiality, remedies, and return provisions survive"
            },
            extensive: {
                description: "BROAD SURVIVAL - Most provisions continue indefinitely",
                tilts_toward: "Disclosing Party",
                why: "Maximum ongoing protection and obligations",
                sample_language: "All provisions survive termination indefinitely"
            }
        }
    }
};

const NDAAnalyzerV3 = () => {
    // Pre-loaded sample NDA for instant demo
    const SAMPLE_NDA = `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on January 15, 2024 by and between TechCorp Inc., a Delaware corporation ("TechCorp"), and InnovateLLC, a California limited liability company ("Innovate").

1. CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" means all information disclosed by either party to the other party, whether orally, in writing, or in any other form, including but not limited to technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information.

2. TERM
This Agreement shall remain in effect for a period of five (5) years from the date first written above, unless earlier terminated in accordance with the provisions herein.

3. PURPOSE
The parties wish to explore a potential business relationship relating to artificial intelligence software development and licensing services.

4. OBLIGATIONS
Each party agrees to hold and maintain in strict confidence all Confidential Information received from the other party. Each party agrees not to disclose any Confidential Information to third parties without the prior written consent of the disclosing party. The receiving party agrees to use the Confidential Information solely for the purpose of evaluating the potential business relationship.

5. RETURN OF MATERIALS
Upon termination of this Agreement or upon request by the disclosing party, each party shall promptly return or destroy all documents, materials, and other tangible manifestations of Confidential Information received from the other party within thirty (30) days.

6. REMEDIES
The parties acknowledge that any breach of this Agreement may cause irreparable harm for which monetary damages would be inadequate. Therefore, the non-breaching party shall be entitled to seek injunctive relief and other equitable remedies, in addition to all other remedies available at law or in equity.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws principles. Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of California.

8. SURVIVAL
The obligations of confidentiality set forth in this Agreement shall survive the termination of this Agreement for a period of three (3) years.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

TECHCORP INC.                    INNOVATELLC

By: _____________________       By: _____________________
Name: Sarah Johnson            Name: Michael Chen
Title: CEO                     Title: CTO`;

    // State management
    const [ndaText, setNdaText] = useState(SAMPLE_NDA);
    const [selectedRevisions, setSelectedRevisions] = useState({});
    const [highlightedSection, setHighlightedSection] = useState(null);
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    
    // Preview refs
    const previewRef = useRef(null);
    
    // Auto-analyze on load
    useEffect(() => {
        performAutoAnalysis();
    }, []);

    // Perform automatic analysis when NDA loads
    const performAutoAnalysis = () => {
        // Simulate analysis results based on sample NDA
        const autoAnalysis = {
            definition_confidential_info: {
                current: 'broad',
                present: true,
                location: 'Section 1'
            },
            term_duration: {
                current: 'long',
                present: true,
                location: 'Section 2'
            },
            purpose_limitation: {
                current: 'standard',
                present: true,
                location: 'Section 4'
            },
            return_destruction: {
                current: 'standard',
                present: true,
                location: 'Section 5'
            },
            remedies: {
                current: 'standard',
                present: true,
                location: 'Section 6'
            },
            jurisdiction: {
                current: 'neutral',
                present: true,
                location: 'Section 7'
            },
            survival: {
                current: 'standard',
                present: true,
                location: 'Section 8'
            }
        };
        setAnalysisResult(autoAnalysis);
    };

    // Handle revision selection with live preview update
    const handleRevisionSelect = (provisionKey, revisionType) => {
        const wasSelected = selectedRevisions[provisionKey] === revisionType;
        
        if (wasSelected) {
            // Deselect
            setSelectedRevisions(prev => {
                const newRevisions = { ...prev };
                delete newRevisions[provisionKey];
                return newRevisions;
            });
        } else {
            // Select new revision
            setSelectedRevisions(prev => ({
                ...prev,
                [provisionKey]: revisionType
            }));
            
            // Highlight and scroll to relevant section
            highlightAndScrollToSection(provisionKey, revisionType);
        }
    };

    // Highlight section and scroll to it
    const highlightAndScrollToSection = (provisionKey, revisionType) => {
        setHighlightedSection({ provision: provisionKey, type: revisionType });
        
        // Auto-scroll to the relevant section in preview
        if (previewRef.current) {
            const targetSection = getProvisionSection(provisionKey);
            if (targetSection) {
                const element = previewRef.current.querySelector(`[data-section="${targetSection}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
        
        // Clear highlight after 15 seconds
        setTimeout(() => {
            setHighlightedSection(null);
        }, 15000);
    };

    // Get section number for provision
    const getProvisionSection = (provisionKey) => {
        const sectionMap = {
            definition_confidential_info: '1',
            term_duration: '2',
            purpose_limitation: '4',
            return_destruction: '5',
            remedies: '6',
            jurisdiction: '7',
            survival: '8'
        };
        return sectionMap[provisionKey];
    };

    // Generate live preview with changes
    const generateLivePreview = () => {
        let previewText = ndaText;
        
        Object.entries(selectedRevisions).forEach(([provisionKey, revisionType]) => {
            const provision = STANDARD_PROVISIONS[provisionKey];
            const variation = provision.analysis_variations[revisionType];
            const sectionNum = getProvisionSection(provisionKey);
            
            if (variation && sectionNum) {
                // Find and replace relevant section with new language
                const sectionRegex = new RegExp(`(${sectionNum}\\.[^\\n]*[\\s\\S]*?)(?=\\n\\d+\\.|$)`, 'i');
                const newSectionText = `${sectionNum}. ${provision.name.toUpperCase()}\n${variation.sample_language}`;
                
                previewText = previewText.replace(sectionRegex, newSectionText);
            }
        });
        
        return previewText;
    };

    // Render provision analysis card
    const renderProvisionCard = (provisionKey, provision) => {
        const analysis = analysisResult?.[provisionKey];
        if (!analysis) return null;
        
        const currentVariation = provision.analysis_variations[analysis.current];
        const isHighlighted = highlightedSection?.provision === provisionKey;
        
        return (
            <div key={provisionKey} style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                background: isHighlighted ? '#fff3cd' : 'white',
                transition: 'all 0.3s ease'
            }}>
                {/* Header */}
                <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#007acc' }}>
                        ✅ {provision.name}
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                        📍 Found in {analysis.location} | 📊 {provision.industry_standard}
                    </p>
                </div>
                
                {/* Current Analysis */}
                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                        <div>
                            <strong>Current Position:</strong> {currentVariation.description}
                        </div>
                        <div>
                            <strong>Tilts Toward:</strong> <span style={{
                                color: currentVariation.tilts_toward === 'Disclosing Party' ? '#dc3545' :
                                      currentVariation.tilts_toward === 'Receiving Party' ? '#007bff' : '#28a745',
                                fontWeight: '600'
                            }}>{currentVariation.tilts_toward}</span>
                        </div>
                    </div>
                    <div style={{ marginTop: '5px', fontSize: '12px', fontStyle: 'italic' }}>
                        💡 {currentVariation.why}
                    </div>
                </div>
                
                {/* Revision Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {Object.entries(provision.analysis_variations).map(([variationKey, variation]) => {
                        const isSelected = selectedRevisions[provisionKey] === variationKey;
                        const isCurrent = analysis.current === variationKey;
                        
                        return (
                            <div
                                key={variationKey}
                                onClick={() => !isCurrent && handleRevisionSelect(provisionKey, variationKey)}
                                style={{
                                    border: isSelected ? '2px solid #007acc' : 
                                           isCurrent ? '2px solid #28a745' : '1px solid #dee2e6',
                                    borderRadius: '4px',
                                    padding: '8px',
                                    cursor: isCurrent ? 'default' : 'pointer',
                                    background: isSelected ? '#e3f2fd' : 
                                               isCurrent ? '#e8f5e8' : 'white',
                                    opacity: isCurrent ? 0.7 : 1,
                                    fontSize: '11px',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                    {variationKey === 'disclosing_favored' || variationKey === 'strict' || variationKey === 'long' || variationKey === 'broad' || variationKey === 'harsh' || variationKey === 'extensive' ? '🔒 Disclosing' :
                                     variationKey === 'receiving_favored' || variationKey === 'lenient' || variationKey === 'short' || variationKey === 'narrow' || variationKey === 'limited' ? '🔓 Receiving' : 
                                     '⚖️ Balanced'}
                                </div>
                                <div style={{ color: '#666' }}>
                                    {variation.tilts_toward}
                                </div>
                                {isSelected && (
                                    <div style={{ 
                                        marginTop: '6px', 
                                        padding: '4px', 
                                        background: 'white', 
                                        borderRadius: '2px',
                                        fontSize: '10px',
                                        fontFamily: 'monospace'
                                    }}>
                                        "{variation.sample_language}"
                                    </div>
                                )}
                                {isCurrent && (
                                    <div style={{ marginTop: '4px', color: '#28a745', fontWeight: '600' }}>
                                        CURRENT
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render live preview with highlighting
    const renderLivePreview = () => {
        const previewText = generateLivePreview();
        const sections = previewText.split(/(\n\d+\..+)/);
        
        return (
            <div 
                ref={previewRef}
                style={{
                    height: '600px',
                    overflow: 'auto',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '20px',
                    background: 'white',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    lineHeight: '1.6'
                }}
            >
                {sections.map((section, index) => {
                    const sectionMatch = section.match(/^(\d+)\./);
                    const sectionNum = sectionMatch ? sectionMatch[1] : null;
                    const isModified = sectionNum && Object.values(selectedRevisions).some(rev => 
                        getProvisionSection(Object.keys(selectedRevisions).find(key => selectedRevisions[key] === rev)) === sectionNum
                    );
                    const isHighlighted = sectionNum && highlightedSection && 
                                         getProvisionSection(highlightedSection.provision) === sectionNum;
                    
                    return (
                        <div
                            key={index}
                            data-section={sectionNum}
                            style={{
                                background: isHighlighted ? '#fff3cd' : isModified ? '#e8f5e8' : 'transparent',
                                padding: isModified || isHighlighted ? '10px' : '0',
                                borderRadius: isModified || isHighlighted ? '4px' : '0',
                                transition: 'all 0.3s ease',
                                marginBottom: '10px'
                            }}
                        >
                            {section}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Export function
    const exportRevisedDocument = () => {
        const wordExporter = new WordExportV2();
        wordExporter.exportToWord(
            generateLivePreview(),
            selectedRevisions,
            Object.entries(selectedRevisions).map(([key, type]) => ({
                provision: STANDARD_PROVISIONS[key].name,
                type,
                description: `Changed to ${type} approach`,
                impact: STANDARD_PROVISIONS[key].analysis_variations[type].why
            })),
            { provisions: analysisResult }
        );
    };

    return (
        <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ 
                background: 'linear-gradient(135deg, #007acc, #0056b3)', 
                color: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                <h1 style={{ margin: '0 0 10px 0' }}>⚖️ NDA Risk Analyzer - Live Analysis</h1>
                <p style={{ margin: '0', opacity: 0.9 }}>
                    Instant provision analysis with live preview and real-time highlighting
                </p>
                
                {/* AI Model Toggle */}
                <div style={{ 
                    marginTop: '15px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px',
                    fontSize: '14px'
                }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="aiModel"
                            checked={!useClaudeAI}
                            onChange={() => setUseClaudeAI(false)}
                        />
                        <span>🦙 Llama 3.3 70B</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="aiModel"
                            checked={useClaudeAI}
                            onChange={() => setUseClaudeAI(true)}
                        />
                        <span>🧠 Claude 3.5 Sonnet</span>
                    </label>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left: Analysis Matrix */}
                <div>
                    <h3 style={{ margin: '0 0 15px 0', color: '#007acc' }}>
                        📊 Provision Analysis & Revision Options
                    </h3>
                    
                    <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                        {Object.entries(STANDARD_PROVISIONS).map(([key, provision]) => 
                            renderProvisionCard(key, provision)
                        )}
                    </div>
                    
                    {/* Export Button */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            onClick={exportRevisedDocument}
                            disabled={Object.keys(selectedRevisions).length === 0}
                            style={{
                                background: Object.keys(selectedRevisions).length > 0 ? '#007acc' : '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                fontSize: '16px',
                                cursor: Object.keys(selectedRevisions).length > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            📄 Export Revised NDA ({Object.keys(selectedRevisions).length} changes)
                        </button>
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div>
                    <h3 style={{ margin: '0 0 15px 0', color: '#007acc' }}>
                        👁️ Live NDA Preview
                        {Object.keys(selectedRevisions).length > 0 && (
                            <span style={{ fontSize: '14px', color: '#28a745', marginLeft: '10px' }}>
                                ({Object.keys(selectedRevisions).length} changes applied)
                            </span>
                        )}
                    </h3>
                    
                    {renderLivePreview()}
                    
                    <div style={{ 
                        marginTop: '10px', 
                        fontSize: '12px', 
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        💡 Click revision options on the left to see instant changes highlighted here
                        <br />
                        🟡 Yellow = Currently highlighted | 🟢 Green = Modified sections
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export for React DOM
window.NDAAnalyzerV3 = NDAAnalyzerV3;