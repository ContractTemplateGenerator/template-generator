// Token Distribution Agreement Generator
const { useState, useEffect, useRef } = React;

// Icon component for using Feather icons
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

// Main Generator Component
const TokenDistributionGenerator = () => {
  // Tab configuration
  const tabs = [
    { id: 'basics', label: 'Parties & Token' },
    { id: 'distribution', label: 'Distribution Terms' },
    { id: 'vesting', label: 'Vesting Schedule' },
    { id: 'lockup', label: 'Lock-up Period' },
    { id: 'rights', label: 'Rights & Restrictions' },
    { id: 'additional', label: 'Additional Terms' },
    { id: 'finalize', label: 'Review & Finalize' }
  ];

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    // Parties & Token Details
    companyName: '',
    companyType: 'Delaware Corporation',
    companyAddress: '',
    recipientName: '',
    recipientType: 'Individual',
    recipientAddress: '',
    tokenName: '',
    tokenSymbol: '',
    tokenBlockchain: 'Ethereum',
    tokenType: 'ERC-20',
    tokenStandard: 'Utility Token',
    
    // Distribution Terms
    tokenAmount: '',
    tokenPrice: '',
    totalConsideration: '',
    paymentMethod: 'USD',
    distributionDate: '',
    distributionMethod: 'Direct Transfer',
    
    // Vesting Schedule
    hasVesting: 'yes',
    cliffPeriod: '12',
    cliffUnit: 'months',
    vestingPeriod: '48',
    vestingUnit: 'months',
    vestingType: 'Linear',
    initialReleasePercentage: '0',
    accelerationOnChange: true,
    
    // Lock-up Period
    hasLockup: 'yes',
    lockupPeriod: '12',
    lockupUnit: 'months',
    earlyReleaseConditions: 'None',
    
    // Rights & Restrictions
    votingRights: 'No',
    dividendRights: 'No',
    transferRestrictions: 'yes',
    rightOfFirstRefusal: 'yes',
    dragAlongRights: 'no',
    
    // Additional Terms
    confidentialityClause: 'yes',
    disputeResolution: 'Arbitration',
    governingLaw: 'Delaware',
    terminationRights: 'Standard',
    antiDilutionProtection: 'no',
    
    // Document Info
    fileName: 'Token-Distribution-Agreement',
    documentTitle: 'Token Distribution Agreement'
  });
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
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
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(generateDocumentText()).then(() => {
        alert("Agreement text copied to clipboard!");
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };
  
  // MS Word document download function
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Get document text
      const documentText = generateDocumentText();
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: formData.documentTitle || "Token Distribution Agreement",
        fileName: formData.fileName || "Token-Distribution-Agreement"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Function to determine which section to highlight based on the tab and last changed field
  const getSectionToHighlight = () => {
    if (!lastChanged) return null;
    
    // Mapping of fields to document sections
    const sectionMapping = {
      // Parties & Token Details
      companyName: 'company_details',
      companyType: 'company_details',
      companyAddress: 'company_details',
      recipientName: 'recipient_details',
      recipientType: 'recipient_details',
      recipientAddress: 'recipient_details',
      tokenName: 'token_details',
      tokenSymbol: 'token_details',
      tokenBlockchain: 'token_details',
      tokenType: 'token_details',
      tokenStandard: 'token_details',
      
      // Distribution Terms
      tokenAmount: 'distribution_terms',
      tokenPrice: 'distribution_terms',
      totalConsideration: 'distribution_terms',
      paymentMethod: 'distribution_terms',
      distributionDate: 'distribution_terms',
      distributionMethod: 'distribution_terms',
      
      // Vesting Schedule
      hasVesting: 'vesting_schedule',
      cliffPeriod: 'vesting_schedule',
      cliffUnit: 'vesting_schedule',
      vestingPeriod: 'vesting_schedule',
      vestingUnit: 'vesting_schedule',
      vestingType: 'vesting_schedule',
      initialReleasePercentage: 'vesting_schedule',
      accelerationOnChange: 'vesting_schedule',
      
      // Lock-up Period
      hasLockup: 'lockup_period',
      lockupPeriod: 'lockup_period',
      lockupUnit: 'lockup_period',
      earlyReleaseConditions: 'lockup_period',
      
      // Rights & Restrictions
      votingRights: 'rights_restrictions',
      dividendRights: 'rights_restrictions',
      transferRestrictions: 'rights_restrictions',
      rightOfFirstRefusal: 'rights_restrictions',
      dragAlongRights: 'rights_restrictions',
      
      // Additional Terms
      confidentialityClause: 'additional_terms',
      disputeResolution: 'additional_terms',
      governingLaw: 'additional_terms',
      terminationRights: 'additional_terms',
      antiDilutionProtection: 'additional_terms'
    };
    
    return sectionMapping[lastChanged] || null;
  };
  
  // Generate document text based on form data
  const generateDocumentText = () => {
    // Return empty string if essential fields are missing
    if (!formData.companyName || !formData.recipientName || !formData.tokenName) {
      return '';
    }
    
    // Build document sections
    const sections = {
      header: `TOKEN DISTRIBUTION AGREEMENT

THIS TOKEN DISTRIBUTION AGREEMENT (the "Agreement") is made effective as of ${formatDate(formData.distributionDate || new Date().toISOString().split('T')[0])} (the "Effective Date"),

BETWEEN:

${formData.companyName.toUpperCase()} (the "${formData.companyType.includes("LLC") ? "Company" : "Corporation"}"), a ${formData.companyType} with its principal place of business at ${formData.companyAddress}

AND:

${formData.recipientName.toUpperCase()} (the "Recipient"), a ${formData.recipientType.toLowerCase()} ${formData.recipientType !== "Individual" ? `with its principal place of business at ${formData.recipientAddress}` : `residing at ${formData.recipientAddress}`}

RECITALS:

WHEREAS, the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} has created a cryptocurrency token known as ${formData.tokenName} (the "${formData.tokenSymbol}" or "Token"), which is a ${formData.tokenType} token deployed on the ${formData.tokenBlockchain} blockchain;

WHEREAS, the Token is intended to function as a ${formData.tokenStandard.toLowerCase()};

WHEREAS, the Recipient desires to purchase and receive Tokens from the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}, and the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} desires to sell and distribute Tokens to the Recipient, subject to the terms and conditions set forth in this Agreement;

NOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:
`,
      
      definitions: `1. DEFINITIONS

1.1 "Blockchain" means the ${formData.tokenBlockchain} blockchain.

1.2 "Tokens" means the ${formData.tokenName} (${formData.tokenSymbol}) cryptocurrency tokens, which are ${formData.tokenType} tokens deployed on the Blockchain.

1.3 "Distribution" means the initial transfer of Tokens from the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} to the Recipient pursuant to this Agreement.

1.4 "Smart Contract" means the software code deployed on the Blockchain that governs the creation, distribution, and functioning of the Tokens.

1.5 "Wallet" means a cryptocurrency wallet capable of storing and transacting the Tokens.

1.6 "Change of Control" means the transfer of more than 50% of the voting power or economic interest in the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} to a third party, whether by merger, acquisition, sale of equity, or otherwise.
`,
      
      distribution_terms: `2. TOKEN DISTRIBUTION

2.1 Subject to the terms and conditions of this Agreement, the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} agrees to distribute to the Recipient ${formData.tokenAmount} Tokens (the "Distributed Tokens").

2.2 In consideration for the Distributed Tokens, the Recipient shall pay to the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} ${formData.totalConsideration ? `a total of ${formData.totalConsideration} ${formData.paymentMethod}` : `${formData.tokenPrice} ${formData.paymentMethod} per Token, for a total consideration of ${(parseFloat(formData.tokenPrice || 0) * parseFloat(formData.tokenAmount || 0)).toFixed(2)} ${formData.paymentMethod}`} (the "Consideration").

2.3 The Consideration shall be paid by the Recipient to the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} on or before the Effective Date, unless otherwise agreed to in writing by the parties.

2.4 The Distributed Tokens shall be transferred to the Recipient's designated Wallet by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} via ${formData.distributionMethod} within five (5) business days after receipt of the Consideration, subject to the vesting schedule and lock-up restrictions set forth in Sections 3 and 4 below.
`,
      
      vesting_schedule: formData.hasVesting === 'yes' ? `3. VESTING SCHEDULE

3.1 The Distributed Tokens shall vest according to the following schedule (the "Vesting Schedule"):

${formData.initialReleasePercentage && parseInt(formData.initialReleasePercentage) > 0 ? `   (a) ${formData.initialReleasePercentage}% of the Distributed Tokens shall vest immediately upon distribution; and\n\n   (b) The remaining ${100 - parseInt(formData.initialReleasePercentage)}% of the Distributed Tokens shall be subject to a vesting schedule as follows:` : '   The Distributed Tokens shall be subject to a vesting schedule as follows:'}

      (i) Cliff: No Tokens shall vest until the completion of ${formData.cliffPeriod} ${formData.cliffUnit} from the Effective Date (the "Cliff Period").
      
      (ii) ${formData.vestingType === 'Linear' ? `After the Cliff Period, the remaining Tokens shall vest in equal monthly installments over a period of ${formData.vestingPeriod} ${formData.vestingUnit} from the Effective Date.` : `After the Cliff Period, the remaining Tokens shall vest according to the following milestone-based schedule: [INSERT MILESTONE DETAILS].`}

3.2 Any unvested Tokens shall be held in escrow by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} until they vest in accordance with the Vesting Schedule.

3.3 ${formData.accelerationOnChange ? `In the event of a Change of Control of the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}, all unvested Tokens shall immediately vest and be released to the Recipient.` : `In the event of a Change of Control of the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}, unvested Tokens shall continue to vest in accordance with the Vesting Schedule.`}

3.4 If, prior to the completion of the Vesting Schedule, the Recipient ceases to be an employee, advisor, or service provider to the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} for any reason, any unvested Tokens shall be forfeited and returned to the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} treasury, unless otherwise agreed to in writing by the parties.
` : `3. VESTING SCHEDULE

3.1 The Distributed Tokens shall vest immediately upon distribution with no vesting schedule.
`,
      
      lockup_period: formData.hasLockup === 'yes' ? `4. LOCK-UP RESTRICTIONS

4.1 The Recipient agrees not to sell, transfer, or otherwise dispose of any of the Distributed Tokens for a period of ${formData.lockupPeriod} ${formData.lockupUnit} from the Effective Date (the "Lock-Up Period"), regardless of whether such Tokens have vested.

4.2 During the Lock-Up Period, the Recipient shall not:
   (a) offer, pledge, sell, contract to sell, sell any option or contract to purchase, purchase any option or contract to sell, grant any option, right or warrant to purchase, lend, or otherwise transfer or dispose of, directly or indirectly, any of the Distributed Tokens;
   (b) enter into any swap or other arrangement that transfers to another, in whole or in part, any of the economic consequences of ownership of the Distributed Tokens; or
   (c) publicly disclose the intention to make any offer, sale, pledge or disposition, or to enter into any transaction, swap, hedge or other arrangement.

4.3 The restrictions in Section 4.2 shall not apply to:
   ${formData.earlyReleaseConditions !== 'None' ? 
      `(a) transfers of Tokens approved in writing by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"};
   (b) transfers of Tokens in connection with a Change of Control of the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}; or
   (c) ${formData.earlyReleaseConditions}.` : 
      `(a) transfers of Tokens approved in writing by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}; or
   (b) transfers of Tokens in connection with a Change of Control of the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}.`}

4.4 Any purported transfer in violation of this Section 4 shall be null and void ab initio and shall not be recorded on the books and records of the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} or recognized by the Smart Contract.
` : `4. LOCK-UP RESTRICTIONS

4.1 The Distributed Tokens shall not be subject to any lock-up period and may be freely transferred by the Recipient after distribution, subject to applicable securities laws and regulations.
`,
      
      rights_restrictions: `5. RIGHTS AND RESTRICTIONS

5.1 The Tokens confer upon the Recipient the following rights:
   (a) ${formData.votingRights === 'Yes' ? `The right to participate in governance decisions related to the Token ecosystem, as specified in the Token governance documents.` : `No voting rights or governance participation in the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} or the Token ecosystem.`}
   (b) ${formData.dividendRights === 'Yes' ? `The right to receive dividend-like distributions if authorized by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}.` : `No rights to dividends or profit distributions from the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}.`}
   (c) The right to use the Token for its intended utility within the ecosystem developed by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}.

5.2 Transfer Restrictions: ${formData.transferRestrictions === 'yes' ? 
`The Recipient shall not transfer any Tokens to any person or entity that:
   (a) is subject to economic or trade sanctions administered or enforced by any governmental authority;
   (b) is located, organized, or resident in any country or territory that is the subject of comprehensive economic sanctions;
   (c) is identified on any applicable restricted party lists; or
   (d) would result in a violation of applicable laws by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} or the Recipient.` : 
`The Recipient may freely transfer Tokens to any third party, subject to the lock-up restrictions in Section 4 and applicable securities laws.`}

5.3 Right of First Refusal: ${formData.rightOfFirstRefusal === 'yes' ? 
`If the Recipient proposes to sell any Tokens to a third party, the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} shall have a right of first refusal to purchase such Tokens on the same terms offered to the third party. The Recipient shall provide written notice to the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} of the proposed sale, and the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} shall have fifteen (15) days to exercise its right of first refusal.` : 
`The ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} shall not have any right of first refusal with respect to Tokens the Recipient proposes to sell to third parties.`}

5.4 Drag-Along Rights: ${formData.dragAlongRights === 'yes' ? 
`If holders of more than 50% of the total Token supply approve a sale or exchange of all Tokens, the Recipient agrees to sell or exchange their Tokens on the same terms and conditions.` : 
`The Recipient shall not be required to sell or exchange their Tokens in the event of a sale or exchange approved by other Token holders.`}
`,
      
      representations: `6. REPRESENTATIONS AND WARRANTIES

6.1 ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} Representations. The ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} represents and warrants to the Recipient as follows:
   (a) It is duly organized, validly existing, and in good standing under the laws of its jurisdiction of organization.
   (b) It has all necessary power and authority to enter into this Agreement and to perform its obligations hereunder.
   (c) This Agreement constitutes the valid and legally binding obligation of the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}, enforceable against it in accordance with its terms.
   (d) The execution, delivery, and performance of this Agreement by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} does not violate its organizational documents or any agreement to which it is a party.
   (e) The Tokens have been developed and deployed in accordance with applicable laws and regulations.

6.2 Recipient Representations. The Recipient represents and warrants to the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} as follows:
   (a) ${formData.recipientType !== "Individual" ? `It is duly organized, validly existing, and in good standing under the laws of its jurisdiction of organization.` : `The Recipient has the legal capacity to enter into this Agreement and to perform the obligations hereunder.`}
   (b) ${formData.recipientType !== "Individual" ? `It has all necessary power and authority to enter into this Agreement and to perform its obligations hereunder.` : `This Agreement constitutes the valid and legally binding obligation of the Recipient, enforceable against the Recipient in accordance with its terms.`}
   (c) The Recipient has conducted its own investigation and analysis of the Tokens and the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}'s business.
   (d) The Recipient is purchasing the Tokens for its own account and not with a view toward distribution.
   (e) The Recipient understands that the Tokens involve a high degree of risk and may lose all of their value.
   (f) The Recipient is not purchasing the Tokens as a result of any advertisement, article, notice, or other communication regarding the Tokens published in any newspaper, magazine, or similar media or broadcast over television or radio or presented at any seminar or meeting.
   (g) The Recipient has sufficient knowledge and experience in financial and business matters to be capable of evaluating the merits and risks of an investment in the Tokens.
   (h) The Recipient has the financial ability to bear the economic risk of its investment in the Tokens.
`,
      
      additional_terms: `7. ADDITIONAL TERMS

7.1 Confidentiality: ${formData.confidentialityClause === 'yes' ? 
`The terms and conditions of this Agreement, and any information shared between the parties in connection with this Agreement, shall be kept confidential and shall not be disclosed to any third party without the prior written consent of the other party, except as may be required by law or regulatory authority.` : 
`The terms and conditions of this Agreement are not subject to confidentiality restrictions.`}

7.2 Dispute Resolution: ${formData.disputeResolution === 'Arbitration' ? 
`Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration under the rules of [Arbitration Association] by one or more arbitrators appointed in accordance with the said rules. The seat of arbitration shall be [City, State]. The language of the arbitration shall be English.` : 
`Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts located in [Jurisdiction].`}

7.3 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without giving effect to any choice or conflict of law provision or rule.

7.4 Termination: ${formData.terminationRights === 'Standard' ? 
`This Agreement may be terminated:
   (a) by mutual written consent of the parties;
   (b) by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} if the Recipient breaches any material provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof;
   (c) by the Recipient if the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} breaches any material provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof; or
   (d) automatically upon completion of the Distribution, vesting of all Tokens, and expiration of the Lock-Up Period.` : 
`This Agreement may only be terminated by mutual written consent of the parties or automatically upon completion of the Distribution, vesting of all Tokens, and expiration of the Lock-Up Period.`}

7.5 Anti-Dilution Protection: ${formData.antiDilutionProtection === 'yes' ? 
`If, after the Effective Date, the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"} issues additional Tokens at a price per Token less than the price paid by the Recipient under this Agreement, the Recipient shall be entitled to receive additional Tokens such that the effective price per Token equals the lower price at which the new Tokens were issued.` : 
`The Recipient shall not be entitled to any anti-dilution protection and may be diluted by subsequent issuances of Tokens by the ${formData.companyType.includes("LLC") ? "Company" : "Corporation"}.`}
`,
      
      general_provisions: `8. GENERAL PROVISIONS

8.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, understandings, and agreements between the parties.

8.2 Amendments. This Agreement may only be amended, modified, or supplemented by an agreement in writing signed by each party hereto.

8.3 Successors and Assigns. This Agreement shall be binding upon and shall inure to the benefit of the parties hereto and their respective successors and permitted assigns.

8.4 Assignment. Neither party may assign any of its rights or obligations hereunder without the prior written consent of the other party, which consent shall not be unreasonably withheld, conditioned, or delayed.

8.5 No Third-Party Beneficiaries. This Agreement is for the sole benefit of the parties hereto and their respective successors and permitted assigns and nothing herein, express or implied, is intended to or shall confer upon any other person or entity any legal or equitable right, benefit, or remedy of any nature whatsoever under or by reason of this Agreement.

8.6 Severability. If any term or provision of this Agreement is invalid, illegal, or unenforceable in any jurisdiction, such invalidity, illegality, or unenforceability shall not affect any other term or provision of this Agreement or invalidate or render unenforceable such term or provision in any other jurisdiction.

8.7 Counterparts. This Agreement may be executed in multiple counterparts, each of which shall be deemed an original, but all of which together shall be deemed to be one and the same agreement.

8.8 Notices. All notices, requests, consents, claims, demands, waivers, and other communications hereunder shall be in writing and shall be deemed to have been given (a) when delivered by hand (with written confirmation of receipt); (b) when received by the addressee if sent by a nationally recognized overnight courier (receipt requested); (c) on the date sent by email if sent during normal business hours of the recipient, and on the next business day if sent after normal business hours of the recipient; or (d) on the third day after the date mailed, by certified or registered mail, return receipt requested, postage prepaid.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.

${formData.companyName.toUpperCase()}

By: ________________________________
Name: ____________________________
Title: _____________________________

${formData.recipientName.toUpperCase()}

${formData.recipientType !== "Individual" ? 
`By: ________________________________
Name: ____________________________
Title: _____________________________` : 
`________________________________
(Signature)`}
`
    };
    
    // Combine sections into full document
    return [
      sections.header,
      sections.definitions,
      sections.distribution_terms,
      sections.vesting_schedule,
      sections.lockup_period,
      sections.rights_restrictions,
      sections.representations,
      sections.additional_terms,
      sections.general_provisions
    ].join('\n\n');
  };
  
  // Utility function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '[DATE]';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return generateDocumentText();
    
    const documentText = generateDocumentText();
    
    // Define regex patterns for different sections of the document
    const sectionPatterns = {
      company_details: /(BETWEEN:[\s\S]*?)\s+(AND:)/i,
      recipient_details: /(AND:[\s\S]*?)\s+(RECITALS:)/i,
      token_details: /(WHEREAS, the .*? has created a cryptocurrency token[\s\S]*?)(WHEREAS, the Token is intended)/i,
      distribution_terms: /(2\. TOKEN DISTRIBUTION[\s\S]*?)(3\. VESTING SCHEDULE)/i,
      vesting_schedule: /(3\. VESTING SCHEDULE[\s\S]*?)(4\. LOCK-UP RESTRICTIONS)/i,
      lockup_period: /(4\. LOCK-UP RESTRICTIONS[\s\S]*?)(5\. RIGHTS AND RESTRICTIONS)/i,
      rights_restrictions: /(5\. RIGHTS AND RESTRICTIONS[\s\S]*?)(6\. REPRESENTATIONS AND WARRANTIES)/i,
      additional_terms: /(7\. ADDITIONAL TERMS[\s\S]*?)(8\. GENERAL PROVISIONS)/i
    };
    
    // Find and highlight the section
    if (sectionPatterns[sectionToHighlight]) {
      return documentText.replace(sectionPatterns[sectionToHighlight], (match, p1, p2) => {
        return `<span class="highlighted-text">${p1}</span>${p2}`;
      });
    }
    
    return documentText;
  };
  
  // Create the highlighted document text
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Re-run feather icons replacement
    if (window.feather) {
      window.feather.replace();
    }
  }, [highlightedText, currentTab]);
  
  // Validate form data for completion
  const validateFormData = () => {
    const validations = [
      { field: 'companyName', message: 'Company name is required', tab: 0 },
      { field: 'companyAddress', message: 'Company address is required', tab: 0 },
      { field: 'recipientName', message: 'Recipient name is required', tab: 0 },
      { field: 'recipientAddress', message: 'Recipient address is required', tab: 0 },
      { field: 'tokenName', message: 'Token name is required', tab: 0 },
      { field: 'tokenSymbol', message: 'Token symbol is required', tab: 0 },
      { field: 'tokenAmount', message: 'Token amount is required', tab: 1 },
      { field: 'tokenPrice', message: 'Token price is required', tab: 1 },
      { field: 'distributionDate', message: 'Distribution date is required', tab: 1 }
    ];
    
    const errors = validations
      .filter(v => !formData[v.field])
      .map(v => ({ ...v, type: 'error' }));
    
    // Add warnings for missing optional fields
    if (formData.hasVesting === 'yes') {
      if (!formData.cliffPeriod) {
        errors.push({ field: 'cliffPeriod', message: 'Cliff period is recommended when vesting is enabled', type: 'warning', tab: 2 });
      }
      if (!formData.vestingPeriod) {
        errors.push({ field: 'vestingPeriod', message: 'Vesting period is recommended when vesting is enabled', type: 'warning', tab: 2 });
      }
    }
    
    if (formData.hasLockup === 'yes' && !formData.lockupPeriod) {
      errors.push({ field: 'lockupPeriod', message: 'Lock-up period is recommended when lock-up is enabled', type: 'warning', tab: 3 });
    }
    
    return errors;
  };
  
  // Get validation errors
  const validationErrors = validateFormData();
  
  // Render each tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Parties & Token
        return (
          <div className="form-section">
            <h2>Company Information</h2>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Blockchain Inc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="companyType">Company Type</label>
              <select
                id="companyType"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
              >
                <option value="Delaware Corporation">Delaware Corporation</option>
                <option value="Delaware LLC">Delaware LLC</option>
                <option value="C-Corporation">C-Corporation</option>
                <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
                <option value="S-Corporation">S-Corporation</option>
                <option value="Foundation">Foundation</option>
                <option value="DAO LLC">DAO LLC</option>
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
                placeholder="123 Blockchain Way, San Francisco, CA 94107"
              />
            </div>
            
            <h2>Recipient Information</h2>
            <div className="form-group">
              <label htmlFor="recipientName">Recipient Name</label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="John Doe or XYZ Ventures LLC"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientType">Recipient Type</label>
              <select
                id="recipientType"
                name="recipientType"
                value={formData.recipientType}
                onChange={handleChange}
              >
                <option value="Individual">Individual</option>
                <option value="Delaware Corporation">Delaware Corporation</option>
                <option value="Delaware LLC">Delaware LLC</option>
                <option value="C-Corporation">C-Corporation</option>
                <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
                <option value="Partnership">Partnership</option>
                <option value="Trust">Trust</option>
                <option value="Foreign Entity">Foreign Entity</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientAddress">Recipient Address</label>
              <input
                type="text"
                id="recipientAddress"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleChange}
                placeholder="456 Crypto Lane, New York, NY 10001"
              />
            </div>
            
            <h2>Token Details</h2>
            <div className="form-group">
              <label htmlFor="tokenName">Token Name</label>
              <input
                type="text"
                id="tokenName"
                name="tokenName"
                value={formData.tokenName}
                onChange={handleChange}
                placeholder="AcmeCoin"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tokenSymbol">Token Symbol</label>
              <input
                type="text"
                id="tokenSymbol"
                name="tokenSymbol"
                value={formData.tokenSymbol}
                onChange={handleChange}
                placeholder="ACM"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tokenBlockchain">Blockchain</label>
              <select
                id="tokenBlockchain"
                name="tokenBlockchain"
                value={formData.tokenBlockchain}
                onChange={handleChange}
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Binance Smart Chain">Binance Smart Chain</option>
                <option value="Polygon">Polygon</option>
                <option value="Solana">Solana</option>
                <option value="Avalanche">Avalanche</option>
                <option value="Arbitrum">Arbitrum</option>
                <option value="Optimism">Optimism</option>
                <option value="Base">Base</option>
                <option value="Near">Near</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="tokenType">Token Type</label>
              <select
                id="tokenType"
                name="tokenType"
                value={formData.tokenType}
                onChange={handleChange}
              >
                <option value="ERC-20">ERC-20</option>
                <option value="ERC-721">ERC-721 (NFT)</option>
                <option value="ERC-1155">ERC-1155</option>
                <option value="BEP-20">BEP-20</option>
                <option value="SPL">SPL</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="tokenStandard">Token Classification</label>
              <select
                id="tokenStandard"
                name="tokenStandard"
                value={formData.tokenStandard}
                onChange={handleChange}
              >
                <option value="Utility Token">Utility Token</option>
                <option value="Security Token">Security Token</option>
                <option value="Governance Token">Governance Token</option>
                <option value="Payment Token">Payment Token</option>
                <option value="Non-Fungible Token">Non-Fungible Token</option>
                <option value="Stablecoin">Stablecoin</option>
              </select>
            </div>
            
            <div className="info-text">
              <p><strong>Note:</strong> The token classification may have significant legal implications. Consult with legal counsel to ensure compliance with applicable securities laws.</p>
            </div>
          </div>
        );
        
      case 1: // Distribution Terms
        return (
          <div className="form-section">
            <h2>Distribution Terms</h2>
            
            <div className="form-group">
              <label htmlFor="tokenAmount">Number of Tokens to Distribute</label>
              <input
                type="number"
                id="tokenAmount"
                name="tokenAmount"
                value={formData.tokenAmount}
                onChange={handleChange}
                placeholder="100000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tokenPrice">Price Per Token</label>
              <input
                type="number"
                id="tokenPrice"
                name="tokenPrice"
                value={formData.tokenPrice}
                onChange={handleChange}
                placeholder="0.10"
                step="0.0001"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="totalConsideration">Total Consideration (Optional, calculated if not provided)</label>
              <input
                type="text"
                id="totalConsideration"
                name="totalConsideration"
                value={formData.totalConsideration}
                onChange={handleChange}
                placeholder={`${(parseFloat(formData.tokenPrice || 0) * parseFloat(formData.tokenAmount || 0)).toFixed(2)}`}
              />
              <div className="form-note">If left blank, will be calculated as Price Per Token × Number of Tokens</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="EUR">EUR</option>
                <option value="Service Value">Service Value</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="distributionDate">Distribution Date</label>
              <input
                type="date"
                id="distributionDate"
                name="distributionDate"
                value={formData.distributionDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="distributionMethod">Distribution Method</label>
              <select
                id="distributionMethod"
                name="distributionMethod"
                value={formData.distributionMethod}
                onChange={handleChange}
              >
                <option value="Direct Transfer">Direct Transfer</option>
                <option value="Airdrop">Airdrop</option>
                <option value="Smart Contract">Smart Contract</option>
                <option value="Vesting Contract">Vesting Contract</option>
                <option value="Escrow Service">Escrow Service</option>
              </select>
            </div>
            
            <div className="warning-text">
              <p><strong>Important:</strong> Ensure that your token distribution complies with all applicable securities laws, including registration requirements or exemptions under the Securities Act of 1933 and state securities laws.</p>
            </div>
          </div>
        );
        
      case 2: // Vesting Schedule
        return (
          <div className="form-section">
            <h2>Vesting Schedule</h2>
            
            <div className="form-group">
              <label>Enable Vesting Schedule?</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="vestingYes"
                    name="hasVesting"
                    value="yes"
                    checked={formData.hasVesting === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="vestingYes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="vestingNo"
                    name="hasVesting"
                    value="no"
                    checked={formData.hasVesting === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="vestingNo">No - Tokens vest immediately</label>
                </div>
              </div>
            </div>
            
            {formData.hasVesting === 'yes' && (
              <>
                <div className="form-group">
                  <label htmlFor="initialReleasePercentage">Initial Release Percentage</label>
                  <input
                    type="number"
                    id="initialReleasePercentage"
                    name="initialReleasePercentage"
                    value={formData.initialReleasePercentage}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <div className="form-note">Percentage of tokens released immediately, with remainder subject to vesting</div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cliffPeriod">Cliff Period</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      id="cliffPeriod"
                      name="cliffPeriod"
                      value={formData.cliffPeriod}
                      onChange={handleChange}
                      placeholder="12"
                      style={{ flex: '1' }}
                    />
                    <select
                      id="cliffUnit"
                      name="cliffUnit"
                      value={formData.cliffUnit}
                      onChange={handleChange}
                      style={{ flex: '1' }}
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  <div className="form-note">Period before any tokens start vesting</div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="vestingPeriod">Total Vesting Period</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      id="vestingPeriod"
                      name="vestingPeriod"
                      value={formData.vestingPeriod}
                      onChange={handleChange}
                      placeholder="48"
                      style={{ flex: '1' }}
                    />
                    <select
                      id="vestingUnit"
                      name="vestingUnit"
                      value={formData.vestingUnit}
                      onChange={handleChange}
                      style={{ flex: '1' }}
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  <div className="form-note">Total period for all tokens to vest (including cliff period)</div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="vestingType">Vesting Type</label>
                  <select
                    id="vestingType"
                    name="vestingType"
                    value={formData.vestingType}
                    onChange={handleChange}
                  >
                    <option value="Linear">Linear (equal monthly installments)</option>
                    <option value="Milestone">Milestone-based</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Acceleration on Change of Control</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="accelerationOnChange"
                      name="accelerationOnChange"
                      checked={formData.accelerationOnChange}
                      onChange={handleChange}
                    />
                    <label htmlFor="accelerationOnChange">Accelerate vesting upon Change of Control</label>
                  </div>
                </div>
                
                <div className="info-text">
                  <p><strong>Vesting Best Practices:</strong> Standard industry practice for advisors and team members often follows a 4-year vesting schedule with a 1-year cliff. For investors, vesting periods are typically shorter or may not apply depending on the investment terms.</p>
                </div>
              </>
            )}
          </div>
        );
        
      case 3: // Lock-up Period
        return (
          <div className="form-section">
            <h2>Lock-up Period</h2>
            
            <div className="form-group">
              <label>Enable Lock-up Period?</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="lockupYes"
                    name="hasLockup"
                    value="yes"
                    checked={formData.hasLockup === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="lockupYes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="lockupNo"
                    name="hasLockup"
                    value="no"
                    checked={formData.hasLockup === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="lockupNo">No - No transfer restrictions</label>
                </div>
              </div>
            </div>
            
            {formData.hasLockup === 'yes' && (
              <>
                <div className="form-group">
                  <label htmlFor="lockupPeriod">Lock-up Period Duration</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      id="lockupPeriod"
                      name="lockupPeriod"
                      value={formData.lockupPeriod}
                      onChange={handleChange}
                      placeholder="12"
                      style={{ flex: '1' }}
                    />
                    <select
                      id="lockupUnit"
                      name="lockupUnit"
                      value={formData.lockupUnit}
                      onChange={handleChange}
                      style={{ flex: '1' }}
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  <div className="form-note">Period during which tokens cannot be transferred</div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="earlyReleaseConditions">Early Release Conditions</label>
                  <select
                    id="earlyReleaseConditions"
                    name="earlyReleaseConditions"
                    value={formData.earlyReleaseConditions}
                    onChange={handleChange}
                  >
                    <option value="None">None</option>
                    <option value="transfers to immediate family members or for estate planning purposes">Transfers to immediate family members or for estate planning purposes</option>
                    <option value="transfers to entities wholly owned by the Recipient">Transfers to entities wholly owned by the Recipient</option>
                    <option value="transfers to affiliates of the Recipient">Transfers to affiliates of the Recipient</option>
                    <option value="transfers in connection with a token listing on a major exchange">Transfers in connection with a token listing on a major exchange</option>
                  </select>
                </div>
                
                <div className="info-text">
                  <p><strong>Lock-up vs. Vesting:</strong> While vesting determines when tokens are earned, lock-up restricts the ability to transfer tokens even after they have vested. Lock-up periods are common in token sales to prevent immediate selling pressure.</p>
                </div>
                
                <div className="warning-text">
                  <p><strong>Warning:</strong> To enforce lock-up provisions, ensure that proper technical controls are implemented in the smart contract or that the tokens are held in escrow during the lock-up period.</p>
                </div>
              </>
            )}
          </div>
        );
        
      case 4: // Rights & Restrictions
        return (
          <div className="form-section">
            <h2>Rights & Restrictions</h2>
            
            <div className="form-group">
              <label htmlFor="votingRights">Voting Rights</label>
              <select
                id="votingRights"
                name="votingRights"
                value={formData.votingRights}
                onChange={handleChange}
              >
                <option value="No">No voting rights</option>
                <option value="Yes">Yes, token grants governance rights</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dividendRights">Dividend/Distribution Rights</label>
              <select
                id="dividendRights"
                name="dividendRights"
                value={formData.dividendRights}
                onChange={handleChange}
              >
                <option value="No">No dividend rights</option>
                <option value="Yes">Yes, token grants dividend/distribution rights</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Transfer Restrictions</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="transferRestrictionsYes"
                    name="transferRestrictions"
                    value="yes"
                    checked={formData.transferRestrictions === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="transferRestrictionsYes">Yes - Include prohibited transfer clauses</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="transferRestrictionsNo"
                    name="transferRestrictions"
                    value="no"
                    checked={formData.transferRestrictions === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="transferRestrictionsNo">No - Tokens freely transferable</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Right of First Refusal</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="rofrYes"
                    name="rightOfFirstRefusal"
                    value="yes"
                    checked={formData.rightOfFirstRefusal === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="rofrYes">Yes - Company has right to purchase tokens first</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="rofrNo"
                    name="rightOfFirstRefusal"
                    value="no"
                    checked={formData.rightOfFirstRefusal === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="rofrNo">No - No company preference for token sales</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Drag-Along Rights</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="dragAlongYes"
                    name="dragAlongRights"
                    value="yes"
                    checked={formData.dragAlongRights === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="dragAlongYes">Yes - Majority token holders can force sale</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="dragAlongNo"
                    name="dragAlongRights"
                    value="no"
                    checked={formData.dragAlongRights === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="dragAlongNo">No - No drag-along rights</label>
                </div>
              </div>
            </div>
            
            <div className="warning-text">
              <p><strong>Security Classification Risk:</strong> Certain rights, particularly voting rights and dividend/distribution rights, may increase the likelihood that your token will be classified as a security by regulatory authorities. Consult with legal counsel regarding the implications.</p>
            </div>
          </div>
        );
        
      case 5: // Additional Terms
        return (
          <div className="form-section">
            <h2>Additional Terms</h2>
            
            <div className="form-group">
              <label>Confidentiality Clause</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="confidentialityYes"
                    name="confidentialityClause"
                    value="yes"
                    checked={formData.confidentialityClause === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="confidentialityYes">Yes - Include confidentiality provisions</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="confidentialityNo"
                    name="confidentialityClause"
                    value="no"
                    checked={formData.confidentialityClause === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="confidentialityNo">No - No confidentiality restrictions</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="disputeResolution">Dispute Resolution</label>
              <select
                id="disputeResolution"
                name="disputeResolution"
                value={formData.disputeResolution}
                onChange={handleChange}
              >
                <option value="Arbitration">Arbitration</option>
                <option value="Litigation">Litigation (Court Proceedings)</option>
                <option value="Mediation">Mediation then Arbitration</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law</label>
              <select
                id="governingLaw"
                name="governingLaw"
                value={formData.governingLaw}
                onChange={handleChange}
              >
                <option value="Delaware">Delaware</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Wyoming">Wyoming</option>
                <option value="Texas">Texas</option>
                <option value="Nevada">Nevada</option>
                <option value="Colorado">Colorado</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="terminationRights">Termination Rights</label>
              <select
                id="terminationRights"
                name="terminationRights"
                value={formData.terminationRights}
                onChange={handleChange}
              >
                <option value="Standard">Standard (mutual consent, material breach, automatic)</option>
                <option value="Limited">Limited (mutual consent only)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Anti-Dilution Protection</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="antiDilutionYes"
                    name="antiDilutionProtection"
                    value="yes"
                    checked={formData.antiDilutionProtection === 'yes'}
                    onChange={handleChange}
                  />
                  <label htmlFor="antiDilutionYes">Yes - Protect against future dilution</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="antiDilutionNo"
                    name="antiDilutionProtection"
                    value="no"
                    checked={formData.antiDilutionProtection === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="antiDilutionNo">No - No anti-dilution protection</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="fileName">Document Filename</label>
              <input
                type="text"
                id="fileName"
                name="fileName"
                value={formData.fileName}
                onChange={handleChange}
                placeholder="Token-Distribution-Agreement"
              />
            </div>
            
            <div className="info-text">
              <p><strong>Jurisdiction Selection:</strong> The choice of governing law can significantly impact the interpretation and enforcement of the agreement. Delaware is often chosen for its well-developed business law, but consider the jurisdiction where your company is incorporated or where most of your operations are based.</p>
            </div>
          </div>
        );
        
      case 6: // Review & Finalize
        return (
          <div className="form-section">
            <h2>Review & Finalize</h2>
            
            {validationErrors.length > 0 && (
              <div className="risk-card risk-high">
                <div className="risk-header">
                  <Icon name="alert-triangle" />
                  <span>Required Information Missing</span>
                </div>
                <div className="risk-body">
                  <p>The following information is missing or incomplete:</p>
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {validationErrors.filter(e => e.type === 'error').map((error, index) => (
                      <li key={index}>
                        {error.message} - <a href="#" onClick={(e) => { e.preventDefault(); goToTab(error.tab); }}>(Go to section)</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {validationErrors.filter(e => e.type === 'warning').length > 0 && (
              <div className="risk-card risk-medium">
                <div className="risk-header">
                  <Icon name="alert-circle" />
                  <span>Recommended Information Missing</span>
                </div>
                <div className="risk-body">
                  <p>The following recommended information is missing:</p>
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {validationErrors.filter(e => e.type === 'warning').map((error, index) => (
                      <li key={index}>
                        {error.message} - <a href="#" onClick={(e) => { e.preventDefault(); goToTab(error.tab); }}>(Go to section)</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Security Token Risk */}
            <div className="risk-card risk-high">
              <div className="risk-header">
                <Icon name="alert-triangle" />
                <span>Potential Securities Law Implications</span>
              </div>
              <div className="risk-body">
                <p>Your token has the following characteristics that may increase the risk of being classified as a security:</p>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {formData.tokenStandard === 'Security Token' && (
                    <li>Token is explicitly classified as a Security Token</li>
                  )}
                  {formData.votingRights === 'Yes' && (
                    <li>Token grants voting rights</li>
                  )}
                  {formData.dividendRights === 'Yes' && (
                    <li>Token grants dividend or distribution rights</li>
                  )}
                  {formData.antiDilutionProtection === 'yes' && (
                    <li>Token includes anti-dilution protection</li>
                  )}
                </ul>
                <p style={{ marginTop: '10px' }}>Consult with qualified legal counsel to ensure compliance with securities regulations in all relevant jurisdictions. Consider whether you may need to register your offering or qualify for an exemption.</p>
              </div>
            </div>
            
            {/* Vesting/Lockup Risk */}
            <div className="risk-card risk-medium">
              <div className="risk-header">
                <Icon name="alert-circle" />
                <span>Vesting and Lock-up Implementation</span>
              </div>
              <div className="risk-body">
                <p>You have selected the following vesting and lock-up terms:</p>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {formData.hasVesting === 'yes' ? (
                    <li>Vesting: {formData.vestingPeriod} {formData.vestingUnit} vesting period with {formData.cliffPeriod} {formData.cliffUnit} cliff</li>
                  ) : (
                    <li>No vesting period (tokens vest immediately)</li>
                  )}
                  {formData.hasLockup === 'yes' ? (
                    <li>Lock-up: {formData.lockupPeriod} {formData.lockupUnit} lock-up period</li>
                  ) : (
                    <li>No lock-up period (tokens can be transferred immediately)</li>
                  )}
                </ul>
                <p style={{ marginTop: '10px' }}>Ensure that appropriate technical mechanisms are in place to enforce these restrictions. This may include:</p>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <li>A vesting smart contract that releases tokens according to the schedule</li>
                  <li>Token transfer restrictions at the contract level during the lock-up period</li>
                  <li>Escrow arrangements with trusted third parties</li>
                </ul>
                <p style={{ marginTop: '10px' }}>Without technical enforcement, these restrictions may be difficult to enforce legally.</p>
              </div>
            </div>
            
            {/* Token Classification Risk */}
            <div className="risk-card risk-low">
              <div className="risk-header">
                <Icon name="check-circle" />
                <span>Next Steps</span>
              </div>
              <div className="risk-body">
                <p>Before finalizing this agreement, consider the following next steps:</p>
                <ol style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <li>Have the agreement reviewed by qualified legal counsel</li>
                  <li>Ensure that your token smart contract aligns with the terms in this agreement</li>
                  <li>Consider whether your token distribution requires additional documentation, such as a SAFT (Simple Agreement for Future Tokens) or PPM (Private Placement Memorandum)</li>
                  <li>Document KYC/AML procedures for token recipients if applicable</li>
                  <li>Schedule a consultation with a blockchain attorney to review compliance requirements</li>
                </ol>
                <p style={{ marginTop: '10px' }}>This generated agreement is a starting point and may require customization based on your specific situation.</p>
                <div style={{ marginTop: '15px' }}>
                  <a href="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1" target="_blank" style={{ color: '#4f46e5', textDecoration: 'underline', fontWeight: 'bold' }}>Schedule a consultation with a blockchain attorney</a>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>Token Distribution Agreement Generator</h1>
        <p>Create a customized agreement for distributing utility or equity-like tokens with vesting and lock-up provisions</p>
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
      
      <div className="tab-content">
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
          <Icon name="chevron-left" style={{marginRight: "0.25rem"}} />
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
          <Icon name="copy" style={{marginRight: "0.25rem"}} />
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
          <Icon name="file-text" style={{marginRight: "0.25rem"}} />
          Download MS Word
        </button>
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <Icon name="chevron-right" style={{marginLeft: "0.25rem"}} />
        </button>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<TokenDistributionGenerator />, document.getElementById('root'));