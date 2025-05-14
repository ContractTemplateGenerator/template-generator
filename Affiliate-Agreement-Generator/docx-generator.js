// Word document generation function
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.companyName || "Affiliate Agreement"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  h2 {
    font-size: 14pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
  }
  h3 {
    font-size: 12pt;
    margin-top: 12pt;
    margin-bottom: 8pt;
    font-weight: bold;
  }
  p {
    margin-bottom: 10pt;
  }
  .page-break {
    page-break-before: always;
  }
  .header {
    text-align: center;
    margin-bottom: 30pt;
  }
  .footer {
    text-align: center;
    margin-top: 30pt;
    font-size: 10pt;
    color: #666;
  }
  .signature-block {
    margin-top: 50pt;
    page-break-inside: avoid;
  }
  .signature-line {
    border-top: 1px solid #000;
    width: 80%;
    margin-top: 30pt;
    margin-bottom: 10pt;
  }
</style>
</head>
<body>
`;

    // Split document text if there's a form feed character (for separate pages)
    let mainText = documentText;
    let appendixText = '';
    
    if (documentText.includes('\f')) {
      const parts = documentText.split(/\f/);
      mainText = parts[0];
      appendixText = parts.length > 1 ? parts[1] : '';
    }
    
    // Process main text - convert newlines to HTML paragraphs with heading detection
    const mainTextHtml = mainText
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Check if paragraph is a heading by looking for section numbers
        if (/^\d+\.\s[A-Z\s&]+$/.test(para)) {
          return `<h1>${para}</h1>`;
        } else if (/^\d+\.\d+\s[A-Za-z\s&]+$/.test(para)) {
          return `<h2>${para}</h2>`;
        }
        
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
      })
      .join('');
    
    // Add main text to HTML content
    htmlContent += mainTextHtml;
    
    // Add appendix on a new page if applicable
    if (appendixText) {
      // Add page break
      htmlContent += '<div class="page-break"></div>';
      
      // Process appendix text with heading detection
      const appendixHtml = appendixText
        .split('\n\n')
        .map(para => {
          para = para.trim();
          if (!para) return '';
          
          // Check if paragraph is a heading by looking for section numbers
          if (/^\d+\.\s[A-Z\s&]+$/.test(para)) {
            return `<h1>${para}</h1>`;
          } else if (/^\d+\.\d+\s[A-Za-z\s&]+$/.test(para)) {
            return `<h2>${para}</h2>`;
          }
          
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
      
      // Add appendix to HTML content
      htmlContent += appendixHtml;
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.companyName || 'Affiliate-Agreement'}-${formData.affiliateName || 'Affiliate'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};