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
<title>${formData.documentTitle || "AI Training Data License Agreement"}</title>
<style>
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
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
</style>
</head>
<body>
`;

    // Process the document text - convert newlines to HTML paragraphs
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
    link.download = `${formData.fileName || 'AI-Training-Data-License-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
