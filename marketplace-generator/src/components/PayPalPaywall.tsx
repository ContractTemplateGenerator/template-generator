import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { PaymentState } from '../types';

interface PayPalPaywallProps {
  onPaymentSuccess: (paymentData: PaymentState) => void;
}

const PayPalPaywall: React.FC<PayPalPaywallProps> = ({ onPaymentSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const paypalOptions = {
    clientId: "ASmwKug6zVE_78S-152YKAzzh2iH8VgSjs-P6RkrWcfqdznNjeE_UYwKJkuJ3BvIJrxCotS8GtXEJ2fx",
    currency: "USD",
    intent: "capture"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marketplace Seller Agreement Generator
          </h1>
          <p className="text-gray-600 mb-6">
            Generate professional marketplace seller agreements tailored to your business needs.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">What you'll get:</h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Comprehensive seller agreement template
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Real-time preview and editing
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Download as Word document
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Legally comprehensive terms
            </li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-2">$19.95</div>
          <div className="text-gray-600">One-time payment • Lifetime access</div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            disabled={isLoading}
            createOrder={(data, actions) => {
              setIsLoading(true);
              setError('');
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: "19.95",
                    currency_code: "USD"
                  },
                  description: "Marketplace Seller Agreement Generator"
                }],
                intent: "CAPTURE"
              });
            }}
            onApprove={async (data, actions) => {
              try {
                if (actions.order) {
                  const details = await actions.order.capture();
                  const paymentData: PaymentState = {
                    isPaymentCompleted: true,
                    transactionId: details.id,
                    paymentDate: new Date().toISOString()
                  };
                  
                  // Store payment status in localStorage
                  localStorage.setItem('marketplace-generator-payment', JSON.stringify(paymentData));
                  
                  onPaymentSuccess(paymentData);
                }
              } catch (error) {
                console.error('Payment capture error:', error);
                setError('Payment processing failed. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }}
            onError={(err) => {
              console.error('PayPal error:', err);
              setError('Payment failed. Please try again.');
              setIsLoading(false);
            }}
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal"
            }}
          />
        </PayPalScriptProvider>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by PayPal • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalPaywall;