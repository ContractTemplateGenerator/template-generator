// Icon component using feather icons
const Icon = ({ name, ...props }) => {
  const iconRef = React.useRef();
  
  React.useEffect(() => {
    if (iconRef.current && feather) {
      feather.replace();
    }
  }, []);
  
  return (
    <i ref={iconRef} data-feather={name} {...props}></i>
  );
};

const App = () => {
  // Language state
  const [language, setLanguage] = React.useState('en');
  
  // Tab state
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // Form data state
  const [formData, setFormData] = React.useState({
    disclosingPartyName: '',
    disclosingPartyAddress: '',
    receivingPartyName: '',
    receivingPartyAddress: '',
    effectiveDate: '',
    purposeType: 'business',
    customPurpose: '',
    confidentialityType: 'broad',
    protectionPeriod: '2',
    governingLaw: 'california',
    customGoverningLaw: '',
    includeExclusions: true,
    includeNoWarranties: true,
    includeSeverability: true,
    includeLanguageClause: true
  });
  
  // State to track what was last changed for highlighting
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content
  const previewRef = React.useRef(null);
  const highlightedRef = React.useRef(null);
  
  // Translation function
  const t = (englishText, spanishText) => language === 'en' ? englishText : spanishText;
  
  // US States for governing law
  const usStates = [
    { value: 'alabama', label: 'Alabama' },
    { value: 'alaska', label: 'Alaska' },
    { value: 'arizona', label: 'Arizona' },
    { value: 'arkansas', label: 'Arkansas' },
    { value: 'california', label: 'California' },
    { value: 'colorado', label: 'Colorado' },
    { value: 'connecticut', label: 'Connecticut' },
    { value: 'delaware', label: 'Delaware' },
    { value: 'florida', label: 'Florida' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'hawaii', label: 'Hawaii' },
    { value: 'idaho', label: 'Idaho' },
    { value: 'illinois', label: 'Illinois' },
    { value: 'indiana', label: 'Indiana' },
    { value: 'iowa', label: 'Iowa' },
    { value: 'kansas', label: 'Kansas' },
    { value: 'kentucky', label: 'Kentucky' },
    { value: 'louisiana', label: 'Louisiana' },
    { value: 'maine', label: 'Maine' },
    { value: 'maryland', label: 'Maryland' },
    { value: 'massachusetts', label: 'Massachusetts' },
    { value: 'michigan', label: 'Michigan' },
    { value: 'minnesota', label: 'Minnesota' },
    { value: 'mississippi', label: 'Mississippi' },
    { value: 'missouri', label: 'Missouri' },
    { value: 'montana', label: 'Montana' },
    { value: 'nebraska', label: 'Nebraska' },
    { value: 'nevada', label: 'Nevada' },
    { value: 'newhampshire', label: 'New Hampshire' },
    { value: 'newjersey', label: 'New Jersey' },
    { value: 'newmexico', label: 'New Mexico' },
    { value: 'newyork', label: 'New York' },
    { value: 'northcarolina', label: 'North Carolina' },
    { value: 'northdakota', label: 'North Dakota' },
    { value: 'ohio', label: 'Ohio' },
    { value: 'oklahoma', label: 'Oklahoma' },
    { value: 'oregon', label: 'Oregon' },
    { value: 'pennsylvania', label: 'Pennsylvania' },
    { value: 'rhodeisland', label: 'Rhode Island' },
    { value: 'southcarolina', label: 'South Carolina' },
    { value: 'southdakota', label: 'South Dakota' },
    { value: 'tennessee', label: 'Tennessee' },
    { value: 'texas', label: 'Texas' },
    { value: 'utah', label: 'Utah' },
    { value: 'vermont', label: 'Vermont' },
    { value: 'virginia', label: 'Virginia' },
    { value: 'washington', label: 'Washington' },
    { value: 'westvirginia', label: 'West Virginia' },
    { value: 'wisconsin', label: 'Wisconsin' },
    { value: 'wyoming', label: 'Wyoming' },
    { value: 'dc', label: 'Washington D.C.' }
  ];
  
  // Spanish-speaking countries
  const spanishCountries = [
    { value: 'mexico', label: 'Mexico / México' },
    { value: 'spain', label: 'Spain / España' },
    { value: 'argentina', label: 'Argentina' },
    { value: 'bolivia', label: 'Bolivia' },
    { value: 'chile', label: 'Chile' },
    { value: 'colombia', label: 'Colombia' },
    { value: 'costarica', label: 'Costa Rica' },
    { value: 'cuba', label: 'Cuba' },
    { value: 'dominicanrepublic', label: 'Dominican Republic / República Dominicana' },
    { value: 'ecuador', label: 'Ecuador' },
    { value: 'elsalvador', label: 'El Salvador' },
    { value: 'equatorialguinea', label: 'Equatorial Guinea / Guinea Ecuatorial' },
    { value: 'guatemala', label: 'Guatemala' },
    { value: 'honduras', label: 'Honduras' },
    { value: 'nicaragua', label: 'Nicaragua' },
    { value: 'panama', label: 'Panama / Panamá' },
    { value: 'paraguay', label: 'Paraguay' },
    { value: 'peru', label: 'Peru / Perú' },
    { value: 'puertorico', label: 'Puerto Rico' },
    { value: 'uruguay', label: 'Uruguay' },
    { value: 'venezuela', label: 'Venezuela' }
  ];
  
  // Purpose of disclosure options
  const purposeOptions = [
    { value: 'business', label: t('To discuss potential business relationship', 'Para discutir una posible relación comercial') },
    { value: 'services', label: t('To enable receiving party provide services for disclosing party', 'Para permitir que la parte receptora proporcione servicios a la parte divulgadora') },
    { value: 'custom', label: t('Other (specify)', 'Otro (especificar)') }
  ];
  
  // Tab configuration
  const tabs = [
    { id: 'parties', label: t('Parties', 'Partes') },
    { id: 'key-terms', label: t('Key Terms', 'Términos Clave') },
    { id: 'options', label: t('Options', 'Opciones') },
    { id: 'summary', label: t('Summary', 'Resumen') }
  ];
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Update form data
    if (name === 'purposeType' && value === 'custom') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        customPurpose: prev.customPurpose || prev.purpose || ''
      }));
    } else if (name === 'governingLaw' && value === 'custom') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        customGoverningLaw: prev.customGoverningLaw || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // Get purpose of disclosure text
  const getPurpose = () => {
    switch (formData.purposeType) {
      case 'business':
        return 'discussing potential business relationship';
      case 'services':
        return 'enabling Receiving Party to provide services for Disclosing Party';
      case 'custom':
        return formData.customPurpose || '[Purpose of Disclosure]';
      default:
        return '[Purpose of Disclosure]';
    }
  };
  
  // Generate document sections for side-by-side preview
  const generateDocumentSections = () => {
    const sections = [];
    
    // Header
    sections.push({
      english: "NON-DISCLOSURE AGREEMENT",
      spanish: "ACUERDO DE CONFIDENCIALIDAD",
      isHeader: true
    });
    
    // Parties
    sections.push({
      english: `This Agreement is made by ${formData.disclosingPartyName || '[Disclosing Party Name]'} (the "Disclosing Party"), and ${formData.receivingPartyName || '[Receiving Party Name]'} (the "Receiving Party"). (each a "Party" and, collectively, the "Parties").`,
      spanish: `Este Acuerdo es celebrado por ${formData.disclosingPartyName || '[Nombre de la Parte Divulgadora]'} (la "Parte Divulgadora"), y ${formData.receivingPartyName || '[Nombre de la Parte Receptora]'} (la "Parte Receptora"). (cada una, una "Parte" y, en conjunto, las "Partes").`
    });
    
    // Addresses 
    if (formData.disclosingPartyAddress || formData.receivingPartyAddress) {
      sections.push({
        english: `Disclosing Party Address: ${formData.disclosingPartyAddress || '[Disclosing Party Address]'}\nReceiving Party Address: ${formData.receivingPartyAddress || '[Receiving Party Address]'}`,
        spanish: `Dirección de la Parte Divulgadora: ${formData.disclosingPartyAddress || '[Dirección de la Parte Divulgadora]'}\nDirección de la Parte Receptora: ${formData.receivingPartyAddress || '[Dirección de la Parte Receptora]'}`
      });
    }
    
    // Effective Date
    sections.push({
      english: "1. EFFECTIVE DATE",
      spanish: "1. FECHA DE ENTRADA EN VIGOR",
      isTitle: true
    });
    sections.push({
      english: `The effective date of this Agreement is ${formData.effectiveDate || '[Effective Date]'}.`,
      spanish: `La fecha de entrada en vigor de este Acuerdo es ${formData.effectiveDate || '[Fecha de Entrada en Vigor]'}.`
    });
    
    // Confidential Information
    sections.push({
      english: "2. CONFIDENTIAL INFORMATION",
      spanish: "2. INFORMACIÓN CONFIDENCIAL",
      isTitle: true
    });
    sections.push({
      english: `"Confidential Information" disclosed under this Agreement is defined as ${getConfidentialityDefinition()}`,
      spanish: `"Información Confidencial" divulgada bajo este Acuerdo se define como ${getConfidentialityDefinitionSpanish()}`
    });
    
    // Permitted Use
    sections.push({
      english: "3. PERMITTED USE AND DISCLOSURE",
      spanish: "3. USO Y DIVULGACIÓN PERMITIDOS",
      isTitle: true
    });
    sections.push({
      english: `Receiving Party will use Confidential Information only for the purpose of ${getPurpose()}. Receiving Party may disclose Confidential Information to its directors, officers, employees, contractors, advisors, and agents, so long as such individuals have a need to know in their work for Receiving Party in furtherance of the potential or continued business transaction or relationship between the Parties, and are bound by obligations of confidentiality at least as restrictive as those imposed on Receiving Party in this Agreement, (collectively "Representatives"). Receiving Party is fully liable for any breach of this Agreement by its Representatives. Receiving Party will use the same degree of care, but no less than a reasonable degree of care, as the Receiving Party uses with respect to its own similar information to protect the Confidential Information. Receiving Party may only disclose confidential information as authorized by this Agreement.`,
      spanish: `La Parte Receptora utilizará la Información Confidencial únicamente para el propósito de ${getPurpose() === 'discussing potential business relationship' ? 'discutir una posible relación comercial' : 
                (getPurpose() === 'enabling Receiving Party to provide services for Disclosing Party' ? 'permitir que la Parte Receptora proporcione servicios a la Parte Divulgadora' : 
                formData.customPurpose || '[Propósito de la Divulgación]')}. La Parte Receptora podrá divulgar Información Confidencial a sus directores, funcionarios, empleados, contratistas, asesores y agentes, siempre que dichas personas tengan la necesidad de conocerla en su trabajo para la Parte Receptora en el desarrollo de la transacción comercial potencial o continua o relación entre las Partes, y estén sujetos a obligaciones de confidencialidad al menos tan restrictivas como las impuestas a la Parte Receptora en este Acuerdo (colectivamente, "Representantes"). La Parte Receptora es totalmente responsable de cualquier incumplimiento de este Acuerdo por parte de sus Representantes. La Parte Receptora utilizará el mismo grado de cuidado, pero no menos que un grado razonable de cuidado, que la Parte Receptora utiliza con respecto a su propia información similar para proteger la Información Confidencial. La Parte Receptora solo podrá divulgar información confidencial según lo autorizado por este Acuerdo.`
    });
    
    // Protection Period
    sections.push({
      english: "4. PROTECTION PERIOD AND RETURN",
      spanish: "4. PERÍODO DE PROTECCIÓN Y DEVOLUCIÓN",
      isTitle: true
    });
    sections.push({
      english: `Unless the Parties otherwise agree in writing, a Receiving Party's duty to protect Confidential Information expires ${formData.protectionPeriod} years from the date of disclosure. Upon the Disclosing Party's written request, Receiving Party will promptly return or destroy all Confidential Information received from the Disclosing Party, together with all copies.`,
      spanish: `A menos que las Partes acuerden lo contrario por escrito, el deber de la Parte Receptora de proteger la Información Confidencial expira ${formData.protectionPeriod} años desde la fecha de divulgación. A solicitud escrita de la Parte Divulgadora, la Parte Receptora devolverá o destruirá prontamente toda la Información Confidencial recibida de la Parte Divulgadora, junto con todas las copias.`
    });
    
    // Exclusions
    if (formData.includeExclusions) {
      sections.push({
        english: "5. EXCLUSIONS",
        spanish: "5. EXCLUSIONES",
        isTitle: true
      });
      sections.push({
        english: `Confidential Information will not include any information that: (a) is or becomes part of the public domain through no fault of Receiving Party; (b) was rightfully in Receiving Party's possession at the time of disclosure, without restriction as to use or disclosure; or (c) Receiving Party rightfully receives from a third party who has the right to disclose it and who provides it without restriction as to use or disclosure.`,
        spanish: `La Información Confidencial no incluirá información que: (a) sea o se convierta en parte del dominio público sin culpa de la Parte Receptora; (b) estuviera legítimamente en posesión de la Parte Receptora al momento de la divulgación, sin restricción en cuanto a su uso o divulgación; o (c) la Parte Receptora reciba legítimamente de un tercero que tenga el derecho de divulgarla y que la proporcione sin restricción en cuanto a su uso o divulgación.`
      });
    }
    
    // No Warranties
    if (formData.includeNoWarranties) {
      sections.push({
        english: `${formData.includeExclusions ? '6' : '5'}. NO WARRANTIES`,
        spanish: `${formData.includeExclusions ? '6' : '5'}. SIN GARANTÍAS`,
        isTitle: true
      });
      sections.push({
        english: `The Confidential Information is provided with no warranties of any kind. The Disclosing Party is not liable for direct or indirect damages, which occur to the Receiving Party while using the Confidential Information. All Confidential Information disclosed will remain property of the Disclosing Party.`,
        spanish: `La Información Confidencial se proporciona sin garantías de ningún tipo. La Parte Divulgadora no es responsable de los daños directos o indirectos que ocurran a la Parte Receptora al usar la Información Confidencial. Toda la Información Confidencial divulgada seguirá siendo propiedad de la Parte Divulgadora.`
      });
    }
    
    // Governing Law
    let clauseNum = 5;
    if (formData.includeExclusions) clauseNum++;
    if (formData.includeNoWarranties) clauseNum++;
    
    sections.push({
      english: `${clauseNum}. GOVERNING LAW`,
      spanish: `${clauseNum}. LEY APLICABLE`,
      isTitle: true
    });
    sections.push({
      english: `This Agreement shall be governed by the law of ${getGoverningLaw()}. ${getJurisdiction()} is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`,
      spanish: `Este Acuerdo se regirá por la ley de ${getGoverningLawSpanish()}. ${getJurisdictionSpanish()} se acuerda como lugar de jurisdicción para todas las disputas que surjan de este Acuerdo.`
    });
    
    // Severability
    if (formData.includeSeverability) {
      clauseNum++;
      sections.push({
        english: `${clauseNum}. SEVERABILITY`,
        spanish: `${clauseNum}. DIVISIBILIDAD`,
        isTitle: true
      });
      sections.push({
        english: `If any provision of this Agreement is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions of this Agreement will remain in full force and effect, and the provision affected will be construed so as to be enforceable to the maximum extent permissible by law.`,
        spanish: `Si alguna disposición de este Acuerdo es considerada inválida o inejecutable por un tribunal de jurisdicción competente, las disposiciones restantes de este Acuerdo permanecerán en pleno vigor y efecto, y la disposición afectada se interpretará de manera que sea ejecutable en la máxima medida permitida por la ley.`
      });
    }
    
    // Language Clause
    if (formData.includeLanguageClause) {
      clauseNum++;
      sections.push({
        english: `${clauseNum}. PREVAILING LANGUAGE`,
        spanish: `${clauseNum}. IDIOMA PREDOMINANTE`,
        isTitle: true
      });
      sections.push({
        english: `In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Spanish translation, the English version shall prevail.`,
        spanish: `En caso de cualquier conflicto, discrepancia, inconsistencia o ambigüedad entre la versión en inglés de este Acuerdo y la traducción al español, prevalecerá la versión en inglés.`
      });
    }
    
    // Signature block
    sections.push({
      english: "IN WITNESS WHEREOF",
      spanish: "EN FE DE LO CUAL",
      isTitle: true
    });
    sections.push({
      english: "The Parties hereto have executed this Agreement.",
      spanish: "Las Partes han ejecutado este Acuerdo."
    });
    
    sections.push({
      english: "DISCLOSING PARTY:",
      spanish: "PARTE DIVULGADORA:",
      isTitle: true,
      isSignature: true
    });
    sections.push({
      english: `By: _________________________________
Name: ______________________________
Title:________________________________
Date: _______________________________`,
      spanish: `Por: _________________________________
Nombre: ______________________________
Título: _______________________________
Fecha: _______________________________`
    });
    
    sections.push({
      english: "RECEIVING PARTY:",
      spanish: "PARTE RECEPTORA:",
      isTitle: true,
      isSignature: true
    });
    sections.push({
      english: `By: _________________________________
Name: ______________________________
Title:________________________________
Date: _______________________________`,
      spanish: `Por: _________________________________
Nombre: ______________________________
Título: _______________________________
Fecha: _______________________________`
    });
    
    return sections;
  };
  
  // Helper functions for confidentiality definitions
  const getConfidentialityDefinition = () => {
    switch (formData.confidentialityType) {
      case 'broad':
        return 'any information, technical data or know-how furnished, whether in written, oral, electronic or other form by the Disclosing Party to the Receiving Party that (a) is marked, accompanied or supported by documents clearly and conspicuously designating such documents as "confidential", "internal use" or the equivalent; (b) is identified by the Disclosing Party as confidential before, during or promptly after the presentation or communication; or (c) should reasonably be known by Receiving Party to be confidential.';
      case 'medium':
        return 'any information, technical data or know-how furnished in written or electronic form by the Disclosing Party to the Receiving Party that is marked or designated as "confidential" or with similar designation. Information disclosed orally shall be considered Confidential Information if identified as confidential at the time of disclosure and confirmed in writing within 30 days.';
      case 'narrow':
        return 'any information furnished by the Disclosing Party to the Receiving Party that is specifically marked in writing as "confidential" at the time of disclosure.';
      default:
        return formData.customConfidentialityDefinition || '[Custom definition]';
    }
  };
  
  const getConfidentialityDefinitionSpanish = () => {
    switch (formData.confidentialityType) {
      case 'broad':
        return 'cualquier información, datos técnicos o conocimientos técnicos proporcionados, ya sea en forma escrita, oral, electrónica u otra forma por la Parte Divulgadora a la Parte Receptora que (a) esté marcada, acompañada o respaldada por documentos que designen clara y visiblemente dichos documentos como "confidencial", "uso interno" o equivalente; (b) sea identificada por la Parte Divulgadora como confidencial antes, durante o inmediatamente después de la presentación o comunicación; o (c) razonablemente debe ser conocida por la Parte Receptora como confidencial.';
      case 'medium':
        return 'cualquier información, datos técnicos o conocimientos técnicos proporcionados en forma escrita o electrónica por la Parte Divulgadora a la Parte Receptora que esté marcada o designada como "confidencial" o con designación similar. La información divulgada oralmente se considerará Información Confidencial si se identifica como confidencial en el momento de la divulgación y se confirma por escrito dentro de los 30 días.';
      case 'narrow':
        return 'cualquier información proporcionada por la Parte Divulgadora a la Parte Receptora que esté específicamente marcada por escrito como "confidencial" en el momento de la divulgación.';
      default:
        return formData.customConfidentialityDefinition || '[Definición personalizada]';
    }
  };
  
  // Helper functions for governing law
  const getGoverningLaw = () => {
    if (formData.governingLaw === 'custom') {
      return formData.customGoverningLaw || '[Custom jurisdiction]';
    }
    
    // Check if this is a US state
    const usState = usStates.find(s => s.value === formData.governingLaw);
    if (usState) {
      return `the State of ${usState.label}, USA`;
    }
    
    // Check if this is a Spanish-speaking country
    const spanishCountry = spanishCountries.find(c => c.value === formData.governingLaw);
    if (spanishCountry) {
      // Extract just the country name (before the slash if present)
      const countryName = spanishCountry.label.split(' / ')[0];
      return countryName;
    }
    
    // Default fallback
    return 'the State of California, USA';
  };
  
  const getGoverningLawSpanish = () => {
    if (formData.governingLaw === 'custom') {
      return formData.customGoverningLaw || '[Jurisdicción personalizada]';
    }
    
    // Check if this is a US state
    const usState = usStates.find(s => s.value === formData.governingLaw);
    if (usState) {
      return `el Estado de ${usState.label}, EE.UU.`;
    }
    
    // Check if this is a Spanish-speaking country
    const spanishCountry = spanishCountries.find(c => c.value === formData.governingLaw);
    if (spanishCountry) {
      // Use Spanish name if available (after the slash)
      const parts = spanishCountry.label.split(' / ');
      return parts.length > 1 ? parts[1] : parts[0];
    }
    
    // Default fallback
    return 'el Estado de California, EE.UU.';
  };
  
  const getJurisdiction = () => {
    switch (formData.governingLaw) {
      case 'california': return 'Los Angeles, CA';
      case 'delaware': return 'Wilmington, DE';
      case 'newyork': return 'New York, NY';
      case 'florida': return 'Miami, FL';
      case 'texas': return 'Houston, TX';
      case 'illinois': return 'Chicago, IL';
      case 'pennsylvania': return 'Philadelphia, PA';
      case 'mexico': return 'Mexico City';
      case 'spain': return 'Madrid';
      case 'argentina': return 'Buenos Aires';
      case 'chile': return 'Santiago';
      case 'colombia': return 'Bogotá';
      case 'peru': return 'Lima';
      case 'custom': return formData.customGoverningLaw ? `the courts of ${formData.customGoverningLaw}` : '[Jurisdiction]';
      default: return 'the courts with jurisdiction';
    }
  };
  
  const getJurisdictionSpanish = () => {
    switch (formData.governingLaw) {
      case 'california': return 'Los Ángeles, CA';
      case 'delaware': return 'Wilmington, DE';
      case 'newyork': return 'Nueva York, NY';
      case 'florida': return 'Miami, FL';
      case 'texas': return 'Houston, TX';
      case 'illinois': return 'Chicago, IL';
      case 'pennsylvania': return 'Filadelfia, PA';
      case 'mexico': return 'Ciudad de México';
      case 'spain': return 'Madrid';
      case 'argentina': return 'Buenos Aires';
      case 'chile': return 'Santiago';
      case 'colombia': return 'Bogotá';
      case 'peru': return 'Lima';
      case 'custom': return formData.customGoverningLaw ? `los tribunales de ${formData.customGoverningLaw}` : '[Jurisdicción]';
      default: return 'los tribunales con jurisdicción';
    }
  };
  
  // Determine which section to highlight based on last changed field
  const getSectionToHighlight = () => {
    switch (lastChanged) {
      case 'disclosingPartyName':
      case 'receivingPartyName':
        return 'parties';
      case 'disclosingPartyAddress':
      case 'receivingPartyAddress':
        return 'addresses';
      case 'effectiveDate':
        return 'effectiveDate';
      case 'purposeType':
      case 'customPurpose':
        return 'purpose';
      case 'confidentialityType':
        return 'confidentiality';
      case 'protectionPeriod':
        return 'protectionPeriod';
      case 'governingLaw':
      case 'customGoverningLaw':
        return 'governingLaw';
      case 'includeExclusions':
      case 'includeNoWarranties':
      case 'includeSeverability':
      case 'includeLanguageClause':
        return 'options';
      default:
        return null;
    }
  };
  
  // Create highlighted sections
  const createHighlightedSections = (sections) => {
    if (!sections || !sections.length) return [];
    
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return sections;
    
    return sections.map((section, index) => {
      let shouldHighlight = false;
      
      switch (sectionToHighlight) {
        case 'parties':
          if (!section.isTitle && !section.isHeader && index === 1) {
            shouldHighlight = true;
          }
          break;
        case 'addresses':
          if (!section.isTitle && !section.isHeader && index === 2) {
            shouldHighlight = true;
          }
          break;
        case 'effectiveDate':
          if (section.english && section.english.includes('effective date') && !section.isTitle) {
            shouldHighlight = true;
          }
          break;
        case 'purpose':
          if (section.english && section.english.includes('purpose of') && !section.isTitle) {
            shouldHighlight = true;
          }
          break;
        case 'confidentiality':
          if (section.english && section.english.includes('"Confidential Information"')) {
            shouldHighlight = true;
          }
          break;
        case 'protectionPeriod':
          if (section.english && section.english.includes('expires') && !section.isTitle) {
            shouldHighlight = true;
          }
          break;
        case 'governingLaw':
          if (section.english && section.english.includes('governed by') && !section.isTitle) {
            shouldHighlight = true;
          }
          break;
        case 'options':
          // This could highlight multiple sections based on which option was changed
          if (
            (lastChanged === 'includeExclusions' && section.english && section.english.includes('EXCLUSIONS')) ||
            (lastChanged === 'includeNoWarranties' && section.english && section.english.includes('NO WARRANTIES')) ||
            (lastChanged === 'includeSeverability' && section.english && section.english.includes('SEVERABILITY')) ||
            (lastChanged === 'includeLanguageClause' && section.english && section.english.includes('PREVAILING LANGUAGE'))
          ) {
            shouldHighlight = true;
          }
          break;
      }
      
      if (shouldHighlight) {
        return {
          ...section,
          highlight: true
        };
      }
      
      return section;
    });
  };
  
  // Scroll to highlighted section
  React.useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [lastChanged]);
  
  // Copy to clipboard
  const copyToClipboard = () => {
    const sections = generateDocumentSections();
    let text = '';
    sections.forEach(section => {
      if (section.isHeader) {
        text += `${section.english}                    ${section.spanish}\n\n`;
      } else if (section.isTitle) {
        text += `${section.english}                    ${section.spanish}\n`;
      } else {
        text += `${section.english}\n${section.spanish}\n\n`;
      }
    });
    
    navigator.clipboard.writeText(text).then(() => {
      alert(t('Document copied to clipboard!', '¡Documento copiado al portapapeles!'));
    });
  };
  
  // Download as Word
  const downloadAsWord = () => {
    try {
      const sections = generateDocumentSections();
      window.generateWordDoc(sections, formData);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert(t('Error generating Word document. Please try again.', 'Error al generar el documento Word. Por favor, inténtelo de nuevo.'));
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
  
  const sections = generateDocumentSections();
  const highlightedSections = createHighlightedSections(sections);
  
  // Get protection period risk level
  const getProtectionPeriodRiskLevel = () => {
    const years = parseInt(formData.protectionPeriod);
    if (years <= 5) return 'safe';
    if (years <= 10) return 'moderate';
    return 'risky';
  };
  
  // Get protection period risk message
  const getProtectionPeriodRiskMessage = () => {
    const years = parseInt(formData.protectionPeriod);
    if (years <= 5) return null;
    if (years <= 10) {
      return t(
        'Protection periods between 5-10 years may be scrutinized by courts in some jurisdictions, but are generally enforceable for truly confidential information.',
        'Los períodos de protección entre 5 y 10 años pueden ser examinados por los tribunales en algunas jurisdicciones, pero generalmente son ejecutables para información verdaderamente confidencial.'
      );
    }
    return t(
      'Protection periods over 10 years may be difficult to enforce in court as they can be viewed as unreasonable restraints on business.',
      'Los períodos de protección de más de 10 años pueden ser difíciles de hacer cumplir en los tribunales, ya que pueden considerarse restricciones irrazonables para los negocios.'
    );
  };
  
  return (
    <div className="container">
      <div className="generator-container">
        <div className="header">
          <h1>{t('Dual-Language NDA Generator', 'Generador de Acuerdo de Confidencialidad Bilingüe')}</h1>
          <p>{t('Create professional NDAs in English and Spanish', 'Cree acuerdos de confidencialidad profesionales en inglés y español')}</p>
          
          <div className="language-toggle">
            <button
              className={`flag-button ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              <img src="usa-flag.svg" alt="USA" width="24" height="16" />
              English
            </button>
            <button
              className={`flag-button ${language === 'es' ? 'active' : ''}`}
              onClick={() => setLanguage('es')}
            >
              <img src="mexico-flag.svg" alt="Mexico" width="24" height="16" />
              Español
            </button>
          </div>
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
        
        <div className="content-wrapper">
          <div className="form-panel">
            {/* Parties Tab */}
            <div className={`tab-content ${currentTab === 0 ? 'active' : ''}`}>
              <h2>{t('Party Information', 'Información de las Partes')}</h2>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="disclosingPartyName">{t('Disclosing Party Name', 'Nombre de la Parte Divulgadora')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('The party sharing confidential information', 'La parte que comparte información confidencial')}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  id="disclosingPartyName"
                  name="disclosingPartyName"
                  className="form-control"
                  value={formData.disclosingPartyName}
                  onChange={handleChange}
                  placeholder={t('Enter company or individual name', 'Ingrese el nombre de la empresa o individuo')}
                />
              </div>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="disclosingPartyAddress">{t('Disclosing Party Address', 'Dirección de la Parte Divulgadora')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('Full address including city, state, country', 'Dirección completa incluyendo ciudad, estado, país')}
                    </div>
                  </div>
                </div>
                <textarea
                  id="disclosingPartyAddress"
                  name="disclosingPartyAddress"
                  className="form-control"
                  value={formData.disclosingPartyAddress}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t('123 Main St, City, State ZIP, Country', 'Calle Principal 123, Ciudad, Estado CP, País')}
                />
              </div>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="receivingPartyName">{t('Receiving Party Name', 'Nombre de la Parte Receptora')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('The party receiving confidential information', 'La parte que recibe información confidencial')}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  id="receivingPartyName"
                  name="receivingPartyName"
                  className="form-control"
                  value={formData.receivingPartyName}
                  onChange={handleChange}
                  placeholder={t('Enter company or individual name', 'Ingrese el nombre de la empresa o individuo')}
                />
              </div>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="receivingPartyAddress">{t('Receiving Party Address', 'Dirección de la Parte Receptora')}</label>
                </div>
                <textarea
                  id="receivingPartyAddress"
                  name="receivingPartyAddress"
                  className="form-control"
                  value={formData.receivingPartyAddress}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t('456 Oak Ave, City, State ZIP, Country', 'Avenida Roble 456, Ciudad, Estado CP, País')}
                />
              </div>
            </div>
            
            {/* Key Terms Tab */}
            <div className={`tab-content ${currentTab === 1 ? 'active' : ''}`}>
              <h2>{t('Key Terms', 'Términos Clave')}</h2>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="effectiveDate">{t('Effective Date', 'Fecha de Entrada en Vigor')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('Date when the agreement becomes effective', 'Fecha en que el acuerdo entra en vigor')}
                    </div>
                  </div>
                </div>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  className="form-control"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="purposeType">{t('Purpose of Disclosure', 'Propósito de la Divulgación')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('Specific business purpose for sharing information', 'Propósito comercial específico para compartir información')}
                    </div>
                  </div>
                </div>
                <select
                  id="purposeType"
                  name="purposeType"
                  className="form-control"
                  value={formData.purposeType}
                  onChange={handleChange}
                >
                  {purposeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                
                {formData.purposeType === 'custom' && (
                  <textarea
                    id="customPurpose"
                    name="customPurpose"
                    className="form-control"
                    value={formData.customPurpose}
                    onChange={handleChange}
                    rows="2"
                    style={{ marginTop: '10px' }}
                    placeholder={t('Enter custom purpose', 'Ingrese propósito personalizado')}
                  />
                )}
              </div>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label>{t('Confidentiality Definition', 'Definición de Confidencialidad')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('How broadly confidential information is defined', 'Qué tan ampliamente se define la información confidencial')}
                    </div>
                  </div>
                </div>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="confidentialityType"
                      value="broad"
                      checked={formData.confidentialityType === 'broad'}
                      onChange={handleChange}
                    />
                    <span>{t('Broad (includes oral, implied confidential)', 'Amplia (incluye oral, confidencial implícita)')}</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="confidentialityType"
                      value="medium"
                      checked={formData.confidentialityType === 'medium'}
                      onChange={handleChange}
                    />
                    <span>{t('Medium (written/electronic, oral with confirmation)', 'Media (escrita/electrónica, oral con confirmación)')}</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="confidentialityType"
                      value="narrow"
                      checked={formData.confidentialityType === 'narrow'}
                      onChange={handleChange}
                    />
                    <span>{t('Narrow (only written marked confidential)', 'Estrecha (solo escrita marcada como confidencial)')}</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="protectionPeriod">{t('Protection Period (years)', 'Período de Protección (años)')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('How long confidentiality obligations last', 'Duración de las obligaciones de confidencialidad')}
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  id="protectionPeriod"
                  name="protectionPeriod"
                  className="form-control"
                  value={formData.protectionPeriod}
                  onChange={handleChange}
                  min="1"
                  max="25"
                />
                {formData.protectionPeriod > 10 && (
                  <div className="warning-text">
                    {t('⚠️ Protection periods over 10 years may be unenforceable', '⚠️ Los períodos de protección de más de 10 años pueden ser inejecutables')}
                  </div>
                )}
                {formData.protectionPeriod > 5 && formData.protectionPeriod <= 10 && (
                  <div className="moderate-text">
                    {t('ℹ️ Protection periods of 5-10 years are generally acceptable but may be scrutinized', 'ℹ️ Los períodos de protección de 5-10 años son generalmente aceptables pero pueden ser examinados')}
                  </div>
                )}
              </div>
            </div>
            
            {/* Options Tab */}
            <div className={`tab-content ${currentTab === 2 ? 'active' : ''}`}>
              <h2>{t('Additional Options', 'Opciones Adicionales')}</h2>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="governingLaw">{t('Governing Law', 'Ley Aplicable')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('Which jurisdiction\'s laws apply', 'Qué leyes jurisdiccionales se aplican')}
                    </div>
                  </div>
                </div>
                <select
                  id="governingLaw"
                  name="governingLaw"
                  className="form-control"
                  value={formData.governingLaw}
                  onChange={handleChange}
                >
                  <optgroup label={t('US States', 'Estados de EE.UU.')}>
                    {usStates.map(state => (
                      <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label={t('Spanish-Speaking Countries', 'Países Hispanohablantes')}>
                    {spanishCountries.map(country => (
                      <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                  </optgroup>
                  <option value="custom">{t('Custom (write your own)', 'Personalizado (escriba el suyo)')}</option>
                </select>
                
                {formData.governingLaw === 'custom' && (
                  <input
                    type="text"
                    id="customGoverningLaw"
                    name="customGoverningLaw"
                    className="form-control"
                    value={formData.customGoverningLaw}
                    onChange={handleChange}
                    style={{ marginTop: '10px' }}
                    placeholder={t('Enter custom jurisdiction', 'Ingrese jurisdicción personalizada')}
                  />
                )}
              </div>
              
              <div className="form-group">
                <label>{t('Optional Clauses', 'Cláusulas Opcionales')}</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeExclusions"
                      checked={formData.includeExclusions}
                      onChange={handleChange}
                    />
                    <span>{t('Include standard exclusions clause', 'Incluir cláusula de exclusiones estándar')}</span>
                  </label>
                  {!formData.includeExclusions && (
                    <span className="checkbox-warning">
                      {t('⚠️ Omitting exclusions may make all information confidential', '⚠️ Omitir exclusiones puede hacer que toda la información sea confidencial')}
                    </span>
                  )}
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeNoWarranties"
                      checked={formData.includeNoWarranties}
                      onChange={handleChange}
                    />
                    <span>{t('Include no warranties clause', 'Incluir cláusula sin garantías')}</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeSeverability"
                      checked={formData.includeSeverability}
                      onChange={handleChange}
                    />
                    <span>{t('Include severability clause', 'Incluir cláusula de divisibilidad')}</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeLanguageClause"
                      checked={formData.includeLanguageClause}
                      onChange={handleChange}
                    />
                    <span>{t('Include language preference clause (English prevails)', 'Incluir cláusula de preferencia de idioma (prevalece el inglés)')}</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Summary Tab */}
            <div className={`tab-content ${currentTab === 3 ? 'active' : ''}`}>
              <h2>{t('Summary & Risk Assessment', 'Resumen y Evaluación de Riesgos')}</h2>
              
              <div className="summary-grid">
                <div className={`summary-item ${formData.disclosingPartyName && formData.receivingPartyName ? 'safe' : 'risky'}`}>
                  <span className="summary-label">{t('Parties', 'Partes')}</span>
                  {formData.disclosingPartyName && formData.receivingPartyName ? 
                    t('✓ Both parties identified', '✓ Ambas partes identificadas') : 
                    t('⚠️ Missing party information', '⚠️ Falta información de las partes')}
                </div>
                
                <div className={`summary-item ${formData.effectiveDate ? 'safe' : 'risky'}`}>
                  <span className="summary-label">{t('Effective Date', 'Fecha de Entrada en Vigor')}</span>
                  {formData.effectiveDate ? 
                    t('✓ Date specified', '✓ Fecha especificada') : 
                    t('⚠️ No effective date', '⚠️ Sin fecha de entrada en vigor')}
                </div>
                
                <div className={`summary-item ${formData.confidentialityType === 'broad' ? 'moderate' : 'safe'}`}>
                  <span className="summary-label">{t('Confidentiality Scope', 'Alcance de Confidencialidad')}</span>
                  {formData.confidentialityType} - {
                    formData.confidentialityType === 'broad' ? 
                    t('Very protective of discloser', 'Muy protector del divulgador') :
                    formData.confidentialityType === 'medium' ?
                    t('Balanced protection', 'Protección equilibrada') :
                    t('Limited protection', 'Protección limitada')
                  }
                </div>
                
                <div className={`summary-item ${getProtectionPeriodRiskLevel()}`}>
                  <span className="summary-label">{t('Protection Period', 'Período de Protección')}</span>
                  {formData.protectionPeriod} {t('years', 'años')}
                  {formData.protectionPeriod > 10 && t(' - May be unenforceable', ' - Puede ser inejecutable')}
                  {formData.protectionPeriod > 5 && formData.protectionPeriod <= 10 && t(' - Monitor for enforceability', ' - Vigilar la aplicabilidad')}
                </div>
                
                <div className={`summary-item ${formData.governingLaw === 'custom' ? 'moderate' : 'safe'}`}>
                  <span className="summary-label">{t('Governing Law', 'Ley Aplicable')}</span>
                  {getGoverningLaw()}
                </div>
                
                <div className={`summary-item ${formData.includeExclusions ? 'safe' : 'risky'}`}>
                  <span className="summary-label">{t('Exclusions', 'Exclusiones')}</span>
                  {formData.includeExclusions ? 
                    t('✓ Standard exclusions included', '✓ Exclusiones estándar incluidas') : 
                    t('⚠️ No exclusions - very broad', '⚠️ Sin exclusiones - muy amplio')}
                </div>
                
                <div className={`summary-item ${formData.includeSeverability ? 'safe' : 'moderate'}`}>
                  <span className="summary-label">{t('Severability', 'Divisibilidad')}</span>
                  {formData.includeSeverability ? 
                    t('✓ Included - protects agreement', '✓ Incluida - protege el acuerdo') : 
                    t('⚠️ Not included - higher risk', '⚠️ No incluida - mayor riesgo')}
                </div>
                
                <div className={`summary-item ${formData.includeLanguageClause ? 'safe' : 'moderate'}`}>
                  <span className="summary-label">{t('Language Clause', 'Cláusula de Idioma')}</span>
                  {formData.includeLanguageClause ? 
                    t('✓ English prevails', '✓ Prevalece el inglés') : 
                    t('⚠️ No language preference', '⚠️ Sin preferencia de idioma')}
                </div>
              </div>
              
              <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '6px'}}>
                <h3>{t('Risk Analysis', 'Análisis de Riesgos')}</h3>
                
                {/* Red warnings */}
                {(
                  !formData.disclosingPartyName || 
                  !formData.receivingPartyName || 
                  !formData.effectiveDate || 
                  parseInt(formData.protectionPeriod) > 10 || 
                  !formData.includeExclusions
                ) && (
                  <div className="risk-section risky">
                    <h4>{t('High Risk Issues', 'Problemas de Alto Riesgo')}</h4>
                    <ul>
                      {(!formData.disclosingPartyName || !formData.receivingPartyName) && (
                        <li className="warning-text">
                          {t('Missing party information makes the agreement potentially unenforceable as it fails to identify the contracting parties.', 
                            'La falta de información de las partes hace que el acuerdo sea potencialmente inejecutable, ya que no identifica a las partes contratantes.')}
                        </li>
                      )}
                      {!formData.effectiveDate && (
                        <li className="warning-text">
                          {t('No effective date specified. This creates uncertainty about when obligations begin and may affect enforceability.', 
                            'No se especifica fecha de entrada en vigor. Esto crea incertidumbre sobre cuándo comienzan las obligaciones y puede afectar la aplicabilidad.')}
                        </li>
                      )}
                      {parseInt(formData.protectionPeriod) > 10 && (
                        <li className="warning-text">
                          {t('Protection period of over 10 years may be rejected by courts as an unreasonable restraint on business. Many jurisdictions have found that NDAs with excessively long durations are unenforceable, particularly if they restrict employment opportunities.', 
                            'Un período de protección de más de 10 años puede ser rechazado por los tribunales como una restricción irrazonable para los negocios. Muchas jurisdicciones han determinado que los acuerdos de confidencialidad con duraciones excesivamente largas son inejecutables, especialmente si restringen las oportunidades de empleo.')}
                        </li>
                      )}
                      {!formData.includeExclusions && (
                        <li className="warning-text">
                          {t('No exclusions clause means that even public information could be considered confidential. Courts typically view NDAs without standard exclusions as overly broad and potentially unenforceable.', 
                            'La ausencia de una cláusula de exclusiones significa que incluso la información pública podría considerarse confidencial. Los tribunales generalmente consideran que los acuerdos de confidencialidad sin exclusiones estándar son excesivamente amplios y potencialmente inejecutables.')}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Yellow warnings */}
                {(
                  formData.confidentialityType === 'broad' || 
                  (parseInt(formData.protectionPeriod) > 5 && parseInt(formData.protectionPeriod) <= 10) || 
                  !formData.includeSeverability || 
                  !formData.includeLanguageClause ||
                  formData.governingLaw === 'custom'
                ) && (
                  <div className="risk-section moderate">
                    <h4>{t('Moderate Risk Issues', 'Problemas de Riesgo Moderado')}</h4>
                    <ul>
                      {formData.confidentialityType === 'broad' && (
                        <li className="moderate-text">
                          {t('Broad confidentiality definition may be difficult to enforce if challenged. While protecting more information, courts may scrutinize overly broad definitions, especially if they cover information that should reasonably be known by the recipient.', 
                            'Una definición amplia de confidencialidad puede ser difícil de hacer cumplir si se impugna. Si bien protege más información, los tribunales pueden examinar definiciones excesivamente amplias, especialmente si cubren información que razonablemente debería ser conocida por el receptor.')}
                        </li>
                      )}
                      {parseInt(formData.protectionPeriod) > 5 && parseInt(formData.protectionPeriod) <= 10 && (
                        <li className="moderate-text">
                          {t('Protection period of 5-10 years is generally enforceable for truly confidential information but may be scrutinized in some jurisdictions. Consider if this duration is truly necessary for your business needs.', 
                            'Un período de protección de 5 a 10 años generalmente es aplicable para información verdaderamente confidencial, pero puede ser examinado en algunas jurisdicciones. Considere si esta duración es realmente necesaria para sus necesidades comerciales.')}
                        </li>
                      )}
                      {!formData.includeSeverability && (
                        <li className="moderate-text">
                          {t('Without a severability clause, if one provision is found invalid, the entire agreement could be at risk. This creates unnecessary legal vulnerability.', 
                            'Sin una cláusula de divisibilidad, si una disposición se considera inválida, todo el acuerdo podría estar en riesgo. Esto crea una vulnerabilidad legal innecesaria.')}
                        </li>
                      )}
                      {!formData.includeLanguageClause && (
                        <li className="moderate-text">
                          {t('No language preference clause creates ambiguity in a dual-language agreement. In case of disputes, it may be unclear which version controls interpretation.', 
                            'La ausencia de una cláusula de preferencia de idioma crea ambigüedad en un acuerdo bilingüe. En caso de disputas, puede no estar claro qué versión controla la interpretación.')}
                        </li>
                      )}
                      {formData.governingLaw === 'custom' && (
                        <li className="moderate-text">
                          {t('Custom governing law may create uncertainty if not clearly defined. Ensure the jurisdiction specified has clear laws regarding confidentiality agreements.', 
                            'Una ley aplicable personalizada puede crear incertidumbre si no está claramente definida. Asegúrese de que la jurisdicción especificada tenga leyes claras sobre acuerdos de confidencialidad.')}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Best practices */}
                <div className="risk-section safe">
                  <h4>{t('Best Practices', 'Mejores Prácticas')}</h4>
                  <ul>
                    <li>
                      {t('Always ensure both parties have legal capacity to enter the agreement and clearly identify authorized signatories with proper titles.', 
                        'Asegúrese siempre de que ambas partes tengan capacidad legal para celebrar el acuerdo e identifique claramente a los firmantes autorizados con los títulos adecuados.')}
                    </li>
                    <li>
                      {t('For cross-border agreements, consult with legal counsel familiar with both jurisdictions to ensure compliance with local laws.', 
                        'Para acuerdos transfronterizos, consulte con un asesor legal familiarizado con ambas jurisdicciones para garantizar el cumplimiento de las leyes locales.')}
                    </li>
                    <li>
                      {t('Keep signed copies securely stored and ensure both parties receive fully executed original copies.', 
                        'Mantenga las copias firmadas almacenadas de forma segura y asegúrese de que ambas partes reciban copias originales completamente ejecutadas.')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="preview-panel">
            <div className="preview-header">
              {t('Live Preview', 'Vista Previa en Vivo')}
            </div>
            <div ref={previewRef} className="dual-column-preview">
              <table className="preview-table">
                <tbody>
                  {highlightedSections.map((section, index) => (
                    <tr 
                      key={index} 
                      className={`${section.isTitle ? 'title-row' : ''} ${section.isSignature ? 'signature-row' : ''}`}
                      ref={section.highlight ? highlightedRef : null}
                    >
                      <td className={`english-column ${section.highlight ? 'highlighted-text' : ''}`}>
                        {section.english}
                      </td>
                      <td className="separator"></td>
                      <td className={`spanish-column ${section.highlight ? 'highlighted-text' : ''}`}>
                        {section.spanish}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="navigation-buttons">
          <button
            onClick={prevTab}
            className="nav-button prev-button"
            disabled={currentTab === 0}
          >
            <Icon name="chevron-left" size={16} />
            {t('Previous', 'Anterior')}
          </button>
          
          <div style={{display: 'flex', gap: '10px'}}>
            <button
              onClick={copyToClipboard}
              className="nav-button"
              style={{backgroundColor: '#4f46e5', color: 'white'}}
            >
              <Icon name="copy" size={16} />
              {t('Copy to Clipboard', 'Copiar al Portapapeles')}
            </button>
            
            <button
              onClick={downloadAsWord}
              className="nav-button"
              style={{backgroundColor: '#2563eb', color: 'white'}}
            >
              <Icon name="file-text" size={16} />
              {t('Download MS Word', 'Descargar MS Word')}
            </button>
          </div>
          
          <button
            onClick={nextTab}
            className="nav-button next-button"
            disabled={currentTab === tabs.length - 1}
          >
            {t('Next', 'Siguiente')}
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));