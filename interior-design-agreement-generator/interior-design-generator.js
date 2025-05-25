const { useState, useEffect, useRef } = React;

const InteriorDesignAgreementGenerator = () => {
    // Basic state
    const [currentTab, setCurrentTab] = useState(0);
    const [isPaid, setIsPaid] = useState(false);
    const [showPaywall, setShowPaywall] = useState(true);

    // Basic form data
    const [formData, setFormData] = useState({
        designerName: 'Prestige Interiors LLC',
        clientName: '',
        agreementDate: new Date().toISOString().split('T')[0],
        eDesignFee: '2000'
    });

    // Check for payment
    useEffect(() => {
        const paidStatus = localStorage.getItem('interiorDesignPaid');
        if (paidStatus === 'true') {
            setIsPaid(true);
            setShowPaywall(false);
        }
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // PayPal payment handling
    const handlePayment = () => {
        if (typeof paypal !== 'undefined') {
            return paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: '14.95' }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(() => {
                        setIsPaid(true);
                        setShowPaywall(false);
                        localStorage.setItem('interiorDesignPaid', 'true');
                    });
                }
            }).render('#paypal-button-container');
        }
    };

    // PayPal effect
    useEffect(() => {
        if (showPaywall && !isPaid) {
            setTimeout(handlePayment, 1000);
        }
    }, [showPaywall]);

    // Simple document generation
    const documentText = `**INTERIOR DESIGN SERVICES AGREEMENT**

Agreement Date: ${formData.agreementDate}
Designer: ${formData.designerName}
Client: ${formData.clientName || '[CLIENT NAME]'}

Fee: $${formData.eDesignFee} per room`;

    // Copy function
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(documentText);
            alert('Agreement copied to clipboard!');
        } catch (err) {
            alert('Failed to copy to clipboard.');
        }
    };

    // Render paywall
    if (showPaywall && !isPaid) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    textAlign: 'center'
                }}>
                    <h2>Interior Design Services Agreement Generator</h2>
                    <p>Generate a comprehensive interior design services agreement.</p>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: '1rem 0'}}>
                        $14.95
                    </div>
                    <div id="paypal-button-container"></div>
                    <p style={{marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280'}}>
                        One-time payment • Instant access
                    </p>
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div style={{display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif'}}>
            <div style={{width: '50%', padding: '2rem', overflowY: 'auto'}}>
                <h1>Interior Design Services Agreement Generator</h1>
                
                <div style={{marginBottom: '1rem'}}>
                    <label>Designer Name:</label>
                    <input
                        type="text"
                        name="designerName"
                        value={formData.designerName}
                        onChange={handleChange}
                        style={{width: '100%', padding: '0.5rem', margin: '0.5rem 0'}}
                    />
                </div>

                <div style={{marginBottom: '1rem'}}>
                    <label>Client Name:</label>
                    <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        style={{width: '100%', padding: '0.5rem', margin: '0.5rem 0'}}
                    />
                </div>

                <div style={{marginBottom: '1rem'}}>
                    <label>E-Design Fee per Room ($):</label>
                    <input
                        type="number"
                        name="eDesignFee"
                        value={formData.eDesignFee}
                        onChange={handleChange}
                        style={{width: '100%', padding: '0.5rem', margin: '0.5rem 0'}}
                    />
                </div>

                <button
                    onClick={copyToClipboard}
                    style={{
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        padding: '0.7rem 1.2rem',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Copy to Clipboard
                </button>
            </div>

            <div style={{width: '50%', padding: '2rem', backgroundColor: '#f8fafc', overflowY: 'auto'}}>
                <h2>Live Preview</h2>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    fontFamily: 'Times New Roman, serif',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                }}>
                    {documentText}
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<InteriorDesignAgreementGenerator />, document.getElementById('root'));