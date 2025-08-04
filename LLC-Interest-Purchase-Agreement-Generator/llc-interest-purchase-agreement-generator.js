// LLC Interest Purchase Agreement Generator
const App = () => {
  // Icon component
  const Icon = ({ name, ...props }) => {
    return (
      <i data-feather={name} {...props} className={`icon ${props.className || ''}`}></i>
    );
  };

  // Tab configuration
  const tabs = [
    { id: 'parties', label: 'Parties' },
    { id: 'transaction', label: 'Transaction Details' },
    { id: 'representations', label: 'Representations & Warranties' },
    { id: 'closing', label: 'Closing & Payment' },
    { id: 'covenants', label: 'Additional Provisions' },
    { id: 'misc', label: 'Miscellaneous' },
    { id: 'finalize', label: 'Finalize & Review' }
  ];

  // Initial form data
  const initialFormData = {
    // Parties Tab
    sellerName: '',
    sellerAddress: '',
    sellerCity: '',
    sellerState: '',
    sellerZip: '',
    buyerName: '',
    buyerAddress: '',
    buyerCity: '',
    buyerState: '',
    buyerZip: '',
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZip: '',
    companyState_Formation: '',
    effectiveDate: '',
    
    // Transaction Details Tab
    interestType: 'percentage',
    interestAmount: '',
    membershipUnits: '',
    totalUnits: '',
    purchasePrice: '',
    paymentMethod: 'full',
    depositAmount: '',
    depositDate: '',
    balancePaymentDate: '',
    interestRate: '',
    installmentAmount: '',
    installmentFrequency: 'monthly',
    installmentCount: '',
    
    // Representations & Warranties Tab
    sellerOwnership: true,
    noEncumbrances: true,
    authorityToSell: true,
    companyGoodStanding: true,
    noLitigation: true,
    financialStatementsProvided: false,
    financialStatementsDate: '',
    taxReturnsProvided: false,
    taxReturnsYears: '',
    operatingAgreementProvided: true,
    customRepresentations: '',
    
    // Closing & Payment Tab
    closingDate: '',
    closingLocation: 'mutual',
    customClosingLocation: '',
    deliverables: true,
    membershipCertificate: true,
    assignmentDocument: true,
    resignationLetters: false,
    customDeliverables: '',
    
    // Additional Provisions Tab
    nonCompete: false,
    nonCompeteDuration: '',
    nonCompeteGeographic: '',
    confidentiality: false,
    confidentialityTerm: '',
    transitionSupport: false,
    transitionSupportDetails: '',
    tagAlongRights: false,
    dragAlongRights: false,
    rightOfFirstRefusal: false,
    customProvisions: '',
    
    // Miscellaneous Tab
    governingLaw: '',
    disputeResolution: 'litigation',
    arbitrationLocation: '',
    arbitrationRules: '',
    mediationRequired: false,
    attorneyFees: 'prevailing',
    notices: true,
    amendments: true,
    entireAgreement: true,
    severability: true,
    waiver: true,
    survival: true,
    customMiscellaneous: '',
    
    // Document Info
    fileName: 'LLC-Interest-Purchase-Agreement'
  };

  // React state hooks
  const [formData, setFormData] = React.useState(initialFormData);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [lastChanged, setLastChanged] = React.useState(null);
  const [documentText, setDocumentText] = React.useState('');
  const [hasPaywallAccess, setHasPaywallAccess] = React.useState(false);
  
  // Ref for preview content div
  const previewRef = React.useRef(null);

  // Paywall integration
  React.useEffect(() => {
    // Function to check and update payment status
    const checkPaymentStatus = () => {
      if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
        setHasPaywallAccess(true);
        return true;
      }
      return false;
    };
    
    // Initial check
    if (!checkPaymentStatus()) {
      // Apply non-copyable restrictions to preview if not paid
      setTimeout(() => {
        if (window.PaywallSystem && window.PaywallSystem.makePreviewNonCopyable) {
          window.PaywallSystem.makePreviewNonCopyable();
        }
      }, 1000);
    }
    
    // Listen for payment success events
    const handlePaymentSuccess = () => {
      console.log('Payment success event received, updating access state');
      setHasPaywallAccess(true);
      if (window.PaywallSystem && window.PaywallSystem.enablePreviewInteraction) {
        window.PaywallSystem.enablePreviewInteraction();
      }
    };
    
    // Add event listener for payment success
    window.addEventListener('paywallPaymentSuccess', handlePaymentSuccess);
    
    // Also poll payment status every 2 seconds as backup
    const pollInterval = setInterval(() => {
      if (!hasPaywallAccess && checkPaymentStatus()) {
        console.log('Payment status changed, updating access state');
        if (window.PaywallSystem && window.PaywallSystem.enablePreviewInteraction) {
          window.PaywallSystem.enablePreviewInteraction();
        }
      }
    }, 2000);

    // Cleanup
    return () => {
      window.removeEventListener('paywallPaymentSuccess', handlePaymentSuccess);
      clearInterval(pollInterval);
    };
  }, [hasPaywallAccess]);

  // Ref for preview content div
  const previewRef = React.useRef(null);

  // Navigation functions
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

  const goToTab = (index) => {
    setCurrentTab(index);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Record what field was changed for highlighting
    setLastChanged(name);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Copy document to clipboard
  const copyToClipboard = () => {
    if (!hasPaywallAccess) {
      if (window.PaywallSystem) {
        window.PaywallSystem.showAccessDenied('copy');
        window.PaywallSystem.createPaywallModal(() => {
          // Double-check access status after modal closes
          if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
            setHasPaywallAccess(true);
            window.PaywallSystem.enablePreviewInteraction();
            copyToClipboard();
          } else {
            console.log('Payment not confirmed, retrying access check...');
            setTimeout(() => {
              if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
                setHasPaywallAccess(true);
                window.PaywallSystem.enablePreviewInteraction();
                copyToClipboard();
              }
            }, 1000);
          }
        });
      }
      return;
    }

    try {
      navigator.clipboard.writeText(documentText);
      alert('Document copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy: ', error);
      alert('Failed to copy to clipboard');
    }
  };

  // Download document as Word
  const downloadAsWord = () => {
    if (!hasPaywallAccess) {
      if (window.PaywallSystem) {
        window.PaywallSystem.showAccessDenied('download');
        window.PaywallSystem.createPaywallModal(() => {
          // Double-check access status after modal closes
          if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
            setHasPaywallAccess(true);
            window.PaywallSystem.enablePreviewInteraction();
            downloadAsWord();
          } else {
            console.log('Payment not confirmed, retrying access check...');
            setTimeout(() => {
              if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
                setHasPaywallAccess(true);
                window.PaywallSystem.enablePreviewInteraction();
                downloadAsWord();
              }
            }, 1000);
          }
        });
      }
      return;
    }

    try {
      console.log("Download MS Word button clicked");
      
      if (!documentText) {
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      window.generateWordDoc(documentText, {
        documentTitle: "LLC Interest Purchase Agreement",
        fileName: formData.fileName || "LLC-Interest-Purchase-Agreement"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Generate document text based on form data
  React.useEffect(() => {
    const generateDocument = () => {
      let text = '';
      
      // Title
      text += `LLC INTEREST PURCHASE AGREEMENT\n\n`;
      
      // Effective Date
      if (formData.effectiveDate) {
        text += `This LLC Interest Purchase Agreement (the "Agreement") is made effective as of ${formData.effectiveDate} (the "Effective Date")\n\n`;
      } else {
        text += `This LLC Interest Purchase Agreement (the "Agreement") is made effective as of _____________ (the "Effective Date")\n\n`;
      }
      
      // Parties
      text += `BY AND BETWEEN:\n\n`;
      
      // Seller
      if (formData.sellerName) {
        text += `${formData.sellerName}`;
        
        const sellerAddress = [
          formData.sellerAddress,
          formData.sellerCity && formData.sellerState ? 
            `${formData.sellerCity}, ${formData.sellerState}${formData.sellerZip ? ' ' + formData.sellerZip : ''}` : 
            ''
        ].filter(Boolean).join(', ');
        
        if (sellerAddress) {
          text += `, with an address at ${sellerAddress}`;
        }
        
        text += ` (the "Seller"),\n\n`;
      } else {
        text += `____________________, with an address at ____________________ (the "Seller"),\n\n`;
      }
      
      // Buyer
      if (formData.buyerName) {
        text += `${formData.buyerName}`;
        
        const buyerAddress = [
          formData.buyerAddress,
          formData.buyerCity && formData.buyerState ? 
            `${formData.buyerCity}, ${formData.buyerState}${formData.buyerZip ? ' ' + formData.buyerZip : ''}` : 
            ''
        ].filter(Boolean).join(', ');
        
        if (buyerAddress) {
          text += `, with an address at ${buyerAddress}`;
        }
        
        text += ` (the "Buyer"),\n\n`;
      } else {
        text += `____________________, with an address at ____________________ (the "Buyer"),\n\n`;
      }
      
      // Company
      text += `AND\n\n`;
      
      if (formData.companyName) {
        text += `${formData.companyName}`;
        
        if (formData.companyState_Formation) {
          text += `, a ${formData.companyState_Formation} limited liability company`;
        } else {
          text += `, a limited liability company`;
        }
        
        const companyAddress = [
          formData.companyAddress,
          formData.companyCity && formData.companyState ? 
            `${formData.companyCity}, ${formData.companyState}${formData.companyZip ? ' ' + formData.companyZip : ''}` : 
            ''
        ].filter(Boolean).join(', ');
        
        if (companyAddress) {
          text += `, with a principal place of business at ${companyAddress}`;
        }
        
        text += ` (the "Company").\n\n`;
      } else {
        text += `____________________, a limited liability company, with a principal place of business at ____________________ (the "Company").\n\n`;
      }
      
      // Recitals
      text += `RECITALS\n\n`;
      text += `WHEREAS, the Seller is a member of the Company and holds certain membership interests in the Company;\n\n`;
      
      if (formData.interestType === 'percentage') {
        if (formData.interestAmount) {
          text += `WHEREAS, the Seller desires to sell ${formData.interestAmount}% of the membership interests in the Company to the Buyer, and the Buyer desires to purchase such membership interests from the Seller;\n\n`;
        } else {
          text += `WHEREAS, the Seller desires to sell _____% of the membership interests in the Company to the Buyer, and the Buyer desires to purchase such membership interests from the Seller;\n\n`;
        }
      } else { // units
        if (formData.membershipUnits && formData.totalUnits) {
          text += `WHEREAS, the Seller desires to sell ${formData.membershipUnits} units of membership interests out of a total of ${formData.totalUnits} units in the Company to the Buyer, and the Buyer desires to purchase such membership interests from the Seller;\n\n`;
        } else {
          text += `WHEREAS, the Seller desires to sell _____ units of membership interests out of a total of _____ units in the Company to the Buyer, and the Buyer desires to purchase such membership interests from the Seller;\n\n`;
        }
      }
      
      text += `NOW, THEREFORE, in consideration of the mutual covenants, terms, and conditions set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:\n\n`;
      
      // 1. Purchase and Sale
      text += `1. PURCHASE AND SALE OF MEMBERSHIP INTERESTS\n\n`;
      
      // 1.1 Sale of Membership Interests
      text += `1.1 Sale of Membership Interests. Subject to the terms and conditions of this Agreement, the Seller hereby sells, assigns, transfers, and delivers to the Buyer, and the Buyer hereby purchases and accepts from the Seller, all of the Seller's right, title, and interest in and to the `;
      
      if (formData.interestType === 'percentage') {
        if (formData.interestAmount) {
          text += `${formData.interestAmount}% membership interest`;
        } else {
          text += `_____% membership interest`;
        }
      } else { // units
        if (formData.membershipUnits) {
          text += `${formData.membershipUnits} units of membership interests`;
        } else {
          text += `_____ units of membership interests`;
        }
      }
      
      text += ` in the Company (the "Purchased Interests").\n\n`;
      
      // 2. Purchase Price
      text += `2. PURCHASE PRICE AND PAYMENT\n\n`;
      
      // 2.1 Purchase Price
      text += `2.1 Purchase Price. The aggregate purchase price for the Purchased Interests is `;
      
      if (formData.purchasePrice) {
        text += `$${formData.purchasePrice}`;
      } else {
        text += `$_____`;
      }
      
      text += ` (the "Purchase Price").\n\n`;
      
      // 2.2 Payment
      text += `2.2 Payment of Purchase Price. `;
      
      if (formData.paymentMethod === 'full') {
        text += `The Buyer shall pay the Purchase Price to the Seller in full at the Closing, in immediately available funds by wire transfer to an account designated by the Seller in writing, or by certified or cashier's check.\n\n`;
      } else if (formData.paymentMethod === 'deposit') {
        text += `The Buyer shall pay the Purchase Price as follows:\n\n`;
        
        if (formData.depositAmount) {
          text += `(a) $${formData.depositAmount} as a deposit (the "Deposit") `;
          if (formData.depositDate) {
            text += `on or before ${formData.depositDate}, `;
          } else {
            text += `on or before ____________, `;
          }
          text += `and\n\n`;
        } else {
          text += `(a) $_____ as a deposit (the "Deposit") on or before ____________, and\n\n`;
        }
        
        text += `(b) The balance of the Purchase Price at the Closing, in immediately available funds by wire transfer to an account designated by the Seller in writing, or by certified or cashier's check.\n\n`;
      } else if (formData.paymentMethod === 'installments') {
        text += `The Buyer shall pay the Purchase Price as follows:\n\n`;
        
        const installmentDetails = [];
        
        if (formData.depositAmount) {
          installmentDetails.push(`(a) $${formData.depositAmount} as a deposit (the "Deposit") at the Closing,`);
        } else {
          installmentDetails.push(`(a) $_____ as a deposit (the "Deposit") at the Closing,`);
        }
        
        if (formData.installmentAmount && formData.installmentCount) {
          installmentDetails.push(`(b) The balance of the Purchase Price in ${formData.installmentCount} equal ${formData.installmentFrequency} installments of $${formData.installmentAmount} each,`);
        } else {
          installmentDetails.push(`(b) The balance of the Purchase Price in _____ equal _____ installments of $_____ each,`);
        }
        
        if (formData.interestRate) {
          installmentDetails.push(`(c) Interest shall accrue on the unpaid balance of the Purchase Price at the rate of ${formData.interestRate}% per annum,`);
        } else {
          installmentDetails.push(`(c) Interest shall accrue on the unpaid balance of the Purchase Price at the rate of _____% per annum,`);
        }
        
        installmentDetails.push(`(d) Payments shall begin on the first day of the month following the Closing and continue on the first day of each ${formData.installmentFrequency || '____'} period thereafter until paid in full.`);
        
        text += installmentDetails.join('\n\n') + '\n\n';
      }
      
      // 3. Representations and Warranties of the Seller
      text += `3. REPRESENTATIONS AND WARRANTIES OF THE SELLER\n\n`;
      text += `The Seller represents and warrants to the Buyer as follows:\n\n`;
      
      // Standard representations
      if (formData.sellerOwnership) {
        text += `3.1 Ownership of Purchased Interests. The Seller is the sole legal and beneficial owner of the Purchased Interests, and has good and marketable title to the Purchased Interests, free and clear of any liens, claims, encumbrances, or restrictions of any kind.\n\n`;
      }
      
      if (formData.noEncumbrances) {
        text += `3.2 No Encumbrances. The Purchased Interests are free and clear of any liens, security interests, claims, encumbrances, or other restrictions of any kind.\n\n`;
      }
      
      if (formData.authorityToSell) {
        text += `3.3 Authority. The Seller has full power, authority, and capacity to execute and deliver this Agreement and to perform all obligations hereunder. This Agreement constitutes a valid and binding obligation of the Seller, enforceable against the Seller in accordance with its terms.\n\n`;
      }
      
      if (formData.companyGoodStanding) {
        text += `3.4 Company Good Standing. To the best of the Seller's knowledge, the Company is duly organized, validly existing, and in good standing under the laws of ${formData.companyState_Formation || '[state of formation]'} and has all requisite power and authority to own, lease, and operate its properties and to carry on its business as currently conducted.\n\n`;
      }
      
      if (formData.noLitigation) {
        text += `3.5 No Litigation. There is no action, suit, proceeding, or investigation pending or, to the best of the Seller's knowledge, threatened against or affecting the Purchased Interests.\n\n`;
      }
      
      if (formData.financialStatementsProvided) {
        text += `3.6 Financial Statements. The Seller has provided the Buyer with true, complete, and correct copies of the financial statements of the Company as of ${formData.financialStatementsDate || '________'}, and such financial statements fairly present the financial condition and results of operations of the Company as of such date.\n\n`;
      }
      
      if (formData.taxReturnsProvided) {
        text += `3.7 Tax Returns. The Seller has provided the Buyer with true, complete, and correct copies of all federal, state, and local tax returns of the Company for the years ${formData.taxReturnsYears || '________'}, and all such tax returns were true, complete, and correct when filed.\n\n`;
      }
      
      if (formData.operatingAgreementProvided) {
        text += `3.8 Operating Agreement. The Seller has provided the Buyer with a true, complete, and correct copy of the Company's operating agreement, which is in full force and effect and has not been amended except as disclosed to the Buyer.\n\n`;
      }
      
      // Custom representations
      if (formData.customRepresentations) {
        text += `3.9 Additional Representations. ${formData.customRepresentations}\n\n`;
      }
      
      // 4. Representations and Warranties of the Buyer
      text += `4. REPRESENTATIONS AND WARRANTIES OF THE BUYER\n\n`;
      text += `The Buyer represents and warrants to the Seller as follows:\n\n`;
      
      text += `4.1 Authority. The Buyer has full power, authority, and capacity to execute and deliver this Agreement and to perform all obligations hereunder. This Agreement constitutes a valid and binding obligation of the Buyer, enforceable against the Buyer in accordance with its terms.\n\n`;
      
      text += `4.2 Investment Purpose. The Buyer is acquiring the Purchased Interests for its own account for investment purposes only and not with a view to, or for sale in connection with, any distribution thereof in violation of applicable securities laws.\n\n`;
      
      text += `4.3 Investigation. The Buyer has had an opportunity to ask questions and receive answers from the Seller regarding the business, properties, prospects, and financial condition of the Company and to obtain additional information necessary to verify the accuracy of any information furnished to the Buyer.\n\n`;
      
      // 5. Closing
      text += `5. CLOSING\n\n`;
      
      // 5.1 Closing Date
      text += `5.1 Closing Date. The closing of the purchase and sale of the Purchased Interests (the "Closing") shall take place on `;
      if (formData.closingDate) {
        text += `${formData.closingDate}`;
      } else {
        text += `______________`;
      }
      text += ` (the "Closing Date"), or such other date as the parties may mutually agree.\n\n`;
      
      // 5.2 Closing Location
      text += `5.2 Closing Location. The Closing shall take place at `;
      if (formData.closingLocation === 'seller') {
        text += `the offices of the Seller`;
      } else if (formData.closingLocation === 'buyer') {
        text += `the offices of the Buyer`;
      } else if (formData.closingLocation === 'company') {
        text += `the principal office of the Company`;
      } else if (formData.closingLocation === 'custom' && formData.customClosingLocation) {
        text += `${formData.customClosingLocation}`;
      } else if (formData.closingLocation === 'remote') {
        text += `a remote closing whereby the parties shall exchange signed documents electronically`;
      } else {
        text += `a location mutually agreed upon by the parties`;
      }
      text += `, or such other location as the parties may mutually agree.\n\n`;
      
      // 5.3 Deliveries at Closing
      if (formData.deliverables) {
        text += `5.3 Deliveries at Closing. At the Closing:\n\n`;
        
        let deliveries = [];
        
        // Seller deliveries
        deliveries.push(`(a) The Seller shall deliver to the Buyer:`);
        let sellerDeliverables = [];
        
        if (formData.membershipCertificate) {
          sellerDeliverables.push(`(i) The certificate(s) representing the Purchased Interests, duly endorsed for transfer or accompanied by duly executed assignment documents;`);
        }
        
        if (formData.assignmentDocument) {
          sellerDeliverables.push(`(ii) A duly executed assignment of the Purchased Interests;`);
        }
        
        if (formData.resignationLetters) {
          sellerDeliverables.push(`(iii) A duly executed resignation letter from any position the Seller holds as a manager, officer, or employee of the Company;`);
        }
        
        if (formData.customDeliverables) {
          sellerDeliverables.push(`(iv) ${formData.customDeliverables}`);
        }
        
        if (sellerDeliverables.length === 0) {
          sellerDeliverables.push(`(i) Such documents as may be reasonably necessary to transfer the Purchased Interests to the Buyer;`);
        }
        
        deliveries.push(sellerDeliverables.join('\n\n'));
        
        // Buyer deliveries
        deliveries.push(`(b) The Buyer shall deliver to the Seller:`);
        deliveries.push(`(i) The Purchase Price in accordance with Section 2.2 of this Agreement;`);
        
        text += deliveries.join('\n\n') + '\n\n';
      }
      
      // Additional Provisions
      text += `6. ADDITIONAL PROVISIONS\n\n`;
      
      // Non-compete
      if (formData.nonCompete) {
        text += `6.1 Non-Competition. For a period of ${formData.nonCompeteDuration || '____'} following the Closing Date, the Seller shall not, directly or indirectly, engage in any business that competes with the Company within ${formData.nonCompeteGeographic || 'the geographic area where the Company currently does business'}.\n\n`;
      }
      
      // Confidentiality
      if (formData.confidentiality) {
        text += `6.2 Confidentiality. The Seller acknowledges that during their membership in the Company, they had access to confidential information relating to the Company. The Seller agrees to maintain the confidentiality of such information for a period of ${formData.confidentialityTerm || '____'} after the Closing Date and shall not disclose such information to any third party without the prior written consent of the Company.\n\n`;
      }
      
      // Transition support
      if (formData.transitionSupport) {
        text += `6.3 Transition Support. The Seller agrees to provide reasonable assistance to the Buyer in transitioning the Purchased Interests and related business operations. ${formData.transitionSupportDetails || ''}\n\n`;
      }
      
      // Tag-along rights
      if (formData.tagAlongRights) {
        text += `6.4 Tag-Along Rights. If, after the Closing, the Buyer proposes to sell all or a portion of the Purchased Interests to a third party, the Buyer shall provide written notice to the Seller of such proposed sale, and the Seller shall have the right to participate in such sale on a pro rata basis and on the same terms and conditions as the Buyer.\n\n`;
      }
      
      // Drag-along rights
      if (formData.dragAlongRights) {
        text += `6.5 Drag-Along Rights. If, after the Closing, the Buyer proposes to sell all of the Purchased Interests to a third party, the Buyer may require the Seller to participate in such sale on the same terms and conditions as the Buyer by providing written notice to the Seller.\n\n`;
      }
      
      // Right of first refusal
      if (formData.rightOfFirstRefusal) {
        text += `6.6 Right of First Refusal. If, after the Closing, the Seller proposes to sell any of their remaining membership interests in the Company, the Seller shall first offer to sell such interests to the Buyer on the same terms and conditions as the Seller proposes to sell to any third party. The Buyer shall have 30 days to accept or reject such offer.\n\n`;
      }
      
      // Custom provisions
      if (formData.customProvisions) {
        text += `6.7 Additional Provisions. ${formData.customProvisions}\n\n`;
      }
      
      // Miscellaneous
      text += `7. MISCELLANEOUS\n\n`;
      
      // Governing Law
      text += `7.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw || '________'} without giving effect to any choice or conflict of law provision or rule.\n\n`;
      
      // Dispute Resolution
      text += `7.2 Dispute Resolution. `;
      if (formData.disputeResolution === 'litigation') {
        text += `Any dispute arising out of or relating to this Agreement shall be resolved in the state or federal courts located in ${formData.governingLaw || '________'}, and each party hereby irrevocably submits to the exclusive jurisdiction of such courts.\n\n`;
      } else if (formData.disputeResolution === 'arbitration') {
        text += `Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration in ${formData.arbitrationLocation || '________'} in accordance with the rules of ${formData.arbitrationRules || 'the American Arbitration Association'} then in effect. The award rendered by the arbitrator shall be final and binding on the parties.\n\n`;
        
        if (formData.mediationRequired) {
          text += `7.3 Mediation. Before initiating arbitration, the parties shall first attempt in good faith to resolve any dispute by mediation.\n\n`;
        }
      }
      
      // Attorney Fees
      text += `${formData.mediationRequired ? '7.4' : '7.3'} Attorney's Fees. In the event of any dispute arising out of or relating to this Agreement, `;
      if (formData.attorneyFees === 'prevailing') {
        text += `the prevailing party shall be entitled to recover their reasonable attorney's fees and costs.\n\n`;
      } else if (formData.attorneyFees === 'each') {
        text += `each party shall bear their own attorney's fees and costs.\n\n`;
      } else {
        text += `the attorney's fees and costs shall be allocated as determined by the court or arbitrator.\n\n`;
      }
      
      // Standard provisions
      let sectionCounter = formData.mediationRequired ? 7.5 : 7.4;
      
      if (formData.notices) {
        text += `${sectionCounter} Notices. All notices, requests, consents, claims, demands, waivers, and other communications hereunder shall be in writing and shall be deemed to have been given (a) when delivered by hand; (b) when received if sent by a nationally recognized overnight courier; (c) on the date sent by email if sent during normal business hours, and on the next business day if sent after normal business hours; or (d) on the third day after the date mailed, by certified or registered mail, return receipt requested, postage prepaid.\n\n`;
        sectionCounter += 0.1;
      }
      
      if (formData.amendments) {
        text += `${sectionCounter.toFixed(1)} Amendments. This Agreement may only be amended, modified, or supplemented by an agreement in writing signed by each party hereto.\n\n`;
        sectionCounter += 0.1;
      }
      
      if (formData.entireAgreement) {
        text += `${sectionCounter.toFixed(1)} Entire Agreement. This Agreement constitutes the entire agreement of the parties with respect to the subject matter contained herein, and supersedes all prior and contemporaneous understandings and agreements, both written and oral, with respect to such subject matter.\n\n`;
        sectionCounter += 0.1;
      }
      
      if (formData.severability) {
        text += `${sectionCounter.toFixed(1)} Severability. If any term or provision of this Agreement is invalid, illegal, or unenforceable, such invalidity, illegality, or unenforceability shall not affect any other term or provision of this Agreement.\n\n`;
        sectionCounter += 0.1;
      }
      
      if (formData.waiver) {
        text += `${sectionCounter.toFixed(1)} Waiver. No waiver by any party of any of the provisions hereof shall be effective unless explicitly set forth in writing and signed by the party so waiving.\n\n`;
        sectionCounter += 0.1;
      }
      
      if (formData.survival) {
        text += `${sectionCounter.toFixed(1)} Survival. The representations, warranties, covenants, and agreements contained herein shall survive the Closing and shall remain in full force and effect following the Closing Date.\n\n`;
        sectionCounter += 0.1;
      }
      
      // Custom miscellaneous provisions
      if (formData.customMiscellaneous) {
        text += `${sectionCounter.toFixed(1)} Additional Miscellaneous Provisions. ${formData.customMiscellaneous}\n\n`;
      }
      
      // Signature block
      text += `IN WITNESS WHEREOF, the parties hereto have executed this LLC Interest Purchase Agreement as of the Effective Date first above written.\n\n`;
      
      text += `SELLER:\n\n`;
      text += `____________________________\n`;
      if (formData.sellerName) {
        text += `${formData.sellerName}\n\n`;
      } else {
        text += `Print Name: ______________________\n\n`;
      }
      
      text += `BUYER:\n\n`;
      text += `____________________________\n`;
      if (formData.buyerName) {
        text += `${formData.buyerName}\n\n`;
      } else {
        text += `Print Name: ______________________\n\n`;
      }
      
      text += `COMPANY:\n\n`;
      if (formData.companyName) {
        text += `${formData.companyName}\n\n`;
      } else {
        text += `____________________________ (Company Name)\n\n`;
      }
      
      text += `By: ____________________________\n`;
      text += `Name: ____________________________\n`;
      text += `Title: ____________________________\n\n`;
      
      return text;
    };
    
    setDocumentText(generateDocument());
  }, [formData]);

  // Apply preview restrictions on component mount
  React.useEffect(() => {
    if (!hasPaywallAccess) {
      // Apply non-copyable restrictions to preview
      setTimeout(() => {
        if (window.PaywallSystem && window.PaywallSystem.makePreviewNonCopyable) {
          window.PaywallSystem.makePreviewNonCopyable();
        }
      }, 500);
    }
  }, [documentText, hasPaywallAccess]);

  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    // Group fields by section in the document
    const fieldToSectionMap = {
      // Parties Tab
      sellerName: 'parties',
      sellerAddress: 'parties',
      sellerCity: 'parties',
      sellerState: 'parties',
      sellerZip: 'parties',
      buyerName: 'parties',
      buyerAddress: 'parties',
      buyerCity: 'parties',
      buyerState: 'parties',
      buyerZip: 'parties',
      companyName: 'parties',
      companyAddress: 'parties',
      companyCity: 'parties',
      companyState: 'parties',
      companyZip: 'parties',
      companyState_Formation: 'parties',
      effectiveDate: 'parties',
      
      // Transaction Details Tab
      interestType: 'transaction',
      interestAmount: 'transaction',
      membershipUnits: 'transaction',
      totalUnits: 'transaction',
      purchasePrice: 'purchase-price',
      paymentMethod: 'payment',
      depositAmount: 'payment',
      depositDate: 'payment',
      balancePaymentDate: 'payment',
      interestRate: 'payment',
      installmentAmount: 'payment',
      installmentFrequency: 'payment',
      installmentCount: 'payment',
      
      // Representations & Warranties Tab
      sellerOwnership: 'seller-reps',
      noEncumbrances: 'seller-reps',
      authorityToSell: 'seller-reps',
      companyGoodStanding: 'seller-reps',
      noLitigation: 'seller-reps',
      financialStatementsProvided: 'seller-reps',
      financialStatementsDate: 'seller-reps',
      taxReturnsProvided: 'seller-reps',
      taxReturnsYears: 'seller-reps',
      operatingAgreementProvided: 'seller-reps',
      customRepresentations: 'seller-reps',
      
      // Closing & Payment Tab
      closingDate: 'closing',
      closingLocation: 'closing',
      customClosingLocation: 'closing',
      deliverables: 'deliverables',
      membershipCertificate: 'deliverables',
      assignmentDocument: 'deliverables',
      resignationLetters: 'deliverables',
      customDeliverables: 'deliverables',
      
      // Additional Provisions Tab
      nonCompete: 'noncompete',
      nonCompeteDuration: 'noncompete',
      nonCompeteGeographic: 'noncompete',
      confidentiality: 'confidentiality',
      confidentialityTerm: 'confidentiality',
      transitionSupport: 'transition',
      transitionSupportDetails: 'transition',
      tagAlongRights: 'tag-along',
      dragAlongRights: 'drag-along',
      rightOfFirstRefusal: 'rofr',
      customProvisions: 'custom-provisions',
      
      // Miscellaneous Tab
      governingLaw: 'governing-law',
      disputeResolution: 'dispute-resolution',
      arbitrationLocation: 'dispute-resolution',
      arbitrationRules: 'dispute-resolution',
      mediationRequired: 'dispute-resolution',
      attorneyFees: 'attorney-fees',
      notices: 'notices',
      amendments: 'amendments',
      entireAgreement: 'entire-agreement',
      severability: 'severability',
      waiver: 'waiver',
      survival: 'survival',
      customMiscellaneous: 'custom-misc'
    };
    
    if (!lastChanged) return null;
    return fieldToSectionMap[lastChanged];
  };

  // Create highlighted text
  const createHighlightedText = () => {
    if (!documentText || !lastChanged) return documentText;
    
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    // Define regex patterns for different sections of the document
    const sectionPatterns = {
      'parties': /(BY AND BETWEEN:[\s\S]*?Company"\)\.)/,
      'transaction': /(1\.1 Sale of Membership Interests[\s\S]*?Purchased Interests"\.)/,
      'purchase-price': /(2\.1 Purchase Price[\s\S]*?Purchase Price"\.)/,
      'payment': /(2\.2 Payment of Purchase Price[\s\S]*?)(?=3\. REPRESENTATIONS)/,
      'seller-reps': /(3\. REPRESENTATIONS AND WARRANTIES OF THE SELLER[\s\S]*?)(?=4\. REPRESENTATIONS)/,
      'closing': /(5\.1 Closing Date[\s\S]*?)(?=5\.3|6\. ADDITIONAL)/,
      'deliverables': /(5\.3 Deliveries at Closing[\s\S]*?)(?=6\. ADDITIONAL)/,
      'noncompete': /(6\.1 Non-Competition[\s\S]*?)(?=6\.2|7\. MISCELLANEOUS)/,
      'confidentiality': /(6\.2 Confidentiality[\s\S]*?)(?=6\.3|7\. MISCELLANEOUS)/,
      'transition': /(6\.3 Transition Support[\s\S]*?)(?=6\.4|7\. MISCELLANEOUS)/,
      'tag-along': /(6\.4 Tag-Along Rights[\s\S]*?)(?=6\.5|7\. MISCELLANEOUS)/,
      'drag-along': /(6\.5 Drag-Along Rights[\s\S]*?)(?=6\.6|7\. MISCELLANEOUS)/,
      'rofr': /(6\.6 Right of First Refusal[\s\S]*?)(?=6\.7|7\. MISCELLANEOUS)/,
      'custom-provisions': /(6\.7 Additional Provisions[\s\S]*?)(?=7\. MISCELLANEOUS)/,
      'governing-law': /(7\.1 Governing Law[\s\S]*?)(?=7\.2)/,
      'dispute-resolution': /(7\.2 Dispute Resolution[\s\S]*?)(?=7\.3|7\.4)/,
      'attorney-fees': /(7\.[34] Attorney's Fees[\s\S]*?)(?=7\.[45]|IN WITNESS)/,
      'notices': /(7\.[45] Notices[\s\S]*?)(?=7\.[56]|IN WITNESS)/,
      'amendments': /(7\.[56] Amendments[\s\S]*?)(?=7\.[67]|IN WITNESS)/,
      'entire-agreement': /(7\.[67] Entire Agreement[\s\S]*?)(?=7\.[78]|IN WITNESS)/,
      'severability': /(7\.[78] Severability[\s\S]*?)(?=7\.[89]|IN WITNESS)/,
      'waiver': /(7\.[89] Waiver[\s\S]*?)(?=7\.[90]|IN WITNESS)/,
      'survival': /(7\.[90] Survival[\s\S]*?)(?=7\.[01]|IN WITNESS)/,
      'custom-misc': /(7\.[01] Additional Miscellaneous Provisions[\s\S]*?)(?=IN WITNESS)/
    };
    
    if (sectionPatterns[sectionToHighlight]) {
      return documentText.replace(sectionPatterns[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };

  // Create highlighted content
  const highlightedText = createHighlightedText();

  // Effect to scroll to highlighted text
  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

  // Get risk assessment for finalization tab
  const getRiskAssessment = () => {
    const risks = [];
    
    // Check for critical information
    if (!formData.sellerName || !formData.buyerName || !formData.companyName) {
      risks.push({
        level: 'high-risk',
        title: 'Missing Party Information',
        description: 'One or more party names are missing. This is critical information required for a valid agreement.',
        recommendation: 'Go back to the Parties tab and provide the names of the Seller, Buyer, and Company.'
      });
    }
    
    if (formData.interestType === 'percentage' && !formData.interestAmount) {
      risks.push({
        level: 'high-risk',
        title: 'Missing Interest Amount',
        description: 'You have selected to transfer a percentage of LLC interest but have not specified the percentage amount.',
        recommendation: 'Go back to the Transaction Details tab and specify the percentage of interest being transferred.'
      });
    }
    
    if (formData.interestType === 'units' && (!formData.membershipUnits || !formData.totalUnits)) {
      risks.push({
        level: 'high-risk',
        title: 'Missing Units Information',
        description: 'You have selected to transfer units of LLC interest but have not specified the number of units or total units.',
        recommendation: 'Go back to the Transaction Details tab and specify the number of units being transferred and the total units in the LLC.'
      });
    }
    
    if (!formData.purchasePrice) {
      risks.push({
        level: 'high-risk',
        title: 'Missing Purchase Price',
        description: 'The purchase price for the LLC interest is not specified.',
        recommendation: 'Go back to the Transaction Details tab and specify the purchase price for the LLC interest.'
      });
    }
    
    if (formData.paymentMethod === 'installments' && (!formData.installmentAmount || !formData.installmentCount)) {
      risks.push({
        level: 'medium-risk',
        title: 'Incomplete Installment Information',
        description: 'You have selected payment by installments but have not fully specified the installment details.',
        recommendation: 'Go back to the Transaction Details tab and provide the installment amount and number of installments.'
      });
    }
    
    if (!formData.closingDate) {
      risks.push({
        level: 'medium-risk',
        title: 'Missing Closing Date',
        description: 'The closing date for the transaction is not specified.',
        recommendation: 'Go back to the Closing & Payment tab and specify the closing date.'
      });
    }
    
    if (formData.nonCompete && (!formData.nonCompeteDuration || !formData.nonCompeteGeographic)) {
      risks.push({
        level: 'medium-risk',
        title: 'Incomplete Non-Compete Clause',
        description: 'You have included a non-compete provision but have not fully specified the duration or geographic scope.',
        recommendation: 'Go back to the Additional Provisions tab and provide the duration and geographic scope of the non-compete restriction.'
      });
    }
    
    if (!formData.governingLaw) {
      risks.push({
        level: 'medium-risk',
        title: 'Missing Governing Law',
        description: 'The governing law for the agreement is not specified.',
        recommendation: 'Go back to the Miscellaneous tab and specify the governing law.'
      });
    }
    
    if (formData.disputeResolution === 'arbitration' && (!formData.arbitrationLocation || !formData.arbitrationRules)) {
      risks.push({
        level: 'medium-risk',
        title: 'Incomplete Arbitration Information',
        description: 'You have selected arbitration for dispute resolution but have not fully specified the arbitration details.',
        recommendation: 'Go back to the Miscellaneous tab and provide the arbitration location and rules.'
      });
    }
    
    // If no risks, add a low risk card
    if (risks.length === 0) {
      risks.push({
        level: 'low-risk',
        title: 'Agreement Appears Complete',
        description: 'All critical sections of the LLC Interest Purchase Agreement have been completed.',
        recommendation: 'Review the preview one more time to ensure all information is accurate before downloading or copying the document.'
      });
    }
    
    return risks;
  };

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Parties
        return (
          <div className="form-section">
            <h2>Parties Information</h2>
            
            <div className="form-group">
              <label>Effective Date</label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                className="form-control"
              />
              <div className="form-help">The date when this agreement becomes effective.</div>
            </div>
            
            <h3>Seller Information</h3>
            <div className="form-group">
              <label>Seller's Full Name</label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                className="form-control"
                placeholder="John Doe or ABC, LLC"
              />
            </div>
            
            <div className="form-group">
              <label>Seller's Address</label>
              <input
                type="text"
                name="sellerAddress"
                value={formData.sellerAddress}
                onChange={handleChange}
                className="form-control"
                placeholder="123 Main St."
              />
            </div>
            
            <div className="form-group">
              <label>Seller's City</label>
              <input
                type="text"
                name="sellerCity"
                value={formData.sellerCity}
                onChange={handleChange}
                className="form-control"
                placeholder="New York"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: '1' }}>
                <label>Seller's State</label>
                <input
                  type="text"
                  name="sellerState"
                  value={formData.sellerState}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="NY"
                />
              </div>
              
              <div className="form-group" style={{ flex: '1' }}>
                <label>Seller's ZIP Code</label>
                <input
                  type="text"
                  name="sellerZip"
                  value={formData.sellerZip}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="10001"
                />
              </div>
            </div>
            
            <h3>Buyer Information</h3>
            <div className="form-group">
              <label>Buyer's Full Name</label>
              <input
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                className="form-control"
                placeholder="Jane Smith or XYZ, LLC"
              />
            </div>
            
            <div className="form-group">
              <label>Buyer's Address</label>
              <input
                type="text"
                name="buyerAddress"
                value={formData.buyerAddress}
                onChange={handleChange}
                className="form-control"
                placeholder="456 Oak Ave."
              />
            </div>
            
            <div className="form-group">
              <label>Buyer's City</label>
              <input
                type="text"
                name="buyerCity"
                value={formData.buyerCity}
                onChange={handleChange}
                className="form-control"
                placeholder="Los Angeles"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: '1' }}>
                <label>Buyer's State</label>
                <input
                  type="text"
                  name="buyerState"
                  value={formData.buyerState}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="CA"
                />
              </div>
              
              <div className="form-group" style={{ flex: '1' }}>
                <label>Buyer's ZIP Code</label>
                <input
                  type="text"
                  name="buyerZip"
                  value={formData.buyerZip}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="90001"
                />
              </div>
            </div>
            
            <h3>Company Information</h3>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="form-control"
                placeholder="Example LLC"
              />
            </div>
            
            <div className="form-group">
              <label>State of Formation</label>
              <input
                type="text"
                name="companyState_Formation"
                value={formData.companyState_Formation}
                onChange={handleChange}
                className="form-control"
                placeholder="Delaware"
              />
              <div className="form-help">The state where the LLC was formed/organized.</div>
            </div>
            
            <div className="form-group">
              <label>Company's Address</label>
              <input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                className="form-control"
                placeholder="789 Business Blvd."
              />
            </div>
            
            <div className="form-group">
              <label>Company's City</label>
              <input
                type="text"
                name="companyCity"
                value={formData.companyCity}
                onChange={handleChange}
                className="form-control"
                placeholder="Chicago"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: '1' }}>
                <label>Company's State</label>
                <input
                  type="text"
                  name="companyState"
                  value={formData.companyState}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="IL"
                />
              </div>
              
              <div className="form-group" style={{ flex: '1' }}>
                <label>Company's ZIP Code</label>
                <input
                  type="text"
                  name="companyZip"
                  value={formData.companyZip}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="60601"
                />
              </div>
            </div>
          </div>
        );
        
      case 1: // Transaction Details
        return (
          <div className="form-section">
            <h2>Transaction Details</h2>
            
            <div className="form-group">
              <label>Type of Interest Being Sold</label>
              <select
                name="interestType"
                value={formData.interestType}
                onChange={handleChange}
                className="form-control"
              >
                <option value="percentage">Percentage Interest</option>
                <option value="units">Membership Units</option>
              </select>
              <div className="form-help">Choose whether the sale is based on a percentage of membership interest or a specific number of units.</div>
            </div>
            
            {formData.interestType === 'percentage' ? (
              <div className="form-group">
                <label>Percentage of Membership Interest (%)</label>
                <input
                  type="text"
                  name="interestAmount"
                  value={formData.interestAmount}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="25"
                />
                <div className="form-help">Enter the percentage of membership interest being sold (e.g., 25 for 25%).</div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: '1' }}>
                  <label>Number of Units Being Sold</label>
                  <input
                    type="text"
                    name="membershipUnits"
                    value={formData.membershipUnits}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="250"
                  />
                </div>
                
                <div className="form-group" style={{ flex: '1' }}>
                  <label>Total Units in Company</label>
                  <input
                    type="text"
                    name="totalUnits"
                    value={formData.totalUnits}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="1000"
                  />
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label>Purchase Price ($)</label>
              <input
                type="text"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="form-control"
                placeholder="50000"
              />
              <div className="form-help">Enter the total purchase price without commas or $ sign (e.g., 50000).</div>
            </div>
            
            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="form-control"
              >
                <option value="full">Full Payment at Closing</option>
                <option value="deposit">Deposit + Balance at Closing</option>
                <option value="installments">Installment Payments</option>
              </select>
            </div>
            
            {formData.paymentMethod === 'deposit' && (
              <>
                <div className="form-group">
                  <label>Deposit Amount ($)</label>
                  <input
                    type="text"
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="10000"
                  />
                </div>
                
                <div className="form-group">
                  <label>Deposit Due Date</label>
                  <input
                    type="date"
                    name="depositDate"
                    value={formData.depositDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </>
            )}
            
            {formData.paymentMethod === 'installments' && (
              <>
                <div className="form-group">
                  <label>Initial Deposit Amount ($)</label>
                  <input
                    type="text"
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="10000"
                  />
                  <div className="form-help">Initial payment due at closing.</div>
                </div>
                
                <div className="form-group">
                  <label>Installment Amount ($)</label>
                  <input
                    type="text"
                    name="installmentAmount"
                    value={formData.installmentAmount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="5000"
                  />
                </div>
                
                <div className="form-group">
                  <label>Installment Frequency</label>
                  <select
                    name="installmentFrequency"
                    value={formData.installmentFrequency}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annual">Semi-Annual</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Number of Installments</label>
                  <input
                    type="text"
                    name="installmentCount"
                    value={formData.installmentCount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="12"
                  />
                </div>
                
                <div className="form-group">
                  <label>Interest Rate (%)</label>
                  <input
                    type="text"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="5"
                  />
                  <div className="form-help">Annual interest rate on the unpaid balance.</div>
                </div>
              </>
            )}
          </div>
        );
        
      case 2: // Representations & Warranties
        return (
          <div className="form-section">
            <h2>Representations & Warranties</h2>
            
            <h3>Seller Representations</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="sellerOwnership"
                id="sellerOwnership"
                checked={formData.sellerOwnership}
                onChange={handleChange}
              />
              <label htmlFor="sellerOwnership">Seller is the sole legal and beneficial owner of the Purchased Interests</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="noEncumbrances"
                id="noEncumbrances"
                checked={formData.noEncumbrances}
                onChange={handleChange}
              />
              <label htmlFor="noEncumbrances">No liens, security interests, or other encumbrances on the Purchased Interests</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="authorityToSell"
                id="authorityToSell"
                checked={formData.authorityToSell}
                onChange={handleChange}
              />
              <label htmlFor="authorityToSell">Seller has full power and authority to execute this Agreement</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="companyGoodStanding"
                id="companyGoodStanding"
                checked={formData.companyGoodStanding}
                onChange={handleChange}
              />
              <label htmlFor="companyGoodStanding">Company is duly organized, validly existing, and in good standing</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="noLitigation"
                id="noLitigation"
                checked={formData.noLitigation}
                onChange={handleChange}
              />
              <label htmlFor="noLitigation">No litigation or proceedings affecting the Purchased Interests</label>
            </div>
            
            <h3>Additional Disclosures</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="financialStatementsProvided"
                id="financialStatementsProvided"
                checked={formData.financialStatementsProvided}
                onChange={handleChange}
              />
              <label htmlFor="financialStatementsProvided">Seller has provided financial statements of the Company</label>
            </div>
            
            {formData.financialStatementsProvided && (
              <div className="form-group">
                <label>Date of Financial Statements</label>
                <input
                  type="date"
                  name="financialStatementsDate"
                  value={formData.financialStatementsDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            )}
            
            <div className="form-check">
              <input
                type="checkbox"
                name="taxReturnsProvided"
                id="taxReturnsProvided"
                checked={formData.taxReturnsProvided}
                onChange={handleChange}
              />
              <label htmlFor="taxReturnsProvided">Seller has provided tax returns of the Company</label>
            </div>
            
            {formData.taxReturnsProvided && (
              <div className="form-group">
                <label>Tax Return Years Provided</label>
                <input
                  type="text"
                  name="taxReturnsYears"
                  value={formData.taxReturnsYears}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="2022, 2023, 2024"
                />
              </div>
            )}
            
            <div className="form-check">
              <input
                type="checkbox"
                name="operatingAgreementProvided"
                id="operatingAgreementProvided"
                checked={formData.operatingAgreementProvided}
                onChange={handleChange}
              />
              <label htmlFor="operatingAgreementProvided">Seller has provided a copy of the Operating Agreement</label>
            </div>
            
            <div className="form-group">
              <label>Custom Representations and Warranties</label>
              <textarea
                name="customRepresentations"
                value={formData.customRepresentations}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter any additional representations and warranties..."
              ></textarea>
              <div className="form-help">Additional specific representations and warranties not covered above.</div>
            </div>
          </div>
        );
        
      case 3: // Closing & Payment
        return (
          <div className="form-section">
            <h2>Closing & Payment</h2>
            
            <div className="form-group">
              <label>Closing Date</label>
              <input
                type="date"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleChange}
                className="form-control"
              />
              <div className="form-help">The date when the transaction will be completed.</div>
            </div>
            
            <div className="form-group">
              <label>Closing Location</label>
              <select
                name="closingLocation"
                value={formData.closingLocation}
                onChange={handleChange}
                className="form-control"
              >
                <option value="mutual">Mutually Agreed Location</option>
                <option value="seller">Seller's Office</option>
                <option value="buyer">Buyer's Office</option>
                <option value="company">Company's Office</option>
                <option value="remote">Remote/Electronic Closing</option>
                <option value="custom">Custom Location</option>
              </select>
            </div>
            
            {formData.closingLocation === 'custom' && (
              <div className="form-group">
                <label>Specify Custom Closing Location</label>
                <input
                  type="text"
                  name="customClosingLocation"
                  value={formData.customClosingLocation}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Law offices of Smith & Associates, 123 Legal Ave, Suite 400, Boston, MA"
                />
              </div>
            )}
            
            <h3>Deliverables at Closing</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="deliverables"
                id="deliverables"
                checked={formData.deliverables}
                onChange={handleChange}
              />
              <label htmlFor="deliverables">Include list of deliverables at closing</label>
            </div>
            
            {formData.deliverables && (
              <>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="membershipCertificate"
                    id="membershipCertificate"
                    checked={formData.membershipCertificate}
                    onChange={handleChange}
                  />
                  <label htmlFor="membershipCertificate">Membership certificate(s)</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="assignmentDocument"
                    id="assignmentDocument"
                    checked={formData.assignmentDocument}
                    onChange={handleChange}
                  />
                  <label htmlFor="assignmentDocument">Assignment of membership interests</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="resignationLetters"
                    id="resignationLetters"
                    checked={formData.resignationLetters}
                    onChange={handleChange}
                  />
                  <label htmlFor="resignationLetters">Resignation letter(s) from any position in the Company</label>
                </div>
                
                <div className="form-group">
                  <label>Custom Deliverables</label>
                  <textarea
                    name="customDeliverables"
                    value={formData.customDeliverables}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter any additional deliverables..."
                  ></textarea>
                </div>
              </>
            )}
          </div>
        );
        
      case 4: // Additional Provisions
        return (
          <div className="form-section">
            <h2>Additional Provisions</h2>
            
            <h3>Non-Competition</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="nonCompete"
                id="nonCompete"
                checked={formData.nonCompete}
                onChange={handleChange}
              />
              <label htmlFor="nonCompete">Include non-compete provision</label>
            </div>
            
            {formData.nonCompete && (
              <>
                <div className="form-group">
                  <label>Non-Compete Duration</label>
                  <input
                    type="text"
                    name="nonCompeteDuration"
                    value={formData.nonCompeteDuration}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="2 years"
                  />
                </div>
                
                <div className="form-group">
                  <label>Non-Compete Geographic Scope</label>
                  <input
                    type="text"
                    name="nonCompeteGeographic"
                    value={formData.nonCompeteGeographic}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="within a 50-mile radius of the Company's principal place of business"
                  />
                </div>
              </>
            )}
            
            <h3>Confidentiality</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="confidentiality"
                id="confidentiality"
                checked={formData.confidentiality}
                onChange={handleChange}
              />
              <label htmlFor="confidentiality">Include confidentiality provision</label>
            </div>
            
            {formData.confidentiality && (
              <div className="form-group">
                <label>Confidentiality Term</label>
                <input
                  type="text"
                  name="confidentialityTerm"
                  value={formData.confidentialityTerm}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="3 years"
                />
              </div>
            )}
            
            <h3>Transition Support</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="transitionSupport"
                id="transitionSupport"
                checked={formData.transitionSupport}
                onChange={handleChange}
              />
              <label htmlFor="transitionSupport">Include transition support provision</label>
            </div>
            
            {formData.transitionSupport && (
              <div className="form-group">
                <label>Transition Support Details</label>
                <textarea
                  name="transitionSupportDetails"
                  value={formData.transitionSupportDetails}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Specify the transition support details..."
                ></textarea>
                <div className="form-help">Describe the transition support the Seller will provide, including duration, scope, and compensation if applicable.</div>
              </div>
            )}
            
            <h3>Rights Provisions</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="tagAlongRights"
                id="tagAlongRights"
                checked={formData.tagAlongRights}
                onChange={handleChange}
              />
              <label htmlFor="tagAlongRights">Include tag-along rights</label>
              <div className="form-help">Allows Seller to participate in a future sale by the Buyer.</div>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="dragAlongRights"
                id="dragAlongRights"
                checked={formData.dragAlongRights}
                onChange={handleChange}
              />
              <label htmlFor="dragAlongRights">Include drag-along rights</label>
              <div className="form-help">Allows Buyer to force Seller to participate in a future sale.</div>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="rightOfFirstRefusal"
                id="rightOfFirstRefusal"
                checked={formData.rightOfFirstRefusal}
                onChange={handleChange}
              />
              <label htmlFor="rightOfFirstRefusal">Include right of first refusal</label>
              <div className="form-help">Gives Buyer the right to purchase Seller's remaining interest before offering to others.</div>
            </div>
            
            <div className="form-group">
              <label>Custom Additional Provisions</label>
              <textarea
                name="customProvisions"
                value={formData.customProvisions}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter any additional provisions..."
              ></textarea>
            </div>
          </div>
        );
        
      case 5: // Miscellaneous
        return (
          <div className="form-section">
            <h2>Miscellaneous Provisions</h2>
            
            <div className="form-group">
              <label>Governing Law (State)</label>
              <input
                type="text"
                name="governingLaw"
                value={formData.governingLaw}
                onChange={handleChange}
                className="form-control"
                placeholder="California"
              />
              <div className="form-help">The state whose laws will govern this agreement.</div>
            </div>
            
            <div className="form-group">
              <label>Dispute Resolution</label>
              <select
                name="disputeResolution"
                value={formData.disputeResolution}
                onChange={handleChange}
                className="form-control"
              >
                <option value="litigation">Litigation (Court)</option>
                <option value="arbitration">Arbitration</option>
              </select>
            </div>
            
            {formData.disputeResolution === 'arbitration' && (
              <>
                <div className="form-group">
                  <label>Arbitration Location</label>
                  <input
                    type="text"
                    name="arbitrationLocation"
                    value={formData.arbitrationLocation}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Los Angeles, California"
                  />
                </div>
                
                <div className="form-group">
                  <label>Arbitration Rules</label>
                  <input
                    type="text"
                    name="arbitrationRules"
                    value={formData.arbitrationRules}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="American Arbitration Association"
                  />
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="mediationRequired"
                    id="mediationRequired"
                    checked={formData.mediationRequired}
                    onChange={handleChange}
                  />
                  <label htmlFor="mediationRequired">Require mediation before arbitration</label>
                </div>
              </>
            )}
            
            <div className="form-group">
              <label>Attorney's Fees</label>
              <select
                name="attorneyFees"
                value={formData.attorneyFees}
                onChange={handleChange}
                className="form-control"
              >
                <option value="prevailing">Prevailing Party</option>
                <option value="each">Each Party Bears Their Own</option>
                <option value="court">As Determined by Court/Arbitrator</option>
              </select>
              <div className="form-help">Determines who pays attorney's fees in case of a dispute.</div>
            </div>
            
            <h3>Standard Provisions</h3>
            <div className="form-check">
              <input
                type="checkbox"
                name="notices"
                id="notices"
                checked={formData.notices}
                onChange={handleChange}
              />
              <label htmlFor="notices">Include notices provision</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="amendments"
                id="amendments"
                checked={formData.amendments}
                onChange={handleChange}
              />
              <label htmlFor="amendments">Include amendments provision</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="entireAgreement"
                id="entireAgreement"
                checked={formData.entireAgreement}
                onChange={handleChange}
              />
              <label htmlFor="entireAgreement">Include entire agreement provision</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="severability"
                id="severability"
                checked={formData.severability}
                onChange={handleChange}
              />
              <label htmlFor="severability">Include severability provision</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="waiver"
                id="waiver"
                checked={formData.waiver}
                onChange={handleChange}
              />
              <label htmlFor="waiver">Include waiver provision</label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="survival"
                id="survival"
                checked={formData.survival}
                onChange={handleChange}
              />
              <label htmlFor="survival">Include survival provision</label>
            </div>
            
            <div className="form-group">
              <label>Custom Miscellaneous Provisions</label>
              <textarea
                name="customMiscellaneous"
                value={formData.customMiscellaneous}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter any additional miscellaneous provisions..."
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>File Name for Download</label>
              <input
                type="text"
                name="fileName"
                value={formData.fileName}
                onChange={handleChange}
                className="form-control"
                placeholder="LLC-Interest-Purchase-Agreement"
              />
              <div className="form-help">Name of the file when downloaded as Word document.</div>
            </div>
          </div>
        );
        
      case 6: // Finalize & Review
        return (
          <div className="form-section">
            <h2>Finalize & Review</h2>
            
            <p>Please review your LLC Interest Purchase Agreement. Check for accuracy and completeness in all sections.</p>
            
            <div className="risk-assessment">
              <h3>Agreement Risk Assessment</h3>
              
              {getRiskAssessment().map((risk, index) => (
                <div className={`risk-card ${risk.level}`} key={index}>
                  <h3>{risk.title}</h3>
                  <p>{risk.description}</p>
                  <p className="recommendation"><strong>Recommendation:</strong> {risk.recommendation}</p>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Document Actions</h3>
              <p>Use these buttons to download or copy your agreement:</p>
              
              <div className="action-group" style={{ marginTop: '1rem' }}>
                <button
                  onClick={copyToClipboard}
                  className="action-button copy-button"
                >
                  <Icon name="copy" /> Copy to Clipboard
                </button>
                
                <button
                  onClick={downloadAsWord}
                  className="action-button download-button"
                >
                  <Icon name="file-text" /> Download MS Word
                </button>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <h3>Legal Disclaimer</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                This document generator provides a template for an LLC Interest Purchase Agreement. It is not a substitute for legal advice. 
                Every business situation is unique, and you should consult with a qualified attorney before finalizing and executing any legal document.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>LLC Interest Purchase Agreement Generator</h1>
        <p>Create a customized agreement for buying or selling LLC membership interests</p>
      </div>
      
      <div className="generator-container">
        <div className="tab-navigation">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-button ${currentTab === index ? 'active' : ''}`}
              onClick={() => goToTab(index)}
            >
              {index + 1}. {tab.label}
            </button>
          ))}
        </div>
        
        <div className="generator-content">
          {renderTabContent()}
          
          <div className="preview-panel" ref={previewRef}>
            <div className="preview-content">
              <h2>Live Preview</h2>
              <pre 
                className="document-preview"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>
          </div>
        </div>
        
        <div className="navigation-buttons">
          <button
            onClick={prevTab}
            className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
            disabled={currentTab === 0}
          >
            <Icon name="chevron-left" /> Previous
          </button>
          
          <div className="action-group" style={{ display: 'flex', gap: '8px', margin: '0 auto' }}>
            <button
              onClick={copyToClipboard}
              className="nav-button"
              style={{
                backgroundColor: "#4f46e5", 
                color: "white",
                border: "none"
              }}
            >
              <Icon name="copy" /> Copy
            </button>
            
            <button
              onClick={downloadAsWord}
              className="nav-button"
              style={{
                backgroundColor: "#2563eb", 
                color: "white",
                border: "none"
              }}
            >
              <Icon name="file-text" /> Download Word
            </button>
            
            <button
              onClick={() => window.Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'})}
              className="nav-button"
              style={{
                backgroundColor: "#059669", 
                color: "white",
                border: "none"
              }}
            >
              <Icon name="calendar" /> Consult
            </button>
          </div>
          
          <button
            onClick={nextTab}
            className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
            disabled={currentTab === tabs.length - 1}
          >
            Next <Icon name="chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Render the App component
ReactDOM.render(<App />, document.getElementById('root'));