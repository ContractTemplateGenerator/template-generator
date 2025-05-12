const { useState, useEffect, useRef } = React;

function SeparationAgreementGenerator() {
  // Configuration for tabs
  const tabs = [
    { id: 'basic-info', label: 'Basic Information' },
    { id: 'separation-details', label: 'Separation Details' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'release-terms', label: 'Release Terms' },
    { id: 'post-employment', label: 'Post-Employment' },
    { id: 'miscellaneous', label: 'Miscellaneous' },
    { id: 'finalize', label: 'Finalize' }
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
    employeeAge: 'unknown', // 'under40', 'over40', or 'unknown'
    
    // Separation Details
    separationDate: '',
    voluntaryResignation: true,
    includeNonRehire: true,
    
    // Compensation
    finalPayDate: '',
    ptoHandling: 'payout', // 'payout', 'burndown', or 'both'
    ptoInstructions: '',
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
    includeNoAdmission: true,
    includeGoverningLaw: true,
    governingLaw: 'California',
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
    let text = `<h1 class="document-title">${formData.documentTitle}</h1>

<p>This Separation and Release Agreement (the "Agreement") is entered into by and between <strong>${formData.companyName}</strong>, a California limited liability company with its principal place of business at ${formData.companyAddress} (the "Company") and <strong>${formData.employeeName || "[EMPLOYEE NAME]"}</strong>, an individual residing at ${formData.employeeAddress || "[EMPLOYEE ADDRESS]"} (the "Employee"). The Company and Employee are collectively referred to as the "Parties."</p>

<h2>RECITALS</h2>

<p>WHEREAS, Employee has been employed by the Company as a ${formData.employeeTitle || "[TITLE]"} since ${formData.employeeStartDate || "[START DATE]"};</p>

<p>WHEREAS, Employee's employment with the Company will end effective ${formData.separationDate || "[SEPARATION DATE]"} (the "Separation Date");</p>

<p>WHEREAS, the Parties wish to resolve any and all disputes, claims, complaints, grievances, charges, actions, petitions, and demands that the Employee may have against the Company, including, but not limited to, any and all claims arising out of or in any way related to Employee's employment with or separation from the Company;</p>

<p>NOW, THEREFORE, in consideration of the mutual promises made herein, the Company and Employee hereby agree as follows:</p>

<h2>AGREEMENT</h2>

<ol class="agreement-sections">
    <li>
        <strong>${formData.voluntaryResignation ? 'VOLUNTARY RESIGNATION' : 'SEPARATION OF EMPLOYMENT'}</strong>
        <ol type="a">
            <li>${formData.voluntaryResignation ? 'Employee hereby voluntarily resigns from employment with the Company effective as of the Separation Date.' : 'Employee\'s employment with the Company will end effective as of the Separation Date.'}</li>
            <li>Employee acknowledges that after the Separation Date, Employee will have no authority to act on behalf of the Company and will not represent themselves as an employee or agent of the Company.</li>
            ${formData.includeNonRehire ? '<li>Employee acknowledges that the Company has no obligation to employ Employee in the future, and Employee agrees not to seek future employment with the Company.</li>' : ''}
        </ol>
    </li>

    <li>
        <strong>FINAL COMPENSATION AND BENEFITS</strong>
        <ol type="a">
            <li><strong>Final Pay</strong>: The Company will pay Employee all accrued salary earned through the Separation Date, subject to standard payroll deductions and withholdings, on ${formData.finalPayDate || "the Company's next regular payroll date following the Separation Date"}.</li>
            ${formData.includeAccruedPTO ? formData.ptoHandling === 'payout' ? 
            '<li><strong>Accrued Paid Time Off</strong>: The Company will pay Employee for all accrued and unused paid time off earned through the Separation Date, subject to standard payroll deductions and withholdings, on ' + (formData.finalPayDate || "the Company's next regular payroll date following the Separation Date") + '.</li>' : 
            formData.ptoHandling === 'burndown' ? 
            '<li><strong>Accrued Paid Time Off</strong>: Employee will be scheduled to use all accrued and unused paid time off between the date of this Agreement and the Separation Date.</li>' : 
            formData.ptoHandling === 'both' && formData.ptoInstructions ? 
            '<li><strong>Accrued Paid Time Off</strong>: ' + formData.ptoInstructions + '</li>' : 
            '<li><strong>Accrued Paid Time Off</strong>: The Company will pay Employee for all accrued and unused paid time off earned through the Separation Date, subject to standard payroll deductions and withholdings, on ' + (formData.finalPayDate || "the Company's next regular payroll date following the Separation Date") + '.</li>' : ''}
            <li><strong>Benefits</strong>: Employee's eligibility to participate in the Company's group health insurance plan will end on ${formData.benefitsEndDate || "[BENEFITS END DATE]"}. Thereafter, Employee may be eligible to continue health insurance coverage under COBRA at Employee's own expense. Employee will receive information regarding COBRA continuation coverage under separate cover.</li>
            <li><strong>Expense Reimbursement</strong>: The Company will reimburse Employee for all reasonable business expenses incurred prior to the Separation Date, provided that Employee submits all expense reports within ${formData.expenseReportDeadline} days after the Separation Date.</li>
        </ol>
    </li>

    <li>
        <strong>SEPARATION CONSIDERATION</strong>
        <p>In consideration for the release of claims and other promises made by Employee in this Agreement, and provided that Employee signs this Agreement and complies with its terms, the Company agrees to provide the following separation benefits, which Employee acknowledges and agrees are benefits to which Employee would not otherwise be entitled:</p>
        <ol type="a">
            ${formData.includeExtendedBenefits ? '<li><strong>Extended Benefits</strong>: The Company will continue to provide Employee with health insurance coverage at the Company\'s expense through ' + (formData.extendedBenefitsEndDate || "[EXTENDED BENEFITS END DATE]") + '. This continuation of benefits shall be inclusive of any benefits to which Employee would be entitled under COBRA during this period. After ' + (formData.extendedBenefitsEndDate || "[EXTENDED BENEFITS END DATE]") + ', Employee may elect to continue coverage at Employee\'s own expense under COBRA.</li>' : ''}
            ${formData.includeSeverance ? '<li><strong>Severance Payment</strong>: The Company will pay Employee a severance payment in the amount of ' + (formData.severanceAmount || "[AMOUNT]") + ', less applicable withholdings and deductions, to be paid ' + (formData.severancePaymentStructure === 'lump-sum' ? 'in a lump sum on [PAYMENT DATE]' : `in installments as follows: ${formData.installmentDetails || "[INSTALLMENT DETAILS]"}`) + '.</li>' : ''}
        </ol>
    </li>

    ${formData.includeGeneralRelease ? `
    <li>
        <strong>GENERAL RELEASE OF CLAIMS</strong>
        <ol type="a">
            <li>In exchange for the consideration provided in this Agreement, Employee hereby generally and completely releases the Company and its current and former directors, officers, employees, shareholders, partners, agents, attorneys, predecessors, successors, parent and subsidiary entities, insurers, affiliates, and assigns (collectively, the "Released Parties") from any and all claims, liabilities, demands, causes of action, and obligations, both known and unknown, that Employee may have or has ever had against the Released Parties, or any of them, arising out of or in any way related to events, acts, conduct, or omissions occurring prior to or on the date Employee signs this Agreement (collectively, the "Released Claims").</li>
            <li>The Released Claims include, but are not limited to:
                <ol type="i">
                    <li>All claims arising out of or in any way related to Employee's employment with the Company or the termination of that employment;</li>
                    <li>All claims related to Employee's compensation or benefits from the Company, including, but not limited to, salary, bonuses, commissions, vacation pay, paid time off, expense reimbursements, severance pay, fringe benefits, stock, stock options, or any other ownership interests in the Company;</li>
                    <li>All claims for breach of contract, wrongful termination, and breach of the implied covenant of good faith and fair dealing;</li>
                    <li>All tort claims, including, but not limited to, claims for fraud, defamation, emotional distress, and discharge in violation of public policy;</li>
                    <li>All federal, state, and local statutory claims, including, but not limited to, claims for discrimination, harassment, retaliation, attorneys' fees, or other claims arising under the federal Civil Rights Act of 1964 (as amended), the federal Americans with Disabilities Act of 1990, ${formData.includeADEARelease ? 'the federal Age Discrimination in Employment Act of 1967 (as amended) ("ADEA"), ' : ''}${formData.includeCaliforniaSpecific ? 'the California Fair Employment and Housing Act (as amended), the California Labor Code (as amended),' : ''} and all other laws and regulations relating to employment.</li>
                </ol>
            </li>
        </ol>
    </li>` : ''}

    ${formData.includeCaliforniaSpecific ? `
    <li>
        <strong>WAIVER OF UNKNOWN CLAIMS</strong>
        <p>Employee acknowledges that Employee has read and understands Section 1542 of the California Civil Code which reads as follows:</p>
        <p>"A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release and that, if known by him or her, would have materially affected his or her settlement with the debtor or released party."</p>
        <p>Employee hereby expressly waives and relinquishes all rights and benefits under that section and any law of any jurisdiction of similar effect with respect to Employee's release of any claims Employee may have against the Company.</p>
    </li>` : ''}

    <li>
        <strong>EXCEPTIONS TO RELEASE</strong>
        <p>Notwithstanding the foregoing, the following are not included in the Released Claims (the "Excluded Claims"):</p>
        <ol type="a">
            <li>Any rights or claims for indemnification Employee may have pursuant to any written indemnification agreement with the Company to which Employee is a party, the charter, bylaws, or operating agreements of the Company, or under applicable law;</li>
            <li>Any rights or claims which are not waivable as a matter of law;</li>
            <li>Any claims for breach of this Agreement.</li>
        </ol>
        <p>Employee hereby represents and warrants that, other than the Excluded Claims, Employee is not aware of any claims Employee has or might have against any of the Released Parties that are not included in the Released Claims.</p>
    </li>

    <li>
        <strong>NO PENDING OR FUTURE LAWSUITS</strong>
        <p>Employee represents that Employee has no lawsuits, claims, or actions pending in Employee's name, or on behalf of any other person or entity, against the Company or any of the other Released Parties. Employee also represents that Employee does not intend to bring any claims on Employee's own behalf or on behalf of any other person or entity against the Company or any of the other Released Parties.</p>
    </li>

    ${formData.includeNonDisparagement ? `
    <li>
        <strong>NON-DISPARAGEMENT</strong>
        <ol type="a">
            <li>Employee agrees to refrain from any disparagement, defamation, libel, or slander of any of the Released Parties, and agrees to refrain from any tortious interference with the contracts and relationships of any of the Released Parties.</li>
            <li>The Company agrees to instruct its officers and directors to refrain from any disparagement, defamation, libel, or slander of Employee, and to refrain from any tortious interference with the contracts and relationships of Employee.</li>
        </ol>
    </li>` : ''}

    ${formData.includeReturnOfProperty ? `
    <li>
        <strong>CONFIDENTIALITY AND RETURN OF COMPANY PROPERTY</strong>
        <ol type="a">
            <li>Employee agrees to maintain in complete confidence the existence of this Agreement, the contents and terms of this Agreement, and the consideration for this Agreement (collectively, the "Separation Information"). Employee may disclose the Separation Information only to Employee's immediate family members, legal and financial advisors, and as required by law.</li>
            <li>Employee affirms that Employee has returned all documents and other items provided to Employee by the Company, developed or obtained by Employee in connection with Employee's employment with the Company, or otherwise belonging to the Company (with the exception of a copy of the Employee Handbook and personnel documents specifically relating to Employee), including but not limited to, all passwords to any software or other programs or data that Employee used in performing services for the Company.</li>
        </ol>
    </li>` : ''}

    ${formData.includeConfidentiality ? `
    <li>
        <strong>CONFIDENTIALITY OBLIGATIONS</strong>
        <p>Employee acknowledges and reaffirms Employee's continuing obligations under any Confidentiality Agreement that Employee previously executed, including but not limited to, promises to protect all confidential and proprietary information of the Company and to refrain from soliciting the Company's employees or customers for a specified period.</p>
    </li>` : ''}

    ${formData.includeNonSolicitation ? `
    <li>
        <strong>NON-SOLICITATION</strong>
        <p>Employee agrees that for a period of ${formData.nonSolicitationPeriod} months after the Separation Date, Employee will not, either directly or indirectly, solicit, induce, recruit, or encourage any of the Company's employees to leave their employment, or attempt to do so, either for Employee or for any other person or entity.</p>
    </li>` : ''}

    ${formData.includeCooperation ? `
    <li>
        <strong>COOPERATION</strong>
        <p>Employee agrees to cooperate with the Company in responding to the legitimate business needs of the Company regarding any matters with which Employee was involved during Employee's employment, including but not limited to cooperating in the defense of any claims or potential claims that may be made against the Company in which Employee has relevant knowledge or information.</p>
    </li>` : ''}

    ${formData.includeNoAdmission ? `
    <li>
        <strong>NO ADMISSION OF LIABILITY</strong>
        <p>This Agreement constitutes a compromise and settlement of any and all potential disputed claims. No action taken by the Company hereto, either previously or in connection with this Agreement, shall be deemed or construed to be: (a) an admission of the truth or falsity of any potential claims; or (b) an acknowledgment or admission by the Company of any fault or liability whatsoever to Employee or to any third party.</p>
    </li>` : ''}

    <li>
        <strong>REPRESENTATIONS</strong>
        <p>Employee represents that Employee has consulted with an attorney, or has had sufficient opportunity to consult with an attorney of Employee's choosing, prior to signing this Agreement and that Employee is signing this Agreement knowingly, voluntarily, and with full understanding of its terms.</p>
    </li>

    ${formData.includeADEARelease ? `
    <li>
        <strong>REVIEW PERIOD</strong>
        <p>Employee acknowledges that Employee has been given ${formData.reviewPeriod} days to review this Agreement and that Employee understands that Employee may use as much or as little of this review period as Employee wishes prior to signing.</p>
    </li>

    <li>
        <strong>REVOCATION PERIOD</strong>
        <p>Employee understands that Employee has ${formData.revocationPeriod} days after signing this Agreement to revoke it by providing written notice to [COMPANY CONTACT] at [CONTACT INFORMATION]. This Agreement will not become effective and enforceable until the ${formData.revocationPeriod} day revocation period has expired.</p>
    </li>` : ''}

    <li>
        <strong>MISCELLANEOUS</strong>
        <ol type="a">
            ${formData.includeEntireAgreement ? `<li><strong>Entire Agreement</strong>: This Agreement, together with any Confidentiality Agreement, represents the entire agreement and understanding between the Company and Employee concerning the subject matter of this Agreement and Employee's employment with and separation from the Company and the events leading thereto and associated therewith, and supersedes and replaces any and all prior agreements and understandings concerning the subject matter of this Agreement and Employee's relationship with the Company.</li>` : ''}
            
            ${formData.includeGoverningLaw ? `<li><strong>Governing Law</strong>: This Agreement shall be governed by the laws of the State of ${formData.governingLaw}, without regard for choice-of-law provisions.</li>` : ''}
            
            <li><strong>Severability</strong>: If any provision of this Agreement is held to be invalid, void, or unenforceable, the remaining provisions shall remain in full force and effect to the fullest extent permitted by law.</li>
            
            ${formData.includeADEARelease ? `<li><strong>Effective Date</strong>: This Agreement will become effective on the eighth (8th) day after the Employee signs this Agreement, provided that Employee does not revoke the Agreement prior to that date (the "Effective Date").</li>` : ''}
            
            ${formData.includeCounterparts ? `<li><strong>Counterparts</strong>: This Agreement may be executed in counterparts and by facsimile, and each counterpart and facsimile shall have the same force and effect as an original and shall constitute an effective, binding agreement on the part of each of the undersigned.</li>` : ''}
            
            <li><strong>Voluntary Execution of Agreement</strong>: This Agreement is executed voluntarily and without any duress or undue influence on the part or behalf of the Parties hereto, with the full intent of releasing all claims. The Parties acknowledge that:
                <ol type="i">
                    <li>They have read this Agreement;</li>
                    <li>They have been represented in the preparation, negotiation, and execution of this Agreement by legal counsel of their own choice or have elected not to retain legal counsel;</li>
                    <li>They understand the terms and consequences of this Agreement and of the releases it contains;</li>
                    <li>They are fully aware of the legal and binding effect of this Agreement.</li>
                </ol>
            </li>
        </ol>
    </li>
</ol>

<div class="signature-block">
    <div class="signature-section">
        <p><strong>COMPANY: ${formData.companyName}</strong></p>
        <div class="signature-line"></div>
        <p>By: ${formData.companySignatory}</p>
        <p>Title: ${formData.companySignatoryTitle}</p>
        <p>Date: ___________________________</p>
    </div>
    <div class="signature-section">
        <p><strong>EMPLOYEE: ${formData.employeeName || "[EMPLOYEE NAME]"}</strong></p>
        <div class="signature-line"></div>
        <p>Date: ___________________________</p>
    </div>
</div>`;
    
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

  // Handle date changes for date pickers
  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setLastChanged(name);
  };

  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    // Map fields to sections in the document
    const fieldToSectionMap = {
      // Basic Information
      companyName: '.document-title, strong:contains("' + formData.companyName + '")',
      companyAddress: 'p:contains("' + formData.companyAddress + '")',
      employeeName: 'strong:contains("' + (formData.employeeName || "[EMPLOYEE NAME]") + '")',
      employeeAddress: 'p:contains("' + (formData.employeeAddress || "[EMPLOYEE ADDRESS]") + '")',
      employeeTitle: 'p:contains("' + (formData.employeeTitle || "[TITLE]") + '")',
      employeeStartDate: 'p:contains("' + (formData.employeeStartDate || "[START DATE]") + '")',
      
      // Separation Details
      separationDate: 'p:contains("' + (formData.separationDate || "[SEPARATION DATE]") + '")',
      voluntaryResignation: 'li:contains("VOLUNTARY RESIGNATION"), li:contains("SEPARATION OF EMPLOYMENT")',
      includeNonRehire: 'li:contains("Employee acknowledges that the Company has no obligation to employ")',
      
      // Compensation
      finalPayDate: 'li:contains("' + (formData.finalPayDate || "the Company's next regular payroll date") + '")',
      ptoHandling: 'li:contains("Accrued Paid Time Off")',
      ptoInstructions: 'li:contains("Accrued Paid Time Off")',
      includeAccruedPTO: 'li:contains("Accrued Paid Time Off")',
      benefitsEndDate: 'li:contains("' + (formData.benefitsEndDate || "[BENEFITS END DATE]") + '")',
      includeExtendedBenefits: 'li:contains("Extended Benefits")',
      extendedBenefitsEndDate: 'li:contains("' + (formData.extendedBenefitsEndDate || "[EXTENDED BENEFITS END DATE]") + '")',
      expenseReportDeadline: 'li:contains("' + formData.expenseReportDeadline + ' days")',
      includeSeverance: 'li:contains("Severance Payment")',
      severanceAmount: 'li:contains("' + (formData.severanceAmount || "[AMOUNT]") + '")',
      severancePaymentStructure: 'li:contains("to be paid")',
      installmentDetails: 'li:contains("' + (formData.installmentDetails || "[INSTALLMENT DETAILS]") + '")',
      
      // Release Terms
      includeGeneralRelease: 'li:contains("GENERAL RELEASE OF CLAIMS")',
      includeADEARelease: 'li:contains("Age Discrimination in Employment Act")',
      includeCaliforniaSpecific: 'li:contains("WAIVER OF UNKNOWN CLAIMS")',
      reviewPeriod: 'p:contains("' + formData.reviewPeriod + ' days to review")',
      revocationPeriod: 'p:contains("' + formData.revocationPeriod + ' days after signing")',
      
      // Post-Employment
      includeConfidentiality: 'li:contains("CONFIDENTIALITY OBLIGATIONS")',
      includeNonSolicitation: 'li:contains("NON-SOLICITATION")',
      nonSolicitationPeriod: 'p:contains("' + formData.nonSolicitationPeriod + ' months")',
      includeCooperation: 'li:contains("COOPERATION")',
      includeNonDisparagement: 'li:contains("NON-DISPARAGEMENT")',
      includeReturnOfProperty: 'li:contains("RETURN OF COMPANY PROPERTY")',
      
      // Miscellaneous
      includeNoAdmission: 'li:contains("NO ADMISSION OF LIABILITY")',
      includeGoverningLaw: 'li:contains("Governing Law")',
      governingLaw: 'li:contains("' + formData.governingLaw + '")',
      includeEntireAgreement: 'li:contains("Entire Agreement")',
      includeCounterparts: 'li:contains("Counterparts")',
      
      // Signature Block
      companySignatory: '.signature-section:contains("' + formData.companySignatory + '")',
      companySignatoryTitle: '.signature-section:contains("' + formData.companySignatoryTitle + '")'
    };
    
    return fieldToSectionMap[lastChanged] || null;
  };

  // Function to create a highlighted version of the document text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight || !lastChanged) return documentText;
    
    // Create a DOM parser to manipulate the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(documentText, 'text/html');
    
    try {
      // Try to find the element using querySelector-like syntax
      let selector = sectionToHighlight;
      let elements = [];
      
      if (selector.includes(':contains(')) {
        // Handle custom :contains() selector since it's not natively supported
        const containsMatch = selector.match(/:contains\("([^"]+)"\)/);
        if (containsMatch) {
          const textToFind = containsMatch[1];
          const baseSelector = selector.split(':contains')[0];
          
          // Try to find elements with the base selector
          const baseElements = baseSelector ? 
            Array.from(doc.querySelectorAll(baseSelector)) : 
            Array.from(doc.querySelectorAll('*'));
          
          // Filter elements containing the text
          elements = baseElements.filter(el => 
            el.textContent.includes(textToFind)
          );
        }
      } else {
        // Regular selector
        elements = Array.from(doc.querySelectorAll(selector));
      }
      
      // Highlight the found elements
      elements.forEach(el => {
        const wrapper = doc.createElement('span');
        wrapper.className = 'highlighted-text';
        
        // If the element has a parent, replace it with the wrapped version
        if (el.parentNode) {
          el.parentNode.insertBefore(wrapper, el);
          wrapper.appendChild(el);
        }
      });
      
      // If no elements were found, try a different approach
      if (elements.length === 0) {
        // Create a simple function to find text in the document
        const findAndHighlightText = (node, searchText) => {
          if (node.nodeType === 3) { // Text node
            const text = node.textContent;
            const index = text.indexOf(searchText);
            
            if (index >= 0) {
              // Split the text node and highlight the matching part
              const before = text.substring(0, index);
              const match = text.substring(index, index + searchText.length);
              const after = text.substring(index + searchText.length);
              
              const beforeNode = document.createTextNode(before);
              const matchNode = document.createElement('span');
              matchNode.className = 'highlighted-text';
              matchNode.textContent = match;
              const afterNode = document.createTextNode(after);
              
              const parentNode = node.parentNode;
              parentNode.insertBefore(beforeNode, node);
              parentNode.insertBefore(matchNode, node);
              parentNode.insertBefore(afterNode, node);
              parentNode.removeChild(node);
              
              return true;
            }
          } else if (node.nodeType === 1) { // Element node
            // Skip if this is already a highlight
            if (node.className === 'highlighted-text') return false;
            
            // Recursively search child nodes
            for (let i = 0; i < node.childNodes.length; i++) {
              if (findAndHighlightText(node.childNodes[i], searchText)) {
                return true;
              }
            }
          }
          
          return false;
        };
        
        // Try to find specific text based on the last changed field
        let searchText = '';
        switch (lastChanged) {
          case 'companyName':
            searchText = formData.companyName;
            break;
          case 'employeeName':
            searchText = formData.employeeName || "[EMPLOYEE NAME]";
            break;
          case 'employeeTitle':
            searchText = formData.employeeTitle || "[TITLE]";
            break;
          case 'employeeStartDate':
            searchText = formData.employeeStartDate || "[START DATE]";
            break;
          case 'separationDate':
            searchText = formData.separationDate || "[SEPARATION DATE]";
            break;
          // Add more cases as needed
          default:
            // For other fields, use the field name to find a section title
            searchText = lastChanged.charAt(0).toUpperCase() + lastChanged.slice(1).replace(/([A-Z])/g, ' $1');
            break;
        }
        
        if (searchText) {
          findAndHighlightText(doc.body, searchText);
        }
      }
      
      return doc.body.innerHTML;
    } catch (error) {
      console.error('Error highlighting text:', error);
      return documentText;
    }
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
      // Create a temporary div to hold the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = documentText;
      
      // Extract the text content
      const textContent = tempDiv.textContent || tempDiv.innerText;
      
      navigator.clipboard.writeText(textContent).then(() => {
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

  // Evaluate agreement for the Finalize tab
  const evaluateAgreement = () => {
    const issues = [];
    const warnings = [];
    const goodPractices = [];
    
    // Check for missing critical information
    if (!formData.employeeName) {
      issues.push({
        title: "Missing Employee Name",
        description: "The employee's name is required for a valid agreement.",
        fix: "Add the employee's name in the Basic Information tab."
      });
    }
    
    if (!formData.separationDate) {
      issues.push({
        title: "Missing Separation Date",
        description: "The separation date is required to establish when employment ends.",
        fix: "Add the separation date in the Separation Details tab."
      });
    }
    
    if (!formData.benefitsEndDate) {
      issues.push({
        title: "Missing Benefits End Date",
        description: "The benefits end date is required to establish when benefits terminate.",
        fix: "Add the benefits end date in the Compensation tab."
      });
    }
    
    // Check for potential issues or warnings
    if (formData.employeeAge === 'over40' && (Number(formData.reviewPeriod) < 21 || Number(formData.revocationPeriod) < 7)) {
      warnings.push({
        title: "Insufficient Review/Revocation Period",
        description: "For employees over 40, ADEA requires a 21-day review period and 7-day revocation period for a valid release of age claims.",
        fix: "Set the review period to at least 21 days and the revocation period to at least 7 days in the Release Terms tab."
      });
    }
    
    if (formData.includeExtendedBenefits && !formData.extendedBenefitsEndDate) {
      warnings.push({
        title: "Missing Extended Benefits End Date",
        description: "You've opted to include extended benefits but haven't specified an end date.",
        fix: "Add the extended benefits end date in the Compensation tab."
      });
    }
    
    if (formData.includeSeverance && !formData.severanceAmount) {
      warnings.push({
        title: "Missing Severance Amount",
        description: "You've opted to include a severance payment but haven't specified an amount.",
        fix: "Add the severance amount in the Compensation tab."
      });
    }
    
    if (formData.severancePaymentStructure === 'installments' && !formData.installmentDetails) {
      warnings.push({
        title: "Missing Installment Details",
        description: "You've opted for installment payments but haven't specified the installment schedule.",
        fix: "Add the installment details in the Compensation tab."
      });
    }
    
    // Good practices
    if (formData.includeGeneralRelease) {
      goodPractices.push({
        title: "Comprehensive Release",
        description: "You've included a comprehensive release of claims, which protects the company from potential lawsuits."
      });
    }
    
    if (formData.includeNonDisparagement) {
      goodPractices.push({
        title: "Non-Disparagement Clause",
        description: "The non-disparagement clause helps protect the company's reputation following the separation."
      });
    }
    
    if (formData.includeConfidentiality && formData.includeReturnOfProperty) {
      goodPractices.push({
        title: "Data Protection Measures",
        description: "You've included both confidentiality obligations and return of property provisions, which help protect company information and assets."
      });
    }
    
    // Add specific advice based on the conversation with Kevin
    if (formData.voluntaryResignation) {
      goodPractices.push({
        title: "Framed as Voluntary Resignation",
        description: "As discussed, framing the separation as a voluntary resignation helps the employee save face and can reduce the risk of claims."
      });
    }
    
    if (formData.includeExtendedBenefits) {
      goodPractices.push({
        title: "Extended Benefits Included",
        description: "Extending benefits through the end of the month provides a clean transition and can make the agreement more appealing to the employee."
      });
    }
    
    if (formData.ptoHandling === 'burndown') {
      goodPractices.push({
        title: "PTO Burn-Down Strategy",
        description: "Having the employee use their PTO before the separation date can be a cost-effective approach while still providing full benefits coverage during that period."
      });
    }
    
    return { issues, warnings, goodPractices };
  };

  // Help text for fields (based on conversation with Kevin)
  const getHelpText = (field) => {
    const helpTextMap = {
      employeeAge: "Knowing if the employee is over 40 is important for ADEA compliance. The Age Discrimination in Employment Act requires specific review and revocation periods.",
      
      voluntaryResignation: "Framing the separation as a voluntary resignation helps the employee save face and may reduce the risk of claims. As discussed with Kevin, this is often the preferred approach for performance-related separations.",
      
      ptoHandling: "You can either pay out unused PTO, have the employee use it before separation (burn-down), or a combination. The burn-down approach lets you pay the same amount while the employee remains covered by benefits during that period.",
      
      reviewPeriod: "For employees over 40, ADEA requires a 21-day review period for a valid release of age claims. For younger employees, a shorter period may be appropriate but still provides proof the agreement wasn't rushed.",
      
      revocationPeriod: "For employees over 40, ADEA requires a 7-day revocation period. For younger employees, a shorter period (3-5 days) is common. This cooling-off period helps show the release was voluntary.",
      
      includeExtendedBenefits: "As discussed with Kevin, extending benefits through the end of the month provides a clean transition. This can make the agreement more appealing to the employee without significant additional cost.",
      
      severancePaymentStructure: "Lump sum payments are simpler administratively. Installments can help ensure continued compliance and spread out the financial impact.",
      
      includeNonRehire: "This provision prevents the employee from seeking future employment with the company. Important for employees with performance or behavioral issues as mentioned in Kevin's case."
    };
    
    return helpTextMap[field] || null;
  };

  // Icon for help tooltips
  const HelpIcon = ({ text }) => (
    <span className="help-icon" title={text}>?</span>
  );

  // Date input component with calendar picker
  const DateInput = ({ name, value, onChange, placeholder }) => {
    return (
      <input
        type="date"
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="form-input date-input"
        placeholder={placeholder}
      />
    );
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
                <DateInput
                  name="employeeStartDate"
                  value={formData.employeeStartDate}
                  onChange={handleDateChange}
                  placeholder="January 1, 2022"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Employee Age Range: 
                  {getHelpText('employeeAge') && <HelpIcon text={getHelpText('employeeAge')} />}
                </label>
                <select
                  name="employeeAge"
                  value={formData.employeeAge}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="unknown">Unknown</option>
                  <option value="under40">Under 40</option>
                  <option value="over40">40 or Older</option>
                </select>
                {getHelpText('employeeAge') && (
                  <p className="help-text">{getHelpText('employeeAge')}</p>
                )}
              </div>
            </div>
            
            {/* Tab 2: Separation Details */}
            <div className={`tab-content ${currentTab === 1 ? 'active' : ''}`}>
              <h2>Separation Details</h2>
              <p>Define the terms of the employment separation.</p>
              
              <div className="form-group">
                <label className="form-label">Separation Date:</label>
                <DateInput
                  name="separationDate"
                  value={formData.separationDate}
                  onChange={handleDateChange}
                  placeholder="June 30, 2025"
                />
                <p className="help-text">
                  This is the date when employment officially ends. For the "June exit" strategy discussed with Kevin, select a date in early June.
                </p>
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
                  Frame as voluntary resignation {getHelpText('voluntaryResignation') && <HelpIcon text={getHelpText('voluntaryResignation')} />}
                </label>
                {getHelpText('voluntaryResignation') && (
                  <p className="help-text">{getHelpText('voluntaryResignation')}</p>
                )}
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
                  Include non-rehire provision {getHelpText('includeNonRehire') && <HelpIcon text={getHelpText('includeNonRehire')} />}
                </label>
                {getHelpText('includeNonRehire') && (
                  <p className="help-text">{getHelpText('includeNonRehire')}</p>
                )}
              </div>
              
              <div className="info-box">
                <strong>Note:</strong> As discussed with Kevin, framing the separation as a voluntary resignation is often preferred for performance-related separations. It helps the employee save face while still providing the company with the protection of a release of claims.
              </div>
            </div>
            
            {/* Tab 3: Compensation */}
            <div className={`tab-content ${currentTab === 2 ? 'active' : ''}`}>
              <h2>Compensation</h2>
              <p>Set the financial terms of the separation agreement.</p>
              
              <div className="form-group">
                <label className="form-label">Final Pay Date:</label>
                <DateInput
                  name="finalPayDate"
                  value={formData.finalPayDate}
                  onChange={handleDateChange}
                  placeholder="Leave blank for next regular payroll date"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  PTO Handling: {getHelpText('ptoHandling') && <HelpIcon text={getHelpText('ptoHandling')} />}
                </label>
                <select
                  name="ptoHandling"
                  value={formData.ptoHandling}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="payout">Pay out unused PTO</option>
                  <option value="burndown">Have employee use PTO before separation</option>
                  <option value="both">Custom approach (specify below)</option>
                </select>
                {getHelpText('ptoHandling') && (
                  <p className="help-text">{getHelpText('ptoHandling')}</p>
                )}
              </div>
              
              {formData.ptoHandling === 'both' && (
                <div className="form-group">
                  <label className="form-label">PTO Instructions:</label>
                  <textarea
                    name="ptoInstructions"
                    value={formData.ptoInstructions}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Example: Employee will use 3 days of PTO between May 25-28, and the remaining 2 days will be paid out on the final paycheck."
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Benefits End Date:</label>
                <DateInput
                  name="benefitsEndDate"
                  value={formData.benefitsEndDate}
                  onChange={handleDateChange}
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
                  Include extended benefits {getHelpText('includeExtendedBenefits') && <HelpIcon text={getHelpText('includeExtendedBenefits')} />}
                </label>
                {getHelpText('includeExtendedBenefits') && (
                  <p className="help-text">{getHelpText('includeExtendedBenefits')}</p>
                )}
              </div>
              
              {formData.includeExtendedBenefits && (
                <div className="form-group">
                  <label className="form-label">Extended Benefits End Date:</label>
                  <DateInput
                    name="extendedBenefitsEndDate"
                    value={formData.extendedBenefitsEndDate}
                    onChange={handleDateChange}
                    placeholder="July 31, 2025"
                  />
                  <p className="help-text">
                    Based on your discussion with Kevin, extending benefits through the end of June provides a clean transition.
                  </p>
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
                    <label className="form-label">
                      Payment Structure: {getHelpText('severancePaymentStructure') && <HelpIcon text={getHelpText('severancePaymentStructure')} />}
                    </label>
                    <select
                      name="severancePaymentStructure"
                      value={formData.severancePaymentStructure}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="lump-sum">Lump Sum</option>
                      <option value="installments">Installments</option>
                    </select>
                    {getHelpText('severancePaymentStructure') && (
                      <p className="help-text">{getHelpText('severancePaymentStructure')}</p>
                    )}
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
                    <label className="form-label">
                      Review Period (days): {getHelpText('reviewPeriod') && <HelpIcon text={getHelpText('reviewPeriod')} />}
                    </label>
                    <input
                      type="number"
                      name="reviewPeriod"
                      value={formData.reviewPeriod}
                      onChange={handleChange}
                      className="form-input"
                      min="7"
                      max="45"
                    />
                    {getHelpText('reviewPeriod') && (
                      <p className="help-text">{getHelpText('reviewPeriod')}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Revocation Period (days): {getHelpText('revocationPeriod') && <HelpIcon text={getHelpText('revocationPeriod')} />}
                    </label>
                    <input
                      type="number"
                      name="revocationPeriod"
                      value={formData.revocationPeriod}
                      onChange={handleChange}
                      className="form-input"
                      min="7"
                      max="14"
                    />
                    {getHelpText('revocationPeriod') && (
                      <p className="help-text">{getHelpText('revocationPeriod')}</p>
                    )}
                  </div>
                </>
              )}
              
              <div className="info-box">
                <strong>21-Day + 7-Day Period:</strong> As explained to Kevin, while the 21-day review and 7-day revocation periods may seem long, they are legally required for employees 40 or older under the Age Discrimination in Employment Act (ADEA). The employee's signature isn't enforceable without this time to consider the agreement. Importantly, these periods provide certainty that the waiver of claims is final before any severance or extended benefits are provided.
              </div>
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
                  Include non-solicitation provision {getHelpText('includeNonSolicitation') && <HelpIcon text={getHelpText('includeNonSolicitation')} />}
                </label>
                {getHelpText('includeNonSolicitation') && (
                  <p className="help-text">{getHelpText('includeNonSolicitation')}</p>
                )}
              </div>
              
              {formData.includeNonSolicitation && (
                <div className="form-group">
                  <label className="form-label">
                    Non-Solicitation Period (months): {getHelpText('nonSolicitationPeriod') && <HelpIcon text={getHelpText('nonSolicitationPeriod')} />}
                  </label>
                  <input
                    type="number"
                    name="nonSolicitationPeriod"
                    value={formData.nonSolicitationPeriod}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="24"
                  />
                  {getHelpText('nonSolicitationPeriod') && (
                    <p className="help-text">{getHelpText('nonSolicitationPeriod')}</p>
                  )}
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
            
            {/* Tab 7: Finalize */}
            <div className={`tab-content ${currentTab === 6 ? 'active' : ''}`}>
              <h2>Finalize Your Agreement</h2>
              <p>Review your agreement and address any issues before downloading.</p>
              
              {(() => {
                const { issues, warnings, goodPractices } = evaluateAgreement();
                
                return (
                  <>
                    {issues.length > 0 && (
                      <div className="evaluation-section">
                        <h3>Critical Issues</h3>
                        <div className="evaluation-cards">
                          {issues.map((issue, index) => (
                            <div className="evaluation-card red-card" key={index}>
                              <h4>{issue.title}</h4>
                              <p>{issue.description}</p>
                              <p><strong>Fix:</strong> {issue.fix}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {warnings.length > 0 && (
                      <div className="evaluation-section">
                        <h3>Potential Issues</h3>
                        <div className="evaluation-cards">
                          {warnings.map((warning, index) => (
                            <div className="evaluation-card yellow-card" key={index}>
                              <h4>{warning.title}</h4>
                              <p>{warning.description}</p>
                              {warning.fix && <p><strong>Suggestion:</strong> {warning.fix}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {goodPractices.length > 0 && (
                      <div className="evaluation-section">
                        <h3>Good Practices</h3>
                        <div className="evaluation-cards">
                          {goodPractices.map((practice, index) => (
                            <div className="evaluation-card green-card" key={index}>
                              <h4>{practice.title}</h4>
                              <p>{practice.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="evaluation-section">
                      <h3>Kevin's Situation: Recommended Approach</h3>
                      <div className="evaluation-card blue-card">
                        <h4>June-Exit Strategy with PTO Burn-Down</h4>
                        <p>Based on our previous conversations, the "June-exit separation agreement" approach appears to be the best strategy. This provides several advantages:</p>
                        <ul>
                          <li>Frames the departure as a voluntary resignation, helping the employee save face</li>
                          <li>Extends benefits through the end of June, providing a clean transition</li>
                          <li>Uses accumulated PTO to bridge part of the time between now and the separation date</li>
                          <li>Includes a comprehensive release of claims to protect the company</li>
                          <li>Presents a professional and fair arrangement that reduces the risk of claims</li>
                        </ul>
                        <p>This approach makes the most sense for a small company that can't absorb surprise litigation or a messy departure.</p>
                      </div>
                    </div>
                    
                    <div className="evaluation-section">
                      <h3>Next Steps</h3>
                      <ol>
                        <li>Address any critical issues identified above</li>
                        <li>Download the agreement as a Word document</li>
                        <li>Present the agreement to the employee with a cover note explaining the two paths:
                          <ul>
                            <li>Accept the agreement and resign effective on the specified date with continued benefits</li>
                            <li>Continue on the Performance Improvement Plan (PIP) with clear metrics (and understanding that failure = termination for cause)</li>
                          </ul>
                        </li>
                        <li>Allow the employee the specified review period (21 days if over 40, shorter if not)</li>
                        <li>Wait out the revocation period before processing any severance payments or extended benefits</li>
                      </ol>
                    </div>
                  </>
                );
              })()}
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
              <div 
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