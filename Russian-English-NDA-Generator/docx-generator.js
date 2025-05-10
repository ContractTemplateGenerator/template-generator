// MS Word document generator functionality
window.generateWordDoc = function(formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Function to get text content for each section in both languages
    const getDocumentContent = () => {
      const discloserName = formData.discloserName || '[Disclosing Party Name]';
      const recipientName = formData.recipientName || '[Receiving Party Name]';
      const effectiveDate = formData.effectiveDate ? 
                           new Date(formData.effectiveDate).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                           }) : '[Effective Date]';
      const effectiveDateRu = formData.effectiveDate ? 
                             new Date(formData.effectiveDate).toLocaleDateString('ru-RU', {
                                year: 'numeric', month: 'long', day: 'numeric'
                             }) : '[Effective Date]';
      const purpose = formData.purpose || '[Purpose of Disclosure]';
      const protectionPeriod = formData.protectionPeriod || '2';
      const terminationNotice = formData.terminationNotice || '30';
      const governingLaw = formData.governingLaw || 'california';
      const jurisdiction = formData.jurisdiction || 'los-angeles';
      
      // Fix Russian grammar for purpose text
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
        purposeRussian = 'предоставления услуг';
      }
                           
      // Build document structure with English and Russian side by side
      let documentContent = '';
      
      // Titles
      documentContent += '<table style="width: 100%; margin: 0; border-collapse: collapse;">';
      documentContent += '<tr><td width="48%" style="padding: 10pt; vertical-align: top;"><h2 style="text-align: center;">NON-DISCLOSURE AGREEMENT</h2></td>';
      documentContent += '<td width="4%" style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td>';
      documentContent += '<td width="48%" style="padding: 10pt; vertical-align: top;"><h2 style="text-align: center;">СОГЛАШЕНИЕ О НЕРАЗГЛАШЕНИИ ИНФОРМАЦИИ</h2></td></tr>';
      
      // Parties section
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `This Agreement is made by <strong>${discloserName}</strong> (the "Disclosing Party"), and <strong>${recipientName}</strong> (the "Receiving Party"). (each a "Party" and, collectively, the "Parties").`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `Это Соглашение заключено между <strong>${discloserName}</strong> ("Раскрывающая Сторона") и <strong>${recipientName}</strong> ("Получатель"). (далее вместе именуемые "Стороны", а каждая в отдельности – "Сторона").`;
      documentContent += '</td></tr>';
      
      // Effective Date section
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>1. EFFECTIVE DATE</strong><br>The effective date of this Agreement is ${effectiveDate}.`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>1. ДАТА ВСТУПЛЕНИЯ В СИЛУ</strong><br>Дата вступления в силу настоящего Соглашения ${effectiveDateRu}.`;
      documentContent += '</td></tr>';
      
      // Confidential Information section
      let confInfoTextEN = '';
      let confInfoTextRU = '';
      
      if (formData.confInfoType === 'broad') {
        confInfoTextEN = `"Confidential Information" disclosed under this Agreement is defined as any information, technical data or know-how furnished, whether in written, oral, electronic or other form by the Disclosing Party to the Receiving Party that (a) is marked, accompanied or supported by documents clearly and conspicuously designating such documents as "confidential", "internal use" or the equivalent; (b) is identified by the Disclosing Party as confidential before, during or promptly after the presentation or communication; or (c) should reasonably be known by Receiving Party to be confidential.`;
        confInfoTextRU = `"Конфиденциальная Информация" по данному Соглашению означает любую информацию, технические спецификации или ноу-хау, раскрытые в письменной, устной, электронной или другой форме Раскрывающей Стороной Получателю, которые (а) помечены, сопровождены или подпадают под действие документов ясно помеченных "конфиденциально", "для внутреннего пользования" и т.п.; (b) обозначены как конфиденциальные Раскрывающей Стороной до, во время или после раскрытия или сообщения; или (c) конфиденциальность которых Получатель должен осознать.`;
      } else if (formData.confInfoType === 'medium') {
        confInfoTextEN = `"Confidential Information" disclosed under this Agreement is defined as any non-public information that relates to the actual or anticipated business or research and development of the Disclosing Party, technical data, trade secrets or know-how, including, but not limited to, research, product plans, products, services, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, marketing, finances or other business information disclosed by the Disclosing Party either directly or indirectly in writing, orally or by inspection of parts or equipment.`;
        confInfoTextRU = `"Конфиденциальная Информация" по данному Соглашению означает любую непубличную информацию, которая относится к фактической или ожидаемой деловой деятельности ��ли исследованиям и разработкам Раскрывающей Стороны, техническим данным, коммерческой тайне или ноу-хау, включая, помимо прочего, исследования, планы продуктов, продукты, услуги, списки клиентов, рынки, программное обеспечение, разработки, изобретения, процессы, формулы, технологии, дизайны, чертежи, инженерные решения, маркетинг, финансы или другую деловую информацию, раскрытую Раскрывающей Стороной прямо или косвенно в письменной форме, устно или путем осмотра деталей или оборудования.`;
      } else if (formData.confInfoType === 'narrow') {
        confInfoTextEN = `"Confidential Information" disclosed under this Agreement is defined as only that information which is (a) disclosed in writing and marked as confidential at the time of disclosure, or (b) disclosed in any other manner and identified as confidential at the time of disclosure and also summarized and designated as confidential in a written memorandum delivered to the Receiving Party within thirty (30) days of the disclosure.`;
        confInfoTextRU = `"Конфиденциальная Информация" по данному Соглашению означает только ту информацию, которая (а) раскрыта в письменной форме и помечена как конфиденциальная в момент раскрытия, или (б) раскрыта любым другим способом и обозначена как конфиденциальная в момент раскрытия, а также резюмирована и обозначена как конфиденциальная в письменном меморандуме, направленном Получателю в течение тридцати (30) дней после раскрытия.`;
      } else if (formData.confInfoType === 'custom') {
        confInfoTextEN = formData.customConfInfo || '[Custom Confidentiality Definition]';
        confInfoTextRU = formData.customConfInfo || '[Пользовательское Определение Конфиденциальности]';
      }
      
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>2. CONFIDENTIAL INFORMATION</strong><br>${confInfoTextEN}`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>2. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</strong><br>${confInfoTextRU}`;
      documentContent += '</td></tr>';
      
      // Term and Termination section
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>3. TERM AND TERMINATION</strong><br>This Agreement shall remain in effect until it is terminated by a Party with ${terminationNotice} days prior written notice; provided, however, that no Party shall terminate this Agreement if the Parties have a direct agreement still in effect. The terms and conditions of this Agreement shall survive any such termination with respect to Confidential Information that is disclosed prior to the effective date of termination.`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>3. СРОК ДЕЙСТВИЯ И РАСТОРЖЕНИЕ</strong><br>Данное Соглашение остается в силе до расторжения любой Стороной по предварительному письменному уведомлению за ${terminationNotice} дней; но ни одна Сторона не может расторгнуть данное Соглашение если между Сторонами заключено другое действующее прямое соглашение. В случае расторжения данного Соглашения, его условия продолжат действовать в отношении Конфиденциальной Информации, раскрытой до даты вступления в силу расторжения.`;
      documentContent += '</td></tr>';
      
      // Permitted Use section
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>4. PERMITTED USE AND DISCLOSURE</strong><br>Receiving Party will use Confidential Information only for the purpose of and in connection with ${purpose} between the Parties. Receiving Party may disclose Confidential Information to its directors, officers, employees, contractors, advisors, and agents, so long as such individuals have a need to know in their work for Receiving Party in furtherance of the potential or continued business transaction or relationship between the Parties, and are bound by obligations of confidentiality at least as restrictive as those imposed on Receiving Party in this Agreement, (collectively "Representatives"). Receiving Party is fully liable for any breach of this Agreement by its Representatives. Receiving Party will use the same degree of care, but no less than a reasonable degree of care, as the Receiving Party uses with respect to its own similar information to protect the Confidential Information. Receiving Party may only disclose confidential information as authorized by this Agreement.`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>4. ДОПУСТИМОЕ ИСПОЛЬЗОВАНИЕ И РАЗГЛАШЕНИЕ</strong><br>Получатель может пользоваться Конфиденциальной Информацией только для ${purposeRussian} между Сторонами. Получатель может разгласить Конфиденциальную Информацию своим директорам, должностным лицам, консультантам и агентам ("Представителям"), но только если этим лицам необходимо ее знать в ходе работы на Получателя для потенциальных или продолжения текущих деловых сделок Сторон и если на этих лиц возложена обязанность сохранения конфиденциальности в неменьшем объеме, чем эта обязанность возложена данным Соглашением на самого Получателя. Получатель несет полную ответственность за любое нарушение данного Соглашения своими Представителями. Получатель обязан обеспечивать конфиденциальность информации разумными мерами предосторожности, сопоставимыми с теми мерами, которыми он охраняет собственную конфиденциальную информацию. Получатель может разглашать Конфиденциальную информацию только в случаях, оговоренных данным Соглашением.`;
      documentContent += '</td></tr>';
      
      // Continue with rest of sections...
      documentContent += '</table>';
      
      // Protection Period section
      documentContent += '<table style="width: 100%; margin: 0; border-collapse: collapse;">';
      documentContent += '<tr><td width="48%" style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>5. PROTECTION PERIOD AND RETURN</strong><br>Unless the Parties otherwise agree in writing, a Receiving Party's duty to protect Confidential Information expires ${protectionPeriod} years from the date of disclosure. Upon the Disclosing Party's written request, Receiving Party will promptly return or destroy all Confidential Information received from the Disclosing Party, together with all copies.`;
      documentContent += '</td><td width="4%" style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td width="48%" style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>5. СРОК НЕРАЗГЛАШЕНИЯ И ВОЗВРАТ</strong><br>При отсутствии письменной договоренности между Сторонами об ином, обязанность Получателя о неразглашении Конфиденциальной Информации истекает через ${protectionPeriod} года после ее предоставления. По письменному распоряжению Раскрывающей Стороны Получатель должен незамедлительно вернуть или уничтожить всю полученную Конфиденциальную Информацию и все ее копии.`;
      documentContent += '</td></tr>';
      
      // Exclusions section
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>6. EXCLUSIONS</strong><br>Confidential Information will not include any information that: (a) is or becomes part of the public domain through no fault of Receiving Party; (b) was rightfully in Receiving Party's possession at the time of disclosure, without restriction as to use or disclosure; or (c) Receiving Party rightfully receives from a third party who has the right to disclose it and who provides it without restriction as to use or disclosure.`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>6. ИСКЛЮЧЕНИЯ</strong><br>Конфиденциальная Информация не включает информацию, которая: (a) является или становится общедоступной не по вине Получателя; (b) во время разглашения находилась в правомерном распоряжении Получателя без ограничений на её использование и разглашение; или (c) информацию, правомерно полученную Получателя от третьего лица без ограничений на использование и разглашение.`;
      documentContent += '</td></tr>';
      
      // No Warranty section (conditional)
      if (formData.includeNoWarranty) {
        documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
        documentContent += `<strong>7. NO WARRANTIES</strong><br>The Confidential Information is provided with no warranties of any kind. The Disclosing Party is not liable for direct or indirect damages, which occur to the Receiving Party while using the Confidential Information. All Confidential Information disclosed will remain property of the Disclosing Party.`;
        documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
        documentContent += `<strong>7. НЕТ ГАРАНТИЙ</strong><br>Конфиденциальная Информация предоставлена без каких-либо гарантий. Раскрывающая Сторона не несет ответственности за прямой или косвенный ущерб, понесенный Получателем информации при использовании Конфиденциальной Информации. Вся предоставленная Конфиденциальная Информация остается собственностью Раскрывающей Стороны.`;
        documentContent += '</td></tr>';
      }
      
      // Governing Law section
      let govLawEN = '', govLawRU = '';
      let sectionNum = formData.includeNoWarranty ? '8' : '7';
      
      switch(governingLaw) {
        case 'california':
          govLawEN = `This Agreement shall be governed by the law of the State of California, USA. Los Angeles, CA is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`;
          govLawRU = `Настоящее соглашение регулируется законодательством штата California, США. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать Los Angeles, CA.`;
          break;
        case 'delaware':
          govLawEN = `This Agreement shall be governed by the law of the State of Delaware, USA. Wilmington, DE is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`;
          govLawRU = `Настоящее соглашение регулируется законодательством штата Delaware, США. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать Wilmington, DE.`;
          break;
        case 'newyork':
          govLawEN = `This Agreement shall be governed by the law of the State of New York, USA. New York, NY is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`;
          govLawRU = `Настоящее соглашение регулируется законодательством штата New York, США. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать New York, NY.`;
          break;
        case 'russia':
          govLawEN = `This Agreement shall be governed by the law of the Russian Federation. Moscow, Russia is agreed upon as place of jurisdiction for all disputes arising from this Agreement.`;
          govLawRU = `Настоящее соглашение регулируется законодательством Российской Федерации. Местом рассмотрения всех споров, возникающих в связи с настоящим соглашением, стороны договорились считать Москву, Россия.`;
          break;
      }
      
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>${sectionNum}. GOVERNING LAW</strong><br>${govLawEN}`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>${sectionNum}. ПРИМЕНИМОЕ ПРАВО</strong><br>${govLawRU}`;
      documentContent += '</td></tr>';
      
      // Severability section (conditional)
      if (formData.includeSeverability) {
        sectionNum = (parseInt(sectionNum) + 1).toString();
        documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
        documentContent += `<strong>${sectionNum}. SEVERABILITY</strong><br>If any provision of this Agreement is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions of this Agreement will remain in full force and effect, and the provision affected will be construed so as to be enforceable to the maximum extent permissible by law.`;
        documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
        documentContent += `<strong>${sectionNum}. НЕЗАВИСИМОСТЬ ПОЛОЖЕНИЙ</strong><br>Если какое-либо положение настоящего Соглашения становится незаконным или необеспеченным принудительной силой в суде соответствующей юрисдикции, это не повлияет на юридическую силу или возможность принудительного исполнения какого-либо другого положения настоящего Соглашения в наибольшей разрешенной законом степени.`;
        documentContent += '</td></tr>';
      }
      
      // Controlling Language section
      sectionNum = (parseInt(sectionNum) + 1).toString();
      let controlLangEN = '', controlLangRU = '';
      
      switch(formData.controllingLanguage) {
        case 'english':
          controlLangEN = `In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, the English version shall prevail.`;
          controlLangRU = `В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, текст на английском языке будет иметь преимущественную силу.`;
          break;
        case 'russian':
          controlLangEN = `In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, the Russian version shall prevail.`;
          controlLangRU = `В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, текст на русском языке будет иметь преимущественную силу.`;
          break;
        case 'both':
          controlLangEN = `In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation, both versions shall be equally authoritative.`;
          controlLangRU = `В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего Соглашения на английском языке и русским переводом, обе версии будут иметь одинаковую юридическую силу.`;
          break;
      }
      
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>${sectionNum}. PREVAILING LANGUAGE</strong><br>${controlLangEN}`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>${sectionNum}. ПРЕОБЛАДАЮЩИЙ ЯЗЫК</strong><br>${controlLangRU}`;
      documentContent += '</td></tr>';
      
      // Signatures section
      documentContent += '<tr><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>IN WITNESS WHEREOF</strong><br>The Parties hereto have executed this Agreement.<br><br>
        <strong>Disclosing Party:</strong><br><br>
        By: _________________________________<br>
        Name: ______________________________<br>
        Title:________________________________<br>
        Date: _______________________________<br><br>
        <strong>Receiving Party:</strong><br><br>
        By: _________________________________<br>
        Name: ______________________________<br>
        Title:________________________________<br>
        Date: _______________________________`;
      documentContent += '</td><td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td><td style="padding: 10pt; vertical-align: top;">';
      documentContent += `<strong>В ПОДТВЕРЖДЕНИЕ ВЫШЕИЗЛОЖЕННОГО</strong><br>Стороны заключили настоящее Соглашение.<br><br>
        <strong>Раскрывающая Сторона:</strong><br><br>
        Подпись: _____________________________<br>
        Ф.И.О: _______________________________<br>
        Должность:___________________________<br>
        Дата: ________________________________<br><br>
        <strong>Получатель:</strong><br><br>
        Подпись: _____________________________<br>
        Ф.И.О: _______________________________<br>
        Должность:___________________________<br>
        Дата: ________________________________`;
      documentContent += '</td></tr>';
      
      documentContent += '</table>';
      
      return documentContent;
    };
    
    // Create HTML content for Word document with better margins
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Dual-Language NDA | ${formData.discloserName || 'Disclosing Party'} and ${formData.recipientName || 'Receiving Party'}</title>
        <style>
          @page {
            margin: 0.5in;
          }
          body {
            font-family: Calibri, Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 0;
          }
          td {
            vertical-align: top;
            padding: 5pt;
          }
          h2 {
            font-size: 14pt;
            margin-bottom: 15pt;
            font-weight: bold;
            text-align: center;
          }
          strong {
            font-weight: bold;
          }
          .page-break {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        ${getDocumentContent()}
      </body>
      </html>
    `;
    
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], {type: 'application/msword;charset=utf-8'});
    
    // Create download link and trigger download
    const fileName = `NDA-${formData.discloserName || 'Disclosing-Party'}-${formData.recipientName || 'Receiving-Party'}.doc`
                     .replace(/[^a-zA-Z0-9]/g, '-');
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
    return true;
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
    return false;
  }
};