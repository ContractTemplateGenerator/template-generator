// Simple Consulting Agreement Generator
const App = () => {
  const [formData, setFormData] = React.useState({
    companyName: '',
    consultantName: '',
    effectiveDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Consulting Agreement Generator</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Consultant Name:
          <input
            type="text"
            name="consultantName"
            value={formData.consultantName}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Effective Date:
          <input
            type="date"
            name="effectiveDate"
            value={formData.effectiveDate}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>Preview:</h2>
        <div style={{ fontFamily: 'Times New Roman, serif', lineHeight: '1.6' }}>
          <h3 style={{ textAlign: 'center' }}>CONSULTING AGREEMENT</h3>
          <p>
            This Consulting Agreement is entered into between{' '}
            <strong>{formData.companyName || '[Company Name]'}</strong> ("Company") and{' '}
            <strong>{formData.consultantName || '[Consultant Name]'}</strong> ("Consultant")
            {formData.effectiveDate && ` as of ${formData.effectiveDate}`}.
          </p>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
