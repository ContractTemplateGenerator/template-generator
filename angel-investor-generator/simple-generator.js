// Angel Investor Generator - React Component without JSX
const { useState, useEffect, useRef } = React;
const { createElement: h } = React;

const AngelInvestorGenerator = () => {
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
    premoneyValuation: '900000',
    valuationCap: '',
    discountRate: '',
    securitiesType: 'common',
    boardRepresentation: 'observer',
    antiDilution: 'weighted_average',
    liquidationPreference: 'participating',
    governingLaw: 'California',
    disputeResolution: 'arbitration',
    signatureDate: new Date().toISOString().split('T')[0]
  });

  const [isPaid, setIsPaid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastChanged, setLastChanged] = useState(null);
  const previewRef = useRef(null);

  const FORM_DATA_KEY = "angel_investor_form_data";
  const PAID_STATUS_KEY = "angel_investor_paid";

  // Check payment status on load
  useEffect(() => {
    const savedPaidStatus = localStorage.getItem(PAID_STATUS_KEY);
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('payment') === 'success' || savedPaidStatus === 'true') {
      setIsPaid(true);
      setShowSuccessModal(urlParams.get('payment') === 'success');
    }

    // Restore form data
    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  }, []);

  // Save form data when it changes
  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  }, [formData]);

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'investment', label: 'Investment Terms' },
    { id: 'equity', label: 'Equity & Control' },
    { id: 'legal', label: 'Legal Terms' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLastChanged(name);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const goToTab = (index) => {
    setCurrentTab(index);
  };

  const handleUnlock = () => {
    setIsPaid(true);
    localStorage.setItem(PAID_STATUS_KEY, 'true');
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  };

  const resetForm = () => {
    setFormData({
      startupName: '',
      startupState: 'Delaware',
      startupAddress: '',
      founderName: '',
      investorName: '',
      investorAddress: '',
      investmentAmount: '',
      equityPercentage: '',
      premoneyValuation: '',
      securitiesType: 'common',
      boardRepresentation: 'observer',
      antiDilution: 'weighted_average',
      liquidationPreference: 'participating',
      governingLaw: 'California',
      disputeResolution: 'arbitration',
      signatureDate: new Date().toISOString().split('T')[0]
    });
    localStorage.removeItem(FORM_DATA_KEY);
  };

  // Simple document generation for now
  const generateDocumentText = () => {
    const postmoneyValuation = formData.premoneyValuation ? 
      parseInt(formData.premoneyValuation) + parseInt(formData.investmentAmount || 0) : 
      'TBD';

    return `ANGEL INVESTOR AGREEMENT

This Angel Investor Agreement (this "Agreement") is made and entered into as of ${formData.signatureDate}, by and between ${formData.startupName}, a ${formData.startupState} corporation (the "Company"), and ${formData.investorName}, an individual (the "Investor").

1. INVESTMENT TERMS

a) Investment Amount and Consideration. The Investor agrees to purchase ${formData.equityPercentage}% of the outstanding shares of ${formData.securitiesType} stock of the Company for a total investment of $${parseInt(formData.investmentAmount || 0).toLocaleString()}. This investment values the Company at a pre-money valuation of $${parseInt(formData.premoneyValuation || 0).toLocaleString()} and a post-money valuation of $${postmoneyValuation.toLocaleString ? postmoneyValuation.toLocaleString() : postmoneyValuation}.

b) Securities to be Issued. In exchange for the investment amount, the Company shall issue to the Investor shares of ${formData.securitiesType} stock, representing ${formData.equityPercentage}% of the fully diluted shares of the Company on a post-closing basis.

c) Use of Investment Proceeds. The Company shall use the investment proceeds for general corporate purposes, including but not limited to product development, marketing, and working capital needs.

2. GOVERNANCE RIGHTS

a) Board of Directors. ${formData.boardRepresentation === 'board_seat' ? 
  'The Investor shall be entitled to designate one member to the Company\'s Board of Directors.' : 
  formData.boardRepresentation === 'observer' ?
  'The Investor shall have the right to designate a board observer who may attend all board meetings.' :
  'The Investor shall not have board representation under this Agreement.'}

b) Anti-Dilution Protection. ${formData.antiDilution === 'weighted_average' ? 
  'The Investor shall be protected against dilution through weighted average anti-dilution provisions.' :
  formData.antiDilution === 'full_ratchet' ?
  'The Investor shall be protected against dilution through full ratchet anti-dilution provisions.' :
  'The Investor shall not receive anti-dilution protection under this Agreement.'}

3. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}.

IN WITNESS WHEREOF, the parties have executed this Angel Investor Agreement as of the date first written above.

COMPANY:                           INVESTOR:

${formData.startupName}            ${formData.investorName}

By: _________________________      _________________________
    ${formData.founderName}         ${formData.investorName}
    Chief Executive Officer        Investor

Date: ${formData.signatureDate}     Date: _________________`;
  };

  return h('div', { className: 'generator-container' },
    // Header
    h('div', { className: 'generator-header' },
      h('h1', null, 'Angel Investor Agreement Generator'),
      h('p', null, 'Create a professional angel investment agreement')
    ),
    
    // Content
    h('div', { className: 'generator-content' },
      // Form Panel
      h('div', { className: 'form-panel' },
        // Tab Navigation
        h('div', { className: 'tab-navigation' },
          tabs.map((tab, index) => 
            h('button', {
              key: tab.id,
              className: `tab-button ${currentTab === index ? 'active' : ''}`,
              onClick: () => goToTab(index)
            }, `${index + 1}. ${tab.label}`)
          )
        ),
        
        // Tab Content
        h('div', { className: 'tab-content-container' },
          currentTab === 0 && h('div', { className: 'tab-content' },
            h('h3', null, 'Company and Investor Details'),
            h('div', { className: 'form-group' },
              h('label', null, 'Company Name'),
              h('input', {
                type: 'text',
                name: 'startupName',
                value: formData.startupName,
                onChange: handleInputChange,
                placeholder: 'e.g., Acme Innovations, Inc.'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Company Address'),
              h('input', {
                type: 'text',
                name: 'startupAddress',
                value: formData.startupAddress,
                onChange: handleInputChange,
                placeholder: 'Full company address'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'CEO/Founder Name'),
              h('input', {
                type: 'text',
                name: 'founderName',
                value: formData.founderName,
                onChange: handleInputChange,
                placeholder: 'Name of person signing for company'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Investor Name'),
              h('input', {
                type: 'text',
                name: 'investorName',
                value: formData.investorName,
                onChange: handleInputChange,
                placeholder: 'Full name of angel investor'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Investor Address'),
              h('input', {
                type: 'text',
                name: 'investorAddress',
                value: formData.investorAddress,
                onChange: handleInputChange,
                placeholder: 'Full investor address'
              })
            )
          ),
          
          currentTab === 1 && h('div', { className: 'tab-content' },
            h('h3', null, 'Investment Structure'),
            h('div', { className: 'form-group' },
              h('label', null, 'Investment Amount ($)'),
              h('input', {
                type: 'number',
                name: 'investmentAmount',
                value: formData.investmentAmount,
                onChange: handleInputChange,
                placeholder: '100000'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Equity Percentage (%)'),
              h('input', {
                type: 'number',
                name: 'equityPercentage',
                value: formData.equityPercentage,
                onChange: handleInputChange,
                placeholder: '10'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Pre-Money Valuation ($)'),
              h('input', {
                type: 'number',
                name: 'premoneyValuation',
                value: formData.premoneyValuation,
                onChange: handleInputChange,
                placeholder: '900000'
              })
            ),
            h('div', { className: 'form-group' },
              h('label', null, 'Agreement Date'),
              h('input', {
                type: 'date',
                name: 'signatureDate',
                value: formData.signatureDate,
                onChange: handleInputChange
              })
            )
          )
        ),
        
        // Navigation Buttons
        h('div', { className: 'navigation-buttons' },
          h('button', {
            onClick: prevTab,
            className: 'nav-button prev-button',
            disabled: currentTab === 0
          }, '← Previous'),
          
          h('button', {
            onClick: () => {
              if (!isPaid) {
                alert('Please purchase the agreement to enable copying.');
                return;
              }
              const text = generateDocumentText();
              navigator.clipboard.writeText(text).then(() => {
                alert('Agreement copied to clipboard!');
              });
            },
            className: 'nav-button copy-button',
            disabled: !isPaid
          }, '📋 Copy'),
          
          h('button', {
            onClick: () => {
              if (!isPaid) {
                alert('Please purchase the agreement to enable downloading.');
                return;
              }
              if (window.generateWordDoc) {
                window.generateWordDoc(generateDocumentText(), {
                  documentTitle: 'Angel Investor Agreement',
                  fileName: 'Angel_Investor_Agreement'
                });
              }
            },
            className: 'nav-button download-button',
            disabled: !isPaid
          }, '📄 Download'),
          
          h('button', {
            onClick: nextTab,
            className: 'nav-button next-button',
            disabled: currentTab === tabs.length - 1
          }, 'Next →')
        ),
        
        h('button', {
          onClick: resetForm,
          className: 'reset-button'
        }, 'Reset Form'),
        
        h('button', {
          className: 'consultation-button',
          onClick: () => {
            if (window.Calendly && window.Calendly.initPopupWidget) {
              window.Calendly.initPopupWidget({
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'
              });
            } else {
              window.open('https://terms.law/call/', '_blank');
            }
          }
        }, '📞 Schedule Legal Consultation')
      ),
      
      // Preview Panel
      h('div', { className: 'preview-panel' },
        h('div', { className: 'preview-header' },
          h('h3', null, 'Live Preview'),
          h('p', null, 'Updates as you complete the form')
        ),
        h('div', { className: `preview-content ${!isPaid ? 'locked' : ''}`, ref: previewRef },
          h('pre', {
            className: 'document-preview'
          }, generateDocumentText()),
          
          !isPaid && h('div', null,
            h('div', { className: 'preview-overlay' }),
            h('div', { className: 'paywall-modal' },
              h('div', { className: 'paywall-content' },
                h('h4', null, '🔒 Unlock Full Agreement'),
                h('p', null, 'Purchase to download, copy, and customize this agreement'),
                h('div', { id: 'paypal-button-container-angel' }),
                h('div', { className: 'features-list' },
                  h('div', { className: 'feature' }, '✓ Complete legal agreement'),
                  h('div', { className: 'feature' }, '✓ Professional MS Word download'),
                  h('div', { className: 'feature' }, '✓ Customizable for your needs'),
                  h('div', { className: 'feature' }, '✓ Created by licensed attorney')
                ),
                h('div', { className: 'unlock-section' },
                  h('p', null, 'Already purchased? Enter your PayPal transaction ID:'),
                  h('input', {
                    type: 'text',
                    id: 'transactionId',
                    placeholder: 'PayPal Transaction ID',
                    className: 'transaction-input'
                  }),
                  h('button', {
                    onClick: () => {
                      const transactionId = document.getElementById('transactionId').value.trim();
                      if (transactionId && transactionId.length > 8) {
                        handleUnlock();
                        setShowSuccessModal(true);
                      } else {
                        alert('Please enter a valid PayPal transaction ID');
                      }
                    },
                    className: 'unlock-button'
                  }, 'Unlock Agreement')
                )
              )
            )
          )
        )
      )
    ),
    
    // Success Modal
    showSuccessModal && h('div', { className: 'modal-overlay' },
      h('div', { className: 'success-modal' },
        h('h3', null, '✅ Payment Successful!'),
        h('p', null, 'Your angel investor agreement is now unlocked.'),
        h('button', {
          onClick: () => setShowSuccessModal(false),
          className: 'success-button'
        }, 'Continue')
      )
    )
  );
};

// Load PayPal when component mounts
setTimeout(() => {
  const script = document.createElement('script');
  script.src = "https://www.paypal.com/sdk/js?client-id=BAAgTb2uhmcrPfZVsUbREYsqOgos8TI_UzVWxMmC1Gj0D8ek_GK7qHVAL9UgpBIVLXnUaPAo3scmaTKX5U&components=hosted-buttons&enable-funding=venmo&currency=USD";
  script.async = true;
  script.onload = () => {
    if (window.paypal && document.getElementById('paypal-button-container-angel')) {
      window.paypal.HostedButtons({
        hostedButtonId: "2YGAB8Z2WYXFS",
        onApprove: function(data) {
          // We'll handle this in the component
          window.dispatchEvent(new CustomEvent('paypal-success'));
        }
      }).render("#paypal-button-container-angel");
    }
  };
  document.head.appendChild(script);
}, 1000);

// Render the component
ReactDOM.render(React.createElement(AngelInvestorGenerator), document.getElementById('root'));