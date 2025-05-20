// Simplified Angel Investor Generator - Minimal Version
const AngelInvestorGenerator = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
    startupName: 'Acme Innovations, Inc.',
    startupState: 'Delaware',
    startupAddress: '123 Tech St, San Francisco, CA',
    investorName: 'John Doe',
    investmentAmount: '100000',
    equityPercentage: '10'
  });

  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>Angel Investor Agreement Generator</h1>
        <p>Create a professional angel investment agreement (Simple Version)</p>
      </div>
      
      <div className="generator-content">
        <div className="form-panel">
          <div className="tab-content">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="startupName">Company Name</label>
              <input 
                type="text" 
                id="startupName" 
                name="startupName" 
                value={formData.startupName}
                onChange={(e) => setFormData({...formData, startupName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="investorName">Investor Name</label>
              <input 
                type="text" 
                id="investorName" 
                name="investorName" 
                value={formData.investorName}
                onChange={(e) => setFormData({...formData, investorName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="investmentAmount">Investment Amount ($)</label>
              <input 
                type="number" 
                id="investmentAmount" 
                name="investmentAmount" 
                value={formData.investmentAmount}
                onChange={(e) => setFormData({...formData, investmentAmount: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="preview-panel">
          <div className="preview-header">
            <h3>Preview</h3>
          </div>
          <div className="preview-content">
            <pre className="document-preview">
              ANGEL INVESTOR AGREEMENT
              
              This Agreement is between {formData.startupName} and {formData.investorName}.
              Investment Amount: ${parseInt(formData.investmentAmount).toLocaleString()}
              Equity: {formData.equityPercentage}%
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the application
ReactDOM.render(<AngelInvestorGenerator />, document.getElementById('root'));
