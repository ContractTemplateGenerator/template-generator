// Attorney-Led Incorporation Intake Generator
// Main React component with live preview and document generation

const { useState, useRef, useEffect, useMemo } = React;

// Helper functions
function currency(n) {
  return `$${(n || 0).toLocaleString()}`;
}

function addBusinessDays(start, days) {
  let date = new Date(start);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date;
}

// Data configurations
const STATES = [
  { id: "DE", name: "Delaware", filingFee: 90, expediteAvailable: true, rushAvailable: true },
  { id: "WY", name: "Wyoming", filingFee: 100, expediteAvailable: true, rushAvailable: false },
  { id: "CA", name: "California", filingFee: 70, expediteAvailable: false, rushAvailable: false },
  { id: "FL", name: "Florida", filingFee: 125, expediteAvailable: true, rushAvailable: true },
  { id: "TX", name: "Texas", filingFee: 300, expediteAvailable: true, rushAvailable: true },
  { id: "NY", name: "New York", filingFee: 125, expediteAvailable: true, rushAvailable: false },
  { id: "NV", name: "Nevada", filingFee: 425, expediteAvailable: true, rushAvailable: true }
];

const PACKAGES = [
  { 
    id: "starter", 
    name: "Starter", 
    price: 500, 
    includes: ["EIN (Tax ID Number)", "Basic Bylaws/Operating Agreement"],
    deliveryDays: 14,
    revisions: 0
  },
  { 
    id: "standard", 
    name: "Standard", 
    price: 750, 
    includes: ["EIN (Tax ID Number)", "Customized Bylaws/Operating Agreement", "30min Consultation"],
    deliveryDays: 5,
    revisions: 2
  },
  { 
    id: "advanced", 
    name: "Advanced", 
    price: 850, 
    includes: ["EIN (Tax ID Number)", "Customized Bylaws/Operating Agreement", "1hr Consultation", "Advanced Corporate Structuring & Custom Drafting"],
    deliveryDays: 3,
    revisions: 5
  }
];

const SPEEDS = [
  { id: "standard", name: "Standard", note: "state timeline - free", add: 0, deltaDays: 0 },
  { id: "expedited", name: "Expedited", note: "+$100 – when available", add: 100, deltaDays: -2 },
  { id: "rush", name: "Rush", note: "+$250 – when available", add: 250, deltaDays: -4 }
];

function IncorporationIntake() {
  // Form state
  const [currentTab, setCurrentTab] = useState(0);
  const [lastChanged, setLastChanged] = useState(null);
  const [formData, setFormData] = useState({
    // Formation details
    state: "DE",
    entityType: "LLC",
    primaryName: "",
    altNames: ["", ""],
    showThirdAlt: false,
    
    // Package and processing
    package: "standard",
    speed: "standard",
    registeredAgent: true,
    
    // LLC management
    management: "member-managed",
    
    // Corporation details
    numDirectors: 1,
    directors: [{ name: "", address: "" }],
    officers: [
      { title: "President/CEO", name: "" },
      { title: "Secretary", name: "" },
      { title: "Treasurer/CFO", name: "" }
    ],
    
    // Ownership
    owners: [{ name: "", percent: "100", issued: "100" }]
  });

  const previewRef = useRef(null);
  
  // Get current selections
  const selectedState = STATES.find(s => s.id === formData.state) || STATES[0];
  const selectedPackage = PACKAGES.find(p => p.id === formData.package) || PACKAGES[1];
  const selectedSpeed = SPEEDS.find(s => s.id === formData.speed) || SPEEDS[0];
  
  // Calculate totals
  const totals = useMemo(() => {
    const packagePrice = selectedPackage.price;
    const speedAdd = selectedSpeed.add;
    const raFee = formData.registeredAgent ? 149 : 0;
    const stateFee = selectedState.filingFee;
    return { 
      packagePrice, 
      speedAdd, 
      raFee, 
      stateFee,
      total: packagePrice + speedAdd + raFee + stateFee 
    };
  }, [selectedPackage, selectedSpeed, formData.registeredAgent, selectedState]);

  // Calculate ETA
  const etaString = useMemo(() => {
    const baseDays = 7; // Standard processing
    const adjustedDays = Math.max(2, baseDays + selectedSpeed.deltaDays);
    const eta = addBusinessDays(new Date(), adjustedDays);
    return eta.toLocaleDateString(undefined, { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  }, [selectedSpeed]);

  // Check percentage total
  const ownerPercentTotal = useMemo(() => {
    return formData.owners.reduce((sum, owner) => {
      return sum + (parseFloat(owner.percent || "0") || 0);
    }, 0);
  }, [formData.owners]);

  const handleInputChange = (field, value) => {
    setLastChanged(field);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (field, index, subfield, value) => {
    setLastChanged(`${field}.${index}.${subfield}`);
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [subfield]: value } : item
      )
    }));
  };
  // Owner management functions
  const addOwner = () => {
    setFormData(prev => ({
      ...prev,
      owners: [...prev.owners, { name: "", percent: "", issued: "" }]
    }));
  };

  const removeOwner = (index) => {
    if (formData.owners.length > 1) {
      setFormData(prev => ({
        ...prev,
        owners: prev.owners.filter((_, i) => i !== index)
      }));
    }
  };

  // Director management
  const updateDirectorCount = (count) => {
    const numDirs = Math.max(1, Math.min(15, count));
    const newDirectors = [...formData.directors];
    
    if (numDirs > newDirectors.length) {
      while (newDirectors.length < numDirs) {
        newDirectors.push({ name: "", address: "" });
      }
    } else if (numDirs < newDirectors.length) {
      newDirectors.length = numDirs;
    }
    
    setFormData(prev => ({
      ...prev,
      numDirectors: numDirs,
      directors: newDirectors
    }));
  };

  // Officer management
  const addOfficer = () => {
    setFormData(prev => ({
      ...prev,
      officers: [...prev.officers, { title: "Officer", name: "" }]
    }));
  };

  // Generate document preview
  const generateDocumentText = () => {
    const entityLabel = formData.entityType === "LLC" ? "Limited Liability Company" : "Corporation";
    const partyLabel = formData.entityType === "LLC" ? "Member" : "Shareholder";
    const govDoc = formData.entityType === "LLC" ? "Operating Agreement" : "Bylaws";
    
    const altNamesText = formData.altNames.filter(name => name.trim()).length > 0 
      ? `Alternative Names: ${formData.altNames.filter(name => name.trim()).join(", ")}`
      : "";

    const ownersText = formData.owners.map((owner, i) => 
      `${i + 1}. ${owner.name || "[Name]"} — ${owner.percent || "—"}% ownership — ${owner.issued || "—"} units/shares`
    ).join("\n");

    const managementText = formData.entityType === "LLC" 
      ? `Management Structure: ${formData.management === "member-managed" ? "Member-managed" : "Manager-managed"}`
      : `Directors: ${formData.directors.map((d, i) => `${i + 1}. ${d.name || "[Name]"} — ${d.address || "[Address]"}`).join("; ")}
Officers: ${formData.officers.map(o => `${o.title}: ${o.name || "[Name]"}`).join("; ")}`;

    return `${formData.primaryName || "[Company Name]"} - ${entityLabel}
${govDoc} Preview

${altNamesText}

Formation Details:
State of Incorporation: ${selectedState.name}
Entity Type: ${entityLabel}
Package: ${selectedPackage.name} (${currency(selectedPackage.price)})
Processing Speed: ${selectedSpeed.name} (ETA: ${etaString})

${partyLabel} Information:
${ownersText}
Total Ownership: ${Math.round(ownerPercentTotal)}%

${managementText}

Investment Summary:
Package: ${currency(totals.packagePrice)}
Processing: ${currency(totals.speedAdd)}
State Filing Fee: ${currency(totals.stateFee)}
Registered Agent: ${currency(totals.raFee)}
Total: ${currency(totals.total)}

Note: This is a preview excerpt. Full ${govDoc} will include detailed provisions, signatures, and all information provided in this intake.`;
  };

  const documentText = generateDocumentText();

  // Highlight sections based on last changed field
  const getHighlightedText = () => {
    let text = documentText;
    
    if (lastChanged) {
      // Define highlighting patterns based on field changes
      const highlights = {
        'primaryName': /^[^\n]+ - /,
        'state': /State of Incorporation: [^\n]+/,
        'entityType': /Entity Type: [^\n]+/,
        'package': /Package: [^\n]+/,
        'speed': /Processing Speed: [^\n]+/,
        'management': /Management Structure: [^\n]+/,
        'owners': /Member Information:[\s\S]*?Total Ownership:/
      };
      
      // Check for nested field changes (owners, directors, officers)
      if (lastChanged.includes('owners.')) {
        highlights['owners'] = /Member Information:[\s\S]*?Total Ownership:/;
      }
      if (lastChanged.includes('directors.')) {
        highlights['directors'] = /Directors: [^\n]+/;
      }
      if (lastChanged.includes('officers.')) {
        highlights['officers'] = /Officers: [^\n]+/;
      }
      
      // Apply highlighting
      Object.keys(highlights).forEach(key => {
        if (lastChanged.includes(key) || lastChanged === key) {
          text = text.replace(highlights[key], match => 
            `<span class="highlighted-text">${match}</span>`
          );
        }
      });
    }
    
    return text;
  };

  // Scroll to highlighted text
  useEffect(() => {
    if (previewRef.current && lastChanged) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastChanged, documentText]);

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      alert("Document copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy to clipboard. Please try selecting and copying manually.");
    }
  };

  // Download as Word document
  const downloadAsWord = () => {
    try {
      if (!documentText) {
        alert("Cannot generate document - text is empty. Please check the form data.");
        return;
      }
      
      window.generateWordDoc(documentText, {
        documentTitle: `${formData.primaryName || "Company"} Incorporation Documents`,
        fileName: `${formData.primaryName ? formData.primaryName.replace(/[^a-zA-Z0-9]/g, '-') : 'Incorporation'}-Documents`
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };

  // Consultation button with Calendly
  const openConsultation = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
      });
    } else {
      window.open('https://terms.law/call/', '_blank');
    }
  };

  // Tab navigation
  const tabs = [
    { id: 'formation', label: 'Formation Details' },
    { id: 'ownership', label: 'Ownership & Structure' },
    { id: 'processing', label: 'Processing & Package' },
    { id: 'summary', label: 'Review & Summary' }
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

  const goToTab = (index) => {
    setCurrentTab(index);
  };
  // Render tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Formation Details
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Company Names</h3>
              <div className="form-group">
                <label>Primary Company Name</label>
                <input
                  type="text"
                  value={formData.primaryName}
                  onChange={(e) => handleInputChange('primaryName', e.target.value)}
                  placeholder="Enter your primary company name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Alternative Name #1 (Optional)</label>
                  <input
                    type="text"
                    value={formData.altNames[0]}
                    onChange={(e) => {
                      const newAltNames = [...formData.altNames];
                      newAltNames[0] = e.target.value;
                      handleInputChange('altNames', newAltNames);
                    }}
                    placeholder="First alternative name"
                  />
                </div>
                <div className="form-group">
                  <label>Alternative Name #2 (Optional)</label>
                  <input
                    type="text"
                    value={formData.altNames[1]}
                    onChange={(e) => {
                      const newAltNames = [...formData.altNames];
                      newAltNames[1] = e.target.value;
                      handleInputChange('altNames', newAltNames);
                    }}
                    placeholder="Second alternative name"
                  />
                </div>
              </div>
              {formData.showThirdAlt && (
                <div className="form-group">
                  <label>Alternative Name #3 (Optional)</label>
                  <input
                    type="text"
                    value={formData.altNames[2] || ""}
                    onChange={(e) => {
                      const newAltNames = [...formData.altNames];
                      newAltNames[2] = e.target.value;
                      handleInputChange('altNames', newAltNames);
                    }}
                    placeholder="Third alternative name"
                  />
                </div>
              )}
              {!formData.showThirdAlt && (
                <button
                  type="button"
                  className="nav-button"
                  onClick={() => handleInputChange('showThirdAlt', true)}
                  style={{ marginTop: '0.5rem' }}
                >
                  + Add third alternative name
                </button>
              )}
            </div>

            <div className="form-section">
              <h3>Formation Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>State of Incorporation</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  >
                    {STATES.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Entity Type</label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => handleInputChange('entityType', e.target.value)}
                  >
                    <option value="LLC">Limited Liability Company (LLC)</option>
                    <option value="C-Corp">C-Corporation</option>
                    <option value="S-Corp">S-Corporation</option>
                  </select>
                </div>
              </div>
            </div>

            {formData.entityType === "LLC" && (
              <div className="form-section">
                <h3>LLC Management Structure</h3>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="management"
                      value="member-managed"
                      checked={formData.management === "member-managed"}
                      onChange={(e) => handleInputChange('management', e.target.value)}
                    />
                    Member-managed (default)
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="management"
                      value="manager-managed"
                      checked={formData.management === "manager-managed"}
                      onChange={(e) => handleInputChange('management', e.target.value)}
                    />
                    Manager-managed
                  </label>
                </div>
              </div>
            )}

            {(formData.entityType === "C-Corp" || formData.entityType === "S-Corp") && (
              <div className="form-section">
                <h3>Directors & Officers</h3>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Number of Initial Directors</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={formData.numDirectors}
                      onChange={(e) => updateDirectorCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ visibility: 'hidden' }}>Spacer</label>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                      We'll include director names & addresses below.
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4>Director Information</h4>
                  {formData.directors.map((director, index) => (
                    <div key={index} className="form-row" style={{ marginBottom: '0.75rem' }}>
                      <div className="form-group">
                        <label>Director {index + 1} Name</label>
                        <input
                          type="text"
                          value={director.name}
                          onChange={(e) => handleNestedChange('directors', index, 'name', e.target.value)}
                          placeholder={`Director #${index + 1} name`}
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          value={director.address}
                          onChange={(e) => handleNestedChange('directors', index, 'address', e.target.value)}
                          placeholder="Director address"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4>Officer Assignments</h4>
                  {formData.officers.map((officer, index) => (
                    <div key={index} className="form-row" style={{ marginBottom: '0.75rem' }}>
                      <div className="form-group">
                        <label>Officer Title</label>
                        <input
                          type="text"
                          value={officer.title}
                          onChange={(e) => handleNestedChange('officers', index, 'title', e.target.value)}
                          placeholder="Officer title"
                        />
                      </div>
                      <div className="form-group">
                        <label>Assignee Name</label>
                        <input
                          type="text"
                          value={officer.name}
                          onChange={(e) => handleNestedChange('officers', index, 'name', e.target.value)}
                          placeholder="Person assigned to this role"
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" className="add-owner-btn" onClick={addOfficer}>
                    + Add Officer
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Ownership & Structure
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>{formData.entityType === "LLC" ? "Member" : "Shareholder"} & Ownership</h3>
              <div className="ownership-table">
                <div className="ownership-header">
                  <div>Name</div>
                  <div>% Ownership</div>
                  <div>{formData.entityType === "LLC" ? "Units" : "Shares"}</div>
                  <div>Action</div>
                </div>
                {formData.owners.map((owner, index) => (
                  <div key={index} className="ownership-row">
                    <input
                      type="text"
                      value={owner.name}
                      onChange={(e) => handleNestedChange('owners', index, 'name', e.target.value)}
                      placeholder={`${formData.entityType === "LLC" ? "Member" : "Shareholder"} name`}
                    />
                    <input
                      type="number"
                      value={owner.percent}
                      onChange={(e) => handleNestedChange('owners', index, 'percent', e.target.value)}
                      placeholder="% Ownership"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={owner.issued}
                      onChange={(e) => handleNestedChange('owners', index, 'issued', e.target.value)}
                      placeholder={formData.entityType === "LLC" ? "Units issued" : "Shares issued"}
                      min="0"
                      step="1"
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeOwner(index)}
                      disabled={formData.owners.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-owner-btn" onClick={addOwner}>
                + Add {formData.entityType === "LLC" ? "Member" : "Shareholder"}
              </button>
              <div className={`percentage-total ${Math.round(ownerPercentTotal) === 100 ? 'correct' : 'incorrect'}`}>
                Total Ownership: {Math.round(ownerPercentTotal)}%
                {Math.round(ownerPercentTotal) === 100 ? ' (Perfect!)' : ' (Should equal 100%)'}
              </div>
            </div>
          </div>
        );
      case 2: // Processing & Package
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Choose Your Package</h3>
              <div className="package-grid">
                {PACKAGES.map(pkg => (
                  <label key={pkg.id} className={`package-card ${formData.package === pkg.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="package"
                      value={pkg.id}
                      checked={formData.package === pkg.id}
                      onChange={(e) => handleInputChange('package', e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div className="package-title">{pkg.name}</div>
                    <div className="package-price">{currency(pkg.price)}</div>
                    <ul className="package-features">
                      {pkg.includes.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Delivery: {pkg.deliveryDays} days | Revisions: {pkg.revisions}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Processing Speed</h3>
              <div className="speed-grid">
                {SPEEDS.map(speed => (
                  <label key={speed.id} className={`speed-card ${formData.speed === speed.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="speed"
                      value={speed.id}
                      checked={formData.speed === speed.id}
                      onChange={(e) => handleInputChange('speed', e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div className="speed-title">{speed.name}</div>
                    <div className="speed-note">{speed.note}</div>
                  </label>
                ))}
              </div>
              <div className="eta-banner">
                Your incorporation will be complete by {etaString}
              </div>
            </div>

            <div className="form-section">
              <h3>Add-ons</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.registeredAgent}
                  onChange={(e) => handleInputChange('registeredAgent', e.target.checked)}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>Registered Agent (First Year)</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {currency(149)} • Required in most states • Professional service
                  </div>
                </div>
              </label>
            </div>
          </div>
        );

      case 3: // Summary
        return (
          <div className="form-content">
            <div className="form-section">
              <h3>Review Your Incorporation</h3>
              
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Company Information</div>
                <div>Name: {formData.primaryName || "[Not provided]"}</div>
                <div>State: {selectedState.name}</div>
                <div>Entity: {formData.entityType}</div>
                {formData.altNames.filter(name => name.trim()).length > 0 && (
                  <div>Alternatives: {formData.altNames.filter(name => name.trim()).join(", ")}</div>
                )}
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Ownership Summary</div>
                {formData.owners.map((owner, i) => (
                  <div key={i}>
                    {owner.name || `[${formData.entityType === "LLC" ? "Member" : "Shareholder"} ${i + 1}]`}: {owner.percent || "0"}%
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem', fontWeight: '600', color: Math.round(ownerPercentTotal) === 100 ? '#16a34a' : '#dc2626' }}>
                  Total: {Math.round(ownerPercentTotal)}%
                </div>
              </div>

              <div className="summary-section">
                <h4>Investment Breakdown</h4>
                <div className="summary-line">
                  <span>{selectedPackage.name} Package</span>
                  <span>{currency(totals.packagePrice)}</span>
                </div>
                <div className="summary-line">
                  <span>Processing Speed ({selectedSpeed.name})</span>
                  <span>{currency(totals.speedAdd)}</span>
                </div>
                <div className="summary-line">
                  <span>State Filing Fee</span>
                  <span>{currency(totals.stateFee)}</span>
                </div>
                <div className="summary-line">
                  <span>Registered Agent</span>
                  <span>{currency(totals.raFee)}</span>
                </div>
                <div className="summary-line total">
                  <span>Total Investment</span>
                  <span>{currency(totals.total)}</span>
                </div>
                
                <div className="includes-list">
                  <strong>Included in your package:</strong>
                  <ul>
                    {selectedPackage.includes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem', marginTop: '1rem' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#dc2626' }}>Review Checklist</div>
                <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                  <div>✓ Company name and alternatives provided</div>
                  <div>✓ Entity type and state selected</div>
                  <div style={{ color: Math.round(ownerPercentTotal) === 100 ? '#166534' : '#dc2626' }}>
                    {Math.round(ownerPercentTotal) === 100 ? '✓' : '⚠'} Ownership percentages equal 100%
                  </div>
                  <div>✓ Package and processing speed chosen</div>
                  <div>✓ Investment summary reviewed</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="form-content">Invalid tab</div>;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Attorney-Led Incorporation Intake</h1>
        <p>Delaware & all 50 states • No bots • No paralegals • Named counsel on every file</p>
      </div>
      
      <div className="input-panel">
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

        {renderTabContent()}

        <div className="navigation-buttons">
          <button
            onClick={prevTab}
            className={`nav-button ${currentTab === 0 ? '' : ''}`}
            disabled={currentTab === 0}
          >
            <i data-feather="chevron-left"></i>
            Previous
          </button>
          
          <button onClick={copyToClipboard} className="nav-button success">
            <i data-feather="copy"></i>
            Copy
          </button>
          
          <button onClick={downloadAsWord} className="nav-button primary">
            <i data-feather="download"></i>
            Download MS Word
          </button>
          
          <button onClick={openConsultation} className="nav-button info">
            <i data-feather="calendar"></i>
            Consultation
          </button>
          
          <button
            onClick={nextTab}
            className={`nav-button ${currentTab === tabs.length - 1 ? '' : ''}`}
            disabled={currentTab === tabs.length - 1}
          >
            Next
            <i data-feather="chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="preview-panel">
        <div className="preview-content">
          <h2>Live Preview</h2>
          <div 
            className="document-preview"
            ref={previewRef}
            dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
          />
        </div>
      </div>
    </div>
  );
}

// Render the component
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(IncorporationIntake));
}