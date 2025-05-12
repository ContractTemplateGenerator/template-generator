window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Separation and Release Agreement"}</title>
<style>
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.5;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  h2 {
    text-align: center;
    font-size: 14pt;
    margin-bottom: 12pt;
    font-weight: bold;
  }
  p {
    margin-bottom: 10pt;
    text-align: justify;
  }
  ol {
    margin-left: 0.5in;
    margin-bottom: 10pt;
  }
  ol ol {
    list-style-type: lower-alpha;
  }
  ol ol ol {
    list-style-type: lower-roman;
  }
  .signature-table {
    width: 100%;
    margin-top: 50px;
    border-collapse: collapse;
  }
  .signature-table td {
    width: 50%;
    vertical-align: top;
    padding: 10px;
  }
  .signature-line {
    border-top: 1px solid black;
    width: 250px;
    margin-top: 40px;
    margin-bottom: 5px;
  }
</style>
</head>
<body>
`;

    // Extract HTML content from the documentText (which is already HTML in our case)
    // and clean it up for Word
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = documentText;
    
    // Extract the actual content
    const title = tempDiv.querySelector('.document-title');
    const mainContent = tempDiv.querySelector('.document-preview');
    
    // Process the HTML to make it Word-friendly
    let cleanedHtml = '';
    
    // Add the title
    if (title) {
      cleanedHtml += `<h1>${title.textContent}</h1>`;
    } else {
      cleanedHtml += `<h1>${formData.documentTitle || "Separation and Release Agreement"}</h1>`;
    }
    
    // Extract and process the main content
    if (mainContent) {
      // Remove any highlighted sections and replace with regular text
      const highlightedTexts = mainContent.querySelectorAll('.highlighted-text');
      highlightedTexts.forEach(highlight => {
        const textContent = highlight.textContent;
        const textNode = document.createTextNode(textContent);
        highlight.parentNode.replaceChild(textNode, highlight);
      });
      
      // Get the processed content without highlights
      cleanedHtml += mainContent.innerHTML;
    } else {
      // If we can't extract the content properly, use the original document text
      // but try to clean it up
      cleanedHtml = documentText
        .replace(/<span class="highlighted-text">/g, '')
        .replace(/<\/span>/g, '');
    }
    
    // Add the HTML content to the document
    htmlContent += cleanedHtml;
    
    // Replace the signature block with a table-based version for Word
    htmlContent = htmlContent.replace(
      /<div class="signature-block">[\s\S]*?<\/div>/g,
      `<table class="signature-table">
        <tr>
          <td>
            <p><strong>COMPANY: ${formData.companyName}</strong></p>
            <div class="signature-line"></div>
            <p>By: ${formData.companySignatory}</p>
            <p>Title: ${formData.companySignatoryTitle}</p>
            <p>Date: ___________________________</p>
          </td>
          <td>
            <p><strong>EMPLOYEE: ${formData.employeeName || "[EMPLOYEE NAME]"}</strong></p>
            <div class="signature-line"></div>
            <p>Date: ___________________________</p>
          </td>
        </tr>
      </table>`
    );
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Separation-Agreement'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};