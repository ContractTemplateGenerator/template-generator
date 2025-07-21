import React from 'react';
import { FulfillmentReturns } from '../../types';

interface FulfillmentReturnsFormProps {
  data: FulfillmentReturns;
  onChange: (data: FulfillmentReturns) => void;
}

const FulfillmentReturnsForm: React.FC<FulfillmentReturnsFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FulfillmentReturns, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Fulfillment & Returns
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="fulfillmentResponsibility" className="block text-sm font-medium text-gray-700 mb-1">
            Fulfillment Responsibility
          </label>
          <select
            id="fulfillmentResponsibility"
            value={data.fulfillmentResponsibility}
            onChange={(e) => handleChange('fulfillmentResponsibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select responsibility</option>
            <option value="Seller is responsible for all order fulfillment, including packaging and shipping">Seller handles all fulfillment</option>
            <option value="Marketplace handles fulfillment on behalf of sellers">Marketplace handles fulfillment</option>
            <option value="Shared responsibility between marketplace and seller as defined in operational guidelines">Shared responsibility</option>
            <option value="Third-party fulfillment service handles order processing and shipping">Third-party fulfillment</option>
          </select>
        </div>

        <div>
          <label htmlFor="shippingTimeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Timeframe
          </label>
          <select
            id="shippingTimeframe"
            value={data.shippingTimeframe}
            onChange={(e) => handleChange('shippingTimeframe', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select timeframe</option>
            <option value="Orders must be shipped within 1 business day of receipt">1 business day</option>
            <option value="Orders must be shipped within 2 business days of receipt">2 business days</option>
            <option value="Orders must be shipped within 3 business days of receipt">3 business days</option>
            <option value="Orders must be shipped within 5 business days of receipt">5 business days</option>
            <option value="Orders must be shipped within 7 business days of receipt">7 business days</option>
          </select>
        </div>

        <div>
          <label htmlFor="returnPolicy" className="block text-sm font-medium text-gray-700 mb-1">
            Return Policy
          </label>
          <textarea
            id="returnPolicy"
            value={data.returnPolicy}
            onChange={(e) => handleChange('returnPolicy', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Define your return policy (e.g., conditions for returns, who pays shipping, restocking fees, etc.)"
          />
        </div>

        <div>
          <label htmlFor="returnTimeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Return Timeframe (days)
          </label>
          <select
            id="returnTimeframe"
            value={data.returnTimeframe}
            onChange={(e) => handleChange('returnTimeframe', parseInt(e.target.value) || 30)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

        <div>
          <label htmlFor="customerServiceResponsibility" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Service Responsibility
          </label>
          <select
            id="customerServiceResponsibility"
            value={data.customerServiceResponsibility}
            onChange={(e) => handleChange('customerServiceResponsibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select responsibility</option>
            <option value="Seller is responsible for providing customer support for their products">Seller provides customer support</option>
            <option value="Marketplace provides first-level customer support, with escalation to seller as needed">Marketplace provides initial support</option>
            <option value="Shared customer service responsibility with defined escalation procedures">Shared responsibility</option>
            <option value="Third-party customer service provider handles all inquiries">Third-party customer service</option>
          </select>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-md">
        <p className="text-sm text-green-800">
          <strong>Best Practice:</strong> Clear fulfillment and return policies help set proper customer expectations 
          and reduce disputes. Consider your operational capacity when setting timeframes.
        </p>
      </div>
    </div>
  );
};

export default FulfillmentReturnsForm;