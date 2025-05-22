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
    text-align: left;
  }
  h1 {
    text-align: center;
    font-size: 14pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  .section-heading {
    font-size: 12pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
    text-align: left;
  }
  p {
    margin-bottom: 12pt;
    text-align: left;
    font-size: 12pt;
  }
  .signature-section {
    margin-top: 30pt;
    width: 100%;
  }
  .signature-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
  }
  .signature-table td {
    border: none;
    padding: 5pt;
    vertical-align: top;
    width: 50%;
  }
  .signature-labels {
    font-weight: bold;
    margin-bottom: 10pt;
  }
  .signature-line {
    border-bottom: 1pt solid black;
    width: 200pt;
    height: 12pt;
    margin-bottom: 5pt;
  }
  .signature-name {
    margin-bottom: 3pt;
    font-size: 11pt;
  }
  .date-line {
    margin-top: 10pt;
    font-size: 11pt;
  }
</style>
</head>
<body>
`;

    // Process text and add proper formatting
    let processedText = documentText;
    
    // Make title bold and centered
    processedText = processedText.replace(/^PROFESSIONAL APPRAISAL SERVICES AGREEMENT/, '<h1>PROFESSIONAL APPRAISAL SERVICES AGREEMENT</h1>');
    
    // Make section headings bold
    processedText = processedText.replace(/^(\d+\.\s+[A-Z][A-Z\s&]+)$/gm, '<p class="section-heading">$1</p>');
    processedText = processedText.replace(/^(RECITALS)$/gm, '<p class="section-heading">$1</p>');
    processedText = processedText.replace(/^(NOW, THEREFORE.*)$/gm, '<p class="section-heading">$1</p>');
    processedText = processedText.replace(/^(IN WITNESS WHEREOF.*)$/gm, '<p class="section-heading">$1</p>');
    
    // Find signature section and replace with proper table formatting
    const signatureRegex = /APPRAISER:\s+CLIENT:\s+_+\s+_+\s*(.*?)\s+(.*?)\s+Date:\s+_+\s+Date:\s+_+/s;
    
    if (signatureRegex.test(processedText)) {
      const match = processedText.match(signatureRegex);
      const beforeSignature = processedText.substring(0, match.index);
      const appraiserInfo = match[1] || '';
      const clientInfo = match[2] || '';
      
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
</div>
`;
      
      processedText = beforeSignature + signatureSection;
    }
    
    // Process main text - convert newlines to HTML paragraphs
    const mainTextHtml = processedText
      .split('\n\n')
      .map(para => {
        if (para.trim() === '') return '';
        if (para.includes('<h1>') || para.includes('<p class="section-heading">') || para.includes('<div class="signature-section">')) {
          return para;
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
      })
      .join('');
    
    // Add processed text to HTML content
    htmlContent += mainTextHtml;
    
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