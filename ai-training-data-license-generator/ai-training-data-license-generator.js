// AI Training Data License Agreement Generator
const { useState, useEffect, useRef } = React;

// Simplified persistence implementation
// Store form data in a global variable that persists across tab changes
let savedFormData = null;

// Try to load from localStorage on initial script execution (outside of component)
try {
  const storedData = localStorage.getItem('aiTrainingDataLicenseFormData');
  if (storedData) {
    savedFormData = JSON.parse(storedData);
    console.log("Loaded form data from localStorage");
  }
} catch (error) {
  console.error("Failed to load form data from localStorage:", error);
}

// Icon component
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props} className={`icon ${props.className || ''}`}></i>
  );
};

// Main Application Component
const App = () => {
  // Tab configuration
  const tabs = [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'data-description', label: 'Data Description' },
    { id: 'license-terms', label: 'License Terms' },
    { id: 'data-usage', label: 'Data Usage' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'warranties', label: 'Warranties' },
    { id: 'finalization', label: 'Finalization' }
  ];

  // Default form data
  const defaultFormData = {
    // Tab 1: Basic Info
    licensorName: 'ABC Data Corp',
    licensorEntity: 'Corporation',
    licensorAddress: '123 Data Street, San Francisco',
    licensorState: 'California',
    licenseeCompany: 'XYZ AI Solutions',
    licenseeEntity: 'Corporation',
    licenseeAddress: '456 Tech Avenue, Seattle',
    licenseeState: 'Washington',
    effectiveDate: '',
    
    // Tab 2: Data Description
    datasetName: 'Alpha Dataset',
    datasetDescription: 'Comprehensive collection of training data for AI models',
    dataOrigin: 'proprietary',
    dataAccessMethod: 'api',
    dataFormat: 'json',
    dataSizeGB: '50',
    dataUpdateFrequency: 'none',
    dataQualityWarranty: true,
    
    // Tab 3: License Terms
    licenseType: 'non-exclusive',
    sublicensing: 'not-permitted',
    geographicScope: 'worldwide',
    industryRestrictions: 'none',
    dataTypes: {
      text: true,
      images: true,
      audio: false,
      video: false,
      userGenerated: true,
      proprietaryContent: false,
      personalData: false,
      anonymizedData: true,
      structuredData: true,
      unstructuredData: false
    },
    
    // Tab 4: Data Usage
    purposeRestrictions: 'specific-models',
    modelTypes: {
      generativeText: true,
      generativeImage: false,
      generativeAudio: false,
      generativeVideo: false,
      classTrain: false,
      dataAnalytics: false,
      predictiveModels: false,
      customizedSpecific: false,
      languageModels: true,
      computerVision: false,
      sentimentAnalysis: false,
      recommendationSystems: false,
      naturalLanguageProcessing: true
    },
    usagePurposes: {
      research: true,
      commercial: true,
      internalUse: true,
      publicServices: false,
      militaryApplications: false,
      governmentSurveillance: false
    },
    ownershipModels: 'licensee-owns',
    attributionRequired: 'no',
    dataRetention: 'unlimited',
    
    // Tab 5: Compensation
    compensationType: 'one-time',
    initialFee: '50000',
    royaltyPercent: '5',
    minimumGuarantee: '10000',
    term: '3',
    termUnit: 'years',
    terminationRights: 'both-parties',
    renewalTerms: 'automatic',
    
    // Tab 6: Warranties
    licensorWarranty: 'limited',
    rightsToClaim: 'all-necessary-rights',
    dataComplianceWarranty: true,
    indemnification: 'mutual',
    liabilityLimit: 'fees-paid',
    disputeResolution: 'arbitration',
    governingLaw: '',
    
    // Document options
    fileName: 'AI-Training-Data-License-Agreement',
    documentTitle: 'AI Training Data License Agreement'
  };

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // Use the global savedFormData or defaultFormData if none exists
  const [formData, setFormData] = useState(() => {
    return savedFormData || defaultFormData;
  });
  
  // State for tracking last changed field
  const [lastChanged, setLastChanged] = useState(null);
  
  // State for document text
  const [documentText, setDocumentText] = useState('');
  
  // Reference for preview div
  const previewRef = useRef(null);
  
  // Function to save form data both in memory and localStorage
  const saveFormData = (data) => {
    // Update the global variable
    savedFormData = data;
    
    // Save to localStorage
    try {
      localStorage.setItem('aiTrainingDataLicenseFormData', JSON.stringify(data));
      console.log("Form data saved to localStorage");
    } catch (error) {
      console.error("Failed to save form data to localStorage:", error);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    
    let updatedFormData;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      updatedFormData = {
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      };
    } else {
      updatedFormData = {
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      };
    }
    
    // Update state
    setFormData(updatedFormData);
    
    // Save updated data
    saveFormData(updatedFormData);
  };
  
  // Reset form to defaults
  const resetForm = () => {
    if (confirm('This will reset all form fields to default values. Continue?')) {
      setFormData(defaultFormData);
      saveFormData(defaultFormData);
      try {
        localStorage.removeItem('aiTrainingDataLicenseFormData');
        console.log("Form data reset and removed from localStorage");
      } catch (error) {
        console.error("Failed to remove form data from localStorage:", error);
      }
    }
  };
  
  // Navigation functions
  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToTab = (index) => {
    setCurrentTab(index);
    window.scrollTo(0, 0);
  };
  
  // Copy document text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText)
      .then(() => {
        alert('Document copied to clipboard successfully!');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy to clipboard. Please try again or use the download option.');
      });
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      if (window.generateWordDoc) {
        window.generateWordDoc(documentText, {
          documentTitle: formData.documentTitle,
          fileName: formData.fileName
        });
      } else {
        alert("Word document generator is not available.");
      }
    } catch (error) {
      console.error('Error downloading Word document:', error);
      alert('Error generating Word document. Please try again or use the download option.');
    }
  };
  
  // Open Calendly widget
  const openCalendly = () => {
    window.open("https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1", "_blank");
  };

  // Generate document text whenever form data changes
  useEffect(() => {
    const formatDate = (dateString) => {
      if (!dateString) return new Date().toLocaleDateString('en-US');
      return new Date(dateString).toLocaleDateString('en-US');
    };
    
    // Helper function to format lists
    const formatList = (items, conjunction = 'and') => {
      const filtered = Object.entries(items)
        .filter(([, isSelected]) => isSelected)
        .map(([key]) => {
          return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        });
      
      if (filtered.length === 0) return 'None';
      if (filtered.length === 1) return filtered[0];
      
      return filtered.slice(0, -1).join(', ') + ` ${conjunction} ` + filtered.slice(-1);
    };
    
    // Title and basic info
    let text = `AI TRAINING DATA LICENSE AGREEMENT\n\n`;
    
    // Date and Parties
    text += `This AI Training Data License Agreement (the "Agreement") is entered into as of ${formData.effectiveDate ? formatDate(formData.effectiveDate) : '[DATE]'} (the "Effective Date"), by and between:\n\n`;
    
    text += `${formData.licensorName || '[LICENSOR NAME]'}, a ${formData.licensorEntity.toLowerCase()} having its principal place of business at ${formData.licensorAddress || '[ADDRESS]'}, ${formData.licensorState || '[STATE/JURISDICTION]'} (the "Licensor"), and\n\n`;
    
    text += `${formData.licenseeCompany || '[LICENSEE NAME]'}, a ${formData.licenseeEntity.toLowerCase()} having its principal place of business at ${formData.licenseeAddress || '[ADDRESS]'}, ${formData.licenseeState || '[STATE/JURISDICTION]'} (the "Licensee").\n\n`;
    
    // Recitals
    text += `WHEREAS, Licensor owns or controls certain data that may be useful for artificial intelligence training purposes; and\n\n`;
    
    text += `WHEREAS, Licensee desires to obtain a license to use such data for developing, training, and improving artificial intelligence systems and models; and\n\n`;
    
    text += `WHEREAS, Licensor is willing to grant such license subject to the terms and conditions set forth herein;\n\n`;
    
    text += `NOW, THEREFORE, in consideration of the mutual covenants contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:\n\n`;
    
    // 1. Definitions
    text += `1. DEFINITIONS\n\n`;
    
    text += `1.1 "Data" means the information, materials, content, and datasets provided by Licensor to Licensee under this Agreement, specifically the ${formData.datasetName || '[DATASET NAME]'}, which includes ${formatList(formData.dataTypes, 'and')}.\n\n`;
    
    text += `1.2 "Dataset" means the ${formData.datasetName || '[DATASET NAME]'}, which is described as ${formData.datasetDescription || 'a comprehensive collection of data for AI training purposes'}, with an approximate size of ${formData.dataSizeGB || '[SIZE]'} gigabytes, provided in ${formData.dataFormat || '[FORMAT]'} format.\n\n`;
    
    text += `1.3 "AI System" means any machine learning model, neural network, or artificial intelligence algorithm or software developed, trained, or improved using the Data.\n\n`;
    
    text += `1.4 "Training" means the process of using the Data to develop, test, improve, or otherwise inform the development of AI Systems.\n\n`;
    
    // 2. License Grant
    text += `2. LICENSE GRANT\n\n`;
    
    // Determine license text based on selected options
    let licenseText = '';
    if (formData.licenseType === 'non-exclusive') {
      licenseText = `2.1 Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a non-exclusive, `;
    } else if (formData.licenseType === 'exclusive') {
      licenseText = `2.1 Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee an exclusive, `;
    } else if (formData.licenseType === 'sole') {
      licenseText = `2.1 Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a sole, `;
    }
    
    licenseText += `${formData.sublicensing === 'permitted' ? 'sublicensable, ' : ''}`;
    licenseText += `${formData.geographicScope === 'worldwide' ? 'worldwide, ' : `limited to ${formData.geographicScope || '[GEOGRAPHY]'}, `}`;
    licenseText += `license during the Term to use the Data solely for the purpose of Training AI Systems as further specified in Section 3.\n\n`;
    
    text += licenseText;
    
    // Sublicensing details
    if (formData.sublicensing === 'limited-permitted') {
      text += `2.2 Licensee may sublicense the rights granted herein to its contractors and service providers solely for the purpose of Training AI Systems on behalf of Licensee, provided that Licensee ensures that all such sublicensees are bound by terms no less protective of Licensor's rights than the terms of this Agreement.\n\n`;
    } else if (formData.sublicensing === 'not-permitted') {
      text += `2.2 Licensee shall not sublicense, distribute, sell, lease, or otherwise make the Data available to any third party without Licensor's prior written consent.\n\n`;
    }
    
    // 3. Permitted Uses
    text += `3. PERMITTED USES AND RESTRICTIONS\n\n`;
    
    // Add more details to the permitted uses section based on formData
    if (formData.purposeRestrictions === 'specific-models') {
      text += `3.1 Permitted Uses. Licensee may use the Data solely for Training AI Systems in the following categories: ${formatList(formData.modelTypes, 'and')}.\n\n`;
    } else if (formData.purposeRestrictions === 'all-ai') {
      text += `3.1 Permitted Uses. Licensee may use the Data for Training any AI Systems within Licensee's business operations.\n\n`;
    } else if (formData.purposeRestrictions === 'product-specific') {
      text += `3.1 Permitted Uses. Licensee may use the Data solely for Training AI Systems specifically for use in Licensee's products and services.\n\n`;
    }
    
    // Usage purposes
    const usagePurposesList = formatList(formData.usagePurposes, 'and');
    if (usagePurposesList !== 'None') {
      text += `3.2 Usage Purposes. Licensee may use the Data and any AI Systems trained using the Data for the following purposes: ${usagePurposesList}.\n\n`;
    }
    
    // Industry restrictions
    if (formData.industryRestrictions !== 'none') {
      text += `3.3 Industry Restrictions. Licensee shall not use the Data or any AI Systems trained using the Data in the following industries or sectors: ${formData.industryRestrictions}.\n\n`;
    }
    
    text += `3.4 Prohibited Uses. Licensee shall not use the Data to Train AI Systems that are designed to: (a) generate deepfakes or impersonate specific individuals; (b) promote discrimination, harassment, or violence; (c) violate applicable laws or regulations; or (d) infringe upon third-party intellectual property or privacy rights.\n\n`;
    
    // Attribution requirements
    if (formData.attributionRequired === 'yes') {
      text += `3.5 Attribution. Licensee shall provide attribution to Licensor in any public-facing documentation or marketing materials that reference AI Systems trained using the Data. The format of such attribution shall be: "Trained in part using data licensed from ${formData.licensorName || '[LICENSOR]'}."\n\n`;
    }
    
    // Data access method
    text += `3.6 Data Access. Licensor shall provide Licensee with access to the Data via ${formData.dataAccessMethod === 'api' ? 'an application programming interface (API)' : formData.dataAccessMethod === 'download' ? 'a secure download link' : formData.dataAccessMethod === 'physical' ? 'physical storage media' : '[ACCESS METHOD]'}. `;
    
    // Data updates
    if (formData.dataUpdateFrequency === 'none') {
      text += `Licensor shall not be obligated to provide any updates or modifications to the Data during the Term.\n\n`;
    } else {
      text += `Licensor shall provide updates to the Data on a ${formData.dataUpdateFrequency} basis during the Term.\n\n`;
    }
    
    // Data retention
    if (formData.dataRetention === 'during-term') {
      text += `3.7 Data Retention. Licensee may retain and use the Data only during the Term of this Agreement and shall delete or return all copies of the Data upon termination or expiration of this Agreement.\n\n`;
    } else if (formData.dataRetention === 'perpetual') {
      text += `3.7 Data Retention. Licensee may retain and use the Data in perpetuity, even after the termination or expiration of this Agreement, subject to the restrictions set forth herein.\n\n`;
    } else if (formData.dataRetention === 'limited-period') {
      text += `3.7 Data Retention. Licensee may retain and use the Data during the Term of this Agreement and for a period of [PERIOD] thereafter, after which Licensee shall delete or return all copies of the Data.\n\n`;
    }
    
    // 4. Ownership
    text += `4. OWNERSHIP\n\n`;
    
    if (formData.ownershipModels === 'licensee-owns') {
      text += `4.1 AI Systems. Licensee shall own all right, title, and interest in and to any AI Systems developed, trained, or improved using the Data, including all intellectual property rights therein. Licensor expressly disclaims any rights in AI Systems developed by Licensee.\n\n`;
    } else if (formData.ownershipModels === 'licensor-royalty') {
      text += `4.1 AI Systems. Licensee shall own all right, title, and interest in and to any AI Systems developed, trained, or improved using the Data, subject to Licensor's rights to receive compensation as set forth in Section 5.\n\n`;
    } else if (formData.ownershipModels === 'joint-ownership') {
      text += `4.1 AI Systems. The parties shall jointly own all right, title, and interest in and to any AI Systems developed, trained, or improved using the Data, including all intellectual property rights therein, with each party having the right to use, license, and exploit such AI Systems without accounting to the other party.\n\n`;
    }
    
    text += `4.2 Data. Licensor retains all right, title, and interest in and to the Data, including all intellectual property rights therein. Nothing in this Agreement shall be construed as a transfer or assignment of ownership in the Data to Licensee.\n\n`;
    
    // 5. Compensation
    text += `5. COMPENSATION\n\n`;
    
    if (formData.compensationType === 'one-time') {
      text += `5.1 License Fee. In consideration for the license granted herein, Licensee shall pay Licensor a one-time fee of $${formData.initialFee || '0'} within thirty (30) days of the Effective Date.\n\n`;
    } else if (formData.compensationType === 'royalty') {
      text += `5.1 Royalty. In consideration for the license granted herein, Licensee shall pay Licensor a royalty of ${formData.royaltyPercent || '0'}% of the Net Revenue derived from AI Systems trained using the Data. "Net Revenue" means gross revenue received by Licensee from the commercialization of AI Systems, less taxes, returns, and standard deductions.\n\n`;
      
      text += `5.2 Minimum Guarantee. Regardless of the actual royalties earned, Licensee guarantees a minimum payment to Licensor of $${formData.minimumGuarantee || '0'} per year during the Term.\n\n`;
      
      text += `5.3 Reporting. Licensee shall provide quarterly reports detailing the calculation of royalties due, along with payment of such royalties, within thirty (30) days after the end of each calendar quarter.\n\n`;
    } else if (formData.compensationType === 'hybrid') {
      text += `5.1 Initial Fee. Licensee shall pay Licensor an initial fee of $${formData.initialFee || '0'} within thirty (30) days of the Effective Date.\n\n`;
      
      text += `5.2 Royalty. In addition to the initial fee, Licensee shall pay Licensor a royalty of ${formData.royaltyPercent || '0'}% of the Net Revenue derived from AI Systems trained using the Data. "Net Revenue" means gross revenue received by Licensee from the commercialization of AI Systems, less taxes, returns, and standard deductions.\n\n`;
      
      text += `5.3 Minimum Guarantee. Regardless of the actual royalties earned, Licensee guarantees a minimum payment to Licensor of $${formData.minimumGuarantee || '0'} per year during the Term.\n\n`;
      
      text += `5.4 Reporting. Licensee shall provide quarterly reports detailing the calculation of royalties due, along with payment of such royalties, within thirty (30) days after the end of each calendar quarter.\n\n`;
    }
    
    // 6. Term and Termination
    text += `6. TERM AND TERMINATION\n\n`;
    
    text += `6.1 Term. This Agreement shall commence on the Effective Date and continue for a period of ${formData.term || '1'} ${formData.termUnit === 'years' ? 'years' : 'months'} (the "Term"), unless earlier terminated as provided herein.\n\n`;
    
    // Renewal terms
    if (formData.renewalTerms === 'automatic') {
      text += `6.2 Renewal. This Agreement shall automatically renew for additional periods of ${formData.term || '1'} ${formData.termUnit === 'years' ? 'years' : 'months'} unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the then-current Term.\n\n`;
    } else if (formData.renewalTerms === 'mutual-agreement') {
      text += `6.2 Renewal. This Agreement may be renewed for additional periods upon mutual written agreement of the parties.\n\n`;
    } else if (formData.renewalTerms === 'licensee-option') {
      text += `6.2 Renewal. Licensee shall have the option to renew this Agreement for additional periods of ${formData.term || '1'} ${formData.termUnit === 'years' ? 'years' : 'months'} by providing written notice to Licensor at least thirty (30) days prior to the end of the then-current Term.\n\n`;
    }
    
    if (formData.terminationRights === 'both-parties') {
      text += `6.3 Termination for Breach. Either party may terminate this Agreement upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof.\n\n`;
    } else if (formData.terminationRights === 'licensor-only') {
      text += `6.3 Termination for Breach. Licensor may terminate this Agreement upon written notice if Licensee materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof.\n\n`;
    } else if (formData.terminationRights === 'licensee-only') {
      text += `6.3 Termination for Convenience. Licensee may terminate this Agreement at any time upon thirty (30) days' written notice to Licensor.\n\n`;
    }
    
    text += `6.4 Effect of Termination. Upon termination or expiration of this Agreement: (a) all rights granted to Licensee hereunder shall immediately terminate; (b) Licensee shall immediately cease all use of the Data; and (c) Licensee shall promptly return or destroy all copies of the Data in its possession or control, as directed by Licensor.\n\n`;
    
    text += `6.5 Survival. The following provisions shall survive the termination or expiration of this Agreement: Sections 4 (Ownership), 5 (Compensation) with respect to amounts accrued prior to termination, 7 (Representations and Warranties), 8 (Indemnification), 9 (Limitation of Liability), and 11 (General Provisions).\n\n`;
    
    // 7. Representations and Warranties
    text += `7. REPRESENTATIONS AND WARRANTIES\n\n`;
    
    if (formData.licensorWarranty === 'limited') {
      text += `7.1 Licensor Warranties. Licensor represents and warrants that: (a) it has ${formData.rightsToClaim === 'all-necessary-rights' ? 'all necessary rights and authority to grant the licenses and rights granted herein' : 'the right to license the Data as specified in this Agreement'}; and (b) the Data does not infringe upon the intellectual property rights of any third party.\n\n`;
    } else if (formData.licensorWarranty === 'as-is') {
      text += `7.1 Disclaimer. THE DATA IS PROVIDED "AS IS" AND WITHOUT WARRANTIES OF ANY KIND. LICENSOR HEREBY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT LIMITATION ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.\n\n`;
    }
    
    // Data quality warranty
    if (formData.dataQualityWarranty) {
      text += `7.2 Data Quality. Licensor represents and warrants that the Data is accurate, complete, and of sufficient quality for the purposes of training AI Systems. Licensor has taken reasonable steps to ensure that the Data is free from errors, inconsistencies, and anomalies.\n\n`;
    }
    
    if (formData.dataComplianceWarranty) {
      text += `7.3 Compliance with Laws. Licensor represents and warrants that the Data was collected in compliance with all applicable laws and regulations, including data protection and privacy laws, and that Licensor has all necessary rights, consents, and permissions to license the Data to Licensee for the purposes set forth in this Agreement.\n\n`;
    }
    
    text += `7.4 Licensee Warranties. Licensee represents and warrants that: (a) it will use the Data in compliance with all applicable laws and regulations; and (b) it will not use the Data in any manner that violates the rights of any third party.\n\n`;
    
    // 8. Indemnification
    text += `8. INDEMNIFICATION\n\n`;
    
    if (formData.indemnification === 'mutual') {
      text += `8.1 Mutual Indemnification. Each party shall indemnify, defend, and hold harmless the other party from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) any breach by the indemnifying party of its representations, warranties, or covenants under this Agreement; or (b) the indemnifying party's negligence or willful misconduct.\n\n`;
    } else if (formData.indemnification === 'licensee-only') {
      text += `8.1 Licensee Indemnification. Licensee shall indemnify, defend, and hold harmless Licensor from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) Licensee's use of the Data; (b) any breach by Licensee of its representations, warranties, or covenants under this Agreement; or (c) Licensee's negligence or willful misconduct.\n\n`;
    } else if (formData.indemnification === 'licensor-only') {
      text += `8.1 Licensor Indemnification. Licensor shall indemnify, defend, and hold harmless Licensee from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) any claim that the Data infringes upon the intellectual property rights of any third party; (b) any breach by Licensor of its representations, warranties, or covenants under this Agreement; or (c) Licensor's negligence or willful misconduct.\n\n`;
    }
    
    // 9. Limitation of Liability
    text += `9. LIMITATION OF LIABILITY\n\n`;
    
    if (formData.liabilityLimit === 'fees-paid') {
      text += `9.1 EXCEPT FOR OBLIGATIONS UNDER SECTION 8 (INDEMNIFICATION), IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL AMOUNT PAID BY LICENSEE TO LICENSOR UNDER THIS AGREEMENT.\n\n`;
    } else if (formData.liabilityLimit === 'no-consequential') {
      text += `9.1 EXCEPT FOR OBLIGATIONS UNDER SECTION 8 (INDEMNIFICATION), IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOST PROFITS, LOSS OF USE, OR LOSS OF DATA, WHETHER IN AN ACTION IN CONTRACT, TORT, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\n`;
    } else if (formData.liabilityLimit === 'both-limits') {
      text += `9.1 EXCEPT FOR OBLIGATIONS UNDER SECTION 8 (INDEMNIFICATION), IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL AMOUNT PAID BY LICENSEE TO LICENSOR UNDER THIS AGREEMENT.\n\n`;
      
      text += `9.2 EXCEPT FOR OBLIGATIONS UNDER SECTION 8 (INDEMNIFICATION), IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOST PROFITS, LOSS OF USE, OR LOSS OF DATA, WHETHER IN AN ACTION IN CONTRACT, TORT, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\n`;
    }
    
    // 10. Confidentiality
    text += `10. CONFIDENTIALITY\n\n`;
    
    text += `10.1 Confidential Information. Each party acknowledges that it may receive confidential or proprietary information of the other party in the performance of this Agreement ("Confidential Information"). Each party shall maintain the confidentiality of the other party's Confidential Information using at least the same degree of care that it uses to protect its own confidential information, but in no event less than reasonable care.\n\n`;
    
    text += `10.2 Exclusions. Confidential Information shall not include information that: (a) is or becomes publicly available through no fault of the receiving party; (b) was in the receiving party's possession prior to its disclosure by the disclosing party; (c) is rightfully received by the receiving party from a third party without a duty of confidentiality; or (d) is independently developed by the receiving party without reference to the disclosing party's Confidential Information.\n\n`;
    
    // 11. General Provisions
    text += `11. GENERAL PROVISIONS\n\n`;
    
    text += `11.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements or communications.\n\n`;
    
    text += `11.2 Amendment. This Agreement may be amended only by a written document signed by both parties.\n\n`;
    
    text += `11.3 Assignment. Neither party may assign or transfer this Agreement without the prior written consent of the other party, except that either party may assign this Agreement in connection with a merger, acquisition, or sale of all or substantially all of its assets.\n\n`;
    
    text += `11.4 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of ${formData.governingLaw || formData.licensorState || '[STATE/JURISDICTION]'}, without regard to its conflict of laws principles.\n\n`;
    
    // Dispute resolution
    if (formData.disputeResolution === 'arbitration') {
      text += `11.5 Dispute Resolution. Any dispute arising out of or in connection with this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.\n\n`;
    } else if (formData.disputeResolution === 'mediation-then-arbitration') {
      text += `11.5 Dispute Resolution. Any dispute arising out of or in connection with this Agreement shall first be submitted to mediation. If mediation does not resolve the dispute within sixty (60) days, the dispute shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.\n\n`;
    } else if (formData.disputeResolution === 'litigation') {
      text += `11.5 Dispute Resolution. Any dispute arising out of or in connection with this Agreement shall be resolved in the courts of ${formData.governingLaw || formData.licensorState || '[STATE/JURISDICTION]'}.\n\n`;
    }
    
    text += `11.6 Notices. All notices under this Agreement shall be in writing and shall be deemed given when delivered personally, by email with confirmation of receipt, or by certified mail, return receipt requested, to the address set forth above or to such other address as may be specified in writing.\n\n`;
    
    text += `11.7 No Waiver. The failure of either party to enforce any provision of this Agreement shall not be construed as a waiver of such provision or the right to enforce such provision.\n\n`;
    
    text += `11.8 Severability. If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.\n\n`;
    
    text += `11.9 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.\n\n`;
    
    // Signature Block
    text += `IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.\n\n`;
    
    text += `LICENSOR: ${formData.licensorName || '[LICENSOR NAME]'}\n\n`;
    
    text += `By: ____________________________\n`;
    text += `Name: _________________________\n`;
    text += `Title: __________________________\n\n`;
    
    text += `LICENSEE: ${formData.licenseeCompany || '[LICENSEE NAME]'}\n\n`;
    
    text += `By: ____________________________\n`;
    text += `Name: _________________________\n`;
    text += `Title: __________________________\n`;
    
    setDocumentText(text);
  }, [formData]);
  
  // Function to determine what text should be highlighted based on lastChanged
  const createHighlightedText = () => {
    if (!lastChanged || !documentText) return documentText;
    
    // Define patterns to match based on which field was changed
    const patterns = {
      // Basic Info fields
      licensorName: new RegExp(`${formData.licensorName}`, 'g'),
      licensorEntity: new RegExp(`a ${formData.licensorEntity.toLowerCase()}`, 'g'),
      licensorAddress: new RegExp(`${formData.licensorAddress}`, 'g'),
      licensorState: new RegExp(`${formData.licensorState}`, 'g'),
      licenseeCompany: new RegExp(`${formData.licenseeCompany}`, 'g'),
      licenseeEntity: new RegExp(`a ${formData.licenseeEntity.toLowerCase()}`, 'g'),
      licenseeAddress: new RegExp(`${formData.licenseeAddress}`, 'g'),
      licenseeState: new RegExp(`${formData.licenseeState}`, 'g'),
      effectiveDate: new RegExp(`as of ${formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString('en-US') : '\\[DATE\\]'}`, 'g'),
      
      // Data Description fields
      datasetName: new RegExp(`${formData.datasetName}`, 'g'),
      datasetDescription: new RegExp(`${formData.datasetDescription}`, 'g'),
      dataSizeGB: new RegExp(`${formData.dataSizeGB} gigabytes`, 'g'),
      dataFormat: new RegExp(`${formData.dataFormat} format`, 'g'),
      
      // License Terms fields
      licenseType: new RegExp(`grants to Licensee (an? ${formData.licenseType})`, 'g'),
      
      // Compensation fields
      initialFee: new RegExp(`\\$${formData.initialFee}`, 'g'),
      royaltyPercent: new RegExp(`${formData.royaltyPercent}%`, 'g'),
      term: new RegExp(`${formData.term} ${formData.termUnit}`, 'g'),
    };
    
    // Special handling for nested objects
    if (lastChanged.includes('.')) {
      const [parent, child] = lastChanged.split('.');
      
      if (parent === 'dataTypes') {
        const dataTypesStr = Object.entries(formData.dataTypes)
          .filter(([, isSelected]) => isSelected)
          .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
          .join(', ');
        
        return documentText.replace(
          new RegExp(`(specifically including|specifically the ${formData.datasetName || '\\[DATASET NAME\\]'}, which includes) [^.]+`, 'g'),
          match => match.replace(/specifically.+/, `$& <span class="highlighted-text">${dataTypesStr}</span>`)
        );
      }
      
      if (parent === 'modelTypes') {
        const modelTypesStr = Object.entries(formData.modelTypes)
          .filter(([, isSelected]) => isSelected)
          .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
          .join(', ');
        
        return documentText.replace(
          /Categories: [^.]+/g,
          match => match.replace(/Categories: .+/, `Categories: <span class="highlighted-text">${modelTypesStr}</span>`)
        );
      }
      
      if (parent === 'usagePurposes') {
        const usagePurposesStr = Object.entries(formData.usagePurposes)
          .filter(([, isSelected]) => isSelected)
          .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
          .join(', ');
        
        return documentText.replace(
          /following purposes: [^.]+/g,
          match => match.replace(/following purposes: .+/, `following purposes: <span class="highlighted-text">${usagePurposesStr}</span>`)
        );
      }
    }
    
    // Handle regular fields
    const pattern = patterns[lastChanged];
    if (!pattern) return documentText;
    
    // Replace matched text with highlighted version
    return documentText.replace(pattern, match => {
      return `<span class="highlighted-text">${match}</span>`;
    });
  };
  
  // Create a highlighted version of the document text
  const highlightedText = createHighlightedText();
  
  // Assess risks based on form data
  const assessRisks = () => {
    const risks = [];
    
    // Check for empty required fields
    if (!formData.licensorName || !formData.licensorAddress || !formData.licenseeCompany || !formData.licenseeAddress) {
      risks.push({
        level: 'high',
        title: 'Missing Party Information',
        description: 'Basic party information is incomplete. This could make the agreement unenforceable.',
        recommendation: 'Complete all party information fields in the Basic Info tab.'
      });
    }
    
    // Check for data compliance warranties
    if (!formData.dataComplianceWarranty) {
      risks.push({
        level: 'high',
        title: 'No Data Compliance Warranty',
        description: 'The agreement lacks warranties about data collection compliance, which could expose the Licensee to legal risks if the data was collected illegally.',
        recommendation: 'Enable the data compliance warranty or ensure separate data compliance documentation exists.'
      });
    }
    
    // Check for data description
    if (!formData.datasetName || !formData.datasetDescription) {
      risks.push({
        level: 'high',
        title: 'Insufficient Data Description',
        description: 'The data being licensed is not adequately described, which could lead to disputes about what is included in the license.',
        recommendation: 'Provide a clear and detailed description of the data in the Data Description tab.'
      });
    }
    
    // Check license type risks
    if (formData.licenseType === 'exclusive' && formData.compensationType === 'one-time') {
      risks.push({
        level: 'medium',
        title: 'Exclusive License with One-Time Fee',
        description: 'An exclusive license with only a one-time fee may undervalue the data, especially if the AI models become highly profitable.',
        recommendation: 'Consider a hybrid compensation model with both an initial fee and ongoing royalties.'
      });
    }
    
    // Check sublicensing risks
    if (formData.sublicensing === 'permitted' && formData.compensationType !== 'royalty' && formData.compensationType !== 'hybrid') {
      risks.push({
        level: 'medium',
        title: 'Unrestricted Sublicensing Without Royalties',
        description: 'Allowing unrestricted sublicensing without royalty provisions means Licensor won't benefit from widespread use.',
        recommendation: 'Either restrict sublicensing or implement a royalty structure that accounts for sublicensee revenue.'
      });
    }
    
    // Check for attribution
    if (formData.licensorName && formData.attributionRequired === 'no') {
      risks.push({
        level: 'low',
        title: 'No Attribution Requirement',
        description: 'The agreement does not require attribution to the Licensor, which may limit brand exposure and recognition.',
        recommendation: 'Consider requiring attribution in public-facing materials that reference the AI systems.'
      });
    }
    
    // Check for data quality warranty
    if (!formData.dataQualityWarranty) {
      risks.push({
        level: 'medium',
        title: 'No Data Quality Warranty',
        description: 'The agreement lacks warranties about the quality and accuracy of the data, which could affect the performance of the trained AI models.',
        recommendation: 'Consider adding a data quality warranty to ensure the data meets certain standards.'
      });
    }
    
    // Check for proper model types selection
    if (formData.purposeRestrictions === 'specific-models' && Object.values(formData.modelTypes).filter(Boolean).length === 0) {
      risks.push({
        level: 'high',
        title: 'No Model Types Selected',
        description: 'You've restricted usage to specific model types but haven't selected any. This creates ambiguity in the agreement.',
        recommendation: 'Select at least one model type in the Data Usage tab or change the purpose restrictions.'
      });
    }
    
    // If no risks found, add a "low risk" message
    if (risks.length === 0) {
      risks.push({
        level: 'low',
        title: 'No Major Risks Identified',
        description: 'Based on your selections, no significant risks were identified in the agreement.',
        recommendation: 'Always review the final agreement with legal counsel before signing.'
      });
    }
    
    return risks;
  };
  
  // Render tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Info
        return (
          <>
            <h2>Parties & Basic Information</h2>
            
            <div className="form-row">
              <h3>Licensor (Data Owner) Details</h3>
              <div className="form-group">
                <label htmlFor="licensorName">Licensor Name:</label>
                <input
                  type="text"
                  id="licensorName"
                  name="licensorName"
                  className="form-control"
                  value={formData.licensorName}
                  onChange={handleChange}
                  placeholder="Company or entity providing the data"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="licensorEntity">Entity Type:</label>
                <select
                  id="licensorEntity"
                  name="licensorEntity"
                  className="form-control"
                  value={formData.licensorEntity}
                  onChange={handleChange}
                >
                  <option value="Corporation">Corporation</option>
                  <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="licensorAddress">Address:</label>
                <input
                  type="text"
                  id="licensorAddress"
                  name="licensorAddress"
                  className="form-control"
                  value={formData.licensorAddress}
                  onChange={handleChange}
                  placeholder="Principal place of business"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="licensorState">State/Jurisdiction:</label>
                <input
                  type="text"
                  id="licensorState"
                  name="licensorState"
                  className="form-control"
                  value={formData.licensorState}
                  onChange={handleChange}
                  placeholder="State or jurisdiction of incorporation"
                />
              </div>
            </div>
            
            <div className="form-row">
              <h3>Licensee (AI Developer) Details</h3>
              <div className="form-group">
                <label htmlFor="licenseeCompany">Licensee Name:</label>
                <input
                  type="text"
                  id="licenseeCompany"
                  name="licenseeCompany"
                  className="form-control"
                  value={formData.licenseeCompany}
                  onChange={handleChange}
                  placeholder="Company or entity using the data"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="licenseeEntity">Entity Type:</label>
                <select
                  id="licenseeEntity"
                  name="licenseeEntity"
                  className="form-control"
                  value={formData.licenseeEntity}
                  onChange={handleChange}
                >
                  <option value="Corporation">Corporation</option>
                  <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="licenseeAddress">Address:</label>
                <input
                  type="text"
                  id="licenseeAddress"
                  name="licenseeAddress"
                  className="form-control"
                  value={formData.licenseeAddress}
                  onChange={handleChange}
                  placeholder="Principal place of business"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="licenseeState">State/Jurisdiction:</label>
                <input
                  type="text"
                  id="licenseeState"
                  name="licenseeState"
                  className="form-control"
                  value={formData.licenseeState}
                  onChange={handleChange}
                  placeholder="State or jurisdiction of incorporation"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="effectiveDate">Effective Date:</label>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  className="form-control"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                />
                <small>If left blank, the agreement will use the text "[DATE]" to be filled in later.</small>
              </div>
            </div>
          </>
        );
        
      case 1: // Data Description
        return (
          <>
            <h2>Data Description</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="datasetName">Dataset Name:</label>
                <input
                  type="text"
                  id="datasetName"
                  name="datasetName"
                  className="form-control"
                  value={formData.datasetName}
                  onChange={handleChange}
                  placeholder="Name of the dataset being licensed"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="datasetDescription">Dataset Description:</label>
                <textarea
                  id="datasetDescription"
                  name="datasetDescription"
                  className="form-control"
                  value={formData.datasetDescription}
                  onChange={handleChange}
                  placeholder="Brief description of the dataset and its contents"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dataOrigin">Data Origin:</label>
                <select
                  id="dataOrigin"
                  name="dataOrigin"
                  className="form-control"
                  value={formData.dataOrigin}
                  onChange={handleChange}
                >
                  <option value="proprietary">Proprietary (Created by Licensor)</option>
                  <option value="third-party-licensed">Third-Party Licensed</option>
                  <option value="public-domain">Public Domain</option>
                  <option value="mixed">Mixed Sources</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="dataFormat">Data Format:</label>
                <select
                  id="dataFormat"
                  name="dataFormat"
                  className="form-control"
                  value={formData.dataFormat}
                  onChange={handleChange}
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                  <option value="parquet">Parquet</option>
                  <option value="avro">Avro</option>
                  <option value="binary">Binary</option>
                  <option value="text">Plain Text</option>
                  <option value="mixed">Mixed Formats</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dataSizeGB">Approximate Size (GB):</label>
                <input
                  type="text"
                  id="dataSizeGB"
                  name="dataSizeGB"
                  className="form-control"
                  value={formData.dataSizeGB}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dataAccessMethod">Data Access Method:</label>
                <select
                  id="dataAccessMethod"
                  name="dataAccessMethod"
                  className="form-control"
                  value={formData.dataAccessMethod}
                  onChange={handleChange}
                >
                  <option value="api">API</option>
                  <option value="download">Direct Download</option>
                  <option value="physical">Physical Media</option>
                  <option value="cloud">Cloud Storage</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="dataUpdateFrequency">Update Frequency:</label>
                <select
                  id="dataUpdateFrequency"
                  name="dataUpdateFrequency"
                  className="form-control"
                  value={formData.dataUpdateFrequency}
                  onChange={handleChange}
                >
                  <option value="none">None (One-time delivery)</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="as-available">As Available</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataQualityWarranty"
                    name="dataQualityWarranty"
                    checked={formData.dataQualityWarranty}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataQualityWarranty">Include Data Quality Warranty</label>
                </div>
                <small>Licensor warrants that the data is accurate, complete, and of sufficient quality.</small>
              </div>
            </div>
            
            <div className="form-row">
              <h3>Data Types Included:</h3>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.text"
                    name="dataTypes.text"
                    checked={formData.dataTypes.text}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.text">Text</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.images"
                    name="dataTypes.images"
                    checked={formData.dataTypes.images}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.images">Images</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.audio"
                    name="dataTypes.audio"
                    checked={formData.dataTypes.audio}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.audio">Audio</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.video"
                    name="dataTypes.video"
                    checked={formData.dataTypes.video}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.video">Video</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.userGenerated"
                    name="dataTypes.userGenerated"
                    checked={formData.dataTypes.userGenerated}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.userGenerated">User-Generated Content</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.proprietaryContent"
                    name="dataTypes.proprietaryContent"
                    checked={formData.dataTypes.proprietaryContent}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.proprietaryContent">Proprietary Content</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.personalData"
                    name="dataTypes.personalData"
                    checked={formData.dataTypes.personalData}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.personalData">Personal Data</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.anonymizedData"
                    name="dataTypes.anonymizedData"
                    checked={formData.dataTypes.anonymizedData}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.anonymizedData">Anonymized Data</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.structuredData"
                    name="dataTypes.structuredData"
                    checked={formData.dataTypes.structuredData}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.structuredData">Structured Data</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataTypes.unstructuredData"
                    name="dataTypes.unstructuredData"
                    checked={formData.dataTypes.unstructuredData}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataTypes.unstructuredData">Unstructured Data</label>
                </div>
              </div>
            </div>
          </>
        );
        
      case 2: // License Terms
        return (
          <>
            <h2>License Terms</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licenseType">License Type:</label>
                <select
                  id="licenseType"
                  name="licenseType"
                  className="form-control"
                  value={formData.licenseType}
                  onChange={handleChange}
                >
                  <option value="non-exclusive">Non-Exclusive (Licensor can license to others)</option>
                  <option value="exclusive">Exclusive (Only Licensee can use the data)</option>
                  <option value="sole">Sole (Licensor can use but not license to others)</option>
                </select>
                <small>Non-exclusive is most common for AI training data.</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="sublicensing">Sublicensing Rights:</label>
                <select
                  id="sublicensing"
                  name="sublicensing"
                  className="form-control"
                  value={formData.sublicensing}
                  onChange={handleChange}
                >
                  <option value="not-permitted">Not Permitted</option>
                  <option value="limited-permitted">Limited (Contractors/Service Providers Only)</option>
                  <option value="permitted">Fully Permitted</option>
                </select>
                <small>Controls whether the Licensee can share the data with others.</small>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="geographicScope">Geographic Scope:</label>
                <select
                  id="geographicScope"
                  name="geographicScope"
                  className="form-control"
                  value={formData.geographicScope}
                  onChange={handleChange}
                >
                  <option value="worldwide">Worldwide</option>
                  <option value="us-only">United States Only</option>
                  <option value="eu-only">European Union Only</option>
                  <option value="custom">Custom (Specify Below)</option>
                </select>
              </div>
              
              {formData.geographicScope === 'custom' && (
                <div className="form-group">
                  <label htmlFor="customGeography">Specify Geographic Regions:</label>
                  <input
                    type="text"
                    id="customGeography"
                    name="customGeography"
                    className="form-control"
                    value={formData.customGeography || ''}
                    onChange={handleChange}
                    placeholder="e.g., North America and Western Europe"
                  />
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="industryRestrictions">Industry Restrictions:</label>
                <select
                  id="industryRestrictions"
                  name="industryRestrictions"
                  className="form-control"
                  value={formData.industryRestrictions}
                  onChange={handleChange}
                >
                  <option value="none">None (All Industries Permitted)</option>
                  <option value="no-defense">Defense Prohibited</option>
                  <option value="no-healthcare">Healthcare Prohibited</option>
                  <option value="no-finance">Financial Services Prohibited</option>
                  <option value="custom">Custom Restrictions</option>
                </select>
              </div>
              
              {formData.industryRestrictions === 'custom' && (
                <div className="form-group">
                  <label htmlFor="customIndustryRestrictions">Specify Industry Restrictions:</label>
                  <input
                    type="text"
                    id="customIndustryRestrictions"
                    name="customIndustryRestrictions"
                    className="form-control"
                    value={formData.customIndustryRestrictions || ''}
                    onChange={handleChange}
                    placeholder="e.g., Defense, Gambling, Adult Entertainment"
                  />
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dataRetention">Data Retention:</label>
                <select
                  id="dataRetention"
                  name="dataRetention"
                  className="form-control"
                  value={formData.dataRetention}
                  onChange={handleChange}
                >
                  <option value="during-term">During Term Only</option>
                  <option value="perpetual">Perpetual (Even After Termination)</option>
                  <option value="limited-period">Limited Period After Termination</option>
                  <option value="unlimited">Unlimited</option>
                </select>
                <small>Controls how long the Licensee can retain the data.</small>
              </div>
            </div>
          </>
        );
        
      case 3: // Data Usage
        return (
          <>
            <h2>Data Usage & Restrictions</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purposeRestrictions">Purpose Restrictions:</label>
                <select
                  id="purposeRestrictions"
                  name="purposeRestrictions"
                  className="form-control"
                  value={formData.purposeRestrictions}
                  onChange={handleChange}
                >
                  <option value="specific-models">Specific Model Types Only</option>
                  <option value="product-specific">Licensee's Products Only</option>
                  <option value="all-ai">Any AI Systems (No Restrictions)</option>
                </select>
              </div>
              
              {formData.purposeRestrictions === 'specific-models' && (
                <div className="form-group">
                  <label>Allowed Model Types:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.generativeText"
                        name="modelTypes.generativeText"
                        checked={formData.modelTypes.generativeText}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.generativeText">Generative Text Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.generativeImage"
                        name="modelTypes.generativeImage"
                        checked={formData.modelTypes.generativeImage}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.generativeImage">Generative Image Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.generativeAudio"
                        name="modelTypes.generativeAudio"
                        checked={formData.modelTypes.generativeAudio}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.generativeAudio">Generative Audio Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.generativeVideo"
                        name="modelTypes.generativeVideo"
                        checked={formData.modelTypes.generativeVideo}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.generativeVideo">Generative Video Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.classTrain"
                        name="modelTypes.classTrain"
                        checked={formData.modelTypes.classTrain}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.classTrain">Classification Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.dataAnalytics"
                        name="modelTypes.dataAnalytics"
                        checked={formData.modelTypes.dataAnalytics}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.dataAnalytics">Data Analytics Systems</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.predictiveModels"
                        name="modelTypes.predictiveModels"
                        checked={formData.modelTypes.predictiveModels}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.predictiveModels">Predictive Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.languageModels"
                        name="modelTypes.languageModels"
                        checked={formData.modelTypes.languageModels}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.languageModels">Language Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.computerVision"
                        name="modelTypes.computerVision"
                        checked={formData.modelTypes.computerVision}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.computerVision">Computer Vision Models</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.sentimentAnalysis"
                        name="modelTypes.sentimentAnalysis"
                        checked={formData.modelTypes.sentimentAnalysis}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.sentimentAnalysis">Sentiment Analysis</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.recommendationSystems"
                        name="modelTypes.recommendationSystems"
                        checked={formData.modelTypes.recommendationSystems}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.recommendationSystems">Recommendation Systems</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.naturalLanguageProcessing"
                        name="modelTypes.naturalLanguageProcessing"
                        checked={formData.modelTypes.naturalLanguageProcessing}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.naturalLanguageProcessing">NLP Systems</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="modelTypes.customizedSpecific"
                        name="modelTypes.customizedSpecific"
                        checked={formData.modelTypes.customizedSpecific}
                        onChange={handleChange}
                      />
                      <label htmlFor="modelTypes.customizedSpecific">Custom/Specialized Models</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Usage Purposes:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="usagePurposes.research"
                      name="usagePurposes.research"
                      checked={formData.usagePurposes.research}
                      onChange={handleChange}
                    />
                    <label htmlFor="usagePurposes.research">Research & Development</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="usagePurposes.commercial"
                      name="usagePurposes.commercial"
                      checked={formData.usagePurposes.commercial}
                      onChange={handleChange}
                    />
                    <label htmlFor="usagePurposes.commercial">Commercial Products/Services</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="usagePurposes.internalUse"
                      name="usagePurposes.internalUse"
                      checked={formData.usagePurposes.internalUse}
                      onChange={handleChange}
                    />
                    <label htmlFor="usagePurposes.internalUse">Internal Use Only</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="usagePurposes.publicServices"
                      name="usagePurposes.publicServices"
                      checked={formData.usagePurposes.publicServices}
                      onChange={handleChange}
                    />
                    <label htmlFor="usagePurposes.publicServices">Public Services</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="usagePurposes.militaryApplications"
                      name="usagePurposes.militaryApplications"
                      checked={formData.usagePurposes.militaryApplications}
                      onChange={handleChange}
                    />
                    <label htmlFor="usagePurposes.militaryApplications">Military Applications</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="usagePurposes.governmentSurveillance"
                      name="usagePurposes.governmentSurveillance"
                      checked={formData.usagePurposes.governmentSurveillance}
                      onChange={handleChange}
                    />
                    <label htmlFor="usagePurposes.governmentSurveillance">Government Surveillance</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ownershipModels">Ownership of Resulting AI Models:</label>
                <select
                  id="ownershipModels"
                  name="ownershipModels"
                  className="form-control"
                  value={formData.ownershipModels}
                  onChange={handleChange}
                >
                  <option value="licensee-owns">Licensee Fully Owns</option>
                  <option value="licensor-royalty">Licensee Owns (with Licensor Royalty Rights)</option>
                  <option value="joint-ownership">Joint Ownership</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="attributionRequired">Attribution Required:</label>
                <select
                  id="attributionRequired"
                  name="attributionRequired"
                  className="form-control"
                  value={formData.attributionRequired}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                <small>Requires Licensee to credit Licensor in public materials.</small>
              </div>
            </div>
          </>
        );
        
      case 4: // Compensation
        return (
          <>
            <h2>Compensation & Term</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="compensationType">Compensation Structure:</label>
                <select
                  id="compensationType"
                  name="compensationType"
                  className="form-control"
                  value={formData.compensationType}
                  onChange={handleChange}
                >
                  <option value="one-time">One-Time Fee</option>
                  <option value="royalty">Royalty-Based</option>
                  <option value="hybrid">Hybrid (Initial Fee + Royalty)</option>
                </select>
              </div>
              
              {(formData.compensationType === 'one-time' || formData.compensationType === 'hybrid') && (
                <div className="form-group">
                  <label htmlFor="initialFee">Initial Fee (USD):</label>
                  <input
                    type="text"
                    id="initialFee"
                    name="initialFee"
                    className="form-control"
                    value={formData.initialFee}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                  />
                </div>
              )}
              
              {(formData.compensationType === 'royalty' || formData.compensationType === 'hybrid') && (
                <>
                  <div className="form-group">
                    <label htmlFor="royaltyPercent">Royalty Percentage (%):</label>
                    <input
                      type="text"
                      id="royaltyPercent"
                      name="royaltyPercent"
                      className="form-control"
                      value={formData.royaltyPercent}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="minimumGuarantee">Minimum Annual Guarantee (USD):</label>
                    <input
                      type="text"
                      id="minimumGuarantee"
                      name="minimumGuarantee"
                      className="form-control"
                      value={formData.minimumGuarantee}
                      onChange={handleChange}
                      placeholder="e.g., 10000"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group inline">
                <div>
                  <label htmlFor="term">Term Duration:</label>
                  <input
                    type="number"
                    id="term"
                    name="term"
                    className="form-control"
                    value={formData.term}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <label htmlFor="termUnit">Unit:</label>
                  <select
                    id="termUnit"
                    name="termUnit"
                    className="form-control"
                    value={formData.termUnit}
                    onChange={handleChange}
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="terminationRights">Termination Rights:</label>
                <select
                  id="terminationRights"
                  name="terminationRights"
                  className="form-control"
                  value={formData.terminationRights}
                  onChange={handleChange}
                >
                  <option value="both-parties">Both Parties (for Breach)</option>
                  <option value="licensor-only">Licensor Only</option>
                  <option value="licensee-only">Licensee Only (Termination for Convenience)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="renewalTerms">Renewal Terms:</label>
                <select
                  id="renewalTerms"
                  name="renewalTerms"
                  className="form-control"
                  value={formData.renewalTerms}
                  onChange={handleChange}
                >
                  <option value="automatic">Automatic Renewal</option>
                  <option value="mutual-agreement">By Mutual Agreement</option>
                  <option value="licensee-option">Licensee Option to Renew</option>
                  <option value="no-renewal">No Renewal (Fixed Term)</option>
                </select>
              </div>
            </div>
          </>
        );
        
      case 5: // Warranties
        return (
          <>
            <h2>Warranties & Representations</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licensorWarranty">Licensor Warranty Level:</label>
                <select
                  id="licensorWarranty"
                  name="licensorWarranty"
                  className="form-control"
                  value={formData.licensorWarranty}
                  onChange={handleChange}
                >
                  <option value="limited">Limited Warranty</option>
                  <option value="as-is">As-Is (No Warranty)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="rightsToClaim">Rights to Data:</label>
                <select
                  id="rightsToClaim"
                  name="rightsToClaim"
                  className="form-control"
                  value={formData.rightsToClaim}
                  onChange={handleChange}
                >
                  <option value="all-necessary-rights">All Necessary Rights</option>
                  <option value="right-to-license">Right to License Only</option>
                </select>
                <small>The warranty the Licensor makes about their rights to the data.</small>
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dataComplianceWarranty"
                    name="dataComplianceWarranty"
                    checked={formData.dataComplianceWarranty}
                    onChange={handleChange}
                  />
                  <label htmlFor="dataComplianceWarranty">Include Data Compliance Warranty</label>
                </div>
                <small>Licensor warrants data was collected in compliance with laws.</small>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="indemnification">Indemnification:</label>
                <select
                  id="indemnification"
                  name="indemnification"
                  className="form-control"
                  value={formData.indemnification}
                  onChange={handleChange}
                >
                  <option value="mutual">Mutual Indemnification</option>
                  <option value="licensee-only">Licensee Indemnifies Licensor</option>
                  <option value="licensor-only">Licensor Indemnifies Licensee</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="liabilityLimit">Limitation of Liability:</label>
                <select
                  id="liabilityLimit"
                  name="liabilityLimit"
                  className="form-control"
                  value={formData.liabilityLimit}
                  onChange={handleChange}
                >
                  <option value="fees-paid">Limited to Fees Paid</option>
                  <option value="no-consequential">No Consequential Damages</option>
                  <option value="both-limits">Both Limitations</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="disputeResolution">Dispute Resolution:</label>
                <select
                  id="disputeResolution"
                  name="disputeResolution"
                  className="form-control"
                  value={formData.disputeResolution}
                  onChange={handleChange}
                >
                  <option value="arbitration">Arbitration</option>
                  <option value="mediation-then-arbitration">Mediation, then Arbitration</option>
                  <option value="litigation">Litigation</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="governingLaw">Governing Law (if different from Licensor's state):</label>
                <input
                  type="text"
                  id="governingLaw"
                  name="governingLaw"
                  className="form-control"
                  value={formData.governingLaw}
                  onChange={handleChange}
                  placeholder="e.g., Delaware"
                />
                <small>If left blank, Licensor's state will be used.</small>
              </div>
            </div>
          </>
        );
        
      case 6: // Finalization
        return (
          <>
            <h2>Risk Assessment & Finalization</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fileName">File Name:</label>
                <input
                  type="text"
                  id="fileName"
                  name="fileName"
                  className="form-control"
                  value={formData.fileName}
                  onChange={handleChange}
                />
                <small>Used when downloading the document as MS Word.</small>
              </div>
            </div>
            
            <div className="risk-assessment">
              <h3>Risk Assessment</h3>
              <p>Based on your selections, the following risks or issues have been identified:</p>
              
              {assessRisks().map((risk, index) => (
                <div key={index} className={`risk-item risk-${risk.level}`}>
                  <h3>{risk.title}</h3>
                  <p>{risk.description}</p>
                  <p className="recommendation"><strong>Recommendation:</strong> {risk.recommendation}</p>
                </div>
              ))}
            </div>
            
            <div className="form-row" style={{ marginTop: '20px' }}>
              <button
                onClick={resetForm}
                className="nav-button"
                style={{
                  backgroundColor: "#ef4444", 
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "auto"
                }}
              >
                <Icon name="refresh-cw" /> Reset Form
              </button>
            </div>
            
            <div className="form-row">
              <p><strong>Next Steps:</strong> Review the complete agreement in the preview pane. Once you're satisfied, you can download it as a Word document or copy to clipboard. For legal advice specific to your situation, schedule a consultation.</p>
            </div>
          </>
        );
        
      default:
        return <div>Unknown tab</div>;
    }
  };
  
  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>AI Training Data License Agreement Generator</h1>
        <p>Create a customized agreement for licensing data for AI model training purposes.</p>
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
      
      <div className="main-content">
        <div className="form-panel">
          {renderTabContent()}
        </div>
        
        <div className="preview-panel" ref={previewRef}>
          <h2>Live Preview</h2>
          <pre 
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
          disabled={currentTab === 0}
        >
          <Icon name="chevron-left" /> Previous
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
          <Icon name="copy" /> Copy
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
          <Icon name="file-text" /> Download
        </button>
        
        <button
          onClick={openCalendly}
          className="nav-button"
          style={{
            backgroundColor: "#e11d48", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="calendar" /> Consult
        </button>
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next <Icon name="chevron-right" />
        </button>
      </div>
    </div>
  );
};

// Render the application
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<App />, document.getElementById('root'));
});