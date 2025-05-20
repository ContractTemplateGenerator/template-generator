// Document generation utility for Word download - FIXED SIGNATURE HEIGHT & BOLD FORMATTING
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Angel Investor Agreement"}</title>
<style>
  body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    line-height: 1.4;
    margin: 0;
    padding: 0;
  }
  h1 {
    text-align: center;
    font-size: 12pt;
    font-weight: bold;
    margin-bottom: 6pt;
    margin-top: 0pt;
  }
  h2 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 12pt;
    margin-bottom: 6pt;
  }
  h3, p {
    font-size: 12pt;
    font-weight: normal;
    margin-top: 0pt;
    margin-bottom: 0pt;
    text-align: left;
  }
  h3 {
    margin-top: 6pt;
    margin-bottom: 6pt;
  }
  p {
    text-align: justify;
  }
  .recitals {
    margin-top: 12pt;
    margin-bottom: 12pt;
  }
  .section-break {
    margin-top: 12pt;
  }
  .signature-table {
    width: 100%;
    margin-top: 12pt;
    border-collapse: collapse;
  }
  .signature-table td {
    border: none;
    padding: 1pt;
    vertical-align: top;
    width: 50%;
  }
  .signature-line {
    border-bottom: 1px solid black;
    width: 180px;
    margin-bottom: 1pt;
    margin-top: 1pt;
  }
  .signature-text {
    font-size: 12pt;
    margin-bottom: 1pt;
    margin-top: 1pt;
  }
  .signature-header {
    font-size: 12pt;
    font-weight: bold;
    margin-bottom: 1pt;
    margin-top: 1pt;
  }
</style>
</head>
<body>
`;

    // Split content into lines and process
    const lines = documentText.split('\n');
    let inSignatureSection = false;
    let signatureHtml = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      // Handle title - MAKE BOLD
      if (line === 'ANGEL INVESTOR AGREEMENT') {
        htmlContent += `<h1>${line}</h1>`;
        continue;
      }
      
      // Handle RECITALS
      if (line === 'RECITALS') {
        htmlContent += `<p class="recitals">${line}</p>`;
        continue;
      }
      
      // Handle WHEREAS clauses - add more space after
      if (line.startsWith('WHEREAS,')) {
        htmlContent += `<p style="margin-bottom: 6pt;">${line}</p>`;
        continue;
      }
      
      // Handle NOW THEREFORE
      if (line.startsWith('NOW, THEREFORE,')) {
        htmlContent += `<p class="section-break" style="margin-bottom: 6pt;">${line}</p>`;
        continue;
      }
      
      // Handle numbered sections - MAKE BOLD
      if (line.match(/^\d+\.\s+[A-Z\s]+$/)) {
        htmlContent += `<h2>${line}</h2>`;
        continue;
      }
      
      // Handle lettered subsections
      if (line.match(/^[a-z]\)\s+/)) {
        htmlContent += `<h3>${line}</h3>`;
        continue;
      }
      
      // Handle signature section
      if (line.includes('IN WITNESS WHEREOF') || inSignatureSection) {
        if (line.includes('IN WITNESS WHEREOF')) {
          inSignatureSection = true;
          htmlContent += `<p class="section-break">${line}</p>`;
          continue;
        }
        
        // Collect signature lines
        if (line.includes('COMPANY:') && line.includes('INVESTOR:')) {
          signatureHtml += `
<table class="signature-table">
  <tr>
    <td>
      <div class="signature-header">COMPANY:</div>
      <div class="signature-text">${formData.startupName || 'Company Name'}</div>
      <div class="signature-line"></div>
      <div class="signature-text">${formData.founderName || 'CEO Name'}</div>
      <div class="signature-text">Chief Executive Officer</div>
      <div class="signature-text">Date: ${formData.signatureDate ? new Date(formData.signatureDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '_________________'}</div>
    </td>
    <td>
      <div class="signature-header">INVESTOR:</div>
      <div class="signature-text">${formData.investorName || 'Investor Name'}</div>
      <div class="signature-line"></div>
      <div class="signature-text">${formData.investorName || 'Investor Name'}</div>
      <div class="signature-text">Investor</div>
      <div class="signature-text">Date: _________________</div>
    </td>
  </tr>
</table>`;
          break; // Stop processing after signature table
        }
        
        // Skip other signature-related lines as they're handled in the table
        continue;
      }
      
      // Handle regular paragraphs
      htmlContent += `<p>${line}</p>`;
    }
    
    // Add signature table if we have it
    htmlContent += signatureHtml;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Angel_Investor_Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};