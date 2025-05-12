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
    font-size: 11pt;
    line-height: 1.5;
  }
  h1 {
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    margin-bottom: 20pt;
    text-transform: uppercase;
  }
  h2 {
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    margin-bottom: 12pt;
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
  .section-space {
    margin-top: 15pt;
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

    // Use consistent UPPERCASE for title
    htmlContent += `<h1>SEPARATION AND RELEASE AGREEMENT</h1>`;
    
    // Extract HTML content from the documentText (which is already HTML in our case)
    // and clean it up for Word - but skip the title as we've just added it
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = documentText;
    
    // Get all content except the title
    const content = tempDiv.querySelector('.document-preview');
    
    if (content) {
      // Remove the title (h1) from the content
      const titleElement = content.querySelector('h1');
      if (titleElement) {
        titleElement.remove();
      }
      
      // Remove any highlighted sections and replace with regular text
      const highlightedTexts = content.querySelectorAll('.highlighted-text');
      highlightedTexts.forEach(highlight => {
        const textContent = highlight.textContent;
        const textNode = document.createTextNode(textContent);
        highlight.parentNode.replaceChild(textNode, highlight);
      });
      
      // Get the processed content without highlights
      let mainHtml = content.innerHTML;
      
      // Add spacing after specific sections
      mainHtml = mainHtml.replace(/<li>\s*<strong>FINAL COMPENSATION AND BENEFITS<\/strong>/g, 
                              '<li class="section-space"><strong>FINAL COMPENSATION AND BENEFITS</strong>');
      mainHtml = mainHtml.replace(/<li>\s*<strong>SEPARATION CONSIDERATION<\/strong>/g, 
                              '<li class="section-space"><strong>SEPARATION CONSIDERATION</strong>');
      mainHtml = mainHtml.replace(/<li>\s*<strong>GENERAL RELEASE OF CLAIMS<\/strong>/g, 
                              '<li class="section-space"><strong>GENERAL RELEASE OF CLAIMS</strong>');
      mainHtml = mainHtml.replace(/<li>\s*<strong>WAIVER OF UNKNOWN CLAIMS<\/strong>/g, 
                              '<li class="section-space"><strong>WAIVER OF UNKNOWN CLAIMS</strong>');
      mainHtml = mainHtml.replace(/<li>\s*<strong>CONFIDENTIALITY AND RETURN OF COMPANY PROPERTY<\/strong>/g, 
                              '<li class="section-space"><strong>CONFIDENTIALITY AND RETURN OF COMPANY PROPERTY</strong>');
      mainHtml = mainHtml.replace(/<li>\s*<strong>CONFIDENTIALITY OBLIGATIONS<\/strong>/g, 
                              '<li class="section-space"><strong>CONFIDENTIALITY OBLIGATIONS</strong>');
      
      // Add the content to the htmlContent
      htmlContent += mainHtml;
    } else {
      // Fallback if we can't extract the content properly
      htmlContent += documentText
        .replace(/<span class="highlighted-text">/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<h1.*?>.*?<\/h1>/g, ''); // Remove the title as we've added it already
    }
    
    // Remove the signature block to replace it with a proper table-based version
    htmlContent = htmlContent.replace(/<div class="signature-block">[\s\S]*?<\/div>/g, '');
    
    // Add properly formatted signature block table
    htmlContent += `
    <table class="signature-table">
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
    </table>
    `;
    
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