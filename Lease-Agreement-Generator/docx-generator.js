// Word document generator
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Lease Agreement"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
  }
  h1, h2 {
    font-family: Calibri, Arial, sans-serif;
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
  .page-break {
    page-break-before: always;
  }
  .signature-line {
    display: inline-block;
    width: 80%;
    border-bottom: 1pt solid black;
    margin-top: 30pt;
    margin-bottom: 5pt;
  }
  .signature-section {
    margin-top: 50pt;
    margin-bottom: 20pt;
  }
</style>
</head>
<body>
`;

    // Process document text - convert newlines to HTML paragraphs
    const processedText = documentText
      .split('\n\n')
      .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
      .join('');
    
    // Add processed text to HTML content
    htmlContent += processedText;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Lease-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};