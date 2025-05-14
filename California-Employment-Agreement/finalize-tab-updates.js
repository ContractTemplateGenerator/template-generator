// This is the updated Finalize tab content
// Add this to the renderTabContent function's case 11

case 11: // Finalize
  return (
    <div className="tab-content">
      <div className="section-info">
        <p><i data-feather="info" className="info-icon"></i> Review and finalize your California Employment Agreement. You can download it as a Word document or copy the text to your clipboard.</p>
      </div>
      
      <div className="section-heading">Document Options</div>
      
      <div className="form-group">
        <label>File Name</label>
        <input 
          type="text" 
          name="fileName" 
          value={formData.fileName} 
          onChange={handleChange}
          placeholder="California-Employment-Agreement"
        />
        <div className="hint">Enter the filename for the Word document (without the .doc extension).</div>
      </div>
      
      <div className="section-heading">California Employment Law Disclaimer</div>
      
      <div className="section-info" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "#ef4444" }}>
        <p><i data-feather="alert-triangle" style={{ color: "#ef4444" }}></i> <strong>Important Notice:</strong> California employment law is complex and frequently changes. This document template provides a starting point but may need to be customized to meet the specific needs of your business and to ensure compliance with current California employment laws.</p>
        <p>Some key California employment law considerations include:</p>
        <ul style={{ marginLeft: "1.5rem", listStyleType: "disc" }}>
          <li>Strict overtime rules requiring payment at 1.5x for hours over 8 in a day or 40 in a week, and 2x for hours over 12 in a day</li>
          <li>Mandatory meal and rest break requirements with premium pay penalties</li>
          <li>Strict final paycheck timing requirements</li>
          <li>Prohibition on non-compete agreements (Business and Professions Code Section 16600)</li>
          <li>Limitations on IP assignment agreements (Labor Code Section 2870)</li>
          <li>Mandatory expense reimbursement (Labor Code Section 2802)</li>
          <li>Specific requirements for arbitration agreements</li>
        </ul>
        <p>For a compliant employment agreement tailored to your specific needs, please consult with a qualified employment attorney.</p>
      </div>
      
      <div className="section-heading">Legal Consultation</div>
      
      <div className="section-info">
        <p>If you need assistance with customizing your employment agreement or have questions about California employment law, I'm available for consultations.</p>
        <p style={{ marginTop: '15px' }}>
          <a href="https://terms.law/call/" target="_blank" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
            <i data-feather="calendar" style={{ marginRight: '8px' }}></i> Schedule a consultation
          </a>
        </p>
        <p style={{ marginTop: '10px' }}>
          <a href="" onClick={() => Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;} style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
            <i data-feather="video" style={{ marginRight: '8px' }}></i> Schedule a Zoom meeting
          </a>
        </p>
      </div>
    </div>
  );
