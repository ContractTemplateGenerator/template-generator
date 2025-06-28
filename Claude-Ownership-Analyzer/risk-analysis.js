// Risk Analysis Logic for Claude Ownership Rights Analyzer

window.RiskAnalyzer = {
    // Terms reference mapping
    termsReferences: {
        free: {
            ownership: "Section 4.2 (Rights and Responsibilities) - Consumer Terms",
            aiTraining: "Section 3.2 (Use Restrictions) - Consumer Terms",
            commercialUse: "Section 3 (Use of our Services) - Consumer Terms",
            disclosure: "Usage Policy - Universal Usage Standards",
            indemnification: "Not available for free users",
            usageLimits: "Free tier usage limits apply"
        },
        consumer: {
            ownership: "Section 4.2 (Rights and Responsibilities) - Consumer Terms",
            aiTraining: "Section 3.2 (Use Restrictions) - Consumer Terms",
            commercialUse: "Section 3 (Use of our Services) - Consumer Terms",
            disclosure: "Usage Policy - Universal Usage Standards",
            indemnification: "Not available for consumer users"
        },
        max5x: {
            ownership: "Section 4.2 (Rights and Responsibilities) - Consumer Terms (Enhanced)",
            aiTraining: "Section 3.2 (Use Restrictions) - Consumer Terms",
            commercialUse: "Section 3 (Use of our Services) - Consumer Terms",
            disclosure: "Usage Policy - Universal Usage Standards",
            indemnification: "Limited indemnification for Max users",
            mcpPolicy: "MCP integrations subject to third-party terms"
        },
        max20x: {
            ownership: "Section 4.2 (Rights and Responsibilities) - Consumer Terms (Enhanced)",
            aiTraining: "Section 3.2 (Use Restrictions) - Consumer Terms",
            commercialUse: "Section 3 (Use of our Services) - Consumer Terms",
            disclosure: "Usage Policy - Universal Usage Standards",
            indemnification: "Limited indemnification for Max users",
            mcpPolicy: "MCP integrations subject to third-party terms",
            researchPolicy: "Research feature subject to additional terms"
        },
        commercial: {
            ownership: "Section B (Customer Content) - Commercial Terms",
            aiTraining: "Section D.4 (Use Restrictions) - Commercial Terms",
            commercialUse: "Section A (Services) - Commercial Terms",
            disclosure: "Section D.3 (Limitations of Outputs) - Commercial Terms",
            indemnification: "Section K (Indemnification) - Commercial Terms"
        },
        usagePolicy: {
            highRisk: "High-Risk Use Case Requirements - Usage Policy",
            prohibited: "Universal Usage Standards - Usage Policy",
            disclosure: "Disclosure Requirements - Usage Policy"
        }
    },

    // Calculate overall risk score
    calculateRiskScore: function(formData) {
        let score = 0;
        let factors = [];

        // Account type factor
        if (formData.accountType === 'free') {
            score += 30;
            factors.push("Free account has most limited protections and usage restrictions");
        } else if (formData.accountType === 'consumer') {
            score += 20;
            factors.push("Consumer account provides fewer protections than commercial");
        } else if (formData.accountType === 'max5x') {
            score += 15;
            factors.push("Max 5x provides enhanced features but still limited compared to commercial");
        } else if (formData.accountType === 'max20x') {
            score += 10;
            factors.push("Max 20x provides premium features but still consumer-level protections");
        }
        
        // New Claude features risk assessment
        if (formData.mcpIntegrations) {
            score += 15;
            factors.push("MCP integrations introduce third-party service dependencies and risks");
        }
        
        if (formData.researchFeature) {
            score += 20;
            factors.push("Research feature with web access increases data exposure and compliance complexity");
        }

        // Use case risk assessment
        const highRiskCases = [
            'legal', 'healthcare', 'insurance', 'finance', 
            'employment', 'academic', 'journalism'
        ];

        if (highRiskCases.includes(formData.useCase)) {
            score += 30;
            factors.push("High-risk use case requires additional safeguards");
        }

        // Content generation for external use
        if (formData.contentUse === 'external' || formData.contentUse === 'commercial') {
            score += 25;
            factors.push("External/commercial use increases compliance requirements");
        }

        // Human oversight
        if (formData.humanOversight === 'none') {
            score += 35;
            factors.push("Lack of human oversight significantly increases risk");
        } else if (formData.humanOversight === 'minimal') {
            score += 20;
            factors.push("Minimal human oversight poses moderate risk");
        }

        // Prohibited content risks
        const prohibitedActivities = formData.prohibitedContent || [];
        score += prohibitedActivities.length * 15;
        if (prohibitedActivities.length > 0) {
            factors.push(`Selected ${prohibitedActivities.length} potentially prohibited activities`);
        }

        // AI/ML development
        if (formData.aiDevelopment && formData.aiDevelopment.length > 0) {
            score += 40;
            factors.push("AI/ML development activities are heavily restricted");
        }

        // Disclosure compliance
        if (formData.requiresDisclosure && !formData.disclosurePlanned) {
            score += 25;
            factors.push("Missing required AI disclosure");
        }

        return {
            score: Math.min(100, score),
            factors: factors,
            level: this.getRiskLevel(Math.min(100, score))
        };
    },

    // Get risk level based on score
    getRiskLevel: function(score) {
        if (score <= 30) return 'low';
        if (score <= 60) return 'medium';
        return 'high';
    },

    // Analyze ownership rights
    analyzeOwnership: function(formData) {
        const isCommercial = formData.accountType === 'commercial';
        const isFree = formData.accountType === 'free';
        const isMax5x = formData.accountType === 'max5x';
        const isMax20x = formData.accountType === 'max20x';
        
        let analysis = {
            status: 'allowed',
            title: isCommercial ? 'Full Ownership Rights' : 
                   isFree ? 'Basic Ownership Rights (Free)' :
                   isMax5x ? 'Enhanced Ownership Rights (Max 5x)' :
                   isMax20x ? 'Premium Ownership Rights (Max 20x)' :
                   'Conditional Ownership Rights',
            description: '',
            details: [],
            termsRef: ''
        };

        if (isCommercial) {
            analysis.description = 'You own all outputs generated by Claude, with strong legal protections including indemnification against copyright claims.';
            analysis.details = [
                'Anthropic disclaims any rights to your content',
                'Full ownership of both inputs and outputs',
                'Copyright indemnification coverage included',
                'Permitted for external commercial use'
            ];
            analysis.termsRef = this.termsReferences.commercial.ownership;
        } else if (isFree) {
            analysis.description = 'You own outputs subject to Terms of Service compliance and free tier usage limits. Rights are conditional and limited.';
            analysis.details = [
                'Assignment of rights "if any" exist in outputs',
                'Ownership conditional on ToS compliance',
                'No indemnification protection',
                'Subject to free tier usage limitations',
                'Primarily for personal/non-commercial use'
            ];
            analysis.termsRef = this.termsReferences.free.ownership;
            
            if (formData.contentUse === 'commercial') {
                analysis.status = 'restricted';
                analysis.title = 'Commercial Use Not Recommended (Free)';
                analysis.details.push('Consider upgrading for commercial use rights');
            }
        } else if (isMax5x || isMax20x) {
            const planName = isMax5x ? 'Max 5x' : 'Max 20x';
            analysis.description = `You own outputs with enhanced ${planName} features, subject to Terms of Service compliance. Better than basic consumer but limited commercial protections.`;
            analysis.details = [
                'Assignment of rights "if any" exist in outputs',
                'Ownership conditional on ToS compliance',
                'Limited indemnification protection for Max users',
                `Enhanced ${planName} usage allowances`,
                'Suitable for professional and light commercial use'
            ];
            
            if (isMax20x) {
                analysis.details.push('Premium tier with highest consumer-level protections');
            }
            
            analysis.termsRef = isMax5x ? this.termsReferences.max5x.ownership : this.termsReferences.max20x.ownership;
            
            if (formData.contentUse === 'commercial' && (formData.commercialUseType === 'resale-platform' || formData.commercialUseType === 'product-development')) {
                analysis.status = 'restricted';
                analysis.title = `Heavy Commercial Use May Need Upgrade (${planName})`;
                analysis.details.push('Consider Commercial account for extensive business use');
            }
        } else {
            analysis.description = 'You own outputs subject to compliance with Terms of Service. Rights are conditional on following usage restrictions.';
            analysis.details = [
                'Assignment of rights "if any" exist in outputs',
                'Ownership conditional on ToS compliance',
                'Limited indemnification protection',
                'Primarily for personal/internal use'
            ];
            analysis.termsRef = this.termsReferences.consumer.ownership;
            
            if (formData.contentUse === 'commercial') {
                analysis.status = 'restricted';
                analysis.title = 'Limited Commercial Rights';
                analysis.details.push('Commercial use may require additional licensing');
            }
        }

        return analysis;
    },

    // Analyze usage restrictions
    analyzeUsage: function(formData) {
        let analysis = {
            status: 'allowed',
            title: 'Permitted Use',
            description: '',
            details: [],
            termsRef: '',
            violations: []
        };

        const isCommercial = formData.accountType === 'commercial';
        const prohibitedContent = formData.prohibitedContent || [];
        const aiDevelopment = formData.aiDevelopment || [];

        // Check for prohibited content
        if (prohibitedContent.length > 0) {
            analysis.status = 'restricted';
            analysis.title = 'Usage Violations Detected';
            analysis.violations = prohibitedContent.map(item => 
                this.getProhibitedContentDescription(item)
            );
        }

        // Check AI development restrictions
        if (aiDevelopment.length > 0) {
            analysis.status = 'restricted';
            analysis.title = 'AI Development Restrictions Apply';
            analysis.violations.push(...aiDevelopment.map(item => 
                this.getAiDevelopmentDescription(item)
            ));
        }

        // High-risk use case analysis
        const highRiskCases = ['legal', 'healthcare', 'insurance', 'finance', 'employment', 'academic', 'journalism'];
        if (highRiskCases.includes(formData.useCase)) {
            if (analysis.status === 'allowed') analysis.status = 'requires-review';
            analysis.title = 'High-Risk Use Case Requirements';
            analysis.details.push('Human-in-the-loop oversight required');
            analysis.details.push('AI disclosure to end users mandatory');
            analysis.termsRef = this.termsReferences.usagePolicy.highRisk;
        }

        // Set default description if none set
        if (!analysis.description) {
            if (analysis.status === 'allowed') {
                analysis.description = 'Your use case appears to comply with Claude\'s Terms of Service and Usage Policy.';
            } else if (analysis.status === 'requires-review') {
                analysis.description = 'Your use case requires additional safeguards and human oversight to comply with Terms.';
            } else {
                analysis.description = 'Your use case involves restricted or prohibited activities under Claude\'s Terms.';
            }
        }

        analysis.termsRef = analysis.termsRef || this.termsReferences.usagePolicy.prohibited;

        return analysis;
    },

    // Analyze disclosure requirements
    analyzeDisclosure: function(formData) {
        let analysis = {
            status: 'allowed',
            title: 'No Disclosure Required',
            description: 'Your use case does not trigger mandatory AI disclosure requirements.',
            details: [],
            termsRef: this.termsReferences.usagePolicy.disclosure
        };

        const requiresDisclosure = this.checkDisclosureRequirement(formData);

        if (requiresDisclosure) {
            analysis.title = 'AI Disclosure Required';
            analysis.description = 'You must inform users they are interacting with an AI system.';
            analysis.details = [
                'Clear disclosure that AI is involved in the process',
                'Transparency about automated vs human decisions',
                'Appropriate disclaimers about AI limitations'
            ];

            if (!formData.disclosurePlanned) {
                analysis.status = 'restricted';
                analysis.title = 'Missing Required Disclosure';
                analysis.description = 'Failure to disclose AI use violates Terms of Service requirements.';
            }

            // Add specific requirements based on use case
            if (formData.useCase === 'healthcare') {
                analysis.details.push('Medical disclaimers required');
            } else if (formData.useCase === 'legal') {
                analysis.details.push('Legal advice disclaimers required');
            } else if (formData.useCase === 'finance') {
                analysis.details.push('Financial advice disclaimers required');
            }
        }

        return analysis;
    },

    // Analyze copyright and intellectual property
    analyzeCopyright: function(formData) {
        const isCommercial = formData.accountType === 'commercial';
        const isFree = formData.accountType === 'free';
        const isMax5x = formData.accountType === 'max5x';
        const isMax20x = formData.accountType === 'max20x';
        
        let analysis = {
            status: 'allowed',
            title: isCommercial ? 'Strong Copyright Protection' : 
                   isFree ? 'No Copyright Protection (Free)' :
                   isMax5x ? 'Limited Copyright Protection (Max 5x)' :
                   isMax20x ? 'Enhanced Copyright Protection (Max 20x)' :
                   'Limited Copyright Protection',
            description: '',
            details: [],
            termsRef: ''
        };

        if (isCommercial) {
            analysis.description = 'Commercial users receive indemnification against third-party copyright claims for authorized use of outputs.';
            analysis.details = [
                'Copyright indemnification coverage',
                'Defense against infringement claims',
                'Coverage for approved settlements/judgments',
                'Protection for authorized business use'
            ];
            analysis.termsRef = this.termsReferences.commercial.indemnification;
        } else if (isFree) {
            analysis.description = 'Free users have no copyright indemnification and must handle all potential disputes independently. Consider upgrading for better protection.';
            analysis.details = [
                'No copyright indemnification whatsoever',
                'User fully responsible for copyright verification',
                'No legal protections from Anthropic',
                'Rights assignment "if any" exists',
                'Usage limits may affect copyright claims'
            ];
            analysis.termsRef = this.termsReferences.free.indemnification;
            analysis.status = 'requires-review';
        } else if (isMax5x || isMax20x) {
            const planName = isMax5x ? 'Max 5x' : 'Max 20x';
            const protectionLevel = isMax20x ? 'enhanced' : 'limited';
            
            analysis.description = `${planName} users receive ${protectionLevel} copyright protections. Better than free/basic consumer but not as comprehensive as commercial accounts.`;
            analysis.details = [
                `${protectionLevel.charAt(0).toUpperCase() + protectionLevel.slice(1)} copyright indemnification`,
                'User responsible for copyright verification',
                `${planName} tier legal protections`,
                'Rights assignment "if any" exists'
            ];
            
            if (isMax20x) {
                analysis.details.push('Premium tier offers strongest consumer-level protection');
            }
            
            if (formData.mcpIntegrations) {
                analysis.details.push('MCP integrations may introduce additional copyright complexities');
            }
            
            if (formData.researchFeature) {
                analysis.details.push('Research feature outputs may include copyrighted web content');
            }
            
            analysis.termsRef = isMax5x ? this.termsReferences.max5x.indemnification : this.termsReferences.max20x.indemnification;
            analysis.status = 'requires-review';
        } else {
            analysis.description = 'Consumer users must independently verify copyright status of outputs and handle any potential disputes.';
            analysis.details = [
                'No copyright indemnification',
                'User responsible for copyright verification',
                'Limited legal protections',
                'Rights assignment "if any" exists'
            ];
            analysis.termsRef = this.termsReferences.consumer.indemnification;
            analysis.status = 'requires-review';
        }

        // Add warnings for specific use cases
        if (formData.contentUse === 'external' || formData.contentUse === 'commercial') {
            analysis.details.push('Consider adding human creativity to strengthen copyright claims');
            analysis.details.push('Document your creative process and contributions');
        }

        return analysis;
    },

    // Check if disclosure is required
    checkDisclosureRequirement: function(formData) {
        // High-risk use cases always require disclosure
        const highRiskCases = ['legal', 'healthcare', 'insurance', 'finance', 'employment', 'academic', 'journalism'];
        if (highRiskCases.includes(formData.useCase)) return true;

        // Customer-facing applications require disclosure
        if (formData.interactionType === 'customer-facing') return true;

        // Services for minors require disclosure
        if (formData.servesMinors) return true;

        // External content generation often requires disclosure
        if (formData.contentUse === 'external' && formData.useCase === 'general') return true;

        return false;
    },

    // Generate personalized suggestions
    generateSuggestions: function(formData, riskScore) {
        let suggestions = [];

        // High-risk suggestions
        if (riskScore.level === 'high') {
            suggestions.push({
                title: 'Immediate Review Required',
                description: 'Your current configuration poses significant compliance risks. Consider engaging legal counsel to review your implementation before proceeding.',
                priority: 'high'
            });
        }

        // Account type suggestions
        if (formData.accountType === 'free' && (formData.contentUse === 'commercial' || formData.contentUse === 'external')) {
            suggestions.push({
                title: 'Upgrade from Free Account',
                description: 'Free accounts have limited rights and usage restrictions. Consider upgrading to Pro, Max, or Commercial for better protections and fewer limitations.',
                priority: 'high'
            });
        } else if ((formData.accountType === 'consumer' || formData.accountType === 'max5x' || formData.accountType === 'max20x') && formData.contentUse === 'commercial') {
            suggestions.push({
                title: 'Consider Commercial Account for Business Use',
                description: 'Consumer accounts (including Max plans) provide limited commercial protections. Commercial accounts offer stronger ownership rights and indemnification coverage.',
                priority: 'medium'
            });
        }
        
        // MCP and Research feature suggestions
        if (formData.mcpIntegrations) {
            suggestions.push({
                title: 'Review MCP Integration Terms',
                description: 'MCP integrations are subject to third-party service terms. Ensure you understand data sharing and liability implications of connected services.',
                priority: 'medium'
            });
        }
        
        if (formData.researchFeature) {
            suggestions.push({
                title: 'Understand Research Feature Limitations',
                description: 'Claude Research accesses web content and may include information subject to copyright or other restrictions. Review outputs carefully.',
                priority: 'medium'
            });
        }

        // Human oversight suggestions
        if (formData.humanOversight === 'none' || formData.humanOversight === 'minimal') {
            const highRiskCases = ['legal', 'healthcare', 'insurance', 'finance', 'employment', 'academic'];
            if (highRiskCases.includes(formData.useCase)) {
                suggestions.push({
                    title: 'Implement Human Oversight',
                    description: 'High-risk use cases require qualified professional review before outputs reach end users. This is mandatory under Claude\'s Usage Policy.',
                    priority: 'high'
                });
            }
        }

        // Disclosure suggestions
        if (this.checkDisclosureRequirement(formData) && !formData.disclosurePlanned) {
            suggestions.push({
                title: 'Add AI Disclosure',
                description: 'Your use case requires informing users that AI is involved. Add clear disclaimers about AI assistance and limitations.',
                priority: 'high'
            });
        }

        // Copyright enhancement suggestions
        if (formData.contentUse === 'external' || formData.contentUse === 'commercial') {
            suggestions.push({
                title: 'Strengthen Copyright Claims',
                description: 'Add substantial human creativity and editing to AI outputs. Document your creative process to improve copyright protection.',
                priority: 'medium'
            });
        }

        // AI development restrictions
        if (formData.aiDevelopment && formData.aiDevelopment.length > 0) {
            suggestions.push({
                title: 'Review AI Development Restrictions',
                description: 'Using Claude outputs to train competing AI models or develop rival services is prohibited. Ensure compliance with non-compete clauses.',
                priority: 'high'
            });
        }

        // Data protection suggestions
        if (formData.useCase === 'healthcare' || formData.useCase === 'legal' || formData.useCase === 'finance') {
            suggestions.push({
                title: 'Implement Data Protection Measures',
                description: 'Avoid inputting sensitive personal data, health records, or confidential information into Claude. Use data minimization principles.',
                priority: 'medium'
            });
        }

        // International considerations
        if (formData.accountType === 'commercial') {
            suggestions.push({
                title: 'Review International Compliance',
                description: 'Ensure your use complies with local laws in all jurisdictions where you operate, especially regarding AI disclosure and data protection.',
                priority: 'low'
            });
        }

        return suggestions.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    },

    // Helper functions for content descriptions
    getProhibitedContentDescription: function(item) {
        const descriptions = {
            'child-safety': 'Content compromising children\'s safety is strictly prohibited',
            'critical-infrastructure': 'Attempts to compromise critical infrastructure are forbidden',
            'violence-hate': 'Content inciting violence or hateful behavior violates policy',
            'privacy-identity': 'Compromising privacy or identity rights is prohibited',
            'illegal-weapons': 'Creating or facilitating illegal weapons/goods is forbidden',
            'psychological-harm': 'Content causing psychological or emotional harm is restricted',
            'misinformation': 'Creating or spreading misinformation violates policy',
            'political-campaigns': 'Using Claude for political campaigns is prohibited',
            'law-enforcement': 'Most law enforcement applications are restricted',
            'fraudulent-practices': 'Fraudulent, abusive, or predatory practices are forbidden',
            'platform-abuse': 'Abusing Claude\'s platform or circumventing restrictions is prohibited',
            'sexually-explicit': 'Generating sexually explicit content is forbidden'
        };
        return descriptions[item] || `Prohibited activity: ${item}`;
    },

    getAiDevelopmentDescription: function(item) {
        const descriptions = {
            'competing-ai': 'Developing competing AI services is explicitly prohibited',
            'model-training': 'Using outputs to train other AI models violates Terms',
            'model-scraping': 'Scraping outputs for model development is forbidden',
            'reselling-outputs': 'Reselling Claude\'s outputs as standalone products is restricted'
        };
        return descriptions[item] || `AI development restriction: ${item}`;
    }
};