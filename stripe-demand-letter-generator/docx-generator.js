// MS Word Document Generator for Stripe Demand Letter
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "Stripe Demand Letter"}</title>
<style>
  body {
    font-family: Times, "Times New Roman", serif;
    font-size: 11pt;
    line-height: 1.5;
    margin: 0;
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
    text-align: left;
  }
  p {
    margin-bottom: 10pt;
    text-align: left;
  }
  .center {
    text-align: center;
    font-weight: bold;
  }
  .letterhead {
    text-align: center;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  .date {
    margin-bottom: 20pt;
  }
  .address {
    margin-bottom: 20pt;
  }
  .signature-block {
    margin-top: 30pt;
  }
  .page-break {
    page-break-before: always;
  }
  .court-header {
    display: table;
    width: 100%;
    margin-bottom: 20pt;
  }
  .parties-section {
    display: table-cell;
    width: 65%;
    vertical-align: top;
    border-right: 1px solid #000;
    padding-right: 20pt;
  }
  .case-number-section {
    display: table-cell;
    width: 35%;
    vertical-align: top;
    padding-left: 20pt;
    text-align: right;
  }
  .party-underline {
    border-bottom: 1px solid #000;
    padding-bottom: 5pt;
  }
</style>
</head>
<body>
`;

    // Split document text if there's a form feed character (for separate pages)
    let mainText = documentText;
    let appendixText = '';
    
    if (documentText.includes('\f')) {
      const parts = documentText.split(/\f/);
      mainText = parts[0];
      appendixText = parts.length > 1 ? parts[1] : '';
    }
    
    // Process main text - convert newlines to HTML paragraphs
    const mainTextHtml = mainText
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Handle court-style party header with case number
        if (para.includes('AAA Case No.') && para.includes('Claimant')) {
          // Split the header into parties section and case number
          const lines = para.split('\n');
          let partiesLines = [];
          let caseNumberLine = '';
          
          for (let line of lines) {
            if (line.includes('AAA Case No.')) {
              caseNumberLine = line.split('AAA Case No.')[1] || '___________';
            } else if (line.trim()) {
              partiesLines.push(line.trim());
            }
          }
          
          return `
            <div class="court-header">
              <div class="parties-section party-underline">
                ${partiesLines.map(line => `<div>${line}</div>`).join('')}
              </div>
              <div class="case-number-section">
                AAA Case No. ${caseNumberLine.trim()}
              </div>
            </div>`;
        }
        
        // Center AAA titles and major section headers
        if (para.includes('AMERICAN ARBITRATION ASSOCIATION') || 
            para.includes('COMMERCIAL ARBITRATION RULES') ||
            para.includes('DEMAND FOR ARBITRATION') ||
            para === 'PARTIES' ||
            para === 'JURISDICTION AND VENUE' ||
            para === 'NATURE OF DISPUTE' ||
            para === 'CAUSES OF ACTION' ||
            para === 'RELIEF SOUGHT' ||
            para === 'FACTUAL BASIS FOR CLAIMS' ||
            para === 'ADMINISTRATIVE INFORMATION' ||
            para === 'CERTIFICATION' ||
            para === 'FACTUAL BACKGROUND' ||
            para.includes('CAUSE OF ACTION') ||
            para.includes('ADDITIONAL CAUSES OF ACTION') ||
            para.includes('TO THE HONORABLE ARBITRATOR')) {
          return `<p class="center">${para.replace(/\n/g, '<br>')}</p>`;
        }
        
        // Handle other special formatting
        if (para.includes('VIA CERTIFIED MAIL')) {
          return `<p style="font-weight: bold;">${para.replace(/\n/g, '<br>')}</p>`;
        }
        if (para.startsWith('Re:')) {
          return `<p style="font-weight: bold;">${para.replace(/\n/g, '<br>')}</p>`;
        }
        if (para.includes('Sincerely,') || para.includes('Respectfully submitted,') || 
            (para.includes('Claimant') && para.includes('Dated:')) ||
            para.includes('[CONTACT NAME]')) {
          return `<div class="signature-block"><p>${para.replace(/\n/g, '<br>')}</p></div>`;
        }
        
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
      })
      .join('');
    
    // Add main text to HTML content
    htmlContent += mainTextHtml;
    
    // Add appendix on a new page if applicable
    if (appendixText) {
      // Add section break and page break for maximum Word compatibility
      htmlContent += '<p><br clear="all" style="mso-special-character:line-break;page-break-before:always"></p>';
      
      // Process appendix text with same formatting rules
      const appendixHtml = appendixText
        .split('\n\n')
        .map(para => {
          para = para.trim();
          if (!para) return '';
          
          // Handle court-style party header with case number in appendix
          if (para.includes('AAA Case No.') && para.includes('Claimant')) {
            // Split the header into parties section and case number
            const lines = para.split('\n');
            let partiesLines = [];
            let caseNumberLine = '';
            
            for (let line of lines) {
              if (line.includes('AAA Case No.')) {
                caseNumberLine = line.split('AAA Case No.')[1] || '___________';
              } else if (line.trim()) {
                partiesLines.push(line.trim());
              }
            }
            
            return `
              <div class="court-header">
                <div class="parties-section party-underline">
                  ${partiesLines.map(line => `<div>${line}</div>`).join('')}
                </div>
                <div class="case-number-section">
                  AAA Case No. ${caseNumberLine.trim()}
                </div>
              </div>`;
          }
          
          // Center AAA titles and major section headers
          if (para.includes('AMERICAN ARBITRATION ASSOCIATION') || 
              para.includes('COMMERCIAL ARBITRATION RULES') ||
              para.includes('DEMAND FOR ARBITRATION') ||
              para === 'PARTIES' ||
              para === 'JURISDICTION AND VENUE' ||
              para === 'NATURE OF DISPUTE' ||
              para === 'CAUSES OF ACTION' ||
              para === 'RELIEF SOUGHT' ||
              para === 'FACTUAL BASIS FOR CLAIMS' ||
              para === 'ADMINISTRATIVE INFORMATION' ||
              para === 'CERTIFICATION' ||
              para === 'FACTUAL BACKGROUND' ||
              para.includes('CAUSE OF ACTION') ||
              para.includes('ADDITIONAL CAUSES OF ACTION') ||
              para.includes('TO THE HONORABLE ARBITRATOR')) {
            return `<p class="center">${para.replace(/\n/g, '<br>')}</p>`;
          }
          
          // Handle signature blocks
          if (para.includes('Sincerely,') || para.includes('Respectfully submitted,') || 
              (para.includes('Claimant') && para.includes('Dated:')) ||
              para.includes('[CONTACT NAME]')) {
            return `<div class="signature-block"><p>${para.replace(/\n/g, '<br>')}</p></div>`;
          }
          
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
      
      // Add appendix to HTML content
      htmlContent += appendixHtml;
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || 'Stripe-Demand-Letter'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};