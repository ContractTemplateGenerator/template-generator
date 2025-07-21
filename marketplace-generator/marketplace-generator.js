const { useState, useRef, useEffect } = React;

const MarketplaceGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const previewRef = useRef(null);
    
    // Form data state with better defaults
    const [formData, setFormData] = useState({
        // Marketplace Information
        marketplaceName: 'Example Marketplace',
        marketplaceUrl: 'www.example-marketplace.com',
        companyName: 'Example Marketplace LLC',
        companyAddress: '123 Main Street, San Francisco, CA 94105',
        contactEmail: 'contact@example-marketplace.com',
        
        // Commission & Fees
        commissionPercentage: '15',
        flatFee: '0.30',
        paymentSchedule: 'bi-weekly',
        paymentMethod: 'ACH Transfer',
        
        // Product Requirements
        prohibitedItems: 'Illegal items, counterfeit goods, hazardous materials, weapons, adult content',
        listingRequirements: 'High-quality product images, detailed descriptions, accurate pricing, proper categorization',
        qualityStandards: 'All products must meet marketplace quality standards and industry regulations',
        
        // Fulfillment & Returns
        fulfillmentResponsibility: 'seller',
        shippingTimeframe: '1-3 business days',
        returnPolicyType: 'standard-30day',
        returnTimeframe: '30',
        customerServiceResponsibility: 'seller',
        
        // Termination Terms
        noticePeriod: '30',
        terminationReasons: 'Breach of agreement, violation of policies, fraudulent activity, non-payment',
        postTerminationObligations: 'Complete pending orders, honor return policy, remove listings',
        
        // Legal Terms
        governingLaw: 'State of California, USA',
        disputeResolution: 'arbitration',
        limitationOfLiability: 'standard',
        intellectualProperty: 'seller-retains'
    });

    // Handle input changes properly to fix typing issues
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Record what field was changed for highlighting
        setLastChanged(name);
        
        // Update form data
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };
        setFormData(newFormData);
        
        // Save form data to localStorage
        localStorage.setItem('marketplaceFormData', JSON.stringify(newFormData));
    };

    // Load saved form data on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('marketplaceFormData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setFormData(parsedData);
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }, []);

    // Generate comprehensive document text
    const generateDocumentText = () => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Generate specific return policy text based on selection
        const getReturnPolicyText = () => {
            switch (formData.returnPolicyType) {
                case 'standard-30day':
                    return `Customers may return items within ${formData.returnTimeframe} days of delivery for a full refund, provided items are in original condition, unused, and in original packaging. Return shipping costs are the responsibility of the customer unless the item is defective or incorrectly shipped. Refunds will be processed within 5-7 business days of receiving the returned item. Digital products and personalized items are not eligible for return unless defective.`;
                case 'no-questions-asked':
                    return `We offer a no-questions-asked return policy. Customers may return any item within ${formData.returnTimeframe} days of delivery for any reason and receive a full refund including original shipping costs. Items must be returned in sellable condition. We provide prepaid return shipping labels for all returns. Refunds are processed within 2-3 business days of receiving the returned item.`;
                case 'store-credit-only':
                    return `Returns are accepted within ${formData.returnTimeframe} days of delivery for store credit only. Items must be in original condition and packaging. Store credit never expires and can be used for future purchases. Return shipping costs are the responsibility of the customer. Store credit will be issued within 3-5 business days of receiving the returned item.`;
                case 'final-sale':
                    return `All sales are final. Returns are not accepted except in cases of defective items or shipping errors. If you receive a defective or incorrect item, contact us within 7 days of delivery for a replacement or full refund. We will provide prepaid return shipping for defective or incorrect items only.`;
                default:
                    return `Returns are subject to the specific return policy established by the Marketplace, which will be clearly communicated to all customers at the time of purchase.`;
            }
        };

        // Generate specific liability limitation text
        const getLiabilityLimitationText = () => {
            switch (formData.limitationOfLiability) {
                case 'standard':
                    return `IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. EACH PARTY'S TOTAL LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY SELLER TO MARKETPLACE IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.`;
                case 'comprehensive':
                    return `MARKETPLACE'S TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE SERVICES SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL AMOUNT PAID BY SELLER TO MARKETPLACE IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100). MARKETPLACE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. SELLER AGREES TO INDEMNIFY AND HOLD HARMLESS MARKETPLACE FROM ANY THIRD-PARTY CLAIMS.`;
                case 'limited':
                    return `Each party's liability under this Agreement is limited to direct damages only. Neither party excludes liability for death, personal injury, fraud, or any other liability that cannot be excluded by law. Maximum liability is capped at the fees paid under this Agreement in the preceding 12 months.`;
            }
        };

        // Generate dispute resolution text
        const getDisputeResolutionText = () => {
            switch (formData.disputeResolution) {
                case 'arbitration':
                    return `Any dispute, claim, or controversy arising out of or relating to this Agreement shall be settled by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall be conducted by a single arbitrator selected in accordance with AAA rules. The arbitration shall take place in ${formData.governingLaw}, and the arbitrator's decision shall be final and binding. Each party shall bear its own costs and attorneys' fees, and the parties shall split the arbitrator's fees equally. The arbitrator shall have no authority to award punitive damages.`;
                case 'mediation':
                    return `The parties agree to attempt to resolve any dispute through good faith mediation before pursuing other remedies. If mediation fails within 60 days, either party may proceed with binding arbitration as described above. Mediation shall be conducted by a qualified mediator selected by mutual agreement or through the AAA mediation process.`;
                case 'litigation':
                    return `Any disputes arising under this Agreement shall be resolved through litigation in the state and federal courts located in ${formData.governingLaw}. Each party consents to the personal jurisdiction of such courts and waives any objection to venue. The prevailing party in any litigation shall be entitled to recover reasonable attorneys' fees and costs from the non-prevailing party.`;
            }
        };

        return `MARKETPLACE SELLER AGREEMENT

Date: ${currentDate}

This Marketplace Seller Agreement ("Agreement") is entered into between ${formData.companyName} ("Marketplace" or "Company"), a company located at ${formData.companyAddress}, and the individual or entity agreeing to these terms ("Seller" or "you") for the purpose of selling products or services on the ${formData.marketplaceName} platform located at ${formData.marketplaceUrl}.

WHEREAS, Marketplace operates an online platform that connects buyers with sellers; and WHEREAS, Seller desires to offer products for sale through the Marketplace platform; NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. MARKETPLACE PLATFORM AND SERVICES

1.1 Platform Description: ${formData.marketplaceName} is an online marketplace that connects buyers with sellers of various products and services. The platform provides tools for product listing, order management, payment processing, and customer communication.

1.2 Services Provided: Marketplace provides Seller with access to the platform's listing tools, payment processing systems, customer base, marketing opportunities, and technical support. The platform handles secure payment processing, provides basic analytics, and offers customer service support as specified in this Agreement.

1.3 Contact Information: For questions regarding this Agreement or platform services, contact us at ${formData.contactEmail}. Business hours are Monday through Friday, 9:00 AM to 6:00 PM Pacific Time. Emergency support is available 24/7 for payment and security issues.

1.4 Platform Modifications: Marketplace reserves the right to modify, update, or discontinue any aspect of the platform with reasonable notice to Sellers. Major changes affecting Seller operations will be communicated at least 30 days in advance.

2. COMMISSION STRUCTURE AND FEES

2.1 Commission Rate: The Marketplace will charge a commission of ${formData.commissionPercentage}% of the gross sale price (including shipping charges and taxes) for each completed transaction. Commission is calculated on the total amount paid by the customer, excluding any refunds or chargebacks.

2.2 Transaction Fees: In addition to the commission, a flat transaction processing fee of $${formData.flatFee} will be charged per completed transaction to cover payment processing costs, fraud protection, and administrative expenses.

2.3 Payment Schedule and Method: Payments to Sellers will be made ${formData.paymentSchedule} via ${formData.paymentMethod}. Payments include all sales proceeds minus applicable commissions, fees, refunds, and chargebacks. Payment schedules may be subject to standard banking delays.

2.4 Payment Processing and Holds: All payments are subject to Marketplace's standard payment processing procedures. Payments may be held or delayed for verification, fraud prevention, dispute resolution, or compliance with applicable laws. New sellers may experience longer hold periods during the initial 90-day evaluation period.

2.5 Fee Changes: Marketplace may modify commission rates or fees with 60 days' written notice to Sellers. Continued use of the platform after such notice constitutes acceptance of the new fee structure.

2.6 Chargebacks and Refunds: Sellers are responsible for all chargebacks, refunds, and disputed transactions. Such amounts will be deducted from future payments or charged to Seller's designated payment method.

3. PRODUCT REQUIREMENTS AND RESTRICTIONS

3.1 Prohibited Items: The following items and categories are strictly prohibited on the Marketplace: ${formData.prohibitedItems}. This list is not exhaustive, and Marketplace reserves the right to prohibit additional items that violate applicable laws, infringe intellectual property rights, or are deemed inappropriate for the platform.

3.2 Listing Requirements: All product listings must meet the following standards: ${formData.listingRequirements}. Listings must be accurate, complete, and regularly updated. False or misleading information may result in listing removal and account suspension.

3.3 Quality Standards: ${formData.qualityStandards}. Products must be authentic, legal, and safe for consumer use. The Marketplace reserves the right to remove listings that do not meet these standards and may require additional documentation or certifications for certain product categories.

3.4 Compliance Requirements: Sellers must ensure all products comply with applicable federal, state, and local laws, regulations, and safety standards. This includes but is not limited to product safety regulations, labeling requirements, import/export restrictions, and tax obligations.

3.5 Intellectual Property: Sellers warrant that all listed products do not infringe upon any third-party intellectual property rights, including trademarks, copyrights, and patents. Sellers agree to indemnify Marketplace against any intellectual property claims related to their products.

4. FULFILLMENT AND SHIPPING

4.1 Fulfillment Responsibility: ${formData.fulfillmentResponsibility === 'seller' ? 'Seller is responsible for fulfilling all orders, including packaging, shipping, and tracking. Seller must maintain adequate inventory levels and fulfill orders promptly according to the specified timeframes.' : formData.fulfillmentResponsibility === 'marketplace' ? 'Marketplace handles order fulfillment through its network of fulfillment centers. Seller must ship inventory to designated fulfillment centers according to Marketplace specifications and pay applicable fulfillment fees.' : 'Fulfillment responsibilities are shared between Seller and Marketplace according to product type and shipping destination. Specific arrangements will be detailed in separate fulfillment agreements.'}

4.2 Shipping Timeframes: Orders must be processed and shipped within ${formData.shippingTimeframe} of order confirmation, excluding weekends and holidays. Expedited orders may have shorter processing requirements as specified at the time of sale.

4.3 Shipping Standards: Sellers must provide accurate tracking information within 24 hours of shipment, use appropriate packaging to prevent damage during transit, and include all necessary documentation. Insurance is recommended for high-value items.

4.4 Shipping Costs: Shipping costs may be charged separately to customers or included in product pricing at Seller's discretion. Sellers are responsible for accurate shipping cost calculations and any shipping cost discrepancies.

5. RETURNS AND REFUNDS

5.1 Return Policy: ${getReturnPolicyText()}

5.2 Return Processing: Returns must be processed promptly according to the applicable return policy. Sellers must inspect returned items within 2 business days of receipt and process refunds or exchanges within the specified timeframes.

5.3 Customer Service Responsibility: ${formData.customerServiceResponsibility === 'seller' ? 'Seller is responsible for providing customer service for their products, including answering customer inquiries, handling complaints, and resolving issues. Response time should be within 24 hours during business days.' : formData.customerServiceResponsibility === 'marketplace' ? 'Marketplace provides first-level customer service support, including order inquiries, return processing, and basic product questions. Seller may be contacted for technical or specialized product support.' : 'Customer service responsibilities are shared, with Marketplace handling order and payment inquiries while Seller handles product-specific questions and technical support.'}

5.4 Damaged or Defective Items: Items damaged during shipping or found to be defective must be replaced or refunded at no cost to the customer, including return shipping expenses. Seller must investigate and respond to such claims within 48 hours.

6. TERM AND TERMINATION

6.1 Term: This Agreement shall commence upon acceptance and remain in effect until terminated by either party in accordance with the terms herein.

6.2 Termination Notice: Either party may terminate this Agreement with ${formData.noticePeriod} days' written notice to the other party. Termination notice must be provided in writing via email or certified mail.

6.3 Immediate Termination: Marketplace may terminate this Agreement immediately, without notice, for the following reasons: ${formData.terminationReasons}, repeated violation of platform policies, sale of prohibited items, or failure to maintain required seller performance metrics.

6.4 Post-Termination Obligations: Upon termination, Seller must: ${formData.postTerminationObligations}, provide customer service for previously sold items during any applicable warranty period, and cease use of Marketplace trademarks and proprietary information. All payment obligations survive termination.

6.5 Effect of Termination: Upon termination, Seller's access to the platform will be revoked, active listings will be removed, and pending orders will be handled according to Marketplace policies. Outstanding payments will be processed according to normal payment schedules, subject to any holds or reserves.

7. INTELLECTUAL PROPERTY

7.1 Seller IP Ownership: ${formData.intellectualProperty === 'seller-retains' ? 'Seller retains all intellectual property rights in their products, content, images, and other materials provided to Marketplace. This Agreement does not transfer ownership of Seller IP to Marketplace.' : formData.intellectualProperty === 'shared' ? 'Seller retains ownership of product IP but grants Marketplace shared rights to use, modify, and create derivative works of product content for platform operations and marketing purposes.' : 'Seller grants Marketplace an exclusive license to use product content, images, and descriptions for marketing and operational purposes during the term of this Agreement.'}

7.2 License to Marketplace: Seller grants Marketplace a non-exclusive, worldwide, royalty-free license to use, reproduce, display, and distribute Seller's product images, descriptions, and other content for the purpose of operating the marketplace, processing orders, marketing products, and providing customer service.

7.3 Marketplace IP: All Marketplace platform technology, software, trademarks, trade names, logos, and proprietary information remain the exclusive property of Marketplace. Seller receives no ownership rights in Marketplace IP and may not use Marketplace trademarks except as specifically authorized.

7.4 DMCA Compliance: Marketplace maintains a DMCA takedown policy for intellectual property violations. Sellers must promptly respond to any intellectual property complaints and may have listings removed for verified IP violations.

8. REPRESENTATIONS AND WARRANTIES

8.1 Seller Representations: Seller represents and warrants that: (a) they have full legal authority to enter into this Agreement; (b) they have the right to sell all listed products; (c) all product information provided is accurate, complete, and truthful; (d) they will comply with all applicable laws, regulations, and platform policies; (e) they have obtained all necessary licenses, permits, and approvals for their business operations; (f) their products do not infringe any third-party intellectual property rights; and (g) their products are safe for consumer use and comply with applicable safety standards.

8.2 Marketplace Disclaimers: EXCEPT AS EXPRESSLY SET FORTH HEREIN, MARKETPLACE MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. MARKETPLACE DOES NOT WARRANT UNINTERRUPTED PLATFORM AVAILABILITY, ERROR-FREE OPERATION, OR SPECIFIC SALES RESULTS.

8.3 Product Warranties: Sellers are solely responsible for all product warranties and guarantees. Any warranties offered by Seller are independent of this Agreement and do not create obligations for Marketplace.

9. LIMITATION OF LIABILITY

9.1 Liability Limitations: ${getLiabilityLimitationText()}

9.2 Risk Allocation: Seller acknowledges that selling through an online marketplace involves inherent risks, including but not limited to payment processing risks, shipping risks, and customer satisfaction risks. Seller assumes these risks and agrees that Marketplace is not responsible for business losses or operational challenges.

10. GOVERNING LAW AND DISPUTE RESOLUTION

10.1 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${formData.governingLaw}, without regard to conflict of law principles.

10.2 Dispute Resolution: ${getDisputeResolutionText()}

10.3 Class Action Waiver: Both parties waive any right to participate in class action lawsuits or class-wide arbitration regarding disputes under this Agreement.

11. GENERAL PROVISIONS

11.1 Entire Agreement: This Agreement, together with any referenced policies and terms, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter herein.

11.2 Amendment: This Agreement may only be amended by written agreement signed by both parties, or by Marketplace providing 30 days' notice of changes to Seller.

11.3 Severability: If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall remain in full force and effect.

11.4 Assignment: Seller may not assign, transfer, or delegate this Agreement or any rights or obligations hereunder without the prior written consent of Marketplace. Marketplace may assign this Agreement without restriction.

11.5 Force Majeure: Neither party shall be liable for any failure or delay in performance due to causes beyond their reasonable control, including but not limited to acts of God, war, terrorism, pandemics, government regulations, labor strikes, or technical failures.

11.6 Independent Contractors: The parties are independent contractors. This Agreement does not create a partnership, joint venture, agency, or employment relationship.

11.7 Waiver: The failure of either party to enforce any provision of this Agreement shall not constitute a waiver of that provision or any other provision.

11.8 Survival: Provisions relating to payment obligations, intellectual property, confidentiality, limitation of liability, and dispute resolution shall survive termination of this Agreement.

12. SIGNATURES AND ACCEPTANCE

By using the Marketplace platform, creating seller listings, or completing transactions through the platform, Seller acknowledges that they have read, understood, and agree to be bound by all terms and conditions of this Agreement.

Marketplace: ${formData.companyName}

By: _________________________
Name: [Print Name]
Title: [Title]
Date: _______________________

Seller:

By: _________________________
Name: [Print Name]
Title: [If applicable]
Date: _______________________

Electronic Signature: This Agreement may be executed electronically, and electronic signatures shall have the same legal effect as original signatures.

---

IMPORTANT NOTICE: This document was generated on ${currentDate} using the Marketplace Seller Agreement Generator at terms.law. This is a general template and should be reviewed by qualified legal counsel before use. Laws vary by jurisdiction and business circumstances.`;
    };

    // Create highlighted document text with PRECISE highlighting like AI generator
    const createHighlightedText = () => {
        if (!lastChanged) return generateDocumentText();
        
        let highlightedText = generateDocumentText();
        
        // Highlight only the specific phrase/value that changed, NOT whole paragraphs
        switch (lastChanged) {
            case 'marketplaceName':
                if (formData.marketplaceName) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.marketplaceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.marketplaceName}</span>`
                    );
                }
                break;
            case 'companyName':
                if (formData.companyName) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.companyName}</span>`
                    );
                }
                break;
            case 'contactEmail':
                if (formData.contactEmail) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.contactEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.contactEmail}</span>`
                    );
                }
                break;
            case 'companyAddress':
                if (formData.companyAddress) {
                    highlightedText = highlightedText.replace(
                        /located at .*, and/,
                        `located at <span class="highlighted-text">${formData.companyAddress}</span>, and`
                    );
                }
                break;
            case 'marketplaceUrl':
                if (formData.marketplaceUrl) {
                    highlightedText = highlightedText.replace(
                        new RegExp(formData.marketplaceUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${formData.marketplaceUrl}</span>`
                    );
                }
                break;
            case 'commissionPercentage':
                if (formData.commissionPercentage) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`${formData.commissionPercentage}%`, 'g'),
                        `<span class="highlighted-text">${formData.commissionPercentage}%</span>`
                    );
                }
                break;
            case 'flatFee':
                if (formData.flatFee) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`\\$${formData.flatFee}`, 'g'),
                        `<span class="highlighted-text">$${formData.flatFee}</span>`
                    );
                }
                break;
            case 'paymentSchedule':
                highlightedText = highlightedText.replace(
                    /Payments to Sellers will be made .* via/,
                    `Payments to Sellers will be made <span class="highlighted-text">${formData.paymentSchedule}</span> via`
                );
                break;
            case 'paymentMethod':
                highlightedText = highlightedText.replace(
                    /via .*\. Payments include/,
                    `via <span class="highlighted-text">${formData.paymentMethod}</span>. Payments include`
                );
                break;
            case 'returnTimeframe':
                if (formData.returnTimeframe) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`${formData.returnTimeframe} days`, 'g'),
                        `<span class="highlighted-text">${formData.returnTimeframe} days</span>`
                    );
                }
                break;
            case 'noticePeriod':
                if (formData.noticePeriod) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`${formData.noticePeriod} days' written notice`, 'g'),
                        `<span class="highlighted-text">${formData.noticePeriod} days'</span> written notice`
                    );
                }
                break;
            case 'shippingTimeframe':
                highlightedText = highlightedText.replace(
                    /within .* of order confirmation/,
                    `within <span class="highlighted-text">${formData.shippingTimeframe}</span> of order confirmation`
                );
                break;
            case 'governingLaw':
                if (formData.governingLaw) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`laws of ${formData.governingLaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
                        `laws of <span class="highlighted-text">${formData.governingLaw}</span>`
                    );
                }
                break;
            case 'disputeResolution':
                // This will highlight the specific dispute resolution method in the detailed text
                const resolutionMethods = {
                    'arbitration': 'binding arbitration',
                    'mediation': 'mediation',
                    'litigation': 'litigation'
                };
                const method = resolutionMethods[formData.disputeResolution];
                if (method) {
                    highlightedText = highlightedText.replace(
                        new RegExp(`settled by ${method}`, 'g'),
                        `settled by <span class="highlighted-text">${method}</span>`
                    );
                }
                break;
            case 'returnPolicyType':
                // Highlight the return policy section that was generated
                highlightedText = highlightedText.replace(
                    /(5\.1 Return Policy: .*?)(\n\n5\.2)/s,
                    `5.1 Return Policy: <span class="highlighted-text">$1</span>$2`.replace('5.1 Return Policy: <span class="highlighted-text">5.1 Return Policy: ', '5.1 Return Policy: <span class="highlighted-text">')
                );
                break;
            case 'fulfillmentResponsibility':
                // Highlight the fulfillment responsibility section
                highlightedText = highlightedText.replace(
                    /(4\.1 Fulfillment Responsibility: .*?)(\n\n4\.2|$)/s,
                    (match, p1, p2) => `4.1 Fulfillment Responsibility: <span class="highlighted-text">${p1.replace('4.1 Fulfillment Responsibility: ', '')}</span>${p2}`
                );
                break;
            case 'customerServiceResponsibility':
                // Highlight customer service responsibility section
                highlightedText = highlightedText.replace(
                    /(5\.3 Customer Service Responsibility: .*?)(\n\n5\.4|$)/s,
                    (match, p1, p2) => `5.3 Customer Service Responsibility: <span class="highlighted-text">${p1.replace('5.3 Customer Service Responsibility: ', '')}</span>${p2}`
                );
                break;
            case 'limitationOfLiability':
                // Highlight the liability limitation section
                highlightedText = highlightedText.replace(
                    /(9\.1 Liability Limitations: .*?)(\n\n9\.2|$)/s,
                    (match, p1, p2) => `9.1 Liability Limitations: <span class="highlighted-text">${p1.replace('9.1 Liability Limitations: ', '')}</span>${p2}`
                );
                break;
            case 'prohibitedItems':
            case 'listingRequirements':
            case 'qualityStandards':
            case 'terminationReasons':
            case 'postTerminationObligations':
                // For text areas, highlight the content that was just changed
                const fieldValue = formData[lastChanged];
                if (fieldValue && fieldValue.length > 10) {
                    highlightedText = highlightedText.replace(
                        new RegExp(fieldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                        `<span class="highlighted-text">${fieldValue}</span>`
                    );
                }
                break;
            default:
                break;
        }
        
        return highlightedText;
    };

    const documentText = generateDocumentText();
    const highlightedText = createHighlightedText();

    // Scroll to highlighted text
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            setTimeout(() => {
                const highlightedElement = previewRef.current.querySelector('.highlighted-text');
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 100);

            const timer = setTimeout(() => {
                setLastChanged(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [highlightedText, lastChanged]);

    // Copy to clipboard function
    const copyToClipboard = async () => {
        try {
            const text = generateDocumentText();
            await navigator.clipboard.writeText(text);
            alert('Agreement copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    };

    // Help tooltip component
    const HelpIcon = ({ tooltip }) => (
        <span className="help-icon" title={tooltip}>
            ⓘ
        </span>
    );

    // Enhanced tooltips with comprehensive legal advice
    const tooltips = {
        marketplaceName: "The public brand name of your marketplace platform that customers will see. This appears in your agreement and marketing materials.",
        commissionPercentage: "Industry standard ranges from 3-15%. Higher rates (15%+) may reduce seller participation. Consider competitor analysis: Amazon charges 6-45% depending on category, eBay charges 3-12%.",
        flatFee: "Fixed fee per transaction to cover payment processing costs. Typical range: $0.30-$2.00. This helps offset credit card processing fees and fraud protection costs.",
        prohibitedItems: "Clear restrictions reduce legal liability and protect brand reputation. Include illegal items, counterfeit goods, hazardous materials. Be specific to avoid disputes.",
        listingRequirements: "Detailed requirements improve product quality and customer satisfaction. Include image specifications, description standards, pricing accuracy, proper categorization.",
        qualityStandards: "Set clear expectations for product condition, authenticity, and safety. This helps prevent disputes and maintains marketplace reputation.",
        fulfillmentResponsibility: "Seller fulfillment reduces your operational costs but may impact customer experience. Marketplace fulfillment gives you control but increases costs.",
        shippingTimeframe: "Set realistic timeframes you can consistently meet. 1-3 business days is common for stocked items. Longer times may reduce conversion rates.",
        returnPolicyType: "30-day returns are industry standard. More generous policies increase customer confidence but may increase return rates. Consider your target market.",
        returnTimeframe: "Longer return windows increase customer confidence but may increase costs. 30 days balances customer satisfaction with operational efficiency.",
        customerServiceResponsibility: "Marketplace-handled service provides consistency but increases costs. Seller responsibility reduces costs but may impact customer experience.",
        noticePeriod: "30-60 days is standard for contract termination. Longer periods provide stability for sellers but reduce your flexibility to remove poor performers.",
        terminationReasons: "Be specific about grounds for immediate termination. Include policy violations, fraudulent activity, poor performance metrics, legal violations.",
        disputeResolution: "Arbitration is typically 60-80% faster and cheaper than litigation. Costs average $3,000-$10,000 vs $50,000+ for court cases.",
        governingLaw: "Choose the jurisdiction where your business is incorporated for legal consistency. California, Delaware, and New York are business-friendly states.",
        limitationOfLiability: "Standard limitations protect against excessive damage claims while maintaining legal enforceability. Overly broad limitations may be unenforceable.",
        intellectualProperty: "Seller-retained rights reduce your risks but limit marketing flexibility. Shared rights provide marketing benefits but increase IP management complexity."
    };

    // Generate comprehensive legal risk analysis
    const generateRiskAnalysis = () => {
        let highRisks = [];
        let mediumRisks = [];
        let lowRisks = [];
        let recommendations = [];

        // Commission Structure Analysis
        const commission = parseFloat(formData.commissionPercentage);
        if (commission > 25) {
            highRisks.push('Commission rate above 25% may violate state usury laws and significantly reduce seller participation');
            recommendations.push('Reduce commission to industry standard 5-20% range');
        } else if (commission > 20) {
            mediumRisks.push('High commission rate may reduce seller participation and increase churn');
            recommendations.push('Monitor competitor rates and seller feedback closely');
        } else if (commission >= 5) {
            lowRisks.push('Commission rate within industry standards (5-20%)');
        } else {
            mediumRisks.push('Very low commission rates may not cover operational costs');
            recommendations.push('Ensure commission covers payment processing, fraud protection, and platform costs');
        }

        // Return Policy Analysis
        const returnDays = parseInt(formData.returnTimeframe);
        if (formData.returnPolicyType === 'final-sale' && returnDays > 0) {
            mediumRisks.push('Final sale policy conflicts with specified return timeframe');
            recommendations.push('Align return policy type with return timeframe setting');
        } else if (formData.returnPolicyType === 'no-questions-asked') {
            mediumRisks.push('No-questions-asked returns may increase return abuse and costs');
            recommendations.push('Consider implementing return fraud detection and monitoring');
        } else if (formData.returnPolicyType === 'standard-30day') {
            lowRisks.push('Standard 30-day return policy balances customer satisfaction and operational efficiency');
        }

        // Fulfillment Analysis
        if (formData.fulfillmentResponsibility === 'seller') {
            lowRisks.push('Seller fulfillment reduces operational liability and infrastructure costs');
        } else if (formData.fulfillmentResponsibility === 'marketplace') {
            mediumRisks.push('Marketplace fulfillment increases operational complexity and liability exposure');
            recommendations.push('Ensure comprehensive insurance coverage and fulfillment quality controls');
        }

        // Shipping Timeframe Analysis
        if (formData.shippingTimeframe.includes('1-2') || formData.shippingTimeframe.includes('same day')) {
            mediumRisks.push('Very fast shipping promises may be difficult for sellers to consistently meet');
            recommendations.push('Consider 2-3 business days for more realistic fulfillment');
        } else if (formData.shippingTimeframe.includes('1-3') || formData.shippingTimeframe.includes('2-3')) {
            lowRisks.push('Reasonable shipping timeframe balances customer expectations and seller capabilities');
        }

        // Legal Terms Analysis
        if (formData.disputeResolution === 'arbitration') {
            lowRisks.push('Arbitration clause provides cost-effective dispute resolution');
        } else if (formData.disputeResolution === 'litigation') {
            mediumRisks.push('Litigation clauses significantly increase legal costs and case duration');
            recommendations.push('Consider arbitration for 60-80% cost savings and faster resolution');
        }

        if (formData.limitationOfLiability === 'standard') {
            lowRisks.push('Standard liability limitations provide balanced legal protection');
        } else if (formData.limitationOfLiability === 'limited') {
            mediumRisks.push('Overly limited liability clauses may not be enforceable in all jurisdictions');
            recommendations.push('Consult local counsel on liability limitation enforceability');
        }

        // Notice Period Analysis
        const noticeDays = parseInt(formData.noticePeriod);
        if (noticeDays < 15) {
            mediumRisks.push('Short termination notice periods may not provide adequate transition time for sellers');
            recommendations.push('Consider 30-day minimum notice period for seller stability');
        } else if (noticeDays >= 30) {
            lowRisks.push('Adequate termination notice period provides stability for sellers');
        }

        // Customer Service Analysis
        if (formData.customerServiceResponsibility === 'seller') {
            lowRisks.push('Seller-managed customer service reduces operational costs');
        } else if (formData.customerServiceResponsibility === 'marketplace') {
            mediumRisks.push('Marketplace-managed customer service increases operational costs and liability');
            recommendations.push('Budget for comprehensive customer service infrastructure and training');
        }

        // Overall Risk Assessment
        let overallRisk = 'low';
        if (highRisks.length >= 1) {
            overallRisk = 'high';
        } else if (mediumRisks.length >= 3) {
            overallRisk = 'medium';
        }

        return (
            <div className="risk-analysis">
                <div className={`overall-risk-card risk-${overallRisk}`}>
                    <h4>Overall Risk Level: {overallRisk.toUpperCase()}</h4>
                    <p>
                        {overallRisk === 'high' && 'Your agreement has significant legal or operational risks that should be addressed immediately before launch.'}
                        {overallRisk === 'medium' && 'Your agreement has moderate risks that should be reviewed and potentially adjusted for optimal protection.'}
                        {overallRisk === 'low' && 'Your agreement follows industry best practices with minimal legal risk and good operational balance.'}
                    </p>
                </div>

                {highRisks.length > 0 && (
                    <div className="risk-section high-risk">
                        <h4>🚨 High Priority Issues ({highRisks.length})</h4>
                        <ul>
                            {highRisks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {mediumRisks.length > 0 && (
                    <div className="risk-section medium-risk">
                        <h4>⚠️ Medium Priority Issues ({mediumRisks.length})</h4>
                        <ul>
                            {mediumRisks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {lowRisks.length > 0 && (
                    <div className="risk-section low-risk">
                        <h4>✅ Well-Protected Areas ({lowRisks.length})</h4>
                        <ul>
                            {lowRisks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="recommendations-section">
                    <h4>📋 Legal & Business Recommendations</h4>
                    <ul>
                        {recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                        <li>Have the agreement reviewed by qualified legal counsel in your operating jurisdiction</li>
                        <li>Update agreement annually to reflect changing laws and business practices</li>
                        <li>Maintain comprehensive general liability and errors & omissions insurance</li>
                        <li>Implement clear seller onboarding and performance monitoring processes</li>
                        <li>Establish data backup and disaster recovery procedures for business continuity</li>
                    </ul>
                </div>

                <div className="next-steps-section">
                    <h4>🎯 Implementation Roadmap</h4>
                    <ol>
                        <li><strong>Address High Priority Issues:</strong> Resolve any high-risk items immediately before platform launch</li>
                        <li><strong>Legal Review:</strong> Have qualified counsel review the agreement for your specific jurisdiction and business model</li>
                        <li><strong>Seller Testing:</strong> Review the agreement with 5-10 potential sellers to identify practical issues</li>
                        <li><strong>Insurance Review:</strong> Ensure adequate coverage for your chosen risk allocation model</li>
                        <li><strong>Platform Integration:</strong> Implement agreement acceptance workflows in your seller onboarding process</li>
                        <li><strong>Performance Monitoring:</strong> Track seller acceptance rates, dispute frequency, and agreement effectiveness</li>
                        <li><strong>Quarterly Reviews:</strong> Review and update agreement based on operational experience and legal changes</li>
                    </ol>
                </div>

                <div className="business-metrics-section">
                    <h4>📊 Expected Business Metrics</h4>
                    <ul>
                        <li><strong>Seller Acceptance Rate:</strong> Well-drafted agreements typically see 85-95% acceptance rates</li>
                        <li><strong>Dispute Frequency:</strong> Clear terms should result in &lt;2% of transactions having disputes</li>
                        <li><strong>Legal Costs:</strong> Arbitration clauses can reduce legal costs by 60-80% vs litigation</li>
                        <li><strong>Return Processing:</strong> Standard return policies average 8-15% return rates depending on product category</li>
                        <li><strong>Seller Retention:</strong> Fair commission structures maintain 70-80% annual seller retention</li>
                    </ul>
                </div>
            </div>
        );
    };

    // Tab definitions
    const tabs = [
        { name: 'Marketplace Info' },
        { name: 'Commission & Fees' },
        { name: 'Product Requirements' },
        { name: 'Fulfillment & Returns' },
        { name: 'Termination Terms' },
        { name: 'Legal Terms' },
        { name: 'Legal Analysis' }
    ];

    const nextTab = () => {
        if (currentTab < tabs.length - 1) {
            setCurrentTab(currentTab + 1);
        }
    };

    const prevTab = () => {
        if (currentTab > 0) {
            setCurrentTab(currentTab - 1);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Marketplace Seller Agreement Generator</h1>
                <p>Create comprehensive marketplace seller agreements with live legal analysis</p>
            </div>

            <div className="main-content">
                {/* Form Section */}
                <div className="form-section">
                    {/* Tab Navigation */}
                    <div className="tab-nav">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                className={`tab-btn ${currentTab === index ? 'active' : ''}`}
                                onClick={() => setCurrentTab(index)}
                            >
                                {index + 1}. {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content - Using conditional rendering like AI generator */}
                    <div className="tab-content">
                        {currentTab === 0 && (
                            <div>
                                <h2>Marketplace Information</h2>
                                <div className="form-group">
                                    <label>Marketplace Name <HelpIcon tooltip={tooltips.marketplaceName} /></label>
                                    <input
                                        type="text"
                                        name="marketplaceName"
                                        value={formData.marketplaceName}
                                        onChange={handleChange}
                                        placeholder="Enter marketplace name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Marketplace URL</label>
                                    <input
                                        type="text"
                                        name="marketplaceUrl"
                                        value={formData.marketplaceUrl}
                                        onChange={handleChange}
                                        placeholder="www.example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company Address</label>
                                    <textarea
                                        name="companyAddress"
                                        value={formData.companyAddress}
                                        onChange={handleChange}
                                        placeholder="Enter complete business address including city, state, ZIP"
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        placeholder="Primary business contact email"
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab === 1 && (
                            <div>
                                <h2>Commission & Fees</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Commission Percentage (%) <HelpIcon tooltip={tooltips.commissionPercentage} /></label>
                                        <input
                                            type="number"
                                            name="commissionPercentage"
                                            min="0"
                                            max="50"
                                            step="0.1"
                                            value={formData.commissionPercentage}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Flat Fee per Transaction ($) <HelpIcon tooltip={tooltips.flatFee} /></label>
                                        <input
                                            type="number"
                                            name="flatFee"
                                            min="0"
                                            step="0.01"
                                            value={formData.flatFee}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Payment Schedule</label>
                                        <select
                                            name="paymentSchedule"
                                            value={formData.paymentSchedule}
                                            onChange={handleChange}
                                        >
                                            <option value="weekly">Weekly (higher cash flow for sellers)</option>
                                            <option value="bi-weekly">Bi-weekly (balanced approach)</option>
                                            <option value="monthly">Monthly (lower processing costs)</option>
                                            <option value="quarterly">Quarterly (minimal processing)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Payment Method</label>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleChange}
                                        >
                                            <option value="ACH Transfer">ACH Transfer (lowest cost)</option>
                                            <option value="Wire Transfer">Wire Transfer (fastest, higher cost)</option>
                                            <option value="Check">Check (traditional, slower)</option>
                                            <option value="PayPal">PayPal (convenient, higher fees)</option>
                                            <option value="Stripe">Stripe (modern, integrated)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentTab === 2 && (
                            <div>
                                <h2>Product Requirements</h2>
                                <div className="form-group">
                                    <label>Prohibited Items <HelpIcon tooltip={tooltips.prohibitedItems} /></label>
                                    <textarea
                                        name="prohibitedItems"
                                        value={formData.prohibitedItems}
                                        onChange={handleChange}
                                        placeholder="Be specific: illegal items, counterfeit goods, weapons, hazardous materials, adult content, etc."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Listing Requirements <HelpIcon tooltip={tooltips.listingRequirements} /></label>
                                    <textarea
                                        name="listingRequirements"
                                        value={formData.listingRequirements}
                                        onChange={handleChange}
                                        placeholder="Specify image quality, description standards, pricing accuracy, categorization requirements..."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quality Standards <HelpIcon tooltip={tooltips.qualityStandards} /></label>
                                    <textarea
                                        name="qualityStandards"
                                        value={formData.qualityStandards}
                                        onChange={handleChange}
                                        placeholder="Define product condition, authenticity, safety requirements, compliance standards..."
                                        rows="2"
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab === 3 && (
                            <div>
                                <h2>Fulfillment & Returns</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Fulfillment Responsibility <HelpIcon tooltip={tooltips.fulfillmentResponsibility} /></label>
                                        <select
                                            name="fulfillmentResponsibility"
                                            value={formData.fulfillmentResponsibility}
                                            onChange={handleChange}
                                        >
                                            <option value="seller">Seller (reduces your costs & liability)</option>
                                            <option value="marketplace">Marketplace (full control, higher costs)</option>
                                            <option value="shared">Shared (hybrid approach)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Shipping Timeframe <HelpIcon tooltip={tooltips.shippingTimeframe} /></label>
                                        <input
                                            type="text"
                                            name="shippingTimeframe"
                                            value={formData.shippingTimeframe}
                                            onChange={handleChange}
                                            placeholder="e.g., 1-3 business days (be realistic)"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Return Policy Type <HelpIcon tooltip={tooltips.returnPolicyType} /></label>
                                        <select
                                            name="returnPolicyType"
                                            value={formData.returnPolicyType}
                                            onChange={handleChange}
                                        >
                                            <option value="standard-30day">Standard 30-Day Returns</option>
                                            <option value="no-questions-asked">No-Questions-Asked Returns</option>
                                            <option value="store-credit-only">Store Credit Only</option>
                                            <option value="final-sale">Final Sale (No Returns)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Return Timeframe (days) <HelpIcon tooltip={tooltips.returnTimeframe} /></label>
                                        <input
                                            type="number"
                                            name="returnTimeframe"
                                            min="0"
                                            max="365"
                                            value={formData.returnTimeframe}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Customer Service Responsibility <HelpIcon tooltip={tooltips.customerServiceResponsibility} /></label>
                                    <select
                                        name="customerServiceResponsibility"
                                        value={formData.customerServiceResponsibility}
                                        onChange={handleChange}
                                    >
                                        <option value="seller">Seller (reduces your costs)</option>
                                        <option value="marketplace">Marketplace (consistent experience)</option>
                                        <option value="shared">Shared (balanced approach)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentTab === 4 && (
                            <div>
                                <h2>Termination Terms</h2>
                                <div className="form-group">
                                    <label>Notice Period (days) <HelpIcon tooltip={tooltips.noticePeriod} /></label>
                                    <input
                                        type="number"
                                        name="noticePeriod"
                                        min="0"
                                        max="365"
                                        value={formData.noticePeriod}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Termination Reasons <HelpIcon tooltip={tooltips.terminationReasons} /></label>
                                    <textarea
                                        name="terminationReasons"
                                        value={formData.terminationReasons}
                                        onChange={handleChange}
                                        placeholder="Be specific: policy violations, fraud, poor performance metrics, non-payment..."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Post-Termination Obligations</label>
                                    <textarea
                                        name="postTerminationObligations"
                                        value={formData.postTerminationObligations}
                                        onChange={handleChange}
                                        placeholder="Complete orders, process returns, remove listings, provide customer service for sold items..."
                                        rows="2"
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab === 5 && (
                            <div>
                                <h2>Legal Terms</h2>
                                <div className="form-group">
                                    <label>Governing Law <HelpIcon tooltip={tooltips.governingLaw} /></label>
                                    <input
                                        type="text"
                                        name="governingLaw"
                                        value={formData.governingLaw}
                                        onChange={handleChange}
                                        placeholder="e.g., State of California, USA"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Dispute Resolution <HelpIcon tooltip={tooltips.disputeResolution} /></label>
                                        <select
                                            name="disputeResolution"
                                            value={formData.disputeResolution}
                                            onChange={handleChange}
                                        >
                                            <option value="arbitration">Arbitration (faster, cheaper)</option>
                                            <option value="mediation">Mediation then Arbitration</option>
                                            <option value="litigation">Court Litigation (expensive)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Limitation of Liability <HelpIcon tooltip={tooltips.limitationOfLiability} /></label>
                                        <select
                                            name="limitationOfLiability"
                                            value={formData.limitationOfLiability}
                                            onChange={handleChange}
                                        >
                                            <option value="standard">Standard (balanced protection)</option>
                                            <option value="comprehensive">Comprehensive (maximum protection)</option>
                                            <option value="limited">Limited (minimal protection)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Intellectual Property <HelpIcon tooltip={tooltips.intellectualProperty} /></label>
                                    <select
                                        name="intellectualProperty"
                                        value={formData.intellectualProperty}
                                        onChange={handleChange}
                                    >
                                        <option value="seller-retains">Seller Retains All Rights (safest)</option>
                                        <option value="shared">Shared Marketing Rights</option>
                                        <option value="marketplace-license">Marketplace License Rights</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Legal Analysis Tab */}
                        {currentTab === 6 && (
                            <div>
                                <h2>Legal Analysis & Risk Assessment</h2>
                                <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                                    Professional legal analysis of your marketplace agreement. This assessment identifies 
                                    potential risks, provides recommendations, and includes business metrics expectations.
                                </p>
                                <div className="risk-analysis-content">
                                    {generateRiskAnalysis()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="nav-buttons">
                        <button
                            className="btn secondary"
                            onClick={prevTab}
                            disabled={currentTab === 0}
                        >
                            ← Previous
                        </button>
                        
                        <button
                            className="btn copy"
                            onClick={copyToClipboard}
                        >
                            📋 Copy Agreement
                        </button>
                        
                        <button
                            className="btn download"
                            onClick={() => window.generateWordDocument && window.generateWordDocument(documentText, formData)}
                        >
                            📄 Download DOCX
                        </button>
                        
                        <button
                            className="btn"
                            onClick={nextTab}
                            disabled={currentTab === tabs.length - 1}
                        >
                            Next →
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="preview-section">
                    <div className="preview-header">
                        <h3>Live Preview</h3>
                        <small>Updates as you type • Changes highlighted in yellow</small>
                    </div>
                    <div className="preview-content" ref={previewRef}>
                        <div 
                            style={{ whiteSpace: 'pre-wrap', fontFamily: 'Times, serif', fontSize: '0.85rem', lineHeight: '1.6' }}
                            dangerouslySetInnerHTML={{ __html: highlightedText.replace(/\n/g, '<br>') }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(<MarketplaceGenerator />, document.getElementById('root'));