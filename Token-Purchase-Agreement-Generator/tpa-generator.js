// Token Purchase Agreement Generator

const { useState, useEffect, useRef } = React;

const TokenPurchaseAgreementGenerator = () => {
  // State for form data
  const [formData, setFormData] = useState({
    // Parties & Basic Terms
    seller_name: "",
    seller_entity_type: "Corporation",
    seller_jurisdiction: "",
    seller_address: "",
    buyer_name: "",
    buyer_entity_type: "Individual",
    buyer_jurisdiction: "",
    buyer_address: "",
    effective_date: "",
    
    // Token Details
    token_name: "",
    token_symbol: "",
    token_type: "utility",
    token_network: "Ethereum",
    token_smart_contract: "",
    token_total_supply: "",
    token_description: "",
    governance_rights: "no",
    
    // Purchase Specifics
    token_price_type: "fixed",
    token_price: "",
    token_amount: "",
    purchase_currency: "USD",
    crypto_payment: "no",
    crypto_payment_type: "BTC",
    discount_rate: "0",
    payment_deadline: "",
    
    // Representations & Warranties
    buyer_accredited: "yes",
    seller_ownership: "yes",
    compliance_laws: "yes",
    
    // Covenants & Conditions
    token_use_restriction: "no",
    lock_up_period: "0",
    vesting_schedule: "no",
    vesting_period: "",
    vesting_cliff: "",
    
    // Closing Terms
    closing_conditions: [],
    termination_rights: [],
    governing_law: "",
    dispute_resolution: "litigation",
    arbitration_venue: ""
  });
  
  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State to track what was last changed for highlighting
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
  // Function to generate document text based on form data
  const generateDocumentText = () => {
    let document = `TOKEN PURCHASE AGREEMENT

This Token Purchase Agreement (the "Agreement") is made and entered into as of ${formData.effective_date || "[Date]"} (the "Effective Date") by and between:

${formData.seller_name || "[Seller Name]"}, a ${formData.seller_entity_type || "[Entity Type]"} organized under the laws of ${formData.seller_jurisdiction || "[Jurisdiction]"}, with its principal place of business at ${formData.seller_address || "[Address]"} (the "Seller"),

and

${formData.buyer_name || "[Buyer Name]"}, a ${formData.buyer_entity_type || "[Entity Type]"} ${formData.buyer_entity_type !== "Individual" ? `organized under the laws of ${formData.buyer_jurisdiction || "[Jurisdiction]"}` : ""}, ${formData.buyer_entity_type !== "Individual" ? `with its principal place of business at` : `with an address at`} ${formData.buyer_address || "[Address]"} (the "Buyer").

Seller and Buyer may each be referred to as a "Party" and collectively as the "Parties."

RECITALS

WHEREAS, the Seller is developing a blockchain-based token known as ${formData.token_name || "[Token Name]"} (the "${formData.token_symbol || "TOKEN"}") on the ${formData.token_network || "Ethereum"} blockchain;

WHEREAS, the Buyer wishes to purchase certain ${formData.token_symbol || "TOKEN"} tokens from the Seller, and the Seller wishes to sell such tokens to the Buyer, subject to the terms and conditions of this Agreement;

NOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth and for other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the Parties agree as follows:

1. DEFINITIONS

1.1 "Blockchain" means the ${formData.token_network || "Ethereum"} blockchain.

1.2 "${formData.token_symbol || "TOKEN"}" means the digital tokens created by Seller on the Blockchain with the symbol "${formData.token_symbol || "TOKEN"}" and the characteristics described in Section 2.

1.3 "Smart Contract" means the smart contract deployed at address ${formData.token_smart_contract || "[Contract Address]"} on the Blockchain.

1.4 "Purchase Price" means the amount set forth in Section 3 to be paid by Buyer to Seller for the purchase of the Tokens.

1.5 "Securities Act" means the Securities Act of 1933, as amended.

1.6 "Transfer" means to sell, assign, transfer, pledge, hypothecate or otherwise dispose of, whether voluntarily or by operation of law.

2. TOKEN CHARACTERISTICS

2.1 Token Description. The ${formData.token_symbol || "TOKEN"} token is a ${formData.token_type || "utility"} token that ${formData.token_description || "provides holders with access to the network and its associated services"}.

2.2 Total Supply. The total supply of ${formData.token_symbol || "TOKEN"} tokens will be ${formData.token_total_supply || "[Number]"}.

2.3 Governance Rights. ${formData.governance_rights === "yes" ? 
`The ${formData.token_symbol || "TOKEN"} tokens provide the holder with certain governance rights within the network, including the right to vote on proposals and protocol changes proportional to the holder's token balance.` : 
`The ${formData.token_symbol || "TOKEN"} tokens do not provide the holder with any governance rights, voting rights, or rights to dividends.`}

3. PURCHASE AND SALE OF TOKENS

3.1 Purchase and Sale. Subject to the terms and conditions of this Agreement, Seller agrees to sell to Buyer, and Buyer agrees to purchase from Seller, ${formData.token_amount || "[Number]"} ${formData.token_symbol || "TOKEN"} tokens.

3.2 Purchase Price. The purchase price for the Tokens shall be ${(() => {
  if (formData.token_price_type === "fixed") {
    return `${formData.token_price || "[Amount]"} ${formData.purchase_currency || "USD"} per Token, for a total of ${formData.token_price && formData.token_amount ? (parseFloat(formData.token_price) * parseFloat(formData.token_amount)).toFixed(2) : "[Total Amount]"} ${formData.purchase_currency || "USD"}`;
  } else if (formData.token_price_type === "tiered") {
    return `determined according to the tiered pricing schedule set forth in Schedule A, for a total of ${formData.token_price && formData.token_amount ? (parseFloat(formData.token_price) * parseFloat(formData.token_amount)).toFixed(2) : "[Total Amount]"} ${formData.purchase_currency || "USD"}`;
  } else {
    return `${formData.token_price || "[Amount]"} ${formData.purchase_currency || "USD"} per Token, with a discount of ${formData.discount_rate || "0"}%, for a total of ${formData.token_price && formData.token_amount && formData.discount_rate ? (parseFloat(formData.token_price) * parseFloat(formData.token_amount) * (1 - parseFloat(formData.discount_rate) / 100)).toFixed(2) : "[Total Amount]"} ${formData.purchase_currency || "USD"}`;
  }
})()}.

3.3 Payment. ${formData.crypto_payment === "yes" ? 
`Buyer shall pay the Purchase Price in ${formData.crypto_payment_type || "BTC"} to Seller's crypto wallet address as provided separately by Seller.` : 
`Buyer shall pay the Purchase Price in ${formData.purchase_currency || "USD"} to Seller's designated bank account as provided separately by Seller.`}

3.4 Payment Deadline. Buyer shall pay the Purchase Price in full on or before ${formData.payment_deadline || "[Deadline Date]"}.

3.5 Token Delivery. Within [Number] business days after Seller's receipt of the Purchase Price, Seller shall deliver the Tokens to Buyer's wallet address as provided by Buyer: [Buyer's Wallet Address].

4. REPRESENTATIONS AND WARRANTIES OF SELLER

4.1 Organization and Authority. Seller is duly organized, validly existing, and in good standing under the laws of ${formData.seller_jurisdiction || "[Jurisdiction]"} and has all requisite power and authority to carry on its business and to execute, deliver, and perform its obligations under this Agreement.

4.2 Authorization. The execution, delivery, and performance of this Agreement by Seller has been duly authorized by all necessary corporate action and does not conflict with any agreement, instrument, or understanding to which Seller is a party or by which it is bound.

4.3 Token Ownership. ${formData.seller_ownership === "yes" ? 
`Seller has good and marketable title to the Tokens, free and clear of any liens, claims, or encumbrances.` : 
`Seller represents that it will have good and marketable title to the Tokens upon their creation, free and clear of any liens, claims, or encumbrances.`}

4.4 Compliance with Laws. ${formData.compliance_laws === "yes" ? 
`The execution, delivery, and performance of this Agreement by Seller and the issuance and sale of the Tokens complies with all applicable laws, rules, and regulations.` : 
`Seller has taken reasonable steps to ensure that the execution, delivery, and performance of this Agreement and the issuance and sale of the Tokens complies with all applicable laws, rules, and regulations, but cannot guarantee complete compliance with all jurisdictions' laws.`}

5. REPRESENTATIONS AND WARRANTIES OF BUYER

5.1 Organization and Authority. ${formData.buyer_entity_type !== "Individual" ? 
`Buyer is duly organized, validly existing, and in good standing under the laws of ${formData.buyer_jurisdiction || "[Jurisdiction]"} and has all requisite power and authority to carry on its business and to execute, deliver, and perform its obligations under this Agreement.` : 
`Buyer has all requisite capacity and authority to execute, deliver, and perform its obligations under this Agreement.`}

5.2 Authorization. The execution, delivery, and performance of this Agreement by Buyer has been duly authorized by all necessary action and does not conflict with any agreement, instrument, or understanding to which Buyer is a party or by which it is bound.

5.3 Accredited Investor Status. ${formData.buyer_accredited === "yes" ? 
`Buyer is an "accredited investor" as that term is defined in Rule 501(a) of Regulation D promulgated under the Securities Act.` : 
`Buyer may not qualify as an "accredited investor" as that term is defined in Rule 501(a) of Regulation D promulgated under the Securities Act, and acknowledges the increased risks associated with this investment.`}

5.4 Investment Purpose. Buyer is acquiring the Tokens for its own account and for investment purposes only, and not with a view to, or for resale in connection with, any distribution thereof within the meaning of the Securities Act.

5.5 Knowledge and Risks. Buyer has sufficient knowledge, experience, and expertise in financial and business matters, blockchain technology, cryptographic tokens, and other digital assets, and is capable of evaluating the merits and risks of entering into this Agreement and purchasing the Tokens.

6. RESTRICTIONS ON TRANSFER

6.1 Transfer Restrictions. ${formData.token_use_restriction === "yes" ? 
`Buyer shall not Transfer any of the Tokens except in compliance with this Agreement and applicable securities laws.` : 
`Buyer may Transfer the Tokens without restriction, provided such Transfer complies with applicable securities laws.`}

6.2 Lock-Up Period. ${formData.lock_up_period && parseInt(formData.lock_up_period) > 0 ? 
`Buyer shall not Transfer any of the Tokens for a period of ${formData.lock_up_period || "[Number]"} months following the delivery of Tokens to Buyer (the "Lock-Up Period").` : 
`There is no lock-up period restricting the Transfer of Tokens by Buyer.`}

6.3 Vesting Schedule. ${formData.vesting_schedule === "yes" ? 
`The Tokens shall vest to Buyer according to the following schedule: ${formData.vesting_period || "[Period]"} with a cliff of ${formData.vesting_cliff || "[Cliff Period]"}.` : 
`The Tokens shall be fully vested upon delivery to Buyer.`}

7. CONDITIONS TO CLOSING

7.1 Conditions to Obligations of Seller. The obligation of Seller to sell and deliver the Tokens to Buyer at Closing is subject to the fulfillment, prior to or at Closing, of each of the following conditions:
${formData.closing_conditions && formData.closing_conditions.length > 0 ? 
formData.closing_conditions.map((condition, index) => `\n   (a) ${condition}`).join('') : 
`\n   (a) Buyer shall have performed and complied with all agreements and conditions required by this Agreement to be performed or complied with by it prior to or at Closing.\n   (b) Buyer shall have paid the Purchase Price in full.`}

7.2 Conditions to Obligations of Buyer. The obligation of Buyer to purchase the Tokens and to pay the Purchase Price at Closing is subject to the fulfillment, prior to or at Closing, of each of the following conditions:
   (a) Seller shall have performed and complied with all agreements and conditions required by this Agreement to be performed or complied with by it prior to or at Closing.
   (b) The representations and warranties made by Seller in this Agreement shall be true and correct in all material respects as of the Closing.

8. TERMINATION

8.1 Termination Events. This Agreement may be terminated at any time prior to Closing:
   (a) By mutual written consent of Seller and Buyer;
   (b) By either Party if the Closing has not occurred by [Outside Date], provided that the Party seeking termination is not in breach of this Agreement;
${formData.termination_rights && formData.termination_rights.length > 0 ? 
formData.termination_rights.map((right, index) => `\n   (${String.fromCharCode(99 + index)}) ${right}`).join('') : ''}

8.2 Effect of Termination. In the event of termination of this Agreement pursuant to Section 8.1, this Agreement shall become void and of no effect, and there shall be no liability on the part of either Party, except that nothing herein shall relieve either Party from liability for any intentional breach of this Agreement prior to such termination.

9. MISCELLANEOUS

9.1 Notices. All notices and other communications hereunder shall be in writing and shall be deemed given if delivered personally or by commercial delivery service, or sent via email (with confirmation of receipt) to the Parties at the addresses provided by each Party to the other.

9.2 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of ${formData.governing_law || "[Jurisdiction]"} without giving effect to any choice or conflict of law provision or rule.

9.3 Dispute Resolution. ${formData.dispute_resolution === "arbitration" ? 
`Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by [Arbitration Body] in accordance with its rules. The seat of arbitration shall be ${formData.arbitration_venue || "[Venue]"}. The number of arbitrators shall be [Number]. The language of the arbitration shall be English.` : 
`Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of ${formData.governing_law || "[Jurisdiction]"}.`}

9.4 Entire Agreement. This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous understandings and agreements, whether written or oral.

9.5 Amendments. This Agreement may only be amended, modified, or supplemented by an agreement in writing signed by each Party hereto.

9.6 Successors and Assigns. This Agreement shall be binding upon and shall inure to the benefit of the Parties hereto and their respective successors and permitted assigns.

9.7 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall be deemed to be one and the same agreement.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

SELLER:
${formData.seller_name || "[Seller Name]"}

By: ____________________________
Name: _________________________
Title: __________________________

BUYER:
${formData.buyer_name || "[Buyer Name]"}

By: ____________________________
Name: _________________________
Title: __________________________`;

    return document;
  };
  
  // State for document text
  const [documentText, setDocumentText] = useState('');
  
  // Update document text when form data changes
  useEffect(() => {
    setDocumentText(generateDocumentText());
  }, [formData]);
  
  // Handle input changes
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
  
  // Function to determine which section to highlight based on the field that was last changed
  const getSectionToHighlight = () => {
    // Map form fields to document sections for highlighting
    const fieldToSectionMap = {
      // Parties & Basic Terms - Section 1
      seller_name: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      seller_entity_type: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      seller_jurisdiction: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      seller_address: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      buyer_name: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      buyer_entity_type: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      buyer_jurisdiction: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      buyer_address: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      effective_date: /This Token Purchase Agreement.*?NOW, THEREFORE/s,
      
      // Token Details - Section 2
      token_name: /WHEREAS, the Seller is developing.*?2\. TOKEN CHARACTERISTICS|2\.1 Token Description/s,
      token_symbol: /WHEREAS, the Seller is developing.*?2\. TOKEN CHARACTERISTICS|2\.1 Token Description/s,
      token_type: /2\. TOKEN CHARACTERISTICS.*?3\. PURCHASE AND SALE OF TOKENS/s,
      token_network: /1\. DEFINITIONS.*?2\. TOKEN CHARACTERISTICS/s,
      token_smart_contract: /1\. DEFINITIONS.*?2\. TOKEN CHARACTERISTICS/s,
      token_total_supply: /2\. TOKEN CHARACTERISTICS.*?3\. PURCHASE AND SALE OF TOKENS/s,
      token_description: /2\. TOKEN CHARACTERISTICS.*?3\. PURCHASE AND SALE OF TOKENS/s,
      governance_rights: /2\.3 Governance Rights.*?3\. PURCHASE AND SALE OF TOKENS/s,
      
      // Purchase Specifics - Section 3
      token_price_type: /3\. PURCHASE AND SALE OF TOKENS.*?4\. REPRESENTATIONS AND WARRANTIES OF SELLER/s,
      token_price: /3\. PURCHASE AND SALE OF TOKENS.*?4\. REPRESENTATIONS AND WARRANTIES OF SELLER/s,
      token_amount: /3\. PURCHASE AND SALE OF TOKENS.*?4\. REPRESENTATIONS AND WARRANTIES OF SELLER/s,
      purchase_currency: /3\. PURCHASE AND SALE OF TOKENS.*?4\. REPRESENTATIONS AND WARRANTIES OF SELLER/s,
      crypto_payment: /3\.3 Payment.*?3\.4 Payment Deadline/s,
      crypto_payment_type: /3\.3 Payment.*?3\.4 Payment Deadline/s,
      discount_rate: /3\. PURCHASE AND SALE OF TOKENS.*?4\. REPRESENTATIONS AND WARRANTIES OF SELLER/s,
      payment_deadline: /3\.4 Payment Deadline.*?3\.5 Token Delivery/s,
      
      // Representations & Warranties - Sections 4 & 5
      seller_ownership: /4\.3 Token Ownership.*?4\.4 Compliance with Laws/s,
      compliance_laws: /4\.4 Compliance with Laws.*?5\. REPRESENTATIONS AND WARRANTIES OF BUYER/s,
      buyer_accredited: /5\.3 Accredited Investor Status.*?5\.4 Investment Purpose/s,
      
      // Covenants & Conditions - Section 6
      token_use_restriction: /6\.1 Transfer Restrictions.*?6\.2 Lock-Up Period/s,
      lock_up_period: /6\.2 Lock-Up Period.*?6\.3 Vesting Schedule/s,
      vesting_schedule: /6\.3 Vesting Schedule.*?7\. CONDITIONS TO CLOSING/s,
      vesting_period: /6\.3 Vesting Schedule.*?7\. CONDITIONS TO CLOSING/s,
      vesting_cliff: /6\.3 Vesting Schedule.*?7\. CONDITIONS TO CLOSING/s,
      
      // Closing Terms - Sections 7-9
      closing_conditions: /7\. CONDITIONS TO CLOSING.*?8\. TERMINATION/s,
      termination_rights: /8\. TERMINATION.*?9\. MISCELLANEOUS/s,
      governing_law: /9\.2 Governing Law.*?9\.3 Dispute Resolution/s,
      dispute_resolution: /9\.3 Dispute Resolution.*?9\.4 Entire Agreement/s,
      arbitration_venue: /9\.3 Dispute Resolution.*?9\.4 Entire Agreement/s,
    };
    
    return lastChanged ? fieldToSectionMap[lastChanged] : null;
  };
  
  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight || !lastChanged) return documentText;
    
    try {
      // Find the match for this section pattern
      const match = documentText.match(sectionToHighlight);
      if (match && match[0]) {
        // Create a safe string for use in regex replacement
        const safeMatchString = match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Create a new document with the matched section wrapped in a span
        return documentText.replace(
          new RegExp(safeMatchString, 'g'),
          `<span class="highlighted-text">${match[0]}</span>`
        );
      }
    } catch (e) {
      console.error("Error highlighting text:", e);
    }
    
    return documentText;
  };
  
  // Create highlightable content
  const highlightedText = createHighlightedText();
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current && lastChanged) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText, lastChanged]);
  
  // Effect for iframe communication
  useEffect(() => {
    // Send height to parent if in iframe
    if (window.self !== window.top) {
      const sendHeight = () => {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'resize', height }, '*');
      };
      
      // Send initial height
      sendHeight();
      
      // Send height on resize
      window.addEventListener('resize', sendHeight);
      
      return () => window.removeEventListener('resize', sendHeight);
    }
  }, []);
  
  // Tab configuration
  const tabs = [
    { id: 'tab1', label: 'Parties & Basic Terms' },
    { id: 'tab2', label: 'Token Details' },
    { id: 'tab3', label: 'Purchase Specifics' },
    { id: 'tab4', label: 'Representations & Warranties' },
    { id: 'tab5', label: 'Covenants & Conditions' },
    { id: 'tab6', label: 'Closing Terms' },
  ];
  
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
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    window.copyToClipboard(documentText);
  };
  
  // Download as Word function
  const downloadAsWord = () => {
    try {
      console.log("Download MS Word button clicked");
      
      // Make sure document text is available
      if (!documentText) {
        console.error("Document text is empty");
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      // Call the document generation function
      window.generateWordDoc(documentText, {
        documentTitle: "Token Purchase Agreement",
        fileName: `Token-Purchase-Agreement-${formData.token_symbol || "TPA"}`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Info tooltip component
  const InfoTooltip = ({ content }) => (
    <span className="info-tooltip">
      <i data-feather="info" />
      <span className="tooltip-content">{content}</span>
    </span>
  );
  
  // Warning indicator component
  const WarningIndicator = ({ content }) => (
    <span className="warning-indicator" title={content}>
      <i data-feather="alert-triangle" />
    </span>
  );
  
  // Form components for each tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Parties & Basic Terms
        return (
          <div className="form-section">
            <h3>Seller Information</h3>
            <div className="form-group">
              <label htmlFor="seller_name">
                Seller Name / Company
                <InfoTooltip content="Enter the legal name of the entity selling the tokens." />
              </label>
              <input
                type="text"
                id="seller_name"
                name="seller_name"
                className="form-control"
                value={formData.seller_name}
                onChange={handleChange}
                placeholder="Acme Token Inc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="seller_entity_type">
                Seller Entity Type
                <InfoTooltip content="Select the legal structure of the token issuer." />
              </label>
              <select
                id="seller_entity_type"
                name="seller_entity_type"
                className="form-control"
                value={formData.seller_entity_type}
                onChange={handleChange}
              >
                <option value="Corporation">Corporation</option>
                <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                <option value="Partnership">Partnership</option>
                <option value="Foundation">Foundation</option>
                <option value="DAO">Decentralized Autonomous Organization (DAO)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="seller_jurisdiction">
                Seller Jurisdiction
                <InfoTooltip content="Enter the jurisdiction where the seller entity is registered (e.g., Delaware, Switzerland, Singapore)." />
              </label>
              <input
                type="text"
                id="seller_jurisdiction"
                name="seller_jurisdiction"
                className="form-control"
                value={formData.seller_jurisdiction}
                onChange={handleChange}
                placeholder="Delaware"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="seller_address">
                Seller Address
                <InfoTooltip content="Enter the registered address of the seller entity." />
              </label>
              <input
                type="text"
                id="seller_address"
                name="seller_address"
                className="form-control"
                value={formData.seller_address}
                onChange={handleChange}
                placeholder="123 Blockchain Ave, San Francisco, CA 94107"
              />
            </div>
            
            <h3>Buyer Information</h3>
            <div className="form-group">
              <label htmlFor="buyer_name">
                Buyer Name / Company
                <InfoTooltip content="Enter the legal name of the entity or individual purchasing the tokens." />
              </label>
              <input
                type="text"
                id="buyer_name"
                name="buyer_name"
                className="form-control"
                value={formData.buyer_name}
                onChange={handleChange}
                placeholder="John Smith or Investor LLC"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="buyer_entity_type">
                Buyer Entity Type
                <InfoTooltip content="Select the legal status of the token purchaser." />
              </label>
              <select
                id="buyer_entity_type"
                name="buyer_entity_type"
                className="form-control"
                value={formData.buyer_entity_type}
                onChange={handleChange}
              >
                <option value="Individual">Individual</option>
                <option value="Corporation">Corporation</option>
                <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                <option value="Partnership">Partnership</option>
                <option value="Investment Fund">Investment Fund</option>
                <option value="Foundation">Foundation</option>
              </select>
            </div>
            
            {formData.buyer_entity_type !== "Individual" && (
              <div className="form-group">
                <label htmlFor="buyer_jurisdiction">
                  Buyer Jurisdiction
                  <InfoTooltip content="Enter the jurisdiction where the buyer entity is registered." />
                </label>
                <input
                  type="text"
                  id="buyer_jurisdiction"
                  name="buyer_jurisdiction"
                  className="form-control"
                  value={formData.buyer_jurisdiction}
                  onChange={handleChange}
                  placeholder="New York"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="buyer_address">
                Buyer Address
                <InfoTooltip content="Enter the legal address of the buyer." />
              </label>
              <input
                type="text"
                id="buyer_address"
                name="buyer_address"
                className="form-control"
                value={formData.buyer_address}
                onChange={handleChange}
                placeholder="456 Crypto Street, New York, NY 10001"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="effective_date">
                Effective Date
                <InfoTooltip content="The date when this agreement becomes effective, typically the date of signing." />
              </label>
              <input
                type="date"
                id="effective_date"
                name="effective_date"
                className="form-control"
                value={formData.effective_date}
                onChange={handleChange}
              />
            </div>
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Token issuers should be cautious about the jurisdictions in which they offer tokens. Some jurisdictions have strict regulations governing token sales.
            </div>
          </div>
        );
        
      case 1: // Token Details
        return (
          <div className="form-section">
            <h3>Token Information</h3>
            <div className="form-group">
              <label htmlFor="token_name">
                Token Name
                <InfoTooltip content="The full name of your token (e.g., 'Ethereum')." />
              </label>
              <input
                type="text"
                id="token_name"
                name="token_name"
                className="form-control"
                value={formData.token_name}
                onChange={handleChange}
                placeholder="Acme Token"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="token_symbol">
                Token Symbol
                <InfoTooltip content="The trading symbol or ticker for your token (e.g., 'ETH')." />
              </label>
              <input
                type="text"
                id="token_symbol"
                name="token_symbol"
                className="form-control"
                value={formData.token_symbol}
                onChange={handleChange}
                placeholder="ACM"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="token_type">
                Token Type
                <InfoTooltip content="The classification of your token, which affects legal treatment." />
              </label>
              <select
                id="token_type"
                name="token_type"
                className="form-control"
                value={formData.token_type}
                onChange={handleChange}
              >
                <option value="utility">Utility Token</option>
                <option value="security">Security Token</option>
                <option value="governance">Governance Token</option>
                <option value="payment">Payment Token</option>
                <option value="non-fungible">Non-Fungible Token (NFT)</option>
              </select>
              {formData.token_type === "security" && (
                <WarningIndicator content="Security tokens are subject to securities regulations and may require registration or exemption." />
              )}
              <span className="form-hint">
                {formData.token_type === "utility" && "Utility tokens provide access to a product or service."}
                {formData.token_type === "security" && "Security tokens represent ownership in an asset and may be subject to securities regulations."}
                {formData.token_type === "governance" && "Governance tokens provide voting rights in a protocol or platform."}
                {formData.token_type === "payment" && "Payment tokens are designed to be used as a medium of exchange."}
                {formData.token_type === "non-fungible" && "NFTs represent unique digital assets."}
              </span>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_network">
                Blockchain Network
                <InfoTooltip content="The blockchain platform where your token exists." />
              </label>
              <select
                id="token_network"
                name="token_network"
                className="form-control"
                value={formData.token_network}
                onChange={handleChange}
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Binance Smart Chain">Binance Smart Chain</option>
                <option value="Solana">Solana</option>
                <option value="Polygon">Polygon</option>
                <option value="Avalanche">Avalanche</option>
                <option value="Cardano">Cardano</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_smart_contract">
                Smart Contract Address
                <InfoTooltip content="The blockchain address where the token's smart contract is deployed." />
              </label>
              <input
                type="text"
                id="token_smart_contract"
                name="token_smart_contract"
                className="form-control"
                value={formData.token_smart_contract}
                onChange={handleChange}
                placeholder="0x123abc..."
              />
              <span className="form-hint">If not yet deployed, you can leave this blank and update it later.</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_total_supply">
                Total Token Supply
                <InfoTooltip content="The maximum number of tokens that will ever exist." />
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="token_total_supply"
                  name="token_total_supply"
                  className="form-control"
                  value={formData.token_total_supply}
                  onChange={handleChange}
                  placeholder="1,000,000"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_description">
                Token Description & Utility
                <InfoTooltip content="Describe what the token does and what rights or access it provides to holders." />
              </label>
              <textarea
                id="token_description"
                name="token_description"
                className="form-control"
                value={formData.token_description}
                onChange={handleChange}
                placeholder="Describe the purpose, functionality, and utility of your token..."
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>
                Governance Rights
                <InfoTooltip content="Whether token holders have voting rights in the protocol." />
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="governance_rights"
                    className="radio-input"
                    value="yes"
                    checked={formData.governance_rights === "yes"}
                    onChange={handleChange}
                  />
                  Yes, tokens include governance rights
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="governance_rights"
                    className="radio-input"
                    value="no"
                    checked={formData.governance_rights === "no"}
                    onChange={handleChange}
                  />
                  No, tokens do not include governance rights
                </label>
              </div>
            </div>
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> The classification of your token has significant legal implications. If your token has characteristics of a security (expectation of profit from others' efforts), it may be subject to securities regulations. Consult with legal counsel familiar with blockchain regulations.
            </div>
          </div>
        );
        
      case 2: // Purchase Specifics
        return (
          <div className="form-section">
            <h3>Purchase Terms</h3>
            <div className="form-group">
              <label htmlFor="token_amount">
                Number of Tokens Being Purchased
                <InfoTooltip content="The quantity of tokens the buyer is purchasing under this agreement." />
              </label>
              <input
                type="text"
                id="token_amount"
                name="token_amount"
                className="form-control"
                value={formData.token_amount}
                onChange={handleChange}
                placeholder="10,000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="token_price_type">
                Pricing Method
                <InfoTooltip content="How the token price is determined for this sale." />
              </label>
              <select
                id="token_price_type"
                name="token_price_type"
                className="form-control"
                value={formData.token_price_type}
                onChange={handleChange}
              >
                <option value="fixed">Fixed Price</option>
                <option value="tiered">Tiered Pricing</option>
                <option value="discounted">Discounted Price</option>
              </select>
              <span className="form-hint">
                {formData.token_price_type === "fixed" && "A single price per token."}
                {formData.token_price_type === "tiered" && "Different price points based on purchase quantity."}
                {formData.token_price_type === "discounted" && "A discounted price from a standard rate."}
              </span>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_price">
                Token Price
                <InfoTooltip content="The price per token in the selected currency." />
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="token_price"
                  name="token_price"
                  className="form-control"
                  value={formData.token_price}
                  onChange={handleChange}
                  placeholder="0.50"
                />
              </div>
              {formData.token_price && formData.token_amount && (
                <span className="form-hint">
                  Total purchase amount: {(parseFloat(formData.token_price) * parseFloat(formData.token_amount)).toFixed(2)} {formData.purchase_currency}
                  {formData.token_price_type === "discounted" && formData.discount_rate && 
                    ` (After ${formData.discount_rate}% discount: ${(parseFloat(formData.token_price) * parseFloat(formData.token_amount) * (1 - parseFloat(formData.discount_rate)/100)).toFixed(2)} ${formData.purchase_currency})`
                  }
                </span>
              )}
            </div>
            
            {formData.token_price_type === "discounted" && (
              <div className="form-group">
                <label htmlFor="discount_rate">
                  Discount Rate (%)
                  <InfoTooltip content="The percentage discount from the standard price." />
                </label>
                <div className="percentage-input-container">
                  <input
                    type="number"
                    id="discount_rate"
                    name="discount_rate"
                    className="form-control"
                    value={formData.discount_rate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    placeholder="20"
                  />
                  <span className="percentage-sign">%</span>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="purchase_currency">
                Purchase Currency
                <InfoTooltip content="The currency in which the purchase price will be paid." />
              </label>
              <select
                id="purchase_currency"
                name="purchase_currency"
                className="form-control"
                value={formData.purchase_currency}
                onChange={handleChange}
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
                <option value="SGD">Singapore Dollar (SGD)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>
                Cryptocurrency Payment
                <InfoTooltip content="Whether payment will be made in cryptocurrency." />
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="crypto_payment"
                    className="radio-input"
                    value="yes"
                    checked={formData.crypto_payment === "yes"}
                    onChange={handleChange}
                  />
                  Yes, payment will be in cryptocurrency
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="crypto_payment"
                    className="radio-input"
                    value="no"
                    checked={formData.crypto_payment === "no"}
                    onChange={handleChange}
                  />
                  No, payment will be in fiat currency
                </label>
              </div>
            </div>
            
            {formData.crypto_payment === "yes" && (
              <div className="form-group">
                <label htmlFor="crypto_payment_type">
                  Cryptocurrency Type
                  <InfoTooltip content="The specific cryptocurrency to be used for payment." />
                </label>
                <select
                  id="crypto_payment_type"
                  name="crypto_payment_type"
                  className="form-control"
                  value={formData.crypto_payment_type}
                  onChange={handleChange}
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="BNB">Binance Coin (BNB)</option>
                  <option value="XRP">XRP</option>
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="payment_deadline">
                Payment Deadline
                <InfoTooltip content="The date by which the buyer must pay the purchase price." />
              </label>
              <input
                type="date"
                id="payment_deadline"
                name="payment_deadline"
                className="form-control"
                value={formData.payment_deadline}
                onChange={handleChange}
              />
            </div>
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Record-keeping is essential for token sales. Maintain detailed records of all payments, including amounts, dates, and wallet addresses to ensure compliance with AML/KYC regulations.
            </div>
          </div>
        );
        
      case 3: // Representations & Warranties
        return (
          <div className="form-section">
            <h3>Seller Representations</h3>
            <div className="form-group">
              <label>
                Token Ownership
                <InfoTooltip content="Whether the seller owns the tokens or rights to issue them." />
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="seller_ownership"
                    className="radio-input"
                    value="yes"
                    checked={formData.seller_ownership === "yes"}
                    onChange={handleChange}
                  />
                  Seller currently owns the tokens
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="seller_ownership"
                    className="radio-input"
                    value="no"
                    checked={formData.seller_ownership === "no"}
                    onChange={handleChange}
                  />
                  Seller will create/mint the tokens
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>
                Compliance with Laws
                <InfoTooltip content="Whether the token sale complies with applicable laws and regulations." />
                {formData.token_type === "security" && (
                  <WarningIndicator content="Security tokens require special consideration for legal compliance." />
                )}
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="compliance_laws"
                    className="radio-input"
                    value="yes"
                    checked={formData.compliance_laws === "yes"}
                    onChange={handleChange}
                  />
                  Seller represents full compliance with laws
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="compliance_laws"
                    className="radio-input"
                    value="no"
                    checked={formData.compliance_laws === "no"}
                    onChange={handleChange}
                  />
                  Seller represents reasonable steps toward compliance
                </label>
              </div>
            </div>
            
            <h3>Buyer Representations</h3>
            <div className="form-group">
              <label>
                Accredited Investor Status
                <InfoTooltip content="Whether the buyer qualifies as an accredited investor under securities regulations." />
                {formData.token_type === "security" && (
                  <WarningIndicator content="For security tokens, non-accredited investors may face restrictions." />
                )}
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="buyer_accredited"
                    className="radio-input"
                    value="yes"
                    checked={formData.buyer_accredited === "yes"}
                    onChange={handleChange}
                  />
                  Buyer is an accredited investor
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="buyer_accredited"
                    className="radio-input"
                    value="no"
                    checked={formData.buyer_accredited === "no"}
                    onChange={handleChange}
                  />
                  Buyer is not an accredited investor
                </label>
              </div>
            </div>
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> In the US, an "accredited investor" generally includes individuals with net worth over $1 million (excluding primary residence) or income exceeding $200,000 in each of the two most recent years. For security tokens, this status is particularly important as it affects which exemptions from registration may be available.
            </div>
          </div>
        );
        
      case 4: // Covenants & Conditions
        return (
          <div className="form-section">
            <h3>Transfer Restrictions</h3>
            <div className="form-group">
              <label>
                Token Use Restriction
                <InfoTooltip content="Whether there are restrictions on how the buyer can transfer the tokens." />
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="token_use_restriction"
                    className="radio-input"
                    value="yes"
                    checked={formData.token_use_restriction === "yes"}
                    onChange={handleChange}
                  />
                  Yes, include transfer restrictions
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="token_use_restriction"
                    className="radio-input"
                    value="no"
                    checked={formData.token_use_restriction === "no"}
                    onChange={handleChange}
                  />
                  No transfer restrictions
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="lock_up_period">
                Lock-Up Period (months)
                <InfoTooltip content="Period during which the buyer cannot transfer or sell the tokens." />
              </label>
              <input
                type="number"
                id="lock_up_period"
                name="lock_up_period"
                className="form-control"
                value={formData.lock_up_period}
                onChange={handleChange}
                min="0"
                placeholder="6"
              />
              <span className="form-hint">0 means no lock-up period</span>
            </div>
            
            <h3>Vesting Schedule</h3>
            <div className="form-group">
              <label>
                Include Vesting Schedule
                <InfoTooltip content="Whether tokens will vest over time rather than transferring all at once." />
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="vesting_schedule"
                    className="radio-input"
                    value="yes"
                    checked={formData.vesting_schedule === "yes"}
                    onChange={handleChange}
                  />
                  Yes, include vesting schedule
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="vesting_schedule"
                    className="radio-input"
                    value="no"
                    checked={formData.vesting_schedule === "no"}
                    onChange={handleChange}
                  />
                  No, tokens fully vest immediately
                </label>
              </div>
            </div>
            
            {formData.vesting_schedule === "yes" && (
              <>
                <div className="form-group">
                  <label htmlFor="vesting_period">
                    Vesting Period
                    <InfoTooltip content="The total time period over which tokens will vest (e.g., '36 months', '4 years')." />
                  </label>
                  <input
                    type="text"
                    id="vesting_period"
                    name="vesting_period"
                    className="form-control"
                    value={formData.vesting_period}
                    onChange={handleChange}
                    placeholder="48 months"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="vesting_cliff">
                    Vesting Cliff
                    <InfoTooltip content="Initial period before any tokens vest (e.g., '12 months')." />
                  </label>
                  <input
                    type="text"
                    id="vesting_cliff"
                    name="vesting_cliff"
                    className="form-control"
                    value={formData.vesting_cliff}
                    onChange={handleChange}
                    placeholder="12 months"
                  />
                </div>
              </>
            )}
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Vesting schedules and lock-up periods are common in token sales to align incentives and prevent immediate market selling pressure. These restrictions should be clearly disclosed to buyers and may affect the regulatory classification of the token.
            </div>
          </div>
        );
        
      case 5: // Closing Terms
        return (
          <div className="form-section">
            <h3>Conditions to Closing</h3>
            <div className="form-group">
              <label htmlFor="closing_conditions">
                Additional Closing Conditions
                <InfoTooltip content="Specific conditions that must be met before the transaction is completed." />
              </label>
              <textarea
                id="closing_conditions"
                name="closing_conditions"
                className="form-control"
                value={formData.closing_conditions.join("\n")}
                onChange={(e) => {
                  const conditions = e.target.value.split("\n").filter(c => c.trim() !== "");
                  setFormData(prev => ({
                    ...prev,
                    closing_conditions: conditions
                  }));
                  setLastChanged("closing_conditions");
                }}
                placeholder="Enter each condition on a new line..."
              ></textarea>
              <span className="form-hint">Standard conditions (payment, compliance) are included automatically.</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="termination_rights">
                Additional Termination Rights
                <InfoTooltip content="Circumstances under which either party can terminate the agreement." />
              </label>
              <textarea
                id="termination_rights"
                name="termination_rights"
                className="form-control"
                value={formData.termination_rights.join("\n")}
                onChange={(e) => {
                  const rights = e.target.value.split("\n").filter(r => r.trim() !== "");
                  setFormData(prev => ({
                    ...prev,
                    termination_rights: rights
                  }));
                  setLastChanged("termination_rights");
                }}
                placeholder="Enter each termination right on a new line..."
              ></textarea>
              <span className="form-hint">Standard termination rights (mutual consent, deadline) are included automatically.</span>
            </div>
            
            <h3>Governing Law & Dispute Resolution</h3>
            <div className="form-group">
              <label htmlFor="governing_law">
                Governing Law
                <InfoTooltip content="The jurisdiction whose laws will govern the agreement." />
              </label>
              <input
                type="text"
                id="governing_law"
                name="governing_law"
                className="form-control"
                value={formData.governing_law}
                onChange={handleChange}
                placeholder="State of Delaware, United States"
              />
            </div>
            
            <div className="form-group">
              <label>
                Dispute Resolution Method
                <InfoTooltip content="How disputes under the agreement will be resolved." />
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="dispute_resolution"
                    className="radio-input"
                    value="litigation"
                    checked={formData.dispute_resolution === "litigation"}
                    onChange={handleChange}
                  />
                  Court Litigation
                </label>
              </div>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="dispute_resolution"
                    className="radio-input"
                    value="arbitration"
                    checked={formData.dispute_resolution === "arbitration"}
                    onChange={handleChange}
                  />
                  Arbitration
                </label>
              </div>
            </div>
            
            {formData.dispute_resolution === "arbitration" && (
              <div className="form-group">
                <label htmlFor="arbitration_venue">
                  Arbitration Venue
                  <InfoTooltip content="The location where arbitration will take place." />
                </label>
                <input
                  type="text"
                  id="arbitration_venue"
                  name="arbitration_venue"
                  className="form-control"
                  value={formData.arbitration_venue}
                  onChange={handleChange}
                  placeholder="San Francisco, California"
                />
              </div>
            )}
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Due to the global nature of blockchain technology, jurisdictional issues can be complex in token sales. Consider carefully which governing law and dispute resolution mechanisms are most appropriate for your situation. Some jurisdictions are more crypto-friendly than others.
            </div>
          </div>
        );
        
      default:
        return <div>Unknown tab</div>;
    }
  };
  
  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>Token Purchase Agreement Generator</h1>
        <p>Create a customized agreement for token sales compliant with securities regulations</p>
      </div>
      
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
      
      <div className="generator-body">
        <div className="form-panel">
          {renderTabContent()}
        </div>
        
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
          <i data-feather="chevron-left" style={{marginRight: "0.25rem"}} />
          Previous
        </button>
        
        <div className="action-buttons">
          {/* Copy to clipboard button */}
          <button
            onClick={copyToClipboard}
            className="nav-button"
            style={{
              backgroundColor: "#4f46e5", 
              color: "white",
              border: "none"
            }}
          >
            <i data-feather="copy" style={{marginRight: "0.25rem"}} />
            Copy to Clipboard
          </button>
          
          {/* Download MS Word button */}
          <button
            onClick={downloadAsWord}
            className="nav-button"
            style={{
              backgroundColor: "#2563eb", 
              color: "white",
              border: "none"
            }}
          >
            <i data-feather="file-text" style={{marginRight: "0.25rem"}} />
            Download MS Word
          </button>
          
          {/* Schedule Consult button */}
          <button
            onClick={() => window.open("https://terms.law/call/", "_blank")}
            className="nav-button"
            style={{
              backgroundColor: "#10b981", 
              color: "white",
              border: "none"
            }}
          >
            <i data-feather="calendar" style={{marginRight: "0.25rem"}} />
            Schedule Consult
          </button>
        </div>
        
        <button
          onClick={nextTab}
          className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
          disabled={currentTab === tabs.length - 1}
        >
          Next
          <i data-feather="chevron-right" style={{marginLeft: "0.25rem"}} />
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<TokenPurchaseAgreementGenerator />, document.getElementById('root'));