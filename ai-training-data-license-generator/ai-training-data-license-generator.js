(function() {
  console.log("ai-training-data-license-generator.js: Script loaded. Waiting for DOMContentLoaded.");

  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed. Initializing React application.");

    try {
      if (typeof React === "undefined") {
        throw new Error("React not loaded. Application cannot start.");
      }
      if (typeof ReactDOM === "undefined") {
        throw new Error("ReactDOM not loaded. Application cannot start.");
      }
      if (typeof Babel === "undefined") {
        console.warn("Babel not loaded. JSX might not be transpiled if used outside script type='text/babel'.");
        // This might not be a critical error if all JSX is within <script type="text/babel">
      }
      if (typeof feather === "undefined") {
        console.warn("Feather Icons not loaded. Icons might not appear.");
      }

      const { useState, useEffect, useRef, useCallback } = React;

      // --- Icon Component ---
      const Icon = React.memo(({ name, size = "1em", color = "currentColor", ...props }) => {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`icon feather feather-${name} ${props.className || ''}`}
            dangerouslySetInnerHTML={{ __html: feather.icons[name] ? feather.icons[name].contents : '' }}
            {...props}
          />
        );
      });
      
      // --- Helper for generating sections ---
      const generateSection = (title, content, show = true) => {
        if (!show || !content || content.trim() === '') return '';
        return `\n\n${title.toUpperCase()}\n\n${content.trim()}`;
      };

      // --- Agreement Generation Logic ---
      const generateAgreementText = (data) => {
        let text = `AI TRAINING DATA LICENSE AGREEMENT`;

        text += generateSection('Parties', 
          `This AI Training Data License Agreement (hereinafter referred to as the "Agreement") is entered into as of ${data.effectiveDate || '[Effective Date]'} (the "Effective Date"), by and between:\n\n` +
          `${data.licensorName || '[Licensor Name]'}, a ${data.licensorEntity || '[Licensor Entity Type]'} with its principal place of business at ${data.licensorAddress || '[Licensor Address]'} ("Licensor"),\n\nAND\n\n` +
          `${data.licenseeCompany || '[Licensee Company Name]'}, a ${data.licenseeEntity || '[Licensee Entity Type]'} with its principal place of business at ${data.licenseeAddress || '[Licensee Address]'} ("Licensee").\n\n` +
          `Licensor and Licensee may be referred to individually as a "Party" and collectively as the "Parties".`
        );

        text += generateSection('Background',
          `WHEREAS, Licensor owns or has the necessary rights to the dataset known as "${data.datasetName || '[Dataset Name]'}" (the "Data"), as more fully described herein;\n` +
          `WHEREAS, Licensee desires to obtain a license to use the Data for the purpose of training, developing, and/or testing artificial intelligence models ("AI Models");\n` +
          `NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:`
        );

        // Section 1: Definitions (Simplified for this generator)
        let definitions = `1.1 "Data" means the dataset named "${data.datasetName}" consisting of ${data.datasetDescription.toLowerCase()}, provided in ${data.dataFormat} format, approximately ${data.dataSizeGB}GB in size. Data origin is ${data.dataOrigin}. Data will be accessed via ${data.dataAccessMethod}.`;
        definitions += `\n1.2 "Purpose" means the use of the Data solely for ${data.purposeRestrictions === 'specific-models' ? `training and developing the following AI Model types: ${Object.entries(data.modelTypes).filter(([_, v]) => v).map(([k]) => k.replace(/([A-Z])/g, ' $1').trim()).join(', ') || 'specified AI Models'}` : 'general AI model training and development by Licensee'}, and for associated research and internal testing.`;
        if (Object.values(data.usagePurposes).some(v => v)) {
            definitions += ` Permitted usage contexts include: ${Object.entries(data.usagePurposes).filter(([_,v])=>v).map(([k])=>k.replace(/([A-Z])/g, ' $1').trim()).join(', ')}.`;
        }
        text += generateSection('1. Definitions', definitions);

        // Section 2: License Grant
        let licenseGrant = `2.1 Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a ${data.licenseType}, ${data.sublicensing === 'permitted' ? 'sublicensable (as per Section 2.3)' : 'non-sublicensable'}, worldwide license during the Term (as defined below) to access, use, reproduce, and process the Data solely for the Purpose.`;
        licenseGrant += `\n2.2 Geographic Scope: ${data.geographicScope}.`;
        if (data.sublicensing === 'permitted') {
            licenseGrant += `\n2.3 Sublicensing: Licensee may grant sublicenses to its affiliates or third-party contractors solely for the Purpose, provided Licensee remains responsible for their compliance with this Agreement.`;
        } else if (data.sublicensing === 'with-approval') {
             licenseGrant += `\n2.3 Sublicensing: Licensee may not sublicense its rights without prior written consent from Licensor.`;
        }
        text += generateSection('2. License Grant', licenseGrant);
        
        // Section 3: Data Types and Restrictions
        let dataTypesContent = `3.1 The Data includes the following types: ${Object.entries(data.dataTypes).filter(([_,v])=>v).map(([k])=>k.replace(/([A-Z])/g, ' $1').trim()).join(', ')}.`;
        if(data.dataTypes.personalData) dataTypesContent += ` Licensee acknowledges Data contains personal data and agrees to comply with all applicable data privacy laws.`;
        if(data.industryRestrictions && data.industryRestrictions !== 'none') {
            dataTypesContent += `\n3.2 Industry Restrictions: The Data shall not be used in connection with the following industries: ${data.industryRestrictions}.`;
        }
        text += generateSection('3. Data Types and Restrictions', dataTypesContent);

        // Section 4: Intellectual Property
        let ipContent = `4.1 Ownership of Data: Licensor retains all right, title, and interest in and to the Data, including all intellectual property rights therein. No rights are granted to Licensee other than those expressly set forth in this Agreement.`;
        ipContent += `\n4.2 Ownership of AI Models: ${data.ownershipModels === 'licensee-owns' ? 'Licensee shall own all right, title, and interest in and to any AI Models developed by Licensee using the Data, subject to Licensor\'s underlying rights in the Data.' : (data.ownershipModels === 'licensor-owns' ? 'Licensor shall own all right, title, and interest in and to any AI Models developed by Licensee using the Data. Licensee agrees to assign all such rights to Licensor.' : 'Ownership of AI Models developed using the Data shall be determined by a separate written agreement between the Parties.')}`;
        if (data.attributionRequired === 'yes') {
            ipContent += `\n4.3 Attribution: Licensee shall provide attribution to Licensor in any public dissemination or product incorporating AI Models trained on the Data, in a manner mutually agreed upon by the Parties.`;
        }
        text += generateSection('4. Intellectual Property', ipContent);

        // Section 5: Compensation
        let compensationContent = '';
        if (data.compensationType === 'one-time') {
            compensationContent = `5.1 License Fee: In consideration for the license granted herein, Licensee shall pay Licensor a one-time fee of $${data.initialFee || '0'}.`;
        } else if (data.compensationType === 'royalty') {
            compensationContent = `5.1 Royalty: Licensee shall pay Licensor a royalty of ${data.royaltyPercent || '0'}% of Net Revenue derived from products or services incorporating AI Models trained on the Data. A minimum annual guarantee of $${data.minimumGuarantee || '0'} shall apply.`;
        } else if (data.compensationType === 'milestone') {
            compensationContent = `5.1 Milestone Payments: Licensee shall pay Licensor fees based on mutually agreed upon development or commercialization milestones. (Details to be specified in an appendix).`;
        } else {
             compensationContent = `5.1 No Fee: The license granted herein is provided at no cost to the Licensee, subject to compliance with the terms of this Agreement.`;
        }
        if (compensationContent) {
            compensationContent += `\n5.2 Payment Terms: All fees are due within 30 days of invoice, unless otherwise specified. All payments are non-refundable.`;
            text += generateSection('5. Compensation', compensationContent);
        }


        // Section 6: Term and Termination
        let termContent = `6.1 Term: This Agreement shall commence on the Effective Date and continue for a period of ${data.term || '1'} ${data.termUnit || 'year(s)'} (the "Initial Term"), unless terminated earlier as provided herein.`;
        if (data.renewalTerms === 'automatic') {
            termContent += `\n6.2 Renewal: Upon expiration of the Initial Term, this Agreement shall automatically renew for successive one (1) year periods unless either Party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.`;
        } else if (data.renewalTerms === 'manual') {
            termContent += `\n6.2 Renewal: This Agreement may be renewed upon mutual written agreement of the Parties.`;
        }
        termContent += `\n6.3 Termination: ${data.terminationRights === 'both-parties' ? 'Either Party may terminate this Agreement for material breach by the other Party, subject to a 30-day cure period. Either party may terminate for convenience with 90 days prior written notice.' : (data.terminationRights === 'licensor-only' ? 'Licensor may terminate this Agreement for material breach by Licensee, subject to a 30-day cure period, or for convenience with 90 days notice.' : 'Licensee may terminate this Agreement for material breach by Licensor, subject to a 30-day cure period, or for convenience with 90 days notice.')}`;
        termContent += `\n6.4 Effect of Termination: Upon termination or expiration, Licensee shall cease all use of the Data. Data retention shall be handled as follows: ${data.dataRetention === 'delete-all' ? 'Licensee must permanently delete all copies of the Data.' : (data.dataRetention === 'return-to-licensor' ? 'Licensee must return all copies of the Data to Licensor and certify deletion of any remaining copies.' : 'Licensee may retain the Data for archival purposes only, with no further use permitted, or as required by law.')}`;
        text += generateSection('6. Term and Termination', termContent);

        // Section 7: Warranties and Disclaimers
        let warrantiesContent = `7.1 Licensor Warranties: Licensor represents and warrants that: (a) it has ${data.rightsToClaim === 'all-necessary-rights' ? 'all necessary rights, power, and authority to grant the license' : 'the right to grant the license as specified'} herein;`;
        if (data.dataQualityWarranty) {
            warrantiesContent += ` (b) the Data will substantially conform to its description;`;
        }
        if (data.dataComplianceWarranty) {
            warrantiesContent += ` (c) to its knowledge, the Data has been collected and provided in compliance with applicable laws.`;
        }
        warrantiesContent += `\n7.2 Licensor Warranty Level: ${data.licensorWarranty === 'as-is' ? 'EXCEPT AS EXPRESSLY STATED IN SECTION 7.1, THE DATA IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.' : (data.licensorWarranty === 'limited' ? 'The warranties in Section 7.1 are Licensor\'s sole warranties regarding the Data.' : 'Licensor provides comprehensive warranties as detailed in Appendix A (to be attached).')}`;
        warrantiesContent += `\n7.3 DISCLAIMER: EXCEPT FOR THE EXPRESS WARRANTIES SET FORTH HEREIN, LICENSOR MAKES NO OTHER WARRANTIES, EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, WITH RESPECT TO THE DATA, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.`;
        text += generateSection('7. Warranties and Disclaimers', warrantiesContent);

        // Section 8: Indemnification
        let indemnificationContent = '';
        if (data.indemnification === 'mutual') {
            indemnificationContent = `8.1 Mutual Indemnification: Each Party (the "Indemnifying Party") shall indemnify, defend, and hold harmless the other Party (the "Indemnified Party"), its officers, directors, employees, and agents from and against any and all third-party claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to (a) the Indemnifying Party's gross negligence or willful misconduct, or (b) a material breach of its representations or warranties under this Agreement.`;
        } else if (data.indemnification === 'licensor-only') {
            indemnificationContent = `8.1 Licensor Indemnification: Licensor shall indemnify, defend, and hold harmless Licensee, its officers, directors, employees, and agents from and against any and all third-party claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to a claim that the Data, when used in accordance with this Agreement, infringes a third party's intellectual property rights.`;
        } else if (data.indemnification === 'licensee-only') {
             indemnificationContent = `8.1 Licensee Indemnification: Licensee shall indemnify, defend, and hold harmless Licensor, its officers, directors, employees, and agents from and against any and all third-party claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to Licensee's use of the Data in a manner not authorized by this Agreement or Licensee's AI Models.`;
        }
        text += generateSection('8. Indemnification', indemnificationContent, indemnificationContent !== '');

        // Section 9: Limitation of Liability
        let liabilityContent = `9.1 TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES) ARISING OUT OF OR RELATING TO THIS AGREEMENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`;
        if (data.liabilityLimit === 'fees-paid') {
            liabilityContent += `\n9.2 EXCEPT FOR OBLIGATIONS UNDER SECTION 8 (INDEMNIFICATION) OR A BREACH OF CONFIDENTIALITY, EACH PARTY'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY LICENSEE TO LICENSOR UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.`;
        } else if (data.liabilityLimit === 'specific-amount') {
            liabilityContent += `\n9.2 EXCEPT FOR OBLIGATIONS UNDER SECTION 8 (INDEMNIFICATION) OR A BREACH OF CONFIDENTIALITY, EACH PARTY'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT SHALL NOT EXCEED [Specify Amount, e.g., $100,000].`;
        }
        text += generateSection('9. Limitation of Liability', liabilityContent);

        // Section 10: Confidentiality (Standard Clause)
        text += generateSection('10. Confidentiality', 
          `10.1 Each Party agrees to maintain the confidentiality of any non-public information disclosed by the other Party, designated as confidential or which reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure ("Confidential Information"). Each Party agrees to use such Confidential Information solely for the purposes of this Agreement and not to disclose it to any third party without the prior written consent of the disclosing Party, except to its employees, agents, or contractors who have a need to know and are bound by similar confidentiality obligations.`
        );
        
        // Section 11: Governing Law and Dispute Resolution
        let disputeContent = `11.1 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the State of ${data.governingLaw || '[Governing State, e.g., California]'}, without regard to its conflict of laws principles.`;
        if (data.disputeResolution === 'arbitration') {
            disputeContent += `\n11.2 Dispute Resolution: Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration administered by [Arbitration Body, e.g., the American Arbitration Association] in accordance with its [Rules, e.g., Commercial Arbitration Rules]. The arbitration shall take place in [City, State for Arbitration]. The language of arbitration shall be English.`;
        } else if (data.disputeResolution === 'mediation-litigation') {
             disputeContent += `\n11.2 Dispute Resolution: The Parties shall first attempt to resolve any dispute through good faith negotiations. If unsuccessful, they shall submit the dispute to mediation. If mediation fails, the dispute shall be resolved by the state or federal courts located in ${data.governingLaw || '[Governing State]'}.`;
        } else { // litigation
             disputeContent += `\n11.2 Dispute Resolution: Any dispute arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts located in ${data.governingLaw || '[Governing State]'}.`;
        }
        text += generateSection('11. Governing Law and Dispute Resolution', disputeContent);

        // Section 12: General Provisions
        text += generateSection('12. General Provisions',
          `12.1 Entire Agreement: This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior or contemporaneous oral or written understandings, communications, or agreements.\n` +
          `12.2 Amendments: No amendment to or modification of this Agreement shall be valid unless in writing and signed by authorized representatives of both Parties.\n` +
          `12.3 Notices: All notices under this Agreement shall be in writing and sent to the addresses of the Parties first set forth above or to such other address as a Party may designate in writing.\n` +
          `12.4 Severability: If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.\n` +
          `12.5 Waiver: No waiver of any term or condition of this Agreement shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition.`
        );

        text += `\n\nIN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be executed by their duly authorized representatives as of the Effective Date.\n\n`;
        text += `LICENSOR:\n\nBy: ______________________________\nName: _____________________________\nTitle: ____________________________\nDate: _____________________________\n\n`;
        text += `LICENSEE:\n\nBy: ______________________________\nName: _____________________________\nTitle: ____________________________\nDate: _____________________________\n`;
        
        return text;
      };

      // --- Main Application Component ---
      const App = () => {
        const tabs = [
          { id: 'basic-info', label: 'Basic Info', icon: 'users' },
          { id: 'data-description', label: 'Data Details', icon: 'database' },
          { id: 'license-terms', label: 'License Grant', icon: 'file-text' },
          { id: 'data-usage', label: 'Usage & IP', icon: 'cpu' },
          { id: 'compensation', label: 'Compensation', icon: 'dollar-sign' },
          { id: 'warranties', label: 'Warranties & Liability', icon: 'shield' },
          { id: 'finalization', label: 'Governing Terms', icon: 'check-square' }
        ];

        const defaultData = {
          licensorName: 'Data Provider Inc.',
          licensorEntity: 'Corporation',
          licensorAddress: '123 Data Drive, Silicon Valley, CA 94000',
          licenseeCompany: 'AI Innovators LLC',
          licenseeEntity: 'Limited Liability Company',
          licenseeAddress: '456 Model Avenue, Tech Hub, WA 98000',
          effectiveDate: new Date().toISOString().split('T')[0],
          
          datasetName: 'General Purpose Training Dataset Alpha',
          datasetDescription: 'a diverse collection of anonymized text and image data suitable for foundational model training',
          dataOrigin: 'proprietary collection and public domain sources',
          dataAccessMethod: 'secure API endpoint',
          dataFormat: 'JSONL and JPG',
          dataSizeGB: '100',
          dataUpdateFrequency: 'quarterly',
          
          licenseType: 'non-exclusive',
          sublicensing: 'not-permitted',
          geographicScope: 'Worldwide',
          industryRestrictions: '', // Empty means none
          dataTypes: {
            text: true, images: true, audio: false, video: false, userGenerated: true,
            proprietaryContent: true, personalData: false, anonymizedData: true,
            structuredData: true, unstructuredData: true
          },
          
          purposeRestrictions: 'general-ai-training', // 'general-ai-training' or 'specific-models'
          modelTypes: { // Relevant if purposeRestrictions is 'specific-models'
            generativeText: true, generativeImage: true, languageModels: true, computerVision: true,
            generativeAudio: false, generativeVideo: false, classificationModels: false, 
            dataAnalytics: false, predictiveModels: false, sentimentAnalysis: false, recommendationSystems: false, naturalLanguageProcessing: true
          },
          usagePurposes: { // General contexts
            research: true, commercial: true, internalUse: true, 
            publicServices: false, militaryApplications: false, governmentSurveillance: false
          },
          ownershipModels: 'licensee-owns', // 'licensee-owns', 'licensor-owns', 'joint-tbd'
          attributionRequired: 'no', // 'yes', 'no', 'negotiable'
          
          compensationType: 'one-time', // 'one-time', 'royalty', 'milestone', 'none'
          initialFee: '25000',
          royaltyPercent: '5',
          minimumGuarantee: '10000',
          term: '2',
          termUnit: 'years',
          terminationRights: 'both-parties', // 'both-parties', 'licensor-only', 'licensee-only'
          renewalTerms: 'automatic', // 'automatic', 'manual', 'none'
          dataRetention: 'delete-all', // 'delete-all', 'return-to-licensor', 'archival-only'

          licensorWarranty: 'limited', // 'as-is', 'limited', 'comprehensive'
          rightsToClaim: 'all-necessary-rights', // 'all-necessary-rights', 'best-knowledge-rights'
          dataQualityWarranty: true,
          dataComplianceWarranty: true,
          indemnification: 'mutual', // 'mutual', 'licensor-only', 'licensee-only', 'none'
          liabilityLimit: 'fees-paid', // 'fees-paid', 'specific-amount', 'unlimited-exceptions'
          
          disputeResolution: 'arbitration', // 'arbitration', 'mediation-litigation', 'litigation'
          governingLaw: 'Delaware',
          
          documentTitle: 'AI Training Data License Agreement',
          fileName: 'AI-Training-Data-License-Agreement'
        };

        const [currentTab, setCurrentTab] = useState(0);
        const [formData, setFormData] = useState(() => {
          try {
            const saved = localStorage.getItem('aiDataLicenseForm_v2');
            return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
          } catch (e) {
            console.error("Error loading saved data:", e);
            return defaultData;
          }
        });
        const [documentText, setDocumentText] = useState('');
        const previewRef = useRef(null);

        useEffect(() => {
          try {
            localStorage.setItem('aiDataLicenseForm_v2', JSON.stringify(formData));
          } catch (e) {
            console.error("Error saving form data:", e);
          }
        }, [formData]);

        useEffect(() => {
          setDocumentText(generateAgreementText(formData));
        }, [formData]);

        useEffect(() => {
          if (typeof feather !== 'undefined') {
            feather.replace();
            console.log("Feather icons replaced.");
          }
        }, [currentTab]); // Re-run when tab changes if new icons are rendered

        const handleChange = useCallback((e) => {
          const { name, value, type, checked } = e.target;
          const [mainKey, subKey] = name.split('.');

          if (subKey) { // Nested object (e.g., dataTypes.text)
            setFormData(prev => ({
              ...prev,
              [mainKey]: {
                ...prev[mainKey],
                [subKey]: type === 'checkbox' ? checked : value
              }
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              [name]: type === 'checkbox' ? checked : value
            }));
          }
        }, []);
        
        const handleBulkCheckboxChange = useCallback((groupName, keys, shouldBeChecked) => {
            setFormData(prev => {
                const newGroupState = { ...prev[groupName] };
                keys.forEach(key => {
                    newGroupState[key] = shouldBeChecked;
                });
                return { ...prev, [groupName]: newGroupState };
            });
        }, []);


        const resetForm = () => {
          if (confirm('Are you sure you want to reset all fields to their default values? This cannot be undone.')) {
            setFormData(defaultData);
            localStorage.removeItem('aiDataLicenseForm_v2');
            alert('Form has been reset to default values.');
          }
        };

        const copyToClipboard = () => {
          navigator.clipboard.writeText(documentText)
            .then(() => alert('Agreement text copied to clipboard!'))
            .catch(err => {
              console.error('Failed to copy to clipboard:', err);
              alert('Failed to copy. Please try manually or check browser permissions.');
            });
        };

        const downloadAsWord = () => {
          if (window.generateWordDoc) {
            window.generateWordDoc(documentText, {
              documentTitle: formData.documentTitle || "AI Training Data License Agreement",
              fileName: formData.fileName || "AI-Training-Data-License-Agreement"
            });
          } else {
            alert("Word document generator is not available. This is unexpected.");
            console.error("generateWordDoc function not found on window object.");
          }
        };
        
        const openCalendly = () => {
          window.open("https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1", "_blank", "noopener,noreferrer");
        };

        const renderTabContent = () => {
          // Common input component
          const InputField = ({ name, label, type = "text", placeholder, info, options, isTextarea }) => (
            <div className="form-group">
              <label htmlFor={name}>{label}</label>
              {isTextarea ? (
                <textarea id={name} name={name} className="form-control" value={formData[name] || ''} onChange={handleChange} placeholder={placeholder} rows="3"></textarea>
              ) : type === "select" ? (
                <select id={name} name={name} className="form-control" value={formData[name] || ''} onChange={handleChange}>
                  {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : (
                <input type={type} id={name} name={name} className="form-control" value={formData[name] || ''} onChange={handleChange} placeholder={placeholder} />
              )}
              {info && <small>{info}</small>}
            </div>
          );

          const CheckboxGroup = ({ groupName, legend, items }) => (
            <fieldset className="form-group">
              <legend className="checkbox-group-label">{legend}</legend>
              {items.map(item => (
                <label key={item.name} className="checkbox-option">
                  <input type="checkbox" name={`${groupName}.${item.name}`} checked={formData[groupName]?.[item.name] || false} onChange={handleChange} />
                  {item.label}
                  {item.info && <small style={{marginLeft: '8px', color: '#6c757d'}}>({item.info})</small>}
                </label>
              ))}
            </fieldset>
          );
          
          const SelectAllButtons = ({ groupName, keys }) => (
             <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                <button type="button" className="nav-button prev-button" style={{padding: '0.3rem 0.6rem', fontSize: '0.8rem'}} onClick={() => handleBulkCheckboxChange(groupName, keys, true)}>Select All</button>
                <button type="button" className="nav-button prev-button" style={{padding: '0.3rem 0.6rem', fontSize: '0.8rem'}} onClick={() => handleBulkCheckboxChange(groupName, keys, false)}>Deselect All</button>
            </div>
          );


          switch (currentTab) {
            case 0: // Basic Info
              return (<>
                <h2>Parties & Effective Date</h2>
                <h3>Licensor (Data Provider)</h3>
                <InputField name="licensorName" label="Full Legal Name:" placeholder="e.g., Acme Data Corp." />
                <InputField name="licensorEntity" label="Entity Type:" type="select" options={[
                    {value: "Corporation", label: "Corporation"}, {value: "Limited Liability Company", label: "LLC"}, 
                    {value: "Partnership", label: "Partnership"}, {value: "Sole Proprietorship", label: "Sole Proprietorship"}, {value: "Individual", label: "Individual"}
                ]}/>
                <InputField name="licensorAddress" label="Principal Address:" placeholder="Street, City, State, Zip Code" isTextarea/>
                <h3>Licensee (AI Developer)</h3>
                <InputField name="licenseeCompany" label="Full Legal Name:" placeholder="e.g., Innovate AI Ltd." />
                <InputField name="licenseeEntity" label="Entity Type:" type="select" options={[
                    {value: "Corporation", label: "Corporation"}, {value: "Limited Liability Company", label: "LLC"}, 
                    {value: "Partnership", label: "Partnership"}, {value: "Sole Proprietorship", label: "Sole Proprietorship"}, {value: "Individual", label: "Individual"}
                ]}/>
                <InputField name="licenseeAddress" label="Principal Address:" placeholder="Street, City, State, Zip Code" isTextarea/>
                <h3>Agreement Details</h3>
                <InputField name="effectiveDate" label="Effective Date:" type="date" />
              </>);
            case 1: // Data Details
              return (<>
                <h2>Data Description</h2>
                <InputField name="datasetName" label="Dataset Name:" placeholder="e.g., Project Chimera Image Set" />
                <InputField name="datasetDescription" label="Brief Description of Data:" isTextarea placeholder="e.g., Collection of 1 million annotated images of urban environments" />
                <div className="form-group inline">
                  <InputField name="dataFormat" label="Data Format(s):" placeholder="e.g., JSON, CSV, PNG" />
                  <InputField name="dataSizeGB" label="Approx. Size (GB):" type="number" placeholder="e.g., 500" />
                </div>
                <InputField name="dataOrigin" label="Origin of Data:" placeholder="e.g., Proprietary collection, Public domain" info="Describe where the data comes from."/>
                <InputField name="dataAccessMethod" label="Access Method:" type="select" options={[
                    {value: "API", label: "API"}, {value: "Secure Download Link", label: "Secure Download Link"}, 
                    {value: "Physical Media", label: "Physical Media"}, {value: "Cloud Storage Bucket", label: "Cloud Storage Bucket"}
                ]}/>
                <InputField name="dataUpdateFrequency" label="Update Frequency:" type="select" options={[
                    {value: "None", label: "None (One-time provision)"}, {value: "Daily", label: "Daily"}, {value: "Weekly", label: "Weekly"},
                    {value: "Monthly", label: "Monthly"}, {value: "Quarterly", label: "Quarterly"}, {value: "Annually", label: "Annually"}
                ]}/>
                <CheckboxGroup groupName="dataTypes" legend="Types of Data Included:" items={[
                    {name: "text", label: "Text"}, {name: "images", label: "Images"}, {name: "audio", label: "Audio"}, {name: "video", label: "Video"},
                    {name: "userGenerated", label: "User-Generated Content"}, {name: "proprietaryContent", label: "Proprietary Content"},
                    {name: "personalData", label: "Personal Data (PII)", info:"Requires careful handling & compliance"}, {name: "anonymizedData", label: "Anonymized/Pseudonymized Data"},
                    {name: "structuredData", label: "Structured Data (e.g., tables)"}, {name: "unstructuredData", label: "Unstructured Data (e.g., free text)"}
                ]}/>
              </>);
            case 2: // License Grant
              return (<>
                <h2>License Grant Terms</h2>
                <InputField name="licenseType" label="Type of License:" type="select" options={[
                    {value: "non-exclusive", label: "Non-Exclusive"}, {value: "exclusive", label: "Exclusive"}, {value: "sole", label: "Sole"}
                ]} info="Exclusive means only Licensee can use. Sole means Licensor can also use but not grant to others." />
                <InputField name="sublicensing" label="Sublicensing Rights:" type="select" options={[
                    {value: "not-permitted", label: "Not Permitted"}, {value: "permitted", label: "Permitted (to affiliates/contractors)"}, 
                    {value: "with-approval", label: "Permitted with Licensor Approval"}
                ]}/>
                <InputField name="geographicScope" label="Geographic Scope:" placeholder="e.g., Worldwide, North America" />
                <InputField name="industryRestrictions" label="Industry Restrictions (if any):" placeholder="e.g., No military use, No use in tobacco industry. Leave blank if none." isTextarea/>
              </>);
            case 3: // Data Usage & IP
              return (<>
                <h2>Data Usage & Intellectual Property</h2>
                <InputField name="purposeRestrictions" label="Purpose of Data Use:" type="select" options={[
                    {value: "general-ai-training", label: "General AI Model Training & Development"},
                    {value: "specific-models", label: "Training Specific Types of AI Models Only"}
                ]}/>
                {formData.purposeRestrictions === 'specific-models' && (<>
                    <SelectAllButtons groupName="modelTypes" keys={Object.keys(defaultData.modelTypes)} />
                    <CheckboxGroup groupName="modelTypes" legend="Permitted AI Model Types:" items={[
                        {name: "generativeText", label: "Generative Text"}, {name: "generativeImage", label: "Generative Image"},
                        {name: "generativeAudio", label: "Generative Audio"}, {name: "generativeVideo", label: "Generative Video"},
                        {name: "languageModels", label: "Language Models (LLMs)"}, {name: "computerVision", label: "Computer Vision Models"},
                        {name: "classificationModels", label: "Classification Models"}, {name: "predictiveModels", label: "Predictive Models"},
                        {name: "naturalLanguageProcessing", label: "Natural Language Processing (NLP)"},
                        {name: "sentimentAnalysis", label: "Sentiment Analysis"}, {name: "recommendationSystems", label: "Recommendation Systems"},
                         {name: "dataAnalytics", label: "Data Analytics (Non-model training)"}
                    ]}/>
                </>)}
                <SelectAllButtons groupName="usagePurposes" keys={Object.keys(defaultData.usagePurposes)} />
                <CheckboxGroup groupName="usagePurposes" legend="Permitted Usage Contexts:" items={[
                    {name: "research", label: "Internal Research & Development"}, {name: "commercial", label: "Commercial Products/Services"},
                    {name: "internalUse", label: "Internal Business Operations (Non-commercial)"}, {name: "publicServices", label: "Use in Public Sector Services"},
                    {name: "militaryApplications", label: "Military Applications", info: "High-risk, consider carefully"}, {name: "governmentSurveillance", label: "Government Surveillance", info: "High-risk, consider carefully"}
                ]}/>
                <h3>Intellectual Property</h3>
                <InputField name="ownershipModels" label="Ownership of AI Models Trained on Data:" type="select" options={[
                    {value: "licensee-owns", label: "Licensee Owns Models (Licensor retains Data rights)"},
                    {value: "licensor-owns", label: "Licensor Owns Models (Licensee assigns rights)"},
                    {value: "joint-tbd", label: "Joint Ownership / To Be Determined Separately"}
                ]}/>
                <InputField name="attributionRequired" label="Attribution to Licensor Required?" type="select" options={[
                    {value: "no", label: "No Attribution Required"}, {value: "yes", label: "Yes, Attribution Required (details to be agreed)"},
                    {value: "negotiable", label: "Attribution is Negotiable"}
                ]}/>
              </>);
            case 4: // Compensation
              return (<>
                <h2>Compensation & Term</h2>
                <InputField name="compensationType" label="Compensation Model:" type="select" options={[
                    {value: "none", label: "No Fee / Gratis License"}, {value: "one-time", label: "One-Time Fee"}, 
                    {value: "royalty", label: "Royalty-Based"}, {value: "milestone", label: "Milestone Payments"}
                ]}/>
                {formData.compensationType === 'one-time' && (
                    <InputField name="initialFee" label="One-Time Fee Amount ($USD):" type="number" placeholder="e.g., 50000" />
                )}
                {formData.compensationType === 'royalty' && (<>
                    <InputField name="royaltyPercent" label="Royalty Percentage (%):" type="number" placeholder="e.g., 5" />
                    <InputField name="minimumGuarantee" label="Minimum Annual Guarantee ($USD):" type="number" placeholder="e.g., 10000" />
                </>)}
                {formData.compensationType === 'milestone' && (
                    <p><em>Details of milestone payments should be specified in an appendix to the agreement.</em></p>
                )}
                <h3>Agreement Term</h3>
                <div className="form-group inline">
                    <InputField name="term" label="Initial Term Duration:" type="number" placeholder="e.g., 3" />
                    <InputField name="termUnit" label="Term Unit:" type="select" options={[
                        {value: "years", label: "Years"}, {value: "months", label: "Months"}
                    ]}/>
                </div>
                <InputField name="renewalTerms" label="Renewal:" type="select" options={[
                    {value: "none", label: "No Automatic Renewal"}, {value: "automatic", label: "Automatic Renewal (unless notice given)"},
                    {value: "manual", label: "Manual Renewal (requires mutual agreement)"}
                ]}/>
                <InputField name="terminationRights" label="Termination Rights:" type="select" options={[
                    {value: "both-parties", label: "Both Parties (for cause, and convenience with notice)"},
                    {value: "licensor-only", label: "Licensor Only (for cause, and convenience with notice)"},
                    {value: "licensee-only", label: "Licensee Only (for cause, and convenience with notice)"}
                ]}/>
                <InputField name="dataRetention" label="Data Handling on Termination:" type="select" options={[
                    {value: "delete-all", label: "Delete All Data"},
                    {value: "return-to-licensor", label: "Return to Licensor & Delete Copies"},
                    {value: "archival-only", label: "Retain for Archival/Legal Purposes Only (No Further Use)"}
                ]}/>
              </>);
            case 5: // Warranties & Liability
              return (<>
                <h2>Warranties & Liability</h2>
                <h3>Licensor Warranties</h3>
                <InputField name="licensorWarranty" label="Overall Licensor Warranty Level:" type="select" options={[
                    {value: "as-is", label: "As-Is (Minimal/No Warranties)"}, {value: "limited", label: "Limited Warranties"},
                    {value: "comprehensive", label: "Comprehensive Warranties (details in Appendix)"}
                ]}/>
                <InputField name="rightsToClaim" label="Licensor's Rights to Grant License:" type="select" options={[
                    {value: "all-necessary-rights", label: "Warrants it has all necessary rights"},
                    {value: "best-knowledge-rights", label: "Warrants to its best knowledge it has rights (no full guarantee)"}
                ]}/>
                <label className="checkbox-option">
                    <input type="checkbox" name="dataQualityWarranty" checked={formData.dataQualityWarranty} onChange={handleChange} />
                    Data Quality Warranty (Data substantially conforms to description)
                </label>
                <label className="checkbox-option">
                    <input type="checkbox" name="dataComplianceWarranty" checked={formData.dataComplianceWarranty} onChange={handleChange} />
                    Data Compliance Warranty (Collected/provided in compliance with applicable laws)
                </label>
                <h3>Indemnification & Liability</h3>
                <InputField name="indemnification" label="Indemnification:" type="select" options={[
                    {value: "none", label: "None"}, {value: "mutual", label: "Mutual Indemnification"},
                    {value: "licensor-only", label: "Licensor Indemnifies Licensee (e.g., for IP claims on Data)"},
                    {value: "licensee-only", label: "Licensee Indemnifies Licensor (e.g., for misuse of Data)"}
                ]}/>
                <InputField name="liabilityLimit" label="Limitation of Liability Cap:" type="select" options={[
                    {value: "fees-paid", label: "Capped at Fees Paid (e.g., in last 12 months)"},
                    {value: "specific-amount", label: "Capped at a Specific Monetary Amount (Specify in Agreement)"},
                    {value: "unlimited-exceptions", label: "Generally Capped, but Unlimited for Certain Breaches (e.g., Confidentiality, Indemnity)"}
                ]}/>
              </>);
            case 6: // Governing Terms
              return (<>
                <h2>Governing Terms & Finalization</h2>
                <InputField name="governingLaw" label="Governing Law (State/Jurisdiction):" placeholder="e.g., State of Delaware, USA" />
                <InputField name="disputeResolution" label="Dispute Resolution Mechanism:" type="select" options={[
                    {value: "litigation", label: "Litigation in Specified Courts"},
                    {value: "arbitration", label: "Binding Arbitration"},
                    {value: "mediation-litigation", label: "Mediation, then Litigation if unresolved"}
                ]}/>
                <h3>Document Options</h3>
                <InputField name="documentTitle" label="Document Title (for generated file):" />
                <InputField name="fileName" label="File Name (for download, no extension):" />
                <div style={{marginTop: "2rem"}}>
                    <button type="button" className="action-button danger" onClick={resetForm}><Icon name="trash-2" /> Reset Full Form</button>
                    <small style={{display: "block", marginTop: "0.5rem"}}>Resets all fields to default values. This action cannot be undone.</small>
                </div>
              </>);
            default: return <div>Unknown tab.</div>;
          }
        };

        return (
          <div className="generator-container">
            <header className="generator-header">
              <h1><Icon name="file-plus" size="1.5rem" style={{marginRight: '0.5rem', verticalAlign: 'bottom'}}/>AI Training Data License Agreement Generator</h1>
              <p>Craft a customized license agreement for your AI data. Review all sections carefully.</p>
            </header>

            <nav className="tab-navigation">
              {tabs.map((tab, index) => (
                <button key={tab.id} className={`tab-button ${currentTab === index ? 'active' : ''}`}
                  onClick={() => setCurrentTab(index)} title={tab.label}>
                  {tab.icon && <Icon name={tab.icon} size="1rem" style={{marginRight: '0.3rem'}}/>}
                  {tab.label}
                </button>
              ))}
            </nav>

            <main className="main-content">
              <section className="form-panel">
                {renderTabContent()}
              </section>
              <aside className="preview-panel" ref={previewRef}>
                <h2>Live Preview</h2>
                <pre className="document-preview">{documentText || "Select options to generate preview..."}</pre>
              </aside>
            </main>

            <footer className="navigation-buttons">
                <div className="button-group">
                    <button onClick={() => setCurrentTab(prev => Math.max(0, prev - 1))}
                            className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
                            disabled={currentTab === 0}>
                        <Icon name="arrow-left"/> Previous
                    </button>
                    <button onClick={() => setCurrentTab(prev => Math.min(tabs.length - 1, prev + 1))}
                            className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
                            disabled={currentTab === tabs.length - 1}>
                        Next <Icon name="arrow-right"/>
                    </button>
                </div>
                <div className="button-group">
                    <button onClick={copyToClipboard} className="nav-button action-button utility"><Icon name="copy"/> Copy Text</button>
                    <button onClick={downloadAsWord} className="nav-button action-button utility"><Icon name="download"/> Download .doc</button>
                    <button onClick={openCalendly} className="nav-button action-button utility"><Icon name="calendar"/> Consult Expert</button>
                </div>
            </footer>
          </div>
        );
      }; // End of App component

      ReactDOM.render(React.createElement(App), document.getElementById('root'));
      console.log("React application rendered successfully.");

    } catch (error) {
      console.error("Critical error during React app initialization or rendering:", error);
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.innerHTML = `
          <div style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; font-family: sans-serif;">
            <h3><Icon name="alert-triangle" style={{marginRight: '8px'}}/>Error Loading Generator</h3>
            <p>The AI Training Data License Agreement Generator failed to load due to a critical error.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please check your browser's developer console (usually F12) for more detailed error messages. Ensure all scripts (React, Babel, Feather) are loading correctly from their CDNs.</p>
          </div>
        `;
        // Try to render feather icon in error message too
        if (typeof feather !== 'undefined') feather.replace();
      }
    }
  }); // End of DOMContentLoaded listener
})(); // End of IIFE