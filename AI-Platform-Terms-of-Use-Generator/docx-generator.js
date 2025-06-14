// Document generation functionality
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "AI Platform Terms of Use"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 11pt;
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
    font-size: 18pt;
    font-weight: bold;
    margin-bottom: 24pt;
    color: #1f4e79;
  }
  
  h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 12pt;
    color: #1f4e79;
    border-bottom: 1pt solid #1f4e79;
    padding-bottom: 6pt;
  }
  
  h3 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 8pt;
    color: #333;
  }
  
  p {
    margin-bottom: 12pt;
    text-align: justify;
  }
  
  ul, ol {
    margin-bottom: 12pt;
    padding-left: 24pt;
  }
  
  li {
    margin-bottom: 6pt;
  }
  
  .effective-date {
    text-align: center;
    font-style: italic;
    margin-bottom: 24pt;
  }
  
  .section-number {
    font-weight: bold;
  }
  
  .subsection {
    margin-left: 12pt;
  }
  
  .important-notice {
    background-color: #f0f8ff;
    border: 1pt solid #4a90e2;
    padding: 12pt;
    margin: 12pt 0;
  }
  
  .page-break {
    page-break-before: always;
  }
  
  @page {
    margin: 1in;
  }
</style>
</head>
<body>
<div class="document-container">
`;

    // Process the document text
    let processedText = documentText;
    
    // Convert section headers to proper HTML
    processedText = processedText.replace(/^(\d+\.\s+[A-Z\s]+)$/gm, '<h2>$1</h2>');
    processedText = processedText.replace(/^(\d+\.\d+\s+[A-Za-z\s]+)\./gm, '<h3>$1</h3>');
    
    // Convert paragraphs
    const paragraphs = processedText.split('\n\n');
    let htmlParagraphs = '';
    
    paragraphs.forEach(para => {
      para = para.trim();
      if (para) {
        if (para.includes('Last Updated:') || para.includes('Effective Date:')) {
          htmlParagraphs += `<p class="effective-date">${para}</p>`;
        } else if (para.startsWith('<h2>') || para.startsWith('<h3>')) {
          htmlParagraphs += para;
        } else if (para.includes('•') || para.includes('-')) {
          // Handle bullet points
          const lines = para.split('\n');
          let listItems = '';
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('•') || line.startsWith('-')) {
              listItems += `<li>${line.substring(1).trim()}</li>`;
            }
          });
          if (listItems) {
            htmlParagraphs += `<ul>${listItems}</ul>`;
          }
        } else {
          htmlParagraphs += `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
      }
    });
    
    htmlContent += htmlParagraphs;
    htmlContent += '</div></body></html>';
    
    // Convert HTML to Blob for Word document
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' 
    });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'AI-Platform-Terms-of-Use'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};

// Copy to clipboard functionality
window.copyToClipboard = function(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use the modern clipboard API
      return navigator.clipboard.writeText(text).then(() => {
        console.log("Text copied to clipboard successfully");
        return true;
      }).catch(err => {
        console.error("Failed to copy text: ", err);
        return fallbackCopyTextToClipboard(text);
      });
    } else {
      // Fallback for older browsers
      return fallbackCopyTextToClipboard(text);
    }
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};

// Fallback clipboard function
function fallbackCopyTextToClipboard(text) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log("Fallback: Copying to clipboard was successful");
      return true;
    } else {
      console.error("Fallback: Unable to copy to clipboard");
      return false;
    }
  } catch (err) {
    console.error("Fallback: Unable to copy to clipboard", err);
    return false;
  }
}

// Text formatting utilities
window.formatTextForDisplay = function(text) {
  // Add proper spacing and formatting for display
  return text
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/([.!?])\s*\n\s*([A-Z])/g, '$1\n\n$2'); // Add proper paragraph breaks
};

window.formatTextForDownload = function(text) {
  // Format text for clean document download
  return text
    .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/([.!?])\s+/g, '$1\n\n'); // Add paragraph breaks after sentences
};
