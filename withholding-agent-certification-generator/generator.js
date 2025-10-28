const { useState, useRef } = React;

const translations = {
  en: {
    title: "Withholding Agent Certification Letter Generator",
    whatIsThis: "📋 What is this?",
    whatIsThisDesc: "This generator creates IRS ITIN Exception 1(c) withholding-agent certification letters for foreign LLC members. These letters are required when foreign individuals need an ITIN solely for tax treaty benefits on U.S.-source interest income.",
    countryLabel: "Country of Owner's Residence",
    countryTooltip: "Select the country where the LLC owner resides. This determines the applicable tax treaty and withholding rate.",
    treatyInfo: "Treaty Information:",
    viewTreaty: "📄 View US-{country} IRS Treaty Documents",
    countryOptions: {
      germany: "Germany",
      austria: "Austria",
      malta: "Malta",
      thailand: "Thailand",
      cyprus: "Cyprus",
      switzerland: "Switzerland",
      bulgaria: "Bulgaria"
    },
    austriaTriangularNote: "Article 11(4) removes the 0% benefit if the interest is attributable to a low-tax third-country PE (unless the treaty carve-outs apply).",
    austriaTriangularTooltip: "Applies when the Austrian beneficial owner earns the interest through a permanent establishment in another country with a preferential regime.",
    incomeTypeLabel: "Income Type",
    incomeTypeHelp: "Show Article 10 and 12 treaty rates for Austria when income differs from pure interest.",
    incomeTypeOptions: {
      interest: "Interest",
      dividends: "Dividends",
      royalties: "Royalties"
    },
    ownerTypeLabel: "Beneficial Owner Type",
    ownerTypeHelp: "Pick the treaty claimant's classification so the letter references the right Form W-8 and documentation.",
    ownerTypeOptions: {
      individual: "Individual (Form W-7 + Form W-8BEN)",
      entity: "Entity (Form W-8BEN-E)"
    },
    individualNote: "Individuals must supply an ITIN on Form W-8BEN for the treaty claim.",
    entityNote: "Entities do not require an ITIN but should document FATCA status and GIIN on Form W-8BEN-E.",
    fatcaStatusLabel: "FATCA Status",
    fatcaStatusPlaceholder: "e.g., Reporting Model 1 FFI",
    giinLabel: "GIIN",
    giinPlaceholder: "Enter GIIN or N/A if not assigned",
    giinHelp: "Typical GIIN format is 123456.12345.12.123; enter 'N/A' if the entity is exempt without a GIIN.",
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
    viewTreaty: "📄 US-{country} IRS-Abkommensdokumente anzeigen",
    countryOptions: {
      germany: "Deutschland",
      austria: "Österreich",
      malta: "Malta",
      thailand: "Thailand",
      cyprus: "Zypern",
      switzerland: "Schweiz",
      bulgaria: "Bulgarien"
    },
    austriaTriangularNote: "Artikel 11(4) streicht den 0%-Satz, wenn die Zinsen einer Betriebsstätte in einem Niedrigsteuer-Drittland zuzurechnen sind (sofern keine Ausnahmen greifen).",
    austriaTriangularTooltip: "Gilt, wenn der österreichische Nutzungsberechtigte die Zinsen über eine Betriebsstätte in einem anderen Staat mit Präferenzregime erzielt.",
    incomeTypeLabel: "Einkommensart",
    incomeTypeHelp: "Zeigt für Österreich die Artikel-10- und Artikel-12-Sätze an, wenn keine reinen Zinsen vorliegen.",
    incomeTypeOptions: {
      interest: "Zinsen",
      dividends: "Dividenden",
      royalties: "Lizenzgebühren"
    },
    ownerTypeLabel: "Art des Nutzungsberechtigten",
    ownerTypeHelp: "Wählen Sie die Einstufung des Abkommensberechtigten, damit im Schreiben das richtige W-8-Formular genannt wird.",
    ownerTypeOptions: {
      individual: "Natürliche Person (Formular W-7 + Formular W-8BEN)",
      entity: "Juristische Person (Formular W-8BEN-E)"
    },
    individualNote: "Natürliche Personen müssen für den Abkommensanspruch eine ITIN auf Formular W-8BEN angeben.",
    entityNote: "Juristische Personen benötigen keine ITIN, sollten aber FATCA-Status und GIIN auf Formular W-8BEN-E dokumentieren.",
    fatcaStatusLabel: "FATCA-Status",
    fatcaStatusPlaceholder: "z. B. Reporting Model 1 FFI",
    giinLabel: "GIIN",
    giinPlaceholder: "GIIN eingeben oder N/A, falls nicht vergeben",
    giinHelp: "Das GIIN folgt üblicherweise dem Format 123456.12345.12.123; geben Sie 'N/A' an, falls nicht erforderlich.",
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
    article: 'Article 11(1)',
    rate: '0%',
    treatyName: 'U.S.–Germany tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/germany-tax-treaty-documents',
    description: {
      en: 'Germany has a 0% withholding rate on interest under Article 11 of the U.S.-Germany tax treaty. This provides for exclusive residence-based taxation of interest income.',
      de: 'Deutschland hat einen 0% Quellensteuerabzug auf Zinsen unter Artikel 11 des US-Deutschland-Steuerabkommens. Dies ermöglicht eine ausschließliche Besteuerung am Wohnsitz für Zinserträge.'
    }
  },
  austria: {
    article: 'Article 11(1)',
    rate: '0%',
    treatyName: 'U.S.–Austria tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/austria-tax-treaty-documents',
    description: {
      en: 'Austria exempts interest from U.S. withholding under Article 11 when the Austrian resident is the beneficial owner. Dividends are 5% with ≥10% voting control or 15% otherwise, and royalties are generally taxable only in the residence state (films/TV up to 10%). Article 11(4) contains a triangular permanent establishment limitation.',
      de: 'Österreich befreit Zinsen gemäß Artikel 11 des US-Österreich-Steuerabkommens von der US-Quellensteuer, sofern der österreichische Nutzungsberechtigte Eigentümer der Einkünfte ist. Dividenden unterliegen 5% bei ≥10% Stimmrechtsbeteiligung oder 15% sonst, und Lizenzgebühren sind grundsätzlich nur im Wohnsitzstaat steuerpflichtig (Film/Fernsehen bis zu 10%). Artikel 11(4) enthält eine Dreiecksbetriebsstätten-Beschränkung.'
    },
    incomeTypes: {
      interest: {
        article: 'Article 11(1)',
        rate: '0%',
        description: {
          en: 'Interest paid to Austrian residents is taxable only in Austria under Article 11(1), so U.S. withholding drops to 0% when the beneficial owner qualifies. Article 11(4) can deny the exemption if the income is allocable to a low-taxed third-country permanent establishment.',
          de: 'Zinsen an in Österreich ansässige Personen sind nach Artikel 11(1) nur in Österreich steuerpflichtig, sodass die US-Quellensteuer bei erfüllten Voraussetzungen auf 0% sinkt. Artikel 11(4) kann die Befreiung versagen, wenn die Einkünfte einer niedrig besteuerten Drittlands-Betriebsstätte zuzurechnen sind.'
        }
      },
      dividends: {
        article: 'Article 10',
        rate: '5% (direct ≥10% vote) / 15% otherwise',
        description: {
          en: 'Article 10 limits dividend withholding to 5% when the Austrian parent owns at least 10% of the U.S. subsidiary’s voting stock; the standard ceiling is 15% for other shareholders.',
          de: 'Artikel 10 begrenzt die Quellensteuer auf Dividenden auf 5%, wenn die österreichische Mutter mindestens 10% der Stimmrechte der US-Tochter hält; ansonsten gilt der Standardsatz von 15%.'
        }
      },
      royalties: {
        article: 'Article 12',
        rate: '0% (films/TV up to 10%)',
        description: {
          en: 'Article 12 generally grants exclusive residence-state taxation for royalties, producing a 0% U.S. withholding rate. Film and TV payments may be taxed at source up to 10%.',
          de: 'Artikel 12 sieht grundsätzlich eine ausschließliche Besteuerung im Wohnsitzstaat für Lizenzgebühren vor, wodurch der US-Quellensteuersatz 0% beträgt. Film- und Fernsehvergütungen können allerdings mit bis zu 10% an der Quelle besteuert werden.'
        }
      }
    }
  },
  malta: {
    article: 'Article 11(2)',
    rate: '10%',
    treatyName: 'U.S.–Malta tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/malta-tax-treaty-documents',
    description: {
      en: 'Malta has a 10% maximum withholding rate on interest under Article 11 of the U.S.-Malta tax treaty, with 0% exemptions for government entities, banks/financial institutions, and installment sales of goods/services.',
      de: 'Malta hat einen maximalen Quellensteuerabzug von 10% auf Zinsen unter Artikel 11 des US-Malta-Steuerabkommens, mit 0% Befreiungen für Regierungsstellen, Banken/Finanzinstitute und Ratenkäufe von Waren/Dienstleistungen.'
    }
  },
  thailand: {
    article: 'Article 11(2)',
    rate: '15%',
    treatyName: 'U.S.–Thailand tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/thailand-tax-treaty-documents',
    description: {
      en: 'Thailand has a general 15% maximum withholding rate on interest under Article 11(2)(c) of the U.S.-Thailand tax treaty. A reduced 10% rate applies only to interest paid to banks/financial institutions (Art. 11(2)(a)) or on arm\'s-length credit sales (Art. 11(2)(b)).',
      de: 'Thailand hat einen allgemeinen maximalen Quellensteuerabzug von 15% auf Zinsen unter Artikel 11(2)(c) des US-Thailand-Steuerabkommens. Ein reduzierter Satz von 10% gilt nur für Zinsen an Banken/Finanzinstitute (Art. 11(2)(a)) oder bei Kreditverkäufen unter marktüblichen Bedingungen (Art. 11(2)(b)).'
    }
  },
  cyprus: {
    article: 'Article 13(2)',
    rate: '10%',
    treatyName: 'U.S.–Cyprus tax treaty (TIAS 11-167)',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/cyprus-tax-treaty-documents',
    description: {
      en: 'Cyprus has a 10% maximum withholding rate on interest under Article 13 of the U.S.-Cyprus tax treaty, with 0% exemptions for government entities, banks, and commercial credit transactions.',
      de: 'Zypern hat einen maximalen Quellensteuerabzug von 10% auf Zinsen unter Artikel 13 des US-Zypern-Steuerabkommens, mit 0% Befreiungen für Regierungsstellen, Banken und gewerbliche Kredittransaktionen.'
    }
  },
  switzerland: {
    article: 'Article 11(1)',
    rate: '0%',
    treatyName: 'U.S.–Switzerland tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/switzerland-tax-treaty-documents',
    description: {
      en: 'Switzerland has a 0% withholding rate on interest under Article 11 of the U.S.-Switzerland tax treaty. Interest is taxable only in the residence state (Switzerland), providing complete exemption from U.S. withholding tax.',
      de: 'Die Schweiz hat einen 0% Quellensteuerabzug auf Zinsen unter Artikel 11 des US-Schweiz-Steuerabkommens. Zinsen sind nur im Wohnsitzstaat (Schweiz) steuerpflichtig und vollständig von der US-Quellensteuer befreit.'
    }
  },
  bulgaria: {
    article: 'Article 11(2)',
    rate: '5%',
    treatyName: 'U.S.–Bulgaria tax treaty',
    irsLink: 'https://www.irs.gov/businesses/international-businesses/bulgaria-tax-treaty-documents',
    description: {
      en: 'Bulgaria has a 5% maximum withholding rate on interest under Article 11(2) of the U.S.-Bulgaria tax treaty, with certain contingent interest potentially taxed up to 10% under Article 11(8).',
      de: 'Bulgarien hat einen maximalen Quellensteuerabzug von 5% auf Zinsen unter Artikel 11(2) des US-Bulgarien-Steuerabkommens, mit bestimmten bedingten Zinsen, die unter Artikel 11(8) möglicherweise bis zu 10% besteuert werden.'
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
    date: new Date().toISOString().split('T')[0],
    ownerType: 'individual',
    incomeType: 'interest',
    fatcaStatus: '',
    giin: ''
  });

  const [lastChanged, setLastChanged] = useState(null);
  const [errors, setErrors] = useState({});
  const [language, setLanguage] = useState('en');
  const [showContingentDetails, setShowContingentDetails] = useState(false);
  const previewRef = useRef(null);
  
  const t = translations[language];

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => {
      const updated = { ...prev, [fieldName]: value };

      if (fieldName === 'country' && value !== 'austria') {
        updated.incomeType = 'interest';
      }

      if (fieldName === 'ownerType' && value === 'individual') {
        updated.fatcaStatus = '';
        updated.giin = '';
      }

      return updated;
    });

    setLastChanged(fieldName);
    
    // Clear highlighting after 2 seconds
    setTimeout(() => setLastChanged(null), 2000);
    
    // Clear errors for this field
    setErrors(prev => {
      const updatedErrors = { ...prev };
      if (updatedErrors[fieldName]) {
        updatedErrors[fieldName] = '';
      }

      if (fieldName === 'ownerType' && value === 'individual') {
        updatedErrors.fatcaStatus = '';
        updatedErrors.giin = '';
      }

      if (fieldName === 'country' && value !== 'austria') {
        updatedErrors.incomeType = '';
      }

      return updatedErrors;
    });
  };

  const validateEIN = (ein) => {
    const einRegex = /^\d{2}-\d{7}$/;
    return einRegex.test(ein);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.country) newErrors.country = 'Please select a country';
    if (!formData.ownerType) newErrors.ownerType = 'Please select the beneficial owner type';
    if (formData.country === 'austria' && !formData.incomeType) newErrors.incomeType = 'Please choose an income type';
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
    if (formData.ownerType === 'entity') {
      if (!formData.fatcaStatus) newErrors.fatcaStatus = 'FATCA status is required for entities';
      if (!formData.giin) newErrors.giin = 'GIIN (or N/A) is required for entities';
    }
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getActiveTreatyDetails = () => {
    const treaty = treatyData[formData.country];
    if (!treaty) return null;

    if (treaty.incomeTypes) {
      const activeType = formData.incomeType || 'interest';
      const fallbackType = treaty.incomeTypes.interest ? 'interest' : Object.keys(treaty.incomeTypes)[0];
      const selectedType = treaty.incomeTypes[activeType] ? activeType : fallbackType;
      const incomeDetails = treaty.incomeTypes[selectedType];

      return {
        ...treaty,
        article: incomeDetails.article,
        rate: incomeDetails.rate,
        description: incomeDetails.description,
        activeIncomeType: selectedType
      };
    }

    return {
      ...treaty,
      activeIncomeType: 'interest'
    };
  };

  const generateLetter = () => {
    const treatyDetails = getActiveTreatyDetails();
    const countryName = formData.country ? formData.country.charAt(0).toUpperCase() + formData.country.slice(1) : '[Country]';
    const incomeMetaMap = {
      interest: { nounPhrase: 'interest income', withholdingLabel: 'interest', codeRef: 'IRC § 861(a)(1)' },
      dividends: { nounPhrase: 'dividend income', withholdingLabel: 'dividends', codeRef: 'IRC § 861(a)(2)' },
      royalties: { nounPhrase: 'royalty income', withholdingLabel: 'royalties', codeRef: 'IRC § 861(a)(4)' }
    };
    const activeIncomeType = treatyDetails ? treatyDetails.activeIncomeType : (formData.incomeType || 'interest');
    const incomeMeta = incomeMetaMap[activeIncomeType] || incomeMetaMap.interest;
    const ownerIsIndividual = formData.ownerType !== 'entity';
    const llcName = formData.llcName || '[LLC Name]';
    const fatcaStatusText = formData.fatcaStatus || '[FATCA Status]';
    const giinText = formData.giin || 'N/A';
    const treatyArticle = treatyDetails ? treatyDetails.article : '[Treaty Article]';
    const treatyName = treatyDetails ? treatyDetails.treatyName : '[Treaty Name]';
    const treatyRate = treatyDetails ? treatyDetails.rate : '[Rate]';
    const formReference = ownerIsIndividual ? 'Form W-8BEN' : 'Form W-8BEN-E';
    const subjectLine = ownerIsIndividual && activeIncomeType === 'interest'
      ? 'Re: Certification of anticipated U.S.-source income – W-7 Exception 1(c)'
      : 'Re: Certification of anticipated U.S.-source income – Treaty documentation';

    const points = [];
    points.push(`1. ${formData.ownerName || '[Owner Name]'}, a resident of ${countryName} and sole member of ${llcName}, will receive payments that constitute U.S.-source ${incomeMeta.nounPhrase} within the meaning of ${incomeMeta.codeRef}.`);

    if (ownerIsIndividual) {
      points.push(`2. The payments are subject to withholding under IRC § 1441 unless the owner provides a valid ${formReference} with a U.S. ITIN to claim benefits of ${treatyArticle} of the ${treatyName}, which limits withholding on ${incomeMeta.withholdingLabel} to ${treatyRate}.`);
    } else {
      points.push(`2. The payments are subject to withholding under IRC § 1441 unless the owner provides a valid ${formReference} to claim benefits of ${treatyArticle} of the ${treatyName}, which limits withholding on ${incomeMeta.withholdingLabel} to ${treatyRate}.`);
    }

    points.push(`3. ${llcName} will act as withholding agent and will file Form 1042-S reporting those amounts.`);

    if (!ownerIsIndividual) {
      points.push(`4. For FATCA purposes, the owner certifies a status of ${fatcaStatusText} and will provide GIIN ${giinText} (or other documentation where a GIIN is not required).`);
    }

    const conclusion = ownerIsIndividual
      ? 'Accordingly, an ITIN is required solely to furnish on Form W-8BEN and Form 1042-S; the owner is not otherwise required to file a U.S. income-tax return.'
      : `${llcName} will maintain the owner’s Form W-8BEN-E and FATCA documentation noted above in support of the treaty claim; an ITIN is not required for entity beneficial owners.`;

    return `${llcName}
${formData.llcStreet || '[Street Address]'}
${formData.llcCity || '[City]'}, ${formData.llcState || '[State]'} ${formData.llcZip || '[ZIP]'}

To: Internal Revenue Service, ITIN Operations
${subjectLine}

I, ${formData.managingMember || '[Managing Member Name]'}, Managing Member of ${llcName} (EIN ${formData.ein || '[EIN]'}), certify under penalties of perjury that:

${points.join('\n\n')}

${conclusion}

________________________ Date: ${formData.date || '[Date]'}
${formData.managingMember || '[Managing Member Name]'}
Managing Member, ${llcName}`;
  };

  const getHighlightedText = () => {
    let text = generateLetter();
    
    if (!lastChanged || !text) return text;
    
    const highlightValue = (value) => {
      if (!value) return text;
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
        if (formData.country) {
          const countryName = formData.country.charAt(0).toUpperCase() + formData.country.slice(1);
          text = text.replace(new RegExp(`\\b${countryName}\\b`, 'g'), `<span class="highlighted-text">${countryName}</span>`);
        }

        const countryDetails = getActiveTreatyDetails();
        if (countryDetails) {
          text = text.replace(new RegExp(`\\b${countryDetails.rate}\\b`, 'g'), `<span class="highlighted-text">${countryDetails.rate}</span>`);
          text = text.replace(new RegExp(`\\b${countryDetails.article}\\b`, 'g'), `<span class="highlighted-text">${countryDetails.article}</span>`);
        }
        break;
      case 'incomeType':
        const incomeDetails = getActiveTreatyDetails();
        if (incomeDetails) {
          text = text.replace(new RegExp(`\\b${incomeDetails.rate}\\b`, 'g'), `<span class="highlighted-text">${incomeDetails.rate}</span>`);
          text = text.replace(new RegExp(`\\b${incomeDetails.article}\\b`, 'g'), `<span class="highlighted-text">${incomeDetails.article}</span>`);
        }
        break;
      case 'fatcaStatus':
        text = highlightValue(formData.fatcaStatus);
        break;
      case 'giin':
        text = highlightValue(formData.giin);
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

  const activeTreatyDetails = getActiveTreatyDetails();

  return (
    <div className="container">
      <div className="form-section">
        <div className="header-section">
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
            <option value="austria">{t.countryOptions.austria}</option>
            <option value="malta">{t.countryOptions.malta}</option>
            <option value="thailand">{t.countryOptions.thailand}</option>
            <option value="cyprus">{t.countryOptions.cyprus}</option>
            <option value="switzerland">{t.countryOptions.switzerland}</option>
            <option value="bulgaria">{t.countryOptions.bulgaria}</option>
          </select>
          {errors.country && <span className="error-message">{errors.country}</span>}
          {formData.country && activeTreatyDetails && (
            <div className="treaty-info">
              <strong>{t.treatyInfo}</strong>
              {formData.country === 'austria' && (
                <div className="income-type-toggle">
                  <div className="toggle-label">
                    <span>{t.incomeTypeLabel} {t.required}</span>
                    <span className="tooltip" title={t.incomeTypeHelp}>ℹ️</span>
                  </div>
                  <div className="toggle-group">
                    {Object.keys(t.incomeTypeOptions).map((type) => (
                      <label key={type} className={`toggle-option ${formData.incomeType === type ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="incomeType"
                          value={type}
                          checked={formData.incomeType === type}
                          onChange={(e) => handleInputChange('incomeType', e.target.value)}
                        />
                        {t.incomeTypeOptions[type]}
                      </label>
                    ))}
                  </div>
                  {errors.incomeType && <span className="error-message">{errors.incomeType}</span>}
                </div>
              )}
              <p>{activeTreatyDetails.description[language]}</p>
              <a href={activeTreatyDetails.irsLink} target="_blank" rel="noopener noreferrer">
                {t.viewTreaty.replace('{country}', t.countryOptions[formData.country])}
              </a>
              {formData.country === 'austria' && activeTreatyDetails.activeIncomeType === 'interest' && (
                <div className="triangular-note">
                  <span className="tooltip" title={t.austriaTriangularTooltip}>ℹ️</span>
                  <span>{t.austriaTriangularNote}</span>
                </div>
              )}
              {formData.country === 'bulgaria' && (
                <div className="contingent-interest-info">
                  <button 
                    type="button"
                    className="learn-more-btn" 
                    onClick={() => setShowContingentDetails(!showContingentDetails)}
                  >
                    ℹ️ What is "contingent interest"? {showContingentDetails ? '▲' : '▼'}
                  </button>
                  {showContingentDetails && (
                    <div className="contingent-details">
                      <h4>{language === 'en' ? 'Contingent Interest (10% Rate)' : 'Bedingte Zinsen (10% Satz)'}</h4>
                      <p><strong>{language === 'en' ? 'Applies when interest is tied to business performance:' : 'Gilt wenn Zinsen an Geschäftserfolg gekoppelt sind:'}</strong></p>
                      <ul>
                        <li>{language === 'en' ? 'Interest based on profits, revenues, or cash flow' : 'Zinsen basierend auf Gewinnen, Einnahmen oder Cashflow'}</li>
                        <li>{language === 'en' ? 'Interest linked to property value changes' : 'Zinsen gekoppelt an Immobilienwertveränderungen'}</li>
                        <li>{language === 'en' ? 'Interest tied to dividend/distribution payments' : 'Zinsen gekoppelt an Dividenden-/Ausschüttungszahlungen'}</li>
                      </ul>
                      <p><strong>{language === 'en' ? 'Example:' : 'Beispiel:'}</strong> {language === 'en' ? '"5% base rate plus 2% of annual net profits"' : '"5% Basiszins plus 2% der jährlichen Nettogewinne"'}</p>
                      <p><strong>{language === 'en' ? 'Why higher rate?' : 'Warum höherer Satz?'}</strong> {language === 'en' ? 'Contingent interest resembles equity participation more than pure debt, so it\'s taxed more like dividends.' : 'Bedingte Zinsen ähneln mehr einer Kapitalbeteiligung als reinen Schulden, daher werden sie eher wie Dividenden besteuert.'}</p>
                    </div>
                  )}
                </div>
              )}
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
          <label>
            {t.ownerTypeLabel} {t.required}
            <span className="tooltip" title={t.ownerTypeHelp}>ℹ️</span>
          </label>
          <div className="toggle-group">
            {Object.keys(t.ownerTypeOptions).map((type) => (
              <label key={type} className={`toggle-option ${formData.ownerType === type ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="ownerType"
                  value={type}
                  checked={formData.ownerType === type}
                  onChange={(e) => handleInputChange('ownerType', e.target.value)}
                />
                {t.ownerTypeOptions[type]}
              </label>
            ))}
          </div>
          {errors.ownerType && <span className="error-message">{errors.ownerType}</span>}
          <div className="field-help">
            <small>{formData.ownerType === 'entity' ? t.entityNote : t.individualNote}</small>
          </div>
        </div>

        {formData.ownerType === 'entity' && (
          <>
            <div className="form-group">
              <label htmlFor="fatcaStatus">
                {t.fatcaStatusLabel} {t.required}
              </label>
              <input
                type="text"
                id="fatcaStatus"
                value={formData.fatcaStatus}
                onChange={(e) => handleInputChange('fatcaStatus', e.target.value)}
                className={errors.fatcaStatus ? 'error' : ''}
                placeholder={t.fatcaStatusPlaceholder}
              />
              {errors.fatcaStatus && <span className="error-message">{errors.fatcaStatus}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="giin">
                {t.giinLabel} {t.required}
              </label>
              <input
                type="text"
                id="giin"
                value={formData.giin}
                onChange={(e) => handleInputChange('giin', e.target.value)}
                className={errors.giin ? 'error' : ''}
                placeholder={t.giinPlaceholder}
              />
              {errors.giin && <span className="error-message">{errors.giin}</span>}
              <div className="field-help">
                <small>{t.giinHelp}</small>
              </div>
            </div>
          </>
        )}

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
