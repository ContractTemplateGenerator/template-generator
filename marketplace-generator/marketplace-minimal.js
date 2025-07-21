const { useState, useRef, useEffect } = React;

const MarketplaceGenerator = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [formData, setFormData] = useState({
        marketplaceName: 'Example Marketplace',
        companyName: 'Example Marketplace LLC',
        contactEmail: 'contact@example-marketplace.com',
        companyAddress: '123 Main Street, San Francisco, CA 94105',
        commissionPercentage: '15',
        paymentSchedule: 'bi-weekly',
        returnTimeframe: '30'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const generateDocumentText = () => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `MARKETPLACE SELLER AGREEMENT

Date: ${currentDate}

This Marketplace Seller Agreement ("Agreement") is entered into between ${formData.companyName}, a company located at ${formData.companyAddress}, and the individual or entity agreeing to these terms ("Seller") for the purpose of selling products on the ${formData.marketplaceName} platform.

1. COMMISSION STRUCTURE

The Marketplace will charge a commission of ${formData.commissionPercentage}% of the gross sale price for each completed transaction. Payments to Sellers will be made ${formData.paymentSchedule}.

2. RETURN POLICY

Customers may return items within ${formData.returnTimeframe} days of delivery for a full refund, provided items are in original condition.

3. CONTACT INFORMATION

For questions regarding this Agreement, contact us at ${formData.contactEmail}.

This Agreement shall be governed by applicable laws and any disputes shall be resolved through appropriate legal channels.

By using the platform, Seller agrees to be bound by all terms and conditions of this Agreement.

---

Document generated on ${currentDate} using the Marketplace Seller Agreement Generator.`;
    };

    const copyToClipboard = async () => {
        try {
            const text = generateDocumentText();
            await navigator.clipboard.writeText(text);
            alert('Agreement copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = generateDocumentText();
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Agreement copied to clipboard!');
            } catch (fallbackErr) {
                alert('Copy failed. Please select and copy the text manually.');
            }
            document.body.removeChild(textArea);
        }
    };

    const downloadAsText = () => {
        try {
            const text = generateDocumentText();
            const blob = new Blob([text], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const marketplaceName = formData.marketplaceName.replace(/[^a-zA-Z0-9]/g, '_') || 'Marketplace';
            a.href = url;
            a.download = `${marketplaceName}_Seller_Agreement.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            alert('Agreement downloaded as text file!');
        } catch (err) {
            console.error('Download failed:', err);
            alert('Download failed. Please copy the text manually.');
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
                                        Company Address
                                    </label>
                                    <textarea
                                        name="companyAddress"
                                        value={formData.companyAddress}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', resize: 'vertical' }}
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
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            Commission (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="commissionPercentage"
                                            value={formData.commissionPercentage}
                                            onChange={handleChange}
                                            min="0"
                                            max="50"
                                            step="0.1"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            Return Days
                                        </label>
                                        <input
                                            type="number"
                                            name="returnTimeframe"
                                            value={formData.returnTimeframe}
                                            onChange={handleChange}
                                            min="0"
                                            max="365"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        Payment Schedule
                                    </label>
                                    <select
                                        name="paymentSchedule"
                                        value={formData.paymentSchedule}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="bi-weekly">Bi-weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentTab === 1 && (
                            <div>
                                <h2>Document Preview</h2>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                    <button
                                        onClick={copyToClipboard}
                                        style={{ 
                                            background: '#2563eb', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '0.75rem 1rem', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer'
                                        }}
                                    >
                                        📋 Copy Agreement
                                    </button>
                                    <button
                                        onClick={downloadAsText}
                                        style={{ 
                                            background: '#dc2626', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '0.75rem 1rem', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer'
                                        }}
                                    >
                                        📄 Download TXT
                                    </button>
                                </div>
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