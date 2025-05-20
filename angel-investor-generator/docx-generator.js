// Document generation utility for Word download
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Angel Investor Agreement"}</title>
<style>
  body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    line-height: 1.8;
    margin: 0;
    padding: 0;
  }
  h1 {
    text-align: center;
    font-size: 18pt;
    font-weight: bold;
    margin-bottom: 24pt;
    page-break-after: avoid;
  }
  h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 12pt;
    page-break-after: avoid;
  }
  h3 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 12pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
  }
  p {
    margin-bottom: 12pt;
    text-align: justify;
    orphans: 2;
    widows: 2;
  }
  .signature-section {
    margin-top: 36pt;
    page-break-inside: avoid;
  }
  .signature-line {
    border-bottom: 1px solid black;
    width: 200px;
    display: inline-block;
    margin-right: 50px;
  }
  .page-break {
    page-break-before: always;
  }
  .section-break {
    margin-top: 24pt;
    margin-bottom: 18pt;
  }
</style>
</head>
<body>
`;

    // Convert the document text to HTML paragraphs
    const lines = documentText.split('\n');
    let inSignatureSection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        htmlContent += '<p>&nbsp;</p>';
        return;
      }
      
      // Handle titles
      if (trimmedLine === 'ANGEL INVESTOR AGREEMENT') {
        htmlContent += `<h1>${trimmedLine}</h1>`;
      }
      // Handle numbered sections
      else if (trimmedLine.match(/^\d+\.\s+[A-Z\s]+$/)) {
        htmlContent += `<h2>${trimmedLine}</h2>`;
      }
      // Handle lettered subsections
      else if (trimmedLine.match(/^[a-d]\)\s+/)) {
        htmlContent += `<h3>${trimmedLine}</h3>`;
      }
      // Handle signature section
      else if (trimmedLine.includes('IN WITNESS WHEREOF') || inSignatureSection) {
        if (trimmedLine.includes('IN WITNESS WHEREOF')) {
          inSignatureSection = true;
          htmlContent += '<div class="section-break"></div>';
        }
        
        if (trimmedLine.includes('_________________________')) {
          htmlContent += '<p><span class="signature-line">&nbsp;</span></p>';
        } else {
          htmlContent += `<p>${trimmedLine}</p>`;
        }
      }
      // Handle regular paragraphs
      else {
        htmlContent += `<p>${trimmedLine}</p>`;
      }
    });
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Angel_Investor_Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};