// Simplified Word document generation functionality
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Legal Deadline Calculation"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
  }
  p {
    margin-bottom: 10pt;
  }
  .deadline-date {
    font-weight: bold;
    color: #0069ff;
  }
  .disclaimer {
    font-size: 9pt;
    color: #666;
    font-style: italic;
    margin-top: 20pt;
    border-top: 1px solid #ddd;
    padding-top: 10pt;
  }
</style>
</head>
<body>
`;

    // Process text - convert newlines to HTML paragraphs
    const formattedText = documentText
      .split('\n\n')
      .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
      .join('');
    
    // Add text to HTML content
    htmlContent += formattedText;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Legal-Deadline-Calculation'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
