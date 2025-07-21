const { useState, useRef, useEffect } = React;

const MarketplaceGenerator = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [formData, setFormData] = useState({
        marketplaceName: 'Example Marketplace',
        companyName: 'Example Marketplace LLC',
        contactEmail: 'contact@example-marketplace.com'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const generateDocumentText = () => {
        return `MARKETPLACE SELLER AGREEMENT

This Marketplace Seller Agreement is entered into between ${formData.companyName} and the Seller for the purpose of selling products on the ${formData.marketplaceName} platform.

Contact Email: ${formData.contactEmail}

This is a basic test version of the agreement generator.`;
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

    const tabs = [
        { name: 'Basic Info' },
        { name: 'Preview' }
    ];

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h1 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Marketplace Seller Agreement Generator</h1>
                <p style={{ color: '#6b7280' }}>Create comprehensive marketplace seller agreements</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ background: '#f8f9fa', padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTab(index)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    marginRight: '0.5rem',
                                    background: currentTab === index ? 'white' : 'transparent',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    color: currentTab === index ? '#2563eb' : '#6b7280',
                                    fontWeight: currentTab === index ? '600' : '400'
                                }}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                    
                    <div style={{ padding: '2rem' }}>
                        {currentTab === 0 && (
                            <div>
                                <h2>Basic Information</h2>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        Marketplace Name
                                    </label>
                                    <input
                                        type="text"
                                        name="marketplaceName"
                                        value={formData.marketplaceName}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab === 1 && (
                            <div>
                                <h2>Document Preview</h2>
                                <button
                                    onClick={copyToClipboard}
                                    style={{ 
                                        background: '#2563eb', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '0.75rem 1rem', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    📋 Copy Agreement
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '1.5rem 2rem 1rem', borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>
                        <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>Live Preview</h3>
                        <small style={{ color: '#6b7280' }}>Updates as you type</small>
                    </div>
                    <div style={{ padding: '2rem', height: '400px', overflow: 'auto' }}>
                        <pre style={{ 
                            fontFamily: 'Times, serif', 
                            fontSize: '0.875rem', 
                            lineHeight: '1.6', 
                            whiteSpace: 'pre-wrap',
                            margin: 0
                        }}>
                            {generateDocumentText()}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<MarketplaceGenerator />, document.getElementById('root'));