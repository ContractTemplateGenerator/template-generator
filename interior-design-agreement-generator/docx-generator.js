// MS Word Document Generator for Interior Design Services Agreement
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Interior Design Services Agreement</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; margin: 0; padding: 0; }
  h1 { text-align: center; font-size: 11pt; margin-bottom: 20pt; text-decoration: underline; font-weight: bold; }
  h2 { font-size: 11pt; margin-top: 14pt; margin-bottom: 10pt; font-weight: bold; }
  h3 { font-size: 11pt; margin-top: 12pt; margin-bottom: 8pt; font-weight: bold; }
  p { margin-bottom: 10pt; text-align: justify; font-size: 11pt; }
  .signature-section { margin-top: 40pt; }
  .signature-table { width: 100%; border-collapse: collapse; }
  .signature-table td { width: 50%; text-align: center; vertical-align: top; padding: 0 20pt; }
  .signature-line { border-bottom: 1px solid black; margin-bottom: 5pt; height: 20pt; }
  .signature-label { font-size: 11pt; margin-bottom: 10pt; font-weight: bold; }
</style></head><body>`;

    // Split document into main content and signature section
    const parts = documentText.split('IN WITNESS WHEREOF');
    const mainContent = parts[0];
    const signatureContent = parts[1] || '';

    // Process main document text
    const processedMainText = mainContent
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Handle headers - look for numbered sections
        if (para.includes('INTERIOR DESIGN SERVICES AGREEMENT')) {
          return `<h1>${para}</h1>`;
        } else if (para.match(/^\d+\./)) {
          return `<h2>${para}</h2>`;
        } else if (para.match(/^[A-Z]\./)) {
          return `<h3>${para}</h3>`;
        } else {
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
      })
      .join('');

    // Add processed main text
    htmlContent += processedMainText;

    // Add signature section with proper alignment
    if (signatureContent) {
      htmlContent += `<p style="font-weight: bold; font-size: 11pt;">IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.</p>`;
      
      // Extract client and designer names from the signature content
      const clientMatch = signatureContent.match(/CLIENT:\s*([^\n]*)/);
      const designerMatch = signatureContent.match(/DESIGNER:\s*([^\n]*)/);
      
      const clientName = clientMatch ? clientMatch[1].trim() : '[CLIENT NAME]';
      const designerName = designerMatch ? designerMatch[1].trim() : 'Prestige Interiors LLC';
      
      htmlContent += `
      <div class="signature-section">
        <table class="signature-table">
          <tr>
            <td class="signature-label">CLIENT:</td>
            <td class="signature-label">DESIGNER:</td>
          </tr>
          <tr>
            <td style="padding-top: 10pt;">${clientName}</td>
            <td style="padding-top: 10pt;">${designerName}</td>
          </tr>
          <tr>
            <td></td>
            <td style="padding-top: 10pt;">By: [AUTHORIZED SIGNATORY]</td>
          </tr>
          <tr>
            <td style="padding-top: 20pt;"><div class="signature-line"></div></td>
            <td style="padding-top: 20pt;"><div class="signature-line"></div></td>
          </tr>
          <tr>
            <td style="text-align: center; font-size: 11pt;">Signature</td>
            <td style="text-align: center; font-size: 11pt;">Signature</td>
          </tr>
          <tr>
            <td style="padding-top: 15pt; text-align: left;">Date: ____________________________</td>
            <td style="padding-top: 15pt; text-align: left;">Date: ____________________________</td>
          </tr>
        </table>
      </div>`;
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.ms-word;charset=utf-8' 
    });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Interior-Design-Services-Agreement-${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};