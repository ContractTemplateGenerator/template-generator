// Word document generation for Token Purchase Agreement

window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Token Purchase Agreement"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
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
  .centered {
    text-align: center;
  }
  .bold {
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
    
    // Process main text - convert newlines to HTML paragraphs and handle bold formatting
    const mainTextHtml = processTextWithFormatting(mainText);
    
    // Add main text to HTML content
    htmlContent += mainTextHtml;
    
    // Add appendix on a new page if applicable
    if (appendixText) {
      // Add page break
      htmlContent += '<div class="page-break"></div>';
      
      // Process appendix text with formatting
      const appendixHtml = processTextWithFormatting(appendixText);
      
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
    link.download = `${formData.fileName || 'Token-Purchase-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};

// Helper function to process text with formatting
function processTextWithFormatting(text) {
  // First handle the title (assuming it starts with TOKEN PURCHASE AGREEMENT)
  text = text.replace(/^(TOKEN PURCHASE AGREEMENT)/, '<h1>$1</h1>');
  
  // Split text into paragraphs
  const paragraphs = text.split('\n\n');
  
  // Process each paragraph
  return paragraphs.map(para => {
    if (!para.trim()) return '';
    
    // Handle section headers (assume they are all caps)
    if (/^[0-9]+\.\s+[A-Z\s]+$/.test(para.trim())) {
      return `<p class="bold">${para.replace(/\n/g, '<br>')}</p>`;
    }
    
    // Handle subsection headers (assume they are numbered with letters)
    if (/^[0-9]+\.[0-9]+\s+/.test(para.trim())) {
      return `<p class="bold">${para.replace(/\n/g, '<br>')}</p>`;
    }
    
    // Handle regular paragraphs
    return `<p>${para.replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

// Function to generate clipboard text
window.copyToClipboard = function(documentText) {
  try {
    navigator.clipboard.writeText(documentText)
      .then(() => {
        alert("Document copied to clipboard!");
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = documentText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Document copied to clipboard!");
      });
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    alert("Error copying to clipboard. Please try again.");
  }
};