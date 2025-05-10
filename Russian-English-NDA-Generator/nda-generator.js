// Main React component for the Dual-Language NDA Generator
const App = () => {
  // Define state
  const [currentLanguage, setCurrentLanguage] = React.useState('english');
  const [currentTab, setCurrentTab] = React.useState('parties');
  const [formData, setFormData] = React.useState({
    discloserName: '',
    discloserAddress: '',  
    recipientName: '',
    recipientAddress: '',
    effectiveDate: '',
    purpose: 'business',
    customPurpose: '',
    confInfoType: 'broad',
    customConfInfo: '',
    protectionPeriod: 2,
    terminationNotice: 30,
    governingLaw: 'california',
    includeReturnDestroy: true,
    includeNoWarranty: true,
    includeSeverability: true,
    controllingLanguage: 'english',
  });
  
  // Track what was last changed for highlighting
  const [lastChanged, setLastChanged] = React.useState(null);
  
  // Preview section ref for scrolling
  const previewRef = React.useRef(null);
  
  // Define tabs - Changed "Информация" to "Стороны" and "Parties Info" to "Parties"
  const tabs = [
    { id: 'parties', labelEn: 'Parties', labelRu: 'Стороны' },
    { id: 'terms', labelEn: 'Key Terms', labelRu: 'Условия' },
    { id: 'additional', labelEn: 'Options', labelRu: 'Опции' },
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
  
  // Handle form input changes with highlighting
  const handleChange = React.useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setLastChanged(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Trigger highlighting after state update
    setTimeout(() => {
      highlightChangedSection(name);
    }, 100);
  }, []);
  
  // Highlight and scroll to changed section
  const highlightChangedSection = (fieldName) => {
    const previewElement = document.getElementById('preview-document');
    if (!previewElement) return;
    
    // Remove any existing highlights
    const existingHighlights = previewElement.querySelectorAll('.highlight');
    existingHighlights.forEach(el => {
      el.classList.remove('highlight');
      el.classList.remove('fade-highlight');
    });
    
    // Determine which section to highlight based on field name
    let sectionToHighlight = null;
    
    switch(fieldName) {
      case 'discloserName':
      case 'recipientName':
      case 'discloserAddress':
      case 'recipientAddress':
        // Find the first paragraph containing party names - not the title
        const partyRows = previewElement.querySelectorAll('.section-row');
        partyRows.forEach(row => {
          const text = row.textContent;
          if ((text.includes('This Agreement is made by') || text.includes('Это Соглашение заключено между')) 
              && (text.includes(formData.discloserName) || text.includes(formData.recipientName)
                  || text.includes('[Disclosing Party Name]') || text.includes('[Receiving Party Name]'))) {
            sectionToHighlight = row;
          }
        });
        break;
      case 'effectiveDate':
        const dateSections = previewElement.querySelectorAll('.section-title');
        dateSections.forEach(section => {
          if (section.textContent.includes('EFFECTIVE DATE') || section.textContent.includes('ДАТА ВСТУПЛЕНИЯ')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'purpose':
      case 'customPurpose':
        const purposeSections = previewElement.querySelectorAll('.section-title');
        purposeSections.forEach(section => {
          if (section.textContent.includes('PERMITTED USE') || section.textContent.includes('ДОПУСТИМОЕ ИСПОЛЬЗОВАНИЕ')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'confInfoType':
      case 'customConfInfo':
        const confSections = previewElement.querySelectorAll('.section-title');
        confSections.forEach(section => {
          if (section.textContent.includes('CONFIDENTIAL INFORMATION') || section.textContent.includes('КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'protectionPeriod':
        const protectionSections = previewElement.querySelectorAll('.section-title');
        protectionSections.forEach(section => {
          if (section.textContent.includes('PROTECTION PERIOD') || section.textContent.includes('СРОК НЕРАЗГЛАШЕНИЯ')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'terminationNotice':
        const termSections = previewElement.querySelectorAll('.section-title');
        termSections.forEach(section => {
          if (section.textContent.includes('TERM AND TERMINATION') || section.textContent.includes('СРОК ДЕЙСТВИЯ')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'governingLaw':
        const govSections = previewElement.querySelectorAll('.section-title');
        govSections.forEach(section => {
          if (section.textContent.includes('GOVERNING LAW') || section.textContent.includes('ПРИМЕНИМОЕ ПРАВО')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'includeNoWarranty':
        const warrantySections = previewElement.querySelectorAll('.section-title');
        warrantySections.forEach(section => {
          if (section.textContent.includes('NO WARRANTIES') || section.textContent.includes('НЕТ ГАРАНТИЙ')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'includeSeverability':
        const severabilitySections = previewElement.querySelectorAll('.section-title');
        severabilitySections.forEach(section => {
          if (section.textContent.includes('SEVERABILITY') || section.textContent.includes('НЕЗАВИСИМОСТЬ')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
      case 'controllingLanguage':
        const langSections = previewElement.querySelectorAll('.section-title');
        langSections.forEach(section => {
          if (section.textContent.includes('PREVAILING LANGUAGE') || section.textContent.includes('ПРЕОБЛАДАЮЩИЙ ЯЗЫК')) {
            sectionToHighlight = section.parentElement;
          }
        });
        break;
    }
    
    if (sectionToHighlight) {
      // Add highlight class
      sectionToHighlight.classList.add('highlight');
      
      // Scroll into view
      sectionToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        sectionToHighlight.classList.add('fade-highlight');
        sectionToHighlight.classList.remove('highlight');
        
        // Remove all highlight classes after fade
        setTimeout(() => {
          sectionToHighlight.classList.remove('fade-highlight');
        }, 1000);
      }, 2000);
    }
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
  
  // Fixed copy document to clipboard function
  const copyToClipboard = async () => {
    try {
      const previewElement = document.getElementById('preview-document');
      if (!previewElement) {
        alert('Document not found. Please try again.');
        return;
      }
      
      // Get text content, removing HTML tags
      const docText = previewElement.textContent || previewElement.innerText;
      
      if (!docText || docText.trim().length === 0) {
        alert('No document content to copy. Please fill in the form first.');
        return;
      }
      
      // Try using the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(docText);
          alert('Document copied to clipboard successfully!');
          return;
        } catch (err) {
          console.log('Modern clipboard API failed, trying fallback...');
        }
      }
      
      // Fallback method using a temporary textarea
      const textArea = document.createElement('textarea');
      textArea.value = docText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          alert('Document copied to clipboard successfully!');
        } else {
          throw new Error('execCommand failed');
        }
      } catch (err) {
        console.error('Fallback copy failed:', err);
        
        // Final fallback - show the text in a modal for manual copying
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          max-width: 90%;
          max-height: 80vh;
          overflow: auto;
          z-index: 10000;
        `;
        
        modal.innerHTML = `
          <h3 style="margin-bottom: 10px;">Copy Document Manually</h3>
          <p style="margin-bottom: 10px;">Select all text below and copy manually (Ctrl+C or Cmd+C):</p>
          <textarea style="width: 100%; height: 300px; border: 1px solid #ccc; padding: 10px;" readonly>${docText}</textarea>
          <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 8px 16px; background: #0069ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        `;
        
        document.body.appendChild(modal);
        
        // Select all text in the textarea
        const textarea = modal.querySelector('textarea');
        textarea.focus();
        textarea.select();
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Failed to copy document. Please try selecting the text manually from the preview.');
    }
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
      parties: (discloserName, discloserAddress, recipientName, recipientAddress) => {
        return `This Agreement is made by <strong>${discloserName || '[Disclosing Party Name]'}</strong> located at ${discloserAddress || '[Disclosing Party Address]'} (the "Disclosing Party"), and <strong>${recipientName || '[Receiving Party Name]'}</strong> located at ${recipientAddress || '[Receiving Party Address]'} (the "Receiving Party"). (each a "Party" and, collectively, the "Parties").`;
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
      
      permittedUse: (purpose, customPurpose) => {
        let purposeText = '';
        switch(purpose) {
          case 'business':
            purposeText = 'discussing a potential business relationship';
            break;
          case 'services':
            purposeText = 'enabling the Receiving Party to provide services to the Disclosing Party';
            break;
          case 'investment':
            purposeText = 'discussing potential investment opportunities';
            break;
          case 'custom':
            purposeText = customPurpose || '[Purpose of Disclosure]';
            break;
          default:
            purposeText = '[Purpose of Disclosure]';
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
This Agreement shall be governed by the law of the State of California, USA, without regard to its conflict of law provisions. All disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts located in Los Angeles, California.`,
        
        delaware: `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of the State of Delaware, USA, without regard to its conflict of law provisions. All disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts located in Wilmington, Delaware.`,
        
        newyork: `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of the State of New York, USA, without regard to its conflict of law provisions. All disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts located in New York, New York.`,
        
        russia: `<div class="section-title">8. GOVERNING LAW</div>
This Agreement shall be governed by the law of the Russian Federation. All disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts of Moscow, Russia.`
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
        return `Это Соглашение заключено между <strong>${discloserName || '[Наименование Раскрывающей Стороны]'}</strong>, с адресом ${discloserAddress || '[Адрес Раскрывающей Стороны]'} ("Раскрывающая Сторона") и <strong>${recipientName || '[Наименование Получателя]'}</strong>, с адресом ${recipientAddress || '[Адрес Получателя]'} ("Получатель"). (далее вместе именуемые "Стороны", а каждая в отдельности – "Сторона").`;
      },
      effectiveDate: (effectiveDate) => {
        const formattedDate = effectiveDate ? new Date(effectiveDate).toLocaleDateString('ru-RU', {
          year: 'numeric', month: 'long', day: 'numeric'
        }) : '[Дата Вступления в Силу]';
        
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
      
      permittedUse: (purpose, customPurpose) => {
        let purposeText = '';
        switch(purpose) {
          case 'business':
            purposeText = 'обсуждения потенциальных деловых отношений';
            break;
          case 'services':
            purposeText = 'предоставления Получателем услуг Раскрывающей Стороне';
            break;
          case 'investment':
            purposeText = 'обсуждения возможностей инвестирования';
            break;
          case 'custom':
            purposeText = customPurpose || '[Цель Раскрытия]';
            break;
          default:
            purposeText = '[Цель Раскрытия]';
        }
        
        // Fixed Russian text as required (removed "между Сторонами")
        return `<div class="section-title">4. ДОПУСТИМОЕ ИСПОЛЬЗОВАНИЕ И РАЗГЛАШЕНИЕ</div>
Получатель может пользоваться Конфиденциальной Информацией только для ${purposeText}. Получатель может разгласить Конфиденциальную Информацию своим директорам, должностным лицам, консультантам и агентам ("Представителям"), но только если этим лицам необходимо ее знать в ходе работы на Получателя для потенциальных или продолжения текущих деловых сделок Сторон и если на этих лиц возложена обязанность сохранения конфиденциальности в неменьшем объеме, чем эта обязанность возложена данным Соглашением на самого Получателя. Получатель несет полную ответственность за любое нарушение данного Соглашения своими Представителями. Получатель обязан обеспечивать конфиденциальность информации разумными мерами предосторожности, сопоставимыми с теми мерами, которыми он охраняет собственную конфиденциальную информацию. Получатель может разглашать Конфиденциальную информацию только в случаях, оговоренных данным Соглашением.`;
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
Настоящее соглашение регулируется законодательством штата Калифорния, США, без учета его положений о коллизионном праве. Все споры, возникающие из настоящего соглашения, подлежат исключительной юрисдикции судов штата и федеральных судов, расположенных в Лос-Анджелесе, Калифорния.`,
        
        delaware: `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством штата Делавэр, США, без учета его положений о коллизионном праве. Все споры, возникающие из настоящего соглашения, подлежат исключительной юрисдикции судов штата и федеральных судов, расположенных в Уилмингтоне, Делавэр.`,
        
        newyork: `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством штата Нью-Йорк, США, без учета его положений о коллизионном праве. Все споры, возникающие из настоящего соглашения, подлежат исключительной юрисдикции судов штата и федеральных судов, расположенных в Нью-Йорке, Нью-Йорк.`,
        
        russia: `<div class="section-title">8. ПРИМЕНИМОЕ ПРАВО</div>
Настоящее соглашение регулируется законодательством Российской Федерации. Все споры, возникающие из настоящего соглашения, подлежат исключительной юрисдикции судов Москвы, Россия.`
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
      governingLaw: "Determines which jurisdiction's laws will be applied to interpret the agreement. Critical for international agreements.",
      returnDestroy: "Requires the receiving party to return or destroy confidential information upon request, ensuring no copies remain.",
      noWarranty: "Protects the disclosing party from liability if the information turns out to be incorrect or causes damages.",
      severability: "Ensures the entire agreement doesn't become invalid if one provision is found unenforceable.",
      controllingLanguage: "In bilingual agreements, specifies which language version prevails in case of discrepancies.",
      // Dynamic explanations for confidentiality definitions
      confInfoExplanations: {
        broad: "This broad definition covers virtually all non-public information shared, including verbal communications and information that should reasonably be considered confidential. Ideal for protecting all types of business information but may be harder to enforce due to its wide scope.",
        medium: "This balanced definition focuses on business-related information while providing specific examples. It includes trade secrets, technical data, and business information. Recommended for most business relationships.",
        narrow: "This narrow definition only protects information specifically marked as confidential in writing. Provides the clearest boundaries but risks excluding important verbal disclosures. Best for limited disclosures or when dealing with highly organized documentation.",
        custom: "A custom definition allows you to specify exactly what information should be protected based on your specific needs."
      }
    },
    russian: {
      disclosureParty: "Сторона, которая владеет и раскрывает конфиденциальную информацию. Обычно это бизнес или лицо, раскрывающее конфиденциальные данные.",
      receivingParty: "Сторона, которая получает конфиденциальную информацию. Эта сторона обязана защищать и не злоупотреблять информацией.",
      effectiveDate: "Дата, когда соглашение станов��тся юридически обязательным. Важно для расчета сроков защиты и понимания начала обязательств.",
      confidentialityDefinition: "Определяет, какая информация защищена. Более широкие определения защищают больше информации, но их сложнее обеспечить исполнение.",
      purpose: "Четкое определение цели ограничивает использование конфиденциальной информации и помогает предотвратить злоупотребления.",
      protectionPeriod: "Как долго получающая сторона должна сохранять информацию конфиденциальной. Обычные сроки 2-5 лет.",
      governingLaw: "Определяет, законы какой юрисдикции будут применяться для толкования соглашения. Критично для международных соглашений.",
      returnDestroy: "Требует от получающей стороны вернуть или уничтожить конфиденциальную информацию по запросу.",
      noWarranty: "Защищает раскрывающую сторону от ответственности, если информация окажется неверной или причинит ущерб.",
      severability: "Гарантирует, что все соглашение не станет недействительным, если одно положение будет признано неисполнимым.",
      controllingLanguage: "В двуязычных соглашениях указывает, какая языковая версия имеет преимущество в случае расхождений.",
      confInfoExplanations: {
        broad: "Это широкое определение охватывает практически всю непубличную информацию, включая устные сообщения и информацию, которую разумно считать конфиденциальной. Идеально для защиты всех типов деловой информации, но может быть сложнее в исполнении из-за широкого охвата.",
        medium: "Это сбалансированное определение фокусируется на деловой информации с конкретными примерами. Включает коммерческую тайну, технические данные и деловую информацию. Рекомендуется для большинства деловых отношений.",
        narrow: "Это узкое определение защищает только информацию, явно помеченную как конфиденциальная в письменной форме. Обеспечивает четкие границы, но рискует исключить важные устные раскрытия. Лучше всего для ограниченных раскрытий.",
        custom: "Пользовательское определение позволяет указать, какая именно информация должна быть защищена, исходя из ваших конкретных потребностей."
      }
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
        ${templates.english.permittedUse(purpose, customPurpose)}
      </div>
      <div class="column right-column">
        ${templates.russian.permittedUse(purpose, customPurpose)}
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
    
    // Controlling Language section - handle fallback for removed "both" option
    const validControllingLanguage = (controllingLanguage === 'english' || controllingLanguage === 'russian') ? controllingLanguage : 'english';
    
    documentContent += `
    <div class="section-row">
      <div class="column left-column">
        <div class="section-title">${enControllingLangNum}. PREVAILING LANGUAGE</div>
        ${templates.english.controllingLanguage[validControllingLanguage].split('</div>')[1]}
      </div>
      <div class="column right-column">
        <div class="section-title">${enControllingLangNum}. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</div>
        ${templates.russian.controllingLanguage[validControllingLanguage].split('</div>')[1]}
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
    <span class="help-icon">
      ?
      <span class="help-tooltip">
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
                <option value="business">
                  {currentLanguage === 'english' 
                    ? 'Discussing potential business relationship' 
                    : 'Обсуждение потенциальных деловых отношений'}
                </option>
                <option value="services">
                  {currentLanguage === 'english' 
                    ? 'To enable receiving party to provide services' 
                    : 'Для предоставления услуг получателем'}
                </option>
                <option value="investment">
                  {currentLanguage === 'english' 
                    ? 'To discuss investment opportunities' 
                    : 'Для обсуждения инвестиционных возможностей'}
                </option>
                <option value="custom">
                  {currentLanguage === 'english' ? 'Other (specify below)' : 'Другое (укажите ниже)'}
                </option>
              </select>
            </div>
            
            {formData.purpose === 'custom' && (
              <div className="form-group">
                <label htmlFor="customPurpose">
                  {currentLanguage === 'english' ? 'Specify Purpose:' : 'Укажите Цель:'}
                </label>
                <textarea 
                  id="customPurpose"
                  name="customPurpose"
                  value={formData.customPurpose}
                  onChange={handleChange}
                  placeholder={currentLanguage === 'english' 
                    ? 'Enter specific purpose for sharing confidential information' 
                    : 'Введите конкретную цель обмена конфиденциальной информацией'}
                />
              </div>
            )}
          </div>
        );
      
      case 'terms':
        return (
          <div className="tab-content active">
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
            
            {/* Dynamic explanation for confidentiality definitions */}
            {formData.confInfoType !== 'custom' && (
              <div className="form-explanation">
                {tooltips.confInfoExplanations[formData.confInfoType]}
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
                max="25"
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
              </select>
            </div>
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
              <div className="checkbox-note">
                {currentLanguage === 'english' 
                  ? 'Adds explicit obligation to return or destroy all confidential materials upon termination. Essential for physical documents and prototypes.'
                  : 'Добавляет явное обязательство вернуть или уничтожить все конфиденциальные материалы по окончании. Важно для физических документов и прототипов.'}
              </div>
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
              <div className="checkbox-note">
                {currentLanguage === 'english' 
                  ? 'Disclaims liability for accuracy or completeness of disclosed information. Recommended when sharing preliminary or unverified data.'
                  : 'Отказ от ответственности за точность или полноту раскрытой информации. Рекомендуется при обмене предварительными или непроверенными данными.'}
              </div>
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
              <div className="checkbox-note">
                {currentLanguage === 'english' 
                  ? 'Preserves validity of remaining provisions if one section is found unenforceable. Standard in international agreements to prevent total invalidation.'
                  : 'Сохраняет действительность остальных положений, если одно признано неисполнимым. Стандарт в международных соглашениях для предотвращения полной недействительности.'}
              </div>
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
        
      case 'summary':
        return (
          <div className="tab-content active">
            <h3>{currentLanguage === 'english' ? 'Agreement Summary' : 'Итог Соглашения'}</h3>
            
            {/* Parties Summary */}
            <div className="summary-section">
              <h4>{currentLanguage === 'english' ? 'Parties' : 'Стороны'}</h4>
              <div className={`summary-item ${!formData.discloserName || !formData.discloserAddress ? 'warning-red' : 'success-green'}`}>
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Disclosing Party:' : 'Раскрывающая Сторона:'}
                </span>
                <span className="summary-value">
                  {formData.discloserName || (currentLanguage === 'english' ? '[Missing]' : '[Отсутствует]')}
                  {formData.discloserAddress && `, ${formData.discloserAddress}`}
                </span>
              </div>
              <div className={`summary-item ${!formData.recipientName || !formData.recipientAddress ? 'warning-red' : 'success-green'}`}>
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Receiving Party:' : 'Получатель:'}
                </span>
                <span className="summary-value">
                  {formData.recipientName || (currentLanguage === 'english' ? '[Missing]' : '[Отсутствует]')}
                  {formData.recipientAddress && `, ${formData.recipientAddress}`}
                </span>
              </div>
            </div>
            
            {/* Key Terms Summary */}
            <div className="summary-section">
              <h4>{currentLanguage === 'english' ? 'Key Terms' : 'Основные Условия'}</h4>
              <div className={`summary-item ${!formData.effectiveDate ? 'warning-red' : 'success-green'}`}>
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Effective Date:' : 'Дата Вступления в Силу:'}
                </span>
                <span className="summary-value">
                  {formData.effectiveDate || (currentLanguage === 'english' ? '[Not Set]' : '[Не Указано]')}
                </span>
              </div>
              <div className="summary-item success-green">
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Purpose:' : 'Цель:'}
                </span>
                <span className="summary-value">
                  {formData.purpose === 'custom' ? formData.customPurpose || 'Custom' : 
                   formData.purpose === 'business' ? (currentLanguage === 'english' ? 'Business relationship' : 'Деловые отношения') :
                   formData.purpose === 'services' ? (currentLanguage === 'english' ? 'Services provision' : 'Предоставление услуг') :
                   formData.purpose === 'investment' ? (currentLanguage === 'english' ? 'Investment discussion' : 'Обсуждение инвестиций') : 
                   formData.purpose}
                </span>
              </div>
              <div className="summary-item success-green">
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Confidentiality Definition:' : 'Определение Конфиденциальности:'}
                </span>
                <span className="summary-value">
                  {formData.confInfoType === 'custom' ? (currentLanguage === 'english' ? 'Custom' : 'Пользовательское') : 
                   formData.confInfoType === 'broad' ? (currentLanguage === 'english' ? 'Broad' : 'Широкое') :
                   formData.confInfoType === 'medium' ? (currentLanguage === 'english' ? 'Medium' : 'Среднее') :
                   formData.confInfoType === 'narrow' ? (currentLanguage === 'english' ? 'Narrow' : 'Узкое') :
                   formData.confInfoType.charAt(0).toUpperCase() + formData.confInfoType.slice(1)}
                </span>
              </div>
              <div className={`summary-item ${formData.protectionPeriod > 5 ? 'warning-yellow' : 'success-green'}`}>
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Protection Period:' : 'Срок Защиты:'}
                </span>
                <span className="summary-value">
                  {formData.protectionPeriod} {currentLanguage === 'english' ? 'years' : 'лет'}
                </span>
              </div>
              
              {formData.protectionPeriod > 5 && (
                <div className="summary-warning">
                  {currentLanguage === 'english' 
                    ? '⚠️ Note: Protection periods longer than 5 years may be difficult to enforce in some jurisdictions'
                    : '⚠️ Примечание: Сроки защиты более 5 лет могут быть трудно исполнимы в некоторых юрисдикциях'}
                </div>
              )}
            </div>
            
            {/* Jurisdiction Summary */}
            <div className="summary-section">
              <h4>{currentLanguage === 'english' ? 'Jurisdiction' : 'Юрисдикция'}</h4>
              <div className={`summary-item ${formData.governingLaw === 'russia' && formData.controllingLanguage === 'english' ? 'warning-yellow' : 'success-green'}`}>
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Governing Law:' : 'Применимое Право:'}
                </span>
                <span className="summary-value">
                  {formData.governingLaw === 'california' ? (currentLanguage === 'english' ? 'California, USA' : 'Калифорния, США') :
                   formData.governingLaw === 'delaware' ? (currentLanguage === 'english' ? 'Delaware, USA' : 'Делавэр, США') :
                   formData.governingLaw === 'newyork' ? (currentLanguage === 'english' ? 'New York, USA' : 'Нью-Йорк, США') :
                   formData.governingLaw === 'russia' ? (currentLanguage === 'english' ? 'Russian Federation' : 'Российская Федерация') :
                   formData.governingLaw}
                </span>
              </div>
              <div className="summary-item success-green">
                <span className="summary-label">
                  {currentLanguage === 'english' ? 'Controlling Language:' : 'Преобладающий Язык:'}
                </span>
                <span className="summary-value">
                  {formData.controllingLanguage === 'english' ? (currentLanguage === 'english' ? 'English' : 'Английский') :
                   formData.controllingLanguage === 'russian' ? (currentLanguage === 'english' ? 'Russian' : 'Русский') :
                   formData.controllingLanguage}
                </span>
              </div>
              
              {formData.governingLaw === 'russia' && formData.controllingLanguage === 'english' && (
                <div className="summary-warning">
                  {currentLanguage === 'english' 
                    ? '⚠️ Note: Using English as controlling language with Russian law may create enforcement challenges'
                    : '⚠️ Примечание: Использование английского как преобладающего языка с российским правом может создать сложности с исполнением'}
                </div>
              )}
            </div>
            
            {/* Additional Provisions Summary */}
            <div className="summary-section">
              <h4>{currentLanguage === 'english' ? 'Additional Provisions' : 'Дополнительные Положения'}</h4>
              <div className="provisions-list">
                {formData.includeReturnDestroy ? (
                  <div className="provision-included">
                    ✓ {currentLanguage === 'english' ? 'Return/Destruction of Materials' : 'Возврат/Уничтожение Материалов'}
                  </div>
                ) : (
                  <div className="provision-excluded">
                    ✗ {currentLanguage === 'english' ? 'Return/Destruction NOT included' : 'Возврат/Уничтожение НЕ включено'}
                  </div>
                )}
                
                {formData.includeNoWarranty ? (
                  <div className="provision-included">
                    ✓ {currentLanguage === 'english' ? 'No Warranty Clause' : 'Отсутствие Гарантий'}
                  </div>
                ) : (
                  <div className="provision-excluded">
                    ✗ {currentLanguage === 'english' ? 'No Warranty Clause NOT included' : 'Отсутствие Гарантий НЕ включено'}
                  </div>
                )}
                
                {formData.includeSeverability ? (
                  <div className="provision-included">
                    ✓ {currentLanguage === 'english' ? 'Severability Clause' : 'Независимость Положений'}
                  </div>
                ) : (
                  <div className="provision-excluded">
                    ✗ {currentLanguage === 'english' ? 'Severability Clause NOT included' : 'Независимость Положений НЕ включено'}
                  </div>
                )}
              </div>
              
              {/* Warnings for excluded provisions */}
              {!formData.includeReturnDestroy && (
                <div className="summary-warning">
                  {currentLanguage === 'english' 
                    ? '⚠️ Without Return/Destruction clause: The receiving party may retain confidential materials indefinitely, even after the agreement ends. This could lead to unauthorized retention of sensitive information.'
                    : '⚠️ Без условия о возврате/уничтожении: Получающая сторона может сохранять конфиденциальные материалы неопределенно долго, даже после окончания соглашения. Это может привести к несанкционированному хранению конфиденциальной информации.'}
                </div>
              )}
              
              {!formData.includeNoWarranty && (
                <div className="summary-warning">
                  {currentLanguage === 'english' 
                    ? '⚠️ Without No Warranty clause: The disclosing party could be held liable if the confidential information is inaccurate, incomplete, or causes damages. This creates potential legal exposure.'
                    : '⚠️ Без отказа от гарантий: Раскрывающая сторона может быть привлечена к ответственности, если конфиденциальная информация неточна, неполна или причиняет ущерб. Это создает потенциальные юридические риски.'}
                </div>
              )}
              
              {!formData.includeSeverability && (
                <div className="summary-warning">
                  {currentLanguage === 'english' 
                    ? '⚠️ Without Severability clause: If any provision is found unenforceable, the entire agreement could be invalidated. This is particularly risky for international agreements where laws vary.'
                    : '⚠️ Без независимости положений: Если какое-либо положение будет признано неисполнимым, все соглашение может быть признано недействительным. Это особенно рискованно для международных соглашений, где законы различаются.'}
                </div>
              )}
            </div>
            
            {/* Final Status */}
            <div className="summary-section">
              <h4>{currentLanguage === 'english' ? 'Status' : 'Статус'}</h4>
              {(!formData.discloserName || !formData.recipientName || !formData.effectiveDate) ? (
                <div className="status-incomplete">
                  {currentLanguage === 'english' 
                    ? '❌ Agreement incomplete - required information missing'
                    : '❌ Соглашение не завершено - отсутствует обязательная информация'}
                </div>
              ) : (
                <div className="status-complete">
                  {currentLanguage === 'english' 
                    ? '✅ Agreement ready for generation'
                    : '✅ Соглашение готово к созданию'}
                </div>
              )}
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
          
          {/* Navigation buttons all on one line */}
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
              className="btn"
              style={{backgroundColor: "#2563eb"}}
              onClick={scheduleConsult}
            >
              <i data-feather="calendar"></i>
              {currentLanguage === 'english' ? 'Consult' : 'Консультация'}
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
