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
<title>${formData.documentTitle || "Independent Contractor Agreement"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 1in;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  h2 {
    font-size: 14pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
  }
  p {
    margin-bottom: 10pt;
  }
  .page-break {
    page-break-before: always;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  td {
    vertical-align: top;
    padding: 5pt;
  }
  .bilingual-table {
    width: 100%;
    margin-bottom: 10pt;
  }
  .bilingual-column {
    width: 50%;
    vertical-align: top;
    padding-right: 10pt;
    padding-left: 10pt;
  }
  .bilingual-column-left {
    border-right: 1px solid #ddd;
  }
  strong {
    font-weight: bold;
  }
</style>
</head>
<body>
${documentText}
</body>
</html>`;
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Independent-Contractor-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};