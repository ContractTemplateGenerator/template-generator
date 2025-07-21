import React from 'react';
import type { MarketplaceInfo } from '../../types';

interface MarketplaceInfoFormProps {
  data: MarketplaceInfo;
  onChange: (data: MarketplaceInfo) => void;
}

const MarketplaceInfoForm: React.FC<MarketplaceInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof MarketplaceInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Marketplace Information
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="marketplaceName" className="block text-sm font-medium text-gray-700 mb-1">
            Marketplace Name *
          </label>
          <input
            type="text"
            id="marketplaceName"
            value={data.marketplaceName}
            onChange={(e) => handleChange('marketplaceName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Amazon Marketplace"
          />
        </div>

        <div>
          <label htmlFor="marketplaceUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL *
          </label>
          <input
            type="url"
            id="marketplaceUrl"
            value={data.marketplaceUrl}
            onChange={(e) => handleChange('marketplaceUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.yourmarketplace.com"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            value={data.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Company LLC"
          />
        </div>

        <div>
          <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Company Address *
          </label>
          <textarea
            id="companyAddress"
            value={data.companyAddress}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Business St, Suite 100, City, State 12345"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email *
          </label>
          <input
            type="email"
            id="contactEmail"
            value={data.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="contact@yourcompany.com"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceInfoForm;