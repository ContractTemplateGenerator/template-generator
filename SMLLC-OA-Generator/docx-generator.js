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
<title>${formData.companyName || "Single-Member LLC Operating Agreement"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 1in;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    font-weight: bold;
    margin-bottom: 20pt;
  }
  h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 10pt;
  }
  p {
    margin-bottom: 10pt;
  }
  .page-break {
    page-break-before: always;
  }
  .signature-line {
    margin-top: 30pt;
    border-top: 1px solid black;
    width: 60%;
  }
</style>
</head>
<body>
`;

    // Process document text - convert newlines to HTML paragraphs and handle section headers
    const processedText = documentText
      .replace(/\n\n([A-Z][A-Z\s]+[A-Z])\n\n/g, '<h2>$1</h2>\n\n') // Convert section titles to h2
      .split('\n\n')
      .map(para => {
        if (para.startsWith('<h2>')) return para;
        return para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '';
      })
      .join('');
    
    // Add text to HTML content
    htmlContent += processedText;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.companyName ? formData.companyName.replace(/\s+/g, '-') : 'SMLLC-Operating-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};