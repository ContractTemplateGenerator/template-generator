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
    confInfoType: 'broad',
    customConfInfo: '',
    protectionPeriod: 2,
    terminationNotice: 30,
    governingLaw: 'california',
    jurisdiction: 'los-angeles',
    includeReturnDestroy: true,
    includeNoWarranty: true,
    includeSeverability: true,
    controllingLanguage: 'english',
  });
  
  // Preview section ref for scrolling
  const previewRef = React.useRef(null);
  
  // Define tabs (reduced from 4 to 3)
  const tabs = [
    { id: 'parties', labelEn: 'Parties & Terms', labelRu: 'Стороны и Условия' },
    { id: 'agreement', labelEn: 'Agreement Details', labelRu: 'Детали Соглашения' },
    { id: 'additional', labelEn: 'Jurisdiction & Clauses', labelRu: 'Юрисдикция и Пункты' }
  ];
  
  // Purpose options with proper values
  const purposeOptions = {
    english: [
      { value: 'evaluating potential business relationship', text: 'Evaluating Potential Business Relationship' },
      { value: 'discussing potential investment', text: 'Discussing Potential Investment' },
      { value: 'evaluating potential joint venture', text: 'Evaluating Potential Joint Venture' },
      { value: 'evaluating investment opportunities', text: 'Evaluating Investment Opportunities' },
      { value: 'discussing merger or acquisition', text: 'Discussing Merger or Acquisition' },
      { value: 'negotiating potential partnership', text: 'Negotiating Potential Partnership' },
      { value: 'evaluating potential licensing agreement', text: 'Evaluating Potential Licensing Agreement' },
      { value: 'performing services for the Disclosing Party', text: 'Performing Services for the Disclosing Party' }
    ],
    russian: [
      { value: 'evaluating potential business relationship', text: 'Оценка Потенциальных Деловых Отношений' },
      { value: 'discussing potential investment', text: 'Обсуждение Потенциальных Инвестиций' },
      { value: 'evaluating potential joint venture', text: 'Оценка Потенциального Совместного Предприятия' },
      { value: 'evaluating investment opportunities', text: 'Оценка Инвестиционных Возможностей' },
      { value: 'discussing merger or acquisition', text: 'Обсуждение Слияния или Поглощения' },
      { value: 'negotiating potential partnership', text: 'Переговоры о Потенциальном Партнерстве' },
      { value: 'evaluating potential licensing agreement', text: 'Оценка Потенциального Лицензионного Соглашения' },
      { value: 'performing services for the Disclosing Party', text: 'Предоставление Услуг Раскрывающей Стороне' }
    ]
  };
  
  // Handle language toggle
  const toggleLanguage = (language) => {
    setCurrentLanguage(language);
  };
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChangedField(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
  
  // Schedule consultation
  const scheduleConsult = () => {
    window.open('https://terms.law/call/', '_blank');
  };
  
  // Templates for NDA content in both languages
  const templates = {
    english: {
      title: "NON-DISCLOSURE AGREEMENT",
      parties: (discloserName, recipientName) => {
        return `This Agreement is made by <strong>${discloserName || '[Disclosing Party Name]'}</strong> (the "Disclosing Party"), and <strong>${recipientName || '[Receiving Party Name]'}</strong> (the "Receiving Party"). (each a "Party" and, collectively, the "Parties").`;
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
        return `<div class="section-title">4. PERMITTED USE AND DISCLOSURE</div>
Receiving Party will use Confidential Information only for the purpose of and in connection with ${purpose || '[Purpose of Disclosure]'} between the Parties. Receiving Party may disclose Confidential Information to its directors, officers, employees, contractors, advisors, and agents, so long as such individuals have a need to know in their work for Receiving Party in furtherance of the potential or continued business transaction or relationship between the Parties, and are bound by obligations of confidentiality at least as restrictive as those imposed on Receiving Party in this Agreement, (collectively "Representatives"). Receiving Party is fully liable for any breach of this Agreement by its Representatives. Receiving Party will use the same degree of care, but no less than a reasonable degree of care, as the Receiving Party uses with respect to its own similar information to protect the Confidential Information. Receiving Party may only disclose confidential information as authorized by this Agreement.`;
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
This Agreement shall be governed by the law of the Russian Federation. Moscow, Russia is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`
      },
      
      severability: `<div class="section-title">9. SEVERABILITY</div>
If any provision of this Agreement is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions of this Agreement will remain in full force and effect, and the provision affected will be construed so as to be enforceable to the maximum extent permissible by law.`,
      
      controllingLanguage: {
        english: `<div class="section-title">10. PREVAILING LANGUAGE</div>
In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, the English version shall prevail.`,
        
        russian: `<div class="section-title">10. PREVAILING LANGUAGE</div>
In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, the Russian version shall prevail.`,
        
        both: `<div class="section-title">10. PREVAILING LANGUAGE</div>
In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, both versions shall be equally authoritative.`
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
      parties: (discloserName, recipientName) => {
        return `Это Соглашение заключено между <strong>${discloserName || '[Disclosing Party Name]'}</strong> ("Раскрывающая Сторона") и <strong>${recipientName || '[Receiving Party Name]'}</strong> ("Получатель"). (далее вместе именуемые "Стороны", а каждая в отдельности – "Сторона").`;
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
"Конфиденциальная Информация" по данному Соглашению означает любую информацию, технические спецификации или ноу-хау, раскрытые в письменной, устной, электронной или другой форме Раскрывающей Стороной Получателю, которые (а) помечены, сопровождены или подпадают под действие документов ясно помеченных "конфиденциально", "для внутреннего пользования" и т.п.; (b) обозначены как конфиденциальные Раскрывающей Стороной до, во время или после раскрытия или сообщения; или (c) конфиденциальность которых Получатель должен осознать.`,
        
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
        // Get the correct Russian grammar for purpose
        let purposeRussian = purpose;
        if (purpose.includes('evaluating potential business relationship')) {
          purposeRussian = 'оценки потенциальных деловых отношений';
        } else if (purpose.includes('discussing potential investment')) {
          purposeRussian = 'обсуждения потенциальных инвестиций';
        } else if (purpose.includes('evaluating potential joint venture')) {
          purposeRussian = 'оценки потенциального совместного предприятия';
        } else if (purpose.includes('evaluating investment opportunities')) {
          purposeRussian = 'оценки инвестиционных возможностей';
        } else if (purpose.includes('discussing merger or acquisition')) {
          purposeRussian = 'обсуждения слияния или поглощения';
        } else if (purpose.includes('negotiating potential partnership')) {
          purposeRussian = 'переговоров о потенциальном партнерстве';
        } else if (purpose.includes('evaluating potential licensing agreement')) {
          purposeRussian = 'оценки потенциального лицензионного соглашения';
        } else if (purpose.includes('performing services for')) {
          purposeRussian = 'предоставления услуг Раскрывающей Стороне';
        }
        
        return `<div class="section-title">4. ДОПУСТИМОЕ ИСПОЛЬЗОВАНИЕ И РАЗГЛАШЕНИЕ</div>
Получатель может пользоваться Конфиденциальной Информацией только для ${purposeRussian} между Сторонами. Получатель может разгласить Конфиденциальную Информацию своим директорам, должностным лицам, консультантам и агентам ("Представителям"), но только если этим лицам необходимо ее знать в ходе работы на Получателя для потенциальных или продолжения текущих деловых сделок Сторон и если на этих лиц возложена обязанность сохранения конфиденциальности в неменьшем объеме, чем эта обязанность возложена данным Соглашением на самого Получателя. Получатель несет полную ответственность за любое нарушение данного Соглашения своими Представителями. Получатель обязан обеспечивать конфиденциальность информации разумными мерами предосторожности, сопоставимыми с теми мерами, которыми он охраняет собственную конфиденциальную информацию. Получатель может разглашать Конфиденциальную информацию только в случаях, оговоренных данным Соглашением.`;
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
Настоящее соглашение регулируется законодательством Российской Федерации. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать Москву, Россия.`
      },
      
      severability: `<div class="section-title">9. НЕЗАВИСИМОСТЬ ПОЛОЖЕНИЙ</div>
Если какое-либо положение настоящего Соглашения становится незаконным или необеспеченным принудительной силой в суде соответствующей юрисдикции, это не повлияет на юридическую силу или возможность принудительного исполнения какого-либо другого положения настоящего Соглашения в наибольшей разрешенной законом степени.`,
      
      controllingLanguage: {
        english: `<div class="section-title">10. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</div>
В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, текст на английском языке будет иметь преимущественную силу.`,
        
        russian: `<div class="section-title">10. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</div>
В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, текст на русском языке будет иметь преимущественную силу.`,
        
        both: `<div class="section-title">10. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</div>
В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, обе версии будут иметь одинаковую юридическую силу.`
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
      confidentialityDefinition: "Broader definitions provide more protection but may be harder to enforce. Consider what truly needs protection - trade secrets require different handling than general business information. For international NDAs, be specific about what constitutes 'confidential' in each jurisdiction.",
      protectionPeriod: "Consider the nature of your information: technology may become obsolete quickly (1-3 years), while strategic plans or client lists may need longer protection (3-7 years). Some jurisdictions may not enforce indefinite NDAs.",
      governingLaw: "Choose the jurisdiction where you're most likely to enforce the agreement. Consider: where assets are located, where parties do business, and which jurisdiction's laws are most favorable to your position. Different jurisdictions have varying standards for what constitutes 'reasonable' confidentiality measures.",
      controllingLanguage: "Critical for international agreements. The controlling language determines how ambiguities are resolved. If your primary business language differs from the counterparty's, ensure key terms are clearly defined in both languages to avoid disputes.",
      purpose: "Be specific enough to protect your interests but broad enough to cover necessary discussions. Overly narrow purposes may require new NDAs for evolved discussions. Consider including related activities (e.g., 'due diligence' when discussing investments).",
      russianLawNote: "Russian law requires specific 'режим коммерческой тайны' (commercial secret regime) including marking documents, maintaining access logs, and implementing protection measures. Without these formalities, information may not receive legal protection as trade secrets.",
      usLawNote: "US courts examine 'reasonable efforts' to maintain secrecy: password protection, limited access, confidentiality agreements, and clear marking. The Defend Trade Secrets Act provides federal protection but requires showing economic value from secrecy and reasonable protective measures.",
      crossBorderEnforcement: "Consider: (1) Where will disputes likely arise? (2) Where are the parties' assets located? (3) Which jurisdiction's courts will recognize foreign judgments? Some countries require local notarization or apostille for foreign documents. Consider arbitration clauses for easier international enforcement.",
    },
    russian: {
      confidentialityDefinition: "Более широкие определения обеспечивают большую защиту, но могут быть сложнее в применении. Подумайте, что действительно нуждается в защите - коммерческая тайна требует иного подхода, чем общая деловая информация. Для международных соглашений четко определите, что является 'конфиденциальным' в каждой юрисдикции.",
      protectionPeriod: "Учитывайте характер вашей информации: технологии могут быстро устареть (1-3 года), а стратегические планы или клиентские базы могут требовать более длительной защиты (3-7 лет). Некоторые юрисдикции не признают бессрочные соглашения о неразглашении.",
      governingLaw: "Выберите юрисдикцию, где вы с наибольшей вероятностью будете обеспечивать исполнение соглашения. Учитывайте: где находятся активы, где стороны ведут бизнес, и законы какой юрисдикции наиболее благоприятны для вашей позиции. Разные юрисдикции имеют различные стандарты 'разумных' мер конфиденциальности.",
      controllingLanguage: "Критически важно для международных соглашений. Преобладающий язык определяет, как разрешаются неясности. Если ваш основной деловой язык отличается от языка контрагента, убедитесь, что ключевые термины четко определены на обоих языках во избежание споров.",
      purpose: "Будьте достаточно конкретны для защиты ваших интересов, но достаточно широки для охвата необходимых обсуждений. Слишком узкие цели могут потребовать новых соглашений при развитии обсуждений. Рассмотрите включение связанных действий (например, 'проверка благонадежности' при обсуждении инвестиций).",
      russianLawNote: "Российское законодательство требует установления специального 'режима коммерческой тайны', включая маркировку документов, ведение журналов доступа и внедрение мер защиты. Без этих формальностей информация может не получить правовую защиту как коммерческая тайна.",
      usLawNote: "Суды США проверяют 'разумные усилия' по сохранению секретности: парольная защита, ограниченный доступ, соглашения о конфиденциальности и четкая маркировка. Федеральный закон о защите коммерческой тайны требует демонстрации экономической ценности от секретности и разумных защитных мер.",
      crossBorderEnforcement: "Учитывайте: (1) Где вероятнее всего возникнут споры? (2) Где находятся активы сторон? (3) Суды какой юрисдикции признают иностранные судебные решения? Некоторые страны требуют местное нотариальное заверение или апостиль для иностранных документов. Рассмотрите арбитражные оговорки для упрощения международного исполнения.",
    }
  };
  
  // Legal differences between US and Russian law on NDAs
  const legalDifferences = {
    english: {
      definition: "US law recognizes confidentiality through reasonable efforts. Russian law requires formal 'commercial secret regime' with specific procedures. Consider creating separate annexes defining procedures for each jurisdiction in cross-border NDAs.",
      requirements: "Russian law: Must mark documents 'Коммерческая тайна', maintain access logs, implement documented protection measures. US law: Focus on reasonable business practices, may recognize verbal disclosures if confirmed in writing. Both require actual secrecy and economic value.",
      duration: "Russian courts may void indefinite obligations as contrary to good faith principles. US allows 'perpetual' protection for true trade secrets. Consider fixed terms with renewal options, or tie duration to the commercial relevance of the information.",
      damages: "US courts may award lost profits, unjust enrichment, reasonable royalties, and in some cases, punitive damages and attorney fees. Russian courts typically limit to actual damages with strict proof requirements. Consider including liquidated damages clauses where permitted."
    },
    russian: {
      definition: "Законодательство США признает конфиденциальность через разумные усилия. Российское законодательство требует формального 'режима коммерческой тайны' с конкретными процедурами. Рассмотрите создание отдельных приложений, определяющих процедуры для каждой юрисдикции в трансграничных соглашениях.",
      requirements: "Российское законодательство: необходимо маркировать документы 'Коммерческая тайна', вести журналы доступа, внедрять документированные меры защиты. Законодательство США: фокус на разумных деловых практиках, может признавать устные раскрытия при письменном подтверждении. Оба требуют фактической секретности и экономической ценности.",
      duration: "Российские суды могут признать бессрочные обязательства противоречащими принципам добросовестности. США допускают 'вечную' защиту истинной коммерческой тайны. Рассмотрите фиксированные сроки с опционами продления или привяжите срок к коммерческой актуальности информации.",
      damages: "Суды США могут присудить упущенную выгоду, неосновательное обогащение, разумные роялти, а в некоторых случаях - штрафные убытки и судебные расходы. Российские суды обычно ограничиваются фактическими убытками со строгими требованиями к доказательствам. Рассмотрите включение оговорок о заранее оцененных убытках, где это разрешено."
    }
  };
  
  // Generate document based on form data
  const generateDocument = () => {
    const {
      discloserName,
      recipientName,
      effectiveDate,
      purpose,
      confInfoType,
      customConfInfo,
      protectionPeriod,
      terminationNotice,
      governingLaw,
      includeNoWarranty,
      includeSeverability,
      controllingLanguage
    } = formData;
    
    // Calculate section numbers based on included sections
    let enNoWarrantyNum = "7";
    let enGovLawNum = includeNoWarranty ? "8" : "7";
    let enSeverabilityNum = (includeNoWarranty ? 8 : 7) + (includeSeverability ? 1 : 0);
    let enControllingLangNum = (includeNoWarranty ? 8 : 7) + (includeSeverability ? 1 : 0) + 1;
    
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
    
    // Parties section
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        ${templates.english.parties(discloserName, recipientName)}
      </div>
      <div class="column right-column">
        ${templates.russian.parties(discloserName, recipientName)}
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
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        <div class="section-title">${enGovLawNum}. GOVERNING LAW</div>
        ${templates.english.governingLaw[governingLaw].split('</div>')[1]}
      </div>
      <div class="column right-column">
        <div class="section-title">${enGovLawNum}. ПРИМЕНИМОЕ ПРАВО</div>
        ${templates.russian.governingLaw[governingLaw].split('</div>')[1]}
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
  };
  
  // Function to highlight changes
  const highlightChanges = () => {
    // Implementation remains the same as before
    if (!lastChangedField) return;
    
    const documentHtml = generateDocument();
    const previewElement = document.getElementById('preview-document');
    previewElement.innerHTML = documentHtml;
    
    // Highlighting logic remains the same
  };
  
  // Effect to generate document on form changes
  React.useEffect(() => {
    if (lastChangedField) {
      highlightChanges();
    } else {
      const documentHtml = generateDocument();
      const previewElement = document.getElementById('preview-document');
      if (previewElement) {
        previewElement.innerHTML = documentHtml;
      }
    }
  }, [formData, lastChangedField]);
  
  // Info icon component with tooltip
  const InfoTooltip = ({ content }) => (
    <div className="tooltip-container">
      <i data-feather="info" className="info-icon"></i>
      <div className="tooltip">
        {content}
      </div>
    </div>
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
            
            <div className="form-group">
              <label htmlFor="effectiveDate">
                {currentLanguage === 'english' ? 'Effective Date:' : 'Дата Вступления в Силу:'}
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
                <InfoTooltip content={tooltips.purpose} />
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
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case 'agreement':
        return (
          <div className="tab-content active">
            <div className="form-group">
              <label htmlFor="confInfoType">
                {currentLanguage === 'english' ? 'Definition of Confidential Information:' : 'Определение Конфиденциальной Информации:'}
                <InfoTooltip content={tooltips.confidentialityDefinition} />
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
            
            <div className="form-group">
              <label htmlFor="protectionPeriod">
                {currentLanguage === 'english' ? 'Protection Period (years):' : 'Срок Защиты (лет):'}
                <InfoTooltip content={tooltips.protectionPeriod} />
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
            
            {/* Legal difference highlight */}
            <div className="legal-difference">
              <strong>{currentLanguage === 'english' ? 'Legal Difference:' : 'Юридическое Различие:'}</strong><br />
              {currentLanguage === 'english' ? legalDifferences.english.definition : legalDifferences.russian.definition}
            </div>
          </div>
        );
        
      case 'additional':
        return (
          <div className="tab-content active">
            <div className="form-group">
              <label htmlFor="governingLaw">
                {currentLanguage === 'english' ? 'Governing Law:' : 'Применимое Право:'}
                <InfoTooltip content={tooltips.governingLaw} />
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
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="jurisdiction">
                {currentLanguage === 'english' ? 'Jurisdiction:' : 'Место Рассмотрения Споров:'}
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
              </select>
            </div>
            
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
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="controllingLanguage">
                {currentLanguage === 'english' ? 'Legally Controlling Language:' : 'Преобладающий Язык:'}
                <InfoTooltip content={tooltips.controllingLanguage} />
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
                <option value="both">
                  {currentLanguage === 'english' ? 'Both Equally' : 'Оба в Равной Степени'}
                </option>
              </select>
            </div>
            
            {/* Legal note about jurisdiction */}
            <div className="legal-note">
              {currentLanguage === 'english' 
                ? (formData.governingLaw === 'russia' ? tooltips.russianLawNote : tooltips.usLawNote)
                : (formData.governingLaw === 'russia' ? tooltips.russianLawNote : tooltips.usLawNote)}
            </div>
            
            {/* Legal difference highlight */}
            <div className="legal-difference">
              <strong>{currentLanguage === 'english' ? 'Legal Difference:' : 'Юридическое Различие:'}</strong><br />
              {currentLanguage === 'english' ? legalDifferences.english.requirements : legalDifferences.russian.requirements}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="main-container">
      <h1>
        {currentLanguage === 'english' 
          ? 'Dual Language NDA Generator (English/Russian)' 
          : 'Генератор Двуязычного Соглашения о Неразглашении (Английский/Русский)'}
      </h1>
      
      <div className="language-toggle">
        <button 
          className={`toggle-btn ${currentLanguage === 'english' ? 'active' : ''}`}
          onClick={() => toggleLanguage('english')}
        >
          <img src="usa-flag.svg" alt="USA flag" />
          English
        </button>
        <button 
          className={`toggle-btn ${currentLanguage === 'russian' ? 'active' : ''}`}
          onClick={() => toggleLanguage('russian')}
        >
          <img src="russia-flag.svg" alt="Russian flag" />
          Русский
        </button>
      </div>
      
      <div className="content-container">
        <div className="form-section">
          {/* Tabs */}
          {renderTabs()}
          
          {/* Form fields */}
          {renderFormFields()}
          
          {/* Fixed bottom button row */}
          <div className="fixed-button-container">
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
              className="btn warning"
              onClick={scheduleConsult}
            >
              <i data-feather="calendar"></i>
              {currentLanguage === 'english' ? 'Schedule Consult' : 'Консультация'}
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