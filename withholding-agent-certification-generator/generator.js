const { useState, useEffect, useRef } = React;

const treatyData = {
  germany: {
    article: 'Article 11',
    rate: '0%',
    treatyName: 'U.S.–Germany tax treaty'
  },
  malta: {
    article: 'Article 11',
    rate: '10%',
    treatyName: 'U.S.–Malta tax treaty'
  },
  thailand: {
    article: 'Article 11',
    rate: '10%',
    treatyName: 'U.S.–Thailand tax treaty'
  },
  cyprus: {
    article: 'Article 11(2)',
    rate: '10%',
    treatyName: 'U.S.–Cyprus tax treaty (TIAS 11-167)'
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
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
          .letterhead { margin-bottom: 2em; }
          .signature-line { margin-top: 2em; }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <pre style="font-family: 'Times New Roman', serif; white-space: pre-wrap;">${letterContent}</pre>
        </div>
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
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
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
        
        <div className="form-group">
          <label htmlFor="country">Country *</label>
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
        </div>

        <div className="form-group">
          <label htmlFor="llcName">LLC Name *</label>
          <input
            type="text"
            id="llcName"
            value={formData.llcName}
            onChange={(e) => handleInputChange('llcName', e.target.value)}
            className={errors.llcName ? 'error' : ''}
            placeholder="Enter LLC name"
          />
          {errors.llcName && <span className="error-message">{errors.llcName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="llcStreet">LLC Street Address *</label>
          <input
            type="text"
            id="llcStreet"
            value={formData.llcStreet}
            onChange={(e) => handleInputChange('llcStreet', e.target.value)}
            className={errors.llcStreet ? 'error' : ''}
            placeholder="Enter street address"
          />
          {errors.llcStreet && <span className="error-message">{errors.llcStreet}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="llcCity">City *</label>
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
            <label htmlFor="llcState">State *</label>
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
            <label htmlFor="llcZip">ZIP Code *</label>
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
          <label htmlFor="ein">EIN *</label>
          <input
            type="text"
            id="ein"
            value={formData.ein}
            onChange={(e) => handleInputChange('ein', e.target.value)}
            className={errors.ein ? 'error' : ''}
            placeholder="XX-XXXXXXX"
            maxLength="10"
          />
          {errors.ein && <span className="error-message">{errors.ein}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="managingMember">Managing Member Name *</label>
          <input
            type="text"
            id="managingMember"
            value={formData.managingMember}
            onChange={(e) => handleInputChange('managingMember', e.target.value)}
            className={errors.managingMember ? 'error' : ''}
            placeholder="Enter managing member name"
          />
          {errors.managingMember && <span className="error-message">{errors.managingMember}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="ownerName">Owner Name *</label>
          <input
            type="text"
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className={errors.ownerName ? 'error' : ''}
            placeholder="Enter owner name"
          />
          {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="button-group">
          <button onClick={copyToClipboard} className="btn btn-primary">
            Copy to Clipboard
          </button>
          <button onClick={exportToWord} className="btn btn-secondary">
            Export to Word
          </button>
          <button onClick={printLetter} className="btn btn-secondary">
            Print Letter
          </button>
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