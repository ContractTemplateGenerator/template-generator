// MS Word Document Generator
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Professional Appraisal Services Agreement"}</title>
<style>
  body {
    font-family: Times, 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.6;
    margin: 0;
  }
  h1 {
    text-align: center;
    font-size: 14pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  h2 {
    font-size: 12pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
  }
  p {
    margin-bottom: 12pt;
    text-align: justify;
  }
  .signature-section {
    margin-top: 30pt;
    width: 100%;
  }
  .signature-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20pt;
  }
  .signature-table td {
    border: none;
    padding: 8pt;
    vertical-align: top;
    width: 50%;
  }
  .signature-labels {
    font-weight: bold;
    margin-bottom: 15pt;
  }
  .signature-line {
    border-bottom: 1pt solid black;
    width: 250pt;
    height: 15pt;
    margin-bottom: 8pt;
  }
  .signature-name {
    margin-bottom: 5pt;
    font-size: 11pt;
  }
  .date-line {
    margin-top: 15pt;
    font-size: 11pt;
  }
  .contact-info {
    margin-top: 20pt;
    font-size: 11pt;
    text-align: left;
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
    
    // Find signature section and replace with proper table formatting
    const signatureRegex = /APPRAISER:\s+CLIENT:\s+_+\s+_+\s*(.*?)\s+(.*?)\s+Date:\s+_+\s+Date:\s+_+\s+Contact Information:\s+(.*)/s;
    
    if (signatureRegex.test(mainText)) {
      const match = mainText.match(signatureRegex);
      const beforeSignature = mainText.substring(0, match.index);
      const appraiserInfo = match[1] || '';
      const clientInfo = match[2] || '';
      const contactInfo = match[3] || '';
      
      // Create properly formatted signature section
      const signatureSection = `
<div class="signature-section">
  <table class="signature-table">
    <tr>
      <td class="signature-labels">APPRAISER:</td>
      <td class="signature-labels">CLIENT:</td>
    </tr>
    <tr>
      <td>
        <div class="signature-line"></div>
        <div class="signature-name">${appraiserInfo}</div>
        <div class="date-line">Date: _________________________</div>
      </td>
      <td>
        <div class="signature-line"></div>
        <div class="signature-name">${clientInfo}</div>
        <div class="date-line">Date: _________________________</div>
      </td>
    </tr>
  </table>
  <div class="contact-info">
    Contact Information:<br>
    ${contactInfo}
  </div>
</div>
`;
      
      mainText = beforeSignature + signatureSection;
    }
    
    // Process main text - convert newlines to HTML paragraphs
    const mainTextHtml = mainText
      .split('\n\n')
      .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
      .join('');
    
    // Add main text to HTML content
    htmlContent += mainTextHtml;
    
    // Add appendix on a new page if applicable
    if (appendixText) {
      // Add page break
      htmlContent += '<div style="page-break-before: always;"></div>';
      
      // Process appendix text
      const appendixHtml = appendixText
        .split('\n\n')
        .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
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
    link.download = `${formData.fileName || 'Professional-Appraisal-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};