const { useState, useEffect, useRef } = React;

function SeparationAgreementGenerator() {
  // Configuration for tabs
  const tabs = [
    { id: 'basic-info', label: 'Basic Information' },
    { id: 'separation-details', label: 'Separation Details' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'release-terms', label: 'Release Terms' },
    { id: 'post-employment', label: 'Post-Employment' },
    { id: 'miscellaneous', label: 'Miscellaneous' }
  ];

  // State for active tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    // Basic Information
    companyName: 'Think Circuits LLC',
    companyAddress: '8000 Edgewater Drive St 200, Oakland, CA 94621',
    companySignatory: 'Kevin Weekly',
    companySignatoryTitle: 'CEO',
    employeeName: '',
    employeeAddress: '',
    employeeTitle: '',
    employeeStartDate: '',
    
    // Separation Details
    separationDate: '',
    voluntaryResignation: true,
    includeNonRehire: true,
    
    // Compensation
    finalPayDate: '',
    includeAccruedPTO: true,
    benefitsEndDate: '',
    includeExtendedBenefits: true,
    extendedBenefitsEndDate: '',
    expenseReportDeadline: '30',
    includeSeverance: false,
    severanceAmount: '',
    severancePaymentStructure: 'lump-sum', // or 'installments'
    installmentDetails: '',
    
    // Release Terms
    includeGeneralRelease: true,
    includeADEARelease: true,
    includeCaliforniaSpecific: true,
    reviewPeriod: '21',
    revocationPeriod: '7',
    
    // Post-Employment
    includeConfidentiality: true,
    includeNonSolicitation: true,
    nonSolicitationPeriod: '12',
    includeCooperation: true,
    includeNonDisparagement: true,
    includeReturnOfProperty: true,
    
    // Miscellaneous
    includeArbitration: true,
    includeGoverningLaw: true,
    governingLaw: 'California',
    includeNoAdmission: true,
    includeEntireAgreement: true,
    includeCounterparts: true,
    
    // Document details
    fileName: 'Separation-Agreement',
    documentTitle: 'Separation and Release Agreement'
  });

  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);

  // Ref for preview content div
  const previewRef = useRef(null);

  // Generate document text based on form data
  const generateDocumentText = () => {
    let text = `# ${formData.documentTitle}\n\n`;
    
    text += `This Separation and Release Agreement (the "Agreement") is entered into by and between **${formData.companyName}**, a California limited liability company with its principal place of business at ${formData.companyAddress} (the "Company") and **${formData.employeeName || "[EMPLOYEE NAME]"}**, an individual residing at ${formData.employeeAddress || "[EMPLOYEE ADDRESS]"} (the "Employee"). The Company and Employee are collectively referred to as the "Parties."\n\n`;
    
    text += `## RECITALS\n\n`;
    
    text += `WHEREAS, Employee has been employed by the Company as a ${formData.employeeTitle || "[TITLE]"} since ${formData.employeeStartDate || "[START DATE]"};\n\n`;
    
    text += `WHEREAS, Employee's employment with the Company will end effective ${formData.separationDate || "[SEPARATION DATE]"} (the "Separation Date");\n\n`;
    
    text += `WHEREAS, the Parties wish to resolve any and all disputes, claims, complaints, grievances, charges, actions, petitions, and demands that the Employee may have against the Company, including, but not limited to, any and all claims arising out of or in any way related to Employee's employment with or separation from the Company;\n\n`;
    
    text += `NOW, THEREFORE, in consideration of the mutual promises made herein, the Company and Employee hereby agree as follows:\n\n`;
    
    text += `## AGREEMENT\n\n`;
    
    text += `1. **${formData.voluntaryResignation ? 'VOLUNTARY RESIGNATION' : 'SEPARATION OF EMPLOYMENT'}**\n\n`;
    
    if (formData.voluntaryResignation) {
      text += `   a. Employee hereby voluntarily resigns from employment with the Company effective as of the Separation Date.\n\n`;
    } else {
      text += `   a. Employee's employment with the Company will end effective as of the Separation Date.\n\n`;
    }
    
    text += `   b. Employee acknowledges that after the Separation Date, Employee will have no authority to act on behalf of the Company and will not represent themselves as an employee or agent of the Company.\n\n`;
    
    if (formData.includeNonRehire) {
      text += `   c. Employee acknowledges that the Company has no obligation to employ Employee in the future, and Employee agrees not to seek future employment with the Company.\n\n`;
    }
    
    text += `2. **FINAL COMPENSATION AND BENEFITS**\n\n`;
    
    text += `   a. **Final Pay**: The Company will pay Employee all accrued salary earned through the Separation Date, subject to standard payroll deductions and withholdings, on ${formData.finalPayDate || "the Company's next regular payroll date following the Separation Date"}.\n\n`;
    
    if (formData.includeAccruedPTO) {
      text += `   b. **Accrued Paid Time Off**: The Company will pay Employee for all accrued and unused paid time off earned through the Separation Date, subject to standard payroll deductions and withholdings, on ${formData.finalPayDate || "the Company's next regular payroll date following the Separation Date"}.\n\n`;
    }
    
    text += `   c. **Benefits**: Employee's eligibility to participate in the Company's group health insurance plan will end on ${formData.benefitsEndDate || "[BENEFITS END DATE]"}. Thereafter, Employee may be eligible to continue health insurance coverage under COBRA at Employee's own expense. Employee will receive information regarding COBRA continuation coverage under separate cover.\n\n`;
    
    text += `   d. **Expense Reimbursement**: The Company will reimburse Employee for all reasonable business expenses incurred prior to the Separation Date, provided that Employee submits all expense reports within ${formData.expenseReportDeadline} days after the Separation Date.\n\n`;
    
    text += `3. **SEPARATION CONSIDERATION**\n\n`;
    
    text += `   In consideration for the release of claims and other promises made by Employee in this Agreement, and provided that Employee signs this Agreement and complies with its terms, the Company agrees to provide the following separation benefits, which Employee acknowledges and agrees are benefits to which Employee would not otherwise be entitled:\n\n`;
    
    if (formData.includeExtendedBenefits) {
      text += `   a. **Extended Benefits**: The Company will continue to provide Employee with health insurance coverage at the Company's expense through ${formData.extendedBenefitsEndDate || "[EXTENDED BENEFITS END DATE]"}. This continuation of benefits shall be inclusive of any benefits to which Employee would be entitled under COBRA during this period. After ${formData.extendedBenefitsEndDate || "[EXTENDED BENEFITS END DATE]"}, Employee may elect to continue coverage at Employee's own expense under COBRA.\n\n`;
    }
    
    if (formData.includeSeverance) {
      text += `   b. **Severance Payment**: The Company will pay Employee a severance payment in the amount of ${formData.severanceAmount || "[AMOUNT]"}, less applicable withholdings and deductions, to be paid ${formData.severancePaymentStructure === 'lump-sum' ? 'in a lump sum on [PAYMENT DATE]' : `in installments as follows: ${formData.installmentDetails || "[INSTALLMENT DETAILS]"}`}.\n\n`;
    }
    
    if (formData.includeGeneralRelease) {
      text += `4. **GENERAL RELEASE OF CLAIMS**\n\n`;
      
      text += `   a. In exchange for the consideration provided in this Agreement, Employee hereby generally and completely releases the Company and its current and former directors, officers, employees, shareholders, partners, agents, attorneys, predecessors, successors, parent and subsidiary entities, insurers, affiliates, and assigns (collectively, the "Released Parties") from any and all claims, liabilities, demands, causes of action, and obligations, both known and unknown, that Employee may have or has ever had against the Released Parties, or any of them, arising out of or in any way related to events, acts, conduct, or omissions occurring prior to or on the date Employee signs this Agreement (collectively, the "Released Claims").\n\n`;
      
      text += `   b. The Released Claims include, but are not limited to:\n\n`;
      
      text += `      i. All claims arising out of or in any way related to Employee's employment with the Company or the termination of that employment;\n\n`;
      
      text += `      ii. All claims related to Employee's compensation or benefits from the Company, including, but not limited to, salary, bonuses, commissions, vacation pay, paid time off, expense reimbursements, severance pay, fringe benefits, stock, stock options, or any other ownership interests in the Company;\n\n`;
      
      text += `      iii. All claims for breach of contract, wrongful termination, and breach of the implied covenant of good faith and fair dealing;\n\n`;
      
      text += `      iv. All tort claims, including, but not limited to, claims for fraud, defamation, emotional distress, and discharge in violation of public policy;\n\n`;
      
      if (formData.includeADEARelease) {
        text += `      v. All federal, state, and local statutory claims, including, but not limited to, claims for discrimination, harassment, retaliation, attorneys' fees, or other claims arising under the federal Civil Rights Act of 1964 (as amended), the federal Americans with Disabilities Act of 1990, the federal Age Discrimination in Employment Act of 1967 (as amended) ("ADEA"), ${formData.includeCaliforniaSpecific ? 'the California Fair Employment and Housing Act (as amended), the California Labor Code (as amended),' : ''} and all other laws and regulations relating to employment.\n\n`;
      } else {
        text += `      v. All federal, state, and local statutory claims, including, but not limited to, claims for discrimination, harassment, retaliation, attorneys' fees, or other claims arising under the federal Civil Rights Act of 1964 (as amended), the federal Americans with Disabilities Act of 1990, ${formData.includeCaliforniaSpecific ? 'the California Fair Employment and Housing Act (as amended), the California Labor Code (as amended),' : ''} and all other laws and regulations relating to employment.\n\n`;
      }
    }
    
    if (formData.includeCaliforniaSpecific) {
      text += `5. **WAIVER OF UNKNOWN CLAIMS**\n\n`;
      
      text += `   Employee acknowledges that Employee has read and understands Section 1542 of the California Civil Code which reads as follows:\n\n`;
      
      text += `   "A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release and that, if known by him or her, would have materially affected his or her settlement with the debtor or released party."\n\n`;
      
      text += `   Employee hereby expressly waives and relinquishes all rights and benefits under that section and any law of any jurisdiction of similar effect with respect to Employee's release of any claims Employee may have against the Company.\n\n`;
    }
    
    text += `6. **EXCEPTIONS TO RELEASE**\n\n`;
    
    text += `   Notwithstanding the foregoing, the following are not included in the Released Claims (the "Excluded Claims"):\n\n`;
    
    text += `   a. Any rights or claims for indemnification Employee may have pursuant to any written indemnification agreement with the Company to which Employee is a party, the charter, bylaws, or operating agreements of the Company, or under applicable law;\n\n`;
    
    text += `   b. Any rights or claims which are not waivable as a matter of law;\n\n`;
    
    text += `   c. Any claims for breach of this Agreement.\n\n`;
    
    text += `   Employee hereby represents and warrants that, other than the Excluded Claims, Employee is not aware of any claims Employee has or might have against any of the Released Parties that are not included in the Released Claims.\n\n`;
    
    text += `7. **NO PENDING OR FUTURE LAWSUITS**\n\n`;
    
    text += `   Employee represents that Employee has no lawsuits, claims, or actions pending in Employee's name, or on behalf of any other person or entity, against the Company or any of the other Released Parties. Employee also represents that Employee does not intend to bring any claims on Employee's own behalf or on behalf of any other person or entity against the Company or any of the other Released Parties.\n\n`;
    
    if (formData.includeNonDisparagement) {
      text += `8. **NON-DISPARAGEMENT**\n\n`;
      
      text += `   a. Employee agrees to refrain from any disparagement, defamation, libel, or slander of any of the Released Parties, and agrees to refrain from any tortious interference with the contracts and relationships of any of the Released Parties.\n\n`;
      
      text += `   b. The Company agrees to instruct its officers and directors to refrain from any disparagement, defamation, libel, or slander of Employee, and to refrain from any tortious interference with the contracts and relationships of Employee.\n\n`;
    }
    
    if (formData.includeReturnOfProperty) {
      text += `9. **CONFIDENTIALITY AND RETURN OF COMPANY PROPERTY**\n\n`;
      
      text += `   a. Employee agrees to maintain in complete confidence the existence of this Agreement, the contents and terms of this Agreement, and the consideration for this Agreement (collectively, the "Separation Information"). Employee may disclose the Separation Information only to Employee's immediate family members, legal and financial advisors, and as required by law.\n\n`;
      
      text += `   b. Employee affirms that Employee has returned all documents and other items provided to Employee by the Company, developed or obtained by Employee in connection with Employee's employment with the Company, or otherwise belonging to the Company (with the exception of a copy of the Employee Handbook and personnel documents specifically relating to Employee), including but not limited to, all passwords to any software or other programs or data that Employee used in performing services for the Company.\n\n`;
    }
    
    if (formData.includeConfidentiality) {
      text += `10. **CONFIDENTIALITY OBLIGATIONS**\n\n`;
      
      text += `    Employee acknowledges and reaffirms Employee's continuing obligations under any Confidentiality Agreement that Employee previously executed, including but not limited to, promises to protect all confidential and proprietary information of the Company and to refrain from soliciting the Company's employees or customers for a specified period.\n\n`;
    }
    
    if (formData.includeNonSolicitation) {
      text += `11. **NON-SOLICITATION**\n\n`;
      
      text += `    Employee agrees that for a period of ${formData.nonSolicitationPeriod} months after the Separation Date, Employee will not, either directly or indirectly, solicit, induce, recruit, or encourage any of the Company's employees to leave their employment, or attempt to do so, either for Employee or for any other person or entity.\n\n`;
    }
    
    if (formData.includeCooperation) {
      text += `12. **COOPERATION**\n\n`;
      
      text += `    Employee agrees to cooperate with the Company in responding to the legitimate business needs of the Company regarding any matters with which Employee was involved during Employee's employment, including but not limited to cooperating in the defense of any claims or potential claims that may be made against the Company in which Employee has relevant knowledge or information.\n\n`;
    }
    
    if (formData.includeNoAdmission) {
      text += `13. **NO ADMISSION OF LIABILITY**\n\n`;
      
      text += `    This Agreement constitutes a compromise and settlement of any and all potential disputed claims. No action taken by the Company hereto, either previously or in connection with this Agreement, shall be deemed or construed to be: (a) an admission of the truth or falsity of any potential claims; or (b) an acknowledgment or admission by the Company of any fault or liability whatsoever to Employee or to any third party.\n\n`;
    }
    
    text += `14. **REPRESENTATIONS**\n\n`;
    
    text += `    Employee represents that Employee has consulted with an attorney, or has had sufficient opportunity to consult with an attorney of Employee's choosing, prior to signing this Agreement and that Employee is signing this Agreement knowingly, voluntarily, and with full understanding of its terms.\n\n`;
    
    if (formData.includeADEARelease) {
      text += `15. **REVIEW PERIOD**\n\n`;
      
      text += `    Employee acknowledges that Employee has been given ${formData.reviewPeriod} days to review this Agreement and that Employee understands that Employee may use as much or as little of this review period as Employee wishes prior to signing.\n\n`;
      
      text += `16. **REVOCATION PERIOD**\n\n`;
      
      text += `    Employee understands that Employee has ${formData.revocationPeriod} days after signing this Agreement to revoke it by providing written notice to [COMPANY CONTACT] at [CONTACT INFORMATION]. This Agreement will not become effective and enforceable until the ${formData.revocationPeriod} day revocation period has expired.\n\n`;
    }
    
    if (formData.includeArbitration) {
      text += `17. **ARBITRATION**\n\n`;
      
      text += `    The Parties agree that any and all controversies, claims, or disputes with anyone (including the Company and any employee, officer, director, shareholder or benefit plan of the Company in their capacity as such or otherwise) arising out of, relating to, or resulting from Employee's employment with the Company or termination thereof, including any breach of this Agreement, will be subject to binding arbitration under the Arbitration Rules set forth in California Code of Civil Procedure Section 1280 through 1294.2, including Section 1281.8 (the "Act"), and pursuant to California law. THE PARTIES HEREBY WAIVE ANY RIGHTS THEY MAY HAVE TO TRIAL BY JURY IN REGARD TO ARBITRABLE CLAIMS.\n\n`;
    }
    
    text += `18. **MISCELLANEOUS**\n\n`;
    
    if (formData.includeEntireAgreement) {
      text += `    a. **Entire Agreement**: This Agreement, together with any Confidentiality Agreement, represents the entire agreement and understanding between the Company and Employee concerning the subject matter of this Agreement and Employee's employment with and separation from the Company and the events leading thereto and associated therewith, and supersedes and replaces any and all prior agreements and understandings concerning the subject matter of this Agreement and Employee's relationship with the Company.\n\n`;
    }
    
    if (formData.includeGoverningLaw) {
      text += `    b. **Governing Law**: This Agreement shall be governed by the laws of the State of ${formData.governingLaw}, without regard for choice-of-law provisions.\n\n`;
    }
    
    text += `    c. **Severability**: If any provision of this Agreement is held to be invalid, void, or unenforceable, the remaining provisions shall remain in full force and effect to the fullest extent permitted by law.\n\n`;
    
    if (formData.includeADEARelease) {
      text += `    d. **Effective Date**: This Agreement will become effective on the eighth (8th) day after the Employee signs this Agreement, provided that Employee does not revoke the Agreement prior to that date (the "Effective Date").\n\n`;
    }
    
    if (formData.includeCounterparts) {
      text += `    e. **Counterparts**: This Agreement may be executed in counterparts and by facsimile, and each counterpart and facsimile shall have the same force and effect as an original and shall constitute an effective, binding agreement on the part of each of the undersigned.\n\n`;
    }
    
    text += `    f. **Voluntary Execution of Agreement**: This Agreement is executed voluntarily and without any duress or undue influence on the part or behalf of the Parties hereto, with the full intent of releasing all claims. The Parties acknowledge that:\n\n`;
    
    text += `       i. They have read this Agreement;\n\n`;
    
    text += `       ii. They have been represented in the preparation, negotiation, and execution of this Agreement by legal counsel of their own choice or have elected not to retain legal counsel;\n\n`;
    
    text += `       iii. They understand the terms and consequences of this Agreement and of the releases it contains;\n\n`;
    
    text += `       iv. They are fully aware of the legal and binding effect of this Agreement.\n\n`;
    
    return text;
  };

  // State for document text
  const [documentText, setDocumentText] = useState(generateDocumentText());

  // Update document text when form data changes
  useEffect(() => {
    setDocumentText(generateDocumentText());
  }, [formData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Record the field that was changed for highlighting
    setLastChanged(name);
  };

  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    // Map fields to sections in the document
    const fieldToSectionMap = {
      // Basic Information
      companyName: 'company-info',
      companyAddress: 'company-info',
      employeeName: 'employee-info',
      employeeAddress: 'employee-info',
      employeeTitle: 'employee-title',
      employeeStartDate: 'employment-period',
      
      // Separation Details
      separationDate: 'separation-date',
      voluntaryResignation: 'resignation-section',
      includeNonRehire: 'non-rehire',
      
      // Compensation
      finalPayDate: 'final-pay',
      includeAccruedPTO: 'accrued-pto',
      benefitsEndDate: 'benefits-end',
      includeExtendedBenefits: 'extended-benefits',
      extendedBenefitsEndDate: 'extended-benefits-date',
      expenseReportDeadline: 'expense-report',
      includeSeverance: 'severance',
      severanceAmount: 'severance-amount',
      severancePaymentStructure: 'severance-structure',
      installmentDetails: 'installment-details',
      
      // Release Terms
      includeGeneralRelease: 'general-release',
      includeADEARelease: 'adea-release',
      includeCaliforniaSpecific: 'california-specific',
      reviewPeriod: 'review-period',
      revocationPeriod: 'revocation-period',
      
      // Post-Employment
      includeConfidentiality: 'confidentiality',
      includeNonSolicitation: 'non-solicitation',
      nonSolicitationPeriod: 'non-solicitation-period',
      includeCooperation: 'cooperation',
      includeNonDisparagement: 'non-disparagement',
      includeReturnOfProperty: 'return-property',
      
      // Miscellaneous
      includeArbitration: 'arbitration',
      includeGoverningLaw: 'governing-law',
      governingLaw: 'governing-law-state',
      includeNoAdmission: 'no-admission',
      includeEntireAgreement: 'entire-agreement',
      includeCounterparts: 'counterparts'
    };
    
    return fieldToSectionMap[lastChanged] || null;
  };

  // Function to create a highlighted version of the document text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    // Define regex patterns to match different sections of the document
    const sectionPatterns = {
      // Basic Information
      'company-info': /\*\*(?:Think Circuits LLC|[^*]+)\*\*,\s*a\s*California\s*limited\s*liability\s*company\s*with\s*its\s*principal\s*place\s*of\s*business\s*at[^(]*\(the\s*"Company"\)/,
      'employee-info': /\*\*(?:\[EMPLOYEE NAME\]|[^*]+)\*\*,\s*an\s*individual\s*residing\s*at[^(]*\(the\s*"Employee"\)/,
      'employee-title': /Employee\s*has\s*been\s*employed\s*by\s*the\s*Company\s*as\s*a\s*(?:\[TITLE\]|[^s]*)\s*since/,
      'employment-period': /as\s*a\s*(?:\[TITLE\]|[^s]*)\s*since\s*(?:\[START DATE\]|[^;]*);/,
      'separation-date': /Employee['']s\s*employment\s*with\s*the\s*Company\s*will\s*end\s*effective\s*(?:\[SEPARATION DATE\]|[^(]*)\s*\(the\s*"Separation\s*Date"\)/,
      
      // Separation Details
      'resignation-section': /1\.\s*\*\*(?:VOLUNTARY\s*RESIGNATION|SEPARATION\s*OF\s*EMPLOYMENT)\*\*\s*[\s\S]*?(?=2\.\s*\*\*)/,
      'non-rehire': /c\.\s*Employee\s*acknowledges\s*that\s*the\s*Company\s*has\s*no\s*obligation[\s\S]*?(?=\n\n)/,
      
      // Compensation
      'final-pay': /a\.\s*\*\*Final\s*Pay\*\*:[\s\S]*?on\s*(?:the\s*Company's\s*next\s*regular\s*payroll\s*date\s*following\s*the\s*Separation\s*Date|[^.\n]*)/,
      'accrued-pto': /b\.\s*\*\*Accrued\s*Paid\s*Time\s*Off\*\*:[\s\S]*?(?=\n\n)/,
      'benefits-end': /c\.\s*\*\*Benefits\*\*:[\s\S]*?will\s*end\s*on\s*(?:\[BENEFITS\s*END\s*DATE\]|[^.]*)/,
      'extended-benefits': /a\.\s*\*\*Extended\s*Benefits\*\*:[\s\S]*?(?=\n\n)/,
      'extended-benefits-date': /expense\s*through\s*(?:\[EXTENDED\s*BENEFITS\s*END\s*DATE\]|[^.]*)/,
      'expense-report': /d\.\s*\*\*Expense\s*Reimbursement\*\*:[\s\S]*?within\s*\d+\s*days/,
      'severance': /b\.\s*\*\*Severance\s*Payment\*\*:[\s\S]*?(?=\n\n)/,
      'severance-amount': /in\s*the\s*amount\s*of\s*(?:\[AMOUNT\]|[^,]*)/,
      'severance-structure': /to\s*be\s*paid\s*(?:in\s*a\s*lump\s*sum|in\s*installments\s*as\s*follows)/,
      'installment-details': /in\s*installments\s*as\s*follows:\s*(?:\[INSTALLMENT\s*DETAILS\]|[^\n]*)/,
      
      // Release Terms
      'general-release': /4\.\s*\*\*GENERAL\s*RELEASE\s*OF\s*CLAIMS\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'adea-release': /claims\s*arising\s*under\s*the\s*federal\s*Civil\s*Rights\s*Act[\s\S]*?(?=\n\n)/,
      'california-specific': /5\.\s*\*\*WAIVER\s*OF\s*UNKNOWN\s*CLAIMS\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'review-period': /Employee\s*has\s*been\s*given\s*\d+\s*days/,
      'revocation-period': /Employee\s*has\s*\d+\s*days\s*after\s*signing/,
      
      // Post-Employment
      'confidentiality': /\d+\.\s*\*\*CONFIDENTIALITY\s*OBLIGATIONS\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'non-solicitation': /\d+\.\s*\*\*NON-SOLICITATION\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'non-solicitation-period': /for\s*a\s*period\s*of\s*\d+\s*months/,
      'cooperation': /\d+\.\s*\*\*COOPERATION\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'non-disparagement': /\d+\.\s*\*\*NON-DISPARAGEMENT\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'return-property': /\d+\.\s*\*\*CONFIDENTIALITY\s*AND\s*RETURN\s*OF\s*COMPANY\s*PROPERTY\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      
      // Miscellaneous
      'arbitration': /\d+\.\s*\*\*ARBITRATION\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'governing-law': /b\.\s*\*\*Governing\s*Law\*\*:[\s\S]*?(?=\n\n)/,
      'governing-law-state': /laws\s*of\s*the\s*State\s*of\s*[^,]*/,
      'no-admission': /\d+\.\s*\*\*NO\s*ADMISSION\s*OF\s*LIABILITY\*\*[\s\S]*?(?=\n\n\d+\.\s*\*\*)/,
      'entire-agreement': /a\.\s*\*\*Entire\s*Agreement\*\*:[\s\S]*?(?=\n\n)/,
      'counterparts': /e\.\s*\*\*Counterparts\*\*:[\s\S]*?(?=\n\n)/
    };
    
    // If we have a pattern for the section to highlight
    if (sectionPatterns[sectionToHighlight]) {
      // Replace the matched pattern with a highlighted version
      return documentText.replace(sectionPatterns[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };

  // Create highlightable content
  const highlightedText = createHighlightedText();

  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

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

  // Copy to clipboard function
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText).then(() => {
        alert("Document copied to clipboard!");
      });
    } catch (error) {
      console.error("Failed to copy: ", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };

  // Download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Call the document generation function
      window.generateWordDoc(documentText, formData);
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="container">
          <h1>Separation Agreement Generator</h1>
        </div>
      </div>
      
      <div className="container">
        <div className="app-content">
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
            
            {/* Tab 1: Basic Information */}
            <div className={`tab-content ${currentTab === 0 ? 'active' : ''}`}>
              <h2>Basic Information</h2>
              <p>Enter the basic details for the separation agreement.</p>
              
              <div className="form-group">
                <label className="form-label">Company Name:</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Company Address:</label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Company Signatory:</label>
                <input
                  type="text"
                  name="companySignatory"
                  value={formData.companySignatory}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Company Signatory Title:</label>
                <input
                  type="text"
                  name="companySignatoryTitle"
                  value={formData.companySignatoryTitle}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Employee Name:</label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Employee Address:</label>
                <input
                  type="text"
                  name="employeeAddress"
                  value={formData.employeeAddress}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="123 Main St, Anytown, CA 12345"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Employee Title:</label>
                <input
                  type="text"
                  name="employeeTitle"
                  value={formData.employeeTitle}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Software Engineer"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Employee Start Date:</label>
                <input
                  type="text"
                  name="employeeStartDate"
                  value={formData.employeeStartDate}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="January 1, 2022"
                />
              </div>
            </div>
            
            {/* Tab 2: Separation Details */}
            <div className={`tab-content ${currentTab === 1 ? 'active' : ''}`}>
              <h2>Separation Details</h2>
              <p>Define the terms of the employment separation.</p>
              
              <div className="form-group">
                <label className="form-label">Separation Date:</label>
                <input
                  type="text"
                  name="separationDate"
                  value={formData.separationDate}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="June 30, 2025"
                />
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="voluntaryResignation"
                  name="voluntaryResignation"
                  checked={formData.voluntaryResignation}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="voluntaryResignation" className="checkbox-label">
                  Frame as voluntary resignation (helps employee save face)
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeNonRehire"
                  name="includeNonRehire"
                  checked={formData.includeNonRehire}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeNonRehire" className="checkbox-label">
                  Include non-rehire provision
                </label>
              </div>
            </div>
            
            {/* Tab 3: Compensation */}
            <div className={`tab-content ${currentTab === 2 ? 'active' : ''}`}>
              <h2>Compensation</h2>
              <p>Set the financial terms of the separation agreement.</p>
              
              <div className="form-group">
                <label className="form-label">Final Pay Date:</label>
                <input
                  type="text"
                  name="finalPayDate"
                  value={formData.finalPayDate}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Leave blank for next regular payroll date"
                />
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeAccruedPTO"
                  name="includeAccruedPTO"
                  checked={formData.includeAccruedPTO}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeAccruedPTO" className="checkbox-label">
                  Include accrued PTO payout
                </label>
              </div>
              
              <div className="form-group">
                <label className="form-label">Benefits End Date:</label>
                <input
                  type="text"
                  name="benefitsEndDate"
                  value={formData.benefitsEndDate}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="June 30, 2025"
                />
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeExtendedBenefits"
                  name="includeExtendedBenefits"
                  checked={formData.includeExtendedBenefits}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeExtendedBenefits" className="checkbox-label">
                  Include extended benefits
                </label>
              </div>
              
              {formData.includeExtendedBenefits && (
                <div className="form-group">
                  <label className="form-label">Extended Benefits End Date:</label>
                  <input
                    type="text"
                    name="extendedBenefitsEndDate"
                    value={formData.extendedBenefitsEndDate}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="July 31, 2025"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Expense Report Deadline (days after separation):</label>
                <input
                  type="number"
                  name="expenseReportDeadline"
                  value={formData.expenseReportDeadline}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  max="90"
                />
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeSeverance"
                  name="includeSeverance"
                  checked={formData.includeSeverance}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeSeverance" className="checkbox-label">
                  Include severance payment
                </label>
              </div>
              
              {formData.includeSeverance && (
                <>
                  <div className="form-group">
                    <label className="form-label">Severance Amount:</label>
                    <input
                      type="text"
                      name="severanceAmount"
                      value={formData.severanceAmount}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="$10,000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Payment Structure:</label>
                    <select
                      name="severancePaymentStructure"
                      value={formData.severancePaymentStructure}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="lump-sum">Lump Sum</option>
                      <option value="installments">Installments</option>
                    </select>
                  </div>
                  
                  {formData.severancePaymentStructure === 'installments' && (
                    <div className="form-group">
                      <label className="form-label">Installment Details:</label>
                      <input
                        type="text"
                        name="installmentDetails"
                        value={formData.installmentDetails}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="4 equal monthly installments of $2,500 each on the 15th of each month"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Tab 4: Release Terms */}
            <div className={`tab-content ${currentTab === 3 ? 'active' : ''}`}>
              <h2>Release Terms</h2>
              <p>Configure the release of claims provisions.</p>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeGeneralRelease"
                  name="includeGeneralRelease"
                  checked={formData.includeGeneralRelease}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeGeneralRelease" className="checkbox-label">
                  Include general release of claims
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeADEARelease"
                  name="includeADEARelease"
                  checked={formData.includeADEARelease}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeADEARelease" className="checkbox-label">
                  Include Age Discrimination in Employment Act (ADEA) release
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeCaliforniaSpecific"
                  name="includeCaliforniaSpecific"
                  checked={formData.includeCaliforniaSpecific}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeCaliforniaSpecific" className="checkbox-label">
                  Include California-specific Civil Code Section 1542 waiver
                </label>
              </div>
              
              {formData.includeADEARelease && (
                <>
                  <div className="form-group">
                    <label className="form-label">Review Period (days):</label>
                    <input
                      type="number"
                      name="reviewPeriod"
                      value={formData.reviewPeriod}
                      onChange={handleChange}
                      className="form-input"
                      min="7"
                      max="45"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Revocation Period (days):</label>
                    <input
                      type="number"
                      name="revocationPeriod"
                      value={formData.revocationPeriod}
                      onChange={handleChange}
                      className="form-input"
                      min="7"
                      max="14"
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* Tab 5: Post-Employment */}
            <div className={`tab-content ${currentTab === 4 ? 'active' : ''}`}>
              <h2>Post-Employment</h2>
              <p>Set obligations after employment ends.</p>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeConfidentiality"
                  name="includeConfidentiality"
                  checked={formData.includeConfidentiality}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeConfidentiality" className="checkbox-label">
                  Include confidentiality obligations
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeNonSolicitation"
                  name="includeNonSolicitation"
                  checked={formData.includeNonSolicitation}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeNonSolicitation" className="checkbox-label">
                  Include non-solicitation provision
                </label>
              </div>
              
              {formData.includeNonSolicitation && (
                <div className="form-group">
                  <label className="form-label">Non-Solicitation Period (months):</label>
                  <input
                    type="number"
                    name="nonSolicitationPeriod"
                    value={formData.nonSolicitationPeriod}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="24"
                  />
                </div>
              )}
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeCooperation"
                  name="includeCooperation"
                  checked={formData.includeCooperation}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeCooperation" className="checkbox-label">
                  Include cooperation provision
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeNonDisparagement"
                  name="includeNonDisparagement"
                  checked={formData.includeNonDisparagement}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeNonDisparagement" className="checkbox-label">
                  Include non-disparagement provision
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeReturnOfProperty"
                  name="includeReturnOfProperty"
                  checked={formData.includeReturnOfProperty}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeReturnOfProperty" className="checkbox-label">
                  Include return of company property provision
                </label>
              </div>
            </div>
            
            {/* Tab 6: Miscellaneous */}
            <div className={`tab-content ${currentTab === 5 ? 'active' : ''}`}>
              <h2>Miscellaneous</h2>
              <p>Additional agreement terms and document settings.</p>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeArbitration"
                  name="includeArbitration"
                  checked={formData.includeArbitration}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeArbitration" className="checkbox-label">
                  Include arbitration provision
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeGoverningLaw"
                  name="includeGoverningLaw"
                  checked={formData.includeGoverningLaw}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeGoverningLaw" className="checkbox-label">
                  Include governing law provision
                </label>
              </div>
              
              {formData.includeGoverningLaw && (
                <div className="form-group">
                  <label className="form-label">Governing Law State:</label>
                  <input
                    type="text"
                    name="governingLaw"
                    value={formData.governingLaw}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              )}
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeNoAdmission"
                  name="includeNoAdmission"
                  checked={formData.includeNoAdmission}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeNoAdmission" className="checkbox-label">
                  Include no admission of liability provision
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeEntireAgreement"
                  name="includeEntireAgreement"
                  checked={formData.includeEntireAgreement}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeEntireAgreement" className="checkbox-label">
                  Include entire agreement provision
                </label>
              </div>
              
              <div className="form-group form-checkbox-group">
                <input
                  type="checkbox"
                  id="includeCounterparts"
                  name="includeCounterparts"
                  checked={formData.includeCounterparts}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="includeCounterparts" className="checkbox-label">
                  Include counterparts provision
                </label>
              </div>
              
              <div className="form-group">
                <label className="form-label">Document File Name:</label>
                <input
                  type="text"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Document Title:</label>
                <input
                  type="text"
                  name="documentTitle"
                  value={formData.documentTitle}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="navigation-buttons">
              <button
                onClick={prevTab}
                className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
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
                <i data-feather="file-text"></i>
                Download MS Word
              </button>
              
              <button
                onClick={nextTab}
                className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
                disabled={currentTab === tabs.length - 1}
              >
                Next
                <i data-feather="chevron-right"></i>
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
      </div>
    </div>
  );
}

ReactDOM.render(<SeparationAgreementGenerator />, document.getElementById('root'));