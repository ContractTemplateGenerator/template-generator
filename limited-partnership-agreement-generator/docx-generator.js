// Word document generation utility
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Limited Partnership Agreement"}</title>
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
  .title {
    text-align: center;
    font-size: 11pt;
    margin-bottom: 20pt;
    text-decoration: underline;
    font-weight: bold;
  }
  .article-heading {
    font-size: 11pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
  }
  .subsection-heading {
    font-weight: bold;
    display: inline;
  }
  p {
    margin-bottom: 10pt;
    text-align: justify;
    font-size: 11pt;
  }
  .signature-section {
    margin-top: 30pt;
    page-break-inside: avoid;
  }
  .signature-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    border: none;
  }
  .signature-table td {
    width: 50%;
    padding: 10pt 20pt 0pt 0pt;
    border: none;
    text-align: left;
    vertical-align: top;
    line-height: 1.2;
  }
  .signature-line {
    border-bottom: 1px solid black;
    min-height: 20pt;
    margin-bottom: 5pt;
  }
</style>
</head>
<body>
<div class="document-container">
`;

    // Process the document text to add proper formatting
    let processedText = documentText
      // Make title bold and centered
      .replace(/^PARTNERSHIP AGREEMENT OF (.+)$/m, '<div class="title">PARTNERSHIP AGREEMENT OF $1</div>')
      // Make article headings bold
      .replace(/^(Article [IVX]+: .+)$/gm, '<div class="article-heading">$1</div>')
      // Make subsection headings bold
      .replace(/^(Severability|Waiver|Governing Law|Binding Effect|Amendments|Assignment|Counterparts)\./gm, '<span class="subsection-heading">$1.</span>')
      // Handle signatures section
      .replace(/\[Signatures of All Partners\]/, '')  // Remove this line to save space
      // Convert newlines to paragraphs
      .split('\n\n')
      .map(para => {
        if (para.trim()) {
          // Don't wrap divs in paragraphs
          if (para.includes('<div class=')) {
            return para;
          }
          // Handle signature table specially
          if (para.includes('SIGNATURE_TABLE_START')) {
            const lines = para.split('\n').filter(line => line.trim() && 
                                                   !line.includes('SIGNATURE_TABLE_START') && 
                                                   !line.includes('SIGNATURE_TABLE_END'));
            
            const generalPartner = lines[0] ? lines[0].trim() : '[GENERAL PARTNER NAME]';
            const limitedPartners = lines.slice(1).filter(line => line.trim());
            
            let tableRows = '';
            
            // First row: General Partner and first Limited Partner
            const firstLimitedPartner = limitedPartners[0] ? limitedPartners[0].trim() : '[LIMITED PARTNER NAME]';
            tableRows += `<tr>
              <td><div class="signature-line"></div>${generalPartner}</td>
              <td><div class="signature-line"></div>${firstLimitedPartner}</td>
            </tr>`;
            
            // Additional rows for remaining Limited Partners
            for (let i = 1; i < limitedPartners.length; i++) {
              if (limitedPartners[i].trim()) {
                tableRows += `<tr>
                  <td></td>
                  <td><div class="signature-line"></div>${limitedPartners[i].trim()}</td>
                </tr>`;
              }
            }
            
            return `<table class="signature-table">${tableRows}</table>`;
          }
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
        return '';
      })
      .join('');
    
    // Add processed text to HTML content
    htmlContent += processedText;
    
    // Close HTML document
    htmlContent += '</div></body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Limited-Partnership-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};