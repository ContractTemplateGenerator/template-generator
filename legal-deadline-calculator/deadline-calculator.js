// Legal Deadline Calculator
const { useState, useRef, useEffect } = React;

// Holiday data for different jurisdictions
const FEDERAL_HOLIDAYS = {
  // 2025 holidays (based on current date for the assignment)
  "2025-01-01": "New Year's Day",
  "2025-01-20": "Martin Luther King Jr. Day",
  "2025-02-17": "Presidents' Day",
  "2025-05-26": "Memorial Day",
  "2025-06-19": "Juneteenth",
  "2025-07-04": "Independence Day",
  "2025-09-01": "Labor Day",
  "2025-10-13": "Columbus Day",
  "2025-11-11": "Veterans Day",
  "2025-11-27": "Thanksgiving Day",
  "2025-12-25": "Christmas Day",
  
  // 2024 holidays (to handle calculations from past dates)
  "2024-01-01": "New Year's Day",
  "2024-01-15": "Martin Luther King Jr. Day",
  "2024-02-19": "Presidents' Day",
  "2024-05-27": "Memorial Day",
  "2024-06-19": "Juneteenth",
  "2024-07-04": "Independence Day",
  "2024-09-02": "Labor Day",
  "2024-10-14": "Columbus Day",
  "2024-11-11": "Veterans Day",
  "2024-11-28": "Thanksgiving Day",
  "2024-12-25": "Christmas Day",
};

// Additional California court holidays
const CA_COURT_HOLIDAYS = {
  ...FEDERAL_HOLIDAYS,
  "2025-02-12": "Lincoln's Birthday (CA Courts)",
  "2025-03-31": "César Chávez Day (CA Courts)",
  
  "2024-02-12": "Lincoln's Birthday (CA Courts)",
  "2024-03-31": "César Chávez Day (CA Courts)",
};

// Helper functions
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

function isHoliday(dateString, jurisdiction) {
  const holidays = jurisdiction === 'california' ? CA_COURT_HOLIDAYS : FEDERAL_HOLIDAYS;
  return holidays[dateString] !== undefined;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function addBusinessDays(date, days, jurisdiction) {
  let result = new Date(date);
  let daysAdded = 0;
  
  while (daysAdded < days) {
    result.setDate(result.getDate() + 1);
    
    // Skip weekends and holidays
    const dateString = result.toISOString().split('T')[0];
    if (!isWeekend(result) && !isHoliday(dateString, jurisdiction)) {
      daysAdded++;
    }
  }
  
  return result;
}

function addCalendarDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Function to check if the date falls on a weekend or holiday
function checkNonBusinessDay(date, jurisdiction) {
  // Check if it's a weekend
  if (isWeekend(date)) {
    return { isNonBusinessDay: true, reason: "Weekend" };
  }
  
  // Check if it's a holiday
  const dateString = date.toISOString().split('T')[0];
  const holidays = jurisdiction === 'california' ? CA_COURT_HOLIDAYS : FEDERAL_HOLIDAYS;
  
  if (holidays[dateString]) {
    return { isNonBusinessDay: true, reason: holidays[dateString] };
  }
  
  return { isNonBusinessDay: false, reason: null };
}

// Adjust date if it falls on a weekend or holiday
function adjustDeadlineDate(date, jurisdiction) {
  let result = new Date(date);
  let nonBusinessDayInfo = checkNonBusinessDay(result, jurisdiction);
  
  // If the date falls on a weekend or holiday, move to the next business day
  while (nonBusinessDayInfo.isNonBusinessDay) {
    result.setDate(result.getDate() + 1);
    nonBusinessDayInfo = checkNonBusinessDay(result, jurisdiction);
  }
  
  return {
    adjustedDate: result,
    originalDate: date,
    wasAdjusted: result.getTime() !== date.getTime(),
    reason: nonBusinessDayInfo.reason
  };
}

// Main App Component
const App = () => {
  // Tabs configuration
  const tabs = [
    { id: 'basic', label: 'Basic Settings' },
    { id: 'advanced', label: 'Advanced Options' },
    { id: 'results', label: 'Calculation Results' },
  ];
  
  // State for form data
  const [formData, setFormData] = useState({
    jurisdiction: 'federal',
    filingDate: new Date().toISOString().split('T')[0],
    deadlineType: 'response',
    customPeriod: 30,
    customPeriodType: 'calendar',
    includeFilingDate: false,
    extendIfWeekendHoliday: true,
    notes: '',
    documentTitle: 'Legal Deadline Calculation',
    fileName: 'Legal-Deadline-Calculation',
  });
  
  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
  // State for calculated deadline
  const [calculatedDeadline, setCalculatedDeadline] = useState(null);
  
  // Calculate the deadline whenever form data changes
  useEffect(() => {
    calculateDeadline();
  }, [formData]);
  
  // Effect to scroll to highlighted text
  useEffect(() => {
    if (previewRef.current) {
      const highlightedElement = previewRef.current.querySelector('.highlighted-text');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastChanged]);
  
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
  
  // Function to set today's date
  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      filingDate: today
    }));
    setLastChanged('filingDate');
  };
  
  // Calculate the deadline based on form data
  const calculateDeadline = () => {
    if (!formData.filingDate) {
      setCalculatedDeadline(null);
      return;
    }
    
    // Parse the filing date
    let startDate = new Date(formData.filingDate);
    
    // Adjust for "including filing date" option
    if (!formData.includeFilingDate) {
      startDate.setDate(startDate.getDate() + 1);
    }
    
    let deadlineDays;
    
    // Get the deadline period based on the selected type
    if (formData.deadlineType === 'custom') {
      deadlineDays = parseInt(formData.customPeriod, 10) || 0;
    } else {
      // Predefined periods based on common legal deadlines
      switch (formData.deadlineType) {
        case 'response':
          deadlineDays = formData.jurisdiction === 'california' ? 30 : 21;
          break;
        case 'appeal':
          deadlineDays = formData.jurisdiction === 'california' ? 60 : 30;
          break;
        case 'discovery':
          deadlineDays = formData.jurisdiction === 'california' ? 30 : 30;
          break;
        case 'motion':
          deadlineDays = formData.jurisdiction === 'california' ? 16 : 14;
          break;
        default:
          deadlineDays = 30;
      }
    }
    
    // Calculate the deadline date
    let deadlineDate;
    if (formData.deadlineType === 'custom' && formData.customPeriodType === 'calendar') {
      deadlineDate = addCalendarDays(startDate, deadlineDays - (formData.includeFilingDate ? 1 : 0));
    } else {
      deadlineDate = addBusinessDays(startDate, deadlineDays - (formData.includeFilingDate ? 1 : 0), formData.jurisdiction);
    }
    
    // Adjust the deadline if it falls on a weekend or holiday
    let adjustmentInfo = { wasAdjusted: false, reason: null };
    if (formData.extendIfWeekendHoliday) {
      const adjustment = adjustDeadlineDate(deadlineDate, formData.jurisdiction);
      deadlineDate = adjustment.adjustedDate;
      adjustmentInfo = {
        wasAdjusted: adjustment.wasAdjusted,
        originalDate: adjustment.originalDate,
        reason: adjustment.reason
      };
    }
    
    // Set the calculated deadline
    setCalculatedDeadline({
      date: deadlineDate,
      formattedDate: formatDate(deadlineDate),
      startDate: startDate,
      formattedStartDate: formatDate(startDate),
      days: deadlineDays,
      adjustment: adjustmentInfo,
      periodType: formData.deadlineType === 'custom' ? formData.customPeriodType : 'business',
      jurisdiction: formData.jurisdiction,
    });
  };
  
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
    try {
      const textToCopy = generateDocumentText();
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert("Deadline calculation copied to clipboard!");
        })
        .catch(err => {
          console.error("Clipboard error:", err);
          alert("Failed to copy to clipboard. Please try again.");
        });
    } catch (error) {
      console.error("Copy error:", error);
      alert("An error occurred while copying to clipboard.");
    }
  };
  
  // Download MS Word document
  const downloadAsWord = () => {
    try {
      const documentText = generateDocumentText();
      window.generateWordDoc(documentText, {
        documentTitle: formData.documentTitle,
        fileName: formData.fileName
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
  
  // Generate document text for preview and export
  const generateDocumentText = () => {
    if (!calculatedDeadline) {
      return "Please enter a valid filing date to calculate the deadline.";
    }
    
    let text = "";
    
    // Title
    text += "LEGAL DEADLINE CALCULATION\n\n";
    
    // Jurisdiction
    text += `Jurisdiction: ${formData.jurisdiction === 'federal' ? 'Federal' : 'California'}\n\n`;
    
    // Deadline Type
    let deadlineTypeText = "";
    switch (formData.deadlineType) {
      case 'response':
        deadlineTypeText = "Response Deadline";
        break;
      case 'appeal':
        deadlineTypeText = "Appeal Deadline";
        break;
      case 'discovery':
        deadlineTypeText = "Discovery Response";
        break;
      case 'motion':
        deadlineTypeText = "Motion Response";
        break;
      case 'custom':
        deadlineTypeText = "Custom Deadline";
        break;
    }
    text += `Deadline Type: ${deadlineTypeText}\n\n`;
    
    // Calculation details
    text += `Filing Date: ${calculatedDeadline.formattedStartDate}\n`;
    text += `Calculation Start Date: ${calculatedDeadline.formattedStartDate}${formData.includeFilingDate ? ' (including filing date)' : ' (excludes filing date)'}\n\n`;
    
    // Period
    const periodType = calculatedDeadline.periodType === 'business' ? 'business days' : 'calendar days';
    text += `Period: ${calculatedDeadline.days} ${periodType}\n\n`;
    
    // Result
    text += "DEADLINE DATE: " + calculatedDeadline.formattedDate + "\n\n";
    
    // Adjustment details
    if (calculatedDeadline.adjustment && calculatedDeadline.adjustment.wasAdjusted) {
      const originalDate = formatDate(calculatedDeadline.adjustment.originalDate);
      text += `Note: The original calculated date (${originalDate}) was adjusted because it fell on a ${calculatedDeadline.adjustment.reason}.\n\n`;
    }
    
    // Additional notes
    if (formData.notes) {
      text += "Additional Notes:\n" + formData.notes + "\n\n";
    }
    
    // Disclaimer
    text += "Disclaimer: This deadline calculation is provided for informational purposes only and should not be considered legal advice. Legal deadlines can be complex and may vary based on specific court rules, local rules, and case circumstances. Always verify deadlines with applicable rules and consult with a licensed attorney for legal advice.\n\n";
    
    text += "Generated on: " + formatDate(new Date()) + "\n";
    
    return text;
  };
  
  // Function to determine which section to highlight based on the last changed field
  const getSectionToHighlight = () => {
    switch (lastChanged) {
      case 'jurisdiction':
        return 'jurisdiction';
      case 'filingDate':
        return 'filingDate';
      case 'deadlineType':
        return 'deadlineType';
      case 'customPeriod':
      case 'customPeriodType':
        return 'period';
      case 'includeFilingDate':
        return 'calculationStart';
      case 'extendIfWeekendHoliday':
        return 'adjustment';
      case 'notes':
        return 'notes';
      default:
        return null;
    }
  };
  
  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const documentText = generateDocumentText();
    const sectionToHighlight = getSectionToHighlight();
    
    if (!sectionToHighlight) return documentText;
    
    // Define regex patterns or simple strings to find different sections
    const sections = {
      jurisdiction: /Jurisdiction: (Federal|California)/,
      filingDate: /Filing Date: [^\n]+/,
      deadlineType: /Deadline Type: [^\n]+/,
      period: /Period: \d+ (business|calendar) days/,
      calculationStart: /Calculation Start Date: [^\n]+(including filing date|excludes filing date)/,
      deadline: /DEADLINE DATE: [^\n]+/,
      adjustment: /Note: The original calculated date.*?was adjusted[^\n]+/,
      notes: /Additional Notes:\n[^\n]+/
    };
    
    if (sectionToHighlight === 'deadline' && sections.deadline.test(documentText)) {
      return documentText.replace(sections.deadline, match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    if (sections[sectionToHighlight] && sections[sectionToHighlight].test(documentText)) {
      return documentText.replace(sections[sectionToHighlight], match => 
        `<span class="highlighted-text">${match}</span>`
      );
    }
    
    return documentText;
  };
  
  // Create highlightable content
  const highlightedText = createHighlightedText();
  
  // Render the component
  return (
    <div className="container">
      <div className="form-panel">
        <div className="header">
          <h1>Legal Deadline Calculator</h1>
          <p>Calculate accurate legal deadlines based on filing dates and jurisdiction rules</p>
        </div>
        
        {/* Tab navigation */}
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
        
        {/* Tab 1: Basic Settings */}
        {currentTab === 0 && (
          <div className="tab-content">
            <h2 className="form-subtitle">Basic Settings</h2>
            
            <div className="form-group">
              <label htmlFor="jurisdiction">Jurisdiction</label>
              <select 
                id="jurisdiction" 
                name="jurisdiction"
                className="form-control"
                value={formData.jurisdiction}
                onChange={handleChange}
              >
                <option value="federal">Federal</option>
                <option value="california">California</option>
              </select>
              <div className="form-info">Select the jurisdiction that applies to your legal matter.</div>
            </div>
            
            <div className="form-group date-group">
              <label htmlFor="filingDate">Filing Date</label>
              <div className="date-input-wrapper">
                <input 
                  type="date" 
                  id="filingDate"
                  name="filingDate"
                  className="form-control"
                  value={formData.filingDate}
                  onChange={handleChange}
                />
                <button type="button" className="today-button" onClick={setTodayDate}>
                  Today
                </button>
              </div>
              <div className="form-info">The date when the filing occurred or will occur.</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="deadlineType">Deadline Type</label>
              <select 
                id="deadlineType" 
                name="deadlineType"
                className="form-control"
                value={formData.deadlineType}
                onChange={handleChange}
              >
                <option value="response">Response to Complaint/Petition</option>
                <option value="appeal">Appeal</option>
                <option value="discovery">Discovery Response</option>
                <option value="motion">Motion Response</option>
                <option value="custom">Custom Deadline</option>
              </select>
              <div className="form-info">Select the type of legal deadline you need to calculate.</div>
            </div>
            
            {formData.deadlineType === 'custom' && (
              <div className="form-group">
                <label htmlFor="customPeriod">Custom Period (Days)</label>
                <input 
                  type="number" 
                  id="customPeriod"
                  name="customPeriod"
                  className="form-control"
                  value={formData.customPeriod}
                  onChange={handleChange}
                  min="1"
                  max="365"
                />
                
                <div className="radio-group">
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="businessDays"
                      name="customPeriodType"
                      value="business"
                      checked={formData.customPeriodType === 'business'}
                      onChange={handleChange}
                    />
                    <label htmlFor="businessDays">Business Days</label>
                  </div>
                  
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="calendarDays"
                      name="customPeriodType"
                      value="calendar"
                      checked={formData.customPeriodType === 'calendar'}
                      onChange={handleChange}
                    />
                    <label htmlFor="calendarDays">Calendar Days</label>
                  </div>
                </div>
              </div>
            )}
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="includeFilingDate"
                name="includeFilingDate"
                checked={formData.includeFilingDate}
                onChange={handleChange}
              />
              <label htmlFor="includeFilingDate">Include Filing Date in Calculation</label>
            </div>
            <div className="form-info">If checked, the filing date will be counted as day one in the deadline calculation.</div>
          </div>
        )}
        
        {/* Tab 2: Advanced Options */}
        {currentTab === 1 && (
          <div className="tab-content">
            <h2 className="form-subtitle">Advanced Options</h2>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="extendIfWeekendHoliday"
                name="extendIfWeekendHoliday"
                checked={formData.extendIfWeekendHoliday}
                onChange={handleChange}
              />
              <label htmlFor="extendIfWeekendHoliday">Extend Deadline if Falls on Weekend/Holiday</label>
            </div>
            <div className="form-info">If checked, deadlines falling on weekends or holidays will be extended to the next business day.</div>
            
            <div className="form-group mt-4">
              <label htmlFor="documentTitle">Document Title</label>
              <input 
                type="text" 
                id="documentTitle"
                name="documentTitle"
                className="form-control"
                value={formData.documentTitle}
                onChange={handleChange}
                placeholder="Legal Deadline Calculation"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fileName">File Name (for Download)</label>
              <input 
                type="text" 
                id="fileName"
                name="fileName"
                className="form-control"
                value={formData.fileName}
                onChange={handleChange}
                placeholder="Legal-Deadline-Calculation"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea 
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Add any notes or reminders about this deadline..."
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Tab 3: Results */}
        {currentTab === 2 && (
          <div className="tab-content">
            <h2 className="form-subtitle">Calculation Results</h2>
            
            {calculatedDeadline ? (
              <div className="deadline-result">
                <h3>Deadline Calculation Summary</h3>
                
                <p>
                  <strong>Filing Date:</strong> {calculatedDeadline.formattedStartDate}
                </p>
                
                <p>
                  <strong>Calculation Start:</strong> {calculatedDeadline.formattedStartDate}
                  <span> ({formData.includeFilingDate ? 'including' : 'excluding'} filing date)</span>
                </p>
                
                <p>
                  <strong>Period:</strong> {calculatedDeadline.days} {calculatedDeadline.periodType === 'business' ? 'business' : 'calendar'} days
                </p>
                
                <div className="deadline-date">
                  Deadline: {calculatedDeadline.formattedDate}
                </div>
                
                {calculatedDeadline.adjustment && calculatedDeadline.adjustment.wasAdjusted && (
                  <div className="holiday-notice">
                    <strong>Note:</strong> The original calculated date ({formatDate(calculatedDeadline.adjustment.originalDate)}) was adjusted because it fell on a {calculatedDeadline.adjustment.reason}.
                  </div>
                )}
                
                {formData.notes && (
                  <div className="deadline-notes">
                    <h4>Additional Notes:</h4>
                    <p>{formData.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>Please enter a valid filing date to calculate the deadline.</p>
            )}
            
            <div className="disclaimer">
              <p>Disclaimer: This deadline calculation is provided for informational purposes only and should not be considered legal advice. Legal deadlines can be complex and may vary based on specific court rules, local rules, and case circumstances. Always verify deadlines with applicable rules and consult with a licensed attorney for legal advice.</p>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button
            onClick={prevTab}
            className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
            disabled={currentTab === 0}
          >
            <i data-feather="chevron-left"></i>
            Previous
          </button>
          
          <button
            onClick={copyToClipboard}
            className="nav-button"
            style={{
              backgroundColor: "#4f46e5", 
              color: "white",
              border: "none"
            }}
          >
            <i data-feather="copy"></i>
            Copy to Clipboard
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
            <i data-feather="file-text"></i>
            Download MS Word
          </button>
          
          <button
            onClick={nextTab}
            className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
            disabled={currentTab === tabs.length - 1}
          >
            Next
            <i data-feather="chevron-right"></i>
          </button>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="preview-panel">
        <div className="preview-content" ref={previewRef}>
          <h2>Live Preview</h2>
          <pre 
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
    </div>
  );
};

// Render the App component
ReactDOM.render(<App />, document.getElementById('root'));
