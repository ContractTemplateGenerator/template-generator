// Function to generate MS Word document
window.generateWordDoc = function(ndaText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Non-Disclosure Agreement</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0.5in;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
  }
  h2 {
    font-size: 14pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
  }
  p {
    margin-bottom: 10pt;
  }
  @page Section2 {
    mso-page-orientation: portrait;
    size: 8.5in 11.0in;
    margin: 0.5in 0.5in 0.5in 0.5in;
    mso-header-margin: .5in;
    mso-footer-margin: .5in;
    mso-header: h2;
    mso-footer: f2;
  }
  div.Section2 { page: Section2; }
</style>
</head>
<body>
`;

    // Split main agreement text and side letter
    let mainText = ndaText;
    let sideLetterText = '';
    
    if (formData.usePseudonyms) {
      const parts = ndaText.split(/\f/);
      mainText = parts[0];
      sideLetterText = parts.length > 1 ? parts[1] : '';
    }
    
    // Process main text - convert newlines to HTML paragraphs
    const mainTextHtml = mainText
      .split('\n\n')
      .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
      .join('');
    
    // Add main text to HTML content
    htmlContent += mainTextHtml;
    
    // Add side letter on a new page if applicable
    if (formData.usePseudonyms && sideLetterText) {
      // Add Word-specific section break for a new page
      htmlContent += '<br clear="all" style="page-break-before:always">';
      htmlContent += '<div class="Section2">';
      
      // Process side letter text
      const sideLetterHtml = sideLetterText
        .trim()
        .split('\n\n')
        .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
        .join('');
      
      // Add side letter to HTML content
      htmlContent += sideLetterHtml;
      htmlContent += '</div>';
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'NDA-Agreement.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
