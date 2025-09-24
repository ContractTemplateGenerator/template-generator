// MS Word Document Generation for Incorporation Intake
// Uses HTML-to-DOC conversion for reliable formatting

window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Incorporation Documents"}</title>
<style>
  body {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
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
    text-align: justify;
  }
  .page-break {
    page-break-before: always;
  }
  .signature-line {
    border-bottom: 1px solid black;
    width: 300px;
    margin: 20pt 0 5pt 0;
    display: inline-block;
  }
  .signature-block {
    margin: 20pt 0;
  }
  .indent {
    margin-left: 36pt;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 10pt 0;
  }
  td, th {
    border: 1px solid black;
    padding: 8pt;
    text-align: left;
  }
  th {
    font-weight: bold;
    background-color: #f0f0f0;
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
    
    // Process main text - convert newlines to HTML paragraphs
    const mainTextHtml = mainText
      .split('\n\n')
      .map(para => {
        if (para.trim()) {
          // Handle different formatting
          if (para.startsWith('ARTICLE') || para.match(/^[IVX]+\./)) {
            return `<h2>${para.replace(/\n/g, '<br>')}</h2>`;
          } else if (para.match(/^\d+\.\d+/)) {
            return `<h3>${para.replace(/\n/g, '<br>')}</h3>`;
          } else {
            return `<p>${para.replace(/\n/g, '<br>')}</p>`;
          }
        }
        return '';
      })
      .join('');
    
    // Add main text to HTML content
    htmlContent += mainTextHtml;
    
    // Add appendix on a new page if applicable
    if (appendixText) {
      // Add page break
      htmlContent += '<div class="page-break"></div>';
      
      // Process appendix text
      const appendixHtml = appendixText
        .split('\n\n')
        .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
        .join('');
      
      // Add appendix to HTML content
      htmlContent += appendixHtml;
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob with proper Word MIME type
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.ms-word;charset=utf-8' 
    });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Incorporation-Documents'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
