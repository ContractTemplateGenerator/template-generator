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

// State-specific court holidays
const STATE_HOLIDAYS = {
  // California holidays
  "california": {
    ...FEDERAL_HOLIDAYS,
    "2025-02-12": "Lincoln's Birthday (CA Courts)",
    "2025-03-31": "César Chávez Day (CA Courts)",
    "2024-02-12": "Lincoln's Birthday (CA Courts)",
    "2024-03-31": "César Chávez Day (CA Courts)",
  },
  
  // New York holidays
  "new_york": {
    ...FEDERAL_HOLIDAYS,
    "2025-02-12": "Lincoln's Birthday (NY Courts)",
    "2025-03-17": "Evacuation Day (NY Courts)",
    "2024-02-12": "Lincoln's Birthday (NY Courts)",
    "2024-03-17": "Evacuation Day (NY Courts)",
  },
  
  // Texas holidays
  "texas": {
    ...FEDERAL_HOLIDAYS,
    "2025-01-19": "Confederate Heroes Day (TX Courts)",
    "2025-03-02": "Texas Independence Day (TX Courts)",
    "2025-04-21": "San Jacinto Day (TX Courts)",
    "2025-06-19": "Emancipation Day (TX Courts)",
    "2025-08-27": "Lyndon B. Johnson Day (TX Courts)",
    "2024-01-19": "Confederate Heroes Day (TX Courts)",
    "2024-03-02": "Texas Independence Day (TX Courts)",
    "2024-04-21": "San Jacinto Day (TX Courts)",
    "2024-06-19": "Emancipation Day (TX Courts)",
    "2024-08-27": "Lyndon B. Johnson Day (TX Courts)",
  },
  
  // Florida holidays
  "florida": {
    ...FEDERAL_HOLIDAYS,
    "2025-04-26": "Confederate Memorial Day (FL Courts)",
    "2025-06-03": "Jefferson Davis' Birthday (FL Courts)",
    "2024-04-26": "Confederate Memorial Day (FL Courts)",
    "2024-06-03": "Jefferson Davis' Birthday (FL Courts)",
  },
  
  // Illinois holidays
  "illinois": {
    ...FEDERAL_HOLIDAYS,
    "2025-02-12": "Lincoln's Birthday (IL Courts)",
    "2025-11-28": "Day After Thanksgiving (IL Courts)",
    "2025-12-24": "Christmas Eve (IL Courts)",
    "2025-12-31": "New Year's Eve (IL Courts)",
    "2024-02-12": "Lincoln's Birthday (IL Courts)",
    "2024-11-29": "Day After Thanksgiving (IL Courts)",
    "2024-12-24": "Christmas Eve (IL Courts)",
    "2024-12-31": "New Year's Eve (IL Courts)",
  },
  
  // Washington state holidays
  "washington": {
    ...FEDERAL_HOLIDAYS,
    "2025-02-12": "Lincoln's Birthday (WA Courts)",
    "2025-12-26": "Day After Christmas (WA Courts)",
    "2024-02-12": "Lincoln's Birthday (WA Courts)",
    "2024-12-26": "Day After Christmas (WA Courts)",
  },
  
  // Pennsylvania holidays
  "pennsylvania": {
    ...FEDERAL_HOLIDAYS,
    "2025-02-12": "Lincoln's Birthday (PA Courts)",
    "2025-03-17": "St. Patrick's Day (PA Courts)",
    "2025-11-28": "Day After Thanksgiving (PA Courts)",
    "2024-02-12": "Lincoln's Birthday (PA Courts)",
    "2024-03-17": "St. Patrick's Day (PA Courts)",
    "2024-11-29": "Day After Thanksgiving (PA Courts)",
  },
  
  // Georgia holidays
  "georgia": {
    ...FEDERAL_HOLIDAYS,
    "2025-01-19": "Robert E. Lee's Birthday (GA Courts)",
    "2025-04-26": "Confederate Memorial Day (GA Courts)",
    "2024-01-19": "Robert E. Lee's Birthday (GA Courts)",
    "2024-04-26": "Confederate Memorial Day (GA Courts)",
  },
  
  // Massachusetts holidays
  "massachusetts": {
    ...FEDERAL_HOLIDAYS,
    "2025-03-17": "Evacuation Day (MA Courts)",
    "2025-04-20": "Patriots' Day (MA Courts)",
    "2025-06-17": "Bunker Hill Day (MA Courts)",
    "2024-03-17": "Evacuation Day (MA Courts)",
    "2024-04-15": "Patriots' Day (MA Courts)",
    "2024-06-17": "Bunker Hill Day (MA Courts)",
  },
  
  // Michigan holidays
  "michigan": {
    ...FEDERAL_HOLIDAYS,
    "2025-11-28": "Day After Thanksgiving (MI Courts)",
    "2025-12-24": "Christmas Eve (MI Courts)",
    "2025-12-31": "New Year's Eve (MI Courts)",
    "2024-11-29": "Day After Thanksgiving (MI Courts)",
    "2024-12-24": "Christmas Eve (MI Courts)",
    "2024-12-31": "New Year's Eve (MI Courts)",
  },
};

// Helper functions
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

function isHoliday(dateString, jurisdiction) {
  if (jurisdiction === 'federal') {
    return FEDERAL_HOLIDAYS[dateString] !== undefined;
  } else {
    return STATE_HOLIDAYS[jurisdiction] && STATE_HOLIDAYS[jurisdiction][dateString] !== undefined;
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function addBusinessDays(date, days, jurisdiction, courtClosures = []) {
  let result = new Date(date);
  let daysAdded = 0;
  
  while (daysAdded < days) {
    result.setDate(result.getDate() + 1);
    
    // Skip weekends and holidays
    const dateString = result.toISOString().split('T')[0];
    if (!isWeekend(result) && 
        !isHoliday(dateString, jurisdiction) &&
        !courtClosures.includes(dateString)) {
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

// Check if the date falls on a weekend or holiday
function checkNonBusinessDay(date, jurisdiction, courtClosures = []) {
  // Check if it's a weekend
  if (isWeekend(date)) {
    return { isNonBusinessDay: true, reason: "Weekend" };
  }
  
  // Check if it's a holiday
  const dateString = date.toISOString().split('T')[0];
  
  if (jurisdiction === 'federal') {
    if (FEDERAL_HOLIDAYS[dateString]) {
      return { isNonBusinessDay: true, reason: FEDERAL_HOLIDAYS[dateString] };
    }
  } else if (STATE_HOLIDAYS[jurisdiction] && STATE_HOLIDAYS[jurisdiction][dateString]) {
    return { isNonBusinessDay: true, reason: STATE_HOLIDAYS[jurisdiction][dateString] };
  }
  
  // Check if it's a court closure date
  if (courtClosures.includes(dateString)) {
    return { isNonBusinessDay: true, reason: "Court Closure" };
  }
  
  return { isNonBusinessDay: false, reason: null };
}

// Adjust date if it falls on a weekend or holiday
function adjustDeadlineDate(date, jurisdiction, courtClosures = []) {
  let result = new Date(date);
  let nonBusinessDayInfo = checkNonBusinessDay(result, jurisdiction, courtClosures);
  
  // If the date falls on a weekend or holiday, move to the next business day
  while (nonBusinessDayInfo.isNonBusinessDay) {
    result.setDate(result.getDate() + 1);
    nonBusinessDayInfo = checkNonBusinessDay(result, jurisdiction, courtClosures);
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
    { id: 'rules', label: 'Rules Reference' },
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
    serviceMethod: 'electronic',
    additionalDays: 0,
    notes: '',
    documentTitle: 'Legal Deadline Calculation',
    fileName: 'Legal-Deadline-Calculation',
  });
  
  // State for emergency court closures
  const [courtClosures, setCourtClosures] = useState([]);
  
  // Function to add a court closure date
  const addCourtClosure = () => {
    const closureDate = new Date().toISOString().split('T')[0];
    setCourtClosures([...courtClosures, closureDate]);
    setLastChanged('courtClosures');
  };
  
  // Function to remove a court closure date
  const removeCourtClosure = (index) => {
    const updatedClosures = [...courtClosures];
    updatedClosures.splice(index, 1);
    setCourtClosures(updatedClosures);
    setLastChanged('courtClosures');
  };
  
  // Ref for preview content div
  const previewRef = useRef(null);
  
  // State for calculated deadline
  const [calculatedDeadline, setCalculatedDeadline] = useState(null);
  
  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);
  
  // State to track what was last changed
  const [lastChanged, setLastChanged] = useState(null);
  
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
    let ruleReference = ""; // Add rule reference
    
    // Get the deadline period based on the selected type
    if (formData.deadlineType === 'custom') {
      deadlineDays = parseInt(formData.customPeriod, 10) || 0;
      ruleReference = "Custom deadline"; // Set rule reference for custom deadline
    } else {
      // Predefined periods based on common legal deadlines for each jurisdiction
      switch (formData.deadlineType) {
        case 'response':
          // Response to complaint periods
          if (formData.jurisdiction === 'federal') {
            deadlineDays = 21;
            ruleReference = "Federal Rule of Civil Procedure 12(a)(1)(A)";
          } else if (formData.jurisdiction === 'california') {
            deadlineDays = 30;
            ruleReference = "California Code of Civil Procedure 412.20(a)(3)";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 20;
            ruleReference = "New York CPLR 3012(a)";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 20;
            ruleReference = "Texas Rules of Civil Procedure 99(b)";
          } else if (formData.jurisdiction === 'florida') {
            deadlineDays = 20;
            ruleReference = "Florida Rules of Civil Procedure 1.140(a)";
          } else if (formData.jurisdiction === 'illinois') {
            deadlineDays = 30;
            ruleReference = "Illinois Code of Civil Procedure 2-615";
          } else if (formData.jurisdiction === 'pennsylvania') {
            deadlineDays = 20;
            ruleReference = "Pennsylvania Rules of Civil Procedure 1026";
          } else if (formData.jurisdiction === 'washington') {
            deadlineDays = 20;
            ruleReference = "Washington Superior Court Civil Rules 4(a)(2)";
          } else if (formData.jurisdiction === 'georgia') {
            deadlineDays = 30;
            ruleReference = "Georgia Code § 9-11-12";
          } else if (formData.jurisdiction === 'massachusetts') {
            deadlineDays = 20;
            ruleReference = "Massachusetts Rules of Civil Procedure 12(a)";
          } else if (formData.jurisdiction === 'michigan') {
            deadlineDays = 21;
            ruleReference = "Michigan Court Rules 2.108";
          } else {
            deadlineDays = 21;
            ruleReference = "Default rule";
          }
          break;
        case 'appeal':
          // Appeal periods
          if (formData.jurisdiction === 'federal') {
            deadlineDays = 30;
            ruleReference = "Federal Rules of Appellate Procedure 4(a)(1)(A)";
          } else if (formData.jurisdiction === 'california') {
            deadlineDays = 60;
            ruleReference = "California Rules of Court, rule 8.104";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 30;
            ruleReference = "New York CPLR 5513";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 30;
            ruleReference = "Texas Rules of Appellate Procedure 26.1";
          } else if (formData.jurisdiction === 'florida') {
            deadlineDays = 30;
            ruleReference = "Florida Rules of Appellate Procedure 9.110(b)";
          } else if (formData.jurisdiction === 'illinois') {
            deadlineDays = 30;
            ruleReference = "Illinois Supreme Court Rule 303";
          } else if (formData.jurisdiction === 'pennsylvania') {
            deadlineDays = 30;
            ruleReference = "Pennsylvania Rules of Appellate Procedure 903";
          } else if (formData.jurisdiction === 'washington') {
            deadlineDays = 30;
            ruleReference = "Washington Rules of Appellate Procedure 5.2";
          } else if (formData.jurisdiction === 'georgia') {
            deadlineDays = 30;
            ruleReference = "Georgia Code § 5-6-38";
          } else if (formData.jurisdiction === 'massachusetts') {
            deadlineDays = 30;
            ruleReference = "Massachusetts Rules of Appellate Procedure 4(a)";
          } else if (formData.jurisdiction === 'michigan') {
            deadlineDays = 21;
            ruleReference = "Michigan Court Rules 7.204";
          } else {
            deadlineDays = 30;
            ruleReference = "Default rule";
          }
          break;
        case 'discovery':
          // Discovery response periods
          if (formData.jurisdiction === 'federal') {
            deadlineDays = 30;
            ruleReference = "Federal Rules of Civil Procedure 33, 34, 36";
          } else if (formData.jurisdiction === 'california') {
            deadlineDays = 30;
            ruleReference = "California Code of Civil Procedure 2030.260";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 20;
            ruleReference = "New York CPLR 3133";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 30;
            ruleReference = "Texas Rules of Civil Procedure 196.2";
          } else if (formData.jurisdiction === 'florida') {
            deadlineDays = 30;
            ruleReference = "Florida Rules of Civil Procedure 1.340";
          } else if (formData.jurisdiction === 'illinois') {
            deadlineDays = 28;
            ruleReference = "Illinois Supreme Court Rule 213";
          } else if (formData.jurisdiction === 'pennsylvania') {
            deadlineDays = 30;
            ruleReference = "Pennsylvania Rules of Civil Procedure 4009.12";
          } else if (formData.jurisdiction === 'washington') {
            deadlineDays = 30;
            ruleReference = "Washington Superior Court Civil Rules 33";
          } else if (formData.jurisdiction === 'georgia') {
            deadlineDays = 30;
            ruleReference = "Georgia Code § 9-11-33";
          } else if (formData.jurisdiction === 'massachusetts') {
            deadlineDays = 30;
            ruleReference = "Massachusetts Rules of Civil Procedure 33";
          } else if (formData.jurisdiction === 'michigan') {
            deadlineDays = 28;
            ruleReference = "Michigan Court Rules 2.309";
          } else {
            deadlineDays = 30;
            ruleReference = "Default rule";
          }
          break;
        case 'motion':
          // Motion response periods
          if (formData.jurisdiction === 'federal') {
            deadlineDays = 14;
            ruleReference = "Federal Rules of Civil Procedure 27(a)(4)";
          } else if (formData.jurisdiction === 'california') {
            deadlineDays = 16;
            ruleReference = "California Rules of Court 3.1300(a)";
          } else if (formData.jurisdiction === 'new_york') {
            deadlineDays = 8;
            ruleReference = "New York CPLR 2214(b)";
          } else if (formData.jurisdiction === 'texas') {
            deadlineDays = 7;
            ruleReference = "Texas Rules of Civil Procedure 21";
          } else if (formData.jurisdiction === 'florida') {
            deadlineDays = 5;
            ruleReference = "Florida Rules of Civil Procedure 1.500";
          } else if (formData.jurisdiction === 'illinois') {
            deadlineDays = 14;
            ruleReference = "Illinois Code of Civil Procedure 2-1301";
          } else if (formData.jurisdiction === 'pennsylvania') {
            deadlineDays = 20;
            ruleReference = "Pennsylvania Rules of Civil Procedure 1029";
          } else if (formData.jurisdiction === 'washington') {
            deadlineDays = 14;
            ruleReference = "Washington Superior Court Civil Rules 56";
          } else if (formData.jurisdiction === 'georgia') {
            deadlineDays = 15;
            ruleReference = "Georgia Uniform Superior Court Rule 6.2";
          } else if (formData.jurisdiction === 'massachusetts') {
            deadlineDays = 14;
            ruleReference = "Massachusetts Superior Court Rule 9A";
          } else if (formData.jurisdiction === 'michigan') {
            deadlineDays = 14;
            ruleReference = "Michigan Court Rules 2.119";
          } else {
            deadlineDays = 14;
            ruleReference = "Default rule";
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
      deadlineDate = addBusinessDays(startDate, deadlineDays - (formData.includeFilingDate ? 1 : 0), formData.jurisdiction, courtClosures);
    }
    
    // Add additional days for service method if applicable
    if (formData.additionalDays > 0) {
      if (formData.customPeriodType === 'calendar' || formData.deadlineType === 'custom') {
        deadlineDate = addCalendarDays(deadlineDate, parseInt(formData.additionalDays, 10));
      } else {
        deadlineDate = addBusinessDays(deadlineDate, parseInt(formData.additionalDays, 10), formData.jurisdiction, courtClosures);
      }
    }
    
    // Adjust the deadline if it falls on a weekend or holiday
    let adjustmentInfo = { wasAdjusted: false, reason: null };
    if (formData.extendIfWeekendHoliday) {
      const adjustment = adjustDeadlineDate(deadlineDate, formData.jurisdiction, courtClosures);
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
      ruleReference: ruleReference
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
  
  // Print the calculation results
  const printResults = () => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Create the HTML content for printing
      let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${formData.documentTitle || "Legal Deadline Calculation"}</title>
          <style>
            body {
              font-family: Calibri, Arial, sans-serif;
              line-height: 1.5;
              margin: 1in;
              font-size: 12pt;
            }
            h1 {
              text-align: center;
              margin-bottom: 20px;
              color: #0069ff;
            }
            h2 {
              color: #4f46e5;
              margin-top: 20px;
              font-size: 16pt;
            }
            .section {
              margin-bottom: 20px;
            }
            .highlight {
              font-weight: bold;
              color: #0069ff;
              font-size: 16pt;
            }
            .note {
              padding: 10px;
              background-color: #fffbeb;
              border: 1px solid #fef3c7;
              border-radius: 4px;
              margin: 10px 0;
            }
            .disclaimer {
              font-size: 9pt;
              color: #666;
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
            }
            .logo {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <div style="font-size: 24pt; font-weight: bold; color: #0069ff;">terms.law</div>
          </div>
          
          <h1>LEGAL DEADLINE CALCULATION</h1>
          
          <div class="section">
            <strong>Jurisdiction:</strong> ${formData.jurisdiction === 'federal' ? 'Federal' : formData.jurisdiction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
      `;
      
      // Add court closures if any
      if (courtClosures.length > 0) {
        printContent += `
          <div class="section">
            <strong>Court Closure Dates:</strong>
            <ul>
        `;
        
        courtClosures.forEach(date => {
          const formattedDate = formatDate(new Date(date));
          printContent += `<li>${formattedDate}</li>`;
        });
        
        printContent += `
            </ul>
          </div>
        `;
      }
      
      // Add deadline type
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
        case 'summary_judgment':
          deadlineTypeText = "Summary Judgment Response";
          break;
        case 'post_judgment':
          deadlineTypeText = "Post-Judgment Motion";
          break;
        case 'pretrial':
          deadlineTypeText = "Pretrial Disclosure";
          break;
        case 'custom':
          deadlineTypeText = "Custom Deadline";
          break;
      }
      
      printContent += `
        <div class="section">
          <strong>Deadline Type:</strong> ${deadlineTypeText}
        </div>
        
        <table>
          <tr>
            <th>Filing Date</th>
            <td>${calculatedDeadline.formattedStartDate}</td>
          </tr>
          <tr>
            <th>Calculation Start</th>
            <td>${calculatedDeadline.formattedStartDate} (${formData.includeFilingDate ? 'including' : 'excluding'} filing date)</td>
          </tr>
          <tr>
            <th>Period</th>
            <td>${calculatedDeadline.days} ${calculatedDeadline.periodType === 'business' ? 'business' : 'calendar'} days</td>
          </tr>
      `;
      
      // Add service method and additional days
      if (formData.serviceMethod !== 'electronic' || formData.additionalDays > 0) {
        printContent += `
          <tr>
            <th>Service Method</th>
            <td>${formData.serviceMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
          </tr>
        `;
        
        if (formData.additionalDays > 0) {
          printContent += `
            <tr>
              <th>Additional Days for Service</th>
              <td>${formData.additionalDays}</td>
            </tr>
          `;
        }
      }
      
      // Add rule reference
      if (calculatedDeadline.ruleReference) {
        printContent += `
          <tr>
            <th>Legal Authority</th>
            <td>${calculatedDeadline.ruleReference}</td>
          </tr>
        `;
      }
      
      printContent += `
        </table>
        
        <h2>DEADLINE</h2>
        <div class="highlight">${calculatedDeadline.formattedDate}</div>
      `;
      
      // Add adjustment note
      if (calculatedDeadline.adjustment && calculatedDeadline.adjustment.wasAdjusted) {
        const originalDate = formatDate(calculatedDeadline.adjustment.originalDate);
        printContent += `
          <div class="note">
            <strong>Note:</strong> The original calculated date (${originalDate}) was adjusted because it fell on a ${calculatedDeadline.adjustment.reason}.
          </div>
        `;
      }
      
      // Add notes if any
      if (formData.notes) {
        printContent += `
          <h2>Additional Notes</h2>
          <div class="section">
            ${formData.notes.replace(/\n/g, '<br>')}
          </div>
        `;
      }
      
      // Add disclaimer and generation date
      printContent += `
        <div class="disclaimer">
          Disclaimer: This deadline calculation is provided for informational purposes only and should not be considered legal advice. 
          Legal deadlines can be complex and may vary based on specific court rules, local rules, and case circumstances. 
          Always verify deadlines with applicable rules and consult with a licensed attorney for legal advice.
          <br><br>
          Generated on: ${formatDate(new Date())}
        </div>
      `;
      
      // Close the HTML content
      printContent += `
        </body>
        </html>
      `;
      
      // Write the content to the new window and print
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Trigger print after the content is loaded
      printWindow.onload = function() {
        printWindow.print();
      };
      
    } catch (error) {
      console.error("Error in printResults:", error);
      alert("Error generating print view. Please try again.");
    }
  };
    
    // Calculation details
    text += `Filing Date: ${calculatedDeadline.formattedStartDate}\n`;
    text += `Calculation Start Date: ${calculatedDeadline.formattedStartDate}${formData.includeFilingDate ? ' (including filing date)' : ' (excludes filing date)'}\n\n`;
    
    // Period
    const periodType = calculatedDeadline.periodType === 'business' ? 'business days' : 'calendar days';
    text += `Period: ${calculatedDeadline.days} ${periodType}\n\n`;
    
    // Service method and additional days
    if (formData.serviceMethod !== 'electronic' || formData.additionalDays > 0) {
      text += `Service Method: ${formData.serviceMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
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
    
    // Jurisdiction
    text += `Jurisdiction: ${formData.jurisdiction === 'federal' ? 'Federal' : formData.jurisdiction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
    
    // Court closures
    if (courtClosures.length > 0) {
      text += "Court Closure Dates:\n";
      courtClosures.forEach(date => {
        const formattedDate = formatDate(new Date(date));
        text += `- ${formattedDate}\n`;
      });
      text += "\n";
    }
    
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
      case 'summary_judgment':
        deadlineTypeText = "Summary Judgment Response";
        break;
      case 'post_judgment':
        deadlineTypeText = "Post-Judgment Motion";
        break;
      case 'pretrial':
        deadlineTypeText = "Pretrial Disclosure";
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
    
    // Service method and additional days
    if (formData.serviceMethod !== 'electronic' || formData.additionalDays > 0) {
      text += `Service Method: ${formData.serviceMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
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
      jurisdiction: /Jurisdiction: (Federal|California|New York|Texas|Florida|Illinois|Pennsylvania|Washington|Georgia|Massachusetts|Michigan)/,
      filingDate: /Filing Date: [^\n]+/,
      deadlineType: /Deadline Type: [^\n]+/,
      period: /Period: \d+ (business|calendar) days/,
      legalAuthority: /Legal Authority: [^\n]+/,
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
                <option value="new_york">New York</option>
                <option value="texas">Texas</option>
                <option value="florida">Florida</option>
                <option value="illinois">Illinois</option>
                <option value="pennsylvania">Pennsylvania</option>
                <option value="washington">Washington</option>
                <option value="georgia">Georgia</option>
                <option value="massachusetts">Massachusetts</option>
                <option value="michigan">Michigan</option>
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
                <option value="summary_judgment">Summary Judgment</option>
                <option value="post_judgment">Post-Judgment Motion</option>
                <option value="pretrial">Pretrial Disclosure</option>
                <option value="custom">Custom Deadline</option>
              </select>
              <div className="form-info">Select the type of legal deadline you need to calculate.</div>
              
              {formData.deadlineType !== 'custom' && (
                <div className="form-group mt-4">
                  <p className="form-info" style={{padding: "10px", backgroundColor: "#f0f9ff", borderRadius: "4px", border: "1px solid #bae6fd"}}>
                    <strong>Legal Reference:</strong> {formData.jurisdiction === 'federal' ? 'Federal' : formData.jurisdiction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} courts require 
                    {' '}{formData.deadlineType === 'response' && 'a response to a complaint within '}
                    {formData.deadlineType === 'appeal' && 'filing an appeal within '}
                    {formData.deadlineType === 'discovery' && 'responding to discovery requests within '}
                    {formData.deadlineType === 'motion' && 'responding to motions within '}
                    <strong>
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'response' && '21 days'}
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'appeal' && '30 days'}
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'discovery' && '30 days'}
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'motion' && '14 days'}
                      
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'response' && '30 days'}
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'appeal' && '60 days'}
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'discovery' && '30 days'}
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'motion' && '16 days'}
                      
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'response' && '20 days'}
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'appeal' && '30 days'}
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'discovery' && '20 days'}
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'motion' && '8 days'}
                      
                      {formData.jurisdiction === 'texas' && formData.deadlineType === 'response' && '20 days'}
                      {formData.jurisdiction === 'texas' && formData.deadlineType === 'appeal' && '30 days'}
                      {formData.jurisdiction === 'texas' && formData.deadlineType === 'discovery' && '30 days'}
                      {formData.jurisdiction === 'texas' && formData.deadlineType === 'motion' && '7 days'}
                      
                      {formData.jurisdiction === 'florida' && formData.deadlineType === 'response' && '20 days'}
                      {formData.jurisdiction === 'florida' && formData.deadlineType === 'appeal' && '30 days'}
                      {formData.jurisdiction === 'florida' && formData.deadlineType === 'discovery' && '30 days'}
                      {formData.jurisdiction === 'florida' && formData.deadlineType === 'motion' && '5 days'}
                    </strong>
                    {' under '}
                    <strong>
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'response' && 'FRCP 12(a)(1)(A)'}
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'appeal' && 'FRAP 4(a)(1)(A)'}
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'discovery' && 'FRCP 33, 34, 36'}
                      {formData.jurisdiction === 'federal' && formData.deadlineType === 'motion' && 'FRCP 27(a)(4)'}
                      
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'response' && 'CCP 412.20(a)(3)'}
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'appeal' && 'CRC 8.104'}
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'discovery' && 'CCP 2030.260'}
                      {formData.jurisdiction === 'california' && formData.deadlineType === 'motion' && 'CRC 3.1300(a)'}
                      
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'response' && 'CPLR 3012(a)'}
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'appeal' && 'CPLR 5513'}
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'discovery' && 'CPLR 3133'}
                      {formData.jurisdiction === 'new_york' && formData.deadlineType === 'motion' && 'CPLR 2214(b)'}
                    </strong>.
                  </p>
                </div>
              )}
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
            
            <div className="form-group mt-4">
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
                <option value="overnight">Overnight Delivery</option>
                <option value="fax">Fax Service</option>
              </select>
              <div className="form-info">Select the method of service, which may affect deadline extensions in some jurisdictions.</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="additionalDays">Additional Days</label>
              <input 
                type="number" 
                id="additionalDays"
                name="additionalDays"
                className="form-control"
                value={formData.additionalDays}
                onChange={handleChange}
                min="0"
                max="30"
              />
              <div className="form-info">
                Add extra days to the deadline (e.g., for mail service: 3 days in Federal Court per FRCP 6(d), 
                5 days in California per CCP 1013). Common extensions:
                {formData.jurisdiction === 'federal' && (
                  <span> Federal courts add 3 days for mail service under FRCP 6(d).</span>
                )}
                {formData.jurisdiction === 'california' && (
                  <span> California courts add 5 days for mail service under CCP 1013.</span>
                )}
              </div>
            </div>
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
              <h3 className="form-subtitle" style={{fontSize: "16px"}}>Court Closures/Emergency Situations</h3>
              <p className="form-description">Add dates when courts are closed due to emergencies, natural disasters, or other special circumstances.</p>
              
              <div className="closure-dates">
                {courtClosures.map((date, index) => (
                  <div key={index} className="closure-date-item">
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => {
                        const updatedClosures = [...courtClosures];
                        updatedClosures[index] = e.target.value;
                        setCourtClosures(updatedClosures);
                        setLastChanged('courtClosures');
                      }}
                      className="form-control"
                      style={{display: "inline-block", width: "auto", marginRight: "10px"}}
                    />
                    <button 
                      type="button"
                      onClick={() => removeCourtClosure(index)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                type="button"
                onClick={addCourtClosure}
                style={{
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  marginTop: "10px",
                  cursor: "pointer"
                }}
              >
                Add Court Closure Date
              </button>
              
              {courtClosures.length > 0 && (
                <div className="form-info" style={{marginTop: "10px"}}>
                  Court closure dates will be treated as holidays, and deadlines will be extended if they fall on these dates.
                </div>
              )}
            </div>
            
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
        
        {/* Tab 3: Rules Reference */}
        {currentTab === 2 && (
          <div className="tab-content">
            <h2 className="form-subtitle">Rules Reference</h2>
            <p className="form-description">This chart provides a reference of the standard deadlines for different jurisdictions and types of legal filings.</p>
            
            <div style={{overflowX: "auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px"}}>
                <thead>
                  <tr style={{backgroundColor: "#f3f4f6"}}>
                    <th style={{padding: "8px", border: "1px solid #ddd", textAlign: "left"}}>Jurisdiction</th>
                    <th style={{padding: "8px", border: "1px solid #ddd", textAlign: "left"}}>Response to Complaint</th>
                    <th style={{padding: "8px", border: "1px solid #ddd", textAlign: "left"}}>Appeal</th>
                    <th style={{padding: "8px", border: "1px solid #ddd", textAlign: "left"}}>Discovery</th>
                    <th style={{padding: "8px", border: "1px solid #ddd", textAlign: "left"}}>Motion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}><strong>Federal</strong></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>21 days<br/><small>FRCP 12(a)(1)(A)</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>FRAP 4(a)(1)(A)</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>FRCP 33, 34, 36</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>14 days<br/><small>FRCP 27(a)(4)</small></td>
                  </tr>
                  <tr style={{backgroundColor: "#f9fafb"}}>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}><strong>California</strong></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>CCP 412.20(a)(3)</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>60 days<br/><small>CRC 8.104</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>CCP 2030.260</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>16 days<br/><small>CRC 3.1300(a)</small></td>
                  </tr>
                  <tr>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}><strong>New York</strong></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>20 days<br/><small>CPLR 3012(a)</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>CPLR 5513</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>20 days<br/><small>CPLR 3133</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>8 days<br/><small>CPLR 2214(b)</small></td>
                  </tr>
                  <tr style={{backgroundColor: "#f9fafb"}}>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}><strong>Texas</strong></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>20 days<br/><small>TRCP 99(b)</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>TRAP 26.1</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>TRCP 196.2</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>7 days<br/><small>TRCP 21</small></td>
                  </tr>
                  <tr>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}><strong>Florida</strong></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>20 days<br/><small>FRCP 1.140(a)</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>FRAP 9.110(b)</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>FRCP 1.340</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>5 days<br/><small>FRCP 1.500</small></td>
                  </tr>
                  <tr style={{backgroundColor: "#f9fafb"}}>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}><strong>Illinois</strong></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>735 ILCS 5/2-615</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>30 days<br/><small>IL SCR 303</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>28 days<br/><small>IL SCR 213</small></td>
                    <td style={{padding: "8px", border: "1px solid #ddd"}}>14 days<br/><small>735 ILCS 5/2-1301</small></td>
                  </tr>
                  <tr>
                    <td style={{padding: "8px", border: "1px solid #ddd"}} colSpan="5">
                      <em style={{fontSize: "12px"}}>Note: This chart is provided for informational purposes only and should not be considered legal advice. Always verify deadlines with applicable rules and consult with a licensed attorney for legal advice.</em>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <h3 className="form-subtitle" style={{fontSize: "16px"}}>Holiday Considerations</h3>
              <p className="form-description">Most jurisdictions extend deadlines that fall on weekends or court holidays to the next business day. The calculator automatically applies this rule when the "Extend Deadline" option is checked.</p>
            </div>
            
            <div className="mt-4">
              <h3 className="form-subtitle" style={{fontSize: "16px"}}>Counting Methods</h3>
              <p className="form-description"><strong>Business Days:</strong> Counts only Monday through Friday, excluding court holidays.</p>
              <p className="form-description"><strong>Calendar Days:</strong> Counts all days including weekends and holidays.</p>
              <p className="form-description"><strong>Including Filing Date:</strong> Counts the filing date as day one of the deadline period.</p>
              <p className="form-description"><strong>Excluding Filing Date:</strong> Starts counting from the day after the filing date.</p>
            </div>
          </div>
        )}
        
        {/* Tab 4: Results */}
        {currentTab === 3 && (
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
                
                {(formData.serviceMethod !== 'electronic' || formData.additionalDays > 0) && (
                  <>
                    <p>
                      <strong>Service Method:</strong> {formData.serviceMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    {formData.additionalDays > 0 && (
                      <p>
                        <strong>Additional Days for Service:</strong> {formData.additionalDays}
                      </p>
                    )}
                  </>
                )}
                
                {calculatedDeadline.ruleReference && (
                  <p>
                    <strong>Legal Authority:</strong> {calculatedDeadline.ruleReference}
                  </p>
                )}
                
                <div className="deadline-date">
                  Deadline: {calculatedDeadline.formattedDate}
                </div>
                
                {calculatedDeadline.ruleReference && calculatedDeadline.ruleReference !== "Custom deadline" && (
                  <div className="mt-4">
                    <p><strong>Legal Authority:</strong> {calculatedDeadline.ruleReference}</p>
                    {formData.deadlineType === 'response' && (
                      <p className="form-info">This deadline represents the time allowed to respond to a complaint or petition in {formData.jurisdiction === 'federal' ? 'Federal' : formData.jurisdiction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} courts. Failure to respond within this timeframe may result in a default judgment.</p>
                    )}
                    {formData.deadlineType === 'appeal' && (
                      <p className="form-info">This deadline represents the time allowed to file an appeal in {formData.jurisdiction === 'federal' ? 'Federal' : formData.jurisdiction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} courts. Missing this deadline typically means losing the right to appeal.</p>
                    )}
                    {formData.deadlineType === 'discovery' && (
                      <p className="form-info">This deadline represents the time allowed to respond to discovery requests in {formData.jurisdiction === 'federal' ? 'Federal' : formData.jurisdiction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} courts. Failure to respond may result in court sanctions.</p>
                    )}
                    {formData.deadlineType === 'motion' && (
                      <p className="form-info">This deadline represents the time allowed to respond to a motion in {formData.jurisdiction === 'federal' ? 'Federal' : formData.jurisdiction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} courts. Missing this deadline may result in the motion being granted without opposition.</p>
                    )}
                  </div>
                )}
                
                {calculatedDeadline.adjustment && calculatedDeadline.adjustment.wasAdjusted && (
                  <div className="holiday-notice">
                    <strong>Note:</strong> The original calculated date ({formatDate(calculatedDeadline.adjustment.originalDate)}) was adjusted because it fell on a {calculatedDeadline.adjustment.reason}.
                  </div>
                )}
                
                {/* Calendar visualization */}
                <div className="calendar-view mt-4">
                  <h4 className="form-subtitle" style={{fontSize: "16px"}}>Calendar View</h4>
                  <div className="calendar-visualization">
                    {(() => {
                      // Generate calendar visualization
                      const startDate = new Date(formData.filingDate);
                      const endDate = calculatedDeadline.date;
                      const days = [];
                      
                      // Get date range from filing date to deadline (up to 30 days max)
                      const currentDate = new Date(startDate);
                      const maxDays = 30;
                      let dayCount = 0;
                      
                      while (currentDate <= endDate && dayCount < maxDays) {
                        const dateString = currentDate.toISOString().split('T')[0];
                        const isWeekendDay = isWeekend(currentDate);
                        const isHolidayDay = isHoliday(dateString, formData.jurisdiction);
                        const isCourtClosureDay = courtClosures.includes(dateString);
                        const isDeadlineDay = currentDate.getTime() === endDate.getTime();
                        const isStartDay = currentDate.getTime() === startDate.getTime();
                        
                        let dayStatus = "";
                        if (isDeadlineDay) {
                          dayStatus = "deadline";
                        } else if (isWeekendDay) {
                          dayStatus = "weekend";
                        } else if (isHolidayDay || isCourtClosureDay) {
                          dayStatus = "holiday";
                        }
                        
                        days.push({
                          date: new Date(currentDate),
                          status: dayStatus,
                          isStart: isStartDay
                        });
                        
                        currentDate.setDate(currentDate.getDate() + 1);
                        dayCount++;
                      }
                      
                      // Display days in a compact format
                      return (
                        <div style={{margin: "10px 0"}}>
                          <div style={{display: "flex", flexWrap: "wrap", gap: "5px"}}>
                            {days.map((day, index) => (
                              <div 
                                key={index}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                  border: day.isStart ? "2px dashed #4f46e5" : "1px solid #ddd",
                                  borderRadius: "4px",
                                  backgroundColor: day.status === "deadline" ? "#dcfce7" : 
                                                  day.status === "weekend" ? "#f3f4f6" : 
                                                  day.status === "holiday" ? "#fee2e2" : "white",
                                  fontWeight: day.status === "deadline" || day.isStart ? "bold" : "normal"
                                }}
                              >
                                <div style={{fontSize: "12px"}}>{day.date.getDate()}</div>
                                <div style={{fontSize: "10px"}}>{['Su','Mo','Tu','We','Th','Fr','Sa'][day.date.getDay()]}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{display: "flex", gap: "15px", marginTop: "10px", fontSize: "12px"}}>
                            <div><span style={{display: "inline-block", width: "10px", height: "10px", backgroundColor: "#f3f4f6", border: "1px solid #ddd", marginRight: "5px"}}></span> Weekend</div>
                            <div><span style={{display: "inline-block", width: "10px", height: "10px", backgroundColor: "#fee2e2", border: "1px solid #ddd", marginRight: "5px"}}></span> Holiday/Court Closure</div>
                            <div><span style={{display: "inline-block", width: "10px", height: "10px", backgroundColor: "#dcfce7", border: "1px solid #ddd", marginRight: "5px"}}></span> Deadline</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
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
            onClick={printResults}
            className="nav-button"
            style={{
              backgroundColor: "#0069ff", 
              color: "white",
              border: "none"
            }}
          >
            <i data-feather="printer"></i>
            Print
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
