                    <li className="high">Specify the term length to establish the duration of the agreement.</li>}
                    
                  {((formData.paymentStructure === 'one-time' || formData.paymentStructure === 'subscription' || formData.paymentStructure === 'hybrid') && !formData.paymentAmount) && 
                    <li className="high">Specify the payment amount to ensure proper compensation.</li>}
                    
                  {((formData.paymentStructure === 'royalty' || formData.paymentStructure === 'hybrid') && !formData.royaltyPercentage) && 
                    <li className="high">Specify the royalty percentage for royalty-based payments.</li>}
                    
                  {(formData.internalUseOnly && formData.publicDeployment) && 
                    <li className="high">Resolve the conflict between "internal use only" and "public deployment" settings.</li>}
                    
                  {(formData.securityMeasures.length === 0) && 
                    <li className="medium">Consider specifying security requirements to protect sensitive data.</li>}
                    
                  {(!formData.ownershipWarranty) && 
                    <li className="high">Include an ownership warranty to ensure the licensor has the right to license the data.</li>}
                    
                  {(!formData.noInfringementWarranty) && 
                    <li className="medium">Consider adding a non-infringement warranty to protect against third-party claims.</li>}
                    
                  {(!formData.complianceWarranty) && 
                    <li className="medium">Consider adding a compliance warranty to ensure the data was collected legally.</li>}
                    
                  {(!formData.governingLaw) && 
                    <li className="medium">Specify the governing law to establish which jurisdiction's laws apply.</li>}
                    
                  {(formData.disputeResolution === 'arbitration' && !formData.arbitrationVenue) && 
                    <li className="medium">Specify the arbitration venue to establish where disputes will be resolved.</li>}
                </ul>
              </div>
              
              <div className="legal-notice">
                <h3>Important Legal Notice</h3>
                <p>This document generator creates a template that should be reviewed by a qualified attorney before use. The generated agreement may need customization based on your specific circumstances, applicable laws, and regulations. By using this generator, you acknowledge that:</p>
                <ul>
                  <li>This is not legal advice and does not create an attorney-client relationship.</li>
                  <li>AI training data licensing involves complex legal considerations including intellectual property rights, privacy laws, and regulatory compliance.</li>
                  <li>Laws regarding AI and data licensing vary by jurisdiction and are rapidly evolving.</li>
                  <li>For complex licensing scenarios, high-value datasets, or cross-border arrangements, professional legal advice is strongly recommended.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Preview Panel */}
        <div className="preview-panel" ref={previewRef}>
          <h2>Live Preview</h2>
          <div 
            className="document-preview" 
            dangerouslySetInnerHTML={{ __html: highlightedText.replace(/\n/g, '<br>') }} 
          />
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button 
          onClick={prevTab} 
          className="nav-button prev-button"
          disabled={currentTab === 0}
        >
          <i data-feather="chevron-left"></i>
          Previous
        </button>
        
        <button 
          onClick={openConsultation} 
          className="nav-button consult-button"
        >
          <i data-feather="message-circle"></i>
          Consultation
        </button>
        
        <button 
          onClick={copyToClipboard} 
          className="nav-button copy-button"
        >
          <i data-feather="copy"></i>
          Copy
        </button>
        
        <button 
          onClick={downloadAsWord} 
          className="nav-button download-button"
        >
          <i data-feather="file-text"></i>
          Download
        </button>
        
        <button 
          onClick={nextTab} 
          className="nav-button next-button"
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <i data-feather="chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  
  // Initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});
