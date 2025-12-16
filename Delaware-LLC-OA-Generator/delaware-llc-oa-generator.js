// Delaware LLC Operating Agreement Generator
// Created for terms.law - Delaware-specific provisions under 6 Del. C. § 18-101 et seq.

const { useState, useEffect, useRef } = React;

const DelawareLLCOperatingAgreementGenerator = () => {
  // State for the form data
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    formationDate: '',
    principalAddress: '',
    registeredAgent: '',
    registeredAgentAddress: '',

    // Business Details
    businessPurpose: 'engaging in any lawful business activity for which a Limited Liability Company may be formed under Delaware law',
    fiscalYearEnd: 'December 31',
    hasPerpetualDuration: true,
    terminationDate: '',

    // Management Structure
    managementType: 'member-managed', // or 'manager-managed'

    // Members Information
    members: [
      {
        name: '',
        address: '',
        contributionAmount: '',
        ownershipPercentage: '100',
      }
    ],

    // Managers Information (if manager-managed)
    managers: [
      {
        name: '',
        address: '',
        isAlsoMember: true,
        memberId: -1,
      }
    ],

    // Delaware-Specific Options
    isSeriesLLC: false,
    seriesName: '',

    // Capital and Contributions
    additionalCapitalRequirements: 'majority',
    returningCapital: 'discretion',

    // Distributions
    distributionType: 'proportional',
    distributionSchedule: 'quarterly',
    votingRequirement: 'majority',

    // Transfer Restrictions
    transferRestrictions: 'right-first-refusal',
    buyoutValuationMethod: 'book-value',

    // Dissolution
    dissolutionReasons: ['mutual-agreement', 'judicial-dissolution'],
    liquidationPreference: 'equal',

    // Amendments
    amendmentRequirement: 'majority',

    // Dispute Resolution
    disputeResolution: 'chancery-court',
    lawGoverning: 'Delaware',
  });

  // State for tracking tabs
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const previewRef = useRef(null);

  // Tabs configuration
  const tabs = [
    { id: 'company-info', label: 'Company Info' },
    { id: 'member-info', label: 'Members' },
    { id: 'business-details', label: 'Business Details' },
    { id: 'management-capital', label: 'Management' },
    { id: 'distributions-transfer', label: 'Distributions' },
    { id: 'dissolution-amendments', label: 'Dissolution' }
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
    setLastChanged(name);

    if (type === 'checkbox') {
      if (name === 'hasPerpetualDuration') {
        setFormData(prev => ({
          ...prev,
          hasPerpetualDuration: checked,
          terminationDate: checked ? '' : prev.terminationDate
        }));
      } else if (name === 'isSeriesLLC') {
        setFormData(prev => ({
          ...prev,
          isSeriesLLC: checked,
          seriesName: checked ? prev.seriesName : ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    }
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
    }
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

    // Auto-adjust ownership percentages
    if (field === 'ownershipPercentage' && updatedMembers.length > 1) {
      const newPercentage = parseFloat(value) || 0;
      const otherMembersTotal = updatedMembers.reduce((total, member, i) => {
        if (i !== index) {
          return total + (parseFloat(member.ownershipPercentage) || 0);
        }
        return total;
      }, 0);

      if (otherMembersTotal > 0) {
        const adjustment = (100 - newPercentage) / otherMembersTotal;
        updatedMembers.forEach((member, i) => {
          if (i !== index) {
            const currentPercentage = parseFloat(member.ownershipPercentage) || 0;
            member.ownershipPercentage = (currentPercentage * adjustment).toFixed(2).replace(/\.?0+$/, '');
          }
        });
      }
    }

    setFormData(prev => ({
      ...prev,
      members: updatedMembers
    }));
    setLastChanged(`members.${index}.${field}`);
  };

  // Add a new member
  const addMember = () => {
    const currentMembers = [...formData.members];
    const newTotalMembers = currentMembers.length + 1;
    const equalPercentage = (100 / newTotalMembers).toFixed(2).replace(/\.?0+$/, '');

    currentMembers.forEach(member => {
      member.ownershipPercentage = equalPercentage;
    });

    setFormData(prev => ({
      ...prev,
      members: [
        ...currentMembers,
        {
          name: '',
          address: '',
          contributionAmount: '',
          ownershipPercentage: equalPercentage,
        }
      ]
    }));
  };

  // Remove a member
  const removeMember = (index) => {
    if (formData.members.length > 1) {
      const updatedMembers = [...formData.members];
      const removedPercentage = parseFloat(updatedMembers[index].ownershipPercentage) || 0;
      updatedMembers.splice(index, 1);

      if (removedPercentage > 0) {
        const addPercentage = removedPercentage / updatedMembers.length;
        updatedMembers.forEach(member => {
          const currentPercentage = parseFloat(member.ownershipPercentage) || 0;
          member.ownershipPercentage = (currentPercentage + addPercentage).toFixed(2).replace(/\.?0+$/, '');
        });
      }

      // Update manager references
      const updatedManagers = [...formData.managers];
      updatedManagers.forEach(manager => {
        if (manager.memberId === index) {
          manager.memberId = -1;
          manager.name = '';
          manager.address = '';
          manager.isAlsoMember = false;
        } else if (manager.memberId > index) {
          manager.memberId -= 1;
        }
      });

      setFormData(prev => ({
        ...prev,
        members: updatedMembers,
        managers: updatedManagers
      }));
    }
  };

  // Handle manager form changes
  const handleManagerChange = (index, field, value) => {
    const updatedManagers = [...formData.managers];

    if (field === 'memberId') {
      const memberId = parseInt(value);
      if (memberId >= 0) {
        const selectedMember = formData.members[memberId];
        updatedManagers[index] = {
          ...updatedManagers[index],
          memberId: memberId,
          name: selectedMember.name,
          address: selectedMember.address,
          isAlsoMember: true
        };
      } else {
        updatedManagers[index] = {
          ...updatedManagers[index],
          memberId: -1,
          name: '',
          address: '',
          isAlsoMember: false
        };
      }
    } else {
      updatedManagers[index] = {
        ...updatedManagers[index],
        [field]: value
      };
    }

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
          memberId: -1,
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
    const formationDate = formData.formationDate
      ? new Date(formData.formationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '[FORMATION DATE]';

    const isSingleMember = formData.members.length === 1;

    // Title block
    const titleBlock = `OPERATING AGREEMENT
OF
${formData.companyName || '[COMPANY NAME]'}
A DELAWARE LIMITED LIABILITY COMPANY`;

    // Introduction
    const introduction = `This Operating Agreement (the "Agreement") of ${formData.companyName || '[COMPANY NAME]'} (the "Company") is made and entered into as of ${formationDate} by and among the Company and the persons executing this Agreement as Members.

RECITALS

WHEREAS, the Company was formed as a Delaware limited liability company pursuant to the Delaware Limited Liability Company Act, 6 Del. C. § 18-101 et seq. (the "Act"); and

WHEREAS, the Members desire to enter into this Agreement to set forth the rights, powers, duties, and obligations of the Members and the management and operation of the Company.

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the Members agree as follows:`;

    // Article I - Formation
    let articleFormation = `ARTICLE I
FORMATION AND ORGANIZATION

1.1 Formation. The Company was formed as a Delaware limited liability company on ${formationDate} by filing a Certificate of Formation with the Delaware Secretary of State pursuant to the Act.

1.2 Name. The name of the Company is "${formData.companyName || '[COMPANY NAME]'}".

1.3 Principal Place of Business. The principal place of business of the Company shall be at ${formData.principalAddress || '[PRINCIPAL ADDRESS]'}, or such other place as the ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'} may determine from time to time.

1.4 Registered Agent and Office. The Company's registered agent in Delaware is ${formData.registeredAgent || '[REGISTERED AGENT NAME]'}, located at ${formData.registeredAgentAddress || '[REGISTERED AGENT ADDRESS]'}. The ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'} may change the registered agent or registered office at any time by filing appropriate documents with the Delaware Secretary of State.

1.5 Term. The term of the Company shall commence upon the filing of the Certificate of Formation with the Delaware Secretary of State and shall continue ${formData.hasPerpetualDuration ? 'perpetually' : `until ${formData.terminationDate || '[TERMINATION DATE]'}`} unless sooner terminated as provided in this Agreement or by operation of law.`;

    // Series LLC provision
    if (formData.isSeriesLLC) {
      articleFormation += `

1.6 Series LLC. The Company is organized as a Series Limited Liability Company pursuant to 6 Del. C. § 18-215. The Company may establish one or more series of membership interests${formData.seriesName ? `, including the series known as "${formData.seriesName}"` : ''}. Each series shall have separate rights, powers, or duties with respect to specified property or obligations of the Company or profits and losses associated with specified property or obligations, and the debts, liabilities, obligations, and expenses incurred with respect to a particular series shall be enforceable only against the assets of that series and not against the assets of the Company generally or any other series.`;
    }

    // Article II - Purpose and Powers
    const articlePurpose = `ARTICLE II
PURPOSE AND POWERS

2.1 Purpose. The Company is formed for the purpose of ${formData.businessPurpose} and for any other lawful purpose as determined by the ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'}.

2.2 Powers. The Company shall have all powers permitted to be exercised by a limited liability company organized under the Act, including without limitation the power to own, hold, manage, and dispose of property; to enter into contracts; to sue and be sued; and to conduct any lawful business.`;

    // Article III - Members and Capital
    let membersList = '';
    formData.members.forEach((member, index) => {
      membersList += `
    ${index + 1}. ${member.name || `[MEMBER ${index + 1} NAME]`}
       Address: ${member.address || `[MEMBER ${index + 1} ADDRESS]`}
       Initial Capital Contribution: $${member.contributionAmount || '0.00'}
       Membership Interest: ${member.ownershipPercentage || '0'}%`;
    });

    const articleMembers = `ARTICLE III
MEMBERS AND CAPITAL CONTRIBUTIONS

3.1 Initial Members and Capital Contributions. The initial Members of the Company and their respective Capital Contributions, Membership Interests, and addresses are as follows:${membersList}

3.2 Additional Capital Contributions. ${
      formData.additionalCapitalRequirements === 'none'
        ? 'No Member shall be required to make any additional Capital Contributions to the Company.'
        : formData.additionalCapitalRequirements === 'unanimous'
          ? 'Additional Capital Contributions may be required of Members only upon the unanimous written consent of all Members.'
          : 'Additional Capital Contributions may be required of Members upon the approval of Members holding a majority of the Membership Interests.'
    }

3.3 Return of Capital Contributions. ${
      formData.returningCapital === 'discretion'
        ? 'Capital Contributions shall be returned to Members at the discretion of the ' + (formData.managementType === 'manager-managed' ? 'Managers' : 'Members') + ', subject to the requirements of the Act.'
        : formData.returningCapital === 'proportional'
          ? 'Capital Contributions shall be returned to Members proportionally based on their Membership Interests.'
          : 'Capital Contributions shall be returned according to a fixed schedule as determined by the ' + (formData.managementType === 'manager-managed' ? 'Managers' : 'Members') + '.'
    }

3.4 Capital Accounts. A separate Capital Account shall be maintained for each Member in accordance with Treasury Regulation Section 1.704-1(b)(2)(iv).

3.5 No Interest on Capital Contributions. No Member shall be entitled to receive any interest on their Capital Contribution except as expressly provided herein.

3.6 Loans. Any Member may, with approval of the ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'}, make a loan to the Company. Loans made by a Member shall not be considered Capital Contributions and shall not increase the lending Member's Membership Interest.`;

    // Article IV - Management
    let managementArticle = '';

    if (formData.managementType === 'member-managed') {
      managementArticle = `ARTICLE IV
MANAGEMENT

4.1 Management by Members. The Company shall be managed by the Members. The Members shall have the sole right to manage the Company and shall have all authority, rights, and powers conferred by law and those necessary, advisable, or consistent in connection with accomplishing the purpose of the Company.

4.2 Voting Rights of Members. Each Member shall be entitled to vote on all matters on which Members may vote in proportion to the Member's Membership Interest in the Company. Unless otherwise specified in this Agreement, all decisions, approvals, or actions requiring a vote, approval, or action of the Members shall require the approval of Members holding a majority of the Membership Interests.

4.3 Authority to Bind Company. ${isSingleMember
        ? 'The sole Member shall have full authority to bind the Company in all matters.'
        : 'Any Member may bind the Company in the ordinary course of business. Actions outside the ordinary course of business require the approval of Members holding a majority of the Membership Interests.'}

4.4 Officers. The Members may appoint officers of the Company with such duties and responsibilities as determined by the Members. Officers serve at the pleasure of the Members and may be removed at any time with or without cause.`;
    } else {
      let managersList = '';
      formData.managers.forEach((manager, index) => {
        managersList += `
    ${index + 1}. ${manager.name || `[MANAGER ${index + 1} NAME]`}
       Address: ${manager.address || `[MANAGER ${index + 1} ADDRESS]`}
       ${manager.isAlsoMember ? 'This Manager is also a Member of the Company.' : 'This Manager is not a Member of the Company.'}`;
      });

      managementArticle = `ARTICLE IV
MANAGEMENT

4.1 Management by Managers. The Company shall be managed by one or more Managers. The Managers shall have the sole right to manage the Company and shall have all authority, rights, and powers conferred by law and those necessary, advisable, or consistent in connection with accomplishing the purpose of the Company.

4.2 Initial Managers. The initial Managers of the Company are as follows:${managersList}

4.3 Term of Managers. Each Manager shall serve until the earlier of their death, incapacity, resignation, or removal.

4.4 Removal of Managers. Any Manager may be removed, with or without cause, by the vote of Members holding a majority of the Membership Interests.

4.5 Decisions of Managers. If there is more than one Manager, decisions shall be made by a majority of the Managers unless otherwise specified in this Agreement.

4.6 Authority of Managers. The Managers shall have full and complete authority, power, and discretion to manage and control the business of the Company, to make all decisions regarding those matters, and to perform any and all other acts or activities customary or incident to the management of the Company's business.

4.7 Officers. The Managers may appoint officers of the Company with such duties and responsibilities as determined by the Managers. Officers serve at the pleasure of the Managers and may be removed at any time with or without cause.`;
    }

    // Article V - Allocations and Distributions
    const articleDistributions = `ARTICLE V
ALLOCATIONS AND DISTRIBUTIONS

5.1 Fiscal Year. The Company's fiscal year shall end on ${formData.fiscalYearEnd || 'December 31'}.

5.2 Tax Treatment. ${isSingleMember
      ? 'The Company shall be treated as a disregarded entity for federal income tax purposes, with all items of income, gain, loss, deduction, and credit reported on the sole Member\'s federal income tax return.'
      : 'The Company shall be treated as a partnership for federal income tax purposes. The Company shall not elect to be treated as a corporation.'}

5.3 Allocations. Profits, losses, and other tax items shall be allocated to the Members in proportion to their Membership Interests, except as otherwise required by the Internal Revenue Code or Treasury Regulations.

5.4 Distributions. Distributions shall be made to Members ${
      formData.distributionType === 'proportional'
        ? 'in proportion to their Membership Interests'
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
        : 'Members holding a majority of the Membership Interests'
    }.

5.5 Delaware Franchise Tax. The Members acknowledge that the Company is subject to Delaware's annual franchise tax of $300 per year, due on or before June 1 of each year.

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
        ? 'Right of First Refusal. If a Member receives a bona fide offer to purchase all or part of their Membership Interest and wishes to accept such offer, the Member shall first offer to sell such interest to the other Members on the same terms and conditions as the offer received. The other Members shall have thirty (30) days to exercise this right of first refusal.'
        : formData.transferRestrictions === 'unanimous-approval'
          ? 'Transfer Procedure. A Member wishing to transfer all or any portion of their Membership Interest must first obtain the unanimous written consent of all other Members. Any transfer made without such consent shall be null and void.'
          : 'Transfer Procedure. A Member may transfer all or any portion of their Membership Interest subject to compliance with applicable securities laws and this Agreement.'
    }

6.3 Involuntary Transfers. In the event of the death, disability, bankruptcy, or divorce of a Member that would cause an involuntary transfer of a Membership Interest, the Company and the remaining Members shall have the option to purchase such Membership Interest at its fair market value.

6.4 Valuation of Membership Interest. For purposes of this Article VI, the value of a Membership Interest shall be determined using the ${
      formData.buyoutValuationMethod === 'book-value'
        ? 'book value method, based on the Company\'s most recent balance sheet'
        : formData.buyoutValuationMethod === 'appraisal'
          ? 'appraisal method, with an independent appraiser mutually agreed upon by the parties'
          : 'formula method, calculated as three (3) times the Company\'s average annual net profit for the preceding three (3) fiscal years, multiplied by the Member\'s Membership Interest percentage'
    }.

6.5 Admission of New Members. New Members may be admitted to the Company only with the consent of Members holding a majority of the Membership Interests and upon such terms as the existing Members shall determine.`;

    // Article VII - Dissolution and Liquidation
    const dissolutionReasonsList = formData.dissolutionReasons.map(reason => {
      switch(reason) {
        case 'mutual-agreement':
          return 'The unanimous written agreement of all Members';
        case 'judicial-dissolution':
          return 'A decree of judicial dissolution entered pursuant to 6 Del. C. § 18-802';
        case 'purpose-completion':
          return 'The completion of the Company\'s purpose';
        case 'illegality':
          return 'The Company\'s business becoming illegal under Delaware or federal law';
        case 'member-dissociation':
          return 'The dissociation of any Member without the continued business of the Company';
        case 'administrative-dissolution':
          return 'Administrative dissolution by the Delaware Secretary of State';
        default:
          return reason;
      }
    }).join(';\n    (b) ');

    const articleDissolution = `ARTICLE VII
DISSOLUTION AND LIQUIDATION

7.1 Dissolution Events. The Company shall dissolve and its affairs shall be wound up upon the first to occur of the following:
    (a) ${dissolutionReasonsList};
    (c) The vote of Members holding at least seventy-five percent (75%) of the Membership Interests to dissolve the Company; or
    (d) Any other event causing dissolution under the Act.

7.2 Winding Up. Upon dissolution, the Company shall cease carrying on its business and affairs and shall commence the winding up of the Company's business and affairs. The ${formData.managementType === 'manager-managed' ? 'Managers' : 'Members'} shall be responsible for winding up the Company's affairs.

7.3 Liquidation. Upon the winding up of the Company, the Company's assets shall be distributed as follows:
    (a) To creditors, including Members who are creditors, in satisfaction of the Company's liabilities;
    (b) To Members in satisfaction of any unpaid distributions to which they are entitled; and
    (c) To Members ${
      formData.liquidationPreference === 'equal'
        ? 'in accordance with their Membership Interests'
        : 'in accordance with a liquidation preference as determined by the ' + (formData.managementType === 'manager-managed' ? 'Managers' : 'Members')
    }.

7.4 Certificate of Cancellation. After the dissolution and winding up of the Company, the Company shall file a Certificate of Cancellation with the Delaware Secretary of State as required by the Act.

7.5 No Deficit Restoration Obligation. No Member shall have any obligation to restore any negative balance in their Capital Account upon liquidation of the Company.`;

    // Article VIII - Amendments
    const articleAmendments = `ARTICLE VIII
AMENDMENTS

8.1 Amendment of Operating Agreement. This Agreement may be amended by the approval of Members holding ${
      formData.amendmentRequirement === 'majority'
        ? 'a majority'
        : formData.amendmentRequirement === 'supermajority'
          ? 'at least seventy-five percent (75%)'
          : 'one hundred percent (100%)'
    } of the Membership Interests, except that any amendment that would:
    (a) Modify the limited liability of any Member;
    (b) Alter the interest of a Member in profits, losses, or distributions; or
    (c) Amend this Section 8.1;
shall require the unanimous consent of all Members.

8.2 Amendment of Certificate of Formation. The Certificate of Formation may be amended by filing a Certificate of Amendment with the Delaware Secretary of State as required by the Act. Such amendment shall require the approval of Members as set forth in Section 8.1.`;

    // Article IX - Miscellaneous
    const articleMiscellaneous = `ARTICLE IX
MISCELLANEOUS PROVISIONS

9.1 Binding Effect. This Agreement shall be binding upon and inure to the benefit of the Members and their respective heirs, executors, administrators, successors, and permitted assigns.

9.2 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to principles of conflicts of law.

9.3 Dispute Resolution. ${
      formData.disputeResolution === 'chancery-court'
        ? 'Any dispute arising out of or relating to this Agreement shall be resolved exclusively in the Court of Chancery of the State of Delaware, or if the Court of Chancery lacks jurisdiction, in the Superior Court of the State of Delaware. The Members irrevocably consent to the exclusive jurisdiction of such courts.'
        : formData.disputeResolution === 'arbitration'
          ? 'Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration in Wilmington, Delaware in accordance with the rules of the American Arbitration Association.'
          : 'Any dispute arising out of or relating to this Agreement shall first be submitted to mediation in Wilmington, Delaware. If mediation is unsuccessful within sixty (60) days, the dispute shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association.'
    }

9.4 Entire Agreement. This Agreement constitutes the entire agreement among the Members with respect to the subject matter hereof and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written.

9.5 Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable, and the validity, legality, and enforceability of the remaining provisions shall not be affected.

9.6 Waiver. No waiver of any provision of this Agreement shall be effective unless in writing and signed by the waiving party. The failure of any party to enforce any provision of this Agreement shall not constitute a waiver of such provision.

9.7 Counterparts. This Agreement may be executed in multiple counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed valid and binding.

9.8 Notices. All notices required or permitted under this Agreement shall be in writing and shall be deemed effectively given when: (a) personally delivered; (b) sent by email to the address on file; (c) sent by overnight courier; or (d) mailed by registered or certified mail, return receipt requested. Notices shall be addressed to the Members at their addresses set forth herein or such other address as a Member may designate in writing.

9.9 Headings. The headings in this Agreement are for convenience of reference only and shall not affect the interpretation of this Agreement.

9.10 Further Assurances. Each Member agrees to execute and deliver such additional documents and take such additional actions as may be reasonably necessary to effectuate the purposes of this Agreement.`;

    // Signature block
    const signatureBlock = `IN WITNESS WHEREOF, the undersigned ${isSingleMember ? 'Member has' : 'Members have'} executed this Operating Agreement as of the date first written above.

MEMBERS:

${formData.members.map((member, index) => `
${member.name || `[MEMBER ${index + 1} NAME]`}


_________________________________
Signature

Date: _________________

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

  // Function to highlight changed text
  const createHighlightedText = () => {
    if (!lastChanged) return documentText;

    const sectionPatterns = {
      companyName: /(?<=OF\n).*(?=\nA DELAWARE)|(?<=The name of the Company is ").*?(?=")/g,
      formationDate: /(?<=formed as a Delaware limited liability company on ).*?(?= by filing)/g,
      principalAddress: /(?<=principal place of business of the Company shall be at ).*?(?=, or such)/g,
      registeredAgent: /(?<=Company's registered agent in Delaware is ).*?(?=, located)/g,
      registeredAgentAddress: /(?<=located at ).*?(?=\. The)/g,
      businessPurpose: /(?<=The Company is formed for the purpose of ).*?(?= and for any)/g,
      fiscalYearEnd: /(?<=The Company's fiscal year shall end on ).*?(?=\.)/g,
      managementType: formData.managementType === 'member-managed'
        ? /ARTICLE IV\nMANAGEMENT\n\n4\.1 Management by Members.*?(?=4\.2)/s
        : /ARTICLE IV\nMANAGEMENT\n\n4\.1 Management by Managers.*?(?=4\.2)/s,
      distributionType: /(?<=5\.4 Distributions. Distributions shall be made to Members ).*?(?= on a)/g,
      distributionSchedule: /(?<= on a ).*?(?= basis)/g,
      transferRestrictions: /(?<=6\.1 Restriction on Transfers.*?)without.*?(?=\.)/gs,
      amendmentRequirement: /(?<=This Agreement may be amended by the approval of Members holding ).*?(?= of the Membership)/g,
      disputeResolution: /(?<=9\.3 Dispute Resolution\. ).*?(?=9\.4)/s,
    };

    // Handle member field changes
    if (lastChanged.startsWith('members.')) {
      const parts = lastChanged.split('.');
      const index = parseInt(parts[1]);
      const memberPattern = new RegExp(`${index + 1}\\. .*?(?=${index + 2}\\. |\\n\\n3\\.2)`, 's');
      const memberSection = memberPattern.exec(documentText);

      if (memberSection && memberSection[0]) {
        return documentText.replace(memberSection[0], match =>
          `<span class="highlighted-text">${match}</span>`
        );
      }
    }

    const regex = sectionPatterns[lastChanged];
    if (regex) {
      return documentText.replace(regex, match =>
        `<span class="highlighted-text">${match}</span>`
      );
    }

    return documentText;
  };

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
        fileName: `${formData.companyName || 'Delaware-LLC'}-Operating-Agreement`
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
            LLC Name*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The legal name of your LLC as filed with the Delaware Secretary of State. Must include "LLC" or "Limited Liability Company".</span>
            </div>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., Acme Holdings, LLC"
          />
        </div>

        <div className="form-group">
          <label>
            Formation Date*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">The date your Certificate of Formation was filed with Delaware Secretary of State.</span>
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
              <span className="tooltiptext">The main address where your LLC conducts business. Can be anywhere - doesn't need to be in Delaware.</span>
            </div>
          </label>
          <input
            type="text"
            name="principalAddress"
            value={formData.principalAddress}
            onChange={handleChange}
            placeholder="e.g., 123 Main Street, Suite 100, New York, NY 10001"
          />
        </div>

        <div className="form-group">
          <label>
            Delaware Registered Agent Name*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Your registered agent must have a physical address in Delaware. This is who receives legal documents on behalf of your LLC.</span>
            </div>
          </label>
          <input
            type="text"
            name="registeredAgent"
            value={formData.registeredAgent}
            onChange={handleChange}
            placeholder="e.g., Harvard Business Services, Inc."
          />
        </div>

        <div className="form-group">
          <label>
            Registered Agent Address*
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Must be a physical Delaware address (not a P.O. Box).</span>
            </div>
          </label>
          <input
            type="text"
            name="registeredAgentAddress"
            value={formData.registeredAgentAddress}
            onChange={handleChange}
            placeholder="e.g., 16192 Coastal Highway, Lewes, DE 19958"
          />
        </div>

        <div className="info-box">
          <strong>Delaware LLC Compliance:</strong> Delaware LLCs must pay an annual franchise tax of $300, due by June 1 each year. There is no annual report requirement. Failure to pay results in a $200 penalty plus 1.5% monthly interest.
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
              <span className="tooltiptext">Delaware allows a broad purpose clause. You can keep it general for maximum flexibility.</span>
            </div>
          </label>
          <textarea
            name="businessPurpose"
            value={formData.businessPurpose}
            onChange={handleChange}
            placeholder="e.g., engaging in any lawful business activity..."
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Fiscal Year End</label>
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
              <span className="tooltiptext">Member-managed: All members participate in management. Manager-managed: Designated managers run operations (can be members or non-members).</span>
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

        <div className="delaware-options">
          <h4>Delaware-Specific Options</h4>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isSeriesLLC"
                checked={formData.isSeriesLLC}
                onChange={handleChange}
              />
              <span>Series LLC (6 Del. C. § 18-215)</span>
              <div className="tooltip">
                <i data-feather="info" className="info-icon"></i>
                <span className="tooltiptext">A Series LLC allows you to create separate "series" with distinct assets and liabilities, protected from each other. Ideal for real estate investors or multiple ventures.</span>
              </div>
            </label>
          </div>

          {formData.isSeriesLLC && (
            <div className="form-group">
              <label>Initial Series Name (Optional)</label>
              <input
                type="text"
                name="seriesName"
                value={formData.seriesName}
                onChange={handleChange}
                placeholder="e.g., Series A - 123 Main St Property"
              />
            </div>
          )}
        </div>

        {formData.managementType === 'manager-managed' && (
          <div className="managers-section">
            <h4>Manager Information</h4>

            {formData.managers.map((manager, index) => (
              <div key={index} className="member-card">
                <h4>Manager {index + 1}</h4>

                <div className="form-group">
                  <label>Manager Selection</label>
                  <select
                    value={manager.memberId}
                    onChange={(e) => handleManagerChange(index, 'memberId', e.target.value)}
                  >
                    <option value="-1">Other (Enter manually)</option>
                    {formData.members.map((member, i) => (
                      <option key={i} value={i} disabled={!member.name}>
                        {member.name || `Member ${i+1} (No name entered)`}
                      </option>
                    ))}
                  </select>
                </div>

                {manager.memberId === -1 && (
                  <>
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
                        placeholder="e.g., 123 Main St, City, State ZIP"
                      />
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={manager.isAlsoMember}
                          onChange={(e) => handleManagerChange(index, 'isAlsoMember', e.target.checked)}
                        />
                        <span>This manager is also a member</span>
                      </label>
                    </div>
                  </>
                )}

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
          </div>
        )}

        <div className="info-box">
          <strong>Why Delaware?</strong> Delaware's Court of Chancery specializes in business disputes with expert judges (no jury trials). The Delaware LLC Act (6 Del. C. § 18-101 et seq.) is the most flexible in the nation, allowing maximum contractual freedom.
        </div>
      </div>
    );
  };

  // Render member information tab
  const renderMemberInfoTab = () => {
    const totalPercentage = formData.members.reduce((sum, member) => {
      return sum + (parseFloat(member.ownershipPercentage) || 0);
    }, 0).toFixed(2);

    return (
      <div className="form-tab">
        <h3>Member Information</h3>
        <p className="tab-description">Add information about each member of the LLC.</p>

        <div className="total-percentage-display">
          <span className={totalPercentage == 100 ? 'percentage-ok' : 'percentage-warning'}>
            Total Ownership: {totalPercentage}%
            {totalPercentage != 100 &&
              <div className="tooltip">
                <i data-feather="alert-circle" className="warning-icon"></i>
                <span className="tooltiptext">Total ownership should equal exactly 100%</span>
              </div>
            }
          </span>
        </div>

        {formData.members.map((member, index) => (
          <div key={index} className="member-card">
            <h4>Member {index + 1}</h4>

            <div className="form-group">
              <label>Full Legal Name*</label>
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
                placeholder="e.g., 123 Main St, City, State ZIP"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Initial Capital Contribution ($)</label>
                <input
                  type="text"
                  value={member.contributionAmount}
                  onChange={(e) => handleMemberChange(index, 'contributionAmount', e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>

              <div className="form-group">
                <label>Membership Interest (%)*</label>
                <div className="percentage-input-container">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={member.ownershipPercentage}
                    onChange={(e) => handleMemberChange(index, 'ownershipPercentage', e.target.value)}
                    placeholder="e.g., 50"
                  />
                  <div className="percentage-controls">
                    <button
                      type="button"
                      className="percentage-control"
                      onClick={() => handleMemberChange(index, 'ownershipPercentage', (parseFloat(member.ownershipPercentage) || 0) + 1)}
                    >
                      <i data-feather="chevron-up" className="percentage-icon"></i>
                    </button>
                    <button
                      type="button"
                      className="percentage-control"
                      onClick={() => handleMemberChange(index, 'ownershipPercentage', Math.max(0, (parseFloat(member.ownershipPercentage) || 0) - 1))}
                    >
                      <i data-feather="chevron-down" className="percentage-icon"></i>
                    </button>
                  </div>
                </div>
              </div>
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
          <strong>Delaware Privacy:</strong> Delaware does not require member names in the Certificate of Formation. Only the registered agent is public record, providing maximum privacy for LLC owners.
        </div>
      </div>
    );
  };

  // Render management and capital tab
  const renderManagementCapitalTab = () => {
    return (
      <div className="form-tab">
        <h3>Capital Requirements</h3>

        <div className="form-group">
          <label>
            Additional Capital Requirements
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Determines who can require members to contribute more capital after formation.</span>
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
          <label>Return of Capital Contributions</label>
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

        <div className="info-box">
          <strong>Delaware Flexibility:</strong> Under 6 Del. C. § 18-1101, Delaware LLC members have maximum freedom to structure their capital and contribution arrangements as they see fit.
        </div>
      </div>
    );
  };

  // Render distributions and transfer tab
  const renderDistributionsTransferTab = () => {
    return (
      <div className="form-tab">
        <h3>Distributions & Transfers</h3>

        <h4>Profit Distributions</h4>

        <div className="form-group">
          <label>Distribution Method</label>
          <select
            name="distributionType"
            value={formData.distributionType}
            onChange={handleChange}
          >
            <option value="proportional">Proportional to Membership Interest</option>
            <option value="custom">Custom Distribution Method</option>
          </select>
        </div>

        <div className="form-group">
          <label>Distribution Schedule</label>
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
          <label>Distribution Approval</label>
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
          <label>Transfer Restrictions</label>
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
          <label>Valuation Method for Buyouts</label>
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
          <label>Dissolution Events (Hold Ctrl/Cmd to select multiple)</label>
          <select
            name="dissolutionReasons"
            value={formData.dissolutionReasons}
            onChange={handleChange}
            multiple
            size="5"
          >
            <option value="mutual-agreement">Unanimous Agreement of All Members</option>
            <option value="judicial-dissolution">Judicial Dissolution (6 Del. C. § 18-802)</option>
            <option value="purpose-completion">Completion of Company Purpose</option>
            <option value="illegality">Business Becomes Illegal</option>
            <option value="member-dissociation">Dissociation of a Member</option>
            <option value="administrative-dissolution">Administrative Dissolution</option>
          </select>
        </div>

        <div className="form-group">
          <label>Liquidation Preference</label>
          <select
            name="liquidationPreference"
            value={formData.liquidationPreference}
            onChange={handleChange}
          >
            <option value="equal">Equal to Membership Interests</option>
            <option value="prioritized">Prioritized Distribution</option>
          </select>
        </div>

        <h4>Amendments & Dispute Resolution</h4>

        <div className="form-group">
          <label>Amendment Requirements</label>
          <select
            name="amendmentRequirement"
            value={formData.amendmentRequirement}
            onChange={handleChange}
          >
            <option value="majority">Majority Vote (>50%)</option>
            <option value="supermajority">Supermajority Vote (75%+)</option>
            <option value="unanimous">Unanimous Vote (100%)</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Dispute Resolution
            <div className="tooltip">
              <i data-feather="info" className="info-icon"></i>
              <span className="tooltiptext">Delaware's Court of Chancery is highly preferred for business disputes - specialized judges, no jury, fast resolution.</span>
            </div>
          </label>
          <select
            name="disputeResolution"
            value={formData.disputeResolution}
            onChange={handleChange}
          >
            <option value="chancery-court">Delaware Court of Chancery (Recommended)</option>
            <option value="arbitration">Binding Arbitration</option>
            <option value="mediation-then-arbitration">Mediation, then Arbitration</option>
          </select>
        </div>

        <div className="info-box">
          <strong>Court of Chancery:</strong> Delaware's Court of Chancery is the nation's premier business court. Judges are experts in business law, cases are decided without juries, and there's over 200 years of precedent. This is why sophisticated investors and venture capitalists prefer Delaware.
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
        return renderMemberInfoTab();
      case 2:
        return renderBusinessDetailsTab();
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
        <h2>Delaware LLC Operating Agreement Generator</h2>
        <p>Create a customized Operating Agreement for your Delaware Limited Liability Company</p>
        <div className="header-badges">
          <span className="badge badge-de">Delaware-Specific</span>
          <span className="badge badge-free">Free</span>
          <span className="badge badge-instant">Instant Download</span>
        </div>
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
                  backgroundColor: "#003087",
                  color: "white",
                  border: "none"
                }}
              >
                <i data-feather="file-text"></i> Download Word
              </button>

              <a
                href="https://terms.law/call/"
                target="_blank"
                className="nav-button"
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i data-feather="calendar"></i> Schedule Consult
              </a>
            </div>

            <button
              onClick={nextTab}
              className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
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
        <p>Need legal advice? <a href="https://terms.law/call/" target="_blank">Schedule a consultation</a> with an attorney.</p>
        <p><small>Disclaimer: This document generator is provided for informational purposes only and does not constitute legal advice. The generated document is a template that should be reviewed and customized for your specific situation. For complex legal matters, please consult with a Delaware business attorney.</small></p>
        <p><small>Created by <a href="https://terms.law" target="_blank">terms.law</a> | Delaware LLC Act: 6 Del. C. § 18-101 et seq.</small></p>
      </div>
    </div>
  );
};

// Mount the app
ReactDOM.render(
  <DelawareLLCOperatingAgreementGenerator />,
  document.getElementById('root')
);

// Initialize Feather icons after render
document.addEventListener('DOMContentLoaded', () => {
  feather.replace();
});
