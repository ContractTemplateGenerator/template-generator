const { useState, useRef, useEffect } = React;

const TaxCalculator = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const previewRef = useRef(null);
  
  const [formData, setFormData] = useState({
    // Basic information
    annualIncome: 75000,
    workingState: 'CA',
    filingStatus: 'single',
    taxYear: '2024',
    dependents: 0,
    
    // Work schedule
    hoursPerDay: 8,
    daysPerWeek: 5,
    vacationDays: 15,
    
    // W-2 specific
    healthInsuranceCost: 0,
    employerContribution401k: 3,
    personalContribution401k: 6,
    fsaContribution: 0,
    otherW2Benefits: 0,
    
    // 1099 specific
    businessExpenses: 0,
    healthInsuranceDeduction: 0,
    officeExpenses: 0,
    equipmentCosts: 0,
    travelExpenses: 0,
    professionalDevelopment: 0,
    retirementPlanType: 'none',
    retirementContribution: 0,
    
    // Advanced options
    selfEmploymentTaxDeduction: true,
    qbiDeduction: true,
    section179Deduction: false
  });
  // Enhanced tax calculations with 2024/2023 support
  const getTaxBrackets = (year, filingStatus) => {
    const brackets = {
      '2024': {
        single: [
          { min: 0, max: 11600, rate: 0.10 },
          { min: 11600, max: 47150, rate: 0.12 },
          { min: 47150, max: 100525, rate: 0.22 },
          { min: 100525, max: 191950, rate: 0.24 },
          { min: 191950, max: 243725, rate: 0.32 },
          { min: 243725, max: 609350, rate: 0.35 },
          { min: 609350, max: Infinity, rate: 0.37 }
        ],
        marriedJoint: [
          { min: 0, max: 23200, rate: 0.10 },
          { min: 23200, max: 94300, rate: 0.12 },
          { min: 94300, max: 201050, rate: 0.22 },
          { min: 201050, max: 383900, rate: 0.24 },
          { min: 383900, max: 487450, rate: 0.32 },
          { min: 487450, max: 731200, rate: 0.35 },
          { min: 731200, max: Infinity, rate: 0.37 }
        ]
      },
      '2023': {
        single: [
          { min: 0, max: 11000, rate: 0.10 },
          { min: 11000, max: 44725, rate: 0.12 },
          { min: 44725, max: 95375, rate: 0.22 },
          { min: 95375, max: 182050, rate: 0.24 },
          { min: 182050, max: 231250, rate: 0.32 },
          { min: 231250, max: 578125, rate: 0.35 },
          { min: 578125, max: Infinity, rate: 0.37 }
        ],
        marriedJoint: [
          { min: 0, max: 22000, rate: 0.10 },
          { min: 22000, max: 89450, rate: 0.12 },
          { min: 89450, max: 190750, rate: 0.22 },
          { min: 190750, max: 364200, rate: 0.24 },
          { min: 364200, max: 462500, rate: 0.32 },
          { min: 462500, max: 693750, rate: 0.35 },
          { min: 693750, max: Infinity, rate: 0.37 }
        ]
      }
    };
    return brackets[year][filingStatus] || brackets['2024']['single'];
  };
  
  const getStandardDeduction = (year, filingStatus) => {
    const deductions = {
      '2024': { single: 14600, marriedJoint: 29200 },
      '2023': { single: 13850, marriedJoint: 27700 }
    };
    return deductions[year][filingStatus] || 14600;
  };
  const calculateFederalTax = (taxableIncome, year, filingStatus) => {
    const brackets = getTaxBrackets(year, filingStatus);
    let tax = 0;
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableAtBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        tax += taxableAtBracket * bracket.rate;
      }
    }
    return tax;
  };
  
  const calculateStateTax = (income, state) => {
    const rates = {
      'CA': 0.093, 'TX': 0, 'FL': 0, 'NY': 0.08, 'WA': 0,
      'OR': 0.075, 'NV': 0, 'CO': 0.044, 'IL': 0.0495, 'PA': 0.0307
    };
    return income * (rates[state] || 0.05);
  };
  
  // Calculate working hours and effective rates
  const calculateWorkingHours = () => {
    const workingDaysPerYear = formData.daysPerWeek * 52 - formData.vacationDays;
    const totalHours = workingDaysPerYear * formData.hoursPerDay;
    const effectiveHourlyRate = formData.annualIncome / totalHours;
    return { workingDaysPerYear, totalHours, effectiveHourlyRate };
  };
  
  const workingHours = calculateWorkingHours();
  // Enhanced W-2 calculation with FSA and comprehensive benefits
  const calculateW2Taxes = () => {
    const income = parseFloat(formData.annualIncome) || 0;
    const healthInsurance = parseFloat(formData.healthInsuranceCost) || 0;
    const employer401k = parseFloat(formData.employerContribution401k) || 0;
    const personal401k = parseFloat(formData.personalContribution401k) || 0;
    const fsaContribution = parseFloat(formData.fsaContribution) || 0;
    const otherBenefits = parseFloat(formData.otherW2Benefits) || 0;
    const dependents = parseFloat(formData.dependents) || 0;
    
    // Pre-tax deductions
    const employer401kMatch = (income * employer401k) / 100;
    const personal401kContrib = (income * personal401k) / 100;
    const preTaxDeductions = personal401kContrib + fsaContribution + healthInsurance;
    
    // Adjusted gross income after pre-tax deductions
    const adjustedGrossIncome = income - preTaxDeductions;
    
    // Payroll taxes (employee portion only)
    const socialSecurityTax = Math.min(adjustedGrossIncome, 160200) * 0.062;
    const medicareTax = adjustedGrossIncome * 0.0145;
    const additionalMedicareTax = adjustedGrossIncome > 200000 ? (adjustedGrossIncome - 200000) * 0.009 : 0;
    
    // Standard deduction and child tax credit
    const standardDeduction = getStandardDeduction(formData.taxYear, formData.filingStatus);
    const childTaxCredit = dependents * 2000;
    
    // Taxable income
    const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);
    
    // Federal and state taxes
    const federalTaxBeforeCredits = calculateFederalTax(taxableIncome, formData.taxYear, formData.filingStatus);
    const federalTax = Math.max(0, federalTaxBeforeCredits - childTaxCredit);
    const stateTax = calculateStateTax(taxableIncome, formData.workingState);
    
    // Total calculations
    const totalTaxes = federalTax + stateTax + socialSecurityTax + medicareTax + additionalMedicareTax;
    const netIncome = income - totalTaxes - preTaxDeductions;
    const totalCompensation = netIncome + employer401kMatch + otherBenefits + fsaContribution;
    
    return {
      grossIncome: income,
      preTaxDeductions,
      adjustedGrossIncome,
      federalTax,
      stateTax,
      socialSecurityTax,
      medicareTax,
      totalTaxes,
      netIncome,
      totalCompensation,
      effectiveTaxRate: (totalTaxes / income * 100),
      employer401kMatch,
      benefits: employer401kMatch + otherBenefits + fsaContribution,
      childTaxCredit,
      fsaContribution
    };
  };
  // Enhanced 1099 calculation with retirement planning and business deductions
  const calculate1099Taxes = () => {
    const income = parseFloat(formData.annualIncome) || 0;
    const businessExpenses = parseFloat(formData.businessExpenses) || 0;
    const healthInsurance = parseFloat(formData.healthInsuranceDeduction) || 0;
    const officeExpenses = parseFloat(formData.officeExpenses) || 0;
    const equipmentCosts = parseFloat(formData.equipmentCosts) || 0;
    const travelExpenses = parseFloat(formData.travelExpenses) || 0;
    const professionalDev = parseFloat(formData.professionalDevelopment) || 0;
    const retirementContrib = parseFloat(formData.retirementContribution) || 0;
    const dependents = parseFloat(formData.dependents) || 0;
    
    // Section 179 deduction for equipment
    const section179Deduction = formData.section179Deduction ? Math.min(equipmentCosts, 1160000) : 0;
    const remainingEquipmentCosts = formData.section179Deduction ? 0 : equipmentCosts;
    
    // Total business deductions
    const totalBusinessDeductions = businessExpenses + healthInsurance + officeExpenses + 
      remainingEquipmentCosts + travelExpenses + professionalDev + section179Deduction;
    
    // Net earnings from self-employment
    const netEarnings = income - totalBusinessDeductions;
    
    // Self-employment tax
    const selfEmploymentTaxableIncome = netEarnings * 0.9235;
    const socialSecuritySE = Math.min(selfEmploymentTaxableIncome, 160200) * 0.124;
    const medicareSE = selfEmploymentTaxableIncome * 0.029;
    const additionalMedicareSE = selfEmploymentTaxableIncome > 200000 ? (selfEmploymentTaxableIncome - 200000) * 0.009 : 0;
    const totalSelfEmploymentTax = socialSecuritySE + medicareSE + additionalMedicareSE;
    
    // Deductions
    const selfEmploymentTaxDeduction = formData.selfEmploymentTaxDeduction ? totalSelfEmploymentTax * 0.5 : 0;
    
    // Retirement plan limits
    let maxRetirementContrib = 0;
    if (formData.retirementPlanType === 'sepira') {
      maxRetirementContrib = Math.min(netEarnings * 0.25, 69000);
    } else if (formData.retirementPlanType === 'solo401k') {
      const employeeContrib = Math.min(netEarnings, 23000);
      const employerContrib = Math.min(netEarnings * 0.25, 69000 - employeeContrib);
      maxRetirementContrib = employeeContrib + employerContrib;
    }
    const actualRetirementContrib = Math.min(retirementContrib, maxRetirementContrib);
    
    // QBI deduction
    const qbiDeduction = formData.qbiDeduction ? Math.min(netEarnings * 0.2, netEarnings * 0.2) : 0;
    
    // AGI and taxable income
    const standardDeduction = getStandardDeduction(formData.taxYear, formData.filingStatus);
    const adjustedGrossIncome = netEarnings - selfEmploymentTaxDeduction - actualRetirementContrib;
    const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction - qbiDeduction);
    
    // Taxes
    const childTaxCredit = dependents * 2000;
    const federalTaxBeforeCredits = calculateFederalTax(taxableIncome, formData.taxYear, formData.filingStatus);
    const federalTax = Math.max(0, federalTaxBeforeCredits - childTaxCredit);
    const stateTax = calculateStateTax(taxableIncome, formData.workingState);
    const totalTaxes = federalTax + stateTax + totalSelfEmploymentTax;
    
    // Final calculations
    const netIncome = income - totalTaxes - totalBusinessDeductions - actualRetirementContrib;
    const quarterlyPayment = totalTaxes / 4;
    return {
      grossIncome: income,
      businessDeductions: totalBusinessDeductions,
      netEarnings,
      adjustedGrossIncome,
      federalTax,
      stateTax,
      selfEmploymentTax: totalSelfEmploymentTax,
      totalTaxes,
      netIncome,
      effectiveTaxRate: (totalTaxes / income * 100),
      qbiDeduction,
      selfEmploymentTaxDeduction,
      retirementContribution: actualRetirementContrib,
      maxRetirementContrib,
      quarterlyPayment,
      childTaxCredit,
      section179Deduction
    };
  };
  
  // Calculate both scenarios
  const w2Results = calculateW2Taxes();
  const c1099Results = calculate1099Taxes();
  
  // Form handling
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  // Enhanced document generation with side-by-side table format
  const generateDocumentText = () => {
    const w2 = w2Results;
    const c1099 = c1099Results;
    const difference = c1099.netIncome - w2.netIncome;
    
    return `1099 vs W-2 TAX COMPARISON ANALYSIS

Basic Information:
Tax Year: ${formData.taxYear}
Filing Status: ${formData.filingStatus === 'single' ? 'Single' : 'Married Filing Jointly'}
State: ${formData.workingState}
Dependents: ${formData.dependents}
Annual Income: $${formData.annualIncome.toLocaleString()}

Work Schedule Analysis:
Working Days per Year: ${workingHours.workingDaysPerYear}
Total Working Hours: ${workingHours.totalHours.toLocaleString()}
Effective Hourly Rate: $${workingHours.effectiveHourlyRate.toFixed(2)}

===================================================================================
|                              SIDE-BY-SIDE COMPARISON                            |
===================================================================================
| Gross Income | $${w2.grossIncome.toLocaleString()} | $${c1099.grossIncome.toLocaleString()} |
| Deductions | $${w2.preTaxDeductions.toLocaleString()} | $${c1099.businessDeductions.toLocaleString()} |
| Federal Income Tax | $${w2.federalTax.toLocaleString()} | $${c1099.federalTax.toLocaleString()} |
| State Income Tax | $${w2.stateTax.toLocaleString()} | $${c1099.stateTax.toLocaleString()} |
| Payroll/SE Tax | $${(w2.socialSecurityTax + w2.medicareTax).toLocaleString()} | $${c1099.selfEmploymentTax.toLocaleString()} |
| Total Taxes | $${w2.totalTaxes.toLocaleString()} | $${c1099.totalTaxes.toLocaleString()} |
| NET INCOME | $${w2.netIncome.toLocaleString()} | $${c1099.netIncome.toLocaleString()} |
| Effective Tax Rate | ${w2.effectiveTaxRate.toFixed(2)}% | ${c1099.effectiveTaxRate.toFixed(2)}% |
===================================================================================

W-2 EMPLOYEE DETAILS:
• Pre-Tax Deductions: $${w2.preTaxDeductions.toLocaleString()}
  - 401(k) Contribution: $${((w2.grossIncome * formData.personalContribution401k) / 100).toLocaleString()}
  - FSA Contribution: $${w2.fsaContribution.toLocaleString()}
  - Health Insurance: $${formData.healthInsuranceCost.toLocaleString()}
• Employer Benefits: $${w2.benefits.toLocaleString()}
  - 401(k) Match: $${w2.employer401kMatch.toLocaleString()}
  - Other Benefits: $${formData.otherW2Benefits.toLocaleString()}
• Total Compensation Package: $${w2.totalCompensation.toLocaleString()}

1099 CONTRACTOR DETAILS:
• Business Deductions: $${c1099.businessDeductions.toLocaleString()}
• Tax Advantages:
  - QBI Deduction: $${c1099.qbiDeduction.toLocaleString()}
  - SE Tax Deduction: $${c1099.selfEmploymentTaxDeduction.toLocaleString()}
  - Retirement Contribution: $${c1099.retirementContribution.toLocaleString()}
  - Plan Type: ${formData.retirementPlanType === 'none' ? 'None Selected' : formData.retirementPlanType === 'sepira' ? 'SEP-IRA' : 'Solo 401(k)'}
• Quarterly Payment: $${c1099.quarterlyPayment.toLocaleString()}

FINANCIAL IMPACT SUMMARY:
Net Income Difference: $${difference.toLocaleString()} ${difference >= 0 ? '(1099 advantage)' : '(W-2 advantage)'}
Tax Burden Difference: $${(c1099.totalTaxes - w2.totalTaxes).toLocaleString()}
Effective Tax Rate Difference: ${(c1099.effectiveTaxRate - w2.effectiveTaxRate).toFixed(2)}%

IMPORTANT CONSIDERATIONS:
• 1099 contractors pay double the self-employment taxes (15.3% vs 7.65%)
• Contractors have extensive business deduction opportunities
• W-2 employees receive employer benefits and automatic tax withholding
• Quarterly estimated payments required for 1099 contractors
• Enhanced retirement contribution limits available for contractors

Generated by terms.law Tax Calculator - ${new Date().toLocaleDateString()}`;
  };
  const documentText = generateDocumentText();
  
  // Utility functions
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      alert('Tax comparison copied to clipboard!');
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = documentText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Tax comparison copied to clipboard!');
      } catch (fallbackErr) {
        alert('Copy failed. Please try again or use the download option.');
      }
      document.body.removeChild(textArea);
    }
  };
  
  const downloadAsWord = () => {
    try {
      if (!documentText) {
        alert("Cannot generate document - analysis is empty.");
        return;
      }
      window.generateWordDoc(documentText, {
        documentTitle: "1099 vs W-2 Tax Analysis",
        fileName: "1099-vs-W2-Tax-Analysis"
      });
    } catch (error) {
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Enhanced tab configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'w2', label: 'W-2 Benefits' },
    { id: 'contractor', label: '1099 Expenses' },
    { id: 'retirement', label: 'Retirement' },
    { id: 'analysis', label: 'Analysis' }
  ];
  
  // Navigation
  const nextTab = () => currentTab < tabs.length - 1 && setCurrentTab(currentTab + 1);
  const prevTab = () => currentTab > 0 && setCurrentTab(currentTab - 1);
  const goToTab = (index) => setCurrentTab(index);
  // Component render
  return (
    <div className="container">
      <div className="header">
        <h1>1099 vs W-2 Tax Calculator</h1>
        <p>Comprehensive comparison with FSA, retirement planning, work schedule analysis, and detailed tax insights</p>
      </div>
      
      <div className="main-content">
        {/* Input Panel */}
        <div className="input-panel">
          <div className="tab-navigation">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`tab-button ${currentTab === index ? 'active' : ''}`}
                onClick={() => goToTab(index)}
              >
                {index + 1}. {tab.label}
              </button>
            ))}
          </div>
          
          <div className="tab-content">
            {/* Tab 0: Basic Information */}
            {currentTab === 0 && (
              <div>
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tax Year</label>
                    <select name="taxYear" value={formData.taxYear} onChange={handleChange}>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Filing Status</label>
                    <select name="filingStatus" value={formData.filingStatus} onChange={handleChange}>
                      <option value="single">Single</option>
                      <option value="marriedJoint">Married Filing Jointly</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Annual Income</label>
                  <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Working State</label>
                    <select name="workingState" value={formData.workingState} onChange={handleChange}>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="NY">New York</option>
                      <option value="WA">Washington</option>
                      <option value="OR">Oregon</option>
                      <option value="NV">Nevada</option>
                      <option value="CO">Colorado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Dependents (under 17)</label>
                    <input type="number" name="dependents" value={formData.dependents} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}
            {/* Tab 1: Work Schedule */}
            {currentTab === 1 && (
              <div>
                <h3>Work Schedule Analysis</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hours per Day</label>
                    <input type="number" name="hoursPerDay" value={formData.hoursPerDay} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Days per Week</label>
                    <input type="number" name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Vacation Days per Year</label>
                  <input type="number" name="vacationDays" value={formData.vacationDays} onChange={handleChange} />
                </div>
                <div className="info-box">
                  Working Days: {workingHours.workingDaysPerYear} | 
                  Total Hours: {workingHours.totalHours} | 
                  Effective Rate: ${workingHours.effectiveHourlyRate.toFixed(2)}/hr
                </div>
              </div>
            )}
            
            {/* Tab 2: W-2 Benefits */}
            {currentTab === 2 && (
              <div>
                <h3>W-2 Employee Benefits & Costs</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Health Insurance Cost (employee portion)</label>
                    <input type="number" name="healthInsuranceCost" value={formData.healthInsuranceCost} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>FSA Contribution</label>
                    <input type="number" name="fsaContribution" value={formData.fsaContribution} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employer 401(k) Match (%)</label>
                    <input type="number" name="employerContribution401k" value={formData.employerContribution401k} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Your 401(k) Contribution (%)</label>
                    <input type="number" name="personalContribution401k" value={formData.personalContribution401k} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Other Benefits Value</label>
                  <input type="number" name="otherW2Benefits" value={formData.otherW2Benefits} onChange={handleChange} />
                </div>
              </div>
            )}
            {/* Tab 3: 1099 Expenses */}
            {currentTab === 3 && (
              <div>
                <h3>1099 Business Expenses</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>General Business Expenses</label>
                    <input type="number" name="businessExpenses" value={formData.businessExpenses} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Health Insurance Deduction</label>
                    <input type="number" name="healthInsuranceDeduction" value={formData.healthInsuranceDeduction} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Office Expenses</label>
                    <input type="number" name="officeExpenses" value={formData.officeExpenses} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Equipment Costs</label>
                    <input type="number" name="equipmentCosts" value={formData.equipmentCosts} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Travel Expenses</label>
                    <input type="number" name="travelExpenses" value={formData.travelExpenses} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Professional Development</label>
                    <input type="number" name="professionalDevelopment" value={formData.professionalDevelopment} onChange={handleChange} />
                  </div>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="section179Deduction" checked={formData.section179Deduction} onChange={handleChange} />
                  <label>Use Section 179 for Equipment</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="qbiDeduction" checked={formData.qbiDeduction} onChange={handleChange} />
                  <label>Include QBI Deduction</label>
                </div>
              </div>
            )}
            {/* Tab 4: Retirement Planning */}
            {currentTab === 4 && (
              <div>
                <h3>Retirement Planning (1099 Only)</h3>
                <div className="form-group">
                  <label>Retirement Plan Type</label>
                  <select name="retirementPlanType" value={formData.retirementPlanType} onChange={handleChange}>
                    <option value="none">None</option>
                    <option value="sepira">SEP-IRA</option>
                    <option value="solo401k">Solo 401(k)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Retirement Contribution</label>
                  <input type="number" name="retirementContribution" value={formData.retirementContribution} onChange={handleChange} />
                </div>
                {formData.retirementPlanType !== 'none' && (
                  <div className="info-box">
                    Maximum Allowed: ${c1099Results.maxRetirementContrib.toLocaleString()}<br/>
                    {formData.retirementPlanType === 'sepira' && 'SEP-IRA: Up to 25% of net self-employment income'}
                    {formData.retirementPlanType === 'solo401k' && 'Solo 401(k): Employee + employer contributions'}
                  </div>
                )}
              </div>
            )}
            
            {/* Tab 5: Analysis */}
            {currentTab === 5 && (
              <div>
                <h3>Tax Analysis & Recommendations</h3>
                <div className="summary-box">
                  <h3>Bottom Line Comparison</h3>
                  <p><strong>W-2 Net Income:</strong> ${w2Results.netIncome.toLocaleString()}</p>
                  <p><strong>1099 Net Income:</strong> ${c1099Results.netIncome.toLocaleString()}</p>
                  <p><strong>Difference:</strong> ${(c1099Results.netIncome - w2Results.netIncome).toLocaleString()}</p>
                </div>
                
                <div className="warning-box">
                  <h3>Key Considerations</h3>
                  <p>• 1099: Higher self-employment taxes but more deduction opportunities</p>
                  <p>• W-2: Employer benefits and automatic tax withholding</p>
                  <p>• Quarterly payments required for 1099 contractors</p>
                </div>
                
                <div className="recommendations">
                  <h3>Tax Planning Tips</h3>
                  <ul>
                    <li>Track all business expenses for maximum deductions</li>
                    <li>Consider retirement plan contributions to reduce taxes</li>
                    <li>Set aside 25-30% of 1099 income for taxes</li>
                    <li>Consult a tax professional for personalized advice</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button onClick={prevTab} className={`nav-button ${currentTab === 0 ? 'disabled' : ''}`} disabled={currentTab === 0}>
              <i data-feather="chevron-left"></i> Previous
            </button>
            
            <button onClick={copyToClipboard} className="nav-button" style={{backgroundColor: "#4f46e5", color: "white", border: "none"}}>
              <i data-feather="copy"></i> Copy
            </button>
            
            <button onClick={downloadAsWord} className="nav-button" style={{backgroundColor: "#2563eb", color: "white", border: "none"}}>
              <i data-feather="file-text"></i> Download
            </button>
            
            <button onClick={() => window.open('https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1', '_blank')} className="nav-button" style={{backgroundColor: "#16a34a", color: "white", border: "none"}}>
              <i data-feather="calendar"></i> Consult
            </button>
            
            <button onClick={nextTab} className={`nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`} disabled={currentTab === tabs.length - 1}>
              Next <i data-feather="chevron-right"></i>
            </button>
          </div>
        </div>
        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-content" ref={previewRef}>
            <h2>Live Tax Comparison Results</h2>
            
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>W-2 Employee</th>
                  <th>1099 Contractor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gross Income</td>
                  <td className="amount">${w2Results.grossIncome.toLocaleString()}</td>
                  <td className="amount">${c1099Results.grossIncome.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Deductions</td>
                  <td className="amount">${w2Results.preTaxDeductions.toLocaleString()}</td>
                  <td className="amount">${c1099Results.businessDeductions.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Federal Tax</td>
                  <td className="amount negative">${w2Results.federalTax.toLocaleString()}</td>
                  <td className="amount negative">${c1099Results.federalTax.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>State Tax</td>
                  <td className="amount negative">${w2Results.stateTax.toLocaleString()}</td>
                  <td className="amount negative">${c1099Results.stateTax.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Payroll/SE Tax</td>
                  <td className="amount negative">${(w2Results.socialSecurityTax + w2Results.medicareTax).toLocaleString()}</td>
                  <td className="amount negative">${c1099Results.selfEmploymentTax.toLocaleString()}</td>
                </tr>
                <tr style={{backgroundColor: '#f0f9ff', fontWeight: 'bold'}}>
                  <td>Net Income</td>
                  <td className="amount positive">${w2Results.netIncome.toLocaleString()}</td>
                  <td className="amount positive">${c1099Results.netIncome.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Effective Tax Rate</td>
                  <td className="amount">{w2Results.effectiveTaxRate.toFixed(2)}%</td>
                  <td className="amount">{c1099Results.effectiveTaxRate.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
            <div className="summary-box">
              <h3>Financial Impact Summary</h3>
              <p><strong>Income Difference:</strong> 
                <span className={`amount ${c1099Results.netIncome >= w2Results.netIncome ? 'positive' : 'negative'}`}>
                  ${(c1099Results.netIncome - w2Results.netIncome).toLocaleString()}
                </span>
                {c1099Results.netIncome >= w2Results.netIncome ? ' (1099 advantage)' : ' (W-2 advantage)'}
              </p>
              <p><strong>Tax Burden Difference:</strong> 
                <span className="amount">${(c1099Results.totalTaxes - w2Results.totalTaxes).toLocaleString()}</span>
              </p>
              <p><strong>Quarterly Payment:</strong> ${c1099Results.quarterlyPayment.toLocaleString()}</p>
            </div>
            
            <div className="warning-box">
              <h3>Important Notes</h3>
              <p><strong>W-2 Benefits:</strong> ${w2Results.benefits.toLocaleString()} in employer contributions</p>
              <p><strong>1099 Flexibility:</strong> ${c1099Results.maxRetirementContrib.toLocaleString()} max retirement contribution</p>
              <p><strong>Effective Rates:</strong> W-2: {w2Results.effectiveTaxRate.toFixed(1)}% | 1099: {c1099Results.effectiveTaxRate.toFixed(1)}%</p>
            </div>
            
            <div className="info-box">
              <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. 
              Consult a qualified tax professional for personalized advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<TaxCalculator />, document.getElementById('root'));