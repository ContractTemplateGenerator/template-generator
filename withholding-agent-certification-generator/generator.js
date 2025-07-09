const { useState, useEffect, useRef } = React;

const treatyData = {
  germany: {
    article: 'Article 11',
    rate: '0%',
    treatyName: 'U.S.–Germany tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/germany-tax-treaty-documents',
    description: 'Germany has a 0% withholding rate on interest under Article 11 of the U.S.-Germany tax treaty. This provides for exclusive residence-based taxation of interest income.'
  },
  malta: {
    article: 'Article 11',
    rate: '10%',
    treatyName: 'U.S.–Malta tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/malta-tax-treaty-documents',
    description: 'Malta has a 10% maximum withholding rate on interest under Article 11 of the U.S.-Malta tax treaty, reducing the standard 30% U.S. withholding tax.'
  },
  thailand: {
    article: 'Article 11',
    rate: '10%',
    treatyName: 'U.S.–Thailand tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/thailand-tax-treaty-documents',
    description: 'Thailand has a 10% maximum withholding rate on interest under Article 11 of the U.S.-Thailand tax treaty.'
  },
  cyprus: {
    article: 'Article 11(2)',
    rate: '10%',
    treatyName: 'U.S.–Cyprus tax treaty (TIAS 11-167)',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/cyprus-tax-treaty-documents',
    description: 'Cyprus has a 10% maximum withholding rate on interest under Article 11(2) of the U.S.-Cyprus tax treaty.'
  }
};

function WithholdingAgentGenerator() {
  const [formData, setFormData] = useState({
    country: '',
    llcName: '',
    llcStreet: '',
    llcCity: '',
    llcState: '',
    llcZip: '',
    ein: '',
    managingMember: '',
    ownerName: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [lastChanged, setLastChanged] = useState(null);
  const [errors, setErrors] = useState({});
  const previewRef = useRef(null);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setLastChanged(fieldName);
    
    // Clear highlighting after 2 seconds
    setTimeout(() => setLastChanged(null), 2000);
    
    // Clear errors for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateEIN = (ein) => {
    const einRegex = /^\d{2}-\d{7}$/;
    return einRegex.test(ein);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.country) newErrors.country = 'Please select a country';
    if (!formData.llcName) newErrors.llcName = 'LLC name is required';
    if (!formData.llcStreet) newErrors.llcStreet = 'Street address is required';
    if (!formData.llcCity) newErrors.llcCity = 'City is required';
    if (!formData.llcState) newErrors.llcState = 'State is required';
    if (!formData.llcZip) newErrors.llcZip = 'ZIP code is required';
    if (!formData.ein) {
      newErrors.ein = 'EIN is required';
    } else if (!validateEIN(formData.ein)) {
      newErrors.ein = 'EIN must be in format XX-XXXXXXX';
    }
    if (!formData.managingMember) newErrors.managingMember = 'Managing member name is required';
    if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateLetter = () => {
    if (!formData.country || !treatyData[formData.country]) return '';
    
    const treaty = treatyData[formData.country];
    const countryName = formData.country.charAt(0).toUpperCase() + formData.country.slice(1);
    
    return `${formData.llcName}
${formData.llcStreet}
${formData.llcCity}, ${formData.llcState} ${formData.llcZip}

To: Internal Revenue Service, ITIN Operations
Re: Certification of anticipated U.S.-source income – W-7 Exception 1(c)

I, ${formData.managingMember}, Managing Member of ${formData.llcName} (EIN ${formData.ein}), certify under penalties of perjury that:

1. ${formData.ownerName}, a resident of ${countryName} and sole member of ${formData.llcName}, will receive periodic capital-account distributions that constitute U.S.-source interest income within the meaning of IRC § 861(a)(1).

2. The distributions are subject to withholding under IRC § 1441 unless the owner provides a valid Form W-8BEN with a U.S. ITIN to claim benefits of ${treaty.article} of the ${treaty.treatyName}, which limits withholding on interest to ${treaty.rate}.

3. ${formData.llcName} will act as withholding agent and will file Form 1042-S reporting those amounts.

Accordingly, an ITIN is required solely to furnish on Form W-8BEN and Form 1042-S; the owner is not otherwise required to file a U.S. income-tax return.

________________________ Date: ${formData.date}
${formData.managingMember}
Managing Member, ${formData.llcName}`;
  };

  const getHighlightedText = () => {
    let text = generateLetter();
    
    if (!lastChanged || !text) return text;
    
    const highlightValue = (value) => {
      if (!value) return '';
      const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return text.replace(new RegExp(`\\b${escapedValue}\\b`, 'g'), `<span class="highlighted-text">${value}</span>`);
    };
    
    switch (lastChanged) {
      case 'llcName':
        text = highlightValue(formData.llcName);
        break;
      case 'llcStreet':
        text = highlightValue(formData.llcStreet);
        break;
      case 'llcCity':
        text = highlightValue(formData.llcCity);
        break;
      case 'llcState':
        text = highlightValue(formData.llcState);
        break;
      case 'llcZip':
        text = highlightValue(formData.llcZip);
        break;
      case 'ein':
        text = highlightValue(formData.ein);
        break;
      case 'managingMember':
        text = highlightValue(formData.managingMember);
        break;
      case 'ownerName':
        text = highlightValue(formData.ownerName);
        break;
      case 'date':
        text = highlightValue(formData.date);
        break;
      case 'country':
        if (formData.country && treatyData[formData.country]) {
          const treaty = treatyData[formData.country];
          const countryName = formData.country.charAt(0).toUpperCase() + formData.country.slice(1);
          text = text.replace(new RegExp(`\\b${countryName}\\b`, 'g'), `<span class="highlighted-text">${countryName}</span>`);
          text = text.replace(new RegExp(`\\b${treaty.rate}\\b`, 'g'), `<span class="highlighted-text">${treaty.rate}</span>`);
          text = text.replace(new RegExp(`\\b${treaty.article}\\b`, 'g'), `<span class="highlighted-text">${treaty.article}</span>`);
        }
        break;
    }
    
    return text;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateLetter());
      alert('Letter copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const exportToWord = () => {
    const letterContent = generateLetter();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
          pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <pre>${letterContent}</pre>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'withholding-agent-certification.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printLetter = () => {
    const printContent = generateLetter();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Withholding-Agent Certification Letter</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
          pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; }
          @media print { body { margin: 0.5in; } }
        </style>
      </head>
      <body>
        <pre>${printContent}</pre>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="container">
      <div className="form-section">
        <h1>Withholding-Agent Certification Letter Generator</h1>
        
        <div className="help-section">
          <h3>📋 What is this?</h3>
          <p>This generator creates IRS ITIN Exception 1(c) withholding-agent certification letters for foreign LLC members. These letters are required when foreign individuals need an ITIN solely for tax treaty benefits on U.S.-source interest income.</p>
        </div>

        <div className="form-group">
          <label htmlFor="country">
            Country of Owner's Residence *
            <span className="tooltip" title="Select the country where the LLC owner resides. This determines the applicable tax treaty and withholding rate.">ℹ️</span>
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className={errors.country ? 'error' : ''}
          >
            <option value="">Select a country</option>
            <option value="germany">Germany</option>
            <option value="malta">Malta</option>
            <option value="thailand">Thailand</option>
            <option value="cyprus">Cyprus</option>
          </select>
          {errors.country && <span className="error-message">{errors.country}</span>}
          {formData.country && treatyData[formData.country] && (
            <div className="treaty-info">
              <strong>Treaty Information:</strong>
              <p>{treatyData[formData.country].description}</p>
              <a href={treatyData[formData.country].irsLink} target="_blank" rel="noopener noreferrer">
                📄 View IRS Treaty Documents
              </a>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="llcName">
            LLC Name *
            <span className="tooltip" title="Enter the full legal name of the LLC as it appears on IRS documents.">ℹ️</span>
          </label>
          <input
            type="text"
            id="llcName"
            value={formData.llcName}
            onChange={(e) => handleInputChange('llcName', e.target.value)}
            className={errors.llcName ? 'error' : ''}
            placeholder="Enter LLC name (e.g., ABC Investment LLC)"
          />
          {errors.llcName && <span className="error-message">{errors.llcName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="llcStreet">
            LLC Street Address *
            <span className="tooltip" title="Enter the LLC's registered address as filed with the state.">ℹ️</span>
          </label>
          <input
            type="text"
            id="llcStreet"
            value={formData.llcStreet}
            onChange={(e) => handleInputChange('llcStreet', e.target.value)}
            className={errors.llcStreet ? 'error' : ''}
            placeholder="Enter street address (e.g., 123 Main Street)"
          />
          {errors.llcStreet && <span className="error-message">{errors.llcStreet}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="llcCity">
              City *
              <span className="tooltip" title="City where the LLC is registered.">ℹ️</span>
            </label>
            <input
              type="text"
              id="llcCity"
              value={formData.llcCity}
              onChange={(e) => handleInputChange('llcCity', e.target.value)}
              className={errors.llcCity ? 'error' : ''}
              placeholder="City"
            />
            {errors.llcCity && <span className="error-message">{errors.llcCity}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="llcState">
              State *
              <span className="tooltip" title="State where the LLC is registered (e.g., DE, NY, FL).">ℹ️</span>
            </label>
            <input
              type="text"
              id="llcState"
              value={formData.llcState}
              onChange={(e) => handleInputChange('llcState', e.target.value)}
              className={errors.llcState ? 'error' : ''}
              placeholder="State"
            />
            {errors.llcState && <span className="error-message">{errors.llcState}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="llcZip">
              ZIP Code *
              <span className="tooltip" title="ZIP code for the LLC's registered address.">ℹ️</span>
            </label>
            <input
              type="text"
              id="llcZip"
              value={formData.llcZip}
              onChange={(e) => handleInputChange('llcZip', e.target.value)}
              className={errors.llcZip ? 'error' : ''}
              placeholder="ZIP"
            />
            {errors.llcZip && <span className="error-message">{errors.llcZip}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ein">
            EIN (Employer Identification Number) *
            <span className="tooltip" title="The LLC's 9-digit EIN in format XX-XXXXXXX as assigned by the IRS.">ℹ️</span>
          </label>
          <input
            type="text"
            id="ein"
            value={formData.ein}
            onChange={(e) => handleInputChange('ein', e.target.value)}
            className={errors.ein ? 'error' : ''}
            placeholder="XX-XXXXXXX (e.g., 12-3456789)"
            maxLength="10"
          />
          {errors.ein && <span className="error-message">{errors.ein}</span>}
          <div className="field-help">
            <small>Format: Two digits, hyphen, seven digits (e.g., 12-3456789)</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="managingMember">
            Managing Member Name *
            <span className="tooltip" title="Full legal name of the person authorized to sign on behalf of the LLC.">ℹ️</span>
          </label>
          <input
            type="text"
            id="managingMember"
            value={formData.managingMember}
            onChange={(e) => handleInputChange('managingMember', e.target.value)}
            className={errors.managingMember ? 'error' : ''}
            placeholder="Enter managing member name (e.g., John Smith)"
          />
          {errors.managingMember && <span className="error-message">{errors.managingMember}</span>}
          <div className="field-help">
            <small>This person will sign the certification letter under penalties of perjury</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ownerName">
            Foreign Owner Name *
            <span className="tooltip" title="Full legal name of the foreign individual who owns the LLC and needs the ITIN.">ℹ️</span>
          </label>
          <input
            type="text"
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className={errors.ownerName ? 'error' : ''}
            placeholder="Enter foreign owner name (e.g., Maria Schmidt)"
          />
          {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
          <div className="field-help">
            <small>This is the person who needs the ITIN for tax treaty benefits</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">
            Signature Date *
            <span className="tooltip" title="Date when the managing member will sign the certification letter.">ℹ️</span>
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
          <div className="field-help">
            <small>Defaults to today's date</small>
          </div>
        </div>

        <div className="button-group">
          <button onClick={copyToClipboard} className="btn btn-primary">
            📋 Copy to Clipboard
          </button>
          <button onClick={exportToWord} className="btn btn-secondary">
            📄 Export to Word
          </button>
          <button onClick={printLetter} className="btn btn-secondary">
            🖨️ Print Letter
          </button>
        </div>

        <div className="help-section">
          <h3>📖 Instructions</h3>
          <ol>
            <li>Fill out all required fields marked with an asterisk (*)</li>
            <li>Review the live preview to ensure all information is correct</li>
            <li>Use one of the export options to generate your letter</li>
            <li>Submit the letter to the IRS along with Form W-7</li>
          </ol>
          
          <h3>📚 Additional Resources</h3>
          <ul>
            <li><a href="https://www.irs.gov/forms-pubs/about-form-w-7" target="_blank">IRS Form W-7 Instructions</a></li>
            <li><a href="https://www.irs.gov/individuals/international-taxpayers/taxpayer-identification-numbers-tin" target="_blank">ITIN Information</a></li>
            <li><a href="https://www.irs.gov/businesses/international-businesses/united-states-income-tax-treaties-a-to-z" target="_blank">All U.S. Tax Treaties</a></li>
          </ul>
        </div>
      </div>

      <div className="preview-section">
        <h2>Live Preview</h2>
        <div className="preview-content" ref={previewRef}>
          <pre dangerouslySetInnerHTML={{ __html: getHighlightedText() }} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<WithholdingAgentGenerator />, document.getElementById('root'));