// Diagnostic script to help identify React rendering issues
console.log("Diagnostic script loaded");

// Set up global error handler to catch and log React errors
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  document.getElementById('root').innerHTML += `
    <div style="margin-top: 20px; padding: 10px; background-color: #ffebee; border-left: 4px solid #f44336; color: #b71c1c;">
      <strong>Error:</strong> ${event.error ? event.error.message : 'Unknown error'}
    </div>
  `;
});

// Check if required libraries are loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  // Check React
  if (typeof React === 'undefined') {
    console.error("React is not defined");
    logError("React library failed to load");
  } else {
    console.log("React version:", React.version);
  }
  
  // Check ReactDOM
  if (typeof ReactDOM === 'undefined') {
    console.error("ReactDOM is not defined");
    logError("ReactDOM library failed to load");
  } else {
    console.log("ReactDOM available, createRoot method:", !!ReactDOM.createRoot);
  }
  
  // Check Babel
  if (typeof Babel === 'undefined') {
    console.error("Babel is not defined");
    logError("Babel library failed to load");
  } else {
    console.log("Babel is available");
  }
  
  // Check if root element exists
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element not found");
    logError("HTML root element is missing");
  } else {
    console.log("Root element found");
  }
  
  // Check if App component exists
  setTimeout(function() {
    if (typeof App === 'undefined') {
      console.error("App component is not defined");
      logError("App component is not defined. Check if california-employment-agreement.js is loading correctly.");
    } else {
      console.log("App component is defined");
    }
  }, 1000); // Give a second for scripts to load
});

// Helper function to display errors on page
function logError(message) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML += `
      <div style="margin-top: 10px; padding: 10px; background-color: #ffebee; border-left: 4px solid #f44336; color: #b71c1c;">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }
}