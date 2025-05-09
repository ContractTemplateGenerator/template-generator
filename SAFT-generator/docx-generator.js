// docx-generator.js - Word document generation functionality

window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.companyName ? formData.companyName + " - SAFT" : "Simple Agreement for Future Tokens"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    /* No custom margins, use Word defaults */
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
  .signature-block {
    margin-top: 30pt;
  }
  .signature-line {
    border-top: 1px solid black;
    width: 60%;
    margin-top: 40pt;
    margin-bottom: 5pt;
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
    const processText = (text) => {
      // First find and format the title (SIMPLE AGREEMENT FOR FUTURE TOKENS)
      let processedText = text;
      
      // Handle the title (first line)
      const lines = processedText.split('\n\n');
      if (lines.length > 0 && lines[0].includes('SIMPLE AGREEMENT FOR FUTURE TOKENS')) {
        lines[0] = `<h1>${lines[0]}</h1>`;
        processedText = lines.join('\n\n');
      }
      
      // Handle section headers (lines that end with a colon)
      processedText = processedText.replace(/^([A-Z][A-Za-z\s]+):$/gm, '<h2>$1</h2>');
      
      // Handle numeric section headers (e.g., "1. EVENTS")
      processedText = processedText.replace(/^(\d+\.\s+[A-Z][A-Za-z\s]+)$/gm, '<h2>$1</h2>');
      
      // Process remaining paragraphs
      return processedText
        .split('\n\n')
        .map(para => {
          para = para.trim();
          if (!para) return '';
          
          // Check if this paragraph is already a header
          if (para.startsWith('<h1>') || para.startsWith('<h2>')) return para;
          
          // Regular paragraph
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
    };
    
    // Add main text to HTML content
    htmlContent += processText(mainText);
    
    // Add appendix on a new page if applicable
    if (appendixText) {
      // Add page break
      htmlContent += '<div class="page-break"></div>';
      
      // Process appendix text
      htmlContent += processText(appendixText);
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || formData.companyName?.replace(/\s+/g, '-') || 'SAFT-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};