// MS Word Document Generator for Interior Design Services Agreement
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="UTF-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Microsoft Word">
<meta name="Originator" content="Microsoft Word">
<title>Interior Design Services Agreement</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>90</w:Zoom>
<w:DoNotPromptForConvert/>
<w:DoNotShowRevisions/>
<w:DoNotPrintRevisions/>
<w:DisplayHorizontalDrawingGridEvery>0</w:DisplayHorizontalDrawingGridEvery>
<w:DisplayVerticalDrawingGridEvery>2</w:DisplayVerticalDrawingGridEvery>
<w:UseMarginsForDrawingGridOrigin/>
<w:ValidateAgainstSchemas/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
  @page {
    margin: 0in;
  }
  body { 
    font-family: 'Times New Roman', serif; 
    font-size: 10.5pt; 
    line-height: 1.5; 
    margin: 0; 
    padding: 0; 
  }
  h1 { 
    text-align: center; 
    font-size: 10.5pt; 
    margin-bottom: 20pt; 
    text-decoration: underline; 
    font-weight: bold; 
  }
  h2 { 
    font-size: 10.5pt; 
    margin-top: 14pt; 
    margin-bottom: 10pt; 
    font-weight: bold; 
  }
  h3 { 
    font-size: 10.5pt; 
    margin-top: 12pt; 
    margin-bottom: 8pt; 
    font-weight: bold; 
  }
  p { 
    margin-bottom: 10pt; 
    text-align: justify; 
    font-size: 10.5pt; 
  }
  .signature-section { 
    margin-top: 40pt; 
  }
  .signature-table { 
    width: 100%; 
    border-collapse: collapse; 
  }
  .signature-table td { 
    width: 50%; 
    vertical-align: top; 
    padding: 0 10pt; 
  }
  .signature-line { 
    border-bottom: 1px solid black; 
    margin-bottom: 5pt; 
    height: 20pt; 
    width: 80%; 
  }
</style>
</head>
<body>`;

    // Split document into main content and signature section
    const parts = documentText.split('IN WITNESS WHEREOF');
    const mainContent = parts[0];
    const signatureContent = parts[1] || '';

    // Process main document text
    const processedMainText = mainContent
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Handle headers - look for numbered sections
        if (para.includes('INTERIOR DESIGN SERVICES AGREEMENT')) {
          return `<h1>${para}</h1>`;
        } else if (para.match(/^\d+\./)) {
          return `<h2>${para}</h2>`;
        } else if (para.match(/^[A-Z]\./)) {
          return `<h3>${para}</h3>`;
        } else {
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
      })
      .join('');

    // Add processed main text
    htmlContent += processedMainText;

    // Add signature section with proper alignment
    if (signatureContent) {
      htmlContent += `<p style="font-weight: bold; font-size: 10.5pt;">IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.</p>`;
      
      // Extract client and designer names from the signature content
      const clientMatch = signatureContent.match(/CLIENT:\s*([^\n]*)/);
      const designerMatch = signatureContent.match(/DESIGNER:\s*([^\n]*)/);
      
      const clientName = clientMatch ? clientMatch[1].trim() : '[CLIENT NAME]';
      const designerName = designerMatch ? designerMatch[1].trim() : 'Prestige Interiors LLC';
      
      htmlContent += `
      <div class="signature-section">
        <table class="signature-table">
          <tr>
            <td style="text-align: left;"><strong>CLIENT:</strong></td>
            <td style="text-align: left;"><strong>DESIGNER:</strong></td>
          </tr>
          <tr>
            <td style="padding-top: 10pt; text-align: left;">${clientName}</td>
            <td style="padding-top: 10pt; text-align: left;">${designerName}</td>
          </tr>
          <tr>
            <td></td>
            <td style="padding-top: 10pt; text-align: left;">By: [AUTHORIZED SIGNATORY]</td>
          </tr>
          <tr>
            <td style="padding-top: 20pt;"><div class="signature-line"></div></td>
            <td style="padding-top: 20pt;"><div class="signature-line"></div></td>
          </tr>
          <tr>
            <td style="font-size: 10.5pt; text-align: left;">Signature</td>
            <td style="font-size: 10.5pt; text-align: left;">Signature</td>
          </tr>
          <tr>
            <td style="padding-top: 15pt; text-align: left;">Date: ____________________________</td>
            <td style="padding-top: 15pt; text-align: left;">Date: ____________________________</td>
          </tr>
        </table>
      </div>`;
    }
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob with proper DOC MIME type (better HTML compatibility)
    const blob = new Blob(['\ufeff' + htmlContent], { 
      type: 'application/msword;charset=utf-8' 
    });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Interior-Design-Services-Agreement-${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};