// Angel Investor Generator - Simple but Complete Version
(function() {
  // Wait for the document to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    try {
      const { useState, useEffect, useRef } = React;
      
      // Create a simple tooltip component
      const Tooltip = ({ text }) => (
        <div className="tooltip-container">
          <span className="tooltip-icon">ⓘ</span>
          <div className="tooltip-text">{text}</div>
        </div>
      );
      
      // Main generator component
      const AngelInvestorGenerator = () => {
        // Define states
        const [currentTab, setCurrentTab] = useState(0);
        const [formData, setFormData] = useState({
          startupName: 'Acme Innovations, Inc.',
          startupState: 'Delaware',
          startupAddress: '123 Startup Way, San Francisco, CA 94105',
          founderName: 'Jane Smith',
          investorName: 'John Doe',
          investorAddress: '456 Angel Lane, Palo Alto, CA 94301',
          investmentAmount: '100000',
          equityPercentage: '10',
          premoneyValuation: '900000'
        });
        
        // All 50 US states
        const states = [
          'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
          'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
          'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
          'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
          'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
          'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
          'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];
        
        // Define tabs
        const tabs = [
          { id: 'basic', label: 'Basic Information' },
          { id: 'investment', label: 'Investment Terms' },
          { id: 'equity', label: 'Equity & Control' },
          { id: 'rights', label: 'Rights & Protections' },
          { id: 'legal', label: 'Legal Terms' },
          { id: 'finalization', label: 'Review & Finalize' }
        ];
        
        // Handle input changes
        const handleInputChange = (e) => {
          const { name, value, type, checked } = e.target;
          setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
          }));
        };
        
        // Tab navigation
        const goToTab = (index) => {
          setCurrentTab(index);
        };
        
        const nextTab = () => {
          if (currentTab < tabs.length - 1) {
            setCurrentTab(currentTab + 1);
          }
        };
        
        const prevTab = () => {
          if (currentTab > 0) {
            setCurrentTab(currentTab - 1);
          }
        };
        
        // Simple document text
        const documentText = `ANGEL INVESTOR AGREEMENT
      
This Agreement is between ${formData.startupName} and ${formData.investorName}.
Investment Amount: $${parseInt(formData.investmentAmount).toLocaleString()}
Equity: ${formData.equityPercentage}%
      `;
        
        // Render content for each tab
        const renderTabContent = () => {
          switch (currentTab) {
            case 0: // Basic Information
              return (
                <div className="tab-content">
                  <h3>Company and Investor Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="startupName">
                        Company Name *
                        <Tooltip text="Legal name of the company" />
                      </label>
                      <input
                        type="text"
                        id="startupName"
                        name="startupName"
                        value={formData.startupName}
                        onChange={handleInputChange}
                        placeholder="e.g., Acme Innovations, Inc."
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="startupState">
                        State of Incorporation *
                        <Tooltip text="State where the company is incorporated" />
                      </label>
                      <select
                        id="startupState"
                        name="startupState"
                        value={formData.startupState}
                        onChange={handleInputChange}
                      >
                        {states.map(state => 
                          <option key={state} value={state}>{state}</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="investorName">Investor Name *</label>
                    <input
                      type="text"
                      id="investorName"
                      name="investorName"
                      value={formData.investorName}
                      onChange={handleInputChange}
                      placeholder="Full name of the angel investor"
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="tab-content">
                  <p>Please complete the information on the Basic Information tab.</p>
                </div>
              );
          }
        };
        
        // Main component render
        return (
          <div className="generator-container">
            <div className="generator-header">
              <h1>Angel Investor Agreement Generator</h1>
              <p>Create a professional angel investment agreement with customizable terms</p>
            </div>
            <div className="generator-content">
              {/* Form Panel */}
              <div className="form-panel">
                {/* Tab Navigation */}
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
                {/* Tab Content */}
                <div className="tab-content-container">
                  {renderTabContent()}
                </div>
                {/* Navigation Buttons */}
                <div className="navigation-buttons">
                  <button
                    onClick={prevTab}
                    className="nav-button prev-button"
                    disabled={currentTab === 0}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={nextTab}
                    className="nav-button next-button"
                    disabled={currentTab === tabs.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>
              {/* Preview Panel */}
              <div className="preview-panel">
                <div className="preview-header">
                  <h3>Live Preview</h3>
                  <p>Updates as you complete the form</p>
                </div>
                <div className="preview-content">
                  <pre className="document-preview">{documentText}</pre>
                </div>
              </div>
            </div>
          </div>
        );
      };
      
      // Render the application
      ReactDOM.render(<AngelInvestorGenerator />, document.getElementById('root'));
      console.log("Generator component rendered successfully");
    } catch (error) {
      console.error("Error rendering Angel Investor Generator:", error);
      
      // Show error message in the UI
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="padding: 40px; text-align: center; background: #f8f9fb; color: #e74c3c; border: 2px solid #e74c3c; border-radius: 8px; margin: 20px;">
            <h1 style="color: #e74c3c;">Error Loading Generator</h1>
            <p>${error.message}</p>
            <p>Please try refreshing the page. If the problem persists, contact support.</p>
            <button onclick="location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
              Reload Page
            </button>
          </div>
        `;
      }
    }
  });
})();