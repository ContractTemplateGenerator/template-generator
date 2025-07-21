import React from 'react';
import { ProductRequirements } from '../../types';

interface ProductRequirementsFormProps {
  data: ProductRequirements;
  onChange: (data: ProductRequirements) => void;
}

const ProductRequirementsForm: React.FC<ProductRequirementsFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof ProductRequirements, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Product Requirements
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="prohibitedItems" className="block text-sm font-medium text-gray-700 mb-1">
            Prohibited Items
          </label>
          <textarea
            id="prohibitedItems"
            value={data.prohibitedItems}
            onChange={(e) => handleChange('prohibitedItems', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="List items that cannot be sold on your marketplace (e.g., illegal items, counterfeit goods, hazardous materials, etc.)"
          />
        </div>

        <div>
          <label htmlFor="listingRequirements" className="block text-sm font-medium text-gray-700 mb-1">
            Listing Requirements
          </label>
          <textarea
            id="listingRequirements"
            value={data.listingRequirements}
            onChange={(e) => handleChange('listingRequirements', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe requirements for product listings (e.g., accurate descriptions, complete product information, pricing guidelines, etc.)"
          />
        </div>

        <div>
          <label htmlFor="qualityStandards" className="block text-sm font-medium text-gray-700 mb-1">
            Quality Standards
          </label>
          <textarea
            id="qualityStandards"
            value={data.qualityStandards}
            onChange={(e) => handleChange('qualityStandards', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Define minimum quality standards for products (e.g., condition requirements, functionality standards, etc.)"
          />
        </div>

        <div>
          <label htmlFor="imageRequirements" className="block text-sm font-medium text-gray-700 mb-1">
            Image Requirements
          </label>
          <textarea
            id="imageRequirements"
            value={data.imageRequirements}
            onChange={(e) => handleChange('imageRequirements', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Specify image requirements (e.g., resolution, number of images, background requirements, etc.)"
          />
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Tip:</strong> Clear product requirements help maintain marketplace quality and reduce customer complaints. 
          Be specific about what is and isn't allowed.
        </p>
      </div>
    </div>
  );
};

export default ProductRequirementsForm;