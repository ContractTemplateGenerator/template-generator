// Strategic NDA Generator - Based on lessons from Stormy Daniels NDA case
// Author: Sergei Tokmakov - California Attorney (CA Bar #279869)

// Icons component for Feather icons integration with React
const Icon = ({ name, className = "" }) => {
  const iconRef = React.useRef(null);
  
  React.useEffect(() => {
    if (iconRef.current) {
      feather.replace();
    }
  }, []);

  return <i ref={iconRef} data-feather={name} className={className}></i>;
};

// Tooltip component for displaying helpful information
const Tooltip = ({ text, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-text">{text}</div>
    </div>
  );
};

// Main NDA Generator component
const StrategicNDAGenerator = () => {
  // State for form values
  const [formData, setFormData] = React.useState({
    // Parties
    disclosingPartyType: 'individual',
    disclosingPartyName: '',
    disclosingPartyAddress: '',
    disclosingPartyEmail: '',
    receivingPartyType: 'individual',
    receivingPartyName: '',
    receivingPartyAddress: '',
    receivingPartyEmail: '',
    
    // Pseudonyms
    usePseudonyms: false,
    disclosingPartyPseudonym: '',
    receivingPartyPseudonym: '',
    
    // Agreement Details
    effectiveDate: '',
    state: 'California',
    term: '2',
    termUnit: 'years',
    
    // Purpose and Consideration
    purpose: '',
    monetaryConsideration: false,
    considerationAmount: '',
    
    // Confidentiality
    confidentialInfoType: 'business',
    includeTradeSecrets: true,
    includeBusinessPlans: true,
    includeCustomerInfo: true,
    includeFinancialInfo: true,
    includeTechnicalInfo: true,
    includeCustomInfo: false,
    customConfidentialInfo: '',
    
    // Personal Information Types
    includeIdentityInfo: true,
    includeContactInfo: true,
    includeFinancialPersonalInfo: true,
    includeHealthInfo: true,
    includeRelationshipInfo: true,
    includeCorrespondenceInfo: true,
    includeCustomPersonalInfo: false,
    customPersonalInfo: '',
    
    // Exclusions
    publicDomainExclusion: true,
    independentDevelopmentExclusion: true,
    rightfulPossessionExclusion: true,
    
    // Legal Carveouts
    includeCourtOrderCarveout: true,
    includeWhistleblowerCarveout: true,
    includeGovInvestigationCarveout: true,
    
    // Obligations
    returnDocuments: true,
    nonUse: true,
    nonDisclosure: true,
    
    // Remedies
    injunctiveRelief: true,
    monetaryDamages: true,
    liquidatedDamages: false,
    liquidatedDamagesAmount: '',
    
    // Dispute Resolution
    disputeResolution: 'litigation',
    arbitrationProvider: 'JAMS',
    arbitrationLocation: '',
    arbitrationCounty: '',
    
    // Miscellaneous
    attorneyFees: true,
    severability: true,
    entireAgreement: true,
    amendment: true,
    waiver: true,
    governing: true
  });
  
  // State for current tab
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // State to track what text was last changed (for highlighting)
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);
  
  // Tabs configuration
  const tabs = [
    { id: 'parties', label: 'Parties' },
    { id: 'agreement', label: 'Agreement Details' },
    { id: 'confidential', label: 'Confidential Info' },
    { id: 'obligations', label: 'Obligations' },
    { id: 'remedies', label: 'Remedies' },
    { id: 'disputes', label: 'Dispute Resolution' },
    { id: 'misc', label: 'Miscellaneous' }
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
    
    // If monetary consideration is turned off, clear the amount
    if (name === 'monetaryConsideration' && !checked) {
      setFormData(prev => ({ ...prev, considerationAmount: '' }));
    }
    
    // If liquidated damages is turned off, clear the amount
    if (name === 'liquidatedDamages' && !checked) {
      setFormData(prev => ({ ...prev, liquidatedDamagesAmount: '' }));
    }
  };
  
  // Move to next tab
  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };
  
  // Move to previous tab
  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };
  
  // Jump to specific tab
  const goToTab = (index) => {
    setCurrentTab(index);
  };

  // Copy NDA text to clipboard
  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = ndaText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("NDA text copied to clipboard!");
  };
  
  // Download NDA as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Make sure NDA text is available
      if (!ndaText) {
        console.error("NDA text is empty");
        alert("Cannot generate document - NDA text is empty. Please check the form data.");
        return;
      }
      
      // Check if the function is available on window
      if (typeof window.generateWordDoc === 'function') {
        console.log("Calling generateWordDoc function");
        window.generateWordDoc(ndaText, formData);
      } else {
        console.error("generateWordDoc function not found");
        alert("Word document generation is not available. Please try using the copy option instead.");
      }
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Function to get disclosing party display name
  const getDisclosingPartyName = () => {
    if (formData.usePseudonyms && formData.disclosingPartyPseudonym) {
      return formData.disclosingPartyPseudonym;
    }
    return formData.disclosingPartyName;
  };
  
  // Function to get receiving party display name
  const getReceivingPartyName = () => {
    if (formData.usePseudonyms && formData.receivingPartyPseudonym) {
      return formData.receivingPartyPseudonym;
    }
    return formData.receivingPartyName;
  };
  
  // Function to generate NDA text
  const generateNDA = () => {
    const dp = getDisclosingPartyName();
    const rp = getReceivingPartyName();
    
    // Generate NDA sections
    const ndaSections = {
      // Title section
      title: `<center><strong>MUTUAL NON-DISCLOSURE AGREEMENT</strong></center>`,
      
      // Introduction
      introduction: `This Non-Disclosure Agreement (the "Agreement") is entered into as of ${formData.effectiveDate} (the "Effective Date") by and between:

${formData.usePseudonyms ? 
  `${formData.disclosingPartyPseudonym || 'DISCLOSING PARTY'}, ${formData.disclosingPartyType === 'individual' ? 'an individual' : `a ${formData.state} ${formData.disclosingPartyType}`}` : 
  `${formData.disclosingPartyType === 'individual' ? 
    `${formData.disclosingPartyName}, an individual with an address at ${formData.disclosingPartyAddress}` : 
    `${formData.disclosingPartyName}, a ${formData.state} ${formData.disclosingPartyType} with its principal address at ${formData.disclosingPartyAddress}`}`}

and

${formData.usePseudonyms ? 
  `${formData.receivingPartyPseudonym || 'RECEIVING PARTY'}, ${formData.receivingPartyType === 'individual' ? 'an individual' : `a ${formData.state} ${formData.receivingPartyType}`}` : 
  `${formData.receivingPartyType === 'individual' ? 
    `${formData.receivingPartyName}, an individual with an address at ${formData.receivingPartyAddress}` : 
    `${formData.receivingPartyName}, a ${formData.state} ${formData.receivingPartyType} with its principal address at ${formData.receivingPartyAddress}`}`}`,

      // Recitals
      recitals: `WHEREAS, the parties wish to explore ${formData.purpose || "a potential business relationship"} (the "Purpose"); and

WHEREAS, in connection with the Purpose, each party may disclose to the other certain confidential and proprietary information, and the parties wish to protect such information in accordance with this Agreement.

NOW, THEREFORE, in consideration of ${formData.monetaryConsideration ? `the payment of $${formData.considerationAmount} and ` : ''}the mutual promises and covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:`,

      // Pseudonym declaration (if applicable)
      pseudonymDeclaration: formData.usePseudonyms ? 
      `<strong>1. IDENTITY OF PARTIES.</strong>
      
This Agreement involves the use of pseudonyms for privacy purposes only. The true identities of the parties are as stated in the preamble of this Agreement and are fully known to both parties. The use of pseudonyms is not intended to obscure legal responsibility or liability under this Agreement. Both parties acknowledge they are entering into this Agreement with full knowledge of the other party's identity, notwithstanding the use of pseudonyms for convenience.` : '',

      // Definition of Confidential Information
      definitionOfConfidentialInfo: `<strong>${formData.usePseudonyms ? '2' : '1'}. DEFINITION OF CONFIDENTIAL INFORMATION.</strong>

"Confidential Information" means any non-public information that relates to the ${formData.confidentialInfoType === 'business' ? 'business, technical, or financial affairs' : 'personal affairs or private matters'} of either party (the "Disclosing Party") which is disclosed to the other party (the "Receiving Party"), either directly or indirectly, in writing, orally or by inspection of tangible objects${(formData.confidentialInfoType === 'business' || formData.confidentialInfoType === 'personal') ? ', including without limitation:' : '.'} 
${formData.confidentialInfoType === 'business' ? `
${formData.includeTradeSecrets ? '(a) trade secrets, inventions, ideas, processes, formulas, source and object codes, data, programs, other works of authorship, know-how, improvements, discoveries, developments, designs and techniques;' : ''}
${formData.includeBusinessPlans ? `${formData.includeTradeSecrets ? '(b)' : '(a)'} business plans, marketing plans, financials, forecasts, personnel information, and strategic information;` : ''}
${formData.includeCustomerInfo ? `${formData.includeTradeSecrets || formData.includeBusinessPlans ? (formData.includeTradeSecrets && formData.includeBusinessPlans ? '(c)' : '(b)') : '(a)'} customer lists, customer data, and customer information;` : ''}
${formData.includeFinancialInfo ? `${['(a)', '(b)', '(c)', '(d)'][([formData.includeTradeSecrets, formData.includeBusinessPlans, formData.includeCustomerInfo].filter(Boolean).length)]}`+ ' financial information and pricing;' : ''}
${formData.includeTechnicalInfo ? `${['(a)', '(b)', '(c)', '(d)', '(e)'][([formData.includeTradeSecrets, formData.includeBusinessPlans, formData.includeCustomerInfo, formData.includeFinancialInfo].filter(Boolean).length)]}`+ ' technical information, specifications, designs, and prototypes;' : ''}
${formData.includeCustomInfo ? `${['(a)', '(b)', '(c)', '(d)', '(e)', '(f)'][([formData.includeTradeSecrets, formData.includeBusinessPlans, formData.includeCustomerInfo, formData.includeFinancialInfo, formData.includeTechnicalInfo].filter(Boolean).length)]}`+ ` ${formData.customConfidentialInfo};` : ''}` : ''}
${formData.confidentialInfoType === 'personal' ? `
${formData.includeIdentityInfo ? '(a) identity information, including but not limited to names, dates of birth, and personal identification numbers or documents;' : ''}
${formData.includeContactInfo ? `${formData.includeIdentityInfo ? '(b)' : '(a)'} contact information, including but not limited to addresses, phone numbers, email addresses, and social media handles;` : ''}
${formData.includeFinancialPersonalInfo ? `${['(a)', '(b)', '(c)'][([formData.includeIdentityInfo, formData.includeContactInfo].filter(Boolean).length)]}`+ ' financial information, including but not limited to bank account details, credit card information, income data, and transaction history;' : ''}
${formData.includeHealthInfo ? `${['(a)', '(b)', '(c)', '(d)'][([formData.includeIdentityInfo, formData.includeContactInfo, formData.includeFinancialPersonalInfo].filter(Boolean).length)]}`+ ' health and medical information, including but not limited to medical history, conditions, treatments, and insurance information;' : ''}
${formData.includeRelationshipInfo ? `${['(a)', '(b)', '(c)', '(d)', '(e)'][([formData.includeIdentityInfo, formData.includeContactInfo, formData.includeFinancialPersonalInfo, formData.includeHealthInfo].filter(Boolean).length)]}`+ ' relationship and personal life details, including but not limited to marital status, family information, and lifestyle information;' : ''}
${formData.includeCorrespondenceInfo ? `${['(a)', '(b)', '(c)', '(d)', '(e)', '(f)'][([formData.includeIdentityInfo, formData.includeContactInfo, formData.includeFinancialPersonalInfo, formData.includeHealthInfo, formData.includeRelationshipInfo].filter(Boolean).length)]}`+ ' communications and correspondence, including but not limited to emails, text messages, and any other personal written or recorded communications;' : ''}
${formData.includeCustomPersonalInfo ? `${['(a)', '(b)', '(c)', '(d)', '(e)', '(f)', '(g)'][([formData.includeIdentityInfo, formData.includeContactInfo, formData.includeFinancialPersonalInfo, formData.includeHealthInfo, formData.includeRelationshipInfo, formData.includeCorrespondenceInfo].filter(Boolean).length)]}`+ ` ${formData.customPersonalInfo};` : ''}` : ''}`,

      // Exclusions
      exclusions: `<strong>${formData.usePseudonyms ? '3' : '2'}. EXCLUSIONS FROM CONFIDENTIAL INFORMATION.</strong>

Confidential Information shall not include any information that: 
${formData.publicDomainExclusion ? '(a) is or becomes generally available to the public through no fault of the Receiving Party;' : ''}
${formData.independentDevelopmentExclusion ? `${formData.publicDomainExclusion ? '(b)' : '(a)'} is or becomes known to the Receiving Party on a non-confidential basis through a third party who is not bound by an obligation of confidentiality with respect to such information or is independently developed by the Receiving Party without reference to the Disclosing Party's Confidential Information;` : ''}
${formData.rightfulPossessionExclusion ? `${['(a)', '(b)', '(c)'][([formData.publicDomainExclusion, formData.independentDevelopmentExclusion].filter(Boolean).length)]}`+ ' was in the Receiving Party\'s rightful possession prior to receiving it from the Disclosing Party;' : ''}`,

      // Obligations
      obligations: `<strong>${formData.usePseudonyms ? '4' : '3'}. OBLIGATIONS OF RECEIVING PARTY.</strong>

The Receiving Party shall:
${formData.nonDisclosure ? `(a) maintain the confidentiality of the Disclosing Party's Confidential Information with at least the same degree of care that it uses to protect its own confidential information, but in no case less than reasonable care;

(b) not disclose any Confidential Information to any person or entity other than employees and contractors of the Receiving Party who have a need to know and who are bound by confidentiality obligations at least as restrictive as those contained herein;` : ''}

${formData.nonUse ? `${formData.nonDisclosure ? '(c)' : '(a)'} not use the Disclosing Party's Confidential Information for any purpose outside the scope of the Purpose without the prior written consent of the Disclosing Party;` : ''}

${formData.returnDocuments ? `${['(a)', '(b)', '(c)', '(d)'][([formData.nonDisclosure && true, formData.nonDisclosure && true, formData.nonUse].filter(Boolean).length)]}`+ ' upon the termination or completion of the Purpose, or upon the Disclosing Party\'s request, promptly return or destroy all Confidential Information and any copies, notes, or other materials incorporating such Confidential Information (and confirm such destruction in writing if requested).' : ''}`,

      // Permitted Disclosures (Carveouts)
      permittedDisclosures: `<strong>${formData.usePseudonyms ? '5' : '4'}. PERMITTED DISCLOSURES.</strong>

Notwithstanding any other provisions of this Agreement:

${formData.includeCourtOrderCarveout ? `(a) The Receiving Party may disclose Confidential Information to the extent required by an order of a court or other governmental authority having competent jurisdiction, provided that the Receiving Party gives the Disclosing Party prior written notice (to the extent legally permitted) and reasonable assistance, so that the Disclosing Party may seek a protective order or other appropriate remedy.` : ''}

${formData.includeWhistleblowerCarveout ? `${formData.includeCourtOrderCarveout ? '(b)' : '(a)'} Nothing in this Agreement prohibits either party from reporting possible violations of law or regulation to any governmental agency or entity, or making other disclosures that are protected under applicable whistleblower provisions of federal, state, or local law or regulation.` : ''}

${formData.includeGovInvestigationCarveout ? `${['(a)', '(b)', '(c)'][([formData.includeCourtOrderCarveout, formData.includeWhistleblowerCarveout].filter(Boolean).length)]}`+ ' Nothing in this Agreement shall prevent any party from providing information to or testifying before any governmental investigative agency or legislative body, whether in response to a subpoena or otherwise.' : ''}

This Agreement does not limit either party's right to disclose information relating to this Agreement or the Purpose to its attorneys, accountants, and other advisors bound by professional obligations of confidentiality.`,

      // Term
      term: `<strong>${formData.usePseudonyms ? '6' : '5'}. TERM.</strong>

This Agreement shall commence on the Effective Date and remain in effect for a period of ${formData.term} ${formData.termUnit} thereafter (the "Term"). The confidentiality obligations set forth in this Agreement shall survive the expiration or termination of this Agreement for a period of ${formData.term} ${formData.termUnit} from the date of such expiration or termination.`,

      // Remedies
      remedies: `<strong>${formData.usePseudonyms ? '7' : '6'}. REMEDIES.</strong>

${formData.injunctiveRelief ? `The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages may not be an adequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Disclosing Party shall be entitled to seek injunctive relief to enforce the terms of this Agreement.` : ''}

${formData.monetaryDamages ? `${formData.injunctiveRelief ? '\n\n' : ''}The Disclosing Party shall be entitled to recover from the Receiving Party all damages, costs, and expenses, including reasonable attorneys' fees, incurred as a result of any breach of this Agreement.` : ''}

${formData.liquidatedDamages ? `${(formData.injunctiveRelief || formData.monetaryDamages) ? '\n\n' : ''}In the event of a breach of this Agreement, the breaching party shall pay to the non-breaching party, as liquidated damages and not as a penalty, the sum of $${formData.liquidatedDamagesAmount} per breach. The parties acknowledge that the harm caused by a breach of this Agreement would be difficult to ascertain precisely and that this amount represents a reasonable estimation of the harm that would be caused.` : ''}`,

      // Dispute Resolution
      disputeResolution: `<strong>${formData.usePseudonyms ? '8' : '7'}. DISPUTE RESOLUTION.</strong>

${formData.disputeResolution === 'litigation' ? 
  `Any dispute arising out of or relating to this Agreement shall be resolved through proceedings filed in the appropriate state or federal courts located in ${formData.arbitrationCounty ? `${formData.arbitrationCounty} County, ${formData.state}` : formData.state}. Each party hereby irrevocably submits to the jurisdiction of such courts.` 
: 
  `Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration administered by ${formData.arbitrationProvider} in accordance with its then-current arbitration rules. The arbitration shall be conducted by a single arbitrator, and shall take place in ${formData.arbitrationLocation ? formData.arbitrationLocation : `${formData.arbitrationCounty} County, ${formData.state}`}. The decision of the arbitrator shall be final and binding, and judgment on the award may be entered in any court having jurisdiction. Each party shall bear its own costs in the arbitration, and shall share equally the costs of the arbitrator and the arbitration facilities.`
}`,

      // Miscellaneous
      miscellaneous: `<strong>${formData.usePseudonyms ? '9' : '8'}. MISCELLANEOUS.</strong>

${formData.governing ? `(a) Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.state}, without regard to conflicts of law principles.

` : ''}${formData.entireAgreement ? `${formData.governing ? '(b)' : '(a)'} Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written.

` : ''}${formData.amendment ? `${['(a)', '(b)', '(c)'][([formData.governing, formData.entireAgreement].filter(Boolean).length)]} Amendment. This Agreement may only be amended or modified by a written instrument executed by both parties.

` : ''}${formData.waiver ? `${['(a)', '(b)', '(c)', '(d)'][([formData.governing, formData.entireAgreement, formData.amendment].filter(Boolean).length)]} No Waiver. No waiver of any provision of this Agreement, or any rights or obligations of either party under this Agreement, shall be effective except pursuant to a written instrument signed by the party waiving compliance. The failure of either party to enforce any of the provisions of this Agreement, unless waived in writing, shall not constitute a waiver of such provision or the right of such party thereafter to enforce such provision.

` : ''}${formData.severability ? `${['(a)', '(b)', '(c)', '(d)', '(e)'][([formData.governing, formData.entireAgreement, formData.amendment, formData.waiver].filter(Boolean).length)]} Severability. If any provision of this Agreement is found to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and effect. Any invalid, illegal, or unenforceable provision shall be deemed modified to the minimum extent necessary to make it valid, legal, and enforceable while preserving its intent.

` : ''}${formData.attorneyFees ? `${['(a)', '(b)', '(c)', '(d)', '(e)', '(f)'][([formData.governing, formData.entireAgreement, formData.amendment, formData.waiver, formData.severability].filter(Boolean).length)]} Attorneys' Fees. In any action to enforce this Agreement, the prevailing party shall be entitled to recover its costs and attorneys' fees in addition to any other relief granted.` : ''}`,

      // Signature Block
      signatureBlock: `<strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the Effective Date.

${formData.usePseudonyms ? 
  `${formData.disclosingPartyPseudonym || 'DISCLOSING PARTY'}
  
By: __________________________
${formData.disclosingPartyType !== 'individual' ? 'Name: ________________________\nTitle: _________________________' : 'Signature'}

${formData.receivingPartyPseudonym || 'RECEIVING PARTY'}

By: __________________________
${formData.receivingPartyType !== 'individual' ? 'Name: ________________________\nTitle: _________________________' : 'Signature'}` 
  : 
  `${formData.disclosingPartyName}

By: __________________________
${formData.disclosingPartyType !== 'individual' ? 'Name: ________________________\nTitle: _________________________' : 'Signature'}

${formData.receivingPartyName}

By: __________________________
${formData.receivingPartyType !== 'individual' ? 'Name: ________________________\nTitle: _________________________' : 'Signature'}`}`,

      // Side Letter (if using pseudonyms)
      sideLetter: formData.usePseudonyms ? `

\f

<center><strong>EXHIBIT A - IDENTITY CONFIRMATION LETTER</strong></center>

This Identity Confirmation Letter (the "Side Letter") is executed concurrently with the Non-Disclosure Agreement dated ${formData.effectiveDate} (the "Agreement") and incorporates the same by reference.

This Side Letter confirms that:

1. The party referred to as "${formData.disclosingPartyPseudonym || 'DISCLOSING PARTY'}" in the Agreement is ${formData.disclosingPartyName}, ${formData.disclosingPartyType === 'individual' ? `an individual with an address at ${formData.disclosingPartyAddress}` : `a ${formData.state} ${formData.disclosingPartyType} with its principal address at ${formData.disclosingPartyAddress}`}.

2. The party referred to as "${formData.receivingPartyPseudonym || 'RECEIVING PARTY'}" in the Agreement is ${formData.receivingPartyName}, ${formData.receivingPartyType === 'individual' ? `an individual with an address at ${formData.receivingPartyAddress}` : `a ${formData.state} ${formData.receivingPartyType} with its principal address at ${formData.receivingPartyAddress}`}.

Both parties acknowledge that this Side Letter must be signed by all parties to be effective, and that the use of pseudonyms in the Agreement does not reduce or limit either party's obligations or liabilities under the Agreement.

${formData.disclosingPartyName}

By: __________________________
${formData.disclosingPartyType !== 'individual' ? 'Name: ________________________\nTitle: _________________________' : 'Signature'}

${formData.receivingPartyName}

By: __________________________
${formData.receivingPartyType !== 'individual' ? 'Name: ________________________\nTitle: _________________________' : 'Signature'}` : ''
    };
    
    // Compile full NDA
    let fullNDA = `${ndaSections.title}

${ndaSections.introduction}

${ndaSections.recitals}

${formData.usePseudonyms ? ndaSections.pseudonymDeclaration + '\n\n' : ''}${ndaSections.definitionOfConfidentialInfo}

${ndaSections.exclusions}

${ndaSections.obligations}

${ndaSections.permittedDisclosures}

${ndaSections.term}

${ndaSections.remedies}

${ndaSections.disputeResolution}

${ndaSections.miscellaneous}

${ndaSections.signatureBlock}
${formData.usePseudonyms ? '\n\n' + ndaSections.sideLetter : ''}`;

    return fullNDA;
  };

  // Generate the NDA text
  const ndaText = generateNDA();
  
  // Get section that should be highlighted based on current tab
  const getSectionToHighlight = () => {
    switch (tabs[currentTab].id) {
      case 'parties':
        if (lastChanged === 'disclosingPartyName' || lastChanged === 'disclosingPartyType' || 
            lastChanged === 'disclosingPartyAddress' || lastChanged === 'receivingPartyName' || 
            lastChanged === 'receivingPartyType' || lastChanged === 'receivingPartyAddress' ||
            lastChanged === 'usePseudonyms' || lastChanged === 'disclosingPartyPseudonym' || 
            lastChanged === 'receivingPartyPseudonym') {
          return 'introduction';
        }
        return null;
      case 'agreement':
        if (lastChanged === 'effectiveDate' || lastChanged === 'purpose' || 
            lastChanged === 'monetaryConsideration' || lastChanged === 'considerationAmount') {
          return 'recitals';
        } else if (lastChanged === 'term' || lastChanged === 'termUnit') {
          return 'term';
        }
        return null;
      case 'confidential':
        if (lastChanged === 'confidentialInfoType' || lastChanged === 'includeTradeSecrets' || 
            lastChanged === 'includeBusinessPlans' || lastChanged === 'includeCustomerInfo' || 
            lastChanged === 'includeFinancialInfo' || lastChanged === 'includeTechnicalInfo' || 
            lastChanged === 'includeCustomInfo' || lastChanged === 'customConfidentialInfo' ||
            lastChanged === 'includeIdentityInfo' || lastChanged === 'includeContactInfo' ||
            lastChanged === 'includeFinancialPersonalInfo' || lastChanged === 'includeHealthInfo' ||
            lastChanged === 'includeRelationshipInfo' || lastChanged === 'includeCorrespondenceInfo' ||
            lastChanged === 'includeCustomPersonalInfo' || lastChanged === 'customPersonalInfo') {
          return 'definitionOfConfidentialInfo';
        } else if (lastChanged === 'publicDomainExclusion' || lastChanged === 'independentDevelopmentExclusion' || 
                  lastChanged === 'rightfulPossessionExclusion') {
          return 'exclusions';
        }
        return null;
      case 'obligations':
        if (lastChanged === 'nonDisclosure' || lastChanged === 'nonUse' || lastChanged === 'returnDocuments') {
          return 'obligations';
        } else if (lastChanged === 'includeCourtOrderCarveout' || lastChanged === 'includeWhistleblowerCarveout' || 
                  lastChanged === 'includeGovInvestigationCarveout') {
          return 'permittedDisclosures';
        }
        return null;
      case 'remedies':
        if (lastChanged === 'injunctiveRelief' || lastChanged === 'monetaryDamages' || 
            lastChanged === 'liquidatedDamages' || lastChanged === 'liquidatedDamagesAmount') {
          return 'remedies';
        }
        return null;
      case 'disputes':
        if (lastChanged === 'disputeResolution' || lastChanged === 'arbitrationProvider' || 
            lastChanged === 'arbitrationLocation' || lastChanged === 'arbitrationCounty') {
          return 'disputeResolution';
        }
        return null;
      case 'misc':
        if (lastChanged === 'attorneyFees' || lastChanged === 'severability' || 
            lastChanged === 'entireAgreement' || lastChanged === 'amendment' || 
            lastChanged === 'waiver' || lastChanged === 'governing') {
          return 'miscellaneous';
        }
        return null;
      default:
        return null;
    }
  };
  
  // Create a highlighted version of the NDA
  const createHighlightedNDA = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return ndaText;
    
    const sections = {
      title: /MUTUAL NON-DISCLOSURE AGREEMENT/,
      introduction: /This Non-Disclosure Agreement.*?(?=WHEREAS)/s,
      recitals: /WHEREAS.*?(?=\d\.)/s,
      pseudonymDeclaration: /1\. IDENTITY OF PARTIES.*?(?=\d\.)/s,
      definitionOfConfidentialInfo: /(?:\d)\. DEFINITION OF CONFIDENTIAL INFORMATION.*?(?=\d\.)/s,
      exclusions: /(?:\d)\. EXCLUSIONS FROM CONFIDENTIAL INFORMATION.*?(?=\d\.)/s,
      obligations: /(?:\d)\. OBLIGATIONS OF RECEIVING PARTY.*?(?=\d\.)/s,
      permittedDisclosures: /(?:\d)\. PERMITTED DISCLOSURES.*?(?=\d\.)/s,
      term: /(?:\d)\. TERM.*?(?=\d\.)/s,
      remedies: /(?:\d)\. REMEDIES.*?(?=\d\.)/s,
      disputeResolution: /(?:\d)\. DISPUTE RESOLUTION.*?(?=\d\.)/s,
      miscellaneous: /(?:\d)\. MISCELLANEOUS.*?(?=IN WITNESS WHEREOF)/s,
      signatureBlock: /IN WITNESS WHEREOF.*?(?=EXHIBIT A|$)/s,
      sideLetter: /EXHIBIT A.*?$/s
    };
    
    // Find and highlight the section
    if (sections[sectionToHighlight]) {
      return ndaText.replace(sections[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return ndaText;
  };
  
  // Create highlightable content
  const highlightedNDA = createHighlightedNDA();
  
  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedNDA]);

  // Render the component
  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Strategic NDA Generator</h1>
        <p>Create a legally sound non-disclosure agreement that avoids common pitfalls</p>
      </div>
      
      {/* Tab navigation */}
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
      
      {/* Main content area */}
      <div className="main-content">
        {/* Form Panel */}
        <div className="form-panel">
          {/* Parties Info Tab */}
          {currentTab === 0 && (
            <div>
              <h2 className="section-title">Parties Information</h2>
              
              <div className="info-box critical-clause">
                <div className="info-box-header">
                  <Icon name="alert-circle" className="info-box-icon" />
                  <div>
                    <p className="info-box-title"><strong>Lesson from Stormy Daniels NDA:</strong> Ambiguous party identification and missing signatures led to enforceability issues.</p>
                    <p className="info-box-content">Ensure all parties are clearly identified and sign the agreement. If using pseudonyms, include a side letter identifying the parties that is signed by all parties.</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="checkbox-label">
                  <input
                    type="checkbox"
                    id="usePseudonyms"
                    name="usePseudonyms"
                    checked={formData.usePseudonyms}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="usePseudonyms">
                    Use pseudonyms for privacy
                    <Tooltip text="Pseudonyms can protect identity in sensitive NDAs, but require proper implementation with a side letter signed by all parties. The Stormy Daniels NDA used 'David Dennison' and 'Peggy Peterson' but failed to secure all signatures.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                </div>
                {formData.usePseudonyms && (
                  <div className="checkbox-group" style={{backgroundColor: "#fffbeb", padding: "0.75rem", borderRadius: "0.375rem", border: "1px solid #fef3c7"}}>
                    <p className="help-text" style={{color: "#92400e", marginBottom: "0.5rem"}}>Using pseudonyms requires a separate side letter that clearly identifies the actual parties. A side letter will be automatically included.</p>
                    <div className="form-row">
                      <div className="form-col">
                        <label className="form-label">Disclosing Party Pseudonym</label>
                        <input
                          type="text"
                          name="disclosingPartyPseudonym"
                          value={formData.disclosingPartyPseudonym}
                          onChange={handleChange}
                          placeholder="e.g., Party A"
                          className="form-input"
                        />
                      </div>
                      <div className="form-col">
                        <label className="form-label">Receiving Party Pseudonym</label>
                        <input
                          type="text"
                          name="receivingPartyPseudonym"
                          value={formData.receivingPartyPseudonym}
                          onChange={handleChange}
                          placeholder="e.g., Party B"
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <h3 className="card-title">Disclosing Party</h3>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    name="disclosingPartyType"
                    value={formData.disclosingPartyType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="individual">Individual</option>
                    <option value="corporation">Corporation</option>
                    <option value="llc">Limited Liability Company (LLC)</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    {formData.disclosingPartyType === 'individual' ? 'Full Legal Name' : 'Entity Name'}
                  </label>
                  <input
                    type="text"
                    name="disclosingPartyName"
                    value={formData.disclosingPartyName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={formData.disclosingPartyType === 'individual' ? 'e.g., John Smith' : 'e.g., Acme Corporation'}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="disclosingPartyAddress"
                    value={formData.disclosingPartyAddress}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Full Address"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="disclosingPartyEmail"
                    value={formData.disclosingPartyEmail}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <h3 className="card-title">Receiving Party</h3>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    name="receivingPartyType"
                    value={formData.receivingPartyType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="individual">Individual</option>
                    <option value="corporation">Corporation</option>
                    <option value="llc">Limited Liability Company (LLC)</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    {formData.receivingPartyType === 'individual' ? 'Full Legal Name' : 'Entity Name'}
                  </label>
                  <input
                    type="text"
                    name="receivingPartyName"
                    value={formData.receivingPartyName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={formData.receivingPartyType === 'individual' ? 'e.g., Jane Doe' : 'e.g., XYZ Inc.'}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="receivingPartyAddress"
                    value={formData.receivingPartyAddress}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Full Address"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="receivingPartyEmail"
                    value={formData.receivingPartyEmail}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Agreement Details Tab */}
          {currentTab === 1 && (
            <div>
              <h2 className="section-title">Agreement Details</h2>
              
              <div className="info-box warning-clause">
                <div className="info-box-header">
                  <Icon name="alert-circle" className="info-box-icon" />
                  <div>
                    <p className="info-box-title"><strong>Lesson from Stormy Daniels NDA:</strong> Clearly specify consideration and term to avoid enforceability issues.</p>
                    <p className="info-box-content">Having a reasonable time limitation on confidentiality obligations makes an NDA more enforceable than a perpetual one.</p>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Effective Date</label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Governing State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Alabama">Alabama</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Arkansas">Arkansas</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Delaware">Delaware</option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Idaho">Idaho</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Iowa">Iowa</option>
                  <option value="Kansas">Kansas</option>
                  <option value="Kentucky">Kentucky</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Maine">Maine</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Missouri">Missouri</option>
                  <option value="Montana">Montana</option>
                  <option value="Nebraska">Nebraska</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New Hampshire">New Hampshire</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="New York">New York</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="North Dakota">North Dakota</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Oklahoma">Oklahoma</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="South Carolina">South Carolina</option>
                  <option value="South Dakota">South Dakota</option>
                  <option value="Tennessee">Tennessee</option>
                  <option value="Texas">Texas</option>
                  <option value="Utah">Utah</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Washington">Washington</option>
                  <option value="West Virginia">West Virginia</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="Wyoming">Wyoming</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Purpose of Disclosure</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., evaluating a potential business partnership"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Duration of Agreement
                  <Tooltip text="The Stormy Daniels NDA had no time limitation, which courts increasingly view as unreasonable. For most business information, 2-5 years is typical. Including a reasonable time limit makes your NDA more enforceable.">
                    <Icon name="help-circle" className="info-icon" />
                  </Tooltip>
                </label>
                <div className="form-row">
                  <input
                    type="number"
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    style={{width: "5rem"}}
                  />
                  <select
                    name="termUnit"
                    value={formData.termUnit}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              
              <div className="card">
                <div className="checkbox-label">
                  <input
                    type="checkbox"
                    id="monetaryConsideration"
                    name="monetaryConsideration"
                    checked={formData.monetaryConsideration}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="monetaryConsideration">
                    Include monetary consideration
                    <Tooltip text="The Stormy Daniels NDA included $130,000 in monetary consideration, which created evidence of a valid contract. Monetary consideration (payment) can strengthen an NDA, but must be properly documented. In the Stormy case, the payment came through an LLC rather than directly from Trump, creating ambiguity about who was bound.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                </div>
                
                {formData.monetaryConsideration && (
                  <div className="checkbox-group">
                    <label className="form-label">Amount ($)</label>
                    <input
                      type="text"
                      name="considerationAmount"
                      value={formData.considerationAmount}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 1000"
                    />
                    <p className="help-text">
                      In addition to mutual promises, this amount will be specified as consideration for the agreement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Confidential Information Tab */}
          {currentTab === 2 && (
            <div>
              <h2 className="section-title">Confidential Information</h2>
              
              <div className="info-box warning-clause">
                <div className="info-box-header">
                  <Icon name="alert-circle" className="info-box-icon" />
                  <div>
                    <p className="info-box-title"><strong>Lesson from Stormy Daniels NDA:</strong> Clearly define what is confidential and include appropriate exclusions.</p>
                    <p className="info-box-content">Courts are more likely to enforce NDAs with well-defined confidential information and standard exclusions.</p>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Type of Confidential Information
                  <Tooltip text="The Stormy Daniels NDA attempted to protect personal information but was overly broad. Defining confidential information clearly helps courts understand exactly what is being protected and makes the NDA more enforceable.">
                    <Icon name="help-circle" className="info-icon" />
                  </Tooltip>
                </label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="confidentialInfoType"
                      value="business"
                      checked={formData.confidentialInfoType === 'business'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Business Information
                    <Tooltip text="Trade secrets, financials, customer lists, and other commercial information. Courts are most familiar with and likely to enforce NDAs in business contexts.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="confidentialInfoType"
                      value="personal"
                      checked={formData.confidentialInfoType === 'personal'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Personal Information
                    <Tooltip text="Private affairs, personal matters, or sensitive information about an individual. Personal NDAs can face higher scrutiny, especially if they might conceal matters of public concern.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                </div>
              </div>
              
              {formData.confidentialInfoType === 'business' && (
                <div className="card">
                  <h3 className="card-title">Types of Business Information to Protect</h3>
                  <div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeTradeSecrets"
                        checked={formData.includeTradeSecrets}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Trade secrets, inventions, processes, and know-how
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeBusinessPlans"
                        checked={formData.includeBusinessPlans}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Business plans, marketing plans, and strategies
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeCustomerInfo"
                        checked={formData.includeCustomerInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Customer lists and information
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeFinancialInfo"
                        checked={formData.includeFinancialInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Financial information and pricing
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeTechnicalInfo"
                        checked={formData.includeTechnicalInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Technical information and designs
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeCustomInfo"
                        checked={formData.includeCustomInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Other (specify below)
                    </label>
                    
                    {formData.includeCustomInfo && (
                      <div className="checkbox-group">
                        <input
                          type="text"
                          name="customConfidentialInfo"
                          value={formData.customConfidentialInfo}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Describe other confidential information"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {formData.confidentialInfoType === 'personal' && (
                <div className="card">
                  <h3 className="card-title">Types of Personal Information to Protect</h3>
                  <div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeIdentityInfo"
                        checked={formData.includeIdentityInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Identity information (name, date of birth, personal identification)
                      <Tooltip text="Includes government-issued IDs, SSN, passport information, and other identity documents.">
                        <Icon name="help-circle" className="info-icon" />
                      </Tooltip>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeContactInfo"
                        checked={formData.includeContactInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Contact information (address, phone number, email)
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeFinancialPersonalInfo"
                        checked={formData.includeFinancialPersonalInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Financial information (account details, income, transactions)
                      <Tooltip text="Includes bank account information, credit card numbers, income information, and financial transaction history.">
                        <Icon name="help-circle" className="info-icon" />
                      </Tooltip>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeHealthInfo"
                        checked={formData.includeHealthInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Health and medical information
                      <Tooltip text="Note: Health information may be subject to additional legal protections like HIPAA in the US.">
                        <Icon name="help-circle" className="info-icon" />
                      </Tooltip>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeRelationshipInfo"
                        checked={formData.includeRelationshipInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Relationship and personal life details
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeCorrespondenceInfo"
                        checked={formData.includeCorrespondenceInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Communications and correspondence
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="includeCustomPersonalInfo"
                        checked={formData.includeCustomPersonalInfo}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      Other (specify below)
                    </label>
                    
                    {formData.includeCustomPersonalInfo && (
                      <div className="checkbox-group">
                        <input
                          type="text"
                          name="customPersonalInfo"
                          value={formData.customPersonalInfo}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Describe other personal information"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="card">
                <h3 className="card-title">Exclusions from Confidential Information</h3>
                <div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="publicDomainExclusion"
                      checked={formData.publicDomainExclusion}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Information that is or becomes publicly available without breach
                    <Tooltip text="This standard exclusion prevents enforcing an NDA on information that becomes public through no fault of the receiving party. The Stormy Daniels NDA lacked this carveout, which would have prevented enforcement once the information became public knowledge.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="independentDevelopmentExclusion"
                      checked={formData.independentDevelopmentExclusion}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Information independently developed or lawfully received from third parties
                    <Tooltip text="This exclusion prevents an NDA from restricting information legitimately obtained from other sources. Without this, a party could be unfairly restricted from using information they developed independently or received legally elsewhere.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rightfulPossessionExclusion"
                      checked={formData.rightfulPossessionExclusion}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Information in rightful possession prior to disclosure
                    <Tooltip text="This exclusion protects a party from being restricted from using information they already rightfully possessed before the NDA. Without this, you could be prevented from using your own pre-existing knowledge.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Obligations Tab */}
          {currentTab === 3 && (
            <div>
              <h2 className="section-title">Obligations & Permitted Disclosures</h2>
              
              <div className="info-box critical-clause">
                <div className="info-box-header">
                  <Icon name="alert-circle" className="info-box-icon" />
                  <div>
                    <p className="info-box-title"><strong>Lesson from Stormy Daniels NDA:</strong> Always include legal carveouts for required disclosures.</p>
                    <p className="info-box-content">Courts won't enforce NDAs that try to prevent legally required disclosures or whistleblowing. Including these carveouts makes your NDA more enforceable.</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="card-title">Basic Obligations</h3>
                <div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="nonDisclosure"
                      checked={formData.nonDisclosure}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Non-disclosure (keep information confidential)
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="nonUse"
                      checked={formData.nonUse}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Non-use (don't use information except for agreed purpose)
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="returnDocuments"
                      checked={formData.returnDocuments}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Return/destroy documents on request or termination
                  </label>
                </div>
              </div>
              
              <div className="card">
                <h3 className="card-title">Legal Carveouts (Permitted Disclosures)</h3>
                <div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeCourtOrderCarveout"
                      checked={formData.includeCourtOrderCarveout}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Court order/subpoena disclosure (with notice to other party)
                    <Tooltip text="Courts won't enforce NDAs that forbid compliance with legal orders. This carveout allows disclosure when required by court order, while preserving confidentiality by requiring notice to the other party so they can seek a protective order if appropriate.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeWhistleblowerCarveout"
                      checked={formData.includeWhistleblowerCarveout}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Whistleblower protection carveout
                    <Tooltip text="Laws like the Defend Trade Secrets Act require whistleblower immunities in confidentiality agreements. This carveout ensures the NDA doesn't prevent reporting possible violations of law to appropriate government agencies.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeGovInvestigationCarveout"
                      checked={formData.includeGovInvestigationCarveout}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Government investigation disclosure carveout
                    <Tooltip text="Courts will not enforce NDAs that prevent cooperation with government investigations. This carveout explicitly preserves the right to provide information to or testify before government agencies, preventing the NDA from being used to obstruct justice.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                </div>
                <p className="help-text">
                  These carveouts ensure the NDA won't be invalidated for attempting to prevent legally required disclosures.
                </p>
              </div>
            </div>
          )}
          
          {/* Remedies Tab */}
          {currentTab === 4 && (
            <div>
              <h2 className="section-title">Remedies</h2>
              
              <div className="info-box critical-clause">
                <div className="info-box-header">
                  <Icon name="alert-circle" className="info-box-icon" />
                  <div>
                    <p className="info-box-title"><strong>Lesson from Stormy Daniels NDA:</strong> Avoid excessive liquidated damages ($1M per breach was likely unenforceable).</p>
                    <p className="info-box-content">Courts may view unreasonable liquidated damages as an unenforceable penalty. If you include liquidated damages, the amount should be a reasonable estimate of potential harm.</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="card-title">Available Remedies</h3>
                <div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="injunctiveRelief"
                      checked={formData.injunctiveRelief}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Injunctive relief (court orders to stop breaches)
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="monetaryDamages"
                      checked={formData.monetaryDamages}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Actual monetary damages
                  </label>
                </div>
              </div>
              
              <div className="card">
                <div className="checkbox-label">
                  <input
                    type="checkbox"
                    id="liquidatedDamages"
                    name="liquidatedDamages"
                    checked={formData.liquidatedDamages}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="liquidatedDamages">
                    Include liquidated damages
                    <Tooltip text="The Stormy Daniels NDA included a $1,000,000 per breach liquidated damages clause that was likely unenforceable as an excessive penalty. Courts require liquidated damages to be a reasonable estimate of potential harm, not a penalty designed to terrorize the other party.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                </div>
                
                {formData.liquidatedDamages && (
                  <div className="checkbox-group">
                    <label className="form-label">Amount per breach ($)</label>
                    <input
                      type="text"
                      name="liquidatedDamagesAmount"
                      value={formData.liquidatedDamagesAmount}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 5000"
                    />
                    <p className="help-text">
                      This amount should be a reasonable estimate of the harm that might result from a breach, not a penalty.
                    </p>
                    {formData.liquidatedDamagesAmount && parseInt(formData.liquidatedDamagesAmount) > 25000 && (
                      <p className="alert-warning">
                        Warning: High liquidated damages may be viewed as an unenforceable penalty by courts.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Dispute Resolution Tab */}
          {currentTab === 5 && (
            <div>
              <h2 className="section-title">Dispute Resolution</h2>
              
              <div className="info-box warning-clause">
                <div className="info-box-header">
                  <Icon name="alert-circle" className="info-box-icon" />
                  <div>
                    <p className="info-box-title"><strong>Lesson from Stormy Daniels NDA:</strong> One-sided arbitration provisions can face scrutiny.</p>
                    <p className="info-box-content">Fair and balanced dispute resolution provisions are more likely to be enforced.</p>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  How should disputes be resolved?
                  <Tooltip text="The Stormy Daniels NDA contained a one-sided arbitration clause that gave Trump's side unilateral power to select the arbitration location. This imbalance contributed to the agreement's problems. A fair dispute resolution mechanism enhances enforceability.">
                    <Icon name="help-circle" className="info-icon" />
                  </Tooltip>
                </label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="disputeResolution"
                      value="litigation"
                      checked={formData.disputeResolution === 'litigation'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Court Litigation
                    <Tooltip text="Litigation means disputes are resolved in public courts. This provides more procedural protections but less privacy than arbitration. Court proceedings are typically public records.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="disputeResolution"
                      value="arbitration"
                      checked={formData.disputeResolution === 'arbitration'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Binding Arbitration
                    <Tooltip text="Arbitration is private dispute resolution outside the court system. While it offers confidentiality and sometimes faster resolution, it must be balanced and fair to both parties to be enforceable. One-sided arbitration provisions risk being deemed unconscionable.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                </div>
              </div>
              
              {formData.disputeResolution === 'litigation' && (
                <div className="form-group">
                  <label className="form-label">County for litigation (optional)</label>
                  <input
                    type="text"
                    name="arbitrationCounty"
                    value={formData.arbitrationCounty}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Los Angeles"
                  />
                </div>
              )}
              
              {formData.disputeResolution === 'arbitration' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Arbitration Provider</label>
                    <select
                      name="arbitrationProvider"
                      value={formData.arbitrationProvider}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="JAMS">JAMS</option>
                      <option value="AAA">American Arbitration Association (AAA)</option>
                      <option value="ICC">International Chamber of Commerce (ICC)</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Arbitration Location</label>
                    <input
                      type="text"
                      name="arbitrationLocation"
                      value={formData.arbitrationLocation}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., San Francisco, CA"
                    />
                    <p className="help-text">
                      If left blank, we'll use the county specified below.
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">County (if no specific location)</label>
                    <input
                      type="text"
                      name="arbitrationCounty"
                      value={formData.arbitrationCounty}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., San Francisco"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Miscellaneous Tab */}
          {currentTab === 6 && (
            <div>
              <h2 className="section-title">Miscellaneous Provisions</h2>
              
              <div className="info-box security-clause">
                <div className="info-box-header">
                  <Icon name="alert-circle" className="info-box-icon" />
                  <div>
                    <p className="info-box-title"><strong>Lesson from Stormy Daniels NDA:</strong> Include a strong severability clause to preserve the agreement even if certain provisions are invalid.</p>
                    <p className="info-box-content">Standard miscellaneous provisions strengthen the legal framework of your NDA.</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="card-title">Standard Provisions</h3>
                <div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="governing"
                      checked={formData.governing}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Governing Law (the state you selected earlier)
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="entireAgreement"
                      checked={formData.entireAgreement}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Entire Agreement clause
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="amendment"
                      checked={formData.amendment}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Amendment must be in writing
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="waiver"
                      checked={formData.waiver}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    No waiver by delay or inaction
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="severability"
                      checked={formData.severability}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Severability (preserve agreement if parts invalidated)
                    <Tooltip text="A strong severability clause is essential. If a court finds certain provisions unenforceable (like the $1M liquidated damages in Stormy's NDA), this clause helps preserve the rest of the agreement. Without severability, one invalid provision could void the entire NDA.">
                      <Icon name="help-circle" className="info-icon" />
                    </Tooltip>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="attorneyFees"
                      checked={formData.attorneyFees}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Prevailing party gets attorney fees
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="navigation-buttons">
            <button
              onClick={prevTab}
              className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
              disabled={currentTab === 0}
            >
              <Icon name="chevron-left" style={{marginRight: "0.25rem"}} />
              Previous
            </button>
            
            {/* Copy to clipboard button */}
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
            
            {/* Download MS Word button */}
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
              className="nav-button next-button"
            >
              Next
              <Icon name="chevron-right" style={{marginLeft: "0.25rem"}} />
            </button>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="preview-panel" ref={previewRef}>
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre 
              className="nda-preview"
              dangerouslySetInnerHTML={{ __html: highlightedNDA }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the app
const root = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(<StrategicNDAGenerator />);
