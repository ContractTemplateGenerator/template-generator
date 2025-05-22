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
    font-size: 11pt;
    line-height: 1.6;
    margin: 0;
    text-align: left;
  }
  h1 {
    text-align: center;
    font-size: 11pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  .section-heading {
    font-size: 11pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
    text-align: left;
  }
  p {
    margin-bottom: 12pt;
    text-align: left;
    font-size: 11pt;
  }
  .signature-section {
    margin-top: 30pt;
    width: 100%;
  }
  .signature-line {
    border-bottom: 1pt solid black;
    width: 300pt;
    height: 20pt;
    margin-bottom: 10pt;
  }
  .signature-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15pt;
    font-weight: bold;
  }
  .signature-names {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15pt;
  }
  .signature-dates {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15pt;
  }
</style>
</head>
<body>
`;

    // Process the document text and fix formatting
    let processedText = documentText
      // Make title bold and centered
      .replace('PROFESSIONAL APPRAISAL SERVICES AGREEMENT', '<h1>PROFESSIONAL APPRAISAL SERVICES AGREEMENT</h1>')
      
      // Make section headings bold
      .replace(/^(\d+\.\s+[A-Z\s&]+)$/gm, '<p class="section-heading">$1</p>')
      .replace(/^(RECITALS)$/gm, '<p class="section-heading">$1</p>')
      .replace(/^(NOW, THEREFORE.*)$/gm, '<p class="section-heading">$1</p>')
      .replace(/^(IN WITNESS WHEREOF.*)$/gm, '<p class="section-heading">$1</p>')
      
      // Handle signature section properly
      .replace(/APPRAISER:\s+CLIENT:\s+_+\s+_+\s*(.*?)\s*(.*?)\s*Date:\s+_+\s+Date:\s+_+/s, 
        `<div class="signature-section">
          <div class="signature-labels">
            <span>APPRAISER:</span>
            <span>CLIENT:</span>
          </div>
          <div class="signature-names">
            <div class="signature-line"></div>
            <div class="signature-line"></div>
          </div>
          <div class="signature-names">
            <span>$1</span>
            <span>$2</span>
          </div>
          <div class="signature-dates">
            <span>Date: ___________________________</span>
            <span>Date: ___________________________</span>
          </div>
        </div>`);

    // Remove contact information section completely
    processedText = processedText.replace(/Contact Information:.*$/s, '');

    // Convert paragraphs
    const paragraphs = processedText.split('\n\n');
    const htmlParagraphs = paragraphs.map(para => {
      para = para.trim();
      if (!para) return '';
      if (para.includes('<h1>') || para.includes('<p class="section-heading">') || para.includes('<div class="signature-section">')) {
        return para;
      }
      return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    });

    htmlContent += htmlParagraphs.join('');
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Professional-Appraisal-Services-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
