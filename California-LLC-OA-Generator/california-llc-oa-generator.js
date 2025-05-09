// California LLC Operating Agreement Generator
// Created for terms.law

const { useState, useEffect, useRef } = React;

const CaliforniaLLCOperatingAgreementGenerator = () => {
  // State for the form data
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    formationDate: '',
    principalAddress: '',
    mailingAddress: '',
    countyLocation: '',
    
    // Business Details
    businessPurpose: 'engaging in any lawful business activity for which a Limited Liability Company may be formed under California law',
    fiscalYearEnd: 'December 31',
    terminationDate: '', // Empty means perpetual
    hasPerpetualDuration: true,
    
    // Management Structure
    managementType: 'member-managed', // or 'manager-managed'
    
    // Members Information
    members: [
      {
        name: '',
        address: '',
        contributionAmount: '',
        ownershipPercentage: '',
        taxId: '', // SSN or EIN
      }
    ],
    
    // Managers Information (if manager-managed)
    managers: [
      {
        name: '',
        address: '',
        isAlsoMember: true,
      }
    ],
    
    // Capital and Contributions
    additionalCapitalRequirements: 'majority', // 'majority', 'unanimous', or 'none'
    returningCapital: 'discretion', // 'discretion', 'proportional', or 'fixed-schedule'
    
    // Distributions
    distributionType: 'proportional', // 'proportional', 'custom'
    distributionSchedule: 'quarterly', // 'monthly', 'quarterly', 'annually'
    votingRequirement: 'majority', // 'majority', 'unanimous'
    
    // Transfer Restrictions
    transferRestrictions: 'right-first-refusal', // 'right-first-refusal', 'unanimous-approval', 'no-restrictions'
    buyoutValuationMethod: 'book-value', // 'book-value', 'appraisal', 'formula'
    
    // Dissolution
    dissolutionReasons: ['mutual-agreement', 'regulatory-dissolution'], // Multiple selections
    liquidationPreference: 'equal', // 'equal', 'prioritized'
    
    // Amendments
    amendmentRequirement: 'majority', // 'majority', 'supermajority', 'unanimous'
    
    // Dispute Resolution
    disputeResolution: 'mediation-then-arbitration', // 'litigation', 'arbitration', 'mediation-then-arbitration'
    lawGoverning: 'California',
    venueForDisputes: 'Los Angeles County',
  });
  
  // State for tracking tabs
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const previewRef = useRef(null);
  
  // Tabs configuration
  const tabs = [
    { id: 'company-info', label: 'Company Information' },
    { id: 'business-details', label: 'Business Details' },
    { id: 'member-info', label: 'Member Information' },
    { id: 'management-capital', label: 'Management & Capital' },
    { id: 'distributions-transfer', label: 'Distributions & Transfer' },
    { id: 'dissolution-amendments', label: 'Dissolution & Amendments' }
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
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Special handling for checkboxes
    if (type === 'checkbox') {
      if (name === 'hasPerpetualDuration') {
        setFormData(prev => ({
          ...prev,
          hasPerpetualDuration: checked,
          terminationDate: checked ? '' : prev.terminationDate
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } 
    // Handle select multiple for dissolution reasons
    else if (name === 'dissolutionReasons') {
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selected.push(options[i].value);
        }
      }
      setFormData(prev => ({
        ...prev,
        dissolutionReasons: selected
      }));
      setLastChanged('dissolutionReasons');
    }
    // Default case for most inputs
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle member form changes
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      members: updatedMembers
    }));
    
    setLastChanged(`members.${index}.${field}`);
  };
  
  // Add a new member
  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [
        ...prev.members,
        {
          name: '',
          address: '',
          contributionAmount: '',
          ownershipPercentage: '',
          taxId: '',
        }
      ]
    }));
  };
  
  // Remove a member
  const removeMember = (index) => {
    if (formData.members.length > 1) {
      const updatedMembers = [...formData.members];
      updatedMembers.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        members: updatedMembers
      }));
    }
  };
  
  // Handle manager form changes
  const handleManagerChange = (index, field, value) => {
    const updatedManagers = [...formData.managers];
    updatedManagers[index] = {
      ...updatedManagers[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      managers: updatedManagers
    }));
    
    setLastChanged(`managers.${index}.${field}`);
  };
  
  // Add a new manager
  const addManager = () => {
    setFormData(prev => ({
      ...prev,
      managers: [
        ...prev.managers,
        {
          name: '',
          address: '',
          isAlsoMember: true,
        }
      ]
    }));
  };
  
  // Remove a manager
  const removeManager = (index) => {
    if (formData.managers.length > 1) {
      const updatedManagers = [...formData.managers];
      updatedManagers.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        managers: updatedManagers
      }));
    }
  };
  
  // Generate the document text based on form data
  const generateDocumentText = () => {
    // Title block formatting
    const titleBlock = `OPERATING AGREEMENT
OF
${formData.companyName || '[COMPANY NAME]'}
A CALIFORNIA LIMITED LIABILITY COMPANY`;

    // Date and introduction
    const formationDate = formData.formationDate ? new Date(formData.formationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[FORMATION DATE]';
    
    const introduction = `This Operating Agreement (the "Agreement") of ${formData.companyName || '[COMPANY NAME]'} (the "Company") is made and entered into as of ${formationDate} by and among the Company and the persons executing this Agreement as Members.`;
    
    // Article I - Formation
    const articleFormation = `ARTICLE I
FORMATION

1.1 Formation. The Company was formed as a California limited liability company on ${formationDate} by filing Articles of Organization with the California Secretary of State pursuant to the California Revised Uniform Limited Liability Company Act (the "Act").

1.2 Name. The name of the Company is ${formData.companyName || '[COMPANY NAME]'}.

1.3 Principal Place of Business. The principal place of business of the Company shall be at ${formData.principalAddress || '[PRINCIPAL ADDRESS]'}, or such other place as the ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'} may determine from time to time.

1.4 Mailing Address. The mailing address of the Company shall be ${formData.mailingAddress || formData.principalAddress || '[MAILING ADDRESS]'}.

1.5 Registered Agent and Office. The Company's initial registered agent and registered office in California shall be as stated in the Articles of Organization. The ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'} may change the registered agent or registered office at any time.

1.6 Term. The term of the Company shall commence upon the filing of the Articles of Organization with the California Secretary of State and shall continue ${formData.hasPerpetualDuration ? 'perpetually' : `until ${formData.terminationDate || '[TERMINATION DATE]'}`} unless sooner terminated as provided in this Agreement.`;

    // Article II - Purpose and Powers
    const articlePurpose = `ARTICLE II
PURPOSE AND POWERS

2.1 Purpose. The Company is formed for the purpose of ${formData.businessPurpose} and for any other lawful purpose as determined by the ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'}.

2.2 Powers. The Company shall have all powers permitted to be exercised by a limited liability company organized under the Act.`;

    // Article III - Members and Capital Contributions
    let membersList = '';
    formData.members.forEach((member, index) => {
      if (member.name || index === 0) {
        membersList += `
    ${index + 1}. ${member.name || `[MEMBER ${index + 1} NAME]`}
       Address: ${member.address || `[MEMBER ${index + 1} ADDRESS]`}
       Initial Capital Contribution: $${member.contributionAmount || '0.00'}
       Ownership Percentage: ${member.ownershipPercentage || '0'}%
       Tax Identification Number: ${member.taxId || `[MEMBER ${index + 1} TAX ID]`}`;
      }
    });
    
    const articleMembers = `ARTICLE III
MEMBERS AND CAPITAL CONTRIBUTIONS

3.1 Initial Members and Capital Contributions. The initial Members of the Company and their respective Capital Contributions, Ownership Percentages, and addresses are as follows:${membersList}

3.2 Additional Capital Contributions. ${
      formData.additionalCapitalRequirements === 'none' 
        ? 'No Member shall be required to make any additional Capital Contributions to the Company.' 
        : formData.additionalCapitalRequirements === 'unanimous' 
          ? 'Additional Capital Contributions may be required of Members only upon the unanimous written consent of all Members.' 
          : 'Additional Capital Contributions may be required of Members upon the approval of Members holding a majority of the Ownership Percentages.'
    }

3.3 Return of Capital Contributions. ${
      formData.returningCapital === 'discretion' 
        ? 'Capital Contributions shall be returned to Members at the discretion of the ' + (formData.managementType === 'manager-managed' ? 'Managers' : 'Members') + '.' 
        : formData.returningCapital === 'proportional' 
          ? 'Capital Contributions shall be returned to Members proportionally based on their Ownership Percentages.' 
          : 'Capital Contributions shall be returned according to a fixed schedule as determined by the ' + (formData.managementType === 'manager-managed' ? 'Managers' : 'Members') + '.'
    }

3.4 No Interest on Capital Contributions. No Member shall be entitled to receive any interest on their Capital Contribution.

3.5 Loans. Any Member may, with approval of the ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'}, make a loan to the Company. Loans made by a Member shall not be considered Capital Contributions and shall not increase the lending Member's Ownership Percentage.`;

    // Article IV - Management
    let managementArticle = '';
    
    if (formData.managementType === 'member-managed') {
      managementArticle = `ARTICLE IV
MANAGEMENT

4.1 Management by Members. The Company shall be managed by the Members. The Members shall have the sole right to manage the Company and shall have all authority, rights, and powers conferred by law and those necessary, advisable, or consistent in connection with accomplishing the purpose of the Company.

4.2 Voting Rights of Members. Each Member shall be entitled to vote on all matters on which Members may vote in proportion to the Member's Ownership Percentage in the Company. Unless otherwise specified in this Agreement, all decisions, approvals, or actions requiring a vote, approval, or action of the Members shall require the approval of Members holding a majority of the Ownership Percentages.

4.3 Officers. The Members may appoint officers of the Company with such duties and responsibilities as determined by the Members.`;
    } else {
      // Manager-managed LLC
      let managersList = '';
      formData.managers.forEach((manager, index) => {
        if (manager.name || index === 0) {
          managersList += `
    ${index + 1}. ${manager.name || `[MANAGER ${index + 1} NAME]`}
       Address: ${manager.address || `[MANAGER ${index + 1} ADDRESS]`}
       ${manager.isAlsoMember ? 'This Manager is also a Member of the Company.' : 'This Manager is not a Member of the Company.'}`;
        }
      });
      
      managementArticle = `ARTICLE IV
MANAGEMENT

4.1 Management by Managers. The Company shall be managed by one or more Managers. The Managers shall have the sole right to manage the Company and shall have all authority, rights, and powers conferred by law and those necessary, advisable, or consistent in connection with accomplishing the purpose of the Company.

4.2 Initial Managers. The initial Managers of the Company are as follows:${managersList}

4.3 Term of Managers. Each Manager shall serve until the earlier of their death, incapacity, resignation, or removal.

4.4 Removal of Managers. Any Manager may be removed, with or without cause, by the vote of Members holding a majority of the Ownership Percentages.

4.5 Decisions of Managers. If there is more than one Manager, decisions shall be made by a majority of the Managers unless otherwise specified in this Agreement.

4.6 Authority of Managers. The Managers shall have full and complete authority, power, and discretion to manage and control the business of the Company, to make all decisions regarding those matters, and to perform any and all other acts or activities customary or incident to the management of the Company's business.

4.7 Officers. The Managers may appoint officers of the Company with such duties and responsibilities as determined by the Managers.`;
    }

    // Article V - Allocations and Distributions
    const articleDistributions = `ARTICLE V
ALLOCATIONS AND DISTRIBUTIONS

5.1 Fiscal Year. The Company's fiscal year shall end on ${formData.fiscalYearEnd || 'December 31'}.

5.2 Tax Classification. The Company shall be treated as a partnership for federal and California income tax purposes.

5.3 Allocations. Profits, losses, and other tax items shall be allocated to the Members in proportion to their Ownership Percentages.

5.4 Distributions. Distributions shall be made to Members ${
      formData.distributionType === 'proportional' 
        ? 'in proportion to their Ownership Percentages' 
        : 'as determined by the ' + (formData.managementType === 'manager-managed' ? 'Managers' : 'Members')
    } on a ${
      formData.distributionSchedule === 'monthly' 
        ? 'monthly' 
        : formData.distributionSchedule === 'quarterly' 
          ? 'quarterly' 
          : 'yearly'
    } basis, subject to maintaining reserves for Company operations and obligations. Distributions shall be made only when approved by ${
      formData.votingRequirement === 'unanimous' 
        ? 'unanimous consent of the Members' 
        : 'Members holding a majority of the Ownership Percentages'
    }.

5.5 California Tax Requirements. The Members acknowledge that the Company is subject to California tax requirements, including payment of the annual $800 minimum franchise tax.

5.6 Tax Withholding. If the Company is required to withhold taxes with respect to any distribution or allocation of income to a Member, the Company may withhold such taxes and make such payments to the tax authorities as required.`;

    // Article VI - Transfer Restrictions
    const articleTransfer = `ARTICLE VI
TRANSFERS OF MEMBERSHIP INTERESTS

6.1 Restriction on Transfers. No Member shall sell, assign, transfer, pledge, or otherwise dispose of all or any portion of their Membership Interest without ${
      formData.transferRestrictions === 'right-first-refusal' 
        ? 'first offering such interest to the other Members as provided in Section 6.2' 
        : formData.transferRestrictions === 'unanimous-approval' 
          ? 'the prior unanimous written consent of all other Members' 
          : 'complying with the provisions of this Agreement'
    }.

6.2 ${
      formData.transferRestrictions === 'right-first-refusal' 
        ? 'Right of First Refusal. If a Member receives a bona fide offer to purchase all or part of their Membership Interest and wishes to accept such offer, the Member shall first offer to sell such interest to the other Members on the same terms and conditions as the offer received. The other Members shall have 30 days to exercise this right of first refusal.' 
        : formData.transferRestrictions === 'unanimous-approval' 
          ? 'Transfer Procedure. A Member wishing to transfer all or any portion of their Membership Interest must first obtain the unanimous written consent of all other Members. Any transfer made without such consent shall be null and void.' 
          : 'Transfer Procedure. A Member may transfer all or any portion of their Membership Interest subject to compliance with applicable securities laws and this Agreement.'
    }

6.3 Involuntary Transfers. In the event of the death, disability, bankruptcy, or divorce of a Member that would cause an involuntary transfer of a Membership Interest, the Company and the remaining Members shall have the option to purchase such Membership Interest as provided in this Agreement.

6.4 Valuation of Membership Interest. For purposes of this Article VI, the value of a Membership Interest shall be determined using the ${
      formData.buyoutValuationMethod === 'book-value' 
        ? 'book value method, based on the Company\'s most recent balance sheet' 
        : formData.buyoutValuationMethod === 'appraisal' 
          ? 'appraisal method, with an independent appraiser selected by the Company' 
          : 'formula method, as determined by multiplying the Company\'s annual net profit by three and then multiplying by the Member\'s Ownership Percentage'
    }.`;

    // Article VII - Dissolution and Liquidation
    const dissolutionReasons = formData.dissolutionReasons.map(reason => {
      switch(reason) {
        case 'mutual-agreement':
          return 'The unanimous written agreement of all Members';
        case 'regulatory-dissolution':
          return 'Administrative dissolution by the California Secretary of State';
        case 'purpose-completion':
          return 'The completion of the Company\'s purpose';
        case 'illegality':
          return 'The Company\'s business becoming illegal under California or federal law';
        case 'member-dissociation':
          return 'The dissociation of any Member without the continued business of the Company';
        case 'court-order':
          return 'The entry of a decree of judicial dissolution under the Act';
        default:
          return reason;
      }
    }).join(';\n    (b) ');
    
    const articleDissolution = `ARTICLE VII
DISSOLUTION AND LIQUIDATION

7.1 Dissolution Events. The Company shall dissolve and its affairs shall be wound up upon the first to occur of the following:
    (a) ${dissolutionReasons};
    (c) The vote of Members holding at least 75% of the Ownership Percentages; or
    (d) The entry of a decree of judicial dissolution under the Act.

7.2 Liquidation. Upon dissolution, the Company shall cease carrying on its business and affairs and shall commence the winding up of the Company's business and affairs and complete the winding up as soon as practicable. Upon the winding up of the Company, the Company's assets shall be distributed as follows:
    (a) To creditors, including Members who are creditors, to the extent permitted by law, in satisfaction of the Company's liabilities;
    (b) To Members in satisfaction of unpaid distributions; and
    (c) To Members ${
      formData.liquidationPreference === 'equal' 
        ? 'in accordance with their Ownership Percentages' 
        : 'in accordance with a liquidation preference as determined by the ' + (formData.managementType === 'manager-managed' ? 'Managers' : 'Members')
    }.

7.3 Certificate of Dissolution. After the dissolution of the Company, the Company shall file a Certificate of Dissolution as required by the Act.

7.4 No Deficit Restoration Obligation. No Member shall have any obligation to restore any negative balance in their Capital Account upon liquidation of the Company.`;

    // Article VIII - Amendments
    const articleAmendments = `ARTICLE VIII
AMENDMENTS

8.1 Amendment of Operating Agreement. This Agreement may be amended by the approval of Members holding ${
      formData.amendmentRequirement === 'majority' 
        ? 'a majority' 
        : formData.amendmentRequirement === 'supermajority' 
          ? 'at least seventy-five percent (75%)' 
          : 'one hundred percent (100%)'
    } of the Ownership Percentages.

8.2 Amendment of Articles of Organization. The Articles of Organization may be amended by filing Articles of Amendment with the California Secretary of State as required by the Act. Such amendment shall require the approval of Members as set forth in Section 8.1.`;

    // Article IX - Miscellaneous
    const articleMiscellaneous = `ARTICLE IX
MISCELLANEOUS

9.1 Binding Effect. This Agreement shall be binding upon and inure to the benefit of the Members and their respective successors and permitted assigns.

9.2 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.lawGoverning || 'California'}.

9.3 Dispute Resolution. Any dispute arising out of or relating to this Agreement shall be resolved by ${
      formData.disputeResolution === 'litigation' 
        ? 'litigation in the courts of ' + (formData.venueForDisputes || 'Los Angeles County, California') 
        : formData.disputeResolution === 'arbitration' 
          ? 'binding arbitration in ' + (formData.venueForDisputes || 'Los Angeles County, California') + ' in accordance with the rules of the American Arbitration Association' 
          : 'mediation in ' + (formData.venueForDisputes || 'Los Angeles County, California') + ' and, if mediation is unsuccessful, by binding arbitration in accordance with the rules of the American Arbitration Association'
    }.

9.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced.

9.5 Entire Agreement. This Agreement constitutes the entire agreement among the Members with respect to the subject matter hereof and supersedes all prior agreements and understandings, whether written or oral, relating to such subject matter.

9.6 Counterparts. This Agreement may be executed in multiple counterparts, each of which shall be deemed an original and all of which together shall constitute one instrument.

9.7 Notices. All notices required or permitted under this Agreement shall be in writing and shall be deemed effectively given when personally delivered, when received by electronic means, or when deposited with a courier service.`;

    // Signature block
    const signatureBlock = `IN WITNESS WHEREOF, the undersigned have executed this Operating Agreement as of the date first written above.

MEMBERS:

${formData.members.map((member, index) => `${member.name || `[MEMBER ${index + 1} NAME]`}          Date: _________________

`).join('')}`;

    // Combine all sections
    return `${titleBlock}

${introduction}

${articleFormation}

${articlePurpose}

${articleMembers}

${managementArticle}

${articleDistributions}

${articleTransfer}

${articleDissolution}

${articleAmendments}

${articleMiscellaneous}

${signatureBlock}`;
  };
  
  // Create document text
  const documentText = generateDocumentText();
  
  // Function to determine which section to highlight based on last changed field
  const createHighlightedText = () => {
    if (!lastChanged) return documentText;
    
    const sectionPatterns = {
      // Company Info
      companyName: /(?<=OF\n).*(?=\nA CALIFORNIA)|(?<=The name of the Company is ).*?(?=\.)/g,
      formationDate: /(?<=formed as a California limited liability company on ).*?(?= by filing)/g,
      principalAddress: /(?<=principal place of business of the Company shall be at ).*?(?=, or such)/g,
      mailingAddress: /(?<=The mailing address of the Company shall be ).*?(?=\.)/g,
      
      // Business Details
      businessPurpose: /(?<=The Company is formed for the purpose of ).*?(?= and for any)/g,
      fiscalYearEnd: /(?<=The Company's fiscal year shall end on ).*?(?=\.)/g,
      terminationDate: /(?<=shall continue ).*?(?= unless)/g,
      
      // Member Information (special handling below)
      // For each member.X.Y field
      
      // Management structure
      managementType: formData.managementType === 'member-managed' 
        ? /ARTICLE IV\nMANAGEMENT\n\n4\.1 Management by Members.*?(?=4\.2)/s
        : /ARTICLE IV\nMANAGEMENT\n\n4\.1 Management by Managers.*?(?=4\.2)/s,
      
      // Distributions & Transfers
      distributionType: /(?<=5\.4 Distributions. Distributions shall be made to Members ).*?(?= on a)/g,
      distributionSchedule: /(?<= on a ).*?(?= basis)/g,
      votingRequirement: /(?<=Distributions shall be made only when approved by ).*?(?=\.)/g,
      transferRestrictions: /(?<=6\.1 Restriction on Transfers.*?)without.*?(?=\.)/gs,
      buyoutValuationMethod: /(?<=the value of a Membership Interest shall be determined using the ).*?(?=\.)/g,
      
      // Dissolution & Amendments
      dissolutionReasons: /(?<=7\.1 Dissolution Events.*?\(a\) ).*?(?=;)/gs,
      liquidationPreference: /(?<=\(c\) To Members ).*?(?=\.)/g,
      amendmentRequirement: /(?<=This Agreement may be amended by the approval of Members holding ).*?(?= of the Ownership)/g,
      disputeResolution: /(?<=Any dispute arising out of or relating to this Agreement shall be resolved by ).*?(?=\.)/g,
      lawGoverning: /(?<=This Agreement shall be governed by and construed in accordance with the laws of the State of ).*?(?=\.)/g,
      venueForDisputes: /(?<=by (litigation|arbitration|mediation) in ).*?(?= in accordance)/g,
    };
    
    // Special handling for member and manager fields
    if (lastChanged.startsWith('members.')) {
      const parts = lastChanged.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2];
      
      // Different regex based on which member field was changed
      let regex;
      const memberPattern = new RegExp(`${index + 1}\\. .*?(?=${index + 2}\\. |ARTICLE IV|\\})`, 's');
      const memberSection = memberPattern.exec(documentText);
      
      if (memberSection && memberSection[0]) {
        let memberText = memberSection[0];
        
        // Create regex for specific fields within the member section
        if (field === 'name') {
          regex = new RegExp(`${index + 1}\\. .*?(?=\\s+Address:)`, 's');
        } else if (field === 'address') {
          regex = /(?<=Address: ).*?(?=\n)/g;
        } else if (field === 'contributionAmount') {
          regex = /(?<=Initial Capital Contribution: \$).*?(?=\n)/g;
        } else if (field === 'ownershipPercentage') {
          regex = /(?<=Ownership Percentage: ).*?(?=%)/g;
        } else if (field === 'taxId') {
          regex = /(?<=Tax Identification Number: ).*?(?=\n|$)/g;
        }
        
        // Replace the highlighted section in the member text
        if (regex) {
          const highlightedMemberText = memberText.replace(regex, match => 
            `<span class="highlighted-text">${match}</span>`
          );
          
          // Replace the member section in the full document
          return documentText.replace(memberText, highlightedMemberText);
        }
      }
    }
    
    // Special handling for manager fields
    if (lastChanged.startsWith('managers.') && formData.managementType === 'manager-managed') {
      const parts = lastChanged.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2];
      
      // Different regex based on which manager field was changed
      let regex;
      const managerPattern = new RegExp(`${index + 1}\\. .*?(?=${index + 2}\\. |4\\.3|\\})`, 's');
      const managerSection = managerPattern.exec(documentText);
      
      if (managerSection && managerSection[0]) {
        let managerText = managerSection[0];
        
        // Create regex for specific fields within the manager section
        if (field === 'name') {
          regex = new RegExp(`${index + 1}\\. .*?(?=\\s+Address:)`, 's');
        } else if (field === 'address') {
          regex = /(?<=Address: ).*?(?=\n)/g;
        } else if (field === 'isAlsoMember') {
          regex = /This Manager is.*?(?=\n|$)/g;
        }
        
        // Replace the highlighted section in the manager text
        if (regex) {
          const highlightedManagerText = managerText.replace(regex, match => 
            `<span class="highlighted-text">${match}</span>`
          );
          
          // Replace the manager section in the full document
          return documentText.replace(managerText, highlightedManagerText);
        }
      }
    }
    
    // Use the appropriate regex pattern to highlight modified text
    const regex = sectionPatterns[lastChanged];
    if (regex) {
      return documentText.replace(regex, match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };
  
  // Create highlighted document text
  const highlightedText = createHighlightedText();
  
  // Scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);
  
  // Copy document to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText).then(() => {
        alert('Document copied to clipboard!');
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again.');
    }
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      window.generateWordDoc(documentText, {
        documentTitle: `${formData.companyName || 'Company'} Operating Agreement`,
        fileName: `${formData.companyName || 'Company'}-Operating-Agreement`
      });
    } catch (error) {
      console.error('Error in downloadAsWord:', error);
      alert('Error generating Word document. Please try again or use the copy option.');
    }
  };
  
  // Render company information tab
  const renderCompanyInfoTab = () => {
    return (
      <div className="form-tab">
        <h3>Company Information</h3>
        
        <div className="form-group">
          <label>
            Company Name*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The legal name of your LLC as registered with the California Secretary of State.</span>
            </div>
          </label>
          <input 
            type="text" 
            name="companyName" 
            value={formData.companyName} 
            onChange={handleChange} 
            placeholder="e.g., ABC Technologies, LLC"
          />
        </div>
        
        <div className="form-group">
          <label>
            Formation Date*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The date your LLC's Articles of Organization were filed with the California Secretary of State.</span>
            </div>
          </label>
          <input 
            type="date" 
            name="formationDate" 
            value={formData.formationDate} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>
            Principal Business Address*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The main address where your LLC conducts business.</span>
            </div>
          </label>
          <input 
            type="text" 
            name="principalAddress" 
            value={formData.principalAddress} 
            onChange={handleChange} 
            placeholder="e.g., 123 Main Street, Los Angeles, CA 90001"
          />
        </div>
        
        <div className="form-group">
          <label>
            Mailing Address
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The address where the LLC receives mail, if different from the principal business address.</span>
            </div>
          </label>
          <input 
            type="text" 
            name="mailingAddress" 
            value={formData.mailingAddress} 
            onChange={handleChange} 
            placeholder="If different from principal address"
          />
        </div>
        
        <div className="form-group">
          <label>
            County Location
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The California county where your LLC primarily operates.</span>
            </div>
          </label>
          <input 
            type="text" 
            name="countyLocation" 
            value={formData.countyLocation} 
            onChange={handleChange} 
            placeholder="e.g., Los Angeles County"
          />
        </div>
        
        <div className="info-box">
          <strong>California LLC Information:</strong> Your LLC must maintain a valid Statement of Information (Form LLC-12) with the California Secretary of State, filed initially within 90 days of formation and then every two years.
        </div>
      </div>
    );
  };
  
  // Render business details tab
  const renderBusinessDetailsTab = () => {
    return (
      <div className="form-tab">
        <h3>Business Details</h3>
        
        <div className="form-group">
          <label>
            Business Purpose
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Describe the primary activities of your LLC. You can use the general purpose provided or be more specific.</span>
            </div>
          </label>
          <textarea 
            name="businessPurpose" 
            value={formData.businessPurpose} 
            onChange={handleChange} 
            placeholder="e.g., engaging in any lawful business activity for which a Limited Liability Company may be formed under California law"
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>
            Fiscal Year End
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The end date of your LLC's fiscal year. Most LLCs use December 31 (calendar year).</span>
            </div>
          </label>
          <input 
            type="text" 
            name="fiscalYearEnd" 
            value={formData.fiscalYearEnd} 
            onChange={handleChange} 
            placeholder="e.g., December 31"
          />
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="hasPerpetualDuration" 
              checked={formData.hasPerpetualDuration} 
              onChange={handleChange}
            />
            <span>Perpetual Duration</span>
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">If checked, the LLC will exist indefinitely. If unchecked, specify an end date below.</span>
            </div>
          </label>
        </div>
        
        {!formData.hasPerpetualDuration && (
          <div className="form-group">
            <label>Termination Date</label>
            <input 
              type="date" 
              name="terminationDate" 
              value={formData.terminationDate} 
              onChange={handleChange}
            />
          </div>
        )}
        
        <div className="form-group">
          <label>
            Management Structure*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Member-managed: All members participate in running the business. Manager-managed: Designated managers (who may or may not be members) run the business.</span>
            </div>
          </label>
          <select 
            name="managementType" 
            value={formData.managementType} 
            onChange={handleChange}
          >
            <option value="member-managed">Member-Managed</option>
            <option value="manager-managed">Manager-Managed</option>
          </select>
        </div>
        
        <div className="warning-box">
          <strong>California Tax Notice:</strong> California LLCs are subject to an annual $800 minimum franchise tax, regardless of income or activity, due by the 15th day of the 4th month after the tax year begins.
        </div>
      </div>
    );
  };
  
  // Render member information tab
  const renderMemberInfoTab = () => {
    return (
      <div className="form-tab">
        <h3>Member Information</h3>
        <p className="tab-description">Add information about each member of the LLC. Every LLC must have at least one member.</p>
        
        {formData.members.map((member, index) => (
          <div key={index} className="member-card">
            <h4>Member {index + 1}</h4>
            
            <div className="form-group">
              <label>Full Name*</label>
              <input 
                type="text" 
                value={member.name} 
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)} 
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div className="form-group">
              <label>Address*</label>
              <input 
                type="text" 
                value={member.address} 
                onChange={(e) => handleMemberChange(index, 'address', e.target.value)} 
                placeholder="e.g., 123 Main St, Los Angeles, CA 90001"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Initial Capital Contribution ($)*
                  <div className="tooltip">
                    <i data-feather="info" className="info-icon"></i>
                    <span className="tooltiptext">The initial money or property value the member contributes to the LLC.</span>
                  </div>
                </label>
                <input 
                  type="text" 
                  value={member.contributionAmount} 
                  onChange={(e) => handleMemberChange(index, 'contributionAmount', e.target.value)} 
                  placeholder="e.g., 10000"
                />
              </div>
              
              <div className="form-group">
                <label>
                  Ownership Percentage (%)*
                  <div className="tooltip">
                    <i data-feather="info" className="info-icon"></i>
                    <span className="tooltiptext">The member's percentage ownership in the LLC. All members' percentages should total 100%.</span>
                  </div>
                </label>
                <input 
                  type="text" 
                  value={member.ownershipPercentage} 
                  onChange={(e) => handleMemberChange(index, 'ownershipPercentage', e.target.value)} 
                  placeholder="e.g., 50"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>
                Tax ID Number (SSN or EIN)
                <div className="tooltip">
                  <i data-feather="info" className="info-icon"></i>
                  <span className="tooltiptext">For individuals: Social Security Number. For entities: Employer Identification Number.</span>
                </div>
              </label>
              <input 
                type="text" 
                value={member.taxId} 
                onChange={(e) => handleMemberChange(index, 'taxId', e.target.value)} 
                placeholder="e.g., XXX-XX-XXXX or XX-XXXXXXX"
              />
            </div>
            
            {formData.members.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeMember(index)}
              >
                <i data-feather="trash-2"></i> Remove Member
              </button>
            )}
          </div>
        ))}
        
        <button 
          type="button" 
          className="add-button" 
          onClick={addMember}
        >
          <i data-feather="plus-circle"></i> Add Member
        </button>
        
        <div className="info-box">
          <strong>Note:</strong> Ensure that all members' ownership percentages total 100%. Capital contributions and ownership percentages don't have to be proportional.
        </div>
      </div>
    );
  };
  
  // Render manager information for manager-managed LLCs
  const renderManagerSection = () => {
    if (formData.managementType !== 'manager-managed') return null;
    
    return (
      <>
        <h4>Manager Information</h4>
        <p className="tab-description">Add information about each manager of the LLC.</p>
        
        {formData.managers.map((manager, index) => (
          <div key={index} className="member-card">
            <h4>Manager {index + 1}</h4>
            
            <div className="form-group">
              <label>Full Name*</label>
              <input 
                type="text" 
                value={manager.name} 
                onChange={(e) => handleManagerChange(index, 'name', e.target.value)} 
                placeholder="e.g., Jane Smith"
              />
            </div>
            
            <div className="form-group">
              <label>Address*</label>
              <input 
                type="text" 
                value={manager.address} 
                onChange={(e) => handleManagerChange(index, 'address', e.target.value)} 
                placeholder="e.g., 123 Main St, Los Angeles, CA 90001"
              />
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={manager.isAlsoMember} 
                  onChange={(e) => handleManagerChange(index, 'isAlsoMember', e.target.checked)}
                />
                <span>This manager is also a member of the LLC</span>
              </label>
            </div>
            
            {formData.managers.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeManager(index)}
              >
                <i data-feather="trash-2"></i> Remove Manager
              </button>
            )}
          </div>
        ))}
        
        <button 
          type="button" 
          className="add-button" 
          onClick={addManager}
        >
          <i data-feather="plus-circle"></i> Add Manager
        </button>
      </>
    );
  };
  
  // Render management and capital tab
  const renderManagementCapitalTab = () => {
    return (
      <div className="form-tab">
        <h3>Management & Capital</h3>
        
        {renderManagerSection()}
        
        <h4>Capital Requirements</h4>
        
        <div className="form-group">
          <label>
            Additional Capital Requirements
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Determines how decisions about requiring additional capital contributions are made.</span>
            </div>
          </label>
          <select 
            name="additionalCapitalRequirements" 
            value={formData.additionalCapitalRequirements} 
            onChange={handleChange}
          >
            <option value="none">No Additional Capital Required</option>
            <option value="majority">Majority Approval Required</option>
            <option value="unanimous">Unanimous Approval Required</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            Return of Capital Contributions
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Determines how capital contributions will be returned to members.</span>
            </div>
          </label>
          <select 
            name="returningCapital" 
            value={formData.returningCapital} 
            onChange={handleChange}
          >
            <option value="discretion">At Management's Discretion</option>
            <option value="proportional">Proportional to Ownership</option>
            <option value="fixed-schedule">According to Fixed Schedule</option>
          </select>
        </div>
        
        <div className="warning-box">
          <strong>Important:</strong> Under California law, distributions may not be made if they would render the LLC unable to pay its debts as they come due in the ordinary course of business.
        </div>
      </div>
    );
  };
  
  // Render distributions and transfer tab
  const renderDistributionsTransferTab = () => {
    return (
      <div className="form-tab">
        <h3>Distributions & Transfer</h3>
        
        <h4>Profit Distributions</h4>
        
        <div className="form-group">
          <label>
            Distribution Method
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">How profits will be distributed among members.</span>
            </div>
          </label>
          <select 
            name="distributionType" 
            value={formData.distributionType} 
            onChange={handleChange}
          >
            <option value="proportional">Proportional to Ownership</option>
            <option value="custom">Custom Distribution Method</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            Distribution Schedule
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">How often profit distributions will be made.</span>
            </div>
          </label>
          <select 
            name="distributionSchedule" 
            value={formData.distributionSchedule} 
            onChange={handleChange}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            Distribution Approval
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Required approval level for making distributions.</span>
            </div>
          </label>
          <select 
            name="votingRequirement" 
            value={formData.votingRequirement} 
            onChange={handleChange}
          >
            <option value="majority">Majority Vote</option>
            <option value="unanimous">Unanimous Vote</option>
          </select>
        </div>
        
        <h4>Membership Interest Transfers</h4>
        
        <div className="form-group">
          <label>
            Transfer Restrictions
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Limitations on members' ability to transfer their ownership interests.</span>
            </div>
          </label>
          <select 
            name="transferRestrictions" 
            value={formData.transferRestrictions} 
            onChange={handleChange}
          >
            <option value="right-first-refusal">Right of First Refusal</option>
            <option value="unanimous-approval">Unanimous Approval Required</option>
            <option value="no-restrictions">No Specific Restrictions</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            Membership Interest Valuation Method
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Method used to determine the value of a membership interest for transfers, buyouts, etc.</span>
            </div>
          </label>
          <select 
            name="buyoutValuationMethod" 
            value={formData.buyoutValuationMethod} 
            onChange={handleChange}
          >
            <option value="book-value">Book Value</option>
            <option value="appraisal">Independent Appraisal</option>
            <option value="formula">Formula Method (3x Annual Profits)</option>
          </select>
        </div>
        
        <div className="info-box">
          <strong>California Transfer Tax Note:</strong> While California doesn't have a specific LLC interest transfer tax, transfers might trigger reassessment of property tax if the LLC owns real estate and certain ownership percentage thresholds are crossed.
        </div>
      </div>
    );
  };
  
  // Render dissolution and amendments tab
  const renderDissolutionAmendmentsTab = () => {
    return (
      <div className="form-tab">
        <h3>Dissolution & Amendments</h3>
        
        <h4>Dissolution</h4>
        
        <div className="form-group">
          <label>
            Dissolution Events
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Events that trigger dissolution of the LLC. Hold Ctrl/Cmd to select multiple options.</span>
            </div>
          </label>
          <select 
            name="dissolutionReasons" 
            value={formData.dissolutionReasons} 
            onChange={handleChange}
            multiple
            size="5"
          >
            <option value="mutual-agreement">Mutual Agreement of All Members</option>
            <option value="regulatory-dissolution">Administrative Dissolution</option>
            <option value="purpose-completion">Completion of Company Purpose</option>
            <option value="illegality">Business Becomes Illegal</option>
            <option value="member-dissociation">Dissociation of a Member</option>
            <option value="court-order">Court Order</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            Liquidation Preference
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">How remaining assets will be distributed to members upon dissolution.</span>
            </div>
          </label>
          <select 
            name="liquidationPreference" 
            value={formData.liquidationPreference} 
            onChange={handleChange}
          >
            <option value="equal">Equal to Ownership Percentages</option>
            <option value="prioritized">Prioritized Distribution</option>
          </select>
        </div>
        
        <h4>Amendments & Dispute Resolution</h4>
        
        <div className="form-group">
          <label>
            Amendment Requirements
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Approval level required to amend the Operating Agreement.</span>
            </div>
          </label>
          <select 
            name="amendmentRequirement" 
            value={formData.amendmentRequirement} 
            onChange={handleChange}
          >
            <option value="majority">Majority Vote (>50%)</option>
            <option value="supermajority">Supermajority Vote (≥75%)</option>
            <option value="unanimous">Unanimous Vote (100%)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            Dispute Resolution Method
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Method for resolving disputes between members or with the LLC.</span>
            </div>
          </label>
          <select 
            name="disputeResolution" 
            value={formData.disputeResolution} 
            onChange={handleChange}
          >
            <option value="litigation">Litigation (Court)</option>
            <option value="arbitration">Binding Arbitration</option>
            <option value="mediation-then-arbitration">Mediation, then Arbitration</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Governing Law</label>
          <input 
            type="text" 
            name="lawGoverning" 
            value={formData.lawGoverning} 
            onChange={handleChange} 
            placeholder="e.g., California"
          />
        </div>
        
        <div className="form-group">
          <label>Venue for Disputes</label>
          <input 
            type="text" 
            name="venueForDisputes" 
            value={formData.venueForDisputes} 
            onChange={handleChange} 
            placeholder="e.g., Los Angeles County, California"
          />
        </div>
        
        <div className="warning-box">
          <strong>California Dissolution Requirements:</strong> When dissolving an LLC in California, you must file a Certificate of Dissolution (Form LLC-3) and a Certificate of Cancellation (Form LLC-4/7) with the Secretary of State. You must also satisfy all tax obligations with the Franchise Tax Board.
        </div>
      </div>
    );
  };
  
  // Render the current tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderCompanyInfoTab();
      case 1:
        return renderBusinessDetailsTab();
      case 2:
        return renderMemberInfoTab();
      case 3:
        return renderManagementCapitalTab();
      case 4:
        return renderDistributionsTransferTab();
      case 5:
        return renderDissolutionAmendmentsTab();
      default:
        return null;
    }
  };
  
  // Main render function
  return (
    <div className="generator-container">
      <div className="generator-header">
        <h2>California LLC Operating Agreement Generator</h2>
        <p>Create a customized Operating Agreement for your California Limited Liability Company</p>
      </div>
      
      <div className="generator-content">
        <div className="form-panel">
          <div className="tab-navigation">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`tab-button ${currentTab === index ? 'active' : ''}`}
                onClick={() => goToTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="tab-content">
            {renderTabContent()}
          </div>
          
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <i data-feather="chevron-left"></i> Previous
            </button>
            
            <div style={{display: "flex", gap: "0.5rem", flex: "1", justifyContent: "center"}}>
              <button
                onClick={copyToClipboard}
                className="nav-button"
                style={{
                  backgroundColor: "#4f46e5", 
                  color: "white",
                  border: "none"
                }}
              >
                <i data-feather="copy"></i> Copy
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
                <i data-feather="file-text"></i> Download Word
              </button>
            </div>
            
            <button
              onClick={nextTab}
              className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'completed' : ''}`}
              disabled={currentTab === tabs.length - 1}
            >
              Next <i data-feather="chevron-right"></i>
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
      
      <div className="generator-footer">
        <p>Need legal advice? <a href="https://terms.law/call/" target="_blank">Schedule a consultation</a> with a California business attorney.</p>
        <p><small>Disclaimer: This document generator is provided for informational purposes only and does not constitute legal advice. For complex legal matters, please consult with an attorney.</small></p>
      </div>
    </div>
  );
};

// Mount the app
ReactDOM.render(
  <CaliforniaLLCOperatingAgreementGenerator />,
  document.getElementById('root')
);

// Initialize Feather icons after render
document.addEventListener('DOMContentLoaded', () => {
  feather.replace();
});
