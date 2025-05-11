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
    purpose: '',
    confidentialityType: 'broad',
    protectionPeriod: '2',
    terminationNoticeDays: '30',
    governingLaw: 'california',
    includeExclusions: true,
    includeNoWarranties: true,
    includeSeverability: true,
    includeLanguageClause: true
  });
  
  // State to track what was last changed for highlighting
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Ref for preview content
  const previewRef = React.useRef(null);
  
  // Translation function
  const t = (englishText, spanishText) => language === 'en' ? englishText : spanishText;
  
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Generate document text
  const generateDocumentText = () => {
    let text = `**NON-DISCLOSURE AGREEMENT                 ACUERDO DE CONFIDENCIALIDAD**

This Agreement is made by **${formData.disclosingPartyName || '[Disclosing Party Name]'}** (the "Disclosing Party"), and **${formData.receivingPartyName || '[Receiving Party Name]'}** (the "Receiving Party"). (each a "Party" and, collectively, the "Parties").

Este Acuerdo es celebrado por **${formData.disclosingPartyName || '[Nombre de la Parte Divulgadora]'}** (la "Parte Divulgadora"), y **${formData.receivingPartyName || '[Nombre de la Parte Receptora]'}** (la "Parte Receptora"). (cada una, una "Parte" y, en conjunto, las "Partes").

**1. EFFECTIVE DATE                       1. FECHA DE ENTRADA EN VIGOR**
The effective date of this Agreement is ${formData.effectiveDate || '[Effective Date]'}.
La fecha de entrada en vigor de este Acuerdo es ${formData.effectiveDate || '[Fecha de Entrada en Vigor]'}.

**2. CONFIDENTIAL INFORMATION             2. INFORMACIÓN CONFIDENCIAL**
"Confidential Information" disclosed under this Agreement is defined as ${getConfidentialityDefinition()}
"Información Confidencial" divulgada bajo este Acuerdo se define como ${getConfidentialityDefinitionSpanish()}

**3. TERM AND TERMINATION                 3. VIGENCIA Y TERMINACIÓN**
This Agreement shall remain in effect until it is terminated by a Party with ${formData.terminationNoticeDays} days prior written notice; provided, however, that no Party shall terminate this Agreement if the Parties have a direct agreement still in effect. The terms and conditions of this Agreement shall survive any such termination with respect to Confidential Information that is disclosed prior to the effective date of termination.

Este Acuerdo permanecerá vigente hasta que sea terminado por una Parte con ${formData.terminationNoticeDays} días de aviso previo por escrito; sin embargo, ninguna Parte podrá terminar este Acuerdo si las Partes tienen un acuerdo directo aún vigente. Los términos y condiciones de este Acuerdo sobrevivirán cualquier terminación con respecto a la Información Confidencial que se divulgue antes de la fecha efectiva de terminación.

**4. PERMITTED USE AND DISCLOSURE         4. USO Y DIVULGACIÓN PERMITIDOS**
Receiving Party will use Confidential Information only for the purpose of ${formData.purpose || '[Purpose of Disclosure]'}. Receiving Party may disclose Confidential Information to its directors, officers, employees, contractors, advisors, and agents, so long as such individuals have a need to know in their work for Receiving Party in furtherance of the potential or continued business transaction or relationship between the Parties, and are bound by obligations of confidentiality at least as restrictive as those imposed on Receiving Party in this Agreement, (collectively "Representatives"). Receiving Party is fully liable for any breach of this Agreement by its Representatives. Receiving Party will use the same degree of care, but no less than a reasonable degree of care, as the Receiving Party uses with respect to its own similar information to protect the Confidential Information. Receiving Party may only disclose confidential information as authorized by this Agreement.

La Parte Receptora utilizará la Información Confidencial únicamente para el propósito de ${formData.purpose || '[Propósito de la Divulgación]'}. La Parte Receptora podrá divulgar Información Confidencial a sus directores, funcionarios, empleados, contratistas, asesores y agentes, siempre que dichas personas tengan la necesidad de conocerla en su trabajo para la Parte Receptora en el desarrollo de la transacción comercial potencial o continua o relación entre las Partes, y estén sujetos a obligaciones de confidencialidad al menos tan restrictivas como las impuestas a la Parte Receptora en este Acuerdo (colectivamente, "Representantes"). La Parte Receptora es totalmente responsable de cualquier incumplimiento de este Acuerdo por parte de sus Representantes. La Parte Receptora utilizará el mismo grado de cuidado, pero no menos que un grado razonable de cuidado, que la Parte Receptora utiliza con respecto a su propia información similar para proteger la Información Confidencial. La Parte Receptora solo podrá divulgar información confidencial según lo autorizado por este Acuerdo.

**5. PROTECTION PERIOD AND RETURN         5. PERÍODO DE PROTECCIÓN Y DEVOLUCIÓN**
Unless the Parties otherwise agree in writing, a Receiving Party's duty to protect Confidential Information expires ${formData.protectionPeriod} years from the date of disclosure. Upon the Disclosing Party's written request, Receiving Party will promptly return or destroy all Confidential Information received from the Disclosing Party, together with all copies.

A menos que las Partes acuerden lo contrario por escrito, el deber de la Parte Receptora de proteger la Información Confidencial expira ${formData.protectionPeriod} años desde la fecha de divulgación. A solicitud escrita de la Parte Divulgadora, la Parte Receptora devolverá o destruirá prontamente toda la Información Confidencial recibida de la Parte Divulgadora, junto con todas las copias.

${formData.includeExclusions ? `**6. EXCLUSIONS                           6. EXCLUSIONES**
Confidential Information will not include any information that: (a) is or becomes part of the public domain through no fault of Receiving Party; (b) was rightfully in Receiving Party's possession at the time of disclosure, without restriction as to use or disclosure; or (c) Receiving Party rightfully receives from a third party who has the right to disclose it and who provides it without restriction as to use or disclosure.

La Información Confidencial no incluirá información que: (a) sea o se convierta en parte del dominio público sin culpa de la Parte Receptora; (b) estuviera legítimamente en posesión de la Parte Receptora al momento de la divulgación, sin restricción en cuanto a su uso o divulgación; o (c) la Parte Receptora reciba legítimamente de un tercero que tenga el derecho de divulgarla y que la proporcione sin restricción en cuanto a su uso o divulgación.

` : ''}${formData.includeNoWarranties ? `**7. NO WARRANTIES                        7. SIN GARANTÍAS**
The Confidential Information is provided with no warranties of any kind. The Disclosing Party is not liable for direct or indirect damages, which occur to the Receiving Party while using the Confidential Information. All Confidential Information disclosed will remain property of the Disclosing Party.

La Información Confidencial se proporciona sin garantías de ningún tipo. La Parte Divulgadora no es responsable de los daños directos o indirectos que ocurran a la Parte Receptora al usar la Información Confidencial. Toda la Información Confidencial divulgada seguirá siendo propiedad de la Parte Divulgadora.

` : ''}**8. GOVERNING LAW                        8. LEY APLICABLE**
This Agreement shall be governed by the law of ${getGoverningLaw()}. ${getJurisdiction()} is agreed upon as place of jurisdiction for all disputes arising from this Agreement.

Este Acuerdo se regirá por la ley de ${getGoverningLawSpanish()}. ${getJurisdictionSpanish()} se acuerda como lugar de jurisdicción para todas las disputas que surjan de este Acuerdo.

${formData.includeSeverability ? `**9. SEVERABILITY                         9. DIVISIBILIDAD**
If any provision of this Agreement is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions of this Agreement will remain in full force and effect, and the provision affected will be construed so as to be enforceable to the maximum extent permissible by law.

Si alguna disposición de este Acuerdo es considerada inválida o inejecutable por un tribunal de jurisdicción competente, las disposiciones restantes de este Acuerdo permanecerán en pleno vigor y efecto, y la disposición afectada se interpretará de manera que sea ejecutable en la máxima medida permitida por la ley.

` : ''}${formData.includeLanguageClause ? `**10. PREVAILING LANGUAGE                 10. IDIOMA PREDOMINANTE**
In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Spanish translation, the English version shall prevail.

En caso de cualquier conflicto, discrepancia, inconsistencia o ambigüedad entre la versión en inglés de este Acuerdo y la traducción al español, prevalecerá la versión en inglés.

` : ''}**IN WITNESS WHEREOF                      EN FE DE LO CUAL**
The Parties hereto have executed this Agreement.
Las Partes han ejecutado este Acuerdo.

**Disclosing Party / Parte Divulgadora:**

By: _________________________________    Por: _________________________________
Name: ______________________________     Nombre: ______________________________
Title:________________________________    Título: _______________________________
Date: _______________________________    Fecha: _______________________________

**Receiving Party / Parte Receptora:**

By: _________________________________    Por: _________________________________
Name: ______________________________     Nombre: ______________________________
Title:________________________________    Título: _______________________________
Date: _______________________________    Fecha: _______________________________`;
    
    return text;
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
    switch (formData.governingLaw) {
      case 'california': return 'the State of California, USA';
      case 'delaware': return 'the State of Delaware, USA';
      case 'newyork': return 'the State of New York, USA';
      case 'mexico': return 'Mexico';
      default: return 'the State of California, USA';
    }
  };
  
  const getGoverningLawSpanish = () => {
    switch (formData.governingLaw) {
      case 'california': return 'el Estado de California, EE.UU.';
      case 'delaware': return 'el Estado de Delaware, EE.UU.';
      case 'newyork': return 'el Estado de Nueva York, EE.UU.';
      case 'mexico': return 'México';
      default: return 'el Estado de California, EE.UU.';
    }
  };
  
  const getJurisdiction = () => {
    switch (formData.governingLaw) {
      case 'california': return 'Los Angeles, CA';
      case 'delaware': return 'Wilmington, DE';
      case 'newyork': return 'New York, NY';
      case 'mexico': return 'Mexico City';
      default: return 'Los Angeles, CA';
    }
  };
  
  const getJurisdictionSpanish = () => {
    switch (formData.governingLaw) {
      case 'california': return 'Los Ángeles, CA';
      case 'delaware': return 'Wilmington, DE';
      case 'newyork': return 'Nueva York, NY';
      case 'mexico': return 'Ciudad de México';
      default: return 'Los Ángeles, CA';
    }
  };
  
  // Determine which section to highlight based on last changed field
  const getSectionToHighlight = () => {
    switch (currentTab) {
      case 0: // Parties tab
        if (lastChanged === 'disclosingPartyName' || lastChanged === 'receivingPartyName') {
          return 'parties';
        }
        return null;
      case 1: // Key Terms tab
        if (lastChanged === 'effectiveDate') {
          return 'effectiveDate';
        }
        if (lastChanged === 'purpose' || lastChanged === 'confidentialityType') {
          return 'confidentiality';
        }
        if (lastChanged === 'protectionPeriod') {
          return 'protectionPeriod';
        }
        return null;
      case 2: // Options tab
        if (lastChanged === 'terminationNoticeDays') {
          return 'termination';
        }
        if (lastChanged === 'governingLaw') {
          return 'governingLaw';
        }
        return null;
      default:
        return null;
    }
  };
  
  // Create highlighted text
  const createHighlightedText = () => {
    const text = generateDocumentText();
    const sectionToHighlight = getSectionToHighlight();
    
    if (!sectionToHighlight) return text;
    
    // Define patterns for different sections
    const patterns = {
      parties: formData.receivingPartyName ? 
        new RegExp(`(\\*\\*${formData.disclosingPartyName}\\*\\*|\\*\\*${formData.receivingPartyName}\\*\\*)`, 'g') : 
        new RegExp(`(\\*\\*${formData.disclosingPartyName}\\*\\*)`, 'g'),
      effectiveDate: new RegExp(`(${formData.effectiveDate})`, 'g'),
      confidentiality: /("Confidential Information".*?)\./,
      protectionPeriod: new RegExp(`(${formData.protectionPeriod} years)`, 'g'),
      termination: new RegExp(`(${formData.terminationNoticeDays} days)`, 'g'),
      governingLaw: new RegExp(`(${getGoverningLaw()}|${getJurisdiction()})`, 'g')
    };
    
    if (patterns[sectionToHighlight]) {
      return text.replace(patterns[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return text;
  };
  
  // Scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastChanged, currentTab]);
  
  // Copy to clipboard
  const copyToClipboard = () => {
    const text = generateDocumentText().replace(/\*\*/g, ''); // Remove markdown
    navigator.clipboard.writeText(text).then(() => {
      alert(t('Document copied to clipboard!', '¡Documento copiado al portapapeles!'));
    });
  };
  
  // Download as Word
  const downloadAsWord = () => {
    try {
      const text = generateDocumentText();
      window.generateWordDoc(text, formData);
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
  
  const documentText = generateDocumentText();
  const highlightedText = createHighlightedText();
  
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
                  <label htmlFor="purpose">{t('Purpose of Disclosure', 'Propósito de la Divulgación')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('Specific business purpose for sharing information', 'Propósito comercial específico para compartir información')}
                    </div>
                  </div>
                </div>
                <textarea
                  id="purpose"
                  name="purpose"
                  className="form-control"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows="2"
                  placeholder={t('e.g., evaluating potential business partnership', 'ej., evaluar una posible asociación comercial')}
                />
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
                {formData.protectionPeriod > 5 && (
                  <div className="warning-text">
                    {t('⚠️ Protection periods over 5 years may be unenforceable', '⚠️ Los períodos de protección de más de 5 años pueden ser inejecutables')}
                  </div>
                )}
              </div>
            </div>
            
            {/* Options Tab */}
            <div className={`tab-content ${currentTab === 2 ? 'active' : ''}`}>
              <h2>{t('Additional Options', 'Opciones Adicionales')}</h2>
              
              <div className="form-group">
                <div className="label-with-help">
                  <label htmlFor="terminationNoticeDays">{t('Termination Notice (days)', 'Aviso de Terminación (días)')}</label>
                  <div className="help-icon">
                    <Icon name="help-circle" size={16} />
                    <div className="tooltip">
                      {t('Days of notice required to terminate', 'Días de aviso requeridos para terminar')}
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  id="terminationNoticeDays"
                  name="terminationNoticeDays"
                  className="form-control"
                  value={formData.terminationNoticeDays}
                  onChange={handleChange}
                  min="1"
                  max="90"
                />
              </div>
              
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
                  <option value="california">{t('California', 'California')}</option>
                  <option value="delaware">{t('Delaware', 'Delaware')}</option>
                  <option value="newyork">{t('New York', 'Nueva York')}</option>
                  <option value="mexico">{t('Mexico', 'México')}</option>
                </select>
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
                
                <div className={`summary-item ${formData.protectionPeriod > 5 ? 'risky' : 'safe'}`}>
                  <span className="summary-label">{t('Protection Period', 'Período de Protección')}</span>
                  {formData.protectionPeriod} {t('years', 'años')}
                  {formData.protectionPeriod > 5 && t(' - May be unenforceable', ' - Puede ser inejecutable')}
                </div>
                
                <div className={`summary-item ${formData.governingLaw === 'mexico' ? 'moderate' : 'safe'}`}>
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
                {formData.protectionPeriod > 5 && (
                  <p className="warning-text">
                    {t('Long protection period may be difficult to enforce in court.', 'Un período de protección largo puede ser difícil de hacer cumplir en los tribunales.')}
                  </p>
                )}
                {!formData.includeExclusions && (
                  <p className="warning-text">
                    {t('Without standard exclusions, even public information might be considered confidential.', 'Sin exclusiones estándar, incluso la información pública podría considerarse confidencial.')}
                  </p>
                )}
                {formData.governingLaw === 'mexico' && formData.includeLanguageClause && (
                  <p className="warning-text">
                    {t('Mexican law with English language preference may cause enforcement issues.', 'La ley mexicana con preferencia del idioma inglés puede causar problemas de aplicación.')}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="preview-panel">
            <div className="preview-header">
              {t('Live Preview', 'Vista Previa en Vivo')}
            </div>
            <div ref={previewRef}>
              <pre 
                className="document-preview"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
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