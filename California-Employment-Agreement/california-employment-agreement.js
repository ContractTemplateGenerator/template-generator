// California Employment Agreement Generator

const App = () => {
  // State for form data
  const [formData, setFormData] = React.useState({
    // Basic Information
    employerName: "",
    employerAddress: "",
    employeeName: "",
    employeeAddress: "",
    startDate: "",
    position: "",
    reportingTo: "",
    employmentType: "full-time", // full-time, part-time, contract
    workLocation: "office", // office, remote, hybrid
    customWorkLocation: "",
    atWillEmployment: true,
    probationPeriod: "90",

    // Compensation
    compensationType: "salary", // salary, hourly, commission, mixed
    salaryAmount: "",
    salaryPeriod: "annual", // annual, monthly, bi-weekly
    hourlyRate: "",
    overtimeEligible: "yes",
    overtimeRate: "1.5",
    commissionRate: "",
    commissionStructure: "",
    bonusEligible: "no",
    bonusStructure: "",
    equityEligible: "no",
    equityDetails: "",
    paymentFrequency: "bi-weekly", // weekly, bi-weekly, monthly, semi-monthly
    paymentMethod: "direct-deposit", // direct-deposit, check
    expenseReimbursement: true,

    // Benefits
    ptoPolicy: "accrual", // accrual, lump-sum, unlimited, none
    ptoAmount: "10",
    sickLeavePolicy: "legal-minimum", // legal-minimum, enhanced, combined-with-pto
    sickLeaveAmount: "3",
    healthInsurance: true,
    healthInsuranceDetails: "Standard company health insurance plan including medical, dental, and vision coverage.",
    retirementPlan: true,
    retirementPlanDetails: "401(k) plan with up to 3% employer match.",
    otherBenefits: "",
    
    // Work Schedule
    hoursPerWeek: "40",
    workSchedule: "standard", // standard, flexible, custom
    customSchedule: "",
    mealBreaks: true,
    restBreaks: true,
    
    // Duties and Expectations
    dutiesDescription: "",
    performanceReview: true,
    performanceReviewFrequency: "annual", // quarterly, semi-annual, annual
    
    // Confidentiality & IP
    confidentialityAgreement: true,
    confidentialityScope: "standard", // standard, enhanced
    ipAssignment: true,
    ipAssignmentExceptions: "",
    tradeSecretsProtection: true,
    companyProperty: true,
    
    // Termination
    noticePeriod: "2-weeks", // none, 1-week, 2-weeks, 30-days, custom
    customNoticePeriod: "",
    severanceIncluded: false,
    severanceTerms: "",
    returnOfProperty: true,
    
    // Dispute Resolution
    arbitrationClause: false,
    arbitrationType: "jams", // jams, aaa, custom
    arbitrationCustomDetails: "",
    governingLaw: "California",
    
    // Miscellaneous
    entireAgreement: true,
    nonModification: true,
    severability: true,
    nonWaiver: true,
    electronicSignatures: true,
    
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
    { id: 'duties', label: 'Duties & Schedule' },
    { id: 'ip-confidentiality', label: 'IP & Confidentiality' },
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
    document += `THIS EMPLOYMENT AGREEMENT (the "Agreement") is made and entered into as of ${formatDate(formData.startDate)} by and between ${formData.employerName} (the "Employer"), with an address at ${formData.employerAddress}, and ${formData.employeeName} (the "Employee"), with an address at ${formData.employeeAddress}.\n\n`;
    
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
    
    document += `1.1 Position. The Employer hereby employs the Employee, and the Employee hereby accepts employment with the Employer, as a ${formData.position} on a ${employmentTypeText} basis ${workLocationText}. The Employee shall report directly to the ${formData.reportingTo}.\n\n`;
    
    // At-will employment
    if (formData.atWillEmployment) {
      document += `1.2 At-Will Employment. The Employee's employment with the Employer is at-will. This means that either the Employee or the Employer may terminate the employment relationship at any time, with or without cause, and with or without notice. Nothing in this Agreement or in any oral or written statement shall limit the right to terminate at-will employment. No manager, supervisor, or employee of the Employer has any authority to enter into an agreement for employment for any specified period of time or to make an agreement for employment other than at-will.\n\n`;
    }
    
    // Probation period
    if (formData.probationPeriod && formData.probationPeriod !== "0") {
      document += `1.3 Probationary Period. The Employee's first ${formData.probationPeriod} days of employment shall be considered a probationary period. During this period, the Employer will evaluate the Employee's performance. During this probationary period, the Employee remains an at-will employee.\n\n`;
    }
    
    // Start date
    document += `1.4 Start Date. The Employee's employment under this Agreement shall begin on ${formatDate(formData.startDate)} (the "Start Date").\n\n`;
    
    // Compensation Section
    document += `## 2. COMPENSATION AND BENEFITS\n\n`;
    
    // Compensation type
    if (formData.compensationType === "salary") {
      document += `2.1 Base Salary. The Employer shall pay the Employee a base salary of $${formData.salaryAmount} per ${formData.salaryPeriod === "annual" ? "year" : formData.salaryPeriod === "monthly" ? "month" : "bi-weekly period"}, payable in accordance with the Employer's standard payroll procedures, subject to all applicable withholdings and deductions required by law.\n\n`;
    } else if (formData.compensationType === "hourly") {
      document += `2.1 Hourly Rate. The Employer shall pay the Employee at an hourly rate of $${formData.hourlyRate} per hour, payable in accordance with the Employer's standard payroll procedures, subject to all applicable withholdings and deductions required by law.\n\n`;
      
      // Overtime
      if (formData.overtimeEligible === "yes") {
        document += `2.2 Overtime. The Employee shall be eligible for overtime pay at a rate of ${formData.overtimeRate} times the Employee's regular hourly rate for all hours worked in excess of 8 hours in a workday or 40 hours in a workweek, in accordance with California law.\n\n`;
      } else {
        document += `2.2 Overtime. Based on the Employee's job duties and compensation, the Employee is classified as exempt from overtime under applicable law.\n\n`;
      }
    } else if (formData.compensationType === "commission") {
      document += `2.1 Commission. The Employee shall be paid on a commission basis according to the following structure: ${formData.commissionStructure}.\n\n`;
    } else if (formData.compensationType === "mixed") {
      document += `2.1 Compensation. The Employee shall receive a base salary of $${formData.salaryAmount} per ${formData.salaryPeriod === "annual" ? "year" : formData.salaryPeriod === "monthly" ? "month" : "bi-weekly period"}, plus commission at a rate of ${formData.commissionRate} based on the following structure: ${formData.commissionStructure}.\n\n`;
      
      // Overtime
      if (formData.overtimeEligible === "yes") {
        document += `2.2 Overtime. The Employee shall be eligible for overtime pay at a rate of ${formData.overtimeRate} times the Employee's regular hourly rate for all hours worked in excess of 8 hours in a workday or 40 hours in a workweek, in accordance with California law.\n\n`;
      }
    }
    
    // Bonus
    if (formData.bonusEligible === "yes") {
      document += `2.3 Bonus. The Employee may be eligible to receive bonuses according to the following structure: ${formData.bonusStructure}. All bonuses are discretionary unless expressly stated otherwise.\n\n`;
    }
    
    // Equity
    if (formData.equityEligible === "yes") {
      document += `2.4 Equity. The Employee may be eligible to participate in the Employer's equity program according to the following terms: ${formData.equityDetails}. Any equity grant shall be subject to the terms and conditions of the Employer's equity plan and applicable grant agreements.\n\n`;
    }
    
    // Payment information
    document += `2.5 Payment Schedule. The Employee shall be paid on a ${formData.paymentFrequency} basis via ${formData.paymentMethod}.\n\n`;
    
    // Expense reimbursement
    if (formData.expenseReimbursement) {
      document += `2.6 Expense Reimbursement. The Employer shall reimburse the Employee for all reasonable and necessary expenses incurred by the Employee in connection with the performance of the Employee's duties and responsibilities, subject to the Employer's expense reimbursement policies and procedures.\n\n`;
    }
    
    // Benefits
    document += `2.7 Benefits. The Employee shall be eligible to participate in the Employer's benefit programs, subject to the terms and conditions of the applicable plan documents and policies. The Employer reserves the right to amend, modify, or terminate any of its benefit plans or programs at any time.\n\n`;
    
    // PTO
    if (formData.ptoPolicy === "accrual") {
      document += `2.8 Paid Time Off (PTO). The Employee shall accrue paid time off at a rate equivalent to ${formData.ptoAmount} days per year, in accordance with the Employer's PTO policy.\n\n`;
    } else if (formData.ptoPolicy === "lump-sum") {
      document += `2.8 Paid Time Off (PTO). The Employee shall receive ${formData.ptoAmount} days of paid time off per year, which shall be available at the beginning of each calendar year, in accordance with the Employer's PTO policy.\n\n`;
    } else if (formData.ptoPolicy === "unlimited") {
      document += `2.8 Paid Time Off (PTO). The Employee shall be eligible for the Employer's unlimited paid time off policy, which allows the Employee to take time off as needed, subject to business needs and manager approval.\n\n`;
    } else if (formData.ptoPolicy === "none") {
      document += `2.8 Paid Time Off (PTO). The Employee shall not be eligible for paid time off.\n\n`;
    }
    
    // Sick Leave
    if (formData.sickLeavePolicy === "legal-minimum") {
      document += `2.9 Sick Leave. The Employee shall be eligible for sick leave in accordance with California state law and local ordinances.\n\n`;
    } else if (formData.sickLeavePolicy === "enhanced") {
      document += `2.9 Sick Leave. The Employee shall be eligible for ${formData.sickLeaveAmount} days of paid sick leave per year, in accordance with the Employer's sick leave policy and applicable law.\n\n`;
    } else if (formData.sickLeavePolicy === "combined-with-pto") {
      document += `2.9 Sick Leave. Sick leave is combined with the Employee's PTO allocation as described in Section 2.8 above.\n\n`;
    }
    
    // Health Insurance
    if (formData.healthInsurance) {
      document += `2.10 Health Insurance. The Employee shall be eligible to participate in the Employer's health insurance plans, subject to the terms and conditions of the applicable plan documents. ${formData.healthInsuranceDetails}\n\n`;
    }
    
    // Retirement Plan
    if (formData.retirementPlan) {
      document += `2.11 Retirement Plan. The Employee shall be eligible to participate in the Employer's retirement plan, subject to the terms and conditions of the applicable plan documents. ${formData.retirementPlanDetails}\n\n`;
    }
    
    // Other Benefits
    if (formData.otherBenefits) {
      document += `2.12 Other Benefits. ${formData.otherBenefits}\n\n`;
    }
    
    // Duties and Responsibilities Section
    document += `## 3. DUTIES AND RESPONSIBILITIES\n\n`;
    
    // Job duties
    document += `3.1 Duties and Responsibilities. The Employee shall perform all duties and responsibilities associated with the position of ${formData.position}, as well as such other duties as may be assigned by the Employer from time to time. ${formData.dutiesDescription ? formData.dutiesDescription : "The Employee shall perform these duties to the best of the Employee's ability and in compliance with all applicable laws, rules, regulations, and Employer policies."}\n\n`;
    
    // Work Schedule
    document += `3.2 Work Schedule. `;
    
    if (formData.workSchedule === "standard") {
      document += `The Employee shall work a standard schedule of approximately ${formData.hoursPerWeek} hours per week, Monday through Friday, 9:00 AM to 5:00 PM, or as otherwise determined by the Employer.\n\n`;
    } else if (formData.workSchedule === "flexible") {
      document += `The Employee shall work approximately ${formData.hoursPerWeek} hours per week on a flexible schedule, subject to the requirements of the position and as approved by the Employer.\n\n`;
    } else if (formData.workSchedule === "custom") {
      document += `${formData.customSchedule}\n\n`;
    }
    
    // Breaks
    if (formData.mealBreaks || formData.restBreaks) {
      document += `3.3 Breaks. `;
      
      if (formData.mealBreaks) {
        document += `The Employee shall be entitled to meal breaks in accordance with California law. `;
      }
      
      if (formData.restBreaks) {
        document += `The Employee shall be entitled to rest breaks in accordance with California law.`;
      }
      
      document += `\n\n`;
    }
    
    // Performance Reviews
    if (formData.performanceReview) {
      document += `3.4 Performance Reviews. The Employee's performance shall be reviewed ${formData.performanceReviewFrequency === "quarterly" ? "quarterly" : formData.performanceReviewFrequency === "semi-annual" ? "semi-annually" : "annually"}. These reviews may be used to determine potential salary adjustments, bonuses, areas for improvement, and career development opportunities.\n\n`;
    }
    
    // Confidentiality and IP Section
    document += `## 4. CONFIDENTIALITY AND INTELLECTUAL PROPERTY\n\n`;
    
    // Confidentiality
    if (formData.confidentialityAgreement) {
      document += `4.1 Confidential Information. During the course of employment, the Employee will have access to confidential and proprietary information relating to the Employer's business ("Confidential Information"). Confidential Information includes, but is not limited to, trade secrets, business plans, marketing strategies, customer lists, financial information, product information, and other proprietary information identified as confidential by the Employer.\n\n`;
      
      document += `4.2 Non-Disclosure. The Employee agrees not to disclose any Confidential Information to any person or entity, except as required in the course of performing duties for the Employer or as required by law. This obligation shall continue during the term of employment and at all times thereafter. The Employee shall not use any Confidential Information for personal benefit or for the benefit of any third party.\n\n`;
      
      if (formData.confidentialityScope === "enhanced") {
        document += `4.3 Return of Information. Upon termination of employment, or at any time upon the Employer's request, the Employee shall return to the Employer all Confidential Information in the Employee's possession, custody, or control, including all copies, notes, or extracts thereof.\n\n`;
        
        document += `4.4 Remedies. The Employee acknowledges that any breach of the confidentiality provisions of this Agreement would cause irreparable harm to the Employer, and that monetary damages would not provide an adequate remedy. Accordingly, in addition to any other remedies available, the Employer shall be entitled to seek injunctive relief to enforce these provisions.\n\n`;
      }
    }
    
    // Trade Secrets Protection
    if (formData.tradeSecretsProtection) {
      document += `4.5 Trade Secrets. The Employee acknowledges that trade secrets are a valuable asset of the Employer. The Employee shall not disclose, use, or misappropriate any trade secret of the Employer, either during or after employment. This provision does not limit any rights the Employee may have under the Defend Trade Secrets Act, including immunity for disclosures made solely for the purpose of reporting or investigating a suspected violation of law.\n\n`;
      
      document += `4.6 Defend Trade Secrets Act Notice. In compliance with the Defend Trade Secrets Act, the Employee is hereby notified that an individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that: (a) is made in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney, solely for the purpose of reporting or investigating a suspected violation of law; or (b) is made in a complaint or other document filed in a lawsuit or other proceeding, if such filing is made under seal. Further, an individual who files a lawsuit for retaliation by an employer for reporting a suspected violation of law may disclose the trade secret to the attorney of the individual and use the trade secret information in the court proceeding, if the individual (a) files any document containing the trade secret under seal; and (b) does not disclose the trade secret, except pursuant to court order.\n\n`;
    }
    
    // Intellectual Property
    if (formData.ipAssignment) {
      document += `4.7 Intellectual Property. The Employee agrees that all inventions, innovations, improvements, developments, methods, designs, analyses, drawings, reports, and all similar or related information (whether or not patentable) which (a) relate to the Employer's actual or anticipated business, research, and development, or existing or future products or services, and (b) are conceived, developed, or made by the Employee while employed by the Employer (collectively, "Work Product") belong to the Employer.\n\n`;
      
      document += `4.8 Assignment of Rights. The Employee hereby assigns to the Employer all right, title, and interest in and to all Work Product and all related intellectual property rights, including patents, trademarks, copyrights, and trade secrets. The Employee agrees to promptly disclose all Work Product to the Employer and to assist the Employer in securing and defending its intellectual property rights.\n\n`;
      
      if (formData.ipAssignmentExceptions) {
        document += `4.9 Exceptions to Assignment. The following inventions are exempt from the assignment provisions of this Agreement: ${formData.ipAssignmentExceptions}\n\n`;
      }
      
      document += `4.10 California Labor Code Section 2870. In accordance with California Labor Code Section 2870, this Agreement does not require the assignment of an invention that the Employee develops entirely on the Employee's own time without using the Employer's equipment, supplies, facilities, or trade secret information, except for those inventions that either: (a) relate at the time of conception or reduction to practice of the invention to the Employer's business, or actual or demonstrably anticipated research or development of the Employer; or (b) result from any work performed by the Employee for the Employer.\n\n`;
    }
    
    // Company Property
    if (formData.companyProperty) {
      document += `4.11 Company Property. All documents, data, records, equipment, and other physical property, whether or not pertaining to Confidential Information, which are furnished to the Employee by the Employer or are produced by the Employee in connection with the Employee's employment, shall be and remain the sole property of the Employer. The Employee agrees to return to the Employer all such materials and property as and when requested by the Employer. Upon termination of employment, the Employee shall return all such materials and property promptly without retaining any copies.\n\n`;
    }
    
    // Termination Section
    document += `## 5. TERMINATION\n\n`;
    
    // If at-will employment
    if (formData.atWillEmployment) {
      document += `5.1 At-Will Employment. As stated in Section 1.2, the Employee's employment is at-will and may be terminated by either party at any time, with or without cause, and with or without notice.\n\n`;
    }
    
    // Notice Period
    if (formData.noticePeriod !== "none") {
      document += `5.2 Notice Period. `;
      
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
      document += `5.3 Severance. ${formData.severanceTerms}\n\n`;
    }
    
    // Return of Property
    if (formData.returnOfProperty) {
      document += `5.4 Return of Property. Upon termination of employment for any reason, the Employee shall promptly return to the Employer all property belonging to the Employer, including but not limited to computers, phones, files, documents, keys, access cards, and any other Employer property in the Employee's possession or control.\n\n`;
    }
    
    // Dispute Resolution Section
    document += `## 6. DISPUTE RESOLUTION\n\n`;
    
    // Arbitration
    if (formData.arbitrationClause) {
      document += `6.1 Arbitration. Any dispute, claim, or controversy arising out of or relating to this Agreement or the Employee's employment with the Employer shall be resolved through final and binding arbitration, rather than in court. This agreement to arbitrate is governed by the Federal Arbitration Act.\n\n`;
      
      document += `6.2 Arbitration Procedure. `;
      
      if (formData.arbitrationType === "jams") {
        document += `The arbitration shall be administered by JAMS pursuant to its Employment Arbitration Rules & Procedures in effect at the time of the arbitration. The arbitration shall take place in the county where the Employee worked, before a single arbitrator selected in accordance with the JAMS rules.`;
      } else if (formData.arbitrationType === "aaa") {
        document += `The arbitration shall be administered by the American Arbitration Association (AAA) pursuant to its Employment Arbitration Rules in effect at the time of the arbitration. The arbitration shall take place in the county where the Employee worked, before a single arbitrator selected in accordance with the AAA rules.`;
      } else if (formData.arbitrationType === "custom") {
        document += `${formData.arbitrationCustomDetails}`;
      }
      
      document += `\n\n`;
      
      document += `6.3 Costs. The Employer shall pay all costs unique to arbitration, including the administrative fees and the arbitrator's fees. Each party shall bear its own attorneys' fees and costs, unless applicable law or the arbitrator provides otherwise.\n\n`;
      
      document += `6.4 Remedies. The arbitrator shall have the authority to award any remedies that would be available in a court proceeding under applicable law.\n\n`;
      
      document += `6.5 Class Action Waiver. The parties agree that any arbitration shall be conducted on an individual basis, and not as a class, collective, or representative action. There will be no right or authority for any dispute to be brought, heard, or arbitrated as a class, collective, or representative action.\n\n`;
      
      document += `6.6 Exceptions. This arbitration agreement does not prevent the Employee from filing charges or claims with the National Labor Relations Board, the Equal Employment Opportunity Commission, or other federal, state, or local administrative agencies, or from filing a workers' compensation claim. Additionally, either party may seek injunctive relief in a court of law to protect their rights pending arbitration.\n\n`;
    } else {
      document += `6.1 Resolution of Disputes. Any dispute, claim, or controversy arising out of or relating to this Agreement or the Employee's employment with the Employer shall be resolved in a court of competent jurisdiction in the State of California.\n\n`;
    }
    
    // Governing Law
    document += `6.7 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without giving effect to any choice of law or conflict of law provisions.\n\n`;
    
    // Miscellaneous Section
    document += `## 7. MISCELLANEOUS\n\n`;
    
    // Entire Agreement
    if (formData.entireAgreement) {
      document += `7.1 Entire Agreement. This Agreement constitutes the entire understanding between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, whether written or oral, relating to such subject matter.\n\n`;
    }
    
    // Non-Modification
    if (formData.nonModification) {
      document += `7.2 Modification. This Agreement may not be amended or modified except by a written instrument signed by both parties.\n\n`;
    }
    
    // Severability
    if (formData.severability) {
      document += `7.3 Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired.\n\n`;
    }
    
    // Non-Waiver
    if (formData.nonWaiver) {
      document += `7.4 Non-Waiver. The failure of either party to enforce any provision of this Agreement shall not be construed as a waiver of that provision or the right of the party to enforce that provision or any other provision.\n\n`;
    }
    
    // Electronic Signatures
    if (formData.electronicSignatures) {
      document += `7.5 Electronic Signatures. The parties agree that electronic signatures shall be as valid and binding as handwritten signatures.\n\n`;
    }
    
    // Signature Block
    document += `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n`;
    document += `EMPLOYER:\n\n`;
    document += `By: ________________________\n`;
    document += `${formData.employerName}\n\n`;
    document += `Title: ________________________\n\n`;
    document += `EMPLOYEE:\n\n`;
    document += `By: ________________________\n`;
    document += `${formData.employeeName}\n\n`;
    
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
      'employerName', 'employerAddress', 'employeeName', 'employeeAddress', 
      'startDate', 'position', 'reportingTo', 'employmentType', 
      'workLocation', 'customWorkLocation', 'atWillEmployment', 'probationPeriod'
    ];
    
    const compensationFields = [
      'compensationType', 'salaryAmount', 'salaryPeriod', 'hourlyRate', 
      'overtimeEligible', 'overtimeRate', 'commissionRate', 'commissionStructure', 
      'bonusEligible', 'bonusStructure', 'equityEligible', 'equityDetails',
      'paymentFrequency', 'paymentMethod', 'expenseReimbursement'
    ];
    
    const benefitFields = [
      'ptoPolicy', 'ptoAmount', 'sickLeavePolicy', 'sickLeaveAmount',
      'healthInsurance', 'healthInsuranceDetails', 'retirementPlan',
      'retirementPlanDetails', 'otherBenefits'
    ];
    
    const dutiesFields = [
      'hoursPerWeek', 'workSchedule', 'customSchedule', 'mealBreaks',
      'restBreaks', 'dutiesDescription', 'performanceReview', 'performanceReviewFrequency'
    ];
    
    const ipFields = [
      'confidentialityAgreement', 'confidentialityScope', 'ipAssignment',
      'ipAssignmentExceptions', 'tradeSecretsProtection', 'companyProperty'
    ];
    
    const terminationFields = [
      'noticePeriod', 'customNoticePeriod', 'severanceIncluded',
      'severanceTerms', 'returnOfProperty'
    ];
    
    const disputeFields = [
      'arbitrationClause', 'arbitrationType', 'arbitrationCustomDetails',
      'governingLaw', 'entireAgreement', 'nonModification', 'severability',
      'nonWaiver', 'electronicSignatures'
    ];
    
    if (basicInfoFields.includes(lastChanged)) {
      return 'basic-info';
    } else if (compensationFields.includes(lastChanged)) {
      return 'compensation';
    } else if (benefitFields.includes(lastChanged)) {
      return 'benefits';
    } else if (dutiesFields.includes(lastChanged)) {
      return 'duties';
    } else if (ipFields.includes(lastChanged)) {
      return 'ip';
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
    'compensation': /## 2\. COMPENSATION AND BENEFITS\n\n.*?(?=## 3\. DUTIES AND RESPONSIBILITIES)/s,
    'benefits': /2\.7 Benefits.*?(?=## 3\. DUTIES AND RESPONSIBILITIES)/s,
    'duties': /## 3\. DUTIES AND RESPONSIBILITIES\n\n.*?(?=## 4\. CONFIDENTIALITY AND INTELLECTUAL PROPERTY)/s,
    'ip': /## 4\. CONFIDENTIALITY AND INTELLECTUAL PROPERTY\n\n.*?(?=## 5\. TERMINATION)/s,
    'termination': /## 5\. TERMINATION\n\n.*?(?=## 6\. DISPUTE RESOLUTION)/s,
    'dispute': /## 6\. DISPUTE RESOLUTION\n\n.*?(?=## 7\. MISCELLANEOUS)/s
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
