// Word Document Generator for English-Spanish NDA
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content with dual-column layout
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dual-Language NDA | English-Spanish</title>
<style>
  @page {
    margin: 0.5in;
  }
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0;
  }
  td {
    vertical-align: top;
    padding: 5pt;
  }
  h2 {
    font-size: 14pt;
    margin-bottom: 15pt;
    font-weight: bold;
    text-align: center;
  }
  strong {
    font-weight: bold;
  }
  .page-break {
    page-break-before: always;
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
    link.download = `NDA-${formData.disclosingName}-${formData.receivingName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};
