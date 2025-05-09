// Word Document Generator for California LLC Operating Agreement
// Uses HTML to DOC conversion for reliable Word document generation

window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "California LLC Operating Agreement"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 0; /* Use Word's default margins */
  }
  h1, h2, h3 {
    text-align: center;
    font-weight: bold;
  }
  h1 {
    font-size: 14pt;
    margin-bottom: 0;
  }
  h2 {
    font-size: 13pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
  }
  h3 {
    font-size: 12pt;
    margin-top: 12pt;
    margin-bottom: 8pt;
  }
  p {
    margin-bottom: 10pt;
  }
  .title-block {
    text-align: center;
    font-weight: bold;
    margin-bottom: 24pt;
  }
  .page-break {
    page-break-before: always;
  }
  .signature-block {
    margin-top: 24pt;
  }
</style>
</head>
<body>`;

    // Format title block
    const titleLines = documentText.split('\n\n')[0].split('\n');
    htmlContent += '<div class="title-block">';
    for (const line of titleLines) {
      htmlContent += `<p>${line}</p>`;
    }
    htmlContent += '</div>';

    // Process the rest of the document
    const sections = documentText.split('\n\n').slice(1);
    
    // Process each section
    for (let section of sections) {
      // Check if it's an article heading (starts with "ARTICLE")
      if (section.trim().startsWith('ARTICLE')) {
        const lines = section.split('\n');
        htmlContent += `<h2>${lines[0]}</h2>`;
        if (lines.length > 1) {
          htmlContent += `<h3>${lines[1]}</h3>`;
        }
        if (lines.length > 2) {
          const remainingLines = lines.slice(2).join('<br>');
          htmlContent += `<p>${remainingLines}</p>`;
        }
      } 
      // Check if it's the signature block
      else if (section.includes('IN WITNESS WHEREOF')) {
        htmlContent += '<div class="signature-block">';
        const lines = section.split('\n');
        for (const line of lines) {
          htmlContent += `<p>${line}</p>`;
        }
        htmlContent += '</div>';
      }
      // Regular paragraph
      else {
        htmlContent += `<p>${section.replace(/\n/g, '<br>')}</p>`;
      }
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'California-LLC-Operating-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
