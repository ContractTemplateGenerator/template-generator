// Word document generation functionality
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Credit Card Authorization Form"}</title>
<style>
  body {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 1in;
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
  p {
    margin-bottom: 10pt;
  }
  .signature-line {
    border-top: 1px solid black;
    width: 250px;
    margin-top: 40pt;
    display: inline-block;
  }
  .right-align {
    text-align: right;
  }
  .center-align {
    text-align: center;
  }
  .strong {
    font-weight: bold;
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
      .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
      .join('');
    
    // Add main text to HTML content
    htmlContent += mainTextHtml;
    
    // Add appendix on a new page if applicable
    if (appendixText) {
      // Add page break
      htmlContent += '<div style="page-break-before: always;"></div>';
      
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
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Credit-Card-Authorization-Form'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};