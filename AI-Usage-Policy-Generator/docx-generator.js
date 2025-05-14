// Word document generation function
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.companyName || "AI Usage Policy"} - AI Usage Policy</title>
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
  }
  .page-break {
    page-break-before: always;
  }
  .header {
    text-align: center;
    margin-bottom: 30pt;
  }
  .footer {
    text-align: center;
    margin-top: 30pt;
    font-size: 10pt;
    color: #666;
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
        para = para.trim();
        if (!para) return '';
        
        // Check if paragraph is a heading
        if (para.startsWith('# ')) {
          return `<h1>${para.substring(2).replace(/\n/g, '<br>')}</h1>`;
        } else if (para.startsWith('## ')) {
          return `<h2>${para.substring(3).replace(/\n/g, '<br>')}</h2>`;
        } else if (para.startsWith('### ')) {
          return `<h3>${para.substring(4).replace(/\n/g, '<br>')}</h3>`;
        }
        
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
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
        .map(para => {
          para = para.trim();
          if (!para) return '';
          
          // Check if paragraph is a heading
          if (para.startsWith('# ')) {
            return `<h1>${para.substring(2).replace(/\n/g, '<br>')}</h1>`;
          } else if (para.startsWith('## ')) {
            return `<h2>${para.substring(3).replace(/\n/g, '<br>')}</h2>`;
          } else if (para.startsWith('### ')) {
            return `<h3>${para.substring(4).replace(/\n/g, '<br>')}</h3>`;
          }
          
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
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
    link.download = `${formData.companyName || 'AI-Usage-Policy'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
