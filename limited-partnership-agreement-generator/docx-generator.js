// Word document generation utility
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Limited Partnership Agreement"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }
  .document-container {
    max-width: 8.5in;
    margin: 0 auto;
    padding: 1in;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
    text-decoration: underline;
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
    text-align: justify;
  }
  .signature-section {
    margin-top: 30pt;
    page-break-inside: avoid;
  }
  .signature-line {
    margin-top: 20pt;
    margin-bottom: 5pt;
  }
  .underline {
    text-decoration: underline;
  }
</style>
</head>
<body>
<div class="document-container">
`;

    // Process document text - convert newlines to HTML paragraphs
    const processedText = documentText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\{\.underline\}/g, '<span class="underline">$1</span>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Add processed text to HTML content
    htmlContent += '<p>' + processedText + '</p>';
    
    // Close HTML document
    htmlContent += '</div></body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Limited-Partnership-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};