// Independent Contractor Agreement Generator
const { useState, useRef, useEffect } = React;

const IndependentContractorGenerator = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const previewRef = useRef(null);
  
  const [formData, setFormData] = useState({
    companyName: '', companyAddress: '', companyCity: '', companyState: '', companyZip: '',
    consultantName: '', consultantAddress: '', consultantCity: '', consultantState: '', consultantZip: '',
    effectiveDate: '', paymentTerms: 'monthly', hourlyRate: '', fixedPrice: '', paymentType: 'hourly',
    servicesDescription: '', deliverables: '', termLength: '', terminationNotice: '10',
    governingState: 'California', jurisdiction: 'Los Angeles, CA',
    includeIPAssignment: true, includeNonCompete: false, includeNonSolicitation: true, includeConfidentiality: true,
    companyNameRus: '', consultantNameRus: '', servicesDescriptionRus: '', deliverablesRus: ''
  });

  const tabs = [
    { id: 'parties', label: 'Parties' }, { id: 'services', label: 'Services' }, { id: 'payment', label: 'Payment' },
    { id: 'terms', label: 'Terms' }, { id: 'options', label: 'Options' }, { id: 'review', label: 'Review' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  // Initialize feather icons when component mounts
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [currentTab]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText);
    alert('Agreement copied to clipboard!');
  };

  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      window.generateWordDoc(documentText, {
        documentTitle: "Independent Contractor Agreement",
        fileName: "Independent-Contractor-Agreement"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Generate document text based on form data
  const documentText = `CONSULTING AGREEMENT

This Consulting Agreement ("Agreement") is entered into as of ${formData.effectiveDate || '[DATE]'}, between ${formData.companyName || '[COMPANY NAME]'} ("Company"), and ${formData.consultantName || '[CONSULTANT NAME]'} ("Consultant") (the Company and Consultant are each referred to herein individually as a "Party" and collectively as the "Parties").

For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the Parties agree as follows:

1. SERVICES

1.1 Services. Consultant will perform the following services: ${formData.servicesDescription || '[DESCRIBE SERVICES]'}

1.2 Deliverables. Consultant will deliver to Company: ${formData.deliverables || '[DESCRIBE DELIVERABLES]'}

2. PAYMENT

2.1 Fees. As Consultant's sole compensation for the performance of Services, Company will pay Consultant ${formData.paymentType === 'hourly' ? `$${formData.hourlyRate || '[RATE]'} per hour` : `a fixed fee of $${formData.fixedPrice || '[AMOUNT]'}`}.

2.2 Payment Terms. Consultant will invoice Company ${formData.paymentTerms} for all fees. Company will pay the full amount of each invoice within thirty (30) days following receipt thereof.

3. RELATIONSHIP OF THE PARTIES

3.1 Independent Contractor. Consultant is an independent contractor and nothing in this Agreement will be construed as establishing an employment or agency relationship between Company and Consultant.

4. TERM AND TERMINATION

4.1 Term. This Agreement will commence on the Effective Date and will remain in force ${formData.termLength ? `for ${formData.termLength}` : 'until terminated'}.

4.2 Termination for Convenience. Company may terminate this Agreement at any time, for any reason or no reason, upon at least ${formData.terminationNotice} (${formData.terminationNotice}) days written notice to Consultant.

5. GENERAL

5.1 Governing Law. This Agreement will be governed by and construed in accordance with the laws of the State of ${formData.governingState}. Any legal action or proceeding arising under this Agreement will be brought exclusively in the courts located in ${formData.jurisdiction}.

IN WITNESS WHEREOF, the Parties have executed this agreement as of the Effective Date.

COMPANY:                              CONSULTANT:

By: _________________________         By: _________________________
Name: ${formData.companyName || '[COMPANY NAME]'}                 Name: ${formData.consultantName || '[CONSULTANT NAME]'}
Title: _______________________         Title: _______________________
Date: _______________________         Date: _______________________`;


  const renderPartiesTab = () => (
    <div className="form-section">
      <h3>Company Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </div>
        <div className="form-group">
          <label>Company Name (Russian)</label>
          <input
            type="text"
            name="companyNameRus"
            value={formData.companyNameRus}
            onChange={handleChange}
            placeholder="Название компании"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Company Address</label>
        <input
          type="text"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={handleChange}
          placeholder="Street address"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="companyCity"
            value={formData.companyCity}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="companyState"
            value={formData.companyState}
            onChange={handleChange}
            placeholder="State"
          />
        </div>
        <div className="form-group">
          <label>ZIP</label>
          <input
            type="text"
            name="companyZip"
            value={formData.companyZip}
            onChange={handleChange}
            placeholder="ZIP"
          />
        </div>
      </div>

      
      <h3>Consultant Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Consultant Name</label>
          <input
            type="text"
            name="consultantName"
            value={formData.consultantName}
            onChange={handleChange}
            placeholder="Enter consultant name"
          />
        </div>
        <div className="form-group">
          <label>Consultant Name (Russian)</label>
          <input
            type="text"
            name="consultantNameRus"
            value={formData.consultantNameRus}
            onChange={handleChange}
            placeholder="Имя консультанта"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Consultant Address</label>
        <input
          type="text"
          name="consultantAddress"
          value={formData.consultantAddress}
          onChange={handleChange}
          placeholder="Street address"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="consultantCity"
            value={formData.consultantCity}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="consultantState"
            value={formData.consultantState}
            onChange={handleChange}
            placeholder="State"
          />
        </div>
        <div className="form-group">
          <label>ZIP</label>
          <input
            type="text"
            name="consultantZip"
            value={formData.consultantZip}
            onChange={handleChange}
            placeholder="ZIP"
          />
        </div>
      </div>
    </div>
  );


  const renderServicesTab = () => (
    <div className="form-section">
      <div className="form-group">
        <label>Services Description</label>
        <textarea
          name="servicesDescription"
          value={formData.servicesDescription}
          onChange={handleChange}
          placeholder="Describe the services to be provided"
          rows="4"
        />
      </div>
      
      <div className="form-group">
        <label>Services Description (Russian)</label>
        <textarea
          name="servicesDescriptionRus"
          value={formData.servicesDescriptionRus}
          onChange={handleChange}
          placeholder="Описание услуг"
          rows="4"
        />
      </div>
      
      <div className="form-group">
        <label>Deliverables</label>
        <textarea
          name="deliverables"
          value={formData.deliverables}
          onChange={handleChange}
          placeholder="Describe specific deliverables"
          rows="4"
        />
      </div>
      
      <div className="form-group">
        <label>Deliverables (Russian)</label>
        <textarea
          name="deliverablesRus"
          value={formData.deliverablesRus}
          onChange={handleChange}
          placeholder="Описание результатов"
          rows="4"
        />
      </div>
      
      <div className="form-group">
        <label>Effective Date</label>
        <input
          type="date"
          name="effectiveDate"
          value={formData.effectiveDate}
          onChange={handleChange}
        />
      </div>
    </div>
  );


  const renderPaymentTab = () => (
    <div className="form-section">
      <div className="form-group">
        <label>Payment Type</label>
        <select
          name="paymentType"
          value={formData.paymentType}
          onChange={handleChange}
        >
          <option value="hourly">Hourly Rate</option>
          <option value="fixed">Fixed Price</option>
        </select>
      </div>
      
      {formData.paymentType === 'hourly' && (
        <div className="form-group">
          <label>Hourly Rate ($)</label>
          <input
            type="number"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            placeholder="Enter hourly rate"
            min="0"
            step="0.01"
          />
        </div>
      )}
      
      {formData.paymentType === 'fixed' && (
        <div className="form-group">
          <label>Fixed Price ($)</label>
          <input
            type="number"
            name="fixedPrice"
            value={formData.fixedPrice}
            onChange={handleChange}
            placeholder="Enter fixed price"
            min="0"
            step="0.01"
          />
        </div>
      )}
      
      <div className="form-group">
        <label>Payment Terms</label>
        <select
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={handleChange}
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="upon_completion">Upon Completion</option>
        </select>
      </div>
    </div>
  );


  const renderTermsTab = () => (
    <div className="form-section">
      <div className="form-group">
        <label>Term Length</label>
        <input
          type="text"
          name="termLength"
          value={formData.termLength}
          onChange={handleChange}
          placeholder="e.g., 6 months, 1 year, or leave blank for indefinite"
        />
      </div>
      
      <div className="form-group">
        <label>Termination Notice (days)</label>
        <select
          name="terminationNotice"
          value={formData.terminationNotice}
          onChange={handleChange}
        >
          <option value="5">5 days</option>
          <option value="10">10 days</option>
          <option value="15">15 days</option>
          <option value="30">30 days</option>
        </select>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Governing State</label>
          <select
            name="governingState"
            value={formData.governingState}
            onChange={handleChange}
          >
            <option value="California">California</option>
            <option value="New York">New York</option>
            <option value="Texas">Texas</option>
            <option value="Florida">Florida</option>
            <option value="Delaware">Delaware</option>
          </select>
        </div>
        <div className="form-group">
          <label>Jurisdiction</label>
          <input
            type="text"
            name="jurisdiction"
            value={formData.jurisdiction}
            onChange={handleChange}
            placeholder="e.g., Los Angeles, CA"
          />
        </div>
      </div>
    </div>
  );


  const renderOptionsTab = () => (
    <div className="form-section">
      <h3>Additional Clauses</h3>
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeIPAssignment"
          name="includeIPAssignment"
          checked={formData.includeIPAssignment}
          onChange={handleChange}
        />
        <label htmlFor="includeIPAssignment">Include IP Assignment Clause</label>
      </div>
      
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeNonCompete"
          name="includeNonCompete"
          checked={formData.includeNonCompete}
          onChange={handleChange}
        />
        <label htmlFor="includeNonCompete">Include Non-Compete Clause</label>
      </div>
      
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeNonSolicitation"
          name="includeNonSolicitation"
          checked={formData.includeNonSolicitation}
          onChange={handleChange}
        />
        <label htmlFor="includeNonSolicitation">Include Non-Solicitation Clause</label>
      </div>
      
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="includeConfidentiality"
          name="includeConfidentiality"
          checked={formData.includeConfidentiality}
          onChange={handleChange}
        />
        <label htmlFor="includeConfidentiality">Include Confidentiality Clause</label>
      </div>
    </div>
  );


  const renderReviewTab = () => (
    <div className="form-section">
      <h3>Agreement Summary</h3>
      <div className="info-card">
        <p><strong>Company:</strong> {formData.companyName || '[Not specified]'}</p>
        <p><strong>Consultant:</strong> {formData.consultantName || '[Not specified]'}</p>
        <p><strong>Effective Date:</strong> {formData.effectiveDate || '[Not specified]'}</p>
        <p><strong>Payment:</strong> {formData.paymentType === 'hourly' ? `$${formData.hourlyRate || '[Rate]'}/hour` : `$${formData.fixedPrice || '[Amount]'} fixed`}</p>
        <p><strong>Payment Terms:</strong> {formData.paymentTerms}</p>
        <p><strong>Term:</strong> {formData.termLength || 'Indefinite'}</p>
        <p><strong>Governing Law:</strong> {formData.governingState}</p>
      </div>
      
      <h3>Included Clauses</h3>
      <div className="info-card">
        <p>✅ Independent Contractor Status</p>
        <p>✅ Payment Terms</p>
        <p>✅ Termination Provisions</p>
        {formData.includeIPAssignment && <p>✅ IP Assignment</p>}
        {formData.includeNonCompete && <p>✅ Non-Compete</p>}
        {formData.includeNonSolicitation && <p>✅ Non-Solicitation</p>}
        {formData.includeConfidentiality && <p>✅ Confidentiality</p>}
      </div>
      
      <div className="info-card warning">
        <p><strong>⚠️ Important:</strong> This is a simplified agreement template. For complex projects or high-value contracts, consider consulting with an attorney to ensure all necessary protections are included.</p>
      </div>
    </div>
  );


  const renderTabContent = () => {
    switch (currentTab) {
      case 0: return renderPartiesTab();
      case 1: return renderServicesTab();
      case 2: return renderPaymentTab();
      case 3: return renderTermsTab();
      case 4: return renderOptionsTab();
      case 5: return renderReviewTab();
      default: return renderPartiesTab();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Independent Contractor Agreement Generator</h1>
        <p>Create a professional bilingual (English/Russian) independent contractor agreement</p>
      </div>
      
      <div className="main-content">
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
          
          {renderTabContent()}
        </div>
        
        <div className="preview-panel">
          <div className="preview-content" ref={previewRef}>
            <h2>Live Preview</h2>
            <pre className="document-preview">
              {documentText}
            </pre>
          </div>
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
          onClick={() => {
            if (window.Calendly) {
              window.Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'});
            } else {
              window.open('https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting', '_blank');
            }
          }}
          className="nav-button"
          style={{backgroundColor: "#28a745", color: "white", border: "none"}}
        >
          <i data-feather="calendar"></i>
          Consult
        </button>
        
        <button
          onClick={nextTab}
          className="nav-button next-button"
        >
          Next
          <i data-feather="chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<IndependentContractorGenerator />, document.getElementById('root'));
