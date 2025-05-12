window.generateWordDoc = function(sections, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Function to format dates
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      
      // Format for both languages
      const englishDate = date.toLocaleDateString('en-US', options);
      const spanishDate = date.toLocaleDateString('es-ES', options);
      
      return { 
        english: englishDate,
        spanish: spanishDate 
      };
    };
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dual-Language NDA | ${formData.disclosingPartyName || 'Confidentiality Agreement'} and ${formData.receivingPartyName || ''}</title>
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
  .signature {
    font-weight: bold;
    text-transform: uppercase;
  }
</style>
</head>
<body>
`;

    // Create the dual-column layout
    htmlContent += '<table style="width: 100%; margin: 0; border-collapse: collapse;">';
    
    sections.forEach((section, index) => {
      htmlContent += '<tr>';
      
      // For effective date section, we need to format the date
      let englishContent = section.english;
      let spanishContent = section.spanish;
      
      if (section.english && section.english.includes('effective date') && !section.isTitle && formData.effectiveDate) {
        const formattedDates = formatDate(formData.effectiveDate);
        englishContent = section.english.replace(/\[Effective Date\]/, formattedDates.english)
          .replace(formData.effectiveDate, formattedDates.english);
        spanishContent = section.spanish.replace(/\[Fecha de Entrada en Vigor\]/, formattedDates.spanish)
          .replace(formData.effectiveDate, formattedDates.spanish);
      }
      
      // English column
      htmlContent += '<td width="48%" style="padding: 10pt; vertical-align: top;';
      if (section.isHeader) {
        htmlContent += ' text-align: center;';
      }
      htmlContent += '">';
      
      if (section.isHeader) {
        htmlContent += '<h2 style="text-align: center;">' + englishContent + '</h2>';
      } else if (section.isTitle && section.isSignature) {
        htmlContent += '<strong class="signature" style="text-transform: uppercase;">' + englishContent + '</strong>';
      } else if (section.isTitle) {
        htmlContent += '<strong>' + englishContent + '</strong>';
      } else {
        htmlContent += englishContent.replace(/\n/g, '<br>');
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
        htmlContent += '<h2 style="text-align: center;">' + spanishContent + '</h2>';
      } else if (section.isTitle && section.isSignature) {
        htmlContent += '<strong class="signature" style="text-transform: uppercase;">' + spanishContent + '</strong>';
      } else if (section.isTitle) {
        htmlContent += '<strong>' + spanishContent + '</strong>';
      } else {
        htmlContent += spanishContent.replace(/\n/g, '<br>');
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
    
    // Create a filename with the parties' names if available
    let filename = 'Dual-Language-NDA';
    if (formData.disclosingPartyName && formData.receivingPartyName) {
      // Clean up names for filename (remove special characters)
      const disclosingPartyName = formData.disclosingPartyName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
      const receivingPartyName = formData.receivingPartyName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
      filename = `NDA-${disclosingPartyName}-${receivingPartyName}`;
    }
    
    link.download = `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};