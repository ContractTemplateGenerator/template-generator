const { useState } = React;

// Simple component
const SimpleAffiliateGenerator = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    affiliateName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Affiliate Agreement Generator</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Company Name:
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Affiliate Name:
        </label>
        <input
          type="text"
          name="affiliateName"
          value={formData.affiliateName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2>Preview:</h2>
        <div>
          <p>AFFILIATE AGREEMENT</p>
          <p>This Affiliate Agreement is entered into by and between:</p>
          <p>{formData.companyName || '[COMPANY NAME]'} ("Company"),</p>
          <p>and</p>
          <p>{formData.affiliateName || '[AFFILIATE NAME]'} ("Affiliate").</p>
        </div>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(
  <SimpleAffiliateGenerator />,
  document.getElementById('root')
);
