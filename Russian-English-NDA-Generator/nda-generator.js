// Main React component for the Dual-Language NDA Generator
const App = () => {
  // Define state
  const [currentLanguage, setCurrentLanguage] = React.useState('english');
  const [currentTab, setCurrentTab] = React.useState('parties');
  const [lastChangedField, setLastChangedField] = React.useState(null);
  const [formData, setFormData] = React.useState({
    discloserName: '',
    discloserAddress: '',
    recipientName: '',
    recipientAddress: '',
    effectiveDate: '',
    purpose: '',
    customPurpose: '',
    confInfoType: 'broad',
    customConfInfo: '',
    protectionPeriod: 2,
    terminationNotice: 30,
    governingLaw: 'california',
    customGoverningLaw: '',
    jurisdiction: 'los-angeles',
    customJurisdiction: '',
    includeReturnDestroy: true,
    includeNoWarranty: true,
    includeSeverability: true,
    controllingLanguage: 'english',
  });
  
  // Preview section ref for scrolling
  const previewRef = React.useRef(null);
  
  // Define tabs 
  const tabs = [
    { id: 'parties', labelEn: 'Parties', labelRu: 'Стороны' },
    { id: 'agreement', labelEn: 'Agreement', labelRu: 'Соглашение' },
    { id: 'term', labelEn: 'Term & Jurisdiction', labelRu: 'Срок и Юрисдикция' },
    { id: 'additional', labelEn: 'Additional Terms', labelRu: 'Дополнительн.' }
  ];
  
  // Purpose dropdown options
  const purposeOptions = {
    english: [
      { value: 'evaluation', label: 'Evaluation of potential business relationship' },
      { value: 'partnership', label: 'Partnership discussion' },
      { value: 'investment', label: 'Investment opportunity evaluation' },
      { value: 'acquisition', label: 'Merger or acquisition discussions' },
      { value: 'licensing', label: 'Technology licensing negotiations' },
      { value: 'joint-venture', label: 'Joint venture exploration' },
      { value: 'custom', label: 'Custom (specify below)' }
    ],
    russian: [
      { value: 'evaluation', label: 'Оценка потенциальных деловых отношений' },
      { value: 'partnership', label: 'Обсуждение партнерства' },
      { value: 'investment', label: 'Оценка инвестиционных возможностей' },
      { value: 'acquisition', label: 'Обсуждение слияния или поглощения' },
      { value: 'licensing', label: 'Переговоры о лицензировании технологий' },
      { value: 'joint-venture', label: 'Изучение совместного предприятия' },
      { value: 'custom', label: 'Другое (укажите ниже)' }
    ]
  };
  
  // Definition summaries
  const definitionSummaries = {
    english: {
      broad: "Includes all information that should reasonably be considered confidential, even if not explicitly marked",
      medium: "Covers non-public business information, trade secrets, and technical data related to business operations",
      narrow: "Only protects information explicitly marked as confidential in writing or confirmed as confidential within 30 days",
      custom: "Your own specific definition of what constitutes confidential information"
    },
    russian: {
      broad: "Включает всю информацию, которая разумно должна считаться конфиденциальной, даже если явно не обозначена",
      medium: "Охватывает непубличную деловую информацию, коммерческие тайны и технические данные, связанные с деятельностью",
      narrow: "Защищает только информацию, явно обозначенную как конфиденциальная в письменной форме или подтвержденную в течение 30 дней",
      custom: "Ваше собственное определение того, что является конфиденциальной информацией"
    }
  };
  
  // Purpose explainers
  const purposeExplainers = {
    english: {
      evaluation: "Confidential information can only be used to evaluate a potential business relationship and for no other purpose",
      partnership: "Confidential information can only be used for partnership discussions and related due diligence",
      investment: "Confidential information can only be used to evaluate investment opportunities and related financial analysis",
      acquisition: "Confidential information can only be used for merger/acquisition discussions and due diligence",
      licensing: "Confidential information can only be used for technology licensing negotiations and evaluation",
      'joint-venture': "Confidential information can only be used to explore joint venture opportunities",
      custom: "Confidential information can only be used for the specific purpose you define below"
    },
    russian: {
      evaluation: "Конфиденциальная информация может использоваться только для оценки потенциальных деловых отношений",
      partnership: "Конфиденциальная информация может использоваться только для обсуждения партнерства и связанной проверки",
      investment: "Конфиденциальная информация может использоваться только для оценки инвестиционных возможностей",
      acquisition: "Конфиденциальная информация может использоваться только для обсуждения слияния/поглощения",
      licensing: "Конфиденциальная информация может использоваться только для переговоров о лицензировании технологий",
      'joint-venture': "Конфиденциальная информация может использоваться только для изучения возможностей совместного предприятия",
      custom: "Конфиденциальная информация может использоваться только для конкретной цели, указанной ниже"
    }
  };
  
  // Handle language toggle
  const toggleLanguage = (language) => {
    setCurrentLanguage(language);
  };
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
  };
  
  // Handle form input changes with highlighting
  const handleChange = React.useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setLastChangedField(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Trigger highlighting after state update
    setTimeout(() => {
      highlightChanges(name, value);
    }, 100);
  }, []);
  
  // Function to highlight changes in preview
  const highlightChanges = (fieldName, value) => {
    const previewDoc = document.getElementById('preview-document');
    if (!previewDoc) return;
    
    // Remove existing highlights
    const existingHighlights = previewDoc.querySelectorAll('.highlight');
    existingHighlights.forEach(el => {
      el.classList.remove('highlight');
    });
    
    let targetElement = null;
    
    // Find what to highlight based on field
    switch(fieldName) {
      case 'discloserName':
      case 'recipientName':
        const nameElements = previewDoc.querySelectorAll('strong');
        nameElements.forEach(el => {
          if (el.textContent === value) {
            targetElement = el;
            el.classList.add('highlight');
          }
        });
        break;
        
      case 'effectiveDate':
        const sections = previewDoc.querySelectorAll('.section-row');
        sections.forEach(section => {
          if (section.textContent.includes('EFFECTIVE DATE') || section.textContent.includes('ДАТА ВСТУПЛЕНИЯ')) {
            targetElement = section;
            section.classList.add('highlight');
          }
        });
        break;
        
      case 'confInfoType':
        const confSections = previewDoc.querySelectorAll('.section-row');
        confSections.forEach(section => {
          if (section.textContent.includes('CONFIDENTIAL INFORMATION') || section.textContent.includes('КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ')) {
            targetElement = section;
            section.classList.add('highlight');
          }
        });
        break;
        
      case 'purpose':
      case 'customPurpose':
        const purposeSections = previewDoc.querySelectorAll('.section-row');
        purposeSections.forEach(section => {
          if (section.textContent.includes('PERMITTED USE') || section.textContent.includes('ДОПУСТИМОЕ ИСПОЛЬЗОВАНИЕ')) {
            targetElement = section;
            section.classList.add('highlight');
          }
        });
        break;
        
      case 'governingLaw':
      case 'customGoverningLaw':
        const govSections = previewDoc.querySelectorAll('.section-row');
        govSections.forEach(section => {
          if (section.textContent.includes('GOVERNING LAW') || section.textContent.includes('ПРИМЕНИМОЕ ПРАВО')) {
            targetElement = section;
            section.classList.add('highlight');
          }
        });
        break;
    }
    
    // Scroll to highlight if found
    if (targetElement && !isElementInViewport(targetElement)) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Remove highlights after 3 seconds
    setTimeout(() => {
      const highlights = previewDoc.querySelectorAll('.highlight');
      highlights.forEach(el => {
        el.classList.remove('highlight');
      });
    }, 3000);
  };
  
  // Check if element is in viewport
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const preview = document.querySelector('.preview-section');
    const previewRect = preview.getBoundingClientRect();
    
    return (
      rect.top >= previewRect.top &&
      rect.bottom <= previewRect.bottom
    );
  };
  
  // Handle navigation (previous/next buttons)
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
  const copyToClipboard = () => {
    const docText = document.getElementById('preview-document').innerText;
    
    navigator.clipboard.writeText(docText)
      .then(() => {
        alert('Document copied to clipboard successfully!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy document to clipboard. Please try again.');
      });
  };
  
  // Download as Word document
  const downloadAsWord = () => {
    window.generateWordDoc(formData);
  };
  
  // Templates for NDA content in both languages
  const templates = {
    english: {
      title: "NON-DISCLOSURE AGREEMENT",
      parties: (discloserName, discloserAddress, recipientName, recipientAddress) => {
        return `This Agreement is made by <strong>${discloserName || '[Disclosing Party Name]'}</strong>, located at ${discloserAddress || '[Disclosing Party Address]'} (the "Disclosing Party"), and <strong>${recipientName || '[Receiving Party Name]'}</strong>, located at ${recipientAddress || '[Receiving Party Address]'} (the "Receiving Party"). (each a "Party" and, collectively, the "Parties").`;
      },
      effectiveDate: (effectiveDate) => {
        const formattedDate = effectiveDate ? new Date(effectiveDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        }) : '[Effective Date]';
        
        return `<div class="section-title">1. EFFECTIVE DATE</div>
The effective date of this Agreement is ${formattedDate}.`;
      },
      confidentialInfo: {
        broad: `<div class="section-title">2. CONFIDENTIAL INFORMATION</div>
"Confidential Information" disclosed under this Agreement is defined as any information, technical data or know-how furnished, whether in written, oral, electronic or other form by the Disclosing Party to the Receiving Party that (a) is marked, accompanied or supported by documents clearly and conspicuously designating such documents as "confidential", "internal use" or the equivalent; (b) is identified by the Disclosing Party as confidential before, during or promptly after the presentation or communication; or (c) should reasonably be known by Receiving Party to be confidential.`,
        
        medium: `<div class="section-title">2. CONFIDENTIAL INFORMATION</div>
"Confidential Information" disclosed under this Agreement is defined as any non-public information that relates to the actual or anticipated business or research and development of the Disclosing Party, technical data, trade secrets or know-how, including, but not limited to, research, product plans, products, services, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, marketing, finances or other business information disclosed by the Disclosing Party either directly or indirectly in writing, orally or by inspection of parts or equipment.`,
        
        narrow: `<div class="section-title">2. CONFIDENTIAL INFORMATION</div>
"Confidential Information" disclosed under this Agreement is defined as only that information which is (a) disclosed in writing and marked as confidential at the time of disclosure, or (b) disclosed in any other manner and identified as confidential at the time of disclosure and also summarized and designated as confidential in a written memorandum delivered to the Receiving Party within thirty (30) days of the disclosure.`,
        
        custom: (customText) => {
          return `<div class="section-title">2. CONFIDENTIAL INFORMATION</div>
${customText || '[Custom Confidentiality Definition]'}`;
        }
      },
      term: (terminationNotice) => {
        return `<div class="section-title">3. TERM AND TERMINATION</div>
This Agreement shall remain in effect until it is terminated by a Party with ${terminationNotice} days prior written notice; provided, however, that no Party shall terminate this Agreement if the Parties have a direct agreement still in effect. The terms and conditions of this Agreement shall survive any such termination with respect to Confidential Information that is disclosed prior to the effective date of termination.`;
      },
      
      permittedUse: (purpose) => {
        // Handle different purpose types
        let purposeText = '[Purpose of Disclosure]';
        if (purpose && purpose !== 'custom') {
          const option = purposeOptions.english.find(opt => opt.value === purpose);
          purposeText = option ? option.label.toLowerCase() : purpose;
        } else if (purpose === 'custom' && formData.customPurpose) {
          purposeText = formData.customPurpose;
        }
        
        return `<div class="section-title">4. PERMITTED USE AND DISCLOSURE</div>
Receiving Party will use Confidential Information only for the purpose of and in connection with ${purposeText} between the Parties. Receiving Party may disclose Confidential Information to its directors, officers, employees, contractors, advisors, and agents, so long as such individuals have a need to know in their work for Receiving Party in furtherance of the potential or continued business transaction or relationship between the Parties, and are bound by obligations of confidentiality at least as restrictive as those imposed on Receiving Party in this Agreement, (collectively "Representatives"). Receiving Party is fully liable for any breach of this Agreement by its Representatives. Receiving Party will use the same degree of care, but no less than a reasonable degree of care, as the Receiving Party uses with respect to its own similar information to protect the Confidential Information. Receiving Party may only disclose confidential information as authorized by this Agreement.`;
      },
      
      protectionPeriod: (protectionPeriod) => {
        return `<div class="section-title">5. PROTECTION PERIOD AND RETURN</div>
Unless the Parties otherwise agree in writing, a Receiving Party's duty to protect Confidential Information expires ${protectionPeriod} years from the date of disclosure. Upon the Disclosing Party's written request, Receiving Party will promptly return or destroy all Confidential Information received from the Disclosing Party, together with all copies.`;
      },
      
      exclusions: `<div class="section-title">6. EXCLUSIONS</div>
Confidential Information will not include any information that: (a) is or becomes part of the public domain through no fault of Receiving Party; (b) was rightfully in Receiving Party's possession at the time of disclosure, without restriction as to use or disclosure; or (c) Receiving Party rightfully receives from a third party who has the right to disclose it and who provides it without restriction as to use or disclosure.`,
      
      noWarranty: `<div class="section-title">7. NO WARRANTIES</div>
The Confidential Information is provided with no warranties of any kind. The Disclosing Party is not liable for direct or indirect damages, which occur to the Receiving Party while using the Confidential Information. All Confidential Information disclosed will remain property of the Disclosing Party.`,
      
      governingLaw: {
        california: `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of the State of California, USA. Los Angeles, CA is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`,
        
        delaware: `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of the State of Delaware, USA. Wilmington, DE is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`,
        
        newyork: `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of the State of New York, USA. New York, NY is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`,
        
        russia: `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of the Russian Federation. Moscow, Russia is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`,
        
        other: (customLaw, customJurisdiction) => {
          return `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of ${customLaw || '[Governing Law]'}. ${customJurisdiction || '[Jurisdiction]'} is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`;
        }
      },
      
      severability: `<div class="section-title">9. SEVERABILITY</div>
If any provision of this Agreement is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions of this Agreement will remain in full force and effect, and the provision affected will be construed so as to be enforceable to the maximum extent permissible by law.`,
      
      controllingLanguage: {
        english: `<div class="section-title">10. PREVAILING LANGUAGE</div>
In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, the English version shall prevail.`,
        
        russian: `<div class="section-title">10. PREVAILING LANGUAGE</div>
In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, the Russian version shall prevail.`
      },
      
      signatures: `<div class="section-title">IN WITNESS WHEREOF</div>
The Parties hereto have executed this Agreement.

<div class="signatures">
<strong>Disclosing Party:</strong>

By: _________________________________
Name: ______________________________
Title:________________________________
Date: _______________________________

<strong>Receiving Party:</strong>

By: _________________________________
Name: ______________________________
Title:________________________________
Date: _______________________________
</div>`
    },
    
    russian: {
      title: "СОГЛАШЕНИЕ О НЕРАЗГЛАШЕНИИ ИНФОРМАЦИИ",
      parties: (discloserName, discloserAddress, recipientName, recipientAddress) => {
        return `Это Соглашение заключено между <strong>${discloserName || '[Disclosing Party Name]'}</strong>, расположенным по адресу ${discloserAddress || '[Адрес Раскрывающей Стороны]'} ("Раскрывающая Сторона") и <strong>${recipientName || '[Receiving Party Name]'}</strong>, расположенным по адресу ${recipientAddress || '[Адрес Получателя]'} ("Получатель"). (далее вместе именуемые "Стороны", а каждая в отдельности – "Сторона").`;
      },
      effectiveDate: (effectiveDate) => {
        const formattedDate = effectiveDate ? new Date(effectiveDate).toLocaleDateString('ru-RU', {
          year: 'numeric', month: 'long', day: 'numeric'
        }) : '[Effective Date]';
        
        return `<div class="section-title">1. ДАТА ВСТУПЛЕНИЯ В СИЛУ</div>
Дата вступления в силу настоящего Соглашения ${formattedDate}.`;
      },
      confidentialInfo: {
        broad: `<div class="section-title">2. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</div>
"Конфиденциальная Информация" по данному Соглашению означает любую информацию, технические спецификации или ноу-хау, раскрытые в письменной, устной, электронной или другой форме Раскрывающей Стороной Получателю, которые (а) помечены, сопровождены или подпадают под действие документов ясно помеченных "конфиденциально", "для внутреннего пользования" и т.п.; (b) обозначены как конфиденциальные Раскрывающей Стороной до, во время или после раскрытия или сообщения; или (c) конфиденьциальность которых Получатель должен осознать.`,
        
        medium: `<div class="section-title">2. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</div>
"Конфиденциальная Информация" по данному Соглашению означает любую непубличную информацию, которая относится к фактической или ожидаемой деловой деятельности или исследованиям и разработкам Раскрывающей Стороны, техническим данным, коммерческой тайне или ноу-хау, включая, помимо прочего, исследования, планы продуктов, продукты, услуги, списки клиентов, рынки, программное обеспечение, разработки, изобретения, процессы, формулы, технологии, дизайны, чертежи, инженерные решения, маркетинг, финансы или другую деловую информацию, раскрытую Раскрывающей Стороной прямо или косвенно в письменной форме, устно или путем осмотра деталей или оборудования.`,
        
        narrow: `<div class="section-title">2. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</div>
"Конфиденциальная Информация" по данному Соглашению означает только ту информацию, которая (а) раскрыта в письменной форме и помечена как конфиденциальная в момент раскрытия, или (б) раскрыта любым другим способом и обозначена как конфиденциальная в момент раскрытия, а также резюмирована и обозначена как конфиденциальная в письменном меморандуме, направленном Получателю в течение тридцати (30) дней после раскрытия.`,
        
        custom: (customText) => {
          return `<div class="section-title">2. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</div>
${customText || '[Пользовательское Определение Конфиденциальности]'}`;
        }
      },
      term: (terminationNotice) => {
        return `<div class="section-title">3. СРОК ДЕЙСТВИЯ И РАСТОРЖЕНИЕ</div>
Данное Соглашение остается в силе до расторжения любой Стороной по предварительному письменному уведомлению за ${terminationNotice} дней; но ни одна Сторона не может расторгнуть данное Соглашение если между Сторонами заключено другое действующее прямое соглашение. В случае расторжения данного Соглашения, его условия продолжат действовать в отношении Конфиденциальной Информации, раскрытой до даты вступления в силу расторжения.`;
      },
      
      permittedUse: (purpose) => {
        // Handle different purpose types for Russian
        let purposeText = '[Цель Раскрытия]';
        if (purpose && purpose !== 'custom') {
          const option = purposeOptions.russian.find(opt => opt.value === purpose);
          purposeText = option ? option.label.toLowerCase() : purpose;
        } else if (purpose === 'custom' && formData.customPurpose) {
          purposeText = formData.customPurpose;
        }
        
        return `<div class="section-title">4. ДОПУСТИМОЕ ИСПОЛЬЗОВАНИЕ И РАЗГЛАШЕНИЕ</div>
Получатель может пользоваться Конфиденциальной Информацией только для ${purposeText} между Сторонами. Получатель может разгласить Конфиденциальную Информацию своим директорам, должностным лицам, консультантам и агентам ("Представителям"), но только если этим лицам необходимо ее знать в ходе работы на Получателя для потенциальных или продолжения текущих деловых сделок Сторон и если на этих лиц возложена обязанность сохранения конфиденциальности в неменьшем объеме, чем эта обязанность возложена данным Соглашением на самого Получателя. Получатель несет полную ответственность за любое нарушение данного Соглашения своими Представителями. Получатель обязан обеспечивать конфиденциальность информации разумными мерами предосторожности, сопоставимыми с теми мерами, которыми он охраняет собственную конфиденциальную информацию. Получатель может разглашать Конфиденциальную информацию только в случаях, оговоренных данным Соглашением.`;
      },
      
      protectionPeriod: (protectionPeriod) => {
        return `<div class="section-title">5. СРОК НЕРАЗГЛАШЕНИЯ И ВОЗВРАТ</div>
При отсутствии письменной договоренности между Сторонами об ином, обязанность Получателя о неразглашении Конфиденциальной Информации истекает через ${protectionPeriod} года после ее предоставления. По письменному распоряжению Раскрывающей Стороны Получатель должен незамедлительно вернуть или уничтожить всю полученную Конфиденциальную Информацию и все ее копии.`;
      },
      
      exclusions: `<div class="section-title">6. ИСКЛЮЧЕНИЯ</div>
Конфиденциальная Информация не включает информацию, которая: (a) является или становится общедоступной не по вине Получателя; (b) во время разглашения находилась в правомерном распоряжении Получателя без ограничений на её использование и разглашение; или (c) информацию, правомерно полученную Получателя от третьего лица без ограничений на использование и разглашение.`,
      
      noWarranty: `<div class="section-title">7. НЕТ ГАРАНТИЙ</div>
Конфиденциальная Информация предоставлена без каких-либо гарантий. Раскрывающая Сторона не несет ответственности за прямой или косвенный ущерб, понесенный Получателем информации при использовании Конфиденциальной Информации. Вся предоставленная Конфиденциальная Информация остается собственностью Раскрывающей Стороны.`,
      
      governingLaw: {
        california: `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством штата California, США. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать Los Angeles, CA.`,
        
        delaware: `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством штата Delaware, США. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать Wilmington, DE.`,
        
        newyork: `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством штата New York, США. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать New York, NY.`,
        
        russia: `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством Российской Федерации. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать Москву, Россия.`,
        
        other: (customLaw, customJurisdiction) => {
          return `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством ${customLaw || '[Применимое Право]'}. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать ${customJurisdiction || '[Юрисдикция]'}.`;
        }
      },
      
      severability: `<div class="section-title">9. НЕЗАВИСИМОСТЬ ПОЛОЖЕНИЙ</div>
Если какое-либо положение настоящего Соглашения становится незаконным или необеспеченным принудительной силой в суде соответствующей юрисдикции, это не повлияет на юридическую силу или возможность принудительного исполнения какого-либо другого положения настоящего Соглашения в наибольшей разрешенной законом степени.`,
      
      controllingLanguage: {
        english: `<div class="section-title">10. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</div>
В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, текст на английском языке будет иметь преимущественную силу.`,
        
        russian: `<div class="section-title">10. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</div>
В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, текст на русском языке будет иметь преимущественную силу.`
      },
      
      signatures: `<div class="section-title">В ПОДТВЕРЖДЕНИЕ ВЫШЕИЗЛОЖЕННОГО</div>
Стороны заключили настоящее Соглашение.

<div class="signatures">
<strong>Раскрывающая Сторона:</strong>

Подпись: _____________________________
Ф.И.О: _______________________________
Должность:___________________________
Дата: ________________________________

<strong>Получатель:</strong>

Подпись: _____________________________
Ф.И.О: _______________________________
Должность:___________________________
Дата: ________________________________
</div>`
    }
  };

  // Educational content for tooltips and notes
  const educationalContent = {
    english: {
      disclosureParty: "The party that owns and shares confidential information. This is typically the business or individual revealing sensitive data.",
      receivingParty: "The party that receives confidential information. This party is obligated to protect and not misuse the information.",
      effectiveDate: "The date when the agreement becomes legally binding. Important for calculating protection periods and understanding when obligations begin.",
      confidentialityDefinition: "Determines what information is protected. Broader definitions protect more information but may be harder to enforce. Narrower definitions are more precise but may miss important information.",
      purpose: "Clearly defining the purpose limits how the confidential information can be used and helps prevent misuse.",
      protectionPeriod: "How long the receiving party must keep information confidential. Common periods are 2-5 years. Trade secrets may require indefinite protection.",
      terminationNotice: "The number of days advance notice required to terminate the agreement. Common periods are 30-90 days.",
      governingLaw: "Determines which jurisdiction's laws will be applied to interpret the agreement. Critical for international agreements.",
      jurisdiction: "The specific court or location where disputes will be resolved. Should be easily accessible to both parties.",
      returnDestroy: "Requires the receiving party to return or destroy confidential information upon request, ensuring no copies remain.",
      noWarranty: "Protects the disclosing party from liability if the information turns out to be incorrect or causes damages.",
      severability: "Ensures the entire agreement doesn't become invalid if one provision is found unenforceable.",
      controllingLanguage: "In bilingual agreements, specifies which language version prevails in case of discrepancies.",
      crossBorderTip: "Cross-border NDAs may face enforcement challenges. Consider local laws, translation accuracy, and practical enforcement mechanisms."
    },
    russian: {
      disclosureParty: "Сторона, которая владеет и раскрывает конфиденциальную информацию. Обычно это бизнес или лицо, раскрывающее конфиденциальные данные.",
      receivingParty: "Сторона, которая получает конфиденциальную информацию. Эта сторона обязана защищать и не злоупотреблять информацией.",
      effectiveDate: "Дата, когда соглашение становится юридически обязательным. Важно для расчета сроков защиты и понимания начала обязательств.",
      confidentialityDefinition: "Определяет, какая информация защищена. Более широкие определения защищают больше информации, но их сложнее обеспечить исполнение.",
      purpose: "Четкое определение цели ограничивает использование конфиденциальной информации и помогает предотвратить злоупотребления.",
      protectionPeriod: "Как долго получающая сторона должна сохранять информацию конфиденциальной. Обычные сроки 2-5 лет.",
      terminationNotice: "Количество дней предварительного уведомления для расторжения соглашения. Обычные сроки 30-90 дней.",
      governingLaw: "Определяет, законы какой юрисдикции будут применяться для толкования соглашения. Критично для международных соглашений.",
      jurisdiction: "Конкретный суд или место, где будут разрешаться споры. Должно быть легко доступно для обеих сторон.",
      returnDestroy: "Требует от получающей стороны вернуть или уничтожить конфиденциальную информацию по запросу.",
      noWarranty: "Защищает раскрывающую сторону от ответственности, если информация окажется неверной или причинит ущерб.",
      severability: "Гарантирует, что все соглашение не станет недействительным, если одно положение будет признано неисполнимым.",
      controllingLanguage: "В двуязычных соглашениях указывает, какая языковая версия имеет преимущество в случае расхождений.",
      crossBorderTip: "Трансграничные соглашения о неразглашении могут столкнуться с проблемами исполнения. Учитывайте местные законы и механизмы исполнения."
    }
  };
  
  // Generate document based on form data
  const generateDocument = React.useCallback(() => {
    const {
      discloserName,
      discloserAddress,
      recipientName,
      recipientAddress,
      effectiveDate,
      purpose,
      customPurpose,
      confInfoType,
      customConfInfo,
      protectionPeriod,
      terminationNotice,
      governingLaw,
      customGoverningLaw,
      jurisdiction,
      customJurisdiction,
      includeNoWarranty,
      includeSeverability,
      controllingLanguage
    } = formData;
    
    // Calculate section numbers
    let enSectionNum = 7;
    let enGovLawNum = includeNoWarranty ? "8" : "7";
    let enSeverabilityNum = (includeNoWarranty ? 8 : 7) + (includeSeverability ? 1 : 0);
    let enControllingLangNum = enSeverabilityNum + 1;
    
    // Create document content
    let documentContent = '';
    
    // Title section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        <h2>${templates.english.title}</h2>
      </div>
      <div class="column right-column">
        <h2>${templates.russian.title}</h2>
      </div>
    </div>`;
    
    // Parties section - now includes addresses
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${templates.english.parties(discloserName, discloserAddress, recipientName, recipientAddress)}
      </div>
      <div class="column right-column">
        ${templates.russian.parties(discloserName, discloserAddress, recipientName, recipientAddress)}
      </div>
    </div>`;
    
    // Effective Date section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${templates.english.effectiveDate(effectiveDate)}
      </div>
      <div class="column right-column">
        ${templates.russian.effectiveDate(effectiveDate)}
      </div>
    </div>`;
    
    // Confidential Information section
    let enConfInfo, ruConfInfo;
    if (confInfoType === 'custom') {
      enConfInfo = templates.english.confidentialInfo.custom(customConfInfo);
      ruConfInfo = templates.russian.confidentialInfo.custom(customConfInfo);
    } else {
      enConfInfo = templates.english.confidentialInfo[confInfoType];
      ruConfInfo = templates.russian.confidentialInfo[confInfoType];
    }
    
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${enConfInfo}
      </div>
      <div class="column right-column">
        ${ruConfInfo}
      </div>
    </div>`;
    
    // Term section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${templates.english.term(terminationNotice)}
      </div>
      <div class="column right-column">
        ${templates.russian.term(terminationNotice)}
      </div>
    </div>`;
    
    // Permitted Use section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${templates.english.permittedUse(purpose)}
      </div>
      <div class="column right-column">
        ${templates.russian.permittedUse(purpose)}
      </div>
    </div>`;
    
    // Protection Period section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${templates.english.protectionPeriod(protectionPeriod)}
      </div>
      <div class="column right-column">
        ${templates.russian.protectionPeriod(protectionPeriod)}
      </div>
    </div>`;
    
    // Exclusions section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${templates.english.exclusions}
      </div>
      <div class="column right-column">
        ${templates.russian.exclusions}
      </div>
    </div>`;
    
    // No Warranty section (conditional)
    if (includeNoWarranty) {
      documentContent += `
      <div class="section-row">
        <div class="column left-column">
          ${templates.english.noWarranty}
        </div>
        <div class="column right-column">
          ${templates.russian.noWarranty}
        </div>
      </div>`;
    }
    
    // Governing Law section
    let enGovLaw, ruGovLaw;
    if (governingLaw === 'other') {
      const customJuris = jurisdiction === 'other' ? customJurisdiction : jurisdiction;
      enGovLaw = templates.english.governingLaw.other(customGoverningLaw, customJuris);
      ruGovLaw = templates.russian.governingLaw.other(customGoverningLaw, customJuris);
    } else {
      enGovLaw = templates.english.governingLaw[governingLaw];
      ruGovLaw = templates.russian.governingLaw[governingLaw];
    }
    
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        <div class="section-title">${enGovLawNum}. GOVERNING LAW</div>
        ${enGovLaw.split('</div>')[1]}
      </div>
      <div class="column right-column">
        <div class="section-title">${enGovLawNum}. ПРИМЕНИМОЕ ПРАВО</div>
        ${ruGovLaw.split('</div>')[1]}
      </div>
    </div>`;
    
    // Severability section (conditional)
    if (includeSeverability) {
      documentContent += `
      <div class="section-row">
        <div class="column left-column">
          <div class="section-title">${enSeverabilityNum}. SEVERABILITY</div>
          ${templates.english.severability.split('</div>')[1]}
        </div>
        <div class="column right-column">
          <div class="section-title">${enSeverabilityNum}. НЕЗАВИСИМОСТЬ ПОЛОЖЕНИЙ</div>
          ${templates.russian.severability.split('</div>')[1]}
        </div>
      </div>`;
    }
    
    // Controlling Language section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        <div class="section-title">${enControllingLangNum}. PREVAILING LANGUAGE</div>
        ${templates.english.controllingLanguage[controllingLanguage].split('</div>')[1]}
      </div>
      <div class="column right-column">
        <div class="section-title">${enControllingLangNum}. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</div>
        ${templates.russian.controllingLanguage[controllingLanguage].split('</div>')[1]}
      </div>
    </div>`;
    
    // Signatures section
    documentContent += `
    <div class="section-row signatures-row">
      <div class="column left-column">
        ${templates.english.signatures}
      </div>
      <div class="column right-column">
        ${templates.russian.signatures}
      </div>
    </div>`;
    
    return documentContent;
  }, [formData]);
  
  // Help icon component with tooltip
  const HelpIcon = ({ tooltip }) => (
    <span className="help-icon">
      ?
      <span className="help-tooltip">
        {tooltip}
      </span>
    </span>
  );
  
  // Render tabs
  const renderTabs = () => {
    return (
      <div className="tabs">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {currentLanguage === 'english' ? tab.labelEn : tab.labelRu}
          </div>
        ))}
      </div>
    );
  };
  
  // Render form fields based on current tab
  const renderFormFields = () => {
    const tooltips = educationalContent[currentLanguage];
    
    switch(currentTab) {
      case 'parties':
        return (
          <div className="tab-content active">
            <div className="form-group">
              <label htmlFor="discloserName">
                {currentLanguage === 'english' ? 'Disclosing Party Name:' : 'Наименование Раскрывающей Стороны:'}
                <HelpIcon tooltip={tooltips.disclosureParty} />
              </label>
              <input 
                type="text" 
                id="discloserName"
                name="discloserName"
                value={formData.discloserName}
                onChange={handleChange}
                placeholder={currentLanguage === 'english' ? 'Company/Individual Name' : 'Название Компании/ФИО'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="discloserAddress">
                {currentLanguage === 'english' ? 'Disclosing Party Address:' : 'Адрес Раскрывающей Стороны:'}
              </label>
              <input 
                type="text" 
                id="discloserAddress"
                name="discloserAddress"
                value={formData.discloserAddress}
                onChange={handleChange}
                placeholder={currentLanguage === 'english' ? 'Full Address' : 'Полный Адрес'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientName">
                {currentLanguage === 'english' ? 'Receiving Party Name:' : 'Наименование Получателя:'}
                <HelpIcon tooltip={tooltips.receivingParty} />
              </label>
              <input 
                type="text" 
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder={currentLanguage === 'english' ? 'Company/Individual Name' : 'Название Компании/ФИО'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientAddress">
                {currentLanguage === 'english' ? 'Receiving Party Address:' : 'Адрес Получателя:'}
              </label>
              <input 
                type="text" 
                id="recipientAddress"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleChange}
                placeholder={currentLanguage === 'english' ? 'Full Address' : 'Полный Адрес'}
              />
            </div>
            
            <div className="legal-note">
              {tooltips.crossBorderTip}
            </div>
          </div>
        );
      
      case 'agreement':
        return (
          <div className="tab-content active">
            <div className="form-group">
              <label htmlFor="effectiveDate">
                {currentLanguage === 'english' ? 'Effective Date:' : 'Дата Вступления в Силу:'}
                <HelpIcon tooltip={tooltips.effectiveDate} />
              </label>
              <input 
                type="date" 
                id="effectiveDate"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="purpose">
                {currentLanguage === 'english' ? 'Purpose of Disclosure:' : 'Цель Раскрытия:'}
                <HelpIcon tooltip={tooltips.purpose} />
              </label>
              <select 
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
              >
                <option value="">
                  {currentLanguage === 'english' ? 'Select purpose...' : 'Выберите цель...'}
                </option>
                {purposeOptions[currentLanguage].map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.purpose && (
              <div className="purpose-explainer">
                {purposeExplainers[currentLanguage][formData.purpose]}
              </div>
            )}
            
            {formData.purpose === 'custom' && (
              <div className="form-group">
                <label htmlFor="customPurpose">
                  {currentLanguage === 'english' ? 'Custom Purpose:' : 'Пользовательская Цель:'}
                </label>
                <textarea 
                  id="customPurpose"
                  name="customPurpose"
                  value={formData.customPurpose}
                  onChange={handleChange}
                  placeholder={currentLanguage === 'english' 
                    ? 'Describe the specific purpose...' 
                    : 'Опишите конкретную цель...'}
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="confInfoType">
                {currentLanguage === 'english' ? 'Definition of Confidential Information:' : 'Определение Конфиденциальной Информации:'}
                <HelpIcon tooltip={tooltips.confidentialityDefinition} />
              </label>
              <select 
                id="confInfoType"
                name="confInfoType"
                value={formData.confInfoType}
                onChange={handleChange}
              >
                <option value="broad">
                  {currentLanguage === 'english' ? 'Broad Definition' : 'Широкое Определение'}
                </option>
                <option value="medium">
                  {currentLanguage === 'english' ? 'Medium Definition' : 'Среднее Определение'}
                </option>
                <option value="narrow">
                  {currentLanguage === 'english' ? 'Narrow Definition' : 'Узкое Определение'}
                </option>
                <option value="custom">
                  {currentLanguage === 'english' ? 'Custom Definition' : 'Пользовательское Определение'}
                </option>
              </select>
            </div>
            
            {formData.confInfoType && (
              <div className="definition-summary">
                {definitionSummaries[currentLanguage][formData.confInfoType]}
              </div>
            )}
            
            {formData.confInfoType === 'custom' && (
              <div className="form-group">
                <label htmlFor="customConfInfo">
                  {currentLanguage === 'english' ? 'Custom Definition:' : 'Пользовательское Определение:'}
                </label>
                <textarea 
                  id="customConfInfo"
                  name="customConfInfo"
                  value={formData.customConfInfo}
                  onChange={handleChange}
                  placeholder={currentLanguage === 'english' 
                    ? 'Enter custom definition of confidential information' 
                    : 'Введите пользовательское определение конфиденциальной информации'}
                />
              </div>
            )}
          </div>
        );
        
      case 'term':
        return (
          <div className="tab-content active">
            <div className="form-group">
              <label htmlFor="protectionPeriod">
                {currentLanguage === 'english' ? 'Protection Period (years):' : 'Срок Защиты (лет):'}
                <HelpIcon tooltip={tooltips.protectionPeriod} />
              </label>
              <input 
                type="number" 
                id="protectionPeriod"
                name="protectionPeriod"
                min="1" 
                max="10"
                value={formData.protectionPeriod}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="terminationNotice">
                {currentLanguage === 'english' ? 'Termination Notice Period (days):' : 'Период Уведомления о Расторжении (дней):'}
                <HelpIcon tooltip={tooltips.terminationNotice} />
              </label>
              <input 
                type="number" 
                id="terminationNotice"
                name="terminationNotice"
                min="1" 
                max="90"
                value={formData.terminationNotice}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="governingLaw">
                {currentLanguage === 'english' ? 'Governing Law:' : 'Применимое Право:'}
                <HelpIcon tooltip={tooltips.governingLaw} />
              </label>
              <select 
                id="governingLaw"
                name="governingLaw"
                value={formData.governingLaw}
                onChange={handleChange}
              >
                <option value="california">
                  {currentLanguage === 'english' ? 'California, USA' : 'Калифорния, США'}
                </option>
                <option value="delaware">
                  {currentLanguage === 'english' ? 'Delaware, USA' : 'Делавэр, США'}
                </option>
                <option value="newyork">
                  {currentLanguage === 'english' ? 'New York, USA' : 'Нью-Йорк, США'}
                </option>
                <option value="russia">
                  {currentLanguage === 'english' ? 'Russian Federation' : 'Российская Федерация'}
                </option>
                <option value="other">
                  {currentLanguage === 'english' ? 'Other (specify below)' : 'Другое (укажите ниже)'}
                </option>
              </select>
            </div>
            
            {formData.governingLaw === 'other' && (
              <div className="form-group">
                <label htmlFor="customGoverningLaw">
                  {currentLanguage === 'english' ? 'Custom Governing Law:' : 'Пользовательское Применимое Право:'}
                </label>
                <input 
                  type="text" 
                  id="customGoverningLaw"
                  name="customGoverningLaw"
                  value={formData.customGoverningLaw}
                  onChange={handleChange}
                  placeholder={currentLanguage === 'english' ? 'e.g., State of Texas' : 'например, штат Техас'}
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="jurisdiction">
                {currentLanguage === 'english' ? 'Jurisdiction:' : 'Место Рассмотрения Споров:'}
                <HelpIcon tooltip={tooltips.jurisdiction} />
              </label>
              <select 
                id="jurisdiction"
                name="jurisdiction"
                value={formData.jurisdiction}
                onChange={handleChange}
              >
                <option value="los-angeles">
                  {currentLanguage === 'english' ? 'Los Angeles, CA' : 'Лос-Анджелес, Калифорния'}
                </option>
                <option value="new-york">
                  {currentLanguage === 'english' ? 'New York, NY' : 'Нью-Йорк, Нью-Йорк'}
                </option>
                <option value="wilmington">
                  {currentLanguage === 'english' ? 'Wilmington, DE' : 'Уилмингтон, Делавэр'}
                </option>
                <option value="moscow">
                  {currentLanguage === 'english' ? 'Moscow, Russia' : 'Москва, Россия'}
                </option>
                <option value="other">
                  {currentLanguage === 'english' ? 'Other (specify below)' : 'Другое (укажите ниже)'}
                </option>
              </select>
            </div>
            
            {formData.jurisdiction === 'other' && (
              <div className="form-group">
                <label htmlFor="customJurisdiction">
                  {currentLanguage === 'english' ? 'Custom Jurisdiction:' : 'Пользовательская Юрисдикция:'}
                </label>
                <input 
                  type="text" 
                  id="customJurisdiction"
                  name="customJurisdiction"
                  value={formData.customJurisdiction}
                  onChange={handleChange}
                  placeholder={currentLanguage === 'english' ? 'e.g., Houston, TX' : 'например, Хьюстон, Техас'}
                />
              </div>
            )}
          </div>
        );
        
      case 'additional':
        return (
          <div className="tab-content active">
            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  id="includeReturnDestroy"
                  name="includeReturnDestroy"
                  checked={formData.includeReturnDestroy}
                  onChange={handleChange}
                />
                {currentLanguage === 'english' 
                  ? 'Include Return/Destruction of Materials' 
                  : 'Включить Возврат/Уничтожение Материалов'}
                <HelpIcon tooltip={tooltips.returnDestroy} />
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  id="includeNoWarranty"
                  name="includeNoWarranty"
                  checked={formData.includeNoWarranty}
                  onChange={handleChange}
                />
                {currentLanguage === 'english' 
                  ? 'Include No Warranty Clause' 
                  : 'Включить Отсутствие Гарантий'}
                <HelpIcon tooltip={tooltips.noWarranty} />
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  id="includeSeverability"
                  name="includeSeverability"
                  checked={formData.includeSeverability}
                  onChange={handleChange}
                />
                {currentLanguage === 'english' 
                  ? 'Include Severability Clause' 
                  : 'Включить Независимость Положений'}
                <HelpIcon tooltip={tooltips.severability} />
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="controllingLanguage">
                {currentLanguage === 'english' ? 'Legally Controlling Language:' : 'Преобладающий Язык:'}
                <HelpIcon tooltip={tooltips.controllingLanguage} />
              </label>
              <select 
                id="controllingLanguage"
                name="controllingLanguage"
                value={formData.controllingLanguage}
                onChange={handleChange}
              >
                <option value="english">
                  {currentLanguage === 'english' ? 'English' : 'Английский'}
                </option>
                <option value="russian">
                  {currentLanguage === 'english' ? 'Russian' : 'Русский'}
                </option>
              </select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Effect to render document on form changes
  React.useEffect(() => {
    const documentHtml = generateDocument();
    const previewElement = document.getElementById('preview-document');
    if (previewElement) {
      previewElement.innerHTML = documentHtml;
    }
  }, [formData, generateDocument]);
  
  // Effect to initialize feather icons after render
  React.useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [currentTab]);
  
  return (
    <div className="main-container">
      <div className="header-container">
        <div className="flag-toggle-container">
          <button 
            className={`flag-btn ${currentLanguage === 'english' ? 'active' : ''}`}
            onClick={() => toggleLanguage('english')}
          >
            <img src="usa-flag.svg" alt="USA" className="flag-icon" />
            English
          </button>
          <button 
            className={`flag-btn ${currentLanguage === 'russian' ? 'active' : ''}`}
            onClick={() => toggleLanguage('russian')}
          >
            <img src="russia-flag.svg" alt="RUS" className="flag-icon" />
            Русский
          </button>
        </div>
        <h1>
          {currentLanguage === 'english' 
            ? 'Dual Language NDA Generator' 
            : 'Генератор Двуязычного Соглашения о Неразглашении'}
        </h1>
      </div>
      
      <div className="content-container">
        <div className="form-section">
          {/* Tabs */}
          {renderTabs()}
          
          {/* Form fields */}
          {renderFormFields()}
          
          {/* Navigation buttons */}
          <div className="button-row">
            <button 
              className={`btn secondary ${currentTab === tabs[0].id ? 'disabled' : ''}`}
              onClick={handlePrevious}
              disabled={currentTab === tabs[0].id}
            >
              <i data-feather="chevron-left"></i>
              {currentLanguage === 'english' ? 'Previous' : 'Назад'}
            </button>
            
            <button 
              className="btn"
              onClick={copyToClipboard}
            >
              <i data-feather="copy"></i>
              {currentLanguage === 'english' ? 'Copy' : 'Копировать'}
            </button>
            
            <button 
              className="btn success"
              onClick={downloadAsWord}
            >
              <i data-feather="file-text"></i>
              {currentLanguage === 'english' ? 'MS Word' : 'MS Word'}
            </button>
            
            <button 
              className={`btn ${currentTab === tabs[tabs.length - 1].id ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={currentTab === tabs[tabs.length - 1].id}
            >
              {currentLanguage === 'english' ? 'Next' : 'Далее'}
              <i data-feather="chevron-right"></i>
            </button>
          </div>
        </div>
        
        <div className="preview-section" ref={previewRef}>
          <h2>{currentLanguage === 'english' ? 'Live Preview' : 'Предварительный Просмотр'}</h2>
          <div id="preview-document" className="preview-content"></div>
        </div>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));