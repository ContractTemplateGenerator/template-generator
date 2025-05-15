// Legal Deadline Calculator - Simplified Version
const { useState, useRef, useEffect } = React;

// Basic holiday data for jurisdictions
const HOLIDAYS = {
  "federal": {
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
    "2025-12-25": "Christmas Day"
  },
  "california": {
    "2024-01-01": "New Year's Day",
    "2024-01-15": "Martin Luther King Jr. Day",
    "2024-02-12": "Lincoln's Birthday",
    "2024-02-19": "Presidents' Day",
    "2024-03-31": "César Chávez Day",
    "2024-05-27": "Memorial Day",
    "2024-06-19": "Juneteenth",
    "2024-07-04": "Independence Day",
    "2024-09-02": "Labor Day",
    "2024-10-14": "Columbus Day",
    "2024-11-11": "Veterans Day",
    "2024-11-28": "Thanksgiving Day",
    "2024-12-25": "Christmas Day",
    
    "2025-01-01": "New Year's Day",
    "2025-01-20": "Martin Luther King Jr. Day",
    "2025-02-12": "Lincoln's Birthday",
    "2025-02-17": "Presidents' Day",
    "2025-03-31": "César Chávez Day",
    "2025-05-26": "Memorial Day",
    "2025-06-19": "Juneteenth",
    "2025-07-04": "Independence Day",
    "2025-09-01": "Labor Day",
    "2025-10-13": "Columbus Day",
    "2025-11-11": "Veterans Day",
    "2025-11-27": "Thanksgiving Day",
    "2025-12-25": "Christmas Day"
  },
  "new_york": {
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
    "2025-12-25": "Christmas Day"
  },
  "texas": {
    "2024-01-01": "New Year's Day",
    "2024-01-15": "Martin Luther King Jr. Day",
    "2024-02-19": "Presidents' Day",
    "2024-05-27": "Memorial Day",
    "2024-06-19": "Juneteenth",
    "2024-07-04": "Independence Day",
    "2024-09-02": "Labor Day",
    "2024-11-11": "Veterans Day",
    "2024-11-28": "Thanksgiving Day",
    "2024-12-25": "Christmas Day",
    
    "2025-01-01": "New Year's Day",
    "2025-01-20": "Martin Luther King Jr. Day",
    "2025-02-17": "Presidents' Day",
    "2025-05-26": "Memorial Day",
    "2025-06-19": "Juneteenth",
    "2025-07-04": "Independence Day",
    "2025-09-01": "Labor Day",
    "2025-11-11": "Veterans Day",
    "2025-11-27": "Thanksgiving Day",
    "2025-12-25": "Christmas Day"
  }
};

// Helper functions
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

function isHoliday(date, jurisdiction) {
  const dateString = date.toISOString().split('T')[0];
  return HOLIDAYS[jurisdiction] && HOLIDAYS[jurisdiction][dateString] !== undefined;
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
    if (!isWeekend(result) && !isHoliday(result, jurisdiction)) {
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

// Adjust date if it falls on a weekend or holiday
function adjustDeadlineDate(date, jurisdiction) {
  let result = new Date(date);
  
  // If the date falls on a weekend or holiday, move to the next business day
  while (isWeekend(result) || isHoliday(result, jurisdiction)) {
    result.setDate(result.getDate() + 1);
  }
  
  return {
    adjustedDate: result,
    originalDate: date,
    wasAdjusted: result.getTime() !== date.getTime()
  };
}

// Main App Component
const App = () => {
  // State for form data
  const [formData, setFormData] = useState({
    jurisdiction: 'federal',
    filingDate: new Date().toISOString().split('T')[0],
    deadlineType: 'response',
    customPeriod: 30,
    customPeriodType: 'calendar',
    includeFilingDate: false,
    extendIfWeekendHoliday: true,
    serviceMethod: 'electronic',
    additionalDays: 0
  });
  
  // State for calculated deadline
  const [calculatedDeadline, setCalculatedDeadline] = useState(null);
  
  // State for highlighting changes
  const [lastChanged, setLastChanged] = useState(null);
  
  // Ref for preview content
  const previewRef = useRef(null);
  
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
    let ruleReference = "";
    
    // Get the deadline period based on the selected type
    if (formData.deadlineType === 'custom') {
      deadlineDays = parseInt(formData.customPeriod, 10) || 0;
      ruleReference = "Custom deadline";
    } else {
      // Predefined periods
      switch (formData.deadlineType) {
        case 'response':
          if (formData.jurisdiction === 'california') {
            deadlineDays = 30;
            ruleReference = "California Code of Civil Procedure 412.20(a)(3)";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 20;
            ruleReference = "New York CPLR 3012(a)";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 20;
            ruleReference = "Texas Rules of Civil Procedure 99(b)";
          } else {
            deadlineDays = 21;
            ruleReference = "Federal Rule of Civil Procedure 12(a)(1)(A)";
          }
          break;
        case 'appeal':
          if (formData.jurisdiction === 'california') {
            deadlineDays = 60;
            ruleReference = "California Rules of Court, rule 8.104";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 30;
            ruleReference = "New York CPLR 5513";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 30;
            ruleReference = "Texas Rules of Appellate Procedure 26.1";
          } else {
            deadlineDays = 30;
            ruleReference = "Federal Rules of Appellate Procedure 4(a)(1)(A)";
          }
          break;
        case 'discovery':
          if (formData.jurisdiction === 'california') {
            deadlineDays = 30;
            ruleReference = "California Code of Civil Procedure 2030.260";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 20;
            ruleReference = "New York CPLR 3133";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 30;
            ruleReference = "Texas Rules of Civil Procedure 196.2";
          } else {
            deadlineDays = 30;
            ruleReference = "Federal Rules of Civil Procedure 33, 34, 36";
          }
          break;
        case 'motion':
          if (formData.jurisdiction === 'california') {
            deadlineDays = 16;
            ruleReference = "California Rules of Court 3.1300(a)";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 8;
            ruleReference = "New York CPLR 2214(b)";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 7;
            ruleReference = "Texas Rules of Civil Procedure 21";
          } else {
            deadlineDays = 14;
            ruleReference = "Federal Rules of Civil Procedure 27(a)(4)";
          }
          break;
        default:
          deadlineDays = 30;
          ruleReference = "Default rule";
      }
    }
    
    // Calculate the deadline date
    let deadlineDate;
    if (formData.deadlineType === 'custom' && formData.customPeriodType === 'calendar') {
      deadlineDate = addCalendarDays(startDate, deadlineDays - (formData.includeFilingDate ? 1 : 0));
    } else {
      deadlineDate = addBusinessDays(startDate, deadlineDays - (formData.includeFilingDate ? 1 : 0), formData.jurisdiction);
    }
    
    // Add additional days for service method
    if (formData.additionalDays > 0) {
      if (formData.deadlineType === 'custom' && formData.customPeriodType === 'calendar') {
        deadlineDate = addCalendarDays(deadlineDate, parseInt(formData.additionalDays, 10));
      } else {
        deadlineDate = addBusinessDays(deadlineDate, parseInt(formData.additionalDays, 10), formData.jurisdiction);
      }
    }
    
    // Adjust the deadline if it falls on a weekend or holiday
    let adjustmentInfo = { wasAdjusted: false };
    if (formData.extendIfWeekendHoliday) {
      const adjustment = adjustDeadlineDate(deadlineDate, formData.jurisdiction);
      deadlineDate = adjustment.adjustedDate;
      adjustmentInfo = {
        wasAdjusted: adjustment.wasAdjusted,
        originalDate: adjustment.originalDate
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
      ruleReference: ruleReference
    });
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
  
  // Print document
  const printDocument = () => {
    try {
      const printWindow = window.open('', '_blank');
      
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Legal Deadline Calculation</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
            }
            h1 {
              color: #0069ff;
              text-align: center;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .calculation {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .deadline {
              font-weight: bold;
              font-size: 18px;
              color: #0069ff;
              padding: 10px;
              border: 1px solid #0069ff;
              border-radius: 5px;
              display: inline-block;
              margin: 15px 0;
            }
            .disclaimer {
              font-size: 12px;
              color: #666;
              margin-top: 30px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Legal Deadline Calculation</h1>
          </div>
          
          <div class="calculation">
            <p><strong>Jurisdiction:</strong> ${formData.jurisdiction === 'federal' ? 'Federal' : 
                                              formData.jurisdiction === 'california' ? 'California' : 
                                              formData.jurisdiction === 'new_york' ? 'New York' : 
                                              formData.jurisdiction === 'texas' ? 'Texas' : 
                                              formData.jurisdiction}</p>
            
            <p><strong>Deadline Type:</strong> ${formData.deadlineType === 'response' ? 'Response to Complaint/Petition' :
                                               formData.deadlineType === 'appeal' ? 'Appeal' :
                                               formData.deadlineType === 'discovery' ? 'Discovery Response' :
                                               formData.deadlineType === 'motion' ? 'Motion Response' :
                                               'Custom Deadline'}</p>
            
            <p><strong>Filing Date:</strong> ${calculatedDeadline.formattedStartDate}</p>
            
            <p><strong>Calculation Start Date:</strong> ${calculatedDeadline.formattedStartDate} 
              (${formData.includeFilingDate ? 'including' : 'excluding'} filing date)</p>
            
            <p><strong>Period:</strong> ${calculatedDeadline.days} 
              ${calculatedDeadline.periodType === 'business' ? 'business' : 'calendar'} days</p>
            
            ${formData.serviceMethod !== 'electronic' || formData.additionalDays > 0 ? 
              `<p><strong>Service Method:</strong> ${formData.serviceMethod.charAt(0).toUpperCase() + formData.serviceMethod.slice(1)}</p>` : ''}
            
            ${formData.additionalDays > 0 ? 
              `<p><strong>Additional Days for Service:</strong> ${formData.additionalDays}</p>` : ''}
            
            <p><strong>Legal Authority:</strong> ${calculatedDeadline.ruleReference}</p>
            
            <div class="deadline">
              DEADLINE DATE: ${calculatedDeadline.formattedDate}
            </div>
            
            ${calculatedDeadline.adjustment && calculatedDeadline.adjustment.wasAdjusted ? 
              `<p><strong>Note:</strong> The original calculated date (${formatDate(calculatedDeadline.adjustment.originalDate)}) was adjusted because it fell on a weekend or holiday.</p>` : ''}
            
            <div class="disclaimer">
              <p>Disclaimer: This deadline calculation is provided for informational purposes only and should not be considered legal advice. Legal deadlines can be complex and may vary based on specific court rules, local rules, and case circumstances. Always verify deadlines with applicable rules and consult with a licensed attorney for legal advice.</p>
              <p>Generated on: ${formatDate(new Date())}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.print();
      };
      
    } catch (error) {
      console.error("Error in printDocument:", error);
      alert("Error generating print view. Please try again.");
    }
  };
  
  // Download MS Word document
  const downloadAsWord = () => {
    try {
      const documentText = generateDocumentText();
      window.generateWordDoc(documentText, {
        documentTitle: "Legal Deadline Calculation",
        fileName: "Legal-Deadline-Calculation"
      });
    } catch (error) {
      console.error("Error in downloadAsWord:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    }
  };
    
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
    
    // Service method
    if (formData.serviceMethod !== 'electronic' || formData.additionalDays > 0) {
      text += `Service Method: ${formData.serviceMethod.charAt(0).toUpperCase() + formData.serviceMethod.slice(1)}\n`;
      if (formData.additionalDays > 0) {
        text += `Additional Days for Service: ${formData.additionalDays}\n`;
      }
      text += '\n';
    }
    
    // Rule reference if available
    if (calculatedDeadline.ruleReference) {
      text += `Legal Authority: ${calculatedDeadline.ruleReference}\n\n`;
    }
    
    // Result
    text += "DEADLINE DATE: " + calculatedDeadline.formattedDate + "\n\n";
    
    // Adjustment details
    if (calculatedDeadline.adjustment && calculatedDeadline.adjustment.wasAdjusted) {
      const originalDate = formatDate(calculatedDeadline.adjustment.originalDate);
      text += `Note: The original calculated date (${originalDate}) was adjusted because it fell on a weekend or holiday.\n\n`;
    }
    
    // Disclaimer
    text += "Disclaimer: This deadline calculation is provided for informational purposes only and should not be considered legal advice. Legal deadlines can be complex and may vary based on specific court rules, local rules, and case circumstances. Always verify deadlines with applicable rules and consult with a licensed attorney for legal advice.\n\n";
    
    text += "Generated on: " + formatDate(new Date()) + "\n";
    
    return text;
  };
  
  // Generate document text for preview and export
  const generateDocumentText = () => {
    if (!calculatedDeadline) {
      return "Please enter a valid filing date to calculate the deadline.";
    }
    
    let text = "";
    
    // Title
    text += "LEGAL DEADLINE CALCULATION\n\n";
  
  // Function to create a highlighted version of the text
  const createHighlightedText = () => {
    const documentText = generateDocumentText();
    const sectionToHighlight = getSectionToHighlight();
    
    if (!sectionToHighlight) return documentText;
    
    // Define regex patterns to find different sections
    const sections = {
      jurisdiction: /Jurisdiction: (Federal|California|New York|Texas)/,
      filingDate: /Filing Date: [^\n]+/,
      deadlineType: /Deadline Type: [^\n]+/,
      period: /Period: \d+ (business|calendar) days/,
      calculationStart: /Calculation Start Date: [^\n]+(including filing date|excludes filing date)/,
      service: /(Service Method|Additional Days for Service):[^\n]+/,
      deadline: /DEADLINE DATE: [^\n]+/
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
        
        <div className="form-content">
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
              <option value="new_york">New York</option>
              <option value="texas">Texas</option>
            </select>
          </div>
          
          <div className="form-group">
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
          
          <div className="form-group">
            <label htmlFor="serviceMethod">Service Method</label>
            <select 
              id="serviceMethod" 
              name="serviceMethod"
              className="form-control"
              value={formData.serviceMethod}
              onChange={handleChange}
            >
              <option value="electronic">Electronic Filing/Service</option>
              <option value="personal">Personal Service</option>
              <option value="mail">Mail Service</option>
              <option value="fax">Fax Service</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalDays">Additional Days for Service</label>
            <select 
              id="additionalDays"
              name="additionalDays"
              className="form-control"
              value={formData.additionalDays}
              onChange={handleChange}
            >
              <option value="0">None</option>
              <option value="1">1 Day</option>
              <option value="2">2 Days</option>
              <option value="3">3 Days (Federal Mail Service)</option>
              <option value="5">5 Days (CA Mail Service)</option>
            </select>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="button-group">
          <button
            onClick={copyToClipboard}
            className="action-button"
            style={{
              backgroundColor: "#4f46e5", 
              color: "white"
            }}
          >
            Copy to Clipboard
          </button>
          
          <button
            onClick={printDocument}
            className="action-button"
            style={{
              backgroundColor: "#0069ff", 
              color: "white"
            }}
          >
            Print
          </button>
          
          <button
            onClick={downloadAsWord}
            className="action-button"
            style={{
              backgroundColor: "#2563eb", 
              color: "white"
            }}
          >
            Download MS Word
          </button>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="preview-panel">
        <div className="preview-content" ref={previewRef}>
          <h2>Preview</h2>
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
