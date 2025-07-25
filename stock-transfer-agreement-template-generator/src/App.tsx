import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { 
  FormData, 
  DEFAULT_FORM_DATA, 
  STEP_NAMES, 
  TOTAL_STEPS,
  SELLER_REP_OPTIONS,
  BUYER_REP_OPTIONS,
  DISPUTE_RESOLUTION_OPTIONS,
  CONFIDENTIALITY_OPTIONS
} from './types';
import { formatDate, formatCurrency, isValidPayPalTransactionId } from './utils/formatting';
import { saveFormDataToStorage, loadFormDataFromStorage, savePaymentStatus, loadPaymentStatus } from './utils/storage';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

function App() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPaid, setIsPaid] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copyMessage, setCopyMessage] = useState(false);
  const [highlightedField, setHighlightedField] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [recoveryTxnId, setRecoveryTxnId] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Load data on mount
  useEffect(() => {
    const storedData = loadFormDataFromStorage();
    if (storedData) {
      setFormData(storedData);
    }

    const { isPaid: storedPaid, transactionId: storedTxnId } = loadPaymentStatus();
    if (storedPaid) {
      setIsPaid(true);
      setTransactionId(storedTxnId || '');
    }

    // Check URL for payment return
    checkPaymentReturn();
  }, []);

  const checkPaymentReturn = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment') === 'success';
    const token = urlParams.get('token');
    const paymentId = urlParams.get('paymentId');
    const txnParameter = urlParams.get('tx');

    if (paymentSuccess || token || paymentId || txnParameter) {
      const txnId = txnParameter || paymentId || token || 'paypal-return';
      markAsPaid(txnId);
      setTimeout(() => setShowSuccess(true), 1000);
    }
  }, []);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      saveFormDataToStorage(newData);
      return newData;
    });
  }, []);

  const markAsPaid = useCallback((txnId: string = 'direct') => {
    setIsPaid(true);
    setTransactionId(txnId);
    savePaymentStatus(true, txnId);
  }, []);

  const handleTransactionRecovery = useCallback(() => {
    if (recoveryTxnId && isValidPayPalTransactionId(recoveryTxnId)) {
      markAsPaid(recoveryTxnId);
      setShowSuccess(true);
      return true;
    }
    alert('Transaction ID format not recognized. Please try again.');
    return false;
  }, [recoveryTxnId, markAsPaid]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      setHighlightedField('');
    }
  }, []);

  const handleFieldChange = useCallback((field: string, value: string | string[]) => {
    setHighlightedField(field);
    updateFormData({ [field]: value });
    
    // Clear copy message when user makes changes
    setCopyMessage(false);
    
    // Clear highlight after a delay
    setTimeout(() => setHighlightedField(''), 2000);
  }, [updateFormData]);

  const generateAgreementHtml = useCallback(() => {
    const agreementDate = formatDate(formData.agreementDate) || '[DATE]';
    const closingDate = formData.closingDate ? formatDate(formData.closingDate) : agreementDate;
    const purchasePrice = formatCurrency(formData.purchasePrice);

    // Generate confidentiality clause
    let confidentialityClause = '';
    if (formData.confidentiality === 'standard') {
      confidentialityClause = `<p class="paragraph">Both Seller and Buyer agree to maintain in strict confidence all terms and conditions of this Agreement and shall not disclose such information to any third party without the prior written consent of the other party, unless required by law or court order.</p>`;
    } else if (formData.confidentiality === 'enhanced') {
      confidentialityClause = `<p class="paragraph">Both Seller and Buyer agree to maintain in strict confidence all terms and conditions of this Agreement, as well as all business information, trade secrets, financial data, and other proprietary information disclosed in connection with this Agreement. Neither party shall disclose such information to any third party without the prior written consent of the other party, unless required by law or court order. This confidentiality obligation shall survive the termination of this Agreement.</p>`;
    } else {
      confidentialityClause = `<p class="paragraph">The parties acknowledge that certain disclosures may be required by law, regulation, or legal process, and nothing in this Agreement shall prevent either party from making such legally required disclosures.</p>`;
    }

    // Generate dispute resolution clause
    let disputeResolutionClause = '';
    if (formData.disputeResolution === 'arbitration') {
      disputeResolutionClause = `<p class="paragraph">Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved through binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The place of arbitration shall be ${formData.governingLaw}. The arbitration shall be conducted by a single arbitrator. The decision of the arbitrator shall be final and binding upon the parties.</p>`;
    } else if (formData.disputeResolution === 'litigation') {
      disputeResolutionClause = `<p class="paragraph">Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved through litigation in the state or federal courts located in ${formData.governingLaw}. Each party hereby submits to the exclusive jurisdiction of such courts.</p>`;
    } else if (formData.disputeResolution === 'mediation-arbitration') {
      disputeResolutionClause = `<p class="paragraph">Any dispute, controversy, or claim arising out of or relating to this Agreement shall first be submitted to mediation in accordance with the Commercial Mediation Rules of the American Arbitration Association. If the dispute is not resolved within 60 days after the initiation of mediation, it shall be resolved through binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The place of mediation and arbitration shall be ${formData.governingLaw}. The arbitration shall be conducted by a single arbitrator. The decision of the arbitrator shall be final and binding upon the parties.</p>`;
    }

    return `
      <div class="document-title">STOCK TRANSFER AGREEMENT</div>
      
      <div class="document-section" id="section-parties">
        <div class="section-content">
          <p class="paragraph">THIS STOCK TRANSFER AGREEMENT (the "Agreement") is entered into as of ${agreementDate}, by and between ${formData.sellerName}, a ${formData.sellerEntity}, with its principal place of business at ${formData.sellerAddress} (the "Seller"), and ${formData.buyerName}, a ${formData.buyerEntity}, with its principal place of business at ${formData.buyerAddress} (the "Buyer").</p>
        </div>
      </div>
      
      <div class="document-section" id="section-transfer">
        <div class="section-title">1. TRANSFER OF STOCK AND PURCHASE PRICE</div>
        <div class="section-content">
          <p class="paragraph">1.1 Subject to the terms and conditions set forth in this Agreement, Seller hereby sells, assigns, transfers, and delivers to Buyer, and Buyer hereby purchases and acquires from Seller, ${formData.sharesNumber} shares of ${formData.shareType} (the "Shares") of ${formData.companyName}.</p>
          
          <p class="paragraph">1.2 The purchase price for the Shares shall be ${purchasePrice} (the "Purchase Price"), payable by Buyer to Seller on the closing date (the "Closing Date").</p>
          
          <p class="paragraph">1.3 At closing, Seller shall deliver to Buyer a duly endorsed stock certificate representing the Shares, and Buyer shall deliver to Seller the Purchase Price.</p>
          
          <p class="paragraph">1.4 The closing of the transaction contemplated by this Agreement (the "Closing") shall take place on ${closingDate}, or such other date as mutually agreed upon by the parties (the "Closing Date").</p>
        </div>
      </div>
      
      <div class="document-section" id="section-reps">
        <div class="section-title">2. REPRESENTATIONS AND WARRANTIES</div>
        <div class="section-content">
          <p class="paragraph">2.1 <strong>Seller Representations and Warranties.</strong> Seller represents and warrants to Buyer that:</p>
          
          <p class="paragraph">(a) It has the power and authority to execute and deliver this Agreement, and this Agreement constitutes a legal, valid, and binding obligation, enforceable against Seller;</p>
          
          <p class="paragraph">(b) The execution, delivery, and performance of this Agreement by Seller does not conflict with any laws, regulations, orders, or agreements to which Seller is subject;</p>
          
          <p class="paragraph">(c) Seller has good and marketable title to the Shares, free and clear of all liens, encumbrances, and restrictions of any kind;</p>
          
          ${formData.sellerReps.includes('no-conflicts') ? '<p class="paragraph">(d) The transfer of the Shares does not violate any agreement, contract, or understanding to which Seller is a party or by which Seller is bound;</p>' : ''}
          
          ${formData.sellerReps.includes('ownership') ? `<p class="paragraph">(${formData.sellerReps.includes('no-conflicts') ? 'e' : 'd'}) Seller is the sole owner of the Shares and has not granted any options, warrants, or other rights to purchase or otherwise acquire the Shares;</p>` : ''}
          
          ${formData.sellerReps.includes('no-litigation') ? `<p class="paragraph">(${formData.sellerReps.filter(rep => ['no-conflicts', 'ownership'].includes(rep)).length === 2 ? 'f' : formData.sellerReps.filter(rep => ['no-conflicts', 'ownership'].includes(rep)).length === 1 ? 'e' : 'd'}) There is no pending or threatened litigation, arbitration, or administrative proceeding affecting the Shares or that would impair Seller's ability to comply with the terms of this Agreement;</p>` : ''}
          
          ${formData.sellerReps.includes('comp-good-standing') ? `<p class="paragraph">(${formData.sellerReps.filter(rep => ['no-conflicts', 'ownership', 'no-litigation'].includes(rep)).length === 3 ? 'g' : formData.sellerReps.filter(rep => ['no-conflicts', 'ownership', 'no-litigation'].includes(rep)).length === 2 ? 'f' : formData.sellerReps.filter(rep => ['no-conflicts', 'ownership', 'no-litigation'].includes(rep)).length === 1 ? 'e' : 'd'}) ${formData.companyName} is duly organized, validly existing, and in good standing under the laws of its jurisdiction of incorporation;</p>` : ''}
          
          <p class="paragraph">2.2 <strong>Buyer Representations and Warranties.</strong> Buyer represents and warrants to Seller that:</p>
          
          <p class="paragraph">(a) It has the power and authority to execute and deliver this Agreement, and this Agreement constitutes a legal, valid, and binding obligation, enforceable against Buyer;</p>
          
          <p class="paragraph">(b) The execution, delivery, and performance of this Agreement by Buyer does not conflict with any laws, regulations, orders, or agreements to which Buyer is subject;</p>
          
          ${formData.buyerReps.includes('financial-ability') ? '<p class="paragraph">(c) Buyer has the financial ability to complete the purchase of the Shares and to make all payments required under this Agreement;</p>' : ''}
          
          ${formData.buyerReps.includes('accredited') ? `<p class="paragraph">(${formData.buyerReps.includes('financial-ability') ? 'd' : 'c'}) Buyer is an "accredited investor" as defined in Rule 501(a) of Regulation D promulgated under the Securities Act of 1933, as amended;</p>` : ''}
          
          ${formData.buyerReps.includes('investment-purpose') ? `<p class="paragraph">(${formData.buyerReps.filter(rep => ['financial-ability', 'accredited'].includes(rep)).length === 2 ? 'e' : formData.buyerReps.filter(rep => ['financial-ability', 'accredited'].includes(rep)).length === 1 ? 'd' : 'c'}) Buyer is acquiring the Shares for investment purposes only and not with a view to distribution or resale in violation of applicable securities laws;</p>` : ''}
          
          ${formData.customReps ? `<p class="paragraph">2.3 <strong>Additional Representations and Warranties.</strong> The parties further represent and warrant that:</p><p class="paragraph">${formData.customReps}</p>` : ''}
        </div>
      </div>
      
      <div class="document-section" id="section-confidentiality">
        <div class="section-title">3. CONFIDENTIALITY</div>
        <div class="section-content">
          ${confidentialityClause}
        </div>
      </div>
      
      <div class="document-section" id="section-legal">
        <div class="section-title">4. GENERAL</div>
        <div class="section-content">
          <p class="paragraph">4.1 <strong>Governing Law.</strong> This Agreement shall be governed by and construed in accordance with the laws of the State of ${formData.governingLaw}, without giving effect to any choice of law or conflict of law provisions.</p>
          
          <p class="paragraph">4.2 <strong>Dispute Resolution.</strong> ${disputeResolutionClause}</p>
          
          <p class="paragraph">4.3 <strong>Entire Agreement.</strong> This Agreement constitutes the entire agreement and understanding between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, with respect to such subject matter.</p>
          
          ${formData.customTerms ? `<p class="paragraph">4.4 <strong>Additional Terms.</strong> ${formData.customTerms}</p>` : ''}
        </div>
      </div>
      
      <div class="document-section" id="section-signatures">
        <div class="section-content">
          <p class="paragraph">IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.</p>
          
          <div class="signatures-wrapper">
            <div class="signature-column">
              <p><strong>SELLER:</strong></p>
              <p>${formData.sellerName}</p>
              <div class="signature-line"></div>
              <p>By: ${formData.sellerSignatory}</p>
              <p>Title: ${formData.sellerTitle}</p>
            </div>
            
            <div class="signature-column">
              <p><strong>BUYER:</strong></p>
              <p>${formData.buyerName}</p>
              <div class="signature-line"></div>
              <p>By: ${formData.buyerSignatory}</p>
              <p>Title: ${formData.buyerTitle}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }, [formData]);

  const generatePlainText = useCallback(() => {
    const html = generateAgreementHtml();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    let content = tempDiv.textContent || tempDiv.innerText || '';
    content = content.replace(/\s+/g, ' ');
    content = content.replace('STOCK TRANSFER AGREEMENT', 'STOCK TRANSFER AGREEMENT\n');
    content = content.replace(/(\s)(\d+\.\s+[A-Z])/g, '\n\n$2');
    content = content.replace(/(\s)(\d+\.\d+\s+[A-Z])/g, '\n\n$2');
    content = content.replace(/SELLER: (.*?)(\s)By:/, 'SELLER: $1\nBy:');
    content = content.replace(/By: (.*?)(\s)Title:/, 'By: $1\nTitle:');
    content = content.replace('IN WITNESS WHEREOF', '\n\nIN WITNESS WHEREOF');
    content = content.replace('BUYER:', '\n\nBUYER:');
    content = content.replace(/(\w\))([\s\S](?!\n))/g, '$1\n$2');
    content = content.replace(/\n{3,}/g, '\n\n');
    
    return content;
  }, [generateAgreementHtml]);

  const handleCopy = useCallback(async () => {
    if (!isPaid) {
      alert('Please purchase the agreement to enable copying.');
      return;
    }
    
    try {
      const text = generatePlainText();
      await navigator.clipboard.writeText(text);
      setCopyMessage(true);
      setTimeout(() => setCopyMessage(false), 3000);
    } catch (err) {
      console.error('Could not copy text: ', err);
      alert('Failed to copy agreement. Please try selecting and copying the text manually.');
    }
  }, [isPaid, generatePlainText]);

  const handleDownload = useCallback(async () => {
    if (!isPaid) {
      alert('Please purchase the agreement to enable downloading.');
      return;
    }
    
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `Stock_Transfer_Agreement_${dateStr}.docx`;
      
      // Create simplified DOCX with essential content
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "STOCK TRANSFER AGREEMENT",
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: generatePlainText(),
                  size: 22
                })
              ]
            })
          ]
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);
    } catch (error) {
      console.error("DOCX generation error:", error);
      alert("Unable to download. Please try using the copy button instead.");
    }
  }, [isPaid, generatePlainText]);

  const handleReset = useCallback(() => {
    setFormData({
      ...DEFAULT_FORM_DATA,
      agreementDate: new Date().toISOString().split('T')[0]
    });
    setCurrentStep(1);
    setShowResults(false);
    setCopyMessage(false);
    setHighlightedField('');
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="question-step active">
            <h2 className="step-title">Parties Information</h2>
            <p className="step-description">Provide information about the parties involved in the stock transfer.</p>
            
            <div className="form-group">
              <label>Seller Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.sellerName}
                onChange={(e) => handleFieldChange('sellerName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="form-group">
              <label>Seller Entity Type</label>
              <select
                className="form-input"
                value={formData.sellerEntity}
                onChange={(e) => handleFieldChange('sellerEntity', e.target.value)}
              >
                <option value="corporation">Corporation</option>
                <option value="limited liability company">Limited Liability Company (LLC)</option>
                <option value="partnership">Partnership</option>
                <option value="individual">Individual</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Seller Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.sellerAddress}
                onChange={(e) => handleFieldChange('sellerAddress', e.target.value)}
                placeholder="Enter full address"
              />
            </div>
            
            <div className="form-group">
              <label>Buyer Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.buyerName}
                onChange={(e) => handleFieldChange('buyerName', e.target.value)}
                placeholder="Enter company or individual name"
              />
            </div>
            
            <div className="form-group">
              <label>Buyer Entity Type</label>
              <select
                className="form-input"
                value={formData.buyerEntity}
                onChange={(e) => handleFieldChange('buyerEntity', e.target.value)}
              >
                <option value="corporation">Corporation</option>
                <option value="limited liability company">Limited Liability Company (LLC)</option>
                <option value="partnership">Partnership</option>
                <option value="individual">Individual</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Buyer Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.buyerAddress}
                onChange={(e) => handleFieldChange('buyerAddress', e.target.value)}
                placeholder="Enter full address"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="question-step active">
            <h2 className="step-title">Stock Information</h2>
            <p className="step-description">Provide details about the stock being transferred.</p>
            
            <div className="form-group">
              <label>Agreement Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.agreementDate}
                onChange={(e) => handleFieldChange('agreementDate', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Company Name (whose stock is being transferred)</label>
              <input
                type="text"
                className="form-input"
                value={formData.companyName}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="form-group">
              <label>Number of Shares</label>
              <input
                type="number"
                className="form-input"
                value={formData.sharesNumber}
                onChange={(e) => handleFieldChange('sharesNumber', e.target.value)}
                placeholder="Enter number of shares"
              />
            </div>
            
            <div className="form-group">
              <label>Share Type</label>
              <select
                className="form-input"
                value={formData.shareType}
                onChange={(e) => handleFieldChange('shareType', e.target.value)}
              >
                <option value="common stock">Common Stock</option>
                <option value="preferred stock">Preferred Stock</option>
                <option value="Series A preferred stock">Series A Preferred Stock</option>
                <option value="Series B preferred stock">Series B Preferred Stock</option>
                <option value="restricted stock">Restricted Stock</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Purchase Price ($)</label>
              <input
                type="number"
                className="form-input"
                value={formData.purchasePrice}
                onChange={(e) => handleFieldChange('purchasePrice', e.target.value)}
                placeholder="Enter purchase price in USD"
              />
            </div>
            
            <div className="form-group">
              <label>Closing Date (leave blank if same as agreement date)</label>
              <input
                type="date"
                className="form-input"
                value={formData.closingDate}
                onChange={(e) => handleFieldChange('closingDate', e.target.value)}
              />
              <div className="form-helper">The date when shares will be transferred and payment made</div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="question-step active">
            <h2 className="step-title">Additional Representations</h2>
            <p className="step-description">Specify additional representations and warranties for the agreement.</p>
            
            <div className="form-group">
              <label>Additional Seller Representations</label>
              <div className="options-group">
                {SELLER_REP_OPTIONS.map(option => (
                  <label 
                    key={option.value}
                    className={`option-item ${formData.sellerReps.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => {
                      const newReps = formData.sellerReps.includes(option.value)
                        ? formData.sellerReps.filter(rep => rep !== option.value)
                        : [...formData.sellerReps, option.value];
                      handleFieldChange('sellerReps', newReps);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.sellerReps.includes(option.value)}
                      onChange={() => {}} // Handled by label click
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Additional Buyer Representations</label>
              <div className="options-group">
                {BUYER_REP_OPTIONS.map(option => (
                  <label 
                    key={option.value}
                    className={`option-item ${formData.buyerReps.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => {
                      const newReps = formData.buyerReps.includes(option.value)
                        ? formData.buyerReps.filter(rep => rep !== option.value)
                        : [...formData.buyerReps, option.value];
                      handleFieldChange('buyerReps', newReps);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.buyerReps.includes(option.value)}
                      onChange={() => {}} // Handled by label click
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Custom Representations and Warranties (Optional)</label>
              <textarea
                className="form-input"
                value={formData.customReps}
                onChange={(e) => handleFieldChange('customReps', e.target.value)}
                placeholder="Enter any additional custom representations or warranties"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="question-step active">
            <h2 className="step-title">Legal Terms</h2>
            <p className="step-description">Specify legal terms for the agreement.</p>
            
            <div className="form-group">
              <label>Governing Law</label>
              <select
                className="form-input"
                value={formData.governingLaw}
                onChange={(e) => handleFieldChange('governingLaw', e.target.value)}
              >
                <option value="Delaware">Delaware</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="Nevada">Nevada</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Dispute Resolution</label>
              <div className="options-group">
                {DISPUTE_RESOLUTION_OPTIONS.map(option => (
                  <label 
                    key={option.value}
                    className={`option-item ${formData.disputeResolution === option.value ? 'selected' : ''}`}
                    onClick={() => handleFieldChange('disputeResolution', option.value)}
                  >
                    <input
                      type="radio"
                      name="dispute-resolution"
                      checked={formData.disputeResolution === option.value}
                      onChange={() => {}} // Handled by label click
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Confidentiality</label>
              <div className="options-group">
                {CONFIDENTIALITY_OPTIONS.map(option => (
                  <label 
                    key={option.value}
                    className={`option-item ${formData.confidentiality === option.value ? 'selected' : ''}`}
                    onClick={() => handleFieldChange('confidentiality', option.value)}
                  >
                    <input
                      type="radio"
                      name="confidentiality"
                      checked={formData.confidentiality === option.value}
                      onChange={() => {}} // Handled by label click
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Custom Legal Terms (Optional)</label>
              <textarea
                className="form-input"
                value={formData.customTerms}
                onChange={(e) => handleFieldChange('customTerms', e.target.value)}
                placeholder="Enter any additional custom legal terms"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="question-step active">
            <h2 className="step-title">Signature Information</h2>
            <p className="step-description">Provide information about the signatories of the agreement.</p>
            
            <div className="form-group">
              <label>Seller Signatory Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.sellerSignatory}
                onChange={(e) => handleFieldChange('sellerSignatory', e.target.value)}
                placeholder="Enter name of person signing for seller"
              />
            </div>
            
            <div className="form-group">
              <label>Seller Signatory Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.sellerTitle}
                onChange={(e) => handleFieldChange('sellerTitle', e.target.value)}
                placeholder="Enter title of seller signatory"
              />
            </div>
            
            <div className="form-group">
              <label>Buyer Signatory Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.buyerSignatory}
                onChange={(e) => handleFieldChange('buyerSignatory', e.target.value)}
                placeholder="Enter name of person signing for buyer"
              />
            </div>
            
            <div className="form-group">
              <label>Buyer Signatory Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.buyerTitle}
                onChange={(e) => handleFieldChange('buyerTitle', e.target.value)}
                placeholder="Enter title of buyer signatory"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderNavigation = () => (
    <div className="form-navigation">
      <button
        type="button"
        className="nav-btn btn-back"
        disabled={currentStep === 1}
        onClick={() => goToStep(currentStep - 1)}
      >
        Back
      </button>
      <button
        type="button"
        className="nav-btn btn-next"
        onClick={() => {
          if (currentStep === TOTAL_STEPS) {
            setShowResults(true);
          } else {
            goToStep(currentStep + 1);
          }
        }}
      >
        {currentStep === TOTAL_STEPS ? 'Generate Agreement' : 'Next'}
      </button>
    </div>
  );

  const renderPreview = () => {
    const agreementHtml = generateAgreementHtml();
    
    return (
      <div className="preview-container">
        <div className="preview-header">
          <div className="preview-title">Agreement Preview</div>
          <div className="preview-note">Updates as you complete the form</div>
        </div>
        
        <div className={`preview-box ${isPaid ? 'paid' : ''}`} ref={previewRef}>
          <div 
            className="document-template"
            dangerouslySetInnerHTML={{ __html: agreementHtml }}
          />
          
          {!isPaid && (
            <>
              <div className="gradient-fade" />
              <div className="paywall-overlay">
                <div className="paywall-icon">🔒</div>
                <div className="paywall-title">Unlock Your Stock Transfer Agreement</div>
                <div className="paywall-description">
                  Get immediate access to download and copy your professional-grade agreement.
                </div>
                
                <div className="price-container">
                  <div className="price-description">One-time payment for your complete agreement</div>
                </div>
                
                <div className="payment-button-container">
                  <form 
                    action="https://www.paypal.com/ncp/payment/RB2AHJKT26N68" 
                    method="post" 
                    target="_blank"
                    style={{display:'inline-grid', justifyItems:'center', alignContent:'start', gap:'0.5rem'}}
                  >
                    <input type="hidden" name="return" value="https://terms.law/2024/04/11/stock-transfer-agreements-101-a-guide-template-for-business-owners-and-investors/?payment=success" />
                    <input className="pp-RB2AHJKT26N68" type="submit" value="Pay Now" />
                    <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
                    <section>Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" style={{height:'0.875rem', verticalAlign:'middle'}} /></section>
                  </form>
                </div>
                
                <div className="mobile-payment-notice">
                  <small>On mobile devices: After payment, you may need to manually return to this page. Your form data will be preserved.</small>
                </div>
                
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Legally-sound stock transfer agreement</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Customized to your specific details</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Download as editable DOCX file</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Immediate access after payment</div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {isPaid && (
            <div className="payment-badge active">Premium Unlocked</div>
          )}
        </div>
        
        {!isPaid && (
          <div className="recovery-section active">
            <div className="recovery-title">Having trouble accessing your document?</div>
            <div className="recovery-description">If you've already paid but don't see your document, enter your transaction ID below to restore access:</div>
            <div className="recovery-form">
              <input
                type="text"
                className="recovery-input"
                placeholder="Transaction ID from PayPal receipt"
                value={recoveryTxnId}
                onChange={(e) => setRecoveryTxnId(e.target.value)}
              />
              <button 
                className="recovery-button"
                onClick={handleTransactionRecovery}
              >
                Restore Access
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => (
    <div className={`results-container ${showResults ? 'active' : ''}`}>
      <div className="results-header">
        <h2 className="results-title">Your Stock Transfer Agreement</h2>
        <p className="results-description">
          {isPaid ? 'Your customized agreement is ready. You can download it or copy it to clipboard.' : 'Your customized agreement is ready. Purchase to download or copy to clipboard.'}
        </p>
      </div>
      
      {!isPaid && (
        <div style={{textAlign: 'center', margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
          <div className="paywall-title" style={{marginBottom: '15px'}}>Unlock Your Stock Transfer Agreement</div>
          
          <div className="payment-button-container" style={{margin: '15px auto', maxWidth: '300px'}}>
            <form 
              action="https://www.paypal.com/ncp/payment/RB2AHJKT26N68" 
              method="post" 
              target="_blank"
              style={{display:'inline-grid', justifyItems:'center', alignContent:'start', gap:'0.5rem'}}
            >
              <input type="hidden" name="return" value="https://terms.law/2024/04/11/stock-transfer-agreements-101-a-guide-template-for-business-owners-and-investors/?payment=success" />
              <input className="pp-RB2AHJKT26N68" type="submit" value="Pay Now" />
              <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
              <section>Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" style={{height:'0.875rem', verticalAlign:'middle'}} /></section>
            </form>
          </div>
          
          <div className="mobile-payment-notice">
            <small>On mobile devices: After payment, you may need to manually return to this page. Your form data will be preserved.</small>
          </div>
        </div>
      )}
      
      {!isPaid && (
        <div className="recovery-section" style={{display: 'block', marginTop: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px'}}>
          <div className="recovery-title">Already paid? Unlock your document</div>
          <div className="recovery-description">If you've already paid but don't see your document, enter your transaction ID below to restore access:</div>
          <div className="recovery-form">
            <input
              type="text"
              className="recovery-input"
              placeholder="Transaction ID from PayPal receipt"
              value={recoveryTxnId}
              onChange={(e) => setRecoveryTxnId(e.target.value)}
              style={{flex: 1, minWidth: '200px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            <button 
              className="recovery-button"
              onClick={handleTransactionRecovery}
              style={{padding: '8px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
            >
              Restore Access
            </button>
          </div>
        </div>
      )}
      
      <div className="form-actions" style={{marginTop: '25px'}}>
        <button
          type="button"
          className="btn btn-copy"
          disabled={!isPaid}
          onClick={handleCopy}
        >
          Copy Agreement
        </button>
        <span className={`copy-message ${copyMessage ? 'active' : ''}`}>Agreement copied!</span>
        <button
          type="button"
          className="btn btn-download"
          disabled={!isPaid}
          onClick={handleDownload}
        >
          Download as DOCX
        </button>
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleReset}
        >
          Start Over
        </button>
      </div>
      
      <a 
        href="#" 
        className="btn-consult"
        onClick={(e) => {
          e.preventDefault();
          // Calendly integration would go here
          alert('Legal consultation scheduling would open here');
        }}
      >
        Schedule Legal Consultation
      </a>
    </div>
  );

  if (showResults) {
    return (
      <div className="generator-container">
        <div className="generator-header">
          <h1>Stock Transfer Agreement Generator</h1>
          <p>Create a customized Stock Transfer Agreement in minutes</p>
        </div>
        {renderResults()}
        {showSuccess && (
          <div className={`success-overlay ${showSuccess ? 'active' : ''}`}>
            <div className="success-content">
              <div className="success-icon">✓</div>
              <div className="success-title">Payment Successful!</div>
              <div className="success-description">
                Your Stock Transfer Agreement has been unlocked. Click Continue to download your document.
              </div>
              <button 
                className="success-button"
                onClick={() => {
                  setShowSuccess(false);
                  setTimeout(handleDownload, 500);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1>Stock Transfer Agreement Generator</h1>
        <p>Create a customized Stock Transfer Agreement in minutes</p>
      </div>
      
      <div className="progress-container">
        <div className="progress-text">
          <span>Step {currentStep} of {TOTAL_STEPS}</span>
          <span>{STEP_NAMES[currentStep - 1]}</span>
        </div>
        <div className="progress-bar-outer">
          <div 
            className="progress-bar-inner" 
            style={{width: `${(currentStep / TOTAL_STEPS) * 100}%`}}
          />
        </div>
      </div>
      
      <div className="generator-content">
        <div className="form-container">
          {renderStep()}
          {renderNavigation()}
        </div>
        
        {renderPreview()}
      </div>
      
      {showSuccess && (
        <div className={`success-overlay ${showSuccess ? 'active' : ''}`}>
          <div className="success-content">
            <div className="success-icon">✓</div>
            <div className="success-title">Payment Successful!</div>
            <div className="success-description">
              Your Stock Transfer Agreement has been unlocked. Click Continue to download your document.
            </div>
            <button 
              className="success-button"
              onClick={() => {
                setShowSuccess(false);
                setTimeout(handleDownload, 500);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;