// MS Word Document Generator for Dual-Language Contractor Agreement
window.generateWordDoc = function(formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Build the document text based on form data
    let documentText = '';
    
    // Title
    documentText += 'INDEPENDENT CONTRACTOR AGREEMENT\n';
    documentText += 'ДОГОВОР НЕЗАВИСИМОГО ПОДРЯДЧИКА\n\n';
    
    // Parties section
    documentText += 'This Independent Contractor Agreement ("Agreement") is entered into as of ';
    documentText += formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString('en-US') : '[Date]';
    documentText += ' between ';
    documentText += formData.companyName || '[Company Name]';
    documentText += ', located at ';
    documentText += [formData.companyAddress, formData.companyCity, formData.companyState, formData.companyZip].filter(Boolean).join(', ') || '[Company Address]';
    documentText += ' ("Company"), and ';
    documentText += formData.contractorName || '[Contractor Name]';
    documentText += ', located at ';
    documentText += [formData.contractorAddress, formData.contractorCity, formData.contractorState, formData.contractorZip].filter(Boolean).join(', ') || '[Contractor Address]';
    documentText += ' ("Contractor").\n\n';
    
    // Russian version of parties
    documentText += 'Настоящий Договор Независимого Подрядчика ("Договор") заключен ';
    documentText += formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString('ru-RU') : '[Дата]';
    documentText += ' между ';
    documentText += formData.companyName || '[Название Компании]';
    documentText += ', расположенной по адресу ';
    documentText += [formData.companyAddress, formData.companyCity, formData.companyState, formData.companyZip].filter(Boolean).join(', ') || '[Адрес Компании]';
    documentText += ' ("Компания"), и ';
    documentText += formData.contractorName || '[Имя Подрядчика]';
    documentText += ', расположенным по адресу ';
    documentText += [formData.contractorAddress, formData.contractorCity, formData.contractorState, formData.contractorZip].filter(Boolean).join(', ') || '[Адрес Подрядчика]';
    documentText += ' ("Подрядчик").\n\n';
    
    // Services section
    documentText += '1. SERVICES / УСЛУГИ\n\n';
    documentText += 'Contractor agrees to perform the following services: ';
    documentText += formData.servicesDescription || '[Description of services]';
    documentText += '\n\n';
    documentText += 'Подрядчик соглашается выполнять следующие услуги: ';
    documentText += formData.servicesDescription || '[Описание услуг]';
    documentText += '\n\n';
    
    // Compensation section
    documentText += '2. COMPENSATION / ОПЛАТА\n\n';
    if (formData.compensationType === 'hourly') {
      documentText += 'Company shall pay Contractor at the rate of $' + (formData.hourlyRate || '[Rate]') + ' per hour.\n\n';
      documentText += 'Компания будет платить Подрядчику по ставке $' + (formData.hourlyRate || '[Ставка]') + ' в час.\n\n';
    } else if (formData.compensationType === 'fixed') {
      documentText += 'Company shall pay Contractor a fixed fee of $' + (formData.fixedAmount || '[Amount]') + '.\n\n';
      documentText += 'Компания выплатит Подрядчику фиксированную сумму в размере $' + (formData.fixedAmount || '[Сумма]') + '.\n\n';
    }
    
    // Payment terms
    documentText += 'Payment shall be made within ' + (formData.paymentTerms || '30') + ' days of invoice.\n\n';
    documentText += 'Оплата должна быть произведена в течение ' + (formData.paymentTerms || '30') + ' дней после выставления счета.\n\n';
    
    // Add other sections based on options selected
    if (formData.includeIPAssignment) {
      documentText += '3. INTELLECTUAL PROPERTY / ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ\n\n';
      documentText += 'All work product created by Contractor shall be the property of Company.\n\n';
      documentText += 'Все результаты работы, созданные Подрядчиком, являются собственностью Компании.\n\n';
    }
    
    if (formData.includeConfidentiality) {
      documentText += '4. CONFIDENTIALITY / КОНФИДЕНЦИАЛЬНОСТЬ\n\n';
      documentText += 'Contractor agrees to maintain the confidentiality of all Company information.\n\n';
      documentText += 'Подрядчик обязуется сохранять конфиденциальность всей информации Компании.\n\n';
    }
    
    // Governing law
    documentText += 'GOVERNING LAW / ПРИМЕНИМОЕ ПРАВО\n\n';
    documentText += 'This Agreement shall be governed by the laws of ';
    documentText += formData.governingLaw === 'california' ? 'California' : formData.governingLaw || 'California';
    documentText += '.\n\n';
    documentText += 'Настоящий Договор регулируется законодательством ';
    documentText += formData.governingLaw === 'california' ? 'Калифорнии' : formData.governingLaw || 'Калифорнии';
    documentText += '.\n\n';
    
    // Controlling language
    documentText += 'In case of any conflict between the English and Russian versions, the ';
    documentText += formData.controllingLanguage === 'english' ? 'English' : 'Russian';
    documentText += ' version shall prevail.\n\n';
    documentText += 'В случае расхождений между английской и русской версиями, ';
    documentText += formData.controllingLanguage === 'english' ? 'английская' : 'русская';
    documentText += ' версия имеет преимущественную силу.\n\n';
    
    // Signatures
    documentText += 'SIGNATURES / ПОДПИСИ\n\n';
    documentText += 'COMPANY / КОМПАНИЯ:\n\n';
    documentText += 'By: _______________________________\n';
    documentText += 'Name: _____________________________\n';
    documentText += 'Title: ____________________________\n';
    documentText += 'Date: _____________________________\n\n';
    
    documentText += 'CONTRACTOR / ПОДРЯДЧИК:\n\n';
    documentText += 'By: _______________________________\n';
    documentText += 'Name: _____________________________\n';
    documentText += 'Date: _____________________________\n';
    
    // Convert to HTML for Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Independent Contractor Agreement</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
  }
  h2 {
    font-size: 14pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
  }
  p {
    margin-bottom: 10pt;
  }
</style>
</head>
<body>
`;

    // Convert line breaks to HTML paragraphs
    const textHtml = documentText
      .split('\n\n')
      .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
      .join('');
    
    htmlContent += textHtml;
    htmlContent += '</body></html>';
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Contractor-Agreement-${formData.contractorName || 'Document'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};