import React from 'react';
import { TerminationTerms } from '../../types';

interface TerminationTermsFormProps {
  data: TerminationTerms;
  onChange: (data: TerminationTerms) => void;
}

const TerminationTermsForm: React.FC<TerminationTermsFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof TerminationTerms, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Termination Terms
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700 mb-1">
            Notice Period (days)
          </label>
          <select
            id="noticePeriod"
            value={data.noticePeriod}
            onChange={(e) => handleChange('noticePeriod', parseInt(e.target.value) || 30)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Immediate (0 days)</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

        <div>
          <label htmlFor="terminationReasons" className="block text-sm font-medium text-gray-700 mb-1">
            Termination for Cause Reasons
          </label>
          <textarea
            id="terminationReasons"
            value={data.terminationReasons}
            onChange={(e) => handleChange('terminationReasons', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Define reasons for immediate termination (e.g., material breach, violation of policies, illegal activity, etc.)"
          />
        </div>

        <div>
          <label htmlFor="postTerminationObligations" className="block text-sm font-medium text-gray-700 mb-1">
            Post-Termination Obligations
          </label>
          <textarea
            id="postTerminationObligations"
            value={data.postTerminationObligations}
            onChange={(e) => handleChange('postTerminationObligations', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Define seller obligations after termination (e.g., fulfill pending orders, remove listings, cease use of marketplace branding, etc.)"
          />
        </div>

        <div>
          <label htmlFor="dataRetention" className="block text-sm font-medium text-gray-700 mb-1">
            Data Retention Policy
          </label>
          <textarea
            id="dataRetention"
            value={data.dataRetention}
            onChange={(e) => handleChange('dataRetention', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe how long seller data will be retained and for what purposes (e.g., legal compliance, operational needs, etc.)"
          />
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-sm text-red-800">
          <strong>Important:</strong> Termination clauses should be fair and reasonable for both parties. 
          Consider the impact of immediate termination on ongoing orders and customer commitments.
        </p>
      </div>
    </div>
  );
};

export default TerminationTermsForm;