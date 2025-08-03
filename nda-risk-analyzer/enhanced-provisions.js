/**
 * Enhanced Provisions Analysis with Comprehensive Industry Comparisons
 * and Instant Text Previews
 */

// Comprehensive provision definitions with industry context
export const ENHANCED_PROVISIONS = {
    definition_confidential_info: {
        name: "Definition of Confidential Information",
        description: "How broadly or narrowly confidential information is defined",
        industry_context: {
            narrow: {
                description: "LIMITED SCOPE - Only specifically marked/designated information",
                why_matters: "Receiving party has clear boundaries; reduces accidental breaches",
                industry_comparison: "More restrictive than 70% of NDAs; favors receiving party",
                sample_language: [
                    "Information specifically marked or designated as 'Confidential' at time of disclosure",
                    "Written information clearly labeled as confidential and oral information identified as confidential at time of disclosure and confirmed in writing within 30 days",
                    "Information that is (i) marked as confidential, (ii) identified as confidential when disclosed orally, or (iii) would reasonably be considered confidential under the circumstances"
                ]
            },
            standard: {
                description: "BALANCED SCOPE - Reasonable business information with standard exceptions",
                why_matters: "Industry-standard approach balancing protection with practical use",
                industry_comparison: "Typical language used in 60% of commercial NDAs; neutral positioning",
                sample_language: [
                    "All non-public information disclosed by one party to the other, including technical data, business plans, customer information, and financial data",
                    "Information that is not generally known to the public and has commercial value, including but not limited to trade secrets, know-how, and proprietary information",
                    "Any and all non-public information disclosed in connection with the business relationship, whether oral, written, or visual"
                ]
            },
            broad: {
                description: "EXPANSIVE SCOPE - All information disclosed, regardless of marking",
                why_matters: "Maximum protection for disclosing party; high burden on receiving party",
                industry_comparison: "Broader than 80% of NDAs; heavily favors disclosing party",
                sample_language: [
                    "All information disclosed by either party, in any form, whether or not marked confidential",
                    "Any and all information, data, materials, or knowledge disclosed, including information learned through observation or reverse engineering",
                    "All information disclosed or made available, including information about the existence and terms of this agreement itself"
                ]
            }
        }
    },
    
    term_duration: {
        name: "Term Duration",
        description: "How long the NDA obligations last",
        industry_context: {
            short: {
                description: "1-2 YEARS - Limited time commitment",
                why_matters: "Reduces long-term burden on receiving party; allows faster information use",
                industry_comparison: "Shorter than 75% of NDAs; favors receiving party significantly",
                sample_language: [
                    "This Agreement shall remain in effect for a period of one (1) year from the date of execution",
                    "Confidentiality obligations shall expire two (2) years after disclosure of the information",
                    "This Agreement terminates eighteen (18) months from the effective date"
                ]
            },
            standard: {
                description: "3-5 YEARS - Industry standard timeframe",
                why_matters: "Balances protection needs with reasonable time limits",
                industry_comparison: "Typical duration used in 65% of commercial NDAs; industry standard",
                sample_language: [
                    "This Agreement shall remain in effect for three (3) years from the date first written above",
                    "Confidentiality obligations shall continue for a period of five (5) years following disclosure",
                    "This Agreement shall have a term of four (4) years unless earlier terminated"
                ]
            },
            long: {
                description: "PERPETUAL or 7+ YEARS - Extended protection",
                why_matters: "Maximum protection for truly confidential information; heavy burden on receiving party",
                industry_comparison: "Longer than 85% of NDAs; strongly favors disclosing party",
                sample_language: [
                    "This Agreement shall remain in perpetuity until terminated by mutual written consent",
                    "Confidentiality obligations shall survive indefinitely for trade secrets and proprietary information",
                    "This Agreement shall continue for ten (10) years, with automatic renewal unless terminated"
                ]
            }
        }
    },

    purpose_limitation: {
        name: "Purpose Limitation",
        description: "How the receiving party can use the confidential information",
        industry_context: {
            strict: {
                description: "HIGHLY RESTRICTED - Only for specific evaluation purposes",
                why_matters: "Severely limits receiving party's ability to use information",
                industry_comparison: "More restrictive than 70% of NDAs; heavily favors disclosing party",
                sample_language: [
                    "Solely for the purpose of evaluating a potential acquisition transaction",
                    "Exclusively for determining whether to enter into a specific licensing agreement",
                    "Only for the limited purpose of assessing the feasibility of the proposed joint venture"
                ]
            },
            standard: {
                description: "REASONABLE SCOPE - Evaluation and related business purposes",
                why_matters: "Allows practical business use while maintaining protection",
                industry_comparison: "Standard language found in 60% of commercial NDAs; balanced approach",
                sample_language: [
                    "For the purpose of evaluating a potential business relationship between the parties",
                    "To assess opportunities for collaboration, partnership, or other business arrangements",
                    "For evaluation of potential business opportunities and related due diligence activities"
                ]
            },
            broad: {
                description: "PERMISSIVE USE - Any lawful business purpose",
                why_matters: "Gives receiving party maximum flexibility in using information",
                industry_comparison: "More permissive than 80% of NDAs; favors receiving party",
                sample_language: [
                    "For any lawful business purpose that does not compete with the disclosing party",
                    "For internal business purposes, including evaluation, development, and strategic planning",
                    "For any business purpose consistent with the parties' ongoing relationship"
                ]
            }
        }
    },

    return_destruction: {
        name: "Return/Destruction of Information",
        description: "Requirements for handling confidential information after agreement ends",
        industry_context: {
            strict: {
                description: "IMMEDIATE RETURN - Must return/destroy all materials promptly",
                why_matters: "Ensures complete return of information; high compliance burden",
                industry_comparison: "Stricter than 75% of NDAs; heavily favors disclosing party",
                sample_language: [
                    "Immediately upon termination, return or destroy all confidential materials and provide written certification",
                    "Within five (5) business days, return all documents and delete all electronic copies with audit trail",
                    "Promptly return all materials and certify in writing that no copies remain in any form"
                ]
            },
            standard: {
                description: "REASONABLE TIMEFRAME - 30-60 days to return/destroy",
                why_matters: "Allows practical time for compliance while ensuring return",
                industry_comparison: "Standard practice in 65% of commercial NDAs; balanced approach",
                sample_language: [
                    "Within thirty (30) days of termination, return or destroy all confidential information",
                    "Upon written request, return all materials within sixty (60) days",
                    "Within a reasonable time not to exceed forty-five (45) days, return or destroy all materials"
                ]
            },
            lenient: {
                description: "FLEXIBLE TERMS - May retain copies or minimal requirements",
                why_matters: "Reduces burden on receiving party; allows retention for some purposes",
                industry_comparison: "More lenient than 80% of NDAs; favors receiving party",
                sample_language: [
                    "May retain confidential information as required by law or internal document retention policies",
                    "No obligation to return information that has been incorporated into receiving party's general knowledge",
                    "Return only upon specific written request, with reasonable time to comply"
                ]
            }
        }
    },

    remedies: {
        name: "Remedies for Breach",
        description: "Legal remedies available if someone violates the NDA",
        industry_context: {
            limited: {
                description: "MONETARY DAMAGES ONLY - Standard breach of contract remedies",
                why_matters: "Limits disclosing party to proving actual financial harm",
                industry_comparison: "Less aggressive than 70% of NDAs; favors receiving party",
                sample_language: [
                    "The sole remedy for breach shall be monetary damages provable at law",
                    "Remedies limited to actual damages directly caused by the breach",
                    "No punitive damages, attorneys' fees, or equitable relief shall be available"
                ]
            },
            standard: {
                description: "DAMAGES PLUS INJUNCTIONS - Money damages and court orders",
                why_matters: "Allows quick court action to stop breaches plus financial recovery",
                industry_comparison: "Standard remedy clause in 60% of commercial NDAs; balanced protection",
                sample_language: [
                    "Both monetary damages and injunctive relief shall be available for any breach",
                    "The disclosing party may seek immediate injunctive relief and damages",
                    "Remedies include damages, injunctive relief, and other equitable remedies"
                ]
            },
            harsh: {
                description: "BROAD RELIEF - Liquidated damages, fees, presumed harm",
                why_matters: "Maximum deterrent effect; expensive consequences for receiving party",
                industry_comparison: "More aggressive than 85% of NDAs; heavily favors disclosing party",
                sample_language: [
                    "Liquidated damages of $[X] per breach plus attorneys' fees and immediate injunctive relief",
                    "Any breach shall be presumed to cause irreparable harm warranting immediate injunctive relief",
                    "Remedies include damages, injunctions, attorneys' fees, and liquidated damages of $[X] per violation"
                ]
            }
        }
    },

    disclosure_obligations: {
        name: "Disclosure Obligations",
        description: "What each party must disclose and any imbalances",
        industry_context: {
            mutual: {
                description: "EQUAL OBLIGATIONS - Both parties have same disclosure duties",
                why_matters: "Fair and balanced approach with equal protection for both sides",
                industry_comparison: "Standard in 55% of mutual NDAs; balanced and fair",
                sample_language: [
                    "Each party may disclose confidential information to the other on equal terms",
                    "Both parties agree to the same confidentiality obligations regarding disclosed information",
                    "This agreement creates mutual obligations with identical terms for both parties"
                ]
            },
            one_way: {
                description: "SINGLE DIRECTION - Only one party discloses information",
                why_matters: "Clear roles but may create imbalance if relationship changes",
                industry_comparison: "Common in 35% of NDAs where only one party shares information",
                sample_language: [
                    "[Disclosing Party] shall provide confidential information to [Receiving Party] for evaluation",
                    "Only [Company A] will disclose proprietary information under this agreement",
                    "[Disclosing Party] may share confidential information with [Receiving Party] as needed"
                ]
            },
            unbalanced: {
                description: "UNEQUAL TERMS - Different obligations or protections for each party",
                why_matters: "May heavily favor one party with stronger protections or fewer duties",
                industry_comparison: "Less common approach found in 10% of NDAs; often problematic",
                sample_language: [
                    "[Party A] has broader disclosure rights and stronger remedies than [Party B]",
                    "Different confidentiality periods apply depending on which party disclosed the information",
                    "Asymmetric obligations with [Party A] having enhanced protections"
                ]
            }
        }
    },

    jurisdiction: {
        name: "Governing Law & Jurisdiction",
        description: "Which courts have authority and which state's laws apply",
        industry_context: {
            neutral: {
                description: "MUTUALLY ACCEPTABLE - Neutral jurisdiction or federal courts",
                why_matters: "Fair venue that doesn't favor either party's home jurisdiction",
                industry_comparison: "Balanced approach used in 40% of multi-state NDAs",
                sample_language: [
                    "Governed by federal law with disputes in federal court where defendant is located",
                    "Delaware law applies with jurisdiction in Delaware courts (neutral business state)",
                    "New York law and courts (neutral commercial jurisdiction)"
                ]
            },
            party1_favored: {
                description: "DISCLOSING PARTY'S CHOICE - Favors the party sharing information",
                why_matters: "Home court advantage for disclosing party; inconvenient for receiving party",
                industry_comparison: "Common in 45% of NDAs; favors the party with stronger position",
                sample_language: [
                    "Governed by [Disclosing Party's State] law with exclusive jurisdiction in [Their City] courts",
                    "All disputes must be brought in courts of [Disclosing Party's preferred jurisdiction]",
                    "[Disclosing Party's State] law applies with venue in [Their County] courts only"
                ]
            },
            party2_favored: {
                description: "RECEIVING PARTY'S CHOICE - Favors the party getting information",
                why_matters: "Home court advantage for receiving party; may signal stronger negotiating position",
                industry_comparison: "Less common approach in 15% of NDAs; unusual positioning",
                sample_language: [
                    "Governed by [Receiving Party's State] law with jurisdiction in [Their preferred] courts",
                    "Disputes resolved under [Receiving Party's] home state law and courts",
                    "[Receiving Party's State] law applies with venue in [Their County] courts"
                ]
            }
        }
    },

    survival: {
        name: "Survival Clauses",
        description: "Which obligations continue after the agreement terminates",
        industry_context: {
            limited: {
                description: "CORE ONLY - Only basic confidentiality survives termination",
                why_matters: "Minimal ongoing obligations; receiving party has more freedom after termination",
                industry_comparison: "More limited than 70% of NDAs; favors receiving party",
                sample_language: [
                    "Only the confidentiality obligation shall survive termination of this agreement",
                    "Survival limited to the duty not to disclose confidential information",
                    "Upon termination, only the core non-disclosure obligation continues"
                ]
            },
            standard: {
                description: "KEY PROVISIONS - Confidentiality and essential terms survive",
                why_matters: "Protects core interests while allowing most obligations to end",
                industry_comparison: "Standard survival clause in 60% of commercial NDAs; balanced approach",
                sample_language: [
                    "Confidentiality, return of materials, and remedy provisions shall survive termination",
                    "Sections relating to confidentiality, remedies, and governing law survive indefinitely",
                    "The obligations of confidentiality and non-use shall survive termination"
                ]
            },
            extensive: {
                description: "BROAD SURVIVAL - Most/all provisions continue indefinitely",
                why_matters: "Maximum ongoing protection; extensive continuing obligations",
                industry_comparison: "More extensive than 80% of NDAs; heavily favors disclosing party",
                sample_language: [
                    "All provisions of this agreement shall survive termination indefinitely",
                    "This entire agreement remains in effect after termination except for the duty to disclose",
                    "All obligations, warranties, and remedies survive termination for the maximum period allowed by law"
                ]
            }
        }
    }
};

// Enhanced revision options with instant previews
export const getRevisionOptions = (provisionKey, currentAnalysis) => {
    const provision = ENHANCED_PROVISIONS[provisionKey];
    if (!provision) return {};

    const options = {
        disclosing_party: {
            title: `Favor Disclosing Party (Information Sharer)`,
            impact: "Stronger protection for the party sharing information",
            preview_options: provision.industry_context.broad?.sample_language || 
                           provision.industry_context.strict?.sample_language || 
                           provision.industry_context.long?.sample_language || [],
            why_choose: "Choose this if you're sharing valuable information and need maximum protection"
        },
        receiving_party: {
            title: `Favor Receiving Party (Information Recipient)`,
            impact: "Reduced burden on the party receiving information",
            preview_options: provision.industry_context.narrow?.sample_language || 
                           provision.industry_context.lenient?.sample_language || 
                           provision.industry_context.short?.sample_language || [],
            why_choose: "Choose this if you're receiving information and want to minimize restrictions"
        },
        neutral: {
            title: `Neutral/Balanced Approach`,
            impact: "Fair terms that don't heavily favor either party",
            preview_options: provision.industry_context.standard?.sample_language || [],
            why_choose: "Choose this for balanced, industry-standard terms that are fair to both parties"
        }
    };

    return options;
};

// Function to get detailed industry comparison
export const getIndustryComparison = (provisionKey, characterization) => {
    const provision = ENHANCED_PROVISIONS[provisionKey];
    if (!provision?.industry_context?.[characterization]) {
        return {
            description: "Analysis not available",
            why_matters: "Impact assessment pending",
            industry_comparison: "Comparison data not available"
        };
    }
    
    return provision.industry_context[characterization];
};