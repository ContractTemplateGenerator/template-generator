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
  // Enhanced document generation
  const generateDocumentText = () => {
    const w2 = w2Results;
    const c1099 = c1099Results;
    const difference = c1099.netIncome - w2.netIncome;
    
    return `ADVANCED 1099 vs W-2 TAX COMPARISON ANALYSIS
Tax Year: ${formData.taxYear} | Filing Status: ${formData.filingStatus === 'single' ? 'Single' : 'Married Filing Jointly'}
State: ${formData.workingState} | Dependents: ${formData.dependents}

WORK SCHEDULE ANALYSIS:
Annual Income: $${formData.annualIncome.toLocaleString()}
Working Days per Year: ${workingHours.workingDaysPerYear}
Total Working Hours: ${workingHours.totalHours.toLocaleString()}
Effective Hourly Rate: $${workingHours.effectiveHourlyRate.toFixed(2)}

W-2 EMPLOYEE RESULTS:
Gross Income: $${w2.grossIncome.toLocaleString()}
Pre-Tax Deductions: $${w2.preTaxDeductions.toLocaleString()}
  - 401(k) Contribution: $${((w2.grossIncome * formData.personalContribution401k) / 100).toLocaleString()}
  - FSA Contribution: $${w2.fsaContribution.toLocaleString()}
  - Health Insurance: $${formData.healthInsuranceCost.toLocaleString()}

Tax Breakdown:
Federal Income Tax: $${w2.federalTax.toLocaleString()}
State Income Tax: $${w2.stateTax.toLocaleString()}
Social Security Tax: $${w2.socialSecurityTax.toLocaleString()}
Medicare Tax: $${w2.medicareTax.toLocaleString()}
Total Taxes: $${w2.totalTaxes.toLocaleString()}

Benefits:
Employer 401(k) Match: $${w2.employer401kMatch.toLocaleString()}
Total Benefits Value: $${w2.benefits.toLocaleString()}

Net Take-Home: $${w2.netIncome.toLocaleString()}
Total Compensation: $${w2.totalCompensation.toLocaleString()}
Effective Tax Rate: ${w2.effectiveTaxRate.toFixed(2)}%

1099 CONTRACTOR RESULTS:
Gross Income: $${c1099.grossIncome.toLocaleString()}
Business Deductions: $${c1099.businessDeductions.toLocaleString()}
Net Business Earnings: $${c1099.netEarnings.toLocaleString()}

Tax Breakdown:
Federal Income Tax: $${c1099.federalTax.toLocaleString()}
State Income Tax: $${c1099.stateTax.toLocaleString()}
Self-Employment Tax: $${c1099.selfEmploymentTax.toLocaleString()}
Total Taxes: $${c1099.totalTaxes.toLocaleString()}

Tax Advantages:
QBI Deduction: $${c1099.qbiDeduction.toLocaleString()}
SE Tax Deduction: $${c1099.selfEmploymentTaxDeduction.toLocaleString()}
Retirement Contribution: $${c1099.retirementContribution.toLocaleString()}
Plan Type: ${formData.retirementPlanType === 'none' ? 'None' : formData.retirementPlanType === 'sepira' ? 'SEP-IRA' : 'Solo 401(k)'}

Net Take-Home: $${c1099.netIncome.toLocaleString()}
Effective Tax Rate: ${c1099.effectiveTaxRate.toFixed(2)}%
Quarterly Payment: $${c1099.quarterlyPayment.toLocaleString()}

COMPARISON SUMMARY:
Net Income Difference: $${difference.toLocaleString()} ${difference >= 0 ? '(1099 advantage)' : '(W-2 advantage)'}
Tax Burden Difference: $${(c1099.totalTaxes - w2.totalTaxes).toLocaleString()}

Generated by terms.law Advanced Tax Calculator`;
  };
  const documentText = generateDocumentText();
  
  // Utility functions
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      alert('Advanced tax comparison copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard. Please try again.');
    }
  };
  
  const downloadAsWord = () => {
    try {
      if (!documentText) {
        alert("Cannot generate document - analysis is empty.");
        return;
      }
      window.generateWordDoc(documentText, {
        documentTitle: "Advanced 1099 vs W-2 Tax Analysis",
        fileName: "Advanced-1099-vs-W2-Tax-Analysis"
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
        <h1>Advanced 1099 vs W-2 Tax Calculator</h1>
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