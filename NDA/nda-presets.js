/**
 * NDA Studio - Scenario Presets Configuration
 *
 * This file contains preset configurations for the 7 core NDA scenarios.
 * Each preset provides smart defaults for all NDA generator form fields,
 * suggested clauses, risk assessment, and practical tips.
 *
 * @author Terms.Law
 * @version 1.0.0
 */

const NDA_PRESETS = {

  // ============================================
  // SCENARIO 1: Business Deal NDA
  // ============================================
  'business-deal': {
    id: 'business-deal',
    name: 'Business Deal NDA',
    emoji: '🤝',
    shortDescription: 'For partnerships, vendor discussions, exploring deals',
    description: 'Ideal for partnership talks, reseller discussions, co-marketing opportunities, referral arrangements, and strategic collaboration discussions. Mutual protection is standard when both parties will share business strategies, customer information, or operational details.',

    defaults: {
      // Agreement Type
      ndaType: 'mutual',

      // Protection Level (1-3 scale)
      protectionBreadth: 2,      // Standard definition
      protectionStrictness: 2,   // Standard restrictions

      // Purpose
      purpose: 'business',
      customPurpose: '',

      // Terms
      termYears: 2,
      survivalYears: 3,
      governingState: 'California',
      jurisdiction: '',

      // Party defaults (placeholders)
      partyAEntity: 'corporation',
      partyAState: 'California',
      partyBEntity: 'corporation',
      partyBState: '',

      // Optional Clauses
      clauseMarking: false,           // Don't require marking - protects more info
      clauseNonSolicitation: false,   // Usually not needed for early talks
      clauseNonCircumvention: true,   // Important for business introductions
      clauseResiduals: false,         // Keep tight control
      clauseReturnMaterials: true,    // Always include
      clauseNoLicense: true,          // Always include
      clauseStandstill: false         // Not applicable
    },

    suggestedClauses: [
      {
        id: 'non-circumvention',
        name: 'Non-Circumvention',
        reason: 'Prevents the other party from going around you to contacts or opportunities you introduce',
        priority: 'recommended'
      },
      {
        id: 'purpose-limitation',
        name: 'Tight Purpose Clause',
        reason: 'Limits use of your information strictly to evaluating the potential partnership',
        priority: 'recommended'
      },
      {
        id: 'return-destroy',
        name: 'Return/Destruction',
        reason: 'Ensures materials are returned if the deal falls through',
        priority: 'recommended'
      },
      {
        id: 'non-solicitation',
        name: 'Non-Solicitation',
        reason: 'Consider if you will introduce key employees during discussions',
        priority: 'optional'
      }
    ],

    riskLevel: 'standard',
    riskExplanation: 'Business deal discussions typically involve moderate risk. Both parties share sensitive information, so mutual protection is appropriate.',

    tips: [
      'Mutual protection is standard for business discussions where both sides share information',
      'Keep the purpose clause tight - "evaluating a potential business relationship" is better than vague language',
      'Non-circumvention is especially important if you are making customer or vendor introductions',
      'If the deal involves sharing customer lists, consider adding non-solicitation of customers',
      'Two years is standard for exploratory discussions; extend to 3+ years if the talks may be prolonged'
    ],

    commonTraps: [
      {
        trap: 'Vague Purpose Clause',
        description: 'Purpose clauses like "for any business purpose" give the other party too much latitude',
        solution: 'Be specific: "evaluating a potential partnership for joint marketing in the renewable energy sector"'
      },
      {
        trap: 'Loose "Independently Developed" Carve-out',
        description: 'An overly broad exception for independently developed work can swallow the protections',
        solution: 'Require contemporaneous written documentation to prove independent development'
      },
      {
        trap: 'Uncontrolled Affiliate Disclosure',
        description: 'Allowing disclosure to "affiliates" without limitation spreads your info widely',
        solution: 'Limit to affiliates with a need to know who are bound by similar confidentiality obligations'
      },
      {
        trap: 'Marking Requirement',
        description: 'Requiring "Confidential" marking means verbal discussions are unprotected',
        solution: 'Avoid marking requirements, or require written confirmation of oral disclosures within 30 days'
      }
    ],

    negotiationPoints: [
      {
        topic: 'If they want a marking requirement',
        theirPosition: 'Only marked information should be confidential',
        yourResponse: 'Counter with: oral disclosures confirmed in writing within 30 days are also covered',
        fallback: 'Accept marking for written materials only, but ensure oral disclosures have a confirmation mechanism'
      },
      {
        topic: 'If they resist non-circumvention',
        theirPosition: 'They want freedom to work with anyone',
        yourResponse: 'Explain this only covers contacts YOU introduce, not pre-existing relationships',
        fallback: 'Limit non-circumvention to specifically identified contacts shared during discussions'
      },
      {
        topic: 'If they want residuals',
        theirPosition: 'Their employees should be able to use general knowledge gained',
        yourResponse: 'Counter: residuals are inappropriate for business strategies, customer lists, and pricing',
        fallback: 'Accept narrow residuals excluding trade secrets, customer data, and specific business plans'
      }
    ],

    industryVariants: ['saas', 'manufacturing', 'professional-services'],
    relatedScenarios: ['contractor', 'professional-services', 'ma-diligence']
  },

  // ============================================
  // SCENARIO 2: Employee Confidentiality
  // ============================================
  'employee': {
    id: 'employee',
    name: 'Employee Confidentiality Agreement',
    emoji: '👔',
    shortDescription: 'For employees protecting company information',
    description: 'For employees who will have access to confidential company information, trade secrets, customer data, or proprietary processes. Note: A standalone NDA may not be sufficient for employees - consider whether you need a full Proprietary Information and Inventions Assignment (PIIA) agreement.',

    defaults: {
      // Agreement Type
      ndaType: 'one-way',  // Employee receives, company discloses

      // Protection Level
      protectionBreadth: 3,      // Broad - protect all company info
      protectionStrictness: 3,   // Strict - employees have access to everything

      // Purpose
      purpose: 'employment',
      customPurpose: '',

      // Terms
      termYears: 3,              // Duration of employment (adjust as needed)
      survivalYears: 5,          // Long survival for trade secrets
      governingState: 'California',
      jurisdiction: '',

      // Party defaults
      partyAEntity: 'corporation',
      partyAState: 'California',
      partyBEntity: 'individual',
      partyBState: '',

      // Optional Clauses
      clauseMarking: false,           // Don't require marking for employee access
      clauseNonSolicitation: false,   // Usually in separate employment agreement
      clauseNonCircumvention: false,  // Not typical for employment
      clauseResiduals: false,         // No residuals for employees
      clauseReturnMaterials: true,    // Critical - must return all materials
      clauseNoLicense: true,          // Employee gets no IP rights
      clauseStandstill: false         // Not applicable
    },

    suggestedClauses: [
      {
        id: 'return-materials',
        name: 'Return of Materials',
        reason: 'Essential for employees - ensures all company data is returned upon termination',
        priority: 'required'
      },
      {
        id: 'device-access',
        name: 'Device/Account Access',
        reason: 'Ensures access to company systems and accounts is revocable',
        priority: 'recommended'
      },
      {
        id: 'dtsa-notice',
        name: 'DTSA Whistleblower Notice',
        reason: 'Required under the Defend Trade Secrets Act for immunity provisions',
        priority: 'required'
      },
      {
        id: 'permitted-disclosures',
        name: 'Permitted Disclosures',
        reason: 'Carves out required legal disclosures and whistleblower protections',
        priority: 'recommended'
      }
    ],

    riskLevel: 'high',
    riskExplanation: 'Employees have deep access to company information. Strong protections are warranted, but must be balanced with employee rights and state law restrictions.',

    tips: [
      'A standalone NDA is often insufficient for employees - consider a full PIIA (Proprietary Information and Inventions Assignment)',
      'California law restricts non-compete provisions - focus on confidentiality, not competition',
      'Include the DTSA whistleblower notice language to preserve your remedies under federal trade secret law',
      'Make clear what happens to confidential information upon termination',
      'Consider adding specific provisions for remote work and personal devices'
    ],

    commonTraps: [
      {
        trap: 'Overly Broad "All Ideas Belong to Employer"',
        description: 'Trying to claim employee ideas unrelated to work violates California law',
        solution: 'Limit assignment to inventions related to company business or using company resources'
      },
      {
        trap: 'Hidden Non-Compete Language',
        description: 'Confidentiality provisions that effectively prevent working in the industry',
        solution: 'Focus on protecting specific information, not restricting future employment broadly'
      },
      {
        trap: 'Missing DTSA Notice',
        description: 'Without the required notice, you cannot recover attorney fees or punitive damages under DTSA',
        solution: 'Include the statutory whistleblower immunity notice language'
      },
      {
        trap: 'No Return-of-Materials Obligation',
        description: 'Employees may retain copies of confidential information after leaving',
        solution: 'Require return AND destruction of all copies, with certification'
      }
    ],

    negotiationPoints: [
      {
        topic: 'If employee requests narrower scope',
        theirPosition: 'Only information marked confidential should be covered',
        yourResponse: 'Employees have access to all company systems - marking is impractical',
        fallback: 'Define categories of information that are always confidential regardless of marking'
      },
      {
        topic: 'If employee wants to keep work samples',
        theirPosition: 'They need portfolio pieces for future job searches',
        yourResponse: 'Offer to provide sanitized samples or references instead',
        fallback: 'Allow retention of publicly-released work only, with written approval'
      },
      {
        topic: 'If employee resists long survival period',
        theirPosition: 'Three years should be enough',
        yourResponse: 'Trade secrets require perpetual protection; other information has time limit',
        fallback: 'Distinguish between trade secrets (perpetual) and other confidential info (3-5 years)'
      }
    ],

    importantNote: 'This scenario is a TRIAGE page. Many employers asking for an "employee NDA" actually need a full Proprietary Information and Inventions Assignment (PIIA) agreement that covers confidentiality, invention assignment, and work-for-hire provisions.',

    industryVariants: ['tech', 'healthcare', 'financial-services'],
    relatedScenarios: ['contractor', 'software-dev']
  },

  // ============================================
  // SCENARIO 3: Contractor NDA
  // ============================================
  'contractor': {
    id: 'contractor',
    name: 'Contractor NDA',
    emoji: '🔧',
    shortDescription: 'For freelancers, agencies, and independent contractors',
    description: 'For sharing credentials, roadmaps, code, or other sensitive information with freelancers, agencies, or independent contractors. Distinct from employee agreements because contractors maintain independence and may work with competitors.',

    defaults: {
      // Agreement Type
      ndaType: 'one-way',  // Contractor receives your confidential info

      // Protection Level
      protectionBreadth: 3,      // Broad - they see your systems
      protectionStrictness: 2,   // Standard restrictions

      // Purpose
      purpose: 'vendor',
      customPurpose: '',

      // Terms
      termYears: 1,              // Project-based, often shorter
      survivalYears: 3,          // Reasonable survival
      governingState: 'California',
      jurisdiction: '',

      // Party defaults
      partyAEntity: 'corporation',
      partyAState: 'California',
      partyBEntity: 'llc',       // Many contractors are LLCs
      partyBState: '',

      // Optional Clauses
      clauseMarking: false,           // Don't require marking
      clauseNonSolicitation: false,   // Consider if they meet your team
      clauseNonCircumvention: false,  // Usually not applicable
      clauseResiduals: false,         // No residuals - they may work for competitors
      clauseReturnMaterials: true,    // Critical
      clauseNoLicense: true,          // They get no IP rights
      clauseStandstill: false         // Not applicable
    },

    suggestedClauses: [
      {
        id: 'no-residuals',
        name: 'No Residuals',
        reason: 'Contractors may work for competitors - they cannot use concepts from your work',
        priority: 'required'
      },
      {
        id: 'credential-handling',
        name: 'Credential Handling',
        reason: 'Specific procedures for passwords, API keys, and access credentials',
        priority: 'recommended'
      },
      {
        id: 'no-portfolio',
        name: 'No Portfolio Use',
        reason: 'Prevents contractor from showcasing your project without consent',
        priority: 'recommended'
      },
      {
        id: 'return-revoke',
        name: 'Return & Access Revocation',
        reason: 'Ensures credentials are revoked and materials returned at project end',
        priority: 'required'
      },
      {
        id: 'injunctive-relief',
        name: 'Injunctive Relief',
        reason: 'Allows you to get immediate court order if breach occurs',
        priority: 'recommended'
      }
    ],

    riskLevel: 'elevated',
    riskExplanation: 'Contractors often work with multiple clients, including potential competitors. Strong access controls and clear boundaries are essential.',

    tips: [
      'NDA is not the same as IP assignment - ensure your contractor agreement covers work product ownership separately',
      'No residuals is critical because contractors may take general concepts to competitors',
      'Be explicit about portfolio/case-study restrictions if your project should remain private',
      'Include specific credential handling procedures if sharing access to systems',
      'Consider whether you need non-solicitation if the contractor will interact with your team or customers'
    ],

    commonTraps: [
      {
        trap: 'Contractor Insists on Residuals',
        description: 'Contractor wants to use "general knowledge" from your project',
        solution: 'Residuals are not appropriate when sharing proprietary methods, code, or trade secrets'
      },
      {
        trap: '"Confidential Only If Marked"',
        description: 'In the flow of work, not everything gets marked - oral discussions, screen shares, etc.',
        solution: 'All information shared in connection with the project is confidential, marked or not'
      },
      {
        trap: 'Broad Portfolio Carve-out',
        description: 'Contractor wants unlimited right to show your work',
        solution: 'Require written approval for any portfolio use; offer to provide references instead'
      },
      {
        trap: 'Ownership/IP Confusion',
        description: 'NDA does not equal IP assignment - contractor may still own the work',
        solution: 'Use a separate contractor agreement or work-for-hire clause to address ownership'
      }
    ],

    negotiationPoints: [
      {
        topic: 'If contractor wants residuals',
        theirPosition: 'They need to use general skills/concepts learned for other clients',
        yourResponse: 'Residuals allow them to take proprietary methods to competitors',
        fallback: 'Narrow residuals excluding trade secrets, source code, and specific methodologies'
      },
      {
        topic: 'If contractor wants portfolio rights',
        theirPosition: 'They need to show their work to get new clients',
        yourResponse: 'Offer written references, anonymized case studies, or delayed portfolio use',
        fallback: 'Portfolio use allowed after 12-18 months with your written approval of content'
      },
      {
        topic: 'If contractor resists return of materials',
        theirPosition: 'They need to keep records for tax/liability purposes',
        yourResponse: 'They can keep their own invoices and contracts, but not your confidential info',
        fallback: 'Allow retention of administrative records but require destruction of project materials'
      }
    ],

    industryVariants: ['software', 'marketing', 'design', 'consulting'],
    relatedScenarios: ['software-dev', 'professional-services', 'employee']
  },

  // ============================================
  // SCENARIO 4: Software Development NDA
  // ============================================
  'software-dev': {
    id: 'software-dev',
    name: 'Software Development NDA',
    emoji: '💻',
    shortDescription: 'For source code, credentials, and technical access',
    description: 'Specialized NDA for sharing source code, repository access, API credentials, deployment pipelines, or technical architecture. Distinct from general contractor NDAs because it includes explicit security obligations, credential handling procedures, and technical-specific protections.',

    defaults: {
      // Agreement Type
      ndaType: 'one-way',  // They receive access to your systems

      // Protection Level
      protectionBreadth: 3,      // Maximum - source code is core IP
      protectionStrictness: 3,   // Maximum - code access requires strict controls

      // Purpose
      purpose: 'vendor',
      customPurpose: 'software development, maintenance, or technical consulting services',

      // Terms
      termYears: 1,
      survivalYears: 5,          // Longer survival for code/architecture
      governingState: 'California',
      jurisdiction: '',

      // Party defaults
      partyAEntity: 'corporation',
      partyAState: 'California',
      partyBEntity: 'llc',
      partyBState: '',

      // Optional Clauses
      clauseMarking: false,           // All code is confidential
      clauseNonSolicitation: false,   // Consider if they meet your dev team
      clauseNonCircumvention: false,  // Not typical
      clauseResiduals: false,         // NEVER for source code
      clauseReturnMaterials: true,    // Must delete all code copies
      clauseNoLicense: true,          // Critical - they get no code rights
      clauseStandstill: false         // Not applicable
    },

    suggestedClauses: [
      {
        id: 'source-code-definition',
        name: 'Explicit Source Code Definition',
        reason: 'Specifically lists source code, object code, libraries, and dependencies as confidential',
        priority: 'required'
      },
      {
        id: 'credential-controls',
        name: 'Credential Handling Procedures',
        reason: 'Specific requirements for password management, 2FA, and key rotation',
        priority: 'required'
      },
      {
        id: 'security-baseline',
        name: 'Security Baseline Requirements',
        reason: 'Specific security obligations - not vague "commercially reasonable" language',
        priority: 'required'
      },
      {
        id: 'no-reverse-engineering',
        name: 'No Reverse Engineering',
        reason: 'Prevents analysis or decompilation of your code',
        priority: 'required'
      },
      {
        id: 'access-verification',
        name: 'Access Return Verification',
        reason: 'Requires confirmation that access has been revoked and code deleted',
        priority: 'required'
      },
      {
        id: 'no-residuals',
        name: 'No Residuals (Mandatory)',
        reason: 'Absolutely no residual rights in source code or technical architecture',
        priority: 'required'
      }
    ],

    riskLevel: 'critical',
    riskExplanation: 'Source code and credentials represent core IP and security exposure. Any leak can result in competitive harm, security breaches, or loss of trade secret status.',

    tips: [
      'Residuals are NEVER appropriate for source code access - this is non-negotiable',
      'Specify security requirements explicitly rather than using vague "reasonable" standards',
      'Include procedures for credential rotation when the engagement ends',
      'Consider requiring secure development practices (e.g., no code on personal devices)',
      'Verify access revocation after engagement ends - don\'t just trust it happened'
    ],

    commonTraps: [
      {
        trap: 'Vague Security Obligations',
        description: '"Commercially reasonable security" means different things to different people',
        solution: 'Specify: encrypted storage, 2FA required, no sharing credentials, specific backup procedures'
      },
      {
        trap: 'Residuals for "General Concepts"',
        description: 'Developers claim they can use architectural patterns learned from your code',
        solution: 'Explicit prohibition: no residuals for code, architecture, algorithms, or technical solutions'
      },
      {
        trap: 'Personal Device Usage',
        description: 'Developer clones your repo to their personal laptop, retains it after engagement',
        solution: 'Require company-managed devices or explicit policies on personal device usage and deletion'
      },
      {
        trap: 'No Access Revocation Verification',
        description: 'Engagement ends but you never confirm they actually lost access',
        solution: 'Require written certification of access revocation and code deletion'
      }
    ],

    negotiationPoints: [
      {
        topic: 'If they want residuals for coding patterns',
        theirPosition: 'Every developer uses patterns they learned on previous projects',
        yourResponse: 'Your specific implementation, architecture, and algorithms are trade secrets',
        fallback: 'This is non-negotiable for source code access. General programming skills are fine, specific solutions are not.'
      },
      {
        topic: 'If they resist security requirements',
        theirPosition: 'Too burdensome, they work from coffee shops on personal laptops',
        yourResponse: 'These requirements match the sensitivity of the code they are accessing',
        fallback: 'Consider whether this contractor is appropriate for sensitive code access'
      },
      {
        topic: 'If they want to keep code samples',
        theirPosition: 'Need portfolio examples',
        yourResponse: 'Source code cannot be used in portfolios. Offer written reference instead.',
        fallback: 'Allow description of project type and technologies used, but no code excerpts ever'
      }
    ],

    securityRequirements: [
      'Use password manager for all credentials',
      'Enable 2FA on all accounts with access',
      'No code on personal devices without explicit approval',
      'Encrypted storage for any local code copies',
      'Immediate credential rotation upon engagement end',
      'Written certification of code deletion within 5 business days of termination'
    ],

    industryVariants: ['saas', 'fintech', 'healthcare-tech', 'ai-ml'],
    relatedScenarios: ['contractor', 'employee']
  },

  // ============================================
  // SCENARIO 5: M&A / Diligence NDA
  // ============================================
  'ma-diligence': {
    id: 'ma-diligence',
    name: 'M&A / Due Diligence NDA',
    emoji: '🏢',
    shortDescription: 'For acquisitions, mergers, and data room access',
    description: 'For evaluating potential acquisitions, mergers, or significant asset purchases. These NDAs involve extensive disclosure of financials, operations, legal matters, and often require special provisions like standstill clauses, clean team arrangements, and extended survival periods.',

    defaults: {
      // Agreement Type
      ndaType: 'one-way',  // Seller discloses to buyer typically

      // Protection Level
      protectionBreadth: 3,      // Maximum - everything is disclosed
      protectionStrictness: 3,   // Maximum protection

      // Purpose
      purpose: 'acquisition',
      customPurpose: '',

      // Terms
      termYears: 2,              // M&A discussions can be prolonged
      survivalYears: 5,          // Longer survival for M&A
      governingState: 'Delaware', // Common for M&A
      jurisdiction: '',

      // Party defaults
      partyAEntity: 'corporation',
      partyAState: 'Delaware',
      partyBEntity: 'corporation',
      partyBState: '',

      // Optional Clauses
      clauseMarking: false,           // Data room has everything
      clauseNonSolicitation: true,    // Protect employees during diligence
      clauseNonCircumvention: false,  // Not typical for M&A
      clauseResiduals: false,         // Never for M&A
      clauseReturnMaterials: true,    // Critical - return all diligence materials
      clauseNoLicense: true,          // No rights transfer until closing
      clauseStandstill: true          // Show standstill option for M&A
    },

    suggestedClauses: [
      {
        id: 'standstill',
        name: 'Standstill Provision',
        reason: 'Prevents unsolicited acquisition attempts during the evaluation period',
        priority: 'recommended'
      },
      {
        id: 'clean-team',
        name: 'Clean Team Provisions',
        reason: 'Limits who can see highly sensitive competitive information',
        priority: 'recommended'
      },
      {
        id: 'non-solicit-employees',
        name: 'Employee Non-Solicitation',
        reason: 'Prevents poaching of employees discovered during diligence',
        priority: 'recommended'
      },
      {
        id: 'non-solicit-customers',
        name: 'Customer Non-Solicitation',
        reason: 'Prevents targeting of customers discovered in data room',
        priority: 'optional'
      },
      {
        id: 'archival-retention',
        name: 'Archival Retention Carve-out',
        reason: 'Allows buyer to retain copies for legal compliance purposes',
        priority: 'optional'
      },
      {
        id: 'permitted-recipients',
        name: 'Defined Permitted Recipients',
        reason: 'Explicitly lists who can access data room (advisors, bankers, counsel)',
        priority: 'required'
      }
    ],

    riskLevel: 'critical',
    riskExplanation: 'M&A diligence involves disclosure of virtually all company secrets - financials, contracts, litigation, employees, customers. A breach can be devastating.',

    tips: [
      'Consider different NDA versions for LOI stage vs. confirmatory diligence - earlier stage can be lighter',
      'Standstill clauses are optional but important if you want to prevent hostile moves during discussions',
      'Clean team provisions are important when buyer is a competitor to limit exposure',
      'Delaware law is standard for M&A due to well-developed case law',
      'Employee and customer non-solicitation is critical - buyers learn exactly who is valuable'
    ],

    commonTraps: [
      {
        trap: 'No Employee Non-Solicitation',
        description: 'Buyer learns who your key employees are during diligence, then poaches them if deal fails',
        solution: 'Include 12-18 month non-solicitation of employees identified through diligence'
      },
      {
        trap: 'Unlimited Advisor Disclosure',
        description: 'Buyer shares with unlimited "advisors" without accountability',
        solution: 'Require list of permitted recipients; advisors must be bound by confidentiality'
      },
      {
        trap: 'No Standstill',
        description: 'During diligence, buyer learns everything then launches hostile takeover',
        solution: 'Include standstill preventing acquisition attempts during diligence + 12 months after'
      },
      {
        trap: 'Residuals Clause',
        description: 'Buyer claims right to use information retained in "unaided memory"',
        solution: 'Residuals are completely inappropriate for M&A - reject absolutely'
      }
    ],

    negotiationPoints: [
      {
        topic: 'If buyer resists standstill',
        theirPosition: 'They want flexibility to pursue acquisition aggressively',
        yourResponse: 'Standstill only applies during good-faith negotiations; protects orderly process',
        fallback: 'Narrow standstill: only prevents hostile actions, allows friendly discussions'
      },
      {
        topic: 'If buyer wants broad advisor access',
        theirPosition: 'They need flexibility to engage various advisors',
        yourResponse: 'Require advance notice of new advisors; advisors must be bound by NDA terms',
        fallback: 'Permitted categories (legal, financial, tax advisors) but require confidentiality acknowledgment'
      },
      {
        topic: 'If buyer wants shorter survival',
        theirPosition: 'Two years is enough',
        yourResponse: 'M&A information has long-term competitive value; industry standard is 3-5 years',
        fallback: 'Trade secrets remain protected indefinitely; other information has 3-year survival'
      }
    ],

    dealStages: {
      preliminary: {
        name: 'Preliminary / LOI Stage',
        description: 'Initial evaluation, limited disclosure',
        adjustments: {
          termYears: 1,
          survivalYears: 3,
          clauseStandstill: false,
          clauseNonSolicitation: false
        }
      },
      confirmatory: {
        name: 'Confirmatory Diligence',
        description: 'Full data room access, extensive disclosure',
        adjustments: {
          termYears: 2,
          survivalYears: 5,
          clauseStandstill: true,
          clauseNonSolicitation: true
        }
      }
    },

    industryVariants: ['tech', 'healthcare', 'manufacturing', 'financial-services'],
    relatedScenarios: ['business-deal', 'professional-services']
  },

  // ============================================
  // SCENARIO 6: Relationship & Privacy NDA
  // ============================================
  'relationship-privacy': {
    id: 'relationship-privacy',
    name: 'Relationship & Privacy NDA',
    emoji: '🔐',
    shortDescription: 'For personal relationships, privacy, and intimate situations',
    description: 'Privacy-focused NDAs for personal relationships, adult lifestyle boundaries, intimate media protection, and celebrity/public figure dating. These agreements focus on personal privacy, media control, and rapid response mechanisms if breaches occur.',

    defaults: {
      // Agreement Type
      ndaType: 'mutual',  // Both parties share private information

      // Protection Level
      protectionBreadth: 3,      // Broad - all private information
      protectionStrictness: 3,   // Strict - privacy is paramount

      // Purpose
      purpose: 'custom',
      customPurpose: 'protecting private personal information shared in the context of a personal relationship',

      // Terms
      termYears: 3,              // Duration of relationship + buffer
      survivalYears: 10,         // Long survival for personal privacy
      governingState: 'California',
      jurisdiction: '',

      // Party defaults
      partyAEntity: 'individual',
      partyAState: '',
      partyBEntity: 'individual',
      partyBState: '',

      // Optional Clauses
      clauseMarking: false,           // Private info is private, period
      clauseNonSolicitation: false,   // Not applicable
      clauseNonCircumvention: false,  // Not applicable
      clauseResiduals: false,         // No residuals for personal info
      clauseReturnMaterials: true,    // Return/delete photos, messages, etc.
      clauseNoLicense: true,          // No rights to personal media
      clauseStandstill: false         // Not applicable
    },

    suggestedClauses: [
      {
        id: 'media-definition',
        name: 'Intimate Media Definition',
        reason: 'Explicitly defines photos, videos, recordings, and messages as protected',
        priority: 'required'
      },
      {
        id: 'deletion-requirement',
        name: 'Deletion Requirement',
        reason: 'Requires deletion of all intimate media upon relationship end or request',
        priority: 'required'
      },
      {
        id: 'takedown-cooperation',
        name: 'Takedown Cooperation',
        reason: 'Requires cooperation with removal requests if media is leaked',
        priority: 'required'
      },
      {
        id: 'social-media-restriction',
        name: 'Social Media Restriction',
        reason: 'Prohibits posting about the relationship without consent',
        priority: 'recommended'
      },
      {
        id: 'liquidated-damages',
        name: 'Liquidated Damages',
        reason: 'Pre-agreed damages for breach, since actual harm is hard to prove',
        priority: 'recommended'
      },
      {
        id: 'expedited-relief',
        name: 'Expedited Injunctive Relief',
        reason: 'Fast-track court process for urgent situations',
        priority: 'recommended'
      }
    ],

    riskLevel: 'personal',
    riskExplanation: 'Privacy breaches in personal relationships can cause severe emotional, reputational, and professional harm. Strong protections with rapid response mechanisms are essential.',

    tips: [
      'Keep the language neutral and privacy-focused - avoid explicit content descriptions',
      'Define "Private Information" broadly to cover all personal matters, not just intimate content',
      'Include rapid-response provisions for urgent situations like unauthorized posting',
      'Consider liquidated damages since proving actual harm from privacy violations is difficult',
      'Mutual protection is standard - both parties share private information in relationships'
    ],

    commonTraps: [
      {
        trap: 'Narrow Media Definition',
        description: 'Agreement only covers "photos" but not videos, messages, or voice recordings',
        solution: 'Define protected media broadly: photos, videos, audio, messages, and any recordings'
      },
      {
        trap: 'No Deletion Mechanism',
        description: 'Agreement prohibits sharing but doesn\'t require deletion',
        solution: 'Include affirmative obligation to delete upon request or relationship end'
      },
      {
        trap: 'No Rapid Response',
        description: 'Standard court process takes months - media spreads in hours',
        solution: 'Include consent to expedited injunctive relief and TRO provisions'
      },
      {
        trap: 'Unenforceable Damages',
        description: 'Emotional harm is hard to quantify in court',
        solution: 'Include reasonable liquidated damages clause (not punitive)'
      }
    ],

    negotiationPoints: [
      {
        topic: 'If they resist mutual protection',
        theirPosition: 'Only one party needs protection',
        yourResponse: 'Both parties share private information in relationships',
        fallback: 'Consider whether you want to proceed with imbalanced protection'
      },
      {
        topic: 'If they want to exclude social media posts',
        theirPosition: 'They should be able to post about their own life',
        yourResponse: 'Posts about the relationship involve your privacy too',
        fallback: 'Allow non-identifying posts that don\'t reveal personal details'
      },
      {
        topic: 'If they resist deletion requirements',
        theirPosition: 'They want to keep memories',
        yourResponse: 'Keeping intimate content after relationship ends creates ongoing risk',
        fallback: 'Allow retention of non-intimate photos only'
      }
    ],

    subScenarios: {
      'relationship-privacy': {
        name: 'Relationship Privacy NDA',
        description: 'General personal relationship confidentiality',
        focus: 'Private communications, social media, relationship details'
      },
      'adult-lifestyle': {
        name: 'Adult Lifestyle / BDSM Privacy NDA',
        description: 'Consensual adult lifestyle boundaries',
        focus: 'Heightened privacy, no community sharing, specific activity protection'
      },
      'intimate-media': {
        name: 'Intimate Media Protection NDA',
        description: 'Photos, videos, and recordings protection',
        focus: 'Media-specific definitions, deletion requirements, rapid takedown'
      },
      'celebrity-dating': {
        name: 'Celebrity / Public Figure Dating NDA',
        description: 'Public figure relationships with media exposure risk',
        focus: 'Media contact prohibition, paparazzi, public appearances'
      }
    },

    legalLimitations: [
      'NDAs cannot prevent reporting of crimes or abuse',
      'NDAs cannot waive rights to seek protective orders',
      'Some states restrict NDA enforcement in certain contexts',
      'NDAs cannot prevent testimony if legally compelled',
      'Courts may not enforce provisions seen as against public policy'
    ],

    industryVariants: [],
    relatedScenarios: []
  },

  // ============================================
  // SCENARIO 7: Professional Services NDA
  // ============================================
  'professional-services': {
    id: 'professional-services',
    name: 'Professional Services NDA',
    emoji: '⚖️',
    shortDescription: 'For attorneys, CPAs, consultants, and professional advisors',
    description: 'NDAs for professional service relationships where either the professional protects client information or the client protects information shared with a professional. Includes attorney-client, accountant, and consultant engagements in both directions.',

    defaults: {
      // Agreement Type
      ndaType: 'mutual',  // Professional and client both share information

      // Protection Level
      protectionBreadth: 2,      // Standard scope
      protectionStrictness: 2,   // Standard restrictions

      // Purpose
      purpose: 'custom',
      customPurpose: 'professional consulting and advisory services',

      // Terms
      termYears: 2,
      survivalYears: 5,          // Longer for professional advice
      governingState: 'California',
      jurisdiction: '',

      // Party defaults
      partyAEntity: 'corporation',
      partyAState: 'California',
      partyBEntity: 'llc',        // Many professionals are LLCs/PLLCs
      partyBState: '',

      // Optional Clauses
      clauseMarking: false,           // All professional communications protected
      clauseNonSolicitation: false,   // Usually not needed
      clauseNonCircumvention: false,  // Not typical
      clauseResiduals: false,         // No residuals for professional advice
      clauseReturnMaterials: true,    // Return client files
      clauseNoLicense: true,          // Standard
      clauseStandstill: false         // Not applicable
    },

    suggestedClauses: [
      {
        id: 'staff-disclosure',
        name: 'Staff/Associate Disclosure',
        reason: 'Allows sharing with professional\'s staff who need to know',
        priority: 'required'
      },
      {
        id: 'compelled-disclosure',
        name: 'Compelled Disclosure Carve-out',
        reason: 'Addresses subpoenas and regulatory requests',
        priority: 'required'
      },
      {
        id: 'no-professional-relationship',
        name: 'No Professional Relationship Disclaimer',
        reason: 'Clarifies NDA does not create attorney-client or similar privilege',
        priority: 'recommended'
      },
      {
        id: 'subcontractor-protection',
        name: 'Subcontractor Provisions',
        reason: 'Addresses when professional engages subcontractors',
        priority: 'recommended'
      },
      {
        id: 'breach-notification',
        name: 'Breach Notification',
        reason: 'Requires notice if confidential information may have been exposed',
        priority: 'recommended'
      }
    ],

    riskLevel: 'standard',
    riskExplanation: 'Professional services involve bidirectional information sharing. Professionals have ethical duties that supplement NDA protections.',

    tips: [
      'NDA supplements but does not replace professional ethical duties (attorney privilege, CPA confidentiality)',
      'Consider which direction is primary - are you the professional or the client?',
      'Professional-to-client NDAs should address staff access and subcontractors',
      'Client-to-professional NDAs should address security baseline and portfolio restrictions',
      'Compelled disclosure provisions are important for professionals who may receive subpoenas'
    ],

    commonTraps: [
      {
        trap: 'Implying Attorney-Client Relationship',
        description: 'NDA language that suggests legal advice is being given',
        solution: 'Explicit disclaimer: "This NDA does not create an attorney-client relationship"'
      },
      {
        trap: 'No Staff Carve-out',
        description: 'Professional cannot share with paralegals, associates, or support staff',
        solution: 'Allow disclosure to staff with need to know who are bound by similar duties'
      },
      {
        trap: 'Conflicts with Professional Ethics',
        description: 'NDA terms that conflict with bar rules or CPA standards',
        solution: 'Include carve-out for compliance with professional ethical obligations'
      },
      {
        trap: 'Subcontractor Gap',
        description: 'Professional engages subcontractors without confidentiality coverage',
        solution: 'Require subcontractors to be bound by equivalent confidentiality terms'
      }
    ],

    negotiationPoints: [
      {
        topic: 'If client wants unlimited staff restriction',
        theirPosition: 'Information should only be seen by the named professional',
        yourResponse: 'Effective service requires appropriate staff support',
        fallback: 'Pre-approve specific staff members who will have access'
      },
      {
        topic: 'If professional wants broad portfolio rights',
        theirPosition: 'Need to reference engagement for marketing',
        yourResponse: 'Client name and work details should remain confidential',
        fallback: 'Allow anonymized case studies or industry references only'
      },
      {
        topic: 'If client wants work product ownership',
        theirPosition: 'They paid for it, they own it',
        yourResponse: 'This is an NDA, not an IP assignment agreement',
        fallback: 'Address ownership in the separate engagement agreement'
      }
    ],

    directionVariants: {
      'professional-to-client': {
        name: 'Professional Protecting Client Info',
        description: 'Client shares information with professional who must protect it',
        ndaType: 'one-way',
        focus: 'Staff access, subcontractors, professional duties, return of files'
      },
      'client-to-professional': {
        name: 'Client Protecting Own Info',
        description: 'Client engages professional but wants to protect business information',
        ndaType: 'one-way',
        focus: 'Security baseline, portfolio restrictions, breach notification'
      }
    },

    professionalTypes: [
      {
        type: 'attorney',
        specialConsiderations: 'Existing attorney-client privilege may overlap; bar rules on confidentiality'
      },
      {
        type: 'accountant-cpa',
        specialConsiderations: 'CPA confidentiality rules; SEC/regulatory disclosure requirements'
      },
      {
        type: 'consultant',
        specialConsiderations: 'May work with competitors; portfolio/case study restrictions'
      },
      {
        type: 'agency',
        specialConsiderations: 'Multiple staff involvement; client roster confidentiality'
      }
    ],

    industryVariants: ['legal', 'accounting', 'consulting', 'marketing'],
    relatedScenarios: ['contractor', 'business-deal']
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a preset by ID
 * @param {string} presetId - The preset ID to retrieve
 * @returns {object|null} The preset object or null if not found
 */
function getPreset(presetId) {
  return NDA_PRESETS[presetId] || null;
}

/**
 * Get all preset IDs
 * @returns {string[]} Array of preset IDs
 */
function getAllPresetIds() {
  return Object.keys(NDA_PRESETS);
}

/**
 * Get presets filtered by risk level
 * @param {string} riskLevel - Risk level to filter by ('standard', 'elevated', 'high', 'critical', 'personal')
 * @returns {object[]} Array of matching presets
 */
function getPresetsByRiskLevel(riskLevel) {
  return Object.values(NDA_PRESETS).filter(p => p.riskLevel === riskLevel);
}

/**
 * Get presets that include a specific suggested clause
 * @param {string} clauseId - The clause ID to search for
 * @returns {object[]} Array of matching presets
 */
function getPresetsWithClause(clauseId) {
  return Object.values(NDA_PRESETS).filter(preset =>
    preset.suggestedClauses.some(c => c.id === clauseId)
  );
}

/**
 * Apply preset defaults to the NDA generator form
 * @param {string} presetId - The preset ID to apply
 */
function applyPreset(presetId) {
  const preset = getPreset(presetId);
  if (!preset) {
    console.error(`Preset not found: ${presetId}`);
    return;
  }

  const defaults = preset.defaults;

  // Set NDA type
  if (typeof setNdaType === 'function') {
    setNdaType(defaults.ndaType);
  }

  // Set protection levels
  const breadthSlider = document.getElementById('protectionBreadth');
  const strictnessSlider = document.getElementById('protectionStrictness');
  if (breadthSlider) breadthSlider.value = defaults.protectionBreadth;
  if (strictnessSlider) strictnessSlider.value = defaults.protectionStrictness;
  if (typeof updateProtectionLevel === 'function') {
    updateProtectionLevel();
  }

  // Set purpose
  if (defaults.purpose !== 'custom') {
    const purposePill = document.querySelector(`input[name="purpose"][value="${defaults.purpose}"]`);
    if (purposePill) {
      purposePill.checked = true;
      const label = purposePill.closest('.pill-option');
      if (label && typeof selectPurpose === 'function') {
        selectPurpose(label, defaults.purpose);
      }
    }
  } else if (defaults.customPurpose) {
    const customPurposePill = document.querySelector('input[name="purpose"][value="custom"]');
    if (customPurposePill) {
      customPurposePill.checked = true;
      const label = customPurposePill.closest('.pill-option');
      if (label && typeof selectPurpose === 'function') {
        selectPurpose(label, 'custom');
      }
    }
    const customPurposeInput = document.getElementById('customPurpose');
    if (customPurposeInput) customPurposeInput.value = defaults.customPurpose;
  }

  // Set term and survival years
  const termInput = document.getElementById('termYears');
  const survivalInput = document.getElementById('survivalYears');
  if (termInput) termInput.value = defaults.termYears;
  if (survivalInput) survivalInput.value = defaults.survivalYears;

  // Set governing state
  const stateSelect = document.getElementById('governingState');
  if (stateSelect) stateSelect.value = defaults.governingState;

  // Set party entity types
  const partyAEntity = document.getElementById('partyAEntity');
  const partyBEntity = document.getElementById('partyBEntity');
  if (partyAEntity) partyAEntity.value = defaults.partyAEntity;
  if (partyBEntity) partyBEntity.value = defaults.partyBEntity;

  // Set party states
  const partyAState = document.getElementById('partyAState');
  const partyBState = document.getElementById('partyBState');
  if (partyAState) partyAState.value = defaults.partyAState;
  if (partyBState && defaults.partyBState) partyBState.value = defaults.partyBState;

  // Set optional clauses
  const clauseMapping = {
    clauseMarking: 'clauseMarking',
    clauseNonSolicitation: 'clauseNonSolicitation',
    clauseNonCircumvention: 'clauseNonCircumvention',
    clauseResiduals: 'clauseResiduals',
    clauseReturnMaterials: 'clauseReturnMaterials',
    clauseNoLicense: 'clauseNoLicense',
    clauseStandstill: 'clauseStandstill'
  };

  Object.entries(clauseMapping).forEach(([key, elementId]) => {
    const checkbox = document.getElementById(elementId);
    if (checkbox) {
      checkbox.checked = defaults[key];
    }
  });

  // Show/hide standstill toggle for M&A scenarios
  const standstillToggle = document.getElementById('standstillToggle');
  if (standstillToggle) {
    standstillToggle.style.display = (presetId === 'ma-diligence') ? 'block' : 'none';
  }

  // Update preview
  if (typeof updatePreview === 'function') {
    updatePreview();
  }

  console.log(`Applied preset: ${preset.name}`);
}

/**
 * Get tips for a specific preset
 * @param {string} presetId - The preset ID
 * @returns {string[]} Array of tips
 */
function getPresetTips(presetId) {
  const preset = getPreset(presetId);
  return preset ? preset.tips : [];
}

/**
 * Get common traps for a specific preset
 * @param {string} presetId - The preset ID
 * @returns {object[]} Array of trap objects
 */
function getPresetTraps(presetId) {
  const preset = getPreset(presetId);
  return preset ? preset.commonTraps : [];
}

/**
 * Get negotiation points for a specific preset
 * @param {string} presetId - The preset ID
 * @returns {object[]} Array of negotiation point objects
 */
function getPresetNegotiationPoints(presetId) {
  const preset = getPreset(presetId);
  return preset ? preset.negotiationPoints : [];
}

/**
 * Get required clauses for a specific preset
 * @param {string} presetId - The preset ID
 * @returns {object[]} Array of required clause objects
 */
function getRequiredClauses(presetId) {
  const preset = getPreset(presetId);
  if (!preset) return [];
  return preset.suggestedClauses.filter(c => c.priority === 'required');
}

/**
 * Get recommended clauses for a specific preset
 * @param {string} presetId - The preset ID
 * @returns {object[]} Array of recommended clause objects
 */
function getRecommendedClauses(presetId) {
  const preset = getPreset(presetId);
  if (!preset) return [];
  return preset.suggestedClauses.filter(c => c.priority === 'recommended');
}

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NDA_PRESETS,
    getPreset,
    getAllPresetIds,
    getPresetsByRiskLevel,
    getPresetsWithClause,
    applyPreset,
    getPresetTips,
    getPresetTraps,
    getPresetNegotiationPoints,
    getRequiredClauses,
    getRecommendedClauses
  };
}
