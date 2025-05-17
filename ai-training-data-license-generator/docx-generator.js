// Simple Word Document Generator
(function() {
  // Make the function available globally
  window.generateWordDoc = function(documentText, options) {
    try {
      if (!documentText || !options) {
        console.error("Document text or options missing for Word generation.");
        alert("Error: Could not generate Word document due to missing data.");
        return;
      }
      console.log("Generating Word document with title:", options.documentTitle);
      
      // Basic HTML structure for the .doc file
      // Replace newlines with <br> for single newlines and <p> for double newlines (paragraphs)
      const paragraphs = documentText.split('\n\n').map(para => {
          // Escape HTML characters within each paragraph to prevent XSS or rendering issues
          const escapedPara = para.replace(/&/g, '&')
                                  .replace(/</g, '<')
                                  .replace(/>/g, '>')
                                  .replace(/"/g, '"')
                                  .replace(/'/g, ''');
          return `<p>${escapedPara.replace(/\n/g, '<br>')}</p>`;
      }).join('');

      let htmlContent = `
<!DOCTYPE html>
<html xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="UTF-8">
<title>${options.documentTitle || "AI Training Data License Agreement"}</title>
<style>
  body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; margin: 1in; }
  h1, h2, h3 { font-family: 'Arial', sans-serif; } /* You might want more specific styles */
  p { margin-bottom: 10pt; text-align: justify; }
  /* Add more specific styles for headings, lists, etc. if needed */
</style>
</head>
<body>
  <h1>${options.documentTitle || "AI Training Data License Agreement"}</h1>
  ${paragraphs}
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${options.fileName || 'AI-Training-Data-License-Agreement'}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Word document generation initiated.");
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Error generating Word document. Please check the console or try copying the text.");
    }
  };
  
  console.log("Word document generator (docx-generator.js) initialized.");
})();