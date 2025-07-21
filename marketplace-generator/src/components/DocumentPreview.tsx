import React from 'react';
import { AgreementData } from '../types';

interface DocumentPreviewProps {
  data: AgreementData;
  className?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data, className = '' }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className={`bg-white p-8 shadow-lg ${className}`}>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            MARKETPLACE SELLER AGREEMENT
          </h1>
          <p className="text-gray-600">
            Between {data.marketplaceInfo.companyName || '[Company Name]'} and Seller
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Effective Date: {currentDate}
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
            1. MARKETPLACE INFORMATION
          </h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Marketplace Name:</strong> {data.marketplaceInfo.marketplaceName || '[Marketplace Name]'}</p>
            <p><strong>Website:</strong> {data.marketplaceInfo.marketplaceUrl || '[Website URL]'}</p>
            <p><strong>Company:</strong> {data.marketplaceInfo.companyName || '[Company Name]'}</p>
            <p><strong>Address:</strong> {data.marketplaceInfo.companyAddress || '[Company Address]'}</p>
            <p><strong>Contact Email:</strong> {data.marketplaceInfo.contactEmail || '[Contact Email]'}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
            2. SELLER ELIGIBILITY AND REQUIREMENTS
          </h2>
          <div className="text-gray-700 space-y-4">
            <p>
              To become and remain a seller on {data.marketplaceInfo.marketplaceName || '[Marketplace Name]'}, 
              you must meet the following requirements:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintain accurate and complete business information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Provide excellent customer service</li>
              <li>Meet all listing and product quality standards</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
            3. COMMISSION STRUCTURE AND FEES
          </h2>
          <div className="text-gray-700 space-y-4">
            <p><strong>Commission Rate:</strong> {data.commissionStructure.commissionPercentage || '[X]'}% of gross sale price</p>
            <p><strong>Flat Fee:</strong> ${data.commissionStructure.flatFee || '[X]'} per transaction</p>
            <p><strong>Payment Schedule:</strong> {data.commissionStructure.paymentSchedule || '[Payment Schedule]'}</p>
            <p><strong>Payment Method:</strong> {data.commissionStructure.paymentMethod || '[Payment Method]'}</p>
            <p>
              Commission fees are automatically deducted from each sale before payment is remitted to the seller. 
              All fees are non-refundable except as required by law.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
            4. PRODUCT LISTING REQUIREMENTS
          </h2>
          <div className="text-gray-700 space-y-4">
            <p><strong>Prohibited Items:</strong></p>
            <p className="ml-4">{data.productRequirements.prohibitedItems || 'Sellers may not list illegal items, counterfeit goods, hazardous materials, or any items that violate our terms of service.'}</p>
            
            <p><strong>Listing Requirements:</strong></p>
            <p className="ml-4">{data.productRequirements.listingRequirements || 'All listings must include accurate descriptions, clear images, and correct pricing information.'}</p>
            
            <p><strong>Quality Standards:</strong></p>
            <p className="ml-4">{data.productRequirements.qualityStandards || 'Products must meet minimum quality standards and match their descriptions.'}</p>
            
            <p><strong>Image Requirements:</strong></p>
            <p className="ml-4">{data.productRequirements.imageRequirements || 'High-resolution images showing the actual product from multiple angles.'}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
            5. FULFILLMENT AND RETURNS
          </h2>
          <div className="text-gray-700 space-y-4">
            <p><strong>Fulfillment Responsibility:</strong> {data.fulfillmentReturns.fulfillmentResponsibility || 'Seller is responsible for all order fulfillment, including packaging and shipping.'}</p>
            
            <p><strong>Shipping Timeframe:</strong> {data.fulfillmentReturns.shippingTimeframe || 'Orders must be shipped within 2 business days of receipt.'}</p>
            
            <p><strong>Return Policy:</strong></p>
            <p className="ml-4">{data.fulfillmentReturns.returnPolicy || 'Customers may return items within the specified return period for a full refund.'}</p>
            
            <p><strong>Return Timeframe:</strong> {data.fulfillmentReturns.returnTimeframe || '30'} days from delivery</p>
            
            <p><strong>Customer Service:</strong> {data.fulfillmentReturns.customerServiceResponsibility || 'Seller is responsible for providing customer support for their products.'}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
            6. TERMINATION
          </h2>
          <div className="text-gray-700 space-y-4">
            <p><strong>Notice Period:</strong> Either party may terminate this agreement with {data.terminationTerms.noticePeriod || '30'} days written notice.</p>
            
            <p><strong>Termination for Cause:</strong></p>
            <p className="ml-4">{data.terminationTerms.terminationReasons || 'Either party may terminate immediately for material breach, violation of policies, or illegal activity.'}</p>
            
            <p><strong>Post-Termination Obligations:</strong></p>
            <p className="ml-4">{data.terminationTerms.postTerminationObligations || 'Seller must fulfill all pending orders and may not use marketplace branding after termination.'}</p>
            
            <p><strong>Data Retention:</strong> {data.terminationTerms.dataRetention || 'Marketplace may retain seller data for legal and operational purposes as outlined in the privacy policy.'}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
            7. LEGAL TERMS
          </h2>
          <div className="text-gray-700 space-y-4">
            <p><strong>Governing Law:</strong> This agreement is governed by the laws of {data.legalTerms.governingLaw || '[State/Country]'}.</p>
            
            <p><strong>Dispute Resolution:</strong></p>
            <p className="ml-4">{data.legalTerms.disputeResolution || 'Disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.'}</p>
            
            <p><strong>Limitation of Liability:</strong></p>
            <p className="ml-4">{data.legalTerms.limitationOfLiability || 'Marketplace liability is limited to the fees paid by seller in the 12 months preceding the claim.'}</p>
            
            <p><strong>Intellectual Property:</strong></p>
            <p className="ml-4">{data.legalTerms.intellectualProperty || 'Sellers retain rights to their content but grant marketplace necessary licenses to operate the platform.'}</p>
          </div>
        </section>

        <footer className="border-t pt-6 mt-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">This agreement constitutes the entire agreement between the parties.</p>
            <p className="text-sm">
              Document generated on {currentDate} using Marketplace Seller Agreement Generator
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DocumentPreview;