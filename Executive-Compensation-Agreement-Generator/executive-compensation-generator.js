// Executive Compensation Agreement Generator

const App = () => {
  // State for managing tabs and form data
  const [currentTab, setCurrentTab] = React.useState(0);
  const [lastChanged, setLastChanged] = React.useState(null);
  const [formData, setFormData] = React.useState({
    // Executive Information
    executiveName: "",
    executiveTitle: "",
    executiveEmail: "",
    startDate: "",
    
    // Company Information
    companyName: "",
    companyEntity: "",
    companyAddress: "",
    isPublic: false,
    stateOfIncorporation: "Delaware",
    
    // Cash Compensation
    baseSalary: "",
    annualReview: true,
    bonusEligible: true,
    bonusPercentage: "30",
    bonusType: "annual",
    bonusMetrics: "company",
    signingBonus: "",
    signingBonusCondition: "",
    
    // Equity Compensation
    includeEquity: true,
    equityType: "options",
    equityAmount: "",
    equityPercentage: "",
    vestingPeriod: "4",
    vestingCliff: "1",
    acceleratedVesting: false,
    acceleratedVestingCondition: "change-in-control",
    
    // Benefits
    standardBenefits: true,
    healthInsurance: true,
    retirementPlan: true,
    paidTimeOff: "20",
    additionalBenefits: "",
    
    // Term and Termination
    termLength: "indefinite",
    fixedTermYears: "3",
    noticePeriod: "30",
    severance: true,
    severancePeriod: "6",
    severanceConditions: "without-cause",
    changeOfControlSeverance: false,
    changeOfControlSeverancePeriod: "12",
    
    // Restrictive Covenants
    includeNonCompete: true,
    nonCompetePeriod: "12",
    nonCompeteGeographic: "nationwide",
    includeNonSolicitation: true,
    nonSolicitationPeriod: "12",
    includeConfidentiality: true,
    
    // Miscellaneous
    governingLaw: "Delaware",
    disputeResolution: "arbitration",
    attorneyFees: "prevailing",
    amendments: "writing",
    entireAgreement: true
  });
  
  // Preview panel reference for scrolling
  const previewRef = React.useRef(null);
  
  // Tab configuration
  const tabs = [
    { id: "executive", label: "Executive Info" },
    { id: "company", label: "Company Info" },
    { id: "cash", label: "Cash Compensation" },
    { id: "equity", label: "Equity Compensation" },
    { id: "benefits", label: "Benefits" },
    { id: "termination", label: "Term & Termination" },
    { id: "restrictive", label: "Restrictive Covenants" },
    { id: "misc", label: "Miscellaneous" },
    { id: "review", label: "Review & Finalize" }
  ];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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
  
  // Copy document to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert("Document copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Error copying to clipboard. Please try using the download option instead.");
    }
  };
  
  // Download document as MS Word
  const downloadAsWord = () => {
    try {
      window.generateWordDoc(documentText, {
        documentTitle: "Executive Compensation Agreement",
        fileName: `Executive-Compensation-Agreement-${formData.executiveName.replace(/\s+/g, "-")}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Open Calendly for consultation
  const openCalendly = () => {
    Calendly.initPopupWidget({
      url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
    });
  };
  
  // Generate document text based on form data
  const generateDocument = () => {
    let doc = `EXECUTIVE COMPENSATION AGREEMENT

THIS EXECUTIVE COMPENSATION AGREEMENT (the "Agreement") is made and entered into as of ${formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "[DATE]"}, by and between ${formData.companyName || "[COMPANY NAME]"}, a ${formData.companyEntity || "[TYPE OF ENTITY]"} (the "Company"), and ${formData.executiveName || "[EXECUTIVE NAME]"}, an individual (the "Executive").

RECITALS

WHEREAS, the Company desires to employ the Executive as its ${formData.executiveTitle || "[TITLE]"}, and the Executive desires to accept such employment, on the terms and conditions set forth in this Agreement;

WHEREAS, the Company and the Executive desire to set forth in writing the terms and conditions of their agreement and understanding regarding the Executive's employment with the Company;

NOW, THEREFORE, in consideration of the premises and the mutual covenants and promises contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. EMPLOYMENT AND DUTIES

1.1 Position. The Company hereby employs the Executive, and the Executive hereby accepts employment with the Company, as ${formData.executiveTitle || "[TITLE]"} of the Company, subject to the terms and conditions set forth in this Agreement.

1.2 Duties. The Executive shall perform all duties and responsibilities as are commensurate with the position of ${formData.executiveTitle || "[TITLE]"} and such other duties and responsibilities as may be assigned to the Executive from time to time by the ${formData.executiveTitle && formData.executiveTitle.includes("CEO") ? "Board of Directors" : "CEO"} of the Company.

1.3 Full-Time and Best Efforts. The Executive shall devote the Executive's full business time and efforts to the performance of the Executive's duties hereunder. The Executive shall not engage in any other business, profession, or occupation for compensation or otherwise which would conflict or interfere with the performance of such services.

2. TERM OF EMPLOYMENT

2.1 Term. The Executive's employment under this Agreement shall commence on ${formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "[START DATE]"} (the "Effective Date") and shall continue ${formData.termLength === "indefinite" ? "until terminated in accordance with the provisions of this Agreement" : `for a period of ${formData.fixedTermYears || "[TERM YEARS]"} years`} (the "Term").${formData.termLength !== "indefinite" ? `\n\n2.2 Renewal. This Agreement may be renewed or extended for additional one-year terms upon mutual written agreement of the parties no later than [90] days prior to the expiration of the then-current Term.` : ""}

3. COMPENSATION AND BENEFITS

3.1 Base Salary. The Company shall pay the Executive a base salary at the annual rate of ${formData.baseSalary ? "$" + parseInt(formData.baseSalary).toLocaleString() : "[BASE SALARY]"} (the "Base Salary"), payable in accordance with the Company's normal payroll practices. The Base Salary shall be reviewed annually${formData.annualReview ? " and may be increased (but not decreased) based on the Executive's performance and contributions to the Company" : ""}.

${formData.bonusEligible ? `3.2 Bonus. The Executive shall be eligible to receive a ${formData.bonusType === "annual" ? "annual" : formData.bonusType === "quarterly" ? "quarterly" : "performance-based"} bonus (the "Bonus") with a target amount equal to ${formData.bonusPercentage || "[PERCENTAGE]"}% of the Executive's Base Salary, based on ${formData.bonusMetrics === "company" ? "the Company's achievement of performance goals established by the Board of Directors" : formData.bonusMetrics === "individual" ? "the Executive's achievement of individual performance goals established by the Board of Directors" : "a combination of Company and individual performance goals established by the Board of Directors"}. The Bonus, if any, shall be paid within [90] days following the end of the applicable ${formData.bonusType === "annual" ? "fiscal year" : formData.bonusType === "quarterly" ? "fiscal quarter" : "performance period"}.` : ""}

${formData.signingBonus ? `3.3 Signing Bonus. The Company shall pay the Executive a one-time signing bonus in the amount of $${parseInt(formData.signingBonus).toLocaleString()} (the "Signing Bonus"), payable within [30] days following the Effective Date${formData.signingBonusCondition ? `, subject to ${formData.signingBonusCondition}` : ""}. If the Executive's employment with the Company terminates prior to the [first] anniversary of the Effective Date due to the Executive's resignation without Good Reason or the Company's termination of the Executive for Cause, the Executive shall repay the Signing Bonus to the Company within [30] days following such termination.` : ""}

${formData.includeEquity ? `
4. EQUITY COMPENSATION

4.1 ${formData.equityType === "options" ? "Stock Options" : formData.equityType === "rsus" ? "Restricted Stock Units" : "Equity Award"}. Subject to approval by the Board of Directors, the Executive shall be granted ${formData.equityType === "options" ? `stock options to purchase ${formData.equityAmount ? formData.equityAmount : "[NUMBER]"} shares of the Company's common stock` : formData.equityType === "rsus" ? `${formData.equityAmount ? formData.equityAmount : "[NUMBER]"} restricted stock units` : `an equity award representing ${formData.equityPercentage ? formData.equityPercentage + "%" : "[PERCENTAGE]"} of the Company's fully-diluted capital stock`} (the "Equity Award"), subject to the terms and conditions of the Company's equity incentive plan and a separate award agreement.

4.2 Vesting. The Equity Award shall vest over a period of ${formData.vestingPeriod || "[VESTING YEARS]"} years from the grant date, with ${formData.vestingCliff ? `${formData.vestingCliff}-year cliff and` : ""} equal monthly installments thereafter, subject to the Executive's continued employment with the Company on each vesting date.

${formData.acceleratedVesting ? `4.3 Accelerated Vesting. Notwithstanding the foregoing, the Equity Award shall become fully vested upon a ${formData.acceleratedVestingCondition === "change-in-control" ? "Change in Control of the Company (as defined below)" : formData.acceleratedVestingCondition === "termination" ? "termination of the Executive's employment by the Company without Cause or by the Executive for Good Reason" : "Change in Control of the Company or termination of the Executive's employment by the Company without Cause or by the Executive for Good Reason"}.` : ""}` : ""}

${formData.standardBenefits ? `
5. BENEFITS

5.1 Employee Benefits. The Executive shall be entitled to participate in all employee benefit plans, programs, and arrangements that the Company makes available to its similarly situated executives generally, in accordance with the terms of such plans, programs, and arrangements.

${formData.healthInsurance ? `5.2 Health Insurance. The Executive shall be entitled to participate in the Company's health insurance plans, in accordance with the terms of such plans.` : ""}

${formData.retirementPlan ? `5.3 Retirement Plan. The Executive shall be entitled to participate in the Company's retirement plan, in accordance with the terms of such plan.` : ""}

5.4 Paid Time Off. The Executive shall be entitled to [${formData.paidTimeOff || "20"}] days of paid time off per calendar year, in accordance with the Company's policies.

${formData.additionalBenefits ? `5.5 Additional Benefits. The Executive shall also be entitled to the following additional benefits: ${formData.additionalBenefits}.` : ""}` : ""}

6. TERMINATION OF EMPLOYMENT

6.1 Termination by the Company for Cause. The Company may terminate the Executive's employment for Cause at any time upon written notice to the Executive. For purposes of this Agreement, "Cause" shall mean:
(a) the Executive's willful and continued failure to substantially perform the Executive's duties;
(b) the Executive's willful engagement in conduct that is materially injurious to the Company;
(c) the Executive's conviction of, or plea of nolo contendere to, a felony or any crime involving fraud, embezzlement, or moral turpitude;
(d) the Executive's material breach of this Agreement or any other agreement with the Company; or
(e) the Executive's violation of any material policy of the Company.

6.2 Termination by the Executive for Good Reason. The Executive may terminate the Executive's employment for Good Reason by providing written notice to the Company within [90] days of the occurrence of the event giving rise to Good Reason. For purposes of this Agreement, "Good Reason" shall mean:
(a) a material diminution in the Executive's duties, authority, or responsibilities;
(b) a material reduction in the Executive's Base Salary;
(c) a material change in the geographic location at which the Executive must perform services; or
(d) any other action or inaction that constitutes a material breach by the Company of this Agreement.

The Company shall have [30] days following receipt of such notice to cure the condition giving rise to Good Reason. If the Company fails to cure the condition, the Executive's termination shall be effective [30] days following the Company's failure to cure.

6.3 Termination by the Company without Cause or by the Executive without Good Reason. Either party may terminate the Executive's employment without Cause or Good Reason upon [${formData.noticePeriod || "30"}] days' written notice to the other party.

6.4 Termination Due to Death or Disability. The Executive's employment shall terminate automatically upon the Executive's death. The Company may terminate the Executive's employment due to the Executive's Disability. For purposes of this Agreement, "Disability" shall mean the Executive's inability to perform the essential functions of the Executive's position, with or without reasonable accommodation, for a period of [90] consecutive days or [120] days in any [12]-month period.

${formData.severance ? `
7. SEVERANCE

7.1 Severance upon Termination by the Company without Cause or by the Executive for Good Reason. If the Executive's employment is terminated by the Company without Cause or by the Executive for Good Reason, the Executive shall be entitled to receive:
(a) continued payment of the Executive's Base Salary for a period of [${formData.severancePeriod || "6"}] months following the date of termination (the "Severance Period");
(b) a pro-rata portion of the Executive's target Bonus for the year in which the termination occurs, based on the number of days the Executive was employed during such year, payable at the same time as bonuses are paid to other executives;
(c) if the Executive timely elects continuation coverage under COBRA, payment or reimbursement of the COBRA premiums for the Executive and the Executive's eligible dependents during the Severance Period; and
(d) ${formData.includeEquity ? `accelerated vesting of the portion of the Executive's Equity Award that would have vested during the Severance Period had the Executive remained employed.` : "other severance benefits as may be specified in the Executive's equity award agreements or other agreements with the Company."}

${formData.changeOfControlSeverance ? `7.2 Enhanced Severance upon Termination Following a Change in Control. If, within [12] months following a Change in Control, the Executive's employment is terminated by the Company without Cause or by the Executive for Good Reason, the Executive shall be entitled to receive, in lieu of the severance benefits described in Section 7.1:
(a) continued payment of the Executive's Base Salary for a period of [${formData.changeOfControlSeverancePeriod || "12"}] months following the date of termination;
(b) a lump sum payment equal to [100]% of the Executive's target Bonus for the year in which the termination occurs;
(c) if the Executive timely elects continuation coverage under COBRA, payment or reimbursement of the COBRA premiums for the Executive and the Executive's eligible dependents for a period of [${formData.changeOfControlSeverancePeriod || "12"}] months following the date of termination; and
(d) ${formData.includeEquity && formData.acceleratedVesting ? `full accelerated vesting of the Executive's Equity Award.` : "accelerated vesting of the Executive's equity awards as specified in the applicable equity award agreements."}

7.3 Definition of Change in Control. For purposes of this Agreement, "Change in Control" shall mean: 
(a) the acquisition by any individual, entity, or group of beneficial ownership of more than 50% of the combined voting power of the Company's then outstanding securities;
(b) a merger, consolidation, or similar transaction involving the Company, following which the Company's stockholders immediately prior to such transaction own less than 50% of the combined voting power of the surviving entity; or
(c) a sale or other disposition of all or substantially all of the Company's assets.` : ""}

7.4 Conditions to Severance. The Executive's receipt of any severance benefits under this Agreement shall be conditioned upon:
(a) the Executive's execution and non-revocation of a general release of claims in favor of the Company and its affiliates; and
(b) the Executive's continued compliance with the restrictive covenants set forth in Section 8.` : ""}

${formData.includeNonCompete || formData.includeNonSolicitation || formData.includeConfidentiality ? `
8. RESTRICTIVE COVENANTS

${formData.includeConfidentiality ? `8.1 Confidentiality. The Executive shall maintain the confidentiality of all confidential and proprietary information of the Company and shall not use or disclose such information to any person or entity without the Company's prior written consent, except as required by law or in the performance of the Executive's duties to the Company.` : ""}

${formData.includeNonCompete ? `8.2 Non-Competition. During the Executive's employment with the Company and for a period of [${formData.nonCompetePeriod || "12"}] months thereafter, the Executive shall not, directly or indirectly, engage in or have any interest in any business that competes with the business of the Company ${formData.nonCompeteGeographic === "nationwide" ? "anywhere in the United States" : formData.nonCompeteGeographic === "worldwide" ? "anywhere in the world" : "within [GEOGRAPHIC AREA]"}.` : ""}

${formData.includeNonSolicitation ? `8.3 Non-Solicitation. During the Executive's employment with the Company and for a period of [${formData.nonSolicitationPeriod || "12"}] months thereafter, the Executive shall not, directly or indirectly:
(a) solicit or attempt to solicit any customer, client, supplier, licensee, or other business relation of the Company to terminate or reduce its business relationship with the Company; or
(b) solicit or attempt to solicit any employee or independent contractor of the Company to terminate or adversely change the terms of such employment or engagement with the Company.` : ""}

8.4 Remedies. The Executive acknowledges that a breach of any of the restrictive covenants contained in this Section 8 would cause irreparable injury to the Company and that the Company's remedies at law for such a breach would be inadequate. Accordingly, the Executive agrees that, in addition to any other remedies available, the Company shall be entitled to injunctive relief to enforce the provisions of this Section 8.` : ""}

9. MISCELLANEOUS

9.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw || "Delaware"}, without giving effect to any choice of law or conflict of law provisions.

9.2 Dispute Resolution. Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved ${formData.disputeResolution === "arbitration" ? "by final and binding arbitration administered by the American Arbitration Association in accordance with its Employment Arbitration Rules" : "in the state and federal courts located in [JURISDICTION]"}.

9.3 Attorney's Fees. In the event of any legal proceeding relating to this Agreement or the Executive's employment with the Company, the ${formData.attorneyFees === "prevailing" ? "prevailing party" : formData.attorneyFees === "company" ? "Company" : "Executive"} shall be entitled to recover reasonable attorney's fees and costs.

9.4 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, whether written or oral, relating to such subject matter.

9.5 Amendment. ${formData.amendments === "writing" ? "This Agreement may be amended or modified only by a written instrument signed by both parties." : "This Agreement may not be amended or modified except by a written instrument signed by both parties."}

9.6 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY:
${formData.companyName || "[COMPANY NAME]"}

By: ____________________________
Name: __________________________
Title: ___________________________

EXECUTIVE:

____________________________
${formData.executiveName || "[EXECUTIVE NAME]"}`;

    return doc;
  };
  
  // Generate final document text
  const documentText = generateDocument();
  
  // Function to determine which section to highlight based on the tab and last changed field
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    // Define regex patterns for different sections
    const sections = {
      // Executive Info
      executiveName: /THIS EXECUTIVE COMPENSATION AGREEMENT.*?RECITALS/s,
      executiveTitle: /1\.\s*EMPLOYMENT AND DUTIES.*?1\.4/s,
      executiveEmail: /THIS EXECUTIVE COMPENSATION AGREEMENT.*?RECITALS/s,
      startDate: /THIS EXECUTIVE COMPENSATION AGREEMENT.*?RECITALS/s,
      
      // Company Info
      companyName: /THIS EXECUTIVE COMPENSATION AGREEMENT.*?RECITALS/s,
      companyEntity: /THIS EXECUTIVE COMPENSATION AGREEMENT.*?RECITALS/s,
      companyAddress: /THIS EXECUTIVE COMPENSATION AGREEMENT.*?RECITALS/s,
      isPublic: /THIS EXECUTIVE COMPENSATION AGREEMENT.*?RECITALS/s,
      stateOfIncorporation: /9\.1\s*Governing Law.*?9\.2/s,
      
      // Cash Compensation
      baseSalary: /3\.1\s*Base Salary.*?3\.2/s,
      annualReview: /3\.1\s*Base Salary.*?3\.2/s,
      bonusEligible: /3\.2\s*Bonus.*?3\.3/s,
      bonusPercentage: /3\.2\s*Bonus.*?3\.3/s,
      bonusType: /3\.2\s*Bonus.*?3\.3/s,
      bonusMetrics: /3\.2\s*Bonus.*?3\.3/s,
      signingBonus: /3\.3\s*Signing Bonus.*?4/s,
      signingBonusCondition: /3\.3\s*Signing Bonus.*?4/s,
      
      // Equity Compensation
      includeEquity: /4\.\s*EQUITY COMPENSATION.*?5/s,
      equityType: /4\.1\s*.*?4\.2/s,
      equityAmount: /4\.1\s*.*?4\.2/s,
      equityPercentage: /4\.1\s*.*?4\.2/s,
      vestingPeriod: /4\.2\s*Vesting.*?5/s,
      vestingCliff: /4\.2\s*Vesting.*?5/s,
      acceleratedVesting: /4\.3\s*Accelerated Vesting.*?5/s,
      acceleratedVestingCondition: /4\.3\s*Accelerated Vesting.*?5/s,
      
      // Benefits
      standardBenefits: /5\.\s*BENEFITS.*?6/s,
      healthInsurance: /5\.2\s*Health Insurance.*?5\.3/s,
      retirementPlan: /5\.3\s*Retirement Plan.*?5\.4/s,
      paidTimeOff: /5\.4\s*Paid Time Off.*?6/s,
      additionalBenefits: /5\.5\s*Additional Benefits.*?6/s,
      
      // Term and Termination
      termLength: /2\.\s*TERM OF EMPLOYMENT.*?3/s,
      fixedTermYears: /2\.\s*TERM OF EMPLOYMENT.*?3/s,
      noticePeriod: /6\.3\s*Termination by the Company without Cause.*?6\.4/s,
      severance: /7\.\s*SEVERANCE.*?8/s,
      severancePeriod: /7\.1\s*Severance upon Termination.*?\(a\)/s,
      severanceConditions: /7\.1\s*Severance upon Termination.*?7\.2/s,
      changeOfControlSeverance: /7\.2\s*Enhanced Severance.*?7\.3/s,
      changeOfControlSeverancePeriod: /7\.2\s*Enhanced Severance.*?\(a\)/s,
      
      // Restrictive Covenants
      includeNonCompete: /8\.\s*RESTRICTIVE COVENANTS.*?8\.2/s,
      nonCompetePeriod: /8\.2\s*Non-Competition.*?8\.3/s,
      nonCompeteGeographic: /8\.2\s*Non-Competition.*?8\.3/s,
      includeNonSolicitation: /8\.3\s*Non-Solicitation.*?8\.4/s,
      nonSolicitationPeriod: /8\.3\s*Non-Solicitation.*?8\.4/s,
      includeConfidentiality: /8\.1\s*Confidentiality.*?8\.2/s,
      
      // Miscellaneous
      governingLaw: /9\.1\s*Governing Law.*?9\.2/s,
      disputeResolution: /9\.2\s*Dispute Resolution.*?9\.3/s,
      attorneyFees: /9\.3\s*Attorney's Fees.*?9\.4/s,
      amendments: /9\.5\s*Amendment.*?9\.6/s,
      entireAgreement: /9\.4\s*Entire Agreement.*?9\.5/s
    };
    
    return sections[lastChanged] ? lastChanged : null;
  };
  
  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionKey = getSectionToHighlight();
    if (!sectionKey) return documentText;
    
    // Define what text should be highlighted based on the field that changed
    let highlightText = "";
    
    switch (sectionKey) {
      case "executiveName":
        highlightText = formData.executiveName || "[EXECUTIVE NAME]";
        break;
      case "executiveTitle":
        highlightText = formData.executiveTitle || "[TITLE]";
        break;
      case "startDate":
        highlightText = formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "[START DATE]";
        break;
      case "companyName":
        highlightText = formData.companyName || "[COMPANY NAME]";
        break;
      case "companyEntity":
        highlightText = formData.companyEntity || "[TYPE OF ENTITY]";
        break;
      case "baseSalary":
        highlightText = formData.baseSalary ? "$" + parseInt(formData.baseSalary).toLocaleString() : "[BASE SALARY]";
        break;
      case "bonusPercentage":
        highlightText = formData.bonusPercentage || "[PERCENTAGE]";
        break;
      case "signingBonus":
        highlightText = formData.signingBonus ? "$" + parseInt(formData.signingBonus).toLocaleString() : "[SIGNING BONUS]";
        break;
      case "equityAmount":
        highlightText = formData.equityAmount || "[NUMBER]";
        break;
      case "equityPercentage":
        highlightText = formData.equityPercentage || "[PERCENTAGE]";
        break;
      case "vestingPeriod":
        highlightText = formData.vestingPeriod || "[VESTING YEARS]";
        break;
      case "vestingCliff":
        highlightText = formData.vestingCliff || "[CLIFF PERIOD]";
        break;
      case "paidTimeOff":
        highlightText = formData.paidTimeOff || "20";
        break;
      case "fixedTermYears":
        highlightText = formData.fixedTermYears || "[TERM YEARS]";
        break;
      case "noticePeriod":
        highlightText = formData.noticePeriod || "30";
        break;
      case "severancePeriod":
        highlightText = formData.severancePeriod || "6";
        break;
      case "changeOfControlSeverancePeriod":
        highlightText = formData.changeOfControlSeverancePeriod || "12";
        break;
      case "nonCompetePeriod":
        highlightText = formData.nonCompetePeriod || "12";
        break;
      case "nonSolicitationPeriod":
        highlightText = formData.nonSolicitationPeriod || "12";
        break;
      case "governingLaw":
        highlightText = formData.governingLaw || "Delaware";
        break;
      default:
        return documentText;
    }
    
    if (!highlightText) return documentText;
    
    // Escape special characters for RegExp
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    
    // Create a regex that will match the text to highlight
    const highlightRegex = new RegExp(escapeRegExp(highlightText), 'g');
    
    // Replace matching text with highlighted version
    return documentText.replace(highlightRegex, match => 
      `<span class="highlighted-text">${match}</span>`
    );
  };
  
  // Create highlightable content
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
  
  // Validate form fields
  const getValidationStatus = () => {
    const validations = [
      { 
        field: 'executiveName', 
        label: 'Executive Name', 
        valid: !!formData.executiveName, 
        message: 'Enter the executive\'s full legal name' 
      },
      { 
        field: 'executiveTitle', 
        label: 'Executive Title', 
        valid: !!formData.executiveTitle, 
        message: 'Specify the executive\'s job title' 
      },
      { 
        field: 'companyName', 
        label: 'Company Name', 
        valid: !!formData.companyName, 
        message: 'Enter the full legal name of the company' 
      },
      { 
        field: 'baseSalary', 
        label: 'Base Salary', 
        valid: !!formData.baseSalary, 
        message: 'Specify the executive\'s annual base salary' 
      }
    ];
    
    return validations;
  };
  
  // Render tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Executive Info
        return (
          <div className="form-section">
            <h3>Executive Information</h3>
            <div className="form-group">
              <label htmlFor="executiveName">Executive Name</label>
              <input
                type="text"
                id="executiveName"
                name="executiveName"
                value={formData.executiveName}
                onChange={handleChange}
                placeholder="Full legal name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="executiveTitle">Executive Title</label>
              <select
                id="executiveTitle"
                name="executiveTitle"
                value={formData.executiveTitle}
                onChange={handleChange}
              >
                <option value="">Select title</option>
                <option value="Chief Executive Officer">Chief Executive Officer (CEO)</option>
                <option value="Chief Financial Officer">Chief Financial Officer (CFO)</option>
                <option value="Chief Operating Officer">Chief Operating Officer (COO)</option>
                <option value="Chief Technology Officer">Chief Technology Officer (CTO)</option>
                <option value="Chief Marketing Officer">Chief Marketing Officer (CMO)</option>
                <option value="Chief Legal Officer">Chief Legal Officer (CLO)</option>
                <option value="Chief Human Resources Officer">Chief Human Resources Officer (CHRO)</option>
                <option value="President">President</option>
                <option value="Executive Vice President">Executive Vice President</option>
                <option value="Senior Vice President">Senior Vice President</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="executiveEmail">Executive Email</label>
              <input
                type="email"
                id="executiveEmail"
                name="executiveEmail"
                value={formData.executiveEmail}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      
      case 1: // Company Info
        return (
          <div className="form-section">
            <h3>Company Information</h3>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Full legal name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="companyEntity">Entity Type</label>
              <select
                id="companyEntity"
                name="companyEntity"
                value={formData.companyEntity}
                onChange={handleChange}
              >
                <option value="">Select entity type</option>
                <option value="Delaware Corporation">Delaware Corporation</option>
                <option value="California Corporation">California Corporation</option>
                <option value="Delaware Limited Liability Company">Delaware LLC</option>
                <option value="California Limited Liability Company">California LLC</option>
                <option value="New York Corporation">New York Corporation</option>
                <option value="Nevada Corporation">Nevada Corporation</option>
                <option value="C Corporation">C Corporation</option>
                <option value="S Corporation">S Corporation</option>
                <option value="Limited Liability Company">Limited Liability Company</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="companyAddress">Company Address</label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Street address, city, state, zip"
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <label htmlFor="isPublic">Company is publicly traded</label>
            </div>
            <div className="form-group">
              <label htmlFor="stateOfIncorporation">State of Incorporation</label>
              <select
                id="stateOfIncorporation"
                name="stateOfIncorporation"
                value={formData.stateOfIncorporation}
                onChange={handleChange}
              >
                <option value="Delaware">Delaware</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Nevada">Nevada</option>
                <option value="Florida">Florida</option>
                <option value="Texas">Texas</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        );
      
      case 2: // Cash Compensation
        return (
          <div className="form-section">
            <h3>Cash Compensation</h3>
            <div className="form-group">
              <label htmlFor="baseSalary">Base Salary ($)</label>
              <input
                type="number"
                id="baseSalary"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleChange}
                placeholder="Annual base salary"
                min="0"
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="annualReview"
                name="annualReview"
                checked={formData.annualReview}
                onChange={handleChange}
              />
              <label htmlFor="annualReview">Annual salary review</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="bonusEligible"
                name="bonusEligible"
                checked={formData.bonusEligible}
                onChange={handleChange}
              />
              <label htmlFor="bonusEligible">Eligible for bonus</label>
            </div>
            
            {formData.bonusEligible && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bonusPercentage">Target Bonus (%)</label>
                    <input
                      type="number"
                      id="bonusPercentage"
                      name="bonusPercentage"
                      value={formData.bonusPercentage}
                      onChange={handleChange}
                      placeholder="Percentage of base salary"
                      min="0"
                      max="200"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bonusType">Bonus Type</label>
                    <select
                      id="bonusType"
                      name="bonusType"
                      value={formData.bonusType}
                      onChange={handleChange}
                    >
                      <option value="annual">Annual</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="performance">Performance-based</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="bonusMetrics">Bonus Metrics</label>
                  <select
                    id="bonusMetrics"
                    name="bonusMetrics"
                    value={formData.bonusMetrics}
                    onChange={handleChange}
                  >
                    <option value="company">Company performance only</option>
                    <option value="individual">Individual performance only</option>
                    <option value="both">Both company and individual performance</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="signingBonus">Signing Bonus ($) (optional)</label>
              <input
                type="number"
                id="signingBonus"
                name="signingBonus"
                value={formData.signingBonus}
                onChange={handleChange}
                placeholder="One-time signing bonus amount"
                min="0"
              />
            </div>
            
            {formData.signingBonus && (
              <div className="form-group">
                <label htmlFor="signingBonusCondition">Signing Bonus Condition (optional)</label>
                <input
                  type="text"
                  id="signingBonusCondition"
                  name="signingBonusCondition"
                  value={formData.signingBonusCondition}
                  onChange={handleChange}
                  placeholder="e.g., completion of 90 days employment"
                />
              </div>
            )}
          </div>
        );
      
      case 3: // Equity Compensation
        return (
          <div className="form-section">
            <h3>Equity Compensation</h3>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="includeEquity"
                name="includeEquity"
                checked={formData.includeEquity}
                onChange={handleChange}
              />
              <label htmlFor="includeEquity">Include equity compensation</label>
            </div>
            
            {formData.includeEquity && (
              <>
                <div className="form-group">
                  <label htmlFor="equityType">Equity Type</label>
                  <select
                    id="equityType"
                    name="equityType"
                    value={formData.equityType}
                    onChange={handleChange}
                  >
                    <option value="options">Stock Options</option>
                    <option value="rsus">Restricted Stock Units (RSUs)</option>
                    <option value="other">Other Equity Award</option>
                  </select>
                </div>
                
                {formData.equityType === "options" || formData.equityType === "rsus" ? (
                  <div className="form-group">
                    <label htmlFor="equityAmount">Number of Shares</label>
                    <input
                      type="number"
                      id="equityAmount"
                      name="equityAmount"
                      value={formData.equityAmount}
                      onChange={handleChange}
                      placeholder="Number of shares"
                      min="0"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="equityPercentage">Percentage of Company (%)</label>
                    <input
                      type="number"
                      id="equityPercentage"
                      name="equityPercentage"
                      value={formData.equityPercentage}
                      onChange={handleChange}
                      placeholder="Percentage of fully-diluted shares"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vestingPeriod">Vesting Period (years)</label>
                    <select
                      id="vestingPeriod"
                      name="vestingPeriod"
                      value={formData.vestingPeriod}
                      onChange={handleChange}
                    >
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="4">4 years</option>
                      <option value="5">5 years</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="vestingCliff">Cliff Period (years)</label>
                    <select
                      id="vestingCliff"
                      name="vestingCliff"
                      value={formData.vestingCliff}
                      onChange={handleChange}
                    >
                      <option value="0">No cliff</option>
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                    </select>
                  </div>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="acceleratedVesting"
                    name="acceleratedVesting"
                    checked={formData.acceleratedVesting}
                    onChange={handleChange}
                  />
                  <label htmlFor="acceleratedVesting">Include accelerated vesting provision</label>
                </div>
                
                {formData.acceleratedVesting && (
                  <div className="form-group">
                    <label htmlFor="acceleratedVestingCondition">Acceleration Trigger</label>
                    <select
                      id="acceleratedVestingCondition"
                      name="acceleratedVestingCondition"
                      value={formData.acceleratedVestingCondition}
                      onChange={handleChange}
                    >
                      <option value="change-in-control">Change in Control only</option>
                      <option value="termination">Termination without Cause/Good Reason only</option>
                      <option value="both">Both Change in Control and Termination</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 4: // Benefits
        return (
          <div className="form-section">
            <h3>Benefits</h3>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="standardBenefits"
                name="standardBenefits"
                checked={formData.standardBenefits}
                onChange={handleChange}
              />
              <label htmlFor="standardBenefits">Include standard benefits section</label>
            </div>
            
            {formData.standardBenefits && (
              <>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="healthInsurance"
                    name="healthInsurance"
                    checked={formData.healthInsurance}
                    onChange={handleChange}
                  />
                  <label htmlFor="healthInsurance">Health insurance</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="retirementPlan"
                    name="retirementPlan"
                    checked={formData.retirementPlan}
                    onChange={handleChange}
                  />
                  <label htmlFor="retirementPlan">Retirement plan (401(k))</label>
                </div>
                
                <div className="form-group">
                  <label htmlFor="paidTimeOff">Paid Time Off (days per year)</label>
                  <input
                    type="number"
                    id="paidTimeOff"
                    name="paidTimeOff"
                    value={formData.paidTimeOff}
                    onChange={handleChange}
                    placeholder="Number of days"
                    min="0"
                    max="365"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="additionalBenefits">Additional Benefits (optional)</label>
                  <textarea
                    id="additionalBenefits"
                    name="additionalBenefits"
                    value={formData.additionalBenefits}
                    onChange={handleChange}
                    placeholder="e.g., car allowance, club membership, relocation assistance"
                    rows="3"
                  ></textarea>
                </div>
              </>
            )}
          </div>
        );
      
      case 5: // Term & Termination
        return (
          <div className="form-section">
            <h3>Term and Termination</h3>
            <div className="form-group">
              <label htmlFor="termLength">Term Length</label>
              <select
                id="termLength"
                name="termLength"
                value={formData.termLength}
                onChange={handleChange}
              >
                <option value="indefinite">Indefinite (at-will)</option>
                <option value="fixed">Fixed term</option>
              </select>
            </div>
            
            {formData.termLength === "fixed" && (
              <div className="form-group">
                <label htmlFor="fixedTermYears">Fixed Term (years)</label>
                <select
                  id="fixedTermYears"
                  name="fixedTermYears"
                  value={formData.fixedTermYears}
                  onChange={handleChange}
                >
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years</option>
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="noticePeriod">Notice Period (days)</label>
              <select
                id="noticePeriod"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
              >
                <option value="0">No notice required</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="severance"
                name="severance"
                checked={formData.severance}
                onChange={handleChange}
              />
              <label htmlFor="severance">Include severance provisions</label>
            </div>
            
            {formData.severance && (
              <>
                <div className="form-group">
                  <label htmlFor="severancePeriod">Severance Period (months)</label>
                  <select
                    id="severancePeriod"
                    name="severancePeriod"
                    value={formData.severancePeriod}
                    onChange={handleChange}
                  >
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                    <option value="18">18 months</option>
                    <option value="24">24 months</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="severanceConditions">Severance Conditions</label>
                  <select
                    id="severanceConditions"
                    name="severanceConditions"
                    value={formData.severanceConditions}
                    onChange={handleChange}
                  >
                    <option value="without-cause">Termination without Cause only</option>
                    <option value="good-reason">Termination for Good Reason only</option>
                    <option value="both">Both without Cause and Good Reason</option>
                  </select>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="changeOfControlSeverance"
                    name="changeOfControlSeverance"
                    checked={formData.changeOfControlSeverance}
                    onChange={handleChange}
                  />
                  <label htmlFor="changeOfControlSeverance">Enhanced severance for Change in Control</label>
                </div>
                
                {formData.changeOfControlSeverance && (
                  <div className="form-group">
                    <label htmlFor="changeOfControlSeverancePeriod">Change in Control Severance (months)</label>
                    <select
                      id="changeOfControlSeverancePeriod"
                      name="changeOfControlSeverancePeriod"
                      value={formData.changeOfControlSeverancePeriod}
                      onChange={handleChange}
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 6: // Restrictive Covenants
        return (
          <div className="form-section">
            <h3>Restrictive Covenants</h3>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="includeConfidentiality"
                name="includeConfidentiality"
                checked={formData.includeConfidentiality}
                onChange={handleChange}
              />
              <label htmlFor="includeConfidentiality">Include confidentiality provisions</label>
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="includeNonCompete"
                name="includeNonCompete"
                checked={formData.includeNonCompete}
                onChange={handleChange}
              />
              <label htmlFor="includeNonCompete">Include non-compete provisions</label>
            </div>
            
            {formData.includeNonCompete && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nonCompetePeriod">Non-Compete Period (months)</label>
                    <select
                      id="nonCompetePeriod"
                      name="nonCompetePeriod"
                      value={formData.nonCompetePeriod}
                      onChange={handleChange}
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="nonCompeteGeographic">Geographic Scope</label>
                    <select
                      id="nonCompeteGeographic"
                      name="nonCompeteGeographic"
                      value={formData.nonCompeteGeographic}
                      onChange={handleChange}
                    >
                      <option value="state">Within state</option>
                      <option value="nationwide">Nationwide</option>
                      <option value="worldwide">Worldwide</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="includeNonSolicitation"
                name="includeNonSolicitation"
                checked={formData.includeNonSolicitation}
                onChange={handleChange}
              />
              <label htmlFor="includeNonSolicitation">Include non-solicitation provisions</label>
            </div>
            
            {formData.includeNonSolicitation && (
              <div className="form-group">
                <label htmlFor="nonSolicitationPeriod">Non-Solicitation Period (months)</label>
                <select
                  id="nonSolicitationPeriod"
                  name="nonSolicitationPeriod"
                  value={formData.nonSolicitationPeriod}
                  onChange={handleChange}
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
            )}
            
            {formData.includeNonCompete && formData.governingLaw === "California" && (
              <div className="risk-indicator risk-high">
                <strong>Warning:</strong> Non-compete agreements are generally unenforceable in California except in very limited circumstances.
              </div>
            )}
          </div>
        );
      
      case 7: // Miscellaneous
        return (
          <div className="form-section">
            <h3>Miscellaneous Provisions</h3>
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law</label>
              <select
                id="governingLaw"
                name="governingLaw"
                value={formData.governingLaw}
                onChange={handleChange}
              >
                <option value="Delaware">Delaware</option>
                <option value="New York">New York</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="Illinois">Illinois</option>
                <option value="Massachusetts">Massachusetts</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="disputeResolution">Dispute Resolution</label>
              <select
                id="disputeResolution"
                name="disputeResolution"
                value={formData.disputeResolution}
                onChange={handleChange}
              >
                <option value="arbitration">Arbitration</option>
                <option value="litigation">Litigation (courts)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="attorneyFees">Attorney's Fees</label>
              <select
                id="attorneyFees"
                name="attorneyFees"
                value={formData.attorneyFees}
                onChange={handleChange}
              >
                <option value="prevailing">Prevailing party recovers fees</option>
                <option value="company">Company pays regardless</option>
                <option value="executive">Executive pays regardless</option>
                <option value="own">Each pays their own fees</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="amendments">Amendments</label>
              <select
                id="amendments"
                name="amendments"
                value={formData.amendments}
                onChange={handleChange}
              >
                <option value="writing">Written amendments only</option>
                <option value="oral">Written or oral amendments</option>
              </select>
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="entireAgreement"
                name="entireAgreement"
                checked={formData.entireAgreement}
                onChange={handleChange}
              />
              <label htmlFor="entireAgreement">Include "entire agreement" clause</label>
            </div>
          </div>
        );
      
      case 8: // Review & Finalize
        const validations = getValidationStatus();
        return (
          <div className="form-section">
            <h3>Review and Finalize</h3>
            
            <div className="risk-indicator risk-medium">
              <strong>Important Note:</strong> This document is a template and may need to be customized for your specific situation. Consider consulting with an attorney to ensure it meets your needs and complies with applicable laws.
            </div>
            
            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Required Information</h4>
            
            {validations.map((validation, index) => (
              <div className="finalization-card" key={index}>
                <h4>
                  <span className={`status-indicator ${validation.valid ? 'status-complete' : 'status-error'}`}></span>
                  {validation.label}
                </h4>
                {!validation.valid && (
                  <p>{validation.message}</p>
                )}
              </div>
            ))}
            
            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Key Legal Considerations</h4>
            
            <div className="finalization-card">
              <h4>
                <span className="status-indicator status-warning"></span>
                Section 409A Compliance
              </h4>
              <p>If this agreement includes deferred compensation, ensure compliance with Section 409A of the Internal Revenue Code to avoid significant tax penalties.</p>
            </div>
            
            {formData.isPublic && (
              <div className="finalization-card">
                <h4>
                  <span className="status-indicator status-warning"></span>
                  SEC Reporting
                </h4>
                <p>For publicly traded companies, executive compensation may need to be disclosed in SEC filings and proxy statements.</p>
              </div>
            )}
            
            {formData.includeNonCompete && formData.governingLaw === "California" && (
              <div className="finalization-card">
                <h4>
                  <span className="status-indicator status-error"></span>
                  California Non-Compete
                </h4>
                <p>Non-compete provisions are generally unenforceable in California. Consider alternative protections such as confidentiality and non-solicitation.</p>
              </div>
            )}
            
            {formData.includeEquity && (
              <div className="finalization-card">
                <h4>
                  <span className="status-indicator status-warning"></span>
                  Equity Documentation
                </h4>
                <p>This agreement references equity compensation but does not include the full equity grant documentation. Ensure that separate equity award agreements are prepared.</p>
              </div>
            )}
            
            {formData.changeOfControlSeverance && (
              <div className="finalization-card">
                <h4>
                  <span className="status-indicator status-warning"></span>
                  "Golden Parachute" Considerations
                </h4>
                <p>Severance payments triggered by a change in control may be subject to additional tax under Sections 280G and 4999 of the Internal Revenue Code.</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container">
      <div className="header">
        <h1>Executive Compensation Agreement Generator</h1>
        <p>Create a customized agreement for C-suite executives and high-level management</p>
      </div>
      
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
      
      <div className="content-container">
        <div className="form-panel">
          {renderTabContent()}
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
      
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
          disabled={currentTab === 0}
        >
          <i data-feather="chevron-left" style={{marginRight: "0.25rem"}} />
          Previous
        </button>
        
        <button
          onClick={openCalendly}
          className="nav-button"
          style={{
            backgroundColor: "#6366f1", 
            color: "white",
            border: "none"
          }}
        >
          <i data-feather="calendar" style={{marginRight: "0.25rem"}} />
          Consultation
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
          <i data-feather="copy" style={{marginRight: "0.25rem"}} />
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
          <i data-feather="file-text" style={{marginRight: "0.25rem"}} />
          Download MS Word
        </button>
        
        <button
          onClick={nextTab}
          className="nav-button next-button"
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <i data-feather="chevron-right" style={{marginLeft: "0.25rem"}} />
        </button>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));