import React from 'react';
import type { CommissionStructure } from '../../types';

interface CommissionStructureFormProps {
  data: CommissionStructure;
  onChange: (data: CommissionStructure) => void;
}

const CommissionStructureForm: React.FC<CommissionStructureFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof CommissionStructure, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Commission Structure & Fees
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="commissionPercentage" className="block text-sm font-medium text-gray-700 mb-1">
            Commission Percentage (%)
          </label>
          <input
            type="number"
            id="commissionPercentage"
            min="0"
            max="100"
            step="0.1"
            value={data.commissionPercentage}
            onChange={(e) => handleChange('commissionPercentage', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10.0"
          />
        </div>

        <div>
          <label htmlFor="flatFee" className="block text-sm font-medium text-gray-700 mb-1">
            Flat Fee per Transaction ($)
          </label>
          <input
            type="number"
            id="flatFee"
            min="0"
            step="0.01"
            value={data.flatFee}
            onChange={(e) => handleChange('flatFee', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.30"
          />
        </div>

        <div>
          <label htmlFor="paymentSchedule" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Schedule
          </label>
          <select
            id="paymentSchedule"
            value={data.paymentSchedule}
            onChange={(e) => handleChange('paymentSchedule', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select schedule</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Upon request">Upon request</option>
          </select>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={data.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select method</option>
            <option value="Direct deposit">Direct deposit</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank transfer">Bank transfer</option>
            <option value="Check">Check</option>
            <option value="Platform wallet">Platform wallet</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Commission fees are calculated as a percentage of the gross sale price plus any flat fees. 
          These fees are automatically deducted before payment is remitted to the seller.
        </p>
      </div>
    </div>
  );
};

export default CommissionStructureForm;