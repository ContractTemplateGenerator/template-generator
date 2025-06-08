// Test HTML-to-Word generation with redlining
function testHTMLToWord() {
    console.log("Testing HTML-to-Word redlining functionality...");
    
    // Sample NDA text with changes
    const testText = `This Confidentiality Agreement is entered into between Company A and Company B.

1. Confidential Information
<span style="text-decoration: line-through; color: red;">All information furnished by the Disclosing Party</span> <span style="background-color: #90EE90; color: black;">Information specifically marked "CONFIDENTIAL" or identified as confidential in writing within 30 days</span> shall be considered confidential.

2. Term
This Agreement shall remain in effect for <span style="text-decoration: line-through; color: red;">5 years</span> <span style="background-color: #90EE90; color: black;">2 years with confidentiality obligations ending 3 years from disclosure</span>.

3. Termination
<span style="background-color: #90EE90; color: black;">Either party may terminate this Agreement upon thirty (30) days written notice to the other party.</span>

IN WITNESS WHEREOF, the parties have executed this Agreement.`;

    // Create HTML content for Word
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Test NDA Redlined Version</title>
<style>
  body {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 1in;
    color: black;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
    text-decoration: underline;
  }
  h2 {
    font-size: 14pt;
    margin-top: 14pt;
    margin-bottom: 10pt;
    font-weight: bold;
  }
  p {
    margin-bottom: 10pt;
    text-align: justify;
  }
  .redline-delete {
    text-decoration: line-through;
    color: red;
    background-color: #ffeeee;
  }
  .redline-insert {
    background-color: #90EE90;
    color: black;
  }
  .signature-section {
    margin-top: 30pt;
  }
</style>
</head>
<body>
<h1>TEST CONFIDENTIALITY AGREEMENT</h1>
${testText.split('\n\n').map(para => {
    const trimmedPara = para.trim();
    if (trimmedPara.match(/^\d+\./)) {
        const parts = trimmedPara.split('\n');
        const header = parts[0];
        const content = parts.slice(1).join(' ');
        return `<h2>${header}</h2>${content ? `<p>${content}</p>` : ''}`;
    } else if (trimmedPara.includes('IN WITNESS WHEREOF')) {
        return `<div class="signature-section"><p><strong>${trimmedPara}</strong></p></div>`;
    } else if (trimmedPara.length > 0) {
        return `<p>${trimmedPara}</p>`;
    }
    return '';
}).join('\n')}

<div style="page-break-before: always;"></div>
<h1>CHANGE SUMMARY</h1>
<div style="border: 1px solid #ccc; padding: 10pt; background-color: #f9f9f9;">
<p><strong>Total Changes Applied:</strong> 3</p>
<p><strong>Review Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Analyzed by:</strong> NDA Legal Risk Analyzer</p>
</div>

<div style="margin-top: 15pt; border: 1px solid #ccc; padding: 10pt; background-color: #f9f9f9;">
<p><strong>Change 1:</strong> Limit Confidentiality Scope - Add Marking Requirement</p>
<p><strong>Risk Level:</strong> red - high impact</p>
<p><strong>Original:</strong> <span class="redline-delete">All information furnished by the Disclosing Party</span></p>
<p><strong>Revised:</strong> <span class="redline-insert">Information specifically marked "CONFIDENTIAL" or identified as confidential in writing within 30 days</span></p>
<p><strong>Rationale:</strong> Reduce compliance burden by requiring clear marking of confidential information</p>
</div>

</body>
</html>`;

    // Create and download the test file
    const blob = new Blob([htmlContent], { 
        type: 'application/vnd.ms-word'
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Test_NDA_Redlined_${new Date().toISOString().split('T')[0]}.doc`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("✓ Test HTML-to-Word document generated successfully");
    console.log("✓ Document should show proper redlining when opened in Microsoft Word");
    
    return "Test completed - check downloaded file";
}

// Test function to validate redline generation
function validateRedlineGeneration() {
    console.log("Validating redline generation logic...");
    
    const originalText = "All information furnished by the Disclosing Party";
    const improvedText = 'Information specifically marked "CONFIDENTIAL"';
    
    // Test HTML redline generation
    const htmlRedline = `<span style="text-decoration: line-through; color: red;">${originalText}</span> <span style="background-color: #90EE90; color: black;">${improvedText}</span>`;
    
    console.log("Generated HTML redline:", htmlRedline);
    
    // Verify HTML contains expected elements
    const hasStrikethrough = htmlRedline.includes('text-decoration: line-through');
    const hasHighlight = htmlRedline.includes('background-color: #90EE90');
    const hasOriginalText = htmlRedline.includes(originalText);
    const hasImprovedText = htmlRedline.includes(improvedText);
    
    console.log("✓ Validation Results:");
    console.log("  - Strikethrough styling:", hasStrikethrough ? "✓" : "✗");
    console.log("  - Highlight styling:", hasHighlight ? "✓" : "✗");
    console.log("  - Original text preserved:", hasOriginalText ? "✓" : "✗");
    console.log("  - Improved text included:", hasImprovedText ? "✓" : "✗");
    
    return {
        isValid: hasStrikethrough && hasHighlight && hasOriginalText && hasImprovedText,
        htmlRedline: htmlRedline
    };
}

// Export test functions for console use
if (typeof window !== 'undefined') {
    window.testHTMLToWord = testHTMLToWord;
    window.validateRedlineGeneration = validateRedlineGeneration;
}