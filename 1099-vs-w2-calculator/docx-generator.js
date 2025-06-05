window.generateWordDoc = function(documentText, formData) {
  try {
    console.log("Starting Word document generation...");
    
    // Extract comparison data directly from document text
    const lines = documentText.split('\n');
    let comparisonData = [];
    let inTable = false;
    
    // Parse table data
    lines.forEach(line => {
      line = line.trim();
      if (line.includes('SIDE-BY-SIDE COMPARISON')) {
        inTable = true;
      } else if (line.includes('=======') && inTable) {
        inTable = false;
      } else if (inTable && line.includes('|') && !line.includes('SIDE-BY-SIDE')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p && p !== '');
        if (parts.length === 3) {
          comparisonData.push({
            component: parts[0],
            w2: parts[1],
            contractor: parts[2]
          });
        }
      }
    });
    
    // Create HTML content with proper table structure
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${formData.documentTitle || "1099 vs W-2 Tax Comparison"}</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.4;
    margin: 0.5in;
    color: #333;
  }
  h1 {
    text-align: center;
    font-size: 16pt;
    margin-bottom: 20pt;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10pt;
  }
  h2 {
    font-size: 14pt;
    margin-top: 16pt;
    margin-bottom: 8pt;
    color: #2c3e50;
  }
  h3 {
    font-size: 12pt;
    margin-top: 12pt;
    margin-bottom: 6pt;
    color: #34495e;
  }
  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20pt 0;
    border: 2px solid #2c3e50;
  }
  .comparison-table th {
    background-color: #3498db;
    color: white;
    font-weight: bold;
    padding: 12pt 8pt;
    text-align: center;
    border: 1px solid #2980b9;
  }
  .comparison-table td {
    padding: 8pt;
    border: 1px solid #bdc3c7;
    text-align: center;
  }
  .comparison-table td:first-child {
    text-align: left;
    font-weight: bold;
  }
  .comparison-table tr:nth-child(even) {
    background-color: #f8f9fa;
  }
  .comparison-table tr:nth-child(odd) {
    background-color: white;
  }
  .w2-column {
    background-color: #fff3cd !important;
  }
  .contractor-column {
    background-color: #d1ecf1 !important;
  }
  .net-income-row {
    font-weight: bold;
    background-color: #d4edda !important;
  }
  .summary-section {
    background-color: #f8f9fa;
    padding: 15pt;
    border-left: 4px solid #3498db;
    margin: 15pt 0;
  }
  .detail-section {
    margin: 15pt 0;
    padding: 10pt;
    border: 1px solid #e9ecef;
    border-radius: 5pt;
  }
  ul {
    margin: 8pt 0;
    padding-left: 20pt;
  }
  li {
    margin: 4pt 0;
  }
</style>
</head>
<body>
`;

    // Add title
    htmlContent += '<h1>1099 vs W-2 Tax Comparison Analysis</h1>';
    
    // Add basic information section
    htmlContent += '<div class="summary-section">';
    htmlContent += '<h3>Basic Information</h3>';
    
    // Parse basic info from document
    lines.forEach(line => {
      if (line.includes('Tax Year:') || line.includes('Filing Status:') || 
          line.includes('State:') || line.includes('Dependents:') || 
          line.includes('Annual Income:') || line.includes('Working Days:') || 
          line.includes('Total Working Hours:') || line.includes('Effective Hourly Rate:')) {
        const parts = line.split(':');
        if (parts.length === 2) {
          htmlContent += `<p><strong>${parts[0].trim()}:</strong> ${parts[1].trim()}</p>`;
        }
      }
    });
    htmlContent += '</div>';
    
    // Add comparison table
    htmlContent += '<h2>Tax Comparison Results</h2>';
    htmlContent += '<table class="comparison-table">';
    htmlContent += '<thead>';
    htmlContent += '<tr>';
    htmlContent += '<th>Component</th>';
    htmlContent += '<th class="w2-column">W-2 Employee</th>';
    htmlContent += '<th class="contractor-column">1099 Contractor</th>';
    htmlContent += '</tr>';
    htmlContent += '</thead>';
    htmlContent += '<tbody>';
    
    // Add table rows
    comparisonData.forEach(row => {
      const isNetIncome = row.component.includes('NET INCOME');
      const rowClass = isNetIncome ? ' class="net-income-row"' : '';
      const w2Class = isNetIncome ? '' : ' class="w2-column"';
      const contractorClass = isNetIncome ? '' : ' class="contractor-column"';
      
      htmlContent += `<tr${rowClass}>`;
      htmlContent += `<td>${row.component}</td>`;
      htmlContent += `<td${w2Class}>${row.w2}</td>`;
      htmlContent += `<td${contractorClass}>${row.contractor}</td>`;
      htmlContent += '</tr>';
    });
    
    htmlContent += '</tbody>';
    htmlContent += '</table>';
    // Parse the document text and create structured HTML
    const lines = documentText.split('\n');
    let inTable = false;
    
    lines.forEach(line => {
      line = line.trim();
      
      // Handle main title
      if (line.includes('TAX COMPARISON ANALYSIS')) {
        htmlContent += `<h1>${line}</h1>`;
      }
      // Handle table section
      else if (line.includes('SIDE-BY-SIDE COMPARISON')) {
        inTable = true;
        htmlContent += '<h2>Tax Comparison Results</h2>';
        // Create the actual comparison table with data
        htmlContent += `
<table class="comparison-table">
<thead>
<tr>
<th>Component</th>
<th class="w2-column">W-2 Employee</th>
<th class="contractor-column">1099 Contractor</th>
</tr>
</thead>
<tbody>`;
      }
      else if (line.includes('=======') && inTable) {
        // End of table - close it
        inTable = false;
        htmlContent += '</tbody></table>';
      }
      else if (inTable && line.includes('|') && !line.includes('Component') && !line.includes('-------')) {
        // Parse table row data
        const parts = line.split('|').map(p => p.trim()).filter(p => p && p !== '');
        if (parts.length >= 3) {
          const component = parts[0];
          const w2Value = parts[1];
          const contractorValue = parts[2];
          
          const rowClass = component.includes('NET INCOME') ? ' class="net-income-row"' : '';
          const w2Class = component.includes('NET INCOME') ? '' : ' class="w2-column"';
          const contractorClass = component.includes('NET INCOME') ? '' : ' class="contractor-column"';
          
          htmlContent += `<tr${rowClass}>`;
          htmlContent += `<td><strong>${component}</strong></td>`;
          htmlContent += `<td${w2Class}>${w2Value}</td>`;
          htmlContent += `<td${contractorClass}>${contractorValue}</td>`;
          htmlContent += '</tr>';
        }
      }
      // Handle section headers
      else if (line.includes('DETAILS:') || line.includes('SUMMARY:') || line.includes('CONSIDERATIONS:')) {
        htmlContent += `<h2>${line}</h2>`;
      }
      // Handle subsections
      else if (line.includes('Basic Information:') || line.includes('Work Schedule Analysis:')) {
        htmlContent += `<div class="summary-section"><h3>${line}</h3>`;
      }
      else if (line.includes('W-2 EMPLOYEE DETAILS:') || line.includes('1099 CONTRACTOR DETAILS:')) {
        htmlContent += `</div><div class="detail-section"><h3>${line}</h3>`;
      }
      else if (line.includes('FINANCIAL IMPACT SUMMARY:')) {
        htmlContent += `</div><div class="summary-section"><h3>${line}</h3>`;
      }
      // Handle bullet points
      else if (line.startsWith('•')) {
        if (!htmlContent.includes('<ul>') || htmlContent.lastIndexOf('</ul>') > htmlContent.lastIndexOf('<ul>')) {
          htmlContent += '<ul>';
        }
        htmlContent += `<li>${line.substring(1).trim()}</li>`;
      }
      // Handle regular lines with key-value pairs
      else if (line && !line.includes('Generated by') && !line.includes('=====')) {
        // Close any open ul tags
        if (htmlContent.includes('<ul>') && htmlContent.lastIndexOf('<ul>') > htmlContent.lastIndexOf('</ul>')) {
          htmlContent += '</ul>';
        }
        
        // Handle key-value pairs
        if (line.includes(':') && !line.includes('DETAILS') && !line.includes('SUMMARY') && !line.includes('CONSIDERATIONS')) {
          const parts = line.split(':');
          if (parts.length === 2) {
            htmlContent += `<p><strong>${parts[0].trim()}:</strong> ${parts[1].trim()}</p>`;
          } else {
            htmlContent += `<p>${line}</p>`;
          }
        } else if (line && line.length > 0) {
          htmlContent += `<p>${line}</p>`;
        }
      }
    });
    
    // Close any remaining open tags
    if (htmlContent.includes('<ul>') && htmlContent.lastIndexOf('<ul>') > htmlContent.lastIndexOf('</ul>')) {
      htmlContent += '</ul>';
    }
    if (htmlContent.includes('<div class="detail-section">') && !htmlContent.includes('</div>')) {
      htmlContent += '</div>';
    }
    
    // Add footer
    htmlContent += `<div class="summary-section">
      <p><em>Generated by terms.law Tax Calculator on ${new Date().toLocaleDateString()}</em></p>
      <p><strong>Disclaimer:</strong> This analysis is for educational purposes only. Consult a qualified tax professional for personalized advice.</p>
    </div>`;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || '1099-vs-W2-Tax-Comparison'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};    
    // Add details sections
    let inDetails = false;
    let currentSection = '';
    
    lines.forEach(line => {
      line = line.trim();
      
      if (line.includes('W-2 EMPLOYEE DETAILS:')) {
        htmlContent += '<div class="detail-section">';
        htmlContent += '<h3>W-2 Employee Details</h3>';
        htmlContent += '<ul>';
        currentSection = 'w2';
        inDetails = true;
      } else if (line.includes('1099 CONTRACTOR DETAILS:')) {
        if (currentSection === 'w2') htmlContent += '</ul></div>';
        htmlContent += '<div class="detail-section">';
        htmlContent += '<h3>1099 Contractor Details</h3>';
        htmlContent += '<ul>';
        currentSection = '1099';
        inDetails = true;
      } else if (line.includes('FINANCIAL IMPACT SUMMARY:')) {
        if (inDetails) htmlContent += '</ul></div>';
        htmlContent += '<div class="summary-section">';
        htmlContent += '<h3>Financial Impact Summary</h3>';
        currentSection = 'summary';
        inDetails = false;
      } else if (line.includes('IMPORTANT CONSIDERATIONS:')) {
        if (currentSection === 'summary') htmlContent += '</div>';
        htmlContent += '<div class="detail-section">';
        htmlContent += '<h3>Important Considerations</h3>';
        htmlContent += '<ul>';
        currentSection = 'considerations';
        inDetails = true;
      } else if (line.startsWith('•') && inDetails) {
        htmlContent += `<li>${line.substring(1).trim()}</li>`;
      } else if (line.includes(':') && !line.includes('Generated by') && currentSection === 'summary') {
        const parts = line.split(':');
        if (parts.length === 2) {
          htmlContent += `<p><strong>${parts[0].trim()}:</strong> ${parts[1].trim()}</p>`;
        }
      } else if (line.includes('-') && inDetails && currentSection !== 'considerations') {
        htmlContent += `<li>${line.substring(1).trim()}</li>`;
      }
    });
    
    // Close any remaining open tags
    if (inDetails) {
      htmlContent += '</ul></div>';
    } else if (currentSection === 'summary') {
      htmlContent += '</div>';
    }
    
    // Add footer
    htmlContent += `<div class="summary-section">
      <p><em>Generated by terms.law Tax Calculator on ${new Date().toLocaleDateString()}</em></p>
      <p><strong>Disclaimer:</strong> This analysis is for educational purposes only. Consult a qualified tax professional for personalized advice.</p>
    </div>`;
    
    // Close HTML document
    htmlContent += '</body></html>';
    
    // Convert HTML to Blob
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.fileName || '1099-vs-W2-Tax-Comparison'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Document generated and download triggered");
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
};