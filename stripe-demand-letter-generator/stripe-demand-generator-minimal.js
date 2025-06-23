// Minimal Stripe Demand Letter Generator - Working Version
const { useState, useRef } = React;

const StripeDemandGenerator = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        withheldAmount: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return React.createElement('div', { style: { padding: '20px', maxWidth: '800px', margin: '0 auto' } }, [
        React.createElement('h1', { key: 'title' }, 'Stripe Demand Letter Generator'),
        
        React.createElement('div', { key: 'form', style: { marginBottom: '20px' } }, [
            React.createElement('input', {
                key: 'company',
                type: 'text',
                placeholder: 'Company Name',
                value: formData.companyName,
                onChange: (e) => handleInputChange('companyName', e.target.value),
                style: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }
            }),
            
            React.createElement('input', {
                key: 'contact',
                type: 'text',
                placeholder: 'Contact Name',
                value: formData.contactName,
                onChange: (e) => handleInputChange('contactName', e.target.value),
                style: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }
            }),
            
            React.createElement('input', {
                key: 'email',
                type: 'email',
                placeholder: 'Email',
                value: formData.email,
                onChange: (e) => handleInputChange('email', e.target.value),
                style: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }
            }),
            
            React.createElement('input', {
                key: 'amount',
                type: 'text',
                placeholder: 'Withheld Amount',
                value: formData.withheldAmount,
                onChange: (e) => handleInputChange('withheldAmount', e.target.value),
                style: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }
            })
        ]),
        
        React.createElement('div', { key: 'preview', style: { border: '1px solid #ccc', padding: '20px', backgroundColor: '#f9f9f9' } }, [
            React.createElement('h3', { key: 'preview-title' }, 'Document Preview'),
            React.createElement('p', { key: 'preview-content' }, 
                `Company: ${formData.companyName || '[Company Name]'}\n` +
                `Contact: ${formData.contactName || '[Contact Name]'}\n` +
                `Email: ${formData.email || '[Email]'}\n` +
                `Amount: $${formData.withheldAmount || '[Amount]'}`
            )
        ])
    ]);
};

// Render the component
try {
    ReactDOM.render(React.createElement(StripeDemandGenerator), document.getElementById('root'));
    console.log('Minimal component rendered successfully');
} catch (error) {
    console.error('Error rendering minimal component:', error);
    document.getElementById('root').innerHTML = '<h1>Error Loading Generator</h1><p>Check console for details.</p>';
}