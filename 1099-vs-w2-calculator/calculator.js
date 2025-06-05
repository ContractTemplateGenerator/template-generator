const { useState, useRef, useEffect } = React;

const TaxCalculator = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const previewRef = useRef(null);
  
  const [formData, setFormData] = useState({
    // Basic income information
    annualIncome: 75000,
    workingState: 'CA',
    filingStatus: 'single',
    
    // W-2 specific
    healthInsuranceCost: 0,
    employerContribution401k: 0,
    otherW2Benefits: 0,
    
    // 1099 specific
    businessExpenses: 0,
    healthInsuranceDeduction: 0,
    officeRent: 0,
    equipmentCosts: 0,
    travelExpenses: 0,
    
    // Additional considerations
    selfEmploymentTaxDeduction: true,
    qbiDeduction: true,
    estimatedQuarterlyPayments: true
  });
  // Tax calculation functions
  const calculateFederalTax = (taxableIncome, filingStatus) => {
    // 2024 Federal Tax Brackets
    const brackets = {
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
    };
    
    const applicableBrackets = brackets[filingStatus] || brackets.single;
    let tax = 0;
    
    for (const bracket of applicableBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableAtBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        tax += taxableAtBracket * bracket.rate;
      }
    }
    
    return tax;
  };
  
  const calculateStateTax = (income, state) => {
    // Simplified state tax rates
    const stateTaxRates = {
      'CA': 0.093, // California approximate effective rate
      'TX': 0,     // No state income tax
      'FL': 0,     // No state income tax
      'NY': 0.08,  // New York approximate
      'WA': 0      // No state income tax
    };
    
    return income * (stateTaxRates[state] || 0.05);
  };
  // W-2 Employee Tax Calculation
  const calculateW2Taxes = () => {
    const income = parseFloat(formData.annualIncome) || 0;
    const healthInsurance = parseFloat(formData.healthInsuranceCost) || 0;
    const employer401k = parseFloat(formData.employerContribution401k) || 0;
    const otherBenefits = parseFloat(formData.otherW2Benefits) || 0;
    
    // Standard deduction for 2024
    const standardDeduction = formData.filingStatus === 'marriedJoint' ? 29200 : 14600;
    
    // Social Security and Medicare taxes (employee portion)
    const socialSecurityTax = Math.min(income, 160200) * 0.062; // SS cap at $160,200
    const medicareTax = income * 0.0145;
    const additionalMedicareTax = income > 200000 ? (income - 200000) * 0.009 : 0;
    
    // Taxable income after standard deduction
    const taxableIncome = Math.max(0, income - standardDeduction);
    
    // Federal income tax
    const federalTax = calculateFederalTax(taxableIncome, formData.filingStatus);
    
    // State tax
    const stateTax = calculateStateTax(taxableIncome, formData.workingState);
    
    // Total taxes
    const totalTaxes = federalTax + stateTax + socialSecurityTax + medicareTax + additionalMedicareTax;
    
    // Net income (after taxes but including benefits)
    const netIncome = income - totalTaxes + employer401k + otherBenefits;
    
    return {
      grossIncome: income,
      federalTax,
      stateTax,
      socialSecurityTax,
      medicareTax,
      additionalMedicareTax,
      totalTaxes,
      netIncome,
      effectiveTaxRate: (totalTaxes / income * 100),
      benefits: employer401k + otherBenefits,
      payrollTaxes: socialSecurityTax + medicareTax + additionalMedicareTax
    };
  };
  // 1099 Contractor Tax Calculation
  const calculate1099Taxes = () => {
    const income = parseFloat(formData.annualIncome) || 0;
    const businessExpenses = parseFloat(formData.businessExpenses) || 0;
    const healthInsurance = parseFloat(formData.healthInsuranceDeduction) || 0;
    const officeRent = parseFloat(formData.officeRent) || 0;
    const equipmentCosts = parseFloat(formData.equipmentCosts) || 0;
    const travelExpenses = parseFloat(formData.travelExpenses) || 0;
    
    // Total business deductions
    const totalBusinessDeductions = businessExpenses + healthInsurance + officeRent + equipmentCosts + travelExpenses;
    
    // Net earnings from self-employment
    const netEarnings = income - totalBusinessDeductions;
    
    // Self-employment tax (both employer and employee portions)
    const selfEmploymentTaxableIncome = netEarnings * 0.9235; // 92.35% of net earnings
    const socialSecuritySE = Math.min(selfEmploymentTaxableIncome, 160200) * 0.124; // Both portions
    const medicareSE = selfEmploymentTaxableIncome * 0.029; // Both portions
    const additionalMedicareSE = selfEmploymentTaxableIncome > 200000 ? (selfEmploymentTaxableIncome - 200000) * 0.009 : 0;
    const totalSelfEmploymentTax = socialSecuritySE + medicareSE + additionalMedicareSE;
    
    // Deduction for half of self-employment tax
    const selfEmploymentTaxDeduction = formData.selfEmploymentTaxDeduction ? totalSelfEmploymentTax * 0.5 : 0;
    
    // QBI deduction (up to 20% of qualified business income)
    const qbiDeduction = formData.qbiDeduction ? Math.min(netEarnings * 0.2, netEarnings * 0.2) : 0;
    
    // Standard deduction
    const standardDeduction = formData.filingStatus === 'marriedJoint' ? 29200 : 14600;
    
    // Adjusted Gross Income
    const adjustedGrossIncome = netEarnings - selfEmploymentTaxDeduction;
    
    // Taxable income
    const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction - qbiDeduction);
    
    // Federal income tax
    const federalTax = calculateFederalTax(taxableIncome, formData.filingStatus);
    
    // State tax
    const stateTax = calculateStateTax(taxableIncome, formData.workingState);
    
    // Total taxes
    const totalTaxes = federalTax + stateTax + totalSelfEmploymentTax;
    
    // Net income
    const netIncome = income - totalTaxes - totalBusinessDeductions;
    
    return {
      grossIncome: income,
      businessDeductions: totalBusinessDeductions,
      netEarnings,
      federalTax,
      stateTax,
      selfEmploymentTax: totalSelfEmploymentTax,
      totalTaxes,
      netIncome,
      effectiveTaxRate: (totalTaxes / income * 100),
      qbiDeduction,
      selfEmploymentTaxDeduction
    };
  };
  // Calculate both scenarios
  const w2Results = calculateW2Taxes();
  const c1099Results = calculate1099Taxes();
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Generate document text for download/copy
  const generateDocumentText = () => {
    const w2 = w2Results;
    const c1099 = c1099Results;
    const difference = c1099.netIncome - w2.netIncome;
    
    return `1099 vs W-2 Tax Burden Comparison Analysis

Annual Income: $${formData.annualIncome.toLocaleString()}
Filing Status: ${formData.filingStatus === 'single' ? 'Single' : 'Married Filing Jointly'}
State: ${formData.workingState}

W-2 EMPLOYEE STATUS:
Gross Income: $${w2.grossIncome.toLocaleString()}
Federal Income Tax: $${w2.federalTax.toLocaleString()}
State Income Tax: $${w2.stateTax.toLocaleString()}
Social Security Tax: $${w2.socialSecurityTax.toLocaleString()}
Medicare Tax: $${w2.medicareTax.toLocaleString()}
Total Taxes: $${w2.totalTaxes.toLocaleString()}
Benefits Value: $${w2.benefits.toLocaleString()}
Net Income: $${w2.netIncome.toLocaleString()}
Effective Tax Rate: ${w2.effectiveTaxRate.toFixed(2)}%

1099 CONTRACTOR STATUS:
Gross Income: $${c1099.grossIncome.toLocaleString()}
Business Deductions: $${c1099.businessDeductions.toLocaleString()}
Net Business Earnings: $${c1099.netEarnings.toLocaleString()}
Federal Income Tax: $${c1099.federalTax.toLocaleString()}
State Income Tax: $${c1099.stateTax.toLocaleString()}
Self-Employment Tax: $${c1099.selfEmploymentTax.toLocaleString()}
Total Taxes: $${c1099.totalTaxes.toLocaleString()}
Net Income: $${c1099.netIncome.toLocaleString()}
Effective Tax Rate: ${c1099.effectiveTaxRate.toFixed(2)}%

COMPARISON SUMMARY:
Difference in Net Income: $${difference.toLocaleString()} ${difference >= 0 ? '(1099 advantage)' : '(W-2 advantage)'}
Tax Difference: $${(c1099.totalTaxes - w2.totalTaxes).toLocaleString()}

This analysis is for educational purposes only. Consult a qualified tax professional for personalized advice.
Generated by terms.law Tax Calculator`;
  };
  const documentText = generateDocumentText();
  
  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      alert('Comparison copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - analysis is empty. Please check the form data.");
        return;
      }
      
      window.generateWordDoc(documentText, {
        documentTitle: "1099 vs W-2 Tax Burden Comparison",
        fileName: "1099-vs-W2-Tax-Comparison"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Tab configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'w2', label: 'W-2 Details' },
    { id: 'contractor', label: '1099 Details' },
    { id: 'summary', label: 'Analysis' }
  ];
  
  // Navigation functions
  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };
  
  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };
  
  const goToTab = (index) => {
    setCurrentTab(index);
  };
  // Render the component
  return (
    <div className="container">
      <div className="header">
        <h1>1099 vs W-2 Tax Burden Calculator</h1>
        <p>Compare the tax implications of contractor (1099) vs employee (W-2) status</p>
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
                <div className="form-group">
                  <label>Annual Income</label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    placeholder="75000"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Filing Status</label>
                    <select
                      name="filingStatus"
                      value={formData.filingStatus}
                      onChange={handleChange}
                    >
                      <option value="single">Single</option>
                      <option value="marriedJoint">Married Filing Jointly</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Working State</label>
                    <select
                      name="workingState"
                      value={formData.workingState}
                      onChange={handleChange}
                    >
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="NY">New York</option>
                      <option value="WA">Washington</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {/* Tab 1: W-2 Employee Details */}
            {currentTab === 1 && (
              <div>
                <h3>W-2 Employee Benefits & Costs</h3>
                <div className="form-group">
                  <label>Annual Health Insurance Cost (if paid by employee)</label>
                  <input
                    type="number"
                    name="healthInsuranceCost"
                    value={formData.healthInsuranceCost}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Employer 401(k) Contribution</label>
                  <input
                    type="number"
                    name="employerContribution401k"
                    value={formData.employerContribution401k}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Other W-2 Benefits Value (vacation, sick leave, etc.)</label>
                  <input
                    type="number"
                    name="otherW2Benefits"
                    value={formData.otherW2Benefits}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="info-box">
                  W-2 employees have taxes automatically withheld and employers pay half of Social Security and Medicare taxes.
                </div>
              </div>
            )}
            
            {/* Tab 2: 1099 Contractor Details */}
            {currentTab === 2 && (
              <div>
                <h3>1099 Contractor Deductions</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>General Business Expenses</label>
                    <input
                      type="number"
                      name="businessExpenses"
                      value={formData.businessExpenses}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Health Insurance Deduction</label>
                    <input
                      type="number"
                      name="healthInsuranceDeduction"
                      value={formData.healthInsuranceDeduction}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Office Rent/Home Office</label>
                    <input
                      type="number"
                      name="officeRent"
                      value={formData.officeRent}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Equipment & Software</label>
                    <input
                      type="number"
                      name="equipmentCosts"
                      value={formData.equipmentCosts}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Travel & Transportation</label>
                  <input
                    type="number"
                    name="travelExpenses"
                    value={formData.travelExpenses}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="selfEmploymentTaxDeduction"
                    checked={formData.selfEmploymentTaxDeduction}
                    onChange={handleChange}
                  />
                  <label>Include Self-Employment Tax Deduction</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="qbiDeduction"
                    checked={formData.qbiDeduction}
                    onChange={handleChange}
                  />
                  <label>Include QBI (Section 199A) Deduction</label>
                </div>
                
                <div className="info-box">
                  1099 contractors pay both employer and employee portions of Social Security and Medicare taxes but can deduct business expenses.
                </div>
              </div>
            )}
            {/* Tab 3: Analysis Summary */}
            {currentTab === 3 && (
              <div>
                <h3>Tax Analysis Summary</h3>
                <div className="summary-box">
                  <h3>Bottom Line</h3>
                  <p><strong>W-2 Net Income:</strong> ${w2Results.netIncome.toLocaleString()}</p>
                  <p><strong>1099 Net Income:</strong> ${c1099Results.netIncome.toLocaleString()}</p>
                  <p><strong>Difference:</strong> ${(c1099Results.netIncome - w2Results.netIncome).toLocaleString()}</p>
                </div>
                
                <div className="warning-box">
                  <h3>Important Considerations</h3>
                  <p>• 1099 contractors must make quarterly estimated tax payments</p>
                  <p>• No employer-provided benefits (health insurance, 401k match, etc.)</p>
                  <p>• Higher tax burden due to self-employment tax</p>
                  <p>• More tax planning opportunities through business deductions</p>
                </div>
                
                <div className="recommendations">
                  <h3>Recommendations</h3>
                  <ul>
                    <li>Track all business expenses for maximum deductions</li>
                    <li>Set aside 25-30% of income for taxes</li>
                    <li>Consider SEP-IRA or Solo 401(k) for retirement savings</li>
                    <li>Consult a tax professional for personalized advice</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <i data-feather="chevron-left"></i>
              Previous
            </button>
            
            <button
              onClick={copyToClipboard}
              className="nav-button"
              style={{
                backgroundColor: "#4f46e5", 
                color: "white",
                border: "none"
              }}
            >
              <i data-feather="copy"></i>
              Copy
            </button>
            
            <button
              onClick={downloadAsWord}
              className="nav-button"
              style={{
                backgroundColor: "#2563eb", 
                color: "white",
                border: "none"
              }}
            >
              <i data-feather="file-text"></i>
              Download
            </button>
            <button
              onClick={() => window.open('https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1', '_blank')}
              className="nav-button"
              style={{
                backgroundColor: "#16a34a", 
                color: "white",
                border: "none"
              }}
            >
              <i data-feather="calendar"></i>
              Consult
            </button>
            
            <button
              onClick={nextTab}
              className={`nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
              disabled={currentTab === tabs.length - 1}
            >
              Next
              <i data-feather="chevron-right"></i>
            </button>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-content" ref={previewRef}>
            <h2>Tax Comparison Results</h2>
            
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Tax Component</th>
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
                  <td>Business Deductions</td>
                  <td className="amount">$0</td>
                  <td className="amount">${c1099Results.businessDeductions.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Federal Income Tax</td>
                  <td className="amount negative">${w2Results.federalTax.toLocaleString()}</td>
                  <td className="amount negative">${c1099Results.federalTax.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>State Income Tax</td>
                  <td className="amount negative">${w2Results.stateTax.toLocaleString()}</td>
                  <td className="amount negative">${c1099Results.stateTax.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Payroll/SE Tax</td>
                  <td className="amount negative">${w2Results.payrollTaxes.toLocaleString()}</td>
                  <td className="amount negative">${c1099Results.selfEmploymentTax.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Total Taxes</td>
                  <td className="amount negative">${w2Results.totalTaxes.toLocaleString()}</td>
                  <td className="amount negative">${c1099Results.totalTaxes.toLocaleString()}</td>
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
              <h3>Financial Impact</h3>
              <p><strong>Difference in Net Income:</strong> 
                <span className={`amount ${c1099Results.netIncome >= w2Results.netIncome ? 'positive' : 'negative'}`}>
                  ${(c1099Results.netIncome - w2Results.netIncome).toLocaleString()}
                </span>
                {c1099Results.netIncome >= w2Results.netIncome ? ' (1099 advantage)' : ' (W-2 advantage)'}
              </p>
              <p><strong>Tax Burden Difference:</strong> 
                <span className={`amount ${c1099Results.totalTaxes <= w2Results.totalTaxes ? 'positive' : 'negative'}`}>
                  ${(c1099Results.totalTaxes - w2Results.totalTaxes).toLocaleString()}
                </span>
              </p>
            </div>
            
            <div className="warning-box">
              <h3>Key Considerations</h3>
              <p><strong>1099 Contractors:</strong> Pay both employer and employee portions of Social Security and Medicare taxes (15.3% vs 7.65% for W-2)</p>
              <p><strong>Business Deductions:</strong> Can significantly reduce taxable income for contractors</p>
              <p><strong>Benefits:</strong> W-2 employees typically receive health insurance, 401(k) matching, and other benefits</p>
              <p><strong>Quarterly Payments:</strong> 1099 contractors must make estimated tax payments throughout the year</p>
            </div>
            
            <div className="info-box">
              <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
              Tax situations vary greatly based on individual circumstances. 
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