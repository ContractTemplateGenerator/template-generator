const { useState, useEffect, useRef } = React;

const translations = {
  en: {
    title: "Withholding Agent Certification Letter Generator",
    whatIsThis: "📋 What is this?",
    whatIsThisDesc: "This generator creates IRS ITIN Exception 1(c) withholding-agent certification letters for foreign LLC members. These letters are required when foreign individuals need an ITIN solely for tax treaty benefits on U.S.-source interest income.",
    countryLabel: "Country of Owner's Residence",
    countryTooltip: "Select the country where the LLC owner resides. This determines the applicable tax treaty and withholding rate.",
    treatyInfo: "Treaty Information:",
    viewTreaty: "📄 View IRS Treaty Documents",
    countryOptions: {
      germany: "Germany",
      malta: "Malta",
      thailand: "Thailand",
      cyprus: "Cyprus"
    },
    llcNameLabel: "LLC Name",
    llcNameTooltip: "Enter the full legal name of the LLC as it appears on IRS documents.",
    llcNamePlaceholder: "Enter LLC name (e.g., ABC Investment LLC)",
    llcStreetLabel: "LLC Street Address",
    llcStreetTooltip: "Enter the LLC's registered address as filed with the state.",
    llcStreetPlaceholder: "Enter street address (e.g., 123 Main Street)",
    cityLabel: "City",
    cityTooltip: "City where the LLC is registered.",
    stateLabel: "State",
    stateTooltip: "State where the LLC is registered (e.g., DE, NY, FL).",
    zipLabel: "ZIP Code",
    zipTooltip: "ZIP code for the LLC's registered address.",
    einLabel: "EIN (Employer Identification Number)",
    einTooltip: "The LLC's 9-digit EIN in format XX-XXXXXXX as assigned by the IRS.",
    einPlaceholder: "XX-XXXXXXX (e.g., 12-3456789)",
    einHelp: "Format: Two digits, hyphen, seven digits (e.g., 12-3456789)",
    managingMemberLabel: "Managing Member Name",
    managingMemberTooltip: "Full legal name of the person authorized to sign on behalf of the LLC.",
    managingMemberPlaceholder: "Enter managing member name (e.g., John Smith)",
    managingMemberHelp: "This person will sign the certification letter under penalties of perjury",
    ownerNameLabel: "Foreign Owner Name",
    ownerNameTooltip: "Full legal name of the foreign individual who owns the LLC and needs the ITIN.",
    ownerNamePlaceholder: "Enter foreign owner name (e.g., Maria Schmidt)",
    ownerNameHelp: "This is the person who needs the ITIN for tax treaty benefits",
    dateLabel: "Signature Date",
    dateTooltip: "Date when the managing member will sign the certification letter.",
    dateHelp: "Defaults to today's date",
    copyBtn: "📋 Copy to Clipboard",
    exportBtn: "📄 Export to Word",
    printBtn: "🖨️ Print Letter",
    emailBtn: "📧 Email Letter",
    instructionsTitle: "📖 Instructions",
    instructionsText: ["Fill out all required fields marked with an asterisk (*)", "Review the live preview to ensure all information is correct", "Use one of the export options to generate your letter", "Submit the letter to the IRS along with Form W-7"],
    resourcesTitle: "📚 Additional Resources",
    livePreview: "Live Preview",
    selectCountry: "Select a country",
    required: "*",
    copiedAlert: "Letter copied to clipboard!",
    emailSuccess: "Email sent successfully!",
    emailError: "Failed to send email. Please try again."
  },
  de: {
    title: "Withholding Agent Bestätigungsschreiben Generator",
    whatIsThis: "📋 Was ist das?",
    whatIsThisDesc: "Dieser Generator erstellt IRS ITIN Exception 1(c) Withholding-Agent-Bestätigungsschreiben für ausländische LLC-Mitglieder. Diese Schreiben sind erforderlich, wenn ausländische Personen eine ITIN ausschließlich für Steuerabkommensvorteile auf US-amerikanische Zinserträge benötigen.",
    countryLabel: "Wohnsitzland des Eigentümers",
    countryTooltip: "Wählen Sie das Land, in dem der LLC-Eigentümer ansässig ist. Dies bestimmt das anwendbare Steuerabkommen und den Quellensteuerabzug.",
    treatyInfo: "Abkommensinformationen:",
    viewTreaty: "📄 IRS-Abkommensdokumente anzeigen",
    countryOptions: {
      germany: "Deutschland",
      malta: "Malta",
      thailand: "Thailand",
      cyprus: "Zypern"
    },
    llcNameLabel: "LLC-Name",
    llcNameTooltip: "Geben Sie den vollständigen rechtlichen Namen der LLC ein, wie er in den IRS-Dokumenten erscheint.",
    llcNamePlaceholder: "LLC-Name eingeben (z.B. ABC Investment LLC)",
    llcStreetLabel: "LLC-Straßenadresse",
    llcStreetTooltip: "Geben Sie die bei der Behörde eingetragene Adresse der LLC ein.",
    llcStreetPlaceholder: "Straßenadresse eingeben (z.B. 123 Main Street)",
    cityLabel: "Stadt",
    cityTooltip: "Stadt, in der die LLC registriert ist.",
    stateLabel: "Staat",
    stateTooltip: "Staat, in dem die LLC registriert ist (z.B. DE, NY, FL).",
    zipLabel: "Postleitzahl",
    zipTooltip: "Postleitzahl für die eingetragene Adresse der LLC.",
    einLabel: "EIN (Employer Identification Number)",
    einTooltip: "Die 9-stellige EIN der LLC im Format XX-XXXXXXX, wie von der IRS zugewiesen.",
    einPlaceholder: "XX-XXXXXXX (z.B. 12-3456789)",
    einHelp: "Format: Zwei Ziffern, Bindestrich, sieben Ziffern (z.B. 12-3456789)",
    managingMemberLabel: "Name des geschäftsführenden Gesellschafters",
    managingMemberTooltip: "Vollständiger rechtlicher Name der Person, die berechtigt ist, im Namen der LLC zu unterschreiben.",
    managingMemberPlaceholder: "Name des geschäftsführenden Gesellschafters eingeben (z.B. John Smith)",
    managingMemberHelp: "Diese Person wird das Bestätigungsschreiben unter Strafandrohung unterschreiben",
    ownerNameLabel: "Name des ausländischen Eigentümers",
    ownerNameTooltip: "Vollständiger rechtlicher Name der ausländischen Person, die die LLC besitzt und die ITIN benötigt.",
    ownerNamePlaceholder: "Name des ausländischen Eigentümers eingeben (z.B. Maria Schmidt)",
    ownerNameHelp: "Dies ist die Person, die die ITIN für Steuerabkommensvorteile benötigt",
    dateLabel: "Unterschriftsdatum",
    dateTooltip: "Datum, an dem der geschäftsführende Gesellschafter das Bestätigungsschreiben unterschreibt.",
    dateHelp: "Standardmäßig auf das heutige Datum eingestellt",
    copyBtn: "📋 In Zwischenablage kopieren",
    exportBtn: "📄 Als Word exportieren",
    printBtn: "🖨️ Brief drucken",
    emailBtn: "📧 Brief per E-Mail senden",
    instructionsTitle: "📖 Anweisungen",
    instructionsText: ["Füllen Sie alle erforderlichen Felder aus, die mit einem Sternchen (*) markiert sind", "Überprüfen Sie die Live-Vorschau, um sicherzustellen, dass alle Informationen korrekt sind", "Verwenden Sie eine der Exportoptionen, um Ihr Schreiben zu generieren", "Reichen Sie das Schreiben zusammen mit dem Formular W-7 bei der IRS ein"],
    resourcesTitle: "📚 Zusätzliche Ressourcen",
    livePreview: "Live-Vorschau",
    selectCountry: "Land auswählen",
    required: "*",
    copiedAlert: "Brief in die Zwischenablage kopiert!",
    emailSuccess: "E-Mail erfolgreich gesendet!",
    emailError: "E-Mail-Versand fehlgeschlagen. Bitte versuchen Sie es erneut."
  }
};

const treatyData = {
  germany: {
    article: 'Article 11',
    rate: '0%',
    treatyName: 'U.S.–Germany tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/germany-tax-treaty-documents',
    description: {
      en: 'Germany has a 0% withholding rate on interest under Article 11 of the U.S.-Germany tax treaty. This provides for exclusive residence-based taxation of interest income.',
      de: 'Deutschland hat einen 0% Quellensteuerabzug auf Zinsen unter Artikel 11 des US-Deutschland-Steuerabkommens. Dies ermöglicht eine ausschließliche Besteuerung am Wohnsitz für Zinserträge.'
    }
  },
  malta: {
    article: 'Article 11',
    rate: '10%',
    treatyName: 'U.S.–Malta tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/malta-tax-treaty-documents',
    description: {
      en: 'Malta has a 10% maximum withholding rate on interest under Article 11 of the U.S.-Malta tax treaty, reducing the standard 30% U.S. withholding tax.',
      de: 'Malta hat einen maximalen Quellensteuerabzug von 10% auf Zinsen unter Artikel 11 des US-Malta-Steuerabkommens, was die standardmäßige 30% US-Quellensteuer reduziert.'
    }
  },
  thailand: {
    article: 'Article 11',
    rate: '10%',
    treatyName: 'U.S.–Thailand tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/thailand-tax-treaty-documents',
    description: {
      en: 'Thailand has a 10% maximum withholding rate on interest under Article 11 of the U.S.-Thailand tax treaty.',
      de: 'Thailand hat einen maximalen Quellensteuerabzug von 10% auf Zinsen unter Artikel 11 des US-Thailand-Steuerabkommens.'
    }
  },
  cyprus: {
    article: 'Article 11(2)',
    rate: '10%',
    treatyName: 'U.S.–Cyprus tax treaty (TIAS 11-167)',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/cyprus-tax-treaty-documents',
    description: {
      en: 'Cyprus has a 10% maximum withholding rate on interest under Article 11(2) of the U.S.-Cyprus tax treaty.',
      de: 'Zypern hat einen maximalen Quellensteuerabzug von 10% auf Zinsen unter Artikel 11(2) des US-Zypern-Steuerabkommens.'
    }
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
  const [language, setLanguage] = useState('en');
  const previewRef = useRef(null);
  
  const t = translations[language];

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
    const treaty = treatyData[formData.country];
    const countryName = formData.country ? formData.country.charAt(0).toUpperCase() + formData.country.slice(1) : '[Country]';
    
    return `${formData.llcName || '[LLC Name]'}
${formData.llcStreet || '[Street Address]'}
${formData.llcCity || '[City]'}, ${formData.llcState || '[State]'} ${formData.llcZip || '[ZIP]'}

To: Internal Revenue Service, ITIN Operations
Re: Certification of anticipated U.S.-source income – W-7 Exception 1(c)

I, ${formData.managingMember || '[Managing Member Name]'}, Managing Member of ${formData.llcName || '[LLC Name]'} (EIN ${formData.ein || '[EIN]'}), certify under penalties of perjury that:

1. ${formData.ownerName || '[Owner Name]'}, a resident of ${countryName} and sole member of ${formData.llcName || '[LLC Name]'}, will receive periodic capital-account distributions that constitute U.S.-source interest income within the meaning of IRC § 861(a)(1).

2. The distributions are subject to withholding under IRC § 1441 unless the owner provides a valid Form W-8BEN with a U.S. ITIN to claim benefits of ${treaty ? treaty.article : '[Treaty Article]'} of the ${treaty ? treaty.treatyName : '[Treaty Name]'}, which limits withholding on interest to ${treaty ? treaty.rate : '[Rate]'}.

3. ${formData.llcName || '[LLC Name]'} will act as withholding agent and will file Form 1042-S reporting those amounts.

Accordingly, an ITIN is required solely to furnish on Form W-8BEN and Form 1042-S; the owner is not otherwise required to file a U.S. income-tax return.

________________________ Date: ${formData.date || '[Date]'}
${formData.managingMember || '[Managing Member Name]'}
Managing Member, ${formData.llcName || '[LLC Name]'}`;
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
      alert(t.copiedAlert);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const emailLetter = () => {
    const letterContent = generateLetter();
    const subject = `Withholding Agent Certification Letter - ${formData.ownerName || 'Draft'}`;
    const body = encodeURIComponent(`Please find the Withholding Agent Certification Letter below:\n\n${letterContent}`);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    try {
      window.open(mailtoLink, '_blank');
      alert(t.emailSuccess);
    } catch (err) {
      console.error('Failed to open email client: ', err);
      alert(t.emailError);
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
        <div className="header-section">
          <h1>{t.title}</h1>
          <div className="language-toggle">
            <button 
              onClick={() => setLanguage('en')} 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            >
              🇺🇸 EN
            </button>
            <button 
              onClick={() => setLanguage('de')} 
              className={`lang-btn ${language === 'de' ? 'active' : ''}`}
            >
              🇩🇪 DE
            </button>
          </div>
        </div>
        
        <div className="help-section">
          <h3>{t.whatIsThis}</h3>
          <p>{t.whatIsThisDesc}</p>
        </div>

        <div className="form-group">
          <label htmlFor="country">
            {t.countryLabel} {t.required}
            <span className="tooltip" title={t.countryTooltip}>ℹ️</span>
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className={errors.country ? 'error' : ''}
          >
            <option value="">{t.selectCountry}</option>
            <option value="germany">{t.countryOptions.germany}</option>
            <option value="malta">{t.countryOptions.malta}</option>
            <option value="thailand">{t.countryOptions.thailand}</option>
            <option value="cyprus">{t.countryOptions.cyprus}</option>
          </select>
          {errors.country && <span className="error-message">{errors.country}</span>}
          {formData.country && treatyData[formData.country] && (
            <div className="treaty-info">
              <strong>{t.treatyInfo}</strong>
              <p>{treatyData[formData.country].description[language]}</p>
              <a href={treatyData[formData.country].irsLink} target="_blank" rel="noopener noreferrer">
                {t.viewTreaty}
              </a>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="llcName">
            {t.llcNameLabel} {t.required}
            <span className="tooltip" title={t.llcNameTooltip}>ℹ️</span>
          </label>
          <input
            type="text"
            id="llcName"
            value={formData.llcName}
            onChange={(e) => handleInputChange('llcName', e.target.value)}
            className={errors.llcName ? 'error' : ''}
            placeholder={t.llcNamePlaceholder}
          />
          {errors.llcName && <span className="error-message">{errors.llcName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="llcStreet">
            {t.llcStreetLabel} {t.required}
            <span className="tooltip" title={t.llcStreetTooltip}>ℹ️</span>
          </label>
          <input
            type="text"
            id="llcStreet"
            value={formData.llcStreet}
            onChange={(e) => handleInputChange('llcStreet', e.target.value)}
            className={errors.llcStreet ? 'error' : ''}
            placeholder={t.llcStreetPlaceholder}
          />
          {errors.llcStreet && <span className="error-message">{errors.llcStreet}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="llcCity">
              {t.cityLabel} {t.required}
              <span className="tooltip" title={t.cityTooltip}>ℹ️</span>
            </label>
            <input
              type="text"
              id="llcCity"
              value={formData.llcCity}
              onChange={(e) => handleInputChange('llcCity', e.target.value)}
              className={errors.llcCity ? 'error' : ''}
              placeholder={t.cityLabel}
            />
            {errors.llcCity && <span className="error-message">{errors.llcCity}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="llcState">
              {t.stateLabel} {t.required}
              <span className="tooltip" title={t.stateTooltip}>ℹ️</span>
            </label>
            <input
              type="text"
              id="llcState"
              value={formData.llcState}
              onChange={(e) => handleInputChange('llcState', e.target.value)}
              className={errors.llcState ? 'error' : ''}
              placeholder={t.stateLabel}
            />
            {errors.llcState && <span className="error-message">{errors.llcState}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="llcZip">
              {t.zipLabel} {t.required}
              <span className="tooltip" title={t.zipTooltip}>ℹ️</span>
            </label>
            <input
              type="text"
              id="llcZip"
              value={formData.llcZip}
              onChange={(e) => handleInputChange('llcZip', e.target.value)}
              className={errors.llcZip ? 'error' : ''}
              placeholder={t.zipLabel}
            />
            {errors.llcZip && <span className="error-message">{errors.llcZip}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ein">
            {t.einLabel} {t.required}
            <span className="tooltip" title={t.einTooltip}>ℹ️</span>
          </label>
          <input
            type="text"
            id="ein"
            value={formData.ein}
            onChange={(e) => handleInputChange('ein', e.target.value)}
            className={errors.ein ? 'error' : ''}
            placeholder={t.einPlaceholder}
            maxLength="10"
          />
          {errors.ein && <span className="error-message">{errors.ein}</span>}
          <div className="field-help">
            <small>{t.einHelp}</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="managingMember">
            {t.managingMemberLabel} {t.required}
            <span className="tooltip" title={t.managingMemberTooltip}>ℹ️</span>
          </label>
          <input
            type="text"
            id="managingMember"
            value={formData.managingMember}
            onChange={(e) => handleInputChange('managingMember', e.target.value)}
            className={errors.managingMember ? 'error' : ''}
            placeholder={t.managingMemberPlaceholder}
          />
          {errors.managingMember && <span className="error-message">{errors.managingMember}</span>}
          <div className="field-help">
            <small>{t.managingMemberHelp}</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ownerName">
            {t.ownerNameLabel} {t.required}
            <span className="tooltip" title={t.ownerNameTooltip}>ℹ️</span>
          </label>
          <input
            type="text"
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className={errors.ownerName ? 'error' : ''}
            placeholder={t.ownerNamePlaceholder}
          />
          {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
          <div className="field-help">
            <small>{t.ownerNameHelp}</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">
            {t.dateLabel} {t.required}
            <span className="tooltip" title={t.dateTooltip}>ℹ️</span>
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
            <small>{t.dateHelp}</small>
          </div>
        </div>

        <div className="button-group">
          <button onClick={copyToClipboard} className="btn btn-primary">
            {t.copyBtn}
          </button>
          <button onClick={exportToWord} className="btn btn-secondary">
            {t.exportBtn}
          </button>
          <button onClick={printLetter} className="btn btn-secondary">
            {t.printBtn}
          </button>
          <button onClick={emailLetter} className="btn btn-secondary">
            {t.emailBtn}
          </button>
        </div>

        <div className="help-section">
          <h3>{t.instructionsTitle}</h3>
          <ol>
            {t.instructionsText.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
          
          <h3>{t.resourcesTitle}</h3>
          <ul>
            <li><a href="https://www.irs.gov/forms-pubs/about-form-w-7" target="_blank">IRS Form W-7 Instructions</a></li>
            <li><a href="https://www.irs.gov/individuals/international-taxpayers/taxpayer-identification-numbers-tin" target="_blank">ITIN Information</a></li>
            <li><a href="https://www.irs.gov/businesses/international-businesses/united-states-income-tax-treaties-a-to-z" target="_blank">All U.S. Tax Treaties</a></li>
          </ul>
        </div>
      </div>

      <div className="preview-section">
        <h2>{t.livePreview}</h2>
        <div className="preview-content" ref={previewRef}>
          <pre dangerouslySetInnerHTML={{ __html: getHighlightedText() }} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<WithholdingAgentGenerator />, document.getElementById('root'));