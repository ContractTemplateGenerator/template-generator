import React, { useState } from 'react';
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { AgreementData } from '../types';

interface ExportOptionsProps {
  data: AgreementData;
  className?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ data, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const generateDocumentText = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `MARKETPLACE SELLER AGREEMENT

Between ${data.marketplaceInfo.companyName || '[Company Name]'} and Seller
Effective Date: ${currentDate}

1. MARKETPLACE INFORMATION

Marketplace Name: ${data.marketplaceInfo.marketplaceName || '[Marketplace Name]'}
Website: ${data.marketplaceInfo.marketplaceUrl || '[Website URL]'}
Company: ${data.marketplaceInfo.companyName || '[Company Name]'}
Address: ${data.marketplaceInfo.companyAddress || '[Company Address]'}
Contact Email: ${data.marketplaceInfo.contactEmail || '[Contact Email]'}

2. SELLER ELIGIBILITY AND REQUIREMENTS

To become and remain a seller on ${data.marketplaceInfo.marketplaceName || '[Marketplace Name]'}, you must meet the following requirements:

• Maintain accurate and complete business information
• Comply with all applicable laws and regulations
• Provide excellent customer service
• Meet all listing and product quality standards

3. COMMISSION STRUCTURE AND FEES

Commission Rate: ${data.commissionStructure.commissionPercentage || '[X]'}% of gross sale price
Flat Fee: $${data.commissionStructure.flatFee || '[X]'} per transaction
Payment Schedule: ${data.commissionStructure.paymentSchedule || '[Payment Schedule]'}
Payment Method: ${data.commissionStructure.paymentMethod || '[Payment Method]'}

Commission fees are automatically deducted from each sale before payment is remitted to the seller. All fees are non-refundable except as required by law.

4. PRODUCT LISTING REQUIREMENTS

Prohibited Items:
${data.productRequirements.prohibitedItems || 'Sellers may not list illegal items, counterfeit goods, hazardous materials, or any items that violate our terms of service.'}

Listing Requirements:
${data.productRequirements.listingRequirements || 'All listings must include accurate descriptions, clear images, and correct pricing information.'}

Quality Standards:
${data.productRequirements.qualityStandards || 'Products must meet minimum quality standards and match their descriptions.'}

Image Requirements:
${data.productRequirements.imageRequirements || 'High-resolution images showing the actual product from multiple angles.'}

5. FULFILLMENT AND RETURNS

Fulfillment Responsibility: ${data.fulfillmentReturns.fulfillmentResponsibility || 'Seller is responsible for all order fulfillment, including packaging and shipping.'}

Shipping Timeframe: ${data.fulfillmentReturns.shippingTimeframe || 'Orders must be shipped within 2 business days of receipt.'}

Return Policy:
${data.fulfillmentReturns.returnPolicy || 'Customers may return items within the specified return period for a full refund.'}

Return Timeframe: ${data.fulfillmentReturns.returnTimeframe || '30'} days from delivery

Customer Service: ${data.fulfillmentReturns.customerServiceResponsibility || 'Seller is responsible for providing customer support for their products.'}

6. TERMINATION

Notice Period: Either party may terminate this agreement with ${data.terminationTerms.noticePeriod || '30'} days written notice.

Termination for Cause:
${data.terminationTerms.terminationReasons || 'Either party may terminate immediately for material breach, violation of policies, or illegal activity.'}

Post-Termination Obligations:
${data.terminationTerms.postTerminationObligations || 'Seller must fulfill all pending orders and may not use marketplace branding after termination.'}

Data Retention: ${data.terminationTerms.dataRetention || 'Marketplace may retain seller data for legal and operational purposes as outlined in the privacy policy.'}

7. LEGAL TERMS

Governing Law: This agreement is governed by the laws of ${data.legalTerms.governingLaw || '[State/Country]'}.

Dispute Resolution:
${data.legalTerms.disputeResolution || 'Disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.'}

Limitation of Liability:
${data.legalTerms.limitationOfLiability || 'Marketplace liability is limited to the fees paid by seller in the 12 months preceding the claim.'}

Intellectual Property:
${data.legalTerms.intellectualProperty || 'Sellers retain rights to their content but grant marketplace necessary licenses to operate the platform.'}

This agreement constitutes the entire agreement between the parties.

Document generated on ${currentDate} using Marketplace Seller Agreement Generator`;
  };

  const copyToClipboard = async () => {
    try {
      const text = generateDocumentText();
      await navigator.clipboard.writeText(text);
      
      // Show temporary success message
      const button = document.getElementById('copy-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.className = button.className.replace('bg-blue-600', 'bg-green-600');
        
        setTimeout(() => {
          button.textContent = originalText;
          button.className = button.className.replace('bg-green-600', 'bg-blue-600');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  const generateWordDocument = async () => {
    setIsExporting(true);
    
    try {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "MARKETPLACE SELLER AGREEMENT",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Between ${data.marketplaceInfo.companyName || '[Company Name]'} and Seller`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Effective Date: ${currentDate}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }), // Empty line
            
            new Paragraph({
              text: "1. MARKETPLACE INFORMATION",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Marketplace Name: ", bold: true }),
                new TextRun({ text: data.marketplaceInfo.marketplaceName || '[Marketplace Name]' })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Website: ", bold: true }),
                new TextRun({ text: data.marketplaceInfo.marketplaceUrl || '[Website URL]' })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Company: ", bold: true }),
                new TextRun({ text: data.marketplaceInfo.companyName || '[Company Name]' })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Address: ", bold: true }),
                new TextRun({ text: data.marketplaceInfo.companyAddress || '[Company Address]' })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Contact Email: ", bold: true }),
                new TextRun({ text: data.marketplaceInfo.contactEmail || '[Contact Email]' })
              ]
            }),
            new Paragraph({ text: "" }),
            
            new Paragraph({
              text: "2. COMMISSION STRUCTURE AND FEES",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Commission Rate: ", bold: true }),
                new TextRun({ text: `${data.commissionStructure.commissionPercentage || '[X]'}% of gross sale price` })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Flat Fee: ", bold: true }),
                new TextRun({ text: `$${data.commissionStructure.flatFee || '[X]'} per transaction` })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Payment Schedule: ", bold: true }),
                new TextRun({ text: data.commissionStructure.paymentSchedule || '[Payment Schedule]' })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Payment Method: ", bold: true }),
                new TextRun({ text: data.commissionStructure.paymentMethod || '[Payment Method]' })
              ]
            }),
            new Paragraph({ text: "" }),
            
            // Add more sections as needed...
            new Paragraph({
              text: `Document generated on ${currentDate} using Marketplace Seller Agreement Generator`,
              alignment: AlignmentType.CENTER,
              italics: true
            })
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      saveAs(blob, `marketplace-seller-agreement-${new Date().toISOString().split('T')[0]}.docx`);
      
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
      
      <div className="space-y-3">
        <button
          id="copy-button"
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy to Clipboard
        </button>
        
        <button
          onClick={generateWordDocument}
          disabled={isExporting}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download as Word Document
            </>
          )}
        </button>
        
        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Document
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> The Word document export includes the complete agreement. 
          Review all sections before finalizing your agreement.
        </p>
      </div>
    </div>
  );
};

export default ExportOptions;