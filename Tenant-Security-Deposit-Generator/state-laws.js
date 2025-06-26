// State-Specific Security Deposit Laws Database
const STATE_LAWS = {
    'CA': {
        state: 'California',
        returnDeadline: 21,
        deadlineUnit: 'days',
        citation: 'Civil Code §1950.5',
        penaltyMultiplier: 2,
        penaltyType: 'up to 2x damages plus attorney fees',
        penaltyDescription: 'Up to twice the amount of the security deposit plus attorney fees',
        specificPenalty: 600,
        penaltyCondition: 'bad faith retention',
        interestRequired: false,
        interestRate: null,
        smallClaimsLimit: 10000,
        normalWearDefinition: 'Deterioration that occurs based upon the use for which the rental unit is intended and without negligence, carelessness, accident, or misuse of the premises, equipment, or chattels by the tenant or members of his household, or their invitees or guests.',
        requiredNotifications: [
            'Written notice of forwarding address',
            'Right to request initial inspection'
        ],
        statutoryCitations: {
            main: 'California Civil Code Section 1950.5',
            penalty: 'Civil Code §1950.5(l)',
            normalWear: 'Civil Code §1950.5(e)',
            itemization: 'Civil Code §1950.5(g)'
        },
        keyProvisions: [
            'Landlord must provide itemized statement within 21 days',
            'Failure to return deposit or provide itemization within 21 days forfeits right to withhold any portion',
            'Bad faith retention results in statutory damages up to $600',
            'Normal wear and tear cannot be deducted from security deposit',
            'Tenant must provide forwarding address in writing'
        ]
    },
    'TX': {
        state: 'Texas',
        returnDeadline: 30,
        deadlineUnit: 'days',
        citation: 'Property Code §92.104',
        penaltyMultiplier: 3,
        penaltyType: '3x damages plus attorney fees',
        penaltyDescription: 'Three times the amount wrongfully withheld plus attorney fees and court costs',
        interestRequired: false,
        interestRate: null,
        smallClaimsLimit: 20000,
        normalWearDefinition: 'Normal wear and tear means deterioration that results from the intended use of a dwelling, including breakage or malfunction due to age or deteriorated condition.',
        requiredNotifications: [
            'Written notice of forwarding address'
        ],
        statutoryCitations: {
            main: 'Texas Property Code Section 92.104',
            penalty: 'Property Code §92.104(c)',
            normalWear: 'Property Code §92.104(a)',
            itemization: 'Property Code §92.104(b)'
        },
        keyProvisions: [
            'Landlord must return deposit within 30 days',
            'If deductions made, must provide written description and itemization',
            'Bad faith retention results in liability for 3x the amount plus attorney fees',
            'Presumption of bad faith if landlord retains deposit without itemization',
            'Normal wear and tear cannot be charged to tenant'
        ]
    },
    'NY': {
        state: 'New York',
        returnDeadline: 14,
        deadlineUnit: 'days',
        citation: 'General Obligations Law §7-103',
        penaltyMultiplier: 2,
        penaltyType: '2x damages plus interest',
        penaltyDescription: 'Twice the amount of security deposit plus interest',
        interestRequired: true,
        interestRate: 'prevailing rate',
        smallClaimsLimit: 5000,
        specialConditions: 'Deadline extends to 30 days for leases over 1 year',
        normalWearDefinition: 'Normal wear and tear means deterioration which occurs, based upon the use for which the rental unit is intended, without negligence, carelessness, accident, or abuse of the premises or equipment or chattels by the tenant.',
        requiredNotifications: [
            'Written notice of forwarding address',
            'Right to be present during inspection'
        ],
        statutoryCitations: {
            main: 'New York General Obligations Law Section 7-103',
            penalty: 'GOL §7-103(5)',
            normalWear: 'Multiple Property Law §235-e',
            itemization: 'GOL §7-103(3)'
        },
        keyProvisions: [
            'Return required within 14 days for leases under 1 year, 30 days for longer leases',
            'Must provide itemized statement if any portion withheld',
            'Improper retention results in liability for 2x deposit plus interest',
            'Interest must be paid on deposits for buildings with 6+ units',
            'Tenant has right to be present during move-out inspection'
        ]
    },
    'FL': {
        state: 'Florida',
        returnDeadline: 15,
        deadlineUnit: 'days',
        citation: 'Chapter 83.49',
        penaltyMultiplier: 1,
        penaltyType: 'forfeiture of right to withhold',
        penaltyDescription: 'Forfeiture of right to withhold any portion of deposit',
        interestRequired: false,
        interestRate: null,
        smallClaimsLimit: 8000,
        specialConditions: 'Deadline extends to 30 days if tenant disputes deductions',
        normalWearDefinition: 'Normal wear and tear means deterioration which occurs based upon the use for which the rental unit is intended and without negligence, carelessness, accident, or misuse.',
        requiredNotifications: [
            'Written notice of forwarding address',
            'Notice of intention to impose claim on deposit'
        ],
        statutoryCitations: {
            main: 'Florida Statutes Chapter 83.49',
            penalty: 'F.S. §83.49(3)(a)',
            normalWear: 'F.S. §83.49(1)',
            itemization: 'F.S. §83.49(3)'
        },
        keyProvisions: [
            'Must return deposit within 15 days if no deductions',
            'If claiming deductions, must provide notice within 30 days',
            'Failure to comply forfeits right to withhold any portion',
            'Normal wear and tear cannot be charged to tenant',
            'Detailed procedures for disputing landlord claims'
        ]
    },
    'IL': {
        state: 'Illinois',
        returnDeadline: 45,
        deadlineUnit: 'days',
        citation: '765 ILCS 710',
        penaltyMultiplier: 2,
        penaltyType: '2x damages plus attorney fees',
        penaltyDescription: 'Two times the amount of security deposit plus attorney fees',
        interestRequired: true,
        interestRate: '5% annually',
        smallClaimsLimit: 10000,
        normalWearDefinition: 'Normal wear and tear means deterioration that results from the intended use of the dwelling unit.',
        requiredNotifications: [
            'Written notice of forwarding address',
            'Itemized statement of deductions'
        ],
        statutoryCitations: {
            main: 'Illinois Compiled Statutes 765 ILCS 710',
            penalty: '765 ILCS 710/1(c)',
            normalWear: '765 ILCS 710/1',
            itemization: '765 ILCS 710/1(b)'
        },
        keyProvisions: [
            'Return required within 45 days of termination',
            'Must provide itemized statement for any deductions',
            'Interest required on deposits held over 6 months',
            'Bad faith retention results in 2x damages plus attorney fees',
            'Normal wear and tear cannot be deducted'
        ]
    },
    'WA': {
        state: 'Washington',
        returnDeadline: 21,
        deadlineUnit: 'days',
        citation: 'RCW 59.18.280',
        penaltyMultiplier: 2,
        penaltyType: '2x damages plus court costs',
        penaltyDescription: 'Two times the amount wrongfully withheld plus court costs and attorney fees',
        interestRequired: false,
        interestRate: null,
        smallClaimsLimit: 10000,
        normalWearDefinition: 'Normal wear and tear means deterioration which occurs based upon the use for which the rental unit is intended.',
        requiredNotifications: [
            'Written notice of forwarding address',
            'Written itemization of damages'
        ],
        statutoryCitations: {
            main: 'Revised Code of Washington 59.18.280',
            penalty: 'RCW 59.18.280(2)',
            normalWear: 'RCW 59.18.280(1)',
            itemization: 'RCW 59.18.280(1)'
        },
        keyProvisions: [
            'Return required within 21 days',
            'Written itemization required for any deductions',
            'Bad faith retention results in 2x damages plus costs',
            'Normal wear and tear cannot be charged to tenant',
            'Landlord forfeits right to retain deposit if deadline missed'
        ]
    },
    'MA': {
        state: 'Massachusetts',
        returnDeadline: 30,
        deadlineUnit: 'days',
        citation: 'MGL Chapter 186 §15B',
        penaltyMultiplier: 3,
        penaltyType: '3x damages plus attorney fees',
        penaltyDescription: 'Three times the amount of the security deposit or three times the unpaid balance plus attorney fees and court costs',
        interestRequired: true,
        interestRate: '5% annually',
        smallClaimsLimit: 7000,
        normalWearDefinition: 'Normal wear and tear means deterioration that occurs based upon the use for which the rental unit is intended.',
        requiredNotifications: [
            'Written notice of forwarding address',
            'Itemized list of damages'
        ],
        statutoryCitations: {
            main: 'Massachusetts General Laws Chapter 186 Section 15B',
            penalty: 'MGL c.186 §15B(3)',
            normalWear: 'MGL c.186 §15B',
            itemization: 'MGL c.186 §15B(2)'
        },
        keyProvisions: [
            'Return required within 30 days',
            'Interest required on deposits held over 1 year',
            'Willful violation results in 3x damages plus attorney fees',
            'Detailed itemization required for deductions',
            'Receipt required for security deposit'
        ]
    },
    'PA': {
        state: 'Pennsylvania',
        returnDeadline: 30,
        deadlineUnit: 'days',
        citation: '68 Pa. C.S. §250.512',
        penaltyMultiplier: 2,
        penaltyType: '2x damages',
        penaltyDescription: 'Two times the amount of the security deposit',
        interestRequired: true,
        interestRate: 'passbook savings rate',
        smallClaimsLimit: 12000,
        normalWearDefinition: 'Normal wear and tear means deterioration which occurs based upon the use for which the rental unit is intended.',
        requiredNotifications: [
            'Written notice of forwarding address',
            'Written list of damages'
        ],
        statutoryCitations: {
            main: 'Pennsylvania Consolidated Statutes 68 Pa. C.S. §250.512',
            penalty: '68 Pa. C.S. §250.512(e)',
            normalWear: '68 Pa. C.S. §250.512',
            itemization: '68 Pa. C.S. §250.512(d)'
        },
        keyProvisions: [
            'Return required within 30 days',
            'Interest required for deposits over $100 held over 2 years',
            'Double damages for willful retention',
            'Written itemization required for deductions',
            'Tenant may designate agent to receive deposit'
        ]
    }
};

// Helper functions for state law calculations
const StateLawUtils = {
    calculateDeadlinePassed: (moveOutDate, state) => {
        if (!moveOutDate || !state || !STATE_LAWS[state]) return 0;
        
        const moveOut = new Date(moveOutDate);
        const today = new Date();
        const daysPassed = Math.floor((today - moveOut) / (1000 * 60 * 60 * 24));
        const deadline = STATE_LAWS[state].returnDeadline;
        
        return Math.max(0, daysPassed - deadline);
    },
    
    calculatePenaltyAmount: (depositAmount, state, daysPassed) => {
        if (!depositAmount || !state || !STATE_LAWS[state]) return 0;
        
        const stateData = STATE_LAWS[state];
        const deposit = parseFloat(depositAmount) || 0;
        
        if (daysPassed > 0) {
            if (stateData.specificPenalty) {
                return Math.min(stateData.specificPenalty, deposit * stateData.penaltyMultiplier);
            }
            return deposit * stateData.penaltyMultiplier;
        }
        
        return 0;
    },
    
    calculateInterest: (depositAmount, state, daysHeld) => {
        if (!depositAmount || !state || !STATE_LAWS[state]) return 0;
        
        const stateData = STATE_LAWS[state];
        if (!stateData.interestRequired) return 0;
        
        const deposit = parseFloat(depositAmount) || 0;
        const years = daysHeld / 365;
        
        // Default 5% if rate is not specified
        let rate = 0.05;
        if (stateData.interestRate === 'prevailing rate') rate = 0.03;
        if (stateData.interestRate === 'passbook savings rate') rate = 0.02;
        if (typeof stateData.interestRate === 'string' && stateData.interestRate.includes('%')) {
            rate = parseFloat(stateData.interestRate) / 100;
        }
        
        return deposit * rate * years;
    },
    
    calculateTotalDemand: (formData, state) => {
        const deposit = parseFloat(formData.securityDeposit) || 0;
        const petDeposit = parseFloat(formData.petDeposit) || 0;
        const cleaningDeposit = parseFloat(formData.cleaningDeposit) || 0;
        const totalDeposits = deposit + petDeposit + cleaningDeposit;
        
        const daysPassed = StateLawUtils.calculateDeadlinePassed(formData.moveOutDate, state);
        const penalty = StateLawUtils.calculatePenaltyAmount(totalDeposits, state, daysPassed);
        const interest = StateLawUtils.calculateInterest(totalDeposits, state, daysPassed + (STATE_LAWS[state]?.returnDeadline || 30));
        
        return {
            deposits: totalDeposits,
            penalty: penalty,
            interest: interest,
            total: totalDeposits + penalty + interest,
            daysPassed: daysPassed
        };
    },
    
    getRiskAssessment: (formData, state) => {
        const daysPassed = StateLawUtils.calculateDeadlinePassed(formData.moveOutDate, state);
        const hasItemization = formData.itemizedStatementReceived !== 'not-received';
        const hasEvidence = Object.keys(formData).some(key => 
            key.startsWith('evidence') && formData[key] === true
        );
        
        let score = 0;
        let factors = [];
        
        // Timeline factors
        if (daysPassed > 30) {
            score += 3;
            factors.push('Significantly past legal deadline');
        } else if (daysPassed > 0) {
            score += 2;
            factors.push('Past legal deadline');
        }
        
        // Evidence factors
        if (!hasItemization) {
            score += 2;
            factors.push('No itemization provided');
        }
        
        if (hasEvidence) {
            score += 1;
            factors.push('Supporting evidence available');
        }
        
        // Determine risk level
        let level = 'low';
        let color = 'green';
        if (score >= 5) {
            level = 'high';
            color = 'green'; // High chance of success
        } else if (score >= 3) {
            level = 'medium';
            color = 'yellow';
        } else {
            level = 'low';
            color = 'red';
        }
        
        return {
            level: level,
            color: color,
            score: score,
            factors: factors,
            recommendation: level === 'high' ? 'Strong case for recovery' :
                          level === 'medium' ? 'Moderate chance of success' :
                          'Consider gathering more evidence'
        };
    }
};

// Export for use in main component
window.STATE_LAWS = STATE_LAWS;
window.StateLawUtils = StateLawUtils;