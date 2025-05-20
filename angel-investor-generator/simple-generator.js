// Angel Investor Generator - Fixed Date Format and Checkbox Spacing
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
    securitiesType: 'common',
    boardRepresentation: 'observer',
    antiDilution: 'weighted_average',
    liquidationPreference: 'non_participating',
    dividendRights: 'none',
    informationRights: 'standard',
    tagAlong: true,
    dragAlong: true,
    rightOfFirstRefusal: true,
    includeConfidentiality: true,
    confidentialityPeriod: '5',
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

  // Function to format date to readable format
  const formatDateToReadable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

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
      liquidationPreference: 'non_participating',
      dividendRights: 'none',
      informationRights: 'standard',
      tagAlong: true,
      dragAlong: true,
      rightOfFirstRefusal: true,
      includeConfidentiality: true,
      confidentialityPeriod: '5',
      governingLaw: 'California',
      disputeResolution: 'arbitration',
      signatureDate: new Date().toISOString().split('T')[0]
    });
    localStorage.removeItem(FORM_DATA_KEY);
  };