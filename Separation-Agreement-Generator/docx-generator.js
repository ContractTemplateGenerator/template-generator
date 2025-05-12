window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Separation and Release Agreement"}</title>
<style>
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 1in;
  }
  h1, h2 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  h3 {
    font-size: 14pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
  }
  p {
    margin-bottom: 10pt;
    text-align: justify;
  }
  .page-break {
    page-break-before: always;
  }
  .signature-line {
    border-top: 1px solid black;
    width: 250px;
    margin-top: 50px;
    margin-bottom: 5px;
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
    
    // Process the document text to convert it to HTML with proper formatting
    // Split by line breaks, interpret ## as headings, etc.
    const mainTextHtml = mainText
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Handle headings
        if (para.startsWith('# ')) {
          return `<h1>${para.substring(2)}</h1>`;
        } else if (para.startsWith('## ')) {
          return `<h2>${para.substring(3)}</h2>`;
        } else if (para.startsWith('### ')) {
          return `<h3>${para.substring(4)}</h3>`;
        }
        
        // Handle lists
        if (para.match(/^\d+\.\s/)) {
          const listItems = para.split('\n').map(item => {
            const match = item.match(/^(\d+\.\s)(.*)/);
            if (match) {
              return `<li>${match[2]}</li>`;
            }
            return `<li>${item}</li>`;
          }).join('');
          return `<ol>${listItems}</ol>`;
        }
        
        if (para.match(/^[a-z]\.\s/) || para.match(/^[ivx]+\.\s/)) {
          const listItems = para.split('\n').map(item => {
            const match = item.match(/^([a-z]\.\s|[ivx]+\.\s)(.*)/);
            if (match) {
              return `<li>${match[2]}</li>`;
            }
            return `<li>${item}</li>`;
          }).join('');
          return `<ol style="list-style-type: lower-alpha;">${listItems}</ol>`;
        }
        
        // Handle normal paragraphs
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
          
          // Handle headings
          if (para.startsWith('# ')) {
            return `<h1>${para.substring(2)}</h1>`;
          } else if (para.startsWith('## ')) {
            return `<h2>${para.substring(3)}</h2>`;
          } else if (para.startsWith('### ')) {
            return `<h3>${para.substring(4)}</h3>`;
          }
          
          // Handle normal paragraphs
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
      
      // Add appendix to HTML content
      htmlContent += appendixHtml;
    }
    
    // Add signature lines and company info
    htmlContent += `
    <div class="signature-section">
      <p><strong>COMPANY: ${formData.companyName || "THINK CIRCUITS LLC"}</strong></p>
      <div class="signature-line"></div>
      <p>By: ${formData.companySignatory || "Kevin Weekly"}<br>
      Title: ${formData.companySignatoryTitle || "CEO"}<br>
      Date: ___________________________</p>
      
      <p style="margin-top: 30px;"><strong>EMPLOYEE: ${formData.employeeName || "[EMPLOYEE NAME]"}</strong></p>
      <div class="signature-line"></div>
      <p>Date: ___________________________</p>
    </div>
    `;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Separation-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};