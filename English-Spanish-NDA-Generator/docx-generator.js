window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dual-Language NDA | ${formData.disclosingPartyName} and ${formData.receivingPartyName}</title>
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
`;

    // Split document text into sections
    const sections = documentText.split('\n\n');
    
    htmlContent += '<table style="width: 100%; margin: 0; border-collapse: collapse;">';
    
    sections.forEach((section, index) => {
      if (section.trim()) {
        const lines = section.split('\n');
        
        // Check if this is the header section
        if (index === 0 && section.includes('NON-DISCLOSURE AGREEMENT') && section.includes('ACUERDO DE CONFIDENCIALIDAD')) {
          htmlContent += '<tr>';
          htmlContent += '<td width="48%" style="padding: 10pt; vertical-align: top;">';
          htmlContent += '<h2 style="text-align: center;">NON-DISCLOSURE AGREEMENT</h2>';
          htmlContent += '</td>';
          htmlContent += '<td width="4%" style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td>';
          htmlContent += '<td width="48%" style="padding: 10pt; vertical-align: top;">';
          htmlContent += '<h2 style="text-align: center;">ACUERDO DE CONFIDENCIALIDAD</h2>';
          htmlContent += '</td>';
          htmlContent += '</tr>';
        } else if (lines.length >= 2) {
          // Regular sections with both English and Spanish
          let englishContent = '';
          let spanishContent = '';
          let splitFound = false;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Detect Spanish sections by keywords
            if (!splitFound && (
              line.includes('Este Acuerdo') ||
              line.includes('La fecha de') ||
              line.includes('"Información Confidencial"') ||
              line.includes('Este Acuerdo permanecerá') ||
              line.includes('La Parte Receptora') ||
              line.includes('A menos que') ||
              line.includes('La Información Confidencial no') ||
              line.includes('La Información Confidencial se') ||
              line.includes('Este Acuerdo se regirá') ||
              line.includes('Si alguna disposición') ||
              line.includes('En caso de cualquier') ||
              line.includes('Las Partes han') ||
              line.includes('Parte Divulgadora:') ||
              line.includes('Parte Receptora:')
            )) {
              splitFound = true;
              spanishContent += line + '<br>';
            } else if (!splitFound) {
              englishContent += line + '<br>';
            } else {
              spanishContent += line + '<br>';
            }
          }
          
          if (englishContent || spanishContent) {
            htmlContent += '<tr>';
            htmlContent += '<td style="padding: 10pt; vertical-align: top;">';
            htmlContent += englishContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            htmlContent += '</td>';
            htmlContent += '<td style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td>';
            htmlContent += '<td style="padding: 10pt; vertical-align: top;">';
            htmlContent += spanishContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            htmlContent += '</td>';
            htmlContent += '</tr>';
          }
        }
      }
    });
    
    htmlContent += '</table>';
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Dual-Language-NDA-${formData.disclosingPartyName}-${formData.receivingPartyName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};