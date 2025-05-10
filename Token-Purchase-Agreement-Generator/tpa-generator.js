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
    include_smart_contract: true,
    token_total_supply: "1000000",
    token_description: "",
    governance_rights: "no",
    
    // Purchase Specifics
    token_price_type: "fixed",
    token_price: "0.10",
    token_amount: "100000",
    payment_methods: ["fiat"],
    purchase_currency: "USD",
    custom_currency: "",
    crypto_payment_type: "BTC",
    discount_rate: "0",
    equity_percentage: "",
    equity_company: "",
    other_consideration: "",
    payment_deadline: "",
    
    // Representations & Warranties
    buyer_accredited: "yes",
    seller_ownership: "yes",
    compliance_laws: "yes",
    us_law_applies: true,
    
    // Covenants & Conditions
    token_use_restriction: "no",
    restriction_type: "standard",
    custom_restrictions: "",
    lock_up_period: "0",
    vesting_schedule: "no",
    vesting_preset: "standard",
    vesting_period: "",
    vesting_cliff: "",
    
    // Closing Terms
    closing_conditions: [],
    termination_rights: [],
    governing_law: "Delaware",
    custom_governing_law: "",
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
    // Define common variables
    const currencyDisplay = formData.purchase_currency === "Other" ? 
      (formData.custom_currency || "[Custom Currency]") : formData.purchase_currency;
    
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

${formData.include_smart_contract && formData.token_smart_contract ? 
`1.3 "Smart Contract" means the smart contract deployed at address ${formData.token_smart_contract} on the Blockchain.

1.4 "Purchase Price" means the amount set forth in Section 3 to be paid by Buyer to Seller for the purchase of the Tokens.

1.5 "Securities Act" means the Securities Act of 1933, as amended.

1.6 "Transfer" means to sell, assign, transfer, pledge, hypothecate or otherwise dispose of, whether voluntarily or by operation of law.` : 
`1.3 "Purchase Price" means the amount set forth in Section 3 to be paid by Buyer to Seller for the purchase of the Tokens.

1.4 "Securities Act" means the Securities Act of 1933, as amended.

1.5 "Transfer" means to sell, assign, transfer, pledge, hypothecate or otherwise dispose of, whether voluntarily or by operation of law.`}

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
    return `${formData.token_price || "[Amount]"} ${currencyDisplay} per Token, for a total of ${formData.token_price && formData.token_amount ? (parseFloat(formData.token_price) * parseFloat(formData.token_amount)).toFixed(2) : "[Total Amount]"} ${currencyDisplay}`;
  } else if (formData.token_price_type === "tiered") {
    return `determined according to the tiered pricing schedule set forth in Schedule A, for a total of ${formData.token_price && formData.token_amount ? (parseFloat(formData.token_price) * parseFloat(formData.token_amount)).toFixed(2) : "[Total Amount]"} ${currencyDisplay}`;
  } else {
    return `${formData.token_price || "[Amount]"} ${currencyDisplay} per Token, with a discount of ${formData.discount_rate || "0"}%, for a total of ${formData.token_price && formData.token_amount && formData.discount_rate ? (parseFloat(formData.token_price) * parseFloat(formData.token_amount) * (1 - parseFloat(formData.discount_rate) / 100)).toFixed(2) : "[Total Amount]"} ${currencyDisplay}`;
  }
})()}.

3.3 Payment. ${(() => {
  const paymentMethods = formData.payment_methods || [];
  if (paymentMethods.length === 0) return "Buyer shall pay the Purchase Price as agreed between the Parties.";
  
  const paymentClauses = [];
  
  if (paymentMethods.includes("fiat")) {
    const currency = formData.purchase_currency === "Other" ? (formData.custom_currency || "[Custom Currency]") : formData.purchase_currency;
    paymentClauses.push(`Buyer shall pay ${paymentMethods.length > 1 ? "a portion of " : ""}the Purchase Price in ${currency} to Seller's designated bank account as provided separately by Seller`);
  }
  
  if (paymentMethods.includes("crypto")) {
    paymentClauses.push(`Buyer shall pay ${paymentMethods.length > 1 ? "a portion of " : ""}the Purchase Price in ${formData.crypto_payment_type || "BTC"} to Seller's crypto wallet address as provided separately by Seller`);
  }
  
  if (paymentMethods.includes("equity")) {
    const company = formData.equity_company ? formData.equity_company : "[Company Name]";
    const percentage = formData.equity_percentage ? formData.equity_percentage : "[Percentage]";
    paymentClauses.push(`Buyer shall transfer ${paymentMethods.length > 1 ? "a portion of " : ""}the Purchase Price as ${percentage}% equity ownership in ${company} to Seller`);
  }
  
  if (paymentMethods.includes("other")) {
    const otherConsideration = formData.other_consideration ? 
      formData.other_consideration : 
      "other consideration as mutually agreed between the Parties";
    paymentClauses.push(`Buyer shall provide ${paymentMethods.length > 1 ? "a portion of " : ""}the Purchase Price as ${otherConsideration}`);
  }
  
  // Format the payment clauses with proper conjunction
  if (paymentClauses.length === 1) {
    return paymentClauses[0] + ".";
  } else if (paymentClauses.length === 2) {
    return paymentClauses.join(" and ") + ".";
  } else {
    const lastClause = paymentClauses.pop();
    return paymentClauses.join(", ") + ", and " + lastClause + ".";
  }
})()}

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

${formData.us_law_applies ? `5.3 Accredited Investor Status. ${formData.buyer_accredited === "yes" ? 
`Buyer is an "accredited investor" as that term is defined in Rule 501(a) of Regulation D promulgated under the Securities Act.` : 
`Buyer may not qualify as an "accredited investor" as that term is defined in Rule 501(a) of Regulation D promulgated under the Securities Act, and acknowledges the increased risks associated with this investment.`}

5.4 Investment Purpose. Buyer is acquiring the Tokens for its own account and for investment purposes only, and not with a view to, or for resale in connection with, any distribution thereof within the meaning of the Securities Act.` : 
`5.3 Investment Purpose. Buyer is acquiring the Tokens for its own account and for investment purposes only, and not with a view to resale or distribution.`}

5.${formData.us_law_applies ? '5' : '4'} Knowledge and Risks. Buyer has sufficient knowledge, experience, and expertise in financial and business matters, blockchain technology, cryptographic tokens, and other digital assets, and is capable of evaluating the merits and risks of entering into this Agreement and purchasing the Tokens.

6. RESTRICTIONS ON TRANSFER

6.1 Transfer Restrictions. ${formData.token_use_restriction === "yes" ? 
(() => {
  switch(formData.restriction_type) {
    case "standard":
      return `Buyer shall not Transfer any of the Tokens except in compliance with this Agreement and applicable securities laws.`;
    case "region":
      return `Buyer shall not Transfer any of the Tokens to persons or entities located in Restricted Territories, as defined in Schedule B, or in violation of applicable securities laws.`;
    case "kyc":
      return `Buyer shall not Transfer any of the Tokens except to recipients who have completed the same know-your-customer (KYC) and anti-money laundering (AML) verification procedures as the Buyer.`;
    case "accredited":
      return `Buyer shall not Transfer any of the Tokens except to recipients that qualify as "accredited investors" as defined in Rule 501(a) of Regulation D promulgated under the Securities Act.`;
    case "custom":
      return formData.custom_restrictions || `Buyer shall not Transfer any of the Tokens except in compliance with this Agreement and applicable securities laws.`;
    default:
      return `Buyer shall not Transfer any of the Tokens except in compliance with this Agreement and applicable securities laws.`;
  }
})() : 
`Buyer may Transfer the Tokens without restriction, provided such Transfer complies with applicable securities laws.`}

6.2 Lock-Up Period. ${formData.lock_up_period && parseInt(formData.lock_up_period) > 0 ? 
`Buyer shall not Transfer any of the Tokens for a period of ${formData.lock_up_period || "[Number]"} months following the delivery of Tokens to Buyer (the "Lock-Up Period").` : 
`There is no lock-up period restricting the Transfer of Tokens by Buyer.`}

6.3 Vesting Schedule. ${formData.vesting_schedule === "yes" ? 
(() => {
  switch(formData.vesting_preset) {
    case "standard":
      return `The Tokens shall vest to Buyer according to the following schedule: ${formData.vesting_period || "48 months"} with a cliff of ${formData.vesting_cliff || "12 months"}.`;
    case "linear":
      return `The Tokens shall vest linearly to Buyer over a period of ${formData.vesting_period || "48 months"} with no cliff period.`;
    case "milestone":
      return `The Tokens shall vest to Buyer upon achievement of specific project milestones as set forth in Schedule C.`;
    case "custom":
      return `The Tokens shall vest to Buyer according to the following schedule: ${formData.vesting_period || "[Period]"} with a cliff of ${formData.vesting_cliff || "[Cliff Period]"}.`;
    default:
      return `The Tokens shall vest to Buyer according to the following schedule: ${formData.vesting_period || "[Period]"} with a cliff of ${formData.vesting_cliff || "[Cliff Period]"}.`;
  }
})() : 
`The Tokens shall be fully vested upon delivery to Buyer.`}

7. CONDITIONS TO CLOSING

7.1 Conditions to Obligations of Seller. The obligation of Seller to sell and deliver the Tokens to Buyer at Closing is subject to the fulfillment, prior to or at Closing, of each of the following conditions:
${formData.closing_conditions && formData.closing_conditions.length > 0 ? 
formData.closing_conditions.map((condition, index) => `\n   (${String.fromCharCode(97 + index)}) ${condition}`).join('') : 
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

9.2 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of ${formData.governing_law === "Other" ? (formData.custom_governing_law || "[Jurisdiction]") : formData.governing_law || "[Jurisdiction]"} without giving effect to any choice or conflict of law provision or rule.

9.3 Dispute Resolution. ${formData.dispute_resolution === "arbitration" ? 
`Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration administered by [Arbitration Body] in accordance with its rules. The seat of arbitration shall be ${formData.arbitration_venue || "[Venue]"}. The number of arbitrators shall be [Number]. The language of the arbitration shall be English.` : 
`Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of ${formData.governing_law === "Other" ? (formData.custom_governing_law || "[Jurisdiction]") : formData.governing_law || "[Jurisdiction]"}.`}

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
                <InfoTooltip content="The full name of your token (e.g., 'Ethereum', 'Bitcoin')." />
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
                <InfoTooltip content="The trading symbol or ticker for your token (e.g., 'ETH', 'BTC'). Usually 3-4 letters." />
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
                <InfoTooltip content="The classification of your token has significant legal implications. Utility tokens are the most common and generally face less regulatory scrutiny compared to security tokens." />
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
                <WarningIndicator content="Security tokens are subject to securities regulations and may require registration or exemption under laws like the Securities Act of 1933." />
              )}
              <span className="form-hint">
                {formData.token_type === "utility" && "Utility tokens provide access to a product or service (e.g., access to a platform, ability to use certain features)."}
                {formData.token_type === "security" && "Security tokens represent ownership in an asset and may be subject to securities regulations. They often represent ownership shares, dividend rights, or profit-sharing arrangements."}
                {formData.token_type === "governance" && "Governance tokens provide voting rights in a protocol or platform (e.g., voting on protocol upgrades, parameter changes, or treasury allocations)."}
                {formData.token_type === "payment" && "Payment tokens are designed primarily to be used as a medium of exchange within a specific ecosystem."}
                {formData.token_type === "non-fungible" && "NFTs represent unique digital assets with distinct characteristics, unlike fungible tokens which are interchangeable."}
              </span>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_network">
                Blockchain Network
                <InfoTooltip content="The blockchain platform where your token exists. Different networks have different technical capabilities, gas costs, and community reach." />
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
                <option value="Arbitrum">Arbitrum</option>
                <option value="Optimism">Optimism</option>
                <option value="Base">Base</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="include_smart_contract"
                    checked={formData.include_smart_contract}
                    onChange={(e) => setFormData({...formData, include_smart_contract: e.target.checked})}
                    className="checkbox-input"
                  />
                  Include Smart Contract Address
                </label>
              </div>
              
              {formData.include_smart_contract && (
                <>
                  <label htmlFor="token_smart_contract">
                    Smart Contract Address
                    <InfoTooltip content="The blockchain address where the token's smart contract is deployed. This is a unique identifier for your token on the blockchain (e.g., '0x1234...')." />
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
                </>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="token_total_supply">
                Total Token Supply
                <InfoTooltip content="The maximum number of tokens that will ever exist. Common supply amounts include 100 million or 1 billion for utility tokens, but this varies widely based on tokenomics." />
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="token_total_supply"
                  name="token_total_supply"
                  className="form-control"
                  value={formData.token_total_supply}
                  onChange={handleChange}
                  placeholder="1,000,000"
                  min="1"
                  step="500000"
                />
                <div className="number-controls">
                  <button type="button" onClick={() => {
                    const newValue = parseInt(formData.token_total_supply || 0) + 500000;
                    setFormData({...formData, token_total_supply: newValue.toString()});
                    setLastChanged("token_total_supply");
                  }}>▲</button>
                  <button type="button" onClick={() => {
                    const newValue = Math.max(1, parseInt(formData.token_total_supply || 0) - 500000);
                    setFormData({...formData, token_total_supply: newValue.toString()});
                    setLastChanged("token_total_supply");
                  }}>▼</button>
                </div>
              </div>
              <span className="form-hint">Common values: 10,000,000 (10M), 100,000,000 (100M), 1,000,000,000 (1B)</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_description">
                Token Description & Utility
                <InfoTooltip content="A clear description of what your token does, what rights it provides, and how it will be used in your ecosystem." />
              </label>
              <textarea
                id="token_description"
                name="token_description"
                className="form-control"
                value={formData.token_description}
                onChange={handleChange}
                placeholder="Example: provides holders with access to the platform's premium features, including advanced analytics, reduced transaction fees, and priority customer support."
              ></textarea>
              <span className="form-hint">Be specific about the utility or rights the token provides to its holders.</span>
            </div>
            
            <div className="form-group">
              <label>
                Governance Rights
                <InfoTooltip content="Governance rights allow token holders to vote on protocol changes, proposals, or other decisions affecting the ecosystem. This can impact the token's regulatory classification." />
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
              {formData.governance_rights === "yes" && (
                <span className="form-hint">Governance rights may influence regulatory classification. Tokens with significant governance rights may face additional regulatory scrutiny.</span>
              )}
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
                <InfoTooltip content="The quantity of tokens the buyer is purchasing under this agreement. This should be a specific number rather than a percentage of total supply." />
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="token_amount"
                  name="token_amount"
                  className="form-control"
                  value={formData.token_amount}
                  onChange={handleChange}
                  placeholder="10,000"
                  min="1"
                  step="10000"
                />
                <div className="number-controls">
                  <button type="button" onClick={() => {
                    const newValue = parseInt(formData.token_amount || 0) + 10000;
                    setFormData({...formData, token_amount: newValue.toString()});
                    setLastChanged("token_amount");
                  }}>▲</button>
                  <button type="button" onClick={() => {
                    const newValue = Math.max(1, parseInt(formData.token_amount || 0) - 10000);
                    setFormData({...formData, token_amount: newValue.toString()});
                    setLastChanged("token_amount");
                  }}>▼</button>
                </div>
              </div>
              <span className="form-hint">This is usually a percentage of the total token supply (e.g., 100,000 tokens = 1% of a 10M supply)</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_price_type">
                Pricing Method
                <InfoTooltip content="How the token price is determined for this sale. Different pricing methods are used for different investment stages and investor types." />
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
                {formData.token_price_type === "fixed" && "A single price per token (e.g., $0.10 per token). Most common for private sales."}
                {formData.token_price_type === "tiered" && "Different price points based on purchase quantity (e.g., $0.10 for first 10,000 tokens, $0.09 for next 10,000). Common for early-stage investors."}
                {formData.token_price_type === "discounted" && "A discounted price from a standard rate (e.g., 20% discount from public sale price). Often used for strategic investors."}
              </span>
            </div>
            
            <div className="form-group">
              <label htmlFor="token_price">
                Token Price
                <InfoTooltip content="The price per token in the selected currency. Early-stage token sales typically range from $0.01 to $1.00 depending on the project stage and tokenomics." />
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="token_price"
                  name="token_price"
                  className="form-control"
                  value={formData.token_price}
                  onChange={handleChange}
                  placeholder="0.10"
                  min="0.0001"
                  step="0.01"
                />
                <div className="number-controls">
                  <button type="button" onClick={() => {
                    const newValue = Math.max(0.0001, parseFloat(formData.token_price || 0) + 0.01).toFixed(4);
                    setFormData({...formData, token_price: newValue.toString()});
                    setLastChanged("token_price");
                  }}>▲</button>
                  <button type="button" onClick={() => {
                    const newValue = Math.max(0.0001, parseFloat(formData.token_price || 0) - 0.01).toFixed(4);
                    setFormData({...formData, token_price: newValue.toString()});
                    setLastChanged("token_price");
                  }}>▼</button>
                </div>
              </div>
              {formData.token_price && formData.token_amount && (
                <span className="form-hint">
                  <strong>Total purchase amount:</strong> {(parseFloat(formData.token_price) * parseFloat(formData.token_amount)).toFixed(2)} {formData.payment_methods.includes("fiat") ? (formData.purchase_currency === "Other" ? formData.custom_currency : formData.purchase_currency) : "units of value"}
                  {formData.token_price_type === "discounted" && formData.discount_rate && 
                    ` (After ${formData.discount_rate}% discount: ${(parseFloat(formData.token_price) * parseFloat(formData.token_amount) * (1 - parseFloat(formData.discount_rate)/100)).toFixed(2)} ${formData.payment_methods.includes("fiat") ? (formData.purchase_currency === "Other" ? formData.custom_currency : formData.purchase_currency) : "units of value"})`
                  }
                </span>
              )}
            </div>
            
            {formData.token_price_type === "discounted" && (
              <div className="form-group">
                <label htmlFor="discount_rate">
                  Discount Rate (%)
                  <InfoTooltip content="The percentage discount from the standard price. Typical discounts range from 10-30% for early investors, with higher discounts (up to 50%) for strategic partners." />
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
                    step="5"
                    placeholder="20"
                  />
                  <span className="percentage-sign">%</span>
                  <div className="number-controls">
                    <button type="button" onClick={() => {
                      const newValue = Math.min(100, parseInt(formData.discount_rate || 0) + 5);
                      setFormData({...formData, discount_rate: newValue.toString()});
                      setLastChanged("discount_rate");
                    }}>▲</button>
                    <button type="button" onClick={() => {
                      const newValue = Math.max(0, parseInt(formData.discount_rate || 0) - 5);
                      setFormData({...formData, discount_rate: newValue.toString()});
                      setLastChanged("discount_rate");
                    }}>▼</button>
                  </div>
                </div>
                <span className="form-hint">Common discount rates: 10%, 20%, 30%, 40%, 50%</span>
              </div>
            )}
            
            <h3>Payment Methods</h3>
            <div className="form-group">
              <label>
                Payment Method(s)
                <InfoTooltip content="Select one or more methods of payment. You can choose multiple options for mixed payment structures." />
              </label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="payment_methods_fiat"
                    className="checkbox-input"
                    checked={formData.payment_methods.includes("fiat")}
                    onChange={(e) => {
                      const updatedMethods = e.target.checked 
                        ? [...formData.payment_methods, "fiat"] 
                        : formData.payment_methods.filter(m => m !== "fiat");
                      setFormData({...formData, payment_methods: updatedMethods});
                      setLastChanged("payment_methods");
                    }}
                  />
                  Fiat Currency
                </label>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="payment_methods_crypto"
                    className="checkbox-input"
                    checked={formData.payment_methods.includes("crypto")}
                    onChange={(e) => {
                      const updatedMethods = e.target.checked 
                        ? [...formData.payment_methods, "crypto"] 
                        : formData.payment_methods.filter(m => m !== "crypto");
                      setFormData({...formData, payment_methods: updatedMethods});
                      setLastChanged("payment_methods");
                    }}
                  />
                  Cryptocurrency
                </label>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="payment_methods_equity"
                    className="checkbox-input"
                    checked={formData.payment_methods.includes("equity")}
                    onChange={(e) => {
                      const updatedMethods = e.target.checked 
                        ? [...formData.payment_methods, "equity"] 
                        : formData.payment_methods.filter(m => m !== "equity");
                      setFormData({...formData, payment_methods: updatedMethods});
                      setLastChanged("payment_methods");
                    }}
                  />
                  Equity/Ownership Transfer
                </label>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="payment_methods_other"
                    className="checkbox-input"
                    checked={formData.payment_methods.includes("other")}
                    onChange={(e) => {
                      const updatedMethods = e.target.checked 
                        ? [...formData.payment_methods, "other"] 
                        : formData.payment_methods.filter(m => m !== "other");
                      setFormData({...formData, payment_methods: updatedMethods});
                      setLastChanged("payment_methods");
                    }}
                  />
                  Other Consideration
                </label>
              </div>
              {formData.payment_methods.length === 0 && (
                <div className="form-error">Please select at least one payment method</div>
              )}
            </div>
            
            {formData.payment_methods.includes("fiat") && (
              <div className="form-group">
                <label htmlFor="purchase_currency">
                  Fiat Currency
                  <InfoTooltip content="The currency in which the purchase price will be paid. This affects regulatory implications and banking considerations." />
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
                  <option value="CNY">Chinese Yuan (CNY)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="Other">Other (specify)</option>
                </select>
                
                {formData.purchase_currency === "Other" && (
                  <div className="form-group" style={{marginTop: "0.5rem"}}>
                    <label htmlFor="custom_currency">Custom Currency</label>
                    <input
                      type="text"
                      id="custom_currency"
                      name="custom_currency"
                      className="form-control"
                      value={formData.custom_currency}
                      onChange={handleChange}
                      placeholder="e.g., INR, BRL, KRW"
                    />
                  </div>
                )}
              </div>
            )}
            
            {formData.payment_methods.includes("crypto") && (
              <div className="form-group">
                <label htmlFor="crypto_payment_type">
                  Cryptocurrency Type
                  <InfoTooltip content="The specific cryptocurrency to be used for payment. Stablecoins provide price stability, while other cryptocurrencies may introduce price volatility risk." />
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
                  <option value="ADA">Cardano (ADA)</option>
                  <option value="DOGE">Dogecoin (DOGE)</option>
                  <option value="DOT">Polkadot (DOT)</option>
                </select>
                <span className="form-hint">Stablecoins (USDT, USDC) are often preferred to avoid price volatility issues.</span>
              </div>
            )}
            
            {formData.payment_methods.includes("equity") && (
              <>
                <div className="form-group">
                  <label htmlFor="equity_percentage">
                    Equity Percentage
                    <InfoTooltip content="The percentage of ownership in the company being transferred as payment." />
                  </label>
                  <div className="percentage-input-container">
                    <input
                      type="number"
                      id="equity_percentage"
                      name="equity_percentage"
                      className="form-control"
                      value={formData.equity_percentage}
                      onChange={handleChange}
                      min="0.01"
                      max="100"
                      step="0.1"
                      placeholder="5"
                    />
                    <span className="percentage-sign">%</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="equity_company">
                    Company/Entity Name
                    <InfoTooltip content="The name of the company or entity whose equity is being transferred." />
                  </label>
                  <input
                    type="text"
                    id="equity_company"
                    name="equity_company"
                    className="form-control"
                    value={formData.equity_company}
                    onChange={handleChange}
                    placeholder="e.g., Acme Technologies Inc."
                  />
                </div>
              </>
            )}
            
            {formData.payment_methods.includes("other") && (
              <div className="form-group">
                <label htmlFor="other_consideration">
                  Other Consideration
                  <InfoTooltip content="Describe any other form of payment or value transfer involved in this transaction." />
                </label>
                <textarea
                  id="other_consideration"
                  name="other_consideration"
                  className="form-control"
                  value={formData.other_consideration}
                  onChange={handleChange}
                  placeholder="Example: Provision of technical services valued at $50,000, or transfer of intellectual property rights to [specific IP]"
                ></textarea>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="payment_deadline">
                Payment Deadline
                <InfoTooltip content="The date by which the buyer must pay the purchase price. This should typically be at least 1-2 weeks from signing to allow for wire transfers or cryptocurrency transactions." />
              </label>
              <input
                type="date"
                id="payment_deadline"
                name="payment_deadline"
                className="form-control"
                value={formData.payment_deadline}
                onChange={handleChange}
              />
              <span className="form-hint">If left blank, the agreement will state a deadline must be specified before signing.</span>
            </div>
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Record-keeping is essential for token sales. Maintain detailed records of all payments, including amounts, dates, and wallet addresses to ensure compliance with AML/KYC regulations. Different jurisdictions have specific requirements for crypto payments and non-cash consideration.
            </div>
          </div>
        );
        
      case 3: // Representations & Warranties
        return (
          <div className="form-section">
            <div className="form-group">
              <label>
                Applicable Law
                <InfoTooltip content="Select whether US securities laws apply to this token purchase. This affects certain representations and warranties in the agreement." />
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="checkbox"
                    name="us_law_applies"
                    className="checkbox-input"
                    checked={formData.us_law_applies}
                    onChange={(e) => setFormData({...formData, us_law_applies: e.target.checked})}
                  />
                  US securities laws apply to this transaction
                </label>
              </div>
              <span className="form-hint">If the seller, buyer, or offering has US connections, US securities laws likely apply.</span>
            </div>
            
            <h3>Seller Representations</h3>
            <div className="form-group">
              <label>
                Token Ownership
                <InfoTooltip content="Whether the seller currently owns the tokens being sold or will create/mint them in the future. This affects the nature of the legal commitment." />
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
              <span className="form-hint">
                {formData.seller_ownership === "yes" ? 
                  "If tokens already exist, the seller represents having clear title to transfer them." :
                  "If tokens will be created later, this is more like a presale or future commitment."}
              </span>
            </div>
            
            <div className="form-group">
              <label>
                Compliance with Laws
                <InfoTooltip content="The level of certainty the seller provides regarding legal compliance. Full compliance representations carry higher legal risk for the seller than 'reasonable steps' language." />
                {formData.token_type === "security" && (
                  <WarningIndicator content="Security tokens require special consideration for legal compliance, including potential registration requirements or exemptions under securities laws." />
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
              <span className="form-hint">
                {formData.compliance_laws === "yes" ? 
                  "A stronger representation that may be difficult to make given regulatory uncertainty in many jurisdictions." :
                  "A more measured representation acknowledging the evolving regulatory landscape for tokens."}
              </span>
            </div>
            
            {formData.us_law_applies && (
              <>
                <h3>Buyer Representations</h3>
                <div className="form-group">
                  <label>
                    Accredited Investor Status
                    <InfoTooltip content="Under US securities laws, 'accredited investors' can participate in certain exempt offerings that non-accredited investors cannot. This significantly impacts the type of offering that can be conducted." />
                    {formData.token_type === "security" && (
                      <WarningIndicator content="For security tokens, selling to non-accredited investors may require registration with the SEC or strict compliance with exemptions like Regulation CF or Regulation A+." />
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
                  <div className="regulatory-info" style={{marginTop: "0.5rem"}}>
                    <strong>Accredited Investor Definition:</strong> Under SEC rules, an individual accredited investor must meet one of these criteria:
                    <ul style={{marginTop: "0.25rem", paddingLeft: "1.5rem"}}>
                      <li>Net worth over $1 million (excluding primary residence), alone or with spouse</li>
                      <li>Income exceeding $200,000 (or $300,000 with spouse) in each of the two most recent years</li>
                      <li>Certain professional certifications or credentials</li>
                      <li>Certain positions in private funds or companies issuing securities</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Representations and warranties allocate risk between parties and establish a legal basis for claims if statements prove untrue. The appropriate representations depend on token type, offering structure, and applicable jurisdictions. For security tokens, additional representations regarding compliance with specific exemptions (e.g., Regulation D, S, A+, or CF) may be necessary.
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
                <InfoTooltip content="Whether there are restrictions on how the buyer can transfer the tokens. Restrictions are common for compliance with securities laws and to prevent market disruption." />
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
              {formData.token_type === "security" && formData.token_use_restriction === "no" && (
                <span className="form-hint" style={{color: "var(--warning-color)"}}>
                  Warning: Security tokens typically require transfer restrictions to maintain compliance with securities laws.
                </span>
              )}
            </div>
            
            {formData.token_use_restriction === "yes" && (
              <div className="form-group">
                <label htmlFor="restriction_type">
                  Restriction Type
                  <InfoTooltip content="Different types of transfer restrictions serve different legal and business purposes." />
                </label>
                <select
                  id="restriction_type"
                  name="restriction_type"
                  className="form-control"
                  value={formData.restriction_type}
                  onChange={handleChange}
                >
                  <option value="standard">Standard Securities Law Compliance</option>
                  <option value="region">Restricted Territories</option>
                  <option value="kyc">KYC/AML Verification Required</option>
                  <option value="accredited">Accredited Investors Only</option>
                  <option value="custom">Custom Restrictions</option>
                </select>
                
                <span className="form-hint">
                  {formData.restriction_type === "standard" && "Basic restriction requiring compliance with securities laws for any transfers."}
                  {formData.restriction_type === "region" && "Prevents transfers to persons in specified restricted territories (e.g., sanctioned countries)."}
                  {formData.restriction_type === "kyc" && "Requires recipients to complete KYC/AML verification before receiving tokens."}
                  {formData.restriction_type === "accredited" && "Limits transfers only to recipients who qualify as accredited investors."}
                  {formData.restriction_type === "custom" && "Define your own custom transfer restrictions."}
                </span>
                
                {formData.restriction_type === "custom" && (
                  <textarea
                    id="custom_restrictions"
                    name="custom_restrictions"
                    className="form-control"
                    value={formData.custom_restrictions}
                    onChange={handleChange}
                    placeholder="Specify custom transfer restrictions..."
                    style={{marginTop: "0.5rem"}}
                  ></textarea>
                )}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="lock_up_period">
                Lock-Up Period (months)
                <InfoTooltip content="Period during which the buyer cannot transfer or sell the tokens. Lock-up periods help prevent market disruption and are often required by exchanges before listing." />
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="lock_up_period"
                  name="lock_up_period"
                  className="form-control"
                  value={formData.lock_up_period}
                  onChange={handleChange}
                  min="0"
                  max="60"
                  step="1"
                  placeholder="6"
                />
                <div className="number-controls">
                  <button type="button" onClick={() => {
                    const newValue = parseInt(formData.lock_up_period || 0) + 1;
                    setFormData({...formData, lock_up_period: newValue.toString()});
                    setLastChanged("lock_up_period");
                  }}>▲</button>
                  <button type="button" onClick={() => {
                    const newValue = Math.max(0, parseInt(formData.lock_up_period || 0) - 1);
                    setFormData({...formData, lock_up_period: newValue.toString()});
                    setLastChanged("lock_up_period");
                  }}>▼</button>
                </div>
              </div>
              <span className="form-hint">
                Common lock-up periods: 0 (none), 3, 6, 12, or 24 months. 
                Private sales typically have longer lock-ups than public sales.
              </span>
            </div>
            
            <h3>Vesting Schedule</h3>
            <div className="form-group">
              <label>
                Include Vesting Schedule
                <InfoTooltip content="Vesting schedules release tokens gradually over time, protecting the project from 'dump and run' investors and aligning long-term incentives." />
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
                  <label htmlFor="vesting_preset">
                    Vesting Structure
                    <InfoTooltip content="Different vesting structures serve different purposes. Standard linear vesting is most common, but milestone-based vesting can align with project development." />
                  </label>
                  <select
                    id="vesting_preset"
                    name="vesting_preset"
                    className="form-control"
                    value={formData.vesting_preset}
                    onChange={handleChange}
                  >
                    <option value="standard">Standard Linear Vesting with Cliff</option>
                    <option value="linear">Linear Vesting (No Cliff)</option>
                    <option value="milestone">Milestone-Based Vesting</option>
                    <option value="custom">Custom Vesting Schedule</option>
                  </select>
                  
                  <span className="form-hint">
                    {formData.vesting_preset === "standard" && "Tokens begin vesting after a cliff period, then vest linearly over time. Common for team and investor tokens."}
                    {formData.vesting_preset === "linear" && "Tokens vest continuously from day one without a cliff period. More investor-friendly approach."}
                    {formData.vesting_preset === "milestone" && "Tokens vest upon achievement of specific project milestones rather than time periods."}
                    {formData.vesting_preset === "custom" && "Create a custom vesting arrangement tailored to your needs."}
                  </span>
                </div>
                
                {(formData.vesting_preset === "standard" || formData.vesting_preset === "linear" || formData.vesting_preset === "custom") && (
                  <div className="form-group">
                    <label htmlFor="vesting_period">
                      Vesting Period
                      <InfoTooltip content="The total time period over which tokens will vest. Longer periods (36-48 months) are common for team and early investors, shorter periods (6-12 months) for later stage investors." />
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
                    <span className="form-hint">
                      Common examples: "12 months", "24 months", "36 months", "48 months"
                    </span>
                  </div>
                )}
                
                {(formData.vesting_preset === "standard" || formData.vesting_preset === "custom") && (
                  <div className="form-group">
                    <label htmlFor="vesting_cliff">
                      Vesting Cliff
                      <InfoTooltip content="Initial period before any tokens vest. After the cliff, a portion vests immediately, then the remainder vests according to the schedule. Standard cliffs are 6-12 months." />
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
                    <span className="form-hint">
                      Common examples: "6 months", "12 months", "18 months"
                    </span>
                  </div>
                )}
              </>
            )}
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Vesting schedules and lock-up periods are common in token sales to align incentives and prevent immediate market selling pressure. These restrictions can be implemented through smart contract functionality or legal agreements, but technological restrictions are often more effective than contractual ones. In some jurisdictions, the presence of vesting and lock-up may affect the regulatory classification of the token.
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
                <InfoTooltip content="Specific conditions that must be met before the transaction is completed. These protect both parties by ensuring certain requirements are satisfied." />
              </label>
              <div className="preset-selector">
                <div>Add common conditions:</div>
                <button type="button" className="preset-button" onClick={() => {
                  const newConditions = [...formData.closing_conditions, "Receipt of legal opinion confirming the token's regulatory status"];
                  setFormData(prev => ({ ...prev, closing_conditions: newConditions }));
                  setLastChanged("closing_conditions");
                }}>Legal Opinion</button>
                <button type="button" className="preset-button" onClick={() => {
                  const newConditions = [...formData.closing_conditions, "Completion of Buyer's due diligence to Buyer's satisfaction"];
                  setFormData(prev => ({ ...prev, closing_conditions: newConditions }));
                  setLastChanged("closing_conditions");
                }}>Due Diligence</button>
                <button type="button" className="preset-button" onClick={() => {
                  const newConditions = [...formData.closing_conditions, "Seller providing proof of token smart contract audit by a reputable security firm"];
                  setFormData(prev => ({ ...prev, closing_conditions: newConditions }));
                  setLastChanged("closing_conditions");
                }}>Smart Contract Audit</button>
                <button type="button" className="preset-button" onClick={() => {
                  const newConditions = [...formData.closing_conditions, "Buyer providing proof of funds from legitimate sources"];
                  setFormData(prev => ({ ...prev, closing_conditions: newConditions }));
                  setLastChanged("closing_conditions");
                }}>Proof of Funds</button>
                <button type="button" className="preset-button" onClick={() => {
                  const newConditions = [...formData.closing_conditions, "Completion of KYC/AML verification of Buyer"];
                  setFormData(prev => ({ ...prev, closing_conditions: newConditions }));
                  setLastChanged("closing_conditions");
                }}>KYC/AML</button>
              </div>
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
                placeholder="Enter additional conditions here (one per line)
Example: Seller obtaining all necessary regulatory approvals
Example: Completion of token listing on at least one exchange"
              ></textarea>
              <span className="form-hint">
                Standard conditions (payment, compliance with agreement terms) are included automatically.
                The additional conditions you add here provide further protections for either party.
              </span>
            </div>
            
            <div className="form-group">
              <label htmlFor="termination_rights">
                Additional Termination Rights
                <InfoTooltip content="Circumstances under which either party can terminate the agreement before closing. These provide exit options if certain events occur." />
              </label>
              <div className="preset-selector">
                <div>Add common termination rights:</div>
                <button type="button" className="preset-button" onClick={() => {
                  const newRights = [...formData.termination_rights, "By Buyer if total market capitalization of similar tokens decreases by more than 30% before Closing"];
                  setFormData(prev => ({ ...prev, termination_rights: newRights }));
                  setLastChanged("termination_rights");
                }}>Market Change</button>
                <button type="button" className="preset-button" onClick={() => {
                  const newRights = [...formData.termination_rights, "By either Party if any governmental authority prohibits the transaction"];
                  setFormData(prev => ({ ...prev, termination_rights: newRights }));
                  setLastChanged("termination_rights");
                }}>Regulatory Action</button>
                <button type="button" className="preset-button" onClick={() => {
                  const newRights = [...formData.termination_rights, "By Buyer if Seller fails to achieve [milestone] by [date]"];
                  setFormData(prev => ({ ...prev, termination_rights: newRights }));
                  setLastChanged("termination_rights");
                }}>Missed Milestone</button>
                <button type="button" className="preset-button" onClick={() => {
                  const newRights = [...formData.termination_rights, "By Seller if the token smart contract audit reveals critical security vulnerabilities"];
                  setFormData(prev => ({ ...prev, termination_rights: newRights }));
                  setLastChanged("termination_rights");
                }}>Security Issue</button>
              </div>
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
                placeholder="Enter additional termination rights here (one per line)
Example: By Buyer if Seller materially changes the token's functionality
Example: By Seller if Buyer fails to provide required KYC documentation within 14 days"
              ></textarea>
              <span className="form-hint">
                Standard termination rights (mutual consent, failure to close by deadline) are included automatically.
                The rights you add here address specific scenarios relevant to your transaction.
              </span>
            </div>
            
            <h3>Governing Law & Dispute Resolution</h3>
            <div className="form-group">
              <label htmlFor="governing_law">
                Governing Law
                <InfoTooltip content="The jurisdiction whose laws will govern the agreement. Consider jurisdictions with clear regulatory frameworks for blockchain/crypto transactions." />
              </label>
              <select
                id="governing_law"
                name="governing_law"
                className="form-control"
                value={formData.governing_law}
                onChange={handleChange}
              >
                <option value="Delaware">Delaware, United States</option>
                <option value="New York">New York, United States</option>
                <option value="California">California, United States</option>
                <option value="Wyoming">Wyoming, United States</option>
                <option value="Singapore">Singapore</option>
                <option value="England and Wales">England and Wales</option>
                <option value="Switzerland">Switzerland</option>
                <option value="British Virgin Islands">British Virgin Islands</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Other">Other (specify)</option>
              </select>
              
              {formData.governing_law === "Other" && (
                <div className="form-group" style={{marginTop: "0.5rem"}}>
                  <label htmlFor="custom_governing_law">Custom Jurisdiction</label>
                  <input
                    type="text"
                    id="custom_governing_law"
                    name="custom_governing_law"
                    className="form-control"
                    value={formData.custom_governing_law}
                    onChange={handleChange}
                    placeholder="e.g., Malta, Liechtenstein, Gibraltar"
                  />
                </div>
              )}
              
              <span className="form-hint">
                {formData.governing_law === "Delaware" && "Delaware has well-established corporate law and is crypto-friendly. Common for US entities."}
                {formData.governing_law === "New York" && "New York has extensive financial services law but stricter crypto regulations (BitLicense)."}
                {formData.governing_law === "California" && "California has strong consumer protection laws that may affect token sales."}
                {formData.governing_law === "Wyoming" && "Wyoming has passed favorable blockchain legislation and LLC laws."}
                {formData.governing_law === "Singapore" && "Singapore has a clear regulatory framework for digital tokens and is a major crypto hub."}
                {formData.governing_law === "England and Wales" && "England has well-developed commercial law and FCA guidance on crypto assets."}
                {formData.governing_law === "Switzerland" && "Switzerland has progressive blockchain regulations and is home to 'Crypto Valley'."}
                {formData.governing_law === "British Virgin Islands" && "BVI offers tax benefits but with less regulatory clarity for tokens."}
                {formData.governing_law === "Cayman Islands" && "Cayman Islands is popular for token issuers seeking tax benefits and flexibility."}
              </span>
            </div>
            
            <div className="form-group">
              <label>
                Dispute Resolution Method
                <InfoTooltip content="How disputes under the agreement will be resolved. Arbitration is often preferred for international transactions and greater confidentiality." />
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
              <span className="form-hint">
                {formData.dispute_resolution === "litigation" && "Litigation is typically conducted in public courts with established procedures. It may be less expensive initially but can become costly if appeals are filed."}
                {formData.dispute_resolution === "arbitration" && "Arbitration is typically private, potentially faster, and the decision is usually final with limited appeal rights. It's often preferred for international transactions."}
              </span>
            </div>
            
            {formData.dispute_resolution === "arbitration" && (
              <div className="form-group">
                <label htmlFor="arbitration_venue">
                  Arbitration Venue
                  <InfoTooltip content="The location where arbitration will take place. Consider venues with established arbitration centers and cryptocurrency expertise." />
                </label>
                <input
                  type="text"
                  id="arbitration_venue"
                  name="arbitration_venue"
                  className="form-control"
                  value={formData.arbitration_venue}
                  onChange={handleChange}
                  placeholder="e.g., Singapore, London, New York"
                />
                <span className="form-hint">Common venues include Singapore, London, New York, Hong Kong, and Geneva.</span>
              </div>
            )}
            
            <div className="regulatory-info">
              <strong>Regulatory Note:</strong> Due to the global nature of blockchain technology, jurisdictional issues can be complex in token sales. Consider carefully which governing law and dispute resolution mechanisms are most appropriate for your situation. Some jurisdictions like Singapore, Switzerland, and Wyoming have developed specific legal frameworks for digital assets, which can provide greater clarity. The choice of governing law may significantly impact how the token is regulated and what compliance obligations apply.
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