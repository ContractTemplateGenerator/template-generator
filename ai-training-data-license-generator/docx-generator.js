// Simple Word Document Generator
(function() {
  // Make the function available globally
  window.generateWordDoc = function(documentText, formData) {
    try {
      console.log("Generating Word document...");
      
      // Create HTML content for Word
      let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "AI Training Data License Agreement"}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 12pt; line-height: 1.5; }
  h1 { text-align: center; font-size: 16pt; margin-bottom: 20pt; }
  p { margin-bottom: 10pt; }
</style>
</head>
<body>
${documentText.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('')}
</body>
</html>`;
      
      // Create and trigger download
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${formData.fileName || 'AI-Training-Data-License-Agreement'}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Word document generated successfully");
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  console.log("Word document generator initialized");
})();