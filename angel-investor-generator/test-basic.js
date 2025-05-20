// Simple Angel Investor Generator - Basic Version
const AngelInvestorGenerator = () => {
  // Define states
  const [currentTab, setCurrentTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
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

  // Simple tooltip component
  const Tooltip = ({ text }) => (
    React.createElement('div', { className: 'tooltip-container' },
      React.createElement('span', { className: 'tooltip-icon' }, 'ⓘ'),
      React.createElement('div', { className: 'tooltip-text' }, text)
    )
  );

  // Render content for each tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Basic Information
        return React.createElement('div', { className: 'tab-content' },
          React.createElement('h3', null, 'Company and Investor Details'),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'startupName' }, 
                'Company Name *',
                React.createElement(Tooltip, { text: 'Legal name of the company' })
              ),
              React.createElement('input', {
                type: 'text',
                id: 'startupName',
                name: 'startupName',
                value: formData.startupName,
                onChange: handleInputChange,
                placeholder: 'e.g., Acme Innovations, Inc.'
              })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'startupState' }, 
                'State of Incorporation *',
                React.createElement(Tooltip, { text: 'State where the company is incorporated' })
              ),
              React.createElement('select', {
                id: 'startupState',
                name: 'startupState',
                value: formData.startupState,
                onChange: handleInputChange
              }, states.map(state => 
                React.createElement('option', { key: state, value: state }, state)
              ))
            )
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'investorName' }, 'Investor Name *'),
            React.createElement('input', {
              type: 'text',
              id: 'investorName',
              name: 'investorName',
              value: formData.investorName,
              onChange: handleInputChange,
              placeholder: 'Full name of the angel investor'
            })
          )
        );
      default:
        return React.createElement('div', { className: 'tab-content' },
          React.createElement('p', null, 'Please complete the information on the Basic Information tab.')
        );
    }
  };

  // Main component render
  return React.createElement('div', { className: 'generator-container' },
    React.createElement('div', { className: 'generator-header' },
      React.createElement('h1', null, 'Angel Investor Agreement Generator'),
      React.createElement('p', null, 'Create a professional angel investment agreement with customizable terms')
    ),
    React.createElement('div', { className: 'generator-content' },
      // Form Panel
      React.createElement('div', { className: 'form-panel' },
        // Tab Navigation
        React.createElement('div', { className: 'tab-navigation' },
          tabs.map((tab, index) =>
            React.createElement('button', {
              key: tab.id,
              className: `tab-button ${currentTab === index ? 'active' : ''}`,
              onClick: () => goToTab(index)
            }, `${index + 1}. ${tab.label}`)
          )
        ),
        // Tab Content
        React.createElement('div', { className: 'tab-content-container' },
          renderTabContent()
        ),
        // Navigation Buttons
        React.createElement('div', { className: 'navigation-buttons' },
          React.createElement('button', {
            onClick: prevTab,
            className: 'nav-button prev-button',
            disabled: currentTab === 0
          }, '← Previous'),
          React.createElement('button', {
            onClick: nextTab,
            className: 'nav-button next-button',
            disabled: currentTab === tabs.length - 1
          }, 'Next →')
        )
      ),
      // Preview Panel
      React.createElement('div', { className: 'preview-panel' },
        React.createElement('div', { className: 'preview-header' },
          React.createElement('h3', null, 'Live Preview'),
          React.createElement('p', null, 'Updates as you complete the form')
        ),
        React.createElement('div', { className: 'preview-content' },
          React.createElement('pre', { className: 'document-preview' }, documentText)
        )
      )
    )
  );
};

// Render the application
ReactDOM.render(React.createElement(AngelInvestorGenerator), document.getElementById('root'));