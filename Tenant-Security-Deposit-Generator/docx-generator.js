// MS Word Document Generator for Tenant Security Deposit Demand Letter
window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Create HTML content that can be rendered in Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Security Deposit Demand Letter</title>
<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    margin: 0;
  }
  h1 {
    text-align: center;
    font-size: 11pt;
    margin-bottom: 20pt;
    font-weight: bold;
  }
  h2 {
    font-size: 11pt;
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
  .enclosures {
    margin-top: 20pt;
  }
  ul {
    margin-left: 20pt;
  }
  li {
    margin-bottom: 5pt;
  }
  .demand-amount {
    font-weight: bold;
    font-size: 11pt;
  }
  .legal-citation {
    font-style: italic;
  }
  .deadline-notice {
    font-weight: bold;
    text-decoration: underline;
  }
</style>
</head>
<body>
${documentText}
</body>
</html>
    `;

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], {
      type: 'application/msword'
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Security_Deposit_Demand_Letter_${formData.tenantName || 'Document'}.doc`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log("Word document generated and download initiated");
    return true;
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("There was an error generating the Word document. Please try again.");
    return false;
  }
};

// Copy to clipboard functionality
window.copyToClipboard = function(text) {
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      // Show success message
      const message = document.createElement('div');
      message.innerHTML = '✓ Copied to clipboard!';
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      
      document.body.appendChild(message);
      
      setTimeout(() => {
        document.body.removeChild(message);
      }, 2000);
      
      return true;
    } else {
      throw new Error('Copy command failed');
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    
    // Fallback: show modal with text to copy manually
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 10001;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 80%;
      max-height: 80%;
      overflow: auto;
    `;
    
    content.innerHTML = `
      <h3>Copy the text below:</h3>
      <textarea readonly style="width: 100%; height: 300px; font-family: monospace; font-size: 12px;">${text}</textarea>
      <br><br>
      <button onclick="document.body.removeChild(this.closest('.modal'))" style="padding: 10px 20px; background: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    
    modal.className = 'modal';
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    return false;
  }
};