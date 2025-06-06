// Main React component for the Dual-Language Independent Contractor Agreement Generator
const App = () => {
  // Define state
  const [currentLanguage, setCurrentLanguage] = React.useState('english');
  const [currentTab, setCurrentTab] = React.useState('parties');
  const [formData, setFormData] = React.useState({
    // Company Information
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZip: '',
    companyCountry: 'USA',
    
    // Contractor Information
    contractorName: '',
    contractorAddress: '',
    contractorCity: '',
    contractorState: '',
    contractorZip: '',
    contractorCountry: 'USA',
    
    // Agreement Details
    effectiveDate: '',
    servicesDescription: '',
    compensationType: 'hourly',
    hourlyRate: '',
    fixedAmount: '',
    paymentTerms: '30',
    
    // Additional Terms
    terminationNoticeDays: '30',
    governingLaw: 'california',
    includeIPAssignment: true,
    includeConfidentiality: true,
    includeNonSolicitation: true,
    nonSolicitationPeriod: '1',
    includeIndemnification: true,
    includeLiabilityInsurance: true,
    includeWorkEquipment: true,
    
    // Controlling Language
    controllingLanguage: 'english',
  });
  
  // Track what was last changed for highlighting
  const [lastChanged, setLastChanged] = React.useState(null);
  const previewRef = React.useRef(null);  
  // Define tabs
  const tabs = [
    { id: 'parties', labelEn: 'Parties', labelRu: 'Стороны' },
    { id: 'services', labelEn: 'Services & Payment', labelRu: 'Услуги и Оплата' },
    { id: 'terms', labelEn: 'Terms', labelRu: 'Условия' },
    { id: 'additional', labelEn: 'Additional', labelRu: 'Дополнительно' },
    { id: 'summary', labelEn: 'Summary', labelRu: 'Итог' }
  ];
  
  // Handle language toggle
  const toggleLanguage = (language) => {
    setCurrentLanguage(language);
  };
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
  };
  
  // Handle form input changes
  const handleChange = React.useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setLastChanged(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);
  
  // Navigation functions
  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };
  
  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    }
  };  
  // Copy document to clipboard
  const copyToClipboard = async () => {
    try {
      const documentText = generateDocumentText();
      await navigator.clipboard.writeText(documentText);
      alert('Document copied to clipboard successfully!');
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Failed to copy document. Please try selecting the text manually.');
    }
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    window.generateWordDoc(formData);
  };
  
  // Schedule consultation
  const scheduleConsult = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});
    } else {
      window.open('https://terms.law/call/', '_blank');
    }
  };
  
  // Generate document text
  const generateDocumentText = () => {
    const isEnglish = currentLanguage === 'english';
    let text = '';
    
    // Title
    text += isEnglish ? 'INDEPENDENT CONTRACTOR AGREEMENT\n\n' : 'ДОГОВОР НЕЗАВИСИМОГО ПОДРЯДЧИКА\n\n';
    
    // Parties
    const effectiveDate = formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString(isEnglish ? 'en-US' : 'ru-RU') : (isEnglish ? '[Date]' : '[Дата]');
    const companyAddress = [formData.companyAddress, formData.companyCity, formData.companyState, formData.companyZip].filter(Boolean).join(', ') || (isEnglish ? '[Company Address]' : '[Адрес Компании]');
    const contractorAddress = [formData.contractorAddress, formData.contractorCity, formData.contractorState, formData.contractorZip].filter(Boolean).join(', ') || (isEnglish ? '[Contractor Address]' : '[Адрес Подрядчика]');
    
    if (isEnglish) {
      text += `This Independent Contractor Agreement ("Agreement") is entered into as of ${effectiveDate} between ${formData.companyName || '[Company Name]'}, located at ${companyAddress} ("Company"), and ${formData.contractorName || '[Contractor Name]'}, located at ${contractorAddress} ("Contractor").\n\n`;
    } else {
      text += `Настоящий Договор Независимого Подрядчика ("Договор") заключен ${effectiveDate} между ${formData.companyName || '[Название Компании]'}, расположенной по адресу ${companyAddress} ("Компания"), и ${formData.contractorName || '[Имя Подрядчика]'}, расположенным по адресу ${contractorAddress} ("Подрядчик").\n\n`;
    }    
    // Services section
    text += isEnglish ? '1. SERVICES\n\n' : '1. УСЛУГИ\n\n';
    if (isEnglish) {
      text += `Contractor agrees to perform the following services for Company ("Services"): ${formData.servicesDescription || '[Description of services]'}. Contractor shall perform the Services in a professional and workmanlike manner.\n\n`;
    } else {
      text += `Подрядчик обязуется выполнять следующие услуги для Компании ("Услуги"): ${formData.servicesDescription || '[Описание услуг]'}. Подрядчик должен выполнять Услуги профессионально и качественно.\n\n`;
    }
    
    // Compensation section
    text += isEnglish ? '2. COMPENSATION\n\n' : '2. ОПЛАТА\n\n';
    if (formData.compensationType === 'hourly') {
      if (isEnglish) {
        text += `Company shall pay Contractor at the rate of $${formData.hourlyRate || '[Rate]'} per hour. `;
      } else {
        text += `Компания будет платить Подрядчику по ставке $${formData.hourlyRate || '[Ставка]'} в час. `;
      }
    } else if (formData.compensationType === 'fixed') {
      if (isEnglish) {
        text += `Company shall pay Contractor a fixed fee of $${formData.fixedAmount || '[Amount]'}. `;
      } else {
        text += `Компания выплатит Подрядчику фиксированную сумму в размере $${formData.fixedAmount || '[Сумма]'}. `;
      }
    }
    
    if (isEnglish) {
      text += `Payment shall be made within ${formData.paymentTerms || '30'} days of receipt of invoice.\n\n`;
    } else {
      text += `Оплата должна быть произведена в течение ${formData.paymentTerms || '30'} дней после получения счета.\n\n`;
    }
    
    // Independent Contractor status
    text += isEnglish ? '3. INDEPENDENT CONTRACTOR RELATIONSHIP\n\n' : '3. СТАТУС НЕЗАВИСИМОГО ПОДРЯДЧИКА\n\n';
    if (isEnglish) {
      text += 'Contractor is an independent contractor and nothing in this Agreement shall be construed as creating an employer-employee relationship. Contractor shall be solely responsible for all taxes and withholdings.\n\n';
    } else {
      text += 'Подрядчик является независимым подрядчиком, и ничто в настоящем Договоре не должно толковаться как создание трудовых отношений. Подрядчик несет полную ответственность за все налоги и удержания.\n\n';
    }
    
    // Term and Termination
    text += isEnglish ? '4. TERM AND TERMINATION\n\n' : '4. СРОК И РАСТОРЖЕНИЕ\n\n';
    if (isEnglish) {
      text += `Either party may terminate this Agreement upon ${formData.terminationNoticeDays || '30'} days written notice to the other party.\n\n`;
    } else {
      text += `Любая сторона может расторгнуть настоящий Договор, предоставив письменное уведомление за ${formData.terminationNoticeDays || '30'} дней другой стороне.\n\n`;
    }    
    // Optional sections
    let sectionNumber = 5;
    
    if (formData.includeIPAssignment) {
      text += isEnglish ? `${sectionNumber}. INTELLECTUAL PROPERTY\n\n` : `${sectionNumber}. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ\n\n`;
      if (isEnglish) {
        text += 'All work product created by Contractor in connection with the Services shall be the sole and exclusive property of Company.\n\n';
      } else {
        text += 'Все результаты работы, созданные Подрядчиком в связи с Услугами, являются исключительной собственностью Компании.\n\n';
      }
      sectionNumber++;
    }
    
    if (formData.includeConfidentiality) {
      text += isEnglish ? `${sectionNumber}. CONFIDENTIALITY\n\n` : `${sectionNumber}. КОНФИДЕНЦИАЛЬНОСТЬ\n\n`;
      if (isEnglish) {
        text += 'Contractor agrees to maintain the confidentiality of all Company information and not to disclose such information to third parties.\n\n';
      } else {
        text += 'Подрядчик обязуется сохранять конфиденциальность всей информации Компании и не разглашать такую информацию третьим лицам.\n\n';
      }
      sectionNumber++;
    }
    
    if (formData.includeNonSolicitation) {
      text += isEnglish ? `${sectionNumber}. NON-SOLICITATION\n\n` : `${sectionNumber}. ЗАПРЕТ НА ПЕРЕМАНИВАНИЕ\n\n`;
      if (isEnglish) {
        text += `During the term of this Agreement and for ${formData.nonSolicitationPeriod || '1'} year(s) thereafter, Contractor shall not solicit Company employees.\n\n`;
      } else {
        text += `В течение срока действия настоящего Договора и в течение ${formData.nonSolicitationPeriod || '1'} года(лет) после его окончания, Подрядчик не должен переманивать сотрудников Компании.\n\n`;
      }
      sectionNumber++;
    }
    
    if (formData.includeIndemnification) {
      text += isEnglish ? `${sectionNumber}. INDEMNIFICATION\n\n` : `${sectionNumber}. ВОЗМЕЩЕНИЕ УБЫТКОВ\n\n`;
      if (isEnglish) {
        text += 'Contractor shall indemnify and hold harmless Company from any claims arising out of Contractor\'s performance of the Services.\n\n';
      } else {
        text += 'Подрядчик обязуется возместить убытки и оградить Компанию от любых претензий, возникающих в результате выполнения Подрядчиком Услуг.\n\n';
      }
      sectionNumber++;
    }    
    if (formData.includeLiabilityInsurance) {
      text += isEnglish ? `${sectionNumber}. LIABILITY INSURANCE\n\n` : `${sectionNumber}. СТРАХОВАНИЕ ОТВЕТСТВЕННОСТИ\n\n`;
      if (isEnglish) {
        text += 'Contractor shall maintain adequate liability insurance to protect against claims arising from performance of the Services.\n\n';
      } else {
        text += 'Подрядчик должен поддерживать адекватное страхование ответственности для защиты от претензий, возникающих при выполнении Услуг.\n\n';
      }
      sectionNumber++;
    }
    
    if (formData.includeWorkEquipment) {
      text += isEnglish ? `${sectionNumber}. EQUIPMENT AND EXPENSES\n\n` : `${sectionNumber}. ОБОРУДОВАНИЕ И РАСХОДЫ\n\n`;
      if (isEnglish) {
        text += 'Contractor shall provide all equipment and supplies necessary to perform the Services at Contractor\'s own expense.\n\n';
      } else {
        text += 'Подрядчик должен предоставить все оборудование и материалы, необходимые для выполнения Услуг, за свой счет.\n\n';
      }
      sectionNumber++;
    }
    
    // Governing Law
    text += isEnglish ? `${sectionNumber}. GOVERNING LAW\n\n` : `${sectionNumber}. ПРИМЕНИМОЕ ПРАВО\n\n`;
    const lawState = formData.governingLaw === 'california' ? (isEnglish ? 'California' : 'Калифорнии') : formData.governingLaw;
    if (isEnglish) {
      text += `This Agreement shall be governed by the laws of ${lawState}.\n\n`;
    } else {
      text += `Настоящий Договор регулируется законодательством ${lawState}.\n\n`;
    }
    
    // Controlling Language
    text += isEnglish ? 'CONTROLLING LANGUAGE\n\n' : 'ПРЕИМУЩЕСТВЕННЫЙ ЯЗЫК\n\n';
    if (isEnglish) {
      text += `In case of any conflict between the English and Russian versions, the ${formData.controllingLanguage === 'english' ? 'English' : 'Russian'} version shall prevail.\n\n`;
    } else {
      text += `В случае расхождений между английской и русской версиями, ${formData.controllingLanguage === 'english' ? 'английская' : 'русская'} версия имеет преимущественную силу.\n\n`;
    }
    
    // Signatures
    text += isEnglish ? 'SIGNATURES\n\n' : 'ПОДПИСИ\n\n';
    text += isEnglish ? 'COMPANY:\n\n' : 'КОМПАНИЯ:\n\n';
    text += 'By: _______________________________\n';
    text += 'Name: _____________________________\n';
    text += 'Title: ____________________________\n';
    text += 'Date: _____________________________\n\n';
    
    text += isEnglish ? 'CONTRACTOR:\n\n' : 'ПОДРЯДЧИК:\n\n';
    text += 'By: _______________________________\n';
    text += 'Name: _____________________________\n';
    text += 'Date: _____________________________\n';
    
    return text;
  };  
  // Help icon component
  const HelpIcon = ({ tooltip }) => (
    <span className="help-icon">
      ?
      <span className="help-tooltip">
        {tooltip}
      </span>
    </span>
  );
  
  // Educational content for tooltips
  const educationalContent = {
    english: {
      companyInfo: "The company hiring the contractor. Use the full legal name and registered address.",
      contractorInfo: "The individual or entity providing services. Use full legal name and current address.",
      servicesDescription: "Clearly describe the services to be provided. Be specific to avoid disputes.",
      compensationType: "Choose how the contractor will be paid. Hourly is common for ongoing work, fixed for specific projects.",
      paymentTerms: "Standard is Net 30 (payment within 30 days of invoice). Shorter terms may be negotiated.",
      terminationNotice: "Notice period required to end the agreement. 30 days is standard but can be adjusted.",
      ipAssignment: "Ensures work product belongs to the company. Critical for creative or technical work.",
      confidentiality: "Protects company information. Essential for contractors with access to sensitive data.",
      nonSolicitation: "Prevents contractor from recruiting company employees. Standard period is 1-2 years.",
      indemnification: "Contractor takes responsibility for their work. Important for liability protection.",
      workEquipment: "Clarifies who provides tools and equipment. Important for tax classification.",
      liabilityInsurance: "Requires contractor to carry insurance. Protects both parties from claims.",
      controllingLanguage: "Determines which language version prevails in case of conflicts."
    },
    russian: {
      companyInfo: "Компания, нанимающая подрядчика. Используйте полное юридическое название и зарегистрированный адрес.",
      contractorInfo: "Физическое или юридическое лицо, предоставляющее услуги. Используйте полное имя и текущий адрес.",
      servicesDescription: "Четко опишите предоставляемые услуги. Будьте конкретны, чтобы избежать споров.",
      compensationType: "Выберите способ оплаты подрядчика. Почасовая оплата распространена для текущей работы, фиксированная - для конкретных проектов.",
      paymentTerms: "Стандарт - 30 дней (оплата в течение 30 дней после выставления счета). Более короткие сроки могут быть согласованы.",
      terminationNotice: "Период уведомления, необходимый для расторжения соглашения. 30 дней - стандарт, но может быть изменен.",
      ipAssignment: "Гарантирует, что результаты работы принадлежат компании. Критично для творческой или технической работы.",
      confidentiality: "Защищает информацию компании. Важно для подрядчиков с доступом к конфиденциальным данным.",
      nonSolicitation: "Запрещает подрядчику переманивать сотрудников компании. Стандартный период - 1-2 года.",
      indemnification: "Подрядчик берет ответственность за свою работу. Важно для защиты от ответственности.",
      workEquipment: "Уточняет, кто предоставляет инструменты и оборудование. Важно для налоговой классификации.",
      liabilityInsurance: "Требует от подрядчика иметь страховку. Защищает обе стороны от претензий.",
      controllingLanguage: "Определяет, какая языковая версия имеет преимущество в случае расхождений."
    }
  };