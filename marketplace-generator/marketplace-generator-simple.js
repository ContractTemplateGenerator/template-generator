const { useState, useRef, useEffect } = React;

const MarketplaceGenerator = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [formData, setFormData] = useState({
        marketplaceName: 'Example Marketplace',
        companyName: 'Example Marketplace LLC',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const generateDocumentText = () => {
        return `MARKETPLACE SELLER AGREEMENT

This is a test agreement for ${formData.marketplaceName} operated by ${formData.companyName}.

This is a simplified version to test if the component loads properly.`;
    };

    const copyToClipboard = async () => {
        try {
            const text = generateDocumentText();
            await navigator.clipboard.writeText(text);
            alert('Agreement copied to clipboard!');
        } catch (err) {
            alert('Failed to copy to clipboard.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Marketplace Seller Agreement Generator - Test Version</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', border: '1px solid #ccc' }}>
                    <h2>Form</h2>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Marketplace Name:</label>
                        <input
                            type="text"
                            name="marketplaceName"
                            value={formData.marketplaceName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Company Name:</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                        />
                    </div>
                    <button 
                        onClick={copyToClipboard}
                        style={{ padding: '10px 20px', background: '#007cba', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Copy Agreement
                    </button>
                </div>
                
                <div style={{ background: 'white', padding: '20px', border: '1px solid #ccc' }}>
                    <h2>Preview</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                        {generateDocumentText()}
                    </pre>
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<MarketplaceGenerator />, document.getElementById('root'));