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
    margin-top: 30pt;
  }
  .signature-table td {
    width: 50%;
    padding: 20pt 10pt 5pt 10pt;
    border-bottom: 1px solid black;
    text-align: center;
    vertical-align: bottom;
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
      .replace(/\[Signatures of All Partners\]/, '<div class="signature-section">[Signatures of All Partners]</div>')
      // Convert newlines to paragraphs
      .split('\n\n')
      .map(para => {
        if (para.trim()) {
          // Don't wrap divs in paragraphs
          if (para.includes('<div class=')) {
            return para;
          }
          // Handle signature lines specially
          if (para.includes('[GENERAL PARTNER NAME]') && para.includes('[LIMITED PARTNER')) {
            const partners = para.split(/\s{2,}/); // Split on multiple spaces
            const generalPartner = partners.find(p => p.includes('[GENERAL PARTNER NAME]')) || '[GENERAL PARTNER NAME]';
            const limitedPartners = partners.filter(p => p.includes('[LIMITED PARTNER') && !p.includes('[GENERAL PARTNER'));
            
            return `<table class="signature-table">
              <tr>
                <td>${generalPartner}</td>
                <td>${limitedPartners[0] || '[LIMITED PARTNER NAME]'}</td>
              </tr>
              ${limitedPartners.length > 1 ? `<tr><td></td><td>${limitedPartners[1]}</td></tr>` : ''}
            </table>`;
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