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
  h1, h2, h3, h4, h5, h6, p, li, td {
    font-size: 11pt;
  }
  h1 {
    text-align: center;
    font-weight: bold;
    margin-bottom: 20pt;
  }
  h2 {
    text-align: center;
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
    margin-bottom: 16pt;
  }
  .signature-container {
    page-break-inside: avoid;
    margin-top: 50px;
  }
  .signature-table {
    width: 100%;
    border-collapse: collapse;
  }
  .signature-table td {
    width: 50%;
    vertical-align: top;
    padding: 10px;
    font-size: 11pt;
  }
  .signature-line {
    border-top: 1px solid black;
    width: 250px;
    margin-top: 40px;
    margin-bottom: 5px;
  }
  /* Add space after numbered sections */
  ol.agreement-sections > li {
    margin-bottom: 16pt;
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
      cleanedHtml += `<h1>${formData.documentTitle || "SEPARATION AND RELEASE AGREEMENT"}</h1>`;
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
      
      // Get the content without the signature block (we'll add it separately)
      let contentWithoutSignature = mainContent.innerHTML;
      
      // Remove the signature block from the content if it exists
      const signatureBlock = contentWithoutSignature.match(/<div class="signature-block">[\s\S]*?<\/div>/);
      if (signatureBlock) {
        contentWithoutSignature = contentWithoutSignature.replace(/<div class="signature-block">[\s\S]*?<\/div>/, '');
      }
      
      // Add section-space class to specific list items that need more spacing
      contentWithoutSignature = contentWithoutSignature.replace(
        /<li>\s*<strong>(VOLUNTARY RESIGNATION|FINAL COMPENSATION AND BENEFITS|SEPARATION CONSIDERATION|GENERAL RELEASE OF CLAIMS|CONFIDENTIALITY AND RETURN OF COMPANY PROPERTY|CONFIDENTIALITY OBLIGATIONS)<\/strong>/g, 
        '<li class="section-space"><strong>$1</strong>'
      );
      
      // Add the content without the signature block
      cleanedHtml += contentWithoutSignature;
    } else {
      // If we can't extract the content properly, use the original document text
      // but try to clean it up and remove the signature block
      cleanedHtml = documentText
        .replace(/<span class="highlighted-text">/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<div class="signature-block">[\s\S]*?<\/div>/, '');
        
      // Add section-space class to specific sections
      cleanedHtml = cleanedHtml.replace(
        /<li>\s*<strong>(VOLUNTARY RESIGNATION|FINAL COMPENSATION AND BENEFITS|SEPARATION CONSIDERATION|GENERAL RELEASE OF CLAIMS|CONFIDENTIALITY AND RETURN OF COMPANY PROPERTY|CONFIDENTIALITY OBLIGATIONS)<\/strong>/g, 
        '<li class="section-space"><strong>$1</strong>'
      );
    }
    
    // Add our custom signature block that stays together on one page
    cleanedHtml += `
    <div class="signature-container">
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
    </div>`;
    
    // Add the HTML content to the document
    htmlContent += cleanedHtml;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Fix any remaining duplicate signature blocks (belt and suspenders approach)
    htmlContent = htmlContent.replace(/<div class="signature-section">[\s\S]*?<\/div>\s*<\/div>\s*<div class="signature-container">/, '<div class="signature-container">');
    
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