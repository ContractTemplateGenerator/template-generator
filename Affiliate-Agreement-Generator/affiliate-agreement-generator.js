                    <input
                      type="checkbox"
                      id="terminationForBreach"
                      name="terminationOptions.immediateForBreach"
                      checked={formData.terminationOptions.immediateForBreach}
                      onChange={handleChange}
                    />
                    Allow immediate termination for material breach
                  </label>
                </div>
                <small>Either party can terminate immediately if the other party materially breaches the agreement.</small>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="terminationOptions.immediateForBankruptcy">Immediate Termination for Bankruptcy/Insolvency</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    id="terminationForBankruptcy"
                    name="terminationOptions.immediateForBankruptcy"
                    checked={formData.terminationOptions.immediateForBankruptcy}
                    onChange={handleChange}
                  />
                  Allow immediate termination for bankruptcy/insolvency
                </label>
              </div>
              <small>Either party can terminate immediately if the other party becomes insolvent or files for bankruptcy.</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="terminationOptions.otherTermination">Other Termination Conditions</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    id="otherTermination"
                    name="terminationOptions.otherTermination"
                    checked={formData.terminationOptions.otherTermination}
                    onChange={handleChange}
                  />
                  Include other termination conditions
                </label>
              </div>
            </div>
            
            {formData.terminationOptions.otherTermination && (
              <div className="form-group">
                <label htmlFor="otherTerminationConditions">Specify Other Termination Conditions</label>
                <textarea
                  id="otherTerminationConditions"
                  name="otherTerminationConditions"
                  value={formData.otherTerminationConditions}
                  onChange={handleChange}
                  placeholder="e.g., Termination if affiliate sells business, changes control"
                  rows="3"
                />
              </div>
            )}
          </div>
        );
        
      case 10: // Additional Terms
        return (
          <div className="form-panel">
            <h2>Additional Terms</h2>
            <p>Specify additional legal terms for the agreement.</p>
            
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law (State/Jurisdiction)</label>
              <input
                type="text"
                id="governingLaw"
                name="governingLaw"
                value={formData.governingLaw}
                onChange={handleChange}
                placeholder="e.g., California"
              />
              <small>The state or jurisdiction whose laws will govern the agreement.</small>
            </div>
            
            <div className="form-group">
              <label>Dispute Resolution</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="disputeResolution"
                    value="litigation"
                    checked={formData.disputeResolution === 'litigation'}
                    onChange={handleChange}
                  />
                  Litigation in court
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="disputeResolution"
                    value="arbitration"
                    checked={formData.disputeResolution === 'arbitration'}
                    onChange={handleChange}
                  />
                  Binding arbitration
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="disputeResolution"
                    value="mediation"
                    checked={formData.disputeResolution === 'mediation'}
                    onChange={handleChange}
                  />
                  Mediation before litigation
                </label>
              </div>
            </div>
            
            {formData.disputeResolution === 'arbitration' && (
              <div className="form-group">
                <label htmlFor="arbitrationVenue">Arbitration Venue</label>
                <input
                  type="text"
                  id="arbitrationVenue"
                  name="arbitrationVenue"
                  value={formData.arbitrationVenue}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, California"
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Standard Clauses</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="modificationInWriting"
                    checked={formData.modificationInWriting}
                    onChange={handleChange}
                  />
                  Modification in writing only
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="entireAgreement"
                    checked={formData.entireAgreement}
                    onChange={handleChange}
                  />
                  Entire agreement clause
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="forceMajeure"
                    checked={formData.forceMajeure}
                    onChange={handleChange}
                  />
                  Force majeure clause
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="customClauses">Custom Clauses (Optional)</label>
              <textarea
                id="customClauses"
                name="customClauses"
                value={formData.customClauses}
                onChange={handleChange}
                placeholder="Enter any additional custom clauses to include in the agreement"
                rows="5"
              />
            </div>
          </div>
        );
        
      case 11: // Agreement Analysis
        return (
          <div className="form-panel">
            <h2>Agreement Analysis & Review</h2>
            <p>Your affiliate agreement has been analyzed for completeness, risks, and strengths.</p>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: agreementAnalysis.score >= 90 ? '#d1fae5' : agreementAnalysis.score >= 75 ? '#fef3c7' : '#fee2e2', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '10px', color: agreementAnalysis.score >= 90 ? '#065f46' : agreementAnalysis.score >= 75 ? '#92400e' : '#991b1b' }}>
                Agreement Score: {agreementAnalysis.score}/100
              </h3>
              <p style={{ margin: 0, color: agreementAnalysis.score >= 90 ? '#065f46' : agreementAnalysis.score >= 75 ? '#92400e' : '#991b1b' }}>
                {agreementAnalysis.score >= 90 
                  ? 'Excellent! Your agreement is comprehensive and well-structured.' 
                  : agreementAnalysis.score >= 75 
                    ? 'Good agreement with some areas for improvement.' 
                    : 'Your agreement needs significant improvement in key areas.'}
              </p>
            </div>
            
            {agreementAnalysis.issues.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#991b1b' }}>Critical Issues</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {agreementAnalysis.issues.map((issue, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#991b1b' }}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {agreementAnalysis.warnings.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#92400e' }}>Recommendations</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {agreementAnalysis.warnings.map((warning, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#92400e' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {agreementAnalysis.strengths.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#065f46' }}>Strengths</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {agreementAnalysis.strengths.map((strength, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#065f46' }}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="form-group mt-2">
              <div className="navigation-buttons">
                <button
                  onClick={copyToClipboard}
                  className="nav-button"
                  style={{
                    backgroundColor: "#4f46e5", 
                    color: "white",
                    border: "none",
                    flex: 1
                  }}
                >
                  <i data-feather="copy" style={{marginRight: "0.5rem"}}></i>
                  Copy to Clipboard
                </button>
                
                <button
                  onClick={downloadAsWord}
                  className="nav-button"
                  style={{
                    backgroundColor: "#2563eb", 
                    color: "white",
                    border: "none",
                    flex: 1
                  }}
                >
                  <i data-feather="file-text" style={{marginRight: "0.5rem"}}></i>
                  Download MS Word
                </button>
              </div>
            </div>
            
            <div className="form-group mt-2">
              <p className="text-center">
                Need professional legal guidance on your affiliate agreement?
              </p>
              <p className="text-center">
                <a href="" onClick={() => {
                  Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'});
                  return false;
                }}>
                  Schedule a consultation
                </a>
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container">
      <h1>Affiliate Agreement Generator</h1>
      
      {/* Tab navigation */}
      <div className="tab-navigation">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`tab-button ${currentTab === index ? 'active' : ''}`}
            onClick={() => goToTab(index)}
          >
            {index + 1}. {tab.label}
          </button>
        ))}
      </div>
      
      {/* Preview container */}
      <div className="preview-container">
        {/* Form panel */}
        {renderForm()}
        
        {/* Preview panel */}
        <div className="preview-panel" ref={previewRef}>
          <div className="preview-content">
            <h2>Live Preview</h2>
            <pre 
              className="document-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
          disabled={currentTab === 0}
        >
          <i data-feather="chevron-left" style={{marginRight: "0.5rem"}}></i>
          Previous
        </button>
        
        {currentTab < tabs.length - 1 && (
          <>
            <button
              onClick={copyToClipboard}
              className="nav-button"
              style={{
                backgroundColor: "#4f46e5", 
                color: "white",
                border: "none"
              }}
            >
              <i data-feather="copy" style={{marginRight: "0.5rem"}}></i>
              Copy to Clipboard
            </button>
            
            <button
              onClick={downloadAsWord}
              className="nav-button"
              style={{
                backgroundColor: "#2563eb", 
                color: "white",
                border: "none"
              }}
            >
              <i data-feather="file-text" style={{marginRight: "0.5rem"}}></i>
              Download MS Word
            </button>
          </>
        )}
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <i data-feather="chevron-right" style={{marginLeft: "0.5rem"}}></i>
        </button>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(
  <AffiliateAgreementGenerator />,
  document.getElementById('root')
);
