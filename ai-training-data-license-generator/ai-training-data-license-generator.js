// AI Training Data License Agreement Generator
const App = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
    // Basic Info
    licenseeCompanyName: "",
    licenseeAddress: "",
    licenseeState: "",
    licenseeCountry: "United States",
    licensorCompanyName: "",
    licensorAddress: "",
    licensorState: "",
    licensorCountry: "United States",
    effectiveDate: new Date().toISOString().split('T')[0],
    
    // Data Description
    dataDescription: "",
    dataFormat: [],
    dataVolume: "",
    dataCustomization: "none",
    dataPreprocessing: false,
    dataAnnotation: false,
    dataCleaning: false,
    dataDomain: "",
    
    // License Terms
    licenseType: "non-exclusive",
    scopeOption: "training",
    allowDerivativeWorks: true,
    allowRedistribution: false,
    geographicRestrictions: "worldwide",
    specificCountries: "",
    industryRestrictions: false,
    restrictedIndustries: "",
    
    // Usage Rights
    modelTypes: [],
    commercialUse: true,
    internalUseOnly: false,
    publicDeployment: true,
    academicUse: true,
    
    // Payment Terms
    paymentStructure: "one-time",
    paymentAmount: "",
    royaltyPercentage: "",
    metricForRoyalty: "revenue",
    minimumPayment: "",
    paymentFrequency: "quarterly",
    currency: "USD",
    
    // Term and Termination
    licenseTermOption: "fixed",
    licenseTermYears: "2",
    licenseTermMonths: "0",
    autoRenewal: true,
    renewalNoticePeriod: "30",
    terminationRights: "both",
    
    // Confidentiality and Security
    confidentialityTerm: "5",
    securityMeasures: [],
    breachNotification: "24",
    certificationRequired: false,
    auditRights: true,
    auditFrequency: "annual",
    
    // Representations and Warranties
    ownershipWarranty: true,
    noInfringementWarranty: true,
    complianceWarranty: true,
    indemnificationByLicensor: true,
    indemnificationByLicensee: true,
    limitationOfLiability: true,
    limitationAmount: "fees paid",
    
    // Additional Terms
    governingLaw: "",
    disputeResolution: "arbitration",
    arbitrationVenue: "",
    modificationRequirement: "written",
    assignability: "consent",
    forcesMajeure: true,
    publicityRights: false,
    
    // Document Formatting
    fileName: "AI-Training-Data-License-Agreement",
    documentTitle: "AI Training Data License Agreement",
  });
  
  // State for last changed field to enable highlighting
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for scrolling to highlighted text
  const previewRef = React.useRef(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    
    // For checkboxes, use the checked property
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } 
    // For multi-select (arrays)
    else if (type === 'select-multiple') {
      const options = e.target.options;
      const values = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      setFormData(prev => ({
        ...prev,
        [name]: values
      }));
    }
    // For all other inputs, use the value property
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  // Tab definitions
  const tabs = [
    { id: 'parties', label: 'Parties' },
    { id: 'data-description', label: 'Data Description' },
    { id: 'license-terms', label: 'License Terms' },
    { id: 'usage-rights', label: 'Usage Rights' },
    { id: 'payment', label: 'Payment' },
    { id: 'term', label: 'Term & Termination' },
    { id: 'security', label: 'Security' },
    { id: 'warranties', label: 'Warranties' },
    { id: 'additional', label: 'Additional Terms' },
    { id: 'review', label: 'Review' }
  ];

  // Generate the document text based on form data
  const generateDocumentText = () => {
    // Format the effective date
    const dateObj = new Date(formData.effectiveDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let text = `AI TRAINING DATA LICENSE AGREEMENT

THIS AI TRAINING DATA LICENSE AGREEMENT (the "Agreement") is made and entered into as of ${formattedDate} (the "Effective Date"), by and between ${formData.licensorCompanyName || "[LICENSOR COMPANY NAME]"}, a company organized under the laws of ${formData.licensorState || "[STATE]"}, ${formData.licensorCountry || "[COUNTRY]"}, with its principal place of business at ${formData.licensorAddress || "[ADDRESS]"} (the "Licensor"), and ${formData.licenseeCompanyName || "[LICENSEE COMPANY NAME]"}, a company organized under the laws of ${formData.licenseeState || "[STATE]"}, ${formData.licenseeCountry || "[COUNTRY]"}, with its principal place of business at ${formData.licenseeAddress || "[ADDRESS]"} (the "Licensee").

RECITALS

WHEREAS, Licensor owns or has the rights to license certain data that can be used for training artificial intelligence and machine learning models;

WHEREAS, Licensee desires to obtain a license to use such data for the purpose of training, developing, testing, and/or deploying artificial intelligence and machine learning models; and

WHEREAS, Licensor is willing to grant such a license to Licensee subject to the terms and conditions of this Agreement.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITIONS

1.1 "AI Models" means any machine learning, deep learning, or artificial intelligence models, algorithms, or systems developed, trained, fine-tuned, or used by Licensee using the Licensed Data.

1.2 "Confidential Information" means any non-public information disclosed by one party to the other that is designated as confidential or that, given the nature of the information or circumstances surrounding its disclosure, reasonably should be understood to be confidential. Confidential Information includes, but is not limited to, the Licensed Data (unless otherwise specified), business plans, financial information, product designs, customer lists, and proprietary technology.

1.3 "Derivative Works" means works based upon or using the Licensed Data, including but not limited to AI Models trained using the Licensed Data, refined or augmented datasets, and any outputs or applications utilizing such AI Models.

1.4 "Licensed Data" means the data described in Exhibit A, including any updates, modifications, or enhancements provided by Licensor to Licensee under this Agreement.

1.5 "License Fees" means the fees payable by Licensee to Licensor for the rights granted under this Agreement, as set forth in Section 4.

2. LICENSE GRANT

2.1 License Grant. Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a ${formData.licenseType === 'exclusive' ? 'exclusive' : 'non-exclusive'}, ${formData.licenseTermOption === 'perpetual' ? 'perpetual' : 'limited-term'}, ${formData.geographicRestrictions === 'worldwide' ? 'worldwide' : 'limited'} license to use the Licensed Data solely for the purpose of ${generateScopeText()}.

2.2 Restrictions. Except as expressly permitted in this Agreement, Licensee shall not:
   (a) Use the Licensed Data for any purpose other than as expressly permitted in Section 2.1;
   (b) ${formData.allowRedistribution ? 'Redistribute the Licensed Data except as expressly permitted in Section 2.3' : 'Redistribute, sell, sublicense, rent, lease, or otherwise make the Licensed Data available to any third party'};
   (c) ${formData.allowDerivativeWorks ? 'Create Derivative Works except as expressly permitted in Section 2.1' : 'Create Derivative Works based on the Licensed Data'};
   (d) Remove, alter, or obscure any proprietary notices in or on the Licensed Data;
   (e) Use the Licensed Data in any manner that violates applicable law; or
   (f) Attempt to reverse engineer, decompile, or disassemble the Licensed Data, except to the extent this restriction is prohibited by applicable law.

${formData.allowRedistribution ? `2.3 Redistribution Rights. Licensee may redistribute the Licensed Data only as follows:
   (a) As part of a Derivative Work that fundamentally transforms the Licensed Data;
   (b) To Licensee's contractors and service providers who are bound by written obligations of confidentiality no less protective than those in this Agreement and who use the Licensed Data solely on Licensee's behalf; and
   (c) As required by law, provided that Licensee gives Licensor reasonable advance notice to seek a protective order.` : ''}

${formData.geographicRestrictions !== 'worldwide' ? `2.4 Geographic Restrictions. The license granted herein is limited to use in the following territories: ${formData.specificCountries || "[SPECIFIC COUNTRIES/REGIONS]"}.` : ''}

${formData.industryRestrictions ? `2.5 Industry Restrictions. Licensee shall not use the Licensed Data in the following industries or for the following applications: ${formData.restrictedIndustries || "[RESTRICTED INDUSTRIES/APPLICATIONS]"}.` : ''}

3. USAGE RIGHTS

3.1 Permitted AI Models. Licensee may use the Licensed Data to train, develop, test, and deploy the following types of AI models: ${generateModelTypesText()}.

3.2 Commercial Use. ${formData.commercialUse ? 'Licensee may use the AI Models for commercial purposes, including incorporating such models into products or services offered to third parties.' : 'Licensee shall not use the AI Models for commercial purposes without obtaining separate written permission from Licensor.'}

3.3 Internal Use. ${formData.internalUseOnly ? 'Licensee shall use the AI Models solely for internal business operations and shall not make such models available to third parties.' : 'Licensee may use the AI Models for internal business operations.'}

3.4 Public Deployment. ${formData.publicDeployment ? 'Licensee may deploy AI Models trained with the Licensed Data in publicly accessible applications, products, or services, provided that such deployment complies with all other restrictions in this Agreement.' : 'Licensee shall not deploy AI Models trained with the Licensed Data in publicly accessible applications, products, or services without obtaining separate written permission from Licensor.'}

3.5 Academic Use. ${formData.academicUse ? 'Licensee may use the Licensed Data for academic research and educational purposes and may publish research findings based on analysis of the Licensed Data, provided that Licensee acknowledges Licensor as the source of the Licensed Data in any such publication.' : 'Licensee shall not use the Licensed Data for academic research or educational purposes without obtaining separate written permission from Licensor.'}

4. FEES AND PAYMENT

4.1 License Fees. In consideration of the rights granted hereunder, Licensee shall pay to Licensor the License Fees as follows:

${generatePaymentTermsText()}

4.2 Payment Terms. All payments shall be made in ${formData.currency || "USD"} via [PAYMENT METHOD] within [PAYMENT DEADLINE] days of the applicable invoice date or payment trigger. Late payments shall bear interest at the rate of [INTEREST RATE]% per month or the maximum rate permitted by applicable law, whichever is less.

4.3 Taxes. All License Fees are exclusive of any applicable taxes, duties, or similar charges. Licensee shall be responsible for all sales, use, value-added, withholding, and similar taxes imposed by any federal, state, provincial, or local governmental entity on the transactions contemplated by this Agreement, excluding taxes based on Licensor's net income.

5. TERM AND TERMINATION

${generateTermAndTerminationText()}

5.5 Effect of Termination. Upon termination or expiration of this Agreement:
   (a) All rights granted to Licensee under this Agreement shall immediately terminate;
   (b) Licensee shall promptly return or destroy (at Licensor's option) all Licensed Data and any copies thereof;
   (c) Licensor shall be entitled to retain any fees paid up to the date of termination;
   (d) ${formData.allowDerivativeWorks ? 'Licensee may continue to use any Derivative Works created prior to termination in accordance with the terms of this Agreement; and' : 'Licensee shall cease using any Derivative Works created using the Licensed Data; and'}
   (e) Sections [SURVIVING SECTIONS] shall survive termination or expiration of this Agreement.

6. CONFIDENTIALITY AND DATA SECURITY

6.1 Confidentiality Obligations. Each party shall (a) maintain the confidentiality of the other party's Confidential Information using at least the same degree of care that it uses to protect its own confidential information of similar nature, but in no event less than reasonable care; (b) not disclose the other party's Confidential Information to any third party except as expressly permitted in this Agreement; and (c) use the other party's Confidential Information only as necessary to fulfill its obligations or exercise its rights under this Agreement.

6.2 Confidentiality Term. The confidentiality obligations set forth in Section 6.1 shall continue for a period of ${formData.confidentialityTerm || "5"} years after the termination or expiration of this Agreement.

6.3 Security Measures. Licensee shall implement and maintain appropriate technical, organizational, and physical safeguards to protect the Licensed Data from unauthorized access, use, disclosure, alteration, or destruction. Such safeguards shall include, at a minimum:

${generateSecurityMeasuresText()}

6.4 Breach Notification. In the event of any actual or reasonably suspected unauthorized access to, use of, or disclosure of the Licensed Data, Licensee shall notify Licensor within ${formData.breachNotification || "24"} hours of discovery and cooperate with Licensor in investigating and remedying the incident.

${formData.certificationRequired ? `6.5 Compliance Certification. Upon Licensor's request, but no more frequently than once per year, Licensee shall certify in writing its compliance with the security requirements set forth in this Agreement.` : ''}

${formData.auditRights ? `6.6 Audit Rights. Licensor may, upon reasonable notice and during normal business hours, audit Licensee's use of the Licensed Data and compliance with this Agreement. Such audits shall be conducted at Licensor's expense, provided that if an audit reveals a material breach of this Agreement, Licensee shall reimburse Licensor for the reasonable costs of the audit. Licensor may conduct such audits no more frequently than ${formData.auditFrequency === 'annual' ? 'once per year' : 'once every six months'} unless a previous audit has revealed a breach.` : ''}

7. REPRESENTATIONS, WARRANTIES, AND LIABILITIES

7.1 Mutual Representations and Warranties. Each party represents and warrants that (a) it has the full right, power, and authority to enter into and perform its obligations under this Agreement; (b) its entry into and performance under this Agreement does not conflict with any other agreement to which it is a party or by which it is bound; and (c) it shall comply with all applicable laws in connection with its performance under this Agreement.

${formData.ownershipWarranty ? `7.2 Licensor Ownership Warranty. Licensor represents and warrants that it owns or has the right to license the Licensed Data as set forth in this Agreement.` : ''}

${formData.noInfringementWarranty ? `7.3 Non-Infringement Warranty. Licensor represents and warrants that, to its knowledge, the Licensed Data does not infringe upon or violate any intellectual property rights of any third party.` : ''}

${formData.complianceWarranty ? `7.4 Compliance Warranty. Licensor represents and warrants that the Licensed Data has been collected, processed, and maintained in compliance with all applicable laws, including data protection and privacy laws.` : ''}

7.5 Disclaimer. EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, THE LICENSED DATA IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. LICENSOR SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, AND ALL WARRANTIES ARISING FROM COURSE OF DEALING, USAGE, OR TRADE PRACTICE. LICENSOR MAKES NO WARRANTY THAT THE LICENSED DATA WILL MEET LICENSEE'S REQUIREMENTS OR BE AVAILABLE ON AN UNINTERRUPTED, SECURE, OR ERROR-FREE BASIS.

${formData.indemnificationByLicensor ? `7.6 Licensor Indemnification. Licensor shall defend, indemnify, and hold harmless Licensee from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or relating to any claim that the Licensed Data infringes upon or violates any intellectual property rights of any third party; provided that Licensee (a) promptly notifies Licensor in writing of the claim; (b) gives Licensor sole control of the defense and settlement of the claim; and (c) provides to Licensor all reasonable assistance, at Licensor's expense.` : ''}

${formData.indemnificationByLicensee ? `7.7 Licensee Indemnification. Licensee shall defend, indemnify, and hold harmless Licensor from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or relating to (a) Licensee's use of the Licensed Data in violation of this Agreement or applicable law; or (b) any Derivative Works created by or for Licensee; provided that Licensor (i) promptly notifies Licensee in writing of the claim; (ii) gives Licensee sole control of the defense and settlement of the claim; and (iii) provides to Licensee all reasonable assistance, at Licensee's expense.` : ''}

${formData.limitationOfLiability ? `7.8 Limitation of Liability. EXCEPT FOR LIABILITY ARISING FROM BREACHES OF SECTIONS [CONFIDENTIALITY] OR [INDEMNIFICATION OBLIGATIONS], OR LIABILITY THAT CANNOT BE LIMITED BY LAW:
   (a) NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES;
   (b) EACH PARTY'S TOTAL CUMULATIVE LIABILITY FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATING TO THIS AGREEMENT SHALL NOT EXCEED ${formData.limitationAmount === 'fees paid' ? 'THE TOTAL AMOUNT OF LICENSE FEES PAID OR PAYABLE BY LICENSEE TO LICENSOR UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM' : formData.limitationAmount === 'multiple' ? 'THREE (3) TIMES THE TOTAL AMOUNT OF LICENSE FEES PAID OR PAYABLE BY LICENSEE TO LICENSOR UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM' : '[FIXED AMOUNT]'}.` : ''}

8. GENERAL PROVISIONS

8.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of ${formData.governingLaw || "[STATE/COUNTRY]"} without giving effect to any choice or conflict of law provision or rule.

8.2 Dispute Resolution. ${formData.disputeResolution === 'litigation' ? 
'Any dispute arising out of or relating to this Agreement shall be resolved exclusively in the state or federal courts located in [JURISDICTION], and each party hereby consents to the jurisdiction and venue of such courts.' : 
'Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration conducted in accordance with the rules of [ARBITRATION ORGANIZATION] by a single arbitrator appointed in accordance with such rules. The arbitration shall take place in ' + (formData.arbitrationVenue || "[ARBITRATION VENUE]") + ', and the language of the arbitration shall be English. The decision of the arbitrator shall be final and binding upon the parties.'}

8.3 Relationship of Parties. The parties are independent contractors. This Agreement does not create a partnership, franchise, joint venture, agency, fiduciary, or employment relationship between the parties.

8.4 Assignment. ${formData.assignability === 'consent' ? 'Neither party may assign or otherwise transfer any of its rights or obligations under this Agreement without the prior written consent of the other party, which shall not be unreasonably withheld.' : formData.assignability === 'unrestricted' ? 'Either party may assign or otherwise transfer any of its rights or obligations under this Agreement without the consent of the other party.' : 'Neither party may assign or otherwise transfer any of its rights or obligations under this Agreement without the prior written consent of the other party, except that either party may assign this Agreement in connection with a merger, acquisition, or sale of all or substantially all of its assets.'}

8.5 Notices. All notices under this Agreement shall be in writing and shall be deemed to have been given upon: (a) personal delivery; (b) the third business day after first class mailing; or (c) the second business day after sending by confirmed facsimile or email. Notices shall be sent to the addresses set forth in the preamble of this Agreement or such other address as either party may specify in writing.

8.6 Amendments. No modification of or amendment to this Agreement shall be effective unless in writing signed by authorized representatives of both parties.

${formData.forcesMajeure ? `8.7 Force Majeure. Neither party shall be liable for any failure or delay in performance under this Agreement due to causes beyond that party's reasonable control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, epidemics, or strikes.` : ''}

${formData.publicityRights ? `8.8 Publicity. Licensee may publicly disclose that it is using the Licensed Data, provided that Licensee shall not use Licensor's name, logo, or trademarks without Licensor's prior written consent. Licensor may include Licensee's name and logo in a list of Licensor's customers.` : '8.8 Publicity. Neither party shall issue any press release or public announcement regarding the existence or content of this Agreement without the other party's prior written consent.'}

8.9 Severability. If any provision of this Agreement is held by a court of competent jurisdiction to be contrary to law, the provision shall be modified by the court and interpreted so as best to accomplish the objectives of the original provision to the fullest extent permitted by law, and the remaining provisions of this Agreement shall remain in effect.

8.10 Waiver. No failure or delay by either party in exercising any right under this Agreement shall constitute a waiver of that right. No waiver shall be effective unless made in writing and signed by an authorized representative of the waiving party.

8.11 Entire Agreement. This Agreement constitutes the entire agreement between the parties regarding the subject matter hereof and supersedes all prior and contemporaneous agreements, proposals, or representations, written or oral, concerning its subject matter.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

LICENSOR                                    LICENSEE
${formData.licensorCompanyName || "[LICENSOR COMPANY NAME]"}        ${formData.licenseeCompanyName || "[LICENSEE COMPANY NAME]"}

By: _______________________________        By: _______________________________
Name: ____________________________        Name: ____________________________
Title: _____________________________        Title: _____________________________


EXHIBIT A
DESCRIPTION OF LICENSED DATA

1. Data Description: ${formData.dataDescription || "[DETAILED DESCRIPTION OF THE DATA]"}

2. Data Format: ${formData.dataFormat.length > 0 ? formData.dataFormat.join(', ') : "[DATA FORMAT(S)]"}

3. Data Volume: ${formData.dataVolume || "[APPROXIMATE SIZE/VOLUME OF DATA]"}

4. Data Domain: ${formData.dataDomain || "[SPECIFIC DOMAIN OR FIELD THE DATA PERTAINS TO]"}

5. Data Processing: ${generateDataProcessingText()}

6. Delivery Method: [METHOD OF DELIVERING THE DATA TO LICENSEE]

7. Updates: [FREQUENCY AND METHOD OF DATA UPDATES, IF ANY]

8. Special Restrictions or Requirements: [ANY SPECIAL RESTRICTIONS OR REQUIREMENTS]`;

    return text;
  };

  // Helper functions for generating specific sections of text
  function generateScopeText() {
    let scopeText = "";
    switch(formData.scopeOption) {
      case "training":
        scopeText = "training, developing, and testing AI Models";
        break;
      case "training-deployment":
        scopeText = "training, developing, testing, and deploying AI Models";
        break;
      case "research":
        scopeText = "conducting research and development activities related to artificial intelligence and machine learning";
        break;
      case "comprehensive":
        scopeText = "training, developing, testing, and deploying AI Models, as well as conducting research and development activities related to artificial intelligence and machine learning";
        break;
      default:
        scopeText = "[SCOPE OF USE]";
    }
    return scopeText;
  }

  function generateModelTypesText() {
    if (formData.modelTypes.length === 0) {
      return "[TYPES OF AI MODELS]";
    }
    
    return formData.modelTypes.join(", ");
  }

  function generatePaymentTermsText() {
    let paymentText = "";
    
    switch(formData.paymentStructure) {
      case "one-time":
        paymentText = `A one-time payment of ${formData.paymentAmount ? formData.currency + " " + formData.paymentAmount : "[AMOUNT]"} due within [PAYMENT DEADLINE] days of the Effective Date.`;
        break;
      case "subscription":
        paymentText = `A ${formData.paymentFrequency} payment of ${formData.paymentAmount ? formData.currency + " " + formData.paymentAmount : "[AMOUNT]"} for the duration of the Agreement, with the first payment due within [PAYMENT DEADLINE] days of the Effective Date and subsequent payments due on the first day of each ${formData.paymentFrequency} period thereafter.`;
        break;
      case "royalty":
        paymentText = `A royalty equal to ${formData.royaltyPercentage || "[PERCENTAGE]"}% of the ${formData.metricForRoyalty === "revenue" ? "gross revenue" : formData.metricForRoyalty === "net-revenue" ? "net revenue" : formData.metricForRoyalty === "profit" ? "net profit" : "[REVENUE METRIC]"} derived from any products or services that incorporate or utilize AI Models trained on the Licensed Data. Royalty payments shall be made ${formData.paymentFrequency} and shall be accompanied by a report detailing the calculation of such payments.`;
        
        if (formData.minimumPayment) {
          paymentText += `\n\nLicensee shall pay a minimum royalty of ${formData.currency} ${formData.minimumPayment} per ${formData.paymentFrequency} period, regardless of the actual royalty amount calculated based on the percentage above.`;
        }
        break;
      case "hybrid":
        paymentText = `(a) An initial payment of ${formData.paymentAmount ? formData.currency + " " + formData.paymentAmount : "[INITIAL AMOUNT]"} due within [PAYMENT DEADLINE] days of the Effective Date; and\n\n(b) A royalty equal to ${formData.royaltyPercentage || "[PERCENTAGE]"}% of the ${formData.metricForRoyalty === "revenue" ? "gross revenue" : formData.metricForRoyalty === "net-revenue" ? "net revenue" : formData.metricForRoyalty === "profit" ? "net profit" : "[REVENUE METRIC]"} derived from any products or services that incorporate or utilize AI Models trained on the Licensed Data. Royalty payments shall be made ${formData.paymentFrequency} and shall be accompanied by a report detailing the calculation of such payments.`;
        
        if (formData.minimumPayment) {
          paymentText += `\n\nLicensee shall pay a minimum royalty of ${formData.currency} ${formData.minimumPayment} per ${formData.paymentFrequency} period, regardless of the actual royalty amount calculated based on the percentage above.`;
        }
        break;
      default:
        paymentText = "[PAYMENT TERMS]";
    }
    
    return paymentText;
  }

  function generateTermAndTerminationText() {
    let termText = "";
    
    if (formData.licenseTermOption === "perpetual") {
      termText = `5.1 Term. This Agreement shall commence on the Effective Date and continue in perpetuity unless terminated as provided herein.`;
    } else if (formData.licenseTermOption === "fixed") {
      let termLength = "";
      if (formData.licenseTermYears && formData.licenseTermYears !== "0") {
        termLength += `${formData.licenseTermYears} year${formData.licenseTermYears === "1" ? "" : "s"}`;
      }
      
      if (formData.licenseTermMonths && formData.licenseTermMonths !== "0") {
        if (termLength) {
          termLength += ` and `;
        }
        termLength += `${formData.licenseTermMonths} month${formData.licenseTermMonths === "1" ? "" : "s"}`;
      }
      
      if (!termLength) {
        termLength = "[TERM LENGTH]";
      }
      
      termText = `5.1 Term. This Agreement shall commence on the Effective Date and continue for a period of ${termLength}`;
      
      if (formData.autoRenewal) {
        termText += ` (the "Initial Term"), and shall automatically renew for successive one-year periods (each, a "Renewal Term") unless either party provides written notice of non-renewal to the other party at least ${formData.renewalNoticePeriod || "[NOTICE PERIOD]"} days prior to the end of the then-current term.`;
      } else {
        termText += `, unless earlier terminated as provided herein.`;
      }
    } else {
      termText = `5.1 Term. This Agreement shall commence on the Effective Date and continue until [TERMINATION CONDITION], unless earlier terminated as provided herein.`;
    }
    
    let terminationText = "";
    
    if (formData.terminationRights === "both") {
      terminationText = `
5.2 Termination for Breach. Either party may terminate this Agreement if the other party materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof.

5.3 Termination for Convenience. Either party may terminate this Agreement for any or no reason upon sixty (60) days' prior written notice to the other party.`;
    } else if (formData.terminationRights === "licensor-only") {
      terminationText = `
5.2 Termination for Breach. Either party may terminate this Agreement if the other party materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof.

5.3 Termination for Convenience. Licensor may terminate this Agreement for any or no reason upon sixty (60) days' prior written notice to Licensee.`;
    } else if (formData.terminationRights === "licensee-only") {
      terminationText = `
5.2 Termination for Breach. Either party may terminate this Agreement if the other party materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof.

5.3 Termination for Convenience. Licensee may terminate this Agreement for any or no reason upon sixty (60) days' prior written notice to Licensor.`;
    } else if (formData.terminationRights === "breach-only") {
      terminationText = `
5.2 Termination for Breach. Either party may terminate this Agreement if the other party materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof.`;
    } else {
      terminationText = `
5.2 Termination. This Agreement may be terminated as follows:
   [TERMINATION PROVISIONS]`;
    }
    
    return termText + terminationText + `

5.4 Termination for Insolvency. Either party may terminate this Agreement immediately upon written notice if the other party (a) becomes insolvent; (b) makes an assignment for the benefit of creditors; (c) files or has filed against it a petition in bankruptcy or seeking reorganization; (d) has a receiver appointed; or (e) institutes any proceedings for liquidation or winding up.`;
  }

  function generateSecurityMeasuresText() {
    const securityMeasures = formData.securityMeasures;
    
    if (!securityMeasures || securityMeasures.length === 0) {
      return "   (a) Access controls and authentication mechanisms to ensure that only authorized personnel can access the Licensed Data;\n   (b) Encryption of the Licensed Data during transmission and at rest;\n   (c) Regular security assessments and vulnerability testing of systems storing or processing the Licensed Data;\n   (d) Implementation of industry-standard security practices; and\n   (e) Regular training of personnel on data security and privacy best practices.";
    }
    
    let securityText = "";
    let counter = 97; // ASCII code for 'a'
    
    securityMeasures.forEach(measure => {
      securityText += `   (${String.fromCharCode(counter++)}) ${measure};\n`;
    });
    
    return securityText.trim();
  }

  function generateDataProcessingText() {
    let processingText = "The Licensed Data ";
    let processingItems = [];
    
    if (formData.dataPreprocessing) {
      processingItems.push("has been preprocessed to normalize format and structure");
    }
    
    if (formData.dataAnnotation) {
      processingItems.push("includes annotations and labels");
    }
    
    if (formData.dataCleaning) {
      processingItems.push("has been cleaned to remove errors and inconsistencies");
    }
    
    if (processingItems.length === 0) {
      processingItems.push("is provided in its raw form without preprocessing");
    }
    
    processingText += processingItems.join(", ");
    
    if (formData.dataCustomization !== "none") {
      processingText += `. The data ${formData.dataCustomization === "basic" ? "has been lightly customized" : formData.dataCustomization === "moderate" ? "has been moderately customized" : "has been heavily customized"} for Licensee's specific use case`;
    }
    
    return processingText + ".";
  }

  // Generate document text based on current formData
  const documentText = generateDocumentText();

  // Function to create highlighted version of the text based on what was most recently changed
  const createHighlightedText = () => {
    if (!lastChanged) return documentText;

    // Get the field that was last changed
    const fieldName = lastChanged;
    const fieldValue = formData[fieldName];
    
    let highlightedText = documentText;
    
    // Simple highlighting method - locate the field value in the document and wrap it in a highlight span
    if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim() !== '') {
      // Escape special regex characters
      const escapedValue = fieldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Create a regex that looks for the exact field value
      const regex = new RegExp(`(${escapedValue})`, 'g');
      
      // Replace with highlight
      highlightedText = documentText.replace(regex, '<span class="highlight">$1</span>');
    }
    
    return highlightedText;
  };

  // Create highlighted version of text
  const highlightedText = createHighlightedText();

  // Function to copy to clipboard
  const copyToClipboard = () => {
    const textToCopy = documentText;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Document copied to clipboard!"))
      .catch(err => console.error("Error copying to clipboard:", err));
  };

  // Function to download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: formData.documentTitle || "AI Training Data License Agreement",
        fileName: formData.fileName || "AI-Training-Data-License-Agreement"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Function to open consultation booking
  const openConsultation = () => {
    Calendly.initPopupWidget({
      url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
    });
  };

  // Effect to scroll to highlighted text when it changes
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightElement = previewRef.current.querySelector('.highlight');
      if (highlightElement) {
        highlightElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

  // Function to get the formatted date string
  const formattedDate = (() => {
    if (!formData.effectiveDate) return "";
    
    const dateObj = new Date(formData.effectiveDate);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  })();

  // Render the UI
  return (
    <div className="container">
      <h1>AI Training Data License Agreement Generator</h1>
      
      {/* Tab Navigation */}
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`tab-button ${currentTab === index ? 'active' : ''}`}
            onClick={() => setCurrentTab(index)}
          >
            {index + 1}. {tab.label}
          </button>
        ))}
      </div>
      
      <div className="content-container">
        {/* Form Panel */}
        <div className="form-panel">
          {/* Tab 1: Parties Information */}
          {currentTab === 0 && (
            <div className="tab-content">
              <h2>Parties Information</h2>
              
              <div className="form-section">
                <h3>Licensor (Data Owner) Information</h3>
                <div className="form-group">
                  <label htmlFor="licensorCompanyName">Company Name:</label>
                  <input
                    type="text"
                    id="licensorCompanyName"
                    name="licensorCompanyName"
                    value={formData.licensorCompanyName}
                    onChange={handleChange}
                    placeholder="Enter licensor company name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="licensorAddress">Address:</label>
                  <input
                    type="text"
                    id="licensorAddress"
                    name="licensorAddress"
                    value={formData.licensorAddress}
                    onChange={handleChange}
                    placeholder="Enter licensor address"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="licensorState">State/Province:</label>
                    <input
                      type="text"
                      id="licensorState"
                      name="licensorState"
                      value={formData.licensorState}
                      onChange={handleChange}
                      placeholder="Enter state/province"
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="licensorCountry">Country:</label>
                    <input
                      type="text"
                      id="licensorCountry"
                      name="licensorCountry"
                      value={formData.licensorCountry}
                      onChange={handleChange}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Licensee (AI Developer) Information</h3>
                <div className="form-group">
                  <label htmlFor="licenseeCompanyName">Company Name:</label>
                  <input
                    type="text"
                    id="licenseeCompanyName"
                    name="licenseeCompanyName"
                    value={formData.licenseeCompanyName}
                    onChange={handleChange}
                    placeholder="Enter licensee company name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="licenseeAddress">Address:</label>
                  <input
                    type="text"
                    id="licenseeAddress"
                    name="licenseeAddress"
                    value={formData.licenseeAddress}
                    onChange={handleChange}
                    placeholder="Enter licensee address"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="licenseeState">State/Province:</label>
                    <input
                      type="text"
                      id="licenseeState"
                      name="licenseeState"
                      value={formData.licenseeState}
                      onChange={handleChange}
                      placeholder="Enter state/province"
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="licenseeCountry">Country:</label>
                    <input
                      type="text"
                      id="licenseeCountry"
                      name="licenseeCountry"
                      value={formData.licenseeCountry}
                      onChange={handleChange}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="effectiveDate">Effective Date:</label>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          {/* Tab 2: Data Description */}
          {currentTab === 1 && (
            <div className="tab-content">
              <h2>Data Description</h2>
              
              <div className="form-group">
                <label htmlFor="dataDescription">Detailed Description of Data:</label>
                <textarea
                  id="dataDescription"
                  name="dataDescription"
                  value={formData.dataDescription}
                  onChange={handleChange}
                  placeholder="Describe the data being licensed (e.g., text corpus, image dataset, user behavior data)"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dataFormat">Data Format(s):</label>
                <select
                  id="dataFormat"
                  name="dataFormat"
                  multiple
                  value={formData.dataFormat}
                  onChange={handleChange}
                  size="5"
                >
                  <option value="CSV">CSV Files</option>
                  <option value="JSON">JSON Files</option>
                  <option value="XML">XML Files</option>
                  <option value="SQL">SQL Database</option>
                  <option value="Images">Image Files</option>
                  <option value="Audio">Audio Files</option>
                  <option value="Video">Video Files</option>
                  <option value="Text">Text Files</option>
                  <option value="PDF">PDF Documents</option>
                  <option value="API">API Access</option>
                </select>
                <small>Hold Ctrl/Cmd to select multiple formats</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="dataVolume">Data Volume:</label>
                <input
                  type="text"
                  id="dataVolume"
                  name="dataVolume"
                  value={formData.dataVolume}
                  onChange={handleChange}
                  placeholder="E.g., 10GB, 1 million records, 500K images"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dataDomain">Data Domain:</label>
                <input
                  type="text"
                  id="dataDomain"
                  name="dataDomain"
                  value={formData.dataDomain}
                  onChange={handleChange}
                  placeholder="E.g., healthcare, finance, e-commerce, social media"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dataCustomization">Level of Data Customization:</label>
                <select
                  id="dataCustomization"
                  name="dataCustomization"
                  value={formData.dataCustomization}
                  onChange={handleChange}
                >
                  <option value="none">No customization (raw data)</option>
                  <option value="basic">Basic customization</option>
                  <option value="moderate">Moderate customization</option>
                  <option value="extensive">Extensive customization</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Data Processing:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="dataPreprocessing"
                    name="dataPreprocessing"
                    checked={formData.dataPreprocessing}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataPreprocessing">Includes preprocessing</label>
                </div>
                
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="dataAnnotation"
                    name="dataAnnotation"
                    checked={formData.dataAnnotation}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataAnnotation">Includes annotations/labels</label>
                </div>
                
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="dataCleaning"
                    name="dataCleaning"
                    checked={formData.dataCleaning}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataCleaning">Includes data cleaning</label>
                </div>
              </div>
            </div>
          )}
          
          {/* Tab 3: License Terms */}
          {currentTab === 2 && (
            <div className="tab-content">
              <h2>License Terms</h2>
              
              <div className="form-group">
                <label htmlFor="licenseType">License Type:</label>
                <select
                  id="licenseType"
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                >
                  <option value="non-exclusive">Non-exclusive (licensor can license to others)</option>
                  <option value="exclusive">Exclusive (licensor cannot license to others)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="scopeOption">Scope of Use:</label>
                <select
                  id="scopeOption"
                  name="scopeOption"
                  value={formData.scopeOption}
                  onChange={handleChange}
                >
                  <option value="training">Training and development only</option>
                  <option value="training-deployment">Training, development, and deployment</option>
                  <option value="research">Research and development only</option>
                  <option value="comprehensive">Comprehensive (training, development, deployment, and research)</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Derivative Works:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="allowDerivativeWorks"
                    name="allowDerivativeWorks"
                    checked={formData.allowDerivativeWorks}
                    onChange={handleChange}
                  />
                  <label htmlFor="allowDerivativeWorks">Allow creation of derivative works from the data</label>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Redistribution:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="allowRedistribution"
                    name="allowRedistribution"
                    checked={formData.allowRedistribution}
                    onChange={handleChange}
                  />
                  <label htmlFor="allowRedistribution">Allow redistribution of data (limited circumstances)</label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="geographicRestrictions">Geographic Restrictions:</label>
                <select
                  id="geographicRestrictions"
                  name="geographicRestrictions"
                  value={formData.geographicRestrictions}
                  onChange={handleChange}
                >
                  <option value="worldwide">Worldwide (no restrictions)</option>
                  <option value="specific">Specific countries/regions only</option>
                </select>
              </div>
              
              {formData.geographicRestrictions === 'specific' && (
                <div className="form-group">
                  <label htmlFor="specificCountries">Specify Countries/Regions:</label>
                  <input
                    type="text"
                    id="specificCountries"
                    name="specificCountries"
                    value={formData.specificCountries}
                    onChange={handleChange}
                    placeholder="E.g., United States, European Union, Japan"
                  />
                </div>
              )}
              
              <div className="form-group checkbox-group">
                <label>Industry Restrictions:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="industryRestrictions"
                    name="industryRestrictions"
                    checked={formData.industryRestrictions}
                    onChange={handleChange}
                  />
                  <label htmlFor="industryRestrictions">Restrict use in specific industries</label>
                </div>
              </div>
              
              {formData.industryRestrictions && (
                <div className="form-group">
                  <label htmlFor="restrictedIndustries">Restricted Industries:</label>
                  <input
                    type="text"
                    id="restrictedIndustries"
                    name="restrictedIndustries"
                    value={formData.restrictedIndustries}
                    onChange={handleChange}
                    placeholder="E.g., weapons development, surveillance, gambling"
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Tab 4: Usage Rights */}
          {currentTab === 3 && (
            <div className="tab-content">
              <h2>Usage Rights</h2>
              
              <div className="form-group">
                <label htmlFor="modelTypes">Types of AI Models Permitted:</label>
                <select
                  id="modelTypes"
                  name="modelTypes"
                  multiple
                  value={formData.modelTypes}
                  onChange={handleChange}
                  size="5"
                >
                  <option value="language models">Language Models</option>
                  <option value="computer vision models">Computer Vision Models</option>
                  <option value="recommendation systems">Recommendation Systems</option>
                  <option value="classification models">Classification Models</option>
                  <option value="regression models">Regression Models</option>
                  <option value="clustering models">Clustering Models</option>
                  <option value="generative models">Generative Models</option>
                  <option value="reinforcement learning models">Reinforcement Learning Models</option>
                  <option value="forecasting models">Forecasting Models</option>
                  <option value="anomaly detection models">Anomaly Detection Models</option>
                </select>
                <small>Hold Ctrl/Cmd to select multiple model types</small>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Commercial Use:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="commercialUse"
                    name="commercialUse"
                    checked={formData.commercialUse}
                    onChange={handleChange}
                  />
                  <label htmlFor="commercialUse">Allow commercial use of AI models</label>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Internal Use Only:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="internalUseOnly"
                    name="internalUseOnly"
                    checked={formData.internalUseOnly}
                    onChange={handleChange}
                  />
                  <label htmlFor="internalUseOnly">Restrict to internal use only (no external deployment)</label>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Public Deployment:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="publicDeployment"
                    name="publicDeployment"
                    checked={formData.publicDeployment}
                    onChange={handleChange}
                  />
                  <label htmlFor="publicDeployment">Allow deployment in public-facing applications</label>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Academic Use:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="academicUse"
                    name="academicUse"
                    checked={formData.academicUse}
                    onChange={handleChange}
                  />
                  <label htmlFor="academicUse">Allow academic research and publication</label>
                </div>
              </div>
            </div>
          )}
          
          {/* Tab 5: Payment Terms */}
          {currentTab === 4 && (
            <div className="tab-content">
              <h2>Payment Terms</h2>
              
              <div className="form-group">
                <label htmlFor="paymentStructure">Payment Structure:</label>
                <select
                  id="paymentStructure"
                  name="paymentStructure"
                  value={formData.paymentStructure}
                  onChange={handleChange}
                >
                  <option value="one-time">One-time payment</option>
                  <option value="subscription">Subscription (recurring payments)</option>
                  <option value="royalty">Royalty-based (percentage of revenue/profit)</option>
                  <option value="hybrid">Hybrid (initial payment + royalties)</option>
                </select>
              </div>
              
              {(formData.paymentStructure === 'one-time' || formData.paymentStructure === 'subscription' || formData.paymentStructure === 'hybrid') && (
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="currency">Currency:</label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                      <option value="JPY">JPY (Japanese Yen)</option>
                      <option value="CAD">CAD (Canadian Dollar)</option>
                      <option value="AUD">AUD (Australian Dollar)</option>
                      <option value="CNY">CNY (Chinese Yuan)</option>
                    </select>
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="paymentAmount">{formData.paymentStructure === 'hybrid' ? 'Initial Payment Amount:' : 'Payment Amount:'}</label>
                    <input
                      type="text"
                      id="paymentAmount"
                      name="paymentAmount"
                      value={formData.paymentAmount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              )}
              
              {(formData.paymentStructure === 'subscription') && (
                <div className="form-group">
                  <label htmlFor="paymentFrequency">Payment Frequency:</label>
                  <select
                    id="paymentFrequency"
                    name="paymentFrequency"
                    value={formData.paymentFrequency}
                    onChange={handleChange}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annual">Semi-annually</option>
                    <option value="annual">Annually</option>
                  </select>
                </div>
              )}
              
              {(formData.paymentStructure === 'royalty' || formData.paymentStructure === 'hybrid') && (
                <>
                  <div className="form-group">
                    <label htmlFor="royaltyPercentage">Royalty Percentage:</label>
                    <input
                      type="text"
                      id="royaltyPercentage"
                      name="royaltyPercentage"
                      value={formData.royaltyPercentage}
                      onChange={handleChange}
                      placeholder="E.g., 5"
                    />
                    <small>% of selected revenue metric</small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="metricForRoyalty">Royalty Calculation Basis:</label>
                    <select
                      id="metricForRoyalty"
                      name="metricForRoyalty"
                      value={formData.metricForRoyalty}
                      onChange={handleChange}
                    >
                      <option value="revenue">Gross Revenue</option>
                      <option value="net-revenue">Net Revenue</option>
                      <option value="profit">Net Profit</option>
                    </select>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="minimumPayment">Minimum Royalty Payment:</label>
                      <input
                        type="text"
                        id="minimumPayment"
                        name="minimumPayment"
                        value={formData.minimumPayment}
                        onChange={handleChange}
                        placeholder="Enter amount (if any)"
                      />
                    </div>
                    
                    <div className="form-group half">
                      <label htmlFor="paymentFrequency">Payment Frequency:</label>
                      <select
                        id="paymentFrequency"
                        name="paymentFrequency"
                        value={formData.paymentFrequency}
                        onChange={handleChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="semi-annual">Semi-annually</option>
                        <option value="annual">Annually</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Tab 6: Term & Termination */}
          {currentTab === 5 && (
            <div className="tab-content">
              <h2>Term & Termination</h2>
              
              <div className="form-group">
                <label htmlFor="licenseTermOption">License Term:</label>
                <select
                  id="licenseTermOption"
                  name="licenseTermOption"
                  value={formData.licenseTermOption}
                  onChange={handleChange}
                >
                  <option value="fixed">Fixed Term</option>
                  <option value="perpetual">Perpetual (no end date)</option>
                </select>
              </div>
              
              {formData.licenseTermOption === 'fixed' && (
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="licenseTermYears">Years:</label>
                    <select
                      id="licenseTermYears"
                      name="licenseTermYears"
                      value={formData.licenseTermYears}
                      onChange={handleChange}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="licenseTermMonths">Months:</label>
                    <select
                      id="licenseTermMonths"
                      name="licenseTermMonths"
                      value={formData.licenseTermMonths}
                      onChange={handleChange}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="9">9</option>
                    </select>
                  </div>
                </div>
              )}
              
              {formData.licenseTermOption === 'fixed' && (
                <div className="form-group checkbox-group">
                  <label>Auto-Renewal:</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="autoRenewal"
                      name="autoRenewal"
                      checked={formData.autoRenewal}
                      onChange={handleChange}
                    />
                    <label htmlFor="autoRenewal">Automatically renew at end of term</label>
                  </div>
                </div>
              )}
              
              {formData.licenseTermOption === 'fixed' && formData.autoRenewal && (
                <div className="form-group">
                  <label htmlFor="renewalNoticePeriod">Notice Period for Non-Renewal (days):</label>
                  <input
                    type="text"
                    id="renewalNoticePeriod"
                    name="renewalNoticePeriod"
                    value={formData.renewalNoticePeriod}
                    onChange={handleChange}
                    placeholder="E.g., 30, 60, 90"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="terminationRights">Termination Rights:</label>
                <select
                  id="terminationRights"
                  name="terminationRights"
                  value={formData.terminationRights}
                  onChange={handleChange}
                >
                  <option value="both">Both parties can terminate for convenience</option>
                  <option value="licensor-only">Only licensor can terminate for convenience</option>
                  <option value="licensee-only">Only licensee can terminate for convenience</option>
                  <option value="breach-only">Termination for breach only (no convenience termination)</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Tab 7: Confidentiality & Security */}
          {currentTab === 6 && (
            <div className="tab-content">
              <h2>Confidentiality & Security</h2>
              
              <div className="form-group">
                <label htmlFor="confidentialityTerm">Confidentiality Term (years after termination):</label>
                <select
                  id="confidentialityTerm"
                  name="confidentialityTerm"
                  value={formData.confidentialityTerm}
                  onChange={handleChange}
                >
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="5">5 years</option>
                  <option value="10">10 years</option>
                  <option value="perpetual">Perpetual</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="securityMeasures">Required Security Measures:</label>
                <select
                  id="securityMeasures"
                  name="securityMeasures"
                  multiple
                  value={formData.securityMeasures}
                  onChange={handleChange}
                  size="6"
                >
                  <option value="Access controls and authentication mechanisms to ensure that only authorized personnel can access the Licensed Data">Access controls</option>
                  <option value="Encryption of the Licensed Data during transmission and at rest">Encryption in transit and at rest</option>
                  <option value="Regular security assessments and vulnerability testing of systems storing or processing the Licensed Data">Regular security assessments</option>
                  <option value="Implementation of industry-standard security practices">Industry-standard security practices</option>
                  <option value="Regular training of personnel on data security and privacy best practices">Regular security training</option>
                  <option value="Physical security measures to prevent unauthorized access to facilities where the Licensed Data is stored">Physical security measures</option>
                  <option value="Data loss prevention measures and backup procedures">Data loss prevention & backups</option>
                  <option value="Incident response plan for data breaches">Incident response plan</option>
                  <option value="Compliance with specific security standards (e.g., ISO 27001, SOC 2, NIST)">Specific security standards compliance</option>
                </select>
                <small>Hold Ctrl/Cmd to select multiple measures</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="breachNotification">Breach Notification Timeframe (hours):</label>
                <select
                  id="breachNotification"
                  name="breachNotification"
                  value={formData.breachNotification}
                  onChange={handleChange}
                >
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">72 hours</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Compliance Certification:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="certificationRequired"
                    name="certificationRequired"
                    checked={formData.certificationRequired}
                    onChange={handleChange}
                  />
                  <label htmlFor="certificationRequired">Require periodic compliance certification</label>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>Audit Rights:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="auditRights"
                    name="auditRights"
                    checked={formData.auditRights}
                    onChange={handleChange}
                  />
                  <label htmlFor="auditRights">Licensor has right to audit compliance</label>
                </div>
              </div>
              
              {formData.auditRights && (
                <div className="form-group">
                  <label htmlFor="auditFrequency">Audit Frequency:</label>
                  <select
                    id="auditFrequency"
                    name="auditFrequency"
                    value={formData.auditFrequency}
                    onChange={handleChange}
                  >
                    <option value="annual">Annual</option>
                    <option value="semi-annual">Semi-annual</option>
                  </select>
                </div>
              )}
            </div>
          )}
          
          {/* Tab 8: Warranties & Liabilities */}
          {currentTab === 7 && (
            <div className="tab-content">
              <h2>Warranties & Liabilities</h2>
              
              <div className="form-section">
                <h3>Warranties</h3>
                
                <div className="form-group checkbox-group">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="ownershipWarranty"
                      name="ownershipWarranty"
                      checked={formData.ownershipWarranty}
                      onChange={handleChange}
                    />
                    <label htmlFor="ownershipWarranty">Licensor has the right to license the data</label>
                  </div>
                  
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="noInfringementWarranty"
                      name="noInfringementWarranty"
                      checked={formData.noInfringementWarranty}
                      onChange={handleChange}
                    />
                    <label htmlFor="noInfringementWarranty">Licensed data does not infringe third-party rights</label>
                  </div>
                  
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="complianceWarranty"
                      name="complianceWarranty"
                      checked={formData.complianceWarranty}
                      onChange={handleChange}
                    />
                    <label htmlFor="complianceWarranty">Data was collected in compliance with laws</label>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Indemnification</h3>
                
                <div className="form-group checkbox-group">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="indemnificationByLicensor"
                      name="indemnificationByLicensor"
                      checked={formData.indemnificationByLicensor}
                      onChange={handleChange}
                    />
                    <label htmlFor="indemnificationByLicensor">Licensor indemnifies licensee for third-party IP claims</label>
                  </div>
                  
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="indemnificationByLicensee"
                      name="indemnificationByLicensee"
                      checked={formData.indemnificationByLicensee}
                      onChange={handleChange}
                    />
                    <label htmlFor="indemnificationByLicensee">Licensee indemnifies licensor for misuse of data</label>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Limitation of Liability</h3>
                
                <div className="form-group checkbox-group">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="limitationOfLiability"
                      name="limitationOfLiability"
                      checked={formData.limitationOfLiability}
                      onChange={handleChange}
                    />
                    <label htmlFor="limitationOfLiability">Include limitation of liability clause</label>
                  </div>
                </div>
                
                {formData.limitationOfLiability && (
                  <div className="form-group">
                    <label htmlFor="limitationAmount">Liability Cap:</label>
                    <select
                      id="limitationAmount"
                      name="limitationAmount"
                      value={formData.limitationAmount}
                      onChange={handleChange}
                    >
                      <option value="fees paid">Fees paid in last 12 months</option>
                      <option value="multiple">3x fees paid in last 12 months</option>
                      <option value="fixed">Fixed amount (to be specified)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Tab 9: Additional Terms */}
          {currentTab === 8 && (
            <div className="tab-content">
              <h2>Additional Terms</h2>
              
              <div className="form-group">
                <label htmlFor="governingLaw">Governing Law:</label>
                <input
                  type="text"
                  id="governingLaw"
                  name="governingLaw"
                  value={formData.governingLaw}
                  onChange={handleChange}
                  placeholder="E.g., State of California, United States"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="disputeResolution">Dispute Resolution Method:</label>
                <select
                  id="disputeResolution"
                  name="disputeResolution"
                  value={formData.disputeResolution}
                  onChange={handleChange}
                >
                  <option value="arbitration">Binding Arbitration</option>
                  <option value="litigation">Litigation in Courts</option>
                </select>
              </div>
              
              {formData.disputeResolution === 'arbitration' && (
                <div className="form-group">
                  <label htmlFor="arbitrationVenue">Arbitration Venue:</label>
                  <input
                    type="text"
                    id="arbitrationVenue"
                    name="arbitrationVenue"
                    value={formData.arbitrationVenue}
                    onChange={handleChange}
                    placeholder="E.g., San Francisco, California"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="modificationRequirement">Contract Modification Requirement:</label>
                <select
                  id="modificationRequirement"
                  name="modificationRequirement"
                  value={formData.modificationRequirement}
                  onChange={handleChange}
                >
                  <option value="written">Written and signed by both parties</option>
                  <option value="electronic">Can be modified electronically</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="assignability">Assignability:</label>
                <select
                  id="assignability"
                  name="assignability"
                  value={formData.assignability}
                  onChange={handleChange}
                >
                  <option value="consent">Requires consent of other party</option>
                  <option value="acquisition">Allowed in case of acquisition/merger</option>
                  <option value="unrestricted">Unrestricted</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="forcesMajeure"
                    name="forcesMajeure"
                    checked={formData.forcesMajeure}
                    onChange={handleChange}
                  />
                  <label htmlFor="forcesMajeure">Include Force Majeure clause</label>
                </div>
                
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="publicityRights"
                    name="publicityRights"
                    checked={formData.publicityRights}
                    onChange={handleChange}
                  />
                  <label htmlFor="publicityRights">Allow publicity about this agreement</label>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Document Formatting</h3>
                
                <div className="form-group">
                  <label htmlFor="documentTitle">Document Title:</label>
                  <input
                    type="text"
                    id="documentTitle"
                    name="documentTitle"
                    value={formData.documentTitle}
                    onChange={handleChange}
                    placeholder="AI Training Data License Agreement"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fileName">File Name:</label>
                  <input
                    type="text"
                    id="fileName"
                    name="fileName"
                    value={formData.fileName}
                    onChange={handleChange}
                    placeholder="AI-Training-Data-License-Agreement"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Tab 10: Risk Assessment & Finalization */}
          {currentTab === 9 && (
            <div className="tab-content">
              <h2>Agreement Review & Risk Assessment</h2>
              
              <div className="risk-assessment">
                <h3>Key Terms Review</h3>
                
                <div className="review-item">
                  <div className="review-label">Parties:</div>
                  <div className="review-value">
                    <strong>Licensor:</strong> {formData.licensorCompanyName || "Not specified"}<br />
                    <strong>Licensee:</strong> {formData.licenseeCompanyName || "Not specified"}
                  </div>
                  <div className={`review-risk ${!formData.licensorCompanyName || !formData.licenseeCompanyName ? 'high' : 'low'}`}>
                    {!formData.licensorCompanyName || !formData.licenseeCompanyName ? 'Missing party information' : 'Complete'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">Data Description:</div>
                  <div className="review-value">{formData.dataDescription || "Not specified"}</div>
                  <div className={`review-risk ${!formData.dataDescription ? 'high' : 'low'}`}>
                    {!formData.dataDescription ? 'Missing data description' : 'Complete'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">License Type:</div>
                  <div className="review-value">
                    {formData.licenseType === 'exclusive' ? 'Exclusive' : 'Non-exclusive'}
                  </div>
                  <div className={`review-risk ${formData.licenseType === 'exclusive' ? 'medium' : 'low'}`}>
                    {formData.licenseType === 'exclusive' ? 'Exclusive license may limit licensor\'s ability to license to others' : 'Non-exclusive license allows licensing to multiple parties'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">Term:</div>
                  <div className="review-value">
                    {formData.licenseTermOption === 'perpetual' ? 
                      'Perpetual' : 
                      `${formData.licenseTermYears !== '0' ? formData.licenseTermYears + ' year(s)' : ''}${formData.licenseTermYears !== '0' && formData.licenseTermMonths !== '0' ? ' and ' : ''}${formData.licenseTermMonths !== '0' ? formData.licenseTermMonths + ' month(s)' : ''}`}
                  </div>
                  <div className={`review-risk ${formData.licenseTermOption === 'perpetual' ? 'medium' : (formData.licenseTermYears === '0' && formData.licenseTermMonths === '0') ? 'high' : 'low'}`}>
                    {formData.licenseTermOption === 'perpetual' ? 
                      'Perpetual licenses may create indefinite obligations' : 
                      (formData.licenseTermYears === '0' && formData.licenseTermMonths === '0') ? 
                        'Term length not specified' : 
                        'Fixed term provides clarity on duration of obligations'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">Payment:</div>
                  <div className="review-value">
                    {formData.paymentStructure === 'one-time' ? 
                      `One-time payment of ${formData.paymentAmount ? formData.currency + ' ' + formData.paymentAmount : 'amount not specified'}` : 
                      formData.paymentStructure === 'subscription' ? 
                        `${formData.paymentFrequency} payments of ${formData.paymentAmount ? formData.currency + ' ' + formData.paymentAmount : 'amount not specified'}` : 
                        formData.paymentStructure === 'royalty' ? 
                          `Royalty of ${formData.royaltyPercentage || 'percentage not specified'}% of ${formData.metricForRoyalty === 'revenue' ? 'gross revenue' : formData.metricForRoyalty === 'net-revenue' ? 'net revenue' : 'net profit'}` : 
                          `Initial payment of ${formData.paymentAmount ? formData.currency + ' ' + formData.paymentAmount : 'amount not specified'} plus royalty of ${formData.royaltyPercentage || 'percentage not specified'}%`}
                  </div>
                  <div className={`review-risk ${(formData.paymentStructure === 'one-time' || formData.paymentStructure === 'subscription' || formData.paymentStructure === 'hybrid') && !formData.paymentAmount ? 'high' : (formData.paymentStructure === 'royalty' || formData.paymentStructure === 'hybrid') && !formData.royaltyPercentage ? 'high' : 'low'}`}>
                    {(formData.paymentStructure === 'one-time' || formData.paymentStructure === 'subscription' || formData.paymentStructure === 'hybrid') && !formData.paymentAmount ? 
                      'Payment amount not specified' : 
                      (formData.paymentStructure === 'royalty' || formData.paymentStructure === 'hybrid') && !formData.royaltyPercentage ? 
                        'Royalty percentage not specified' : 
                        'Payment terms complete'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">Usage Rights:</div>
                  <div className="review-value">
                    <strong>Commercial Use:</strong> {formData.commercialUse ? 'Allowed' : 'Not allowed'}<br />
                    <strong>Internal Use Only:</strong> {formData.internalUseOnly ? 'Yes' : 'No'}<br />
                    <strong>Public Deployment:</strong> {formData.publicDeployment ? 'Allowed' : 'Not allowed'}<br />
                  </div>
                  <div className={`review-risk ${formData.internalUseOnly && formData.publicDeployment ? 'high' : 'low'}`}>
                    {formData.internalUseOnly && formData.publicDeployment ? 
                      'Conflict: Internal use only conflicts with public deployment' : 
                      'Usage rights are consistent'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">Data Security:</div>
                  <div className="review-value">
                    {formData.securityMeasures.length > 0 ? 
                      formData.securityMeasures.length + ' security measures specified' : 
                      'Default security measures'}
                  </div>
                  <div className={`review-risk ${formData.securityMeasures.length === 0 ? 'medium' : 'low'}`}>
                    {formData.securityMeasures.length === 0 ? 
                      'Consider specifying security requirements' : 
                      'Security measures specified'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">Warranties:</div>
                  <div className="review-value">
                    <strong>Ownership:</strong> {formData.ownershipWarranty ? 'Yes' : 'No'}<br />
                    <strong>Non-infringement:</strong> {formData.noInfringementWarranty ? 'Yes' : 'No'}<br />
                    <strong>Compliance:</strong> {formData.complianceWarranty ? 'Yes' : 'No'}<br />
                  </div>
                  <div className={`review-risk ${!formData.ownershipWarranty ? 'high' : !formData.noInfringementWarranty || !formData.complianceWarranty ? 'medium' : 'low'}`}>
                    {!formData.ownershipWarranty ? 
                      'Missing ownership warranty is high risk' : 
                      !formData.noInfringementWarranty || !formData.complianceWarranty ? 
                        'Consider including all warranties' : 
                        'Warranty provisions complete'}
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="review-label">Governing Law:</div>
                  <div className="review-value">{formData.governingLaw || "Not specified"}</div>
                  <div className={`review-risk ${!formData.governingLaw ? 'medium' : 'low'}`}>
                    {!formData.governingLaw ? 'Governing law not specified' : 'Complete'}
                  </div>
                </div>
              </div>
              
              <div className="recommendations">
                <h3>Key Recommendations</h3>
                <ul>
                  {(!formData.licensorCompanyName || !formData.licenseeCompanyName) && 
                    <li className="high">Complete all party information to ensure the agreement is legally binding.</li>}
                    
                  {!formData.dataDescription && 
                    <li className="high">Add a detailed description of the licensed data to clarify what is being licensed.</li>}
                    
                  {formData.licenseType === 'exclusive' && 
                    <li className="medium">Consider the implications of an exclusive license which prevents licensing to other parties.</li>}
                    
                  {formData.licenseTermOption === 'perpetual' && 
                    <li className="medium">Perpetual licenses create long-term obligations. Consider adding termination for convenience rights.</li>}
                    
                  {(formData.licenseTermOption === 'fixed' && formData.licenseTermYears === '0' && formData.licenseTermMonths === '0') && 
                    <li className="high">Specify the term length to establish the duration of the agreement.</li>}
                    
                  {((formData.paymentStructure === 'one-time' || formData.paymentStructure === 'subscription' || formData.paymentStructure === 'hybrid') && !formData.paymentAmount) && 
                    <li className="high">Specify the payment amount to ensure proper compensation.</li>}
                    
                  {((formData.paymentStructure === 'royalty' || formData.paymentStructure === 'hybrid') && !formData.royaltyPercentage) && 
                    <li className="high">Specify the royalty percentage for royalty-based payments.</li>}
                    
                  {(formData.internalUseOnly && formData.publicDeployment) && 
                    <li className="high">Resolve the conflict between "internal use only" and "public deployment" settings.</li>}
                    
                  {(formData.securityMeasures.length === 0) && 
                    <li className="medium">Consider specifying security requirements to protect sensitive data.</li>}
                    
                  {(!formData.ownershipWarranty) && 
                    <li className="high">Include an ownership warranty to ensure the licensor has the right to license the data.</li>}
                    
                  {(!formData.noInfringementWarranty) && 
                    <li className="medium">Consider adding a non-infringement warranty to protect against third-party claims.</li>}
                    
                  {(!formData.complianceWarranty) && 
                    <li className="medium">Consider adding a compliance warranty to ensure the data was collected legally.</li>}
                    
                  {(!formData.governingLaw) && 
                    <li className="medium">Specify the governing law to establish which jurisdiction's laws apply.</li>}
                    
                  {(formData.disputeResolution === 'arbitration' && !formData.arbitrationVenue) && 
                    <li className="medium">Specify the arbitration venue to establish where disputes will be resolved.</li>}
                </ul>
              </div>
              
              <div className="legal-notice">
                <h3>Important Legal Notice</h3>
                <p>This document generator creates a template that should be reviewed by a qualified attorney before use. The generated agreement may need customization based on your specific circumstances, applicable laws, and regulations. By using this generator, you acknowledge that:</p>
                <ul>
                  <li>This is not legal advice and does not create an attorney-client relationship.</li>
                  <li>AI training data licensing involves complex legal considerations including intellectual property rights, privacy laws, and regulatory compliance.</li>
                  <li>Laws regarding AI and data licensing vary by jurisdiction and are rapidly evolving.</li>
                  <li>For complex licensing scenarios, high-value datasets, or cross-border arrangements, professional legal advice is strongly recommended.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Preview Panel */}
        <div className="preview-panel" ref={previewRef}>
          <h2>Live Preview</h2>
          <div 
            className="document-preview" 
            dangerouslySetInnerHTML={{ __html: highlightedText.replace(/\n/g, '<br>') }} 
          />
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button 
          onClick={prevTab} 
          className="nav-button prev-button"
          disabled={currentTab === 0}
        >
          <i data-feather="chevron-left"></i>
          Previous
        </button>
        
        <button 
          onClick={openConsultation} 
          className="nav-button consult-button"
        >
          <i data-feather="message-circle"></i>
          Consultation
        </button>
        
        <button 
          onClick={copyToClipboard} 
          className="nav-button copy-button"
        >
          <i data-feather="copy"></i>
          Copy
        </button>
        
        <button 
          onClick={downloadAsWord} 
          className="nav-button download-button"
        >
          <i data-feather="file-text"></i>
          Download
        </button>
        
        <button 
          onClick={nextTab} 
          className="nav-button next-button"
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <i data-feather="chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  
  // Initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});
