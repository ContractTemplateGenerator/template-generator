// Word Document Generator for Delaware LLC Operating Agreement
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
<title>${formData.documentTitle || "Delaware LLC Operating Agreement"}</title>
<style>
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.6;
    margin: 1in;
  }
  h1, h2, h3 {
    text-align: center;
    font-weight: bold;
  }
  h1 {
    font-size: 14pt;
    margin-bottom: 0;
    text-transform: uppercase;
  }
  h2 {
    font-size: 12pt;
    margin-top: 18pt;
    margin-bottom: 12pt;
    text-transform: uppercase;
  }
  h3 {
    font-size: 12pt;
    margin-top: 12pt;
    margin-bottom: 8pt;
    font-weight: normal;
    text-decoration: underline;
  }
  p {
    margin-bottom: 12pt;
    text-align: justify;
  }
  .title-block {
    text-align: center;
    font-weight: bold;
    margin-bottom: 24pt;
  }
  .title-block p {
    text-align: center;
    margin-bottom: 0;
  }
  .section-number {
    font-weight: bold;
  }
  .signature-block {
    margin-top: 36pt;
    page-break-inside: avoid;
  }
  .signature-line {
    margin-top: 48pt;
    border-bottom: 1px solid #000;
    width: 300px;
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
          if (line.trim()) {
            htmlContent += `<p>${line}</p>`;
          }
        }
        htmlContent += '</div>';
      }
      // Regular paragraph
      else {
        const formattedSection = section
          .replace(/\n/g, '<br>')
          .replace(/^(\d+\.\d+)/gm, '<span class="section-number">$1</span>');
        htmlContent += `<p>${formattedSection}</p>`;
      }
    }

    // Close HTML document
    htmlContent += '</body></html>';

    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Delaware-LLC-Operating-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Document generated and download triggered");

  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
