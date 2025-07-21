import React, { useState, useEffect, useCallback } from 'react';
import PayPalPaywall from './components/PayPalPaywall';
import DocumentPreview from './components/DocumentPreview';
import ExportOptions from './components/ExportOptions';
import MarketplaceInfoForm from './components/FormSections/MarketplaceInfoForm';
import CommissionStructureForm from './components/FormSections/CommissionStructureForm';
import ProductRequirementsForm from './components/FormSections/ProductRequirementsForm';
import FulfillmentReturnsForm from './components/FormSections/FulfillmentReturnsForm';
import TerminationTermsForm from './components/FormSections/TerminationTermsForm';
import LegalTermsForm from './components/FormSections/LegalTermsForm';
import { AgreementData, PaymentState } from './types';

const initialAgreementData: AgreementData = {
  marketplaceInfo: {
    marketplaceName: '',
    marketplaceUrl: '',
    companyName: '',
    companyAddress: '',
    contactEmail: ''
  },
  commissionStructure: {
    commissionPercentage: 10,
    flatFee: 0.30,
    paymentSchedule: '',
    paymentMethod: ''
  },
  productRequirements: {
    prohibitedItems: '',
    listingRequirements: '',
    qualityStandards: '',
    imageRequirements: ''
  },
  fulfillmentReturns: {
    fulfillmentResponsibility: '',
    shippingTimeframe: '',
    returnPolicy: '',
    returnTimeframe: 30,
    customerServiceResponsibility: ''
  },
  terminationTerms: {
    noticePeriod: 30,
    terminationReasons: '',
    postTerminationObligations: '',
    dataRetention: ''
  },
  legalTerms: {
    governingLaw: '',
    disputeResolution: '',
    limitationOfLiability: '',
    intellectualProperty: ''
  }
};

function App() {
  const [paymentState, setPaymentState] = useState<PaymentState>({ isPaymentCompleted: false });
  const [agreementData, setAgreementData] = useState<AgreementData>(initialAgreementData);
  const [activeSection, setActiveSection] = useState(0);
  const [completionStatus, setCompletionStatus] = useState<boolean[]>([false, false, false, false, false, false]);

  // Check for existing payment on component mount
  useEffect(() => {
    const savedPayment = localStorage.getItem('marketplace-generator-payment');
    if (savedPayment) {
      try {
        const payment: PaymentState = JSON.parse(savedPayment);
        if (payment.isPaymentCompleted) {
          setPaymentState(payment);
        }
      } catch (error) {
        console.error('Error parsing saved payment data:', error);
      }
    }
  }, []);

  // CRITICAL FIX: Update agreement data with proper state management
  // This ensures ALL form changes trigger re-renders of the preview
  const updateMarketplaceInfo = useCallback((newData: typeof agreementData.marketplaceInfo) => {
    setAgreementData(prev => ({
      ...prev,
      marketplaceInfo: { ...newData }
    }));
  }, []);

  const updateCommissionStructure = useCallback((newData: typeof agreementData.commissionStructure) => {
    setAgreementData(prev => ({
      ...prev,
      commissionStructure: { ...newData }
    }));
  }, []);

  const updateProductRequirements = useCallback((newData: typeof agreementData.productRequirements) => {
    setAgreementData(prev => ({
      ...prev,
      productRequirements: { ...newData }
    }));
  }, []);

  const updateFulfillmentReturns = useCallback((newData: typeof agreementData.fulfillmentReturns) => {
    setAgreementData(prev => ({
      ...prev,
      fulfillmentReturns: { ...newData }
    }));
  }, []);

  const updateTerminationTerms = useCallback((newData: typeof agreementData.terminationTerms) => {
    setAgreementData(prev => ({
      ...prev,
      terminationTerms: { ...newData }
    }));
  }, []);

  const updateLegalTerms = useCallback((newData: typeof agreementData.legalTerms) => {
    setAgreementData(prev => ({
      ...prev,
      legalTerms: { ...newData }
    }));
  }, []);

  // Calculate completion status for each section
  useEffect(() => {
    const newCompletionStatus = [
      // Marketplace Info
      !!(agreementData.marketplaceInfo.marketplaceName && 
         agreementData.marketplaceInfo.companyName && 
         agreementData.marketplaceInfo.contactEmail),
      
      // Commission Structure
      !!(agreementData.commissionStructure.paymentSchedule && 
         agreementData.commissionStructure.paymentMethod),
      
      // Product Requirements
      !!(agreementData.productRequirements.prohibitedItems || 
         agreementData.productRequirements.listingRequirements),
      
      // Fulfillment & Returns
      !!(agreementData.fulfillmentReturns.fulfillmentResponsibility && 
         agreementData.fulfillmentReturns.shippingTimeframe),
      
      // Termination Terms
      !!(agreementData.terminationTerms.terminationReasons || 
         agreementData.terminationTerms.postTerminationObligations),
      
      // Legal Terms
      !!(agreementData.legalTerms.governingLaw && 
         agreementData.legalTerms.disputeResolution)
    ];
    
    setCompletionStatus(newCompletionStatus);
  }, [agreementData]);

  const handlePaymentSuccess = (payment: PaymentState) => {
    setPaymentState(payment);
  };

  // If payment not completed, show paywall
  if (!paymentState.isPaymentCompleted) {
    return <PayPalPaywall onPaymentSuccess={handlePaymentSuccess} />;
  }

  const sections = [
    {
      title: 'Marketplace Information',
      component: (
        <MarketplaceInfoForm
          data={agreementData.marketplaceInfo}
          onChange={updateMarketplaceInfo}
        />
      )
    },
    {
      title: 'Commission Structure',
      component: (
        <CommissionStructureForm
          data={agreementData.commissionStructure}
          onChange={updateCommissionStructure}
        />
      )
    },
    {
      title: 'Product Requirements',
      component: (
        <ProductRequirementsForm
          data={agreementData.productRequirements}
          onChange={updateProductRequirements}
        />
      )
    },
    {
      title: 'Fulfillment & Returns',
      component: (
        <FulfillmentReturnsForm
          data={agreementData.fulfillmentReturns}
          onChange={updateFulfillmentReturns}
        />
      )
    },
    {
      title: 'Termination Terms',
      component: (
        <TerminationTermsForm
          data={agreementData.terminationTerms}
          onChange={updateTerminationTerms}
        />
      )
    },
    {
      title: 'Legal Terms',
      component: (
        <LegalTermsForm
          data={agreementData.legalTerms}
          onChange={updateLegalTerms}
        />
      )
    }
  ];

  const overallCompletion = Math.round((completionStatus.filter(Boolean).length / completionStatus.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Marketplace Seller Agreement Generator
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Create professional marketplace seller agreements
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Completion</div>
              <div className="text-2xl font-bold text-green-600">{overallCompletion}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Form Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Agreement Sections</h2>
              
              <nav className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                      activeSection === index
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{section.title}</span>
                    {completionStatus[index] && (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </nav>

              {/* Export Options */}
              <div className="mt-8">
                <ExportOptions data={agreementData} />
              </div>
            </div>
          </div>

          {/* Middle Column - Current Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {sections[activeSection].component}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                  disabled={activeSection === sections.length - 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Document Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-8">
              <div className="bg-gray-50 px-6 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Document Preview</h2>
                <p className="text-sm text-gray-600">Live preview of your agreement</p>
              </div>
              <div className="h-96 lg:h-[600px] overflow-y-auto">
                <DocumentPreview data={agreementData} className="border-none shadow-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;