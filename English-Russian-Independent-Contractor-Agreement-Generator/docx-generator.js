// Document generation functionality
window.generateWordDoc = function(documentText, formData, isBilingual = true) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Independent Contractor Agreement / Договор с Независимым Подрядчиком"}</title>
<style>
  body {
    font-family: "Times New Roman", Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  td {
    vertical-align: top;
    padding: 10px;
    width: 50%;
  }
  .english-column {
    border-right: 1px solid #000;
  }
  .russian-column {
    padding-left: 20px;
  }
  h1, h2, h3 {
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 10pt;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
  }
  h2 {
    font-size: 14pt;
  }
  h3 {
    font-size: 12pt;
  }
  p {
    margin-bottom: 10pt;
    text-align: justify;
  }
  .signature-block {
    margin-top: 30pt;
  }
  .page-break {
    page-break-before: always;
  }
  .exhibit {
    page-break-before: always;
    margin-top: 30pt;
  }
</style>
</head>
<body>
`;

    // If bilingual, create table structure
    if (isBilingual) {
      htmlContent += '<table border="0" cellpadding="0" cellspacing="0">';
      
      // Split document text if it contains two columns
      if (documentText.includes('||COLUMN_SEPARATOR||')) {
        const columns = documentText.split('||COLUMN_SEPARATOR||');
        const englishText = columns[0] || '';
        const russianText = columns[1] || '';
        
        // Process each section
        const englishSections = englishText.split('||SECTION_BREAK||');
        const russianSections = russianText.split('||SECTION_BREAK||');
        
        for (let i = 0; i < Math.max(englishSections.length, russianSections.length); i++) {
          htmlContent += '<tr>';
          
          // English column
          htmlContent += '<td class="english-column">';
          if (englishSections[i]) {
            const englishHtml = convertTextToHtml(englishSections[i]);
            htmlContent += englishHtml;
          }
          htmlContent += '</td>';
          
          // Russian column
          htmlContent += '<td class="russian-column">';
          if (russianSections[i]) {
            const russianHtml = convertTextToHtml(russianSections[i]);
            htmlContent += russianHtml;
          }
          htmlContent += '</td>';
          
          htmlContent += '</tr>';
        }
      }
      
      htmlContent += '</table>';
    } else {
      // Single language document
      const singleLangHtml = convertTextToHtml(documentText);
      htmlContent += singleLangHtml;
    }
    
    // Add exhibit if needed
    if (formData.includeExhibit) {
      htmlContent += `
<div class="exhibit">
<h1>EXHIBIT A / ПРИЛОЖЕНИЕ А</h1>
<h2>STATEMENT OF WORK / РЕГЛАМЕНТ УСЛУГ</h2>
<p>This Statement of Work Number ____ is issued under and subject to all of the terms and conditions of the Independent Contractor Agreement dated as of ${formData.effectiveDate || '____________'}, between ${formData.clientName || '____________'} (the "Company") and ${formData.contractorName || '____________'} ("Contractor").</p>
<p>(Настоящий Регламент Услуг No. ____ заключен в полном соответствии со сроками и условиями Договора с независимым подрядчиком от ${formData.effectiveDate || '____________'} г. между ${formData.clientNameRu || '____________'} ("Компания") и ${formData.contractorNameRu || '____________'} ("Консультант")).</p>
</div>`;
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Independent-Contractor-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};

// Helper function to convert text to HTML
function convertTextToHtml(text) {
  if (!text) return '';
  
  // Replace section markers
  let html = text
    .replace(/\f/g, '<div class="page-break"></div>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Handle headings
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  
  // Handle bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle underline
  html = html.replace(/__(.*?)__/g, '<u>$1</u>');
  
  // Wrap remaining text in paragraphs
  if (!html.startsWith('<h') && !html.startsWith('<p>')) {
    html = '<p>' + html;
  }
  if (!html.endsWith('</p>') && !html.endsWith('</h1>') && !html.endsWith('</h2>') && !html.endsWith('</h3>')) {
    html += '</p>';
  }
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

// Alternative function for single language documents
window.generateSingleLanguageDoc = function(documentText, formData) {
  return window.generateWordDoc(documentText, formData, false);
};
