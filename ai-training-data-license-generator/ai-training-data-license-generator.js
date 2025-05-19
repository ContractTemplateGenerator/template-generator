
function AITrainingDataLicenseGenerator() {
  const [formData, setFormData] = React.useState({
    licensorName: "",
    licenseeName: "",
    dataDescription: "",
    purposeDescription: "",
    restrictionsList: "",
    licenseeTerm: "",
    licenseeFee: "",
    governingLaw: ""
  });

  const [currentTab, setCurrentTab] = React.useState(0);
  
  const [documentText, setDocumentText] = React.useState("");
  
  const [lastChanged, setLastChanged] = React.useState(null);
  
  const previewRef = React.useRef(null);

  const tabs = [
    { id: "tab1", label: "Parties" },
    { id: "tab2", label: "Data" },  
    { id: "tab3", label: "Purpose" },
    { id: "tab4", label: "Restrictions" },
    { id: "tab5", label: "Term & Fees" },
    { id: "tab6", label: "Misc" }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setLastChanged(name);

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  React.useEffect(() => {
    generateDocument();
  }, [formData]);
  
  const getSectionToHighlight = () => {
    const tabSections = {
      0: ["licensorName", "licenseeName"],
      1: ["dataDescription"],
      2: ["purposeDescription"],
      3: ["restrictionsList"],
      4: ["licenseeTerm", "licenseeFee"],
      5: ["governingLaw"]
    };
    
    const sectionsForTab = tabSections[currentTab];
    if (sectionsForTab.includes(lastChanged)) {
      return lastChanged;
    }
    return null;
  };
  
  const createHighlightedText = () => {
    const sectionToHighlight = getSectionToHighlight();
    if (!sectionToHighlight) return documentText;
    
    const regex = new RegExp(`\\{${sectionToHighlight}\\}`, "g");
    
    return documentText.replace(regex, match =>
      `<span class="highlighted-text">${match}</span>`
    );
  };
  
  const highlightedText = createHighlightedText();

  React.useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector(".highlighted-text");
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      } 
    }
  }, [highlightedText]);

  const generateDocument = () => {
    const {
      licensorName,
      licenseeName, 
      dataDescription,
      purposeDescription,
      restrictionsList,
      licenseeTerm,
      licenseeFee,
      governingLaw
    } = formData;

    let documentContent = `AI TRAINING DATA LICENSE AGREEMENT

This AI Training Data License Agreement (the "Agreement") is entered into as of {effectiveDate} (the "Effective Date") by and between {licensorName} ("Licensor") and {licenseeName} ("Licensee"). 

1. DATA

Licensor owns or controls certain data described as follows: {dataDescription} (the "Data").

2. LICENSE

Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a non-exclusive, non-transferable, non-sublicensable license to use the Data solely for the purpose of {purposeDescription} (the "Purpose").

3. RESTRICTIONS 

Licensee shall not: 
{restrictionsList}

4. TERM

This Agreement shall commence on the Effective Date and continue for {licenseeTerm}, unless earlier terminated in accordance with this Agreement. 

5. FEES

In consideration of the license granted herein, Licensee shall pay Licensor a fee of {licenseeFee}.

6. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of {governingLaw}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.
    `;
    
    setDocumentText(documentContent);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentText);
  };

  const downloadAsWord = () => {
    window.generateWordDoc(documentText, {
      fileName: "AI-Training-Data-License-Agreement"  
    });
  };
  
  const openCalendly = () => {
    Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'});
    return false;
  };
  
  return (
    <div className="generator">
      <h1>AI Training Data License Generator</h1>
      <div className="tab-navigation">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}  
            className={`tab-button ${currentTab === index ? "active" : ""}`}
            onClick={() => goToTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="form-content">
        {currentTab === 0 && (
          <>
            <div className="form-group">
              <label htmlFor="licensorName">Licensor Name:</label>
              <input
                type="text"
                id="licensorName"
                name="licensorName"
                value={formData.licensorName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="licenseeName">Licensee Name:</label>
              <input  
                type="text"
                id="licenseeName" 
                name="licenseeName"
                value={formData.licenseeName}
                onChange={handleChange}  
              />
            </div>
          </>
        )}
        {currentTab === 1 && (
          <div className="form-group">
            <label htmlFor="dataDescription">Data Description:</label>
            <textarea
              id="dataDescription"
              name="dataDescription" 
              value={formData.dataDescription}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
        )}
        {currentTab === 2 && (
          <div className="form-group">
            <label htmlFor="purposeDescription">Purpose Description:</label>
            <textarea
              id="purposeDescription"
              name="purposeDescription"
              value={formData.purposeDescription} 
              onChange={handleChange}
              rows={3}  
            ></textarea>
          </div>
        )}
        {currentTab === 3 && (
          <div className="form-group">
            <label htmlFor="restrictionsList">Restrictions:</label>  
            <textarea
              id="restrictionsList"
              name="restrictionsList"
              value={formData.restrictionsList}
              onChange={handleChange} 
              rows={4}
              placeholder="Enter each restriction on a new line"
            ></textarea>
          </div>
        )}
        {currentTab === 4 && (
          <>
            <div className="form-group"> 
              <label htmlFor="licenseeTerm">License Term:</label>
              <input
                type="text" 
                id="licenseeTerm"
                name="licenseeTerm"
                value={formData.licenseeTerm}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="licenseeFee">License Fee:</label>
              <input 
                type="text"
                id="licenseeFee" 
                name="licenseeFee"
                value={formData.licenseeFee}
                onChange={handleChange} 
              />
            </div>
          </>
        )}
        {currentTab === 5 && (
          <>
            <div className="form-group">
              <label htmlFor="governingLaw">Governing Law:</label>
              <input
                type="text"
                id="governingLaw"
                name="governingLaw" 
                value={formData.governingLaw}
                onChange={handleChange}
              />  
            </div>
            <div className="form-group">
              <button 
                className="consultation-button"
                onClick={openCalendly}
              >
                Book Consultation
              </button>
            </div>
          </>
        )}
      </div>
      <div className="navigation-buttons">
        <button
          onClick={prevTab}
          className={`prev-button ${currentTab === 0 ? "disabled" : ""}`} 
          disabled={currentTab === 0}
        >
          <i data-feather="chevron-left"></i> 
          Previous
        </button>
        <button onClick={copyToClipboard}>
          <i data-feather="copy"></i>
          Copy 
        </button>
        <button 
          onClick={downloadAsWord}
          className="download-button"
        >
          <i data-feather="download"></i>  
          Download
        </button>
        <button 
          onClick={nextTab}
          className="next-button"
        >
          Next
          <i data-feather="chevron-right"></i>
        </button>
      </div>
      <div className="preview-panel" ref={previewRef}>
        <h2>Preview</h2>
        <div 
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: highlightedText }} 
        />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AITrainingDataLicenseGenerator />);
