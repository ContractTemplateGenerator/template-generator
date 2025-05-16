// Icon component for feather icons
const Icon = ({ name, ...props }) => {
  return (
    <i data-feather={name} {...props}></i>
  );
};

// Main Generator Component
const LeaseAgreementGenerator = () => {
  // Tab configuration
  const tabs = [
    { id: 'basicInfo', label: 'Basic Information' },
    { id: 'propertyDetails', label: 'Property Details' },
    { id: 'leaseTerms', label: 'Lease Terms' },
    { id: 'rentPayments', label: 'Rent & Payments' },
    { id: 'rulesPolicy', label: 'Rules & Policies' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'termination', label: 'Termination' },
    { id: 'review', label: 'Review & Finalize' }
  ];

  // State
  const [currentTab, setCurrentTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
    // Basic Information
    landlordName: '',
    landlordAddress: '',
    landlordEmail: '',
    landlordPhone: '',
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    agreementDate: new Date().toISOString().split('T')[0],
    
    // Property Details
    propertyAddress: '',
    propertyType: 'apartment',
    isFurnished: false,
    includedUtilities: [],
    includedUtilitiesOther: '',
    parkingIncluded: false,
    parkingDetails: '',
    
    // Lease Terms
    leaseStartDate: '',
    leaseEndDate: '',
    leaseType: 'fixed',
    renewalOption: 'automatic',
    occupancyLimit: '2',
    
    // Rent and Payments
    monthlyRent: '',
    rentDueDate: '1',
    gracePeriod: '5',
    latePaymentFee: '',
    securityDeposit: '',
    depositDueDate: '',
    paymentMethods: ['check', 'electronic'],
    
    // Rules and Policies
    petsAllowed: false,
    petTypes: '',
    petDeposit: '',
    smokingAllowed: false,
    smokingPolicy: '',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    guestPolicy: 'reasonable',
    alterationsAllowed: false,
    
    // Maintenance
    tenantMaintenance: ['cleanliness', 'minorRepairs', 'reporting'],
    landlordMaintenance: ['majorRepairs', 'electrical', 'plumbing', 'heating'],
    emergencyContact: '',
    entryNotice: '24',
    
    // Termination
    earlyTerminationFee: '',
    noticeToVacate: '30',
    moveOutProcedures: 'clean',
    depositReturnPeriod: '21',
    
    // Document settings
    documentTitle: 'Residential Lease Agreement',
    fileName: 'Lease-Agreement'
  });
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'select-multiple') {
      const options = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: options
      }));
    } else {
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

  const goToTab = (index) => {
    setCurrentTab(index);
  };
  
  // Clipboard functions
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentText);
      alert("Agreement copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: formData.documentTitle,
        fileName: formData.fileName
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Launch Calendly for consultation
  const openCalendly = () => {
    try {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
      });
    } catch (error) {
      console.error("Error opening Calendly:", error);
      window.open('https://terms.law/call/', '_blank');
    }
  };
  
  // Generate document text based on form data
  const documentText = React.useMemo(() => {
    // Format date in Month Day, Year format
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };
    
    // Format currency with dollar sign
    const formatCurrency = (amount) => {
      if (!amount) return '';
      return `$${parseFloat(amount).toFixed(2)}`;
    };
    
    // Generate the document text
    let text = `RESIDENTIAL LEASE AGREEMENT

THIS LEASE AGREEMENT (hereinafter referred to as the "Agreement") is made and entered into on ${formatDate(formData.agreementDate)}, by and between:

LANDLORD: ${formData.landlordName}
Address: ${formData.landlordAddress}
Phone: ${formData.landlordPhone}
Email: ${formData.landlordEmail}

AND

TENANT(S): ${formData.tenantName}
Phone: ${formData.tenantPhone}
Email: ${formData.tenantEmail}

(Collectively referred to as the "Parties")

1. PROPERTY

Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, for residential purposes only, the premises located at:
${formData.propertyAddress}
(hereinafter referred to as the "Property")

Property Type: ${formData.propertyType === 'apartment' ? 'Apartment' : formData.propertyType === 'house' ? 'Single-family house' : formData.propertyType === 'condo' ? 'Condominium' : formData.propertyType === 'duplex' ? 'Duplex/Townhouse' : formData.propertyType}

Furnishing: The property is ${formData.isFurnished ? 'furnished' : 'unfurnished'}.

2. TERM

This Agreement shall commence on ${formatDate(formData.leaseStartDate)} and shall continue as a ${formData.leaseType === 'fixed' ? 'fixed-term lease' : 'month-to-month tenancy'} until ${formData.leaseType === 'fixed' ? formatDate(formData.leaseEndDate) : 'terminated by either party with proper notice'}.

${formData.leaseType === 'fixed' ? `Renewal: Upon expiration of the lease term, this Agreement shall ${formData.renewalOption === 'automatic' ? 'automatically renew on a month-to-month basis' : formData.renewalOption === 'written' ? 'require written agreement to renew' : 'terminate without further notice'}. ${formData.renewalOption === 'automatic' ? 'Either party may terminate the month-to-month tenancy by giving written notice at least 30 days before the intended termination date.' : ''}` : ''}

3. RENT

Tenant shall pay to Landlord as rent for the Property the amount of ${formatCurrency(formData.monthlyRent)} per month, due on the ${formData.rentDueDate}${formData.rentDueDate === '1' ? 'st' : formData.rentDueDate === '2' ? 'nd' : formData.rentDueDate === '3' ? 'rd' : 'th'} day of each month.

Rent shall be payable by the following method(s): ${formData.paymentMethods.includes('check') ? 'Personal check' : ''}${formData.paymentMethods.includes('check') && formData.paymentMethods.includes('electronic') ? ', ' : ''}${formData.paymentMethods.includes('electronic') ? 'Electronic payment' : ''}${(formData.paymentMethods.includes('check') || formData.paymentMethods.includes('electronic')) && formData.paymentMethods.includes('cash') ? ', ' : ''}${formData.paymentMethods.includes('cash') ? 'Cash' : ''}.

Grace Period: Rent paid after the ${formData.rentDueDate}${formData.rentDueDate === '1' ? 'st' : formData.rentDueDate === '2' ? 'nd' : formData.rentDueDate === '3' ? 'rd' : 'th'} day of the month but before the ${formData.gracePeriod}${formData.gracePeriod === '1' ? 'st' : formData.gracePeriod === '2' ? 'nd' : formData.gracePeriod === '3' ? 'rd' : 'th'} day of the month shall not be subject to a late fee.

Late Fee: Rent payments received after the grace period shall be subject to a late fee of ${formData.latePaymentFee ? formatCurrency(formData.latePaymentFee) : '$50.00'}.

4. SECURITY DEPOSIT

Upon the execution of this Agreement, Tenant shall deposit with Landlord the sum of ${formatCurrency(formData.securityDeposit)} as a security deposit, due by ${formData.depositDueDate ? formatDate(formData.depositDueDate) : 'the lease start date'}.

This security deposit shall secure the performance of Tenant's obligations hereunder. Landlord shall have the right, but not the obligation, to apply the security deposit in whole or in part to remedy any default in the payment of rent, to repair damages to the Property caused by Tenant, or to clean the Property upon termination of this Agreement.

The security deposit or any balance thereof shall be returned to Tenant within ${formData.depositReturnPeriod || '21'} days after the termination of this Agreement. Any deductions from the security deposit shall be itemized and explained in writing.

5. OCCUPANCY

The Property shall be occupied by no more than ${formData.occupancyLimit} person(s), including Tenant, exclusively as a private residence and for no other purpose without the prior written consent of Landlord.

6. UTILITIES AND SERVICES

${formData.includedUtilities && formData.includedUtilities.length > 0 ? `Landlord shall be responsible for the payment of the following utilities and services: ${formData.includedUtilities.join(', ')}${formData.includedUtilitiesOther ? `, ${formData.includedUtilitiesOther}` : ''}.` : 'Landlord shall not be responsible for payment of any utilities or services.'}

Tenant shall be responsible for the payment of all other utilities and services not specifically listed above as being the responsibility of Landlord.

7. PARKING

${formData.parkingIncluded ? `Parking is included in the rent. ${formData.parkingDetails ? `Parking details: ${formData.parkingDetails}` : ''}` : 'No parking is provided as part of this Agreement.'}

8. MAINTENANCE AND REPAIRS

Tenant Responsibilities: Tenant shall be responsible for ${formData.tenantMaintenance.includes('cleanliness') ? 'maintaining the Property in a clean and sanitary condition' : ''}${formData.tenantMaintenance.includes('cleanliness') && (formData.tenantMaintenance.includes('minorRepairs') || formData.tenantMaintenance.includes('reporting')) ? ', ' : ''}${formData.tenantMaintenance.includes('minorRepairs') ? 'performing minor repairs' : ''}${(formData.tenantMaintenance.includes('cleanliness') || formData.tenantMaintenance.includes('minorRepairs')) && formData.tenantMaintenance.includes('reporting') ? ', and ' : ''}${formData.tenantMaintenance.includes('reporting') ? 'promptly reporting any issues requiring repair to Landlord' : ''}.

Landlord Responsibilities: Landlord shall be responsible for ${formData.landlordMaintenance.includes('majorRepairs') ? 'major repairs' : ''}${formData.landlordMaintenance.includes('majorRepairs') && (formData.landlordMaintenance.includes('electrical') || formData.landlordMaintenance.includes('plumbing') || formData.landlordMaintenance.includes('heating')) ? ', ' : ''}${formData.landlordMaintenance.includes('electrical') ? 'electrical system maintenance' : ''}${formData.landlordMaintenance.includes('electrical') && (formData.landlordMaintenance.includes('plumbing') || formData.landlordMaintenance.includes('heating')) ? ', ' : ''}${formData.landlordMaintenance.includes('plumbing') ? 'plumbing system maintenance' : ''}${(formData.landlordMaintenance.includes('electrical') || formData.landlordMaintenance.includes('plumbing')) && formData.landlordMaintenance.includes('heating') ? ', and ' : ''}${formData.landlordMaintenance.includes('heating') ? 'heating system maintenance' : ''}.

Emergency Contact: ${formData.emergencyContact ? `In case of emergency, Tenant should contact: ${formData.emergencyContact}` : 'In case of emergency, Tenant should contact Landlord at the phone number provided above.'}

9. ACCESS

Except in case of emergency, Landlord shall give Tenant at least ${formData.entryNotice || '24'} hours' notice of the intent to enter the Property. Landlord may enter the Property at reasonable times to inspect, make repairs, or show the Property to prospective tenants or purchasers.

10. PETS

${formData.petsAllowed ? `Pets are allowed subject to the following restrictions: ${formData.petTypes ? formData.petTypes : 'as approved by Landlord'}. ${formData.petDeposit ? `An additional pet deposit of ${formatCurrency(formData.petDeposit)} is required.` : ''}` : 'No pets are allowed on the Property without the prior written consent of Landlord.'}

11. SMOKING

${formData.smokingAllowed ? `Smoking is permitted subject to the following restrictions: ${formData.smokingPolicy}` : 'Smoking is not permitted on the Property.'}

12. QUIET ENJOYMENT AND CONDUCT

Quiet Hours: Tenant agrees to observe quiet hours between ${formData.quietHoursStart} and ${formData.quietHoursEnd}.

Guest Policy: ${formData.guestPolicy === 'reasonable' ? 'Tenant may have guests for reasonable periods with prior notice to Landlord for extended stays.' : formData.guestPolicy === 'limited' ? 'Guests may stay for no more than 7 consecutive days without prior written consent from Landlord.' : formData.guestPolicy === 'restricted' ? 'No overnight guests are permitted without prior written consent from Landlord.' : ''}

13. ALTERATIONS AND IMPROVEMENTS

${formData.alterationsAllowed ? 'Tenant may make alterations or improvements to the Property with prior written consent from Landlord.' : 'Tenant shall not make any alterations or improvements to the Property without the prior written consent of Landlord.'}

14. TERMINATION AND SURRENDER

Notice to Vacate: Either party may terminate this Agreement by providing at least ${formData.noticeToVacate || '30'} days' written notice.

Early Termination: ${formData.earlyTerminationFee ? `If Tenant terminates this Agreement before the end of the lease term, Tenant shall pay an early termination fee of ${formatCurrency(formData.earlyTerminationFee)}.` : 'If Tenant terminates this Agreement before the end of the lease term, Tenant may be responsible for rent payments until the end of the lease term or until the Property is re-rented, whichever occurs first.'}

Move-out Procedures: ${formData.moveOutProcedures === 'clean' ? 'Tenant shall clean the Property thoroughly, remove all personal belongings, and return all keys to Landlord upon move-out.' : formData.moveOutProcedures === 'professional' ? 'Tenant shall arrange for professional cleaning of the Property, remove all personal belongings, and return all keys to Landlord upon move-out.' : formData.moveOutProcedures === 'inspection' ? 'Tenant shall clean the Property, remove all personal belongings, and participate in a move-out inspection with Landlord.' : ''}

15. ATTORNEY'S FEES

In the event of any legal action concerning this Agreement, the prevailing party shall be entitled to recover reasonable attorney's fees and court costs.

16. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the state in which the Property is located.

17. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the Parties and supersedes any prior understanding or representation of any kind preceding the date of this Agreement. There are no other promises, conditions, understandings or other agreements, whether oral or written, relating to the subject matter of this Agreement.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.

LANDLORD:

____________________________
${formData.landlordName}
Date: ____________________


TENANT:

____________________________
${formData.tenantName}
Date: ____________________`;

    return text;
  }, [formData]);
  
  // Generate highlighted document text based on what was last changed
  const getHighlightedDocumentText = () => {
    if (!lastChanged) return documentText;
    
    // Define patterns to highlight based on the last changed field
    const patterns = {
      // Basic Information
      landlordName: new RegExp(`LANDLORD: ${formData.landlordName}|${formData.landlordName}`, 'g'),
      landlordAddress: new RegExp(`Address: ${formData.landlordAddress}`, 'g'),
      landlordPhone: new RegExp(`Phone: ${formData.landlordPhone}`, 'g'),
      landlordEmail: new RegExp(`Email: ${formData.landlordEmail}`, 'g'),
      tenantName: new RegExp(`TENANT\\(S\\): ${formData.tenantName}|${formData.tenantName}`, 'g'),
      tenantPhone: new RegExp(`Phone: ${formData.tenantPhone}`, 'g'),
      tenantEmail: new RegExp(`Email: ${formData.tenantEmail}`, 'g'),
      agreementDate: new RegExp(`entered into on [\\w\\s,]+`, 'g'),
      
      // Property Details
      propertyAddress: new RegExp(`located at:\\s*${formData.propertyAddress}`, 'g'),
      propertyType: new RegExp(`Property Type: [\\w/-]+`, 'g'),
      isFurnished: new RegExp(`Furnishing: The property is (furnished|unfurnished)`, 'g'),
      includedUtilities: new RegExp(`Landlord shall be responsible for the payment of the following utilities and services: .+\\.`, 'g'),
      parkingIncluded: new RegExp(`Parking is (included in the rent|not provided as part of this Agreement)`, 'g'),
      parkingDetails: new RegExp(`Parking details: ${formData.parkingDetails}`, 'g'),
      
      // Lease Terms
      leaseStartDate: new RegExp(`commence on [\\w\\s,]+`, 'g'),
      leaseEndDate: new RegExp(`until [\\w\\s,]+`, 'g'),
      leaseType: new RegExp(`continue as a [\\w-]+ lease|continue as a [\\w-]+ tenancy`, 'g'),
      renewalOption: new RegExp(`Agreement shall [\\w\\s-]+\\. (Either party|'')`, 'g'),
      occupancyLimit: new RegExp(`occupied by no more than ${formData.occupancyLimit} person\\(s\\)`, 'g'),
      
      // Rent and Payments
      monthlyRent: new RegExp(`the amount of \\$[\\d.]+`, 'g'),
      rentDueDate: new RegExp(`due on the \\d+(st|nd|rd|th)`, 'g'),
      gracePeriod: new RegExp(`but before the \\d+(st|nd|rd|th)`, 'g'),
      latePaymentFee: new RegExp(`subject to a late fee of \\$[\\d.]+`, 'g'),
      securityDeposit: new RegExp(`the sum of \\$[\\d.]+`, 'g'),
      depositDueDate: new RegExp(`due by [\\w\\s,]+`, 'g'),
      paymentMethods: new RegExp(`payable by the following method\\(s\\): [\\w\\s,]+`, 'g'),
      
      // Rules and Policies
      petsAllowed: new RegExp(`(Pets are allowed subject to|No pets are allowed)`, 'g'),
      petTypes: new RegExp(`the following restrictions: [\\w\\s]+\\.`, 'g'),
      petDeposit: new RegExp(`pet deposit of \\$[\\d.]+`, 'g'),
      smokingAllowed: new RegExp(`(Smoking is permitted|Smoking is not permitted)`, 'g'),
      smokingPolicy: new RegExp(`the following restrictions: ${formData.smokingPolicy}`, 'g'),
      quietHoursStart: new RegExp(`between ${formData.quietHoursStart}`, 'g'),
      quietHoursEnd: new RegExp(`and ${formData.quietHoursEnd}`, 'g'),
      guestPolicy: new RegExp(`Guest Policy: .+`, 'g'),
      alterationsAllowed: new RegExp(`(Tenant may make alterations|Tenant shall not make any alterations)`, 'g'),
      
      // Maintenance
      tenantMaintenance: new RegExp(`Tenant Responsibilities: Tenant shall be responsible for .+`, 'g'),
      landlordMaintenance: new RegExp(`Landlord Responsibilities: Landlord shall be responsible for .+`, 'g'),
      emergencyContact: new RegExp(`Emergency Contact: .+`, 'g'),
      entryNotice: new RegExp(`at least ${formData.entryNotice || '24'} hours' notice`, 'g'),
      
      // Termination
      earlyTerminationFee: new RegExp(`Early Termination: .+`, 'g'),
      noticeToVacate: new RegExp(`at least ${formData.noticeToVacate || '30'} days' written notice`, 'g'),
      moveOutProcedures: new RegExp(`Move-out Procedures: .+`, 'g'),
      depositReturnPeriod: new RegExp(`shall be returned to Tenant within ${formData.depositReturnPeriod || '21'} days`, 'g')
    };
    
    if (patterns[lastChanged]) {
      return documentText.replace(patterns[lastChanged], match => {
        return `<span class="highlighted-text">${match}</span>`;
      });
    }
    
    return documentText;
  };
  
  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastChanged]);
  
  // Function to assess risks in the agreement
  const assessRisks = () => {
    const risks = [];
    
    // Check for missing essential information
    if (!formData.leaseStartDate || !formData.leaseEndDate) {
      risks.push({
        level: 'high',
        title: 'Missing Lease Dates',
        description: 'The lease start and end dates must be specified to create a valid agreement.'
      });
    }
    
    if (!formData.monthlyRent) {
      risks.push({
        level: 'high',
        title: 'Missing Rent Amount',
        description: 'The monthly rent amount must be specified to create a valid agreement.'
      });
    }
    
    if (!formData.securityDeposit) {
      risks.push({
        level: 'medium',
        title: 'Missing Security Deposit',
        description: 'A security deposit is recommended to protect against damage or unpaid rent.'
      });
    }
    
    if (!formData.propertyAddress) {
      risks.push({
        level: 'high',
        title: 'Missing Property Address',
        description: 'The property address must be specified to create a valid agreement.'
      });
    }
    
    // Check for potential legal issues
    if (formData.petsAllowed && !formData.petTypes) {
      risks.push({
        level: 'medium',
        title: 'Undefined Pet Restrictions',
        description: 'If pets are allowed, specify the types, sizes, or breeds that are permitted.'
      });
    }
    
    if (!formData.latePaymentFee) {
      risks.push({
        level: 'low',
        title: 'Late Payment Fee Not Specified',
        description: 'Consider specifying a late payment fee to discourage late rent payments.'
      });
    }
    
    if (formData.tenantMaintenance.length === 0) {
      risks.push({
        level: 'medium',
        title: 'Tenant Maintenance Responsibilities Not Defined',
        description: 'Clearly define tenant maintenance responsibilities to avoid disputes.'
      });
    }
    
    if (formData.landlordMaintenance.length === 0) {
      risks.push({
        level: 'medium',
        title: 'Landlord Maintenance Responsibilities Not Defined',
        description: 'Clearly define landlord maintenance responsibilities to avoid disputes.'
      });
    }
    
    if (!formData.emergencyContact) {
      risks.push({
        level: 'low',
        title: 'No Emergency Contact Specified',
        description: 'Provide an emergency contact for urgent maintenance issues.'
      });
    }
    
    return risks;
  };
  
  // Render tab content based on current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Information
        return (
          <div className="form-section">
            <h2>Landlord Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="landlordName">Landlord Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  id="landlordName"
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="landlordAddress">Landlord Address</label>
                <input
                  className="form-input"
                  type="text"
                  id="landlordAddress"
                  name="landlordAddress"
                  value={formData.landlordAddress}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group medium">
                <label className="form-label" htmlFor="landlordPhone">Landlord Phone</label>
                <input
                  className="form-input"
                  type="tel"
                  id="landlordPhone"
                  name="landlordPhone"
                  value={formData.landlordPhone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="landlordEmail">Landlord Email</label>
                <input
                  className="form-input"
                  type="email"
                  id="landlordEmail"
                  name="landlordEmail"
                  value={formData.landlordEmail}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <h2 className="mt-2">Tenant Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="tenantName">Tenant Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  id="tenantName"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group medium">
                <label className="form-label" htmlFor="tenantPhone">Tenant Phone</label>
                <input
                  className="form-input"
                  type="tel"
                  id="tenantPhone"
                  name="tenantPhone"
                  value={formData.tenantPhone}
                  onChange={handleChange}
                  placeholder="(555) 987-6543"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tenantEmail">Tenant Email</label>
                <input
                  className="form-input"
                  type="email"
                  id="tenantEmail"
                  name="tenantEmail"
                  value={formData.tenantEmail}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            
            <h2 className="mt-2">Agreement Date</h2>
            <div className="form-row">
              <div className="form-group medium">
                <label className="form-label" htmlFor="agreementDate">Date of Agreement</label>
                <input
                  className="form-input"
                  type="date"
                  id="agreementDate"
                  name="agreementDate"
                  value={formData.agreementDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );
      
      case 1: // Property Details
        return (
          <div className="form-section">
            <h2>Property Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="propertyAddress">Property Address</label>
                <input
                  className="form-input"
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  placeholder="456 Rental St, City, State, ZIP"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="propertyType">Property Type</label>
                <select
                  className="form-select"
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">Single-family House</option>
                  <option value="condo">Condominium</option>
                  <option value="duplex">Duplex/Townhouse</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="isFurnished"
                    name="isFurnished"
                    checked={formData.isFurnished}
                    onChange={handleChange}
                  />
                  <label className="form-label" htmlFor="isFurnished">Property is Furnished</label>
                </div>
              </div>
            </div>
            
            <h2 className="mt-2">Included Utilities</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="includedUtilities">Select Included Utilities</label>
                <select
                  className="form-select"
                  id="includedUtilities"
                  name="includedUtilities"
                  multiple
                  size="5"
                  value={formData.includedUtilities}
                  onChange={handleChange}
                >
                  <option value="water">Water</option>
                  <option value="electricity">Electricity</option>
                  <option value="gas">Gas</option>
                  <option value="internet">Internet</option>
                  <option value="cable">Cable TV</option>
                  <option value="trash">Trash Collection</option>
                  <option value="sewer">Sewer</option>
                  <option value="heating">Heating</option>
                </select>
                <p className="text-sm text-gray mt-2">Hold Ctrl/Cmd to select multiple options</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="includedUtilitiesOther">Other Included Utilities/Services</label>
                <input
                  className="form-input"
                  type="text"
                  id="includedUtilitiesOther"
                  name="includedUtilitiesOther"
                  value={formData.includedUtilitiesOther}
                  onChange={handleChange}
                  placeholder="Lawn care, snow removal, etc."
                />
              </div>
            </div>
            
            <h2 className="mt-2">Parking</h2>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="parkingIncluded"
                    name="parkingIncluded"
                    checked={formData.parkingIncluded}
                    onChange={handleChange}
                  />
                  <label className="form-label" htmlFor="parkingIncluded">Parking Included</label>
                </div>
              </div>
            </div>
            {formData.parkingIncluded && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="parkingDetails">Parking Details</label>
                  <input
                    className="form-input"
                    type="text"
                    id="parkingDetails"
                    name="parkingDetails"
                    value={formData.parkingDetails}
                    onChange={handleChange}
                    placeholder="Assigned spot #123, Street parking, etc."
                  />
                </div>
              </div>
            )}
          </div>
        );
      
      case 2: // Lease Terms
        return (
          <div className="form-section">
            <h2>Lease Period</h2>
            <div className="form-row">
              <div className="form-group medium">
                <label className="form-label" htmlFor="leaseStartDate">Lease Start Date</label>
                <input
                  className="form-input"
                  type="date"
                  id="leaseStartDate"
                  name="leaseStartDate"
                  value={formData.leaseStartDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group medium">
                <label className="form-label" htmlFor="leaseEndDate">Lease End Date</label>
                <input
                  className="form-input"
                  type="date"
                  id="leaseEndDate"
                  name="leaseEndDate"
                  value={formData.leaseEndDate}
                  onChange={handleChange}
                  disabled={formData.leaseType === 'monthly'}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="leaseType">Lease Type</label>
                <select
                  className="form-select"
                  id="leaseType"
                  name="leaseType"
                  value={formData.leaseType}
                  onChange={handleChange}
                >
                  <option value="fixed">Fixed-Term Lease</option>
                  <option value="monthly">Month-to-Month</option>
                </select>
              </div>
            </div>
            
            {formData.leaseType === 'fixed' && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="renewalOption">Renewal Option</label>
                  <select
                    className="form-select"
                    id="renewalOption"
                    name="renewalOption"
                    value={formData.renewalOption}
                    onChange={handleChange}
                  >
                    <option value="automatic">Automatic Month-to-Month Renewal</option>
                    <option value="written">Requires Written Agreement to Renew</option>
                    <option value="terminate">Terminates Without Further Notice</option>
                  </select>
                </div>
              </div>
            )}
            
            <h2 className="mt-2">Occupancy</h2>
            <div className="form-row">
              <div className="form-group small">
                <label className="form-label" htmlFor="occupancyLimit">Maximum Occupants</label>
                <input
                  className="form-input"
                  type="number"
                  id="occupancyLimit"
                  name="occupancyLimit"
                  min="1"
                  max="20"
                  value={formData.occupancyLimit}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );
      
      case 3: // Rent and Payments
        return (
          <div className="form-section">
            <h2>Rent Details</h2>
            <div className="form-row">
              <div className="form-group medium">
                <label className="form-label" htmlFor="monthlyRent">Monthly Rent ($)</label>
                <input
                  className="form-input"
                  type="number"
                  id="monthlyRent"
                  name="monthlyRent"
                  min="0"
                  step="0.01"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  placeholder="1200.00"
                />
              </div>
              <div className="form-group small">
                <label className="form-label" htmlFor="rentDueDate">Due Date</label>
                <select
                  className="form-select"
                  id="rentDueDate"
                  name="rentDueDate"
                  value={formData.rentDueDate}
                  onChange={handleChange}
                >
                  <option value="1">1st</option>
                  <option value="5">5th</option>
                  <option value="10">10th</option>
                  <option value="15">15th</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group small">
                <label className="form-label" htmlFor="gracePeriod">Grace Period (Days)</label>
                <select
                  className="form-select"
                  id="gracePeriod"
                  name="gracePeriod"
                  value={formData.gracePeriod}
                  onChange={handleChange}
                >
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                  <option value="10">10 days</option>
                </select>
              </div>
              <div className="form-group medium">
                <label className="form-label" htmlFor="latePaymentFee">Late Payment Fee ($)</label>
                <input
                  className="form-input"
                  type="number"
                  id="latePaymentFee"
                  name="latePaymentFee"
                  min="0"
                  step="0.01"
                  value={formData.latePaymentFee}
                  onChange={handleChange}
                  placeholder="50.00"
                />
              </div>
            </div>
            
            <h2 className="mt-2">Security Deposit</h2>
            <div className="form-row">
              <div className="form-group medium">
                <label className="form-label" htmlFor="securityDeposit">Security Deposit ($)</label>
                <input
                  className="form-input"
                  type="number"
                  id="securityDeposit"
                  name="securityDeposit"
                  min="0"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="1200.00"
                />
              </div>
              <div className="form-group medium">
                <label className="form-label" htmlFor="depositDueDate">Deposit Due Date</label>
                <input
                  className="form-input"
                  type="date"
                  id="depositDueDate"
                  name="depositDueDate"
                  value={formData.depositDueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <h2 className="mt-2">Payment Methods</h2>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="paymentMethodCheck"
                    name="paymentMethods"
                    value="check"
                    checked={formData.paymentMethods.includes('check')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('paymentMethods');
                      setFormData(prev => ({
                        ...prev,
                        paymentMethods: isChecked
                          ? [...prev.paymentMethods, 'check']
                          : prev.paymentMethods.filter(method => method !== 'check')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="paymentMethodCheck">Personal Check</label>
                </div>
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="paymentMethodElectronic"
                    name="paymentMethods"
                    value="electronic"
                    checked={formData.paymentMethods.includes('electronic')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('paymentMethods');
                      setFormData(prev => ({
                        ...prev,
                        paymentMethods: isChecked
                          ? [...prev.paymentMethods, 'electronic']
                          : prev.paymentMethods.filter(method => method !== 'electronic')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="paymentMethodElectronic">Electronic Payment</label>
                </div>
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="paymentMethodCash"
                    name="paymentMethods"
                    value="cash"
                    checked={formData.paymentMethods.includes('cash')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('paymentMethods');
                      setFormData(prev => ({
                        ...prev,
                        paymentMethods: isChecked
                          ? [...prev.paymentMethods, 'cash']
                          : prev.paymentMethods.filter(method => method !== 'cash')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="paymentMethodCash">Cash</label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4: // Rules and Policies
        return (
          <div className="form-section">
            <h2>Pet Policy</h2>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="petsAllowed"
                    name="petsAllowed"
                    checked={formData.petsAllowed}
                    onChange={handleChange}
                  />
                  <label className="form-label" htmlFor="petsAllowed">Pets Allowed</label>
                </div>
              </div>
            </div>
            {formData.petsAllowed && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="petTypes">Allowed Pet Types/Restrictions</label>
                    <input
                      className="form-input"
                      type="text"
                      id="petTypes"
                      name="petTypes"
                      value={formData.petTypes}
                      onChange={handleChange}
                      placeholder="Dogs under 30 lbs, indoor cats only, etc."
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group medium">
                    <label className="form-label" htmlFor="petDeposit">Pet Deposit ($)</label>
                    <input
                      className="form-input"
                      type="number"
                      id="petDeposit"
                      name="petDeposit"
                      min="0"
                      step="0.01"
                      value={formData.petDeposit}
                      onChange={handleChange}
                      placeholder="300.00"
                    />
                  </div>
                </div>
              </>
            )}
            
            <h2 className="mt-2">Smoking Policy</h2>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="smokingAllowed"
                    name="smokingAllowed"
                    checked={formData.smokingAllowed}
                    onChange={handleChange}
                  />
                  <label className="form-label" htmlFor="smokingAllowed">Smoking Allowed</label>
                </div>
              </div>
            </div>
            {formData.smokingAllowed && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="smokingPolicy">Smoking Policy Details</label>
                  <input
                    className="form-input"
                    type="text"
                    id="smokingPolicy"
                    name="smokingPolicy"
                    value={formData.smokingPolicy}
                    onChange={handleChange}
                    placeholder="Outdoor areas only, designated areas, etc."
                  />
                </div>
              </div>
            )}
            
            <h2 className="mt-2">Quiet Hours</h2>
            <div className="form-row">
              <div className="form-group small">
                <label className="form-label" htmlFor="quietHoursStart">Start Time</label>
                <input
                  className="form-input"
                  type="time"
                  id="quietHoursStart"
                  name="quietHoursStart"
                  value={formData.quietHoursStart}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group small">
                <label className="form-label" htmlFor="quietHoursEnd">End Time</label>
                <input
                  className="form-input"
                  type="time"
                  id="quietHoursEnd"
                  name="quietHoursEnd"
                  value={formData.quietHoursEnd}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <h2 className="mt-2">Other Policies</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="guestPolicy">Guest Policy</label>
                <select
                  className="form-select"
                  id="guestPolicy"
                  name="guestPolicy"
                  value={formData.guestPolicy}
                  onChange={handleChange}
                >
                  <option value="reasonable">Reasonable Guests Allowed</option>
                  <option value="limited">Limited Guest Stays (Max 7 Days)</option>
                  <option value="restricted">No Overnight Guests Without Permission</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="alterationsAllowed"
                    name="alterationsAllowed"
                    checked={formData.alterationsAllowed}
                    onChange={handleChange}
                  />
                  <label className="form-label" htmlFor="alterationsAllowed">Allow Alterations/Improvements with Permission</label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5: // Maintenance and Repairs
        return (
          <div className="form-section">
            <h2>Tenant Maintenance Responsibilities</h2>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="tenantMaintenanceCleanliness"
                    name="tenantMaintenance"
                    value="cleanliness"
                    checked={formData.tenantMaintenance.includes('cleanliness')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('tenantMaintenance');
                      setFormData(prev => ({
                        ...prev,
                        tenantMaintenance: isChecked
                          ? [...prev.tenantMaintenance, 'cleanliness']
                          : prev.tenantMaintenance.filter(resp => resp !== 'cleanliness')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="tenantMaintenanceCleanliness">Maintaining Cleanliness</label>
                </div>
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="tenantMaintenanceMinorRepairs"
                    name="tenantMaintenance"
                    value="minorRepairs"
                    checked={formData.tenantMaintenance.includes('minorRepairs')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('tenantMaintenance');
                      setFormData(prev => ({
                        ...prev,
                        tenantMaintenance: isChecked
                          ? [...prev.tenantMaintenance, 'minorRepairs']
                          : prev.tenantMaintenance.filter(resp => resp !== 'minorRepairs')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="tenantMaintenanceMinorRepairs">Minor Repairs</label>
                </div>
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="tenantMaintenanceReporting"
                    name="tenantMaintenance"
                    value="reporting"
                    checked={formData.tenantMaintenance.includes('reporting')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('tenantMaintenance');
                      setFormData(prev => ({
                        ...prev,
                        tenantMaintenance: isChecked
                          ? [...prev.tenantMaintenance, 'reporting']
                          : prev.tenantMaintenance.filter(resp => resp !== 'reporting')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="tenantMaintenanceReporting">Prompt Reporting of Issues</label>
                </div>
              </div>
            </div>
            
            <h2 className="mt-2">Landlord Maintenance Responsibilities</h2>
            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="landlordMaintenanceMajorRepairs"
                    name="landlordMaintenance"
                    value="majorRepairs"
                    checked={formData.landlordMaintenance.includes('majorRepairs')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('landlordMaintenance');
                      setFormData(prev => ({
                        ...prev,
                        landlordMaintenance: isChecked
                          ? [...prev.landlordMaintenance, 'majorRepairs']
                          : prev.landlordMaintenance.filter(resp => resp !== 'majorRepairs')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="landlordMaintenanceMajorRepairs">Major Repairs</label>
                </div>
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="landlordMaintenanceElectrical"
                    name="landlordMaintenance"
                    value="electrical"
                    checked={formData.landlordMaintenance.includes('electrical')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('landlordMaintenance');
                      setFormData(prev => ({
                        ...prev,
                        landlordMaintenance: isChecked
                          ? [...prev.landlordMaintenance, 'electrical']
                          : prev.landlordMaintenance.filter(resp => resp !== 'electrical')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="landlordMaintenanceElectrical">Electrical System</label>
                </div>
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="landlordMaintenancePlumbing"
                    name="landlordMaintenance"
                    value="plumbing"
                    checked={formData.landlordMaintenance.includes('plumbing')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('landlordMaintenance');
                      setFormData(prev => ({
                        ...prev,
                        landlordMaintenance: isChecked
                          ? [...prev.landlordMaintenance, 'plumbing']
                          : prev.landlordMaintenance.filter(resp => resp !== 'plumbing')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="landlordMaintenancePlumbing">Plumbing System</label>
                </div>
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="landlordMaintenanceHeating"
                    name="landlordMaintenance"
                    value="heating"
                    checked={formData.landlordMaintenance.includes('heating')}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setLastChanged('landlordMaintenance');
                      setFormData(prev => ({
                        ...prev,
                        landlordMaintenance: isChecked
                          ? [...prev.landlordMaintenance, 'heating']
                          : prev.landlordMaintenance.filter(resp => resp !== 'heating')
                      }));
                    }}
                  />
                  <label className="form-label" htmlFor="landlordMaintenanceHeating">Heating System</label>
                </div>
              </div>
            </div>
            
            <h2 className="mt-2">Emergency Procedures</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="emergencyContact">Emergency Contact Information</label>
                <input
                  className="form-input"
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Contact name, phone, email for emergencies"
                />
              </div>
            </div>
            
            <h2 className="mt-2">Property Access</h2>
            <div className="form-row">
              <div className="form-group small">
                <label className="form-label" htmlFor="entryNotice">Entry Notice (Hours)</label>
                <input
                  className="form-input"
                  type="number"
                  id="entryNotice"
                  name="entryNotice"
                  min="0"
                  value={formData.entryNotice}
                  onChange={handleChange}
                  placeholder="24"
                />
              </div>
            </div>
          </div>
        );
      
      case 6: // Termination and Final Terms
        return (
          <div className="form-section">
            <h2>Early Termination</h2>
            <div className="form-row">
              <div className="form-group medium">
                <label className="form-label" htmlFor="earlyTerminationFee">Early Termination Fee ($)</label>
                <input
                  className="form-input"
                  type="number"
                  id="earlyTerminationFee"
                  name="earlyTerminationFee"
                  min="0"
                  step="0.01"
                  value={formData.earlyTerminationFee}
                  onChange={handleChange}
                  placeholder="Leave blank for remaining rent obligation"
                />
              </div>
            </div>
            
            <h2 className="mt-2">Notice Requirements</h2>
            <div className="form-row">
              <div className="form-group small">
                <label className="form-label" htmlFor="noticeToVacate">Notice to Vacate (Days)</label>
                <input
                  className="form-input"
                  type="number"
                  id="noticeToVacate"
                  name="noticeToVacate"
                  min="0"
                  value={formData.noticeToVacate}
                  onChange={handleChange}
                  placeholder="30"
                />
              </div>
            </div>
            
            <h2 className="mt-2">Move-Out Procedures</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="moveOutProcedures">Move-Out Requirements</label>
                <select
                  className="form-select"
                  id="moveOutProcedures"
                  name="moveOutProcedures"
                  value={formData.moveOutProcedures}
                  onChange={handleChange}
                >
                  <option value="clean">Standard Cleaning by Tenant</option>
                  <option value="professional">Professional Cleaning Required</option>
                  <option value="inspection">Move-Out Inspection Required</option>
                </select>
              </div>
            </div>
            
            <h2 className="mt-2">Security Deposit Return</h2>
            <div className="form-row">
              <div className="form-group small">
                <label className="form-label" htmlFor="depositReturnPeriod">Return Period (Days)</label>
                <input
                  className="form-input"
                  type="number"
                  id="depositReturnPeriod"
                  name="depositReturnPeriod"
                  min="0"
                  value={formData.depositReturnPeriod}
                  onChange={handleChange}
                  placeholder="21"
                />
              </div>
            </div>
            
            <h2 className="mt-2">Document Settings</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="documentTitle">Document Title</label>
                <input
                  className="form-input"
                  type="text"
                  id="documentTitle"
                  name="documentTitle"
                  value={formData.documentTitle}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fileName">File Name (for download)</label>
                <input
                  className="form-input"
                  type="text"
                  id="fileName"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );
      
      case 7: // Review and Finalize
        return (
          <div className="form-section">
            <h2>Risk Assessment</h2>
            <div className="risk-assessment">
              {assessRisks().map((risk, index) => (
                <div key={index} className={`risk-item risk-${risk.level}`}>
                  <h4>{risk.title}</h4>
                  <p>{risk.description}</p>
                </div>
              ))}
              {assessRisks().length === 0 && (
                <div className="risk-item risk-low">
                  <h4>No Major Issues Detected</h4>
                  <p>The lease agreement appears to be properly configured. However, always review the final document carefully before signing.</p>
                </div>
              )}
            </div>
            
            <h2 className="mt-2">Important Notes</h2>
            <div className="form-row">
              <div className="form-group">
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li className="mb-2">This lease agreement has been generated based on your inputs. It may need to be customized further to comply with your local laws and regulations.</li>
                  <li className="mb-2">Local and state laws vary regarding landlord-tenant relationships. This agreement should be reviewed by a legal professional in your jurisdiction.</li>
                  <li className="mb-2">Security deposit amounts and return periods may be regulated by local law.</li>
                  <li className="mb-2">Specific disclosures (such as lead paint, mold, etc.) may be required depending on your location and are not included in this basic agreement.</li>
                </ul>
              </div>
            </div>
            
            <h2 className="mt-2">Next Steps</h2>
            <div className="form-row">
              <div className="form-group">
                <ol style={{ paddingLeft: '1.5rem' }}>
                  <li className="mb-2">Review the agreement carefully and make any necessary changes.</li>
                  <li className="mb-2">Have the agreement reviewed by a legal professional familiar with your local laws.</li>
                  <li className="mb-2">Add any required disclosures or addendums specific to your property or location.</li>
                  <li className="mb-2">Sign the agreement with the tenant(s) and provide them with a copy.</li>
                  <li className="mb-2">Keep a signed copy of the agreement for your records.</li>
                </ol>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Tab content not found</div>;
    }
  };
  
  return (
    <div className="container">
      <div className="header">
        <h1>Residential Lease Agreement Generator</h1>
        <p>Create a customized lease agreement with all essential terms and conditions</p>
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
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: getHighlightedDocumentText() }}
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
          Copy
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
          Download
        </button>
        
        <button
          onClick={openCalendly}
          className="nav-button"
          style={{
            backgroundColor: "#0f766e", 
            color: "white",
            border: "none"
          }}
        >
          <Icon name="calendar" style={{marginRight: "0.25rem"}} />
          Consult
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
      
      {/* Calendly Widget Script */}
      <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
    </div>
  );
};

// Render the generator
ReactDOM.render(
  <LeaseAgreementGenerator />,
  document.getElementById('root')
);