// Document generation functionality using docx.js
const generateWordDocument = async (agreementData) => {
    try {
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        // Create document using docx.js
        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: [
                    // Title
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "MARKETPLACE SELLER AGREEMENT",
                                bold: true,
                                size: 32
                            })
                        ],
                        alignment: docx.AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),
                    
                    // Date
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: `Date: ${currentDate}`,
                                size: 24
                            })
                        ],
                        alignment: docx.AlignmentType.CENTER,
                        spacing: { after: 600 }
                    }),
                    
                    // Section 1: Parties
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "1. PARTIES",
                                bold: true,
                                size: 26
                            })
                        ],
                        spacing: { before: 400, after: 200 }
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: `This Marketplace Seller Agreement ("Agreement") is entered into between ${agreementData.marketplaceInfo.companyName || '[COMPANY NAME]'} ("Marketplace"), a company located at ${agreementData.marketplaceInfo.companyAddress || '[COMPANY ADDRESS]'}, and the individual or entity agreeing to these terms ("Seller") for the purpose of selling products or services on the ${agreementData.marketplaceInfo.marketplaceName || '[MARKETPLACE NAME]'} platform.`,
                                size: 22
                            })
                        ],
                        spacing: { after: 300 }
                    }),
                    
                    // Section 2: Commission Structure
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "2. COMMISSION STRUCTURE",
                                bold: true,
                                size: 26
                            })
                        ],
                        spacing: { before: 400, after: 200 }
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: `The Marketplace will charge a commission of ${agreementData.commissionStructure.commissionPercentage}% of the gross sale price plus a flat transaction fee of $${agreementData.commissionStructure.flatFee} per transaction. Payments to the Seller will be made ${agreementData.commissionStructure.paymentSchedule || '[PAYMENT SCHEDULE]'} via ${agreementData.commissionStructure.paymentMethod || '[PAYMENT METHOD]'}.`,
                                size: 22
                            })
                        ],
                        spacing: { after: 300 }
                    }),
                    
                    // Section 3: Product Requirements
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "3. PRODUCT REQUIREMENTS",
                                bold: true,
                                size: 26
                            })
                        ],
                        spacing: { before: 400, after: 200 }
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: agreementData.productRequirements.prohibitedItems ? 
                                    `Prohibited items and categories include: ${agreementData.productRequirements.prohibitedItems}. ` : 
                                    'The Marketplace reserves the right to determine acceptable products and services. ',
                                size: 22
                            })
                        ]
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: agreementData.productRequirements.listingRequirements ?
                                    `Listing requirements: ${agreementData.productRequirements.listingRequirements}` :
                                    'All product listings must comply with Marketplace standards and applicable laws.',
                                size: 22
                            })
                        ],
                        spacing: { after: 300 }
                    }),
                    
                    // Section 4: Fulfillment & Returns
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "4. FULFILLMENT & RETURNS",
                                bold: true,
                                size: 26
                            })
                        ],
                        spacing: { before: 400, after: 200 }
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: `Fulfillment responsibility lies with: ${agreementData.fulfillmentReturns.fulfillmentResponsibility || '[TO BE SPECIFIED]'}. Orders must be shipped within the agreed timeframe of ${agreementData.fulfillmentReturns.shippingTimeframe || '[TO BE SPECIFIED]'}. Returns will be processed within ${agreementData.fulfillmentReturns.returnTimeframe || 30} days according to the Marketplace return policy.`,
                                size: 22
                            })
                        ],
                        spacing: { after: 300 }
                    }),
                    
                    // Section 5: Termination
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "5. TERMINATION",
                                bold: true,
                                size: 26
                            })
                        ],
                        spacing: { before: 400, after: 200 }
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: `Either party may terminate this Agreement with ${agreementData.terminationTerms.noticePeriod || 30} days written notice. ${agreementData.terminationTerms.terminationReasons ? 'Grounds for immediate termination include: ' + agreementData.terminationTerms.terminationReasons : 'The Marketplace reserves the right to terminate immediately for material breach of this Agreement.'}`,
                                size: 22
                            })
                        ],
                        spacing: { after: 300 }
                    }),
                    
                    // Section 6: Legal Terms
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "6. GOVERNING LAW AND DISPUTES",
                                bold: true,
                                size: 26
                            })
                        ],
                        spacing: { before: 400, after: 200 }
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: `This Agreement is governed by the laws of ${agreementData.legalTerms.governingLaw || '[GOVERNING LAW]'}. Any disputes arising under this Agreement shall be resolved through ${agreementData.legalTerms.disputeResolution || '[DISPUTE RESOLUTION METHOD]'}.`,
                                size: 22
                            })
                        ],
                        spacing: { after: 300 }
                    }),
                    
                    // Signature section
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "7. SIGNATURES",
                                bold: true,
                                size: 26
                            })
                        ],
                        spacing: { before: 600, after: 200 }
                    }),
                    
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: "By using the Marketplace platform, Seller agrees to be bound by these terms.",
                                size: 22
                            })
                        ],
                        spacing: { after: 400 }
                    }),
                    
                    // Footer
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: `Document generated on ${currentDate} using Marketplace Seller Agreement Generator`,
                                italics: true,
                                size: 20
                            })
                        ],
                        alignment: docx.AlignmentType.CENTER,
                        spacing: { before: 800 }
                    })
                ]
            }]
        });

        // Generate and download the document
        const buffer = await docx.Packer.toBuffer(doc);
        const blob = new Blob([buffer], { 
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        });
        
        // Create filename with current date
        const filename = `marketplace-seller-agreement-${new Date().toISOString().split('T')[0]}.docx`;
        
        // Download the file
        if (typeof saveAs === 'function') {
            saveAs(blob, filename);
        } else {
            // Fallback download method
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        
        console.log('Document generated successfully');
        
    } catch (error) {
        console.error('Error generating document:', error);
        alert('Error generating document. Please try again.');
    }
};