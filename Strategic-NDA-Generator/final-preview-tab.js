// Final Preview Tab Component
const FinalPreviewTab = ({ ndaText, formData }) => {
  
  // Function to copy NDA text to clipboard
  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = ndaText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("NDA text copied to clipboard!");
  };
  
  // Function to download MS Word document
  const downloadWord = () => {
    try {
      // Call the global function defined in docx-generator.js
      window.generateWordDoc(ndaText, formData);
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  return (
    <div>
      <h2 className="section-title">Final Preview</h2>
      
      <div className="info-box security-clause">
        <div className="info-box-header">
          <Icon name="alert-circle" className="info-box-icon" />
          <div>
            <p className="info-box-title"><strong>Final Step:</strong> Review your completed NDA and make any necessary adjustments.</p>
            <p className="info-box-content">You can go back to any previous tab to make changes. Your NDA will update in real-time.</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="card-title">Download Options</h3>
        <p style={{fontSize: "0.875rem", marginBottom: "1rem"}}>Your NDA is ready! You can copy the text or download as a Word document.</p>
        <div style={{display: "flex", gap: "1rem", flexWrap: "wrap"}}>
          <button
            className="nav-button next-button"
            onClick={copyToClipboard}
          >
            <Icon name="copy" style={{marginRight: "0.25rem"}} /> Copy NDA Text
          </button>
          
          <button
            className="nav-button next-button"
            style={{backgroundColor: "#2563eb"}}
            onClick={downloadWord}
          >
            <Icon name="file-text" style={{marginRight: "0.25rem"}} /> Download MS Word
          </button>
          
          <a 
            href="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting" 
            target="_blank" 
            className="nav-button prev-button"
            style={{display: "inline-flex", textDecoration: "none"}}
          >
            <Icon name="calendar" style={{marginRight: "0.25rem"}} /> Schedule Consultation
          </a>
        </div>
      </div>
      
      <div className="card">
        <h3 className="card-title">Important Notes:</h3>
        <ul style={{listStyle: "disc", paddingLeft: "1.25rem", fontSize: "0.875rem"}}>
          <li style={{marginBottom: "0.5rem"}}>Ensure all parties sign the NDA (including any side letter if using pseudonyms).</li>
          <li style={{marginBottom: "0.5rem"}}>This generator provides a template - consider consulting with an attorney before finalizing.</li>
          <li style={{marginBottom: "0.5rem"}}>If you're in California, be aware of special laws restricting NDAs in certain contexts (sexual harassment, etc.).</li>
          <li style={{marginBottom: "0.5rem"}}>Keep a copy of the signed agreement for your records.</li>
          <li>Hover over <Icon name="help-circle" style={{width: "14px", height: "14px", verticalAlign: "middle"}} /> icons throughout the form for additional information and legal context.</li>
        </ul>
      </div>
      
      <div className="card">
        <h3 className="card-title">Color Legend:</h3>
        <div>
          <div style={{display: "flex", alignItems: "center", marginBottom: "0.5rem"}}>
            <div style={{width: "20px", height: "20px", backgroundColor: "#10b981", marginRight: "10px", borderRadius: "4px"}}></div>
            <span style={{fontSize: "0.875rem"}}>Best practices for strong, enforceable NDAs</span>
          </div>
          <div style={{display: "flex", alignItems: "center", marginBottom: "0.5rem"}}>
            <div style={{width: "20px", height: "20px", backgroundColor: "#f59e0b", marginRight: "10px", borderRadius: "4px"}}></div>
            <span style={{fontSize: "0.875rem"}}>Caution areas requiring careful consideration</span>
          </div>
          <div style={{display: "flex", alignItems: "center"}}>
            <div style={{width: "20px", height: "20px", backgroundColor: "#ef4444", marginRight: "10px", borderRadius: "4px"}}></div>
            <span style={{fontSize: "0.875rem"}}>Critical components where the Stormy Daniels NDA failed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
