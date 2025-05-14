// California Employment Agreement Generator
// Created for terms.law - Updated May 2025
// A comprehensive tool for creating legally compliant California employment agreements
// Enhanced with California-specific labor law provisions and latest compliance requirements

const App = () => {
  // State for form data
  const [formData, setFormData] = React.useState({
    // Basic Information
    employerName: "",
    employerAddress: "",
    employerEIN: "",
    employeeName: "",
    employeeAddress: "",
    employeeEmail: "",
    employeePhone: "",
    startDate: "",
    position: "",
    reportingTo: "",
    employmentType: "full-time", // full-time, part-time, contract
    isExempt: "non-exempt", // exempt, non-exempt
    workLocation: "office", // office, remote, hybrid
    customWorkLocation: "",
    atWillEmployment: true,
    probationPeriod: "90",
    backgroundCheck: false,
    drugTest: false,
    employmentEligibility: true,

    // Compensation
    compensationType: "salary", // salary, hourly, commission, mixed
    salaryAmount: "",
    salaryPeriod: "annual", // annual, monthly, bi-weekly
    hourlyRate: "",
    overtimeEligible: "yes",
    overtimeRate: "1.5",
    doubleTimeEligible: true,
    mealBreakPremium: true,
    restBreakPremium: true,
    commissionRate: "",
    commissionStructure: "",
    bonusEligible: "no",
    bonusStructure: "",
    equityEligible: "no",
    equityDetails: "",
    paymentFrequency: "bi-weekly", // weekly, bi-weekly, monthly, semi-monthly
    paymentMethod: "direct-deposit", // direct-deposit, check
    expenseReimbursement: true,
    businessExpenses: true,
    travelExpenses: true,
    telecomExpenses: true,
    finalPayoutTerms: "standard", // standard, custom
    customFinalPayoutTerms: "",

    // Benefits
    ptoPolicy: "accrual", // accrual, lump-sum, unlimited, none
    ptoAmount: "10",
    ptoCarryover: true,
    ptoCarryoverLimit: "40",
    ptoAccrualRate: "per-pay-period", // per-pay-period, monthly, annually
    paidHolidays: true,
    sickLeavePolicy: "legal-minimum", // legal-minimum, enhanced, combined-with-pto
    sickLeaveAmount: "3",
    sickLeaveAccrual: true,
    sickLeaveAccrualRate: "1", // Hours per 30 hours worked
    healthInsurance: true,
    healthInsuranceContribution: "standard", // standard, full, custom
    healthInsuranceWaitingPeriod: "first-of-month", // first-of-month, immediate, 30-days, 60-days, 90-days
    healthInsuranceDetails: "Standard company health insurance plan including medical, dental, and vision coverage.",
    retirementPlan: true,
    retirementPlanDetails: "401(k) plan with up to 3% employer match.",
    fmlaEligible: true,
    cfraEligible: true,
    pdlEligible: true,
    paidFamilyLeave: true,
    workerComp: true,
    disabilityInsurance: true,
    otherBenefits: "",
    
    // Work Schedule
    hoursPerWeek: "40",
    workSchedule: "standard", // standard, flexible, custom
    customSchedule: "",
    mealBreaks: true,
    mealBreakDuration: "30",
    mealBreakPaid: false,
    mealBreaksWaiver: false,
    restBreaks: true,
    restBreakDuration: "10", 
    lactationAccommodation: true,
    reportingTimePay: true,
    splitShiftPremium: false,
    callbackPay: false,
    onCallPay: false,
    
    // Remote Work
    remoteWorkPolicy: "none", // none, partial, fully-remote
    remoteWorkEquipment: "employer-provided", // employer-provided, employee-provided, reimbursed
    remoteWorkEquipmentDetails: "",
    remoteWorkExpenses: true,
    remoteWorkTimeRecording: "standard", // standard, custom
    customTimeRecordingMethod: "",
    remoteWorkSecurity: true,
    remoteWorkSecurityDetails: "",
    
    // COVID-19 Provisions
    covidSafetyMeasures: false,
    covidSafetyDetails: "",
    covidVaccination: false,
    covidVaccinationDetails: "",
    covidTesting: false,
    covidTestingDetails: "",
    covidQuarantine: false,
    covidQuarantineDetails: "",
    covidLeave: false,
    covidLeaveDetails: "",
    
    // Duties and Expectations
    dutiesDescription: "",
    performanceReview: true,
    performanceReviewFrequency: "annual", // quarterly, semi-annual, annual
    performanceMetrics: "",
    trainingRequirements: false,
    trainingDetails: "",
    
    // Confidentiality & IP
    confidentialityAgreement: true,
    confidentialityScope: "standard", // standard, enhanced
    confidentialityExclusions: true, // Excludes whistleblower, trade secret reporting, etc.
    ipAssignment: true,
    ipAssignmentExceptions: "",
    ipAssignmentCaliforniaCompliance: true, // Labor Code Section 2870 compliance
    tradeSecretsProtection: true,
    nonDisclosureTerm: "2-years", // 1-year, 2-years, 5-years, indefinite
    companyProperty: true,
    dataPrivacy: true,
    employeePrivacyProtections: true,
    
    // Policies & Compliance
    employeeHandbook: true,
    antiHarassmentPolicy: true,
    nonDiscriminationPolicy: true,
    drugFreeWorkplace: true,
    workplaceViolencePolicy: true,
    ethicsPolicy: true,
    socialMediaPolicy: true,
    byodPolicy: false,
    byodPolicyDetails: "",
    
    // Dispute Resolution
    grievanceProcedure: true,
    grievanceProcedureDetails: "",
    arbitrationClause: false,
    arbitrationType: "jams", // jams, aaa, custom
    arbitrationCustomDetails: "",
    arbitrationOptOut: true,
    arbitrationOptOutPeriod: "30",
    arbitrationFees: "employer-pays",
    classActionWaiver: false,
    governingLaw: "California",
    venueCounty: "",
    
    // Termination
    noticePeriod: "2-weeks", // none, 1-week, 2-weeks, 30-days, custom
    customNoticePeriod: "",
    severanceIncluded: false,
    severanceTerms: "",
    exitInterview: false,
    continuationOfBenefits: true,
    returnOfProperty: true,
    finalPayRequirements: true,
    postEmploymentRestrictions: false,
    postEmploymentRestrictionsDetails: "",
    
    // Miscellaneous
    entireAgreement: true,
    nonModification: true,
    severability: true,
    nonWaiver: true,
    electronicSignatures: true,
    counterparts: true,
    thirdPartyBeneficiaries: false,
    forcesMajeure: false,
    survivalClauses: true,
    noticesMethod: "email", // email, mail, both
    assignmentOfRights: "non-assignable", // non-assignable, company-only, both-parties
    
    // File Options
    fileName: "California-Employment-Agreement",
  });

  // State for current tab
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);

  // Tabs configuration
  const tabs = [
    { id: 'basic-info', label: 'Basic Information' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'work-schedule', label: 'Work Schedule' },
    { id: 'remote-work', label: 'Remote Work' },
    { id: 'covid-provisions', label: 'COVID-19 Provisions' },
    { id: 'duties', label: 'Duties & Expectations' },
    { id: 'confidentiality-ip', label: 'Confidentiality & IP' },
    { id: 'policies-compliance', label: 'Policies & Compliance' },
    { id: 'termination', label: 'Termination' },
    { id: 'dispute-resolution', label: 'Dispute Resolution' },
    { id: 'finalize', label: 'Finalize' }
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  // Generate the employment agreement text
  const generateDocument = () => {
    let document = "";
    
    // Title
    document += `# CALIFORNIA EMPLOYMENT AGREEMENT\n\n`;
    
    // Basic Information Section
    document += `THIS EMPLOYMENT AGREEMENT (the "Agreement") is made and entered into as of ${formatDate(formData.startDate)} by and between ${formData.employerName} (the "Employer"), with an address at ${formData.employerAddress}${formData.employerEIN ? `, EIN: ${formData.employerEIN}` : ""}, and ${formData.employeeName} (the "Employee"), with an address at ${formData.employeeAddress}${formData.employeeEmail ? `, email: ${formData.employeeEmail}` : ""}${formData.employeePhone ? `, phone: ${formData.employeePhone}` : ""}.\n\n`;
    
    document += `## 1. EMPLOYMENT\n\n`;
    
    // Employment type
    let employmentTypeText = "";
    if (formData.employmentType === "full-time") {
      employmentTypeText = "full-time";
    } else if (formData.employmentType === "part-time") {
      employmentTypeText = "part-time";
    } else if (formData.employmentType === "contract") {
      employmentTypeText = "independent contractor";
    }
    
    // Work location
    let workLocationText = "";
    if (formData.workLocation === "office") {
      workLocationText = "at the Employer's office";
    } else if (formData.workLocation === "remote") {
      workLocationText = "remotely";
    } else if (formData.workLocation === "hybrid") {
      workLocationText = "in a hybrid arrangement, both remotely and at the Employer's office";
    } else if (formData.workLocation === "custom") {
      workLocationText = formData.customWorkLocation;
    }
    
    // Exempt status
    let exemptStatusText = "";
    if (formData.isExempt === "exempt") {
      exemptStatusText = "exempt";
    } else {
      exemptStatusText = "non-exempt";
    }
    
    document += `1.1 Position. The Employer hereby employs the Employee, and the Employee hereby accepts employment with the Employer, as a ${formData.position} on a ${employmentTypeText} basis ${workLocationText}. The Employee shall report directly to the ${formData.reportingTo}. For purposes of overtime eligibility, meal and rest breaks, and other wage and hour laws, the Employee's position is classified as ${exemptStatusText}.\n\n`;
    
    // At-will employment
    if (formData.atWillEmployment) {
      document += `1.2 At-Will Employment. The Employee's employment with the Employer is at-will. This means that either the Employee or the Employer may terminate the employment relationship at any time, with or without cause, and with or without notice. Nothing in this Agreement or in any oral or written statement shall limit the right to terminate at-will employment. No manager, supervisor, or employee of the Employer has any authority to enter into an agreement for employment for any specified period of time or to make an agreement for employment other than at-will. Only the [authorized officer/position] of the Employer has the authority to make any such agreement, and then only in writing, signed by both parties.\n\n`;
    }
    
    // Probation period
    if (formData.probationPeriod && formData.probationPeriod !== "0") {
      document += `1.3 Probationary Period. The Employee's first ${formData.probationPeriod} days of employment shall be considered a probationary period. During this period, the Employer will evaluate the Employee's performance, and the Employee will have the opportunity to evaluate the Employer and the position. During this probationary period, the Employee remains an at-will employee, as described in Section 1.2 above.\n\n`;
    }
    
    // Start date
    document += `1.4 Start Date. The Employee's employment under this Agreement shall begin on ${formatDate(formData.startDate)} (the "Start Date").\n\n`;
    
    // Employment Eligibility
    if (formData.employmentEligibility) {
      document += `1.5 Employment Eligibility. This offer of employment is contingent upon the Employee's submission of satisfactory proof of identity and legal authorization to work in the United States, as required by the Immigration Reform and Control Act of 1986. The Employee will be required to complete an I-9 form and provide appropriate documentation within three (3) business days of the Start Date.\n\n`;
    }
    
    // Background Check
    if (formData.backgroundCheck) {
      document += `1.6 Background Check. This offer of employment is contingent upon the satisfactory completion of a background check, in compliance with applicable federal and California laws. Any background check will be conducted in accordance with the Fair Credit Reporting Act and applicable California law, including the California Consumer Credit Reporting Agencies Act and California Civil Code Sections 1785.1-1785.36 and 1786-1786.60.\n\n`;
    }
    
    // Drug Test
    if (formData.drugTest) {
      document += `1.7 Drug Testing. This offer of employment is contingent upon the satisfactory completion of a pre-employment drug test, in compliance with applicable federal and California laws. Any drug testing will be conducted in accordance with California law, including appropriate notice and consent requirements.\n\n`;
    }
    
    // Compensation Section
    document += `## 2. COMPENSATION AND BENEFITS\n\n`;
    
    // Compensation type
    if (formData.compensationType === "salary") {
      document += `2.1 Base Salary. The Employer shall pay the Employee a base salary of $${formData.salaryAmount} per ${formData.salaryPeriod === "annual" ? "year" : formData.salaryPeriod === "monthly" ? "month" : "bi-weekly period"}, payable in accordance with the Employer's standard payroll procedures, subject to all applicable withholdings and deductions required by law.\n\n`;
      
      // Overtime for non-exempt salary employees
      if (formData.isExempt === "non-exempt") {
        document += `2.2 Overtime for Non-Exempt Employees. As a non-exempt employee paid on a salary basis, the Employee shall be eligible for overtime pay in accordance with California law. The Employee shall be paid overtime at a rate of ${formData.overtimeRate} times the Employee's regular hourly rate (calculated by dividing the weekly salary by 40 hours) for all hours worked in excess of 8 hours in a workday or 40 hours in a workweek.\n\n`;
        
        if (formData.doubleTimeEligible) {
          document += `2.3 Double Time. In accordance with California law, the Employee shall be paid double the Employee's regular hourly rate for all hours worked in excess of 12 hours in a workday or for all hours worked in excess of 8 hours on the seventh consecutive day of work in a workweek.\n\n`;
        }
      } else {
        document += `2.2 Exempt Status. Based on the Employee's job duties and compensation, the Employee is classified as exempt from overtime under applicable law.\n\n`;
      }
    } else if (formData.compensationType === "hourly") {
      document += `2.1 Hourly Rate. The Employer shall pay the Employee at an hourly rate of $${formData.hourlyRate} per hour, payable in accordance with the Employer's standard payroll procedures, subject to all applicable withholdings and deductions required by law.\n\n`;
      
      // Overtime
      if (formData.overtimeEligible === "yes") {
        document += `2.2 Overtime. The Employee shall be eligible for overtime pay at a rate of ${formData.overtimeRate} times the Employee's regular hourly rate for all hours worked in excess of 8 hours in a workday or 40 hours in a workweek, in accordance with California law.\n\n`;
        
        if (formData.doubleTimeEligible) {
          document += `2.3 Double Time. In accordance with California law, the Employee shall be paid double the Employee's regular hourly rate for all hours worked in excess of 12 hours in a workday or for all hours worked in excess of 8 hours on the seventh consecutive day of work in a workweek.\n\n`;
        }
      }
      
      // Meal and Rest Break Premium Pay
      if (formData.mealBreakPremium) {
        document += `2.4 Meal Break Premium Pay. If the Employee is not provided with a compliant meal period as required by California law, the Employee shall be entitled to one hour of pay at the Employee's regular rate of compensation for each workday that the meal period is not provided.\n\n`;
      }
      
      if (formData.restBreakPremium) {
        document += `2.5 Rest Break Premium Pay. If the Employee is not authorized and permitted to take a compliant rest period as required by California law, the Employee shall be entitled to one hour of pay at the Employee's regular rate of compensation for each workday that the rest period is not provided.\n\n`;
      }
    } else if (formData.compensationType === "commission") {
      document += `2.1 Commission. The Employee shall be paid on a commission basis according to the following structure: ${formData.commissionStructure}.\n\n`;
      
      document += `2.2 Commission Agreement. In accordance with California Labor Code Section 2751, a separate written commission agreement will be provided to the Employee, setting forth the method by which commissions shall be computed and paid. The commission agreement is incorporated by reference into this Employment Agreement.\n\n`;
    } else if (formData.compensationType === "mixed") {
      document += `2.1 Compensation. The Employee shall receive a base salary of $${formData.salaryAmount} per ${formData.salaryPeriod === "annual" ? "year" : formData.salaryPeriod === "monthly" ? "month" : "bi-weekly period"}, plus commission at a rate of ${formData.commissionRate} based on the following structure: ${formData.commissionStructure}.\n\n`;
      
      document += `2.2 Commission Agreement. In accordance with California Labor Code Section 2751, a separate written commission agreement will be provided to the Employee, setting forth the method by which commissions shall be computed and paid. The commission agreement is incorporated by reference into this Employment Agreement.\n\n`;
      
      // Overtime
      if (formData.isExempt === "non-exempt") {
        document += `2.3 Overtime for Non-Exempt Employees. As a non-exempt employee, the Employee shall be eligible for overtime pay in accordance with California law. The Employee shall be paid overtime at a rate of ${formData.overtimeRate} times the Employee's regular hourly rate (calculated in accordance with California law, including base salary and commissions) for all hours worked in excess of 8 hours in a workday or 40 hours in a workweek.\n\n`;
        
        if (formData.doubleTimeEligible) {
          document += `2.4 Double Time. In accordance with California law, the Employee shall be paid double the Employee's regular hourly rate for all hours worked in excess of 12 hours in a workday or for all hours worked in excess of 8 hours on the seventh consecutive day of work in a workweek.\n\n`;
        }
      } else {
        document += `2.3 Exempt Status. Based on the Employee's job duties and compensation, the Employee is classified as exempt from overtime under applicable law.\n\n`;
      }
    }
    
    // Bonus
    if (formData.bonusEligible === "yes") {
      document += `2.6 Bonus. The Employee may be eligible to receive bonuses according to the following structure: ${formData.bonusStructure}. All bonuses are discretionary unless expressly stated otherwise. Any non-discretionary bonuses will be included in the regular rate calculation for overtime purposes in accordance with California law.\n\n`;
    }
    
    // Equity
    if (formData.equityEligible === "yes") {
      document += `2.7 Equity. The Employee may be eligible to participate in the Employer's equity program according to the following terms: ${formData.equityDetails}. Any equity grant shall be subject to the terms and conditions of the Employer's equity plan and applicable grant agreements.\n\n`;
    }
    
    // Payment information
    document += `2.8 Payment Schedule. The Employee shall be paid on a ${formData.paymentFrequency} basis via ${formData.paymentMethod}.\n\n`;
    
    // Final Payout Terms
    if (formData.finalPayoutTerms === "standard") {
      document += `2.9 Final Paycheck. In accordance with California law, if the Employee is terminated, the Employee's final wages, including accrued but unused vacation/PTO, shall be paid immediately upon termination. If the Employee resigns with at least 72 hours' notice, the final wages shall be paid on the last day of employment. If the Employee resigns without 72 hours' notice, the final wages shall be paid within 72 hours of the resignation.\n\n`;
    } else if (formData.finalPayoutTerms === "custom") {
      document += `2.9 Final Paycheck. ${formData.customFinalPayoutTerms}\n\n`;
    }
    
    // Expense reimbursement
    if (formData.expenseReimbursement) {
      document += `2.10 Expense Reimbursement. In accordance with California Labor Code Section 2802, the Employer shall reimburse the Employee for all necessary expenditures or losses incurred by the Employee in direct consequence of the discharge of the Employee's duties, or of the Employee's obedience to the directions of the Employer. Reimbursement for business expenses is subject to the Employer's expense reimbursement policies and procedures, which shall include appropriate documentation requirements.\n\n`;
      
      if (formData.businessExpenses) {
        document += `2.11 Business Expenses. Business expenses may include, but are not limited to, business travel expenses, business meals, professional development costs, professional license fees, and business supplies. All business expenses must be pre-approved by the Employer in accordance with the Employer's expense policies.\n\n`;
      }
      
      if (formData.travelExpenses) {
        document += `2.12 Travel Expenses. The Employer shall reimburse the Employee for reasonable travel expenses incurred in connection with the Employee's duties, in accordance with the Employer's travel policy. Travel time may be compensable in accordance with California law for non-exempt employees.\n\n`;
      }
      
      if (formData.telecomExpenses) {
        document += `2.13 Telecommunication Expenses. The Employer shall reimburse the Employee for reasonable telecommunication expenses necessary for the performance of the Employee's duties, including a reasonable percentage of personal cell phone expenses if used for work purposes, in accordance with California law.\n\n`;
      }
    }
    
    // Benefits
    document += `2.14 Benefits. The Employee shall be eligible to participate in the Employer's benefit programs, subject to the terms and conditions of the applicable plan documents and policies. The Employer reserves the right to amend, modify, or terminate any of its benefit plans or programs at any time, except as prohibited by law.\n\n`;
    
    // PTO
    if (formData.ptoPolicy === "accrual") {
      let accrualRateText = "";
      if (formData.ptoAccrualRate === "per-pay-period") {
        accrualRateText = "per pay period";
      } else if (formData.ptoAccrualRate === "monthly") {
        accrualRateText = "monthly";
      } else if (formData.ptoAccrualRate === "annually") {
        accrualRateText = "annually";
      }
      
      document += `2.15 Paid Time Off (PTO). The Employee shall accrue paid time off at a rate equivalent to ${formData.ptoAmount} days per year, accruing ${accrualRateText}, in accordance with the Employer's PTO policy. `;
      
      if (formData.ptoCarryover) {
        document += `Unused PTO may be carried over from year to year, up to a maximum accrual cap of ${formData.ptoCarryoverLimit} hours. Once the maximum accrual cap is reached, the Employee will not accrue additional PTO until the Employee's PTO balance falls below the cap. `;
      } else {
        document += `Unused PTO will not carry over from year to year. `;
      }
      
      document += `Upon separation of employment, accrued but unused PTO will be paid out in accordance with California law.\n\n`;
    } else if (formData.ptoPolicy === "lump-sum") {
      document += `2.15 Paid Time Off (PTO). The Employee shall receive ${formData.ptoAmount} days of paid time off per year, which shall be available at the beginning of each calendar year, in accordance with the Employer's PTO policy. `;
      
      if (formData.ptoCarryover) {
        document += `Unused PTO may be carried over from year to year, up to a maximum accrual cap of ${formData.ptoCarryoverLimit} hours. `;
      } else {
        document += `Unused PTO will not carry over from year to year. `;
      }
      
      document += `Upon separation of employment, accrued but unused PTO will be paid out in accordance with California law.\n\n`;
    } else if (formData.ptoPolicy === "unlimited") {
      document += `2.15 Paid Time Off (PTO). The Employee shall be eligible for the Employer's unlimited paid time off policy, which allows the Employee to take time off as needed, subject to business needs and manager approval. As this is an unlimited PTO policy, no PTO will accrue, and there will be no payout of unused PTO upon separation of employment.\n\n`;
    } else if (formData.ptoPolicy === "none") {
      document += `2.15 Paid Time Off (PTO). The Employee shall not be eligible for paid time off.\n\n`;
    }
    
    // Paid Holidays
    if (formData.paidHolidays) {
      document += `2.16 Paid Holidays. The Employee shall be eligible for paid holidays as designated by the Employer. The Employer's holiday schedule will be published annually.\n\n`;
    }
    
    // Sick Leave
    if (formData.sickLeavePolicy === "legal-minimum") {
      document += `2.17 Sick Leave. In accordance with the California Healthy Workplaces, Healthy Families Act of 2014, the Employee shall be eligible for paid sick leave. The Employee shall accrue one hour of paid sick leave for every 30 hours worked, beginning from the first day of employment. The Employee may begin using accrued sick leave on the 90th day of employment. The Employee may use up to 24 hours or 3 days (whichever is greater) of paid sick leave per year. Unused sick leave may carry over to the following year, but may be capped at 48 hours or 6 days. The Employee may use sick leave for the diagnosis, care, or treatment of an existing health condition of, or preventive care for, the Employee or the Employee's family member, or for specified purposes if the Employee is a victim of domestic violence, sexual assault, or stalking. Accrued, unused sick leave is not paid out upon separation from employment.\n\n`;
    } else if (formData.sickLeavePolicy === "enhanced") {
      document += `2.17 Sick Leave. The Employee shall be eligible for ${formData.sickLeaveAmount} days of paid sick leave per year, in accordance with the Employer's sick leave policy and applicable law. `;
      
      if (formData.sickLeaveAccrual) {
        document += `Sick leave shall accrue at a rate of ${formData.sickLeaveAccrualRate} hour(s) for every 30 hours worked. `;
      } else {
        document += `Sick leave shall be available for use at the beginning of each year. `;
      }
      
      document += `The Employee may use sick leave for the diagnosis, care, or treatment of an existing health condition of, or preventive care for, the Employee or the Employee's family member, or for specified purposes if the Employee is a victim of domestic violence, sexual assault, or stalking. Accrued, unused sick leave is not paid out upon separation from employment, unless required by local ordinance.\n\n`;
    } else if (formData.sickLeavePolicy === "combined-with-pto") {
      document += `2.17 Sick Leave. Sick leave is combined with the Employee's PTO allocation as described in Section 2.15 above. The Employee may use PTO for the diagnosis, care, or treatment of an existing health condition of, or preventive care for, the Employee or the Employee's family member, or for specified purposes if the Employee is a victim of domestic violence, sexual assault, or stalking.\n\n`;
    }
    
    // Health Insurance
    if (formData.healthInsurance) {
      let waitingPeriodText = "";
      
      if (formData.healthInsuranceWaitingPeriod === "first-of-month") {
        waitingPeriodText = "on the first day of the month following the Employee's start date";
      } else if (formData.healthInsuranceWaitingPeriod === "immediate") {
        waitingPeriodText = "immediately upon the Employee's start date";
      } else if (formData.healthInsuranceWaitingPeriod === "30-days") {
        waitingPeriodText = "after 30 days of employment";
      } else if (formData.healthInsuranceWaitingPeriod === "60-days") {
        waitingPeriodText = "after 60 days of employment";
      } else if (formData.healthInsuranceWaitingPeriod === "90-days") {
        waitingPeriodText = "after 90 days of employment";
      }
      
      let contributionText = "";
      
      if (formData.healthInsuranceContribution === "standard") {
        contributionText = "The Employer and the Employee shall share the cost of the premiums, as determined by the Employer.";
      } else if (formData.healthInsuranceContribution === "full") {
        contributionText = "The Employer shall pay 100% of the premium costs for the Employee's coverage.";
      } else if (formData.healthInsuranceContribution === "custom") {
        contributionText = formData.healthInsuranceDetails;
      }
      
      document += `2.18 Health Insurance. The Employee shall be eligible to participate in the Employer's health insurance plans, subject to the terms and conditions of the applicable plan documents. Coverage shall begin ${waitingPeriodText}. ${contributionText} Details of the current plans are available from the Employer's Human Resources department.\n\n`;
    }
    
    // Retirement Plan
    if (formData.retirementPlan) {
      document += `2.19 Retirement Plan. The Employee shall be eligible to participate in the Employer's retirement plan, subject to the terms and conditions of the applicable plan documents. ${formData.retirementPlanDetails}\n\n`;
    }
    
    // FMLA
    if (formData.fmlaEligible) {
      document += `2.20 Family and Medical Leave. Upon satisfying eligibility requirements, the Employee may be eligible for family and medical leave under the federal Family and Medical Leave Act (FMLA).\n\n`;
    }
    
    // CFRA
    if (formData.cfraEligible) {
      document += `2.21 California Family Rights Act Leave. Upon satisfying eligibility requirements, the Employee may be eligible for family and medical leave under the California Family Rights Act (CFRA).\n\n`;
    }
    
    // PDL
    if (formData.pdlEligible) {
      document += `2.22 Pregnancy Disability Leave. In accordance with California law, female employees are entitled to up to four months of pregnancy disability leave for the period of time the employee is actually disabled by pregnancy, childbirth, or a related medical condition.\n\n`;
    }
    
    // Paid Family Leave
    if (formData.paidFamilyLeave) {
      document += `2.23 California Paid Family Leave. The Employee may be eligible for California Paid Family Leave (PFL) benefits administered by the California Employment Development Department (EDD). PFL provides partial wage replacement for up to eight weeks when an employee takes time off from work to care for a seriously ill family member or to bond with a new child.\n\n`;
    }
    
    // Workers' Compensation
    if (formData.workerComp) {
      document += `2.24 Workers' Compensation Insurance. The Employer maintains workers' compensation insurance coverage for work-related injuries or illnesses, as required by California law.\n\n`;
    }
    
    // Disability Insurance
    if (formData.disabilityInsurance) {
      document += `2.25 Disability Insurance. The Employee is covered by California State Disability Insurance (SDI), which provides partial wage replacement for non-work-related injuries or illnesses. SDI is funded through employee payroll deductions, as required by California law.\n\n`;
    }
    
    // Other Benefits
    if (formData.otherBenefits) {
      document += `2.26 Other Benefits. ${formData.otherBenefits}\n\n`;
    }
    
    // Work Schedule Section
    document += `## 3. WORK SCHEDULE AND BREAKS\n\n`;
    
    // Work Schedule
    document += `3.1 Work Schedule. `;
    
    if (formData.workSchedule === "standard") {
      document += `The Employee shall work a standard schedule of approximately ${formData.hoursPerWeek} hours per week, Monday through Friday, 9:00 AM to 5:00 PM, or as otherwise determined by the Employer.\n\n`;
    } else if (formData.workSchedule === "flexible") {
      document += `The Employee shall work approximately ${formData.hoursPerWeek} hours per week on a flexible schedule, subject to the requirements of the position and as approved by the Employer.\n\n`;
    } else if (formData.workSchedule === "custom") {
      document += `${formData.customSchedule}\n\n`;
    }
    
    // Breaks
    if (formData.mealBreaks) {
      document += `3.2 Meal Breaks. `;
      
      if (formData.isExempt === "non-exempt") {
        document += `In accordance with California law, the Employee shall be provided with an unpaid meal period of at least ${formData.mealBreakDuration} minutes when working more than five (5) hours in a workday. The meal period should begin before the end of the fifth hour of work. If the Employee works more than ten (10) hours in a workday, the Employee shall be provided with a second meal period of at least ${formData.mealBreakDuration} minutes, which should begin before the end of the tenth hour of work. `;
        
        if (formData.mealBreakPaid) {
          document += `Meal breaks shall be paid by the Employer. `;
        } else {
          document += `Meal breaks shall be unpaid. `;
        }
        
        if (formData.mealBreaksWaiver) {
          document += `If the Employee works no more than six (6) hours in a workday, the meal period may be waived by mutual consent of the Employer and the Employee. If the Employee works more than ten (10) but no more than twelve (12) hours in a workday, the second meal period may be waived by mutual consent of the Employer and the Employee, but only if the first meal period was not waived.`;
        }
      } else {
        document += `As an exempt employee, the Employee is expected to manage their meal breaks in a manner consistent with job responsibilities and workflow.`;
      }
      
      document += `\n\n`;
    }
    
    if (formData.restBreaks) {
      document += `3.3 Rest Breaks. `;
      
      if (formData.isExempt === "non-exempt") {
        document += `In accordance with California law, the Employee shall be authorized and permitted to take a ${formData.restBreakDuration}-minute paid rest break for every four (4) hours worked or major fraction thereof. To the extent practicable, rest breaks should be taken in the middle of each work period. Rest breaks are counted as time worked, and the Employee shall be paid for such breaks.`;
      } else {
        document += `As an exempt employee, the Employee is expected to manage their rest breaks in a manner consistent with job responsibilities and workflow.`;
      }
      
      document += `\n\n`;
    }
    
    // Lactation Accommodation
    if (formData.lactationAccommodation) {
      document += `3.4 Lactation Accommodation. In accordance with California law, the Employer shall provide a reasonable amount of break time to accommodate an employee desiring to express breast milk for the employee's infant child. If possible, the break time should run concurrently with the Employee's regular break time. The Employer shall make reasonable efforts to provide the Employee with the use of a room or other location, other than a bathroom, in close proximity to the Employee's work area, for the Employee to express milk in private.\n\n`;
    }
    
    // California-specific wage provisions
    if (formData.reportingTimePay) {
      document += `3.5 Reporting Time Pay. In accordance with California law, if a non-exempt employee reports to work at the Employer's request, but is furnished with less than half of the employee's usual or scheduled day's work, the employee shall be paid for half the usual or scheduled day's work, but in no event for less than two hours or more than four hours, at the employee's regular rate of pay.\n\n`;
    }
    
    if (formData.splitShiftPremium) {
      document += `3.6 Split Shift Premium. In accordance with California law, if a non-exempt employee works a split shift (a work schedule that is interrupted by non-paid, non-working periods other than meal or rest breaks), the employee shall receive a split shift premium equal to one hour at the state minimum wage, except when the employee resides at the place of employment.\n\n`;
    }
    
    if (formData.callbackPay) {
      document += `3.7 Call-Back Pay. If a non-exempt employee is called back to work after completing their regular shift and leaving the workplace, the employee shall be guaranteed a minimum of [NUMBER] hours of pay at the employee's regular rate, regardless of the number of hours actually worked during the call-back.\n\n`;
    }
    
    if (formData.onCallPay) {
      document += `3.8 On-Call Pay. If a non-exempt employee is required to remain on-call and the on-call requirements are such that the employee cannot effectively use the time for their own purposes, the on-call time shall be counted as hours worked and compensated accordingly.\n\n`;
    }
    
    // Remote Work Section
    if (formData.remoteWorkPolicy !== "none") {
      document += `## 4. REMOTE WORK POLICY\n\n`;
      
      if (formData.remoteWorkPolicy === "partial") {
        document += `4.1 Hybrid Work Arrangement. The Employee shall work partially remotely and partially in the office, as determined by the Employer. The specific in-office days and remote days will be established by the Employer based on business needs and may be subject to change with reasonable notice.\n\n`;
      } else if (formData.remoteWorkPolicy === "fully-remote") {
        document += `4.1 Remote Work Arrangement. The Employee shall work remotely on a full-time basis. The Employee must maintain a suitable work environment that allows for the effective performance of job duties and maintain regular communication with the Employer during established work hours.\n\n`;
      }
      
      // Equipment
      if (formData.remoteWorkEquipment === "employer-provided") {
        document += `4.2 Equipment. The Employer shall provide the Employee with necessary equipment to perform their job duties remotely, which may include a computer, monitor, keyboard, mouse, and other necessary peripherals. All equipment provided by the Employer remains the property of the Employer and must be returned upon request or upon termination of employment. The Employee is responsible for maintaining the equipment in good condition and reporting any issues or damage immediately.\n\n`;
      } else if (formData.remoteWorkEquipment === "employee-provided") {
        document += `4.2 Equipment. The Employee shall use their own equipment to perform their job duties remotely. The Employee is responsible for ensuring that their equipment meets the Employer's specifications and for maintaining the equipment in good working condition.\n\n`;
      } else if (formData.remoteWorkEquipment === "reimbursed") {
        document += `4.2 Equipment. The Employee shall use their own equipment to perform their job duties remotely, and the Employer shall reimburse the Employee for reasonable and necessary costs associated with using personal equipment for work purposes, in accordance with California Labor Code Section 2802. The Employee must submit expense reports with appropriate documentation to receive reimbursement.\n\n`;
      }
      
      if (formData.remoteWorkEquipmentDetails) {
        document += `4.3 Equipment Details. ${formData.remoteWorkEquipmentDetails}\n\n`;
      }
      
      // Expenses
      if (formData.remoteWorkExpenses) {
        document += `4.4 Remote Work Expenses. In accordance with California Labor Code Section 2802, the Employer shall reimburse the Employee for reasonable and necessary expenses incurred as a direct consequence of the discharge of the Employee's duties while working remotely. Reimbursable expenses may include, but are not limited to, a reasonable percentage of internet service, telephone service, office supplies, and any other necessary costs directly related to the performance of the Employee's job duties. The Employee must submit expense reports with appropriate documentation to receive reimbursement.\n\n`;
      }
      
      // Time Recording
      if (formData.isExempt === "non-exempt") {
        document += `4.5 Time Recording. As a non-exempt employee working remotely, the Employee must accurately record all hours worked in accordance with the Employer's time-keeping policies. `;
        
        if (formData.remoteWorkTimeRecording === "standard") {
          document += `The Employee shall record time using the Employer's standard time-keeping system. The Employee must record all hours worked, including any overtime hours, and take all required meal and rest breaks as required by California law.`;
        } else if (formData.remoteWorkTimeRecording === "custom") {
          document += `${formData.customTimeRecordingMethod}`;
        }
        
        document += `\n\n`;
      }
      
      // Security
      if (formData.remoteWorkSecurity) {
        document += `4.6 Data Security and Confidentiality. The Employee shall comply with all Employer policies and procedures regarding data security and confidentiality while working remotely. The Employee shall take all reasonable precautions to secure Employer information and equipment, including but not limited to using secure Wi-Fi networks, keeping equipment physically secure, using required password protections and security software, and immediately reporting any security incidents or breaches. `;
        
        if (formData.remoteWorkSecurityDetails) {
          document += `${formData.remoteWorkSecurityDetails}`;
        }
        
        document += `\n\n`;
      }
    }
    
    // COVID-19 Provisions Section
    if (formData.covidSafetyMeasures || formData.covidVaccination || formData.covidTesting || formData.covidQuarantine || formData.covidLeave) {
      document += `## 5. COVID-19 PROVISIONS\n\n`;
      
      // Safety Measures
      if (formData.covidSafetyMeasures) {
        document += `5.1 COVID-19 Safety Measures. ${formData.covidSafetyDetails}\n\n`;
      }
      
      // Vaccination
      if (formData.covidVaccination) {
        document += `5.2 COVID-19 Vaccination. ${formData.covidVaccinationDetails}\n\n`;
      }
      
      // Testing
      if (formData.covidTesting) {
        document += `5.3 COVID-19 Testing. ${formData.covidTestingDetails}\n\n`;
      }
      
      // Quarantine
      if (formData.covidQuarantine) {
        document += `5.4 COVID-19 Quarantine. ${formData.covidQuarantineDetails}\n\n`;
      }
      
      // Leave
      if (formData.covidLeave) {
        document += `5.5 COVID-19 Leave. ${formData.covidLeaveDetails}\n\n`;
      }
    }
    
    // Duties and Responsibilities Section
    document += `## 6. DUTIES AND RESPONSIBILITIES\n\n`;
    
    // Job duties
    document += `6.1 Duties and Responsibilities. The Employee shall perform all duties and responsibilities associated with the position of ${formData.position}, as well as such other duties as may be assigned by the Employer from time to time. ${formData.dutiesDescription ? formData.dutiesDescription : "The Employee shall perform these duties to the best of the Employee's ability and in compliance with all applicable laws, rules, regulations, and Employer policies."}\n\n`;
    
    // Performance Reviews
    if (formData.performanceReview) {
      document += `6.2 Performance Reviews. The Employee's performance shall be reviewed ${formData.performanceReviewFrequency === "quarterly" ? "quarterly" : formData.performanceReviewFrequency === "semi-annual" ? "semi-annually" : "annually"}. These reviews may be used to determine potential salary adjustments, bonuses, areas for improvement, and career development opportunities.\n\n`;
      
      if (formData.performanceMetrics) {
        document += `6.3 Performance Metrics. The Employee's performance will be evaluated based on the following metrics and criteria: ${formData.performanceMetrics}\n\n`;
      }
    }
    
    // Training
    if (formData.trainingRequirements) {
      document += `6.4 Training Requirements. ${formData.trainingDetails}\n\n`;
    }
    
    // Confidentiality and IP Section
    document += `## 7. CONFIDENTIALITY AND INTELLECTUAL PROPERTY\n\n`;
    
    // Confidentiality
    if (formData.confidentialityAgreement) {
      document += `7.1 Confidential Information. During the course of employment, the Employee will have access to confidential and proprietary information relating to the Employer's business ("Confidential Information"). Confidential Information includes, but is not limited to, trade secrets, business plans, marketing strategies, customer lists, financial information, product information, and other proprietary information identified as confidential by the Employer.\n\n`;
      
      document += `7.2 Non-Disclosure. The Employee agrees not to disclose any Confidential Information to any person or entity, except as required in the course of performing duties for the Employer or as required by law. This obligation shall continue during the term of employment and at all times thereafter. The Employee shall not use any Confidential Information for personal benefit or for the benefit of any third party.\n\n`;
      
      if (formData.confidentialityScope === "enhanced") {
        document += `7.3 Return of Information. Upon termination of employment, or at any time upon the Employer's request, the Employee shall return to the Employer all Confidential Information in the Employee's possession, custody, or control, including all copies, notes, or extracts thereof.\n\n`;
        
        document += `7.4 Remedies. The Employee acknowledges that any breach of the confidentiality provisions of this Agreement would cause irreparable harm to the Employer, and that monetary damages would not provide an adequate remedy. Accordingly, in addition to any other remedies available, the Employer shall be entitled to seek injunctive relief to enforce these provisions.\n\n`;
      }
      
      if (formData.confidentialityExclusions) {
        document += `7.5 Exclusions. Notwithstanding the foregoing, nothing in this Agreement prohibits the Employee from (a) reporting possible violations of federal or state law or regulation to any governmental agency or entity or self-regulatory organization, including but not limited to the Department of Justice, the Securities and Exchange Commission, Congress, and any agency Inspector General, or making other disclosures that are protected under the whistleblower provisions of federal or state law or regulation, (b) disclosing trade secrets in confidence to federal, state, or local government officials, or to an attorney, for the sole purpose of reporting or investigating a suspected violation of law, or (c) disclosing trade secrets in a document filed in a lawsuit or other proceeding, but only if the filing is made under seal and protected from public disclosure. The Employee does not need the prior authorization of the Employer to make any such reports or disclosures, and the Employee is not required to notify the Employer that the Employee has made such reports or disclosures.\n\n`;
      }
    }
    
    // Trade Secrets Protection
    if (formData.tradeSecretsProtection) {
      document += `7.6 Trade Secrets. The Employee acknowledges that trade secrets are a valuable asset of the Employer. The Employee shall not disclose, use, or misappropriate any trade secret of the Employer, either during or after employment. This provision does not limit any rights the Employee may have under the Defend Trade Secrets Act, including immunity for disclosures made solely for the purpose of reporting or investigating a suspected violation of law.\n\n`;
      
      document += `7.7 Defend Trade Secrets Act Notice. In compliance with the Defend Trade Secrets Act, the Employee is hereby notified that an individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that: (a) is made in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney, solely for the purpose of reporting or investigating a suspected violation of law; or (b) is made in a complaint or other document filed in a lawsuit or other proceeding, if such filing is made under seal. Further, an individual who files a lawsuit for retaliation by an employer for reporting a suspected violation of law may disclose the trade secret to the attorney of the individual and use the trade secret information in the court proceeding, if the individual (a) files any document containing the trade secret under seal; and (b) does not disclose the trade secret, except pursuant to court order.\n\n`;
    }
    
    // Non-Disclosure Term
    if (formData.nonDisclosureTerm !== "indefinite") {
      document += `7.8 Term of Non-Disclosure Obligations. The Employee's obligation not to disclose Confidential Information shall continue for a period of ${formData.nonDisclosureTerm} after the termination of employment, except for trade secrets, which shall remain confidential for as long as they qualify as trade secrets under applicable law.\n\n`;
    }
    
    // Intellectual Property
    if (formData.ipAssignment) {
      document += `7.9 Intellectual Property. The Employee agrees that all inventions, innovations, improvements, developments, methods, designs, analyses, drawings, reports, and all similar or related information (whether or not patentable) which (a) relate to the Employer's actual or anticipated business, research, and development, or existing or future products or services, and (b) are conceived, developed, or made by the Employee while employed by the Employer (collectively, "Work Product") belong to the Employer.\n\n`;
      
      document += `7.10 Assignment of Rights. The Employee hereby assigns to the Employer all right, title, and interest in and to all Work Product and all related intellectual property rights, including patents, trademarks, copyrights, and trade secrets. The Employee agrees to promptly disclose all Work Product to the Employer and to assist the Employer in securing and defending its intellectual property rights.\n\n`;
      
      if (formData.ipAssignmentExceptions) {
        document += `7.11 Exceptions to Assignment. The following inventions are exempt from the assignment provisions of this Agreement: ${formData.ipAssignmentExceptions}\n\n`;
      }
      
      if (formData.ipAssignmentCaliforniaCompliance) {
        document += `7.12 California Labor Code Section 2870. In accordance with California Labor Code Section 2870, this Agreement does not require the assignment of an invention that the Employee develops entirely on the Employee's own time without using the Employer's equipment, supplies, facilities, or trade secret information, except for those inventions that either: (a) relate at the time of conception or reduction to practice of the invention to the Employer's business, or actual or demonstrably anticipated research or development of the Employer; or (b) result from any work performed by the Employee for the Employer.\n\n`;
        
        document += `7.13 California Labor Code Section 2871. In accordance with California Labor Code Section 2871, the Employer hereby provides notice to the Employee that Section 2870 creates an exception to the Employee's obligation to assign inventions under certain circumstances. A copy of California Labor Code Sections 2870-2872 has been provided to the Employee or is attached to this Agreement.\n\n`;
      }
    }
    
    // Company Property
    if (formData.companyProperty) {
      document += `7.14 Company Property. All documents, data, records, equipment, and other physical property, whether or not pertaining to Confidential Information, which are furnished to the Employee by the Employer or are produced by the Employee in connection with the Employee's employment, shall be and remain the sole property of the Employer. The Employee agrees to return to the Employer all such materials and property as and when requested by the Employer. Upon termination of employment, the Employee shall return all such materials and property promptly without retaining any copies.\n\n`;
    }
    
    // Data Privacy
    if (formData.dataPrivacy) {
      document += `7.15 Data Privacy. The Employee shall comply with all Employer policies and applicable laws regarding data privacy and security, including but not limited to the California Consumer Privacy Act (CCPA), the California Privacy Rights Act (CPRA), and any other applicable data privacy laws or regulations. The Employee shall take all reasonable precautions to ensure the security and privacy of personal information accessed or processed in the course of employment.\n\n`;
    }
    
    // Employee Privacy Protections
    if (formData.employeePrivacyProtections) {
      document += `7.16 Employee Privacy. The Employee has the right to privacy as provided under California law. The Employer may monitor the Employee's use of Employer-provided equipment, systems, and networks in accordance with applicable law and Employer policies. The Employer shall inform the Employee of any monitoring activities as required by law. The Employee's personal information will be handled in accordance with applicable privacy laws and Employer policies.\n\n`;
    }
    
    // Company Policies Section
    document += `## 8. COMPANY POLICIES AND COMPLIANCE\n\n`;
    
    // Employee Handbook
    if (formData.employeeHandbook) {
      document += `8.1 Employee Handbook. The Employee acknowledges receipt of the Employer's Employee Handbook and agrees to comply with all policies and procedures contained therein. The Employee understands that the Employee Handbook is not a contract of employment and does not alter the at-will nature of employment. The Employer reserves the right to modify, supplement, or rescind any policies or portions of the Employee Handbook from time to time as it deems necessary, with or without prior notice.\n\n`;
    }
    
    // Anti-Harassment Policy
    if (formData.antiHarassmentPolicy) {
      document += `8.2 Anti-Harassment Policy. The Employer is committed to providing a workplace free from unlawful harassment, discrimination, and retaliation. The Employee agrees to comply with the Employer's anti-harassment policies and to participate in any required harassment prevention training. California law requires employers with 5 or more employees to provide at least 1 hour of sexual harassment prevention training to non-supervisory employees and at least 2 hours of such training to supervisors and managers within 6 months of hire or promotion, and every 2 years thereafter.\n\n`;
    }
    
    // Non-Discrimination Policy
    if (formData.nonDiscriminationPolicy) {
      document += `8.3 Non-Discrimination Policy. The Employer is an equal opportunity employer and does not discriminate against any employee or applicant for employment on the basis of race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, genetic information, marital status, amnesty, or status as a covered veteran in accordance with applicable federal, state, and local laws, including the California Fair Employment and Housing Act (FEHA). The Employee agrees to comply with the Employer's non-discrimination policies.\n\n`;
    }
    
    // Drug-Free Workplace
    if (formData.drugFreeWorkplace) {
      document += `8.4 Drug-Free Workplace Policy. The Employer maintains a drug-free workplace. The unlawful manufacture, distribution, dispensation, possession, or use of a controlled substance in the workplace is prohibited. The Employee agrees to comply with the Employer's drug-free workplace policy.\n\n`;
    }
    
    // Workplace Violence
    if (formData.workplaceViolencePolicy) {
      document += `8.5 Workplace Violence Policy. The Employer is committed to maintaining a workplace free from threats and acts of violence. The Employee agrees to comply with the Employer's workplace violence prevention policy and to report any threatening or violent behavior immediately.\n\n`;
    }
    
    // Ethics Policy
    if (formData.ethicsPolicy) {
      document += `8.6 Ethics Policy. The Employee agrees to comply with the Employer's ethics policy and to conduct business in accordance with the highest ethical standards, including avoiding conflicts of interest, maintaining accurate records, and reporting any suspected illegal or unethical conduct.\n\n`;
    }
    
    // Social Media Policy
    if (formData.socialMediaPolicy) {
      document += `8.7 Social Media Policy. The Employee agrees to comply with the Employer's social media policy, which governs the Employee's use of social media in both professional and personal contexts. The Employee acknowledges that inappropriate use of social media may result in disciplinary action, up to and including termination of employment.\n\n`;
    }
    
    // BYOD Policy
    if (formData.byodPolicy) {
      document += `8.8 Bring Your Own Device (BYOD) Policy. ${formData.byodPolicyDetails}\n\n`;
    }
    
    // Termination Section
    document += `## 9. TERMINATION\n\n`;
    
    // If at-will employment
    if (formData.atWillEmployment) {
      document += `9.1 At-Will Employment. As stated in Section 1.2, the Employee's employment is at-will and may be terminated by either party at any time, with or without cause, and with or without notice.\n\n`;
    }
    
    // Notice Period
    if (formData.noticePeriod !== "none") {
      document += `9.2 Notice Period. `;
      
      if (formData.noticePeriod === "1-week") {
        document += `While employment remains at-will, the Employee is requested to provide at least one (1) week's written notice prior to voluntary resignation.`;
      } else if (formData.noticePeriod === "2-weeks") {
        document += `While employment remains at-will, the Employee is requested to provide at least two (2) weeks' written notice prior to voluntary resignation.`;
      } else if (formData.noticePeriod === "30-days") {
        document += `While employment remains at-will, the Employee is requested to provide at least thirty (30) days' written notice prior to voluntary resignation.`;
      } else if (formData.noticePeriod === "custom") {
        document += `${formData.customNoticePeriod}`;
      }
      
      document += ` This notice period request does not alter the at-will nature of employment.\n\n`;
    }
    
    // Severance
    if (formData.severanceIncluded) {
      document += `9.3 Severance. ${formData.severanceTerms}\n\n`;
    }
    
    // Exit Interview
    if (formData.exitInterview) {
      document += `9.4 Exit Interview. Upon termination of employment, the Employee may be requested to participate in an exit interview conducted by the Employer or its representative.\n\n`;
    }
    
    // Continuation of Benefits
    if (formData.continuationOfBenefits) {
      document += `9.5 Continuation of Benefits. Upon termination of employment, the Employee may be eligible to continue certain benefits in accordance with applicable law, including the Consolidated Omnibus Budget Reconciliation Act (COBRA) or Cal-COBRA. Information regarding continuation of benefits will be provided to the Employee at the time of termination.\n\n`;
    }
    
    // Return of Property
    if (formData.returnOfProperty) {
      document += `9.6 Return of Property. Upon termination of employment for any reason, the Employee shall promptly return to the Employer all property belonging to the Employer, including but not limited to computers, phones, files, documents, keys, access cards, and any other Employer property in the Employee's possession or control.\n\n`;
    }
    
    // Final Pay Requirements
    if (formData.finalPayRequirements) {
      document += `9.7 Final Pay. In accordance with California law, if the Employee is terminated, the Employee's final wages, including accrued but unused vacation or PTO, shall be paid immediately upon termination. If the Employee resigns with at least 72 hours' notice, the final wages shall be paid on the last day of employment. If the Employee resigns without 72 hours' notice, the final wages shall be paid within 72 hours of the resignation.\n\n`;
    }
    
    // Post-Employment Restrictions
    if (formData.postEmploymentRestrictions) {
      document += `9.8 Post-Employment Restrictions. ${formData.postEmploymentRestrictionsDetails}\n\n`;
      
      document += `9.9 California Non-Compete Law. The Employee acknowledges that California law generally prohibits post-employment non-compete agreements, with limited exceptions. Any post-employment restrictions in this Agreement shall be construed and enforced in accordance with California law, including California Business and Professions Code Section 16600.\n\n`;
    }
    
    // Dispute Resolution Section
    document += `## 10. DISPUTE RESOLUTION\n\n`;
    
    // Grievance Procedure
    if (formData.grievanceProcedure) {
      document += `10.1 Grievance Procedure. `;
      
      if (formData.grievanceProcedureDetails) {
        document += `${formData.grievanceProcedureDetails}`;
      } else {
        document += `If the Employee has a complaint or concern related to employment, the Employee is encouraged to discuss the matter with their immediate supervisor. If the matter is not resolved, the Employee may escalate the concern to the next level of management or to Human Resources. The Employer is committed to addressing employee concerns in a fair and timely manner.`;
      }
      
      document += `\n\n`;
    }
    
    // Arbitration
    if (formData.arbitrationClause) {
      document += `10.2 Arbitration. Any dispute, claim, or controversy arising out of or relating to this Agreement or the Employee's employment with the Employer shall be resolved through final and binding arbitration, rather than in court. This agreement to arbitrate is governed by the Federal Arbitration Act.\n\n`;
      
      document += `10.3 Arbitration Procedure. `;
      
      if (formData.arbitrationType === "jams") {
        document += `The arbitration shall be administered by JAMS pursuant to its Employment Arbitration Rules & Procedures in effect at the time of the arbitration. The arbitration shall take place in the county where the Employee worked, before a single arbitrator selected in accordance with the JAMS rules.`;
      } else if (formData.arbitrationType === "aaa") {
        document += `The arbitration shall be administered by the American Arbitration Association (AAA) pursuant to its Employment Arbitration Rules in effect at the time of the arbitration. The arbitration shall take place in the county where the Employee worked, before a single arbitrator selected in accordance with the AAA rules.`;
      } else if (formData.arbitrationType === "custom") {
        document += `${formData.arbitrationCustomDetails}`;
      }
      
      document += `\n\n`;
      
      document += `10.4 Costs. `;
      
      if (formData.arbitrationFees === "employer-pays") {
        document += `The Employer shall pay all costs unique to arbitration, including the administrative fees and the arbitrator's fees. Each party shall bear its own attorneys' fees and costs, unless applicable law or the arbitrator provides otherwise.`;
      } else {
        document += `The costs of arbitration shall be allocated as provided in the arbitration agreement or as determined by the arbitrator in accordance with applicable law.`;
      }
      
      document += `\n\n`;
      
      document += `10.5 Remedies. The arbitrator shall have the authority to award any remedies that would be available in a court proceeding under applicable law.\n\n`;
      
      if (formData.classActionWaiver) {
        document += `10.6 Class Action Waiver. The parties agree that any arbitration shall be conducted on an individual basis, and not as a class, collective, or representative action. There will be no right or authority for any dispute to be brought, heard, or arbitrated as a class, collective, or representative action.\n\n`;
      }
      
      document += `10.7 Exceptions. This arbitration agreement does not prevent the Employee from filing charges or claims with the National Labor Relations Board, the Equal Employment Opportunity Commission, or other federal, state, or local administrative agencies, or from filing a workers' compensation claim. Additionally, either party may seek injunctive relief in a court of law to protect their rights pending arbitration.\n\n`;
      
      if (formData.arbitrationOptOut) {
        document += `10.8 Opt-Out Provision. The Employee may opt out of this arbitration agreement by providing written notice to the Employer within ${formData.arbitrationOptOutPeriod} days of signing this Agreement. If the Employee opts out, neither party will be required to arbitrate employment-related claims.\n\n`;
      }
    } else {
      document += `10.2 Resolution of Disputes. Any dispute, claim, or controversy arising out of or relating to this Agreement or the Employee's employment with the Employer shall be resolved in a court of competent jurisdiction in the State of California.\n\n`;
    }
    
    // Governing Law
    document += `10.9 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without giving effect to any choice of law or conflict of law provisions.\n\n`;
    
    // Venue
    if (formData.venueCounty) {
      document += `10.10 Venue. Any legal action relating to this Agreement or the Employee's employment shall be filed in ${formData.venueCounty} County, California, unless otherwise required by law.\n\n`;
    }
    
    // Miscellaneous Section
    document += `## 11. MISCELLANEOUS\n\n`;
    
    // Entire Agreement
    if (formData.entireAgreement) {
      document += `11.1 Entire Agreement. This Agreement constitutes the entire understanding between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, whether written or oral, relating to such subject matter.\n\n`;
    }
    
    // Non-Modification
    if (formData.nonModification) {
      document += `11.2 Modification. This Agreement may not be amended or modified except by a written instrument signed by both parties.\n\n`;
    }
    
    // Severability
    if (formData.severability) {
      document += `11.3 Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired.\n\n`;
    }
    
    // Non-Waiver
    if (formData.nonWaiver) {
      document += `11.4 Non-Waiver. The failure of either party to enforce any provision of this Agreement shall not be construed as a waiver of that provision or the right of the party to enforce that provision or any other provision.\n\n`;
    }
    
    // Electronic Signatures
    if (formData.electronicSignatures) {
      document += `11.5 Electronic Signatures. The parties agree that electronic signatures shall be as valid and binding as handwritten signatures.\n\n`;
    }
    
    // Counterparts
    if (formData.counterparts) {
      document += `11.6 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.\n\n`;
    }
    
    // Third Party Beneficiaries
    if (formData.thirdPartyBeneficiaries) {
      document += `11.7 No Third-Party Beneficiaries. This Agreement is for the sole benefit of the parties hereto and their respective successors and permitted assigns, and nothing herein, express or implied, is intended to or shall confer upon any other person or entity any legal or equitable right, benefit, or remedy of any nature whatsoever under or by reason of this Agreement.\n\n`;
    }
    
    // Force Majeure
    if (formData.forcesMajeure) {
      document += `11.8 Force Majeure. Neither party shall be liable or responsible to the other party, nor be deemed to have defaulted under or breached this Agreement, for any failure or delay in fulfilling or performing any term of this Agreement, when and to the extent such failure or delay is caused by or results from acts beyond the affected party's reasonable control, including, without limitation: acts of God; flood, fire, earthquake, explosion, or other natural disaster; epidemic or pandemic; war, invasion, hostilities, terrorist threats or acts, riot or other civil unrest; government order, law, or action; embargoes or blockades; national or regional emergency; strikes, labor stoppages or slowdowns, or other industrial disturbances; or shortage of adequate power or transportation facilities.\n\n`;
    }
    
    // Survival Clauses
    if (formData.survivalClauses) {
      document += `11.9 Survival. The provisions of this Agreement that by their nature extend beyond the termination of employment, including but not limited to Sections 4 (Confidentiality and Intellectual Property) and 6 (Dispute Resolution), shall survive termination of this Agreement.\n\n`;
    }
    
    // Notices
    document += `11.10 Notices. All notices required or permitted under this Agreement shall be in writing and shall be delivered `;
    
    if (formData.noticesMethod === "email") {
      document += `via email to the respective email addresses of the parties as set forth in this Agreement or as otherwise designated in writing by the parties.`;
    } else if (formData.noticesMethod === "mail") {
      document += `via certified mail, return receipt requested, to the respective addresses of the parties as set forth in this Agreement or as otherwise designated in writing by the parties.`;
    } else if (formData.noticesMethod === "both") {
      document += `via email or certified mail, return receipt requested, to the respective addresses or email addresses of the parties as set forth in this Agreement or as otherwise designated in writing by the parties.`;
    }
    
    document += `\n\n`;
    
    // Assignment
    document += `11.11 Assignment. `;
    
    if (formData.assignmentOfRights === "non-assignable") {
      document += `This Agreement may not be assigned by either party without the prior written consent of the other party.`;
    } else if (formData.assignmentOfRights === "company-only") {
      document += `This Agreement may not be assigned by the Employee. The Employer may assign this Agreement to any successor to all or substantially all of the business and/or assets of the Employer.`;
    } else if (formData.assignmentOfRights === "both-parties") {
      document += `This Agreement may be assigned by either party with the prior written consent of the other party, which consent shall not be unreasonably withheld.`;
    }
    
    document += `\n\n`;
    
    // Signature Block
    document += `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n`;
    document += `EMPLOYER:\n\n`;
    document += `By: ________________________\n`;
    document += `${formData.employerName}\n\n`;
    document += `Title: ________________________\n\n`;
    document += `EMPLOYEE:\n\n`;
    document += `By: ________________________\n`;
    document += `${formData.employeeName}\n\n`;
    
    // California Labor Code Section 2870-2872 for IP Assignment
    if (formData.ipAssignment && formData.ipAssignmentCaliforniaCompliance) {
      document += `EXHIBIT A\n\n`;
      document += `CALIFORNIA LABOR CODE SECTIONS 2870-2872\n\n`;
      document += `SECTION 2870\n`;
      document += `(a) Any provision in an employment agreement which provides that an employee shall assign, or offer to assign, any of his or her rights in an invention to his or her employer shall not apply to an invention that the employee developed entirely on his or her own time without using the employer's equipment, supplies, facilities, or trade secret information except for those inventions that either:\n`;
      document += `(1) Relate at the time of conception or reduction to practice of the invention to the employer's business, or actual or demonstrably anticipated research or development of the employer; or\n`;
      document += `(2) Result from any work performed by the employee for the employer.\n`;
      document += `(b) To the extent a provision in an employment agreement purports to require an employee to assign an invention otherwise excluded from being required to be assigned under subdivision (a), the provision is against the public policy of this state and is unenforceable.\n\n`;
      document += `SECTION 2871\n`;
      document += `No employer shall require a provision made void and unenforceable by Section 2870 as a condition of employment or continued employment. Nothing in this article shall be construed to forbid or restrict the right of an employer to provide in contracts of employment for disclosure, provided that any such disclosures be received in confidence, of all of the employee's inventions made solely or jointly with others during the term of his or her employment, a review process by the employer to determine such issues as may arise, and for full title to certain patents and inventions to be in the United States, as required by contracts between the employer and the United States or any of its agencies.\n\n`;
      document += `SECTION 2872\n`;
      document += `If an employment agreement entered into after January 1, 1980, contains a provision requiring the employee to assign or offer to assign any of his or her rights in any invention to his or her employer, the employer must also, at the time the agreement is made, provide a written notification to the employee that the agreement does not apply to an invention which qualifies fully under the provisions of Section 2870. In any suit or action arising thereunder, the burden of proof shall be on the employee claiming the benefits of its provisions.\n`;
    }
    
    return document;
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    
    // Format: Month Day, Year
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Function to determine which sections to highlight based on the last changed field
  const getSectionToHighlight = () => {
    const basicInfoFields = [
      'employerName', 'employerAddress', 'employerEIN', 'employeeName', 'employeeAddress', 
      'employeeEmail', 'employeePhone', 'startDate', 'position', 'reportingTo', 
      'employmentType', 'isExempt', 'workLocation', 'customWorkLocation', 
      'atWillEmployment', 'probationPeriod', 'backgroundCheck', 'drugTest', 'employmentEligibility'
    ];
    
    const compensationFields = [
      'compensationType', 'salaryAmount', 'salaryPeriod', 'hourlyRate', 
      'overtimeEligible', 'overtimeRate', 'doubleTimeEligible', 'mealBreakPremium',
      'restBreakPremium', 'commissionRate', 'commissionStructure', 
      'bonusEligible', 'bonusStructure', 'equityEligible', 'equityDetails',
      'paymentFrequency', 'paymentMethod', 'expenseReimbursement', 'businessExpenses',
      'travelExpenses', 'telecomExpenses', 'finalPayoutTerms', 'customFinalPayoutTerms'
    ];
    
    const benefitFields = [
      'ptoPolicy', 'ptoAmount', 'ptoCarryover', 'ptoCarryoverLimit', 'ptoAccrualRate',
      'paidHolidays', 'sickLeavePolicy', 'sickLeaveAmount', 'sickLeaveAccrual', 
      'sickLeaveAccrualRate', 'healthInsurance', 'healthInsuranceContribution',
      'healthInsuranceWaitingPeriod', 'healthInsuranceDetails', 'retirementPlan',
      'retirementPlanDetails', 'fmlaEligible', 'cfraEligible', 'pdlEligible', 
      'paidFamilyLeave', 'workerComp', 'disabilityInsurance', 'otherBenefits'
    ];
    
    const workScheduleFields = [
      'hoursPerWeek', 'workSchedule', 'customSchedule', 'mealBreaks',
      'mealBreakDuration', 'mealBreakPaid', 'mealBreaksWaiver', 'restBreaks',
      'restBreakDuration', 'lactationAccommodation', 'reportingTimePay',
      'splitShiftPremium', 'callbackPay', 'onCallPay'
    ];
    
    const remoteWorkFields = [
      'remoteWorkPolicy', 'remoteWorkEquipment', 'remoteWorkEquipmentDetails',
      'remoteWorkExpenses', 'remoteWorkTimeRecording', 'customTimeRecordingMethod',
      'remoteWorkSecurity', 'remoteWorkSecurityDetails'
    ];
    
    const covidFields = [
      'covidSafetyMeasures', 'covidSafetyDetails', 'covidVaccination',
      'covidVaccinationDetails', 'covidTesting', 'covidTestingDetails',
      'covidQuarantine', 'covidQuarantineDetails', 'covidLeave', 'covidLeaveDetails'
    ];
    
    const dutiesFields = [
      'dutiesDescription', 'performanceReview', 'performanceReviewFrequency',
      'performanceMetrics', 'trainingRequirements', 'trainingDetails'
    ];
    
    const ipFields = [
      'confidentialityAgreement', 'confidentialityScope', 'confidentialityExclusions',
      'ipAssignment', 'ipAssignmentExceptions', 'ipAssignmentCaliforniaCompliance',
      'tradeSecretsProtection', 'nonDisclosureTerm', 'companyProperty',
      'dataPrivacy', 'employeePrivacyProtections'
    ];
    
    const policiesFields = [
      'employeeHandbook', 'antiHarassmentPolicy', 'nonDiscriminationPolicy',
      'drugFreeWorkplace', 'workplaceViolencePolicy', 'ethicsPolicy', 
      'socialMediaPolicy', 'byodPolicy', 'byodPolicyDetails'
    ];
    
    const terminationFields = [
      'noticePeriod', 'customNoticePeriod', 'severanceIncluded',
      'severanceTerms', 'exitInterview', 'continuationOfBenefits',
      'returnOfProperty', 'finalPayRequirements', 'postEmploymentRestrictions',
      'postEmploymentRestrictionsDetails'
    ];
    
    const disputeFields = [
      'grievanceProcedure', 'grievanceProcedureDetails', 'arbitrationClause', 
      'arbitrationType', 'arbitrationCustomDetails', 'arbitrationOptOut',
      'arbitrationOptOutPeriod', 'arbitrationFees', 'classActionWaiver',
      'governingLaw', 'venueCounty', 'entireAgreement', 'nonModification', 
      'severability', 'nonWaiver', 'electronicSignatures', 'counterparts',
      'thirdPartyBeneficiaries', 'forcesMajeure', 'survivalClauses',
      'noticesMethod', 'assignmentOfRights'
    ];
    
    if (basicInfoFields.includes(lastChanged)) {
      return 'basic-info';
    } else if (compensationFields.includes(lastChanged)) {
      return 'compensation';
    } else if (benefitFields.includes(lastChanged)) {
      return 'benefits';
    } else if (workScheduleFields.includes(lastChanged)) {
      return 'work-schedule';
    } else if (remoteWorkFields.includes(lastChanged)) {
      return 'remote-work';
    } else if (covidFields.includes(lastChanged)) {
      return 'covid';
    } else if (dutiesFields.includes(lastChanged)) {
      return 'duties';
    } else if (ipFields.includes(lastChanged)) {
      return 'ip';
    } else if (policiesFields.includes(lastChanged)) {
      return 'policies';
    } else if (terminationFields.includes(lastChanged)) {
      return 'termination';
    } else if (disputeFields.includes(lastChanged)) {
      return 'dispute';
    }
    
    return null;
  };
  
  // Pattern matching for different sections
  const sectionPatterns = {
    'basic-info': /THIS EMPLOYMENT AGREEMENT.*?\n\n1\.4 Start Date[^\n]*\n\n/s,
    'compensation': /## 2\. COMPENSATION AND BENEFITS\n\n.*?(?=## 3\. WORK SCHEDULE AND BREAKS)/s,
    'benefits': /2\.7 Benefits.*?(?=## 3\. WORK SCHEDULE AND BREAKS)/s,
    'work-schedule': /## 3\. WORK SCHEDULE AND BREAKS\n\n.*?(?=## 4\. REMOTE WORK POLICY|## 5\. COVID-19 PROVISIONS|## 6\. DUTIES AND RESPONSIBILITIES)/s,
    'remote-work': /## 4\. REMOTE WORK POLICY\n\n.*?(?=## 5\. COVID-19 PROVISIONS|## 6\. DUTIES AND RESPONSIBILITIES)/s,
    'covid': /## 5\. COVID-19 PROVISIONS\n\n.*?(?=## 6\. DUTIES AND RESPONSIBILITIES)/s,
    'duties': /## 6\. DUTIES AND RESPONSIBILITIES\n\n.*?(?=## 7\. CONFIDENTIALITY AND INTELLECTUAL PROPERTY)/s,
    'ip': /## 7\. CONFIDENTIALITY AND INTELLECTUAL PROPERTY\n\n.*?(?=## 8\. COMPANY POLICIES AND COMPLIANCE)/s,
    'policies': /## 8\. COMPANY POLICIES AND COMPLIANCE\n\n.*?(?=## 9\. TERMINATION)/s,
    'termination': /## 9\. TERMINATION\n\n.*?(?=## 10\. DISPUTE RESOLUTION)/s,
    'dispute': /## 10\. DISPUTE RESOLUTION\n\n.*?(?=## 11\. MISCELLANEOUS)/s
  };

  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    const documentText = generateDocument();
    
    if (!sectionToHighlight || !sectionPatterns[sectionToHighlight]) {
      return documentText;
    }
    
    return documentText.replace(sectionPatterns[sectionToHighlight], match => 
      `<span class="highlighted-text">${match}</span>`
    );
  };

  // Generate highlighted content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

  // Function to copy text to clipboard
  const copyToClipboard = () => {
    const textToCopy = generateDocument();
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert("Document copied to clipboard!");
      })
      .catch(err => {
        console.error("Error copying to clipboard:", err);
        alert("Failed to copy to clipboard. Please try again.");
      });
  };

  // Function to download as MS Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Generate document text
      const documentText = generateDocument();
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function from docx-generator.js
      window.generateWordDoc(documentText, {
        documentTitle: "California Employment Agreement",
        fileName: formData.fileName || "California-Employment-Agreement"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Tooltip component
  const Tooltip = ({ text }) => (
    <span className="tooltip">
      <i data-feather="info" className="info-icon"></i>
      <span className="tooltip-text">{text}</span>
    </span>
  );

  // Render tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Information
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Enter the basic details of the employer and employee. This section forms the foundation of the employment agreement.</p>
            </div>
            
            <div className="section-heading">Employer Information</div>
            <div className="form-group">
              <label>Employer Name (Company Name)</label>
              <input 
                type="text" 
                name="employerName" 
                value={formData.employerName} 
                onChange={handleChange}
                placeholder="ABC Company, Inc."
              />
            </div>
            
            <div className="form-group">
              <label>Employer Address</label>
              <input 
                type="text" 
                name="employerAddress" 
                value={formData.employerAddress} 
                onChange={handleChange}
                placeholder="123 Business St., Los Angeles, CA 90001"
              />
            </div>
            
            <div className="section-heading">Employee Information</div>
            <div className="form-group">
              <label>Employee Name</label>
              <input 
                type="text" 
                name="employeeName" 
                value={formData.employeeName} 
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label>Employee Address</label>
              <input 
                type="text" 
                name="employeeAddress" 
                value={formData.employeeAddress} 
                onChange={handleChange}
                placeholder="456 Home St., Los Angeles, CA 90001"
              />
            </div>
            
            <div className="section-heading">Employment Details</div>
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange}
              />
              <div className="hint">The date when employment will begin.</div>
            </div>
            
            <div className="form-group">
              <label>Position / Job Title</label>
              <input 
                type="text" 
                name="position" 
                value={formData.position} 
                onChange={handleChange}
                placeholder="Software Engineer"
              />
            </div>
            
            <div className="form-group">
              <label>Reporting To (Title)</label>
              <input 
                type="text" 
                name="reportingTo" 
                value={formData.reportingTo} 
                onChange={handleChange}
                placeholder="Chief Technology Officer"
              />
              <div className="hint">The title of the person the employee will report to.</div>
            </div>
            
            <div className="form-group">
              <label>Employment Type</label>
              <select 
                name="employmentType" 
                value={formData.employmentType} 
                onChange={handleChange}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Independent Contractor</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Work Location</label>
              <select 
                name="workLocation" 
                value={formData.workLocation} 
                onChange={handleChange}
              >
                <option value="office">Office</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            {formData.workLocation === "custom" && (
              <div className="form-group">
                <label>Custom Work Location</label>
                <input 
                  type="text" 
                  name="customWorkLocation" 
                  value={formData.customWorkLocation} 
                  onChange={handleChange}
                  placeholder="Describe the work location arrangement"
                />
              </div>
            )}
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="atWillEmployment" 
                    checked={formData.atWillEmployment} 
                    onChange={handleChange}
                  />
                  At-Will Employment
                </label>
                <div className="hint">In California, employment is presumed to be "at-will" unless specified otherwise. At-will employment means either the employer or employee may terminate the employment relationship at any time, with or without cause or notice.</div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Probation Period (days)</label>
              <input 
                type="number" 
                name="probationPeriod" 
                value={formData.probationPeriod} 
                onChange={handleChange}
                min="0"
                placeholder="90"
              />
              <div className="hint">Enter 0 for no probation period. Typical probation periods are 30, 60, or 90 days.</div>
            </div>
          </div>
        );
        
      case 1: // Compensation
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Define the compensation structure for the employee, including salary, hourly rate, commissions, bonuses, and payment details.</p>
            </div>
            
            <div className="form-group">
              <label>Compensation Type</label>
              <select 
                name="compensationType" 
                value={formData.compensationType} 
                onChange={handleChange}
              >
                <option value="salary">Salary</option>
                <option value="hourly">Hourly</option>
                <option value="commission">Commission Only</option>
                <option value="mixed">Salary + Commission</option>
              </select>
            </div>
            
            {(formData.compensationType === "salary" || formData.compensationType === "mixed") && (
              <>
                <div className="form-group">
                  <label>Salary Amount ($)</label>
                  <input 
                    type="number" 
                    name="salaryAmount" 
                    value={formData.salaryAmount} 
                    onChange={handleChange}
                    placeholder="75000"
                  />
                </div>
                
                <div className="form-group">
                  <label>Salary Period</label>
                  <select 
                    name="salaryPeriod" 
                    value={formData.salaryPeriod} 
                    onChange={handleChange}
                  >
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                  </select>
                </div>
              </>
            )}
            
            {(formData.compensationType === "hourly") && (
              <div className="form-group">
                <label>Hourly Rate ($)</label>
                <input 
                  type="number" 
                  name="hourlyRate" 
                  value={formData.hourlyRate} 
                  onChange={handleChange}
                  placeholder="25.00"
                  step="0.01"
                />
              </div>
            )}
            
            {(formData.compensationType === "hourly" || formData.compensationType === "mixed") && (
              <>
                <div className="form-group">
                  <label>Eligible for Overtime</label>
                  <select 
                    name="overtimeEligible" 
                    value={formData.overtimeEligible} 
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No (Exempt)</option>
                  </select>
                  <div className="hint">In California, non-exempt employees must receive overtime pay for hours worked in excess of 8 hours in a day or 40 hours in a week. Most hourly employees are non-exempt.</div>
                </div>
                
                {formData.overtimeEligible === "yes" && (
                  <div className="form-group">
                    <label>Overtime Rate Multiplier</label>
                    <select 
                      name="overtimeRate" 
                      value={formData.overtimeRate} 
                      onChange={handleChange}
                    >
                      <option value="1.5">1.5x (Time and a Half)</option>
                      <option value="2">2x (Double Time)</option>
                    </select>
                    <div className="hint">In California, hours worked beyond 8 in a day or 40 in a week are paid at 1.5x. Hours worked beyond 12 in a day or 8 on the 7th consecutive workday are paid at 2x.</div>
                  </div>
                )}
              </>
            )}
            
            {(formData.compensationType === "commission" || formData.compensationType === "mixed") && (
              <>
                <div className="form-group">
                  <label>Commission Rate (%)</label>
                  <input 
                    type="text" 
                    name="commissionRate" 
                    value={formData.commissionRate} 
                    onChange={handleChange}
                    placeholder="5%"
                  />
                </div>
                
                <div className="form-group">
                  <label>Commission Structure</label>
                  <textarea 
                    name="commissionStructure" 
                    value={formData.commissionStructure} 
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the commission structure in detail, including eligibility requirements, calculation methods, and payment timing."
                  ></textarea>
                </div>
              </>
            )}
            
            <div className="form-group">
              <label>Eligible for Bonus</label>
              <select 
                name="bonusEligible" 
                value={formData.bonusEligible} 
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            
            {formData.bonusEligible === "yes" && (
              <div className="form-group">
                <label>Bonus Structure</label>
                <textarea 
                  name="bonusStructure" 
                  value={formData.bonusStructure} 
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the bonus structure in detail, including eligibility requirements, calculation methods, and payment timing."
                ></textarea>
              </div>
            )}
            
            <div className="form-group">
              <label>Eligible for Equity</label>
              <select 
                name="equityEligible" 
                value={formData.equityEligible} 
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            
            {formData.equityEligible === "yes" && (
              <div className="form-group">
                <label>Equity Details</label>
                <textarea 
                  name="equityDetails" 
                  value={formData.equityDetails} 
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the equity package in detail, including type of equity (stock options, RSUs, etc.), amount, vesting schedule, and any other relevant terms."
                ></textarea>
              </div>
            )}
            
            <div className="section-heading">Payment Details</div>
            
            <div className="form-group">
              <label>Payment Frequency</label>
              <select 
                name="paymentFrequency" 
                value={formData.paymentFrequency} 
                onChange={handleChange}
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="semi-monthly">Semi-Monthly (15th and 30th)</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Payment Method</label>
              <select 
                name="paymentMethod" 
                value={formData.paymentMethod} 
                onChange={handleChange}
              >
                <option value="direct-deposit">Direct Deposit</option>
                <option value="check">Check</option>
              </select>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="expenseReimbursement" 
                    checked={formData.expenseReimbursement} 
                    onChange={handleChange}
                  />
                  Include Expense Reimbursement Policy
                </label>
                <div className="hint">In California, employers must reimburse employees for all necessary expenditures or losses incurred in the direct discharge of their duties.</div>
              </div>
            </div>
          </div>
        );
        
      case 2: // Benefits
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Define the benefits provided to the employee, including time off, insurance, retirement plans, and other perks.</p>
            </div>
            
            <div className="section-heading">Paid Time Off (PTO)</div>
            
            <div className="form-group">
              <label>PTO Policy</label>
              <select 
                name="ptoPolicy" 
                value={formData.ptoPolicy} 
                onChange={handleChange}
              >
                <option value="accrual">Accrual-Based</option>
                <option value="lump-sum">Lump Sum</option>
                <option value="unlimited">Unlimited</option>
                <option value="none">No PTO</option>
              </select>
              <div className="hint">Accrual-based means the employee earns PTO gradually over time. Lump sum means the employee receives all PTO at once at the beginning of the year.</div>
            </div>
            
            {(formData.ptoPolicy === "accrual" || formData.ptoPolicy === "lump-sum") && (
              <div className="form-group">
                <label>PTO Amount (days per year)</label>
                <input 
                  type="number" 
                  name="ptoAmount" 
                  value={formData.ptoAmount} 
                  onChange={handleChange}
                  min="0"
                  placeholder="10"
                />
              </div>
            )}
            
            <div className="section-heading">Sick Leave</div>
            
            <div className="form-group">
              <label>Sick Leave Policy</label>
              <select 
                name="sickLeavePolicy" 
                value={formData.sickLeavePolicy} 
                onChange={handleChange}
              >
                <option value="legal-minimum">California Legal Minimum</option>
                <option value="enhanced">Enhanced Sick Leave</option>
                <option value="combined-with-pto">Combined with PTO</option>
              </select>
              <div className="hint">California requires employers to provide at least 3 days (24 hours) of paid sick leave per year. Some local ordinances may require more.</div>
            </div>
            
            {formData.sickLeavePolicy === "enhanced" && (
              <div className="form-group">
                <label>Sick Leave Amount (days per year)</label>
                <input 
                  type="number" 
                  name="sickLeaveAmount" 
                  value={formData.sickLeaveAmount} 
                  onChange={handleChange}
                  min="3"
                  placeholder="5"
                />
                <div className="hint">Must be at least 3 days (24 hours) to comply with California law.</div>
              </div>
            )}
            
            <div className="section-heading">Health Insurance</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="healthInsurance" 
                    checked={formData.healthInsurance} 
                    onChange={handleChange}
                  />
                  Provide Health Insurance
                </label>
              </div>
            </div>
            
            {formData.healthInsurance && (
              <div className="form-group">
                <label>Health Insurance Details</label>
                <textarea 
                  name="healthInsuranceDetails" 
                  value={formData.healthInsuranceDetails} 
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the health insurance benefits, including medical, dental, vision, employee contributions, etc."
                ></textarea>
              </div>
            )}
            
            <div className="section-heading">Retirement Plan</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="retirementPlan" 
                    checked={formData.retirementPlan} 
                    onChange={handleChange}
                  />
                  Provide Retirement Plan
                </label>
              </div>
            </div>
            
            {formData.retirementPlan && (
              <div className="form-group">
                <label>Retirement Plan Details</label>
                <textarea 
                  name="retirementPlanDetails" 
                  value={formData.retirementPlanDetails} 
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the retirement plan benefits, including employer contributions, matching, vesting schedule, etc."
                ></textarea>
              </div>
            )}
            
            <div className="section-heading">Other Benefits</div>
            
            <div className="form-group">
              <label>Other Benefits (Optional)</label>
              <textarea 
                name="otherBenefits" 
                value={formData.otherBenefits} 
                onChange={handleChange}
                rows="4"
                placeholder="Describe any other benefits provided, such as professional development, education reimbursement, wellness programs, transportation benefits, etc."
              ></textarea>
            </div>
          </div>
        );
        
      case 3: // Duties & Schedule
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Define the employee's duties, responsibilities, work schedule, and performance expectations.</p>
            </div>
            
            <div className="section-heading">Job Duties</div>
            
            <div className="form-group">
              <label>Duties Description (Optional)</label>
              <textarea 
                name="dutiesDescription" 
                value={formData.dutiesDescription} 
                onChange={handleChange}
                rows="4"
                placeholder="Provide a description of the employee's duties and responsibilities. Leave blank to use standard language."
              ></textarea>
              <div className="hint">Describe the essential duties and responsibilities of the position. If left blank, standard language will be used.</div>
            </div>
            
            <div className="section-heading">Work Schedule</div>
            
            <div className="form-group">
              <label>Hours Per Week</label>
              <input 
                type="number" 
                name="hoursPerWeek" 
                value={formData.hoursPerWeek} 
                onChange={handleChange}
                min="1"
                placeholder="40"
              />
            </div>
            
            <div className="form-group">
              <label>Work Schedule</label>
              <select 
                name="workSchedule" 
                value={formData.workSchedule} 
                onChange={handleChange}
              >
                <option value="standard">Standard (M-F, 9-5)</option>
                <option value="flexible">Flexible Hours</option>
                <option value="custom">Custom Schedule</option>
              </select>
            </div>
            
            {formData.workSchedule === "custom" && (
              <div className="form-group">
                <label>Custom Schedule Details</label>
                <textarea 
                  name="customSchedule" 
                  value={formData.customSchedule} 
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the custom work schedule, including days, hours, and any flexibility."
                ></textarea>
              </div>
            )}
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="mealBreaks" 
                    checked={formData.mealBreaks} 
                    onChange={handleChange}
                  />
                  Include Meal Breaks Language
                </label>
                <div className="hint">In California, employees who work more than 5 hours are entitled to a 30-minute meal break. Employees who work more than 10 hours are entitled to a second 30-minute meal break.</div>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="restBreaks" 
                    checked={formData.restBreaks} 
                    onChange={handleChange}
                  />
                  Include Rest Breaks Language
                </label>
                <div className="hint">In California, employees are entitled to a 10-minute paid rest break for every 4 hours worked or major fraction thereof.</div>
              </div>
            </div>
            
            <div className="section-heading">Performance Evaluation</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="performanceReview" 
                    checked={formData.performanceReview} 
                    onChange={handleChange}
                  />
                  Include Performance Review
                </label>
              </div>
            </div>
            
            {formData.performanceReview && (
              <div className="form-group">
                <label>Performance Review Frequency</label>
                <select 
                  name="performanceReviewFrequency" 
                  value={formData.performanceReviewFrequency} 
                  onChange={handleChange}
                >
                  <option value="quarterly">Quarterly</option>
                  <option value="semi-annual">Semi-Annual</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            )}
          </div>
        );
        
      case 4: // IP & Confidentiality
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Define how intellectual property, confidentiality, and trade secrets will be handled in the employment relationship.</p>
            </div>
            
            <div className="section-heading">Confidentiality</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="confidentialityAgreement" 
                    checked={formData.confidentialityAgreement} 
                    onChange={handleChange}
                  />
                  Include Confidentiality Agreement
                </label>
                <div className="hint">A confidentiality agreement prohibits the employee from disclosing the employer's confidential information during and after employment.</div>
              </div>
            </div>
            
            {formData.confidentialityAgreement && (
              <div className="form-group">
                <label>Confidentiality Scope</label>
                <select 
                  name="confidentialityScope" 
                  value={formData.confidentialityScope} 
                  onChange={handleChange}
                >
                  <option value="standard">Standard</option>
                  <option value="enhanced">Enhanced</option>
                </select>
                <div className="hint">Enhanced scope includes additional provisions regarding return of information and remedies for breach.</div>
              </div>
            )}
            
            <div className="section-heading">Intellectual Property</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="ipAssignment" 
                    checked={formData.ipAssignment} 
                    onChange={handleChange}
                  />
                  Include IP Assignment Provisions
                </label>
                <div className="hint">IP assignment provisions ensure that intellectual property created by the employee in the course of employment belongs to the employer. In California, this is subject to Labor Code Section 2870 which protects certain employee inventions.</div>
              </div>
            </div>
            
            {formData.ipAssignment && (
              <div className="form-group">
                <label>IP Assignment Exceptions (Optional)</label>
                <textarea 
                  name="ipAssignmentExceptions" 
                  value={formData.ipAssignmentExceptions} 
                  onChange={handleChange}
                  rows="3"
                  placeholder="List any exceptions to the IP assignment, such as pre-existing intellectual property owned by the employee."
                ></textarea>
              </div>
            )}
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="tradeSecretsProtection" 
                    checked={formData.tradeSecretsProtection} 
                    onChange={handleChange}
                  />
                  Include Trade Secrets Protection
                </label>
                <div className="hint">Trade secrets protection prohibits the employee from disclosing or misappropriating the employer's trade secrets during and after employment. Includes Defend Trade Secrets Act notice.</div>
              </div>
            </div>
            
            <div className="section-heading">Company Property</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="companyProperty" 
                    checked={formData.companyProperty} 
                    onChange={handleChange}
                  />
                  Include Company Property Provisions
                </label>
                <div className="hint">Company property provisions clarify that documents, equipment, and other property provided to the employee remain the property of the employer and must be returned.</div>
              </div>
            </div>
          </div>
        );
        
      case 5: // Termination
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Define the terms and conditions for termination of employment.</p>
            </div>
            
            <div className="section-heading">Notice Period</div>
            
            <div className="form-group">
              <label>Notice Period</label>
              <select 
                name="noticePeriod" 
                value={formData.noticePeriod} 
                onChange={handleChange}
              >
                <option value="none">No Notice Required</option>
                <option value="1-week">1 Week</option>
                <option value="2-weeks">2 Weeks</option>
                <option value="30-days">30 Days</option>
                <option value="custom">Custom</option>
              </select>
              <div className="hint">This is the notice period requested for voluntary resignation by the employee. In at-will employment, notice periods are not legally required in California but are often requested as a courtesy.</div>
            </div>
            
            {formData.noticePeriod === "custom" && (
              <div className="form-group">
                <label>Custom Notice Period</label>
                <textarea 
                  name="customNoticePeriod" 
                  value={formData.customNoticePeriod} 
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the custom notice period for voluntary resignation."
                ></textarea>
              </div>
            )}
            
            <div className="section-heading">Severance</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="severanceIncluded" 
                    checked={formData.severanceIncluded} 
                    onChange={handleChange}
                  />
                  Include Severance Terms
                </label>
                <div className="hint">Severance pay is not legally required in California, but may be offered as a benefit to employees, particularly in the event of layoffs or other terminations without cause.</div>
              </div>
            </div>
            
            {formData.severanceIncluded && (
              <div className="form-group">
                <label>Severance Terms</label>
                <textarea 
                  name="severanceTerms" 
                  value={formData.severanceTerms} 
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the severance terms, including eligibility, amount, payment schedule, and any conditions such as signing a release."
                ></textarea>
              </div>
            )}
            
            <div className="section-heading">Return of Property</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="returnOfProperty" 
                    checked={formData.returnOfProperty} 
                    onChange={handleChange}
                  />
                  Include Return of Property Provisions
                </label>
                <div className="hint">Return of property provisions require the employee to return all company property upon termination of employment.</div>
              </div>
            </div>
          </div>
        );
        
      case 6: // Dispute Resolution
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Define how disputes between the employer and employee will be resolved.</p>
              <p>In California, arbitration agreements in employment must be carefully drafted to be enforceable. While mandatory arbitration agreements are allowed under federal law, they are subject to specific requirements to be valid.</p>
            </div>
            
            <div className="section-heading">Arbitration</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="arbitrationClause" 
                    checked={formData.arbitrationClause} 
                    onChange={handleChange}
                  />
                  Include Arbitration Clause
                </label>
                <div className="hint">An arbitration clause requires disputes to be resolved through arbitration rather than court litigation. In California, arbitration agreements must meet specific requirements to be enforceable, including procedural and substantive fairness, and employers must pay arbitration fees.</div>
              </div>
            </div>
            
            {formData.arbitrationClause && (
              <>
                <div className="form-group">
                  <label>Arbitration Type</label>
                  <select 
                    name="arbitrationType" 
                    value={formData.arbitrationType} 
                    onChange={handleChange}
                  >
                    <option value="jams">JAMS</option>
                    <option value="aaa">American Arbitration Association (AAA)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                {formData.arbitrationType === "custom" && (
                  <div className="form-group">
                    <label>Custom Arbitration Details</label>
                    <textarea 
                      name="arbitrationCustomDetails" 
                      value={formData.arbitrationCustomDetails} 
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe the custom arbitration procedure, including selection of arbitrator, rules, location, etc."
                    ></textarea>
                  </div>
                )}
              </>
            )}
            
            <div className="section-heading">Governing Law</div>
            
            <div className="form-group">
              <label>Governing Law</label>
              <select 
                name="governingLaw" 
                value={formData.governingLaw} 
                onChange={handleChange}
              >
                <option value="California">California</option>
              </select>
              <div className="hint">For California employees, California law generally applies regardless of choice of law provisions.</div>
            </div>
            
            <div className="section-heading">Standard Legal Provisions</div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="entireAgreement" 
                    checked={formData.entireAgreement} 
                    onChange={handleChange}
                  />
                  Include Entire Agreement Clause
                </label>
                <div className="hint">An entire agreement clause states that the agreement constitutes the entire understanding between the parties and supersedes all prior agreements.</div>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="nonModification" 
                    checked={formData.nonModification} 
                    onChange={handleChange}
                  />
                  Include Non-Modification Clause
                </label>
                <div className="hint">A non-modification clause states that the agreement may not be amended except by a written instrument signed by both parties.</div>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="severability" 
                    checked={formData.severability} 
                    onChange={handleChange}
                  />
                  Include Severability Clause
                </label>
                <div className="hint">A severability clause states that if any provision of the agreement is found to be invalid, the remaining provisions will remain in effect.</div>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="nonWaiver" 
                    checked={formData.nonWaiver} 
                    onChange={handleChange}
                  />
                  Include Non-Waiver Clause
                </label>
                <div className="hint">A non-waiver clause states that the failure to enforce any provision does not constitute a waiver of the right to enforce that provision in the future.</div>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="electronicSignatures" 
                    checked={formData.electronicSignatures} 
                    onChange={handleChange}
                  />
                  Include Electronic Signatures Clause
                </label>
                <div className="hint">An electronic signatures clause states that electronic signatures are as valid and binding as handwritten signatures.</div>
              </div>
            </div>
          </div>
        );
        
      case 7: // Finalize
        return (
          <div className="tab-content">
            <div className="section-info">
              <p><i data-feather="info" className="info-icon"></i> Review and finalize your California Employment Agreement. You can download it as a Word document or copy the text to your clipboard.</p>
            </div>
            
            <div className="section-heading">Document Options</div>
            
            <div className="form-group">
              <label>File Name</label>
              <input 
                type="text" 
                name="fileName" 
                value={formData.fileName} 
                onChange={handleChange}
                placeholder="California-Employment-Agreement"
              />
              <div className="hint">Enter the filename for the Word document (without the .doc extension).</div>
            </div>
            
            <div className="section-heading">Legal Disclaimer</div>
            
            <div className="section-info">
              <p>This document is provided as a template and does not constitute legal advice. Employment laws vary by location and change over time. It is recommended that you consult with an attorney to ensure your employment agreement complies with current laws and meets your specific needs.</p>
              <p>For professional legal assistance, you can schedule a consultation by clicking on "Schedule time with me" below.</p>
              <p style={{ marginTop: '15px' }}>
                <a href="" onClick={() => Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;} style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>
                  <i data-feather="calendar" style={{ verticalAlign: 'middle', marginRight: '5px' }}></i> Schedule time with me
                </a>
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>California Employment Agreement Generator</h1>
        <p>Create a customized employment agreement that complies with California law. This generator helps you draft a comprehensive employment agreement for your California employees.</p>
      </div>
      
      <div className="main-content">
        <div className="form-panel">
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
          
          {renderTabContent()}
          
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <i data-feather="chevron-left" style={{marginRight: "0.25rem"}}></i>
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
              <i data-feather="copy" style={{marginRight: "0.25rem"}}></i>
              Copy to Clipboard
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
              <i data-feather="file-text" style={{marginRight: "0.25rem"}}></i>
              Download MS Word
            </button>
            
            <button
              onClick={nextTab}
              className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
              disabled={currentTab === tabs.length - 1}
            >
              Next
              <i data-feather="chevron-right" style={{marginLeft: "0.25rem"}}></i>
            </button>
          </div>
        </div>
        
        <div className="preview-panel" ref={previewRef}>
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>
      
      <div className="footer">
        <p>© {new Date().getFullYear()} terms.law | California Bar #279869 | <a href="https://terms.law/call/" target="_blank">Book a Consultation</a></p>
      </div>
    </div>
  );
};

// Mount the React app
ReactDOM.render(<App />, document.getElementById('root'));
