// MS Word Document Generator for Interior Design Services Agreement
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Interior Design Services Agreement</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 0; padding: 0; }
  h1 { text-align: center; font-size: 16pt; margin-bottom: 20pt; text-decoration: underline; }
  h2 { font-size: 14pt; margin-top: 14pt; margin-bottom: 10pt; }
  h3 { font-size: 12pt; margin-top: 12pt; margin-bottom: 8pt; }
  p { margin-bottom: 10pt; text-align: justify; }
  .signature-line { margin-top: 40pt; border-bottom: 1px solid black; width: 300pt; margin-bottom: 5pt; }
  .signature-section { margin-top: 40pt; }
</style></head><body>`;
    // Process document text - convert newlines to HTML paragraphs
    const processedText = documentText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\[(.*?)\]/g, '<strong>$1</strong>') // Bracketed text to bold
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Handle headers
        if (para.includes('INTERIOR DESIGN SERVICES AGREEMENT')) {
          return `<h1>${para.replace(/[\*\[\]]/g, '')}</h1>`;
        } else if (para.match(/^\d+\./)) {
          return `<h2>${para}</h2>`;
        } else if (para.match(/^[A-Z]\./)) {
          return `<h3>${para}</h3>`;
        } else {
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
      })
      .join('');
    
    // Add processed text to HTML content
    htmlContent += processedText;
    
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