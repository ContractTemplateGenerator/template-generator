window.generateWordDoc = function(sections, formData) {
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

    // Create the dual-column layout
    htmlContent += '<table style="width: 100%; margin: 0; border-collapse: collapse;">';
    
    sections.forEach((section, index) => {
      htmlContent += '<tr>';
      
      // English column
      htmlContent += '<td width="48%" style="padding: 10pt; vertical-align: top;';
      if (section.isHeader) {
        htmlContent += ' text-align: center;';
      }
      htmlContent += '">';
      
      if (section.isHeader) {
        htmlContent += '<h2 style="text-align: center;">' + section.english + '</h2>';
      } else if (section.isTitle) {
        htmlContent += '<strong>' + section.english + '</strong>';
      } else {
        htmlContent += section.english.replace(/\n/g, '<br>');
      }
      
      htmlContent += '</td>';
      
      // Separator column
      htmlContent += '<td width="4%" style="padding: 0; vertical-align: top; border-left: 1px solid #ccc;"></td>';
      
      // Spanish column
      htmlContent += '<td width="48%" style="padding: 10pt; vertical-align: top;';
      if (section.isHeader) {
        htmlContent += ' text-align: center;';
      }
      htmlContent += '">';
      
      if (section.isHeader) {
        htmlContent += '<h2 style="text-align: center;">' + section.spanish + '</h2>';
      } else if (section.isTitle) {
        htmlContent += '<strong>' + section.spanish + '</strong>';
      } else {
        htmlContent += section.spanish.replace(/\n/g, '<br>');
      }
      
      htmlContent += '</td>';
      
      htmlContent += '</tr>';
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