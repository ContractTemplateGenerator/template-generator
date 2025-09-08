import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState({
    parties: [
      { name: '', email: '' },
      { name: '', email: '' },
      { name: '', email: '' }
    ],
    stateJurisdiction: '',
    effectiveDate: '',
    duration: '3',
    liquidatedDamages: '10000',
    disputeResolution: 'arbitration',
    includeSTIProtection: true,
    includeSocialMediaRestrictions: true,
    includeVenueProtection: true,
    includeGroupChatProtection: true,
    includeUnanimousConsent: true,
    digitalContentHandling: 'deleteUponRequest',
    customDigitalHandling: '',
    additionalTerms: '',
    includeJoinderForm: true
  });

  const [activeTab, setActiveTab] = useState('parties');
  const [previewContent, setPreviewContent] = useState('');

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming', 'District of Columbia'
  ];

  const handleInputChange = (field, value, index = null) => {
    if (field === 'parties') {
      const newParties = [...formData.parties];
      newParties[index] = { ...newParties[index], ...value };
      setFormData(prev => ({ ...prev, parties: newParties }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addParty = () => {
    setFormData(prev => ({
      ...prev,
      parties: [...prev.parties, { name: '', email: '' }]
    }));
  };

  const removeParty = (index) => {
    if (formData.parties.length > 3) {
      setFormData(prev => ({
        ...prev,
        parties: prev.parties.filter((_, i) => i !== index)
      }));
    }
  };

  const generateNDA = () => {
    const jurisdictionText = formData.stateJurisdiction === "District of Columbia" 
      ? "District of Columbia" 
      : `State of ${formData.stateJurisdiction}`;

    const partyNames = formData.parties
      .filter(party => party.name.trim())
      .map(party => party.name.trim());

    const partyList = partyNames
      .map((name, index) => `${name} ("Party ${index + 1}")`)
      .join(', ');

    const effectiveDateFormatted = formData.effectiveDate 
      ? new Date(formData.effectiveDate).toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })
      : '_______________';

    const disputeText = formData.disputeResolution === 'arbitration'
      ? "Any dispute arising out of or relating to this Agreement shall be resolved through binding confidential arbitration in accordance with the rules of the American Arbitration Association."
      : formData.disputeResolution === 'mediation'
      ? "Any dispute arising out of or relating to this Agreement shall first be submitted to mediation. If mediation is unsuccessful, the dispute shall then be resolved through binding confidential arbitration in accordance with the rules of the American Arbitration Association."
      : "Any dispute arising out of or relating to this Agreement shall be resolved through litigation in the appropriate courts with jurisdiction over the matter.";

    const stiProtectionClause = formData.includeSTIProtection
      ? `<p><strong>7. HEALTH INFORMATION PROTECTION</strong></p>
         <p>Any health information, including but not limited to STI test results, medical conditions, or health-related communications shared between the Parties, shall be treated as highly confidential information subject to the strictest protections under this Agreement. No Party shall disclose another Party's health information to any third party without explicit written consent, except as required by law or for emergency medical treatment.</p>`
      : '';

    const socialMediaClause = formData.includeSocialMediaRestrictions
      ? `<p><strong>8. SOCIAL MEDIA AND DIGITAL RESTRICTIONS</strong></p>
         <p>No Party shall tag, mention, reference, or identify any other Party on any social media platform, dating application, or public digital forum without explicit written consent. This includes but is not limited to posting photos, videos, or comments that could identify other Parties or reveal their participation in activities covered by this Agreement.</p>`
      : '';

    const venueProtectionClause = formData.includeVenueProtection
      ? `<p><strong>9. VENUE AND LOCATION PRIVACY</strong></p>
         <p>All details regarding locations where activities occur, including but not limited to private residences, clubs, events, hotels, or other venues, shall remain strictly confidential. No Party shall disclose addresses, venue names, event details, or any information that could identify or lead to the identification of locations used for activities covered by this Agreement.</p>`
      : '';

    const groupChatClause = formData.includeGroupChatProtection
      ? `<p><strong>10. GROUP COMMUNICATIONS PROTECTION</strong></p>
         <p>All group communications, including but not limited to group text messages, shared photos or videos, private social media groups, email chains, and any other multi-party communications, are subject to the confidentiality obligations of this Agreement. Screenshots, forwarding, or sharing of group communications outside the group is strictly prohibited.</p>`
      : '';

    const unanimousConsentClause = formData.includeUnanimousConsent
      ? `<p><strong>11. UNANIMOUS CONSENT FOR MEDIA</strong></p>
         <p>The creation, recording, or sharing of any photos, videos, audio recordings, or other media depicting or relating to activities covered by this Agreement requires the prior written consent of ALL Parties. No media may be created, distributed, or retained without unanimous written agreement from every Party involved.</p>`
      : '';

    const digitalHandlingText = formData.digitalContentHandling === 'custom' && formData.customDigitalHandling
      ? formData.customDigitalHandling
      : formData.digitalContentHandling === 'deleteUponRequest'
      ? "Any digital content containing Confidential Information must be deleted upon written request by any Party."
      : formData.digitalContentHandling === 'deleteUponTermination'
      ? "Any digital content containing Confidential Information must be deleted upon termination of this Agreement or any Party's withdrawal from the group."
      : "Any digital content containing Confidential Information may be kept but never distributed to any third party without unanimous written consent of all Parties.";

    const joinderFormSection = formData.includeJoinderForm
      ? `<p><strong>15. JOINDER OF ADDITIONAL PARTIES</strong></p>
         <p>New parties may join this Agreement by executing the attached Joinder Agreement, which incorporates all terms and conditions of this Agreement. The addition of new parties requires unanimous written consent of all existing Parties. Upon execution of a Joinder Agreement, new parties become bound by all obligations and entitled to all protections under this Agreement as if they were original signatories.</p>`
      : '';

    const content = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 11pt; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; font-size: 14pt; margin-bottom: 30px;">MULTI-PARTY RELATIONSHIP PRIVACY NON-DISCLOSURE AGREEMENT</h1>
        
        <p>This Multi-Party Non-Disclosure Agreement (the "Agreement") is entered into by and between the following parties (collectively, the "Parties"):</p>
        <p style="margin-left: 20px;">${partyList || '[Party names will appear here]'}</p>
        
        <p><strong>EFFECTIVE DATE:</strong> This Agreement is effective as of ${effectiveDateFormatted} (the "Effective Date").</p>
        
        <p><strong>1. PURPOSE</strong></p>
        <p>The Parties wish to protect the confidentiality and privacy of information related to their consensual adult activities, relationships, and interactions. This Agreement ensures that all Parties can engage in private activities with confidence that their privacy, dignity, and personal information will be protected.</p>
        
        <p><strong>2. CONFIDENTIAL INFORMATION</strong></p>
        <p>For purposes of this Agreement, "Confidential Information" includes, but is not limited to:</p>
        <p>a) Personal identity information of all Parties, including names, contact information, employment details, and personal identification;<br>
        b) Photos, videos, and audio recordings of any activities or interactions between Parties;<br>
        c) All communications between Parties, including texts, emails, calls, and in-person conversations;<br>
        d) Details about the nature, scope, and participants of any relationship or activities;<br>
        e) Location information, venue details, and event specifics;<br>
        f) Health and medical information shared between Parties;<br>
        g) Social media interactions and digital communications;<br>
        h) Any other information that could identify Parties or their participation in activities covered by this Agreement.</p>
        
        <p><strong>3. OBLIGATIONS OF CONFIDENTIALITY</strong></p>
        <p>Each Party agrees to maintain strict confidentiality regarding all Confidential Information of every other Party. No Party shall disclose, distribute, share, or otherwise communicate any Confidential Information to third parties without the express written consent of ALL affected Parties.</p>
        
        <p><strong>4. EXCEPTIONS TO CONFIDENTIALITY</strong></p>
        <p>This Agreement does not restrict disclosure of information that:</p>
        <p>a) Is or becomes publicly available through no breach of this Agreement;<br>
        b) Is disclosed pursuant to court order or legal requirement, provided the disclosing Party gives prompt notice to all other Parties;<br>
        c) Is disclosed to report suspected criminal activity as required by law;<br>
        d) Is disclosed with the prior written consent of ALL Parties.</p>
        
        <p><strong>5. PERMITTED DISCLOSURES</strong></p>
        <p>Confidential Information may be disclosed only to:</p>
        <p>a) Legal counsel retained by a Party for advice relating to this Agreement;<br>
        b) Licensed healthcare providers when directly relevant to medical treatment;<br>
        c) Mental health professionals during therapy, subject to patient-therapist privilege.</p>
        
        <p><strong>6. DIGITAL CONTENT AND MEDIA</strong></p>
        <p>${digitalHandlingText} All digital content must be stored securely with appropriate password protection and encryption when possible.</p>
        
        ${stiProtectionClause}
        ${socialMediaClause}
        ${venueProtectionClause}
        ${groupChatClause}
        ${unanimousConsentClause}
        
        <p><strong>12. TERM AND DURATION</strong></p>
        <p>This Agreement shall remain in effect for ${formData.duration} years from the Effective Date. Confidentiality obligations shall survive termination of this Agreement and continue indefinitely.</p>
        
        <p><strong>13. REMEDIES AND ENFORCEMENT</strong></p>
        <p>In the event of a breach, the non-breaching Parties shall be entitled to seek monetary damages of $${parseInt(formData.liquidatedDamages).toLocaleString()} per breach as liquidated damages, plus injunctive relief. The Parties acknowledge that breach would cause irreparable harm for which monetary damages alone would be inadequate.</p>
        
        <p><strong>14. DISPUTE RESOLUTION</strong></p>
        <p>${disputeText}</p>
        
        ${joinderFormSection}
        
        <p><strong>16. GOVERNING LAW</strong></p>
        <p>This Agreement shall be governed by the laws of the ${jurisdictionText || '_______________'}, without regard to conflict of law principles.</p>
        
        <p><strong>17. SEVERABILITY</strong></p>
        <p>If any provision of this Agreement is found unenforceable, the remainder shall continue in full force and effect.</p>
        
        <p><strong>18. ENTIRE AGREEMENT</strong></p>
        <p>This Agreement constitutes the entire understanding between the Parties and may only be modified by written agreement signed by all Parties.</p>
        
        <p><strong>19. COUNTERPARTS</strong></p>
        <p>This Agreement may be executed in separate counterparts, including digital signatures and electronic transmission, each deemed an original.</p>
        
        ${formData.additionalTerms ? `<p><strong>20. ADDITIONAL TERMS</strong></p><p>${formData.additionalTerms}</p>` : ''}
        
        <div style="margin-top: 40px;">
          <p><strong>SIGNATURE PAGE FOLLOWS</strong></p>
          <p>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.</p>
          
          <div style="margin-top: 40px;">
            ${formData.parties.map((party, index) => `
              <div style="margin-bottom: 40px;">
                <p>_________________________________</p>
                <p>${party.name || `Party ${index + 1} Name`}</p>
                <p>Date: _____________</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setPreviewContent(content);
  };

  const generateJoinderForm = () => {
    const jurisdictionText = formData.stateJurisdiction === "District of Columbia" 
      ? "District of Columbia" 
      : `State of ${formData.stateJurisdiction}`;

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 11pt; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; font-size: 14pt; margin-bottom: 30px;">JOINDER AGREEMENT</h1>
        <p style="text-align: center;"><em>Multi-Party Relationship Privacy Non-Disclosure Agreement</em></p>
        
        <p>This Joinder Agreement ("Joinder") is entered into by _________________ ("New Party") to join the Multi-Party Relationship Privacy Non-Disclosure Agreement dated ${formData.effectiveDate || '_______________'} (the "Original Agreement").</p>
        
        <p><strong>JOINDER TERMS:</strong></p>
        
        <p>1. <strong>Incorporation:</strong> New Party hereby agrees to be bound by all terms, conditions, obligations, and provisions of the Original Agreement as if New Party were an original signatory thereto.</p>
        
        <p>2. <strong>Confidentiality Obligations:</strong> New Party acknowledges receiving copies of all Confidential Information subject to the Original Agreement and agrees to maintain strict confidentiality regarding all such information.</p>
        
        <p>3. <strong>Retroactive Effect:</strong> New Party's confidentiality obligations shall apply retroactively to any Confidential Information received prior to execution of this Joinder.</p>
        
        <p>4. <strong>Rights and Protections:</strong> New Party shall be entitled to all protections afforded to original Parties under the Original Agreement.</p>
        
        <p>5. <strong>Unanimous Consent:</strong> New Party acknowledges that joining required unanimous written consent of all existing Parties, which consent has been obtained.</p>
        
        <p>6. <strong>Governing Law:</strong> This Joinder shall be governed by the laws of the ${jurisdictionText || '_______________'}.</p>
        
        <p>7. <strong>Counterparts:</strong> This Joinder may be executed in counterparts, including digital signatures.</p>
        
        <div style="margin-top: 40px;">
          <p>IN WITNESS WHEREOF, New Party has executed this Joinder as of _____________, 20__.</p>
          
          <div style="margin-top: 40px;">
            <p>_________________________________</p>
            <p>New Party Signature</p>
            <p>Print Name: _________________________</p>
            <p>Date: _____________</p>
          </div>
          
          <div style="margin-top: 40px;">
            <p><strong>EXISTING PARTIES' CONSENT:</strong></p>
            <p>The undersigned existing Parties consent to New Party's joinder:</p>
            
            <div style="margin-top: 20px;">
              ${formData.parties.map((party, index) => `
                <div style="margin-bottom: 30px;">
                  <p>_________________________________</p>
                  <p>${party.name || `Party ${index + 1} Name`} - Date: _______</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    generateNDA();
  }, [formData]);

  const downloadDocument = (isJoinder = false) => {
    const content = isJoinder ? generateJoinderForm() : previewContent;
    const filename = isJoinder ? 'Joinder-Agreement.html' : 'Multi-Party-NDA.html';
    
    const htmlDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${isJoinder ? 'Joinder Agreement' : 'Multi-Party Privacy NDA'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.5; margin: 20px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `;
    
    const blob = new Blob([htmlDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="form-section">
          <h1>Multi-Party Privacy NDA Generator</h1>
          <p>Create a comprehensive non-disclosure agreement for polyamorous relationships, swinger activities, and multi-partner encounters (3+ participants). This attorney-drafted template ensures privacy protection for all parties involved.</p>
          
          <div className="warning-box">
            <strong>Legal Disclaimer:</strong> This generator provides a template based on general legal principles. While designed by a licensed attorney, it is not a substitute for personalized legal advice. Consider consulting with an attorney before finalizing any legal document.
          </div>

          <div className="tab-container">
            <div className="tab-nav">
              <button 
                className={`tab-btn ${activeTab === 'parties' ? 'active' : ''}`}
                onClick={() => setActiveTab('parties')}
              >
                1. Parties
              </button>
              <button 
                className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                onClick={() => setActiveTab('terms')}
              >
                2. Terms
              </button>
              <button 
                className={`tab-btn ${activeTab === 'protections' ? 'active' : ''}`}
                onClick={() => setActiveTab('protections')}
              >
                3. Protections
              </button>
              <button 
                className={`tab-btn ${activeTab === 'finalize' ? 'active' : ''}`}
                onClick={() => setActiveTab('finalize')}
              >
                4. Finalize
              </button>
            </div>

            {activeTab === 'parties' && (
              <div className="tab-content">
                <h2>Parties Information</h2>
                <div className="info-box">
                  Add all parties who will be bound by this agreement. Minimum 3 parties required.
                </div>

                {formData.parties.map((party, index) => (
                  <div key={index} className="party-section">
                    <h3>Party {index + 1}</h3>
                    <div className="form-group">
                      <label>Full Legal Name:</label>
                      <input
                        type="text"
                        value={party.name}
                        onChange={(e) => handleInputChange('parties', { name: e.target.value }, index)}
                        placeholder="e.g., Jane A. Smith"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address (optional):</label>
                      <input
                        type="email"
                        value={party.email}
                        onChange={(e) => handleInputChange('parties', { email: e.target.value }, index)}
                        placeholder="e.g., jane@example.com"
                      />
                    </div>
                    {formData.parties.length > 3 && (
                      <button 
                        className="remove-btn" 
                        onClick={() => removeParty(index)}
                      >
                        Remove Party
                      </button>
                    )}
                  </div>
                ))}

                <button className="add-btn" onClick={addParty}>
                  Add Another Party
                </button>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="tab-content">
                <h2>Agreement Terms</h2>
                
                <div className="form-group">
                  <label>Governing Law (State/Jurisdiction):</label>
                  <select
                    value={formData.stateJurisdiction}
                    onChange={(e) => handleInputChange('stateJurisdiction', e.target.value)}
                  >
                    <option value="">Select a State/Jurisdiction</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Effective Date:</label>
                  <input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Duration of Agreement:</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  >
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="5">5 years</option>
                    <option value="10">10 years</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Liquidated Damages Amount:</label>
                  <input
                    type="number"
                    value={formData.liquidatedDamages}
                    onChange={(e) => handleInputChange('liquidatedDamages', e.target.value)}
                    min="0"
                  />
                  <div className="info-box">
                    Reasonable amounts ($5k-$50k) are more enforceable than excessive penalties.
                  </div>
                </div>

                <div className="form-group">
                  <label>Dispute Resolution:</label>
                  <select
                    value={formData.disputeResolution}
                    onChange={(e) => handleInputChange('disputeResolution', e.target.value)}
                  >
                    <option value="arbitration">Private Confidential Arbitration</option>
                    <option value="mediation">Mediation then Confidential Arbitration</option>
                    <option value="court">Court Litigation</option>
                  </select>
                  <div className="info-box">
                    Confidential arbitration keeps disputes private, while court proceedings become public record.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'protections' && (
              <div className="tab-content">
                <h2>Enhanced Protections</h2>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.includeSTIProtection}
                      onChange={(e) => handleInputChange('includeSTIProtection', e.target.checked)}
                    />
                    STI/Health Information Protection
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.includeSocialMediaRestrictions}
                      onChange={(e) => handleInputChange('includeSocialMediaRestrictions', e.target.checked)}
                    />
                    Social Media Restrictions (tagging, posting, identifying)
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.includeVenueProtection}
                      onChange={(e) => handleInputChange('includeVenueProtection', e.target.checked)}
                    />
                    Venue/Location Privacy Protection
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.includeGroupChatProtection}
                      onChange={(e) => handleInputChange('includeGroupChatProtection', e.target.checked)}
                    />
                    Group Chat/Communication Protection
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.includeUnanimousConsent}
                      onChange={(e) => handleInputChange('includeUnanimousConsent', e.target.checked)}
                    />
                    Unanimous Consent for Media Creation
                  </label>
                </div>

                <div className="form-group">
                  <label>Digital Content Handling:</label>
                  <select
                    value={formData.digitalContentHandling}
                    onChange={(e) => handleInputChange('digitalContentHandling', e.target.value)}
                  >
                    <option value="deleteUponRequest">Must be deleted upon any party's request</option>
                    <option value="deleteUponTermination">Must be deleted when agreement ends</option>
                    <option value="noDistribution">May be kept but never distributed</option>
                    <option value="custom">Custom handling (specify below)</option>
                  </select>
                </div>

                {formData.digitalContentHandling === 'custom' && (
                  <div className="form-group">
                    <label>Custom Digital Content Handling:</label>
                    <textarea
                      rows="3"
                      value={formData.customDigitalHandling}
                      onChange={(e) => handleInputChange('customDigitalHandling', e.target.value)}
                      placeholder="Specify custom handling requirements..."
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'finalize' && (
              <div className="tab-content">
                <h2>Finalize Agreement</h2>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.includeJoinderForm}
                      onChange={(e) => handleInputChange('includeJoinderForm', e.target.checked)}
                    />
                    Include Joinder Form (allows new parties to join later)
                  </label>
                </div>

                <div className="form-group">
                  <label>Additional Terms (optional):</label>
                  <textarea
                    rows="4"
                    value={formData.additionalTerms}
                    onChange={(e) => handleInputChange('additionalTerms', e.target.value)}
                    placeholder="Add any additional terms not covered above..."
                  />
                </div>

                <div className="button-group">
                  <button 
                    className="btn-primary download-btn" 
                    onClick={() => downloadDocument(false)}
                  >
                    Download Multi-Party NDA
                  </button>
                  
                  {formData.includeJoinderForm && (
                    <button 
                      className="btn-secondary download-btn" 
                      onClick={() => downloadDocument(true)}
                    >
                      Download Joinder Form
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="preview-section">
          <h2>Live Preview</h2>
          <div className="preview-container">
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </div>
      </div>

      <div className="footer-info">
        <p>Created by <a href="https://terms.law" target="_blank" rel="noopener noreferrer">Terms.Law</a> | California Attorney Sergei Tokmakov (CA Bar #279869)</p>
        <p>For personalized legal assistance, <a href="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting" target="_blank" rel="noopener noreferrer">schedule a consultation</a></p>
      </div>
    </div>
  );
};

export default App;