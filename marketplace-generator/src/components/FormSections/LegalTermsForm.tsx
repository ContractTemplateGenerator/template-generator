import React from 'react';
import { LegalTerms } from '../../types';

interface LegalTermsFormProps {
  data: LegalTerms;
  onChange: (data: LegalTerms) => void;
}

const LegalTermsForm: React.FC<LegalTermsFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof LegalTerms, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Legal Terms
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="governingLaw" className="block text-sm font-medium text-gray-700 mb-1">
            Governing Law
          </label>
          <select
            id="governingLaw"
            value={data.governingLaw}
            onChange={(e) => handleChange('governingLaw', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select governing law</option>
            {usStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
            <option value="Other">Other (specify in custom text)</option>
          </select>
        </div>

        <div>
          <label htmlFor="disputeResolution" className="block text-sm font-medium text-gray-700 mb-1">
            Dispute Resolution
          </label>
          <select
            id="disputeResolution"
            value={data.disputeResolution}
            onChange={(e) => handleChange('disputeResolution', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          >
            <option value="">Select dispute resolution method</option>
            <option value="Disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association">Binding Arbitration (AAA)</option>
            <option value="Disputes will be resolved through mediation, and if unsuccessful, binding arbitration">Mediation then Arbitration</option>
            <option value="Disputes will be resolved exclusively in the courts of [Governing Law state]">Court Litigation</option>
            <option value="Disputes will be resolved through online dispute resolution platform">Online Dispute Resolution</option>
          </select>
          {data.disputeResolution === '' && (
            <textarea
              placeholder="Or enter custom dispute resolution clause..."
              value={data.disputeResolution}
              onChange={(e) => handleChange('disputeResolution', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        <div>
          <label htmlFor="limitationOfLiability" className="block text-sm font-medium text-gray-700 mb-1">
            Limitation of Liability
          </label>
          <select
            id="limitationOfLiability"
            value={data.limitationOfLiability}
            onChange={(e) => handleChange('limitationOfLiability', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          >
            <option value="">Select liability limitation</option>
            <option value="Marketplace liability is limited to the fees paid by seller in the 12 months preceding the claim">Limited to fees paid (12 months)</option>
            <option value="Marketplace liability is limited to the fees paid by seller in the 6 months preceding the claim">Limited to fees paid (6 months)</option>
            <option value="Marketplace liability is limited to $1,000 per incident">Limited to $1,000 per incident</option>
            <option value="Marketplace liability is limited to $5,000 per incident">Limited to $5,000 per incident</option>
            <option value="No limitation of liability applies">No limitation</option>
          </select>
          {data.limitationOfLiability === '' && (
            <textarea
              placeholder="Or enter custom limitation of liability clause..."
              value={data.limitationOfLiability}
              onChange={(e) => handleChange('limitationOfLiability', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        <div>
          <label htmlFor="intellectualProperty" className="block text-sm font-medium text-gray-700 mb-1">
            Intellectual Property
          </label>
          <select
            id="intellectualProperty"
            value={data.intellectualProperty}
            onChange={(e) => handleChange('intellectualProperty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          >
            <option value="">Select IP arrangement</option>
            <option value="Sellers retain rights to their content but grant marketplace necessary licenses to operate the platform">Seller retains rights, grants platform license</option>
            <option value="Sellers grant marketplace exclusive license to use their content for platform operations">Exclusive license to marketplace</option>
            <option value="Sellers warrant they own all rights to listed content and indemnify marketplace against IP claims">Seller ownership with indemnification</option>
            <option value="Marketplace and seller share intellectual property rights as defined in separate IP agreement">Shared IP rights</option>
          </select>
          {data.intellectualProperty === '' && (
            <textarea
              placeholder="Or enter custom intellectual property clause..."
              value={data.intellectualProperty}
              onChange={(e) => handleChange('intellectualProperty', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-md">
        <p className="text-sm text-purple-800">
          <strong>Legal Notice:</strong> These terms are provided as a starting point. 
          Always consult with a qualified attorney to ensure your agreement complies with applicable laws 
          and adequately protects your business interests.
        </p>
      </div>
    </div>
  );
};

export default LegalTermsForm;